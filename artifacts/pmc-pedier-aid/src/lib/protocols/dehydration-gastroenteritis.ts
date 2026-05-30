import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

export const dehydrationGastroenteritisProtocol: DiseaseProtocol = {
  id: 'dehydration-gastroenteritis',
  name: 'Dehydration (Gastroenteritis)',
  system: 'Gastrointestinal',
  description: 'Assessment and management of dehydration using the 4-item Clinical Dehydration Scale (CDS) / Gorelick Scale.',
   image: {
    url: "https://picsum.photos/seed/gastroenteritis/600/400",
    hint: "stomach ache"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { 
      id: 'appearance', 
      questionText: 'General Appearance', 
      type: 'select', 
      options: [
        {label: 'Normal', value: '0', score: 0}, 
        {label: 'Restless, irritable, or thirsty', value: '1', score: 1},
        {label: 'Lethargic, limp, or cold/sweaty', value: '2', score: 2}
      ] 
    },
    { 
      id: 'eyes', 
      questionText: 'Eyes', 
      type: 'select', 
      options: [
        {label: 'Normal', value: '0', score: 0}, 
        {label: 'Slightly sunken', value: '1', score: 1},
        {label: 'Very sunken', value: '2', score: 2}
      ] 
    },
    { 
      id: 'mucousMembranes', 
      questionText: 'Mucous Membranes (Tongue)', 
      type: 'select', 
      options: [
        {label: 'Moist', value: '0', score: 0}, 
        {label: 'Sticky', value: '1', score: 1},
        {label: 'Dry', value: '2', score: 2}
      ] 
    },
    { 
      id: 'tears', 
      questionText: 'Tears', 
      type: 'select', 
      options: [
        {label: 'Normal', value: '0', score: 0}, 
        {label: 'Decreased', value: '1', score: 1},
        {label: 'Absent', value: '2', score: 2}
      ] 
    },
    { id: 'capRefill', questionText: 'Capillary Refill > 2 seconds?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    
    const s1 = Number(data.appearance || 0);
    const s2 = Number(data.eyes || 0);
    const s3 = Number(data.mucousMembranes || 0);
    const s4 = Number(data.tears || 0);
    
    const totalScore = s1 + s2 + s3 + s4;
    
    let level: SeverityLevel = 'no';
    let interpretation = 'No/Minimal Dehydration (< 3%)';
    
    if (totalScore >= 5) {
      level = 'severe';
      interpretation = 'Severe Dehydration (> 9%)';
    } else if (totalScore >= 1) {
      level = 'some';
      interpretation = 'Mild-Moderate Dehydration (3-9%)';
    } else {
      level = 'no';
      interpretation = 'No/Minimal Dehydration (< 3%)';
    }

    if (data.capRefill === true || s1 === 2) {
      details.push("High clinical suspicion for significant dehydration regardless of score.");
    }

    return { 
      level, 
      scoreDetails: {
        systemName: "Clinical Dehydration Scale",
        totalScore: totalScore,
        maxScore: 8,
        interpretation,
        referenceTable: [
          { range: "0", meaning: "No Dehydration (< 3%)" },
          { range: "1 - 4", meaning: "Mild-Moderate Dehydration (3-9%)" },
          { range: "5 - 8", meaning: "Severe Dehydration (> 9%)" }
        ]
      },
      details 
    };
  },
  getManagement: (severity, data) => {
    const weight = Number(data.weight || 0);
    switch (severity.level) {
      case 'severe':
        return [{
          title: "Severe Dehydration Management (>9%)",
          recommendations: [
            "Immediate IV/IO access.",
            "Normal Saline (NS) or LR bolus: 20 mL/kg (max 1L).",
            "Repeat boluses as needed until perfusion improves.",
            "Once stable, calculate maintenance + 50% replacement over 24h.",
            "Check electrolytes and glucose immediately."
          ]
        }];
      case 'some':
        return [{
          title: "Mild-Moderate Dehydration Management (3-9%)",
          recommendations: [
            "Oral Rehydration Solution (ORS) trial: 50-100 mL/kg over 4 hours.",
            "Give small frequent amounts (5-10 mL every 5 min).",
            "Ondansetron ODT to facilitate ORS if vomiting.",
            "If failing ORS, consider IV NS bolus (20 mL/kg) and re-evaluate."
          ]
        }];
      case 'no':
        return [{
          title: "No/Minimal Dehydration Management (<3%)",
          recommendations: [
            "Continue regular diet and fluids.",
            "Replace ongoing losses: 10 mL/kg ORS per diarrheal stool; 2 mL/kg per emesis.",
            "Educate parents on red flags and when to return."
          ]
        }];
      default:
        return [{ title: 'Awaiting Assessment', recommendations: ['Complete clinical scoring to determine management.'] }];
    }
  },
  getDisposition: (severity) => {
    if (severity.level === 'severe') {
        return ['Admit for IV rehydration and correction of electrolyte disturbances.'];
    }
    if (severity.level === 'some') {
        return ['Discharge home if ORS is tolerated and patient shows improvement.', 'Admit if failing ORS, persistent vomiting, or caregiver concerns.'];
    }
    return ['Discharge home with hydration instructions and return precautions.'];
  },
  getRedFlags: () => [
    "Lethargy or altered mental status",
    "Capillary refill > 3 seconds",
    "Persistent vomiting despite antiemetics",
    "Absence of urine output > 8-12 hours",
    "Bloody diarrhea or severe abdominal pain"
  ],
  getDrugDoses: (severity, data) => {
      const weight = Number(data.weight) || 0;
      const doses = [];
      
      if (weight > 0) {
        const ondansetronDose = weight < 15 ? 2 : weight < 30 ? 4 : 8;
        doses.push({ drugName: "Ondansetron (ODT/PO)", dose: `${ondansetronDose} mg once`, notes: "Facilitates ORS by reducing vomiting" });
        doses.push({ drugName: "IV NS/LR Bolus", dose: `${(weight * 20).toFixed(0)} mL (20 mL/kg)`, notes: "Over 20-60 min" });
      } else {
        doses.push({ drugName: "Ondansetron", dose: "0.15 mg/kg (max 8mg)", notes: "Facilitates ORS" });
        doses.push({ drugName: "IV NS/LR Bolus", dose: "20 mL/kg", notes: "For moderate/severe dehydration" });
      }
      return doses;
  },
  getReferences: () => [
    { title: "Clinical Dehydration Scale for Children", url: "https://www.mdcalc.com/clinical-dehydration-scale-children" },
    { title: "NICE Guideline: Diarrhoea and vomiting caused by gastroenteritis in under 5s", url: "https://www.nice.org.uk/guidance/cg84" }
  ],
};
