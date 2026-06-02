import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: GI Bleeding (Upper & Lower)
 * Focus: Triage, transfusion triggers, and PPI strategy.
 */
export const wardGiBleedingProtocol: DiseaseProtocol = {
  id: 'ward-gi-bleeding',
  name: 'GI Bleeding: Ward Management',
  system: 'Gastrointestinal & Hepatology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Gastrointestinal (GI) bleeding in children encompasses both upper and lower tract hemorrhage, ranging from minor mucosal irritation to life-threatening variceal or peptic ulcer bleeding. This pathway focuses on rapid hemodynamic stabilization, transfusion protocols, pharmacological suppression of acid, and the timing of endoscopic intervention.',
  image: {
    url: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Hematemesis or Melena assessment"
  },
  questions: [],

  mmpData: {
    snapshot: "Management follows the 'Resuscitate-Localize-Intervene' priority: (1) Aggressive volume resuscitation and correction of coagulopathy, (2) Medical suppression with high-dose Proton Pump Inhibitors (PPIs) or vasoactive agents for varices, and (3) Coordination with Gastroenterology for timely endoscopy. Serial hemoglobin monitoring and a restrictive transfusion strategy (target 7-9 g/dL) are paramount.",
    stages: [
      {
        label: "Stage 1: Hemodynamic Resuscitation",
        shortLabel: "Resuscitation",
        color: "red",
        cards: [
          {
            title: "Initial Physician Orders [DR]",
            isCritical: true,
            orders: [
              "Secure two large-bore Intravenous access lines (or Intraosseous if unstable).",
              "Volume Expansion: Administer 20 mL/kg Isotonic Crystalloid (Normal Saline) boluses until hemodynamically stable.",
              "Laboratory Evaluation: Complete Blood Count, Type and Cross-match (2-4 units), Prothrombin Time (PT), Partial Thromboplastin Time (PTT), International Normalized Ratio (INR).",
              "Biochemical Markers: Liver Function Tests, Blood Urea Nitrogen (BUN), and Creatinine (BUN/Creatinine ratio > 30 suggests an Upper GI source).",
              "Keep Patient NPO (Nothing by mouth) in anticipation of endoscopy."
            ]
          },
          {
            title: "Nursing: Strict Monitoring [NS]",
            nursing: [
              "Continuous Cardiac and Pulse Oximetry monitoring.",
              "Check Heart Rate and Blood Pressure every 15-30 minutes during active bleeding.",
              "Strict Intake and Output charting; monitor for signs of shock (prolonged capillary refill, cool extremities).",
              "Observe and document the volume and characteristics of hematemesis, coffee-ground emesis, melena, or hematochezia."
            ]
          },
          {
            title: "Transfusion Triggers",
            orders: [
              "Hemoglobin < 7 g/dL (Restrictive strategy for stable patients).",
              "Ongoing Massive Bleeding: Transfuse regardless of initial Hemoglobin level if there is clinical shock.",
              "Target Hemoglobin: 7-9 g/dL (avoid over-transfusion, especially in portal hypertension, to prevent rebound bleeding)."
            ],
            prescriptions: [
              {
                drug: "Packed Red Blood Cells",
                dose: "10 mL/kg",
                route: "IV",
                frequency: "Over 2-4 hours",
                calculation: (w) => `${(10 * w).toFixed(0)} mL`
              }
            ]
          }
        ]
      },
      {
        label: "Stage 2: Medical Management & Pharmacotherapy",
        shortLabel: "Medical Management",
        color: "blue",
        cards: [
          {
            title: "Proton Pump Inhibitor (PPI) Therapy",
            orders: [
              "Indication: Suspected Peptic Ulcer Disease, Gastritis, or Esophagitis.",
              "Intravenous route is preferred for active or severe bleeding to ensure rapid acid suppression."
            ],
            prescriptions: [
              {
                drug: "Omeprazole (IV)",
                dose: "1 mg/kg (Max 40mg)",
                route: "IV",
                frequency: "Every 12 hours",
                calculation: (w) => `${Math.min(1 * w, 40).toFixed(0)} mg`
              }
            ]
          },
          {
            title: "Vasoactive Therapy (Suspected Variceal Bleeding)",
            threshold: "LIVER DISEASE / PORTAL HYPERTENSION",
            orders: [
              "Indication: Suspected esophageal varices bleeding (e.g., in patients with known Cirrhosis or Biliary Atresia).",
              "Immediately notify Pediatric Gastroenterology and Pediatric Surgery.",
              "Ensure Vitamin K and Fresh Frozen Plasma are available to correct coagulopathy."
            ],
            prescriptions: [
              {
                drug: "Octreotide",
                dose: "1 mcg/kg bolus, then 1-2 mcg/kg/hr",
                route: "IV Continuous",
                frequency: "Continuous Infusion",
                calculation: (w) => `Bolus: ${(1 * w).toFixed(1)} mcg; Rate: ${(1 * w).toFixed(1)} mcg/hr`
              }
            ]
          }
        ]
      },
      {
        label: "Stage 3: Definitive Intervention",
        shortLabel: "Endoscopy",
        color: "amber",
        cards: [
          {
            title: "Endoscopy Timing (NASPGHAN Guidelines)",
            orders: [
              "Urgent (within 12 hours): Persistent hemodynamic instability despite resuscitation, or suspected variceal bleeding.",
              "Early (within 24 hours): Most other cases of significant hematemesis or melena once stabilized.",
              "Elective: Stable patients with minor bleeding or those with a suspected chronic source."
            ]
          },
          {
            title: "Differential Diagnosis by Age (Lower GI)",
            threshold: "MELENA OR BRIGHT RED BLOOD PER RECTUM",
            orders: [
              "Neonates: APT test (to rule out swallowed maternal blood), Necrotizing Enterocolitis, Midgut Volvulus.",
              "Infants: Anal fissure, Cow's milk protein allergy, Intussusception.",
              "Children: Meckel's diverticulum, Juvenile polyps, Inflammatory Bowel Disease (IBD), Henoch-Schönlein Purpura (HSP)."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Recovery & Step-down",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Stabilization & Discharge Markers",
            orders: [
              "Serial Hemoglobin monitoring: Check every 6-12 hours until stable for at least 24 hours.",
              "Gradual reintroduction of diet: NPO until Endoscopy (if planned); then progress from clear liquids to full diet as tolerated.",
              "Discharge Criteria: Stable hemoglobin without transfusion, no active bleeding for 24-48 hours, and a clear outpatient follow-up plan."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: () => ({ level: 'mild', details: [] }),
  getManagement: () => [],
  getDisposition: () => [],
  getRedFlags: () => [],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "NASPGHAN: Management of Acute Upper GI Bleeding", url: "https://naspghan.org/files/Clinical_Report_on_the_Management_of_Acute_Upper_GI_Bleed.pdf" },
    { title: "RCH Melbourne: GI Bleed Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/Gastrointestinal_haemorrhage/" }
  ],
};
