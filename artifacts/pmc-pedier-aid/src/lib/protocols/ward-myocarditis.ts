import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Acute Myocarditis & Pericarditis
 * MASTER MANAGEMENT PATHWAY (MMP)
 */
export const wardMyocarditisProtocol: DiseaseProtocol = {
  id: 'ward-myocarditis',
  name: 'Myocarditis/Pericarditis Master Pathway',
  system: 'Cardiovascular System',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Acute Myocarditis is an inflammatory process of the myocardium with a broad clinical spectrum, from mild symptoms to sudden cardiac death or fulminant heart failure. Pericarditis often co-exists. Management requires high-level monitoring for arrhythmias and hemodynamic instability, along with targeted immunomodulation.',
  image: {
    url: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Inflammatory cardiac condition"
  },
  questions: [
    { id: 'weight', questionText: 'Current Body Weight', type: 'number', unit: 'kg' },
    { id: 'hr', questionText: 'Heart Rate (Resting)', type: 'number', unit: 'bpm' },
    { id: 'bp', questionText: 'Blood Pressure', type: 'text' },
    { id: 'troponin', questionText: 'High Sensitivity Troponin', type: 'number', unit: 'ng/L' },
  ], 

  mmpData: {
    snapshot: "Management focuses on minimizing myocardial work and monitoring for life-threatening arrhythmias. Strict bed rest is mandatory. The mainstay of therapy for acute inflammatory phases is high-dose IVIG and corticosteroids. Early detection of heart failure or cardiogenic shock is critical.",
    stages: [
      {
        label: "Stage 1: Hemodynamic & Rhythm Monitoring",
        shortLabel: "Monitoring",
        color: "blue",
        cards: [
          {
            title: "Immediate Nursing Directives [NS]",
            isCritical: true,
            nursing: [
              "Strict Bed Rest: Minimize all physical activity to reduce myocardial oxygen demand.",
              "Continuous Telemetry: 3-lead ECG monitoring for arrhythmias and ST-segment changes.",
              "Continuous Pulse Oximetry.",
              "Blood Pressure checks every 2-4 hours."
            ]
          },
          {
            title: "Diagnostic Workup [DR]",
            orders: [
              "12-Lead ECG: Look for low voltage, ST-T wave changes, or arrhythmias.",
              "Imaging: Chest X-ray (cardiomegaly, pulmonary edema) and Echocardiogram (EF, regional wall motion, pericardial effusion).",
              "Biomarkers: Serial Troponin T/I and BNP every 12-24 hours.",
              "Infectious Screening: Viral PCRs (Enterovirus, Adenovirus, Parvovirus B19, COVID-19)."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Immunomodulation Therapy",
        shortLabel: "Immunotherapy",
        color: "amber",
        cards: [
          {
            title: "Anti-Inflammatory Strategy [DR]",
            threshold: "CONSULT CARDIOLOGY FIRST",
            orders: [
              "IVIG (Intravenous Immunoglobulin): 2 g/kg administered over 12-24 hours.",
              "Methylprednisolone (Pulse): 30 mg/kg/day IV for 3 days, followed by oral prednisolone taper.",
              "Aspirin/NSAIDs: Use for Pericarditis ONLY if ventricular function is normal."
            ],
            prescriptions: [
              {
                drug: "IVIG (2 g/kg)",
                dose: "2 g/kg total",
                route: "IV Infusion",
                frequency: "Once",
                calculation: (w) => `${(w * 2).toFixed(1)} grams`,
                notes: "Infuse slowly as per hospital protocol. Monitor for infusion reactions."
              },
              {
                drug: "Methylprednisolone",
                dose: "30 mg/kg",
                route: "IV",
                frequency: "Daily x 3 days",
                calculation: (w) => `${(w * 30).toFixed(0)} mg`,
                notes: "Max 1000mg. Give over 1 hour."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 3: Senior Triggers & Escalation",
        shortLabel: "Escalation",
        color: "red",
        cards: [
          {
            title: "Red Flags & Senior Triggers [!]",
            isCritical: true,
            triggers: [
              "IF Ejection Fraction (EF) < 40% or rapidly declining.",
              "IF New-onset Arrythmias (PVCs, VT, or Heart Block) occur.",
              "IF Patient develops signs of tamponade (muffled heart sounds, distended neck veins).",
              "IF Troponin levels are rising rapidly."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data) => {
    const hr = Number(data.hr);
    const trop = Number(data.troponin);
    if (hr > 160 || trop > 1000) return { level: 'critical', details: ["Severe Myocarditis: Fulminant failure or high-risk arrhythmia. ICU/Cardiology required."] };
    if (trop > 100) return { level: 'severe', details: ["Acute Myocarditis: Requires continuous telemetry and IVIG."] };
    return { level: 'moderate', details: ["Suspected Myocarditis: Monitor biomarkers and rhythm."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Biomarkers (Troponin/BNP) are normalized or significantly improved.",
    "No arrhythmias detected on telemetry for > 48 hours.",
    "Ventricular function (EF) stable or improving on Echocardiogram.",
    "Clear instructions on activity restriction (no competitive sports for 3-6 months)."
  ],
  getRedFlags: [
    "Syncopal episodes",
    "Chest pain worsened by lying flat (Pericarditis)",
    "Distant/muffled heart sounds",
    "Gallop rhythm",
    "Hypotension"
  ],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "CIRCULATION: Management of Acute Myocarditis in Children", url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000000901" },
    { title: "RCH Melbourne: Myocarditis and Pericarditis", url: "https://www.rch.org.au/clinicalguide/guideline_index/Myocarditis_and_pericarditis/" }
  ],
};
