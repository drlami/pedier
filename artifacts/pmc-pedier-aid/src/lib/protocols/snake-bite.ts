import type { DiseaseProtocol, ErData, FormData, Severity } from './types';

const snakeBiteErData: ErData = {
  historyChecklist: [
    { id: 'timeOfBite', question: 'Time of bite documented?', ifYes: 'Record precisely — delayed envenomation signs can appear up to 12–24h after a dry bite' },
    { id: 'speciesSeen', question: 'Snake species identified or seen by family?', ifYes: 'Viper vs cobra species affects haematotoxic vs neurotoxic management emphasis' },
    { id: 'headNeckBite', question: 'Bite on head, neck, or trunk?', redFlag: true, ifYes: 'Higher envenomation risk — prioritise urgent PICU referral' },
    { id: 'tourniquetApplied', question: 'Tourniquet or constricting band applied?', redFlag: true, ifYes: 'Remove carefully — may worsen ischaemia. Do NOT release abruptly without IV access and monitoring' },
    { id: 'incisionMade', question: 'Incision or suction attempted at bite site?', redFlag: true, ifYes: 'Documents first-aid error — monitor for secondary infection' },
    { id: 'priorAntivenom', question: 'Prior antivenom exposure or snakebite history?', redFlag: true, ifYes: 'Increased anaphylaxis risk — have adrenaline, hydrocortisone, and antihistamine ready before infusion' },
    { id: 'cardioRenalDisease', question: 'Known cardiac or renal comorbidity?', ifYes: 'Lower threshold for PICU referral and early nephrology input' },
  ],
  investigations: [
    { test: '20-minute whole blood clotting test (20-min WBCT)', category: 'urgent', criticalValue: 'Incoagulable = viper envenomation confirmed → give antivenom urgently' },
    { test: 'CBC + platelet count', category: 'blood' },
    { test: 'PT, PTT, INR', category: 'blood' },
    { test: 'Fibrinogen', category: 'blood', indication: 'Grade II–III or coagulopathy suspected' },
    { test: 'BUN and creatinine (renal function)', category: 'blood' },
    { test: 'CPK', category: 'blood', indication: 'Significant tissue injury or myonecrosis suspected' },
    { test: 'Urinalysis — hemoglobin and myoglobin dipstick', category: 'other' },
    { test: 'Repeat coagulation + renal labs at 6h post-antivenom', category: 'other', indication: 'All admitted Grade I–III patients' },
  ],
  admissionCriteria: [
    'Grade I — local swelling only: admit for minimum 24h observation and antivenom monitoring',
    'Grade II — swelling beyond site OR systemic/lab signs: admit, PICU preferred',
    'Grade III — marked local + systemic + lab abnormalities: PICU admission',
    'Any antivenom given → minimum 24h inpatient monitoring',
    'Any systemic sign (bleeding, weakness, ptosis, drowsiness, shock) → admit regardless of grade',
  ],
  highRiskFactors: [
    'Age < 5 years',
    'Bite on head, neck, or trunk',
    'Multiple bites',
    'Rapidly progressive swelling',
    'Neurotoxic signs: ptosis, dysarthria, bulbar weakness',
    'Incoagulable 20-min WBCT',
    'Prior antivenom exposure (higher anaphylaxis risk)',
  ],
  dischargeCriteria: [
    'Grade 0 ONLY — after minimum 4h observation with no evolving signs',
    'No local swelling, erythema, or progressive pain at any point during observation',
    'No systemic symptoms throughout observation period',
    'Normal 20-min WBCT and baseline labs if obtained',
    'Family able to observe patient at home and return immediately if any symptom develops',
  ],
  safetyNetting: [
    'Return immediately for: new swelling, swelling crossing a joint, spreading redness, numbness, weakness, ptosis, blurred vision, bleeding from any site, difficulty breathing, drowsiness, or reduced urine output',
    'Delayed envenomation can occur up to 12–24 hours after a dry bite — symptoms may appear after discharge',
    'Do not drive home alone after any snakebite visit, even if discharged as Grade 0',
    'Follow up in 24–48 hours if any local reaction was present during observation, even if labs were normal',
  ],
};

export const snakeBiteProtocol: DiseaseProtocol = {
  id: 'snake-bite',
  name: 'Snake Bite Management',
  system: 'Toxins and Poisoning',
  description: 'Grade-based emergency management of paediatric snake envenomation. Local Pediatric Department protocol with grade-graded antivenom dosing (Grade 0–III).',
  image: {
    url: "https://picsum.photos/seed/snake-bite/600/400",
    hint: "snake reptile"
  },
  erData: snakeBiteErData,

  questions: [
    { id: 'hasFangMarks', questionText: 'Are fang marks present?', type: 'boolean' },
    { id: 'hasLocalSwelling', questionText: 'Is there local swelling?', type: 'boolean' },
    {
      id: 'swellingExtent', questionText: 'Extent of swelling?', type: 'select', options: [
        { label: 'None', value: 'none' },
        { label: 'Local / around bite site only', value: 'local_only' },
        { label: 'Swelling beyond the bite site', value: 'beyond_site' },
        { label: 'Marked / rapidly progressive / >50% limb', value: 'marked' },
      ]
    },
    {
      id: 'hasSystemicSigns',
      questionText: 'Are systemic signs present?',
      type: 'boolean',
      info: 'Bleeding, vomiting, drowsiness, headache, ptosis, weakness, shock, arrhythmia, respiratory distress, altered consciousness.'
    },
    {
      id: 'hasLabAbnormalities',
      questionText: 'Are laboratory abnormalities present?',
      type: 'boolean',
      info: 'Low hematocrit, low fibrinogen, thrombocytopenia, DIC, abnormal coagulation profile, incoagulable 20-minute whole blood clotting test.'
    }
  ],

  calculateSeverity: (data: FormData): Severity => {
    const markedLocal = data.swellingExtent === 'marked';
    const beyondSite = data.swellingExtent === 'beyond_site';
    const localOnly = data.swellingExtent === 'local_only';

    if (markedLocal && data.hasSystemicSigns && data.hasLabAbnormalities) {
      return {
        level: 'severe',
        details: [
          "GRADE III — SEVERE ENVENOMATION",
          "Marked local reaction + systemic signs + laboratory abnormalities.",
          "ASV dose: 11–15 vials or more. Immediate PICU referral."
        ]
      };
    }

    if ((beyondSite || markedLocal) && (data.hasSystemicSigns || data.hasLabAbnormalities)) {
      return {
        level: 'moderate',
        details: [
          "GRADE II — MODERATE ENVENOMATION",
          "Swelling beyond bite site + systemic signs or laboratory abnormalities.",
          "ASV dose: 6–10 vials. PICU preferred."
        ]
      };
    }

    if (
      data.hasFangMarks &&
      data.hasLocalSwelling &&
      (localOnly || beyondSite || markedLocal) &&
      !data.hasSystemicSigns &&
      !data.hasLabAbnormalities
    ) {
      return {
        level: 'mild',
        details: [
          "GRADE I — MILD ENVENOMATION",
          "Fang marks with local swelling only. No systemic signs or lab abnormalities.",
          "ASV dose: 3–5 vials. Admit for 24h."
        ]
      };
    }

    if (
      data.hasFangMarks &&
      !data.hasLocalSwelling &&
      data.swellingExtent === 'none' &&
      !data.hasSystemicSigns &&
      !data.hasLabAbnormalities
    ) {
      return {
        level: 'no',
        details: [
          "GRADE 0 — NO ENVENOMATION",
          "Fang marks present, but no local or systemic reaction.",
          "No ASV. Observe in ER for at least 4 hours."
        ]
      };
    }

    return {
      level: 'unknown',
      details: [
        "GRADE UNCLEAR",
        "Reassess fang marks, local swelling extent, systemic signs, and laboratory results.",
        "If any local reaction, systemic signs, or lab abnormalities are present, observe closely and seek senior/PICU review."
      ]
    };
  },

  getManagement: (severity) => {
    if (severity.level === 'no') {
      return [
        {
          title: "STEP 1 — INITIAL ASSESSMENT (Grade 0: No Envenomation)",
          recommendations: [
            "Confirm Grade 0: fang marks ONLY, with NO local swelling and NO systemic reaction.",
            "Reassure patient and family.",
            "Immobilize the bitten limb at or below heart level.",
            "Clean the wound thoroughly.",
            "Record baseline vital signs and document time of bite.",
            "Mark limb circumference at bite site for serial comparison.",
            "Give tetanus prophylaxis if indicated.",
            "Do NOT apply tourniquet, perform incision, apply ice, suction, or use constrictive bandage.",
          ]
        },
        {
          title: "STEP 2 REASSESS — At 2h and 4h",
          recommendations: [
            "Reassess for any new local swelling, erythema, or pain.",
            "Repeat vital signs.",
            "Perform 20-minute whole blood clotting test if not done at admission, or if any concern.",
            "If ANY new local or systemic sign develops: reclassify to Grade I or above immediately.",
            "If completely asymptomatic at 4h with normal 20-min WBCT: consider discharge with safety netting.",
          ]
        },
        {
          title: "STEP 3 ESCALATION — If Envenomation Signs Develop",
          recommendations: [
            "If local swelling appears: reclassify to Grade I → insert IV access, send labs, give ASV 3–5 vials, admit for 24h.",
            "If systemic signs or lab abnormalities: reclassify to Grade II or III immediately.",
            "Do not discharge until full 4h observation is completed with no new findings.",
          ]
        },
        {
          title: "STEP 4 LIFE-THREATENING — Unexpected Systemic Signs",
          recommendations: [
            "If sudden coagulopathy, bleeding, shock, or neurological signs appear: reclassify to Grade II–III immediately.",
            "Activate PICU and senior support.",
            "Give ASV 6–15+ vials based on reassessed grade.",
            "Prepare for airway support and resuscitation.",
          ]
        },
      ];
    }

    if (severity.level === 'mild') {
      return [
        {
          title: "STEP 1 — INITIAL STABILIZATION (Grade I: Mild Envenomation)",
          recommendations: [
            "Immobilize bitten limb — position as fractured limb.",
            "Establish IV access.",
            "Record baseline vital signs. Mark limb circumference at bite site.",
            "Perform 20-minute whole blood clotting test immediately.",
            "Send labs: CBC, PT/PTT/INR, fibrinogen, BUN, creatinine, CPK, urinalysis.",
            "Clean the wound. Give tetanus prophylaxis if indicated.",
            "Start antivenom: 3–5 vials diluted in normal saline over 1 hour.",
            "Keep adrenaline, hydrocortisone, and antihistamine at bedside during infusion.",
            "Monitor vital signs every 15 minutes during infusion.",
          ]
        },
        {
          title: "STEP 2 REASSESS — At 1–2h Post-Antivenom",
          recommendations: [
            "Reassess: swelling stable? Vital signs stable? Any new systemic signs?",
            "Check for antivenom reaction: urticaria, bronchospasm, tachycardia, hypotension.",
            "If antivenom reaction: STOP infusion → IM adrenaline → hydrocortisone + antihistamine → restart slowly when recovered.",
            "Repeat 20-min WBCT at 6h post-antivenom.",
            "Monitor limb circumference hourly.",
          ]
        },
        {
          title: "STEP 3 ESCALATION — Progression to Grade II",
          recommendations: [
            "If swelling progresses beyond bite site: reclassify to Grade II → additional ASV (6–10 vials total).",
            "If systemic signs appear (bleeding, drowsiness, ptosis, weakness, vomiting): reclassify immediately.",
            "If lab abnormalities develop (incoagulable WBCT, low fibrinogen, thrombocytopenia): reclassify.",
            "Repeat antivenom if blood incoagulable at 6h, spontaneous bleeding persists at 1–2h, or neurotoxic/cardiovascular signs worsen at 1–2h.",
            "Alert PICU if Grade II criteria met.",
          ]
        },
        {
          title: "STEP 4 LIFE-THREATENING — Respiratory Failure or Shock",
          recommendations: [
            "PICU referral IMMEDIATELY.",
            "Secure airway if: respiratory failure, ptosis with bulbar weakness, absent gag reflex, or pooling secretions.",
            "Neurotoxic envenomation: Neostigmine 25–50 mcg/kg IV every 4h + Atropine 50 mcg/kg IV before each neostigmine dose.",
            "Shock: cautious fluid resuscitation + vasopressors if indicated.",
            "Renal failure: strict urine output monitoring — dialysis may be required.",
            "Blood products for severe coagulopathy: FFP, cryoprecipitate, platelets as indicated.",
          ]
        },
      ];
    }

    if (severity.level === 'moderate') {
      return [
        {
          title: "STEP 1 — INITIAL STABILIZATION (Grade II: Moderate Envenomation)",
          recommendations: [
            "Alert PICU — Grade II warrants PICU-level observation.",
            "Immobilize bitten limb at heart level.",
            "Establish IV access immediately.",
            "Give high-flow oxygen if respiratory distress, poor perfusion, or altered mental status.",
            "Perform 20-minute whole blood clotting test stat.",
            "Send URGENT labs: CBC, PT/PTT/INR, fibrinogen, BUN, creatinine, CPK, urinalysis.",
            "Start antivenom: 6–10 vials diluted in normal saline over 1 hour.",
            "Keep adrenaline, hydrocortisone, and antihistamine at bedside during infusion.",
            "Monitor vital signs every 15 minutes.",
          ]
        },
        {
          title: "STEP 2 REASSESS — At 1–2h Post-Antivenom",
          recommendations: [
            "Reassess: systemic symptoms improving? Vital signs stable?",
            "Reassess swelling extent — progressing or stable?",
            "Check for antivenom reaction and treat promptly if present.",
            "Repeat 20-min WBCT at 6h post-antivenom.",
            "Monitor neurological status, urine output, and limb circumference hourly.",
          ]
        },
        {
          title: "STEP 3 ESCALATION — Worsening Systemic or Coagulation Signs",
          recommendations: [
            "Repeat antivenom if blood incoagulable at 6h.",
            "Repeat antivenom if spontaneous bleeding persists after 1–2h.",
            "Repeat antivenom if neurotoxic or cardiovascular signs worsen after 1–2h.",
            "Neurotoxic signs (ptosis, bulbar weakness): Neostigmine 25–50 mcg/kg IV q4h + Atropine 50 mcg/kg IV before each dose.",
            "If swelling becomes marked + systemic + lab abnormalities: reclassify to Grade III.",
            "Escalate to full PICU monitoring.",
          ]
        },
        {
          title: "STEP 4 LIFE-THREATENING — Respiratory Failure or Haemodynamic Collapse",
          recommendations: [
            "PICU IMMEDIATELY — secure airway if respiratory distress, paralysis, or absent gag reflex.",
            "Intubate for: apnoea, severe bulbar weakness, respiratory failure, or pooling secretions.",
            "Shock: cautious fluid resuscitation + vasopressors in PICU.",
            "Renal failure: strict urine output monitoring — dialysis if oliguria/anuria.",
            "FFP, cryoprecipitate, or platelet transfusion for refractory coagulopathy.",
          ]
        },
      ];
    }

    if (severity.level === 'severe') {
      return [
        {
          title: "STEP 1 — IMMEDIATE PICU ACTIVATION (Grade III: Severe Envenomation)",
          recommendations: [
            "CALL PICU IMMEDIATELY.",
            "Follow full ABCs — prepare for airway support.",
            "Establish IV access — draw stat labs while cannulating.",
            "Give high-flow oxygen immediately.",
            "Perform 20-min WBCT immediately.",
            "Send STAT labs: CBC, PT/PTT/INR, fibrinogen, BUN, creatinine, CPK, urinalysis.",
            "Start antivenom: 11–15 vials diluted in normal saline over 1 hour.",
            "Have adrenaline, hydrocortisone, and antihistamine immediately available during infusion.",
            "Insert urinary catheter — monitor hourly urine output.",
          ]
        },
        {
          title: "STEP 2 REASSESS — At 1–2h Post-Antivenom",
          recommendations: [
            "Reassess all systemic signs: bleeding, neurological, cardiovascular, respiratory.",
            "Vital signs every 10–15 minutes.",
            "Check for antivenom reaction — treat immediately if present.",
            "Repeat 20-min WBCT at 6h post-antivenom.",
            "Reassess neurological status: ptosis, dysarthria, gag reflex, limb power.",
          ]
        },
        {
          title: "STEP 3 ESCALATION — Persistent or Worsening Envenomation",
          recommendations: [
            "Repeat antivenom if blood incoagulable at 6h post-antivenom.",
            "Repeat antivenom if spontaneous bleeding persists at 1–2h.",
            "Repeat antivenom if neurotoxic signs (ptosis, weakness, bulbar) worsen at 1–2h.",
            "Repeat antivenom if cardiovascular signs worsen at 1–2h.",
            "Neurotoxic: Neostigmine 25–50 mcg/kg IV every 4h + Atropine 50 mcg/kg IV before each dose.",
            "Blood products: FFP, cryoprecipitate, platelet concentrate for severe coagulopathy.",
            "Surgical debridement may be required later if tissue necrosis develops.",
          ]
        },
        {
          title: "STEP 4 LIFE-THREATENING — Multi-System Failure",
          recommendations: [
            "Airway: intubate for respiratory failure, bulbar palsy, pooling secretions, or absent gag reflex.",
            "Mechanical ventilation as required.",
            "Shock: vasopressors + careful fluid management in PICU.",
            "Renal failure: close urine output monitoring — early dialysis if oliguria.",
            "Antivenom reaction: STOP infusion → IM adrenaline 0.01 mg/kg (max 0.5 mg) → hydrocortisone + antihistamine → restart slowly when recovered.",
            "Antibiotics only if secondary wound infection is confirmed or strongly suspected.",
          ]
        },
      ];
    }

    return [
      {
        title: "STEP 1 — REASSESS GRADE",
        recommendations: [
          "Clinical grade is not yet clear — reassess all five parameters.",
          "Check: fang marks, local swelling extent, systemic signs, and laboratory results.",
          "Establish IV access, send baseline labs, and perform 20-min WBCT.",
          "Observe closely and seek senior/PICU review if any concern.",
        ]
      },
      {
        title: "STEP 2 REASSESS — After Lab Results",
        recommendations: [
          "If 20-min WBCT is incoagulable: treat as Grade II minimum → give ASV 6–10 vials.",
          "If any systemic sign: treat as Grade II or above.",
          "If only local swelling without systemic signs or lab changes: treat as Grade I → give ASV 3–5 vials.",
        ]
      },
      {
        title: "STEP 3 ESCALATION — Uncertainty in High-Risk Patient",
        recommendations: [
          "Age < 5, bite on head/neck/trunk, multiple bites, or rapidly progressive swelling: lower threshold for antivenom.",
          "Alert PICU early if any ambiguity and clinical concern is high.",
        ]
      },
      {
        title: "STEP 4 LIFE-THREATENING — Assume Worst Grade if Deteriorating",
        recommendations: [
          "If haemodynamic instability, respiratory distress, or neurological signs develop: treat as Grade III.",
          "Give ASV 11–15 vials. Activate PICU immediately.",
        ]
      },
    ];
  },

  getDisposition: (severity) => {
    if (severity.level === 'no') {
      return [
        "Grade 0: observe in ER for minimum 4 hours.",
        "If no local or systemic reaction develops and 20-min WBCT is normal: discharge with strict safety netting.",
        "Follow up in 24–48h if any local reaction present during observation.",
      ];
    }
    if (severity.level === 'mild') {
      return [
        "Grade I: admit for minimum 24 hours.",
        "Antivenom 3–5 vials + monitoring for systemic progression and antivenom reaction.",
        "Escalate to PICU if systemic signs, lab abnormalities, or rapidly progressive swelling develop.",
      ];
    }
    if (severity.level === 'moderate') {
      return [
        "Grade II: admit, PICU preferred.",
        "Antivenom 6–10 vials.",
        "PICU for age < 5, progressive symptoms, neurotoxic features, or haemodynamic instability.",
      ];
    }
    if (severity.level === 'severe') {
      return [
        "Grade III: immediate PICU admission.",
        "Antivenom 11–15 vials or more.",
        "Prepare for airway support, mechanical ventilation, shock management, renal monitoring, and blood product support.",
      ];
    }
    return [
      "Grade unclear: reassess. Observe/admit if any local reaction, systemic sign, or lab abnormality.",
    ];
  },

  getRedFlags: () => [
    "Any systemic reaction after snakebite",
    "Marked local reaction or rapidly progressive swelling",
    "Swelling extending beyond the bite site",
    "Bleeding or suspected coagulopathy",
    "Incoagulable 20-minute whole blood clotting test",
    "Ptosis, weakness, bulbar symptoms, or respiratory distress",
    "Shock, arrhythmia, or cardiovascular instability",
    "Haemoglobinuria, myoglobinuria, or oliguria",
    "Laboratory changes: low fibrinogen, thrombocytopenia, DIC",
  ],

  getDrugDoses: (severity) => {
    return [
      {
        drugName: "Antisnake Venom (ASV)",
        dose:
          severity.level === 'no'
            ? "No antivenom — Grade 0"
            : severity.level === 'mild'
              ? "3–5 vials IV over 1 hour"
              : severity.level === 'moderate'
                ? "6–10 vials IV over 1 hour"
                : severity.level === 'severe'
                  ? "11–15 vials (or more) IV over 1 hour"
                  : "Dose depends on final grade",
        notes: "Children receive the same vial dose as adults. Dilute in normal saline. Repeat if blood incoagulable at 6h, spontaneous bleeding at 1–2h, or neurotoxic/cardiovascular signs worsen at 1–2h."
      },
      {
        drugName: "Neostigmine IV",
        dose: "25–50 mcg/kg every 4 hours",
        notes: "Neurotoxic envenomation only. Always give atropine before each dose. Continue if positive response (improved ptosis or muscle strength at 30 min)."
      },
      {
        drugName: "Atropine IV",
        dose: "50 mcg/kg",
        notes: "Give BEFORE each neostigmine dose in neurotoxic envenomation."
      },
      {
        drugName: "Tetanus prophylaxis",
        dose: "As per immunization status",
        notes: "Booster dose if indicated."
      },
      {
        drugName: "— Antivenom reaction —",
        dose: "",
        notes: ""
      },
      {
        drugName: "Adrenaline / Epinephrine IM",
        dose: "0.01 mg/kg IM, max 0.5 mg",
        notes: "For significant antivenom reaction. Repeat after 10–15 minutes if not improving."
      },
      {
        drugName: "Hydrocortisone IV",
        dose: "4 mg/kg IV, max 200 mg",
        notes: "Adjunct after adrenaline for antivenom reaction."
      },
      {
        drugName: "Diphenhydramine (Antihistamine) IV",
        dose: "1 mg/kg IV, max 50 mg",
        notes: "Adjunct for urticaria or anaphylactoid reaction during antivenom infusion."
      },
    ];
  },

  getReferences: () => [
    { title: "Pediatric Department Snake Envenomation Management Protocol", url: "Local hospital protocol" },
    { title: "Approach to Snake Bite", url: "Dr Mohammad Naqib lecture" },
  ],
};
