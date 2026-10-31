import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  MessageCircle,
  Quote,
  Users,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/primitives";
import {
  getMoreStories,
  getStory,
} from "@/lib/data/content";
import type { StoryBlock } from "@/lib/data/types";
import { formatDate, absoluteUrl } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) return { title: "Story not found" };

  return {
    title: story.title,
    description: story.excerpt,
    alternates: { canonical: `/stories/${slug}` },
    openGraph: {
      title: story.title,
      description: story.excerpt,
      images: [{ url: story.image }],
      type: "article",
      publishedTime: story.date,
    },
  };
}

const impact = [
  { value: "800–1,000", label: "Beneficiaries supported" },
  { value: "200+", label: "PWDs supported" },
  { value: "GHC 492,745", label: "Programme spending (10yr)" },
  { value: "2016", label: "Year founded" },
] as const;

export default async function StoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const story = await getStory(slug);

  if (!story) notFound();

  const moreStories = await getMoreStories(slug);
  const shareText = `${story.title} — ${absoluteUrl(`/stories/${story.slug}`)}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-line bg-paper">
        <div className="container-oak flex items-center gap-2 py-3 text-[11px] text-muted">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/stories" className="hover:text-ink">
            Stories
          </Link>
          <span aria-hidden="true">/</span>
          <span className="truncate text-ink">{story.title}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-forest text-white">
        <div className="container-oak grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1.5 text-[10px] font-semibold text-ink">
              {story.category} · {story.location}
            </span>
            <h1 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.06] tracking-[-0.03em]">
              {story.title}
            </h1>
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/50">
              <span>{formatDate(story.date)}</span>
              <span aria-hidden="true">·</span>
              <span>Obroni Akunafo Kuo</span>
              <span aria-hidden="true">·</span>
              <span>{story.readTime}</span>
            </p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-forest-800">
            <Image
              src={story.image}
              alt={story.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container-oak grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
          <article>
            <Eyebrow className="text-amber">The story</Eyebrow>

            <div className="mt-6 space-y-6">
              {story.blocks.map((block: StoryBlock, index: number) => {
                if (block.type === "h2") {
                  return (
                    <h2
                      key={index}
                      className="pt-2 text-xl font-semibold tracking-tight text-ink"
                    >
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "quote") {
                  return (
                    <blockquote
                      key={index}
                      className="rounded-[10px] border-l-[3px] border-grass bg-mint px-6 py-5 text-[14px] leading-relaxed text-ink"
                    >
                      &ldquo;{block.text}&rdquo;
                    </blockquote>
                  );
                }
                return (
                  <p
                    key={index}
                    className="text-[14px] leading-[1.9] text-body"
                  >
                    {block.text}
                  </p>
                );
              })}
            </div>
          </article>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[12px] bg-paper p-6">
              <p className="text-[12px] text-muted">Impact at a glance</p>
              <dl className="mt-4 space-y-4">
                {impact.map((item) => (
                  <div key={item.label}>
                    <dt className="text-xl font-semibold tracking-tight text-grass">
                      {item.value}
                    </dt>
                    <dd className="mt-0.5 text-[10.5px] text-muted">
                      {item.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-6">
              <p className="text-[12px] font-semibold text-ink">
                Share this story
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-muted">
                Help us spread the word about the work being done in the Ahafo
                Region.
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex h-11 items-center justify-center gap-2 rounded-[8px] bg-paper text-[12px] font-medium text-ink transition-colors hover:bg-mint"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Share on WhatsApp
              </a>
              <Link
                href="/stories"
                className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-ink hover:text-grass"
              >
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                Back to all stories
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Pull quote band */}
      <section className="bg-mint py-14 sm:py-16">
        <div className="container-oak text-center">
          <Quote className="mx-auto size-6 fill-amber text-amber" />
          <blockquote className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink sm:text-[21px]">
            &ldquo;{story.pullQuote.text}&rdquo;
          </blockquote>
          <p className="mt-5 text-[11px] text-muted">
            {story.pullQuote.attribution}
          </p>
        </div>
      </section>

      {/* Programmes mentioned */}
      <section className="bg-white py-14 sm:py-16">
        <div className="container-oak">
          <h2 className="text-xl font-semibold tracking-tight text-ink">
            Programmes mentioned in this story
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {story.programmes.map((programme: string) => (
              <div
                key={programme}
                className="rounded-[10px] border-t-2 border-grass bg-paper p-5"
              >
                <p className="text-[12px] font-semibold text-ink">
                  {programme}
                </p>
                <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
                  {programme === "Food & Relief"
                    ? "Regular food packages, clothing and essential supplies for widows and the aged."
                    : programme === "Education"
                      ? "School fees and learning materials for children in the care of widowed grandmothers."
                      : programme === "Healthcare"
                        ? "Free health screenings and mobile clinic visits across the Ahafo Region."
                        : programme === "Shelter"
                          ? "Basic repairs and shelter provision for widows living in unsafe conditions."
                          : "Direct support that helps every beneficiary live with dignity and independence."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-grass text-white">
        <div className="container-oak py-12 text-center sm:py-14">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Help us continue this work.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[13px] leading-relaxed text-white/80">
            Every donation, volunteer hour and partnership directly supports
            the people behind these stories.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/donate" variant="lime" size="lg">
              <Heart className="size-4" aria-hidden="true" />
              Donate now
            </ButtonLink>
            <ButtonLink
              href="/volunteer"
              variant="outline-dark"
              size="lg"
              className="border-transparent bg-[#3E7A46] hover:bg-[#356B3C]"
            >
              <Users className="size-4" aria-hidden="true" />
              Volunteer with us
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* More stories */}
      <section className="bg-white py-14 sm:py-16">
        <div className="container-oak">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              More stories
            </h2>
            <Link
              href="/stories"
              className="inline-flex items-center gap-1 text-[12px] font-medium text-ink hover:text-grass"
            >
              View all stories
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {moreStories.map((item) => (
              <article
                key={item.slug}
                className="overflow-hidden rounded-[10px] border border-line bg-white"
              >
                <div className="relative aspect-[16/9] bg-mint">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-amber">
                    {item.location}
                  </p>
                  <h3 className="mt-1.5 text-[13.5px] font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted">
                    {item.excerpt}
                  </p>
                  <Link
                    href={`/stories/${item.slug}`}
                    className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-grass hover:text-forest"
                  >
                    Read full story
                    <ArrowRight className="size-3" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
