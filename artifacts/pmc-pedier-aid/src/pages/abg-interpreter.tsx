import { useState, useMemo } from "react";
import {
  Activity, Calculator, Info,
  ArrowLeft, CheckCircle2, AlertTriangle, FlaskConical, Wind, Stethoscope, AlertCircle, Baby, Siren
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

/**
 * Compensation formulas: DuBose TD Jr. "Acid-Base Disorders" in Brenner & Rector's
 * The Kidney (Boston rules). Acute vs chronic respiratory compensation bounds per
 * Narins RG, Emmett M. Medicine. 1980;59(3):161-187.
 * Winters' formula (metabolic acidosis): Albert MS, Dell RB, Winters RW. Ann Intern
 * Med. 1967;66(2):312-322.
 * Metabolic alkalosis compensation: Javaheri S, Kazemi H. Chest. 1987;91(6):857-863.
 * Anion gap / albumin correction / delta ratio: Figge J, et al. Crit Care Med.
 * 1998;26(11):1807-1810; Emmett M, Narins RG. Medicine. 1977;56(1):38-54.
 * Neonatal renal bicarbonate threshold (~19-22 mEq/L): Nelson Textbook of
 * Pediatrics, 21st-22nd ed., Fluid & Electrolyte / Neonatology chapters.
 * Permissive hypercapnia in ventilated neonates: Cools F, et al. Cochrane
 * Database Syst Rev. 2013(4):CD002061.
 */

type Population = "standard" | "neonate";
type PathologyType = "Simple" | "Compensated" | "Mixed";

const NORMAL_AG = 12;

function deltaDeltaInterpret(ratio: number) {
  if (ratio < 0.4) return {
    label: "< 0.4 — Hyperchloraemic (Non-Anion Gap) Component",
    meaning: "The bicarbonate drop is disproportionately large relative to the anion gap rise — a concurrent normal-anion-gap acidosis is present alongside the anion gap acidosis.",
    color: "text-blue-700",
  };
  if (ratio < 1.0) return {
    label: "0.4-1.0 — Mixed Anion Gap / Non-Anion Gap Acidosis",
    meaning: "Both anion gap and non-anion gap processes are contributing. Bicarbonate is lower than expected for the degree of anion gap elevation.",
    color: "text-orange-700",
  };
  if (ratio <= 2.0) return {
    label: "1.0-2.0 — Pure Anion Gap Metabolic Acidosis",
    meaning: "Isolated anion gap metabolic acidosis with an appropriate bicarbonate drop.",
    color: "text-emerald-700",
  };
  return {
    label: "> 2.0 — Concurrent Metabolic Alkalosis (or Pre-Existing Chronic Respiratory Acidosis)",
    meaning: "Bicarbonate is higher than expected for the anion gap rise — a co-existing metabolic alkalosis (e.g. vomiting) is masking the true bicarbonate deficit.",
    color: "text-purple-700",
  };
}

function plausibilityWarnings(ph: number, pco2: number, hco3: number): string[] {
  const warnings: string[] = [];
  if (ph < 6.8 || ph > 7.8) warnings.push(`pH ${ph} is outside a physiologically survivable range — check for a data-entry or units error before trusting this interpretation.`);
  if (pco2 < 10 || pco2 > 150) warnings.push(`pCO₂ ${pco2} mmHg is outside a plausible range — check for a data-entry or units error.`);
  if (hco3 < 2 || hco3 > 50) warnings.push(`HCO₃⁻ ${hco3} mEq/L is outside a plausible range — check for a data-entry or units error.`);
  return warnings;
}

function phSeverityBand(ph: number): { label: string; action: string; urgent: boolean } | null {
  if (ph < 7.10) return { label: "Severe acidaemia", action: "Consider bicarbonate therapy, urgent airway/ventilatory support, and emergent treatment of the underlying cause.", urgent: true };
  if (ph < 7.20) return { label: "Moderate-severe acidaemia", action: "Close monitoring; treat the underlying cause urgently.", urgent: true };
  if (ph < 7.35) return { label: "Mild acidaemia", action: "Treat the underlying cause; reassess trend.", urgent: false };
  if (ph > 7.60) return { label: "Severe alkalaemia", action: "Risk of arrhythmia and lowered seizure threshold — treat the underlying cause urgently and correct hypokalaemia/hypochloraemia.", urgent: true };
  if (ph > 7.50) return { label: "Moderate alkalaemia", action: "Treat the underlying cause; monitor potassium.", urgent: false };
  if (ph > 7.45) return { label: "Mild alkalaemia", action: "Treat the underlying cause; reassess trend.", urgent: false };
  return null;
}

function extremeGasWarnings(pco2: number, hco3: number): string[] {
  const warn: string[] = [];
  if (pco2 > 60) warn.push("pCO₂ > 60 mmHg — severe hypercapnia; risk of respiratory failure, consider ventilatory support.");
  if (pco2 < 20) warn.push("pCO₂ < 20 mmHg — severe hypocapnia.");
  if (hco3 < 10) warn.push("HCO₃⁻ < 10 mEq/L — severe metabolic acidosis; risk of haemodynamic instability.");
  return warn;
}

const ACUTE_RESP_ACIDOSIS_CAUSES = ["Upper airway obstruction (croup, foreign body aspiration)", "Severe asthma exacerbation", "Opioid/sedative overdose", "Acute neuromuscular weakness (Guillain-Barré, myasthenic crisis)", "Severe pneumonia / ARDS"];
const CHRONIC_RESP_ACIDOSIS_CAUSES = ["Chronic lung disease / bronchopulmonary dysplasia", "Duchenne or other chronic neuromuscular disease", "Severe obstructive sleep apnoea / obesity hypoventilation", "Restrictive chest wall deformity (severe scoliosis)", "Advanced cystic fibrosis"];

interface ABGResult {
  primary: string;
  pathologyType: PathologyType;
  compensationStatus: string;
  compensationDetail: string;
  differentials: string[];
  color: string;
  bg: string;
  populationNote?: string;
  clinicalNote?: string;
}

function computeInterpretation(
  phNum: number, pco2Num: number, hco3Num: number,
  effectiveAG: number | null, deltaRatio: number | null,
  baselineHCO3: number, population: Population,
): ABGResult {
  let primary = "";
  let pathologyType: PathologyType = "Simple";
  let compensationStatus = "";
  let compensationDetail = "";
  let differentials: string[] = [];
  let color = "text-primary";
  let bg = "bg-primary/5";
  let populationNote: string | undefined;
  let clinicalNote: string | undefined;

  const baselinePCO2 = 40;
  const isAcidemia = phNum < 7.35;
  const isAlkalemia = phNum > 7.45;

  if (isAcidemia) {
    if (pco2Num > 45) {
      primary = "Respiratory Acidosis";
      color = "text-red-700"; bg = "bg-red-50";

      const deltaPCO2 = pco2Num - baselinePCO2;
      const acuteExpected = baselineHCO3 + 0.1 * deltaPCO2;
      const chronicExpected = baselineHCO3 + 0.35 * deltaPCO2;
      const acuteLow = acuteExpected - 3, acuteHigh = acuteExpected + 3;
      const chronicHigh = chronicExpected + 3;

      compensationDetail = `Acute-compensation range ${acuteLow.toFixed(0)}-${acuteHigh.toFixed(0)} mEq/L, chronic-compensation ceiling ~${chronicHigh.toFixed(0)} mEq/L (measured HCO₃⁻ ${hco3Num}).`;

      if (hco3Num >= acuteLow && hco3Num <= acuteHigh) {
        pathologyType = "Simple";
        compensationStatus = "Acute (uncompensated) respiratory acidosis";
        differentials.push(...ACUTE_RESP_ACIDOSIS_CAUSES);
      } else if (hco3Num > acuteHigh && hco3Num <= chronicHigh) {
        pathologyType = "Compensated";
        compensationStatus = "Partially compensated — consistent with a chronic process";
        differentials.push(...CHRONIC_RESP_ACIDOSIS_CAUSES);
      } else if (hco3Num > chronicHigh) {
        pathologyType = "Mixed";
        compensationStatus = "HCO₃⁻ exceeds even the chronic-compensation ceiling — mixed respiratory acidosis + metabolic alkalosis";
        differentials.push("Chronic lung disease with superimposed diuretic use", "Post-hypercapnic bicarbonate overshoot (e.g. after starting NIV)", "Concurrent vomiting / NG losses", ...CHRONIC_RESP_ACIDOSIS_CAUSES);
      } else {
        pathologyType = "Mixed";
        compensationStatus = "HCO₃⁻ lower than expected even for acute compensation — mixed respiratory & metabolic acidosis";
        differentials.push("Concurrent shock/sepsis (lactic acidosis)", "Renal failure", ...ACUTE_RESP_ACIDOSIS_CAUSES);
      }

      if (population === "neonate") {
        populationNote = "Permissive hypercapnia (pCO₂ up to ~55-65 mmHg with pH ≥ 7.20-7.25) is an accepted ventilation strategy in preterm/ventilated neonates to reduce ventilator-induced lung injury (Cools et al., Cochrane 2013) — interpret in the context of the ventilation strategy, not as an isolated abnormality.";
      }
    } else {
      primary = "Metabolic Acidosis";
      color = "text-red-700"; bg = "bg-red-50";

      const expectedPco2 = 1.5 * hco3Num + 8;
      compensationDetail = `Winters' formula expects pCO₂ ${(expectedPco2 - 2).toFixed(0)}-${(expectedPco2 + 2).toFixed(0)} mmHg (measured ${pco2Num}).`;

      if (pco2Num < expectedPco2 - 2) {
        pathologyType = "Mixed";
        compensationStatus = "Mixed metabolic acidosis & respiratory alkalosis (pCO₂ lower than Winters' predicts)";
        differentials.push("Salicylate poisoning", "Sepsis with early ARDS/hyperventilation");
      } else if (pco2Num > expectedPco2 + 2) {
        pathologyType = "Mixed";
        compensationStatus = "Mixed metabolic & respiratory acidosis (pCO₂ higher than Winters' predicts)";
        differentials.push("Cardiac arrest / severe shock with respiratory exhaustion", "Severe pulmonary oedema", "Concurrent primary lung disease limiting compensation");
      } else {
        pathologyType = "Compensated";
        compensationStatus = "Appropriate respiratory compensation (Winters' formula)";
      }

      if (effectiveAG !== null && effectiveAG > NORMAL_AG) {
        differentials.push("DKA", "Uraemia", "Lactic acidosis (shock)", "Toxic ingestion (methanol, ethylene glycol, salicylate, iron)");
        if (deltaRatio !== null) {
          const dd = deltaDeltaInterpret(deltaRatio);
          compensationDetail += ` Delta ratio ${deltaRatio.toFixed(2)}: ${dd.label}.`;
        }
      } else if (effectiveAG !== null) {
        differentials.push("Diarrhoea (most common cause in children)", "Renal tubular acidosis", "Early/partial renal failure", "Large-volume normal saline resuscitation");
      } else {
        differentials.push("DKA", "Lactic acidosis (shock)", "Diarrhoea / RTA", "Toxic ingestion — enter Na⁺/Cl⁻ below to narrow this with the anion gap");
      }
    }
  } else if (isAlkalemia) {
    if (pco2Num < 35) {
      primary = "Respiratory Alkalosis";
      color = "text-blue-700"; bg = "bg-blue-50";

      const deltaPCO2 = baselinePCO2 - pco2Num;
      const acuteExpected = baselineHCO3 - 0.2 * deltaPCO2;
      const chronicExpected = baselineHCO3 - 0.45 * deltaPCO2;
      const tol = 2.5;

      compensationDetail = `Acute-compensation reference ~${acuteExpected.toFixed(0)} mEq/L, chronic reference ~${chronicExpected.toFixed(0)} mEq/L (± ${tol}, measured HCO₃⁻ ${hco3Num}).`;

      if (hco3Num >= acuteExpected - tol && hco3Num <= acuteExpected + tol) {
        pathologyType = "Simple";
        compensationStatus = "Acute (uncompensated) respiratory alkalosis";
        differentials.push("Anxiety / pain / hyperventilation", "Early sepsis", "Fever", "Salicylate toxicity (early, before acidosis develops)");
      } else if (hco3Num < acuteExpected - tol && hco3Num >= chronicExpected - tol) {
        pathologyType = "Compensated";
        compensationStatus = "Partially compensated — consistent with a chronic process";
        differentials.push("Chronic hypoxaemia (high altitude, cyanotic heart disease)", "Chronic liver disease", "Pregnancy", "CNS lesion causing chronic hyperventilation");
      } else if (hco3Num < chronicExpected - tol) {
        pathologyType = "Mixed";
        compensationStatus = "HCO₃⁻ lower than expected even for chronic compensation — mixed respiratory alkalosis + metabolic acidosis";
        differentials.push("Salicylate toxicity (mixed picture)", "Sepsis with concurrent lactic acidosis");
      } else {
        pathologyType = "Mixed";
        compensationStatus = "HCO₃⁻ higher than expected — mixed respiratory alkalosis + metabolic alkalosis";
        differentials.push("Hyperventilation in a patient also vomiting or diuresing");
      }
    } else {
      primary = "Metabolic Alkalosis";
      color = "text-blue-700"; bg = "bg-blue-50";

      // Expected pCO2 = baseline 40 + 0.7 x (HCO3 - baseline 24); tolerance widened to ±5
      // per Javaheri & Kazemi 1987 — compensation for metabolic alkalosis is imprecise.
      const expectedPco2 = baselinePCO2 + 0.7 * (hco3Num - baselineHCO3);
      const tol = 5;
      compensationDetail = `Expected pCO₂ ${(expectedPco2 - tol).toFixed(0)}-${(expectedPco2 + tol).toFixed(0)} mmHg (measured ${pco2Num}). Compensation for metabolic alkalosis is physiologically imprecise — PaCO₂ rarely exceeds 55 mmHg from compensation alone.`;

      if (pco2Num > expectedPco2 + tol) {
        pathologyType = "Mixed";
        compensationStatus = "Mixed metabolic alkalosis & respiratory acidosis";
      } else if (pco2Num < expectedPco2 - tol) {
        pathologyType = "Mixed";
        compensationStatus = "Mixed metabolic alkalosis & respiratory alkalosis";
      } else {
        pathologyType = "Compensated";
        compensationStatus = "Appropriate respiratory compensation";
      }
      differentials.push("Severe vomiting / pyloric stenosis", "Diuretic use", "Nasogastric suctioning", "Bartter / Gitelman syndrome", "Mineralocorticoid excess");
      clinicalNote = "Distinguish chloride-responsive causes (vomiting, diuretics, NG losses — low urine chloride) from chloride-resistant causes (Bartter/Gitelman, mineralocorticoid excess — high urine chloride) with a urine chloride, which cannot be derived from the ABG alone.";
    }
  } else {
    primary = "Normal Acid-Base Status";
    color = "text-green-700"; bg = "bg-green-50";
    const pco2Normal = pco2Num >= 35 && pco2Num <= 45;
    const hco3Normal = hco3Num >= baselineHCO3 - 2 && hco3Num <= baselineHCO3 + 2;
    if (!pco2Normal || !hco3Normal) {
      pathologyType = "Mixed";
      primary = "Compensated / Balanced Mixed Disturbance";
      compensationStatus = "pH is normal, but pCO₂ and/or HCO₃⁻ are abnormal — two opposing processes may be balancing each other out.";
      if (effectiveAG !== null && effectiveAG > NORMAL_AG) {
        compensationDetail = `Anion gap is elevated (${effectiveAG.toFixed(1)}) despite a normal pH and near-normal HCO₃⁻ — classic for a combined high-anion-gap metabolic acidosis plus metabolic alkalosis (e.g. DKA + vomiting, or salicylate toxicity) masking each other.`;
        differentials.push("DKA with concurrent vomiting", "Salicylate toxicity", "Chronic renal failure with superimposed vomiting/diuretic use");
      } else {
        compensationDetail = "Enter Na⁺/Cl⁻ below — an elevated anion gap here would point strongly to a masked mixed high-anion-gap acidosis plus alkalosis.";
        differentials.push("DKA + vomiting", "Salicylate toxicity", "Chronic respiratory disease with an evolving second process");
      }
    } else {
      compensationStatus = "No acid-base disturbance detected";
    }
  }

  return { primary, pathologyType, compensationStatus, compensationDetail, differentials, color, bg, populationNote, clinicalNote };
}

export default function AbgInterpreter() {
  const [population, setPopulation] = useState<Population>("standard");
  const [ph, setPh] = useState<string>("");
  const [pco2, setPco2] = useState<string>("");
  const [hco3, setHco3] = useState<string>("");
  const [na, setNa] = useState<string>("");
  const [cl, setCl] = useState<string>("");
  const [albumin, setAlbumin] = useState<string>("");

  const phNum = parseFloat(ph);
  const pco2Num = parseFloat(pco2);
  const hco3Num = parseFloat(hco3);
  const naNum = parseFloat(na);
  const clNum = parseFloat(cl);
  const albNum = parseFloat(albumin);

  const isValid = !isNaN(phNum) && !isNaN(pco2Num) && !isNaN(hco3Num);
  const hasNaCl = isFinite(naNum) && isFinite(clNum);
  const hasAlbumin = isFinite(albNum) && albNum > 0;

  const baselineHCO3 = population === "neonate" ? 21 : 24;

  const agResult = useMemo(() => {
    if (!hasNaCl) return null;
    const gap = naNum - (clNum + hco3Num);
    const adjustedGap = hasAlbumin ? gap + 2.5 * (4 - albNum) : gap;
    const effectiveAG = hasAlbumin ? adjustedGap : gap;
    const deltaAG = effectiveAG - NORMAL_AG;
    const deltaHCO3 = baselineHCO3 - hco3Num;
    const deltaRatio = deltaHCO3 > 0 ? deltaAG / deltaHCO3 : null;
    return { gap, adjustedGap, effectiveAG, deltaRatio };
  }, [naNum, clNum, hco3Num, albNum, hasNaCl, hasAlbumin, baselineHCO3]);

  const hhCheck = useMemo(() => {
    if (!isValid) return null;
    const predictedPh = 6.1 + Math.log10(hco3Num / (0.03 * pco2Num));
    const mismatch = Math.abs(predictedPh - phNum) > 0.03;
    return { predictedPh, mismatch };
  }, [isValid, phNum, pco2Num, hco3Num]);

  const pWarnings = isValid ? plausibilityWarnings(phNum, pco2Num, hco3Num) : [];
  const gasWarnings = isValid ? extremeGasWarnings(pco2Num, hco3Num) : [];
  const phBand = isValid ? phSeverityBand(phNum) : null;

  const interpretation = useMemo(() => {
    if (!isValid) return null;
    return computeInterpretation(
      phNum, pco2Num, hco3Num,
      agResult?.effectiveAG ?? null, agResult?.deltaRatio ?? null,
      baselineHCO3, population,
    );
  }, [phNum, pco2Num, hco3Num, isValid, agResult, baselineHCO3, population]);

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 pb-20">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary active:scale-95">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center justify-between gap-3 mb-8 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-100 text-slate-700 border border-slate-200">
            <Wind className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight text-slate-800">Advanced ABG Interpreter</h1>
            <p className="text-muted-foreground text-sm font-medium">Mixed disturbance detection and clinical differential engine</p>
          </div>
        </div>
        <div className="flex rounded-xl border-2 overflow-hidden">
          <button
            onClick={() => setPopulation("standard")}
            className={cn("px-3 py-2 text-xs font-black uppercase tracking-wide flex items-center gap-1.5 transition-all",
              population === "standard" ? "bg-slate-700 text-white" : "bg-white text-muted-foreground hover:bg-muted/40")}
          >
            <Stethoscope className="h-3.5 w-3.5" /> Standard ({">"}1 month)
          </button>
          <button
            onClick={() => setPopulation("neonate")}
            className={cn("px-3 py-2 text-xs font-black uppercase tracking-wide flex items-center gap-1.5 transition-all",
              population === "neonate" ? "bg-sky-600 text-white" : "bg-white text-muted-foreground hover:bg-muted/40")}
          >
            <Baby className="h-3.5 w-3.5" /> Neonate (≤1 month)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* INPUTS SECTION */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-2 shadow-sm h-fit">
            <CardHeader className="bg-slate-50/50 pb-4">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-600">Lab Measurements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">pH (Arterial/Venous) <span className="opacity-50 font-normal normal-case">normal 7.35-7.45</span></Label>
                    <Input type="number" inputMode="decimal" step="0.01" placeholder="7.40" className="h-11 font-mono text-lg border-2 focus:border-slate-400" value={ph} onChange={(e) => setPh(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">pCO2 (mmHg) <span className="opacity-50 font-normal normal-case">normal 35-45</span></Label>
                    <Input type="number" inputMode="decimal" placeholder="40" className="h-11 font-mono text-lg border-2 focus:border-slate-400" value={pco2} onChange={(e) => setPco2(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">HCO3- (mEq/L) <span className="opacity-50 font-normal normal-case">normal {population === "neonate" ? "19-23 (neonate)" : "22-26"}</span></Label>
                    <Input type="number" inputMode="decimal" placeholder={population === "neonate" ? "21" : "24"} className="h-11 font-mono text-lg border-2 focus:border-slate-400" value={hco3} onChange={(e) => setHco3(e.target.value)} />
                </div>
                <Separator />
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-indigo-700">Na⁺ (mEq/L) <span className="opacity-50 font-normal normal-case">optional</span></Label>
                    <Input type="number" inputMode="decimal" placeholder="e.g. 138" className="h-10 font-mono border-dashed" value={na} onChange={(e) => setNa(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-indigo-700">Cl⁻ (mEq/L) <span className="opacity-50 font-normal normal-case">optional</span></Label>
                    <Input type="number" inputMode="decimal" placeholder="e.g. 102" className="h-10 font-mono border-dashed" value={cl} onChange={(e) => setCl(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-indigo-700">Albumin (g/dL) <span className="opacity-50 font-normal normal-case">optional</span></Label>
                    <Input type="number" inputMode="decimal" placeholder="e.g. 2.5" className="h-10 font-mono border-dashed" value={albumin} onChange={(e) => setAlbumin(e.target.value)} />
                </div>
                <p className="text-[9px] text-muted-foreground italic">
                  Na⁺/Cl⁻ enable an albumin-corrected anion gap and delta ratio for refined metabolic acidosis differentials.
                  For the full GOLD MARK differential and corrected bicarbonate, see the <Link href="/calculators/anion-gap" className="underline font-bold">Anion Gap Calculator</Link>.
                </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 text-white border-none shadow-xl">
              <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-slate-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Clinical Rule</span>
                  </div>
                  <p className="text-xs leading-relaxed font-medium">
                      Always compare the ABG result with the <strong>clinical picture</strong>. If the patient is well-appearing but has a severe acidosis, consider lab error or venous contamination.
                  </p>
              </CardContent>
          </Card>
        </div>

        {/* INTERPRETATION SECTION */}
        <div className="lg:col-span-8 space-y-6">
            {isValid && interpretation ? (
                <div className="space-y-6 animate-in fade-in duration-500">

                    {pWarnings.length > 0 && (
                      <Alert className="bg-red-50 border-red-300 rounded-2xl">
                        <Siren className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800 text-xs font-bold space-y-1">
                          {pWarnings.map((w, i) => <p key={i}>{w}</p>)}
                        </AlertDescription>
                      </Alert>
                    )}

                    {hhCheck?.mismatch && (
                      <Alert className="bg-amber-50 border-amber-300 rounded-2xl">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-800 text-xs font-bold">
                          Internal consistency check failed: the Henderson-Hasselbalch equation predicts pH {hhCheck.predictedPh.toFixed(2)}
                          {" "}from the entered pCO₂/HCO₃⁻, but {phNum.toFixed(2)} was entered. One of the three values may be mistyped, or this may be a
                          venous sample interpreted as arterial. Re-check before trusting this interpretation.
                        </AlertDescription>
                      </Alert>
                    )}

                    <Card className={cn("border-2 shadow-md transition-colors", interpretation.bg)}>
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start mb-2">
                                <Badge className={cn("font-black tracking-tighter uppercase",
                                    interpretation.pathologyType === "Mixed" ? "bg-red-600" : "bg-slate-700")}>
                                    {interpretation.pathologyType} Disturbance
                                </Badge>
                                {interpretation.pathologyType === "Mixed" && (
                                    <AlertCircle className="h-5 w-5 text-red-600 animate-pulse" />
                                )}
                            </div>
                            <CardTitle className={cn("text-4xl font-black font-headline tracking-tight", interpretation.color)}>
                                {interpretation.primary}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-xl bg-background/60 border border-muted shadow-sm">
                                <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-widest">Calculated Compensation</p>
                                <p className="text-base font-bold text-slate-800">{interpretation.compensationStatus}</p>
                                {interpretation.compensationDetail && (
                                  <p className="text-xs text-muted-foreground font-medium mt-1.5">{interpretation.compensationDetail}</p>
                                )}
                            </div>

                            {phBand && (
                              <div className={cn("p-4 rounded-xl border shadow-sm flex items-start gap-3",
                                phBand.urgent ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200")}>
                                <Siren className={cn("h-4 w-4 mt-0.5 shrink-0", phBand.urgent ? "text-red-600" : "text-amber-600")} />
                                <div>
                                  <p className={cn("text-xs font-black uppercase tracking-widest", phBand.urgent ? "text-red-700" : "text-amber-700")}>{phBand.label}</p>
                                  <p className={cn("text-sm font-bold mt-0.5", phBand.urgent ? "text-red-800" : "text-amber-800")}>{phBand.action}</p>
                                </div>
                              </div>
                            )}

                            {gasWarnings.length > 0 && (
                              <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-1">
                                {gasWarnings.map((w, i) => (
                                  <p key={i} className="text-xs font-bold text-red-800 flex items-start gap-2">
                                    <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {w}
                                  </p>
                                ))}
                              </div>
                            )}

                            {interpretation.populationNote && (
                              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 flex items-start gap-3">
                                <Baby className="h-4 w-4 mt-0.5 shrink-0 text-sky-600" />
                                <p className="text-xs font-bold text-sky-800">{interpretation.populationNote}</p>
                              </div>
                            )}

                            {interpretation.clinicalNote && (
                              <div className="p-4 rounded-xl bg-violet-50 border border-violet-200 flex items-start gap-3">
                                <Info className="h-4 w-4 mt-0.5 shrink-0 text-violet-600" />
                                <p className="text-xs font-bold text-violet-800">{interpretation.clinicalNote}</p>
                              </div>
                            )}

                            {agResult && (
                              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1">
                                <p className="text-[10px] font-black uppercase text-indigo-700 tracking-widest">
                                  {hasAlbumin ? "Albumin-Corrected Anion Gap" : "Anion Gap"}
                                </p>
                                <p className="text-2xl font-black font-mono text-indigo-900">{agResult.effectiveAG.toFixed(1)} <span className="text-xs font-normal opacity-60">mEq/L</span></p>
                                {agResult.deltaRatio !== null && agResult.effectiveAG > NORMAL_AG && (
                                  <p className={cn("text-xs font-bold", deltaDeltaInterpret(agResult.deltaRatio).color)}>
                                    Delta ratio {agResult.deltaRatio.toFixed(2)}: {deltaDeltaInterpret(agResult.deltaRatio).label}
                                  </p>
                                )}
                              </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* DIFFERENTIALS ENGINE */}
                    <Card className="border-2 border-primary/10 shadow-sm overflow-hidden">
                        <CardHeader className="bg-primary/5 pb-3">
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" /> Suspected Primary Diseases
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {interpretation.differentials.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {interpretation.differentials.map((diff, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-muted/50">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                            <span className="text-sm font-bold text-slate-700">{diff}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic text-center py-4">
                                    No specific differentials identified. Correlate with physical exam.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Alert className="bg-muted/30 border-dashed rounded-2xl">
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-xs font-medium leading-relaxed">
                            <strong>Note:</strong> Venous blood gas (VBG) pH is typically 0.03 - 0.04 units lower than arterial, and pCO2 is ~6 mmHg higher. Use caution when interpreting mixed disturbances from a VBG.
                        </AlertDescription>
                    </Alert>

                    <p className="text-[10px] text-muted-foreground text-center">
                      References: Narins &amp; Emmett, Medicine 1980 · Albert, Dell &amp; Winters, Ann Intern Med 1967 (Winters' formula) ·
                      Javaheri &amp; Kazemi, Chest 1987 · Figge et al., Crit Care Med 1998 (albumin correction) · Cools et al., Cochrane 2013 (permissive hypercapnia)
                    </p>
                </div>
            ) : (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-4 border-dashed rounded-[40px] p-12 text-center bg-muted/20 border-muted/30">
                    <Wind className="h-16 w-16 text-slate-200 mb-6" />
                    <h3 className="text-2xl font-black text-muted-foreground/80 tracking-tight text-slate-400 uppercase">ABG Logic Armed</h3>
                    <p className="text-muted-foreground font-medium text-sm mt-3 leading-relaxed max-w-[320px]">
                        Enter pH, pCO2, and HCO3 to reveal primary disturbances, compensation status, and clinical differentials.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
