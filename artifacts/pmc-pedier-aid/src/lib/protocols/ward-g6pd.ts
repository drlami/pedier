import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Glucose-6-Phosphate Dehydrogenase (G6PD) Deficiency
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: WHO Standards, British Society for Haematology, and RCH Melbourne
 */
export const wardG6pdProtocol: DiseaseProtocol = {
  id: 'ward-g6pd-deficiency',
  name: 'G6PD Deficiency Master Pathway',
  system: 'Hematology & Oncology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Glucose-6-Phosphate Dehydrogenase (G6PD) Deficiency is an X-linked recessive hereditary condition characterized by an enzymatic defect that makes red blood cells susceptible to oxidative stress. This leads to acute episodic hemolytic anemia when exposed to certain foods (fava beans), infections, or medications. This exhaustive directive covers the identification of an acute hemolytic crisis, mandatory trigger avoidance, and safe transfusion thresholds.',
  image: {
    url: "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Assessment of rapid pallor, hemoglobinuria, and oxidative triggers"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'hemoglobinInitial', questionText: 'Initial Hemoglobin (g/dL)', type: 'number' },
    { id: 'hemoglobinuria', questionText: 'Dark (coca-cola) urine present?', type: 'boolean' },
    { id: 'triggerExposure', questionText: 'Exposure to fava beans or new medications (e.g., Nitrofurantoin/Rasburicase)?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Management of G6PD Deficiency focuses on (1) Immediate identification and withdrawal of the oxidative trigger, (2) Vigilant monitoring for rapid, intravascular hemolysis which can lead to Acute Kidney Injury, and (3) Life-saving transfusion support if the hemoglobin falls below critical thresholds or the patient is symptomatic. Clinicians must realize that the G6PD enzyme assay may be FALSELY NORMAL during an acute crisis (due to younger, enzyme-rich reticulocytes) and must be repeated in 2-3 months.",
    stages: [
      {
        label: "Stage 1: Hemolytic Crisis Identification",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Diagnostic Hallmarks [DR]",
            orders: [
              "Laboratory Triad: Rapid drop in Hemoglobin, high Reticulocyte count (usually > 5%), and low Haptoglobin.",
              "Markers: Elevated Unconjugated Bilirubin and Lactate Dehydrogenase (LDH).",
              "Peripheral Blood Smear: MANDATORY. Look for 'Bite cells' (degmacytes), 'Blister cells', and Heinz bodies (visible with supravital staining).",
              "Urinalysis: Check for Hemoglobinuria (Dipstick positive for blood but microscopy shows few or no red blood cells)."
            ]
          },
          {
            title: "Initial Physician Orders",
            orders: [
              "Baseline Bloods: Electrolytes, Urea, and Creatinine (Screen for pigment-induced Acute Kidney Injury).",
              "Critical Sample: Collect blood for G6PD Enzyme Assay, but interpret a 'normal' result with extreme caution during the crisis.",
              "Trigger Search: Detailed history of food (fava beans), naphthalene (mothballs), or recent infections."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Trigger Removal & Stabilization",
        shortLabel: "Management",
        color: "amber",
        cards: [
          {
            title: "Immediate Safety Rules",
            threshold: "STOP THE OXIDANT",
            isCritical: true,
            orders: [
              "Stop Culprit Meds: IMMEDIATELY stop Nitrofurantoin, Primaquine, Rasburicase, and High-dose Aspirin.",
              "Hydration: Maintain high fluid intake (Oral or Intravenous) to protect the kidneys from hemoglobinuria-induced damage.",
              "Antimicrobial Strategy: PREFERRED REGIMEN: MONOTHERAPY (Ceftriaxone or Amoxicillin) if infection is the trigger. AVOID Sulfonamides."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Transfusion & Monitoring [!]",
        shortLabel: "Transfusion",
        color: "red",
        cards: [
          {
            title: "Transfusion Thresholds",
            threshold: "HB < 7 OR RAPID FALL",
            isCritical: true,
            orders: [
              "Indication: Hemoglobin less than 7 g/dL, or any Hemoglobin less than 9 g/dL with ongoing active hemoglobinuria.",
              "Symptomatic Rule: Transfuse regardless of level if signs of heart failure or tissue hypoxia (Lethargy/Shortness of breath) are present.",
              "Volume: 10 mL/kg of Packed Red Blood Cells infused slowly over 3-4 hours."
            ]
          },
          {
            title: "Nursing: Vigilance Checks [NS]",
            nursing: [
              "Urine Watch: Monitor and document the color of every void (Report worsening 'coca-cola' color).",
              "Vital Signs: Heart Rate and Respiratory Rate monitoring every 4 hours to detect early cardiac strain.",
              "Activity Level: Monitor for sudden lethargy or decreased exercise tolerance."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Education & Long-term Safety",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Prevention Roadmap",
            orders: [
              "The 'Never' List: Provide a written list of prohibited medications and foods (Fava beans/Broad beans).",
              "Follow-up: Repeat G6PD Enzyme Assay in 8-12 weeks when the patient is in a 'steady state'.",
              "Family Screening: Advise testing for siblings and maternal relatives (X-linked inheritance).",
              "Folic Acid: Supplement (5 mg daily) during the recovery phase to support red blood cell production."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.hemoglobinuria === true || (data.hemoglobinInitial && data.hemoglobinInitial < 7)) {
      return { level: 'critical', details: ["Acute Hemolytic Crisis - High risk of rapid drop and renal injury."] };
    }
    return { level: 'moderate', details: ["Stable G6PD Deficiency under investigation."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Hemoglobin stabilized for > 24 hours.",
    "Urine color cleared (Hemoglobinuria resolved).",
    "Parent understands the prohibited triggers list.",
    "Plan for repeat G6PD assay in 3 months confirmed."
  ],
  getRedFlags: () => ["Dark red or black urine", "Sudden shortness of breath", "Severe jaundice", "Fainting or severe lethargy"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "WHO: G6PD Deficiency and Hemolysis", url: "https://www.who.int/" },
    { title: "BSH Guideline: Diagnosis and management of G6PD deficiency", url: "https://onlinelibrary.wiley.com/doi/full/10.1111/bjh.16232" },
    { title: "RCH Melbourne: G6PD Deficiency", url: "https://www.rch.org.au/clinicalguide/guideline_index/G6PD_deficiency/" }
  ]
};
