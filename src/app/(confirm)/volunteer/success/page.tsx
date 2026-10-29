import type { Metadata } from "next";
import { SuccessPanel } from "@/components/site/success-panel";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Volunteer application received",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{
    name?: string;
    areas?: string;
    availability?: string;
    involvement?: string;
    email?: string;
  }>;
};

export default async function VolunteerSuccessPage({
  searchParams,
}: PageProps) {
  const { name, areas, availability, involvement, email } =
    await searchParams;
  const applicant = name?.trim() || "friend";
  const when = [availability, involvement].filter(Boolean).join(" — ");

  return (
    <SuccessPanel
      variant="logo"
      eyebrow="Application received"
      title={`Thank you for volunteering, ${applicant}`}
      description="We've received your application. Our team will review your information and contact you about the next steps and suitable opportunities."
      rows={[
        { label: "Applicant", value: applicant },
        { label: "Interest areas", value: areas || "Community outreach" },
        { label: "Availability", value: when || "Flexible" },
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
