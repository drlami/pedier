import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Viral Exanthems
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: AAP Red Book, CDC Guidelines, and RCH Melbourne
 */
export const wardViralExanthemsProtocol: DiseaseProtocol = {
  id: 'ward-viral-exanthems',
  name: 'Viral Exanthems Master Pathway',
  system: 'Infectious Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Viral Exanthems are eruptive skin rashes that occur as a manifestation of a systemic viral infection. This exhaustive directive covers the identification, isolation requirements, and supportive management of classic pediatric exanthems including Measles, Rubella, Roseola, Erythema Infectiosum, Hand-Foot-and-Mouth Disease, and Varicella.',
  image: {
    url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Assessment of classic viral rash patterns and distribution"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'rashType', questionText: 'Dominant Rash Morphology', type: 'select', options: [
      { label: 'Maculopapular (Blanching)', value: 'maculopapular' },
      { label: 'Vesicular (Blisters)', value: 'vesicular' },
      { label: 'Reticular (Lacy)', value: 'reticular' },
      { label: 'Slapped-Cheek', value: 'slapped_cheek' }
    ]},
    { id: 'isToxic', questionText: 'Is the child appearing toxic or hemodynamically unstable?', type: 'boolean' },
    { id: 'immunizationStatus', questionText: 'Are immunizations up to date (specifically Measles/MMR)?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Viral Exanthems management focuses on (1) Accurate clinical diagnosis based on rash morphology and prodromal symptoms, (2) Strict adherence to Transmission-Based Precautions (Isolation) to prevent hospital outbreaks, and (3) Supportive care while monitoring for systemic complications such as secondary bacterial infection or encephalitis. Most exanthems are self-limiting, but Measles and Varicella require high vigilance for severe disease.",
    stages: [
      {
        label: "Stage 1: Identification & Isolation",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Classic Disease Details",
            orders: [
              "Measles (Rubeola): 3 Cs (Cough, Coryza, Conjunctivitis) + Koplik spots. Rash starts at the hairline and spreads downward (cephalocaudal).",
              "Rubella (German Measles): Postauricular and suboccipital lymphadenopathy. Rash is lighter pink and spreads faster than measles.",
              "Roseola (Exanthema Subitum): High fever for 3-5 days, then fever stops abruptly and the rash appears.",
              "Erythema Infectiosum (Fifth Disease): 'Slapped-cheek' appearance followed by a lacy, reticular rash on the trunk and limbs.",
              "Hand, Foot, and Mouth Disease: Painful vesicles in the mouth and maculopapular or vesicular rash on palms and soles.",
              "Varicella (Chickenpox): 'Dewdrop on a rose petal' vesicles in various stages of development (papules, vesicles, crusts)."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Isolation Level: MANDATORY. Airborne for Measles/Varicella; Droplet for Rubella/Fifth Disease; Contact for Hand-Foot-Mouth.",
              "Laboratory Workup: Not usually required unless diagnosis is uncertain. Consider Viral Polymerase Chain Reaction for Measles or Varicella if severe.",
              "Complete Blood Count: Check for lymphopenia (common in viral infections) or thrombocytopenia.",
              "Inflammatory Markers: C-Reactive Protein is typically low or normal in uncomplicated viral exanthems."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Supportive Therapeutics",
        shortLabel: "Management",
        color: "amber",
        cards: [
          {
            title: "Symptomatic Control",
            orders: [
              "Fever/Pain: Use Paracetamol. Strictly AVOID Aspirin (risk of Reye Syndrome) and avoid Ibuprofen in Varicella (risk of invasive Streptococcal infection).",
              "Pruritus (Itching): Use Oral Antihistamines or cool compresses.",
              "Hydration: Maintain Oral or Intravenous hydration if mouth ulcers (Hand-Foot-Mouth) or malaise prevent intake."
            ]
          },
          {
            title: "Disease-Specific Therapy",
            orders: [
              "Measles: Administer Vitamin A (200,000 International Units for age > 12 months) for 2 days to reduce mortality and eye damage.",
              "Varicella: Consider Oral or Intravenous Acyclovir if the patient is immunocompromised or has severe lung/brain involvement.",
              "Fifth Disease: Monitor for Aplastic Crisis in patients with sickle cell disease or hereditary spherocytosis."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Complication Surveillance [!]",
        shortLabel: "Monitoring",
        color: "red",
        cards: [
          {
            title: "Nursing: Vigilance Checks [NS]",
            nursing: [
              "Respiratory Effort: Monitor for tachypnea or crackles (Secondary bacterial pneumonia is a major Measles/Varicella complication).",
              "Neurological Check: Report any new headache, vomiting, or seizure (Post-infectious encephalitis).",
              "Skin Integrity: Check for spreading redness, warmth, or pus around vesicles (Secondary bacterial cellulitis).",
              "Hydration Status: Hourly Intake and Output charting if oral intake is poor."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Discharge & Public Health",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Discharge & Prevention",
            orders: [
              "Public Health Notification: MANDATORY for Measles and Rubella cases to local health authorities.",
              "Return to School: Hand-Foot-Mouth (when afebrile and lesions dry); Varicella (when ALL lesions are crusted over).",
              "Vaccination Catch-up: Review and update family immunization records prior to discharge."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.isToxic === true || (data.immunizationStatus === false && data.rashType === 'maculopapular')) {
      return { level: 'severe', details: ["Suspected Measles or severe viral infection with instability."] };
    }
    return { level: 'moderate', details: ["Stable Viral Exanthem."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Hemodynamically stable and well-hydrated.",
    "Parent understands the isolation requirements at home.",
    "Follow-up arranged with primary care for vaccination review.",
    "Public health notification completed (if required)."
  ],
  getRedFlags: () => ["Difficulty breathing", "Altered mental status or seizures", "Severe eye redness or pain", "Inability to drink fluids"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "AAP Red Book: Viral Exanthems", url: "https://publications.aap.org/redbook" },
    { title: "CDC: Measles and Other Viral Exanthems", url: "https://www.cdc.gov/" }
  ]
};
