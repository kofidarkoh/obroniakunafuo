import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const MOCK_COOKIE = "oak_admin_session";

function supabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Supabase mode: refresh the session cookie and gate on a real user.
  if (supabaseConfigured()) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (pathname === "/admin/login") {
      // Already signed in? Bounce to the admin home (or `next`).
      if (user) {
        const next = request.nextUrl.searchParams.get("next");
        const url = request.nextUrl.clone();
        url.pathname = next && next.startsWith("/admin") ? next : "/admin";
        url.search = "";
        return NextResponse.redirect(url);
      }
      return supabaseResponse;
    }

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }

  // Mock mode (local development only).
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const hasMockSession = Boolean(
    request.cookies.get(MOCK_COOKIE)?.value,
  );

  if (!hasMockSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};