import Link from "next/link";
import { redirect } from "next/navigation";

import { login } from "@/lib/auth/login";
import { createClient } from "@/lib/supabase/server";

export default function LoginPage() {
  async function handleLogin(formData: FormData) {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await login(email, password);

    redirect("/dashboard");
  }

  async function handleGoogleLogin() {
    "use server";

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.url) {
      redirect(data.url);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        action={handleLogin}
        className="flex w-full max-w-md flex-col gap-4 rounded-xl border p-6"
      >
        <h1 className="text-2xl font-semibold">
          Sign in to Aurora Mobility
        </h1>

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
