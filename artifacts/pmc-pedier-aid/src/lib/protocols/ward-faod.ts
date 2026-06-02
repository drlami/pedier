import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Fatty Acid Oxidation Disorders (FAOD)
 * (e.g., MCAD, VLCAD, LCHAD Deficiency)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: BIMDG Emergency Guidelines and RCH Melbourne
 */
export const wardFaodProtocol: DiseaseProtocol = {
  id: 'ward-faod',
  name: 'Fatty Acid Oxidation Disorders Master Pathway',
  system: 'Metabolic Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Fatty Acid Oxidation Disorders (FAODs) are a group of inherited metabolic defects—including Medium-Chain Acyl-CoA Dehydrogenase (MCAD) and Very Long-Chain Acyl-CoA Dehydrogenase (VLCAD) deficiencies—that impair the body\'s ability to break down fats for energy. This leads to life-threatening hypoketotic hypoglycemia and multi-organ failure during periods of fasting or metabolic stress. This exhaustive directive covers emergency glucose resuscitation, avoidance of lipolysis, and monitoring for rhabdomyolysis and cardiomyopathy.',
  image: {
    url: "https://images.unsplash.com/photo-1576089234161-460d3d523b0a?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Critical glucose management and metabolic stabilization"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'bloodGlucose', questionText: 'Initial Blood Glucose (mg/dL)', type: 'number' },
    { id: 'urineKetones', questionText: 'Urine Ketones present?', type: 'boolean' },
    { id: 'musclePain', questionText: 'Severe muscle pain or dark urine (VLCAD/LCHAD)?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Management of Fatty Acid Oxidation Disorders focuses on (1) Preventing the body from using fat as a fuel source by providing high-dose intravenous Dextrose to maintain high Insulin levels, (2) Strictly avoiding prolonged fasting intervals, and (3) Monitoring for disorder-specific complications like Rhabdomyolysis (in long-chain defects) or Cardiac Arrhythmias. Hypoketotic hypoglycemia (low sugar with negative or trace ketones) is the pathognomonic finding.",
    stages: [
      {
        label: "Stage 1: Emergency Identification",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Metabolic Hallmarks",
            threshold: "HYPOKETOTIC HYPOGLYCEMIA",
            orders: [
              "Glucose Search: Blood Glucose < 3.3 mmol/L (60 mg/dL) requiring urgent rescue.",
              "Ketone Check: Mandatory Urinalysis. If ketones are negative or trace despite significant hypoglycemia, FAOD is highly likely.",
              "Note: Healthy children should have 3+ or 4+ ketones during hypoglycemia; the absence of ketones indicates a failure of fatty acid oxidation.",
              "VLCAD/LCHAD Specifics: Look for hepatomegaly, cardiomyopathy, or skeletal muscle weakness."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Immediate Rescue: Give 5 mL/kg of 10% Dextrose as a rapid bolus if hypoglycemic.",
              "Critical Sample: Collect Glucose, Free Fatty Acids, Beta-hydroxybutyrate, Acylcarnitine Profile, and Insulin BEFORE starting therapy if possible.",
              "Systemic Baseline: Creatine Kinase (to screen for rhabdomyolysis), Liver Function Tests, Urea, Electrolytes, and Creatinine.",
              "Cardiac Screen: Electrocardiogram (check for long QT or arrhythmias) and Echocardiogram (screen for cardiomyopathy)."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Suppression of Lipolysis",
        shortLabel: "Management",
        color: "red",
        cards: [
          {
            title: "High-Calorie Resuscitation",
            threshold: "ANABOLISM MANDATORY",
            calculator: {
              id: "gir-calculator",
              title: "Glucose Infusion Rate (GIR) Calculator"
            },
            orders: [
              "Intravenous Fluids: Start 10% Dextrose with appropriate electrolytes at 1.5x maintenance rate.",
              "Glucose Infusion Rate (GIR): Target 8-10 mg/kg/min (infants) or 6-8 mg/kg/min (children) to suppress fat breakdown.",
              "Lipid Contraindication: Avoid Intravenous Lipids (Intralipid) in the acute phase of a suspected FAOD crisis.",
              "Insulin Support: Consider low-dose Insulin if hyperglycemia occurs to maintain a high anabolic state."
            ]
          },
          {
            title: "L-Carnitine (MCAD Specific)",
            orders: [
              "MCAD Deficiency: Consider Oral L-Carnitine (50-100 mg/kg/day) only if the patient is stable and non-vomiting.",
              "VLCAD/LCHAD: Use of Carnitine is controversial in the acute phase due to potential pro-arrhythmic effects of long-chain acylcarnitine esters."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Nursing & Organ Protection [NS]",
        shortLabel: "Monitoring",
        color: "amber",
        cards: [
          {
            title: "Rhabdomyolysis Watch",
            threshold: "VLCAD / LCHAD / TFP DEFICIENCY",
            nursing: [
              "Urine Color: Monitor every void for 'Coca-cola' or tea-colored urine (Myoglobinuria).",
              "Muscle Assessment: Check for tenderness or swelling of large muscle groups every 4 hours.",
              "Heart Monitoring: Continuous Cardiac Monitoring (ECG) if the patient has a long-chain defect.",
              "Fluid Balance: Maintain high urine output (> 2.0 mL/kg/hour) if Creatine Kinase is elevated to protect the kidneys."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Recovery & Fasting Safety",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Transition & Education",
            orders: [
              "Fasting Guidelines: Provide specific 'Safe Fasting Intervals' based on age (e.g., max 4 hours for infants, 8-10 hours for older children).",
              "Dietary Plan: Low-fat, high-carbohydrate diet. Ensure uncooked cornstarch is available for GSD/FAOD patients who require it.",
              "Emergency Protocol: Ensure the family has a validated Emergency Regimen letter for future illnesses.",
              "Follow-up: Clinical review with Metabolic specialist in 2-4 weeks."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.bloodGlucose && data.bloodGlucose < 40 || data.musclePain === true) {
      return { level: 'critical', details: ["Severe FAOD crisis - Risk of rhabdomyolysis, renal failure, or cardiac arrest."] };
    }
    return { level: 'severe', details: ["Metabolic decompensation requiring aggressive suppression of fat breakdown."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Euglycemia maintained for > 12 hours on oral intake.",
    "No evidence of rhabdomyolysis (Creatine Kinase normal or falling).",
    "Heart rhythm stable and cardiomyopathy screened.",
    "Parent understands 'Never Fast' rule and has Emergency Regimen."
  ],
  getRedFlags: () => ["Unexplained vomiting", "Dark urine", "Muscle pain or weakness", "Lethargy", "Cardiac palpitations"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "BIMDG: Management of MCAD Deficiency", url: "https://www.bimdg.org.uk/" },
    { title: "StatPearls: Fatty Acid Oxidation Disorders", url: "https://www.ncbi.nlm.nih.gov/books/NBK553155/" }
  ]
};
