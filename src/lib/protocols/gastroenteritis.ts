import type { DiseaseProtocol, FormData, Severity } from './types';

export const gastroenteritisProtocol: DiseaseProtocol = {
  id: 'gastroenteritis',
  name: 'Acute Gastroenteritis / Dehydration',
  description: 'Assessment and management of dehydration from acute gastroenteritis.',
   image: {
    url: "https://picsum.photos/seed/gastroenteritis/600/400",
    hint: "stomach ache"
  },
  questions: [
    { id: 'vomitingFrequency', questionText: 'Vomiting episodes in last 24h', type: 'number' },
    { id: 'diarrheaFrequency', questionText: 'Diarrhea episodes in last 24h', type: 'number' },
    { id: 'oralIntake', questionText: 'Oral Intake', type: 'select', options: [{label: 'Normal', value: 'normal'}, {label: 'Slightly Decreased', value: 'decreased'}, {label: 'Poor/None', value: 'poor'}] },
    { id: 'tears', questionText: 'Tears present when crying?', type: 'select', options: [{label: 'Normal', value: 'present'}, {label: 'Decreased', value: 'decreased'}, {label: 'Absent', value: 'absent'}] },
    { id: 'urineOutput', questionText: 'Urine Output', type: 'select', options: [{label: 'Normal', value: 'normal'}, {label: 'Reduced', value: 'reduced'}, {label: 'None in >8h', value: 'none'}] },
    { id: 'capRefill', questionText: 'Capillary Refill', type: 'select', options: [{label: '< 2 seconds', value: 'normal'}, {label: '2-3 seconds', value: 'delayed'}, {label: '> 3 seconds', value: 'very_delayed'}] },
    { id: 'mentalState', questionText: 'Mental State', type: 'select', options: [{label: 'Alert', value: 'alert'}, {label: 'Irritable/Thirsty', value: 'irritable'}, {label: 'Lethargic/Drowsy', value: 'lethargic'}] },
    { id: 'sunkenEyes', questionText: 'Sunken Eyes?', type: 'boolean' },
    { id: 'skinTurgor', questionText: 'Skin Turgor', type: 'select', options: [{label: 'Normal', value: 'normal'}, {label: 'Reduced (tents briefly)', value: 'reduced'}] },
  ],
  calculateSeverity: (data: FormData): Severity => {
    // Clinical Dehydration Scale (CDS)
    let score = 0;
    const details: string[] = [];

    if (data.mentalState === 'irritable') { score += 1; details.push("Irritable"); }
    if (data.mentalState === 'lethargic') { score += 2; details.push("Lethargic"); }

    if (data.sunkenEyes) { score += 1; details.push("Sunken eyes"); }

    if (data.tears === 'decreased') { score += 1; details.push("Decreased tears"); }
    if (data.tears === 'absent') { score += 2; details.push("Absent tears"); }

    // Using cap refill as a proxy for mucous membranes
    if (data.capRefill === 'delayed') { score += 1; details.push("Delayed cap refill"); }
    if (data.capRefill === 'very_delayed') { score += 2; details.push("Very delayed cap refill"); }

    if (score >= 5) return { level: 'severe', score, details: [...details, "Severe dehydration (>=5)"] };
    if (score >= 1) return { level: 'some', score, details: [...details, "Mild-moderate dehydration (1-4)"] };
    return { level: 'no', score, details: [...details, "No/minimal dehydration (0)"] };
  },
  getManagement: (severity, data) => {
    const management = [];
    if (severity.level === 'no') {
        management.push({ title: "No/Minimal Dehydration", recommendations: [
            "Continue regular diet. Encourage oral fluids.",
            "For ongoing losses: Oral Rehydration Solution (ORS) 10 mL/kg for each diarrheal stool and 2 mL/kg for each emesis.",
            "Consider Ondansetron if vomiting is a barrier to hydration."
        ]});
    }
    if (severity.level === 'some') {
        management.push({ title: "Mild to Moderate Dehydration", recommendations: [
            "Administer Ondansetron ODT.",
            "Begin ORS trial in ED: 5 mL every 2-5 minutes, gradually increasing volume. Goal is 50-100 mL/kg over 4 hours.",
            "If ORS trial fails (persistent vomiting, refusal), consider IV fluid bolus (20 mL/kg NS or LR) and repeat trial.",
        ]});
    }
    if (severity.level === 'severe') {
        management.push({ title: "Severe Dehydration", recommendations: [
            "Administer IV fluid bolus: 20 mL/kg Normal Saline or Lactated Ringer's. May repeat up to 2-3 times.",
            "Correct electrolyte abnormalities (check labs).",
            "Administer Ondansetron IV.",
            "Plan for admission and ongoing IV fluid therapy."
        ]});
    }
    return management;
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
        return ['Admit for IV hydration and monitoring. Consider PICU if in shock.'];
    }
    if (severity.level === 'some') {
        return ['Admit if ORS trial fails, persistent vomiting, or significant comorbidities.', 'Discharge if ORS is tolerated, patient is rehydrated, and caregivers are comfortable.'];
    }
    return ['Discharge home with clear instructions for hydration and diet.'];
  },
  getRedFlags: () => [
    'Signs of shock (lethargy, hypotension, very delayed capillary refill)',
    'Bilious or bloody emesis',
    'Severe abdominal pain',
    'Inability to tolerate any oral intake despite antiemetics',
    'Significant underlying medical condition'
  ],
  getDrugDoses: (severity) => [
      { drugName: "Ondansetron (Zofran)", dose: "0.15 mg/kg (max 8mg) PO/ODT/IV", notes: "Give 15-30 min before attempting ORS" },
      { drugName: "IV Fluid Bolus", dose: "20 mL/kg Normal Saline or Lactated Ringer's", notes: "Administer over 20-60 min, or faster if in shock" }
  ],
  getReferences: () => [{ title: "CDC: Gastroenteritis ('Stomach Flu')", url: "https://www.cdc.gov/gastroenteritis/index.html" }],
};
