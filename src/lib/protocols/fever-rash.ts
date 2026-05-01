import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const feverRashProtocol: DiseaseProtocol = {
  id: 'fever-rash',
  name: 'Fever with Rash',
  system: 'Fever & Infectious Diseases',
  description: 'A pediatric framework for differentiating life-threatening conditions (Meningococcemia, TSS) from stable mimics like HSP and viral exanthems.',
  image: {
    url: "https://picsum.photos/seed/fever-rash/600/400",
    hint: "child rash"
  },
  questions: [
    { id: 'isToxic', questionText: 'Does the child appear toxic, septic, or in shock?', type: 'boolean', info: 'Signs include lethargy, poor perfusion (cool skin, delayed cap refill), extreme irritability, or altered mental status.' },
    { id: 'rashType', questionText: 'Primary character of the rash?', type: 'select', options: [
        { label: 'Blanching (Maculopapular)', value: 'maculopapular' },
        { label: 'Non-blanching (Petechiae or Purpura)', value: 'petechial' },
        { label: 'Vesicular (Blisters)', value: 'vesicular' },
        { label: 'Diffuse Redness (Erythroderma)', value: 'erythroderma' }
    ]},
    { id: 'isPalpable', questionText: 'Is the purpura palpable (can be felt as bumps)?', type: 'boolean', info: 'Palpable purpura is a hallmark of vasculitis like HSP.' },
    { id: 'distribution', questionText: 'Where is the rash primarily located?', type: 'select', options: [
        { label: 'Generalized / Random', value: 'generalized' },
        { label: 'Lower extremities and buttocks', value: 'dependent' },
        { label: 'Face and trunk only', value: 'central' }
    ], info: 'HSP typically favors gravity-dependent areas (legs/buttocks).'},
    { id: 'hasSloughing', questionText: 'Is the skin peeling, sloughing, or blistering (Nikolsky Sign)?', type: 'boolean' },
    { id: 'mucosalInvolvement', questionText: 'Are the mouth, eyes, or genitals involved?', type: 'boolean' },
    { id: 'feverDuration', questionText: 'Duration of fever (total days)', type: 'number' },
    { id: 'associatedPain', questionText: 'Associated severe abdominal or joint pain?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const isPetechial = data.rashType === 'petechial';
    const isToxic = data.isToxic === true;

    // 1. EMERGENCY (Severe)
    if (isToxic || data.hasSloughing || (isPetechial && isToxic)) {
      if (isToxic) details.push("Toxic/Septic appearance or Shock");
      if (isPetechial && isToxic) details.push("Non-blanching rash with instability (Highly suspicious for Meningococcemia)");
      if (data.hasSloughing) details.push("Skin sloughing (Concern for SJS/TEN or SSSS)");
      return { level: 'severe', details: [...details, "LIFE-THREATENING condition suspected. Immediate resuscitation and IV antibiotics required."] };
    }

    // 2. URGENT / CONCERNING (Moderate)
    if (isPetechial && !isToxic) {
        details.push("Petechial rash in a well-appearing child.");
        if (data.isPalpable && data.distribution === 'dependent') {
            details.push("Palpable purpura in a dependent distribution suggests HSP (Henoch-Schönlein Purpura).");
        } else {
            details.push("Requires urgent workup to rule out early sepsis or ITP.");
        }
        return { level: 'moderate', details };
    }

    if (Number(data.feverDuration) >= 5 && data.mucosalInvolvement) {
        details.push("Fever ≥ 5 days + mucosal changes. High suspicion for Kawasaki Disease.");
        return { level: 'moderate', details };
    }
    
    if (data.rashType === 'vesicular' || data.mucosalInvolvement || data.associatedPain) {
        details.push("Concerning features found. Requires diagnostic labs and observation.");
        return { level: 'moderate', details };
    }

    // 3. LOW RISK (Mild)
    details.push("Well-appearing with a purely blanching rash. Likely a viral exanthem.");
    return { level: 'mild', details };
  },
  getManagement: (severity, data) => {
    const management = [];

    if (severity.level === 'severe') {
        management.push({
            title: "EMERGENCY: Immediate Stabilization",
            recommendations: [
                "RESUSCITATE: 100% oxygen. If in shock, give 20 mL/kg IV fluid boluses (NS/LR).",
                "ANTIBIOTICS: DO NOT WAIT for labs. Give IV Ceftriaxone (100mg/kg) and Vancomycin (15mg/kg) IMMEDIATELY.",
                "LABS: Sepsis Panel (Blood culture, CBC, CRP, Electrolytes, LFTs, Coags/Fibrinogen).",
                "CONSULT: Immediate PICU and Pediatric Infectious Disease consultation."
            ]
        });
    } else if (severity.level === 'moderate') {
        if (data.rashType === 'petechial') {
            management.push({
                title: "Urgent Workup: Non-Toxic Petechiae/Purpura",
                recommendations: [
                    "LABS: CBC with manual differential (check platelet count for ITP), PT/INR, PTT, and CRP.",
                    "If HSP is suspected (palpable purpura on legs): Perform Urinalysis (check for hematuria/proteinuria) and BP check.",
                    "If labs are normal and child is stable, may observe in the ED. If any suspicion for early sepsis remains, treat as Severe."
                ]
            });
        } else if (Number(data.feverDuration) >= 5) {
            management.push({
                title: "Kawasaki Disease Workup",
                recommendations: [
                    "Obtain 12-lead EKG and consult Cardiology for urgent Echocardiogram.",
                    "Labs: CRP, ESR, Albumin, LFTs, and Urinalysis (look for sterile pyuria).",
                    "Admit for observation and potential IVIG therapy."
                ]
            });
        }
    } else {
        management.push({
            title: "Supportive Care (Viral Exanthem)",
            recommendations: [
                "Antipyretics for comfort (Acetaminophen/Ibuprofen).",
                "Maintain oral hydration.",
                "Educate family on return precautions: Return immediately for any non-blanching spots, lethargy, or poor perfusion."
            ]
        });
    }

    return management;
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe') return ["ADMIT TO PICU immediately."];
    if (severity.level === 'moderate') return ["ADMIT TO HOSPITAL for observation and completion of diagnostic workup."];
    
    return [
        "SAFE DISCHARGE CRITERIA (Must meet ALL):",
        "1. Child is strictly well-appearing and hemodynamically stable.",
        "2. Rash is purely BLANCHING (No petechiae or purpura).",
        "3. No mucosal ulcerations or skin sloughing.",
        "4. Tolerating adequate oral fluids.",
        "5. Reliable caregivers and guaranteed follow-up within 24 hours."
    ];
  },
  getRedFlags: () => [
    "TOXIC APPEARANCE + PETECHIAE: This is a critical emergency (Meningococcemia).",
    "Nikolsky Sign: Skin that slips or blisters with gentle pressure.",
    "Non-blanching spots above the nipple line or generalized.",
    "Purpura associated with severe abdominal pain (HSP complication).",
    "Fever > 5 days with mucosal changes (Kawasaki)."
  ],
  getDrugDoses: (severity, data) => {
    return [
      { drugName: "Ceftriaxone (Meningitis/Sepsis dose)", dose: "100 mg/kg IV once (max 2g)", notes: "First-line for suspected meningococcemia." },
      { drugName: "Vancomycin", dose: "15 mg/kg IV q6h", notes: "Added for MRSA or Toxic Shock coverage." },
      { drugName: "Acetaminophen", dose: "15 mg/kg every 4-6 hours", notes: "For fever/pain." }
    ];
  },
  getReferences: () => [
      { title: "UpToDate: Fever and rash in children: Approach to the patient", url: "https://www.uptodate.com/contents/fever-and-rash-in-children-approach-to-the-patient" },
      { title: "AAP: Red Book - Report of the Committee on Infectious Diseases", url: "https://publications.aap.org/redbook" }
  ],
};
