import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Heart } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/primitives";
import { getProgramme, listProgrammes } from "@/lib/data/content";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const programme = await getProgramme(slug);
  if (!programme) return { title: "Programme not found" };

  return {
    title: programme.title,
    description: programme.summary,
    openGraph: {
      title: programme.title,
      description: programme.summary,
      images: [{ url: programme.image }],
    },
  };
}

export default async function ProgrammeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const programme = await getProgramme(slug);

  if (!programme) notFound();

  const others = (await listProgrammes())
    .filter((item) => item.slug !== slug)
    .slice(0, 3);

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-line bg-paper">
        <div className="container-oak flex items-center gap-2 py-3 text-[11px] text-muted">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/programmes" className="hover:text-ink">
            Programmes
          </Link>
          <span aria-hidden="true">/</span>
          <span className="truncate text-ink">{programme.title}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-forest text-white">
        <div className="container-oak grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1.5 text-[10px] font-semibold text-ink">
              {programme.category}
            </span>
            <h1 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.06] tracking-[-0.03em]">
              {programme.title}
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/60">
              {programme.summary}
            </p>
            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/45">
              <span>{programme.meta}</span>
              <span aria-hidden="true">·</span>
              <span>Obroni Akunafo Kuo</span>
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/donate" size="lg">
                <Heart className="size-4" aria-hidden="true" />
                Support this programme
              </ButtonLink>
              <ButtonLink
                href="/contact"
                variant="outline-dark"
                size="lg"
                className="border-white/25"
              >
                Talk to our team
              </ButtonLink>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-forest-800">
            <Image
              src={programme.image}
              alt={programme.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Detail */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container-oak grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
          <article>
            <Eyebrow className="text-amber">About the programme</Eyebrow>
            <p className="mt-6 text-[14px] leading-[1.9] text-body">
              {programme.description}
            </p>

            {programme.bullets.length > 0 ? (
              <div className="mt-8">
                <h2 className="text-xl font-semibold tracking-tight text-ink">
                  What this programme provides
                </h2>
                <ul className="mt-5 space-y-3">
                  {programme.bullets.map((bullet: string) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-3 rounded-[8px] bg-paper p-4 text-[13px] leading-relaxed text-body"
                    >
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-mint text-moss">
                        <Check className="size-3" aria-hidden="true" />
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[12px] bg-paper p-6">
              <p className="text-[12px] font-semibold text-ink">
                Programme at a glance
              </p>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.12em] text-muted">
                    Focus area
                  </dt>
                  <dd className="mt-1 text-[13px] font-medium text-ink">
                    {programme.category}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.12em] text-muted">
                    Reach
                  </dt>
                  <dd className="mt-1 text-[13px] font-medium text-ink">
                    {programme.meta}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.12em] text-muted">
                    Delivered by
                  </dt>
                  <dd className="mt-1 text-[13px] font-medium text-ink">
                    Obroni Akunafo Kuo
                  </dd>
                </div>
              </dl>
              <Link
                href="/programmes"
                className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-medium text-ink hover:text-grass"
              >
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                All programmes
              </Link>
            </div>

            <div className="mt-4 rounded-[12px] bg-grass p-6 text-white">
              <p className="text-[14px] font-semibold">{programme.cta}</p>
              <p className="mt-2 text-[11px] leading-relaxed text-white/75">
                Every donation, volunteer hour and partnership directly
                supports the people behind this programme.
              </p>
              <ButtonLink
                href="/donate"
                variant="orange"
                size="sm"
                className="mt-4"
              >
                Donate now
              </ButtonLink>
            </div>
          </aside>
        </div>
      </section>

      {/* Other programmes */}
      {others.length > 0 ? (
        <section className="bg-white pb-14 sm:pb-16">
          <div className="container-oak">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold tracking-tight text-ink">
                Other programmes
              </h2>
              <Link
                href="/programmes"
                className="inline-flex items-center gap-1 text-[12px] font-medium text-ink hover:text-grass"
              >
                View all
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {others.map((item) => (
                <Link
                  key={item.slug}
                  href={`/programmes/${item.slug}`}
                  className="group overflow-hidden rounded-[10px] border border-line bg-white transition-colors hover:border-ink/20"
                >
                  <div className="relative aspect-[16/9] bg-mint">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-amber">
                      {item.category}
                    </p>
                    <h3 className="mt-1.5 text-[13.5px] font-semibold text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[11px] leading-relaxed text-muted">
                      {item.summary}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-grass group-hover:text-forest">
                      Learn more
                      <ArrowRight className="size-3" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
