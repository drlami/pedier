import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Inpatient Asthma Exacerbation
 * FULL MASTER SENIOR DOCTOR MANAGEMENT PATHWAY
 * Derived from: GINA 2024, BTS/SIGN, and RCH Melbourne Guidelines
 */
export const wardAsthmaProtocol: DiseaseProtocol = {
  id: 'ward-asthma-management',
  name: 'Asthma Master Pathway',
  system: 'Respiratory System',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Asthma is a chronic inflammatory airway disease characterized by reversible airway obstruction and bronchial hyper-responsiveness. This exhaustive consultant-level directive covers PRAM weaning logic, PICU transfer criteria, and maintenance ICS strategies.',
  image: {
    url: "https://images.unsplash.com/photo-1559839734-2b71f1e3c7e5?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Pediatric asthma clinical care"
  },
  questions: [], 

  mmpData: {
    stages: [
      {
        label: "Admission & Steroid Strategy",
        shortLabel: "Admission & Steroid Strategy",
        color: "blue",
        cards: [
          {
            title: "Phase 1: Admission Laboratories",
            threshold: "MANDATORY IF SEVERE",
            instructions: [
              "1. VBG (Venous Blood Gas): Essential for baseline pCO2 assessment.",
              "2. S. Electrolytes: Monitor Potassium (Hypokalemia risk from frequent B2-agonists).",
              "3. Blood Glucose: Monitor for hyperglycemia (Steroid/Salbutamol effect)."
            ]
          },
          {
            title: "Systemic Steroid Directive (IV vs PO)",
            threshold: "START WITHIN 1 HOUR",
            instructions: [
              "PO Prednisolone: Preferred for ALL children who can tolerate oral intake (Equally effective as IV).",
              "IV Methylprednisolone/Hydrocortisone: Reserved for: Vomiting, severe respiratory distress (unable to swallow), or impending failure.",
              "Switch IV to PO as soon as tolerated to reduce hospital stay."
            ],
            prescriptions: [
              {
                drug: "Prednisolone (Oral)",
                dose: "2 mg/kg (Max 40mg)",
                route: "PO",
                frequency: "Once daily",
                calculation: (w) => `${Math.min(w * 2, 40).toFixed(0)} mg`,
                notes: "Standard 3-5 day course. No taper needed if < 14 days."
              },
              {
                drug: "Hydrocortisone (IV)",
                dose: "4 mg/kg (Max 100mg)",
                route: "IV",
                frequency: "Every 6 hours",
                calculation: (w) => `${Math.min(w * 4, 100).toFixed(0)} mg`,
                notes: "Reserved for unable to tolerate PO."
              }
            ]
          },
          {
            title: "Acute Inhaled Corticosteroid (ICS) Role",
            threshold: "SYNERGISTIC ACTION (HOUR 1)",
            instructions: [
              "1. Non-Genomic Effect: High-dose ICS induces rapid vasoconstriction and reduces mucosal edema within 30-60 mins.",
              "2. Synergism: Use alongside systemic steroids to reduce hospital admission rates and length of stay.",
              "3. Early Initiation: Starting ICS on admission ensures controller therapy is established before discharge."
            ],
            prescriptions: [
              {
                drug: "Fluticasone Propionate (MDI)",
                dose: "500-1000 mcg",
                route: "Inhaled",
                frequency: "Single Acute Dose",
                calculation: (w) => "4-8 puffs (125mcg/puff)",
                notes: "Use with Spacer. Repeat q1h for 2 doses if severe."
              },
              {
                drug: "Budesonide (Nebulized)",
                dose: "1-2 mg",
                route: "Inhaled",
                frequency: "Single Acute Dose",
                calculation: (w) => "2-4 mL (0.5mg/mL)",
                notes: "Consider if MDI technique is poor during severe distress."
              }
            ]
          },
          {
            title: "Initial Bronchodilator Strategy",
            instructions: [
              "Salbutamol (MDI + Spacer): 6-10 puffs every 1-2 hours based on severity.",
              "Ipratropium Bromide: Add 4-8 puffs q20m for the first hour ONLY (Severe cases)."
            ]
          }
        ]
      },
      {
        label: "PRAM Weaning Pathway",
        shortLabel: "PRAM Weaning Pathway",
        color: "amber",
        cards: [
          {
            title: "PRAM Clinical Scoring",
            threshold: "PEDIATRIC RESPIRATORY ASSESSMENT MEASURE",
            calculator: {
              id: "pram-score",
              title: "PRAM Calculator"
            },
            instructions: [
              "Mild (0-3) | Moderate (4-7) | Severe (8-12).",
              "FOLLOW-UP: Perform PRAM before and 30m after each Salbutamol dose."
            ]
          },
          {
            title: "Stepwise Weaning Roadmap",
            threshold: "IF PRAM IS 0-3 (MILD)",
            instructions: [
              "Wean only if stable on current interval for 2 consecutive doses.",
              "Pathway: q1h → q2h → q3h → q4h.",
              "If PRAM increases > 3 during weaning: Revert to the previous interval."
            ]
          }
        ]
      },
      {
        label: "Escalation & PICU Transfer",
        shortLabel: "Escalation & PICU Transfer",
        color: "red",
        cards: [
          {
            title: "Indications for PICU Transfer",
            threshold: "CONSULT PICU IMMEDIATELY IF:",
            isCritical: true,
            instructions: [
              "1. Failure to Wean: Unable to stretch Salbutamol interval beyond 2 hours.",
              "2. Biochemical Failure: Rising pCO2 on VBG or pH < 7.3.",
              "3. Clinical Failure: Silent chest, exhaustion, or altered mental status.",
              "4. Support Failure: Rising oxygen requirement or need for NIV/High Flow."
            ]
          },
          {
            title: "Rescue Therapeutics (Pre-PICU)",
            instructions: [
              "Initiate rescue therapy if child is failing standard weaning or show signs of exhaustion.",
              "Prepare for PICU transfer while administering rescue doses."
            ],
            prescriptions: [
              {
                drug: "Magnesium Sulfate (IV)",
                dose: "50 mg/kg (Max 2g)",
                route: "IV Infusion",
                frequency: "Single Dose",
                calculation: (w) => `${Math.min(w * 50, 2000).toFixed(0)} mg`,
                notes: "Infuse over 20m. Monitor for hypotension."
              }
            ]
          }
        ]
      },
      {
        label: "Discharge & Maintenance ICS",
        shortLabel: "Discharge & Maintenance ICS",
        color: "emerald",
        cards: [
          {
            title: "Maintenance Inhaled Steroids (ICS)",
            threshold: "PREVENTING READMISSION",
            instructions: [
              "ALL ward admissions should be considered for ICS initiation or upgrade.",
              "Standard Dose: Low-to-medium dose based on age.",
              "Instruction: Demonstrate MDI + Spacer technique to parents before discharge."
            ],
            prescriptions: [
              {
                drug: "Fluticasone Propionate (MDI)",
                dose: "100-250 mcg",
                route: "Inhaled",
                frequency: "Every 12 hours",
                calculation: (w) => "2 puffs (125mcg/puff)",
                notes: "Low dose: 100-200mcg/day; Medium: 200-400mcg/day."
              },
              {
                drug: "Budesonide (MDI)",
                dose: "200-400 mcg",
                route: "Inhaled",
                frequency: "Every 12 hours",
                calculation: (w) => "2 puffs (200mcg/puff)",
                notes: "Rinse mouth after use to prevent candidiasis."
              }
            ]
          },
          {
            title: "Home Transition Criteria",
            instructions: [
              "1. Stable on q4h Salbutamol for 24 hours.",
              "2. SpO2 > 94% on Room Air for 12 hours.",
              "3. Written Asthma Action Plan (AAP) completed.",
              "4. Steroids: Continue PO Prednisolone for a total of 3-5 days."
            ]
          },
          {
            title: "The 48h Safety Net",
            instructions: [
              "Clinical Review: Mandatory within 48-72 hours by GP or clinic.",
              "Education: Ensure parents know 'Return to ED' triggers (Grunting, poor response to Salbutamol)."
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
    { title: "GINA 2024: Global Strategy for Asthma", url: "https://ginasthma.org/" },
    { title: "PRAM Score: Validation and Use in Pediatrics", url: "https://pubmed.ncbi.nlm.nih.gov/11138210/" },
    { title: "RCH Melbourne: Asthma Inpatient Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/Asthma_acute/" }
  ],
};
