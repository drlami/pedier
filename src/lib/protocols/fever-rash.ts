import type { DiseaseProtocol, FormData, Severity } from './types';

export const feverRashProtocol: DiseaseProtocol = {
  id: 'fever-rash',
  name: 'Fever with Rash',
  system: 'Fever & Infectious Diseases',
  description: 'Approach to differentiating benign viral exanthems from life-threatening causes of fever and rash.',
  image: {
    url: "https://picsum.photos/seed/fever-rash/600/400",
    hint: "child rash"
  },
  questions: [
    { id: 'isToxic', questionText: 'Is the child toxic-appearing, in shock, or have altered mental status?', type: 'boolean' },
    { id: 'rashType', questionText: 'What is the primary type of rash?', type: 'select', options: [
        { label: 'Maculopapular (blanching red bumps/spots)', value: 'maculopapular' },
        { label: 'Vesicular (blisters)', value: 'vesicular' },
        { label: 'Petechial/Purpuric (non-blanching purple/red spots)', value: 'petechial' },
        { label: 'Urticarial (hives)', value: 'urticarial' }
    ]},
    { id: 'hasMucosalInvolvement', questionText: 'Are there signs of mucosal involvement?', type: 'boolean', info: 'e.g., conjunctivitis, strawberry tongue, cracked lips, mouth sores.' },
    { id: 'hasKawasakiSigns', questionText: 'Fever >4 days plus other signs of Kawasaki Disease?', type: 'boolean', info: 'Conjunctivitis, rash, adenopathy, strawberry tongue, hand/foot swelling.'},
    { id: 'hasSloughing', questionText: 'Any skin sloughing or Nikolsky\'s sign?', type: 'boolean', info: 'Concern for SJS/TEN or Staphylococcal Scalded Skin Syndrome.'}
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];

    if (data.isToxic || data.rashType === 'petechial' || data.hasSloughing) {
      if (data.isToxic) details.push("Toxic appearance is a major red flag.");
      if (data.rashType === 'petechial') details.push("Non-blanching petechial/purpuric rash suggests meningococcemia.");
      if (data.hasSloughing) details.push("Skin sloughing suggests SJS/TEN or SSSS.");
      details.push("Life-threatening condition suspected.");
      return { level: 'severe', details };
    }
    
    if (data.hasKawasakiSigns) {
        details.push("High suspicion for Kawasaki Disease.");
        return { level: 'severe', details };
    }

    if (data.hasMucosalInvolvement || data.rashType === 'vesicular') {
        details.push("Rash with mucosal involvement or vesicles requires careful evaluation for conditions like measles, hand-foot-mouth, or varicella.");
        return { level: 'moderate', details };
    }

    details.push("Well-appearing child with a blanching rash is likely a benign viral exanthem.");
    return { level: 'mild', details };
  },
  getManagement: (severity, data) => {
    switch (severity.level) {
      case 'severe':
        const recs = [];
        if (data.isToxic || data.rashType === 'petechial') {
            recs.push("Treat as septic shock / meningococcemia. Start immediate resuscitation, sepsis workup, and broad-spectrum IV antibiotics (Ceftriaxone + Vancomycin). Admit to PICU.");
        }
        if (data.hasKawasakiSigns) {
            recs.push("Admit to hospital. Consult Cardiology. Plan for IVIG and high-dose Aspirin therapy.");
        }
        if (data.hasSloughing) {
            recs.push("Admit to PICU or burn unit. Stop any offending medications. Provide aggressive fluid/wound care and consult dermatology/toxicology.");
        }
        return [{ title: "EMERGENCY: Life-Threatening Rash", recommendations: recs }];
      case 'moderate':
        return [{
            title: "Management of concerning rash",
            recommendations: [
                "Consider admission for observation, hydration, and further diagnostic workup.",
                "Isolate patient based on suspected etiology (e.g., airborne precautions for suspected measles).",
                "Consult infectious disease or dermatology as needed."
            ]
        }];
      case 'mild':
        return [{
            title: "Management of Likely Viral Exanthem",
            recommendations: [
                "Provide supportive care (antipyretics, fluids).",
                "Reassurance and education for caregivers.",
                "Provide strict return precautions for signs of worsening illness."
            ]
        }];
      default:
        return [];
    }
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
      return ["Immediate hospital admission to PICU or specialized unit (e.g., burn center)."];
    }
    if (severity.level === 'moderate') {
      return ["Admission is generally recommended for monitoring, hydration, and potential specific therapies."];
    }
    return ["Discharge home with supportive care instructions and clear return precautions."];
  },
  getRedFlags: () => [
    "ANY non-blanching rash (petechiae or purpura)",
    "Toxic or septic appearance",
    "Fever with urticaria and hypotension (anaphylaxis)",
    "Widespread erythroderma with skin sloughing (SJS/TEN, SSSS)",
    "Vesicles on an erythematous base in a neonate (HSV)",
    "Signs concerning for Kawasaki Disease (prolonged fever, conjunctivitis, etc.)"
  ],
  getDrugDoses: () => [
    { drugName: "Ceftriaxone (IV)", dose: "80-100 mg/kg/day divided q12-24h", notes: "For suspected meningococcemia." },
    { drugName: "Vancomycin (IV)", dose: "60 mg/kg/day divided q6h", notes: "For coverage of MRSA in septic patients." },
    { drugName: "Intravenous Immunoglobulin (IVIG)", dose: "2 g/kg as a single infusion over 10-12 hours", notes: "For Kawasaki Disease." },
    { drugName: "Aspirin", dose: "Initial: 80-100 mg/kg/day divided q6h. Maintenance: 3-5 mg/kg/day", notes: "For Kawasaki Disease. Use with caution re: Reye's syndrome." }
  ],
  getReferences: () => [
      { title: "UpToDate: Fever and rash in children: Approach", url: "https://www.uptodate.com/contents/fever-and-rash-in-children-approach" }
  ],
};
