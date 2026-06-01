import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Recurrent Vomiting
 * Focus: Cyclic vomiting vs GERD vs Neuro, Aprepitant/Ondansetron.
 */
export const wardRecurrentVomitingProtocol: DiseaseProtocol = {
  id: 'ward-recurrent-vomiting',
  name: 'Recurrent Vomiting: Ward Evaluation',
  system: 'Gastrointestinal & Hepatology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Approach to chronic or episodic vomiting: Differentiating GI, Neurological, and Metabolic causes.',
  image: {
    url: "https://images.unsplash.com/photo-1516613835066-ad1bc5b51dba?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Evaluation of nausea and vomiting"
  },
  questions: [],

  mmpData: {
    stages: [
      {
        label: "Emergency Red Flag Screening",
        shortLabel: "Emergency Red Flag Screening",
        color: "red",
        cards: [
          {
            title: "Critical Red Flags",
            isCritical: true,
            instructions: [
              "1. Neurological: Morning vomiting, headache, bulging fontanelle (Raised ICP).",
              "2. Surgical: Bilious vomiting, severe distension, prior abdominal surgery.",
              "3. Metabolic: Acute decompensation, lethargy, odd odor (Inborn Error of Metabolism).",
              "4. Renal: Polyuria, polydipsia (CKD/DKA)."
            ]
          },
          {
            title: "Stat Investigations",
            instructions: [
              "1. Serum Electrolytes, BUN/Cr, Glucose.",
              "2. Venous Blood Gas (Check for metabolic alkalosis vs acidosis).",
              "3. Urinalysis (Specific gravity, ketones, glucose).",
              "4. Ammonia (if altered mental status)."
            ]
          }
        ]
      },
      {
        label: "Cyclic Vomiting Syndrome (CVS) Management",
        shortLabel: "Cyclic Vomiting Syndrome (CVS) Management",
        color: "blue",
        cards: [
          {
            title: "NASPGHAN CVS Criteria",
            instructions: [
              "1. At least 3 discrete episodes in 6 months.",
              "2. Stereotypical episodes (same time, same duration).",
              "3. Intense nausea/vomiting followed by return to baseline health."
            ]
          },
          {
            title: "CVS Abortive Therapy",
            threshold: "ACUTE ATTACK",
            instructions: [
              "Goal: Rapidly terminate the 'emetic storm'. Provide 'Dark, Quiet Room'."
            ],
            prescriptions: [
              {
                drug: "Ondansetron",
                dose: "0.15 mg/kg",
                route: "IV",
                frequency: "Every 6-8 hours",
                calculation: (w) => `${(0.15 * w).toFixed(1)} mg`
              },
              {
                drug: "Aprepitant (Neurokinin-1 antagonist)",
                dose: "125 mg (>12yr), 3mg/kg (6mo-12yr)",
                route: "PO",
                frequency: "Once daily (Day 1 dose)",
                calculation: (w) => w > 40 ? "125 mg" : `${(3 * w).toFixed(0)} mg`,
                notes: "Consultant use only for refractory CVS."
              }
            ]
          }
        ]
      },
      {
        label: "GERD & Gastroparesis Workup",
        shortLabel: "GERD & Gastroparesis Workup",
        color: "amber",
        cards: [
          {
            title: "Gastro-Esophageal Reflux Disease (GERD)",
            instructions: [
              "1. Symptoms: Heartburn, sandifer syndrome, hematemesis.",
              "2. Trials: 2-4 week trial of Acid Suppression (PPI).",
              "3. Advanced: pH-Impedance probe (Gold standard)."
            ],
            prescriptions: [
              {
                drug: "Esomeprazole",
                dose: "1 mg/kg",
                route: "PO",
                frequency: "Once daily",
                calculation: (w) => `${(1 * w).toFixed(0)} mg`
              }
            ]
          },
          {
            title: "Imaging & Functional Studies",
            instructions: [
              "1. Upper GI Series (Barium): Exclude malrotation/stenosis.",
              "2. Gastric Emptying Study: If gastroparesis suspected (common post-viral).",
              "3. CT/MRI Brain: If morning vomiting or focal neuro signs."
            ]
          }
        ]
      },
      {
        label: "Prophylaxis & Long-term Care",
        shortLabel: "Prophylaxis & Long-term Care",
        color: "emerald",
        cards: [
          {
            title: "CVS Prophylaxis",
            threshold: "EPISODES > 1 PER MONTH",
            instructions: [
              "1. Cyproheptadine (if < 5 years old).",
              "2. Amitriptyline (if > 5 years old).",
              "3. Coenzyme Q10 and L-Carnitine (Mitochondrial support)."
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
    { title: "NASPGHAN: Guidelines for Cyclic Vomiting Syndrome", url: "https://naspghan.org/files/Cyclic_Vomiting_Syndrome_in_Children.pdf" },
    { title: "NASPGHAN/ESPGHAN: Pediatric GERD Guideline", url: "https://journals.lww.com/jpgn/Fulltext/2018/03000/Pediatric_Gastroesophageal_Reflux_Clinical.27.aspx" }
  ],
};
