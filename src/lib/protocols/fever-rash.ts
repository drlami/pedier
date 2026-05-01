import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const feverRashProtocol: DiseaseProtocol = {
  id: 'fever-rash',
  name: 'Fever with Rash',
  system: 'Fever & Infectious Diseases',
  description: 'A pediatric framework for differentiating benign viral exanthems from life-threatening conditions like meningococcemia, Toxic Shock Syndrome, and Kawasaki Disease.',
  image: {
    url: "https://picsum.photos/seed/fever-rash/600/400",
    hint: "child rash"
  },
  questions: [
    { id: 'isToxic', questionText: 'Does the child appear toxic or septic?', type: 'boolean', info: 'Signs include lethargy, poor perfusion (cool skin, delayed cap refill), extreme irritability, or altered mental status.' },
    { id: 'rashType', questionText: 'What is the primary character of the rash?', type: 'select', options: [
        { label: 'Blanching (Disappears when pressed)', value: 'maculopapular' },
        { label: 'Non-blanching (Petechiae or Purpura)', value: 'petechial' },
        { label: 'Vesicular (Blisters or Fluid-filled)', value: 'vesicular' },
        { label: 'Diffuse Erythroderma (Sunburn-like redness)', value: 'erythroderma' },
        { label: 'Urticarial (Hives/Wheals)', value: 'urticarial' }
    ]},
    { id: 'hasSloughing', questionText: 'Is the skin peeling, sloughing, or blistering easily?', type: 'boolean', info: 'Positive Nikolsky sign: Top layer of skin slips off with gentle pressure. Suggests SJS/TEN or SSSS.' },
    { id: 'mucosalInvolvement', questionText: 'Are the mouth, eyes, or genitals involved?', type: 'boolean', info: 'Look for: Strawberry tongue, cracked/bleeding lips, red eyes (conjunctivitis), or ulcers in mouth/genitals.' },
    { id: 'feverDuration', questionText: 'Duration of fever (total days)', type: 'number' },
    { id: 'hasJointSwelling', questionText: 'Is there joint swelling or refusal to move a limb?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const feverDays = Number(data.feverDuration) || 0;

    // 1. CRITICAL RED FLAGS (Severe)
    if (data.isToxic || data.rashType === 'petechial' || data.hasSloughing) {
      if (data.isToxic) details.push("Toxic/Septic appearance");
      if (data.rashType === 'petechial') details.push("Non-blanching rash (Emergency: Concern for Meningococcemia)");
      if (data.hasSloughing) details.push("Skin sloughing present (Concern for SJS/TEN or SSSS)");
      return { level: 'severe', details: [...details, "LIFE-THREATENING condition suspected. Immediate resuscitation and antibiotics required."] };
    }

    // 2. Toxic Shock Syndrome suspicion
    if (data.rashType === 'erythroderma' && data.isToxic) {
        details.push("Diffuse sunburn-like rash with toxicity. High suspicion for Toxic Shock Syndrome.");
        return { level: 'severe', details };
    }

    // 3. CONCERNING FEATURES (Moderate)
    if (feverDays >= 5 && data.mucosalInvolvement) {
        details.push("Fever ≥ 5 days + mucosal changes. High suspicion for Kawasaki Disease.");
        return { level: 'moderate', details };
    }
    
    if (data.rashType === 'vesicular' || data.mucosalInvolvement || data.hasJointSwelling) {
        if (data.rashType === 'vesicular') details.push("Vesicular rash (e.g., HSV, VZV, HFM)");
        if (data.mucosalInvolvement) details.push("Mucosal involvement (eyes, mouth, or genitals)");
        if (data.hasJointSwelling) details.push("Joint swelling/refusal to walk (Concern for Septic Arthritis)");
        return { level: 'moderate', details: [...details, "Concerning features requiring diagnostic labs and hospital observation."] };
    }

    // 4. LOW RISK (Mild)
    details.push("Well-appearing with a purely blanching rash. Likely a viral exanthem.");
    return { level: 'mild', details };
  },
  getManagement: (severity, data) => {
    const management = [];

    if (severity.level === 'severe') {
        management.push({
            title: "EMERGENCY: Immediate Stabilization",
            recommendations: [
                "1. RESUSCITATE: Provide 100% oxygen. Give 20 mL/kg IV fluid boluses (NS/LR) if in shock.",
                "2. ANTIBIOTICS: Do not wait for labs. Give IV Ceftriaxone (100mg/kg) and Vancomycin (15mg/kg) IMMEDIATELY.",
                "3. LABS: Draw 'Sepsis Panel': Blood culture, CBC with diff, CRP/ESR, electrolytes, LFTs, creatinine, and venous blood gas.",
                "4. COAGULATION: Check PT/INR, aPTT, and Fibrinogen to evaluate for DIC (common in meningococcemia).",
                "5. CONSULT: Immediate Pediatric Infectious Disease and PICU consultation."
            ]
        });
    } else if (severity.level === 'moderate') {
        management.push({
            title: "Diagnostic Evaluation & Monitoring",
            recommendations: [
                "LABS: CBC, CRP, LFTs, and Urinalysis.",
                "KAWASAKI WORKUP: If fever >4-5 days, obtain 12-lead EKG and consult Cardiology for an urgent Echocardiogram.",
                "INVOLVED MUCOSA: Maintain hydration. Consider HSV PCR or viral swabs if vesicular.",
                "ADMIT: Most moderate-risk rashes require 24-hour observation to ensure stability and follow diagnostic trends."
            ]
        });
    } else {
        management.push({
            title: "Supportive Care (Viral Exanthem)",
            recommendations: [
                "Antipyretics: Acetaminophen (15mg/kg) or Ibuprofen (10mg/kg) for comfort.",
                "Encourage oral hydration.",
                "Education: Reassure family about the typical course of viral rashes.",
                "No routine labs are indicated if the child is strictly well-appearing with a blanching rash."
            ]
        });
    }

    return management;
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
        return ["ADMIT TO PICU immediately for stabilization and intensive monitoring."];
    } else if (severity.level === 'moderate') {
        return ["ADMIT TO HOSPITAL for IV antibiotics, Kawasaki monitoring, or further diagnostic workup."];
    } else {
        return [
            "SAFE DISCHARGE CRITERIA (Must meet ALL):",
            "1. Child is strictly well-appearing, alert, and active.",
            "2. Rash is purely blanching (No petechiae/purpura).",
            "3. No Nikolsky sign (skin sloughing) and no mucosal ulcerations.",
            "4. Tolerating adequate oral fluids.",
            "5. Fever is well-controlled with antipyretics.",
            "6. Reliable caregivers and guaranteed follow-up within 24 hours."
        ];
    }
  },
  getRedFlags: () => [
    "NON-BLANCHING (Petechial or Purpuric) rash: This is an emergency until proven otherwise.",
    "Toxic appearance: Lethargy, poor perfusion, or altered mental status.",
    "Nikolsky Sign: Skin sloughing or blisters that slip when touched.",
    "Fever persisting > 5 days with strawberry tongue/red eyes (Kawasaki).",
    "Extreme joint pain, swelling, or refusal to walk.",
    "Hypotension or signs of septic shock."
  ],
  getDrugDoses: (severity, data) => {
    return [
      { drugName: "Ceftriaxone (Meningitis/Sepsis dose)", dose: "100 mg/kg IV once (max 2g)", notes: "First-line for suspected meningococcemia." },
      { drugName: "Vancomycin", dose: "15 mg/kg IV q6h", notes: "Added for MRSA or Toxic Shock coverage." },
      { drugName: "IVIG (for Kawasaki)", dose: "2 g/kg as a single infusion", notes: "Consult Cardiology first." },
      { drugName: "Acetaminophen", dose: "15 mg/kg every 4-6 hours", notes: "For fever/pain." }
    ];
  },
  getReferences: () => [
      { title: "UpToDate: Fever and rash in children: Approach to the patient", url: "https://www.uptodate.com/contents/fever-and-rash-in-children-approach-to-the-patient" },
      { title: "AAP: Red Book - Report of the Committee on Infectious Diseases", url: "https://publications.aap.org/redbook" }
  ],
};
