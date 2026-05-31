import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Pleural Effusion & Empyema
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: BTS Guidelines for Pleural Infection in Children, AAP, and RCH Melbourne
 */
export const wardPleuralEffusionProtocol: DiseaseProtocol = {
  id: 'ward-pleural-effusion',
  name: 'Pleural Effusion & Empyema Pathway',
  system: 'Respiratory System',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Exhaustive consultant-level directive: Pleural fluid interpretation, surgical decision tree (VATS vs Pigtail), and aggressive medical therapy.',
  image: {
    url: "https://images.unsplash.com/photo-1579152276502-545a248a69a7?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Ultrasound-guided pleural drainage"
  },
  questions: [], 

  mmpData: {
    stages: [
      {
        label: "Diagnostics & Fluid Interpretation",
        shortLabel: "Diagnostics & Fluid Interpretation",
        color: "blue",
        cards: [
          {
            title: "Phase 1: Advanced Radiology",
            threshold: "URGENT ON SUSPICION",
            instructions: [
              "1. Chest Ultrasound (US): MANDATORY first-line tool. Identify fluid depth, fibrin strands, and loculations.",
              "2. CXR (Lateral Decubitus): Only if US is unavailable to assess for free-flowing fluid.",
              "3. Chest CT with Contrast: Not routine; reserved for suspected lung abscess or failed surgical intervention."
            ]
          },
          {
            title: "Pleural Fluid Biochemical Targets",
            threshold: "IF THORACOCENTESIS PERFORMED",
            instructions: [
              "1. pH < 7.2: Highly suggestive of empyema; usually requires drainage.",
              "2. Glucose < 40 mg/dL (2.2 mmol/L): Strong indicator for chest tube.",
              "3. LDH > 1000 IU/L: Suggestive of complicated parapneumonic effusion.",
              "4. Gram Stain & Culture: Send for aerobic/anaerobic culture and Pneumococcal PCR if possible."
            ]
          },
          {
            title: "Mandatory Admission Labs",
            instructions: [
              "1. Blood Cultures: Pre-antibiotic (if not done).",
              "2. Serum Albumin: Low levels are common and predict prolonged drainage.",
              "3. S. Electrolytes: Strict monitor for SIADH/Hyponatremia.",
              "4. CBC & CRP: To track daily inflammatory response."
            ]
          }
        ]
      },
      {
        label: "Medical Therapy & Duration",
        shortLabel: "Medical Therapy & Duration",
        color: "amber",
        cards: [
          {
            title: "Aggressive IV Antibiotic Strategy",
            threshold: "START IMMEDIATELY",
            instructions: [
              "Target Pathogens: S. pneumoniae, S. aureus (including MRSA), and S. pyogenes.",
              "Duration: Minimum 2-4 weeks total (At least 10-14 days IV until stable)."
            ],
            prescriptions: [
              {
                drug: "Tazocin (Piperacillin-Tazobactam)",
                dose: "90 mg/kg",
                route: "IV",
                frequency: "Every 6 hours",
                calculation: (w) => `${(90 * w).toFixed(0)} mg`,
                notes: "Excellent choice for broad-spectrum and anaerobic coverage."
              },
              {
                drug: "Clindamycin (IV)",
                dose: "10 mg/kg",
                route: "IV",
                frequency: "Every 8 hours",
                calculation: (w) => `${(10 * w).toFixed(0)} mg`,
                notes: "ADD if S. aureus or MRSA is highly suspected."
              }
            ]
          }
        ]
      },
      {
        label: "Surgical Decision Tree",
        shortLabel: "Surgical Decision Tree",
        color: "red",
        cards: [
          {
            title: "Surgical Options & Triggers",
            isCritical: true,
            instructions: [
              "1. Pigtail Catheter (Small bore): For small-to-moderate non-loculated fluid.",
              "2. Intrapleural Fibrinolytics (tPA/Urokinase): Use if loculations present to avoid VATS. Dose: 0.1 mg/kg (Max 4mg) tPA BID for 3 days.",
              "3. VATS (Video-Assisted Thoracoscopic Surgery): GOLD STANDARD for loculated empyema (Type II/III). Early VATS is superior to repeat drainage.",
              "4. Decortication (Open Surgery): Reserved for thick pleural 'peel' or failed VATS."
            ]
          },
          {
            title: "When to Consult Pediatric Surgery",
            threshold: "CONSULTANT TRIGGER",
            instructions: [
              "1. Fluid depth > 10mm on ultrasound.",
              "2. Evidence of loculations or 'fibrin lattice' on US.",
              "3. Failure of respiratory improvement after 24-48h of correct medical therapy."
            ]
          }
        ]
      },
      {
        label: "Resolution & Discharge",
        shortLabel: "Resolution & Discharge",
        color: "emerald",
        cards: [
          {
            title: "Step-Down Rx & Recovery",
            threshold: "HOME DIRECTIVE",
            instructions: [
              "1. Duration: Total 3-4 week course (IV + PO).",
              "2. Physiotherapy: Active mobilization and breathing exercises are essential.",
              "3. Discharge: Afebrile 24h + SpO2 normal on RA + Chest tube removed > 24h."
            ],
            prescriptions: [
              {
                drug: "Amoxicillin-Clavulanate (Augmentin)",
                dose: "45 mg/kg (of Amox)",
                route: "PO",
                frequency: "Every 12 hours",
                calculation: (w) => `${(45 * w).toFixed(0)} mg`,
                notes: "High-dose required for empyema step-down."
              }
            ]
          },
          {
            title: "Resolution Imaging Directive",
            threshold: "AT 4-6 WEEKS",
            instructions: [
              "Repeat CXR: MANDATORY to ensure full radiographic resolution of empyema.",
              "Follow-up: Clinical review by Pediatric Respiratory team."
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
    { title: "BTS Guideline for the Management of Pleural Infection in Children", url: "https://www.brit-thoracic.org.uk/quality-improvement/guidelines/pleural-infection-in-children/" },
    { title: "RCH Melbourne: Empyema Management", url: "https://www.rch.org.au/clinicalguide/guideline_index/Empyema/" },
    { title: "AAP: Red Book - Pneumococcal Empyema", url: "https://publications.aap.org/redbook" }
  ],
};
