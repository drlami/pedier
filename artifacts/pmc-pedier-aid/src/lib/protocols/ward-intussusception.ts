import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Post-Reduction Intussusception Management
 * Focus: Recurrence watch, feeding advancement, and discharge safety.
 */
export const wardIntussusceptionProtocol: DiseaseProtocol = {
  id: 'ward-intussusception',
  name: 'Intussusception: Post-Reduction Management',
  system: 'Gastrointestinal & Hepatology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Intussusception is the telescoping of one segment of the intestine into another, most commonly the ileum into the cecum, causing bowel obstruction and potential ischemia. This pathway focuses on post-radiological reduction management, including monitoring for the 10% risk of recurrence, feeding advancement, and identifying surgical indications.',
  image: {
    url: "https://images.unsplash.com/photo-1579154235602-3c2c299e0831?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Ultrasound showing target sign"
  },
  questions: [],

  mmpData: {
    snapshot: "Management emphasizes the 'Observe-Feed-Detect' strategy: (1) Post-reduction observation for early recurrence (typically within the first 12-24 hours), (2) Graduated feeding starting after 4 hours of stability, and (3) Rapid identification of recurrence or complications requiring surgical intervention. Parental education on signs of recurrence is vital for safe discharge.",
    stages: [
      {
        label: "Stage 1: Immediate Post-Reduction Care",
        shortLabel: "Immediate Phase",
        color: "blue",
        cards: [
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Maintain NPO (Nothing by mouth) status for the first 2-4 hours post-reduction.",
              "Intravenous Fluids: Continue Isotonic maintenance fluids (e.g., Normal Saline or Ringer's Lactate) until enteral intake is established.",
              "Pain Management: Monitor for rapid improvement in pain; persistent pain is a red flag for incomplete reduction or perforation.",
              "Laboratory Evaluation: Only if clinical status worsens (e.g., Complete Blood Count, C-Reactive Protein)."
            ]
          },
          {
            title: "Nursing: Strict Monitoring [NS]",
            isCritical: true,
            nursing: [
              "Vitals: Check Temperature, Heart Rate, and Blood Pressure every 30-60 minutes for the first 4 hours.",
              "Pain Scoring: Use age-appropriate pain scales hourly; notify physician immediately if colicky pain returns.",
              "Abdominal Assessment: Check for distension, tenderness, or guarding every 2 hours.",
              "Stool Watch: Document all bowel movements, specifically checking for 'currant jelly' (bloody/mucus) stool."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Graduated Feeding Trial",
        shortLabel: "Feeding",
        color: "amber",
        cards: [
          {
            title: "Advancement Strategy [DR]",
            orders: [
              "Initial Trial: If the patient remains pain-free and stable at 4 hours, initiate Clear Liquid trial.",
              "Feeding Escalation: If clear liquids are tolerated for 2 hours, advance to Full Diet (Breast milk, Formula, or Age-appropriate solids).",
              "Failure Protocol: If vomiting or significant pain occurs, immediately return to NPO status and order an urgent repeat Ultrasound."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Recurrence & Surgical Surveillance",
        shortLabel: "Surveillance",
        color: "red",
        cards: [
          {
            title: "Recurrence Watch (10% Risk)",
            threshold: "URGENT ULTRASOUND IF POSITIVE",
            isCritical: true,
            orders: [
              "Repeat Ultrasound: Indicated immediately if there is a return of colicky pain, persistent lethargy, or new-onset vomiting.",
              "Re-Reduction: If recurrence is confirmed, notify Radiology for repeat air/liquid enema reduction (usually successful if performed early).",
              "Surgical Referral: Consult Pediatric Surgery if there is evidence of bowel perforation, peritonitis, clinical shock, or failed radiologic reduction attempts."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Discharge & Safety Planning",
        shortLabel: "Discharge",
        color: "emerald",
        cards: [
          {
            title: "Criteria for Home [DR]",
            orders: [
              "Minimum Observation: Ensure at least 6-12 hours of post-reduction stability (local protocol dependent).",
              "Dietary Tolerance: Must be tolerating a full enteral diet without vomiting or abdominal distress.",
              "Education: Parents must be educated on the risk of recurrence and instructed to return to the Emergency Department immediately for any recurring colicky pain or lethargy."
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
    { title: "RCH Melbourne: Intussusception Management", url: "https://www.rch.org.au/clinicalguide/guideline_index/Intussusception/" },
    { title: "AAP: Diagnosis and Management of Intussusception", url: "https://publications.aap.org/pediatrics/article/113/2/382/66840/" }
  ],
};
