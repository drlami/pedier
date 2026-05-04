import type { DrugCategory } from "./drug-doses";

export interface OralConcentration {
  label: string;
  mgPerMl: number;
}

export type DoseType = "oral" | "oral-suspension" | "oral-tablet" | "iv" | "im" | "io" | "inhaled" | "rectal" | "other";

export interface StoredDoseRow {
  id: string;
  route: string;
  type: DoseType;
  dosePerKgMg: number;
  dosePerKgMgMax?: number;
  maxDoseMg?: number;
  frequency?: string;
  oralConcentrations?: OralConcentration[];
  ivConcentrationMgPerMl?: number;
  ivAdminRate?: string;
  caution?: string;
}

export interface StoredDrug {
  id: string;
  name: string;
  category: DrugCategory;
  indication?: string;
  warning?: string;
  doses: StoredDoseRow[];
  isCustom: boolean;
}

export interface CustomDrugStore {
  additions: StoredDrug[];
  edits: Record<string, StoredDrug>;
}

const API_BASE = "/api";
const TOKEN_KEY = "pmc-auth-token";

function authHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchCustomStore(): Promise<CustomDrugStore> {
  try {
    const res = await fetch(`${API_BASE}/custom-drugs`, {
      headers: authHeaders(),
    });
    if (!res.ok) return { additions: [], edits: {} };
    const drugs: StoredDrug[] = await res.json();
    const store: CustomDrugStore = { additions: [], edits: {} };
    for (const drug of drugs) {
      if (drug.isCustom) {
        store.additions.push(drug);
      } else {
        store.edits[drug.id] = drug;
      }
    }
    return store;
  } catch {
    return { additions: [], edits: {} };
  }
}

export async function saveCustomDrug(drug: StoredDrug): Promise<void> {
  await fetch(`${API_BASE}/custom-drugs/${drug.id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(drug),
  });
}

export async function deleteCustomDrug(id: string): Promise<void> {
  await fetch(`${API_BASE}/custom-drugs/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

export async function resetBuiltinDrug(id: string): Promise<void> {
  await deleteCustomDrug(id);
}

function rnd(n: number, dp = 2): number {
  return Math.round(n * Math.pow(10, dp)) / Math.pow(10, dp);
}

function capVal(val: number, max?: number): { v: number; capped: boolean } {
  if (max !== undefined && val > max) return { v: max, capped: true };
  return { v: val, capped: false };
}

export function generateCalculate(dose: StoredDoseRow): (kg: number) => string {
  const { dosePerKgMg, dosePerKgMgMax, maxDoseMg, frequency, ivConcentrationMgPerMl, ivAdminRate } = dose;
  const freqSuffix = frequency ? ` — ${frequency}` : "";
  const adminSuffix = ivAdminRate ? ` (${ivAdminRate})` : "";

  return (kg: number): string => {
    const rawLo = rnd(dosePerKgMg * kg, 0);
    const { v: lo, capped: loCapped } = capVal(rawLo, maxDoseMg);
    const maxNote = loCapped ? ` (max ${maxDoseMg} mg)` : "";

    if (dosePerKgMgMax !== undefined) {
      const rawHi = rnd(dosePerKgMgMax * kg, 0);
      const { v: hi } = capVal(rawHi, maxDoseMg);
      const hiNote = hi >= (maxDoseMg ?? Infinity) ? ` (max ${maxDoseMg} mg)` : "";
      if (ivConcentrationMgPerMl) {
        const vol = rnd(hi / ivConcentrationMgPerMl, 1);
        return `${lo}–${hi} mg = ${vol} ml${adminSuffix}${hiNote}${freqSuffix}`;
      }
      return `${lo}–${hi} mg${hiNote}${freqSuffix}`;
    }

    if (ivConcentrationMgPerMl) {
      const vol = rnd(lo / ivConcentrationMgPerMl, 1);
      return `${lo} mg = ${vol} ml${adminSuffix}${maxNote}${freqSuffix}`;
    }

    return `${lo} mg${maxNote}${freqSuffix}`;
  };
}

export function buildFormula(dose: StoredDoseRow): string {
  const { dosePerKgMg, dosePerKgMgMax, maxDoseMg, frequency, ivConcentrationMgPerMl } = dose;
  const base = dosePerKgMgMax
    ? `${dosePerKgMg}–${dosePerKgMgMax} mg/kg`
    : `${dosePerKgMg} mg/kg`;
  const maxPart = maxDoseMg ? ` (max ${maxDoseMg} mg)` : "";
  const freqPart = frequency ? ` — ${frequency}` : "";
  const concPart = ivConcentrationMgPerMl ? ` [${ivConcentrationMgPerMl} mg/ml]` : "";
  return `${base}${maxPart}${concPart}${freqPart}`;
}
