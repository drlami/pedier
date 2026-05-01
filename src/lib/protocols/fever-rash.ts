import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const feverRashProtocol: DiseaseProtocol = {
  id: 'fever-rash',
  name: 'Fever with Rash',
  system: 'Fever & Infectious Diseases',
  description: 'Differentiating benign viral exanthems from life-threatening conditions. Includes specific management for meningococcemia, Kawasaki, and TSS.',
  image: {
    url: "https://picsum.photos/seed/fever-rash/600/400",
    hint: "child rash"
  },
  questions: [
    { id: 'isToxic', questionText: 'Is the child toxic-appearing or in shock?', type: 'boolean', info: 'Lethargy, poor perfusion, altered mental status, or significant tachycardia.' },
    { id: 'rashType', questionText: 'Primary rash character?', type: 'select', options: [
        { label: 'Maculopapular (blanching)', value: 'maculopapular' },
        { label: 'Petechial/Purpuric (non-blanching)', value: 'petechial' },
        { label: 'Vesicular/Bullous (blisters)', value: 'vesicular' },
        { label: 'Urticarial (hives)', value: 'urticarial' },
        { label: 'Diffuse Erythroderma (sunburn-like)', value: 'erythroderma' }
    ]},
    { id: 'hasSloughing', questionText: 'Skin sloughing or positive Nikolsky sign?', type: 'boolean', info: 'Skin peels off with gentle pressure. Suggests SJS/TEN or SSSS.' },
    { id: 'mucosalInvolvement', questionText: 'Mucosal involvement?', type: 'boolean', info: 'Strawberry tongue, cracked lips, conjunctivitis, or oral ulcers.' },
    { id: 'feverDuration', questionText: 'Duration of fever (days)', type: 'number' },
    { id: 'hasJointSwelling', questionText: 'Focal findings (joint swelling or extreme tenderness)?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const feverDays = Number(data.feverDuration) || 0;

    // 1. Immediate Life Threats
    if (data.isToxic || data.rashType === 'petechial' || data.hasSloughing) {
      if (data.isToxic) details.push("Toxic/Septic appearance");
      if (data.rashType === 'petechial') details.push("Non-blanching petechial rash (High risk for Meningococcemia)");
      if (data.hasSloughing) details.push("Skin sloughing present (Concern for SJS/TEN or SSSS)");
      return { level: 'severe', details: [...details, "CRITICAL: Life-threatening condition suspected."] };
    }

    // 2. High-Risk Inflammatory/Bacterial
    if (feverDays >= 5 && data.mucosalInvolvement) {
        details.push("Fever ≥ 5 days with mucosal signs. High suspicion for Kawasaki Disease.");
        return { level: 'moderate', details };
    }
    
    if (data.rashType === 'erythroderma' && data.isToxic) {
        details.push("Diffuse erythroderma with toxicity. Concern for Toxic Shock Syndrome.");
        return { level: 'severe', details };
    }

    // 3. Moderate / Needs Evaluation
    if (data.rashType === 'vesicular' || data.mucosalInvolvement || data.hasJointSwelling) {
        details.push("Concerning features requiring diagnostic labs and observation.");
        return { level: 'moderate', details };
    }

    // 4. Low Risk
    details.push("Well-appearing with a blanching rash. Likely a viral exanthem.");
    return { level: 'mild', details };
  },
  getManagement: (severity, data) => {
    const management = [];

    if (severity.level === 'severe') {
        management.push({
            title: "EMERGENCY: Stabilization & Resuscitation",
            recommendations: [
                "ACT FAST: If petechial or toxic, treat as Meningococcemia/Septic Shock.",
                "1. RESUSCITATE: 20 mL/kg IV fluid boluses (NS/LR).",
                "2. ANTIBIOTICS: Give IV Ceftriaxone (100mg/kg) and Vancomycin (15mg/kg) IMMEDIATELY. Do not wait for labs.",
                "3. LABS: CBC, CRP, Blood Culture, Coagulation panel (PT/INR, PTT), Fibrinogen, Electrolytes, Creatinine, LFTs.",
                "4. LP: Defer lumbar puncture if patient is unstable or has coagulopathy.",
                "5. CONSULT: Page PICU and Infectious Disease immediately."
            ]
        });
    } else if (severity.level === 'moderate') {
        management.push({
            title: "Diagnostic Evaluation (Moderate Risk)",
            recommendations: [
                "LABS: CBC, CRP/ESR, LFTs, and Urinalysis.",
                "Kawasaki Workup: If fever >4-5 days, obtain EKG and consider urgent Echocardiogram.",
                "If vesicular: Consider HSV/VZV PCR or swabs.",
                "Observe for 4-6 hours to ensure hydration and stability."
            ]
        });
    } else {
        management.push({
            title: "Supportive Care (Viral Exanthem)",
            recommendations: [
                "Provide antipyretics (Acetaminophen or Ibuprofen) for comfort.",
                "Encourage oral hydration.",
                "Provide parent education on viral course and return precautions.",
                "No routine labs required if child is strictly well-appearing with a blanching rash."
            ]
        });
    }

    return management;
  },
  getDisposition: (severity, data) => {
    const disposition = [];
    if (severity.level === 'severe') {
        disposition.push("ADMIT TO PICU immediately.");
    } else if (severity.level === 'moderate') {
        disposition.push("Admission typically required for observation, IVIG (if Kawasaki), or parenteral antibiotics.");
    } else {
        disposition.push("SAFE DISCHARGE CRITERIA (Must meet ALL):");
        disposition.push("1. Child is strictly well-appearing and alert.");
        disposition.push("2. Rash is purely blanching (no petechiae, no purpura).");
        disposition.push("3. No signs of mucosal involvement or skin sloughing.");
        disposition.push("4. Tolerating adequate oral fluids.");
        disposition.push("5. Fever is responsive to antipyretics.");
        disposition.push("6. Guaranteed reliable caregiver and follow-up within 24 hours.");
    }
    return disposition;
  },
  getRedFlags: () => [
    "ANY non-blanching (petechial or purpuric) rash.",
    "Toxic appearance or altered mental status.",
    "Skin sloughing or blisters (Nikolsky's sign).",
    "Fever persisting > 5 days with mucosal changes (Kawasaki).",
    "Hypotension or signs of shock (poor perfusion).",
    "Extreme joint pain or refusal to walk."
  ],
  getDrugDoses: (severity, data) => {
    return [
      { drugName: "Ceftriaxone (Meningitis/Sepsis dose)", dose: "100 mg/kg IV once (max 2g)", notes: "For suspected meningococcemia." },
      { drugName: "Vancomycin", dose: "15 mg/kg IV q6h", notes: "Added for MRSA/TSS coverage in septic patients." },
      { drugName: "IVIG (for Kawasaki)", dose: "2 g/kg as a single infusion", notes: "Consult Cardiology first." },
      { drugName: "Acyclovir", dose: "20 mg/kg IV q8h", notes: "If neonatal HSV or complicated VZV is suspected." }
    ];
  },
  getReferences: () => [
      { title: "UpToDate: Fever and rash in children: Approach to the patient", url: "https://www.uptodate.com/contents/fever-and-rash-in-children-approach-to-the-patient" },
      { title: "AAP: Red Book - Report of the Committee on Infectious Diseases", url: "https://publications.aap.org/redbook" }
  ],
};
