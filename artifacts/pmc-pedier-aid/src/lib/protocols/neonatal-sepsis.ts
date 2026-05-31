import type { DiseaseProtocol, FormData, Severity } from './types';

export const neonatalSepsisProtocol: DiseaseProtocol = {
  id: 'neonatal-sepsis',
  name: 'Neonatal Sepsis',
  system: 'Neonatology',
  description: 'Evaluation and management of suspected neonatal sepsis (onset within the first 28 days of life).',
  image: {
    url: "https://picsum.photos/seed/neonatal-sepsis/600/400",
    hint: "neonate in incubator"
  },
  questions: [
    { id: 'ageDays', questionText: 'Age in days', type: 'number' },
    { id: 'feverOrHypothermia', questionText: 'Fever (≥38°C) or Hypothermia (<36.5°C)?', type: 'boolean' },
    { id: 'respiratoryDistress', questionText: 'Respiratory distress (grunting, flaring, retractions)?', type: 'boolean' },
    { id: 'lethargy', questionText: 'Lethargy or poor muscle tone?', type: 'boolean' },
    { id: 'poorFeeding', questionText: 'Poor feeding or vomiting?', type: 'boolean' },
    { id: 'maternalGBS', questionText: 'Maternal GBS positive or unknown without adequate prophylaxis?', type: 'boolean' },
    { id: 'prom', questionText: 'Prolonged rupture of membranes (>18 hours)?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    if (data.feverOrHypothermia || data.respiratoryDistress || data.lethargy) {
      details.push("Symptomatic neonate: High risk for sepsis.");
      return { level: 'severe', details };
    }
    if (data.poorFeeding || data.prom || data.maternalGBS) {
      details.push("Risk factors present or mild symptoms: Moderate risk.");
      return { level: 'moderate', details };
    }
    return { level: 'low', details: ['No immediate red flags or significant risk factors.'] };
  },
  getManagement: (severity) => {
    if (severity.level === 'severe') {
      return [{
        title: "Immediate Interventions",
        recommendations: [
          "Admit to NICU/Pediatric Inpatient.",
          "Full Sepsis Workup: Blood culture, Urinalysis/Culture, LP (if stable).",
          "Start Empiric IV Antibiotics: Ampicillin + Gentamicin.",
          "Provide respiratory support if needed.",
          "Monitor glucose and electrolytes."
        ]
      }];
    }
    if (severity.level === 'moderate') {
      return [{
        title: "Evaluation and Observation",
        recommendations: [
          "Consider blood culture and CBC/CRP.",
          "Observe closely for clinical deterioration.",
          "Threshold for antibiotics should be low in this age group."
        ]
      }];
    }
    return [{ title: 'Observation', recommendations: ['Clinical observation and parental education on red flags.'] }];
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe') return ["Immediate admission for workup and IV antibiotics."];
    if (severity.level === 'moderate') return ["Admission or very close observation depending on clinical stability."];
    return ["May be monitored as outpatient if well-appearing and reliable follow-up is available."];
  },
  getRedFlags: () => [
    "Temperature instability (fever or hypothermia)",
    "Apnea or bradycardia",
    "Bulging fontanelle",
    "Hypotonia/Lethargy",
    "Seizures",
    "Abdominal distention"
  ],
  getDrugDoses: () => [
    { drugName: "Ampicillin (IV)", dose: "50-100 mg/kg/dose q8-12h", notes: "First-line for GBS and Listeria." },
    { drugName: "Gentamicin (IV)", dose: "4-5 mg/kg/dose q24-48h (check levels)", notes: "First-line for Gram-negative coverage." },
    { drugName: "Cefotaxime (IV)", dose: "50 mg/kg/dose q8-12h", notes: "Use if meningitis suspected or as alternative to Gentamicin." }
  ],
  getReferences: () => [
    { title: "NICE Guideline: Neonatal infection (early onset): antibiotics for prevention and treatment", url: "https://www.nice.org.uk/guidance/ng191" }
  ]
};
