import type { DiseaseProtocol, FormData, Severity } from './types';

export const shockClassificationProtocol: DiseaseProtocol = {
  id: 'shock-classification',
  name: 'Shock Classification',
  system: 'Shock and Resuscitation',
  description: 'A framework to help classify the underlying physiology of shock in a pediatric patient.',
  image: {
    url: "https://picsum.photos/seed/shock-classification/600/400",
    hint: "flow chart"
  },
  questions: [
    { id: 'perfusion', questionText: 'Perfusion / Extremity Temperature', type: 'select', options: [
        { label: 'Warm with flash capillary refill', value: 'warm' },
        { label: 'Cold with delayed capillary refill', value: 'cold' },
    ]},
    { id: 'bp', questionText: 'Blood Pressure', type: 'select', options: [
        { label: 'Normal for age', value: 'normal' },
        { label: 'Hypotensive for age', value: 'low' },
    ]},
     { id: 'pulses', questionText: 'Peripheral Pulses', type: 'select', options: [
        { label: 'Bounding', value: 'bounding' },
        { label: 'Normal', value: 'normal' },
        { label: 'Weak or thready', value: 'weak' },
    ]},
    { id: 'history', questionText: 'Primary Clinical Context', type: 'select', options: [
        { label: 'Vomiting/Diarrhea/Dehydration', value: 'dehydration' },
        { label: 'Trauma / Bleeding', value: 'trauma' },
        { label: 'Fever / Infection', value: 'infection' },
        { label: 'Known Heart Disease / Murmur / Rales', value: 'cardiac' },
        { label: 'Chest Trauma / Unilateral Breath Sounds', value: 'obstructive' },
    ]},
  ],
  calculateSeverity: (data: FormData): Severity => {
    const { perfusion, bp, pulses, history } = data;
    const details: string[] = [];

    if (history === 'dehydration' || history === 'trauma') {
        details.push("History suggests volume loss. Likely Hypovolemic Shock.");
        return { level: 'severe', details };
    }
    if (history === 'infection' && perfusion === 'warm' && pulses === 'bounding') {
        details.push("Warm extremities and bounding pulses in the setting of infection suggests Distributive Shock (Warm Septic Shock).");
        return { level: 'severe', details };
    }
     if (history === 'infection' && perfusion === 'cold') {
        details.push("Cold extremities in the setting of infection suggests Distributive Shock (Cold Septic Shock).");
        return { level: 'severe', details };
    }
    if (history === 'cardiac') {
        details.push("History and signs of heart failure suggest Cardiogenic Shock. Be cautious with fluids.");
        return { level: 'severe', details };
    }
    if (history === 'obstructive') {
        details.push("Clinical context points towards Obstructive Shock (e.g., tension pneumothorax, cardiac tamponade). Requires specific intervention to relieve obstruction.");
        return { level: 'severe', details };
    }

    return { level: 'unknown', details: ['Use clinical signs and history to classify shock type.'] };
  },
  getManagement: (severity, data) => {
      const recs = [
          "Hypovolemic Shock: Caused by decreased preload from volume loss (e.g., gastroenteritis, hemorrhage). Treat with aggressive volume replacement (crystalloids or blood).",
          "Distributive Shock: Caused by vasodilation leading to 'relative' hypovolemia (e.g., sepsis, anaphylaxis). Treat with fluids and vasoactive medications (pressors).",
          "Cardiogenic Shock: Caused by pump failure (e.g., myocarditis, cardiomyopathy, arrhythmia). Treat with inotropes and cautious fluid administration.",
          "Obstructive Shock: Caused by physical obstruction to blood flow (e.g., tension pneumothorax, cardiac tamponade, massive PE). Requires definitive procedure to relieve obstruction (e.g., needle decompression, pericardiocentesis)."
      ];
      return [{ title: "The Four Types of Shock", recommendations: recs }];
  },
  getDisposition: () => ['All children in shock require immediate admission to a PICU.'],
  getRedFlags: () => ['Hypotension', 'Altered mental status', 'Tachycardia/Bradycardia', 'Poor perfusion (delayed cap refill, weak pulses, cool skin)'],
  getDrugDoses: () => [],
  getReferences: () => [{ title: 'PALS Provider Manual', url: 'https://shopcpr.heart.org/pals-provider-manual'}],
};
