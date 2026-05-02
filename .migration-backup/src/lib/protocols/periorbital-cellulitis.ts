import type { DiseaseProtocol, FormData, Severity } from './types';

export const periorbitalCellulitisProtocol: DiseaseProtocol = {
  id: 'periorbital-cellulitis',
  name: 'Periorbital Cellulitis',
  system: 'Fever & Infectious Diseases',
  description: 'Evaluation and management of preseptal (periorbital) cellulitis, and differentiation from orbital cellulitis.',
  image: {
    url: "https://picsum.photos/seed/periorbital-cellulitis/600/400",
    hint: "swollen eye"
  },
  questions: [
    { id: 'proptosis', questionText: 'Proptosis (bulging eye)?', type: 'boolean' },
    { id: 'painWithEyeMovement', questionText: 'Pain with eye movements?', type: 'boolean' },
    { id: 'restrictedEyeMovement', questionText: 'Restricted or painful extraocular movements?', type: 'boolean' },
    { id: 'visionChange', questionText: 'Change in vision (blurriness, double vision, decreased acuity)?', type: 'boolean' },
    { id: 'eyelidSwelling', questionText: 'Eyelid swelling, redness, and warmth?', type: 'boolean' },
    { id: 'isWellAppearing', questionText: 'Is the child well-appearing (non-toxic)?', type: 'boolean' },
    { id: 'ageOver1', questionText: 'Is the child over 1 year of age?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const hasOrbitalSigns = data.proptosis || data.painWithEyeMovement || data.restrictedEyeMovement || data.visionChange;

    if (hasOrbitalSigns) {
      if (data.proptosis) details.push("Proptosis");
      if (data.painWithEyeMovement) details.push("Pain with eye movement");
      if (data.restrictedEyeMovement) details.push("Restricted EOM");
      if (data.visionChange) details.push("Vision change");
      details.push("These are red flags for Orbital Cellulitis, an ophthalmologic emergency.");
      return { level: 'severe', details };
    }

    details.push("No signs of orbital involvement found. Findings consistent with periorbital cellulitis.");
    if (!data.isWellAppearing) {
      details.push("Child is not well-appearing, requires admission.");
      return { level: 'moderate', details };
    }
    if (!data.ageOver1) {
      details.push("Age < 1 year, typically requires admission.");
      return { level: 'moderate', details };
    }
    
    return { level: 'mild', details };
  },
  getManagement: (severity, data) => {
    switch (severity.level) {
      case 'severe':
        return [{
          title: "EMERGENCY: Suspected Orbital Cellulitis",
          recommendations: [
            "This is an ophthalmologic emergency.",
            "Obtain IMMEDIATE Ophthalmology and ENT consultation.",
            "Admit to hospital for IV antibiotics and imaging (CT scan of orbits and sinuses with contrast).",
            "See 'Orbital Cellulitis' protocol for detailed management."
          ]
        }];
      case 'moderate':
        return [{
          title: "Periorbital Cellulitis Requiring Admission",
          recommendations: [
            "Admit to hospital for observation and IV antibiotics.",
            "IV antibiotics may include Ceftriaxone or Ampicillin-Sulbactam.",
            "Consider adding Vancomycin or Clindamycin if MRSA is a concern or if there is a puncture wound.",
            "Re-evaluate frequently for any signs of orbital involvement."
          ]
        }];
      case 'mild':
        return [{
          title: "Uncomplicated Periorbital Cellulitis",
          recommendations: [
            "Consider outpatient management with oral antibiotics.",
            "Antibiotic choice should cover for common skin flora and sinus pathogens (e.g., Clindamycin, Amoxicillin-Clavulanate).",
            "Mark the borders of erythema to monitor for spread.",
            "Arrange for close follow-up within 24-48 hours.",
            "Provide strict return precautions for any worsening symptoms or red flags for orbital cellulitis."
          ]
        }];
      default:
        return [];
    }
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
      return ["Immediate admission for emergency specialist consultation and management of suspected orbital cellulitis."];
    }
    if (severity.level === 'moderate') {
      return ["Admit to hospital for IV antibiotics and observation due to toxic appearance or age < 1 year."];
    }
    return ["Can be considered for discharge on oral antibiotics if well-appearing, >1 year old, and has reliable follow-up arranged within 24-48 hours."];
  },
  getRedFlags: () => [
    "Proptosis (bulging eye)",
    "Pain with eye movements",
    "Limitation of extraocular movements",
    "Diplopia (double vision) or decreased visual acuity",
    "Toxic or septic appearance"
  ],
  getDrugDoses: () => [
    { drugName: "Clindamycin (oral)", dose: "30-40 mg/kg/day divided TID-QID", notes: "Good for MRSA coverage." },
    { drugName: "Amoxicillin-Clavulanate (oral)", dose: "45-90 mg/kg/day of amoxicillin component, divided BID", notes: "Good for sinus pathogens, but less MRSA coverage." },
    { drugName: "Ceftriaxone (IV)", dose: "50 mg/kg/dose every 24 hours", notes: "For admitted patients." },
    { drugName: "Vancomycin (IV)", dose: "40-60 mg/kg/day divided q6-8h", notes: "For suspected orbital involvement or MRSA concern." },
  ],
  getReferences: () => [
    { title: "IDSA Clinical Practice Guideline for the Diagnosis and Management of Skin and Soft Tissue Infections", url: "https://academic.oup.com/cid/article/59/2/e10/2895443" },
    { title: "UpToDate: Periorbital (preseptal) cellulitis", url: "https://www.uptodate.com/contents/periorbital-preseptal-cellulitis" }
  ],
};
