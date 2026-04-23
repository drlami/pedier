import type { DiseaseProtocol, FormData, Severity } from './types';

export const tracheitisProtocol: DiseaseProtocol = {
  id: 'tracheitis',
  name: 'Bacterial Tracheitis',
  system: 'Respiratory',
  description: 'Assessment and management of bacterial tracheitis, a severe airway infection.',
  image: {
    url: "https://picsum.photos/seed/tracheitis/600/400",
    hint: "trachea xray"
  },
  questions: [
    { id: 'toxicAppearance', questionText: 'Does the child appear toxic or septic?', type: 'boolean', info: 'High fever, poor perfusion, lethargy' },
    { id: 'croupHistory', questionText: 'History of recent croup-like illness?', type: 'boolean', info: 'Preceded by barky cough and stridor that is now worsening.' },
    { id: 'stridorType', questionText: 'Stridor Character', type: 'select', options: [{label: 'Inspiratory only', value: 'inspiratory'}, {label: 'Biphasic (Inspiratory & Expiratory)', value: 'biphasic'}] },
    { id: 'coughCharacter', questionText: 'Cough Character', type: 'select', options: [{label: 'Barky', value: 'barky'}, {label: 'Productive/purulent', value: 'productive'}] },
    { id: 'rapidProgression', questionText: 'Rapidly progressing symptoms?', type: 'boolean', info: 'Worsening over hours despite croup treatment' },
    { id: 'responseToEpi', questionText: 'Response to nebulized epinephrine?', type: 'select', options: [{label: 'Not given', value: 'none'}, {label: 'Improved', value: 'improved'}, {label: 'No or minimal improvement', value: 'no_improvement'}] },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];

    // Bacterial tracheitis is an airway emergency. Any confirmed case is severe.
    // The scoring here reflects the degree of airway compromise.
    
    if (data.toxicAppearance) details.push("Toxic appearance");
    if (data.stridorType === 'biphasic') details.push("Biphasic stridor");
    if (data.rapidProgression) details.push("Rapidly progressing symptoms");
    if (data.responseToEpi === 'no_improvement') details.push("No improvement with epinephrine");
    
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
        "Minimize agitation. Avoid unnecessary procedures (e.g., IV placement) until airway is secured.",
        "Assemble team for difficult airway management (Anesthesia, ENT, PICU).",
        "Transfer to the OR for controlled intubation, bronchoscopy, and tracheal toilet (debridement of pseudomembranes).",
        "Obtain tracheal cultures during bronchoscopy.",
        "Begin broad-spectrum IV antibiotics covering Staph aureus (including MRSA) and Strep species (e.g., Vancomycin + Ceftriaxone)."
      ]
    }];
  },
  getDisposition: (severity, data) => {
    return ["Immediate admission to the Pediatric Intensive Care Unit (PICU) is required for all suspected or confirmed cases.", "Patient will require intubation, mechanical ventilation, and frequent suctioning."];
  },
  getRedFlags: () => [
    "A croup-like illness that appears toxic",
    "Rapid progression of respiratory distress",
    "Failure to respond to standard croup therapy (dexamethasone, racemic epinephrine)",
    "Change in cough from barky to productive",
    "Change in stridor from inspiratory to biphasic"
  ],
  getDrugDoses: () => [
      { drugName: "Ceftriaxone (IV)", dose: "50-100 mg/kg/day divided QD-BID" },
      { drugName: "Vancomycin (IV)", dose: "40-60 mg/kg/day divided q6-8h", notes: "Essential for MRSA coverage. Dose based on renal function and institutional guidelines." },
      { drugName: "Ampicillin-Sulbactam (IV)", dose: "150-200 mg/kg/day of ampicillin component", notes: "Alternative antibiotic regimen." }
  ],
  getReferences: () => [{ title: "UpToDate: Bacterial Tracheitis in Children", url: "https://www.uptodate.com/contents/bacterial-tracheitis-in-children-clinical-features-and-diagnosis" }],
};
