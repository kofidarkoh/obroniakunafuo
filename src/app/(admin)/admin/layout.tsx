import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/shell";
import { requireAdmin } from "@/lib/auth";
import {
  countPendingDonations,
  countUnreadContacts,
  countUnreadPartnerships,
  countUnreadVolunteers,
} from "@/lib/data/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | OAK Admin",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  const [contacts, volunteers, partnerships, pendingDonations] =
    await Promise.all([
      countUnreadContacts(),
      countUnreadVolunteers(),
      countUnreadPartnerships(),
      countPendingDonations(),
    ]);

  return (
    <AdminShell
      email={session.email}
      unreadCounts={{
        contacts,
        volunteers,
        partnerships,
        donations: pendingDonations,
      }}
    >
      {children}
    </AdminShell>
  );
}
