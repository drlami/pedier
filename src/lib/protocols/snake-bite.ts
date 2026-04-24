import type { DiseaseProtocol, FormData, Severity } from './types';

export const snakeBiteProtocol: DiseaseProtocol = {
  id: 'snake-bite',
  name: 'Snake Bite Management',
  system: 'Toxins and Poisoning',
  description: 'Based on the Palestine ER Guideline for pediatric snakebite management, covering assessment, antivenom indications, and supportive care.',
  image: {
    url: "https://picsum.photos/seed/snake-bite/600/400",
    hint: "snake reptile"
  },
  questions: [
    { id: 'hasFangMarks', questionText: 'Are fang marks present?', type: 'boolean' },
    { id: 'hasLocalSwelling', questionText: 'Is there any local swelling?', type: 'boolean' },
    { id: 'swellingExtent', questionText: 'If swelling is present, what is the extent?', type: 'select', options: [
        {label: 'None', value: 'none'},
        {label: '< 50% of bitten limb', value: 'less_half'},
        {label: '> 50% of bitten limb', value: 'more_half'},
        {label: 'Rapidly progressing', value: 'rapid'},
    ]},
    { id: 'hasSystemicSigns', questionText: 'Are there any systemic signs of envenomation?', type: 'boolean', info: 'Coagulopathy, neurotoxic signs (ptosis, paralysis), shock, arrhythmias, hemoglobinuria, myoglobinuria, persistent vomiting/headache, altered consciousness.'},
    { id: 'hasLabAbnormalities', questionText: 'Are there marked laboratory abnormalities?', type: 'boolean', info: 'Low hematocrit, low fibrinogen, thrombocytopenia, DIC.'}
  ],
  calculateSeverity: (data: FormData): Severity => {
    // Grade III: Severe
    if (data.hasSystemicSigns && data.hasLabAbnormalities) {
      return { level: 'severe', details: ["Marked local reaction with systemic toxicity and marked lab abnormalities. Corresponds to Grade III."] };
    }
    
    // Grade II: Moderate
    if ((data.swellingExtent === 'more_half' || data.swellingExtent === 'rapid') && (data.hasSystemicSigns || data.hasLabAbnormalities)) {
      return { level: 'moderate', details: ["Swelling beyond the bite site with systemic symptoms or lab abnormalities. Corresponds to Grade II."] };
    }

    // Grade I: Mild
    if (data.hasLocalSwelling && !data.hasSystemicSigns && !data.hasLabAbnormalities) {
      return { level: 'mild', details: ["Local swelling only with no systemic symptoms. Corresponds to Grade I."] };
    }

    // Grade 0: No envenomation
    if (data.hasFangMarks && !data.hasLocalSwelling && !data.hasSystemicSigns) {
      return { level: 'no', details: ["Fang marks present but no local or systemic signs of envenomation. Corresponds to Grade 0."] };
    }
    
    return { level: 'unknown', details: ["Assess for local and systemic signs to grade severity."] };
  },
  getManagement: (severity, data) => {
    const management = [
        {
            title: "Prehospital & Initial ED Management",
            recommendations: [
                "Follow ABCs. Assess airway, breathing, circulation.",
                "Reassure the patient and immobilize the bitten limb at heart level.",
                "If a pressure tourniquet is already in place, leave it until after antivenom is started. Ensure distal pulses are present.",
                "Insert IV access immediately.",
                "Avoid incision, suction, or ice packs."
            ]
        },
        {
            title: "Indications for Antisnake Venom (ASV)",
            recommendations: [
                "Local: Swelling involving >50% of the limb, swelling after a bite on digits, rapidly progressive swelling, or enlarged tender regional lymph nodes.",
                "Systemic: Coagulopathy/bleeding, neurotoxic signs, shock/arrhythmias, acute renal failure, hemoglobinuria/myoglobinuria, or persistent vomiting/headache/drowsiness."
            ]
        },
        {
            title: "Severity-Based ASV Dosing",
            recommendations: [
                "Grade 0 (No Envenomation): No antivenom. Local wound care and observe for at least 4 hours.",
                "Grade I (Mild): Give 3-5 vials of antivenom.",
                "Grade II (Moderate): Give 6-10 vials of antivenom.",
                "Grade III (Severe): Give 11-15 vials or more of antivenom.",
                "Note: The dose of antivenom is the same for children and adults."
            ]
        },
        {
            title: "Supportive Treatment",
            recommendations: [
                "Neurotoxic Envenomation: Consider Neostigmine with Atropine. Prepare for mechanical ventilation if respiratory paralysis occurs.",
                "Local Wound Management: Clean wound thoroughly. Leave open. Record hourly progression of edema. Surgical debridement may be needed on day 3-5.",
                "Tetanus Prophylaxis: Give booster dose if indicated.",
                "Renal Failure: Monitor urine output closely. Manage conservatively; dialysis may be required.",
                "Antibiotics: Only if secondary infection is suspected; not for routine use."
            ]
        },
        {
            title: "Monitoring",
            recommendations: [
                "Admit all patients with any local reaction for at least 24 hours.",
                "Hourly monitoring of vital signs, neuro status, urine output, and limb circumference.",
                "Repeat labs: CBC, platelets, PT/INR, aPTT, fibrinogen, renal function, urinalysis."
            ]
        }
    ];

    if (severity.level === 'severe' || severity.level === 'moderate' || severity.level === 'mild') {
        management.splice(2, 0, {
            title: "Antivenom (ASV) Administration",
            recommendations: [
                "Initial Dose (10 vials): Dilute 10 vials in 200 mL normal saline and infuse over 1 hour.",
                "Sensitivity testing is not routinely recommended but follow local protocols.",
                "Maintenance Dose: 5 additional vials may be needed over 24 hours.",
                "Maximum Dose: Up to 30 vials for neurotoxic, up to 40 for hemotoxic envenomation."
            ]
        });
    }

    return management;
  },
  getDisposition: (severity) => {
    if (severity.level === 'no') {
      return ["Observe in ER for at least 4 hours. If no reaction develops, discharge is likely."];
    }
    return ["Admit patient if any local reaction is present.", "Observe for a minimum of 24 hours. PICU admission is preferred."];
  },
  getRedFlags: () => [
    "Any systemic signs of envenomation (coagulopathy, neurotoxicity, shock, etc.)",
    "Rapidly progressing swelling",
    "Swelling involving more than 50% of the bitten limb",
    "Development of acute renal failure or intravascular hemolysis"
  ],
  getDrugDoses: (severity) => {
    const doses = [
      { drugName: "Antisnake Venom (ASV)", dose: "Dose based on severity grade. See management section.", notes: "Initial dose is typically 10 vials diluted in 200ml NS over 1 hour." },
      { drugName: "Neostigmine", dose: "25-50 mcg/kg every 4 hours", notes: "For neurotoxic envenomation. Give with atropine." },
      { drugName: "Tetanus Booster", dose: "As indicated", notes: "" },
      { drugName: "--- For Anaphylaxis to ASV ---", dose: ""},
      { drugName: "Adrenaline (Epinephrine) IM", dose: "0.01 mg/kg (max 0.5 mg)", notes: "For severe reaction." },
      { drugName: "Hydrocortisone IV", dose: "Dose varies.", notes: "For severe reaction." },
      { drugName: "Antihistamine IV/IM", dose: "Dose varies.", notes: "For mild or severe reaction." }
    ];
    return doses;
  },
  getReferences: () => [{ title: "Pediatric Snakebite Management Protocol", url: "Palestine ER Guideline" }],
};
