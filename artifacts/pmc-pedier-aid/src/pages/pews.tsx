import { useState, useMemo } from "react";
import { Activity, AlertTriangle, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const PARAMETERS = [
  {
    key: "behaviour",
    label: "Behaviour / Neurological State",
    options: [
      { value: 0, label: "Playing / appropriate", desc: "Normal age-appropriate interaction" },
      { value: 1, label: "Sleeping but rousable", desc: "Easily woken, normal when awake" },
      { value: 2, label: "Irritable / not easily consoled", desc: "Persistent crying, inconsolable" },
      { value: 3, label: "Lethargic / confused", desc: "Reduced activity, difficult to rouse" },
      { value: 4, label: "Unresponsive / markedly reduced", desc: "AVPU = P or U" },
    ],
  },
  {
    key: "cardiovascular",
    label: "Cardiovascular",
    description: "Assess colour, capillary refill time (CRT), and heart rate vs. age-normal",
    options: [
      { value: 0, label: "Normal", desc: "Pink, CRT ≤ 2s, HR normal for age" },
      { value: 1, label: "Pale / mild tachycardia", desc: "CRT 3s, HR 10–20 above normal" },
      { value: 2, label: "Grey / moderate tachycardia", desc: "CRT 4s, HR > 20 above normal, mottled" },
      { value: 3, label: "Grey & mottled / severe tachycardia or bradycardia", desc: "CRT ≥ 5s, extreme HR derangement" },
    ],
  },
  {
    key: "respiratory",
    label: "Respiratory",
    description: "Assess respiratory rate, O₂ requirement, and work of breathing",
    options: [
      { value: 0, label: "Normal rate, no supplemental O₂", desc: "RR normal for age, SpO₂ ≥ 95% on air" },
      { value: 1, label: "Mildly increased RR, ≤ 40% O₂", desc: "RR up to 10 above normal, mild WOB" },
      { value: 2, label: "Moderately increased RR, > 40% O₂", desc: "RR > 10 above normal, moderate recession" },
      { value: 3, label: "Markedly increased RR, accessory muscles, SpO₂ < 92%", desc: "> 5 above normal with significant WOB or any O₂" },
    ],
  },
];

const MODIFIERS = [
  { key: "nebuliser", label: "Receiving continuous or ¼-hourly nebulised bronchodilator", points: 1 },
  { key: "vomiting", label: "Persistent post-operative vomiting", points: 1 },
];

function interpret(score: number) {
  if (score === 0) return {
    label: "Score 0 — Routine Monitoring",
    color: "emerald",
    actions: [
      "Continue routine observations per ward protocol",
      "No immediate escalation required",
    ],
    frequency: "Standard observations",
  };
  if (score <= 2) return {
    label: `Score ${score} — Increased Vigilance`,
    color: "amber",
    actions: [
      "Increase observation frequency to every 30–60 minutes",
      "Inform ward nurse in charge",
      "Consider medical review if score persists or worsens",
    ],
    frequency: "Obs q30–60 min",
  };
  if (score <= 4) return {
    label: `Score ${score} — Urgent Medical Review`,
    color: "orange",
    actions: [
      "Immediate notification of ward medical team",
      "Senior nursing review at bedside",
      "Document findings; reassess after any intervention",
      "Consider PICU early warning referral",
    ],
    frequency: "Continuous monitoring",
  };
  return {
    label: `Score ${score} — Clinical Emergency`,
    color: "red",
    actions: [
      "Activate rapid response / medical emergency team (MET) immediately",
      "Ensure airway, breathing, circulation assessment at bedside",
      "Escalate to PICU team",
      "Prepare for potential resuscitation",
      "Do not leave patient unattended",
    ],
    frequency: "Continuous — 1:1 nursing",
  };
}

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

export default function PEWSPage() {
  const [paramScores, setParamScores] = useState<Record<string, number>>({
    behaviour: 0, cardiovascular: 0, respiratory: 0,
  });
  const [modifiers, setModifiers] = useState<Record<string, boolean>>({});

  const total = useMemo(() => {
    const base = Object.values(paramScores).reduce((a, b) => a + b, 0);
    const mod = MODIFIERS.reduce((sum, m) => sum + (modifiers[m.key] ? m.points : 0), 0);
    return base + mod;
  }, [paramScores, modifiers]);

  const result = useMemo(() => interpret(total), [total]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-red-100 text-red-700">
          <Activity className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">PEWS — Pediatric Early Warning Score</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Structured 3-domain assessment for early detection of clinical deterioration in paediatric ward patients.
          </p>
        </div>
      </div>

      {/* Parameters */}
      {PARAMETERS.map((param) => (
        <Card key={param.key} className="rounded-3xl border-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-black">{param.label}</CardTitle>
                {param.description && <p className="text-xs text-muted-foreground mt-0.5">{param.description}</p>}
              </div>
              <Badge variant="secondary" className="font-black text-sm px-2.5">
                {paramScores[param.key]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {param.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setParamScores(s => ({ ...s, [param.key]: opt.value }))}
                className={cn(
                  "w-full text-left p-3.5 rounded-2xl border-2 transition-all",
                  paramScores[param.key] === opt.value
                    ? "bg-primary/5 border-primary shadow-sm"
                    : "bg-muted/20 border-transparent hover:border-muted-foreground/20"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className={cn(
                      "mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                      paramScores[param.key] === opt.value ? "bg-primary border-primary" : "border-muted-foreground/30"
                    )}>
                      {paramScores[param.key] === opt.value && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className={cn("font-semibold text-sm", paramScores[param.key] === opt.value && "text-primary")}>
                        {opt.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className={cn(
                    "shrink-0 font-black text-xs",
                    paramScores[param.key] === opt.value && "bg-primary/10 text-primary"
                  )}>
                    {opt.value}
                  </Badge>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Modifiers */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black">Modifiers <span className="font-normal text-muted-foreground">(+1 each)</span></CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {MODIFIERS.map(m => (
            <button
              key={m.key}
              onClick={() => setModifiers(s => ({ ...s, [m.key]: !s[m.key] }))}
              className={cn(
                "w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3",
                modifiers[m.key]
                  ? "bg-primary/5 border-primary shadow-sm"
                  : "bg-muted/20 border-transparent hover:border-muted-foreground/20"
              )}
            >
              <div className={cn(
                "h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0",
                modifiers[m.key] ? "bg-primary border-primary" : "border-muted-foreground/30"
              )}>
                {modifiers[m.key] && <div className="h-2.5 w-2.5 rounded-sm bg-white" />}
              </div>
              <span className={cn("text-sm font-semibold", modifiers[m.key] && "text-primary")}>{m.label}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Result */}
      <Card className={cn("rounded-3xl border-2", colorMap[result.color])}>
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
            <div>
              <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">PEWS Score</p>
              <p className="text-5xl font-black">{total}</p>
            </div>
            <div className="text-right space-y-1.5">
              <Badge className={cn("text-sm px-3 py-1 font-black", badgeMap[result.color])}>
                {result.frequency}
              </Badge>
            </div>
          </div>
          <p className="font-black text-sm mb-3">{result.label}</p>
          <div className="space-y-1.5">
            {result.actions.map((a, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="mt-0.5 shrink-0 opacity-50">•</span>
                <span>{a}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Escalation ladder */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black">Escalation Thresholds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { score: "0", label: "Routine", color: "emerald" },
              { score: "1–2", label: "Vigilance", color: "amber" },
              { score: "3–4", label: "Urgent Review", color: "orange" },
              { score: "≥5", label: "Emergency", color: "red" },
            ].map(({ score, label, color }) => (
              <div key={label} className={cn("rounded-2xl p-3 text-center border", colorMap[color])}>
                <p className="text-2xl font-black">{score}</p>
                <p className="text-xs font-black uppercase tracking-wide mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Escalation thresholds may vary by institution. Validate against your hospital's PEWS protocol. Any single domain scoring 3 alone warrants urgent review regardless of total.
          </p>
        </CardContent>
      </Card>

      <Alert className="rounded-2xl border-red-200 bg-red-50">
        <ShieldAlert className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 text-sm">
          <strong>Clinical override always applies.</strong> If a clinician is concerned about a patient at any score level, they should escalate immediately. PEWS guides — it does not replace — clinical judgement.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference: Monaghan A. <em>Intensive Crit Care Nurs</em> 2005;21:272–9 · Duncan H et al. <em>Resuscitation</em> 2006;68:45–52
      </p>
    </div>
  );
}
