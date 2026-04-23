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
                "This is unstable SVT. Provide immediate synchronized cardioversion.",
                "See 'SVT' protocol for specific doses.",
                "If cardioversion is not immediately available, can attempt Adenosine.",
            ]}];
        } else { // wide
             return [{ title: "Unstable Wide-Complex Tachycardia (VTach)", recommendations: [
                "This is unstable VT. Provide immediate synchronized cardioversion.",
                "Consult pediatric cardiology urgently.",
                "Do NOT use adenosine."
            ]}];
        }
      case 'moderate':
        if (data.qrsWidth === 'narrow') {
             return [{ title: "Stable Narrow-Complex Tachycardia (SVT)", recommendations: [
                "This is likely SVT.",
                "Please refer to the specific 'Supraventricular Tachycardia (SVT)' protocol for detailed management with vagal maneuvers and adenosine."
            ]}];
        } else { // wide
            return [{ title: "Stable Wide-Complex Tachycardia (VTach)", recommendations: [
                "Treat as Ventricular Tachycardia until proven otherwise.",
                "Obtain 12-lead EKG and consult pediatric cardiology immediately.",
                "Consider antiarrhythmics like Amiodarone or Procainamide."
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
  getDrugDoses: () => [
    { drugName: "Synchronized Cardioversion", dose: "Initial: 0.5-1 J/kg. Subsequent: 2 J/kg." },
    { drugName: "Amiodarone (for stable wide-complex tach)", dose: "5 mg/kg IV over 20-60 minutes.", notes: "Use with caution and cardiology consult." }
  ],
  getReferences: () => [{ title: "PALS Provider Manual (American Heart Association)", url: "https://shopcpr.heart.org/pals-provider-manual" }],
};
