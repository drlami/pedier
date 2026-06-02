import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Kawasaki Disease
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: AHA/AAP 2017 Guidelines, Malaysian Pediatric Protocol, and RCH Melbourne
 */
export const wardKawasakiProtocol: DiseaseProtocol = {
  id: 'ward-kawasaki-disease',
  name: 'Kawasaki Disease Master Pathway',
  system: 'Immunology & Rheumatology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Kawasaki Disease is an acute, self-limited febrile illness of unknown etiology, characterized by medium-vessel vasculitis with a predilection for the coronary arteries. This exhaustive directive covers diagnostic criteria validation, high-dose Intravenous Immunoglobulin administration, and a structured coronary artery surveillance roadmap.',
  image: {
    url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Clinical assessment of Kawasaki signs"
  },
  questions: [
    { id: 'weight', questionText: 'Current Weight', type: 'number', unit: 'kg' },
    { id: 'feverDays', questionText: 'Duration of fever (Days)', type: 'number' },
    { id: 'signsCount', questionText: 'Number of clinical signs (Rash, Conjunctivitis, Mouth, Extremities, Node)', type: 'number' },
  ], 

  mmpData: {
    snapshot: "Management focuses on (1) Rapid administration of Intravenous Immunoglobulin within 10 days of onset to reduce coronary artery aneurysm risk from 25% to less than 5%, (2) Monitoring for Intravenous Immunoglobulin resistance (persistent fever 36 hours post-infusion), and (3) Life-long cardiovascular surveillance for patients with documented coronary anomalies.",
    stages: [
      {
        label: "Stage 1: Diagnosis & Admission (Hour 0-4)",
        shortLabel: "Diagnosis",
        color: "blue",
        cards: [
          {
            title: "Classic Diagnostic Criteria",
            threshold: "FEVER ≥ 5 DAYS + 4/5 SIGNS",
            orders: [
              "Conjunctivitis: Bilateral, non-exudative, sparing the limbus.",
              "Mucosal Changes: Cracked red lips, strawberry tongue, or diffuse oropharyngeal erythema.",
              "Extremity Changes: Acute edema/erythema of palms/soles, or periungual desquamation (recovery phase).",
              "Rash: Polymorphous (maculopapular, erythema multiforme-like; never vesicular).",
              "Lymphadenopathy: Cervical, usually unilateral, greater than 1.5 cm in diameter.",
              "INCOMPLETE KAWASAKI: Suspect if fever ≥ 5 days with 2-3 signs + elevated C-Reactive Protein and Erythrocyte Sedimentation Rate."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Echocardiogram: MANDATORY to establish baseline coronary Z-scores and assess ventricular function.",
              "Complete Blood Count: Look for anemia and progressive thrombocytosis (often peaks in week 2-3).",
              "Inflammatory Markers: C-Reactive Protein and Erythrocyte Sedimentation Rate.",
              "Liver Function Tests: Assess for mild transaminitis or hypoalbuminemia.",
              "Electrocardiogram: Check for PR interval prolongation, ST-segment changes, or arrhythmias.",
              "Urinalysis: Collect via mid-stream or catheter to check for sterile pyuria."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Acute Phase Therapeutics",
        shortLabel: "Therapeutics",
        color: "red",
        cards: [
          {
            title: "Intravenous Immunoglobulin Protocol",
            threshold: "GIVE WITHIN 10 DAYS OF ONSET",
            isCritical: true,
            orders: [
              "Intravenous Immunoglobulin (IVIG): Reduces coronary artery aneurysm risk from 25% to less than 5%.",
              "Pre-medication: Administer Paracetamol (15 mg/kg) and Diphenhydramine (1 mg/kg) 30 minutes prior to infusion.",
              "Delay Live Vaccines: Postpone Measles, Mumps, and Rubella (MMR) and Varicella vaccines for 11 months following infusion."
            ],
            nursing: [
              "Check Vital Signs every 15 minutes for the first hour of infusion.",
              "Monitor every 1 hour until the infusion is complete.",
              "Watch for infusion reactions: Fever, chills, hypotension, or rash."
            ],
            prescriptions: [
              {
                drug: "Intravenous Immunoglobulin (IVIG)",
                dose: "2 g/kg",
                route: "Intravenous Infusion",
                frequency: "Single Dose",
                calculation: (w) => `${(w * 2).toFixed(1)} g`,
                notes: "Infuse slowly over 10-12 hours per local protocol."
              }
            ]
          },
          {
            title: "Aspirin Strategy (Anti-inflammatory)",
            threshold: "ACUTE FEBRILE PHASE",
            orders: [
              "Target: High-dose therapy for anti-inflammatory effect during the febrile period.",
              "Continue high-dose until the patient is afebrile for 48-72 hours."
            ],
            prescriptions: [
              {
                drug: "Aspirin (High Dose)",
                dose: "80-100 mg/kg/day",
                route: "Oral",
                frequency: "Divided every 6 hours",
                calculation: (w) => `${(w * 20).toFixed(0)} - ${(w * 25).toFixed(0)} mg`,
                notes: "Consultant preference may vary (some use 30-50 mg/kg/day)."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 3: Refractory & Complication Watch",
        shortLabel: "Refractory",
        color: "amber",
        cards: [
          {
            title: "Resistance & Escalation [!]",
            threshold: "FEVER 36H POST-IVIG",
            orders: [
              "Resistance: Defined as persistent or recrudescent fever 36 hours after completion of the first infusion.",
              "Repeat Infusion: Administer a second dose of Intravenous Immunoglobulin (2 g/kg).",
              "Pulse Steroids: Consider Methylprednisolone (30 mg/kg) for 3 days if fever persists.",
              "Specialist Consult: Involve Pediatric Rheumatology and Cardiology immediately."
            ]
          },
          {
            title: "Coronary Artery Monitoring",
            orders: [
              "Serial Echocardiograms: Mandatory at 2 weeks and 6-8 weeks post-discharge.",
              "Z-Score Tracking: Use Body Surface Area-adjusted coronary diameters to monitor for aneurysms."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Recovery & Follow-up",
        shortLabel: "Follow-up",
        color: "emerald",
        cards: [
          {
            title: "Low-Dose Aspirin (Anti-platelet)",
            threshold: "AFEBRILE 48-72 HOURS",
            orders: [
              "Target: Switch to low-dose for anti-platelet effect once afebrile.",
              "Duration: Minimum 6-8 weeks or until repeat Echocardiogram confirms normal coronary arteries."
            ],
            prescriptions: [
              {
                drug: "Aspirin (Low Dose)",
                dose: "3-5 mg/kg/day",
                route: "Oral",
                frequency: "Once daily",
                calculation: (w) => `${(w * 5).toFixed(0)} mg`,
                notes: "MANDATORY: Suspend if exposure to Varicella or Influenza occurs (risk of Reye Syndrome)."
              }
            ]
          }
        ]
      }
    ]
  },

  // ER Legacy
  calculateSeverity: () => ({ level: 'severe', details: [] }),
  getManagement: () => [],
  getDisposition: () => [],
  getRedFlags: () => [],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "AHA/AAP: Diagnosis and Treatment of Kawasaki Disease (2017)", url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000000487" },
    { title: "Malaysian Paediatric Protocol (Clinical Management)", url: "#" },
    { title: "RCH Melbourne: Kawasaki Disease", url: "https://www.rch.org.au/clinicalguide/guideline_index/Kawasaki_Disease/" }
  ],
};
