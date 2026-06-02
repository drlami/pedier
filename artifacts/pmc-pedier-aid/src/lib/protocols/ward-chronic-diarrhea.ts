import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Chronic Diarrhea
 * Focus: Toddler diarrhea vs malabsorption, step-wise dietary/lab workup.
 */
export const wardChronicDiarrheaProtocol: DiseaseProtocol = {
  id: 'ward-chronic-diarrhea',
  name: 'Chronic Diarrhea: Ward Evaluation',
  system: 'Gastrointestinal & Hepatology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Chronic Diarrhea is defined as a decrease in stool consistency or increase in frequency (greater than or equal to 3 episodes per day) lasting more than 4 weeks. This pathway provides a structured approach to differentiate between functional causes (e.g., Toddler’s Diarrhea), malabsorptive conditions (e.g., Celiac Disease, Cystic Fibrosis), and inflammatory disorders (e.g., Inflammatory Bowel Disease).',
  image: {
    url: "https://images.unsplash.com/photo-1576091160550-2173dad99978?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Growth and stool assessment"
  },
  questions: [],

  mmpData: {
    snapshot: "Management focuses on 'Growth-First' triage: (1) Children with normal growth and no red flags likely have functional diarrhea (Toddler's Diarrhea) requiring dietary modification. (2) Children with growth failure, anemia, or nighttime symptoms require a systematic workup for malabsorption or inflammation. Diagnostic efficiency is achieved through stepwise testing, starting with non-invasive stool and blood markers before proceeding to endoscopy.",
    stages: [
      {
        label: "Stage 1: Clinical Phenotyping & Initial Triage",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Growth & Stool Characterization",
            orders: [
              "Growth Status: Plot weight and height on growth charts. Normal growth strongly suggests a functional cause (e.g., Toddler's Diarrhea). Poor growth suggests Malabsorption or Inflammatory Bowel Disease.",
              "Stool Quality: Oily or foul-smelling stools suggest Fat Malabsorption (Steatorrhea); Visible Blood or Mucus suggests Inflammation; Watery and large-volume stools suggest Osmotic or Secretory causes.",
              "Dietary Audit: Review intake of fruit juices (sorbitol/fructose), cow's milk, and gluten-containing products."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Complete Blood Count and differential to screen for anemia or chronic inflammation.",
              "Inflammatory Markers: Erythrocyte Sedimentation Rate (ESR) and C-Reactive Protein (CRP).",
              "Metabolic Panel: Serum Albumin (to screen for protein loss), Urea, and Electrolytes.",
              "Stool Analysis: Culture for pathogens, Ova and Parasites (especially Giardia), Stool pH, and Reducing Substances.",
              "Fecal Calprotectin: A sensitive marker for intestinal mucosal inflammation.",
              "Celiac Screen: Tissue Transglutaminase (tTG) IgA and Total Immunoglobulin A (IgA)."
            ]
          },
          {
            title: "Nursing: Clinical Monitoring [NS]",
            nursing: [
              "Accurate Daily Weight measurement at the same time each day.",
              "Stool Diary: Document frequency, volume, and consistency using the Bristol Stool Scale.",
              "Monitor for Red Flags: Report any nocturnal diarrhea that wakes the child from sleep.",
              "Hydration Assessment: Monitor for signs of dehydration including dry mucous membranes or decreased urine output."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Differentiating Functional vs. Organic Causes",
        shortLabel: "Diagnosis",
        color: "amber",
        cards: [
          {
            title: "Toddler’s Diarrhea (Functional Diarrhea)",
            threshold: "WELL-GROWING CHILD (6 MONTHS - 5 YEARS)",
            orders: [
              "Identify '4 Fs' Management: (1) Fiber (increase), (2) Fat (ensure adequate intake), (3) Fluid (optimize water intake), (4) Fruit juice (limit or eliminate).",
              "Provide Reassurance: Explain that this is a benign condition that typically resolves by age 5.",
              "Schedule follow-up to ensure continued normal growth."
            ]
          },
          {
            title: "Malabsorption Workup",
            threshold: "GROWTH FAILURE OR STEATORRHEA",
            orders: [
              "Fecal Elastase: Primary screen for Pancreatic Insufficiency (to rule out Cystic Fibrosis).",
              "Sweat Chloride Test: If fecal elastase is low or the child has recurrent respiratory infections.",
              "Fat-Soluble Vitamin Levels: Check Vitamin A, D, E, and K levels if malabsorption is confirmed."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Advanced Investigations & Specialty Procedures",
        shortLabel: "Advanced Workup",
        color: "red",
        cards: [
          {
            title: "Endoscopy & Biopsy Guidance",
            threshold: "IF CELIAC POSITIVE, IBD SUSPECTED, OR UNEXPLAINED FAILURE TO THRIVE",
            orders: [
              "Upper Endoscopy (Esophagogastroduodenoscopy): For duodenal biopsies to confirm Celiac Disease or assess for Eosinophilic Gastrointestinal Disorders.",
              "Colonoscopy: For suspected Inflammatory Bowel Disease (Crohn’s or Colitis) or to investigate Polyps.",
              "Note: Do NOT start a Gluten-Free Diet before all Celiac testing and biopsies are completed."
            ]
          },
          {
            title: "Structured Dietary Trials",
            orders: [
              "Lactose-Free Trial: Eliminate dairy for 2 weeks to assess for secondary lactose intolerance.",
              "Cow's Milk Protein Elimination: If features of allergic enterocolitis are present (e.g., blood in stool in an infant)."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Nutritional Rehabilitation & Long-term Care",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Multidisciplinary Management",
            orders: [
              "Dietitian Consultation: Essential for all children with malabsorption or specific dietary restrictions.",
              "Nutritional Supplementation: High-calorie formulas or micronutrient replacement as needed.",
              "Growth Monitoring: Continued regular plotting of Weight and Height on standardized charts.",
              "Follow-up Plan: Coordinate care between Pediatrics and Pediatric Gastroenterology."
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
    { title: "NASPGHAN: Clinical Practice Guideline for Chronic Diarrhea", url: "https://naspghan.org/files/Chronic_Diarrhea_in_Children.pdf" },
    { title: "ESPGHAN: Management of Chronic Diarrhea", url: "https://journals.lww.com/jpgn/Fulltext/2012/10000/ESPGHAN_Guidelines.1.aspx" }
  ],
};
