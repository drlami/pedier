import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const bradycardiaProtocol: DiseaseProtocol = {
  id: 'bradycardia',
  name: 'Bradycardia with a Pulse Algorithm',
  system: 'Shock and Resuscitation',
  description: 'A guide to the PALS algorithm for managing pediatric bradycardia with a pulse, focusing on identifying and treating cardiopulmonary compromise.',
  image: {
    url: "https://picsum.photos/seed/bradycardia/600/400",
    hint: "slow heartbeat"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'isCompromised', questionText: 'Is there cardiopulmonary compromise?', type: 'boolean', info: 'e.g., Hypotension, acutely altered mental status, or signs of shock.' },
    { id: 'heartRate', questionText: 'Heart Rate', type: 'number', unit: 'bpm', info: 'Especially note if HR < 60 bpm with poor perfusion.' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    if (data.isCompromised) {
        const details = ["Patient has cardiopulmonary compromise. This is a life-threatening emergency."];
        if (Number(data.heartRate) < 60) {
            details.push("Heart rate < 60 bpm with poor perfusion despite oxygenation and ventilation warrants starting CPR.");
        }
        return { level: 'severe', details };
    }
    return { level: 'moderate', details: ["Bradycardia without compromise. Identify and treat the underlying cause."] };
  },
  getManagement: (severity) => {
    switch (severity.level) {
      case 'severe':
        return [{
          title: "Bradycardia with Compromise Management",
          recommendations: [
            "Maintain airway, assist breathing as needed with bag-mask ventilation, and provide oxygen.",
            "If HR remains < 60/min with poor perfusion despite effective oxygenation and ventilation, START CPR.",
            "Administer Adrenaline IV/IO.",
            "Adrenaline Preparation (1:1,000 Stock): Dilute 1 mL (1 mg) Adrenaline with 9 mL NS to make 10 mL of 0.1 mg/mL (1:10,000).",
            "Consider Atropine for increased vagal tone or primary AV block.",
            "Consider transcutaneous pacing.",
            "Continue CPR, give Adrenaline every 3-5 minutes, and search for and treat underlying causes (H's and T's)."
          ]
        }];
      case 'moderate':
        return [{
          title: "Bradycardia without Compromise Management",
          recommendations: [
            "Maintain airway and assist breathing as needed.",
            "Provide supplemental oxygen and place on cardiac monitor.",
            "Obtain IV/IO access.",
            "Search for and treat underlying causes (e.g., hypoxia, acidosis, hypothermia, heart block, toxins).",
            "Obtain 12-lead EKG and consult Pediatric Cardiology."
          ]
        }];
      default:
        return [];
    }
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe') {
      return ["Immediate admission to PICU is required."];
    }
    return ["Admission for monitoring and evaluation by Cardiology is required to determine the underlying cause."];
  },
  getRedFlags: () => [
    "Heart rate < 60/min with poor perfusion",
    "Hypotension",
    "Altered mental status",
    "Signs of shock (cool, clammy skin, delayed cap refill)",
    "Sudden collapse"
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (weight > 0) {
        doses.push({
            drugName: "Adrenaline 0.1 mg/mL (1:10,000 diluted)",
            dose: `0.1 mL/kg. Calculated dose: ${(0.1 * weight).toFixed(2)} mL.`,
            notes: `Repeat every 3-5 minutes. (Stock 1:1,000 MUST be diluted 1:10 first).`
        });
        doses.push({
            drugName: "Atropine",
            dose: `0.02 mg/kg (Min dose 0.1 mg, Max single dose 0.5 mg). May repeat once.`,
            notes: `Calculated Dose: ${(0.02 * weight).toFixed(2)} mg. Primarily for increased vagal tone or AV block.`
        });
    } else {
        doses.push({ drugName: "Adrenaline 0.1 mg/mL (1:10,000)", dose: `0.1 mL/kg IV/IO.`, notes: "Dilute 1mg Adrenaline (1:1,000) with 9mL NS." });
        doses.push({ drugName: "Atropine", dose: `0.02 mg/kg (Min 0.1mg, Max 0.5mg).` });
    }
    return doses;
  },
  getReferences: () => [{ title: "PALS Provider Manual (American Heart Association)", url: "https://shopcpr.heart.org/pals-provider-manual" }],
};
