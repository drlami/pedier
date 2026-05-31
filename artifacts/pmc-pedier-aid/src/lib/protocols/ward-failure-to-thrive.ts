import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Failure to Thrive (Growth Faltering)
 * FULL MASTER SENIOR DOCTOR MANAGEMENT PATHWAY
 * Derived from: NICE [NG75], AAP, and WHO Management of Malnutrition Guidelines
 */
export const wardFailureToThriveProtocol: DiseaseProtocol = {
  id: 'ward-failure-to-thrive',
  name: 'Failure to Thrive Master Pathway',
  system: 'Gastrointestinal',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Exhaustive consultant-level directive: Diagnostic criteria (Z-scores), stepwise investigation phases, refeeding risk management, and age-specific caloric fortification.',
  image: {
    url: "https://images.unsplash.com/photo-1559839734-2b71f1e3c7e5?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Growth monitoring and nutritional support"
  },
  questions: [], 

  mmpData: {
    stages: [
      {
        label: "Definition & Clinical Screening",
        shortLabel: "Definition & Clinical Screening",
        color: "blue",
        cards: [
          {
            title: "MANDATORY DIAGNOSTIC CRITERIA",
            threshold: "NICE / WHO STANDARDS",
            instructions: [
              "Growth faltering is defined by meeting ANY of the following:",
              "1. Weight-for-Age: Drop across 2 or more major centiles (e.g. 75th to 25th).",
              "2. Z-Score: Weight-for-age or BMI-for-age < -2.0 SD.",
              "3. Low Weight: Weight < 3rd centile on a single measurement.",
              "4. Discrepancy: Weight centile more than 2 spaces below height centile."
            ]
          },
          {
            title: "Phase 1: Initial Screening Labs",
            threshold: "ALL ADMITTED FTT PATIENTS",
            instructions: [
              "1. Hematology: CBC with Diff (Anemia, infection) and Blood Film.",
              "2. Chemistry: S. Electrolytes, Creatinine, LFTs, Albumin (Baseline nutritional marker).",
              "3. Metabolic: Glucose, Calcium, Phosphate, Magnesium (Baseline for Refeeding check).",
              "4. Infectious: Urinalysis & Culture (Silent UTI is a major cause).",
              "5. Stool: Fecal Parasitology and occult blood."
            ]
          },
          {
            title: "Red Flags for Organic Disease",
            isCritical: true,
            instructions: [
              "• Recurrent vomiting or bloody diarrhea.",
              "• Developmental delay or dysmorphic features.",
              "• Significant lymphadenopathy or hepatosplenomegaly.",
              "• Failure to respond to 1 week of intensive caloric fortification."
            ]
          }
        ]
      },
      {
        label: "Stepwise Investigation (Organic)",
        shortLabel: "Stepwise Investigation (Organic)",
        color: "amber",
        cards: [
          {
            title: "Phase 2: Targeted Systemic Workup",
            threshold: "IF PHASE 1 IS NEGATIVE",
            instructions: [
              "1. Malabsorption: Celiac Screen (IgA + tTG), Fecal Elastase (CF/Pancreatic).",
              "2. Endocrine: TSH/T4 (Hypothyroidism), Cortisol (Adrenal).",
              "3. Renal: Venous Blood Gas (RTA screening), S. Bicarbonate.",
              "4. Chronic Infection: TB Screen (Mantoux/QuantiFERON), HIV Serology (if high risk).",
              "5. Cardiac: Echocardiography (if murmur or unexplained tachypnea)."
            ]
          },
          {
            title: "Environmental & Social Screening",
            instructions: [
              "1. Observe Feeding: Watch parent-child interaction during feeding (Look for anxiety or force-feeding).",
              "2. Calorie Count: Mandatory 72-hour nurse-led calorie and volume tracking.",
              "3. Social Work: Involve social services to screen for food insecurity or neglect."
            ]
          }
        ]
      },
      {
        label: "Intensive Nutritional Therapeutics",
        shortLabel: "Intensive Nutritional Therapeutics",
        color: "emerald",
        cards: [
          {
            title: "Refeeding Syndrome Guardrails",
            threshold: "IF WEIGHT < 70% OF IDEAL",
            isCritical: true,
            instructions: [
              "1. Initial Energy: Start at 50-75% of maintenance requirements.",
              "2. Monitoring: Repeat K, Phos, Mg every 24h for 72 hours. Supplement if falling.",
              "3. Thiamine: Supplement with Vitamin B1 (Thiamine) and Multivitamins before feeding starts."
            ]
          },
          {
            title: "Caloric Fortification Roadmap",
            instructions: [
              "Goal: 120-150% of RDA for age (Kcal/kg/day).",
              "Infants: Concentrate formula to 24-27 kcal/oz (1.0 kcal/mL).",
              "Toddlers: Add MCT oil or Heavy Cream to all meals; 'Super-milk' (Add skimmed milk powder)."
            ]
          },
          {
            title: "Micronutrient Supplementation",
            threshold: "MANDATORY FOR CATCH-UP",
            instructions: [
              "1. Zinc: Required for enzyme function and linear growth.",
              "2. Iron: Initiate only after stabilization phase (usually Day 7+).",
              "3. Multivitamins: Provide A, D, C and B-complex daily."
            ],
            prescriptions: [
              {
                drug: "Elemental Zinc",
                dose: "1-2 mg/kg/day",
                route: "PO",
                frequency: "Once daily",
                calculation: (w) => `${(w * 1.5).toFixed(0)} mg`,
                notes: "Essential for protein synthesis and linear growth."
              },
              {
                drug: "Iron (Ferrous Sulfate)",
                dose: "3-6 mg/kg/day",
                route: "PO",
                frequency: "Divided BID",
                calculation: (w) => `${(w * 5).toFixed(0)} mg`,
                notes: "Start AFTER 1 week of nutritional stabilization."
              }
            ]
          }
        ]
      },
      {
        label: "Monitoring & Success Metrics",
        shortLabel: "Monitoring & Success Metrics",
        color: "indigo",
        cards: [
          {
            title: "Weight Gain Targets",
            threshold: "WARD ROUND TARGETS",
            instructions: [
              "1. Infants (0-6m): 20-30 g/day gain.",
              "2. Infants (6-12m): 15-20 g/day gain.",
              "3. Toddlers (1-3y): 10-15 g/day gain.",
              "Failure of Therapy: If weight remains static after 2 weeks of > 120 kcal/kg/day."
            ]
          },
          {
            title: "Discharge & Follow-up Roadmap",
            instructions: [
              "1. Milestones: Demonstrated consistent weight gain for 48-72h + Stable electrolytes.",
              "2. Community: Involve Community Pediatrician and Home Dietitian.",
              "3. Follow-up: Clinical review with growth plotting in 1-2 weeks."
            ]
          }
        ]
      }
    ]
  },

  // ER Legacy
  calculateSeverity: () => ({ level: 'moderate', details: [] }),
  getManagement: () => [],
  getDisposition: () => [],
  getRedFlags: () => [],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "NICE Guideline [NG75]: Faltering Growth", url: "https://www.nice.org.uk/guidance/ng75" },
    { title: "AAP: Evaluation and Management of Failure to Thrive", url: "https://publications.aap.org" },
    { title: "WHO: Management of Severe Acute Malnutrition", url: "https://www.who.int/publications/i/item/9789241598163" }
  ],
};
