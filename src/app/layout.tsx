import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { getSiteSettings } from "@/lib/data/content";
import { org } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://obroniakunafuo.org";

export async function generateMetadata(): Promise<Metadata> {
  let settings: Awaited<ReturnType<typeof getSiteSettings>> | null = null;
  try {
    settings = await getSiteSettings();
  } catch {
    settings = null;
  }

  const title =
    settings?.seoTitle?.trim() ||
    "Obroni Akunafo Kuo — Restoring hope, dignity and love";
  const description =
    settings?.seoDescription?.trim() ||
    "Obroni Akunafo Kuo is a registered Ghanaian NGO supporting widows, orphans, persons with disabilities and the aged in the Ahafo Region through food relief, education, healthcare and empowerment.";
  const ogImage = settings?.ogImage?.trim() || "/images/hero-community.jpg";
  const ogImageUrl = absoluteUrl(ogImage);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: "%s | Obroni Akunafo Kuo",
    },
    description,
    keywords: [
      "Obroni Akunafo Kuo",
      "OAK Ghana",
      "NGO Ahafo Region",
      "widows Ghana",
      "orphans Ghana",
      "persons with disabilities Ghana",
      "charity Ghana",
    ],
    openGraph: {
      type: "website",
      locale: "en_GH",
      url: siteUrl,
      siteName: org.name,
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    robots: { index: true, follow: true },
    manifest: "/manifest.json",
    icons: {
      icon: "/images/oak-logo.png",
      apple: "/images/oak-logo.png",
    },
    verification: settings?.googleSiteVerification?.trim()
      ? { google: settings.googleSiteVerification.trim() }
      : undefined,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings: Awaited<ReturnType<typeof getSiteSettings>> | null = null;
  try {
    settings = await getSiteSettings();
  } catch {
    settings = null;
  }

  const socials = [
    settings?.facebook,
    settings?.instagram,
    settings?.linkedin,
    settings?.whatsapp,
  ].filter((value): value is string => Boolean(value?.trim()));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NGO",
        name: org.name,
        url: siteUrl,
        logo: absoluteUrl("/images/oak-logo.png"),
        email: settings?.email || org.email,
        telephone: settings?.phonePrimary || org.phones[0],
        address: {
          "@type": "PostalAddress",
          streetAddress: settings?.address || org.addressFull,
          addressLocality: "Mim",
          addressRegion: "Ahafo Region",
          addressCountry: "GH",
        },
        sameAs: socials,
      },
      {
        "@type": "WebSite",
        name: org.name,
        url: siteUrl,
      },
    ],
  };

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ? (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        ) : null}
      </body>
    </html>
  );
}