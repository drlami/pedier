import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Community-Acquired Pneumonia (CAP)
 * FULL MASTER SENIOR DOCTOR MANAGEMENT PATHWAY
 * Refined with Action-First Categorized Directives and Malaysian Ward Pearls.
 */
export const wardPneumoniaCapProtocol: DiseaseProtocol = {
  id: 'ward-pneumonia-cap',
  name: 'Pneumonia Management Pathway',
  system: 'Respiratory System',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Exhaustive consultant-level directive: Full-cycle management with 48h pivot logic, complication pathways (effusion/abscess), and Malaysian ward pearls.',
  image: {
    url: "https://images.unsplash.com/photo-1581594658553-359424894362?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Senior Physician Decision Support"
  },
  questions: [], 

  mmpData: {
    snapshot: "Supportive-first approach. Prioritize narrow-spectrum Benzylpenicillin for immunized children. Monitor for SIADH (Hyponatremia) and early signs of effusion (Focal dullness). Wean O2 only when asleep for baseline stability.",
    stages: [
      {
        label: "Admission & Initial Orders",
        shortLabel: "Admission & Initial Orders",
        color: "blue",
        cards: [
          {
            title: "Baseline Laboratory Schedule",
            threshold: "MANDATORY ON ARRIVAL",
            orders: [
              "Blood Culture: REQUIRED before first antibiotic (Identify S. pneumoniae/S. aureus).",
              "S. Electrolytes + Creatinine: REQUIRED (Screen for SIADH/Hyponatremia).",
              "CBC with Differential: Assess baseline white cell count and bandemia.",
              "CRP & Procalcitonin: Initial baseline markers for trend tracking.",
              "Viral PCR (Influenza/RSV): Seasonal screening for co-infection/isolation."
            ],
            nursing: [
              "Obtain exact weight for drug calculations.",
              "Document baseline vital signs including capillary refill time."
            ]
          },
          {
            title: "Supportive Care Directive",
            orders: [
              "Oxygen: Target SpO2 92-95%. Start via Nasal Cannula (1-4L).",
              "Hydration (RCH Standard): NG Isotonic Fluids preferred if RR < 60; IV Isotonic if RR > 60.",
              "Analgesia: Scheduled Paracetamol/Ibuprofen for pleuritic pain."
            ],
            nursing: [
              "Elevate head of bed 30-45 degrees.",
              "Wean O2 by 0.5L every 4-6h if stable. Perform weaning while ASLEEP to ensure baseline stability (MPP Pearl)."
            ]
          },
          {
            title: "1st-Line Rx (PREFERRED REGIMEN: MONOTHERAPY)",
            threshold: "FULLY IMMUNIZED",
            orders: [
              "Target: Narrow-spectrum Streptococcus pneumoniae coverage.",
              "Uncomplicated Duration: 5-7 days total (IV + PO)."
            ],
            prescriptions: [
              {
                drug: "Benzylpenicillin (Ampicillin)",
                dose: "50 mg/kg",
                route: "IV",
                frequency: "Every 6 hours",
                calculation: (w) => `${(50 * w).toFixed(0)} mg`
              }
            ]
          }
        ]
      },
      {
        label: "Monitoring & 48h Response",
        shortLabel: "Monitoring & 48h Response",
        color: "amber",
        cards: [
          {
            title: "Clinical Monitoring Targets",
            nursing: [
              "Check SpO2 & RR every 4h (Continuous if on O2).",
              "Check for Abdominal Distention/Aspirates: Monitor for ileus in severe cases (MPP Pearl).",
              "Strict Fluid Balance: Track input/output q6h.",
              "Daily Weight: Essential for SIADH surveillance."
            ],
            triggers: [
              "IF Sodium < 135 mmol/L → Restrict to 80% maintenance fluids.",
              "IF New Focal Dullness → Urgent Ultrasound (Suspect Effusion)."
            ]
          },
          {
            title: "The 48h Pivot Logic",
            threshold: "AT HOUR 48-72",
            triggers: [
              "IF Persistent fever > 38.5°C AND rising WOB/CRP → Move to Stage 3.",
              "IF Afebrile + Improved WOB → Switch to Oral Amoxicillin (40mg/kg BID)."
            ],
            prescriptions: [
              {
                drug: "Amoxicillin (Step-down)",
                dose: "40 mg/kg",
                route: "PO",
                frequency: "Every 12 hours",
                calculation: (w) => `${(40 * w).toFixed(0)} mg`,
                notes: "Total 80 mg/kg/day."
              }
            ]
          }
        ]
      },
      {
        label: "Failure & Complication Modules",
        shortLabel: "Failure & Complication Modules",
        color: "red",
        cards: [
          {
            title: "Complication 1: PLEURAL EFFUSION / EMPYEMA",
            threshold: "NEW DULLNESS / FAILURE TO IMPROVE",
            isCritical: true,
            orders: [
              "Radiology: URGENT Chest Ultrasound (Superior to CXR for identifying fibrin).",
              "Labs: Repeat CRP, Serum Albumin, and CBC.",
              "ENT/Surgery: Consult if fluid > 10mm or loculations present."
            ],
            triggers: [
              "Chest Tube Insertion (pH < 7.2 or Glucose < 40 or Frank Pus)."
            ]
          },
          {
            title: "2nd-Line Upgrade (PREFERRED REGIMEN: DUAL THERAPY)",
            threshold: "TREATMENT FAILURE",
            orders: [
              "Target: Resistant S. pneumoniae, Hib, and S. aureus.",
              "Duration: 10-14 days if complicated."
            ],
            prescriptions: [
              {
                drug: "Ceftriaxone (IV)",
                dose: "80 mg/kg",
                route: "IV",
                frequency: "Once daily",
                calculation: (w) => `${Math.min(80 * w, 2000).toFixed(0)} mg`,
                notes: "Max 2g."
              },
              {
                drug: "Clindamycin (IV)",
                dose: "10 mg/kg",
                route: "IV",
                frequency: "Every 8 hours",
                calculation: (w) => `${(10 * w).toFixed(0)} mg`,
                notes: "Covers MRSA/Abscess."
              }
            ]
          }
        ]
      },
      {
        label: "Recovery & Discharge",
        shortLabel: "Recovery & Discharge",
        color: "emerald",
        cards: [
          {
            title: "Final Discharge Milestones",
            orders: [
              "Afebrile for > 24 hours WITHOUT antipyretics.",
              "Oxygen Stability: SpO2 ≥ 92% on RA for > 12-24 hours.",
              "Tolerating oral step-down antibiotics and feeds."
            ],
            nursing: [
              "Parent Education: Explain 'The Return' signs (New fever, grunting).",
              "MDI Technique: Verify inhaler use if asthma co-exists (MPP Pearl)."
            ]
          },
          {
            title: "Long-Term Follow-up Schedule",
            threshold: "4-6 WEEKS POST-DISCHARGE",
            orders: [
              "Repeat CXR: ONLY if Empyema, Abscess, or persistent symptoms.",
              "Vaccination Review: Ensure PCV and annual Influenza are complete."
            ]
          }
        ]
      }
    ]
  },

  // ER Legacy
  calculateSeverity: () => ({ level: 'mild', details: [] }),
  getManagement: () => [],
  getDisposition: () => [],
  getRedFlags: () => [],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "AAP Management of CAP (2011/2021)", url: "https://publications.aap.org/pediatrics/article/128/4/e1677/31034/" },
    { title: "NICE [NG138]: Pneumonia CPG", url: "https://www.nice.org.uk/guidance/ng138" },
    { title: "RCH Melbourne CAP Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/Pneumonia/" }
  ],
};
