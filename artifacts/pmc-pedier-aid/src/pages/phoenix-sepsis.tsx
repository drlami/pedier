import { useState, useMemo } from "react";
import { AlertTriangle, Info, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Phoenix Sepsis Score (Schlapbach et al. JAMA 2024)
// Domains: Respiratory, Cardiovascular, Coagulation, Neurological
// Sepsis: ≥2 points from suspected/confirmed infection
// Septic Shock: ≥1 Cardiovascular point from sepsis criteria

const RESP_OPTIONS = [
  { score: 0, label: "PaO₂/FiO₂ ≥ 400 or SpO₂/FiO₂ ≥ 292" },
  { score: 1, label: "SpO₂/FiO₂ 220–291 OR PaO₂/FiO₂ 200–399" },
  { score: 2, label: "SpO₂/FiO₂ 148–219 OR PaO₂/FiO₂ 100–199 — with any respiratory support" },
  { score: 3, label: "SpO₂/FiO₂ < 148 OR PaO₂/FiO₂ < 100 — with invasive MV" },
];

const CV_OPTIONS = [
  { score: 0, label: "No vasoactives" },
  { score: 1, label: "Dopamine ≤ 5 mcg/kg/min OR any dose dobutamine, milrinone, or vasopressin" },
  { score: 2, label: "Norepinephrine ≤ 0.1 OR Epinephrine ≤ 0.1 OR Dopamine > 5 mcg/kg/min" },
  { score: 3, label: "Norepinephrine > 0.1 OR Epinephrine > 0.1 mcg/kg/min" },
  { score: 6, label: "Multiple vasoactives including high-dose vasopressin + catecholamines" },
];

// Lactate thresholds also contribute to CV score
const CV_LACTATE = [
  { score: 0, label: "Lactate < 5 mmol/L" },
  { score: 1, label: "Lactate 5–10.9 mmol/L" },
  { score: 2, label: "Lactate ≥ 11 mmol/L" },
];

const COAG_OPTIONS = [
  { score: 0, label: "All normal (no criteria below)" },
  { score: 1, label: "INR 1.3–1.9 OR D-dimer 2–7.9 mg/L OR fibrinogen 100–199 mg/dL" },
  { score: 2, label: "INR ≥ 2.0 OR D-dimer ≥ 8 mg/L OR fibrinogen < 100 mg/dL OR platelet 50–99" },
  { score: 3, label: "Platelet < 50 × 10⁹/L" },
];

const NEURO_OPTIONS = [
  { score: 0, label: "Awake, alert and oriented" },
  { score: 1, label: "Altered — confused, agitated, GCS < baseline but > 10" },
  { score: 2, label: "GCS ≤ 10 OR pupils bilaterally fixed/dilated" },
];

function getSFRatio(spo2: number, fio2Pct: number): number {
  return (spo2 / (fio2Pct / 100));
}

type Sel = Record<string, number>;

export default function PhoenixSepsisPage() {
  const [resp, setResp] = useState<number | null>(null);
  const [cv, setCv] = useState<number | null>(null);
  const [cvLactate, setCvLactate] = useState<number | null>(null);
  const [coag, setCoag] = useState<number | null>(null);
  const [neuro, setNeuro] = useState<number | null>(null);

  // SF ratio helper
  const [spo2, setSpo2] = useState("");
  const [fio2, setFio2] = useState("");

  const sfRatio = useMemo(() => {
    const s = parseFloat(spo2), f = parseFloat(fio2);
    if (!s || !f || f <= 0) return null;
    return +(getSFRatio(s, f)).toFixed(1);
  }, [spo2, fio2]);

  // CV score = max(vasoactive score, lactate score) — additive not summed
  // Phoenix paper: CV = max of vasoactive OR lactate contribution per scoring table
  const cvTotal = cv !== null && cvLactate !== null ? Math.max(cv, cvLactate) : (cv ?? cvLactate ?? null);

  const totalScore = useMemo(() => {
    let t = 0;
    if (resp !== null) t += resp;
    if (cvTotal !== null) t += cvTotal;
    if (coag !== null) t += coag;
    if (neuro !== null) t += neuro;
    return t;
  }, [resp, cvTotal, coag, neuro]);

  const allSelected = resp !== null && (cv !== null || cvLactate !== null) && coag !== null && neuro !== null;

  const isPhoenixSepsis = allSelected && totalScore >= 2;
  const isSepticShock = isPhoenixSepsis && (cvTotal ?? 0) >= 1;

  const classColor = !allSelected ? "muted" : isSepticShock ? "red" : isPhoenixSepsis ? "orange" : "emerald";

  const colorMap: Record<string, string> = {
    emerald: "text-emerald-700 border-emerald-200 bg-emerald-50",
    orange:  "text-orange-700 border-orange-200 bg-orange-50",
    red:     "text-red-700 border-red-200 bg-red-50",
    muted:   "text-muted-foreground border-muted bg-muted/20",
  };
  const badgeMap: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-800",
    orange:  "bg-orange-100 text-orange-800",
    red:     "bg-red-100 text-red-800",
    muted:   "bg-muted text-muted-foreground",
  };

  function OptionBtn({ score, label, selected, onSelect }: { score: number; label: string; selected: boolean; onSelect: () => void }) {
    return (
      <button onClick={onSelect} className={cn(
        "w-full text-left p-3 rounded-2xl border-2 text-sm font-semibold transition-all flex items-start gap-3",
        selected ? "bg-primary/10 border-primary text-primary" : "bg-muted/20 border-transparent hover:border-primary/30"
      )}>
        <span className={cn("shrink-0 h-6 w-6 rounded-full flex items-center justify-center font-black text-xs border-2 mt-0.5",
          selected ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground border-muted"
        )}>{score}</span>
        <span>{label}</span>
      </button>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-red-100 text-red-700">
          <Activity className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Phoenix Sepsis Score (2024)</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Updated international consensus definition for paediatric sepsis and septic shock (Schlapbach et al., JAMA 2024).
          </p>
        </div>
      </div>

      <Alert className="rounded-2xl border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 text-sm">
          <strong>Phoenix Sepsis</strong> = ≥ 2 total points in context of suspected/confirmed infection.<br />
          <strong>Phoenix Septic Shock</strong> = sepsis criteria + ≥ 1 cardiovascular point.
        </AlertDescription>
      </Alert>

      {/* SF Ratio helper */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            SpO₂/FiO₂ Ratio Calculator (for Respiratory Domain)
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4 items-end">
          <div className="space-y-1.5">
            <Label className="font-bold text-sm">SpO₂</Label>
            <div className="relative">
              <Input type="number" min={50} max={100} placeholder="e.g. 95" value={spo2} onChange={e => setSpo2(e.target.value)} className="pr-8 h-10 rounded-xl font-semibold" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">%</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="font-bold text-sm">FiO₂</Label>
            <div className="relative">
              <Input type="number" min={21} max={100} placeholder="e.g. 40" value={fio2} onChange={e => setFio2(e.target.value)} className="pr-8 h-10 rounded-xl font-semibold" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">%</span>
            </div>
          </div>
          <div className="rounded-2xl bg-primary/5 p-3 text-center border border-primary/20">
            <p className="text-xs font-bold text-muted-foreground">SF Ratio</p>
            <p className="text-2xl font-black text-primary">{sfRatio ?? "—"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Respiratory */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-black">1. Respiratory</CardTitle>
            {resp !== null && <Badge className="bg-primary/10 text-primary font-black">+{resp}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {RESP_OPTIONS.map(o => <OptionBtn key={o.score} score={o.score} label={o.label} selected={resp === o.score} onSelect={() => setResp(o.score)} />)}
        </CardContent>
      </Card>

      {/* Cardiovascular */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg font-black">2. Cardiovascular</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Score = maximum of vasoactive OR lactate component</p>
            </div>
            {cvTotal !== null && <Badge className="bg-primary/10 text-primary font-black">+{cvTotal}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-black mb-2">Vasoactive Medications</p>
            <div className="space-y-1.5">
              {CV_OPTIONS.map(o => <OptionBtn key={o.score} score={o.score} label={o.label} selected={cv === o.score} onSelect={() => setCv(o.score)} />)}
            </div>
          </div>
          <div>
            <p className="text-sm font-black mb-2">Lactate</p>
            <div className="space-y-1.5">
              {CV_LACTATE.map(o => <OptionBtn key={o.score} score={o.score} label={o.label} selected={cvLactate === o.score} onSelect={() => setCvLactate(o.score)} />)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coagulation */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-black">3. Coagulation</CardTitle>
            {coag !== null && <Badge className="bg-primary/10 text-primary font-black">+{coag}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {COAG_OPTIONS.map(o => <OptionBtn key={o.score} score={o.score} label={o.label} selected={coag === o.score} onSelect={() => setCoag(o.score)} />)}
        </CardContent>
      </Card>

      {/* Neurological */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-black">4. Neurological</CardTitle>
            {neuro !== null && <Badge className="bg-primary/10 text-primary font-black">+{neuro}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {NEURO_OPTIONS.map(o => <OptionBtn key={o.score} score={o.score} label={o.label} selected={neuro === o.score} onSelect={() => setNeuro(o.score)} />)}
        </CardContent>
      </Card>

      {/* Result */}
      <Card className={cn("rounded-3xl border-2", colorMap[classColor])}>
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Phoenix Score</p>
              <p className="text-5xl font-black">{allSelected ? totalScore : "—"}</p>
            </div>
            <div className="text-right space-y-1">
              {allSelected && (
                <>
                  <Badge className={cn("font-black text-sm px-3 py-1 block", isSepticShock ? badgeMap.red : isPhoenixSepsis ? badgeMap.orange : badgeMap.emerald)}>
                    {isSepticShock ? "Phoenix Septic Shock" : isPhoenixSepsis ? "Phoenix Sepsis" : "Does not meet sepsis criteria"}
                  </Badge>
                </>
              )}
              {!allSelected && <p className="text-sm opacity-60">Select all 4 domains to score</p>}
            </div>
          </div>

          {allSelected && (
            <div className="space-y-1.5 text-sm">
              {isSepticShock && [
                "Septic shock = sepsis + cardiovascular dysfunction",
                "Immediate IV access × 2 + fluid resuscitation 10–20 mL/kg NS (reassess after each bolus)",
                "Vasoactive support: Norepinephrine first-line if unresponsive to fluids",
                "Empiric broad-spectrum antibiotics within 1 hour",
                "PICU admission — continuous monitoring and organ support",
                "Hydrocortisone if vasopressor-refractory: 2 mg/kg/day divided q6h (max 200 mg/day)",
              ].map((s, i) => <div key={i} className="flex gap-2"><span className="opacity-50 shrink-0 mt-0.5">•</span><span>{s}</span></div>)}
              {isPhoenixSepsis && !isSepticShock && [
                "Sepsis without cardiovascular organ dysfunction",
                "Empiric antibiotics within 1 hour of recognition",
                "IV access, bloods: CBC, CMP, lactate, cultures, CRP, procalcitonin",
                "HDU admission — monitor for deterioration to septic shock",
                "Fluid resuscitation as needed — avoid volume overload",
              ].map((s, i) => <div key={i} className="flex gap-2"><span className="opacity-50 shrink-0 mt-0.5">•</span><span>{s}</span></div>)}
              {!isPhoenixSepsis && [
                "Does not meet Phoenix Sepsis criteria (< 2 points)",
                "Continue monitoring — reassess if clinical deterioration",
                "Consider alternative diagnoses if infection is suspected",
              ].map((s, i) => <div key={i} className="flex gap-2"><span className="opacity-50 shrink-0 mt-0.5">•</span><span>{s}</span></div>)}
            </div>
          )}
        </CardContent>
      </Card>

      <Alert className="rounded-2xl border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 text-sm">
          Phoenix Score replaces older SIRS-based definitions (Goldstein 2005). It requires a <strong>suspected or confirmed infection</strong> — score alone without infectious source does not define sepsis. Validated across &gt; 3 million PICU encounters.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference: Schlapbach LJ et al. <em>JAMA</em> 2024;331(8):665–674 · Phoenix Sepsis Criteria International Consensus
      </p>
    </div>
  );
}
