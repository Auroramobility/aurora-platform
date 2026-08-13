import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();

    const { data, error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("deactivated_at")
        .eq("user_id", data.user.id)
        .single();

      if (profile?.deactivated_at) {
        await supabase.auth.signOut();
        return NextResponse.redirect(
          new URL("/login?error=account_deactivated", requestUrl.origin),
        );
      }

      return NextResponse.redirect(
        new URL("/dashboard", requestUrl.origin),
      );
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=auth_callback_failed", requestUrl.origin),
  );
}