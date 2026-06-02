import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Familial Mediterranean Fever (FMF)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: EULAR Recommendations (2016), Eurofever/PRINTO Criteria, and RCH Melbourne
 */
export const wardFmfProtocol: DiseaseProtocol = {
  id: 'ward-fmf',
  name: 'Familial Mediterranean Fever Master Pathway',
  system: 'Immunology & Rheumatology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Familial Mediterranean Fever (FMF) is an autosomal recessive autoinflammatory disorder caused by mutations in the MEFV gene, characterized by recurrent self-limited episodes of fever and serositis (peritonitis, pleuritis, or synovitis). This exhaustive directive covers diagnostic verification using the Tel-Hashomer criteria, management of acute attacks, and the mandatory long-term Colchicine roadmap to prevent AA Amyloidosis.',
  image: {
    url: "https://images.unsplash.com/photo-1576089234161-460d3d523b0a?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "MEFV gene mutation and autoinflammatory flare management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'abdominalPain', questionText: 'Acute, severe abdominal pain (peritonitis)?', type: 'boolean' },
    { id: 'recurrentFever', questionText: 'History of recurrent fever lasting 1-3 days?', type: 'boolean' },
    { id: 'amyloidosisRisk', questionText: 'Persistent proteinuria or known family history of Amyloidosis?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Familial Mediterranean Fever management focuses on (1) Rapid control of acute inflammation during flares, (2) Mandatory lifelong Colchicine therapy to achieve complete remission of attacks and—critically—to prevent the development of life-threatening AA Amyloidosis, and (3) Systematic monitoring of subclinical inflammation between attacks. Colchicine non-adherence is the primary cause of treatment failure and renal complications.",
    stages: [
      {
        label: "Stage 1: Attack Verification & Diagnostics",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Tel-Hashomer Diagnostic Criteria",
            threshold: "2 MAJOR OR 1 MAJOR + 2 MINOR",
            orders: [
              "Major Criteria: Recurrent febrile episodes with serositis (Peritonitis, Pleuritis, or Synovitis); AA Amyloidosis without a predisposing disease; Favorable response to Colchicine.",
              "Minor Criteria: Recurrent febrile episodes; Erysipelas-like erythema; Family history of FMF in a first-degree relative.",
              "Genetic Testing: Search for MEFV gene mutations (especially M694V, associated with more severe disease and Amyloidosis)."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Inflammatory Markers (During Attack): C-Reactive Protein and Erythrocyte Sedimentation Rate (typically very high).",
              "Complete Blood Count: Expect marked Leukocytosis (elevated White Blood Cells) during flares.",
              "Renal Surveillance: Urinalysis dipstick and Spot Urine Protein:Creatinine Ratio (Mandatory to screen for Amyloidosis-related proteinuria).",
              "Alternative Diagnostics: Consider SAA (Serum Amyloid A) if available, as a marker of subclinical inflammation risk."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Acute Attack Management",
        shortLabel: "Acute Flare",
        color: "red",
        cards: [
          {
            title: "Symptomatic Stabilization",
            orders: [
              "Pain Control: Use Non-Steroidal Anti-Inflammatory Drugs (NSAIDs) like Ibuprofen or Naproxen for peritonitis or joint pain.",
              "Hydration: Maintain Intravenous fluids if vomiting or severe abdominal pain prevents oral intake.",
              "Note: Increasing the Colchicine dose during an acute attack does NOT shorten the duration of the current flare but may be indicated for long-term control if attacks are frequent."
            ]
          },
          {
            title: "Nursing & Monitoring [NS]",
            nursing: [
              "Temperature: Monitor every 4 hours during the febrile phase.",
              "Abdominal Assessment: Check for signs of 'Surgical Abdomen' (Guard against unnecessary appendectomy in known FMF patients).",
              "Fluid Balance: Monitor Intake and Output if vomiting is present."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Long-Term Prophylaxis [!]",
        shortLabel: "Maintenance",
        color: "amber",
        cards: [
          {
            title: "Colchicine: The Lifeline",
            threshold: "MANDATORY FOR ALL CONFIRMED CASES",
            isCritical: true,
            orders: [
              "Primary Goal: Complete prevention of clinical attacks and suppression of subclinical inflammation.",
              "Safety Check: Monitor for Colchicine toxicity (Diarrhea, abdominal cramps, or rare Bone Marrow suppression)."
            ],
            prescriptions: [
              {
                drug: "Colchicine",
                dose: "< 5y: 0.5 mg/day; 5-10y: 1.0 mg/day; > 10y: 1.5 mg/day",
                route: "Oral",
                frequency: "Once daily (or divided)",
                calculation: (w) => `Target: 1.0 - 1.5 mg total daily dose`,
                notes: "Dose may be increased up to 2.0 mg/day in children with persistent inflammation or frequent attacks."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 4: Surveillance & Amyloidosis Prevention",
        shortLabel: "Surveillance",
        color: "emerald",
        cards: [
          {
            title: "Monitoring Roadmap",
            orders: [
              "Every 3-6 Months: Clinical review and repeat C-Reactive Protein / Erythrocyte Sedimentation Rate (Goal: Normalization between attacks).",
              "Annual Proteinuria Screen: Mandatory first-morning void urinalysis to detect early Amyloidosis.",
              "Ophthalmology: Not required for FMF, but important to distinguish from other periodic fevers with ocular signs."
            ]
          },
          {
            title: "Second-Line Biologics",
            threshold: "COLCHICINE RESISTANCE",
            orders: [
              "Consider IL-1 Inhibitors (Anakinra or Canakinumab) if attacks persist despite a maximal dose of Colchicine (2.0 mg/day in children)."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.amyloidosisRisk === true || data.abdominalPain === true) {
      return { level: 'critical', details: ["Severe flare or risk of permanent Renal damage (Amyloidosis)."] };
    }
    return { level: 'moderate', details: ["Standard Familial Mediterranean Fever attack."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Abdominal pain resolving and patient tolerating oral intake.",
    "Colchicine maintenance dose established and parent education complete.",
    "Parent understands that Colchicine is lifelong and prevents kidney failure.",
    "Follow-up scheduled for inflammatory marker check in 4 weeks."
  ],
  getRedFlags: () => ["Persistent vomiting", "Severe abdominal guarding (Surgical concern)", "Foamy urine (Proteinuria)", "Sudden chest pain"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "EULAR recommendations for the management of FMF", url: "https://ard.bmj.com/content/75/4/644" },
    { title: "Eurofever/PRINTO Classification Criteria for Autoinflammatory Diseases", url: "https://ard.bmj.com/content/74/4/689" }
  ]
};
