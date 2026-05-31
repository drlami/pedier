import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Viral Encephalitis
 * MASTER MANAGEMENT PATHWAY
 */
export const wardViralEncephalitisProtocol: DiseaseProtocol = {
  id: 'ward-viral-encephalitis',
  name: 'Viral Encephalitis',
  system: 'Infectious Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Senior directive for brain parenchyma inflammation: CSF PCR strategy, high-dose Acyclovir, and neurological monitoring.',
  image: {
    url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Neurological Monitoring and GCS"
  },
  questions: [],

  mmpData: {
    stages: [
      {
        label: "Admission & Critical Diagnostics",
        shortLabel: "Admission & Critical Diagnostics",
        color: "blue",
        cards: [
          {
            title: "Emergency Stabilization",
            instructions: [
              "1. ABC: Ensure airway protection if GCS < 8.",
              "2. Seizure Control: Immediate Benzodiazepines if active seizure.",
              "3. ICP Management: Elevate head 30 degrees, avoid hypovolemia."
            ],
            calculator: {
              id: "gcs-calculator",
              title: "Pediatric GCS Calculator"
            }
          },
          {
            title: "Neuro-Diagnostic Workup",
            instructions: [
              "1. MRI Brain (Preferred): High sensitivity for temporal lobe (HSV) or thalamic (JE/West Nile) changes.",
              "2. CT Brain: If MRI unavailable; primarily to exclude hemorrhage/mass effect before LP.",
              "3. Lumbar Puncture (CSF): REQUIRED unless contraindicated by raised ICP. Send for: Protein, Glucose, Cell Count, Gram Stain, Culture, and VIRAL PCR PANEL (HSV 1/2, VZV, Enterovirus, Adenovirus, Parechovirus)."
            ]
          },
          {
            title: "Empiric Therapy (PREFERRED REGIMEN: DUAL THERAPY)",
            instructions: [
              "Target: HSV-1 (most common cause of sporadic fatal encephalitis).",
              "Note: Start Acyclovir IMMEDIATELY; do not wait for LP/imaging. Include Ceftriaxone until bacterial meningitis is excluded."
            ],
            prescriptions: [
              {
                drug: "Acyclovir (High Dose)",
                dose: "20 mg/kg (if < 12y) or 10-15 mg/kg (if > 12y)",
                route: "IV",
                frequency: "Every 8 hours",
                calculation: (w) => `${(20 * w).toFixed(0)} mg`,
                notes: "Infuse over 1 hour. Maintain hydration to prevent renal crystal formation."
              },
              {
                drug: "Ceftriaxone",
                dose: "100 mg/kg",
                route: "IV",
                frequency: "Once daily",
                calculation: (w) => `${Math.min(100 * w, 4000).toFixed(0)} mg`,
                notes: "Include until Bacterial Meningitis is excluded."
              }
            ]
          }
        ]
      },
      {
        label: "Monitoring & Neuro-Protection",
        shortLabel: "Monitoring & Neuro-Protection",
        color: "amber",
        cards: [
          {
            title: "Neurological Surveillance",
            threshold: "Q1H - Q4H DEPENDING ON STABILITY",
            isCritical: true,
            instructions: [
              "Monitor: GCS, Pupil size/reactivity, and focal motor deficits.",
              "Cranial Nerve Check: Focus on III, IV, VI and VII.",
              "EEG Monitoring: Indicated if GCS remains low or if subtle twitching (rule out non-convulsive status)."
            ]
          },
          {
            title: "Response Check (Day 3)",
            threshold: "AT 72 HOURS",
            instructions: [
              "If CSF PCR is negative AND patient is clinically improving: Consider stopping Acyclovir.",
              "If CSF PCR is negative but patient is NOT improving: Re-check PCR (may be negative early) or consider alternative (Autoimmune/Malignancy)."
            ]
          }
        ]
      },
      {
        label: "Complications & Upgrade",
        shortLabel: "Complications & Upgrade",
        color: "red",
        cards: [
          {
            title: "Complication: REFRACTORY SEIZURES",
            threshold: "STATUS EPILEPTICUS",
            isCritical: true,
            instructions: [
              "Proceed to Status Epilepticus Protocol.",
              "Options: Phenytoin/Fosphenytoin, Levetiracetam, or Midazolam infusion."
            ]
          },
          {
            title: "Complication: RAISED ICP / HERNIATION",
            threshold: "CUSHING TRIAD / SUDDEN GCS DROP",
            isCritical: true,
            instructions: [
              "Action: URGENT Mannitol or Hypertonic Saline.",
              "Radiology: Repeat CT Brain to check for midline shift or worsening edema."
            ]
          },
          {
            title: "Alternative Path: AUTOIMMUNE ENCEPHALITIS",
            threshold: "VIRAL PCR NEGATIVE / CHRONIC COURSE",
            instructions: [
              "Consider NMDA Receptor Antibody testing.",
              "Treatment: Pulse Steroids (Methylprednisolone), IVIG, or Plasmapheresis."
            ]
          }
        ]
      },
      {
        label: "Recovery & Long-term Care",
        shortLabel: "Recovery & Long-term Care",
        color: "emerald",
        cards: [
          {
            title: "Treatment Duration",
            threshold: "PCR CONFIRMED HSV",
            instructions: [
              "Course: 21 days of IV Acyclovir (minimum).",
              "Repeat LP: Required before stopping to ensure PCR negativity in HSV cases."
            ]
          },
          {
            title: "Discharge & Rehabilitation",
            instructions: [
              "1. Neurologically stable and afebrile.",
              "2. Functional assessment: Swallow test and mobility check.",
              "3. Referral: Neuro-rehabilitation (OT/PT/Speech) for all patients with deficits."
            ]
          },
          {
            title: "Follow-up",
            instructions: [
              "Clinical review at 4-6 weeks.",
              "Assess for cognitive/behavioral changes and school performance."
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
    { title: "PIDS/IDSA: Management of Encephalitis (2008/2021)", url: "https://academic.oup.com/cid/article/47/3/303/426804" },
    { title: "RCPCH: Viral Encephalitis in Children", url: "https://www.rcpch.ac.uk" }
  ],
};
