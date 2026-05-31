import type { DiseaseProtocol, FormData, Severity } from './types';

export const cervicalLymphadenitisProtocol: DiseaseProtocol = {
  id: 'cervical-lymphadenitis',
  name: 'Cervical Lymphadenitis',
  system: 'Infectious Diseases',
  description: 'Evaluation and management of enlarged and inflamed neck lymph nodes in children.',
  image: {
    url: "https://picsum.photos/seed/cervical-lymphadenitis/600/400",
    hint: "swollen neck"
  },
  questions: [
    { id: 'nodeSize', questionText: 'Largest node size', type: 'number', unit: 'cm' },
    { id: 'isTender', questionText: 'Is the node tender?', type: 'boolean' },
    { id: 'isUnilateral', questionText: 'Is it unilateral?', type: 'boolean' },
    { id: 'hasErythema', questionText: 'Is there overlying erythema/warmth?', type: 'boolean' },
    { id: 'isFluctuant', questionText: 'Is the node fluctuant?', type: 'boolean', info: 'Feels like it has fluid inside.' },
    { id: 'hasFever', questionText: 'Is there a fever > 38°C (100.4°F)?', type: 'boolean' },
    { id: 'hasSoreThroat', questionText: 'Associated sore throat or pharyngitis?', type: 'boolean' },
    { id: 'hasDentalPain', questionText: 'Associated dental pain or caries?', type: 'boolean' },
    { id: 'hasCatScratch', questionText: 'History of cat scratch or exposure?', type: 'boolean' },
    { id: 'isToxic', questionText: 'Does the child appear toxic or unwell?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    
    // Severe criteria (abscess, toxicity, etc.)
    if (data.isFluctuant) {
        details.push("Fluctuance suggests abscess formation.");
        return { level: 'severe', details };
    }
    if (data.isToxic) {
        details.push("Toxic appearance requires immediate attention.");
        return { level: 'severe', details };
    }
    if (Number(data.nodeSize) > 4) {
        details.push("Large node size (>4cm) increases suspicion for significant infection.");
        return { level: 'severe', details };
    }

    // Moderate criteria (likely bacterial)
    const isLikelyBacterial = data.isUnilateral && data.isTender && Number(data.nodeSize) >= 2 && data.hasErythema;
    if (isLikelyBacterial) {
        if (data.isUnilateral) details.push("Unilateral node");
        if (data.isTender) details.push("Tender node");
        if (Number(data.nodeSize) >= 2) details.push("Node size >= 2cm");
        if (data.hasErythema) details.push("Overlying erythema/warmth");
        details.push("Features suggest bacterial lymphadenitis.");
        return { level: 'moderate', details };
    }

    // Mild criteria (likely reactive/viral)
    if (!data.isUnilateral && !data.isTender && Number(data.nodeSize) < 2) {
        details.push("Bilateral, non-tender, small nodes suggest reactive or viral cause.");
        return { level: 'mild', details };
    }
    
    details.push("Atypical features. Consider broad differential.");
    return { level: 'moderate', details };
  },
  getManagement: (severity, data) => {
    switch (severity.level) {
      case 'severe':
        return [{
          title: "Severe / Complicated Lymphadenitis Management",
          recommendations: [
            "Admit to hospital for IV antibiotics and monitoring.",
            "Obtain urgent ENT or surgery consultation for incision and drainage (I&D) if fluctuant.",
            "Obtain labs: CBC with differential, CRP, blood culture.",
            "Consider ultrasound to confirm abscess and define extent.",
            "Start broad-spectrum IV antibiotics (e.g., Vancomycin or Clindamycin plus Ceftriaxone or Unasyn) to cover MRSA, Strep pyogenes, and anaerobes.",
          ]
        }];
      case 'moderate':
        return [{
          title: "Uncomplicated Bacterial Lymphadenitis Management",
          recommendations: [
            "Initiate outpatient oral antibiotic therapy.",
            "First-line: Clindamycin or Amoxicillin-Clavulanate to cover common pathogens (Staph aureus, Strep pyogenes).",
            "Mark the area of erythema to track progression.",
            "Follow up in 24-48 hours to assess response.",
            "If Bartonella henselae (Cat Scratch Disease) is suspected, consider Azithromycin."
          ]
        }];
      case 'mild':
        return [{
          title: "Reactive/Viral Lymphadenitis Management",
          recommendations: [
            "Likely viral or reactive. Typically does not require antibiotics.",
            "Supportive care: antipyretics for fever.",
            "Observe and follow up with primary care in several days.",
            "Educate family on signs of worsening (increasing size, redness, tenderness, fever)."
          ]
        }];
      default:
        return [];
    }
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
      return ["Admit to hospital for IV antibiotics and surgical consultation."];
    }
    if (severity.level === 'moderate') {
      return ["Consider discharge on oral antibiotics with close follow-up in 24-48 hours.", "Admit if patient is unable to tolerate oral medication, is young (<3-6 months), or if follow-up is uncertain."];
    }
    return ["Discharge home with supportive care instructions and plan for outpatient follow-up."];
  },
  getRedFlags: () => [
    "Toxic or septic appearance",
    "Fluctuant mass (abscess)",
    "Rapidly enlarging mass",
    "Airway compromise (stridor, dysphagia, muffled voice)",
    "Supraclavicular node (high suspicion for malignancy)",
    "Failure to improve after 48-72 hours of appropriate oral antibiotics"
  ],
  getDrugDoses: () => [
    { drugName: "Clindamycin (oral)", dose: "30-40 mg/kg/day divided TID", notes: "Good coverage for MRSA and Strep." },
    { drugName: "Amoxicillin-Clavulanate (oral)", dose: "45-90 mg/kg/day of amoxicillin component, divided BID", notes: "Broader coverage including anaerobes, less reliable for MRSA." },
    { drugName: "Cephalexin (oral)", dose: "50-100 mg/kg/day divided QID", notes: "Good for MSSA/Strep, but no MRSA coverage." },
    { drugName: "Vancomycin (IV)", dose: "40-60 mg/kg/day divided q6-8h", notes: "For severe infections requiring admission." },
    { drugName: "Clindamycin (IV)", dose: "30-40 mg/kg/day divided TID-QID", notes: "For severe infections requiring admission." }
  ],
  getReferences: () => [
      { title: "IDSA Clinical Practice Guideline for the Diagnosis and Management of Skin and Soft Tissue Infections", url: "https://academic.oup.com/cid/article/59/2/e10/2895443" },
      { title: "UpToDate: Cervical lymphadenitis in children: Diagnostic approach and initial management", url: "https://www.uptodate.com/contents/cervical-lymphadenitis-in-children-diagnostic-approach-and-initial-management"}
  ],
};
