import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Jaundice in the Older Child (Post-Neonatal)
 * Focus: Obstructive vs Hepatocellular approach.
 */
export const wardJaundiceChildProtocol: DiseaseProtocol = {
  id: 'ward-jaundice-child',
  name: 'Jaundice in Children: Ward Evaluation',
  system: 'Gastrointestinal & Hepatology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Approach to jaundice beyond the neonatal period: Differentiating pre-hepatic, hepatocellular, and obstructive causes.',
  image: {
    url: "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Scleral icterus assessment"
  },
  questions: [],

  mmpData: {
    stages: [
      {
        label: "Fractionation & Initial Triage",
        shortLabel: "Fractionation & Initial Triage",
        color: "blue",
        cards: [
          {
            title: "Bilirubin Fractionation (CRITICAL)",
            isCritical: true,
            instructions: [
              "1. Measure Total and Direct (Conjugated) Bilirubin.",
              "2. Conjugated Hyperbilirubinemia: Direct > 1.0 mg/dL or > 20% of total. ALWAYS PATHOLOGIC.",
              "3. Unconjugated Hyperbilirubinemia: Hemolysis, Gilbert's syndrome, or Crigler-Najjar."
            ]
          },
          {
            title: "Baseline Liver Panel",
            instructions: [
              "1. ALT/AST (Hepatocellular injury), GGT/Alkaline Phosphatase (Cholestasis).",
              "2. Albumin, PT/INR (Synthetic function markers).",
              "3. CBC with Reticulocyte count and Peripheral Smear (Hemolysis screen)."
            ]
          }
        ]
      },
      {
        label: "Hepatocellular Workup",
        shortLabel: "Hepatocellular Workup",
        color: "amber",
        cards: [
          {
            title: "Infectious & Autoimmune Screen",
            threshold: "HIGH ALT / AST",
            instructions: [
              "1. Viral Hepatitis: Hep A (IgM), Hep B (sAg), Hep C (Ab), EBV, CMV.",
              "2. Autoimmune Hepatitis: ANA, ASMA (Anti-Smooth Muscle), LKM-1, IgG levels.",
              "3. Wilson's Disease: Ceruloplasmin (if > 3-5 years old)."
            ]
          }
        ]
      },
      {
        label: "Obstructive / Cholestatic Workup",
        shortLabel: "Obstructive / Cholestatic Workup",
        color: "red",
        cards: [
          {
            title: "Imaging Directive",
            threshold: "HIGH GGT / DIRECT BILIRUBIN",
            instructions: [
              "1. Ultrasound RUQ (MANDATORY): Assess biliary tree, look for Choledochal cyst, Gallstones, or Biliary sludge.",
              "2. MRCP: If US is inconclusive but biliary dilation present.",
              "3. HIDA Scan: If biliary atresia still in differential (infants) or gallbladder dysfunction."
            ]
          }
        ]
      },
      {
        label: "Management & Referral",
        shortLabel: "Management & Referral",
        color: "emerald",
        cards: [
          {
            title: "Supportive Care",
            instructions: [
              "1. Pruritus: Ursodeoxycholic Acid (UDCA) or Cholestyramine.",
              "2. Nutrition: Fat-soluble vitamin (A, D, E, K) supplementation if cholestatic.",
              "3. Specialist: Refer to Pediatric Hepatology for all conjugated jaundice or failing synthetic function."
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
    { title: "NASPGHAN/ESPGHAN: Evaluation of Cholestatic Jaundice", url: "https://naspghan.org/files/Evaluation_of_the_Infant_with_Cholestatic_Jaundice.pdf" },
    { title: "RCH Melbourne: Jaundice in the Older Child", url: "https://www.rch.org.au/clinicalguide/guideline_index/Jaundice_in_the_older_child/" }
  ],
};
