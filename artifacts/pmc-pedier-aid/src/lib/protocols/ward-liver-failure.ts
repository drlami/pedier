import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Acute Liver Failure (ALF)
 * FULL MASTER SENIOR DOCTOR MANAGEMENT PATHWAY
 * Derived from: PALFSG (Pediatric Acute Liver Failure Study Group), ESPGHAN, and AASLD Guidelines
 */
export const wardLiverFailureProtocol: DiseaseProtocol = {
  id: 'ward-liver-failure',
  name: 'Acute Liver Failure Master Pathway',
  system: 'Gastrointestinal & Hepatology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Exhaustive consultant-level directive: PALFS definition, stepwise encephalopathy management, N-acetylcysteine (NAC) protocols, and transplant center triage.',
  image: {
    url: "https://images.unsplash.com/photo-1579152276502-545a248a69a7?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Critical hepatology management"
  },
  questions: [], 

  mmpData: {
    stages: [
      {
        label: "Definition & Admission Directive",
        shortLabel: "Definition & Admission Directive",
        color: "red",
        cards: [
          {
            title: "PALFS Definition (Pediatric Standard)",
            threshold: "MANDATORY DIAGNOSTIC CRITERIA",
            instructions: [
              "Pediatric ALF is defined by meeting ALL three:",
              "1. No known chronic liver disease.",
              "2. Biochemical evidence of acute liver injury (Elevated Transaminases).",
              "3. Coagulopathy: PT > 15s or INR > 1.5 NOT corrected by Vitamin K (if HE present), OR PT > 20s or INR > 2.0 (regardless of HE).",
              "Note: Hepatic Encephalopathy (HE) is NOT required for diagnosis in infants/children if INR > 2.0."
            ]
          },
          {
            title: "Immediate Admission Labs",
            threshold: "MANDATORY ON ARRIVAL",
            instructions: [
              "1. Coagulation: PT/INR, PTT, Fibrinogen (Check every 6-12 hours).",
              "2. Chemistry: LFTs (ALT/AST/GGT/Bili), Albumin, Glucose (Check q4h for hypoglycemia), U&E, Calcium, Phosphate, Magnesium.",
              "3. Metabolic: Serum Ammonia (Arterial preferred), Lactate, Blood Gas.",
              "4. Toxicology: Serum Paracetamol level (Mandatory even if history negative).",
              "5. Viral Screen: Hep A, B, E; CMV, EBV, HSV, Parvovirus B19.",
              "6. Autoimmune/Metabolic: ANA, ASMA, LKM, Ceruloplasmin, Alpha-1 Antitrypsin."
            ]
          },
          {
            title: "Initial Therapeutics & Stabilization",
            instructions: [
              "1. IV Glucose: Maintain D10 or D12.5 (0.9% NaCl) to prevent hypoglycemia. Keep glucose 80-120 mg/dL.",
              "2. Vitamin K: 0.2-0.5 mg/kg IV (Max 10mg) for 3 days. Do NOT give FFP unless active bleeding (masks INR trend).",
              "3. Stress Ulcer Prophylaxis: IV H2RA or PPI (e.g. Omeprazole 1mg/kg)."
            ]
          }
        ]
      },
      {
        label: "Specific Therapy (Paracetamol focus)",
        shortLabel: "Specific Therapy (Paracetamol focus)",
        color: "blue",
        cards: [
          {
            title: "N-Acetylcysteine (NAC) Protocol",
            threshold: "PREFERRED REGIMEN: MONOTHERAPY (ANTIDOTE)",
            instructions: [
              "INDICATIONS: All paracetamol ingestions AND consider for ALL non-paracetamol ALF (improves transplant-free survival).",
              "PROTOCOL (Standard 21-hour):"
            ],
            prescriptions: [
              {
                drug: "NAC Loading Dose",
                dose: "150 mg/kg",
                route: "IV Infusion",
                frequency: "Over 60 minutes",
                calculation: (w) => `${(150 * w).toFixed(0)} mg`,
                notes: "Mix in 5% Dextrose (volume based on age/weight)."
              },
              {
                drug: "NAC 2nd Dose",
                dose: "50 mg/kg",
                route: "IV Infusion",
                frequency: "Over 4 hours",
                calculation: (w) => `${(50 * w).toFixed(0)} mg`
              },
              {
                drug: "NAC 3rd Dose",
                dose: "100 mg/kg",
                route: "IV Infusion",
                frequency: "Over 16 hours",
                calculation: (w) => `${(100 * w).toFixed(0)} mg`,
                notes: "Continue infusion if INR remains > 2.0."
              }
            ]
          }
        ]
      },
      {
        label: "Complication Management (HE & ICP)",
        shortLabel: "Complication Management (HE & ICP)",
        color: "red",
        cards: [
          {
            title: "Hepatic Encephalopathy (HE) Monitoring",
            threshold: "STAGE-BASED ACTION",
            isCritical: true,
            instructions: [
              "Stage I: Mood changes, sleep inversion.",
              "Stage II: Drowsiness, confusion, asterixis.",
              "Stage III: Stupor, marked confusion.",
              "Stage IV: Coma.",
              "ACTION (Stage II+): Move to PICU. Start Lactulose (0.5 mL/kg) and Rifaximin if available."
            ]
          },
          {
            title: "Cerebral Edema / Increased ICP",
            threshold: "GCS DECLINE / PUPIL CHANGE",
            isCritical: true,
            instructions: [
              "1. Head Position: Midline, elevated 30 degrees.",
              "2. Ammonia Control: Aim < 100 µmol/L. If > 200 µmol/L → High risk of herniation.",
              "3. Rescue: 3% Hypertonic Saline (3-5 mL/kg) or Mannitol (0.5 g/kg).",
              "4. Renal Replacement: Early CVVH if ammonia rising or AKI present."
            ]
          },
          {
            title: "Acute Liver Failure Complications",
            instructions: [
              "1. AKI (Hepatorenal): Avoid nephrotoxins. Maintain renal perfusion.",
              "2. Infection: Low threshold for broad-spectrum antibiotics (Tazocin).",
              "3. Coagulopathy: Only treat if active bleeding (Cryoprecipitate for Fibrinogen < 100)."
            ]
          }
        ]
      },
      {
        label: "Transplant Triage & Transfer",
        shortLabel: "Transplant Triage & Transfer",
        color: "indigo",
        cards: [
          {
            title: "Liver Transplant Center Referral",
            threshold: "CONSULTANT TRIGGER (URGENT)",
            isCritical: true,
            instructions: [
              "Consult a transplant center IMMEDIATELY if:",
              "1. INR > 2.0 (not corrected) or INR > 1.5 with encephalopathy.",
              "2. Progressive jaundice (Bilirubin > 10-15 mg/dL).",
              "3. Rapidly shrinking liver size (clinical/US).",
              "4. Metabolic acidosis (Lactate > 3.0) despite fluids."
            ]
          },
          {
            title: "King's College Criteria (Paracetamol)",
            instructions: [
              "Refer if pH < 7.30 after resuscitation OR all three:",
              "1. INR > 6.5.",
              "2. Creatinine > 3.4 mg/dL (300 µmol/L).",
              "3. Grade III/IV Encephalopathy."
            ]
          }
        ]
      }
    ]
  },

  // ER Legacy
  calculateSeverity: () => ({ level: 'severe', details: [] }),
  getManagement: () => [],
  getDisposition: () => [],
  getRedFlags: () => [],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "PALFS: Pediatric Acute Liver Failure Study Group Definitions", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3052861/" },
    { title: "ESPGHAN: Acute Liver Failure in Children Management Guideline", url: "https://www.espghan.org" },
    { title: "AASLD: Management of Acute Liver Failure", url: "https://www.aasld.org" }
  ],
};
