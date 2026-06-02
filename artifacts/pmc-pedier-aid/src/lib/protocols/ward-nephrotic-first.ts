import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

/**
 * Pediatric Ward: Nephrotic Syndrome (First Episode)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: KDIGO (2021) and IPNA Clinical Practice Recommendations (2022).
 */
export const wardNephroticFirstProtocol: DiseaseProtocol = {
  id: 'ward-nephrotic-first',
  name: 'Nephrotic Syndrome Master Pathway (Initial)',
  system: 'Renal & Urinary System',
  unit: 'ward',
  description: 'Nephrotic Syndrome is characterized by the triad of heavy proteinuria (> 40 mg/m²/hr), hypoalbuminemia (< 25 g/L), and generalized edema. This roadmap covers induction steroids and precise fluid/edema management for the first episode.',
  image: {
    url: "https://images.unsplash.com/photo-1579154235602-3c2c2aa5d72f?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Generalized edema and nephrotic syndrome management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Weight (Edematous)', type: 'number', unit: 'kg' },
    { id: 'severeEdema', questionText: 'Severe edema (Anasarca, SOB, or scrotal/labial edema)?', type: 'boolean' },
    { id: 'hypertensive', questionText: 'Blood Pressure > 95th percentile?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Induction centers on high-dose Prednisolone (2 mg/kg). Edema management is secondary; avoid aggressive diuresis which may worsen intravascular depletion. Monitor urine output (UO) and report oliguria (< 0.5 mL/kg/hr) early.",
    stages: [
      {
        label: "Stage 1: Diagnosis & Baseline Orders (Hour 0-12)",
        shortLabel: "Diagnosis",
        color: "blue",
        cards: [
          {
            title: "Urine Output Monitoring",
            orders: [
              "Oliguria: < 0.5 mL/kg/hr.",
              "Report Anuria (< 0.2 mL/kg/hr) immediately - may indicate acute renal failure or severe depletion.",
              "Goal: Maintain UO > 1.0 mL/kg/hr without excessive diuretic use."
            ]
          },
          {
            title: "Confirming Nephrotic Triad",
            orders: [
              "Urine Dipstick: Confirm 3+ or 4+ protein.",
              "Spot Urine Protein:Creatinine Ratio (uPCR).",
              "Serum Albumin: Characteristically < 25 g/L.",
              "Lipid Profile: Expected Hypercholesterolemia."
            ]
          },
          {
            title: "Baseline Clinical Screening",
            threshold: "MANDATORY BEFORE STEROIDS",
            orders: [
              "Mantoux or Quantiferon (TB Screening).",
              "Varicella Serology (if no clear history/vaccination).",
              "U&E/Creatinine, C3/C4, and CBC.",
              "Blood Pressure monitoring (manual cuff preferred)."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Induction Immunosuppression",
        shortLabel: "Induction",
        color: "amber",
        cards: [
          {
            title: "Standard Steroid Regimen",
            threshold: "ISKDC / KDIGO PROTOCOL",
            orders: [
              "Prednisolone: 60 mg/m²/day (Max 60mg) or 2 mg/kg/day daily.",
              "Continue daily for 4-6 weeks.",
              "Warn parents about 'steroid personality' (hunger, mood swings)."
            ],
            prescriptions: [
              {
                drug: "Prednisolone",
                dose: "2 mg/kg",
                route: "Oral",
                frequency: "Once daily (Morning)",
                calculation: (w) => `${(2 * w).toFixed(0)} mg`,
                notes: "Maximum 60mg daily."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 3: Edema & Fluid Titration",
        shortLabel: "Fluid Management",
        color: "red",
        cards: [
          {
            title: "Nursing Care: Fluid Balance [NS]",
            nursing: [
              "Daily weight at same time each morning.",
              "Strict intake/output balance.",
              "No-Added-Salt (NAS) diet.",
              "Abdominal girth measurement (if ascites present)."
            ]
          },
          {
            title: "Hypervolemia: Albumin & Diuretics",
            threshold: "ONLY IF SYMPTOMATIC EDEMA",
            orders: [
              "Albumin 20% (0.5 - 1 g/kg) over 4-6 hours.",
              "Furosemide (0.5 - 1 mg/kg) given mid-infusion.",
              "Monitor for pulmonary edema and acute hypertension during infusion."
            ],
            prescriptions: [
              {
                drug: "20% Albumin",
                dose: "0.5 g/kg",
                route: "IV",
                frequency: "Over 4 hours",
                calculation: (w) => `${(2.5 * w).toFixed(0)} mL`,
                notes: "500mg/kg = 2.5mL/kg of 20% albumin."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 4: Remission & Home Training",
        shortLabel: "Home Care",
        color: "emerald",
        cards: [
          {
            title: "Parent Educational Check",
            instructions: [
              "1. Dipstick training: How to test the first morning urine.",
              "2. Home log: Recording weight, dipstick result, and steroid dose.",
              "3. Relapse Definition: 3+ protein for 3 consecutive days.",
              "4. Vaccine warning: No LIVE vaccines while on high-dose steroids."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.severeEdema === true || data.hypertensive === true) {
      return { level: 'critical', details: ["Severe complications (respiratory distress or high BP) detected."] };
    }
    return { level: 'moderate', details: ["Routine first-episode nephrotic syndrome."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Edema stable or improving.",
    "Parent competent in home dipstick testing and logging.",
    "Steroid plan (4-6 weeks daily) clear.",
    "Nephrology follow-up booked (usually 1 week)."
  ],
  getRedFlags: () => ["Severe abdominal pain (SBP risk)", "Cold peripheries (Hypovolemia)", "Sudden weight gain", "Headache/Seizure"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "KDIGO 2021 Guideline for Glomerular Diseases", url: "https://kdigo.org/guidelines/glomerular-diseases/" },
    { title: "IPNA Recommendations for Steroid-Sensitive Nephrotic Syndrome", url: "https://pubmed.ncbi.nlm.nih.gov/32185568/" }
  ]
};
