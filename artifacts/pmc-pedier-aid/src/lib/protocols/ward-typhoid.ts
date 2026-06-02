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
  description: 'Typhoid Fever, also known as Enteric Fever, is a systemic infection caused by Salmonella Typhi or Paratyphi, typically transmitted through contaminated food or water. This exhaustive directive covers resistance management (including Extensively Drug-Resistant strains), intestinal perforation monitoring, and structured antibiotic therapy.',
  image: {
    url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Typhoid Fever Clinical Management"
  },
  questions: [],

  mmpData: {
    snapshot: "Typhoid management hinges on three critical factors: (1) Prompt initiation of empiric antibiotics tailored to local sensitivity patterns (alert for XDR strains), (2) Vigilant monitoring for life-threatening complications, particularly intestinal perforation which typically occurs in the third week, and (3) Ensuring a complete 10-14 day course of treatment to prevent relapse and the chronic carrier state. Fever clearance is notoriously slow (3-5 days), requiring clinical patience if the patient is otherwise stable.",
    stages: [
      {
        label: "Stage 1: Admission & Diagnostics",
        shortLabel: "Diagnostics",
        color: "blue",
        cards: [
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "1. Blood Culture: GOLD STANDARD (Highest yield in first week). REQUIRED before starting Intravenous antibiotics.",
              "2. Stool & Urine Cultures: Higher yield in second and third weeks.",
              "3. Complete Blood Count: Check for anemia, leukopenia (common), or leukocytosis (suggests intestinal perforation).",
              "4. Liver Function Tests: Often show mild transaminitis.",
              "5. Widal Test: Poor specificity; only useful if interpreted with high baseline titers in endemic areas."
            ]
          },
          {
            title: "Nursing: Strict Monitoring [NS]",
            nursing: [
              "Record Heart Rate, Blood Pressure, Respiratory Rate, and Temperature every 4 hours.",
              "Perform a focused abdominal assessment every 8 hours, checking for new tenderness, guarding, or absent bowel sounds.",
              "Maintain strict enteric precautions: dedicated equipment, strict hand hygiene, and safe disposal of feces and urine.",
              "Monitor fluid balance (Intake and Output) every 8 hours; alert physician if Urine Output is less than 1.0 mL/kg/hour.",
              "Assess mental status every 8 hours for signs of apathy, delirium, or 'Typhoid State'."
            ]
          },
          {
            title: "Empiric Intravenous Therapy (1st Line)",
            threshold: "LOCAL SENSITIVITY PENDING",
            orders: [
              "Target: Salmonella Typhi/Paratyphi.",
              "Note: Be aware of Extensively Drug-Resistant (XDR) Typhoid (requires Azithromycin or Meropenem)."
            ],
            prescriptions: [
              {
                drug: "Ceftriaxone",
                dose: "80-100 mg/kg",
                route: "Intravenous",
                frequency: "Once daily",
                calculation: (w) => `${Math.min(100 * w, 4000).toFixed(0)} mg`,
                notes: "Standard 1st line. Maximum 4g."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 2: Monitoring & Resistance Check",
        shortLabel: "Monitoring",
        color: "amber",
        cards: [
          {
            title: "Physician Response Tracking",
            orders: [
              "Fever Clearance: Typically takes 3-5 days even with effective antibiotics.",
              "Abdominal Exam: Perform serial exams every 8 hours to detect early signs of intestinal perforation.",
              "Neurological Check: Assess for 'Typhoid State' (muttering delirium or apathy)."
            ]
          },
          {
            title: "Extensively Drug-Resistant Trigger",
            threshold: "FAILURE TO IMPROVE AT 5 DAYS",
            isCritical: true,
            orders: [
              "If fever persists > 5 days despite Ceftriaxone, suspect Extensively Drug-Resistant (XDR) Typhoid.",
              "ACTION: Switch to Meropenem and/or add Azithromycin."
            ],
            prescriptions: [
              {
                drug: "Azithromycin",
                dose: "20 mg/kg",
                route: "Oral / Intravenous",
                frequency: "Once daily",
                calculation: (w) => `${Math.min(20 * w, 1000).toFixed(0)} mg`,
                notes: "Effective for many resistant strains. Maximum 1g."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 3: Complications (Emergency)",
        shortLabel: "Complications",
        color: "red",
        cards: [
          {
            title: "Complication: INTESTINAL PERFORATION",
            threshold: "SUDDEN ABDOMINAL PAIN / TACHYCARDIA",
            isCritical: true,
            orders: [
              "Radiology: Upright X-ray (Look for free air under diaphragm).",
              "Surgical Referral: URGENT for exploratory laparotomy.",
              "Management: Nil Per Os (Nothing by Mouth), Nasogastric Tube decompression, Broaden antibiotics."
            ],
            prescriptions: [
              {
                drug: "Piperacillin-Tazobactam",
                dose: "90 mg/kg",
                route: "Intravenous",
                frequency: "Every 6 hours",
                calculation: (w) => `${(90 * w).toFixed(0)} mg`,
                notes: "Broaden to cover gastrointestinal flora and anaerobes. Maximum 4.5g."
              }
            ]
          },
          {
            title: "Complication: TYPHOID ENCEPHALOPATHY",
            threshold: "ALTERED SENSORIUM / SHOCK",
            isCritical: true,
            orders: [
              "Consider High-dose Dexamethasone if severe toxicity or shock (reduces mortality)."
            ],
            prescriptions: [
              {
                drug: "Dexamethasone",
                dose: "3 mg/kg",
                route: "Intravenous",
                frequency: "Initial dose, then 1 mg/kg every 6 hours for 48 hours",
                calculation: (w) => `Initial: ${(3 * w).toFixed(1)} mg`
              }
            ]
          }
        ]
      },
      {
        label: "Stage 4: Completion & Discharge",
        shortLabel: "Discharge",
        color: "emerald",
        cards: [
          {
            title: "Discharge Criteria",
            orders: [
              "1. Afebrile for > 48 hours.",
              "2. Tolerating oral intake.",
              "3. Clinical stability (normal bowel sounds, no abdominal pain)."
            ]
          },
          {
            title: "Antibiotic Course Duration",
            threshold: "TOTAL COURSE 10-14 DAYS",
            orders: [
              "Uncomplicated: 10 days total.",
              "Complicated or Severe: 14 days total.",
              "Ensure patient completes the course to prevent relapse and chronic carrier state."
            ],
            prescriptions: [
              {
                drug: "Cefixime",
                dose: "10 mg/kg",
                route: "Oral",
                frequency: "Every 12 hours",
                calculation: (w) => `${(10 * w).toFixed(0)} mg`,
                notes: "Standard oral step-down. Maximum 400mg per dose."
              }
            ]
          },
          {
            title: "Follow-up & Public Health",
            orders: [
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
