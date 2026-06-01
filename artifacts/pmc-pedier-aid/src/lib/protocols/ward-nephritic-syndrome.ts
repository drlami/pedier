import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

/**
 * Pediatric Ward: Acute Nephritic Syndrome (APSGN)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: StatPearls (2024), RCPCH, and Melbourne RCH.
 */
export const wardNephriticSyndromeProtocol: DiseaseProtocol = {
  id: 'ward-nephritic-syndrome',
  name: 'Acute Nephritic Syndrome Master Pathway',
  system: 'Renal & Urinary System',
  unit: 'ward',
  description: 'Inpatient management of APSGN and nephritic syndromes: Aggressive blood pressure control, strict fluid titration, and monitoring for hypertensive encephalopathy.',
  image: {
    url: "https://images.unsplash.com/photo-1559839734-2b71f1e3c7e5?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Blood pressure and hematuria management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Weight', type: 'number', unit: 'kg' },
    { id: 'bpHigh', questionText: 'BP significantly above 95th percentile?', type: 'boolean' },
    { id: 'oliguria', questionText: 'Oliguria (< 1 mL/kg/hr) present?', type: 'boolean' },
    { id: 'neuroSymptoms', questionText: 'Headache, visual changes, or seizures?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Management is focused on volume control. Use fluid restriction (Insensible Loss + UO) and loop diuretics. Avoid ACE inhibitors in the acute phase due to hyperkalemia risk.",
    stages: [
      {
        label: "Stage 1: Admission & Volume Assessment",
        shortLabel: "Admission",
        color: "blue",
        cards: [
          {
            title: "Immediate Laboratory Orders",
            orders: [
              "Urine Microscopy: Look for Red Cell Casts and Dysmorphic RBCs.",
              "ASO Titre & Anti-DNAse B (Confirm recent Strep infection).",
              "Complement Levels (C3, C4): Expected low C3 in APSGN.",
              "Renal Function & Electrolytes (Check for AKI and Hyperkalemia)."
            ]
          },
          {
            title: "Strict Volume Control [NS]",
            threshold: "CORE DIRECTIVE",
            orders: [
              "Restrict Fluid to: 400 mL/m²/day (Insensible Loss) + previous 24h Urine Output.",
              "No-Added-Salt (NAS) diet.",
              "Daily Weight: Aim for 1-2% weight loss per day until diuresis."
            ],
            nursing: [
              "Manual BP monitoring every 4 hours.",
              "Strict hourly intake/output charting.",
              "Daily weight at 08:00 AM."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Hypertension Management",
        shortLabel: "Hypertension",
        color: "red",
        cards: [
          {
            title: "Diuretic Therapy",
            threshold: "FIRST-LINE FOR VOLUME HTN",
            orders: [
              "Furosemide: Start with 1-2 mg/kg per dose.",
              "Monitor for hypokalemia once diuresis starts."
            ],
            prescriptions: [
              {
                drug: "Furosemide (IV/Oral)",
                dose: "1 mg/kg",
                route: "IV/Oral",
                frequency: "Every 12 hours",
                calculation: (w) => `${(1 * w).toFixed(0)} mg`,
                notes: "Titrate based on BP and UO."
              }
            ]
          },
          {
            title: "Antihypertensive Strategy",
            threshold: "IF BP REMAINS > 95TH %",
            orders: [
              "Calcium Channel Blockers: Amlodipine (0.1 mg/kg) or Nifedipine.",
              "Vasodilators: Hydralazine (0.2 mg/kg IV) for hypertensive urgency.",
              "AVOID ACE Inhibitors: Risk of hyperkalemia during oliguric phase."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Complication Vigilance",
        shortLabel: "Monitoring",
        color: "amber",
        cards: [
          {
            title: "Neurological Monitoring",
            isCritical: true,
            threshold: "BP > 99TH % + 5mmHg",
            triggers: [
              "Headache, vomiting, or altered vision: Suggests Hypertensive Encephalopathy/PRES.",
              "New-onset seizures: Require urgent IV anticonvulsants and BP lowering."
            ]
          },
          {
            title: "Cardiopulmonary Monitoring",
            nursing: [
              "Assess for basal lung crepitations (Pulmonary Edema).",
              "Check for liver enlargement or gallop rhythm."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Remission & Discharge",
        shortLabel: "Discharge",
        color: "emerald",
        cards: [
          {
            title: "Recovery Targets",
            orders: [
              "Stable blood pressure on minimal or no medication.",
              "Resolved volume overload (dry weight reached).",
              "Educate parents on long-term follow-up: Hematuria can last 6-12 months."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.neuroSymptoms === true || data.bpHigh === true) {
      return { level: 'critical', details: ["Hypertensive urgency or encephalopathy suspected."] };
    }
    if (data.oliguria === true) {
      return { level: 'severe', details: ["High risk for rapid volume overload and electrolyte imbalance."] };
    }
    return { level: 'moderate', details: ["Stable nephritic syndrome; monitoring phase."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Stable BP on oral medications.",
    "No respiratory distress or pulmonary edema.",
    "UO > 1 mL/kg/hr.",
    "Follow-up scheduled for BP check and repeat C3 in 8 weeks."
  ],
  getRedFlags: () => ["Seizures", "Sudden SOB", "Anuria", "Severe Headache"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "StatPearls: Poststreptococcal Glomerulonephritis", url: "https://www.ncbi.nlm.nih.gov/books/NBK441865/" },
    { title: "Melbourne RCH: Acute Glomerulonephritis", url: "https://www.rch.org.au/clinicalguide/guideline_index/Acute_Glomerulonephritis/" }
  ]
};
