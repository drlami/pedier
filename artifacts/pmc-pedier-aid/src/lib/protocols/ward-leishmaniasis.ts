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
  description: 'Visceral Leishmaniasis (Kala-azar) is a systemic protozoal infection caused by Leishmania species, transmitted by sandflies, and characterized by prolonged fever, splenomegaly, and pancytopenia. This pathway focuses on definitive parasitological diagnosis via bone marrow, standardized Liposomal Amphotericin B dosing, and vigilance for post-Kala-azar dermal leishmaniasis (PKDL).',
  image: {
    url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Kala-azar Management and Monitoring"
  },
  questions: [],

  mmpData: {
    snapshot: "Management of Visceral Leishmaniasis centers on the 'Triad of Cure': (1) Parasitological confirmation (gold standard: bone marrow aspiration), (2) Targeted antimicrobial therapy (first-line: Liposomal Amphotericin B), and (3) Intensive nutritional and hematological support. Close monitoring for drug-induced nephrotoxicity and electrolyte imbalances is mandatory during treatment.",
    stages: [
      {
        label: "Admission & Parasitology",
        shortLabel: "Admission & Parasitology",
        color: "blue",
        cards: [
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Parasitological Confirmation: Perform Bone Marrow Aspiration to identify Leishman-Donovan (LD) bodies.",
              "Serological Screening: Perform rK39 rapid diagnostic test (High sensitivity in primary cases).",
              "Baseline Hematology: Complete Blood Count to assess for pancytopenia (triad of anemia, leukopenia, and thrombocytopenia).",
              "Organ Function Baseline: Serum Creatinine, Urea, and Liver Function Tests before starting therapy.",
              "Nutritional Assessment: Evaluate for severe acute malnutrition (common in Kala-azar)."
            ]
          },
          {
            title: "Supportive Care Directive",
            orders: [
              "Nutritional Support: High protein diet (patients are often severely malnourished).",
              "Blood Transfusion: If Hemoglobin is less than 7 g/dL or patient is symptomatic.",
              "Secondary Infection Check: High risk for pneumonia and gastrointestinal infections."
            ]
          },
          {
            title: "1st-Line Rx: L-Amphotericin B (PREFERRED REGIMEN: MONOTHERAPY)",
            threshold: "PREFERRED THERAPY",
            orders: [
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
            orders: [
              "Renal Function: Check Serum Creatinine every 48 hours. If 2x baseline, consider holding dose.",
              "Electrolytes: Monitor for Hypokalemia and Hypomagnesemia (common side effects).",
              "Temperature: Monitor for rigors and chills during infusion."
            ]
          },
          {
            title: "Nursing: Strict Monitoring [NS]",
            nursing: [
              "Monitor temperature every 4 hours (expect resolution within 72 hours of treatment).",
              "Record daily weight and ensure high-protein nutritional intake.",
              "Monitor infusion site and assess for rigors or chills during Amphotericin B administration.",
              "Strict Intake and Output charting, especially while on intravenous medications."
            ]
          },
          {
            title: "Clinical Response Tracking",
            orders: [
              "Fever: Should resolve within 72 hours of starting effective therapy.",
              "Spleen Size: Mark spleen edge on admission; should regress slowly over weeks.",
              "Hematology: Recovery of White Blood Cells and Platelets typically occurs within 7-10 days."
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
