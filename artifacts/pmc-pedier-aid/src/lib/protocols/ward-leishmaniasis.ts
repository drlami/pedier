import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Visceral Leishmaniasis (Kala-azar)
 * MASTER MANAGEMENT PATHWAY
 */
export const wardLeishmaniasisProtocol: DiseaseProtocol = {
  id: 'ward-leishmaniasis',
  name: 'Visceral Leishmaniasis (Kala-azar)',
  system: 'Infectious Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Senior directive for Visceral Leishmaniasis: Bone marrow aspiration, Liposomal Amphotericin B dosing, and toxicity monitoring.',
  image: {
    url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Kala-azar Management and Monitoring"
  },
  questions: [],

  mmpData: {
    stages: [
      {
        label: "Admission & Parasitology",
        shortLabel: "Admission & Parasitology",
        color: "blue",
        cards: [
          {
            title: "Mandatory Diagnostic Workup",
            instructions: [
              "1. Serology (rK39 Rapid Test): High sensitivity for primary cases.",
              "2. Bone Marrow Aspiration: GOLD STANDARD. Look for Leishman-Donovan (LD) bodies.",
              "3. CBC: Assess for pancytopenia (classic triad: anemia, leukopenia, thrombocytopenia).",
              "4. LFTs & Renal Function: Baseline required before starting Amphotericin B.",
              "5. Coagulation Profile: Check if severe splenomegaly/thrombocytopenia present."
            ]
          },
          {
            title: "Supportive Care Directive",
            instructions: [
              "Nutritional Support: High protein diet (patients are often severely malnourished).",
              "Blood Transfusion: If Hb < 7 g/dL or symptomatic.",
              "Secondary Infection Check: High risk for pneumonia and GI infections."
            ]
          },
          {
            title: "1st-Line Rx: L-Amphotericin B (PREFERRED REGIMEN: MONOTHERAPY)",
            threshold: "PREFERRED THERAPY",
            instructions: [
              "Target: Clearance of Leishmania parasites.",
              "Regimen (WHO): 3-5 mg/kg daily for 3-5 days (Total dose 15-20 mg/kg)."
            ],
            prescriptions: [
              {
                drug: "Liposomal Amphotericin B",
                dose: "3-5 mg/kg",
                route: "IV",
                frequency: "Once daily",
                calculation: (w) => `${(3 * w).toFixed(1)} - ${(5 * w).toFixed(1)} mg`,
                notes: "Infuse over 2 hours. Monitor for infusion reactions."
              }
            ]
          }
        ]
      },
      {
        label: "Monitoring & Toxicity",
        shortLabel: "Monitoring & Toxicity",
        color: "amber",
        cards: [
          {
            title: "Amphotericin B Monitoring",
            threshold: "DAILY WHILE ON IV",
            instructions: [
              "Renal Function: Check S. Creatinine every 48h. If 2x baseline, consider holding dose.",
              "Electrolytes: Monitor for Hypokalemia and Hypomagnesemia (common side effects).",
              "Temperature: Monitor for rigors/chills during infusion."
            ]
          },
          {
            title: "Clinical Response Tracking",
            instructions: [
              "Fever: Should resolve within 72h of starting effective therapy.",
              "Spleen Size: Mark spleen edge on admission; should regress slowly over weeks.",
              "Hematology: Recovery of WBC and Platelets typically occurs within 7-10 days."
            ]
          }
        ]
      },
      {
        label: "Treatment Failure & Alternatives",
        shortLabel: "Treatment Failure & Alternatives",
        color: "red",
        cards: [
          {
            title: "Defining Failure",
            threshold: "AT DAY 7",
            isCritical: true,
            instructions: [
              "Criteria: Persistent fever or failure of hematological recovery after 7 days.",
              "ACTION: Repeat Bone Marrow Aspiration to check for persistent LD bodies."
            ]
          },
          {
            title: "2nd-Line / Alternative Rx",
            threshold: "RESISTANT OR AMPHO-B UNAVAILABLE",
            instructions: [
              "Note: Pentavalent Antimonials (SSG) have high toxicity and rising resistance in some areas (e.g., Bihar)."
            ],
            prescriptions: [
              {
                drug: "Sodium Stibogluconate (SSG)",
                dose: "20 mg/kg",
                route: "IV/IM",
                frequency: "Once daily",
                calculation: (w) => `${(20 * w).toFixed(0)} mg`,
                notes: "Duration: 28 days. Monitor ECG for QTc prolongation."
              },
              {
                drug: "Miltefosine",
                dose: "2.5 mg/kg",
                route: "PO",
                frequency: "Once daily (or split)",
                calculation: (w) => `${(2.5 * w).toFixed(1)} mg`,
                notes: "Duration: 28 days. Ensure contraception in females of childbearing age."
              }
            ]
          }
        ]
      },
      {
        label: "Discharge & Follow-up",
        shortLabel: "Discharge & Follow-up",
        color: "emerald",
        cards: [
          {
            title: "Discharge Criteria",
            instructions: [
              "1. Completed IV course of Liposomal Amphotericin B.",
              "2. Afebrile and clinically stable.",
              "3. Improving blood counts (WBC > 2.5 x 10^9/L)."
            ]
          },
          {
            title: "Long-Term Follow-up",
            threshold: "AT 1, 3, AND 6 MONTHS",
            instructions: [
              "Assess for Relapse: Return of fever or splenomegaly.",
              "Post-Kala-azar Dermal Leishmaniasis (PKDL): Monitor for skin lesions/hypopigmented macules that can appear months after successful VL treatment."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: () => ({ level: 'moderate', details: [] }),
  getManagement: () => [],
  getDisposition: () => [],
  getRedFlags: () => [],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "WHO: Leishmaniasis Fact Sheet", url: "https://www.who.int/news-room/fact-sheets/detail/leishmaniasis" },
    { title: "MSF: Clinical Guideline for Visceral Leishmaniasis", url: "https://medicalguidelines.msf.org" }
  ],
};
