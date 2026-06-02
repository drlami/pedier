import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Nephrotic Syndrome (Relapse)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: KDIGO (2021) and IPNA Clinical Practice Recommendations (2022)
 */
export const wardNephroticRelapseProtocol: DiseaseProtocol = {
  id: 'ward-nephrotic-relapse',
  name: 'Nephrotic Syndrome Relapse Master Pathway',
  system: 'Renal & Urinary System',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Nephrotic Syndrome Relapse is defined as the reappearance of significant proteinuria (greater than 2+ on dipstick for 3 consecutive days) after previously achieving remission. This exhaustive directive covers re-induction steroid regimens, management of frequent relapsers, and monitoring for steroid toxicity and secondary infections.',
  image: {
    url: "https://images.unsplash.com/photo-1579154235602-3c2c2aa5d72f?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Monitoring for proteinuria and edema recurrence"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'frequentRelapser', questionText: 'Frequently relapsing (≥ 2 in 6 months or ≥ 4 in a year)?', type: 'boolean' },
    { id: 'steroidDependent', questionText: 'Steroid dependent (relapse during taper or within 2 weeks of stopping)?', type: 'boolean' },
    { id: 'infectionPresent', questionText: 'Active infection (triggering the relapse)?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Management centers on (1) Rapid re-induction of remission with high-dose Prednisolone, (2) Identifying and treating triggers such as viral or bacterial infections, and (3) Optimizing steroid-sparing agents (e.g., Levamisole, Cyclophosphamide, or Calcineurin Inhibitors) for frequently relapsing or steroid-dependent patients. Clinicians must maintain a high index of suspicion for spontaneous bacterial peritonitis in patients with significant ascites.",
    stages: [
      {
        label: "Stage 1: Verification & Trigger Screen",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Confirming Relapse",
            orders: [
              "Urine Dipstick: Mandatory 3 consecutive days of 3+ or 4+ protein.",
              "Spot Urine Protein:Creatinine Ratio: To quantify the degree of leakage.",
              "Baseline Weight: Compare to the 'dry weight' from previous remission."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Screen for Infection: Complete Blood Count, C-Reactive Protein, and clinical search for triggers (Upper Respiratory Tract Infection, Urinary Tract Infection).",
              "Renal Function: Serum Creatinine and Urea to rule out Acute Kidney Injury.",
              "Albumin Level: Assess the degree of hypoalbuminemia.",
              "Electrolytes: Monitor Sodium and Potassium levels, especially if diuretics are planned."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Re-induction Therapeutics",
        shortLabel: "Management",
        color: "amber",
        cards: [
          {
            title: "Standard Re-induction Regimen",
            orders: [
              "Prednisolone: 2 mg/kg/day (Max 60 mg) until the urine is protein-free for 3 consecutive days.",
              "Switch to Alternate Day: Once remission is achieved, move to 1.5 mg/kg (Max 40 mg) on alternate days for 4 weeks."
            ],
            prescriptions: [
              {
                drug: "Prednisolone",
                dose: "2 mg/kg/day",
                route: "Oral",
                frequency: "Once daily (Morning)",
                calculation: (w) => `${Math.min(w * 2, 60).toFixed(0)} mg`,
                notes: "Max 60mg per day. Take with food."
              }
            ]
          },
          {
            title: "Steroid-Sparing Optimization",
            threshold: "FREQUENT RELAPSER / DEPENDENT",
            orders: [
              "Review adherence to existing steroid-sparing agents.",
              "Consider escalation to Cyclosporine or Tacrolimus under Pediatric Nephrology guidance.",
              "Low-dose alternate day steroids may be required for long-term maintenance."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Nursing & Complication Watch [NS]",
        shortLabel: "Monitoring",
        color: "red",
        cards: [
          {
            title: "Strict Bedside Monitoring",
            nursing: [
              "Daily Urine Dipstick: Mandatory tracking until 3 days of negative protein are achieved.",
              "Daily Weight: Monitor for rapid increases (fluid gain) or decreases (resolution).",
              "Blood Pressure: Measure every 8 hours; report any readings above the 95th percentile (Steroid or Calcineurin Inhibitor side effect).",
              "Abdominal Check: Monitor for tenderness or guarding (Rule out Peritonitis)."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Recovery & Taper Strategy",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Taper Roadmap",
            orders: [
              "Standard Taper: Gradually reduce the alternate-day dose over 2-4 months to minimize the risk of another relapse.",
              "Patient Education: Provide a written diary for home dipstick monitoring.",
              "Vaccination Advice: Avoid live vaccines (Measles, Mumps, Rubella, Varicella) while on high-dose steroids."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.infectionPresent === true || data.steroidDependent === true) {
      return { level: 'severe', details: ["High risk for steroid toxicity or secondary infection."] };
    }
    return { level: 'moderate', details: ["Relapsing nephrotic syndrome; standard re-induction."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Protein-free urine for more than 48 hours preferred (remission reached).",
    "Stable weight and Blood Pressure.",
    "Clear taper schedule provided to parents.",
    "Steroid-sparing agent therapy optimized."
  ],
  getRedFlags: () => ["Uncontrolled edema", "Side effects of Calcineurin Inhibitors (Tremor/Hypertension)", "Rising Urea or Creatinine", "Severe Infection"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "IPNA Recommendations: Relapsing Nephrotic Syndrome 2022", url: "https://pubmed.ncbi.nlm.nih.gov/35503463/" },
    { title: "RCH Melbourne: Nephrotic Syndrome Management", url: "https://www.rch.org.au/clinicalguide/guideline_index/nephrotic_syndrome/" }
  ]
};
