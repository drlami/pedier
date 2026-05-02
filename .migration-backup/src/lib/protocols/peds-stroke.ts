import type { DiseaseProtocol, FormData, Severity } from './types';

export const pedsStrokeProtocol: DiseaseProtocol = {
  id: 'peds-stroke',
  name: 'Stroke in Children',
  system: 'Neurology',
  description: 'Recognition and initial emergency management of suspected acute stroke in a pediatric patient.',
  image: {
    url: "https://picsum.photos/seed/peds-stroke/600/400",
    hint: "child brain"
  },
  questions: [
    { id: 'acuteDeficit', questionText: 'Acute onset of a focal neurologic deficit?', type: 'boolean', info: 'e.g., unilateral weakness (hemiparesis), facial droop, speech difficulty (aphasia/dysarthria).' },
    { id: 'seizureAtOnset', questionText: 'Seizure at the onset of symptoms?', type: 'boolean' },
    { id: 'headache', questionText: 'Severe headache, especially if sudden?', type: 'boolean' },
    { id: 'alteredMentalStatus', questionText: 'Altered mental status or decreased level of consciousness?', type: 'boolean' },
    { id: 'riskFactors', questionText: 'Any known risk factors for stroke?', type: 'boolean', info: 'e.g., Sickle Cell Disease, congenital heart disease, arteriopathy, recent trauma/infection.' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    // Any suspected stroke is a time-sensitive emergency.
    if (data.acuteDeficit || data.alteredMentalStatus) {
      const details = ["Acute focal deficit or altered mental status is highly suspicious for stroke. This is a time-critical emergency."];
      return { level: 'severe', details };
    }
    return { level: 'unknown', details: ["Assess for key signs to determine stroke likelihood."] };
  },
  getManagement: (severity, data) => {
    return [{
      title: "EMERGENCY: Suspected Pediatric Stroke",
      recommendations: [
        "ACT FAST. Activate your institution's stroke protocol or team immediately.",
        "Stabilize ABCs. Provide oxygen, establish IV access, and place on a cardiac monitor.",
        "Check a rapid blood glucose to rule out hypoglycemia as a mimic.",
        "Obtain URGENT neuroimaging. Non-contrast Head CT is often first to rule out hemorrhage, but MRI/MRA/MRV is the gold standard for diagnosing ischemic stroke and is preferred if rapidly available.",
        "Obtain urgent Neurology and Hematology consultation.",
        "Draw labs: CBC, coagulation panel (PT/INR, PTT), blood type and screen.",
        "Maintain normothermia and normoglycemia.",
        "Do not aggressively lower blood pressure unless it is extremely high (e.g., >99th percentile + 5 mmHg) and there is concern for hemorrhagic conversion, as some hypertension may be permissive.",
        "Specific treatments (e.g., tPA, thrombectomy, aspirin, anticoagulation) will be directed by the Neurology/Stroke team based on imaging results, time of onset, and patient specifics. These are NOT typically initiated in the ED without specialist guidance."
      ]
    }];
  },
  getDisposition: (severity, data) => {
    return ["Immediate admission to the hospital, typically to a PICU, is mandatory for all children with suspected acute stroke to facilitate rapid, coordinated care from a multidisciplinary team."];
  },
  getRedFlags: () => [
    "Sudden onset of unilateral weakness (hemiparesis)",
    "Sudden onset of facial droop",
    "Sudden onset of speech or language disturbance (aphasia, dysarthria)",
    "Sudden severe headache, especially with vomiting or decreased consciousness ('worst headache of life')",
    "Sudden loss of vision or double vision",
    "Seizure with a post-ictal focal deficit (Todd's paralysis) that does not resolve quickly"
  ],
  getDrugDoses: () => [],
  getReferences: () => [{ title: "American Heart Association/American Stroke Association: Management of Stroke in Infants and Children", url: "https://www.ahajournals.org/doi/10.1161/str.0000000000000183" }],
};
