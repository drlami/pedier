import type { DiseaseProtocol, FormData, Severity } from './types';

export const epiglottitisProtocol: DiseaseProtocol = {
  id: 'epiglottitis',
  name: 'Epiglottitis',
  system: 'Respiratory',
  description: 'Emergency management of acute epiglottitis.',
  image: {
    url: "https://picsum.photos/seed/epiglottitis/600/400",
    hint: "airway xray"
  },
  questions: [
    { id: 'rapidOnset', questionText: 'Rapid onset of symptoms (over hours)?', type: 'boolean' },
    { id: 'fever', questionText: 'High fever?', type: 'boolean' },
    { id: 'drooling', questionText: 'Drooling or inability to swallow?', type: 'boolean' },
    { id: 'dysphonia', questionText: 'Muffled or "hot potato" voice?', type: 'boolean' },
    { id: 'posture', questionText: 'Sitting in tripod or sniffing position?', type: 'boolean' },
    { id: 'hibVaccinated', questionText: 'Is the child fully vaccinated for Hib?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    // Any case of suspected epiglottitis is a life-threatening emergency.
    const details: string[] = [];
    if (data.drooling) details.push("Drooling");
    if (data.dysphonia) details.push("Dysphonia");
    if (data.posture) details.push("Tripod/sniffing position");
    if (data.rapidOnset) details.push("Rapid onset");

    if (details.length >= 2) {
      return { level: 'impending respiratory failure', details: [...details, "Classic signs present. Immediate action required."] };
    }
    
    return { level: 'severe', details: [...details, "High index of suspicion. Treat as an airway emergency."] };
  },
  getManagement: (severity, data) => {
    return [{
      title: "CRITICAL: AIRWAY EMERGENCY",
      recommendations: [
        "DO NOT attempt to examine the throat or lay the child down.",
        "Allow the child to remain in a position of comfort (usually sitting up).",
        "IMMEDIATELY page Anesthesiology and ENT for a controlled intubation in the Operating Room.",
        "Provide blow-by humidified oxygen if tolerated without causing anxiety.",
        "Defer all other procedures (IV placement, blood draws, imaging) until the airway is secured.",
        "Once airway is secured, begin IV antibiotics (e.g., Ceftriaxone). Consider adding coverage for Staph aureus.",
        "Obtain blood cultures after airway is secured."
      ]
    }];
  },
  getDisposition: (severity, data) => {
    return ["All patients with suspected or confirmed epiglottitis require immediate transfer to the OR for airway management, followed by admission to the PICU."];
  },
  getRedFlags: () => [
    "The 4 D's: Dysphagia (difficulty swallowing), Drooling, Distress, Dysphonia (muffled voice)",
    "Tripod or sniffing position",
    "Rapid onset of high fever and sore throat",
    "Anxious or toxic appearance",
    "ANY suspicion for epiglottitis is a red flag itself."
  ],
  getDrugDoses: () => [
    { drugName: "Ceftriaxone (IV)", dose: "80-100 mg/kg/day, divided q12-24h", notes: "Start immediately after airway is secured." },
    { drugName: "Vancomycin or Clindamycin", dose: "Varies by drug", notes: "Consider adding for Staphylococcal coverage." },
  ],
  getReferences: () => [{ title: "UpToDate: Epiglottitis (supraglottitis): Clinical features and diagnosis", url: "https://www.uptodate.com/contents/epiglottitis-supraglottitis-clinical-features-and-diagnosis" }],
};
