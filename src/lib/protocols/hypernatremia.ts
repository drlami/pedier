
import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

// Function to calculate Free Water Deficit
const calculateFWD = (weight: number, sodium: number): { deficit: number, correctionRate: string } => {
    if (!weight || !sodium || sodium <= 145) return { deficit: 0, correctionRate: 'N/A' };
    
    // FWD (L) = 0.6 * weight (kg) * [(serum Na / 140) - 1]
    const deficitL = 0.6 * weight * ((sodium / 140) - 1);
    const deficitML = deficitL * 1000;

    // Aim to correct over 48 hours to avoid cerebral edema
    const rate = deficitML / 48;

    return { 
        deficit: Math.round(deficitML),
        correctionRate: `${Math.round(rate)} mL/hr of free water`
    };
};

export const hypernatremiaProtocol: DiseaseProtocol = {
  id: 'hypernatremia',
  name: 'Hypernatremia',
  system: 'Electrolyte Disturbances',
  description: 'Management of high serum sodium, focusing on calculating the free water deficit and correcting slowly to prevent cerebral edema.',
  image: {
    url: "https://picsum.photos/seed/hypernatremia/600/400",
    hint: "brain shrink"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'sodiumLevel', questionText: 'Serum Sodium (Na+)', type: 'number', unit: 'mEq/L' },
    { id: 'hasSevereSymptoms', questionText: 'Are there severe neurologic symptoms?', type: 'boolean', info: 'e.g., altered mental status, seizures, coma.'},
    { id: 'isAcute', questionText: 'Did the hypernatremia develop acutely (< 48 hours)?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const sodium = Number(data.sodiumLevel);
    if (data.hasSevereSymptoms || sodium > 160) {
      return { level: 'severe', details: ["Severe hypernatremia with neurologic symptoms or Na > 160 mEq/L. Requires urgent but cautious correction."] };
    }
    if (sodium > 150) {
      return { level: 'moderate', details: ["Moderate hypernatremia. Requires careful fluid management."] };
    }
    return { level: 'unknown', details: ['Assess serum sodium and symptoms.'] };
  },
  getManagement: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const sodium = Number(data.sodiumLevel) || 0;
    const { deficit, correctionRate } = calculateFWD(weight, sodium);

    const management = [];
    management.push({
        title: "Key Principle: Correct SLOWLY",
        recommendations: [
            "Rapid correction of chronic hypernatremia (>48h duration) can cause a rapid shift of water into brain cells, leading to cerebral edema, seizure, and permanent neurologic injury.",
            "The goal is to lower the serum sodium by no more than 10-12 mEq/L every 24 hours (approx 0.5 mEq/L per hour)."
        ]
    });

    if (severity.level === 'severe' || severity.level === 'moderate') {
        management.push({
            title: "Fluid Management",
            recommendations: [
                `First, restore intravascular volume if patient is in shock or hypovolemic, using isotonic fluid (0.9% Normal Saline).`,
                `Then, calculate the Free Water Deficit (FWD). For this patient: FWD is approximately ${deficit} mL.`,
                `This deficit should be replaced over 48 hours. This requires a rate of ~${correctionRate}, in addition to maintenance fluid needs.`,
                "The fluid used for correction is typically D5W or D5 0.45% NS, depending on the calculated infusion.",
                "Monitor serum sodium every 2-4 hours initially to ensure the rate of correction is appropriate."
            ]
        });
    }

    if (data.isAcute) {
        management.push({
            title: "Acute Hypernatremia Management",
            recommendations: [
                "If hypernatremia developed rapidly (<48h), it can be corrected more quickly, at a rate of 1-2 mEq/L per hour.",
            ]
        });
    }

    return management;
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe' || severity.level === 'moderate') {
      return ["Admission to hospital (PICU for severe cases) is required for careful IV fluid management and frequent electrolyte monitoring."];
    }
    return ["Mild, asymptomatic cases may be managed with oral rehydration and close outpatient follow-up."];
  },
  getRedFlags: () => [
    "Altered mental status, seizure, or coma.",
    "Serum sodium > 160 mEq/L.",
    "Rapidly rising sodium level.",
    "Signs of hypovolemic shock."
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const sodium = Number(data.sodiumLevel) || 0;
    const { deficit } = calculateFWD(weight, sodium);
    return [
      { drugName: "Free Water Deficit Calculation", dose: "0.6 x weight (kg) x [(Na/140) - 1]", notes: weight > 0 && sodium > 145 ? `Calculated deficit: ${deficit} mL. This should be replaced over 48 hours.` : "Enter weight and sodium to calculate." },
      { drugName: "Correction Rate Goal", dose: "≤ 10-12 mEq/L per 24 hours", notes: "To prevent cerebral edema." }
    ];
  },
  getReferences: () => [
    { title: "UpToDate: Treatment of hypernatremia in adults", url: "https://www.uptodate.com/contents/treatment-of-hypernatremia-in-adults" }
  ],
};
