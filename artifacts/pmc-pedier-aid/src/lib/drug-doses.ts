import { generateCalculate, buildFormula, type StoredDrug, type CustomDrugStore, type OralConcentration, type DoseType } from "./drug-store";

export type DrugCategory =
  | "Resuscitation"
  | "Seizure"
  | "Analgesia & Sedation"
  | "Respiratory"
  | "Antibiotics"
  | "Cardiovascular"
  | "Fluids & Electrolytes"
  | "Allergy & Anaphylaxis"
  | "GI & Anti-emetics"
  | "Neurology";

export const DRUG_CATEGORIES: DrugCategory[] = [
  "Resuscitation",
  "Seizure",
  "Analgesia & Sedation",
  "Respiratory",
  "Antibiotics",
  "Cardiovascular",
  "Fluids & Electrolytes",
  "Allergy & Anaphylaxis",
  "GI & Anti-emetics",
  "Neurology",
];

export const CATEGORY_COLOR: Record<DrugCategory, { bg: string; text: string; border: string; iconBg: string }> = {
  "Resuscitation":         { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",    iconBg: "bg-red-100" },
  "Seizure":               { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200", iconBg: "bg-violet-100" },
  "Analgesia & Sedation":  { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200", iconBg: "bg-orange-100" },
  "Respiratory":           { bg: "bg-sky-50",     text: "text-sky-700",     border: "border-sky-200",    iconBg: "bg-sky-100" },
  "Antibiotics":           { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", iconBg: "bg-emerald-100" },
  "Cardiovascular":        { bg: "bg-pink-50",    text: "text-pink-700",    border: "border-pink-200",   iconBg: "bg-pink-100" },
  "Fluids & Electrolytes": { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",   iconBg: "bg-blue-100" },
  "Allergy & Anaphylaxis": { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",  iconBg: "bg-amber-100" },
  "GI & Anti-emetics":     { bg: "bg-lime-50",    text: "text-lime-700",    border: "border-lime-200",   iconBg: "bg-lime-100" },
  "Neurology":             { bg: "bg-indigo-50",  text: "text-indigo-700",  border: "border-indigo-200", iconBg: "bg-indigo-100" },
};

export interface DoseRow {
  route: string;
  formula: string;
  calculate: (kg: number) => string;
  caution?: string;
}

export interface EnhancedDoseRow extends DoseRow {
  type?: DoseType;
  dosePerKgMg?: number;
  dosePerKgMgMax?: number;
  maxDoseMg?: number;
  frequency?: string;
  oralConcentrations?: OralConcentration[];
  ivConcentrationMgPerMl?: number;
  ivAdminRate?: string;
  pediatricStandard?: string; // e.g. "WHO Standard", "BNFC 2024"
}

export interface DrugEntry {
  id: string;
  name: string;
  category: DrugCategory;
  indication?: string;
  warning?: string;
  contraindications?: string;
  doses: EnhancedDoseRow[];
  isCustom?: boolean;
  isEdited?: boolean;
  reference?: string;
}

function r(n: number, dp = 2): number {
  return Math.round(n * 10 ** dp) / 10 ** dp;
}
function cap(val: number, min?: number, max?: number): { v: number; capped: boolean } {
  let capped = false;
  if (min !== undefined && val < min) { val = min; capped = true; }
  if (max !== undefined && val > max) { val = max; capped = true; }
  return { v: val, capped };
}

export const DRUGS: DrugEntry[] = [
  // ── RESUSCITATION ──────────────────────────────────────────
  {
    id: "adrenaline-cardiac",
    name: "Adrenaline (Epinephrine)",
    category: "Resuscitation",
    indication: "Cardiac arrest, Anaphylaxis, Bradycardia (refractory)",
    warning: "Cardiac arrest → 1:10,000 (0.1 mg/ml). Anaphylaxis → 1:1,000 (1 mg/ml).",
    contraindications: "None in cardiac arrest. Use with caution in hypertension.",
    reference: "PALS 2020 / ERC 2021",
    doses: [
      {
        route: "IV/IO — Cardiac Arrest",
        formula: "0.01 mg/kg of 1:10,000 (0.1 ml/kg)",
        type: "iv",
        dosePerKgMg: 0.01,
        maxDoseMg: 1,
        frequency: "Every 3–5 min",
        calculate: (kg) => {
          const { v, capped } = cap(r(0.01 * kg, 2), undefined, 1);
          const vol = r(v * 10, 1);
          return `${v} mg = ${vol} ml of 1:10,000${capped ? " (MAX DOSE)" : ""}`;
        },
      },
      {
        route: "IM — Anaphylaxis",
        formula: "0.01 mg/kg of 1:1,000 (max 0.5 mg)",
        type: "im",
        dosePerKgMg: 0.01,
        maxDoseMg: 0.5,
        frequency: "Every 5–15 min PRN",
        calculate: (kg) => {
          const { v, capped } = cap(r(0.01 * kg, 2), undefined, 0.5);
          const vol = r(v, 2);
          return `${v} mg = ${vol} ml of 1:1,000${capped ? " (MAX DOSE)" : ""}`;
        },
      },
    ],
  },
  {
    id: "adenosine",
    name: "Adenosine",
    category: "Resuscitation",
    indication: "Supraventricular Tachycardia (SVT)",
    warning: "MUST give as a very rapid IV push followed immediately by a rapid 5-10 ml saline flush.",
    contraindications: "Asthma (may cause bronchospasm), 2nd/3rd degree heart block.",
    reference: "BNFC 2024",
    doses: [
      {
        route: "IV rapid push",
        formula: "1st: 0.1 mg/kg (max 6 mg) → 2nd: 0.2 mg/kg (max 12 mg)",
        type: "iv",
        dosePerKgMg: 0.1,
        maxDoseMg: 12,
        calculate: (kg) => {
          const d1 = cap(r(0.1 * kg, 2), undefined, 6).v;
          const d2 = cap(r(0.2 * kg, 2), undefined, 12).v;
          return `1st: ${d1} mg | 2nd: ${d2} mg`;
        },
      },
    ],
  },

  // ── ANTIBIOTICS ────────────────────────────────────────────
  {
    id: "ceftriaxone",
    name: "Ceftriaxone",
    category: "Antibiotics",
    indication: "Sepsis, Meningitis, Severe Respiratory/Urinary infections",
    warning: "Do NOT co-administer with calcium-containing IV fluids (neonates). Risk of fatal precipitate.",
    reference: "Red Book 2024",
    doses: [
      {
        route: "IV/IM — Sepsis / General",
        formula: "50–80 mg/kg once daily (max 2 g)",
        type: "iv",
        dosePerKgMg: 50,
        maxDoseMg: 2000,
        frequency: "Once daily",
        ivConcentrationMgPerMl: 100,
        calculate: (kg) => {
          const v = cap(r(50 * kg, 0), undefined, 2000).v;
          const vol = r(v / 100, 1);
          return `${v} mg = ${vol} ml (reconstituted to 100 mg/ml)`;
        },
      },
      {
        route: "IV/IM — Meningitis",
        formula: "80–100 mg/kg once daily (max 4 g)",
        type: "iv",
        dosePerKgMg: 100,
        maxDoseMg: 4000,
        frequency: "Once daily",
        calculate: (kg) => {
          const v = cap(r(100 * kg, 0), undefined, 4000).v;
          const vol = r(v / 100, 1);
          return `${v} mg = ${vol} ml (reconstituted to 100 mg/ml)`;
        },
      },
    ],
  },
  {
    id: "amoxicillin",
    name: "Amoxicillin",
    category: "Antibiotics",
    indication: "Pneumonia, Otitis Media, UTI",
    doses: [
      {
        route: "Oral",
        formula: "25–30 mg/kg TDS (Standard) or 45 mg/kg BD (High-dose)",
        type: "oral",
        dosePerKgMg: 30,
        maxDoseMg: 1000,
        frequency: "Every 8 hours",
        oralConcentrations: [
          { label: "125 mg / 5 ml", mgPerMl: 25 },
          { label: "250 mg / 5 ml", mgPerMl: 50 },
        ],
        calculate: (kg) => {
          const { v, capped } = cap(r(30 * kg, 0), undefined, 1000);
          return `${v} mg per dose${capped ? " (max 1g)" : ""}`;
        },
      },
    ],
  },

  // ── GI & ANTI-EMETICS ──────────────────────────────────────
  {
    id: "ondansetron",
    name: "Ondansetron",
    category: "GI & Anti-emetics",
    indication: "Gastroenteritis-related vomiting, Chemotherapy N/V",
    warning: "May prolong QT interval. Use with caution in patients with cardiac risk factors.",
    reference: "AAP / BNFC",
    doses: [
      {
        route: "Oral / IV",
        formula: "8-15 kg → 2 mg | 15-30 kg → 4 mg | >30 kg → 8 mg",
        type: "oral",
        calculate: (kg) => {
          if (kg < 8) return "Not recommended < 8kg";
          if (kg < 15) return "2 mg (single dose)";
          if (kg < 30) return "4 mg (single dose)";
          return "8 mg (single dose)";
        },
      },
    ],
  },

  // ── ANALGESIA ──────────────────────────────────────────────
  {
    id: "paracetamol",
    name: "Paracetamol (Acetaminophen)",
    category: "Analgesia & Sedation",
    indication: "Pain, Fever",
    warning: "Ensure 4-hour gap between doses. Max 4 doses in 24 hours.",
    reference: "BNFC 2024",
    doses: [
      {
        route: "Oral / Rectal",
        formula: "15 mg/kg (max 1 g)",
        type: "oral",
        dosePerKgMg: 15,
        maxDoseMg: 1000,
        frequency: "Every 4–6 hours",
        oralConcentrations: [
          { label: "120 mg / 5 ml", mgPerMl: 24 },
          { label: "250 mg / 5 ml", mgPerMl: 50 },
        ],
        calculate: (kg) => {
          const { v, capped } = cap(r(15 * kg, 0), undefined, 1000);
          return `${v} mg${capped ? " (max 1g)" : ""}`;
        },
      },
      {
        route: "IV (over 15 min)",
        formula: "15 mg/kg (max 1 g)",
        type: "iv",
        dosePerKgMg: 15,
        maxDoseMg: 1000,
        ivConcentrationMgPerMl: 10,
        calculate: (kg) => {
          const v = cap(r(15 * kg, 0), undefined, 1000).v;
          const vol = r(v / 10, 1);
          return `${v} mg = ${vol} ml (10 mg/ml solution)`;
        },
      },
    ],
  },
  {
    id: "ibuprofen",
    name: "Ibuprofen",
    category: "Analgesia & Sedation",
    indication: "Pain, Fever, Anti-inflammatory",
    warning: "Avoid in asthma, dehydration, or renal impairment.",
    doses: [
      {
        route: "Oral",
        formula: "10 mg/kg (max 400 mg)",
        type: "oral",
        dosePerKgMg: 10,
        maxDoseMg: 400,
        frequency: "Every 6–8 hours",
        oralConcentrations: [
          { label: "100 mg / 5 ml", mgPerMl: 20 },
          { label: "200 mg / 5 ml", mgPerMl: 40 },
        ],
        calculate: (kg) => {
          const { v, capped } = cap(r(10 * kg, 0), undefined, 400);
          return `${v} mg${capped ? " (max 400mg)" : ""}`;
        },
      },
    ],
  },
];

export function storedDrugToEntry(stored: StoredDrug): DrugEntry {
  return {
    id: stored.id,
    name: stored.name,
    category: stored.category as DrugCategory,
    indication: stored.indication,
    warning: stored.warning,
    isCustom: stored.isCustom,
    isEdited: !stored.isCustom,
    doses: stored.doses.map((d) => ({
      route: d.route,
      formula: buildFormula(d),
      calculate: generateCalculate(d),
      caution: d.caution,
      type: d.type,
      dosePerKgMg: d.dosePerKgMg,
      dosePerKgMgMax: d.dosePerKgMgMax,
      maxDoseMg: d.maxDoseMg,
      frequency: d.frequency,
      oralConcentrations: d.oralConcentrations,
      ivConcentrationMgPerMl: d.ivConcentrationMgPerMl,
      ivAdminRate: d.ivAdminRate,
    })),
  };
}

export function getMergedDrugs(store: CustomDrugStore): DrugEntry[] {
  const result: DrugEntry[] = [];
  for (const drug of DRUGS) {
    if (store.edits[drug.id]) {
      result.push(storedDrugToEntry(store.edits[drug.id]));
    } else {
      result.push(drug);
    }
  }
  for (const addition of store.additions) {
    result.push(storedDrugToEntry(addition));
  }
  return result;
}
