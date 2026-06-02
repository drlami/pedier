import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Hypertension (HTN) Master Pathway
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: AAP Clinical Practice Guideline (2017) and ESPN Guidelines.
 */
export const wardHypertensionProtocol: DiseaseProtocol = {
  id: 'ward-hypertension-master',
  name: 'Hypertension Master Pathway',
  system: 'Cardiovascular System',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Pediatric Hypertension management requires a high-precision approach to balance blood pressure reduction with the prevention of cerebral hypoperfusion. This pathway details the distinct management of Hypertensive Urgency (oral titration) and Hypertensive Emergency (IV titration in PICU), including clear escalation logic from first-line to second-line therapies.',
  image: {
    url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Blood pressure and vascular monitoring"
  },
  questions: [
    { id: 'weight', questionText: 'Current Body Weight', type: 'number', unit: 'kg' },
    { id: 'age', questionText: 'Age (Years)', type: 'number' },
    { id: 'sbp', questionText: 'Systolic BP (mmHg)', type: 'number' },
    { id: 'dbp', questionText: 'Diastolic BP (mmHg)', type: 'number' },
    { id: 'symptoms', questionText: 'Headache/Vision Changes/Vomiting/Seizures', type: 'boolean' },
  ], 

  mmpData: {
    snapshot: "CRITICAL SAFETY: In chronic hypertension, cerebral autoregulation is shifted. Rapid BP reduction can cause stroke. Target: Reduce MAP by ~25% over 24-48 hours. Shift from Oral to IV (Emergency) ONLY if end-organ damage (neurological/cardiac/renal) is present. Shift from 1st to 2nd line oral agents if target reduction is not achieved within 6-12 hours of maximum 1st line dosing.",
    stages: [
      {
        label: "Stage 1: Classification & Escalation Logic",
        shortLabel: "Classification",
        color: "blue",
        cards: [
          {
            title: "Treatment Selection Logic [DR]",
            threshold: "DECISION POINT",
            orders: [
              "Hypertensive Urgency: SBP/DBP > 95th centile + 30 mmHg WITHOUT acute symptoms. Start ORAL pathway.",
              "Hypertensive Emergency: Severe BP elevation WITH acute end-organ damage (Encephalopathy, Heart Failure, Pulmonary Edema, Acute Renal Failure). Start IV pathway in PICU.",
              "Escalation Rule (Oral): If MAP does not drop by 10-15% within 6-8 hours of the first dose, add a second agent from a different class.",
              "Shift to IV Rule: If the patient develops any new neurological symptoms (headache, vomiting, vision loss) while on oral therapy, escalate to IV immediately and transfer to PICU."
            ]
          },
          {
            title: "Nursing: BP Measurement Standards [NS]",
            isCritical: true,
            nursing: [
              "Confirm with Manual BP: Machine readings must be verified manually with a stethoscope.",
              "Cuff Selection: The bladder must encircle 80-100% of the arm; width must be 40% of mid-arm circumference.",
              "Monitoring Frequency (Urgency): Q1H for first 4 hours, then Q4H if stable.",
              "Monitoring Frequency (Emergency/IV): Continuous arterial line is the standard."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Management of Hypertensive Urgency (Oral)",
        shortLabel: "Urgency (Oral)",
        color: "amber",
        cards: [
          {
            title: "1st Line: Calcium Channel Blockers (CCB)",
            threshold: "PREFERRED INITIAL AGENT",
            orders: [
              "Amlodipine: Standard for long-term control. Slow onset (6-12 hours).",
              "Isradipine: Preferred for more rapid oral titration in urgency.",
              "Dosing (Amlodipine): 0.1 to 0.2 mg/kg/day once daily. Max 10 mg."
            ],
            prescriptions: [
              {
                drug: "Amlodipine",
                dose: "0.1 mg/kg/day",
                route: "PO",
                frequency: "Daily",
                calculation: (w) => `${(w * 0.1).toFixed(1)} mg`,
                notes: "Titrate every 24-48 hours."
              }
            ]
          },
          {
            title: "2nd Line / Rapid Urgency: Vasodilators",
            threshold: "ADD IF CCB INSUFFICIENT",
            orders: [
              "Hydralazine (Oral): Use if more rapid reduction is needed than CCB provides. Onset 30-60 mins.",
              "Dosing: 0.25 mg/kg per dose (Max 25mg) every 6 hours.",
              "Shift Logic: If BP remains above Stage 2 threshold after 2 doses of Hydralazine + max CCB, consult Senior for IV transition."
            ],
            prescriptions: [
              {
                drug: "Hydralazine (Oral)",
                dose: "0.25 mg/kg/dose",
                route: "PO",
                frequency: "Q6H",
                calculation: (w) => `${(w * 0.25).toFixed(1)} mg`,
                notes: "Rapid onset oral agent for urgency."
              }
            ]
          },
          {
            title: "BP Safety Targets",
            calculator: {
              id: "bp-safety-calc",
              title: "BP Safety & Target Calculator"
            }
          }
        ]
      },
      {
        label: "Stage 3: Hypertensive Emergency (IV Titration)",
        shortLabel: "Emergency (IV)",
        color: "red",
        cards: [
          {
            title: "Hypertensive Encephalopathy Protocol",
            threshold: "IMMEDIATE PICU TRANSFER",
            isCritical: true,
            orders: [
              "Goal: Controlled BP reduction using TITRATABLE IV infusions.",
              "1st Choice: Labetalol (Avoid in Asthma/Heart Failure) or Nicardipine.",
              "2nd Choice: Sodium Nitroprusside (requires expert management/cyanide monitoring)."
            ]
          },
          {
            title: "IV Medication Infusion Dosing [DR]",
            orders: [
              "Labetalol IV: 0.2 to 1.0 mg/kg bolus (Max 40mg). May repeat every 10 mins OR start infusion at 0.25-2.0 mg/kg/hr.",
              "Nicardipine IV: Start at 0.5 mcg/kg/min. Titrate by 0.5 mcg every 15-30 mins until target MAP reduction achieved.",
              "Hydralazine IV: 0.1 to 0.2 mg/kg per dose (Max 20mg) every 4 hours."
            ],
            prescriptions: [
              {
                drug: "Labetalol (IV Bolus)",
                dose: "0.2 mg/kg",
                route: "IV",
                frequency: "STAT (Repeat as needed)",
                calculation: (w) => `${(w * 0.2).toFixed(1)} mg`,
                notes: "Give over 2-3 minutes. Monitor HR and BP closely."
              },
              {
                drug: "Nicardipine (Infusion)",
                dose: "0.5 mcg/kg/min",
                route: "IV Infusion",
                frequency: "Continuous",
                calculation: (w) => `${(w * 0.5).toFixed(1)} mcg/min`,
                notes: "Preferred for precise titration. Requires Central Line or Large Peripheral."
              }
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data) => {
    if (data.symptoms) return { level: 'critical', details: ["Hypertensive Emergency: Symptoms of encephalopathy or heart failure present. Urgent PICU transfer and IV medication titration required."] };
    const sbp = Number(data.sbp);
    if (sbp > 160) return { level: 'severe', details: ["Severe Hypertension (Urgency): MAP reduction of 25% over 24-48h required using oral agents."] };
    return { level: 'moderate', details: ["Hypertension: Classify based on centiles; initiate oral therapy if Stage 1/2."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Blood pressure consistently < 95th centile for > 24 hours on fixed-dose oral medications.",
    "No evidence of acute end-organ damage (normal Neurological exam, Renal function, and Fundoscopy).",
    "Transition from IV to Oral medications successfully completed without rebound hypertension.",
    "Standardized diagnostic workup for secondary hypertension initiated (Renal US, Plasma Renin, Echocardiogram)."
  ],
  getRedFlags: [
    "New onset Focal Neurological Deficits (Stroke)",
    "Seizures or status epilepticus",
    "Acute Pulmonary Edema (Pink frothy sputum, crackles)",
    "Sudden vision loss or papilledema",
    "Oliguria / Hematuria (Acute Kidney Injury)"
  ],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "AAP CPG: Screening and Management of High Blood Pressure in Children", url: "https://publications.aap.org/pediatrics/article/140/3/e20171903/38257/Clinical-Practice-Guideline-for-Screening-and" },
    { title: "ESPN: Management of Hypertensive Crisis in Children", url: "https://pubmed.ncbi.nlm.nih.gov/30607567/" },
    { title: "RCH Melbourne: Hypertension Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/Hypertension/" }
  ],
};
