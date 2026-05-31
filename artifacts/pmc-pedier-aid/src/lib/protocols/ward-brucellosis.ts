import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Brucellosis (Malta Fever)
 * FULL MASTER SENIOR DOCTOR MANAGEMENT PATHWAY
 * Derived from: WHO, CDC, and RCH Melbourne Guidelines
 */
export const wardBrucellosisProtocol: DiseaseProtocol = {
  id: 'ward-brucellosis',
  name: 'Brucellosis Master Pathway',
  system: 'Infectious Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Senior directive for Brucella species: IV induction criteria, triple therapy logic, and management of focal complications (Neuro/Endo).',
  image: {
    url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Brucellosis Management Roadmap"
  },
  questions: [], 

  mmpData: {
    stages: [
      {
        label: "Admission & IV Induction Logic",
        shortLabel: "Admission & IV Induction Logic",
        color: "blue",
        cards: [
          {
            title: "Mandatory Admission Workup",
            instructions: [
              "1. Blood Culture: REQUIRED (Note: requires extended incubation up to 14-21 days; notify lab).",
              "2. Brucella Serology: SAT (Standard Agglutination Test) titer > 1:160 is suggestive.",
              "3. Baseline Monitoring: CBC (look for cytopenias), LFTs (hepatotoxicity risk), and U&E.",
              "4. Radiology: Ultrasound of abdomen to assess hepatosplenomegaly."
            ]
          },
          {
            title: "Indications for IV Induction",
            threshold: "START IV IF:",
            isCritical: true,
            instructions: [
              "1. Severe Systemic Toxicity: High fever, prostration, or septic appearance.",
              "2. Inability to Tolerate Oral: Persistent vomiting or severe anorexia.",
              "3. Focal Complications: Neurobrucellosis or Endocarditis (Mandatory IV).",
              "4. Acute Phase: Many consultants prefer 7-14 days of IV Gentamicin to rapidly reduce bacterial load before moving to purely oral therapy."
            ]
          },
          {
            title: "IV Induction Therapeutics (PREFERRED REGIMEN: TRIPLE THERAPY)",
            instructions: [
              "Note: Gentamicin is the preferred parenteral addition to the oral backbone.",
              "Use Ceftriaxone for CNS involvement."
            ],
            prescriptions: [
              {
                drug: "Gentamicin (IV)",
                dose: "5 mg/kg",
                route: "IV",
                frequency: "Once daily",
                calculation: (w) => `${(5 * w).toFixed(0)} mg`,
                notes: "Induction course: 7-14 days. Monitor renal function/ototoxicity."
              },
              {
                drug: "Ceftriaxone (IV)",
                dose: "100 mg/kg/day",
                route: "IV",
                frequency: "Divided Every 12 hours",
                calculation: (w) => `${Math.min(w * 50, 2000).toFixed(0)} mg per dose`,
                notes: "Mandatory for suspected/confirmed Neurobrucellosis."
              }
            ]
          }
        ]
      },
      {
        label: "Pivot to Oral Triple Therapy",
        shortLabel: "Pivot to Oral Triple Therapy",
        color: "amber",
        cards: [
          {
            title: "Shift to Oral Logic",
            threshold: "IF CLINICALLY STABLE",
            instructions: [
              "Criteria: Afebrile for 48h, tolerating oral intake, and improving symptoms (e.g. joint pain).",
              "Note: Brucellosis MUST be treated with at least 2 or 3 agents to prevent high relapse rates."
            ]
          },
          {
            title: "Oral Choice: Option A (> 8 years) (PREFERRED REGIMEN: DUAL THERAPY)",
            instructions: [
              "Standard combination: Doxycycline + Rifampicin.",
              "Duration: Minimum 6 weeks total course."
            ],
            prescriptions: [
              {
                drug: "Doxycycline",
                dose: "2.2 mg/kg (Max 100mg)",
                route: "PO",
                frequency: "Every 12 hours",
                calculation: (w) => `${Math.min(w * 2.2, 100).toFixed(0)} mg`,
                notes: "The backbone of therapy in older children."
              },
              {
                drug: "Rifampicin",
                dose: "15 mg/kg (Max 600-900mg)",
                route: "PO",
                frequency: "Once daily",
                calculation: (w) => `${Math.min(w * 15, 600).toFixed(0)} mg`,
                notes: "Monitor LFTs weekly."
              }
            ]
          },
          {
            title: "Oral Choice: Option B (< 8 years) (PREFERRED REGIMEN: DUAL THERAPY)",
            instructions: [
              "Standard combination: Co-trimoxazole + Rifampicin.",
              "Note: Use this path for young children to avoid Doxycycline."
            ],
            prescriptions: [
              {
                drug: "Co-trimoxazole (TMP-SMX)",
                dose: "8-10 mg/kg (of TMP component)",
                route: "PO",
                frequency: "Every 12 hours",
                calculation: (w) => `${(w * 4).toFixed(0)} mg (TMP)`,
                notes: "Standard alternative to Doxycycline."
              },
              {
                drug: "Rifampicin",
                dose: "15 mg/kg",
                route: "PO",
                frequency: "Once daily",
                calculation: (w) => `${(w * 15).toFixed(0)} mg`
              }
            ]
          }
        ]
      },
      {
        label: "Complication Protocols",
        shortLabel: "Complication Protocols",
        color: "red",
        cards: [
          {
            title: "Complication 1: NEUROBRUCELLOSIS",
            isCritical: true,
            instructions: [
              "Diagnostics: Mandatory LP (CSF SAT titers/PCR/Culture) and MRI.",
              "Management: Prolonged course (3-6 months).",
              "Induction: 4-6 weeks of IV Ceftriaxone + Rifampicin + Doxycycline."
            ]
          },
          {
            title: "Complication 2: ENDOCARDITIS / OSTEOMYELITIS",
            isCritical: true,
            instructions: [
              "Endocarditis: Involve Cardiac Surgery; course 3-6 months.",
              "Spondylodiscitis: Check for spinal abscess (MRI); course 3-6 months."
            ]
          }
        ]
      },
      {
        label: "Recovery & Relapse Prevention",
        shortLabel: "Recovery & Relapse Prevention",
        color: "emerald",
        cards: [
          {
            title: "Total Duration Roadmap",
            threshold: "MANDATORY MINIMUMS",
            instructions: [
              "1. Uncomplicated (standard): 6 weeks total.",
              "2. Focal Disease (Joints/Spine): 12 weeks total.",
              "3. CNS/Endocarditis: 3-6 months total.",
              "WARNING: Stopping before 6 weeks has a > 20% relapse rate."
            ]
          },
          {
            title: "Follow-up Directive",
            instructions: [
              "Clinical Review: Monthly until completion.",
              "Serology Check: SAT titers at 3, 6, and 12 months post-recovery.",
              "Relapse Check: Any new fever or bone pain requires repeat cultures."
            ]
          }
        ]
      }
    ]
  },

  // ER Legacy
  calculateSeverity: () => ({ level: 'moderate', details: [] }),
  getManagement: () => [],
  getDisposition: () => [],
  getRedFlags: () => [],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "WHO: Brucellosis in Humans and Animals", url: "https://www.who.int/publications/i/item/9789241547130" },
    { title: "CDC: Brucellosis Diagnosis and Management", url: "https://www.cdc.gov/brucellosis/treatment/index.html" },
    { title: "RCH Melbourne: Brucellosis handbook", url: "https://www.rch.org.au/clinicalguide/guideline_index/Brucellosis/" }
  ],
};
