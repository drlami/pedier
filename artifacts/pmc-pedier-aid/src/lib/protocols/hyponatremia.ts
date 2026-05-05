import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const hyponatremiaProtocol: DiseaseProtocol = {
  id: 'hyponatremia',
  name: 'Hyponatremia',
  system: 'Electrolyte Disturbances',

  description:
    'Pediatric hyponatremia management based on symptoms, sodium level (mEq/L), duration, and volume status. Focus on safe correction to prevent cerebral edema and osmotic demyelination.',

  image: {
    url: "https://picsum.photos/seed/hyponatremia/600/400",
    hint: "brain edema"
  },

  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },

    { id: 'sodiumLevel', questionText: 'Serum Sodium (Na+)', type: 'number', unit: 'mEq/L' },

    {
      id: 'isAcute',
      questionText: 'Is hyponatremia acute (<48 hours)?',
      type: 'boolean',
      info: 'If unknown → treat as chronic.'
    },

    {
      id: 'hasSevereSymptoms',
      questionText: 'Severe neurologic symptoms?',
      type: 'boolean',
      info: 'Seizure, coma, respiratory arrest.'
    },

    {
      id: 'volumeStatus',
      questionText: 'Volume Status',
      type: 'select',
      options: [
        { label: '💧 Hypovolemic', value: 'hypovolemic' },
        { label: '⚖️ Euvolemic (SIADH likely)', value: 'euvolemic' },
        { label: '🧂 Hypervolemic', value: 'hypervolemic' },
      ],
    },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const sodium = Number(data.sodiumLevel);

    if (data.hasSevereSymptoms) {
      return {
        level: 'severe',
        details: ['Severe symptomatic hyponatremia → neurologic emergency']
      };
    }

    if (sodium < 120) {
      return {
        level: 'severe',
        details: ['Very severe hyponatremia (Na <120)']
      };
    }

    if (sodium < 125) {
      return {
        level: 'moderate',
        details: ['Moderate hyponatremia (120–125)']
      };
    }

    if (sodium < 135) {
      return {
        level: 'mild',
        details: ['Mild hyponatremia (125–134)']
      };
    }

    return { level: 'unknown', details: [] };
  },

  getManagement: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const sodium = Number(data.sodiumLevel);
    const isAcute = Boolean(data.isAcute);

    const management = [];

    // 🔴 EMERGENCY
    if (severity.level === 'severe' || data.hasSevereSymptoms) {
      management.push({
        title: "🚨 Emergency Management",
        recommendations: [
          "Goal: raise Na by 4–6 mEq/L rapidly to stop seizures",
          `Give 3% NaCl: 2 mL/kg IV bolus (max 100 mL)`,
          "Repeat every 10–15 min if symptoms persist (max 3 doses)",
          "Once symptoms improve → STOP boluses",
          "Then switch to slow correction",
        ]
      });
    }

    // 🔵 GENERAL PRINCIPLES
    management.push({
      title: "⚠️ Correction Safety",
      recommendations: [
        "Chronic/unknown → max 8–10 mEq/L per 24h",
        "Acute → can correct faster (1–2 mEq/L/hr initially)",
        "Avoid overcorrection → risk of Osmotic Demyelination Syndrome",
      ]
    });

    // 🔵 VOLUME BASED MANAGEMENT
    switch (data.volumeStatus) {
      case 'hypovolemic':
        management.push({
          title: "Hypovolemic Hyponatremia",
          recommendations: [
            "Give 0.9% Normal Saline",
            "Restores volume → suppresses ADH → auto-corrects Na",
          ]
        });
        break;

      case 'euvolemic':
        management.push({
          title: "Euvolemic (SIADH)",
          recommendations: [
            "Fluid restriction",
            "Treat underlying cause (CNS, infection, meds)",
          ]
        });
        break;

      case 'hypervolemic':
        management.push({
          title: "Hypervolemic",
          recommendations: [
            "Fluid restriction + diuretics",
            "Treat underlying cause (heart failure, renal, liver)",
          ]
        });
        break;
    }

    // 🔵 MONITORING
    management.push({
      title: "Monitoring",
      recommendations: [
        "Check Na every 2–4 hours",
        "Strict input/output",
        "Stop correction if Na rising too fast",
        "Target: +4–6 mEq initial, then slow correction",
      ]
    });

    return management;
  },

  getDisposition: (severity) => {
    if (severity.level === 'severe') {
      return ["PICU admission mandatory"];
    }

    return ["Admit for monitoring"];
  },

  getRedFlags: () => [
    "Seizure or coma",
    "Na <120",
    "Rapid Na drop",
    "Overcorrection >10 mEq/L/day"
  ],

  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;

    return [
      {
        drugName: "3% Hypertonic Saline",
        dose: weight > 0 ? `${(2 * weight).toFixed(1)} mL` : "2 mL/kg",
        notes: "Bolus over 10–15 min for severe symptoms"
      },
      {
        drugName: "Target Correction",
        dose: "4–6 mEq/L initial rise",
        notes: "Then slow correction"
      },
      {
        drugName: "Max Daily Correction",
        dose: "≤ 8–10 mEq/L",
        notes: "Prevent ODS"
      }
    ];
  },

  getReferences: () => [
    { title: "AAP Pediatric Care", url: "https://publications.aap.org" },
    { title: "European Hyponatremia Guidelines", url: "https://academic.oup.com" }
  ],
};
