import { useState, useMemo } from "react";
import { Wind, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Age group-specific RR thresholds
function ageGroupLabel(ageMonths: number) {
  if (ageMonths < 2) return "< 2 months";
  if (ageMonths < 12) return "2–11 months";
  if (ageMonths < 60) return "1–4 years";
  return "5–12 years";
}

function rrThreshold(ageMonths: number): { tachypnea: number; label: string } {
  if (ageMonths < 2) return { tachypnea: 60, label: "≥ 60/min" };
  if (ageMonths < 12) return { tachypnea: 50, label: "≥ 50/min" };
  if (ageMonths < 60) return { tachypnea: 40, label: "≥ 40/min" };
  return { tachypnea: 20, label: "≥ 20/min" };
}

const SEVERITY_FEATURES = [
  { id: "spo2_lt92", label: "SpO₂ < 92% on room air", category: "severe" },
  { id: "nasal_flaring", label: "Nasal flaring", category: "moderate" },
  { id: "severe_retractions", label: "Severe intercostal / subcostal retractions", category: "severe" },
  { id: "moderate_retractions", label: "Moderate retractions (visible but not severe)", category: "moderate" },
  { id: "grunting", label: "Grunting", category: "severe" },
  { id: "cyanosis", label: "Central cyanosis", category: "severe" },
  { id: "altered_consciousness", label: "Altered consciousness / very poor feeding", category: "severe" },
  { id: "apnea", label: "Apnoea", category: "severe" },
  { id: "poor_feeding", label: "Poor feeding (infant) / refusal to feed", category: "moderate" },
  { id: "dehydration", label: "Signs of dehydration", category: "moderate" },
  { id: "pleurisy", label: "Pleural effusion or empyema on imaging", category: "severe" },
  { id: "lung_abscess", label: "Necrotising pneumonia / lung abscess on imaging", category: "severe" },
];

function classify(features: string[]) {
  const hasSevere = features.some(f => SEVERITY_FEATURES.find(x => x.id === f)?.category === "severe");
  const moderateCount = features.filter(f => SEVERITY_FEATURES.find(x => x.id === f)?.category === "moderate").length;

  if (hasSevere || features.length >= 3) {
    return {
      label: "Severe CAP",
      color: "red",
      admit: "PICU / high-dependency admission",
      antibiotics: ["IV Ampicillin 150–200 mg/kg/day q6h + Gentamicin (if concern for gram-negative)", "OR IV Cefuroxime / Ceftriaxone 80 mg/kg/day", "Add Azithromycin if atypical organism suspected (> 5 years)"],
      oxygen: "High-flow nasal cannula / CPAP / mechanical ventilation as needed",
      duration: "10–14 days (or longer if complicated)",
    };
  }
  if (moderateCount >= 1 || features.length >= 1) {
    return {
      label: "Moderate CAP",
      color: "amber",
      admit: "Hospital admission — general paediatric ward",
      antibiotics: ["Oral Amoxicillin 90 mg/kg/day divided q8–12h (preferred for typical CAP)", "OR IV Ampicillin 150 mg/kg/day q6h if oral not tolerated", "Add Azithromycin 10 mg/kg/day if atypical suspected (> 5 years)"],
      oxygen: "Supplemental O₂ to maintain SpO₂ ≥ 92%",
      duration: "5–7 days",
    };
  }
  return {
    label: "Mild CAP",
    color: "emerald",
    admit: "Outpatient management — follow-up in 24–48 hours",
    antibiotics: ["Oral Amoxicillin 90 mg/kg/day divided q8–12h (high-dose for S. pneumoniae)", "Azithromycin 10 mg/kg/day if atypical organism suspected (school-age child, gradual onset, dry cough)"],
    oxygen: "Not required if SpO₂ ≥ 92% on room air",
    duration: "5 days (short-course evidence-based for mild-moderate)",
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

export default function CAPSeverityPage() {
  const [ageMonths, setAgeMonths] = useState("");
  const [rr, setRr] = useState("");
  const [features, setFeatures] = useState<string[]>([]);

  function toggle(id: string) {
    setFeatures(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  const ageNum = parseFloat(ageMonths);
  const rrNum = parseFloat(rr);
  const rrThresh = isNaN(ageNum) ? null : rrThreshold(ageNum);
  const isTachypneic = rrThresh && rrNum >= rrThresh.tachypnea;

  const allFeatures = useMemo(() => {
    const base = [...features];
    if (isTachypneic) base.push("_tachypnea");
    return base;
  }, [features, isTachypneic]);

  const result = allFeatures.length > 0 ? classify(allFeatures) : null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-sky-100 text-sky-700">
          <Wind className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Community-Acquired Pneumonia Severity</h1>
          <p className="text-muted-foreground text-sm mt-1">
            BTS/PIDS-based clinical severity classification and antibiotic guidance for paediatric CAP.
          </p>
        </div>
      </div>

      {/* Age and RR */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Patient Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-bold text-sm">Age</Label>
              <div className="relative">
                <Input type="number" min={0} step={1} placeholder="e.g. 18"
                  value={ageMonths} onChange={e => setAgeMonths(e.target.value)}
                  className="pr-16 h-11 rounded-xl font-semibold" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">months</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="font-bold text-sm">Respiratory Rate</Label>
              <div className="relative">
                <Input type="number" min={0} step={1} placeholder="e.g. 45"
                  value={rr} onChange={e => setRr(e.target.value)}
                  className="pr-10 h-11 rounded-xl font-semibold" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">/min</span>
              </div>
            </div>
          </div>

          {rrThresh && (
            <div className={cn("rounded-2xl p-3 flex items-center justify-between", isTachypneic ? "bg-orange-50 border border-orange-200" : "bg-muted/30")}>
              <span className="text-sm font-bold">
                Tachypnoea threshold for {ageGroupLabel(ageNum)}: {rrThresh.label}
              </span>
              {rrNum ? (
                <Badge className={isTachypneic ? "bg-orange-100 text-orange-800 font-black" : "bg-emerald-100 text-emerald-800 font-black"}>
                  {isTachypneic ? "Tachypnoeic" : "Normal RR"}
                </Badge>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Severity features */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Clinical Features Present</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Select all findings present on assessment</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {SEVERITY_FEATURES.map(f => (
            <button
              key={f.id}
              onClick={() => toggle(f.id)}
              className={cn(
                "w-full text-left p-3 rounded-2xl border-2 font-semibold text-sm transition-all flex items-center justify-between",
                features.includes(f.id)
                  ? f.category === "severe"
                    ? "bg-red-50 border-red-300 text-red-800"
                    : "bg-amber-50 border-amber-300 text-amber-800"
                  : "bg-muted/20 border-transparent hover:border-primary/30"
              )}
            >
              <span>
                <span className="mr-2">{features.includes(f.id) ? "✓" : "○"}</span>
                {f.label}
              </span>
              <Badge className={cn("shrink-0 font-bold text-xs", f.category === "severe" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700")}>
                {f.category}
              </Badge>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <Card className={cn("rounded-3xl border-2", colorMap[result.color])}>
          <CardContent className="pt-6 pb-6 space-y-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Severity Classification</p>
                <p className="text-3xl font-black">{result.label}</p>
              </div>
              <Badge className={cn("font-black text-sm px-3 py-1", badgeMap[result.color])}>
                {result.admit}
              </Badge>
            </div>

            <div className="rounded-2xl bg-white/60 p-4 border space-y-3">
              <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1.5">Antibiotic Therapy</p>
                {result.antibiotics.map((a, i) => (
                  <div key={i} className="flex gap-2 text-sm font-semibold mb-1">
                    <span className="opacity-50 shrink-0 mt-0.5">{i === 0 ? "→" : "·"}</span>
                    <span>{a}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Oxygen</p>
                <p className="text-sm font-semibold">{result.oxygen}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Duration</p>
                <p className="text-sm font-semibold">{result.duration}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* RR reference table */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Tachypnoea Thresholds by Age
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-black">Age Group</th>
                <th className="text-center py-2 font-black">Tachypnoea</th>
              </tr>
            </thead>
            <tbody className="divide-y text-muted-foreground">
              {[
                ["< 2 months", "≥ 60 /min"],
                ["2–11 months", "≥ 50 /min"],
                ["1–4 years", "≥ 40 /min"],
                ["5–12 years", "≥ 20 /min"],
              ].map(([age, thresh]) => (
                <tr key={age}>
                  <td className="py-2 font-semibold text-foreground">{age}</td>
                  <td className="text-center py-2">{thresh}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Alert className="rounded-2xl border-sky-200 bg-sky-50">
        <AlertTriangle className="h-4 w-4 text-sky-600" />
        <AlertDescription className="text-sky-800 text-sm">
          <strong>Viral vs Bacterial:</strong> Most CAP in children under 5 is viral. Clinical and radiological features cannot reliably distinguish. Amoxicillin remains first-line for presumed bacterial CAP. Do not add macrolide empirically in children under 5 unless atypical features present.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference: BTS Guidelines on Management of Childhood Pneumonia 2011 · PIDS/IDSA Guideline 2011 · WHO Pocket Book of Hospital Care for Children 2013
      </p>
    </div>
  );
}
