import type { DiseaseProtocol, FormData, Severity } from './types';

export const fever3To36MonthsProtocol: DiseaseProtocol = {
  id: 'Fever Without Source (3–36 months)',
  name: 'Fever Without Source (3–36 months)',
  system: 'Infectious Diseases',
  description:
    'Decision-support calculator for fever without a source in children 3 to 36 months, focusing on serious bacterial infection, UTI, bacteremia, admission, discharge, and antibiotic decisions.',
  image: {
    url: 'https://picsum.photos/seed/fever-3-36-months/600/400',
    hint: 'toddler temperature',
  },

  questions: [
    {
      id: 'ageMonths',
      questionText: 'Age in months',
      type: 'number',
      info: 'This protocol applies only to children aged 3 to 36 months.',
    },
    {
      id: 'temperature',
      questionText: 'Peak temperature in last 24 hours',
      type: 'number',
      unit: '°C',
    },
    {
      id: 'feverDurationHours',
      questionText: 'Duration of fever',
      type: 'number',
      unit: 'hours',
    },
    {
      id: 'isWellAppearing',
      questionText: 'Is the child well-appearing?',
      type: 'boolean',
      info: 'A well-appearing child is alert, interactive, perfused, and not clinically toxic.',
    },
    {
      id: 'hasAnyRedFlag',
      questionText: 'Are ANY red flags present?',
      type: 'boolean',
      info:
        'Red flags include lethargy/decreased consciousness, toxic appearance, poor perfusion/delayed capillary refill, respiratory distress, persistent irritability/inconsolable crying, petechiae/purpura, neck stiffness/bulging fontanelle, dehydration, or immunocompromised state.',
    },
    {
      id: 'sex',
      questionText: 'Sex / circumcision status',
      type: 'select',
      options: [
        { label: 'Female', value: 'female' },
        { label: 'Male circumcised', value: 'male_circumcised' },
        { label: 'Male uncircumcised', value: 'male_uncircumcised' },
      ],
    },
    {
      id: 'immunizationStatus',
      questionText: 'Immunization status for Hib and pneumococcal vaccines?',
      type: 'select',
      options: [
        { label: 'Complete / up-to-date', value: 'complete' },
        { label: 'Incomplete / unknown', value: 'incomplete' },
      ],
    },
    {
      id: 'previousUTI',
      questionText: 'Previous history of UTI?',
      type: 'boolean',
    },
    {
      id: 'hasClearSource',
      questionText: 'Is there a clear source of fever on history or exam?',
      type: 'boolean',
      info: 'Examples: otitis media, pneumonia, cellulitis, septic arthritis, clear viral syndrome, etc.',
    },
    {
      id: 'urinarySymptoms',
      questionText: 'Any urinary symptoms?',
      type: 'boolean',
      info: 'Dysuria, frequency, foul-smelling urine, abdominal pain, flank pain, or unexplained crying with urination.',
    },
    {
      id: 'poorIntakeOrDehydration',
      questionText: 'Poor oral intake or dehydration?',
      type: 'boolean',
    },
    {
      id: 'reliableFollowUp',
      questionText: 'Reliable follow-up available within 24–48 hours?',
      type: 'boolean',
    },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];

    const ageMonths = Number(data.ageMonths);
    const temperature = Number(data.temperature);
    const feverDurationHours = Number(data.feverDurationHours);

    const tempHigh = temperature >= 39;
    const feverMoreThan48h = feverDurationHours > 48;
    const ageLessThan12m = ageMonths < 12;
    const femaleLessThan24m = data.sex === 'female' && ageMonths < 24;
    const uncircMaleLessThan12m =
      data.sex === 'male_uncircumcised' && ageMonths < 12;
    const incompletelyImmunized = data.immunizationStatus === 'incomplete';

    if (ageMonths < 3 || ageMonths > 36) {
      details.push('Age outside protocol range. This pathway is only for 3–36 months.');
      return { level: 'severe', details };
    }

    if (data.hasAnyRedFlag || data.isWellAppearing === false) {
      details.push('High-risk clinical appearance or red flag present.');
      return { level: 'severe', details };
    }

    if (data.poorIntakeOrDehydration) {
      details.push('Poor intake or dehydration increases risk and may require admission.');
      return { level: 'moderate', details };
    }

    if (data.hasClearSource) {
      details.push('Clear source identified. Manage according to the identified diagnosis.');
      return { level: 'moderate', details };
    }

    if (femaleLessThan24m) {
      details.push('UTI risk: female child younger than 24 months.');
      return { level: 'moderate', details };
    }

    if (uncircMaleLessThan12m) {
      details.push('UTI risk: uncircumcised male younger than 12 months.');
      return { level: 'moderate', details };
    }

    if (data.urinarySymptoms) {
      details.push('UTI risk: urinary symptoms present.');
      return { level: 'moderate', details };
    }

    if (tempHigh && feverMoreThan48h) {
      details.push('Higher SBI risk: fever ≥39°C and duration >48 hours.');
      return { level: 'moderate', details };
    }

    if (tempHigh && incompletelyImmunized) {
      details.push('Occult bacteremia risk: high fever with incomplete/unknown immunization.');
      return { level: 'moderate', details };
    }

    if (tempHigh && ageLessThan12m) {
      details.push('Higher SBI risk: age <12 months with fever ≥39°C.');
      return { level: 'moderate', details };
    }

    details.push('Low-risk well-appearing child with no red flags or major SBI risk factors.');
    return { level: 'mild', details };
  },

  getManagement: (severity, data) => {
    const ageMonths = Number(data.ageMonths);
    const temperature = Number(data.temperature);
    const feverDurationHours = Number(data.feverDurationHours);

    const tempHigh = temperature >= 39;
    const feverMoreThan48h = feverDurationHours > 48;
    const incompletelyImmunized = data.immunizationStatus === 'incomplete';

    const femaleLessThan24m = data.sex === 'female' && ageMonths < 24;
    const uncircMaleLessThan12m =
      data.sex === 'male_uncircumcised' && ageMonths < 12;

    const needsUrine =
      femaleLessThan24m ||
      uncircMaleLessThan12m ||
      data.urinarySymptoms ||
      (tempHigh && !data.hasClearSource) ||
      feverMoreThan48h ||
      data.previousUTI;

    const needsBloodWork =
      tempHigh &&
      (!data.hasClearSource || incompletelyImmunized || feverMoreThan48h);

    if (ageMonths < 3 || ageMonths > 36) {
      return [
        {
          title: 'Outside This Protocol',
          recommendations: [
            'This calculator is intended only for children aged 3–36 months.',
            'Use the appropriate fever protocol for the child’s actual age group.',
          ],
        },
      ];
    }

    if (severity.level === 'severe') {
      return [
        {
          title: 'High-Risk Fever Without Source',
          recommendations: [
            'Treat as possible serious bacterial infection or sepsis.',
            'Stabilize immediately: airway, breathing, circulation, perfusion, glucose, and hydration status.',
            'Obtain urgent full sepsis workup: CBC, CRP and/or procalcitonin, blood culture, catheter urine for urinalysis and urine culture.',
            'Consider lumbar puncture if meningitis is suspected or if clinically appropriate after stabilization.',
            'Start immediate parenteral antibiotics: ceftriaxone IV/IM; add vancomycin if meningitis, severe sepsis, shock, or resistant pneumococcal infection is a concern.',
            'Admit to hospital for monitoring and ongoing treatment.',
          ],
        },
      ];
    }

    if (severity.level === 'moderate') {
      if (data.hasClearSource) {
        return [
          {
            title: 'Fever With Identified Source',
            recommendations: [
              'Manage according to the identified source of infection.',
              'Do not follow the fever-without-source pathway once a clear source is present.',
              'Admit if the child has poor intake, dehydration, clinical deterioration, or unreliable follow-up.',
            ],
          },
        ];
      }

      if (needsUrine && !needsBloodWork) {
        return [
          {
            title: 'Intermediate Risk — UTI Evaluation Needed',
            recommendations: [
              'Obtain urine sample for urinalysis and urine culture.',
              'Preferred urine collection: catheterized specimen.',
              'Suprapubic aspiration is the most sterile option when needed.',
              'Clean-catch urine is acceptable only if the child is toilet-trained.',
              'Do NOT use bag urine for culture because of high contamination risk.',
              'If urinalysis is positive, start oral antibiotic for UTI after urine culture is collected.',
              'If urinalysis is negative and child remains well-appearing, no antibiotic is needed; discharge with safety-net advice and follow-up within 24–48 hours.',
            ],
          },
        ];
      }

      if (needsBloodWork && !needsUrine) {
        return [
          {
            title: 'Intermediate Risk — Blood Evaluation Needed',
            recommendations: [
              'Obtain CBC and CRP and/or procalcitonin.',
              'Obtain blood culture if inflammatory markers are abnormal, immunization is incomplete/unknown, or bacteremia is clinically suspected.',
              'Consider ceftriaxone IV/IM if concern for occult bacteremia is significant.',
              'Discharge only if the child remains well-appearing, hydration is adequate, caregivers are reliable, and follow-up within 24 hours is available.',
              'Admit if labs are concerning, oral intake is poor, or follow-up is unreliable.',
            ],
          },
        ];
      }

      if (needsUrine && needsBloodWork) {
        return [
          {
            title: 'Intermediate Risk — UTI and Occult Infection Evaluation Needed',
            recommendations: [
              'Obtain catheterized urine for urinalysis and urine culture.',
              'Obtain CBC and CRP and/or procalcitonin.',
              'Obtain blood culture if inflammatory markers are abnormal, immunization is incomplete/unknown, or bacteremia is clinically suspected.',
              'If urinalysis is positive, start oral antibiotic for UTI after urine culture is collected.',
              'If blood work is concerning or the child deteriorates, consider ceftriaxone IV/IM and hospital admission.',
              'If all tests are reassuring and the child remains well-appearing, discharge with strict return precautions and follow-up within 24–48 hours.',
            ],
          },
        ];
      }

      if (data.poorIntakeOrDehydration || data.reliableFollowUp === false) {
        return [
          {
            title: 'Intermediate Risk — Admission Considered',
            recommendations: [
              'Consider hospital admission because of poor intake, dehydration, or unreliable follow-up.',
              'Obtain targeted labs based on clinical findings.',
              'Start antibiotics only if UTI, bacteremia, or another bacterial source is suspected.',
            ],
          },
        ];
      }

      return [
        {
          title: 'Intermediate Risk Febrile Child',
          recommendations: [
            'Further evaluation is required based on the clinical risk profile.',
            'Prioritize urine testing if UTI risk is present.',
            'Consider blood testing if fever is ≥39°C, prolonged, or immunization is incomplete.',
            'Discharge only if clinically stable with reliable follow-up.',
          ],
        },
      ];
    }

    return [
      {
        title: 'Low-Risk Fever Without Source',
        recommendations: [
          'No routine laboratory tests are required.',
          'No antibiotics are recommended.',
          'Provide antipyretics and supportive care.',
          'Discharge home with clear return precautions.',
          'Follow up within 24–48 hours or sooner if worsening.',
        ],
      },
    ];
  },

  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
      return ['Admit to hospital immediately.'];
    }

    if (severity.level === 'moderate') {
      if (data.poorIntakeOrDehydration || data.reliableFollowUp === false) {
        return ['Admit or observe in hospital because safe outpatient care is uncertain.'];
      }

      return [
        'Discharge may be appropriate only if the child remains well-appearing, hydrated, clinically stable, and follow-up within 24–48 hours is reliable.',
      ];
    }

    return ['Discharge home with return precautions and follow-up within 24–48 hours.'];
  },

  getRedFlags: () => [
    'Lethargy or decreased consciousness',
    'Toxic/ill appearance',
    'Poor perfusion or delayed capillary refill',
    'Respiratory distress',
    'Persistent irritability or inconsolable crying',
    'Petechiae or purpura',
    'Neck stiffness or bulging fontanelle',
    'Signs of dehydration',
    'Immunocompromised state',
  ],

  getDrugDoses: () => [
    {
      drugName: 'Ceftriaxone IV/IM',
      dose: '50 mg/kg/dose once daily',
      notes:
        'For suspected bacteremia or serious bacterial infection. Consider higher meningitis dosing according to local protocol.',
    },
    {
      drugName: 'Vancomycin IV',
      dose: '15 mg/kg/dose every 6 hours',
      notes:
        'Add if meningitis, shock, severe sepsis, or resistant pneumococcal infection is suspected. Adjust according to renal function and local policy.',
    },
    {
      drugName: 'Cephalexin PO',
      dose: '50 mg/kg/day divided every 6–8 hours',
      notes: 'Option for uncomplicated UTI if local resistance pattern supports use.',
    },
    {
      drugName: 'Amoxicillin-Clavulanate PO',
      dose: '25–45 mg/kg/day amoxicillin component divided twice daily',
      notes: 'Option for UTI depending on local resistance and clinical context.',
    },
    {
      drugName: 'Acetaminophen PO/PR',
      dose: '10–15 mg/kg/dose every 4–6 hours as needed',
      notes: 'Maximum daily dose according to local pediatric dosing policy.',
    },
    {
      drugName: 'Ibuprofen PO',
      dose: '10 mg/kg/dose every 6–8 hours as needed',
      notes: 'Use only if age >6 months and child is not dehydrated.',
    },
  ],

  getReferences: () => [
    {
      title:
        'AAP Clinical Practice Guideline: Urinary Tract Infection in Febrile Infants and Young Children',
      url: 'https://publications.aap.org/pediatrics/article/128/3/595/30724/Urinary-Tract-Infection-Clinical-Practice',
    },
    {
      title:
        'UpToDate: Fever without a source in children 3 to 36 months of age',
      url: 'https://www.uptodate.com/contents/fever-without-a-source-in-children-3-to-36-months-of-age-evaluation-and-management',
    },
  ],
};
