import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Hemophilia & Bleeding Disorders
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: WFH Guidelines (2020), ISTH, and RCH Melbourne
 */
export const wardHemophiliaProtocol: DiseaseProtocol = {
  id: 'ward-hemophilia',
  name: 'Hemophilia Master Pathway',
  system: 'Hematology & Oncology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Hemophilia is an inherited bleeding disorder—Hemophilia A (Factor VIII deficiency) or Hemophilia B (Factor IX deficiency)—characterized by a failure of the coagulation cascade. Acute presentations involve hemarthrosis (joint bleeds), muscle hematomas, or life-threatening intracranial hemorrhage. This exhaustive directive covers the "Treat First" trauma philosophy, precise factor dose calculations, and the management of inhibitors.',
  image: {
    url: "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Joint assessment for hemarthrosis and coagulation factor replacement"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'type', questionText: 'Hemophilia Type', type: 'select', options: [
      { label: 'Hemophilia A (Factor VIII)', value: 'A' },
      { label: 'Hemophilia B (Factor IX)', value: 'B' }
    ]},
    { id: 'bleedSite', questionText: 'Location of suspected bleed', type: 'select', options: [
      { label: 'Joint (Hemarthrosis)', value: 'joint' },
      { label: 'Muscle (Hematoma)', value: 'muscle' },
      { label: 'Critical (Brain/Neck/GI)', value: 'critical' }
    ]},
    { id: 'traumaPresent', questionText: 'History of recent trauma (even minor)?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Hemophilia management centers on the 'Treat First, Investigate Later' principle: (1) Immediate replacement of the deficient factor PRIOR to any radiological imaging or detailed workup in cases of trauma or suspected bleed, (2) Achieving specific target levels based on the severity and site of hemorrhage, and (3) Implementing the R.I.C.E. (Rest, Ice, Compression, Elevation) strategy for joint and muscle bleeds. Clinicians must strictly AVOID all anti-platelet medications like Aspirin and Ibuprofen.",
    stages: [
      {
        label: "Stage 1: Acute Bleed Identification",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "The 'Treat First' Directive",
            threshold: "URGENT REPLACEMENT",
            isCritical: true,
            orders: [
              "Mandatory: If a patient with Hemophilia reports 'the aura' or pain in a joint, believe them and administer factor immediately.",
              "Trauma Rule: In cases of head trauma or neck injury, give the factor FIRST, then send for Computed Tomography (CT).",
              "Access: Prioritize peripheral access; avoid Central Line access for acute replacement if possible to minimize infection risk."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Baseline Coagulation: Activated Partial Thromboplastin Time (aPTT - typically prolonged) and Prothrombin Time (PT - typically normal).",
              "Factor Assay: Measure baseline level if time permits, but do not wait for results before treating.",
              "Inhibitor Screen: Mandatory if the patient fails to respond to standard factor doses.",
              "Avoidance: Strictly NO Intramuscular (IM) injections and NO Non-Steroidal Anti-Inflammatory Drugs (NSAIDs)."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Factor Replacement Strategy",
        shortLabel: "Management",
        color: "red",
        cards: [
          {
            title: "Target Factor Levels",
            threshold: "SITE-SPECIFIC DOSING",
            orders: [
              "Joint/Muscle Bleeds: Target 40-60% factor levels.",
              "Critical Bleeds (ICH/GI/Neck): Target 80-100% factor levels.",
              "Calculation (Hemophilia A): 1 Unit/kg of Factor VIII raises the plasma level by 2%.",
              "Calculation (Hemophilia B): 1 Unit/kg of Factor IX raises the plasma level by 1% (approx)."
            ],
            prescriptions: [
              {
                drug: "Factor VIII Concentrate",
                dose: "25 - 50 Units/kg",
                route: "Intravenous Push",
                frequency: "Every 12-24 hours",
                calculation: (w) => `${(w * 25).toFixed(0)} - ${(w * 50).toFixed(0)} Units`,
                notes: "For Hemophilia A. Dose depends on bleed severity."
              },
              {
                drug: "Factor IX Concentrate",
                dose: "50 - 100 Units/kg",
                route: "Intravenous Push",
                frequency: "Every 24 hours",
                calculation: (w) => `${(w * 50).toFixed(0)} - ${(w * 100).toFixed(0)} Units`,
                notes: "For Hemophilia B. Requires higher doses due to larger volume of distribution."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 3: Nursing & R.I.C.E. Protocol [NS]",
        shortLabel: "Nursing Care",
        color: "amber",
        cards: [
          {
            title: "Bedside Joint Management",
            nursing: [
              "Rest: Immobilize the joint in a position of comfort.",
              "Ice: Apply ice packs for 15-20 minutes every 4 hours (avoid direct skin contact).",
              "Compression: Use elastic bandages gently if tolerated.",
              "Elevation: Maintain the affected limb above the level of the heart.",
              "Pain: Use Paracetamol or Oral Opioids. NO Ibuprofen."
            ]
          },
          {
            title: "Neuro-Vigilance",
            threshold: "SUSPECTED HEAD TRAUMA",
            isCritical: true,
            nursing: [
              "Neurological Check: Assess Glasgow Coma Scale and pupils every 1-2 hours for the first 24 hours post-trauma.",
              "Report: Notify physician immediately for any headache, vomiting, or change in behavior."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Post-Bleed Recovery & Prophylaxis",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Rehabilitation Roadmap",
            orders: [
              "Physiotherapy: Essential once pain has resolved to restore joint range of motion and prevent 'Target Joint' development.",
              "Prophylaxis: Review adherence to home prophylaxis regimen (e.g., Emicizumab or factor infusions).",
              "Education: Ensure family has an updated 'Emergency Factor Plan' and knows how to administer factor at home."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.bleedSite === 'critical' || data.traumaPresent === true) {
      return { level: 'critical', details: ["Life-threatening bleed or high-risk trauma. Immediate factor replacement required."] };
    }
    if (data.bleedSite === 'muscle') {
      return { level: 'severe', details: ["Significant muscle hematoma - Risk of compartment syndrome."] };
    }
    return { level: 'moderate', details: ["Acute joint bleed (Hemarthrosis)."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Bleeding stabilized and pain well-controlled.",
    "Target factor levels achieved and maintained for the required duration.",
    "Parent understands the signs of Intracranial Hemorrhage.",
    "Follow-up scheduled with the Comprehensive Hemophilia Treatment Center."
  ],
  getRedFlags: () => ["Severe headache", "Difficulty breathing (Neck bleed)", "Numbness or tingling in limb (Compartment syndrome)", "Visible blood in urine or stool"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "WFH: Guidelines for the Management of Hemophilia", url: "https://elearning.wfh.org/resource/guidelines-for-the-management-of-hemophilia/" },
    { title: "RCH Melbourne: Hemophilia Clinical Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/Haemophilia/" }
  ]
};
