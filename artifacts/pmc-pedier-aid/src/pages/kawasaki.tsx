import { useState, useMemo } from "react";
import { Heart, AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const PRINCIPAL_FEATURES = [
  {
    key: "conjunctivitis",
    label: "Bilateral Non-purulent Conjunctival Injection",
    description: "Bulbar conjunctivae — without exudate, without limbic sparing",
  },
  {
    key: "oral",
    label: "Oral / Lip Changes",
    description: "Strawberry tongue, lip erythema/cracking, pharyngeal hyperaemia",
  },
  {
    key: "rash",
    label: "Polymorphous Erythematous Rash",
    description: "Maculopapular, urticarial, or erythroderma — not vesicular or bullous",
  },
  {
    key: "extremities",
    label: "Extremity Changes",
    description: "Acute phase: erythema + indurative oedema of hands/feet. Subacute: periungual desquamation",
  },
  {
    key: "lymphadenopathy",
    label: "Cervical Lymphadenopathy ≥ 1.5 cm",
    description: "Usually unilateral, non-fluctuant, firm cervical node — often painful",
  },
];

const INCOMPLETE_LABS = [
  { key: "crp_esr", label: "CRP ≥ 3.0 mg/dL OR ESR ≥ 40 mm/hr" },
  { key: "anaemia", label: "Anaemia for age" },
  { key: "platelets", label: "Platelets ≥ 450,000 after day 7 (thrombocytosis)" },
  { key: "alb", label: "Albumin ≤ 3.0 g/dL" },
  { key: "alt", label: "Elevated ALT / transaminases" },
  { key: "leukocytes", label: "WBC ≥ 15,000 cells/mm³" },
  { key: "urine", label: "Urine ≥ 10 WBC per high-power field" },
];

const ECHO_FINDINGS = [
  { key: "lad_z", label: "Left anterior descending artery Z-score ≥ 2.5" },
  { key: "rca_z", label: "Right coronary artery Z-score ≥ 2.5" },
  { key: "perikardial", label: "Pericardial effusion" },
  { key: "mitralis", label: "Mitral regurgitation" },
];

export default function KawasakiPage() {
  const [fever, setFever] = useState<boolean | null>(null);
  const [feverDays, setFeverDays] = useState<number | null>(null);
  const [features, setFeatures] = useState<Record<string, boolean>>({});
  const [labs, setLabs] = useState<Record<string, boolean>>({});
  const [echo, setEcho] = useState<Record<string, boolean>>({});

  const featureCount = PRINCIPAL_FEATURES.filter(f => features[f.key]).length;
  const labCount = INCOMPLETE_LABS.filter(l => labs[l.key]).length;
  const echoPositive = ECHO_FINDINGS.some(e => echo[e.key]);

  const diagnosis = useMemo(() => {
    if (!fever) return null;
    const days = feverDays ?? 0;

    // Classic KD: fever ≥5 days + ≥4 features (or ≥3 + positive echo)
    if (days >= 5 && featureCount >= 4) {
      return {
        label: "Classic Kawasaki Disease",
        confidence: "high",
        color: "red",
        treat: true,
        summary: "Meets classic diagnostic criteria — 4 or more principal features with fever ≥ 5 days.",
      };
    }
    if (days >= 5 && featureCount === 3 && echoPositive) {
      return {
        label: "Classic Kawasaki Disease (Echo-confirmed)",
        confidence: "high",
        color: "red",
        treat: true,
        summary: "3 principal features + coronary abnormality on echo — equivalent to classic criteria.",
      };
    }

    // Incomplete KD: fever ≥5 days + 2–3 features + supportive labs or echo
    if (days >= 5 && featureCount >= 2 && featureCount <= 3 && (labCount >= 3 || echoPositive)) {
      return {
        label: "Incomplete Kawasaki Disease",
        confidence: "moderate",
        color: "orange",
        treat: true,
        summary: "2–3 principal features with supportive laboratory findings or coronary changes — treat as KD.",
      };
    }

    // Possible incomplete — warrant further workup
    if (days >= 5 && featureCount >= 2) {
      return {
        label: "Possible Incomplete KD — Further Workup Needed",
        confidence: "low",
        color: "amber",
        treat: false,
        summary: "2–3 features but insufficient lab/echo data. Obtain CRP/ESR, CBC, LFTs, UA, echocardiogram.",
      };
    }

    // Fever < 5 days or < 2 features — KD unlikely but flag for follow-up
    if (days >= 1 && featureCount >= 2) {
      return {
        label: "Monitor — Fever Duration Criteria Not Yet Met",
        confidence: "low",
        color: "amber",
        treat: false,
        summary: "Fever duration < 5 days. Re-evaluate daily — if features persist at day 5, initiate KD workup.",
      };
    }

    return {
      label: "Kawasaki Disease Unlikely",
      confidence: "low",
      color: "emerald",
      treat: false,
      summary: `${featureCount} principal feature${featureCount !== 1 ? "s" : ""} present. Consider alternative diagnoses.`,
    };
  }, [fever, feverDays, featureCount, labCount, echoPositive]);

  const colorMap: Record<string, string> = {
    emerald: "text-emerald-700 border-emerald-200 bg-emerald-50",
    amber:   "text-amber-700 border-amber-200 bg-amber-50",
    orange:  "text-orange-700 border-orange-200 bg-orange-50",
    red:     "text-red-700 border-red-200 bg-red-50",
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-pink-100 text-pink-700">
          <Heart className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Kawasaki Disease Criteria</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Classic and incomplete KD diagnostic criteria with coronary artery risk assessment.
          </p>
        </div>
      </div>

      {/* Fever */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Fever Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">High fever (≥ 38.5°C) is the cardinal feature of Kawasaki disease and is required for diagnosis.</p>
          <div className="flex gap-3">
            {[
              { val: true, label: "Fever Present" },
              { val: false, label: "No Fever" },
            ].map(({ val, label }) => (
              <button
                key={String(val)}
                onClick={() => setFever(val)}
                className={cn(
                  "flex-1 py-3 rounded-2xl font-black text-sm border-2 transition-all",
                  fever === val
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-muted/30 text-muted-foreground border-transparent hover:border-primary/30"
                )}
              >
                {label}
              </button>
            ))}
          </div>
          {fever && (
            <div>
              <p className="text-sm font-bold mb-2">Duration of fever:</p>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(d => (
                  <button
                    key={d}
                    onClick={() => setFeverDays(d)}
                    className={cn(
                      "w-12 h-10 rounded-xl font-black text-sm border-2 transition-all",
                      feverDays === d
                        ? "bg-primary text-white border-primary shadow-md"
                        : "bg-muted/30 text-muted-foreground border-transparent hover:border-primary/30"
                    )}
                  >
                    {d}{d === 10 ? "+" : ""}d
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Principal features */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-black">Principal Clinical Features</CardTitle>
            <Badge variant="secondary" className="font-black text-base px-3">
              {featureCount} / 5
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">Classic KD requires ≥ 4 features (or ≥ 3 with echo evidence)</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {PRINCIPAL_FEATURES.map(f => (
            <button
              key={f.key}
              onClick={() => setFeatures(s => ({ ...s, [f.key]: !s[f.key] }))}
              className={cn(
                "w-full text-left p-4 rounded-2xl border-2 transition-all",
                features[f.key]
                  ? "bg-pink-50 border-pink-400 shadow-sm"
                  : "bg-muted/20 border-transparent hover:border-muted-foreground/20"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "mt-0.5 h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0",
                  features[f.key] ? "bg-pink-500 border-pink-500" : "border-muted-foreground/30"
                )}>
                  {features[f.key] && <div className="h-2.5 w-2.5 rounded-sm bg-white" />}
                </div>
                <div>
                  <p className={cn("font-bold text-sm", features[f.key] && "text-pink-700")}>{f.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.description}</p>
                </div>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Lab findings for incomplete */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-black">Supportive Laboratory Findings</CardTitle>
            <Badge variant="secondary" className="font-bold text-sm px-2">
              {labCount} / {INCOMPLETE_LABS.length}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">Used to support incomplete KD diagnosis when &lt; 4 principal features present</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {INCOMPLETE_LABS.map(l => (
            <button
              key={l.key}
              onClick={() => setLabs(s => ({ ...s, [l.key]: !s[l.key] }))}
              className={cn(
                "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
                labs[l.key]
                  ? "bg-orange-50 border-orange-300"
                  : "bg-muted/10 border-muted/30 hover:border-muted-foreground/20"
              )}
            >
              <div className={cn(
                "h-4 w-4 rounded border-2 flex items-center justify-center shrink-0",
                labs[l.key] ? "bg-orange-500 border-orange-500" : "border-muted-foreground/30"
              )}>
                {labs[l.key] && <div className="h-2 w-2 rounded-sm bg-white" />}
              </div>
              <span className="text-sm font-medium">{l.label}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Echo findings */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black flex items-center gap-2">
            Echocardiogram Findings
            {echoPositive && <Badge className="bg-red-100 text-red-700 font-black">Positive</Badge>}
          </CardTitle>
          <p className="text-xs text-muted-foreground">Coronary abnormalities or pericardial involvement</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {ECHO_FINDINGS.map(e => (
            <button
              key={e.key}
              onClick={() => setEcho(s => ({ ...s, [e.key]: !s[e.key] }))}
              className={cn(
                "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
                echo[e.key]
                  ? "bg-red-50 border-red-300"
                  : "bg-muted/10 border-muted/30 hover:border-muted-foreground/20"
              )}
            >
              <div className={cn(
                "h-4 w-4 rounded border-2 flex items-center justify-center shrink-0",
                echo[e.key] ? "bg-red-500 border-red-500" : "border-muted-foreground/30"
              )}>
                {echo[e.key] && <div className="h-2 w-2 rounded-sm bg-white" />}
              </div>
              <span className="text-sm font-medium">{e.label}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Diagnosis */}
      {diagnosis && (
        <Card className={cn("rounded-3xl border-2", colorMap[diagnosis.color])}>
          <CardContent className="pt-6 pb-6">
            <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">Assessment</p>
            <p className="text-2xl font-black mb-2">{diagnosis.label}</p>
            <p className="text-sm opacity-80 mb-5">{diagnosis.summary}</p>

            {diagnosis.treat && (
              <>
                <Separator className="mb-4 opacity-30" />
                <p className="font-black text-sm uppercase tracking-widest mb-3">Treatment (AHA / AAP Protocol)</p>
                <div className="space-y-1.5 text-sm">
                  {[
                    "IVIG: 2 g/kg IV as a single infusion over 10–12 hours — within first 10 days of fever (ideally days 5–9)",
                    "Aspirin: 80–100 mg/kg/day divided q6h (high-dose anti-inflammatory) — until afebrile ≥ 48 hours",
                    "Then aspirin 3–5 mg/kg/day (low-dose antiplatelet) × 6–8 weeks if no coronary changes",
                    "If coronary Z-score ≥ 2.5: continue antiplatelet therapy long-term — cardiology follow-up",
                    "Echocardiogram at diagnosis, 2 weeks, and 6 weeks post-treatment",
                    "IVIG-resistant KD (fever persisting ≥ 36h after IVIG): second IVIG dose OR infliximab OR corticosteroids",
                  ].map((m, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="mt-0.5 shrink-0 opacity-50">•</span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Alert className="rounded-2xl border-pink-200 bg-pink-50">
        <ShieldAlert className="h-4 w-4 text-pink-600" />
        <AlertDescription className="text-pink-800 text-sm">
          <strong>Coronary risk:</strong> Without treatment, 15–25% of children develop coronary artery aneurysms. With timely IVIG + aspirin, this falls to &lt;5%. Giant aneurysms (Z-score &gt;10 or diameter &gt;8 mm) carry highest risk of myocardial infarction.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference: McCrindle BW et al. AHA Scientific Statement. <em>Circulation</em> 2017;135:e927–e999
      </p>
    </div>
  );
}
