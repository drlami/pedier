import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Juvenile Idiopathic Arthritis (JIA)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: ILAR Classification Criteria, ACR 2021 Guidelines, and RCH Melbourne
 */
export const wardJiaProtocol: DiseaseProtocol = {
  id: 'ward-jia',
  name: 'Juvenile Idiopathic Arthritis Master Pathway',
  system: 'Immunology & Rheumatology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Juvenile Idiopathic Arthritis is a group of chronic inflammatory arthritides of unknown etiology, beginning before the age of 16 and lasting for at least 6 weeks. This exhaustive directive covers subtype classification (Oligoarticular, Polyarticular, Systemic), acute flare management, and the mandatory ophthalmology screening roadmap for silent uveitis.',
  image: {
    url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Joint assessment and inflammatory arthritis management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'jointsCount', questionText: 'Number of affected joints?', type: 'number' },
    { id: 'dailyFever', questionText: 'Daily spiking fever for > 2 weeks?', type: 'boolean' },
    { id: 'systemicSigns', questionText: 'Evanescent rash, lymphadenopathy, or hepatosplenomegaly?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Juvenile Idiopathic Arthritis management focuses on (1) Achieving clinical remission to prevent permanent joint destruction and growth impairment, (2) Subtype-specific therapy ranging from Intra-articular Steroids to Biologics, and (3) Mandatory screening for asymptomatic Uveitis. Systemic JIA (sJIA) is a medical emergency requiring exclusion of Macrophage Activation Syndrome.",
    stages: [
      {
        label: "Stage 1: Classification & Initial Workup",
        shortLabel: "Classification",
        color: "blue",
        cards: [
          {
            title: "Subtype Identification (ILAR)",
            threshold: "6 WEEKS OF ARTHRITIS",
            orders: [
              "Oligoarticular: 1 to 4 joints involved in the first 6 months.",
              "Polyarticular: 5 or more joints involved in the first 6 months (Check Rheumatoid Factor).",
              "Systemic JIA: Arthritis with daily spiking fever for ≥ 2 weeks + evanescent rash or organomegaly.",
              "Enthesitis-Related: Arthritis + Enthesitis (tendon insertion pain) or HLA-B27 positivity.",
              "Psoriatic: Arthritis + Psoriasis or dactylitis ('sausage digit')."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Complete Blood Count: Check for anemia of chronic disease and thrombocytosis.",
              "Inflammatory Markers: Erythrocyte Sedimentation Rate and C-Reactive Protein (often very high in Systemic JIA).",
              "Antinuclear Antibody (ANA): Critical for assessing Uveitis risk (Positive ANA increases risk).",
              "Rheumatoid Factor and Anti-CCP: To classify Polyarticular JIA.",
              "Joint Ultrasound or Magnetic Resonance Imaging: To confirm synovitis if clinical exam is ambiguous.",
              "Baseline Ophthalmology Exam: Slit-lamp exam is MANDATORY to screen for asymptomatic uveitis."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Flare Management & Induction",
        shortLabel: "Induction",
        color: "amber",
        cards: [
          {
            title: "First-Line Therapeutics",
            orders: [
              "Non-Steroidal Anti-Inflammatory Drugs (NSAIDs): Use Naproxen or Ibuprofen for symptomatic relief (Does not prevent joint damage alone).",
              "Intra-articular Corticosteroids: Gold standard for Oligoarticular flares (Induces rapid remission).",
              "Systemic Steroids: Reserved for severe Systemic JIA or bridge therapy in Polyarticular disease."
            ],
            prescriptions: [
              {
                drug: "Naproxen",
                dose: "7.5 - 10 mg/kg",
                route: "Oral",
                frequency: "Every 12 hours",
                calculation: (w) => `${(w * 10).toFixed(0)} mg`,
                notes: "Maximum 500mg per dose. Take with food."
              }
            ]
          },
          {
            title: "Nursing: Joint Care & Mobility [NS]",
            nursing: [
              "Morning Stiffness: Document duration of stiffness each morning.",
              "Range of Motion: Document specific joint limitations and pain scores.",
              "Heat Therapy: Apply warm packs to affected joints in the morning to reduce stiffness.",
              "Safety: Ensure Physical Therapy review for appropriate splinting or mobility aids."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Systemic JIA & Critical Risks [!]",
        shortLabel: "Systemic JIA",
        color: "red",
        cards: [
          {
            title: "Macrophage Activation Syndrome (MAS)",
            threshold: "FEVER + FALLING COUNTS",
            isCritical: true,
            triggers: [
              "High spiking fever that becomes continuous.",
              "Sudden drop in Platelet Count, Hemoglobin, or White Blood Cells.",
              "Extremely high Ferritin (often > 5000 ng/mL).",
              "Rising Liver Function Tests and falling Fibrinogen.",
              "Action: URGENT Rheumatology consult for high-dose pulse steroids and Anakinra."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Long-Term Surveillance Roadmap",
        shortLabel: "Surveillance",
        color: "emerald",
        cards: [
          {
            title: "Uveitis Screening Schedule",
            orders: [
              "High Risk (ANA positive, Oligo/Poly subtype, age < 7y): Every 3 months slit-lamp exam.",
              "Medium Risk: Every 6 months slit-lamp exam.",
              "Low Risk: Every 12 months slit-lamp exam.",
              "Note: Uveitis is almost always asymptomatic; screening MUST NOT be missed."
            ]
          },
          {
            title: "Second-Line Strategy (DMARDs)",
            orders: [
              "Methotrexate: Usually started if arthritis persists beyond 1-2 months or involves critical joints.",
              "Biologics (TNF-inhibitors/IL-1/IL-6 inhibitors): Consider early in Polyarticular or Systemic subtypes."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.dailyFever === true || data.systemicSigns === true) {
      return { level: 'critical', details: ["Systemic Juvenile Idiopathic Arthritis - High risk for Macrophage Activation Syndrome."] };
    }
    if (data.jointsCount && data.jointsCount >= 5) {
      return { level: 'severe', details: ["Polyarticular JIA - Requires aggressive induction."] };
    }
    return { level: 'moderate', details: ["Oligoarticular JIA flare."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Pain well-controlled on oral Non-Steroidal Anti-Inflammatory Drugs.",
    "No signs of Systemic JIA or Macrophage Activation Syndrome.",
    "Ophthalmology screening completed or scheduled within 1 week.",
    "Physical Therapy review completed with home exercise plan."
  ],
  getRedFlags: () => ["Continuous fever (Suspected MAS)", "Sudden vision changes", "Severe limb deformity", "Bruising or bleeding (Low platelets)"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "2021 ACR Guideline for Management of JIA", url: "https://www.rheumatology.org/Practice-Quality/Clinical-Support/Clinical-Practice-Guidelines/Juvenile-Idiopathic-Arthritis" },
    { title: "RCH Melbourne: Juvenile Idiopathic Arthritis", url: "https://www.rch.org.au/clinicalguide/guideline_index/Juvenile_idiopathic_arthritis_JIA/" }
  ]
};
