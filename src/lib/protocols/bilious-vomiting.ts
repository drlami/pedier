import type { DiseaseProtocol, FormData, Severity } from './types';

export const biliousVomitingProtocol: DiseaseProtocol = {
  id: 'bilious-vomiting',
  name: 'Bilious Vomiting',
  system: 'Gastrointestinal',
  description: 'Emergency evaluation of bilious (green) vomiting, a sign of intestinal obstruction until proven otherwise. This is a surgical emergency.',
  image: {
    url: "https://picsum.photos/seed/bilious-vomiting/600/400",
    hint: "infant surgery"
  },
  questions: [
    { id: 'ageDays', questionText: 'Age in days', type: 'number' },
    { id: 'abdominalDistention', questionText: 'Is the abdomen distended or tender?', type: 'boolean' },
    { id: 'hemodynamicInstability', questionText: 'Are there signs of shock?', type: 'boolean', info: 'e.g., lethargy, tachycardia, hypotension, poor perfusion.' },
    { id: 'stoolOutput', questionText: 'Has the infant passed stool?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    // Bilious vomiting in a neonate is ALWAYS a surgical emergency.
    const details = ["Bilious vomiting in a neonate suggests malrotation with midgut volvulus until proven otherwise."];
    if (data.hemodynamicInstability) {
        details.push("Patient is hemodynamically unstable, indicating ischemic bowel.");
    }
    return { level: 'severe', details };
  },
  getManagement: (severity, data) => {
    return [{
      title: "SURGICAL EMERGENCY: Suspected Intestinal Obstruction",
      recommendations: [
        "IMMEDIATE surgical consultation is mandatory.",
        "Make patient NPO (nothing by mouth).",
        "Place a nasogastric (NG) or orogastric (OG) tube for gastric decompression.",
        "Obtain IV access and provide aggressive fluid resuscitation with isotonic crystalloids (20 mL/kg bolus, repeat as needed).",
        "Obtain a KUB (abdominal X-ray) to look for signs of obstruction. This should not delay surgical consultation.",
        "The definitive diagnostic test is an Upper GI series, which will be directed by the surgical team. A 'corkscrew' appearance is classic for volvulus.",
        "Prepare for emergency surgery (Ladd's procedure for malrotation)."
      ]
    }];
  },
  getDisposition: (severity, data) => {
    return ["Immediate admission to a surgical service, likely requiring NICU/PICU level care and emergent transfer to a pediatric surgical center if not available."];
  },
  getRedFlags: () => [
    "Any bilious (green) vomiting in an infant is a red flag.",
    "Abdominal distention",
    "Hemodynamic instability (shock)",
    "Bloody stools"
  ],
  getDrugDoses: () => [
    { drugName: "IV Fluid Bolus (NS or LR)", dose: "20 mL/kg", notes: "Repeat as needed to restore perfusion." }
  ],
  getReferences: () => [{ title: "UpToDate: Intestinal malrotation in children", url: "https://www.uptodate.com/contents/intestinal-malrotation-in-children" }],
};
