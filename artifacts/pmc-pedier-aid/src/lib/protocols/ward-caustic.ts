import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Caustic Ingestion (Acids & Alkalis)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: World Journal of Gastrointestinal Endoscopy & RCH Melbourne.
 */
export const wardCausticProtocol: DiseaseProtocol = {
  id: 'ward-caustic-master',
  name: 'Caustic Ingestion Master Pathway',
  system: 'Poisoning and Toxins',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Caustic ingestion (bleach, drain cleaners, disc batteries) causes severe liquefactive or coagulative necrosis of the upper GI tract. Management centers on airway protection, identifying perforation risk, and the critical 12-24 hour window for endoscopy. Long-term complications include severe esophageal strictures.',
  image: {
    url: "https://images.unsplash.com/photo-1583912267550-d44d7a125e71?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Tissue injury and endoscopy timing"
  },
  questions: [
    { id: 'substance', questionText: 'Substance Type (Acid/Alkali/Disc Battery)', type: 'text' },
    { id: 'stridor', questionText: 'Stridor or Drooling present?', type: 'boolean' },
    { id: 'abdominal_pain', questionText: 'Severe Abdominal Pain or Guarding?', type: 'boolean' },
    { id: 'vomiting', questionText: 'Hematemesis or Persistent Vomiting?', type: 'boolean' },
  ], 

  mmpData: {
    snapshot: "NEVER induce emesis or attempt to neutralize (causes heat/exothermic damage). NPO status is mandatory. Clinical predictors of high-grade injury are the combination of drooling and stridor. Endoscopy is the 1st line diagnostic tool and must be performed within 12-24 hours. AVOID endoscopy between 5-15 days post-ingestion when the esophagus is in the 'sloughing phase' and risk of perforation is highest.",
    stages: [
      {
        label: "Stage 1: Step 0 - Airway & Decontamination",
        shortLabel: "Stabilization",
        color: "red",
        cards: [
          {
            title: "Immediate Contraindications [!]",
            isCritical: true,
            instructions: [
              "DO NOT induce vomiting (Emesis).",
              "DO NOT give Activated Charcoal (obscures endoscopy).",
              "DO NOT attempt to neutralize with weak acids/bases.",
              "DO NOT insert a Nasogastric (NG) tube blindly."
            ]
          },
          {
            title: "Emergency Assessment [DR]",
            orders: [
              "Airway Protection: If stridor or voice change present, prepare for expert airway management (ENT/Anesthesia).",
              "External Decontamination: Remove contaminated clothing; irrigate skin and eyes with copious water if involved.",
              "Labs: CBC, VBG (Acidosis indicates severe injury), and Renal Function."
            ]
          }
        ]
      },
      {
        label: "Stage 2: 1st Line - Endoscopic Grading",
        shortLabel: "Endoscopy",
        color: "blue",
        cards: [
          {
            title: "Timing of Endoscopy [DR]",
            threshold: "12-24 HOURS",
            orders: [
              "Indication: Any patient with drooling, vomiting, or significant oral burns.",
              "Window: Perform within 24 hours. Delay beyond 48 hours increases iatrogenic perforation risk.",
              "Grading: Grade 1 (Edema), Grade 2a (Superficial ulcers), Grade 2b (Circumferential ulcers), Grade 3 (Deep necrosis)."
            ]
          },
          {
            title: "X-ray Indications & Perforation [DR]",
            orders: [
              "Chest/Abdominal X-ray: Mandatory if severe chest/abdominal pain is present.",
              "Findings: Look for Pneumomediastinum (esophageal perforation) or Pneumoperitoneum (gastric perforation).",
              "Action: Immediate surgical consultation if free air is detected."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Management of Grading & 2nd Line Support",
        shortLabel: "Management",
        color: "amber",
        cards: [
          {
            title: "Physician Directives [DR]",
            orders: [
              "Acid Suppression: IV Pantoprazole 1 mg/kg daily to prevent secondary gastric acid injury to healing tissue.",
              "Nutrition: Maintain NPO until endoscopy grading is known. Grade 0/1 can resume oral intake; Grade 2b/3 require NJ tube or TPN.",
              "Antibiotics: Use only for suspected perforation or secondary infection."
            ],
            prescriptions: [
              {
                drug: "Pantoprazole",
                dose: "1 mg/kg",
                route: "IV",
                frequency: "Daily",
                calculation: (w) => `${(w * 1.0).toFixed(1)} mg`,
                notes: "Reduces acid-mediated injury to esophageal ulcers."
              }
            ]
          },
          {
            title: "Senior Triggers [!]",
            isCritical: true,
            triggers: [
              "IF New-onset stridor or respiratory distress develops.",
              "IF 'Surgical Abdomen' (Rigidity, guarding) develops.",
              "IF Massive hematemesis or signs of shock (perforation) occur."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data) => {
    if (data.stridor || data.abdominal_pain) return { level: 'critical', details: ["High-risk Caustic Injury: Airway obstruction or perforation suspected. Immediate ENT/Surgical consult."] };
    if (data.vomiting) return { level: 'severe', details: ["Symptomatic Ingestion: Admit for 24-hour observation and planned endoscopy."] };
    return { level: 'moderate', details: ["Possible Ingestion: Observe for 4-6 hours. If tolerating clear liquids, may discharge."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Endoscopy Grade 0 or 1: Asymptomatic and tolerating oral intake.",
    "Normal Chest/Abdominal X-rays if pain was present.",
    "Grade 2 or 3: Admit for nutritional support and surgical/GI monitoring.",
    "Follow-up scheduled in 3 weeks to screen for delayed esophageal stricture."
  ],
  getRedFlags: [
    "Drooling and inability to swallow saliva",
    "Subcutaneous crepitus in neck/chest",
    "Refusing to eat or drink",
    "Stridor or muffled voice",
    "Severe unrelenting pain"
  ],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "World Journal of GI Endoscopy: Management of Caustic Ingestion", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4014470/" },
    { title: "RCH Melbourne: Caustic Ingestion", url: "https://www.rch.org.au/clinicalguide/guideline_index/Caustic_ingestion/" }
  ],
};
