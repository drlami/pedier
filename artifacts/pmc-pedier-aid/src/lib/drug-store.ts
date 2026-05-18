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

const STORE_KEY = "pmc-custom-drugs-v2";

const SEEDED_DRUGS: StoredDrug[] = [
  {
    id: "custom-1778079731951",
    name: "Amoxicillin - Cavulanate",
    category: "Antibiotics",
    isCustom: true,
    indication: "Pneumonis , otitis media , tonsillitis",
    warning: "Check penicillin allergy",
    doses: [
      {
        id: "my5g4iy",
        type: "oral-suspension",
        route: "Oral",
        frequency: "Twice daily (BD)",
        maxDoseMg: 1000,
        dosePerKgMg: 25,
        dosePerKgMgMax: 50,
        oralConcentrations: [
          { label: "600 mg / 5 ml", mgPerMl: 120 },
          { label: "400 mg / 5 ml", mgPerMl: 80 },
          { label: "250 mg / 5 ml", mgPerMl: 50 },
          { label: "125 mg / 5 ml", mgPerMl: 25 },
        ],
      },
    ],
  },
  {
    id: "amoxicillin",
    name: "Amoxicillin",
    category: "Antibiotics",
    isCustom: false,
    indication: "Chest infection, otitis media, strep throat",
    doses: [
      {
        id: "kt4em37",
        type: "oral",
        route: "Oral",
        frequency: "Every 8 hours",
        maxDoseMg: 500,
        dosePerKgMg: 25,
        oralConcentrations: [
          { label: "125 mg / 5 ml", mgPerMl: 25 },
          { label: "250 mg / 5 ml", mgPerMl: 50 },
          { label: "400 mg / 5 ml", mgPerMl: 80 },
        ],
      },
    ],
  },
  {
    id: "custom-1778079952391",
    name: "Cefdinir",
    category: "Antibiotics",
    isCustom: true,
    indication: "Otitis media  , UTI",
    doses: [
      {
        id: "3zvrcml",
        type: "other",
        route: "Oral",
        frequency: "Every 12 hours",
        maxDoseMg: 500,
        dosePerKgMg: 7,
        dosePerKgMgMax: 7,
        oralConcentrations: [
          { label: "125 mg / 5 ml", mgPerMl: 25 },
          { label: "250 mg / 5 ml", mgPerMl: 50 },
        ],
      },
    ],
  },
  {
    id: "custom-1778080053540",
    name: "Cefixime",
    category: "Antibiotics",
    isCustom: true,
    indication: "pneumonia , UTI",
    doses: [
      {
        id: "knhrm5z",
        type: "oral-suspension",
        route: "Oral",
        frequency: "Once daily (OD)",
        maxDoseMg: 400,
        dosePerKgMg: 8,
        dosePerKgMgMax: 8,
        oralConcentrations: [{ label: "100 mg / 5 ml", mgPerMl: 20 }],
      },
    ],
  },
  {
    id: "metronidazole",
    name: "Metronidazole",
    category: "Antibiotics",
    isCustom: false,
    indication: "Anaerobic infections, abdominal sepsis",
    doses: [
      {
        id: "mfkykjw",
        type: "iv",
        route: "IV over 20 min",
        frequency: "Every 8 hours",
        maxDoseMg: 500,
        dosePerKgMg: 7.5,
        ivAdminRate: "over 20 min",
        ivConcentrationMgPerMl: 5,
      },
      {
        id: "9phrxns",
        type: "oral",
        route: "Oral",
        frequency: "Every 8 hours",
        maxDoseMg: 400,
        dosePerKgMg: 7.5,
        oralConcentrations: [{ label: "125 mg / 5 ml (40 mg/ml)", mgPerMl: 25 }],
      },
    ],
  },
];

function loadStore(): CustomDrugStore {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw) as CustomDrugStore;
  } catch {}
  const seeded: CustomDrugStore = { additions: [], edits: {} };
  for (const drug of SEEDED_DRUGS) {
    if (drug.isCustom) {
      seeded.additions.push(drug);
    } else {
      seeded.edits[drug.id] = drug;
    }
  }
  localStorage.setItem(STORE_KEY, JSON.stringify(seeded));
  return seeded;
}

function persistStore(store: CustomDrugStore): void {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

export async function fetchCustomStore(): Promise<CustomDrugStore> {
  return loadStore();
}

export async function saveCustomDrug(drug: StoredDrug): Promise<void> {
  const store = loadStore();
  if (drug.isCustom) {
    const idx = store.additions.findIndex((d) => d.id === drug.id);
    if (idx >= 0) {
      store.additions[idx] = drug;
    } else {
      store.additions.push(drug);
    }
    delete store.edits[drug.id];
  } else {
    store.edits[drug.id] = drug;
    store.additions = store.additions.filter((d) => d.id !== drug.id);
  }
  persistStore(store);
}

export async function deleteCustomDrug(id: string): Promise<void> {
  const store = loadStore();
  store.additions = store.additions.filter((d) => d.id !== id);
  delete store.edits[id];
  persistStore(store);
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
