"use client";

import { useActionState } from "react";
import { Loader2, Lock } from "lucide-react";
import { loginAction } from "@/app/admin-actions";
import { Field, Input } from "@/components/ui/form";
import type { FormState } from "@/lib/validation";

const initialState: FormState = { ok: false };

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next ?? "/admin"} />

      <Field label="Email address" htmlFor="adminEmail" required>
        <Input
          id="adminEmail"
          name="email"
          type="email"
          placeholder="admin@obroniakunafuo.org"
          autoComplete="username"
          required
        />
      </Field>

      <Field label="Password" htmlFor="adminPassword" required>
        <Input
          id="adminPassword"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </Field>

      {state.message ? (
        <p className="rounded-lg bg-coral/10 px-3 py-2 text-[12px] font-medium text-coral">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-grass text-sm font-semibold text-white transition-colors hover:bg-moss disabled:pointer-events-none disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Lock className="size-4" aria-hidden="true" />
        )}
        {pending ? "Signing in…" : "Sign in to admin"}
      </button>
    </form>
  );
}
