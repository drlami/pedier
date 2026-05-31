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
  description: 'Exhaustive consultant-level directive: Differentiating pneumonitis vs pneumonia, anaerobic coverage (Tazocin) roadmap, and safe feeding rehabilitation.',
  image: {
    url: "https://images.unsplash.com/photo-1581594658553-359424894362?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Aspiration risk and management"
  },
  questions: [], 

  mmpData: {
    stages: [
      {
        label: "Acute Event & Differentiation (Hour 0-2)",
        shortLabel: "Acute Event & Differentiation (Hour 0-2)",
        color: "blue",
        cards: [
          {
            title: "Pneumonitis vs. Pneumonia",
            threshold: "CRITICAL DIFFERENTIATION",
            instructions: [
              "1. Chemical Pneumonitis: Occurs 2-12h post-aspiration. Often afebrile. Suction and monitor for 24-48h BEFORE starting antibiotics.",
              "2. Aspiration Pneumonia: Suspect if fever persists > 48h, rising inflammatory markers, or high-risk features (neurological impairment).",
              "3. Immediate Action: Lateral Decubitus suctioning if witnessed event."
            ]
          },
          {
            title: "Admission Laboratory Orders",
            instructions: [
              "1. CBC with Diff: Assess for leukocytosis/left shift.",
              "2. CRP/Procalcitonin: To differentiate inflammatory from infective process.",
              "3. Blood Cultures: Mandatory before starting antibiotics.",
              "4. VBG/Capillary Gas: Assess gas exchange if distress is moderate/severe."
            ]
          },
          {
            title: "Radiology Directive",
            instructions: [
              "CXR (AP/Lateral): Look for infiltrates in dependent lobes (Right Upper Lobe if supine; Lower Lobes if upright).",
              "Barium Swallow / Videofluoroscopy: DO NOT perform in acute phase. Plan for Phase 4."
            ]
          }
        ]
      },
      {
        label: "Initial IV Antibiotic Strategy",
        shortLabel: "Initial IV Antibiotic Strategy",
        color: "amber",
        cards: [
          {
            title: "Empirical Anaerobic Coverage",
            threshold: "IF BACTERIAL PNEUMONIA SUSPECTED",
            instructions: [
              "Target: Mixed oropharyngeal flora, anaerobes, and Gram-negative coverage.",
              "Primary Choice: Piperacillin-Tazobactam (Tazocin)."
            ],
            prescriptions: [
              {
                drug: "Tazocin (Piperacillin-Tazobactam)",
                dose: "90 mg/kg (based on Piperacillin component)",
                route: "IV",
                frequency: "Every 6 hours",
                calculation: (w) => `${(90 * w).toFixed(0)} mg`,
                notes: "Maximum dose: 4g/0.5g (total 4.5g)."
              }
            ]
          },
          {
            title: "Alternative: Clindamycin Directive",
            threshold: "IF PCN ALLERGY OR ABSCESS RISK",
            instructions: [
              "Use Clindamycin if severe penicillin allergy or if cavitation/abscess is present on CXR."
            ],
            prescriptions: [
              {
                drug: "Clindamycin (IV)",
                dose: "10 mg/kg",
                route: "IV",
                frequency: "Every 8 hours",
                calculation: (w) => `${(10 * w).toFixed(0)} mg`,
                notes: "Strong anaerobic and anti-staphylococcal activity."
              }
            ]
          }
        ]
      },
      {
        label: "Support Failure & Monitoring",
        shortLabel: "Support Failure & Monitoring",
        color: "red",
        cards: [
          {
            title: "Triggers for PICU / Escalation",
            isCritical: true,
            instructions: [
              "1. Refractory Hypoxemia: SpO2 < 90% despite 40-50% FiO2.",
              "2. Septic Shock: Tachycardia + Capillary Refill > 3s + Hypotension.",
              "3. Neurological Decline: Impaired cough/gag reflex (Risk of re-aspiration)."
            ]
          },
          {
            title: "Nutrition & Feeding Directive",
            instructions: [
              "1. NPO Status: Strict NPO for at least 24h if acute event witnessed or RR > 60.",
              "2. NG/OG Feeding: Use as 1st-line for nutrition. Post-pyloric feeding if severe GERD/recurrent aspiration.",
              "3. Positioning: Head of bed maintained at 30-45 degrees at ALL times."
            ]
          }
        ]
      },
      {
        label: "Rehabilitation & Discharge",
        shortLabel: "Rehabilitation & Discharge",
        color: "emerald",
        cards: [
          {
            title: "Safe Feeding Roadmap",
            threshold: "PRE-DISCHARGE MANDATE",
            instructions: [
              "1. Speech Language Pathologist (SLP) Review: Formal swallow study before oral feeds resume.",
              "2. Thickeners: Consider thickening agents (e.g. Rice cereal or commercial thickeners) per SLP advice.",
              "3. Anti-Reflux: Start/Optimize PPI or H2RA if GERD is the suspected trigger."
            ]
          },
          {
            title: "Total Treatment Duration",
            instructions: [
              "Uncomplicated: 7-10 days total antibiotics.",
              "Complicated (Abscess): 3-4 weeks total.",
              "Follow-up: Pediatric Respiratory Clinic review in 2-4 weeks."
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
