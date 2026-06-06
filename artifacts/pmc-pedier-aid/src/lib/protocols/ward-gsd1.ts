import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Glycogen Storage Disease Type 1 (GSD1)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: ACMG Practice Guidelines and RCH Melbourne
 */
export const wardGsd1Protocol: DiseaseProtocol = {
  id: 'ward-gsd1',
  name: 'Glycogen Storage Disease Type 1 Master Pathway',
  system: 'Metabolic Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Glycogen Storage Disease Type 1 (GSD1), also known as Von Gierke disease, is an inherited metabolic disorder caused by a deficiency of the Glucose-6-Phosphatase enzyme. This impairs the final step of both glycogenolysis and gluconeogenesis, resulting in severe fasting hypoglycemia, massive hepatomegaly, lactic acidosis, and hyperuricemia. This exhaustive directive covers the management of acute hypoglycemic crises, the use of uncooked cornstarch, and monitoring for long-term hepatic and renal complications.',
  image: {
    url: "https://images.unsplash.com/photo-1576089234161-460d3d523b0a?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Critical glucose maintenance and metabolic control"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'bloodGlucose', questionText: 'Initial Blood Glucose (mg/dL)', type: 'number' },
    { id: 'lactateLevel', questionText: 'Initial Lactate Level (mmol/L)', type: 'number' },
    { id: 'hepatomegaly', questionText: 'Massive hepatomegaly (liver > 4cm below margin)?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Management of GSD1 focuses on (1) Preventing hypoglycemia at all costs to avoid neurological injury and suppress the hormonal drivers of lactic acidosis, (2) Implementing a continuous source of glucose through frequent feeding or uncooked cornstarch, and (3) Monitoring for metabolic derangements like Hyperuricemia and Hypertriglyceridemia. Clinicians must remember that in GSD1, the liver cannot release glucose from its stores or from non-carbohydrate precursors.",
    stages: [
      {
        label: "Stage 1: Hypoglycemic Emergency Identification",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Metabolic Hallmarks",
            threshold: "FASTING INTOLERANCE",
            orders: [
              "Hypoglycemia: Blood Glucose < 70 mg/dL can occur within 2-4 hours of fasting.",
              "Lactic Acidosis: Blood Lactate levels are typically elevated (> 2.5 mmol/L) and worsen significantly during hypoglycemia.",
              "Physical Findings: 'Doll-like' facial features and massive hepatomegaly (kidneys are also often enlarged).",
              "Note: Unlike many other metabolic diseases, GSD1 patients typically do NOT have significant ketosis during hypoglycemia (as ketones are suppressed by high lactate and other metabolites)."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Immediate Rescue: Give 5 mL/kg of 10% Dextrose as a rapid bolus if Blood Glucose < 70 mg/dL.",
              "Metabolic Baseline: Venous Blood Gas (Lactate), Urea, Electrolytes, Creatinine, Uric Acid, and Lipid Profile.",
              "Urine Check: Check for proteinuria (early sign of renal involvement).",
              "Radiology: Baseline Ultrasound of the liver to screen for adenomas."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Maintenance of Euglycemia",
        shortLabel: "Management",
        color: "red",
        cards: [
          {
            title: "Continuous Glucose Strategy",
            threshold: "ANABOLISM MANDATORY",
            calculator: {
              id: "gir-calculator",
              title: "Glucose Infusion Rate (GIR) Calculator"
            },
            orders: [
              "Intravenous Fluids: Maintain 10% Dextrose at a GIR of 6-8 mg/kg/min if the patient is NPO.",
              "Enteral Feeding: Day-time feedings every 2-3 hours. Night-time continuous nasogastric drip is often required in infants.",
              "Uncooked Cornstarch: Use as a 'slow-release' glucose source. Dose: 1.5 - 2.0 g/kg every 4-6 hours (For children > 6-12 months).",
              "Safety Rule: Never mix cornstarch with fruit juice or heat it (which destroys the slow-release properties)."
            ]
          },
          {
            title: "Hyperuricemia Control",
            orders: [
              "Allopurinol: Consider if Uric Acid levels remain elevated despite good glycemic control (Target < 6.0 mg/dL)."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Nursing & Safety [NS]",
        shortLabel: "Monitoring",
        color: "amber",
        cards: [
          {
            title: "Strict Bedside Vigilance",
            nursing: [
              "Glucose Monitoring: Pre-feed capillary Blood Glucose every 2-4 hours initially.",
              "Feeding Punctuality: Feeding times must be exact; even a 30-minute delay can trigger hypoglycemia.",
              "Cornstarch Preparation: Ensure exact weight-based measurement and cold water mixing.",
              "Infection Precautions: In Type 1b GSD, monitor for neutropenia and recurrent mouth ulcers."
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
            title: "Chronic Surveillance",
            orders: [
              "Adenoma Screen: Liver Ultrasound every 6-12 months starting in childhood.",
              "Renal Protection: Annual microalbuminuria check; consider ACE inhibitors if positive.",
              "Dietary Training: Involve a Metabolic Dietitian for complex starch-to-protein ratios.",
              "Emergency Kit: Ensure family has glucose gel and an Emergency Regimen letter."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.bloodGlucose && data.bloodGlucose < 40 || data.lactateLevel && data.lactateLevel > 6) {
      return { level: 'critical', details: ["Severe GSD1 crisis - Risk of seizure and severe lactic acidosis."] };
    }
    return { level: 'severe', details: ["Metabolic decompensation requiring continuous glucose support."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Euglycemia maintained for > 24 hours on oral/cornstarch regimen.",
    "Lactate levels stable and < 2.5 mmol/L.",
    "Parent competent in nasogastric feeding and cornstarch preparation.",
    "Emergency home plan and outpatient metabolic follow-up confirmed."
  ],
  getRedFlags: () => ["Morning lethargy or headache", "Severe abdominal distention", "Irritability between feeds", "Decreased urine output"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "ACMG: Diagnosis and management of glycogen storage disease type I", url: "https://pubmed.ncbi.nlm.nih.gov/25356952/" },
    { title: "RCH Melbourne: Glycogen Storage Disease", url: "https://www.rch.org.au/" }
  ]
};
