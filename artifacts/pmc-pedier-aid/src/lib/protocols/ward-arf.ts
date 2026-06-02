import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Acute Rheumatic Fever (ARF)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: RHD Australia and AHA Jones Criteria (2015).
 */
export const wardArfProtocol: DiseaseProtocol = {
  id: 'ward-arf-master',
  name: 'Acute Rheumatic Fever Master Pathway',
  system: 'Cardiovascular System',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Acute Rheumatic Fever is a multisystem inflammatory disease following Group A Streptococcal pharyngitis. It is diagnosed using the Revised Jones Criteria. Management focuses on eradicating the streptococcal infection, treating arthritis/carditis, and starting life-long secondary prophylaxis.',
  image: {
    url: "https://images.unsplash.com/photo-1576089238240-dfafa94348f9?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Inflammatory multisystem management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Body Weight', type: 'number', unit: 'kg' },
    { id: 'fever', questionText: 'Temp > 38.5°C', type: 'boolean' },
    { id: 'joints', questionText: 'Polyarthritis or Polyarthralgia', type: 'boolean' },
    { id: 'carditis', questionText: 'New Murmur or EF Change', type: 'boolean' },
    { id: 'esr', questionText: 'ESR (mm/hr)', type: 'number' },
  ], 

  mmpData: {
    snapshot: "Diagnosis requires evidence of preceding Group A Strep (ASOT/Anti-DNase B) PLUS 2 Major OR 1 Major + 2 Minor Jones criteria. Primary goal is early Penicillin eradication and strict bed rest for carditis. Salicylates are the mainstay for arthritis but must be avoided until the diagnosis is confirmed to prevent masking of symptoms.",
    stages: [
      {
        label: "Stage 1: Diagnosis & Eradication",
        shortLabel: "Diagnosis",
        color: "blue",
        cards: [
          {
            title: "Jones Criteria Verification [DR]",
            threshold: "MAJOR CRITERIA",
            orders: [
              "Major: Joint (Polyarthritis), Oh my heart (Carditis), Nodules (Subcutaneous), Erythema Marginatum, Sydenham Chorea.",
              "Minor: Fever (>38.5), Arthralgia, Elevated ESR (>60) or CRP (>3), Prolonged PR Interval on ECG.",
              "Evidence of GAS: Positive Throat Swab OR Elevated ASOT / Anti-DNase B titers."
            ]
          },
          {
            title: "Initial Infection Eradication",
            orders: [
              "Immediate Step: Eradicate Group A Strep even if throat swab is negative.",
              "Benzathine Penicillin G: < 27kg: 600,000 U IM (Single dose); ≥ 27kg: 1.2 Million U IM (Single dose).",
              "Alternative (Allergy): Erythromycin or Cephalexin for 10 days."
            ],
            prescriptions: [
              {
                drug: "Benzathine Penicillin G",
                dose: "Single Dose",
                route: "IM",
                frequency: "STAT",
                calculation: (w) => w < 27 ? "600,000 Units" : "1.2 Million Units",
                notes: "Intramuscular only. Critical for primary eradication."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 2: Anti-Inflammatory Therapy",
        shortLabel: "Inflammation",
        color: "amber",
        cards: [
          {
            title: "Arthritis Management (No Carditis)",
            threshold: "WAIT FOR DIAGNOSIS CONFIRMATION",
            orders: [
              "Aspirin (High Dose): 75-100 mg/kg/day in 4 divided doses for 2-4 weeks, then taper.",
              "Naproxen Alternative: 10-20 mg/kg/day if Aspirin is not tolerated."
            ],
            prescriptions: [
              {
                drug: "Aspirin (Anti-inflammatory)",
                dose: "100 mg/kg/day",
                route: "PO",
                frequency: "QID (4 times daily)",
                calculation: (w) => `${(w * 100).toFixed(0)} mg total / day`,
                notes: "Monitor for Salicylate toxicity and GI bleeding."
              }
            ]
          },
          {
            title: "Carditis Management (Severe)",
            orders: [
              "Prednisolone: 2 mg/kg/day (Max 60mg) for 2-4 weeks if severe carditis or heart failure present.",
              "Strict Bed Rest: Essential for the duration of acute carditis to reduce cardiac workload."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Secondary Prophylaxis & Senior Triggers",
        shortLabel: "Prophylaxis",
        color: "red",
        cards: [
          {
            title: "Life-long Prevention Strategy",
            orders: [
              "Secondary Prophylaxis: Benzathine Penicillin G IM every 3 to 4 weeks.",
              "Duration: Minimum 10 years or until age 21 (whichever is longer). Permanent carditis requires longer duration."
            ]
          },
          {
            title: "Senior Triggers [!]",
            isCritical: true,
            triggers: [
              "IF New Heart Murmur (Holosystolic apex) or Gallop Rhythm develops.",
              "IF Signs of Heart Failure (Hepatomegaly, Respiratory Distress) occur.",
              "IF Sydenham Chorea develops (uncoordinated movements, emotional lability)."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data) => {
    const esr = Number(data.esr);
    if (data.carditis || esr > 100) return { level: 'critical', details: ["Severe ARF with Carditis: High risk for permanent valve damage. Cardiology/ICU consult required."] };
    if (data.joints) return { level: 'severe', details: ["Definite ARF: Start High-dose Aspirin after confirmation."] };
    return { level: 'moderate', details: ["Suspected ARF: Observe and obtain GAS titers."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Inflammatory markers (ESR/CRP) showing significant downward trend.",
    "No evidence of new or worsening carditis on Echocardiogram.",
    "Patient established on long-term secondary prophylaxis plan.",
    "Dental review completed (essential for prevention of endocarditis)."
  ],
  getRedFlags: [
    "Chest pain or palpitations",
    "Shortness of breath (especially when lying flat)",
    "Fainting or severe lightheadedness",
    "New-onset joint swelling or severe pain"
  ],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "RHD Australia: National ARF/RHD Guidelines", url: "https://www.rhdaustralia.org.au/rhda-guidelines" },
    { title: "AHA/Jones Criteria: Revised 2015", url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000000205" }
  ],
};
