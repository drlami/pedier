import type { DiseaseProtocol, FormData, Severity } from './types';

export const croupProtocol: DiseaseProtocol = {
  id: 'croup',
  name: 'Croup (Laryngotracheitis)',
  description: 'Assessment and management of croup.',
   image: {
    url: "https://picsum.photos/seed/croup/600/400",
    hint: "child coughing"
  },
  questions: [
    { id: 'stridorAtRest', questionText: 'Stridor at rest?', type: 'boolean' },
    { id: 'barkyCough', questionText: 'Barky cough?', type: 'boolean' },
    { id: 'retractions', questionText: 'Retractions', type: 'select', options: [{label: 'None', value: 'none', score: 0}, {label: 'Mild', value: 'mild', score: 1}, {label: 'Moderate', value: 'moderate', score: 2}, {label: 'Severe', value: 'severe', score: 3}] },
    { id: 'agitationLethargy', questionText: 'Agitation or lethargy?', type: 'boolean' },
    { id: 'cyanosis', questionText: 'Cyanosis?', type: 'boolean' },
    { id: 'airEntry', questionText: 'Air Entry', type: 'select', options: [{label: 'Normal', value: 'normal', score: 0}, {label: 'Decreased', value: 'decreased', score: 1}, {label: 'Markedly Decreased', value: 'markedly_decreased', score: 2}] },
  ],
  calculateSeverity: (data: FormData): Severity => {
    // Westley Croup Score
    let score = 0;
    const details: string[] = [];
    
    if (data.stridorAtRest) { score += 2; details.push("Stridor at rest"); }
    if (data.retractions === 'mild') { score += 1; details.push("Mild retractions"); }
    if (data.retractions === 'moderate') { score += 2; details.push("Moderate retractions"); }
    if (data.retractions === 'severe') { score += 3; details.push("Severe retractions"); }
    if (data.airEntry === 'decreased') { score += 1; details.push("Decreased air entry"); }
    if (data.airEntry === 'markedly_decreased') { score += 2; details.push("Markedly decreased air entry"); }
    if (data.cyanosis) { score += 5; details.push("Cyanosis present"); }
    if (data.agitationLethargy) { score += 5; details.push("Altered level of consciousness"); }

    if (score >= 12) return { level: 'impending respiratory failure', score, details };
    if (score >= 8) return { level: 'severe', score, details };
    if (score >= 3) return { level: 'moderate', score, details };
    return { level: 'mild', score, details };
  },
  getManagement: (severity, data) => {
    const management = [];
    if(severity.level === 'mild') {
        management.push({ title: 'Mild Croup (Score 0-2)', recommendations: [
            'Administer single dose of oral Dexamethasone.',
            'Discharge home with education on supportive care (cool mist, hydration) and return precautions.',
            'No epinephrine needed.'
        ]});
    }
    if(severity.level === 'moderate') {
        management.push({ title: 'Moderate Croup (Score 3-7)', recommendations: [
            'Administer single dose of oral/IM/IV Dexamethasone.',
            'Administer nebulized Racemic Epinephrine.',
            'Observe for 2-4 hours post-epinephrine for rebound symptoms.',
            'Patient may be discharged if they remain improved, otherwise admit.'
        ]});
    }
    if(severity.level === 'severe') {
        management.push({ title: 'Severe Croup (Score 8-11)', recommendations: [
            'Administer IM/IV Dexamethasone.',
            'Administer nebulized Racemic Epinephrine. May repeat dose.',
            'Provide supplemental oxygen.',
            'Admit to hospital. Consider PICU if repeated epinephrine doses are required.'
        ]});
    }
    if(severity.level === 'impending respiratory failure') {
        management.push({ title: 'Impending Respiratory Failure (Score ≥12)', recommendations: [
            'Immediate PICU consultation.',
            'Administer IM/IV Dexamethasone and nebulized Racemic Epinephrine.',
            'Provide high-concentration oxygen. Consider Heliox.',
            'Prepare for endotracheal intubation with an ETT 0.5-1 size smaller than predicted.'
        ]});
    }
    return management;
  },
  getDisposition: (severity, data) => {
    if(severity.level === 'impending respiratory failure' || severity.level === 'severe') {
        return ['Admit to hospital, likely PICU for impending respiratory failure.'];
    }
    if(severity.level === 'moderate') {
        return ['Observe for 2-4 hours after epinephrine.', 'Admit if requiring repeated epinephrine, persistent distress, or poor oral intake.', 'Discharge if stable off oxygen, no stridor at rest, and good air exchange.'];
    }
    return ['Discharge home after Dexamethasone if clinically well with no high-risk features.'];
  },
  getRedFlags: () => [
    'Altered mental status (lethargy, agitation, or confusion)',
    'Severe stridor at rest',
    'Marked retractions and poor air entry',
    'Cyanosis',
    'Fatigue or exhaustion',
    'Inability to handle secretions (drooling)'
  ],
  getDrugDoses: (severity) => [
      { drugName: "Dexamethasone", dose: "0.6 mg/kg oral, IM, or IV (max 16mg), single dose" },
      { drugName: "Racemic Epinephrine 2.25%", dose: "0.5 mL diluted in 3 mL normal saline, nebulized over 15 min" },
      { drugName: "L-Epinephrine 1:1000", dose: "5 mL nebulized over 15 min (if racemic not available)" },
  ],
  getReferences: () => [{ title: "Alberta Clinical Practice Guideline: Croup", url: "https://act.albertadoctors.org/cpgs/Lists/CPGSCF/DispForm.aspx?ID=60" }],
};
