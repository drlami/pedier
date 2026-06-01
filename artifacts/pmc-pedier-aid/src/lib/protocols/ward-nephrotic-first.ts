import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const wardNephroticFirstProtocol: DiseaseProtocol = {
  id: 'ward-nephrotic-first',
  name: 'Ward: Nephrotic Syndrome (First Episode)',
  system: 'Renal & Urinary System',
  unit: 'ward',
  description: 'Inpatient management for the initial presentation of Minimal Change Disease/Nephrotic Syndrome.',
  image: {
    url: "https://images.unsplash.com/photo-1579154235602-3c2c2aa5d72f?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "edema"
  },
  questions: [
    { id: 'weight', questionText: 'Current Weight (Edematous)', type: 'number', unit: 'kg' },
    { id: 'baselineWeight', questionText: 'Baseline/Dry Weight (if known)', type: 'number', unit: 'kg' },
    { id: 'edemaSeverity', questionText: 'Edema Severity', type: 'select', options: [
      { label: 'Mild (Periorbital only)', value: 'mild' },
      { label: 'Moderate (Pitting, scrotal/labial)', value: 'moderate' },
      { label: 'Severe (Anasarca, ascites, respiratory distress)', value: 'severe' },
    ]},
    { id: 'bloodPressure', questionText: 'Blood Pressure Status', type: 'select', options: [
      { label: 'Normal', value: 'normal' },
      { label: 'High (>95th percentile)', value: 'high' },
    ]},
    { id: 'urineProtein', questionText: 'Urine Dipstick Protein', type: 'select', options: [
      { label: '3+ or 4+', value: 'heavy' },
      { label: 'Trace to 2+', value: 'low' },
      { label: 'Negative', value: 'nil' },
    ]},
  ],
  calculateSeverity: (data: FormData): Severity => {
    if (data.edemaSeverity === 'severe' || data.bloodPressure === 'high') {
      return { level: 'severe', details: ["High risk due to severe edema or hypertension."] };
    }
    return { level: 'moderate', details: ["Initial episode monitoring."] };
  },
  getManagement: (severity: Severity, data: FormData) => {
    const mgmt = [
      {
        title: "Standard Steroid Therapy (ISKDC Protocol)",
        recommendations: [
          "Prednisolone: 60 mg/m²/day (Max 60mg) daily for 4-6 weeks.",
          "Then 40 mg/m² on alternate days for another 4-6 weeks.",
          "Ensure parent education on 'Steroid Response' (diuresis usually occurs within 7-14 days)."
        ]
      },
      {
        title: "Edema & Fluid Management",
        recommendations: [
          "Strict No-Added-Salt diet.",
          "Fluid restriction (Insensible losses + 2/3 urine output) only if severe edema.",
          "Daily Weight (at same time, same scale) is mandatory.",
          "Monitor for hypovolemia (abdominal pain, cold peripheries) even if edematous."
        ]
      }
    ];

    if (data.edemaSeverity === 'severe') {
      mgmt.push({
        title: "Albumin & Diuretics",
        recommendations: [
          "Consider 20% Albumin (0.5 - 1 g/kg) over 4-6 hours.",
          "Give Furosemide (0.5 - 1 mg/kg) mid-infusion or at the end.",
          "WARNING: Monitor BP and HR closely for overload during infusion."
        ]
      });
    }

    mgmt.push({
      title: "Infection Prophylaxis & Screening",
      recommendations: [
        "Screen for TB (Mantoux/Quantiferon) before starting high-dose steroids.",
        "Check Varicella immunity status.",
        "Promptly treat any minor infection (risk of peritonitis/cellulitis is high)."
      ]
    });

    return mgmt;
  },
  getDisposition: (severity: Severity, data: FormData) => {
    return [
      "Edema is stable or improving.",
      "Stable blood pressure.",
      "Parents can perform home urine dipsticks and maintain a log.",
      "Follow-up with Pediatric Nephrology scheduled within 1 week.",
      "Education provided on 'No-Added-Salt' and steroid side effects."
    ];
  },
  getRedFlags: () => [
    "Severe abdominal pain (think Spontaneous Bacterial Peritonitis).",
    "Symptoms of hypovolemic shock (despite looking 'full' of fluid).",
    "Headache, vomiting, or seizures (think Hypertension/Thrombosis).",
    "Fever (increased risk of encapsulated bacterial infections)."
  ],
  getDrugDoses: (severity: Severity, data: FormData): DrugDose[] => {
    const weight = Number(data.weight || 0);
    if (!weight) return [];
    return [
      { drugName: "Prednisolone (Initial)", dose: `${(weight * 2).toFixed(0)} mg Daily (Max 60mg)` },
      { drugName: "Furosemide (IV/Oral)", dose: `${(weight * 1).toFixed(0)} mg Twice daily` },
      { drugName: "20% Albumin", dose: `${(weight * 2.5).toFixed(0)} mL Over 4 hours (0.5g/kg)` },
    ];
  },
  getReferences: () => [
    { title: "KDIGO Guideline for the Management of Glomerular Diseases", url: "https://kdigo.org/guidelines/glomerular-diseases/" },
    { title: "IPNA Clinical Practice Recommendations: Steroid-Sensitive Nephrotic Syndrome", url: "https://pubmed.ncbi.nlm.nih.gov/32185568/" }
  ]
};
