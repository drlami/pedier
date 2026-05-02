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
      return { level: 'unknown', details: ['Suspect Cardiogenic Shock? Use the "Shock Classification Tool" if undifferentiated.'] };
  },
  getManagement: () => [{
      title: "Management of Cardiogenic Shock",
      recommendations: [
          "This is a PICU and Cardiology emergency.",
          "BE JUDICIOUS WITH FLUIDS. Large-volume fluid resuscitation will worsen pulmonary edema and pump failure.",
          "Administer small fluid boluses (5-10 mL/kg over 15-30 minutes) only if there is clear evidence of hypovolemia and no signs of fluid overload.",
          "Prioritize starting INOTROPIC infusions early to improve cardiac contractility.",
          "Adrenaline (epinephrine) is often a good first choice in undifferentiated shock as it provides both inotropy and vasoconstriction.",
          "Milrinone is a good choice if afterload reduction is desired (inodilator), but can cause hypotension.",
          "Obtain EKG and urgent bedside echocardiogram.",
          "Consider diuretics (e.g., Furosemide) if fluid overload is present and BP is stable."
      ]
  }],
  getDisposition: () => ['Immediate admission to a Pediatric Intensive Care Unit (PICU) with urgent Pediatric Cardiology consultation is mandatory.'],
  getRedFlags: () => [
      'Shock with signs of fluid overload (rales, hepatomegaly)',
      'Worsening respiratory distress after a fluid bolus',
      'A new, loud heart murmur',
      'Cardiomegaly on chest x-ray'
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    if (weight > 0) {
        return [
            { drugName: "Cautious Fluid Bolus", dose: `5-10 mL/kg = ${(5 * weight).toFixed(0)}-${(10 * weight).toFixed(0)} mL over 30 min` },
            { drugName: "Adrenaline Infusion", dose: "Start at 0.05-0.1 mcg/kg/min" },
            { drugName: "Milrinone Infusion", dose: "0.25-0.75 mcg/kg/min", notes: "Afterload reducer. Use with caution if hypotensive." },
            { drugName: "Furosemide", dose: `${weight.toFixed(0)} mg IV (1 mg/kg)`, notes: "Only for fluid overload if stable." }
        ];
    }
    return [
      { drugName: "Cautious Fluid Bolus", dose: "5-10 mL/kg over 15-30 minutes" },
      { drugName: "Adrenaline Infusion", dose: "Start 0.05-0.1 mcg/kg/min" },
    ];
  },
  getReferences: () => [{ title: "UpToDate: Initial management of shock in children", url: "https://www.uptodate.com/contents/initial-management-of-shock-in-children" }],
};
