import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

/**
 * Pediatric Ward: UTI & Pyelonephritis
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: AAP (2016 Update), NICE (2022), and RCH Melbourne.
 */
export const wardUtiProtocol: DiseaseProtocol = {
  id: 'ward-uti',
  name: 'UTI & Pyelonephritis Master Pathway',
  system: 'Renal & Urinary System',
  unit: 'ward',
  description: 'Professional inpatient management of pediatric UTI/Pyelonephritis: Targeted IV-to-Oral transition, AAP-aligned imaging workflows, and recurrence prevention.',
  image: {
    url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Kidney and urinary tract infection management"
  },
  questions: [
    { id: 'age', questionText: 'Patient Age', type: 'number', unit: 'months' },
    { id: 'toxic', questionText: 'Toxic appearing or hemodynamically unstable?', type: 'boolean' },
    { id: 'fever48h', questionText: 'Fever persisting > 48 hours after starting effective antibiotics?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Transition to oral antibiotics as soon as afebrile for 24h and clinically improving. In infants < 6m, renal ultrasound is mandatory before discharge or within 6 weeks.",
    stages: [
      {
        label: "Stage 1: Admission & Initial Orders (Hour 0-6)",
        shortLabel: "Admission",
        color: "blue",
        cards: [
          {
            title: "Immediate Physician Directives",
            orders: [
              "Urine Culture (MANDATORY): Obtain via SPA or Catheter in non-toilet trained children.",
              "Blood Culture: Indicated for all infants < 2 months or toxic-appearing children.",
              "Renal Function (U&E/Cr): Assess for AKI if clinical dehydration or toxic appearance.",
              "Strict I/O Charting: Monitor for oliguria."
            ]
          },
          {
            title: "Initial IV Antimicrobial Choice",
            threshold: "EMPIRICAL START",
            orders: [
              "Children > 1 month: Ceftriaxone 75 mg/kg IV once daily.",
              "Infants < 1 month: Ampicillin + Gentamicin (Must cover Enterococcus).",
              "Known Urological Abnormality: Consult Micro; may need broader coverage (e.g., Tazocin)."
            ],
            prescriptions: [
              {
                drug: "Ceftriaxone (IV)",
                dose: "75 mg/kg",
                route: "IV",
                frequency: "Once daily",
                calculation: (w) => `${(75 * w).toFixed(0)} mg`,
                notes: "Max 2g daily."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 2: Monitoring & Escalation (Hour 6-48)",
        shortLabel: "Monitoring",
        color: "amber",
        cards: [
          {
            title: "Nursing & Monitoring [NS]",
            nursing: [
              "Temp/HR/RR every 4 hours.",
              "Daily weight to assess hydration status.",
              "Monitor urinary stream (especially in males - rule out PUV).",
              "Check for flank tenderness daily."
            ]
          },
          {
            title: "Escalation Triggers [!]",
            isCritical: true,
            triggers: [
              "Persistent Fever > 48h: Consider abscess, hydronephrosis, or resistant organism.",
              "Rising Creatinine: Suspect AKI or obstructive uropathy.",
              "Palpable Abdominal Mass: Urgent Ultrasound required."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Step-Down & Imaging Strategy",
        shortLabel: "Step-Down",
        color: "emerald",
        cards: [
          {
            title: "IV to Oral Transition Strategy",
            threshold: "AFEBRILE > 24H",
            orders: [
              "Switch to Oral if afebrile for 24 hours, clinically stable, and tolerating oral intake.",
              "Tailor antibiotics to urine culture results.",
              "Preferred: Cefixime (8 mg/kg/d) or Co-amoxiclav (45 mg/kg/d)."
            ],
            prescriptions: [
              {
                drug: "Cefixime (Oral)",
                dose: "8 mg/kg",
                route: "Oral",
                frequency: "Once daily",
                calculation: (w) => `${(8 * w).toFixed(1)} mg`,
                notes: "Convenient once-daily dosing."
              }
            ]
          },
          {
            title: "Imaging Roadmap (AAP Guidelines)",
            instructions: [
              "1. Renal Ultrasound (RUS): Required for ALL children < 2 years with first febrile UTI.",
              "2. VCUG/MCUG: NOT routine. Perform only if RUS shows hydronephrosis/scarring or if second febrile UTI.",
              "3. DMSA: Consider 4-6 months after acute event if recurrent UTI suspected."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.toxic === true || (data.age && Number(data.age) < 3)) {
      return { level: 'critical', details: ["High risk due to age or toxicity."] };
    }
    if (data.fever48h === true) {
      return { level: 'severe', details: ["Fever persistent despite antibiotics; investigate for complications."] };
    }
    return { level: 'moderate', details: ["Stable inpatient UTI management."] };
  },
  getManagement: () => [], // Use mmpData
  getDisposition: () => [
    "Afebrile for 24 hours.",
    "Tolerating oral antibiotics and fluids.",
    "Renal Ultrasound performed or scheduled.",
    "Parent understands the follow-up plan."
  ],
  getRedFlags: () => ["Persistent fever > 48h", "Palpable mass", "Rising creatinine", "Poor stream"],
  getDrugDoses: () => [], // Use mmpData prescriptions
  getReferences: () => [
    { title: "AAP: UTI Clinical Practice Guideline", url: "https://publications.aap.org/pediatrics/article/128/3/595/30815/Urinary-Tract-Infection-Clinical-Practice" },
    { title: "NICE NG224: UTI in children", url: "https://www.nice.org.uk/guidance/ng224" }
  ]
};
