import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Tyrosinemia Type 1
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: International Tyrosinemia Type 1 Guidelines and RCH Melbourne
 */
export const wardTyrosinemiaProtocol: DiseaseProtocol = {
  id: 'ward-tyrosinemia',
  name: 'Tyrosinemia Type 1 Master Pathway',
  system: 'Metabolic Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Tyrosinemia Type 1 is a severe inherited metabolic disorder caused by a deficiency of the Fumarylacetoacetate Hydrolase (FAH) enzyme. This leads to the accumulation of toxic succinylacetone, causing acute liver failure, renal tubulopathy (Fanconi syndrome), and a high risk of hepatocellular carcinoma. This exhaustive directive covers the use of Nitisinone (NTBC), acute hepatic rescue, and long-term tumor surveillance.',
  image: {
    url: "https://images.unsplash.com/photo-1559839734-2b71f1e3c7e5?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Critical hepatic and metabolic management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'liverFailure', questionText: 'Signs of liver failure (INR > 1.5, jaundice, or ascites)?', type: 'boolean' },
    { id: 'boiledCabbageOdor', questionText: 'Characteristic "boiled cabbage" body odor detected?', type: 'boolean' },
    { id: 'ricketsSigns', questionText: 'Clinical signs of rickets or renal tubular loss?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Management of Tyrosinemia Type 1 focuses on (1) Immediate initiation of Nitisinone (NTBC) to block the production of toxic succinylacetone, (2) Strict dietary restriction of Tyrosine and Phenylalanine, and (3) Reversing acute liver dysfunction and coagulopathy. Nitisinone has transformed this from a fatal childhood disease into a manageable chronic condition, but only if started before irreversible liver damage occurs.",
    stages: [
      {
        label: "Stage 1: Crisis Identification & Diagnostics",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Pathognomonic Markers",
            threshold: "URGENT SEARCH",
            orders: [
              "Succinylacetone (Blood/Urine): MANDATORY. The presence of succinylacetone is diagnostic of Tyrosinemia Type 1.",
              "Alpha-Fetoprotein (AFP): Typically extremely high (often > 100,000 ng/mL) at presentation.",
              "Liver Baseline: International Normalized Ratio (INR), Bilirubin, Albumin, and Transaminases.",
              "Renal Baseline: Electrolytes (screen for low Phosphate/Potassium), Glucose, and Urinalysis (screen for Fanconi syndrome/glycosuria)."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Nutritional Halt: Stop all natural protein intake immediately. Provide non-protein calories via Dextrose.",
              "Vitamin K: Administer Intravenous Vitamin K (2-5 mg) to support coagulation.",
              "Radiology: Baseline Ultrasound of the liver to screen for nodules or cirrhosis."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Pharmacological Blockade (Nitisinone)",
        shortLabel: "Management",
        color: "red",
        cards: [
          {
            title: "Nitisinone (NTBC) Protocol",
            threshold: "START IMMEDIATELY UPON SUSPICION",
            isCritical: true,
            orders: [
              "Primary Goal: Block the enzyme parahydroxyphenylpyruvate dioxygenase to stop toxin formation.",
              "Dose: 1 mg/kg/day (administered as a single dose or divided twice daily).",
              "Note: Do NOT wait for succinylacetone results if the patient has liver failure and high AFP; start NTBC immediately."
            ],
            prescriptions: [
              {
                drug: "Nitisinone (NTBC)",
                dose: "1 mg/kg/day",
                route: "Oral",
                frequency: "Once daily (or divided)",
                calculation: (w) => `${(w * 1.0).toFixed(0)} mg`,
                notes: "Available as capsules or oral suspension. Essential for survival."
              }
            ]
          },
          {
            title: "Hepatic Support",
            orders: [
              "Antimicrobial Strategy: PREFERRED REGIMEN: MONOTHERAPY (Ceftriaxone) if the patient is febrile or has ascites (risk of spontaneous bacterial peritonitis).",
              "Phosphate Supplementation: Required for patients with renal tubular loss (Rickets prevention)."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Nursing & Safety [NS]",
        shortLabel: "Monitoring",
        color: "amber",
        cards: [
          {
            title: "Vigilance Monitoring",
            nursing: [
              "Bleeding Risk: Monitor for bruising or oozing from line sites (due to liver failure).",
              "Dietary Compliance: Ensure strictly Tyrosine/Phenylalanine-free formula is used.",
              "Neurological Check: Assess for lethargy or irritability (Encephalopathy or Hypoglycemia risk).",
              "Skin Assessment: Monitor for any new rashes (NTBC can rarely cause skin changes)."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Long-Term Tumor Surveillance",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "The Surveillance Roadmap",
            orders: [
              "Tumor Marker: Alpha-Fetoprotein levels every 3-6 months for life.",
              "Imaging: Liver Ultrasound or Magnetic Resonance Imaging (MRI) every 6-12 months to screen for Hepatocellular Carcinoma.",
              "Eye Care: Regular ophthalmology check (High Tyrosine levels from NTBC can cause corneal crystals).",
              "Emergency Plan: Provide the family with a Metabolic Emergency Regimen for periods of illness."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.liverFailure === true) {
      return { level: 'critical', details: ["Acute Liver Failure - High risk for bleeding and transplant evaluation required."] };
    }
    return { level: 'severe', details: ["Tyrosinemia Type 1 - Immediate Nitisinone and dietary restriction required."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Coagulation and liver markers improving.",
    "Tolerating specialized Tyrosine-free formula.",
    "First dose of Nitisinone administered and well-tolerated.",
    "Parent understands the risk of liver cancer and the need for regular imaging."
  ],
  getRedFlags: () => ["Active bleeding", "Ascites (fluid in abdomen)", "Increasing jaundice", "Bone pain or fractures (Rickets)"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "International guidelines for the management of tyrosinemia type 1", url: "https://pubmed.ncbi.nlm.nih.gov/28169140/" },
    { title: "RCH Melbourne: Tyrosinemia", url: "https://www.rch.org.au/" }
  ]
};
