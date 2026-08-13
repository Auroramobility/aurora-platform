import Link from "next/link";
import { redirect } from "next/navigation";

import { Input } from "@/components/ui/input";
import { signup } from "@/lib/auth/signup";
import { createClient } from "@/lib/supabase/server";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  const { error: errorMessage } = await searchParams;

  async function handleSignup(formData: FormData) {
    "use server";

    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      const user = await signup(email, password, fullName);

      if (!user) {
        throw new Error("Unable to create your Aurora account.");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create your Aurora account. Please try again.";

      redirect(`/signup?error=${encodeURIComponent(message)}`);
    }

    redirect(`/signup/check-email?email=${encodeURIComponent(email)}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        action={handleSignup}
        className="flex w-full max-w-md flex-col gap-4 rounded-xl border p-6"
      >
        <h1 className="text-2xl font-semibold">
          Create your Aurora Mobility account
        </h1>

        {errorMessage ? (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
          >
            {decodeURIComponent(errorMessage)}
          </p>
        ) : null}

        <Input
          name="fullName"
          placeholder="Full name"
          required
        />

        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
        />

        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          minLength={8}
        />

        <button
          type="submit"
          className="rounded bg-black px-4 py-3 text-white"
        >
          Create Account
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
