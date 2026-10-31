import { requireAdmin } from "@/lib/auth";
import { listVolunteers } from "@/lib/data/store";

export const dynamic = "force-dynamic";

function cell(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  await requireAdmin();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const items = await listVolunteers();
  let filtered = items;

  if (status && status !== "all") {
    filtered = filtered.filter((item) => item.status === status);
  }
  if (from) {
    const fromDate = new Date(from);
    fromDate.setHours(0, 0, 0, 0);
    filtered = filtered.filter((item) => new Date(item.createdAt) >= fromDate);
  }
  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter((item) => new Date(item.createdAt) <= toDate);
  }

  const header = [
    "Submitted",
    "Name",
    "Email",
    "Phone",
    "Location",
    "Interests",
    "Availability",
    "Involvement",
    "Status",
    "Message",
  ];

  const rows = filtered.map((item) =>
    [
      item.createdAt,
      item.name,
      item.email,
      item.phone,
      item.location,
      item.interests.join("; "),
      item.availability,
      item.involvement,
      item.status,
      item.motivation ?? "",
    ]
      .map(cell)
      .join(","),
  );

  const csv = [header.map(cell).join(","), ...rows].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="oak-volunteers-${date}.csv"`,
    },
  });
}