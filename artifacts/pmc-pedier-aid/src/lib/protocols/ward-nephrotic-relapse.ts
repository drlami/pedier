import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const wardNephroticRelapseProtocol: DiseaseProtocol = {
  id: 'ward-nephrotic-relapse',
  name: 'Ward: Nephrotic Syndrome (Relapse)',
  system: 'Renal & Urinary System',
  unit: 'ward',
  description: 'Inpatient management of relapsing nephrotic syndrome, focusing on steroid-sparing agents and complication management.',
  image: {
    url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "edema"
  },
  questions: [
    { id: 'weight', questionText: 'Current Weight', type: 'number', unit: 'kg' },
    { id: 'relapseFrequency', questionText: 'Frequency of relapses', type: 'select', options: [
      { label: 'Infrequent (<2 in 6 months)', value: 'infrequent' },
      { label: 'Frequent (>=2 in 6 months)', value: 'frequent' },
      { label: 'Steroid Dependent', value: 'dependent' },
    ]},
    { id: 'currentMeds', questionText: 'Current Maintenance Meds', type: 'select', options: [
      { label: 'None (Steroid only)', value: 'none' },
      { label: 'Levamisole', value: 'levamisole' },
      { label: 'Cyclophosphamide', value: 'cyclophosphamide' },
      { label: 'Cyclosporine/Tacrolimus', value: 'cni' },
      { label: 'Mycophenolate (MMF)', value: 'mmf' },
    ]},
    { id: 'fever', questionText: 'Presence of fever or infection?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    if (data.fever === true) {
      return { level: 'severe', details: ["High risk due to concurrent infection triggering relapse."] };
    }
    return { level: 'moderate', details: ["Standard relapse management."] };
  },
  getManagement: (severity: Severity, data: FormData) => {
    const mgmt = [
      {
        title: "Relapse Steroid Protocol",
        recommendations: [
          "Prednisolone: 60 mg/m²/day (Max 60mg) until protein-free for 3 consecutive days.",
          "Then 40 mg/m² on alternate days for 4 weeks.",
          "If frequently relapsing, consider continuing alternate-day steroids at lowest effective dose (0.15-0.5 mg/kg)."
        ]
      }
    ];

    if (data.relapseFrequency === 'frequent' || data.relapseFrequency === 'dependent') {
      mgmt.push({
        title: "Steroid-Sparing Strategies",
        recommendations: [
          "Ensure compliance with current maintenance medications.",
          "Review indication for Cyclophosphamide (usually 2 mg/kg for 8-12 weeks) during a period of remission.",
          "Monitor CNI levels (Tacrolimus/Cyclosporine) if applicable; target trough levels might need adjustment.",
          "Consider Rituximab for multi-relapsing/dependent cases (Nephrology decision)."
        ]
      });
    }

    mgmt.push({
      title: "Complication Management",
      recommendations: [
        "Thrombosis: Nephrotic patients are hypercoagulable. Avoid femoral lines and promote mobilization.",
        "Infection: Viral infections often trigger relapses. Treat underlying infection to achieve remission.",
        "Immunization: Give Pneumococcal and annual Influenza vaccines. Avoid live vaccines while on high-dose steroids."
      ]
    });

    return mgmt;
  },
  getDisposition: (severity: Severity, data: FormData) => {
    return [
      "Clinically stable with no severe edema/hypovolemia.",
      "Medication plan (including steroid taper) clearly documented.",
      "Parent understands the plan for the next 4-8 weeks.",
      "Next CNI level or blood count check (for MMF/Cyclo) scheduled."
    ];
  },
  getRedFlags: () => [
    "Signs of deep vein thrombosis or pulmonary embolism.",
    "Severe steroid side effects (psychosis, severe gastric pain).",
    "Evidence of acute kidney injury (creatinine rise).",
    "Uncontrolled hypertension."
  ],
  getDrugDoses: (severity: Severity, data: FormData): DrugDose[] => {
    const weight = Number(data.weight || 0);
    if (!weight) return [];
    return [
      { drugName: "Prednisolone (Relapse)", dose: `${(weight * 2).toFixed(0)} mg Daily (until urine clear x3 days)` },
      { drugName: "Levamisole", dose: `${(weight * 2.5).toFixed(1)} mg Alternate days (Max 150mg)` },
      { drugName: "Mycophenolate (MMF)", dose: `${(weight * 15).toFixed(0)} mg Twice daily (1200mg/m²/day)` },
    ];
  },
  getReferences: () => [
    { title: "IPNA Recommendations: Management of Relapsing Nephrotic Syndrome", url: "https://pubmed.ncbi.nlm.nih.gov/35503463/" }
  ]
};
