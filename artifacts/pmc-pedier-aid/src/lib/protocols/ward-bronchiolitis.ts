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
  description: 'Evidence-based supportive care: Minimal intervention excellence, NG hydration roadmap, oxygen targets, and HFNC escalation triggers.',
  image: {
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Infant respiratory support"
  },
  questions: [], 

  mmpData: {
    stages: [
      {
        label: "Admission & Support Directive",
        shortLabel: "Admission & Support Directive",
        color: "blue",
        cards: [
          {
            title: "Phase 1: Minimal Intervention Rules",
            threshold: "DO NOT ORDER ROUTINELY",
            isCritical: true,
            instructions: [
              "1. No Salbutamol/Bronchodilators: Ineffective in bronchiolitis (AAP/NICE).",
              "2. No Systemic Steroids: Do not reduce admission rate or stay.",
              "3. No Antibiotics: Unless strong suspicion of secondary bacterial infection (Rare).",
              "4. No Chest Physiotherapy: May increase distress and stay.",
              "5. No Routine CXR: Only if localized signs or severe failure."
            ]
          },
          {
            title: "Hydration Roadmap",
            threshold: "IF INTAKE < 50-75% BASELINE",
            instructions: [
              "1. NG Hydration (Preferred): 0.9% NaCl + 5% Dextrose. Maintains mucociliary clearance better than IV.",
              "2. IV Hydration: Only if NG is not tolerated or child is in severe distress/impending failure.",
              "3. Volume: Start at 2/3 (66%) maintenance to reduce SIADH/edema risk, titrate up to 100% as needed."
            ]
          },
          {
            title: "Admission Laboratories",
            threshold: "THRESHOLD-BASED",
            instructions: [
              "1. Viral PCR (RSV/Flu/MPV): Mandatory for ward isolation planning.",
              "2. VBG/Capillary Gas: Only if severe WOB or signs of exhaustion (pCO2 trend).",
              "Note: CBC/CRP are NOT routinely indicated and often misleading."
            ]
          }
        ]
      },
      {
        label: "Monitoring & Oxygen Targets",
        shortLabel: "Monitoring & Oxygen Targets",
        color: "amber",
        cards: [
          {
            title: "Wang Respiratory Scoring",
            threshold: "STANDARDIZED ASSESSMENT",
            calculator: {
              id: "wang-score",
              title: "Wang Score"
            },
            instructions: [
              "Mild (0-3) | Moderate (4-8) | Severe (9-12).",
              "Perform scoring every 4-6 hours to monitor support adequacy."
            ]
          },
          {
            title: "Oxygen Therapy Directive",
            threshold: "SPO2 TARGET 90-92%",
            instructions: [
              "1. Initial Target: Maintain SpO2 ≥ 90% (AAP) or ≥ 92% (NICE/RCH).",
              "2. Weaning: Once stable, wean O2 by 0.5L every 4h. Discontinue if SpO2 stable above target.",
              "3. Nasal Suction: Perform gentle superficial suctioning BEFORE feeds and sleep."
            ]
          },
          {
            title: "Standardized Monitoring",
            instructions: [
              "1. Respiratory Score (e.g. Wang Score) every 4-6 hours.",
              "2. Track Feeding Volumes: Mandatory 6-hourly totals (mL/kg).",
              "3. Apnea Watch: Continuous monitoring for infants < 2 months or ex-premature."
            ]
          }
        ]
      },
      {
        label: "Support Failure & Escalation",
        shortLabel: "Support Failure & Escalation",
        color: "red",
        cards: [
          {
            title: "HFNC / CPAP Triggers",
            threshold: "IF FAILING STANDARD OXYGEN",
            isCritical: true,
            instructions: [
              "1. Persistent SpO2 < 90% despite 2L/min low-flow oxygen.",
              "2. Rising Respiratory Rate: RR > 70-80 or rising trend.",
              "3. Increasing Work of Breathing: Severe retractions or grunting.",
              "4. pCO2 > 50-55 mmHg on gas (Respiratory Acidosis).",
              "ACTION: Start High Flow Nasal Cannula (HFNC) at 2L/kg/min or CPAP 5-7 cmH2O."
            ]
          },
          {
            title: "Secondary Infection Watch",
            threshold: "IF SYSTEMICALLY UNWELL",
            instructions: [
              "Criteria: New onset high fever (> 39°C), focal consolidation on CXR, or rising CRP/PCT.",
              "Action: Obtain Blood Culture and consider IV Antibiotics (Ampicillin/Ceftriaxone)."
            ]
          }
        ]
      },
      {
        label: "Weaning & Discharge",
        shortLabel: "Weaning & Discharge",
        color: "emerald",
        cards: [
          {
            title: "Discharge Milestones",
            threshold: "NON-NEGOTIABLE",
            instructions: [
              "1. Stable SpO2: Above target (90 or 92%) on Room Air for 4-12 hours (including sleep).",
              "2. Feeding: Tolerating > 60-75% of baseline fluid requirement orally.",
              "3. WOB: Minimal/mild distress only.",
              "4. Caregivers: Competent in nasal suctioning and recognize red flags."
            ]
          },
          {
            title: "Safety Netting & Follow-up",
            instructions: [
              "1. Natural History: Educate parents that cough may last 3-4 weeks.",
              "2. Red Flags: Poor feeding, increased WOB, or apnea.",
              "3. Clinic Review: GP/Clinic review in 48-72 hours if early discharge."
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
