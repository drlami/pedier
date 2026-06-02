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
  description: 'Cellulitis is a bacterial infection of the deep dermis and subcutaneous tissues characterized by spreading erythema, edema, and warmth. This exhaustive directive covers demarcating borders, differentiating simple from necrotizing fasciitis, and MRSA coverage logic.',
  image: {
    url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Skin infection assessment"
  },
  questions: [], 

  mmpData: {
    snapshot: "Cellulitis management focuses on three pillars: (1) Accurate demarcation and serial monitoring of infection borders to track treatment efficacy, (2) Targeted antimicrobial therapy primarily covering Streptococcus pyogenes and Staphylococcus aureus, and (3) Rapid identification of necrotizing fasciitis (pain out of proportion, rapid spread, systemic toxicity). Avoid unnecessary broad-spectrum coverage unless MRSA is suspected or initial therapy fails.",
    stages: [
      {
        label: "Admission & Initial Directive",
        shortLabel: "Admission & Initial Directive",
        color: "blue",
        cards: [
          {
            title: "Initial Physician Orders [DR]",
            threshold: "MANDATORY ON ARRIVAL",
            orders: [
              "1. Mark the Borders: Use a permanent marker to demarcate the current area of erythema/edema.",
              "2. Assess for Crepitus: Palpate for gas in tissues (Surgical Emergency).",
              "3. Photography: Capture a baseline photo for the medical record."
            ]
          },
          {
            title: "Laboratory Directives",
            orders: [
              "1. Complete Blood Count with Differential & C-Reactive Protein: Baseline markers for tracking response.",
              "2. Blood Culture: Required only if systemically unwell (toxic) or failing therapy.",
              "3. Wound Culture: Only if an open wound or fluctuance is present."
            ]
          },
          {
            title: "1st-Line Intravenous Therapy (PREFERRED REGIMEN: MONOTHERAPY)",
            threshold: "STABLE / IMMUNIZED",
            orders: [
              "Target Pathogens: Streptococcus pyogenes (Group A Strep) and Methicillin-Susceptible Staphylococcus aureus (MSSA).",
              "Note: Flucloxacillin is the first-line choice for simple cellulitis."
            ],
            prescriptions: [
              {
                drug: "Flucloxacillin (Intravenous)",
                dose: "50 mg/kg",
                route: "Intravenous",
                frequency: "Every 6 hours",
                calculation: (w) => `${(50 * w).toFixed(0)} mg`,
                notes: "Maximum 2g per dose."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 2: Monitoring & Response Review",
        shortLabel: "Monitoring",
        color: "amber",
        cards: [
          {
            title: "Nursing: Strict Monitoring [NS]",
            nursing: [
              "Record Heart Rate, Blood Pressure, Respiratory Rate, and Temperature every 4 hours.",
              "Mark infection borders on admission and every 12 hours with a permanent marker to track spread.",
              "Elevate the affected limb to reduce edema.",
              "Monitor for new skin blebbing, necrosis, or crepitus every 4 hours.",
              "Assess pain levels and administer analgesia as prescribed."
            ]
          },
          {
            title: "Daily Physician Assessment Logic",
            orders: [
              "1. Check the Mark: Is the erythema spreading significantly beyond the line after 24 hours?",
              "2. Systemic Status: Resolution of fever and improvement in pain.",
              "3. Pain Management: Scheduled Ibuprofen/Paracetamol to reduce inflammatory pain."
            ]
          },
          {
            title: "When to Suspect Treatment Failure",
            threshold: "AT 24-48 HOURS",
            orders: [
              "1. Continued spread of erythema despite correct dosing.",
              "2. Persistent high fever.",
              "3. Rising inflammatory markers (C-Reactive Protein)."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Complications & Escalation",
        shortLabel: "Escalation",
        color: "red",
        cards: [
          {
            title: "Differentiating Necrotizing Fasciitis",
            threshold: "SURGICAL EMERGENCY",
            isCritical: true,
            orders: [
              "Triggers: Pain out of proportion to findings, rapid spread (hourly), skin necrosis/blebbing, or crepitus.",
              "Action: URGENT SURGICAL DEBRIDEMENT. Do not wait for imaging.",
              "Broaden Treatment: Immediate upgrade to Piperacillin-Tazobactam + Vancomycin + Clindamycin (to stop toxin production)."
            ]
          },
          {
            title: "2nd-Line / MRSA Upgrade (PREFERRED REGIMEN: MONOTHERAPY)",
            threshold: "FAILURE TO IMPROVE",
            orders: [
              "Target: Resistant Staphylococcus aureus or Gram-negative coverage.",
              "Prescription: Add Vancomycin or switch to Ceftriaxone."
            ],
            prescriptions: [
              {
                drug: "Vancomycin (Intravenous)",
                dose: "15 mg/kg",
                route: "Intravenous",
                frequency: "Every 6 hours",
                calculation: (w) => `${(15 * w).toFixed(0)} mg`,
                notes: "Target troughs 15-20."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 4: Step-Down & Discharge",
        shortLabel: "Discharge",
        color: "emerald",
        cards: [
          {
            title: "Oral Transition Criteria",
            orders: [
              "1. Afebrile for > 24 hours.",
              "2. Halting of spread and reduction in localized edema/pain.",
              "3. Total Duration: 7-10 days (Intravenous + Oral)."
            ],
            prescriptions: [
              {
                drug: "Cephalexin (Oral)",
                dose: "25 mg/kg",
                route: "Oral",
                frequency: "Every 6-8 hours",
                calculation: (w) => `${(25 * w).toFixed(0)} mg`,
                notes: "Maximum 500mg - 1g per dose."
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
