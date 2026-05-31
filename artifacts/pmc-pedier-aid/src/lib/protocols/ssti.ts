import type { DiseaseProtocol, FormData, Severity } from './types';

export const sstiProtocol: DiseaseProtocol = {
  id: 'ssti',
  name: 'Skin & Soft Tissue Infection (SSTI)',
  system: 'Infectious Diseases',
  description: 'Management of purulent and non-purulent skin and soft tissue infections, such as cellulitis and abscess.',
  image: {
    url: "https://picsum.photos/seed/ssti/600/400",
    hint: "skin infection"
  },
  questions: [
    { id: 'isPurulent', questionText: 'Is the infection purulent (an abscess, furuncle, or carbuncle)?', type: 'boolean' },
    { id: 'isFluctuant', questionText: 'Is there a fluctuant or drainable collection on exam?', type: 'boolean' },
    { id: 'hasSystemicSigns', questionText: 'Are there systemic signs of illness (fever, toxic appearance, hypotension)?', type: 'boolean' },
    { id: 'isExtensive', questionText: 'Is there extensive surrounding cellulitis?', type: 'boolean' },
    { id: 'location', questionText: 'Location of infection?', type: 'select', options: [
        { label: 'Trunk/Extremity', value: 'extremity' },
        { label: 'Face/Hand/Perineum', value: 'high_risk_area' },
    ]},
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    if (data.hasSystemicSigns) {
        details.push("Systemic signs present (fever, toxicity). Treat as severe infection.");
        return { level: 'severe', details };
    }
    if (data.isPurulent || data.isFluctuant) {
        details.push("Purulent SSTI (abscess) identified. Requires assessment for drainage.");
        if (data.isExtensive || data.location === 'high_risk_area') {
            details.push("Abscess is extensive or in a high-risk area.");
            return { level: 'moderate', details };
        }
        details.push("Simple abscess.");
        return { level: 'moderate', details };
    }
    // Non-purulent cellulitis
    details.push("Non-purulent cellulitis.");
    if (data.isExtensive || data.location === 'high_risk_area') {
        details.push("Cellulitis is extensive or in a high-risk area.");
        return { level: 'moderate', details };
    }
    return { level: 'mild', details };
  },
  getManagement: (severity, data) => {
    switch (severity.level) {
      case 'severe':
        return [{
          title: "Severe / Complicated SSTI Management",
          recommendations: [
            "Admit to hospital for parenteral antibiotics and surgical consultation.",
            "Start broad-spectrum IV antibiotics covering MRSA and anaerobes (e.g., Vancomycin + Piperacillin-Tazobactam or Meropenem).",
            "Perform urgent surgical debridement if necrotizing infection is suspected.",
            "Provide fluid resuscitation and hemodynamic support as needed for sepsis."
          ]
        }];
      case 'moderate':
        const recs: string[] = [];
        if (data.isPurulent) {
            recs.push("Incision and Drainage (I&D) is the primary treatment for abscesses. Obtain wound cultures.");
            recs.push("Antibiotics are indicated if there is significant surrounding cellulitis, systemic signs, or immunosuppression. Empiric coverage for MRSA (e.g., Clindamycin, TMP-SMX) is recommended.");
        } else { // Moderate non-purulent cellulitis
            recs.push("Mark borders of erythema to monitor for progression.");
            recs.push("Initiate IV or oral antibiotics depending on clinical status. Oral options include Clindamycin or TMP-SMX + Amoxicillin.");
        }
        recs.push("Admission should be considered for patients with extensive cellulitis, high-risk locations (face, hand), inability to tolerate oral medication, or failure of outpatient therapy.");
        return [{ title: "Moderate SSTI Management", recommendations: recs }];
      case 'mild':
        return [{
          title: "Mild SSTI (Uncomplicated Cellulitis) Management",
          recommendations: [
            "Mark borders of erythema.",
            "Initiate oral antibiotics. For non-purulent cellulitis, target streptococci (e.g., Cephalexin, Amoxicillin). If MRSA is a local concern, consider Clindamycin.",
            "Arrange for close follow-up in 24-48 hours.",
            "Educate on warm compresses and elevation."
          ]
        }];
      default:
        return [];
    }
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
      return ["Immediate admission to the hospital, likely to a surgical service and/or PICU."];
    }
    if (severity.level === 'moderate') {
      return ["Consider outpatient management after I&D if patient is well-appearing with reliable follow-up. Admit if there are systemic signs, extensive disease, high-risk location, or social concerns."];
    }
    return ["Discharge home on oral antibiotics with strict return precautions and arranged follow-up in 24-48 hours."];
  },
  getRedFlags: () => [
    "Pain out of proportion to exam findings (concern for necrotizing fasciitis)",
    "Signs of sepsis or toxic shock syndrome (hypotension, organ dysfunction)",
    "Rapidly spreading erythema despite antibiotics",
    "Development of crepitus, skin bullae, or necrosis",
    "Immunocompromised patient"
  ],
  getDrugDoses: () => [
    { drugName: "Cephalexin (oral)", dose: "25-50 mg/kg/day divided TID-QID", notes: "Good for typical non-purulent cellulitis (strep/MSSA)." },
    { drugName: "Clindamycin (oral)", dose: "30-40 mg/kg/day divided TID-QID", notes: "Good for strep and MRSA coverage." },
    { drugName: "TMP-SMX (oral)", dose: "8-12 mg/kg/day of trimethoprim component divided BID", notes: "Good for MRSA, but must be combined with another agent (e.g., Amoxicillin) for strep coverage." },
    { drugName: "Vancomycin (IV)", dose: "40-60 mg/kg/day divided q6-8h", notes: "For inpatient management of severe or complicated infections." },
  ],
  getReferences: () => [
    { title: "IDSA Clinical Practice Guideline for the Diagnosis and Management of Skin and Soft Tissue Infections", url: "https://academic.oup.com/cid/article/59/2/e10/2895443" }
  ],
};
