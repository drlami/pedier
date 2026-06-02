import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Orbital & Periorbital Cellulitis
 * MASTER MANAGEMENT PATHWAY
 */
export const wardOrbitalPeriorbitalCellulitisProtocol: DiseaseProtocol = {
  id: 'ward-orbital-periorbital-cellulitis',
  name: 'Orbital & Periorbital Cellulitis',
  system: 'Infectious Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Periorbital (Pre-septal) Cellulitis is an infection of the tissues anterior to the orbital septum, while Orbital (Post-septal) Cellulitis is a more serious infection of the contents of the orbit posterior to the septum. This exhaustive directive covers the critical differentiation between these entities, Computed Tomography imaging triggers, and multidisciplinary surgical thresholds.',
  image: {
    url: "https://images.unsplash.com/photo-1579154235602-3c2c2aa5d72f?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Orbital Infection Management"
  },
  questions: [],

  mmpData: {
    snapshot: "The critical management priority is the rapid differentiation between pre-septal and post-septal infection through meticulous bedside examination (assessing for proptosis, ophthalmoplegia, and visual acuity). Orbital cellulitis requires aggressive intravenous antibiotic therapy, urgent ophthalmology consultation, and a low threshold for Computed Tomography (CT) imaging and surgical intervention if a subperiosteal abscess or vision-threatening complications are suspected.",
    stages: [
      {
        label: "Admission & Critical Differentiation",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Pre-septal vs. Orbital Differentiation",
            threshold: "MANDATORY BEDSIDE EXAM",
            isCritical: true,
            orders: [
              "Orbital Cellulitis (Post-Septal) Signs: 1. Proptosis (eye bulging), 2. Ophthalmoplegia (pain or restriction with eye movement), 3. Decreased Visual Acuity, 4. Afferent Pupillary Defect (APD).",
              "Pre-septal Cellulitis: Eyelid edema and redness ONLY. Eye movements and vision must be NORMAL."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Baseline Inflammatory Markers: Complete Blood Count (CBC) and C-Reactive Protein (CRP).",
              "Blood Culture: MANDATORY before starting Intravenous antibiotics.",
              "Eye Swab: Perform ONLY if purulent discharge is present.",
              "Urgent Ophthalmology Consultation: Required for all suspected cases of orbital involvement.",
              "Vision Baseline: Document visual acuity, color vision (red desaturation), and pupillary responses."
            ]
          },
          {
            title: "Nursing & Monitoring [NS]",
            nursing: [
              "Eye Assessment: Monitor for new proptosis or restriction of eye movement every 4 hours.",
              "Vision Check: Assess visual acuity (e.g., ability to read or recognize objects) every 4 hours.",
              "Vital Signs: Heart Rate, Respiratory Rate, and Temperature every 4 hours.",
              "Eyelid Tracking: Monitor and mark the extent of eyelid redness/edema every 12 hours."
            ]
          }
        ]
      },
      {
        label: "Management & Radiology Strategy",
        shortLabel: "Management",
        color: "amber",
        cards: [
          {
            title: "Radiology: CT Trigger",
            threshold: "IF ORBITAL INVOLVEMENT SUSPECTED",
            isCritical: true,
            orders: [
              "Perform Computed Tomography (CT) of the Orbits and Sinuses with Contrast if:",
              "1. Inability to fully examine the eye due to severe swelling.",
              "2. Presence of Proptosis or Ophthalmoplegia.",
              "3. Documented Vision Loss or Afferent Pupillary Defect.",
              "4. Failure to improve or clinical worsening after 24-48 hours of Intravenous therapy.",
              "5. Signs of Central Nervous System (CNS) involvement."
            ]
          },
          {
            title: "Intravenous Antibiotic Selection",
            orders: [
              "Target Pathogens: Staphylococcus aureus, Streptococcus pyogenes, and Streptococcus pneumoniae.",
              "For Sinusitis-related cases: Cover respiratory flora and anaerobes."
            ],
            prescriptions: [
              {
                drug: "Piperacillin-Tazobactam",
                dose: "90 mg/kg",
                route: "Intravenous",
                frequency: "Every 6 hours",
                calculation: (w) => `${Math.min(90 * w, 4500).toFixed(0)} mg`,
                notes: "Broad-spectrum coverage including anaerobes. Maximum 4.5 grams."
              },
              {
                drug: "Flucloxacillin",
                dose: "50 mg/kg",
                route: "Intravenous",
                frequency: "Every 6 hours",
                calculation: (w) => `${Math.min(50 * w, 2000).toFixed(0)} mg`,
                notes: "Alternative for uncomplicated pre-septal cellulitis."
              }
            ]
          }
        ]
      },
      {
        label: "Surgical Complications",
        shortLabel: "Escalation",
        color: "red",
        cards: [
          {
            title: "Complication: Subperiosteal Abscess (SPA)",
            threshold: "CT CONFIRMED",
            isCritical: true,
            orders: [
              "Surgical Drainage Triggers: 1. Age > 9 years, 2. Frontal sinus involvement, 3. Large abscess (>1 cm), 4. Failure to improve on Intravenous therapy within 48 hours.",
              "Urgent Ear, Nose, and Throat (ENT) Consultation: Required if significant sinusitis or abscess is present."
            ]
          },
          {
            title: "Complication: Cavernous Sinus Thrombosis",
            threshold: "BILATERAL SIGNS / CNS DISTRESS",
            isCritical: true,
            orders: [
              "Warning Signs: Bilateral proptosis, rapid progression, or cranial nerve III, IV, or VI palsies.",
              "Immediate Action: Urgent Magnetic Resonance Imaging (MRI/MRV) and upgrade antibiotics to Meropenem plus Vancomycin."
            ]
          }
        ]
      },
      {
        label: "Step-down & Discharge",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Criteria for Oral Step-down",
            orders: [
              "Afebrile for more than 24 hours.",
              "Improving eyelid edema and erythema.",
              "Normal eye movements and visual acuity (for orbital cases).",
              "Falling inflammatory markers (C-Reactive Protein)."
            ]
          },
          {
            title: "Discharge Roadmap",
            threshold: "TOTAL COURSE 10-21 DAYS",
            orders: [
              "Pre-septal Cellulitis: 7-10 days total duration.",
              "Orbital Cellulitis: 10-14 days minimum (up to 21 days if significant sinusitis or abscess was present)."
            ],
            prescriptions: [
              {
                drug: "Amoxicillin-Clavulanate",
                dose: "45 mg/kg (of Amoxicillin)",
                route: "Oral",
                frequency: "Every 12 hours",
                calculation: (w) => `${(45 * w).toFixed(0)} mg`,
                notes: "Standard high-dose oral step-down therapy."
              }
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
    { title: "AAP: Management of Periorbital and Orbital Cellulitis", url: "https://publications.aap.org" },
    { title: "RCH Melbourne: Periorbital and Orbital Cellulitis", url: "https://www.rch.org.au/clinicalguide/guideline_index/Periorbital_and_orbital_cellulitis/" }
  ],
};
