import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const feverRashProtocol: DiseaseProtocol = {
  id: 'fever-rash',
  name: 'Fever with Rash',
  system: 'Infectious Diseases',
  description: 'A pediatric framework for differentiating life-threatening conditions (Meningococcemia, TSS) from stable mimics like HSP, Varicella, and viral exanthems.',
  image: {
    url: "https://picsum.photos/seed/fever-rash/600/400",
    hint: "child rash"
  },
  questions: [
    { id: 'ageMonths', questionText: 'Age in months', type: 'number' },
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
    const isVesicular = data.rashType === 'vesicular';
    const isToxic = data.isToxic === true;
    const ageMonths = Number(data.ageMonths);

    // 1. EMERGENCY (Severe)
    if (isToxic || data.hasSloughing || (isPetechial && isToxic) || (isVesicular && ageMonths < 3)) {
      if (isToxic) details.push("Toxic/Septic appearance or Shock");
      if (isPetechial && isToxic) details.push("Non-blanching rash with instability (Highly suspicious for Meningococcemia)");
      if (data.hasSloughing) details.push("Skin sloughing (Concern for SJS/TEN or SSSS)");
      if (isVesicular && ageMonths < 3) details.push("Infant < 3 months with blisters (High risk for disseminated Neonatal HSV)");
      return { level: 'severe', details: [...details, "LIFE-THREATENING condition suspected. Immediate resuscitation and IV therapy required."] };
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

    if (isVesicular && !isToxic) {
        details.push("Vesicular rash in a well-appearing child. Likely Varicella (chickenpox) or HFM, but must rule out HSV/Zoster.");
        return { level: 'moderate', details };
    }

    if (Number(data.feverDuration) >= 5 && data.mucosalInvolvement) {
        details.push("Fever ≥ 5 days + mucosal changes. High suspicion for Kawasaki Disease.");
        return { level: 'moderate', details };
    }
    
    if (data.mucosalInvolvement || data.associatedPain) {
        details.push("Concerning features found. Requires diagnostic labs and observation.");
        return { level: 'moderate', details };
    }

    // 3. LOW RISK (Mild)
    details.push("Well-appearing with a purely blanching rash. Likely a common viral exanthem.");
    return { level: 'mild', details };
  },
  getManagement: (severity, data) => {
    const management = [];
    const ageMonths = Number(data.ageMonths);

    if (severity.level === 'severe') {
        management.push({
            title: "EMERGENCY: Immediate Stabilization",
            recommendations: [
                "RESUSCITATE: 100% oxygen. If in shock, give 20 mL/kg IV fluid boluses (NS/LR).",
                "ANTIBIOTICS: Give IV Ceftriaxone (100mg/kg) and Vancomycin (15mg/kg) IMMEDIATELY.",
                data.rashType === 'vesicular' ? "ANTIVIRALS: Start IV Acyclovir (20mg/kg) immediately for suspected neonatal/severe HSV." : "",
                "LABS: Sepsis Panel (Blood culture, CBC, CRP, Electrolytes, LFTs, Coags/Fibrinogen).",
                "CONSULT: Immediate PICU and Pediatric Infectious Disease consultation."
            ].filter(r => r !== "")
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
        } else if (data.rashType === 'vesicular') {
            management.push({
                title: "Management of Vesicular Rash (Blisters)",
                recommendations: [
                    "Varicella (Chickenpox): Typically supportive. Use antipyretics (Avoid Ibuprofen/NSAIDs in Varicella due to risk of invasive Strep skin infections).",
                    "Hand-Foot-Mouth: Focus on oral hydration and analgesia for mouth sores.",
                    "HSV/Zoster: Consider oral Acyclovir if presenting within 72 hours, or for patients with underlying eczema (Eczema Herpeticum).",
                    "Isolation: Ensure strict contact/respiratory isolation in the ED if Varicella is suspected."
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
                "Antipyretics for comfort (Acetaminophen).",
                "Maintain oral hydration.",
                "Educate family on return precautions: Return immediately for any non-blanching spots, lethargy, or poor perfusion."
            ]
        });
    }

    return management;
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe') return ["ADMIT TO PICU immediately."];
    
    if (data.rashType === 'vesicular' && severity.level === 'moderate') {
        return [
            "DISCHARGE HOME (Stable Vesicular Rash):",
            "1. Child is strictly well-appearing and over 3 months old.",
            "2. No evidence of secondary bacterial skin infection (cellulitis).",
            "3. Child is drinking well and has normal urine output.",
            "4. Caregivers are reliable and can isolate the child from vulnerable populations.",
            "5. Follow-up arranged within 24-48 hours."
        ];
    }

    if (severity.level === 'moderate') return ["ADMIT TO HOSPITAL for observation and completion of diagnostic workup."];
    
    return [
        "SAFE DISCHARGE CRITERIA (Maculopapular/Viral):",
        "1. Child is strictly well-appearing and hemodynamically stable.",
        "2. Rash is purely BLANCHING (No petechiae or purpura).",
        "3. No mucosal ulcerations or skin sloughing.",
        "4. Tolerating adequate oral fluids.",
        "5. Reliable caregivers and guaranteed follow-up within 24 hours."
    ];
  },
  getRedFlags: () => [
    "TOXIC APPEARANCE + PETECHIAE: Critical emergency (Meningococcemia).",
    "Nikolsky Sign: Skin that slips or blisters with gentle pressure.",
    "Any vesicular rash (blisters) in an infant < 3 months old.",
    "Purpura associated with severe abdominal pain (HSP complication).",
    "Fever > 5 days with mucosal changes (Kawasaki)."
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [
      { drugName: "Ceftriaxone (Meningitis/Sepsis dose)", dose: "100 mg/kg IV once (max 2g)", notes: "First-line for suspected meningococcemia." },
      { drugName: "Vancomycin", dose: "15 mg/kg IV q6h", notes: "Added for MRSA or Toxic Shock coverage." },
      { drugName: "Acyclovir (IV)", dose: "20 mg/kg IV q8h", notes: "INDICATIONS: Neonatal vesicular rash, Eczema Herpeticum, or severe disseminated HSV/Varicella." },
      { drugName: "Acetaminophen", dose: "15 mg/kg every 4-6 hours", notes: "Avoid Ibuprofen in Varicella cases." }
    ];
    return doses;
  },
  getReferences: () => [
      { title: "UpToDate: Fever and rash in children: Approach to the patient", url: "https://www.uptodate.com/contents/fever-and-rash-in-children-approach-to-the-patient" },
      { title: "AAP: Red Book - Report of the Committee on Infectious Diseases", url: "https://publications.aap.org/redbook" }
  ],
};
