import type { DiseaseProtocol, FormData, Severity } from './types';

/**
 * Pediatric Ward: Stevens-Johnson Syndrome (SJS) / Toxic Epidermal Necrolysis (TEN)
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Derived from: British Association of Dermatologists (BAD) Guidelines, SCORTEN, and RCH Melbourne
 */
export const wardSjsTenProtocol: DiseaseProtocol = {
  id: 'ward-sjs-ten',
  name: 'SJS / TEN Master Pathway',
  system: 'Dermatology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Stevens-Johnson Syndrome (SJS) and Toxic Epidermal Necrolysis (TEN) are severe, life-threatening mucocutaneous reactions characterized by extensive keratinocyte apoptosis and detachment of the epidermis. This exhaustive directive covers the SCORTEN severity assessment, immediate withdrawal of triggering agents, and multi-disciplinary supportive care including ophthalmology and wound management.',
  image: {
    url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Assessment of epidermal detachment and mucosal involvement"
  },
  questions: [
    { id: 'weight', questionText: 'Current Patient Weight', type: 'number', unit: 'kg' },
    { id: 'tbsa', questionText: 'Total Body Surface Area involved (%)', type: 'number' },
    { id: 'mucosalSites', questionText: 'Number of mucosal sites involved (Eyes, Mouth, Genitals)?', type: 'number' },
    { id: 'suspectedDrug', questionText: 'New drug started in the last 4-28 days?', type: 'boolean' },
  ],

  mmpData: {
    snapshot: "SJS/TEN management centers on (1) Immediate identification and withdrawal of the suspected culprit drug (the most critical factor for survival), (2) 'Burn-unit' style supportive care focusing on temperature regulation and fluid resuscitation, and (3) Proactive prevention of long-term sequelae, particularly ocular scarring and permanent vision loss. Clinicians must prioritize skin protection and avoid unnecessary adhesive dressings.",
    stages: [
      {
        label: "Stage 1: Classification & Immediate Actions",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Severity Classification",
            threshold: "BASED ON SKIN DETACHMENT",
            orders: [
              "SJS: Detachment involves less than 10% of Total Body Surface Area.",
              "SJS/TEN Overlap: Detachment involves 10% to 30% of Total Body Surface Area.",
              "TEN: Detachment involves greater than 30% of Total Body Surface Area.",
              "Nikolsky Sign: Positive (slight pressure on the skin causes the epidermis to slide off)."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Drug Withdrawal: STOP ALL non-essential medications started in the last month immediately.",
              "Laboratory Workup: Complete Blood Count, Urea, Electrolytes, Creatinine, Liver Function Tests, and Glucose.",
              "Ophthalmology Consult: MANDATORY within 2 hours to prevent corneal scarring.",
              "Skin Biopsy: For definitive diagnosis (frozen section if available to rule out SSSS).",
              "Culture: Skin swabs and Blood Cultures to screen for secondary infection."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Supportive Care & Resuscitation",
        shortLabel: "Supportive Care",
        color: "amber",
        cards: [
          {
            title: "Fluid & Nutrition Strategy",
            threshold: "CRITICAL STABILIZATION",
            orders: [
              "Resuscitation: If Total Body Surface Area > 10%, calculate fluids using the Parkland formula (Isotonic Saline).",
              "Maintenance: Use Isotonic Saline with 5% Dextrose. Ensure Urine Output remains > 1.0 mL/kg/hour.",
              "Nutrition: High-protein, high-calorie diet; consider Nasogastric feeding early if oral mucosa is severely involved."
            ]
          },
          {
            title: "Nursing: Skin & Mucosal Care [NS]",
            nursing: [
              "Environment: Maintain room temperature at 28-30°C to prevent hypothermia due to loss of skin barrier.",
              "Wound Care: Do NOT debride blisters. Apply Non-adherent dressings (e.g., Mepitel or Vaseline gauze). Avoid all adhesives.",
              "Mouth Care: Cleanse with sterile water or saline every 2-4 hours. Apply soft paraffin to lips.",
              "Eye Care: Saline irrigation every 2 hours; apply prescribed antibiotic/steroid eye drops as per Ophthalmology."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Specific Immunomodulation [!]",
        shortLabel: "Therapeutics",
        color: "red",
        cards: [
          {
            title: "Immune Response Suppression",
            threshold: "IF PROGRESSING RAPIDLY",
            isCritical: true,
            orders: [
              "PREFERRED REGIMEN: MONOTHERAPY for secondary infection coverage (if required).",
              "Intravenous Immunoglobulin (IVIG): Consider dose of 1 g/kg/day for 3 days.",
              "Cyclosporine: Emerging evidence suggests 3-5 mg/kg/day may reduce mortality.",
              "Corticosteroids: Use remains controversial; if used, give high-dose Pulse Methylprednisolone early, but avoid long-term use due to infection risk."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Recovery & Long-term Follow-up",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Sequelae Prevention",
            orders: [
              "Dermatology Follow-up: Regular review for pigmentary changes and scarring.",
              "Ophthalmology Roadmap: Long-term surveillance for dry eyes, trichiasis, or symblepharon.",
              "Drug Allergy Passport: MANDATORY. Provide the family with a clear list of the suspected drug and all chemically related compounds to be avoided for life."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: (data: FormData): Severity => {
    if ((data.tbsa && data.tbsa > 10) || (data.mucosalSites && data.mucosalSites >= 2)) {
      return { level: 'critical', details: ["TEN or severe SJS - High risk for Multi-organ failure and sepsis."] };
    }
    return { level: 'severe', details: ["SJS with mucosal involvement - Requires intensive supportive care."] };
  },
  getManagement: () => [],
  getDisposition: () => [
    "CULPRIT DRUG identified and permanently stopped.",
    "Hemodynamically stable with adequate Urine Output.",
    "Ophthalmology review completed and eye care plan in place.",
    "Pain well-controlled on systemic analgesia.",
    "Wound care plan established with non-adherent dressings."
  ],
  getRedFlags: () => ["Rapidly spreading rash", "Hypotension or Tachycardia (Sepsis)", "Decreased vision or severe eye pain", "Difficulty breathing (Tracheal involvement)"],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "BAD Guideline for management of SJS/TEN", url: "https://onlinelibrary.wiley.com/doi/10.1111/bjd.17128" },
    { title: "RCH Melbourne: SJS and TEN", url: "https://www.rch.org.au/clinicalguide/guideline_index/Stevens-Johnson_Syndrome_and_Toxic_Epidermal_Necrolysis/" }
  ]
};
