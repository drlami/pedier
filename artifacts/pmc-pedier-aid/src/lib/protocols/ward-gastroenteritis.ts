import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Acute Gastroenteritis & Dehydration
 * Focus: ORS, early feeding, and Ondansetron strategy.
 */
export const wardGastroenteritisProtocol: DiseaseProtocol = {
  id: 'ward-gastroenteritis',
  name: 'Gastroenteritis: Ward Management',
  system: 'Gastrointestinal & Hepatology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Acute Gastroenteritis is an inflammation of the stomach and intestines, typically manifesting as diarrhea and vomiting, which can lead to significant dehydration and electrolyte imbalances. This pathway focuses on rapid rehydration using Oral Rehydration Solution, early nutritional reintroduction to promote mucosal healing, and the judicious use of anti-emetics and zinc supplementation.',
  image: {
    url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Senior clinical pathway for GE"
  },
  questions: [],

  mmpData: {
    snapshot: "Management centers on the 'Rapid Rehydration and Early Feeding' protocol: (1) Correct dehydration using Oral Rehydration Solution (50-100 mL/kg over 4 hours) as the first-line therapy, utilizing Nasogastric tubes if oral intake is insufficient. (2) Facilitate intake with a single dose of Ondansetron in persistent vomiting. (3) Transition to an age-appropriate diet immediately following the rehydration phase to reduce stool volume and duration of illness. Daily weight monitoring remains the most accurate measure of hydration status.",
    stages: [
      {
        label: "Stage 1: Admission & Rehydration Phase",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Assessment of Dehydration Severity: Classify as Mild, Moderate, or Severe based on clinical signs (e.g., skin turgor, mucous membranes, capillary refill).",
              "Oral Rehydration Therapy: Prescribe Oral Rehydration Solution (50-100 mL/kg) to be administered over 4 hours.",
              "Anti-Emetic Stewardship: Order a single dose of Ondansetron (0.15 mg/kg) if vomiting prevents successful oral rehydration.",
              "Laboratory Investigations: Order Serum Electrolytes, Blood Urea Nitrogen, and Creatinine only if severe dehydration is suspected or if intravenous fluids are required.",
              "Zinc Supplementation: Initiate Zinc Sulfate (10-20 mg daily) for all children to reduce diarrhea duration and recurrence risk.",
              "Stool Studies: Request stool culture and virology if diarrhea is bloody, prolonged (more than 7 days), or in immunocompromised patients."
            ]
          },
          {
            title: "Nursing: Strict Monitoring [NS]",
            nursing: [
              "Accurate Intake and Output: Record every episode of vomiting and diarrhea (document consistency and volume) and all oral or intravenous intake.",
              "Daily Morning Weight: Measure weight using the same scale and under the same conditions to track fluid loss/gain.",
              "Hydration Status Assessment: Check mucous membranes, tears, and capillary refill every 4 hours during the rehydration phase.",
              "Vital Signs: Monitor heart rate and blood pressure every 4 hours to detect early signs of hypovolemic shock."
            ]
          },
          {
            title: "Rehydration Strategy (ESPGHAN/AAP)",
            orders: [
              "First Line: Oral Rehydration Solution (ORS) - 50-100 mL/kg over 4 hours.",
              "Nasogastric Rehydration: Equivalent to Intravenous in efficacy for moderate dehydration; preferred if Oral Rehydration Solution fails.",
              "Intravenous Rehydration: Reserved for severe dehydration, shock, or failed Nasogastric trial.",
              "Fluid Choice: Isotonic (0.9% Sodium Chloride + 5% Dextrose) for Intravenous maintenance."
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
