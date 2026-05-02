import type { DiseaseProtocol, FormData, Severity } from './types';

export const orbitalCellulitisProtocol: DiseaseProtocol = {
  id: 'orbital-cellulitis',
  name: 'Orbital Cellulitis',
  system: 'Fever & Infectious Diseases',
  description: 'Emergency management of postseptal (orbital) cellulitis, a vision-threatening infection.',
  image: {
    url: "https://picsum.photos/seed/orbital-cellulitis/600/400",
    hint: "eye scan"
  },
  questions: [
    { id: 'proptosis', questionText: 'Is proptosis (bulging eye) present?', type: 'boolean' },
    { id: 'painWithEyeMovement', questionText: 'Is there pain with eye movements?', type: 'boolean' },
    { id: 'restrictedEyeMovement', questionText: 'Are extraocular movements restricted?', type: 'boolean' },
    { id: 'visionChange', questionText: 'Is there decreased vision or double vision?', type: 'boolean' },
    { id: 'pupilResponse', questionText: 'Is there an afferent pupillary defect (APD)?', type: 'boolean' },
    { id: 'isToxic', questionText: 'Does the child appear toxic or septic?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    // Any confirmed case of orbital cellulitis is a severe, vision-threatening emergency.
    const details: string[] = [];
    if (data.proptosis) details.push("Proptosis");
    if (data.painWithEyeMovement) details.push("Pain with eye movement");
    if (data.restrictedEyeMovement) details.push("Restricted EOM");
    if (data.visionChange) details.push("Vision change");
    if (data.pupilResponse) details.push("Afferent Pupillary Defect");
    
    if (details.length > 0) {
      details.push("Findings are consistent with Orbital Cellulitis, an ophthalmologic emergency.");
      return { level: 'severe', details };
    }
    
    return { level: 'unknown', details: ["Assess for key signs to confirm diagnosis."] };
  },
  getManagement: (severity, data) => {
    if (severity.level === 'severe') {
      return [{
        title: "EMERGENCY: Orbital Cellulitis Management",
        recommendations: [
          "This is a vision-threatening emergency. Activate emergency response.",
          "Obtain IMMEDIATE Ophthalmology and ENT consultation.",
          "Admit to hospital. Consider PICU for close monitoring.",
          "Obtain an urgent CT scan of the orbits and sinuses with IV contrast to confirm diagnosis and look for abscess.",
          "Start broad-spectrum IV antibiotics immediately. Do not delay for imaging if patient is unstable.",
          "Antibiotics should cover sinus pathogens, Staph (including MRSA), and anaerobes (e.g., Vancomycin PLUS Ceftriaxone/Cefotaxime OR Ampicillin-Sulbactam).",
          "Prepare for emergent surgical drainage if an abscess is found or if there is no improvement in 24-48 hours."
        ]
      }];
    }
    return [{
      title: "Assessment",
      recommendations: ["A high index of suspicion is required. The presence of any key sign (proptosis, painful/restricted eye movement, vision change) warrants treating as orbital cellulitis until proven otherwise."]
    }];
  },
  getDisposition: (severity, data) => {
    return ["All patients with suspected or confirmed orbital cellulitis require immediate admission to the hospital for IV antibiotics, imaging, and specialist consultations."];
  },
  getRedFlags: () => [
    "Proptosis (bulging eye)",
    "Painful or restricted eye movements",
    "Decreased visual acuity or diplopia",
    "Afferent Pupillary Defect (APD)",
    "Signs of CNS involvement: severe headache, altered mental status, cranial nerve palsies",
    "Abscess identified on CT scan"
  ],
  getDrugDoses: () => [
    { drugName: "Vancomycin (IV)", dose: "40-60 mg/kg/day divided q6-8h", notes: "Covers MRSA." },
    { drugName: "Ceftriaxone (IV)", dose: "80-100 mg/kg/day divided q12-24h", notes: "Covers Strep species and other sinus pathogens." },
    { drugName: "Ampicillin-Sulbactam (IV)", dose: "200-400 mg/kg/day of ampicillin component, divided q6h", notes: "Provides broad coverage including anaerobes." },
    { drugName: "Metronidazole (IV)", dose: "30 mg/kg/day divided q8h", notes: "May be added for anaerobic coverage if intracranial extension is suspected." }
  ],
  getReferences: () => [
    { title: "UpToDate: Orbital cellulitis", url: "https://www.uptodate.com/contents/orbital-cellulitis" },
    { title: "American Academy of Ophthalmology: Orbital Cellulitis", url: "https://eyewiki.aao.org/Orbital_Cellulitis" }
  ],
};
