import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Staphylococcal Scalded Skin Syndrome (SSSS)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: British Association of Dermatologists (BAD) Guidelines, AAP, and RCH Melbourne
 */
export const wardSsssProtocol: DiseaseProtocol = {
  id: 'ward-ssss',
  name: 'SSSS Master Pathway',
  system: 'Dermatology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Staphylococcal Scalded Skin Syndrome (SSSS), also known as Ritter disease, is a toxin-mediated epidermolytic condition caused by exfoliative toxins from Staphylococcus aureus. It is characterized by widespread erythema and painful, superficial blistering with subsequent desquamation, primarily affecting neonates and young children. This exhaustive directive covers diagnostic verification (Nikolsky sign), fluid and electrolyte management, and targeted intravenous antimicrobial therapy.',
  image: {
    url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Assessment of superficial blistering and periorificial crusting"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'tbsa', questionText: 'Total Body Surface Area of erythema/denudation (%)', type: 'number' },
    { id: 'reducedIntake', questionText: 'Poor oral intake or signs of dehydration?', type: 'boolean' },
    { id: 'toxicAppearing', questionText: 'Toxic appearing or hemodynamically unstable?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "SSSS management focuses on (1) Eradicating the source of toxin production with appropriate intravenous antibiotics, (2) Meticulous fluid and electrolyte management to compensate for increased insensible losses through denuded skin, and (3) Minimizing skin trauma and secondary infection. Unlike Stevens-Johnson Syndrome, SSSS is superficial and typically heals without scarring, but the acute phase requires 'burn-like' supportive vigilance.",
    stages: [
      {
        label: "Stage 1: Diagnosis & Source Search",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Clinical Hallmark Verification",
            threshold: "TYPICAL IN INFANTS < 5 YEARS",
            orders: [
              "Erythema: Initial diffuse, 'sunburn-like' redness, often starting periorificially (mouth, nose, eyes).",
              "Blistering: Flaccid, thin-walled bullae that rupture easily, leaving a moist red base.",
              "Nikolsky Sign: Positive (slight friction causes the epidermis to slide off).",
              "Mucosal Sparing: Critically, the oral and genital mucosa are usually spared (unlike Stevens-Johnson Syndrome)."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Identify the Focus: Swab potential source sites (Umibilicus in neonates, Nasopharynx, Conjunctiva, or any focal skin infection).",
              "Blood Cultures: MANDATORY in all cases (though often negative in children, as the condition is toxin-mediated).",
              "Laboratory Workup: Complete Blood Count, Urea, Electrolytes, and Creatinine (monitor for dehydration-induced renal strain).",
              "Skin Swab: Send for Gram Stain and Culture to identify Staphylococcus aureus and its sensitivities."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Resuscitation & Antimicrobials",
        shortLabel: "Management",
        color: "red",
        cards: [
          {
            title: "Intravenous Antibiotic Protocol",
            threshold: "START IMMEDIATELY",
            isCritical: true,
            orders: [
              "PREFERRED REGIMEN: DUAL THERAPY to cover Staphylococcus aureus and suppress toxin production.",
              "Target: Penicillinase-resistant Staphylococcal coverage.",
              "Note: Switch to Methicillin-Resistant Staphylococcus aureus (MRSA) coverage if the patient fails to respond or if local prevalence is high."
            ],
            prescriptions: [
              {
                drug: "Flucloxacillin",
                dose: "50 mg/kg",
                route: "Intravenous",
                frequency: "Every 6 hours",
                calculation: (w) => `${Math.min(w * 50, 2000).toFixed(0)} mg`,
                notes: "Maximum 2 grams. Transition to oral once clinically improving and afebrile."
              },
              {
                drug: "Clindamycin",
                dose: "10 mg/kg",
                route: "Intravenous",
                frequency: "Every 8 hours",
                calculation: (w) => `${(w * 10).toFixed(0)} mg`,
                notes: "Consider adding to suppress toxin production in severe or rapidly progressing cases."
              }
            ]
          },
          {
            title: "Fluid Titration Guide",
            threshold: "COMPENSATE FOR SKIN LOSS",
            orders: [
              "Calculation: Maintenance + Replacement for insensible losses (increase maintenance by 20-50% if denudation is extensive).",
              "Target Urine Output: Maintain > 1.0 mL/kg/hour.",
              "Electrolyte Checks: Repeat Urea and Electrolytes every 24 hours until skin starts to dry."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Nursing & Skin Integrity [NS]",
        shortLabel: "Nursing Care",
        color: "amber",
        cards: [
          {
            title: "Limb & Skin Protection",
            nursing: [
              "Handling: Use 'Minimal Handling' technique. Use silk or soft cotton sheets.",
              "Topical Therapy: Apply sterile White Soft Paraffin (Vaseline) or Liquid Paraffin frequently to soothe and protect denuded areas.",
              "Avoid Adhesives: Strictly NO adhesive tapes or dressings on the skin. Use tubular gauze for securing lines.",
              "Pain Management: Assess pain every 4 hours; prioritize Paracetamol or Morphine if required (avoid NSAIDs if renal function is impaired)."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Desquamation & Recovery",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Healing Phase",
            orders: [
              "Oral Step-Down: Switch to Oral Cephalexin or Flucloxacillin once the skin is no longer moist and the patient is afebrile.",
              "Duration: Total antibiotic course usually 7-10 days.",
              "Parent Education: Reassure that the skin will peel ('flake off') and heal completely within 2 weeks without scarring."
            ]
          },
          {
            title: "Follow-up",
            orders: [
              "Review in 1 week to ensure complete skin re-epithelialization and no secondary impetigo."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if (data.toxicAppearing === true || (data.tbsa && data.tbsa > 30)) {
      return { level: 'critical', details: ["Extensive denudation or sepsis risk - Requires high-dependency monitoring."] };
    }
    if (data.reducedIntake === true) {
      return { level: 'severe', details: ["Risk of significant dehydration and electrolyte imbalance."] };
    }
    return { level: 'moderate', details: ["Stable Staphylococcal Scalded Skin Syndrome."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "Appropriate Intravenous antibiotics initiated.",
    "Hemodynamically stable with improving oral intake.",
    "Pain controlled with oral analgesia.",
    "Skin denudation localized or starting to dry.",
    "Parent understands 'Minimal Handling' and skin care plan."
  ],
  getRedFlags: () => ["Rapidly worsening redness", "Fever not responding to antibiotics at 48 hours", "Hypotension", "Irritability or lethargy"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "StatPearls: Staphylococcal Scalded Skin Syndrome", url: "https://www.ncbi.nlm.nih.gov/books/NBK441884/" },
    { title: "RCH Melbourne: SSSS Clinical Guideline", url: "https://www.rch.org.au/clinicalguide/guideline_index/Staphylococcal_Scalded_Skin_Syndrome/" }
  ]
};
