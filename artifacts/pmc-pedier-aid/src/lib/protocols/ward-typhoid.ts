import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Typhoid Fever (Enteric Fever)
 * MASTER MANAGEMENT PATHWAY
 */
export const wardTyphoidProtocol: DiseaseProtocol = {
  id: 'ward-typhoid',
  name: 'Typhoid Fever (Enteric Fever)',
  system: 'Infectious Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Senior directive for Salmonella Typhi/Paratyphi: Resistance management, perforation monitoring, and structured antibiotic therapy.',
  image: {
    url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Typhoid Fever Clinical Management"
  },
  questions: [],

  mmpData: {
    stages: [
      {
        label: "Admission & Diagnostics",
        shortLabel: "Admission & Diagnostics",
        color: "blue",
        cards: [
          {
            title: "Mandatory Laboratory Workup",
            instructions: [
              "1. Blood Culture: GOLD STANDARD (Highest yield in 1st week). REQUIRED before antibiotics.",
              "2. Stool & Urine Cultures: Higher yield in 2nd and 3rd weeks.",
              "3. CBC: Check for anemia, leukopenia (common), or leukocytosis (suggests perforation).",
              "4. LFTs: Often show mild transaminitis.",
              "5. Widal Test: Poor specificity; only useful if interpreted with high baseline titers in endemic areas."
            ]
          },
          {
            title: "Supportive Care & Isolation",
            instructions: [
              "Enteric Precautions: Strict hand hygiene and stool management.",
              "Hydration: IV fluids if vomiting or severe diarrhea; NG/Oral otherwise.",
              "Fever Management: Avoid Aspirin (risk of GI bleed). Use Paracetamol."
            ]
          },
          {
            title: "Empiric IV Therapy (1st Line) (PREFERRED REGIMEN: MONOTHERAPY)",
            threshold: "LOCAL SENSITIVITY PENDING",
            instructions: [
              "Target: Salmonella Typhi/Paratyphi.",
              "Note: Be aware of Extensively Drug-Resistant (XDR) Typhoid (requires Azithromycin/Meropenem)."
            ],
            prescriptions: [
              {
                drug: "Ceftriaxone",
                dose: "80-100 mg/kg",
                route: "IV",
                frequency: "Once daily",
                calculation: (w) => `${Math.min(100 * w, 4000).toFixed(0)} mg`,
                notes: "Standard 1st line. Max 4g."
              }
            ]
          }
        ]
      },
      {
        label: "Monitoring & Resistance Check",
        shortLabel: "Monitoring & Resistance Check",
        color: "amber",
        cards: [
          {
            title: "Clinical Response Tracking",
            instructions: [
              "Fever Clearance: Typically takes 3-5 days even with effective antibiotics.",
              "Abdominal Exam: Perform serial exams (Q8h) to detect early signs of perforation.",
              "Neurological Check: Assess for 'Typhoid State' (muttering delirium/apathy)."
            ]
          },
          {
            title: "XDR / Resistance Trigger",
            threshold: "FAILURE TO IMPROVE AT 5 DAYS",
            isCritical: true,
            instructions: [
              "If fever persists > 5 days despite Ceftriaxone, suspect XDR Typhoid.",
              "ACTION: Switch to Meropenem and/or add Azithromycin."
            ],
            prescriptions: [
              {
                drug: "Azithromycin",
                dose: "20 mg/kg",
                route: "PO/IV",
                frequency: "Once daily",
                calculation: (w) => `${Math.min(20 * w, 1000).toFixed(0)} mg`,
                notes: "Effective for many resistant strains. Max 1g."
              }
            ]
          }
        ]
      },
      {
        label: "Complications (Emergency)",
        shortLabel: "Complications (Emergency)",
        color: "red",
        cards: [
          {
            title: "Complication 1: INTESTINAL PERFORATION",
            threshold: "SUDDEN ABDOMINAL PAIN / TACHYCARDIA",
            isCritical: true,
            instructions: [
              "Radiology: Upright X-ray (Look for free air under diaphragm).",
              "Surgical Referral: URGENT for exploratory laparotomy.",
              "Management: NPO, NGT decompression, Broaden antibiotics."
            ],
            prescriptions: [
              {
                drug: "Tazocin (Piperacillin/Tazobactam)",
                dose: "90 mg/kg",
                route: "IV",
                frequency: "Every 6 hours",
                calculation: (w) => `${(90 * w).toFixed(0)} mg`,
                notes: "Broaden to cover GI flora/anaerobes. Max 4.5g."
              }
            ]
          },
          {
            title: "Complication 2: TYPHOID ENCEPHALOPATHY",
            threshold: "ALTERED SENSORIUM / SHOCK",
            isCritical: true,
            instructions: [
              "Consider High-dose Dexamethasone if severe toxicity/shock (reduces mortality)."
            ],
            prescriptions: [
              {
                drug: "Dexamethasone",
                dose: "3 mg/kg",
                route: "IV",
                frequency: "Initial dose, then 1 mg/kg every 6h for 48h",
                calculation: (w) => `Initial: ${(3 * w).toFixed(1)} mg`
              }
            ]
          }
        ]
      },
      {
        label: "Completion & Discharge",
        shortLabel: "Completion & Discharge",
        color: "emerald",
        cards: [
          {
            title: "Discharge Criteria",
            instructions: [
              "1. Afebrile for > 48 hours.",
              "2. Tolerating oral intake.",
              "3. Clinical stability (normal bowel sounds, no abdominal pain)."
            ]
          },
          {
            title: "Antibiotic Course Duration",
            threshold: "TOTAL COURSE 10-14 DAYS",
            instructions: [
              "Uncomplicated: 10 days total.",
              "Complicated/Severe: 14 days total.",
              "Ensure patient completes the course to prevent relapse and carrier state."
            ],
            prescriptions: [
              {
                drug: "Cefixime",
                dose: "10 mg/kg",
                route: "PO",
                frequency: "Every 12 hours",
                calculation: (w) => `${(10 * w).toFixed(0)} mg`,
                notes: "Standard oral step-down. Max 400mg/dose."
              }
            ]
          },
          {
            title: "Follow-up & Public Health",
            instructions: [
              "Screening: Repeat stool culture at 4 weeks to identify chronic carriers.",
              "Public Health: Notify local health authorities."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: () => ({ level: 'moderate', details: [] }),
  getManagement: () => [],
  getDisposition: () => [],
  getRedFlags: () => [],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "WHO: Typhoid Fever - Health Topics", url: "https://www.who.int/news-room/fact-sheets/detail/typhoid" },
    { title: "AAP Red Book: Salmonella Infections", url: "https://redbook.solutions.aap.org" }
  ],
};
