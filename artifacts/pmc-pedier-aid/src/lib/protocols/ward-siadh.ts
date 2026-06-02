import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: SIADH (Syndrome of Inappropriate Antidiuretic Hormone)
 * MASTER MANAGEMENT PATHWAY (MMP)
 */
export const wardSiadhProtocol: DiseaseProtocol = {
  id: 'ward-siadh',
  name: 'SIADH Master Pathway',
  system: 'Endocrinology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'The Syndrome of Inappropriate Antidiuretic Hormone (SIADH) is characterized by excessive unsuppressible release of ADH, leading to water retention, dilutional hyponatremia, and concentrated urine. It is commonly secondary to CNS infections, pulmonary disease, or specific medications. Management centers on fluid restriction and, in severe cases, controlled sodium correction.',
  image: {
    url: "https://images.unsplash.com/photo-1579154235828-ac01e51be880?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Fluid and electrolyte balance"
  },
  questions: [
    { id: 'weight', questionText: 'Current Body Weight', type: 'number', unit: 'kg' },
    { id: 'serum_na', questionText: 'Serum Sodium (Na+)', type: 'number', unit: 'mmol/L' },
    { id: 'serum_osm', questionText: 'Serum Osmolality', type: 'number', unit: 'mOsm/kg' },
    { id: 'urine_na', questionText: 'Urine Sodium', type: 'number', unit: 'mmol/L' },
    { id: 'urine_osm', questionText: 'Urine Osmolality', type: 'number', unit: 'mOsm/kg' },
  ], 

  mmpData: {
    snapshot: "Diagnosis requires Hyponatremia (< 135) with low Serum Osmolality (< 275) but inappropriately concentrated Urine Osmolality (> 100) and high Urine Sodium (> 30). Ensure the patient is euvolemic. The primary treatment is strict Fluid Restriction (50-75% of maintenance). Symptomatic hyponatremia (seizures) is a medical emergency requiring 3% Hypertonic Saline.",
    stages: [
      {
        label: "Stage 1: Diagnostic Confirmation",
        shortLabel: "Diagnosis",
        color: "blue",
        cards: [
          {
            title: "Verification Criteria [DR]",
            threshold: "BEFORE RESTRICTING FLUIDS",
            orders: [
              "Serum Sodium < 135 mmol/L AND Serum Osmolality < 275 mOsm/kg.",
              "Urine Osmolality > 100 mOsm/kg AND Urine Sodium > 30 mmol/L.",
              "Euvolemia: Patient must NOT have signs of dehydration (hypovolemia) or edema (hypervolemia).",
              "Exclude Alternatives: Normal Thyroid Function (TSH), Normal Adrenal Function (Cortisol), and no diuretic use."
            ]
          },
          {
            title: "Nursing: Baseline Assessment [NS]",
            nursing: [
              "Record accurate baseline weight.",
              "Establish strict Intake & Output (I/O) monitoring.",
              "Neuro checks every 4 hours (GCS, pupil response)."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Fluid Restriction & Monitoring",
        shortLabel: "Fluid Restriction",
        color: "amber",
        cards: [
          {
            title: "Fluid Management Strategy",
            threshold: "PRIMARY TREATMENT",
            calculator: {
              id: "siadh-restriction-calc",
              title: "SIADH Fluid Restriction Calculator"
            },
            orders: [
              "Restrict total fluid intake to 50% to 75% of calculated maintenance.",
              "Include all oral and IV fluids, including medications and flushes.",
              "Goal: Serum Sodium increase of 0.5 mmol/L per hour (maximum 10-12 mmol/L per 24 hours)."
            ]
          },
          {
            title: "Dietary Directives [DR]",
            orders: [
              "Liberalize salt intake in diet if patient is eating.",
              "High protein diet (increases solute load for water excretion).",
              "Minimize 'free water' intake (e.g., tap water, ice chips)."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Emergency Management",
        shortLabel: "Emergency RX",
        color: "red",
        cards: [
          {
            title: "Symptomatic Hyponatremia [!]",
            isCritical: true,
            threshold: "SEIZURES OR GCS < 8",
            orders: [
              "Give 3% Hypertonic Saline: 3-5 mL/kg IV over 20 minutes.",
              "Target: Raise serum Sodium by 2-3 mmol/L rapidly to stop seizures.",
              "Repeat bolus if symptoms persist, up to a maximum of 10 mL/kg."
            ],
            prescriptions: [
              {
                drug: "3% Hypertonic Saline",
                dose: "3 mL/kg",
                route: "IV",
                frequency: "STAT",
                calculation: (w) => `${(w * 3).toFixed(0)} mL`,
                notes: "Infuse over 20 minutes. Use central line if available, but do not delay if only peripheral access exists."
              }
            ]
          },
          {
            title: "Senior Triggers [!]",
            isCritical: true,
            triggers: [
              "IF Sodium rises too fast (> 12 mmol/L in 24h): High risk for Osmotic Demyelination Syndrome. Consult Senior immediately; may need D5W to slow correction.",
              "IF Sodium continues to drop despite < 50% maintenance restriction: Consult Nephrology for possible Loop Diuretics (Furosemide)."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data) => {
    const na = Number(data.serum_na);
    if (na < 120) return { level: 'critical', details: ["Severe Hyponatremia: Risk of permanent neurological damage and seizures. ICU monitoring required."] };
    if (na < 125) return { level: 'severe', details: ["Moderate SIADH: Requires strict 50-75% fluid restriction."] };
    return { level: 'moderate', details: ["Mild SIADH: Initiate fluid restriction."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Serum Sodium > 132 mmol/L and stable on normal fluid intake.",
    "Underlying cause of SIADH (e.g. pneumonia, CNS infection) is resolving.",
    "Patient is asymptomatic (no headache, nausea, or confusion).",
    "Family demonstrates understanding of fluid restriction if continuing at home."
  ],
  getRedFlags: [
    "Seizures",
    "Extreme lethargy or GCS < 12",
    "Projectile vomiting",
    "Severe headache",
    "Focal weakness"
  ],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "LANCET: Syndrome of Inappropriate Antidiuretic Hormone", url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(12)61118-2/fulltext" },
    { title: "RCH Melbourne: Hyponatremia Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/Hyponatraemia/" }
  ],
};
