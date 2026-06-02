import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Salicylate (Aspirin) Toxicity
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: ACMT Guidelines and RCH Melbourne.
 */
export const wardSalicylateProtocol: DiseaseProtocol = {
  id: 'ward-salicylate-master',
  name: 'Salicylate Toxicity Master Pathway',
  system: 'Poisoning and Toxins',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Salicylate poisoning (Aspirin, Oil of Wintergreen) causes a complex acid-base disturbance: primary respiratory alkalosis followed by metabolic acidosis. Toxicity is driven by the movement of salicylate into the CNS as pH drops. Management centers on Urinary Alkalinization to trap salicylate in the renal tubules and prevent CNS entry.',
  image: {
    url: "https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Aspirin management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Body Weight', type: 'number', unit: 'kg' },
    { id: 'salicylate_level', questionText: 'Serum Salicylate Level', type: 'number', unit: 'mg/dL' },
    { id: 'venous_ph', questionText: 'Venous pH', type: 'number' },
    { id: 'urine_ph', questionText: 'Urine pH', type: 'number' },
  ], 

  mmpData: {
    snapshot: "Management centers on Urinary Alkalinization (IV Bicarbonate) to trap salicylate in the kidneys. Target level > 30 mg/dL. CRITICAL: Maintain high-normal Potassium (4.5-5.0) or alkalinization will fail. AVOID INTUBATION if possible; if necessary, match pre-intubation minute ventilation to prevent fatal pH drops. Hemodialysis is the 2nd line for severe toxicity (>100 mg/dL or CNS symptoms).",
    stages: [
      {
        label: "Stage 1: Diagnosis & Lab Monitoring",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Diagnosis & Laboratory Panel [DR]",
            threshold: "STEP 0: IMMEDIATE",
            orders: [
              "Serial Salicylate Levels: Q2H until two consecutive levels are declining.",
              "Acid-Base: Venous Blood Gas (Q2H) to monitor pH and pCO2.",
              "Electrolytes: Potassium (Essential), Sodium, Chloride, Glucose (Salicylates cause CNS hypoglycemia despite normal serum levels).",
              "Renal Function: Creatinine and BUN.",
              "X-ray: Abdominal X-ray if 'Bezoar' or massive ingestion of enteric-coated tablets is suspected (rarely radiopaque but can show mass)."
            ]
          },
          {
            title: "Triage & Decontamination",
            orders: [
              "Activated Charcoal: 1 g/kg (Max 50g) up to 4 hours post-ingestion (salicylates delay gastric emptying).",
              "Repeated Charcoal: Consider 0.5 g/kg Q4H if level continues to rise (enteric-coated or bezoar)."
            ]
          }
        ]
      },
      {
        label: "Stage 2: 1st Line Therapy - Alkalinization",
        shortLabel: "Alkalinization",
        color: "amber",
        cards: [
          {
            title: "Sodium Bicarbonate Infusion [DR]",
            threshold: "LEVEL > 30 mg/dL",
            calculator: {
              id: "salicylate-alk-calc",
              title: "Salicylate Alkalinization Calculator"
            },
            orders: [
              "Initial Bolus: 1-2 mEq/kg Sodium Bicarbonate IV over 10 minutes.",
              "Infusion: D5W + 150 mEq/L Bicarb + 40 mEq/L KCl at 1.5-2x Maintenance.",
              "Target Urine pH: 7.5 to 8.5 (Ion Trapping).",
              "Target Serum pH: 7.45 to 7.55 (Monitor Q2H)."
            ]
          },
          {
            title: "Potassium Management [!]",
            isCritical: true,
            instructions: [
              "Maintain K+ 4.5 - 5.0 mEq/L. If K+ is low, the kidney cannot excrete bicarbonate, and urine pH will remain acidic regardless of IV dose."
            ]
          }
        ]
      },
      {
        label: "Stage 3: 2nd Line Therapy - Hemodialysis",
        shortLabel: "Dialysis",
        color: "red",
        cards: [
          {
            title: "Indications for Hemodialysis [!]",
            isCritical: true,
            triggers: [
              "IF Serum level > 100 mg/dL (Acute) or > 60 mg/dL (Chronic).",
              "IF Altered Mental Status, Seizures, or Coma.",
              "IF Refractory metabolic acidosis (pH < 7.2) despite bicarbonate.",
              "IF Renal failure or severe pulmonary edema."
            ]
          },
          {
            title: "Respiratory Safety Warning",
            isCritical: true,
            instructions: [
              "Intubation is a high-risk procedure in salicylate toxicity. The ventilator MUST match the patient's extremely high natural respiratory rate. A brief rise in pCO2 will drop pH and cause fatal CNS entry of salicylate."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data) => {
    const level = Number(data.salicylate_level);
    if (level > 80 || data.venous_ph < 7.2) return { level: 'critical', details: ["Severe Toxicity: Immediate dialysis consult required. Maximize alkalinization."] };
    if (level > 35) return { level: 'severe', details: ["Moderate Toxicity: Start urinary alkalinization and strict potassium monitoring."] };
    return { level: 'moderate', details: ["Suspected Toxicity: Monitor serial levels and pH every 2 hours."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Two consecutive salicylate levels < 30 mg/dL and declining.",
    "Venous pH normal (7.35-7.45) on room air.",
    "Urine pH was maintained > 7.5 and patient is asymptomatic.",
    "Psychiatric assessment completed for all intentional overdoses."
  ],
  getRedFlags: [
    "Tinnitus (Ringing in ears)",
    "Hyperpnea (Deep, sighing breaths)",
    "Altered mental status",
    "Hyperthermia (Uncoupling of oxidative phosphorylation)",
    "Seizures"
  ],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "ACMT: Position Statement on Management of Salicylate Poisoning", url: "https://www.acmt.net/Salicylate_Poisoning.html" },
    { title: "RCH Melbourne: Salicylate Poisoning", url: "https://www.rch.org.au/clinicalguide/guideline_index/Salicylate_poisoning/" }
  ],
};
