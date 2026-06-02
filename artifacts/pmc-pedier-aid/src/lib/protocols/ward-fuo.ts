import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Fever of Unknown Origin (FUO)
 * MASTER MANAGEMENT PATHWAY
 */
export const wardFuoProtocol: DiseaseProtocol = {
  id: 'ward-fuo',
  name: 'Fever of Unknown Origin (FUO)',
  system: 'Infectious Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Fever of Unknown Origin (FUO) in children is traditionally defined as a temperature 38.0°C or higher lasting for 8 days or more without an identified source after preliminary investigation. This pathway provides a tiered diagnostic strategy to differentiate between common infections with unusual presentations, autoimmune disorders, and occult malignancies.',
  image: {
    url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Diagnostic Logic for Persistent Fever"
  },
  questions: [],

  mmpData: {
    snapshot: "Management follows a 'Tiered Diagnostic Approach': (1) Phase 1 focuses on broad screening (Complete Blood Count, Inflammatory Markers, Cultures, and Chest X-ray). (2) Phase 2 targets specific sub-specialty etiologies (Autoimmune markers, expanded serology, and Abdominal Ultrasound). (3) Phase 3 involves invasive testing (Bone Marrow Biopsy) if the diagnosis remains elusive. A key directive is the avoidance of empirical antibiotics or steroids in stable patients, as these can mask underlying diagnoses like tuberculosis or leukemia.",
    stages: [
      {
        label: "Stage 1: Admission & Phase 1 Diagnostics",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Verify Fever Duration and Pattern: Confirm hospital-verified fever greater than 38.0°C and document the fever pattern (e.g., Quotidian, Intermittent).",
              "Phase 1 Laboratory Screening: Order Complete Blood Count with Peripheral Smear, Erythrocyte Sedimentation Rate, and C-Reactive Protein.",
              "Comprehensive Chemistry Panel: Include Liver Function Tests, Lactate Dehydrogenase, Uric Acid, and Electrolytes.",
              "Multi-Site Cultures: Obtain repeat Blood Cultures and Urinalysis with Culture.",
              "Baseline Imaging: Order a Chest X-ray to screen for occult pneumonia or hilar lymphadenopathy.",
              "Tuberculin Skin Test or Interferon-Gamma Release Assay: To screen for latent or active Tuberculosis."
            ]
          },
          {
            title: "Nursing: Strict Monitoring [NS]",
            nursing: [
              "Fever Diary: Document every temperature spike, associated symptoms (e.g., chills, rash, joint pain), and the child's activity level during fever.",
              "Vital Signs every 4 hours: Monitor heart rate, respiratory rate, and blood pressure.",
              "Detailed Skin and Joint Assessment: Perform a daily head-to-toe check for new rashes, conjunctivitis, oral changes (strawberry tongue), or joint swelling.",
              "Accurate Intake and Output: Monitor hydration status and oral intake."
            ]
          },
          {
            title: "Defining FUO",
            threshold: "MANDATORY CRITERIA",
            orders: [
              "Fever > 38.0°C (100.4°F) for 8 days or longer.",
              "No source identified after initial history and physical exam.",
              "Note: If fever persists for more than 3 weeks, it meets the classic FUO definition."
            ]
          }
        ]
      },
      {
        label: "Phase 2 Diagnostics (Sub-specialty)",
        shortLabel: "Phase 2 Diagnostics (Sub-specialty)",
        color: "amber",
        cards: [
          {
            title: "Phase 2: Targeted Testing",
            threshold: "IF PHASE 1 IS NON-DIAGNOSTIC",
            instructions: [
              "Infectious: Tuberculin Skin Test (TST) or IGRA, Brucella serology, HIV, EBV/CMV PCR, Bartonella (Cat-scratch).",
              "Autoimmune: ANA, Ferritin (marker for Still's/MAS), Complement levels.",
              "Radiology: Ultrasound Abdomen (check for occult abscess or lymphadenopathy)."
            ]
          },
          {
            title: "The 'Holding' Strategy",
            isCritical: true,
            instructions: [
              "Crucial Directive: Do NOT start empiric antibiotics or steroids if the patient is hemodynamically stable. This can mask the diagnosis (e.g., partial treatment of TB or masking leukemia with steroids)."
            ]
          }
        ]
      },
      {
        label: "Advanced Imaging & Biopsy",
        shortLabel: "Advanced Imaging & Biopsy",
        color: "red",
        cards: [
          {
            title: "Phase 3: Invasive/Advanced Workup",
            threshold: "PERSISTENT FEVER > 2-3 WEEKS",
            isCritical: true,
            instructions: [
              "1. Bone Marrow Aspiration/Biopsy: To rule out Leukemia, Neuroblastoma, or Hemophagocytic Lymphohistiocytosis (HLH).",
              "2. CT Chest/Abdomen/Pelvis with Contrast: To look for deep-seated abscesses or occult malignancy.",
              "3. PET-CT: Consider if all other imaging is negative and inflammatory markers remain extremely high."
            ]
          },
          {
            title: "Alternative Path: KAWASAKI / JIA",
            threshold: "CLINICAL EVOLUTION",
            instructions: [
              "Monitor for: Conjunctivitis, rash, strawberry tongue, joint swelling.",
              "Action: Baseline Echo if Kawasaki suspected."
            ]
          }
        ]
      },
      {
        label: "Diagnosis & Discharge Planning",
        shortLabel: "Diagnosis & Discharge Planning",
        color: "emerald",
        cards: [
          {
            title: "Discharge Without Diagnosis",
            threshold: "FEVER RESOLVED OR STABLE",
            instructions: [
              "Criteria: 1. Patient is well-appearing, 2. Extensive Phase 1/2 workup negative, 3. Fever pattern is self-resolving or parent-monitored.",
              "Note: 15-25% of pediatric FUO cases remain undiagnosed but have a benign course."
            ]
          },
          {
            title: "Long-Term Management Plan",
            instructions: [
              "1. Scheduled follow-up with Pediatric ID or Rheumatology.",
              "2. Continue Fever Diary at home.",
              "3. Instruct parents to return if new focal signs (rash/swelling/limp) emerge."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: () => ({ level: 'moderate', details: [] }),
  getManagement: () => [],
  getDisposition: () => [],
  getRedFlags: () => [],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "AAP: Fever Without Source and Fever of Unknown Origin", url: "https://publications.aap.org" },
    { title: "BMJ Best Practice: Fever of Unknown Origin in Children", url: "https://bestpractice.bmj.com" }
  ],
};
