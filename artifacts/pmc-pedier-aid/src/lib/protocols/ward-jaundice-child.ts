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
  description: 'Jaundice in the post-neonatal period is a clinical sign of hyperbilirubinemia that requires systematic differentiation between pre-hepatic (hemolysis), hepatocellular (liver injury), and obstructive (cholestatic) causes. This pathway guides the clinical evaluation, laboratory fractionation, and imaging strategies necessary to identify the underlying etiology and assess liver synthetic function.',
  image: {
    url: "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Scleral icterus assessment"
  },
  questions: [],

  mmpData: {
    snapshot: "Management follows the 'Fractionate-Localize-Investigate' priority: (1) Immediate fractionation into conjugated vs. unconjugated bilirubin, (2) Assessment of liver synthetic function (INR/Albumin) and hepatocellular injury (ALT/AST), and (3) Targeted investigation including viral serology, autoimmune markers, and biliary imaging (Ultrasound). Conjugated hyperbilirubinemia always warrants urgent specialist consultation.",
    stages: [
      {
        label: "Stage 1: Bilirubin Fractionation & Triage",
        shortLabel: "Fractionation",
        color: "blue",
        cards: [
          {
            title: "Initial Physician Orders [DR]",
            isCritical: true,
            orders: [
              "Bilirubin Fractionation: Measure Total and Direct (Conjugated) Bilirubin immediately.",
              "Conjugated Hyperbilirubinemia Definition: Direct Bilirubin greater than 1.0 mg/dL or greater than 20% of the Total Bilirubin. This is ALWAYS pathologic and requires urgent workup.",
              "Liver Function Panel: Monitor Alanine Aminotransferase (ALT), Aspartate Aminotransferase (AST), Gamma-Glutamyl Transferase (GGT), and Alkaline Phosphatase.",
              "Synthetic Function Markers: Check Albumin, Prothrombin Time (PT), and International Normalized Ratio (INR).",
              "Hemolysis Screen: Complete Blood Count, Reticulocyte count, and Peripheral Blood Smear."
            ]
          },
          {
            title: "Nursing: Strict Monitoring [NS]",
            nursing: [
              "Daily Weight: Monitor for changes in nutritional status or fluid retention.",
              "Stool and Urine Assessment: Document and describe color (e.g., pale/acholic stools or dark/tea-colored urine).",
              "Symptom Documentation: Record severity of pruritus and any changes in mental status (irritability/lethargy).",
              "Skin Integrity: Monitor for excoriations due to itching."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Hepatocellular Workup",
        shortLabel: "Hepatocellular",
        color: "amber",
        cards: [
          {
            title: "Diagnostic Investigation [DR]",
            threshold: "ELEVATED ALT / AST",
            orders: [
              "Viral Hepatitis Screen: Order Hepatitis A (IgM), Hepatitis B (Surface Antigen/Core Antibody), Hepatitis C (Antibody), Epstein-Barr Virus (EBV), and Cytomegalovirus (CMV).",
              "Autoimmune Panel: Anti-Nuclear Antibody (ANA), Anti-Smooth Muscle Antibody (ASMA), Liver-Kidney Microsomal Type 1 (LKM-1) antibodies, and total Immunoglobulin G (IgG) levels.",
              "Metabolic Screening: Ceruloplasmin (if patient is older than 3 years to screen for Wilson's Disease) and Alpha-1 Antitrypsin level/phenotype."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Obstructive & Cholestatic Workup",
        shortLabel: "Obstructive",
        color: "red",
        cards: [
          {
            title: "Imaging Directive [DR]",
            threshold: "ELEVATED GGT / DIRECT BILIRUBIN",
            orders: [
              "Right Upper Quadrant Ultrasound: Mandatory initial step to assess the biliary tree, look for Choledochal cysts, Gallstones, or Biliary sludge.",
              "Advanced Imaging: Request Magnetic Resonance Cholangiopancreatography (MRCP) if Ultrasound is inconclusive but biliary dilation is present.",
              "HIDA Scan: Consider if biliary atresia (in infants) or gallbladder dysfunction is suspected."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Management & Specialty Referral",
        shortLabel: "Management",
        color: "emerald",
        cards: [
          {
            title: "Therapeutic Strategy",
            orders: [
              "Pruritus Management: Consider Ursodeoxycholic Acid (UDCA) or Cholestyramine for symptomatic relief of itching.",
              "Nutritional Support: Initiate Fat-soluble vitamin (A, D, E, K) supplementation if cholestasis is confirmed.",
              "Specialist Consultation: Refer to Pediatric Hepatology/Gastroenterology for all cases of conjugated jaundice or if there is any evidence of failing liver synthetic function."
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
