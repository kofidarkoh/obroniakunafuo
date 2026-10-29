import { Resend } from "resend";
import { getSiteSettings } from "@/lib/data/content";

let resend: Resend | null = null;
let warned = false;

function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (!warned) {
      warned = true;
      console.info(
        "[email] RESEND_API_KEY is not set — admin notifications are disabled.",
      );
    }
    return null;
  }
  resend ??= new Resend(key);
  return resend;
}

export type NotificationLine = { label: string; value?: string | null };

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderHtml(title: string, lines: NotificationLine[]) {
  const rows = lines
    .filter((line) => Boolean(line.value))
    .map(
      (line) => `
        <tr>
          <td style="padding:8px 12px;font-size:12px;color:#6b7280;vertical-align:top;white-space:nowrap;">${escapeHtml(line.label)}</td>
          <td style="padding:8px 12px;font-size:13px;color:#111827;vertical-align:top;">${escapeHtml(
            String(line.value),
          )}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f6f5f1;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <div style="padding:20px 24px;background:#14301c;color:#ffffff;">
        <p style="margin:0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#b9d99a;">Obroni Akunafo Kuo · Admin</p>
        <h1 style="margin:8px 0 0;font-size:18px;font-weight:600;">${escapeHtml(title)}</h1>
      </div>
      <table style="width:100%;border-collapse:collapse;">${rows}</table>
      <div style="padding:16px 24px;border-top:1px solid #e5e7eb;">
        <a href="${escapeHtml(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")}/admin" style="font-size:12px;font-weight:600;color:#2f6b3a;text-decoration:none;">Open the admin dashboard →</a>
      </div>
    </div>
  </body>
</html>`;
}

/**
 * Sends a notification to the admin email stored in site settings.
 * Never throws: a failed email must not break the public submission.
 */
export async function notifyAdmin(subject: string, lines: NotificationLine[]) {
  const mailer = client();
  if (!mailer) return;

  try {
    const settings = await getSiteSettings();
    const to = settings.adminEmail || process.env.ADMIN_NOTIFICATION_EMAIL;
    if (!to) return;

    await mailer.emails.send({
      from:
        process.env.RESEND_FROM ??
        process.env.RESEND_FROM_EMAIL ??
        "OAK Website <onboarding@resend.dev>",
      to,
      subject,
      html: renderHtml(subject, lines),
    });
  } catch (error) {
    console.error("[email] Failed to send admin notification", error);
  }
}
