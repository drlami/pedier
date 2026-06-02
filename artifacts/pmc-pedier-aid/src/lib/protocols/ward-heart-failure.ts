import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Congestive Heart Failure (CHF) Exacerbation
 * MASTER MANAGEMENT PATHWAY (MMP)
 */
export const wardHeartFailureProtocol: DiseaseProtocol = {
  id: 'ward-heart-failure',
  name: 'Heart Failure Master Pathway',
  system: 'Cardiovascular System',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Congestive Heart Failure (CHF) in children often results from congenital heart disease, cardiomyopathy, or myocarditis. Acute exacerbations require aggressive volume management and careful titration of afterload-reducing agents. Management centers on balancing preload reduction with maintaining systemic perfusion.',
  image: {
    url: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Cardiac clinical management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Body Weight', type: 'number', unit: 'kg' },
    { id: 'hr', questionText: 'Heart Rate', type: 'number', unit: 'bpm' },
    { id: 'rr', questionText: 'Respiratory Rate', type: 'number', unit: 'bpm' },
    { id: 'liver', questionText: 'Liver Size (below costal margin)', type: 'number', unit: 'cm' },
  ], 

  mmpData: {
    snapshot: "Management centers on aggressive diuresis and strict fluid restriction to relieve pulmonary and systemic congestion. Monitor daily weights and liver size closely as clinical indicators of volume status. ACE inhibitors are the mainstay of chronic afterload reduction and should be titrated to the maximum tolerated dose without causing hypotension or renal impairment.",
    stages: [
      {
        label: "Stage 1: Acute Decongestion & Volume Control",
        shortLabel: "Decongestion",
        color: "blue",
        cards: [
          {
            title: "Volume Management Strategy [DR]",
            threshold: "IMMEDIATE ACTION",
            calculator: {
              id: "chf-management-calc",
              title: "CHF Fluid & Diuretic Calculator"
            },
            orders: [
              "Strict Fluid Restriction: Restrict to 2/3 (66%) of Maintenance fluids.",
              "IV Diuresis: Furosemide 1-2 mg/kg per dose IV every 6-12 hours depending on severity.",
              "Monitor Response: Goal is negative fluid balance and weight loss of 0.5-1% daily until dry weight achieved.",
              "Oxygen: Maintain SpO2 > 94%. Consider CPAP/BiPAP if pulmonary edema is severe."
            ]
          },
          {
            title: "Nursing: Strict Monitoring [NS]",
            isCritical: true,
            nursing: [
              "Strict Intake & Output (I/O) recording.",
              "Daily Weight at the same time every morning using the same scale.",
              "Twice daily measurement of liver size (cm below right costal margin).",
              "Continuous Pulse Oximetry and frequent Blood Pressure checks."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Chronic Optimization (Transition to PO)",
        shortLabel: "Optimization",
        color: "amber",
        cards: [
          {
            title: "Afterload Reduction: ACE Inhibitors",
            orders: [
              "Captopril (Infants): 0.1 mg/kg/dose TDS; increase slowly to 0.5-1.0 mg/kg/dose.",
              "Enalapril (Older Children): 0.1 mg/kg once or twice daily.",
              "Precautions: Check Renal Function and Potassium 48 hours after starting or increasing dose.",
              "Target BP: Aim for BP between 50th and 90th centile for age."
            ],
            prescriptions: [
              {
                drug: "Captopril",
                dose: "0.1 mg/kg/dose",
                route: "PO",
                frequency: "TDS",
                calculation: (w) => `${(w * 0.1).toFixed(1)} mg`,
                notes: "Titrate slowly based on Blood Pressure and Renal Function."
              }
            ]
          },
          {
            title: "Inotropic Support / Beta-Blockers",
            orders: [
              "Beta-blockers (e.g., Carvedilol): Start ONLY when patient is euvolemic (dry). Never start during acute decompensation.",
              "Digoxin: Consider for chronic management of dilated cardiomyopathy or specific arrhythmias."
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
            title: "Senior Triggers [!]",
            isCritical: true,
            triggers: [
              "IF Hepatomegaly is increasing despite diuresis.",
              "IF Serum Creatinine rises > 30% from baseline or Hyperkalemia develops.",
              "IF Patient has cold peripheries, prolonged capillary refill, or dropping GCS (Low Cardiac Output Syndrome).",
              "IF Arrhythmias (new-onset Tachycardia/Bradycardia) are detected."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data) => {
    const rr = Number(data.rr);
    const liver = Number(data.liver);
    if (rr > 60 || liver > 4) return { level: 'critical', details: ["Severe CHF Exacerbation: High risk of cardiogenic shock. Cardiology/ICU consult required."] };
    if (rr > 40 || liver > 2) return { level: 'severe', details: ["Moderate CHF: Requires strict 2/3 maintenance and IV diuresis."] };
    return { level: 'moderate', details: ["Mild CHF: Monitor response to diuretics."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Patient at 'dry weight' with no respiratory distress.",
    "Tolerating maximum oral medical regimen (ACEi/Diuretics).",
    "Renal function and electrolytes are stable.",
    "Cardiology follow-up and Echocardiogram scheduled."
  ],
  getRedFlags: [
    "Gallop rhythm (S3)",
    "Hepatomegaly (> 3cm)",
    "Tachypnea and grunting",
    "Delayed capillary refill (> 3 seconds)",
    "Orthopnea (refusing to lie flat)"
  ],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "AHA: Management of Heart Failure in Children", url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000000636" },
    { title: "RCH Melbourne: Heart Failure in Children", url: "https://www.rch.org.au/clinicalguide/guideline_index/Heart_failure_in_children/" }
  ],
};
