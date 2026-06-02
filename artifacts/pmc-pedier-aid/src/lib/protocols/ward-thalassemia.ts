import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Thalassemia (Acute Complications)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: TIF Guidelines (2021), NHS Standards, and RCH Melbourne
 */
export const wardThalassemiaProtocol: DiseaseProtocol = {
  id: 'ward-thalassemia',
  name: 'Thalassemia Complications Master Pathway',
  system: 'Hematology & Oncology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Thalassemia is a group of inherited blood disorders characterized by decreased production of functional hemoglobin chains, leading to chronic hemolytic anemia and iron overload. This exhaustive directive covers the management of acute hyperhemolytic crises, cardiac iron overload monitoring, and standardized transfusion protocols to prevent alloimmunization.',
  image: {
    url: "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Assessment of anemia-related pallor and iron overload markers"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'hemoglobinDrop', questionText: 'Hemoglobin drop > 2 g/dL below patient baseline?', type: 'boolean' },
    { id: 'ferritinLevel', questionText: 'Serum Ferritin (ng/mL)', type: 'number' },
    { id: 'heartFailureSigns', questionText: 'Signs of heart failure (Tachycardia, shortness of breath, crackles)?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Thalassemia management focuses on (1) Maintaining adequate Hemoglobin levels to suppress ineffective erythropoiesis while minimizing iron accumulation, (2) Using strictly 'Leukodepleted' and 'Phenotype-matched' blood to prevent life-threatening alloimmunization, and (3) Proactive screening for cardiac and endocrine complications of iron overload. Clinicians must realize that chronic anemia can mask early signs of heart failure.",
    stages: [
      {
        label: "Stage 1: Acute Anemia Assessment",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Hyperhemolytic Crisis Screen",
            threshold: "SUDDEN HB DROP",
            orders: [
              "Laboratory Verification: Complete Blood Count and Reticulocyte Count.",
              "Markers of Hemolysis: Bilirubin (Total and Indirect), Lactate Dehydrogenase, and Haptoglobin.",
              "Alloimmunization Check: Group and Crossmatch with 'Extended Phenotype' (Rh and Kell systems) to prevent transfusion reactions.",
              "Trigger Search: Screen for infection (specifically Mycoplasma or Parvovirus B19) as a trigger for crisis."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Baseline Bloods: Electrolytes, Urea, Creatinine, and Liver Function Tests.",
              "Iron Baseline: Serum Ferritin level (Critical for long-term chelation titration).",
              "Cardiac Screen: Baseline Electrocardiogram if heart rate is high or ferritin is consistently > 1000 ng/mL."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Transfusion Therapeutics",
        shortLabel: "Management",
        color: "red",
        cards: [
          {
            title: "Transfusion Protocol",
            threshold: "HB < 7-8 G/DL OR SYMPTOMATIC",
            isCritical: true,
            orders: [
              "Target Hemoglobin: Transfuse to a post-transfusion level of 11.5 - 12.0 g/dL.",
              "Blood Choice: MANDATORY use of Leukodepleted, filtered, and Phenotype-matched Packed Red Blood Cells.",
              "Volume: Usually 10-15 mL/kg of Packed Red Blood Cells (infused over 3-4 hours)."
            ],
            prescriptions: [
              {
                drug: "Packed Red Blood Cells",
                dose: "10 - 15 mL/kg",
                route: "Intravenous Infusion",
                frequency: "Single Transfusion",
                calculation: (w) => `${(w * 10).toFixed(0)} - ${(w * 15).toFixed(0)} mL`,
                notes: "Limit to 10 mL/kg if there are signs of fluid overload or severe anemia (Hb < 5)."
              }
            ]
          },
          {
            title: "Chelation Review",
            orders: [
              "Indication: Started once Ferritin is > 1000 ng/mL or after 10-20 transfusions.",
              "Assessment: Review adherence to Oral Deferasirox or Subcutaneous Deferoxamine.",
              "Note: Chelation may be temporarily suspended during severe systemic infection."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Complication Watch [!]",
        shortLabel: "Monitoring",
        color: "amber",
        cards: [
          {
            title: "Nursing: Vigilance Checks [NS]",
            nursing: [
              "Transfusion Reaction Monitoring: Check vitals every 15 mins for the first hour of transfusion.",
              "Fluid Overload: Monitor for sudden cough, tachypnea, or rales during and after transfusion.",
              "Neurological Check: Assess for sudden focal deficits (Stroke risk is high in Thalassemia intermedia).",
              "Endocrine Screen: Monitor Blood Glucose (Diabetes risk due to pancreatic iron deposition)."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Recovery & Long-term Roadmap",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Chronic Surveillance",
            orders: [
              "Cardiac MRI (T2*): Mandatory every 1-2 years for patients on chronic transfusion to detect heart iron early.",
              "Endocrine Follow-up: Annual screening for Growth Hormone deficiency, Hypothyroidism, and Hypogonadism.",
              "Vaccination Advice: Ensure the patient is immunized against Hepatitis B (due to chronic blood exposure) and seasonal Influenza."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.heartFailureSigns === true || (data.ferritinLevel && data.ferritinLevel > 2500)) {
      return { level: 'critical', details: ["High-risk Iron Overload or Heart Failure detected. URGENT Cardiology/Hematology consult."] };
    }
    if (data.hemoglobinDrop === true) {
      return { level: 'severe', details: ["Acute Hemolytic Crisis requiring urgent transfusion support."] };
    }
    return { level: 'moderate', details: ["Stable Thalassemia under clinical review."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Post-transfusion Hemoglobin stable (> 10 g/dL).",
    "No evidence of transfusion-associated circulatory overload (TACO).",
    "Iron chelation plan optimized and adherence confirmed.",
    "Follow-up scheduled in 4 weeks for Ferritin and CBC check."
  ],
  getRedFlags: () => ["Shortness of breath", "Chest pain", "Fainting or severe palpitations", "Yellowing of eyes (worsening jaundice)", "Fever > 38.5°C"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "TIF: Management of Transfusion Dependent Thalassemia", url: "https://thalassaemia.org.cy/publications/tif-publications/" },
    { title: "RCH Melbourne: Thalassemia Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/Thalassaemia/" }
  ]
};
