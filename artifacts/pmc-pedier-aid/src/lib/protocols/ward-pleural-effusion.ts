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
  description: 'Pleural Effusion is the abnormal accumulation of fluid in the pleural space, often occurring as a complication of pneumonia (parapneumonic effusion). Empyema represents the advanced, purulent stage of this process, characterized by the presence of bacteria and inflammatory cells within the pleural fluid. This exhaustive directive covers pleural fluid interpretation, the surgical decision tree (VATS vs. Pigtail drainage), and aggressive medical therapy.',
  image: {
    url: "https://images.unsplash.com/photo-1579152276502-545a248a69a7?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Ultrasound-guided pleural drainage"
  },
  questions: [], 

  mmpData: {
    snapshot: "The management strategy centers on (1) Early identification of complicated effusions or empyema using Chest Ultrasound, (2) Aggressive intravenous antibiotic therapy covering Streptococcus pneumoniae and Staphylococcus aureus, and (3) Timely surgical intervention (Chest Tube drainage with fibrinolytics or Video-Assisted Thoracoscopic Surgery - VATS) for loculated or large, symptomatic collections. Clinicians must prioritize multidisciplinary care involving pediatric surgery and respiratory specialists.",
    stages: [
      {
        label: "Diagnostics & Fluid Interpretation",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Advanced Radiology Orders [DR]",
            orders: [
              "Chest Ultrasound: MANDATORY first-line tool to identify fluid depth, fibrin strands, and loculations.",
              "Chest X-Ray: Perform lateral decubitus views ONLY if Ultrasound is unavailable to assess for free-flowing fluid.",
              "Chest Computed Tomography (CT) with Contrast: Not routine; reserved for suspected lung abscess or failed surgical intervention."
            ]
          },
          {
            title: "Pleural Fluid Biochemical Targets",
            threshold: "IF THORACOCENTESIS PERFORMED",
            orders: [
              "pH Analysis: A pH < 7.2 is highly suggestive of empyema and usually requires drainage.",
              "Glucose Level: A level < 40 mg/dL is a strong indicator for chest tube placement.",
              "Lactate Dehydrogenase (LDH): A level > 1000 IU/L suggests a complicated parapneumonic effusion.",
              "Microbiology: Send for Gram Stain, aerobic/anaerobic Culture, and Pneumococcal Polymerase Chain Reaction (PCR)."
            ]
          },
          {
            title: "Nursing & Monitoring [NS]",
            nursing: [
              "Respiratory Assessment: Hourly checks for work of breathing, Respiratory Rate, and Oxygen Saturation.",
              "Chest Tube Care: If present, monitor hourly drainage volume and assess for 'swinging' or 'bubbling'.",
              "Positioning: Keep the patient in a comfortable position, often semi-upright or lying on the affected side.",
              "Fluid Balance: Strict Intake and Output charting; monitor for signs of Syndrome of Inappropriate Antidiuretic Hormone secretion (SIADH)."
            ]
          }
        ]
      },
      {
        label: "Medical Therapy & Duration",
        shortLabel: "Management",
        color: "amber",
        cards: [
          {
            title: "Aggressive Intravenous Antibiotic Strategy",
            threshold: "START IMMEDIATELY",
            orders: [
              "Target Pathogens: Streptococcus pneumoniae, Staphylococcus aureus, and Streptococcus pyogenes.",
              "Duration: Minimum 2-4 weeks total course (At least 10-14 days Intravenous until clinical stability)."
            ],
            prescriptions: [
              {
                drug: "Piperacillin-Tazobactam",
                dose: "90 mg/kg",
                route: "Intravenous",
                frequency: "Every 6 hours",
                calculation: (w) => `${Math.min(90 * w, 4500).toFixed(0)} mg`,
                notes: "Broad-spectrum coverage including anaerobes. Maximum 4.5 grams."
              },
              {
                drug: "Clindamycin",
                dose: "10 mg/kg",
                route: "Intravenous",
                frequency: "Every 8 hours",
                calculation: (w) => `${Math.min(10 * w, 600).toFixed(0)} mg`,
                notes: "Add if Methicillin-Resistant Staphylococcus aureus (MRSA) is suspected."
              }
            ]
          }
        ]
      },
      {
        label: "Surgical Decision Tree",
        shortLabel: "Escalation",
        color: "red",
        cards: [
          {
            title: "Surgical Options & Triggers",
            isCritical: true,
            orders: [
              "Pigtail Catheter (Small bore): For small-to-moderate non-loculated fluid collections.",
              "Intrapleural Fibrinolytics: Use tissue Plasminogen Activator (tPA) or Urokinase if loculations are present to avoid major surgery.",
              "Video-Assisted Thoracoscopic Surgery (VATS): Gold standard for loculated empyema (Type II/III).",
              "Urgent Pediatric Surgery Consultation: Required if fluid depth > 10 mm on ultrasound or if fibrin lattice is present."
            ]
          }
        ]
      },
      {
        label: "Resolution & Discharge",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Transition to Oral Therapy",
            threshold: "CLINICALLY STABLE",
            orders: [
              "Total Course: 3-4 weeks (Intravenous plus Oral step-down).",
              "Physiotherapy: Active mobilization and breathing exercises are essential for lung re-expansion.",
              "Discharge Criteria: Afebrile for 24 hours, normal Oxygen Saturation on Room Air, and Chest Tube removed for > 24 hours."
            ],
            prescriptions: [
              {
                drug: "Amoxicillin-Clavulanate",
                dose: "45 mg/kg (of Amoxicillin)",
                route: "Oral",
                frequency: "Every 12 hours",
                calculation: (w) => `${(45 * w).toFixed(0)} mg`,
                notes: "High-dose roadmap for empyema step-down."
              }
            ]
          },
          {
            title: "Follow-up Mandate",
            orders: [
              "Repeat Chest X-Ray: Mandatory at 4-6 weeks to ensure full radiographic resolution of the empyema.",
              "Specialist Review: Schedule clinical review by the Pediatric Respiratory team."
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
