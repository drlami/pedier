import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Severe Atopic Dermatitis (Infected Eczema)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: NICE [NG190], AAD Guidelines, and RCH Melbourne
 */
export const wardAtopicDermatitisProtocol: DiseaseProtocol = {
  id: 'ward-atopic-dermatitis',
  name: 'Severe Atopic Dermatitis Master Pathway',
  system: 'Dermatology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Atopic Dermatitis is a chronic, relapsing inflammatory skin disease characterized by intense pruritus, xerosis, and eczematous lesions. This exhaustive directive covers the management of severe flares, identification of secondary infections (Eczema Herpeticum vs. Bacterial), and the standardized Wet Wrap therapy roadmap.',
  image: {
    url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Assessment of lichenification, crusting, and distribution"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'infected', questionText: 'Signs of secondary bacterial infection (Pus, Golden Crusting)?', type: 'boolean' },
    { id: 'herpeticum', questionText: 'Monomorphic punched-out erosions (Eczema Herpeticum)?', type: 'boolean' },
    { id: 'sleepDisturbed', questionText: 'Sleep severely disturbed by itching?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Severe Atopic Dermatitis management focuses on (1) Aggressive 'Rehydration' of the skin barrier through intensive emollient use and Wet Wrap therapy, (2) Targeted antimicrobial therapy for secondary infections which often trigger flares, and (3) Strategic use of topical corticosteroids to dampen inflammation. Eczema Herpeticum is a dermatological emergency requiring immediate antiviral therapy.",
    stages: [
      {
        label: "Stage 1: Classification & Infection Screen",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Diagnostic Identification",
            threshold: "VISIBLE ECZEMA + PRURITUS",
            orders: [
              "Morphology: Erythematous, ill-defined plaques; excoriations; and lichenification in chronic areas.",
              "Distribution: Flexural surfaces (elbows, knees) in older children; cheeks and extensors in infants.",
              "Eczema Herpeticum (EMERGENCY): Look for painful, monomorphic, punched-out vesicles or erosions. Often accompanied by fever and malaise."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Skin Swabs: Perform for Gram Stain and Culture from the most 'weepy' or crusted areas.",
              "Viral PCR: Swab base of erosions if Eczema Herpeticum is suspected (Herpes Simplex Virus).",
              "Complete Blood Count: Check for leukocytosis or eosinophilia.",
              "Antimicrobial Strategy: PREFERRED REGIMEN: MONOTHERAPY (Flucloxacillin) for bacterial infection; add Acyclovir if Viral is suspected."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Intensive Topical Therapy",
        shortLabel: "Management",
        color: "amber",
        cards: [
          {
            title: "The Emollient Foundation",
            orders: [
              "Rule of Use: Use generous amounts (250-500g per week). Apply frequently, at least 4-6 times daily.",
              "Application: Apply in the direction of hair growth; do not rub in. Use as a soap substitute.",
              "Examples: White Soft Paraffin, Cetomacrogol, or Glycerin-based creams."
            ]
          },
          {
            title: "Corticosteroid Pulse",
            threshold: "ACTIVE INFLAMMATION",
            orders: [
              "Face/Flexures: Use Low-potency (Hydrocortisone 1%).",
              "Trunk/Limbs: Use Moderate to High-potency (Betamethasone or Mometasone) for 3-7 days to achieve control.",
              "Note: Stop topical steroids if Eczema Herpeticum is confirmed until antiviral therapy is established."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Advanced Nursing Directives [NS]",
        shortLabel: "Specialized Care",
        color: "red",
        cards: [
          {
            title: "Wet Wrap Therapy Roadmap",
            threshold: "SEVERE/REFRACTORY ITCH",
            nursing: [
              "Preparation: Apply topical steroid to inflamed areas, then a thick layer of emollient to the whole body.",
              "First Layer: Soak tubular bandages (e.g., Tubifast) in warm water, wring out, and apply over the skin.",
              "Second Layer: Apply a dry tubular bandage over the wet one.",
              "Frequency: Change every 12-24 hours. Monitor for chilling or skin maceration.",
              "Safety: DO NOT use wet wraps if the skin is overtly infected (wait 24-48h for antibiotics to start working)."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Discharge & Maintenance",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Maintenance Roadmap",
            orders: [
              "Step-down: Transition to 'Weekend Therapy' (Topical steroid twice weekly to previously affected sites) for prevention.",
              "Education: Demonstrate the 'fingertip unit' (FTU) method for steroid application.",
              "Follow-up: Dermatology outpatient review in 2-4 weeks to assess for steroid-sparing agent needs (e.g., Methotrexate or Biologics)."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.herpeticum === true) {
      return { level: 'critical', details: ["Eczema Herpeticum - Risk of ocular involvement and systemic dissemination."] };
    }
    if (data.sleepDisturbed === true || data.infected === true) {
      return { level: 'severe', details: ["Severe infected eczema requiring inpatient stabilization."] };
    }
    return { level: 'moderate', details: ["Moderate atopic dermatitis flare."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Infection resolving on appropriate antimicrobials.",
    "Itch controlled enough to allow restful sleep.",
    "Parent/Carer competent in emollient and Wet Wrap techniques.",
    "Clear written action plan provided for home management."
  ],
  getRedFlags: () => ["Rapidly spreading painful vesicles (Herpeticum)", "Fever or spreading cellulitis", "Eye pain or redness", "Failure to respond to therapy at 48h"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "NICE Guideline: Atopic eczema in children", url: "https://www.nice.org.uk/guidance/cg57" },
    { title: "RCH Melbourne: Eczema Clinical Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/Eczema/" }
  ]
};
