import type { DrugCategory } from "./drug-doses";

export interface OralConcentration {
  label: string;
  mgPerMl: number;
}

export type DoseType = "oral" | "iv" | "im" | "io" | "inhaled" | "rectal" | "other";

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

const STORAGE_KEY = "pmc-custom-drugs-v1";

function loadStore(): CustomDrugStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { additions: [], edits: {} };
    return JSON.parse(raw) as CustomDrugStore;
  } catch {
    return { additions: [], edits: {} };
  }
}

function persistStore(store: CustomDrugStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function getCustomStore(): CustomDrugStore {
  return loadStore();
}

export function saveCustomDrug(drug: StoredDrug): CustomDrugStore {
  const store = loadStore();
  if (drug.isCustom) {
    const idx = store.additions.findIndex((d) => d.id === drug.id);
    if (idx >= 0) store.additions[idx] = drug;
    else store.additions.push(drug);
  } else {
    store.edits[drug.id] = drug;
  }
  persistStore(store);
  return store;
}

export function deleteCustomDrug(id: string): CustomDrugStore {
  const store = loadStore();
  store.additions = store.additions.filter((d) => d.id !== id);
  delete store.edits[id];
  persistStore(store);
  return store;
}

export function resetBuiltinDrug(id: string): CustomDrugStore {
  const store = loadStore();
  delete store.edits[id];
  persistStore(store);
  return store;
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
