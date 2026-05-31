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
  description: 'Senior directive for eye infections: Differentiating pre- vs post-septal, CT triggers, and multidisciplinary surgical thresholds.',
  image: {
    url: "https://images.unsplash.com/photo-1579154235602-3c2c2aa5d72f?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Orbital Infection Management"
  },
  questions: [],

  mmpData: {
    stages: [
      {
        label: "Admission & Critical Differentiation",
        shortLabel: "Admission & Critical Differentiation",
        color: "blue",
        cards: [
          {
            title: "Pre-septal vs. Orbital Differentiation",
            threshold: "MANDATORY BEDSIDE EXAM",
            isCritical: true,
            instructions: [
              "Orbital Cellulitis (POST-SEPTAL) Signs: 1. Proptosis, 2. Ophthalmoplegia (pain/restriction with eye movement), 3. Decreased visual acuity, 4. Afferent Pupillary Defect (APD).",
              "Pre-septal Cellulitis: Eyelid edema and erythema ONLY. Eye movements and vision are NORMAL."
            ]
          },
          {
            title: "Initial Workup",
            instructions: [
              "1. CBC and CRP: Baseline inflammatory markers.",
              "2. Blood Culture: REQUIRED (though yield is low).",
              "3. Eye Swab: ONLY if there is purulent discharge.",
              "4. Vision Assessment: Baseline visual acuity, color vision (red desaturation), and pupillary response."
            ]
          },
          {
            title: "Radiology: CT Trigger",
            threshold: "IF ORBITAL INVOLVEMENT SUSPECTED",
            isCritical: true,
            instructions: [
              "Indication for CT (Orbits/Sinuses with Contrast): 1. Inability to fully examine the eye, 2. Proptosis/Ophthalmoplegia, 3. Vision loss/APD, 4. No improvement or worsening after 24-48h of IV Rx, 5. CNS signs."
            ]
          },
          {
            title: "Empiric IV Rx (Pre-septal) (PREFERRED REGIMEN: DUAL THERAPY)",
            threshold: "UNCOMPLICATED",
            instructions: [
              "Target: S. aureus, S. pyogenes, S. pneumoniae."
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
                dose: "50 mg/kg",
                route: "IV",
                frequency: "Once daily",
                calculation: (w) => `${Math.min(50 * w, 2000).toFixed(0)} mg`,
                notes: "Add if Hib risk or severe."
              }
            ]
          },
          {
            title: "Empiric IV Rx (Orbital / Sinusitis)",
            threshold: "COMPLICATED / SINUS SOURCE",
            instructions: [
              "Target: Respiratory flora plus anaerobes from sinuses."
            ],
            prescriptions: [
              {
                drug: "Tazocin (Piperacillin/Tazobactam)",
                dose: "90 mg/kg",
                route: "IV",
                frequency: "Every 6 hours",
                calculation: (w) => `${(90 * w).toFixed(0)} mg`,
                notes: "Broad-spectrum including anaerobes. Max 4.5g."
              }
            ]
          }
        ]
      },
      {
        label: "Monitoring & Escalation",
        shortLabel: "Monitoring & Escalation",
        color: "amber",
        cards: [
          {
            title: "Serial Eye Exams",
            threshold: "EVERY 4-6 HOURS",
            instructions: [
              "Assess: Visual acuity, Eye movements, and Proptosis.",
              "Deterioration in vision or new ophthalmoplegia requires URGENT CT and Surgical review."
            ]
          },
          {
            title: "Multidisciplinary Consults",
            instructions: [
              "Ophthalmology: Required for all cases of suspected Orbital Cellulitis.",
              "ENT: Required if CT shows significant sinusitis or subperiosteal abscess (SPA)."
            ]
          }
        ]
      },
      {
        label: "Surgical Complications",
        shortLabel: "Surgical Complications",
        color: "red",
        cards: [
          {
            title: "Complication: SUBPERIOSTEAL ABSCESS (SPA)",
            threshold: "CT CONFIRMED",
            isCritical: true,
            instructions: [
              "Surgical Drainage Trigger: 1. Age > 9 years (higher risk of anaerobes), 2. Frontal sinus involvement, 3. Large abscess (>1cm), 4. Failure to improve on IV Rx within 48h."
            ]
          },
          {
            title: "Complication: CAVERNOUS SINUS THROMBOSIS",
            threshold: "BILATERAL SIGNS / CNS DISTRESS",
            isCritical: true,
            instructions: [
              "Signs: Bilateral proptosis, rapid progression, CN III, IV, VI palsies.",
              "Action: Urgent MRI/MRV and upgrade to Meropenem + Vancomycin."
            ]
          }
        ]
      },
      {
        label: "Step-down & Discharge",
        shortLabel: "Step-down & Discharge",
        color: "emerald",
        cards: [
          {
            title: "Criteria for Oral Step-down",
            instructions: [
              "1. Afebrile for > 24 hours.",
              "2. Improving eyelid edema/erythema.",
              "3. Normal eye movements and vision (for orbital cases).",
              "4. Decreasing inflammatory markers."
            ]
          },
          {
            title: "Discharge Roadmap",
            threshold: "TOTAL COURSE 10-14 DAYS",
            instructions: [
              "Pre-septal: 7-10 days total.",
              "Orbital: 10-14 days minimum (up to 3 weeks if significant sinusitis/SPA)."
            ],
            prescriptions: [
              {
                drug: "Amoxicillin-Clavulanate (Augmentin)",
                dose: "45 mg/kg (of Amox)",
                route: "PO",
                frequency: "Every 12 hours",
                calculation: (w) => `${(45 * w).toFixed(0)} mg`,
                notes: "Standard oral step-down."
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
