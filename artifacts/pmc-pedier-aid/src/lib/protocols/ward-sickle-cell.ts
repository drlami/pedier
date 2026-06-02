import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Sickle Cell Disease (Acute Crisis)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: NHLBI Guidelines, ASH 2020, and RCH Melbourne
 */
export const wardSickleCellProtocol: DiseaseProtocol = {
  id: 'ward-sickle-cell',
  name: 'Sickle Cell Crisis Master Pathway',
  system: 'Hematology & Oncology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Sickle Cell Disease is an inherited hemoglobinopathy characterized by the production of abnormal Hemoglobin S, leading to red blood cell sickling, hemolysis, and microvascular occlusion. Acute crises include Vaso-Occlusive Crisis (VOC), Acute Chest Syndrome (ACS), and Splenic Sequestration. This exhaustive directive covers rapid opioid titration, oxygenation targets, and life-saving transfusion thresholds.',
  image: {
    url: "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Assessment of pain distribution and respiratory effort"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'painScore', questionText: 'Pain Score (0-10)', type: 'number' },
    { id: 'oxygenSaturation', questionText: 'Oxygen Saturation (%)', type: 'number' },
    { id: 'respiratoryDistress', questionText: 'New cough, chest pain, or increased work of breathing?', type: 'boolean' },
    { id: 'splenomegaly', questionText: 'Sudden increase in spleen size or pallor?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Sickle Cell management focuses on (1) Rapid pain control ('Door-to-Opioid' within 30-60 minutes), (2) Early identification of Acute Chest Syndrome which is the leading cause of mortality, and (3) Maintaining euvolemia while avoiding over-hydration (which can trigger pulmonary edema). Clinicians must respect the patient's baseline Hemoglobin and avoid unnecessary transfusions unless critical thresholds are met.",
    stages: [
      {
        label: "Stage 1: Acute Pain & Vaso-Occlusive Rescue",
        shortLabel: "Pain Control",
        color: "red",
        cards: [
          {
            title: "The 'Golden 30' Pain Directive",
            threshold: "START WITHIN 30-60 MINUTES",
            isCritical: true,
            orders: [
              "Rapid Opioid Titration: Use Intravenous Morphine or Hydromorphone for severe pain. Do NOT wait for laboratory results.",
              "Adjuvant Therapy: Administer Ibuprofen (unless contraindicated) and Paracetamol round-the-clock as opioid-sparing agents.",
              "Hydration: Start Intravenous Isotonic Saline (0.9% Sodium Chloride) at 1.0x to 1.25x maintenance rate. AVOID over-hydration (risk of Acute Chest Syndrome)."
            ],
            prescriptions: [
              {
                drug: "Morphine",
                dose: "0.1 mg/kg",
                route: "Intravenous",
                frequency: "Every 2-4 hours PRN",
                calculation: (w) => `${(w * 0.1).toFixed(1)} mg`,
                notes: "Titrate until pain score < 4. Consider Patient Controlled Analgesia (PCA) if pain persists."
              }
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Complete Blood Count and Reticulocyte Count: Critical to compare with the patient's 'Steady State' baseline.",
              "Blood Group and Crossmatch: Maintain an updated crossmatch for 'Extended Phenotype' blood.",
              "Inflammatory Markers: C-Reactive Protein (often elevated in crisis but monitor for rising trend).",
              "Neurological Check: Assess for focal weakness or speech changes (Risk of Ischemic Stroke)."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Acute Chest Syndrome (ACS) Vigilance",
        shortLabel: "Respiratory",
        color: "blue",
        cards: [
          {
            title: "ACS Diagnostic Criteria",
            threshold: "NEW RADIOGRAPHIC INFILTRATE",
            orders: [
              "Clinical Triggers: New fever, cough, chest pain, or Oxygen Saturation decrease of > 3% from baseline.",
              "Radiology: MANDATORY Chest X-ray for any respiratory symptom.",
              "Incentive Spirometry: MANDATORY (10 breaths every 2 hours while awake) to prevent atelectasis and progression to ACS."
            ]
          },
          {
            title: "Antimicrobial Strategy (ACS Suspected)",
            threshold: "IF ACS CRITERIA MET",
            orders: [
              "PREFERRED REGIMEN: DUAL THERAPY to cover typical and atypical respiratory pathogens.",
              "Target: Streptococcus pneumoniae and Mycoplasma pneumoniae."
            ],
            prescriptions: [
              {
                drug: "Ceftriaxone",
                dose: "50-100 mg/kg",
                route: "Intravenous",
                frequency: "Once daily",
                calculation: (w) => `${Math.min(w * 50, 2000).toFixed(0)} mg`,
                notes: "Maximum 2 grams."
              },
              {
                drug: "Azithromycin",
                dose: "10 mg/kg",
                route: "Oral/Intravenous",
                frequency: "Once daily",
                calculation: (w) => `${Math.min(w * 10, 500).toFixed(0)} mg`,
                notes: "Covers atypical pathogens."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 3: Transfusion & Hematological Emergencies [!]",
        shortLabel: "Transfusion",
        color: "red",
        cards: [
          {
            title: "Transfusion Thresholds",
            isCritical: true,
            orders: [
              "Simple Transfusion: Indicated if Hemoglobin falls > 2 g/dL below baseline AND symptomatic (Tachycardia/Hypotension).",
              "Exchange Transfusion: Indicated for severe Acute Chest Syndrome (hypoxia), Ischemic Stroke, or multi-organ failure.",
              "Caution: Do NOT transfuse to a Hemoglobin > 10 g/dL (risk of hyperviscosity and secondary sickling)."
            ]
          },
          {
            title: "Splenic Sequestration",
            threshold: "SPLEEN > 2CM BELOW BASELINE",
            orders: [
              "Signs: Sudden drop in Hemoglobin (> 2 g/dL), high Reticulocyte count, and rapidly enlarging, painful spleen.",
              "Action: Immediate fluid resuscitation (bolus) and urgent simple transfusion to restore circulatory volume."
            ]
          },
          {
            title: "Aplastic Crisis",
            threshold: "LOW HEMOGLOBIN + LOW RETICULOCYTES",
            orders: [
              "Signs: Profound anemia with Reticulocyte count < 1.0% (indicates marrow failure, often Parvovirus B19).",
              "Action: Isolation and simple transfusion support until marrow recovers."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Nursing Care & Discharge [NS]",
        shortLabel: "Monitoring",
        color: "emerald",
        cards: [
          {
            title: "Strict Bedside Monitoring",
            nursing: [
              "Oxygenation: Maintain Oxygen Saturation > 92-95% (or at patient's baseline).",
              "Pain Assessment: Re-assess pain score every 30-60 minutes until stabilized.",
              "Lung Assessment: Auscultate for new crackles or decreased air entry every 4 hours.",
              "Bowel Monitoring: Monitor for constipation (Opioid side effect); ensure regular stool softeners."
            ]
          },
          {
            title: "Discharge Criteria",
            orders: [
              "Pain well-controlled on Oral medications (usually Oxycodone + NSAIDs).",
              "Hemoglobin and Reticulocyte count stable.",
              "Respiratory status at baseline and afebrile for 24 hours.",
              "Follow-up: Review in Hematology clinic within 1-2 weeks."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.respiratoryDistress === true || data.splenomegaly === true || (data.oxygenSaturation && data.oxygenSaturation < 90)) {
      return { level: 'critical', details: ["Major complication (ACS or Sequestration) - High risk of rapid deterioration."] };
    }
    if (data.painScore && data.painScore >= 8) {
      return { level: 'severe', details: ["Severe Vaso-Occlusive Crisis requiring aggressive opioid titration."] };
    }
    return { level: 'moderate', details: ["Stable Sickle Cell Pain Crisis."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Pain score consistently < 4 on oral medications.",
    "Oxygen saturation stable at baseline.",
    "Parent understands signs of Acute Chest Syndrome and Splenic Sequestration.",
    "Hydroxyurea adherence reviewed and therapy continued."
  ],
  getRedFlags: () => ["Shortness of breath", "Sudden weakness (Stroke)", "Severe abdominal pain", "Priapism (painful erection)", "Fever > 38.5°C"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "NHLBI: Evidence-Based Management of Sickle Cell Disease", url: "https://www.nhlbi.nih.gov/health-topics/evidence-based-management-sickle-cell-disease" },
    { title: "ASH 2020 Guidelines for Sickle Cell Disease: Stem Cell Transplantation", url: "https://ashpublications.org/bloodadvances/article/4/22/5810/464350" },
    { title: "RCH Melbourne: Sickle Cell Disease", url: "https://www.rch.org.au/clinicalguide/guideline_index/Sickle_Cell_Disease/" }
  ]
};
