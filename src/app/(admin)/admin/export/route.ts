import { requireAdmin } from "@/lib/auth";
import {
  listContacts,
  listDonations,
  listPartnerships,
  listVolunteers,
} from "@/lib/data/store";
import {
  listAdminNotifications,
  listAdminProgrammes,
  listAdminStories,
  getSiteSettings,
} from "@/lib/data/content";

export const dynamic = "force-dynamic";

export async function GET() {
  await requireAdmin();

  const [contacts, donations, volunteers, partnerships, stories, programmes, notifications, settings] =
    await Promise.all([
      listContacts(),
      listDonations(),
      listVolunteers(),
      listPartnerships(),
      listAdminStories(),
      listAdminProgrammes(),
      listAdminNotifications(),
      getSiteSettings(),
    ]);

  const backup = {
    exportedAt: new Date().toISOString(),
    contacts,
    donations,
    volunteers,
    partnerships,
    stories,
    programmes,
    notifications,
    settings,
  };

  const json = JSON.stringify(backup, null, 2);
  const date = new Date().toISOString().slice(0, 10);

  return new Response(json, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="oak-backup-${date}.json"`,
    },
  });
}