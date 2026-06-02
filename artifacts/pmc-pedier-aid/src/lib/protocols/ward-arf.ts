import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Acute Rheumatic Fever (ARF)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: Jones Criteria (AHA 2015 Revision), WHO, and RCH Melbourne
 */
export const wardArfProtocol: DiseaseProtocol = {
  id: 'ward-arf',
  name: 'Acute Rheumatic Fever Master Pathway',
  system: 'Immunology & Rheumatology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Acute Rheumatic Fever is a non-suppurative inflammatory complication of Group A Streptococcal pharyngitis, affecting the heart, joints, brain, and skin. This exhaustive directive covers the revised Jones Criteria (low vs. high-risk populations), Carditis screening, and the mandatory secondary prophylaxis roadmap to prevent permanent Rheumatic Heart Disease.',
  image: {
    url: "https://images.unsplash.com/photo-1576089234161-460d3d523b0a?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Clinical assessment of Jones criteria and cardiac involvement"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'heartMurmur', questionText: 'New organic heart murmur or signs of heart failure?', type: 'boolean' },
    { id: 'jointSwelling', questionText: 'Migratory polyarthritis or severe polyarthralgia?', type: 'boolean' },
    { id: 'chorea', questionText: 'Purposeless, involuntary movements (Sydenham Chorea)?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Acute Rheumatic Fever management focuses on (1) Eradicating the triggering Group A Streptococcal infection, (2) Controlling systemic inflammation (arthritis and carditis), and (3) Establishing a life-long or long-term secondary prophylaxis plan. Diagnosis relies on the revised Jones Criteria; clinicians must differentiate between low-risk and high-risk populations. Carditis is the only manifestation that leads to permanent disability.",
    stages: [
      {
        label: "Stage 1: Diagnosis & Risk Stratification",
        shortLabel: "Diagnosis",
        color: "blue",
        cards: [
          {
            title: "Revised Jones Criteria (Major)",
            threshold: "EVIDENCE OF GAS INFECTION + 2 MAJOR OR 1 MAJOR + 2 MINOR",
            orders: [
              "Carditis: Clinical or subclinical (Echocardiogram findings).",
              "Polyarthritis: Migratory, involving large joints (knees, ankles, elbows, wrists).",
              "Sydenham Chorea: Purposeless, jerky movements; often a late manifestation.",
              "Erythema Marginatum: Rare, pink, non-pruritic rings on the trunk/limbs.",
              "Subcutaneous Nodules: Small, firm, painless nodules over bony prominences."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Streptococcal Evidence: Anti-Streptolysin O (ASO) titer, Anti-DNase B, or Throat Culture.",
              "Inflammatory Markers: Erythrocyte Sedimentation Rate and C-Reactive Protein.",
              "Cardiac Workup: Electrocardiogram (Check for prolonged PR interval) and Echocardiogram (MANDATORY to detect subclinical valvulitis).",
              "Baseline Bloods: Complete Blood Count and renal/liver function tests."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Acute Phase Therapeutics",
        shortLabel: "Therapeutics",
        color: "red",
        cards: [
          {
            title: "Streptococcal Eradication",
            orders: [
              "Primary Goal: Eradicate any remaining Group A Streptococcus, even if throat culture is negative.",
              "Note: This is not the same as secondary prophylaxis, though the drugs may overlap."
            ],
            prescriptions: [
              {
                drug: "Benzathine Penicillin G",
                dose: "600,000 Units (< 27kg) or 1.2 Million Units (> 27kg)",
                route: "Intramuscular",
                frequency: "Single Dose",
                calculation: (w) => w < 27 ? "600,000 Units" : "1,200,000 Units",
                notes: "Gold standard for eradication. If penicillin allergic, use Erythromycin."
              }
            ]
          },
          {
            title: "Anti-Inflammatory Strategy",
            orders: [
              "Arthritis: High-dose Aspirin or Naproxen provides rapid relief (often within 24-48 hours).",
              "Carditis: Use Prednisolone for severe carditis (heart failure or cardiomegaly); Aspirin is sufficient for mild carditis.",
              "Caution: Avoid starting anti-inflammatories until the joint pattern (migratory) is confirmed, as they can mask the diagnosis."
            ],
            prescriptions: [
              {
                drug: "Naproxen",
                dose: "10-20 mg/kg/day",
                route: "Oral",
                frequency: "Divided every 12 hours",
                calculation: (w) => `${(w * 15).toFixed(0)} mg`,
                notes: "Preferred over Aspirin in many centers for ease of dosing and safety profile."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 3: Nursing & Bedside Monitoring [NS]",
        shortLabel: "Monitoring",
        color: "amber",
        cards: [
          {
            title: "Cardiac Surveillance",
            nursing: [
              "Heart Rate: Monitor for tachycardia out of proportion to fever (sign of carditis).",
              "Respiratory Effort: Monitor for tachypnea or rales (signs of heart failure).",
              "Bed Rest: Strict bed rest is mandatory for patients with active carditis to reduce cardiac workload.",
              "Daily Weight: Monitor for fluid retention in heart failure."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Secondary Prophylaxis & Follow-up",
        shortLabel: "Prophylaxis",
        color: "emerald",
        cards: [
          {
            title: "The Prophylaxis Roadmap",
            threshold: "MANDATORY FOR ALL CASES",
            orders: [
              "Duration (No Carditis): 5 years or until age 21 (whichever is longer).",
              "Duration (Carditis without VHD): 10 years or until age 21 (whichever is longer).",
              "Duration (Carditis with persistent VHD): 10 years or until age 40 (often life-long).",
              "VHD = Valvular Heart Disease.",
              "Note: Intramuscular Benzathine Penicillin every 3-4 weeks is superior to oral prophylaxis."
            ],
            prescriptions: [
              {
                drug: "Benzathine Penicillin G",
                dose: "1.2 Million Units",
                route: "Intramuscular",
                frequency: "Every 4 weeks",
                calculation: (w) => "1,200,000 Units",
                notes: "Every 3 weeks is recommended in high-prevalence areas or for high-risk patients."
              }
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.heartMurmur === true) {
      return { level: 'critical', details: ["Acute Rheumatic Carditis - Requires cardiac stabilization and strict bed rest."] };
    }
    if (data.chorea === true) {
      return { level: 'severe', details: ["Sydenham Chorea - Requires neurological safety and possible sedation."] };
    }
    return { level: 'moderate', details: ["Acute Rheumatic Fever (Arthritis-dominant)."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Joint symptoms resolving and pain well-controlled.",
    "Cardiac status stable with no signs of heart failure.",
    "First dose of eradication therapy administered.",
    "Secondary prophylaxis plan documented and parents educated.",
    "Follow-up Echocardiogram scheduled (usually at 1 month)."
  ],
  getRedFlags: () => ["Shortness of breath", "Chest pain", "Fainting or severe palpitations", "Inability to swallow (Sydenham Chorea complication)"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "2015 Revised Jones Criteria for ARF", url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000000205" },
    { title: "RCH Melbourne: Acute Rheumatic Fever", url: "https://www.rch.org.au/clinicalguide/guideline_index/Acute_Rheumatic_Fever/" }
  ]
};
