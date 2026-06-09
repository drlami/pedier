import { useState, useMemo } from "react";
import { Activity, Info, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PHASES = [
  { id: "honeymoon", label: "Honeymoon Phase", description: "Partial remission — residual beta-cell function. Often within first year of diagnosis.", tdd: [0.3, 0.5], color: "emerald" },
  { id: "prepubertal", label: "Pre-pubertal", description: "Age typically 2–9 years, not yet in puberty.", tdd: [0.5, 0.7], color: "amber" },
  { id: "pubertal", label: "Pubertal / Adolescent", description: "Increased insulin resistance from growth hormones.", tdd: [0.7, 1.0], color: "orange" },
  { id: "pubertal_high", label: "Late Puberty / High Resistance", description: "Peak insulin requirements; especially adolescent males.", tdd: [1.0, 1.5], color: "red" },
];

export default function DiabetesInsulinPage() {
  const [weight, setWeight] = useState("");
  const [phase, setPhase] = useState<string>("prepubertal");
  const [customTDD, setCustomTDD] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const selectedPhase = PHASES.find(p => p.id === phase)!;

  const result = useMemo(() => {
    const wt = parseFloat(weight);
    if (!wt || wt <= 0) return null;

    let tddMin: number, tddMax: number, tddMid: number;
    if (useCustom && customTDD) {
      tddMid = parseFloat(customTDD);
      tddMin = tddMid;
      tddMax = tddMid;
    } else {
      tddMin = +(wt * selectedPhase.tdd[0]).toFixed(1);
      tddMax = +(wt * selectedPhase.tdd[1]).toFixed(1);
      tddMid = +((tddMin + tddMax) / 2).toFixed(1);
    }

    const basalMin = +(tddMin * 0.4).toFixed(1);
    const basalMax = +(tddMax * 0.5).toFixed(1);
    const bolusMin = +(tddMin * 0.5).toFixed(1);
    const bolusMax = +(tddMax * 0.6).toFixed(1);

    const isf = Math.round(1700 / tddMid);
    const icr = Math.round(500 / tddMid);

    const bolusPerMeal = +(tddMid * 0.55 / 3).toFixed(1);

    return { tddMin, tddMax, tddMid, basalMin, basalMax, bolusMin, bolusMax, isf, icr, bolusPerMeal };
  }, [weight, phase, customTDD, useCustom, selectedPhase]);

  const colorMap: Record<string, string> = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber:   "border-amber-200 bg-amber-50 text-amber-700",
    orange:  "border-orange-200 bg-orange-50 text-orange-700",
    red:     "border-red-200 bg-red-50 text-red-700",
  };
  const badgeMap: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-800",
    amber:   "bg-amber-100 text-amber-800",
    orange:  "bg-orange-100 text-orange-800",
    red:     "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-blue-100 text-blue-700">
          <Activity className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Type 1 Diabetes Insulin Dose</h1>
          <p className="text-muted-foreground text-sm mt-1">
            TDD estimation by phase, basal-bolus split, insulin sensitivity factor (ISF) and insulin-to-carb ratio (ICR).
          </p>
        </div>
      </div>

      <Alert className="rounded-2xl border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 text-sm">
          All doses are <strong>starting estimates only</strong>. Dose adjustments must be made by the diabetes team based on self-monitoring data, HbA1c, and clinical response. Do not apply without endocrinology or diabetes nurse review.
        </AlertDescription>
      </Alert>

      {/* Inputs */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Patient Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="font-bold text-sm">Weight</Label>
            <div className="relative w-44">
              <Input type="number" min={0} step={0.5} placeholder="e.g. 35"
                value={weight} onChange={e => setWeight(e.target.value)}
                className="pr-10 h-11 rounded-xl font-semibold" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">kg</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-sm">Disease Phase</Label>
            <div className="grid grid-cols-2 gap-2">
              {PHASES.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setPhase(p.id); setUseCustom(false); }}
                  className={cn(
                    "p-3 rounded-2xl border-2 text-left transition-all",
                    phase === p.id && !useCustom
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-muted/20 border-transparent hover:border-primary/30"
                  )}
                >
                  <p className="font-black text-sm">{p.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.tdd[0]}–{p.tdd[1]} U/kg/day</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-bold text-sm flex items-center gap-2">
              <input type="checkbox" checked={useCustom} onChange={e => setUseCustom(e.target.checked)} className="rounded" />
              Override with known TDD
            </Label>
            {useCustom && (
              <div className="relative w-44">
                <Input type="number" min={0} step={0.5} placeholder="e.g. 28"
                  value={customTDD} onChange={e => setCustomTDD(e.target.value)}
                  className="pr-12 h-11 rounded-xl font-semibold" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">U/day</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Phase info */}
      {!useCustom && (
        <Card className={cn("rounded-3xl border-2", colorMap[selectedPhase.color])}>
          <CardContent className="pt-4 pb-4 flex items-start justify-between gap-3">
            <div>
              <p className="font-black">{selectedPhase.label}</p>
              <p className="text-sm opacity-70">{selectedPhase.description}</p>
            </div>
            <Badge className={cn("shrink-0 font-bold", badgeMap[selectedPhase.color])}>
              {selectedPhase.tdd[0]}–{selectedPhase.tdd[1]} U/kg/day
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <Card className="rounded-3xl border-2 bg-primary/5 border-primary/20">
            <CardContent className="pt-5 pb-5">
              <p className="text-xs font-black uppercase tracking-widest text-primary/60 mb-1">Total Daily Dose (TDD)</p>
              <div className="text-4xl font-black text-primary">
                {result.tddMin === result.tddMax
                  ? `${result.tddMid} U/day`
                  : `${result.tddMin}–${result.tddMax} U/day`}
              </div>
              {result.tddMin !== result.tddMax && (
                <p className="text-sm text-muted-foreground mt-0.5">Mid-point: {result.tddMid} U/day for ISF/ICR calculations</p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="rounded-3xl border-2 border-indigo-200 bg-indigo-50">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs font-black uppercase tracking-widest text-indigo-600/60 mb-1">Basal Insulin (40–50%)</p>
                <p className="text-3xl font-black text-indigo-800">{result.basalMin}–{result.basalMax}</p>
                <p className="text-xs text-indigo-600/70 mt-0.5">U/day (once daily or BD)</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-2 border-violet-200 bg-violet-50">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs font-black uppercase tracking-widest text-violet-600/60 mb-1">Total Bolus (50–60%)</p>
                <p className="text-3xl font-black text-violet-800">{result.bolusMin}–{result.bolusMax}</p>
                <p className="text-xs text-violet-600/70 mt-0.5">U/day across meals (÷3)</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="rounded-3xl border-2">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs font-black uppercase tracking-widest opacity-50 mb-1">Insulin Sensitivity Factor</p>
                <p className="text-3xl font-black text-foreground">{result.isf}</p>
                <p className="text-xs text-muted-foreground mt-0.5">mg/dL drop per 1 U insulin</p>
                <p className="text-xs text-muted-foreground">Formula: 1700 ÷ TDD</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-2">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs font-black uppercase tracking-widest opacity-50 mb-1">Insulin:Carb Ratio</p>
                <p className="text-3xl font-black text-foreground">1:{result.icr}</p>
                <p className="text-xs text-muted-foreground mt-0.5">1 U per {result.icr} g carbohydrate</p>
                <p className="text-xs text-muted-foreground">Formula: 500 ÷ TDD</p>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-3xl border-2">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs font-black uppercase tracking-widest opacity-50 mb-2">Starting Bolus per Meal (equal split)</p>
              <p className="text-2xl font-black">{result.bolusPerMeal} U</p>
              <p className="text-xs text-muted-foreground mt-0.5">3 equal meals — adjust using ICR and carb counting when able</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Target glucose */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Glucose Targets (ISPAD 2022)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-black">Timing</th>
                  <th className="text-center py-2 font-black">Target (mg/dL)</th>
                  <th className="text-left py-2 pl-4 font-black">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y text-muted-foreground">
                {[
                  ["Fasting / pre-meal", "90–130", "Aim lower if able without hypos"],
                  ["2h post-meal", "< 180", "Post-prandial glucose"],
                  ["Bedtime", "90–150", "Must be > 90 to avoid nocturnal hypo"],
                  ["Overnight (3 AM)", "> 80", "Minimum to prevent nocturnal hypo"],
                  ["HbA1c target", "< 7.0%", "Individualise; avoid frequent hypos"],
                ].map(([time, target, note]) => (
                  <tr key={time}>
                    <td className="py-2 font-semibold text-foreground">{time}</td>
                    <td className="text-center py-2 font-bold text-primary">{target}</td>
                    <td className="py-2 pl-4">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Alert className="rounded-2xl border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 text-sm">
          <strong>Important:</strong> All starting doses require titration. Sick-day rules: never omit basal insulin. If vomiting and unable to eat, reduce bolus to 50%. Glucose &gt; 250 mg/dL with symptoms → check ketones. Always have glucagon kit available.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference: ISPAD Clinical Practice Consensus Guidelines 2022 · ADA Standards of Care 2024 · Danne T et al. <em>Pediatr Diabetes</em> 2018
      </p>
    </div>
  );
}
