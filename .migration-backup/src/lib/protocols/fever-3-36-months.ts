import type { DiseaseProtocol, FormData, Severity } from './types';

export const fever3To36MonthsProtocol: DiseaseProtocol = {
  id: 'fever-3-36-months',
  name: 'Fever Without Source (3-36 months)',
  system: 'Fever & Infectious Diseases',
  description: 'Evaluation of fever without a source in children 3 to 36 months, focusing on risk of occult bacteremia and UTI.',
  image: {
    url: "https://picsum.photos/seed/fever-3-36-months/600/400",
    hint: "toddler temperature"
  },
  questions: [
    { id: 'isToxic', questionText: 'Is the child toxic-appearing?', type: 'boolean', info: 'Lethargy, signs of poor perfusion, marked hypoventilation or hyperventilation, cyanosis.'},
    { id: 'temperature', questionText: 'Peak temperature in last 24h', type: 'number', unit: '°C' },
    { id: 'ageMonths', questionText: 'Age in months', type: 'number' },
    { id: 'isMaleCircumcised', questionText: 'If male, is the child circumcised?', type: 'boolean' },
    { id: 'immunizationStatus', questionText: 'Immunization status for Hib and PCV13?', type: 'select', options: [{label: 'Complete/Up-to-date', value: 'complete'}, {label: 'Incomplete/Unknown', value: 'incomplete'}] },
    { id: 'hasFocalInfection', questionText: 'Evidence of a focal bacterial infection on exam (e.g. cellulitis, OM, septic arthritis)?', type: 'boolean'},
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];

    if (data.isToxic) {
      details.push("Child is toxic-appearing, a medical emergency.");
      return { level: 'severe', details };
    }
    if (data.hasFocalInfection) {
        details.push("Focal infection found, which is the likely source. Manage that infection.");
        return { level: 'moderate', details };
    }

    const tempHigh = Number(data.temperature) >= 39;
    const isUnimmunized = data.immunizationStatus === 'incomplete';
    const ageMonths = Number(data.ageMonths);
    const isFemale = data.isMaleCircumcised === false || data.isMaleCircumcised === undefined; // simplified logic for demo
    
    // Risk for Occult Bacteremia
    if (isUnimmunized && tempHigh) {
        details.push("High risk for occult bacteremia (unimmunized with high fever).");
        return { level: 'moderate', details };
    }

    // Risk for UTI
    if (isFemale && ageMonths < 24 && tempHigh) {
        details.push("High risk for UTI (female < 24 months with high fever).");
        return { level: 'moderate', details };
    }
    if (!data.isMaleCircumcised && ageMonths < 12 && tempHigh) {
        details.push("High risk for UTI (uncircumcised male < 12 months with high fever).");
        return { level: 'moderate', details };
    }

    details.push("Well-appearing, immunized child with fever. Low risk for occult serious bacterial infection.");
    return { level: 'mild', details };
  },
  getManagement: (severity, data) => {
    switch (severity.level) {
      case 'severe':
        return [{
          title: "Toxic-Appearing Child Management",
          recommendations: [
            "This is a medical emergency. Initiate resuscitation (ABCs).",
            "Perform a full sepsis evaluation: Blood culture, Urinalysis & Culture, and Lumbar Puncture (if stable).",
            "Administer parenteral broad-spectrum antibiotics (e.g., Ceftriaxone + Vancomycin) immediately.",
            "Admit to hospital for intensive monitoring and care."
          ]
        }];
      case 'moderate':
        const recommendations: string[] = [];
        if (severity.details.some(d => d.includes('occult bacteremia'))) {
            recommendations.push("Obtain blood culture and inflammatory markers (CBC, CRP).", "Consider a dose of parenteral antibiotics (e.g., Ceftriaxone) pending culture results.", "Ensure reliable follow-up within 24 hours.");
        }
        if (severity.details.some(d => d.includes('UTI'))) {
            recommendations.push("Obtain catheterized urinalysis and urine culture.", "If UA is positive, initiate antibiotics for UTI and arrange follow-up.");
        }
        if (severity.details.some(d => d.includes('Focal infection'))) {
            recommendations.push("Treat the identified source of infection according to specific guidelines (e.g., amoxicillin for otitis media).");
        }
        return [{
          title: "Non-Toxic Febrile Child with Risk Factors",
          recommendations
        }];
      case 'mild':
        return [{
          title: "Low-Risk Febrile Child Management",
          recommendations: [
            "No routine laboratory tests or antibiotics are necessary.",
            "Provide symptomatic care with antipyretics (Acetaminophen or Ibuprofen if >6 months).",
            "Educate caregivers on signs of worsening illness and provide strict return precautions.",
            "Consider urinalysis/urine culture for girls <24mo or uncircumcised boys <12mo, even if low risk otherwise."
          ]
        }];
      default:
        return [];
    }
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
      return ["Immediate admission to the hospital is required."];
    }
    if (severity.level === 'moderate') {
      return ["Most can be managed as outpatients with close follow-up, provided they are non-toxic and can maintain hydration.", "Admission should be considered if follow-up is uncertain, oral intake is poor, or caregivers are very anxious."];
    }
    return ["Discharge home with return precautions and symptomatic care instructions."];
  },
  getRedFlags: () => [
    "Toxic appearance (lethargy, poor perfusion, etc.)",
    "Non-blanching rash (petechiae or purpura)",
    "Signs of meningitis (nuchal rigidity, bulging fontanelle)",
    "Inconsolable crying or extreme irritability",
    "New-onset seizure with fever",
    "Any focal signs of severe infection (e.g., suspected septic arthritis)"
  ],
  getDrugDoses: () => [
    { drugName: "Ceftriaxone (IV/IM)", dose: "50 mg/kg as a single dose (max 1g)", notes: "For empiric treatment of suspected occult bacteremia." },
    { drugName: "Amoxicillin", dose: "80-90 mg/kg/day divided BID", notes: "For confirmed otitis media." },
    { drugName: "Amoxicillin-Clavulanate", dose: "Varies, often 45 mg/kg/day divided BID", notes: "For UTIs or resistant otitis media." },
    { drugName: "Acetaminophen", dose: "15 mg/kg per dose every 4-6 hours" },
    { drugName: "Ibuprofen (>6 months)", dose: "10 mg/kg per dose every 6-8 hours" }
  ],
  getReferences: () => [
      { title: "UpToDate: Fever without a source in children 3 to 36 months of age: Evaluation and management", url: "https://www.uptodate.com/contents/fever-without-a-source-in-children-3-to-36-months-of-age-evaluation-and-management" }
  ],
};
