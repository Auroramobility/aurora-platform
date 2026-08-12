import Link from "next/link";

type Props = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function CheckEmailPage({
  searchParams,
}: Props) {
  const { email } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 rounded-2xl border bg-card p-8 text-center">
        <div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-2xl">
            ✓
          </div>

          <h1 className="mt-5 text-2xl font-semibold">
            Check your email
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Your Aurora Mobility account has been created.
            We&apos;ve sent a verification email to:
          </p>

          {email ? (
            <p className="mt-3 break-words font-medium">
              {email}
            </p>
          ) : null}

          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Open that email and click the verification link to
            activate your account. Once verified, you can sign in
            to Aurora Mobility.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/login"
            className="block rounded-xl bg-black px-4 py-3 text-sm font-medium text-white"
          >
            Go to Sign In
          </Link>

          <Link
            href="/"
            className="block rounded-xl border px-4 py-3 text-sm font-medium hover:bg-muted"
          >
            Back to Aurora
          </Link>
        </div>
      </div>
    </main>
  );
}