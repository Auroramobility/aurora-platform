import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that require a signed-in user. This mirrors the per-page checks
// (e.g. `if (!user) redirect("/login")`, `requireAdmin()`) that already
// exist on each of these pages/route groups — it does not replace them.
// Role-specific authorization (e.g. admin-only) still happens at the
// page/action level via requireAdmin(), which also checks the DB via
// RLS-respecting RPCs. This is a safety net so an unauthenticated
// request never reaches a protected page even if a future page is
// added and its own check is forgotten.
const PROTECTED_PREFIXES = [
  "/admin",
  "/dashboard",
  "/profile",
  "/applications",
  "/ownership",
  "/messages",
];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request,
  });

  type CookieToSet = {
    name: string;
    value: string;
    options?: Parameters<typeof response.cookies.set>[2];
  };

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh the user's auth session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtectedPath(request.nextUrl.pathname) && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
