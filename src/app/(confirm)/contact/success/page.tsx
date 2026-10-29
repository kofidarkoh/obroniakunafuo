import type { Metadata } from "next";
import { Check } from "lucide-react";
import { SuccessPanel } from "@/components/site/success-panel";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Message received",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ name?: string; reason?: string; via?: string }>;
};

export default async function ContactSuccessPage({
  searchParams,
}: PageProps) {
  const { name, reason, via } = await searchParams;
  const senderName = name?.trim() || "friend";

  return (
    <SuccessPanel
      eyebrow="Message received"
      title={`Thank you, ${senderName}.`}
      description="We've received your message and will get back to you within 2–3 working days. In the meantime, feel free to explore our programmes and stories."
      rows={[
        { label: "Name", value: senderName },
        { label: "Reason", value: reason || "General enquiry" },
        { label: "Response via", value: via || "Email" },
        {
          label: "Status",
          value: (
            <>
              Message received
              <Check className="size-3.5 text-grass" aria-hidden="true" />
            </>
          ),
        },
      ]}
    >
      <ButtonLink
        href="/"
        size="lg"
        className="mx-auto w-full max-w-[420px]"
      >
        Return to homepage
      </ButtonLink>
    </SuccessPanel>
  );
}
