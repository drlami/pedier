import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Kawasaki Disease
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: AHA/AAP 2017 Guidelines, Malaysian Pediatric Protocol, and RCH Melbourne
 */
export const wardKawasakiProtocol: DiseaseProtocol = {
  id: 'ward-kawasaki-disease',
  name: 'Kawasaki Disease Master Pathway',
  system: 'Cardiology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Exhaustive senior directive: Jones criteria validation, IVIG administration protocol, and coronary artery surveillance roadmap.',
  image: {
    url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Clinical assessment of Kawasaki signs"
  },
  questions: [], 

  mmpData: {
    stages: [
      {
        label: "Diagnosis & Admission (Hour 0-4)",
        shortLabel: "Diagnosis & Admission (Hour 0-4)",
        color: "blue",
        cards: [
          {
            title: "Classic Diagnostic Criteria",
            threshold: "FEVER >= 5 DAYS + 4/5 SIGNS",
            instructions: [
              "1. Conjunctivitis: Bilateral, non-exudative.",
              "2. Mucosal: Cracked red lips, strawberry tongue, or oropharyngeal erythema.",
              "3. Extremities: Edema, erythema, or periungual desquamation (late).",
              "4. Rash: Polymorphous (Not vesicular).",
              "5. Lymphadenopathy: Cervical, usually unilateral, > 1.5 cm.",
              "INCOMPLETE KAWASAKI: Suspect if fever >= 5 days with 2-3 signs + high CRP/ESR."
            ]
          },
          {
            title: "Mandatory Baseline Workup",
            instructions: [
              "1. Echocardiography: REQUIRED ASAP to assess coronary arteries and function.",
              "2. Labs: CBC (look for thrombocytosis), ESR/CRP (markedly high), LFTs (mild hepatitis common), Urinalysis (sterile pyuria).",
              "3. Baseline ECG: Check for PR interval prolongation or ST changes."
            ]
          }
        ]
      },
      {
        label: "Acute Phase Therapeutics",
        shortLabel: "Acute Phase Therapeutics",
        color: "red",
        cards: [
          {
            title: "Phase 2: IVIG Administration (PREFERRED REGIMEN: MONOTHERAPY)",
            threshold: "GIVE WITHIN 10 DAYS OF ONSET",
            isCritical: true,
            instructions: [
              "1. IVIG: Reduces coronary artery aneurysm risk from 25% to < 5%.",
              "2. Pre-medication: Consider Paracetamol and Diphenhydramine 30m before infusion.",
              "3. Monitoring: Check Vitals q15m for 1h, then q1h until complete."
            ],
            prescriptions: [
              {
                drug: "IVIG (Intravenous Immunoglobulin)",
                dose: "2 g/kg",
                route: "IV Infusion",
                frequency: "Single Dose",
                calculation: (w) => `${(w * 2).toFixed(1)} g`,
                notes: "Infuse over 10-12 hours per local protocol."
              }
            ]
          },
          {
            title: "Phase 2: High-Dose Aspirin Strategy",
            threshold: "ACUTE FEBRILE PHASE",
            instructions: [
              "Target: Anti-inflammatory effect.",
              "Duration: Continue until afebrile for 48-72 hours."
            ],
            prescriptions: [
              {
                drug: "Aspirin (High Dose)",
                dose: "80-100 mg/kg/day",
                route: "PO",
                frequency: "Divided Every 6 hours",
                calculation: (w) => `${(w * 20).toFixed(0)} - ${(w * 25).toFixed(0)} mg`,
                notes: "Switch to low-dose (3-5 mg/kg) once afebrile."
              }
            ]
          }
        ]
      },
      {
        label: "Refractory & Complication Watch",
        shortLabel: "Refractory & Complication Watch",
        color: "amber",
        cards: [
          {
            title: "IVIG Resistance",
            threshold: "PERSISTENT FEVER 36H POST-IVIG",
            instructions: [
              "1. Repeat IVIG: Give a second dose of 2 g/kg.",
              "2. Methylprednisolone Pulse: Consider 30 mg/kg IV for 3 days if still failing.",
              "3. Involve Pediatric Rheumatology and Cardiology immediately."
            ]
          },
          {
            title: "Coronary Artery Monitoring",
            instructions: [
              "1. Serial Echo: Mandatory at 2 weeks and 6-8 weeks post-discharge.",
              "2. Z-Score Tracking: Directives to calculate BSA-adjusted coronary diameters."
            ]
          }
        ]
      },
      {
        label: "Long-Term Recovery & Follow-up",
        shortLabel: "Long-Term Recovery & Follow-up",
        color: "emerald",
        cards: [
          {
            title: "Low-Dose Aspirin Phase",
            threshold: "AFEBRILE 48-72 HOURS",
            instructions: [
              "Target: Anti-platelet effect.",
              "Duration: Minimum 6-8 weeks or until repeat Echo confirms no aneurysms."
            ],
            prescriptions: [
              {
                drug: "Aspirin (Low Dose)",
                dose: "3-5 mg/kg/day",
                route: "PO",
                frequency: "Once daily",
                calculation: (w) => `${(w * 5).toFixed(0)} mg`,
                notes: "Suspend if varicella or influenza exposure (Reye Syndrome risk)."
              }
            ]
          },
          {
            title: "Live Vaccine Directive",
            isCritical: true,
            instructions: [
              "MANDATORY: Postpone MMR and Varicella vaccines for 11 MONTHS after IVIG administration (Reduced efficacy)."
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
