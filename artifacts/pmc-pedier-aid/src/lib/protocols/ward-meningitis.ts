import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Acute Bacterial Meningitis
 * FULL MASTER SENIOR DOCTOR MANAGEMENT PATHWAY
 * Derived from: IDSA, NICE [NG155], RCH Melbourne, and AAP Red Book
 */
export const wardMeningitisProtocol: DiseaseProtocol = {
  id: 'ward-meningitis-management',
  name: 'Meningitis Master Pathway',
  system: 'Infectious Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Meningitis is an acute inflammation of the protective membranes covering the brain and spinal cord, often caused by bacterial infection. This exhaustive consultant-level directive covers neuroimaging criteria, repeat LP thresholds, and complication surveillance.',
  image: {
    url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Neurological infection management"
  },
  questions: [], 

  mmpData: {
    stages: [
      {
        label: "Admission & 'No-Delay' Directive",
        shortLabel: "Admission & 'No-Delay' Directive",
        color: "red",
        cards: [
          {
            title: "Phase 1: Mandatory Admission Labs",
            instructions: [
              "1. Blood Culture: REQUIRED immediately. Obtain 1-3 mL (Highest yield).",
              "2. S. Glucose & Electrolytes: To calculate CSF/Serum ratio and SIADH baseline.",
              "3. Inflammatory Markers: CBC, CRP, and Procalcitonin.",
              "4. Mandatory Viral PCR: Nasopharyngeal swab (RSV/Flu/MPV)."
            ]
          },
          {
            title: "Indications for Pre-LP CT Head",
            threshold: "DO NOT ROUTINELY IMAGE",
            instructions: [
              "Perform CT Head before Lumbar Puncture ONLY if:",
              "1. Coma or Depressed Consciousness (GCS < 12).",
              "2. Focal Neurological Deficit (e.g. Cranial nerve palsy, limb weakness).",
              "3. Papilledema on fundoscopy (Sign of increased ICP).",
              "4. Recent Seizure: New onset focal seizure or prolonged generalized seizure.",
              "5. High Risk: Known CNS disease (Shunt, tumor, prior surgery)."
            ]
          },
          {
            title: "The 'No-Delay' Rule (PREFERRED REGIMEN: DUAL THERAPY)",
            threshold: "CRITICAL SAFETY DIRECTIVE",
            isCritical: true,
            instructions: [
              "PREFERRED REGIMEN: DUAL THERAPY to cover standard bacterial pathogens.",
              "1. If CT is indicated or LP is delayed for ANY reason: START Antibiotics and Dexamethasone IMMEDIATELY after Blood Cultures.",
              "2. Steroid Timing: Dexamethasone MUST be given before or with the first ABX dose (Ideally within 30-60 mins)."
            ],
            prescriptions: [
              {
                drug: "Ceftriaxone (IV)",
                dose: "100 mg/kg/day",
                route: "IV",
                frequency: "Divided Every 12 hours",
                calculation: (w) => `${Math.min(w * 50, 2000).toFixed(0)} mg`,
                notes: "Max 4g/day. Primary empiric choice."
              },
              {
                drug: "Vancomycin (IV)",
                dose: "60 mg/kg/day",
                route: "IV",
                frequency: "Divided Every 6 hours",
                calculation: (w) => `${(w * 15).toFixed(0)} mg`,
                notes: "Mandatory if S. pneumoniae is suspected."
              }
            ]
          }
        ]
      },
      {
        label: "Lumbar Puncture & Monitoring",
        shortLabel: "Lumbar Puncture & Monitoring",
        color: "blue",
        cards: [
          {
            title: "When to Repeat Lumbar Puncture",
            threshold: "SECOND LP INDICATIONS",
            instructions: [
              "Routine repeat LP is NOT indicated for most children. Repeat ONLY if:",
              "1. Neonatal GBS/GNR Meningitis: Repeat at 48h to document sterilization (Mandatory per AAP).",
              "2. Clinical Failure: No improvement or worsening after 48h of appropriate therapy.",
              "3. Penicillin-Resistant S. pneumoniae: To confirm sterilization if clinical response is slow.",
              "4. Persistent Fever: Unexplained fever > 72h with worsening neuro status."
            ]
          },
          {
            title: "Standard Monitoring Targets",
            instructions: [
              "1. GCS & Pupils: Every 2-4 hours for the first 48h.",
              "2. S. Sodium: Every 12-24h for 48h (SIADH Watch).",
              "3. Head Circumference: Daily in infants with open fontanelle."
            ]
          }
        ]
      },
      {
        label: "Complication Surveillance",
        shortLabel: "Complication Surveillance",
        color: "amber",
        cards: [
          {
            title: "Acute Complications: When to Suspect",
            threshold: "HIGH-DENSITY WATCHLIST",
            isCritical: true,
            instructions: [
              "1. Subdural Effusion: Suspect if persistent fever, bulging fontanelle, or new seizures (Image with US/MRI).",
              "2. Increased ICP / Herniation: Suspect if GCS drops, Cushing's Triad (HTN + Bradycardia), or pupil dilation.",
              "3. Cerebral Venous Thrombosis: Suspect if new focal deficit or refractory seizures.",
              "4. Brain Abscess: Suspect if Gram- bacilli or prolonged focal deficits."
            ]
          },
          {
            title: "Contact Prophylaxis Grid",
            threshold: "MANDATORY FOR HOUSEHOLD",
            instructions: [
              "N. meningitidis: Prophylaxis for household/close contacts within 24h of identification.",
              "H. influenzae (Hib): Prophylaxis if an unimmunized child < 4y is in the household.",
              "S. pneumoniae: Prophylaxis is NOT required for contacts."
            ],
            prescriptions: [
              {
                drug: "Rifampicin (Oral)",
                dose: "10 mg/kg (Meningitis) / 20 mg/kg (Hib)",
                route: "PO",
                frequency: "q12h for 2 days (Meningitis) / q24h for 4 days (Hib)",
                calculation: (w) => `${(w * 10).toFixed(0)} mg`,
                notes: "Warn contacts about orange discoloration of urine/tears."
              },
              {
                drug: "Ceftriaxone (IM)",
                dose: "125 mg (<12y) / 250 mg (>12y)",
                route: "IM",
                frequency: "Single Dose",
                calculation: (w) => w < 40 ? "125 mg" : "250 mg",
                notes: "Preferred for pregnant contacts."
              }
            ]
          }
        ]
      },
      {
        label: "Recovery & Hearing Screen",
        shortLabel: "Recovery & Hearing Screen",
        color: "emerald",
        cards: [
          {
            title: "Antibiotic Duration Roadmap",
            threshold: "DEFINITIVE THERAPY COURSE",
            instructions: [
              "1. UNCOMPLICATED Meningitis (from first sterile CSF/blood):",
              "   • N. meningitidis: 7 days total.",
              "   • H. influenzae (Hib): 7-10 days total.",
              "   • S. pneumoniae: 10-14 days total.",
              "   • GBS / Gram-negative bacilli: 14-21 days total.",
              "   • Listeria monocytogenes: 21 days total.",
              "2. COMPLICATED Meningitis (Abscess, Empyema, slow response):",
              "   • Brain Abscess / Subdural Empyema (Infected): 4-6 weeks total course.",
              "   • Sterile Subdural Effusion: Does NOT require extension of the standard course.",
              "   • Ventriculitis: 3 weeks minimum (or sterile CSF for 10 days)."
            ]
          },
          {
            title: "Hearing Test Directive",
            threshold: "NON-NEGOTIABLE",
            isCritical: true,
            instructions: [
              "1. Incidence: 10% of survivors develop sensorineural hearing loss.",
              "2. Schedule: Auditory Brainstem Response (ABR) MUST be performed prior to discharge or within 4 weeks."
            ]
          },
          {
            title: "Follow-up Schedule",
            instructions: [
              "Clinical Review: At 4-6 weeks for neuro-developmental assessment.",
              "Imaging resolution: Repeat MRI/CT only if complication (Abscess/Empyema) was present."
            ]
          }
        ]
      }
    ]
  },

  // ER Legacy
  calculateSeverity: () => ({ level: 'mild', details: [] }),
  getManagement: () => [],
  getDisposition: () => [],
  getRedFlags: () => [],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "IDSA Management of Bacterial Meningitis", url: "https://academic.oup.com/cid/article/39/9/1267/310793" },
    { title: "AAP Red Book: Chemoprophylaxis", url: "https://publications.aap.org/redbook" },
    { title: "NICE Guideline: Meningitis Prophylaxis", url: "https://www.nice.org.uk/guidance/ng155" }
  ],
};
