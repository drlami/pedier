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
  description: 'Croup (Laryngotracheobronchitis) is a viral respiratory infection causing subglottic inflammation and edema, characterized by a barking cough, inspiratory stridor, and hoarseness. This pathway provides a senior physician’s roadmap for severity assessment, precise steroid titration, and strict protocols for rescue adrenaline nebulization.',
  image: {
    url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Senior Physician Decision Support"
  },
  questions: [], 

  mmpData: {
    snapshot: "Croup management prioritizes 'Minimal Handling' to prevent airway agitation. (1) Administer a single dose of Dexamethasone as the gold standard for inflammation. (2) Use Nebulized Adrenaline strictly for stridor at rest with respiratory distress, avoiding scheduled dosing. (3) Maintain high vigilance for Bacterial Tracheitis in children who fail to respond to standard therapy or exhibit systemic toxicity.",
    stages: [
      {
        label: "Stage 1: Severity Assessment & Initial Admission Orders",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Westley Severity Scoring Protocol",
            threshold: "MANDATORY ON ARRIVAL AND EVERY 4 HOURS",
            calculator: {
              id: "westley-score",
              title: "Westley Croup Score"
            },
            orders: [
              "Mild Croup (Score ≤ 2): Occasional barking cough, no stridor at rest, no or mild chest wall indrawing.",
              "Moderate Croup (Score 3-7): Frequent barking cough, easily audible stridor at rest, noticeable chest wall indrawing at rest, but no agitation.",
              "Severe Croup (Score ≥ 8): Frequent barking cough, prominent inspiratory and sometimes expiratory stridor, marked chest wall indrawing, significant agitation or distress.",
              "Note: ANY child with Stridor at Rest is automatically classified as at least 'Moderate'."
            ]
          },
          {
            title: "Initial Physician Orders: Laboratory & Imaging [DR]",
            threshold: "DIAGNOSIS IS CLINICAL - MINIMIZE DISTRESS",
            orders: [
              "Routine Investigations: NOT RECOMMENDED as they may cause agitation and worsen airway obstruction.",
              "Blood Investigations (Complete Blood Count and Blood Culture): Order ONLY if there is high fever (above 39°C), a toxic appearance, or a complete lack of response to nebulized adrenaline.",
              "Imaging (Lateral Neck X-ray): Indicated ONLY if the presentation is atypical, suggesting Epiglottitis, Peritonsillar Abscess, or Foreign Body aspiration."
            ]
          },
          {
            title: "Systemic Steroid Strategy [DR]",
            orders: [
              "Single-Dose Gold Standard: Administer a single dose of Dexamethasone (0.6 mg/kg) orally. This is usually sufficient due to its long half-life of 36-72 hours.",
              "Repeat Dosing Logic: Consider a second dose (0.15 to 0.6 mg/kg) at 12-24 hours ONLY if moderate-to-severe symptoms persist or recur.",
              "Proscription: Do NOT prescribe regular daily scheduled steroids; this may mask the development of Bacterial Tracheitis.",
              "Route of Administration: Oral route is preferred. Intravenous or Intramuscular routes are reserved for children with persistent vomiting or severe respiratory distress."
            ],
            prescriptions: [
              {
                drug: "Dexamethasone",
                dose: "0.6 mg/kg",
                route: "Oral / Intravenous / Intramuscular",
                frequency: "Initial Single Dose",
                calculation: (w) => `${Math.min(w * 0.6, 12).toFixed(1)} mg`,
                notes: "Maximum dose 12 mg. Second dose only if symptoms persist at 12-24 hours."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 2: Clinical Monitoring & Rescue Adrenaline Protocol",
        shortLabel: "Monitoring",
        color: "amber",
        cards: [
          {
            title: "Nebulized Adrenaline: Rescue Use Only",
            threshold: "NEVER PRESCRIBE AS A SCHEDULED DOSE",
            isCritical: true,
            orders: [
              "Scheduled Proscription: Do NOT order adrenaline on a fixed schedule (e.g., every 4 or 6 hours). This masks clinical deterioration and carries unnecessary cardiac risks.",
              "Rescue Trigger: Administer ONLY if the child exhibits Stridor at Rest associated with significant respiratory distress.",
              "Frequency and Escalation: May repeat every 20-30 minutes for rescue, but assess for Pediatric Intensive Care escalation after 2-3 doses."
            ],
            prescriptions: [
              {
                drug: "L-Adrenaline (1:1000)",
                dose: "0.5 mL/kg",
                route: "Nebulized",
                frequency: "As Needed (PRN) for Stridor at Rest",
                calculation: (w) => `${Math.min(w * 0.5, 5).toFixed(1)} mL`,
                notes: "Maximum dose 5 mL. Patient must be observed for at least 4 hours after the last dose."
              }
            ]
          },
          {
            title: "Nursing: Strict Ward Monitoring [NS]",
            nursing: [
              "Minimal Handling Protocol: Group nursing tasks together to avoid upsetting the child; ensure the parent stays with the child at all times.",
              "Positioning: Allow the child to remain in their preferred position (usually upright on the parent's lap).",
              "Respiratory Monitoring: Hourly assessment of Respiratory Rate, Heart Rate, Oxygen Saturations, and Westley Score.",
              "Nutrition and Hydration: Maintain oral hydration; place patient 'Nothing by Mouth' (NPO) only if the Respiratory Rate exceeds 70-80 breaths per minute."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Management of Treatment Failure",
        shortLabel: "Failure",
        color: "red",
        cards: [
          {
            title: "Suspecting Bacterial Tracheitis",
            threshold: "CRITICAL TREATMENT FAILURE INDICATORS",
            isCritical: true,
            orders: [
              "Indicator 1: Minimal or no response to nebulized adrenaline treatments.",
              "Indicator 2: Systemic toxicity including high fever and poor peripheral perfusion.",
              "Indicator 3: Presence of thick, purulent (pus-like) respiratory secretions.",
              "Immediate Action: Urgent consultation with Ear, Nose, and Throat (ENT) specialists and initiation of Broad-Spectrum Intravenous Antibiotics."
            ]
          },
          {
            title: "Intensive Care Transfer Criteria",
            isCritical: true,
            orders: [
              "Impending Respiratory Exhaustion: Decreasing Respiratory Rate accompanied by rising clinical distress.",
              "High Adrenaline Requirement: Need for more than 3 adrenaline nebulizers within a 4-hour period.",
              "Altered Mental Status: New onset of lethargy, confusion, or extreme agitation.",
              "Hypoxemia: Persistent Oxygen Saturations less than 92% despite supplemental oxygen administration."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Discharge Planning & Safety Netting",
        shortLabel: "Discharge",
        color: "emerald",
        cards: [
          {
            title: "Standard Discharge Criteria",
            orders: [
              "Absence of Stridor at Rest for at least 4 hours since the last adrenaline nebulization.",
              "Normal work of breathing and returns to baseline interactive behavior.",
              "Able to tolerate oral fluids and medications without difficulty.",
              "Caregivers are fully informed about the potential for 'rebound' symptoms and when to return."
            ]
          },
          {
            title: "Safety Netting Directive for Parents",
            orders: [
              "Outpatient Medications: Further steroids are usually not required after a 0.6 mg/kg dose.",
              "Disease Course: Explain that the 'barking' cough often lasts for 3 days and is typically worse during the night.",
              "Follow-up: Ensure a telephone review or visit with a General Practitioner within 24 to 48 hours."
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
