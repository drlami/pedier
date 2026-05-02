import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const fluidResuscitationProtocol: DiseaseProtocol = {
  id: 'fluid-resuscitation',
  name: 'Fluid Resuscitation',
  system: 'Shock and Resuscitation',
  description: 'Guiding principles for initial fluid resuscitation in pediatric shock.',
  image: {
    url: "https://picsum.photos/seed/fluid-resuscitation/600/400",
    hint: "iv fluid"
  },
  questions: [
      { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
      { id: 'shockType', questionText: 'Suspected Shock Type', type: 'select', options: [
          {label: 'Hypovolemic or Distributive (Septic)', value: 'hypovolemic_distributive'},
          {label: 'Cardiogenic', value: 'cardiogenic'},
          {label: 'DKA with signs of shock', value: 'dka'},
      ]},
  ],
  calculateSeverity: () => ({ level: 'severe', details: ['Fluid resuscitation is a key intervention for shock, which is always a severe condition.'] }),
  getManagement: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const bolus20ml = (20 * weight).toFixed(0);
    const bolus10ml = (10 * weight).toFixed(0);

    switch(data.shockType) {
        case 'hypovolemic_distributive':
            return [{ title: "Fluid Resuscitation for Hypovolemic/Distributive Shock", recommendations: [
                `Administer an initial bolus of 20 mL/kg (${bolus20ml} mL) of isotonic crystalloid (Normal Saline or Lactated Ringer's) over 5-20 minutes.`,
                "Reassess patient after each bolus for signs of improvement (HR, BP, perfusion, mental status) and signs of fluid overload (rales, hepatomegaly).",
                "Repeat boluses of 20 mL/kg as needed, up to a total of 40-60 mL/kg in the first hour.",
                "If shock persists after 40-60 mL/kg, the patient is in fluid-refractory shock. Start vasoactive medications.",
            ]}];
        case 'cardiogenic':
            return [{ title: "CAUTIOUS Fluid Resuscitation for Cardiogenic Shock", recommendations: [
                "Fluid administration should be more cautious in suspected cardiogenic shock to avoid worsening pulmonary edema.",
                `Administer smaller boluses: 5-10 mL/kg (${bolus10ml} mL) over a longer period (15-30 minutes).`,
                "Reassess frequently for signs of worsening heart failure (increased work of breathing, rales).",
                "Prioritize early initiation of inotropes and diuretics over large volume fluid resuscitation. Consult Cardiology and PICU early."
            ]}];
        case 'dka':
            return [{ title: "Fluid Resuscitation in DKA", recommendations: [
                "While patients are dehydrated, aggressive fluid resuscitation can increase the risk of cerebral edema.",
                `If signs of hypovolemic shock are present, give an initial judicious bolus of 10-20 mL/kg (${bolus10ml}-${bolus20ml} mL) of isotonic crystalloid over 30-60 minutes.`,
                "Avoid rapid or repeated boluses. Subsequent fluid management should be focused on gradual correction of the calculated fluid deficit over 24-48 hours, typically as part of an insulin infusion protocol."
            ]}];
        default:
            return [];
    }
  },
  getDisposition: () => ['All children requiring fluid resuscitation for shock must be admitted to the hospital, typically to a PICU.'],
  getRedFlags: () => ['Development of rales (crackles) on lung exam', 'New or worsening hepatomegaly', 'Worsening respiratory distress during fluid administration'],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    if (weight > 0) {
        return [
            { drugName: "Isotonic Crystalloid Bolus (Standard)", dose: `20 mL/kg = ${(20 * weight).toFixed(0)} mL`},
            { drugName: "Isotonic Crystalloid Bolus (Cautious)", dose: `5-10 mL/kg = ${(5 * weight).toFixed(0)}-${(10 * weight).toFixed(0)} mL`},
        ];
    }
    return [
        { drugName: "Isotonic Crystalloid Bolus (Standard)", dose: "20 mL/kg"},
        { drugName: "Isotonic Crystalloid Bolus (Cautious)", dose: "5-10 mL/kg"},
    ];
  },
  getReferences: () => [{ title: 'PALS Provider Manual', url: 'https://shopcpr.heart.org/pals-provider-manual'}],
};
