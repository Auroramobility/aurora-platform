import Link from "next/link";
import { redirect } from "next/navigation";

import { login } from "@/lib/auth/login";

export default function LoginPage() {
  async function handleLogin(formData: FormData) {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await login(email, password);

    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        action={handleLogin}
        className="flex w-full max-w-md flex-col gap-4 rounded-xl border p-6"
      >
        <h1 className="text-2xl font-semibold">Sign in to Aurora Mobility</h1>

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

        <button type="submit" className="rounded bg-black px-4 py-3 text-white">
          Sign In
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
