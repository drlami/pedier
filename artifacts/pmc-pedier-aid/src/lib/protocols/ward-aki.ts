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
  description: 'Acute Kidney Injury is a sudden decrease in kidney function (rise in creatinine ≥ 0.3 mg/dL or ≥ 1.5x baseline) that impairs fluid and electrolyte balance. This pathway provides KDIGO-based staging, precise fluid titration for low vs. high urine output phases, and the Acidosis/Electrolyte/Ingestion/Overload/Uremia (AEIOU) dialysis roadmap.',
  image: {
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Kidney monitoring and metabolic management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'creatinineRise', questionText: 'Creatinine level x1.5 baseline or 0.3mg/dL rise?', type: 'boolean' },
    { id: 'urineOutputLow', questionText: 'Urine Output less than 0.5 mL/kg/hour for more than 6 hours?', type: 'boolean' },
    { id: 'hyperkalemiaECG', questionText: 'Potassium level greater than 6.5 or ECG changes?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "AKI management focuses on 'Rule of 3s': (1) Stop further injury (nephrotoxic medications), (2) Optimize hemodynamics (titrate fluids based on volume status), and (3) Monitor metabolic complications (Acidosis, Electrolytes, Ingestion, Overload, Uremia). Precise fluid management is critical: replace Insensible Water Loss + Urine Output in patients with low urine output, but allow for recovery-phase high urine output.",
    stages: [
      {
        label: "Stage 1: Identification & Volume Status",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Urine Output Definitions",
            orders: [
              "Oliguria (Low Urine Output): Less than 0.5 mL/kg/hour in children or less than 400 mL/day.",
              "Anuria (No Urine Output): Less than 0.2 mL/kg/hour or no urine for 12 hours.",
              "Polyuria (High Urine Output): Greater than 3 mL/kg/hour or greater than 2 Liters/m²/day (Common in recovery or Acute Tubular Necrosis phase)."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Confirm Baseline Creatinine: Compare to previous or use 0.45 x Height / Creatinine.",
              "Stop ALL Nephrotoxic Agents: Non-Steroidal Anti-Inflammatory Drugs (NSAIDs), Aminoglycosides, ACE inhibitors, IV contrast.",
              "Urine Microscopy: Muddy Brown Casts (Acute Tubular Necrosis) vs RBCs/Dysmorphic RBCs (Glomerulonephritis).",
              "Metabolic Screening: Urea & Electrolytes, Creatinine, Calcium, Phosphate, Venous Blood Gas (Acid-Base status)."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Fluid & Electrolyte Management",
        shortLabel: "Management",
        color: "amber",
        cards: [
          {
            title: "Fluid Titration Guide",
            threshold: "CRITICAL CALCULATION",
            calculator: {
              id: "aki-fluid-calc",
              title: "Fluid Titration Calculator"
            },
            orders: [
              "If Hypovolemic (Low Volume): 10-20 mL/kg Isotonic Saline (0.9% Sodium Chloride) bolus. AVOID Potassium-containing fluids.",
              "If Oliguric (Fluid Restricted): Total Fluids = Insensible Water Loss + Urine Output (mL for mL).",
              "Insensible Water Loss Calculation: 400 mL/m²/day (approximately 30 mL/kg for infants, 20 mL/kg for children).",
              "Fluid Choice: ALWAYS use Isotonic fluids. NEVER use Hypotonic (D5 0.45%) in Acute Kidney Injury due to risk of dangerously low sodium."
            ]
          },
          {
            title: "Hyperkalemia Directive",
            isCritical: true,
            threshold: "Potassium > 5.5",
            orders: [
              "Monitor Potassium every 4-8 hours.",
              "Shift Potassium: Insulin/Dextrose (0.1 Unit/kg insulin + 0.5g/kg Dextrose) or Salbutamol Nebulizers.",
              "Stabilize Heart: Calcium Gluconate 10% (0.5 mL/kg) if ECG changes present."
            ]
          },
          {
            title: "Nursing: Strict Monitoring [NS]",
            nursing: [
              "Hourly Intake and Output charting (use urinary catheters if needed).",
              "Twice-daily weight checks.",
              "Assess for lung rales and gallop rhythm every 4 hours.",
              "Continuous Heart Monitoring (ECG) if potassium is high."
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
              "E: Electrolytes (Refractory High Potassium).",
              "I: Intoxication (Dialyzable toxins: Salicylates/Lithium).",
              "O: Overload (Refractory Fluid Overload > 10% weight gain).",
              "U: Uremia (Brain symptoms, Heart sac inflammation, Blood Urea Nitrogen > 80-100)."
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
              "Urine Output established greater than 1.0 mL/kg/hour.",
              "Stabilizing or Falling Creatinine for more than 48 hours.",
              "Normalizing electrolytes on oral intake.",
              "Follow-up: Nephrology review in 2 weeks to monitor for Chronic Kidney Disease risk."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.hyperkalemiaECG === true || data.urineOutputLow === true) {
      return { level: 'critical', details: ["KDIGO Stage 3 or dangerous high potassium."] };
    }
    if (data.creatinineRise === true) {
      return { level: 'severe', details: ["Documented Acute Kidney Injury requiring close inpatient monitoring."] };
    }
    return { level: 'moderate', details: ["Stable surveillance for Acute Kidney Injury."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Stable or improving renal function.",
    "No evidence of dangerous volume overload.",
    "Potassium maintained less than 5.5 without continuous intervention.",
    "Clear outpatient medication plan (dose adjustments)."
  ],
  getRedFlags: () => ["Peaked T waves on ECG", "Altered mental status", "Pulmonary edema (fluid in lungs)", "No urine output (Anuria)"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "KDIGO Clinical Practice Guideline for Acute Kidney Injury", url: "https://kdigo.org/guidelines/acute-kidney-injury/" },
    { title: "StatPearls: Pediatric Acute Kidney Injury Management", url: "https://www.ncbi.nlm.nih.gov/books/NBK541103/" }
  ]
};
