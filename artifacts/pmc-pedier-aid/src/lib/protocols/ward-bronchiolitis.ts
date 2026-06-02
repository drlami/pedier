import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Bronchiolitis Inpatient Management
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: AAP 2014 (reaffirmed), NICE [NG9], and RCH Melbourne Guidelines
 */
export const wardBronchiolitisProtocol: DiseaseProtocol = {
  id: 'ward-bronchiolitis-management',
  name: 'Bronchiolitis Inpatient Pathway',
  system: 'Respiratory System',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Bronchiolitis is an acute viral infection of the lower respiratory tract, primarily affecting infants under 2 years of age, characterized by airway inflammation and mucus plugging. This pathway emphasizes evidence-based supportive care, focusing on minimal intervention excellence (avoiding unnecessary bronchodilators, steroids, or chest physiotherapy), standardized hydration strategies (Nasogastric preferred), and precise oxygen escalation triggers.',
  image: {
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Infant respiratory support"
  },
  questions: [], 

  mmpData: {
    snapshot: "Management of Bronchiolitis is centered on 'Supportive Excellence': (1) Oxygenation (Target SpO2 90-92%), (2) Hydration (Nasogastric or Intravenous if oral intake fails), and (3) Secretion Clearance (Gentle nasal suctioning). Routine use of Salbutamol, steroids, or chest physiotherapy is not recommended and may cause harm. Monitoring for apnea is critical in infants under 2 months of age or those born prematurely.",
    stages: [
      {
        label: "Stage 1: Admission & Support Directive",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Minimal Intervention Rules",
            threshold: "DO NOT ORDER ROUTINELY",
            isCritical: true,
            orders: [
              "No Salbutamol/Bronchodilators: Proven ineffective in bronchiolitis as the mechanism is mucus plugging, not bronchospasm.",
              "No Systemic Steroids: Do not reduce admission rate or duration of stay.",
              "No Routine Antibiotics: Bronchiolitis is viral; only use if secondary bacterial pneumonia is strongly suspected.",
              "No Chest Physiotherapy: May increase infant distress and does not improve outcomes.",
              "No Routine Chest X-Ray: Only indicated if there are focal lung signs (suggesting consolidation) or sudden clinical deterioration."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Viral Identification: Order Respiratory Viral Panel (RSV, Influenza, COVID-19) for cohorting and isolation planning.",
              "Hydration Assessment: Evaluate for signs of dehydration (sunken fontanelle, dry mucous membranes, reduced wet diapers).",
              "Respiratory Scoring: Initiate standardized scoring (e.g., Wang Score) every 4-6 hours.",
              "Apnea Precautions: Continuous monitoring for infants < 2 months of age or those born prematurely."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Hydration & Oxygen Titration",
        shortLabel: "Management",
        color: "amber",
        cards: [
          {
            title: "Hydration Roadmap",
            threshold: "IF INTAKE < 50-75% BASELINE",
            orders: [
              "Nasogastric (NG) Hydration (Preferred): Use 0.9% Sodium Chloride + 5% Dextrose. Maintains mucociliary clearance better than intravenous fluids.",
              "Intravenous (IV) Hydration: Reserve for infants in severe respiratory distress or those who do not tolerate NG tubes.",
              "Fluid Volume: Start at 2/3 (66%) maintenance to reduce the risk of SIADH (fluid retention), titrating up to 100% as needed."
            ]
          },
          {
            title: "Oxygen Therapy Directive",
            threshold: "SPO2 TARGET 90-92%",
            orders: [
              "Initial Target: Maintain Oxygen Saturation (SpO2) ≥ 90% (per AAP) or ≥ 92% (per NICE/RCH).",
              "Weaning: Once stable, wean oxygen by 0.5 Liters/minute every 4 hours. Discontinue if SpO2 remains stable above target.",
              "Suctioning: Perform gentle, superficial nasal suctioning BEFORE feeds and sleep to clear obstructing mucus."
            ]
          },
          {
            title: "Nursing: Strict Monitoring [NS]",
            nursing: [
              "Respiratory Rate and Wang Score assessment every 4 hours.",
              "Strict Intake and Output charting: Mandatory 6-hourly fluid totals (mL/kg).",
              "Positioning: Keep head of bed elevated to 30 degrees to optimize respiratory effort.",
              "Observe for Apnea: Immediate notification if pause in breathing > 20 seconds or associated with bradycardia."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Support Failure & Escalation",
        shortLabel: "Escalation",
        color: "red",
        cards: [
          {
            title: "HFNC / CPAP Triggers",
            threshold: "IF FAILING STANDARD OXYGEN",
            isCritical: true,
            orders: [
              "Clinical Failure: Persistent SpO2 < 90% despite 2 Liters/minute of low-flow oxygen.",
              "Rising Effort: Respiratory Rate > 70-80 breaths/minute or severe chest retractions/grunting.",
              "Exhaustion: Rising pCO2 on Blood Gas (Respiratory Acidosis).",
              "ACTION: Initiate High-Flow Nasal Cannula (HFNC) at 2 Liters/kg/minute or Continuous Positive Airway Pressure (CPAP) at 5-7 cmH2O."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Recovery & Discharge Planning",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Discharge Milestones",
            threshold: "NON-NEGOTIABLE",
            orders: [
              "Stable Oxygenation: Above target (90-92%) on Room Air for 4-12 hours (including a period of sleep).",
              "Effective Feeding: Tolerating > 60-75% of baseline fluid requirement orally without significant distress.",
              "Work of Breathing: Minimal to mild distress only.",
              "Caregiver Competence: Parents are comfortable with nasal suctioning and recognize 'Red Flags' (retractions, apnea)."
            ]
          },
          {
            title: "Follow-up",
            orders: [
              "Safety Netting: Educate parents that the post-viral cough may persist for 3-4 weeks.",
              "Clinic Review: Outpatient pediatric review within 48-72 hours if discharged early."
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
    { title: "AAP: Clinical Practice Guideline - Management of Bronchiolitis", url: "https://publications.aap.org/pediatrics/article/134/5/e1474/33030/" },
    { title: "NICE Guideline [NG9]: Bronchiolitis in Children", url: "https://www.nice.org.uk/guidance/ng9" },
    { title: "RCH Melbourne: Bronchiolitis Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/Bronchiolitis/" }
  ],
};
