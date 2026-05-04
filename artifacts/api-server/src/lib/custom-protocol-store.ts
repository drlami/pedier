import { db, customProtocolsTable } from '@workspace/db';
import { eq } from 'drizzle-orm';
import type { CustomProtocol } from './custom-protocol-types.js';

export async function getAllCustomProtocols(): Promise<CustomProtocol[]> {
  const rows = await db.select().from(customProtocolsTable);
  return rows.map((r) => r.data as CustomProtocol);
}

export async function getCustomProtocolById(
  id: string,
): Promise<CustomProtocol | undefined> {
  const rows = await db
    .select()
    .from(customProtocolsTable)
    .where(eq(customProtocolsTable.id, id));
  return rows.length > 0 ? (rows[0].data as CustomProtocol) : undefined;
}

export async function createCustomProtocol(
  data: Omit<CustomProtocol, 'isCustom' | 'createdAt' | 'updatedAt'>,
): Promise<CustomProtocol> {
  const existing = await db
    .select()
    .from(customProtocolsTable)
    .where(eq(customProtocolsTable.id, data.id));
  if (existing.length > 0) {
    throw new Error(`A protocol with id "${data.id}" already exists.`);
  }
  const now = new Date().toISOString();
  const protocol: CustomProtocol = {
    ...data,
    isCustom: true,
    createdAt: now,
    updatedAt: now,
  };
  await db.insert(customProtocolsTable).values({
    id: protocol.id,
    data: protocol,
  });
  return protocol;
}

export async function updateCustomProtocol(
  id: string,
  data: Partial<Omit<CustomProtocol, 'id' | 'isCustom' | 'createdAt'>>,
): Promise<CustomProtocol | null> {
  const rows = await db
    .select()
    .from(customProtocolsTable)
    .where(eq(customProtocolsTable.id, id));
  if (rows.length === 0) return null;
  const existing = rows[0].data as CustomProtocol;
  const updated: CustomProtocol = {
    ...existing,
    ...data,
    id,
    isCustom: true,
    updatedAt: new Date().toISOString(),
  };
  await db
    .update(customProtocolsTable)
    .set({ data: updated, updatedAt: new Date() })
    .where(eq(customProtocolsTable.id, id));
  return updated;
}

export async function deleteCustomProtocol(id: string): Promise<boolean> {
  const rows = await db
    .delete(customProtocolsTable)
    .where(eq(customProtocolsTable.id, id))
    .returning();
  return rows.length > 0;
}
