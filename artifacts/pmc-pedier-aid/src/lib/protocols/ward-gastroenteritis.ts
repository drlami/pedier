import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Acute Gastroenteritis & Dehydration
 * Focus: ORS, early feeding, and Ondansetron strategy.
 */
export const wardGastroenteritisProtocol: DiseaseProtocol = {
  id: 'ward-gastroenteritis',
  name: 'Gastroenteritis: Ward Management',
  system: 'Gastrointestinal',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Senior management of GE: Rehydration phases, early nutritional reintroduction, and anti-emetic stewardship.',
  image: {
    url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Senior clinical pathway for GE"
  },
  questions: [],

  mmpData: {
    stages: [
      {
        label: "Admission & Rehydration Phase",
        shortLabel: "Admission & Rehydration Phase",
        color: "blue",
        cards: [
          {
            title: "Rehydration Strategy (ESPGHAN/AAP)",
            instructions: [
              "1. First Line: Oral Rehydration Solution (ORS) - 50-100 mL/kg over 4 hours.",
              "2. NG Rehydration: Equivalent to IV in efficacy for moderate dehydration; preferred if ORS fails.",
              "3. IV Rehydration: Reserved for severe dehydration, shock, or failed NG trial.",
              "4. Fluid Choice: Isotonic (0.9% NaCl + 5% Dextrose) for IV maintenance."
            ]
          },
          {
            title: "Ondansetron Stewardship",
            threshold: "IF VOMITING LIMITS ORS",
            instructions: [
              "Indication: Single dose to facilitate ORS in children 6 months to 12 years.",
              "Caution: May increase diarrhea frequency; do not use if suspecting obstruction/surgical abdomen."
            ],
            prescriptions: [
              {
                drug: "Ondansetron",
                dose: "0.15 mg/kg",
                route: "PO/IV/IM",
                frequency: "Single dose (Max 8mg)",
                calculation: (w) => `${Math.min(0.15 * w, 8).toFixed(1)} mg`
              }
            ]
          }
        ]
      },
      {
        label: "Nutritional Reintroduction & Zinc",
        shortLabel: "Nutritional Reintroduction & Zinc",
        color: "amber",
        cards: [
          {
            title: "Early Feeding Directive",
            instructions: [
              "1. Resume age-appropriate diet IMMEDIATELY after rehydration (usually within 4h).",
              "2. Breastfeeding: Continue throughout rehydration and maintenance.",
              "3. Avoid: High-simple-sugar beverages (juice, soda) due to osmotic load.",
              "4. BRAT Diet: NOT recommended; focus on complex carbs, lean meats, yogurt, fruits."
            ]
          },
          {
            title: "Zinc Supplementation",
            threshold: "ALL ACUTE DIARRHEA",
            instructions: [
              "Reduces duration and severity of diarrhea and prevents recurrence in next 2-3 months."
            ],
            prescriptions: [
              {
                drug: "Zinc Sulfate",
                dose: "20 mg (10mg if < 6mo)",
                route: "PO",
                frequency: "Once daily for 10-14 days",
                calculation: (w) => w < 6 ? "10 mg" : "20 mg"
              }
            ]
          }
        ]
      },
      {
        label: "Monitoring & Red Flags",
        shortLabel: "Monitoring & Red Flags",
        color: "red",
        cards: [
          {
            title: "Critical Monitoring",
            instructions: [
              "Weight: Daily at same time (most sensitive marker of hydration status).",
              "Fluid Balance: Strict input/output monitoring.",
              "Serum Electrolytes: If IV fluids required > 24h or severe dehydration."
            ]
          },
          {
            title: "Red Flags / Complications",
            isCritical: true,
            instructions: [
              "1. Neurological: Altered mental status, seizures (Hyponatremia/Hypernatremia).",
              "2. Abdominal: Severe pain, distension, bilious vomiting (Intussusception/Appendicitis).",
              "3. Systemic: Sepsis appearance, HUS (bloody diarrhea, oliguria, pallor)."
            ]
          }
        ]
      },
      {
        label: "Discharge Criteria",
        shortLabel: "Discharge Criteria",
        color: "emerald",
        cards: [
          {
            title: "Discharge Readiness",
            instructions: [
              "1. Adequate oral intake to maintain hydration.",
              "2. Decreasing frequency of vomiting and diarrhea.",
              "3. Caregiver demonstrates understanding of ORS and red flags.",
              "4. Weight stable or increasing."
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
    { title: "ESPGHAN/ESPID Guidelines for Management of Acute GE", url: "https://journals.lww.com/jpgn/Fulltext/2014/07000/European_Society_for_Pediatric_Gastroenterology,.25.aspx" },
    { title: "AAP: Clinical Practice Guideline: Management of Acute GE", url: "https://publications.aap.org/pediatrics/article/101/3/446/64299/" }
  ],
};
