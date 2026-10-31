import { supabaseConfigured, createSupabaseServiceClient } from "@/lib/supabase/server";

export type AuditEntry = {
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: string;
  after?: string;
};

/**
 * Records an admin action in the `admin_audit_log` table when Supabase is
 * configured. Never throws: auditing must not break the primary operation.
 */
export async function logAdminAction(entry: AuditEntry) {
  if (!supabaseConfigured()) return;
  try {
    const supabase = await createSupabaseServiceClient();
    await supabase.from("admin_audit_log").insert({
      actor: entry.actor,
      action: entry.action,
      entity_type: entry.entityType,
      entity_id: entry.entityId,
      before_summary: entry.before ?? null,
      after_summary: entry.after ?? null,
    });
  } catch (error) {
    console.error("[audit] Failed to record admin action", error);
  }
}