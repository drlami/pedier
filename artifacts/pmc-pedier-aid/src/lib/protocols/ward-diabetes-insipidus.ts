import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Diabetes Insipidus (DI)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: ISPAD Guidelines and RCH Melbourne Clinical Guidelines.
 */
export const wardDiabetesInsipidusProtocol: DiseaseProtocol = {
  id: 'ward-diabetes-insipidus',
  name: 'Diabetes Insipidus (DI) Master Pathway',
  system: 'Endocrinology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Diabetes Insipidus is a condition characterized by the excretion of large volumes of dilute urine due to either a deficiency of Arginine Vasopressin (Central DI) or resistance to its action (Nephrogenic DI). Management requires extremely careful fluid titration to correct hypernatremic dehydration slowly (Sodium drop < 0.5 mmol/L/hr) to avoid cerebral edema.',
  image: {
    url: "https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Water balance and electrolyte management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Body Weight', type: 'number', unit: 'kg' },
    { id: 'serum_na', questionText: 'Serum Sodium (Na+)', type: 'number', unit: 'mmol/L' },
    { id: 'urine_osm', questionText: 'Urine Osmolality', type: 'number', unit: 'mOsm/kg' },
    { id: 'serum_osm', questionText: 'Serum Osmolality', type: 'number', unit: 'mOsm/kg' },
  ], 

  mmpData: {
    snapshot: "Management focuses on replacing the Free Water Deficit slowly while maintaining exact intake/output balance. Central DI requires precise Desmopressin (DDAVP) titration. The most dangerous complication is rapid sodium correction leading to cerebral edema; aim for a drop of no more than 10-12 mmol/L in 24 hours.",
    stages: [
      {
        label: "Stage 1: Diagnosis & Initial Stabilization",
        shortLabel: "Stabilization",
        color: "blue",
        cards: [
          {
            title: "Confirm Diagnosis [DR]",
            threshold: "CLINICAL SUSPICION",
            orders: [
              "Verify Polyuria: Urine output > 4-5 mL/kg/hour in infants or > 2-3 L/m²/day in children.",
              "Labs: Serum Sodium > 145 mmol/L, Serum Osmolality > 300 mOsm/kg, Urine Osmolality < 300 mOsm/kg.",
              "Initial Fluids: If in shock, give 10-20 mL/kg Isotonic Saline (0.9% NaCl) slowly over 1 hour.",
              "If stable: Avoid rapid fluid boluses. Transition directly to planned deficit replacement."
            ]
          },
          {
            title: "Nursing: Critical Monitoring [NS]",
            isCritical: true,
            nursing: [
              "Establish strict Intake & Output charting (Hourly).",
              "Measure Specific Gravity of EVERY urine void.",
              "Daily weights (twice daily in infants).",
              "Check Serum Electrolytes every 4 hours until stable."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Free Water Deficit Replacement",
        shortLabel: "Deficit Correction",
        color: "amber",
        cards: [
          {
            title: "Calculated Replacement Strategy",
            threshold: "48-72 HOUR CORRECTION",
            calculator: {
              id: "free-water-calc",
              title: "Free Water Deficit Calculator"
            },
            orders: [
              "Replace calculated free water deficit over 48 to 72 hours.",
              "Total Fluid = (Free Water Deficit) + (Maintenance) + (Ongoing Urine Loss).",
              "Fluid Type: Typically 0.45% Saline or 5% Dextrose in water (D5W) depending on current sodium and glucose levels.",
              "Target: Limit serum Sodium drop to < 0.5 mmol/L per hour (maximum 10-12 mmol/L per 24 hours)."
            ]
          },
          {
            title: "Senior Triggers [!]",
            isCritical: true,
            triggers: [
              "IF Serum Sodium drops > 1 mmol/L per hour: Reduce free water replacement rate immediately. Consult Endocrinology.",
              "IF Patient develops headache, vomiting, or dropping GCS: Suspect Cerebral Edema. Stop free water replacement and consult Senior.",
              "IF Urine Output remains massive (> 5 mL/kg/hr) despite replacement: Consider starting DDAVP."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Specific Medical Management",
        shortLabel: "Medical RX",
        color: "emerald",
        cards: [
          {
            title: "Central DI: Desmopressin (DDAVP)",
            orders: [
              "Standard Dose (Oral): 0.1 mg to 0.2 mg twice to three times daily.",
              "Standard Dose (Intranasal): 5 mcg to 10 mcg once or twice daily.",
              "Standard Dose (IV/SC): 0.5 mcg to 1 mcg (consult specialist).",
              "Goal: Maintain urine output at 1-2 mL/kg/hr and keep serum Sodium in the high-normal range (140-145)."
            ],
            prescriptions: [
              {
                drug: "Desmopressin (DDAVP) Oral",
                dose: "0.1 mg",
                route: "PO",
                frequency: "BD/TDS",
                calculation: () => "0.1 - 0.2 mg",
                notes: "Titrate based on urine output and thirst."
              }
            ]
          },
          {
            title: "Nephrogenic DI Management",
            orders: [
              "Ensure adequate free water access (allow child to drink to thirst if possible).",
              "Low solute diet (low sodium, low protein).",
              "Hydrochlorothiazide: 1-2 mg/kg/day in divided doses.",
              "Indomethacin: 1.5-2.5 mg/kg/day (consult Nephrology)."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data) => {
    const na = Number(data.serum_na);
    if (na > 160) return { level: 'critical', details: ["Extreme Hypernatremia: High risk for intracranial hemorrhage and venous thrombosis. ICU consult required."] };
    if (na > 150) return { level: 'severe', details: ["Moderate DI: Requires strict 48-72h slow correction."] };
    return { level: 'moderate', details: ["Mild DI: Monitor water balance closely."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Serum Sodium stable (135-145) for > 24 hours on fixed medical regimen.",
    "Urine output normalized to age-appropriate range.",
    "Patient/Family demonstrate ability to monitor fluid intake and recognize early signs of dehydration.",
    "Endocrinology follow-up scheduled within 1 week."
  ],
  getRedFlags: [
    "Rapidly dropping GCS",
    "Seizures",
    "New-onset focal neurological deficits",
    "Extreme thirst with inability to drink",
    "Severe headache"
  ],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "ISPAD Clinical Practice Consensus Guidelines: Fluid and Electrolyte Management", url: "https://onlinelibrary.wiley.com/journal/13995448" },
    { title: "RCH Melbourne: Diabetes Insipidus", url: "https://www.rch.org.au/clinicalguide/guideline_index/Diabetes_Insipidus/" }
  ],
};
