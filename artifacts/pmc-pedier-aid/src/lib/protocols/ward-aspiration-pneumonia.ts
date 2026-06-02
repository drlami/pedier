import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Aspiration Pneumonia
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: AAP, NICE, and RCH Melbourne Guidelines
 * Adjusted for local formulary: Tazocin substituted for Unasyn.
 */
export const wardAspirationPneumoniaProtocol: DiseaseProtocol = {
  id: 'ward-aspiration-pneumonia',
  name: 'Aspiration Pneumonia Master Pathway',
  system: 'Respiratory System',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Aspiration Pneumonia is an infectious pulmonary process occurring when oropharyngeal or gastric contents are inhaled into the lower respiratory tract, leading to bacterial infection. This pathway provides a roadmap for differentiating chemical pneumonitis (inflammatory response) from true aspiration pneumonia, detailed anaerobic antibiotic protocols (Piperacillin-Tazobactam), and comprehensive feeding rehabilitation strategies.',
  image: {
    url: "https://images.unsplash.com/photo-1581594658553-359424894362?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Aspiration risk and management"
  },
  questions: [], 

  mmpData: {
    snapshot: "Management centers on the 'Triple-A Approach': (1) Airway Protection via positioning and suctioning, (2) Antibiotic targeting of mixed oropharyngeal flora (including anaerobes), and (3) Assessment of swallowing function. It is vital to distinguish Chemical Pneumonitis (acute inflammation from gastric acid, often resolving with supportive care) from Aspiration Pneumonia (bacterial infection requiring antimicrobial therapy). Strict 'Nothing by Mouth' (NPO) status and elevation of the head of the bed (30-45 degrees) are mandatory initial steps.",
    stages: [
      {
        label: "Stage 1: Acute Event & Differentiation (Hour 0-2)",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Pneumonitis vs. Pneumonia",
            threshold: "CRITICAL DIFFERENTIATION",
            orders: [
              "Chemical Pneumonitis: Occurs 2-12 hours post-aspiration. Often afebrile (no fever). Suction and monitor for 24-48 hours BEFORE starting antibiotics as it may resolve spontaneously.",
              "Aspiration Pneumonia: Suspect if fever persists > 48 hours, rising inflammatory markers, or high-risk features (neurological impairment, known swallowing dysfunction).",
              "Immediate Action: Lateral Decubitus positioning and oral/pharyngeal suctioning if an event is witnessed."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Complete Blood Count (CBC) with Differential: Assess for leukocytosis (high white cells) or left shift (immature neutrophils).",
              "Inflammatory Markers: C-Reactive Protein (CRP) or Procalcitonin to monitor trend of infection.",
              "Blood Cultures: Mandatory before starting any intravenous antibiotics.",
              "Blood Gas Assessment: Venous or Capillary Blood Gas to assess gas exchange and pH if respiratory distress is present.",
              "Chest X-Ray (AP/Lateral): Look for infiltrates in dependent lobes (Right Upper Lobe if supine; Lower Lobes if upright)."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Initial IV Antibiotic Strategy",
        shortLabel: "Management",
        color: "amber",
        cards: [
          {
            title: "Empirical Antibiotic Choice",
            threshold: "IF BACTERIAL PNEUMONIA SUSPECTED",
            orders: [
              "Target: Mixed oropharyngeal flora, anaerobes, and Gram-negative bacteria.",
              "Primary Choice: Piperacillin-Tazobactam (Tazocin) provides excellent anaerobic and pseudomonal coverage."
            ],
            prescriptions: [
              {
                drug: "Piperacillin-Tazobactam (Tazocin)",
                dose: "90 mg/kg (based on Piperacillin component)",
                route: "Intravenous",
                frequency: "Every 6 hours",
                calculation: (w) => `${(90 * w).toFixed(0)} mg`,
                notes: "Maximum dose: 4g/0.5g (total 4.5g). Use for suspected anaerobic infection."
              }
            ]
          },
          {
            title: "Alternative Coverage",
            threshold: "IF PENICILLIN ALLERGY OR ABSCESS",
            orders: [
              "Use Clindamycin if there is a severe penicillin allergy or if cavitation/lung abscess is visible on imaging."
            ],
            prescriptions: [
              {
                drug: "Clindamycin",
                dose: "10 mg/kg",
                route: "Intravenous",
                frequency: "Every 8 hours",
                calculation: (w) => `${(10 * w).toFixed(0)} mg`,
                notes: "Strong anaerobic and anti-staphylococcal activity."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 3: Monitoring & Escalation",
        shortLabel: "Monitoring",
        color: "red",
        cards: [
          {
            title: "Nursing: Strict Monitoring [NS]",
            nursing: [
              "Monitor Respiratory Rate and Work of Breathing (grunting, flaring, retractions) every 2-4 hours.",
              "Maintain Continuous Pulse Oximetry (target SpO2 > 94%).",
              "Positioning: Ensure Head of Bed (HOB) is maintained at 30-45 degrees at all times to prevent further aspiration.",
              "Strict NPO Status: Do not provide oral intake until cleared by the physician.",
              "Suctioning: Perform gentle oral/nasal suctioning as needed for secretions."
            ]
          },
          {
            title: "Triggers for ICU Escalation",
            isCritical: true,
            orders: [
              "Refractory Hypoxemia: Oxygen saturation < 90% despite high-flow oxygen or 50% FiO2.",
              "Septic Shock: Tachycardia, delayed capillary refill (> 3 seconds), or low blood pressure.",
              "Neurological Decline: Loss of gag reflex or inability to protect airway."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Rehabilitation & Discharge",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Safe Feeding Roadmap",
            threshold: "PRE-DISCHARGE MANDATE",
            orders: [
              "Speech and Language Pathology (SLP) Review: Formal bedside swallow assessment before resuming any oral feeds.",
              "Consider Video-Fluoroscopic Swallow Study (VFSS) or Fiberoptic Endoscopic Evaluation of Swallowing (FEES) if recurrent aspiration suspected.",
              "Anti-Reflux Management: Optimize Gastroesophageal Reflux Disease (GERD) treatment if reflux was the trigger."
            ]
          },
          {
            title: "Discharge Criteria",
            orders: [
              "Total Treatment Duration: Typically 7-10 days for uncomplicated pneumonia; 3-4 weeks for lung abscess.",
              "Stable Respiratory Status: No oxygen requirement for 24 hours.",
              "Safe Feeding Plan: Clearly documented plan for oral intake or tube feeding (Nasogastric/Gastrostomy).",
              "Follow-up: Pediatric Pulmonology review in 2-4 weeks."
            ]
          }
        ]
      }
    ]
  },

  // ER Legacy
  calculateSeverity: () => ({ level: 'mild', details: [] }),
  getManagement: () => [],
  getDisposition: () => [],
  getRedFlags: () => [],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "RCH Melbourne: Aspiration Pneumonia", url: "https://www.rch.org.au/clinicalguide/guideline_index/Aspiration_pneumonia/" },
    { title: "AAP: Management of Inpatient Pneumonia", url: "https://publications.aap.org/pediatrics/article/128/4/e1677/31034/" },
    { title: "NICE: Antibiotic prescribing for CAP", url: "https://www.nice.org.uk/guidance/ng138" }
  ],
};
