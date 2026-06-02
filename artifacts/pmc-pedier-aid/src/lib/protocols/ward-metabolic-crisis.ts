import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Suspected Metabolic Crisis
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: BIMDG Emergency Guidelines and RCH Melbourne
 */
export const wardMetabolicCrisisProtocol: DiseaseProtocol = {
  id: 'ward-metabolic-crisis',
  name: 'Metabolic Crisis Master Pathway',
  system: 'Metabolic Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'A Metabolic Crisis is an acute, life-threatening decompensation occurring in children with underlying Inborn Errors of Metabolism, often triggered by infection, fasting, or surgery. It is characterized by severe metabolic acidosis, hyperammonemia, or hypoglycemia. This exhaustive directive covers the mandatory "Metabolic Emergency" laboratory panel, the stop-protein catabolic rescue, and toxin removal strategies.',
  image: {
    url: "https://images.unsplash.com/photo-1576089234161-460d3d523b0a?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Critical metabolic laboratory and catabolic rescue management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'ammoniaLevel', questionText: 'Ammonia Level (micromol/L)', type: 'number' },
    { id: 'acidosisPresent', questionText: 'Severe metabolic acidosis (pH < 7.2 or Bicarbonate < 10)?', type: 'boolean' },
    { id: 'unusualOdor', questionText: 'Unusual body odor (e.g., sweaty feet, maple syrup)?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Metabolic Crisis management focuses on (1) Halting the catabolic state by stopping all natural protein and providing high-dose Dextrose, (2) Rapidly identifying and removing toxic metabolites (especially Ammonia) which are neurotoxic, and (3) Correcting secondary fluid and electrolyte imbalances. Clinicians must follow the patient-specific 'Emergency Regimen' (if available) and contact a Metabolic Specialist within 30 minutes of admission.",
    stages: [
      {
        label: "Stage 1: Stabilization & The 'Emergency Panel'",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Initial Physician Orders [DR]",
            threshold: "COLLECT IMMEDIATELY",
            isCritical: true,
            orders: [
              "Mandatory Metabolic Panel: Ammonia (transport on ice, run immediately), Lactate, Blood Glucose, and Venous Blood Gas.",
              "Detailed Labs: Urea and Electrolytes, Liver Function Tests, Complete Blood Count, and Blood Cultures.",
              "Advanced Diagnostics: Plasma Amino Acids, Urine Organic Acids, and Acylcarnitine Profile (Collect BEFORE starting any special metabolic therapy).",
              "Airway: Ensure airway safety in patients with severe encephalopathy (Glasgow Coma Scale < 8)."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Stopping Catabolism (Rescue)",
        shortLabel: "Management",
        color: "red",
        cards: [
          {
            title: "The Catabolic Rescue Directive",
            threshold: "STOP PROTEIN INTAKE",
            calculator: {
                id: "gir-calculator",
                title: "Glucose Infusion Rate (GIR) Calculator"
            },
            orders: [
              "Nutritional Halt: Stop ALL natural protein and milk immediately. Do NOT stop breastfeeding if a metabolic disorder is not yet confirmed and the infant is stable.",
              "Dextrose Loading: Start 10% Dextrose (D10W) with appropriate electrolytes at 1.5 times the maintenance rate to suppress catabolism.",
              "Glucose Infusion Rate: Target a minimum of 8-10 mg/kg/minute in infants and 6-8 mg/kg/minute in children.",
              "Insulin Support: Consider a low-dose Insulin infusion (0.01-0.05 Units/kg/hour) to facilitate glucose uptake and further suppress catabolism if Blood Glucose exceeds 10 mmol/L."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Toxin Removal & Specifics [!]",
        shortLabel: "Toxin Control",
        color: "amber",
        cards: [
          {
            title: "Hyperammonemia Strategy",
            threshold: "AMMONIA > 150-200 MICROMOL/L",
            isCritical: true,
            orders: [
              "1st Line: Nitrogen Scavengers (Sodium Benzoate and Sodium Phenylbutyrate) as per specialist advice.",
              "2nd Line: Arginine Hydrochloride to facilitate the urea cycle.",
              "Dialysis: URGENT Hemofiltration or Hemodialysis if Ammonia > 400-500 micromol/L or failing to respond to scavengers within 4-6 hours."
            ]
          },
          {
            title: "Carnitine Supplementation",
            orders: [
              "Indication: Suspected Organic Acidemia or Fatty Acid Oxidation Disorder.",
              "Dose: Intravenous L-Carnitine (100 mg/kg/day) to facilitate the excretion of toxic organic acids."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Maintenance & Transition",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Step-wise Re-introduction",
            orders: [
              "Protein Trial: Gradually re-introduce protein (starting at 0.25-0.5 g/kg/day) only once the metabolic crisis is controlled and toxins have normalized.",
              "Metabolic Formula: Use specialized protein-free or specific amino acid-fortified formulas (e.g., MSUD or MMA formulas).",
              "Long-term Roadmap: Ensure the family has a validated Emergency Regimen and a specific 'Letter to the Emergency Department'."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.ammoniaLevel && data.ammoniaLevel > 200 || data.acidosisPresent === true) {
      return { level: 'critical', details: ["High-risk Metabolic Crisis - Risk of cerebral edema and brain damage. PICU consult mandatory."] };
    }
    return { level: 'severe', details: ["Suspected Metabolic Decompensation requiring aggressive rescue."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Toxic metabolites (Ammonia/Acidosis) normalized.",
    "Tolerating re-introduction of natural protein.",
    "Parent understands the Emergency Regimen and the risk of fasting.",
    "Metabolic Specialist review completed and long-term diet plan established."
  ],
  getRedFlags: () => ["Rapidly rising Ammonia", "Falling level of consciousness", "Persistent severe acidosis", "Cardiac arrhythmias", "Unexplained vomiting or liver failure"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "BIMDG Emergency Guidelines for Metabolic Disease", url: "https://www.bimdg.org.uk/" },
    { title: "RCH Melbourne: Metabolic Diseases - Emergency Management", url: "https://www.rch.org.au/clinicalguide/guideline_index/Metabolic_diseases_Emergency_management/" }
  ]
};
