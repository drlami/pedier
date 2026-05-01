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
    { id: 'isStable', questionText: 'Is the patient responsive to initial fluids?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    if (data.cause === 'hemorrhagic') return { level: 'severe', details: ['Hemorrhagic shock is a critical emergency.'] };
    return { level: 'severe', details: ['Hypovolemic shock requires immediate volume restoration. Use the "Shock Classification Tool" if mechanism is unclear.'] };
  },
  getManagement: (severity, data) => {
    switch (data.cause) {
        case 'non_hemorrhagic':
            return [{ title: "Management of Non-Hemorrhagic Hypovolemic Shock", recommendations: [
                "The goal is to rapidly restore intravascular volume with isotonic crystalloids.",
                "Administer 20 mL/kg boluses of Normal Saline or Lactated Ringer's over 5-20 minutes.",
                "Reassess perfusion, HR, BP, and mental status after EACH bolus.",
                "Repeat boluses as needed, up to a total of 40-60 mL/kg.",
                "If shock persists after 60 mL/kg, start vasoactive medications (Adrenaline)."
            ]}];
        case 'hemorrhagic':
            return [{ title: "Management of Hemorrhagic Shock", recommendations: [
                "FIRST PRIORITY: CONTROL THE SOURCE OF BLEEDING.",
                "Administer ONE bolus of 20 mL/kg isotonic crystalloid while awaiting blood products.",
                "SWITCH TO BLOOD PRODUCTS ASAP. Give Packed Red Blood Cells (PRBCs) in 10-15 mL/kg aliquots.",
                "MASSIVE HEMORRHAGE: Activate massive transfusion protocol. Goal 1:1:1 ratio (PRBCs : FFP : Platelets).",
                "Consult Trauma Surgery / Pediatric GI immediately."
            ]}];
        default:
            return [];
    }
  },
  getDisposition: () => ['All patients in hypovolemic shock require admission to the hospital, typically to a PICU.'],
  getRedFlags: () => ['Hypotension for age', 'Altered mental status', 'Failure to respond to initial 40 mL/kg of fluid'],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];
    if (weight > 0) {
        doses.push({
            drugName: "Isotonic Crystalloid Bolus",
            dose: `20 mL/kg = ${(20 * weight).toFixed(0)} mL`
        });
        doses.push({
            drugName: "Packed Red Blood Cells (PRBCs)",
            dose: `10-15 mL/kg = ${(10 * weight).toFixed(0)}-${(15 * weight).toFixed(0)} mL`
        });
    } else {
         doses.push({ drugName: "Isotonic Bolus", dose: "20 mL/kg" });
         doses.push({ drugName: "PRBCs", dose: "10-15 mL/kg" });
    }
    return doses;
  },
  getReferences: () => [
      { title: "ATLS - Advanced Trauma Life Support", url: ""},
      { title: "PALS Provider Manual", url: 'https://shopcpr.heart.org/pals-provider-manual'}
  ],
};
