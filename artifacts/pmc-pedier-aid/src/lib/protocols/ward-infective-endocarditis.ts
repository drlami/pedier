import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Infective Endocarditis (IE)
 * MASTER MANAGEMENT PATHWAY
 */
export const wardInfectiveEndocarditisProtocol: DiseaseProtocol = {
  id: 'ward-infective-endocarditis',
  name: 'Infective Endocarditis (IE)',
  system: 'Infectious Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Infective Endocarditis (IE) is a serious infection of the endocardium, primarily affecting the heart valves, often occurring in children with underlying congenital heart disease. This pathway guides clinicians through the Modified Duke Criteria for diagnosis, standardized blood culture strategies, and the intensive 4-6 week intravenous antibiotic regimens required for cure.',
  image: {
    url: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Duke Criteria and Echo Analysis"
  },
  questions: [],

  mmpData: {
    snapshot: "Management focuses on the 'Diagnostic-Therapeutic-Surgical' triad: (1) Prompt collection of multiple blood cultures prior to antibiotics and baseline echocardiography, (2) Sustained, high-dose intravenous bactericidal therapy tailored to culture results, and (3) Early surgical consultation for refractory heart failure, persistent vegetations, or perivalvular extension. Serial monitoring of inflammatory markers and echocardiographic findings is essential.",
    stages: [
      {
        label: "Stage 1: Admission & Duke Criteria Workup",
        shortLabel: "Diagnostic Phase",
        color: "blue",
        cards: [
          {
            title: "Initial Physician Orders [DR]",
            threshold: "CRITICAL: FIRST 24 HOURS",
            isCritical: true,
            orders: [
              "Mandatory Blood Culture Strategy: Collect 3 separate sets of blood cultures from different peripheral venipuncture sites. Ensure age-appropriate volume (e.g., 2-4 mL for infants, 10-20 mL for adolescents) for maximum sensitivity.",
              "Laboratory Evaluation: Complete Blood Count, C-Reactive Protein (CRP), Erythrocyte Sedimentation Rate (ESR), Urea and Electrolytes, Liver Function Tests, and Urinalysis (to check for microscopic hematuria).",
              "Electrocardiogram (ECG): Check for new PR interval prolongation (suggests aortic root abscess).",
              "Imaging: Schedule urgent Transthoracic Echocardiogram (TTE); consider Transesophageal Echocardiogram (TEE) if TTE is non-diagnostic or for prosthetic valves."
            ]
          },
          {
            title: "Modified Duke Criteria Checklist",
            orders: [
              "Definite IE: 2 Major, OR 1 Major + 3 Minor, OR 5 Minor criteria.",
              "MAJOR: Positive Blood Cultures (typical organism from 2 sets) AND Echocardiographic evidence (vegetation, abscess, or new valvular regurgitation).",
              "MINOR: Predisposition (known heart condition or Intravenous drug use), Fever > 38°C, Vascular phenomena (major arterial emboli, mycotic aneurysm), Immunologic phenomena (Osler nodes, Roth spots, Glomerulonephritis)."
            ]
          },
          {
            title: "Nursing: Strict Monitoring [NS]",
            nursing: [
              "Continuous Cardiac and Respiratory monitoring for all high-risk patients.",
              "Vitals: Check Temperature, Heart Rate, and Respiratory Rate every 4 hours.",
              "Systemic Assessment: Perform daily skin checks for Janeway lesions (painless) or Osler nodes (painful) and eye exams for Roth spots.",
              "Intake and Output: Maintain strict charting; monitor for signs of heart failure (e.g., increased work of breathing, crackles)."
            ]
          },
          {
            title: "Empiric Intravenous Therapy (Native Valve)",
            orders: [
              "Target organisms: Viridans group Streptococci, Staphylococcus aureus, and Enterococci.",
              "Initiate after blood cultures are drawn unless the patient is in septic shock."
            ],
            prescriptions: [
              {
                drug: "Benzylpenicillin (or Ampicillin)",
                dose: "50 mg/kg",
                route: "IV",
                frequency: "Every 4-6 hours",
                calculation: (w) => `${(50 * w).toFixed(0)} mg`,
                notes: "Synergy with Gentamicin."
              },
              {
                drug: "Flucloxacillin",
                dose: "50 mg/kg",
                route: "IV",
                frequency: "Every 6 hours",
                calculation: (w) => `${(50 * w).toFixed(0)} mg`,
                notes: "Target: Staphylococcus aureus."
              },
              {
                drug: "Gentamicin",
                dose: "3 mg/kg",
                route: "IV",
                frequency: "Once daily",
                calculation: (w) => `${(3 * w).toFixed(0)} mg`,
                notes: "Low-dose synergy. Monitor renal function and Gentamicin levels."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 2: Treatment Monitoring & Culture Clearance",
        shortLabel: "Monitoring",
        color: "amber",
        cards: [
          {
            title: "Persistent Infection Tracking [DR]",
            orders: [
              "Repeat Blood Cultures: Every 24-48 hours until negative. The first day of negative cultures marks 'Day 1' of the 4-6 week course.",
              "Inflammatory Markers: Monitor CRP and ESR weekly; a slow decline is expected with effective therapy.",
              "Daily Auscultation: Evaluate for a new or changing heart murmur (major sign of valvular damage)."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Complications & Surgical Triggers",
        shortLabel: "Surgical Trigger",
        color: "red",
        cards: [
          {
            title: "Indications for Urgent Surgery",
            threshold: "HEART FAILURE / UNCONTROLLED INFECTION",
            isCritical: true,
            orders: [
              "Refractory Heart Failure: Most common indication for early valve replacement.",
              "Uncontrolled Infection: Persistent fever or positive blood cultures for more than 7 days despite appropriate antibiotics.",
              "Perivalvular Extension: Evidence of an abscess, new heart block on ECG, or fistula.",
              "Embolic Risk: Vegetations greater than 10mm associated with previous embolic events."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Recovery & Long-Term Planning",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Completion of Therapy",
            orders: [
              "Ensure total Intravenous antibiotic duration of 4 weeks (for Streptococcus) or 6 weeks (for Staphylococcus or Prosthetic Valves).",
              "Outpatient Parenteral Antibiotic Therapy (OPAT): Consider only if hemodynamically stable, no heart failure, and reliable Peripherally Inserted Central Catheter (PICC) access.",
              "Follow-up Echocardiogram: Required at the completion of therapy and 1 month after discharge.",
              "Education: Emphasize the importance of meticulous dental hygiene and endocarditis prophylaxis for future procedures."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: () => ({ level: 'severe', details: [] }),
  getManagement: () => [],
  getDisposition: () => [],
  getRedFlags: () => [],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "AHA: Infective Endocarditis in Childhood (2015/2021 Update)", url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000000298" },
    { title: "ESC: Guidelines for the Management of Infective Endocarditis", url: "https://www.escardio.org" }
  ],
};
