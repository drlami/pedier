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
  description: 'Acute Liver Failure (ALF) in children is a rare but life-threatening syndrome characterized by biochemical evidence of acute liver injury, no known chronic liver disease, and a coagulopathy (INR ≥ 1.5 with encephalopathy or INR ≥ 2.0 without). This pathway provides diagnostic criteria according to the Pediatric Acute Liver Failure Study Group (PALFS), N-acetylcysteine (NAC) protocols, and urgent triage for liver transplantation.',
  image: {
    url: "https://images.unsplash.com/photo-1579152276502-545a248a69a7?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Critical hepatology management"
  },
  questions: [], 

  mmpData: {
    snapshot: "Management of Acute Liver Failure is a multi-system emergency focused on 'The Critical Four': (1) Preventing cerebral edema (monitoring ammonia and intracranial pressure), (2) Metabolic stabilization (aggressive hypoglycemia prevention and electrolyte correction), (3) Antidote therapy (early N-acetylcysteine for paracetamol and non-paracetamol cases), and (4) Urgent transplant consultation. Avoidance of sedatives and cautious use of blood products (to maintain INR monitoring) are essential.",
    stages: [
      {
        label: "Definition & Admission Directive",
        shortLabel: "Definition & Admission Directive",
        color: "red",
        cards: [
          {
            title: "PALFS Definition (Pediatric Standard)",
            threshold: "MANDATORY DIAGNOSTIC CRITERIA",
            orders: [
              "Pediatric Acute Liver Failure is defined by meeting ALL three:",
              "1. No known chronic liver disease.",
              "2. Biochemical evidence of acute liver injury (Elevated Transaminases).",
              "3. Coagulopathy: Prothrombin Time > 15 seconds or International Normalized Ratio > 1.5 NOT corrected by Vitamin K (if encephalopathy present), OR Prothrombin Time > 20 seconds or International Normalized Ratio > 2.0 (regardless of encephalopathy).",
              "Note: Hepatic Encephalopathy is NOT required for diagnosis in infants and children if International Normalized Ratio is greater than 2.0."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Diagnostic Triage: Confirm coagulopathy (International Normalized Ratio greater than 2.0, or greater than 1.5 with encephalopathy).",
              "Immediate Laboratory Workup: Perform Liver Function Tests, Ammonia (arterial preferred), Lactate, and Glucose every 4 hours.",
              "Coagulation Monitoring: International Normalized Ratio (INR), Prothrombin Time (PT), and Fibrinogen every 6-12 hours.",
              "Paracetamol Screening: Mandatory Serum Paracetamol level regardless of clinical history.",
              "Metabolic Stabilization: Initiate Intravenous Dextrose 10% or 12.5% to maintain glucose between 80 and 120 mg/dL.",
              "Vitamin K Therapy: Administer 0.2-0.5 mg/kg Intravenous Vitamin K (Maximum 10 mg) daily for 3 days."
            ]
          },
          {
            title: "Detailed Diagnostics",
            threshold: "MANDATORY ON ARRIVAL",
            orders: [
              "Toxicology: Serum Paracetamol level (Mandatory even if history negative).",
              "Viral Screen: Hepatitis A, B, E; CMV, EBV, HSV, Parvovirus B19.",
              "Autoimmune/Metabolic: ANA, ASMA, LKM, Ceruloplasmin, Alpha-1 Antitrypsin."
            ]
          },
          {
            title: "Initial Therapeutics & Stabilization",
            orders: [
              "IV Glucose: Maintain Dextrose 10% or Dextrose 12.5% (0.9% Sodium Chloride) to prevent hypoglycemia. Keep glucose 80-120 mg/dL.",
              "Vitamin K: 0.2-0.5 mg/kg IV (Maximum 10 mg) for 3 days. Do NOT give Fresh Frozen Plasma unless active bleeding (masks INR trend).",
              "Stress Ulcer Prophylaxis: Intravenous H2 Receptor Antagonist or Proton Pump Inhibitor (e.g. Omeprazole 1 mg/kg)."
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
            orders: [
              "INDICATIONS: All paracetamol ingestions AND consider for ALL non-paracetamol Acute Liver Failure (improves transplant-free survival).",
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
                notes: "Continue infusion if International Normalized Ratio remains > 2.0."
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
            orders: [
              "Stage I: Mood changes, sleep inversion.",
              "Stage II: Drowsiness, confusion, asterixis.",
              "Stage III: Stupor, marked confusion.",
              "Stage IV: Coma.",
              "ACTION (Stage II+): Move to Pediatric Intensive Care Unit. Start Lactulose (0.5 mL/kg) and Rifaximin if available."
            ]
          },
          {
            title: "Nursing: Strict Monitoring [NS]",
            nursing: [
              "Hourly neurological checks (Glasgow Coma Scale and pupil reaction) to monitor for Hepatic Encephalopathy.",
              "Blood glucose monitoring every 2-4 hours to prevent life-threatening hypoglycemia.",
              "Strict Intake and Output charting and daily weight measurements.",
              "Head of bed elevation to 30 degrees and maintain midline head position.",
              "Monitor for active bleeding from puncture sites or gastrointestinal tract."
            ]
          },
          {
            title: "Cerebral Edema / Increased ICP",
            threshold: "GCS DECLINE / PUPIL CHANGE",
            isCritical: true,
            orders: [
              "1. Head Position: Midline, elevated 30 degrees.",
              "2. Ammonia Control: Aim < 100 µmol/L. If > 200 µmol/L → High risk of herniation.",
              "3. Rescue: 3% Hypertonic Saline (3-5 mL/kg) or Mannitol (0.5 g/kg).",
              "4. Renal Replacement: Early continuous veno-venous hemofiltration (CVVH) if ammonia rising or Acute Kidney Injury present."
            ]
          },
          {
            title: "Acute Liver Failure Complications",
            orders: [
              "1. Acute Kidney Injury (Hepatorenal): Avoid nephrotoxins. Maintain renal perfusion.",
              "2. Infection: Low threshold for broad-spectrum antibiotics (Piperacillin-Tazobactam).",
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
