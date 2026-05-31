import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Infective Endocarditis (IE)
 * MASTER MANAGEMENT PATHWAY
 */
export const wardInfectiveEndocarditisProtocol: DiseaseProtocol = {
  id: 'ward-infective-endocarditis',
  name: 'Infective Endocarditis (IE)',
  system: 'Infectious Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Senior directive for heart valve infection: Duke criteria logic, serial blood culture strategy, and 6-week treatment roadmap.',
  image: {
    url: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Duke Criteria and Echo Analysis"
  },
  questions: [],

  mmpData: {
    stages: [
      {
        label: "Admission & Duke Criteria Workup",
        shortLabel: "Admission & Duke Criteria Workup",
        color: "blue",
        cards: [
          {
            title: "Mandatory Blood Culture Strategy",
            threshold: "CRITICAL: 1st 24 HOURS",
            isCritical: true,
            instructions: [
              "1. Collect 3 separate sets of blood cultures from different venipuncture sites.",
              "2. Timing: At least 1 hour between first and last set.",
              "3. Volume: Ensure age-appropriate volume (e.g., 2-4 mL for infants, 10-20 mL for adolescents) for maximum sensitivity.",
              "4. Notify Lab: Suspected Endocarditis (for extended incubation if needed)."
            ]
          },
          {
            title: "Duke Criteria (Simplified for Senior Docs)",
            instructions: [
              "Definite IE: 2 Major, OR 1 Major + 3 Minor, OR 5 Minor.",
              "MAJOR: 1. Positive Blood Cultures (typical organism from 2 sets), 2. Evidence of Endocardial Involvement (ECHO showing vegetation, abscess, or new valvular regurgitation).",
              "MINOR: Predisposition (Heart condition/IVDU), Fever > 38°C, Vascular phenomena (Emboli), Immunologic phenomena (Osler nodes/Roth spots/Glomerulonephritis)."
            ]
          },
          {
            title: "Imaging: Echo Timing",
            instructions: [
              "1. TTE (Transthoracic Echo): Baseline for all suspected cases.",
              "2. TEE (Transesophageal Echo): Indicated if TTE is non-diagnostic but clinical suspicion remains high, or if prosthetic valve/complex CHD present."
            ]
          },
          {
            title: "Empiric IV Therapy (Native Valve) (PREFERRED REGIMEN: TRIPLE THERAPY)",
            instructions: [
              "Target: Viridans group Streptococci, S. aureus, Enterococci."
            ],
            prescriptions: [
              {
                drug: "Benzylpenicillin (Ampicillin)",
                dose: "50 mg/kg",
                route: "IV",
                frequency: "Every 4-6 hours",
                calculation: (w) => `${(50 * w).toFixed(0)} mg`,
                notes: "Synergy with Gentamicin."
              },
              {
                drug: "Flucloxacillin",
                dose: "50 mg/kg",
                route: "IV",
                frequency: "Every 6 hours",
                calculation: (w) => `${(50 * w).toFixed(0)} mg`,
                notes: "Target: S. aureus."
              },
              {
                drug: "Gentamicin",
                dose: "3 mg/kg",
                route: "IV",
                frequency: "Once daily (or split)",
                calculation: (w) => `${(3 * w).toFixed(0)} mg`,
                notes: "Synergy dose. Monitor levels/Renal function."
              }
            ]
          }
        ]
      },
      {
        label: "Monitoring & Culturing",
        shortLabel: "Monitoring & Culturing",
        color: "amber",
        cards: [
          {
            title: "Persistence Tracking",
            instructions: [
              "Repeat Blood Cultures: Every 24-48h until cleared. 'Day 1' of therapy is the first day of negative cultures.",
              "CRP/ESR: Weekly monitoring. Slow decline expected.",
              "ECG: Daily monitoring for PR interval prolongation (Suspect aortic root abscess)."
            ]
          },
          {
            title: "Clinical Hallmark Check",
            instructions: [
              "Daily Auscultation: New or changing murmur is a major warning sign.",
              "Systemic Check: Daily skin exam (Janeway lesions/Osler nodes) and Urine dipstick (Hematuria)."
            ]
          }
        ]
      },
      {
        label: "Complications & Surgical Triggers",
        shortLabel: "Complications & Surgical Triggers",
        color: "red",
        cards: [
          {
            title: "Surgical Trigger (Urgent Cardiac Surgery)",
            threshold: "HEART FAILURE / UNCONTROLLED INFECTION",
            isCritical: true,
            instructions: [
              "Indications for Early Surgery: 1. Refractory Heart Failure (most common), 2. Uncontrolled infection (persistent fever/positive cultures > 7 days), 3. Perivalvular extension (Abscess/Heart block), 4. Large vegetations (>10mm) with embolic events."
            ]
          },
          {
            title: "Therapy Upgrade (MRSA / Prosthetic) (PREFERRED REGIMEN: DUAL THERAPY)",
            threshold: "COMPLEX / RESISTANT",
            instructions: [
              "Consider Vancomycin + Rifampicin if prosthetic valve or high MRSA risk."
            ],
            prescriptions: [
              {
                drug: "Vancomycin",
                dose: "15 mg/kg",
                route: "IV",
                frequency: "Every 6 hours",
                calculation: (w) => `${(15 * w).toFixed(0)} mg`
              },
              {
                drug: "Rifampicin",
                dose: "10 mg/kg",
                route: "PO/IV",
                frequency: "Every 12 hours",
                calculation: (w) => `${(10 * w).toFixed(0)} mg`,
                notes: "Add ONLY for prosthetic valve IE after cultures clear."
              }
            ]
          }
        ]
      },
      {
        label: "Long-Term Course & Discharge",
        shortLabel: "Long-Term Course & Discharge",
        color: "emerald",
        cards: [
          {
            title: "Treatment Duration Roadmap",
            threshold: "MANDATORY 4-6 WEEKS IV",
            instructions: [
              "Native Valve (Strep): 4 weeks.",
              "Native Valve (Staph): 6 weeks.",
              "Prosthetic Valve: 6 weeks minimum.",
              "Note: IE is rarely treated with oral antibiotics alone; IV is gold standard for the entire course."
            ]
          },
          {
            title: "Discharge & Outpatient Parenteral (OPAT)",
            instructions: [
              "Criteria for OPAT: 1. Hemodynamically stable, 2. No signs of heart failure or emboli, 3. Reliable home support and PICC line access."
            ]
          },
          {
            title: "Follow-up & Prophylaxis",
            instructions: [
              "Repeat Echo: At completion of therapy and 1 month post-discharge.",
              "Dental Hygiene: Emphasize importance.",
              "Endocarditis Prophylaxis: Education on future dental procedures/surgeries."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: () => ({ level: 'severe', details: [] }),
  getManagement: () => [],
  getDisposition: () => [],
  getRedFlags: () => [],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "AHA: Infective Endocarditis in Childhood (2015/2021 Update)", url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000000298" },
    { title: "ESC: Guidelines for the Management of Infective Endocarditis", url: "https://www.escardio.org" }
  ],
};
