import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Acute Mastoiditis
 * FULL MASTER SENIOR DOCTOR MANAGEMENT PATHWAY
 * Derived from: RCH Melbourne, NICE, and AAP Guidelines
 * Adjusted for local formulary: Ceftriaxone, Oxacillin, Augmentin IV, Tazocin.
 */
export const wardMastoiditisProtocol: DiseaseProtocol = {
  id: 'ward-mastoiditis',
  name: 'Mastoiditis Master Pathway',
  system: 'Infectious Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Senior directive for mastoid infection: CT imaging triggers, surgical intervention options, and stepwise antibiotic strategy.',
  image: {
    url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Mastoid process assessment and surgery"
  },
  questions: [], 

  mmpData: {
    stages: [
      {
        label: "Admission & 1st-Line Strategy",
        shortLabel: "Admission & 1st-Line Strategy",
        color: "blue",
        cards: [
          {
            title: "Mandatory Admission Workup",
            instructions: [
              "1. Blood Culture: REQUIRED before first antibiotic (Identify S. pneumoniae/S. aureus).",
              "2. Ear Swab: If TM is perforated or if myringotomy is performed.",
              "3. Inflammatory Markers: Baseline CBC and CRP.",
              "4. ENT Consult: URGENT for all cases to assess for drainage/myringotomy."
            ]
          },
          {
            title: "1st-Line Option A (PREFERRED REGIMEN: DUAL THERAPY)",
            threshold: "SEVERE PAIN / SYSTEMICALLY UNWELL",
            instructions: [
              "Target Pathogens: S. pneumoniae, S. pyogenes, and S. aureus.",
              "Combination therapy ensures coverage for resistant strains."
            ],
            prescriptions: [
              {
                drug: "Ceftriaxone (IV)",
                dose: "80 mg/kg",
                route: "IV",
                frequency: "Once daily",
                calculation: (w) => `${Math.min(80 * w, 2000).toFixed(0)} mg`,
                notes: "Primary Gram-negative and Pneumococcal cover."
              },
              {
                drug: "Oxacillin (IV)",
                dose: "50 mg/kg",
                route: "IV",
                frequency: "Every 6 hours",
                calculation: (w) => `${(50 * w).toFixed(0)} mg`,
                notes: "Anti-staphylococcal coverage. Max 2g."
              }
            ]
          },
          {
            title: "1st-Line Option B (PREFERRED REGIMEN: MONOTHERAPY)",
            threshold: "STABLE PATIENT / MILD-MODERATE",
            instructions: [
              "High-dose Amoxicillin component is essential for middle ear penetration."
            ],
            prescriptions: [
              {
                drug: "Amoxicillin-Clavulanate (Augmentin)",
                dose: "30-50 mg/kg (of Amox)",
                route: "IV",
                frequency: "Every 8 hours",
                calculation: (w) => `${(40 * w).toFixed(0)} mg`,
                notes: "Valid alternative for stable inpatient management."
              }
            ]
          }
        ]
      },
      {
        label: "Monitoring & Radiology Triggers",
        shortLabel: "Monitoring & Radiology Triggers",
        color: "amber",
        cards: [
          {
            title: "Radiology Directive (CT Mastoids)",
            threshold: "IF COMPLICATION SUSPECTED",
            isCritical: true,
            instructions: [
              "Perform CT Head/Mastoids with Contrast ONLY if:",
              "1. Focal Deficit: Cranial nerve palsy (especially CN VII/Facial) or limb weakness.",
              "2. CNS Signs: Bulging fontanelle, neck stiffness, or depressed GCS.",
              "3. Abscess Risk: Rapidly increasing fluctuance behind the ear.",
              "4. Clinical Failure: Persistent fever after 24-48h of correct IV therapy."
            ]
          },
          {
            title: "Response Tracking",
            instructions: [
              "Fever Curve: Expect improvement within 24-48h.",
              "Ear Check: Resolution of auricle protrusion (Pinna displacement).",
              "Pain: Scheduled analgesia is mandatory."
            ]
          }
        ]
      },
      {
        label: "Treatment Failure & 2nd-Line Upgrade",
        shortLabel: "Treatment Failure & 2nd-Line Upgrade",
        color: "red",
        cards: [
          {
            title: "2nd-Line Directive (PREFERRED REGIMEN: DUAL THERAPY)",
            threshold: "FAILURE TO IMPROVE OR COMPLICATED",
            isCritical: true,
            instructions: [
              "Indications: Suspected Pseudomonas (chronic cases), intracranial extension, or failure of 1st-line.",
              "Note: Tazocin provides superior Gram-negative and anaerobic coverage."
            ],
            prescriptions: [
              {
                drug: "Tazocin (Piperacillin-Tazobactam)",
                dose: "90 mg/kg",
                route: "IV",
                frequency: "Every 6 hours",
                calculation: (w) => `${(90 * w).toFixed(0)} mg`,
                notes: "Max 4.5g. Covers Pseudomonas and anaerobes."
              },
              {
                drug: "Vancomycin (IV)",
                dose: "15 mg/kg",
                route: "IV",
                frequency: "Every 6 hours",
                calculation: (w) => `${(15 * w).toFixed(0)} mg`,
                notes: "Add if MRSA or resistant S. pneumoniae confirmed."
              }
            ]
          },
          {
            title: "Surgical Options & Indications",
            threshold: "ENT DIRECTIVE",
            instructions: [
              "1. Myringotomy ± Tympanostomy Tube: Mandatory if persistent middle ear effusion.",
              "2. Incision and Drainage: If subperiosteal abscess is present.",
              "3. Cortical Mastoidectomy: Reserved for failure of medical therapy or extensive coalescence/abscess."
            ]
          }
        ]
      },
      {
        label: "Completion & Discharge",
        shortLabel: "Completion & Discharge",
        color: "emerald",
        cards: [
          {
            title: "Transition to Oral Step-Down",
            threshold: "AFEBRILE 24H + CLINICALLY STABLE",
            instructions: [
              "Total Duration: 14-21 days (IV + PO).",
              "Note: Courses up to 4 weeks if intracranial complications were present."
            ],
            prescriptions: [
              {
                drug: "Amoxicillin-Clavulanate (Augmentin)",
                dose: "45 mg/kg (of Amox)",
                route: "PO",
                frequency: "Every 12 hours",
                calculation: (w) => `${(45 * w).toFixed(0)} mg`,
                notes: "High-dose roadmap for bone penetration."
              }
            ]
          },
          {
            title: "Follow-up Mandate",
            instructions: [
              "ENT Review: Within 1 week of discharge.",
              "Hearing Screen: Audiometry review within 4 weeks of recovery."
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
    { title: "NICE: Acute Otitis Media - Mastoiditis", url: "https://cks.nice.org.uk/topics/otitis-media-acute/" },
    { title: "RCH Melbourne: Acute Mastoiditis Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/Acute_Mastoiditis/" },
    { title: "AAP Red Book: Pneumococcal and Staphylococcal Infections", url: "https://publications.aap.org/redbook" }
  ],
};
