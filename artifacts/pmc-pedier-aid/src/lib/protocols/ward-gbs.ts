import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Guillain-Barré Syndrome (GBS)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: Brighton Criteria and RCH Melbourne.
 */
export const wardGbsProtocol: DiseaseProtocol = {
  id: 'ward-gbs-master',
  name: 'Guillain-Barré Syndrome Master Pathway',
  system: 'Neurological System',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Guillain-Barré Syndrome (GBS) is an acute, immune-mediated polyradiculoneuropathy presenting with progressive, symmetrical, ascending weakness and absent/diminished deep tendon reflexes. Management centers on early recognition of respiratory failure and autonomic dysfunction.',
  image: {
    url: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Peripheral nervous system management"
  },
  questions: [
    { id: 'weight', questionText: 'Current Body Weight', type: 'number', unit: 'kg' },
    { id: 'breath_count', questionText: 'Single Breath Count (1 deep breath)', type: 'number', unit: 'count' },
    { id: 'bulbar', questionText: 'Bulbar Signs (Drooling/Muffled Voice)?', type: 'boolean' },
    { id: 'reflexes', questionText: 'Areflexia or Hyporeflexia present?', type: 'boolean' },
  ], 

  mmpData: {
    snapshot: "Management centers on detecting impending respiratory failure using clinical markers (Single Breath Count and Bulbar Signs) and monitoring for autonomic instability (HR/BP swings). IVIG (2g/kg) is the first-line immunomodulation. Avoid corticosteroids. Early involvement of physical and occupational therapy is essential for long-term recovery.",
    stages: [
      {
        label: "Stage 1: Diagnosis & Monitoring",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Step 0: Diagnostic Confirmation [DR]",
            threshold: "IMMEDIATE",
            orders: [
              "Brighton Criteria: Progressive weakness in >1 limb, decreased/absent reflexes, albuminocytological dissociation (High protein/Normal cell count in CSF).",
              "Lumbar Puncture: Protein may be normal in the first week; re-test in 7-10 days if initial LP is inconclusive.",
              "Electrophysiology (EMG/NCS): Useful to confirm demyelination vs. axonal variants (AIDP vs. AMAN).",
              "Neuroimaging: MRI Spine with contrast can show root enhancement (GBS mimic exclusion)."
            ]
          },
          {
            title: "Clinical Respiratory Screening [NS]",
            isCritical: true,
            calculator: {
              id: "gbs-clinical-monitor",
              title: "GBS Clinical Respiratory Tracker"
            },
            nursing: [
              "Single Breath Count (SBC): Ask patient to take a deep breath and count out loud. If count < 20, they are at risk. If < 15, consult Senior/ICU.",
              "Bulbar Assessment: Monitor for drooling, inability to clear secretions, or 'hot potato' voice.",
              "Respiratory Effort: Watch for Paradoxical Breathing (chest moves in, abdomen moves out) or accessory muscle use.",
              "Frequency: Perform SBC and Bulbar checks every 2 to 4 hours."
            ]
          }
        ]
      },
      {
        label: "Stage 2: 1st Line Immunomodulation",
        shortLabel: "IVIG Therapy",
        color: "amber",
        cards: [
          {
            title: "IVIG Infusion Protocol [DR]",
            threshold: "START WITHIN 2 WEEKS",
            orders: [
              "Total Dose: 2 g/kg administered over 2 to 5 days (e.g., 0.4 g/kg daily x 5 days).",
              "Alternative (Severe): Plasmapheresis (PE) if IVIG is ineffective or patient is rapidly deteriorating.",
              "Note: Do NOT combine IVIG and Plasmapheresis simultaneously."
            ],
            prescriptions: [
              {
                drug: "IVIG (Intravenous Immunoglobulin)",
                dose: "0.4 g/kg/day",
                route: "IV Infusion",
                frequency: "Daily x 5 days",
                calculation: (w) => `${(w * 0.4).toFixed(1)} grams`,
                notes: "Pre-medicate with Paracetamol/Diphenhydramine. Monitor for aseptic meningitis or renal failure."
              }
            ]
          },
          {
            title: "Autonomic Dysfunction Monitoring [NS]",
            isCritical: true,
            nursing: [
              "Continuous ECG telemetry: Monitor for arrhythmias (bradycardia/tachycardia).",
              "Frequent Blood Pressure checks: Watch for wide swings (Hypertension/Hypotension).",
              "Bladder & Bowel: Monitor for urinary retention (catheterize if needed) and ileus."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Supportive Care & Triggers",
        shortLabel: "Critical Care",
        color: "red",
        cards: [
          {
            title: "Senior Triggers for ICU [!]",
            isCritical: true,
            triggers: [
              "IF Single Breath Count is < 15 or rapidly declining.",
              "IF Patient has bulbar weakness (difficulty swallowing/clearing secretions).",
              "IF Severe autonomic instability (significant arrhythmias or BP swings).",
              "IF Weakness is progressing rapidly (e.g. bed-bound within 24 hours)."
            ]
          },
          {
            title: "DVT Prophylaxis & Pain",
            orders: [
              "Pain Management: Gabapentin or Amitriptyline for neuropathic pain. Opiates may be needed but monitor for ileus.",
              "DVT Prophylaxis: Essential for non-ambulatory patients (LMWH and compression stockings)."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data) => {
    const sbc = Number(data.breath_count);
    if (sbc < 15 || data.bulbar) return { level: 'critical', details: ["High-risk GBS: Impending respiratory failure or bulbar weakness. ICU transfer required."] };
    if (sbc < 20) return { level: 'severe', details: ["Established GBS: Requires IVIG and Q2H SBC monitoring."] };
    return { level: 'moderate', details: ["Suspected GBS: Observe closely and obtain serial SBCs."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Weakness has plateaued or is improving (no progression for > 48 hours).",
    "SBC stable > 20 with normal respiratory effort.",
    "Swallowing is safe and autonomic function is stable.",
    "Rehabilitation plan (Physiotherapy/OT) is in place.",
    "No evidence of IVIG-related complications (aseptic meningitis/thrombosis)."
  ],
  getRedFlags: [
    "Inability to lift head off pillow (neck flexor weakness)",
    "Muffled voice or difficulty swallowing (Bulbar signs)",
    "Significant BP swings",
    "Restlessness (early sign of CO2 retention)",
    "Absent cough reflex"
  ],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "LANCET: Guillain-Barré syndrome", url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(11)60654-X/fulltext" },
    { title: "RCH Melbourne: Guillain-Barré Syndrome", url: "https://www.rch.org.au/clinicalguide/guideline_index/Guillain_Barre_Syndrome/" }
  ],
};
