import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Acute Nephritic Syndrome
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: KDIGO (2021) and Melbourne RCH Guidelines
 */
export const wardNephriticSyndromeProtocol: DiseaseProtocol = {
  id: 'ward-nephritic-syndrome',
  name: 'Acute Nephritic Syndrome Master Pathway',
  system: 'Renal & Urinary System',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Acute Nephritic Syndrome is a clinical syndrome characterized by the sudden onset of hematuria, proteinuria, hypertension, and edema, often accompanied by a reduction in glomerular filtration rate. This exhaustive directive covers the management of Post-Streptococcal Glomerulonephritis and other acute glomerulonephritides, focusing on blood pressure control and fluid balance.',
  image: {
    url: "https://images.unsplash.com/photo-1579154235602-3c2c2aa5d72f?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Hypertension and hematuria management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'hypertension', questionText: 'Blood Pressure above the 95th percentile?', type: 'boolean' },
    { id: 'reducedOutput', questionText: 'Urine Output less than 0.5 mL/kg/hour?', type: 'boolean' },
    { id: 'respiratoryDistress', questionText: 'Signs of fluid overload (Shortness of breath/Crackles)?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Management centers on the 'Three Pillars': (1) Aggressive Blood Pressure control to prevent hypertensive encephalopathy, (2) Strict fluid restriction to manage edema and circulatory overload, and (3) Monitoring for Acute Kidney Injury. In Post-Streptococcal cases, the prognosis is excellent, but clinicians must exclude more aggressive glomerulonephritides if complement levels remain low beyond 8 weeks.",
    stages: [
      {
        label: "Stage 1: Diagnosis & Volume Assessment",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "The Nephritic Triad",
            orders: [
              "Hematuria: Macroscopic (cola-colored) or microscopic (greater than 5 red blood cells per high power field).",
              "Hypertension: Often sudden onset and out of proportion to edema.",
              "Edema: Typically periorbital and worse in the morning."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Urinalysis: Microscopy for red blood cell casts (pathognomonic for glomerulonephritis).",
              "Complete Blood Count and Creatinine: Establish baseline renal function.",
              "Complement Levels: C3 and C4 (C3 is characteristically low in Post-Streptococcal Glomerulonephritis).",
              "Streptococcal Evidence: Anti-Streptolysin O (ASO) titer or Throat Culture.",
              "Chest X-ray: Indicated if there are signs of respiratory distress or suspected heart failure from overload."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Fluid & Pressure Management",
        shortLabel: "Management",
        color: "amber",
        cards: [
          {
            title: "Fluid Restriction Strategy",
            threshold: "IF EDEMATOUS OR HYPERTENSIVE",
            orders: [
              "Restriction Goal: Limit total fluid intake to Insensible Water Loss + Urine Output (mL for mL).",
              "Insensible Water Loss: Approximately 400 mL/m²/day.",
              "Choice of Fluid: Strictly Isotonic if Intravenous is required; avoid all potassium-containing fluids."
            ]
          },
          {
            title: "Hypertension Directive",
            isCritical: true,
            threshold: "BLOOD PRESSURE > 95TH PERCENTILE",
            orders: [
              "First-Line Diuretic: Administer Furosemide (1-2 mg/kg) to reduce volume and pressure.",
              "Vasodilators: Consider Nifedipine or Amlodipine if hypertension persists despite diuresis.",
              "Emergency: If hypertensive crisis (Seizure/Vision change), escalate to Intravenous Labetalol or Hydralazine."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Nursing & Surveillance [NS]",
        shortLabel: "Monitoring",
        color: "red",
        cards: [
          {
            title: "Strict Bedside Monitoring",
            nursing: [
              "Blood Pressure: Measure every 4 hours (Every 1 hour if severely hypertensive).",
              "Daily Weight: Mandatory morning weight to track fluid loss/gain.",
              "Intake and Output: Strict hourly charting; report Oliguria (less than 0.5 mL/kg/hour).",
              "Neurological Check: Report any new headache, vomiting, or altered consciousness immediately."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Recovery & Discharge Planning",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Discharge Criteria",
            orders: [
              "Blood Pressure stable on oral therapy or without medications.",
              "Urine Output established and greater than 1.0 mL/kg/hour.",
              "Edema resolving with a stable or falling weight trend.",
              "Creatinine stable or improving."
            ]
          },
          {
            title: "Long-term Follow-up",
            orders: [
              "Week 2: Blood Pressure and Urinalysis check.",
              "Month 2: Repeat C3 level; if still low, refer to Pediatric Nephrology for biopsy.",
              "Note: Hematuria may persist for up to 12 months; this is expected if Blood Pressure and Creatinine are normal."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.hypertension === true || data.respiratoryDistress === true) {
      return { level: 'critical', details: ["Severe Hypertension or Fluid Overload detected."] };
    }
    if (data.reducedOutput === true) {
      return { level: 'severe', details: ["Oliguric Nephritic Syndrome - High risk for Acute Kidney Injury."] };
    }
    return { level: 'moderate', details: ["Stable Nephritic Syndrome."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Blood Pressure controlled and stable.",
    "Fluid balance achieved with resolving edema.",
    "Normalizing renal function.",
    "Follow-up scheduled for Blood Pressure check and repeat C3 in 8 weeks."
  ],
  getRedFlags: () => ["Seizures", "Sudden Shortness of Breath", "No Urine Output (Anuria)", "Severe Headache"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "StatPearls: Poststreptococcal Glomerulonephritis", url: "https://www.ncbi.nlm.nih.gov/books/NBK441865/" },
    { title: "Melbourne RCH: Acute Glomerulonephritis", url: "https://www.rch.org.au/clinicalguide/guideline_index/Acute_Glomerulonephritis/" }
  ]
};
