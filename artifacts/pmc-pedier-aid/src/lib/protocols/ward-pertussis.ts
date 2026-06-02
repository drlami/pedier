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
  description: 'Pertussis, or \"Whooping Cough,\" is a highly contagious respiratory tract infection caused by the bacterium Bordetella pertussis, characterized by paroxysms of coughing, inspiratory whoops, and post-tussive emesis. This exhaustive directive covers isolation protocols, apnea monitoring, and management of complications such as pneumonia, encephalopathy, and pulmonary hypertension.',
  image: {
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Infant respiratory monitoring"
  },
  questions: [], 

  mmpData: {
    snapshot: "Management in infants focuses on vigilant monitoring for life-threatening complications, including apnea, secondary pneumonia, and malignant pertussis (characterized by extreme leukocytosis and pulmonary hypertension). Early administration of macrolides is essential for public health eradication but has limited impact on the clinical paroxysmal phase. High-risk infants (less than 6 months old) require continuous cardiopulmonary monitoring and strict droplet isolation.",
    stages: [
      {
        label: "Admission & Initial Directive",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Droplet Isolation: MANDATORY for a minimum of 5 days of effective macrolide therapy.",
              "Nasopharyngeal Swab: For Bordetella pertussis Polymerase Chain Reaction (PCR) and Culture.",
              "Baseline Laboratory Screening: Complete Blood Count (CBC) with differential (note the Absolute Lymphocyte Count) and serum Sodium (to screen for SIADH).",
              "Baseline Chest X-Ray: Required to rule out pre-existing lung collapse or pneumonia."
            ]
          },
          {
            title: "Nursing & Monitoring [NS]",
            nursing: [
              "Cardiopulmonary Monitoring: Continuous Oxygen Saturation and Heart Rate monitoring is mandatory for all infants under 6 months of age.",
              "Paroxysm Log: Document the frequency, duration, and severity of coughing fits and any associated apnea or cyanosis.",
              "Hydration Monitoring: Track oral intake and document all episodes of post-tussive emesis (vomiting after coughing).",
              "Positioning: Maintain the infant in a semi-upright position during and after feeds to reduce aspiration risk."
            ]
          },
          {
            title: "1st-Line Macrolide Selection",
            orders: [
              "Goal: Eradicate Bordetella pertussis from the nasopharynx to prevent transmission.",
              "Azithromycin is the preferred agent, especially in infants under 1 month of age (lower risk of pyloric stenosis)."
            ],
            prescriptions: [
              {
                drug: "Azithromycin",
                dose: "10 mg/kg (Day 1), then 5 mg/kg",
                route: "Oral or Intravenous",
                frequency: "Once daily",
                calculation: (w) => `Day 1: ${(w * 10).toFixed(0)} mg, then ${(w * 5).toFixed(0)} mg`,
                notes: "Total 5-day course. Monitor for Gastrointestinal side effects."
              }
            ]
          }
        ]
      },
      {
        label: "Monitoring & Pivot Triggers",
        shortLabel: "Monitoring",
        color: "amber",
        cards: [
          {
            title: "When to Suspect Treatment Failure",
            threshold: "CLINICAL DETERIORATION",
            orders: [
              "Monitor for new-onset high fever (greater than 38.5°C) — primary pertussis is typically afebrile.",
              "Assess for sustained Respiratory Rate elevation (Tachypnea) or distress BETWEEN paroxysms.",
              "Follow White Blood Cell counts: A rapidly rising count (Absolute Lymphocyte Count > 30,000) is a major red flag."
            ]
          }
        ]
      },
      {
        label: "Complication Management Modules",
        shortLabel: "Complications",
        color: "red",
        cards: [
          {
            title: "Complication: Secondary Bacterial Pneumonia",
            threshold: "NEW FEVER / FOCAL FINDINGS",
            isCritical: true,
            orders: [
              "Triggers: New fever, focal lung crackles, or increased oxygen requirement between coughs.",
              "Action: Repeat Chest X-Ray and escalate to broad-spectrum Intravenous antibiotics targeting Streptococcus pneumoniae and Staphylococcus aureus."
            ],
            prescriptions: [
              {
                drug: "Ceftriaxone",
                dose: "80 mg/kg",
                route: "Intravenous",
                frequency: "Once daily",
                calculation: (w) => `${Math.min(80 * w, 2000).toFixed(0)} mg`,
                notes: "Empiric coverage for secondary bacterial pathogens."
              }
            ]
          },
          {
            title: "Complication: Pertussis Encephalopathy",
            threshold: "NEUROLOGICAL CHANGES",
            isCritical: true,
            orders: [
              "Triggers: New-onset seizures, altered mental status, or extreme lethargy.",
              "Action: Urgent check of Blood Glucose and Electrolytes; consult Pediatric Neurology.",
              "Radiology: Perform urgent Brain Computed Tomography (CT) or Magnetic Resonance Imaging (MRI) if focal signs are present."
            ]
          },
          {
            title: "Complication: Malignant Pertussis",
            threshold: "WBC > 50,000 / HYPOXEMIA",
            isCritical: true,
            orders: [
              "Warning: Hyperleukocytosis causing pulmonary hypertension and rapid cardiac failure.",
              "Action: IMMEDIATE Pediatric Intensive Care Unit (PICU) transfer.",
              "Senior Intervention: Consider urgent Leukoreduction or Exchange Transfusion."
            ]
          }
        ]
      },
      {
        label: "Recovery & Discharge",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Discharge Safety Metrics",
            orders: [
              "No episodes of apnea or cyanosis for more than 48 hours.",
              "Completion of the 5-day Azithromycin course.",
              "Consistent oral intake greater than 75% of baseline with stable weight."
            ]
          },
          {
            title: "Public Health & Follow-up",
            orders: [
              "Post-Exposure Prophylaxis: All household contacts require Azithromycin regardless of their vaccination status.",
              "Clinical Follow-up: Schedule a review with the primary pediatrician within 72 hours of discharge.",
              "Vaccination Update: Ensure the Pertussis vaccine series is initiated or updated prior to or shortly after discharge."
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
