import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Chronic Diarrhea
 * Focus: Toddler diarrhea vs malabsorption, step-wise dietary/lab workup.
 */
export const wardChronicDiarrheaProtocol: DiseaseProtocol = {
  id: 'ward-chronic-diarrhea',
  name: 'Chronic Diarrhea: Ward Evaluation',
  system: 'Gastrointestinal',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Structured approach to diarrhea lasting > 2-4 weeks: Differentiating functional, infectious, and malabsorptive causes.',
  image: {
    url: "https://images.unsplash.com/photo-1576091160550-2173dad99978?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Growth and stool assessment"
  },
  questions: [],

  mmpData: {
    stages: [
      {
        label: "Clinical Phenotyping & Triage",
        shortLabel: "Clinical Phenotyping & Triage",
        color: "blue",
        cards: [
          {
            title: "Initial History & Growth Check",
            instructions: [
              "1. Growth: Normal growth suggests functional (Toddler's diarrhea). Poor growth suggests malabsorption/IBD.",
              "2. Stool Characteristics: Oily/Smelly (Malabsorption), Bloody (IBD/Infection), Watery/Large volume (Osmotic/Secretory).",
              "3. Diet: Excess juice/sorbitol intake, cow's milk introduction, gluten introduction."
            ]
          },
          {
            title: "Baseline Stool & Blood Tests",
            instructions: [
              "1. Stool: Culture/Ova/Parasites (Giardia is common), Reducing substances, pH (Carbohydrate malabsorption).",
              "2. Stool Calprotectin: Screen for mucosal inflammation (IBD).",
              "3. Bloods: CBC, ESR/CRP, Albumin (Protein-losing enteropathy), Celiac screen (tTG IgA)."
            ]
          }
        ]
      },
      {
        label: "Toddler's Diarrhea vs Malabsorption",
        shortLabel: "Toddler's Diarrhea vs Malabsorption",
        color: "amber",
        cards: [
          {
            title: "Toddler's Diarrhea (Functional)",
            threshold: "WELL-GROWING CHILD (6mo - 5yr)",
            instructions: [
              "1. Characteristics: Frequent watery stools with undigested food; child is otherwise thriving.",
              "2. Management: '4 Fs' - Fiber (increase), Fat (increase), Fluid (optimize), Fruit juice (restrict)."
            ]
          },
          {
            title: "Malabsorption Workup",
            threshold: "GROWTH FAILURE / STEATORRHEA",
            instructions: [
              "1. Stool Elastase: Screen for Pancreatic Insufficiency (Cystic Fibrosis).",
              "2. Sweat Test: If elastase is low or respiratory symptoms present.",
              "3. D-Xylose test (rarely used now; prefer Biopsy)."
            ]
          }
        ]
      },
      {
        label: "Advanced Investigations",
        shortLabel: "Advanced Investigations",
        color: "red",
        cards: [
          {
            title: "Endoscopy & Biopsy",
            threshold: "IF CELIAC +, IBD SUSPECTED, OR FTT",
            instructions: [
              "1. Upper Endoscopy (EGD): For Celiac (duodenal biopsy), Eosinophilic GE, or Giardia.",
              "2. Colonoscopy: For suspected IBD, Polyps, or Allergic Colitis."
            ]
          },
          {
            title: "Dietary Elimination Trials",
            instructions: [
              "1. Lactose-free trial (2 weeks).",
              "2. Cow's Milk Protein-free trial (if allergic features present).",
              "Note: Do NOT start Gluten-free diet before Celiac testing is complete."
            ]
          }
        ]
      },
      {
        label: "Chronic Management",
        shortLabel: "Chronic Management",
        color: "emerald",
        cards: [
          {
            title: "Nutritional Rehabilitation",
            instructions: [
              "1. Dietitian Consultation: Essential for all malabsorptive disorders.",
              "2. Vitamin Supplementation: Fat-soluble vitamins (A, D, E, K) if steatorrhea present.",
              "3. Monitoring: Growth curves (Weight and Height) at every visit."
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
