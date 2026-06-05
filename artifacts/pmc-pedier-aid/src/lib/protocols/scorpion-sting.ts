import type { DiseaseProtocol, ErData, FormData, Severity, DrugDose } from './types';

const scorpionErData: ErData = {
  historyChecklist: [
    { id: 'timeOfSting', question: 'Time of sting documented?', ifYes: 'Record precisely — grade can progress rapidly in young children' },
    { id: 'ageLessThan5', question: 'Age < 5 years?', redFlag: true, ifYes: 'High-risk group — lower threshold for ACS and PICU referral, even in Grade I' },
    { id: 'stingLocationFaceNeck', question: 'Sting on face or neck?', redFlag: true, ifYes: 'Higher systemic absorption — monitor closely for rapid grade progression' },
    { id: 'vomiting', question: 'Vomiting present?', redFlag: true, ifYes: 'Systemic autonomic sign — classify as minimum Grade II and start ACS + Prazosin' },
    { id: 'excessiveSecretions', question: 'Excessive sweating or salivation?', redFlag: true, ifYes: 'Autonomic storm — classify as minimum Grade II' },
    { id: 'cardiacHistory', question: 'Prior cardiac or respiratory disease?', redFlag: true, ifYes: 'Higher risk of severe cardiotoxicity — early PICU involvement' },
    { id: 'medications', question: 'On beta-blockers or other cardiac medications?', ifYes: 'May mask tachycardia — interpret vital signs with caution' },
  ],
  investigations: [
    { test: 'ECG — 12 lead', category: 'urgent', indication: 'All Grade II and above', criticalValue: 'Arrhythmia or QTc prolongation = immediate concern' },
    { test: 'Blood glucose', category: 'urgent', indication: 'All symptomatic patients — hypoglycaemia common in young children' },
    { test: 'Troponin', category: 'blood', indication: 'Grade II+ or persistent tachycardia/abnormal ECG' },
    { test: 'Electrolytes + renal function', category: 'blood', indication: 'Grade II+' },
    { test: 'CBC', category: 'blood', indication: 'Grade II+' },
    { test: 'Venous blood gas', category: 'blood', indication: 'Grade III–IV or respiratory distress' },
    { test: 'Chest X-ray', category: 'radiology', indication: 'Grade III–IV or suspected pulmonary oedema' },
    { test: 'Echocardiography', category: 'other', indication: 'Grade III–IV to assess LV function and guide Milrinone use' },
  ],
  admissionCriteria: [
    'Grade II — any systemic autonomic sign: admit for ACS + Prazosin + monitoring',
    'Grade III — cardiotoxicity or pulmonary oedema: immediate PICU admission',
    'Grade IV — life-threatening: immediate resuscitation bay + PICU call',
    'Grade I in age < 5 years: admit/observe 6h — admit if any clinical deterioration',
    'Any grade escalation during ER observation: admit regardless of initial grade',
  ],
  highRiskFactors: [
    'Age < 5 years',
    'Persistent vomiting or excessive secretions',
    'Agitation or altered mental status',
    'Tachycardia or hypertension persisting > 1h',
    'Abnormal ECG',
    'Elevated troponin',
    'Prior cardiac or respiratory disease',
    'Rapid grade escalation during ER observation',
  ],
  dischargeCriteria: [
    'Grade I ONLY — after 4–6h observation with no systemic symptoms',
    'Pain controlled and child calm, interactive, and comfortable',
    'Normal vital signs throughout observation period',
    'Family educated on warning signs and able to return immediately',
    'Age ≥ 5 years preferred for ER discharge (age < 5: extend to 6h or admit)',
  ],
  safetyNetting: [
    'Return immediately for: vomiting, sweating, agitation, difficulty breathing, altered behaviour, drowsiness, or any new symptom',
    'Grade I can deteriorate to Grade II or III — especially in children < 5 years',
    'Do not leave child unattended for the first 6 hours after sting',
    'Revisit if ongoing local pain, swelling, or paraesthesia after 24h',
  ],
};

export const scorpionStingProtocol: DiseaseProtocol = {
  id: 'scorpion-sting',
  name: 'Scorpion Sting Management',
  system: 'Toxins and Poisoning',
  description:
    'Grade-based emergency management of paediatric scorpion stings. Protocol specific to clinically significant Middle East/North Africa species (Leiurus quinquestriatus). ACS and Prazosin-based.',
  image: {
    url: "https://picsum.photos/seed/scorpion-sting/600/400",
    hint: "scorpion"
  },
  erData: scorpionErData,

  questions: [
    {
      id: 'grade',
      questionText: 'Clinical Severity Grade',
      type: 'radio',
      options: [
        {
          label: 'Grade I: Local signs only — pain, erythema, swelling, paresthesia. No systemic symptoms.',
          value: '1'
        },
        {
          label: 'Grade II: Systemic autonomic signs — vomiting, sweating, salivation, agitation, tachycardia, hypertension.',
          value: '2'
        },
        {
          label: 'Grade III: Cardiotoxicity or respiratory involvement — pulmonary oedema, arrhythmia, hypotension, LV dysfunction.',
          value: '3'
        },
        {
          label: 'Grade IV: Life-threatening systemic failure — shock, coma, seizures, severe respiratory failure.',
          value: '4'
        },
      ]
    },
    {
      id: 'weight',
      questionText: 'Patient Weight',
      type: 'number',
      unit: 'kg'
    },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const grade = Number(data.grade);

    switch (grade) {
      case 1:
        return {
          level: 'mild',
          details: [
            "GRADE I — Local envenomation only.",
            "No systemic symptoms.",
            "Management: local care, analgesia, 4–6h observation. ACS and Prazosin not indicated.",
          ]
        };

      case 2:
        return {
          level: 'moderate',
          details: [
            "GRADE II — Systemic autonomic envenomation.",
            "Vomiting, sweating, salivation, agitation, tachycardia, or hypertension present.",
            "Management: ACS 3–5 vials + early Prazosin + admission.",
          ]
        };

      case 3:
        return {
          level: 'severe',
          details: [
            "GRADE III — Cardiotoxicity or respiratory involvement.",
            "Pulmonary oedema, arrhythmia, hypotension, or LV dysfunction present.",
            "Management: ACS + Prazosin + Milrinone + immediate PICU.",
          ]
        };

      case 4:
        return {
          level: 'critical',
          details: [
            "GRADE IV — Life-threatening systemic failure.",
            "Shock, coma, seizures, or severe respiratory failure present.",
            "Management: immediate resuscitation + ACS + Prazosin + PICU.",
          ]
        };

      default:
        return {
          level: 'unknown',
          details: [
            "Select clinical grade.",
            "If any systemic symptom is present, treat as Grade II or above.",
          ]
        };
    }
  },

  getManagement: (severity, data) => {
    const grade = Number(data.grade);

    if (!grade) {
      return [
        {
          title: "Select Clinical Grade First",
          recommendations: [
            "Choose Grade I, II, III, or IV based on the child's symptoms.",
            "Any vomiting, sweating, salivation, agitation, tachycardia, hypertension, pulmonary oedema, seizures, shock, or coma = systemic envenomation (Grade II or above).",
          ]
        }
      ];
    }

    if (grade === 1) {
      return [
        {
          title: "STEP 1 — INITIAL ASSESSMENT (Grade I: Local Only)",
          recommendations: [
            "Assess ABCs. Record vital signs.",
            "Observe carefully — young children can deteriorate rapidly.",
            "Grade I requires local signs ONLY (pain, erythema, swelling, paraesthesia) with NO systemic symptoms.",
            "Clean sting site with soap and water. Apply cold compresses intermittently.",
            "Do NOT incise, suction, burn, or apply tourniquet.",
            "Analgesia: Paracetamol for mild pain. Ibuprofen if no contraindication.",
            "IV access not required if child is well with local symptoms only.",
            "ACS and Prazosin are NOT indicated for purely local symptoms.",
          ]
        },
        {
          title: "STEP 2 REASSESS — At 2h and 4–6h",
          recommendations: [
            "Reassess for any new systemic symptom: vomiting, sweating, salivation, agitation, tachycardia, hypertension.",
            "Repeat vital signs.",
            "If completely asymptomatic at 4–6h with controlled local pain: discharge with safety netting.",
            "Age < 5 years: observe for full 6h before considering discharge.",
          ]
        },
        {
          title: "STEP 3 ESCALATION — If Systemic Symptoms Develop",
          recommendations: [
            "Reclassify to Grade II IMMEDIATELY if ANY systemic symptom appears.",
            "Establish IV access.",
            "Perform 12-lead ECG and check blood glucose urgently.",
            "Start ACS 3–5 vials IV over 30–60 minutes.",
            "Start Prazosin 30 mcg/kg/dose orally as soon as reclassified.",
          ]
        },
        {
          title: "STEP 4 LIFE-THREATENING — Shock, Coma, or Respiratory Failure",
          recommendations: [
            "Reclassify to Grade IV immediately.",
            "Call PICU and senior support.",
            "Secure airway. Give high-flow oxygen.",
            "Establish IV/IO access.",
            "Give ACS immediately + Prazosin via NG if oral unavailable.",
          ]
        },
      ];
    }

    if (grade === 2) {
      return [
        {
          title: "STEP 1 — INITIAL STABILIZATION (Grade II: Systemic Autonomic)",
          recommendations: [
            "Assess ABCs immediately.",
            "Establish IV access.",
            "Give oxygen if respiratory distress, poor perfusion, or altered mental status.",
            "Monitor HR, BP, RR, SpO2, perfusion, mental status, and urine output.",
            "Perform 12-lead ECG.",
            "Check blood glucose urgently.",
            "Send labs: troponin, electrolytes, renal function, CBC.",
            "Start ACS: 3–5 vials IV diluted in normal saline over 30–60 minutes.",
            "Start Prazosin: 30 mcg/kg/dose orally as soon as possible.",
            "Do NOT give aggressive fluid boluses — monitor for pulmonary oedema.",
          ]
        },
        {
          title: "STEP 2 REASSESS — At 1–2h",
          recommendations: [
            "Reassess autonomic symptoms: vomiting, sweating, salivation, agitation resolving?",
            "Check vital signs — tachycardia improving?",
            "Repeat ECG if first ECG was abnormal.",
            "Repeat ACS dose if systemic symptoms persist or worsen after 1–2h.",
            "Monitor blood pressure after each Prazosin dose — first dose hypotension possible.",
          ]
        },
        {
          title: "STEP 3 ESCALATION — Cardiotoxicity or Pulmonary Oedema",
          recommendations: [
            "Reclassify to Grade III if pulmonary oedema, arrhythmia, hypotension, or elevated troponin develops.",
            "Alert PICU.",
            "Repeat ACS dose.",
            "Continue Prazosin.",
            "Avoid fluid boluses — pulmonary oedema is cardiogenic.",
            "Start Milrinone 0.25–0.5 mcg/kg/min for LV dysfunction.",
          ]
        },
        {
          title: "STEP 4 LIFE-THREATENING — Shock, Coma, or Seizures",
          recommendations: [
            "Reclassify to Grade IV immediately.",
            "Call PICU NOW.",
            "Secure airway if coma, recurrent seizures, severe respiratory failure, or unable to protect airway.",
            "Give ACS immediately.",
            "Continue Prazosin via NG if oral route unavailable.",
            "Treat seizures with Midazolam.",
          ]
        },
      ];
    }

    if (grade === 3) {
      return [
        {
          title: "STEP 1 — IMMEDIATE PICU CALL (Grade III: Cardiotoxicity)",
          recommendations: [
            "CALL PICU IMMEDIATELY.",
            "Give high-flow oxygen.",
            "Prepare for non-invasive ventilation or intubation if pulmonary oedema, hypoxia, or respiratory failure.",
            "Establish IV access. Continuous ECG, BP, SpO2, and perfusion monitoring.",
            "Start ACS: 3–5 vials IV over 30–60 minutes.",
            "Start Prazosin: 30 mcg/kg/dose orally/NG — cornerstone therapy for catecholamine-mediated myocardial injury.",
            "Avoid aggressive fluid boluses — pulmonary oedema is cardiogenic.",
            "Check blood glucose, electrolytes, troponin, venous blood gas urgently.",
            "Chest X-ray if respiratory symptoms or suspected pulmonary oedema.",
          ]
        },
        {
          title: "STEP 2 REASSESS — At 1–2h",
          recommendations: [
            "Cardiorespiratory status improving?",
            "Repeat ECG and troponin trend.",
            "Repeat ACS if cardiotoxicity or pulmonary oedema persists after 1–2h.",
            "Echocardiography if available — assess LV function to guide Milrinone.",
          ]
        },
        {
          title: "STEP 3 ESCALATION — Persistent Cardiac Failure or Pulmonary Oedema",
          recommendations: [
            "Repeat ACS if symptoms persist.",
            "Start Milrinone: 0.25–0.5 mcg/kg/min IV for myocardial dysfunction or cardiogenic pulmonary oedema.",
            "Vasoactive support in PICU if hypotension persists despite Prazosin and Milrinone.",
            "Repeat CXR and ECG.",
            "Continue avoiding fluid boluses.",
          ]
        },
        {
          title: "STEP 4 LIFE-THREATENING — Respiratory Failure or Refractory Shock",
          recommendations: [
            "Intubate if severe respiratory failure, coma, exhaustion from work of breathing, or unable to protect airway.",
            "Mechanical ventilation with PEEP for cardiogenic pulmonary oedema.",
            "Vasoactive support for refractory hypotension in PICU.",
            "Continuous PICU-level monitoring: ECG, troponin trend, echocardiography, blood gas.",
          ]
        },
      ];
    }

    if (grade === 4) {
      return [
        {
          title: "STEP 1 — IMMEDIATE RESUSCITATION (Grade IV: Life-Threatening)",
          recommendations: [
            "CALL PICU AND SENIOR SUPPORT IMMEDIATELY.",
            "Secure airway if coma, recurrent seizures, severe pulmonary oedema, respiratory failure, or unable to protect airway.",
            "Give high-flow oxygen while preparing definitive airway.",
            "Establish IV or IO access immediately.",
            "Start ACS: 3–5 vials IV over 30–60 minutes.",
            "Start Prazosin: 30 mcg/kg/dose via NG if oral unavailable.",
            "Continuous ECG, BP, SpO2, neurological status, and urine output monitoring.",
            "Check blood glucose immediately — treat hypoglycaemia urgently.",
          ]
        },
        {
          title: "STEP 2 REASSESS — After Initial Stabilization",
          recommendations: [
            "Airway secured and ventilation confirmed?",
            "ACS infusion running and IV/IO access established?",
            "Seizures controlled?",
            "Blood glucose checked and corrected?",
            "Repeat ACS if shock, coma, seizures, or pulmonary oedema persists after 1–2h.",
          ]
        },
        {
          title: "STEP 3 ESCALATION — Refractory Shock, Seizures, or Cardiac Failure",
          recommendations: [
            "Seizures: Midazolam 0.1–0.2 mg/kg IV/IM/IN. Support airway after administration.",
            "Shock — assess type (cardiogenic vs distributive). Avoid blind fluid boluses.",
            "Cautious fluid only if clear hypovolaemia. Cardiogenic shock: avoid fluids — use Milrinone ± vasopressors.",
            "Start Milrinone: 0.25–0.5 mcg/kg/min for myocardial dysfunction.",
            "Repeat ACS according to clinical response and local protocol.",
          ]
        },
        {
          title: "STEP 4 LIFE-THREATENING — Multi-Organ Failure or Cardiac Arrest",
          recommendations: [
            "CPR if cardiac arrest — follow PALS algorithm.",
            "Intubate and ventilate for respiratory failure.",
            "Vasoactive support for refractory shock in PICU.",
            "Atropine 0.02 mg/kg IV for life-threatening symptomatic bradycardia or severe secretions ONLY — avoid routine use.",
            "PICU-level monitoring: continuous ECG, echocardiography, blood gas, renal function.",
            "Consult nephrology early if oliguria/anuria develops.",
          ]
        },
      ];
    }

    return [
      {
        title: "Invalid Grade",
        recommendations: [
          "Please select a valid clinical grade.",
          "If uncertain, manage according to the highest suspected grade.",
        ]
      }
    ];
  },

  getDisposition: (severity, data) => {
    const grade = Number(data.grade);

    if (grade === 1) {
      return [
        "Grade I: observe in ER for 4–6h.",
        "Discharge only if pain controlled, no systemic symptoms, and age ≥ 5 years.",
        "Age < 5: extend to 6h observation — admit if any concern.",
        "Give strict return precautions.",
      ];
    }
    if (grade === 2) {
      return [
        "Grade II: admit for ACS + Prazosin + monitoring.",
        "PICU preferred if age < 5, progressive symptoms, persistent tachycardia, or abnormal ECG.",
      ];
    }
    if (grade === 3) {
      return [
        "Grade III: immediate PICU admission.",
        "ACS + Prazosin + Milrinone for cardiac failure.",
        "Continuous cardiac and respiratory monitoring.",
      ];
    }
    if (grade === 4) {
      return [
        "Grade IV: immediate resuscitation bay + PICU admission.",
        "ACS immediately + Prazosin via NG + airway + shock/seizure management.",
      ];
    }
    return [
      "Select grade first.",
      "If any systemic symptom is present, treat as Grade II or above.",
    ];
  },

  getRedFlags: () => [
    "Age < 5 years",
    "Persistent vomiting",
    "Excessive salivation or sweating",
    "Agitation, irritability, or altered mental status",
    "Tachycardia or hypertension",
    "Hypotension or poor perfusion",
    "Arrhythmia",
    "Pulmonary oedema or respiratory distress",
    "LV dysfunction on echocardiography",
    "Seizures or coma",
    "Elevated troponin",
    "Rapid clinical deterioration",
  ],

  getDrugDoses: (severity, data) => {
    const grade = Number(data.grade);
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (!grade) {
      return [
        {
          drugName: "Select Grade First",
          dose: "Drug recommendations depend on clinical grade.",
          notes: "Grade I: analgesia only. Grade II–IV: ACS + Prazosin ± Milrinone."
        }
      ];
    }

    if (grade === 1) {
      doses.push({
        drugName: "Paracetamol",
        dose: weight > 0 ? `15 mg/kg = ${(15 * weight).toFixed(0)} mg orally, max 1000 mg` : "15 mg/kg orally, max 1000 mg",
        notes: "For local pain. ACS and Prazosin are not indicated in Grade I."
      });
      doses.push({
        drugName: "Ibuprofen",
        dose: weight > 0 ? `10 mg/kg = ${(10 * weight).toFixed(0)} mg orally, max 400 mg` : "10 mg/kg orally, max 400 mg",
        notes: "If no contraindication. For moderate local pain."
      });
      return doses;
    }

    if (grade >= 2) {
      doses.push({
        drugName: "Antiscorpion Serum (ACS)",
        dose: "3–5 vials IV diluted in normal saline over 30–60 minutes",
        notes: "Grade II–IV. Repeat after 1–2h if systemic symptoms persist or worsen. Monitor for allergic reaction."
      });

      doses.push({
        drugName: "Prazosin",
        dose: weight > 0
          ? `30 mcg/kg/dose = ${(30 * weight).toFixed(0)} mcg orally/NG every 6 hours`
          : "30 mcg/kg/dose orally/NG every 6 hours",
        notes: "Start as early as possible for Grade II+. Monitor BP after each dose. Continue until haemodynamically stable."
      });
    }

    if (grade >= 3) {
      doses.push({
        drugName: "Milrinone Infusion",
        dose: "0.25–0.5 mcg/kg/min IV",
        notes: "For myocardial dysfunction or cardiogenic pulmonary oedema (Grade III–IV). Use in PICU."
      });
    }

    if (grade === 4) {
      doses.push({
        drugName: "Midazolam",
        dose: weight > 0
          ? `0.1–0.2 mg/kg = ${(0.1 * weight).toFixed(2)}–${(0.2 * weight).toFixed(2)} mg IV/IM/IN`
          : "0.1–0.2 mg/kg IV/IM/IN",
        notes: "For seizures. Support airway and breathing after administration."
      });

      doses.push({
        drugName: "Atropine",
        dose: weight > 0
          ? `0.02 mg/kg = ${(0.02 * weight).toFixed(2)} mg IV`
          : "0.02 mg/kg IV",
        notes: "Avoid routine use. For life-threatening symptomatic bradycardia or severe secretions only."
      });
    }

    return doses;
  },

  getReferences: () => [
    {
      title: "Pediatric Scorpion Sting Management Protocol — Grade-Based ER Clinical Tool",
      url: ""
    }
  ],
};
