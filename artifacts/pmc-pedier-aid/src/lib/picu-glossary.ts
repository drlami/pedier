/**
 * Shared PICU glossary of abbreviations, mnemonics, and scoring systems.
 * Used by the auto "Key terms & scores" panel to define only the terms that
 * actually appear in a given protocol.
 */
export interface GlossaryTerm {
  term: string;
  full: string;
  def: string;
  match?: string[]; // alternative tokens to detect this term in protocol text
}

export const PICU_GLOSSARY: GlossaryTerm[] = [
  // Respiratory / ventilation
  { term: 'OI', full: 'Oxygenation Index', def: '(mean airway pressure × FiO₂%) ÷ PaO₂. Higher = worse hypoxemic failure.' },
  { term: 'OSI', full: 'Oxygen Saturation Index', def: '(mean airway pressure × FiO₂%) ÷ SpO₂. Non-invasive surrogate for OI when no arterial line.' },
  { term: 'MAP', full: 'Mean Arterial Pressure (or mean airway pressure)', def: 'Arterial: average BP, ≈ DBP + ⅓(SBP−DBP). In ventilation contexts (OI), "MAP" means mean AIRWAY pressure read from the ventilator.' },
  { term: 'PARDS', full: 'Pediatric Acute Respiratory Distress Syndrome', def: 'Acute hypoxemic lung injury; severity graded by OI/OSI (PALICC-2).' },
  { term: 'PALICC', full: 'Pediatric Acute Lung Injury Consensus Conference', def: 'The consensus that defines and grades PARDS (PALICC-2 = 2nd edition, 2023).' },
  { term: 'ARDS', full: 'Acute Respiratory Distress Syndrome', def: 'Diffuse inflammatory lung injury causing hypoxemia and stiff lungs.' },
  { term: 'HFOV', full: 'High-Frequency Oscillatory Ventilation', def: 'Rescue ventilation delivering tiny breaths at very high rates around a high mean airway pressure.' },
  { term: 'HFNC', full: 'High-Flow Nasal Cannula', def: 'Heated humidified high-flow oxygen (≈2 L/kg/min) giving some positive pressure and washout.' },
  { term: 'CPAP', full: 'Continuous Positive Airway Pressure', def: 'Single continuous distending pressure — recruits lung in hypoxemic (Type I) failure.' },
  { term: 'BiPAP', full: 'Bilevel Positive Airway Pressure', def: 'Two pressures (IPAP/EPAP) giving pressure support — for hypercapnic (Type II) failure.' },
  { term: 'NIV', full: 'Non-Invasive Ventilation', def: 'Respiratory support via mask/prongs without an endotracheal tube (HFNC/CPAP/BiPAP).' },
  { term: 'PEEP', full: 'Positive End-Expiratory Pressure', def: 'Pressure kept in the lungs at end-expiration to prevent collapse and aid oxygenation.' },
  { term: 'FiO2', full: 'Fraction of Inspired Oxygen', def: 'Oxygen concentration delivered (21% room air → 100%).', match: ['FiO'] },
  { term: 'Vt', full: 'Tidal Volume', def: 'Volume of each breath; lung-protective target 5–6 mL/kg.' },
  { term: 'ETT', full: 'Endotracheal Tube', def: 'Breathing tube placed in the trachea for invasive ventilation.' },
  { term: 'EtCO2', full: 'End-tidal CO₂ (capnography)', def: 'Exhaled CO₂ trace — confirms tube placement and monitors ventilation/perfusion.', match: ['EtCO', 'end-tidal'] },
  { term: 'RSI', full: 'Rapid Sequence Induction/Intubation', def: 'Rapid induction + paralysis to secure the airway, minimising aspiration risk.' },
  { term: 'NMB', full: 'Neuromuscular Blockade', def: 'Paralysing agents to abolish patient effort/dyssynchrony.' },
  { term: 'SBT', full: 'Spontaneous Breathing Trial', def: 'Trial of minimal support to test readiness for extubation.' },
  { term: 'iNO', full: 'Inhaled Nitric Oxide', def: 'Inhaled selective pulmonary vasodilator for refractory hypoxemia / pulmonary hypertension.' },
  { term: 'DOPES', full: 'Displacement · Obstruction · Pneumothorax · Equipment · Stacking', def: 'Checklist for acute deterioration in a ventilated child.' },

  // Neuro
  { term: 'ICP', full: 'Intracranial Pressure', def: 'Pressure inside the skull; sustained > 20 mmHg is treated.' },
  { term: 'CPP', full: 'Cerebral Perfusion Pressure', def: 'Blood pressure driving brain perfusion: CPP = MAP − ICP.' },
  { term: 'EVD', full: 'External Ventricular Drain', def: 'Catheter in the ventricle to drain CSF and/or measure ICP.' },
  { term: 'GCS', full: 'Glasgow Coma Scale', def: 'Score of consciousness (3–15); ≤ 8 usually means intubate.' },
  { term: 'AEIOU-TIPS', full: 'Coma causes mnemonic', def: 'Alcohol/Acidosis, Epilepsy/Electrolytes, Insulin (glucose), Opiates/Overdose, Uremia, Trauma/Temperature, Infection, Psychiatric/Poisoning, Shock/Stroke.' },
  { term: 'DEFG', full: "Don't Ever Forget Glucose", def: 'Reminder to check (and treat) blood glucose early in any sick/comatose child.' },
  { term: 'SE', full: 'Status Epilepticus', def: 'Seizure ≥ 5 min or repeated seizures without recovery.' },
  { term: 'ESETT', full: 'Established Status Epilepticus Treatment Trial', def: 'Trial showing levetiracetam, fosphenytoin and valproate are equivalent 2nd-line agents.' },

  // Sedation / withdrawal scores
  { term: 'WAT-1', full: 'Withdrawal Assessment Tool-1', def: 'Validated score for iatrogenic opioid/benzodiazepine withdrawal in children; rising score = slow the wean.', match: ['WAT-1', 'WAT 1'] },
  { term: 'CAPD', full: 'Cornell Assessment of Pediatric Delirium', def: 'Bedside screening score for delirium in critically ill children.' },
  { term: 'COMFORT-B', full: 'COMFORT-Behavioral scale', def: 'Validated score of sedation depth in ventilated children.', match: ['COMFORT-B', 'COMFORT'] },
  { term: 'SBS', full: 'State Behavioral Scale', def: 'Score of sedation/agitation level in ventilated children.' },
  { term: 'FLACC', full: 'Face, Legs, Activity, Cry, Consolability', def: 'Observational pain score for young/non-verbal children.' },

  // Renal / fluids
  { term: 'AKI', full: 'Acute Kidney Injury', def: 'Abrupt fall in kidney function; staged 1–3 by creatinine/urine output (KDIGO).' },
  { term: 'KDIGO', full: 'Kidney Disease: Improving Global Outcomes', def: 'The criteria used to define and stage AKI.' },
  { term: 'CRRT', full: 'Continuous Renal Replacement Therapy', def: 'Slow continuous dialysis/filtration — preferred when hemodynamically unstable.' },
  { term: 'RRT', full: 'Renal Replacement Therapy', def: 'Dialysis or filtration (CRRT, intermittent HD, or PD).' },
  { term: 'AEIOU', full: 'Dialysis (RRT) indications', def: 'Acidosis, Electrolyte disturbance, Intoxication, Overload, Uremia — when to start RRT.' },
  { term: 'SIADH', full: 'Syndrome of Inappropriate ADH', def: 'Excess ADH → water retention and hyponatremia; treated with fluid restriction.' },
  { term: 'DI', full: 'Diabetes Insipidus', def: 'ADH deficiency/resistance → excess dilute urine and hypernatremia.' },
  { term: 'DKA', full: 'Diabetic Ketoacidosis', def: 'Hyperglycemia + ketosis + acidosis; risk of cerebral edema with over-rapid fluids.' },

  // Heme / transfusion
  { term: 'DIC', full: 'Disseminated Intravascular Coagulation', def: 'Secondary consumptive coagulopathy — treat the trigger; products only if bleeding.' },
  { term: 'MTP', full: 'Massive Transfusion Protocol', def: 'Pre-arranged balanced delivery of red cells, plasma and platelets for major haemorrhage.' },
  { term: 'TXA', full: 'Tranexamic Acid', def: 'Antifibrinolytic given early in traumatic/surgical haemorrhage.' },
  { term: 'TACO', full: 'Transfusion-Associated Circulatory Overload', def: 'Fluid overload from transfusion — a risk when transfusing chronic anaemia fast.' },
  { term: 'FFP', full: 'Fresh Frozen Plasma', def: 'Plasma product replacing clotting factors.' },
  { term: 'ANC', full: 'Absolute Neutrophil Count', def: 'Neutrophil number; < 0.5 ×10⁹/L = neutropenia (febrile neutropenia risk).' },
  { term: 'G-CSF', full: 'Granulocyte Colony-Stimulating Factor', def: 'Drug that stimulates neutrophil recovery.' },

  // Shock / arrest
  { term: 'ROSC', full: 'Return of Spontaneous Circulation', def: 'Restoration of a pulse after cardiac arrest.' },
  { term: 'ECMO', full: 'Extracorporeal Membrane Oxygenation', def: 'Heart-lung bypass support for refractory cardiac/respiratory failure.' },
  { term: 'VAD', full: 'Ventricular Assist Device', def: 'Mechanical pump supporting a failing ventricle.' },
  { term: 'PGE1', full: 'Prostaglandin E1 (alprostadil)', def: 'Keeps the ductus arteriosus open in duct-dependent congenital heart disease.', match: ['PGE1', 'Prostaglandin', 'prostaglandin'] },
  { term: 'Hs & Ts', full: 'Reversible causes of arrest', def: 'Hypoxia, Hypovolemia, H⁺ (acidosis), Hypo/hyperkalemia, Hypothermia; Tension pneumothorax, Tamponade, Toxins, Thrombosis.', match: ['Hs & Ts', 'Hs and Ts'] },
  { term: 'TTM', full: 'Targeted Temperature Management', def: 'Controlled temperature (prevent fever ± mild hypothermia) after arrest/brain injury.' },
  { term: 'PEWS', full: 'Pediatric Early Warning Score', def: 'Track-and-trigger score flagging clinical deterioration.' },

  // Tox
  { term: 'DUMBELS', full: 'Cholinergic toxidrome mnemonic', def: 'Defecation, Urination, Miosis, Bronchorrhea/Bronchospasm, Emesis, Lacrimation, Salivation/Sweating (organophosphate poisoning).', match: ['DUMBELS', 'SLUDGE'] },
  { term: 'WBCT', full: '20-minute Whole Blood Clotting Test', def: 'Bedside test: non-clotting blood at 20 min indicates snakebite coagulopathy.', match: ['WBCT', 'whole-blood clotting', 'whole blood clotting'] },

  // Imaging
  { term: 'POCUS', full: 'Point-of-Care Ultrasound', def: 'Bedside ultrasound (e.g. for pneumothorax, cardiac function, volume).' },
  { term: 'CXR', full: 'Chest X-ray', def: 'Chest radiograph.' },
];

function tokenInText(text: string, token: string): boolean {
  const hasSpecial = /[^a-z0-9]/i.test(token);
  if (hasSpecial) return text.toLowerCase().includes(token.toLowerCase());
  const short = token.length <= 3 && token === token.toUpperCase();
  const re = new RegExp(`\\b${token}\\b`, short ? '' : 'i');
  return re.test(text);
}

/** Glossary terms whose tokens appear in the supplied protocol text. */
export function collectPicuTerms(text: string): GlossaryTerm[] {
  return PICU_GLOSSARY.filter((t) => (t.match ?? [t.term]).some((tok) => tokenInText(text, tok)));
}

/** For bespoke (non-mmpData) protocols: pick glossary entries by explicit name list. */
export function termsByNames(names: string[]): GlossaryTerm[] {
  const set = new Set(names.map((n) => n.toLowerCase()));
  return PICU_GLOSSARY.filter((t) => set.has(t.term.toLowerCase()) || (t.match ?? []).some((m) => set.has(m.toLowerCase())));
}

/** Term lists for bespoke PICU protocols that carry no mmpData text. */
export const BESPOKE_PICU_TERMS: Record<string, string[]> = {
  'picu-ards': ['OI', 'OSI', 'MAP', 'FiO2', 'PEEP', 'Vt', 'PARDS', 'PALICC', 'ARDS', 'iNO', 'HFOV', 'ECMO', 'NMB'],
  'picu-niv': ['HFNC', 'CPAP', 'BiPAP', 'NIV', 'FiO2', 'EtCO2'],
  'picu-vent-troubleshooting': ['DOPES', 'EtCO2', 'PEEP', 'ETT'],
  'picu-hfov': ['HFOV', 'OI', 'MAP', 'FiO2'],
  'picu-mech-ventilation': ['PEEP', 'FiO2', 'Vt', 'ETT', 'EtCO2', 'RSI'],
};
