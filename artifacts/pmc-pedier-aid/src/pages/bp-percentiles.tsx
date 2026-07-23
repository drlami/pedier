import { useState, useMemo } from "react";
import {
  ArrowLeft, Info, HeartPulse, Activity, Scale, ShieldAlert, Baby
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { calculateSimplifiedBPPercentile, calculateTermInfantBPReference, calculatePretermBPReference } from "@/lib/calculators/growth-data";
import { cn } from "@/lib/utils";

// ─── Term child (1–18 yrs) ────────────────────────────────────────────────────

function TermSection() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [ageYears, setAgeYears] = useState<string>("");
  const [systolic, setSystolic] = useState<string>("");
  const [diastolic, setDiastolic] = useState<string>("");

  const ageNum = parseFloat(ageYears);
  const sNum   = parseFloat(systolic);
  const dNum   = parseFloat(diastolic);

  const isAgeValid = !isNaN(ageNum) && ageNum >= 1 && ageNum <= 18;
  const isValid    = isAgeValid && !isNaN(sNum) && !isNaN(dNum);

  const reference = useMemo(() => {
    if (!isAgeValid) return null;
    return calculateSimplifiedBPPercentile(ageNum, sex);
  }, [ageNum, sex, isAgeValid]);

  const result = useMemo(() => {
    if (!isValid || !reference) return null;
    const { systolic90, systolic95, diastolic90, diastolic95, systolicHypotension } = reference;
    let status = "Normal";
    let color  = "text-green-600";
    let bg     = "bg-green-50";
    let severity: "hypotensive" | "normal" | "elevated" | "stage1" | "stage2" = "normal";

    if (sNum < systolicHypotension) {
      // PALS/APLS lower-limit-of-normal SBP rule — takes priority over the
      // upper-threshold bands below since a low SBP indicates possible shock.
      status = "Hypotension"; color = "text-red-800"; bg = "bg-red-100"; severity = "hypotensive";
    } else if (ageNum >= 13) {
      // AAP 2017: adult ACC/AHA thresholds for adolescents ≥ 13
      if (sNum >= 140 || dNum >= 90) {
        status = "Stage 2 Hypertension"; color = "text-red-700"; bg = "bg-red-50"; severity = "stage2";
      } else if (sNum >= 130 || dNum >= 80) {
        status = "Stage 1 Hypertension"; color = "text-orange-600"; bg = "bg-orange-50"; severity = "stage1";
      } else if (sNum >= 120 && dNum < 80) {
        status = "Elevated Blood Pressure"; color = "text-yellow-600"; bg = "bg-yellow-50"; severity = "elevated";
      }
    } else {
      // Ages 1–12: percentile-based classification
      if (sNum >= systolic95 + 12 || dNum >= diastolic95 + 12 || sNum >= 140 || dNum >= 90) {
        status = "Stage 2 Hypertension"; color = "text-red-700"; bg = "bg-red-50"; severity = "stage2";
      } else if (sNum >= systolic95 || dNum >= diastolic95) {
        status = "Stage 1 Hypertension"; color = "text-orange-600"; bg = "bg-orange-50"; severity = "stage1";
      } else if (sNum >= systolic90 || dNum >= diastolic90) {
        status = "Elevated Blood Pressure"; color = "text-yellow-600"; bg = "bg-yellow-50"; severity = "elevated";
      }
    }
    return { status, color, bg, severity, systolic95, diastolic95, systolicHypotension };
  }, [ageNum, sex, sNum, dNum, isValid, reference]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* INPUTS */}
      <Card className="border-2 border-rose-100 shadow-sm h-fit">
        <CardHeader className="bg-rose-50/50 pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Scale className="h-4 w-4 text-rose-600" /> Patient Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground">Biological Sex</Label>
              <Select value={sex} onValueChange={(v: any) => setSex(v)}>
                <SelectTrigger className="active:scale-95"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground">Age (Years)</Label>
              <Input type="number" inputMode="decimal" placeholder="1–18" value={ageYears} onChange={e => setAgeYears(e.target.value)} />
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-rose-700">Systolic (Top)</Label>
              <Input type="number" inputMode="decimal" placeholder="e.g. 110" className="h-12 font-mono text-xl border-rose-200" value={systolic} onChange={e => setSystolic(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-rose-700">Diastolic (Bottom)</Label>
              <Input type="number" inputMode="decimal" placeholder="e.g. 70" className="h-12 font-mono text-xl border-rose-200" value={diastolic} onChange={e => setDiastolic(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RESULTS */}
      <div className="space-y-6">
        {isValid && result && (
          <>
            <Card className={cn("border-2 shadow-md transition-colors", result.bg, "border-rose-200")}>
              <CardHeader className="pb-2 text-center">
                <Badge className="w-fit mx-auto mb-2 bg-rose-600 uppercase font-black">BP Classification</Badge>
                <CardTitle className={cn("text-3xl font-black font-headline tracking-tight", result.color)}>
                  {result.status}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-background/60 border border-rose-100 text-center">
                    <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">
                      {ageNum >= 13 ? "Stage 1 Systolic" : "95th Systolic"}
                    </p>
                    <p className="text-lg font-black text-rose-700">{result.systolic95}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-background/60 border border-rose-100 text-center">
                    <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">
                      {ageNum >= 13 ? "Stage 1 Diastolic" : "95th Diastolic"}
                    </p>
                    <p className="text-lg font-black text-rose-700">{result.diastolic95}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {result.severity !== "normal" && (
              <Alert variant="destructive" className="bg-rose-600 text-white border-none shadow-lg">
                <ShieldAlert className="h-5 w-5" />
                <AlertTitle className="font-black uppercase tracking-widest text-xs">Clinical Action Required</AlertTitle>
                <AlertDescription className="text-xs font-medium opacity-90 leading-relaxed">
                  {result.severity === "hypotensive"
                    ? "Possible shock — assess perfusion (cap refill, HR, mental status). IV/IO access, consider 10–20 mL/kg isotonic fluid bolus. Urgent senior review. Investigate: sepsis, hemorrhage, cardiac, anaphylaxis."
                    : result.severity === "stage2"
                    ? "Urgent evaluation and initiation of therapy required. Assess for target organ damage."
                    : result.severity === "stage1"
                    ? "Lifestyle modifications recommended. Repeat BP measurement in 1-2 weeks."
                    : "Repeat measurement in 6 months. Counsel on diet and physical activity."}
                </AlertDescription>
              </Alert>
            )}
          </>
        )}

        {isAgeValid && reference ? (
          <Card className="border-2 border-rose-100 shadow-sm">
            <CardHeader className="bg-rose-50/50 pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-rose-800">
                <Activity className="h-4 w-4 text-rose-600" />
                {ageNum >= 13
                  ? `Adolescent BP — ${Math.round(ageNum)} y/o`
                  : `Normal BP — ${Math.round(ageNum)} y/o ${sex === "male" ? "Male" : "Female"}`}
              </CardTitle>
              <CardDescription className="text-[11px]">
                {ageNum >= 13
                  ? "ACC/AHA 2017 adult thresholds — per AAP 2017 for adolescents ≥ 13"
                  : "AAP 2017 CPG, 95th %ile at 50th height %ile — ER screening only"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-4">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-rose-100">
                    <th className="text-left pb-2 font-black text-muted-foreground uppercase tracking-wide pr-3">Category</th>
                    <th className="text-center pb-2 font-black text-muted-foreground uppercase tracking-wide pr-2">Systolic</th>
                    <th className="text-center pb-2 font-black text-muted-foreground uppercase tracking-wide">Diastolic</th>
                  </tr>
                </thead>
                {ageNum >= 13 ? (
                  // Adult/adolescent fixed thresholds (AAP 2017 + ACC/AHA 2017)
                  <tbody className="divide-y divide-rose-50">
                    <tr className="bg-red-100/50">
                      <td className="py-2 pr-3"><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-700 flex-shrink-0" /><span className="font-semibold text-red-800">Hypotension</span><span className="text-muted-foreground">(SBP)</span></span></td>
                      <td className="py-2 text-center font-mono font-bold text-red-800 pr-2" colSpan={2}>SBP &lt; {reference.systolicHypotension}</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3"><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" /><span className="font-semibold text-green-700">Normal</span></span></td>
                      <td className="py-2 text-center font-mono font-bold text-green-700 pr-2">&lt;120</td>
                      <td className="py-2 text-center font-mono font-bold text-green-700">&lt;80</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3"><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" /><span className="font-semibold text-yellow-700">Elevated</span><span className="text-muted-foreground ml-1">(SBP only)</span></span></td>
                      <td className="py-2 text-center font-mono font-bold text-yellow-700 pr-2">120–129</td>
                      <td className="py-2 text-center font-mono font-bold text-yellow-700">&lt;80</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3"><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" /><span className="font-semibold text-orange-700">Stage 1 HTN</span></span></td>
                      <td className="py-2 text-center font-mono font-bold text-orange-700 pr-2">130–139</td>
                      <td className="py-2 text-center font-mono font-bold text-orange-700">80–89</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3"><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" /><span className="font-semibold text-red-700">Stage 2 HTN</span></span></td>
                      <td className="py-2 text-center font-mono font-bold text-red-700 pr-2">≥140</td>
                      <td className="py-2 text-center font-mono font-bold text-red-700">≥90</td>
                    </tr>
                  </tbody>
                ) : (
                  // Ages 1–12: percentile-based categories
                  <tbody className="divide-y divide-rose-50">
                    <tr className="bg-red-100/50">
                      <td className="py-2 pr-3"><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-700 flex-shrink-0" /><span className="font-semibold text-red-800">Hypotension</span><span className="text-muted-foreground">(SBP)</span></span></td>
                      <td className="py-2 text-center font-mono font-bold text-red-800 pr-2" colSpan={2}>SBP &lt; {reference.systolicHypotension}</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3"><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" /><span className="font-semibold text-green-700">Normal</span><span className="text-muted-foreground">(&lt;90th)</span></span></td>
                      <td className="py-2 text-center font-mono font-bold text-green-700 pr-2">&lt;{reference.systolic90}</td>
                      <td className="py-2 text-center font-mono font-bold text-green-700">&lt;{reference.diastolic90}</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3"><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" /><span className="font-semibold text-yellow-700">Elevated</span><span className="text-muted-foreground">(90–95th)</span></span></td>
                      <td className="py-2 text-center font-mono font-bold text-yellow-700 pr-2">{reference.systolic90}–{reference.systolic95 - 1}</td>
                      <td className="py-2 text-center font-mono font-bold text-yellow-700">{reference.diastolic90}–{reference.diastolic95 - 1}</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3"><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" /><span className="font-semibold text-orange-700">Stage 1 HTN</span><span className="text-muted-foreground">(≥95th)</span></span></td>
                      <td className="py-2 text-center font-mono font-bold text-orange-700 pr-2">{reference.systolic95}–{reference.systolic95 + 11}</td>
                      <td className="py-2 text-center font-mono font-bold text-orange-700">{reference.diastolic95}–{reference.diastolic95 + 11}</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3"><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" /><span className="font-semibold text-red-700">Stage 2 HTN</span><span className="text-muted-foreground">(≥95th+12)</span></span></td>
                      <td className="py-2 text-center font-mono font-bold text-red-700 pr-2">≥{reference.systolic95 + 12}</td>
                      <td className="py-2 text-center font-mono font-bold text-red-700">≥{reference.diastolic95 + 12}</td>
                    </tr>
                  </tbody>
                )}
              </table>
              <div className="mt-4 pt-3 border-t border-rose-100 flex items-center gap-2 text-[10px] text-muted-foreground">
                <Info className="h-3 w-3 flex-shrink-0" />
                Median normal (50th): <span className="font-mono font-bold ml-1">{reference.systolic50}/{reference.diastolic50} mmHg</span>
              </div>
            </CardContent>
          </Card>
        ) : !isAgeValid && (
          <div className="h-full min-h-[350px] flex flex-col items-center justify-center border-4 border-dashed rounded-[40px] p-12 text-center bg-muted/20 border-muted/30">
            <HeartPulse className="h-16 w-16 text-rose-200 mb-6" />
            <h3 className="text-xl font-black text-muted-foreground/80 tracking-tight">BP Percentile Engine</h3>
            <p className="text-muted-foreground font-medium text-sm mt-3 leading-relaxed max-w-[280px]">
              Enter patient age to see normal BP ranges, then add measured BP for full classification.
            </p>
          </div>
        )}

        {isAgeValid && reference && (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3 text-rose-700 font-black text-[10px] uppercase tracking-widest">
                <Info className="h-3.5 w-3.5" /> Classification Guide
              </div>
              {ageNum >= 13 ? (
                <div className="space-y-2 text-[11px] leading-relaxed">
                  <p>• <strong>Hypotension:</strong> SBP &lt; {reference.systolicHypotension} — possible shock.</p>
                  <p>• <strong>Normal:</strong> SBP &lt; 120 AND DBP &lt; 80.</p>
                  <p>• <strong>Elevated:</strong> SBP 120–129 AND DBP &lt; 80.</p>
                  <p>• <strong>Stage 1 HTN:</strong> SBP ≥ 130 OR DBP ≥ 80.</p>
                  <p>• <strong>Stage 2 HTN:</strong> SBP ≥ 140 OR DBP ≥ 90.</p>
                  <p className="text-muted-foreground mt-1">Per AAP 2017 — adolescents ≥ 13 use adult ACC/AHA criteria. Hypotension threshold is the PALS/APLS lower-limit-of-normal SBP rule (&gt;10 yrs: &lt;90) — a bedside approximation, not a percentile. Validated population data can run 5–10 mmHg higher; treat any borderline low reading as clinically significant.</p>
                </div>
              ) : (
                <div className="space-y-2 text-[11px] leading-relaxed">
                  <p>• <strong>Hypotension:</strong> SBP &lt; {reference.systolicHypotension} — possible shock.</p>
                  <p>• <strong>Normal:</strong> &lt; 90th percentile.</p>
                  <p>• <strong>Elevated:</strong> 90th to &lt; 95th percentile.</p>
                  <p>• <strong>Stage 1 HTN:</strong> 95th to &lt; 95th + 12 mmHg.</p>
                  <p>• <strong>Stage 2 HTN:</strong> ≥ 95th + 12 mmHg OR ≥ 140/90.</p>
                  <p className="text-muted-foreground mt-1">Hypotension threshold is the PALS/APLS lower-limit-of-normal SBP rule (1–10 yrs: 70 + 2×age) — a bedside approximation, not a percentile. Validated population data can run 5–10 mmHg higher; treat any borderline low reading as clinically significant.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ─── Term infant (0–12 months) ───────────────────────────────────────────────

type InfantSeverity = "hypotensive" | "normal" | "elevated" | "hypertensive";

const INFANT_CONFIG: Record<InfantSeverity, { label: string; color: string; bg: string; border: string }> = {
  "hypotensive":  { label: "Hypotension",  color: "text-red-700",    bg: "bg-red-50",    border: "border-red-300" },
  "normal":       { label: "Normal",        color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200" },
  "elevated":     { label: "Elevated BP",   color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-300" },
  "hypertensive": { label: "Hypertension",  color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-300" },
};

const INFANT_ACTIONS: Record<InfantSeverity, string> = {
  "hypotensive":  "Assess shock signs (cap refill, HR, perfusion, UO). IV access. Consider 10 mL/kg NS bolus. Urgent senior/neonatology review. Investigate: sepsis, cardiac, adrenal insufficiency.",
  "normal":       "BP within normal range for age. Continue routine monitoring.",
  "elevated":     "Repeat after 5 min rest (right arm, correct cuff size). If persistent, repeat at next visit. Exclude pain, anxiety, or equipment error.",
  "hypertensive": "Confirm on repeat measurement. Investigate: renal (US), cardiac (echo, CXR), endocrine, medications. Nephrology or neonatology review.",
};

function InfantSection() {
  const [sex, setSex]               = useState<"male" | "female">("male");
  const [ageUnit, setAgeUnit]       = useState<"days" | "months">("months");
  const [ageInput, setAgeInput]     = useState<string>("");
  const [systolic, setSystolic]     = useState<string>("");
  const [diastolic, setDiastolic]   = useState<string>("");

  const ageNum = parseFloat(ageInput);
  const sNum = parseFloat(systolic);
  const dNum = parseFloat(diastolic);

  const isAgeValid = ageUnit === "days"
    ? !isNaN(ageNum) && ageNum >= 0 && ageNum <= 30
    : !isNaN(ageNum) && ageNum >= 0 && ageNum <= 12;

  // Internal reference lookup always uses fractional months (day of life ÷ 30.4375)
  const mNum = ageUnit === "days" ? ageNum / 30.4375 : ageNum;

  const isBpValid  = isAgeValid && !isNaN(sNum) && sNum > 0 && !isNaN(dNum) && dNum > 0 && sNum > dNum;

  const mapCalc = isBpValid ? Math.round(dNum + (sNum - dNum) / 3) : null;

  const reference = useMemo(() => {
    if (!isAgeValid) return null;
    return calculateTermInfantBPReference(mNum, sex);
  }, [mNum, sex, isAgeValid]);

  const classification = useMemo<InfantSeverity | null>(() => {
    if (!isBpValid || !reference || mapCalc === null) return null;
    if (mapCalc < reference.mapHypotension)          return "hypotensive";
    if (sNum >= reference.sbp95 || dNum >= reference.dbp95) return "hypertensive";
    if (sNum >= reference.sbp90 || dNum >= reference.dbp90) return "elevated";
    return "normal";
  }, [isBpValid, reference, mapCalc, sNum, dNum]);

  const cfg = classification ? INFANT_CONFIG[classification] : null;

  const ageLabel = isAgeValid
    ? ageUnit === "days"
      ? `${ageNum} day${ageNum !== 1 ? "s" : ""} old`
      : mNum < 1
        ? `${Math.round(mNum * 4.33)} wk${Math.round(mNum * 4.33) !== 1 ? "s" : ""}`
        : `${mNum % 1 === 0 ? mNum : mNum.toFixed(1)} mo`
    : "?";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* INPUTS */}
      <Card className="border-2 border-rose-100 shadow-sm h-fit">
        <CardHeader className="bg-rose-50/50 pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Baby className="h-4 w-4 text-rose-600" /> Infant Profile
          </CardTitle>
          <CardDescription className="text-[11px]">Term babies — birth to 12 months (≥ 37 wks GA)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground">Biological Sex</Label>
              <Select value={sex} onValueChange={(v: any) => setSex(v)}>
                <SelectTrigger className="active:scale-95"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground">Age</Label>
                <div className="flex rounded-md border border-rose-200 overflow-hidden flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => { setAgeUnit("days"); setAgeInput(""); }}
                    className={cn(
                      "px-2 py-0.5 text-[9px] font-black uppercase tracking-wide transition-colors",
                      ageUnit === "days" ? "bg-rose-600 text-white" : "bg-white text-muted-foreground hover:text-rose-600"
                    )}
                  >
                    Days
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAgeUnit("months"); setAgeInput(""); }}
                    className={cn(
                      "px-2 py-0.5 text-[9px] font-black uppercase tracking-wide transition-colors",
                      ageUnit === "months" ? "bg-rose-600 text-white" : "bg-white text-muted-foreground hover:text-rose-600"
                    )}
                  >
                    Months
                  </button>
                </div>
              </div>
              <Input
                type="number" inputMode="decimal" placeholder={ageUnit === "days" ? "0–30" : "0–12"}
                value={ageInput} onChange={e => setAgeInput(e.target.value)}
                className={cn(!isAgeValid && ageInput ? "border-red-300" : "")}
              />
              {ageUnit === "days" && (
                <p className="text-[9px] text-muted-foreground leading-tight">Day of life 0–30 — for neonates in the first month.</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-rose-700">Systolic (mmHg)</Label>
              <Input type="number" inputMode="decimal" placeholder="e.g. 80" className="h-12 font-mono text-xl border-rose-200" value={systolic} onChange={e => setSystolic(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-rose-700">Diastolic (mmHg)</Label>
              <Input type="number" inputMode="decimal" placeholder="e.g. 50" className="h-12 font-mono text-xl border-rose-200" value={diastolic} onChange={e => setDiastolic(e.target.value)} />
            </div>
          </div>

          {/* Auto MAP */}
          {isBpValid && mapCalc !== null && (
            <div className={cn("rounded-xl p-4 border-2 text-center transition-colors", cfg ? cfg.bg : "bg-muted/30", cfg ? cfg.border : "border-muted")}>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Mean Arterial Pressure</p>
              <p className={cn("text-4xl font-black font-mono", cfg ? cfg.color : "text-foreground")}>{mapCalc}</p>
              <p className="text-[10px] text-muted-foreground mt-1">mmHg · DBP + ⅓(SBP−DBP)</p>
              {reference && (
                <p className="text-[10px] font-bold mt-2 text-muted-foreground">
                  Hypotension threshold: <span className="font-mono">&lt;{reference.mapHypotension} mmHg MAP</span>
                </p>
              )}
            </div>
          )}

          <div className="rounded-lg bg-muted/40 p-3 text-[10px] text-muted-foreground leading-relaxed">
            <span className="font-black">Measurement:</span> Right upper arm, oscillometric. Cuff width = 40% arm circumference. Infant at rest ≥ 5 min.
          </div>
        </CardContent>
      </Card>

      {/* RESULTS */}
      <div className="space-y-5">
        {isBpValid && classification && cfg && mapCalc !== null && (
          <>
            <Card className={cn("border-2 shadow-md", cfg.bg, cfg.border)}>
              <CardHeader className="pb-2 text-center">
                <Badge className="w-fit mx-auto mb-2 bg-rose-600 uppercase font-black">BP Status</Badge>
                <CardTitle className={cn("text-2xl font-black font-headline tracking-tight", cfg.color)}>
                  {cfg.label}
                </CardTitle>
                {reference && (
                  <p className={cn("text-xs font-medium mt-1", cfg.color)}>
                    {sNum}/{dNum} mmHg · MAP {mapCalc} mmHg
                    {classification === "hypotensive" && ` · Threshold <${reference.mapHypotension}`}
                    {(classification === "hypertensive" || classification === "elevated") && ` · 95th ${reference.sbp95}/${reference.dbp95}`}
                  </p>
                )}
              </CardHeader>
            </Card>

            {classification !== "normal" && (
              <Alert className={cn("border-2 shadow-sm", cfg.border, cfg.bg)}>
                <ShieldAlert className={cn("h-5 w-5", cfg.color)} />
                <AlertTitle className={cn("font-black uppercase tracking-widest text-xs", cfg.color)}>Clinical Action</AlertTitle>
                <AlertDescription className="text-xs font-medium leading-relaxed text-foreground/80 mt-1">
                  {INFANT_ACTIONS[classification]}
                </AlertDescription>
              </Alert>
            )}
          </>
        )}

        {/* Reference table */}
        {isAgeValid && reference ? (
          <Card className="border-2 border-rose-100 shadow-sm">
            <CardHeader className="bg-rose-50/50 pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-rose-800">
                <Activity className="h-4 w-4 text-rose-600" />
                Normal BP — {ageLabel} {sex === "male" ? "Male" : "Female"}
              </CardTitle>
              <CardDescription className="text-[11px]">NHBPEP 2004 / Dionne 2012 — term infant reference</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-4">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-rose-100">
                    <th className="text-left pb-2 font-black text-muted-foreground uppercase tracking-wide pr-3">Category</th>
                    <th className="text-center pb-2 font-black text-muted-foreground uppercase tracking-wide pr-2">Systolic</th>
                    <th className="text-center pb-2 font-black text-muted-foreground uppercase tracking-wide">Diastolic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-50">
                  <tr className="bg-red-50/40">
                    <td className="py-2 pr-3">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                        <span className="font-semibold text-red-700">Hypotension</span>
                        <span className="text-muted-foreground">(MAP)</span>
                      </span>
                    </td>
                    <td className="py-2 text-center font-mono font-bold text-red-700 pr-2 col-span-2" colSpan={2}>MAP &lt; {reference.mapHypotension} mmHg</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3"><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" /><span className="font-semibold text-green-700">Normal</span><span className="text-muted-foreground">(&lt;90th)</span></span></td>
                    <td className="py-2 text-center font-mono font-bold text-green-700 pr-2">&lt;{reference.sbp90}</td>
                    <td className="py-2 text-center font-mono font-bold text-green-700">&lt;{reference.dbp90}</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3"><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" /><span className="font-semibold text-yellow-700">Elevated</span><span className="text-muted-foreground">(90–95th)</span></span></td>
                    <td className="py-2 text-center font-mono font-bold text-yellow-700 pr-2">{reference.sbp90}–{reference.sbp95 - 1}</td>
                    <td className="py-2 text-center font-mono font-bold text-yellow-700">{reference.dbp90}–{reference.dbp95 - 1}</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3"><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" /><span className="font-semibold text-orange-700">Hypertension</span><span className="text-muted-foreground">(≥95th)</span></span></td>
                    <td className="py-2 text-center font-mono font-bold text-orange-700 pr-2">≥{reference.sbp95}</td>
                    <td className="py-2 text-center font-mono font-bold text-orange-700">≥{reference.dbp95}</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4 pt-3 border-t border-rose-100 flex items-center gap-2 text-[10px] text-muted-foreground">
                <Info className="h-3 w-3 flex-shrink-0" />
                Median normal (50th): <span className="font-mono font-bold ml-1">{reference.sbp50}/{reference.dbp50} mmHg</span>
              </div>
            </CardContent>
          </Card>
        ) : !isAgeValid && (
          <div className="min-h-[300px] flex flex-col items-center justify-center border-4 border-dashed rounded-[40px] p-12 text-center bg-muted/20 border-muted/30">
            <HeartPulse className="h-14 w-14 text-rose-200 mb-5" />
            <h3 className="text-lg font-black text-muted-foreground/80 tracking-tight">Term Infant BP</h3>
            <p className="text-muted-foreground font-medium text-sm mt-3 leading-relaxed max-w-[260px]">
              Enter age in months (0–12), or switch to days for the first month of life, to see normal BP ranges. Add BP values to classify.
            </p>
          </div>
        )}

        {isAgeValid && reference && (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-2 mb-3 text-rose-700 font-black text-[10px] uppercase tracking-widest">
                <Info className="h-3.5 w-3.5" /> Infant BP Guide
              </div>
              <div className="space-y-1.5 text-[11px] leading-relaxed">
                <p>• <strong>Hypotension:</strong> MAP &lt; {reference.mapHypotension} mmHg — urgent evaluation.</p>
                <p>• <strong>Normal:</strong> SBP &lt; {reference.sbp90} AND DBP &lt; {reference.dbp90} mmHg.</p>
                <p>• <strong>Elevated:</strong> SBP/DBP ≥ 90th — repeat after 5 min rest.</p>
                <p>• <strong>Hypertension:</strong> SBP ≥ {reference.sbp95} OR DBP ≥ {reference.dbp95} — investigate.</p>
                <p className="text-muted-foreground mt-1">Source: NHBPEP 2004 / Dionne 2012 (Pediatr Nephrol). Term infants (≥ 37 wks GA) only.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ─── Preterm neonate ─────────────────────────────────────────────────────────

type PretermSeverity = "severe-hypotension" | "hypotension" | "borderline" | "normal" | "hypertension";

const PRETERM_SEVERITY_CONFIG: Record<PretermSeverity, { label: string; color: string; bg: string; border: string }> = {
  "severe-hypotension": { label: "Severe Hypotension",  color: "text-red-700",    bg: "bg-red-50",    border: "border-red-300" },
  "hypotension":        { label: "Hypotension",         color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-300" },
  "borderline":         { label: "Borderline Low",      color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-300" },
  "normal":             { label: "Normal",              color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200" },
  "hypertension":       { label: "Hypertension",        color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-300" },
};

const PRETERM_ACTIONS: Record<PretermSeverity, string> = {
  "severe-hypotension": "Immediate IV fluid bolus 10 mL/kg NS over 15–30 min. Start Dopamine 5–10 mcg/kg/min. Urgent senior/NICU review. Assess for sepsis, cardiac dysfunction.",
  "hypotension":        "IV fluid challenge 10 mL/kg NS over 30 min, reassess MAP. Start Dopamine if no response after 2 boluses. Monitor UO and capillary refill.",
  "borderline":         "Monitor BP every 15–30 min. Assess perfusion signs (cap refill, UO, lactate). Ensure normothermia. Prepare for possible intervention.",
  "normal":             "BP within normal range for GA and postnatal age. Continue routine monitoring.",
  "hypertension":       "Investigate: renal artery thrombosis (renal US), coarctation (CXR, echo), pain, medications (dexamethasone, caffeine). Senior review.",
};

function PretermSection() {
  const [ga, setGa]             = useState<string>("");
  const [day, setDay]           = useState<string>("1");
  const [systolic, setSystolic] = useState<string>("");
  const [diastolic, setDiastolic] = useState<string>("");

  const gaNum  = parseInt(ga);
  const dayNum = parseInt(day);
  const sNum   = parseFloat(systolic);
  const dNum   = parseFloat(diastolic);

  const isGaValid  = !isNaN(gaNum) && gaNum >= 23 && gaNum <= 36;
  const isBpValid  = isGaValid && !isNaN(sNum) && sNum > 0 && !isNaN(dNum) && dNum > 0 && sNum > dNum;

  const mapCalc = isBpValid ? Math.round(dNum + (sNum - dNum) / 3) : null;

  const reference = useMemo(() => {
    if (!isGaValid) return null;
    return calculatePretermBPReference(gaNum, dayNum);
  }, [gaNum, dayNum, isGaValid]);

  const classification = useMemo<PretermSeverity | null>(() => {
    if (!isBpValid || !reference || mapCalc === null) return null;
    if (mapCalc < reference.mapSevere)      return "severe-hypotension";
    if (mapCalc < reference.mapHypotension) return "hypotension";
    if (mapCalc < reference.mapHypotension + 5) return "borderline";
    if (sNum > reference.sbp95 || dNum > reference.dbp95) return "hypertension";
    return "normal";
  }, [isBpValid, reference, mapCalc, sNum, dNum]);

  const cfg = classification ? PRETERM_SEVERITY_CONFIG[classification] : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* INPUTS */}
      <Card className="border-2 border-rose-100 shadow-sm h-fit">
        <CardHeader className="bg-rose-50/50 pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Baby className="h-4 w-4 text-rose-600" /> Preterm Profile
          </CardTitle>
          <CardDescription className="text-[11px]">For neonates born at 23–36 weeks gestation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground">GA at Birth (weeks)</Label>
              <Input
                type="number" inputMode="numeric" placeholder="23–36"
                value={ga} onChange={e => setGa(e.target.value)}
                className={cn(!isGaValid && ga ? "border-red-300" : "")}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground">Postnatal Day</Label>
              <Select value={day} onValueChange={setDay}>
                <SelectTrigger className="active:scale-95"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7].map(d => (
                    <SelectItem key={d} value={String(d)}>Day {d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-rose-700">Systolic (mmHg)</Label>
              <Input type="number" inputMode="decimal" placeholder="e.g. 45" className="h-12 font-mono text-xl border-rose-200" value={systolic} onChange={e => setSystolic(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-rose-700">Diastolic (mmHg)</Label>
              <Input type="number" inputMode="decimal" placeholder="e.g. 25" className="h-12 font-mono text-xl border-rose-200" value={diastolic} onChange={e => setDiastolic(e.target.value)} />
            </div>
          </div>

          {/* Auto MAP display */}
          {isBpValid && mapCalc !== null && (
            <div className={cn("rounded-xl p-4 border-2 text-center transition-colors", cfg ? cfg.bg : "bg-muted/30", cfg ? cfg.border : "border-muted")}>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Mean Arterial Pressure</p>
              <p className={cn("text-4xl font-black font-mono", cfg ? cfg.color : "text-foreground")}>{mapCalc}</p>
              <p className="text-[10px] text-muted-foreground mt-1">mmHg &nbsp;·&nbsp; DBP + ⅓(SBP−DBP)</p>
              {reference && (
                <p className="text-[10px] font-bold mt-2 text-muted-foreground">
                  GA rule threshold: <span className="font-mono">{reference.mapHypotension} mmHg</span>
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* RESULTS */}
      <div className="space-y-5">
        {/* Classification */}
        {isBpValid && classification && cfg && mapCalc !== null && (
          <>
            <Card className={cn("border-2 shadow-md", cfg.bg, cfg.border)}>
              <CardHeader className="pb-2 text-center">
                <Badge className="w-fit mx-auto mb-2 bg-rose-600 uppercase font-black">BP Status</Badge>
                <CardTitle className={cn("text-2xl font-black font-headline tracking-tight", cfg.color)}>
                  {cfg.label}
                </CardTitle>
                {reference && (
                  <p className={cn("text-xs font-medium mt-1", cfg.color)}>
                    MAP {mapCalc} mmHg &nbsp;·&nbsp; Threshold {reference.mapHypotension} mmHg (GA rule)
                  </p>
                )}
              </CardHeader>
            </Card>

            <Alert
              className={cn("border-2 shadow-sm", cfg.border, cfg.bg)}
            >
              <ShieldAlert className={cn("h-5 w-5", cfg.color)} />
              <AlertTitle className={cn("font-black uppercase tracking-widest text-xs", cfg.color)}>
                {classification === "normal" ? "Routine Monitoring" : "Clinical Action"}
              </AlertTitle>
              <AlertDescription className="text-xs font-medium leading-relaxed text-foreground/80 mt-1">
                {PRETERM_ACTIONS[classification]}
              </AlertDescription>
            </Alert>
          </>
        )}

        {/* Reference table — shown as soon as GA is valid */}
        {isGaValid && reference ? (
          <Card className="border-2 border-rose-100 shadow-sm">
            <CardHeader className="bg-rose-50/50 pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-rose-800">
                <Activity className="h-4 w-4 text-rose-600" />
                Normal BP — {gaNum} wk, Day {dayNum}
              </CardTitle>
              <CardDescription className="text-[11px]">
                Zubrow 1995 / Nuntnarumit 1999 — NICU screening estimates
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-4">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-rose-100">
                    <th className="text-left pb-2 font-black text-muted-foreground uppercase tracking-wide pr-2">Percentile</th>
                    <th className="text-center pb-2 font-black text-muted-foreground uppercase tracking-wide pr-2">Systolic</th>
                    <th className="text-center pb-2 font-black text-muted-foreground uppercase tracking-wide pr-2">Diastolic</th>
                    <th className="text-center pb-2 font-black text-muted-foreground uppercase tracking-wide">MAP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-50">
                  <tr>
                    <td className="py-2 pr-2 font-semibold text-muted-foreground">5th</td>
                    <td className="py-2 text-center font-mono font-bold pr-2">{reference.sbp5}</td>
                    <td className="py-2 text-center font-mono font-bold pr-2">{reference.dbp5}</td>
                    <td className="py-2 text-center font-mono font-bold">{reference.map5}</td>
                  </tr>
                  <tr className="bg-green-50/60">
                    <td className="py-2 pr-2 font-black text-green-700">50th (median)</td>
                    <td className="py-2 text-center font-mono font-black text-green-700 pr-2">{reference.sbp50}</td>
                    <td className="py-2 text-center font-mono font-black text-green-700 pr-2">{reference.dbp50}</td>
                    <td className="py-2 text-center font-mono font-black text-green-700">{reference.map50}</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-2 font-semibold text-muted-foreground">95th</td>
                    <td className="py-2 text-center font-mono font-bold pr-2">{reference.sbp95}</td>
                    <td className="py-2 text-center font-mono font-bold pr-2">{reference.dbp95}</td>
                    <td className="py-2 text-center font-mono font-bold">{reference.map95}</td>
                  </tr>
                </tbody>
              </table>

              {/* Hypotension thresholds — the key clinical values */}
              <div className="mt-4 pt-3 border-t border-rose-100 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                    <span className="font-bold text-orange-700">Hypotension threshold (GA rule)</span>
                  </span>
                  <span className="font-mono font-black text-orange-700">MAP &lt; {reference.mapHypotension}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" />
                    <span className="font-bold text-red-700">Severe hypotension</span>
                  </span>
                  <span className="font-mono font-black text-red-700">MAP &lt; {reference.mapSevere}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : !isGaValid && (
          <div className="min-h-[300px] flex flex-col items-center justify-center border-4 border-dashed rounded-[40px] p-12 text-center bg-muted/20 border-muted/30">
            <Baby className="h-14 w-14 text-rose-200 mb-5" />
            <h3 className="text-lg font-black text-muted-foreground/80 tracking-tight">Preterm BP Assessment</h3>
            <p className="text-muted-foreground font-medium text-sm mt-3 leading-relaxed max-w-[260px]">
              Enter gestational age (23–36 wks) to see normal ranges. Add measured BP to classify.
            </p>
          </div>
        )}

        {/* Guide */}
        {isGaValid && (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-2 mb-3 text-rose-700 font-black text-[10px] uppercase tracking-widest">
                <Info className="h-3.5 w-3.5" /> Preterm BP Guide
              </div>
              <div className="space-y-1.5 text-[11px] leading-relaxed">
                <p>• <strong>GA Rule:</strong> MAP (mmHg) should be ≥ GA (weeks). (Miall-Allen 1987)</p>
                <p>• <strong>Hypotension:</strong> MAP &lt; GA. Volume ± vasopressors.</p>
                <p>• <strong>Severe hypotension:</strong> MAP &lt; GA − 5. Treat immediately.</p>
                <p>• <strong>Borderline:</strong> MAP ≥ GA to GA+4. Watch closely.</p>
                <p>• <strong>Hypertension:</strong> SBP or DBP &gt; 95th percentile. Investigate cause.</p>
                <p className="text-muted-foreground mt-1">Severe threshold (GA−5) is a practical approximation — no single validated cutoff exists in the literature.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ─── Page shell ───────────────────────────────────────────────────────────────

export default function BpPercentilePage() {
  const [mode, setMode] = useState<"term" | "infant" | "preterm">("term");

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary active:scale-95">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-200">
          <HeartPulse className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Blood Pressure Percentiles</h1>
          <p className="text-muted-foreground text-sm font-medium">Pediatric BP Classification — Child & Preterm Neonate</p>
        </div>
      </div>

      {/* Mode switcher */}
      <div className="flex rounded-xl border border-rose-200 bg-rose-50/40 p-1 mb-8 w-fit gap-1">
        <button
          onClick={() => setMode("term")}
          className={cn(
            "px-5 py-2 rounded-lg text-sm font-bold transition-all",
            mode === "term"
              ? "bg-white shadow text-rose-700 shadow-rose-100"
              : "text-muted-foreground hover:text-rose-600"
          )}
        >
          Child (1–18 yrs)
        </button>
        <button
          onClick={() => setMode("infant")}
          className={cn(
            "px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5",
            mode === "infant"
              ? "bg-white shadow text-rose-700 shadow-rose-100"
              : "text-muted-foreground hover:text-rose-600"
          )}
        >
          <Baby className="h-3.5 w-3.5" /> Infant (0–12 mo)
        </button>
        <button
          onClick={() => setMode("preterm")}
          className={cn(
            "px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5",
            mode === "preterm"
              ? "bg-white shadow text-rose-700 shadow-rose-100"
              : "text-muted-foreground hover:text-rose-600"
          )}
        >
          <Baby className="h-3.5 w-3.5" /> Preterm Neonate
        </button>
      </div>

      {mode === "term" ? <TermSection /> : mode === "infant" ? <InfantSection /> : <PretermSection />}
    </div>
  );
}
