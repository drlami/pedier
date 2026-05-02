export type DrugCategory =
  | "Resuscitation"
  | "Seizure"
  | "Analgesia & Sedation"
  | "Respiratory"
  | "Antibiotics"
  | "Cardiovascular"
  | "Fluids & Electrolytes"
  | "Allergy & Anaphylaxis";

export const DRUG_CATEGORIES: DrugCategory[] = [
  "Resuscitation",
  "Seizure",
  "Analgesia & Sedation",
  "Respiratory",
  "Antibiotics",
  "Cardiovascular",
  "Fluids & Electrolytes",
  "Allergy & Anaphylaxis",
];

export const CATEGORY_COLOR: Record<DrugCategory, { bg: string; text: string; border: string }> = {
  "Resuscitation":         { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200" },
  "Seizure":               { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200" },
  "Analgesia & Sedation":  { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200" },
  "Respiratory":           { bg: "bg-sky-50",     text: "text-sky-700",     border: "border-sky-200" },
  "Antibiotics":           { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Cardiovascular":        { bg: "bg-pink-50",    text: "text-pink-700",    border: "border-pink-200" },
  "Fluids & Electrolytes": { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200" },
  "Allergy & Anaphylaxis": { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200" },
};

export interface DoseRow {
  route: string;
  formula: string;
  calculate: (kg: number) => string;
  caution?: string;
}

export interface DrugEntry {
  id: string;
  name: string;
  category: DrugCategory;
  indication?: string;
  warning?: string;
  doses: DoseRow[];
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
    indication: "Cardiac arrest / Anaphylaxis",
    warning: "Cardiac arrest → 1:10,000 IV/IO  |  Anaphylaxis → 1:1,000 IM",
    doses: [
      {
        route: "IV/IO — Cardiac Arrest",
        formula: "0.01 mg/kg of 1:10,000 (max 1 mg)",
        calculate: (kg) => {
          const { v, capped } = cap(r(0.01 * kg, 2), undefined, 1);
          const vol = r(v * 10, 1);
          return `${v} mg = ${vol} ml of 1:10,000${capped ? " (max 1 mg)" : ""}`;
        },
      },
      {
        route: "IM — Anaphylaxis",
        formula: "0.01 mg/kg of 1:1,000 (max 0.5 mg)",
        calculate: (kg) => {
          const { v, capped } = cap(r(0.01 * kg, 2), undefined, 0.5);
          const vol = r(v, 2);
          return `${v} mg = ${vol} ml of 1:1,000${capped ? " (max 0.5 mg)" : ""}`;
        },
      },
    ],
  },
  {
    id: "atropine",
    name: "Atropine",
    category: "Resuscitation",
    indication: "Bradycardia, organophosphate poisoning",
    doses: [
      {
        route: "IV/IO",
        formula: "0.02 mg/kg (min 0.1 mg, max 0.5 mg)",
        calculate: (kg) => {
          const { v } = cap(r(0.02 * kg, 2), 0.1, 0.5);
          const vol = r(v / 0.6, 2);
          return `${v} mg = ${vol} ml (600 mcg/ml)`;
        },
      },
    ],
  },
  {
    id: "adenosine",
    name: "Adenosine",
    category: "Resuscitation",
    indication: "SVT",
    warning: "Rapid IV push — immediately follow with saline flush",
    doses: [
      {
        route: "IV rapid push",
        formula: "1st dose 0.1 mg/kg (max 6 mg) → 2nd dose 0.2 mg/kg (max 12 mg)",
        calculate: (kg) => {
          const d1 = cap(r(0.1 * kg, 2), undefined, 6).v;
          const d2 = cap(r(0.2 * kg, 2), undefined, 12).v;
          return `1st: ${d1} mg  |  2nd: ${d2} mg`;
        },
      },
    ],
  },
  {
    id: "sodium-bicarb",
    name: "Sodium Bicarbonate",
    category: "Resuscitation",
    indication: "Severe metabolic acidosis, hyperkalaemia",
    warning: "Dilute to 4.2% for neonates. Flush line before & after.",
    doses: [
      {
        route: "IV slow",
        formula: "1 mmol/kg = 1 ml/kg of 8.4% (max 50 mmol)",
        calculate: (kg) => {
          const { v, capped } = cap(r(kg, 0), undefined, 50);
          return `${v} mmol = ${v} ml of 8.4%${capped ? " (max 50 mmol)" : ""}`;
        },
      },
    ],
  },
  {
    id: "calcium-gluconate-resus",
    name: "Calcium Gluconate",
    category: "Resuscitation",
    indication: "Hypocalcaemia, hyperkalaemia, Ca-channel blocker OD",
    warning: "Infuse slowly — monitor ECG. Extravasation causes tissue necrosis.",
    doses: [
      {
        route: "IV slow (over 10 min)",
        formula: "0.1 ml/kg of 10% solution (max 10 ml)",
        calculate: (kg) => {
          const { v, capped } = cap(r(0.1 * kg, 1), undefined, 10);
          return `${v} ml of 10% calcium gluconate${capped ? " (max 10 ml)" : ""}`;
        },
      },
    ],
  },

  // ── SEIZURE ────────────────────────────────────────────────
  {
    id: "lorazepam",
    name: "Lorazepam",
    category: "Seizure",
    indication: "Status epilepticus — 1st line IV",
    doses: [
      {
        route: "IV/IO",
        formula: "0.1 mg/kg (max 4 mg)",
        calculate: (kg) => {
          const { v, capped } = cap(r(0.1 * kg, 2), undefined, 4);
          const vol = r(v / 4, 2);
          return `${v} mg = ${vol} ml (4 mg/ml)${capped ? " (max 4 mg)" : ""}`;
        },
      },
    ],
  },
  {
    id: "midazolam",
    name: "Midazolam",
    category: "Seizure",
    indication: "Status epilepticus",
    doses: [
      {
        route: "Buccal",
        formula: "0.5 mg/kg (max 10 mg)",
        calculate: (kg) => {
          const { v, capped } = cap(r(0.5 * kg, 1), undefined, 10);
          const vol = r(v / 10, 2);
          return `${v} mg = ${vol} ml (10 mg/ml buccal)${capped ? " (max 10 mg)" : ""}`;
        },
      },
      {
        route: "IV",
        formula: "0.1–0.15 mg/kg (max 10 mg)",
        calculate: (kg) => {
          const lo = cap(r(0.1 * kg, 2), undefined, 10).v;
          const hi = cap(r(0.15 * kg, 2), undefined, 10).v;
          return `${lo}–${hi} mg`;
        },
      },
      {
        route: "IM / Intranasal",
        formula: "0.2 mg/kg (max 10 mg)",
        calculate: (kg) => {
          const { v, capped } = cap(r(0.2 * kg, 2), undefined, 10);
          return `${v} mg${capped ? " (max 10 mg)" : ""}`;
        },
      },
    ],
  },
  {
    id: "diazepam",
    name: "Diazepam",
    category: "Seizure",
    indication: "Seizure (rectal or IV)",
    doses: [
      {
        route: "Rectal",
        formula: "0.5 mg/kg (max 10 mg)",
        calculate: (kg) => {
          const { v, capped } = cap(r(0.5 * kg, 1), undefined, 10);
          return `${v} mg${capped ? " (max 10 mg)" : ""}`;
        },
      },
      {
        route: "IV slow",
        formula: "0.3 mg/kg (max 10 mg)",
        calculate: (kg) => {
          const { v, capped } = cap(r(0.3 * kg, 2), undefined, 10);
          const vol = r(v / 5, 2);
          return `${v} mg = ${vol} ml (5 mg/ml)${capped ? " (max 10 mg)" : ""}`;
        },
      },
    ],
  },
  {
    id: "levetiracetam",
    name: "Levetiracetam (Keppra)",
    category: "Seizure",
    indication: "Status epilepticus — 2nd line",
    doses: [
      {
        route: "IV over 15 min",
        formula: "40–60 mg/kg (max 3000 mg)",
        calculate: (kg) => {
          const lo = cap(r(40 * kg, 0), undefined, 3000).v;
          const hi = cap(r(60 * kg, 0), undefined, 3000).v;
          return `${lo}–${hi} mg${hi >= 3000 ? " (max 3000 mg)" : ""}`;
        },
      },
    ],
  },
  {
    id: "phenytoin",
    name: "Phenytoin",
    category: "Seizure",
    indication: "Status epilepticus — 2nd line",
    warning: "≤1 mg/kg/min infusion rate. Continuous cardiac monitoring required.",
    doses: [
      {
        route: "IV over 20 min",
        formula: "20 mg/kg (max 1000 mg)",
        calculate: (kg) => {
          const { v, capped } = cap(r(20 * kg, 0), undefined, 1000);
          return `${v} mg${capped ? " (max 1000 mg)" : ""}`;
        },
      },
    ],
  },

  // ── ANALGESIA & SEDATION ───────────────────────────────────
  {
    id: "paracetamol",
    name: "Paracetamol (Acetaminophen)",
    category: "Analgesia & Sedation",
    indication: "Analgesia, antipyresis",
    doses: [
      {
        route: "Oral / PR",
        formula: "15 mg/kg (max 1000 mg)",
        calculate: (kg) => {
          const { v, capped } = cap(r(15 * kg, 0), undefined, 1000);
          return `${v} mg${capped ? " (max 1000 mg)" : ""}`;
        },
      },
      {
        route: "IV over 15 min",
        formula: "15 mg/kg (max 1000 mg)",
        calculate: (kg) => {
          const { v, capped } = cap(r(15 * kg, 0), undefined, 1000);
          const vol = r(v / 10, 1);
          return `${v} mg = ${vol} ml (10 mg/ml)${capped ? " (max 1000 mg)" : ""}`;
        },
      },
    ],
  },
  {
    id: "ibuprofen",
    name: "Ibuprofen",
    category: "Analgesia & Sedation",
    indication: "Analgesia, antipyresis — avoid in asthma / renal impairment",
    doses: [
      {
        route: "Oral",
        formula: "10 mg/kg (max 400 mg)",
        calculate: (kg) => {
          const { v, capped } = cap(r(10 * kg, 0), undefined, 400);
          return `${v} mg${capped ? " (max 400 mg)" : ""}`;
        },
      },
    ],
  },
  {
    id: "morphine",
    name: "Morphine",
    category: "Analgesia & Sedation",
    indication: "Moderate–severe pain",
    warning: "Have naloxone available. Monitor respiratory rate and SpO₂.",
    doses: [
      {
        route: "IV slow",
        formula: "0.1 mg/kg (max 10 mg)",
        calculate: (kg) => {
          const { v, capped } = cap(r(0.1 * kg, 2), undefined, 10);
          return `${v} mg${capped ? " (max 10 mg)" : ""}`;
        },
      },
      {
        route: "Oral",
        formula: "0.2–0.5 mg/kg (max 10 mg)",
        calculate: (kg) => {
          const lo = cap(r(0.2 * kg, 2), undefined, 10).v;
          const hi = cap(r(0.5 * kg, 2), undefined, 10).v;
          return `${lo}–${hi} mg`;
        },
      },
    ],
  },
  {
    id: "fentanyl",
    name: "Fentanyl",
    category: "Analgesia & Sedation",
    indication: "Procedural analgesia / sedation",
    warning: "Rapid IV may cause chest-wall rigidity. Give slowly.",
    doses: [
      {
        route: "IV slow",
        formula: "1–2 mcg/kg (max 100 mcg)",
        calculate: (kg) => {
          const lo = cap(r(kg, 1), undefined, 100).v;
          const hi = cap(r(2 * kg, 1), undefined, 100).v;
          return `${lo}–${hi} mcg`;
        },
      },
      {
        route: "Intranasal",
        formula: "1.5 mcg/kg (max 100 mcg)",
        calculate: (kg) => {
          const { v, capped } = cap(r(1.5 * kg, 1), undefined, 100);
          const vol = r(v / 50, 2);
          return `${v} mcg = ${vol} ml (50 mcg/ml)${capped ? " (max 100 mcg)" : ""}`;
        },
      },
    ],
  },
  {
    id: "ketamine",
    name: "Ketamine",
    category: "Analgesia & Sedation",
    indication: "Procedural sedation / dissociative analgesia",
    warning: "Maintain airway patency. Have suction and bag-mask at bedside.",
    doses: [
      {
        route: "IV over 1 min",
        formula: "Sedation 1–2 mg/kg  |  Analgesia 0.5–1 mg/kg  (max 200 mg)",
        calculate: (kg) => {
          const sLo = cap(r(kg, 1), undefined, 200).v;
          const sHi = cap(r(2 * kg, 1), undefined, 200).v;
          const aHi = cap(r(kg, 1), undefined, 200).v;
          return `Sedation: ${sLo}–${sHi} mg  |  Analgesia: ≤${aHi} mg`;
        },
      },
      {
        route: "IM",
        formula: "4–5 mg/kg (max 500 mg)",
        calculate: (kg) => {
          const lo = cap(r(4 * kg, 1), undefined, 500).v;
          const hi = cap(r(5 * kg, 1), undefined, 500).v;
          return `${lo}–${hi} mg`;
        },
      },
    ],
  },
  {
    id: "naloxone",
    name: "Naloxone",
    category: "Analgesia & Sedation",
    indication: "Opioid reversal",
    warning: "Short half-life — repeat doses or infusion may be needed.",
    doses: [
      {
        route: "IV/IO/IM",
        formula: "0.01 mg/kg, titrate to effect (max 0.4 mg per dose)",
        calculate: (kg) => {
          const { v, capped } = cap(r(0.01 * kg, 3), undefined, 0.4);
          const vol = r(v / 0.4, 3);
          return `${v} mg = ${vol} ml (400 mcg/ml)${capped ? " (max 0.4 mg)" : ""}`;
        },
      },
    ],
  },

  // ── RESPIRATORY ────────────────────────────────────────────
  {
    id: "salbutamol",
    name: "Salbutamol (Albuterol)",
    category: "Respiratory",
    indication: "Acute asthma / bronchospasm",
    doses: [
      {
        route: "Nebulised",
        formula: "<20 kg → 2.5 mg  |  ≥20 kg → 5 mg",
        calculate: (kg) => {
          const dose = kg < 20 ? 2.5 : 5;
          const vol = dose === 2.5 ? 0.5 : 1;
          return `${dose} mg (${vol} ml of 5 mg/ml) + 2.5 ml 0.9% NaCl`;
        },
      },
      {
        route: "IV infusion — severe",
        formula: "5 mcg/kg/min loading, then 1–5 mcg/kg/min",
        calculate: (kg) => {
          const load = r(5 * kg, 1);
          return `Loading rate: ${load} mcg/min (per local IV protocol)`;
        },
      },
    ],
  },
  {
    id: "ipratropium",
    name: "Ipratropium Bromide",
    category: "Respiratory",
    indication: "Severe acute asthma (first 3 doses with salbutamol)",
    doses: [
      {
        route: "Nebulised",
        formula: "<6 yr ≈ <20 kg → 125 mcg  |  ≥6 yr → 250 mcg",
        calculate: (kg) => {
          const dose = kg < 20 ? 125 : 250;
          return `${dose} mcg`;
        },
        caution: "Age estimated from weight — confirm actual age",
      },
    ],
  },
  {
    id: "adrenaline-neb",
    name: "Nebulised Adrenaline",
    category: "Respiratory",
    indication: "Croup (moderate–severe)",
    doses: [
      {
        route: "Nebulised",
        formula: "0.5 ml/kg of 1:1,000 (max 5 ml)",
        calculate: (kg) => {
          const { v, capped } = cap(r(0.5 * kg, 1), undefined, 5);
          return `${v} ml of 1:1,000 adrenaline${capped ? " (max 5 ml)" : ""}`;
        },
      },
    ],
  },
  {
    id: "dexamethasone",
    name: "Dexamethasone",
    category: "Respiratory",
    indication: "Croup, acute asthma",
    doses: [
      {
        route: "Oral / IV",
        formula: "Croup 0.15 mg/kg  |  Asthma 0.3 mg/kg  (max 10 mg)",
        calculate: (kg) => {
          const croup = cap(r(0.15 * kg, 2), undefined, 10).v;
          const asthma = cap(r(0.3 * kg, 2), undefined, 10).v;
          return `Croup: ${croup} mg  |  Asthma: ${asthma} mg`;
        },
      },
    ],
  },
  {
    id: "prednisolone",
    name: "Prednisolone",
    category: "Respiratory",
    indication: "Asthma, croup, inflammatory conditions",
    doses: [
      {
        route: "Oral",
        formula: "1–2 mg/kg (max 40 mg)",
        calculate: (kg) => {
          const lo = cap(r(1 * kg, 0), undefined, 40).v;
          const hi = cap(r(2 * kg, 0), undefined, 40).v;
          return `${lo}–${hi} mg${hi >= 40 ? " (max 40 mg)" : ""}`;
        },
      },
    ],
  },
  {
    id: "hydrocortisone",
    name: "Hydrocortisone",
    category: "Respiratory",
    indication: "Severe asthma, anaphylaxis, adrenal crisis",
    doses: [
      {
        route: "IV",
        formula: "4 mg/kg (max 100 mg)",
        calculate: (kg) => {
          const { v, capped } = cap(r(4 * kg, 0), undefined, 100);
          return `${v} mg${capped ? " (max 100 mg)" : ""}`;
        },
      },
    ],
  },
  {
    id: "magnesium",
    name: "Magnesium Sulphate",
    category: "Respiratory",
    indication: "Severe acute asthma",
    warning: "Infuse over 20 minutes. Monitor BP and respiratory rate.",
    doses: [
      {
        route: "IV over 20 min",
        formula: "25–40 mg/kg (max 2000 mg)",
        calculate: (kg) => {
          const lo = cap(r(25 * kg, 0), undefined, 2000).v;
          const hi = cap(r(40 * kg, 0), undefined, 2000).v;
          return `${lo}–${hi} mg${hi >= 2000 ? " (max 2000 mg)" : ""}`;
        },
      },
    ],
  },

  // ── ANTIBIOTICS ────────────────────────────────────────────
  {
    id: "amoxicillin",
    name: "Amoxicillin",
    category: "Antibiotics",
    indication: "Chest infection, otitis media, strep throat",
    doses: [
      {
        route: "Oral",
        formula: "25 mg/kg (max 500 mg standard  |  1000 mg severe)",
        calculate: (kg) => {
          const { v, capped } = cap(r(25 * kg, 0), undefined, 500);
          return `${v} mg${capped ? " (max 500 mg; up to 1000 mg for severe)" : ""}`;
        },
      },
    ],
  },
  {
    id: "ceftriaxone",
    name: "Ceftriaxone",
    category: "Antibiotics",
    indication: "Sepsis, meningitis, severe infections",
    warning: "Do NOT co-administer with calcium-containing IV fluids (neonates).",
    doses: [
      {
        route: "IV/IM",
        formula: "Sepsis 50 mg/kg (max 2 g)  |  Meningitis 100 mg/kg (max 4 g)",
        calculate: (kg) => {
          const sepsis = cap(r(50 * kg, 0), undefined, 2000).v;
          const mening = cap(r(100 * kg, 0), undefined, 4000).v;
          return `Sepsis: ${sepsis} mg  |  Meningitis: ${mening} mg`;
        },
      },
    ],
  },
  {
    id: "benzylpenicillin",
    name: "Benzylpenicillin (Penicillin G)",
    category: "Antibiotics",
    indication: "Meningococcal disease, severe streptococcal infections",
    doses: [
      {
        route: "IV/IO",
        formula: "60 mg/kg (max 2400 mg)",
        calculate: (kg) => {
          const { v, capped } = cap(r(60 * kg, 0), undefined, 2400);
          return `${v} mg${capped ? " (max 2400 mg)" : ""}`;
        },
      },
    ],
  },
  {
    id: "gentamicin",
    name: "Gentamicin",
    category: "Antibiotics",
    indication: "Gram-negative sepsis",
    warning: "Monitor trough levels (<1 mg/L). Nephrotoxic and ototoxic.",
    doses: [
      {
        route: "IV over 30 min",
        formula: "7 mg/kg once daily (max 320 mg) — verify local protocol",
        calculate: (kg) => {
          const { v, capped } = cap(r(7 * kg, 0), undefined, 320);
          return `${v} mg${capped ? " (max 320 mg)" : ""}`;
        },
      },
    ],
  },
  {
    id: "metronidazole",
    name: "Metronidazole",
    category: "Antibiotics",
    indication: "Anaerobic infections, abdominal sepsis",
    doses: [
      {
        route: "IV over 20 min",
        formula: "7.5 mg/kg (max 500 mg)",
        calculate: (kg) => {
          const { v, capped } = cap(r(7.5 * kg, 0), undefined, 500);
          return `${v} mg${capped ? " (max 500 mg)" : ""}`;
        },
      },
      {
        route: "Oral",
        formula: "7.5 mg/kg (max 400 mg)",
        calculate: (kg) => {
          const { v, capped } = cap(r(7.5 * kg, 0), undefined, 400);
          return `${v} mg${capped ? " (max 400 mg)" : ""}`;
        },
      },
    ],
  },

  // ── CARDIOVASCULAR ─────────────────────────────────────────
  {
    id: "amiodarone",
    name: "Amiodarone",
    category: "Cardiovascular",
    indication: "Shock-resistant VF/VT, SVT",
    warning: "Continuous cardiac monitoring. Infuse slowly for non-arrest.",
    doses: [
      {
        route: "IV/IO — Cardiac Arrest",
        formula: "5 mg/kg rapid bolus (max 300 mg)",
        calculate: (kg) => {
          const { v, capped } = cap(r(5 * kg, 0), undefined, 300);
          return `${v} mg${capped ? " (max 300 mg)" : ""}`;
        },
      },
    ],
  },

  // ── FLUIDS & ELECTROLYTES ──────────────────────────────────
  {
    id: "fluid-bolus",
    name: "IV Fluid Bolus (0.9% NaCl)",
    category: "Fluids & Electrolytes",
    indication: "Hypovolaemia, septic shock",
    warning: "Reassess after each bolus. Avoid in cardiogenic shock.",
    doses: [
      {
        route: "IV rapid",
        formula: "10–20 ml/kg (max 500 ml per bolus)",
        calculate: (kg) => {
          const lo = cap(r(10 * kg, 0), undefined, 500).v;
          const hi = cap(r(20 * kg, 0), undefined, 500).v;
          return `${lo}–${hi} ml`;
        },
      },
    ],
  },
  {
    id: "glucose",
    name: "Glucose 10% (Dextrose)",
    category: "Fluids & Electrolytes",
    indication: "Hypoglycaemia",
    warning: "Use 10% glucose in children. Avoid hypertonic 50% solution.",
    doses: [
      {
        route: "IV",
        formula: "2 ml/kg of 10% glucose",
        calculate: (kg) => {
          const vol = r(2 * kg, 0);
          const g = r(0.2 * kg, 1);
          return `${vol} ml of 10% glucose (= ${g} g dextrose)`;
        },
      },
    ],
  },

  // ── ALLERGY & ANAPHYLAXIS ──────────────────────────────────
  {
    id: "chlorphenamine",
    name: "Chlorphenamine",
    category: "Allergy & Anaphylaxis",
    indication: "Anaphylaxis (adjunct), allergic reactions",
    doses: [
      {
        route: "IV slow / IM",
        formula: "0.1 mg/kg (max 10 mg)",
        calculate: (kg) => {
          const { v, capped } = cap(r(0.1 * kg, 2), undefined, 10);
          return `${v} mg${capped ? " (max 10 mg)" : ""}`;
        },
      },
    ],
  },
];
