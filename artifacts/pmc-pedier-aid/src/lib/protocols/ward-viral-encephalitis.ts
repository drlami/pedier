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
  description: 'Viral Encephalitis is an inflammation of the brain parenchyma caused by a viral infection, leading to neurological dysfunction such as altered consciousness, seizures, or focal deficits. This exhaustive directive covers Cerebrospinal Fluid (CSF) Polymerase Chain Reaction (PCR) strategies, high-dose Acyclovir therapy, and comprehensive neurological monitoring.',
  image: {
    url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Neurological Monitoring and GCS"
  },
  questions: [
    { id: 'weight', questionText: 'Current Weight', type: 'number', unit: 'kg' },
    { id: 'gcs', questionText: 'Glasgow Coma Scale Score', type: 'number' },
    { id: 'seizures', questionText: 'Active or recurrent seizures?', type: 'boolean' },
    { id: 'focalDeficit', questionText: 'New focal neurological deficit?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Viral Encephalitis management focuses on the 'Time is Brain' principle: (1) Immediate initiation of high-dose Acyclovir before diagnostic confirmation to prevent irreversible temporal lobe damage (especially in Herpes Simplex Virus Type 1), (2) Aggressive management of intracranial pressure and seizures, and (3) A systematic diagnostic search including Magnetic Resonance Imaging and specific Viral Polymerase Chain Reaction panels. A negative initial result does not rule out encephalitis if clinical suspicion is high; serial testing and consideration of autoimmune etiologies are mandatory.",
    stages: [
      {
        label: "Stage 1: Admission & Critical Diagnostics",
        shortLabel: "Diagnostics",
        color: "blue",
        cards: [
          {
            title: "Emergency Stabilization",
            orders: [
              "Airway Protection: Ensure definitive airway if Glasgow Coma Scale is 8 or less.",
              "Seizure Control: Immediate Intravenous Benzodiazepines for active seizures.",
              "Intracranial Pressure Management: Elevate head of bed to 30 degrees, maintain neutral neck position, and avoid hypovolemia."
            ]
          },
          {
            title: "Neuro-Diagnostic Workup [DR]",
            orders: [
              "Magnetic Resonance Imaging (MRI) Brain (Preferred): Focus on temporal lobe (Herpes Simplex) or thalamic changes.",
              "Computed Tomography (CT) Brain: Perform if Magnetic Resonance Imaging is unavailable, primarily to exclude hemorrhage or mass effect before Lumbar Puncture.",
              "Lumbar Puncture (Cerebrospinal Fluid): MANDATORY unless contraindicated by signs of severely raised intracranial pressure. Send for: Protein, Glucose, Cell Count, Gram Stain, Culture, and a Comprehensive Viral Polymerase Chain Reaction Panel (Herpes Simplex Virus 1/2, Varicella Zoster, Enterovirus, Adenovirus, Parechovirus)."
            ]
          },
          {
            title: "Empiric Therapeutics",
            threshold: "START IMMEDIATELY",
            orders: [
              "Herpes Simplex Coverage: Start Acyclovir IMMEDIATELY; do not wait for imaging or Lumbar Puncture results.",
              "Broad Bacterial Coverage: Include Ceftriaxone until Bacterial Meningitis is definitively excluded.",
              "Renal Protection: Maintain adequate Intravenous hydration to prevent Acyclovir-induced crystal nephropathy."
            ],
            prescriptions: [
              {
                drug: "Acyclovir",
                dose: "20 mg/kg (if < 12y) or 15 mg/kg (if > 12y)",
                route: "Intravenous",
                frequency: "Every 8 hours",
                calculation: (w) => `${(20 * w).toFixed(0)} mg`,
                notes: "Infuse over 1 hour. Ensure patient is well-hydrated."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 2: Neuro-Protection & Monitoring",
        shortLabel: "Monitoring",
        color: "amber",
        cards: [
          {
            title: "Nursing: Neurological Surveillance [NS]",
            isCritical: true,
            nursing: [
              "Glasgow Coma Scale: Check and document every 1-2 hours depending on stability.",
              "Pupillary Assessment: Monitor size and reactivity to light every 2 hours.",
              "Cranial Nerve Check: Focused assessment of nerves III, IV, VI, and VII every shift.",
              "Vital Signs: Monitor for Cushing's Triad (Bradycardia, Hypertension, and irregular breathing)."
            ]
          },
          {
            title: "Advanced Monitoring [DR]",
            orders: [
              "Electroencephalogram (EEG): Indicated if consciousness remains low or to rule out non-convulsive status epilepticus.",
              "Electrolyte Monitoring: Monitor Sodium levels closely (Risk of Syndrome of Inappropriate Antidiuretic Hormone Secretion)."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Complication Management [!]",
        shortLabel: "Complications",
        color: "red",
        cards: [
          {
            title: "Escalation: Refractory Seizures",
            threshold: "STATUS EPILEPTICUS",
            orders: [
              "Escalate to Status Epilepticus Protocol.",
              "Options include Fosphenytoin, Levetiracetam, or a Midazolam infusion."
            ]
          },
          {
            title: "Escalation: Raised Intracranial Pressure",
            threshold: "SUDDEN DROP IN CONSCIOUSNESS",
            orders: [
              "Emergency Osmotherapy: Administer Mannitol or 3% Hypertonic Saline.",
              "Urgent Radiology: Repeat Computed Tomography to check for midline shift."
            ]
          },
          {
            title: "Alternative Path: Autoimmune Encephalitis",
            threshold: "VIRAL PCR NEGATIVE",
            orders: [
              "Consider testing for Anti-NMDA Receptor Antibodies if the course is atypical or the patient fails to improve.",
              "Consult Pediatric Rheumatology/Neurology for potential Pulse Steroids or Intravenous Immunoglobulin."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Recovery & Rehabilitation",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Treatment Completion",
            orders: [
              "Confirmed Herpes Simplex: Minimum 21 days of Intravenous Acyclovir therapy.",
              "Repeat Lumbar Puncture: Mandatory before stopping therapy to ensure Polymerase Chain Reaction negativity."
            ]
          },
          {
            title: "Discharge & Neuro-Rehabilitation",
            nursing: [
              "Swallow assessment before transitioning to oral intake.",
              "Mobility and safety check prior to discharge."
            ],
            orders: [
              "Referrals: Occupational Therapy, Physical Therapy, and Speech Therapy for all patients with residual deficits.",
              "Follow-up: Clinical review in 4-6 weeks to assess cognitive and school performance."
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
