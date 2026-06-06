import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Diabetic Ketoacidosis (DKA)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: ISPAD Clinical Practice Consensus Guidelines (2022).
 */
export const wardDkaProtocol: DiseaseProtocol = {
  id: 'ward-dka-management',
  name: 'Diabetic Ketoacidosis (DKA) Master Pathway',
  system: 'Endocrinology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Diabetic Ketoacidosis is a life-threatening metabolic state characterized by hyperglycemia (Blood Glucose > 200 mg/dL), metabolic acidosis (Venous pH < 7.3 or Bicarbonate < 15 mmol/L), and ketosis (Blood beta-hydroxybutyrate ≥ 3 mmol/L or moderate/large urine ketones). This exhaustive directive focuses on the ISPAD 2022 guidelines, emphasizing the Two-Bag fluid system for precise dextrose titration and the prevention of cerebral edema.',
  image: {
    url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Critical care endocrine management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Body Weight', type: 'number', unit: 'kg' },
    { id: 'ph', questionText: 'Venous pH', type: 'number' },
    { id: 'bicarb', questionText: 'Serum Bicarbonate', type: 'number', unit: 'mmol/L' },
    { id: 'gcs', questionText: 'Glasgow Coma Scale (GCS)', type: 'number' },
  ], 

  mmpData: {
    snapshot: "Management centers on slow, controlled metabolic correction to prevent Cerebral Edema. DO NOT give insulin boluses. Start intravenous fluids (0.9% Sodium Chloride) for 1-2 hours BEFORE starting the continuous insulin infusion (0.05-0.1 Units/kg/hr). The 'Two-Bag System' is the gold standard for fluid management, allowing rapid titration of Dextrose (from 0% to 12.5%) based on hourly blood glucose checks while keeping the total fluid rate and sodium/potassium delivery constant.",
    stages: [
      {
        label: "Stage 1: Resuscitation & Initial Fluids (Hour 0-2)",
        shortLabel: "Resuscitation",
        color: "red",
        cards: [
          {
            title: "Immediate Physician Directives [DR]",
            threshold: "BEFORE STARTING INSULIN",
            orders: [
              "Confirm Diagnosis: Blood Glucose > 200 mg/dL AND Venous pH < 7.3 (or Bicarbonate < 15).",
              "Obtain exact body weight for calculations (Do NOT use estimated weight).",
              "Fluid Resuscitation: Give Isotonic Saline (0.9% Sodium Chloride) 10-20 mL/kg over 1-2 hours.",
              "Delay Insulin: DO NOT start insulin until initial fluid expansion is complete (usually 1-2 hours).",
              "Baseline Labs: Venous Blood Gas, Electrolytes (Sodium, Potassium, Calcium, Magnesium, Phosphate), Blood Urea Nitrogen, Creatinine, HbA1c."
            ],
            triggers: [
              "IF Shock is present: Give 20 mL/kg Isotonic Saline bolus as rapidly as needed, repeat until perfusion improves."
            ]
          },
          {
            title: "Nursing: Strict Monitoring [NS]",
            isCritical: true,
            nursing: [
              "Establish 2 peripheral IV lines (one for blood draws/fluids, one dedicated to insulin).",
              "Hourly Blood Glucose checks.",
              "Hourly Neurological Checks (GCS, pupil size, headache) - Critical for early cerebral edema detection.",
              "Strict Intake & Output charting (insert urinary catheter if unconscious or incontinent)."
            ]
          }
        ]
      },
      {
        label: "Stage 2: The Two-Bag Fluid System",
        shortLabel: "Two-Bag System",
        color: "blue",
        cards: [
          {
            title: "Two-Bag Setup & Preparation",
            threshold: "ISPAD STANDARD PROTOCOL",
            calculator: {
              id: "dka-fluid-calc",
              title: "Two-Bag Fluid Calculator"
            },
            instructions: [
              "The Two-Bag system consists of two identical IV fluid bags differing ONLY in Dextrose concentration. They are 'Y-connected' into a single line to the patient.",
              "Calculate Total Hourly Rate: (Maintenance Fluid + Fluid Deficit) ÷ 48 hours. Max fluid rate is typically 1.5 - 2x maintenance.",
              "BAG 1 (NO DEXTROSE): 0.9% Sodium Chloride + 40 mEq/L Potassium (e.g., 20 mEq Potassium Chloride + 20 mEq Potassium Phosphate or Acetate).",
              "BAG 2 (HIGH DEXTROSE): 10% or 12.5% Dextrose in 0.9% Sodium Chloride + 40 mEq/L Potassium."
            ]
          },
          {
            title: "Two-Bag Titration Rules [DR]",
            orders: [
              "The TOTAL fluid rate must always equal the calculated Total Hourly Rate.",
              "If Blood Glucose > 250-300 mg/dL: Run Bag 1 at 100% of total rate, Bag 2 at 0%.",
              "If Blood Glucose 200-250 mg/dL: Run Bag 1 at 50% rate, Bag 2 at 50% rate (Net 5% Dextrose).",
              "If Blood Glucose 150-200 mg/dL: Run Bag 1 at 0% rate, Bag 2 at 100% rate (Net 10% Dextrose).",
              "If Blood Glucose < 150 mg/dL: Do NOT stop insulin! Increase Bag 2 concentration to 12.5% or 15% Dextrose to maintain BG."
            ]
          },
          {
            title: "Potassium Management Strategy",
            orders: [
              "Serum Potassium > 5.5 mEq/L: DO NOT add potassium to initial bags. Recheck every 2 hours.",
              "Serum Potassium 3.5 - 5.5 mEq/L: Add 40 mEq/L total Potassium to ALL bags (20 mEq per 500mL bag).",
              "Serum Potassium < 3.5 mEq/L: Add 60 mEq/L total Potassium (30 mEq per 500mL bag). Consider pausing insulin if K < 3.0 and consult Senior.",
              "Composition: Split potassium 50:50 as Potassium Chloride and Potassium Phosphate to reduce chloride load and prevent hyperchloremic acidosis."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Continuous Insulin Therapy",
        shortLabel: "Insulin Infusion",
        color: "amber",
        cards: [
          {
            title: "Insulin Infusion Setup [DR]",
            threshold: "START AFTER HOUR 1-2",
            orders: [
              "Dose: 0.05 to 0.1 Units/kg/hour continuous IV infusion.",
              "Preparation: Mix 50 Units Regular Human Insulin in 50 mL 0.9% Sodium Chloride (Concentration = 1 Unit/mL).",
              "Flush Line: Prime the tubing with 20-30 mL of the insulin mixture before connecting to the patient (insulin binds to plastic tubing).",
              "Target Drop: Aim for a Blood Glucose drop of 50-90 mg/dL per hour. Faster drops increase cerebral edema risk."
            ],
            prescriptions: [
              {
                drug: "Regular Human Insulin (IV Infusion)",
                dose: "0.1 Units/kg/hr",
                route: "IV Infusion",
                frequency: "Continuous",
                calculation: (w) => `${(0.1 * w).toFixed(2)} Units/hr`,
                notes: "DO NOT GIVE BOLUS INSULIN. Adjust IV dextrose to maintain BG while keeping insulin running."
              }
            ]
          },
          {
            title: "Senior Triggers for Insulin Adjustment [!]",
            isCritical: true,
            triggers: [
              "IF Blood Glucose drops > 100 mg/dL in one hour: Add Dextrose via the Two-Bag system. Do NOT stop insulin unless BG < 100 mg/dL.",
              "IF Acidosis is NOT improving (Venous pH unchanged or dropping): Verify IV line is patent, verify insulin was mixed correctly. May need to increase insulin rate (consult Endocrine).",
              "IF Hypokalemia (K < 3.0) develops: Pause insulin, aggressively replace Potassium, then restart insulin."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Complications & Transition",
        shortLabel: "Cerebral Edema & Transition",
        color: "emerald",
        cards: [
          {
            title: "Cerebral Edema Recognition & Treatment",
            threshold: "LIFESAVING PROTOCOL",
            isCritical: true,
            instructions: [
              "WARNING SIGNS: Headache, slowing heart rate, rising blood pressure (Cushing's triad), irritability, dropping GCS, incontinence, specific cranial nerve palsies (III, IV, VI).",
              "ACTION 1: Immediately elevate Head of Bed to 30 degrees.",
              "ACTION 2: Reduce IV fluid rate by 30-50%.",
              "ACTION 3: Give Hyperosmolar therapy IMMEDIATELY. Do not wait for CT scan."
            ],
            prescriptions: [
              {
                drug: "Mannitol 20%",
                dose: "0.5 - 1.0 g/kg",
                route: "IV",
                frequency: "STAT",
                calculation: (w) => `${(w * 0.5).toFixed(0)} - ${(w * 1.0).toFixed(0)} g (${(w * 2.5).toFixed(0)} - ${(w * 5).toFixed(0)} mL of 20%)`,
                notes: "Administer over 15-20 minutes."
              },
              {
                drug: "Hypertonic Saline (3%)",
                dose: "3 - 5 mL/kg",
                route: "IV",
                frequency: "STAT",
                calculation: (w) => `${(w * 3).toFixed(0)} - ${(w * 5).toFixed(0)} mL`,
                notes: "Alternative to Mannitol, especially if patient is hypotensive."
              }
            ]
          },
          {
            title: "Transition to Subcutaneous Insulin",
            orders: [
              "Resolution Criteria: Venous pH > 7.3, Bicarbonate > 15 mmol/L, closing of Anion Gap, and patient is awake and able to eat.",
              "Timing: Administer rapid-acting Subcutaneous insulin just before a meal.",
              "Overlap: Continue the IV insulin infusion for 30-60 minutes AFTER the subcutaneous dose to prevent rebound ketoacidosis."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data) => {
    const ph = Number(data.ph);
    const bicarb = Number(data.bicarb);
    const gcs = Number(data.gcs);

    if (ph < 7.1 || bicarb < 5 || gcs < 13) {
      return { level: 'critical', details: ["Severe DKA: High risk for cerebral edema. Intensive care monitoring required."] };
    }
    if (ph < 7.2 || bicarb < 10) {
      return { level: 'severe', details: ["Moderate DKA: Requires strict hourly monitoring and two-bag fluid system."] };
    }
    return { level: 'moderate', details: ["Mild DKA: Initiate management pathway."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Acidosis resolved (pH > 7.3, Bicarb > 15).",
    "Patient awake, alert, and tolerating oral feeds.",
    "Transition to subcutaneous insulin complete without rebound ketosis.",
    "Diabetes education team has reviewed the family."
  ],
  getRedFlags: () => [
    "Headache or irritability",
    "Slowing heart rate (Bradycardia)",
    "Rising blood pressure (Hypertension)",
    "Falling Glasgow Coma Scale",
    "Incontinence"
  ],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "ISPAD Clinical Practice Consensus Guidelines 2022: DKA", url: "https://onlinelibrary.wiley.com/doi/10.1111/pedi.13406" },
    { title: "RCH Melbourne: Diabetic Ketoacidosis Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/Diabetic_Ketoacidosis/" }
  ],
};
