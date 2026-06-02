import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Approach to Anemia
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: ASH Guidelines, WHO Standards, and RCH Melbourne
 */
export const wardAnemiaProtocol: DiseaseProtocol = {
  id: 'ward-anemia',
  name: 'Anemia: Clinical Approach Master Pathway',
  system: 'Hematology & Oncology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Anemia is defined as a reduction in the hemoglobin concentration, red blood cell count, or packed cell volume below the age-adjusted normal range, leading to impaired oxygen-carrying capacity. This exhaustive directive covers the systematic classification by Mean Corpuscular Volume (MCV), the "Production vs. Destruction" diagnostic logic, and stabilization of symptomatic anemia.',
  image: {
    url: "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Assessment of conjunctival pallor and erythrocyte morphology"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'hemoglobinValue', questionText: 'Current Hemoglobin (g/dL)', type: 'number' },
    { id: 'mcvValue', questionText: 'Mean Corpuscular Volume (MCV) - fL', type: 'number' },
    { id: 'isSymptomatic', questionText: 'Symptomatic (Tachycardia, shortness of breath, or lethargy)?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "The approach to anemia focuses on (1) Categorization by Mean Corpuscular Volume (MCV) to narrow the differential, (2) Assessment of the Reticulocyte Count to determine if the marrow is responding (destruction) or failing (production), and (3) Identifying 'Critical Anemia' requiring transfusion. Clinicians must always review the peripheral blood smear personally to identify pathognomonic shapes like spherocytes, sickles, or blasts.",
    stages: [
      {
        label: "Stage 1: Classification & Initial Workup",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Classification by MCV",
            threshold: "DIFFERENTIAL DIAGNOSIS",
            orders: [
              "Microcytic (Low MCV): Iron Deficiency (most common), Thalassemia trait, Lead Poisoning, Sideroblastic Anemia.",
              "Normocytic (Normal MCV): Acute Hemorrhage, Early Iron Deficiency, Chronic Disease, Hemolysis (Early phase).",
              "Macrocytic (High MCV): Vitamin B12/Folate Deficiency, Diamond-Blackfan Anemia, Hypothyroidism, Marrow Failure."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Complete Blood Count with Differential: Check for associated cytopenias (Pancytopenia risk).",
              "Reticulocyte Count: Mandatory to assess marrow response (Production vs. Destruction).",
              "Peripheral Blood Smear: PERSONAL REVIEW for sickles, spherocytes, or schistocytes.",
              "Baseline Iron Studies: Serum Iron, Ferritin, and Total Iron Binding Capacity.",
              "Stool Guaiac: Screen for occult gastrointestinal blood loss."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Secondary Diagnostic Triage",
        shortLabel: "Management",
        color: "amber",
        cards: [
          {
            title: "Hemolytic Workup",
            threshold: "IF RETICULOCYTES ARE HIGH",
            orders: [
              "Direct Antiglobulin Test (DAT/Coombs): Rule out Autoimmune Hemolytic Anemia.",
              "Biochemical Markers: Unconjugated Bilirubin, Lactate Dehydrogenase (LDH), and Haptoglobin.",
              "Enzyme Screen: Glucose-6-Phosphate Dehydrogenase (G6PD) assay (Check only when NOT in acute crisis)."
            ]
          },
          {
            title: "Marrow Failure Screen",
            threshold: "IF RETICULOCYTES ARE LOW",
            orders: [
              "Nutritional Panel: Serum Vitamin B12 and Folate levels.",
              "Thyroid Screen: Thyroid Stimulating Hormone (TSH) and Free T4.",
              "Bone Marrow Aspiration: Indicated if pancytopenia is present or cause remains unknown after baseline tests."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Transfusion & Stabilization [!]",
        shortLabel: "Transfusion",
        color: "red",
        cards: [
          {
            title: "Transfusion Thresholds",
            isCritical: true,
            orders: [
              "Standard Threshold: Hemoglobin < 7 g/dL in most stable patients.",
              "Symptomatic Threshold: Transfuse regardless of level if signs of heart failure or tissue hypoxia are present.",
              "Chronic Anemia Rule: Patients with chronic anemia (e.g., Thalassemia) tolerate lower levels; avoid 'number-treating' unless clinically indicated.",
              "Volume: 10-15 mL/kg of Packed Red Blood Cells infused over 4 hours."
            ]
          },
          {
            title: "Nursing: Vigilance Checks [NS]",
            nursing: [
              "Cardiac Watch: Monitor for Tachycardia and Tachypnea every 4 hours.",
              "Perfusion Check: Assess for conjunctival and palmar pallor each shift.",
              "Transfusion Safety: Stay with the patient for the first 15 minutes of any blood product infusion.",
              "Activity Level: Monitor for sudden lethargy or decreased exercise tolerance."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Treatment & Long-term Roadmap",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Therapeutic Roadmap",
            orders: [
              "Iron Deficiency: Oral Ferrous Sulfate (3-6 mg/kg/day of elemental iron) for 3 months after Hemoglobin normalizes.",
              "Nutritional Education: Diet rich in iron and Vitamin C; limit excessive cow's milk intake (maximum 500 mL/day for toddlers).",
              "Follow-up: Repeat Hemoglobin in 4 weeks to verify response to therapy."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.isSymptomatic === true || (data.hemoglobinValue && data.hemoglobinValue < 5)) {
      return { level: 'critical', details: ["Severe symptomatic anemia - High risk of high-output heart failure."] };
    }
    if (data.hemoglobinValue && data.hemoglobinValue < 7) {
      return { level: 'severe', details: ["Significant anemia requiring diagnostic urgency and potential transfusion."] };
    }
    return { level: 'moderate', details: ["Stable anemia under investigation."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Cause of anemia identified or narrowed by classification.",
    "Hemodynamically stable with no signs of heart failure.",
    "Transfusion plan established (if indicated).",
    "Long-term nutritional or iron replacement plan explained to parents."
  ],
  getRedFlags: () => ["Shortness of breath", "Chest pain", "Sudden lethargy", "Dark (cola-colored) urine", "Active bleeding"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "ASH: Evaluation of Anemia in children", url: "https://ashpublications.org/" },
    { title: "RCH Melbourne: Anemia approach", url: "https://www.rch.org.au/clinicalguide/guideline_index/Anaemia/" }
  ]
};
