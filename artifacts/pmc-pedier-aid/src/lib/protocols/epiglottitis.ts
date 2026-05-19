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
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'rapidOnset', questionText: 'Rapid onset of symptoms (over hours)?', type: 'boolean' },
    { id: 'fever', questionText: 'High fever?', type: 'boolean' },
    { id: 'drooling', questionText: 'Drooling or inability to swallow?', type: 'boolean' },
    { id: 'dysphonia', questionText: 'Muffled or "hot potato" voice?', type: 'boolean' },
    { id: 'posture', questionText: 'Sitting in tripod or sniffing position?', type: 'boolean' },
    { id: 'stridorDistress', questionText: 'Stridor, severe respiratory distress, cyanosis, or exhaustion?', type: 'boolean' },
    { id: 'toxicAppearance', questionText: 'Toxic/anxious appearance?', type: 'boolean' },
    { id: 'hibVaccinated', questionText: 'Is the child fully vaccinated for Hib?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    // Any case of suspected epiglottitis is a life-threatening emergency.
    const details: string[] = [];
    if (data.drooling) details.push("Drooling");
    if (data.dysphonia) details.push("Dysphonia");
    if (data.posture) details.push("Tripod/sniffing position");
    if (data.rapidOnset) details.push("Rapid onset");
    if (data.stridorDistress) details.push("Stridor/severe distress/cyanosis/exhaustion");
    if (data.toxicAppearance) details.push("Toxic or anxious appearance");

    if (data.stridorDistress || details.length >= 2) {
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
        "Keep caregiver with child when possible and minimize agitation, separation, IV attempts, blood draws, and imaging until airway team is present.",
        "IMMEDIATELY page Anesthesiology, ENT, PICU, and senior pediatrician for controlled airway management in the safest available setting.",
        "Prepare difficult airway equipment and surgical airway backup before any forced examination or procedure.",
        "Provide blow-by humidified oxygen if tolerated without causing anxiety.",
        "Defer all other procedures (IV placement, blood draws, imaging) until the airway is secured.",
        "Once airway is secured, begin IV antibiotics (e.g., Ceftriaxone or Cefotaxime). Consider Vancomycin or Clindamycin if MRSA/Staph aureus concern.",
        "Obtain blood cultures after airway is secured."
      ]
    }];
  },
  getDisposition: (severity, data) => {
    return ["All patients with suspected or confirmed epiglottitis require expert airway management in the safest available controlled setting, followed by PICU admission.", "Do not transfer away from monitored emergency care without an airway-capable team if respiratory distress is present."];
  },
  getRedFlags: () => [
    "The 4 D's: Dysphagia (difficulty swallowing), Drooling, Distress, Dysphonia (muffled voice)",
    "Tripod or sniffing position",
    "Rapid onset of high fever and sore throat",
    "Anxious or toxic appearance",
    "ANY suspicion for epiglottitis is a red flag itself."
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const ceftriaxoneMin = weight > 0 ? (80 * weight).toFixed(0) : "";
    const ceftriaxoneMax = weight > 0 ? (100 * weight).toFixed(0) : "";
    const cefotaximeMin = weight > 0 ? (150 * weight).toFixed(0) : "";
    const cefotaximeMax = weight > 0 ? (200 * weight).toFixed(0) : "";
    const vancomycinMin = weight > 0 ? (40 * weight).toFixed(0) : "";
    const vancomycinMax = weight > 0 ? (60 * weight).toFixed(0) : "";
    const clindamycin = weight > 0 ? Math.min(40 * weight, 2700).toFixed(0) : "";

    return [
      { drugName: "Ceftriaxone (IV)", dose: weight > 0 ? `80-100 mg/kg/day = ${ceftriaxoneMin}-${ceftriaxoneMax} mg/day divided q12-24h` : "80-100 mg/kg/day divided q12-24h", notes: "Start immediately after airway is secured." },
      { drugName: "Cefotaxime (IV)", dose: weight > 0 ? `150-200 mg/kg/day = ${cefotaximeMin}-${cefotaximeMax} mg/day divided q6-8h` : "150-200 mg/kg/day divided q6-8h", notes: "Alternative third-generation cephalosporin depending on local policy." },
      { drugName: "Vancomycin (IV)", dose: weight > 0 ? `40-60 mg/kg/day = ${vancomycinMin}-${vancomycinMax} mg/day divided q6-8h` : "40-60 mg/kg/day divided q6-8h", notes: "Add if MRSA/Staph aureus concern; adjust to renal function and local monitoring policy." },
      { drugName: "Clindamycin (IV)", dose: weight > 0 ? `30-40 mg/kg/day (max commonly 2700 mg/day) = up to ${clindamycin} mg/day divided q6-8h` : "30-40 mg/kg/day divided q6-8h", notes: "Alternative/additional Staph/Strep coverage depending on local policy." },
    ];
  },
  getReferences: () => [{ title: "UpToDate: Epiglottitis (supraglottitis): Clinical features and diagnosis", url: "https://www.uptodate.com/contents/epiglottitis-supraglottitis-clinical-features-and-diagnosis" }],
};
