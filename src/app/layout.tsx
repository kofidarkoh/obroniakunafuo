import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://obroniakunafuo.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Obroni Akunafo Kuo — Restoring hope, dignity and love",
    template: "%s | Obroni Akunafo Kuo",
  },
  description:
    "Obroni Akunafo Kuo is a registered Ghanaian NGO supporting widows, orphans, persons with disabilities and the aged in the Ahafo Region through food relief, education, healthcare and empowerment.",
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
    siteName: "Obroni Akunafo Kuo",
    title: "Obroni Akunafo Kuo — Restoring hope, dignity and love",
    description:
      "A registered Ghanaian NGO restoring hope, dignity and love to vulnerable communities in the Ahafo Region.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Obroni Akunafo Kuo",
    description:
      "Restoring hope, dignity and love to vulnerable communities in Ghana.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
