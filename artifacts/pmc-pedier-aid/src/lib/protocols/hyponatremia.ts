import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

/* =======================
   HELPERS
======================= */

const maintenanceRate = (w: number): number => {
  if (!w || w <= 0) return 0;
  if (w <= 10) return Math.round((100 * w) / 24);
  if (w <= 20) return Math.round((1000 + 50 * (w - 10)) / 24);
  return Math.round((1500 + 20 * (w - 20)) / 24);
};

const hypertonicBolus = (w: number): number => {
  if (!w) return 0;
  return Math.min(2 * w, 100);
};

/* =======================
   PROTOCOL
======================= */

export const hyponatremiaProtocol: DiseaseProtocol = {
  id: 'hyponatremia',
  name: 'Hyponatremia',
  system: 'Electrolyte Disturbances',

  description:
    'Pediatric hyponatremia management using symptom-based emergency treatment, volume status, and controlled correction strategies.',

  image: {
    url: "https://picsum.photos/seed/hyponatremia/600/400",
    hint: "brain edema"
  },

  questions: [
    { id: 'weight', questionText: 'Weight', type: 'number', unit: 'kg' },
    { id: 'sodiumLevel', questionText: 'Serum Na+', type: 'number', unit: 'mEq/L' },

    {
      id: 'isAcute',
      questionText: 'Acute (<48h)?',
      type: 'boolean',
      info: 'If unknown → treat as chronic'
    },

    {
      id: 'hasSevereSymptoms',
      questionText: 'Severe neurologic symptoms?',
      type: 'boolean',
      info: 'Seizure, coma, respiratory arrest'
    },

    {
      id: 'volumeStatus',
      questionText: 'Volume status',
      type: 'select',
      options: [
        { label: '💧 Hypovolemic', value: 'hypo' },
        { label: '⚖️ Euvolemic (SIADH)', value: 'eu' },
        { label: '🧂 Hypervolemic', value: 'hyper' },
      ],
    },
  ],

  /* =======================
     SEVERITY
  ======================= */

  calculateSeverity: (data: FormData): Severity => {
    const Na = Number(data.sodiumLevel);

    if (data.hasSevereSymptoms || Na < 120) {
      return { level: 'severe', details: ['Emergency hyponatremia'] };
    }

    if (Na < 125) {
      return { level: 'moderate', details: ['Moderate hyponatremia'] };
    }

    if (Na < 135) {
      return { level: 'mild', details: ['Mild hyponatremia'] };
    }

    return { level: 'unknown', details: [] };
  },

  /* =======================
     MANAGEMENT
  ======================= */

  getManagement: (severity, data) => {
    const w = Number(data.weight);
    const Na = Number(data.sodiumLevel);
    const maint = maintenanceRate(w);

    const mgmt = [];

    /* 🔴 EMERGENCY */
    if (severity.level === 'severe') {
      mgmt.push({
        title: '🚨 Emergency Management (HTS Bolus)',
        recommendations: [
          `Give 3% NaCl: 2 mL/kg = ${hypertonicBolus(w)} mL over 10–15 min`,
          "Repeat every 10–15 min if symptoms persist (max 3 boluses)",

          "STOP boluses when:",
          "• Seizure stops / mental status improves",
          "• OR Na rises by ~4–6 mEq/L",

          "After stopping → reassess and switch to controlled correction",
        ]
      });
    }

    /* 🔵 INITIAL MANAGEMENT */
    mgmt.push({
      title: '🔵 Initial Treatment (Based on Volume)',
      recommendations: [
        "Hypovolemic → 0.9% Normal Saline",
        `Suggested rate: ~${maint} mL/hr (maintenance)`,

        "Euvolemic (SIADH) → Fluid restriction (50–70% maintenance)",
        "Hypervolemic → Fluid restriction + diuretics",

        "Monitor sodium every 2–4 hours",
      ]
    });

    /* 🔁 ESCALATION */
    mgmt.push({
      title: '🔁 If NOT Improving with Normal Saline',
      recommendations: [
        "Start controlled hypertonic saline infusion:",
        "3% NaCl at 0.5–1 mL/kg/hour",

        "Use lower end initially and titrate",

        "Goal: slow correction ≤ 8–10 mEq/L per 24 hours",

        "⚠️ Recheck Na BEFORE starting HTS (may already be rising)",
      ]
    });

    /* 🔄 RATE ADJUSTMENT */
    mgmt.push({
      title: '🔄 Adjusting IV Fluid Rate',
      recommendations: [
        "Check Na every 2–4 hours",

        "If Na rising appropriately → continue same rate",

        "If Na rising TOO FAST (>0.5 mEq/L/hr):",
        "• STOP or reduce HTS",
        "• Consider D5W",
        "• Consider Desmopressin (DDAVP)",

        "If Na NOT rising:",
        "• Increase HTS rate slightly (do not exceed 1 mL/kg/hr)",
        "• Reassess cause (ongoing losses, SIADH)",

      ]
    });

    /* ⚠️ SAFETY */
    mgmt.push({
      title: '⚠️ Safety Rules',
      recommendations: [
        "Max correction: ≤ 8–10 mEq/L in 24 hours",

        "High risk of Osmotic Demyelination if overcorrected",

        "After NS in hypovolemia → Na may rise rapidly (auto-correction)",

        "Always reassess before escalating therapy",
      ]
    });

    return mgmt;
  },

  /* =======================
     DISPOSITION
  ======================= */

  getDisposition: (severity) => {
    if (severity.level === 'severe') {
      return ["PICU admission required"];
    }

    return ["Admit for monitoring and controlled correction"];
  },

  /* =======================
     RED FLAGS
  ======================= */

  getRedFlags: () => [
    "Seizure or coma",
    "Na <120",
    "Rapid Na drop",
    "Correction >10 mEq/L/day",
  ],

  /* =======================
     DRUG DOSES
  ======================= */

  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    const maint = maintenanceRate(w);

    return [
      {
        drugName: "3% NaCl bolus",
        dose: `${hypertonicBolus(w)} mL`,
        notes: "2 mL/kg over 10–15 min (max 100 mL)"
      },
      {
        drugName: "3% NaCl infusion",
        dose: `${(0.5 * w).toFixed(1)} – ${(1 * w).toFixed(1)} mL/hr`,
        notes: "Controlled correction (0.5–1 mL/kg/hr)"
      },
      {
        drugName: "Normal Saline",
        dose: `${maint} mL/hr`,
        notes: "Initial treatment for hypovolemic hyponatremia"
      }
    ];
  },

  /* =======================
     REFERENCES
  ======================= */

  getReferences: () => [
    { title: "RCH Pediatric Hyponatremia Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/hyponatraemia/" },
    { title: "European Hyponatremia Guidelines", url: "https://academic.oup.com" },
  ],
};
