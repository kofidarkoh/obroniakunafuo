import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSupabaseServerClient,
  supabaseConfigured,
} from "@/lib/supabase/server";

const MOCK_COOKIE = "oak_admin_session";
const MOCK_PASSWORD = process.env.ADMIN_PASSWORD ?? "oak-admin";

export type AdminRole = "viewer" | "editor" | "admin";

export type AdminSession = { email: string; role: AdminRole };

const ROLE_RANK: Record<AdminRole, number> = {
  viewer: 0,
  editor: 1,
  admin: 2,
};

export function hasRole(session: AdminSession | null, minimum: AdminRole) {
  if (!session) return false;
  return ROLE_RANK[session.role] >= ROLE_RANK[minimum];
}

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
      const rawRole =
        (data.user.app_metadata as { role?: string } | undefined)?.role ??
        (data.user.user_metadata as { role?: string } | undefined)?.role;
      const role: AdminRole =
        rawRole === "viewer" || rawRole === "editor" || rawRole === "admin"
          ? rawRole
          : "admin";
      return { email: data.user.email ?? "admin", role };
    } catch {
      // Invalid or expired refresh token cookie — treat as no session.
      return null;
    }
  }

  if (!mockAuthAllowed()) return null;

  const jar = await cookies();
  const email = decodeSession(jar.get(MOCK_COOKIE)?.value);
  return email ? { email, role: "admin" } : null;
}

export async function requireAdmin(
  roles?: AdminRole | AdminRole[],
): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (roles) {
    const allowed = Array.isArray(roles) ? roles : [roles];
    if (!allowed.includes(session.role)) {
      redirect("/admin/login?error=forbidden");
    }
  }
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

/**
 * Sends a password-reset email via Supabase Auth. No-op (returns an error)
 * when Supabase is not configured.
 */
export async function requestPasswordReset(
  email: string,
): Promise<{ error?: string }> {
  if (!supabaseConfigured()) {
    return { error: "Password reset requires Supabase Auth." };
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/admin/login`,
  });
  if (error) return { error: error.message };
  return {};
}

/**
 * Updates the signed-in user's password. Requires an active session.
 */
export async function updatePassword(
  newPassword: string,
): Promise<{ error?: string }> {
  if (!supabaseConfigured()) {
    return { error: "Password updates require Supabase Auth." };
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };
  return {};
}

/**
 * Invites a new admin user by email with the given role. Requires the
 * service role key. Returns an error when Supabase is not configured.
 */
export async function inviteAdminUser(
  email: string,
  role: AdminRole = "viewer",
): Promise<{ error?: string }> {
  if (!supabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: "Inviting users requires Supabase service role key." };
  }
  const { createClient } = await import("@supabase/supabase-js");
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { role },
  });
  // Also store role in app_metadata via a follow-up is not possible with
  // inviteUserByEmail data alone; set it through the auth admin API.
  if (error) return { error: error.message };
  return {};
}
