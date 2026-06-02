import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Systemic Lupus Erythematosus (SLE)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: EULAR/ACR Classification Criteria (2019), AAP, and RCH Melbourne
 */
export const wardSleProtocol: DiseaseProtocol = {
  id: 'ward-sle',
  name: 'Systemic Lupus Erythematosus Master Pathway',
  system: 'Immunology & Rheumatology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Systemic Lupus Erythematosus is a chronic, multi-system autoimmune disease characterized by the production of autoantibodies against nuclear antigens, leading to widespread inflammation and tissue damage. This exhaustive directive covers the EULAR/ACR classification entry criteria, acute lupus flare management, and screening for critical organ involvement including Lupus Nephritis and Neuropsychiatric Lupus.',
  image: {
    url: "https://images.unsplash.com/photo-1576089234161-460d3d523b0a?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Multi-system autoimmune assessment and immunosuppression"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'newProteinuria', questionText: 'New-onset proteinuria or rising Creatinine?', type: 'boolean' },
    { id: 'neuroPsych', questionText: 'New psychosis, seizures, or altered mental status?', type: 'boolean' },
    { id: 'cytopenia', questionText: 'Severe anemia, leukopenia, or thrombocytopenia?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Management of Systemic Lupus Erythematosus focuses on (1) Induction of remission during acute flares using corticosteroids and steroid-sparing agents, (2) Vigilant screening for 'silent' organ damage, particularly Lupus Nephritis through regular urinalysis, and (3) Long-term maintenance of low disease activity while minimizing steroid toxicity. Hydroxychloroquine is mandatory for all patients unless strictly contraindicated.",
    stages: [
      {
        label: "Stage 1: Classification & Baseline Assessment",
        shortLabel: "Classification",
        color: "blue",
        cards: [
          {
            title: "EULAR/ACR Entry Criterion",
            threshold: "MANDATORY STARTING POINT",
            orders: [
              "Antinuclear Antibody (ANA) titer ≥ 1:80 on HEp-2 cells: If negative, Systemic Lupus Erythematosus is unlikely.",
              "Note: If Antinuclear Antibody is positive, proceed to additive clinical and immunological criteria (Fever, Arthritis, Malar Rash, Serositis, Cytopenias, Low Complement, Anti-dsDNA)."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Immunological Panel: Anti-double stranded DNA (Anti-dsDNA), Anti-Smith, Anti-Ro/La, and Anti-U1 RNP.",
              "Complement Levels: C3 and C4 (low levels indicate active disease).",
              "Complete Blood Count: Check for hemolytic anemia, leukopenia, or thrombocytopenia.",
              "Renal Baseline: Urinalysis (dipstick and microscopy), Spot Urine Protein:Creatinine Ratio, and Serum Creatinine.",
              "Inflammatory Markers: C-Reactive Protein (often normal in Lupus unless infection or serositis present) and Erythrocyte Sedimentation Rate.",
              "Direct Antiglobulin Test (Coombs): If anemia is present."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Acute Flare Management",
        shortLabel: "Flare Management",
        color: "red",
        cards: [
          {
            title: "Corticosteroid Pulse (Severe Flare)",
            threshold: "CRITICAL INVOLVEMENT",
            isCritical: true,
            orders: [
              "Indication: Severe renal, neurological, or hematological involvement.",
              "Monitoring: Check Blood Pressure and Blood Glucose regularly during pulse therapy."
            ],
            prescriptions: [
              {
                drug: "Methylprednisolone (Pulse)",
                dose: "30 mg/kg (Max 1 gram)",
                route: "Intravenous",
                frequency: "Once daily for 3 days",
                calculation: (w) => `${Math.min(30 * w, 1000).toFixed(0)} mg`,
                notes: "Infuse over 60 minutes. Monitor for arrhythmias."
              }
            ]
          },
          {
            title: "Standard Maintenance Foundation",
            orders: [
              "Hydroxychloroquine: Recommended for ALL patients to reduce flares and prevent organ damage.",
              "Sun Protection: Advise strict use of high-factor sunscreen and protective clothing (photosensitivity is a major flare trigger)."
            ],
            prescriptions: [
              {
                drug: "Hydroxychloroquine",
                dose: "5 mg/kg/day",
                route: "Oral",
                frequency: "Once daily",
                calculation: (w) => `${(5 * w).toFixed(0)} mg`,
                notes: "Max 400mg. Requires baseline and annual ophthalmology screening."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 3: Organ-Specific Surveillance [!]",
        shortLabel: "Surveillance",
        color: "amber",
        cards: [
          {
            title: "Lupus Nephritis Screening",
            orders: [
              "Perform daily Urinalysis dipstick for all inpatient flares.",
              "Escalate: If new hematuria or proteinuria > 1+ occurs, consult Pediatric Nephrology for a Kidney Biopsy.",
              "Classification: Biopsy is essential to differentiate between ISN/RPS Classes (I to VI) to guide therapy."
            ]
          },
          {
            title: "Neuropsychiatric Lupus (NPSLE)",
            orders: [
              "Screen for: Sudden changes in mood, cognitive decline, new-onset seizures, or severe headache.",
              "Action: Urgent Magnetic Resonance Imaging Brain and Lumbar Puncture (to rule out infection if on immunosuppression)."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Long-Term Monitoring & Safety",
        shortLabel: "Monitoring",
        color: "emerald",
        cards: [
          {
            title: "Immunosuppression Safety [NS]",
            nursing: [
              "Monitor for signs of infection (Fever/Malaise) - threshold for starting antibiotics is lower in immunosuppressed patients.",
              "Check for 'Steroid Side Effects': Cushingoid appearance, stretch marks, and mood changes.",
              "Education: Ensure parents understand the 'No Live Vaccines' rule while on high-dose immunosuppression."
            ]
          },
          {
            title: "Outpatient Follow-up",
            orders: [
              "Routine: Every 1-3 months depending on stability.",
              "Laboratory Check: Complete Blood Count, C3/C4, Anti-dsDNA, and Urinalysis at every visit."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.newProteinuria === true || data.neuroPsych === true) {
      return { level: 'critical', details: ["Major organ involvement (Renal/CNS) detected."] };
    }
    if (data.cytopenia === true) {
      return { level: 'severe', details: ["Significant hematological flare."] };
    }
    return { level: 'moderate', details: ["Stable or mild systemic flare."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Clinical symptoms (e.g., arthritis, rash) improving.",
    "Hemodynamically stable with normal Blood Pressure.",
    "Renal function stable or biopsy plan established.",
    "Clear understanding of multi-drug regimen (Hydroxychloroquine + Steroids)."
  ],
  getRedFlags: () => ["Decreased urine output", "Sudden headache or seizure", "Fever (Rule out infection)", "Shortness of breath (Serositis/Embolism)"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "2019 EULAR/ACR Classification Criteria for SLE", url: "https://ard.bmj.com/content/78/9/1151" },
    { title: "IPNA Clinical Practice Recommendations for Lupus Nephritis", url: "https://pubmed.ncbi.nlm.nih.gov/32185568/" }
  ]
};
