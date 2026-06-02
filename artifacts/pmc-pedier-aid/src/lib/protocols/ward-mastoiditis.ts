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
  description: 'Acute Mastoiditis is an inflammatory process of the mastoid air cells of the temporal bone, most commonly occurring as a complication of acute otitis media. This exhaustive directive covers CT imaging triggers, surgical intervention criteria, and the stepwise escalation of intravenous antibiotic therapy.',
  image: {
    url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Mastoid process assessment and surgery"
  },
  questions: [], 

  mmpData: {
    snapshot: "Management focuses on (1) Immediate stabilization with high-dose intravenous antibiotics covering Streptococcus pneumoniae and Streptococcus pyogenes, (2) Urgent Ear, Nose, and Throat (ENT) consultation for possible surgical drainage or myringotomy, and (3) Vigilant monitoring for intracranial complications (meningitis, brain abscess, sigmoid sinus thrombosis). Computed Tomography (CT) imaging is reserved for suspected complications or clinical failure after 48 hours of therapy.",
    stages: [
      {
        label: "Admission & 1st-Line Strategy",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Blood Culture: MANDATORY before first antibiotic dose to identify Streptococcus pneumoniae or Staphylococcus aureus.",
              "Ear Swab: Perform if the Tympanic Membrane is perforated or if myringotomy is executed.",
              "Baseline Inflammatory Markers: Complete Blood Count (CBC) and C-Reactive Protein (CRP).",
              "Urgent Ear, Nose, and Throat (ENT) Consultation: Required for all cases to assess the need for myringotomy or drainage."
            ]
          },
          {
            title: "Nursing & Monitoring [NS]",
            nursing: [
              "Vital Signs: Heart Rate, Respiratory Rate, and Temperature every 4 hours.",
              "Pain Assessment: Monitor and document pain levels using age-appropriate scales every 4 hours.",
              "Ear Inspection: Monitor for increasing redness, fluctuance, or displacement of the pinna (auricle).",
              "Neurological Check: Assess for cranial nerve palsies or changes in mental status every 8 hours."
            ]
          },
          {
            title: "1st-Line Option A (Preferred: Dual Therapy)",
            threshold: "SEVERE PAIN / SYSTEMICALLY UNWELL",
            orders: [
              "Target Pathogens: Streptococcus pneumoniae, Streptococcus pyogenes, and Staphylococcus aureus.",
              "Combination therapy ensures coverage for resistant strains."
            ],
            prescriptions: [
              {
                drug: "Ceftriaxone",
                dose: "80 mg/kg",
                route: "Intravenous",
                frequency: "Once daily",
                calculation: (w) => `${Math.min(80 * w, 2000).toFixed(0)} mg`,
                notes: "Primary Gram-negative and Pneumococcal cover."
              },
              {
                drug: "Oxacillin",
                dose: "50 mg/kg",
                route: "Intravenous",
                frequency: "Every 6 hours",
                calculation: (w) => `${Math.min(50 * w, 2000).toFixed(0)} mg`,
                notes: "Anti-staphylococcal coverage. Maximum 2 grams."
              }
            ]
          }
        ]
      },
      {
        label: "Monitoring & Radiology Triggers",
        shortLabel: "Monitoring",
        color: "amber",
        cards: [
          {
            title: "Radiology Directive (CT Mastoids)",
            threshold: "IF COMPLICATION SUSPECTED",
            isCritical: true,
            orders: [
              "Perform Computed Tomography (CT) of the Head and Mastoids with Contrast ONLY if:",
              "1. Focal Deficit: Cranial nerve palsy (especially Facial Nerve) or limb weakness.",
              "2. Central Nervous System Signs: Bulging fontanelle, neck stiffness, or depressed Glasgow Coma Scale (GCS).",
              "3. Abscess Risk: Rapidly increasing fluctuance behind the ear.",
              "4. Clinical Failure: Persistent fever after 24-48 hours of correct Intravenous therapy."
            ]
          },
          {
            title: "Response Tracking",
            orders: [
              "Fever Curve: Expect improvement within 24-48 hours.",
              "Ear Examination: Resolution of auricle protrusion (Pinna displacement).",
              "Pain Management: Scheduled analgesia is mandatory; do not rely on 'as needed' orders."
            ]
          }
        ]
      },
      {
        label: "Treatment Failure & 2nd-Line Upgrade",
        shortLabel: "Escalation",
        color: "red",
        cards: [
          {
            title: "2nd-Line Directive (Preferred: Dual Therapy)",
            threshold: "FAILURE TO IMPROVE OR COMPLICATED",
            isCritical: true,
            orders: [
              "Indications: Suspected Pseudomonas (chronic cases), intracranial extension, or failure of 1st-line therapy.",
              "Piperacillin-Tazobactam provides superior Gram-negative and anaerobic coverage."
            ],
            prescriptions: [
              {
                drug: "Piperacillin-Tazobactam",
                dose: "90 mg/kg",
                route: "Intravenous",
                frequency: "Every 6 hours",
                calculation: (w) => `${Math.min(90 * w, 4500).toFixed(0)} mg`,
                notes: "Maximum 4.5 grams. Covers Pseudomonas and anaerobes."
              },
              {
                drug: "Vancomycin",
                dose: "15 mg/kg",
                route: "Intravenous",
                frequency: "Every 6 hours",
                calculation: (w) => `${(15 * w).toFixed(0)} mg`,
                notes: "Add if MRSA or resistant Streptococcus pneumoniae is confirmed."
              }
            ]
          },
          {
            title: "Surgical Options & Indications",
            threshold: "ENT DIRECTIVE",
            orders: [
              "1. Myringotomy ± Tympanostomy Tube: Mandatory if persistent middle ear effusion.",
              "2. Incision and Drainage: If subperiosteal abscess is present.",
              "3. Cortical Mastoidectomy: Reserved for failure of medical therapy or extensive coalescence/abscess."
            ]
          }
        ]
      },
      {
        label: "Completion & Discharge",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Transition to Oral Step-Down",
            threshold: "AFEBRILE 24H + CLINICALLY STABLE",
            orders: [
              "Total Duration: 14-21 days (Intravenous + Oral).",
              "Courses up to 4 weeks if intracranial complications were present."
            ],
            prescriptions: [
              {
                drug: "Amoxicillin-Clavulanate",
                dose: "45 mg/kg (of Amoxicillin)",
                route: "Oral",
                frequency: "Every 12 hours",
                calculation: (w) => `${(45 * w).toFixed(0)} mg`,
                notes: "High-dose roadmap for bone penetration."
              }
            ]
          },
          {
            title: "Follow-up Mandate",
            orders: [
              "Ear, Nose, and Throat (ENT) Review: Within 1 week of discharge.",
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
