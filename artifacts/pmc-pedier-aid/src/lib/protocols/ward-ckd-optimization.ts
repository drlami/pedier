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
  description: 'Chronic Kidney Disease (CKD) Optimization involves the comprehensive inpatient management of metabolic complications arising from decreased glomerular filtration rate. This pathway provides a multidisciplinary roadmap for addressing Renal Anemia, Mineral Bone Disease (CKD-MBD), Growth Failure, and Acid-Base imbalances in children with Stage 3-5 CKD.',
  image: {
    url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Nutrition and chronic kidney disease management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Weight', type: 'number', unit: 'kg' },
    { id: 'ckdStage', questionText: 'CKD Stage (Estimated Glomerular Filtration Rate)', type: 'select', options: [
      { label: 'Stage 3 (30-59 mL/min/1.73m²)', value: 'stage3' },
      { label: 'Stage 4 (15-29 mL/min/1.73m²)', value: 'stage4' },
      { label: 'Stage 5 (< 15 or Dialysis)', value: 'stage5' },
    ]},
    { id: 'hemoglobin', questionText: 'Hemoglobin (g/dL)', type: 'number' },
    { id: 'ferritinLow', questionText: 'Ferritin less than 100 ng/mL?', type: 'boolean' },
    { id: 'highPhosphate', questionText: 'Phosphate above reference range for age?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Inpatient CKD management requires a precise metabolic balancing act: (1) Optimize Iron stores before initiating Erythropoiesis-Stimulating Agents to ensure hemoglobin recovery. (2) Strictly synchronize phosphate binders with meal times to prevent secondary hyperparathyroidism and Renal Bone Disease. (3) Prioritize high-caloric nutritional intake to support linear growth, while monitoring fluid and electrolyte stability.",
    stages: [
      {
        label: "Stage 1: Admission & Multi-system Complication Scan",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Initial Physician Orders: Laboratory Screening [DR]",
            orders: [
              "Renal Profile: Serum Creatinine, Urea, Sodium, Potassium, and Chloride.",
              "Acid-Base Status: Venous Blood Gas to monitor Bicarbonate levels.",
              "Mineral Bone Profile: Ionized Calcium, Serum Phosphate, Alkaline Phosphatase, and Intact Parathyroid Hormone (PTH).",
              "Anemia Profile: Complete Blood Count, Reticulocyte Count, Serum Ferritin, and Transferrin Saturation (TSAT).",
              "Nutritional Assessment: Serum Albumin, Pre-albumin, and Zinc levels."
            ]
          },
          {
            title: "Blood Pressure Monitoring & Control",
            orders: [
              "Target Blood Pressure: Maintain below the 90th percentile for the child's age, sex, and height.",
              "Antihypertensive Management: Utilize Angiotensin-Converting Enzyme (ACE) Inhibitors or Angiotensin Receptor Blockers (ARBs) as first-line therapy if Proteinuria is present.",
              "Electrolyte Safety: Monitor Serum Potassium closely when starting or increasing doses of renal-protective medications."
            ]
          },
          {
            title: "Nursing: Admission Monitoring [NS]",
            nursing: [
              "Establish accurate baseline Height and Weight using standardized equipment.",
              "Four-limb Blood Pressure measurements upon admission.",
              "Strict Intake and Output charting, including all oral fluids and medications.",
              "Clinical Assessment: Check for signs of fluid overload (edema, lung crackles) every 8 hours."
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
            threshold: "CRITICAL: ENSURE STORES ARE FULL BEFORE STARTING ESA",
            orders: [
              "Target Levels: Aim for Serum Ferritin greater than 100 ng/mL and Transferrin Saturation (TSAT) greater than 20%.",
              "Oral Iron Therapy: 3-6 mg/kg/day of Elemental Iron divided into two doses.",
              "Intravenous Iron: Consider if the patient is intolerant to oral iron or has progressed to Stage 5 CKD/Dialysis."
            ]
          },
          {
            title: "Erythropoiesis-Stimulating Agent (ESA) Strategy",
            threshold: "IF HEMOGLOBIN LESS THAN 10.0 G/DL",
            orders: [
              "Initiate Erythropoiesis-Stimulating Agents (e.g., Erythropoietin) at 50-100 Units/kg via Subcutaneous or Intravenous route.",
              "Frequency: Administer 1 to 3 times per week based on clinical response.",
              "Target Hemoglobin: Aim for 11.0 to 12.0 g/dL. AVOID exceeding 13.0 g/dL due to increased risk of thromboembolic events."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Mineral Bone Disease Management (CKD-MBD)",
        shortLabel: "Bone Health",
        color: "amber",
        cards: [
          {
            title: "Phosphate Management Strategy [DR]",
            orders: [
              "Dietary Restriction: Consult with a Pediatric Dietitian to limit high-phosphate foods and dairy intake.",
              "Phosphate Binders: Administer Calcium Carbonate or Sevelamer.",
              "MANDATORY TIMING: Binders MUST be taken exactly at the time of meal consumption to effectively bind dietary phosphate."
            ]
          },
          {
            title: "Active Vitamin D Therapy",
            threshold: "IF PARATHYROID HORMONE (PTH) IS GREATER THAN 2X NORMAL RANGE",
            orders: [
              "Calcitriol or Alfacalcidol: Begin at a low starting dose (e.g., 0.25 micrograms).",
              "Safety Protocol: Hold Vitamin D therapy if Serum Phosphate is uncontrolled or if Hypercalcemia (high calcium) occurs."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Nutritional Rehabilitation & Growth Optimization",
        shortLabel: "Nutrition",
        color: "emerald",
        cards: [
          {
            title: "Growth Optimization Roadmap",
            orders: [
              "Caloric Target: Provide 100% to 120% of the Recommended Dietary Allowance (RDA) for the child's age.",
              "Protein Intake: Maintain the full Recommended Dietary Allowance; do not restrict protein in growing children unless specifically directed by Nephrology.",
              "Invasive Support: Consider Nasogastric Tube feeding if the child's weight-for-age falls below the 3rd percentile or growth velocity is inadequate."
            ]
          },
          {
            title: "Nursing: Strict Growth Monitoring [NS]",
            nursing: [
              "Weekly Height or Length measurement using a calibrated stadiometer.",
              "Bi-weekly Weight measurements on the same scale, wearing similar clothing.",
              "Documentation: Record the percentage of each meal completed and any episodes of vomiting."
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
