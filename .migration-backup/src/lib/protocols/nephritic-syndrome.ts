import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const nephriticSyndromeProtocol: DiseaseProtocol = {
  id: 'nephritic-syndrome',
  name: 'Acute Glomerulonephritis',
  system: 'Nephrology',
  description: 'Evaluation and management of acute glomerulonephritis (nephritic syndrome), characterized by hematuria, edema, and hypertension. Often post-infectious (e.g., post-streptococcal).',
  image: {
    url: "https://picsum.photos/seed/nephritic/600/400",
    hint: "red urine"
  },
  questions: [
    { id: 'hasHematuria', questionText: 'Is there gross hematuria (red, brown, or tea-colored urine)?', type: 'boolean' },
    { id: 'hasHypertension', questionText: 'Is there hypertension?', type: 'boolean' },
    { id: 'hasEdema', questionText: 'Is there edema (periorbital or peripheral)?', type: 'boolean' },
    { id: 'hasOliguria', questionText: 'Is there decreased urine output (oliguria)?', type: 'boolean' },
    { id: 'hasRecentInfection', questionText: 'History of recent streptococcal pharyngitis or impetigo (1-3 weeks prior)?', type: 'boolean' },
    { id: 'hasSevereSymptoms', questionText: 'Are there signs of hypertensive emergency (seizure, headache, AMS) or severe fluid overload (pulmonary edema)?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details = [];
    const hasClassicTriad = data.hasHematuria && data.hasHypertension && data.hasEdema;

    if (data.hasSevereSymptoms) {
      details.push("Life-threatening complications are present (hypertensive emergency, pulmonary edema).");
      return { level: 'severe', details };
    }

    if (hasClassicTriad) {
      details.push("Classic triad of hematuria, hypertension, and edema is present.");
      if (data.hasOliguria) {
        details.push("Oliguria indicates significant renal impairment.");
        return { level: 'moderate', details };
      }
      return { level: 'moderate', details };
    }

    return { level: 'mild', details: ["Atypical presentation or mild disease. Requires workup."] };
  },
  getManagement: (severity, data) => {
    const management = [{
      title: "Initial Workup",
      recommendations: [
        "Obtain vital signs, with careful attention to blood pressure.",
        "Obtain IV access and send labs: BMP (for creatinine and electrolytes), CBC, ASO and anti-DNAse B titers (for strep), C3/C4 complement levels (C3 is typically low in PSGN).",
        "Obtain a urinalysis with microscopy to confirm hematuria and look for red blood cell casts."
      ]
    }];

    if (severity.level === 'severe') {
      management.push({
        title: "Management of Severe Complications",
        recommendations: [
          "Hypertensive Emergency: Treat immediately with IV antihypertensives (Labetalol, Nicardipine). Admit to PICU.",
          "Pulmonary Edema: Provide respiratory support (oxygen, NIPPV) and administer high-dose IV Furosemide.",
          "Acute Renal Failure with Anuria: Requires urgent nephrology consultation for potential dialysis."
        ]
      });
    } else {
        management.push({
        title: "Supportive Management",
        recommendations: [
            "Control Blood Pressure: Use oral antihypertensives like Nifedipine or Labetalol for non-emergent hypertension.",
            "Manage Fluid Overload: Administer IV or oral Furosemide. Institute strict fluid and sodium restriction.",
            "There is no specific treatment for post-streptococcal glomerulonephritis (PSGN); management is supportive."
        ]
      });
    }

    return management;
  },
  getDisposition: (severity, data) => {
    return ["All patients with acute glomerulonephritis require hospital admission to monitor and manage blood pressure, fluid status, and renal function.", "Patients with severe complications require PICU admission."];
  },
  getRedFlags: () => [
    "Hypertensive emergency (BP >99th percentile + 5 mmHg with signs of end-organ damage)",
    "Pulmonary edema / respiratory distress",
    "Oliguria or anuria",
    "Rapidly rising creatinine",
    "Altered mental status or seizures"
  ],
  getDrugDoses: () => [
    { drugName: "Furosemide (IV)", dose: "1-2 mg/kg/dose", notes: "For edema and hypertension." },
    { drugName: "Nifedipine (oral, immediate release)", dose: "0.25-0.5 mg/kg/dose", notes: "For urgent but non-emergent hypertension." },
    { drugName: "Labetalol (IV)", dose: "0.2-1 mg/kg bolus or 0.25-3 mg/kg/hr infusion", notes: "For hypertensive emergency." },
  ],
  getReferences: () => [{ title: "UpToDate: Poststreptococcal glomerulonephritis", url: "https://www.uptodate.com/contents/poststreptococcal-glomerulonephritis" }],
};
