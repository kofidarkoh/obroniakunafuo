import type { Metadata } from "next";
import { SuccessPanel } from "@/components/site/success-panel";
import { ButtonLink } from "@/components/ui/button";
import { formatDate, formatGhs } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Donation details recorded",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{
    ref?: string;
    name?: string;
    amount?: string;
    frequency?: string;
  }>;
};

export default async function DonateSuccessPage({ searchParams }: PageProps) {
  const { ref, name, amount, frequency } = await searchParams;
  const donor = name?.trim() || "friend";
  const value = Number(amount ?? 0);

  return (
    <SuccessPanel
      eyebrow="Donation details recorded"
      title={`Thank you, ${donor}.`}
      description="Your donation details have been recorded. Complete your bank transfer or mobile money payment using the reference below, and our team will confirm receipt. Every contribution directly supports our community programmes."
      rows={[
        { label: "Donor", value: donor },
        { label: "Amount", value: formatGhs(value || 250) },
        {
          label: "Frequency",
          value: frequency === "monthly" ? "Monthly pledge" : "One-time",
        },
        { label: "Reference", value: ref || "TXN-XXXXXXXX" },
        { label: "Date", value: formatDate(new Date()) },
      ]}
    >
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/donate" size="lg">
          View payment details
        </ButtonLink>
        <ButtonLink href="/" variant="outline" size="lg">
          Return to homepage
        </ButtonLink>
      </div>
    </SuccessPanel>
  );
}
