import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Febrile Neutropenia (Oncology Management)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: ASCO/IDSA Guidelines and RCH Melbourne Oncology Handbook
 */
export const wardFebrileNeutropeniaProtocol: DiseaseProtocol = {
  id: 'ward-febrile-neutropenia',
  name: 'Febrile Neutropenia Master Pathway',
  system: 'Infectious Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Exhaustive consultant-level directive for the oncology patient: 60-min antibiotic mandate, central line management, and stepwise fungal escalation.',
  image: {
    url: "https://images.unsplash.com/photo-1579152276502-545a248a69a7?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Oncology ward monitoring"
  },
  questions: [], 

  mmpData: {
    stages: [
      {
        label: "Emergency directive (Hour 0-1)",
        shortLabel: "Emergency directive (Hour 0-1)",
        color: "red",
        cards: [
          {
            title: "Definition & Thresholds",
            threshold: "ONCOLOGY ALERT",
            instructions: [
              "1. Fever: Single T > 38.3°C or T > 38.0°C sustained for 1 hour.",
              "2. Neutropenia: ANC < 500 cells/µL (or ANC < 1000 and predicted to drop).",
              "3. MANDATE: Administer FIRST DOSE of antibiotics within 60 minutes of arrival."
            ]
          },
          {
            title: "Mandatory Baseline Labs",
            threshold: "BEFORE FIRST ANTIBIOTIC",
            instructions: [
              "1. Blood Cultures: REQUIRED from ALL lumens of Central Line (CVAD) AND a Peripheral vein.",
              "2. CBC with Differential: Essential for Absolute Neutrophil Count (ANC) calculation.",
              "3. Inflammatory Markers: CRP and Procalcitonin baseline.",
              "4. S. Electrolytes / LFTs: Baseline renal and liver function.",
              "5. Urinalysis & Culture: Even if asymptomatic (Neutropenic patients often lack pyuria)."
            ]
          },
          {
            title: "1st-Line Anti-Pseudomonal Rx (PREFERRED REGIMEN: MONOTHERAPY)",
            threshold: "STABLE PATIENT",
            instructions: [
              "Target: Pseudomonas aeruginosa and Gram-negatives.",
              "Note: Monotherapy is standard for stable patients (ASCO/IDSA)."
            ],
            prescriptions: [
              {
                drug: "Tazocin (Piperacillin-Tazobactam)",
                dose: "90 mg/kg",
                route: "IV",
                frequency: "Every 6 hours",
                calculation: (w) => `${(90 * w).toFixed(0)} mg`,
                notes: "Max 4.5g. Consultant gold standard for FN."
              }
            ]
          }
        ]
      },
      {
        label: "Monitoring & Risk Stratification",
        shortLabel: "Monitoring & Risk Stratification",
        color: "amber",
        cards: [
          {
            title: "Daily Assessment Focus",
            instructions: [
              "1. Physical Exam: Check Perianal area (abscess), Oral mucosa (mucositis), and CVAD exit site daily.",
              "2. Lab Monitoring: Daily CBC with Diff (ANC tracking) and Electrolytes.",
              "3. ANC Trend: Identify the 'nadir' (lowest point); recovery is marked by ANC > 500."
            ]
          },
          {
            title: "When to Add Vancomycin",
            threshold: "GRAM-POSITIVE COVERAGE",
            instructions: [
              "Consider adding Vancomycin immediately ONLY if:",
              "1. Hemodynamic instability (Septic shock).",
              "2. Severe mucositis or skin/soft tissue infection.",
              "3. Known prior colonization with MRSA or PRSP.",
              "4. Obvious CVAD-related infection (Redness/pus at exit site)."
            ],
            prescriptions: [
              {
                drug: "Vancomycin (IV)",
                dose: "15 mg/kg",
                route: "IV",
                frequency: "Every 6 hours",
                calculation: (w) => `${(15 * w).toFixed(0)} mg`,
                notes: "Target trough 15-20 mcg/mL."
              }
            ]
          }
        ]
      },
      {
        label: "Treatment Failure & Complications",
        shortLabel: "Treatment Failure & Complications",
        color: "red",
        cards: [
          {
            title: "Persistent Fever Pivot (Day 3-5)",
            threshold: "FAILURE TO IMPROVE",
            isCritical: true,
            instructions: [
              "1. Repeat Cultures: All CVAD lumens and peripheral sites.",
              "2. Broaden Coverage: Replace Tazocin with Meropenem if clinically failing.",
              "3. Fungal Screen: Order Chest CT and Galactomannan if fever persists > 4-7 days."
            ],
            prescriptions: [
              {
                drug: "Meropenem (IV)",
                dose: "20-40 mg/kg",
                route: "IV",
                frequency: "Every 8 hours",
                calculation: (w) => `${(40 * w).toFixed(0)} mg`,
                notes: "Use higher dose (40mg/kg) for meningitis/sepsis."
              }
            ]
          },
          {
            title: "Complication: TYPHLITIS (Neutropenic Enterocolitis)",
            threshold: "ABDOMINAL PAIN / DIARRHEA",
            isCritical: true,
            instructions: [
              "Triggers: Abdominal pain, distention, or bloody diarrhea in a neutropenic patient.",
              "Radiology: Urgent Abdominal CT (Look for cecal wall thickening > 4mm).",
              "Action: Strict NPO, IV Fluids, and ensure anaerobic coverage (Metronidazole)."
            ]
          }
        ]
      },
      {
        label: "ANC Recovery & Discharge",
        shortLabel: "ANC Recovery & Discharge",
        color: "emerald",
        cards: [
          {
            title: "Safe Discharge Criteria",
            instructions: [
              "1. Afebrile for at least 24-48 hours.",
              "2. Evidence of ANC Recovery: ANC > 500 or significant rising trend.",
              "3. Cultures: All 48h-72h cultures negative.",
              "4. Tolerating oral intake and baseline activity."
            ]
          },
          {
            title: "Follow-up Management",
            instructions: [
              "1. Clinic Review: Review by Pediatric Oncology within 24-48h.",
              "2. Instructions: Parents must return immediately for ANY new fever, even if ANC recovered."
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
    { title: "ASCO/IDSA: Management of Febrile Neutropenia in Pediatric Cancer Patients", url: "https://ascopubs.org/doi/10.1200/JCO.2012.44.5130" },
    { title: "RCH Melbourne: Febrile Neutropenia (Oncology)", url: "https://www.rch.org.au/clinicalguide/guideline_index/Febrile_Neutropenia/" }
  ],
};
