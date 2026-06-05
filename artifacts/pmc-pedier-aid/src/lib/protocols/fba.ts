import type { DiseaseProtocol, ErData, FormData, Severity, SeverityLevel, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    { id: 'witnessed',      question: 'Witnessed choking or sudden gagging episode?', redFlag: true,  ifYes: 'Strongest predictor of FBA. Proceed as confirmed aspiration regardless of CXR result. ENT / bronchoscopy referral.' },
    { id: 'very_young',     question: 'Age under 3 years?', redFlag: true,  ifYes: 'Peak incidence 1–3 years. Objects most commonly nuts, seeds, small toys, coins. CXR is often normal (organic material is radiolucent).' },
    { id: 'object_type',    question: 'Organic object (nut, seed, grape, carrot) or small toy / coin?', redFlag: true, ifYes: 'Organic material: not radio-opaque, causes more mucosal inflammation, may swell with moisture. Higher risk of delayed diagnosis. Button batteries or magnets → immediate removal (chemical burn / pressure necrosis).' },
    { id: 'button_battery', question: 'Possible button battery or magnet ingestion?', redFlag: true,  ifYes: 'AIRWAY EMERGENCY. Button batteries cause severe chemical necrosis within 2 hours. Magnets cause pressure necrosis. Do NOT observe — immediate removal regardless of symptoms.' },
    { id: 'delay',          question: 'Symptom onset > 24 hours ago (delayed presentation)?', redFlag: false, ifYes: 'Delayed FBA: FB may have caused distal pneumonia, atelectasis, or abscess. Normal initial period after aspiration ("symptom-free interval") in 50%. Still needs bronchoscopy.' },
    { id: 'prior_resp',     question: 'Known asthma or recurrent wheeze?', ifYes: 'Asthma may mask or mimic FBA. If history of sudden-onset change in wheeze character or unilateral findings → FBA until excluded.' },
    { id: 'dysphasia',      question: 'Difficulty swallowing or drooling after choking event?', ifYes: 'Object may be in oesophagus rather than trachea. Oesophageal FB also urgent — rigid endoscopy.' },
  ],

  investigations: [
    { test: 'CXR (PA + lateral) — INSPIRATORY', category: 'radiology', indication: 'First-line imaging. Order for ALL suspected FBA. Radio-opaque objects (coin, metal) visible directly. Most FBs are radiolucent — look for: unilateral hyperinflation (air-trapping distal to partial obstruction), atelectasis, mediastinal shift.', criticalValue: 'Mediastinal shift AWAY from affected side = obstructive emphysema (ball-valve mechanism). ENT urgently.' },
    { test: 'CXR expiratory or left lateral decubitus', category: 'radiology', indication: 'Add expiratory view or lateral decubitus (affected side down) if inspiratory CXR normal but suspicion high. Air-trapping becomes more obvious on expiratory film. Lateral decubitus: affected side down → dependent lung should collapse; if it doesn\'t → obstructed (ball-valve).', criticalValue: 'Persistent inflation on affected side on expiratory film = highly suspicious for partial obstruction.' },
    { test: 'CT chest (low-dose)', category: 'radiology', indication: 'If CXR inconclusive and clinical suspicion remains moderate–high. Higher sensitivity than plain CXR for soft-tissue and radiolucent objects. Still does NOT replace bronchoscopy.', criticalValue: 'CT positive or inconclusive with high clinical suspicion → proceed to rigid bronchoscopy.' },
    { test: 'SpO₂ monitoring', category: 'urgent', indication: 'Continuous for any child with significant respiratory distress. Spot check for stable presentations.' },
    { test: 'FBC + CRP', category: 'blood', indication: 'Only if delayed presentation (> 24 h) or suspected secondary pneumonia / abscess.' },
  ],

  admissionCriteria: [
    'Active complete airway obstruction — resuscitation area immediately',
    'High clinical probability of FBA (witnessed + unilateral wheeze + abnormal CXR)',
    'Radiological evidence of air-trapping or foreign body',
    'Button battery or magnet — immediate removal regardless of symptoms',
    'Moderate probability with inability to exclude by clinical + imaging assessment',
    'Significant secondary changes (pneumonia, atelectasis)',
  ],

  highRiskFactors: [
    'Age < 3 years',
    'Witnessed choking with organic material (nut, seed)',
    'Button battery or magnet',
    'Delayed presentation (> 24 h) — secondary infection risk',
    'Immunocompromised child',
  ],

  dischargeCriteria: [
    'LOW probability only: no witness, no unilateral findings, normal bilateral CXR, symptoms resolved fully',
    'Clear parental education on return precautions',
    'ENT review arranged within 24 hours if any persisting concern',
    'NEVER discharge if clinical suspicion remains — a normal CXR does NOT exclude FBA',
  ],

  safetyNetting: [
    'RETURN IMMEDIATELY if: child develops breathing difficulty, stridor, or turns blue — even if they seemed fine after the episode.',
    'A normal chest X-ray does NOT rule out foreign body aspiration — many objects are invisible on X-ray.',
    'If in doubt, the only definitive test is a bronchoscopy (a camera procedure under general anaesthetic). The ENT doctor will advise.',
    'Delayed presentation: some children develop cough, wheeze, or fever days to weeks after an aspiration that was not initially noticed. Return if your child develops recurrent or unexplained chest symptoms.',
    'Prevention: children under 5 should not be given whole nuts, hard sweets, grapes (cut them), raw carrots, or popcorn. Keep small toys away from young children.',
    'Never leave a young child unsupervised with small objects or food.',
  ],
};

export const fbaProtocol: DiseaseProtocol = {
  id: 'fba',
  name: 'Foreign Body Aspiration (Suspected)',
  system: 'Respiratory System',
  description: 'Evaluation and emergency management of suspected airway foreign body aspiration in children, from complete obstruction requiring immediate Heimlich manoeuvre to elective rigid bronchoscopy.',
  lastUpdated: '2024',
  image: { url: 'https://picsum.photos/seed/fba/600/400', hint: 'child choking' },
  erData,

  questions: [
    { id: 'weight',           questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'witnessedEvent',   questionText: 'Witnessed choking or gagging episode?',        type: 'boolean', questionGroup: 'suspicion', info: 'Strongest single predictor of FBA. Treat as confirmed until excluded.' },
    { id: 'unilateralWheeze', questionText: 'Unilateral wheeze on auscultation?',           type: 'boolean', questionGroup: 'suspicion', info: 'Asymmetric wheeze distinguishes FBA from bilateral processes (asthma, bronchiolitis).' },
    { id: 'unilateralEntry',  questionText: 'Decreased air entry on ONE side only?',        type: 'boolean', questionGroup: 'suspicion' },
    { id: 'activeObstruction',questionText: 'Active complete / severe obstruction NOW?',    type: 'boolean', questionGroup: 'severity', info: 'Unable to speak or cough effectively, silent cough, cyanosis, or rapidly deteriorating consciousness.' },
    { id: 'symptomOnset',     questionText: 'Sudden onset of cough, wheeze, or stridor?',  type: 'boolean', questionGroup: 'severity' },
    { id: 'cxrFindings',      questionText: 'CXR findings', type: 'select', questionGroup: 'severity', options: [
      { label: 'Not done / normal',         value: 'normal',         score: 0 },
      { label: 'Unilateral hyperinflation', value: 'hyperinflation', score: 3 },
      { label: 'Atelectasis / collapse',    value: 'atelectasis',    score: 2 },
      { label: 'Radio-opaque object seen',  value: 'object_seen',    score: 4 },
    ]},
  ],

  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];

    // ── Suspicion sub-score (discriminates FBA from asthma/croup/bronchiolitis) ──
    let suspicionScore = 0;
    if (data.witnessedEvent   === true) suspicionScore += 3; // strongest predictor — witnessed alone = confirmed
    if (data.unilateralWheeze === true) suspicionScore += 2;
    if (data.unilateralEntry  === true) suspicionScore += 2;

    const suspicionAnswered =
      [data.witnessedEvent, data.unilateralWheeze, data.unilateralEntry]
        .filter(v => v !== undefined).length;

    const diagnosticConfidence =
      suspicionAnswered === 0 ? undefined
      : suspicionScore >= 3  ? 'high'
      : suspicionScore >= 2  ? 'moderate'
      : 'low' as const;

    if (data.activeObstruction === true) {
      return {
        level: 'impending respiratory failure',
        details: ['COMPLETE OBSTRUCTION — Start choking algorithm immediately. Call resuscitation team.'],
        diagnosticConfidence,
      };
    }

    let totalScore = suspicionScore;
    if (data.symptomOnset     === true)             totalScore += 1;
    if (data.cxrFindings === 'hyperinflation')      totalScore += 3;
    else if (data.cxrFindings === 'atelectasis')    totalScore += 2;
    else if (data.cxrFindings === 'object_seen')    totalScore += 4;

    let level: SeverityLevel = 'mild';
    let interpretation = 'Low probability — observe / investigate';

    if (totalScore >= 6 || data.cxrFindings === 'object_seen') {
      level = 'severe';
      interpretation = 'HIGH probability — bronchoscopy indicated';
    } else if (totalScore >= 3) {
      level = 'moderate';
      interpretation = 'MODERATE probability — ENT consult + imaging';
    } else if (totalScore > 0) {
      level = 'mild';
      interpretation = 'Low probability — observe + repeat CXR';
    }

    if (data.cxrFindings === 'normal' && totalScore >= 3) {
      details.push('Normal CXR does NOT exclude FBA — up to 50% of FBs are radiolucent. Proceed by clinical probability.');
    }
    if (data.witnessedEvent === true) details.push('Witnessed choking — strongest predictor. Treat as confirmed until excluded by bronchoscopy.');

    return {
      level,
      scoreDetails: {
        systemName: 'FBA Probability Score',
        totalScore,
        interpretation,
        referenceTable: [
          { range: '≥ 6 or object seen', meaning: 'High probability — bronchoscopy' },
          { range: '3 – 5',             meaning: 'Moderate — ENT + CT if needed' },
          { range: '1 – 2',             meaning: 'Low — observe + repeat CXR' },
          { range: '0',                 meaning: 'Very low — consider discharge with follow-up' },
        ],
      },
      details,
      diagnosticConfidence,
      alternativeProtocol: diagnosticConfidence === 'low' ? { id: 'asthma', name: 'Asthma / Viral Wheeze' } : undefined,
    };
  },

  getManagement: (severity, data) => {
    const ageMonths = Number(data.ageMonths || 0);
    const isInfant  = ageMonths < 12;

    if (severity.level === 'impending respiratory failure') {
      return [
        {
          title: 'STEP 1 — COMPLETE OBSTRUCTION: Choking algorithm NOW',
          recommendations: [
            'Call resuscitation team + ENT + Anaesthesia immediately.',
            isInfant
              ? 'INFANT (< 1 year): 5 back blows (firm, between shoulder blades, head down) → 5 chest thrusts (2 fingers, lower sternum). Repeat cycle.'
              : 'CHILD (> 1 year): 5 back blows → 5 ABDOMINAL THRUSTS (Heimlich — stand behind, below sternum). Repeat cycle.',
            'Check mouth after each cycle — remove visible object ONLY. Never blind finger sweeps.',
            'If becomes unconscious → START CPR. Open airway, look for object before giving breaths.',
            'Continue until object relieved or child loses consciousness.',
          ],
        },
        {
          title: 'STEP 2 — REASSESS: Object expelled?',
          recommendations: [
            'Object expelled + child breathing → assess for secondary injury. Admit for observation.',
            'Object NOT expelled + unconscious → CPR in progress → STEP 3.',
            'Partial relief → ongoing distress → STEP 3.',
          ],
        },
        {
          title: 'STEP 3 — ESCALATION: Partial or failed relief — controlled airway',
          recommendations: [
            'Laryngoscopy + Magill forceps attempt if object visible above vocal cords.',
            'Rigid bronchoscopy in OR under anaesthesia — only definitive airway removal technique.',
            'If complete obstruction and can\'t oxygenate: needle cricothyroidotomy (14G cannula, jet ventilation).',
            'ENT surgical airway as last resort.',
          ],
        },
        {
          title: 'STEP 4 — LIFE-THREATENING: Arrest or inability to ventilate',
          recommendations: [
            'CPR if pulseless.',
            'Attempt to visualise + remove object during laryngoscopy.',
            'Surgical airway distal to obstruction if accessible.',
            'Post-arrest: ICU, rigid bronchoscopy when stable, assess for secondary aspiration injury.',
          ],
        },
      ];
    }

    if (severity.level === 'severe') {
      return [
        {
          title: 'STEP 1 — High probability FBA: NPO + ENT consult',
          recommendations: [
            'Keep NPO (nil by mouth) immediately — bronchoscopy under GA required.',
            'Continuous SpO₂ monitoring.',
            'Do NOT give bronchodilators — may shift partial obstruction to complete obstruction.',
            'ENT / Pulmonology consult for rigid bronchoscopy.',
            'Normal CXR does NOT exclude FBA — bronchoscopy is the definitive test.',
          ],
        },
        {
          title: 'STEP 2 — REASSESS: Imaging + team response',
          recommendations: [
            'Confirm ENT on their way. Organise OR slot.',
            'If CXR shows object visible → confirm type (button battery → immediate priority).',
            'If clinical deterioration → STEP 3 immediately.',
          ],
        },
        {
          title: 'STEP 3 — ESCALATION: Deteriorating before bronchoscopy',
          recommendations: [
            'Supplemental O₂ — minimise distress.',
            'Anaesthesia on standby for emergency bronchoscopy.',
            'If complete obstruction develops → immediate choking algorithm (STEP 1 for complete obstruction).',
          ],
        },
        {
          title: 'STEP 4 — LIFE-THREATENING: Complete obstruction develops',
          recommendations: [
            'Choking algorithm (back blows + abdominal thrusts) if conscious.',
            'CPR if pulseless.',
            'Emergency rigid bronchoscopy or surgical airway.',
          ],
        },
      ];
    }

    if (severity.level === 'moderate') {
      return [
        {
          title: 'STEP 1 — Moderate probability: Investigate before deciding',
          recommendations: [
            'Expiratory CXR or lateral decubitus view (affected side down) if inspiratory CXR normal.',
            'Consider CT chest if still inconclusive.',
            'ENT consult — discuss bronchoscopy threshold.',
            'NPO pending ENT decision.',
          ],
        },
        {
          title: 'STEP 2 — REASSESS after imaging',
          recommendations: [
            'Air-trapping on expiratory film → bronchoscopy.',
            'All imaging normal + improving → 24 h observation + follow-up CXR.',
            'Any worsening → escalate to STEP 3.',
          ],
        },
        {
          title: 'STEP 3 — ESCALATION: Persisting concern',
          recommendations: [
            'Diagnostic rigid bronchoscopy even with normal imaging if clinical suspicion remains.',
            'A missed FB causes progressive pneumonia, abscess, and bronchiectasis — overdiagnosis risk is low.',
          ],
        },
        { title: 'STEP 4 — Complete obstruction', recommendations: ['Choking algorithm. Emergency airway as above.'] },
      ];
    }

    // Low probability
    return [
      {
        title: 'STEP 1 — Low probability: Observe + investigate',
        recommendations: [
          'CXR (inspiratory + expiratory views).',
          'Observe for 2–4 hours in ER.',
          'No bronchodilators.',
          'Inform parents: normal CXR does not exclude aspiration — return immediately if symptoms worsen.',
        ],
      },
      {
        title: 'STEP 2 — REASSESS before discharge',
        recommendations: [
          'Symptoms fully resolved, CXR normal, no unilateral findings → discharge with strict return instructions.',
          'Any persisting unilateral wheeze, atelectasis, or cough → ENT follow-up arranged within 24 h.',
        ],
      },
      {
        title: 'STEP 3 — ESCALATION: Symptoms persist or worsen',
        recommendations: [
          'ENT consult + possible bronchoscopy even with normal imaging.',
          'CT chest if still inconclusive.',
        ],
      },
      { title: 'STEP 4 — Complete obstruction', recommendations: ['Choking algorithm. Emergency airway as above.'] },
    ];
  },

  getDisposition: (severity) => {
    if (severity.level === 'impending respiratory failure') return ['Resuscitation area — choking algorithm in progress. PICU after stabilisation.'];
    if (severity.level === 'severe') return ['Admit for rigid bronchoscopy under GA. Theatre booking urgent.'];
    if (severity.level === 'moderate') return ['Admit pending ENT decision + imaging.'];
    return ['Discharge if very low probability, normal imaging, and symptoms resolved. ENT follow-up if ANY residual concern.'];
  },

  getRedFlags: () => [
    'Complete obstruction — silent cough, cyanosis, unable to speak',
    'Witnessed choking with any respiratory symptoms',
    'Button battery or magnet aspiration',
    'Unilateral wheeze on auscultation',
    'Unilateral air-trapping on CXR',
    'Sudden onset unexplained respiratory symptoms in a toddler',
    'Delayed presentation with recurrent pneumonia in same lobe',
  ],

  getDrugDoses: (severity, data): DrugDose[] => {
    const doses: DrugDose[] = [];
    doses.push({ drugName: 'No pharmacological treatment for FBA', dose: 'Bronchodilators are CONTRAINDICATED — may convert partial to complete obstruction.', notes: 'Oxygen (blow-by or low-flow) only. No nebulisers, no steroids, no antibiotics routinely.' });
    if (severity.level === 'impending respiratory failure') {
      doses.push({ drugName: 'Antibiotics (if secondary pneumonia confirmed)', dose: 'Amoxicillin-Clavulanate 45 mg/kg/day (amoxicillin component) divided BID × 7 days', notes: 'Only after FB removed and if secondary bacterial infection confirmed on CXR.' });
    }
    return doses;
  },

  getReferences: () => [
    { title: 'Pediatric Airway Foreign Body — AAP Clinical Report 2010', url: 'https://doi.org/10.1542/peds.2010-0300' },
    { title: 'ERC Guidelines 2021 — Paediatric Choking Algorithm', url: 'https://www.erc.edu/guidelines' },
    { title: 'Baharloo F et al. — Tracheobronchial foreign bodies: presentation and management. Chest 1999', url: 'https://doi.org/10.1378/chest.115.5.1357' },
    { title: 'Rodríguez H et al. — Foreign body aspiration in pediatric patients. Int J Pediatr Otorhinolaryngol 2016', url: 'https://doi.org/10.1016/j.ijporl.2016.04.005' },
  ],
};
