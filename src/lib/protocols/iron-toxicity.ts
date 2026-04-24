import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const ironToxicityProtocol: DiseaseProtocol = {
  id: 'iron-toxicity',
  name: 'Iron Toxicity',
  system: 'Toxins and Poisoning',
  description: 'Management of acute iron poisoning. Doses <20 mg/kg of elemental iron are non-toxic. 20-60 mg/kg can cause GI symptoms. >60 mg/kg is potentially lethal. This protocol guides risk stratification, GI decontamination, and chelation therapy.',
  image: {
    url: "https://picsum.photos/seed/iron-toxicity/600/400",
    hint: "iron pills"
  },
  questions: [
    { id: 'elementalIron', questionText: 'Estimated elemental iron ingested', type: 'number', unit: 'mg/kg' },
    { id: 'serumIron', questionText: 'Peak serum iron level (drawn 4-6h post-ingestion)', type: 'number', unit: 'mcg/dL' },
    { id: 'hasSevereSymptoms', questionText: 'Are there signs of severe toxicity?', type: 'boolean', info: 'e.g., lethargy, coma, shock, metabolic acidosis, significant GI bleeding.' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const ingestedDose = Number(data.elementalIron);
    const serumLevel = Number(data.serumIron);

    if (data.hasSevereSymptoms || serumLevel > 500) {
      details.push("Severe systemic toxicity present. Chelation is indicated.");
      return { level: 'severe', details };
    }
    if (ingestedDose > 60) {
      details.push("Ingested dose > 60 mg/kg is potentially lethal.");
      return { level: 'severe', details };
    }
    if ((ingestedDose >= 20 && ingestedDose <= 60) || (serumLevel >= 350 && serumLevel <= 500)) {
      details.push("Moderate ingestion/serum level. High risk for systemic toxicity.");
      return { level: 'moderate', details };
    }
    if (ingestedDose < 20) {
      details.push("Ingestion < 20 mg/kg is unlikely to cause systemic toxicity.");
      return { level: 'mild', details };
    }
    return { level: 'unknown', details: ["Risk stratification based on ingested dose and serum levels."] };
  },
  getManagement: (severity) => {
    const stages = "Stage 1 (0-6h): GI toxicity (vomiting, diarrhea, bleeding).\nStage 2 (6-24h): Latent phase (apparent improvement).\nStage 3 (12-48h): Shock, metabolic acidosis, coagulopathy.\nStage 4 (2-4d): Hepatic failure.\nStage 5 (2-6wk): Gastric outlet obstruction.";
    const management = [{ title: "Stages of Iron Toxicity", recommendations: [stages]}];
    
    if (severity.level === 'severe' || severity.level === 'moderate') {
      management.push({
        title: "Management of Significant Iron Poisoning",
        recommendations: [
          "Aggressive fluid resuscitation for shock.",
          "Obtain labs: Serum iron level (peak at 4-6h), CBC, electrolytes, LFTs, coagulation panel, blood gas, type and screen.",
          "Obtain abdominal X-ray to look for remaining iron tablets (most are radiopaque).",
          "For large ingestions, consider Whole Bowel Irrigation (WBI) with polyethylene glycol via NG tube until rectal effluent is clear.",
          "Initiate IV chelation with Deferoxamine for severe toxicity."
        ]
      });
    } else {
        management.push({
        title: "Management of Mild/Asymptomatic Ingestion",
        recommendations: [
            "Observe for development of GI symptoms for 6 hours.",
            "If asymptomatic after 6 hours with a minor ingestion, may be discharged.",
        ]
      });
    }

    return management;
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe' || severity.level === 'moderate') {
      return ["Admit to hospital (PICU for severe cases) for monitoring, WBI, and/or chelation therapy."];
    }
    return ["Discharge after 6-hour observation if asymptomatic from a minor ingestion."];
  },
  getRedFlags: () => [
    "Ingestion of >60 mg/kg of elemental iron.",
    "Peak serum iron level > 500 mcg/dL.",
    "Signs of shock, altered mental status, or severe metabolic acidosis.",
    "Persistent vomiting or diarrhea."
  ],
  getDrugDoses: () => [
    { drugName: "Deferoxamine (IV)", dose: "15 mg/kg/hr continuous infusion.", notes: "Indications: severe symptoms (shock, coma, acidosis), peak serum iron > 500 mcg/dL. Continue until patient is asymptomatic and urine is normal color ('vin rosé' color indicates chelation)." },
    { drugName: "Whole Bowel Irrigation (PEG)", dose: "1-2 L/hr in adults/adolescents; 25-40 mL/kg/hr in children.", notes: "Continue until rectal effluent is clear." }
  ],
  getReferences: () => [{ title: "UpToDate: Acute iron poisoning", url: "https://www.uptodate.com/contents/acute-iron-poisoning" }],
};
