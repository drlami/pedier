import { db, activityLogsTable } from '@workspace/db';
import { desc } from 'drizzle-orm';

export interface ActivityLogEntry {
  id: string;
  userId: string | null;
  username: string;
  role: string;
  event: 'login' | 'app_open';
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export async function recordActivity(opts: {
  userId: string;
  username: string;
  role: string;
  event: 'login' | 'app_open';
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> {
  const base = {
    id: crypto.randomUUID(),
    username: opts.username,
    role: opts.role,
    event: opts.event,
    ipAddress: opts.ipAddress ?? null,
    userAgent: opts.userAgent ?? null,
  };

  try {
    await db.insert(activityLogsTable).values({ ...base, userId: opts.userId });
  } catch (err) {
    // PostgreSQL error code 23503 = foreign_key_violation.
    // This happens when the JWT contains a user_id that was deleted/re-seeded.
    // In that case retry with userId = null so the event is never silently lost.
    const isFkViolation =
      typeof err === 'object' && err !== null && (err as Record<string, unknown>)['code'] === '23503';

    if (isFkViolation) {
      try {
        await db.insert(activityLogsTable).values({ ...base, userId: null });
      } catch (err2) {
        console.error('[activity-log] Failed to record event (null-user fallback):', {
          event: opts.event,
          username: opts.username,
          error: String(err2),
        });
      }
    } else {
      // Unexpected DB error — log with structured metadata but don't propagate.
      // Activity logging must never break the request that triggered it.
      console.error('[activity-log] Unexpected error recording event:', {
        event: opts.event,
        username: opts.username,
        error: String(err),
      });
    }
  }
}

export async function getActivityLogs(limit = 200): Promise<ActivityLogEntry[]> {
  const rows = await db
    .select()
    .from(activityLogsTable)
    .orderBy(desc(activityLogsTable.createdAt))
    .limit(limit);
  return rows.map((r) => ({
    ...r,
    event: r.event as 'login' | 'app_open',
    createdAt: r.createdAt.toISOString(),
  }));
}
