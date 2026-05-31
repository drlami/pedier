import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Septic Arthritis & Osteomyelitis
 * MASTER MANAGEMENT PATHWAY
 */
export const wardSepticArthritisOsteoProtocol: DiseaseProtocol = {
  id: 'ward-septic-arthritis-osteo',
  name: 'Septic Arthritis & Osteomyelitis',
  system: 'Infectious Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Senior directive for bone and joint infections: Joint aspiration, surgical drainage, IV-to-PO transition, and long-term antibiotic strategy.',
  image: {
    url: "https://images.unsplash.com/photo-1579154235602-3c2c2aa5d72f?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Bone and Joint Infection Management"
  },
  questions: [],

  mmpData: {
    stages: [
      {
        label: "Admission & Source Control",
        shortLabel: "Admission & Source Control",
        color: "blue",
        cards: [
          {
            title: "Immediate Diagnostic Workup",
            threshold: "BEFORE ANTIBIOTICS",
            instructions: [
              "1. Blood Culture: REQUIRED (positive in 40-50% of cases).",
              "2. Inflammatory Markers: Baseline CBC, CRP, and ESR (ESR is critical for long-term tracking).",
              "3. Joint Aspiration (Arthrocentesis): GOLD STANDARD for septic arthritis. Send for Gram stain, culture, and cell count (>50,000 WBC/mm³ with >75% neutrophils is suggestive).",
              "4. Bone Biopsy: Consider if diagnosis of osteomyelitis is unclear or if failing therapy."
            ]
          },
          {
            title: "Radiology Directive",
            instructions: [
              "Plain X-ray: Required to exclude fracture/malignancy (Note: early Osteo may show no X-ray changes for 10-14 days).",
              "Ultrasound: Excellent for detecting joint effusion (Septic Arthritis) and subperiosteal abscess.",
              "MRI with Contrast: Most sensitive for early Osteomyelitis and defining extent of soft tissue involvement."
            ]
          },
          {
            title: "Empiric IV Therapy (Standard) (PREFERRED REGIMEN: DUAL THERAPY)",
            threshold: "AGE > 3 MONTHS",
            instructions: [
              "Target: Staphylococcus aureus (MSSA/MRSA) and Kingella kingae (in toddlers).",
              "Switch to targeted therapy once cultures return."
            ],
            prescriptions: [
              {
                drug: "Flucloxacillin",
                dose: "50 mg/kg",
                route: "IV",
                frequency: "Every 6 hours",
                calculation: (w) => `${(50 * w).toFixed(0)} mg`,
                notes: "Target: MSSA. Max 2g."
              },
              {
                drug: "Ceftriaxone",
                dose: "50-80 mg/kg",
                route: "IV",
                frequency: "Once daily",
                calculation: (w) => `${Math.min(80 * w, 2000).toFixed(0)} mg`,
                notes: "Add if Hib/Gram-negative risk or if unimmunized."
              }
            ]
          },
          {
            title: "Empiric IV Therapy (MRSA Suspected) (PREFERRED REGIMEN: DUAL THERAPY)",
            threshold: "HIGH LOCAL PREVALENCE OR TOXIC",
            instructions: [
              "Consider if patient is septic, has multi-focal involvement, or prior MRSA history."
            ],
            prescriptions: [
              {
                drug: "Clindamycin",
                dose: "10-13 mg/kg",
                route: "IV",
                frequency: "Every 8 hours",
                calculation: (w) => `${(10 * w).toFixed(0)} mg`,
                notes: "Excellent bone penetration. Check local resistance."
              },
              {
                drug: "Vancomycin",
                dose: "15 mg/kg",
                route: "IV",
                frequency: "Every 6 hours",
                calculation: (w) => `${(15 * w).toFixed(0)} mg`,
                notes: "Monitor troughs (Target 10-15 mcg/mL)."
              }
            ]
          }
        ]
      },
      {
        label: "Monitoring & 48h Response",
        shortLabel: "Monitoring & 48h Response",
        color: "amber",
        cards: [
          {
            title: "Clinical Response Tracking",
            instructions: [
              "Fever: Improvement expected within 48-72h of effective drainage and antibiotics.",
              "Pain/Function: Assess range of motion and weight-bearing daily.",
              "CRP Trend: Repeat CRP every 48h. A 50% drop is a strong predictor of successful therapy."
            ]
          },
          {
            title: "Surgical Trigger",
            threshold: "FAILURE TO IMPROVE AT 48H",
            isCritical: true,
            instructions: [
              "1. Persistent Fever or worsening pain despite IV antibiotics.",
              "2. Rising or stagnant CRP after 48h.",
              "3. Ultrasound evidence of enlarging subperiosteal abscess or persistent joint effusion.",
              "ACTION: Urgent Orthopedic consultation for washout/debridement."
            ]
          }
        ]
      },
      {
        label: "Complications & Treatment Failure",
        shortLabel: "Complications & Treatment Failure",
        color: "red",
        cards: [
          {
            title: "Complication: DEEP VEIN THROMBOSIS (DVT)",
            threshold: "S. AUREUS OSTEOMYELITIS",
            isCritical: true,
            instructions: [
              "Screen for DVT (especially in pelvic osteomyelitis or if S. aureus PVL+).",
              "Symptoms: Unexplained leg swelling or respiratory distress (PE)."
            ]
          },
          {
            title: "Therapy Upgrade (Gram Negative / Anaerobic) (PREFERRED REGIMEN: MONOTHERAPY)",
            threshold: "COMPLEX / PENETRATING TRAUMA",
            instructions: [
              "Broaden coverage if soil contamination or fecal contamination suspected."
            ],
            prescriptions: [
              {
                drug: "Tazocin (Piperacillin/Tazobactam)",
                dose: "90 mg/kg",
                route: "IV",
                frequency: "Every 6 hours",
                calculation: (w) => `${(90 * w).toFixed(0)} mg`,
                notes: "Broad-spectrum coverage including anaerobes. Max 4.5g."
              }
            ]
          }
        ]
      },
      {
        label: "PO Transition & Discharge",
        shortLabel: "PO Transition & Discharge",
        color: "emerald",
        cards: [
          {
            title: "Criteria for Oral Step-Down",
            threshold: "MANDATORY CHECKLIST",
            instructions: [
              "1. Afebrile for at least 24-48 hours.",
              "2. CRP decreased by > 30-50% from peak.",
              "3. Clinical improvement: Decreased swelling/tenderness, improved range of motion.",
              "4. Able to tolerate high-dose oral medications."
            ]
          },
          {
            title: "Discharge Antibiotic Roadmap",
            instructions: [
              "Duration Septic Arthritis: 2-3 weeks total.",
              "Duration Osteomyelitis: 3-4 weeks minimum (up to 6 weeks for MRSA or complex cases).",
              "Note: Oral doses are often higher than standard (e.g., Cephalexin 33 mg/kg Q8h)."
            ],
            prescriptions: [
              {
                drug: "Cephalexin",
                dose: "33 mg/kg",
                route: "PO",
                frequency: "Every 8 hours",
                calculation: (w) => `${(33 * w).toFixed(0)} mg`,
                notes: "High-dose oral step-down for MSSA."
              },
              {
                drug: "Clindamycin",
                dose: "10 mg/kg",
                route: "PO",
                frequency: "Every 8 hours",
                calculation: (w) => `${(10 * w).toFixed(0)} mg`,
                notes: "Step-down for MRSA or Pen-allergic."
              }
            ]
          },
          {
            title: "Follow-up Directive",
            instructions: [
              "Week 1 post-discharge: Repeat CRP/ESR and clinical review.",
              "End of therapy: Clinical review ± repeat X-ray (if Osteo) to ensure no pathological fracture or sequestration."
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
    { title: "IDSA/PIDS Guideline: Acute Bacterial Arthritis in Children (2021)", url: "https://academic.oup.com/cid/article/73/11/e4490/6321614" },
    { title: "IDSA/PIDS Guideline: Acute Hematogenous Osteomyelitis (2021)", url: "https://academic.oup.com/cid/article/73/11/e4450/6321615" }
  ],
};
