import { useState } from "react";
import { ArrowLeft, Brain, AlertTriangle, Info, Snowflake, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

// Thompson HIE Score (Thompson CM et al. Dev Med Child Neurol. 1997;39:586-591)
// 9 criteria, max score = 22

interface Criterion {
  id: string;
  title: string;
  subtitle: string;
  options: { score: number; label: string }[];
}

const CRITERIA: Criterion[] = [
  {
    id: "tone",
    title: "Muscle Tone",
    subtitle: "Assess passive resistance on handling",
    options: [
      { score: 0, label: "Normal" },
      { score: 1, label: "Hypertonic (increased tone)" },
      { score: 2, label: "Hypotonic (reduced tone)" },
      { score: 3, label: "Flaccid (absent tone)" },
    ],
  },
  {
    id: "loc",
    title: "Level of Consciousness",
    subtitle: "Best state of arousal during assessment",
    options: [
      { score: 0, label: "Normal" },
      { score: 1, label: "Hyperalert / jittery" },
      { score: 2, label: "Lethargic / drowsy" },
      { score: 3, label: "Comatose (unarousable)" },
    ],
  },
  {
    id: "fits",
    title: "Seizures (Fits)",
    subtitle: "In the preceding 12-hour period",
    options: [
      { score: 0, label: "None" },
      { score: 1, label: "Fewer than 3 per day" },
      { score: 2, label: "3 or more per day" },
      { score: 3, label: "Prolonged / status epilepticus" },
    ],
  },
  {
    id: "posture",
    title: "Posture",
    subtitle: "Predominant posture at rest",
    options: [
      { score: 0, label: "Normal" },
      { score: 1, label: "Fisting or cycling movements" },
      { score: 2, label: "Strong distal flexion" },
      { score: 3, label: "Decerebrate (extensor posturing)" },
    ],
  },
  {
    id: "moro",
    title: "Moro Reflex",
    subtitle: "Response to sudden head drop",
    options: [
      { score: 0, label: "Normal (full abduction-adduction)" },
      { score: 1, label: "Partial (incomplete)" },
      { score: 2, label: "Absent" },
    ],
  },
  {
    id: "grasp",
    title: "Grasp Reflex",
    subtitle: "Palmar grasp response",
    options: [
      { score: 0, label: "Normal" },
      { score: 1, label: "Poor / weak" },
      { score: 2, label: "Absent" },
    ],
  },
  {
    id: "suck",
    title: "Suck Reflex",
    subtitle: "Sucking and rooting response",
    options: [
      { score: 0, label: "Normal" },
      { score: 1, label: "Poor / inadequate" },
      { score: 2, label: "Absent" },
    ],
  },
  {
    id: "respiration",
    title: "Respiration",
    subtitle: "Predominant respiratory pattern",
    options: [
      { score: 0, label: "Normal" },
      { score: 1, label: "Hyperventilation or irregular" },
      { score: 2, label: "Apnoea or requires IPPV (intubated)" },
    ],
  },
  {
    id: "fontanelle",
    title: "Anterior Fontanelle",
    subtitle: "Palpate with infant sitting / semi-upright",
    options: [
      { score: 0, label: "Normal / flat" },
      { score: 1, label: "Full / slightly raised" },
      { score: 2, label: "Tense / grossly bulging" },
    ],
  },
];

// Maximum possible score: 3+3+3+3+2+2+2+2+2 = 22

interface Interpretation {
  severity: string;
  stage: string;
  color: string;
  barColor: string;
  bg: string;
  badgeClass: string;
  action: string;
  cooling: boolean;
}

function interpret(score: number): Interpretation {
  if (score <= 4)
    return {
      severity: "Mild HIE",
      stage: "Sarnat Stage 1 range",
      color: "text-yellow-700",
      barColor: "bg-yellow-400",
      bg: "bg-yellow-50 border-yellow-300",
      badgeClass: "bg-yellow-500",
      action: "Monitor closely with serial scores (every 4–6 hours). Ensure normoglycaemia, normothermia, and adequate perfusion. Re-assess cooling eligibility if score rises or neurological signs evolve.",
      cooling: false,
    };
  if (score <= 10)
    return {
      severity: "Moderate HIE",
      stage: "Sarnat Stage 1–2 range",
      color: "text-orange-700",
      barColor: "bg-orange-400",
      bg: "bg-orange-50 border-orange-300",
      badgeClass: "bg-orange-500",
      action: "Formal cooling eligibility assessment required (GA ≥ 36w, age ≤ 6 h, biochemical criteria). Serial scoring every 2–4 hours. Urgent NICU consultation. Commence supportive care: normoglycaemia, avoid hyperthermia, gentle ventilation if needed.",
      cooling: true,
    };
  if (score <= 14)
    return {
      severity: "Severe HIE",
      stage: "Sarnat Stage 2–3 range",
      color: "text-red-700",
      barColor: "bg-red-500",
      bg: "bg-red-50 border-red-300",
      badgeClass: "bg-red-600",
      action: "Therapeutic hypothermia strongly indicated if eligible (GA ≥ 36w, age ≤ 6 h). NICU admission. Commence cooling without delay if criteria met. Consider aEEG/EEG monitoring. MRI at 4–7 days. Family counselling on prognosis.",
      cooling: true,
    };
  return {
    severity: "Very Severe HIE",
    stage: "Sarnat Stage 3 range",
    color: "text-red-900",
    barColor: "bg-red-700",
    bg: "bg-red-100 border-red-400",
    badgeClass: "bg-red-800",
    action: "Critical encephalopathy. Cool immediately if eligible. Urgent senior neonatologist. Organ support as needed. Serial neuro monitoring (aEEG, clinical). Consider early goals-of-care discussion with family given very high risk of death or severe disability.",
    cooling: true,
  };
}

export default function ThompsonHIEPage() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [coolingGa, setCoolingGa] = useState<boolean | null>(null);
  const [coolingAge, setCoolingAge] = useState<boolean | null>(null);
  const [coolingBiochem, setCoolingBiochem] = useState<boolean | null>(null);

  const answeredCount = Object.keys(scores).length;
  const allAnswered = answeredCount === CRITERIA.length;
  const total = Object.values(scores).reduce((s, v) => s + v, 0);
  const interp = allAnswered ? interpret(total) : null;

  const coolingEligible =
    coolingGa === true && coolingAge === true && coolingBiochem === true;
  const coolingChecksComplete =
    coolingGa !== null && coolingAge !== null && coolingBiochem !== null;

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 pb-32">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary active:scale-95">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-200">
          <Brain className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tight">Thompson HIE Score</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest mt-1">
            Neonatal Encephalopathy · 9 Criteria · Max 22 · Thompson 1997
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Score header — shown once all items answered */}
        {allAnswered && interp && (
          <div className={cn("p-5 rounded-3xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", interp.bg)}>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Thompson Score</p>
              <p className={cn("text-5xl font-black tabular-nums", interp.color)}>
                {total}
                <span className="text-base font-bold text-muted-foreground/50 ml-1">/ 22</span>
              </p>
            </div>
            <div className="text-right">
              <Badge className={cn("font-black text-sm px-4 py-1.5 mb-1 text-white", interp.badgeClass)}>
                {interp.severity}
              </Badge>
              <p className="text-[10px] font-bold text-muted-foreground">{interp.stage}</p>
            </div>
          </div>
        )}

        {/* Criteria scoring */}
        <Card className="border-2 shadow-sm">
          <CardHeader className="pb-3 border-b bg-muted/20">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Neurological Assessment — {answeredCount}/{CRITERIA.length} criteria scored
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {CRITERIA.map((c) => (
              <div key={c.id} className="bg-muted/20 rounded-2xl p-4 space-y-2.5">
                <div>
                  <p className="text-sm font-black text-foreground leading-tight">{c.title}</p>
                  <p className="text-[11px] text-muted-foreground font-medium">{c.subtitle}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {c.options.map((opt) => (
                    <button
                      key={opt.score}
                      onClick={() => setScores((prev) => ({ ...prev, [c.id]: opt.score }))}
                      className={cn(
                        "px-3 py-2 rounded-xl text-xs font-black transition-all border-2",
                        scores[c.id] === opt.score
                          ? opt.score === 0
                            ? "bg-emerald-500 text-white border-emerald-500"
                            : opt.score === 1
                            ? "bg-amber-500 text-white border-amber-500"
                            : opt.score === 2
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-red-600 text-white border-red-600"
                          : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:bg-primary/5"
                      )}
                    >
                      {opt.score} — {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Score bar */}
        {allAnswered && interp && (
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500", interp.barColor)}
                style={{ width: `${(total / 22) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-widest px-0.5">
              <span>0 — Mild</span>
              <span>5 — Moderate</span>
              <span>11 — Severe</span>
              <span>15 — Critical</span>
              <span>22</span>
            </div>
          </div>
        )}

        {/* Action panel */}
        {allAnswered && interp && (
          <Alert className={cn("border-2", interp.bg)}>
            <AlertTriangle className={cn("h-4 w-4 shrink-0", interp.color)} />
            <AlertDescription className="space-y-1">
              <p className={cn("font-black", interp.color)}>{interp.severity}</p>
              <p className="text-sm text-foreground/80 font-medium leading-relaxed">{interp.action}</p>
            </AlertDescription>
          </Alert>
        )}

        {/* Cooling eligibility checklist */}
        {allAnswered && interp?.cooling && (
          <Card className="border-2 border-blue-200 shadow-sm">
            <CardHeader className="pb-3 border-b bg-blue-50">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-blue-700 flex items-center gap-2">
                <Snowflake className="h-4 w-4" />
                Therapeutic Hypothermia — Eligibility Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <p className="text-xs font-bold text-muted-foreground italic">Cooling requires ALL three criteria to be present. Check each:</p>

              {/* Criterion A */}
              <div className="space-y-2">
                <p className="text-sm font-black">A. Gestational age ≥ 36 weeks?</p>
                <div className="flex gap-2">
                  {[{ val: true, label: "Yes ≥ 36w" }, { val: false, label: "No < 36w" }].map(({ val, label }) => (
                    <button
                      key={String(val)}
                      onClick={() => setCoolingGa(val)}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black border-2 transition-all",
                        coolingGa === val
                          ? val ? "bg-emerald-500 text-white border-emerald-500" : "bg-red-500 text-white border-red-500"
                          : "bg-background border-border text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      {coolingGa === val && (val ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />)}
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Criterion B */}
              <div className="space-y-2">
                <p className="text-sm font-black">B. Age ≤ 6 hours of life?</p>
                <div className="flex gap-2">
                  {[{ val: true, label: "Yes ≤ 6 h" }, { val: false, label: "No > 6 h" }].map(({ val, label }) => (
                    <button
                      key={String(val)}
                      onClick={() => setCoolingAge(val)}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black border-2 transition-all",
                        coolingAge === val
                          ? val ? "bg-emerald-500 text-white border-emerald-500" : "bg-red-500 text-white border-red-500"
                          : "bg-background border-border text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      {coolingAge === val && (val ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />)}
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Criterion C */}
              <div className="space-y-2">
                <p className="text-sm font-black">C. Evidence of perinatal asphyxia?</p>
                <p className="text-[10px] text-muted-foreground font-bold italic">Any one of: pH &lt; 7.0, base deficit ≥ 16, need for resuscitation ≥ 10 min, Apgar ≤ 5 at 10 min</p>
                <div className="flex gap-2">
                  {[{ val: true, label: "Yes — criteria met" }, { val: false, label: "No — criteria absent" }].map(({ val, label }) => (
                    <button
                      key={String(val)}
                      onClick={() => setCoolingBiochem(val)}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black border-2 transition-all",
                        coolingBiochem === val
                          ? val ? "bg-emerald-500 text-white border-emerald-500" : "bg-red-500 text-white border-red-500"
                          : "bg-background border-border text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      {coolingBiochem === val && (val ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />)}
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Result */}
              {coolingChecksComplete && (
                <div className={cn(
                  "p-4 rounded-2xl border-2 text-center",
                  coolingEligible
                    ? "bg-blue-600 border-blue-700 text-white"
                    : "bg-slate-100 border-slate-300 text-slate-700"
                )}>
                  <Snowflake className={cn("h-6 w-6 mx-auto mb-1", coolingEligible ? "text-white" : "text-slate-400")} />
                  <p className="text-base font-black">
                    {coolingEligible ? "COOLING INDICATED" : "Cooling NOT currently indicated"}
                  </p>
                  <p className={cn("text-[11px] font-bold mt-0.5", coolingEligible ? "text-blue-100" : "text-slate-500")}>
                    {coolingEligible
                      ? "Target: 33–34 °C for 72 hours. Initiate within 6 h of birth."
                      : !coolingAge
                        ? "Outside the 6-hour window — consult senior neonatologist for late cooling decision."
                        : !coolingGa
                        ? "Gestational age < 36 weeks — standard whole-body cooling not recommended; discuss with NICU."
                        : "Asphyxia criteria not met — continue monitoring and reassess if condition changes."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Clinical notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600 shrink-0" />
            <AlertDescription className="text-xs text-blue-800 font-medium space-y-1">
              <p className="font-black">Serial scoring</p>
              <p>Score every 4–6 hours. A score that falls below 10 by day 3–4 is associated with a more favourable outcome. A persistent score &gt; 10 after day 3 predicts death or disability in the original cohort.</p>
            </AlertDescription>
          </Alert>
          <Alert className="bg-slate-50 border-slate-200">
            <Info className="h-4 w-4 text-slate-600 shrink-0" />
            <AlertDescription className="text-xs text-slate-700 font-medium space-y-1">
              <p className="font-black">Supportive management (all grades)</p>
              <p>Normoglycaemia (2.6–5.5 mmol/L) · Normotension · Avoid hyperthermia · Treat seizures · Avoid aggressive ventilation · Consider early EEG/aEEG monitoring</p>
            </AlertDescription>
          </Alert>
        </div>

        <p className="text-[10px] text-muted-foreground font-medium text-center pb-2">
          Reference: Thompson CM et al. The value of a scoring system for hypoxic ischaemic encephalopathy in predicting neurodevelopmental outcome.
          Acta Paediatrica. 1997;86(7):757–761.
        </p>
      </div>
    </div>
  );
}
