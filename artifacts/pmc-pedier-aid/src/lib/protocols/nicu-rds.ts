import type { DiseaseProtocol, FormData, Severity, SeverityLevel } from './types';

/**
 * NICU — Respiratory Distress Syndrome (RDS)
 * Comprehensive Master Management Pathway for physicians.
 * Based on: European Consensus Guidelines on RDS (Sweet et al. 2023, Neonatology)
 * and Infasurf (calfactant) prescribing information.
 * Verify all doses and thresholds against local NICU policy.
 */
export const nicuRdsProtocol: DiseaseProtocol = {
  id: 'nicu-rds',
  name: 'Respiratory Distress Syndrome (RDS)',
  system: 'Respiratory',
  unit: 'nicu',
  category: 'general',
  lastUpdated: 'June 2026',
  description:
    'Surfactant-deficiency lung disease of the preterm newborn — golden-hour stabilisation, early CPAP, LISA/MIST surfactant, lung-protective ventilation, and complication surveillance.',
  image: { url: '', hint: '' },
  questions: [],

  mmpData: {
    snapshot:
      'RDS = primary surfactant deficiency in the immature preterm lung, compounded by structural immaturity and impaired fluid clearance. The modern paradigm is: keep the baby on its OWN lungs. Start CPAP in the delivery room, avoid intubation unless CPAP fails, give Calfactant (Infasurf) early via LISA/MIST in the spontaneously breathing infant. Permissive hypercapnia (PaCO₂ 45–60, pH ≥ 7.22), SpO₂ 91–95%, and FiO₂ ≤ 0.40 are your targets. Caffeine from day 1. Empiric ampicillin + gentamicin until sepsis excluded — RDS and congenital pneumonia are clinically indistinguishable. Watch for: air leak, haemodynamically significant PDA, IVH, and early feeding intolerance.',

    stages: [
      // ══════════════════════════════════════════════════════════════════
      // STAGE 1 — RECOGNITION & GOLDEN HOUR
      // ══════════════════════════════════════════════════════════════════
      {
        label: 'Stage 1: Recognition & Golden-Hour Stabilisation',
        shortLabel: 'Golden Hour',
        color: 'red',
        cards: [
          {
            title: 'Recognise RDS',
            isCritical: true,
            calculator: { id: 'silverman-score', title: 'Silverman-Andersen Retraction Score' },
            orders: [
              'Clinical diagnosis: onset of respiratory distress at birth or within the first 4 hours — tachypnoea (RR > 60), grunting, nasal flaring, intercostal/subcostal retractions, cyanosis in air.',
              'Score severity with the Silverman-Andersen Retraction Score (open calculator below): 0 = none, 1–3 = mild, 4–6 = moderate, 7–10 = severe / impending failure.',
              'CXR findings: bilateral ground-glass / reticulogranular opacification, low lung volumes, air bronchograms. Classically worse in more preterm infants. May be normal if given early CPAP.',
              'Blood gas (capillary or arterial): assess pH, PaCO₂, and oxygenation — PaO₂ target 50–80 mmHg (6.7–10.6 kPa); accept PaCO₂ 45–60 mmHg if pH ≥ 7.22.',
              'Mandatory differentials (manage in parallel — do not delay treatment waiting for exclusion): congenital pneumonia / EOS (clinically identical → cultures + antibiotics NOW), TTN (self-limiting, no surfactant needed, usually term/late-preterm), MAS (post-dates/meconium-stained, different CXR), pneumothorax (asymmetric, sudden deterioration), PPHN (cyanosis disproportionate to lung disease), cyanotic CHD (unresponsive to oxygen).',
            ],
            nursing: [
              'Continuous pre-ductal SpO₂ monitoring from birth (right hand or wrist)',
              'Cardiorespiratory monitoring — HR, RR, SpO₂ every 15 min initially',
              'Thermoregulation: servo-controlled incubator at 36.5–37.5°C; 80–85% humidity for ELBW',
              'Glucose check within 30 min of admission — target 47–100 mg/dL',
            ],
            triggers: [
              'Apnoea or inadequate respiratory effort → immediate positive pressure ventilation',
              'SpO₂ < 85% despite CPAP and FiO₂ 0.40 → escalate urgently',
              'Asymmetric chest expansion + sudden deterioration → pneumothorax (transilluminate / CXR / drain)',
              'SpO₂ not responding to O₂ → consider cyanotic CHD (hyperoxia test / echo)',
            ],
          },
          {
            title: 'Delivery Room & Golden-Hour Actions',
            isCritical: true,
            orders: [
              'DELAYED CORD CLAMPING (DCC): ≥ 60 seconds in stable infants < 34 weeks (reduces IVH, necrotising enterocolitis, blood transfusion requirement). If infant needs immediate resuscitation, clamp and proceed.',
              'TEMPERATURE: wrap immediately in polyethylene bag from neck down (< 28 weeks); warm humidified gases; keep delivery room at 26°C. Target admission temp 36.5–37.5°C.',
              'AIRWAY: position with sniffing posture on a warmed flat surface. Stimulate if needed (rub back, flick soles). If no adequate breathing effort: start CPAP (not intubation as first step).',
              'CPAP FROM BIRTH: apply short binasal prongs or mask — CPAP 6 cmH₂O — for all preterm infants < 32 weeks, even if breathing well. Do not wait for distress to develop.',
              'FiO₂ TITRATION TARGETS (room air = 0.21): 1 min → SpO₂ 60–65%; 3 min → 70–75%; 5 min → 80–85%; 10 min → 90–95%. Do NOT start at 100% O₂ in preterm infants.',
              'GLUCOSE: 10% dextrose at 60–80 mL/kg/day IV from admission if < 30 weeks or any risk of hypoglycaemia.',
              'VASCULAR ACCESS: UVC (3.5–5 Fr) preferred — confirm position at hepatic/RA junction. UAC for continuous BP monitoring if < 27 weeks or haemodynamically unstable.',
              'ANTENATAL STEROIDS: confirm received (betamethasone 2 × 12 mg IM ≥ 24h prior). If not given, document — does not change acute management but affects surfactant response and prognosis.',
            ],
            nursing: [
              'Pulse oximetry probe on right hand within 60 seconds of birth',
              'Polyethylene bag immediately — leave face exposed; attach SpO₂ probe through opening',
              'Warm humidified CPAP circuit ready before delivery',
              'UVC/UAC trolley ready for admission',
              'Admission temperature documented within 30 min',
            ],
            triggers: [
              'No spontaneous breathing at 30 s and/or HR < 100 → PPV via T-piece resuscitator at PIP 20–25 cmH₂O, PEEP 5 cmH₂O',
              'HR < 60 after 30 s of effective PPV → chest compressions + escalate FiO₂ to 1.0 temporarily',
              'Admission temperature < 36.0°C → active rewarming, document, audit',
            ],
          },
        ],
      },

      // ══════════════════════════════════════════════════════════════════
      // STAGE 2 — CPAP & SURFACTANT DECISION
      // ══════════════════════════════════════════════════════════════════
      {
        label: 'Stage 2: CPAP Setup & Surfactant Decision',
        shortLabel: 'CPAP + Decision',
        color: 'amber',
        cards: [
          {
            title: 'CPAP Initiation & Titration',
            isCritical: true,
            orders: [
              'INTERFACE: short binasal prongs (preferred) > nasal mask > nasopharyngeal tube. Ensure correct prong size — prongs should sit just inside nares without blanching.',
              'STARTING PRESSURE: 6 cmH₂O. Titrate up in 1 cmH₂O steps to maximum 10 cmH₂O guided by work of breathing, SpO₂, and blood gas.',
              'FiO₂: start at 0.30 for very preterm. Titrate to keep SpO₂ 91–95%. Alarm limits: SpO₂ lower 90%, upper 95%.',
              'BLOOD GAS TARGETS on CPAP: SpO₂ 91–95% | PaO₂ 50–80 mmHg | PaCO₂ 45–60 mmHg (permissive) | pH ≥ 7.22. Obtain capillary/arterial gas at 30–60 min post-stabilisation.',
              'GASTRIC DECOMPRESSION: pass 8Fr OGT and leave on free drainage while on CPAP — prevents abdominal distension from swallowed air.',
              'POSITIONING: prone or lateral positioning on CPAP improves oxygenation and reduces apnea — use when practical and infant is monitored.',
            ],
            nursing: [
              'Prong size check every shift — too small = leak, too large = alar blanching / NAI',
              'Mouth care every 4 h; suction only if secretions audible (avoid stimulating apnoea)',
              'CPAP circuit humidifier water level check every shift',
              'OGT free drainage — aspirate before feeds; document aspirate character',
            ],
            triggers: [
              'FiO₂ > 0.30 on CPAP ≥ 5 cmH₂O → surfactant criteria met (see Stage 2 Card 2)',
              'FiO₂ > 0.50 on CPAP ≥ 8 cmH₂O → CPAP failure → intubate',
              'Frequent apnoea (> 3 events/h requiring stimulation) or apnoea requiring PPV → CPAP failure → intubate',
              'pH < 7.20 or PaCO₂ > 65 mmHg → CPAP failure → intubate',
            ],
          },
          {
            title: 'Surfactant Criteria & Route Selection',
            isCritical: true,
            orders: [
              'SURFACTANT CRITERIA — give surfactant when ANY of the following on CPAP ≥ 5 cmH₂O: (1) FiO₂ > 0.30 in infants < 32 weeks GA; (2) FiO₂ > 0.40 in infants 32–36 weeks; (3) Increasing work of breathing / Silverman score ≥ 5; (4) Deteriorating blood gas — pH < 7.25 or PaCO₂ > 60 mmHg.',
              'EARLIER IS BETTER: do not wait for FiO₂ to climb further. The purpose of CPAP is to defer intubation, not to defer surfactant.',
              'ROUTE — LISA/MIST (preferred if spontaneously breathing on CPAP): avoids intubation, less ventilator-induced lung injury, better BPD outcomes. Use in any infant breathing spontaneously on CPAP.',
              'ROUTE — INSURE (Intubate–Surfactant–Extubate): if LISA/MIST not available or infant not breathing well enough. Intubate, give surfactant, extubate to CPAP within 30–60 min.',
              'ROUTE — via ETT: if infant already intubated — give as soon as intubation confirmed.',
              'REPEAT DOSES: give up to 3 doses of Calfactant (Infasurf) total, each ≥ 12 h apart, if FiO₂ remains > 0.30 on CPAP.',
            ],
            nursing: [
              'Prepare surfactant vial: remove from refrigerator ≥ 30 min before use — warm to room temperature passively (no warmer device)',
              'Gently swirl vial for 30 seconds before drawing up — do NOT shake',
              'Have T-piece resuscitator and intubation equipment at bedside before LISA/MIST attempt',
              'Monitor SpO₂ and HR throughout instillation — record any bradycardia/desaturation',
            ],
            triggers: [
              'Bradycardia (HR < 100) during surfactant → pause instillation, provide PPV if needed, resume when stable',
              'Post-surfactant: rapid FiO₂ decrease > 0.10 within 15 min → wean FiO₂ immediately to avoid hyperoxia',
              'No improvement in FiO₂ at 2 h post-surfactant → repeat dose criteria met',
            ],
          },
        ],
      },

      // ══════════════════════════════════════════════════════════════════
      // STAGE 3 — SURFACTANT ADMINISTRATION & ADJUNCTS
      // ══════════════════════════════════════════════════════════════════
      {
        label: 'Stage 3: Surfactant Administration & Adjuncts',
        shortLabel: 'Surfactant',
        color: 'indigo',
        cards: [
          {
            title: 'Calfactant (Infasurf) — LISA/MIST Technique',
            isCritical: true,
            orders: [
              'DOSE: Calfactant (Infasurf) 3 mL/kg intratracheal (= 105 mg phospholipids/kg). Up to 3 doses total, each ≥ 12 h apart.',
              'PRE-MEDICATION (LISA/MIST): sucrose 24% 0.5 mL PO 2 min before ± fentanyl 1–2 mcg/kg slow IV (optional, use only if locally agreed — avoids laryngospasm without causing apnea). Do NOT use propofol or suxamethonium for LISA.',
              'STEP 1: With infant on CPAP (prongs in situ), perform direct laryngoscopy. Visualise vocal cords.',
              'STEP 2: Insert a thin, flexible catheter (16G suction catheter or dedicated LISA catheter) through the vocal cords, to a depth of 1.5–2.0 cm below the cords. Do NOT advance too far (risk of lobar instillation).',
              'STEP 3: Withdraw the laryngoscope carefully while keeping the catheter in position. Resume CPAP via prongs — the catheter passes alongside the nasal prong.',
              'STEP 4: Instil surfactant SLOWLY over 2–3 minutes. The infant should be breathing spontaneously and CPAP is maintained throughout. Do not suspend CPAP.',
              'STEP 5: Remove the catheter on completion. Continue CPAP at same settings. Monitor for rapid compliance change (FiO₂ drop, improved chest movement).',
              'POST-DOSE: Wean FiO₂ to maintain SpO₂ 91–95% — anticipate significant FiO₂ reduction within 10–30 min. Do NOT suction ETT or airway for 1 h post-dose.',
              'INSURE ALTERNATIVE: Intubate with smallest appropriate ETT (check UVC/UAC position). Give 3 mL/kg Infasurf via ETT in 2 aliquots (1.5 mL/kg each), repositioning infant between aliquots (left side then right side). Extubate to CPAP within 30–60 min once stable.',
            ],
            nursing: [
              'SpO₂, HR, and RR continuous monitoring throughout instillation',
              'Document time of dose, volume given, infant response, and any interruptions',
              'CPAP settings and FiO₂ at 15 min, 30 min, 1 h post-dose',
              'No suctioning for 1 h after surfactant unless clinically essential',
            ],
            triggers: [
              'Desaturation < 80% or HR < 100 during LISA → pause, gentle PPV via prongs, resume when stable',
              'Unable to visualise cords after 2 attempts → abandon LISA → INSURE',
              'Rapid respiratory deterioration after surfactant → consider pneumothorax (surfactant can unmask existing air leak)',
            ],
          },
          {
            title: 'Caffeine, Antibiotics & First-Day Adjuncts',
            orders: [
              'CAFFEINE CITRATE (start day 1, before or alongside surfactant): Loading dose 20 mg/kg IV over 30 min, then 5–10 mg/kg/day maintenance starting 24 h after load. Caffeine reduces apnea, improves extubation success, reduces BPD (NNT 6), reduces CP (CAP trial). Continue until 34–36 weeks PMA and apnoea-free > 5 days.',
              'ANTIBIOTICS — empiric for EOS (start within 1 h if clinical concern): Ampicillin 50 mg/kg (interval by PMA) + Gentamicin (4–5 mg/kg by PMA, extended interval — see NeoDose). Re-evaluate at 36–48 h: stop if cultures negative and clinical picture inconsistent with sepsis.',
              'VITAMIN K₁: ensure given at birth — 1 mg IM (≥ 1.5 kg) or 0.5 mg IM (< 1.5 kg). Prevents haemorrhagic disease of the newborn including IVH.',
              'EYE PROPHYLAXIS: erythromycin eye drops per local protocol — prevent neonatal conjunctivitis.',
              'ANAEMIA CORRECTION: check haematocrit on admission. Transfuse if Hct < 35% in ventilated infants, < 30% in stable infants, or if haemodynamically compromised.',
            ],
            prescriptions: [
              {
                drug: 'Calfactant (Infasurf)',
                dose: '3 mL/kg per dose (= 105 mg phospholipids/kg)',
                route: 'Intratracheal (LISA/MIST or via ETT)',
                frequency: 'Up to 3 doses total, each ≥ 12 h apart',
                calculation: (w: number) => `${(3 * w).toFixed(1)} mL per dose (35 mg/mL); up to ${(9 * w).toFixed(1)} mL total (3 doses)`,
                notes: 'Gently swirl vial — do NOT shake. Passive warming to room temperature only. Wean FiO₂ promptly after dose.',
              },
              {
                drug: 'Caffeine citrate',
                dose: 'Load 20 mg/kg → Maintenance 5–10 mg/kg/day',
                route: 'IV over 30 min / PO (equivalent bioavailability)',
                frequency: 'Load once; maintenance q24h from 24 h after load',
                calculation: (w: number) => `Load: ${(20 * w).toFixed(0)} mg | Maintenance: ${(5 * w).toFixed(0)}–${(10 * w).toFixed(0)} mg/day`,
                notes: 'Caffeine CITRATE salt — base = half the mg. Continue to ~34–36 wks PMA.',
              },
              {
                drug: 'Ampicillin',
                dose: '50 mg/kg/dose (see PMA-based interval in NeoDose)',
                route: 'IV over 15–30 min',
                frequency: 'PMA-based: q12h (< 29 wks, PNA ≤ 28d) → q8h → q6h',
                calculation: (w: number) => `${(50 * w).toFixed(0)} mg per dose`,
                notes: 'Empiric EOS cover. Stop at 36–48 h if cultures negative and clinical picture clear.',
              },
              {
                drug: 'Gentamicin',
                dose: '4–5 mg/kg/dose (PMA-based, extended interval)',
                route: 'IV over 30 min',
                frequency: 'q24–48h depending on PMA (see NeoDose)',
                calculation: (w: number) => `${(4.5 * w).toFixed(2)} mg per dose (4.5 mg/kg — adjust per PMA in NeoDose)`,
                notes: 'Extended interval dosing. Monitor troughs before 3rd dose. Mandatory TDM.',
              },
            ],
            triggers: [
              'Caffeine toxicity: HR > 180 sustained, jitteriness → check level (target 8–20 mg/L)',
              'Cultures positive or CRP rising → continue / escalate antibiotics accordingly',
              'Blood glucose < 47 mg/dL → treat (see Hypoglycaemia protocol)',
            ],
          },
        ],
      },

      // ══════════════════════════════════════════════════════════════════
      // STAGE 4 — MECHANICAL VENTILATION
      // ══════════════════════════════════════════════════════════════════
      {
        label: 'Stage 4: Mechanical Ventilation (CPAP Failure)',
        shortLabel: 'Ventilation',
        color: 'red',
        cards: [
          {
            title: 'CPAP Failure Criteria & Intubation Decision',
            isCritical: true,
            orders: [
              'INTUBATE if ANY of the following on CPAP ≥ 8 cmH₂O: (1) FiO₂ > 0.50 to maintain SpO₂ 91–95%; (2) pH < 7.20 or PaCO₂ > 65 mmHg on blood gas; (3) Repeated apnoea requiring PPV (> 2 events unresponsive to caffeine); (4) Haemodynamic instability requiring vasopressor support; (5) Surgical emergency requiring general anaesthesia.',
              'PRE-INTUBATION: premedication is mandatory for non-emergency intubation — atropine 0.01 mg/kg IV (prevents bradycardia) + fentanyl 2–4 mcg/kg slow IV (analgesia) ± succinylcholine 2 mg/kg IV if difficult airway. Allow 3 min for effect.',
              'ETT SIZE: weight-based — < 1 kg: 2.5 mm; 1–2 kg: 3.0 mm; 2–3 kg: 3.0–3.5 mm. Uncuffed ETT for neonates.',
              'ETT DEPTH (cm at lip): weight (kg) + 6 (rough estimate). Confirm with CXR — tip should be at T2 level (between clavicles and carina).',
              'GIVE SURFACTANT via ETT immediately after intubation confirmed if not yet given, or if repeat dose criteria met.',
              'Continuous waveform capnography during intubation (ETCO₂ > 15 mmHg confirms tracheal placement).',
            ],
            nursing: [
              'Pre-draw: atropine + fentanyl ± suxamethonium; flush syringes labelled and ready',
              'Video laryngoscope (if available) preferred for ELBW — better first-pass success',
              'Two-person technique: one laryngoscopes, one manages CPAP circuit and ETT',
              'SpO₂ continuous — allow SpO₂ to pre-oxygenate to ≥ 90% on CPAP before attempting',
            ],
            triggers: [
              'Failed intubation after 2 attempts → call senior, maintain oxygenation via PPV/mask, escalate',
              'Right main bronchus intubation (asymmetric chest, left hypoinflation) → withdraw ETT 0.5 cm, recheck',
              'Oesophageal intubation (SpO₂ falling, no ETCO₂, gastric distension) → immediate removal + re-attempt',
            ],
          },
          {
            title: 'Initial Ventilator Settings & Gas Targets',
            isCritical: true,
            orders: [
              'MODE: Volume-targeted ventilation preferred (SIMV+VG or A/C+VG) — reduces mortality and BPD. If volume targeting not available, use SIMV with PIP titration.',
              'TIDAL VOLUME: 4–5 mL/kg (preterm). Start at 4 mL/kg for ELBW (< 1 kg). Displayed VT must account for circuit compliance — use ETT-referenced VT if available.',
              'PEEP: 5 cmH₂O (start). Increase to 6–7 cmH₂O if atelectasis on CXR or persistent oxygenation deficit. Do not exceed 7–8 cmH₂O — risk of overdistension / CO₂ retention.',
              'RESPIRATORY RATE: 40–60/min for RDS. Higher RR (50–60) reduces PIP needed for target VT in stiff lungs.',
              'INSPIRATORY TIME: 0.3–0.4 s. Shorter IT (0.25–0.3 s) for very preterm (< 28 weeks). Avoid long IT > 0.5 s (promotes air trapping, PIE).',
              'FiO₂: start at 0.40 and titrate to SpO₂ 91–95%. Alarm limits: SpO₂ lower 90%, upper 95%. AVOID FiO₂ 1.0 unless resuscitation — oxygen toxicity contributes to ROP and BPD.',
              'GAS TARGETS — measure blood gas at 30 min post-intubation then 4-hourly until stable: SpO₂ 91–95% | PaO₂ 50–80 mmHg | PaCO₂ 45–60 mmHg (PERMISSIVE HYPERCAPNIA) | pH ≥ 7.22 | Base excess -5 to +5.',
              'PEAK INSPIRATORY PRESSURE: aim PIP 14–20 cmH₂O in volume-targeted mode. If PIP > 25 cmH₂O needed to achieve VT 4 mL/kg → severe RDS → consider HFOV.',
              'MEAN AIRWAY PRESSURE: aim MAP 8–12 cmH₂O for conventional ventilation. Higher MAP → better oxygenation but risk of overdistension.',
            ],
            nursing: [
              'ETT position confirmation CXR within 30 min of intubation',
              'ETT security: tape firmly with hydrocoloid dressing; document cm at lip marking',
              'Capnography or TcCO₂ continuous where available',
              'Suction only when clinically indicated (not routine): increased secretions, desaturation, rising PIP',
            ],
            triggers: [
              'PaCO₂ < 35 mmHg → reduce RR or VT (hyperventilation → IVH, cerebral vasoconstriction)',
              'PIP consistently > 25 cmH₂O or MAP > 15 cmH₂O → consider HFOV',
              'Oxygenation Index (OI = MAP × FiO₂ × 100 / PaO₂) > 13 → escalate; OI > 20 → HFOV criteria',
              'Sudden deterioration: DOPES — Displaced ETT / Obstructed ETT / Pneumothorax / Equipment / Stomach',
            ],
          },
          {
            title: 'HFOV Escalation',
            orders: [
              'CONSIDER HFOV if ANY of the following: (1) OI > 13 on conventional ventilation; (2) PIP > 25 cmH₂O needed to maintain target VT; (3) MAP > 12–14 cmH₂O on conventional ventilation; (4) Air leak syndrome (PIE, pneumothorax — HFOV with lower MAP strategy); (5) Severe RDS with FiO₂ > 0.60 on conventional ventilation.',
              'HFOV INITIAL SETTINGS: MAP = conventional MAP + 2–3 cmH₂O (higher MAP strategy for RDS — recruit alveoli). Frequency: 10–15 Hz (lower Hz = more ΔP transmission = more effective CO₂ clearance). Amplitude (ΔP): start at MAP × 2 — titrate to visible chest wiggle from clavicles to upper thighs. FiO₂: carry over from conventional ventilation.',
              'CO₂ CONTROL on HFOV: increase amplitude to reduce PaCO₂; decrease amplitude to raise PaCO₂. Frequency: lower Hz = more CO₂ clearance (some use 8 Hz for severe hypercapnia in term infants).',
              'OXYGENATION on HFOV: increase MAP (in 1–2 cmH₂O steps) or increase FiO₂. Do not increase MAP above 20 cmH₂O without senior discussion.',
              'Obtain blood gas 30–60 min after switching to HFOV to confirm settings.',
            ],
            nursing: [
              'Chest wiggle visualisation — document level (clavicle to upper thigh is ideal)',
              'Suction HFOV circuit only when clinically indicated — brief disconnection method',
              'TcCO₂ continuous monitoring — essential on HFOV (frequent blood gas until stable)',
            ],
            triggers: [
              'No chest wiggle on HFOV → increase amplitude in 5 cmH₂O steps',
              'Worsening oxygenation on high MAP → consider iNO if PPHN component suspected',
              'Air leak worse on HFOV → reduce MAP by 1–2 cmH₂O, increase frequency',
            ],
          },
        ],
      },

      // ══════════════════════════════════════════════════════════════════
      // STAGE 5 — SUPPORTIVE CARE
      // ══════════════════════════════════════════════════════════════════
      {
        label: 'Stage 5: Supportive Care — Fluids, Nutrition & Complications',
        shortLabel: 'Supportive Care',
        color: 'amber',
        cards: [
          {
            title: 'Fluid Management & Nutrition',
            orders: [
              'FLUID RESTRICTION in first 3–5 days of life — RDS and surfactant use increase risk of pulmonary oedema and haemodynamically significant PDA with excessive fluids.',
              'FLUID TARGETS: Day 1: 60–80 mL/kg/day. Day 2: 80–100 mL/kg/day. Day 3–5: 100–120 mL/kg/day. Adjust upward for phototherapy (+ 10–20 mL/kg/day), radiant warmer (+ 20–30 mL/kg/day), and excessive weight loss (> 10% in term, > 15% in preterm by day 5). Adjust downward if oedematous, FiO₂ rising, or PDA suspected.',
              'GLUCOSE INFUSION RATE (GIR): start 6 mg/kg/min (= 10% dextrose at 60 mL/kg/day in 1 kg infant). Titrate to avoid hypoglycaemia (target BG 47–100 mg/dL). Increase to 8–10 mg/kg/min if hypoglycaemic. Reduce TPN glucose if BG > 180 mg/dL persistently.',
              'ELECTROLYTES: NO sodium in day 1 (avoid sodium chloride in first 48 h — allow physiological postnatal weight loss). Add sodium from day 2–3: 2–5 mmol/kg/day. Potassium: add from day 2 when urine output confirmed: 1–3 mmol/kg/day. Monitor daily electrolytes until stable.',
              'PARENTERAL NUTRITION (TPN): start within 4–6 h of admission for infants < 29 weeks or those unable to feed. Amino acids: 3–4 g/kg/day from day 1. Lipids (Intralipid 20%): 1 g/kg/day from day 1, increase by 0.5–1 g/kg/day to max 3.5 g/kg/day.',
              'ENTERAL NUTRITION: commence minimal enteral nutrition (MEN) as trophic feeds within 24–48 h if haemodynamically stable — preferably breast / donor human milk at 1–2 mL/kg/feed 3-hourly. Do NOT withhold feeds due to CPAP (CPAP is not a contraindication to feeding). Advance by 10–30 mL/kg/day depending on gestation.',
              'DAILY WEIGHT: weigh at the same time daily. Expect physiological weight loss of 5–10% by day 3–5, with nadir by day 5, then weight regain.',
            ],
            nursing: [
              'Strict fluid balance: document input (IV, TPN, feeds) and output (urine, stool, aspirates) every 4 h',
              'Daily weight at consistent time (before feed in the morning)',
              'Urine output target: 1–3 mL/kg/h. Alert if < 0.5 mL/kg/h × 2 h or > 6 mL/kg/h',
              'Blood glucose monitoring: q4h until stable on CPAP or q6–8h once TPN established',
            ],
            triggers: [
              'Weight loss > 15% (preterm) or > 10% (term) from birthweight by day 5 → increase fluids cautiously',
              'Urine output < 0.5 mL/kg/h × 2 h + oedema → review fluid balance; check renal function',
              'BG < 47 mg/dL → treat hypoglycaemia (dextrose 10% 2 mL/kg bolus + increase GIR)',
            ],
          },
          {
            title: 'Patent Ductus Arteriosus (PDA) Surveillance & Management',
            orders: [
              'SUSPICION: haemodynamically significant PDA (hsPDA) in preterm after 48–72 h — bounding pulses, wide pulse pressure (PP > 25 mmHg), hyperdynamic precordium, systolic murmur (left upper sternal edge), worsening FiO₂ requirement, enlarged heart on CXR, pulmonary plethora.',
              'ECHO: perform echocardiography at 48–72 h in all infants < 28 weeks, and in any infant with clinical signs of PDA regardless of gestation. Assess: ductal diameter, direction of shunt, left atrial-to-aortic root ratio (LA:Ao > 1.5 = significant), and ventricular function.',
              'CONSERVATIVE MANAGEMENT FIRST: fluid restriction (reduce to 120 mL/kg/day if on higher volumes); optimise CPAP to maintain lung volume; cautious diuresis (furosemide 1 mg/kg if pulmonary oedema).',
              'PHARMACOLOGICAL CLOSURE: indicated for hsPDA with haemodynamic compromise. Options: (1) Ibuprofen IV 10/5/5 mg/kg over 3 days (least renal side effects); (2) Indomethacin IV 0.1–0.2 mg/kg q12–24h × 3 doses (check PNA-based dosing in NeoDose); (3) Paracetamol IV 15 mg/kg q6h × 3–7 days (similar efficacy, better renal/platelet profile, use if NSAIDs contraindicated).',
              'CONTRAINDICATIONS to NSAIDs (ibuprofen/indomethacin): serum creatinine > 150 μmol/L, oliguria < 0.6 mL/kg/h, platelets < 60,000, active bleeding, NEC, IVH grade III–IV. → Use paracetamol instead.',
              'POST-TREATMENT ECHO: at 48 h after completion of pharmacological course. If duct still open and hsPDA criteria met → second course (same drug) or discuss surgical ligation with paediatric cardiology / cardiac surgery.',
            ],
            nursing: [
              'Pulse character assessment each assessment — document bounding vs. normal',
              'Pulse pressure monitoring if arterial line in situ — alert if PP > 20 mmHg',
              'Urine output closely monitored during NSAID/paracetamol course',
              'Hold feed for 30 min before each NSAID dose (reduce mesenteric blood flow risk)',
            ],
            triggers: [
              'Acute haemodynamic compromise (systolic BP < MAP target for gestation) → urgent echo + escalate',
              'NEC signs during treatment → stop NSAIDs immediately',
              'No response after 2 pharmacological courses → cardiology / surgical ligation discussion',
            ],
          },
          {
            title: 'IVH Prevention & Neurological Protection',
            orders: [
              'MINIMAL STIMULATION PROTOCOL: cluster cares to limit handling. Avoid noise, bright lights. Use cot covers / eye shields. Inform parents of developmental care rationale.',
              'POSITIONING: midline head position (avoid head rotation > 45° — impairs cerebral venous drainage → IVH risk). Elevate head of bed 15–30° if stable.',
              'HAEMODYNAMIC STABILITY: avoid rapid fluid boluses (> 10 mL/kg over < 30 min). Treat hypotension gently (10 mL/kg NaCl 0.9% over 30 min, then consider vasopressor). Rapid shifts in blood pressure → germinal matrix rupture → IVH.',
              'AVOID HYPOCAPNIA: PaCO₂ < 35 mmHg causes cerebral vasoconstriction → periventricular ischaemia → PVL. Monitor blood gas regularly; permissive hypercapnia is neuroprotective.',
              'AVOID HYPO/HYPERGLYCAEMIA: hypoglycaemia → neuronal death; hyperglycaemia → osmotic disequilibrium. Target BG 47–100 mg/dL.',
              'ANTENATAL MgSO₄ (exposure at < 30 weeks): ask mother / obstetric notes — reduces CP/motor disability if given. Does not alter acute management.',
              'CRANIAL ULTRASOUND: Day 1–3 (within 12 h of birth for < 28 weeks), Day 7–10, at 36 weeks PMA. IVH grading (Papile I–IV): Grade I = subependymal; II = into ventricle without dilatation; III = with ventricular dilatation; IV = parenchymal.',
              'PHVD: if IVH with progressive ventricular dilatation → weekly cranial US, neurology / neurosurgery review, consider ventricular access device if rapidly progressive.',
            ],
            nursing: [
              'Head position check every care episode — document midline / neutral',
              'Blood pressure monitoring q1–2h in unstable infants; alert if MAP falls below GA in weeks (e.g. MAP 26 in 26-weeker)',
              'Document all blood gas results and corresponding ventilator settings',
              'Scheduled quiet times — reduce alarm volumes; limit unnecessary entering of cot space',
            ],
            triggers: [
              'MAP < GA (weeks) in mmHg → treatment threshold for hypotension (volume → dopamine)',
              'PaCO₂ < 35 mmHg → reduce ventilation (decrease RR or VT)',
              'New seizure activity (abnormal movements, cycling, tonic posturing) → urgent EEG / aEEG + blood gas + glucose',
            ],
          },
        ],
      },

      // ══════════════════════════════════════════════════════════════════
      // STAGE 6 — WEANING & LONG-TERM COMPLICATIONS
      // ══════════════════════════════════════════════════════════════════
      {
        label: 'Stage 6: Weaning Respiratory Support & Complication Surveillance',
        shortLabel: 'Weaning',
        color: 'emerald',
        cards: [
          {
            title: 'Extubation Readiness & Weaning Respiratory Support',
            orders: [
              'EXTUBATION CRITERIA (all must be met): (1) FiO₂ ≤ 0.30 on conventional ventilation; (2) MAP ≤ 8–10 cmH₂O (or PIP ≤ 18 cmH₂O, PEEP 5); (3) Adequate spontaneous respiratory effort (synchrony with ventilator, reasonable minute ventilation contribution); (4) Blood gas adequate at current settings; (5) Caffeine on board; (6) Haemodynamically stable; (7) No major surgical issue pending.',
              'EXTUBATION DESTINATION: extubate directly to CPAP (6–8 cmH₂O) or NIPPV (bilevel non-invasive pressure support — PIP 14–18 / PEEP 6 cmH₂O). NIPPV is superior to CPAP alone for preventing re-intubation in the first 72 h post-extubation.',
              'CPAP WEANING: once on CPAP and FiO₂ ≤ 0.25 with SpO₂ 91–95%, attempt CPAP pressure weaning from 6 → 5 cmH₂O. Do not hurry — most preterm infants < 28 weeks will need CPAP for weeks.',
              'FLOW NASAL CANNULA (HFNC): transition from CPAP to HFNC (2–6 L/min) once on CPAP 5 cmH₂O and FiO₂ ≤ 0.25. HFNC does not provide set PEEP — ensure infant coping before transition.',
              'CAFFEINE: continue until 34–36 weeks PMA and apnoea-free for ≥ 5 consecutive days. Monitor HR (tachycardia: hold if HR > 180 sustained).',
              'ANTIBIOTICS: review at 36–48 h. If cultures negative, CRP normal / trending down, and clinical picture consistent with RDS not sepsis → STOP antibiotics. Do not complete arbitrary 5–7-day courses without evidence of infection.',
            ],
            nursing: [
              'Pre-extubation checklist: caffeine on board (check last dose time), CPAP circuit assembled and tested, suction ready, nurse present at bedside for 30 min post-extubation',
              'Post-extubation: SpO₂ and HR continuous for 4 h; document work of breathing at 15 min, 30 min, 1 h, 2 h, 4 h post-extubation',
              'Re-intubation criteria: FiO₂ > 0.50, pH < 7.20, apnoea unresponsive to caffeine / stimulation, or SpO₂ consistently < 85%',
            ],
            triggers: [
              'Failed extubation within 72 h (> 30% re-intubation rate → review unit-wide technique and criteria)',
              'FiO₂ rising back to > 0.30 on CPAP at 1 week → consider repeat surfactant + BPD developing',
              'Persistent O₂ requirement at 28 days postnatal age → BPD criteria met; plan pulmonology review',
            ],
          },
          {
            title: 'Long-Term Complication Surveillance',
            orders: [
              'BPD / CLD: defined as O₂ requirement at 36 weeks PMA (modified Jobe–Bancalari). Severity: mild (in air), moderate (FiO₂ < 0.30), severe (FiO₂ ≥ 0.30 or PPV/CPAP). If evolving BPD: consider furosemide (1 mg/kg q12h) ± spironolactone, inhaled salbutamol (if bronchospasm), low-dose dexamethasone (DART protocol) for ventilator dependency.',
              'RETINOPATHY OF PREMATURITY (ROP): screen all infants < 32 weeks GA or BW < 1500 g, or 32–36 weeks with risk factors (O₂ exposure, IUGR). First screen: 4–6 weeks postnatal age or at 31–32 weeks PMA (whichever is later). Ophthalmology referral — strict SpO₂ targeting (91–95%) is the key preventive intervention.',
              'NEC SURVEILLANCE: necrotising enterocolitis peaks at 1–3 weeks in VLBW infants. Early signs: feed intolerance, abdominal distension, blood in stool. Abdominal XR: watch for pneumatosis intestinalis (bowel wall gas — NEC criteria met), portal venous gas, free air. Early: NPO, NG decompression, broad-spectrum antibiotics (pip-tazo + metronidazole). Perforation → surgical emergency.',
              'FEEDING & GROWTH: plot weight, head circumference, and length on Fenton chart weekly. Head circumference gain target: 0.5–1 cm/week. Weight gain target: 15–20 g/kg/day once past birth weight nadir. Optimise human milk (breast / donor), fortify breastmilk from 34 weeks PMA or when tolerating full volume.',
              'HEARING SCREEN: automated auditory brainstem response (AABR) before discharge. Aminoglycoside exposure → increased sensorineural hearing loss risk — document cumulative gentamicin exposure.',
            ],
            nursing: [
              'OFC (head circumference) measurement weekly, plotted on Fenton chart',
              'Abdominal girth measurement before each feed in VLBW infants — alert if increasing > 2 cm from baseline',
              'Stool inspection — blood / mucus → hold feeds + medical review',
              'SpO₂ alarm limits strictly maintained at 90–95% — excessive O₂ is the primary modifiable ROP risk factor',
            ],
            triggers: [
              'Bilious aspirates, abdominal distension, blood in stool → suspect NEC → NPO + XR + antibiotics immediately',
              'SpO₂ alarm limits breached repeatedly → review alarm fatigue, staff re-education, consider SpO₂ histogram audit',
              'Head circumference plateauing + fontanelle tense → repeat cranial US (PHVD, hydrocephalus)',
            ],
          },
        ],
      },
    ],
  },

  calculateSeverity: (): Severity => ({ level: 'unknown' as SeverityLevel, details: ['Use the Silverman-Andersen Retraction Score (Stage 1) to assess respiratory severity bedside.'] }),

  getManagement: () => [
    {
      title: 'Immediate priorities',
      recommendations: [
        'Golden hour: DCC ≥ 60 s, normothermia (36.5–37.5°C), CPAP 6 cmH₂O from delivery room.',
        'SpO₂ target: 91–95% (alarm 90–95%). Do not start high FiO₂ — titrate from 0.21–0.30.',
        'Surfactant (Infasurf 3 mL/kg) via LISA/MIST if FiO₂ > 0.30 on CPAP ≥ 5 cmH₂O.',
        'Caffeine citrate 20 mg/kg loading dose on day 1. Empiric ampicillin + gentamicin until EOS excluded.',
      ],
    },
    {
      title: 'Ventilation (if needed)',
      recommendations: [
        'Volume-targeted ventilation: VT 4–5 mL/kg, PEEP 5–7 cmH₂O, RR 40–60/min.',
        'Permissive hypercapnia: PaCO₂ 45–60 mmHg, pH ≥ 7.22 — do not hyperventilate.',
        'OI > 13 → consider HFOV. OI > 20 → strong HFOV indication.',
        'Extubate early to CPAP/NIPPV when FiO₂ ≤ 0.30 and MAP ≤ 10 cmH₂O.',
      ],
    },
    {
      title: 'Supportive care',
      recommendations: [
        'Fluid restriction days 1–3: 60–80 mL/kg/day. Avoid fluid overload (→ PDA, BPD).',
        'No sodium in IV fluids on day 1. Add sodium from day 2–3 (2–5 mmol/kg/day).',
        'Trophic feeds (1–2 mL/kg 3-hourly) from 24–48 h if haemodynamically stable.',
        'Cranial ultrasound: within 12 h (< 28 weeks), day 7–10, 36 weeks PMA.',
      ],
    },
  ],

  getDisposition: () => [
    'Admit to level III NICU for all infants < 32 weeks with RDS.',
    'Level II NICU acceptable for infants ≥ 32 weeks on CPAP only (no surfactant given, FiO₂ < 0.30).',
    'Transfer to tertiary centre if HFOV needed and not available locally.',
  ],

  getRedFlags: () => [
    'Apnoea or inadequate respiratory effort → immediate PPV',
    'FiO₂ > 0.50 on CPAP ≥ 8 cmH₂O → CPAP failure → intubate',
    'Sudden unilateral hypoinflation + desaturation → pneumothorax → needle thoracocentesis',
    'pH < 7.20 on blood gas → urgent reassessment of ventilation / surfactant',
    'OI > 20 → consider HFOV ± iNO (if PPHN component)',
    'Abdominal distension + bloody stool + haemodynamic instability → NEC until proven otherwise',
    'Seizure activity → blood gas + glucose + urgent EEG + phenobarbital',
    'MAP < gestational age (weeks) in mmHg → treat hypotension',
  ],

  getDrugDoses: (severity, data) => {
    const w = Number(data.weight) || 0;
    return [
      {
        drugName: 'Calfactant (Infasurf)',
        dose: w ? `${(3 * w).toFixed(1)} mL per dose (= ${(105 * w).toFixed(0)} mg phospholipids)` : '3 mL/kg per dose (= 105 mg phospholipids/kg)',
        notes: 'Intratracheal via LISA/MIST or ETT. Up to 3 doses total, each ≥ 12 h apart. Swirl — do not shake.',
      },
      {
        drugName: 'Caffeine citrate',
        dose: w ? `Load ${(20 * w).toFixed(0)} mg → Maintenance ${(5 * w).toFixed(0)}–${(10 * w).toFixed(0)} mg/day` : 'Load 20 mg/kg → Maintenance 5–10 mg/kg/day',
        notes: 'IV over 30 min or PO. Citrate salt (base = half the mg). Continue to ~34–36 wks PMA.',
      },
      {
        drugName: 'Ampicillin (empiric EOS)',
        dose: w ? `${(50 * w).toFixed(0)} mg/dose (PMA-based interval — see NeoDose)` : '50 mg/kg/dose',
        notes: 'With gentamicin. Stop at 36–48 h if cultures negative and clinical picture inconsistent with sepsis.',
      },
      {
        drugName: 'Gentamicin (empiric EOS)',
        dose: w ? `${(4.5 * w).toFixed(2)} mg/dose (adjust per PMA in NeoDose)` : '4–5 mg/kg/dose (PMA-based extended interval)',
        notes: 'Extended interval dosing. Mandatory TDM — trough before 3rd dose (target < 1 mg/L).',
      },
      {
        drugName: 'Ibuprofen (hsPDA)',
        dose: w ? `Day 1: ${(10 * w).toFixed(0)} mg | Days 2–3: ${(5 * w).toFixed(0)} mg each` : 'Day 1: 10 mg/kg | Days 2–3: 5 mg/kg',
        notes: 'IV over 15 min. Check UO, creatinine, platelets before each dose. Contraindicated if AKI, NEC, bleeding.',
      },
    ];
  },

  getReferences: () => [
    { title: 'Sweet DG et al. European Consensus Guidelines on RDS (2022 update), Neonatology 2023', url: 'https://www.karger.com/Article/FullText/528914' },
    { title: 'Infasurf (Calfactant) Prescribing Information — ONY Biotech', url: 'https://www.infasurf.com' },
    { title: 'CAP Trial — Caffeine for Apnea of Prematurity (Schmidt et al. NEJM 2006)', url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa054065' },
    { title: 'NNF 9th Edition (2024) — Neonatal Formulary', url: 'https://www.medicinescomplete.com/' },
    { title: 'ILAE Neonatal Seizure Guidelines 2021', url: 'https://onlinelibrary.wiley.com/doi/10.1111/epi.16815' },
  ],
};
