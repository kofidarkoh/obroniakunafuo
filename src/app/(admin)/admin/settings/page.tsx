import { Info } from "lucide-react";
import { SettingsForm } from "@/components/admin/settings-form";
import { AdminCard, AdminPageHeader, AdminStat } from "@/components/admin/ui";
import { getSiteSettings } from "@/lib/data/content";
import { cn } from "@/lib/utils";
import { getSystemStatus } from "@/components/admin/system-status";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [settings, status] = await Promise.all([
    getSiteSettings(),
    getSystemStatus(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Settings"
        description="Organisation contact details, payment information and notification preferences."
      />

      <div className="flex items-start gap-2.5 rounded-[10px] border border-amber/25 bg-amber/5 px-4 py-3 text-[11px] leading-relaxed text-body">
        <Info className="mt-0.5 size-3.5 shrink-0 text-amber" aria-hidden="true" />
        <p>
          These settings are saved to the local JSON data store and apply to the
          public site immediately. When Supabase is connected they will move to
          the database without changing this form.
        </p>
      </div>

      <AdminCard className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
              System status
            </h2>
            <p className="mt-1 text-[10px] leading-relaxed text-muted">
              Health of the admin data layer. Read-only — no settings are
              changed here.
            </p>
          </div>
          <span className={cn(`inline-flex size-7 shrink-0 items-center justify-center rounded-full`, status.auth.tone === "green" ? "bg-mint text-moss" : "bg-amber/10 text-amber")}>
            {status.auth.mode === "supabase" ? "Supabase" : "Mock"}
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AdminStat
            label="Authentication"
            value={status.auth.label}
            tone={status.auth.tone}
          />
          <AdminStat
            label="Data store"
            value={status.dataStore.label}
            tone={status.dataStore.tone}
          />
          <AdminStat
            label="Email (Resend)"
            value={status.email.label}
            tone={status.email.tone}
          />
          <AdminStat
            label="Environment"
            value={status.environment}
            tone={status.environment === "production" ? "green" : "amber"}
          />
          <AdminStat
            label="Donations"
            value={status.counts.donations.total}
            note={`${status.counts.donations.pending} pending verification`}
          />
          <AdminStat
            label="Contact messages"
            value={status.counts.contacts.total}
            note={`${status.counts.contacts.new} new`}
            tone="amber"
          />
          <AdminStat
            label="Volunteer applications"
            value={status.counts.volunteers.total}
            note={`${status.counts.volunteers.new} awaiting review`}
            tone="purple"
          />
          <AdminStat
            label="Partnership enquiries"
            value={status.counts.partnerships.total}
            note={`${status.counts.partnerships.new} new`}
            tone="amber"
          />
          <AdminStat
            label="Stories"
            value={status.counts.stories}
            note="Manage in Stories"
          />
          <AdminStat
            label="Programmes"
            value={status.counts.programmes}
            note="Manage in Programmes"
          />
        </div>
      </AdminCard>

      <AdminCard className="p-5 sm:p-6">
        <SettingsForm settings={settings} />
      </AdminCard>
    </div>
  );
}

