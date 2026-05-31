import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Acute Croup (Laryngotracheobronchitis)
 * FULL MASTER SENIOR DOCTOR MANAGEMENT PATHWAY
 * Derived from: RCH Melbourne, NICE, and AAP Guidelines
 */
export const wardCroupProtocol: DiseaseProtocol = {
  id: 'ward-croup-management',
  name: 'Croup Master Pathway',
  system: 'Respiratory System',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Exhaustive consultant-level directive: Adrenaline frequency, IV/PO steroid roadmap, and specific indications for labs/imaging.',
  image: {
    url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Senior Physician Decision Support"
  },
  questions: [], 

  mmpData: {
    stages: [
      {
        label: "Severity Directive & Admission Orders",
        shortLabel: "Severity Directive & Admission Orders",
        color: "blue",
        cards: [
          {
            title: "Westley Severity Scoring",
            threshold: "MANDATORY ON ARRIVAL",
            calculator: {
              id: "westley-score",
              title: "Westley Croup Score"
            },
            instructions: [
              "Mild (≤ 2) | Moderate (3-7) | Severe (≥ 8).",
              "Note: ANY child with stridor at rest is at least 'Moderate'."
            ]
          },
          {
            title: "Indications for Laboratories",
            threshold: "DIAGNOSIS IS CLINICAL",
            instructions: [
              "1. Routine Labs: NOT RECOMMENDED (Avoid upsetting the child).",
              "2. Order CBC & Blood Culture ONLY IF: High fever (> 39°C), toxic appearance, or poor response to adrenaline (Suspect Bacterial Tracheitis).",
              "3. Lateral Neck X-Ray: ONLY if atypical (Suspicion of epiglottitis or foreign body)."
            ]
          },
          {
            title: "Systemic Steroid Directive (PO vs IV)",
            instructions: [
              "1. Single-Dose Gold Standard: A single dose of Dexamethasone (0.6 mg/kg) is usually sufficient due to its 36-72h half-life.",
              "2. Repeat Dose Logic: Consider a SECOND dose (0.15-0.6 mg/kg) at 12-24 hours ONLY if moderate-to-severe symptoms persist or recur.",
              "3. NO REGULAR DAILY DOSING: Daily scheduled steroids are not recommended for viral croup and may mask Bacterial Tracheitis.",
              "4. Route: Oral is preferred. IV/IM reserved for vomiting or severe distress."
            ],
            prescriptions: [
              {
                drug: "Dexamethasone (PO/IV/IM)",
                dose: "0.6 mg/kg",
                route: "PO / IV / IM",
                frequency: "Initial Single Dose",
                calculation: (w) => `${Math.min(w * 0.6, 12).toFixed(1)} mg`,
                notes: "Max 12-16mg. Second dose only if symptoms persist at 12-24h."
              }
            ]
          }
        ]
      },
      {
        label: "Monitoring & Adrenaline PRN Protocol",
        shortLabel: "Monitoring & Adrenaline PRN Protocol",
        color: "amber",
        cards: [
          {
            title: "Adrenaline Nebulization: PRN ONLY",
            threshold: "NEVER SCHEDULED (q4h/q6h)",
            isCritical: true,
            instructions: [
              "1. Scheduled Proscription: Do NOT order adrenaline on a schedule. It masks deterioration and carries cardiac risks.",
              "2. PRN Trigger: Administer ONLY if the child has Stridor at Rest associated with respiratory distress (Moderate/Severe Westley Score).",
              "3. Frequency: May repeat every 20-30 minutes for rescue, but assess for PICU escalation after 2-3 doses."
            ],
            prescriptions: [
              {
                drug: "L-Adrenaline (1:1000)",
                dose: "0.5 mL/kg",
                route: "Nebulized",
                frequency: "PRN for Stridor at Rest",
                calculation: (w) => `${Math.min(w * 0.5, 5).toFixed(1)} mL`,
                notes: "Max 5mL. Must observe for 4h post-dose."
              }
            ]
          },
          {
            title: "Ward Management Directive",
            instructions: [
              "Minimal Handling: Group nursing cares; keep parent/child together.",
              "Positioning: Child's preferred position (usually upright).",
              "Nutrition: Maintain oral hydration; strict NPO only if RR > 70-80."
            ]
          }
        ]
      },
      {
        label: "Failure & Complications",
        shortLabel: "Failure & Complications",
        color: "red",
        cards: [
          {
            title: "When to Suspect Bacterial Tracheitis",
            threshold: "TREATMENT FAILURE INDICATOR",
            isCritical: true,
            instructions: [
              "1. Minimal response to nebulized adrenaline.",
              "2. Systemic toxicity (High fever, poor perfusion).",
              "3. Thick, purulent secretions.",
              "Action: URGENT ENT consultation + IV Broad Spectrum Antibiotics."
            ]
          },
          {
            title: "PICU Transfer Criteria",
            isCritical: true,
            instructions: [
              "1. Impending exhaustion (Decreasing RR with rising distress).",
              "2. Requirement for > 3 adrenaline nebulizers in < 4 hours.",
              "3. Altered mental status (Lethargy/Confusion).",
              "4. Persistent SpO2 < 92% despite oxygen."
            ]
          }
        ]
      },
      {
        label: "Discharge & Home Care",
        shortLabel: "Discharge & Home Care",
        color: "emerald",
        cards: [
          {
            title: "Hard Discharge Criteria",
            instructions: [
              "1. No stridor at rest for at least 4 hours post-adrenaline.",
              "2. Normal work of breathing and baseline interaction.",
              "3. Able to tolerate oral fluids and medications.",
              "4. Caregivers informed of 'rebound' symptoms."
            ]
          },
          {
            title: "Safety Netting Directive",
            instructions: [
              "Home Steroids: Usually not required after 0.6mg/kg dose. Consider 2nd dose (0.15mg/kg) only if history is prolonged.",
              "Natural History: Inform parents that 'The Bark' often lasts 3 days and is worse at night.",
              "Follow-up: Phone review or GP visit within 24-48 hours."
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
    { title: "RCH Melbourne: Croup CPG", url: "https://www.rch.org.au/clinicalguide/guideline_index/Croup/" },
    { title: "NICE CKS: Acute Croup", url: "https://cks.nice.org.uk/topics/croup/" },
    { title: "AAP: Diagnosis and Management of Croup", url: "https://publications.aap.org/pediatrics/article/122/Supplement_2/S58/71334/" }
  ],
};
