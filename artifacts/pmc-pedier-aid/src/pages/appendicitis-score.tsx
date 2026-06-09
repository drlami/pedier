import { useState, useMemo } from "react";
import { Stethoscope, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const CRITERIA = [
  {
    key: "rlq_tenderness",
    label: "RLQ tenderness on cough / percussion / hopping",
    description: "Positive Rovsing sign, rebound, or pain with percussion over RLQ",
    points: 2,
  },
  {
    key: "rebound",
    label: "Rebound tenderness in RLQ",
    description: "Guarding or true rebound tenderness localised to right iliac fossa",
    points: 2,
  },
  {
    key: "migration",
    label: "Migration of pain to RLQ",
    description: "Pain started periumbilically or diffusely and migrated to RLQ",
    points: 1,
  },
  {
    key: "anorexia",
    label: "Anorexia",
    description: "Loss of appetite since onset of pain",
    points: 1,
  },
  {
    key: "nausea_vomiting",
    label: "Nausea / vomiting",
    description: "At least one episode of nausea or vomiting",
    points: 1,
  },
  {
    key: "fever",
    label: "Fever ≥38.0°C",
    description: "Temperature ≥38.0°C at presentation",
    points: 1,
  },
  {
    key: "leukocytosis",
    label: "Leukocytosis (WBC ≥10,000 / mm³)",
    description: "Total white cell count ≥10,000 cells/mm³",
    points: 1,
  },
  {
    key: "left_shift",
    label: "Left shift (PMN ≥75% or neutrophilia)",
    description: "PMN ≥75% OR band forms present on differential",
    points: 1,
  },
];

const MAX_SCORE = CRITERIA.reduce((a, c) => a + c.points, 0); // 10

function classify(score: number) {
  if (score <= 3) return {
    label: "Low Risk",
    risk: "< 5%",
    color: "emerald",
    recommendation: [
      "Appendicitis unlikely — outpatient management appropriate",
      "Observe and reassess in 12–24 hours if symptoms persist",
      "Imaging not routinely required; consider ultrasound if diagnostic uncertainty",
      "Discharge with clear return precautions",
    ],
    action: "Observe / Discharge"
  };
  if (score <= 6) return {
    label: "Intermediate Risk",
    risk: "~30–40%",
    color: "amber",
    recommendation: [
      "Admit for observation and serial abdominal examinations",
      "Ultrasound abdomen (sensitivity ~75–85% for appendicitis)",
      "Consider CT abdomen/pelvis if USS inconclusive and clinical concern remains",
      "Surgical review — decision based on imaging and clinical trajectory",
      "Nil by mouth; IV access; analgesia",
    ],
    action: "Admit / Image"
  };
  return {
    label: "High Risk",
    risk: "~90%",
    color: "red",
    recommendation: [
      "Urgent surgical review — high probability of appendicitis",
      "Imaging may be performed but should not delay surgical consultation",
      "Nil by mouth; IV access; IV analgesia (does not mask diagnosis)",
      "Consider laparoscopic appendicectomy vs. drainage (for periappendiceal abscess)",
      "IV antibiotics if perforated appendicitis suspected",
    ],
    action: "Urgent Surgery"
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

export default function AppendicitisScorePage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const total = useMemo(() =>
    CRITERIA.reduce((sum, c) => sum + (checked[c.key] ? c.points : 0), 0),
    [checked]
  );

  const result = useMemo(() => classify(total), [total]);
  const answered = Object.keys(checked).length;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-orange-100 text-orange-700">
          <Stethoscope className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Pediatric Appendicitis Score</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Samuel 2002 — 10-point score to stratify appendicitis risk in children and guide imaging decisions.
          </p>
        </div>
      </div>

      {/* Criteria checkboxes */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-black">Clinical Criteria</CardTitle>
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
                  "mt-0.5 h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
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
          <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
            <div>
              <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">PAS Score</p>
              <p className="text-5xl font-black">{total}<span className="text-2xl font-semibold opacity-50">/{MAX_SCORE}</span></p>
            </div>
            <div className="text-right space-y-2">
              <Badge className={cn("text-sm px-3 py-1 font-black", badgeMap[result.color])}>
                {result.label}
              </Badge>
              <p className="text-sm font-bold">Risk ≈ {result.risk}</p>
              <p className="text-xs font-black uppercase tracking-widest">{result.action}</p>
            </div>
          </div>

          <p className="font-black text-sm uppercase tracking-widest mb-3">Recommended Action</p>
          <div className="space-y-1.5">
            {result.recommendation.map((r, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="mt-0.5 shrink-0 opacity-50">•</span>
                <span>{r}</span>
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
            Score Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {[
              { range: "1–3", label: "Low Risk", sub: "Observe / DC", color: "emerald" },
              { range: "4–6", label: "Intermediate", sub: "Admit / Imaging", color: "amber" },
              { range: "7–10", label: "High Risk", sub: "Surgical Review", color: "red" },
            ].map(({ range, label, sub, color }) => (
              <div key={label} className={cn("rounded-2xl p-3 text-center border", colorMap[color])}>
                <p className="text-2xl font-black">{range}</p>
                <p className="text-xs font-black uppercase tracking-wide mt-0.5">{label}</p>
                <p className="text-[10px] opacity-70 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Alert className="rounded-2xl border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800 text-sm">
          <strong>Diagnostic limitations:</strong> PAS performs best in children 4–15 years. In girls, ovarian pathology may mimic appendicitis — pelvic ultrasound is recommended. A score in the intermediate range requires serial reassessment; consider obstetric/gynaecology review in post-menarchal girls.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference: Samuel M. <em>J Pediatr Surg</em> 2002;37:877–81 · Goldman RD et al. <em>Ann Emerg Med</em> 2008;51:286–91
      </p>
    </div>
  );
}
