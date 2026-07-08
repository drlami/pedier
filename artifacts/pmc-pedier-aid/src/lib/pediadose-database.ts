// PediaDose — General Paediatric Drug Reference (ages 0–18)
// Dosing sourced from: Harriet Lane Handbook, 22nd/23rd ed., Chapter 30 "Drug Dosages".
// For neonatal (PMA/PNA-based) dosing, use NeoDose instead — this reference is for general
// paediatric (weight + age in years) dosing and intentionally does not duplicate NeoDose's scope.
// ALL doses must be verified against local pharmacy / paediatrician policy before clinical use.

import type { LevelGuidance, LevelTable, DoseAdjustmentTable, DoseAdjustmentRow } from './nicu/neodose-database';

export type { LevelGuidance, LevelTable, DoseAdjustmentTable, DoseAdjustmentRow };

export type PediaCategory =
  | 'Antibiotic'
  | 'Antifungal'
  | 'Antiviral'
  | 'Seizure'
  | 'Respiratory'
  | 'Analgesia & Sedation'
  | 'Cardiovascular'
  | 'Haematology & Anticoagulation'
  | 'Neurology'
  | 'Endocrine'
  | 'Allergy & Anaphylaxis';

export const PEDIA_CATEGORIES: PediaCategory[] = [
  'Antibiotic',
  'Antifungal',
  'Antiviral',
  'Seizure',
  'Respiratory',
  'Analgesia & Sedation',
  'Cardiovascular',
  'Haematology & Anticoagulation',
  'Neurology',
  'Endocrine',
  'Allergy & Anaphylaxis',
];

export interface PediaDoseResult {
  dosePerKg: string;
  totalDose: string;
  interval: string;
  route: string;
  concentration: string;
  basisNote: string;
  maxDose?: string;
  warningNote?: string;
  infusionNote?: string;
}

export interface PediatricDrug {
  id: string;
  name: string;
  brandName?: string;
  category: PediaCategory;
  indications: string[];
  administration: string;
  monitoring: string[];
  cautions: string[];
  references: string[];
  /** Reference-only adult dosing text from Harriet Lane — not calculated, shown as-is for context (e.g. adolescents approaching adult dosing). */
  adultDose?: string;
  levelGuidance?: LevelGuidance;
  calculate: (weightKg: number, ageYears: number) => PediaDoseResult;
}

// ─── helpers ────────────────────────────────────────────────────────────────

const mL = (totalMg: number, mgPerMl: number) =>
  `${(totalMg / mgPerMl).toFixed(2)} mL`;

const capDose = (totalMg: number, maxMg?: number): { value: number; capped: boolean } => {
  if (maxMg !== undefined && totalMg > maxMg) return { value: maxMg, capped: true };
  return { value: totalMg, capped: false };
};

// ─── drug database ───────────────────────────────────────────────────────────

export const pediatricDrugs: PediatricDrug[] = [
  // ─── Antibiotics ────────────────────────────────────────────────────────
  {
    id: 'amoxicillin',
    name: 'Amoxicillin',
    category: 'Antibiotic',
    indications: ['Otitis media, sinusitis, community-acquired pneumonia (standard-dose)', 'High-dose regimen for resistant S. pneumoniae', 'Streptococcal pharyngitis/tonsillitis'],
    administration: 'Standard dose for mild-moderate infection; high-dose (80–90 mg/kg/24h) regimen used empirically for AOM/sinusitis/CAP given rising pneumococcal resistance. Take without regard to food.',
    monitoring: ['Clinical response at 48–72h', 'Renal function if renally impaired (dose adjustment needed)'],
    cautions: [
      'Renally excreted — reduce dose in renal impairment',
      'Rash risk increased with concurrent EBV/mononucleosis or allopurinol',
      'High-dose regimen recommended empirically given rising pneumococcal resistance',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Mild/moderate: 250 mg Q8h or 500 mg Q12h. Severe: 500 mg Q8h or 875 mg Q12h. Max 2–3 g/24h.',
    calculate: (weight) => {
      const stdLow = weight * 25;
      const stdHigh = weight * 50;
      const hdLow = weight * 80;
      const hdHigh = Math.min(weight * 90, 3000);
      return {
        dosePerKg: 'Standard: 25–50 mg/kg/24h ÷ Q8–12h | High-dose (resistant pneumococci): 80–90 mg/kg/24h ÷ Q8–12h',
        totalDose: `Standard: ${stdLow.toFixed(0)}–${stdHigh.toFixed(0)} mg/24h | High-dose: ${hdLow.toFixed(0)}–${hdHigh.toFixed(0)} mg/24h`,
        interval: 'Q8–12h',
        route: 'PO',
        concentration: '125/250 mg per 5 mL or 200/400 mg per 5 mL suspension; 250/500 mg capsules; 500/875 mg tablets',
        basisNote: 'High-dose regimen is now favoured empirically for AOM, sinusitis and CAP',
        maxDose: 'Standard: 2–3 g/24h | High-dose: 3 g/24h (some experts to 4 g/24h)',
        warningNote: 'Rash more common with concurrent EBV infection or allopurinol use.',
      };
    },
  },
  {
    id: 'co-amoxiclav',
    name: 'Co-amoxiclav',
    brandName: 'Amoxicillin-Clavulanic Acid',
    category: 'Antibiotic',
    indications: ['Otitis media, sinusitis, community-acquired pneumonia', 'Animal/human bites', 'Skin and soft tissue infection'],
    administration: 'Dose expressed as the amoxicillin component. Use the 14:1 formulation for high-dose regimens to limit clavulanate-related diarrhoea. BID dosing causes less diarrhoea than TID.',
    monitoring: ['LFTs if hepatic dysfunction suspected', 'GI tolerance (diarrhoea common)'],
    cautions: [
      'Contraindicated with a history of cholestatic jaundice/hepatic dysfunction from this drug',
      'Extended-release tablet contraindicated if CrCl <30 mL/min',
      'Clavulanate dose (not amoxicillin) determines diarrhoea risk — higher-ratio formulations reduce this',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '250–500 mg Q8h or 875 mg Q12h; extended-release 2g Q12h for specific indications.',
    calculate: (weight) => {
      const stdLow = weight * 25;
      const stdHigh = weight * 45;
      const hdDaily = weight * 90;
      return {
        dosePerKg: 'Standard: 25–45 mg/kg/24h ÷ Q12h (or 20–40 mg/kg/24h ÷ Q8h) | High-dose (14:1 formulation): 90 mg/kg/24h ÷ Q8–12h',
        totalDose: `Standard: ${stdLow.toFixed(0)}–${stdHigh.toFixed(0)} mg/24h | High-dose: ${hdDaily.toFixed(0)} mg/24h`,
        interval: 'Q8–12h',
        route: 'PO',
        concentration: '125/250 mg per 5 mL (TID formulation) or 200/400 mg per 5 mL (BID formulation, 7:1 ratio) suspension; 875 mg tablets (BID)',
        basisNote: 'Dose expressed as the amoxicillin component; use the 14:1 formulation for high-dose regimens',
        warningNote: 'Contraindicated in prior cholestatic jaundice/hepatic dysfunction attributed to this drug. BID dosing causes less diarrhoea than TID.',
      };
    },
  },
  {
    id: 'ampicillin',
    name: 'Ampicillin',
    category: 'Antibiotic',
    indications: ['Community-acquired pneumonia', 'Meningitis / severe systemic infection', 'Endocarditis prophylaxis (high-risk procedures)'],
    administration: 'IV/IM. Higher doses and shorter intervals used for CNS disease/meningitis. Oral form also exists (50–100 mg/kg/24h ÷ Q6h, max 2 g/24h PO) but is less commonly used than amoxicillin for oral therapy.',
    monitoring: ['Renal function (dose adjustment in renal impairment)', 'Clinical response / repeat cultures as indicated'],
    cautions: [
      'Adjust dose in renal impairment',
      'Rash common with concurrent EBV infection or allopurinol',
      'Endocarditis prophylaxis (high-risk GU/GI procedures): 50 mg/kg (max 2 g) IV/IM 30 min pre-procedure, plus gentamicin',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'IM/IV 500 mg–3 g Q4–6h, max 14 g/24h; PO 250–500 mg Q6h.',
    calculate: (weight) => {
      const stdLow = weight * 100;
      const stdHigh = Math.min(weight * 200, 8000);
      const sevLow = weight * 300;
      const sevHigh = Math.min(weight * 400, 12000);
      return {
        dosePerKg: 'Standard: 100–200 mg/kg/24h ÷ Q6h | Severe/meningitis: 300–400 mg/kg/24h ÷ Q4–6h',
        totalDose: `Standard: ${stdLow.toFixed(0)}–${stdHigh.toFixed(0)} mg/24h | Severe: ${sevLow.toFixed(0)}–${sevHigh.toFixed(0)} mg/24h`,
        interval: 'Q4–6h',
        route: 'IV/IM',
        concentration: '125/250/500 mg, 1 g, 2 g vials',
        basisNote: 'Higher doses and shorter intervals used for CNS disease/meningitis',
        maxDose: 'Standard 8 g/24h; severe/meningitis 12 g/24h',
        warningNote: 'CSF penetration is adequate only with inflamed meninges. Rash at 5–10 days is common, especially with concurrent EBV infection or allopurinol.',
      };
    },
  },
  {
    id: 'penicillin-v',
    name: 'Penicillin V',
    brandName: 'Phenoxymethylpenicillin',
    category: 'Antibiotic',
    indications: ['Group A streptococcal pharyngitis/tonsillitis', 'Rheumatic fever / pneumococcal prophylaxis (sickle cell, asplenia)'],
    administration: 'Take 1h before or 2h after meals — better GI absorption than penicillin G.',
    monitoring: ['Clinical response / symptom resolution'],
    cautions: [
      'Prophylaxis dosing (rheumatic fever, sickle cell/asplenia) is fixed, not weight-based: 125 mg BID (2mo–<3y), 250 mg BID (≥3y)',
      'Adjust dose in renal impairment',
      'Poor choice for infections requiring high/reliable serum levels — use IV penicillin G or amoxicillin instead',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '125–500 mg/dose Q6–8h.',
    calculate: (weight) => {
      const low = weight * 25;
      const high = Math.min(weight * 75, 2000);
      return {
        dosePerKg: '25–75 mg/kg/24h ÷ Q6–8h',
        totalDose: `${low.toFixed(0)}–${high.toFixed(0)} mg/24h`,
        interval: 'Q6–8h',
        route: 'PO',
        concentration: '125/250 mg per 5 mL oral solution; 250/500 mg tablets',
        basisNote: 'GAS pharyngitis: <27 kg 250 mg BID–TID ×10 days; ≥27 kg 500 mg BID–TID ×10 days',
        maxDose: '2 g/24h',
        warningNote: 'Rheumatic fever/pneumococcal prophylaxis uses fixed low-dose regimens (125–250 mg BID) rather than weight-based dosing.',
      };
    },
  },
  {
    id: 'benzylpenicillin',
    name: 'Benzylpenicillin',
    brandName: 'Penicillin G',
    category: 'Antibiotic',
    indications: ['Streptococcal/pneumococcal infections', 'Meningitis (susceptible organisms)', 'Neurosyphilis'],
    administration: 'IV/IM. Half-life is short (~30 min) — reliable Q4–6h dosing is important.',
    monitoring: ['Renal function (dose adjustment)', 'Electrolytes — significant potassium/sodium load with high doses'],
    cautions: [
      'Meningitis/neurosyphilis use the higher end of the range with Q4–6h dosing',
      'Adjust dose in renal impairment',
      'High-dose regimens carry a significant potassium or sodium load — monitor electrolytes',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Moderate/severe infection: 12–24 million units/24h ÷ Q4–6h; neurosyphilis 18–24 million units/24h ÷ Q4h.',
    calculate: (weight) => {
      const low = weight * 100000;
      const high = weight * 400000;
      return {
        dosePerKg: '100,000–400,000 units/kg/24h ÷ Q4–6h (higher end and Q4h for meningitis/severe infection)',
        totalDose: `${(low / 1e6).toFixed(2)}–${(high / 1e6).toFixed(2)} million units/24h`,
        interval: 'Q4–6h',
        route: 'IV/IM',
        concentration: '5 or 20 million unit vials (1.7 mEq K per million units, or low-sodium formulation available)',
        basisNote: 'Standard infant/child/adolescent dosing',
        maxDose: '24 million units/24h',
        warningNote: 'Half-life is short (~30 min) — reliable Q4–6h dosing is important. Adjust dose in renal impairment.',
      };
    },
  },
  {
    id: 'piperacillin-tazobactam',
    name: 'Piperacillin-Tazobactam',
    category: 'Antibiotic',
    indications: ['Intra-abdominal infection', 'Nosocomial pneumonia', 'Febrile neutropenia (broad empiric coverage)'],
    administration: 'IV. Dose expressed as the piperacillin component (8:1 ratio). Lengthen infusion to 4h for resistant organisms.',
    monitoring: ['Renal function', 'Electrolytes (significant sodium load)'],
    cautions: [
      'Adjust dose in renal impairment',
      'Not adequate for CNS infections',
      'Cystic fibrosis dosing is higher: 350–600 mg/kg/24h ÷ Q4–6h, max 24 g/24h',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Intra-abdominal/soft tissue: 3g Q6h. Nosocomial pneumonia: 4g Q6h.',
    calculate: (weight, age) => {
      const perDose = age < 0.75 ? 80 : 100;
      const dose = Math.min(weight * perDose, 4000);
      return {
        dosePerKg: `${perDose} mg/kg/dose (piperacillin component, max 4000 mg/dose) IV Q6h`,
        totalDose: `${dose.toFixed(0)} mg/dose`,
        interval: 'Q6h (lengthen infusion to 4h for resistant organisms)',
        route: 'IV',
        concentration: '2g/0.25g, 3g/0.375g, 4g/0.5g piperacillin/tazobactam vials (8:1 ratio)',
        basisNote: age < 0.75 ? 'Age 2–9 months' : 'Age >9 months',
        maxDose: '16 g/24h',
        warningNote: 'Adjust dose in renal impairment. CSF penetration is inadequate — not for meningitis. Dose expressed as the piperacillin component.',
      };
    },
  },
  {
    id: 'cefalexin',
    name: 'Cefalexin',
    brandName: 'Cephalexin',
    category: 'Antibiotic',
    indications: ['Skin/soft tissue infection', 'Urinary tract infection', 'Streptococcal pharyngitis'],
    administration: 'Take on an empty stomach (2h before or 1h after meals).',
    monitoring: ['Clinical response', 'Renal function if impaired'],
    cautions: [
      'Adjust dose in renal impairment',
      'Endocarditis prophylaxis: 50 mg/kg (max 2 g) PO 30–60 min pre-procedure',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '1–4 g/24h ÷ Q6h; max 4 g/24h.',
    calculate: (weight) => {
      const low = weight * 25;
      const high = Math.min(weight * 50, 2000);
      const sevLow = weight * 75;
      const sevHigh = Math.min(weight * 100, 4000);
      return {
        dosePerKg: 'Mild–moderate: 25–50 mg/kg/24h ÷ Q6h | Severe: 75–100 mg/kg/24h ÷ Q6h',
        totalDose: `Mild–moderate: ${low.toFixed(0)}–${high.toFixed(0)} mg/24h | Severe: ${sevLow.toFixed(0)}–${sevHigh.toFixed(0)} mg/24h`,
        interval: 'Q6h (Q8–12h acceptable for uncomplicated infection)',
        route: 'PO',
        concentration: '125/250 mg per 5 mL suspension; 250/500/750 mg capsules; 250/500 mg tablets',
        basisNote: 'UTI dosing: 25 mg/kg/dose Q6–8h, max 1 g/dose',
        maxDose: 'Mild–moderate 2 g/24h; severe 4 g/24h',
      };
    },
  },
  {
    id: 'cefuroxime',
    name: 'Cefuroxime',
    category: 'Antibiotic',
    indications: ['Otitis media, sinusitis (oral)', 'Community-acquired pneumonia (IV, mild-moderate)', 'Skin/soft tissue infection'],
    administration: 'IV/IM dosing shown as primary. Oral (cefuroxime axetil, child 3mo–12y): 20–30 mg/kg/24h ÷ Q12h, max 1g/24h — NOT bioequivalent mg-for-mg with the IV form, cannot be substituted directly.',
    monitoring: ['Clinical response', 'Renal function'],
    cautions: [
      'Not recommended for meningitis (inadequate CSF penetration)',
      'Oral and IV forms are NOT interchangeable mg-for-mg',
      'Antacids/H2 blockers/PPIs reduce oral absorption',
      'Adjust dose in renal impairment',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'IV: 750–1500 mg/dose Q8h, max 9 g/24h. Oral: 250–500 mg BID, max 1 g/24h.',
    calculate: (weight) => {
      const low = weight * 75;
      const high = Math.min(weight * 100, 1500);
      const sevLow = weight * 100;
      const sevHigh = Math.min(weight * 200, 1500);
      return {
        dosePerKg: 'IV/IM mild–moderate: 75–100 mg/kg/24h ÷ Q8h | Severe: 100–200 mg/kg/24h ÷ Q6–8h',
        totalDose: `Mild–moderate: ${low.toFixed(0)}–${high.toFixed(0)} mg/24h | Severe: ${sevLow.toFixed(0)}–${sevHigh.toFixed(0)} mg/24h`,
        interval: 'Q6–8h',
        route: 'IV/IM (oral cefuroxime axetil is a separate, non-interchangeable regimen)',
        concentration: 'IV: 0.75/1.5 g vials | PO: 125/250 mg tablets',
        basisNote: 'IV dosing shown; switch to oral cefuroxime axetil only using its own separate dosing regimen',
        maxDose: 'IV max 1500 mg/dose',
        warningNote: 'Not recommended for meningitis. Oral suspension and tablets are not bioequivalent to each other or to the IV form.',
      };
    },
  },
  {
    id: 'cefixime',
    name: 'Cefixime',
    category: 'Antibiotic',
    indications: ['Urinary tract infection', 'Otitis media / respiratory tract infection (second-line)'],
    administration: 'PO. Do not use tablets for otitis media (reduced bioavailability).',
    monitoring: ['Clinical/microbiological response'],
    cautions: ['Adjust dose in renal impairment', 'Do not use tablets for otitis media'],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '400 mg/24h ÷ Q12–24h.',
    calculate: (weight) => {
      const daily = Math.min(weight * 8, 400);
      return {
        dosePerKg: '8 mg/kg/24h ÷ Q12–24h',
        totalDose: `${daily.toFixed(0)} mg/24h`,
        interval: 'Q12–24h',
        route: 'PO',
        concentration: '100/200/500 mg per 5 mL suspension; 400 mg capsules; 100/200 mg chewable tablets',
        basisNote: 'Age >6 months',
        maxDose: '400 mg/24h',
        warningNote: 'For acute UTI, an alternative regimen of 16 mg/kg/24h ÷ Q12h on day 1 then 8 mg/kg/24h once daily for 13 more days is described.',
      };
    },
  },
  {
    id: 'cefdinir',
    name: 'Cefdinir',
    category: 'Antibiotic',
    indications: ['Otitis media, sinusitis, pharyngitis/tonsillitis', 'Skin/soft tissue infection'],
    administration: 'PO. Space iron/vitamins with iron and aluminium/magnesium antacids by 2h — reduces absorption.',
    monitoring: ['Clinical response'],
    cautions: [
      'Not recommended as empiric monotherapy for AOM/sinusitis in some guidelines — verify local protocol',
      'Adjust dose in renal impairment',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '600 mg/24h ÷ Q12–24h (Q12h for CAP/UTI/skin infection).',
    calculate: (weight) => {
      const daily = Math.min(weight * 14, 600);
      return {
        dosePerKg: '14 mg/kg/24h ÷ Q12–24h',
        totalDose: `${daily.toFixed(0)} mg/24h`,
        interval: 'Q12–24h',
        route: 'PO',
        concentration: '125/250 mg per 5 mL suspension; 300 mg capsules',
        basisNote: 'Age 6 months–12 years',
        maxDose: '600 mg/24h',
        warningNote: 'May cause harmless red-coloured stools with concurrent iron. Space from iron/antacids by 2h.',
      };
    },
  },
  {
    id: 'cefotaxime',
    name: 'Cefotaxime',
    category: 'Antibiotic',
    indications: ['Meningitis', 'Sepsis / severe systemic infection', 'Community-acquired pneumonia (severe)'],
    administration: 'IV/IM. Good CNS penetration.',
    monitoring: ['Renal function', 'Clinical/microbiological response'],
    cautions: [
      'Adjust dose in renal impairment',
      'Use age ≥12y or ≥50kg adult dosing above that threshold',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '1–2 g/dose Q6–8h; severe 2g Q4–6h; max 12 g/24h.',
    calculate: (weight) => {
      const stdLow = weight * 150;
      const stdHigh = Math.min(weight * 200, 12000);
      const mengDaily = Math.min(weight * 200, 12000);
      return {
        dosePerKg: 'Standard: 150–200 mg/kg/24h ÷ Q6–8h | Meningitis: 200 mg/kg/24h ÷ Q6h',
        totalDose: `Standard: ${stdLow.toFixed(0)}–${stdHigh.toFixed(0)} mg/24h | Meningitis: ${mengDaily.toFixed(0)} mg/24h`,
        interval: 'Q6–8h (Q6h for meningitis)',
        route: 'IV/IM',
        concentration: '1 g, 2 g vials',
        basisNote: 'Age 1 month–12 years, <50 kg',
        maxDose: '12 g/24h',
        warningNote: 'Good CNS penetration. Higher-dose regimens (225–300 mg/kg/24h) used with vancomycin for resistant pneumococcal meningitis.',
      };
    },
  },
  {
    id: 'ceftriaxone',
    name: 'Ceftriaxone',
    category: 'Antibiotic',
    indications: ['Meningitis', 'Community-acquired pneumonia (severe)', 'Complicated urinary tract infection', 'Lyme disease (severe/neurologic)'],
    administration: 'IV/IM.',
    monitoring: ['Renal function', 'Bilirubin in young infants', 'Gallbladder ultrasound if biliary symptoms develop with prolonged use'],
    cautions: [
      'Contraindicated in neonatal hyperbilirubinaemia',
      'Never co-administer with IV calcium in neonates <28 days, even at different times/lines',
      'Higher biliary excretion (35–45%) than other cephalosporins — risk of biliary sludging/pseudocholelithiasis with prolonged use',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '1–2 g/dose Q12–24h; max 2 g/dose, 4 g/24h.',
    calculate: (weight) => {
      const mmLow = weight * 50;
      const mmHigh = Math.min(weight * 75, 2000);
      const sevDaily = Math.min(weight * 100, 4000);
      return {
        dosePerKg: 'Mild–moderate: 50–75 mg/kg/24h ÷ Q12–24h | Severe/meningitis: 100 mg/kg/24h ÷ Q12h',
        totalDose: `Mild–moderate: ${mmLow.toFixed(0)}–${mmHigh.toFixed(0)} mg/24h | Severe: ${sevDaily.toFixed(0)} mg/24h`,
        interval: 'Q12–24h (Q12h for meningitis)',
        route: 'IV/IM',
        concentration: '0.25/0.5/1/2 g vials',
        basisNote: 'Age >1 month',
        maxDose: 'Mild–moderate 2 g/24h; severe/meningitis 2 g/dose, 4 g/24h',
        warningNote: 'CONTRAINDICATED in neonatal hyperbilirubinaemia. Do NOT co-administer with IV calcium-containing solutions in neonates <28 days (fatal precipitation risk).',
      };
    },
  },
  {
    id: 'ceftazidime',
    name: 'Ceftazidime',
    category: 'Antibiotic',
    indications: ['Pseudomonas infection', 'Febrile neutropenia (empiric)', 'Cystic fibrosis pulmonary exacerbation', 'Meningitis (susceptible gram-negatives)'],
    administration: 'IV/IM. Good Pseudomonas coverage and CSF penetration.',
    monitoring: ['Renal function (critical — neurotoxicity at elevated levels)', 'Clinical/microbiological response'],
    cautions: [
      'Adjust dose in renal impairment — accumulation causes neuromuscular excitability/nonconvulsive status epilepticus',
      'Good CSF penetration — meningitis dosing 150–200 mg/kg/24h ÷ Q8h, max 6 g/24h',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '1–2 g/dose Q8–12h; max 6 g/24h.',
    calculate: (weight) => {
      const mmLow = weight * 100;
      const mmHigh = Math.min(weight * 150, 6000);
      const sevLow = weight * 200;
      const sevHigh = Math.min(weight * 300, 12000);
      return {
        dosePerKg: 'Mild–moderate: 100–150 mg/kg/24h ÷ Q8h | Serious Pseudomonas/CF: 200–300 mg/kg/24h ÷ Q8h (CF up to 400 mg/kg/24h)',
        totalDose: `Mild–moderate: ${mmLow.toFixed(0)}–${mmHigh.toFixed(0)} mg/24h | Serious: ${sevLow.toFixed(0)}–${sevHigh.toFixed(0)} mg/24h`,
        interval: 'Q8h',
        route: 'IV/IM',
        concentration: '1/2/6 g vials',
        basisNote: 'Age >1 month',
        maxDose: 'Mild–moderate/meningitis 6 g/24h; serious Pseudomonas/CF 12 g/24h',
        warningNote: 'Elevated levels associated with nonconvulsive status epilepticus/neuromuscular excitability — adjust dose in renal impairment.',
      };
    },
  },
  {
    id: 'gentamicin',
    name: 'Gentamicin',
    category: 'Antibiotic',
    indications: ['Gram-negative sepsis (synergy/empiric coverage)', 'Cystic fibrosis pulmonary exacerbation'],
    administration: 'IV/IM.',
    monitoring: ['Peak level 30–60 min after the 3rd dose', 'Trough level 30 min before the 3rd dose', 'Renal function (BUN/creatinine)', 'Hearing with prolonged therapy'],
    cautions: [
      'Nephrotoxicity and ototoxicity risk increases with loop diuretics and prolonged therapy',
      'Adjust dose (and consider extended-interval dosing) in renal impairment',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '3–6 mg/kg/24h ÷ Q8h (eGFR > 75 mL/min/1.73m²).',
    levelGuidance: {
      tables: [
        {
          title: 'Therapeutic level targets',
          columns: ['Sampling point', 'Target'],
          rows: [
            ['Peak (general infections)', '6–10 mg/L'],
            ['Peak (pulmonary/CF, neutropenia, osteomyelitis, severe sepsis)', '8–10 mg/L'],
            ['Trough', '< 2 mg/L'],
          ],
        },
      ],
    },
    calculate: (weight) => {
      const daily = weight * 7.5;
      const perDose = daily / 3;
      return {
        dosePerKg: '7.5 mg/kg/24h ÷ Q8h (normal renal function)',
        totalDose: `${perDose.toFixed(1)} mg/dose (${daily.toFixed(1)} mg/24h)`,
        interval: 'Q8h',
        route: 'IV/IM',
        concentration: '10 mg/mL or 40 mg/mL injection',
        basisNote: 'Child dosing, eGFR > 75 mL/min/1.73m²',
        warningNote: 'Nephrotoxic and ototoxic — dose adjustment mandatory in renal impairment. Cystic fibrosis dosing is higher: 7.5–10.5 mg/kg/24h ÷ Q8h.',
      };
    },
  },
  {
    id: 'vancomycin-child',
    name: 'Vancomycin',
    category: 'Antibiotic',
    indications: ['Suspected/confirmed MRSA or resistant Gram-positive infection', 'CNS infection, endocarditis, osteomyelitis, septic arthritis (higher target)'],
    administration: 'IV, infuse over at least 60 minutes to reduce infusion reaction ("red man syndrome") risk.',
    monitoring: ['Trough level 30 min before the 4th dose (or ~3rd dose in infants with faster elimination)', 'Renal function', 'Hearing with prolonged high-dose therapy'],
    cautions: [
      'This entry is for general paediatric (1mo–12y) dosing — see NeoDose for neonatal PMA/PNA-based Vancomycin dosing and its KEMH nomogram',
      'Infuse over at least 60 minutes — rapid infusion causes "red man syndrome"',
      'Adjust dose/interval in renal impairment',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'General: 15 mg/kg/dose Q8–12h. Severe: 20 mg/kg/dose (max 2g) Q8–12h.',
    levelGuidance: {
      targetTable: {
        title: 'Goal trough by indication (assumes MIC ≤ 1 mg/L)',
        columns: ['Indication', 'Target trough'],
        rows: [
          ['Uncomplicated skin/soft tissue, bacteraemia, febrile neutropenia, sepsis', '10–14 mg/L'],
          ['CNS infection, endocarditis, pneumonia, osteomyelitis, septic arthritis', '14–17 mg/L'],
        ],
      },
      tables: [
        {
          title: 'Peak level targets (selected indications)',
          columns: ['Indication', 'Target peak'],
          rows: [
            ['Burns, non-responsive after 72h, persistent positive cultures', '20–50 mg/L'],
            ['CNS infection', 'Up to 30 mg/L'],
          ],
        },
      ],
    },
    calculate: (weight) => {
      const general = weight * 15;
      const severe = weight * 20;
      return {
        dosePerKg: 'General infection: 15 mg/kg/dose Q6h | CNS infection/endocarditis/osteomyelitis/pneumonia/septic arthritis: 20 mg/kg/dose Q6h',
        totalDose: `General: ${general.toFixed(0)} mg/dose | Severe: ${severe.toFixed(0)} mg/dose`,
        interval: 'Q6h (Q6–8h in adolescents >12y)',
        route: 'IV (infuse over ≥60 min)',
        concentration: '0.5–10 g vials for reconstitution',
        basisNote: 'Age 1 month–12 years',
        warningNote: 'Modern (2020 IDSA/PIDS/SIDP/ASHP) guidance favours an AUC24/MIC target of 400–600 mg·h/L over trough-only monitoring where available.',
      };
    },
  },
  {
    id: 'azithromycin',
    name: 'Azithromycin',
    category: 'Antibiotic',
    indications: ['Community-acquired pneumonia (atypical coverage)', 'Streptococcal pharyngitis (penicillin-allergic)', 'Pertussis'],
    administration: 'PO. Severe CAP: 10 mg/kg/dose IV once daily ≥2 days, then switch to oral to complete 5 days.',
    monitoring: ['QT interval if other QT-prolonging drugs are co-administered'],
    cautions: [
      'Pharyngitis/tonsillitis (GAS): 12 mg/kg/24h once daily ×5 days, max 500 mg/24h',
      'Pertussis: 10 mg/kg/dose once daily ×5 days (1–<6mo) or 10mg/kg day1 (max500mg) then 5mg/kg (max250mg) days 2–5 (≥6mo)',
      'Acute sinusitis: 10 mg/kg/dose (max 500 mg) once daily ×3 days',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Pharyngitis/skin: 500mg day1 then 250mg days2–5. CAP: as above or 500mg IV once daily.',
    calculate: (weight) => {
      const day1 = Math.min(weight * 10, 500);
      const day2to5 = Math.min(weight * 5, 250);
      return {
        dosePerKg: 'Day 1: 10 mg/kg (max 500 mg) once daily | Days 2–5: 5 mg/kg/24h (max 250 mg/24h) once daily',
        totalDose: `Day 1: ${day1.toFixed(0)} mg | Days 2–5: ${day2to5.toFixed(0)} mg/24h`,
        interval: 'Once daily',
        route: 'PO (or IV for severe CAP)',
        concentration: '100/200 mg per 5 mL suspension; 250/500/600 mg tablets',
        basisNote: 'Community-acquired pneumonia (≥3 months), 5-day course',
        maxDose: 'Day 1: 500 mg. Maintenance: 250 mg/24h.',
        warningNote: 'Different regimens apply for pertussis, pharyngitis, and sinusitis — see cautions.',
      };
    },
  },
  {
    id: 'clarithromycin',
    name: 'Clarithromycin',
    category: 'Antibiotic',
    indications: ['Otitis media, sinusitis, pharyngitis, pneumonia (macrolide-appropriate)', 'H. pylori eradication (combination therapy)'],
    administration: 'PO.',
    monitoring: ['QT interval with concurrent QT-prolonging drugs'],
    cautions: [
      'Contraindicated in erythromycin allergy or prior cholestatic jaundice with macrolide use',
      'H. pylori eradication: 20 mg/kg/24h ÷ Q12h ×7–14 days with amoxicillin + PPI ± metronidazole, max 1 g/24h',
      'Adjust dose in renal impairment',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '250–500 mg Q12h (IR); extended-release 1000 mg once daily.',
    calculate: (weight) => {
      const daily = Math.min(weight * 15, 1000);
      return {
        dosePerKg: '15 mg/kg/24h ÷ Q12h',
        totalDose: `${daily.toFixed(0)} mg/24h`,
        interval: 'Q12h',
        route: 'PO',
        concentration: '125/250 mg per 5 mL granules for suspension; 250/500 mg tablets; 500 mg extended-release tablets',
        basisNote: 'Standard infant/child dosing',
        maxDose: '1 g/24h',
        warningNote: 'QT prolongation risk — avoid with other QT-prolonging drugs. Contraindicated with a history of cholestatic jaundice from prior macrolide use.',
      };
    },
  },
  {
    id: 'erythromycin',
    name: 'Erythromycin',
    category: 'Antibiotic',
    indications: ['Pertussis (age ≥1 month)', 'Macrolide-susceptible respiratory/skin infection (penicillin-allergic)'],
    administration: 'PO, switch from IV to oral as soon as feasible; IV 15–20 mg/kg/24h ÷ Q6h, max 4 g/24h.',
    monitoring: ['QT interval', 'GI tolerance (common cause of discontinuation)'],
    cautions: [
      'Use azithromycin instead of erythromycin in infants <1 month (pyloric stenosis risk)',
      'Pertussis: 40–50 mg/kg/24h ÷ Q6h ×14 days, max 2 g/24h',
      'Adjust dose in renal impairment',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '2 g/24h ÷ Q6h ×14 days (pertussis); parenteral 15–20 mg/kg/24h ÷ Q6h.',
    calculate: (weight) => {
      const low = weight * 30;
      const high = Math.min(weight * 50, 4000);
      return {
        dosePerKg: '30–50 mg/kg/24h ÷ Q6–8h',
        totalDose: `${low.toFixed(0)}–${high.toFixed(0)} mg/24h`,
        interval: 'Q6–8h',
        route: 'PO (switch from IV to oral as soon as feasible)',
        concentration: 'Multiple salt forms (base, ethylsuccinate, stearate) — verify formulation-specific concentration with pharmacy',
        basisNote: 'Child dosing (not neonatal — use azithromycin instead of erythromycin for infants <1 month)',
        maxDose: '4 g/24h',
        warningNote: 'QT prolongation/torsades risk — avoid with other QT-prolonging drugs. Associated with hypertrophic pyloric stenosis in neonates.',
      };
    },
  },
  {
    id: 'meropenem',
    name: 'Meropenem',
    category: 'Antibiotic',
    indications: ['Meningitis / severe CNS infection', 'Cystic fibrosis pulmonary exacerbation', 'Intra-abdominal infection', 'Febrile neutropenia (empiric)'],
    administration: 'IV. Lengthen infusion to 4h for resistant organisms.',
    monitoring: ['Renal function', 'Clinical/microbiological response'],
    cautions: [
      'Contraindicated in carbapenem hypersensitivity/beta-lactam anaphylaxis',
      'Complicated skin/soft tissue: 10 mg/kg/dose (max 500 mg) Q8h, or 20 mg/kg (max 1g) for severe/necrotizing/Pseudomonas',
      'Adjust dose in renal impairment',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Skin: 500mg Q8h (1g for Pseudomonas). Intra-abdominal/neutropenia: 1g Q8h. Meningitis/severe: 2g Q8h.',
    calculate: (weight) => {
      const stdDose = Math.min(weight * 20, 1000);
      const sevDose = Math.min(weight * 40, 2000);
      return {
        dosePerKg: 'Intra-abdominal/mild–moderate/febrile neutropenia: 20 mg/kg/dose (max 1 g) Q8h | Meningitis/severe/CF exacerbation: 40 mg/kg/dose (max 2 g) Q8h',
        totalDose: `Standard: ${stdDose.toFixed(0)} mg/dose | Severe: ${sevDose.toFixed(0)} mg/dose`,
        interval: 'Q8h (lengthen infusion to 4h for resistant organisms)',
        route: 'IV',
        concentration: '0.5 g, 1 g vials',
        basisNote: 'Age ≥3 months',
        warningNote: 'Contraindicated in carbapenem hypersensitivity or anaphylaxis to beta-lactams. Good CSF penetration. Adjust dose in renal impairment.',
      };
    },
  },
  {
    id: 'metronidazole',
    name: 'Metronidazole',
    category: 'Antibiotic',
    indications: ['Anaerobic infection', 'C. difficile colitis', 'Giardiasis / amoebiasis'],
    administration: 'PO or IV.',
    monitoring: ['LFTs with prolonged/high-dose therapy', 'Neurological symptoms with prolonged use (peripheral neuropathy)'],
    cautions: [
      'Contraindicated in Cockayne syndrome',
      'C. difficile: 30 mg/kg/24h ÷ Q6h PO/IV ×10–14 days, max 2 g/24h',
      'Giardiasis: 15–30 mg/kg/24h ÷ TID ×5–7 days',
      'Reduce dose 50% in severe hepatic impairment (Child-Pugh C); adjust in renal impairment (GFR <10)',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '500–750 mg/dose Q8h (amoebiasis); C. difficile 125mg Q6h.',
    calculate: (weight) => {
      const poLow = weight * 30;
      const poHigh = Math.min(weight * 50, 2250);
      const ivLow = weight * 22.5;
      const ivHigh = Math.min(weight * 40, 4000);
      return {
        dosePerKg: 'PO: 30–50 mg/kg/24h ÷ Q8h | IV: 22.5–40 mg/kg/24h ÷ Q6–8h',
        totalDose: `PO: ${poLow.toFixed(0)}–${poHigh.toFixed(0)} mg/24h | IV: ${ivLow.toFixed(0)}–${ivHigh.toFixed(0)} mg/24h`,
        interval: 'Q6–8h',
        route: 'PO or IV (anaerobic infection dosing)',
        concentration: '50 mg/mL oral suspension; 250/500 mg tablets; 375 mg capsules; 5 mg/mL IV solution',
        basisNote: 'Anaerobic infection, infant/child/adolescent dosing',
        maxDose: 'PO 2250 mg/24h; IV 4 g/24h',
        warningNote: 'Contraindicated in Cockayne syndrome (fatal liver failure reported). Disulfiram-type reaction with alcohol for 24–48h post-dose.',
      };
    },
  },
  {
    id: 'clindamycin',
    name: 'Clindamycin',
    category: 'Antibiotic',
    indications: ['Skin/soft tissue infection (including suspected MRSA)', 'Anaerobic infection', 'Osteomyelitis / septic arthritis'],
    administration: 'PO or IV/IM (age >1 month). Do not exceed an IV infusion rate of 30 mg/min.',
    monitoring: ['Watch for C. difficile-associated diarrhoea', 'LFTs/renal function with severe hepatic or renal disease'],
    cautions: [
      'Not adequate for CNS infections/meningitis',
      'No longer recommended for dental prophylaxis',
      'Max IV infusion rate 30 mg/min',
      'Dose reduction only needed in severe (not mild-moderate) renal/hepatic disease',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'PO 600–1800mg/24h÷Q6-12h. IV/IM 1200–2700mg/24h÷Q6-12h.',
    calculate: (weight) => {
      const poLow = weight * 10;
      const poHigh = Math.min(weight * 40, 1800);
      const ivLow = weight * 20;
      const ivHigh = Math.min(weight * 40, 2700);
      return {
        dosePerKg: 'PO: 10–40 mg/kg/24h ÷ Q6–8h | IV/IM: 20–40 mg/kg/24h ÷ Q6–8h',
        totalDose: `PO: ${poLow.toFixed(0)}–${poHigh.toFixed(0)} mg/24h | IV: ${ivLow.toFixed(0)}–${ivHigh.toFixed(0)} mg/24h`,
        interval: 'Q6–8h',
        route: 'PO or IV/IM (age >1 month)',
        concentration: '75 mg/5 mL oral solution; 75/150/300 mg capsules; 150 mg/mL injection',
        basisNote: 'Standard infant (>1mo)/child/adolescent dosing',
        maxDose: 'PO 1.8 g/24h; IV 2.7 g/24h',
        warningNote: 'Not indicated for meningitis — poor CSF penetration. Do not exceed an IV infusion rate of 30 mg/min (hypotension/cardiac arrest reported).',
      };
    },
  },
  {
    id: 'co-trimoxazole',
    name: 'Co-trimoxazole',
    brandName: 'Trimethoprim-Sulfamethoxazole',
    category: 'Antibiotic',
    indications: ['Urinary tract infection', 'Pneumocystis jirovecii pneumonia (treatment/prophylaxis)', 'Skin/soft tissue infection (community MRSA)'],
    administration: 'PO or IV. Dose expressed as the trimethoprim (TMP) component.',
    monitoring: ['CBC (folate-related cytopenia risk with prolonged use)', 'Renal function'],
    cautions: [
      'Not recommended <2 months of age except for PCP prophylaxis',
      'Contraindicated in sulfonamide/TMP hypersensitivity, folate-deficiency megaloblastic anaemia, and G6PD deficiency (haemolysis risk)',
      'PCP prophylaxis: 150 mg/m²/24h ÷ BID on 3 consecutive days/week, max 320 mg/24h',
      'Adjust dose in renal impairment',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '160mg TMP BID (>40kg); PCP treatment 15-20mg TMP/kg/24h÷Q6-8h.',
    calculate: (weight) => {
      const low = weight * 8;
      const high = Math.min(weight * 12, 320);
      return {
        dosePerKg: '8–12 mg TMP/kg/24h ÷ BID (minor–moderate infection)',
        totalDose: `${(low / 2).toFixed(0)}–${(high / 2).toFixed(0)} mg TMP/dose`,
        interval: 'BID',
        route: 'PO or IV (dose expressed as the trimethoprim [TMP] component)',
        concentration: 'Suspension 40mg TMP/200mg SMX per 5mL; tablets 80mg TMP/400mg SMX (regular) or 160mg TMP/800mg SMX (DS); IV 16mg TMP + 80mg SMX per mL',
        basisNote: 'Minor–moderate infection dosing — not recommended <2 months (except PCP prophylaxis)',
        maxDose: '160 mg TMP/dose (minor–moderate)',
        warningNote: 'Severe infection/PCP treatment uses a much higher dose: 15–20 mg TMP/kg/24h ÷ Q6–8h ×21 days. Contraindicated in sulfonamide/TMP hypersensitivity and G6PD deficiency caution applies.',
      };
    },
  },
  {
    id: 'nitrofurantoin',
    name: 'Nitrofurantoin',
    category: 'Antibiotic',
    indications: ['Uncomplicated urinary tract infection (treatment and prophylaxis)'],
    administration: 'PO — give with food/milk to improve tolerance and absorption.',
    monitoring: ['Renal function before and during use', 'Pulmonary symptoms with long-term prophylactic use (rare pulmonary fibrosis)'],
    cautions: [
      'Contraindicated in GFR <60 mL/min/1.73m², infants <1 month, prior cholestatic jaundice from this drug',
      'G6PD deficiency caution (haemolytic anaemia risk)',
      'Not effective for upper UTI/pyelonephritis (does not achieve adequate tissue levels)',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Treatment: macrocrystal 50–100mg Q6h or dual-release 100mg Q12h. Prophylaxis: 50–100mg nightly.',
    calculate: (weight) => {
      const low = weight * 5;
      const high = Math.min(weight * 7, 400);
      return {
        dosePerKg: 'Treatment: 5–7 mg/kg/24h ÷ Q6h | Prophylaxis: 1–2 mg/kg/dose once nightly',
        totalDose: `Treatment: ${low.toFixed(0)}–${high.toFixed(0)} mg/24h`,
        interval: 'Q6h (treatment) or once nightly (prophylaxis)',
        route: 'PO — give with food/milk',
        concentration: '25 mg/5 mL suspension; 25/50/100 mg macrocrystal capsules',
        basisNote: 'Age >1 month',
        maxDose: 'Treatment 400 mg/24h; prophylaxis 100 mg/24h',
        warningNote: 'Contraindicated in significant renal impairment (GFR <60), infants <1 month, active/prior cholestatic jaundice from this drug, and at term in pregnancy.',
      };
    },
  },
  {
    id: 'doxycycline',
    name: 'Doxycycline',
    category: 'Antibiotic',
    indications: ['Rickettsial disease (including Rocky Mountain spotted fever) — drug of choice regardless of age', 'Lyme disease', 'Skin/soft tissue infection'],
    administration: 'PO or IV (same dose either route; infuse IV over 1–4h). Advise sun avoidance/protection.',
    monitoring: ['Dental development if repeated/prolonged courses given <8 years', 'LFTs in hepatic impairment'],
    cautions: [
      'Avoided <8 years for routine indications (tooth staining) — but remains drug of choice for rickettsial disease/RMSF at any age per AAP guidance',
      'Photosensitivity — advise sun avoidance/protection',
      'Caution in hepatic or renal disease',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '100 mg BID (>45 kg dosing).',
    calculate: (weight) => {
      const perDose = Math.min(weight * 2.2, 100);
      return {
        dosePerKg: '2.2 mg/kg/dose BID (≤45 kg)',
        totalDose: `${perDose.toFixed(1)} mg/dose`,
        interval: 'BID',
        route: 'PO or IV (infuse over 1–4h)',
        concentration: '25/50 mg per 5 mL suspension; 50/75/100/150 mg capsules/tablets; 100 mg injection',
        basisNote: 'Weight ≤45 kg; use fixed 100 mg BID dosing >45 kg',
        maxDose: '200 mg/24h',
        warningNote: 'Generally avoided <8 years (tooth enamel hypoplasia/discolouration) — BUT is the drug of choice for rickettsial disease at any age per AAP guidance.',
      };
    },
  },
  {
    id: 'ciprofloxacin',
    name: 'Ciprofloxacin',
    category: 'Antibiotic',
    indications: ['Complicated urinary tract infection / pyelonephritis', 'Cystic fibrosis pulmonary exacerbation (Pseudomonas)', 'Multidrug-resistant gram-negative infection (specialist-guided)'],
    administration: 'PO or IV.',
    monitoring: ['Tendon symptoms (pain, swelling) — stop immediately if suspected', 'Renal function'],
    cautions: [
      'Systemic fluoroquinolones carry a boxed warning for tendon rupture, peripheral neuropathy and CNS effects — reserve for situations without a suitable alternative',
      'Cystic fibrosis dosing: PO 40 mg/kg/24h ÷ Q12h (max 2g/24h); IV 30 mg/kg/24h ÷ Q8h (max 1.2g/24h)',
      'Use adjusted body weight for obese patients',
      'Adjust dose in renal impairment',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'PO 250–750mg Q12h. IV 400mg Q12h (Q8h severe).',
    calculate: (weight) => {
      const poLow = weight * 20;
      const poHigh = Math.min(weight * 40, 1500);
      const ivLow = weight * 18;
      const ivHigh = Math.min(weight * 30, 1200);
      return {
        dosePerKg: 'PO: 20–40 mg/kg/24h ÷ Q12h | IV: 18–30 mg/kg/24h ÷ Q8h',
        totalDose: `PO: ${poLow.toFixed(0)}–${poHigh.toFixed(0)} mg/24h | IV: ${ivLow.toFixed(0)}–${ivHigh.toFixed(0)} mg/24h`,
        interval: 'PO Q12h | IV Q8h',
        route: 'PO or IV',
        concentration: '250/500 mg per 5 mL suspension; 100/250/500/750 mg tablets; 200 mg/100 mL or 400 mg/200 mL premixed IV solution',
        basisNote: 'Complicated UTI/pyelonephritis dosing, 10–21 day course',
        maxDose: 'PO 1.5 g/24h; IV 1.2 g/24h',
        warningNote: 'Fluoroquinolones carry a risk of disabling, potentially permanent tendon, muscle, joint and CNS effects — use with caution in patients <18 years.',
      };
    },
  },

  {
    id: 'cefazolin',
    name: 'Cefazolin',
    category: 'Antibiotic',
    indications: ['Surgical prophylaxis', 'Susceptible Gram-positive skin/soft tissue and bone/joint infection'],
    administration: 'IV/IM (age >1 month).',
    monitoring: ['Renal function', 'Clinical/microbiological response'],
    cautions: [
      'Does not penetrate CSF well — not for meningitis',
      'Caution in renal impairment/penicillin allergy',
      'False-positive urine glucose (Clinitest/Benedict\'s/Fehling\'s) and Coombs test',
      'Use the higher end of dosing in obese patients',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '1–2 g/dose Q8h; max 12 g/24h.',
    calculate: (weight) => {
      const mmLow = weight * 25;
      const mmHigh = Math.min(weight * 100, 6000);
      const sevLow = weight * 100;
      const sevHigh = Math.min(weight * 150, 12000);
      return {
        dosePerKg: 'Mild–moderate: 25–100 mg/kg/24h ÷ Q6–8h | Severe (incl. bone/joint): 100–150 mg/kg/24h ÷ Q6–8h',
        totalDose: `Mild–moderate: ${mmLow.toFixed(0)}–${mmHigh.toFixed(0)} mg/24h | Severe: ${sevLow.toFixed(0)}–${sevHigh.toFixed(0)} mg/24h`,
        interval: 'Q6–8h',
        route: 'IV/IM',
        concentration: '0.5/1/10/100 g vials',
        basisNote: 'Age >1 month',
        maxDose: 'Mild–moderate 6 g/24h; severe 12 g/24h',
        warningNote: 'Endocarditis/dental prophylaxis: 50 mg/kg (max 1 g) IV/IM 30–60 min pre-procedure. Does not penetrate CSF well.',
      };
    },
  },
  {
    id: 'aztreonam',
    name: 'Aztreonam',
    category: 'Antibiotic',
    indications: ['Multidrug-resistant gram-negative infection', 'Severe penicillin allergy (low cross-reactivity with other beta-lactams)', 'Cystic fibrosis pulmonary exacerbation'],
    administration: 'IV/IM.',
    monitoring: ['Renal function', 'Clinical/microbiological response'],
    cautions: [
      'Low cross-allergenicity with other beta-lactams — useful in severe penicillin allergy',
      'Caution in arginase deficiency (contains L-arginine)',
      'Adjust dose in renal impairment',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Moderate 1–2g/dose Q8–12h; severe 2g/dose Q6–8h; max 8g/24h.',
    calculate: (weight) => {
      const low = weight * 90;
      const high = Math.min(weight * 120, 8000);
      return {
        dosePerKg: '90–120 mg/kg/24h ÷ Q6–8h',
        totalDose: `${low.toFixed(0)}–${high.toFixed(0)} mg/24h`,
        interval: 'Q6–8h',
        route: 'IV/IM',
        concentration: '1 g, 2 g vials (contains ~780 mg L-arginine per gram)',
        basisNote: 'Standard infant/child dosing',
        maxDose: '2 g/dose, 8 g/24h',
        warningNote: 'Cystic fibrosis dosing is higher: 150–300 mg/kg/24h ÷ Q6–8h, max 12 g/24h. Good CNS penetration.',
      };
    },
  },
  {
    id: 'rifampin',
    name: 'Rifampin',
    brandName: 'Rifampicin',
    category: 'Antibiotic',
    indications: ['Neisseria meningitidis / Hib exposure prophylaxis', 'Tuberculosis (combination therapy only)', 'Staphylococcal synergy (with another antistaphylococcal agent)'],
    administration: 'PO/IV. Never use as monotherapy except for prophylaxis. Causes harmless red discolouration of urine/saliva/tears/contact lenses — disclose to families.',
    monitoring: ['LFTs with prolonged use', 'Clinical response'],
    cautions: [
      'Never use as monotherapy except for meningococcal/Hib prophylaxis',
      'TB treatment is combination-therapy only, per specialist/national TB program guidance — do not use rifampin + pyrazinamide alone for latent TB (severe liver injury risk)',
      'Potent CYP450 inducer (2C9/2C19/3A4, UGT1A1, P-glycoprotein) — reduces levels of digoxin, corticosteroids, benzodiazepines, calcium channel blockers, beta-blockers, ciclosporin, tacrolimus, azole antifungals, oral anticoagulants, theophylline, oral contraceptives, antiretrovirals',
      'Contraindicated with praziquantel (discontinue rifampin 4 weeks before starting)',
      'Not recommended in porphyria',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Staph synergy/TB: up to 600mg/24h. Meningococcal prophylaxis: 600mg BID x2 days.',
    calculate: (weight, age) => {
      const dose = age < (1 / 12) ? weight * 10 : weight * 20;
      const capped = Math.min(dose, 1200);
      return {
        dosePerKg: 'Meningococcal/Hib prophylaxis: <1mo 10 mg/kg/24h ÷ Q12h; ≥1mo 20 mg/kg/24h ÷ Q12h, both ×2 days',
        totalDose: `${capped.toFixed(0)} mg/24h`,
        interval: 'Q12h ×2 days',
        route: 'PO (or IV if oral not tolerated)',
        concentration: '150/300 mg capsules; 10/25 mg/mL oral suspension; 600 mg injection',
        basisNote: 'Prophylaxis dosing shown. TB treatment uses a different regimen (10–20 mg/kg/24h ÷ Q12–24h, max 600 mg/24h) as part of combination therapy only — see cautions.',
        maxDose: '1200 mg/24h (prophylaxis)',
        warningNote: 'This is prophylaxis dosing only. For TB or staphylococcal synergy, use combination therapy under specialist guidance — never rifampin alone.',
      };
    },
  },
  {
    id: 'linezolid',
    name: 'Linezolid',
    category: 'Antibiotic',
    indications: ['Vancomycin-resistant enterococcus (VRE)', 'MRSA when vancomycin is not suitable', 'Serious Gram-positive infection (pneumonia, bacteraemia, bone/joint)'],
    administration: 'IV/IM equivalent to PO. Protect suspension from light/moisture; invert gently, do not shake.',
    monitoring: ['CBC (myelosuppression risk with courses >2 weeks)', 'Peripheral/optic neuropathy with prolonged use', 'Sodium and blood glucose'],
    cautions: [
      'Do not use with SSRIs, TCAs, venlafaxine, trazodone (serotonin syndrome risk); avoid with MAOIs',
      'Caution in uncontrolled hypertension/phaeochromocytoma/thyrotoxicosis and with sympathomimetics/vasopressors (may raise BP)',
      'Caution with tyramine-rich foods',
      'Severe hepatic/renal impairment increases thrombocytopenia risk',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '600mg Q12h IV/PO (400mg Q12h for uncomplicated infection).',
    calculate: (weight, age) => {
      const dose = Math.min(weight * 10, 600);
      const interval = age < 5 ? 'Q8h' : 'Q12h';
      return {
        dosePerKg: '10 mg/kg/dose (max 600 mg/dose)',
        totalDose: `${dose.toFixed(0)} mg/dose`,
        interval: age < 12 ? (age < 5 ? 'Q8h (uncomplicated skin/soft tissue <5y)' : 'Q12h (uncomplicated skin/soft tissue 5–11y) or Q8h for serious infection') : 'Q12h',
        route: 'IV or PO (equivalent dosing)',
        concentration: '600 mg tablets; 100 mg/5 mL oral suspension (contains phenylalanine); 200 mg/100 mL or 600 mg/300 mL premixed IV',
        basisNote: 'Age <12 years — serious infections (pneumonia, bacteraemia, bone/joint, VRE) use Q8h regardless of age band',
        maxDose: '600 mg/dose',
        warningNote: 'Myelosuppression risk with courses longer than 2 weeks — monitor CBC. Serotonin syndrome risk with SSRIs/TCAs/MAOIs.',
      };
    },
  },
  {
    id: 'isoniazid',
    name: 'Isoniazid',
    brandName: 'INH',
    category: 'Antibiotic',
    indications: ['Tuberculosis treatment (combination therapy with rifampin — specialist/TB program guidance required)', 'Latent TB treatment'],
    administration: 'PO (or IM at the same dose). Give 1h before or 2h after meals. NEVER used as monotherapy for active TB — always combined with other agents under specialist guidance.',
    monitoring: ['Monthly LFTs', 'Signs of peripheral neuropathy, hepatitis, or encephalopathy'],
    cautions: [
      'Contraindicated in acute liver disease and prior isoniazid-associated hepatitis',
      'Severe liver injury reported even during treatment of latent TB — monthly LFTs required',
      'Supplemental pyridoxine (vitamin B6) 1–2 mg/kg/24h recommended to prevent neurologic side effects',
      'Inhibits CYP1A2/2C9/2C19/3A3-4 (reduces carbamazepine, diazepam, phenytoin, prednisone levels); potentiates paracetamol hepatotoxicity via CYP2E1',
      'Avoid daily alcohol use',
      'This is a specialist/TB-program-guided medication — this entry is for reference only, not standalone empiric prescribing',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'As per paediatric dosing, max 300mg once daily or 900mg 3x/week (combination therapy only).',
    calculate: (weight) => {
      const dailyDose = Math.min(weight * 15, 300);
      const weeklyDose = Math.min(weight * 30, 900);
      const pyridoxine = weight * 1.5;
      return {
        dosePerKg: 'Daily: 10–15 mg/kg (max 300 mg) once daily | 3×/week: 20–30 mg/kg (max 900 mg)',
        totalDose: `Daily: ${dailyDose.toFixed(0)} mg | 3×/week: ${weeklyDose.toFixed(0)} mg`,
        interval: 'Once daily, or 3 times weekly (directly observed therapy regimens)',
        route: 'PO (or IM at the same dose)',
        concentration: '100/300 mg tablets; 50 mg/5 mL syrup; 100 mg/mL injection',
        basisNote: 'Combination therapy with rifampin (± other agents) only — never monotherapy for active TB',
        maxDose: 'Daily 300 mg; 3×/week 900 mg',
        infusionNote: `Co-administer pyridoxine (vitamin B6) ~${pyridoxine.toFixed(0)} mg/24h (1–2 mg/kg/24h) to prevent neurotoxicity`,
        warningNote: 'Requires specialist/TB program oversight. Monthly LFTs mandatory — severe liver injury can occur even in latent TB treatment.',
      };
    },
  },
  {
    id: 'pyrazinamide',
    name: 'Pyrazinamide',
    category: 'Antibiotic',
    indications: ['Tuberculosis treatment (multidrug combination therapy — specialist/TB program guidance required)'],
    administration: 'PO. Always given as part of a multidrug TB regimen, never alone.',
    monitoring: ['Baseline and periodic LFTs', 'Serum uric acid'],
    cautions: [
      'Contraindicated in severe hepatic damage and acute gout',
      'CDC/ATS do NOT recommend pyrazinamide + rifampin combination for latent TB (severe liver injury risk)',
      'Caution in renal failure (dose reduction), gout, diabetes',
      'Hepatotoxicity is the most common dose-related side effect',
      'This is a specialist/TB-program-guided medication — reference only, not standalone empiric prescribing',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Weight-banded dosing per TB regimen guidance (≥40kg).',
    calculate: (weight) => {
      const dailyLow = weight * 30;
      const dailyHigh = Math.min(weight * 40, 2000);
      const weeklyDose = Math.min(weight * 50, 2000);
      return {
        dosePerKg: 'Daily: 30–40 mg/kg (max 2 g) once daily | Twice weekly: 50 mg/kg (max 2 g)',
        totalDose: `Daily: ${dailyLow.toFixed(0)}–${dailyHigh.toFixed(0)} mg | Twice weekly: ${weeklyDose.toFixed(0)} mg`,
        interval: 'Once daily, or twice weekly (directly observed therapy regimens)',
        route: 'PO',
        concentration: '500 mg tablets; 100 mg/mL oral suspension',
        basisNote: 'Weight <40 kg — combination TB therapy only',
        maxDose: '2 g/dose or /24h',
        warningNote: 'Requires specialist/TB program oversight. Never combine with rifampin alone for latent TB (severe liver injury risk).',
      };
    },
  },
  {
    id: 'ethambutol',
    name: 'Ethambutol',
    category: 'Antibiotic',
    indications: ['Tuberculosis treatment (multidrug combination therapy — specialist/TB program guidance required)', 'Non-tuberculous mycobacterial infection'],
    administration: 'PO, with food. Dose on lean body weight. Space from aluminium hydroxide antacids by 4h (reduces absorption).',
    monitoring: ['Baseline ophthalmologic exam, then MONTHLY — visual acuity, visual fields, red-green colour vision', 'Uric acid, LFTs, renal function, haematology'],
    cautions: [
      'May cause reversible optic neuritis, especially at higher doses — do NOT use if visual acuity cannot be reliably assessed (e.g. very young children)',
      'Discontinue immediately if any visual deterioration occurs',
      'Always given as part of a multidrug TB regimen, never alone',
      'This is a specialist/TB-program-guided medication — reference only, not standalone empiric prescribing',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Weight-banded fixed dosing 800–1600mg once daily or 5x/week (≥40kg or ≥15y).',
    calculate: (weight) => {
      const dailyLow = weight * 15;
      const dailyHigh = Math.min(weight * 25, 1000);
      const weeklyDose = Math.min(weight * 50, 2500);
      return {
        dosePerKg: 'Daily: 15–25 mg/kg (max 1 g) once daily | Twice weekly: 50 mg/kg (max 2.5 g)',
        totalDose: `Daily: ${dailyLow.toFixed(0)}–${dailyHigh.toFixed(0)} mg | Twice weekly: ${weeklyDose.toFixed(0)} mg`,
        interval: 'Once daily, or twice weekly (directly observed therapy regimens)',
        route: 'PO',
        concentration: '100 mg tablets; 50/100 mg/mL oral suspension',
        basisNote: 'Age <15 years and <40 kg — combination TB therapy only',
        maxDose: '1 g/24h (daily); 2.5 g/week (twice-weekly)',
        warningNote: 'CRITICAL: monthly visual acuity, visual field, and colour vision testing required — reversible optic neuritis risk. Do not use if vision cannot be reliably monitored.',
      };
    },
  },

  // ─── Antifungal ─────────────────────────────────────────────────────────
  {
    id: 'fluconazole',
    name: 'Fluconazole',
    category: 'Antifungal',
    indications: ['Oropharyngeal / oesophageal candidiasis', 'Invasive systemic candidiasis', 'Cryptococcal meningitis (including suppressive therapy)'],
    administration: 'PO or IV (equivalent dosing). Dose is once daily; higher end of the range is used for more severe/invasive infection.',
    monitoring: ['LFTs with prolonged therapy', 'Electrolytes (hypokalaemia increases proarrhythmic risk)', 'ECG if other QT-prolonging drugs are used concurrently'],
    cautions: [
      'Contraindicated with other QT-prolonging CYP3A4-metabolised drugs (e.g. erythromycin)',
      'Caution in hepatic or renal dysfunction, hypokalaemia, or advanced cardiac disease',
      'Inhibits CYP2C9/10 and weakly CYP3A3/4 — increases ciclosporin, midazolam, phenytoin, tacrolimus, theophylline, warfarin, and oral hypoglycaemic levels',
      'The source table\'s indication-to-maximum-dose mapping was ambiguous in extraction — the general 6–12 mg/kg/24h range and the 800 mg/24h ceiling for severe/invasive disease are well-established, but confirm the exact per-indication maximum against current local/BNFc guidance before relying on this for invasive disease dosing',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Oropharyngeal: load 200mg then 100-200mg/24h. Oesophageal: load 400mg then 200-400mg/24h. Systemic: load 800mg then 400-800mg/24h.',
    calculate: (weight) => {
      const low = weight * 6;
      const high = Math.min(weight * 12, 800);
      return {
        dosePerKg: '6–12 mg/kg once daily (lower end for oropharyngeal/suppressive therapy; higher end for oesophageal/invasive systemic candidiasis and cryptococcal meningitis)',
        totalDose: `${low.toFixed(0)}–${high.toFixed(0)} mg/24h`,
        interval: 'Once daily',
        route: 'PO or IV',
        concentration: '10 mg/mL or 40 mg/mL oral suspension; 50/100/150/200 mg tablets; 2 mg/mL IV solution',
        basisNote: 'Age >1 month — dose selected by severity/indication (see administration note)',
        maxDose: 'Up to 800 mg/24h for severe/invasive infection — verify the exact indication-specific cap locally',
        warningNote: 'Contraindicated with other QT-prolonging CYP3A4-metabolised drugs. Verify the exact per-indication maximum dose against current formulary guidance — this table was ambiguous in source extraction.',
      };
    },
  },
  {
    id: 'nystatin',
    name: 'Nystatin',
    category: 'Antifungal',
    indications: ['Oropharyngeal candidiasis (thrush)', 'Cutaneous candidiasis (topical)'],
    administration: 'Oral: swish and swallow (or swab for infants). Topical: apply to affected area. Treat until 48–72h after symptom resolution.',
    monitoring: ['Clinical response — resolution of oral plaques/erythema'],
    cautions: [
      'Poorly absorbed through the GI tract — acts topically within the mouth/gut',
      'May cause diarrhoea/GI upset, local irritation, rare contact dermatitis',
      'Treat until 48–72h after clinical cure to reduce relapse',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Oral tabs 500,000-1,000,000 units Q8h until 48h post-cure (nonesophageal GI candidiasis).',
    calculate: (weight, age) => {
      let doseText: string;
      if (age < (1 / 12)) doseText = 'Preterm infant: 0.5 mL (50,000 units) to each side of mouth QID';
      else if (age < 1) doseText = 'Term infant: 1–4 mL (100,000–400,000 units) to each side of mouth QID';
      else doseText = 'Child/adolescent: 4–6 mL (400,000–600,000 units) — swish and swallow QID';
      return {
        dosePerKg: 'Fixed dosing by age (not weight-based)',
        totalDose: doseText,
        interval: 'QID (four times daily)',
        route: 'PO (oral suspension) or topical for cutaneous candidiasis (apply BID–QID)',
        concentration: '100,000 units/mL oral suspension; 500,000 unit tablets; 100,000 units/g topical cream/ointment/powder',
        basisNote: `Age band: ${age < (1 / 12) ? 'preterm infant' : age < 1 ? 'term infant' : 'child/adolescent'}`,
        warningNote: 'Poorly absorbed — treats local/topical infection only, not systemic candidiasis.',
      };
    },
  },
  {
    id: 'griseofulvin',
    name: 'Griseofulvin',
    category: 'Antifungal',
    indications: ['Tinea capitis', 'Tinea unguium / other dermatophyte infection'],
    administration: 'PO, with milk/eggs/fatty foods to enhance absorption. Usual course: 8 weeks for tinea capitis, 4–6 months for tinea unguium.',
    monitoring: ['Baseline and periodic LFTs, CBC, renal function with prolonged courses'],
    cautions: [
      'Contraindicated in porphyria, pregnancy, hepatic disease',
      'Possible cross-reactivity in penicillin allergy',
      'Reduces effectiveness of oral contraceptives, warfarin, ciclosporin',
      'Photosensitivity possible — advise sun protection',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Microsize 500-1000mg/24h; Ultramicrosize 375mg/24h.',
    calculate: (weight, age) => {
      if (age < 2) {
        return {
          dosePerKg: 'Not established <2 years',
          totalDose: 'Not established',
          interval: '—',
          route: 'PO',
          concentration: '125 mg/5 mL microsize suspension',
          basisNote: 'Age <2 years',
          warningNote: 'Dosing not established in children under 2 years.',
        };
      }
      const microLow = weight * 20;
      const microHigh = Math.min(weight * 25, 1000);
      return {
        dosePerKg: 'Microsize: 20–25 mg/kg/24h once daily–BID (max 1 g/24h) | Ultramicrosize: 10–15 mg/kg/24h once daily–BID (max 750 mg/24h)',
        totalDose: `Microsize: ${microLow.toFixed(0)}–${microHigh.toFixed(0)} mg/24h`,
        interval: 'Once daily or BID',
        route: 'PO — take with milk/eggs/fatty foods',
        concentration: 'Microsize: 250/500 mg tablets, 125 mg/5 mL suspension | Ultramicrosize: 125/250 mg tablets',
        basisNote: 'Age >2 years. Microsize and ultramicrosize formulations are NOT interchangeable mg-for-mg (250mg ultramicrosize ≈ 500mg microsize)',
        maxDose: 'Microsize 1 g/24h; ultramicrosize 750 mg/24h',
        warningNote: 'Course duration: 8 weeks for tinea capitis, 4–6 months for tinea unguium (nail infection).',
      };
    },
  },
  {
    id: 'terbinafine',
    name: 'Terbinafine',
    category: 'Antifungal',
    indications: ['Tinea capitis', 'Onychomycosis (nail fungal infection)'],
    administration: 'PO, with or without food. Topical formulations available for dermal mycosis (age ≥12 years).',
    monitoring: ['Baseline AST/ALT; repeat with CBC if therapy exceeds 6 weeks'],
    cautions: [
      'Systemic use contraindicated in acute/chronic liver disease',
      'Rare but serious: SJS/TEN, hearing loss, neutropenia, thrombotic microangiopathy, fatal liver failure',
      'Caution in renal impairment (~50% reduced clearance at CrCl 50 mL/min in adults)',
      'Inhibits CYP2D6 — increases amphetamine, risperidone, fluoxetine effect/toxicity',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '250mg once daily x4-6wk (tinea capitis) or 6-12wk (onychomycosis).',
    calculate: (weight) => {
      let dose: number;
      if (weight <= 20) dose = 62.5;
      else if (weight <= 40) dose = 125;
      else dose = 250;
      return {
        dosePerKg: 'Weight-banded fixed dosing (10–20kg: 62.5mg, 20–40kg: 125mg, >40kg: 250mg) — or 4–6 mg/kg/dose (max 250mg)',
        totalDose: `${dose} mg once daily`,
        interval: 'Once daily',
        route: 'PO',
        concentration: '250 mg tablets; 25 mg/mL oral suspension',
        basisNote: 'Tinea capitis: 2–6 weeks (T. tonsurans) or 8–12 weeks (M. canis). Onychomycosis: 6 weeks (fingernail) or 12 weeks (toenail)',
        warningNote: 'Systemic use contraindicated in liver disease. Monitor LFTs if therapy exceeds 6 weeks.',
      };
    },
  },
  {
    id: 'voriconazole',
    name: 'Voriconazole',
    category: 'Antifungal',
    indications: ['Invasive aspergillosis', 'Candidaemia / disseminated candidiasis (age ≥2 years)', 'Serious Fusarium/Scedosporium infection'],
    administration: 'IV load then maintenance, or PO. High inter-patient pharmacokinetic variability — trough-level monitoring strongly recommended.',
    monitoring: ['Trough level monitoring (therapeutic drug monitoring essential due to high PK variability)', 'LFTs', 'Visual disturbances (common, usually transient)', 'ECG if QT-prolonging drugs co-administered'],
    cautions: [
      'Contraindicated with rifampin, carbamazepine, long-acting barbiturates, ritonavir, efavirenz, ergot alkaloids, St. John\'s wort (reduce voriconazole levels), and with terfenadine, astemizole, cisapride, pimozide, quinidine, sirolimus (voriconazole increases their levels/toxicity)',
      'CYP2C19 metaboliser phenotype significantly affects dosing — therapeutic drug monitoring required',
      'Caution in proarrhythmic conditions and severe hepatic disease',
      'Specialist (infectious disease/haematology-oncology) initiation strongly recommended',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Load 6mg/kg/dose IV Q12h x2, then maintenance 3-4mg/kg/dose Q12h (candidaemia) or 4mg/kg/dose Q12h (aspergillosis).',
    calculate: (weight) => {
      const loadDose = weight * 9;
      const maintDose = weight * 8;
      const poDose = Math.min(weight * 9, 350);
      return {
        dosePerKg: 'Load: 9 mg/kg/dose IV Q12h ×2 doses | Maintenance: 8 mg/kg/dose IV Q12h, or 9 mg/kg/dose PO Q12h (max 350 mg/dose)',
        totalDose: `Load: ${loadDose.toFixed(0)} mg/dose | IV maintenance: ${maintDose.toFixed(0)} mg/dose | PO: ${poDose.toFixed(0)} mg/dose`,
        interval: 'Q12h',
        route: 'IV or PO',
        concentration: '50/200 mg tablets; 40 mg/mL oral suspension; 200 mg injection',
        basisNote: 'Age 2–12 years and 12–14 years <50 kg. Different (adult-pattern) dosing applies ≥15 years or ≥50 kg — specialist guidance required',
        warningNote: 'High inter-patient PK variability — trough-level monitoring is essential and dosing should be managed with specialist/infectious disease input.',
      };
    },
  },
  {
    id: 'caspofungin',
    name: 'Caspofungin',
    category: 'Antifungal',
    indications: ['Invasive candidiasis', 'Empiric therapy in febrile neutropenia', 'Invasive aspergillosis (refractory/intolerant to other therapy)'],
    administration: 'IV, slow infusion over 1h. Do not mix/co-infuse with other medications; avoid dextrose-containing diluents (e.g. D5W).',
    monitoring: ['LFTs (AST/ALT)', 'Electrolytes (hypokalaemia)', 'Signs of infusion-related reaction'],
    cautions: [
      'Use with caution in hepatic impairment and with concomitant enzyme-inducing drugs (carbamazepine, dexamethasone, phenytoin, rifampin) — these require a higher maintenance dose',
      'Rare: anaphylaxis, TEN, SJS, histamine-related reactions',
      'Ciclosporin co-use may transiently increase LFTs and caspofungin levels',
      'Specialist (infectious disease/haematology-oncology) initiation recommended',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Load 70mg IV x1, then maintenance 50mg IV once daily (increase to 70mg if inadequate response).',
    calculate: (weight) => {
      const bsa = Math.sqrt((weight * 100) / 3600);
      const loadDose = Math.min(70 * bsa, 70);
      const maintDose = Math.min(50 * bsa, 70);
      return {
        dosePerKg: 'Load: 70 mg/m² IV on day 1 | Maintenance: 50 mg/m² IV once daily (increase to 70 mg/m² if inadequate response or with enzyme-inducing co-medication)',
        totalDose: `Load (approx., via Mosteller BSA): ${loadDose.toFixed(0)} mg | Maintenance: ${maintDose.toFixed(0)} mg`,
        interval: 'Once daily',
        route: 'IV, slow infusion over 1 hour',
        concentration: '50 mg, 70 mg injection vials (contains sucrose and mannitol)',
        basisNote: 'Age 3 months–17 years (BSA-based, Mosteller formula) — verify exact BSA/dose with pharmacy',
        maxDose: '70 mg/dose (load and maintenance)',
        warningNote: 'Infants <3 months use different dosing (weight-based 2 mg/kg/dose or BSA 25 mg/m²/dose) — specialist guidance required. Do not co-infuse with dextrose-containing solutions.',
      };
    },
  },

  // ─── Antiviral ──────────────────────────────────────────────────────────
  {
    id: 'aciclovir',
    name: 'Aciclovir',
    brandName: 'Acyclovir',
    category: 'Antiviral',
    indications: ['Herpes simplex virus (mucocutaneous, encephalitis)', 'Varicella-zoster (chickenpox, shingles)', 'Immunocompromised prophylaxis/treatment'],
    administration: 'IV (infuse over ≥1h, ensure adequate hydration) or PO. This entry is for non-neonatal dosing — see NeoDose for neonatal HSV.',
    monitoring: ['Renal function (BUN/creatinine) — crystallisation risk with rapid IV infusion or dehydration', 'Neurological status (rare encephalopathy)', 'LFTs'],
    cautions: [
      'Ensure adequate hydration and infuse IV over at least 1 hour to prevent renal tubular crystallisation',
      'Adjust dose in renal impairment',
      'Oral bioavailability is low and unpredictable (15–30%) — consider valaciclovir if better absorption is needed',
      'HSV encephalitis requires the higher-dose regimen (60 mg/kg/24h ÷ Q8h in children 3mo–12y) for 14–21 days',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Mucocutaneous HSV initial: PO 1000–1200mg/24h ÷3-5 doses ×7-10d. Zoster PO 4000mg/24h÷5x/24h ×5-7d.',
    calculate: (weight) => {
      const ivDaily = weight * 30;
      const ivPerDose = ivDaily / 3;
      const poDaily = Math.min(weight * 80, 3200);
      const poPerDose = poDaily / 4;
      return {
        dosePerKg: 'Varicella/Zoster: 30 mg/kg/24h ÷ Q8h IV | Varicella (PO, immunocompetent ≥2y): 80 mg/kg/24h ÷ QID (max 3200 mg/24h)',
        totalDose: `IV: ${ivPerDose.toFixed(0)} mg/dose Q8h (${ivDaily.toFixed(0)} mg/24h) | PO: ${poPerDose.toFixed(0)} mg/dose QID (${poDaily.toFixed(0)} mg/24h)`,
        interval: 'IV Q8h | PO QID, both ×7–10 days (varicella) or ×5 days (uncomplicated)',
        route: 'IV (infuse over ≥1h, ensure adequate hydration) or PO',
        concentration: '50 mg/mL IV injection; 200 mg/5 mL oral suspension; 200/400/800 mg capsules/tablets',
        basisNote: 'Varicella-zoster dosing shown. HSV encephalitis uses a higher dose — see warning.',
        maxDose: 'PO max 3200 mg/24h (80 mg/kg/24h)',
        warningNote: 'HSV encephalitis dosing is higher: 60 mg/kg/24h ÷ Q8h IV (age 3mo–12y) or 30 mg/kg/24h ÷ Q8h IV (>12y), for 14–21 days. Ensure adequate hydration and infuse IV slowly.',
      };
    },
  },
  {
    id: 'valaciclovir',
    name: 'Valaciclovir',
    brandName: 'Valacyclovir',
    category: 'Antiviral',
    indications: ['Varicella-zoster (chickenpox, shingles)', 'Herpes simplex virus (genital, labialis) — better oral absorption than aciclovir'],
    administration: 'PO. Aciclovir prodrug with better and more predictable oral bioavailability.',
    monitoring: ['Renal function', 'TTP/HUS has been reported rarely in immunocompromised patients (HIV, transplant) on high-dose therapy'],
    cautions: [
      'Adjust dose in renal/hepatic impairment',
      'Genital HSV (immunocompetent, 3mo–11y): 20 mg/kg/dose Q12h (max 1000mg/dose)',
      'TTP/HUS reported rarely in advanced HIV/transplant patients on high-dose regimens',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Genital HSV initial: 1g BID x10d+. Herpes labialis: 2g Q12h x2 doses (1 day, immunocompetent only).',
    calculate: (weight) => {
      const dose = Math.min(weight * 20, 1000);
      return {
        dosePerKg: '20 mg/kg/dose PO TID (max 1000 mg/dose)',
        totalDose: `${dose.toFixed(0)} mg/dose`,
        interval: 'TID ×5 days (varicella); course length varies by indication — see cautions',
        route: 'PO',
        concentration: '50 mg/mL oral suspension; 500/1000 mg tablets/caplets',
        basisNote: 'Varicella-zoster dosing, age ≥3 months',
        maxDose: '1000 mg/dose',
        warningNote: 'Better and more predictable oral absorption than aciclovir — preferred oral option when IV is not required. Adjust dose in renal/hepatic impairment.',
      };
    },
  },
  {
    id: 'oseltamivir',
    name: 'Oseltamivir',
    category: 'Antiviral',
    indications: ['Influenza treatment (within 48h of symptom onset)', 'Influenza post-exposure prophylaxis'],
    administration: 'PO. Treatment: BID ×5 days, started within 2 days of symptom onset. Prophylaxis: once daily.',
    monitoring: ['GI tolerance (nausea/vomiting most common in first 2 days)', 'Neuropsychiatric symptoms (rare but can be severe)'],
    cautions: [
      'Infants <1 year: 3 mg/kg/dose BID (treatment) or once daily (prophylaxis), with narrower age-banded alternatives for <3 months',
      'Rare but serious neuropsychiatric events reported (self-injury, delirium) — counsel families to monitor closely, especially in adolescents',
      'Reduces live attenuated influenza vaccine (FluMist) efficacy — separate by 2 weeks before or 48h after',
      'Not a substitute for annual influenza vaccination',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '75mg BID x5d (treatment); 75mg once daily x≥7d-6wk (prophylaxis).',
    calculate: (weight) => {
      let treatDose: number;
      if (weight <= 15) treatDose = 30;
      else if (weight <= 23) treatDose = 45;
      else if (weight <= 40) treatDose = 60;
      else treatDose = 75;
      return {
        dosePerKg: 'Weight-banded fixed dosing (≤15kg: 30mg, 16–23kg: 45mg, 24–40kg: 60mg, >40kg: 75mg)',
        totalDose: `${treatDose} mg/dose BID`,
        interval: 'BID ×5 days, started within 2 days of symptom onset',
        route: 'PO',
        concentration: '6 mg/mL oral suspension (may be compounded from capsules); 30/45/75 mg capsules',
        basisNote: `Treatment dosing for weight ${weight} kg`,
        warningNote: 'Prophylaxis dosing uses the same weight bands but ONCE daily, for a minimum of 7 days up to 6 weeks after exposure. Infants <1 year use age-banded dosing (e.g. 3 mg/kg/dose) — see cautions.',
      };
    },
  },

  // ─── Seizure ────────────────────────────────────────────────────────────
  {
    id: 'lorazepam',
    name: 'Lorazepam',
    category: 'Seizure',
    indications: ['Status epilepticus / acute seizure termination'],
    administration: 'IV over 2–5 min (preferred); intranasal 0.1 mg/kg/dose (max 4 mg/dose) if no IV access.',
    monitoring: ['Respiratory rate and oxygen saturation', 'Level of consciousness', 'Blood pressure'],
    cautions: [
      'Contraindicated in narrow-angle glaucoma and severe hypotension',
      'Paradoxical excitation reported in 10–30% of children <8 years',
      'Reduce dose in hepatic impairment; caution in renal impairment',
      'Benzyl alcohol/propylene glycol content in injection may be toxic to neonates at high doses',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    calculate: (weight) => {
      const low = weight * 0.05;
      const high = weight * 0.1;
      const maxDose = 4;
      return {
        dosePerKg: '0.05–0.1 mg/kg/dose IV',
        totalDose: `${low.toFixed(2)}–${Math.min(high, maxDose).toFixed(2)} mg/dose`,
        interval: 'May repeat once after 10–15 min if seizure continues',
        route: 'IV over 2–5 min (preferred); intranasal 0.1 mg/kg/dose, max 4 mg/dose, if no IV access',
        concentration: '2 mg/mL or 4 mg/mL injection',
        basisNote: 'Status epilepticus dosing',
        maxDose: '4 mg/dose',
        warningNote: 'Respiratory depression risk, especially with concurrent opioids/sedatives — have resuscitation equipment available.',
      };
    },
  },
  {
    id: 'midazolam-seizure',
    name: 'Midazolam (Seizure)',
    category: 'Seizure',
    indications: ['Seizure clusters / acute seizure termination', 'Refractory status epilepticus (continuous infusion)'],
    administration: 'IV load + continuous infusion for refractory status epilepticus in an ICU setting. Intranasal alternative for seizure clusters/no IV access — see cautions.',
    monitoring: ['Continuous cardiorespiratory monitoring (ICU-level) during infusion', 'EEG if available for refractory status epilepticus', 'Blood pressure — hypotension with higher doses'],
    cautions: [
      'Intranasal alternative for acute seizure/seizure clusters (no IV access): 0.2–0.3 mg/kg/dose, max 10 mg/dose, split between nostrils; may repeat once after 10 min',
      'Respiratory depression and hypotension — reversed by flumazenil',
      'CYP3A4 substrate — levels increased by clarithromycin, diltiazem, erythromycin, itraconazole, ketoconazole, protease inhibitors',
      'Caution in renal impairment (adjust dose), CHF, hepatic dysfunction',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    calculate: (weight) => {
      const load = weight * 0.2;
      const infLow = (weight * 1 * 60) / 1000;
      return {
        dosePerKg: 'Load 0.2 mg/kg IV ×1, then infusion 1 mcg/kg/min (titrate upward q5min to effect)',
        totalDose: `Load: ${load.toFixed(2)} mg`,
        interval: 'Load once, then continuous infusion',
        route: 'IV',
        concentration: '1 mg/mL or 5 mg/mL injection',
        basisNote: 'Refractory status epilepticus regimen — typical maintenance infusion rates reported 1–18 mcg/kg/min (mean ~2.3 mcg/kg/min)',
        infusionNote: `Starting infusion: ${infLow.toFixed(2)} mg/hr (1 mcg/kg/min) — titrate upward every 5 min to seizure control`,
        warningNote: 'Requires continuous cardiorespiratory monitoring, ideally in an ICU setting. For a single acute seizure without ICU access, an intranasal dose of 0.2–0.3 mg/kg (max 10 mg/dose) is an alternative — see cautions.',
      };
    },
  },
  {
    id: 'phenytoin',
    name: 'Phenytoin',
    category: 'Seizure',
    indications: ['Status epilepticus (loading + maintenance)'],
    administration: 'IV load, then oral or IV maintenance starting ~12h after the load. IM not recommended (erratic absorption).',
    monitoring: ['Continuous ECG and blood pressure during IV loading', 'Serum phenytoin level (therapeutic 10–20 mg/L total, 1–2 mg/L free) — trough within 30 min pre-dose', 'Free levels in renal impairment/hypoalbuminaemia', 'Signs of toxicity — nystagmus, ataxia, slurred speech'],
    cautions: [
      'Contraindicated in heart block, sinus bradycardia',
      'HLA-B*1502 allele carriers at increased SJS/TEN risk',
      'Fosphenytoin is preferred over phenytoin for IV access concerns — dosed in phenytoin-equivalents (PE), same mg/kg as phenytoin, max infusion 2 mg PE/kg/min up to 150 mg PE/min',
      'Many drug interactions via CYP450 induction/competition — review anticonvulsant combinations carefully',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    calculate: (weight, age) => {
      const load = Math.min(weight * 20, 1500);
      let lowMaint = 6, highMaint = 7;
      if (age < 4) { lowMaint = 8; highMaint = 10; }
      else if (age < 7) { lowMaint = 7.5; highMaint = 9; }
      else if (age < 10) { lowMaint = 7; highMaint = 8; }
      const lowDaily = weight * lowMaint;
      const highDaily = weight * highMaint;
      return {
        dosePerKg: `Load: 20 mg/kg IV ×1. Maintenance: ${lowMaint}–${highMaint} mg/kg/24h ÷ BID–TID`,
        totalDose: `Load: ${load.toFixed(0)} mg | Maintenance: ${lowDaily.toFixed(0)}–${highDaily.toFixed(0)} mg/24h`,
        interval: 'Load once (start maintenance 12h later); maintenance Q8–12h',
        route: 'IV (max push rate 1 mg/kg/min, up to 50 mg/min; IM not recommended)',
        concentration: '50 mg/mL injection',
        basisNote: 'Maintenance ranges vary by age (6mo–16y) — shown for the entered age',
        maxDose: 'Loading dose capped at 1500 mg/24h',
        warningNote: 'Rapid IV push can cause cardiovascular collapse ("purple glove syndrome") — consider fosphenytoin (dosed in phenytoin-equivalents) for peripheral IV access or faster infusion.',
      };
    },
  },
  {
    id: 'levetiracetam',
    name: 'Levetiracetam',
    category: 'Seizure',
    indications: ['Seizures (partial, myoclonic, or generalised tonic-clonic) — monotherapy or adjunct', 'Refractory status epilepticus (load)'],
    administration: 'PO or IV (equivalent dosing — IV used only when oral not feasible). ER tablets once daily in patients >12y.',
    monitoring: ['Mood/behaviour changes, especially in children', 'Renal function (dose reduction needed in renal impairment)'],
    cautions: [
      'Do not abruptly withdraw — taper when discontinuing',
      'Reduce dose in renal impairment',
      'Behavioural side effects more common in children than adults',
      'Excellent oral bioavailability — switch to oral as soon as feasible',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    calculate: (weight, age) => {
      let startPerDose = 10, maxPerDose = 30;
      if (age < 0.5) { startPerDose = 7; maxPerDose = 21; }
      else if (age < 4) { startPerDose = 10; maxPerDose = 25; }
      const startDaily = weight * startPerDose * 2;
      const maxDaily = Math.min(weight * maxPerDose * 2, 3000);
      const loadDose = Math.min(weight * 60, 4500);
      return {
        dosePerKg: `Start ${startPerDose} mg/kg/dose BID, titrate every 2 weeks to a max of ${maxPerDose} mg/kg/dose BID`,
        totalDose: `Start: ${(weight * startPerDose).toFixed(0)} mg/dose BID (${startDaily.toFixed(0)} mg/24h) — max: ${(maxDaily / 2).toFixed(0)} mg/dose BID`,
        interval: 'BID (Q12h); ER tablets once daily in patients >12y',
        route: 'PO or IV',
        concentration: '100 mg/mL oral solution; 250/500/750/1000 mg tablets; 100 mg/mL injection',
        basisNote: `Chronic seizure dosing for age ${age} years`,
        maxDose: `${maxDaily.toFixed(0)} mg/24h (max 3000 mg/24h)`,
        infusionNote: `Refractory status epilepticus load (limited data): 60 mg/kg IV/IO over 10 min ×1 (max ${loadDose.toFixed(0)} mg) — a single acute dose, not the chronic regimen above.`,
        warningNote: 'Behavioural side effects (irritability, aggression, mood changes) reported in ~38% of children vs ~13% of adults.',
      };
    },
  },
  {
    id: 'phenobarbital',
    name: 'Phenobarbital',
    category: 'Seizure',
    indications: ['Status epilepticus (loading)', 'Seizure maintenance therapy'],
    administration: 'IV load (max push rate 1 mg/kg/min), then oral or IV maintenance.',
    monitoring: ['Respiratory rate and blood pressure during/after IV loading', 'Serum phenobarbital level (therapeutic 15–40 mg/L)', 'Sedation/cognitive effects with chronic therapy'],
    cautions: [
      'Contraindicated in porphyria and severe respiratory disease',
      'Long half-life (varies markedly by age) — accumulation risk with repeated dosing',
      'Induces hepatic enzymes — reduces levels of many co-administered drugs',
      'Paradoxical hyperactivity/irritability reported in children',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    calculate: (weight, age) => {
      const loadLow = weight * 15;
      const loadHigh = Math.min(weight * 20, 1000);
      let lowMaint, highMaint;
      if (age < 1) { lowMaint = 5; highMaint = 6; }
      else if (age < 6) { lowMaint = 6; highMaint = 8; }
      else if (age < 12) { lowMaint = 4; highMaint = 6; }
      else { lowMaint = 1; highMaint = 3; }
      const lowDaily = weight * lowMaint;
      const highDaily = weight * highMaint;
      return {
        dosePerKg: `Load: 15–20 mg/kg IV (max 1000 mg). Maintenance: ${lowMaint}–${highMaint} mg/kg/24h once daily–BID`,
        totalDose: `Load: ${loadLow.toFixed(0)}–${loadHigh.toFixed(0)} mg | Maintenance: ${lowDaily.toFixed(0)}–${highDaily.toFixed(0)} mg/24h`,
        interval: 'Load once (may repeat 5 mg/kg Q20min to a max total of 30 mg/kg); maintenance once daily–BID',
        route: 'IV (max push rate 1 mg/kg/min) or PO for maintenance',
        concentration: '65 mg/mL or 130 mg/mL injection; 20 mg/5 mL oral solution',
        basisNote: `Maintenance range for age ${age} years`,
        warningNote: 'IV administration may cause respiratory depression/apnoea and hypotension — have resuscitation equipment ready.',
      };
    },
  },

  // ─── Respiratory ────────────────────────────────────────────────────────
  {
    id: 'salbutamol',
    name: 'Salbutamol',
    brandName: 'Albuterol',
    category: 'Respiratory',
    indications: ['Acute asthma exacerbation (bronchodilator)', 'Bronchospasm — maintenance/PRN'],
    administration: 'Nebulized or metered-dose inhaler via spacer. More aggressive/continuous nebulization used for acute severe exacerbations — follow local asthma pathway.',
    monitoring: ['Heart rate (tachycardia common)', 'Serum potassium with frequent/high-dose use', 'Clinical response — work of breathing, oxygen saturation'],
    cautions: [
      'Not established for obstructive airway disease <4 years by product labelling, though widely used clinically',
      'Verify nebulizer solution concentration carefully before drawing up a dose',
      'Oral formulation exists but is discouraged — inhaled route is preferred',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Nebulizer 2.5–5mg Q4-8h; inhaler 2 puffs Q4-6h PRN.',
    calculate: (weight, age) => {
      let doseText: string, doseRange: string;
      if (age < 1) {
        const low = weight * 0.05;
        const high = weight * 0.15;
        doseText = '0.05–0.15 mg/kg/dose nebulized';
        doseRange = `${low.toFixed(2)}–${high.toFixed(2)} mg/dose`;
      } else if (age < 5) {
        doseText = '1.25–2.5 mg/dose nebulized (fixed dosing)';
        doseRange = '1.25–2.5 mg/dose';
      } else if (age < 12) {
        doseText = '2.5 mg/dose nebulized (fixed dosing)';
        doseRange = '2.5 mg/dose';
      } else {
        doseText = '2.5–5 mg/dose nebulized (fixed dosing)';
        doseRange = '2.5–5 mg/dose';
      }
      return {
        dosePerKg: doseText,
        totalDose: doseRange,
        interval: age < 12 ? 'Q4–6h (more frequent dosing used for acute severe exacerbations)' : 'Q4–8h',
        route: 'Nebulized (0.5% = 5 mg/mL solution) or metered-dose inhaler (2 puffs Q4–6h, ideally via spacer)',
        concentration: '0.5% (5 mg/mL) nebulizer solution; prediluted 0.63/1.25/2.5 mg in 3 mL normal saline; 90 mcg/actuation inhaler',
        basisNote: `Age band: ${age < 1 ? '<1 year' : age < 5 ? '1–5 years' : age < 12 ? '5–12 years' : '>12 years'}`,
        warningNote: 'More aggressive/continuous nebulization is used for acute severe exacerbations. Spacers with an inhaler are as effective as nebulizers for most patients.',
      };
    },
  },
  {
    id: 'hydrocortisone-respiratory',
    name: 'Hydrocortisone',
    category: 'Respiratory',
    indications: ['Status asthmaticus (acute severe asthma)', 'Anti-inflammatory/immunosuppressive replacement therapy'],
    administration: 'IV.',
    monitoring: ['Blood glucose and blood pressure with prolonged use', 'Growth (long-term therapy)', 'Signs of adrenal suppression with prolonged/high-dose use'],
    cautions: [
      'Anti-inflammatory/replacement dosing is much lower: PO 2.5–10 mg/kg/24h ÷ Q6–8h, or IM/IV 1–5 mg/kg/24h ÷ Q12–24h',
      'Avoid live vaccines during high-dose therapy',
      'Taper gradually after prolonged courses to avoid adrenal insufficiency',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Status asthmaticus: load up to 250mg, maintenance dosed similarly per kg.',
    calculate: (weight) => {
      const loadLow = weight * 4;
      const loadHigh = Math.min(weight * 8, 250);
      const maintPerDose = (weight * 8) / 4;
      return {
        dosePerKg: 'Optional load: 4–8 mg/kg/dose IV (max 250 mg) | Maintenance: 8 mg/kg/24h ÷ Q6h IV',
        totalDose: `Load: ${loadLow.toFixed(0)}–${loadHigh.toFixed(0)} mg | Maintenance: ${maintPerDose.toFixed(0)} mg/dose Q6h`,
        interval: 'Q6h (maintenance)',
        route: 'IV',
        concentration: '100/250/500/1000 mg vials (as sodium succinate)',
        basisNote: 'Status asthmaticus dosing',
        warningNote: 'Avoid exposure to varicella/measles in immunocompromised patients on corticosteroid therapy.',
      };
    },
  },
  {
    id: 'dexamethasone',
    name: 'Dexamethasone',
    category: 'Respiratory',
    indications: ['Croup', 'Asthma exacerbation', 'Airway oedema / peri-extubation'],
    administration: 'PO/IV/IM — oral and IV are considered equally effective for croup.',
    monitoring: ['Blood glucose with repeated dosing', 'Clinical response (stridor/work of breathing in croup)'],
    cautions: [
      'Airway oedema/peri-extubation regimen differs: 0.5 mg/kg/dose (max 10 mg) Q6h ×6 doses, starting 6–12h pre-extubation',
      'Anti-inflammatory dosing: 0.08–0.3 mg/kg/24h ÷ Q6–12h',
      'Repeated dosing beyond 1–2 days increases metabolic/adverse effect risk',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Croup/asthma: similar fixed dose 10–16mg once.',
    calculate: (weight) => {
      const dose = Math.min(weight * 0.6, 16);
      return {
        dosePerKg: '0.6 mg/kg/dose (max 16 mg) — single dose',
        totalDose: `${dose.toFixed(1)} mg`,
        interval: 'Single dose (croup); asthma exacerbation may repeat once daily for 1–2 days',
        route: 'PO/IV/IM',
        concentration: '0.5 mg/5 mL elixir; 0.5–6 mg tablets; 4 mg/mL or 10 mg/mL injection',
        basisNote: 'Croup / asthma exacerbation dosing',
        maxDose: '16 mg/dose',
        warningNote: 'Not recommended for chronic lung disease prevention in very-low-birth-weight infants. Repeated dosing beyond 2 days increases metabolic risk.',
      };
    },
  },
  {
    id: 'magnesium-sulfate-respiratory',
    name: 'Magnesium Sulfate',
    category: 'Respiratory',
    indications: ['Adjunctive therapy for moderate-severe asthma exacerbation refractory to first-line bronchodilators'],
    administration: 'IV over 20 min. Some recommend a preceding IV saline bolus to reduce hypotension risk.',
    monitoring: ['Blood pressure and heart rate during infusion', 'Deep tendon reflexes and respiratory rate (toxicity signs)', 'Serum magnesium level if repeated dosing or renal impairment'],
    cautions: [
      'Toxicity is level-dependent: >3 mg/dL CNS depression; >5 mg/dL reduced deep tendon reflexes/flushing/somnolence; >12 mg/dL respiratory paralysis/heart block',
      'Maximum intermittent IV infusion rate: 1 mEq/kg/hr (125 mg salt/kg/hr) in emergent situations',
      'Caution in renal insufficiency — monitor magnesium levels',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '2 g/dose IV over 20 min (single dose for asthma exacerbation).',
    calculate: (weight) => {
      const low = weight * 25;
      const high = Math.min(weight * 75, 2000);
      return {
        dosePerKg: '25–75 mg/kg/dose (max 2 g) — single dose',
        totalDose: `${low.toFixed(0)}–${high.toFixed(0)} mg`,
        interval: 'Single dose, IV over 20 min',
        route: 'IV',
        concentration: '500 mg/mL (50%) injection — must be diluted before use; prediluted 40 mg/mL or 80 mg/mL solutions also available',
        basisNote: 'Adjunctive bronchodilation for moderate-severe reactive airway disease exacerbation',
        maxDose: '2 g/dose',
        warningNote: 'Watch for hypotension, bradycardia, respiratory depression, complete heart block and hypermagnesemia. Have IV calcium gluconate available as an antidote.',
      };
    },
  },
  {
    id: 'aminophylline',
    name: 'Aminophylline',
    category: 'Respiratory',
    indications: ['Severe asthma / reactive airway disease exacerbation refractory to first-line therapy (second/third-line)'],
    administration: 'IV load followed by continuous infusion, or the same total daily dose divided Q4–6h. Use theophylline (not aminophylline) for the oral route.',
    monitoring: ['Theophylline level (therapeutic 10–20 mg/L for asthma)', 'Heart rate, blood pressure', 'Signs of toxicity — nausea, tremor, tachyarrhythmia, seizures'],
    cautions: [
      'Narrow therapeutic index — numerous drug interactions',
      'Use theophylline (not aminophylline) for oral dosing',
      'Considered second/third-line therapy — reserve for exacerbations refractory to beta-agonists/corticosteroids/magnesium',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Similar mg/kg loading and maintenance, adjusted for smoking status and hepatic function.',
    calculate: (weight, age) => {
      const load = weight * 6;
      let rate: number, rateLabel: string;
      if (age < 0.5) { rate = 0.2; rateLabel = 'neonate'; }
      else if (age < 1) { rate = 0.6; rateLabel = '6 weeks–1 year'; }
      else if (age < 9) { rate = 1.1; rateLabel = '1–9 years'; }
      else if (age < 12) { rate = 0.9; rateLabel = '9–12 years'; }
      else { rate = 0.7; rateLabel = '>12 years (nonsmoker)'; }
      const infRate = weight * rate;
      return {
        dosePerKg: `Load: 6 mg/kg IV over 20 min | Maintenance infusion: ${rate} mg/kg/hr`,
        totalDose: `Load: ${load.toFixed(0)} mg`,
        interval: 'Load once, then continuous infusion (or the same total daily dose divided Q4–6h)',
        route: 'IV',
        concentration: '25 mg/mL injection (79% theophylline base)',
        basisNote: `Maintenance infusion rate for ${rateLabel}`,
        infusionNote: `${infRate.toFixed(1)} mg/hr continuous infusion — adjust to a therapeutic theophylline level of 10–20 mg/L`,
        warningNote: 'Narrow therapeutic index — many drug interactions alter clearance. Use theophylline for the oral route, not aminophylline.',
      };
    },
  },
  {
    id: 'ipratropium',
    name: 'Ipratropium Bromide',
    category: 'Respiratory',
    indications: ['Adjunctive bronchodilator in acute moderate-severe asthma exacerbation (ED/ICU)', 'Maintenance/non-acute bronchospasm (adjunct)'],
    administration: 'Nebulized, or MDI (<12y 4–8 puffs, ≥12y 8 puffs, Q20min PRN up to 3h). Used as an adjunct to, not a replacement for, beta-agonist bronchodilators.',
    monitoring: ['Clinical response — work of breathing', 'Heart rate (less tachycardia than beta-agonists alone)'],
    cautions: [
      'Non-acute nebulized dosing: infant 125–250 mcg Q8h; child <12y 250–500 mcg Q6–8h; ≥12y 250–500 mcg Q6h',
      'Non-acute inhaler dosing: <12y 1–2 puffs Q6h (max 12 puffs/24h); ≥12y 2–3 puffs Q6h (max 12 puffs/24h)',
      'Anticholinergic — dry mouth, caution with narrow-angle glaucoma if sprayed near eyes',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '500 mcg/dose nebulized Q20min ×3, then Q2-4h PRN (acute); 250-500 mcg Q6h (non-acute).',
    calculate: (weight, age) => {
      const dose = age < 12 ? '250–500' : '500';
      return {
        dosePerKg: 'Fixed dosing (not weight-based)',
        totalDose: `${dose} mcg/dose nebulized`,
        interval: 'Q20min ×3 doses, then Q2–4h PRN (acute exacerbation)',
        route: 'Nebulized (or MDI: <12y 4–8 puffs, ≥12y 8 puffs, Q20min PRN up to 3h)',
        concentration: '0.02% (500 mcg/2.5 mL) nebulizer solution; 17 mcg/actuation inhaler; combination ipratropium-albuterol nebules (0.5mg/2.5mg in 3mL) also available',
        basisNote: `Acute ED/ICU dosing for age ${age < 12 ? '<12 years' : '≥12 years'}`,
        warningNote: 'Used as an adjunct to (not a replacement for) beta-agonist bronchodilators in acute asthma.',
      };
    },
  },
  {
    id: 'montelukast',
    name: 'Montelukast',
    category: 'Respiratory',
    indications: ['Asthma maintenance / allergic rhinitis (add-on therapy)', 'Exercise-induced bronchospasm prevention'],
    administration: 'PO, once daily in the evening. Exercise-induced bronchospasm prevention: take ≥2h before exercise, not within 24h of a prior dose.',
    monitoring: ['Mood/behaviour changes — neuropsychiatric adverse effects'],
    cautions: [
      'Neuropsychiatric adverse effects warning — monitor for aggression, depression, sleep disturbance, suicidal ideation',
      'Chewable tablets contain phenylalanine — contraindicated in PKU',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '10mg once daily.',
    calculate: (weight, age) => {
      let dose: number, form: string;
      if (age < 6) { dose = 4; form = 'granules/chewable tablet'; }
      else if (age < 15) { dose = 5; form = 'chewable tablet'; }
      else { dose = 10; form = 'tablet'; }
      return {
        dosePerKg: 'Fixed dosing (not weight-based)',
        totalDose: `${dose} mg once daily (${form})`,
        interval: 'Once daily, in the evening',
        route: 'PO',
        concentration: '4 mg oral granules; 4/5 mg chewable tablets; 10 mg tablets',
        basisNote: `Age band: ${age < 6 ? '6 months–5 years' : age < 15 ? '6–14 years' : '≥15 years'}`,
        warningNote: 'Neuropsychiatric effects (aggression, depression, suicidal ideation) have been reported — counsel families to watch for behaviour changes.',
      };
    },
  },
  {
    id: 'racemic-epinephrine',
    name: 'Nebulized (Racemic) Adrenaline',
    category: 'Respiratory',
    indications: ['Croup (moderate-severe, stridor at rest)'],
    administration: 'Nebulized. Observe for at least 2–4h after administration for rebound stridor before discharge.',
    monitoring: ['Heart rate (tachycardia common)', 'Observe for rebound stridor for 2–4h post-treatment before discharge'],
    cautions: [
      'Effect duration is shorter than the underlying croup pathology — rebound stridor can occur',
      'Cardiorespiratory monitoring required if dosed more often than Q1–2h',
      'Regular (non-racemic) 1:1000 epinephrine is an accepted nebulized alternative: 0.5 mL/kg/dose (max ≤4y 2.5 mL, >4y 5 mL/dose)',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    calculate: (weight, age) => {
      if (age < 4) {
        const dose = Math.min(weight * 0.05, 0.5);
        return {
          dosePerKg: '0.05 mL/kg/dose of 2.25% racemic epinephrine (max 0.5 mL)',
          totalDose: `${dose.toFixed(2)} mL, diluted to 3 mL with normal saline`,
          interval: 'Not more often than Q1–2h without cardiorespiratory monitoring; nebulize over 15 min',
          route: 'Nebulized',
          concentration: '2.25% racemic epinephrine solution (1.25% epinephrine base)',
          basisNote: 'Age <4 years',
          maxDose: '0.5 mL/dose',
          warningNote: 'Cardiorespiratory monitoring required if given more often than Q1–2h. Observe for at least 2–4h after administration for rebound stridor before discharge.',
        };
      }
      return {
        dosePerKg: 'Fixed dosing (not weight-based) ≥4 years',
        totalDose: '0.5 mL/dose, diluted to 3 mL with normal saline',
        interval: 'Q3–4h PRN',
        route: 'Nebulized',
        concentration: '2.25% racemic epinephrine solution (1.25% epinephrine base)',
        basisNote: 'Age ≥4 years',
        warningNote: 'Observe for at least 2–4h after administration for rebound stridor before discharge.',
      };
    },
  },

  // ─── Analgesia & Sedation ───────────────────────────────────────────────
  {
    id: 'paracetamol',
    name: 'Paracetamol',
    brandName: 'Acetaminophen',
    category: 'Analgesia & Sedation',
    indications: ['Analgesia / antipyresis'],
    administration: 'PO or PR. IV alternative: 12.5–15 mg/kg/dose Q4–6h depending on age/weight, max 75 mg/kg/24h (up to 4000 mg/24h in larger children).',
    monitoring: ['Signs of hepatotoxicity with overdose/chronic high-dose use', 'Total daily dose across all formulations/routes (avoid double-dosing combination products)'],
    cautions: [
      'Maximum 5 doses in 24 hours from all routes combined',
      'Caution in G6PD deficiency, hepatic impairment, chronic malnutrition/dehydration',
      'No anti-inflammatory activity',
      'Increases warfarin, zidovudine and busulfan toxicity risk',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '325–650 mg/dose PO PRN; max 4g/24h.',
    calculate: (weight) => {
      const dose = weight * 15;
      const maxDaily = Math.min(weight * 75, 4000);
      return {
        dosePerKg: '10–15 mg/kg/dose PO/PR Q4–6h',
        totalDose: `${(weight * 10).toFixed(0)}–${dose.toFixed(0)} mg/dose`,
        interval: 'Q4–6h, max 5 doses/24h',
        route: 'PO or PR',
        concentration: '160 mg/5 mL suspension; 80/120/325/650 mg suppositories; 325/500 mg tablets',
        basisNote: 'Standard analgesic/antipyretic dosing',
        maxDose: `${maxDaily.toFixed(0)} mg/24h (lesser of 75 mg/kg/24h or 4 g/24h)`,
        infusionNote: 'IV alternative: 12.5–15 mg/kg/dose Q4–6h depending on age/weight, max 75 mg/kg/24h (up to 4000 mg/24h in larger children)',
        warningNote: 'Caution in G6PD deficiency and hepatic impairment. Do not exceed 5 doses/24h across all routes combined.',
      };
    },
  },
  {
    id: 'ibuprofen',
    name: 'Ibuprofen',
    category: 'Analgesia & Sedation',
    indications: ['Analgesia / antipyresis (age ≥6 months)'],
    administration: 'PO (age ≥6 months) or IV (10 mg/kg/dose, max 400 mg/dose, Q4–6h in children 6mo–<12y).',
    monitoring: ['Renal function with prolonged use or dehydration', 'GI symptoms/occult bleeding with prolonged use', 'Blood pressure'],
    cautions: [
      'Contraindicated with active GI bleed/ulcer, significant renal impairment, aspirin hypersensitivity',
      'Inhibits platelet aggregation — caution with bleeding risk or anticoagulants',
      'Avoid in dehydration',
      'Not recommended in pregnancy ≥30 weeks gestation',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '400–800mg/dose Q6–8h PO; max 3.2g/24h.',
    calculate: (weight) => {
      const low = weight * 5;
      const high = weight * 10;
      return {
        dosePerKg: '5–10 mg/kg/dose PO Q6–8h',
        totalDose: `${low.toFixed(0)}–${high.toFixed(0)} mg/dose`,
        interval: 'Q6–8h',
        route: 'PO (age ≥6 months) or IV',
        concentration: '100 mg/5 mL suspension; 100 mg chewable tablets; 200/400/600/800 mg tablets',
        basisNote: 'Analgesic/antipyretic dosing',
        maxDose: `${Math.min(weight * 40, 3200).toFixed(0)} mg/24h (max 40 mg/kg/24h, up to 3200 mg/24h analgesic; lower 2400 mg/24h cap antipyretic)`,
        warningNote: 'Avoid in active GI bleeding/ulcer, significant dehydration, or renal impairment.',
      };
    },
  },
  {
    id: 'morphine',
    name: 'Morphine',
    category: 'Analgesia & Sedation',
    indications: ['Moderate-severe pain', 'Sickle cell / cancer pain (continuous infusion)'],
    administration: 'IV/IM/SC (titrate to effect); PO alternative 0.2–0.5 mg/kg/dose Q4–6h (immediate release).',
    monitoring: ['Respiratory rate and oxygen saturation', 'Sedation level', 'Blood pressure', 'Bowel function with prolonged use'],
    cautions: [
      'Dose reduction needed in hepatic and renal impairment',
      'Histamine release may cause itching/flushing/bronchospasm',
      'Additive respiratory depression with other sedatives — avoid concurrent use without monitoring',
      'Subject to opioid stewardship/REMS requirements',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'PO 10–30mg Q4h PRN (IR); IM/IV/SC 2–15mg/dose Q2–6h PRN.',
    calculate: (weight) => {
      const lowD = weight * 0.1;
      const highD = weight * 0.2;
      return {
        dosePerKg: '0.1–0.2 mg/kg/dose IV/IM/SC',
        totalDose: `${lowD.toFixed(2)}–${highD.toFixed(2)} mg/dose`,
        interval: 'Q2–4h PRN',
        route: 'IV/IM/SC (titrate to effect); PO alternative 0.2–0.5 mg/kg/dose Q4–6h',
        concentration: '0.5–50 mg/mL injection (multiple strengths — verify with pharmacy); 10 mg/5 mL or 20 mg/5 mL oral solution',
        basisNote: 'Infant (>6 months) and child dosing',
        maxDose: 'Initial max single dose: infant 2 mg, 1–6y 4 mg, 7–12y 8 mg, adolescent 10 mg',
        infusionNote: 'Continuous IV/SC infusion: postoperative pain 0.01–0.04 mg/kg/hr; sickle cell/cancer pain 0.04–0.07 mg/kg/hr',
        warningNote: 'Respiratory depression, hypotension, and histamine-related itching/bronchospasm — monitor closely, especially with concurrent sedatives.',
      };
    },
  },
  {
    id: 'ketamine',
    name: 'Ketamine',
    category: 'Analgesia & Sedation',
    indications: ['Procedural sedation'],
    administration: 'IV (over ≥60 sec, max rate 0.5 mg/kg/min), IM, PO, or intranasal (≥3 months).',
    monitoring: ['Airway patency and oxygen saturation throughout sedation', 'Blood pressure and heart rate', 'Emergence reactions on recovery'],
    cautions: [
      'Contraindicated in significant hypertension and known hypersensitivity',
      'Caution in raised intracranial pressure, aneurysms, thyrotoxicosis, psychiatric disorders',
      'Anticholinergic pre-treatment may reduce hypersalivation; benzodiazepine may reduce emergence reactions',
      'Aminophylline/theophylline co-administration increases seizure risk',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'IV 0.2–1 mg/kg; IM 0.5–4 mg/kg.',
    calculate: (weight) => {
      const ivLow = weight * 0.5;
      const ivHigh = weight * 1;
      const imLow = weight * 2;
      const imHigh = weight * 5;
      const maxIv = 150;
      return {
        dosePerKg: 'IV: 0.5–1 mg/kg | IM: 2–5 mg/kg | PO: 5 mg/kg | Intranasal: 3–6 mg/kg',
        totalDose: `IV: ${ivLow.toFixed(1)}–${Math.min(ivHigh, maxIv).toFixed(1)} mg | IM: ${imLow.toFixed(1)}–${imHigh.toFixed(1)} mg`,
        interval: 'Single dose, titrate to effect; may repeat per procedural sedation protocol',
        route: 'IV (over ≥60 sec, max rate 0.5 mg/kg/min), IM, PO, or intranasal (≥3 months)',
        concentration: '10/50/100 mg/mL injection',
        basisNote: 'Procedural sedation dosing',
        maxDose: 'IV max 150 mg/dose',
        warningNote: 'Emergence reactions, hypersalivation, laryngospasm — have suction and airway equipment available. Avoid in significant hypertension or raised ICP.',
      };
    },
  },
  {
    id: 'fentanyl',
    name: 'Fentanyl',
    category: 'Analgesia & Sedation',
    indications: ['Sedation / analgesia (procedural or ongoing)'],
    administration: 'IV (give over 3–5 min to avoid chest wall rigidity) or IM.',
    monitoring: ['Respiratory rate and chest wall movement (rigidity risk with rapid administration)', 'Oxygen saturation', 'Sedation level'],
    cautions: [
      'Caution in bradycardia, raised ICP, respiratory depression',
      'Adjust dose in renal impairment',
      'Transdermal and transmucosal forms are for opioid-tolerant patients only — not for opioid-naïve acute pain',
      'CYP3A4 substrate — many drug interactions',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    calculate: (weight, age) => {
      const low = weight * 1;
      const high = weight * 2;
      const maxDose = 100;
      return {
        dosePerKg: '1–2 mcg/kg/dose IV/IM',
        totalDose: `${low.toFixed(1)}–${Math.min(high, maxDose).toFixed(1)} mcg/dose`,
        interval: age < 1 ? 'Q2–4h PRN' : 'Q30–60min PRN',
        route: 'IV (give over 3–5 min to avoid chest wall rigidity) or IM',
        concentration: '50 mcg/mL injection',
        basisNote: age < 1 ? 'Neonate/younger infant dosing' : 'Older infant/child dosing',
        maxDose: '100 mcg/dose',
        infusionNote: `Continuous IV infusion: ${age < 1 ? '1–5 mcg/kg/hr' : '1–3 mcg/kg/hr'}, titrate to effect (tolerance may develop with prolonged use)`,
        warningNote: 'Rapid IV administration can cause chest wall rigidity impairing ventilation — give slowly.',
      };
    },
  },
  {
    id: 'midazolam-procedural',
    name: 'Midazolam (Procedural Sedation)',
    category: 'Analgesia & Sedation',
    indications: ['Procedural sedation / anxiolysis'],
    administration: 'IV (titrate to effect); IM 0.1–0.15 mg/kg/dose (max 10 mg) if no IV access; PO 0.25–0.5 mg/kg/dose (max 20 mg) as premedication.',
    monitoring: ['Continuous pulse oximetry and respiratory monitoring during and after procedure', 'Blood pressure', 'Level of sedation'],
    cautions: [
      'Contraindicated in narrow-angle glaucoma and shock',
      'Caution in CHF, renal/hepatic impairment, pulmonary disease',
      'CYP3A4 substrate — levels increased by clarithromycin, diltiazem, erythromycin, itraconazole, ketoconazole',
      'Younger children often require higher weight-based doses due to pharmacokinetics',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    calculate: (weight, age) => {
      let low: number, high: number, maxDose: number;
      if (age <= 5) { low = weight * 0.05; high = weight * 0.1; maxDose = 6; }
      else if (age <= 12) { low = weight * 0.025; high = weight * 0.05; maxDose = 10; }
      else { low = 0.5; high = 2.5; maxDose = 10; }
      return {
        dosePerKg: age <= 5 ? '0.05–0.1 mg/kg/dose IV' : age <= 12 ? '0.025–0.05 mg/kg/dose IV' : '0.5–2.5 mg/dose IV (fixed dosing in adolescents)',
        totalDose: age <= 12 ? `${low.toFixed(2)}–${high.toFixed(2)} mg/dose` : `${low}–${high} mg/dose`,
        interval: 'Over 2–3 min, may repeat Q2–3min PRN to max total dose',
        route: 'IV (titrate to effect); IM or PO alternatives available — see administration',
        concentration: '1 mg/mL or 5 mg/mL injection; 2 mg/mL oral syrup',
        basisNote: `Age-banded procedural sedation dosing (${age} years)`,
        maxDose: `Max total dose per procedure: ${maxDose} mg`,
        warningNote: 'Respiratory depression and hypotension — requires continuous monitoring during procedure. Reversed by flumazenil.',
      };
    },
  },

  // ─── Cardiovascular ─────────────────────────────────────────────────────
  {
    id: 'digoxin',
    name: 'Digoxin',
    brandName: 'Lanoxin',
    category: 'Cardiovascular',
    indications: ['Chronic heart failure (maintenance)', 'Rate control in supraventricular tachyarrhythmias'],
    administration: 'Oral maintenance dosing shown below (divided BID if <10y, once daily if ≥10y). IV digitalisation/loading is a specialist-initiated regimen with ECG monitoring — not calculated here.',
    monitoring: ['Serum digoxin level (therapeutic 0.8–2 ng/mL) — sample ≥6h post-dose', 'ECG — PR interval, arrhythmia, signs of toxicity', 'Serum potassium, calcium, magnesium, renal function'],
    cautions: [
      'Contraindicated in ventricular fibrillation/tachycardia and heart block',
      'Renally excreted — reduce dose in renal impairment',
      'Hypokalaemia, hypercalcaemia and hypomagnesaemia increase toxicity risk',
      'Amiodarone, verapamil, quinidine, macrolides and itraconazole increase digoxin levels; beta-blockers add to bradycardia risk',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    calculate: (weight, age) => {
      let lowPerKg: number, highPerKg: number, freq: number, freqLabel: string, basisNote: string;
      if (age < 2) { lowPerKg = 10; highPerKg = 12; freq = 2; freqLabel = 'q12h (divided BID)'; basisNote = 'Age < 2 years'; }
      else if (age <= 10) { lowPerKg = 8; highPerKg = 10; freq = 2; freqLabel = 'q12h (divided BID)'; basisNote = 'Age 2–10 years'; }
      else { lowPerKg = 2.5; highPerKg = 5; freq = 1; freqLabel = 'once daily'; basisNote = 'Age > 10 years'; }
      const lowTotal = (weight * lowPerKg) / freq;
      const highTotal = (weight * highPerKg) / freq;
      return {
        dosePerKg: `${lowPerKg}–${highPerKg} mcg/kg/24h (maintenance)`,
        totalDose: `${lowTotal.toFixed(1)}–${highTotal.toFixed(1)} mcg/dose ${freqLabel}`,
        interval: freqLabel,
        route: 'PO (IV maintenance dose is approximately 75% of the PO dose — specialist guidance)',
        concentration: '50 mcg/mL oral solution; 62.5/125/250 mcg tablets',
        basisNote,
        warningNote: 'Narrow therapeutic index — verify against a specialist/cardiology-approved regimen before administering.',
      };
    },
  },
  {
    id: 'propranolol',
    name: 'Propranolol',
    category: 'Cardiovascular',
    indications: ['Supraventricular arrhythmias (rate control)', 'Also used for hypertension, migraine prophylaxis, tetralogy spells, thyrotoxicosis and infantile haemangioma (different regimens — see cautions)'],
    administration: 'PO: start 0.5–1 mg/kg/24h ÷ Q6–8h, increase every 3–5 days; usual maintenance 2–4 mg/kg/24h ÷ Q6–8h. IV (arrhythmia, monitored setting only): 0.01–0.1 mg/kg/dose slow push over 10 min.',
    monitoring: ['Heart rate and blood pressure', 'ECG (PR interval, bradycardia)', 'Blood glucose in diabetics (may mask hypoglycaemia symptoms)'],
    cautions: [
      'Contraindicated in asthma/reactive airway disease, heart block, decompensated heart failure, severe bradycardia',
      'Caution in diabetes (masks hypoglycaemia symptoms) and Raynaud phenomenon',
      'Different dosing regimens apply for hypertension (start 0.5–1 mg/kg/24h ÷ Q6–12h, max 8 mg/kg/24h), migraine prophylaxis, tetralogy spells, thyrotoxicosis, and infantile haemangioma',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    calculate: (weight) => {
      const lowDaily = weight * 2;
      const highDaily = weight * 4;
      const maxDaily = Math.min(60, weight * 16);
      const cappedHigh = Math.min(highDaily, maxDaily);
      const perDoseLow = lowDaily / 3;
      const perDoseHigh = cappedHigh / 3;
      return {
        dosePerKg: '2–4 mg/kg/24h divided Q6–8h (arrhythmia dosing)',
        totalDose: `${perDoseLow.toFixed(1)}–${perDoseHigh.toFixed(1)} mg/dose Q8h (${lowDaily.toFixed(0)}–${cappedHigh.toFixed(0)} mg/24h)`,
        interval: 'Q6–8h',
        route: 'PO (IV only in a monitored/ICU setting for acute arrhythmia)',
        concentration: '20 mg/5 mL or 40 mg/5 mL oral solution; 10/20/40/60/80 mg tablets',
        basisNote: 'Arrhythmia dosing — start at the lower end (0.5–1 mg/kg/24h) and titrate up every 3–5 days',
        maxDose: `${maxDaily.toFixed(0)} mg/24h (lesser of 60 mg/24h or 16 mg/kg/24h)`,
        warningNote: 'Contraindicated in asthma, heart block, decompensated heart failure. Different weight-based regimens apply for other indications — confirm before use.',
      };
    },
  },
  {
    id: 'captopril',
    name: 'Captopril',
    category: 'Cardiovascular',
    indications: ['Hypertension'],
    administration: 'Give on an empty stomach (1h before or 2h after meals). Start at the low end of the dose range and titrate up.',
    monitoring: ['Blood pressure (first-dose hypotension risk)', 'Renal function and serum potassium', 'CBC (rare neutropenia)'],
    cautions: [
      'May cause cough, angioedema, hyperkalaemia, rash, taste disturbance, proteinuria',
      'Avoid combining with potassium-sparing diuretics or ARBs',
      'Adjust dose in renal impairment',
      'Avoid in pregnancy',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Initially 12.5–25 mg/dose BID–TID, increase weekly by 25mg to max 450 mg/24h; usual maintenance 25–100 mg/24h BID–TID.',
    calculate: (weight, age) => {
      const isInfant = age < 1;
      const lowPerKg = isInfant ? 0.05 : 0.3;
      const highPerKg = isInfant ? 0.3 : 0.5;
      const lowDose = weight * lowPerKg;
      const highDose = weight * highPerKg;
      const maxDaily = Math.min(450, weight * 6);
      return {
        dosePerKg: `${lowPerKg}–${highPerKg} mg/kg/dose BID–TID`,
        totalDose: `${lowDose.toFixed(2)}–${highDose.toFixed(2)} mg/dose`,
        interval: 'BID–TID',
        route: 'PO',
        concentration: '1 mg/mL oral suspension; 12.5/25/50/100 mg tablets',
        basisNote: isInfant ? 'Infant dosing — titrate up gradually' : 'Child/adolescent dosing — titrate up gradually',
        maxDose: `${maxDaily.toFixed(0)} mg/24h (lesser of 450 mg/24h or 6 mg/kg/24h)`,
        warningNote: 'First dose may cause significant hypotension — give initial dose under monitoring in young infants.',
      };
    },
  },
  {
    id: 'furosemide',
    name: 'Furosemide',
    brandName: 'Lasix',
    category: 'Cardiovascular',
    indications: ['Fluid overload / oedema', 'Hypertension (adjunct)', 'Oliguria'],
    administration: 'IV/IM: 0.5–2 mg/kg/dose Q6–12h. PO (less bioavailable than IV): typically higher per-kg dose, 1–6 mg/kg/dose Q12–24h. Give IV slowly (max rate 0.5 mg/kg/min).',
    monitoring: ['Urine output (response expected within 1–2h)', 'Electrolytes — Na, K, Cl', 'Renal function', 'Hearing with prolonged/high-dose or aminoglycoside co-therapy'],
    cautions: [
      'Contraindicated in anuria and hepatic coma',
      'Do not exceed 0.5 mg/kg/min on IV push — faster administration risks ototoxicity',
      'Prolonged use in infants may cause nephrocalcinosis',
      'Continuous infusion alternative: 0.05–0.4 mg/kg/hr after a loading bolus',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    calculate: (weight) => {
      const low = weight * 0.5;
      const high = weight * 2;
      const maxDose = Math.min(200, weight * 6);
      return {
        dosePerKg: '0.5–2 mg/kg/dose IV/IM',
        totalDose: `${low.toFixed(1)}–${high.toFixed(1)} mg/dose`,
        interval: 'Q6–12h',
        route: 'IV (slow push, max 0.5 mg/kg/min) or IM; PO alternative at a higher per-kg dose (1–6 mg/kg/dose Q12–24h)',
        concentration: '10 mg/mL injection; 10 mg/mL or 40 mg/5 mL oral solution',
        basisNote: 'Standard infant/child IV/IM dosing',
        maxDose: `${maxDose.toFixed(0)} mg/dose (lesser of 200 mg/dose or 6 mg/kg/dose)`,
        warningNote: 'Monitor electrolytes — hypokalaemia, hypochloraemic alkalosis common. Ototoxicity risk with rapid IV push or concurrent aminoglycosides.',
      };
    },
  },
  {
    id: 'hydralazine',
    name: 'Hydralazine',
    category: 'Cardiovascular',
    indications: ['Chronic hypertension'],
    administration: 'PO, starting dose titrated up over 3–4 weeks. Acute severe hypertension: 0.1–0.2 mg/kg/dose IV/IM Q4–6h PRN, max 20 mg/dose, in a monitored setting.',
    monitoring: ['Blood pressure and heart rate (reflex tachycardia common)', 'Signs of lupus-like syndrome with prolonged/high-dose therapy'],
    cautions: [
      'Caution in severe renal or cardiac disease',
      'Reflex tachycardia and headache common — often combined with a beta-blocker',
      'Adjust dose in renal impairment',
      'Chronic high-dose therapy or slow acetylator status carries a reversible lupus-like syndrome risk',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    calculate: (weight) => {
      const lowDaily = weight * 0.75;
      const highDaily = weight * 1;
      return {
        dosePerKg: '0.75–1 mg/kg/24h (starting dose) divided Q6–12h',
        totalDose: `${(lowDaily / 2).toFixed(2)}–${(highDaily / 2).toFixed(2)} mg/dose (÷ BID) — see basis for titration ceiling`,
        interval: 'Q6–12h (start), titrate over 3–4 weeks',
        route: 'PO (acute severe hypertension: 0.1–0.2 mg/kg/dose IV/IM Q4–6h PRN, max 20 mg/dose)',
        concentration: '4 mg/mL oral liquid; 10/25/50/100 mg tablets; 20 mg/mL injection',
        basisNote: 'Starting dose — may be titrated over 3–4 weeks up to 5 mg/kg/24h (infant) or 7.5 mg/kg/24h (child), max 200 mg/24h',
        maxDose: '200 mg/24h (titrated ceiling)',
        warningNote: 'Chronic high-dose therapy or slow acetylator status carries a reversible lupus-like syndrome risk.',
      };
    },
  },
  {
    id: 'labetalol',
    name: 'Labetalol',
    category: 'Cardiovascular',
    indications: ['Hypertensive emergency (IV)', 'Chronic hypertension (oral maintenance)'],
    administration: 'IV bolus or continuous infusion for hypertensive emergency, titrated to blood pressure response. Oral maintenance: 1–3 mg/kg/24h ÷ BID, max 12 mg/kg/24h up to 1200 mg/24h.',
    monitoring: ['Continuous blood pressure and heart rate monitoring during IV use', 'ECG for heart block/bradycardia'],
    cautions: [
      'Contraindicated in asthma/reactive airway disease, cardiogenic shock, decompensated heart failure, heart block',
      'Orthostatic hypotension — keep patient supine for up to 3h post-IV dose',
      'Reduce dose in hepatic impairment',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    calculate: (weight) => {
      const bolusLow = weight * 0.2;
      const bolusHigh = Math.min(weight * 1, 40);
      const infLow = weight * 0.4;
      const infHigh = weight * 3;
      return {
        dosePerKg: '0.2–1 mg/kg/dose IV bolus (max 40 mg/dose) OR 0.4–3 mg/kg/hr continuous infusion',
        totalDose: `Bolus: ${bolusLow.toFixed(1)}–${bolusHigh.toFixed(1)} mg | Infusion: ${infLow.toFixed(1)}–${infHigh.toFixed(1)} mg/hr`,
        interval: 'Bolus Q10min PRN, or continuous infusion titrated to effect',
        route: 'IV (hypertensive emergency, monitored setting)',
        concentration: '5 mg/mL injection (also premixed 1 mg/mL)',
        basisNote: 'Start at the low end of the range and titrate to blood pressure response',
        maxDose: 'Bolus max 40 mg/dose; infusion max 3 mg/kg/hr',
        infusionNote: `Continuous infusion range: ${infLow.toFixed(1)}–${infHigh.toFixed(1)} mg/hr, titrated to blood pressure`,
        warningNote: 'Contraindicated in asthma, cardiogenic shock, heart block, decompensated heart failure. Keep patient supine for up to 3h after an IV dose.',
      };
    },
  },

  {
    id: 'adenosine',
    name: 'Adenosine',
    category: 'Cardiovascular',
    indications: ['Supraventricular tachycardia (SVT) — non-arrest, rapid IV termination'],
    administration: 'Rapid IV/IO push over 1–2 sec, immediately followed by a rapid saline flush. For cardiac arrest dosing, see the Resuscitation section.',
    monitoring: ['Continuous ECG monitoring during administration', 'Blood pressure', 'Respiratory status (bronchoconstriction risk in asthma)'],
    cautions: [
      'Contraindicated in 2nd/3rd degree AV block or sick sinus syndrome unless paced',
      'Caution with digoxin (enhanced SA/AV node depression)',
      'Methylxanthines (caffeine, theophylline) decrease effect; carbamazepine/dipyridamole increase effect',
      'Transient asystole, flushing, chest pain, and dyspnoea are expected transient effects',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '6mg rapid IV push; if no response in 1-2min, 12mg; may repeat 12mg once. Max single dose 12mg.',
    calculate: (weight, age) => {
      if (age < (1 / 12)) {
        const dose = weight * 0.05;
        return {
          dosePerKg: '0.05–0.1 mg/kg rapid IV push over 1–2 sec, may increase by 0.05–0.1 mg/kg increments Q2min (max single dose 0.3 mg/kg)',
          totalDose: `${dose.toFixed(2)} mg (starting dose)`,
          interval: 'Q2min PRN until termination or max single dose reached',
          route: 'IV rapid push (follow immediately with a rapid saline flush)',
          concentration: '3 mg/mL injection, preservative-free',
          basisNote: 'Neonatal SVT dosing',
          maxDose: '0.3 mg/kg (single dose)',
          warningNote: 'Contraindicated in 2nd/3rd degree AV block or sick sinus syndrome (unless paced). Very short half-life (<10 sec) — give as a rapid push immediately followed by a flush.',
        };
      }
      const dose = Math.min(weight * 0.1, 6);
      return {
        dosePerKg: '0.1 mg/kg rapid IV/IO push (initial max 6 mg), may repeat at 0.2 mg/kg then 0.3 mg/kg (subsequent max 12 mg)',
        totalDose: `${dose.toFixed(1)} mg (initial dose)`,
        interval: 'Q2min PRN until termination',
        route: 'IV/IO rapid push (follow immediately with a rapid saline flush)',
        concentration: '3 mg/mL injection, preservative-free',
        basisNote: 'Child/adolescent SVT dosing',
        maxDose: '12 mg (subsequent doses)',
        warningNote: 'Contraindicated in 2nd/3rd degree AV block or sick sinus syndrome (unless paced). May precipitate bronchoconstriction in asthmatics. Very short half-life (<10 sec) — give as a rapid push immediately followed by a flush.',
      };
    },
  },
  {
    id: 'amiodarone',
    name: 'Amiodarone',
    category: 'Cardiovascular',
    indications: ['Tachyarrhythmia (non-arrest — for cardiac arrest dosing, see the Resuscitation section)'],
    administration: 'PO for chronic tachyarrhythmia control. IV loading (limited data): 5 mg/kg (max 300mg) over 30–60 min, then infusion starting at 5 mcg/kg/min.',
    monitoring: ['ECG (QTc, bradycardia)', 'Thyroid function with chronic use', 'LFTs and pulmonary function with chronic use', 'Serum amiodarone level (therapeutic 1–2.5 mg/L, chronic oral use)'],
    cautions: [
      'Contraindicated in severe sinus node dysfunction, marked sinus bradycardia, 2nd/3rd degree AV block',
      'Correct hypokalaemia, hypocalcaemia, and hypomagnesaemia before use (QTc risk)',
      'Very long elimination half-life (weeks) — effects and interactions persist long after stopping',
      'Increases ciclosporin, digoxin, phenytoin, tacrolimus, warfarin, calcium channel blocker, theophylline, and quinidine levels',
      'This entry covers non-arrest tachyarrhythmia dosing — cardiac arrest dosing is in the app\'s Resuscitation section',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Per tachyarrhythmia protocol — similar mg/kg loading with chronic maintenance individualised.',
    calculate: (weight, age) => {
      if (age < 1) {
        const bsa = Math.sqrt((weight * 100) / 3600);
        const loadLow = 600 * bsa;
        const loadHigh = 800 * bsa;
        return {
          dosePerKg: '600–800 mg/1.73m²/24h ÷ Q12–24h ×4–14 days (loading), then reduce to 200–400 mg/1.73m²/24h',
          totalDose: `${loadLow.toFixed(0)}–${loadHigh.toFixed(0)} mg/24h (loading, via BSA)`,
          interval: 'Q12–24h',
          route: 'PO',
          concentration: '100/200/400 mg tablets; 5 mg/mL oral suspension',
          basisNote: 'Age <1 year — BSA-based dosing',
          warningNote: 'IV loading (limited data): 5 mg/kg (max 300mg) over 30–60 min, then infusion starting at 5 mcg/kg/min, up to max 15 mcg/kg/min or 20 mg/kg/24h. Correct hypokalaemia/hypomagnesaemia before use. For cardiac arrest dosing, see the Resuscitation section.',
        };
      }
      const loadLow = weight * 10;
      const loadHigh = weight * 15;
      return {
        dosePerKg: '10–15 mg/kg/24h ÷ Q12–24h ×4–14 days (loading), then reduce to 5 mg/kg/24h if effective',
        totalDose: `${loadLow.toFixed(0)}–${loadHigh.toFixed(0)} mg/24h (loading)`,
        interval: 'Q12–24h',
        route: 'PO',
        concentration: '100/200/400 mg tablets; 5 mg/mL oral suspension',
        basisNote: 'Age ≥1 year',
        warningNote: 'IV loading (limited data): 5 mg/kg (max 300mg) over 30–60 min, then infusion starting at 5 mcg/kg/min, up to max 15 mcg/kg/min or 20 mg/kg/24h (max 2200 mg/24h). Correct hypokalaemia/hypomagnesaemia before use. For cardiac arrest dosing, see the Resuscitation section.',
      };
    },
  },
  {
    id: 'amlodipine',
    name: 'Amlodipine',
    category: 'Cardiovascular',
    indications: ['Hypertension'],
    administration: 'PO, once daily or BID. Allow 5–7 days before adjusting the dose (gradual onset, long half-life).',
    monitoring: ['Blood pressure', 'Peripheral oedema'],
    cautions: [
      'Reduce dose in hepatic insufficiency',
      'CYP3A4 substrate — caution with azole antifungals/protease inhibitors',
      'Allow 5–7 days between dose adjustments',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '5-10mg once daily; 2.5mg if hepatic insufficiency.',
    calculate: (weight, age) => {
      if (age < 6) {
        const dose = Math.min(weight * 0.1, 5);
        const maxDaily = Math.min(weight * 0.6, 5);
        return {
          dosePerKg: '0.1 mg/kg/dose (max 5 mg) once daily–BID',
          totalDose: `${dose.toFixed(2)} mg/dose`,
          interval: 'Once daily or BID',
          route: 'PO',
          concentration: '1 mg/mL oral solution/suspension; 2.5/5/10 mg tablets',
          basisNote: 'Age <6 years — may need higher mg/kg doses and BID dosing for better efficacy',
          maxDose: `${maxDaily.toFixed(1)} mg/24h (max 0.6 mg/kg/24h, up to 5 mg/24h)`,
          warningNote: 'Allow 5–7 days before dose adjustments — gradual onset and long half-life.',
        };
      }
      return {
        dosePerKg: 'Fixed dosing (not weight-based)',
        totalDose: '2.5 mg once daily (start), max 10 mg/24h',
        interval: 'Once daily',
        route: 'PO',
        concentration: '1 mg/mL oral solution/suspension; 2.5/5/10 mg tablets',
        basisNote: 'Age 6–17 years',
        maxDose: '10 mg/24h',
        warningNote: 'Allow 5–7 days before dose adjustments — gradual onset and long half-life. Reduce dose in hepatic insufficiency.',
      };
    },
  },
  {
    id: 'dobutamine',
    name: 'Dobutamine',
    category: 'Cardiovascular',
    indications: ['Cardiogenic shock / low cardiac output state (inotropic support)'],
    administration: 'Continuous IV infusion, titrated to effect.',
    monitoring: ['Continuous ECG and blood pressure monitoring', 'Heart rate (tachyarrhythmia risk)', 'Urine output / perfusion markers'],
    cautions: [
      'Contraindicated in idiopathic hypertrophic subaortic stenosis (IHSS)',
      'Correct hypovolaemia before starting',
      'Less effective than dopamine at raising blood pressure in premature neonates',
      'Linezolid may increase blood pressure; COMT inhibitors may increase arrhythmia risk',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Same mcg/kg/min dosing.',
    calculate: (weight) => {
      const low = weight * 2;
      const high = weight * 20;
      return {
        dosePerKg: '2–20 mcg/kg/min continuous IV infusion',
        totalDose: `${low.toFixed(1)}–${high.toFixed(1)} mcg/min`,
        interval: 'Continuous infusion, titrate to effect',
        route: 'IV (central line preferred)',
        concentration: '12.5 mg/mL injection; prediluted 1/2/4 mg/mL in D5W',
        basisNote: 'All ages',
        maxDose: '40 mcg/kg/min',
        warningNote: 'Contraindicated in idiopathic hypertrophic subaortic stenosis (IHSS). Correct hypovolaemia before starting. Tachycardia/ectopy/hypertension possible, especially at higher rates.',
      };
    },
  },
  {
    id: 'dopamine',
    name: 'Dopamine',
    category: 'Cardiovascular',
    indications: ['Shock / hypotension (dose-dependent renal, cardiac, or vasopressor effect)'],
    administration: 'Continuous IV infusion via central line/large vein, titrated to desired haemodynamic effect.',
    monitoring: ['Continuous ECG and blood pressure monitoring', 'IV site (extravasation risk — use a secure central line)', 'Urine output'],
    cautions: [
      'Do not use in phaeochromocytoma, tachyarrhythmias, or uncorrected hypovolaemia (correct first)',
      'Newborns are more sensitive to vasoconstrictive effects; children <2y clear the drug faster',
      'Administer via a central line/large vein — extravasation causes tissue necrosis, treat with phentolamine',
      'Never give via umbilical arterial catheter',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Same mcg/kg/min dosing.',
    calculate: (weight) => {
      const low = weight * 5;
      const high = weight * 15;
      return {
        dosePerKg: 'Low dose 2–5 mcg/kg/min (renal) | Intermediate 5–15 mcg/kg/min (cardiac) | High >15 mcg/kg/min (vasopressor)',
        totalDose: `Intermediate range shown: ${low.toFixed(1)}–${high.toFixed(1)} mcg/min`,
        interval: 'Continuous infusion, titrate to effect',
        route: 'IV via central line/large vein (extravasation causes tissue necrosis)',
        concentration: '40 mg/mL injection; prediluted 0.8/1.6/3.2 mg/mL in D5W',
        basisNote: 'All ages — dose selected by desired haemodynamic effect',
        maxDose: '20–50 mcg/kg/min',
        warningNote: 'Do not use in phaeochromocytoma, tachyarrhythmias, or uncorrected hypovolaemia. Never give via umbilical arterial catheter. Extravasation treated with phentolamine.',
      };
    },
  },
  {
    id: 'esmolol',
    name: 'Esmolol',
    category: 'Cardiovascular',
    indications: ['Postoperative hypertension', 'Supraventricular tachycardia (non-arrest, rate control)'],
    administration: 'IV load followed by continuous infusion, titrated to response. Monitored setting only.',
    monitoring: ['Continuous ECG and blood pressure monitoring (monitored/ICU setting only)', 'Heart rate'],
    cautions: [
      'Contraindicated in sinus bradycardia, >1st-degree heart block, cardiogenic shock/heart failure',
      'Bronchospasm and hypotension possible, especially at higher infusion rates (>200 mcg/kg/min)',
      'Increases digoxin (10–20%) and theophylline levels',
      'Administer only in a monitored setting',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Similar mcg/kg dosing, titrated to response.',
    calculate: (weight) => {
      const loadLow = weight * 100;
      const loadHigh = weight * 500;
      const maintLow = weight * 25;
      const maintHigh = weight * 100;
      return {
        dosePerKg: 'Load: 100–500 mcg/kg IV over 1 min | Maintenance: 25–100 mcg/kg/min infusion, titrate up 50–100 mcg/kg/min Q5–10min PRN',
        totalDose: `Load: ${loadLow.toFixed(0)}–${loadHigh.toFixed(0)} mcg | Maintenance: ${maintLow.toFixed(0)}–${maintHigh.toFixed(0)} mcg/min`,
        interval: 'Load once, then continuous infusion titrated to response',
        route: 'IV — monitored setting only',
        concentration: '10 mg/mL injection; premixed 2000mg/100mL, 2500mg/250mL',
        basisNote: 'SVT dosing (limited paediatric data)',
        maxDose: 'Up to 1000 mcg/kg/min reported in refractory cases',
        warningNote: 'Postoperative hypertension uses a higher-dose regimen (load 500 mcg/kg, maintenance 50–250 mcg/kg/min, up to 700–1000 mcg/kg/min in cardiac surgery patients). Contraindicated in sinus bradycardia, >1st-degree heart block, cardiogenic shock/heart failure. Very short half-life — administer only in a monitored setting.',
      };
    },
  },
  {
    id: 'metoprolol',
    name: 'Metoprolol',
    category: 'Cardiovascular',
    indications: ['Hypertension', 'Rate control in supraventricular arrhythmias'],
    administration: 'PO. Extended-release (age ≥6y) is once daily; immediate-release is BID.',
    monitoring: ['Heart rate and blood pressure', 'ECG (PR interval, bradycardia)'],
    cautions: [
      'Contraindicated in sinus bradycardia, heart block >1st degree, sick sinus syndrome (unless paced), cardiogenic shock, uncompensated CHF',
      'Not for bronchospastic disease',
      'Caution with verapamil/diltiazem (additive myocardial depression)',
      'Avoid abrupt cessation — risk in ischaemic heart disease',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Similar weight-independent titration per adult hypertension/arrhythmia protocols.',
    calculate: (weight) => {
      const low = weight * 1;
      const high = Math.min(weight * 6, 200);
      return {
        dosePerKg: '1–2 mg/kg/24h ÷ BID (immediate-release, start; initial max 25 mg/dose), titrate up to max 6 mg/kg/24h',
        totalDose: `${low.toFixed(0)} mg/24h (start) — up to ${high.toFixed(0)} mg/24h`,
        interval: 'BID (immediate-release) or once daily (extended-release, age ≥6 years)',
        route: 'PO',
        concentration: '10 mg/mL oral liquid; 25/37.5/50/75/100 mg tablets; 25/50/100/200 mg extended-release tablets',
        basisNote: 'Age ≥1 year',
        maxDose: '200 mg/24h (max 6 mg/kg/24h)',
        warningNote: 'Extended-release (≥6y): start 1 mg/kg/dose (max 50mg) once daily, max 2 mg/kg/24h or 200 mg/24h. Contraindicated in sinus bradycardia, heart block >1st degree, sick sinus syndrome (unless paced), cardiogenic shock, uncompensated CHF. Avoid abrupt cessation.',
      };
    },
  },
  {
    id: 'milrinone',
    name: 'Milrinone',
    category: 'Cardiovascular',
    indications: ['Low cardiac output state (inotrope, phosphodiesterase inhibitor)'],
    administration: 'Optional IV load then continuous infusion, titrated to effect.',
    monitoring: ['Continuous blood pressure and ECG monitoring', 'Electrolytes (hypokalaemia)', 'LFTs and platelet count with prolonged use'],
    cautions: [
      'Contraindicated in severe aortic/pulmonic stenosis and acute MI',
      'Paediatric patients often need higher mcg/kg/min doses than adults (faster elimination, larger volume of distribution)',
      'Reduce dose in renal impairment',
      'Effects can persist 3–5h after stopping — plan transitions accordingly',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Similar mcg/kg/min dosing.',
    calculate: (weight) => {
      const loadDose = weight * 50;
      const low = weight * 0.25;
      const high = weight * 0.75;
      return {
        dosePerKg: 'Optional load: 50 mcg/kg IV over 15 min (hypotension risk — some avoid) | Maintenance: 0.25–0.75 mcg/kg/min continuous infusion',
        totalDose: `Load: ${loadDose.toFixed(0)} mcg | Maintenance: ${low.toFixed(2)}–${high.toFixed(2)} mcg/min`,
        interval: 'Optional load once, then continuous infusion titrated to effect',
        route: 'IV',
        concentration: '1 mg/mL injection; premixed 200 mcg/mL in D5W',
        basisNote: 'Infant/child/adolescent (limited data)',
        warningNote: 'Contraindicated in severe aortic/pulmonic stenosis and acute MI. Haemodynamic effects can persist 3–5h after stopping the infusion. Reduce dose in renal impairment.',
      };
    },
  },
  {
    id: 'nifedipine',
    name: 'Nifedipine',
    category: 'Cardiovascular',
    indications: ['Chronic hypertension'],
    administration: 'PO, sustained-release preferred. Immediate-release use in children is largely abandoned due to rapid BP-drop risk.',
    monitoring: ['Blood pressure (rapid-drop risk, especially with immediate-release form)', 'Heart rate'],
    cautions: [
      'Immediate-release form use in children is controversial/largely abandoned — sustained-release preferred',
      'Caution with acute CNS injury (stroke/seizure risk), CHF, aortic stenosis, cirrhosis',
      'Do not give with grapefruit juice',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Similar mg/kg-independent adult hypertension dosing.',
    calculate: (weight) => {
      const low = weight * 0.2;
      const high = Math.min(weight * 0.5, 60);
      const maxDaily = Math.min(weight * 3, 120);
      return {
        dosePerKg: '0.2–0.5 mg/kg/24h ÷ Q12–24h (sustained-release, initial max 30–60 mg/24h)',
        totalDose: `${low.toFixed(1)}–${high.toFixed(1)} mg/24h`,
        interval: 'Q12–24h',
        route: 'PO (sustained-release tablets — immediate-release largely abandoned in children)',
        concentration: '4 mg/mL oral suspension; 10/20 mg capsules (IR); 30/60/90 mg sustained-release tablets',
        basisNote: 'Chronic hypertension dosing',
        maxDose: `${maxDaily.toFixed(0)} mg/24h (max 3 mg/kg/24h, up to 120 mg/24h)`,
        warningNote: 'Immediate-release nifedipine is largely avoided in children due to the risk of a rapid, excessive drop in blood pressure. Do not give with grapefruit juice.',
      };
    },
  },
  {
    id: 'nitroglycerin',
    name: 'Nitroglycerin',
    category: 'Cardiovascular',
    indications: ['Hypertensive emergency (arteriolar/venodilation, IV)'],
    administration: 'Continuous IV infusion, titrated to effect. Must use polypropylene infusion sets (drug adsorbs to standard plastic).',
    monitoring: ['Continuous blood pressure monitoring', 'Methaemoglobin level with prolonged/high-dose use'],
    cautions: [
      'Contraindicated with raised ICP, cerebral haemorrhage, TBI, shock, severe anaemia, concurrent PDE5 inhibitors/guanylate cyclase stimulators',
      'Must use polypropylene (not standard PVC) infusion sets — drug adsorbs to plastic',
      'Tachyphylaxis within 24–48h continuous use — a 10–12h/day nitrate-free period is recommended',
      'May cause methaemoglobinaemia',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Adult dosing is in mcg/min (not mcg/kg/min) — different unit convention.',
    calculate: (weight) => {
      const low = weight * 0.25;
      const high = weight * 5;
      return {
        dosePerKg: '0.25–0.5 mcg/kg/min (start), titrate by 0.5–1 mcg/kg/min Q3–5min PRN — usual dose 1–5 mcg/kg/min',
        totalDose: `${low.toFixed(2)}–${high.toFixed(1)} mcg/min`,
        interval: 'Continuous infusion, titrate to effect',
        route: 'IV — must use polypropylene infusion sets (drug adsorbs to standard plastic)',
        concentration: '5 mg/mL injection; prediluted 100/200/400 mcg/mL in D5W',
        basisNote: 'Infant/child dosing (note: paediatric dosing is mcg/kg/min, unlike adult mcg/min dosing)',
        maxDose: '20 mcg/kg/min',
        warningNote: 'Contraindicated with raised ICP, cerebral haemorrhage, TBI, shock, severe anaemia, and concurrent PDE5 inhibitors (e.g. sildenafil). Tachyphylaxis develops within 24–48h of continuous use — a nitrate-free period is recommended.',
      };
    },
  },
  {
    id: 'nitroprusside',
    name: 'Nitroprusside',
    category: 'Cardiovascular',
    indications: ['Hypertensive emergency (rapid-onset, titratable IV vasodilator)'],
    administration: 'Continuous IV infusion, titrated to effect. Dilute with D5W and protect from light.',
    monitoring: ['Continuous blood pressure monitoring', 'Acid-base status (cyanide/thiocyanate toxicity risk with prolonged/high-dose use)'],
    cautions: [
      'Contraindicated with decreased cerebral perfusion and compensatory hypertension (e.g. raised ICP)',
      'Dilute with D5W and protect the solution from light',
      'Prolonged or high-dose infusion carries cyanide/thiocyanate toxicity risk',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Same mcg/kg/min dosing.',
    calculate: (weight) => {
      const low = weight * 0.3;
      const high = weight * 4;
      return {
        dosePerKg: '0.3–0.5 mcg/kg/min (start), titrate to effect — usual dose 3–4 mcg/kg/min',
        totalDose: `${low.toFixed(1)}–${high.toFixed(1)} mcg/min`,
        interval: 'Continuous infusion, titrate to effect',
        route: 'IV — dilute with D5W and protect from light',
        concentration: '25 mg/mL injection; prediluted 0.2/0.5 mg/mL in NS',
        basisNote: 'Child/adolescent/adult dosing',
        maxDose: '10 mcg/kg/min',
        warningNote: 'Contraindicated with decreased cerebral perfusion and compensatory hypertension (e.g. raised ICP). Prolonged/high-dose use risks cyanide/thiocyanate toxicity — monitor for acidosis.',
      };
    },
  },
  {
    id: 'sildenafil',
    name: 'Sildenafil',
    category: 'Cardiovascular',
    indications: ['Pulmonary arterial hypertension'],
    administration: 'PO.',
    monitoring: ['Blood pressure (hypotension, especially with nitrates)', 'Clinical response — exercise tolerance, oxygen requirement', 'Long-term mortality risk reassessment given the boxed warning'],
    cautions: [
      'BOXED WARNING: increased mortality with long-term high-dose use in children 1–17y — use the lowest effective dose',
      'Contraindicated with concurrent nitrates/nitric oxide donors (severe hypotension risk)',
      'Caution in hepatic insufficiency/severe renal impairment (GFR<30) — reduces clearance',
      'CYP3A4 substrate — many interactions (azoles, macrolides, protease inhibitors increase levels)',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Revatio (PAH) 20mg TID.',
    calculate: (weight, age) => {
      if (age < 1) {
        const low = weight * 0.25;
        const high = weight * 2;
        return {
          dosePerKg: '0.25 mg/kg/dose Q6h or 0.5 mg/kg/dose Q8h (start), titrate up to 1–2 mg/kg/dose Q6–8h',
          totalDose: `${low.toFixed(2)}–${high.toFixed(1)} mg/dose`,
          interval: 'Q6–8h',
          route: 'PO',
          concentration: '2.5–10 mg/mL oral suspension; 20/25/50/100 mg tablets',
          basisNote: 'Infant dosing (limited data)',
          warningNote: 'Contraindicated with concurrent nitrates/nitric oxide donors. A dose-ranging study found increased mortality with long-term (>2yr) high-dose use in children 1–17y — optimal paediatric dosing remains undetermined; use the lowest effective dose.',
        };
      }
      let dose: number;
      if (weight <= 20) dose = 10;
      else if (weight <= 45) dose = 20;
      else dose = 40;
      return {
        dosePerKg: 'Weight-banded fixed dosing (8–20kg: 10mg, >20–45kg: 20mg, >45kg: 40mg) TID',
        totalDose: `${dose} mg/dose TID`,
        interval: 'TID',
        route: 'PO',
        concentration: '2.5–10 mg/mL oral suspension; 20/25/50/100 mg tablets',
        basisNote: 'Age 1–17 years',
        warningNote: 'BOXED WARNING: a dose-ranging study found increased mortality risk with long-term (>2 years) high-dose use in children 1–17 years (HR ~4x vs low dose). Optimal paediatric dosing remains undetermined — use the lowest effective dose and reassess regularly. Contraindicated with concurrent nitrates/nitric oxide donors.',
      };
    },
  },
  {
    id: 'verapamil',
    name: 'Verapamil',
    category: 'Cardiovascular',
    indications: ['Supraventricular tachycardia (age ≥1 year, non-emergency IV termination)'],
    administration: 'IV, over 2–3 min, in a monitored setting. AVOID in neonates/young infants — use adenosine instead.',
    monitoring: ['Continuous ECG and blood pressure monitoring during administration', 'Signs of myocardial depression'],
    cautions: [
      'AVOID IV use in neonates and young infants — apnoea, bradycardia, hypotension risk due to negative inotropic effects; use adenosine instead in this age group',
      'Contraindicated in cardiogenic shock, severe CHF, sick sinus syndrome, AV block',
      'Have calcium and isoproterenol available to reverse myocardial depression',
      'Increases beta-blocker (severe myocardial depression), digoxin, carbamazepine, and ciclosporin levels',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'IV 5-10mg over 2min; may repeat 10mg after 30min.',
    calculate: (weight, age) => {
      if (age < 1) {
        return {
          dosePerKg: 'Not used — see warning',
          totalDose: 'Contraindicated in this age group for IV use',
          interval: '—',
          route: 'N/A',
          concentration: '—',
          basisNote: 'Age <1 year',
          warningNote: 'IV verapamil should NOT be used to treat SVT in neonates and young infants — negative inotropic effects can cause apnoea, bradycardia, and severe hypotension/cardiovascular collapse. Use adenosine instead.',
        };
      }
      const dose = Math.min(weight * 0.1, 5);
      return {
        dosePerKg: '0.1–0.3 mg/kg/dose IV, over 2–3 min, may repeat once in 30 min',
        totalDose: `${dose.toFixed(1)} mg (first dose, max 5 mg)`,
        interval: 'Single dose, may repeat once after 30 min (second dose max 10 mg)',
        route: 'IV, over 2–3 min, in a monitored setting',
        concentration: '2.5 mg/mL injection; 40/80/120 mg tablets, extended-release forms',
        basisNote: 'Age 1–16 years',
        maxDose: 'First dose max 5 mg; second dose max 10 mg',
        warningNote: 'No longer recommended as an antihypertensive in children. Have calcium and isoproterenol available to reverse myocardial depression if it occurs.',
      };
    },
  },

  // ─── Haematology & Anticoagulation ──────────────────────────────────────
  {
    id: 'enoxaparin',
    name: 'Enoxaparin',
    brandName: 'Lovenox',
    category: 'Haematology & Anticoagulation',
    indications: ['DVT / VTE treatment', 'DVT / VTE prophylaxis'],
    administration: 'SC (subcutaneous) injection.',
    monitoring: [
      'Anti-factor Xa level 4h after a subcutaneous dose (after the 3rd consecutive dose) — target 0.5–1 units/mL (treatment) or 0.1–0.4 units/mL (prophylaxis)',
      'Platelet count (thrombocytopenia/HIT risk)',
      'Signs of bleeding',
    ],
    cautions: [
      'Not interchangeable unit-for-unit or mg-for-mg with unfractionated heparin or other LMWHs',
      'Contraindicated in major bleeding, known drug-induced thrombocytopenia, pork protein hypersensitivity',
      'Reduce dosing frequency (Q12h→Q24h) in severe renal impairment (GFR <30 mL/min)',
      'Epidural/spinal anaesthesia: hold ≥12h before catheter placement/removal, restart ≥4h after placement or ≥2h after removal — risk of spinal haematoma/permanent paralysis if not observed',
      'Reversal: protamine sulfate 1 mg neutralises 1 mg enoxaparin',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Treatment: 1mg/kg Q12h SC or 1.5mg/kg Q24h SC. Prophylaxis: 40mg Q24h SC.',
    calculate: (weight, age) => {
      const perDose = age < (2 / 12) ? 1.5 : 1;
      const dose = weight * perDose;
      return {
        dosePerKg: `${perDose} mg/kg/dose SC Q12h (treatment dose)`,
        totalDose: `${dose.toFixed(1)} mg/dose`,
        interval: 'Q12h',
        route: 'SC (subcutaneous injection)',
        concentration: '100 mg/mL injection; fixed-dose prefilled syringes (30/40/60/80/100/120/150 mg)',
        basisNote: age < (2 / 12) ? 'Age <2 months' : 'Age ≥2 months',
        warningNote: 'Prophylaxis dosing is lower: 0.5 mg/kg/dose Q12h (max 30 mg/dose), or 1 mg/kg/dose Q24h (max 40 mg/dose) with epidural catheters. Neonatal (especially premature) dosing is PMA-dependent — use NeoDose or specialist guidance for neonates.',
      };
    },
  },
  {
    id: 'heparin',
    name: 'Heparin',
    category: 'Haematology & Anticoagulation',
    indications: ['Therapeutic anticoagulation (continuous IV infusion)', 'IV line patency (flush)'],
    administration: 'IV load, then continuous infusion titrated to target anti-Xa/aPTT. Do NOT give the loading dose in stroke or significant bleeding risk.',
    monitoring: [
      'UFH anti-Xa level 0.3–0.7 units/mL, OR aPTT (reagent-specific) 50–80 sec — drawn 4–6h after starting/changing the rate, from a different extremity than the infusion',
      'Platelet count (HIT risk)',
      'Signs of bleeding',
    ],
    cautions: [
      'Contraindicated in active major bleeding, known/suspected HIT, concurrent epidural anaesthesia',
      'Caution if platelets <50,000/mm³; avoid IM injections and concurrent NSAIDs/aspirin',
      'Use preservative-free heparin in neonates',
      'Use actual body weight in obese patients',
      'Reversal: protamine sulfate 1 mg per 100 units of heparin given in the preceding 4 hours',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Load 70 units/kg (max 8000), then 18 units/kg/hr (max 1650 units/hr initial).',
    calculate: (weight, age) => {
      const isChild = age >= 1;
      const loadDose = isChild ? Math.min(weight * 75, 8000) : weight * 75;
      const initRate = isChild ? Math.min(weight * 20, 1650) : weight * 28;
      return {
        dosePerKg: isChild ? 'Load: 75 units/kg IV (max 8000 units) | Initial infusion: 20 units/kg/hr (max 1650 units/hr)' : 'Load: 75 units/kg IV | Initial infusion: 28 units/kg/hr',
        totalDose: `Load: ${loadDose.toFixed(0)} units | Initial infusion: ${initRate.toFixed(0)} units/hr`,
        interval: 'Load once, then continuous infusion titrated to target',
        route: 'IV',
        concentration: '1000/5000/10,000/20,000 units/mL injection; premixed infusions in D5W/NS',
        basisNote: isChild ? 'Age 1–18 years' : 'Age <1 year',
        infusionNote: `Titrate the infusion rate to target anti-Xa 0.3–0.7 units/mL or aPTT 50–80 sec, rechecked 4–6h after each rate change`,
        warningNote: 'Do NOT give the loading dose in stroke or significant bleeding risk — obtain aPTT 4–6h after starting/changing the rate regardless, drawn from a different extremity than the infusion.',
      };
    },
  },

  // ─── Neurology ──────────────────────────────────────────────────────────
  {
    id: 'valproic-acid',
    name: 'Sodium Valproate',
    brandName: 'Valproic Acid',
    category: 'Neurology',
    indications: ['Seizures (broad-spectrum)', 'Migraine prophylaxis (adolescent/adult)'],
    administration: 'PO. IV at the same total daily dose ÷ Q6h only when oral is not possible — convert back to PO as soon as feasible.',
    monitoring: ['LFTs and CBC before and during therapy', 'Serum valproate level (therapeutic 50–100 mg/L)', 'Ammonia level if encephalopathy suspected', 'Platelet count (dose-related thrombocytopenia)'],
    cautions: [
      'Contraindicated in hepatic disease, urea cycle disorders, known mitochondrial DNA polymerase γ mutations (e.g. Alpers-Huttenlocher), and children <2y with suspected mitochondrial disease',
      'Pancreatitis is a rare but potentially life-threatening reaction',
      'Hyperammonaemic encephalopathy possible even with normal LFTs',
      'Many drug interactions — inhibits CYP2C9/2D6, levels reduced by phenytoin/phenobarbital/carbamazepine/meropenem',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    calculate: (weight) => {
      const startLow = weight * 10;
      const startHigh = weight * 15;
      const maintLow = weight * 30;
      const maintHigh = weight * 60;
      return {
        dosePerKg: 'Start 10–15 mg/kg/24h ÷ once daily–TID, increase weekly by 5–10 mg/kg/24h',
        totalDose: `Start: ${startLow.toFixed(0)}–${startHigh.toFixed(0)} mg/24h | Maintenance: ${maintLow.toFixed(0)}–${maintHigh.toFixed(0)} mg/24h`,
        interval: 'Once daily–TID (BID–TID at maintenance)',
        route: 'PO (IV at the same total daily dose ÷ Q6h if oral not possible)',
        concentration: '250 mg/5 mL oral solution; 250 mg capsules; 100 mg/mL injection',
        basisNote: 'Seizure dosing — maintenance may need to reach 100 mg/kg/24h in children on interacting anticonvulsants',
        maxDose: `${(weight * 60).toFixed(0)} mg/24h (up to 100 mg/kg/24h if on interacting anticonvulsants)`,
        warningNote: 'Hepatotoxicity risk is highest in children <2 years, especially on multiple anticonvulsants or with metabolic/mitochondrial disease.',
      };
    },
  },
  {
    id: 'carbamazepine',
    name: 'Carbamazepine',
    category: 'Neurology',
    indications: ['Seizures (partial and generalised)'],
    administration: 'PO. Dosing interval by formulation: extended-release BID; chewable/immediate-release BID–TID; suspension TID–QID.',
    monitoring: ['CBC and LFTs at baseline and periodically', 'Serum carbamazepine level (therapeutic 4–12 mg/L)', 'Sodium (SIADH/hyponatraemia risk)'],
    cautions: [
      'Contraindicated with MAOIs, tricyclic antidepressant hypersensitivity, and concurrent clozapine (bone marrow suppression risk)',
      'HLA-B*1502 (Asian ancestry) and HLA-A*3101 alleles increase SJS/TEN risk',
      'Autoinduces its own metabolism — levels fall after the first month of therapy',
      'Do not abruptly discontinue',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    calculate: (weight, age) => {
      if (age < 6) {
        const startLow = weight * 10;
        const startHigh = weight * 20;
        const maxDaily = weight * 35;
        return {
          dosePerKg: '10–20 mg/kg/24h ÷ BID–TID (QID for suspension), increase every 5–7 days',
          totalDose: `${startLow.toFixed(0)}–${startHigh.toFixed(0)} mg/24h (start)`,
          interval: 'BID–TID (QID if using suspension)',
          route: 'PO',
          concentration: '100 mg/5 mL suspension; 100 mg chewable tablets; 200 mg tablets',
          basisNote: 'Age <6 years',
          maxDose: `${maxDaily.toFixed(0)} mg/24h`,
          warningNote: 'Screen for HLA-B*1502/HLA-A*3101 alleles where relevant (SJS/TEN risk). Baseline CBC and LFTs recommended.',
        };
      }
      if (age < 12) {
        const maintLow = weight * 20;
        const maintHigh = weight * 30;
        return {
          dosePerKg: 'Start 10 mg/kg/24h ÷ BID, increase by 100 mg/24h weekly to maintenance 20–30 mg/kg/24h ÷ BID–QID',
          totalDose: `Maintenance: ${maintLow.toFixed(0)}–${maintHigh.toFixed(0)} mg/24h`,
          interval: 'BID (QID if using suspension)',
          route: 'PO',
          concentration: '100 mg/5 mL suspension; 100 mg chewable tablets; 200 mg tablets; 100/200/400 mg extended-release tablets',
          basisNote: 'Age 6–12 years',
          maxDose: '1000 mg/24h',
          warningNote: 'Screen for HLA-B*1502/HLA-A*3101 alleles where relevant (SJS/TEN risk). Baseline CBC and LFTs recommended.',
        };
      }
      const maxDaily = age <= 15 ? 1000 : 1200;
      return {
        dosePerKg: 'Fixed dosing (not weight-based) — start 200 mg BID, increase by 200 mg/24h weekly to maintenance',
        totalDose: 'Maintenance 800–1200 mg/24h ÷ BID–QID',
        interval: 'BID (extended-release) to QID (suspension)',
        route: 'PO',
        concentration: '200 mg tablets; 100/200/300 mg extended-release capsules; 100 mg/5 mL suspension',
        basisNote: 'Age >12 years — fixed adult-pattern dosing',
        maxDose: `${maxDaily} mg/24h`,
        warningNote: 'Screen for HLA-B*1502/HLA-A*3101 alleles where relevant (SJS/TEN risk). Baseline CBC and LFTs recommended.',
      };
    },
  },
  {
    id: 'mannitol',
    name: 'Mannitol',
    category: 'Neurology',
    indications: ['Raised intracranial pressure', 'Oliguria (test-dose/diuretic use)'],
    administration: 'IV/IO, over 20–30 min for ICP reduction. Use an in-line 5-micron filter for concentrations ≥15%.',
    monitoring: ['Serum osmolality (target ≤310–320 mOsm/kg)', 'Electrolytes and fluid balance', 'Renal function', 'Blood pressure (larger doses may cause transient hypotension)'],
    cautions: [
      'Contraindicated in severe renal disease, active intracranial haemorrhage, severe hypovolaemia, pulmonary oedema',
      'Do not combine with aminoglycosides (increased nephrotoxicity)',
      'Concentrations ≥15% may crystallise in cold — warm and agitate to redissolve, then filter before use',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    calculate: (weight) => {
      const low = weight * 0.25;
      const high = weight * 1;
      return {
        dosePerKg: '0.25–1 g/kg/dose IV/IO',
        totalDose: `${low.toFixed(1)}–${high.toFixed(1)} g/dose`,
        interval: 'Over 20–30 min; may repeat if needed',
        route: 'IV/IO (use an in-line 5-micron filter for concentrations ≥15%)',
        concentration: '10%/15%/20%/25% injection (100/150/200/250 mg per mL)',
        basisNote: 'Raised intracranial pressure dosing',
        warningNote: 'Keep serum osmolality ≤310–320 mOsm/kg. Monitor for circulatory overload and electrolyte disturbance.',
      };
    },
  },
  {
    id: 'acetazolamide',
    name: 'Acetazolamide',
    category: 'Neurology',
    indications: ['Raised intracranial pressure / pseudotumor cerebri', 'Hydrocephalus (adjunct)', 'Seizures (adjunct)'],
    administration: 'PO or IV (avoid IM if possible — painful injection). Do not use extended-release capsules for these indications.',
    monitoring: ['Electrolytes and acid–base status (metabolic acidosis, hypokalaemia)', 'Renal function', 'Clinical response (head circumference/ICP signs in hydrocephalus)'],
    cautions: [
      'Contraindicated in hepatic failure, severe renal failure (GFR <10 mL/min), and sulfonamide hypersensitivity',
      'Long-term use may cause renal calculi and aplastic anemia (rare)',
      'May increase carbamazepine and cyclosporine levels',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    calculate: (weight) => {
      const startDaily = weight * 20;
      const maxDaily = Math.min(weight * 100, 2000);
      return {
        dosePerKg: 'Start 20 mg/kg/24h ÷ Q8h, may increase to 100 mg/kg/24h if needed',
        totalDose: `Start: ${startDaily.toFixed(0)} mg/24h — ceiling: ${maxDaily.toFixed(0)} mg/24h`,
        interval: 'Q8h',
        route: 'PO or IV (avoid IM if possible)',
        concentration: '125/250 mg tablets; 25 mg/mL oral suspension; 500 mg injection',
        basisNote: 'Hydrocephalus/raised ICP management dosing',
        maxDose: `${maxDaily.toFixed(0)} mg/24h (max 2 g/24h)`,
        warningNote: 'Do not use extended-release capsules for this indication. Bicarbonate supplementation may be needed with long-term use.',
      };
    },
  },

  {
    id: 'ethosuximide',
    name: 'Ethosuximide',
    category: 'Neurology',
    indications: ['Absence seizures (drug of choice)'],
    administration: 'PO, with food or milk to improve GI tolerance.',
    monitoring: ['Serum ethosuximide level (therapeutic 40–100 mg/L) — trough 30 min pre-dose after 5–10 days', 'CBC (rare blood dyscrasias)', 'Signs of suicidal ideation'],
    cautions: [
      'May worsen grand mal seizures in patients with mixed seizure types',
      'Rare idiosyncratic reactions: SJS, DRESS, immune thrombocytopenia',
      'Do not withdraw abruptly — risk of precipitating absence status',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Initial 10mg/kg/24h up to 500mg/24h; maintenance 20-40mg/kg/24h.',
    calculate: (weight, age) => {
      if (age <= 6) {
        const startDaily = Math.min(weight * 10, 250);
        return {
          dosePerKg: '10 mg/kg/24h (up to 250 mg/24h) ÷ BID–TID, increase 5–10 mg/kg/24h Q4–7 days',
          totalDose: `${startDaily.toFixed(0)} mg/24h (start)`,
          interval: 'BID–TID',
          route: 'PO — give with food/milk',
          concentration: '250 mg/5 mL oral suspension; 250 mg capsules',
          basisNote: 'Age ≤6 years — usual maintenance 15–40 mg/kg/24h',
          maxDose: `${Math.min(weight * 60, 2000).toFixed(0)} mg/24h (lesser of 60 mg/kg/24h or 2 g/24h)`,
          warningNote: 'Do not withdraw abruptly — risk of precipitating absence status. Therapeutic level 40–100 mg/L.',
        };
      }
      const startDaily = Math.min(weight * 10, 500);
      return {
        dosePerKg: '10 mg/kg/24h (up to 500 mg/24h) ÷ BID–TID, increase 250 mg/24h Q4–7 days',
        totalDose: `${startDaily.toFixed(0)} mg/24h (start)`,
        interval: 'BID–TID',
        route: 'PO — give with food/milk',
        concentration: '250 mg/5 mL oral suspension; 250 mg capsules',
        basisNote: 'Age >6 years — usual maintenance 20–40 mg/kg/24h',
        maxDose: `${Math.min(weight * 60, 2000).toFixed(0)} mg/24h (lesser of 60 mg/kg/24h or 2 g/24h)`,
        warningNote: 'Do not withdraw abruptly — risk of precipitating absence status. Therapeutic level 40–100 mg/L.',
      };
    },
  },
  {
    id: 'gabapentin',
    name: 'Gabapentin',
    category: 'Neurology',
    indications: ['Seizures (adjunctive therapy)'],
    administration: 'PO, max interval between doses 12h.',
    monitoring: ['Renal function (dose adjustment)', 'Signs of suicidal ideation', 'Respiratory status if combined with opioids/CNS depressants'],
    cautions: [
      'Not metabolised by the liver — excreted renally unchanged, adjust dose in renal impairment',
      'Higher mg/kg doses often needed in children <5 years (faster clearance)',
      'Life-threatening respiratory depression reported with concurrent opioids/CNS depressants',
      'Do not withdraw abruptly — taper over at least 1 week',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Start 300mg TID, up to 1800mg/24h (up to 3.6g/24h tolerated).',
    calculate: (weight, age) => {
      if (age < 12) {
        let maintLow: number, maintHigh: number, band: string;
        if (age < 5) { maintLow = 40; maintHigh = 50; band = '3–<5 years'; }
        else { maintLow = 25; maintHigh = 35; band = '5–<12 years'; }
        const low = weight * maintLow;
        const high = weight * maintHigh;
        return {
          dosePerKg: `Titrate over 3 days to ${maintLow}–${maintHigh} mg/kg/24h ÷ TID`,
          totalDose: `${low.toFixed(0)}–${high.toFixed(0)} mg/24h`,
          interval: 'TID (max interval between doses 12h)',
          route: 'PO',
          concentration: '250 mg/5 mL oral solution; 100/300/400 mg capsules; 300/600/800 mg tablets',
          basisNote: `Age band: ${band}`,
          warningNote: 'Not metabolised by the liver — excreted renally unchanged, adjust in renal impairment. Do not withdraw abruptly (taper over ≥1 week).',
        };
      }
      return {
        dosePerKg: 'Fixed dosing (not weight-based) — start 300 mg TID',
        totalDose: 'Up to 1800 mg/24h ÷ TID (up to 3.6 g/24h tolerated in some patients)',
        interval: 'TID',
        route: 'PO',
        concentration: '250 mg/5 mL oral solution; 100/300/400 mg capsules; 300/600/800 mg tablets',
        basisNote: 'Age ≥12 years',
        warningNote: 'Not metabolised by the liver — excreted renally unchanged, adjust in renal impairment. Life-threatening respiratory depression reported with concurrent opioids/CNS depressants.',
      };
    },
  },
  {
    id: 'lamotrigine',
    name: 'Lamotrigine',
    category: 'Neurology',
    indications: ['Seizures (adjunctive, various types)'],
    administration: 'PO. Titration schedule is critically dependent on co-administered anticonvulsants — see warning.',
    monitoring: ['Skin/mucous membrane changes (SJS/TEN early warning)', 'Signs of aseptic meningitis or HLH (rare)', 'Signs of suicidal ideation'],
    cautions: [
      'BOXED WARNING: risk of Stevens-Johnson syndrome/TEN, highest with rapid titration or concurrent valproic acid — the starting dose and titration rate MUST be selected based on co-administered anticonvulsants (valproate lowers the safe starting dose; enzyme-inducing AEDs raise it)',
      'Reduce all doses by 50% (Child-Pugh B) or 75% (Child-Pugh C) in hepatic impairment; reduce maintenance dose in renal failure',
      'Class IB antiarrhythmic activity — caution in structural/functional heart disease',
      'First-trimester pregnancy use associated with increased cleft lip/palate risk',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Starting 25mg every-other-day to 50mg once daily depending on co-medications; usual maintenance 100-500mg/24h.',
    calculate: (weight, age) => {
      if (age < 2) {
        return {
          dosePerKg: 'Highly co-medication-dependent — consult specialist/pharmacist',
          totalDose: 'Not calculated — see warning',
          interval: '—',
          route: 'PO',
          concentration: '2/5/25/100/150/200 mg tablets; chewable/dispersible/ODT forms; oral suspension',
          basisNote: 'Age <2 years',
          warningNote: 'Titration schedule depends critically on whether the patient is taking valproic acid or an enzyme-inducing anticonvulsant — using the wrong schedule significantly raises SJS/TEN risk. Use the exact co-medication-specific titration table from current formulary/pharmacy guidance before prescribing.',
        };
      }
      return {
        dosePerKg: 'Highly co-medication-dependent (approx. starting dose: no interacting AEDs ~0.3 mg/kg/24h; with valproate ~0.15 mg/kg/24h; with enzyme-inducing AEDs ~0.6 mg/kg/24h) — consult specialist/pharmacist',
        totalDose: 'Not calculated — see warning',
        interval: 'Once daily–BID, titrated very slowly (over weeks)',
        route: 'PO',
        concentration: '2/5/25/100/150/200 mg tablets; chewable/dispersible/ODT forms; oral suspension',
        basisNote: 'Age ≥2 years',
        warningNote: 'BOXED WARNING: Stevens-Johnson syndrome/TEN reported in ~0.3–0.8% of children on adjunctive therapy — risk is highest with rapid titration or concurrent valproic acid. The exact starting dose and titration schedule depend on whether the patient is on valproate, an enzyme-inducing anticonvulsant, or neither — use the current formulary\'s exact co-medication-specific table, do not estimate. Taper over ≥2 weeks on discontinuation.',
      };
    },
  },
  {
    id: 'oxcarbazepine',
    name: 'Oxcarbazepine',
    category: 'Neurology',
    indications: ['Seizures (partial-onset, monotherapy or adjunctive)'],
    administration: 'PO, BID.',
    monitoring: ['Serum sodium (hyponatraemia, especially in the first 3 months)', 'Skin reactions (SJS/TEN, especially with HLA-B*1502)'],
    cautions: [
      'Clinically significant hyponatraemia is common — monitor sodium, especially in the first 3 months',
      '~25–30% cross-reactivity with carbamazepine hypersensitivity',
      'HLA-B*1502 carriers have increased SJS/TEN risk',
      'Reduce starting dose by 50% if GFR<30 mL/min/1.73m²',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Start 600mg/24h BID, titrate to usual maintenance 1200mg/24h.',
    calculate: (weight, age) => {
      if (age < 4) {
        const perKg = weight < 20 ? 18 : 9;
        const startDaily = weight * perKg;
        const maxDaily = weight * 60;
        return {
          dosePerKg: `Start ${weight < 20 ? '16–20' : '8–10'} mg/kg/24h ÷ BID, titrate over 2–4 weeks`,
          totalDose: `${startDaily.toFixed(0)} mg/24h (start)`,
          interval: 'BID',
          route: 'PO',
          concentration: '300 mg/5 mL oral suspension; 150/300/600 mg tablets',
          basisNote: 'Age 2–<4 years',
          maxDose: `${maxDaily.toFixed(0)} mg/24h (max 60 mg/kg/24h)`,
          warningNote: 'Clinically significant hyponatraemia is common, usually within the first 3 months of therapy. ~25–30% cross-reactivity with carbamazepine hypersensitivity.',
        };
      }
      const startDaily = Math.min(weight * 9, 600);
      let maintDaily: number, band: string;
      if (weight <= 29) { maintDaily = 900; band = '20–29 kg'; }
      else if (weight <= 39) { maintDaily = 1200; band = '29.1–39 kg'; }
      else { maintDaily = 1800; band = '>39 kg'; }
      return {
        dosePerKg: 'Start 8–10 mg/kg/24h ÷ BID (max 600 mg/24h), titrate over 2 weeks to weight-based maintenance',
        totalDose: `Start: ${startDaily.toFixed(0)} mg/24h — Maintenance (${band}): ${maintDaily} mg/24h`,
        interval: 'BID',
        route: 'PO',
        concentration: '300 mg/5 mL oral suspension; 150/300/600 mg tablets; extended-release tablets same strengths',
        basisNote: 'Age 4–16 years',
        warningNote: 'Clinically significant hyponatraemia is common, usually within the first 3 months of therapy. If GFR<30: use 50% starting dose (max 300 mg/24h).',
      };
    },
  },
  {
    id: 'topiramate',
    name: 'Topiramate',
    category: 'Neurology',
    indications: ['Seizures (adjunctive, partial-onset or Lennox-Gastaut)', 'Migraine prophylaxis'],
    administration: 'PO.',
    monitoring: ['Signs of angle-closure glaucoma (eye pain, blurred vision) — urgent referral if suspected', 'Sweating/temperature regulation in hot weather (oligohidrosis risk)', 'Serum bicarbonate (metabolic acidosis)', 'Growth and bone density with long-term use'],
    cautions: [
      'Secondary angle-closure glaucoma can cause blindness if untreated — instruct families to seek immediate care for eye pain/blurred vision',
      'Oligohidrosis/hyperthermia reported primarily in children — monitor closely in hot weather',
      'Reduce dose 50% if CrCl <70 mL/min',
      'Hyperchloraemic non-anion-gap metabolic acidosis, kidney stones, and cognitive dysfunction reported',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Similar mg-based titration for migraine prophylaxis and seizures.',
    calculate: (weight, age) => {
      if (age >= 6 && age < 12) {
        const startDose = Math.min(weight * 15, 25);
        return {
          dosePerKg: 'Migraine prophylaxis (age 6–<12y, ≥20kg): start 15 mg once daily ×7d → 25 mg BID ×7d → titrate to target 2–3 mg/kg/24h BID',
          totalDose: `${startDose.toFixed(0)} mg (starting dose)`,
          interval: 'Once daily start, then BID',
          route: 'PO',
          concentration: '25mg/mL or 6/14/20 mg/mL oral suspension/solution; 15/25 mg sprinkle capsules; 25/50/100/200 mg tablets',
          basisNote: 'Migraine prophylaxis dosing shown for this age. For seizures, see the warning below.',
          maxDose: '200 mg/24h (migraine prophylaxis)',
          warningNote: 'Seizure (adjunctive) dosing for age 2–16y: start 1–3 mg/kg/dose (max 25 mg/dose) QHS, increase by 1–3 mg/kg/24h Q1–2wk to usual maintenance 5–9 mg/kg/24h ÷ BID, max 400 mg/24h. Can cause secondary angle-closure glaucoma — seek immediate care for eye pain/blurred vision.',
        };
      }
      const startDose = Math.min(weight * 2, 25);
      const maintLow = weight * 5;
      const maintHigh = Math.min(weight * 9, 400);
      return {
        dosePerKg: 'Seizures (adjunctive): start 1–3 mg/kg/dose (max 25 mg/dose) QHS, increase by 1–3 mg/kg/24h Q1–2wk',
        totalDose: `Start: ${startDose.toFixed(0)} mg — Maintenance: ${maintLow.toFixed(0)}–${maintHigh.toFixed(0)} mg/24h`,
        interval: 'QHS to start, then BID at maintenance',
        route: 'PO',
        concentration: '25mg/mL or 6/14/20 mg/mL oral suspension/solution; 15/25 mg sprinkle capsules; 25/50/100/200 mg tablets',
        basisNote: 'Age 2–16 years, seizure (adjunctive) dosing',
        maxDose: '400 mg/24h',
        warningNote: 'Can cause secondary angle-closure glaucoma (ocular pain, acute myopia, raised IOP) — seek immediate care for eye pain/blurred vision. Reduce dose 50% if CrCl<70 mL/min. Oligohidrosis/hyperthermia reported, especially in children — monitor in hot weather.',
      };
    },
  },
  {
    id: 'vigabatrin',
    name: 'Vigabatrin',
    category: 'Neurology',
    indications: ['Infantile spasms (West syndrome)', 'Refractory complex partial seizures (adjunctive)'],
    administration: 'PO, specialist (neurology) initiation required.',
    monitoring: ['Periodic formal visual field testing — REQUIRED before starting and throughout therapy', 'MRI monitoring for signal changes/intramyelinic oedema, especially in infants', 'Signs of liver failure, anaemia, psychotic symptoms'],
    cautions: [
      'CAN CAUSE PROGRESSIVE AND PERMANENT VISION LOSS — periodic vision testing is mandatory; risk increases with dose and duration',
      'Specialist (neurology) initiation and monitoring required',
      'Do NOT rapidly withdraw — taper per a specific schedule (abrupt withdrawal risks status epilepticus)',
      'Liver failure, anaemia, psychotic disorder, SJS/TEN, suicidal ideation reported',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Refractory partial seizures: start 500mg BID, increase by 500mg increments q7d to usual 1500mg BID, max 6000mg/24h.',
    calculate: (weight, age) => {
      if (age < 2) {
        const startDaily = weight * 50;
        const maxDaily = weight * 150;
        return {
          dosePerKg: '50 mg/kg/24h ÷ BID (start), titrate by 25–50 mg/kg/24h Q3 days',
          totalDose: `${startDaily.toFixed(0)} mg/24h (start)`,
          interval: 'BID',
          route: 'PO',
          concentration: '500 mg tablets; 500 mg/packet oral powder',
          basisNote: 'Infantile spasms, age 1 month–2 years',
          maxDose: `${maxDaily.toFixed(0)} mg/24h (max 150 mg/kg/24h)`,
          warningNote: 'CAN CAUSE PROGRESSIVE AND PERMANENT VISION LOSS — periodic vision testing is REQUIRED. Access is restricted to prescribers/pharmacies registered under a risk-management program in some countries. Withdraw gradually if no benefit seen within 2–4 weeks.',
        };
      }
      return {
        dosePerKg: 'Weight-banded dosing for refractory partial seizures (specialist-initiated) — consult the exact weight-band table',
        totalDose: 'Not calculated — weight-banded, specialist-initiated',
        interval: 'BID',
        route: 'PO',
        concentration: '500 mg tablets; 500 mg/packet oral powder',
        basisNote: 'Age ≥2 years — refractory complex partial seizures (adjunctive)',
        warningNote: 'CAN CAUSE PROGRESSIVE AND PERMANENT VISION LOSS — periodic vision testing is REQUIRED before and during therapy. This is a specialist-initiated medication with restricted access in some countries. Do NOT rapidly withdraw — taper per a specific schedule.',
      };
    },
  },
  {
    id: 'clobazam',
    name: 'Clobazam',
    category: 'Neurology',
    indications: ['Lennox-Gastaut syndrome (adjunctive)', 'Seizures (adjunctive or monotherapy)'],
    administration: 'PO. Titration must not proceed faster than weekly increments.',
    monitoring: ['Sedation level, ataxia', 'LFTs in hepatic impairment', 'Mood/behaviour changes'],
    cautions: [
      'Caution in hepatic impairment — requires a reduced titration schedule',
      'Do not discontinue abruptly',
      'Major CYP2C19/P-glycoprotein substrate — PPIs, azole antifungals, CNS depressants increase effect/toxicity; carbamazepine/rifampin/theophylline decrease effect',
      'Do not combine with azelastine, olanzapine, sodium oxybate, or thioridazine',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Similar weight-banded titration (>30kg regimen).',
    calculate: (weight) => {
      if (weight <= 30) {
        return {
          dosePerKg: 'Weight-banded titration (≤30kg): start 5mg once daily → day 8: 5mg BID → day 15: 10mg BID (max)',
          totalDose: '5–20 mg/24h depending on titration day',
          interval: 'Once daily to start, then BID',
          route: 'PO',
          concentration: '2.5 mg/mL oral suspension; 10/20 mg tablets; 5/10/20 mg oral film',
          basisNote: 'Age ≥2 years, weight ≤30 kg — Lennox-Gastaut adjunctive dosing',
          maxDose: '20 mg/24h (10mg BID) at this weight band',
          warningNote: 'Titration must not proceed faster than weekly increments. Reduced titration schedule required in hepatic impairment or poor CYP2C19 metabolisers. Do not discontinue abruptly.',
        };
      }
      return {
        dosePerKg: 'Weight-banded titration (>30kg): start 5mg BID → day 8: 10mg BID → day 15: 20mg BID (max)',
        totalDose: '10–40 mg/24h depending on titration day',
        interval: 'BID',
        route: 'PO',
        concentration: '2.5 mg/mL oral suspension; 10/20 mg tablets; 5/10/20 mg oral film',
        basisNote: 'Age ≥2 years, weight >30 kg — Lennox-Gastaut adjunctive dosing',
        maxDose: '40 mg/24h (20mg BID) at this weight band',
        warningNote: 'Titration must not proceed faster than weekly increments. Reduced titration schedule required in hepatic impairment or poor CYP2C19 metabolisers. Do not discontinue abruptly.',
      };
    },
  },
  {
    id: 'clonazepam',
    name: 'Clonazepam',
    category: 'Neurology',
    indications: ['Seizures (adjunctive, various seizure types)'],
    administration: 'PO.',
    monitoring: ['Sedation level', 'Mood/behaviour — depression/suicidality', 'LFTs in hepatic impairment'],
    cautions: [
      'Contraindicated in severe liver disease, acute narrow-angle glaucoma',
      'Carbamazepine/phenytoin/phenobarbital decrease levels; CYP3A4 inhibitors (e.g. erythromycin) increase levels/toxicity',
      'Long half-life (24–36h) — accumulation risk with repeated dosing',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Start 1.5mg/24h TID, increase 0.5-1mg/24h q3-7d to max 20mg/24h.',
    calculate: (weight, age) => {
      if (age < 10 && weight < 30) {
        const startLow = weight * 0.01;
        const startHigh = weight * 0.03;
        const maxDaily = weight * 0.2;
        return {
          dosePerKg: '0.01–0.03 mg/kg/24h ÷ BID–TID (initial max 0.05 mg/kg/24h), increase 0.25–0.5 mg/24h Q3 days',
          totalDose: `${startLow.toFixed(2)}–${startHigh.toFixed(2)} mg/24h (start)`,
          interval: 'BID–TID',
          route: 'PO',
          concentration: '100 mcg/mL oral suspension; 0.5/1/2 mg tablets; disintegrating tabs 0.125–2mg',
          basisNote: 'Age <10 years or weight <30 kg',
          maxDose: `${maxDaily.toFixed(2)} mg/24h (max 0.2 mg/kg/24h ÷ TID)`,
          warningNote: 'Contraindicated in severe liver disease and acute narrow-angle glaucoma. Monitor for depression/suicidality.',
        };
      }
      return {
        dosePerKg: 'Fixed dosing (not weight-based) — start 1.5 mg/24h ÷ TID',
        totalDose: '1.5 mg/24h (start), increase 0.5–1 mg/24h Q3–7 days to max 20 mg/24h',
        interval: 'TID',
        route: 'PO',
        concentration: '100 mcg/mL oral suspension; 0.5/1/2 mg tablets; disintegrating tabs 0.125–2mg',
        basisNote: 'Age ≥10 years or weight ≥30 kg',
        maxDose: '20 mg/24h',
        warningNote: 'Contraindicated in severe liver disease and acute narrow-angle glaucoma. Monitor for depression/suicidality.',
      };
    },
  },
  {
    id: 'lacosamide',
    name: 'Lacosamide',
    category: 'Neurology',
    indications: ['Partial-onset seizures (adjunctive or monotherapy)'],
    administration: 'IV or PO (interchangeable 1:1 except in infants <6kg). IV infusion over 30–60 min.',
    monitoring: ['ECG (PR interval) — caution with cardiac conduction abnormalities', 'Renal/hepatic function', 'Signs of DRESS/multiorgan hypersensitivity'],
    cautions: [
      'This drug\'s paediatric dosing table was ambiguous in source extraction — verify exact weight-band dosing locally before use',
      'Caution with 2nd-degree AV block, severe cardiac disease, or concurrent PR-prolonging drugs',
      '95% renal excretion — reduce max dose 25% in severe renal impairment or mild/moderate hepatic impairment; not recommended in severe hepatic impairment',
      'Do not withdraw abruptly',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Monotherapy start 100mg BID, adjunctive start 50mg BID, titrate to 150-200mg BID.',
    calculate: (weight, age) => {
      if (age >= 17) {
        return {
          dosePerKg: 'Fixed dosing (not weight-based) — monotherapy start 100mg BID, adjunctive start 50mg BID',
          totalDose: 'Titrate by 50mg BID increments Q7 days to 150–200mg BID (up to 300mg BID in some patients)',
          interval: 'BID',
          route: 'IV or PO (interchangeable 1:1, IV over 30–60 min)',
          concentration: '10 mg/mL oral solution; 50/100/150/200 mg tablets; 10 mg/mL injection',
          basisNote: 'Age ≥17 years',
          warningNote: 'Caution with cardiac conduction abnormalities (2nd-degree AV block), severe cardiac disease, or other PR-prolonging drugs. Reduce max dose by 25% in severe renal or hepatic impairment.',
        };
      }
      return {
        dosePerKg: 'Weight-banded paediatric titration (age 1mo–<17y) — the source table\'s weight-band boundaries were ambiguous in extraction',
        totalDose: 'Not calculated — verify the exact weight-band starting/titration/maintenance doses against current formulary guidance before prescribing',
        interval: 'BID (IV over 30–60 min if used)',
        route: 'IV or PO (interchangeable 1:1 except <6kg)',
        concentration: '10 mg/mL oral solution; 50/100/150/200 mg tablets; 10 mg/mL injection',
        basisNote: 'Age 1 month–<17 years',
        warningNote: 'This drug\'s paediatric weight-band dosing table was ambiguous in source text extraction (a known PDF-column-shift artifact) — DO NOT rely on an estimated mg/kg figure here; confirm the exact age/weight-band dose against BNFc or current local formulary before prescribing. Caution with cardiac conduction abnormalities.',
      };
    },
  },
  {
    id: 'rufinamide',
    name: 'Rufinamide',
    category: 'Neurology',
    indications: ['Lennox-Gastaut syndrome (adjunctive)'],
    administration: 'PO, BID.',
    monitoring: ['ECG (QT interval — this drug shortens QT)', 'LFTs', 'Signs of DRESS or suicidal ideation'],
    cautions: [
      'Contraindicated in familial short QT syndrome',
      'Not recommended in severe hepatic impairment',
      'With concurrent valproate, start at a lower dose',
      'Weak CYP2E1 inhibitor/3A4 inducer — decreases levels of nifedipine, carbamazepine, lamotrigine, hormonal contraceptives; increases phenytoin/phenobarbital levels',
      'Taper by ~25% every 2 days when discontinuing',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Start 400-800mg/24h BID, increase to max 3200mg/24h BID.',
    calculate: (weight, age) => {
      if (age >= 17) {
        return {
          dosePerKg: 'Fixed dosing (not weight-based) — start 400–800 mg/24h ÷ BID',
          totalDose: 'Titrate by 400–800 mg/24h every other day to max 3200 mg/24h ÷ BID',
          interval: 'BID',
          route: 'PO',
          concentration: '40 mg/mL oral suspension; 200/400 mg tablets',
          basisNote: 'Age ≥17 years',
          maxDose: '3200 mg/24h',
          warningNote: 'Contraindicated in familial short QT syndrome. Use a lower initial dose with concurrent valproate.',
        };
      }
      const startDaily = weight * 10;
      const maxDaily = Math.min(weight * 45, 3200);
      return {
        dosePerKg: '10 mg/kg/24h ÷ BID (start), increase by ~10 mg/kg/24h every other day',
        totalDose: `${startDaily.toFixed(0)} mg/24h (start) — target up to ${maxDaily.toFixed(0)} mg/24h`,
        interval: 'BID',
        route: 'PO',
        concentration: '40 mg/mL oral suspension; 200/400 mg tablets',
        basisNote: 'Age 1–<17 years',
        maxDose: `${maxDaily.toFixed(0)} mg/24h (max 45 mg/kg/24h, not exceeding 3200 mg/24h)`,
        warningNote: 'Contraindicated in familial short QT syndrome. With concurrent valproate, use a lower initial dose (<10 mg/kg/24h). Not recommended in severe hepatic impairment.',
      };
    },
  },
  {
    id: 'flumazenil',
    name: 'Flumazenil',
    category: 'Neurology',
    indications: ['Benzodiazepine reversal (overdose or oversedation)'],
    administration: 'IV. Pairs with this app\'s Lorazepam and Midazolam entries.',
    monitoring: ['Level of consciousness and respiratory status (re-sedation risk as flumazenil wears off before the benzodiazepine)', 'Seizure activity, especially in benzodiazepine-dependent patients'],
    cautions: [
      'Does not reverse opioids/narcotics',
      'May precipitate seizures, especially in benzodiazepine-dependent patients or tricyclic antidepressant overdose',
      'Short duration of action (~1h) — re-sedation can occur after the drug wears off; continued observation required',
      'Caution in liver dysfunction (reduced clearance — reduce subsequent doses/frequency, not the initial dose)',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Similar dosing, titrated to reversal of sedation.',
    calculate: (weight) => {
      const dose = Math.min(weight * 0.01, 0.2);
      return {
        dosePerKg: '0.01 mg/kg (max 0.2 mg/dose) IV over 15 sec',
        totalDose: `${dose.toFixed(3)} mg`,
        interval: 'May repeat Q1min PRN (if reversing oversedation, wait 45 sec before the first repeat) to a maximum cumulative dose',
        route: 'IV',
        concentration: '0.1 mg/mL injection',
        basisNote: 'Reversal of benzodiazepine sedation or overdose',
        maxDose: '1 mg cumulative (or 0.05 mg/kg, whichever is lower, for oversedation reversal)',
        infusionNote: 'Continuous infusion alternative for recurrent sedation: 0.005–0.01 mg/kg/hr',
        warningNote: 'Does NOT reverse opioids/narcotics. Effect (half-life ~1h) may wear off before the benzodiazepine effect, risking re-sedation — observe closely. May precipitate seizures, especially in benzodiazepine-dependent patients or tricyclic antidepressant overdose.',
      };
    },
  },
  {
    id: 'naloxone',
    name: 'Naloxone',
    category: 'Neurology',
    indications: ['Opioid overdose / reversal (full reversal)', 'Iatrogenic opioid-induced respiratory depression (titrated/partial reversal)'],
    administration: 'IM/IV/IO/SC or intranasal. Pairs with this app\'s Morphine, Fentanyl, and Ketamine entries.',
    monitoring: ['Respiratory rate and level of consciousness', 'Signs of acute opioid withdrawal (nausea, tachycardia, agitation) in dependent patients', 'Recurrence of respiratory depression as naloxone wears off (shorter half-life than most opioids)'],
    cautions: [
      'Short duration of action may necessitate repeat dosing or a continuous infusion — the reversed opioid often outlasts a single naloxone dose',
      'Produces acute withdrawal in opioid-dependent patients — caution in cardiac disease (abrupt reversal risks tachycardia, hypertension, arrhythmia)',
      'For iatrogenic respiratory depression (not overdose), start at a much lower titrated dose to preserve analgesia while restoring ventilation',
      'False-positive urine opiate screen possible',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '0.4-2mg/dose, repeat Q2-3min PRN.',
    calculate: (weight, age) => {
      if (age <= 5 || weight <= 20) {
        const dose = weight * 0.1;
        return {
          dosePerKg: '0.1 mg/kg/dose IM/IV/IO/SC, may repeat Q2–3min PRN',
          totalDose: `${dose.toFixed(2)} mg/dose`,
          interval: 'Q2–3min PRN',
          route: 'IM/IV/IO/SC, or intranasal (4 or 8 mg into one nostril, alternating, Q2–3min PRN)',
          concentration: '0.4 mg/mL injection; 4 mg/0.1mL or 8 mg/0.1mL intranasal spray',
          basisNote: 'Age ≤5 years or weight ≤20 kg — full-reversal dosing',
          warningNote: 'For iatrogenic (in-hospital) opioid-induced respiratory depression rather than overdose, use a much lower titrated dose (as low as 0.001 mg/kg/dose) to avoid precipitating acute withdrawal/severe pain. Short duration of action may require repeat dosing or a continuous infusion.',
        };
      }
      return {
        dosePerKg: 'Fixed dosing (not weight-based, age >5y/weight >20kg): 2 mg/dose IM/IV/IO/SC, may repeat Q2–3min PRN',
        totalDose: '2 mg/dose',
        interval: 'Q2–3min PRN',
        route: 'IM/IV/IO/SC, or intranasal (4 or 8 mg into one nostril, alternating, Q2–3min PRN)',
        concentration: '0.4 mg/mL injection; 2mg/2mL prefilled syringe; auto-injector 10 mg/0.4mL; 4 mg/0.1mL or 8 mg/0.1mL intranasal spray',
        basisNote: 'Age >5 years or weight >20 kg — full-reversal dosing',
        warningNote: 'For iatrogenic (in-hospital) opioid-induced respiratory depression rather than overdose, use a much lower titrated dose (as low as 0.001 mg/kg/dose) to avoid precipitating acute withdrawal/severe pain. Continuous infusion alternative: load 0.005 mg/kg then 0.0025 mg/kg/hr, titrated.',
      };
    },
  },
  {
    id: 'dexmedetomidine',
    name: 'Dexmedetomidine',
    category: 'Neurology',
    indications: ['ICU sedation (continuous infusion)', 'Procedural sedation'],
    administration: 'IV load then continuous infusion, titrated to effect.',
    monitoring: ['Continuous ECG, blood pressure, and heart rate monitoring', 'Respiratory status', 'Signs of withdrawal with prolonged use (>24h)'],
    cautions: [
      'Caution with other vasodilating/negative-chronotropic agents, hepatic impairment, advanced heart block, hypovolaemia, diabetes, chronic hypertension, severe ventricular dysfunction',
      'Hypotension/bradycardia common, more pronounced in hypovolaemia/diabetes/chronic hypertension',
      'Transient hypertension can occur during the loading dose',
      'Enhanced sedative effect with other anaesthetics/sedatives/hypnotics/opioids — consider dose reduction',
      'Taper when discontinuing after prolonged use',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Load 1mcg/kg over 10min, then 0.2-0.7mcg/kg/hr.',
    calculate: (weight) => {
      const loadLow = weight * 0.5;
      const loadHigh = weight * 1;
      const infLow = weight * 0.2;
      const infHigh = weight * 1;
      return {
        dosePerKg: 'Load: 0.5–1 mcg/kg IV over 10 min | Maintenance: 0.2–1 mcg/kg/hr continuous infusion, titrated to effect',
        totalDose: `Load: ${loadLow.toFixed(1)}–${loadHigh.toFixed(1)} mcg | Maintenance: ${infLow.toFixed(2)}–${infHigh.toFixed(2)} mcg/hr`,
        interval: 'Load once over 10 min, then continuous infusion',
        route: 'IV',
        concentration: '200 mcg/2 mL, 400 mcg/4 mL, 1000 mcg/10 mL injection; premixed dilutions in NS',
        basisNote: 'ICU sedation dosing. Children <1 year may need higher doses.',
        infusionNote: 'Procedural sedation alternative (e.g. EEG): IV 2 mcg/kg load then 1.5 mcg/kg/hr; IM 1–4.5 mcg/kg ×1; intranasal 1–2 mcg/kg ×1, given 30–60 min pre-procedure',
        warningNote: 'Hypotension and bradycardia are common, especially in hypovolaemia, diabetes, or chronic hypertension. Use beyond 24h risks tolerance and dose-related respiratory complications. Taper when discontinuing.',
      };
    },
  },

  // ─── Endocrine ──────────────────────────────────────────────────────────
  {
    id: 'prednisolone',
    name: 'Prednisolone',
    category: 'Endocrine',
    indications: ['Anti-inflammatory/immunosuppressive therapy (asthma, nephrotic syndrome, and other indications)', 'Ophthalmic inflammation (specialist use)'],
    administration: 'PO. Harriet Lane defers systemic oral dosing entirely to the Prednisone monograph (equivalent mg-for-mg) — see the Prednisone entry for indication-specific regimens (asthma burst, nephrotic syndrome, etc.).',
    monitoring: ['Blood glucose and blood pressure with prolonged use', 'Growth (long-term therapy)', 'Signs of adrenal suppression with prolonged/high-dose use', 'Bone density with long-term use'],
    cautions: [
      'Avoid live vaccines during high-dose therapy',
      'Taper gradually after courses longer than 5–7 days to avoid adrenal insufficiency',
      'Ophthalmic formulations exist for specialist-directed eye inflammation — contraindicated in viral/fungal/mycobacterial corneal/conjunctival infection',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    calculate: (weight) => {
      const low = weight * 1;
      const high = weight * 2;
      const maxDaily = Math.min(weight * 2, 60);
      return {
        dosePerKg: '1–2 mg/kg/24h ÷ once daily–BID (general anti-inflammatory/asthma dosing)',
        totalDose: `${low.toFixed(0)}–${high.toFixed(0)} mg/24h`,
        interval: 'Once daily or BID',
        route: 'PO',
        concentration: '15 mg/5 mL oral solution; 5 mg tablets; 10/15/30 mg orally-disintegrating tablets',
        basisNote: 'Harriet Lane gives systemic oral dosing under the Prednisone monograph (equivalent mg-for-mg) — see the Prednisone entry for indication-specific regimens',
        maxDose: `${maxDaily.toFixed(0)} mg/24h (up to 60 mg/24h ceiling for short courses)`,
        warningNote: 'Ophthalmic formulations exist for specialist-directed eye inflammation — not calculated here.',
      };
    },
  },
  {
    id: 'prednisone',
    name: 'Prednisone',
    category: 'Endocrine',
    indications: ['Acute asthma exacerbation', 'Nephrotic syndrome', 'Anti-inflammatory/immunosuppressive therapy'],
    administration: 'PO. Requires hepatic conversion to the active drug, prednisolone.',
    monitoring: ['Blood glucose and blood pressure with prolonged use', 'Growth (long-term therapy)', 'Signs of adrenal suppression with prolonged/high-dose use'],
    cautions: [
      'Avoid live vaccines during high-dose therapy',
      'Taper gradually after courses longer than 5–7 days to avoid adrenal insufficiency',
      'Requires hepatic conversion to active prednisolone — liver disease patients may have higher-than-expected prednisolone exposure',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Per indication-specific regimen (asthma, nephrotic syndrome, general anti-inflammatory).',
    calculate: (weight) => {
      const dose = Math.min(weight * 2, 80);
      return {
        dosePerKg: '2 mg/kg/24h once daily–BID (max 80 mg/24h) — acute asthma exacerbation',
        totalDose: `${dose.toFixed(0)} mg/24h`,
        interval: 'Once daily or BID, ×5–7 days (taper if given longer)',
        route: 'PO',
        concentration: '1 mg/mL oral solution; 5 mg/mL concentrated (Intensol) solution; 1/2.5/5/10/20/50 mg tablets',
        basisNote: 'Acute asthma exacerbation dosing',
        maxDose: '80 mg/24h',
        warningNote: 'General anti-inflammatory/immunosuppressive dosing is lower: 0.5–2 mg/kg/24h ÷ once daily–BID. Nephrotic syndrome: 2 mg/kg/24h (max 60 mg) ÷ once daily–TID — individualise with nephrology input.',
      };
    },
  },
  {
    id: 'methylprednisolone',
    name: 'Methylprednisolone',
    category: 'Endocrine',
    indications: ['Acute asthma exacerbation (IV/IM/PO)', 'Anti-inflammatory/immunosuppressive therapy'],
    administration: 'PO/IV/IM. The acetate suspension form (longer onset/duration) is for IM/intra-articular/soft-tissue use ONLY — must never be given IV; only the sodium succinate form is IV-safe.',
    monitoring: ['Blood glucose and blood pressure', 'Signs of adrenal suppression with prolonged use', 'Growth with long-term therapy'],
    cautions: [
      'Acetate suspension is for IM/intra-articular/soft-tissue use ONLY — never IV',
      'Caution in systemic sclerosis',
      'Barbiturates/phenytoin/rifampin increase clearance; erythromycin/itraconazole/ketoconazole increase levels',
      'Increases ciclosporin/tacrolimus levels',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    calculate: (weight, age) => {
      if (age <= 12) {
        const low = weight * 1;
        const high = Math.min(weight * 2, 60);
        return {
          dosePerKg: '1–2 mg/kg/24h ÷ Q12h (max 60 mg/24h) — asthma exacerbation',
          totalDose: `${low.toFixed(0)}–${high.toFixed(0)} mg/24h`,
          interval: 'Q12h',
          route: 'PO/IV/IM (sodium succinate form only for IV)',
          concentration: '2/4/8/16/32 mg tablets; Na succinate injection 40/125/500/1000 mg (IV/IM); acetate suspension 20/40/80 mg/mL (IM/intra-articular ONLY)',
          basisNote: 'Age ≤12 years — asthma exacerbation dosing',
          maxDose: '60 mg/24h',
          warningNote: 'The acetate suspension form must NOT be given IV. General anti-inflammatory dosing is lower: 0.5–1.7 mg/kg/24h ÷ Q6–12h.',
        };
      }
      return {
        dosePerKg: '40–80 mg/24h ÷ Q12–24h — asthma exacerbation (age >12 years)',
        totalDose: '40–80 mg/24h',
        interval: 'Q12–24h',
        route: 'PO/IV/IM (sodium succinate form only for IV)',
        concentration: '2/4/8/16/32 mg tablets; Na succinate injection 40/125/500/1000 mg (IV/IM); acetate suspension (IM only)',
        basisNote: 'Age >12 years — asthma exacerbation dosing',
        warningNote: 'The acetate suspension form must NOT be given IV.',
      };
    },
  },
  {
    id: 'fludrocortisone',
    name: 'Fludrocortisone',
    category: 'Endocrine',
    indications: ['Adrenal insufficiency / congenital adrenal hyperplasia (mineralocorticoid replacement)'],
    administration: 'PO, once daily.',
    monitoring: ['Blood pressure', 'Electrolytes (hypokalaemia)', 'Growth'],
    cautions: [
      'Contraindicated in CHF and systemic fungal infections',
      'Primarily mineralocorticoid activity — caution in hypertension/oedema/renal dysfunction',
      'Phenytoin/rifampin increase metabolism (reduce effect); may potentiate digoxin toxicity via hypokalaemia',
      'Taper when discontinuing',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '0.05–0.2mg once daily.',
    calculate: () => {
      return {
        dosePerKg: 'Fixed dosing (not weight-based)',
        totalDose: '0.05–0.1 mg once daily (up to 0.3 mg/24h for congenital adrenal hyperplasia)',
        interval: 'Once daily',
        route: 'PO',
        concentration: '0.1 mg tablets; 0.1 mg/mL oral suspension',
        basisNote: 'Mineralocorticoid replacement dosing',
        warningNote: 'Contraindicated in CHF and systemic fungal infections. Monitor blood pressure and electrolytes — may cause hypertension and hypokalaemia.',
      };
    },
  },
  {
    id: 'levothyroxine',
    name: 'Levothyroxine',
    category: 'Endocrine',
    indications: ['Hypothyroidism (maintenance replacement)'],
    administration: 'PO, once daily on an empty stomach. IV/IM alternative at 50–75% of the oral dose.',
    monitoring: ['TSH and free T4 to titrate dose', 'Growth and developmental milestones (infants)', 'Signs of overtreatment — hyperactivity, tachycardia, poor weight gain'],
    cautions: [
      'Contraindicated in acute MI, thyrotoxicosis, uncorrected adrenal insufficiency',
      'Start at ¼ maintenance dose and titrate slowly if cardiac disease is present',
      'Overtreatment risks craniosynostosis (infants) or premature epiphyseal closure (children)',
      'Phenytoin, rifampin, carbamazepine, iron/calcium supplements, and antacids reduce absorption/levels — space administration',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Start 12.5–25mcg once daily, increase by 12.5–25mcg q2–4wk; usual maintenance 100–200mcg/24h.',
    calculate: (weight, age) => {
      let lowPerKg: number, highPerKg: number, band: string;
      if (age < 0.25) { lowPerKg = 10; highPerKg = 15; band = '1–3 months'; }
      else if (age < 0.5) { lowPerKg = 8; highPerKg = 10; band = '>3–6 months'; }
      else if (age < 1) { lowPerKg = 6; highPerKg = 8; band = '>6–12 months'; }
      else if (age < 5) { lowPerKg = 5; highPerKg = 6; band = '1–5 years'; }
      else if (age < 12) { lowPerKg = 4; highPerKg = 5; band = '6–12 years'; }
      else { lowPerKg = 1.7; highPerKg = 3; band = '>12 years'; }
      const low = weight * lowPerKg;
      const high = weight * highPerKg;
      return {
        dosePerKg: `${lowPerKg}–${highPerKg} mcg/kg/24h once daily`,
        totalDose: `${low.toFixed(0)}–${high.toFixed(0)} mcg/24h`,
        interval: 'Once daily, on an empty stomach',
        route: 'PO (IV/IM: 50–75% of the oral dose, once daily)',
        concentration: '25–300 mcg tablets (12 strengths); 13–200 mcg capsules; oral solution/suspension in multiple strengths',
        basisNote: `Age band: ${band}`,
        warningNote: 'If cardiac disease is present, start at ¼ of the calculated maintenance dose and increase gradually (weekly). Overtreatment in infants risks craniosynostosis; in children, premature epiphyseal closure.',
      };
    },
  },

  // ─── Allergy & Anaphylaxis ──────────────────────────────────────────────
  {
    id: 'chlorpheniramine',
    name: 'Chlorpheniramine',
    category: 'Allergy & Anaphylaxis',
    indications: ['Allergic symptoms (rhinitis, urticaria) — oral only'],
    administration: 'PO. Administer with food. Sustained-release forms not recommended <6 years and must not be crushed/chewed/dissolved.',
    monitoring: ['Sedation level', 'Paradoxical excitation in young children'],
    cautions: [
      'Caution in asthma (may thicken secretions)',
      'Anticholinergic effects — dry mouth, blurred vision, urinary retention',
      'Young children may show paradoxical excitation rather than sedation',
      'Not IV/IM capable — oral only; an alternative agent is needed for parenteral antihistamine use in anaphylaxis',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '4 mg/dose Q4–6h PO, max 24 mg/24h; sustained-release 12 mg Q12h.',
    calculate: (weight, age) => {
      if (age < 2) {
        const low = (weight * 0.35) / 6;
        const high = (weight * 0.35) / 4;
        return {
          dosePerKg: '0.35 mg/kg/24h ÷ Q4–6h',
          totalDose: `${low.toFixed(2)}–${high.toFixed(2)} mg/dose`,
          interval: 'Q4–6h',
          route: 'PO',
          concentration: '2 mg/5 mL syrup; 4 mg tablets',
          basisNote: 'Age <2 years — weight-based dosing, use cautiously',
          warningNote: 'Sedating (first-generation) antihistamine — caution with other CNS depressants.',
        };
      }
      if (age < 6) {
        return {
          dosePerKg: '1 mg/dose Q4–6h (fixed dosing)',
          totalDose: '1 mg/dose',
          interval: 'Q4–6h',
          route: 'PO',
          concentration: '2 mg/5 mL syrup; 4 mg tablets',
          basisNote: 'Age 2–5 years',
          maxDose: '6 mg/24h',
        };
      }
      if (age < 12) {
        return {
          dosePerKg: '2 mg/dose Q4–6h (fixed dosing)',
          totalDose: '2 mg/dose',
          interval: 'Q4–6h',
          route: 'PO',
          concentration: '2 mg/5 mL syrup; 4 mg tablets',
          basisNote: 'Age 6–11 years',
          maxDose: '12 mg/24h',
        };
      }
      return {
        dosePerKg: '4 mg/dose Q4–6h (fixed dosing)',
        totalDose: '4 mg/dose',
        interval: 'Q4–6h',
        route: 'PO',
        concentration: '2 mg/5 mL syrup; 4 mg tablets; 12 mg sustained-release tablets',
        basisNote: 'Age ≥12 years',
        maxDose: '24 mg/24h',
        warningNote: 'Sustained-release: 12 mg PO Q12h.',
      };
    },
  },
  {
    id: 'cetirizine',
    name: 'Cetirizine',
    category: 'Allergy & Anaphylaxis',
    indications: ['Allergic rhinitis / urticaria (less-sedating antihistamine)'],
    administration: 'PO, once daily.',
    monitoring: ['Sedation (less common than first-generation antihistamines)', 'Renal function-based dose adjustment if impaired'],
    cautions: [
      'Not recommended for routine URI/cold symptoms in infants — FDA advises against use <2 years',
      'Reduce dose in renal or hepatic impairment',
      'Less sedating than first-generation antihistamines but still caution with other CNS depressants',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '5–10 mg once daily.',
    calculate: (weight, age) => {
      if (age < 0.5) {
        return {
          dosePerKg: 'Not recommended <6 months',
          totalDose: 'Not recommended',
          interval: '—',
          route: 'PO',
          concentration: '5 mg/5 mL syrup',
          basisNote: 'Age <6 months',
          warningNote: 'Not recommended under 6 months of age.',
        };
      }
      if (age < 2) {
        return {
          dosePerKg: '2.5 mg once daily (may increase to 2.5 mg Q12h at 12–23 months)',
          totalDose: '2.5 mg/dose',
          interval: 'Once daily (or Q12h from 12 months)',
          route: 'PO',
          concentration: '5 mg/5 mL syrup',
          basisNote: 'Age 6–23 months',
          maxDose: '5 mg/24h',
        };
      }
      if (age < 6) {
        return {
          dosePerKg: '2.5 mg once daily, may increase to 5 mg/24h (once daily or ÷ BID)',
          totalDose: '2.5–5 mg/24h',
          interval: 'Once daily or BID',
          route: 'PO',
          concentration: '5 mg/5 mL syrup; 2.5/5/10 mg chewable tablets',
          basisNote: 'Age 2–5 years',
          maxDose: '5 mg/24h',
        };
      }
      return {
        dosePerKg: '5–10 mg once daily',
        totalDose: '5–10 mg/dose',
        interval: 'Once daily',
        route: 'PO',
        concentration: '5 mg/5 mL syrup; 5/10 mg tablets',
        basisNote: 'Age ≥6 years',
        maxDose: '10 mg/24h',
      };
    },
  },
  {
    id: 'diphenhydramine',
    name: 'Diphenhydramine',
    brandName: 'Benadryl',
    category: 'Allergy & Anaphylaxis',
    indications: ['Anaphylaxis / severe allergic reaction (adjunct)', 'Acute dystonic reaction'],
    administration: 'PO/IM/IV.',
    monitoring: ['Sedation level', 'Paradoxical excitation in children'],
    cautions: [
      'Do NOT use in neonates (CNS effects)',
      'Contraindicated with concurrent MAOIs, acute asthma attacks, GI/urinary obstruction',
      'Paradoxical excitement reported in children',
      'False-positive urine PCP screen possible',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: '25-50mg/dose Q4-8h; max 400mg/24h.',
    calculate: (weight) => {
      const low = weight * 1;
      const high = Math.min(weight * 2, 50);
      const maxDaily = Math.min(weight * 5, 300);
      return {
        dosePerKg: '1–2 mg/kg/dose PO/IM/IV Q6h',
        totalDose: `${low.toFixed(0)}–${high.toFixed(0)} mg/dose`,
        interval: 'Q6h',
        route: 'PO/IM/IV',
        concentration: '12.5 mg/5 mL elixir/liquid; 25/50 mg capsules/tablets; 12.5 mg chewable tablets; 50 mg/mL injection',
        basisNote: 'Anaphylaxis/allergic reaction and dystonic reaction dosing',
        maxDose: `${maxDaily.toFixed(0)} mg/24h (max 50 mg/dose, 300 mg/24h)`,
        warningNote: 'Do NOT use in neonates (CNS effects). Contraindicated with concurrent MAOIs, acute asthma attacks, GI/urinary obstruction.',
      };
    },
  },
  {
    id: 'famotidine',
    name: 'Famotidine',
    category: 'Allergy & Anaphylaxis',
    indications: ['Anaphylaxis (adjunct alongside an antihistamine — clinical-practice convention)', 'GERD / peptic ulcer disease'],
    administration: 'PO or IV.',
    monitoring: ['Renal function (dose adjustment in severe impairment)', 'Clinical response'],
    cautions: [
      'No anaphylaxis-specific dosing is documented in Harriet Lane for this drug — its inclusion here reflects common clinical practice as an H2-blocker adjunct in anaphylaxis protocols, not a cited indication',
      'Adjust dose in severe renal impairment',
      'Infants/young children may need Q8h dosing due to enhanced clearance',
      'Rare rhabdomyolysis reported',
    ],
    references: ['Harriet Lane Handbook, 22nd/23rd ed.'],
    adultDose: 'Duodenal ulcer: 20mg BID or 40mg QHS x4-8wk. GERD: 20mg BID x6wk.',
    calculate: (weight, age) => {
      if (age < 0.25) {
        const ivLow = weight * 0.25;
        const ivHigh = weight * 0.5;
        const poHigh = weight * 1;
        return {
          dosePerKg: '0.25–0.5 mg/kg/dose IV, or 0.5–1 mg/kg/dose PO, Q24h',
          totalDose: `IV: ${ivLow.toFixed(2)}–${ivHigh.toFixed(2)} mg | PO: ${ivHigh.toFixed(2)}–${poHigh.toFixed(2)} mg`,
          interval: 'Q24h',
          route: 'PO or IV',
          concentration: '40 mg/5 mL oral suspension; 10/20/40 mg tablets; 10 mg/mL injection',
          basisNote: 'Age <3 months',
          warningNote: 'This drug\'s primary sourced indication is GERD/peptic ulcer, not anaphylaxis — its use as an anaphylaxis adjunct alongside an antihistamine is a clinical-practice convention, not something Harriet Lane itself documents.',
        };
      }
      const ivDaily = Math.min(weight * 1, 40);
      const poDaily = Math.min(weight * 1.2, 40);
      return {
        dosePerKg: 'IV: 0.5–1 mg/kg/24h ÷ Q12h (max 40 mg/24h) | PO: 1–1.2 mg/kg/24h ÷ Q12h (max 40 mg/24h)',
        totalDose: `IV: ${ivDaily.toFixed(0)} mg/24h | PO: ${poDaily.toFixed(0)} mg/24h`,
        interval: 'Q12h',
        route: 'PO or IV',
        concentration: '40 mg/5 mL oral suspension; 10/20/40 mg tablets; 10 mg/mL injection',
        basisNote: 'Age 3 months–12 years, general/peptic ulcer dosing',
        maxDose: '40 mg/24h',
        warningNote: 'This drug\'s primary sourced indication is GERD/peptic ulcer, not anaphylaxis — its use as an anaphylaxis adjunct alongside an antihistamine is a clinical-practice convention, not something Harriet Lane itself documents. GERD dosing can go up to 2 mg/kg/24h PO (max 80 mg/24h).',
      };
    },
  },
];
