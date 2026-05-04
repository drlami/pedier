import { db, hiddenProtocolsTable } from '@workspace/db';
import { eq } from 'drizzle-orm';

export async function getHiddenProtocolIds(): Promise<string[]> {
  const rows = await db.select().from(hiddenProtocolsTable);
  return rows.map((r) => r.id);
}

export async function hideProtocol(id: string): Promise<void> {
  await db
    .insert(hiddenProtocolsTable)
    .values({ id })
    .onConflictDoNothing();
}

export async function unhideProtocol(id: string): Promise<void> {
  await db.delete(hiddenProtocolsTable).where(eq(hiddenProtocolsTable.id, id));
}
