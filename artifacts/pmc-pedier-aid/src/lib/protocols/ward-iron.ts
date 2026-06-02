import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Acute Iron Toxicity
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: ACMT Guidelines and RCH Melbourne.
 */
export const wardIronProtocol: DiseaseProtocol = {
  id: 'ward-iron-master',
  name: 'Iron Toxicity Master Pathway',
  system: 'Poisoning and Toxins',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Iron poisoning is a major cause of pediatric poisoning death. Iron is directly corrosive and causes cellular toxicity by disrupting oxidative phosphorylation. Management focuses on Whole Bowel Irrigation for visible tablets and IV Chelation with Deferoxamine for systemic toxicity.',
  image: {
    url: "https://images.unsplash.com/photo-1550505393-3c5598687442?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Systemic metal toxicity"
  },
  questions: [
    { id: 'weight', questionText: 'Current Body Weight', type: 'number', unit: 'kg' },
    { id: 'elemental_iron', questionText: 'Estimated Elemental Iron', type: 'number', unit: 'mg/kg' },
    { id: 'serum_iron', questionText: 'Peak Serum Iron (4-6h)', type: 'number', unit: 'mcg/dL' },
    { id: 'vomiting', questionText: 'Persistent Vomiting or Hematemesis', type: 'boolean' },
  ], 

  mmpData: {
    snapshot: "Management centers on recognizing the 5 stages of iron toxicity. X-ray is the Step 0 diagnostic tool to identify radiopaque tablets. Whole Bowel Irrigation (WBI) is required if tablets are present. Ingestions > 60 mg/kg or serum levels > 500 mcg/dL require IV chelation with Deferoxamine. Watch for the 'Latent Phase' (6-24 hours) where the child appears stable while systemic injury progresses.",
    stages: [
      {
        label: "Stage 1: Diagnosis & Decontamination",
        shortLabel: "Assessment/GI",
        color: "blue",
        cards: [
          {
            title: "Step 0: Radiographic Diagnosis [DR]",
            threshold: "IMMEDIATE",
            orders: [
              "Abdominal X-ray: Mandatory for all suspected toxic iron ingestions. Most iron tablets (multivitamins, prenatal) are radiopaque.",
              "Interpretation: If clusters of tablets are visible, proceed directly to Whole Bowel Irrigation (WBI).",
              "Note: Liquid iron or chewable vitamins may not be visible."
            ]
          },
          {
            title: "Laboratory Evaluation [DR]",
            orders: [
              "Serum Iron Level: Draw at 4 to 6 hours post-ingestion (earlier levels are not predictive).",
              "TIBC (Total Iron Binding Capacity): Only useful if serum iron is drawn simultaneously.",
              "CBC: Look for Leukocytosis (> 15,000) as an early predictor of toxicity.",
              "Metabolic Panel: VBG for metabolic acidosis (Lactate), Liver function tests (AST/ALT), and Glucose (> 150 mg/dL is a predictor)."
            ]
          },
          {
            title: "Whole Bowel Irrigation (WBI)",
            threshold: "IF TABLETS VISIBLE",
            instructions: [
              "Agent: PEG solution (GoLYTELY).",
              "Pediatric Rate: 25-40 mL/kg/hour via Nasogastric Tube.",
              "Goal: Continue until rectal effluent is clear. Do NOT use activated charcoal (does not bind iron)."
            ]
          }
        ]
      },
      {
        label: "Stage 2: 1st Line Antidote (Chelation)",
        shortLabel: "Chelation",
        color: "amber",
        cards: [
          {
            title: "IV Deferoxamine Infusion [DR]",
            threshold: "LEVEL > 500 mcg/dL OR SHOCK",
            calculator: {
              id: "iron-chelation-calc",
              title: "Iron Chelation Calculator"
            },
            orders: [
              "Indication: Serum iron > 500 mcg/dL (90 µmol/L), metabolic acidosis, or cardiovascular instability.",
              "Infusion Rate: Start at 5 mg/kg/hr. Increase gradually to 15 mg/kg/hr if no hypotension occurs.",
              "Vin-rose Sign: Red/orange urine color is expected during successful chelation.",
              "Duration: Continue until serum iron < 350 mcg/dL and the patient is clinically stable."
            ]
          },
          {
            title: "Nursing: Hemodynamic Monitoring [NS]",
            isCritical: true,
            nursing: [
              "Blood Pressure: Deferoxamine can cause rapid hypotension if infused too fast.",
              "Urine Monitoring: Hourly recording of volume and color (Vin-rose check).",
              "Neuro Checks: Frequent assessment for lethargy or confusion."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Multi-Organ & Critical Care",
        shortLabel: "Critical Support",
        color: "red",
        cards: [
          {
            title: "Senior Triggers for Shock [!]",
            isCritical: true,
            triggers: [
              "IF Refractory metabolic acidosis (persistent high anion gap) occurs.",
              "IF Cardiogenic or Distributive shock develops (Hypotension, cold peripheries).",
              "IF Hematemesis or massive GI bleeding is present (corrosive phase).",
              "IF Fulminant hepatic failure (AST/ALT > 1000) develops."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data) => {
    const iron = Number(data.serum_iron);
    if (iron > 500 || data.vomiting) return { level: 'critical', details: ["Severe Toxicity: High risk for systemic shock. Immediate chelation and PICU consult."] };
    if (iron > 350) return { level: 'severe', details: ["Moderate Toxicity: Admit for chelation or very close observation if levels are stable."] };
    return { level: 'moderate', details: ["Minor Ingestion: Observe for 6 hours. If iron level < 350 and no symptoms, may discharge."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Asymptomatic for 6-12 hours with no persistent vomiting.",
    "Peak serum iron level is < 350 mcg/dL and stable.",
    "No metabolic acidosis or liver function abnormalities.",
    "Repeat X-ray shows no remaining tablets in the GI tract.",
    "Outpatient GI follow-up for potential gastric scarring/strictures in 4 weeks."
  ],
  getRedFlags: [
    "Hematemesis (Vomiting blood)",
    "Hypotension and poor perfusion",
    "Persistent lethargy during the 'Latent Phase'",
    "Severe anion gap acidosis"
  ],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "ACMT: Position Statement on Management of Iron Poisoning", url: "https://www.acmt.net/Iron_Poisoning.html" },
    { title: "RCH Melbourne: Iron Poisoning", url: "https://www.rch.org.au/clinicalguide/guideline_index/Iron_poisoning/" }
  ],
};
