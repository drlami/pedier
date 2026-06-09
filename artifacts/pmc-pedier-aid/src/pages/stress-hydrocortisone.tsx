import { useState, useMemo } from "react";
import { Pill, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const STRESS_LEVELS = [
  {
    id: "minor",
    label: "Minor Illness",
    description: "Low-grade fever, mild viral illness, minor procedure without anaesthesia",
    oral: (maint: number) => ({ dose: maint * 3, label: "Triple maintenance dose" }),
    iv: null,
    duration: "2–3 days or until well",
    route: "Oral",
    color: "amber",
  },
  {
    id: "moderate",
    label: "Moderate Illness",
    description: "High fever ≥ 38.5°C, significant infection, minor surgery with anaesthesia",
    oral: (bsa: number) => ({ dose: +(bsa * 50).toFixed(0), label: "50 mg/m²/day divided q8h" }),
    iv: (bsa: number) => ({ dose: +(bsa * 50).toFixed(0), label: "50 mg/m²/day IV/IM divided q6–8h" }),
    duration: "Until significantly improved, then taper over 2–3 days",
    route: "Oral (IV if vomiting)",
    color: "orange",
  },
  {
    id: "severe",
    label: "Major Surgery / Critical Illness",
    description: "Major surgery, significant trauma, septic shock, ICU admission",
    oral: null,
    iv: (bsa: number) => ({ dose: +(bsa * 100).toFixed(0), label: "100 mg/m²/day IV divided q6h" }),
    duration: "Until haemodynamically stable, then taper 50% every 24–48h",
    route: "IV only",
    color: "red",
  },
  {
    id: "crisis",
    label: "Adrenal Crisis / Emergency",
    description: "Acute adrenal crisis, haemodynamic instability, collapse, loss of consciousness",
    oral: null,
    iv: (bsa: number) => ({ dose: +(bsa * 100).toFixed(0), label: "Bolus: 100 mg/m² IV STAT, then 100 mg/m²/day" }),
    duration: "Continuous IV until stable (≥ 24h)",
    route: "IV STAT — do not delay",
    color: "red",
  },
];

function calcBSA(heightCm: number, weightKg: number): number {
  return Math.sqrt((heightCm * weightKg) / 3600);
}

const colorMap: Record<string, string> = {
  amber:  "text-amber-700 border-amber-200 bg-amber-50",
  orange: "text-orange-700 border-orange-200 bg-orange-50",
  red:    "text-red-700 border-red-200 bg-red-50",
};

const badgeMap: Record<string, string> = {
  amber:  "bg-amber-100 text-amber-800",
  orange: "bg-orange-100 text-orange-800",
  red:    "bg-red-100 text-red-800",
};

export default function StressHydrocortisonePage() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [maintDose, setMaintDose] = useState("9"); // mg/m²/day default 9

  const bsa = useMemo(() => {
    const w = parseFloat(weight), h = parseFloat(height);
    if (!w || !h || w <= 0 || h <= 0) return null;
    return +calcBSA(h, w).toFixed(2);
  }, [weight, height]);

  const maintenanceMgDay = useMemo(() => {
    if (!bsa) return null;
    const m = parseFloat(maintDose);
    return +(bsa * m).toFixed(1);
  }, [bsa, maintDose]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-orange-100 text-orange-700">
          <Pill className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Stress Dose Hydrocortisone</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Weight-based dosing for adrenal insufficiency and CAH during illness, surgery, or emergency.
          </p>
        </div>
      </div>

      <Alert className="rounded-2xl border-orange-200 bg-orange-50">
        <Info className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800 text-sm">
          <strong>Indication:</strong> Children with known or suspected adrenal insufficiency (CAH, Addison's disease, prolonged steroid use, hypopituitarism). All calculations based on BSA using Mosteller formula.
        </AlertDescription>
      </Alert>

      {/* Patient data */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Patient Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-bold text-sm">Weight</Label>
              <div className="relative">
                <Input type="number" min={0} step={0.1} placeholder="e.g. 20"
                  value={weight} onChange={e => setWeight(e.target.value)}
                  className="pr-10 h-11 rounded-xl font-semibold" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">kg</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="font-bold text-sm">Height</Label>
              <div className="relative">
                <Input type="number" min={0} step={0.5} placeholder="e.g. 110"
                  value={height} onChange={e => setHeight(e.target.value)}
                  className="pr-10 h-11 rounded-xl font-semibold" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">cm</span>
              </div>
            </div>
          </div>

          {bsa && (
            <div className="rounded-2xl bg-muted/30 p-3 flex items-center justify-between">
              <span className="text-sm font-bold">Calculated BSA</span>
              <span className="text-2xl font-black">{bsa} <span className="text-sm font-semibold text-muted-foreground">m²</span></span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="font-bold text-sm">Maintenance Dose (baseline)</Label>
            <p className="text-xs text-muted-foreground">Standard range: 8–10 mg/m²/day. Adjust per endocrinology plan.</p>
            <div className="relative w-40">
              <Input type="number" min={6} max={15} step={0.5} placeholder="9"
                value={maintDose} onChange={e => setMaintDose(e.target.value)}
                className="pr-16 h-11 rounded-xl font-semibold" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">mg/m²/d</span>
            </div>
            {maintenanceMgDay && (
              <p className="text-sm font-bold text-primary">
                Maintenance = {maintenanceMgDay} mg/day
                {bsa && ` (${+(maintenanceMgDay / 3).toFixed(1)} mg q8h)`}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stress level cards */}
      <div className="space-y-4">
        {STRESS_LEVELS.map(level => {
          const oralResult = bsa && level.oral
            ? (level.id === "minor" && maintenanceMgDay
              ? { dose: +(maintenanceMgDay * 3).toFixed(1), label: "Triple maintenance dose" }
              : level.oral(bsa!))
            : null;
          const ivResult = bsa && level.iv ? level.iv(bsa!) : null;

          return (
            <Card key={level.id} className={cn("rounded-3xl border-2", colorMap[level.color])}>
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                  <div>
                    <p className="font-black text-lg">{level.label}</p>
                    <p className="text-sm opacity-70">{level.description}</p>
                  </div>
                  <Badge className={cn("font-bold shrink-0", badgeMap[level.color])}>{level.route}</Badge>
                </div>

                {bsa ? (
                  <div className="space-y-2">
                    {oralResult && (
                      <div className="rounded-2xl bg-white/60 p-3 border">
                        <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-0.5">Oral Dose</p>
                        <p className="text-2xl font-black">{oralResult.dose} mg/day</p>
                        <p className="text-xs opacity-70">{oralResult.label}</p>
                        <p className="text-xs opacity-60 mt-0.5">
                          = {+(oralResult.dose / 3).toFixed(1)} mg per dose (q8h) or {+(oralResult.dose / 2).toFixed(1)} mg (q12h)
                        </p>
                      </div>
                    )}
                    {ivResult && (
                      <div className="rounded-2xl bg-white/60 p-3 border">
                        <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-0.5">IV / IM Dose</p>
                        <p className="text-2xl font-black">{ivResult.dose} mg/day</p>
                        <p className="text-xs opacity-70">{ivResult.label}</p>
                        <p className="text-xs opacity-60 mt-0.5">
                          = {+(ivResult.dose / 4).toFixed(1)} mg q6h IV
                        </p>
                      </div>
                    )}
                    <p className="text-xs font-bold mt-1">Duration: {level.duration}</p>
                  </div>
                ) : (
                  <p className="text-sm opacity-60 italic">Enter weight and height to calculate doses</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Emergency weight-based guide */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Emergency IM Dose by Weight (when BSA unknown)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-black">Weight</th>
                  <th className="text-center py-2 font-black">Emergency IM Dose</th>
                  <th className="text-left py-2 pl-4 font-black">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y text-muted-foreground">
                {[
                  ["< 10 kg", "25 mg IM/IV", "Hydrocortisone sodium succinate"],
                  ["10–25 kg", "50 mg IM/IV", "Repeat after 4–6 hours if needed"],
                  ["> 25 kg", "100 mg IM/IV", "Adult emergency dose"],
                ].map(([wt, dose, note]) => (
                  <tr key={wt}>
                    <td className="py-2 font-semibold text-foreground">{wt}</td>
                    <td className="text-center py-2 font-bold text-red-700">{dose}</td>
                    <td className="py-2 pl-4">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Alert className="rounded-2xl border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 text-sm">
          <strong>CAH Sick Day Rules:</strong> Parents of children with CAH should have written instructions and IM/rectal hydrocortisone at home. If vomiting — go to emergency immediately. Never stop hydrocortisone abruptly. Medical alert bracelet/card is mandatory.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference: ESPΕ/PES Guidelines on CAH 2022 · Bornstein SR et al. <em>J Clin Endocrinol Metab</em> 2016 · RCPCH Adrenal Insufficiency Guidelines
      </p>
    </div>
  );
}
