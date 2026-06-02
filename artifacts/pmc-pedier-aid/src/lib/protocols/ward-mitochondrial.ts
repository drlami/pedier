import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Mitochondrial Disorders (Mitochondrial Crisis)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: Mitochondrial Medicine Society (MMS) Guidelines and RCH Melbourne
 */
export const wardMitochondrialProtocol: DiseaseProtocol = {
  id: 'ward-mitochondrial',
  name: 'Mitochondrial Crisis Master Pathway',
  system: 'Metabolic Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Mitochondrial Disorders are a heterogeneous group of conditions caused by impairment of the oxidative phosphorylation (OXPHOS) system. During periods of physiological stress (infection, surgery, fasting), patients can develop an acute "Mitochondrial Crisis" characterized by multi-organ failure, severe lactic acidosis, and neurological stroke-like episodes. This exhaustive directive covers energy-fail rescue, the "Mito-Cocktail" administration, and avoidance of mitochondrial toxins.',
  image: {
    url: "https://images.unsplash.com/photo-1576089234161-460d3d523b0a?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Critical energy failure and multi-organ monitoring"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'lactateLevel', questionText: 'Initial Blood Lactate (mmol/L)', type: 'number' },
    { id: 'organFailureCount', questionText: 'Number of failing organ systems (Heart, Brain, Liver, Kidney)?', type: 'number' },
    { id: 'strokeLikeEvent', questionText: 'Sudden hemiparesis or visual loss (Stroke-like event)?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Management of a Mitochondrial Crisis focuses on (1) Aggressive energy support with high-dose intravenous Dextrose to bypass impaired mitochondrial energy production, (2) Immediate initiation of the 'Mitochondrial Cocktail' to maximize remaining respiratory chain function, and (3) Strict avoidance of 'Mitochondrial Toxins' like Valproate or certain antibiotics. Clinicians must realize that simple viral illnesses can trigger rapid, catastrophic organ failure in these patients.",
    stages: [
      {
        label: "Stage 1: Crisis Identification & Safety",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Mitochondrial Emergency Hallmarks",
            threshold: "ENERGY FAILURE",
            orders: [
              "Lactic Acidosis: Blood Lactate levels > 3-5 mmol/L without obvious hypoxia are highly suspicious.",
              "Stroke-Like Episodes: Sudden neurological deficits that do not follow standard vascular territories (common in MELAS).",
              "Multi-organ Strain: Look for cardiomyopathy, liver dysfunction, or sudden muscle weakness (ophthalmoplegia/ptosis).",
              "Trigger Search: Identify infection, fasting, or new medications immediately."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Energy Rescue: Start 10% Dextrose with electrolytes at 1.5x maintenance rate immediately. DO NOT FAST.",
              "Toxic Avoidance: Check every medication against the mitochondrial safety list. AVOID Valproate, Phenobarbital, and Tetracyclines.",
              "Laboratory Baseline: Lactate, Pyruvate, Blood Gas, Urea, Electrolytes, Creatinine, Liver Function Tests, and Creatine Kinase.",
              "Cardiac Screen: Baseline Electrocardiogram and Echocardiogram (risk of sudden arrhythmia or heart failure)."
            ]
          }
        ]
      },
      {
        label: "Stage 2: The 'Mito-Cocktail' Rescue",
        shortLabel: "Management",
        color: "red",
        cards: [
          {
            title: "Standard Mitochondrial Cocktail",
            threshold: "START STAT",
            isCritical: true,
            orders: [
              "Coenzyme Q10 (Ubiquinone): 10-30 mg/kg/day (Oral). Primary electron transporter.",
              "L-Carnitine: 50-100 mg/kg/day (Intravenous or Oral). Facilitates fatty acid transport.",
              "B-Vitamin Support: Thiamine (B1), Riboflavin (B2), and Biotin. Essential cofactors.",
              "Antioxidants: Vitamin C and Vitamin E to reduce oxidative stress."
            ],
            prescriptions: [
              {
                drug: "L-Carnitine",
                dose: "100 mg/kg/day",
                route: "Intravenous",
                frequency: "Every 6 hours",
                calculation: (w) => `${(w * 25).toFixed(0)} mg`,
                notes: "Loading dose may be required in severe energy failure."
              }
            ]
          },
          {
            title: "Stroke-Like Episode Rescue (MELAS)",
            threshold: "SUDDEN NEURO DEFICIT",
            orders: [
              "Intravenous L-Arginine: High-dose bolus (500 mg/kg) followed by maintenance infusion. Goal: Improve cerebral vasodilation.",
              "Action: Contact Pediatric Neurology and Metabolic team within 30 minutes."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Multi-organ Surveillance [NS]",
        shortLabel: "Monitoring",
        color: "amber",
        cards: [
          {
            title: "Nursing: Vigilance Checks",
            nursing: [
              "Neurological Check: Assess for subtle focal weakness or visual field changes every 2-4 hours.",
              "Heart Rate: Monitor for bradycardia or tachyarrhythmias.",
              "Temperature: Prevent hypothermia (reduces enzyme kinetics) and manage fever aggressively (increases energy demand).",
              "Hydration Status: Maintain strict fluid balance; avoid dehydration-induced lactic acid rise."
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
            title: "Transition to Maintenance",
            orders: [
              "Step-wise Feed: Re-introduce regular feedings; ensure high carbohydrate frequency.",
              "Safe Medication List: Provide the family with a printed list of medications to avoid (Mitochondrial Toxin List).",
              "Follow-up: Clinical review with Mitochondrial or Metabolic Specialist in 2-4 weeks.",
              "Genetic Roadmap: Update status of diagnostic testing (Mitochondrial DNA vs Nuclear DNA sequencing)."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.strokeLikeEvent === true || (data.organFailureCount && data.organFailureCount >= 2)) {
      return { level: 'critical', details: ["Severe Mitochondrial Crisis - Multi-organ energy failure. PICU admission mandatory."] };
    }
    if (data.lactateLevel && data.lactateLevel > 5) {
      return { level: 'severe', details: ["Significant energy decompensation requiring aggressive energy rescue."] };
    }
    return { level: 'moderate', details: ["Stable Mitochondrial Disorder requiring monitoring."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Lactate levels stable and returning to baseline.",
    "Neurologically stable with no new deficits.",
    "Tolerating full 'Mito-Cocktail' and oral intake.",
    "Parent training on 'Fever Management' and Emergency Regimen completed."
  ],
  getRedFlags: () => ["Sudden weakness", "Drooping eyelid (Ptosis)", "Shortness of breath (Cardiomyopathy)", "Vomiting or inability to tolerate oral energy supplements"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "MMS: Patient care standards for primary mitochondrial disease", url: "https://pubmed.ncbi.nlm.nih.gov/28754171/" },
    { title: "RCH Melbourne: Mitochondrial Disorders", url: "https://www.rch.org.au/" }
  ]
};
