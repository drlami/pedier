import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Pancytopenia (Approach and Initial Workup)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: ASH Guidelines, Pediatric Hematology Handbook, and RCH Melbourne
 */
export const wardPancytopeniaProtocol: DiseaseProtocol = {
  id: 'ward-pancytopenia',
  name: 'Pancytopenia Master Pathway',
  system: 'Hematology & Oncology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Pancytopenia is the simultaneous reduction in all three major cellular components of blood: erythrocytes (anemia), leukocytes (leukopenia/neutropenia), and platelets (thrombocytopenia). This exhaustive directive covers the systematic diagnostic search for bone marrow failure, malignancy, or peripheral destruction, and the immediate stabilization of associated emergencies.',
  image: {
    url: "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Assessment of multi-lineage cytopenia and marrow health"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'feverPresent', questionText: 'Fever (Temperature ≥ 38.0°C) or signs of infection?', type: 'boolean' },
    { id: 'activeBleeding', questionText: 'Active bleeding or mucosal petechiae?', type: 'boolean' },
    { id: 'organomegaly', questionText: 'Hepatomegaly, splenomegaly, or lymphadenopathy?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Pancytopenia management focuses on (1) Stabilizing 'Critical Cytopenias' (Febrile Neutropenia or severe symptomatic anemia/bleeding), (2) Establishing whether the cause is 'Central' (Bone Marrow Failure/Infiltration) or 'Peripheral' (Destruction/Sequestration), and (3) Avoiding unnecessary bone marrow procedures until primary infections or nutritional deficiencies are excluded. Clinicians must maintain a high suspicion for Acute Leukemia in any child with pancytopenia and significant organomegaly.",
    stages: [
      {
        label: "Stage 1: Emergency Risk Assessment",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Immediate Stabilization Orders [DR]",
            threshold: "CRITICAL VALUES",
            orders: [
              "Neutropenia: If Fever is present and Absolute Neutrophil Count < 500, initiate FEBRILE NEUTROPENIA PROTOCOL immediately.",
              "Thrombocytopenia: If Platelet count < 10,000/microliter or active bleeding, prepare for Platelet Transfusion.",
              "Severe Anemia: If Hemoglobin < 5-6 g/dL and symptomatic (Tachycardia/Shortness of breath), prepare for Packed Red Blood Cell transfusion.",
              "Access: Secure Intravenous access; avoid Intramuscular injections due to bleeding risk."
            ]
          },
          {
            title: "Initial Diagnostic Panel",
            orders: [
              "Complete Blood Count with Differential: Verify the severity of all three lineages.",
              "Reticulocyte Count: Low count suggests marrow failure (Central); High count suggests destruction (Peripheral).",
              "Peripheral Blood Smear: MANDATORY. Look for blast cells (Leukemia), schistocytes (Hemolytic Uremic Syndrome), or macro-ovalocytes (B12/Folate deficiency).",
              "Inflammatory/Metabolic Screen: Lactate Dehydrogenase (LDH) and Uric Acid (Markers of cell turnover/malignancy)."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Etiological Search (Central vs. Peripheral)",
        shortLabel: "Diagnostics",
        color: "amber",
        cards: [
          {
            title: "Marrow Infiltration & Failure Screen",
            orders: [
              "Bone Marrow Aspiration & Biopsy: The definitive test for Leukemia, Aplastic Anemia, or Neuroblastoma infiltration. (Consult Pediatric Hematology first).",
              "Viral Screen: Check for Parvovirus B19, Hepatitis A/B/C, Epstein-Barr Virus (EBV), and Cytomegalovirus (CMV).",
              "Autoimmune Screen: Antinuclear Antibody (ANA) to rule out Systemic Lupus Erythematosus (SLE)."
            ]
          },
          {
            title: "Peripheral Destruction & Sequestration",
            orders: [
              "Radiology: Ultrasound of the abdomen to assess for Splenomegaly (hypersplenism causing sequestration).",
              "Nutritional Baseline: Serum B12, Folate, and Iron studies.",
              "Hemolysis Screen: Direct Antiglobulin Test (DAT/Coombs), Bilirubin, and Haptoglobin."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Nursing & Protective Care [NS]",
        shortLabel: "Monitoring",
        color: "red",
        cards: [
          {
            title: "Protective Directives",
            nursing: [
              "Isolation: Implement Protective Isolation if Absolute Neutrophil Count is less than 500 cells/microliter.",
              "Bleeding Precautions: Use soft toothbrushes; avoid straining during bowel movements (use stool softeners).",
              "Vital Signs: Heart Rate and Blood Pressure monitoring every 4 hours to detect early shock or symptomatic anemia.",
              "Site Inspection: Check for petechiae, bruising, or bleeding from line sites every shift."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Treatment & Disposition",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Intervention Roadmap",
            orders: [
              "Nutritional Replacement: Supplement B12 or Folate if deficiency is confirmed.",
              "Definitive Therapy: If Leukemia or Aplastic Anemia is confirmed, transition to specific Oncology protocols.",
              "Blood Support: Ensure all blood products are Leukodepleted and Irradiated if the patient is a candidate for Bone Marrow Transplant."
            ]
          },
          {
            title: "Follow-up",
            orders: [
              "Hematology Clinic: Review within 1 week if cause is likely infectious; immediate transfer if malignancy is suspected."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.feverPresent === true || data.activeBleeding === true) {
      return { level: 'critical', details: ["Pancytopenia with acute complication (Infection or Bleeding)."] };
    }
    return { level: 'severe', details: ["Multi-lineage failure requiring urgent etiological workup."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Emergency stabilization of cytopenias completed.",
    "Peripheral blood smear reviewed by a Pathologist or Hematologist.",
    "No evidence of ongoing life-threatening bleeding.",
    "Clear plan for Bone Marrow Aspiration if indicated."
  ],
  getRedFlags: () => ["Fever in a neutropenic patient", "Sudden headache (Intracranial hemorrhage)", "Blast cells on peripheral smear", "Rapidly enlarging spleen or liver"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "ASH: Approach to the child with pancytopenia", url: "https://ashpublications.org/" },
    { title: "RCH Melbourne: Pancytopenia Clinical Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/Pancytopenia/" }
  ]
};
