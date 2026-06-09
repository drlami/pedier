import { useState, useMemo } from "react";
import {
  Activity, Calculator, Info,
  ArrowLeft, AlertTriangle, FlaskConical, Wind, CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const NORMAL_AG = 12;

function agSeverity(ag: number) {
  if (ag <= 12) return { label: "Normal Anion Gap",           color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-300", badge: "bg-emerald-600" };
  if (ag <= 20) return { label: "Mildly Elevated",            color: "text-amber-700",   bg: "bg-amber-50 border-amber-300",     badge: "bg-amber-500" };
  if (ag <= 30) return { label: "Moderately Elevated",        color: "text-orange-700",  bg: "bg-orange-50 border-orange-300",   badge: "bg-orange-600" };
  return              { label: "Severely Elevated",           color: "text-red-700",     bg: "bg-red-50 border-red-300",         badge: "bg-red-600" };
}

function deltaDeltaInterpret(ratio: number) {
  if (ratio < 0.4)  return {
    label: "Less than 0.4 — Hyperchloraemic (Non-Anion Gap) Metabolic Acidosis",
    meaning: "The bicarbonate drop is disproportionately large relative to the anion gap rise. There is little or no anion gap component — the acidosis is hyperchloraemic.",
    color: "text-blue-700",
  };
  if (ratio < 1.0)  return {
    label: "0.4 to 1.0 — Mixed Disorder",
    meaning: "Both anion gap and non-anion gap acidosis are coexisting. Bicarbonate is lower than expected for the degree of anion gap elevation.",
    color: "text-orange-700",
  };
  if (ratio <= 2.0) return {
    label: "1.0 to 2.0 — Pure Anion Gap Metabolic Acidosis",
    meaning: "Isolated anion gap metabolic acidosis with appropriate bicarbonate drop. Typical of lactic acidosis, diabetic ketoacidosis, and renal failure.",
    color: "text-emerald-700",
  };
  return {
    label: "Greater than 2.0 — Anion Gap Acidosis with Hidden Metabolic Alkalosis",
    meaning: "Bicarbonate is higher than expected, suggesting a co-existing metabolic alkalosis (or pre-existing chronic respiratory acidosis) masking the true deficit.",
    color: "text-purple-700",
  };
}

const ELEVATED_AG_CAUSES = [
  {
    letter: "G",
    cause: "Glycols — Ethylene or Propylene",
    mechanism: "Ingestion of antifreeze or industrial solvents. Metabolised to glycolic and oxalic acid.",
    clue: "Elevated osmolar gap (greater than 10). Oxalate crystals in urine. Renal failure if untreated. Check osmolar gap urgently.",
    color: "amber",
  },
  {
    letter: "O",
    cause: "Oxoproline — Pyroglutamic Acidosis",
    mechanism: "Accumulation of pyroglutamic acid from disrupted glutathione cycle. Seen with chronic paracetamol use in malnourished or critically ill patients.",
    clue: "Often missed. Suspect in women with recurrent unexplained anion gap acidosis. Normal osmolar gap. Treat by stopping paracetamol.",
    color: "amber",
  },
  {
    letter: "L",
    cause: "L-Lactate — Lactic Acidosis",
    mechanism: "Type A: Tissue hypoperfusion — sepsis, cardiogenic shock, haemorrhage, mesenteric ischaemia. Type B: Normal perfusion — liver failure, metformin toxicity, thiamine deficiency, malignancy.",
    clue: "Most common cause of elevated anion gap metabolic acidosis. Measure serum lactate directly. Treat the underlying cause.",
    color: "amber",
  },
  {
    letter: "D",
    cause: "D-Lactate",
    mechanism: "Produced by intestinal bacteria in short bowel syndrome or intestinal bypass. Standard lactate assay does not detect D-lactate.",
    clue: "Neurological symptoms — confusion, slurred speech, ataxia — after carbohydrate-rich meals. Requires specific D-lactate assay.",
    color: "amber",
  },
  {
    letter: "M",
    cause: "Methanol",
    mechanism: "Metabolised to formaldehyde then formic acid, which inhibits cytochrome oxidase. Found in windshield washer fluid and contaminated illicit spirits.",
    clue: "Elevated osmolar gap. Visual disturbances, blindness, optic disc hyperaemia. Treat with fomepizole and haemodialysis.",
    color: "amber",
  },
  {
    letter: "A",
    cause: "Aspirin — Salicylate Toxicity",
    mechanism: "Uncouples oxidative phosphorylation, producing organic acids. Simultaneously stimulates the respiratory centre.",
    clue: "Mixed picture: anion gap metabolic acidosis plus respiratory alkalosis. Tinnitus, hyperventilation, fever. Alkalinise urine; dialysis if severe.",
    color: "amber",
  },
  {
    letter: "R",
    cause: "Renal Failure — Uraemic Acidosis",
    mechanism: "Accumulation of sulphate, phosphate, hippurate, and other organic anions when glomerular filtration rate falls below 20–25 mL/min.",
    clue: "Usually moderate elevation (anion gap 16–24). Creatinine and urea markedly elevated. Confirm with estimated glomerular filtration rate.",
    color: "amber",
  },
  {
    letter: "K",
    cause: "Ketoacidosis",
    mechanism: "Diabetic: insulin deficiency drives lipolysis and ketone production. Alcoholic: binge drinking with starvation. Starvation: prolonged fasting.",
    clue: "Diabetic ketoacidosis — marked hyperglycaemia, ketonuria. Alcoholic ketoacidosis — glucose normal or low, history of binge. Check serum ketones.",
    color: "amber",
  },
];

const NORMAL_AG_CAUSES = [
  {
    cause: "Gastrointestinal Bicarbonate Loss",
    detail: "Diarrhoea (most common cause in children), ileostomy output, small bowel fistula, pancreatic fistula, cholestyramine. Bicarbonate is lost directly in stool or intestinal fluid.",
    clue: "History of diarrhoea or intestinal surgery. Hypokalaemia often coexists.",
  },
  {
    cause: "Renal Tubular Acidosis — Type 1 (Distal)",
    detail: "Failure to excrete hydrogen ions in the collecting duct. Urine pH remains above 5.5 despite systemic acidaemia. Associated with hypokalaemia, nephrocalcinosis, nephrolithiasis.",
    clue: "Causes: Sjögren's syndrome, amphotericin toxicity, obstructive uropathy. Urine pH greater than 5.5 is the key diagnostic finding.",
  },
  {
    cause: "Renal Tubular Acidosis — Type 2 (Proximal)",
    detail: "Impaired proximal bicarbonate reabsorption. Often part of Fanconi syndrome — generalised proximal tubule dysfunction with glycosuria, phosphaturia, aminoaciduria.",
    clue: "Causes: Cystinosis, Wilson's disease, multiple myeloma, acetazolamide, topiramate, tenofovir. Urine pH becomes appropriately acidic as bicarbonate falls below threshold.",
  },
  {
    cause: "Renal Tubular Acidosis — Type 4 (Hyperkalaemic)",
    detail: "Aldosterone deficiency or resistance reduces hydrogen and potassium excretion. Unlike Types 1 and 2, this causes hyperkalaemia rather than hypokalaemia.",
    clue: "Most common cause: diabetic nephropathy. Others: obstructive uropathy, adrenal insufficiency, NSAIDs, trimethoprim. Urine pH is appropriately less than 5.5.",
  },
  {
    cause: "Excess Chloride Load — Dilutional or Exogenous",
    detail: "Large volume normal saline infusion causes dilutional acidosis and raises serum chloride. Ammonium chloride ingestion and high-chloride parenteral nutrition formulations have the same effect.",
    clue: "Common in surgical and intensive care patients after large saline resuscitation. Serum chloride elevated; bicarbonate reduced proportionally.",
  },
  {
    cause: "Adrenal Insufficiency — Addison's Disease",
    detail: "Mineralocorticoid deficiency impairs urinary excretion of hydrogen and potassium, causing metabolic acidosis with hyperkalaemia. May also cause hyponatraemia and haemodynamic instability.",
    clue: "Associated features: hyperkalaemia, hyponatraemia, hypotension, hyperpigmentation. Confirm with early morning cortisol and short Synacthen test.",
  },
  {
    cause: "Post-Hypocapnia (Renal Bicarbonate Compensation)",
    detail: "Prolonged respiratory alkalosis causes renal bicarbonate excretion as compensation. When the respiratory alkalosis is corrected quickly (e.g., after extubation), the reduced bicarbonate is unmasked as metabolic acidosis.",
    clue: "Self-limiting — kidneys regenerate bicarbonate within 24–48 hours once ventilation normalises. No specific treatment needed.",
  },
];

export default function AnionGapCalc() {
  const [na, setNa]           = useState("");
  const [cl, setCl]           = useState("");
  const [hco3, setHco3]       = useState("");
  const [albumin, setAlbumin] = useState("");

  const naNum   = parseFloat(na);
  const clNum   = parseFloat(cl);
  const hco3Num = parseFloat(hco3);
  const albNum  = parseFloat(albumin);

  const isValid    = isFinite(naNum) && isFinite(clNum) && isFinite(hco3Num);
  const hasAlbumin = isFinite(albNum) && albNum > 0;

  const result = useMemo(() => {
    if (!isValid) return null;

    const gap         = naNum - (clNum + hco3Num);
    const adjustedGap = hasAlbumin ? gap + 2.5 * (4 - albNum) : gap;
    const effectiveAG = hasAlbumin ? adjustedGap : gap;

    const deltaAG    = effectiveAG - NORMAL_AG;
    const deltaHCO3  = 24 - hco3Num;
    const deltaRatio = deltaHCO3 > 0 ? deltaAG / deltaHCO3 : null;

    const correctedHCO3 = hco3Num + deltaAG;

    // Winters' formula: expected arterial CO₂ pressure for respiratory compensation
    const wintersLow  = +(1.5 * hco3Num + 6).toFixed(1);
    const wintersHigh = +(1.5 * hco3Num + 10).toFixed(1);

    return { gap, adjustedGap, effectiveAG, deltaAG, deltaHCO3, deltaRatio, correctedHCO3, wintersLow, wintersHigh };
  }, [naNum, clNum, hco3Num, albNum, isValid, hasAlbumin]);

  const severity   = result ? agSeverity(result.effectiveAG) : null;
  const isElevated = result ? result.effectiveAG > NORMAL_AG : false;
  const ddInterp   = result?.deltaRatio != null ? deltaDeltaInterpret(result.deltaRatio) : null;

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 pb-32">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary active:scale-95">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      {/* ── Header ── */}
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 rounded-3xl bg-sky-600 text-white shadow-xl shadow-sky-100">
          <Activity className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tight">Anion Gap Calculator</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest mt-1">
            Albumin Correction · Delta-Delta Ratio · Corrected Bicarbonate · Winters' Formula
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── Left: Inputs + Formulae ── */}
        <div className="lg:col-span-4 space-y-5">
          <Card className="border-2 shadow-sm">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <FlaskConical className="h-4 w-4" /> Electrolyte Panel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Sodium Na⁺ <span className="opacity-50 font-normal normal-case">(mEq/L)</span>
                </Label>
                <Input type="number" inputMode="decimal" placeholder="e.g. 140"
                  className="font-mono h-11 border-2 focus:border-sky-500"
                  value={na} onChange={(e) => setNa(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Chloride Cl⁻ <span className="opacity-50 font-normal normal-case">(mEq/L)</span>
                </Label>
                <Input type="number" inputMode="decimal" placeholder="e.g. 104"
                  className="font-mono h-11 border-2 focus:border-sky-500"
                  value={cl} onChange={(e) => setCl(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Bicarbonate HCO₃⁻ <span className="opacity-50 font-normal normal-case">(mEq/L)</span>
                </Label>
                <Input type="number" inputMode="decimal" placeholder="e.g. 14"
                  className="font-mono h-11 border-2 focus:border-sky-500"
                  value={hco3} onChange={(e) => setHco3(e.target.value)} />
              </div>

              <Separator />

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-sky-700 tracking-widest">
                  Albumin <span className="font-normal normal-case text-muted-foreground opacity-60">(g/dL) — optional</span>
                </Label>
                <Input type="number" inputMode="decimal" placeholder="e.g. 2.5"
                  className="font-mono h-10 border border-dashed border-sky-300 bg-sky-50/10 focus:border-sky-500"
                  value={albumin} onChange={(e) => setAlbumin(e.target.value)} />
                <p className="text-[9px] text-muted-foreground font-medium leading-snug">
                  Enter to correct for low albumin — essential in malnutrition and critical illness where a falsely normal anion gap can mask significant acidosis.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Formulae */}
          <Card className="bg-muted/30 border">
            <CardContent className="pt-5 pb-5 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" /> Formulae Used
              </p>
              <div className="space-y-2.5 text-[11px] font-mono text-muted-foreground">
                <div>
                  <span className="text-foreground font-black">Anion Gap</span>
                  <p className="mt-0.5">= Na⁺ − (Cl⁻ + HCO₃⁻)</p>
                </div>
                <div>
                  <span className="text-foreground font-black">Albumin-Corrected Anion Gap</span>
                  <p className="mt-0.5">= Anion Gap + 2.5 × (4.0 − Albumin)</p>
                </div>
                <div>
                  <span className="text-foreground font-black">Delta-Delta Ratio</span>
                  <p className="mt-0.5">= (Anion Gap − 12) ÷ (24 − HCO₃⁻)</p>
                </div>
                <div>
                  <span className="text-foreground font-black">Corrected Bicarbonate</span>
                  <p className="mt-0.5">= HCO₃⁻ + (Anion Gap − 12)</p>
                </div>
                <div>
                  <span className="text-foreground font-black">Winters' Formula (Expected PCO₂)</span>
                  <p className="mt-0.5">= 1.5 × HCO₃⁻ + 8 ± 2</p>
                </div>
              </div>
              <Separator />
              <p className="text-[10px] text-muted-foreground font-medium">
                Normal anion gap: <strong>8–12 mEq/L</strong> at albumin 4.0 g/dL.
                Decreases by approximately 2.5 mEq/L for every 1 g/dL fall in albumin.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ── Right: Results + Differential ── */}
        <div className="lg:col-span-8 space-y-5">
          {result && severity ? (
            <>
              {/* Primary result */}
              <Card className={cn("border-2", severity.bg)}>
                <CardContent className="pt-6 pb-5 px-6">
                  <Badge className={cn("mb-3 text-xs font-black px-3 py-1", severity.badge)}>
                    {severity.label}
                  </Badge>
                  <div className="flex items-end gap-4 mb-3">
                    <p className="text-7xl font-black font-mono tracking-tighter leading-none">
                      {result.effectiveAG.toFixed(1)}
                    </p>
                    <p className="text-sm font-bold text-muted-foreground mb-2">mEq/L</p>
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">
                    {hasAlbumin ? "Albumin-Corrected Anion Gap" : "Serum Anion Gap — enter albumin for correction"}
                  </p>
                  <div className="p-3 rounded-xl bg-background/60 border font-mono text-xs font-bold text-center space-y-1">
                    <p>{naNum} − ({clNum} + {hco3Num}) = <span className={severity.color}>{result.gap.toFixed(1)}</span></p>
                    {hasAlbumin && (
                      <p className="text-muted-foreground">
                        Albumin correction: +2.5 × (4.0 − {albNum}) = <span className={severity.color}>{result.adjustedGap.toFixed(1)}</span>
                      </p>
                    )}
                  </div>
                  {hasAlbumin && result.gap <= 12 && result.adjustedGap > 12 && (
                    <p className="mt-3 text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                      The unadjusted anion gap appeared normal ({result.gap.toFixed(1)}) but is elevated after albumin correction — anion gap metabolic acidosis was masked by hypoalbuminaemia.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Delta-Delta · Corrected Bicarbonate · Winters' */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <Card className={cn("border-2", isElevated ? "border-slate-200" : "border-muted opacity-50")}>
                  <CardContent className="pt-5 pb-5 px-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Delta-Delta Ratio</p>
                    <p className="text-[10px] text-muted-foreground font-medium leading-snug mb-3">
                      When the anion gap rises, bicarbonate should fall by roughly the same amount. This ratio compares those two changes to reveal whether a second hidden acid-base disorder is also present.
                    </p>
                    <p className={cn("text-4xl font-black font-mono mb-2", isElevated && ddInterp ? ddInterp.color : "text-muted-foreground")}>
                      {isElevated && result.deltaRatio != null ? result.deltaRatio.toFixed(2) : "—"}
                    </p>
                    {isElevated && ddInterp ? (
                      <div className="space-y-1">
                        <p className={cn("text-[10px] font-black leading-snug", ddInterp.color)}>{ddInterp.label}</p>
                        <p className="text-[9px] text-muted-foreground font-medium leading-snug mt-1">{ddInterp.meaning}</p>
                      </div>
                    ) : (
                      <p className="text-[9px] text-muted-foreground leading-snug">Only calculated when the anion gap is elevated.</p>
                    )}
                  </CardContent>
                </Card>

                <Card className={cn("border-2", isElevated ? "border-slate-200" : "border-muted opacity-50")}>
                  <CardContent className="pt-5 pb-5 px-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Corrected Bicarbonate</p>
                    <p className="text-[10px] text-muted-foreground font-medium leading-snug mb-3">
                      Estimates what the patient's bicarbonate would have been before the anion gap metabolic acidosis began — by adding back the anion gap excess. Reveals a pre-existing disorder hidden beneath the current acidosis.
                    </p>
                    <p className={cn("text-4xl font-black font-mono mb-1", !isElevated && "text-muted-foreground")}>
                      {isElevated ? result.correctedHCO3.toFixed(1) : "—"}
                      {isElevated && <span className="text-sm font-normal ml-1 opacity-50">mEq/L</span>}
                    </p>
                    {isElevated && (
                      <p className={cn("text-[10px] font-bold leading-snug mt-1",
                        result.correctedHCO3 > 26 ? "text-purple-700" :
                        result.correctedHCO3 < 22 ? "text-orange-700" : "text-emerald-700"
                      )}>
                        {result.correctedHCO3 > 26
                          ? "Above 26 — pre-existing metabolic alkalosis"
                          : result.correctedHCO3 < 22
                          ? "Below 22 — additional non-anion gap acidosis present"
                          : "22–26 — pure single disorder, nothing hidden"}
                      </p>
                    )}
                    <p className="text-[9px] text-muted-foreground mt-1.5 font-medium">HCO₃⁻ + (Anion Gap − 12)</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-slate-200">
                  <CardContent className="pt-5 pb-5 px-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1">
                      <Wind className="h-3 w-3" /> Expected PCO₂ (Winters')
                    </p>
                    <p className="text-3xl font-black font-mono mb-1">
                      {result.wintersLow}–{result.wintersHigh}
                      <span className="text-xs font-normal ml-1 opacity-50">mmHg</span>
                    </p>
                    <p className="text-[9px] text-muted-foreground font-medium leading-snug">
                      Expected respiratory compensation for metabolic acidosis.
                      If measured PCO₂ falls outside this range, a concurrent primary respiratory disorder is present.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="h-52 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl text-center bg-muted/20">
              <Calculator className="h-10 w-10 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-sm font-medium">Enter sodium, chloride, and bicarbonate to calculate</p>
              <p className="text-muted-foreground text-xs mt-1 opacity-70">Adding albumin corrects for hypoalbuminaemia — important in malnourished and critically ill patients</p>
            </div>
          )}

          {/* ── Differential Diagnosis — always visible ── */}
          <div className="space-y-4">

            {/* Elevated Anion Gap Section */}
            <Card className={cn(
              "border-2 transition-all",
              result ? (isElevated ? "border-amber-300 bg-amber-50/40 shadow-md" : "border-muted opacity-60") : "border-muted"
            )}>
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={cn("h-4 w-4", isElevated ? "text-amber-600" : "text-muted-foreground")} />
                    <p className={cn("text-sm font-black uppercase tracking-wider", isElevated ? "text-amber-800" : "text-muted-foreground")}>
                      Causes of Elevated Anion Gap Metabolic Acidosis
                    </p>
                  </div>
                  {isElevated && (
                    <Badge className="bg-amber-500 text-white text-[10px] font-black">Active</Badge>
                  )}
                </div>
                <p className={cn("text-[11px] mt-1 font-medium", isElevated ? "text-amber-700" : "text-muted-foreground")}>
                  GOLD MARK mnemonic — anion gap elevated because unmeasured organic anions accumulate
                </p>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="space-y-3">
                  {ELEVATED_AG_CAUSES.map(({ letter, cause, mechanism, clue }) => (
                    <div key={letter} className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border",
                      isElevated ? "bg-white/80 border-amber-100" : "bg-muted/30 border-muted"
                    )}>
                      <span className={cn(
                        "text-xl font-black font-mono leading-none w-6 shrink-0 mt-0.5",
                        isElevated ? "text-amber-600" : "text-muted-foreground"
                      )}>{letter}</span>
                      <div className="space-y-1">
                        <p className={cn("text-[12px] font-black leading-tight", isElevated ? "text-amber-900" : "text-foreground/60")}>{cause}</p>
                        <p className={cn("text-[11px] font-medium leading-snug", isElevated ? "text-amber-800/80" : "text-muted-foreground")}>{mechanism}</p>
                        <p className={cn("text-[10px] font-black leading-snug", isElevated ? "text-sky-700" : "text-muted-foreground/60")}>
                          Key clue: {clue}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Normal Anion Gap Section */}
            <Card className={cn(
              "border-2 transition-all",
              result ? (!isElevated ? "border-blue-300 bg-blue-50/40 shadow-md" : "border-muted opacity-60") : "border-muted"
            )}>
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={cn("h-4 w-4", !isElevated && result ? "text-blue-600" : "text-muted-foreground")} />
                    <p className={cn("text-sm font-black uppercase tracking-wider", !isElevated && result ? "text-blue-800" : "text-muted-foreground")}>
                      Causes of Normal Anion Gap (Hyperchloraemic) Metabolic Acidosis
                    </p>
                  </div>
                  {!isElevated && result && (
                    <Badge className="bg-blue-600 text-white text-[10px] font-black">Active</Badge>
                  )}
                </div>
                <p className={cn("text-[11px] mt-1 font-medium", !isElevated && result ? "text-blue-700" : "text-muted-foreground")}>
                  Anion gap is normal because chloride rises to compensate for the bicarbonate loss
                </p>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="space-y-3">
                  {NORMAL_AG_CAUSES.map(({ cause, detail, clue }) => (
                    <div key={cause} className={cn(
                      "p-3 rounded-xl border",
                      !isElevated && result ? "bg-white/80 border-blue-100" : "bg-muted/30 border-muted"
                    )}>
                      <p className={cn("text-[12px] font-black leading-tight mb-1", !isElevated && result ? "text-blue-900" : "text-foreground/60")}>{cause}</p>
                      <p className={cn("text-[11px] font-medium leading-snug", !isElevated && result ? "text-blue-800/80" : "text-muted-foreground")}>{detail}</p>
                      <p className={cn("text-[10px] font-black leading-snug mt-1", !isElevated && result ? "text-sky-700" : "text-muted-foreground/60")}>
                        Key clue: {clue}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <p className="text-[10px] text-muted-foreground font-medium text-center pb-2">
            Reference: Emmett M, Narins RG. Clinical use of the anion gap. Medicine. 1977;56(1):38–54. — Winters SD et al. Acid-base equilibria of blood in clinical medicine.
          </p>
        </div>
      </div>
    </div>
  );
}
