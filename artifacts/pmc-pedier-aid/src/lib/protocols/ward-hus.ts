import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

/**
 * Pediatric Ward: Hemolytic Uremic Syndrome (HUS)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: StatPearls (2024), UK Kidney Association, and Melbourne RCH.
 */
export const wardHusProtocol: DiseaseProtocol = {
  id: 'ward-hus',
  name: 'Hemolytic Uremic Syndrome Master Pathway',
  system: 'Renal & Urinary System',
  unit: 'ward',
  description: 'Specialized inpatient directive for the clinical triad: MAHA, Thrombocytopenia, and AKI. Management of STEC-HUS and atypical variants.',
  image: {
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Microangiopathic hemolytic anemia and AKI management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Weight', type: 'number', unit: 'kg' },
    { id: 'hemoglobin', questionText: 'Hemoglobin level (g/dL)', type: 'number' },
    { id: 'anuria', questionText: 'Anuria or significant oliguria present?', type: 'boolean' },
    { id: 'neuroSymptoms', questionText: 'Seizures, altered mental status, or stroke signs?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Management is primarily supportive. Avoid anti-motility agents and use antibiotics with extreme caution (risk of increasing toxin release). Platelet transfusions are generally contraindicated unless life-threatening bleeding is present.",
    stages: [
      {
        label: "Stage 1: Verification & Multi-system Baseline",
        shortLabel: "Verification",
        color: "blue",
        cards: [
          {
            title: "Confirming the Triad [DR]",
            orders: [
              "CBC & Peripheral Smear: Check for Schistocytes (Helmets).",
              "LDH & Haptoglobin: Confirm Intravascular Hemolysis.",
              "Platelet Count: Expected < 150 x 10⁹/L (often < 50).",
              "Renal Function: Creatinine, U&E, and Calcium/Phosphate.",
              "Urine Microscopy: Look for hematuria and casts."
            ]
          },
          {
            title: "Toxin & Etiology Search",
            orders: [
              "Stool Culture & PCR: Look for Shiga-toxin producing E. coli (STEC).",
              "Rectal Swab: If stool not available.",
              "Consider Atypical HUS (aHUS): Screen for ADAMTS13 and complement mutations if no diarrheal prodrome."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Hematological & Renal Support",
        shortLabel: "Supportive Care",
        color: "red",
        cards: [
          {
            title: "Transfusion Directive",
            isCritical: true,
            threshold: "Hb < 6-7 g/dL",
            orders: [
              "Packed RBC Transfusion: Give 5-10 mL/kg SLOWLY (risk of fluid overload).",
              "Platelet Transfusion: STRONGLY DISCOURAGED; may fuel microthrombosis.",
              "Monitor for transfusion reactions and rapid rise in creatinine post-transfusion."
            ]
          },
          {
            title: "Renal & Fluid Monitoring [NS]",
            orders: [
              "Restrict Fluid to Insensible Loss + Urine Output once AKI established.",
              "Stop all NSAIDs and Nephrotoxic agents."
            ],
            nursing: [
              "Hourly UO monitoring.",
              "Assess for bloody diarrhea and abdominal guarding.",
              "Check neurological status every 4 hours."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Extra-Renal Monitoring",
        shortLabel: "Complications",
        color: "amber",
        cards: [
          {
            title: "Neurological Triggers [!]",
            isCritical: true,
            triggers: [
              "Seizures: Suggests CNS microthrombosis or Hypertensive encephalopathy.",
              "Altered GCS: Immediate CT Head required.",
              "Manage seizures with Levetiracetam or Phenytoin (per protocol)."
            ]
          },
          {
            title: "Gastrointestinal Vigilance",
            orders: [
              "Monitor for Bowel Perforation/Intussusception.",
              "Monitor for Pancreatitis (Amylase/Lipase if abdominal pain severe)."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Remission & Surveillance",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Long-term Monitoring roadmap",
            orders: [
              "Discharge only once renal function stabilizes and diuresis is robust.",
              "Mandatory follow-up with Nephrology (Months 1, 3, 6, 12, then annually).",
              "Lifelong monitoring for late-onset Hypertension and Proteinuria (CKD risk)."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.neuroSymptoms === true || data.anuria === true) {
      return { level: 'critical', details: ["Neurological involvement or anuria; high mortality risk."] };
    }
    if (Number(data.hemoglobin || 15) < 7) {
      return { level: 'severe', details: ["Severe anemia requiring probable transfusion."] };
    }
    return { level: 'severe', details: ["All HUS cases require high-intensity monitoring."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Stabilizing hemoglobin and platelet counts.",
    "No neurological deficits or active seizures.",
    "Renal function stabilizing; no AEIOU dialysis triggers.",
    "Follow-up for long-term CKD surveillance scheduled."
  ],
  getRedFlags: () => ["Seizures", "Abdominal guarding", "Hb < 6", "Anuria"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "StatPearls: Hemolytic Uremic Syndrome", url: "https://www.ncbi.nlm.nih.gov/books/NBK534241/" },
    { title: "RCH Melbourne: HUS Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/Haemolytic_Uraemic_Syndrome/" }
  ]
};
