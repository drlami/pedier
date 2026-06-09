import { useState, useMemo } from "react";
import { Activity, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

function stageByCreatinine(baseline: number, current: number): number | null {
  if (!baseline || !current || baseline <= 0 || current <= 0) return null;
  const ratio = current / baseline;
  const rise = current - baseline;
  if (ratio >= 3.0 || current >= 4.0) return 3;
  if (ratio >= 2.0) return 2;
  if (ratio >= 1.5 || rise >= 0.3) return 1;
  return 0;
}

function stageByUO(uoMlKgHr: number, durationHours: number): number | null {
  if (uoMlKgHr < 0 || durationHours <= 0) return null;
  if (uoMlKgHr < 0.3 && durationHours >= 24) return 3;
  if (uoMlKgHr === 0 && durationHours >= 12) return 3;
  if (uoMlKgHr < 0.5 && durationHours >= 12) return 2;
  if (uoMlKgHr < 0.5 && durationHours >= 6) return 1;
  return 0;
}

const STAGES = [
  { stage: 0, label: "No AKI", color: "emerald", creat: "Rise <0.3 mg/dL and ratio <1.5", uo: "UO ≥0.5 mL/kg/hr" },
  { stage: 1, label: "Stage 1", color: "amber",   creat: "Rise ≥0.3 mg/dL within 48h OR ×1.5–1.9 baseline", uo: "UO <0.5 mL/kg/hr for 6–12h" },
  { stage: 2, label: "Stage 2", color: "orange",  creat: "×2.0–2.9 baseline",   uo: "UO <0.5 mL/kg/hr for ≥12h" },
  { stage: 3, label: "Stage 3", color: "red",     creat: "×3.0 baseline OR SCr ≥4.0 mg/dL", uo: "UO <0.3 mL/kg/hr for ≥24h OR anuria ≥12h" },
];

const colorMap: Record<string, string> = {
  emerald: "text-emerald-700 border-emerald-200 bg-emerald-50",
  amber:   "text-amber-700 border-amber-200 bg-amber-50",
  orange:  "text-orange-700 border-orange-200 bg-orange-50",
  red:     "text-red-700 border-red-200 bg-red-50",
};

const MANAGEMENT: Record<number, string[]> = {
  0: ["Continue monitoring if risk factors present", "Maintain adequate hydration", "Avoid nephrotoxic medications if possible"],
  1: [
    "Identify and treat underlying cause (hypovolaemia, sepsis, nephrotoxins)",
    "Fluid resuscitation if prerenal component: 10–20 mL/kg isotonic saline",
    "Stop/adjust nephrotoxic drugs (NSAIDs, aminoglycosides, contrast agents)",
    "Monitor creatinine and urine output 4–8 hourly",
    "Renal team review if no improvement within 24–48 hours",
  ],
  2: [
    "All Stage 1 measures",
    "Strict fluid balance — consider indwelling urinary catheter",
    "Electrolyte monitoring: K⁺, bicarbonate, phosphate",
    "Treat hyperkalaemia, acidosis, fluid overload if present",
    "Early nephrology referral",
    "Consider renal ultrasound to exclude obstruction",
  ],
  3: [
    "All Stage 2 measures",
    "Urgent nephrology/PICU involvement",
    "Renal replacement therapy (CRRT/IHD) if: refractory hyperkalaemia, severe acidosis, fluid overload, uraemia",
    "Dietitian for renal diet — restrict potassium, phosphate, protein (moderate)",
    "Daily review for RRT indications",
  ],
};

export default function AKIStagingPage() {
  const [baseline, setBaseline] = useState("");
  const [current, setCurrent] = useState("");
  const [uoRate, setUoRate] = useState("");
  const [uoDuration, setUoDuration] = useState("");

  const creatStage = useMemo(() => stageByCreatinine(parseFloat(baseline), parseFloat(current)), [baseline, current]);
  const uoStage = useMemo(() => stageByUO(parseFloat(uoRate), parseFloat(uoDuration)), [uoRate, uoDuration]);

  const finalStage = useMemo(() => {
    const s: number[] = [];
    if (creatStage !== null) s.push(creatStage);
    if (uoStage !== null) s.push(uoStage);
    if (s.length === 0) return null;
    return Math.max(...s);
  }, [creatStage, uoStage]);

  const stageInfo = finalStage !== null ? STAGES[finalStage] : null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-cyan-100 text-cyan-700">
          <Activity className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Pediatric AKI Staging</h1>
          <p className="text-muted-foreground text-sm mt-1">
            KDIGO 2012 criteria — serum creatinine rise and urine output to stage acute kidney injury.
          </p>
        </div>
      </div>

      <Tabs defaultValue="creatinine">
        <TabsList className="rounded-2xl bg-muted/40 p-1">
          <TabsTrigger value="creatinine" className="rounded-xl font-bold text-xs uppercase tracking-widest px-5">Creatinine Criteria</TabsTrigger>
          <TabsTrigger value="urine" className="rounded-xl font-bold text-xs uppercase tracking-widest px-5">Urine Output</TabsTrigger>
        </TabsList>

        <TabsContent value="creatinine" className="mt-4">
          <Card className="rounded-3xl border-2">
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-bold text-sm">Baseline Creatinine</Label>
                  <p className="text-xs text-muted-foreground">Prior stable value or age-adjusted normal</p>
                  <div className="relative">
                    <Input type="number" min={0} step={0.1} placeholder="e.g. 0.7"
                      value={baseline} onChange={e => setBaseline(e.target.value)}
                      className="pr-14 h-11 rounded-xl font-semibold" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">mg/dL</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-sm">Current Creatinine</Label>
                  <p className="text-xs text-muted-foreground">Most recent measurement</p>
                  <div className="relative">
                    <Input type="number" min={0} step={0.1} placeholder="e.g. 1.8"
                      value={current} onChange={e => setCurrent(e.target.value)}
                      className="pr-14 h-11 rounded-xl font-semibold" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">mg/dL</span>
                  </div>
                </div>
              </div>
              {creatStage !== null && (
                <div className={cn("rounded-2xl p-4 border-2", colorMap[STAGES[creatStage].color])}>
                  <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Creatinine Stage</p>
                  <div className="flex items-center gap-3">
                    <p className="text-3xl font-black">{STAGES[creatStage].label}</p>
                    {baseline && current && (
                      <span className="text-sm opacity-70">
                        (×{(parseFloat(current)/parseFloat(baseline)).toFixed(2)} baseline,
                        +{(parseFloat(current)-parseFloat(baseline)).toFixed(2)} mg/dL)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="urine" className="mt-4">
          <Card className="rounded-3xl border-2">
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-bold text-sm">Urine Output Rate</Label>
                  <div className="relative">
                    <Input type="number" min={0} step={0.1} placeholder="e.g. 0.3"
                      value={uoRate} onChange={e => setUoRate(e.target.value)}
                      className="pr-20 h-11 rounded-xl font-semibold" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">mL/kg/hr</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-sm">Duration of Oliguria</Label>
                  <div className="relative">
                    <Input type="number" min={0} step={1} placeholder="e.g. 8"
                      value={uoDuration} onChange={e => setUoDuration(e.target.value)}
                      className="pr-10 h-11 rounded-xl font-semibold" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">hr</span>
                  </div>
                </div>
              </div>
              {uoStage !== null && (
                <div className={cn("rounded-2xl p-4 border-2", colorMap[STAGES[uoStage].color])}>
                  <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Urine Output Stage</p>
                  <p className="text-3xl font-black">{STAGES[uoStage].label}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Final stage */}
      {stageInfo && finalStage !== null && (
        <Card className={cn("rounded-3xl border-2", colorMap[stageInfo.color])}>
          <CardContent className="pt-6 pb-6">
            <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Final AKI Stage (use highest)</p>
            <p className="text-5xl font-black mb-4">{stageInfo.label}</p>
            <p className="font-black text-sm uppercase tracking-widest mb-3">Management</p>
            <div className="space-y-1.5">
              {MANAGEMENT[finalStage].map((m, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="mt-0.5 shrink-0 opacity-50">•</span>
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* KDIGO criteria table */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            KDIGO 2012 — AKI Staging Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-3 font-black">Stage</th>
                  <th className="text-left py-2 pr-3 font-black">Creatinine Criteria</th>
                  <th className="text-left py-2 font-black">Urine Output</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {STAGES.slice(1).map(s => (
                  <tr key={s.stage}>
                    <td className="py-2 pr-3"><Badge className={cn("font-black text-xs", badgeFromColor(s.color))}>{s.label}</Badge></td>
                    <td className="py-2 pr-3 text-muted-foreground">{s.creat}</td>
                    <td className="py-2 text-muted-foreground">{s.uo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            AKI is also defined as increase in SCr ≥0.3 mg/dL within 48 h OR an increase to ≥1.5× baseline within 7 days. Stage using whichever criterion gives the highest stage.
          </p>
        </CardContent>
      </Card>

      <Alert className="rounded-2xl border-cyan-200 bg-cyan-50">
        <AlertTriangle className="h-4 w-4 text-cyan-600" />
        <AlertDescription className="text-cyan-800 text-sm">
          <strong>Baseline creatinine:</strong> Use lowest creatinine within 3 months. If unknown, use age-/sex-adjusted upper limit of normal (AKIN criteria). Neonates have higher baseline creatinine reflecting maternal levels — use caution in the first 48 hours of life.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference: KDIGO AKI Work Group. <em>Kidney Int Suppl</em> 2012;2:1–138
      </p>
    </div>
  );
}

function badgeFromColor(color: string) {
  return color === "amber" ? "bg-amber-100 text-amber-800"
    : color === "orange" ? "bg-orange-100 text-orange-800"
    : color === "red" ? "bg-red-100 text-red-800"
    : "bg-emerald-100 text-emerald-800";
}
