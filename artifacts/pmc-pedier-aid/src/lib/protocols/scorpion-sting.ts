import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const scorpionStingProtocol: DiseaseProtocol = {
  id: 'scorpion-sting',
  name: 'Scorpion Sting Management',
  system: 'Toxins and Poisoning',
  description:
    'Emergency management of pediatric scorpion stings, especially clinically significant Middle East/North Africa species such as Leiurus quinquestriatus.',
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
            "Grade I: Local envenomation only.",
            "No systemic symptoms.",
            "Main treatment is local care, analgesia, and observation."
          ]
        };

      case 2:
        return {
          level: 'moderate',
          details: [
            "Grade II: Systemic autonomic envenomation.",
            "Features may include vomiting, sweating, salivation, agitation, tachycardia, or hypertension.",
            "Requires early Antiscorpion Serum and Prazosin."
          ]
        };

      case 3:
        return {
          level: 'severe',
          details: [
            "Grade III: Severe envenomation with cardiotoxicity or respiratory involvement.",
            "Pulmonary edema, arrhythmia, hypotension, or LV dysfunction may occur.",
            "Requires PICU-level care, Antiscorpion Serum, Prazosin, and cardiorespiratory support."
          ]
        };

      case 4:
        return {
          level: 'severe',
          details: [
            "Grade IV: Life-threatening systemic failure.",
            "Shock, coma, seizures, or severe respiratory failure may occur.",
            "Immediate resuscitation, PICU admission, Antiscorpion Serum, and advanced support are required."
          ]
        };

      default:
        return {
          level: 'unknown',
          details: [
            "Assess clinical grade based on local signs, systemic autonomic signs, cardiotoxicity, respiratory status, and neurological status."
          ]
        };
    }
  },

  getManagement: (severity, data) => {
    const management = [
      {
        title: "Initial ER Management — First 10 Minutes",
        recommendations: [
          "Follow ABC approach: airway, breathing, circulation.",
          "Give oxygen if respiratory distress, hypoxia, pulmonary edema, altered mental status, or shock.",
          "Establish IV access.",
          "Monitor heart rate, blood pressure, respiratory rate, oxygen saturation, perfusion, mental status, and urine output.",
          "Intubate if respiratory failure, severe pulmonary edema, coma, uncontrolled seizures, or inability to protect airway."
        ]
      },
      {
        title: "Local Wound Care",
        recommendations: [
          "Clean sting site with soap and water.",
          "Apply cold compresses intermittently.",
          "Do NOT incise, suck, burn, or apply tourniquet.",
          "Reassess frequently because young children may deteriorate rapidly."
        ]
      },
      {
        title: "Pain Management",
        recommendations: [
          "Paracetamol for mild pain.",
          "Ibuprofen may be used if no contraindication.",
          "For severe pain, consider IV opioid analgesia with close monitoring.",
          "Avoid excessive sedation in unstable patients."
        ]
      },
      {
        title: "Recommended Investigations",
        recommendations: [
          "Grade I only: usually no routine laboratory testing needed if child remains well.",
          "Grade II or above: ECG, blood glucose, electrolytes, renal function, CBC, and venous/arterial blood gas if ill.",
          "If cardiotoxicity suspected: troponin, chest X-ray, and echocardiography if available.",
          "Repeat ECG/troponin or imaging if clinical deterioration occurs."
        ]
      },
      {
        title: "Antiscorpion Serum — ACS",
        recommendations: [
          "Give ACS immediately if ANY systemic symptoms are present: Grade II, III, or IV.",
          "Systemic symptoms include vomiting, sweating, hypersalivation, agitation, tachycardia, hypertension, arrhythmia, pulmonary edema, seizures, shock, or coma.",
          "Initial dose: 3–5 vials IV diluted in normal saline and infused over 30–60 minutes.",
          "Repeat after 1–2 hours if systemic symptoms persist or worsen.",
          "Severe cardiotoxicity, pulmonary edema, shock, or neurological involvement may require additional doses according to local antivenom protocol.",
          "Observe for allergic reaction or anaphylaxis during infusion."
        ]
      },
      {
        title: "Prazosin Therapy — Cornerstone Treatment",
        recommendations: [
          "Start early in Grade II, III, or IV envenomation.",
          "Dose: 30 mcg/kg/dose orally every 6 hours.",
          "Continue until the child is hemodynamically stable and autonomic symptoms resolve.",
          "Prazosin helps reverse catecholamine-mediated myocardial injury and pulmonary edema.",
          "Monitor blood pressure closely, especially after the first dose."
        ]
      }
    ];

    if (severity.level === 'moderate' || severity.level === 'severe') {
      management.push({
        title: "Cardiotoxicity and Pulmonary Edema Management",
        recommendations: [
          "Pulmonary edema in severe scorpion envenomation is usually cardiogenic.",
          "Avoid aggressive fluid boluses unless clear hypovolemic shock is present.",
          "Large fluid boluses may worsen pulmonary edema and respiratory failure.",
          "Provide oxygen, non-invasive ventilation, or intubation according to severity.",
          "If myocardial dysfunction or pulmonary edema is present, consider Milrinone infusion.",
          "Urgent PICU consultation is required."
        ]
      });

      management.push({
        title: "Shock Management",
        recommendations: [
          "Assess whether shock is cardiogenic, distributive, or hypovolemic.",
          "Avoid repeated blind fluid boluses in pulmonary edema or suspected myocardial dysfunction.",
          "Use cautious fluid bolus only if signs of hypovolemia are clear.",
          "Consider vasoactive support in PICU/ICU setting if hypotension persists.",
          "Repeat clinical assessment after every intervention."
        ]
      });

      management.push({
        title: "Seizure and Neurological Management",
        recommendations: [
          "Treat seizures promptly with Midazolam or Diazepam.",
          "Check glucose immediately in any seizure or altered mental status.",
          "Protect airway if recurrent seizures, coma, or respiratory compromise.",
          "Severe neurological symptoms are Grade IV and require PICU admission."
        ]
      });

      management.push({
        title: "Secretions and Atropine Warning",
        recommendations: [
          "Avoid routine Atropine use.",
          "Atropine may worsen tachycardia and increase myocardial oxygen demand.",
          "Use Atropine only for severe symptomatic bradycardia or life-threatening secretions.",
          "If secretions are associated with respiratory failure, prioritize airway support."
        ]
      });
    }

    return management;
  },

  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
      return [
        "Immediate PICU admission.",
        "Continuous cardiorespiratory monitoring.",
        "Give ACS and Prazosin early.",
        "Manage pulmonary edema, shock, seizures, or respiratory failure aggressively.",
        "Repeat ECG, troponin, chest X-ray, and echocardiography as clinically indicated."
      ];
    }

    if (severity.level === 'moderate') {
      return [
        "Admit for close monitoring; PICU is preferred in young children or if symptoms are progressing.",
        "Give ACS and Prazosin.",
        "Monitor vital signs, perfusion, respiratory status, and urine output.",
        "Perform ECG and basic labs.",
        "Escalate to PICU if pulmonary edema, hypotension, arrhythmia, altered mental status, seizures, or persistent vomiting develops."
      ];
    }

    if (severity.level === 'mild') {
      return [
        "Observe in ER for 4–6 hours.",
        "Provide local wound care and analgesia.",
        "Discharge only if pain is controlled and no systemic symptoms develop.",
        "Give clear return precautions: vomiting, salivation, sweating, agitation, breathing difficulty, persistent tachycardia, weakness, seizures, or worsening pain.",
        "Young children, especially age <5 years, need more cautious observation."
      ];
    }

    return [
      "Severity is not selected.",
      "Assess clinical grade before deciding disposition.",
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
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    doses.push({
      drugName: "Antiscorpion Serum — ACS",
      dose: "Initial dose: 3–5 vials IV diluted in normal saline over 30–60 minutes.",
      notes:
        "Indicated for Grade II, III, or IV. Repeat after 1–2 hours if systemic symptoms persist or worsen. Monitor for allergic reaction/anaphylaxis."
    });

    if (weight > 0) {
      doses.push({
        drugName: "Prazosin",
        dose: `30 mcg/kg/dose = ${(30 * weight).toFixed(0)} mcg orally every 6 hours`,
        notes:
          "Start early for Grade II or above. Continue until hemodynamically stable and autonomic symptoms resolve. Monitor BP after first dose."
      });

      doses.push({
        drugName: "Atropine",
        dose: `0.02 mg/kg/dose = ${(0.02 * weight).toFixed(2)} mg IV`,
        notes:
          "Avoid routine use. Use only for severe symptomatic bradycardia or life-threatening secretions. May worsen tachycardia."
      });

      doses.push({
        drugName: "Midazolam",
        dose: `0.1–0.2 mg/kg/dose = ${(0.1 * weight).toFixed(2)}–${(0.2 * weight).toFixed(2)} mg IV/IM/IN`,
        notes: "For seizures. Support airway and breathing."
      });
    } else {
      doses.push({
        drugName: "Prazosin",
        dose: "30 mcg/kg/dose orally every 6 hours",
        notes: "Start early for Grade II or above. Monitor blood pressure."
      });

      doses.push({
        drugName: "Atropine",
        dose: "0.02 mg/kg/dose IV",
        notes: "Use only for severe symptomatic bradycardia or life-threatening secretions."
      });

      doses.push({
        drugName: "Midazolam",
        dose: "0.1–0.2 mg/kg IV/IM/IN",
        notes: "For seizures."
      });
    }

    doses.push({
      drugName: "Milrinone Infusion",
      dose: "0.25–0.5 mcg/kg/min IV infusion",
      notes:
        "For myocardial dysfunction, cardiogenic pulmonary edema, or severe cardiotoxicity. Use with PICU/ICU monitoring."
    });

    doses.push({
      drugName: "Analgesia",
      dose: "Paracetamol ± Ibuprofen if no contraindication. Consider IV opioid for severe pain.",
      notes: "Pain control is essential, especially in Grade I local envenomation."
    });

    return doses;
  },

  getReferences: () => [
    {
      title: "Pediatric Scorpion Sting Management Protocol — ER Clinical Tool",
      url: ""
    }
  ],
};
