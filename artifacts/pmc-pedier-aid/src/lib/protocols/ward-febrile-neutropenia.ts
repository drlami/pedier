import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Febrile Neutropenia (Oncology Management)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: ASCO/IDSA Guidelines and RCH Melbourne Oncology Handbook
 */
export const wardFebrileNeutropeniaProtocol: DiseaseProtocol = {
  id: 'ward-febrile-neutropenia',
  name: 'Febrile Neutropenia Master Pathway',
  system: 'Hematology & Oncology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Febrile Neutropenia is a life-threatening oncological emergency defined by a single oral temperature ≥ 38.3°C (or ≥ 38.0°C sustained over 1 hour) in a patient with an Absolute Neutrophil Count less than 500 cells/microliter. This exhaustive directive covers the "Golden Hour" antibiotic window, comprehensive screening of central venous access devices, and structured management of complications like Typhlitis.',
  image: {
    url: "https://images.unsplash.com/photo-1579152276502-545a248a69a7?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Oncology ward monitoring and infectious risk assessment"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'ancLevel', questionText: 'Absolute Neutrophil Count (cells/microliter)', type: 'number' },
    { id: 'hemodynamicStable', questionText: 'Patient is hemodynamically stable (Normal Blood Pressure for age)?', type: 'boolean' },
    { id: 'abdominalPain', questionText: 'Severe abdominal pain or bloody diarrhea (Suspected Typhlitis)?', type: 'boolean' },
  ], 

  mmpData: {
    snapshot: "Febrile Neutropenia management is driven by the 'Golden Hour' principle: (1) Immediate culture acquisition from all Central Venous Access Device lumens and peripheral sites, (2) Initiation of empirical broad-spectrum anti-pseudomonal therapy within 60 minutes, and (3) Systematic daily assessment for 'silent' foci such as the perianal area and oral mucosa. Clinicians must maintain a low threshold for broadening coverage to include Vancomycin or Antifungals if fevers persist.",
    stages: [
      {
        label: "Stage 1: Emergency Stabilization (Hour 0-1)",
        shortLabel: "Golden Hour",
        color: "red",
        cards: [
          {
            title: "Initial Physician Orders [DR]",
            threshold: "START WITHIN 60 MINUTES",
            orders: [
              "Blood Cultures: MANDATORY from ALL lumens of the Central Venous Access Device and at least one Peripheral site.",
              "Complete Blood Count with Differential: Calculate the Absolute Neutrophil Count immediately.",
              "Inflammatory Markers: C-Reactive Protein and Procalcitonin.",
              "Metabolic Baseline: Urea, Electrolytes, Creatinine, and Liver Function Tests.",
              "Initial Antibiotic: Administer the first dose of anti-pseudomonal coverage (e.g., Piperacillin-Tazobactam) IMMEDIATELY after cultures.",
              "Urinalysis: Mandatory screening for occult infection even in the absence of urinary symptoms."
            ]
          },
          {
            title: "1st-Line Rx (PREFERRED REGIMEN: MONOTHERAPY)",
            threshold: "HEMODYNAMICALLY STABLE",
            orders: [
              "Target Pathogens: Pseudomonas aeruginosa and other high-risk Gram-negative bacteria.",
              "Drug of Choice: Piperacillin-Tazobactam (90 mg/kg) remains the international gold standard."
            ],
            prescriptions: [
              {
                drug: "Piperacillin-Tazobactam (Tazocin)",
                dose: "90 mg/kg",
                route: "Intravenous",
                frequency: "Every 6 hours",
                calculation: (w) => `${Math.min(90 * w, 4500).toFixed(0)} mg`,
                notes: "Maximum 4.5 grams per dose."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 2: Risk Stratification & Surveillance",
        shortLabel: "Monitoring",
        color: "amber",
        cards: [
          {
            title: "Nursing: Vigilance Checks [NS]",
            isCritical: true,
            nursing: [
              "Vital Signs: Monitor Heart Rate, Blood Pressure, and Respiratory Rate every 4 hours.",
              "Temperature: Document every 2-4 hours; notify physician for any rise above 38.5°C.",
              "Site Inspection: Daily examination of Central Line exit sites, oral mucosa (for mucositis), and the perianal area (for redness/abscess).",
              "Hydration Status: Strict Intake and Output charting."
            ]
          },
          {
            title: "Secondary Coverage Triggers",
            threshold: "GRAM-POSITIVE RISKS",
            orders: [
              "Consider adding Vancomycin (PREFERRED REGIMEN: DUAL THERAPY) if: Hemodynamic instability, severe Mucositis, or obvious Central Line site infection (pus/redness) occurs."
            ],
            prescriptions: [
              {
                drug: "Vancomycin",
                dose: "15 mg/kg",
                route: "Intravenous",
                frequency: "Every 6 hours",
                calculation: (w) => `${(15 * w).toFixed(0)} mg`,
                notes: "Target trough levels: 15-20 mcg/mL."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 3: Complication Management [!]",
        shortLabel: "Complications",
        color: "red",
        cards: [
          {
            title: "Persistent Fever (Day 3-5)",
            threshold: "FAILURE TO IMPROVE",
            orders: [
              "Repeat Cultures: Redraw from all Central Venous Access Device lumens.",
              "Broaden Therapy: Switch from Piperacillin-Tazobactam to Meropenem to cover resistant Gram-negative organisms.",
              "Fungal Screen: If fever persists > 5-7 days, order Computed Tomography (CT) of the chest and Serum Galactomannan."
            ]
          },
          {
            title: "Typhlitis (Neutropenic Enterocolitis)",
            threshold: "ABDOMINAL PAIN + FEVER",
            isCritical: true,
            orders: [
              "Emergency: Strict NPO (Nil Per Os), aggressive Intravenous hydration, and ensure Anaerobic coverage (Metronidazole).",
              "Radiology: Urgent Abdominal Computed Tomography (CT) to assess for cecal wall thickening greater than 4 millimeters."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Recovery & Recovery Roadmap",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Discharge Criteria",
            orders: [
              "1. Afebrile for at least 24-48 hours.",
              "2. Evidence of marrow recovery (Absolute Neutrophil Count showing a clear rising trend or > 500 cells/microliter).",
              "3. Blood Cultures remain negative for at least 48 hours.",
              "4. Tolerating adequate oral intake."
            ]
          },
          {
            title: "Follow-up",
            orders: [
              "Oncology Clinic: Review within 48 hours of discharge.",
              "Family Education: Parents must return immediately for ANY new fever, even if the count was recovering."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.hemodynamicStable === false || data.abdominalPain === true) {
      return { level: 'critical', details: ["High-risk Febrile Neutropenia - Signs of shock or Typhlitis detected."] };
    }
    if (data.ancLevel && data.ancLevel < 100) {
      return { level: 'severe', details: ["Profound Neutropenia (ANC < 100) - High risk for rapid bacterial dissemination."] };
    }
    return { level: 'moderate', details: ["Febrile Neutropenia in a clinically stable patient."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Appropriate broad-spectrum antibiotics administered within the 'Golden Hour'.",
    "Hemodynamically stable with normal Blood Pressure.",
    "No abdominal symptoms (Typhlitis ruled out).",
    "Absolute Neutrophil Count monitored and Nadir identified."
  ],
  getRedFlags: () => ["Hypotension", "Severe Abdominal Pain", "Lethargy", "New organic heart murmur", "Redness/Pus at Central Line site"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "ASCO/IDSA: Management of Febrile Neutropenia in Pediatric Cancer Patients", url: "https://ascopubs.org/doi/10.1200/JCO.2012.44.5130" },
    { title: "RCH Melbourne: Febrile Neutropenia (Oncology)", url: "https://www.rch.org.au/clinicalguide/guideline_index/Febrile_Neutropenia/" }
  ]
};
