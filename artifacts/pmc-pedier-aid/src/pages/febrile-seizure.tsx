import { useState, useMemo } from "react";
import { Zap, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const RECURRENCE_FACTORS = [
  { id: "age_under18m", label: "Age < 18 months at first febrile seizure", points: 1 },
  { id: "family_hx", label: "Family history of febrile seizures (first-degree relative)", points: 1 },
  { id: "low_temp", label: "Seizure at relatively low temperature (< 38°C)", points: 1 },
  { id: "brief_fever", label: "Duration of fever before seizure < 1 hour", points: 1 },
];

const COMPLEX_FEATURES = [
  { id: "focal", label: "Focal (partial) onset or focal neurological signs during/after" },
  { id: "prolonged", label: "Duration > 15 minutes (prolonged febrile seizure)" },
  { id: "multiple", label: "Multiple seizures within 24 hours (>1 episode in same febrile illness)" },
  { id: "postictal", label: "Prolonged post-ictal deficit (Todd's paralysis > 30 minutes)" },
  { id: "no_return", label: "Failure to return to baseline within 1 hour" },
];

const RISK_TABLE = [
  { risk: 0, recurrence: "12%", label: "Low Risk" },
  { risk: 1, recurrence: "25%", label: "Moderate Risk" },
  { risk: 2, recurrence: "50%", label: "High Risk" },
  { risk: 3, recurrence: "73%", label: "Very High Risk" },
  { risk: 4, recurrence: "73%", label: "Very High Risk" },
];

export default function FebrileSeizurePage() {
  const [factors, setFactors] = useState<string[]>([]);
  const [complexFeatures, setComplexFeatures] = useState<string[]>([]);

  function toggle(list: string[], setList: (v: string[]) => void, id: string) {
    setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  }

  const score = factors.length;
  const isComplex = complexFeatures.length > 0;

  const riskData = useMemo(() => {
    return RISK_TABLE[Math.min(score, 4)];
  }, [score]);

  const colorMap: Record<string, string> = {
    emerald: "text-emerald-700 border-emerald-200 bg-emerald-50",
    amber:   "text-amber-700 border-amber-200 bg-amber-50",
    orange:  "text-orange-700 border-orange-200 bg-orange-50",
    red:     "text-red-700 border-red-200 bg-red-50",
  };
  const badgeMap: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-800",
    amber:   "bg-amber-100 text-amber-800",
    orange:  "bg-orange-100 text-orange-800",
    red:     "bg-red-100 text-red-800",
  };

  const riskColor = score === 0 ? "emerald" : score === 1 ? "amber" : score === 2 ? "orange" : "red";

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-yellow-100 text-yellow-700">
          <Zap className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Febrile Seizure Risk Stratification</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Recurrence risk scoring (Berg et al.) and identification of complex features requiring further workup.
          </p>
        </div>
      </div>

      {/* Simple vs Complex */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Complex Features (tick all that apply)
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Absence of all features = simple febrile seizure. Presence of any = complex febrile seizure.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {COMPLEX_FEATURES.map(f => (
            <button
              key={f.id}
              onClick={() => toggle(complexFeatures, setComplexFeatures, f.id)}
              className={cn(
                "w-full text-left p-3 rounded-2xl border-2 font-semibold text-sm transition-all",
                complexFeatures.includes(f.id)
                  ? "bg-red-50 border-red-300 text-red-800"
                  : "bg-muted/20 border-transparent hover:border-primary/30"
              )}
            >
              <span className="mr-2">{complexFeatures.includes(f.id) ? "✓" : "○"}</span>
              {f.label}
            </button>
          ))}
        </CardContent>
      </Card>

      {isComplex && (
        <Alert className="rounded-2xl border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 text-sm">
            <strong>Complex Febrile Seizure</strong> — requires additional workup. Consider: LP if meningism/altered consciousness, EEG if recurrent or suspicious for epilepsy, neuroimaging if focal features or development concerns. Neurology consult recommended.
          </AlertDescription>
        </Alert>
      )}

      {!isComplex && (
        <Alert className="rounded-2xl border-emerald-200 bg-emerald-50">
          <Info className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-emerald-800 text-sm">
            <strong>Simple Febrile Seizure</strong> (no complex features) — generalised, duration &lt; 15 min, single episode per illness. No routine LP, EEG, or neuroimaging needed. Reassure family and calculate recurrence risk below.
          </AlertDescription>
        </Alert>
      )}

      {/* Recurrence risk factors */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Recurrence Risk Factors</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Berg & Shinnar 1991 — select all that apply</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {RECURRENCE_FACTORS.map(f => (
            <button
              key={f.id}
              onClick={() => toggle(factors, setFactors, f.id)}
              className={cn(
                "w-full text-left p-3 rounded-2xl border-2 font-semibold text-sm transition-all flex items-center justify-between",
                factors.includes(f.id)
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-muted/20 border-transparent hover:border-primary/30"
              )}
            >
              <span>
                <span className="mr-2">{factors.includes(f.id) ? "✓" : "○"}</span>
                {f.label}
              </span>
              <Badge className={cn("ml-2 shrink-0 font-bold", factors.includes(f.id) ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                +1
              </Badge>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Risk result */}
      <Card className={cn("rounded-3xl border-2", colorMap[riskColor])}>
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Risk Score</p>
              <p className="text-5xl font-black">{score} <span className="text-lg font-semibold opacity-60">/ 4</span></p>
            </div>
            <Badge className={cn("font-black text-sm px-3 py-1", badgeMap[riskColor])}>
              {riskData.label}
            </Badge>
          </div>

          <div className="rounded-2xl bg-white/60 p-4 border mb-4">
            <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Estimated Recurrence Risk</p>
            <p className="text-4xl font-black">{riskData.recurrence}</p>
            <p className="text-sm opacity-70 mt-1">Risk of at least one further febrile seizure</p>
          </div>

          <div className="space-y-1.5 text-sm">
            {score === 0 && [
              "Reassure parents — risk similar to background population",
              "No prophylactic antipyretics or anticonvulsants recommended",
              "Educate parents on seizure first aid and when to call ambulance",
            ].map((r, i) => <div key={i} className="flex gap-2"><span className="opacity-50 shrink-0 mt-0.5">•</span><span>{r}</span></div>)}
            {score >= 1 && [
              "Discuss recurrence risk openly with parents",
              "Intermittent oral diazepam at fever onset NOT routinely recommended (evidence uncertain)",
              "Continuous anticonvulsant prophylaxis NOT indicated for simple FS",
              "Buccal midazolam or rectal diazepam for home if seizure > 5 min",
              score >= 2 ? "Consider neurology review given elevated recurrence risk" : null,
            ].filter(Boolean).map((r, i) => <div key={i} className="flex gap-2"><span className="opacity-50 shrink-0 mt-0.5">•</span><span>{r}</span></div>)}
          </div>
        </CardContent>
      </Card>

      {/* Reference table */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Recurrence Risk by Number of Factors (Berg et al.)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-black">Risk Factors</th>
                  <th className="text-center py-2 font-black">Recurrence</th>
                  <th className="text-left py-2 pl-4 font-black">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y text-muted-foreground">
                {[
                  [0, "12%", "Low"],
                  [1, "25%", "Moderate"],
                  [2, "50%", "High"],
                  ["3–4", "73%", "Very High"],
                ].map(([rf, rec, cat]) => (
                  <tr key={String(rf)}>
                    <td className="py-2 font-semibold text-foreground">{rf} factor{rf === 1 ? "" : "s"}</td>
                    <td className="text-center py-2 font-bold">{rec}</td>
                    <td className="py-2 pl-4">{cat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Note: Epilepsy risk after simple FS remains low (2–3% vs 1% background). After complex FS: 10–15% risk.
          </p>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        Reference: Berg AT & Shinnar S. <em>Pediatrics</em> 1991;88(3):527–40 · NICE CG137 (Epilepsies) · AAP Febrile Seizure Guideline 2011
      </p>
    </div>
  );
}
