import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const scorpionStingProtocol: DiseaseProtocol = {
  id: 'scorpion-sting',
  name: 'Scorpion Sting Management',
  system: 'Toxins and Poisoning',
  description:
    'Grade-based emergency management of pediatric scorpion stings, especially clinically significant Middle East/North Africa species such as Leiurus quinquestriatus.',
  image: {
    url: "https://picsum.photos/seed/scorpion-sting/600/400",
    hint: "scorpion"
  },

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
          label: 'Grade III: Cardiotoxicity or respiratory involvement — pulmonary edema, arrhythmia, hypotension, LV dysfunction.',
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
            "Treatment: local care, analgesia, observation, and discharge if stable."
          ]
        };

      case 2:
        return {
          level: 'moderate',
          details: [
            "GRADE II — Systemic autonomic envenomation.",
            "Symptoms may include vomiting, sweating, salivation, agitation, tachycardia, or hypertension.",
            "Treatment: Antiscorpion Serum + early Prazosin + admission/close monitoring."
          ]
        };

      case 3:
        return {
          level: 'severe',
          details: [
            "GRADE III — Severe envenomation with cardiotoxicity or respiratory involvement.",
            "Pulmonary edema, arrhythmia, hypotension, or LV dysfunction may occur.",
            "Treatment: Antiscorpion Serum + Prazosin + PICU + cardiorespiratory support."
          ]
        };

      case 4:
        return {
          level: 'severe',
          details: [
            "GRADE IV — Life-threatening systemic failure.",
            "Shock, coma, seizures, or severe respiratory failure may occur.",
            "Treatment: immediate resuscitation + Antiscorpion Serum + Prazosin + PICU."
          ]
        };

      default:
        return {
          level: 'unknown',
          details: [
            "Select clinical grade first.",
            "If any systemic symptom is present, treat as Grade II or above."
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
            "Choose Grade I, II, III, or IV based on the child’s symptoms.",
            "If systemic symptoms are present, do not classify as Grade I.",
            "Any vomiting, sweating, salivation, agitation, tachycardia, hypertension, pulmonary edema, seizures, shock, or coma should be treated as systemic envenomation."
          ]
        }
      ];
    }

    if (grade === 1) {
      return [
        {
          title: "GRADE I Result — Local Envenomation Only",
          recommendations: [
            "Local pain, erythema, swelling, or paresthesia only.",
            "No vomiting, sweating, salivation, agitation, tachycardia, hypertension, respiratory distress, seizures, shock, or coma.",
            "No evidence of cardiotoxicity or systemic involvement."
          ]
        },
        {
          title: "Grade I — Initial ER Management",
          recommendations: [
            "Assess airway, breathing, circulation, vital signs, pain severity, and neurological status.",
            "Observe carefully because young children may deteriorate rapidly.",
            "No routine IV access is required if the child is well and has local symptoms only.",
            "Escalate immediately if any systemic symptom develops."
          ]
        },
        {
          title: "Grade I — Local Wound Care",
          recommendations: [
            "Clean sting site with soap and water.",
            "Apply cold compresses intermittently.",
            "Do NOT incise, suck, burn, or apply tourniquet.",
            "Reassure family and explain warning signs."
          ]
        },
        {
          title: "Grade I — Pain Control",
          recommendations: [
            "Give Paracetamol for mild pain.",
            "Ibuprofen may be used if no contraindication.",
            "For severe local pain, consider stronger analgesia with monitoring.",
            "Reassess pain before discharge."
          ]
        },
        {
          title: "Grade I — Investigations",
          recommendations: [
            "No routine laboratory testing is needed if the child remains well.",
            "No ECG is required if there are no systemic symptoms.",
            "If symptoms progress, reclassify to Grade II or above and investigate accordingly."
          ]
        },
        {
          title: "Grade I — Antiscorpion Serum / Prazosin",
          recommendations: [
            "Antiscorpion Serum is NOT indicated if symptoms are purely local.",
            "Prazosin is NOT indicated if there are no systemic autonomic symptoms.",
            "Do not give unnecessary antivenom in completely local reactions."
          ]
        },
        {
          title: "Grade I — Disposition",
          recommendations: [
            "Observe in ER for 4–6 hours.",
            "Discharge only if pain is controlled and no systemic symptoms develop.",
            "Give return precautions: vomiting, sweating, salivation, agitation, breathing difficulty, tachycardia, weakness, seizures, worsening pain, or poor general condition.",
            "Be more cautious in children younger than 5 years."
          ]
        }
      ];
    }

    if (grade === 2) {
      return [
        {
          title: "GRADE II Result — Systemic Autonomic Envenomation",
          recommendations: [
            "Systemic symptoms are present.",
            "Examples: vomiting, sweating, salivation, agitation, tachycardia, hypertension, abdominal pain, or restlessness.",
            "No pulmonary edema, shock, coma, seizures, or severe respiratory failure."
          ]
        },
        {
          title: "Grade II — Initial ER Management",
          recommendations: [
            "Assess ABCs immediately.",
            "Establish IV access.",
            "Monitor HR, BP, RR, SpO2, perfusion, mental status, and urine output.",
            "Give oxygen if respiratory distress, hypoxia, poor perfusion, or altered mental status.",
            "Escalate to Grade III/IV management if cardiotoxicity, pulmonary edema, hypotension, seizures, coma, or respiratory failure develops."
          ]
        },
        {
          title: "Grade II — Antiscorpion Serum Required",
          recommendations: [
            "Give Antiscorpion Serum immediately.",
            "Initial dose: 3–5 vials IV diluted in normal saline over 30–60 minutes.",
            "Repeat after 1–2 hours if systemic symptoms persist or worsen.",
            "Monitor for allergic reaction or anaphylaxis during infusion."
          ]
        },
        {
          title: "Grade II — Prazosin Required",
          recommendations: [
            "Start Prazosin as early as possible.",
            "Dose: 30 mcg/kg/dose orally every 6 hours.",
            "Continue until autonomic symptoms resolve and the child is hemodynamically stable.",
            "Monitor blood pressure closely, especially after the first dose."
          ]
        },
        {
          title: "Grade II — Investigations",
          recommendations: [
            "Perform ECG.",
            "Check blood glucose, electrolytes, renal function, CBC, and venous blood gas if clinically ill.",
            "Consider troponin if tachycardia is persistent, ECG is abnormal, or cardiotoxicity is suspected.",
            "Repeat investigations if clinical deterioration occurs."
          ]
        },
        {
          title: "Grade II — Fluids and Monitoring",
          recommendations: [
            "Do not give aggressive fluids routinely.",
            "Give cautious fluids only if there is clear dehydration or poor perfusion.",
            "Monitor for development of pulmonary edema.",
            "Frequent reassessment is essential."
          ]
        },
        {
          title: "Grade II — Disposition",
          recommendations: [
            "Admit for close monitoring.",
            "PICU is preferred if age <5 years, persistent vomiting, progressive symptoms, abnormal ECG, unstable vital signs, or difficult monitoring area.",
            "Escalate immediately if respiratory distress, pulmonary edema, hypotension, arrhythmia, altered mental status, or seizures develop."
          ]
        }
      ];
    }

    if (grade === 3) {
      return [
        {
          title: "GRADE III Result — Cardiotoxicity / Respiratory Involvement",
          recommendations: [
            "Severe envenomation is present.",
            "Features may include pulmonary edema, arrhythmia, hypotension, abnormal ECG, elevated troponin, LV dysfunction, or respiratory distress.",
            "This is a PICU-level emergency."
          ]
        },
        {
          title: "Grade III — Immediate ER Management",
          recommendations: [
            "Call PICU/ICU urgently.",
            "Follow ABCs and prepare for airway support.",
            "Give oxygen immediately.",
            "Use non-invasive ventilation or intubation if pulmonary edema, hypoxia, exhaustion, or severe respiratory distress.",
            "Establish IV access and continuous cardiorespiratory monitoring.",
            "Monitor ECG, BP, SpO2, perfusion, mental status, and urine output continuously."
          ]
        },
        {
          title: "Grade III — Antiscorpion Serum Required",
          recommendations: [
            "Give Antiscorpion Serum immediately.",
            "Initial dose: 3–5 vials IV diluted in normal saline over 30–60 minutes.",
            "Repeat after 1–2 hours if cardiotoxicity, pulmonary edema, or systemic symptoms persist.",
            "Additional doses may be needed according to clinical response and local antivenom protocol.",
            "Monitor for allergic reaction or anaphylaxis."
          ]
        },
        {
          title: "Grade III — Prazosin Required",
          recommendations: [
            "Start Prazosin immediately.",
            "Dose: 30 mcg/kg/dose orally every 6 hours.",
            "Prazosin is cornerstone therapy for autonomic storm and catecholamine-mediated myocardial injury.",
            "Continue until BP, perfusion, respiratory status, and systemic symptoms improve.",
            "Monitor for hypotension after dosing."
          ]
        },
        {
          title: "Grade III — Cardiotoxicity / Pulmonary Edema",
          recommendations: [
            "Pulmonary edema is usually cardiogenic.",
            "Avoid aggressive fluid boluses.",
            "Large fluid boluses may worsen pulmonary edema and respiratory failure.",
            "Consider Milrinone infusion for myocardial dysfunction or cardiogenic pulmonary edema.",
            "Use vasoactive support in PICU/ICU if hypotension persists."
          ]
        },
        {
          title: "Grade III — Investigations",
          recommendations: [
            "ECG and continuous rhythm monitoring.",
            "Troponin.",
            "Chest X-ray if respiratory symptoms or suspected pulmonary edema.",
            "Blood gas, glucose, electrolytes, renal function, CBC.",
            "Echocardiography if available to assess LV dysfunction.",
            "Repeat ECG/troponin/chest imaging based on clinical course."
          ]
        },
        {
          title: "Grade III — Disposition",
          recommendations: [
            "Immediate PICU admission.",
            "Do not discharge from ER.",
            "Continue ACS, Prazosin, respiratory support, cardiac monitoring, and hemodynamic support.",
            "Escalate to Grade IV management if shock, coma, seizures, or respiratory failure develops."
          ]
        }
      ];
    }

    if (grade === 4) {
      return [
        {
          title: "GRADE IV Result — Life-Threatening Systemic Failure",
          recommendations: [
            "Life-threatening envenomation is present.",
            "Features may include shock, coma, seizures, severe respiratory failure, severe pulmonary edema, or multiorgan dysfunction.",
            "This is an immediate resuscitation and PICU emergency."
          ]
        },
        {
          title: "Grade IV — Immediate Resuscitation",
          recommendations: [
            "Call PICU/ICU and senior support immediately.",
            "Follow ABCs with full resuscitation readiness.",
            "Secure airway if coma, recurrent seizures, severe pulmonary edema, respiratory failure, or inability to protect airway.",
            "Give high-flow oxygen while preparing definitive airway if needed.",
            "Establish IV/IO access.",
            "Continuous ECG, BP, SpO2, perfusion, neurological status, and urine output monitoring."
          ]
        },
        {
          title: "Grade IV — Antiscorpion Serum Required",
          recommendations: [
            "Give Antiscorpion Serum immediately.",
            "Initial dose: 3–5 vials IV diluted in normal saline over 30–60 minutes.",
            "Repeat after 1–2 hours if shock, coma, seizures, pulmonary edema, or severe systemic symptoms persist.",
            "Severe cases may require additional doses according to clinical response and local protocol.",
            "Prepare for allergic reaction/anaphylaxis management during infusion."
          ]
        },
        {
          title: "Grade IV — Prazosin Required",
          recommendations: [
            "Give Prazosin early if oral or NG route is possible.",
            "Dose: 30 mcg/kg/dose orally/NG every 6 hours.",
            "Targets autonomic storm and catecholamine-mediated myocardial injury.",
            "Continue until hemodynamic and systemic symptoms improve.",
            "Monitor blood pressure closely."
          ]
        },
        {
          title: "Grade IV — Airway / Breathing",
          recommendations: [
            "Intubate if severe respiratory failure, coma, recurrent seizures, severe pulmonary edema, or inability to protect airway.",
            "Use ventilatory support for pulmonary edema or hypoxia.",
            "Avoid excessive sedation unless airway is protected.",
            "Check blood gas after stabilization."
          ]
        },
        {
          title: "Grade IV — Shock / Circulation",
          recommendations: [
            "Assess shock type: cardiogenic, distributive, or hypovolemic.",
            "Avoid repeated blind fluid boluses.",
            "Give cautious fluid only if clear hypovolemia is present.",
            "Use vasoactive support in PICU/ICU if shock persists.",
            "Consider Milrinone if myocardial dysfunction or cardiogenic pulmonary edema is present."
          ]
        },
        {
          title: "Grade IV — Seizure / Neurological Management",
          recommendations: [
            "Treat seizures promptly with Midazolam or Diazepam.",
            "Check glucose immediately.",
            "Protect airway in recurrent seizures or coma.",
            "Manage as critical illness with PICU-level monitoring."
          ]
        },
        {
          title: "Grade IV — Investigations",
          recommendations: [
            "ECG and continuous rhythm monitoring.",
            "Troponin.",
            "Chest X-ray.",
            "Blood gas, glucose, electrolytes, renal function, CBC.",
            "Echocardiography if available.",
            "Repeat tests according to clinical deterioration or response."
          ]
        },
        {
          title: "Grade IV — Disposition",
          recommendations: [
            "Immediate PICU admission.",
            "Do not discharge from ER.",
            "Continue resuscitation, ACS, Prazosin, airway support, seizure control, and hemodynamic support.",
            "Frequent reassessment is mandatory."
          ]
        }
      ];
    }

    return [
      {
        title: "Invalid Grade",
        recommendations: [
          "Please select a valid clinical grade.",
          "If uncertain, manage according to the highest suspected grade."
        ]
      }
    ];
  },

  getDisposition: (severity, data) => {
    const grade = Number(data.grade);

    if (grade === 1) {
      return [
        "Grade I: Observe in ER for 4–6 hours.",
        "Discharge only if pain is controlled and no systemic symptoms develop.",
        "No ACS or Prazosin if symptoms remain purely local.",
        "Give strict return precautions."
      ];
    }

    if (grade === 2) {
      return [
        "Grade II: Admit for close monitoring.",
        "Give ACS and Prazosin.",
        "PICU preferred if age <5 years, progressive symptoms, persistent vomiting, unstable vitals, or abnormal ECG.",
        "Escalate if cardiotoxicity, pulmonary edema, hypotension, altered mental status, or seizures develop."
      ];
    }

    if (grade === 3) {
      return [
        "Grade III: Immediate PICU admission.",
        "Give ACS and Prazosin.",
        "Continuous cardiac and respiratory monitoring.",
        "Treat pulmonary edema/cardiotoxicity and avoid aggressive fluids."
      ];
    }

    if (grade === 4) {
      return [
        "Grade IV: Immediate resuscitation and PICU admission.",
        "Give ACS immediately and start Prazosin if oral/NG route possible.",
        "Secure airway and treat shock/seizures as needed.",
        "Continuous critical care monitoring."
      ];
    }

    return [
      "Select grade first.",
      "If any systemic symptom is present, treat as Grade II or above."
    ];
  },

  getRedFlags: () => [
    "Age <5 years",
    "Persistent vomiting",
    "Excessive salivation or sweating",
    "Agitation, irritability, or altered mental status",
    "Tachycardia or hypertension",
    "Hypotension or poor perfusion",
    "Arrhythmia",
    "Pulmonary edema or respiratory distress",
    "LV dysfunction on echocardiography",
    "Seizures or coma",
    "Elevated troponin",
    "Rapid clinical deterioration"
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
          notes: "Grade I: analgesia only. Grade II–IV: ACS + Prazosin."
        }
      ];
    }

    if (grade === 1) {
      doses.push({
        drugName: "Analgesia",
        dose: "Paracetamol ± Ibuprofen if no contraindication.",
        notes: "For local pain control. ACS and Prazosin are not indicated for purely local symptoms."
      });

      return doses;
    }

    if (grade >= 2) {
      doses.push({
        drugName: "Antiscorpion Serum — ACS",
        dose: "Initial dose: 3–5 vials IV diluted in normal saline over 30–60 minutes.",
        notes:
          "Indicated for Grade II, III, or IV. Repeat after 1–2 hours if systemic symptoms persist or worsen. Monitor for allergic reaction/anaphylaxis."
      });

      if (weight > 0) {
        doses.push({
          drugName: "Prazosin",
          dose: `30 mcg/kg/dose = ${(30 * weight).toFixed(0)} mcg orally/NG every 6 hours`,
          notes:
            "Start early for Grade II or above. Continue until hemodynamically stable and autonomic symptoms resolve. Monitor BP."
        });
      } else {
        doses.push({
          drugName: "Prazosin",
          dose: "30 mcg/kg/dose orally/NG every 6 hours",
          notes:
            "Start early for Grade II or above. Continue until hemodynamically stable and autonomic symptoms resolve. Monitor BP."
        });
      }
    }

    if (grade >= 3) {
      doses.push({
        drugName: "Milrinone Infusion",
        dose: "0.25–0.5 mcg/kg/min IV infusion",
        notes:
          "For myocardial dysfunction, cardiogenic pulmonary edema, or severe cardiotoxicity. Use with PICU/ICU monitoring."
      });
    }

    if (grade === 4) {
      if (weight > 0) {
        doses.push({
          drugName: "Midazolam",
          dose: `0.1–0.2 mg/kg/dose = ${(0.1 * weight).toFixed(2)}–${(0.2 * weight).toFixed(2)} mg IV/IM/IN`,
          notes: "For seizures. Support airway and breathing."
        });

        doses.push({
          drugName: "Atropine",
          dose: `0.02 mg/kg/dose = ${(0.02 * weight).toFixed(2)} mg IV`,
          notes:
            "Avoid routine use. Use only for severe symptomatic bradycardia or life-threatening secretions."
        });
      } else {
        doses.push({
          drugName: "Midazolam",
          dose: "0.1–0.2 mg/kg IV/IM/IN",
          notes: "For seizures."
        });

        doses.push({
          drugName: "Atropine",
          dose: "0.02 mg/kg/dose IV",
          notes:
            "Avoid routine use. Use only for severe symptomatic bradycardia or life-threatening secretions."
        });
      }
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
