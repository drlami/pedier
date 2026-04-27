
import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

const calculateCorrectedCalcium = (totalCalcium: number, albumin: number): { correctedCa: number, notes: string } => {
    if (isNaN(totalCalcium) || isNaN(albumin)) return { correctedCa: 0, notes: "Enter Total Calcium and Albumin." };
    // Corrected Ca = Measured Total Ca + 0.8 * (4.0 - serum albumin)
    const correctedCa = totalCalcium + 0.8 * (4.0 - albumin);
    return { 
        correctedCa: Number(correctedCa.toFixed(2)),
        notes: `A normal albumin is ~4.0 g/dL. Low albumin falsely lowers total calcium.`
    };
};

export const hypocalcemiaProtocol: DiseaseProtocol = {
  id: 'hypocalcemia',
  name: 'Hypocalcemia',
  system: 'Electrolyte Disturbances',
  description: 'Management of low serum calcium.',
  image: {
    url: "https://picsum.photos/seed/hypocalcemia/600/400",
    hint: "tetany hand"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'totalCalcium', questionText: 'Total Serum Calcium', type: 'number', unit: 'mg/dL' },
    { id: 'albumin', questionText: 'Serum Albumin', type: 'number', unit: 'g/dL' },
    { id: 'ionizedCalcium', questionText: 'Ionized Calcium (if available)', type: 'number', unit: 'mg/dL' },
    { id: 'hasSevereSymptoms', questionText: 'Are there severe symptoms?', type: 'boolean', info: 'e.g., Seizures, tetany (carpopedal spasm), laryngospasm, EKG changes (prolonged QT).'},
  ],
  calculateSeverity: (data: FormData): Severity => {
    const { correctedCa } = calculateCorrectedCalcium(Number(data.totalCalcium), Number(data.albumin));
    const ionizedCa = Number(data.ionizedCalcium);

    if (data.hasSevereSymptoms) {
      return { level: 'severe', details: ["Symptomatic hypocalcemia is a medical emergency requiring IV calcium."] };
    }
    
    // Use ionized calcium if available, as it's the most accurate measure. Normal ~4.4-5.2 mg/dL.
    if (!isNaN(ionizedCa) && ionizedCa < 4.0) {
       return { level: 'moderate', details: [`Ionized calcium is low at ${ionizedCa} mg/dL. Requires treatment.`] };
    }

    // Use corrected calcium if ionized is not available. Normal ~8.5-10.5 mg/dL.
    if (correctedCa > 0 && correctedCa < 8.0) {
        return { level: 'moderate', details: [`Corrected calcium is low at ${correctedCa} mg/dL. Requires treatment.`] };
    }

    if (correctedCa > 0 && correctedCa < 8.5) {
       return { level: 'mild', details: [`Corrected calcium is mildly low at ${correctedCa} mg/dL.`] };
    }

    return { level: 'unknown', details: ['Assess calcium and albumin levels and for symptoms.'] };
  },
  getManagement: (severity) => {
    const management = [];
    if (severity.level === 'severe') {
        management.push({
            title: "Management of Severe / Symptomatic Hypocalcemia",
            recommendations: [
                "This is a medical emergency. Place patient on a cardiac monitor.",
                "Administer CALCIUM GLUCONATE 10% IV slowly over 10 minutes. Rapid infusion can cause bradycardia or asystole.",
                "After the initial bolus, a continuous infusion of calcium may be needed.",
                "Check serum magnesium level. Hypomagnesemia causes hypocalcemia and must be corrected for calcium levels to normalize.",
                "Investigate underlying cause (e.g., hypoparathyroidism, Vitamin D deficiency, renal failure)."
            ]
        });
    } else { // Mild/Moderate
         management.push({
            title: "Management of Mild / Asymptomatic Hypocalcemia",
            recommendations: [
                "Oral calcium supplementation is appropriate.",
                "Calcium Carbonate is a common choice.",
                "Vitamin D supplementation is often required as well.",
                "Address and treat the underlying cause.",
                "Ensure close outpatient follow-up with primary care or endocrinology."
            ]
        });
    }
    return management;
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe') {
      return ["Admission to a monitored bed (PICU) is required for IV calcium administration."];
    }
    return ["Outpatient management is appropriate for mild, asymptomatic cases with a clear plan for follow-up."];
  },
  getRedFlags: () => [
    "Seizures",
    "Tetany or laryngospasm",
    "Prolonged QT interval on EKG",
    "Hypotension",
    "Concomitant critical illness"
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const totalCa = Number(data.totalCalcium) || 0;
    const albumin = Number(data.albumin) || 0;
    const { correctedCa, notes } = calculateCorrectedCalcium(totalCa, albumin);

    const doses: DrugDose[] = [];

    doses.push({ drugName: "Corrected Calcium Formula", dose: "Total Ca + 0.8 * (4.0 - Albumin)", notes: totalCa > 0 && albumin > 0 ? `Calculated Corrected Calcium: ${correctedCa} mg/dL. ${notes}` : notes });
    
    if (weight > 0) {
        doses.push({ drugName: "Calcium Gluconate 10% (IV)", dose: `0.5 - 1 mL/kg = ${(0.5*weight).toFixed(1)} - ${Math.min(1*weight, 20).toFixed(1)} mL`, notes: "IV slowly over 10 min. For severe/symptomatic cases. Contains 9.3 mg elemental Ca per mL." });
        doses.push({ drugName: "Calcium Chloride 10% (IV)", dose: `0.1 - 0.2 mL/kg = ${(0.1*weight).toFixed(1)} - ${Math.min(0.2*weight, 10).toFixed(1)} mL`, notes: "Use with extreme caution, preferably via central line as it is sclerosing. Contains 27.3 mg elemental Ca per mL." });
        doses.push({ drugName: "Oral Calcium Carbonate", dose: `40-80 mg/kg/day = ${(40*weight).toFixed(0)} - ${(80*weight).toFixed(0)} mg/day`, notes: "Dose of elemental calcium, divided TID-QID. For mild/asymptomatic cases." });
    } else {
        doses.push({ drugName: "Calcium Gluconate 10% (IV)", dose: "0.5 - 1 mL/kg (max 20 mL) IV slowly over 10 min", notes: "For severe/symptomatic cases. Contains 9.3 mg elemental Ca per mL." });
        doses.push({ drugName: "Calcium Chloride 10% (IV)", dose: "0.1 - 0.2 mL/kg (max 10 mL) IV slowly over 10 min", notes: "Use with extreme caution, preferably via central line as it is sclerosing. Contains 27.3 mg elemental Ca per mL." });
        doses.push({ drugName: "Oral Calcium Carbonate", dose: "40-80 mg/kg/day of elemental calcium, divided TID-QID.", notes: "For mild/asymptomatic cases." });
    }

    return doses;
  },
  getReferences: () => [
      { title: "UpToDate: Treatment of hypocalcemia", url: "https://www.uptodate.com/contents/treatment-of-hypocalcemia" }
  ],
};
