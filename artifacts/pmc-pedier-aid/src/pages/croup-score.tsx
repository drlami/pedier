import { useState, useMemo } from "react";
import { Wind, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const CRITERIA = [
  {
    key: "stridor",
    label: "Stridor",
    description: "Audible inspiratory stridor",
    options: [
      { value: 0, label: "None" },
      { value: 1, label: "When agitated / crying" },
      { value: 2, label: "At rest" },
    ],
  },
  {
    key: "retractions",
    label: "Retractions",
    description: "Subcostal / intercostal / sternal",
    options: [
      { value: 0, label: "None" },
      { value: 1, label: "Mild" },
      { value: 2, label: "Moderate" },
      { value: 3, label: "Severe" },
    ],
  },
  {
    key: "air_entry",
    label: "Air Entry",
    description: "Auscultation of lung fields bilaterally",
    options: [
      { value: 0, label: "Normal" },
      { value: 1, label: "Mildly decreased" },
      { value: 2, label: "Markedly decreased" },
    ],
  },
  {
    key: "cyanosis",
    label: "Cyanosis",
    description: "Peripheral or central cyanosis",
    options: [
      { value: 0, label: "None" },
      { value: 4, label: "With agitation" },
      { value: 5, label: "At rest" },
    ],
  },
  {
    key: "consciousness",
    label: "Level of Consciousness",
    description: "Wakefulness and responsiveness",
    options: [
      { value: 0, label: "Normal (including sleep)" },
      { value: 5, label: "Disoriented / altered" },
    ],
  },
];

function classify(score: number) {
  if (score <= 2) return {
    label: "Mild",
    color: "emerald",
    management: [
      "Cool mist or outdoor air (evidence limited but low harm)",
      "Oral dexamethasone 0.6 mg/kg (single dose, max 10 mg) — first line",
      "Reassess after 1–2 hours",
      "Discharge home if tolerating PO and improving",
      "Safety-net: return if stridor at rest, drooling, or cyanosis",
    ],
  };
  if (score <= 5) return {
    label: "Moderate",
    color: "amber",
    management: [
      "Dexamethasone 0.6 mg/kg IM/PO/IV (single dose, max 10 mg)",
      "Consider nebulised budesonide 2 mg if PO not tolerated",
      "Consider nebulised epinephrine 0.5 mL/kg of 1:1000 (max 5 mL) if inadequate response",
      "Observe minimum 2–4 hours post-epinephrine before considering discharge",
      "Pulse oximetry monitoring",
    ],
  };
  if (score <= 11) return {
    label: "Severe",
    color: "orange",
    management: [
      "Nebulised L-epinephrine: 0.5 mL/kg of 1:1000 solution (max 5 mL) via O2 mask — may repeat q20–30 min",
      "Dexamethasone 0.6 mg/kg IV/IM",
      "High-flow oxygen; keep child calm — avoid agitation",
      "IV access; continuous SpO2 monitoring",
      "Admit to high-dependency unit; PICU referral if deteriorating",
      "ENT / anaesthetics alert for potential intubation",
    ],
  };
  return {
    label: "Impending Respiratory Failure",
    color: "red",
    management: [
      "Immediate PICU/resuscitation team involvement",
      "Nebulised epinephrine continuously / repeatedly",
      "IV dexamethasone + IV hydration",
      "Prepare for emergent intubation by most experienced provider",
      "Heliox 70:30 may reduce work of breathing as temporising measure",
      "Surgical airway standby",
    ],
  };
}

export default function CroupScorePage() {
  const [scores, setScores] = useState<Record<string, number>>({
    stridor: 0, retractions: 0, air_entry: 0, cyanosis: 0, consciousness: 0,
  });

  const allAnswered = Object.values(scores).every(v => v !== undefined);
  const total = useMemo(() => Object.values(scores).reduce((a, b) => a + b, 0), [scores]);
  const result = useMemo(() => classify(total), [total]);

  const colorMap: Record<string, string> = {
    emerald: "text-emerald-700 border-emerald-200 bg-emerald-50",
    amber:   "text-amber-700 border-amber-200 bg-amber-50",
    orange:  "text-orange-700 border-orange-200 bg-orange-50",
    red:     "text-red-700 border-red-200 bg-red-50",
  };
  const badgeMap: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-700",
    amber:   "bg-amber-100 text-amber-700",
    orange:  "bg-orange-100 text-orange-700",
    red:     "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-sky-100 text-sky-700">
          <Wind className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Westley Croup Score</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Validated 5-item severity score for laryngotracheobronchitis (croup) — guides treatment intensity.
          </p>
        </div>
      </div>

      {/* Criteria */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Clinical Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {CRITERIA.map((crit) => (
            <div key={crit.key}>
              <div className="mb-2">
                <p className="font-bold text-sm">{crit.label}</p>
                <p className="text-xs text-muted-foreground">{crit.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {crit.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setScores(s => ({ ...s, [crit.key]: opt.value }))}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all",
                      scores[crit.key] === opt.value
                        ? "bg-primary text-white border-primary shadow-md"
                        : "bg-muted/30 text-muted-foreground border-transparent hover:border-primary/30"
                    )}
                  >
                    {opt.label}
                    <span className="ml-1.5 opacity-60 text-xs">({opt.value})</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Score result */}
      <Card className={cn("rounded-3xl border-2", colorMap[result.color])}>
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest opacity-70 mb-1">Total Score</p>
              <p className="text-5xl font-black">{total}<span className="text-2xl font-semibold opacity-50">/17</span></p>
            </div>
            <div className="text-right">
              <Badge className={cn("text-base px-4 py-1 font-black", badgeMap[result.color])}>
                {result.label}
              </Badge>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <p className="font-black text-sm uppercase tracking-widest mb-3">Management</p>
            {result.management.map((m, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="mt-0.5 shrink-0 opacity-50">•</span>
                <span>{m}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Severity reference */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Score Interpretation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { range: "0–2", label: "Mild", color: "emerald" },
              { range: "3–5", label: "Moderate", color: "amber" },
              { range: "6–11", label: "Severe", color: "orange" },
              { range: "≥12", label: "Resp Failure", color: "red" },
            ].map(({ range, label, color }) => (
              <div key={label} className={cn("rounded-2xl p-3 text-center border", colorMap[color])}>
                <p className="text-xl font-black">{range}</p>
                <p className="text-xs font-bold uppercase tracking-wide mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Alert className="rounded-2xl border-sky-200 bg-sky-50">
        <AlertTriangle className="h-4 w-4 text-sky-600" />
        <AlertDescription className="text-sky-800 text-sm">
          <strong>Key caution:</strong> Epinephrine effect lasts 2–4 hours. All children receiving nebulised epinephrine must be observed for a minimum of 4 hours post-treatment for rebound. Do not discharge immediately after improvement.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference: Westley CR et al. <em>Am J Dis Child</em> 1978;132:484–7 · Bjornson CL & Johnson DW. <em>Lancet</em> 2008;371:329–39
      </p>
    </div>
  );
}
