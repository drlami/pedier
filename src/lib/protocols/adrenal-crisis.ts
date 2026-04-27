import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const adrenalCrisisProtocol: DiseaseProtocol = {
  id: 'adrenal-crisis',
  name: 'Adrenal Crisis',
  system: 'Endocrinology',
  description: 'Management of acute adrenal insufficiency, a life-threatening emergency characterized by shock refractory to fluids, hypoglycemia, and electrolyte abnormalities.',
  image: {
    url: "https://picsum.photos/seed/adrenal-crisis/600/400",
    hint: "shock child"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'hasShock', questionText: 'Are there signs of shock (hypotension, tachycardia, poor perfusion)?', type: 'boolean' },
    { id: 'isRefractoryToFluids', questionText: 'Is the shock refractory to fluid resuscitation?', type: 'boolean' },
    { id: 'hasHypoglycemia', questionText: 'Is hypoglycemia present?', type: 'boolean' },
    { id: 'hasHyponatremia', questionText: 'Is hyponatremia present?', type: 'boolean' },
    { id: 'hasHyperkalemia', questionText: 'Is hyperkalemia present?', type: 'boolean' },
    { id: 'historyAI', questionText: 'Is there a known history of adrenal insufficiency or chronic steroid use?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    // Any patient in adrenal crisis is severe. The questions are to build clinical suspicion.
    const details: string[] = [];
    if (data.hasShock && (data.isRefractoryToFluids || data.hasHypoglycemia || data.hasHyponatremia || data.hasHyperkalemia)) {
      details.push("Shock with classic metabolic abnormalities is highly suggestive of adrenal crisis.");
      return { level: 'severe', details };
    }
    if (data.historyAI && data.hasShock) {
        details.push("Known adrenal insufficiency with shock is adrenal crisis until proven otherwise.");
        return { level: 'severe', details };
    }
    
    return { level: 'unknown', details: ["Maintain high index of suspicion for adrenal crisis in any patient with refractory shock."] };
  },
  getManagement: (severity, data) => {
    return [{
      title: "IMMEDIATE Management of Suspected Adrenal Crisis",
      recommendations: [
        "DO NOT DELAY STEROIDS. This is the life-saving intervention. Administer stress dose hydrocortisone IV/IM immediately.",
        "Begin aggressive fluid resuscitation for shock. Use isotonic saline (0.9% NaCl).",
        "If hypoglycemic, administer a dextrose bolus and start dextrose-containing maintenance fluids (e.g., D5NS).",
        "Draw 'critical labs' before giving steroids IF POSSIBLE without delaying treatment: Cortisol, ACTH, electrolytes, glucose, renin.",
        "Monitor electrolytes, glucose, and vital signs closely.",
        "Consult Pediatric Endocrinology urgently."
      ]
    }];
  },
  getDisposition: (severity, data) => {
    return ["All patients with suspected or confirmed adrenal crisis require immediate admission to the Pediatric Intensive Care Unit (PICU)."];
  },
  getRedFlags: () => [
    "Shock that is not responsive to fluid resuscitation.",
    "Hypotension accompanied by hypoglycemia, hyponatremia, and/or hyperkalemia.",
    "History of known adrenal insufficiency with intercurrent illness and signs of shock.",
    "Unexplained altered mental status."
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    const hydrocortDose = 
        weight <= 3 ? '25 mg' :
        weight > 3 && weight <= 18 ? '50 mg' : '100 mg';
    
    doses.push({ drugName: "Hydrocortisone (Solu-Cortef) Stress Dose IV/IM", dose: `Age-based: <3 yrs: 25 mg; 3-12 yrs: 50 mg; >12 yrs: 100 mg. A simplified weight based dose is 50-100 mg/m².`, notes: `Using approximate weight: Give ${hydrocortDose}.` });
    
    doses.push({ drugName: "IV Fluid Bolus (0.9% NaCl)", dose: "20 mL/kg", notes: "Repeat as needed for shock." });

    doses.push({ drugName: "Dextrose Bolus (for hypoglycemia)", dose: "D10W: 5 mL/kg. D25W: 2 mL/kg.", notes: "Use D10W in neonates/infants."});

    return doses;
  },
  getReferences: () => [
      { title: "Pediatric Endocrine Society: Consensus Statement on the Diagnosis and Treatment of Adrenal Insufficiency", url: "https://academic.oup.com/jcem/article/101/2/364/2804720" }
  ],
};
