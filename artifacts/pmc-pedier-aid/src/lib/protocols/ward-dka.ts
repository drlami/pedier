import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Diabetic Ketoacidosis (DKA)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: ISPAD 2022 Guidelines, BSPED, and RCH Melbourne
 */
export const wardDkaProtocol: DiseaseProtocol = {
  id: 'ward-dka',
  name: 'Diabetic Ketoacidosis Master Pathway',
  system: 'Endocrinology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Diabetic Ketoacidosis (DKA) is a life-threatening metabolic emergency characterized by the triad of hyperglycemia (Blood Glucose > 11 mmol/L or 200 mg/dL), ketonemia/ketonuria, and metabolic acidosis (Venous pH < 7.3 or Bicarbonate < 15 mmol/L). This exhaustive directive covers the ISPAD-aligned Two-Bag fluid system, precise Insulin titration, and a rigorous Neurological monitoring roadmap to prevent Cerebral Edema.',
  image: {
    url: "https://images.unsplash.com/photo-1576089234161-460d3d523b0a?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Metabolic monitoring and intensive fluid titration"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'phInitial', questionText: 'Initial Venous pH', type: 'number' },
    { id: 'bicarbInitial', questionText: 'Initial Bicarbonate (mmol/L)', type: 'number' },
    { id: 'gcsInitial', questionText: 'Glasgow Coma Scale Score', type: 'number' },
  ],

  mmpData: {
    snapshot: "DKA management focuses on (1) Gradual restoration of circulatory volume and osmotic balance to minimize the risk of Cerebral Edema, (2) Systematic replacement of the profound total body Potassium deficit which is unmasked as acidosis is corrected, and (3) A slow, controlled closure of the anion gap using low-dose Intravenous Insulin. The 'Two-Bag' system is the gold standard for maintaining a constant fluid rate while dynamicially adjusting Dextrose delivery.",
    stages: [
      {
        label: "Stage 1: Resuscitation & Volume Expansion",
        shortLabel: "Resuscitation",
        color: "blue",
        cards: [
          {
            title: "Phase 1: Initial Physician Orders [DR]",
            orders: [
              "Emergency Bolus: Give 10-20 mL/kg of Isotonic Saline (0.9% Sodium Chloride) ONLY if signs of shock or severe dehydration are present.",
              "Laboratory Baseline: Venous Blood Gas, Electrolytes, Urea, Creatinine, and Blood Ketones.",
              "Neurological Baseline: Document hourly Glasgow Coma Scale and pupillary reactivity.",
              "Access: Secure two wide-bore Intravenous cannulae."
            ]
          }
        ]
      },
      {
        label: "Stage 2: The Two-Bag Fluid System",
        shortLabel: "Fluid Management",
        color: "amber",
        cards: [
          {
            title: "Gold Standard Preparation",
            threshold: "CONSTANT TOTAL RATE",
            calculator: {
                id: "dka-fluid-calc",
                title: "DKA Two-Bag Calculator"
            },
            orders: [
              "Concept: Maintain a constant total hourly rate (Maintenance + 48-hour Deficit) while varying the Dextrose concentration by blending Bag A and Bag B.",
              "Bag A (Low Dextrose): 500 mL 0.9% Sodium Chloride + 20 mmol Potassium Chloride.",
              "Bag B (High Dextrose): 500 mL 10% Dextrose in 0.9% Sodium Chloride + 20 mmol Potassium Chloride.",
              "Potassium Mandate: Start Potassium (40 mmol/L) in all fluids as soon as urine output is confirmed or the initial level is less than 5.5 mmol/L."
            ]
          },
          {
            title: "Insulin Induction Strategy",
            threshold: "START 1-2 HOURS AFTER FLUIDS",
            isCritical: true,
            orders: [
              "Preferred Regimen: MONOTHERAPY with Regular Soluble Insulin.",
              "Dose: 0.05 to 0.1 Units/kg/hour. Do NOT give an initial Insulin bolus (increases Cerebral Edema risk).",
              "Goal: Reduce Blood Glucose by 50-100 mg/dL (3-5 mmol/L) per hour. If glucose falls too fast, increase Dextrose concentration using the Two-Bag blend; do NOT stop the insulin."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Complication Surveillance [!]",
        shortLabel: "Cerebral Edema",
        color: "red",
        cards: [
          {
            title: "Cerebral Edema Monitoring [NS]",
            isCritical: true,
            nursing: [
              "Neuro Checks: Glasgow Coma Scale and pupils EVERY HOUR.",
              "Vital Signs: Monitor for Cushing's Triad (Falling Heart Rate, rising Blood Pressure, and irregular breathing).",
              "Critical Signs: Report headache, vomiting, or incontinence immediately.",
              "Action: If suspected, give Mannitol (0.5-1 g/kg) or 3% Hypertonic Saline IMMEDIATELY. Do not wait for imaging."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Transition to Subcutaneous",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Switch-over Criteria",
            orders: [
              "Biochemical Stability: pH > 7.3, Bicarbonate > 15, and Anion Gap closed.",
              "Clinical Stability: Patient is alert and tolerating oral intake without vomiting.",
              "Overlap Rule: Give the first dose of Subcutaneous rapid-acting insulin 30-60 minutes BEFORE stopping the Intravenous insulin infusion to prevent rebound ketosis."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    const ph = Number(data.phInitial);
    if (ph < 7.1 || data.gcsInitial < 13) {
      return { level: 'critical', details: ["Severe DKA - High risk for Cerebral Edema. Requires high-dependency monitoring."] };
    }
    if (ph < 7.2) {
      return { level: 'severe', details: ["Moderate DKA - Requires meticulous fluid titration."] };
    }
    return { level: 'moderate', details: ["Mild DKA."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Anion gap closed and acidosis resolved.",
    "Tolerating oral fluids and meals.",
    "Subcutaneous insulin regimen established and family training complete.",
    "Follow-up arranged with Diabetic Nurse Specialist and Endocrinologist."
  ],
  getRedFlags: () => ["Headache", "Bradycardia (Slow Heart Rate)", "Rising Blood Pressure", "Recurrent Vomiting", "Falling Glasgow Coma Scale"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "ISPAD Clinical Practice Consensus Guidelines 2022: DKA", url: "https://onlinelibrary.wiley.com/doi/10.1111/pedi.13406" },
    { title: "RCH Melbourne: Diabetic Ketoacidosis", url: "https://www.rch.org.au/clinicalguide/guideline_index/Diabetic_Ketoacidosis/" }
  ]
};
