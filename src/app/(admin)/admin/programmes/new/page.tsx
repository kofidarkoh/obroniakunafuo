import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProgrammeForm } from "@/components/admin/programme-form";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";
import type { Programme } from "@/lib/site";

export const dynamic = "force-dynamic";

const blankProgramme: Programme = {
  slug: "",
  title: "",
  shortTitle: "",
  category: "Food Support",
  accent: "green",
  icon: "utensils",
  summary: "",
  description: "",
  bullets: [],
  cta: "Support this programme",
  meta: "",
  image: "/images/programmes/food.jpg",
  imageAlt: "",
  featuredOnHome: false,
  showOnProgrammes: true,
};

export default function NewProgrammePage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="New programme"
        description="Add a new programme to the public site."
        action={
          <Link
            href="/admin/programmes"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-4 text-[12px] font-medium text-ink hover:bg-paper"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to programmes
          </Link>
        }
      />

      <AdminCard className="p-5 sm:p-6">
        <ProgrammeForm programme={blankProgramme} />
      </AdminCard>
    </div>
  );
}
