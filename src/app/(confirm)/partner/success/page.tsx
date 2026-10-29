import type { Metadata } from "next";
import { SuccessPanel } from "@/components/site/success-panel";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Partnership enquiry received",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{
    org?: string;
    contact?: string;
    area?: string;
    type?: string;
    email?: string;
  }>;
};

export default async function PartnerSuccessPage({ searchParams }: PageProps) {
  const { org, contact, area, type, email } = await searchParams;

  return (
    <SuccessPanel
      variant="logo"
      eyebrow="Enquiry received"
      title="Your partnership enquiry has been received."
      description="We've received your partnership enquiry. Our team will review your information and contact you about the next steps within 3–5 working days."
      rows={[
        { label: "Organisation", value: org || "Your organisation" },
        { label: "Contact", value: contact || "Contact person" },
        { label: "Area of interest", value: area || "General/multiple areas" },
        { label: "Type", value: type || "Strategic partnership" },
        {
          label: "Status",
          value: <span className="text-grass">Under review</span>,
        },
      ]}
      note={
        email ? (
          <>
            We&apos;ll reply to{" "}
            <span className="font-medium text-ink">{email}</span>
          </>
        ) : (
          "We'll reply to the email address you provided"
        )
      }
    >
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/" size="lg">
          Return to homepage
        </ButtonLink>
        <ButtonLink href="/programmes" variant="outline" size="lg">
          Learn about our programmes
        </ButtonLink>
      </div>
    </SuccessPanel>
  );
}
