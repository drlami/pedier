import type { DiseaseProtocol, FormData, Severity } from './types';

export const mastoiditisProtocol: DiseaseProtocol = {
  id: 'mastoiditis',
  name: 'Mastoiditis Suspicion',
  system: 'Fever & Infectious Diseases',
  description: 'Evaluation and management of acute mastoiditis, a serious complication of otitis media.',
  image: {
    url: "https://picsum.photos/seed/mastoiditis/600/400",
    hint: "ear xray"
  },
  questions: [
    { id: 'postauricularSigns', questionText: 'Postauricular (behind the ear) tenderness, swelling, or redness?', type: 'boolean' },
    { id: 'earProtrusion', questionText: 'Forward protrusion of the auricle (pinna)?', type: 'boolean' },
    { id: 'aomHistory', questionText: 'History of recent or concurrent acute otitis media?', type: 'boolean' },
    { id: 'isToxic', questionText: 'Is the child toxic-appearing or septic?', type: 'boolean' },
    { id: 'hasComplications', questionText: 'Any signs of complications?', type: 'boolean', info: 'e.g., facial nerve palsy, vertigo, severe headache, neck stiffness, altered mental status.' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const hasClassicSigns = data.postauricularSigns && data.earProtrusion;
    
    if (data.hasComplications) {
      details.push("Signs of complicated mastoiditis are present (e.g., facial palsy, intracranial extension). This is a surgical emergency.");
      return { level: 'severe', details };
    }

    if (hasClassicSigns) {
      details.push("Classic signs of mastoiditis are present (postauricular swelling and pinna displacement).");
      return { level: 'moderate', details }; // Using 'moderate' for uncomplicated mastoiditis, but it's still very serious.
    }
    
    return { level: 'unknown', details: ["Assess for classic signs to determine risk."] };
  },
  getManagement: (severity, data) => {
    if (severity.level === 'severe' || severity.level === 'moderate') {
      return [{
        title: "EMERGENCY: Acute Mastoiditis Management",
        recommendations: [
          "This is a surgical emergency requiring immediate hospital admission.",
          "Obtain IMMEDIATE consultation from Otolaryngology (ENT).",
          "Obtain IV access and start broad-spectrum IV antibiotics (e.g., Vancomycin PLUS Ceftriaxone or Cefepime).",
          "Obtain a CT scan of the temporal bones with IV contrast to confirm the diagnosis and evaluate for complications like a subperiosteal abscess or intracranial extension.",
          "Pain management with analgesics.",
          "Most patients will require surgical intervention (myringotomy with tube placement, and possibly mastoidectomy)."
        ]
      }];
    }
    return [{ title: "Assessment", recommendations: ["Maintain a high index of suspicion. Any sign of postauricular inflammation in the setting of otitis media should be treated as mastoiditis until proven otherwise."] }];
  },
  getDisposition: (severity, data) => {
    return ["All patients with suspected acute mastoiditis require immediate hospital admission for IV antibiotics, imaging, and urgent ENT consultation."];
  },
  getRedFlags: () => [
    "Postauricular swelling, erythema, and tenderness",
    "Protrusion of the auricle (pinna)",
    "Facial nerve (CN VII) weakness or paralysis",
    "Vertigo or ataxia",
    "Signs of meningitis (neck stiffness, altered mental status)",
    "Subperiosteal abscess (boggy, fluctuant swelling behind the ear)"
  ],
  getDrugDoses: () => [
    { drugName: "Vancomycin (IV)", dose: "60 mg/kg/day divided q6h", notes: "Crucial for MRSA coverage." },
    { drugName: "Ceftriaxone (IV)", dose: "80-100 mg/kg/day divided q12-24h", notes: "Covers S. pneumoniae and other common pathogens." },
    { drugName: "Cefepime (IV)", dose: "150 mg/kg/day divided q8h", notes: "Alternative to Ceftriaxone, provides anti-pseudomonal coverage." }
  ],
  getReferences: () => [
    { title: "UpToDate: Acute mastoiditis in children: Clinical features and diagnosis", url: "https://www.uptodate.com/contents/acute-mastoiditis-in-children-clinical-features-and-diagnosis" },
  ],
};
