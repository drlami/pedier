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
  description: 'Senior management of non-variceal and variceal GI bleeding: Stabilization, PPI therapy, and endoscopy timing.',
  image: {
    url: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Hematemesis or Melena assessment"
  },
  questions: [],

  mmpData: {
    stages: [
      {
        label: "Hemodynamic Stabilization",
        shortLabel: "Hemodynamic Stabilization",
        color: "red",
        cards: [
          {
            title: "Immediate Triage & Access",
            isCritical: true,
            instructions: [
              "1. Two large-bore IVs (or IO if unstable).",
              "2. Volume Expansion: 20 mL/kg Isotonic Crystalloid boluses until stable.",
              "3. Bloods: CBC, Cross-match (2 units), PT/PTT/INR, LFTs, BUN/Creatinine (BUN/Cr ratio > 30 suggests Upper GI bleed)."
            ]
          },
          {
            title: "Transfusion Triggers",
            instructions: [
              "1. Hemoglobin < 7 g/dL (Restricted strategy).",
              "2. Ongoing Massive Bleeding (regardless of Hb).",
              "3. Target Hb: 7-9 g/dL (avoid over-transfusion in portal hypertension)."
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
        label: "Medical Therapy (Upper GI Focus)",
        shortLabel: "Medical Therapy (Upper GI Focus)",
        color: "blue",
        cards: [
          {
            title: "Proton Pump Inhibitor (PPI) Directive",
            instructions: [
              "For suspected Peptic Ulcer Disease or Gastritis.",
              "Route: IV preferred for active/severe bleeding."
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
            title: "Vasoactive Therapy (Suspected Variceal)",
            threshold: "LIVER DISEASE / PORTAL HYPERTENSION",
            instructions: [
              "Indication: Suspected esophageal varices bleeding.",
              "Consult Pediatric Gastroenterology immediately."
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
        label: "Endoscopy & Surgical Referral",
        shortLabel: "Endoscopy & Surgical Referral",
        color: "amber",
        cards: [
          {
            title: "Endoscopy Timing (NASPGHAN)",
            instructions: [
              "1. Urgent (within 12h): Hemodynamic instability despite resuscitation, or suspected variceal bleed.",
              "2. Early (within 24h): Most other cases of significant hematemesis/melena.",
              "3. Elective: Stable minor bleeding."
            ]
          },
          {
            title: "Lower GI Bleeding Triage",
            threshold: "MELENA OR BRBPR",
            instructions: [
              "1. Neonate: APT test (maternal blood), NEC, Volvulus.",
              "2. Infant: Anal fissure, Cow's milk protein allergy, Intussusception.",
              "3. Child: Meckel's diverticulum, Polyps, IBD, HSP."
            ]
          }
        ]
      },
      {
        label: "Post-Procedure & Step-down",
        shortLabel: "Post-Procedure & Step-down",
        color: "emerald",
        cards: [
          {
            title: "Monitoring & Diet",
            instructions: [
              "1. Serial Hemoglobin: Every 6-12h until stable for 24h.",
              "2. Diet: NPO until Endoscopy (if planned); then clear liquids to full diet as tolerated.",
              "3. Discharge: Stable Hb, no active bleeding for 24-48h, clear outpatient follow-up plan."
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
