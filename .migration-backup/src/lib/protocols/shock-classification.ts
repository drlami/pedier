import type { DiseaseProtocol, FormData, Severity } from './types';

export const shockClassificationProtocol: DiseaseProtocol = {
  id: 'shock-classification',
  name: 'Shock Classification Tool',
  system: 'Shock and Resuscitation',
  description: 'A clinical tool to help classify the underlying physiology of pediatric shock based on exam findings and history.',
  image: {
    url: "https://picsum.photos/seed/shock-classification/600/400",
    hint: "flow chart"
  },
  questions: [
    { id: 'perfusion', questionText: 'Skin Perfusion / Temperature', type: 'select', options: [
        { label: 'Warm / Flash Capillary Refill (<1s)', value: 'warm' },
        { label: 'Cold / Delayed Capillary Refill (>2s)', value: 'cold' },
    ]},
    { id: 'pulses', questionText: 'Peripheral Pulses', type: 'select', options: [
        { label: 'Bounding / Strong', value: 'bounding' },
        { label: 'Weak / Thready / Absent', value: 'weak' },
    ]},
    { id: 'history', questionText: 'Primary Clinical Context', type: 'select', options: [
        { label: 'Vomiting, Diarrhea, or Poor Intake', value: 'dehydration' },
        { label: 'Trauma or Active Bleeding', value: 'trauma' },
        { label: 'Fever or Suspected Infection', value: 'infection' },
        { label: 'Known Heart Disease / Rales / Hepatomegaly', value: 'cardiac' },
        { label: 'Sudden Respiratory Distress / Tracheal Deviation', value: 'obstructive' },
        { label: 'Recent Allergen Exposure / Hives', value: 'anaphylaxis' }
    ]},
    { id: 'bp', questionText: 'Blood Pressure Status', type: 'select', options: [
        { label: 'Normal for Age (Compensated)', value: 'normal' },
        { label: 'Hypotensive for Age (Decompensated)', value: 'low' },
    ]},
  ],
  calculateSeverity: (data: FormData): Severity => {
    const { perfusion, pulses, history, bp } = data;
    const details: string[] = [];

    if (bp === 'low') details.push("DECOMPENSATED SHOCK: Immediate intervention required.");
    else details.push("COMPENSATED SHOCK: High risk for rapid deterioration.");

    if (history === 'infection') {
        if (perfusion === 'warm') details.push("Physiology: WARM SEPTIC SHOCK (Distributive). Low SVR, High CO.");
        else details.push("Physiology: COLD SEPTIC SHOCK (Distributive). High SVR, Low CO.");
        return { level: 'severe', details };
    }

    if (history === 'dehydration' || history === 'trauma') {
        details.push("Physiology: HYPOVOLEMIC SHOCK. Decreased Preload.");
        return { level: 'severe', details };
    }

    if (history === 'cardiac') {
        details.push("Physiology: CARDIOGENIC SHOCK. Pump Failure (Low CO).");
        return { level: 'severe', details };
    }

    if (history === 'obstructive') {
        details.push("Physiology: OBSTRUCTIVE SHOCK (e.g., Tension PTX, Tamponade). Mechanical obstruction to flow.");
        return { level: 'severe', details };
    }

    if (history === 'anaphylaxis') {
        details.push("Physiology: ANAPHYLACTIC SHOCK (Distributive). Massive vasodilation and capillary leak.");
        return { level: 'severe', details };
    }

    return { level: 'unknown', details: ['Complete the assessment to classify shock type.'] };
  },
  getManagement: (severity, data) => {
      const type = data.history;
      const recs = [];

      switch(type) {
          case 'infection':
              recs.push("PROCEED TO: 'Septic Shock' protocol.");
              recs.push("Key: 20 mL/kg fluid boluses + Early Antibiotics + Vasoactive support (Adrenaline for Cold, Noradrenaline for Warm).");
              break;
          case 'dehydration':
          case 'trauma':
              recs.push("PROCEED TO: 'Hypovolemic Shock' protocol.");
              recs.push("Key: Aggressive 20 mL/kg crystalloid boluses. For trauma, switch to 1:1:1 blood product ratios early.");
              break;
          case 'cardiac':
              recs.push("PROCEED TO: 'Cardiogenic Shock' protocol.");
              recs.push("Key: CAUTIOUS fluids (5-10 mL/kg). Early inotropes (Milrinone/Dobutamine). Consult Cardiology/PICU.");
              break;
          case 'anaphylaxis':
              recs.push("PROCEED TO: 'Anaphylactic Shock' protocol.");
              recs.push("Key: EPINEPHRINE IM FIRST. 20 mL/kg fluid boluses.");
              break;
          case 'obstructive':
              recs.push("IMMEDIATE PROCEDURE REQUIRED: Needle decompression (PTX), Pericardiocentesis (Tamponade), or surgery.");
              recs.push("Fluids and pressors are only temporizing measures until obstruction is relieved.");
              break;
          default:
              recs.push("Identify the primary mechanism to guide therapy.");
      }

      return [{ title: "Oriented Management Pathway", recommendations: recs }];
  },
  getDisposition: () => ['All pediatric patients in shock require immediate admission to a PICU setting.'],
  getRedFlags: () => [
    'Hypotension (late, ominous sign in children)',
    'Altered mental status (lethargy, irritability)',
    'Capillary refill > 2s (Cold) or < 1s (Warm)',
    'Hepatomegaly or pulmonary rales (suggests Cardiogenic origin)'
  ],
  getDrugDoses: () => [],
  getReferences: () => [{ title: 'PALS Provider Manual', url: 'https://shopcpr.heart.org/pals-provider-manual'}],
};
