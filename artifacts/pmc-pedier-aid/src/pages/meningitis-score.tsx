import { useState, useMemo } from "react";
import { Brain, AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const CRITERIA = [
  {
    key: "gram_stain",
    label: "Positive CSF Gram Stain",
    description: "Any bacteria visible on Gram stain of cerebrospinal fluid",
    points: 2,
  },
  {
    key: "csf_anc",
    label: "CSF Absolute Neutrophil Count ≥ 1,000 cells/μL",
    description: "Total CSF white cells × % polymorphonuclear cells / 100",
    points: 1,
  },
  {
    key: "csf_protein",
    label: "CSF Protein ≥ 80 mg/dL",
    description: "Cerebrospinal fluid total protein",
    points: 1,
  },
  {
    key: "blood_anc",
    label: "Peripheral Blood ANC ≥ 10,000 cells/μL",
    description: "Peripheral blood absolute neutrophil count",
    points: 1,
  },
  {
    key: "seizure",
    label: "Seizure at or before Presentation",
    description: "Any witnessed seizure before or at time of presentation to hospital",
    points: 1,
  },
];

const MAX_SCORE = 6;

function classify(score: number) {
  if (score === 0) return {
    label: "Very Low Risk",
    prob: "< 0.1%",
    color: "emerald",
    action: "Bacterial meningitis extremely unlikely",
    management: [
      "Score 0 has a very high negative predictive value (>99.9%) in CSF-pleocytosis patients",
      "Consider withholding empiric antibiotics while awaiting cultures — in clinical context",
      "Admission for observation and repeat lumbar puncture at 24–48 hours if no improvement",
      "Treat empirically if any clinical concern exists or patient appears systemically unwell",
      "Document rationale clearly if antibiotics withheld",
    ],
    note: "This score was validated in patients with CSF pleocytosis who received LP before antibiotics."
  };
  if (score === 1) return {
    label: "Low Risk",
    prob: "~5–7%",
    color: "amber",
    action: "Treat empirically — low but non-trivial risk",
    management: [
      "Start empiric antibiotics (ceftriaxone 100 mg/kg/day divided 12-hourly, max 4g/day)",
      "Dexamethasone 0.15 mg/kg/dose q6h × 4 days if >6 weeks, started with first antibiotic dose",
      "Full septic workup: blood cultures, CRP, CBP",
      "PICU review if haemodynamically unstable",
      "Continue antibiotics until cultures finalized at 48–72 hours",
    ],
    note: null
  };
  return {
    label: "High Risk",
    prob: "~75–90%",
    color: "red",
    action: "Bacterial meningitis — urgent empiric treatment",
    management: [
      "Immediate IV ceftriaxone 100 mg/kg/day (max 4g/day) — do not delay for imaging",
      "IV dexamethasone 0.15 mg/kg q6h × 4 days (give first dose with first antibiotic dose)",
      "If TB meningitis suspected: add rifampicin and isoniazid pending cultures",
      "CT head before LP if papilloedema, focal neurology, reduced GCS, or immunocompromised",
      "Neurosurgery consultation if obstructive hydrocephalus on imaging",
      "Isolate for first 24 hours (N. meningitidis precautions)",
      "Notify public health for meningococcal disease if confirmed",
    ],
    note: null
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

export default function MeningitisScorePage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const total = useMemo(() =>
    CRITERIA.reduce((sum, c) => sum + (checked[c.key] ? c.points : 0), 0),
    [checked]
  );

  const result = useMemo(() => classify(total), [total]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-violet-100 text-violet-700">
          <Brain className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Bacterial Meningitis Score</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Nigrovic BMS — identifies children with CSF pleocytosis at very low risk for bacterial meningitis.
          </p>
        </div>
      </div>

      <Alert className="rounded-2xl border-violet-200 bg-violet-50">
        <Info className="h-4 w-4 text-violet-600" />
        <AlertDescription className="text-violet-800 text-sm">
          <strong>Indication:</strong> Apply this score in children aged 2 months – 18 years who had lumbar puncture performed <strong>before</strong> antibiotics and have CSF pleocytosis (WBC ≥10 cells/μL). Score is not validated for neonates, immunocompromised patients, or post-treatment LPs.
        </AlertDescription>
      </Alert>

      {/* Criteria */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-black">BMS Criteria</CardTitle>
            <Badge variant="secondary" className="font-black text-base px-3">
              {total} / {MAX_SCORE}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {CRITERIA.map((crit) => (
            <button
              key={crit.key}
              onClick={() => setChecked(s => ({ ...s, [crit.key]: !s[crit.key] }))}
              className={cn(
                "w-full text-left p-4 rounded-2xl border-2 transition-all",
                checked[crit.key]
                  ? "bg-primary/5 border-primary shadow-sm"
                  : "bg-muted/20 border-transparent hover:border-muted-foreground/20"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "mt-0.5 h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0",
                  checked[crit.key] ? "bg-primary border-primary" : "border-muted-foreground/30"
                )}>
                  {checked[crit.key] && <div className="h-2.5 w-2.5 rounded-sm bg-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn("font-bold text-sm", checked[crit.key] && "text-primary")}>
                      {crit.label}
                    </p>
                    <Badge variant="secondary" className={cn(
                      "shrink-0 font-black text-xs",
                      checked[crit.key] && "bg-primary/10 text-primary"
                    )}>
                      +{crit.points}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{crit.description}</p>
                </div>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Result */}
      <Card className={cn("rounded-3xl border-2", colorMap[result.color])}>
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
            <div>
              <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Score</p>
              <p className="text-5xl font-black">{total}</p>
            </div>
            <div className="text-right space-y-2">
              <Badge className={cn("text-base px-3 py-1 font-black", badgeMap[result.color])}>
                {result.label}
              </Badge>
              <p className="text-sm font-bold">Risk of bacterial meningitis: {result.prob}</p>
            </div>
          </div>

          <p className="font-bold text-sm mb-3">{result.action}</p>
          <div className="space-y-1.5">
            {result.management.map((m, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="mt-0.5 shrink-0 opacity-50">•</span>
                <span>{m}</span>
              </div>
            ))}
          </div>
          {result.note && (
            <p className="mt-4 text-xs italic opacity-70">{result.note}</p>
          )}
        </CardContent>
      </Card>

      {/* CSF interpretation reference */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            CSF Pattern Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-3 font-black">Parameter</th>
                  <th className="text-center py-2 pr-3 font-black text-emerald-700">Normal</th>
                  <th className="text-center py-2 pr-3 font-black text-amber-700">Viral</th>
                  <th className="text-center py-2 font-black text-red-700">Bacterial</th>
                </tr>
              </thead>
              <tbody className="divide-y text-muted-foreground">
                {[
                  ["WBC", "< 5 cells/μL", "10–1000 (lymphs)", "> 1000 (PMN)"],
                  ["Protein", "< 45 mg/dL", "45–100 mg/dL", "> 100 mg/dL"],
                  ["Glucose", "> 60% serum", "> 50% serum", "< 40% serum"],
                  ["Gram stain", "Negative", "Negative", "+ in 70–80%"],
                ].map(([param, ...vals]) => (
                  <tr key={param}>
                    <td className="py-2 pr-3 font-semibold text-foreground">{param}</td>
                    {vals.map((v, i) => <td key={i} className="text-center py-2 px-3">{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Alert className="rounded-2xl border-red-200 bg-red-50">
        <ShieldAlert className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 text-sm">
          <strong>Clinical override:</strong> Never withhold empiric antibiotics if the patient is haemodynamically compromised, has purpuric rash, or is deteriorating — regardless of the score. Treat first, investigate second.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference: Nigrovic LE et al. <em>Pediatrics</em> 2002;110:712–9 · Nigrovic LE et al. <em>JAMA</em> 2007;297:52–60
      </p>
    </div>
  );
}
