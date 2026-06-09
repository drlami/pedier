import { useState, useMemo } from "react";
import { Wind, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const CRITERIA = [
  {
    key: "spo2",
    label: "O₂ Saturation (on room air)",
    options: [
      { value: 0, label: "≥ 95%",   desc: "Normal" },
      { value: 1, label: "92–94%",  desc: "Mild hypoxia" },
      { value: 2, label: "≤ 91%",   desc: "Significant hypoxia" },
    ],
  },
  {
    key: "supraclavicular",
    label: "Supraclavicular Retractions",
    options: [
      { value: 0, label: "Absent", desc: "No visible supraclavicular recession" },
      { value: 3, label: "Present", desc: "Visible recession above clavicles" },
    ],
  },
  {
    key: "scalene",
    label: "Scalene Muscle Contraction",
    description: "Palpable or visible scalene (accessory neck) muscle use",
    options: [
      { value: 0, label: "Absent", desc: "No scalene use" },
      { value: 2, label: "Present", desc: "Visible scalene contraction" },
    ],
  },
  {
    key: "air_entry",
    label: "Air Entry",
    options: [
      { value: 0, label: "Normal",  desc: "Breath sounds equal and normal" },
      { value: 1, label: "Decreased",  desc: "Diffusely or focally reduced" },
      { value: 2, label: "Markedly decreased / Silent", desc: "Very poor or absent air entry" },
    ],
  },
  {
    key: "wheezing",
    label: "Wheezing",
    options: [
      { value: 0, label: "Absent", desc: "No wheeze" },
      { value: 1, label: "Expiratory only", desc: "Wheeze on expiration only" },
      { value: 2, label: "Inspiratory & expiratory", desc: "Both phases" },
      { value: 3, label: "Audible without stethoscope", desc: "Audible wheeze at bedside" },
    ],
  },
];

const MAX_SCORE = 12;

function classify(score: number) {
  if (score <= 3) return {
    label: "Mild",
    color: "emerald",
    management: [
      "Salbutamol MDI + spacer: 2–4 puffs q20 min × 3, then q4h",
      "Consider oral prednisolone 1–2 mg/kg/day (max 40 mg) × 3–5 days if not resolving",
      "Reassess after first salbutamol dose",
      "Discharge home if maintained improvement after 60 minutes",
      "Ensure written asthma action plan and follow-up within 48 hours",
    ],
  };
  if (score <= 7) return {
    label: "Moderate",
    color: "amber",
    management: [
      "Salbutamol 2.5–5 mg via nebuliser q20 min × 3, then reassess",
      "Ipratropium bromide 0.25 mg (< 5 yr) or 0.5 mg (≥ 5 yr) nebulised — mix with salbutamol",
      "Oral prednisolone 1–2 mg/kg/day (max 40 mg) — give early",
      "Supplemental O₂ to maintain SpO₂ ≥ 95%",
      "Reassess after 1 hour; admit if not improving",
      "IV methylprednisolone if oral not tolerated",
    ],
  };
  return {
    label: "Severe",
    color: "red",
    management: [
      "Continuous nebulised salbutamol (0.15 mg/kg/hr) or q15–20 min",
      "Ipratropium bromide q20 min × 3 doses",
      "IV methylprednisolone 2 mg/kg/day (max 60 mg)",
      "IV MgSO₄ 50 mg/kg over 20 min (max 2.5 g) — for severe, not responding",
      "High-flow O₂ to keep SpO₂ ≥ 95%",
      "PICU referral: fatigue, rising PaCO₂, declining conscious level",
      "Avoid sedation outside of intubation context",
      "Prepare for possible heliox, ketamine infusion, or intubation",
    ],
  };
}

const colorMap: Record<string, string> = {
  emerald: "text-emerald-700 border-emerald-200 bg-emerald-50",
  amber:   "text-amber-700 border-amber-200 bg-amber-50",
  red:     "text-red-700 border-red-200 bg-red-50",
};
const badgeMap: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-800",
  amber:   "bg-amber-100 text-amber-800",
  red:     "bg-red-100 text-red-800",
};

export default function PRAMAsthmaPage() {
  const [scores, setScores] = useState<Record<string, number>>({
    spo2: 0, supraclavicular: 0, scalene: 0, air_entry: 0, wheezing: 0,
  });

  const total = useMemo(() => Object.values(scores).reduce((a, b) => a + b, 0), [scores]);
  const result = useMemo(() => classify(total), [total]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-sky-100 text-sky-700">
          <Wind className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">PRAM Asthma Score</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Pediatric Respiratory Assessment Measure — validated 5-item severity score for acute asthma in children 2–17 years.
          </p>
        </div>
      </div>

      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-black">Clinical Assessment</CardTitle>
            <Badge variant="secondary" className="font-black text-base px-3">
              {total} / {MAX_SCORE}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {CRITERIA.map((crit) => (
            <div key={crit.key}>
              <p className="font-bold text-sm mb-2">{crit.label}</p>
              <div className="flex flex-wrap gap-2">
                {crit.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setScores(s => ({ ...s, [crit.key]: opt.value }))}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-left border-2 transition-all",
                      scores[crit.key] === opt.value
                        ? "bg-primary text-white border-primary shadow-md"
                        : "bg-muted/30 text-muted-foreground border-transparent hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{opt.label}</span>
                      <span className="text-xs opacity-60">({opt.value})</span>
                    </div>
                    <p className="text-xs opacity-70 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Result */}
      <Card className={cn("rounded-3xl border-2", colorMap[result.color])}>
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
            <div>
              <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">PRAM Score</p>
              <p className="text-5xl font-black">{total}<span className="text-2xl font-semibold opacity-50">/{MAX_SCORE}</span></p>
            </div>
            <Badge className={cn("text-base px-4 py-1 font-black", badgeMap[result.color])}>
              {result.label}
            </Badge>
          </div>
          <p className="font-black text-sm uppercase tracking-widest mb-3">Management</p>
          <div className="space-y-1.5">
            {result.management.map((m, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="mt-0.5 shrink-0 opacity-50">•</span>
                <span>{m}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reference */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Severity Classification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {[
              { range: "0–3", label: "Mild",     color: "emerald" },
              { range: "4–7", label: "Moderate", color: "amber" },
              { range: "8–12", label: "Severe",  color: "red" },
            ].map(({ range, label, color }) => (
              <div key={label} className={cn("rounded-2xl p-3 text-center border", colorMap[color])}>
                <p className="text-2xl font-black">{range}</p>
                <p className="text-xs font-black uppercase tracking-wide mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            <strong>Reassessment:</strong> Repeat PRAM after each treatment cycle (q20 min). A decrease of ≥3 points indicates significant response. Persistent PRAM ≥9 after two bronchodilator treatments warrants PICU involvement.
          </p>
        </CardContent>
      </Card>

      <Alert className="rounded-2xl border-sky-200 bg-sky-50">
        <AlertTriangle className="h-4 w-4 text-sky-600" />
        <AlertDescription className="text-sky-800 text-sm">
          <strong>Clinical caution — Silent Chest:</strong> A child with very poor air entry and no wheeze (score for wheeze = 0) despite respiratory distress may have severely obstructed airways — this is a pre-arrest sign. Do not be reassured by the absence of wheeze.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference: Ducharme FM et al. <em>Pediatrics</em> 2008;121:e1357–62 · Bhogal SK et al. <em>Ann Emerg Med</em> 2010;56:554–65
      </p>
    </div>
  );
}
