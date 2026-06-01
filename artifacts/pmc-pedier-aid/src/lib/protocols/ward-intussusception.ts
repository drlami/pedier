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
  description: 'Post-radiological reduction care: Monitoring for recurrence (10%), feeding strategies, and surgical triggers.',
  image: {
    url: "https://images.unsplash.com/photo-1579154235602-3c2c299e0831?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Ultrasound showing target sign"
  },
  questions: [],

  mmpData: {
    stages: [
      {
        label: "Immediate Post-Reduction (Hours 0-4)",
        shortLabel: "Immediate Post-Reduction (Hours 0-4)",
        color: "blue",
        cards: [
          {
            title: "Observation & Vitals",
            instructions: [
              "1. NPO Status: Maintain NPO for first 2-4 hours post-reduction.",
              "2. IV Fluids: Maintenance Isotonic fluids.",
              "3. Vitals: Every 30-60 mins; watch for tachycardia or hypotension (sepsis/perforation)."
            ]
          },
          {
            title: "Analgesia Strategy",
            instructions: [
              "Pain post-reduction should improve rapidly. Persistent pain is a RED FLAG for recurrence or incomplete reduction."
            ],
            prescriptions: [
              {
                drug: "Paracetamol",
                dose: "15 mg/kg",
                route: "PO/IV",
                frequency: "Every 6 hours",
                calculation: (w) => `${(15 * w).toFixed(0)} mg`
              }
            ]
          }
        ]
      },
      {
        label: "Feeding Trial (Hours 4-12)",
        shortLabel: "Feeding Trial (Hours 4-12)",
        color: "amber",
        cards: [
          {
            title: "Graduated Enteral Intake",
            instructions: [
              "1. If pain-free and stable at 4h: Start Clear Liquids.",
              "2. If tolerated for 2h: Advance to Full Diet (Breast milk/Formula/Age-appropriate).",
              "3. If vomiting occurs: Stop feeds, return to NPO, and URGENT Ultrasound."
            ]
          }
        ]
      },
      {
        label: "Recurrence Monitoring",
        shortLabel: "Recurrence Monitoring",
        color: "red",
        cards: [
          {
            title: "Recurrence Watch (10% Risk)",
            threshold: "URGENT ULTRASOUND IF POSITIVE",
            isCritical: true,
            instructions: [
              "1. Clinical Signs: Return of colicky pain, lethargy, or vomiting.",
              "2. Stool: Watch for 'currant jelly' stool (late sign).",
              "3. Action: Immediate repeat Ultrasound. If recurrent, notify Radiology for repeat air/liquid enema."
            ]
          },
          {
            title: "Surgical Consultation Triggers",
            threshold: "PEDIATRIC SURGERY REFERRAL",
            instructions: [
              "1. Evidence of Perforation (Free air on X-ray).",
              "2. Signs of Peritonitis or Shock.",
              "3. Failed Radiologic Reduction (usually after 2-3 attempts).",
              "4. Multiple recurrences (> 2) or suspected lead point (e.g., Meckel's)."
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
            title: "Safe for Home",
            instructions: [
              "1. Minimum 4-6 hours post-reduction observation (some centers prefer 12-24h).",
              "2. Tolerating full enteral diet without vomiting.",
              "3. No recurrence of colicky pain.",
              "4. Parents educated on recurrence risk and return-to-ER triggers."
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
