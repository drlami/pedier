import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Immune Thrombocytopenic Purpura (ITP)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: ASH 2019 Guidelines, International Working Group (IWG), and RCH Melbourne
 */
export const wardItpProtocol: DiseaseProtocol = {
  id: 'ward-itp',
  name: 'Immune Thrombocytopenic Purpura Master Pathway',
  system: 'Hematology & Oncology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Immune Thrombocytopenic Purpura (ITP) is an acquired autoimmune disorder characterized by isolated thrombocytopenia (platelet count less than 100 x 10⁹/L) in the absence of other causes. This exhaustive directive covers the exclusion of secondary causes, the "Bleeding Score" based management strategy, and induction protocols using Intravenous Immunoglobulin or Corticosteroids.',
  image: {
    url: "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Assessment of petechiae, ecchymosis, and platelet recovery"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'plateletCount', questionText: 'Platelet Count (x 10⁹/L)', type: 'number' },
    { id: 'activeBleeding', questionText: 'Active mucosal bleeding (Epistaxis, GI, or Menorrhagia)?', type: 'boolean' },
    { id: 'severeHeadache', questionText: 'Severe headache or neurological signs (Suspected ICH)?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Immune Thrombocytopenic Purpura management focuses on (1) Treating the patient, not the platelet count—asymptomatic children with very low counts can often be managed with 'Wait and Watch', (2) Rapidly increasing the platelet count in cases of significant mucosal bleeding or trauma using Intravenous Immunoglobulin, and (3) Rigorous exclusion of secondary causes like Leukemia or Systemic Lupus Erythematosus before initiating long-term therapy.",
    stages: [
      {
        label: "Stage 1: Diagnostic Verification & Safety",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Exclusion of Secondary Causes",
            threshold: "MANDATORY BEFORE DIAGNOSIS",
            orders: [
              "Peripheral Blood Smear: MANDATORY to rule out pseudothrombocytopenia (clumping), blast cells (leukemia), or schistocytes (HUS).",
              "Physical Exam: Check for hepatosplenomegaly or lymphadenopathy (if present, reconsider the diagnosis of ITP).",
              "Bone Marrow Aspiration: Not required for classic ITP but MANDATORY if there are atypical features (unexplained fever, bone pain, weight loss, or multi-lineage cytopenias)."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Complete Blood Count: Verify isolated thrombocytopenia (Hemoglobin and White Blood Cells should be normal).",
              "Blood Group and Coagulation Screen: Baseline for potential transfusion or to rule out DIC.",
              "Inflammatory/Autoimmune Screen: Consider Antinuclear Antibody (ANA) screening, especially in adolescent females.",
              "Infection Screen: Check for Hepatitis B, C, and HIV if risk factors or chronic course."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Management Strategy (Bleeding Score)",
        shortLabel: "Management",
        color: "amber",
        cards: [
          {
            title: "The 'Wait and Watch' Path",
            threshold: "NO OR MINOR BLEEDING",
            orders: [
              "Indication: Petechiae and bruising only (Grade 1-2 bleeding), regardless of platelet count.",
              "Action: Observation without specific drug therapy. Most pediatric cases self-resolve within 3-6 months."
            ]
          },
          {
            title: "Active Intervention [DR]",
            threshold: "MODERATE TO SEVERE BLEEDING",
            orders: [
              "Indication: Significant mucosal bleeding (Grade 3+) or upcoming emergency surgery.",
              "1st Line: Intravenous Immunoglobulin (IVIG) - provides the most rapid increase in platelets.",
              "Alternative: Short-course Oral Prednisolone (2-4 mg/kg/day for 4-7 days)."
            ],
            prescriptions: [
              {
                drug: "Intravenous Immunoglobulin (IVIG)",
                dose: "0.8 - 1 g/kg",
                route: "Intravenous Infusion",
                frequency: "Single Dose",
                calculation: (w) => `${(w * 1.0).toFixed(1)} g`,
                notes: "May repeat once if count remains dangerously low and bleeding continues."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 3: Nursing & Activity Restrictions [NS]",
        shortLabel: "Nursing/Safety",
        color: "red",
        cards: [
          {
            title: "Critical Safety Directives",
            nursing: [
              "No Intramuscular Injections: High risk of hematoma.",
              "Avoid Anti-platelet Drugs: Strictly NO Aspirin or Non-Steroidal Anti-Inflammatory Drugs (NSAIDs). Use Paracetamol for pain.",
              "Activity Restriction: No contact sports or high-impact activities while platelet count is less than 30-50 x 10⁹/L.",
              "Neurological Checks: Perform every 4 hours if the platelet count is less than 10 x 10⁹/L to monitor for Intracranial Hemorrhage."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Recovery & Chronicity Mapping",
        shortLabel: "Follow-up",
        color: "emerald",
        cards: [
          {
            title: "Monitoring Roadmap",
            orders: [
              "Acute ITP: Resolution within 6 months.",
              "Persistent ITP: Duration 6-12 months.",
              "Chronic ITP: Duration greater than 12 months.",
              "Follow-up: Repeat Complete Blood Count weekly until platelets are greater than 20-30 x 10⁹/L, then space out based on clinical symptoms."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.severeHeadache === true || (data.activeBleeding === true && data.plateletCount && data.plateletCount < 10)) {
      return { level: 'critical', details: ["High risk for Intracranial Hemorrhage or severe mucosal bleeding."] };
    }
    if (data.plateletCount && data.plateletCount < 10) {
      return { level: 'severe', details: ["Severe thrombocytopenia - requires strict activity restriction."] };
    }
    return { level: 'moderate', details: ["Stable Immune Thrombocytopenic Purpura."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "No active mucosal bleeding.",
    "Parent understands the signs of internal bleeding (headache, vomiting).",
    "Clear plan for follow-up Complete Blood Count.",
    "NSAIDs and Aspirin strictly avoided.",
    "Contact sports restriction explained."
  ],
  getRedFlags: () => ["Severe headache", "Vomiting", "Persistent nosebleed (>30 mins)", "Blood in urine or stool", "New neurological deficit"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "ASH 2019 Guidelines for Immune Thrombocytopenia", url: "https://ashpublications.org/bloodadvances/article/3/23/3829/429213" },
    { title: "RCH Melbourne: ITP Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/Immune_Thrombocytopenic_Purpura/" }
  ]
};
