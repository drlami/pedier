import { useState, useMemo } from "react";
import { FlaskConical, Info, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// PCR = Protein (mg/dL) / Creatinine (mg/dL) ≈ g/day/1.73m² if roughly calibrated
// Or PCR in mg/mmol using SI units

function interpret(pcr: number, unitsSI: boolean) {
  // In mg/mg (same as g/g), normal < 0.2
  // In mg/mmol, normal < 20
  const normalThresh = unitsSI ? 20 : 0.2;
  const abnormalThresh = unitsSI ? 100 : 1.0;  // Subnephrotic upper limit
  const nephroticThresh = unitsSI ? 200 : 2.0;  // Nephrotic range lower limit

  if (pcr < normalThresh) return {
    label: "Normal",
    range: unitsSI ? "< 20 mg/mmol" : "< 0.2",
    color: "emerald",
    protein24h: null,
    meaning: "No significant proteinuria — tubular and glomerular protein handling intact.",
    action: [
      "No further proteinuria workup required if incidental finding",
      "Recheck in 3–6 months if at-risk patient (hypertension, diabetes, CKD)",
    ],
  };
  if (pcr < abnormalThresh) return {
    label: "Mild Proteinuria",
    range: unitsSI ? "20–100 mg/mmol" : "0.2–1.0",
    color: "amber",
    protein24h: unitsSI ? null : `~${(pcr * 1.2).toFixed(2)}–${(pcr * 1.6).toFixed(2)} g/day/1.73m² (estimate)`,
    meaning: "Mild persistent proteinuria — consider orthostatic (postural) proteinuria if spot AM normal.",
    action: [
      "Repeat early-morning (first-void) urine PCR — orthostatic proteinuria normal in am void",
      "If persistent: renal ultrasound, eGFR, blood pressure",
      "Nephrology referral if persistent or with haematuria/hypertension",
    ],
  };
  if (pcr < nephroticThresh) return {
    label: "Significant Proteinuria (Subnephrotic)",
    range: unitsSI ? "100–200 mg/mmol" : "1.0–2.0",
    color: "orange",
    protein24h: unitsSI ? null : `~${(pcr * 1.2).toFixed(2)}–${(pcr * 1.6).toFixed(2)} g/day/1.73m² (estimate)`,
    meaning: "Significant non-nephrotic proteinuria — consider IgA nephropathy, FSGS, lupus nephritis.",
    action: [
      "Nephrology referral",
      "Workup: ANA, ANCA, complement (C3/C4), anti-dsDNA, Ig levels, HBsAg",
      "Consider renal biopsy if persistent and significant",
    ],
  };
  return {
    label: "Nephrotic-Range Proteinuria",
    range: unitsSI ? "≥ 200 mg/mmol" : "≥ 2.0",
    color: "red",
    protein24h: unitsSI ? null : `≈ ≥ ${(pcr * 1.2).toFixed(1)} g/day/1.73m² (estimate)`,
    meaning: "Nephrotic-range proteinuria (≥ 40 mg/m²/hr equivalent) — assess for full nephrotic syndrome.",
    action: [
      "Assess for nephrotic syndrome: oedema, hypoalbuminaemia, hyperlipidaemia",
      "Urine albumin:creatinine ratio (ACR) if available",
      "Urgent nephrology referral",
      "Workup: albumin, cholesterol, CBP, complement, ANA, anti-dsDNA, renal ultrasound",
      "First episode in children 1–10 years: likely minimal change — empiric prednisolone per ISKDC protocol",
    ],
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

export default function UPCRPage() {
  const [protein, setProtein] = useState("");
  const [creatinine, setCreatinine] = useState("");
  const [useSI, setUseSI] = useState(false);

  const result = useMemo(() => {
    const p = parseFloat(protein), cr = parseFloat(creatinine);
    if (!p || !cr || p <= 0 || cr <= 0) return null;
    const pcr = p / cr;
    return { pcr, interp: interpret(pcr, useSI) };
  }, [protein, creatinine, useSI]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-cyan-100 text-cyan-700">
          <FlaskConical className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Urinary Protein:Creatinine Ratio</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Spot urine PCR — a validated surrogate for 24-hour urinary protein excretion.
          </p>
        </div>
      </div>

      {/* Units toggle */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Units</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {[
              { si: false, label: "Conventional (mg/mg)" },
              { si: true, label: "SI (mg/mmol)" },
            ].map(({ si, label }) => (
              <button
                key={String(si)}
                onClick={() => { setUseSI(si); setProtein(""); setCreatinine(""); }}
                className={cn(
                  "flex-1 py-3 rounded-2xl font-bold text-sm border-2 transition-all",
                  useSI === si
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-muted/30 text-muted-foreground border-transparent hover:border-primary/30"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inputs */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Urine Values (spot sample)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="font-bold text-sm">Urine Protein</Label>
            <div className="relative">
              <Input type="number" min={0} step={0.1} placeholder="—"
                value={protein} onChange={e => setProtein(e.target.value)}
                className={cn("h-11 rounded-xl font-semibold", useSI ? "pr-20" : "pr-16")} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                {useSI ? "mg/L" : "mg/dL"}
              </span>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="font-bold text-sm">Urine Creatinine</Label>
            <div className="relative">
              <Input type="number" min={0} step={0.1} placeholder="—"
                value={creatinine} onChange={e => setCreatinine(e.target.value)}
                className={cn("h-11 rounded-xl font-semibold", useSI ? "pr-20" : "pr-16")} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                {useSI ? "mmol/L" : "mg/dL"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <Card className={cn("rounded-3xl border-2", colorMap[result.interp.color])}>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Protein:Creatinine Ratio</p>
                <p className="text-4xl font-black">{result.pcr.toFixed(2)}</p>
                <p className="text-sm opacity-60 mt-0.5">
                  (Normal: {useSI ? "< 20 mg/mmol" : "< 0.2 mg/mg"})
                </p>
              </div>
              <Badge className={cn("font-black text-sm px-3 py-1", badgeMap[result.interp.color])}>
                {result.interp.label}
              </Badge>
            </div>
            <p className="text-sm opacity-80 mb-4">{result.interp.meaning}</p>
            <p className="font-black text-sm uppercase tracking-widest mb-2">Recommended Action</p>
            <div className="space-y-1.5">
              {result.interp.action.map((a, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="mt-0.5 shrink-0 opacity-50">•</span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reference */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            PCR Interpretation Thresholds
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-black">Category</th>
                  <th className="text-center py-2 font-black">mg/mg</th>
                  <th className="text-center py-2 font-black">mg/mmol</th>
                  <th className="text-left py-2 font-black pl-3">Clinical Significance</th>
                </tr>
              </thead>
              <tbody className="divide-y text-muted-foreground">
                {[
                  ["Normal", "< 0.2", "< 20", "No proteinuria"],
                  ["Mild", "0.2–1.0", "20–100", "Investigate; r/o orthostatic"],
                  ["Significant", "1.0–2.0", "100–200", "Nephrology referral needed"],
                  ["Nephrotic", "≥ 2.0", "≥ 200", "Full nephrotic workup"],
                ].map(([cat, mgmg, mgmmol, clin]) => (
                  <tr key={cat}>
                    <td className="py-2 font-semibold text-foreground">{cat}</td>
                    <td className="text-center py-2">{mgmg}</td>
                    <td className="text-center py-2">{mgmmol}</td>
                    <td className="py-2 pl-3">{clin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Alert className="rounded-2xl border-cyan-200 bg-cyan-50">
        <AlertTriangle className="h-4 w-4 text-cyan-600" />
        <AlertDescription className="text-cyan-800 text-sm">
          <strong>Important:</strong> Spot PCR accuracy is reduced with very dilute (SG &lt;1.010) or concentrated urine. Use first-morning void when possible. False elevations occur with febrile illness, exercise, and urinary tract infection — confirm with repeat after resolution.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference: KDIGO CKD Guideline 2012 · Hogg RJ et al. <em>Pediatrics</em> 2003;112:1242–52
      </p>
    </div>
  );
}
