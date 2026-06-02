import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Septic Arthritis & Osteomyelitis
 * MASTER MANAGEMENT PATHWAY
 */
export const wardSepticArthritisOsteoProtocol: DiseaseProtocol = {
  id: 'ward-septic-arthritis-osteo',
  name: 'Septic Arthritis & Osteomyelitis',
  system: 'Infectious Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Septic Arthritis is a purulent infection of a joint space, while Acute Hematogenous Osteomyelitis is an infection of the bone, typically occurring via bloodstream seeding. Both conditions represent orthopedic emergencies requiring rapid diagnosis and source control to prevent permanent joint destruction or bone necrosis. This exhaustive directive covers joint aspiration, surgical drainage criteria, and the Intravenous-to-Oral antibiotic transition strategy.',
  image: {
    url: "https://images.unsplash.com/photo-1579154235602-3c2c2aa5d72f?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Bone and Joint Infection Management"
  },
  questions: [],

  mmpData: {
    snapshot: "Management hinges on (1) Early source control through joint aspiration (Septic Arthritis) or surgical debridement if an abscess is present, (2) Initiation of high-dose intravenous antibiotics targeting Staphylococcus aureus and Kingella kingae, and (3) Serial monitoring of C-Reactive Protein to guide the transition to oral therapy. Clinicians must maintain a high index of suspicion for Methicillin-Resistant Staphylococcus aureus in toxic-appearing patients and monitor for complications like Deep Vein Thrombosis in cases of pelvic or severe staphylococcal osteomyelitis.",
    stages: [
      {
        label: "Admission & Source Control",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Blood Culture: MANDATORY before the first dose of antibiotics (positive in 40-50% of cases).",
              "Baseline Inflammatory Markers: Complete Blood Count, C-Reactive Protein, and Erythrocyte Sedimentation Rate. The Erythrocyte Sedimentation Rate is critical for long-term tracking of resolution.",
              "Joint Aspiration (Arthrocentesis): GOLD STANDARD for suspected septic arthritis. Send fluid for Gram Stain, Culture, and Cell Count (White Blood Cell count > 50,000/mm³ with > 75% neutrophils is highly suggestive).",
              "Bone Biopsy: Consider if the diagnosis of osteomyelitis is unclear or if the patient is failing to respond to therapy."
            ]
          },
          {
            title: "Nursing & Monitoring [NS]",
            nursing: [
              "Pain Assessment: Monitor pain levels every 4 hours using age-appropriate scales.",
              "Limb Assessment: Monitor the affected limb for increasing redness, swelling, and warmth every 4 hours.",
              "Range of Motion: Document the ability to move the joint or bear weight at least once per shift.",
              "Vital Signs: Heart Rate and Temperature monitoring every 4 hours.",
              "Neurovascular Check: Check pulses, sensation, and capillary refill distal to the site of infection every 8 hours."
            ]
          },
          {
            title: "Radiology Strategy",
            orders: [
              "Plain Radiography (X-ray): Mandatory to exclude fracture or malignancy (Note: early Osteomyelitis may show no X-ray changes for 10-14 days).",
              "Ultrasound: Highly effective for detecting joint effusion and subperiosteal abscesses.",
              "Magnetic Resonance Imaging (MRI) with Contrast: The most sensitive modality for early Osteomyelitis and defining soft tissue involvement."
            ]
          }
        ]
      },
      {
        label: "Empiric Intravenous Therapy",
        shortLabel: "Management",
        color: "amber",
        cards: [
          {
            title: "1st-Line Strategy (Age > 3 Months)",
            orders: [
              "Target Pathogens: Staphylococcus aureus (Methicillin-Susceptible) and Kingella kingae (common in toddlers).",
              "Switch to targeted therapy once culture results and sensitivities are available."
            ],
            prescriptions: [
              {
                drug: "Flucloxacillin",
                dose: "50 mg/kg",
                route: "Intravenous",
                frequency: "Every 6 hours",
                calculation: (w) => `${Math.min(50 * w, 2000).toFixed(0)} mg`,
                notes: "Target: Methicillin-Susceptible Staphylococcus aureus. Maximum 2 grams."
              },
              {
                drug: "Ceftriaxone",
                dose: "80 mg/kg",
                route: "Intravenous",
                frequency: "Once daily",
                calculation: (w) => `${Math.min(80 * w, 2000).toFixed(0)} mg`,
                notes: "Add if Gram-negative risk is high or the patient is unimmunized (Haemophilus influenzae type b risk)."
              }
            ]
          },
          {
            title: "Methicillin-Resistant S. aureus (MRSA) / Toxic Regimen",
            threshold: "HIGH RISK / SEVERE TOXICITY",
            orders: [
              "Consider if the patient is septic, has multi-focal involvement, or a history of prior Methicillin-Resistant Staphylococcus aureus infection."
            ],
            prescriptions: [
              {
                drug: "Clindamycin",
                dose: "13 mg/kg",
                route: "Intravenous",
                frequency: "Every 8 hours",
                calculation: (w) => `${Math.min(13 * w, 900).toFixed(0)} mg`,
                notes: "Excellent bone penetration. Check local resistance patterns."
              },
              {
                drug: "Vancomycin",
                dose: "15 mg/kg",
                route: "Intravenous",
                frequency: "Every 6 hours",
                calculation: (w) => `${(15 * w).toFixed(0)} mg`,
                notes: "Monitor trough levels (Target 10-15 mcg/mL)."
              }
            ]
          }
        ]
      },
      {
        label: "Monitoring & Surgical Triggers",
        shortLabel: "Monitoring",
        color: "red",
        cards: [
          {
            title: "Response Tracking",
            orders: [
              "Fever Curve: Clinical improvement is expected within 48-72 hours of effective drainage and antibiotics.",
              "C-Reactive Protein Trend: Repeat C-Reactive Protein every 48 hours. A 50% decrease from the peak is a strong predictor of successful therapy."
            ]
          },
          {
            title: "Surgical Intervention Triggers",
            threshold: "FAILURE TO IMPROVE AT 48 HOURS",
            isCritical: true,
            orders: [
              "1. Persistent Fever or worsening pain despite appropriate Intravenous antibiotics.",
              "2. Rising or stagnant C-Reactive Protein after 48 hours.",
              "3. Ultrasound evidence of an enlarging subperiosteal abscess or persistent joint effusion.",
              "ACTION: Urgent Orthopedic consultation for joint washout or bone debridement."
            ]
          },
          {
            title: "Complication: Deep Vein Thrombosis",
            threshold: "STAPHYLOCOCCUS AUREUS INFECTION",
            orders: [
              "Screen for Deep Vein Thrombosis, especially in pelvic osteomyelitis or if Panton-Valentine Leukocidin (PVL) positive Staphylococcus aureus is confirmed.",
              "Monitor for sudden limb swelling or respiratory distress (Pulmonary Embolism)."
            ]
          }
        ]
      },
      {
        label: "Oral Transition & Discharge",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Criteria for Oral Step-Down",
            threshold: "MANDATORY CHECKLIST",
            orders: [
              "1. Afebrile for at least 24-48 hours.",
              "2. C-Reactive Protein decreased by more than 30-50% from the peak value.",
              "3. Clinical improvement: Decreased swelling/tenderness and improved range of motion.",
              "4. Demonstrating the ability to tolerate high-dose oral medications."
            ]
          },
          {
            title: "Discharge Antibiotic Roadmap",
            orders: [
              "Septic Arthritis Duration: 2-3 weeks total course.",
              "Osteomyelitis Duration: 3-4 weeks minimum (up to 6 weeks for Methicillin-Resistant Staphylococcus aureus or complex cases).",
              "Note: Oral doses are often higher than standard maintenance doses for bone penetration."
            ],
            prescriptions: [
              {
                drug: "Cephalexin",
                dose: "33 mg/kg",
                route: "Oral",
                frequency: "Every 8 hours",
                calculation: (w) => `${(33 * w).toFixed(0)} mg`,
                notes: "High-dose oral step-down for Methicillin-Susceptible Staphylococcus aureus."
              },
              {
                drug: "Clindamycin",
                dose: "10 mg/kg",
                route: "Oral",
                frequency: "Every 8 hours",
                calculation: (w) => `${(10 * w).toFixed(0)} mg`,
                notes: "Step-down for Methicillin-Resistant Staphylococcus aureus or Penicillin-allergic patients."
              }
            ]
          },
          {
            title: "Follow-up Directive",
            orders: [
              "Week 1 post-discharge: Repeat C-Reactive Protein and Erythrocyte Sedimentation Rate with clinical review.",
              "End of therapy: Final clinical review; repeat X-ray (if Osteomyelitis) to ensure no pathological fracture or bone sequestration."
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
    { title: "IDSA/PIDS Guideline: Acute Bacterial Arthritis in Children (2021)", url: "https://academic.oup.com/cid/article/73/11/e4490/6321614" },
    { title: "IDSA/PIDS Guideline: Acute Hematogenous Osteomyelitis (2021)", url: "https://academic.oup.com/cid/article/73/11/e4450/6321615" }
  ],
};
