import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const wardUtiProtocol: DiseaseProtocol = {
  id: 'ward-uti',
  name: 'Ward: UTI & Pyelonephritis',
  system: 'Nephrology',
  description: 'Inpatient management of pediatric Urinary Tract Infection and Pyelonephritis, focusing on IV-to-oral transition and imaging workflows.',
  image: {
    url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "kidney"
  },
  questions: [
    { id: 'age', questionText: 'Patient Age', type: 'number', unit: 'months' },
    { id: 'weight', questionText: 'Weight', type: 'number', unit: 'kg' },
    { id: 'feverDuration', questionText: 'Hours of fever since admission/antibiotics', type: 'number', unit: 'hrs' },
    { id: 'clinicalState', questionText: 'Clinical Status', type: 'select', options: [
      { label: 'Improving (Active, feeding well)', value: 'improving' },
      { label: 'Stable (Mild symptoms)', value: 'stable' },
      { label: 'Unstable (Vomiting, high fever, toxic)', value: 'unstable' },
    ]},
    { id: 'imagingDone', questionText: 'Renal Ultrasound Performed?', type: 'boolean' },
    { id: 'imagingResult', questionText: 'Any structural abnormality/hydronephrosis on US?', type: 'boolean' },
    { id: 'firstUti', questionText: 'Is this the first documented UTI?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    if (data.clinicalState === 'unstable' || (data.age && Number(data.age) < 3)) {
      return { level: 'critical', details: ["High risk due to age or clinical instability."] };
    }
    if (data.imagingResult === true || (data.feverDuration && Number(data.feverDuration) > 48)) {
      return { level: 'severe', details: ["Moderate risk: potential structural issues or persistent fever."] };
    }
    return { level: 'moderate', details: ["Stable inpatient course."] };
  },
  getManagement: (severity: Severity, data: FormData) => {
    const age = Number(data.age || 0);
    const mgmt = [
      {
        title: "Monitoring",
        recommendations: [
          "Record temperature and heart rate 4-6 hourly.",
          "Strict input/output monitoring (ensure no oliguria).",
          "Check for flank pain/tenderness daily.",
          "Repeat CRP if fever persists > 48 hours."
        ]
      }
    ];

    if (data.clinicalState === 'unstable' || age < 3) {
      mgmt.push({
        title: "Initial IV Management",
        recommendations: [
          "Maintain IV hydration if vomiting or poor intake.",
          "Continue IV Antibiotics (Ceftriaxone or Gentamicin/Ampicillin).",
          "Blood culture is mandatory for neonates/toxic patients."
        ]
      });
    } else if (data.clinicalState === 'improving' && Number(data.feverDuration) >= 24) {
      mgmt.push({
        title: "IV to Oral Transition",
        recommendations: [
          "Patient is suitable for oral antibiotics if afebrile for > 24h and tolerating oral intake.",
          "Choice: Cefixime (8-10 mg/kg/day) or Co-amoxiclav (45 mg/kg/day).",
          "Total duration (IV + Oral) should be 7-10 days."
        ]
      });
    }

    mgmt.push({
      title: "Imaging Workflow (AAP/NICE)",
      recommendations: [
        "Renal Ultrasound: Required for all infants < 6 months with first UTI.",
        "Renal Ultrasound: Consider for children > 6 months if atypical or recurrent UTI.",
        "MCUG: Indicated if US shows hydronephrosis, scarring, or if UTI is recurrent/atypical in < 6 months old.",
        "DMSA: Perform 4-6 months after acute infection to detect scarring (if recurrent UTI)."
      ]
    });

    return mgmt;
  },
  getDisposition: (severity: Severity, data: FormData) => {
    return [
      "Afebrile for at least 24 hours.",
      "Clinically stable and tolerating oral fluids/antibiotics.",
      "Follow-up for imaging (Ultrasound) scheduled if not done.",
      "Parents educated on urine collection and signs of recurrence.",
      "Culture results reviewed and antibiotics narrowed if possible."
    ];
  },
  getRedFlags: () => [
    "Persistent fever > 48 hours on appropriate antibiotics.",
    "Palpable abdominal mass (possible hydronephrosis/abscess).",
    "Rising creatinine or worsening clinical toxicity.",
    "Poor urinary stream in males (suggests PUV)."
  ],
  getDrugDoses: (severity: Severity, data: FormData): DrugDose[] => {
    const weight = Number(data.weight || 0);
    if (!weight) return [];
    return [
      { drugName: "Ceftriaxone (IV)", dose: `${(weight * 75).toFixed(0)} mg Once daily (Max 2g)` },
      { drugName: "Gentamicin (IV)", dose: `${(weight * 7.5).toFixed(1)} mg Once daily (Monitor levels)` },
      { drugName: "Cefixime (Oral)", dose: `${(weight * 8).toFixed(1)} mg Once daily` },
      { drugName: "Co-amoxiclav (Oral)", dose: `${(weight * 22.5).toFixed(0)} mg Every 12 hours` },
    ];
  },
  getReferences: () => [
    { title: "AAP: Management of UTI in Infants and Children (2011/2016 Update)", url: "https://publications.aap.org/pediatrics/article/128/3/595/30815/Urinary-Tract-Infection-Clinical-Practice" },
    { title: "NICE Guideline: UTI in under 16s", url: "https://www.nice.org.uk/guidance/ng224" }
  ]
};
