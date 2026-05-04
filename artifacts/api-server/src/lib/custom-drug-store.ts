import { db, customDrugsTable } from '@workspace/db';
import { eq } from 'drizzle-orm';

export interface StoredDoseRow {
  id: string;
  route: string;
  type: string;
  dosePerKgMg: number;
  dosePerKgMgMax?: number;
  maxDoseMg?: number;
  frequency?: string;
  oralConcentrations?: Array<{ label: string; mgPerMl: number }>;
  ivConcentrationMgPerMl?: number;
  ivAdminRate?: string;
  caution?: string;
}

export interface StoredDrug {
  id: string;
  name: string;
  category: string;
  indication?: string;
  warning?: string;
  doses: StoredDoseRow[];
  isCustom: boolean;
}

export async function getAllCustomDrugs(): Promise<StoredDrug[]> {
  const rows = await db.select().from(customDrugsTable);
  return rows.map((r) => r.data as StoredDrug);
}

export async function upsertCustomDrug(
  drug: StoredDrug,
  isCustom: boolean,
): Promise<void> {
  await db
    .insert(customDrugsTable)
    .values({ id: drug.id, data: drug, isCustom })
    .onConflictDoUpdate({
      target: customDrugsTable.id,
      set: { data: drug, isCustom, updatedAt: new Date() },
    });
}

export async function deleteCustomDrug(id: string): Promise<boolean> {
  const rows = await db
    .delete(customDrugsTable)
    .where(eq(customDrugsTable.id, id))
    .returning();
  return rows.length > 0;
}
