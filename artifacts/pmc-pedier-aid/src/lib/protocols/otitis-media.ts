import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

export const otitisMediaProtocol: DiseaseProtocol = {
  id: 'otitis-media',
  name: 'Acute Otitis Media',
  unit: 'er',
  system: 'Focal Infections',
  description: 'Assessment and management of acute otitis media in children presenting to the ER, per AAP 2013 guidelines.',
  lastUpdated: 'June 2026',
  image: {
    url: 'https://picsum.photos/seed/otitis-media/600/400',
    hint: 'child ear examination',
  },
  questions: [
    {
      id: 'ageMonths',
      questionText: 'Age (months)',
      type: 'number',
      placeholder: 'e.g. 24',
      unit: 'months',
    },
    {
      id: 'laterality',
      questionText: 'Which ear(s) affected?',
      type: 'select',
      options: [
        { label: 'Unilateral', value: 'unilateral' },
        { label: 'Bilateral', value: 'bilateral' },
      ],
    },
    {
      id: 'otorrhea',
      questionText: 'Ear discharge (otorrhoea) present?',
      type: 'boolean',
    },
    {
      id: 'highFever',
      questionText: 'Fever ≥39°C (102.2°F)?',
      type: 'boolean',
    },
    {
      id: 'mastoidTenderness',
      questionText: 'Mastoid tenderness or posterior auricular swelling?',
      type: 'boolean',
    },
    {
      id: 'facialPalsy',
      questionText: 'Facial asymmetry or palsy?',
      type: 'boolean',
    },
    {
      id: 'failedTreatment',
      questionText: 'Failed prior antibiotics in this episode (no improvement at 48–72h)?',
      type: 'boolean',
    },
    {
      id: 'immunocompromised',
      questionText: 'Immunocompromised or has cochlear implant?',
      type: 'boolean',
    },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    const age = Number(data.ageMonths || 0);
    const bilateral = data.laterality === 'bilateral';
    const otorrhea = data.otorrhea === true;
    const highFever = data.highFever === true;
    const mastoid = data.mastoidTenderness === true;
    const facialPalsy = data.facialPalsy === true;
    const failed = data.failedTreatment === true;
    const immunocomp = data.immunocompromised === true;

    let level: SeverityLevel;
    let interpretation: string;

    if (mastoid || facialPalsy || immunocomp) {
      level = 'severe';
      interpretation = 'Complicated AOM — urgent ENT referral required';
      if (mastoid) details.push('Mastoid involvement: rule out acute mastoiditis with CT');
      if (facialPalsy) details.push('Facial nerve involvement: urgent imaging and ENT review');
      if (immunocomp) details.push('High-risk host: no observation option, immediate IV antibiotics');
    } else if (age < 24 || bilateral || highFever || otorrhea || failed) {
      level = 'moderate';
      interpretation = 'AOM — immediate antibiotic therapy indicated';
      if (age < 24) details.push('Age <2 years: no observation option per AAP 2013');
      if (bilateral) details.push('Bilateral AOM: does not meet criteria for watchful waiting');
      if (highFever) details.push('Fever ≥39°C: severe symptom criterion met');
      if (otorrhea) details.push('Spontaneous otorrhoea: treat with antibiotics regardless of other criteria');
      if (failed) details.push('Prior antibiotic failure: escalate to amoxicillin-clavulanate');
    } else {
      level = 'mild';
      interpretation = 'AOM — observation option appropriate (48–72h)';
      details.push('Child ≥2 years, unilateral, no otorrhoea, fever <39°C');
      details.push('48–72h watchful waiting is safe if reliable follow-up is assured');
    }

    return {
      level,
      details,
      scoreDetails: {
        systemName: 'AOM Severity (AAP 2013)',
        totalScore: 0,
        interpretation,
        referenceTable: [
          { range: 'Mild', meaning: '≥2y, unilateral, no otorrhoea, fever <39°C → observe 48–72h' },
          { range: 'Moderate', meaning: '<2y, bilateral, high fever, otorrhoea, or failed Rx → immediate amoxicillin' },
          { range: 'Severe', meaning: 'Mastoid signs, facial palsy, or immunocompromised → ENT + imaging' },
        ],
      },
    };
  },

  getManagement: (severity: Severity, data: FormData) => {
    const age = Number(data.ageMonths || 0);
    const failed = data.failedTreatment === true;
    const mastoid = data.mastoidTenderness === true;

    if (severity.level === 'severe') {
      return [
        {
          title: 'Urgent management',
          recommendations: [
            'Consult Ear, Nose, and Throat (ENT) before discharge',
            'CT mastoids if mastoid tenderness, erythema, or swelling present',
            'Start ceftriaxone (cefTRIAXone) 50 mg/kg IV/IM while awaiting ENT',
            'Blood culture if febrile and toxic-appearing',
            mastoid ? 'Surgical drainage (myringotomy ± mastoidectomy) may be required' : 'Facial nerve decompression if palsy confirmed',
          ],
        },
        {
          title: 'Supportive care',
          recommendations: [
            'Ibuprofen 10 mg/kg/dose every 6–8h for analgesia',
            'Avoid topical anaesthetic ear drops if perforation is suspected',
            'Nil by mouth if surgical intervention anticipated',
          ],
        },
      ];
    }

    if (severity.level === 'moderate') {
      const drug = failed
        ? 'Amoxicillin-clavulanate (90/6.4 mg/kg/day) ÷ twice daily (BD)'
        : 'Amoxicillin 90 mg/kg/day ÷ twice daily (BD)';
      const duration = age < 24 ? '10 days' : '5–7 days';
      return [
        {
          title: 'Immediate antibiotic therapy',
          recommendations: [
            `Start ${drug} × ${duration}`,
            'Ibuprofen 10 mg/kg/dose every 6–8h for pain',
            'Reassess if fever or pain persists beyond 48–72h on antibiotics',
            'Do not prescribe topical decongestants, antihistamines, or steroids',
          ],
        },
        {
          title: 'Safety netting',
          recommendations: [
            'Return to ER if fever persists >48h despite antibiotics',
            'Return immediately for mastoid swelling, facial asymmetry, or neck stiffness',
            'Primary care or ENT recheck in 2–4 weeks to confirm resolution',
          ],
        },
      ];
    }

    return [
      {
        title: 'Watchful waiting (observation option)',
        recommendations: [
          'Observe for 48–72h without antibiotics',
          'Prescribe ibuprofen 10 mg/kg/dose every 6–8h for pain control',
          'Provide a safety-net antibiotic prescription (amoxicillin) to fill only if worsening',
          'Caregiver must be reliable and able to return promptly if child worsens',
        ],
      },
      {
        title: 'When to start antibiotics immediately',
        recommendations: [
          'No improvement or worsening at 48–72h → fill amoxicillin prescription',
          'New otorrhoea or mastoid tenderness develops',
          'Fever ≥39°C develops after initial observation',
          'Caregiver cannot monitor or is unable to return if worse',
        ],
      },
    ];
  },

  getDisposition: (severity: Severity, _data: FormData) => {
    if (severity.level === 'severe') {
      return [
        'Admit to paediatric ward under ENT service',
        'Do not discharge until ENT review is complete',
        'CT imaging before surgical planning if mastoiditis suspected',
      ];
    }
    if (severity.level === 'moderate') {
      return [
        'Discharge with oral antibiotics',
        'Primary care review in 48–72h if no improvement',
        'ENT follow-up in 2–4 weeks to confirm resolution',
      ];
    }
    return [
      'Discharge with safety-net antibiotic prescription',
      'Clear return-to-ER instructions given to caregiver',
      'Primary care follow-up within 48–72h',
    ];
  },

  getRedFlags: (_severity: Severity, _data: FormData) => [
    'Mastoid tenderness, erythema, or swelling behind the ear — suspect mastoiditis',
    'Facial asymmetry or palsy — facial nerve involvement',
    'Neck stiffness or meningismus — suspect intracranial spread',
    'Lethargy, persistent vomiting, or toxic-looking child',
    'No improvement after 48–72h of appropriate antibiotics',
    'Immunocompromised child or cochlear implant — no observation option',
  ],

  getDrugDoses: (severity: Severity, data: FormData) => {
    const failed = data.failedTreatment === true;
    if (severity.level === 'severe') {
      return [
        {
          drugName: 'Ceftriaxone (cefTRIAXone) IV',
          dose: '50 mg/kg/dose once daily IV (max 2 g/dose)',
          notes: 'For complicated AOM or inability to take oral medications',
        },
        {
          drugName: 'Ibuprofen (analgesia)',
          dose: '10 mg/kg/dose every 6–8h orally (max 400 mg/dose)',
        },
      ];
    }
    return [
      {
        drugName: failed ? 'Amoxicillin-clavulanate' : 'Amoxicillin',
        dose: failed
          ? '90/6.4 mg/kg/day divided twice daily orally × 10 days'
          : '90 mg/kg/day divided twice daily orally × 10 days (<2y) or 5–7 days (≥2y)',
        notes: failed
          ? 'Use when amoxicillin failed at 48–72h; covers beta-lactamase-producing H. influenzae and M. catarrhalis'
          : 'First-line therapy for AOM (AAP 2013); high dose to cover resistant Streptococcus pneumoniae',
      },
      {
        drugName: 'Ibuprofen (analgesia)',
        dose: '10 mg/kg/dose every 6–8h orally (max 400 mg/dose)',
        notes: 'Preferred over paracetamol for AOM pain; add paracetamol alternating if pain is severe',
      },
    ];
  },

  getReferences: () => [
    {
      title: 'AAP/AAFP Clinical Practice Guideline: Diagnosis and Management of Acute Otitis Media (2013)',
      url: 'https://publications.aap.org/pediatrics/article/131/3/e964/31005',
    },
    {
      title: 'Nelson Textbook of Pediatrics 21st ed. — Ch 658: Otitis Media',
      url: '',
    },
  ],
};
