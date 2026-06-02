import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Galactosemia (Classic)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: Galactosemia Network (GalNet) Guidelines and RCH Melbourne
 */
export const wardGalactosemiaProtocol: DiseaseProtocol = {
  id: 'ward-galactosemia',
  name: 'Galactosemia Master Pathway',
  system: 'Metabolic Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Classic Galactosemia is a life-threatening inborn error of metabolism caused by a severe deficiency of the Galactose-1-Phosphate Uridylyltransferase (GALT) enzyme. This leads to the toxic accumulation of galactose-1-phosphate, resulting in neonatal liver failure, sepsis, and cataracts. This exhaustive directive covers the immediate elimination of dietary lactose, management of Gram-negative sepsis, and long-term neuro-developmental monitoring.',
  image: {
    url: "https://images.unsplash.com/photo-1559839734-2b71f1e3c7e5?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Neonatal jaundice and metabolic liver failure management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'jaundice', questionText: 'Significant jaundice or hepatomegaly?', type: 'boolean' },
    { id: 'sepsisSigns', questionText: 'Signs of sepsis (Fever, lethargy, poor perfusion)?', type: 'boolean' },
    { id: 'reducingSubstances', questionText: 'Urine positive for reducing substances (but negative for glucose)?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Management of Classic Galactosemia is a neonatal emergency focusing on (1) Immediate and permanent elimination of all lactose-containing milk (breast milk and cow's milk formula) in favor of Soy-based formula, (2) Aggressive treatment of suspected Escherichia coli sepsis which is highly associated with untreated galactosemia, and (3) Reversing acute liver dysfunction and coagulopathy. Clinicians must NOT wait for enzyme confirmation if clinical suspicion is high.",
    stages: [
      {
        label: "Stage 1: Neonatal Crisis Identification",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Classic Presentation Hallmarks",
            threshold: "NEONATAL ONSET (DAY 3-14)",
            orders: [
              "Liver Dysfunction: Jaundice (conjugated or unconjugated), hepatomegaly, and bleeding tendencies.",
              "Gastrointestinal: Poor feeding, vomiting, and failure to gain weight.",
              "Ocular: Early formation of 'oil-drop' cataracts (perform slit-lamp exam).",
              "Sepsis Link: High risk of Escherichia coli (E. coli) neonatal sepsis."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Diagnostic Workup: Quantitative GALT enzyme activity and Galactose-1-Phosphate levels (Collect BEFORE any exchange transfusion).",
              "Bedside Screen: Urine reducing substances (positive in galactosemia) while on a lactose-containing diet.",
              "Liver Baseline: Bilirubin (total/direct), International Normalized Ratio (INR), and transaminases.",
              "Sepsis Screen: Blood Cultures and C-Reactive Protein."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Dietary & Sepsis Rescue",
        shortLabel: "Management",
        color: "red",
        cards: [
          {
            title: "The Lactose-Free Directive",
            threshold: "STOP ALL MILK IMMEDIATELY",
            isCritical: true,
            orders: [
              "Nutritional Switch: Stop breast milk and standard infant formula immediately.",
              "Safe Alternatives: Start Soy-based formula (e.g., Isomil, ProSobee) or elemental formula (Pregestimil/Nutramigen).",
              "Note: This dietary change must be lifelong for classic galactosemia."
            ]
          },
          {
            title: "Empiric Antibiotic Protocol",
            threshold: "SUSPECTED SEPSIS",
            orders: [
              "Antimicrobial Strategy: PREFERRED REGIMEN: DUAL THERAPY (Ampicillin + Gentamicin or Cefotaxime) to cover Escherichia coli and other Gram-negative pathogens."
            ],
            prescriptions: [
              {
                drug: "Cefotaxime",
                dose: "50 mg/kg",
                route: "Intravenous",
                frequency: "Every 8-12 hours",
                calculation: (w) => `${(w * 50).toFixed(0)} mg`,
                notes: "Preferred over Gentamicin if renal function is impaired by liver failure."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 3: Nursing & Hepatic Support [NS]",
        shortLabel: "Monitoring",
        color: "amber",
        cards: [
          {
            title: "Vigilance Monitoring",
            nursing: [
              "Weight: Daily weight checks to monitor for ascites or fluid retention.",
              "Bleeding Risk: Monitor for oozing from umbilical stump or puncture sites.",
              "Neurological Check: Assess for lethargy or seizures (hypoglycemia risk).",
              "Fluid Balance: Strict Intake and Output charting."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Long-Term Sequelae Roadmap",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Post-Crisis Monitoring",
            orders: [
              "Ophthalmology: Regular slit-lamp exams to monitor for cataract resolution or progression.",
              "Developmental Surveillance: Close monitoring for speech delay (very common), motor deficits, and primary ovarian insufficiency in females.",
              "Metabolic Follow-up: Regular Galactose-1-Phosphate monitoring to ensure dietary compliance."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.sepsisSigns === true || data.jaundice === true) {
      return { level: 'critical', details: ["Acute Galactosemic Crisis - High risk of liver failure and E. coli sepsis."] };
    }
    return { level: 'severe', details: ["Suspected Galactosemia - Immediate dietary intervention required."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Stable switch to Soy-based formula completed.",
    "Liver function and coagulation starting to normalize.",
    "Sepsis treated with appropriate antibiotic course.",
    "Parent training on 'Strict Lactose-Free' diet and hidden sources of galactose."
  ],
  getRedFlags: () => ["Unresponsive lethargy", "Active bleeding (Coagulopathy)", "Fever (Sepsis)", "Failure to gain weight"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "International guidelines for the management of classic galactosemia", url: "https://pubmed.ncbi.nlm.nih.gov/28169140/" },
    { title: "RCH Melbourne: Galactosemia", url: "https://www.rch.org.au/" }
  ]
};
