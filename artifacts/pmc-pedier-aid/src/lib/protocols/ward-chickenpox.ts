import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Chickenpox (Varicella Zoster Virus)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: AAP Red Book, CDC Guidelines, and RCH Melbourne
 */
export const wardChickenpoxProtocol: DiseaseProtocol = {
  id: 'ward-chickenpox',
  name: 'Chickenpox Master Pathway',
  system: 'Infectious Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Chickenpox is a highly contagious primary infection caused by the Varicella Zoster Virus (VZV), characterized by a generalized pruritic vesicular rash in various stages of development. While usually self-limiting in healthy children, it can lead to severe complications such as secondary bacterial sepsis, pneumonia, or encephalitis. This exhaustive directive covers the identification of high-risk patients requiring Intravenous Acyclovir and strict isolation protocols.',
  image: {
    url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Assessment of 'dewdrop on a rose petal' vesicles and secondary infection"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'immunocompromised', questionText: 'Is the patient immunocompromised (Chemotherapy, Steroids, HIV)?', type: 'boolean' },
    { id: 'neonatal', questionText: 'Neonatal Varicella (Onset in first 2 weeks of life)?', type: 'boolean' },
    { id: 'severeComplication', questionText: 'Signs of Pneumonia, Encephalitis, or severe Hemorrhagic rash?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "Varicella management focuses on (1) Strict Airborne and Contact precautions to prevent hospital-acquired outbreaks, (2) Vigilant monitoring for secondary bacterial infections (Staphylococcus/Streptococcus) which are the leading cause of hospitalization, and (3) Rapid initiation of Intravenous Acyclovir in specifically defined high-risk cohorts. Clinicians must strictly avoid Ibuprofen due to its association with necrotizing fasciitis in Varicella patients.",
    stages: [
      {
        label: "Stage 1: Admission & Isolation",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Transmission-Based Precautions",
            threshold: "MANDATORY UPON SUSPICION",
            orders: [
              "Isolation Level: AIRBORNE and CONTACT precautions.",
              "Room Placement: Negative pressure room (if available) or private room with door closed.",
              "Staff Safety: Only immune staff (vaccinated or previous infection) should care for the patient.",
              "Duration: Until all lesions are crusted and dry (typically 5-7 days from rash onset)."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Diagnostic Verification: Clinical diagnosis based on 'asynchronous' vesicles (spots at different stages).",
              "Viral PCR: Swab the base of a fresh vesicle for Varicella Zoster Virus Polymerase Chain Reaction if the diagnosis is in doubt or in severe cases.",
              "Complete Blood Count: Monitor for neutropenia or signs of secondary bacterial sepsis.",
              "Inflammatory Markers: C-Reactive Protein (Elevation suggests secondary bacterial infection; viral Varicella typically has low CRP)."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Antiviral Strategy (Acyclovir)",
        shortLabel: "Therapeutics",
        color: "red",
        cards: [
          {
            title: "Indications for Intravenous Acyclovir",
            threshold: "HIGH-RISK CRITERIA",
            isCritical: true,
            orders: [
              "1. Immunocompromised patients (including those on high-dose steroids).",
              "2. Neonatal Varicella (maternal onset 5 days before to 2 days after delivery).",
              "3. Severe complications: Varicella Pneumonia, Encephalitis, or Cerebellar Ataxia.",
              "4. Hemorrhagic Varicella: Characterized by bleeding into the vesicles.",
              "5. Severe disease in patients on long-term salicylates (Aspirin)."
            ],
            prescriptions: [
              {
                drug: "Acyclovir",
                dose: "10-20 mg/kg (or 500 mg/m²)",
                route: "Intravenous",
                frequency: "Every 8 hours",
                calculation: (w) => `${(w * 15).toFixed(0)} mg`,
                notes: "PREFERRED REGIMEN: MONOTHERAPY. Maintain high fluid intake to prevent renal crystal nephropathy."
              }
            ]
          },
          {
            title: "Oral Antiviral Considerations",
            threshold: "MODERATE RISK",
            orders: [
              "Consider Oral Acyclovir (20 mg/kg four times daily) for: Healthy children over age 12, those with chronic skin/lung disease, or secondary household cases (often more severe).",
              "Timing: Must be started within 24 hours of rash onset to be effective."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Supportive & Complication Watch",
        shortLabel: "Monitoring",
        color: "amber",
        cards: [
          {
            title: "Nursing: Secondary Infection Screen [NS]",
            nursing: [
              "Skin Check: Hourly/Shift-based check for spreading erythema, warmth, or fluctuance around vesicles (Suspected Cellulitis or Abscess).",
              "Respiratory Check: Monitor for tachypnea, cough, or hypoxia (Suspected Varicella Pneumonia).",
              "Pain Management: Use Paracetamol. Strictly AVOID Ibuprofen and other Non-Steroidal Anti-Inflammatory Drugs (NSAIDs) due to risk of Necrotizing Fasciitis.",
              "Skin Comfort: Apply calamine lotion or cool compresses. Ensure fingernails are cut short."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Post-Exposure & Discharge",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Contact Management",
            orders: [
              "Vulnerable Contacts: Identify exposed immunocompromised patients or pregnant women in the ward.",
              "Prophylaxis: Consider Varicella Zoster Immunoglobulin (VZIG) within 96 hours to 10 days for high-risk exposed individuals."
            ]
          },
          {
            title: "Discharge Criteria",
            orders: [
              "Patient is afebrile and all lesions are crusted over.",
              "No signs of secondary bacterial infection.",
              "If on Intravenous Acyclovir: Completing a minimum 7-day course (may transition to oral for completion)."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.immunocompromised === true || data.neonatal === true || data.severeComplication === true) {
      return { level: 'critical', details: ["High-risk Varicella - Immediate Intravenous Acyclovir and monitoring required."] };
    }
    return { level: 'moderate', details: ["Stable Chickenpox - Monitor for secondary infection."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Isolation requirements clearly communicated.",
    "Parent understands the strictly NO IBUPROFEN rule.",
    "Appropriate antiviral therapy initiated (if indicated).",
    "Signs of secondary bacterial infection explained to caregivers."
  ],
  getRedFlags: () => ["Rapidly spreading skin redness", "Difficulty breathing", "Altered level of consciousness or severe ataxia", "Severe abdominal pain (can herald visceral dissemination)"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "AAP Red Book: Varicella-Zoster Virus", url: "https://publications.aap.org/redbook" },
    { title: "RCH Melbourne: Chickenpox Clinical Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/Chickenpox_Varicella/" }
  ]
};
