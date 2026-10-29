import type { ReactNode } from "react";
import Image from "next/image";
import { Check, Mail } from "lucide-react";

export type SummaryRow = {
  label: string;
  value: ReactNode;
};

export function SuccessPanel({
  eyebrow,
  title,
  description,
  rows,
  variant = "check",
  note,
  children,
}: {
  eyebrow: string;
  title: string;
  description: ReactNode;
  rows: SummaryRow[];
  variant?: "check" | "logo";
  note?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[660px] px-5 py-14 text-center sm:py-18">
        {variant === "logo" ? (
          <Image
            src="/images/oak-logo.png"
            alt="Obroni Akunafo Kuo emblem"
            width={96}
            height={96}
            className="mx-auto size-24 rounded-full object-contain"
          />
        ) : (
          <div className="mx-auto flex size-[96px] items-center justify-center rounded-full bg-mint">
            <span className="flex size-[72px] items-center justify-center rounded-full border-2 border-grass/25 bg-mint">
              <Check
                className="size-9 text-grass"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            </span>
          </div>
        )}

        <p className="eyebrow mt-8 text-grass">{eyebrow}</p>
        <h1 className="mt-4 text-[30px] font-semibold tracking-[-0.02em] text-ink sm:text-[36px]">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[14px] leading-relaxed text-body">
          {description}
        </p>

        <dl className="mt-8 overflow-hidden rounded-[10px] border border-line bg-white text-left">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-6 border-b border-line/70 px-6 py-4 last:border-0"
            >
              <dt className="text-[12px] text-muted">{row.label}</dt>
              <dd className="flex items-center gap-1.5 text-right text-[12px] font-medium text-ink">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        {children ? <div className="mt-7">{children}</div> : null}

        {note ? (
          <p className="mt-5 flex items-center justify-center gap-2 text-[11px] text-muted">
            <Mail className="size-3.5" aria-hidden="true" />
            {note}
          </p>
        ) : null}
      </div>
    </section>
  );
}
