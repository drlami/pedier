import type { DiseaseProtocol, FormData, Severity } from './types';

export const tracheitisProtocol: DiseaseProtocol = {
  id: 'tracheitis',
  name: 'Bacterial Tracheitis',
  system: 'Respiratory System',
  description: 'Assessment and management of bacterial tracheitis, a severe airway infection.',
  image: {
    url: "https://picsum.photos/seed/tracheitis/600/400",
    hint: "trachea xray"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'toxicAppearance', questionText: 'Does the child appear toxic or septic?', type: 'boolean', info: 'High fever, poor perfusion, lethargy' },
    { id: 'croupHistory', questionText: 'History of recent croup-like illness?', type: 'boolean', info: 'Preceded by barky cough and stridor that is now worsening.' },
    { id: 'stridorType', questionText: 'Stridor Character', type: 'select', options: [{label: 'Inspiratory only', value: 'inspiratory'}, {label: 'Biphasic (Inspiratory & Expiratory)', value: 'biphasic'}] },
    { id: 'coughCharacter', questionText: 'Cough Character', type: 'select', options: [{label: 'Barky', value: 'barky'}, {label: 'Productive/purulent', value: 'productive'}] },
    { id: 'rapidProgression', questionText: 'Rapidly progressing symptoms?', type: 'boolean', info: 'Worsening over hours despite croup treatment' },
    { id: 'responseToEpi', questionText: 'Response to nebulized epinephrine?', type: 'select', options: [{label: 'Not given', value: 'none'}, {label: 'Improved', value: 'improved'}, {label: 'No or minimal improvement', value: 'no_improvement'}] },
    { id: 'airwayCompromise', questionText: 'Severe airway compromise?', type: 'boolean', info: 'Marked distress, cyanosis, exhaustion, altered mental status, poor air entry, or rapidly worsening obstruction.' },
    { id: 'oxygenSaturation', questionText: 'Oxygen Saturation', type: 'number', unit: '%' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];

    // Bacterial tracheitis is an airway emergency. Any confirmed case is severe.
    // The scoring here reflects the degree of airway compromise.
    
    if (data.toxicAppearance) details.push("Toxic appearance");
    if (data.stridorType === 'biphasic') details.push("Biphasic stridor");
    if (data.rapidProgression) details.push("Rapidly progressing symptoms");
    if (data.responseToEpi === 'no_improvement') details.push("No improvement with epinephrine");
    if (data.airwayCompromise) details.push("Severe airway compromise");
    if (Number(data.oxygenSaturation) < 92) details.push("Hypoxemia");
    
    if (data.airwayCompromise || Number(data.oxygenSaturation) < 90) {
       return { level: 'impending respiratory failure', details };
    }
    if (details.length > 1) {
       return { level: 'severe', details };
    }
    
    details.push("High index of suspicion for tracheitis. Treat as an airway emergency.");
    return { level: 'moderate', details };
  },
  getManagement: (severity, data) => {
    return [{
      title: "Emergency Management",
      recommendations: [
        "This is an airway emergency. Maintain a position of comfort.",
        "Minimize agitation and keep caregiver present when possible.",
        "Assemble team for difficult airway management (Anesthesia, ENT, PICU).",
        "If severe distress, hypoxemia, exhaustion, or altered mental status: controlled intubation/bronchoscopy should not be delayed.",
        "If stable while airway team assembles, obtain IV access carefully and start IV antibiotics without provoking agitation.",
        "Transfer to the safest controlled setting for intubation, bronchoscopy, and tracheal toilet (debridement of pseudomembranes).",
        "Obtain tracheal cultures during bronchoscopy.",
        "Begin broad-spectrum IV antibiotics covering Staph aureus including MRSA, Streptococcus species, H. influenzae, and Moraxella according to local policy."
      ]
    }];
  },
  getDisposition: (severity, data) => {
    return ["Immediate PICU admission is required for all suspected or confirmed bacterial tracheitis.", "Many patients require intubation, mechanical ventilation, bronchoscopy, and frequent suctioning; do not manage in an unmonitored setting."];
  },
  getRedFlags: () => [
    "A croup-like illness that appears toxic",
    "Rapid progression of respiratory distress",
    "Failure to respond to standard croup therapy (dexamethasone, racemic epinephrine)",
    "Change in cough from barky to productive",
    "Change in stridor from inspiratory to biphasic"
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const cefMin = weight > 0 ? (50 * weight).toFixed(0) : "";
    const cefMax = weight > 0 ? (100 * weight).toFixed(0) : "";
    const vancMin = weight > 0 ? (40 * weight).toFixed(0) : "";
    const vancMax = weight > 0 ? (60 * weight).toFixed(0) : "";
    const ampSulbMin = weight > 0 ? (150 * weight).toFixed(0) : "";
    const ampSulbMax = weight > 0 ? (200 * weight).toFixed(0) : "";
    const clinda = weight > 0 ? Math.min(40 * weight, 2700).toFixed(0) : "";

    return [
      { drugName: "Ceftriaxone (IV)", dose: weight > 0 ? `50-100 mg/kg/day = ${cefMin}-${cefMax} mg/day divided QD-BID` : "50-100 mg/kg/day divided QD-BID" },
      { drugName: "Vancomycin (IV)", dose: weight > 0 ? `40-60 mg/kg/day = ${vancMin}-${vancMax} mg/day divided q6-8h` : "40-60 mg/kg/day divided q6-8h", notes: "Essential for MRSA coverage when indicated. Dose based on renal function, levels, and institutional guidelines." },
      { drugName: "Ampicillin-Sulbactam (IV)", dose: weight > 0 ? `150-200 mg/kg/day of ampicillin component = ${ampSulbMin}-${ampSulbMax} mg/day divided q6h` : "150-200 mg/kg/day of ampicillin component divided q6h", notes: "Alternative regimen depending on local policy and MRSA risk." },
      { drugName: "Clindamycin (IV)", dose: weight > 0 ? `30-40 mg/kg/day (max commonly 2700 mg/day) = up to ${clinda} mg/day divided q6-8h` : "30-40 mg/kg/day divided q6-8h", notes: "Alternative/additional Staph/Strep coverage depending on local resistance and senior advice." }
    ];
  },
  getReferences: () => [{ title: "UpToDate: Bacterial Tracheitis in Children", url: "https://www.uptodate.com/contents/bacterial-tracheitis-in-children-clinical-features-and-diagnosis" }],
};
