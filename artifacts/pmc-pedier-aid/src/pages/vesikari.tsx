import { useState, useMemo } from "react";
import { Stethoscope, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const CRITERIA = [
  {
    key: "diarrhea_duration",
    label: "Duration of Diarrhoea",
    options: [
      { value: 0, label: "None" },
      { value: 1, label: "1–4 days" },
      { value: 2, label: "5–6 days" },
      { value: 3, label: "≥ 7 days" },
    ],
  },
  {
    key: "diarrhea_freq",
    label: "Maximum Watery Stools per Day",
    options: [
      { value: 0, label: "None" },
      { value: 1, label: "1–3 / day" },
      { value: 2, label: "4–5 / day" },
      { value: 3, label: "≥ 6 / day" },
    ],
  },
  {
    key: "vomit_duration",
    label: "Duration of Vomiting",
    options: [
      { value: 0, label: "None" },
      { value: 1, label: "1 day" },
      { value: 2, label: "2 days" },
      { value: 3, label: "≥ 3 days" },
    ],
  },
  {
    key: "vomit_freq",
    label: "Maximum Vomiting Episodes per Day",
    options: [
      { value: 0, label: "None" },
      { value: 1, label: "1–2 / day" },
      { value: 2, label: "3–4 / day" },
      { value: 3, label: "≥ 5 / day" },
    ],
  },
  {
    key: "temperature",
    label: "Maximum Temperature",
    options: [
      { value: 0, label: "< 37.1°C (afebrile)" },
      { value: 1, label: "37.1–38.4°C (low-grade)" },
      { value: 2, label: "38.5–38.9°C (moderate)" },
      { value: 3, label: "≥ 39.0°C (high fever)" },
    ],
  },
  {
    key: "dehydration",
    label: "Degree of Dehydration",
    options: [
      { value: 0, label: "None (< 1%)" },
      { value: 2, label: "Mild / Moderate (1–9%)" },
      { value: 3, label: "Severe (≥ 10%)" },
    ],
  },
  {
    key: "treatment",
    label: "Treatment Required",
    options: [
      { value: 0, label: "None / home oral fluids" },
      { value: 2, label: "ORS or IV fluids in ED" },
      { value: 3, label: "Hospitalisation" },
    ],
  },
];

function classify(score: number) {
  if (score < 7) return {
    label: "Mild",
    color: "emerald",
    management: [
      "Encourage oral rehydration at home",
      "Zinc supplementation in developing countries: 20 mg/day × 10–14 days (≥6 months)",
      "Continue age-appropriate feeding — avoid prolonged fasting",
      "Return precautions: worsening dehydration, bloody diarrhoea, high fever, < 1 wet nappy per 8 hours",
      "No routine antibiotics — most cases viral (rotavirus, norovirus)",
    ],
  };
  if (score <= 10) return {
    label: "Moderate",
    color: "amber",
    management: [
      "Oral Rehydration Solution (ORS): 10–20 mL/kg/hr for 4 hours in mild dehydration",
      "If failed ORT or vomiting: IV isotonic saline 20 mL/kg bolus over 1 hour",
      "Reassess hydration status after rehydration phase",
      "Consider nasogastric ORS if unable to tolerate oral feeds",
      "Ondansetron 0.15 mg/kg PO/IV (max 4 mg) — single dose may improve ORS tolerance",
      "Send stool culture if bloody diarrhoea or travel history",
    ],
  };
  return {
    label: "Severe",
    color: "red",
    management: [
      "Hospitalisation for IV rehydration",
      "IV isotonic saline (0.9% NaCl or Hartmann's) 20 mL/kg bolus — repeat as needed",
      "Maintenance fluids after deficit replacement (Holliday-Segar formula)",
      "Monitor electrolytes: Na⁺, K⁺, glucose, bicarbonate",
      "Correct hyponatraemia or hypernatraemia slowly over 48 hours",
      "Ondansetron IV for vomiting",
      "Stool culture; consider rotavirus PCR",
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

export default function VesikariPage() {
  const [scores, setScores] = useState<Record<string, number>>({
    diarrhea_duration: 0, diarrhea_freq: 0,
    vomit_duration: 0, vomit_freq: 0,
    temperature: 0, dehydration: 0, treatment: 0,
  });

  const total = useMemo(() => Object.values(scores).reduce((a, b) => a + b, 0), [scores]);
  const result = useMemo(() => classify(total), [total]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-slate-100 text-slate-700">
          <Stethoscope className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Vesikari Gastroenteritis Score</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Clinical Severity Scale for acute gastroenteritis in children — guides treatment intensity and admission.
          </p>
        </div>
      </div>

      {/* Criteria */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-black">Clinical Assessment</CardTitle>
            <Badge variant="secondary" className="font-black text-base px-3">{total} / 20</Badge>
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

      {/* Result */}
      <Card className={cn("rounded-3xl border-2", colorMap[result.color])}>
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
            <div>
              <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Total Score</p>
              <p className="text-5xl font-black">{total}<span className="text-2xl font-semibold opacity-50">/20</span></p>
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

      {/* Score reference */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Severity Thresholds
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {[
              { range: "< 7", label: "Mild", color: "emerald" },
              { range: "7–10", label: "Moderate", color: "amber" },
              { range: "≥ 11", label: "Severe", color: "red" },
            ].map(({ range, label, color }) => (
              <div key={label} className={cn("rounded-2xl p-3 text-center border", colorMap[color])}>
                <p className="text-2xl font-black">{range}</p>
                <p className="text-xs font-black uppercase tracking-wide mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            The treatment item should reflect the level of care <em>actually required</em> — this may need to be updated after assessment, not before.
          </p>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        Reference: Ruuska T & Vesikari T. <em>Scand J Infect Dis</em> 1990;22:259–67 · Clark HF et al. <em>Pediatr Infect Dis J</em> 2004
      </p>
    </div>
  );
}
