import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

/**
 * Pediatric Ward: Acute Kidney Injury (AKI)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: KDIGO Clinical Practice Guidelines for AKI (2012/Updated 2024).
 */
export const wardAkiProtocol: DiseaseProtocol = {
  id: 'ward-aki',
  name: 'Acute Kidney Injury Master Pathway',
  system: 'Renal & Urinary System',
  unit: 'ward',
  description: 'Exhaustive inpatient directive for AKI: KDIGO-based staging, precise fluid titration, and the AEIOU roadmap for renal replacement therapy.',
  image: {
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Kidney monitoring and metabolic management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Weight', type: 'number', unit: 'kg' },
    { id: 'creatinineRise', questionText: 'Creatinine level x1.5 baseline or 0.3mg/dL rise?', type: 'boolean' },
    { id: 'urineOutputLow', questionText: 'Urine Output < 0.5 mL/kg/hr for > 6h?', type: 'boolean' },
    { id: 'hyperkalemiaECG', questionText: 'K > 6.5 or ECG changes?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "AKI management prioritizes hemodynamic optimization and preventing further injury. Stop all nephrotoxic agents and dose-adjust every prescription for GFR. Early ICU/Nephrology consultation is mandatory if AEIOU triggers are met.",
    stages: [
      {
        label: "Stage 1: Identification & Immediate Mitigation",
        shortLabel: "Identification",
        color: "blue",
        cards: [
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Confirm Baseline Creatinine: Compare to previous or use 0.45 x Height / Cr.",
              "Stop ALL Nephrotoxic Agents: NSAIDs, Aminoglycosides, ACE inhibitors, IV contrast.",
              "Urine Microscopy: Evaluate for Muddy Brown Casts (ATN) or RBCs.",
              "Metabolic Screening: U&E, Creatinine, Calcium, Phosphate, VBG (Acid-Base)."
            ]
          },
          {
            title: "Hemodynamic Stabilization",
            threshold: "IF HYPOVOLEMIC",
            orders: [
              "Fluid Challenge: 10-20 mL/kg isotonic saline; monitor UO response.",
              "Maintain Mean Arterial Pressure (MAP) for age to ensure renal perfusion."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Metabolic & Electrolyte Optimization",
        shortLabel: "Metabolic Control",
        color: "amber",
        cards: [
          {
            title: "Hyperkalemia Directive",
            isCritical: true,
            threshold: "K > 5.5",
            orders: [
              "Monitor K every 4-8 hours.",
              "Shift: Insulin/Dextrose or Salbutamol Nebulizers.",
              "Stabilize Heart: Calcium Gluconate 10% (0.5 mL/kg) if ECG changes present."
            ]
          },
          {
            title: "Nursing: Strict Monitoring [NS]",
            nursing: [
              "Hourly Intake/Output charting (use Foleys if needed).",
              "Twice-daily weight checks.",
              "Assess for lung rales and gallop rhythm every 4h.",
              "Continuous ECG monitoring if hyperkalemic."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Renal Replacement Roadmap",
        shortLabel: "Dialysis Triggers",
        color: "red",
        cards: [
          {
            title: "AEIOU Triggers for Dialysis",
            threshold: "IF MEDICAL MANAGEMENT FAILS",
            triggers: [
              "A: Acidosis (Refractory Metabolic Acidosis).",
              "E: Electrolytes (Refractory Hyperkalemia).",
              "I: Intoxication (Dialyzable toxins: Salicylates/Lithium).",
              "O: Overload (Refractory Fluid Overload > 10% weight).",
              "U: Uremia (Encephalopathy, Pericarditis, BUN > 80-100)."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Recovery & Discharge Planning",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Recovery Markers",
            orders: [
              "UO established > 1.0 mL/kg/hr.",
              "Stabilizing/Falling Creatinine for > 48 hours.",
              "Normalizing electrolytes on oral intake.",
              "Follow-up: Nephrology review in 2 weeks to monitor for CKD risk."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.hyperkalemiaECG === true || data.urineOutputLow === true) {
      return { level: 'critical', details: ["KDIGO Stage 3 or dangerous hyperkalemia."] };
    }
    if (data.creatinineRise === true) {
      return { level: 'severe', details: ["Documented AKI requiring close inpatient monitoring."] };
    }
    return { level: 'moderate', details: ["Stable surveillance for AKI."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Stable or improving renal function.",
    "No evidence of dangerous volume overload.",
    "Potassium maintained < 5.5 without continuous intervention.",
    "Clear outpatient medication plan (dose adjustments)."
  ],
  getRedFlags: () => ["Peaked T waves", "Altered mental status", "Pulmonary edema", "Anuria"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "KDIGO Clinical Practice Guideline for AKI", url: "https://kdigo.org/guidelines/acute-kidney-injury/" },
    { title: "StatPearls: Pediatric AKI Management", url: "https://www.ncbi.nlm.nih.gov/books/NBK541103/" }
  ]
};
