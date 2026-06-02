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
  description: 'Recurrent Vomiting is defined as multiple, discrete episodes of vomiting occurring over weeks or months. This clinical challenge requires a systematic approach to differentiate between Gastroesophageal Reflux Disease (GERD), Cyclic Vomiting Syndrome (CVS), and serious underlying neurological, surgical, or metabolic conditions. This exhaustive directive covers the complete diagnostic evaluation and targeted management strategies.',
  image: {
    url: "https://images.unsplash.com/photo-1516613835066-ad1bc5b51dba?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Evaluation of nausea and vomiting"
  },
  questions: [],

  mmpData: {
    snapshot: "Management focuses on the 'Red Flag' screening for life-threatening causes (Raised Intracranial Pressure, Intestinal Malrotation, or Inborn Errors of Metabolism). For episodic patterns, the priority is verifying the criteria for Cyclic Vomiting Syndrome and implementing aggressive abortive therapy (Ondansetron, Aprepitant) in a low-stimulation environment. Chronic cases require a stepwise workup including trial acid suppression, upper gastrointestinal imaging, and potentially gastric emptying studies or mitochondrial support.",
    stages: [
      {
        label: "Emergency Red Flag Screening",
        shortLabel: "Safety",
        color: "red",
        cards: [
          {
            title: "Critical Physician Orders [DR]",
            isCritical: true,
            orders: [
              "Neurological Screen: Specifically assess for morning vomiting, headache, or bulging fontanelle (Raised Intracranial Pressure).",
              "Surgical Screen: Evaluate for bilious vomiting, severe abdominal distension, or history of prior abdominal surgery.",
              "Metabolic Screen: Assess for acute decompensation, lethargy, or unusual body odor (Inborn Error of Metabolism).",
              "Renal Screen: Monitor for excessive thirst (polydipsia) or excessive urination (polyuria) as indicators of Chronic Kidney Disease or Diabetic Ketoacidosis."
            ]
          },
          {
            title: "Stat Investigations",
            orders: [
              "Serum Electrolytes, Blood Urea Nitrogen (BUN), and Creatinine.",
              "Serum Glucose: Rule out hypoglycemia or Diabetic Ketoacidosis.",
              "Venous Blood Gas: Check for metabolic alkalosis (common in pyloric stenosis) versus metabolic acidosis.",
              "Urinalysis: Monitor for ketones, glucose, and specific gravity.",
              "Serum Ammonia: Mandatory if altered mental status is present."
            ]
          },
          {
            title: "Nursing & Monitoring [NS]",
            nursing: [
              "Vomiting Log: Record every episode, noting volume, color (especially bile), and relationship to meals.",
              "Hydration Status: Monitor mucous membranes, capillary refill time, and skin turgor every 4 hours.",
              "Vital Signs: Heart Rate and Blood Pressure every 4 hours to monitor for dehydration or raised Intracranial Pressure.",
              "Neurological Check: Perform Glasgow Coma Scale (GCS) and pupil checks every 8 hours."
            ]
          }
        ]
      },
      {
        label: "Cyclic Vomiting Syndrome (CVS) Management",
        shortLabel: "Cyclic Vomiting",
        color: "blue",
        cards: [
          {
            title: "Diagnostic Criteria Checklist",
            orders: [
              "Verify the presence of at least 3 discrete episodes in 6 months.",
              "Confirm stereotypical episodes (occurrence at the same time and of the same duration).",
              "Ensure episodes consist of intense nausea and vomiting followed by a complete return to baseline health."
            ]
          },
          {
            title: "Abortive Therapy Directive",
            threshold: "ACUTE ATTACK",
            orders: [
              "Environmental Control: Provide a 'Dark, Quiet Room' and minimize all stimuli.",
              "Fluid Resuscitation: Use Intravenous fluids with Dextrose (e.g., D5 0.9% Sodium Chloride) to prevent ketosis, which can perpetuate the attack."
            ],
            prescriptions: [
              {
                drug: "Ondansetron",
                dose: "0.15 mg/kg",
                route: "Intravenous",
                frequency: "Every 6-8 hours",
                calculation: (w) => `${(0.15 * w).toFixed(1)} mg`,
                notes: "Maximum 8 mg per dose."
              },
              {
                drug: "Aprepitant",
                dose: "125 mg (>12 years), 3 mg/kg (6 months-12 years)",
                route: "Oral",
                frequency: "Once daily (Day 1 dose)",
                calculation: (w) => w > 40 ? "125 mg" : `${(3 * w).toFixed(0)} mg`,
                notes: "Consultant use only for refractory cases of Cyclic Vomiting Syndrome."
              }
            ]
          }
        ]
      },
      {
        label: "GERD & Gastroparesis Workup",
        shortLabel: "Chronic Workup",
        color: "amber",
        cards: [
          {
            title: "Reflux Management",
            orders: [
              "Symptom Review: Screen for heartburn, Sandifer syndrome, or hematemesis (vomiting blood).",
              "Acid Suppression Trial: Start a 2-4 week trial of a Proton Pump Inhibitor (PPI).",
              "Advanced Evaluation: Consider pH-Impedance probe (Gold Standard) if symptoms are atypical."
            ],
            prescriptions: [
              {
                drug: "Esomeprazole",
                dose: "1 mg/kg",
                route: "Oral",
                frequency: "Once daily",
                calculation: (w) => `${(1 * w).toFixed(0)} mg`,
                notes: "Administer 30 minutes before a meal."
              }
            ]
          },
          {
            title: "Imaging & Functional Studies",
            orders: [
              "Upper Gastrointestinal Barium Series: Essential to exclude malrotation or anatomical stenosis.",
              "Gastric Emptying Study: Perform if gastroparesis is suspected (common post-viral complication).",
              "Brain Imaging: Perform Computed Tomography (CT) or Magnetic Resonance Imaging (MRI) if morning vomiting or focal neurological signs are present."
            ]
          }
        ]
      },
      {
        label: "Prophylaxis & Long-term Care",
        shortLabel: "Prevention",
        color: "emerald",
        cards: [
          {
            title: "Prophylaxis Strategy",
            threshold: "EPISODES > 1 PER MONTH",
            orders: [
              "For children < 5 years old: Consider Cyproheptadine.",
              "For children > 5 years old: Consider Amitriptyline.",
              "Mitochondrial Support: Consider Coenzyme Q10 and L-Carnitine for those with suspected mitochondrial dysfunction."
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
