import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Organic Acidemias (MMA, PA, IVA)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: BIMDG Guidelines, British Inherited Metabolic Diseases Group, and RCH Melbourne
 */
export const wardOrganicAcidemiasProtocol: DiseaseProtocol = {
  id: 'ward-organic-acidemias',
  name: 'Organic Acidemias Master Pathway',
  system: 'Metabolic Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Organic Acidemias (OAs) are a group of inherited metabolic disorders—most commonly Methylmalonic Acidemia (MMA), Propionic Acidemia (PA), and Isovaleric Acidemia (IVA)—characterized by the accumulation of toxic organic acids in tissues and fluids. This leads to severe, life-threatening metabolic acidosis, high anion gap, and secondary hyperammonemia. This exhaustive directive covers catabolic suppression, L-Carnitine supplementation, and management of bone marrow and neurological complications.',
  image: {
    url: "https://images.unsplash.com/photo-1576089234161-460d3d523b0a?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Critical metabolic acidosis and catabolic rescue"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'phLevel', questionText: 'Initial Venous pH', type: 'number' },
    { id: 'anionGap', questionText: 'Anion Gap (calculated)', type: 'number' },
    { id: 'ammoniaLevel', questionText: 'Ammonia Level (micromol/L)', type: 'number' },
  ],

  mmpData: {
    snapshot: "Management of Organic Acidemias focuses on (1) Rapid suppression of catabolism through high-dose intravenous Dextrose (achieving high Glucose Infusion Rates), (2) Facilitating the excretion of toxic organic acid esters using high-dose L-Carnitine, and (3) Correcting profound metabolic acidosis. Clinicians must maintain a low threshold for starting antibiotics, as infection is a frequent trigger and patients often have associated neutropenia.",
    stages: [
      {
        label: "Stage 1: Crisis Identification",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Metabolic Hallmarks",
            threshold: "ACIDOSIS + ANION GAP",
            orders: [
              "Venous Blood Gas: Look for severe metabolic acidosis with a wide Anion Gap (often > 20).",
              "Secondary Hyperammonemia: Ammonia levels can reach 200-800 micromol/L (caused by inhibition of the urea cycle by organic acid esters).",
              "Ketosis: Massive ketonuria is typical (except in IVA where it may be milder).",
              "Unusual Odors: 'Sweaty feet' odor is characteristic of Isovaleric Acidemia (IVA)."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Nutritional Rescue: STOP ALL protein intake immediately. Provide non-protein calories.",
              "Metabolic Labs: Plasma Amino Acids, Urine Organic Acids, and Acylcarnitine Profile (Collect BEFORE starting therapy).",
              "Systemic Baseline: Complete Blood Count (look for pancytopenia), Amylase/Lipase (risk of pancreatitis), and Glucose.",
              "Antimicrobial Strategy: PREFERRED REGIMEN: MONOTHERAPY (Ceftriaxone) if infection is a suspected trigger."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Catabolic Suppression & Toxin Excretion",
        shortLabel: "Management",
        color: "red",
        cards: [
          {
            title: "High-Dose Dextrose Protocol",
            threshold: "ANABOLISM MANDATORY",
            calculator: {
              id: "gir-calculator",
              title: "Glucose Infusion Rate (GIR) Calculator"
            },
            orders: [
              "Intravenous Fluids: Start 10% Dextrose with appropriate electrolytes at 1.5x maintenance rate.",
              "Glucose Infusion Rate (GIR): Maintain at 8-10 mg/kg/min (infants) or 6-8 mg/kg/min (children).",
              "Hyperglycemia Management: If blood glucose > 180 mg/dL, do NOT decrease the GIR. Instead, start an Intravenous Insulin infusion (0.05 Units/kg/hour) to maintain anabolism."
            ]
          },
          {
            title: "Pharmacologic Toxin Removal",
            orders: [
              "L-Carnitine: Essential to form carnitine-esters with organic acids for urinary excretion.",
              "Metronidazole: Use in Methylmalonic or Propionic acidemia to reduce propionate production from gut bacteria.",
              "Secondary Hyperammonemia: If Ammonia exceeds 200 micromol/L, initiate Sodium Benzoate scavenging.",
              "Sodium Benzoate (Loading): 250 mg/kg infused over 90-120 minutes. Dilute in 10% Dextrose (at least 10:1 dilution) to prevent vein irritation.",
              "Sodium Benzoate (Maintenance): 250 mg/kg/day administered as a continuous 24-hour infusion.",
              "Dialysis: Consider earlier if acidosis and hyperammonemia both fail to respond to pharmacological rescue."
            ],
            prescriptions: [
              {
                drug: "L-Carnitine",
                dose: "100 mg/kg/day",
                route: "Intravenous",
                frequency: "Divided every 6 hours",
                calculation: (w) => `${(w * 25).toFixed(0)} mg`,
                notes: "Loading dose of 100 mg/kg may be given in severe crisis."
              },
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
                notes: "Continue until ammonia is stable < 100 micromol/L."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 3: Nursing Surveillance [NS]",
        shortLabel: "Monitoring",
        color: "amber",
        cards: [
          {
            title: "Multi-system Checks",
            nursing: [
              "Neurological Check: Assess Glasgow Coma Scale every 2 hours. Monitor for focal deficits (Stroke-like episodes in the basal ganglia).",
              "Abdominal Pain: Report severe pain or vomiting (High risk of pancreatitis).",
              "Infection Precautions: Strict hand hygiene and reverse isolation if neutropenia is present.",
              "Fluid Balance: Strict hourly Intake and Output charting."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Recovery & Long-term Roadmap",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Metabolic Stabilization",
            orders: [
              "Step-wise Protein: Gradually re-introduce protein (0.25 g/kg/day increments) using specialized precursor-free formulas (e.g., Propimex or Kindercal).",
              "Chronic Monitoring: Monitor for developmental progress and renal function (Lupus-like nephritis in long-term MMA).",
              "Emergency Plan: Ensure parents have an updated 'Emergency Regimen' letter for future flares."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.phLevel && data.phLevel < 7.1 || data.ammoniaLevel && data.ammoniaLevel > 400) {
      return { level: 'critical', details: ["Severe Metabolic Crisis - Risk of arrhythmia and brain injury. Dialysis may be required."] };
    }
    if (data.phLevel && data.phLevel < 7.2) {
      return { level: 'severe', details: ["Significant metabolic decompensation requiring aggressive catabolic suppression."] };
    }
    return { level: 'moderate', details: ["Stable Organic Acidemia requiring monitoring."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Acidosis resolved (pH > 7.3, Bicarbonate > 18).",
    "Ammonia consistently < 100 micromol/L.",
    "Tolerating re-introduction of natural protein.",
    "Parent training on home L-Carnitine and Emergency Regimen completed."
  ],
  getRedFlags: () => ["Unexplained vomiting", "Low White Blood Cell count", "Sudden focal neurological deficit", "Severe abdominal pain (Pancreatitis)"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "BIMDG: Management of Methylmalonic and Propionic Acidemia", url: "https://www.bimdg.org.uk/" },
    { title: "StatPearls: Organic Acidemias", url: "https://www.ncbi.nlm.nih.gov/books/NBK560731/" }
  ]
};
