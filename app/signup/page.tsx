import { Input } from "@/components/ui/input";
import { signup } from "@/lib/auth/signup";

export default function SignupPage() {
  async function handleSignup(formData: FormData) {
    "use server";

    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await signup(email, password, fullName);
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

        <Input name="fullName" placeholder="Full name" required />

        <Input name="email" type="email" placeholder="Email" required />

        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
        />

        <button type="submit" className="rounded bg-black px-4 py-3 text-white">
          Create Account
        </button>
      </form>
    </main>
  );
}
