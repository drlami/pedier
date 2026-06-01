import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

/**
 * Pediatric Ward: Nephrotic Syndrome (Relapse)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: IPNA Recommendations for Management of Relapsing Nephrotic Syndrome (2022).
 */
export const wardNephroticRelapseProtocol: DiseaseProtocol = {
  id: 'ward-nephrotic-relapse',
  name: 'Nephrotic Syndrome Master Pathway (Relapse)',
  system: 'Renal & Urinary System',
  unit: 'ward',
  description: 'Specialized inpatient management for frequent relapsers and steroid-dependent cases: Targeted steroid-sparing agent titration, toxicity monitoring, and achieving remission.',
  image: {
    url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Relapsing nephrotic syndrome management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Weight', type: 'number', unit: 'kg' },
    { id: 'relapseFrequency', questionText: 'Relapse Pattern', type: 'select', options: [
      { label: 'Infrequent (< 2 in 6 months)', value: 'infrequent' },
      { label: 'Frequent (>= 2 in 6 months)', value: 'frequent' },
      { label: 'Steroid Dependent', value: 'dependent' },
    ]},
    { id: 'currentSparing', questionText: 'Currently on steroid-sparing agent?', type: 'boolean' },
    { id: 'infectionTrigger', questionText: 'Is there an active infection triggering this relapse?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "For standard relapses, use 60 mg/m² (2 mg/kg) daily until urine is protein-free for 3 days, followed by 4 weeks of alternate-day steroids. If frequent/dependent, prioritize optimization of steroid-sparing agents.",
    stages: [
      {
        label: "Stage 1: Relapse Verification & Trigger Assessment",
        shortLabel: "Verification",
        color: "blue",
        cards: [
          {
            title: "Confirming Relapse [DR]",
            orders: [
              "Review home log: Relapse is defined as dipstick 3+ protein for 3 consecutive days.",
              "Search for Triggers: Check for URTI, GI symptoms, or recent vaccinations.",
              "Baseline Labs: CBC, CRP, Creatinine, and Electrolytes.",
              "If on Cyclosporine/Tacrolimus: Check trough levels (C0)."
            ]
          },
          {
            title: "Nursing: Focus on Complications [NS]",
            nursing: [
              "Strict I/O and daily weight.",
              "Monitor for signs of Thromboembolism (swollen leg, SOB).",
              "Check for signs of Spontaneous Bacterial Peritonitis (abdominal pain/guarding)."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Re-induction Therapy",
        shortLabel: "Re-induction",
        color: "amber",
        cards: [
          {
            title: "Relapse Steroid Protocol",
            threshold: "STANDARD OF CARE",
            orders: [
              "Prednisolone: 60 mg/m²/day (Max 60mg) or 2 mg/kg/day.",
              "Duration: Continue daily until protein-free for 3 consecutive days.",
              "Maintenance: Then switch to 40 mg/m² (1.5 mg/kg) on alternate days for 4 weeks."
            ],
            prescriptions: [
              {
                drug: "Prednisolone",
                dose: "2 mg/kg",
                route: "Oral",
                frequency: "Once daily until remission",
                calculation: (w) => `${(2 * w).toFixed(0)} mg`,
                notes: "Maximum 60mg daily."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 3: Steroid-Sparing Agent Management",
        shortLabel: "Sparing Agents",
        color: "indigo",
        cards: [
          {
            title: "Optimization Directive",
            threshold: "IF FREQUENT RELAPSER / DEPENDENT",
            orders: [
              "Levamisole: Consider as first-line sparing agent (2.5 mg/kg alternate days).",
              "Mycophenolate Mofetil (MMF): Target 1200 mg/m²/day in two divided doses.",
              "Cyclophosphamide: Usually reserved for 2nd/3rd relapse; consult Nephrology.",
              "Rituximab: Consider if Multi-drug resistant/dependent (Consultant decision)."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Remission Maintenance & Discharge",
        shortLabel: "Discharge",
        color: "emerald",
        cards: [
          {
            title: "Discharge Readiness",
            orders: [
              "Document the exact steroid taper plan.",
              "Ensure iron-clad plan for CNI/MMF level monitoring.",
              "Vaccinate (Influenza/Pneumococcal) once in remission and on low-dose steroids."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.infectionTrigger === true || data.relapseFrequency === 'dependent') {
      return { level: 'severe', details: ["High risk for steroid toxicity or secondary infection."] };
    }
    return { level: 'moderate', details: ["Relapsing nephrotic syndrome; standard re-induction."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Protein-free urine for > 48 hours preferred (remission reached).",
    "Stable weight and blood pressure.",
    "Clear taper schedule provided to parents.",
    "Steroid-sparing agent optimized."
  ],
  getRedFlags: () => ["Uncontrolled edema", "Side effects of CNIs (Tremor/HTN)", "Rising urea/creatinine", "Severe infection"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "IPNA Recommendations: Relapsing Nephrotic Syndrome 2022", url: "https://pubmed.ncbi.nlm.nih.gov/35503463/" },
    { title: "RCH Melbourne: Nephrotic Syndrome Management", url: "https://www.rch.org.au/clinicalguide/guideline_index/nephrotic_syndrome/" }
  ]
};
