import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const wardCkdOptimizationProtocol: DiseaseProtocol = {
  id: 'ward-ckd-optimization',
  name: 'Ward: CKD Inpatient Optimization',
  system: 'Nephrology',
  description: 'Inpatient optimization of Chronic Kidney Disease complications: Anemia, Bone Disease, and Growth.',
  image: {
    url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "renal-nutrition"
  },
  questions: [
    { id: 'weight', questionText: 'Weight', type: 'number', unit: 'kg' },
    { id: 'ckdStage', questionText: 'CKD Stage (eGFR)', type: 'select', options: [
      { label: 'Stage 2 (60-89)', value: 'stage2' },
      { label: 'Stage 3 (30-59)', value: 'stage3' },
      { label: 'Stage 4 (15-29)', value: 'stage4' },
      { label: 'Stage 5 (<15 or Dialysis)', value: 'stage5' },
    ]},
    { id: 'hemoglobin', questionText: 'Hemoglobin', type: 'number', unit: 'g/dL' },
    { id: 'phosphate', questionText: 'Serum Phosphate', type: 'number', unit: 'mg/dL' },
    { id: 'calcium', questionText: 'Serum Calcium', type: 'number', unit: 'mg/dL' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    if (data.ckdStage === 'stage5') {
      return { level: 'severe', details: ["End-stage renal disease requires intense monitoring."] };
    }
    return { level: 'moderate', details: ["Chronic management optimization."] };
  },
  getManagement: (severity: Severity, data: FormData) => {
    const mgmt = [
      {
        title: "Renal Nutrition & Fluids",
        recommendations: [
          "Protein intake: Ensure RDA for age, but avoid excessive protein.",
          "Phosphate restriction: Essential for Stages 3-5.",
          "Caloric optimization: Children with CKD often require 100-120% of RDA for growth.",
          "Consider nasogastric feeding if oral intake is insufficient."
        ]
      }
    ];

    if (Number(data.hemoglobin || 15) < 10) {
      mgmt.push({
        title: "Management of Renal Anemia",
        recommendations: [
          "Check Iron studies (Fers, Transferrin saturation).",
          "Ensure Iron sufficiency (Ferritin > 100) before starting ESA.",
          "Erythropoiesis-Stimulating Agents (ESA): e.g., Erythropoietin or Darbepoetin.",
          "Target Hb: 10-12 g/dL (avoid > 13)."
        ]
      });
    }

    if (Number(data.phosphate || 0) > 5.5 || Number(data.calcium || 0) < 8.5) {
      mgmt.push({
        title: "CKD-MBD (Mineral Bone Disease)",
        recommendations: [
          "Phosphate Binders: Give with meals (e.g., Calcium Carbonate or Sevelamer).",
          "Active Vitamin D: Calcitriol or Alfacalcidol (monitor Calcium closely).",
          "Target: Maintain normal Calcium/Phosphate for age and PTH within target range (2-9x normal for Stage 5)."
        ]
      });
    }

    mgmt.push({
      title: "Medication Review",
      recommendations: [
        "Avoid NSAIDs and Nephrotoxic antibiotics.",
        "Check Potassium levels before starting or increasing ACE inhibitors.",
        "Review vaccinations: All patients should have Hep B (double dose), Pneumococcal, and Varicella."
      ]
    });

    return mgmt;
  },
  getDisposition: (severity: Severity, data: FormData) => {
    return [
      "Growth parameters (Weight/Height/HC) tracked and plotted.",
      "Home medication regimen for binders, vitamins, and ESA clearly explained.",
      "Labs for anemia and bone disease scheduled.",
      "Multidisciplinary follow-up (Nephrology, Dietitian, Social Work) arranged."
    ];
  },
  getRedFlags: () => [
    "Severe hypertension.",
    "Signs of fluid overload or new-onset edema.",
    "Lethargy or school failure (Uremia symptoms).",
    "Bone pain or skeletal deformities."
  ],
  getDrugDoses: (severity: Severity, data: FormData): DrugDose[] => {
    const weight = Number(data.weight || 0);
    if (!weight) return [];
    return [
      { drugName: "Calcium Carbonate (Binder)", dose: "Determined by Nephrology; Give with meals" },
      { drugName: "Erythropoietin (EPO)", dose: "50-100 units/kg SC/IV 1-3 times per week" },
      { drugName: "Calcitriol", dose: "0.25 mcg Oral Daily or alternate days" },
    ];
  },
  getReferences: () => [
    { title: "KDOQI Clinical Practice Guidelines for CKD in Children", url: "https://www.kidney.org/professionals/KDOQI/guidelines" }
  ]
};
