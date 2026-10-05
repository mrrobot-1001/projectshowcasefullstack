import { sql } from './db'

// Records an admin action (who, what, before/after) in admin_audit_log.
export async function logAdminAction(
  adminEmail: string,
  action: string,
  targetType: string,
  targetId: string | null,
  details: Record<string, unknown> = {}
) {
  await sql`
    INSERT INTO admin_audit_log (admin_email, action, target_type, target_id, details)
    VALUES (${adminEmail}, ${action}, ${targetType}, ${targetId}, ${sql.json(details as any)})
  `
}
