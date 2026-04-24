import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const paracetamolToxicityProtocol: DiseaseProtocol = {
  id: 'paracetamol-toxicity',
  name: 'Paracetamol (Acetaminophen) Toxicity',
  system: 'Toxins and Poisoning',
  description: 'Management of acute acetaminophen overdose using the Rumack-Matthew nomogram and N-acetylcysteine (NAC) therapy.',
  image: {
    url: "https://picsum.photos/seed/paracetamol-toxicity/600/400",
    hint: "liver pills"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'ingestionTime', questionText: 'Time since ingestion (if known)', type: 'number', unit: 'hours', info: 'Must be between 4 and 24 hours for nomogram use.' },
    { id: 'paracetamolLevel', questionText: 'Acetaminophen Level (mcg/mL)', type: 'number', unit: 'mcg/mL' },
    { id: 'isAcuteIngestion', questionText: 'Was this a single, acute ingestion?', type: 'boolean' },
    { id: 'isConcerningHistory', questionText: 'Is there a history of massive ingestion (>30g or 500mg/kg) or unknown time?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const time = Number(data.ingestionTime);
    const level = Number(data.paracetamolLevel);

    if (time >= 4 && time <= 24 && !isNaN(level)) {
        // Treatment line on Rumack-Matthew nomogram (simplified log-linear formula)
        // Treatment if level > 150 mcg/mL at 4 hours or level > 25 mcg/mL at 15 hours
        const treatmentThreshold = 150 * Math.exp(-0.068 * (time - 4));
        if (level >= treatmentThreshold) {
            details.push(`Level of ${level} mcg/mL at ${time} hours is above the treatment line on the Rumack-Matthew nomogram.`);
            return { level: 'severe', details };
        } else {
            details.push(`Level of ${level} mcg/mL at ${time} hours is below the treatment line.`);
            return { level: 'mild', details };
        }
    }
    
    if (data.isConcerningHistory) {
        details.push("History of massive or unknown time of ingestion. Treat empirically.");
        return { level: 'severe', details };
    }
    
    if (time < 4) {
        details.push("Level drawn before 4 hours post-ingestion is not reliable for risk assessment. Re-check at or after 4 hours.");
        return { level: 'moderate', details };
    }

    return { level: 'unknown', details: ["Cannot assess risk. Either level is not available or time is outside 4-24h window."] };
  },
  getManagement: (severity) => {
    const management = [{
        title: "Initial Management",
        recommendations: [
            "Assess ABCs and stabilize the patient.",
            "Consider activated charcoal (1 g/kg) if patient presents within 1-2 hours of a significant ingestion.",
            "Obtain acetaminophen level at 4 hours post-ingestion or as soon as possible thereafter.",
            "Obtain baseline labs: LFTs (AST/ALT), PT/INR, creatinine."
        ]
    }];

    if (severity.level === 'severe') {
      management.push({
        title: "NAC Treatment Indicated",
        recommendations: [
          "Start N-acetylcysteine (NAC) immediately.",
          "The 21-hour IV protocol is most commonly used in the hospital setting.",
          "Continue to monitor LFTs, INR, and creatinine.",
          "Consult toxicology or a poison control center."
        ]
      });
    } else if (severity.level === 'mild') {
        management.push({
        title: "No Treatment Indicated (at this time)",
        recommendations: [
          "NAC is not currently indicated based on the nomogram.",
          "Observe the patient and consider repeating labs if there is any clinical concern.",
        ]
      });
    }

    return management;
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe') {
        return ["Admission to the hospital is required for NAC infusion and monitoring.", "Patients with evidence of hepatic failure require PICU admission and consideration for liver transplant evaluation."];
    }
    if (severity.level === 'moderate') {
        return ["Observe in ED until a 4-hour level can be obtained and risk-stratified."];
    }
    return ["If below the treatment line and asymptomatic, may be medically cleared for discharge after observation."];
  },
  getRedFlags: () => [
    "Acetaminophen level on or above the treatment line on the Rumack-Matthew nomogram.",
    "History of massive ingestion (>30g or 500mg/kg).",
    "Evidence of hepatotoxicity (markedly elevated AST/ALT, elevated INR, jaundice).",
    "Altered mental status (hepatic encephalopathy)."
  ],
  getDrugDoses: () => [
    { drugName: "N-acetylcysteine (NAC) IV - 21-hour protocol", dose: "1. Loading Dose: 150 mg/kg in 200mL D5W over 60 minutes.\n2. Second Dose: 50 mg/kg in 500mL D5W over 4 hours.\n3. Third Dose: 100 mg/kg in 1000mL D5W over 16 hours.", notes: "Doses and fluid volumes may be adjusted for pediatric patients. Consult pharmacy." }
  ],
  getReferences: () => [{ title: "UpToDate: Acetaminophen (paracetamol) poisoning in children and adolescents", url: "https://www.uptodate.com/contents/acetaminophen-paracetamol-poisoning-in-children-and-adolescents" }],
};