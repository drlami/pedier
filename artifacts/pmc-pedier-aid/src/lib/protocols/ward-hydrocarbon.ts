import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Hydrocarbon Ingestion & Chemical Pneumonitis
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: ACMT Position Statement and RCH Melbourne.
 */
export const wardHydrocarbonProtocol: DiseaseProtocol = {
  id: 'ward-hydrocarbon-master',
  name: 'Hydrocarbon Toxicity Master Pathway',
  system: 'Poisoning and Toxins',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Hydrocarbons (gasoline, kerosene, lamp oil, furniture polish) primarily cause toxicity through aspiration, leading to severe chemical pneumonitis and surfactant destruction. Management centers on external decontamination and the early detection of delayed respiratory failure.',
  image: {
    url: "https://images.unsplash.com/photo-1576669801775-ff0d387da592?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Respiratory aspiration management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Body Weight', type: 'number', unit: 'kg' },
    { id: 'type', questionText: 'Hydrocarbon Type (Thin/Oily/Viscous)', type: 'text' },
    { id: 'cough', questionText: 'Choking or Coughing at time of ingestion?', type: 'boolean' },
    { id: 'fever', questionText: 'Fever (Chemical Pneumonitis)', type: 'boolean' },
    { id: 'rr', questionText: 'Respiratory Rate', type: 'number' },
  ], 

  mmpData: {
    snapshot: "NEVER induce emesis or give activated charcoal (increased aspiration risk). Most children are asymptomatic initially but can develop chemical pneumonitis 6-24 hours later. The presence of 'coughing or choking' at the time of ingestion strongly suggests aspiration. Delayed Chest X-ray at 6 hours is the Step 0 diagnostic gold standard.",
    stages: [
      {
        label: "Stage 1: Step 0 - Decontamination & Stabilization",
        shortLabel: "Stabilization",
        color: "red",
        cards: [
          {
            title: "Absolute Contraindications [!]",
            isCritical: true,
            instructions: [
              "DO NOT induce vomiting (Emesis).",
              "DO NOT perform gastric lavage.",
              "DO NOT give Activated Charcoal (hydrocarbons are not bound and it increases vomiting risk).",
              "DO NOT give prophylactic Antibiotics or Steroids."
            ]
          },
          {
            title: "Initial Assessment [DR]",
            orders: [
              "External Decontamination: Immediately remove all contaminated clothing and wash skin with soap and water to prevent secondary dermal absorption.",
              "Risk Screening: Ingestions of thin, volatile hydrocarbons (gasoline, kerosene) carry the HIGHEST aspiration risk.",
              "Stabilization: Maintain NPO status for at least 6 hours."
            ]
          }
        ]
      },
      {
        label: "Stage 2: 1st Line - Observation & Imaging",
        shortLabel: "Observation",
        color: "blue",
        cards: [
          {
            title: "Step 0 Diagnostic: Delayed X-ray [DR]",
            threshold: "6 HOURS POST-INGESTION",
            orders: [
              "Indication: Mandatory for all symptomatic patients or those with a history of coughing/choking.",
              "Timing: Perform Chest X-ray at exactly 6 hours. Early films are often falsely negative.",
              "Findings: Look for patchy infiltrates, atelectasis, or pleural effusions indicating chemical pneumonitis."
            ]
          },
          {
            title: "Nursing: Serial Monitoring [NS]",
            isCritical: true,
            nursing: [
              "Hourly Respiratory Rate and Work of Breathing checks.",
              "Continuous Pulse Oximetry (Target SpO2 > 94%).",
              "Monitor for 'Hydrocarbon Breath' (distinctive odor)."
            ]
          }
        ]
      },
      {
        label: "Stage 3: 2nd Line - Respiratory Support",
        shortLabel: "Management",
        color: "amber",
        cards: [
          {
            title: "Respiratory Directives [DR]",
            orders: [
              "Oxygen Support: Start supplemental O2 if SpO2 < 94% or if grunting/tachypnea present.",
              "Escalation: Use CPAP or High-Flow Nasal Cannula for moderate distress.",
              "Infection: ONLY start antibiotics if secondary bacterial infection is suspected (new fever > 48h or rising inflammatory markers)."
            ]
          },
          {
            title: "Senior Triggers for Critical Care [!]",
            isCritical: true,
            triggers: [
              "IF Patient has 'Sudden Death' risk (Sudden sniffing death) - Avoid epinephrine/exogenous catecholamines.",
              "IF Refractory hypoxemia despite non-invasive ventilation (Requires intubation).",
              "IF Altered Mental Status or Seizures occur (CNS toxicity)."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data) => {
    const rr = Number(data.rr);
    if (rr > 60 || data.fever) return { level: 'critical', details: ["Severe Pneumonitis: High risk for respiratory failure. Intensive care monitoring required."] };
    if (data.cough) return { level: 'severe', details: ["Suspected Aspiration: Admit for 6-hour observation and delayed X-ray."] };
    return { level: 'moderate', details: ["Possible Ingestion: Observe for 6 hours; if X-ray is clear and no distress, may discharge."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Asymptomatic for 6 hours post-ingestion with normal respiratory effort.",
    "Normal Chest X-ray performed at the 6-hour mark.",
    "Tolerating oral intake with no secondary vomiting.",
    "Family educated on the delayed nature of hydrocarbon toxicity."
  ],
  getRedFlags: [
    "Tachypnea and grunting",
    "Persistent coughing or choking",
    "Cyanosis",
    "Altered level of consciousness",
    "Fever within the first 24 hours"
  ],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "ACMT: Position Statement on Management of Hydrocarbon Ingestion", url: "https://www.acmt.net/Hydrocarbon_Ingestion.html" },
    { title: "RCH Melbourne: Hydrocarbon Poisoning", url: "https://www.rch.org.au/clinicalguide/guideline_index/Hydrocarbon_poisoning/" }
  ],
};
