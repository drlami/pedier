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
  } catch {
    // If the userId FK constraint fails (e.g. stale JWT pointing to a deleted
    // user), retry with userId = null so the event is never silently lost.
    try {
      await db.insert(activityLogsTable).values({ ...base, userId: null });
    } catch (err2) {
      // Last-resort: log to console but don't propagate — activity logging must
      // never break the request that triggered it.
      console.error('[activity-log] Failed to record event:', err2);
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
