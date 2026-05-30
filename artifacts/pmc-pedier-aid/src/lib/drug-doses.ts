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
  | "Neurology"
  | "Neonatal";

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
  "Neonatal",
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
  "Neonatal":              { bg: "bg-teal-50",    text: "text-teal-700",    border: "border-teal-200",   iconBg: "bg-teal-100" },
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
  pediatricStandard?: string;
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
    indication: "Cardiac arrest, Anaphylaxis, Bradycardia",
    warning: "Cardiac arrest → 1:10,000 (0.1 mg/ml). Anaphylaxis → 1:1,000 (1 mg/ml).",
    reference: "PALS 2020",
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
          return `${v} mg = ${vol} ml of 1:10,000${capped ? " (MAX)" : ""}`;
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
          return `${v} mg = ${vol} ml of 1:1,000${capped ? " (MAX)" : ""}`;
        },
      },
    ],
  },
  {
    id: "adenosine",
    name: "Adenosine",
    category: "Resuscitation",
    indication: "SVT",
    warning: "Rapid IV push + rapid 5-10ml flush.",
    doses: [
      {
        route: "IV rapid push",
        formula: "1st: 0.1 mg/kg (max 6 mg) → 2nd: 0.2 mg/kg (max 12 mg)",
        type: "iv",
        calculate: (kg) => {
          const d1 = cap(r(0.1 * kg, 2), undefined, 6).v;
          const d2 = cap(r(0.2 * kg, 2), undefined, 12).v;
          return `1st: ${d1}mg | 2nd: ${d2}mg`;
        },
      },
    ],
  },
  {
    id: "amiodarone-resus",
    name: "Amiodarone",
    category: "Resuscitation",
    indication: "Shock-resistant VF/pVT",
    doses: [
      {
        route: "IV/IO Bolus",
        formula: "5 mg/kg (max 300 mg)",
        type: "iv",
        calculate: (kg) => {
          const { v, capped } = cap(r(5 * kg, 1), undefined, 300);
          return `${v} mg${capped ? " (MAX)" : ""}`;
        },
      },
    ],
  },
  {
    id: "atropine-resus",
    name: "Atropine",
    category: "Resuscitation",
    indication: "Bradycardia (vagal/primary)",
    doses: [
      {
        route: "IV/IO",
        formula: "0.02 mg/kg (min 0.1 mg, max 0.5 mg)",
        type: "iv",
        calculate: (kg) => {
          const { v } = cap(r(0.02 * kg, 2), 0.1, 0.5);
          return `${v} mg (min 0.1mg)`;
        },
      },
    ],
  },

  // ── SEIZURE / NEUROLOGY ────────────────────────────────────
  {
    id: "lorazepam",
    name: "Lorazepam",
    category: "Seizure",
    indication: "Status Epilepticus",
    doses: [
      {
        route: "IV/IO",
        formula: "0.1 mg/kg (max 4 mg)",
        type: "iv",
        calculate: (kg) => {
          const { v, capped } = cap(r(0.1 * kg, 2), undefined, 4);
          return `${v} mg${capped ? " (MAX)" : ""}`;
        },
      },
    ],
  },
  {
    id: "midazolam-seizure",
    name: "Midazolam",
    category: "Seizure",
    indication: "Acute seizure",
    doses: [
      {
        route: "Buccal",
        formula: "0.5 mg/kg (max 10 mg)",
        type: "oral",
        calculate: (kg) => {
          const { v, capped } = cap(r(0.5 * kg, 1), undefined, 10);
          return `${v} mg buccal${capped ? " (MAX)" : ""}`;
        },
      },
      {
        route: "IM",
        formula: "0.2 mg/kg (max 10 mg)",
        type: "im",
        calculate: (kg) => {
          const { v, capped } = cap(r(0.2 * kg, 2), undefined, 10);
          return `${v} mg IM${capped ? " (MAX)" : ""}`;
        },
      },
    ],
  },
  {
    id: "phenytoin-seizure",
    name: "Phenytoin",
    category: "Seizure",
    indication: "Status Epilepticus (2nd line)",
    warning: "Monitor ECG and BP. Max rate 1 mg/kg/min.",
    doses: [
      {
        route: "IV Loading",
        formula: "20 mg/kg (max 1000 mg)",
        type: "iv",
        calculate: (kg) => {
          const { v, capped } = cap(r(20 * kg, 0), undefined, 1000);
          return `${v} mg${capped ? " (MAX)" : ""}`;
        },
      },
    ],
  },
  {
    id: "levetiracetam-seizure",
    name: "Levetiracetam (Keppra)",
    category: "Seizure",
    indication: "Status Epilepticus / Maintenance",
    doses: [
      {
        route: "IV Loading",
        formula: "40–60 mg/kg (max 3000 mg)",
        type: "iv",
        calculate: (kg) => {
          const lo = cap(r(40 * kg, 0), undefined, 3000).v;
          const hi = cap(r(60 * kg, 0), undefined, 3000).v;
          return `${lo}–${hi} mg`;
        },
      },
    ],
  },
  {
    id: "phenobarbital-seizure",
    name: "Phenobarbital",
    category: "Seizure",
    indication: "Neonatal seizures / Refractory SE",
    doses: [
      {
        route: "IV Loading",
        formula: "20 mg/kg",
        type: "iv",
        calculate: (kg) => `${r(20 * kg, 0)} mg`,
      },
    ],
  },

  // ── ANTIBIOTICS ────────────────────────────────────────────
  {
    id: "ceftriaxone",
    name: "Ceftriaxone",
    category: "Antibiotics",
    indication: "Sepsis, Meningitis",
    warning: "Avoid in neonates receiving Calcium.",
    doses: [
      {
        route: "IV/IM Sepsis",
        formula: "50 mg/kg OD (max 2g)",
        type: "iv",
        calculate: (kg) => {
          const { v, capped } = cap(r(50 * kg, 0), undefined, 2000);
          return `${v} mg OD${capped ? " (MAX)" : ""}`;
        },
      },
      {
        route: "IV Meningitis",
        formula: "100 mg/kg OD (max 4g)",
        type: "iv",
        calculate: (kg) => {
          const { v, capped } = cap(r(100 * kg, 0), undefined, 4000);
          return `${v} mg OD${capped ? " (MAX)" : ""}`;
        },
      },
    ],
  },
  {
    id: "gentamicin",
    name: "Gentamicin",
    category: "Antibiotics",
    indication: "Gram negative sepsis",
    warning: "Monitor levels. Nephrotoxic.",
    doses: [
      {
        route: "IV OD",
        formula: "7 mg/kg OD",
        type: "iv",
        calculate: (kg) => `${r(7 * kg, 1)} mg OD`,
      },
    ],
  },
  {
    id: "benzylpenicillin",
    name: "Benzylpenicillin (Pen G)",
    category: "Antibiotics",
    indication: "Meningococcal disease",
    doses: [
      {
        route: "IV",
        formula: "60 mg/kg QDS",
        type: "iv",
        calculate: (kg) => `${r(60 * kg, 0)} mg Q6H`,
      },
    ],
  },
  {
    id: "amoxicillin",
    name: "Amoxicillin",
    category: "Antibiotics",
    indication: "Chest, Ear, Throat",
    doses: [
      {
        route: "Oral",
        formula: "30 mg/kg TDS",
        type: "oral",
        oralConcentrations: [{ label: "250mg/5ml", mgPerMl: 50 }, { label: "125mg/5ml", mgPerMl: 25 }],
        calculate: (kg) => `${r(30 * kg, 0)} mg TDS`,
      },
    ],
  },
  {
    id: "flucloxacillin",
    name: "Flucloxacillin",
    category: "Antibiotics",
    indication: "Skin/Soft tissue (Staph)",
    doses: [
      {
        route: "IV",
        formula: "50 mg/kg QDS",
        type: "iv",
        calculate: (kg) => `${r(50 * kg, 0)} mg Q6H`,
      },
    ],
  },
  {
    id: "vancomycin",
    name: "Vancomycin",
    category: "Antibiotics",
    indication: "MRSA / Resistant Sepsis",
    doses: [
      {
        route: "IV",
        formula: "15 mg/kg TDS",
        type: "iv",
        calculate: (kg) => `${r(15 * kg, 1)} mg Q8H`,
      },
    ],
  },
  {
    id: "clarithromycin",
    name: "Clarithromycin",
    category: "Antibiotics",
    indication: "Atypical pneumonia / Allergy to Pen",
    doses: [
      {
        route: "Oral",
        formula: "7.5 mg/kg BD",
        type: "oral",
        calculate: (kg) => `${r(7.5 * kg, 1)} mg BD`,
      },
    ],
  },
  {
    id: "co-amoxiclav",
    name: "Co-amoxiclav (Augmentin)",
    category: "Antibiotics",
    indication: "Bite wounds, UTI, refractory OM",
    doses: [
      {
        route: "Oral",
        formula: "30 mg/kg TDS (of amoxicillin component)",
        type: "oral",
        calculate: (kg) => `${r(30 * kg, 0)} mg TDS`,
      },
    ],
  },

  // ── RESPIRATORY ────────────────────────────────────────────
  {
    id: "salbutamol-neb",
    name: "Salbutamol",
    category: "Respiratory",
    indication: "Asthma / Bronchospasm",
    doses: [
      {
        route: "Nebulised",
        formula: "<20kg: 2.5mg | >20kg: 5mg",
        type: "other",
        calculate: (kg) => (kg < 20 ? "2.5 mg" : "5 mg"),
      },
      {
        route: "Inhaler (MDI)",
        formula: "2–10 puffs PRN",
        type: "other",
        calculate: () => "2–10 puffs via spacer",
      },
    ],
  },
  {
    id: "hydrocortisone-resp",
    name: "Hydrocortisone",
    category: "Respiratory",
    indication: "Acute severe asthma / Anaphylaxis",
    doses: [
      {
        route: "IV",
        formula: "4 mg/kg QDS",
        type: "iv",
        calculate: (kg) => `${r(4 * kg, 0)} mg Q6H`,
      },
    ],
  },
  {
    id: "dexamethasone-croup",
    name: "Dexamethasone",
    category: "Respiratory",
    indication: "Croup",
    doses: [
      {
        route: "Oral/IV Stat",
        formula: "0.15 mg/kg",
        type: "oral",
        calculate: (kg) => `${r(0.15 * kg, 2)} mg Stat`,
      },
    ],
  },
  {
    id: "magnesium-resp",
    name: "Magnesium Sulphate",
    category: "Respiratory",
    indication: "Refractory asthma",
    doses: [
      {
        route: "IV over 20m",
        formula: "40 mg/kg (max 2g)",
        type: "iv",
        calculate: (kg) => {
          const { v, capped } = cap(r(40 * kg, 0), undefined, 2000);
          return `${v} mg${capped ? " (MAX)" : ""}`;
        },
      },
    ],
  },
  {
    id: "aminophylline-resp",
    name: "Aminophylline",
    category: "Respiratory",
    indication: "Critical asthma",
    warning: "Monitor HR and ECG. Loading dose required if not on theophylline.",
    doses: [
      {
        route: "IV Loading",
        formula: "5 mg/kg (max 500mg) over 20 min",
        type: "iv",
        calculate: (kg) => {
          const { v, capped } = cap(r(5 * kg, 0), undefined, 500);
          return `${v} mg Load${capped ? " (MAX)" : ""}`;
        },
      },
    ],
  },

  // ── ANALGESIA & SEDATION ───────────────────────────────────
  {
    id: "paracetamol",
    name: "Paracetamol",
    category: "Analgesia & Sedation",
    indication: "Pain / Fever",
    doses: [
      {
        route: "Oral / Rectal",
        formula: "15 mg/kg QDS (max 1g)",
        type: "oral",
        oralConcentrations: [{ label: "250mg/5ml", mgPerMl: 50 }, { label: "120mg/5ml", mgPerMl: 24 }],
        calculate: (kg) => {
          const { v, capped } = cap(r(15 * kg, 0), undefined, 1000);
          return `${v} mg${capped ? " (MAX)" : ""}`;
        },
      },
    ],
  },
  {
    id: "ibuprofen",
    name: "Ibuprofen",
    category: "Analgesia & Sedation",
    indication: "Pain / Fever / Anti-inflammatory",
    doses: [
      {
        route: "Oral",
        formula: "10 mg/kg TDS (max 400mg)",
        type: "oral",
        calculate: (kg) => {
          const { v, capped } = cap(r(10 * kg, 0), undefined, 400);
          return `${v} mg${capped ? " (MAX)" : ""}`;
        },
      },
    ],
  },
  {
    id: "morphine-analgesia",
    name: "Morphine",
    category: "Analgesia & Sedation",
    indication: "Severe pain",
    doses: [
      {
        route: "IV slow",
        formula: "0.1 mg/kg (max 10mg)",
        type: "iv",
        calculate: (kg) => {
          const { v, capped } = cap(r(0.1 * kg, 2), undefined, 10);
          return `${v} mg${capped ? " (MAX)" : ""}`;
        },
      },
    ],
  },
  {
    id: "ketamine-sedation",
    name: "Ketamine",
    category: "Analgesia & Sedation",
    indication: "Procedural sedation",
    doses: [
      {
        route: "IV",
        formula: "1 mg/kg",
        type: "iv",
        calculate: (kg) => `${r(kg, 1)} mg`,
      },
      {
        route: "IM",
        formula: "4 mg/kg",
        type: "im",
        calculate: (kg) => `${r(4 * kg, 1)} mg`,
      },
    ],
  },
  {
    id: "fentanyl-sedation",
    name: "Fentanyl",
    category: "Analgesia & Sedation",
    indication: "Rapid analgesia",
    doses: [
      {
        route: "IV",
        formula: "1 mcg/kg",
        type: "iv",
        calculate: (kg) => `${r(kg, 1)} mcg`,
      },
      {
        route: "IN (Intranasal)",
        formula: "1.5 mcg/kg",
        type: "other",
        calculate: (kg) => `${r(1.5 * kg, 1)} mcg`,
      },
    ],
  },

  // ── GI & ANTI-EMETICS ──────────────────────────────────────
  {
    id: "ondansetron-gi",
    name: "Ondansetron",
    category: "GI & Anti-emetics",
    indication: "Vomiting in GE",
    doses: [
      {
        route: "Oral / IV",
        formula: "8-15kg: 2mg | 15-30kg: 4mg | >30kg: 8mg",
        type: "oral",
        calculate: (kg) => {
          if (kg < 8) return "Not recom. <8kg";
          if (kg < 15) return "2 mg";
          if (kg < 30) return "4 mg";
          return "8 mg";
        },
      },
    ],
  },
  {
    id: "metoclopramide-gi",
    name: "Metoclopramide",
    category: "GI & Anti-emetics",
    indication: "Nausea / Vomiting (2nd line)",
    warning: "Risk of extrapyramidal effects.",
    doses: [
      {
        route: "Oral / IV",
        formula: "0.1 mg/kg TDS (max 10mg)",
        type: "iv",
        calculate: (kg) => {
          const { v, capped } = cap(r(0.1 * kg, 1), undefined, 10);
          return `${v} mg${capped ? " (MAX)" : ""}`;
        },
      },
    ],
  },
  {
    id: "omeprazole-gi",
    name: "Omeprazole",
    category: "GI & Anti-emetics",
    indication: "GORD / Gastritis",
    doses: [
      {
        route: "Oral",
        formula: "1 mg/kg OD (max 20mg)",
        type: "oral",
        calculate: (kg) => {
          const { v, capped } = cap(r(kg, 0), undefined, 20);
          return `${v} mg OD`;
        },
      },
    ],
  },
  {
    id: "domperidone-gi",
    name: "Domperidone",
    category: "GI & Anti-emetics",
    indication: "Vomiting",
    warning: "Risk of QT prolongation.",
    doses: [
      {
        route: "Oral",
        formula: "0.25 mg/kg TDS",
        type: "oral",
        calculate: (kg) => `${r(0.25 * kg, 2)} mg TDS`,
      },
    ],
  },

  // ── NEONATAL ───────────────────────────────────────────────
  {
    id: "vitamin-k-neo",
    name: "Vitamin K (Phytomenadione)",
    category: "Neonatal",
    indication: "Haemorrhagic disease prophylaxis",
    doses: [
      {
        route: "IM Stat",
        formula: "1 mg (single dose)",
        type: "im",
        calculate: () => "1 mg IM Stat",
      },
      {
        route: "Oral",
        formula: "2 mg Stat, then 2mg at day 7 and week 4",
        type: "oral",
        calculate: () => "2 mg Stat",
      },
    ],
  },
  {
    id: "caffeine-neo",
    name: "Caffeine Citrate",
    category: "Neonatal",
    indication: "Apnoea of prematurity",
    doses: [
      {
        route: "IV/Oral Loading",
        formula: "20 mg/kg Stat",
        type: "iv",
        calculate: (kg) => `${r(20 * kg, 1)} mg Load`,
      },
      {
        route: "IV/Oral Maint.",
        formula: "5-10 mg/kg OD",
        type: "iv",
        calculate: (kg) => `${r(5 * kg, 1)}–${r(10 * kg, 1)} mg OD`,
      },
    ],
  },
  {
    id: "surfactant-neo",
    name: "Poractant Alfa (Curosurf)",
    category: "Neonatal",
    indication: "Respiratory Distress Syndrome (RDS)",
    warning: "Administer via ETT only. Monitor SpO2 and HR.",
    doses: [
      {
        route: "Intratracheal",
        formula: "1.25–2.5 ml/kg (100–200 mg/kg)",
        type: "other",
        calculate: (kg) => `${r(1.25 * kg, 1)}–${r(2.5 * kg, 1)} ml (80mg/ml)`,
      },
    ],
  },
  {
    id: "prostaglandin-neo",
    name: "Prostaglandin E1 (Alprostadil)",
    category: "Neonatal",
    indication: "Duct-dependent CHD",
    warning: "Risk of apnoea. Intubation should be available.",
    doses: [
      {
        route: "IV Infusion",
        formula: "5–50 nanograms/kg/min",
        type: "iv",
        calculate: (kg) => `${r(5 * kg, 0)}–${r(50 * kg, 0)} ng/min`,
      },
    ],
  },

  // ── FLUIDS & ELECTROLYTES ──────────────────────────────────
  {
    id: "bolus-fluid",
    name: "Normal Saline Bolus",
    category: "Fluids & Electrolytes",
    indication: "Shock / Dehydration",
    doses: [
      {
        route: "IV rapid",
        formula: "20 ml/kg (Neonates/Cardiac: 10 ml/kg)",
        type: "iv",
        calculate: (kg) => `${r(20 * kg, 0)} ml (Standard 20ml/kg)`,
      },
    ],
  },
  {
    id: "dextrose-hypo",
    name: "Dextrose 10%",
    category: "Fluids & Electrolytes",
    indication: "Hypoglycaemia",
    doses: [
      {
        route: "IV Bolus",
        formula: "2 ml/kg of 10%",
        type: "iv",
        calculate: (kg) => `${r(2 * kg, 0)} ml of 10% Dextrose`,
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
