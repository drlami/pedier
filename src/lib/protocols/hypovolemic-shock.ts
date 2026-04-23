import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const hypovolemicShockProtocol: DiseaseProtocol = {
  id: 'hypovolemic-shock',
  name: 'Hypovolemic Shock',
  system: 'Shock and Resuscitation',
  description: 'Management of shock caused by intravascular volume loss, both non-hemorrhagic and hemorrhagic.',
  image: {
    url: "https://picsum.photos/seed/hypovolemic-shock/600/400",
    hint: "blood loss"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'cause', questionText: 'Primary Cause of Volume Loss', type: 'select', options: [
        {label: 'Non-Hemorrhagic (e.g., gastroenteritis, DKA)', value: 'non_hemorrhagic'},
        {label: 'Hemorrhagic (e.g., trauma, GI bleed)', value: 'hemorrhagic'},
    ]},
  ],
  calculateSeverity: () => ({ level: 'severe', details: ['Hypovolemic shock is a life-threatening condition requiring immediate intervention.'] }),
  getManagement: (severity, data) => {
    switch (data.cause) {
        case 'non_hemorrhagic':
            return [{ title: "Management of Non-Hemorrhagic Hypovolemic Shock", recommendations: [
                "The goal is to rapidly restore intravascular volume with isotonic crystalloids.",
                "Administer 20 mL/kg boluses of Normal Saline or Lactated Ringer's over 5-20 minutes.",
                "Reassess perfusion, heart rate, blood pressure, and mental status after each bolus.",
                "Repeat boluses as needed, often up to 40-60 mL/kg.",
                "If shock persists, consider other causes of shock and start vasoactive medications (see Septic Shock protocol)."
            ]}];
        case 'hemorrhagic':
            return [{ title: "Management of Hemorrhagic Shock", recommendations: [
                "The first priority is to CONTROL THE SOURCE OF BLEEDING.",
                "While controlling bleeding, begin volume resuscitation.",
                "Administer ONE bolus of 20 mL/kg isotonic crystalloid while awaiting blood products.",
                "Switch to blood products as soon as possible. Give Packed Red Blood Cells (PRBCs) in 10-15 mL/kg aliquots.",
                "For massive hemorrhage, activate massive transfusion protocol. The goal is balanced resuscitation with a 1:1:1 ratio of PRBCs : Fresh Frozen Plasma (FFP) : Platelets.",
                "Consult Trauma Surgery and/or Pediatric GI immediately."
            ]}];
        default:
            return [];
    }
  },
  getDisposition: () => ['All patients in hypovolemic shock require admission to the hospital, with hemorrhagic shock and severe non-hemorrhagic shock requiring PICU level care.'],
  getRedFlags: () => ['Hypotension for age', 'Altered mental status', 'Tachycardia with weak pulses', 'Active, uncontrolled bleeding', 'Failure to respond to initial fluid boluses'],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];
    if (weight > 0) {
        doses.push({
            drugName: "Isotonic Crystalloid Bolus",
            dose: `20 mL/kg = ${(20*weight).toFixed(0)} mL`
        });
        doses.push({
            drugName: "Packed Red Blood Cells (PRBCs)",
            dose: `10-15 mL/kg = ${(10*weight).toFixed(0)}-${(15*weight).toFixed(0)} mL`
        });
    } else {
         doses.push({
            drugName: "Isotonic Crystalloid Bolus",
            dose: `20 mL/kg`
        });
        doses.push({
            drugName: "Packed Red Blood Cells (PRBCs)",
            dose: `10-15 mL/kg`
        });
    }
    return doses;
  },
  getReferences: () => [
      { title: "ATLS - Advanced Trauma Life Support", url: ""},
      { title: "PALS Provider Manual", url: 'https://shopcpr.heart.org/pals-provider-manual'}
  ],
};
