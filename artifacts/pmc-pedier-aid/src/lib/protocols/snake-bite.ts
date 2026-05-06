import type { DiseaseProtocol, FormData, Severity } from './types';

export const snakeBiteProtocol: DiseaseProtocol = {
  id: 'snake-bite',
  name: 'Snake Bite Management',
  system: 'Toxins and Poisoning',
  description: 'Based on the Pediatric Department Snake Envenomation Management Protocol, using grade-based assessment and antivenin dosing.',
  image: {
    url: "https://picsum.photos/seed/snake-bite/600/400",
    hint: "snake reptile"
  },
  questions: [
    { id: 'hasFangMarks', questionText: 'Are fang marks present?', type: 'boolean' },
    { id: 'hasLocalSwelling', questionText: 'Is there any local swelling?', type: 'boolean' },
    { id: 'swellingExtent', questionText: 'If swelling is present, what is the extent?', type: 'select', options: [
        { label: 'None', value: 'none' },
        { label: 'Local swelling only / around bite site', value: 'local_only' },
        { label: 'Swelling beyond the bite site', value: 'beyond_site' },
        { label: 'Marked local reaction / rapidly progressing / >50% limb', value: 'marked' },
    ]},
    { 
      id: 'hasSystemicSigns', 
      questionText: 'Are there any systemic reactions?', 
      type: 'boolean', 
      info: 'Vomiting, drowsiness, headache, bleeding, ptosis, weakness, shock, arrhythmias, respiratory distress, altered consciousness.' 
    },
    { 
      id: 'hasLabAbnormalities', 
      questionText: 'Are there laboratory changes?', 
      type: 'boolean', 
      info: 'Low hematocrit, low fibrinogen, thrombocytopenia, DIC, abnormal coagulation profile, or abnormal 20-minute whole blood clotting test.' 
    }
  ],

  calculateSeverity: (data: FormData): Severity => {
    const markedLocal = data.swellingExtent === 'marked';
    const beyondSite = data.swellingExtent === 'beyond_site';
    const localOnly = data.swellingExtent === 'local_only';

    // Grade III: Severe envenomation
    if (markedLocal && data.hasSystemicSigns && data.hasLabAbnormalities) {
      return { 
        level: 'severe', 
        details: [
          "Grade III = Severe envenomation.",
          "Marked local reaction PLUS marked systemic reactions PLUS marked laboratory changes.",
          "Antivenin dose: 11–15 vials or more."
        ] 
      };
    }

    // Grade II: Moderate envenomation
    if ((beyondSite || markedLocal) && (data.hasSystemicSigns || data.hasLabAbnormalities)) {
      return { 
        level: 'moderate', 
        details: [
          "Grade II = Moderate envenomation.",
          "Swelling beyond the bite site PLUS systemic reactions OR laboratory changes.",
          "Antivenin dose: 6–10 vials."
        ] 
      };
    }

    // Grade I: Mild envenomation
    if (data.hasFangMarks && data.hasLocalSwelling && (localOnly || beyondSite || markedLocal) && !data.hasSystemicSigns && !data.hasLabAbnormalities) {
      return { 
        level: 'mild', 
        details: [
          "Grade I = Mild envenomation.",
          "Fang marks present with local swelling and no systemic reactions.",
          "Antivenin dose: 3–5 vials."
        ] 
      };
    }

    // Grade 0: No envenomation
    if (data.hasFangMarks && !data.hasLocalSwelling && data.swellingExtent === 'none' && !data.hasSystemicSigns && !data.hasLabAbnormalities) {
      return { 
        level: 'no', 
        details: [
          "Grade 0 = No envenomation.",
          "Fang marks present, no local reactions, and no systemic reactions.",
          "No antivenin. Observe in emergency department for at least 4 hours."
        ] 
      };
    }

    return { 
      level: 'unknown', 
      details: [
        "Unable to assign a clear grade.",
        "Reassess fang marks, local swelling, systemic reactions, and laboratory changes."
      ] 
    };
  },

  getManagement: (severity, data) => {
    const management = [
      {
        title: "Prehospital & Initial ED Management",
        recommendations: [
          "Follow ABCs. Assess airway, breathing, and circulation.",
          "Reassure the patient.",
          "Immobilize the bitten limb as for a fractured limb.",
          "Insert IV access immediately.",
          "Record baseline vital signs.",
          "Record circumference of the bitten extremity.",
          "Mark the border of swelling/ecchymosis on the limb to monitor progression.",
          "Clean the wound.",
          "Give tetanus prophylaxis if indicated.",
          "Avoid incision, suction, ice packs, tourniquet, or constricting bands."
        ]
      },
      {
        title: "Official Grade-Based Antivenin Dosing",
        recommendations: [
          "Grade 0: Fang marks + no local reaction + no systemic reaction → No antivenin.",
          "Grade I: Fang marks + local swelling + no systemic reaction → Antivenin 3–5 vials.",
          "Grade II: Swelling beyond bite site PLUS systemic reactions OR laboratory changes → Antivenin 6–10 vials.",
          "Grade III: Marked local reaction PLUS marked systemic reactions PLUS marked laboratory changes → Antivenin 11–15 vials or more.",
          "Children receive the same antivenin vial dose as adults."
        ]
      },
      {
        title: "Antivenin Recommendation for This Patient",
        recommendations: [
          severity.level === 'no'
            ? "Current result: Grade 0 → No antivenin. Local care, tetanus if indicated, and observe for at least 4 hours."
            : severity.level === 'mild'
              ? "Current result: Grade I mild envenomation → Give antivenin 3–5 vials."
              : severity.level === 'moderate'
                ? "Current result: Grade II moderate envenomation → Give antivenin 6–10 vials."
                : severity.level === 'severe'
                  ? "Current result: Grade III severe envenomation → Give antivenin 11–15 vials or more."
                  : "Current result unclear → Reassess clinically and review local senior/ICU/toxicology guidance.",
          "Dilute antivenin in normal saline and infuse over 1 hour according to local hospital policy.",
          "Monitor closely during infusion for anaphylactoid reaction.",
          "Skin testing is not routinely recommended because it has poor predictive value."
        ]
      },
      {
        title: "Investigations & Monitoring",
        recommendations: [
          "CBC with platelet count.",
          "PT, PTT/INR.",
          "Fibrinogen and fibrin degradation products if available.",
          "BUN, creatinine, renal function.",
          "Creatine phosphokinase if significant tissue injury is suspected.",
          "Urinalysis for hemoglobinuria or myoglobinuria.",
          "20-minute whole blood clotting test if viper envenomation or coagulopathy is suspected.",
          "Repeat labs according to severity and progression.",
          "Hourly monitoring of vital signs, neuro status, urine output, and limb circumference."
        ]
      },
      {
        title: "When to Repeat Antivenin",
        recommendations: [
          "Repeat antivenin if blood remains incoagulable after 6 hours.",
          "Repeat antivenin if spontaneous bleeding persists after 1–2 hours.",
          "Repeat antivenin if neurotoxic signs worsen after 1–2 hours.",
          "Repeat antivenin if cardiovascular signs worsen after 1–2 hours.",
          "Reassess clinically and with labs before giving additional doses."
        ]
      },
      {
        title: "Supportive Treatment",
        recommendations: [
          "Neurotoxic envenomation: consider neostigmine with atropine.",
          "Prepare for airway support and mechanical ventilation if respiratory paralysis, bulbar weakness, absent gag reflex, pooling secretions, or respiratory distress occurs.",
          "Local wound management: clean wound thoroughly and leave open.",
          "Record hourly progression of edema.",
          "Tetanus prophylaxis: give booster dose if indicated.",
          "Renal failure: monitor urine output closely. Dialysis may be required.",
          "Antibiotics: only if secondary infection is suspected; not for routine use.",
          "Surgical debridement may be needed later if tissue necrosis develops."
        ]
      },
      {
        title: "Antivenin Reaction Management",
        recommendations: [
          "Watch for urticaria, itching, fever, chills, nausea, vomiting, diarrhea, abdominal cramps, tachycardia, hypotension, bronchospasm, or angioedema.",
          "If reaction occurs: stop antivenin temporarily.",
          "Give IM adrenaline for significant reaction.",
          "Add hydrocortisone and antihistamine according to local hospital protocol.",
          "If no improvement or worsening after 10–15 minutes, repeat IM adrenaline.",
          "Once recovered, restart antivenin slowly for 10–15 minutes under close monitoring, then resume normal drip rate."
        ]
      }
    ];

    return management;
  },

  getDisposition: (severity) => {
    if (severity.level === 'no') {
      return [
        "Grade 0: observe in emergency department for at least 4 hours.",
        "If no local or systemic reaction develops, discharge may be considered with clear return precautions."
      ];
    }

    if (severity.level === 'mild') {
      return [
        "Grade I: local reaction is present. Observe/admit for 24 hours.",
        "Monitor swelling progression, vital signs, neurological status, urine output, and labs."
      ];
    }

    if (severity.level === 'moderate') {
      return [
        "Grade II: admit for close monitoring.",
        "PICU observation is preferred.",
        "Give antivenin 6–10 vials according to protocol."
      ];
    }

    if (severity.level === 'severe') {
      return [
        "Grade III: urgent admission, preferably PICU.",
        "Give antivenin 11–15 vials or more according to protocol.",
        "Prepare for airway support, shock management, renal monitoring, and blood product support if indicated."
      ];
    }

    return [
      "Disposition unclear: reassess grading.",
      "If any local reaction, systemic reaction, or lab abnormality is present, observe/admit and monitor closely."
    ];
  },

  getRedFlags: () => [
    "Any systemic reaction after snakebite",
    "Marked local reaction",
    "Rapidly progressing swelling",
    "Swelling extending beyond the bite site",
    "Bleeding or suspected coagulopathy",
    "Abnormal 20-minute whole blood clotting test",
    "Ptosis, weakness, bulbar symptoms, respiratory distress, or paralysis",
    "Shock, arrhythmia, or cardiovascular instability",
    "Hemoglobinuria, myoglobinuria, oliguria, or renal impairment",
    "Laboratory changes: low hematocrit, low fibrinogen, thrombocytopenia, DIC"
  ],

  getDrugDoses: (severity) => {
    const doses = [
      {
        drugName: "Antivenin / Antisnake Venom",
        dose:
          severity.level === 'no'
            ? "No antivenin"
            : severity.level === 'mild'
              ? "3–5 vials"
              : severity.level === 'moderate'
                ? "6–10 vials"
                : severity.level === 'severe'
                  ? "11–15 vials or more"
                  : "Dose depends on final grade",
        notes: "Children receive the same vial dose as adults. Infuse over 1 hour according to local hospital policy."
      },
      {
        drugName: "Neostigmine",
        dose: "25–50 mcg/kg every 4 hours if response is positive",
        notes: "For neurotoxic envenomation. Give with atropine."
      },
      {
        drugName: "Atropine",
        dose: "50 mcg/kg",
        notes: "Give before neostigmine in neurotoxic envenomation."
      },
      {
        drugName: "Tetanus prophylaxis",
        dose: "As indicated",
        notes: "Give booster if indicated according to immunization status."
      },
      {
        drugName: "--- For reaction to antivenin ---",
        dose: "",
        notes: ""
      },
      {
        drugName: "Adrenaline / Epinephrine IM",
        dose: "0.01 mg/kg IM, max 0.5 mg",
        notes: "For significant antivenin reaction. Repeat after 10–15 minutes if not improving or worsening."
      },
      {
        drugName: "Hydrocortisone IV",
        dose: "According to local hospital protocol",
        notes: "Adjunct after adrenaline."
      },
      {
        drugName: "Antihistamine IV/IM",
        dose: "According to local hospital protocol",
        notes: "Adjunct for urticaria, itching, or anaphylactoid reaction."
      }
    ];

    return doses;
  },

  getReferences: () => [
    { title: "Pediatric Department Snake Envenomation Management Protocol", url: "Local hospital protocol" },
    { title: "Approach to Snake Bite Lecture", url: "Dr Mohammad Naqib lecture" }
  ],
};
