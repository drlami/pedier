import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Hypoglycemia
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: Pediatric Endocrine Society (PES) Guidelines and RCH Melbourne
 */
export const wardHypoglycemiaProtocol: DiseaseProtocol = {
  id: 'ward-hypoglycemia',
  name: 'Hypoglycemia Master Pathway',
  system: 'Endocrinology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Hypoglycemia is defined as a Blood Glucose level less than 3.3 mmol/L (60 mg/dL) in infants and children, and represents a neurological emergency. This exhaustive directive covers rapid glucose correction, the mandatory "Critical Sample" diagnostic window, and a structured search for underlying metabolic or endocrine disorders.',
  image: {
    url: "https://images.unsplash.com/photo-1576089234161-460d3d523b0a?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Glucose monitoring and neuroglycopenic assessment"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'bloodGlucose', questionText: 'Initial Blood Glucose (mg/dL)', type: 'number' },
    { id: 'seizurePresent', questionText: 'Ongoing seizure or profound coma?', type: 'boolean' },
    { id: 'canTakeOral', questionText: 'Awake, alert, and able to swallow safely?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Hypoglycemia management focuses on (1) Rapid restoration of euglycemia to prevent permanent neuronal damage, (2) Capturing the 'Critical Sample' at the time of the event to identify the underlying etiology (Hyperinsulinism vs. Counter-regulatory deficiency), and (3) Maintaining a safe Glucose Infusion Rate while transitioning to a diagnostic fast if indicated. Clinicians must remember: treat the patient, not just the number.",
    stages: [
      {
        label: "Stage 1: Acute Neurological Rescue",
        shortLabel: "Correction",
        color: "red",
        cards: [
          {
            title: "Immediate Physician Orders [DR]",
            threshold: "IF SYMPTOMATIC OR < 40 MG/DL",
            isCritical: true,
            calculator: {
                id: "dextrose-bolus-calc",
                title: "Dextrose Bolus Calculator"
            },
            orders: [
              "Intravenous Correction: Give 2-5 mL/kg of 10% Dextrose (D10W) as a rapid bolus.",
              "Alternative (No Access): Administer Intramuscular Glucagon (0.5 mg for weight < 25kg; 1.0 mg for weight > 25kg).",
              "Oral Correction: If alert and swallowing is safe, give 15-20 grams of fast-acting carbohydrate (e.g., fruit juice or glucose gel)."
            ],
            prescriptions: [
              {
                drug: "10% Dextrose (D10W)",
                dose: "2-5 mL/kg",
                route: "Intravenous",
                frequency: "Single Stat Bolus",
                calculation: (w) => `${(w * 5).toFixed(0)} mL`,
                notes: "Re-check Blood Glucose 15-30 minutes after bolus."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 2: The 'Critical Sample' Window [!]",
        shortLabel: "Diagnostics",
        color: "blue",
        cards: [
          {
            title: "Mandatory Laboratory Collection",
            threshold: "DURING THE HYPOGLYCEMIC EVENT",
            orders: [
              "Primary Goal: Collect these labs BEFORE giving glucose if possible, or immediately upon arrival if still hypoglycemic.",
              "Metabolic Panel: Glucose, Beta-hydroxybutyrate, Free Fatty Acids, and Lactate.",
              "Endocrine Panel: Insulin, C-peptide, Cortisol, and Growth Hormone.",
              "Storage: Save 2-3 mL of serum in the freezer for 'extra' metabolic testing (e.g., Acylcarnitine profile) if the initial workup is inconclusive."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Maintenance & Surveillance",
        shortLabel: "Maintenance",
        color: "amber",
        cards: [
          {
            title: "Continuous Glucose Infusion",
            threshold: "PREVENT RECURRENCE",
            orders: [
              "Glucose Infusion Rate (GIR): Target 4-8 mg/kg/minute for infants; 2-4 mg/kg/minute for older children.",
              "Fluid Choice: Use 10% Dextrose with appropriate electrolytes based on the patient's age and clinical state.",
              "Potassium: Do NOT add Potassium until the renal function is confirmed to be normal."
            ]
          },
          {
            title: "Nursing: Vigilance Monitoring [NS]",
            nursing: [
              "Glucose Checks: Bedside capillary Blood Glucose every 1-2 hours initially.",
              "Neurological Status: Monitor for irritability, jitters, or lethargy every 1 hour.",
              "Feeding Safety: Ensure strict adherence to scheduled feedings; report any refusal to eat immediately."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Etiological Search & Taper",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Diagnostic Fasting Protocol",
            orders: [
              "Indication: To document the duration of fasting safety and provoke the metabolic defect under controlled conditions.",
              "Supervision: Must be performed under strict medical and nursing supervision with hourly glucose monitoring.",
              "Stop Criteria: Terminate the fast if Blood Glucose falls below 2.8 mmol/L (50 mg/dL) or symptoms develop."
            ]
          },
          {
            title: "Discharge Criteria",
            orders: [
              "Safety: Ability to maintain Blood Glucose > 3.3 mmol/L during a standard age-appropriate fast (e.g., 8-12 hours).",
              "Education: Parents trained on home glucose monitoring and emergency management.",
              "Follow-up: Arranged with Pediatric Endocrinology or Metabolic Specialists."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.seizurePresent === true || data.bloodGlucose < 40) {
      return { level: 'critical', details: ["Severe neuroglycopenia - Immediate resuscitation and PICU consult required."] };
    }
    if (data.bloodGlucose < 60) {
      return { level: 'severe', details: ["Moderate hypoglycemia requiring active correction."] };
    }
    return { level: 'moderate', details: ["Mild or asymptomatic hypoglycemia."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Euglycemia maintained for > 12 hours on oral intake.",
    "No recurrence of symptoms during an age-appropriate fast.",
    "Parent understands signs of recurrence and emergency management.",
    "Follow-up scheduled for review of 'Critical Sample' results."
  ],
  getRedFlags: () => ["Seizures", "Prolonged coma despite glucose correction", "Recurrent hypoglycemia despite high glucose infusion rates", "Unexplained vomiting or metabolic acidosis"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "PES Recommendations for management of hypoglycemia", url: "https://pedsendo.org/" },
    { title: "RCH Melbourne: Hypoglycemia", url: "https://www.rch.org.au/clinicalguide/guideline_index/Hypoglycaemia/" }
  ]
};
