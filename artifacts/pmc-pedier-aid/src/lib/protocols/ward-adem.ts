import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Acute Disseminated Encephalomyelitis (ADEM)
 * MASTER MANAGEMENT PATHWAY (MMP)
 */
export const wardAdemProtocol: DiseaseProtocol = {
  id: 'ward-adem-master',
  name: 'ADEM Master Pathway',
  system: 'Neurological System',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Acute Disseminated Encephalomyelitis (ADEM) is an immune-mediated demyelinating CNS disease, typically following a viral or bacterial infection. It is characterized by multi-focal neurological deficits and encephalopathy. Management centers on high-dose steroids and monitoring for neurological deterioration.',
  image: {
    url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Neuro-inflammatory management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Body Weight', type: 'number', unit: 'kg' },
    { id: 'encephalopathy', questionText: 'Encephalopathy (Altered consciousness/behavior)?', type: 'boolean' },
    { id: 'multifocal', questionText: 'Multi-focal neurological deficits?', type: 'boolean' },
    { id: 'gcs', questionText: 'Current GCS', type: 'number' },
  ], 

  mmpData: {
    snapshot: "Diagnosis requires multifocal clinical CNS events PLUS encephalopathy, with MRI showing large, poorly defined demyelinating lesions. High-dose IV Methylprednisolone (30 mg/kg/day) is the 1st line therapy. Monitor for signs of raised intracranial pressure and autonomic instability. ADEM is typically monophasic; recurring events suggest Multiple Sclerosis (MS) or MOGAD.",
    stages: [
      {
        label: "Stage 1: Step 0 - Diagnostic Workup",
        shortLabel: "Diagnosis",
        color: "blue",
        cards: [
          {
            title: "Neuroimaging & CSF [DR]",
            threshold: "IMMEDIATE MRI",
            orders: [
              "MRI Brain & Spine (with Contrast): Look for large (> 1-2 cm), diffuse, poorly demarcated lesions in white matter. Grey matter (thalamus/basal ganglia) can be involved.",
              "Lumbar Puncture: CSF usually shows mild pleocytosis and elevated protein. Oligoclonal bands are typically ABSENT (if present, consider MS).",
              "Exclude Infection: PCR for HSV, VZV, Enterovirus, and Mycoplasma pneumoniae.",
              "Antibody Testing: Send Serum and CSF for MOG-IgG and AQP4-IgG."
            ]
          },
          {
            title: "Nursing: Neurological Baseline [NS]",
            isCritical: true,
            nursing: [
              "Baseline GCS and full cranial nerve assessment.",
              "Hourly Neuro-checks for the first 24 hours.",
              "Bladder Scan: Monitor for neurogenic bladder (urinary retention)."
            ]
          }
        ]
      },
      {
        label: "Stage 2: 1st Line Immunomodulation",
        shortLabel: "Steroid Pulse",
        color: "amber",
        cards: [
          {
            title: "High-Dose Steroid Protocol [DR]",
            threshold: "FIRST-LINE",
            calculator: {
              id: "adem-steroid-calc",
              title: "Pulse Steroid Dosing Calculator"
            },
            orders: [
              "Methylprednisolone (IV): 30 mg/kg/day (Maximum 1000 mg) for 3 to 5 days.",
              "Administration: Give over 60 minutes once daily.",
              "Oral Taper: Follow with oral Prednisolone (1-2 mg/kg/day) tapering over 4 to 6 weeks to prevent relapse."
            ],
            prescriptions: [
              {
                drug: "Methylprednisolone (IV Pulse)",
                dose: "30 mg/kg/day",
                route: "IV",
                frequency: "Daily x 3-5 days",
                calculation: (w) => `${Math.min(w * 30, 1000).toFixed(0)} mg`,
                notes: "Monitor for hypertension, hyperglycemia, and bradycardia during infusion."
              }
            ]
          },
          {
            title: "2nd Line: IVIG or Plasmapheresis",
            threshold: "IF NO RESPONSE TO STEROIDS",
            orders: [
              "Indication: Failure to improve after 48-72 hours of high-dose steroids.",
              "IVIG: 2 g/kg total dose over 2-5 days.",
              "Plasmapheresis: Consider for fulminant cases or steroid-refractory ADEM."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Complications & Triggers",
        shortLabel: "Complications",
        color: "red",
        cards: [
          {
            title: "Senior Triggers [!]",
            isCritical: true,
            triggers: [
              "IF GCS drops by ≥ 2 points or new focal deficits develop.",
              "IF Signs of Raised ICP (Bradycardia, Hypertension, Pupil changes) occur.",
              "IF Seizures or Status Epilepticus develops.",
              "IF Vision loss or severe optic neuritis is detected."
            ]
          },
          {
            title: "Supportive Care [NS]",
            nursing: [
              "Gastric Protection: Give H2 blocker or PPI while on high-dose steroids.",
              "Bowel/Bladder: Maintain strict I/O and use stool softeners.",
              "Skin: Frequent repositioning if paralyzed or bed-bound."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data) => {
    const gcs = Number(data.gcs);
    if (gcs < 12 || !data.encephalopathy) return { level: 'critical', details: ["Severe ADEM: High risk for respiratory failure or brain herniation. PICU required."] };
    if (data.multifocal) return { level: 'severe', details: ["Established ADEM: Initiate steroid pulse and close monitoring."] };
    return { level: 'moderate', details: ["Suspected ADEM: Obtain MRI and initiate workup."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Neurological symptoms are improving or stable for > 48 hours.",
    "Patient has completed 3-5 day IV pulse and is tolerating oral taper.",
    "Bowel and bladder function has returned to baseline.",
    "Rehabilitation (Physio/Speech/OT) plan initiated.",
    "Follow-up MRI scheduled in 3 months to ensure resolution of lesions."
  ],
  getRedFlags: [
    "Sudden dropping GCS",
    "New-onset focal weakness",
    "Seizures",
    "Visual loss (Optic Neuritis)",
    "Severe unrelenting headache"
  ],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "IPMSSG: International Pediatric MS Study Group Criteria", url: "https://pubmed.ncbi.nlm.nih.gov/23267035/" },
    { title: "RCH Melbourne: ADEM Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/ADEM/" }
  ],
};
