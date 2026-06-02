import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Paracetamol (Acetaminophen) Toxicity
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: Chiew et al. (2020) and RCH Melbourne Guidelines.
 */
export const wardParacetamolProtocol: DiseaseProtocol = {
  id: 'ward-paracetamol-master',
  name: 'Paracetamol Toxicity Master Pathway',
  system: 'Poisoning and Toxins',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Paracetamol (Acetaminophen) poisoning is the leading cause of drug-induced acute liver failure in children. Toxicity results from the accumulation of NAPQI. Management centers on the Rumack-Matthew nomogram and weight-based N-acetylcysteine (NAC) infusion.',
  image: {
    url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Hepatotoxicity management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Body Weight', type: 'number', unit: 'kg' },
    { id: 'time_since', questionText: 'Time Since Ingestion', type: 'number', unit: 'hours' },
    { id: 'apap_level', questionText: 'Serum Paracetamol Level', type: 'number', unit: 'mcg/mL' },
    { id: 'staggered', questionText: 'Staggered or Chronic Ingestion?', type: 'boolean' },
  ], 

  mmpData: {
    snapshot: "Management focuses on early N-acetylcysteine (NAC) administration to replenish glutathione. For single acute ingestions, use the 150 mcg/mL treatment line at 4 hours. NAC is most effective when started within 8 hours. Late presenters (>24h) or those with liver failure require prolonged infusion and potential transplant consultation.",
    stages: [
      {
        label: "Stage 1: Diagnosis & Risk Stratification",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Diagnosis & Laboratory Workup [DR]",
            threshold: "STEP 0: IMMEDIATE",
            orders: [
              "Serum Paracetamol Level: Draw at exactly 4 hours post-ingestion (earlier levels are not interpretable).",
              "Liver Function: ALT, AST, and Total Bilirubin (Baseline).",
              "Coagulation: INR (Most sensitive indicator of liver synthetic function).",
              "Renal & Metabolic: Creatinine, Electrolytes, Blood Glucose, and Venous Blood Gas (Lactate).",
              "X-ray: Generally not indicated for paracetamol alone (not radiopaque)."
            ]
          },
          {
            title: "Triage & Decontamination",
            orders: [
              "Activated Charcoal: 1 g/kg (Max 50g) if presenting within 2 hours of a toxic dose (≥ 150 mg/kg).",
              "Risk Assessment: Single acute vs. Staggered vs. Unknown timing."
            ]
          }
        ]
      },
      {
        label: "Stage 2: 1st Line Antidote Therapy (NAC)",
        shortLabel: "NAC Infusion",
        color: "amber",
        cards: [
          {
            title: "NAC 3-Stage Infusion Protocol",
            threshold: "FIRST-LINE TREATMENT",
            calculator: {
              id: "nac-infusion-calc",
              title: "NAC 3-Stage Infusion Calculator"
            },
            orders: [
              "Stage 1 (Loading): 150 mg/kg in 5% Dextrose over 60 minutes.",
              "Stage 2: 50 mg/kg in 5% Dextrose over 4 hours.",
              "Stage 3: 100 mg/kg in 5% Dextrose over 16 hours.",
              "Target: Total treatment duration of 21 hours for the standard protocol."
            ]
          },
          {
            title: "Nursing: Anaphylactoid Response [NS]",
            isCritical: true,
            nursing: [
              "Watch for: Flushed skin, rash, wheezing, or hypotension (common during Stage 1).",
              "Action: If mild (rash only), give Cetirizine/Promethazine and continue. If severe (wheeze/hypotension), stop NAC, give IM Adrenaline, and resume NAC at half-rate after 30 mins."
            ]
          }
        ]
      },
      {
        label: "Stage 3: 2nd Line & Extended Management",
        shortLabel: "Liver Failure",
        color: "red",
        cards: [
          {
            title: "Second-Line: Extended NAC Infusion",
            threshold: "IF HEPATOTOXICITY PERSISTS",
            orders: [
              "Indications: ALT > 1000 U/L, detectable paracetamol level, or INR > 1.3 at the 21-hour mark.",
              "Regimen: Continue NAC at the Stage 3 rate (150 mg/kg/24h) until ALT is declining and INR < 1.3.",
              "Additional Support: Maintain Blood Glucose (IV D10W if needed) and monitor for encephalopathy."
            ]
          },
          {
            title: "Senior Triggers & PICU/Transplant [!]",
            isCritical: true,
            triggers: [
              "IF INR > 3.0 at 48 hours or > 6.0 at any time.",
              "IF Metabolic Acidosis (pH < 7.3) persists after fluid resuscitation.",
              "IF Renal Impairment (Creatinine > 200 µmol/L) or Hypoglycemia develops.",
              "IF Encephalopathy (GCS < 15) occurs: Immediate transfer to a Liver Transplant Center."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data) => {
    const level = Number(data.apap_level);
    if (level > 300 || data.staggered) return { level: 'critical', details: ["High-risk or Staggered Ingestion: Start NAC immediately without waiting for nomogram."] };
    if (level > 150) return { level: 'severe', details: ["Toxic level confirmed: Complete standard 21-hour NAC protocol."] };
    return { level: 'moderate', details: ["Observation: If < 4h, repeat level at 4h mark."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Nomogram level was below treatment line at 4 hours.",
    "NAC protocol complete with UNDETECTABLE paracetamol and normal ALT/INR.",
    "No evidence of GI bleeding or encephalopathy.",
    "Intentional self-harm patients must have a formal psychiatric assessment before discharge."
  ],
  getRedFlags: [
    "Right upper quadrant tenderness (Liver swelling)",
    "Rising INR despite treatment",
    "Hypoglycemia (Impaired gluconeogenesis)",
    "Metabolic Acidosis (Lactate elevation)",
    "Confusion or drowsiness"
  ],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "Chiew et al: Updated guidelines for paracetamol poisoning", url: "https://mja.com.au/journal/2019/211/9/updated-guidelines-management-paracetamol-poisoning-australia-and-new-zealand" },
    { title: "RCH Melbourne: Paracetamol Poisoning", url: "https://www.rch.org.au/clinicalguide/guideline_index/Paracetamol_poisoning/" }
  ],
};
