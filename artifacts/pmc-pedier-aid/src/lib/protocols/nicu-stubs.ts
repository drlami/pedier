import type { DiseaseProtocol, FormData, Severity } from './types';

const stub = (id: string, name: string, system: string, description: string): DiseaseProtocol => ({
  id,
  name,
  system,
  description,
  unit: 'nicu',
  category: 'general',
  lastUpdated: 'June 2026',
  image: { url: '', hint: '' },
  questions: [],
  calculateSeverity: (_data: FormData): Severity => ({ level: 'unknown', details: ['Protocol in development'] }),
  getManagement: () => [],
  getDisposition: () => [],
  getRedFlags: () => [],
  getDrugDoses: () => [],
  getReferences: () => [],
});

export const nicuStubs: DiseaseProtocol[] = [

  // ─── 1. Respiratory ───────────────────────────────────────────────────────
  // All 9 Respiratory protocols are now real — see nicu-rds.ts, nicu-ttn.ts,
  // nicu-mas.ts, nicu-pphn.ts, nicu-bpd.ts, nicu-apnea.ts, nicu-air-leak.ts,
  // nicu-congenital-pneumonia.ts, nicu-pulmonary-hemorrhage.ts

  // ─── 2. Cardiovascular ────────────────────────────────────────────────────
  stub(
    'nicu-pda',
    'Patent Ductus Arteriosus (PDA)',
    'Cardiovascular',
    'Hemodynamically significant PDA in the preterm — clinical + echo criteria, conservative vs. medical (ibuprofen / indomethacin / paracetamol) vs. surgical closure.'
  ),
  stub(
    'nicu-chd-stabilization',
    'Prostaglandin-Dependent CHD — Initial Stabilization',
    'Cardiovascular',
    'Duct-dependent lesions presenting at birth — PGE1 infusion, saturation targets, avoiding hyperoxia, and urgent cardiology referral pathway.'
  ),
  stub(
    'nicu-neonatal-shock',
    'Neonatal Shock / Hypotension',
    'Cardiovascular',
    'Low BP and poor perfusion in the neonate — distributive vs. cardiogenic vs. hypovolemic approach, dopamine / dobutamine / hydrocortisone algorithm.'
  ),
  stub(
    'nicu-svt',
    'Neonatal SVT',
    'Cardiovascular',
    'Supraventricular tachycardia in the newborn — ice-pack vagal, adenosine dosing, flecainide / digoxin maintenance, and Wolf-Parkinson-White.'
  ),

  // ─── 3. Infectious Disease ────────────────────────────────────────────────
  stub(
    'nicu-eos',
    'Early-Onset Sepsis (EOS)',
    'Infectious Disease',
    'Sepsis in the first 72 h of life — EOS calculator (Kaiser), risk-stratified workup, ampicillin + gentamicin, and antibiotic de-escalation.'
  ),
  stub(
    'nicu-los',
    'Late-Onset Sepsis (LOS)',
    'Infectious Disease',
    'Sepsis after 72 h, predominantly in VLBW infants — CoNS, MRSA, Candida cover, line management, and antifungal prophylaxis criteria.'
  ),
  stub(
    'nicu-meningitis',
    'Neonatal Meningitis',
    'Infectious Disease',
    'Bacterial meningitis in the first 28 days — LP indications, CSF interpretation, ampicillin + cefotaxime + aciclovir, and duration of therapy.'
  ),
  stub(
    'nicu-torch',
    'TORCH / Congenital Infections',
    'Infectious Disease',
    'Toxoplasma, CMV, HSV, syphilis, rubella, and Zika — when to screen, targeted investigations, and treatment per pathogen.'
  ),

  // ─── 4. Neurology ─────────────────────────────────────────────────────────
  stub(
    'nicu-hie',
    'Hypoxic-Ischemic Encephalopathy (HIE) + Therapeutic Hypothermia',
    'Neurology',
    'Perinatal asphyxia with encephalopathy ≥ 36 weeks — Thompson score, cooling eligibility, 72-hour protocol, phenobarbital, EEG monitoring, and prognostication.'
  ),
  stub(
    'nicu-seizures',
    'Neonatal Seizures',
    'Neurology',
    'Acute neonatal seizure management — phenobarbital load, levetiracetam, midazolam, EEG-confirmed seizures vs. clinical, and aetiology workup.'
  ),
  stub(
    'nicu-ivh',
    'Intraventricular Hemorrhage (IVH)',
    'Neurology',
    'IVH grading (Papile I–IV) in preterm infants — prevention (antenatal steroids, haemodynamic stability), cranial US surveillance, and post-haemorrhagic hydrocephalus management.'
  ),
  stub(
    'nicu-nows',
    'Neonatal Abstinence Syndrome / NOWS',
    'Neurology',
    'Neonatal opioid withdrawal — Finnegan/MOTHER NAS scoring, non-pharmacological care, morphine / methadone weaning protocol, and discharge criteria.'
  ),

  // ─── 5. GI & Hepatology ───────────────────────────────────────────────────
  stub(
    'nicu-jaundice',
    'Neonatal Jaundice (Hyperbilirubinemia)',
    'GI & Hepatology',
    'Pathological jaundice management in the NICU — isoimmune haemolytic disease, intensive phototherapy, exchange transfusion indications, and IVIG for HDN.'
  ),
  stub(
    'nicu-nec',
    'Necrotizing Enterocolitis (NEC)',
    'GI & Hepatology',
    'Acute intestinal emergency in the preterm — Bell staging, NPO + broad-spectrum antibiotics (pip-tazo + metronidazole), surgical criteria, and TPN support.'
  ),
  stub(
    'nicu-cholestasis',
    'Neonatal Cholestasis / Conjugated Hyperbilirubinemia',
    'GI & Hepatology',
    'Conjugated bilirubin > 1 mg/dL or > 20% total — biliary atresia exclusion (hepatobiliary scan / Kasai timing), PFIC, Alagille, and TPN-associated cholestasis management.'
  ),
  stub(
    'nicu-gi-obstruction',
    'Surgical GI — Bilious Vomiting / Intestinal Obstruction',
    'GI & Hepatology',
    'Bilious vomiting in the neonate — malrotation / volvulus (surgical emergency), duodenal atresia, Hirschsprung disease — immediate stabilisation and surgical referral pathway.'
  ),

  // ─── 6. Hematology ────────────────────────────────────────────────────────
  stub(
    'nicu-hdn',
    'Hemolytic Disease of the Newborn (HDN / ABO / Rh)',
    'Hematology',
    'Isoimmune haemolytic disease — Coombs test, bilirubin trajectory, phototherapy vs. exchange transfusion, IVIG, and anaemia follow-up.'
  ),
  stub(
    'nicu-thrombocytopenia',
    'Neonatal Thrombocytopenia (NAIT + Sepsis)',
    'Hematology',
    'Platelet count < 150 in the neonate — early vs. late, NAIT (anti-HPA-1a), sepsis-related, and platelet transfusion thresholds by clinical context.'
  ),
  stub(
    'nicu-anemia',
    'Neonatal Anemia',
    'Hematology',
    'Acute (haemorrhage, haemolysis) vs. anaemia of prematurity — transfusion thresholds by gestation/age, EPO role, and iron supplementation.'
  ),
  stub(
    'nicu-dic',
    'Neonatal DIC / Coagulopathy',
    'Hematology',
    'Disseminated intravascular coagulation in sick neonates — FFP, cryoprecipitate, platelet targets, vitamin K, and trigger identification.'
  ),
  stub(
    'nicu-polycythemia',
    'Polycythemia / Hyperviscosity Syndrome',
    'Hematology',
    'Venous haematocrit > 65% — symptomatic vs. asymptomatic approach, partial exchange transfusion (normal saline), and threshold controversies.'
  ),

  // ─── 7. Endocrine & Metabolic ─────────────────────────────────────────────
  stub(
    'nicu-hypoglycemia',
    'Neonatal Hypoglycemia',
    'Endocrine & Metabolic',
    'Blood glucose < 47 mg/dL in the neonate — risk stratification (IDM, SGA, preterm), oral dextrose gel, IV dextrose bolus + infusion, and hyperinsulinism workup.'
  ),
  stub(
    'nicu-cah',
    'Congenital Adrenal Hyperplasia (CAH)',
    'Endocrine & Metabolic',
    '21-hydroxylase deficiency presenting as salt-wasting crisis — emergency hydrocortisone, saline resuscitation, hyperkalemia management, and NBS confirmation.'
  ),
  stub(
    'nicu-hypothyroidism',
    'Congenital Hypothyroidism',
    'Endocrine & Metabolic',
    'NBS-detected or clinical hypothyroidism — levothyroxine dosing by weight, TSH targets, monitoring schedule, and maternal iodine deficiency context.'
  ),
  stub(
    'nicu-iem',
    'Neonatal IEM — Metabolic Crisis Presentation',
    'Endocrine & Metabolic',
    'Inborn error of metabolism presenting in the first days — MSUD, organic acidaemias, urea cycle defects — emergency glucose/bicarbonate, protein hold, and metabolic team activation.'
  ),

  // ─── 8. Fluid, Electrolytes & Renal ──────────────────────────────────────
  stub(
    'nicu-electrolytes',
    'Neonatal Electrolyte Disturbances',
    'Fluid, Electrolytes & Renal',
    'Hypo/hypernatraemia, hypocalcaemia, hyperkalaemia, and hypomagnesaemia in the NICU — neonatal-specific thresholds, correction rates, and monitoring.'
  ),
  stub(
    'nicu-aki',
    'Neonatal AKI / Oliguria',
    'Fluid, Electrolytes & Renal',
    'AKI in the neonate — KDIGO neonatal criteria, pre-renal vs. intrinsic vs. obstructive, aminoglycoside nephrotoxicity, fluid challenge, and peritoneal dialysis thresholds.'
  ),
  stub(
    'nicu-hypertension',
    'Neonatal Hypertension',
    'Fluid, Electrolytes & Renal',
    'BP > 95th percentile by gestational age — secondary causes (RVT, coarctation, medications), oral amlodipine / hydralazine, and hypertensive urgency management.'
  ),

  // ─── 9. Nutrition & Growth ────────────────────────────────────────────────
  stub(
    'nicu-tpn',
    'Parenteral Nutrition Management',
    'Nutrition & Growth',
    'TPN initiation, macronutrient targets by gestation, lipid emulsion, PN-associated cholestasis prevention, and cycling for the stable NICU infant.'
  ),
  stub(
    'nicu-enteral-feeding',
    'Enteral Feeding in the Preterm Infant',
    'Nutrition & Growth',
    'Minimal enteral nutrition, feed advancement rates by weight, fortification, breastmilk preference, and NEC risk mitigation strategy.'
  ),
  stub(
    'nicu-iugr',
    'IUGR / SGA — Growth & Nutrition Strategy',
    'Nutrition & Growth',
    'Intrauterine growth restriction and small-for-gestational-age — hypoglycaemia surveillance, catch-up nutrition targets, Fenton charting, and discharge weight criteria.'
  ),
];
