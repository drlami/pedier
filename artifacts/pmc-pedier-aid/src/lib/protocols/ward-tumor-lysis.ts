import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Tumor Lysis Syndrome (TLS)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: Cairo-Bishop Criteria, ASCO Guidelines, and RCH Melbourne
 */
export const wardTumorLysisProtocol: DiseaseProtocol = {
  id: 'ward-tumor-lysis',
  name: 'Tumor Lysis Syndrome Master Pathway',
  system: 'Hematology & Oncology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Tumor Lysis Syndrome is a life-threatening oncological emergency caused by the rapid lysis of malignant cells, leading to the massive release of intracellular contents (Uric Acid, Potassium, and Phosphate) into the circulation. This exhaustive directive covers the Cairo-Bishop classification, aggressive hyperhydration strategies, and precise indications for Rasburicase.',
  image: {
    url: "https://images.unsplash.com/photo-1579152276502-545a248a69a7?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Oncology emergency monitoring and metabolic rescue"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'uricAcidInitial', questionText: 'Initial Uric Acid (mg/dL)', type: 'number' },
    { id: 'potassiumInitial', questionText: 'Initial Potassium (mmol/L)', type: 'number' },
    { id: 'creatinineRise', questionText: 'Creatinine > 1.5x upper limit for age?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Tumor Lysis Syndrome management focuses on (1) Aggressive Intravenous hyperhydration to maintain high urine flow and renal perfusion, (2) Proactive prevention of Uric Acid crystallization using Allopurinol or Rasburicase, and (3) Frequent laboratory monitoring to detect 'Laboratory TLS' before it progresses to 'Clinical TLS' (Renal failure or Arrhythmia). Clinicians must AVOID Alkalinization of urine in the modern era as it promotes Calcium-Phosphate precipitation.",
    stages: [
      {
        label: "Stage 1: Identification & Risk Stratification",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Cairo-Bishop Diagnostic Criteria",
            threshold: "2 OR MORE LAB ABNORMALITIES",
            orders: [
              "Uric Acid: ≥ 8.0 mg/dL (476 micromol/L).",
              "Potassium: ≥ 6.0 mmol/L.",
              "Phosphate: ≥ 4.5 mg/dL (1.45 mmol/L).",
              "Calcium: ≤ 7.0 mg/dL (1.75 mmol/L) or 25% decrease from baseline.",
              "Clinical TLS: Laboratory TLS + Creatinine rise, Seizure, or Arrhythmia."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Baseline Metabolic Panel: Uric Acid, Potassium, Phosphate, Calcium, Urea, and Creatinine.",
              "Lactate Dehydrogenase (LDH): Critical marker of tumor burden and lysis risk.",
              "Complete Blood Count with Differential: Assess tumor burden (White Blood Cell count).",
              "Electrocardiogram: Baseline check for PR interval or QRS changes (High Potassium risk)."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Hyperhydration & Prevention",
        shortLabel: "Management",
        color: "amber",
        cards: [
          {
            title: "Aggressive Fluid Strategy",
            threshold: "MANDATORY FOR HIGH RISK",
            orders: [
              "Fluid Rate: 2.5 to 3.0 Liters/m²/day (approximately 1.5x to 2.0x maintenance).",
              "Fluid Choice: Isotonic Saline (0.9% Sodium Chloride) with 5% Dextrose. Do NOT add Potassium.",
              "Target Urine Output: Maintain > 100 mL/m²/hour (or > 3.0 mL/kg/hour in infants).",
              "Loop Diuretics: Use Furosemide ONLY if the patient is well-hydrated but not meeting urine output targets."
            ]
          },
          {
            title: "Hypouricemic Strategy",
            orders: [
              "Low/Intermediate Risk: Allopurinol (100 mg/m² every 8 hours) to prevent NEW uric acid formation.",
              "High Risk / Existing Hyperuricemia: Rasburicase (0.1 - 0.2 mg/kg) to rapidly break down existing uric acid.",
              "Note: Screen for G6PD deficiency before giving Rasburicase if time permits (risk of hemolysis)."
            ],
            prescriptions: [
              {
                drug: "Rasburicase",
                dose: "0.2 mg/kg",
                route: "Intravenous",
                frequency: "Single Dose",
                calculation: (w) => `${(w * 0.2).toFixed(1)} mg`,
                notes: "Rapid effect within 4 hours. Keep samples on ice for post-dose uric acid testing."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 3: Metabolic Rescue & Surveillance [!]",
        shortLabel: "Monitoring",
        color: "red",
        cards: [
          {
            title: "Nursing: Vigilance Checks [NS]",
            isCritical: true,
            nursing: [
              "Vitals & Cardiac: Continuous ECG monitoring if Potassium > 5.5 or Phosphate > 2.0.",
              "Intake & Output: Strict hourly charting. Report any drop in urine output immediately.",
              "Neurological Check: Assess for twitching, tetany (Low Calcium), or seizures every 4 hours.",
              "Daily Weight: Twice daily to monitor for fluid overload."
            ]
          },
          {
            title: "Dialysis Triggers",
            threshold: "IF MEDICAL MANAGEMENT FAILS",
            orders: [
              "1. Refractory Hyperkalemia (> 6.0 mmol/L despite shift therapy).",
              "2. Refractory Hyperphosphatemia (> 3.2 mmol/L) with Symptomatic Hypocalcemia.",
              "3. Severe Oliguria or Anuria despite hyperhydration.",
              "Action: Immediate preparation for Hemodialysis or Continuous Venovenous Hemodiafiltration."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Post-Lysis Stabilization",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Recovery Roadmap",
            orders: [
              "Step-down: Gradually reduce fluid rate to maintenance once metabolic markers are stable for 24-48 hours post-chemotherapy.",
              "Follow-up: Monitor renal function daily during the first week of chemotherapy.",
              "Education: Ensure family understands the importance of high fluid intake during future chemotherapy blocks."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.creatinineRise === true || (data.potassiumInitial && data.potassiumInitial >= 6.0)) {
      return { level: 'critical', details: ["Clinical Tumor Lysis Syndrome - High risk of arrhythmia and renal failure."] };
    }
    if (data.uricAcidInitial && data.uricAcidInitial >= 8.0) {
      return { level: 'severe', details: ["Laboratory Tumor Lysis Syndrome requiring Rasburicase and hyperhydration."] };
    }
    return { level: 'moderate', details: ["Stable monitoring for Tumor Lysis Syndrome."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Metabolic markers stable within normal ranges for > 24 hours.",
    "Adequate urine output on maintenance fluids.",
    "Chemotherapy cycle completed or induction phase finished.",
    "Renal function preserved (baseline Creatinine)."
  ],
  getRedFlags: () => ["Decreased urine output", "Muscle twitching or tetany", "Irregular pulse (Arrhythmia)", "Vomiting or severe lethargy"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: " Cairo-Bishop Classification of TLS", url: "https://ascopubs.org/doi/10.1200/JCO.2004.07.031" },
    { title: "ASCO Guidelines: Management of TLS", url: "https://ascopubs.org/doi/full/10.1200/jco.2007.15.0532" },
    { title: "RCH Melbourne: Tumor Lysis Syndrome", url: "https://www.rch.org.au/clinicalguide/guideline_index/Tumour_Lysis_Syndrome/" }
  ]
};
