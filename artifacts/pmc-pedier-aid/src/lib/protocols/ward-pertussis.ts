import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Pertussis (Whooping Cough)
 * MASTER MANAGEMENT PATHWAY (MMP) - REFINED
 * Focus: Exhaustive complication triggers and management directives.
 */
export const wardPertussisProtocol: DiseaseProtocol = {
  id: 'ward-pertussis-management',
  name: 'Pertussis Master Pathway',
  system: 'Respiratory System',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Full-cycle management: Isolation, apnea monitoring, and exhaustive complication protocols for pneumonia, encephalopathy, and pulmonary hypertension.',
  image: {
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Infant respiratory monitoring"
  },
  questions: [], 

  mmpData: {
    stages: [
      {
        label: "Admission & Initial Directive",
        shortLabel: "Admission & Initial Directive",
        color: "blue",
        cards: [
          {
            title: "Baseline Clinical Baseline",
            instructions: [
              "1. Droplet Isolation: MANDATORY for 5 days of macrolide therapy.",
              "2. Initial Labs: PCR (Nasopharyngeal), CBC with Diff (Absolute Lymphocyte Count), and baseline Na+ (SIADH check).",
              "3. Baseline CXR: To rule out pre-existing collapse or pneumonia."
            ]
          },
          {
            title: "1st-Line Macrolide Selection",
            instructions: [
              "Goal: Eradicate B. pertussis from nasopharynx to prevent spread.",
              "Note: Antibiotics do not alter clinical course if started late in the paroxysmal phase."
            ],
            prescriptions: [
              {
                drug: "Azithromycin",
                dose: "10 mg/kg (Day 1), then 5 mg/kg",
                route: "PO / IV",
                frequency: "Once daily",
                calculation: (w) => `Day 1: ${(w * 10).toFixed(0)} mg, then ${(w * 5).toFixed(0)} mg`,
                notes: "5-day course. Safest for infants < 1 month."
              }
            ]
          }
        ]
      },
      {
        label: "Monitoring & Pivot Triggers",
        shortLabel: "Monitoring & Pivot Triggers",
        color: "amber",
        cards: [
          {
            title: "Standard Monitoring Roadmap",
            instructions: [
              "1. Continuous SpO2/HR Monitoring (Mandatory for all < 6 months).",
              "2. Paroxysm Tracking: Log frequency and length of apneic episodes.",
              "3. Feed Tolerance: Monitor for post-tussive emesis and hydration status."
            ]
          },
          {
            title: "When to Suspect Treatment Failure",
            threshold: "CLINICAL DETERIORATION",
            instructions: [
              "1. New-onset high fever (> 38.5°C) - (Viral pertussis is usually afebrile).",
              "2. Sustained tachypnea/distress BETWEEN paroxysms.",
              "3. Rapidly rising WBC (> 30k-50k absolute lymphocytes)."
            ]
          }
        ]
      },
      {
        label: "Complication Management Modules",
        shortLabel: "Complication Management Modules",
        color: "red",
        cards: [
          {
            title: "Complication 1: SECONDARY PNEUMONIA",
            threshold: "NEW FEVER / FOCAL FINDINGS",
            isCritical: true,
            instructions: [
              "Triggers: Sustained distress between coughs, high fever, or new focal crackles.",
              "Radiology: Repeat CXR to look for focal consolidation.",
              "Management: Broad-spectrum coverage required (Targeting S. pneumoniae / S. aureus)."
            ],
            prescriptions: [
              {
                drug: "Ceftriaxone (IV)",
                dose: "80 mg/kg",
                route: "IV",
                frequency: "Once daily",
                calculation: (w) => `${Math.min(80 * w, 2000).toFixed(0)} mg`,
                notes: "Targeting secondary bacterial pathogens."
              }
            ]
          },
          {
            title: "Complication 2: SEIZURES / ENCEPHALOPATHY",
            threshold: "NEUROLOGICAL CHANGES",
            isCritical: true,
            instructions: [
              "Triggers: Generalized/focal seizures, altered mental status, or extreme lethargy.",
              "Management: Stabilize airway (NRP/PALS), check glucose/electrolytes, and consult Pediatric Neurology.",
              "Radiology: Urgent Brain Imaging (CT/MRI) only if focal or non-recovering."
            ]
          },
          {
            title: "Complication 3: MALIGNANT PERTUSSIS / PHTN",
            threshold: "WBC > 50,000 / HYPOXEMIA",
            isCritical: true,
            instructions: [
              "Definition: Hyperleukocytosis causing pulmonary hypertension (PHTN) and cardiac failure.",
              "Action: URGENT PICU TRANSFER.",
              "Therapy: Involve senior team for Leukoreduction / Exchange Transfusion consideration."
            ]
          }
        ]
      },
      {
        label: "Recovery & Discharge",
        shortLabel: "Recovery & Discharge",
        color: "emerald",
        cards: [
          {
            title: "Discharge Safety Metrics",
            instructions: [
              "1. No apnea or cyanosis for > 48 hours.",
              "2. Completion of 5-day Azithromycin course.",
              "3. Oral intake > 75% baseline and stable/gaining weight."
            ]
          },
          {
            title: "Public Health & Follow-up",
            instructions: [
              "1. Prophylaxis: All household contacts require Azithromycin regardless of vaccine status.",
              "2. Follow-up: Clinical review in 48-72h by primary pediatrician.",
              "3. Vaccination: Ensure DTaP/Tdap series is initiated/updated."
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
    { title: "CDC: Pertussis Clinical Management", url: "https://www.cdc.gov/pertussis/clinical/index.html" },
    { title: "AAP Red Book: Pertussis Guidance", url: "https://publications.aap.org/redbook" },
    { title: "RCH Melbourne: Pertussis Handbook", url: "https://www.rch.org.au/clinicalguide/guideline_index/Pertussis/" }
  ],
};
