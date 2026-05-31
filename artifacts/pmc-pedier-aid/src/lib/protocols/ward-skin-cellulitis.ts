import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Skin & Soft Tissue Cellulitis
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: RCH Melbourne, NICE, and IDSA Guidelines
 */
export const wardSkinCellulitisProtocol: DiseaseProtocol = {
  id: 'ward-skin-cellulitis',
  name: 'Cellulitis Master Pathway',
  system: 'Infectious Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Exhaustive consultant-level directive: Demarcating borders, differentiating simple from necrotizing fasciitis, and MRSA coverage logic.',
  image: {
    url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Skin infection assessment"
  },
  questions: [], 

  mmpData: {
    stages: [
      {
        label: "Admission & Initial Directive",
        shortLabel: "Admission & Initial Directive",
        color: "blue",
        cards: [
          {
            title: "Border Demarcation & Baseline",
            threshold: "MANDATORY ON ARRIVAL",
            instructions: [
              "1. Mark the Borders: Use a permanent marker to demarcate the current area of erythema/edema.",
              "2. Assess for Crepitus: Palpate for gas in tissues (Surgical Emergency).",
              "3. Photography: Capture a baseline photo for the medical record."
            ]
          },
          {
            title: "Laboratory Directives",
            instructions: [
              "1. CBC with Diff & CRP: Baseline markers for tracking response.",
              "2. Blood Culture: Required only if systemically unwell (toxic) or failing therapy.",
              "3. Wound Culture: Only if an open wound or fluctuance is present."
            ]
          },
          {
            title: "1st-Line IV Therapy (PREFERRED REGIMEN: MONOTHERAPY)",
            threshold: "STABLE / IMMUNIZED",
            instructions: [
              "Target Pathogens: S. pyogenes (Group A Strep) and MSSA.",
              "Note: Flucloxacillin is the first-line choice for simple cellulitis."
            ],
            prescriptions: [
              {
                drug: "Flucloxacillin (IV)",
                dose: "50 mg/kg",
                route: "IV",
                frequency: "Every 6 hours",
                calculation: (w) => `${(50 * w).toFixed(0)} mg`,
                notes: "Max 2g per dose."
              }
            ]
          }
        ]
      },
      {
        label: "Monitoring & Response Review",
        shortLabel: "Monitoring & Response Review",
        color: "amber",
        cards: [
          {
            title: "Daily Assessment Logic",
            instructions: [
              "1. Check the Mark: Is the erythema spreading significantly beyond the line after 24h?",
              "2. Systemic Status: Resolution of fever and improvement in pain.",
              "3. Pain Management: Scheduled Ibuprofen/Paracetamol to reduce inflammatory pain."
            ]
          },
          {
            title: "When to Suspect Treatment Failure",
            threshold: "AT 24-48 HOURS",
            instructions: [
              "1. Continued spread of erythema despite correct dosing.",
              "2. Persistent high fever.",
              "3. Rising inflammatory markers (CRP)."
            ]
          }
        ]
      },
      {
        label: "Complications & Escalation",
        shortLabel: "Complications & Escalation",
        color: "red",
        cards: [
          {
            title: "Differentiating Necrotizing Fasciitis",
            threshold: "SURGICAL EMERGENCY",
            isCritical: true,
            instructions: [
              "Triggers: Pain out of proportion to findings, rapid spread (hourly), skin necrosis/blebbing, or crepitus.",
              "Action: URGENT SURGICAL DEBRIDEMENT. Do not wait for imaging.",
              "Broaden Rx: Immediate upgrade to Tazocin + Vancomycin + Clindamycin (to stop toxin production)."
            ]
          },
          {
            title: "2nd-Line / MRSA Upgrade (PREFERRED REGIMEN: MONOTHERAPY)",
            threshold: "FAILURE TO IMPROVE",
            instructions: [
              "Target: Resistant Staph aureus or Gram-negative coverage.",
              "Prescription: Add Vancomycin or switch to Ceftriaxone."
            ],
            prescriptions: [
              {
                drug: "Vancomycin (IV)",
                dose: "15 mg/kg",
                route: "IV",
                frequency: "Every 6 hours",
                calculation: (w) => `${(15 * w).toFixed(0)} mg`,
                notes: "Target troughs 15-20."
              }
            ]
          }
        ]
      },
      {
        label: "Step-Down & Discharge",
        shortLabel: "Step-Down & Discharge",
        color: "emerald",
        cards: [
          {
            title: "PO Transition Criteria",
            instructions: [
              "1. Afebrile for > 24 hours.",
              "2. Halting of spread and reduction in localized edema/pain.",
              "3. Total Duration: 7-10 days (IV + PO)."
            ],
            prescriptions: [
              {
                drug: "Cephalexin (Oral)",
                dose: "25 mg/kg",
                route: "PO",
                frequency: "Every 6-8 hours",
                calculation: (w) => `${(25 * w).toFixed(0)} mg`,
                notes: "Max 500mg - 1g per dose."
              }
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
    { title: "RCH Melbourne: Cellulitis CPG", url: "https://www.rch.org.au/clinicalguide/guideline_index/Cellulitis/" },
    { title: "NICE Guideline: Cellulitis Diagnosis and Management", url: "https://www.nice.org.uk/guidance/ng141" }
  ],
};
