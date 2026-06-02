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
  description: 'Bacterial Tracheitis is a rare but life-threatening invasive infection of the subglottic trachea, often following a viral respiratory illness. This pathway provides a high-acuity management plan for children with a "toxic" appearance who fail to respond to standard croup treatments, emphasizing early Ear, Nose, and Throat (ENT) and Pediatric Intensive Care Unit (PICU) involvement, airway security, and aggressive broad-spectrum intravenous antibiotic therapy.',
  image: {
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Critical airway management"
  },
  questions: [], 

  mmpData: {
    snapshot: "Bacterial Tracheitis is a critical airway emergency characterized by high fever, a toxic appearance, and failure to respond to nebulized adrenaline (unlike viral croup). Management prioritizes airway security, often requiring intubation and bronchoscopy to remove thick, obstructive tracheal secretions. Immediate involvement of ENT and PICU is mandatory. Avoid upsetting the child unnecessarily to prevent sudden airway closure.",
    stages: [
      {
        label: "Stage 1: Identification & Airway Security",
        shortLabel: "Assessment",
        color: "red",
        cards: [
          {
            title: "Suspecting Bacterial Tracheitis",
            threshold: "NOT VIRAL CROUP IF:",
            orders: [
              "High Fever: Sustained temperature > 39°C (Rare in viral croup).",
              "Toxic Appearance: Child looks pale, mottled, lethargic, or has poor perfusion.",
              "Adrenaline Failure: No clinical improvement after nebulized adrenaline.",
              "Purulent Secretions: Productive cough with thick, yellow/green secretions (membranes)."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            isCritical: true,
            orders: [
              "Mandatory Consultation: Immediately notify ENT Surgeons and PICU team.",
              "Minimal Handling: Keep the child calm in a position of comfort (usually in the parent's lap). Avoid invasive procedures until the airway team is ready.",
              "Diagnostic Preparation: Order a Lateral Neck X-Ray ONLY if stable; look for 'steeple sign' or ragged tracheal column (subglottic narrowing).",
              "Laboratory Screening: Complete Blood Count (CBC) with Differential and Blood Cultures.",
              "Tracheal Culture: Mandatory if the patient is intubated (Highest diagnostic yield)."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Emergency IV Antibiotic Strategy",
        shortLabel: "Management",
        color: "blue",
        cards: [
          {
            title: "Broad-Spectrum Empirical Coverage",
            threshold: "START IMMEDIATELY",
            orders: [
              "Target Pathogens: Staphylococcus aureus (including MRSA), Streptococcus pyogenes, and Streptococcus pneumoniae.",
              "Initial therapy must cover both Gram-positive and Gram-negative organisms."
            ],
            prescriptions: [
              {
                drug: "Ceftriaxone",
                dose: "80 mg/kg",
                route: "Intravenous",
                frequency: "Once daily",
                calculation: (w) => `${Math.min(80 * w, 2000).toFixed(0)} mg`,
                notes: "Maximum dose: 2g. Provides Gram-negative and Pneumococcal coverage."
              },
              {
                drug: "Clindamycin",
                dose: "10 mg/kg",
                route: "Intravenous",
                frequency: "Every 8 hours",
                calculation: (w) => `${(10 * w).toFixed(0)} mg`,
                notes: "Provides coverage for MRSA and anaerobic organisms."
              }
            ]
          },
          {
            title: "Nursing: Strict Monitoring [NS]",
            nursing: [
              "Continuous Cardiorespiratory and Pulse Oximetry monitoring.",
              "Maintain 'Blow-by' oxygen if the child tolerates it; do not force a mask if it causes distress.",
              "Prepare Emergency Equipment: Have appropriate-sized ET tubes (including one size smaller) and suction ready at the bedside.",
              "Observe for Mucus Plugging: Sudden silence, loss of air entry, or rapid desaturation requires immediate action."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Complication & Crisis Management",
        shortLabel: "Critical Care",
        color: "amber",
        cards: [
          {
            title: "Mucus Plug Crisis",
            threshold: "URGENT LIFE-THREAT",
            isCritical: true,
            orders: [
              "Clinical Triggers: Sudden desaturation, 'silent chest' on auscultation, or respiratory arrest.",
              "Emergency Action: Immediate bag-valve-mask ventilation and notify ENT for emergency rigid bronchoscopy to remove thick secretions.",
              "If intubated: Perform saline-assisted tracheal suctioning immediately."
            ]
          },
          {
            title: "Sepsis Support",
            orders: [
              "Fluid Resuscitation: 10-20 mL/kg Isotonic Saline boluses for poor perfusion.",
              "Hemodynamic Support: Early initiation of inotropes if shock persists despite fluids."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Recovery & Duration",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Treatment Roadmap",
            orders: [
              "Total Antibiotic Duration: 10-14 days total course.",
              "Step-down Strategy: Transition to oral antibiotics (e.g., Co-amoxiclav or Clindamycin) once afebrile for 48 hours and airway is stable.",
              "Discharge Readiness: No stridor at rest for > 48 hours and completing oral course.",
              "Follow-up: Pediatric Clinic review in 1 week to ensure complete resolution."
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
