import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProgrammeForm } from "@/components/admin/programme-form";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";
import { getAdminProgramme } from "@/lib/data/content";

export const dynamic = "force-dynamic";

export default async function EditProgrammePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const programme = await getAdminProgramme(slug);

  if (!programme) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit programme"
        description={`Editing “${programme.title}”.`}
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
        <ProgrammeForm programme={programme} />
      </AdminCard>
    </div>
  );
}
