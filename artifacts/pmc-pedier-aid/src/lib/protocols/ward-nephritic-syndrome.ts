import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const wardNephriticSyndromeProtocol: DiseaseProtocol = {
  id: 'ward-nephritic-syndrome',
  name: 'Ward: Acute Nephritic Syndrome (APSGN)',
  system: 'Nephrology',
  description: 'Inpatient management of Acute Post-Streptococcal Glomerulonephritis, focusing on fluid balance and hypertension control.',
  image: {
    url: "https://images.unsplash.com/photo-1559839734-2b71f1e3c7e5?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "blood-pressure"
  },
  questions: [
    { id: 'weight', questionText: 'Current Weight', type: 'number', unit: 'kg' },
    { id: 'bloodPressure', questionText: 'Blood Pressure', type: 'select', options: [
      { label: 'Normal', value: 'normal' },
      { label: 'Mild Hypertension (>95th %)', value: 'mild_htn' },
      { label: 'Severe/Urgency (>99th % + 5mmHg)', value: 'severe_htn' },
    ]},
    { id: 'urineOutput', questionText: 'Urine Output', type: 'select', options: [
      { label: 'Normal', value: 'normal' },
      { label: 'Oliguria (<1 mL/kg/hr)', value: 'oliguria' },
    ]},
    { id: 'complications', questionText: 'Signs of Volume Overload?', type: 'select', options: [
      { label: 'None', value: 'none' },
      { label: 'Mild (Basal creps, edema)', value: 'mild' },
      { label: 'Severe (Pulmonary edema, SOB)', value: 'severe' },
    ]},
  ],
  calculateSeverity: (data: FormData): Severity => {
    if (data.bloodPressure === 'severe_htn' || data.complications === 'severe') {
      return { level: 'critical', details: ["Hypertensive urgency or severe pulmonary edema."] };
    }
    if (data.bloodPressure === 'mild_htn' || data.urineOutput === 'oliguria') {
      return { level: 'severe', details: ["High risk: hypertension or significant oliguria."] };
    }
    return { level: 'moderate', details: ["Stable nephritic syndrome."] };
  },
  getManagement: (severity: Severity, data: FormData) => {
    const mgmt = [
      {
        title: "Strict Fluid & Salt Balance",
        recommendations: [
          "Restrict fluid intake to: Insensible Loss (400 mL/m²/day) + Urine Output.",
          "No-Added-Salt diet.",
          "Daily Weight (mandatory) - aim for weight loss of 1-2% per day until diuresis.",
          "Monitor serum electrolytes and creatinine daily."
        ]
      }
    ];

    if (data.bloodPressure !== 'normal' || data.urineOutput === 'oliguria') {
      mgmt.push({
        title: "Hypertension & Diuresis",
        recommendations: [
          "Furosemide: First-line for volume-dependent hypertension.",
          "If BP remains high: Add CCB (Amlodipine) or Hydralazine.",
          "Avoid ACE inhibitors (e.g., Enalapril) in the acute phase due to risk of hyperkalemia/AKI."
        ]
      });
    }

    if (data.bloodPressure === 'severe_htn') {
      mgmt.push({
        title: "Hypertensive Urgency/Emergency",
        recommendations: [
          "Consider IV Hydralazine or Labetalol infusion.",
          "Frequent neurological checks (risk of PRES/Encephalopathy).",
          "Consult Pediatric Nephrology and ICU."
        ]
      });
    }

    mgmt.push({
      title: "Etiology Workup",
      recommendations: [
        "ASO Titre and Anti-DNAse B.",
        "Complement levels (C3, C4): C3 is characteristically low in APSGN and normalizes by 8 weeks.",
        "Urine microscopy: Look for red cell casts and dysmorphic RBCs."
      ]
    });

    return mgmt;
  },
  getDisposition: (severity: Severity, data: FormData) => {
    return [
      "Stable blood pressure on oral medications (or no meds).",
      "Resolved or improving volume overload/edema.",
      "Normalizing renal function and stable electrolytes.",
      "Follow-up scheduled for BP check and C3 level repeat at 8 weeks."
    ];
  },
  getRedFlags: () => [
    "Acute headache, visual changes, or seizures (Hypertensive Encephalopathy).",
    "Sudden respiratory distress or frothy sputum (Pulmonary Edema).",
    "Anuria or rapidly rising creatinine.",
    "Severe hyperkalemia (>6.0 mmol/L)."
  ],
  getDrugDoses: (severity: Severity, data: FormData): DrugDose[] => {
    const weight = Number(data.weight || 0);
    if (!weight) return [];
    return [
      { drugName: "Furosemide (IV/Oral)", dose: `${(weight * 1).toFixed(0)} mg Every 6-12 hours` },
      { drugName: "Amlodipine", dose: `${(weight * 0.1).toFixed(1)} mg Daily (Max 10mg)` },
      { drugName: "Hydralazine (IV)", dose: `${(weight * 0.2).toFixed(1)} mg Every 4-6 hours (Slow push)` },
    ];
  },
  getReferences: () => [
    { title: "StatPearls: Poststreptococcal Glomerulonephritis", url: "https://www.ncbi.nlm.nih.gov/books/NBK441865/" },
    { title: "RCPCH/UpToDate: Acute Glomerulonephritis in Children", url: "https://www.uptodate.com/contents/poststreptococcal-glomerulonephritis-in-children" }
  ]
};
