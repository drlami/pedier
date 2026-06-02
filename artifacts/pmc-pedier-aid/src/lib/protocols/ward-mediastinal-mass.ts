import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Superior Vena Cava Syndrome (SVCS) / Mediastinal Mass
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: ASCO Guidelines, Pediatric Oncology Handbook, and RCH Melbourne
 */
export const wardMediastinalMassProtocol: DiseaseProtocol = {
  id: 'ward-mediastinal-mass',
  name: 'Mediastinal Mass / SVCS Master Pathway',
  system: 'Hematology & Oncology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Superior Vena Cava Syndrome (SVCS) and Superior Mediastinal Syndrome (SMS) are life-threatening oncological emergencies caused by an anterior mediastinal mass (often Lymphoma or Leukemia) compressing the airway or great vessels. This exhaustive directive covers the "No Sedation" safety mandate, upright positioning, and urgent biopsy planning.',
  image: {
    url: "https://images.unsplash.com/photo-1579152276502-545a248a69a7?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Critical airway and vascular compression monitoring"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'orthopnea', questionText: 'Difficulty breathing when lying flat?', type: 'boolean' },
    { id: 'facialEdema', questionText: 'Facial swelling or venous distention in the neck?', type: 'boolean' },
    { id: 'stridor', questionText: 'Stridor or wheeze present?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Mediastinal Mass management focuses on the 'Airway First' principle: (1) Maintain the patient in an upright or 'position of comfort' at all costs to prevent catastrophic airway collapse, (2) Strictly AVOID sedation or general anesthesia until the airway is stabilized or chemotherapy initiated, and (3) Rapid diagnostic workup through peripheral markers (Uric Acid, LDH) and least-invasive biopsy. Airway collapse can occur suddenly and irreversibly in the supine position.",
    stages: [
      {
        label: "Stage 1: Emergency Positioning & Triage",
        shortLabel: "Assessment",
        color: "red",
        cards: [
          {
            title: "Critical Safety Mandates",
            threshold: "URGENT",
            isCritical: true,
            orders: [
              "Positioning: Keep the patient UPRIGHT or leaning forward. DO NOT force the patient to lie flat for any reason.",
              "Sedation Ban: STRICTLY NO sedation, anxiolytics, or general anesthesia. These agents relax airway muscles and lead to immediate, fatal collapse.",
              "Oxygenation: Provide supplemental oxygen via nasal cannula or mask if required, but maintain position of comfort."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Radiology: Urgent Chest X-ray (Upright) and Computed Tomography (CT) of the chest (only if airway is stable and can be performed without sedation).",
              "Laboratory Panel: Complete Blood Count with Differential, Lactate Dehydrogenase (LDH), and Tumor Lysis Syndrome Screen (Uric Acid, Potassium, Phosphate, Calcium).",
              "Access: Establish two peripheral Intravenous lines (preferably in the lower extremities if Superior Vena Cava compression is severe)."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Diagnostic & Metabolic Rescue",
        shortLabel: "Management",
        color: "blue",
        cards: [
          {
            title: "Least-Invasive Biopsy Strategy",
            orders: [
              "Hierarchy of Biopsy: (1) Peripheral blood/Bone marrow, (2) Pleural fluid aspiration, (3) Supraclavicular lymph node biopsy, (4) Mediastinal biopsy (last resort).",
              "Note: Aim to establish a diagnosis without General Anesthesia."
            ]
          },
          {
            title: "Anticipatory Tumor Lysis Rescue",
            orders: [
              "Hyperhydration: Start Isotonic Saline (0.9% Sodium Chloride) at 1.5x to 2.0x maintenance.",
              "Hypouricemic Therapy: Give Rasburicase (0.2 mg/kg) if Uric Acid is elevated, as these tumors often lyse rapidly with therapy."
            ],
            prescriptions: [
              {
                drug: "Rasburicase",
                dose: "0.2 mg/kg",
                route: "Intravenous",
                frequency: "Single Dose",
                calculation: (w) => `${(w * 0.2).toFixed(1)} mg`,
                notes: "Rapidly lowers Uric Acid to prevent renal failure."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 3: Emergent Therapeutics [!]",
        shortLabel: "Emergency Therapy",
        color: "red",
        cards: [
          {
            title: "Emergency Cytoreduction",
            threshold: "SEVERE RESPIRATORY DISTRESS",
            isCritical: true,
            orders: [
              "Corticosteroids: Administer Intravenous Dexamethasone or Methylprednisolone immediately if the airway is threatened, even before a definitive tissue diagnosis is made.",
              "Emergency Radiation: In extreme cases where steroids fail, consider emergent low-dose radiation to the mediastinum."
            ],
            prescriptions: [
              {
                drug: "Dexamethasone",
                dose: "0.5 - 1.0 mg/kg",
                route: "Intravenous",
                frequency: "Every 6 hours",
                calculation: (w) => `${Math.min(w * 0.5, 10).toFixed(0)} mg`,
                notes: "Max 10-16mg. Rapidly reduces mass size in sensitive tumors (T-cell Leukemia/Lymphoma)."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 4: Nursing Vigilance & Monitoring [NS]",
        shortLabel: "Monitoring",
        color: "amber",
        cards: [
          {
            title: "Respiratory Surveillance",
            nursing: [
              "Positioning: Ensure the patient never lies flat. Monitor for slipping in bed.",
              "Airway Check: Monitor for stridor, increased work of breathing, or voice changes every 1 hour.",
              "Vascular Check: Monitor for increasing facial plethora (redness) or swelling of the upper limbs.",
              "Intake & Output: Strict hourly charting to monitor for fluid overload which can worsen airway edema."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.orthopnea === true || data.stridor === true) {
      return { level: 'critical', details: ["Impending Airway Collapse - PICU and Oncology Consultant must be present."] };
    }
    if (data.facialEdema === true) {
      return { level: 'severe', details: ["Significant SVCS - High risk of rapid progression."] };
    }
    return { level: 'severe', details: ["Mediastinal Mass - Requires intensive monitoring and urgent workup."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Airway stabilized and stridor resolved.",
    "Initial cytoreduction (chemotherapy/steroids) initiated.",
    "Metabolic markers (Tumor Lysis) stable.",
    "Tolerating upright position and resting comfortably."
  ],
  getRedFlags: () => ["Sudden stridor", "Inability to swallow saliva", "Cyanosis (Blue color)", "Falling level of consciousness", "New-onset wheezing"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "ASCO: Management of Oncological Emergencies", url: "https://ascopubs.org/" },
    { title: "RCH Melbourne: Mediastinal Mass Clinical Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/Mediastinal_mass/" }
  ]
};
