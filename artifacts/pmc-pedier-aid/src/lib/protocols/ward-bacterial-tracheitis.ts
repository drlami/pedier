import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Bacterial Tracheitis (Toxic Laryngotracheobronchitis)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: RCH Melbourne, UpToDate (2024), and AAP Red Book
 */
export const wardBacterialTracheitisProtocol: DiseaseProtocol = {
  id: 'ward-bacterial-tracheitis',
  name: 'Bacterial Tracheitis Master Pathway',
  system: 'Respiratory System',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Exhaustive consultant-level directive for the toxic airway: Early ENT/PICU involvement, aggressive IV broad-spectrum antibiotics, and airway security mandates.',
  image: {
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Critical airway management"
  },
  questions: [], 

  mmpData: {
    stages: [
      {
        label: "The 'Toxic Croup' Directive (Hour 0-2)",
        shortLabel: "The 'Toxic Croup' Directive (Hour 0-2)",
        color: "red",
        cards: [
          {
            title: "When to Suspect (Consultant Level)",
            threshold: "NOT VIRAL CROUP IF:",
            instructions: [
              "1. High Fever: Sustained T > 39°C (Rare in viral croup).",
              "2. Toxic Appearance: Pale, mottled, lethargic, or poorly perfused.",
              "3. Adrenaline Failure: No improvement or worsening after nebulized adrenaline.",
              "4. Productive Cough: Thick, purulent secretions (often coughed up)."
            ]
          },
          {
            title: "Immediate 'Airway Security' Orders",
            isCritical: true,
            instructions: [
              "1. Consult ENT & PICU: Mandatory immediately upon suspicion.",
              "2. Minimal Handling: Keep the child calm with parents; no upsetting procedures until team ready.",
              "3. Preparation: Ensure difficult airway equipment (smaller tubes) is at bedside.",
              "4. Transfer: Move to HDU/PICU for continuous observation."
            ]
          },
          {
            title: "Mandatory Admission Labs",
            instructions: [
              "1. CBC with Diff: Expect high WBC with left shift.",
              "2. Blood Cultures: Required before antibiotics.",
              "3. Tracheal Aspirate Culture: Mandatory if intubated (Highest yield).",
              "4. VBG/Capillary Gas: Assess for respiratory acidosis/exhaustion."
            ]
          }
        ]
      },
      {
        label: "Initial IV Antibiotic Strategy",
        shortLabel: "Initial IV Antibiotic Strategy",
        color: "blue",
        cards: [
          {
            title: "1st-Line Empirical Directive",
            threshold: "START IMMEDIATELY",
            instructions: [
              "Target Pathogens: S. aureus (including MRSA), S. pyogenes, S. pneumoniae, H. influenzae.",
              "Broad coverage is essential due to high risk of airway obstruction."
            ],
            prescriptions: [
              {
                drug: "Ceftriaxone (IV)",
                dose: "80 mg/kg",
                route: "IV",
                frequency: "Once daily",
                calculation: (w) => `${Math.min(80 * w, 2000).toFixed(0)} mg`,
                notes: "Max 2g. Covers GNR and S. pneumoniae."
              },
              {
                drug: "Clindamycin (IV)",
                dose: "10 mg/kg",
                route: "IV",
                frequency: "Every 8 hours",
                calculation: (w) => `${(10 * w).toFixed(0)} mg`,
                notes: "Covers S. aureus (including MRSA) and anaerobes."
              }
            ]
          },
          {
            title: "Alternative: Vancomycin Option",
            threshold: "IF SEVERE SEPSIS / KNOWN MRSA",
            instructions: [
              "Consider replacing Clindamycin with Vancomycin if patient is hemodynamically unstable."
            ],
            prescriptions: [
              {
                drug: "Vancomycin (IV)",
                dose: "15 mg/kg",
                route: "IV",
                frequency: "Every 6-8 hours",
                calculation: (w) => `${(15 * w).toFixed(0)} mg`,
                notes: "Target trough levels per local policy."
              }
            ]
          }
        ]
      },
      {
        label: "Complication Management",
        shortLabel: "Complication Management",
        color: "amber",
        cards: [
          {
            title: "Complication 1: MUCUS PLUGGING",
            threshold: "URGENT THREAT",
            isCritical: true,
            instructions: [
              "Triggers: Sudden desaturation, silent chest, or loss of air entry.",
              "Action: Urgent tracheal suctioning. If intubated, perform saline-assisted suctioning.",
              "ENT Action: Rigid Bronchoscopy for removal of thick pseudomembranes."
            ]
          },
          {
            title: "Complication 2: SEPTIC SHOCK",
            instructions: [
              "Monitor for tachycardia and capillary refill > 3s.",
              "Fluid Resuscitation: 10-20 mL/kg Isotonic boluses.",
              "Support: Inotrope initiation early if refractory to fluids."
            ]
          }
        ]
      },
      {
        label: "Recovery & Duration",
        shortLabel: "Recovery & Duration",
        color: "emerald",
        cards: [
          {
            title: "Treatment Duration Roadmap",
            threshold: "CONSULTANT DIRECTIVE",
            instructions: [
              "1. Total Course: 10-14 days minimum.",
              "2. IV Duration: At least 5-7 days until afebrile for 48h and secretions reduced.",
              "3. Oral Step-down: Based on sensitivities (e.g. Augmentin or Clindamycin PO)."
            ]
          },
          {
            title: "Discharge & Follow-up",
            instructions: [
              "1. Airway Safety: No stridor at rest for > 48h.",
              "2. Follow-up: Mandatory Pediatric Clinic review in 1 week.",
              "3. Recovery: Pulmonary function is usually normal after recovery."
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
    { title: "RCH Melbourne: Bacterial Tracheitis", url: "https://www.rch.org.au/clinicalguide/guideline_index/Bacterial_tracheitis/" },
    { title: "UpToDate: Bacterial Tracheitis in Children (2024)", url: "https://www.uptodate.com/contents/bacterial-tracheitis-in-children-management" },
    { title: "AAP Red Book: Staphylococcal Infections", url: "https://publications.aap.org/redbook" }
  ],
};
