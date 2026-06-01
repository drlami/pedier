import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const wardHusProtocol: DiseaseProtocol = {
  id: 'ward-hus',
  name: 'Ward: Hemolytic Uremic Syndrome (HUS)',
  system: 'Renal & Urinary System',
  unit: 'ward',
  description: 'Inpatient management of the classic triad: Microangiopathic Hemolytic Anemia, Thrombocytopenia, and AKI.',
  image: {
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "blood-cell"
  },
  questions: [
    { id: 'weight', questionText: 'Current Weight', type: 'number', unit: 'kg' },
    { id: 'prodrome', questionText: 'Diarrheal Prodrome present?', type: 'boolean' },
    { id: 'hemoglobin', questionText: 'Hemoglobin level', type: 'number', unit: 'g/dL' },
    { id: 'platelets', questionText: 'Platelet count', type: 'number', unit: 'x10^9/L' },
    { id: 'urineOutput', questionText: 'Urine Output Status', type: 'select', options: [
      { label: 'Normal', value: 'normal' },
      { label: 'Oliguric/Anuric', value: 'low' },
    ]},
    { id: 'neuroSymptoms', questionText: 'Any neurological symptoms (Seizures/Altered MS)?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    if (data.neuroSymptoms === true || data.urineOutput === 'low') {
      return { level: 'critical', details: ["Neurological symptoms or anuria present."] };
    }
    return { level: 'severe', details: ["High risk for severe anemia or clinical progression."] };
  },
  getManagement: (severity: Severity, data: FormData) => {
    const mgmt = [
      {
        title: "Fluid & Electrolyte Support (Highest Priority)",
        recommendations: [
          "Early aggressive hydration during the diarrheal phase may prevent/lessen AKI.",
          "Once AKI is established: Restrict fluids to Insensible + Urine Output.",
          "Avoid nephrotoxic agents.",
          "Monitor electrolytes (especially Potassium) q8-12 hours."
        ]
      },
      {
        title: "Hematological Management",
        recommendations: [
          "Transfusion (Packed RBCs): Only if Hb < 6-7 g/dL or symptomatic anemia.",
          "Platelet Transfusion: GENERALLY AVOIDED (may worsen microthrombosis) unless active severe bleeding or before procedure.",
          "Monitor daily CBC, Smear (Schistocytes), and LDH."
        ]
      }
    ];

    mgmt.push({
      title: "Antibiotics & Anti-motility Agents",
      recommendations: [
        "AVOID anti-motility agents (e.g., Loperamide) as they increase toxin exposure.",
        "Antibiotics for E. coli O157:H7 are controversial and generally avoided (may increase toxin release)."
      ]
    });

    if (data.neuroSymptoms === true) {
      mgmt.push({
        title: "Neurological Monitoring",
        recommendations: [
          "Frequent GCS and pupil checks.",
          "Low threshold for CT Head if altered consciousness.",
          "Manage seizures as per Status Epilepticus protocol."
        ]
      });
    }

    return mgmt;
  },
  getDisposition: (severity: Severity, data: FormData) => {
    return [
      "Discharge only after renal function stabilizes and diuresis is robust.",
      "Long-term follow-up (years) is required for all HUS survivors.",
      "Monitor for late-onset hypertension and proteinuria."
    ];
  },
  getRedFlags: () => [
    "Sudden neurological deterioration.",
    "Severe abdominal pain (risk of bowel perforation/necrosis).",
    "Intractable hyperkalemia or fluid overload.",
    "Active severe bleeding."
  ],
  getDrugDoses: (severity: Severity, data: FormData): DrugDose[] => {
    const weight = Number(data.weight || 0);
    if (!weight) return [];
    return [
      { drugName: "Packed RBCs (if Hb < 7)", dose: `${(weight * 10).toFixed(0)} mL IV Over 4 hours` },
    ];
  },
  getReferences: () => [
    { title: "PedsQL: Management of Hemolytic Uremic Syndrome", url: "https://pubmed.ncbi.nlm.nih.gov/28551731/" }
  ]
};
