import type { DiseaseProtocol, FormData, Severity } from './types';

export const neonatalJaundiceProtocol: DiseaseProtocol = {
  id: 'neonatal-jaundice',
  name: 'Neonatal Jaundice',
  system: 'Neonatology',
  description: 'Management of hyperbilirubinemia in the newborn.',
  image: {
    url: "https://picsum.photos/seed/neonatal-jaundice/600/400",
    hint: "neonate under phototherapy"
  },
  questions: [
    { id: 'ageHours', questionText: 'Age in hours', type: 'number' },
    { id: 'gestationalAge', questionText: 'Gestational age (weeks)', type: 'number' },
    { id: 'bilirubinLevel', questionText: 'Total Serum Bilirubin (TSB) in mg/dL', type: 'number' },
    { id: 'isJaundiceVisibleInFirst24h', questionText: 'Jaundice visible in the first 24 hours of life?', type: 'boolean' },
    { id: 'hasHemolysisRisk', questionText: 'Hemolysis risk (ABO/Rh incompatibility, G6PD deficiency)?', type: 'boolean' },
    { id: 'isIllAppearing', questionText: 'Is the infant ill-appearing (lethargy, poor feeding)?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    if (data.isJaundiceVisibleInFirst24h) {
      details.push("Jaundice in first 24h is pathological until proven otherwise.");
      return { level: 'severe', details };
    }
    if (Number(data.bilirubinLevel) > 20 || data.isIllAppearing) {
      details.push("High TSB level or ill-appearing infant.");
      return { level: 'severe', details };
    }
    if (data.hasHemolysisRisk || Number(data.bilirubinLevel) > 15) {
      details.push("Moderate hyperbilirubinemia or risk factors present.");
      return { level: 'moderate', details };
    }
    return { level: 'low', details: ['Physiological jaundice or low-risk hyperbilirubinemia.'] };
  },
  getManagement: (severity) => {
    if (severity.level === 'severe') {
      return [{
        title: "Intensive Management",
        recommendations: [
          "Admit for intensive phototherapy.",
          "Perform workup: CBC, reticulocyte count, blood type (Coombs test), G6PD.",
          "Monitor TSB every 4-6 hours.",
          "Ensure adequate hydration (oral/IV).",
          "Consult neonatology for potential exchange transfusion if TSB continues to rise or neurologic signs appear."
        ]
      }];
    }
    if (severity.level === 'moderate') {
      return [{
        title: "Phototherapy and Monitoring",
        recommendations: [
          "Consider starting phototherapy based on AAP nomograms.",
          "Monitor TSB every 8-12 hours.",
          "Support breastfeeding and ensure adequate intake.",
          "Identify and manage underlying causes if present."
        ]
      }];
    }
    return [{ title: 'Routine Care', recommendations: ['Frequent feeding, clinical observation, and follow-up TSB as indicated.'] }];
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe') return ["Hospital admission for intensive treatment."];
    if (severity.level === 'moderate') return ["Admission or outpatient phototherapy if available and safe."];
    return ["Discharge with outpatient follow-up in 24-48 hours."];
  },
  getRedFlags: () => [
    "Jaundice in first 24 hours of life",
    "Bilirubin rising > 5 mg/dL per day",
    "Lethargy or poor feeding",
    "Dark urine or pale stools",
    "Signs of acute bilirubin encephalopathy (hypertonia, arching, high-pitched cry)"
  ],
  getDrugDoses: () => [
    { drugName: "IVIG", dose: "0.5-1 g/kg over 2 hours", notes: "Consider in isoimmune hemolytic disease if TSB is rising despite intensive phototherapy." }
  ],
  getReferences: () => [
    { title: "AAP Clinical Practice Guideline Revision: Management of Hyperbilirubinemia in the Newborn Infant 35 or More Weeks of Gestation", url: "https://publications.aap.org/pediatrics/article/150/3/e2022058859/188722/Clinical-Practice-Guideline-Revision-Management-of" }
  ]
};
