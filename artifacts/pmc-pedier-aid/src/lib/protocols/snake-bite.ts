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

    { id: 'hasLocalSwelling', questionText: 'Is there any local swelling or local reaction?', type: 'boolean' },

    { id: 'swellingExtent', questionText: 'If swelling is present, what is the extent?', type: 'select', options: [
        { label: 'None', value: 'none' },
        { label: 'Local swelling only / around bite site', value: 'local_only' },
        { label: 'Swelling beyond the bite site', value: 'beyond_site' },
        { label: 'Marked local reaction / >50% limb / rapidly progressing', value: 'marked' },
    ]},

    { 
      id: 'hasSystemicSigns', 
      questionText: 'Are there systemic reactions?', 
      type: 'boolean', 
      info: 'Examples: vomiting, drowsiness, headache, bleeding, ptosis, weakness, shock, arrhythmia, respiratory distress, altered consciousness.' 
    },

    { 
      id: 'hasMarkedSystemicSigns', 
      questionText: 'Are there MARKED systemic reactions?', 
      type: 'boolean', 
      info: 'Examples: bleeding diathesis, DIC, shock, ARDS, severe neurotoxicity, respiratory compromise, cardiovascular instability.' 
    },

    { 
      id: 'hasLabAbnormalities', 
      questionText: 'Are there laboratory changes?', 
      type: 'boolean', 
      info: 'Examples: low hematocrit, low fibrinogen, thrombocytopenia, abnormal coagulation profile, DIC, abnormal 20-minute whole blood clotting test.' 
    },

    { 
      id: 'hasMarkedLabAbnormalities', 
      questionText: 'Are there MARKED laboratory changes?', 
      type: 'boolean', 
      info: 'Examples: marked coagulopathy, DIC, severe thrombocytopenia, low fibrinogen, low hematocrit, persistent abnormal clotting.' 
    }
  ],

  calculateSeverity: (data: FormData): Severity => {
    const hasMarkedLocalReaction = data.swellingExtent === 'marked';

    // Grade III: Severe envenomation
    // Final reference: Marked local reaction PLUS marked systemic reaction PLUS marked laboratory changes.
    if (
      hasMarkedLocalReaction &&
      data.hasMarkedSystemicSigns &&
      data.hasMarkedLabAbnormalities
    ) {
      return {
        level: 'severe',
        details: [
          "Grade III = Severe envenomation.",
          "Marked local reaction PLUS marked systemic reactions PLUS marked laboratory changes.",
          "Recommended antivenin dose: 11–15 vials or more."
        ]
      };
    }

    // Grade II: Moderate envenomation
    // Final reference: Swelling beyond bite site PLUS systemic reactions OR laboratory changes.
    if (
      data.swellingExtent === 'beyond_site' &&
      (data.hasSystemicSigns || data.hasLabAbnormalities)
    ) {
      return {
        level: 'moderate',
        details: [
          "Grade II = Moderate envenomation.",
          "Swelling beyond the bite site PLUS systemic reactions OR laboratory changes.",
          "Recommended antivenin dose: 6–10 vials."
        ]
      };
    }

    // Marked swelling with any systemic/lab abnormality should not be missed.
    // If marked local swelling is present but full Grade III criteria are not met,
    // classify at least as moderate and escalate clinical monitoring.
    if (
      hasMarkedLocalReaction &&
      (data.hasSystemicSigns || data.hasLabAbnormalities || data.hasMarkedSystemicSigns || data.hasMarkedLabAbnormalities)
    ) {
      return {
        level: 'moderate',
        details: [
          "At least Grade II = Moderate envenomation.",
          "Marked local reaction is present with systemic or laboratory abnormality, but full Grade III criteria are not complete.",
          "Recommended antivenin dose: 6–10 vials. Reassess frequently for progression to Grade III."
        ]
      };
    }

    // Grade I: Mild envenomation
    // Final reference: Fang marks + local swelling + no systemic reactions.
    if (
      data.hasFangMarks &&
      data.hasLocalSwelling &&
      (data.swellingExtent === 'local_only' || data.swellingExtent === 'beyond_site' || data.swellingExtent === 'marked') &&
      !data.hasSystemicSigns &&
      !data.hasMarkedSystemicSigns &&
      !data.hasLabAbnormalities &&
      !data.hasMarkedLabAbnormalities
    ) {
      return {
        level: 'mild',
        details: [
          "Grade I = Mild envenomation.",
          "Fang marks present with local swelling but no systemic reactions.",
          "Recommended antivenin dose: 3–5 vials."
        ]
      };
    }

    // Grade 0: No envenomation
    // Final reference: Fang marks + no local reaction + no systemic reaction.
    if (
      data.hasFangMarks &&
      !data.hasLocalSwelling &&
      data.swellingExtent === 'none' &&
      !data.hasSystemicSigns &&
      !data.hasMarkedSystemicSigns &&
      !data.hasLabAbnormalities &&
      !data.hasMarkedLabAbnormalities
    ) {
      return {
        level: 'no',
        details: [
          "Grade 0 = No envenomation.",
          "Fang marks present, no local reaction, and no systemic reaction.",
          "No antivenin indicated. Observe in emergency department for at least 4 hours."
        ]
      };
    }

    return {
      level: 'unknown',
      details: [
        "Unable to assign a clear grade.",
        "Reassess fang marks, local swelling extent, systemic reactions, and laboratory changes.",
        "If any local reaction is present, observe closely and consider admission according to protocol."
      ]
    };
  },

  getManagement: (severity, data) => {
    const management = [
      {
        title: "Initial ED Management",
        recommendations: [
          "Follow ABCs: assess airway, breathing, and circulation.",
          "Reassure the patient.",
          "Immobilize the bitten limb as for a fractured limb.",
          "Insert IV access.",
          "Record baseline vital signs.",
          "Record circumference of the bitten extremity.",
          "Mark the border of swelling/ecchymosis on the limb to monitor progression.",
          "Clean the wound.",
          "Give tetanus prophylaxis if indicated.",
          "Avoid incision, suction, ice packs, or harmful local measures.",
          "Do not apply a tourniquet or constricting band."
        ]
      },
      {
        title: "Final Grading & Antivenin Dose",
        recommendations: [
          "Grade 0: Fang marks present, no local reaction, no systemic reaction → No antivenin.",
          "Grade I: Fang marks present + local swelling + no systemic reaction → Antivenin 3–5 vials.",
          "Grade II: Swelling beyond bite site PLUS systemic reactions OR laboratory changes → Antivenin 6–10 vials.",
          "Grade III: Marked local reaction PLUS marked systemic reactions PLUS marked laboratory changes → Antivenin 11–15 vials or more.",
          "Children receive the same antivenin vial dose as adults."
        ]
      },
      {
        title: "Investigations & Monitoring",
        recommendations: [
          "CBC with platelet count.",
          "PT, PTT, INR if available.",
          "Fibrinogen and fibrin degradation products if available.",
          "BUN, creatinine, and renal function.",
          "Creatine phosphokinase if significant tissue injury or myotoxicity is suspected.",
          "Urinalysis for hemoglobinuria or myoglobinuria.",
          "20-minute whole blood clotting test if viper envenomation or coagulopathy is suspected.",
          "Repeat investigations according to severity and progression."
        ]
      },
      {
        title: "Supportive Treatment",
        recommendations: [
          "Neurotoxic envenomation: consider neostigmine with atropine.",
          "Prepare for airway support and mechanical ventilation if respiratory paralysis, bulbar weakness, absent gag reflex, pooling secretions, or respiratory distress occurs.",
          "Monitor urine output closely.",
          "Manage renal failure supportively; dialysis may be required.",
          "Antibiotics are not routine; give only if secondary infection is suspected.",
          "Surgical debridement may be needed later if tissue necrosis develops."
        ]
      },
      {
        title: "Observation / Admission",
        recommendations: [
          "Grade 0: observe in the emergency department for at least 4 hours.",
          "Absence of local reactions within 30–60 minutes makes significant envenomation less likely.",
          "If any local reaction is present, observe/admit for 24 hours.",
          "PICU observation is preferred for patients with local reaction, systemic reaction, lab abnormality, or need for antivenin."
        ]
      }
    ];

    if (severity.level === 'mild' || severity.level === 'moderate' || severity.level === 'severe') {
      management.splice(2, 0, {
        title: "Antivenin Administration",
        recommendations: [
          "Give antivenin according to grade-based dose.",
          severity.level === 'mild'
            ? "Current grade: Grade I mild envenomation → give 3–5 vials."
            : severity.level === 'moderate'
              ? "Current grade: Grade II moderate envenomation → give 6–10 vials."
              : "Current grade: Grade III severe envenomation → give 11–15 vials or more.",
          "Dilute in normal saline and infuse over 1 hour according to local hospital policy.",
          "Monitor closely for anaphylactoid reaction during infusion.",
          "Skin testing is not routinely recommended because it has poor predictive value and may sensitize the patient.",
          "If reaction occurs: stop antivenin temporarily, give IM adrenaline, add hydrocortisone and antihistamine according to local protocol, then restart slowly once recovered."
        ]
      });
    }

    if (severity.level === 'moderate' || severity.level === 'severe') {
      management.splice(3, 0, {
        title: "When to Repeat Antivenin",
        recommendations: [
          "Repeat antivenin if blood remains incoagulable after 6 hours.",
          "Repeat antivenin if spontaneous bleeding persists after 1–2 hours.",
          "Repeat antivenin if neurotoxic signs worsen after 1–2 hours.",
          "Repeat antivenin if cardiovascular signs worsen after 1–2 hours.",
          "Reassess clinically and with labs before giving additional doses."
        ]
      });
    }

    return management;
  },

  getDisposition: (severity) => {
    if (severity.level === 'no') {
      return [
        "Grade 0: observe in the emergency department for at least 4 hours.",
        "If no local or systemic reaction develops, discharge may be considered with clear return precautions."
      ];
    }

    if (severity.level === 'mild') {
      return [
        "Grade I: admit/observe for 24 hours because local reaction is present.",
        "Monitor limb swelling, vital signs, neurological status, urine output, and labs."
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
        "Prepare for airway support, shock management, blood product support if indicated, and renal monitoring."
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
        notes: "For significant anaphylactoid reaction. Repeat after 10–15 minutes if not improving or worsening."
      },
      {
        drugName: "Hydrocortisone IV",
        dose: "According to local hospital protocol",
        notes: "Adjunct after adrenaline for longer-term protection against anaphylactoid reaction."
      },
      {
        drugName: "Antihistamine IV/IM",
        dose: "According to local hospital protocol",
        notes: "Adjunct treatment for urticaria/itching or anaphylactoid reaction."
      }
    ];

    return doses;
  },

  getReferences: () => [
    {
      title: "Pediatric Department Snake Envenomation Management Protocol",
      url: "Local hospital protocol"
    },
    {
      title: "Approach to Snake Bite Lecture",
      url: "Dr Mohammad Naqib lecture"
    }
  ],
};
