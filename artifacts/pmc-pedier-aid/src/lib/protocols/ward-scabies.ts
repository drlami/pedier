import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Scabies Eradication
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: CDC Guidelines, BAD Guidelines, and RCH Melbourne
 */
export const wardScabiesProtocol: DiseaseProtocol = {
  id: 'ward-scabies',
  name: 'Scabies Eradication Master Pathway',
  system: 'Dermatology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Scabies is a highly contagious skin infestation caused by the microscopic mite Sarcoptes scabiei var. hominis. It is characterized by intense nocturnal pruritus and polymorphic skin lesions including burrows, papules, and vesicles. This exhaustive directive covers the identification of classic and crusted scabies, household-wide treatment protocols, and rigorous environmental decontamination.',
  image: {
    url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Assessment of interdigital burrows and nocturnal pruritus"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'nocturnalItch', questionText: 'Intense itching that is worse at night?', type: 'boolean' },
    { id: 'householdSymptoms', questionText: 'Are household members or close contacts also itching?', type: 'boolean' },
    { id: 'crustedFeatures', questionText: 'Thick, hyperkeratotic crusts present (Suspected Crusted Scabies)?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Scabies management focuses on (1) Simultaneous treatment of the patient AND all household contacts regardless of symptoms, (2) Correct application of topical scabicides with mandatory re-application after 7 days to kill newly hatched mites, and (3) Stringent environmental cleaning to prevent re-infestation. Success is defined by the interruption of the mite life cycle, not the immediate resolution of itching.",
    stages: [
      {
        label: "Stage 1: Identification & Contact Mapping",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Diagnostic Hallmarks",
            threshold: "CLINICAL DIAGNOSIS",
            orders: [
              "Burrows: Pathognomonic thin, wavy lines, often found in finger webs, wrists, and axillae.",
              "Distribution (Pediatric): Includes palms, soles, and face in infants (unlike adults).",
              "Crusted Scabies (Emergency): Highly contagious; characterized by thick crusts containing millions of mites. Requires strict isolation.",
              "Contact Tracing: Identify all household members and frequent overnight visitors."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Microscopy (Optional): Skin scraping from a burrow to identify mites, eggs, or scybala (feces) under oil immersion.",
              "Isolation: Implement Contact Precautions immediately upon suspicion in an inpatient setting.",
              "Screen for Infection: Look for secondary Impetigo or Cellulitis resulting from scratching."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Eradication Therapeutics",
        shortLabel: "Management",
        color: "red",
        cards: [
          {
            title: "Topical Treatment Protocol",
            threshold: "FIRST-LINE THERAPY",
            isCritical: true,
            orders: [
              "Drug of Choice: Permethrin 5% Cream.",
              "Application: Apply to the ENTIRE body from the neck down (including face and scalp in infants). Pay special attention to finger webs, under nails, and genital areas.",
              "Duration: Leave on for 8-12 hours (overnight) before washing off.",
              "Repeat: MANDATORY second application 7 days later to target mites that hatched after the first treatment."
            ]
          },
          {
            title: "Oral Strategy (Refractory/Crusted)",
            threshold: "IF TOPICAL FAILS OR SEVERE CASE",
            orders: [
              "Ivermectin: Consider for crusted scabies or if topical treatment is impractical.",
              "Dosage: 200 micrograms/kg as a single dose; repeat at 7 days.",
              "Caution: Not routinely recommended for children weighing less than 15 kilograms."
            ],
            prescriptions: [
              {
                drug: "Permethrin 5% Cream",
                dose: "Apply once (Entire body)",
                route: "Topical",
                frequency: "Repeat in 7 days",
                calculation: (w) => `Use 15-30g per application`,
                notes: "Re-apply to hands if washed during the treatment period."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 3: Nursing & Environment [NS]",
        shortLabel: "Environmental",
        color: "amber",
        cards: [
          {
            title: "Decontamination Roadmap",
            nursing: [
              "Laundering: Wash all bedding, towels, and clothing used in the last 3 days in hot water (minimum 60°C) and dry on high heat.",
              "Non-washables: Place items in a sealed plastic bag for at least 72 hours (mites cannot survive off the host for more than 3 days).",
              "Clipping Nails: Cut finger and toe nails short to reduce the harbor of mites and eggs.",
              "Itch Management: Apply cool emollients or mild topical corticosteroids for post-scabetic pruritus."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Resolution & Follow-up",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "The Post-Scabetic Itch",
            orders: [
              "Education: Warn parents that itching may persist for 2-4 weeks AFTER successful eradication (allergic reaction to dead mites). This is NOT a treatment failure.",
              "Antihistamines: Use for symptomatic relief of nocturnal pruritus.",
              "Follow-up: Clinical review in 4 weeks to confirm no new lesions or burrows."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.crustedFeatures === true) {
      return { level: 'severe', details: ["Crusted Scabies - Extremely high transmission risk; requires intensive therapy."] };
    }
    return { level: 'moderate', details: ["Classic Scabies infestation."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "First application of Permethrin completed correctly.",
    "Household contacts identified and treatment prescriptions provided.",
    "Environmental cleaning instructions provided in writing.",
    "Parent understands that itching will not stop immediately.",
    "Follow-up scheduled to verify eradication."
  ],
  getRedFlags: () => ["Signs of secondary skin infection (pus, increasing pain)", "No improvement in itch after 4 weeks", "New burrows appearing after treatment"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "CDC: Scabies Resources for Health Professionals", url: "https://www.cdc.gov/parasites/scabies/health_ptr.html" },
    { title: "RCH Melbourne: Scabies Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/Scabies/" }
  ]
};
