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
  await db.insert(activityLogsTable).values({
    id: crypto.randomUUID(),
    userId: opts.userId,
    username: opts.username,
    role: opts.role,
    event: opts.event,
    ipAddress: opts.ipAddress ?? null,
    userAgent: opts.userAgent ?? null,
  });
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
