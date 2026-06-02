import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Acute Urticaria & Angioedema
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: EAACI/GA²LEN/EDF/WAO Guidelines, AAP, and RCH Melbourne
 */
export const wardUrticariaAngioedemaProtocol: DiseaseProtocol = {
  id: 'ward-urticaria-angioedema',
  name: 'Urticaria & Angioedema Master Pathway',
  system: 'Dermatology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Urticaria is characterized by the sudden onset of wheals (hives), while angioedema involves deeper swelling of the skin or mucous membranes. This exhaustive directive covers airway risk assessment, systematic trigger identification, and stepwise management using second-generation antihistamines and corticosteroids.',
  image: {
    url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Assessment of migratory wheals and mucosal swelling"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'stridor', questionText: 'Stridor, wheeze, or voice change (Airway risk)?', type: 'boolean' },
    { id: 'hypotension', questionText: 'Low Blood Pressure or signs of shock (Anaphylaxis)?', type: 'boolean' },
    { id: 'tongueSwelling', questionText: 'Significant swelling of tongue or lips?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Management centers on (1) Rapidly excluding Anaphylaxis which requires immediate Adrenaline, (2) Controlling pruritus and swelling using non-sedating second-generation Antihistamines as first-line therapy, and (3) Identifying potential triggers such as new medications, foods, or viral infections. Most cases of acute urticaria in children are triggered by viral infections and are self-limiting.",
    stages: [
      {
        label: "Stage 1: Airway & Severity Triage",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Anaphylaxis vs. Isolated Urticaria",
            threshold: "EMERGENCY EVALUATION",
            orders: [
              "Airway: Check for stridor, drooling, or voice change.",
              "Breathing: Check for wheeze or increased work of breathing.",
              "Circulation: Check for hypotension or prolonged capillary refill.",
              "Action: If ANY respiratory or circulatory compromise is present, switch to the ANAPHYLAXIS PROTOCOL immediately."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Trigger Search: History of new foods, drugs (NSAIDs/Antibiotics), or insect stings.",
              "Viral Screen: Check for recent fever, cough, or runny nose (Viral-induced urticaria is most common).",
              "Laboratory Workup: Not routinely required for acute urticaria unless systemic symptoms or suspected infection (Complete Blood Count, C-Reactive Protein).",
              "Physical Exam: Assess distribution of wheals and presence of angioedema (face, hands, feet, genitals)."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Pharmacological Control",
        shortLabel: "Management",
        color: "amber",
        cards: [
          {
            title: "Stepwise Therapeutics",
            orders: [
              "1st Line: Second-generation Antihistamines (Cetirizine, Loratadine). Use up to 4 times the standard dose if needed under specialist advice.",
              "2nd Line: Short course of Oral Prednisolone (1 mg/kg for 3-5 days) if symptoms are severe or involving angioedema.",
              "Note: Avoid first-generation antihistamines (e.g., Chlorphenamine) as routine first-line due to sedation and poor safety profile compared to second-generation agents."
            ],
            prescriptions: [
              {
                drug: "Cetirizine",
                dose: "0.25 mg/kg (Max 10 mg)",
                route: "Oral",
                frequency: "Once daily (up to twice daily in severe cases)",
                calculation: (w) => `${Math.min(w * 0.25, 10).toFixed(1)} mg`,
                notes: "Non-sedating. Preferred for acute and chronic urticaria."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 3: Nursing & Environment [NS]",
        shortLabel: "Nursing Care",
        color: "red",
        cards: [
          {
            title: "Patient Comfort & Monitoring",
            nursing: [
              "Airway Surveillance: Hourly checks for voice change or swallowing difficulty in patients with facial angioedema.",
              "Skin Comfort: Apply cool compresses or calamine lotion to itchy areas. Maintain a cool room temperature.",
              "Trigger Avoidance: Ensure the suspected allergen (if identified) is strictly excluded from the ward environment and diet.",
              "Education: Explain to parents that individual wheals usually disappear within 24 hours, but new ones may appear in different locations."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Discharge & Allergy Roadmap",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Follow-up Strategy",
            orders: [
              "Medication: Continue Antihistamines for 5-7 days or until symptoms have completely resolved for 48 hours.",
              "Referral: Refer to Pediatric Allergy Clinic if Anaphylaxis occurred or if triggers remain unclear.",
              "Action Plan: Provide a written Urticaria Action Plan for future flares."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.stridor === true || data.hypotension === true) {
      return { level: 'critical', details: ["Anaphylaxis suspected - URGENT Adrenaline required."] };
    }
    if (data.tongueSwelling === true) {
      return { level: 'severe', details: ["Significant Angioedema - Airway monitoring mandatory."] };
    }
    return { level: 'moderate', details: ["Acute Urticaria flare."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "No respiratory or circulatory symptoms for > 4 hours.",
    "Swelling and pruritus starting to improve with Antihistamines.",
    "No new wheals appearing while in observation.",
    "Parent knows when to return (Red Flags)."
  ],
  getRedFlags: () => ["Difficulty breathing or swallowing", "Voice change (hoarseness)", "Fainting or feeling dizzy", "Worsening swelling despite therapy"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "EAACI/GA²LEN/EDF/WAO Guideline for Urticaria", url: "https://onlinelibrary.wiley.com/doi/10.1111/all.13397" },
    { title: "RCH Melbourne: Urticaria Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/Urticaria/" }
  ]
};
