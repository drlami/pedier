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
  description: 'Senior diagnostic roadmap for persistent fever (>8 days): Stepwise Phase 1/2 logic, Malignancy/Autoimmune screening, and Fever Diary strategy.',
  image: {
    url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Diagnostic Logic for Persistent Fever"
  },
  questions: [],

  mmpData: {
    stages: [
      {
        label: "Admission & Phase 1 Diagnostics",
        shortLabel: "Admission & Phase 1 Diagnostics",
        color: "blue",
        cards: [
          {
            title: "Defining FUO",
            threshold: "MANDATORY CRITERIA",
            instructions: [
              "1. Fever > 38.0°C (100.4°F) for ≥ 8 days.",
              "2. No source identified after initial history and physical exam.",
              "3. Note: If fever > 3 weeks, it meets the classic FUO definition."
            ]
          },
          {
            title: "Phase 1: Broad Screening",
            instructions: [
              "1. CBC + Peripheral Smear: Check for blasts (leukemia), cytopenias, or atypical lymphocytes (EBV/CMV).",
              "2. Inflammatory Markers: ESR and CRP (Discordance ESR > CRP suggests Autoimmune/TB).",
              "3. Cultures: Repeat Blood Culture, Urinalysis + Culture.",
              "4. Chemistry: LFTs, LDH (marker for malignancy/turnover), Uric Acid.",
              "5. Radiology: Chest X-ray (Occult pneumonia/hilar adenopathy)."
            ]
          },
          {
            title: "Fever Diary Directive",
            instructions: [
              "Hospital-Verified Fever: Document every temperature spike. True FUO must have hospital-verified fever.",
              "Fever Pattern: Note if Remittent (classic), Intermittent, or Quotidian (suggests JIA)."
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
