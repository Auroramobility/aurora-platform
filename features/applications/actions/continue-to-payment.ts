"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";
import { getOrCreateConversation } from "@/features/messaging/lib/get-conversations";

const READY_FOR_PAYMENT_MESSAGE = "I'm ready for payment";

export type ContinueToPaymentResult = {
  ok: boolean;
  error?: string;
};

export async function continueToPayment(
  applicationId: string,
): Promise<ContinueToPaymentResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      error: "Please sign in to continue.",
    };
  }

  if (!applicationId) {
    return {
      ok: false,
      error: "Application not found.",
    };
  }

  const allowed = await checkRateLimit({
    action: "continue_to_payment",
    maxHits: 10,
    windowSeconds: 60,
  });

  if (!allowed) {
    return {
      ok: false,
      error: RATE_LIMIT_MESSAGE,
    };
  }

  /*
   * Verify that this application belongs to the authenticated
   * customer and has actually been approved.
   *
   * IMPORTANT:
   * This action does NOT require an ownership plan.
   *
   * "Message Aurora" only starts the operational conversation
   * about arranging the customer's down payment.
   *
   * It does NOT:
   * - confirm payment
   * - record payment
   * - create payment state
   * - approve financing
   * - create or activate an ownership plan
   */
  const { data: application, error: applicationError } = await supabase
    .from("applications")
    .select("id, status")
    .eq("id", applicationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (applicationError) {
    return {
      ok: false,
      error: "Unable to verify your application.",
    };
  }

  if (!application) {
    return {
      ok: false,
      error: "Application not found.",
    };
  }

  if (application.status !== "approved") {
    return {
      ok: false,
      error: "This application is not ready for the next step.",
    };
  }

  /*
   * Open or reuse the Aurora conversation using the application
   * itself.
   *
   * An ownership plan is intentionally NOT required here.
   */
  let conversationId: string;

  try {
    conversationId = await getOrCreateConversation(applicationId);
  } catch {
    return {
      ok: false,
      error: "Unable to open your Aurora message thread.",
    };
  }

  if (!conversationId) {
    return {
      ok: false,
      error: "Unable to open your Aurora message thread.",
    };
  }

  /*
   * Keep the automatic intent message idempotent.
   *
   * Clicking "Message Aurora" repeatedly should not create
   * duplicate copies of:
   *
   * "I'm ready for payment"
   *
   * This message is only a customer request to begin the
   * payment-arrangement conversation. It is NOT payment
   * confirmation.
   */
  const { data: existingMessage, error: existingMessageError } = await supabase
    .from("messages")
    .select("id")
    .eq("conversation_id", conversationId)
    .eq("sender_user_id", user.id)
    .eq("sender_role", "customer")
    .eq("message", READY_FOR_PAYMENT_MESSAGE)
    .limit(1)
    .maybeSingle();

  if (existingMessageError) {
    return {
      ok: false,
      error: "Unable to verify your message request.",
    };
  }

  if (!existingMessage) {
    const { error: messageError } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_user_id: user.id,
      sender_role: "customer",
      message: READY_FOR_PAYMENT_MESSAGE,
    });

    if (messageError) {
      return {
        ok: false,
        error: "Aurora could not send your message request.",
      };
    }
  }

  /*
   * Send the customer into the existing Aurora conversation.
   *
   * The conversation is the communication channel only.
   * Any actual payment confirmation/state remains an
   * authorized Aurora admin/database operation.
   */
  redirect(`/messages?application=${applicationId}`);
}
