import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Henoch-Schönlein Purpura (HSP) / IgA Vasculitis
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: EULAR/PRINTO/PRES Criteria, NICE Guidelines, and RCH Melbourne
 */
export const wardHspProtocol: DiseaseProtocol = {
  id: 'ward-hsp',
  name: 'Henoch-Schönlein Purpura Master Pathway',
  system: 'Immunology & Rheumatology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Henoch-Schönlein Purpura (HSP), also known as IgA Vasculitis, is the most common systemic vasculitis in childhood, characterized by IgA-dominant immune complex deposition in small vessels. This exhaustive directive covers the classic triad (purpura, arthritis, abdominal pain), acute complication screening, and a mandatory 6-month renal surveillance roadmap.',
  image: {
    url: "https://images.unsplash.com/photo-1581594658553-33061bc4c81a?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Assessment of palpable purpura and renal complications"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'abdominalPain', questionText: 'Severe or colicky abdominal pain?', type: 'boolean' },
    { id: 'hematuria', questionText: 'Macroscopic hematuria or 2+ proteinuria on dipstick?', type: 'boolean' },
    { id: 'hypertension', questionText: 'Blood Pressure > 95th percentile for age/height?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "HSP management is primarily supportive. The consultant mindset must focus on (1) Screening for acute gastrointestinal complications like intussusception, and (2) Rigorous long-term monitoring for IgA Vasculitis Nephritis, which can develop up to 6 months after the initial rash. Corticosteroids do not prevent renal disease but may alleviate severe gastrointestinal or joint symptoms.",
    stages: [
      {
        label: "Stage 1: Diagnosis & Multi-system Assessment",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Diagnostic Verification (EULAR Criteria)",
            threshold: "PURPURA + 1 ADDITIONAL CRITERIA",
            orders: [
              "Palpable Purpura (Mandatory): Non-thrombocytopenic, typically in dependent areas (buttocks, lower limbs).",
              "Diffuse Abdominal Pain: Often colicky; may be associated with gastrointestinal bleeding.",
              "Histopathology: IgA deposition in skin or kidney biopsy (if performed).",
              "Arthritis or Arthralgia: Acute joint swelling or pain, often involving knees and ankles.",
              "Renal Involvement: Hematuria (greater than 5 red blood cells per high power field) or proteinuria."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Blood Pressure: Mandatory baseline measurement using appropriate cuff size.",
              "Urinalysis: Mandatory baseline dipstick for protein and blood.",
              "Complete Blood Count: Verify normal platelet count (to rule out Thrombocytopenic Purpura).",
              "Urea, Electrolytes, and Creatinine: Establish baseline renal function.",
              "Albumin: Check for hypoalbuminemia if significant proteinuria is present.",
              "Stool Guaiac/Occult Blood: Screen for occult gastrointestinal bleeding."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Acute Symptomatic Management",
        shortLabel: "Management",
        color: "amber",
        cards: [
          {
            title: "Pain Control Directive",
            orders: [
              "Joint Pain: Use Paracetamol or Non-Steroidal Anti-Inflammatory Drugs (NSAIDs) if renal function and gastrointestinal status are stable.",
              "Severe Abdominal Pain: Consider a trial of Oral Prednisolone (1-2 mg/kg) to reduce edema and pain.",
              "Note: NSAIDs should be avoided if there is active gastrointestinal bleeding or suspected nephritis."
            ],
            prescriptions: [
              {
                drug: "Prednisolone",
                dose: "1-2 mg/kg",
                route: "Oral",
                frequency: "Once daily (Morning)",
                calculation: (w) => `${(w * 1.5).toFixed(0)} mg`,
                notes: "Max 60mg. Use only for severe abdominal or joint symptoms."
              }
            ]
          },
          {
            title: "Nursing: Strict Monitoring [NS]",
            nursing: [
              "Daily Blood Pressure: Report any reading above the 95th percentile.",
              "Daily Urinalysis: Track progression of hematuria or proteinuria.",
              "Abdominal Assessment: Monitor for signs of intussusception (severe colicky pain, 'currant jelly' stools, abdominal mass).",
              "Scrotal Exam: Check for scrotal edema or pain in males (vasculitis can mimic torsion)."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Complication Surveillance [!]",
        shortLabel: "Complications",
        color: "red",
        cards: [
          {
            title: "Renal Escalation Triggers",
            threshold: "SUSPECTED NEPHRITIS",
            triggers: [
              "New-onset Hypertension.",
              "Macroscopic (Visible) Hematuria.",
              "Proteinuria greater than 2+ on dipstick.",
              "Rising Serum Creatinine or falling Albumin.",
              "Action: Consult Pediatric Nephrology immediately for possible biopsy."
            ]
          },
          {
            title: "Gastrointestinal Emergencies",
            threshold: "SURGICAL CONSULT REQUIRED",
            triggers: [
              "Severe, worsening abdominal pain.",
              "Persistent vomiting or abdominal distention.",
              "Evidence of bowel obstruction or intussusception on Ultrasound.",
              "Significant gastrointestinal hemorrhage."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Mandatory 6-Month Renal Roadmap",
        shortLabel: "Follow-up",
        color: "emerald",
        cards: [
          {
            title: "Outpatient Surveillance Schedule",
            orders: [
              "Weeks 1-4: Weekly Blood Pressure and Urinalysis.",
              "Months 2-3: Fortnightly Blood Pressure and Urinalysis.",
              "Months 4-6: Monthly Blood Pressure and Urinalysis.",
              "Discharge: Only if all parameters remain normal for 6 full months.",
              "Parent Education: Teach signs of 'red urine' and the importance of every scheduled checkup."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.hypertension === true || data.abdominalPain === true) {
      return { level: 'critical', details: ["Severe complications (Hypertension or GI distress) detected."] };
    }
    if (data.hematuria === true) {
      return { level: 'severe', details: ["Nephritis suspected; requiring close surveillance."] };
    }
    return { level: 'moderate', details: ["Stable Henoch-Schönlein Purpura."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Stable abdominal symptoms and normal intake.",
    "Pain well-controlled on oral medications.",
    "Parent understands and agrees to the 6-month follow-up roadmap.",
    "Clear instructions provided on when to return (GI/Renal red flags)."
  ],
  getRedFlags: () => ["Severe abdominal pain", "Blood in stool", "Red urine", "Headache/Vision changes (Hypertension)", "Scrotal pain"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "EULAR/PRINTO/PRES classification criteria for HSP", url: "https://annals.org/" },
    { title: "NICE Guidelines: Henoch-Schönlein Purpura", url: "https://www.nice.org.uk/" },
    { title: "RCH Melbourne: Henoch-Schönlein Purpura", url: "https://www.rch.org.au/clinicalguide/guideline_index/Henoch-Schonlein_Purpura/" }
  ]
};
