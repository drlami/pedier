import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

/**
 * Pediatric Ward: CKD Inpatient Optimization
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: KDOQI (2024), KDIGO (2024), and RCH Nutrition.
 */
export const wardCkdOptimizationProtocol: DiseaseProtocol = {
  id: 'ward-ckd-optimization',
  name: 'CKD Optimization Master Pathway',
  system: 'Renal & Urinary System',
  unit: 'ward',
  description: 'Multidisciplinary inpatient roadmap for optimizing CKD complications: Anemia, Mineral Bone Disease (MBD), and nutritional growth strategy.',
  image: {
    url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Nutrition and chronic kidney disease management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Weight', type: 'number', unit: 'kg' },
    { id: 'ckdStage', questionText: 'CKD Stage (eGFR)', type: 'select', options: [
      { label: 'Stage 3 (30-59)', value: 'stage3' },
      { label: 'Stage 4 (15-29)', value: 'stage4' },
      { label: 'Stage 5 (< 15 or Dialysis)', value: 'stage5' },
    ]},
    { id: 'hemoglobin', questionText: 'Hemoglobin (g/dL)', type: 'number' },
    { id: 'ferritinLow', questionText: 'Ferritin < 100 ng/mL?', type: 'boolean' },
    { id: 'highPhosphate', questionText: 'Phosphate above range for age?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "CKD management requires a metabolic balancing act. Prioritize Iron sufficiency before starting ESAs, and ensure strict adherence to phosphate binders with every meal to prevent Renal Bone Disease.",
    stages: [
      {
        label: "Stage 1: Admission & Complication Scan",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Mandatory Laboratory Screening",
            orders: [
              "Renal Profile: Creatinine, U&E, VBG (Bicarb).",
              "Bone Profile: Calcium, Phosphate, ALP, and intact PTH.",
              "Anemia Profile: CBC, Reticulocytes, Ferritin, Transferrin Saturation (TSAT).",
              "Nutrition: Serum Albumin, Zinc, and Pre-albumin."
            ]
          },
          {
            title: "Blood Pressure Directive",
            orders: [
              "Target BP: < 90th percentile for age/height.",
              "ACE Inhibitor/ARB: 1st-line if proteinuria present (monitor K closely)."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Renal Anemia Optimization",
        shortLabel: "Anemia",
        color: "red",
        cards: [
          {
            title: "Iron Sufficiency Roadmap",
            threshold: "BEFORE STARTING ESA",
            orders: [
              "Ensure Ferritin > 100 ng/mL and TSAT > 20%.",
              "Oral Iron: 3-6 mg/kg/day (Elemental Iron).",
              "IV Iron: Consider if oral intolerance or Stage 5/Dialysis."
            ]
          },
          {
            title: "ESA Strategy",
            threshold: "IF Hb < 10.0 g/dL",
            orders: [
              "Erythropoiesis-Stimulating Agents (ESA): e.g., Erythropoietin 50-100 U/kg SC/IV.",
              "Frequency: Usually 1-3 times per week.",
              "Target Hb: 11.0 - 12.0 g/dL (Avoid > 13.0 due to stroke risk)."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Mineral Bone Disease (CKD-MBD)",
        shortLabel: "Bone Health",
        color: "amber",
        cards: [
          {
            title: "Phosphate Management [DR]",
            orders: [
              "Restrict Dietary Phosphate: Consult Dietitian.",
              "Phosphate Binders: Calcium Carbonate or Sevelamer.",
              "MANDATE: Binders MUST be taken with meals to be effective."
            ]
          },
          {
            title: "Active Vitamin D Directive",
            threshold: "IF PTH > 2X NORMAL",
            orders: [
              "Calcitriol or Alfacalcidol: Start at low dose (e.g. 0.25 mcg).",
              "WARNING: Hold if Phosphate is uncontrolled or Calcium is high."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Nutrition & Growth Roadmap",
        shortLabel: "Nutrition",
        color: "emerald",
        cards: [
          {
            title: "Growth Optimization [NS]",
            orders: [
              "Target Calories: 100-120% of RDA for age.",
              "Protein: Maintain RDA (do not restrict protein in growing children).",
              "Consider NG feeds if weight-for-age is falling below 3rd percentile."
            ],
            nursing: [
              "Weekly Height/Length (stadiometer).",
              "Bi-weekly Weight (same scale).",
              "Document meal completion percentage."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.ckdStage === 'stage5') {
      return { level: 'severe', details: ["Stage 5 requires preparation for transplant or dialysis."] };
    }
    return { level: 'moderate', details: ["Routine inpatient optimization of CKD complications."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Anemia plan (Iron/ESA) stabilized.",
    "Phosphate within acceptable range for age.",
    "Parent competent in binder administration and timing.",
    "Multidisciplinary follow-up (Nephrology/Dietetics) confirmed."
  ],
  getRedFlags: () => ["Severe hypertension", "Sudden edema", "School failure (Uremia)", "Bone pain"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "KDOQI Clinical Practice Guidelines for Nutrition in Children with CKD", url: "https://www.kidney.org/professionals/KDOQI/guidelines" },
    { title: "KDIGO 2024 Clinical Practice Guideline for CKD-MBD", url: "https://kdigo.org/guidelines/ckd-mbd/" }
  ]
};
