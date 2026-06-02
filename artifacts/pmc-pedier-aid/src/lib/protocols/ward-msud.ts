import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Maple Syrup Urine Disease (MSUD)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: BIMDG Guidelines and RCH Melbourne
 */
export const wardMsudProtocol: DiseaseProtocol = {
  id: 'ward-msud',
  name: 'Maple Syrup Urine Disease Master Pathway',
  system: 'Metabolic Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Maple Syrup Urine Disease (MSUD) is an inherited aminoacidopathy caused by a deficiency of the Branched-Chain Alpha-Keto Acid Dehydrogenase (BCKDH) complex. This leads to the toxic accumulation of branched-chain amino acids (Leucine, Isoleucine, and Valine), resulting in severe neurological decompensation and a characteristic "maple syrup" odor in the urine and earwax. This exhaustive directive covers emergency Leucine reduction, cerebral edema monitoring, and the use of specialized precursor-free formulas.',
  image: {
    url: "https://images.unsplash.com/photo-1576089234161-460d3d523b0a?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Critical amino acid management and neuro-protection"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'leucineLevel', questionText: 'Initial Plasma Leucine (micromol/L)', type: 'number' },
    { id: 'neurologicalChange', questionText: 'Altered consciousness, irritability, or bulging fontanelle?', type: 'boolean' },
    { id: 'classicOdor', questionText: 'Maple syrup odor detected in urine or earwax?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Management of MSUD focuses on (1) Rapid reduction of the highly neurotoxic Leucine level through aggressive catabolic suppression and potentially extracorporeal removal (Dialysis), (2) Monitoring for life-threatening Cerebral Edema which can occur even as Leucine levels are falling, and (3) Precise re-introduction of Isoleucine and Valine to facilitate protein synthesis. Unlike other metabolic crises, MSUD typically presents WITHOUT significant acidosis or hyperammonemia.",
    stages: [
      {
        label: "Stage 1: Clinical Identification & Baseline",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "MSUD Hallmark Verification",
            threshold: "NEUROLOGICAL DISTRESS",
            orders: [
              "Characteristic Odor: Check urine or earwax for the sweet 'maple syrup' or 'burnt sugar' smell (caused by sotolon).",
              "Neurological Exam: Look for alternating hypertonia/hypotonia, dystonia, and bicycling movements in neonates.",
              "Note: MSUD crises are often triggered by simple viral infections, trauma, or surgery in known patients."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Mandatory Labs: Quantitative Plasma Amino Acids (Leucine, Isoleucine, Valine, and Alloisoleucine).",
              "Critical Marker: Alloisoleucine is pathognomonic for MSUD.",
              "Systemic Baseline: Glucose, Electrolytes, Urea, Creatinine, and Venous Blood Gas.",
              "Infection Screen: Blood Cultures and C-Reactive Protein (to identify the trigger)."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Catabolic Suppression (Rescue)",
        shortLabel: "Management",
        color: "red",
        cards: [
          {
            title: "High-Calorie Anabolic Rescue",
            threshold: "ANABOLISM MANDATORY",
            calculator: {
              id: "gir-calculator",
              title: "Glucose Infusion Rate (GIR) Calculator"
            },
            orders: [
              "Nutritional Halt: Stop all natural protein intake immediately.",
              "Dextrose Protocol: Start 10% Dextrose with electrolytes at 1.5x maintenance rate (GIR 8-10 mg/kg/min).",
              "Intravenous Lipids: Start Intralipid 20% (up to 2-3 g/kg/day) to maximize non-protein calories.",
              "Insulin Support: Maintain Intravenous Insulin (0.01 - 0.05 Units/kg/hr) if blood glucose > 150 mg/dL to facilitate protein synthesis and Leucine uptake."
            ]
          },
          {
            title: "Isoleucine & Valine Supplementation",
            orders: [
              "Rationale: Isoleucine and Valine levels often fall rapidly during high-calorie rescue, which halts protein synthesis and keeps Leucine high.",
              "Action: Supplement with 50-100 mg/kg/day of Isoleucine and Valine as per Metabolic Specialist advice once levels fall."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Neuro-Vigilance & Dialysis Triggers [!]",
        shortLabel: "Cerebral Edema",
        color: "amber",
        cards: [
          {
            title: "Cerebral Edema Monitoring [NS]",
            isCritical: true,
            nursing: [
              "Neuro Checks: Glasgow Coma Scale and pupillary reactivity EVERY HOUR.",
              "Intracranial Pressure (ICP) Signs: Watch for bulging fontanelle, bradycardia, or hypertension.",
              "Fluid Restriction: Be cautious with fluid overload; target 'neutral' balance while maintaining high caloric intake."
            ]
          },
          {
            title: "Dialysis Escalation Triggers",
            threshold: "LEUCINE > 1000",
            orders: [
              "1. Plasma Leucine > 1000 micromol/L.",
              "2. Progressive neurological deterioration despite aggressive catabolic rescue.",
              "Action: Immediate preparation for Hemodialysis or Continuous Venovenous Hemodiafiltration (CVVHDF). Peritoneal dialysis is ineffective for Leucine removal."
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
            title: "Nutritional Re-introduction",
            orders: [
              "MSUD Formula: Start Leucine-free amino acid formula (e.g., MSUD Anamix) as soon as vomiting stops.",
              "Step-wise Protein: Gradually re-introduce natural protein (Leucine) under strict Metabolic team guidance.",
              "Education: Ensure parents have an updated 'Emergency Regimen' and understand the critical nature of Leucine-free maintenance."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.leucineLevel && data.leucineLevel > 1000 || data.neurologicalChange === true) {
      return { level: 'critical', details: ["High-risk MSUD crisis - Massive Leucine toxicity and risk of brain herniation."] };
    }
    return { level: 'severe', details: ["Metabolic decompensation requiring aggressive Leucine reduction."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Plasma Leucine consistently < 300 micromol/L.",
    "Neurologically stable and at baseline.",
    "Tolerating specialized MSUD formula and small amounts of natural protein.",
    "Parent training on home supplements and Emergency Regimen completed."
  ],
  getRedFlags: () => ["Unexplained irritability (often the first sign of high Leucine)", "Maple syrup odor", "Bulging fontanelle", "Seizures or focal neurological deficits"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "BIMDG Guidelines: Maple Syrup Urine Disease", url: "https://www.bimdg.org.uk/" },
    { title: "Management of MSUD: A Clinical Practice Guideline", url: "https://pubmed.ncbi.nlm.nih.gov/24557717/" }
  ]
};
