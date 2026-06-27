import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Myocarditis & Acute Pericarditis
 * MASTER MANAGEMENT PATHWAY (MMP)
 * Source: Nelson Textbook of Pediatrics, 21st ed., Chapter 488.5 & 489 (Parent & Ware)
 */
export const wardMyocarditisProtocol: DiseaseProtocol = {
  id: 'ward-myocarditis',
  name: 'Myocarditis/Pericarditis Master Pathway',
  system: 'Cardiovascular System',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'June 2026',
  description: 'Acute myocarditis is inflammatory injury of the myocardium most commonly caused by viral infections (Coxsackievirus, Adenovirus, Parvovirus B19, COVID-19). It ranges from subclinical disease to fulminant cardiogenic shock and sudden death. Pericarditis frequently co-exists as myopericarditis. The first decision at admission is triage: compensated (ward) vs fulminant (PICU). Primary therapy is supportive. All patients require strict bed rest and activity restriction for 3–6 months.',
  image: {
    url: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=600&h=400',
    hint: 'Cardiac monitoring for inflammatory myocarditis',
  },
  questions: [
    { id: 'weight', questionText: 'Current Body Weight', type: 'number', unit: 'kg' },
    { id: 'hr', questionText: 'Heart Rate (resting)', type: 'number', unit: 'bpm' },
    { id: 'bp', questionText: 'Systolic Blood Pressure', type: 'number', unit: 'mmHg' },
    { id: 'ef', questionText: 'Ejection Fraction (EF) if echo done', type: 'number', unit: '%' },
  ],

  mmpData: {
    snapshot: 'Triage first: compensated vs fulminant. Fulminant myocarditis (EF <40%, hypotension, gallop rhythm) needs PICU transfer and milrinone infusion — the preferred inotrope, used cautiously due to its proarrhythmic potential. Mechanical circulatory support (ventricular assist device (VAD) or extracorporeal membrane oxygenation (ECMO)) is the bridge to recovery or transplantation when medical therapy fails. Compensated patients receive diuretics and, once stable, ACE inhibitors and beta-blockers. Strict bed rest and no competitive sports for 3–6 months are mandatory for all patients.',
    stages: [
      {
        label: 'Stage 1: Triage — Compensated or Fulminant?',
        shortLabel: 'Triage',
        color: 'blue',
        cards: [
          {
            title: 'Decide the Pathway at Admission',
            threshold: 'FULMINANT → PICU IMMEDIATELY. COMPENSATED → WARD + MONITORING',
            isCritical: true,
            orders: [
              'COMPENSATED PATHWAY (WARD): chest pain or palpitations, SpO₂ >95%, haemodynamically stable blood pressure, EF ≥40% on echocardiogram',
              'FULMINANT PATHWAY (PICU): tachycardia disproportionate to fever, hypotension, gallop rhythm, respiratory distress, SpO₂ <92%, or EF <40%',
              'ALL CASES: strict bed rest is mandatory from admission — minimise all physical activity to reduce myocardial oxygen demand',
              'Infants and young children are more likely to have a fulminant presentation: fever, respiratory distress, tachycardia, gallop, cardiac murmur',
              'Kawasaki disease shock syndrome can mimic fulminant myocarditis — consider KD pathway if relevant clinical features are present',
            ],
          },
          {
            title: 'Aetiology — Guide History and Targeted Testing',
            orders: [
              'VIRAL (most common): Coxsackievirus B, Enterovirus, Adenovirus, Parvovirus B19, Epstein–Barr virus (EBV), Cytomegalovirus (CMV), COVID-19, post-mRNA vaccine (rare)',
              'BACTERIAL: Lyme disease (Borrelia burgdorferi), rheumatic fever (post-Group A Streptococcal), diphtheria, Mycoplasma',
              'AUTOIMMUNE: systemic lupus erythematosus (SLE), juvenile idiopathic arthritis (JIA), sarcoidosis, giant cell myocarditis',
              'DRUG/TOXIC: anthracyclines, cyclophosphamide, immune checkpoint inhibitors, catecholamines, cocaine',
              'Ask specifically: viral illness in the past 1–4 weeks, medications, tick bite exposure, COVID-19 history/vaccination status, travel history',
            ],
          },
        ],
      },
      {
        label: 'Stage 2: Monitoring & Diagnostic Workup',
        shortLabel: 'Investigations',
        color: 'indigo',
        cards: [
          {
            title: 'Mandatory Monitoring [NS]',
            nursing: [
              'Strict bed rest: do not allow ambulation until haemodynamically stable and troponin trending down',
              'Continuous 3-lead ECG telemetry throughout admission: watch for arrhythmias and ST-segment changes',
              'Continuous pulse oximetry (SpO₂)',
              'Blood pressure every 2–4 hours',
              'Fluid balance chart: daily weight, strict input/output measurement',
            ],
          },
          {
            title: 'Investigations at Admission [DR]',
            orders: [
              'ECHOCARDIOGRAM (URGENT): LV ejection fraction (EF), chamber size, wall motion, mitral insufficiency, pericardial effusion — repeat if any deterioration',
              '12-lead ECG: look for sinus tachycardia, diminished QRS voltages, non-specific ST/T changes, heart block, or ventricular arrhythmias',
              'Chest X-ray: cardiomegaly, pulmonary vascular prominence, pulmonary oedema, pleural effusions',
              'Cardiac MRI (if available and patient haemodynamically stable): T2-weighted oedema, late gadolinium enhancement (LGE) in midmyocardial/subepicardial distribution — most specific diagnostic tool',
              'CARDIAC BIOMARKERS: high-sensitivity troponin I or T (serial every 12–24 hours), B-type natriuretic peptide (BNP) or NT-proBNP, CK-MB isoenzyme',
              'Bloods: full blood count (FBC), urea and electrolytes (U&E), liver function tests (LFTs), C-reactive protein (CRP), erythrocyte sedimentation rate (ESR)',
              'Viral panel: Enterovirus/Coxsackie PCR, Adenovirus PCR, Parvovirus B19 PCR, EBV, CMV, COVID-19 PCR',
              'If autoimmune cause suspected: anti-nuclear antibody (ANA), anti-neutrophil cytoplasmic antibody (ANCA), complement levels, anti-dsDNA, rheumatoid factor',
              'Thyroid function tests: thyrotoxicosis can cause myocarditis and is treatable',
            ],
          },
        ],
      },
      {
        label: 'Stage 3: Compensated Heart Failure — Ward Management',
        shortLabel: 'Medical Mx',
        color: 'amber',
        cards: [
          {
            title: 'Diuresis & Fluid Management',
            threshold: 'FOR FLUID OVERLOAD: OEDEMA, HEPATOMEGALY, OR PULMONARY CRACKLES',
            orders: [
              'Start furosemide IV, convert to PO once clinically improving and tolerating oral medications',
              'Restrict fluid intake to 70–80% of maintenance if oedema or pulmonary venous congestion is present',
              'Monitor serum electrolytes daily — furosemide causes hypokalaemia and hypomagnesaemia',
              'Add spironolactone if long-term diuretic therapy is expected (potassium-sparing agent)',
            ],
            prescriptions: [
              {
                drug: 'Furosemide',
                dose: '1–2 mg/kg/dose',
                route: 'IV initially, then oral (PO)',
                frequency: 'Every 6–12 hours',
                calculation: (w: number) => `${(w * 1).toFixed(0)}–${(w * 2).toFixed(0)} mg per dose`,
                notes: 'Monitor potassium and magnesium. Max single dose 6 mg/kg.',
              },
            ],
          },
          {
            title: 'Neurohormonal Blockade (Compensated Phase Only)',
            threshold: 'ONLY IF HAEMODYNAMICALLY STABLE — ABSOLUTELY CONTRAINDICATED IN FULMINANT PHASE',
            orders: [
              'ACE inhibitor (angiotensin-converting enzyme inhibitor): reduces cardiac afterload and LV remodelling — start at low dose, titrate slowly',
              'Beta-blocker (carvedilol): reduces sympathetic drive and improves LV function — start ONLY after adequate diuresis and confirmed haemodynamic stability',
              'BOTH are contraindicated if: hypotension, significantly elevated creatinine, or cardiogenic shock — do not give in the fulminant phase',
              'Angiotensin receptor blocker (ARB) is an alternative if ACE inhibitor is not tolerated (cough)',
            ],
            prescriptions: [
              {
                drug: 'Captopril (ACE inhibitor)',
                dose: '0.1–0.5 mg/kg/dose',
                route: 'Oral',
                frequency: 'Three times daily (TDS)',
                calculation: (w: number) => `${(w * 0.1).toFixed(1)}–${(w * 0.5).toFixed(1)} mg per dose`,
                notes: 'Start 0.1 mg/kg/dose, titrate up weekly. Monitor BP and renal function.',
              },
              {
                drug: 'Carvedilol (beta-blocker)',
                dose: '0.1 mg/kg/dose',
                route: 'Oral',
                frequency: 'Twice daily (BD)',
                calculation: (w: number) => `${(w * 0.1).toFixed(1)} mg per dose`,
                notes: 'Start only when compensated. Titrate every 2 weeks. NEVER give in fulminant phase.',
              },
            ],
          },
          {
            title: 'Immunomodulation — Consult Cardiology First',
            threshold: 'EVIDENCE IS LIMITED — DECISION MUST INVOLVE CARDIOLOGY',
            orders: [
              'IVIG (intravenous immunoglobulin) 2 g/kg over 12–24 hours: may have a role in acute or fulminant viral myocarditis — evidence in children is limited',
              'Corticosteroids (prednisolone 1–2 mg/kg/day): reported to improve cardiac function in some series but remain controversial; relapse has been noted when immunosuppression is weaned',
              'No antiviral therapy is currently recommended for viral myocarditis',
              'Drug-induced myocarditis: withdraw the offending medication immediately; substitute if clinically necessary',
              'Lyme disease myocarditis: IV ceftriaxone (consult Infectious Diseases for dosing and duration)',
            ],
          },
        ],
      },
      {
        label: 'Stage 4: Fulminant Myocarditis — ICU Pathway',
        shortLabel: 'ICU Pathway',
        color: 'red',
        cards: [
          {
            title: 'Immediate PICU Transfer Actions',
            threshold: 'EF <40%, HYPOTENSION, REFRACTORY ARRHYTHMIA, OR RESPIRATORY COLLAPSE',
            isCritical: true,
            orders: [
              'TRANSFER TO PICU: call Paediatric Cardiology immediately on identifying a fulminant presentation — do not wait',
              'DO NOT give beta-blockers or ACE inhibitors in this phase — contraindicated in cardiogenic shock',
              'Insert arterial line for continuous blood pressure monitoring',
              'Central venous access for inotrope administration',
              'Continuous cardiac monitoring with defibrillator immediately available',
              'Foley catheter for accurate urine output monitoring',
            ],
          },
          {
            title: 'Milrinone — Preferred Inotrope',
            threshold: 'USE CAUTIOUSLY — PROARRHYTHMIC; MONITOR CONTINUOUSLY',
            orders: [
              'MILRINONE (phosphodiesterase-III inhibitor): increases cardiac output by enhancing contractility and reducing systemic vascular resistance (SVR) — preferred inotrope for myocarditis',
              'PROARRHYTHMIC RISK: continuous ECG telemetry mandatory during the entire infusion',
              'AVOID loading dose in haemodynamically unstable patients — causes hypotension',
              'Titrate infusion based on clinical response: blood pressure, heart rate, urine output, and lactate',
              'Dopamine or dobutamine may be added if milrinone alone is insufficient',
            ],
            prescriptions: [
              {
                drug: 'Milrinone',
                dose: '0.25–0.75 mcg/kg/min',
                route: 'IV infusion (central line only)',
                frequency: 'Continuous infusion',
                calculation: (w: number) => `${(w * 0.25).toFixed(2)}–${(w * 0.75).toFixed(2)} mcg/min total`,
                notes: 'Start at 0.25 mcg/kg/min. No loading dose if hypotensive. Titrate slowly.',
              },
            ],
          },
          {
            title: 'Arrhythmia Management',
            orders: [
              'Significant ventricular tachycardia (VT) or refractory supraventricular tachycardia (SVT): amiodarone is first-line',
              'AMIODARONE IV LOAD: 5 mg/kg over 20–60 minutes (max 300 mg per dose) — give slowly to avoid hypotension',
              'AMIODARONE IV MAINTENANCE: 5–15 mcg/kg/min continuous infusion after loading',
              'Oral amiodarone (once stabilised): 5 mg/kg/day once daily',
              'Implantable cardioverter-defibrillator (ICD) placement: consider if significant arrhythmia persists after a period of recovery',
            ],
            prescriptions: [
              {
                drug: 'Amiodarone (loading dose)',
                dose: '5 mg/kg IV',
                route: 'IV over 20–60 minutes',
                frequency: 'Single loading dose',
                calculation: (w: number) => `${Math.min(w * 5, 300).toFixed(0)} mg`,
                notes: 'Max 300 mg. Give slowly — causes hypotension. Follow with maintenance infusion 5–15 mcg/kg/min.',
              },
            ],
          },
          {
            title: 'Mechanical Circulatory Support — Bridge to Recovery or Transplant',
            threshold: 'IF REFRACTORY TO ALL MEDICAL THERAPY — CALL CARDIOLOGY + CARDIAC SURGERY',
            orders: [
              'Mechanical ventilatory support: consider if respiratory failure or cardiovascular collapse unresponsive to inotropes',
              'Ventricular assist device (VAD): bridge to myocardial recovery or cardiac transplantation',
              'Extracorporeal membrane oxygenation (ECMO): for the most severe refractory cardiogenic shock — bridge to recovery or transplant',
              'VAD or ECMO decision must involve Cardiology and Cardiac Surgery immediately — do not delay',
              'PROGNOSIS COUNSELLING: neonatal enteroviral myocarditis has 75% mortality even with maximal support — early family counselling is essential',
            ],
          },
        ],
      },
      {
        label: 'Stage 5: Pericarditis, Discharge Criteria & Activity',
        shortLabel: 'Discharge',
        color: 'emerald',
        cards: [
          {
            title: 'Acute Pericarditis Management',
            threshold: 'NSAIDs ONLY IF EF IS NORMAL — AVOID IF LV FUNCTION IS REDUCED',
            orders: [
              'Classic pericarditis: sharp/stabbing positional chest pain, worse with inspiration, relieved by sitting forward',
              'TAMPONADE SIGNS (EMERGENCY): pulsus paradoxus >10 mmHg, muffled heart sounds, jugular venous distension, and hypotension → urgent pericardiocentesis',
              'Purulent pericarditis (bacterial): IV antibiotics + pericardiocentesis — call surgery',
              'VIRAL/IDIOPATHIC PERICARDITIS: ibuprofen + colchicine — colchicine reduces recurrence rate significantly',
              'COLCHICINE DOSING: age <12 years: 0.5 mg once daily; age ≥12 years: 0.5 mg twice daily (BD) — continue for 3 months',
              'Corticosteroids: only for NSAID-refractory, rheumatologic, or post-pericardiotomy pericarditis — not first line',
              'Colchicine-resistant recurrent pericarditis: anakinra (interleukin-1 receptor antagonist) or rilonacept (interleukin-1 trap)',
              'Constrictive pericarditis (chronic): pericardiectomy is the definitive treatment',
            ],
            prescriptions: [
              {
                drug: 'Ibuprofen (pericarditis)',
                dose: '5–10 mg/kg/dose',
                route: 'Oral',
                frequency: 'Three times daily (TDS)',
                calculation: (w: number) => `${(w * 7.5).toFixed(0)} mg per dose`,
                notes: 'ONLY if EF is normal. Max 400 mg/dose. Give with food. Continue until pain-free and CRP normalised.',
              },
            ],
          },
          {
            title: 'Discharge Criteria',
            orders: [
              'Troponin normalising or significantly improved (does not need to be fully normal at discharge)',
              'No significant arrhythmias on continuous cardiac telemetry for >48 hours',
              'EF stable or improving on echocardiogram',
              'Haemodynamically stable — off all IV inotrope support',
              'Tolerating oral medications; full discharge prescription written',
            ],
          },
          {
            title: 'Activity Restriction & Follow-up Schedule',
            isCritical: true,
            orders: [
              'NO COMPETITIVE SPORTS for 3–6 months from diagnosis — MANDATORY regardless of how well the patient feels',
              'Return to full activity requires formal clearance from Paediatric Cardiology (clinical review + repeat echocardiogram)',
              'COVID-19 vaccine-associated myocarditis: excellent prognosis — full recovery expected by 90 days in most cases',
              'MIS-C myocarditis (multisystem inflammatory syndrome in children): Cardiology follow-up required; exercise restriction continues until Cardiology clearance',
              'Follow-up echocardiogram schedule: 1 month, 3 months, and 6 months after discharge',
              'RETURN IF: worsening exercise intolerance, recurrent chest pain, syncope, near-syncope, or documented palpitations',
            ],
          },
        ],
      },
    ],
  },

  calculateSeverity: (data) => {
    const hr = Number(data.hr);
    const bp = Number(data.bp);
    const ef = Number(data.ef);
    if (bp > 0 && bp < 70) return { level: 'critical', details: ['FULMINANT MYOCARDITIS: Transfer to PICU now. Milrinone infusion ± mechanical circulatory support needed.'] };
    if (ef > 0 && ef < 40) return { level: 'critical', details: ['FULMINANT MYOCARDITIS: EF <40% — Transfer to PICU. Milrinone infusion required. Call Cardiology immediately.'] };
    if (hr > 160 || (bp > 0 && bp < 90)) return { level: 'severe', details: ['Decompensating: Urgent Cardiology review. Consider PICU step-down. Avoid beta-blockers.'] };
    return { level: 'moderate', details: ['Compensated myocarditis: Ward monitoring, diuretics, strict bed rest. No ACE inhibitor/beta-blocker until fully stable.'] };
  },
  getManagement: () => [],
  getDisposition: () => [
    'Troponin normalising — no arrhythmias on telemetry for >48 hours',
    'Ejection fraction (EF) stable or improving on echocardiogram',
    'Haemodynamically stable off IV inotrope support',
    'Activity restriction counselled (no sport for 3–6 months)',
    'Follow-up echo at 1 month, 3 months, and 6 months arranged',
  ],
  getRedFlags: () => [
    'Ejection fraction (EF) <40% or rapidly declining on repeat echo',
    'New ventricular tachycardia (VT), complete heart block, or rapid supraventricular tachycardia (SVT)',
    'Tamponade signs: muffled heart sounds, pulsus paradoxus, jugular venous distension',
    'Rising troponin despite 24 hours of supportive therapy',
    'Cardiogenic shock: hypotension with poor perfusion and tachycardia disproportionate to fever',
    'Syncope or near-syncope at rest',
  ],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: 'Nelson Ch. 488.5: Myocarditis (Parent & Ware, 21st ed.)', url: '#' },
    { title: 'Nelson Ch. 489: Diseases of the Pericardium (Parent & Ware, 21st ed.)', url: '#' },
    { title: 'Canter CE, Simpson KE. Diagnosis and treatment of myocarditis in children. Circulation 2014;129:115–128', url: '#' },
  ],
};
