import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSupabaseServerClient,
  supabaseConfigured,
} from "@/lib/supabase/server";

const MOCK_COOKIE = "oak_admin_session";
const MOCK_PASSWORD = process.env.ADMIN_PASSWORD ?? "oak-admin";

export type AdminSession = { email: string };

export function usingMockAuth() {
  return !supabaseConfigured();
}

/**
 * Password-based mock auth is a local-development convenience only. Production
 * builds must use Supabase so sessions are signed and verified server-side.
 */
export function mockAuthAllowed() {
  return usingMockAuth() && process.env.NODE_ENV !== "production";
}

function signature(email: string) {
  return createHmac("sha256", MOCK_PASSWORD).update(email).digest("base64url");
}

function encodeSession(email: string) {
  return `${email}.${signature(email)}`;
}

function decodeSession(raw: string | undefined): string | null {
  if (!raw) return null;
  const separator = raw.lastIndexOf(".");
  if (separator <= 0) return null;

  const email = raw.slice(0, separator);
  const received = raw.slice(separator + 1);
  const expected = signature(email);

  if (received.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(received), Buffer.from(expected))) {
    return null;
  }

  return email;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  if (supabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    try {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return null;
      return { email: data.user.email ?? "admin" };
    } catch {
      // Invalid or expired refresh token cookie — treat as no session.
      return null;
    }
  }

  if (!mockAuthAllowed()) return null;

  const jar = await cookies();
  const email = decodeSession(jar.get(MOCK_COOKIE)?.value);
  return email ? { email } : null;
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function signInAdmin(
  email: string,
  password: string,
): Promise<{ error?: string }> {
  if (supabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: "Invalid email or password." };
    return {};
  }

  if (!mockAuthAllowed()) {
    return {
      error:
        "Admin sign-in is not configured. Set Supabase credentials before deploying.",
    };
  }

  if (!email || password !== MOCK_PASSWORD) {
    return { error: "Invalid email or password." };
  }

  const jar = await cookies();
  jar.set(MOCK_COOKIE, encodeSession(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return {};
}

export async function signOutAdmin() {
  if (supabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  const jar = await cookies();
  jar.delete(MOCK_COOKIE);
}
