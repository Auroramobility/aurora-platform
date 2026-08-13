import Link from "next/link";
import { redirect } from "next/navigation";

import { login } from "@/lib/auth/login";
import { createClient } from "@/lib/supabase/server";

const ERROR_MESSAGES: Record<string, string> = {
  auth_callback_failed: "We couldn't complete sign-in. Please try again.",
  account_deactivated:
    "This account has been deactivated. Contact support if you'd like to reactivate it.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  const { error: errorCode } = await searchParams;
  const errorMessage = errorCode
    ? (ERROR_MESSAGES[errorCode] ?? "Something went wrong. Please try again.")
    : null;

  async function handleLogin(formData: FormData) {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We couldn't sign you in. Check your email and password and try again.";

      redirect(`/login?error=${encodeURIComponent(message)}`);
    }

    redirect("/dashboard");
  }

  async function handleGoogleLogin() {
    "use server";

    const supabase = await createClient();

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.url) {
      redirect(data.url);
    }
  }

  // Server actions redirect with the raw error message when it's not one
  // of the known codes above (e.g. Supabase's own "Invalid login
  // credentials"), so unrecognized error params are shown as-is rather
  // than silently dropped.
  const displayError =
    errorMessage ?? (errorCode ? decodeURIComponent(errorCode) : null);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        action={handleLogin}
        className="flex w-full max-w-md flex-col gap-4 rounded-xl border p-6"
      >
        <h1 className="text-2xl font-semibold">
          Sign in to Aurora Mobility
        </h1>

        {displayError ? (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
          >
            {displayError}
          </p>
        ) : null}

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="rounded border p-3"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="rounded border p-3"
        />

        <button
          type="submit"
          className="rounded bg-black px-4 py-3 text-white"
        >
          Sign In
        </button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>

          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-sm text-muted-foreground">
              OR
            </span>
          </div>
        </div>

        <button
          type="submit"
          formAction={handleGoogleLogin}
          className="rounded border px-4 py-3 font-medium hover:bg-muted"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Create one
          </Link>
        </p>
      </form>
    </main>
  );
}
