import type { Metadata } from "next";
import Image from "next/image";
import { Heart } from "lucide-react";
import { DonateForm } from "@/components/forms/donate-form";
import { getSiteSettings } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Your support can restore hope and dignity. Donate once or monthly to Obroni Akunafo Kuo's food relief, healthcare, education and empowerment programmes.",
};

const chips = ["Widows", "Orphans", "Persons with Disabilities", "The Aged"];

export default async function DonatePage() {
  const settings = await getSiteSettings();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0B0122] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_18%_35%,rgba(99,48,211,0.22),transparent_65%),radial-gradient(40%_60%_at_85%_20%,rgba(154,105,235,0.12),transparent_60%)]"
        />
        <div className="container-oak relative grid gap-12 py-14 sm:py-18 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet/40 bg-violet/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet">
              <Heart className="size-3" aria-hidden="true" />
              Make a difference today
            </span>

            <h1 className="display-1 mt-6 max-w-xl">
              Your support can{" "}
              <span className="block text-violet">restore hope</span> and
              dignity
            </h1>

            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/55 sm:text-base">
              Donations help provide food relief, healthcare, education support
              and empowerment programmes for the most vulnerable members of our
              communities.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/15 px-3.5 py-1.5 text-[11px] text-white/60"
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[10.5px] text-white/40">
              {[
                "Founded 2016",
                "800–1,000 beneficiaries",
                "Audited annually",
                "Non-partisan & non-discriminatory",
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <span className="size-1 rounded-full bg-violet" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-md rounded-[20px] bg-[#1A1625] p-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-ink">
              <Image
                src="/images/programmes/widows.jpg"
                alt="A community member receiving support from Obroni Akunafo Kuo"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <div className="flex items-center justify-center gap-1.5 py-3">
              <span className="size-1.5 rounded-full bg-violet" />
              <span className="size-1.5 rounded-full bg-white/20" />
              <span className="size-1.5 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </section>

      <DonateForm
        payment={{
          momoNumber: settings.momoNumber,
          momoName: settings.momoName,
          bankName: settings.bankName,
          bankAccountName: settings.bankAccountName,
          bankAccountNumber: settings.bankAccountNumber,
        }}
      />
    </>
  );
}
