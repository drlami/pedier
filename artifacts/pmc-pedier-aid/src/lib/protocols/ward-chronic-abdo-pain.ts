import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Chronic Abdominal Pain
 * Focus: Functional vs Organic, red flags, and stepwise workup.
 */
export const wardChronicAbdoPainProtocol: DiseaseProtocol = {
  id: 'ward-chronic-abdo-pain',
  name: 'Chronic Abdominal Pain: Ward Evaluation',
  system: 'Gastrointestinal & Hepatology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Chronic Abdominal Pain is defined as continuous or intermittent abdominal pain of at least 2 months duration that interferes with daily activities. This pathway focuses on distinguishing between organic pathology (e.g., Inflammatory Bowel Disease, Celiac disease) and functional gastrointestinal disorders (e.g., Irritable Bowel Syndrome) using ROME IV criteria and a step-wise diagnostic strategy.',
  image: {
    url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Clinical assessment of abdominal pain"
  },
  questions: [],

  mmpData: {
    snapshot: "Management of chronic abdominal pain utilizes a dual-track approach: (1) Vigilant screening for 'Organic Red Flags' (weight loss, growth failure, nighttime waking) and (2) Early identification of functional disorders to avoid over-investigation. Treatment transitions from medical workup to a biopsychosocial model, emphasizing that the pain is real despite normal test results, and prioritizing the restoration of normal daily functioning and school attendance.",
    stages: [
      {
        label: "Stage 1: Red Flag Screening & Initial Investigations",
        shortLabel: "Assessment",
        color: "red",
        cards: [
          {
            title: "Organic Red Flags (MANDATORY)",
            isCritical: true,
            orders: [
              "Systematic Symptoms: Unexplained fever, weight loss, or significant growth failure/stunting.",
              "Gastrointestinal: Persistent vomiting, significant diarrhea, or visible Blood in Stool (Hematochezia).",
              "Nighttime Symptoms: Waking from sleep due to pain or the need to defecate.",
              "Examination Findings: Localized Right Upper Quadrant or Right Lower Quadrant tenderness, Organomegaly, or Perianal disease (tags, fistulas).",
              "Family History: Documented Inflammatory Bowel Disease, Celiac disease, or Peptic ulcer disease."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Complete Blood Count with differential to screen for anemia or infection.",
              "Inflammatory Markers: Erythrocyte Sedimentation Rate (ESR) and C-Reactive Protein (CRP).",
              "Metabolic Panel: Liver Function Tests, Amylase, Lipase, and Urinalysis.",
              "Celiac Screening: Total Immunoglobulin A (IgA) and Tissue Transglutaminase (tTG) IgA.",
              "Stool Analysis: Fecal Calprotectin (highly sensitive for bowel inflammation) and Occult Blood testing."
            ]
          },
          {
            title: "Nursing: Clinical Monitoring [NS]",
            nursing: [
              "Accurate Daily Weight and Height measurement (plotted on growth charts).",
              "Detailed Pain Diary: Record timing, location, duration, and relationship to meals or bowel movements.",
              "Stool Tracking: Use Bristol Stool Scale to document consistency and frequency.",
              "Monitor for Red Flags: Report any nocturnal waking or new onset of vomiting."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Targeted Imaging & Specialized Workup",
        shortLabel: "Investigations",
        color: "blue",
        cards: [
          {
            title: "Imaging Choice Guide",
            orders: [
              "Ultrasound of the Abdomen: Primary tool for assessing biliary system, kidneys, or gynecological causes in females.",
              "Abdominal X-ray: Reserved strictly for suspected severe Constipation or Bowel Obstruction; not useful for routine pain assessment.",
              "Advanced Imaging (CT or MRI): Only if specific organic pathology is strongly suspected (e.g., Crohn's disease, abdominal mass)."
            ]
          },
          {
            title: "Helicobacter Pylori Testing",
            threshold: "IF DYSPEPSIA OR EPIGASTRIC PAIN",
            orders: [
              "Perform Stool Antigen or Urea Breath Test.",
              "Ensure patient has avoided Proton Pump Inhibitors (PPIs) for 2 weeks and Antibiotics for 4 weeks prior to testing.",
              "If positive: Initiate Triple Therapy (Proton Pump Inhibitor + Amoxicillin + Clarithromycin)."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Functional GI Disorders & Biopsychosocial Care",
        shortLabel: "Management",
        color: "amber",
        cards: [
          {
            title: "Functional Disorders Identification (ROME IV)",
            orders: [
              "Irritable Bowel Syndrome (IBS): Pain related to defecation or a change in stool frequency/form.",
              "Functional Dyspepsia: Pain centered in the upper abdomen, often with post-prandial fullness or early satiety.",
              "Abdominal Migraine: Paroxysmal episodes of intense pain associated with vomiting, pallor, or light sensitivity.",
              "Functional Abdominal Pain - Not Otherwise Specified: Pain that does not meet the specific criteria above but has no organic cause."
            ]
          },
          {
            title: "Management Strategy",
            orders: [
              "Validation: Explicitly acknowledge that the pain is real and distressing despite normal test results.",
              "Biopsychosocial Model: Address school-related stressors, sleep hygiene, and psychological triggers.",
              "Dietary Interventions: Consider a trial of Low FODMAP diet under dietitian supervision or increased soluble fiber.",
              "Pharmacotherapy (Specialist Consultation): Consider low-dose Amitriptyline, Cyproheptadine, or Peppermint Oil capsules."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Specialty Referral & Long-term Follow-up",
        shortLabel: "Referral",
        color: "emerald",
        cards: [
          {
            title: "Gastroenterology Referral Criteria",
            orders: [
              "Presence of any 'Organic Red Flags' or significantly abnormal laboratory investigations.",
              "Failure of primary care management for functional abdominal pain after 2-3 months.",
              "Clinical suspicion of Inflammatory Bowel Disease, Celiac Disease, or Eosinophilic Esophagitis."
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
    { title: "NASPGHAN/ESPGHAN: Chronic Abdominal Pain in Children", url: "https://journals.lww.com/jpgn/Fulltext/2017/03000/Evaluation_of_Chronic_Abdominal_Pain_in_Children.28.aspx" },
    { title: "Rome IV Criteria for Functional GI Disorders", url: "https://theromefoundation.org/rome-iv/rome-iv-criteria/" }
  ],
};
