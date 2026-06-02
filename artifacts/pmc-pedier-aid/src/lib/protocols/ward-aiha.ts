import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Autoimmune Hemolytic Anemia (AIHA)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: ASH Guidelines, British Society for Haematology, and RCH Melbourne
 */
export const wardAihaProtocol: DiseaseProtocol = {
  id: 'ward-aiha',
  name: 'Autoimmune Hemolytic Anemia Master Pathway',
  system: 'Hematology & Oncology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Autoimmune Hemolytic Anemia (AIHA) is an acquired condition where autoantibodies (Warm IgG or Cold IgM) are directed against red blood cell antigens, leading to their premature destruction. This exhaustive directive covers the distinction between Warm and Cold types, high-dose corticosteroid induction, and safe transfusion strategies in the presence of "least incompatible" blood.',
  image: {
    url: "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Assessment of rapid pallor, jaundice, and hemolytic markers"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'hemoglobinInitial', questionText: 'Initial Hemoglobin (g/dL)', type: 'number' },
    { id: 'cardiacStrain', questionText: 'Tachycardia, shortness of breath, or chest pain?', type: 'boolean' },
    { id: 'hemoglobinuria', questionText: 'Dark (coca-cola) urine present?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "AIHA management focuses on (1) Rapid suppression of the autoantibody-mediated destruction using high-dose corticosteroids, (2) Systematic search for secondary causes (SLE, Lymphoma, or Infection), and (3) Life-saving transfusion support using the 'least incompatible' crossmatch strategy. Clinicians must realize that waiting for perfectly matched blood in a severe hemolytic crisis is more dangerous than transfusing 'incompatible' units.",
    stages: [
      {
        label: "Stage 1: Hemolytic Verification & Type",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Confirming Hemolysis [DR]",
            orders: [
              "Laboratory Triad: Decreased Hemoglobin, Elevated Reticulocyte count (usually > 3-5%), and Low Haptoglobin.",
              "Markers: Elevated Unconjugated Bilirubin and Lactate Dehydrogenase (LDH).",
              "Direct Antiglobulin Test (DAT): MANDATORY. Differentiates between IgG (Warm), Complement/C3 (Cold), or mixed types.",
              "Peripheral Blood Smear: Look for Spherocytes (Warm AIHA) or clumping (Cold AIHA)."
            ]
          },
          {
            title: "Initial Physician Orders",
            orders: [
              "Baseline Bloods: Electrolytes, Urea, Creatinine, and Liver Function Tests.",
              "Secondary Screen: Antinuclear Antibody (SLE), Mycoplasma serology, and Viral PCR (EBV/CMV).",
              "Crossmatch: Urgent request for 'Least Incompatible' blood if hemoglobin is life-threateningly low."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Immunosuppressive Induction",
        shortLabel: "Management",
        color: "red",
        cards: [
          {
            title: "Corticosteroid Protocol (Warm AIHA)",
            threshold: "FIRST-LINE THERAPY",
            isCritical: true,
            orders: [
              "Primary Treatment: Start high-dose Oral Prednisolone (2 mg/kg/day).",
              "Pulse Option: Consider Intravenous Methylprednisolone (30 mg/kg for 3 days) for severe, rapid hemolysis.",
              "Note: 70-80% of children with Warm AIHA will respond to steroids within 7-10 days."
            ],
            prescriptions: [
              {
                drug: "Prednisolone",
                dose: "2 mg/kg/day",
                route: "Oral",
                frequency: "Once daily (Morning)",
                calculation: (w) => `${Math.min(w * 2, 60).toFixed(0)} mg`,
                notes: "Max 60mg. Continue at full dose until hemoglobin > 10 g/dL."
              }
            ]
          },
          {
            title: "Cold Agglutinin Safety",
            threshold: "IF DAT POSITIVE FOR C3 ONLY",
            orders: [
              "Thermal Protection: Keep the patient warm (room temperature > 22°C). Use blood warmers for all intravenous fluids and transfusions.",
              "Antimicrobial Strategy: PREFERRED REGIMEN: MONOTHERAPY (Azithromycin) if Mycoplasma pneumoniae is a suspected trigger.",
              "Note: Corticosteroids are generally INEFFECTIVE for primary Cold Agglutinin Disease; management centers on treating the underlying infection and strict cold avoidance."
            ],
            prescriptions: [
              {
                drug: "Azithromycin",
                dose: "10 mg/kg",
                route: "Oral",
                frequency: "Once daily",
                calculation: (w) => `${Math.min(w * 10, 500).toFixed(0)} mg`,
                notes: "Standard 5-day course for suspected Mycoplasma infection."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 3: Transfusion & Complication Watch [!]",
        shortLabel: "Transfusion",
        color: "red",
        cards: [
          {
            title: "The 'Least Incompatible' Rule",
            threshold: "IF HB < 5-6 OR SYMPTOMATIC",
            isCritical: true,
            orders: [
              "Strategy: If blood is required for life-saving reasons and autoantibodies make crossmatching impossible, use the 'least incompatible' units provided by the blood bank.",
              "Volume: Transfuse small aliquots (5-10 mL/kg) slowly to avoid worsening the hemolytic rate.",
              "Monitoring: Physician MUST be present for the first 30 minutes of transfusion."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Nursing Care & Recovery Roadmap [NS]",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Bedside Monitoring",
            nursing: [
              "Urine Watch: Monitor for 'coca-cola' colored urine (hemoglobinuria) indicating massive intravascular hemolysis.",
              "Vital Signs: Heart Rate and Blood Pressure monitoring every 4 hours.",
              "Folic Acid: Administer Folic Acid (5 mg daily) to support high marrow demand for erythropoiesis."
            ]
          },
          {
            title: "Discharge & Taper Roadmap",
            orders: [
              "Steroid Taper: Only begin once hemoglobin is stable > 10 g/dL. Taper slowly over 3-6 months to prevent relapse.",
              "Vaccination Catch-up: Ensure Pneumococcal and Meningococcal vaccinations are updated if splenectomy is considered.",
              "Follow-up: Weekly Complete Blood Count and Reticulocyte count until remission is confirmed."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.cardiacStrain === true || (data.hemoglobinInitial && data.hemoglobinInitial < 5)) {
      return { level: 'critical', details: ["Severe Hemolytic Crisis with Cardiac Strain - High risk of heart failure."] };
    }
    if (data.hemoglobinuria === true) {
      return { level: 'severe', details: ["Rapid Intravascular Hemolysis - Requires aggressive hydration and monitoring."] };
    }
    return { level: 'moderate', details: ["Stable AIHA under induction therapy."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Hemoglobin stabilized and showing a rising trend.",
    "Reticulocyte count starting to fall (response to therapy).",
    "Tolerating oral corticosteroids without significant side effects.",
    "Long-term steroid taper plan established and explained to parents."
  ],
  getRedFlags: () => ["Dark red or black urine", "Sudden shortness of breath", "Yellowing of skin/eyes (worsening jaundice)", "Fainting or severe dizziness"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "ASH: Management of Autoimmune Hemolytic Anemia", url: "https://ashpublications.org/" },
    { title: "BSH Guideline: Diagnosis and management of AIHA", url: "https://onlinelibrary.wiley.com/doi/full/10.1111/bjh.14778" },
    { title: "RCH Melbourne: AIHA Clinical Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/Autoimmune_Haemolytic_Anaemia/" }
  ]
};
