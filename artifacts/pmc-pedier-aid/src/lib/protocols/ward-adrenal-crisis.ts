import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Adrenal Crisis
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: Pediatric Endocrine Society (PES) Consensus Statement and RCH Melbourne
 */
export const wardAdrenalCrisisProtocol: DiseaseProtocol = {
  id: 'ward-adrenal-crisis',
  name: 'Adrenal Crisis Master Pathway',
  system: 'Endocrinology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Adrenal Crisis is a life-threatening medical emergency resulting from an absolute or relative deficiency of circulating cortisol. It is characterized by refractory shock, severe hypoglycemia, and electrolyte imbalances (Hyponatremia and Hyperkalemia). This exhaustive directive covers the immediate "Rescue Dose" of Hydrocortisone, aggressive fluid resuscitation, and the critical diagnostic "Shotgun" workup.',
  image: {
    url: "https://images.unsplash.com/photo-1576089234161-460d3d523b0a?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Refractory shock and metabolic emergency management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'refractoryShock', questionText: 'Shock unresponsive to initial fluid boluses?', type: 'boolean' },
    { id: 'hypoglycemia', questionText: 'Blood Glucose less than 60 mg/dL?', type: 'boolean' },
    { id: 'knownAI', questionText: 'Known history of Adrenal Insufficiency or chronic steroid use?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Adrenal Crisis management centers on the 'Three Pillars': (1) Immediate Hydrocortisone administration (the only curative intervention), (2) Aggressive volume expansion with Isotonic Saline to correct distributive shock, and (3) Correction of metabolic derangements (Hypoglycemia and Hyperkalemia). Clinicians must have a high index of suspicion in any child with shock that fails to respond to standard fluid resuscitation.",
    stages: [
      {
        label: "Stage 1: Immediate Rescue & Resuscitation",
        shortLabel: "Rescue",
        color: "red",
        cards: [
          {
            title: "Hydrocortisone First Directive",
            threshold: "DO NOT DELAY FOR LABS",
            isCritical: true,
            calculator: {
                id: "adrenal-stress-calc",
                title: "Hydrocortisone Stress Dose Calculator"
            },
            orders: [
              "Primary Intervention: Administer Intravenous or Intramuscular Hydrocortisone IMMEDIATELY upon suspicion.",
              "Mechanism: Restores vascular tone and improves responsiveness to Catecholamines.",
              "Vascular Access: If Intravenous access cannot be secured within 2 minutes, give the dose via the Intramuscular route."
            ],
            prescriptions: [
              {
                drug: "Hydrocortisone (Solu-Cortef)",
                dose: "Age-based (50-100 mg/m²)",
                route: "Intravenous / Intramuscular",
                frequency: "Single Stat Dose",
                calculation: (w) => w < 5 ? "25 mg" : (w < 15 ? "50 mg" : "100 mg"),
                notes: "Rescue dose: <3y: 25mg; 3-12y: 50mg; >12y: 100mg."
              }
            ]
          },
          {
            title: "Volume Expansion Protocol",
            threshold: "IF SHOCK IS PRESENT",
            orders: [
              "Isotonic Resuscitation: Give 20 mL/kg of 0.9% Sodium Chloride (Normal Saline) rapidly.",
              "Repeat: May repeat up to 40-60 mL/kg if signs of poor perfusion persist after the first steroid dose.",
              "Avoid: Do NOT use Potassium-containing fluids until the serum Potassium level is confirmed to be normal or low."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Metabolic & Electrolyte Stabilization",
        shortLabel: "Metabolic",
        color: "amber",
        cards: [
          {
            title: "Hypoglycemia Correction",
            threshold: "GLUCOSE < 60 MG/DL",
            orders: [
              "Bolus: Give 5 mL/kg of 10% Dextrose (D10W).",
              "Maintenance: Start 10% Dextrose in 0.9% Sodium Chloride to prevent recurrent drops in Blood Glucose.",
              "Monitoring: Check capillary Blood Glucose every 1 hour until stable."
            ]
          },
          {
            title: "Electrolyte Management",
            orders: [
              "Hyponatremia: Usually corrects with 0.9% Sodium Chloride and Hydrocortisone.",
              "Hyperkalemia: Hydrocortisone facilitates Potassium excretion. Avoid exogenous Potassium in the first 12-24 hours."
            ]
          }
        ]
      },
      {
        label: "Stage 3: The Critical Diagnostic Shotgun [!]",
        shortLabel: "Diagnostics",
        color: "blue",
        cards: [
          {
            title: "Critical Laboratory Window",
            threshold: "COLLECT BEFORE/WITH FIRST STEROID",
            orders: [
              "Mandatory Labs: Serum Cortisol, ACTH (Adrenocorticotropic Hormone), Renin, and Aldosterone.",
              "Metabolic Panel: Electrolytes, Urea, Creatinine, and Glucose.",
              "Note: If the patient is unstable, give the Hydrocortisone first and document that labs were collected 'post-steroid'."
            ]
          },
          {
            title: "Specialist Consultation",
            orders: [
              "Urgent: Contact Pediatric Endocrinology within 1 hour of admission.",
              "Triage: Consult Pediatric Intensive Care Unit (PICU) for any patient requiring more than 20 mL/kg of fluid or having altered mental status."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Post-Crisis Maintenance",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Transition to Maintenance",
            orders: [
              "Steroid Taper: Gradually reduce Hydrocortisone dose from 'Stress' (100 mg/m²/day) to 'Physiological' (10-15 mg/m²/day) over 48-72 hours as clinical status improves.",
              "Fludrocortisone: Add for primary adrenal insufficiency once the patient is tolerating oral intake and the Hydrocortisone dose is low.",
              "Education: Ensure the family has a 'Red Emergency Kit' and training on Intramuscular injection before discharge."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.refractoryShock === true || data.hypoglycemia === true) {
      return { level: 'critical', details: ["Acute Adrenal Crisis - High risk of circulatory collapse. PICU admission mandatory."] };
    }
    if (data.knownAI === true) {
      return { level: 'severe', details: ["Suspected Adrenal Crisis in high-risk patient."] };
    }
    return { level: 'moderate', details: ["Potential Adrenal Insufficiency under evaluation."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Hemodynamically stable for > 24 hours.",
    "Normalizing electrolytes and Blood Glucose.",
    "Tolerating oral maintenance steroids.",
    "Emergency IM injection training for family completed.",
    "Endocrinology follow-up confirmed within 1 week."
  ],
  getRedFlags: () => ["Unexplained vomiting (early sign of crisis)", "Cold extremities and weak pulses", "Unresponsive hypoglycemia", "Sudden lethargy"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "PES Consensus Statement on Adrenal Insufficiency", url: "https://academic.oup.com/jcem/article/101/2/364/2804720" },
    { title: "RCH Melbourne: Adrenal Insufficiency", url: "https://www.rch.org.au/clinicalguide/guideline_index/Adrenal_insufficiency_management/" }
  ]
};
