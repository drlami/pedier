import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Fever Without Source (FWS)
 * MASTER MANAGEMENT PATHWAY
 */
export const wardFeverNoSourceProtocol: DiseaseProtocol = {
  id: 'ward-fever-no-source',
  name: 'Fever Without Source (FWS)',
  system: 'Infectious Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Fever Without Source is defined as an acute febrile illness where the etiology is not apparent after a thorough history and physical examination. This pathway provides age-based risk stratification (particularly for infants under 90 days), criteria for a full or partial septic workup, and evidence-based empirical management to identify and treat Invasive Bacterial Infections such as bacteremia and meningitis.',
  image: {
    url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Fever Risk Stratification"
  },
  questions: [],

  mmpData: {
    snapshot: "Management is categorized by 'Age-Based Risk Tiers': (1) Infants under 21-28 days require a full septic workup (Blood, Urine, Cerebrospinal Fluid) and mandatory hospitalization. (2) Infants 29-60 days are managed via structured criteria (e.g., AAP 2021) using inflammatory markers (Procalcitonin, C-Reactive Protein) to guide the need for lumbar puncture. The primary goal is the early identification of occult Urinary Tract Infections, Bacteremia, and Meningitis.",
    stages: [
      {
        label: "Stage 1: Admission & Risk Stratification",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Age-Based Risk Tiering",
            threshold: "MANDATORY ON ARRIVAL",
            isCritical: true,
            orders: [
              "Tier 1: < 21-28 Days (Neonatal): FULL Septic Workup (Blood, Urine, Cerebrospinal Fluid) + Mandatory Admission + Intravenous Antibiotics.",
              "Tier 2: 29-60 Days: Step-by-Step Approach (e.g., PECARN/Philadelphia/Rochester criteria). Blood and Urine workup mandatory; Cerebrospinal Fluid based on inflammatory markers.",
              "Tier 3: 61-90 Days: Low risk if 'Well-appearing'. Focus on Urinary Tract Infection screening.",
              "Tier 4: > 90 Days: Focus on focal source identification (Ear, Throat, Lungs, Urine)."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Immediate Age-Based Risk Stratification: Determine the appropriate tier (<21 days, 21-60 days, or 61-90 days).",
              "Blood Culture: Mandatory for all infants under 60 days and any older child who appears toxic.",
              "Urinalysis and Urine Culture: Required for all infants under 90 days (obtained via catheterization or suprapubic aspiration).",
              "Inflammatory Markers: Order Procalcitonin and C-Reactive Protein to assess risk of Invasive Bacterial Infection.",
              "Lumbar Puncture for Cerebrospinal Fluid Analysis: Perform if infant is under 21 days, toxic-appearing, or if inflammatory markers are significantly elevated in the 21-60 day group.",
              "Empirical Intravenous Antibiotics: Initiate Ampicillin and Cefotaxime for infants under 21 days; consider Ceftriaxone for older infants after cultures are obtained."
            ]
          },
          {
            title: "Nursing: Strict Monitoring [NS]",
            nursing: [
              "Vital Signs every 4 hours: Monitor heart rate, respiratory rate, blood pressure, and oxygen saturation.",
              "Temperature Tracking: Record temperature every 4 hours and notify physician for persistent high fever or temperature instability in neonates.",
              "Serial Clinical Assessment: Document transition from 'well-appearing' to 'toxic-appearing' (e.g., poor perfusion, lethargy, or irritability).",
              "Feeding and Hydration Status: Monitor oral intake and number of wet diapers daily."
            ]
          },
          {
            title: "Empiric IV Therapy (Neonatal/Young) (PREFERRED REGIMEN: DUAL THERAPY)",
            threshold: "AGE < 60 DAYS",
            orders: [
              "Target: Group B Streptococcus, Escherichia coli, and Listeria (if under 28 days)."
            ],
            prescriptions: [
              {
                drug: "Ampicillin",
                dose: "50 mg/kg",
                route: "IV",
                frequency: "Every 6-8 hours",
                calculation: (w) => `${(50 * w).toFixed(0)} mg`,
                notes: "Target: GBS and Listeria."
              },
              {
                drug: "Cefotaxime",
                dose: "50 mg/kg",
                route: "IV",
                frequency: "Every 6-8 hours",
                calculation: (w) => `${(50 * w).toFixed(0)} mg`,
                notes: "Preferred over Ceftriaxone in neonates (avoids kernicterus)."
              },
              {
                drug: "Gentamicin",
                dose: "4-5 mg/kg",
                route: "IV",
                frequency: "Once daily",
                calculation: (w) => `${(4 * w).toFixed(0)} mg`,
                notes: "Add for synergy if Gram-negative sepsis suspected."
              }
            ]
          }
        ]
      },
      {
        label: "Monitoring & Culturing",
        shortLabel: "Monitoring & Culturing",
        color: "amber",
        cards: [
          {
            title: "Clinical Re-assessment",
            threshold: "EVERY 4-6 HOURS",
            instructions: [
              "Focus: Emerging focal signs (e.g., new murmur, joint swelling, skin rash, or meningismus).",
              "Observation: A 'well-appearing' child who becomes 'toxic-appearing' requires immediate workup upgrade (LP if not done)."
            ]
          },
          {
            title: "The 24-36h Culture Check",
            threshold: "CRITICAL TIMEPOINT",
            instructions: [
              "Blood Culture: If negative at 24-36h and patient remains stable/well-appearing, consider discharge (if > 28 days).",
              "UTI Check: If Urine culture is positive, switch to targeted oral/IV therapy based on sensitivities."
            ]
          }
        ]
      },
      {
        label: "Failure to Resolve / Occult Infection",
        shortLabel: "Failure to Resolve / Occult Infection",
        color: "red",
        cards: [
          {
            title: "Persistent Fever (> 48-72h)",
            threshold: "NO SOURCE FOUND",
            isCritical: true,
            instructions: [
              "Action: Repeat inflammatory markers.",
              "Imaging: Chest X-ray (even if no respiratory signs) to rule out occult pneumonia.",
              "Alternative: Consider Viral infections (e.g., HHV-6, Enterovirus) or early Kawasaki Disease."
            ]
          },
          {
            title: "Therapy Upgrade (Meningitis/Sepsis) (PREFERRED REGIMEN: MONOTHERAPY)",
            threshold: "CLINICAL DETERIORATION",
            instructions: [
              "If meningitis suspected or markers rising, switch to CNS-dose Ceftriaxone ± Vancomycin."
            ],
            prescriptions: [
              {
                drug: "Ceftriaxone",
                dose: "100 mg/kg",
                route: "IV",
                frequency: "Once daily",
                calculation: (w) => `${Math.min(100 * w, 4000).toFixed(0)} mg`
              }
            ]
          }
        ]
      },
      {
        label: "Discharge & Safety Netting",
        shortLabel: "Discharge & Safety Netting",
        color: "emerald",
        cards: [
          {
            title: "Discharge Criteria (< 60 days)",
            instructions: [
              "1. Cultures (Blood/Urine/CSF) negative for 24-36 hours.",
              "2. Afebrile for > 24 hours.",
              "3. Patient remains well-appearing and tolerating feeds.",
              "4. Follow-up within 24 hours with primary pediatrician."
            ]
          },
          {
            title: "Safety Netting Instructions",
            instructions: [
              "Counsel parents on 'Red Flags': 1. Change in behavior/lethargy, 2. Poor feeding, 3. New rash (non-blanching), 4. Labored breathing.",
              "Provide clear contact information for return to hospital."
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
    { title: "AAP: Evaluation and Management of Well-Appearing Febrile Infants 8 to 60 Days (2021)", url: "https://publications.aap.org/pediatrics/article/148/2/e2021052228/179747/" },
    { title: "NICE [NG143]: Fever in Under 5s: Assessment and Initial Management", url: "https://www.nice.org.uk/guidance/ng143" }
  ],
};
