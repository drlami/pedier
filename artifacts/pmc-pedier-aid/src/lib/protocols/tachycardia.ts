import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const tachycardiaProtocol: DiseaseProtocol = {
  id: 'tachycardia',
  name: 'Tachycardia with a Pulse Algorithm',
  system: 'Shock and Resuscitation',
  description: 'An initial approach to pediatric tachycardia to differentiate sinus tachycardia from pathologic arrhythmias like SVT or VT.',
  image: {
    url: "https://picsum.photos/seed/tachycardia/600/400",
    hint: "fast heartbeat"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'isCompromised', questionText: 'Is there cardiopulmonary compromise?', type: 'boolean', info: 'e.g., Hypotension, acutely altered mental status, or signs of shock.'},
    { id: 'qrsWidth', questionText: 'QRS Duration?', type: 'select', options: [ {label: 'Narrow (≤0.09s)', value: 'narrow'}, {label: 'Wide (>0.09s)', value: 'wide'} ] },
    { id: 'isSinusTach', questionText: 'Is it likely Sinus Tachycardia?', type: 'select', options: [
        {label: 'Yes (P waves present, variable rate, history fits)', value: 'yes'},
        {label: 'No (P waves absent/abnormal, fixed rate, sudden onset)', value: 'no'},
    ]}
  ],
  calculateSeverity: (data: FormData): Severity => {
    if (!data.isCompromised && data.isSinusTach === 'yes') {
        return { level: 'mild', details: ["Sinus tachycardia identified. This is a compensatory response, not a primary arrhythmia."] };
    }
    if (!data.isCompromised && data.isSinusTach === 'no') {
        return { level: 'moderate', details: ["Pathologic tachycardia suspected in a stable patient."] };
    }
    if (data.isCompromised) {
        return { level: 'severe', details: ["Tachycardia with cardiopulmonary compromise. This is a life-threatening emergency."] };
    }
    return { level: 'unknown', details: ["Assess patient and EKG to classify tachycardia."] };
  },
  getManagement: (severity, data) => {
    switch (severity.level) {
      case 'severe':
        if (data.qrsWidth === 'narrow') {
            return [{ title: "Unstable Narrow-Complex Tachycardia (SVT)", recommendations: [
                "Call resuscitation team and place on continuous cardiac monitor.",
                "Provide immediate synchronized cardioversion.",
                "If IV/IO access is already present, Adenosine may be attempted while preparing cardioversion, but do not delay shock.",
            ]}];
        } else { // wide
             return [{ title: "Unstable Wide-Complex Tachycardia (VTach)", recommendations: [
                "Call resuscitation team and Pediatric Cardiology/PICU urgently.",
                "Provide immediate synchronized cardioversion.",
                "Do NOT use Adenosine for irregular wide-complex rhythm or suspected VT."
            ]}];
        }
      case 'moderate':
        if (data.qrsWidth === 'narrow') {
             return [{ title: "Stable Narrow-Complex Tachycardia (SVT)", recommendations: [
                "Treat as likely SVT: obtain 12-lead EKG, attempt vagal maneuvers, establish IV/IO, and give Adenosine if vagal maneuvers fail.",
                "Use the SVT protocol for detailed conversion steps and post-conversion monitoring."
            ]}];
        } else { // wide
            return [{ title: "Stable Wide-Complex Tachycardia (VTach)", recommendations: [
                "Treat as Ventricular Tachycardia until proven otherwise.",
                "Obtain 12-lead EKG and consult Pediatric Cardiology/PICU immediately.",
                "Prepare Amiodarone or Procainamide; do not combine them without expert guidance."
            ]}];
        }
      case 'mild':
        return [{
            title: "Sinus Tachycardia Management",
            recommendations: [
                "Do NOT attempt to slow the heart rate with antiarrhythmics or cardioversion.",
                "Identify and treat the underlying cause of the tachycardia (e.g., provide analgesia for pain, antipyretics for fever, fluids for dehydration)."
            ]
        }];
      default:
        return [];
    }
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe' || severity.level === 'moderate') {
      return ["Immediate admission to a monitored bed (PICU) is required."];
    }
    return ["Treat the underlying cause. Admission may be required based on the primary diagnosis (e.g., sepsis, dehydration)."];
  },
  getRedFlags: () => [
    'Cardiopulmonary compromise (hypotension, altered mental status, shock)',
    'Wide QRS complex tachycardia (>0.09s)',
    'Chest pain or syncope associated with palpitations',
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const amio = Math.min(5 * weight, 300);
    return [
      {
        drugName: "Synchronized Cardioversion",
        dose: weight > 0 ? `Initial ${(0.5 * weight).toFixed(0)}-${weight.toFixed(0)} J; then ${(2 * weight).toFixed(0)} J` : "0.5-1 J/kg; then 2 J/kg",
        notes: "Use SYNC mode for tachycardia with pulse and poor perfusion."
      },
      {
        drugName: "Amiodarone IV",
        dose: weight > 0 ? `${amio.toFixed(0)} mg IV over 20-60 min` : "5 mg/kg IV over 20-60 min, max 300 mg",
        notes: "For stable wide-complex tachycardia with expert consultation."
      }
    ];
  },
  getReferences: () => [{ title: "PALS Provider Manual (American Heart Association)", url: "https://shopcpr.heart.org/pals-provider-manual" }],
};
