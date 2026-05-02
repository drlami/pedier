import type { DiseaseProtocol, FormData, Severity } from './types';

export const intussusceptionProtocol: DiseaseProtocol = {
  id: 'intussusception',
  name: 'Intussusception',
  system: 'Gastrointestinal',
  description: 'Evaluation and management of intussusception, a common cause of bowel obstruction in children aged 6 months to 3 years.',
  image: {
    url: "https://picsum.photos/seed/intussusception/600/400",
    hint: "abdominal ultrasound"
  },
  questions: [
    { id: 'ageMonths', questionText: 'Age in months', type: 'number' },
    { id: 'intermittentPain', questionText: 'Episodes of sudden, severe, colicky abdominal pain?', type: 'boolean', info: 'Child may draw knees to chest and cry, then appear normal between episodes.'},
    { id: 'lethargy', questionText: 'Lethargy or altered mental status, sometimes alternating with pain episodes?', type: 'boolean' },
    { id: 'bloodyStool', questionText: 'Bloody stool, or "currant jelly" stool?', type: 'boolean' },
    { id: 'sausageMass', questionText: 'Sausage-shaped mass palpated in the abdomen?', type: 'boolean' },
    { id: 'peritonitis', questionText: 'Signs of peritonitis?', type: 'boolean', info: 'e.g., abdominal rigidity, rebound tenderness, guarding, fever.' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details = [];
    const hasClassicSigns = data.intermittentPain || data.bloodyStool || data.sausageMass;
    
    if (data.peritonitis) {
      details.push("Signs of peritonitis suggest bowel perforation, a surgical emergency.");
      return { level: 'severe', details };
    }
    
    if (hasClassicSigns || data.lethargy) {
      if (data.intermittentPain) details.push("Colicky abdominal pain");
      if (data.lethargy) details.push("Lethargy");
      if (data.bloodyStool) details.push("Currant jelly stool");
      details.push("High suspicion for intussusception.");
      return { level: 'moderate', details };
    }
    
    return { level: 'unknown', details: ["Assess for key symptoms to determine risk."] };
  },
  getManagement: (severity, data) => {
    if (severity.level === 'severe') {
      return [{
        title: "EMERGENCY: Perforated Intussusception",
        recommendations: [
          "This is a surgical emergency. IMMEDIATE surgical consultation.",
          "Make patient NPO, place NG tube, start aggressive IV fluid resuscitation, and administer broad-spectrum IV antibiotics (covering anaerobes).",
          "DO NOT attempt enema reduction.",
          "Prepare for emergent surgical resection."
        ]
      }];
    }
    if (severity.level === 'moderate') {
      return [{
        title: "Management of Uncomplicated Intussusception",
        recommendations: [
          "Consult Pediatric Surgery and Radiology.",
          "Make patient NPO and start IV fluids.",
          "Abdominal ultrasound is the primary diagnostic modality ('target sign').",
          "If confirmed, the patient should undergo a non-operative reduction via therapeutic air or contrast enema, performed by a radiologist.",
          "The surgical team must be available in case of perforation during the procedure or failure of reduction."
        ]
      }];
    }
    return [];
  },
  getDisposition: (severity, data) => {
    return ["All patients with suspected or confirmed intussusception require hospital admission.", "Patients with perforation require PICU/surgical admission. Others are admitted for observation post-reduction."];
  },
  getRedFlags: () => [
    "Signs of peritonitis (guarding, rigidity, rebound tenderness)",
    "Signs of shock (hypotension, tachycardia, poor perfusion)",
    "Fever",
    "The classic triad: intermittent colicky pain, vomiting, and bloody 'currant jelly' stools."
  ],
  getDrugDoses: () => [
      { drugName: "IV Fluid Bolus (NS or LR)", dose: "20 mL/kg", notes: "Repeat as needed." },
      { drugName: "Piperacillin-Tazobactam (IV)", dose: "100 mg/kg/dose", notes: "For suspected perforation." }
  ],
  getReferences: () => [{ title: "UpToDate: Intussusception in children", url: "https://www.uptodate.com/contents/intussusception-in-children" }],
};
