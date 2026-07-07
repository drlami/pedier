import type { DiseaseProtocol, ErData, ErInvestigation, FormData, Severity, SeverityLevel, DrugDose } from './types';

const erData: ErData = {
  historyChecklist: [
    { id: 'proptosis_hx',       question: 'Proptosis (eye appears to bulge forward relative to the other eye)?', redFlag: true,  ifYes: 'ORBITAL CELLULITIS until proven otherwise. Proptosis indicates infection posterior to the orbital septum. Immediate ophthalmology consult + CT orbits and sinuses with IV contrast.' },
    { id: 'pain_eom',           question: 'Pain with eye movements (ask the child to look in all four directions)?', redFlag: true,  ifYes: 'Orbital cellulitis feature — inflammation of the extraocular muscles within the orbit. Preseptal cellulitis does NOT cause pain on eye movement.' },
    { id: 'restricted_eom',     question: 'Restricted, limited, or asymmetric extraocular movements (ophthalmoplegia)?', redFlag: true,  ifYes: 'Ophthalmoplegia indicates orbital involvement. Manage as orbital cellulitis. Urgent ophthalmology + ENT + CT.' },
    { id: 'vision_change',      question: 'Visual change, decreased acuity, blurring, or diplopia (double vision)?', redFlag: true,  ifYes: 'Visual compromise in orbital cellulitis may indicate optic nerve compression or central retinal artery occlusion — a sight-threatening emergency. Immediate ophthalmology.' },
    { id: 'tense_bilateral',    question: 'Tense edema with crepitus on palpation, OR bilateral eyelid involvement?', redFlag: true,  ifYes: 'Tense edema + crepitus → necrotising fasciitis of the periocular soft tissues (rare but life-threatening). Bilateral involvement is unusual for preseptal cellulitis and raises concern for sinusitis-driven orbital disease or systemic infection.' },
    { id: 'trauma_source',      question: 'Periorbital skin trauma, insect bite, animal bite, or foreign body in the past 7–10 days?', redFlag: false, ifYes: 'S. aureus (including community-acquired MRSA) and S. pyogenes are the predominant pathogens. Empiric therapy MUST include MRSA coverage. DO NOT use clindamycin — substantial MRSA and MSSA resistance.' },
    { id: 'sinusitis_hx',       question: 'Recent sinusitis or prolonged/worsening upper respiratory tract infection (> 7 days)?', redFlag: false, ifYes: 'Sinusitis is a major source of preseptal cellulitis (ethmoid sinuses are separated from the orbit by the paper-thin lamina papyracea). Organisms: S. pneumoniae, H. influenzae, M. catarrhalis. No MRSA coverage required for sinusitis-driven preseptal cellulitis.' },
    { id: 'dacryocystitis',     question: 'Tenderness or swelling over the lacrimal sac (medial canthus, below the medial canthal tendon)? Mucopurulent discharge from punctum?', redFlag: false, ifYes: 'Dacryocystitis is responsible for ~30% of preseptal cellulitis cases. Pathogens are S. aureus and S. pyogenes. Warm compresses + systemic antibiotics (amoxicillin-clavulanate). Drainage if abscess forms; ENT or ophthalmology for dacryocystorhinostomy referral.' },
    { id: 'failed_outpatient',  question: 'Already on oral antibiotics for this episode and worsening at 24 h or not improving at 48 h?', redFlag: false, ifYes: 'Failure to respond to outpatient antibiotics mandates hospitalization, IV antibiotics, CT imaging, and ophthalmology consult — regardless of current appearance.' },
    { id: 'infant',             question: 'Age < 1 year?', redFlag: false, ifYes: 'All infants < 1 year require admission — full examination may not be reliable at this age, bacteraemic seeding (S. pyogenes) is more common, and clinical deterioration can be rapid.' },
    { id: 'unimmunized',        question: 'Incompletely vaccinated or vaccination status unknown? (especially Hib, PCV)', redFlag: false, ifYes: 'H. influenzae type b was the dominant cause of bacteraemic preseptal cellulitis before conjugate vaccines. Although rare now, unimmunised children retain elevated risk of invasive Hib disease. Blood culture is indicated.' },
  ],

  investigations: [
    { test: 'Complete eye examination — proptosis, EOM, visual acuity, and pupil reactions', category: 'urgent', indication: 'THE most important investigation. Proptosis, limited EOM, pain with movement, or visual change = orbital cellulitis. If the child cannot cooperate → treat as orbital cellulitis and obtain CT.' },
    { test: 'Mark the borders of eyelid erythema with a skin marker', category: 'urgent', indication: 'Documents the initial extent of cellulitis for objective monitoring. Spreading erythema beyond the marked border at re-check = worsening infection → escalate to IV antibiotics + CT.' },
    { test: 'CT orbits and sinuses with IV contrast', category: 'radiology', indication: 'INDICATED when: (1) any clinical sign of orbital cellulitis, (2) child cannot cooperate for full exam, (3) marked eyelid swelling + fever + leukocytosis, (4) no improvement after 24–48 h of oral antibiotics. NOT routinely needed for clear uncomplicated preseptal cellulitis.', criticalValue: 'Proptosis + fat stranding of orbital contents + EOM thickening = orbital cellulitis → immediate ophthalmology + ENT' },
    { test: 'Blood culture × 1', category: 'blood', indication: 'NOT routine for uncomplicated preseptal cellulitis (yield is extremely low). Indicated for: age < 1 year, fever, unimmunised children, toxic appearance, or when orbital cellulitis cannot be excluded.', criticalValue: 'Positive blood culture → broaden antibiotic therapy to IV based on organism and susceptibilities' },
    { test: 'CBC + CRP', category: 'blood', indication: 'Leukocytosis and elevated CRP are neither sensitive nor specific for preseptal cellulitis, but are useful for baseline severity in admitted patients and in cases where orbital cellulitis is uncertain. Marked leukocytosis (WBC > 15,000) in the context of significant eyelid swelling + fever → CT imaging indicated.' },
    { test: 'Wound / abscess aspirate — Gram stain + culture (if pointing abscess or fluctuant area at puncture site)', category: 'blood', indication: 'If a drainable abscess is present (dacryocystitis with pointing abscess, infected insect bite with fluctuance), aspirate for Gram stain and aerobic culture. Pathogen identification allows targeted antibiotic de-escalation.' },
    { test: 'Nasal swab or nasopharyngeal culture (if sinusitis source suspected)', category: 'blood', indication: 'Optional — may identify respiratory pathogens (S. pneumoniae, H. influenzae, M. catarrhalis) but results rarely change immediate empiric therapy. Useful in the context of recurrent cellulitis or failed therapy.' },
  ],

  admissionCriteria: [
    'Age < 1 year — ALL infants require admission; full reliable examination is not possible and bacteraemic disease is more prevalent in this age group',
    'Child unable to cooperate for a full eye examination — cannot exclude orbital involvement without CT; manage as orbital cellulitis pending imaging',
    'Toxic/ill appearance or signs of systemic toxicity',
    'Any sign pointing to orbital cellulitis: proptosis, ophthalmoplegia, pain on eye movement, visual change, or chemosis — manage as orbital cellulitis immediately',
    'Tense eyelid oedema with crepitus — necrotising fasciitis must be excluded; urgent surgical and ophthalmology consult',
    'Bilateral eyelid involvement — atypical for simple preseptal cellulitis; raises concern for sinusitis-driven orbital disease or systemic infection',
    'Marked eyelid swelling + fever + leukocytosis (WBC > 15,000/mm³) — obtain CT even if no orbital signs; orbital involvement may be subtle',
    'Failed outpatient oral antibiotics at 24 h (worsening) or 48 h (no improvement) — IV antibiotics + CT + ophthalmology review',
    'No reliable caregiver or unable to guarantee follow-up within 24 h',
  ],

  highRiskFactors: [
    'Sinusitis confirmed on imaging even with apparent preseptal cellulitis — the ethmoid sinuses are separated from the orbit only by the paper-thin lamina papyracea; early orbital extension may not yet be visible on CT',
    'Animal bite (especially cat) to the periorbital area — Pasteurella multocida is the predominant pathogen; requires specific antibiotic coverage (amoxicillin-clavulanate first-line)',
    'Dacryocystitis with overlying skin cellulitis — medial canthal swelling + epiphora + mucopurulent discharge; systemic antibiotics + ophthalmology referral for dacryocystorhinostomy',
    'Insect bite with rapid spread of erythema beyond periorbital area — consider allergic component (examine carefully; antihistamine may help differentiate from pure infection)',
    'Hordeolum (stye) progressing to diffuse periorbital cellulitis — usually unilateral, arises from eyelid margin; requires systemic antibiotics if spreading beyond the immediate lid margin area',
  ],

  dischargeCriteria: [
    'Age ≥ 1 year — reliable examination possible',
    'Well-appearing throughout ER stay — no signs of systemic toxicity',
    'Complete absence of orbital signs — no proptosis, no pain with eye movements, full and painless extraocular movements, normal visual acuity (or age-appropriate response to visual threat)',
    'Eyelid erythema and swelling not tense; no crepitus; unilateral involvement only',
    'Eyelid borders marked — caregiver understands how to monitor for spread',
    'Oral antibiotic prescribed and caregiver able to administer; no issues with tolerance',
    'Reliable caregiver who understands return precautions clearly and can monitor for deterioration',
    'Follow-up confirmed within 24 h — earlier (same day) if any uncertainty about orbital involvement',
    'Caregiver explicitly counselled: if the eye appears to bulge, eye movements become painful, or vision changes → return to ER IMMEDIATELY',
  ],

  safetyNetting: [
    'Return to ER IMMEDIATELY if: the eye appears to be pushing forward (bulging) in the socket; moving the eye causes pain; your child cannot move the eye in any direction; vision becomes blurry or double; the eyelid swelling or redness spreads significantly beyond the markings done in the ER; your child develops high fever or looks very unwell.',
    'This is a 24-hour-follow-up condition — do not wait until the appointment if the child is getting worse. Same-day return is always appropriate if you are concerned.',
    'Give the full course of antibiotics — typically 5–7 days. Do not stop early even if the swelling is nearly gone. Unfinished courses may allow infection to return or worsen.',
    'Monitor the skin markings (the drawn border around the redness). If redness spreads significantly beyond the marks, return immediately — the infection is not responding to oral antibiotics.',
    'Do NOT use topical antibiotic drops or ointment on the eye — they have no role in treating this infection, which is in the eyelid skin, not inside the eye.',
    'Warm compresses (clean cloth soaked in warm water) applied to the eyelid for 10–15 minutes several times a day may help reduce swelling and discomfort.',
    'Ibuprofen (if ≥ 6 months and not dehydrated) or Paracetamol for pain and fever.',
    'Do not squeeze, press, or try to drain any swelling on the eyelid at home — this risks spreading the infection and causing eye injury.',
  ],
};

export const periorbitalCellulitisProtocol: DiseaseProtocol = {
  id: 'periorbital-cellulitis',
  name: 'Periorbital Cellulitis',
  system: 'Infectious Diseases',
  description: 'ER pathway for preseptal (periorbital) cellulitis — infection of the soft tissues anterior to the orbital septum — with emphasis on distinguishing it from the more dangerous orbital cellulitis (infection posterior to the septum). Based on the UpToDate/Durand clinical practice guideline (Principles and Practices of Infectious Diseases, 9th ed.).\n\nPreseptal cellulitis rarely causes serious complications; orbital cellulitis may cause vision loss and, rarely, death. The two are distinguished clinically by the presence of proptosis, ophthalmoplegia, pain with eye movements, and visual impairment — features that are caused by orbital involvement but are ABSENT in pure preseptal disease. When in doubt, manage as orbital cellulitis.\n\nMicrobiology is source-driven: trauma/skin origin → S. aureus (MRSA included) + S. pyogenes; sinusitis/upper airway origin → S. pneumoniae, H. influenzae, M. catarrhalis. Clindamycin is NOT recommended for empiric therapy — substantial resistance in both MRSA and MSSA makes it unreliable in this setting.',
  lastUpdated: '2026',
  image: {
    url: 'https://picsum.photos/seed/periorbital-cellulitis/600/400',
    hint: 'swollen eyelid',
  },
  erData,

  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'proptosis', questionText: 'Proptosis — eye appears to bulge forward?', type: 'boolean', info: 'Compare both eyes from above the patient\'s head. Even subtle asymmetry suggests orbital involvement.' },
    { id: 'painWithEOM', questionText: 'Pain with eye movements?', type: 'boolean', info: 'Ask the child to follow your finger in all four directions. Preseptal cellulitis does NOT cause pain on eye movement.' },
    { id: 'restrictedEOM', questionText: 'Restricted, limited, or asymmetric extraocular movements?', type: 'boolean', info: 'Any restriction in any direction = ophthalmoplegia = orbital cellulitis until proven otherwise.' },
    { id: 'visionChange', questionText: 'Visual change — decreased acuity, blurring, or diplopia?', type: 'boolean', info: 'Use age-appropriate visual assessment. Diplopia or unilateral vision reduction in the context of periorbital swelling is a sight-threatening emergency.' },
    { id: 'chemosis', questionText: 'Chemosis (conjunctival swelling visible between the eyelids)?', type: 'boolean', info: 'Chemosis can rarely occur in severe preseptal cellulitis, but is more commonly a sign of orbital involvement.' },
    { id: 'appearance', questionText: 'General appearance', type: 'select', options: [
      { label: 'Well-appearing — comfortable, no systemic toxicity', value: 'well', score: 0 },
      { label: 'Ill-appearing — toxic, lethargic, febrile, or in pain', value: 'ill', score: 3 },
    ]},
    { id: 'traumaSource', questionText: 'Periorbital skin trauma, insect bite, or animal bite as likely source?', type: 'boolean', info: 'Skin-source infections require MRSA-active empiric therapy. Sinusitis-source infections do not.' },
    { id: 'sinusitisSource', questionText: 'Sinusitis or prolonged URTI (> 7 days) as likely source?', type: 'boolean', info: 'Sinusitis is a major source; ethmoid sinuses are directly adjacent to the orbit. Even apparent preseptal sinusitis-related cellulitis may represent early orbital involvement.' },
    { id: 'canCooperate', questionText: 'Child able to cooperate fully for eye examination?', type: 'boolean', info: 'If the child cannot cooperate → a complete assessment of orbital signs cannot be performed → treat as orbital cellulitis pending CT.' },
  ],

  calculateSeverity: (data: FormData): Severity => {
    const ageM         = Number(data.ageMonths) || 0;
    const proptosis    = data.proptosis === true;
    const painEOM      = data.painWithEOM === true;
    const restrictEOM  = data.restrictedEOM === true;
    const visionChange = data.visionChange === true;
    const chemosis     = data.chemosis === true;
    const isToxic      = data.appearance === 'ill';
    const canCoop      = data.canCooperate === true;
    const tenseBilat   = data.tense_bilateral === true;

    // History checklist inputs
    const proptosisHx   = data.proptosis_hx === true;
    const painEOMHx     = data.pain_eom === true;
    const restrictEOMHx = data.restricted_eom === true;
    const visionHx      = data.vision_change === true;
    const tenseBilatHx  = data.tense_bilateral === true;
    const traumaHx      = data.trauma_source === true;
    const sinusHx       = data.sinusitis_hx === true;
    const dacryo        = data.dacryocystitis === true;
    const failedOPD     = data.failed_outpatient === true;
    const infantHx      = data.infant === true;
    const unimmunized   = data.unimmunized === true;
    const traumaSrc     = data.traumaSource === true;

    const hasOrbitalSign =
      proptosis || painEOM || restrictEOM || visionChange ||
      proptosisHx || painEOMHx || restrictEOMHx || visionHx;

    const details: string[] = [];

    // ── SEVERE — orbital cellulitis signs ────────────────────────────────
    if (hasOrbitalSign) {
      if (proptosis || proptosisHx)         details.push('PROPTOSIS — infection posterior to the orbital septum. Orbital cellulitis confirmed until proven otherwise.');
      if (painEOM || painEOMHx)             details.push('PAIN WITH EYE MOVEMENT — extraocular muscle inflammation = orbital involvement.');
      if (restrictEOM || restrictEOMHx)     details.push('RESTRICTED EXTRAOCULAR MOVEMENTS — ophthalmoplegia; orbital cellulitis confirmed until proven otherwise.');
      if (visionChange || visionHx)         details.push('VISUAL CHANGE — optic nerve compression or vascular compromise; sight-threatening emergency.');
      details.unshift('ORBITAL CELLULITIS SIGNS PRESENT — manage as orbital cellulitis immediately. IV antibiotics + CT orbits/sinuses with contrast + urgent ophthalmology + ENT consult.');
      return {
        level: 'severe',
        scoreDetails: { systemName: 'Periorbital Cellulitis', totalScore: 10, maxScore: 10, interpretation: 'Orbital cellulitis — Emergency' },
        details,
      };
    }

    // Cannot cooperate → cannot exclude orbital involvement
    if (!canCoop && data.canCooperate !== undefined) {
      details.unshift('CANNOT COMPLETE EYE EXAMINATION — orbital cellulitis cannot be excluded. Treat as orbital cellulitis: CT orbits/sinuses + IV antibiotics + ophthalmology consult.');
      return {
        level: 'severe',
        scoreDetails: { systemName: 'Periorbital Cellulitis', totalScore: 8, maxScore: 10, interpretation: 'Incomplete exam — treat as orbital cellulitis' },
        details,
      };
    }

    // NF concern
    if (tenseBilat || tenseBilatHx) {
      details.unshift('TENSE OEDEMA + CREPITUS or BILATERAL INVOLVEMENT — necrotising fasciitis must be excluded. Immediate surgical and ophthalmology consult. CT soft tissue + orbits urgently.');
      return {
        level: 'severe',
        scoreDetails: { systemName: 'Periorbital Cellulitis', totalScore: 9, maxScore: 10, interpretation: 'Necrotising fasciitis concern — Surgical Emergency' },
        details,
      };
    }

    // ── MODERATE — admission required (preseptal confirmed) ───────────────
    let score = 0;
    if (ageM < 12 || infantHx)  { score += 3; details.push('Age < 1 year (+3) — admission mandatory: reliable exam is not possible and bacteraemic seeding is more common in infants.'); }
    if (isToxic)                 { score += 3; details.push('Ill/toxic appearance (+3) — systemic toxicity requires IV antibiotics and inpatient monitoring.'); }
    if (chemosis)                { score += 2; details.push('Chemosis (+2) — more commonly seen in orbital cellulitis; must be excluded with CT if uncertain.'); }
    if (failedOPD)               { score += 3; details.push('Failed outpatient antibiotics (+3) — worsening at 24 h or no improvement at 48 h mandates admission, IV antibiotics, and CT.'); }
    if (unimmunized)             { score += 1; details.push('Incomplete vaccination (+1) — blood culture indicated; elevated Hib disease risk.'); }
    if (sinusHx || data.sinusitisSource === true) { score += 1; details.push('Sinusitis source (+1) — ethmoid sinuses directly adjacent to orbit; early orbital extension may be radiographically subtle.'); }
    if (traumaHx || traumaSrc)   { details.push('Skin/trauma source — MRSA-active antibiotic coverage required. Do NOT use clindamycin.'); }
    if (dacryo)                  { details.push('Dacryocystitis — medial canthal swelling + mucopurulent discharge; ophthalmology referral for dacryocystorhinostomy if recurrent.'); }

    let level: SeverityLevel;
    let interpretation: string;

    if (score >= 3) {
      level = 'moderate';
      interpretation = 'Preseptal cellulitis — admission required';
      details.unshift('MODERATE RISK — preseptal cellulitis with indication(s) for admission. No orbital signs present, but inpatient management is required based on age, appearance, or failure of outpatient therapy.');
    } else {
      level = 'mild';
      interpretation = 'Uncomplicated preseptal cellulitis — outpatient eligible';
      details.unshift('LOW RISK — preseptal cellulitis without orbital signs, age > 1 year, and well-appearing. Outpatient oral antibiotics appropriate if reliable follow-up within 24 h can be ensured.');
    }

    return {
      level,
      scoreDetails: {
        systemName: 'Preseptal Cellulitis Severity',
        totalScore: score,
        maxScore: 9,
        interpretation,
        referenceTable: [
          { range: '0–2', meaning: 'Outpatient eligible (age > 1 year, well-appearing)' },
          { range: '3+',  meaning: 'Admission required' },
        ],
      },
      details,
    };
  },

  getInvestigations: (severity, data) => {
    const ageM       = Number(data.ageMonths) || 0;
    const isToxic    = data.appearance === 'ill';
    const fever      = isToxic;
    const orbital    = severity.level === 'severe';
    const failedOPD  = data.failed_outpatient === true;
    const unimmunized = data.unimmunized === true;
    const canCoop    = data.canCooperate !== false;
    const sinusHx    = data.sinusitis_hx === true || data.sinusitisSource === true;
    const dacryo     = data.dacryocystitis === true;
    const result: ErInvestigation[] = [];

    result.push({
      test: 'Complete eye examination — proptosis, extraocular movements, visual acuity, pupil reactions, chemosis',
      category: 'urgent',
      indication: 'Primary investigation. Perform under good light; compare both eyes simultaneously from above. Any restriction of EOM, proptosis, or visual change = orbital cellulitis.',
    });
    result.push({
      test: 'Mark the borders of eyelid erythema with a skin marker',
      category: 'urgent',
      indication: 'Documents baseline extent for objective monitoring at review. Spreading beyond the marked border = treatment failure → CT + IV antibiotics.',
    });

    if (orbital || !canCoop || severity.level === 'severe') {
      result.push({
        test: 'CT orbits and sinuses with IV contrast — URGENT',
        category: 'radiology',
        indication: 'Mandatory for any orbital sign or inability to complete the examination. Distinguishes preseptal from orbital cellulitis and identifies subperiosteal or orbital abscess.',
        criticalValue: 'Fat stranding of orbital contents + EOM thickening = orbital cellulitis → immediate ophthalmology + ENT',
      });
      result.push({
        test: 'Blood culture × 1 (before IV antibiotics)',
        category: 'blood',
        indication: 'Mandatory for orbital cellulitis or any uncertain case. Draw before first antibiotic dose.',
        criticalValue: 'Positive culture → target antibiotic therapy based on organism and susceptibilities',
      });
      result.push({
        test: 'CBC + CRP + blood gas',
        category: 'blood',
        indication: 'Baseline severity assessment for admitted or orbital cases.',
      });
    }

    if (severity.level === 'moderate') {
      if (ageM < 12 || data.infant === true) {
        result.push({ test: 'Blood culture × 1', category: 'blood', indication: 'Age < 1 year — bacteraemic preseptal cellulitis more common at this age. Draw before antibiotics.' });
        result.push({ test: 'CBC + CRP', category: 'blood', indication: 'Baseline for infant with periorbital cellulitis requiring admission.' });
      }
      if (isToxic || failedOPD) {
        result.push({ test: 'CT orbits and sinuses with IV contrast', category: 'radiology', indication: failedOPD ? 'Failed outpatient antibiotics — CT to exclude orbital extension.' : 'Toxic appearance with periorbital cellulitis — exclude orbital involvement.', criticalValue: 'Any orbital finding → ophthalmology + ENT immediately' });
        result.push({ test: 'Blood culture × 1 + CBC + CRP', category: 'blood', indication: 'Systemic markers and culture for admitted or toxic patients.' });
      }
      if (unimmunized) {
        result.push({ test: 'Blood culture × 1', category: 'blood', indication: 'Unimmunised child — Hib bacteraemia risk is elevated. Culture before antibiotics.' });
      }
    }

    if (sinusHx) {
      result.push({ test: 'CT sinuses (if not already ordered for orbital evaluation)', category: 'radiology', indication: 'Sinusitis as source — ethmoid sinusitis on CT increases concern for early orbital extension. Presence of sinusitis on CT does not by itself confirm orbital involvement, but mandates careful clinical monitoring.' });
    }

    if (dacryo) {
      result.push({ test: 'Aspirate fluctuant dacryocystitis abscess — Gram stain + aerobic culture', category: 'blood', indication: 'Pointing abscess over the lacrimal sac — aspirate under clean technique. S. aureus is the predominant pathogen; culture guides antibiotic de-escalation.' });
    }

    if (severity.level === 'mild') {
      result.push({ test: 'No routine blood tests or imaging required for uncomplicated preseptal cellulitis', category: 'other', indication: 'Blood cultures have extremely low yield in mild preseptal cellulitis. CT is not indicated without clinical signs of orbital involvement. Document eye examination findings clearly.' });
    }

    return result;
  },

  getManagement: (severity, data) => {
    const ageM       = Number(data.ageMonths) || 0;
    const isToxic    = data.appearance === 'ill';
    const traumaSrc  = data.traumaSource === true || data.trauma_source === true;
    const sinusSrc   = data.sinusitisSource === true || data.sinusitis_hx === true;
    const failedOPD  = data.failed_outpatient === true;
    const dacryo     = data.dacryocystitis === true;

    const clean = (arr: (string | false | undefined | null)[]): string[] => arr.filter(Boolean) as string[];

    if (severity.level === 'severe') {
      return [{
        title: 'STEP 1 — EMERGENCY: Orbital Cellulitis / Cannot Exclude Orbital Involvement',
        recommendations: clean([
          'Orbital cellulitis is an ophthalmological emergency — vision and life may be at risk.',
          'CALL OPHTHALMOLOGY + ENT NOW — simultaneous consultation required.',
          'IV access immediately.',
          'CT orbits and sinuses with IV contrast URGENTLY — identifies orbital vs. subperiosteal vs. orbital abscess.',
          'IV antibiotics — manage as per orbital cellulitis protocol until orbital involvement is confirmed or excluded.',
          'This protocol covers preseptal cellulitis ONLY — for management of confirmed orbital cellulitis, refer to the Orbital Cellulitis protocol.',
        ]),
      }, {
        title: 'STEP 2 — If CT Confirms Preseptal Only (No Orbital Extension)',
        recommendations: clean([
          'If CT confirms infection is ONLY anterior to the orbital septum (preseptal) with no orbital fat stranding or EOM oedema — step down to preseptal management.',
          'Reassess: age, appearance, and ability to cooperate for exam. If < 1 year or toxic → IV antibiotics inpatient.',
          'If ≥ 1 year, well-appearing, and reliable follow-up can be arranged → consider step-down to oral antibiotics with 24 h review.',
          'Ophthalmology must confirm the step-down decision.',
        ]),
      }];
    }

    if (severity.level === 'moderate') {
      return [{
        title: 'STEP 1 — Admission: Preseptal Cellulitis Requiring Inpatient Management',
        recommendations: clean([
          ageM < 12 ? 'Infant < 1 year — mandatory admission. Blood culture before antibiotics.' : '',
          isToxic ? 'Toxic appearance — IV antibiotics and close monitoring.' : '',
          failedOPD ? 'Failed outpatient antibiotics — IV antibiotics + CT orbits/sinuses to exclude orbital progression.' : '',
          'IV access + first dose of IV antibiotics (see Drugs tab).',
          'Ophthalmology consult: all admitted preseptal cellulitis patients should have an ophthalmology assessment.',
          'Re-examine eye every 4–6 h — any development of proptosis, restricted EOM, or vision change → escalate to orbital cellulitis pathway + CT immediately.',
          'Check skin marker borders at each examination.',
          dacryo ? 'Dacryocystitis: warm compresses + systemic antibiotics + ophthalmology referral for dacryocystorhinostomy if recurrent.' : '',
        ]),
      }, {
        title: 'STEP 2 — Monitoring and Step-Down',
        recommendations: clean([
          'Reassess after 24 h of IV antibiotics — if improving (reduced erythema/swelling, afebrile, well-appearing) → consider step-down to oral antibiotics.',
          'If improving AND ≥ 1 year AND well-appearing after 24–48 h IV treatment → oral antibiotics + discharge with 24 h follow-up.',
          'If not improving at 48 h → CT orbits + sinuses with contrast + ophthalmology review + reconsider antibiotic coverage.',
          'Duration: 5–7 days total (IV + oral combined). Continue until erythema and swelling resolved or nearly resolved.',
        ]),
      }];
    }

    // Mild — outpatient
    const source = traumaSrc ? 'trauma' : sinusSrc ? 'sinus' : 'unknown';
    return [{
      title: 'STEP 1 — Outpatient Management: Uncomplicated Preseptal Cellulitis',
      recommendations: clean([
        'Confirm no orbital signs on examination: proptosis absent, full painless EOM, normal visual acuity, no chemosis.',
        'Mark the borders of eyelid erythema with a skin marker before discharge.',
        source === 'trauma'
          ? 'Trauma source (skin/insect/animal bite) → MRSA-active oral antibiotics required (see Drugs tab). Do NOT use clindamycin — substantial resistance in both MRSA and MSSA.'
          : source === 'sinus'
          ? 'Sinusitis source → Amoxicillin-clavulanate monotherapy. No MRSA coverage required.'
          : 'Source unclear → treat based on local epidemiology; use Amoxicillin-clavulanate unless trauma is suspected (see Drugs tab for trauma-source options).',
        'Duration: 5–7 days. Continue until erythema and swelling fully or nearly resolved — do not stop early.',
        'Warm compresses to eyelid for comfort.',
        'Topical antibiotics have NO role in preseptal cellulitis — do not prescribe.',
        'Follow-up in 24 h — earlier if any concern arises.',
      ]),
    }, {
      title: 'STEP 2 — Response to Therapy',
      recommendations: clean([
        'At 24 h follow-up: erythema and swelling should be the same or improving. Mark-to-mark comparison is the most reliable clinical endpoint.',
        'If WORSENING at 24 h → admit for IV antibiotics + CT orbits and sinuses + ophthalmology consult.',
        'If no improvement at 48 h → admit for IV antibiotics + CT orbits and sinuses + ophthalmology consult.',
        'If improving at 24–48 h → continue oral antibiotics to complete 5–7 days.',
        traumaSrc ? 'If trauma source: if no improvement, add/switch to a regimen with confirmed MRSA coverage.' : '',
        'Recurrent preseptal cellulitis (≥ 3 episodes/year) → investigate for underlying cause: chronic sinusitis, environmental allergies, anatomic ethmoid abnormality, herpes simplex, or contact dermatitis.',
      ]),
    }];
  },

  getDisposition: (severity, data) => {
    const ageM      = Number(data.ageMonths) || 0;
    const failedOPD = data.failed_outpatient === true;

    if (severity.level === 'severe') {
      return ['ADMIT — orbital cellulitis or uncertain orbital involvement. Ophthalmology + ENT at bedside. IV antibiotics. CT orbits/sinuses with contrast urgently.'];
    }
    if (severity.level === 'moderate') {
      if (ageM < 12 || data.infant === true) return ['ADMIT — infant < 1 year: IV antibiotics, ophthalmology consult, blood culture before antibiotics.'];
      if (failedOPD) return ['ADMIT — failed outpatient antibiotics: IV antibiotics + CT orbits/sinuses + ophthalmology review.'];
      return ['ADMIT — preseptal cellulitis with systemic toxicity or inability to complete examination. IV antibiotics + ophthalmology consult.'];
    }
    return ['DISCHARGE on oral antibiotics — well-appearing, age ≥ 1 year, full eye examination normal, eyelid borders marked. Confirmed 24 h follow-up mandatory. Clear return precautions given.'];
  },

  getRedFlags: () => [
    'Proptosis (bulging eye) — orbital cellulitis until proven otherwise',
    'Pain with eye movements — extraocular muscle inflammation = orbital involvement',
    'Restricted or asymmetric extraocular movements — ophthalmoplegia',
    'Visual change, blurring, or diplopia — possible optic nerve compression',
    'Tense eyelid oedema + crepitus on palpation — necrotising fasciitis',
    'Bilateral eyelid involvement — atypical; suggests sinusitis-driven orbital disease',
    'Worsening at 24 h or no improvement at 48 h on oral antibiotics',
    'Age < 1 year with any periorbital swelling — mandatory admission',
    'Chemosis (conjunctival swelling) — more commonly associated with orbital cellulitis',
  ],

  getDrugDoses: (severity, data) => {
    const wt        = Number(data.weight) || 0;
    const ageM      = Number(data.ageMonths) || 0;
    const traumaSrc = data.traumaSource === true || data.trauma_source === true;
    const doses: DrugDose[] = [];

    if (wt <= 0) {
      doses.push({ drugName: 'Enter weight above', dose: 'Weight required to calculate doses.' });
      return doses;
    }

    // ── OUTPATIENT / ORAL ANTIBIOTICS ─────────────────────────────────────

    if (!traumaSrc) {
      // No trauma — sinusitis/respiratory source → Amoxicillin-clavulanate monotherapy
      const amoxClavStd  = Math.min(22.5 * wt, 875).toFixed(0);   // 45 mg/kg/day ÷ 2
      const amoxClavHigh = Math.min(45 * wt, 875).toFixed(0);      // 90 mg/kg/day ÷ 2
      doses.push({
        drugName: 'Amoxicillin-Clavulanate (PO) — sinusitis/no-trauma source · FIRST LINE',
        dose: `${amoxClavStd} mg (22.5 mg/kg/dose, i.e. 45 mg/kg/day) PO every 12 h × 5–7 days`,
        notes: `High-dose option if penicillin-resistant S. pneumoniae is a concern: ${amoxClavHigh} mg (45 mg/kg/dose, i.e. 90 mg/kg/day) PO q12h. Use 600 mg/5 mL suspension for high-dose paediatric dosing. Max 875 mg/dose. Do NOT use clindamycin — substantial MRSA and MSSA resistance makes it unreliable for this indication.`,
      });

      // Alternatives for penicillin allergy (non-severe)
      const cefpodMg  = Math.min(5 * wt, 200).toFixed(0);    // 10 mg/kg/day ÷ 2
      const cefurMg   = Math.min(12.5 * wt, 500).toFixed(0); // 25 mg/kg/day ÷ 2
      const cefdinMg  = Math.min(7 * wt, 300).toFixed(0);    // 14 mg/kg/day ÷ 2
      doses.push({
        drugName: 'Cefpodoxime (PO) — penicillin allergy alternative (non-severe)',
        dose: ageM < 144
          ? `${cefpodMg} mg (5 mg/kg/dose, i.e. 10 mg/kg/day) PO every 12 h × 5–7 days (max 200 mg/dose)`
          : '400 mg PO every 12 h × 5–7 days',
        notes: 'For non-severe penicillin allergy. Covers S. pneumoniae, H. influenzae, M. catarrhalis.',
      });
      doses.push({
        drugName: 'Cefuroxime (PO) — penicillin allergy alternative (non-severe)',
        dose: `${cefurMg} mg (approx 12.5 mg/kg/dose, i.e. 25 mg/kg/day) PO every 12 h × 5–7 days (max 500 mg/dose, 1000 mg/day)`,
        notes: 'Alternative for non-severe penicillin allergy.',
      });
      doses.push({
        drugName: 'Cefdinir (PO) — penicillin allergy alternative (non-severe)',
        dose: `${cefdinMg} mg (7 mg/kg/dose, i.e. 14 mg/kg/day) PO every 12 h × 5–7 days (max 300 mg/dose, 600 mg/day)`,
        notes: 'Convenient once- or twice-daily dosing. Covers S. pneumoniae, H. influenzae.',
      });

      // Severe penicillin allergy → levofloxacin
      const levofMg = Math.min(15 * wt, 500).toFixed(0); // 10-20 mg/kg/day, typically 15 mg/kg/day
      doses.push({
        drugName: 'Levofloxacin (PO) — severe penicillin allergy (IgE-mediated / anaphylaxis)',
        dose: `${levofMg} mg (approx 15 mg/kg/day) PO once daily × 5–7 days (max 500 mg/day)`,
        notes: 'Reserve for life-threatening penicillin allergy. Broad-spectrum respiratory quinolone. Not first-line due to concerns about cartilage toxicity in children, but appropriate for this indication when alternatives are contraindicated.',
      });
    } else {
      // TRAUMA source — MRSA-active therapy required
      // Option 1: Linezolid monotherapy
      const linezolidMg = ageM < 60
        ? `${Math.min(10 * wt, 600).toFixed(0)} mg (10 mg/kg/dose) PO every 8 h`    // < 5 years: q8h
        : ageM < 132
        ? `${Math.min(10 * wt, 600).toFixed(0)} mg (10 mg/kg/dose) PO every 12 h`   // 5–11 years: q12h
        : '600 mg PO every 12 h';                                                       // ≥ 12 years
      doses.push({
        drugName: 'Linezolid (PO) — trauma/skin source, MRSA-active · OPTION 1',
        dose: linezolidMg + ' × 5–7 days',
        notes: 'Covers MRSA + S. pyogenes + S. pneumoniae. Monotherapy — no need to add a second agent when using Linezolid. Expensive; reserve when TMP-SMX + beta-lactam combination is not feasible.',
      });

      // Option 2: TMP-SMX + beta-lactam (MRSA + streptococcal cover)
      const tmpSmxMg = Math.min(6 * wt, 320).toFixed(0);  // 8-12 mg/kg/day TMP ÷ 2, using 6 mg/kg/dose as midpoint
      const amoxClavCombo = Math.min(45 * wt, 875).toFixed(0); // 90 mg/kg/day ÷ 2 for combo

      doses.push({
        drugName: 'TMP-SMX (PO) — MRSA component of trauma-source regimen · OPTION 2 (PART A)',
        dose: `${tmpSmxMg} mg TMP component (6 mg/kg/dose TMP, i.e. 8–12 mg/kg/day TMP) PO every 12 h × 5–7 days`,
        notes: 'Covers CA-MRSA. Must be combined with a beta-lactam (Part B below) to cover GAS and H. influenzae — TMP-SMX does NOT reliably cover S. pyogenes.',
      });
      doses.push({
        drugName: 'ADD one of the following (PART B) — GAS + H. influenzae cover:',
        dose: `Amoxicillin-Clavulanate ${amoxClavCombo} mg (45 mg/kg/dose, 90 mg/kg/day) PO q12h`,
        notes: `Alternatives to Amoxicillin-clavulanate: Cefpodoxime 5 mg/kg/dose q12h; Cefuroxime 12.5 mg/kg/dose q12h; or Cefdinir 7 mg/kg/dose q12h. Do NOT use clindamycin — substantial resistance in MRSA AND MSSA.`,
      });
    }

    // ── IV ANTIBIOTICS (inpatient / moderate-severe) ──────────────────────
    const ceftriaxMg = Math.min(50 * wt, 2000).toFixed(0);
    const vancMg     = Math.min(15 * wt, 750).toFixed(0);
    const ampSulbMg  = Math.min(50 * wt, 3000).toFixed(0); // ampicillin component 200 mg/kg/day ÷ 4 = 50 mg/kg/dose q6h

    doses.push({
      drugName: 'Ceftriaxone (IV) — admitted preseptal cellulitis (sinusitis/no-trauma source)',
      dose: `${ceftriaxMg} mg (50 mg/kg, max 2 g) IV once daily`,
      notes: 'First-line IV antibiotic for admitted preseptal cellulitis without orbital involvement when source is sinusitis or URTI. Step down to oral amoxicillin-clavulanate when improving.',
    });
    doses.push({
      drugName: 'Ampicillin-Sulbactam (IV) — admitted preseptal cellulitis (broad spectrum)',
      dose: `${ampSulbMg} mg ampicillin component (50 mg/kg/dose ampicillin, max 3 g/dose combined) IV every 6 h`,
      notes: 'Alternative to ceftriaxone for admitted cases; covers S. aureus, streptococci, and anaerobes. Use when trauma source is suspected in an admitted patient.',
    });
    doses.push({
      drugName: 'Vancomycin (IV) — ADD for suspected MRSA or orbital cellulitis pending CT',
      dose: `${vancMg} mg (15 mg/kg/dose, max 750 mg/dose) IV every 6 h`,
      notes: 'Add to ceftriaxone or ampicillin-sulbactam when: trauma source + severe disease, MRSA suspicion, or orbital cellulitis not yet excluded. Monitor vancomycin levels.',
    });

    // Paracetamol for pain/fever
    const paracMg = (15 * wt).toFixed(0);
    doses.push({
      drugName: 'Paracetamol (Acetaminophen) — PO / PR',
      dose: `${paracMg} mg (15 mg/kg) every 4–6 h as needed`,
      notes: 'For fever and eyelid pain. Ibuprofen 10 mg/kg q6-8h (if ≥ 6 months and not dehydrated) is an appropriate alternative.',
    });

    return doses;
  },

  getReferences: () => [
    { title: 'Durand ML. Periocular infections. In: Principles and Practice of Infectious Diseases, 9th ed. Bennett JE, Dolin R, Blaser MJ (Eds), Elsevier 2019', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
    { title: 'Botting AM, McIntosh D, Mahadevan M. Paediatric pre- and post-septal peri-orbital infections are different diseases. Int J Pediatr Otorhinolaryngol 2008;72:377', url: 'https://pubmed.ncbi.nlm.nih.gov/18191244/' },
    { title: 'Ambati BK et al. Periorbital and orbital cellulitis before and after the advent of Hib vaccination. Ophthalmology 2000;107:1450', url: 'https://pubmed.ncbi.nlm.nih.gov/10919885/' },
    { title: 'Chaudhry IA et al. Inpatient preseptal cellulitis: experience from a tertiary eye care centre. Br J Ophthalmol 2008;92:1337', url: 'https://pubmed.ncbi.nlm.nih.gov/18523085/' },
    { title: 'Howe L, Jones NS. Guidelines for the management of periorbital cellulitis/abscess. Clin Otolaryngol 2004;29:725', url: 'https://pubmed.ncbi.nlm.nih.gov/15533167/' },
    { title: 'Stevens DL et al. IDSA Practice guidelines for diagnosis and management of skin and soft tissue infections: 2014 update. Clin Infect Dis 2014;59:e10', url: 'https://pubmed.ncbi.nlm.nih.gov/24973422/' },
    { title: 'Sorin A, April MM, Ward RF. Recurrent periorbital cellulitis: an unusual clinical entity. Otolaryngol Head Neck Surg 2006;134:153', url: 'https://pubmed.ncbi.nlm.nih.gov/16399194/' },
  ],
};
