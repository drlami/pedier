import type { DiseaseProtocol, FormData, Severity } from './types';

export const fever3To36MonthsProtocol: DiseaseProtocol = {
  id: 'fever-3-36-months',
  name: 'Fever Without Source (3-36 months)',
  system: 'Fever & Infectious Diseases',
  description: 'Evaluation of fever without a source in children 3 to 36 months. Incorporates AAP 2021 UTI Clinical Practice Guideline recommendations for urine collection indications, collection method, and culture requirements.',
  image: {
    url: "https://picsum.photos/seed/fever-3-36-months/600/400",
    hint: "toddler temperature"
  },
  questions: [
    {
      id: 'isToxic',
      questionText: 'Is the child toxic-appearing?',
      type: 'boolean',
      info: 'Lethargy, poor perfusion, marked hypo/hyperventilation, cyanosis, or inconsolable — a medical emergency.'
    },
    {
      id: 'temperature',
      questionText: 'Peak temperature in last 24h',
      type: 'number',
      unit: '°C'
    },
    {
      id: 'ageMonths',
      questionText: 'Age in months',
      type: 'number'
    },
    {
      id: 'sex',
      questionText: 'Sex',
      type: 'select',
      options: [
        { label: 'Female', value: 'female' },
        { label: 'Male', value: 'male' }
      ]
    },
    {
      id: 'isMaleCircumcised',
      questionText: 'If male — is the child circumcised?',
      type: 'boolean',
      info: 'Circumcision significantly reduces UTI risk in males. Leave blank / not applicable for females.'
    },
    {
      id: 'immunizationStatus',
      questionText: 'Immunization status for Hib and PCV13?',
      type: 'select',
      options: [
        { label: 'Complete / Up-to-date', value: 'complete' },
        { label: 'Incomplete / Unknown', value: 'incomplete' }
      ]
    },
    {
      id: 'hasFocalInfection',
      questionText: 'Evidence of a focal bacterial infection on exam (e.g. cellulitis, OM, septic arthritis)?',
      type: 'boolean'
    },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];

    if (data.isToxic) {
      details.push("Child is toxic-appearing — medical emergency.");
      return { level: 'severe', details };
    }

    if (data.hasFocalInfection) {
      details.push("Focal infection identified — manage the specific source.");
      return { level: 'moderate', details };
    }

    const temp = Number(data.temperature);
    const tempHigh = temp >= 39.0;
    const tempAny  = temp >= 38.0;
    const ageMonths = Number(data.ageMonths);
    const isFemale = data.sex === 'female';
    const isUncircumcisedMale = data.sex === 'male' && data.isMaleCircumcised === false;
    const isCircumcisedMale = data.sex === 'male' && data.isMaleCircumcised === true;
    const isUnimmunized = data.immunizationStatus === 'incomplete';

    // High risk for occult bacteremia — unimmunized with high fever
    if (isUnimmunized && tempHigh) {
      details.push("High risk for occult bacteremia (unimmunized + temperature ≥39°C).");
    }

    // UTI risk — per AAP 2021 UTI CPG
    if (isFemale && ageMonths <= 24 && tempAny) {
      details.push("UTI risk: Female ≤24 months with fever without source — urine evaluation indicated (AAP 2021).");
    } else if (isFemale && ageMonths > 24 && tempHigh) {
      details.push("UTI risk: Female 24–36 months with fever ≥39°C — consider urine evaluation.");
    }

    if (isUncircumcisedMale && ageMonths <= 24 && tempAny) {
      details.push("UTI risk: Uncircumcised male ≤24 months with fever without source — urine evaluation indicated (AAP 2021).");
    }

    if (isCircumcisedMale && ageMonths <= 12 && tempHigh) {
      details.push("UTI risk: Circumcised male ≤12 months with fever ≥39°C — consider urine evaluation (lower prevalence ~0.3–0.5%).");
    }

    if (details.length > 0) {
      return { level: 'moderate', details };
    }

    details.push("Well-appearing, immunized child with fever. Low risk for serious bacterial infection.");
    return { level: 'mild', details };
  },

  getManagement: (severity, data) => {
    const ageMonths = Number(data.ageMonths);
    const isFemale = data.sex === 'female';
    const isUncircumcisedMale = data.sex === 'male' && data.isMaleCircumcised === false;
    const isCircumcisedMale = data.sex === 'male' && data.isMaleCircumcised === true;
    const needsUrineWork = severity.details.some(d => d.includes('UTI risk'));

    switch (severity.level) {

      // ── TOXIC ────────────────────────────────────────────────────────────────
      case 'severe':
        return [
          {
            title: "🚨 Toxic-Appearing Child — Immediate Action",
            recommendations: [
              "Medical emergency. Initiate resuscitation — secure airway, IV/IO access, fluid bolus 20 ml/kg NS.",
              "Obtain: blood culture × 2, CBC, CRP/ESR, metabolic panel.",
              "Urine collection — catheterisation or suprapubic aspiration (SPA) for urinalysis AND culture simultaneously. Do NOT use a bag specimen.",
              "Lumbar puncture if stable and meningitis is suspected.",
              "Administer parenteral broad-spectrum antibiotics immediately after cultures (e.g. Ceftriaxone 50 mg/kg IV/IM + Vancomycin if CNS involvement).",
              "Admit to hospital for intensive monitoring."
            ]
          },
          {
            title: "📋 Urine Collection in the Toxic Child — AAP Guidance",
            recommendations: [
              "Method: Catheterisation or SPA only — a bag specimen is unacceptable for culture (contamination rate up to 63–88%).",
              "Catheterised specimen: ≥50,000 CFU/mL of a single uropathogen confirms UTI.",
              "SPA specimen: any growth of a uropathogen confirms UTI.",
              "Initiate empiric antibiotics covering UTI immediately; adjust once culture and sensitivity results are available."
            ]
          }
        ];

      // ── MODERATE ─────────────────────────────────────────────────────────────
      case 'moderate': {
        const blocks = [];

        // Occult bacteremia block
        if (severity.details.some(d => d.includes('occult bacteremia'))) {
          blocks.push({
            title: "🔬 Occult Bacteremia Work-up",
            recommendations: [
              "Obtain blood culture and inflammatory markers (CBC, CRP).",
              "Consider a single empiric dose of parenteral Ceftriaxone 50 mg/kg (max 1 g) IM/IV pending culture results.",
              "Ensure reliable follow-up within 24 hours; return immediately if worsening.",
              "For up-to-date and fully-immunized children (PCV13 + Hib): risk of occult bacteremia is very low (<1%) — blood culture and empiric antibiotics may not be necessary if the child appears well."
            ]
          });
        }

        // Focal infection block
        if (severity.details.some(d => d.includes('Focal infection'))) {
          blocks.push({
            title: "🎯 Focal Infection Identified",
            recommendations: [
              "Treat the identified source according to specific guidelines (e.g. amoxicillin 80–90 mg/kg/day divided BID for otitis media).",
              "Still consider urine evaluation if the patient also meets UTI risk criteria by age and sex (urine findings may co-exist)."
            ]
          });
        }

        // Urine evaluation — core AAP 2021 block
        if (needsUrineWork) {
          blocks.push({
            title: "🧪 Urine Evaluation — When to Collect (AAP 2021 CPG)",
            recommendations: [
              "Indications (collect urine in ALL of the following):",
              "  • Female ≤24 months: fever ≥38°C without an identifiable source → urine evaluation recommended.",
              "  • Uncircumcised male ≤24 months: fever ≥38°C without source → urine evaluation recommended.",
              "  • Circumcised male ≤12 months with fever ≥39°C: prevalence of UTI is low (~0.3–0.5%); use clinical judgement — shared decision-making with caregivers is appropriate.",
              "  • Female or uncircumcised male 24–36 months: consider if fever ≥39°C persists >48 hours, prior UTI history, known urinary tract anomaly, or no other source identified."
            ]
          });

          blocks.push({
            title: "💉 Urine Collection Method (AAP 2021 — Strong Recommendation)",
            recommendations: [
              "FOR CULTURE: Only catheterisation or suprapubic aspiration (SPA) are acceptable.",
              "  — Bag specimens have an unacceptably high false-positive rate (contamination in up to 63–88% of positive cultures) and must NEVER be sent for culture.",
              "",
              "APPROACH A — One-step (preferred when high clinical suspicion or child is ill-appearing):",
              "  • Catheterise and collect a single specimen for both urinalysis (UA) AND culture simultaneously.",
              "  • Avoids delay; immediately provides culture and sensitivity data.",
              "",
              "APPROACH B — Two-step (acceptable for well-appearing children with low-to-intermediate suspicion):",
              "  • Step 1: Obtain a bag specimen for UA/dipstick screening only.",
              "    ◦ If bag UA is NEGATIVE (LE−, nitrites−, no pyuria): UTI very unlikely — no culture required.",
              "    ◦ If bag UA is POSITIVE (LE+, nitrites+, or pyuria): Do NOT send bag specimen for culture.",
              "  • Step 2 (if bag UA positive): Immediately collect a catheterised specimen for confirmatory UA AND urine culture before starting antibiotics.",
              "",
              "Catheterisation technique: Use appropriate catheter size (8 Fr for most infants/toddlers), sterile technique; collect mid-stream flow (discard first few drops).",
              "SPA: Preferred in neonates and young infants when catheterisation is not possible; use ultrasound guidance when available."
            ]
          });

          blocks.push({
            title: "🔍 Urinalysis Interpretation & Culture Criteria",
            recommendations: [
              "Positive UA (suggests UTI — any one criterion):",
              "  • Leukocyte esterase (LE) ≥1+ on dipstick",
              "  • Nitrites positive on dipstick (high specificity, lower sensitivity in infants)",
              "  • Pyuria: ≥5 WBC/high-power field on microscopy",
              "  • Bacteria on Gram stain (unspun specimen)",
              "",
              "Culture confirmation of UTI (from properly collected catheter or SPA specimen):",
              "  • Catheterised specimen: ≥50,000 CFU/mL of a single uropathogen",
              "  • SPA specimen: any growth of a uropathogen",
              "  • Clean-catch midstream void (older cooperative children): ≥100,000 CFU/mL",
              "  • Bag specimen counts do NOT count toward UTI diagnosis regardless of CFU/mL.",
              "",
              "If UA is positive: initiate empiric antibiotic treatment and await culture results to adjust therapy.",
              "If UA is negative: withhold antibiotics; UTI is very unlikely (negative predictive value ~99%)."
            ]
          });

          blocks.push({
            title: "💊 Antibiotic Management for Confirmed/Presumptive UTI",
            recommendations: [
              "Oral therapy is preferred for well-appearing children who can tolerate oral intake.",
              "  • Trimethoprim-sulfamethoxazole (TMP-SMX): 8–10 mg/kg/day TMP component divided BID — check local resistance patterns.",
              "  • Amoxicillin-clavulanate: 25–45 mg/kg/day (amoxicillin component) divided BID.",
              "  • Nitrofurantoin: NOT recommended for febrile UTI / presumed pyelonephritis (does not achieve adequate renal tissue levels).",
              "  • Cephalexin: 25–50 mg/kg/day divided TID–QID.",
              "Duration: 7–10 days for febrile UTI (presumed pyelonephritis).",
              "",
              "If unable to tolerate oral antibiotics or appears ill:",
              "  • Ceftriaxone 50 mg/kg IV/IM once daily (max 1 g) — transition to oral once tolerating.",
              "",
              "Adjust antibiotic choice based on urine culture and sensitivity results.",
              "Follow-up: All children with confirmed UTI require follow-up within 48–72 hours to confirm clinical improvement."
            ]
          });
        }

        return blocks;
      }

      // ── MILD ─────────────────────────────────────────────────────────────────
      case 'mild': {
        const blocks = [
          {
            title: "✅ Low-Risk Febrile Child",
            recommendations: [
              "No routine blood cultures or empiric antibiotics required in a well-appearing, fully immunized child.",
              "Antipyretics for comfort: Acetaminophen 15 mg/kg/dose every 4–6h, or Ibuprofen 10 mg/kg/dose every 6–8h (if >6 months).",
              "Educate caregivers about signs of worsening and return precautions.",
              "Reassess in 24–48 hours or sooner if fever persists beyond 48–72 hours without a source."
            ]
          }
        ];

        // Still check urine eligibility even in mild severity
        const mildUrineIndicated =
          (isFemale && ageMonths <= 24) ||
          (isUncircumcisedMale && ageMonths <= 24) ||
          (isCircumcisedMale && ageMonths <= 12);

        if (mildUrineIndicated) {
          blocks.push({
            title: "🧪 Urine Evaluation — Still Indicated (AAP 2021)",
            recommendations: [
              "Even in a well-appearing child, urine testing is recommended based on age and sex:",
              isFemale && ageMonths <= 24
                ? "  • This female ≤24 months meets AAP criteria: collect urine regardless of apparent illness severity."
                : "",
              isUncircumcisedMale && ageMonths <= 24
                ? "  • This uncircumcised male ≤24 months meets AAP criteria: collect urine."
                : "",
              isCircumcisedMale && ageMonths <= 12
                ? "  • Circumcised male ≤12 months: UTI prevalence is low (~0.3–0.5%) — discuss with caregivers; collection is reasonable if fever ≥39°C."
                : "",
              "",
              "Collection method (AAP 2021 — Strong Recommendation):",
              "  • Catheterisation or SPA for any specimen intended for culture.",
              "  • If using two-step approach: bag urine for UA screening ONLY.",
              "    — If bag UA negative: no culture required.",
              "    — If bag UA positive: catheterise immediately for confirmatory culture.",
              "  • NEVER send a bag specimen for urine culture."
            ].filter(s => s !== "")
          });
        }

        return blocks;
      }

      default:
        return [];
    }
  },

  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
      return [
        "Immediate hospital admission — paediatric emergency.",
        "Admit to PICU if haemodynamically unstable or signs of septic shock."
      ];
    }
    if (severity.level === 'moderate') {
      return [
        "Most non-toxic children with risk factors can be managed as outpatients with close follow-up.",
        "Admit if: poor oral intake, unable to tolerate oral antibiotics, unreliable follow-up, caregiver unable to monitor for deterioration, or clinical uncertainty.",
        "24-hour telephone or in-person follow-up is mandatory for children started on empiric treatment."
      ];
    }
    return [
      "Discharge home with return precautions.",
      "Return immediately if: fever >5 days, appears more unwell, rash develops, or urine culture grows an organism.",
      "Follow-up within 48–72 hours if fever persists or concerns arise."
    ];
  },

  getRedFlags: () => [
    "Toxic appearance (lethargy, poor perfusion, cyanosis)",
    "Non-blanching rash — petechiae or purpura (suspect meningococcaemia)",
    "Signs of meningitis: nuchal rigidity, bulging fontanelle, photophobia",
    "Inconsolable crying or extreme irritability",
    "Temperature ≥40°C in an unimmunized child",
    "New-onset seizure with fever",
    "Focal signs of severe infection (suspected septic arthritis, osteomyelitis)",
    "Positive bag UA without confirmatory catheter specimen sent — do not treat without proper culture"
  ],

  getDrugDoses: () => [
    {
      drugName: "Ceftriaxone (IV/IM)",
      dose: "50 mg/kg as a single dose (max 1 g)",
      notes: "Empiric treatment for suspected occult bacteremia or febrile UTI (pyelonephritis) when oral therapy not possible."
    },
    {
      drugName: "TMP-SMX (oral)",
      dose: "8–10 mg/kg/day of TMP component, divided BID",
      notes: "First-line oral option for UTI — verify local E. coli resistance <20% before use."
    },
    {
      drugName: "Amoxicillin-Clavulanate (oral)",
      dose: "25–45 mg/kg/day (amoxicillin component) divided BID",
      notes: "Oral UTI treatment — useful when TMP-SMX resistance is high."
    },
    {
      drugName: "Cephalexin (oral)",
      dose: "25–50 mg/kg/day divided TID–QID",
      notes: "Alternative oral option for UTI."
    },
    {
      drugName: "Amoxicillin (oral)",
      dose: "80–90 mg/kg/day divided BID",
      notes: "For confirmed otitis media. NOT first-line for UTI (high resistance)."
    },
    {
      drugName: "Acetaminophen",
      dose: "15 mg/kg/dose every 4–6 hours (max 5 doses/24h)",
      notes: "Antipyretic — safe from birth."
    },
    {
      drugName: "Ibuprofen (≥6 months only)",
      dose: "10 mg/kg/dose every 6–8 hours",
      notes: "Antipyretic / analgesic — avoid if dehydrated or renal concerns."
    }
  ],

  getReferences: () => [
    {
      title: "AAP Clinical Practice Guideline: Diagnosis and Management of the Initial UTI in Febrile Infants and Children 2–24 Months (2021) — Pediatrics 147(2):e2020052228",
      url: "https://publications.aap.org/pediatrics/article/147/2/e2020052228/33408/Urinary-Tract-Infection-Clinical-Practice-Guideline"
    },
    {
      title: "AAP Reaffirmation of UTI Guideline 2–24 Months (2016) — Pediatrics 138(6):e20163026",
      url: "https://publications.aap.org/pediatrics/article/138/6/e20163026/52784"
    },
    {
      title: "AAP Subcommittee: Fever Without a Source in Children 3–36 Months — Original Guideline",
      url: "https://publications.aap.org/pediatrics/article/92/1/134/60366"
    },
    {
      title: "UpToDate: Fever without a source in children 3–36 months — Evaluation and Management",
      url: "https://www.uptodate.com/contents/fever-without-a-source-in-children-3-to-36-months-of-age-evaluation-and-management"
    }
  ],
};
