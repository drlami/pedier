'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  AlertTriangle, CheckCircle2, ChevronDown, ChevronRight,
  TriangleAlert, Zap, Activity, Brain, FlaskConical,
  Ambulance, Printer, ClipboardList, Calculator,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Vals {
  symptoms: Set<string>;
  ageGroup: string;
  weight: string;
  glucose: string;
  ph: string;
  bicarb: string;
  lactate: string;
  ammonia: string;
  ketones: string;
  ck: string;
}

type Likelihood = 'high' | 'moderate' | 'consider';
type MgmtType = 'emergency' | 'urgent' | 'consider' | 'specialist';

interface MgmtItem {
  text: string;
  dose?: string;
  note?: string;
  type: MgmtType;
}

interface InvItem {
  text: string;
  urgent?: boolean;
}

interface DxEntry {
  id: string;
  name: string;
  fullName: string;
  pattern: 'A' | 'B' | 'C' | 'D';
  match(v: Vals): { likelihood: Likelihood; reason: string } | null;
  distinguishing: string[];
  investigations: InvItem[];
  management: MgmtItem[];
}

// ─── Derived values ─────────────────────────────────────────────────────────────

function derive(v: Vals) {
  const g   = parseFloat(v.glucose);
  const ph  = parseFloat(v.ph);
  const hco = parseFloat(v.bicarb);
  const lac = parseFloat(v.lactate);
  const nh3 = parseFloat(v.ammonia);
  const ck  = parseFloat(v.ck);
  return {
    g, ph, hco, lac, nh3, ck,
    hasG:   !isNaN(g),   hasPH:  !isNaN(ph),  hasHCO: !isNaN(hco),
    hasLac: !isNaN(lac), hasNH3: !isNaN(nh3), hasCK:  !isNaN(ck),
    hypoglycemia:      !isNaN(g)   && g   < 63,
    severeHypoglycemia:!isNaN(g)   && g   < 45,
    acidosis:         (!isNaN(ph)  && ph  < 7.25) || (!isNaN(hco) && hco < 15),
    severeAcidosis:   (!isNaN(ph)  && ph  < 7.1)  || (!isNaN(hco) && hco < 10),
    hyperNH3:          !isNaN(nh3) && nh3 > 100,
    elevatedLac:       !isNaN(lac) && lac > 2.0,
    highLac:           !isNaN(lac) && lac > 5.0,
    highCK:            !isNaN(ck)  && ck  > 500,
    highKetones:       v.ketones === 'moderate' || v.ketones === 'large',
    lowKetones:        !v.ketones  || v.ketones === 'none' || v.ketones === 'trace',
    encephalopathy:    v.symptoms.has('encephalopathy'),
    seizures:          v.symptoms.has('seizures'),
    odour:             v.symptoms.has('odour'),
    shock:             v.symptoms.has('shock'),
    neonate:           v.ageGroup === 'neonate',
    infant:            v.ageGroup === 'infant',
  };
}

// ─── Lab interpretation ─────────────────────────────────────────────────────────

interface Interp { label: string; cls: string }

const interpGlucose  = (n: number): Interp => n >= 72 ? { label: 'Normal',               cls: 'text-green-700 bg-green-50 border-green-200'   } :
                                              n >= 63 ? { label: 'Low-normal',             cls: 'text-yellow-700 bg-yellow-50 border-yellow-200' } :
                                              n >= 45 ? { label: 'Hypoglycaemia',          cls: 'text-amber-700 bg-amber-50 border-amber-200'   } :
                                                        { label: 'Severe hypoglycaemia',   cls: 'text-red-700 bg-red-50 border-red-200'         };

const interpPH       = (n: number): Interp => n >= 7.35 ? { label: 'Normal',               cls: 'text-green-700 bg-green-50 border-green-200'   } :
                                              n >= 7.25 ? { label: 'Mild acidosis',         cls: 'text-yellow-700 bg-yellow-50 border-yellow-200' } :
                                              n >= 7.15 ? { label: 'Moderate acidosis',     cls: 'text-amber-700 bg-amber-50 border-amber-200'   } :
                                                          { label: 'Severe acidosis',       cls: 'text-red-700 bg-red-50 border-red-200'         };

const interpBicarb   = (n: number): Interp => n >= 20  ? { label: 'Normal',                cls: 'text-green-700 bg-green-50 border-green-200'   } :
                                              n >= 15  ? { label: 'Mildly low',             cls: 'text-yellow-700 bg-yellow-50 border-yellow-200' } :
                                              n >= 10  ? { label: 'Moderately low',         cls: 'text-amber-700 bg-amber-50 border-amber-200'   } :
                                                         { label: 'Severely low',           cls: 'text-red-700 bg-red-50 border-red-200'         };

const interpLactate  = (n: number): Interp => n <  2.0 ? { label: 'Normal',                cls: 'text-green-700 bg-green-50 border-green-200'   } :
                                              n <  4.0 ? { label: 'Mildly elevated',        cls: 'text-yellow-700 bg-yellow-50 border-yellow-200' } :
                                              n <  7.0 ? { label: 'Elevated — metabolic disease likely', cls: 'text-amber-700 bg-amber-50 border-amber-200' } :
                                                         { label: 'Severely elevated',      cls: 'text-red-700 bg-red-50 border-red-200'         };

const interpAmmonia  = (n: number): Interp => n <   50 ? { label: 'Normal',                cls: 'text-green-700 bg-green-50 border-green-200'   } :
                                              n <  100 ? { label: 'Mildly elevated',        cls: 'text-yellow-700 bg-yellow-50 border-yellow-200' } :
                                              n <  200 ? { label: 'Elevated — metabolic disease likely',  cls: 'text-amber-700 bg-amber-50 border-amber-200'   } :
                                              n <  400 ? { label: 'Severely elevated — UCD/OA likely',    cls: 'text-red-700 bg-red-50 border-red-200'         } :
                                                         { label: 'Critical — consider dialysis',         cls: 'text-red-800 bg-red-100 border-red-400'        };

const interpCK       = (n: number): Interp => n <  200 ? { label: 'Normal',                cls: 'text-green-700 bg-green-50 border-green-200'   } :
                                              n <  500 ? { label: 'Mildly elevated',        cls: 'text-yellow-700 bg-yellow-50 border-yellow-200' } :
                                              n < 5000 ? { label: 'Elevated — rhabdomyolysis possible',  cls: 'text-amber-700 bg-amber-50 border-amber-200'   } :
                                                         { label: 'Severely elevated — rhabdomyolysis',  cls: 'text-red-700 bg-red-50 border-red-200'         };

// ─── DDx Database ───────────────────────────────────────────────────────────────

const DDX_DB: DxEntry[] = [

  // ── PATTERN A: Urea Cycle Disorders ─────────────────────────────────────────

  {
    id: 'otc', name: 'OTC Deficiency', fullName: 'Ornithine Transcarbamylase (OTC) Deficiency', pattern: 'A',
    match(v) {
      const d = derive(v);
      if (!d.hyperNH3 || (d.acidosis && d.highKetones)) return null;
      const hi = d.nh3 > 200 || (d.neonate && d.hyperNH3) || d.encephalopathy;
      return { likelihood: hi ? 'high' : 'moderate', reason: `Hyperammonemia (${v.ammonia} μmol/L) without significant acidosis or elevated ketones — most common urea cycle disorder (X-linked)` };
    },
    distinguishing: [
      'X-linked: classically severe in males; symptomatic carrier females possible',
      'Elevated urine orotic acid — KEY test distinguishing OTC from CPS1 (CPS1 has NORMAL orotic acid)',
      'Plasma amino acids: low citrulline, high glutamine and alanine',
      'Triggered by illness, high protein intake, fasting, or post-partum in females',
      'Neonatal males: rapid hyperammonemic coma within 24–48 h of birth',
    ],
    investigations: [
      { text: 'Urine orotic acid — ELEVATED in OTC; NORMAL in CPS1 (critical distinction)', urgent: true },
      { text: 'Plasma amino acids — low citrulline, high glutamine and alanine', urgent: true },
      { text: 'Plasma acylcarnitine profile', urgent: false },
      { text: 'Ammonia every 2–4 h until stable', urgent: true },
      { text: 'LFT (liver is primary affected organ)', urgent: false },
      { text: 'OTC gene sequencing', urgent: false },
    ],
    management: [
      { type: 'emergency', text: 'STOP all protein intake immediately' },
      { type: 'emergency', text: 'IV 10% glucose — anti-catabolic', dose: 'GIR 8–10 mg/kg/min (see GIR calculator)' },
      { type: 'urgent', text: 'Ammonia scavengers — discuss with metabolic team / PICU', dose: 'Sodium benzoate 250 mg/kg + sodium phenylacetate 250 mg/kg IV loading over 90 min, then 250 mg/kg/day each as maintenance' },
      { type: 'urgent', text: 'Arginine supplementation', dose: '250 mg/kg/day IV — do not use in hyperargininaemia' },
      { type: 'consider', text: 'Haemodialysis / haemofiltration', note: 'If ammonia > 400 μmol/L, rising despite treatment, or refractory encephalopathy — most effective ammonia removal' },
      { type: 'specialist', text: 'Liver transplantation — curative; discuss with metabolic team once stabilised' },
    ],
  },

  {
    id: 'cps1', name: 'CPS1 Deficiency', fullName: 'Carbamoyl Phosphate Synthetase 1 (CPS1) Deficiency', pattern: 'A',
    match(v) {
      const d = derive(v);
      if (!d.hyperNH3 || (d.acidosis && d.highKetones)) return null;
      return { likelihood: 'moderate', reason: `Hyperammonemia (${v.ammonia} μmol/L) without acidosis/ketones — CPS1 vs OTC: urine orotic acid is NORMAL in CPS1 (vs elevated in OTC). Autosomal recessive.` };
    },
    distinguishing: [
      'Urine orotic acid NORMAL — key distinction from OTC deficiency',
      'Autosomal recessive (affects males and females equally)',
      'Plasma amino acids: very low citrulline, elevated glutamine',
      'May respond to N-carbamylglutamate (NCG) — activates residual enzyme activity',
      'Often severe neonatal presentation',
    ],
    investigations: [
      { text: 'Urine orotic acid — NORMAL in CPS1 (excludes OTC; confirms CPS1 direction)', urgent: true },
      { text: 'Plasma amino acids — very low citrulline', urgent: true },
      { text: 'N-carbamylglutamate (NCG) therapeutic trial — may dramatically reduce ammonia', urgent: true },
      { text: 'CPS1 gene sequencing', urgent: false },
    ],
    management: [
      { type: 'emergency', text: 'STOP all protein immediately' },
      { type: 'emergency', text: 'IV 10% glucose', dose: 'GIR 8–10 mg/kg/min' },
      { type: 'urgent', text: 'N-carbamylglutamate (NCG / Carbaglu)', dose: '100–250 mg/kg oral or NG loading dose — activates residual CPS1; may dramatically reduce ammonia within hours' },
      { type: 'urgent', text: 'Ammonia scavengers', dose: 'Sodium benzoate + sodium phenylacetate per specialist' },
      { type: 'consider', text: 'Haemodialysis', note: 'If refractory hyperammonemia or encephalopathy worsening' },
    ],
  },

  {
    id: 'citrullinemia', name: 'Citrullinemia Type 1', fullName: 'Classic Citrullinemia (ASS1 Deficiency)', pattern: 'A',
    match(v) {
      const d = derive(v);
      if (!d.hyperNH3 || (d.acidosis && d.highKetones)) return null;
      return { likelihood: 'consider', reason: `Hyperammonemia (${v.ammonia} μmol/L) without acidosis — consider if plasma amino acids show very high citrulline (> 1000 μmol/L is diagnostic)` };
    },
    distinguishing: [
      'Very high plasma citrulline (> 1000 μmol/L in classic form) — DIAGNOSTIC',
      'Autosomal recessive — affects both sexes',
      'Urine orotic acid elevated',
      'May have episodic late-onset form with normal development between crises',
    ],
    investigations: [
      { text: 'Plasma amino acids — very high citrulline (DIAGNOSTIC)', urgent: true },
      { text: 'Urine orotic acid — elevated', urgent: true },
      { text: 'ASS1 gene sequencing', urgent: false },
    ],
    management: [
      { type: 'emergency', text: 'STOP protein; IV 10% glucose', dose: 'GIR 8–10 mg/kg/min' },
      { type: 'urgent', text: 'Ammonia scavengers per specialist', dose: 'Sodium benzoate + sodium phenylacetate as per metabolic team guidance' },
      { type: 'urgent', text: 'Arginine', dose: '600 mg/kg/day IV — higher dose required; arginine synthesis is blocked in citrullinemia', note: 'Higher dose than OTC' },
      { type: 'consider', text: 'Haemodialysis if refractory' },
    ],
  },

  // ── PATTERN B: Organic Acidemias ─────────────────────────────────────────────

  {
    id: 'pa', name: 'Propionic Acidemia (PA)', fullName: 'Propionic Acidemia', pattern: 'B',
    match(v) {
      const d = derive(v);
      if (!d.acidosis || !d.highKetones) return null;
      const hi = d.severeAcidosis || d.hyperNH3 || (d.neonate && d.acidosis);
      return { likelihood: hi ? 'high' : 'moderate', reason: `Metabolic acidosis${v.ph ? ` (pH ${v.ph})` : ''} + elevated ketones — one of the most common organic acidemias. Secondary hyperammonemia frequent.` };
    },
    distinguishing: [
      'Elevated 3-OH propionate, methylcitrate, tiglylglycine on urine organic acids — DIAGNOSTIC',
      'Elevated C3 (propionylcarnitine) on plasma acylcarnitine profile',
      'Secondary hyperammonemia from mitochondrial dysfunction — common',
      'Thrombocytopenia and leukopenia during acute crisis (check CBC urgently)',
      'Plasma carnitine often depleted (secondary carnitine deficiency)',
      'Glycine elevated on plasma amino acids (hyperglycinaemia)',
    ],
    investigations: [
      { text: 'Urine organic acids — elevated methylcitrate, 3-OH propionate, tiglylglycine (DIAGNOSTIC)', urgent: true },
      { text: 'Plasma acylcarnitine profile — elevated C3', urgent: true },
      { text: 'CBC — thrombocytopenia and leukopenia common in acute crisis', urgent: true },
      { text: 'Plasma amino acids — elevated glycine', urgent: false },
      { text: 'Plasma free and total carnitine — often depleted', urgent: false },
      { text: 'PCCA / PCCB gene sequencing', urgent: false },
    ],
    management: [
      { type: 'emergency', text: 'STOP all protein intake immediately' },
      { type: 'emergency', text: 'IV 10% glucose — anti-catabolic', dose: 'GIR 8–10 mg/kg/min (see GIR calculator)' },
      { type: 'urgent', text: 'L-Carnitine', dose: '100 mg/kg IV bolus over 30 min, then 100 mg/kg/day continuous infusion — replenishes depleted carnitine; conjugates propionyl-CoA' },
      { type: 'urgent', text: 'Metronidazole', dose: '10–20 mg/kg/day IV or oral — reduces propionate production by colonic anaerobic bacteria' },
      { type: 'urgent', text: 'Correct metabolic acidosis', dose: 'Sodium bicarbonate if pH < 7.1 after adequate fluid resuscitation', note: 'Avoid over-correction — titrate to pH 7.2–7.3' },
      { type: 'consider', text: 'Biotin 10 mg/day', note: 'Give empirically to cover Multiple Carboxylase Deficiency until excluded' },
      { type: 'consider', text: 'Haemodialysis / haemofiltration', note: 'If severe refractory acidosis, life-threatening ammonia, or rapidly deteriorating' },
    ],
  },

  {
    id: 'mma', name: 'Methylmalonic Acidemia (MMA)', fullName: 'Methylmalonic Acidemia', pattern: 'B',
    match(v) {
      const d = derive(v);
      if (!d.acidosis || !d.highKetones) return null;
      const hi = d.severeAcidosis || (d.neonate && d.acidosis);
      return { likelihood: hi ? 'high' : 'moderate', reason: `Metabolic acidosis + ketosis — MMA and PA are clinically indistinguishable; B12-responsive subtypes exist and respond dramatically to hydroxocobalamin` };
    },
    distinguishing: [
      'Elevated methylmalonic acid in urine and plasma — DIAGNOSTIC (vs PA: elevated propionic acid)',
      'Elevated C3 acylcarnitine (same as PA — cannot distinguish without organic acids)',
      'B12-responsive subtypes (CblA, CblB): hydroxocobalamin may be curative — trial is safe and should not be delayed',
      'Renal involvement (interstitial nephritis, renal tubular acidosis) — check creatinine',
      'Combined MMA + homocystinuria in CblC: check homocysteine',
    ],
    investigations: [
      { text: 'Urine organic acids — elevated methylmalonic acid (distinguishes MMA from PA)', urgent: true },
      { text: 'Plasma acylcarnitine — elevated C3', urgent: true },
      { text: 'Serum Vitamin B12 — B12-responsive subtypes exist', urgent: true },
      { text: 'Creatinine + renal function — renal involvement common', urgent: true },
      { text: 'Plasma homocysteine — elevated in CblC (combined MMA + homocystinuria)', urgent: false },
    ],
    management: [
      { type: 'emergency', text: 'STOP protein; IV 10% glucose', dose: 'GIR 8–10 mg/kg/min' },
      { type: 'urgent', text: 'Hydroxocobalamin (Vitamin B12)', dose: '1 mg IM or IV daily for 3–5 days — give empirically; B12-responsive subtypes (CblA, CblB) may show dramatic improvement within 24–48 h' },
      { type: 'urgent', text: 'L-Carnitine', dose: '100 mg/kg IV bolus, then 100 mg/kg/day' },
      { type: 'urgent', text: 'Correct acidosis', dose: 'Sodium bicarbonate if pH < 7.1' },
      { type: 'consider', text: 'Metronidazole', dose: '10–20 mg/kg/day — reduces gut methylmalonate production' },
    ],
  },

  {
    id: 'msud', name: 'MSUD', fullName: 'Maple Syrup Urine Disease (BCKDH Deficiency)', pattern: 'B',
    match(v) {
      const d = derive(v);
      if (!d.acidosis || !d.highKetones) return null;
      const hi = d.odour || (d.encephalopathy && d.neonate);
      return {
        likelihood: hi ? 'high' : 'consider',
        reason: hi
          ? `Acidosis + ketones${d.odour ? ' + unusual odour (maple syrup / sweet)' : ''}${d.encephalopathy && d.neonate ? ' + encephalopathy in neonate' : ''} — MSUD: leucine neurotoxicity requires urgent action`
          : 'Acidosis + ketosis — consider MSUD especially if unusual sweet odour or severe neurological features',
      };
    },
    distinguishing: [
      'Sweet / maple syrup odour (urine, cerumen, sweat) — characteristic but not always present',
      'Leucine encephalopathy — neurological severity correlates with plasma leucine level',
      'Alloisoleucine on plasma amino acids — PATHOGNOMONIC (unique to MSUD)',
      'Branched-chain ketoacids (2-oxoisocaproate) on urine organic acids',
      'Thiamine-responsive variant exists — thiamine trial is safe and should not be delayed',
    ],
    investigations: [
      { text: 'Plasma amino acids — elevated leucine / isoleucine / valine; alloisoleucine PATHOGNOMONIC', urgent: true },
      { text: 'Plasma leucine quantification — correlates with neurological severity', urgent: true },
      { text: 'Urine organic acids — branched-chain ketoacids', urgent: true },
    ],
    management: [
      { type: 'emergency', text: 'STOP protein immediately', note: 'Leucine is directly neurotoxic — do not delay' },
      { type: 'emergency', text: 'High-calorie IV glucose', dose: 'GIR 10–12 mg/kg/min — higher rate to maximally suppress catabolism and leucine release' },
      { type: 'urgent', text: 'Thiamine (Vitamin B1)', dose: '100–300 mg/day IV or oral — thiamine-responsive subtypes may improve dramatically within 24–48 h; safe to give empirically' },
      { type: 'consider', text: 'Haemodialysis / haemofiltration', note: 'If leucine > 1000 μmol/L or rapid neurological deterioration — fastest way to reduce leucine' },
      { type: 'specialist', text: 'Isoleucine + valine supplementation', note: 'Deficiency develops when all BCAA protein stopped — specialist guidance essential' },
    ],
  },

  {
    id: 'iva', name: 'Isovaleric Acidemia (IVA)', fullName: 'Isovaleric Acidemia', pattern: 'B',
    match(v) {
      const d = derive(v);
      if (!d.acidosis || !d.highKetones) return null;
      const hi = d.odour;
      return {
        likelihood: hi ? 'high' : 'consider',
        reason: hi
          ? 'Acidosis + ketones + unusual odour — "sweaty feet / cheesy" odour is characteristic of IVA (isovaleric acid accumulation)'
          : 'Acidosis + ketosis — consider IVA if "sweaty feet" odour; distinguished by C5 acylcarnitine',
      };
    },
    distinguishing: [
      '"Sweaty feet" or "cheesy" odour — isovaleric acid; very distinctive when present',
      'Elevated C5 (isovalerylcarnitine) on acylcarnitine profile — DIAGNOSTIC',
      'Isovalerylglycine elevated on urine organic acids',
      'Thrombocytopenia / leukopenia (as with PA)',
    ],
    investigations: [
      { text: 'Plasma acylcarnitine — elevated C5 (isovalerylcarnitine) — DIAGNOSTIC', urgent: true },
      { text: 'Urine organic acids — elevated isovalerylglycine', urgent: true },
      { text: 'CBC — thrombocytopenia common', urgent: false },
    ],
    management: [
      { type: 'emergency', text: 'STOP protein; IV 10% glucose', dose: 'GIR 8–10 mg/kg/min' },
      { type: 'urgent', text: 'L-Carnitine', dose: '100 mg/kg IV bolus, then 100 mg/kg/day — conjugates isovalerate → isovalerylcarnitine for renal excretion' },
      { type: 'urgent', text: 'Glycine', dose: '250 mg/kg/day oral or NG — conjugates isovalerate → isovalerylglycine; equally effective as carnitine' },
    ],
  },

  {
    id: 'mcd', name: 'Multiple Carboxylase Deficiency', fullName: 'Multiple Carboxylase Deficiency (Biotinidase or Holocarboxylase Synthetase Deficiency)', pattern: 'B',
    match(v) {
      const d = derive(v);
      if (!d.acidosis) return null;
      return { likelihood: 'consider', reason: 'Metabolic acidosis — MCD is rare but HIGHLY TREATABLE with biotin; give empirically in any unclear organic acidemia before results return' };
    },
    distinguishing: [
      'Alopecia (hair loss) and eczematous skin rash — characteristic of biotinidase deficiency',
      'Biotin-responsive — potentially curative if treated early',
      'Overlapping organic acid profile with PA — cannot distinguish without biotinidase activity',
      'Elevated 3-OH isovalerate, methylcitrate, 3-methylcrotonylglycine on organic acids',
      'Holocarboxylase synthetase deficiency: neonatal onset, very severe',
    ],
    investigations: [
      { text: 'Biotinidase activity — DBS or plasma (DIAGNOSTIC for biotinidase deficiency)', urgent: true },
      { text: 'Urine organic acids — elevated 3-OH isovalerate, methylcitrate', urgent: true },
      { text: 'Biotin therapeutic trial — safe to give to all patients', urgent: true },
    ],
    management: [
      { type: 'emergency', text: 'Biotin', dose: '10–20 mg/day IV or oral — give IMMEDIATELY before results; potentially curative', note: 'Safe in all patients; if MCD confirmed, biotin alone may be sufficient treatment' },
      { type: 'urgent', text: 'STOP protein temporarily; IV 10% glucose', dose: 'GIR 8–10 mg/kg/min' },
    ],
  },

  // ── PATTERN C: Fatty Acid Oxidation / Hyperinsulinism ───────────────────────

  {
    id: 'mcad', name: 'MCAD Deficiency', fullName: 'Medium-Chain Acyl-CoA Dehydrogenase (MCAD) Deficiency', pattern: 'C',
    match(v) {
      const d = derive(v);
      if (!d.hypoglycemia || !d.lowKetones || d.acidosis) return null;
      const hi = d.neonate || d.infant;
      return { likelihood: hi ? 'high' : 'moderate', reason: `Hypoglycaemia (${v.glucose} mg/dL) with absent / inappropriately low ketones — hypoketotic hypoglycaemia is the hallmark of FAO defects; MCAD is the most common` };
    },
    distinguishing: [
      'Elevated C8 (octanoylcarnitine) on acylcarnitine profile — DIAGNOSTIC for MCAD',
      'Often detected on newborn screening (where programmes exist)',
      'No cardiac involvement, no rhabdomyolysis (distinguishes from LCHAD/VLCAD)',
      'Triggered by fasting or intercurrent illness — asymptomatic between episodes',
      'Dicarboxylic aciduria (medium-chain) on urine organic acids',
    ],
    investigations: [
      { text: 'Plasma acylcarnitine profile — elevated C8 (octanoylcarnitine) — DIAGNOSTIC', urgent: true },
      { text: 'Critical sample at hypoglycaemia: insulin, cortisol, GH, ketones (3-OH butyrate), free fatty acids', urgent: true },
      { text: 'Urine organic acids — dicarboxylic aciduria', urgent: false },
      { text: 'LFT — hepatopathy may occur', urgent: false },
      { text: 'ACADM gene sequencing', urgent: false },
    ],
    management: [
      { type: 'emergency', text: 'IV glucose bolus', dose: '2 mL/kg 10% dextrose IV push — immediately' },
      { type: 'emergency', text: 'IV glucose maintenance', dose: 'GIR 8–10 mg/kg/min — prevents further lipolysis and fatty acid accumulation' },
      { type: 'emergency', text: 'AVOID ALL fasting — absolutely; continuous glucose throughout admission' },
      { type: 'emergency', text: 'Do NOT give Intralipid / lipid infusion', note: 'Medium-chain lipids worsen FAO defect — contraindicated' },
      { type: 'consider', text: 'L-Carnitine', note: 'If plasma carnitine depleted — specialist decision; evidence mixed in MCAD' },
    ],
  },

  {
    id: 'lchad', name: 'LCHAD / VLCAD Deficiency', fullName: 'Long-Chain Hydroxyacyl-CoA Dehydrogenase / Very Long-Chain Acyl-CoA Dehydrogenase Deficiency', pattern: 'C',
    match(v) {
      const d = derive(v);
      if (!d.hypoglycemia || !d.lowKetones || d.acidosis) return null;
      const hi = d.highCK;
      return {
        likelihood: hi ? 'high' : 'consider',
        reason: hi
          ? `Hypoketotic hypoglycaemia + elevated CK (${v.ck} U/L) — rhabdomyolysis strongly suggests long-chain FAO defect (LCHAD / VLCAD)`
          : 'Hypoketotic hypoglycaemia — consider LCHAD/VLCAD if CK elevated, cardiac involvement, or hepatopathy present',
      };
    },
    distinguishing: [
      'Rhabdomyolysis (elevated CK, myoglobin) — key distinguisher from MCAD',
      'Cardiomyopathy (dilated or hypertrophic) — check echo URGENTLY in VLCAD',
      'C16-OH, C18-OH elevated (LCHAD) or C14:1 elevated (VLCAD) on acylcarnitine',
      'Hepatopathy with elevated transaminases and coagulopathy',
      'LCHAD: peripheral neuropathy and pigmentary retinopathy (chronic)',
      'Maternal AFLP or HELLP in mothers of LCHAD-affected neonates',
    ],
    investigations: [
      { text: 'CK + myoglobin + urine myoglobin — rhabdomyolysis evaluation', urgent: true },
      { text: 'Plasma acylcarnitine — C16-OH (LCHAD) or C14:1 (VLCAD) — DIAGNOSTIC', urgent: true },
      { text: 'Echo — cardiomyopathy may be life-threatening (VLCAD)', urgent: true },
      { text: 'LFT + coagulation screen — hepatopathy assessment', urgent: true },
      { text: 'Renal function — AKI from myoglobinuria', urgent: true },
      { text: 'Critical sample: insulin, cortisol, free fatty acids', urgent: true },
    ],
    management: [
      { type: 'emergency', text: 'IV glucose bolus + maintenance', dose: '2 mL/kg 10% dextrose IV push, then GIR 8–12 mg/kg/min' },
      { type: 'emergency', text: 'AVOID fasting; do NOT give Intralipid — absolutely contraindicated in long-chain FAO defects' },
      { type: 'urgent', text: 'Aggressive IV hydration for rhabdomyolysis', dose: 'Target urine output > 3 mL/kg/hr — prevents myoglobinuric AKI' },
      { type: 'urgent', text: 'Monitor renal function closely — AKI risk from myoglobinuria' },
      { type: 'urgent', text: 'Cardiology review — cardiomyopathy management if present' },
      { type: 'consider', text: 'Riboflavin (Vitamin B2)', dose: '100 mg/day — may benefit some VLCAD subtypes' },
    ],
  },

  {
    id: 'hyperinsulinism', name: 'Congenital Hyperinsulinism', fullName: 'Congenital Hyperinsulinism (CHI)', pattern: 'C',
    match(v) {
      const d = derive(v);
      if (!d.hypoglycemia || !d.lowKetones || d.acidosis) return null;
      const hi = d.severeHypoglycemia && d.neonate;
      return {
        likelihood: hi ? 'high' : 'moderate',
        reason: `Hypoketotic hypoglycaemia${d.neonate ? ' in neonate' : ''} — inappropriately absent ketones with hypoglycaemia; very high glucose infusion requirement is pathognomonic for hyperinsulinism`,
      };
    },
    distinguishing: [
      'Requires very high GIR (> 10–12 mg/kg/min) to maintain normoglycaemia — pathognomonic',
      'Inappropriately elevated insulin (even insulin > 2 mIU/L at glucose < 54 mg/dL is abnormal)',
      'Absent ketones and low free fatty acids despite severe hypoglycaemia',
      'Glucagon response > 27 mg/dL rise — excess glycogen (insulin-driven)',
      'HI-HA syndrome (GLUD1 mutation): hyperinsulinism + elevated ammonia',
    ],
    investigations: [
      { text: 'Critical sample at hypoglycaemia: insulin, C-peptide, cortisol, GH, glucagon, free fatty acids, 3-OH butyrate', urgent: true },
      { text: 'Ammonia — elevated in HI-HA syndrome (GLUD1 mutation)', urgent: true },
      { text: 'Acylcarnitine profile — should be normal (excludes FAO defect)', urgent: false },
      { text: 'Glucagon stimulation 0.5 mg IM — > 27 mg/dL rise suggests hyperinsulinism', urgent: false },
      { text: 'Genetic panel: ABCC8, KCNJ11, GLUD1, GCK, HNF4A', urgent: false },
    ],
    management: [
      { type: 'emergency', text: 'IV glucose bolus', dose: '2 mL/kg 10% dextrose IV push' },
      { type: 'emergency', text: 'High-rate glucose infusion', dose: 'Start GIR 8 mg/kg/min; increase to 12–15+ mg/kg/min as needed — central line required for > 12.5% glucose' },
      { type: 'urgent', text: 'Glucagon IM', dose: '0.5 mg IM (< 25 kg) or 1 mg IM (> 25 kg) — for acute severe hypoglycaemia while establishing IV access' },
      { type: 'urgent', text: 'Diazoxide', dose: '5–15 mg/kg/day oral in 3 divided doses — first-line medical therapy; requires specialist initiation and monitoring' },
      { type: 'specialist', text: 'Octreotide or partial pancreatectomy if diazoxide-unresponsive — specialist decision after genetic workup and PET scan' },
    ],
  },

  // ── PATTERN D: Ketotic Hypoglycaemia ────────────────────────────────────────

  {
    id: 'ketotic_hypo', name: 'Ketotic Hypoglycaemia', fullName: 'Ketotic Hypoglycaemia of Childhood', pattern: 'D',
    match(v) {
      const d = derive(v);
      if (!d.hypoglycemia || !d.highKetones || d.elevatedLac) return null;
      return { likelihood: 'high', reason: `Hypoglycaemia (${v.glucose} mg/dL) with appropriate ketosis — most common cause of hypoglycaemia in children aged 1–6 years; diagnosis of exclusion` };
    },
    distinguishing: [
      'Appropriate ketosis (normal physiological response to hypoglycaemia)',
      'Triggered by illness, vomiting, or prolonged fasting',
      'Normal lactate, normal ammonia, suppressed insulin (< 2 mIU/L)',
      'Normal acylcarnitine profile and amino acids',
      'Resolves spontaneously by age 8–9 years',
      'MUST exclude other causes on first presentation',
    ],
    investigations: [
      { text: 'Critical sample: insulin (should be suppressed < 2 mIU/L), cortisol, GH, ketones, FFA', urgent: true },
      { text: 'Insulin — must be appropriately suppressed to diagnose ketotic hypoglycaemia', urgent: true },
      { text: 'Acylcarnitine profile — normal (excludes FAO defect)', urgent: false },
      { text: 'Urine organic acids + plasma amino acids — normal', urgent: false },
    ],
    management: [
      { type: 'emergency', text: 'Oral glucose if alert and tolerating feeds', dose: 'Juice / glucose gel / sweet drink — fastest correction if tolerated' },
      { type: 'emergency', text: 'IV glucose if impaired consciousness or not tolerating orally', dose: '2 mL/kg 10% dextrose IV push, then GIR 4–6 mg/kg/min until feeding established' },
      { type: 'urgent', text: 'Identify and treat precipitating illness' },
      { type: 'urgent', text: 'Sick-day plan', note: 'Frequent glucose-containing drinks; early IV glucose if unable to feed for > 4–6 h' },
    ],
  },

  {
    id: 'gsd1', name: 'GSD Type 1 (Von Gierke)', fullName: 'Glycogen Storage Disease Type 1a / 1b (G6Pase Deficiency)', pattern: 'D',
    match(v) {
      const d = derive(v);
      if (!d.hypoglycemia) return null;
      if (d.elevatedLac) return { likelihood: 'high', reason: `Hypoglycaemia + elevated lactate (${v.lactate} mmol/L) — lactic acidosis with hypoglycaemia is the hallmark of GSD Type 1 (glucose-6-phosphatase deficiency)` };
      return { likelihood: 'consider', reason: 'Hypoglycaemia — consider GSD1 if hepatomegaly present or lactate becomes elevated' };
    },
    distinguishing: [
      'Severe fasting hypoglycaemia + LACTIC ACIDOSIS — hallmark combination',
      'Massive hepatomegaly (smooth, firm — glycogen and fat accumulation)',
      'Ketones may be absent or low despite hypoglycaemia (G6Pase also needed for FAO)',
      'Hypertriglyceridaemia and hyperuricaemia (gouty attacks later in life)',
      'Type 1b: neutropenia and recurrent infections — inflammatory bowel disease',
      'Doll-like facies, short stature, enlarged kidneys',
    ],
    investigations: [
      { text: 'Lactate — elevated; hallmark of GSD1 (measure before and after glucose bolus)', urgent: true },
      { text: 'Uric acid — elevated (hyperuricaemia)', urgent: false },
      { text: 'Triglycerides — markedly elevated', urgent: false },
      { text: 'Neutrophil count — neutropenia in Type 1b', urgent: true },
      { text: 'Liver USS — massive hepatomegaly', urgent: false },
      { text: 'G6PC (1a) or SLC37A4 (1b) gene sequencing', urgent: false },
    ],
    management: [
      { type: 'emergency', text: 'Continuous IV glucose — no interruption', dose: 'Target blood glucose 72–108 mg/dL; GIR 6–8 mg/kg/min — even brief interruption causes severe hypoglycaemia' },
      { type: 'urgent', text: 'Avoid lactate-containing IV fluids', note: 'Do NOT use Hartmann\'s or Ringer\'s lactate — lactate cannot be cleared in GSD1; use NS or dextrose-saline' },
      { type: 'urgent', text: 'Monitor lactate — may transiently worsen with glucose bolus before improving' },
      { type: 'specialist', text: 'Long-term: uncooked cornstarch; G-CSF for Type 1b neutropenia; gene therapy emerging' },
    ],
  },
];

// ─── Pattern detection ─────────────────────────────────────────────────────────

type PatternId = 'A' | 'B' | 'C' | 'D' | 'mixed' | 'insufficient';

const PATTERNS: Record<PatternId, { label: string; description: string; accent: string; headerBg: string; headerText: string }> = {
  A:           { label: 'Pattern A — Urea Cycle Disorder',         description: 'Hyperammonemia + no/mild acidosis + absent/low ketones',          accent: 'border-l-red-500',              headerBg: 'bg-red-50',    headerText: 'text-red-800'    },
  B:           { label: 'Pattern B — Organic Acidemia / MSUD',     description: 'Metabolic acidosis + elevated ketones ± hyperammonemia',          accent: 'border-l-orange-500',           headerBg: 'bg-orange-50', headerText: 'text-orange-800' },
  C:           { label: 'Pattern C — FAO Defect / Hyperinsulinism',description: 'Hypoglycaemia + absent or inappropriately low ketones',           accent: 'border-l-amber-500',            headerBg: 'bg-amber-50',  headerText: 'text-amber-800'  },
  D:           { label: 'Pattern D — Ketotic Hypoglycaemia / GSD', description: 'Hypoglycaemia + appropriate ketosis',                             accent: 'border-l-blue-500',             headerBg: 'bg-blue-50',   headerText: 'text-blue-800'   },
  mixed:       { label: 'Mixed / Overlapping Pattern',             description: 'Multiple abnormalities — specialist input required',              accent: 'border-l-purple-500',           headerBg: 'bg-purple-50', headerText: 'text-purple-800' },
  insufficient:{ label: 'Awaiting Values',                         description: 'Enter lab values and symptoms to detect a metabolic pattern',     accent: 'border-l-muted-foreground/20',  headerBg: 'bg-muted/30',  headerText: 'text-muted-foreground' },
};

function detectOverallPattern(v: Vals): PatternId {
  const d = derive(v);
  if (!d.hasG && !d.hasPH && !d.hasNH3 && !d.hasHCO) return 'insufficient';
  const isA = d.hyperNH3 && !d.acidosis && d.lowKetones;
  const isB = d.acidosis && d.highKetones;
  const isC = d.hypoglycemia && d.lowKetones && !d.acidosis;
  const isD = d.hypoglycemia && d.highKetones;
  const count = [isA, isB, isC, isD].filter(Boolean).length;
  if (count > 1) return 'mixed';
  if (isA) return 'A'; if (isB) return 'B'; if (isC) return 'C'; if (isD) return 'D';
  if (d.hyperNH3 || d.acidosis || d.hypoglycemia) return 'mixed';
  return 'insufficient';
}

function computeRankedDDx(v: Vals) {
  const order: Record<Likelihood, number> = { high: 0, moderate: 1, consider: 2 };
  return DDX_DB
    .map(dx => { const m = dx.match(v); return m ? { dx, ...m } : null; })
    .filter(Boolean)
    .sort((a, b) => order[a!.likelihood] - order[b!.likelihood]) as { dx: DxEntry; likelihood: Likelihood; reason: string }[];
}

function getIcuCriteria(v: Vals): string[] {
  const d = derive(v);
  const out: string[] = [];
  if (v.symptoms.has('encephalopathy')) out.push('Altered consciousness / encephalopathy');
  if (v.symptoms.has('seizures'))        out.push('Active or recent seizures');
  if (v.symptoms.has('shock'))           out.push('Haemodynamic instability / shock');
  if (d.hasNH3 && d.nh3 > 150)          out.push(`Hyperammonemia — ${v.ammonia} μmol/L`);
  if (d.hasPH  && d.ph  < 7.2)          out.push(`Severe metabolic acidosis — pH ${v.ph}`);
  if (d.hasG   && d.g   < 45)           out.push(`Severe hypoglycaemia — ${v.glucose} mg/dL`);
  if (d.hasLac && d.lac > 5)            out.push(`Elevated lactate — ${v.lactate} mmol/L`);
  if (d.hasHCO && d.hco < 10)           out.push(`Severely low bicarbonate — ${v.bicarb} mEq/L`);
  if (d.neonate)                         out.push('Neonate with suspected metabolic crisis');
  return out;
}

// GIR: Rate(mL/hr) = GIR × weight × 60 / (conc% × 10)
function girRate(gir: number, wt: number, concPct: number) {
  return (gir * wt * 60) / (concPct * 10);
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

function LabField({ label, value, onChange, unit, placeholder, interpret }: {
  label: string; value: string; onChange: (v: string) => void;
  unit?: string; placeholder?: string;
  interpret?: (n: number) => Interp;
}) {
  const num = parseFloat(value);
  const interp = interpret && !isNaN(num) ? interpret(num) : null;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between min-h-[20px]">
        <label className="text-xs font-semibold text-foreground">{label}</label>
        {interp && <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded border', interp.cls)}>{interp.label}</span>}
      </div>
      <div className="relative">
        <Input type="number" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
          className={cn('text-sm', unit ? 'pr-16' : '')} />
        {unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground pointer-events-none">{unit}</span>}
      </div>
    </div>
  );
}

const LH_STYLES: Record<Likelihood, { badge: string; border: string; dot: string }> = {
  high:     { badge: 'bg-red-100 text-red-700 border-red-300',      border: 'border-l-red-400',    dot: 'bg-red-500'    },
  moderate: { badge: 'bg-amber-100 text-amber-700 border-amber-300', border: 'border-l-amber-400',  dot: 'bg-amber-500'  },
  consider: { badge: 'bg-slate-100 text-slate-600 border-slate-300', border: 'border-l-slate-300',  dot: 'bg-slate-400'  },
};

const MGMT_STYLES: Record<MgmtType, { row: string; dot: string; tag: string; tagText: string }> = {
  emergency: { row: 'bg-red-50 border-red-100',      dot: 'bg-red-500',    tag: 'text-red-700',    tagText: 'EMERGENCY' },
  urgent:    { row: 'bg-amber-50 border-amber-100',  dot: 'bg-amber-500',  tag: 'text-amber-700',  tagText: 'URGENT'    },
  consider:  { row: 'bg-blue-50 border-blue-100',    dot: 'bg-blue-400',   tag: 'text-blue-700',   tagText: 'CONSIDER'  },
  specialist:{ row: 'bg-purple-50 border-purple-100',dot: 'bg-purple-500', tag: 'text-purple-700', tagText: 'SPECIALIST'},
};

function DiagnosisCard({ dx, likelihood, reason, isOpen, onToggle }: {
  dx: DxEntry; likelihood: Likelihood; reason: string; isOpen: boolean; onToggle: () => void;
}) {
  const s = LH_STYLES[likelihood];
  return (
    <div className={cn('border-l-4 border rounded-lg overflow-hidden', s.border)}>
      <button type="button" onClick={onToggle}
        className="w-full flex items-start justify-between p-3 text-left hover:bg-muted/30 transition-colors gap-2">
        <div className="flex items-start gap-2.5 min-w-0">
          <span className={cn('w-2 h-2 rounded-full shrink-0 mt-1.5', s.dot)} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm">{dx.name}</span>
              <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0', s.badge)}>
                {likelihood.toUpperCase()}
              </span>
              <span className="text-[10px] text-muted-foreground border border-dashed rounded px-1.5 py-0.5 shrink-0">
                Pattern {dx.pattern}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{reason}</p>
          </div>
        </div>
        {isOpen
          ? <ChevronDown    className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          : <ChevronRight   className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        }
      </button>
      {isOpen && (
        <div className="border-t bg-card px-3 pb-3 pt-2.5 space-y-3">

          {/* Distinguishing */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Distinguishing Features</p>
            <ul className="space-y-1">
              {dx.distinguishing.map((d, i) => (
                <li key={i} className="text-xs flex items-start gap-1.5">
                  <span className="text-primary shrink-0 mt-0.5">•</span><span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Investigations */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Key Investigations to Order</p>
            <ul className="space-y-1.5">
              {dx.investigations.map((inv, i) => (
                <li key={i} className="text-xs flex items-start gap-2">
                  <FlaskConical className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                  <span className="flex-1">{inv.text}</span>
                  {inv.urgent && <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-200 rounded px-1 py-0.5 shrink-0">URGENT</span>}
                </li>
              ))}
            </ul>
          </div>

          {/* Management */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Management with Doses</p>
            <div className="space-y-1.5">
              {dx.management.map((m, i) => {
                const ms = MGMT_STYLES[m.type];
                return (
                  <div key={i} className={cn('rounded-md p-2 border text-xs', ms.row)}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', ms.dot)} />
                      <span className={cn('text-[9px] font-bold', ms.tag)}>{ms.tagText}</span>
                    </div>
                    <p className="font-medium leading-snug">{m.text}</p>
                    {m.dose && <p className="text-muted-foreground mt-0.5 leading-snug italic">{m.dose}</p>}
                    {m.note && <p className="text-muted-foreground mt-0.5 leading-snug">Note: {m.note}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CollapsibleSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-lg overflow-hidden">
      <button type="button" onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors text-left no-print">
        <span className="flex items-center gap-2 font-semibold text-sm">
          <Icon className="h-4 w-4 text-primary shrink-0" />{title}
        </span>
        <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform duration-200', open && 'rotate-180')} />
      </button>
      {open && <div className="border-t px-4 pb-4 pt-3">{children}</div>}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

const SYMPTOM_CHIPS = [
  { id: 'encephalopathy', label: 'Encephalopathy / ↓ Consciousness' },
  { id: 'seizures',       label: 'Seizures'                          },
  { id: 'vomiting',       label: 'Vomiting / Poor Feeding'           },
  { id: 'shock',          label: 'Shock / Dehydration'               },
  { id: 'odour',          label: 'Unusual Odour'                     },
  { id: 'family_hx',      label: 'Family Hx / Consanguinity'         },
];

export default function MetabolicCrisisPage() {
  const [symptoms,  setSymptoms]  = useState<Set<string>>(new Set());
  const [ageGroup,  setAgeGroup]  = useState('');
  const [weight,    setWeight]    = useState('');
  const [girTarget, setGirTarget] = useState('8');
  const [glucose,   setGlucose]   = useState('');
  const [ph,        setPh]        = useState('');
  const [bicarb,    setBicarb]    = useState('');
  const [lactate,   setLactate]   = useState('');
  const [ammonia,   setAmmonia]   = useState('');
  const [ketones,   setKetones]   = useState('');
  const [ck,        setCk]        = useState('');
  const [openCards, setOpenCards] = useState<Set<string>>(new Set());

  const toggleSym  = (id: string) => setSymptoms( p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleCard = (id: string) => setOpenCards(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const vals: Vals = useMemo(() => ({ symptoms, ageGroup, weight, glucose, ph, bicarb, lactate, ammonia, ketones, ck }),
    [symptoms, ageGroup, weight, glucose, ph, bicarb, lactate, ammonia, ketones, ck]);

  const patternId    = useMemo(() => detectOverallPattern(vals), [vals]);
  const rankedDDx    = useMemo(() => computeRankedDDx(vals),    [vals]);
  const icuCriteria  = useMemo(() => getIcuCriteria(vals),       [vals]);
  const pattern      = PATTERNS[patternId];

  const gir = useMemo(() => {
    const g = parseFloat(girTarget), w = parseFloat(weight);
    if (isNaN(g) || isNaN(w) || w <= 0 || g <= 0) return null;
    return { d10: girRate(g, w, 10), d125: girRate(g, w, 12.5), d15: girRate(g, w, 15) };
  }, [girTarget, weight]);

  const filledCount = [glucose, ph, bicarb, lactate, ammonia, ck, ageGroup, ketones].filter(v => v !== '').length + symptoms.size;

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-10">

      {/* Disclaimer */}
      <div className="rounded-lg bg-red-600 text-white px-4 py-3 flex items-start gap-3 shadow no-print">
        <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
        <p className="text-sm font-medium leading-snug">
          <strong>Clinical decision support only.</strong> Do not delay emergency treatment.
          Discuss urgently with a <strong>metabolic specialist / PICU / tertiary centre</strong>.
        </p>
      </div>
      <div className="hidden print:flex rounded-lg border-2 border-red-600 text-red-700 px-4 py-3 items-start gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
        <p className="text-sm font-semibold">CLINICAL SUPPORT ONLY — Do not delay emergency treatment. Discuss urgently with metabolic specialist / PICU / tertiary centre.</p>
      </div>

      {/* Header */}
      <div className="flex items-start gap-3 pb-3 border-b border-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-100 border border-red-200 shrink-0 mt-0.5">
          <Zap className="h-4 w-4 text-red-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold font-headline">Suspected Metabolic Crisis</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Enter symptoms and lab values to get a ranked differential diagnosis, targeted investigations, and management with specific dosing.
          </p>
        </div>
        <span className="shrink-0 text-[10px] font-semibold text-red-700/70 bg-red-50 border border-red-200 rounded px-2 py-1 tracking-wide uppercase hidden sm:block">
          Metabolic Diseases
        </span>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-5">

        {/* ── LEFT: Inputs ──────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Symptom chips */}
          <Card className="overflow-hidden">
            <CardHeader className="py-2.5 px-4 bg-muted/30 border-b">
              <CardTitle className="text-sm font-semibold">Presenting Features — tap to select</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-3 pb-3">
              <div className="flex flex-wrap gap-2">
                {SYMPTOM_CHIPS.map(({ id, label }) => {
                  const active = symptoms.has(id);
                  return (
                    <button key={id} type="button" onClick={() => toggleSym(id)}
                      className={cn(
                        'text-xs font-medium px-3 py-1.5 rounded-full border transition-all',
                        active
                          ? 'bg-red-600 text-white border-red-600 shadow-sm'
                          : 'bg-background border-border text-muted-foreground hover:border-red-300 hover:text-red-700',
                      )}>
                      {label}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Patient */}
          <Card className="overflow-hidden">
            <CardHeader className="py-2.5 px-4 bg-muted/30 border-b">
              <CardTitle className="text-sm font-semibold">Patient</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-3 pb-3 grid grid-cols-2 gap-3">
              <div className="space-y-1 col-span-1">
                <label className="text-xs font-semibold">Age Group</label>
                <Select onValueChange={setAgeGroup} value={ageGroup}>
                  <SelectTrigger className="text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neonate">Neonate (0–28 d)</SelectItem>
                    <SelectItem value="infant">Infant (1–12 mo)</SelectItem>
                    <SelectItem value="child">Child (&gt;1 yr)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 col-span-1">
                <label className="text-xs font-semibold">Weight</label>
                <div className="relative">
                  <Input type="number" placeholder="e.g. 8" value={weight} onChange={e => setWeight(e.target.value)} className="pr-8 text-sm" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">kg</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lab inputs */}
          <Card className="overflow-hidden">
            <CardHeader className="py-2.5 px-4 bg-muted/30 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Laboratory Results</CardTitle>
                {filledCount > 0 && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {filledCount} entered
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="px-4 pt-3 pb-3 space-y-3">
              <LabField label="Blood Glucose"          value={glucose}  onChange={setGlucose}  unit="mg/dL"  placeholder="e.g. 50"   interpret={interpGlucose}  />
              <LabField label="pH (VBG / ABG)"         value={ph}       onChange={setPh}       placeholder="e.g. 7.15"               interpret={interpPH}       />
              <LabField label="Bicarbonate (HCO₃)"     value={bicarb}   onChange={setBicarb}   unit="mEq/L"  placeholder="e.g. 10"   interpret={interpBicarb}   />
              <LabField label="Lactate"                value={lactate}  onChange={setLactate}  unit="mmol/L" placeholder="e.g. 6.0"  interpret={interpLactate}  />
              <LabField label="Ammonia (sent on ice)"  value={ammonia}  onChange={setAmmonia}  unit="μmol/L" placeholder="e.g. 250"  interpret={interpAmmonia}  />
              <LabField label="CK (if FAO / rhabdo suspected)" value={ck} onChange={setCk}    unit="U/L"    placeholder="e.g. 5000" interpret={interpCK}       />

              {/* Urine ketones */}
              <div className="space-y-1">
                <label className="text-xs font-semibold">Urine Ketones</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { value: 'none',     label: 'Neg',  hi: false },
                    { value: 'trace',    label: '+',    hi: false },
                    { value: 'moderate', label: '++',   hi: true  },
                    { value: 'large',    label: '+++',  hi: true  },
                  ].map(({ value, label, hi }) => {
                    const sel = ketones === value;
                    return (
                      <button key={value} type="button"
                        onClick={() => setKetones(v => v === value ? '' : value)}
                        className={cn(
                          'text-xs font-semibold py-2 rounded-lg border transition-all',
                          sel && hi  ? 'bg-amber-500 text-white border-amber-500' :
                          sel        ? 'bg-green-600 text-white border-green-600' :
                                       'border-border text-muted-foreground hover:border-primary/40',
                        )}>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GIR Calculator */}
          <Card className="overflow-hidden">
            <CardHeader className="py-2.5 px-4 bg-primary/5 border-b">
              <CardTitle className="text-sm font-semibold text-primary flex items-center gap-2">
                <Calculator className="h-4 w-4" /> GIR Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-3 pb-3 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Target GIR</label>
                  <div className="relative">
                    <Input type="number" value={girTarget} onChange={e => setGirTarget(e.target.value)} className="pr-20 text-sm" />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">mg/kg/min</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Weight (uses patient weight)</label>
                  <div className="relative">
                    <Input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="kg" className="pr-8 text-sm" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">kg</span>
                  </div>
                </div>
              </div>
              {gir ? (
                <div className="rounded-lg bg-primary/5 border border-primary/15 p-3 space-y-2">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wide">Infusion Rates for GIR {girTarget} mg/kg/min ({weight} kg)</p>
                  {[
                    { conc: '10%',   rate: gir.d10,  note: 'Peripheral line OK'        },
                    { conc: '12.5%', rate: gir.d125, note: 'Peripheral line borderline' },
                    { conc: '15%',   rate: gir.d15,  note: 'Central line preferred'     },
                  ].map(({ conc, rate, note }) => (
                    <div key={conc} className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Dextrose {conc}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold tabular-nums">{rate.toFixed(1)} mL/hr</span>
                        <span className="text-[10px] text-muted-foreground ml-1.5">({note})</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-1">Enter weight and target GIR above to calculate infusion rates</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── RIGHT: Results ───────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Pattern banner */}
          <Card className={cn('border-l-4 overflow-hidden', pattern.accent)}>
            <CardHeader className={cn('py-3 px-4 border-b', pattern.headerBg)}>
              <CardTitle className={cn('text-sm font-bold flex items-center gap-2', pattern.headerText)}>
                <Brain className="h-4 w-4 shrink-0" />{pattern.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-2.5 pb-2.5">
              <p className="text-sm text-muted-foreground">{pattern.description}</p>
            </CardContent>
          </Card>

          {/* Escalation */}
          <Card className={cn('border-l-4 overflow-hidden', icuCriteria.length > 0 ? 'border-l-red-500' : 'border-l-emerald-400')}>
            <CardHeader className={cn('py-3 px-4 border-b', icuCriteria.length > 0 ? 'bg-red-50' : 'bg-emerald-50')}>
              <CardTitle className={cn('text-sm font-bold flex items-center gap-2 uppercase tracking-wide', icuCriteria.length > 0 ? 'text-red-700' : 'text-emerald-700')}>
                <Ambulance className="h-4 w-4" />
                {icuCriteria.length > 0 ? `${icuCriteria.length} ICU / Escalation Criteria Met` : 'Escalation Criteria — None Triggered'}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-2.5 pb-2.5">
              {icuCriteria.length > 0 ? (
                <div className="space-y-1.5">
                  {icuCriteria.map((c, i) => (
                    <p key={i} className="flex items-start gap-2 text-sm">
                      <TriangleAlert className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />{c}
                    </p>
                  ))}
                  <p className="text-xs font-bold text-red-700 mt-2 pt-2 border-t border-red-100">
                    → Urgent PICU discussion and tertiary centre notification required now
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No escalation criteria currently triggered. Criteria: encephalopathy, seizures, shock, ammonia &gt;150, pH &lt;7.2, glucose &lt;2.5, lactate &gt;5, bicarbonate &lt;10, neonate.
                </p>
              )}
            </CardContent>
          </Card>

          {/* DDx */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-sm flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Differential Diagnosis
                {rankedDDx.length > 0 && (
                  <span className="text-xs font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                    {rankedDDx.length} match{rankedDDx.length !== 1 ? 'es' : ''}
                  </span>
                )}
              </h2>
              {rankedDDx.length > 0 && (
                <div className="flex gap-2">
                  <button type="button" onClick={() => setOpenCards(new Set(rankedDDx.map(r => r.dx.id)))}
                    className="text-xs text-primary hover:underline">Expand all</button>
                  <span className="text-muted-foreground text-xs">·</span>
                  <button type="button" onClick={() => setOpenCards(new Set())}
                    className="text-xs text-muted-foreground hover:underline">Collapse</button>
                </div>
              )}
            </div>

            {rankedDDx.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                <Brain className="h-10 w-10 mx-auto mb-3 opacity-15" />
                <p className="text-sm font-medium">Enter symptoms and lab values</p>
                <p className="text-xs mt-1 opacity-70">Differential diagnoses will appear here as you enter data</p>
              </div>
            ) : (
              <div className="space-y-2">
                {rankedDDx.map(({ dx, likelihood, reason }) => (
                  <DiagnosisCard
                    key={dx.id} dx={dx} likelihood={likelihood} reason={reason}
                    isOpen={openCards.has(dx.id)} onToggle={() => toggleCard(dx.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* General actions */}
          <Card className="border-l-4 border-l-primary overflow-hidden">
            <CardHeader className="py-3 px-4 bg-primary/5 border-b">
              <CardTitle className="text-sm font-bold text-primary flex items-center gap-2 uppercase tracking-wide">
                <ClipboardList className="h-4 w-4" /> Immediate Actions — All Suspected Cases
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-3 pb-3">
              <ul className="space-y-1.5">
                {[
                  'Do NOT wait for a diagnosis — start emergency management immediately',
                  'ABCDE: airway, breathing, oxygen, IV access, treat shock',
                  'Check and correct blood glucose immediately',
                  'Treat seizures per local protocol',
                  'Give antibiotics if sepsis cannot be excluded',
                  'STOP protein intake if metabolic intoxication disease suspected',
                  'Save samples before treatment where possible (plasma, urine, DBS)',
                  'Strict fluid input/output monitoring; frequent neurological observations',
                  'Monitor for cerebral oedema',
                ].map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary font-bold shrink-0 mt-0.5">•</span>{a}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom accordions */}
      <div className="space-y-2">
        <CollapsibleSection title="ABCDE Emergency Assessment" icon={Activity}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { letter: 'A', title: 'Airway',      items: ['Assess and secure airway', 'Position appropriately', 'Suction if needed'] },
              { letter: 'B', title: 'Breathing',   items: ['RR and respiratory effort', 'Oxygen as indicated', 'Ventilatory support if needed'] },
              { letter: 'C', title: 'Circulation', items: ['IV / IO access', 'Isotonic fluid bolus for shock', 'Cardiac monitoring'] },
              { letter: 'D', title: 'Disability',  items: ['GCS / AVPU', 'Pupils', 'Bedside glucose — treat immediately', 'Treat seizures'] },
              { letter: 'E', title: 'Exposure',    items: ['Hydration / perfusion', 'Hepatomegaly?', 'Unusual odour?', 'Infection signs'] },
            ].map(({ letter, title, items }) => (
              <div key={letter} className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0">{letter}</span>
                  <span className="font-semibold text-sm">{title}</span>
                </div>
                <ul className="space-y-1">
                  {items.map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-primary shrink-0">•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Admission / ICU Criteria & Transfer Checklist" icon={Ambulance}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-xs font-bold text-red-700 uppercase tracking-wide mb-2">Admit to PICU if any of:</p>
              <ul className="space-y-1">
                {['Altered consciousness / encephalopathy', 'Seizures', 'Hyperammonemia > 150 μmol/L', 'Severe metabolic acidosis', 'Persistent / severe hypoglycaemia', 'Shock / haemodynamic instability', 'Respiratory failure or need for ventilation', 'Rising or very high lactate', 'Suspected cerebral oedema', 'Need for dialysis', 'Any neonate with suspected metabolic crisis'].map((c, i) => (
                  <li key={i} className="text-xs flex items-start gap-2"><TriangleAlert className="h-3 w-3 text-red-500 shrink-0 mt-0.5" />{c}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">Before Transfer — Stabilise and Check:</p>
              <ul className="space-y-1">
                {['Stabilise A B C D before transport', 'Continue glucose infusion during transport — no interruption', 'Recheck glucose, ammonia, gas, and lactate before departure', 'Send frozen serum + urine with patient', 'Guthrie card (DBS) at room temperature', 'CSF frozen if LP performed', 'Clear handover: all results and treatments given'].map((c, i) => (
                  <li key={i} className="text-xs flex items-start gap-2"><CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0 mt-0.5" />{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </CollapsibleSection>
      </div>

      {/* Print */}
      <div className="no-print pt-2">
        <Button variant="outline" className="w-full" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" /> Print Protocol Summary
        </Button>
      </div>
    </div>
  );
}
