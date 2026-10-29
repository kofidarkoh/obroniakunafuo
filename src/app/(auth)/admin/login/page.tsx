import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Check, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/site/logo";
import { getAdminSession, mockAuthAllowed } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<{ next?: string }> };

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  const { next } = await searchParams;

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-forest p-12 text-white lg:flex">
        <div
          aria-hidden="true"
          className="absolute -right-24 top-1/4 size-96 rounded-full bg-lime/[0.06]"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -left-20 size-[28rem] rounded-full bg-black/20"
        />

        <Logo />

        <div className="relative max-w-md">
          <p className="eyebrow text-grass">Administration</p>
          <h1 className="mt-5 text-[42px] font-semibold leading-[1.05] tracking-[-0.035em]">
            Stewardship, with{" "}
            <span className="text-lime">accountability</span>.
          </h1>
          <p className="mt-5 text-[14px] leading-relaxed text-white/55">
            Review donations, respond to enquiries and keep the public site up
            to date. Access is restricted to authorised staff accounts.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              "Confirm manual donations and references",
              "Review volunteer and partnership enquiries",
              "Publish stories and programme updates",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-[12px] text-white/65"
              >
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-grass text-white">
                  <Check className="size-2.5" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[10px] text-white/35">
          Obroni Akunafo Kuo · Reg. CG024292019 · Mim, Ahafo Region
        </p>
      </div>

      <div className="flex flex-col justify-center px-5 py-12 sm:px-10">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden">
            <Logo tone="dark" />
          </div>

          <div className="mt-8 flex size-10 items-center justify-center rounded-[10px] bg-mint text-moss lg:mt-0">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
            Sign in to admin
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
            This area is restricted to authorised Obroni Akunafo Kuo staff.
          </p>

          <div className="mt-7">
            <LoginForm next={next} />
          </div>

          {mockAuthAllowed() ? (
            <div className="mt-6 rounded-lg border border-amber/25 bg-amber/[0.06] px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber">
                Local development mode
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-body">
                Supabase is not configured. Use any email and the password{" "}
                <code className="rounded bg-white px-1 py-0.5 font-mono text-[10px] text-ink">
                  oak-admin
                </code>{" "}
                (override with <code className="font-mono">ADMIN_PASSWORD</code>
                ).
              </p>
            </div>
          ) : null}

          <p className="mt-8 text-[10px] leading-relaxed text-muted">
            Need access? Contact the organisation administrator. Public
            sign-up is disabled by design.
          </p>
        </div>
      </div>
    </div>
  );
}
