import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: PFAPA Syndrome
 * (Periodic Fever, Aphthous Stomatitis, Pharyngitis, and Adenitis)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: Modified Marshall's Criteria, Eurofever PRINTO, and RCH Melbourne
 */
export const wardPfapaProtocol: DiseaseProtocol = {
  id: 'ward-pfapa',
  name: 'PFAPA Syndrome Master Pathway',
  system: 'Immunology & Rheumatology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'PFAPA Syndrome is a non-hereditary autoinflammatory disorder of childhood characterized by predictable, periodic episodes of high fever accompanied by aphthous stomatitis (mouth ulcers), pharyngitis, and cervical lymphadenitis. This exhaustive directive covers the modified Marshall diagnostic criteria, rapid steroid-response testing, and the clinical roadmap for prophylactic tonsillectomy.',
  image: {
    url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Clinical triad of periodic fever, pharyngitis, and aphthous ulcers"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'feverPattern', questionText: 'Are fever episodes highly predictable (e.g., every 3-5 weeks)?', type: 'boolean' },
    { id: 'steroidResponse', questionText: 'Does fever resolve within 2-4 hours of a single steroid dose?', type: 'boolean' },
    { id: 'asymptomaticInterval', questionText: 'Is the child completely well between episodes?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "PFAPA management centers on (1) Confirming the periodicity and the clinical triad while rigorously excluding infection or monogenic periodic fevers (like FMF), (2) Using a single low dose of Corticosteroids to rapidly abort the acute febrile flare, and (3) Evaluating the impact on quality of life to determine the need for Tonsillectomy, which remains the only definitive cure. Clinicians must warn parents that steroids may shorten the interval between episodes.",
    stages: [
      {
        label: "Stage 1: Diagnostic Verification & Workup",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Modified Marshall's Criteria",
            threshold: "MANDATORY CLINICAL FEATURES",
            orders: [
              "Regularly Recurring Fevers: Onset before age 5, lasting 3-6 days.",
              "Constitutional Symptoms (at least one): Aphthous stomatitis, Cervical lymphadenitis, or Pharyngitis.",
              "Exclusion: No evidence of Upper Respiratory Infection or Cyclic Neutropenia.",
              "Asymptomatic Intervals: Completely normal growth, development, and health between flares."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Complete Blood Count: Expect mild Leukocytosis (elevated White Blood Cells) during a flare, but must rule out Cyclic Neutropenia (check counts during AND between flares).",
              "Inflammatory Markers: C-Reactive Protein and Erythrocyte Sedimentation Rate (typically elevated during attack, normal between attacks).",
              "Throat Culture: Mandatory during pharyngitis episodes to rule out Group A Streptococcal infection.",
              "Metabolic Baseline: Urea, Electrolytes, and Creatinine."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Acute Flare Management (Abortive)",
        shortLabel: "Flare Control",
        color: "red",
        cards: [
          {
            title: "The 'Steroid Test' Directive",
            threshold: "START AT ONSET OF FEVER",
            orders: [
              "Indication: To rapidly abort the febrile episode and confirm the diagnosis.",
              "Expected Response: Complete resolution of fever within 2-6 hours; dramatic improvement in pharyngitis and activity level.",
              "Warning: Inform parents that steroids may cause the next episode to occur sooner (shortened interval)."
            ],
            prescriptions: [
              {
                drug: "Prednisolone",
                dose: "1 - 2 mg/kg",
                route: "Oral",
                frequency: "Single Dose",
                calculation: (w) => `${(w * 1.5).toFixed(0)} mg`,
                notes: "A second dose may be given after 24 hours if symptoms partially recur."
              }
            ]
          },
          {
            title: "Nursing & Monitoring [NS]",
            nursing: [
              "Fever Tracking: Document the exact time of steroid administration and the time of first normal temperature.",
              "Oral Care: Use soothing mouthwashes or topical gels for painful aphthous ulcers.",
              "Hydration: Monitor intake if pharyngitis is severe enough to cause reduced drinking."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Interval Prevention Strategy",
        shortLabel: "Prevention",
        color: "amber",
        cards: [
          {
            title: "Prophylactic Trials",
            orders: [
              "Cimetidine (20 mg/kg/day): May prevent or space out episodes in approximately 25-30% of children.",
              "Colchicine: Consider if the child has MEFV mutations or if episodes are very frequent (overlaps with FMF management)."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Surgical Roadmap & Resolution",
        shortLabel: "Definitive Care",
        color: "emerald",
        cards: [
          {
            title: "Tonsillectomy Criteria",
            threshold: "IF QUALITY OF LIFE IS SEVERELY IMPACTED",
            orders: [
              "Indication: Failure of medical management, frequent school absences, or steroid-induced shortening of intervals.",
              "Efficacy: Tonsillectomy (with or without Adenoidectomy) results in immediate and permanent resolution in over 80-90% of cases.",
              "Referral: Refer to Ear, Nose, and Throat (ENT) surgery for definitive evaluation."
            ]
          },
          {
            title: "Natural History",
            orders: [
              "Education: Reassure parents that PFAPA is self-limited and typically resolves spontaneously by adolescence without long-term sequelae."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.feverPattern === true && data.steroidResponse === true) {
      return { level: 'moderate', details: ["Classic PFAPA pattern confirmed; symptoms expected to resolve with single steroid dose."] };
    }
    return { level: 'moderate', details: ["Suspected PFAPA - requires verification with serial inflammatory markers."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Fever resolved following steroid administration.",
    "Normal oral intake and adequate hydration.",
    "Parent educated on the steroid-induced interval shortening risk.",
    "Diary started for tracking future fever episodes (dates and duration)."
  ],
  getRedFlags: () => ["Unresponsive to steroids", "Joint swelling (Consider other periodic fevers)", "Abdominal guarding", "Failure to thrive between episodes"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "Modified Marshall's Criteria for PFAPA", url: "https://pubmed.ncbi.nlm.nih.gov/2290453/" },
    { title: "RCH Melbourne: PFAPA Syndrome", url: "https://www.rch.org.au/clinicalguide/guideline_index/PFAPA_Syndrome/" }
  ]
};
