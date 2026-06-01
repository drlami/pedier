import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const wardAkiProtocol: DiseaseProtocol = {
  id: 'ward-aki',
  name: 'Ward: Acute Kidney Injury (AKI)',
  system: 'Renal & Urinary System',
  unit: 'ward',
  description: 'Comprehensive inpatient management of AKI, focusing on fluid titration, electrolyte balance, and dialysis indications.',
  image: {
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "kidney"
  },
  questions: [
    { id: 'weight', questionText: 'Current Weight', type: 'number', unit: 'kg' },
    { id: 'akiStage', questionText: 'AKI Stage (KDIGO)', type: 'select', options: [
      { label: 'Stage 1 (Cr x1.5-1.9 or <0.5 mL/kg/h x 6h)', value: 'stage1' },
      { label: 'Stage 2 (Cr x2.0-2.9 or <0.5 mL/kg/h x 12h)', value: 'stage2' },
      { label: 'Stage 3 (Cr x3.0+ or <0.3 mL/kg/h x 24h/Anuria)', value: 'stage3' },
    ]},
    { id: 'volumeStatus', questionText: 'Volume Status', type: 'select', options: [
      { label: 'Hypovolemic/Dry', value: 'hypo' },
      { label: 'Euvolemic', value: 'eu' },
      { label: 'Hypervolemic/Overloaded', value: 'hyper' },
    ]},
    { id: 'hyperkalemia', questionText: 'Hyperkalemia present? (>5.5)', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    if (data.akiStage === 'stage3' || data.hyperkalemia === true) {
      return { level: 'critical', details: ["KDIGO Stage 3 AKI or significant hyperkalemia."] };
    }
    if (data.akiStage === 'stage2' || data.volumeStatus === 'hyper') {
      return { level: 'severe', details: ["KDIGO Stage 2 AKI or volume overload."] };
    }
    return { level: 'moderate', details: ["Stable AKI monitoring."] };
  },
  getManagement: (severity: Severity, data: FormData) => {
    const mgmt = [
      {
        title: "Fluid Management (Crucial)",
        recommendations: [
          "If Hypovolemic: Give fluid boluses (10-20 mL/kg) and monitor for response (urine/BP).",
          "If Hypervolemic/Oliguric: Restrict to Insensible Loss + Urine Output. Trial of Furosemide (2-5 mg/kg) may be attempted once.",
          "Stop all nephrotoxic drugs (NSAIDs, Aminoglycosides, ACE inhibitors).",
          "Dose-adjust all remaining medications for GFR."
        ]
      },
      {
        title: "Metabolic & Electrolyte Control",
        recommendations: [
          "Monitor Potassium, Sodium, Calcium, Phosphate, and Acid-Base daily (or more if unstable).",
          "Hyperkalemia: Use Salbutamol nebs, Insulin/Dextrose, or Calcium Gluconate if ECG changes.",
          "Acidosis: Sodium Bicarbonate only if pH < 7.15 and volume allows."
        ]
      }
    ];

    if (data.akiStage === 'stage3' || data.volumeStatus === 'hyper') {
      mgmt.push({
        title: "Indications for RRT (Dialysis/CRRT)",
        recommendations: [
          "A - Acidosis (Refractory metabolic acidosis).",
          "E - Electrolytes (Refractory hyperkalemia).",
          "I - Intoxication (Drugs like Salicylates/Lithium).",
          "O - Overload (Fluid overload > 10% baseline weight + diuretic failure).",
          "U - Uremia (Encephalopathy, Pericarditis, or BUN > 80-100 mg/dL)."
        ]
      });
    }

    return mgmt;
  },
  getDisposition: (severity: Severity, data: FormData) => {
    return [
      "Patient must have stable/improving creatinine for at least 48 hours.",
      "Urine output established (> 1 mL/kg/hour).",
      "Electrolytes stable on oral diet/fluids.",
      "Follow-up with Nephrology is essential to ensure full recovery and monitor for CKD progression."
    ];
  },
  getRedFlags: () => [
    "Hyperkalemia with ECG changes (Peaked T waves, wide QRS).",
    "Symptomatic fluid overload (Respiratory distress).",
    "Uremic symptoms: Seizures, altered mental status, or friction rub.",
    "Rapidly rising Creatinine/Urea."
  ],
  getDrugDoses: (severity: Severity, data: FormData): DrugDose[] => {
    const weight = Number(data.weight || 0);
    if (!weight) return [];
    return [
      { drugName: "Furosemide (High dose trial)", dose: `${(weight * 2).toFixed(0)} mg IV Stat (Stop if no response)` },
      { drugName: "Calcium Gluconate 10%", dose: `${(weight * 0.5).toFixed(0)} mL IV Over 10 mins (If K > 6.5 + ECG)` },
      { drugName: "Salbutamol Nebulizer", dose: "2.5-5 mg Inhaled Stat for hyperkalemia" },
    ];
  },
  getReferences: () => [
    { title: "KDIGO Clinical Practice Guideline for Acute Kidney Injury", url: "https://kdigo.org/guidelines/acute-kidney-injury/" },
    { title: "PedsQL: AKI Management in Children", url: "https://pubmed.ncbi.nlm.nih.gov/30671904/" }
  ]
};
