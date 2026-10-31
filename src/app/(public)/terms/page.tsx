import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/primitives";
import { getSiteSettings } from "@/lib/data/content";
import { org } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "Terms governing use of the Obroni Akunafo Kuo website, donations and submissions.",
  alternates: { canonical: "/terms" },
};

const sections = [
  { id: "about", title: "About these terms" },
  { id: "using-the-site", title: "Using the site" },
  { id: "donations", title: "Donations" },
  { id: "submissions", title: "Form submissions" },
  { id: "content", title: "Content and intellectual property" },
  { id: "links", title: "Third-party links" },
  { id: "disclaimer", title: "Disclaimer" },
  { id: "liability", title: "Limitation of liability" },
  { id: "changes", title: "Changes" },
  { id: "law", title: "Governing law" },
  { id: "contact", title: "Contact" },
];

export default async function TermsPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <section className="border-b border-line bg-paper">
        <div className="container-oak py-14 sm:py-18">
          <Eyebrow>Legal</Eyebrow>
          <h1 className="display-1 mt-4 max-w-2xl">Terms of use</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-body">
            The terms that apply when you use this website, make a donation or
            submit information to Obroni Akunafo Kuo.
          </p>
          <p className="mt-4 text-[11px] text-muted">
            Last updated: 28 October 2026
          </p>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="container-oak grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
          <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
              On this page
            </p>
            <ul className="mt-3 space-y-1.5">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-[11.5px] text-muted transition-colors hover:text-grass"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-2xl space-y-8 text-[13.5px] leading-relaxed text-body">
            <section id="about" className="scroll-mt-24">
              <h2 className="text-lg font-medium text-ink">
                1. About these terms
              </h2>
              <p className="mt-2">
                This website is operated by Obroni Akunafo Kuo, a non-profit
                organisation registered in Ghana (registration number{" "}
                {org.regNo}). By using the site, you agree to these terms. If
                you do not agree, please do not use the site.
              </p>
            </section>

            <section id="using-the-site" className="scroll-mt-24">
              <h2 className="text-lg font-medium text-ink">
                2. Using the site
              </h2>
              <p className="mt-2">
                You may use the site for lawful purposes only. You must not
                attempt to gain unauthorised access to any part of the site,
                interfere with its operation, submit false or misleading
                information, or use it in a way that harms others.
              </p>
            </section>

            <section id="donations" className="scroll-mt-24">
              <h2 className="text-lg font-medium text-ink">3. Donations</h2>
              <p className="mt-2">
                Donations are made directly by bank transfer or mobile money
                using the details shown on the site. This website does not
                process card payments and does not itself collect or store
                payment credentials.
              </p>
              <p className="mt-2">
                A monthly gift selected on the site is a pledge and
                instruction to your bank or mobile money provider; it is not an
                automatic charge created by this website. Please confirm
                recurring arrangements with your provider.
              </p>
              <p className="mt-2">
                Donations are used to support our charitable programmes. We
                cannot guarantee that a gift will be applied to a specific
                programme or beneficiary, and donations are generally
                non-refundable once received, except where required by law or
                where a payment was made in error. Contact us promptly if you
                believe a payment was incorrect.
              </p>
            </section>

            <section id="submissions" className="scroll-mt-24">
              <h2 className="text-lg font-medium text-ink">
                4. Form submissions
              </h2>
              <p className="mt-2">
                Information you submit through our contact, volunteer,
                partnership or donation forms is handled as described in our{" "}
                <Link href="/privacy" className="font-medium text-grass">
                  privacy policy
                </Link>
                . Submitting a volunteer or partnership enquiry does not create
                a contract, guarantee a placement, or commit either party to an
                agreement.
              </p>
            </section>

            <section id="content" className="scroll-mt-24">
              <h2 className="text-lg font-medium text-ink">
                5. Content and intellectual property
              </h2>
              <p className="mt-2">
                The text, images, logos and other content on this site are owned
                by Obroni Akunafo Kuo or used with permission. You may share
                links and short quotations for non-commercial purposes with
                attribution. You may not reproduce, modify or use our content
                commercially without written permission.
              </p>
            </section>

            <section id="links" className="scroll-mt-24">
              <h2 className="text-lg font-medium text-ink">
                6. Third-party links
              </h2>
              <p className="mt-2">
                The site may link to third-party websites or services, including
                social media and payment providers. We do not control those
                sites and are not responsible for their content, terms or
                privacy practices.
              </p>
            </section>

            <section id="disclaimer" className="scroll-mt-24">
              <h2 className="text-lg font-medium text-ink">7. Disclaimer</h2>
              <p className="mt-2">
                The site is provided on an &ldquo;as is&rdquo; and &ldquo;as
                available&rdquo; basis. While we take care to keep information
                accurate and current, we do not warrant that the site will be
                uninterrupted, error-free, or that all content is complete or
                up to date. Programme information, statistics and documents may
                change.
              </p>
            </section>

            <section id="liability" className="scroll-mt-24">
              <h2 className="text-lg font-medium text-ink">
                8. Limitation of liability
              </h2>
              <p className="mt-2">
                To the extent permitted by law, Obroni Akunafo Kuo is not liable
                for indirect or consequential loss arising from use of the site,
                or for loss caused by events outside our reasonable control.
                Nothing in these terms limits liability that cannot lawfully be
                limited.
              </p>
            </section>

            <section id="changes" className="scroll-mt-24">
              <h2 className="text-lg font-medium text-ink">9. Changes</h2>
              <p className="mt-2">
                We may update these terms from time to time. The date at the top
                of this page shows when they were last changed. Continued use of
                the site after a change means you accept the updated terms.
              </p>
            </section>

            <section id="law" className="scroll-mt-24">
              <h2 className="text-lg font-medium text-ink">10. Governing law</h2>
              <p className="mt-2">
                These terms are governed by the laws of the Republic of Ghana,
                and any dispute will be subject to the jurisdiction of the
                courts of Ghana.
              </p>
            </section>

            <section id="contact" className="scroll-mt-24">
              <h2 className="text-lg font-medium text-ink">11. Contact</h2>
              <p className="mt-2">
                Questions about these terms can be sent to{" "}
                <a
                  href={`mailto:${settings.email}`}
                  className="font-medium text-grass underline decoration-grass/30 underline-offset-2"
                >
                  {settings.email}
                </a>{" "}
                or by phone on {settings.phonePrimary}. Our head office is at{" "}
                {settings.address}.
              </p>
            </section>

            <div className="border-t border-line pt-5 text-[11px] text-muted">
              These terms are provided as a working draft for the organisation
              and should be reviewed by a qualified legal adviser before
              publication.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
