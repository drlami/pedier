import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Urea Cycle Disorders (UCD) / Hyperammonemia
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: BIMDG Guidelines, European guidelines for UCDs, and RCH Melbourne
 */
export const wardUreaCycleProtocol: DiseaseProtocol = {
  id: 'ward-urea-cycle',
  name: 'Urea Cycle Disorders Master Pathway',
  system: 'Metabolic Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Urea Cycle Disorders (UCDs) are a group of inherited genetic defects in the enzymes responsible for detoxifying ammonia into urea, leading to rapid, life-threatening hyperammonemia and encephalopathy. This exhaustive directive covers emergency catabolic suppression, precise administration of intravenous nitrogen scavengers, and critical thresholds for hemodialysis.',
  image: {
    url: "https://images.unsplash.com/photo-1576089234161-460d3d523b0a?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Critical hyperammonemia and encephalopathy management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'ammoniaLevel', questionText: 'Initial Ammonia Level (micromol/L)', type: 'number' },
    { id: 'encephalopathy', questionText: 'Signs of encephalopathy (Lethargy, vomiting, seizures, coma)?', type: 'boolean' },
    { id: 'knownDefect', questionText: 'Known specific enzyme defect (e.g., OTC, ASS, ASL)?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Management of Urea Cycle Disorders focuses on three urgent pillars: (1) Reversing catabolism immediately with high-dose intravenous Dextrose (and Lipids if FAOD is excluded), (2) Activating alternate pathways for waste nitrogen excretion using Sodium Benzoate and Sodium Phenylbutyrate, and (3) Preparing for emergency Continuous Venovenous Hemodiafiltration (CVVHDF) if ammonia exceeds 400-500 micromol/L or fails to fall rapidly.",
    stages: [
      {
        label: "Stage 1: Crisis Verification & Triage",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Ammonia Interpretation",
            threshold: "TRUE HYPERAMMONEMIA > 100",
            orders: [
              "Sample Handling: Ammonia must be drawn free-flowing, placed IMMEDIATELY on ice, and analyzed within 15-30 minutes to avoid false elevations.",
              "Neonates: Ammonia > 150 micromol/L is highly suspicious for a primary Urea Cycle Disorder.",
              "Children: Ammonia > 100 micromol/L requires immediate metabolic intervention.",
              "Note: Unlike Organic Acidemias, primary Urea Cycle Disorders typically present with severe hyperammonemia WITHOUT significant metabolic acidosis or hypoglycemia (except in liver failure)."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Nutritional Halt: Stop all enteral protein intake immediately. Provide non-protein calories.",
              "Metabolic Panel: Venous Blood Gas, Plasma Amino Acids (look for low Arginine, high Glutamine/Alanine), and Urine Orotic Acid (to differentiate OTC deficiency from CPS1).",
              "Liver Function Tests & Coagulation: Establish baseline hepatic function.",
              "Neuro-protection: Elevate head of bed to 30 degrees to minimize intracranial pressure."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Catabolic Suppression",
        shortLabel: "Anabolism",
        color: "amber",
        cards: [
          {
            title: "High-Calorie Resuscitation",
            threshold: "START WITHIN MINUTES",
            calculator: {
              id: "gir-calculator",
              title: "Glucose Infusion Rate (GIR) Calculator"
            },
            orders: [
              "Dextrose: Start 10% Dextrose at 1.5x maintenance to achieve a Glucose Infusion Rate of 8-10 mg/kg/min (infants).",
              "Intravenous Lipids: Add Intravenous Lipids (Intralipid 20% at 2-3 g/kg/day) to maximize non-protein calories ONLY IF Fatty Acid Oxidation Disorders have been definitively excluded.",
              "Insulin: Start an Intravenous Insulin infusion (0.01 - 0.05 Units/kg/hr) if blood glucose exceeds 150-200 mg/dL to force cellular glucose uptake and anabolism."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Pharmacologic Nitrogen Scavenging [!]",
        shortLabel: "Scavengers",
        color: "red",
        cards: [
          {
            title: "Scavenger & Arginine Directive",
            threshold: "AMMONIA > 150 MICROMOL/L",
            isCritical: true,
            orders: [
              "Consultation: MANDATORY emergency consult with a Metabolic Geneticist.",
              "Sodium Benzoate (Loading): 250 mg/kg infused over 90-120 minutes. Dilute in 10% Dextrose (at least 10:1 dilution) to prevent vein irritation.",
              "Sodium Benzoate (Maintenance): 250 mg/kg/day administered as a continuous 24-hour infusion.",
              "Sodium Phenylbutyrate/Phenylacetate: Same dosing as Benzoate; typically mixed in the same infusion bag.",
              "Intravenous Arginine: Essential to prime the remaining urea cycle (EXCEPT in Arginase deficiency where it is contraindicated).",
              "Potassium Warning: Do NOT add potassium to scavenger bags until serum levels are confirmed < 4.0 mmol/L."
            ],
            prescriptions: [
              {
                drug: "Sodium Benzoate",
                dose: "250 mg/kg (Loading)",
                route: "Intravenous",
                frequency: "Over 90-120 mins",
                calculation: (w) => `${(w * 250).toFixed(0)} mg`,
                notes: "MUST be diluted in 10% Dextrose. Total volume should be at least 20-30 mL/kg."
              },
              {
                drug: "Sodium Benzoate (Maintenance)",
                dose: "250 mg/kg/day",
                route: "Intravenous",
                frequency: "Continuous Infusion",
                calculation: (w) => `${(w * 250).toFixed(0)} mg / 24h`,
                notes: "Switch to oral scavengers once ammonia is stable < 100 micromol/L and patient is eating."
              },
              {
                drug: "Arginine Hydrochloride",
                dose: "200 - 600 mg/kg",
                route: "Intravenous",
                frequency: "Loading Dose",
                calculation: (w) => `Base: ${(w * 200).toFixed(0)} mg`,
                notes: "Dose depends on specific defect (Highest in ASS/ASL deficiency). Avoid in Arginase deficiency."
              }
            ]
          },
          {
            title: "Dialysis Escalation Triggers",
            threshold: "PICU MANDATORY",
            orders: [
              "1. Ammonia > 400 - 500 micromol/L at presentation.",
              "2. Ammonia failing to decrease by 50% within 4 hours of starting intravenous scavengers.",
              "3. Progressive coma or signs of cerebral edema.",
              "Action: Immediate preparation for Continuous Venovenous Hemodiafiltration (CVVHDF) or Hemodialysis. Peritoneal dialysis is too slow."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Nursing Surveillance & Transition [NS]",
        shortLabel: "Monitoring",
        color: "emerald",
        cards: [
          {
            title: "Critical Bedside Monitoring",
            nursing: [
              "Neurological Check: Assess Glasgow Coma Scale and pupils EVERY HOUR. Report lethargy immediately.",
              "Ammonia Checks: Draw Ammonia levels every 4-6 hours until consistently < 100 micromol/L.",
              "Fluid Balance: Strict Intake & Output. High-dose dextrose and scavengers contain significant sodium (Risk of hypernatremia and fluid overload)."
            ]
          },
          {
            title: "Enteral Transition",
            orders: [
              "Protein Reintroduction: Must begin within 24-48 hours once ammonia is < 100 micromol/L to prevent essential amino acid deficiency (which paradoxically triggers more catabolism).",
              "Start at 0.5 g/kg/day of natural protein, supplemented with Essential Amino Acid formulas."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.encephalopathy === true || (data.ammoniaLevel && data.ammoniaLevel >= 400)) {
      return { level: 'critical', details: ["Severe encephalopathy or massive hyperammonemia. Dialysis and PICU required immediately."] };
    }
    if (data.ammoniaLevel && data.ammoniaLevel > 150) {
      return { level: 'severe', details: ["Significant hyperammonemia requiring intravenous scavengers and strict catabolic halt."] };
    }
    return { level: 'moderate', details: ["UCD patient requiring metabolic monitoring and assessment."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Ammonia consistently < 100 micromol/L.",
    "Neurologically at baseline, eating specialized low-protein diet.",
    "Transitioned from Intravenous to Oral scavengers (e.g., Sodium Phenylbutyrate).",
    "Metabolic team follow-up confirmed."
  ],
  getRedFlags: () => ["Progressive lethargy or vomiting", "Ammonia > 400 micromol/L", "Fixed/dilated pupils (Herniation)", "Hypernatremia (from sodium-based scavengers)"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "BIMDG Guidelines: Urea Cycle Disorders", url: "https://www.bimdg.org.uk/" },
    { title: "European Guidelines for the Diagnosis and Management of Urea Cycle Disorders", url: "https://pubmed.ncbi.nlm.nih.gov/31034870/" }
  ]
};
