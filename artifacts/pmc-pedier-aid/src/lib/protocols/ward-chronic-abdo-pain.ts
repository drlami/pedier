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
  description: 'Structured approach to persistent or recurrent abdominal pain: Identifying organic red flags vs functional disorders.',
  image: {
    url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Clinical assessment of abdominal pain"
  },
  questions: [],

  mmpData: {
    stages: [
      {
        label: "Red Flag Screening & Initial Labs",
        shortLabel: "Red Flag Screening & Initial Labs",
        color: "red",
        cards: [
          {
            title: "Organic Red Flags (MANDATORY)",
            isCritical: true,
            instructions: [
              "1. Systematic Symptoms: Unexplained fever, weight loss, growth failure.",
              "2. Gastrointestinal: Persistent vomiting, significant diarrhea, GI bleeding.",
              "3. Examination: Localized RUQ/RLQ tenderness, organomegaly, perianal disease.",
              "4. Family History: IBD, Celiac disease, Peptic ulcer."
            ]
          },
          {
            title: "Baseline Laboratory Panel",
            instructions: [
              "1. CBC, ESR/CRP (Inflammatory screen).",
              "2. LFTs, Amylase/Lipase, Urinalysis.",
              "3. Celiac Screen: IgA + Tissue Transglutaminase (tTG) IgA.",
              "4. Stool: Calprotectin (high sensitivity for IBD), Guaiac (occult blood)."
            ]
          }
        ]
      },
      {
        label: "Step-wise Imaging & Workup",
        shortLabel: "Step-wise Imaging & Workup",
        color: "blue",
        cards: [
          {
            title: "Imaging Choice",
            instructions: [
              "1. Ultrasound Abdomen: Initial tool for biliary, renal, or gynecological causes.",
              "2. Abdominal X-ray: Reserved for suspected constipation or obstruction (limited utility).",
              "3. CT/MRI: ONLY if specific organic pathology suspected (e.g., Crohn's, mass)."
            ]
          },
          {
            title: "H. Pylori Testing",
            threshold: "IF DYSPEPSIA / EPIGASTRIC PAIN",
            instructions: [
              "1. Stool Antigen or Urea Breath Test (avoid PPI/Antibiotics for 2-4 weeks prior).",
              "2. If positive: Triple therapy (PPI + Amoxicillin + Clarithromycin)."
            ]
          }
        ]
      },
      {
        label: "Functional GI Disorders (ROME IV)",
        shortLabel: "Functional GI Disorders (ROME IV)",
        color: "amber",
        cards: [
          {
            title: "Functional Disorders Identification",
            instructions: [
              "1. Irritable Bowel Syndrome (IBS): Pain related to defecation or change in stool.",
              "2. Functional Dyspepsia: Pain centered in upper abdomen, post-prandial fullness.",
              "3. Abdominal Migraine: Paroxysmal episodes of intense pain, vomiting, pallor.",
              "4. Functional Abdominal Pain - NOS: Does not meet above criteria."
            ]
          },
          {
            title: "Management of Functional Pain",
            instructions: [
              "1. Validation: Acknowledge the pain is real despite normal tests.",
              "2. Biopsychosocial Model: Address stressors, school attendance, and sleep.",
              "3. Dietary: Low FODMAP (under dietitian supervision) or fiber optimization.",
              "4. Pharmacotherapy (Consultant Choice): Cyproheptadine, Amitriptyline (low dose), or Peppermint oil."
            ]
          }
        ]
      },
      {
        label: "Specialty Referral & Follow-up",
        shortLabel: "Specialty Referral & Follow-up",
        color: "emerald",
        cards: [
          {
            title: "Gastroenterology Referral",
            instructions: [
              "1. Any positive Red Flags or abnormal labs.",
              "2. Failure of primary management for functional pain.",
              "3. Suspicion of IBD, Celiac, or Eosinophilic Esophagitis."
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
