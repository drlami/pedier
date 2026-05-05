import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

/* =======================
   HELPER CALCULATIONS
======================= */

// Maintenance (Holiday-Segar)
const maintenanceRate = (w: number): number => {
  if (!w || w <= 0) return 0;
  if (w <= 10) return Math.round((100 * w) / 24);
  if (w <= 20) return Math.round((1000 + 50 * (w - 10)) / 24);
  return Math.round((1500 + 20 * (w - 20)) / 24);
};

// 3% bolus
const hypertonicBolus = (w: number): number => {
  if (!w) return 0;
  return Math.min(2 * w, 100);
};

// Sodium deficit
const sodiumDeficit = (w: number, Na: number, targetNa: number): number => {
  if (!w || !Na || Na >= targetNa) return 0;
  return 0.6 * w * (targetNa - Na);
};

// 3% infusion rate
const infusionRate = (deficit: number, hours: number): number => {
  if (!deficit || !hours) return 0;
  return ((deficit / 513) * 1000) / hours;
};

// Expected sodium rise (Adrogué–Madias)
const expectedNaRise = (
  currentNa: number,
  infusateNa: number,
  weight: number,
  volumeML: number
): number => {
  if (!currentNa || !weight || !volumeML) return 0;

  const TBW = 0.6 * weight;
  const volumeL = volumeML / 1000;

  return ((infusateNa - currentNa) / (TBW + 1)) * volumeL;
};

/* =======================
   PROTOCOL
======================= */

export const hyponatremiaProtocol: DiseaseProtocol = {
  id: 'hyponatremia',
  name: 'Hyponatremia',
  system: 'Electrolyte Disturbances',

  description:
    'Pediatric hyponatremia management with stepwise approach: initial NS resuscitation, followed by controlled correction if needed, with expected sodium rise calculation.',

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
      type: 'boolean'
    },

    {
      id: 'hasSevereSymptoms',
      questionText: 'Severe symptoms?',
      type: 'boolean',
      info: 'Seizure, coma'
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

  getManagement: (severity, data) => {
    const w = Number(data.weight);
    const Na = Number(data.sodiumLevel);
    const maint = maintenanceRate(w);

    const mgmt = [];

    // 🔴 EMERGENCY
    if (severity.level === 'severe') {
      mgmt.push({
        title: '🚨 Emergency',
        recommendations: [
          `3% NaCl bolus: 2 mL/kg = ${hypertonicBolus(w)} mL`,
          'Repeat if needed (max 3)',
          'Goal: +4–6 mEq/L'
        ]
      });
    }

    // 🔵 STAGE 1
    mgmt.push({
      title: '🔵 Initial Treatment',
      recommendations: [
        'Hypovolemic → 0.9% NS',
        `Rate ≈ maintenance: ${maint} mL/hr`,
        'Monitor Na every 2–4h',
      ]
    });

    // 🔴 STAGE 2
    const targetNa = 125;
    const deficit = sodiumDeficit(w, Na, targetNa);
    const rate = infusionRate(deficit, 24);

    const expected1L = expectedNaRise(Na, 513, w, 1000);

    mgmt.push({
      title: '🔁 If NOT improving → Controlled correction',
      recommendations: [
        `Target Na: ${targetNa}`,
        `Na deficit: ${deficit.toFixed(1)} mEq`,
        `3% rate: ${rate.toFixed(1)} mL/hr`,
        `Expected Na rise with 1L 3%: ~${expected1L.toFixed(2)} mEq/L`,
        'Correct over 24–48h',
      ]
    });

    mgmt.push({
      title: '⚠️ Safety',
      recommendations: [
        'Max correction 8–10 mEq/L/day',
        'If overcorrecting → D5W or DDAVP',
      ]
    });

    return mgmt;
  },

  getDrugDoses: (severity, data) => {
    const w = Number(data.weight);
    const Na = Number(data.sodiumLevel);

    const bolus = hypertonicBolus(w);
    const deficit = sodiumDeficit(w, Na, 125);
    const rate = infusionRate(deficit, 24);

    const expectedBolus = expectedNaRise(Na, 513, w, bolus);

    return [
      {
        drugName: '3% NaCl bolus',
        dose: `${bolus} mL`,
        notes: `Expected rise ≈ ${expectedBolus.toFixed(2)} mEq/L`
      },
      {
        drugName: '3% NaCl infusion',
        dose: `${rate.toFixed(1)} mL/hr`,
        notes: 'Adjust per Na'
      },
      {
        drugName: 'NS maintenance',
        dose: `${maintenanceRate(w)} mL/hr`,
        notes: 'Initial phase'
      }
    ];
  },

  getDisposition: (severity) => {
    if (severity.level === 'severe') return ['PICU'];
    return ['Admit'];
  },

  getRedFlags: () => [
    'Seizure',
    'Na <120',
    'Rapid correction',
  ],

  getReferences: () => [
    { title: 'European Hyponatremia Guidelines', url: 'https://academic.oup.com' }
  ],
};
