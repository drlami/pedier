import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const cardiogenicShockProtocol: DiseaseProtocol = {
  id: 'cardiogenic-shock',
  name: 'Cardiogenic Shock',
  system: 'Shock and Resuscitation',
  description: 'Management of shock due to primary cardiac dysfunction (pump failure).',
  image: {
    url: "https://picsum.photos/seed/cardiogenic-shock/600/400",
    hint: "heart failure"
  },
  questions: [
      { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
      { id: 'hasRales', questionText: 'Are rales (crackles) present on lung exam?', type: 'boolean' },
      { id: 'hasHepatomegaly', questionText: 'Is hepatomegaly present?', type: 'boolean' },
      { id: 'hasMurmur', questionText: 'New or significant heart murmur?', type: 'boolean' },
      { id: 'cxrFindings', questionText: 'Chest X-ray findings?', type: 'select', options: [
          { label: 'Not done', value: 'none' },
          { label: 'Cardiomegaly and/or Pulmonary Edema', value: 'positive' },
          { label: 'Normal', value: 'normal' },
      ]},
  ],
  calculateSeverity: (data: FormData): Severity => {
      const details = [];
      if(data.hasRales) details.push("Rales present (pulmonary edema).");
      if(data.hasHepatomegaly) details.push("Hepatomegaly (venous congestion).");
      if(data.cxrFindings === 'positive') details.push("CXR shows cardiomegaly or pulmonary edema.");

      if (details.length > 0) {
          return { level: 'severe', details: [...details, "Signs of heart failure are present, highly suggestive of cardiogenic shock."] };
      }
      return { level: 'unknown', details: ['Cardiogenic shock should be suspected in any child with shock unresponsive to fluids or with signs of fluid overload.'] };
  },
  getManagement: () => [{
      title: "Management of Cardiogenic Shock",
      recommendations: [
          "This is a PICU and Cardiology emergency.",
          "BE JUDICIOUS WITH FLUIDS. Large-volume fluid resuscitation will worsen pulmonary edema and pump failure.",
          "Administer small fluid boluses (5-10 mL/kg over 15-30 minutes) only if there is clear evidence of hypovolemia and no signs of fluid overload. Reassess constantly.",
          "Prioritize starting INOTROPIC and/or VASOACTIVE infusions early to improve cardiac contractility and manage afterload.",
          "Adrenaline (epinephrine) is often a good first choice in undifferentiated cardiogenic shock as it provides both inotropy and vasoconstriction.",
          "Milrinone is a good choice if afterload reduction is desired (inodilator), but can cause hypotension.",
          "Dobutamine provides inotropy without significant vasoconstriction.",
          "Obtain EKG and urgent bedside echocardiogram.",
          "Consider diuretics (e.g., Furosemide) if fluid overload is present."
      ]
  }],
  getDisposition: () => ['Immediate admission to a Pediatric Intensive Care Unit (PICU) with urgent Pediatric Cardiology consultation is mandatory.'],
  getRedFlags: () => [
      'Shock with signs of fluid overload (rales, hepatomegaly, jugular venous distention)',
      'Worsening respiratory distress after a fluid bolus',
      'A new, loud holosystolic murmur',
      'Cardiomegaly or pulmonary edema on chest x-ray'
  ],
  getDrugDoses: () => [
      { drugName: "Cautious Fluid Bolus", dose: "5-10 mL/kg over 15-30 minutes" },
      { drugName: "Adrenaline (Epinephrine) Infusion", dose: "Start 0.05-0.1 mcg/kg/min, titrate to effect." },
      { drugName: "Milrinone Infusion", dose: "Load 50 mcg/kg over 10 min, then 0.25-0.75 mcg/kg/min infusion.", notes: "Use with caution, can cause hypotension." },
      { drugName: "Dobutamine Infusion", dose: "Start 2-5 mcg/kg/min, titrate to effect (up to 20 mcg/kg/min)." },
      { drugName: "Furosemide", dose: "1-2 mg/kg IV", notes: "For diuresis in fluid overload."}
  ],
  getReferences: () => [{ title: "UpToDate: Initial management of shock in children", url: "https://www.uptodate.com/contents/initial-management-of-shock-in-children" }],
};
