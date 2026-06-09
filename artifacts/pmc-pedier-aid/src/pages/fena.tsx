import { useState, useMemo } from "react";
import { Droplets, Info, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function interpretFENa(fena: number) {
  if (fena < 1) return { label: "Prerenal", color: "emerald", detail: "Tubular reabsorption intact — avid sodium retention suggests hypovolaemia, cardiogenic, or hepatorenal aetiology." };
  if (fena <= 2) return { label: "Indeterminate", color: "amber", detail: "Borderline range — may occur with early ATN, contrast nephropathy, myoglobinuria, or partial obstruction." };
  return { label: "Intrinsic Renal / Post-renal", color: "red", detail: "Impaired tubular reabsorption — consistent with established ATN, interstitial nephritis, or outflow obstruction." };
}

function interpretFEUrea(feurea: number) {
  if (feurea < 35) return { label: "Prerenal", color: "emerald", detail: "Preferred in diuretic use — urea reabsorption remains elevated despite natriuresis." };
  if (feurea <= 50) return { label: "Indeterminate", color: "amber", detail: "Borderline — clinical correlation required." };
  return { label: "Intrinsic Renal", color: "red", detail: "Consistent with intrinsic AKI — tubular handling of urea impaired." };
}

const colorMap: Record<string, string> = {
  emerald: "text-emerald-700 border-emerald-200 bg-emerald-50",
  amber: "text-amber-700 border-amber-200 bg-amber-50",
  red: "text-red-700 border-red-200 bg-red-50",
};

const badgeMap: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-800",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-800",
};

function NumInput({ label, unit, value, onChange, hint }: {
  label: string; unit: string; value: string;
  onChange: (v: string) => void; hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-bold">{label}</Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <div className="relative">
        <Input
          type="number"
          min={0}
          placeholder="—"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="pr-16 rounded-xl h-11 font-semibold"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}

export default function FENaPage() {
  const [uNa, setUNa] = useState(""); // Urine Na mmol/L
  const [sNa, setSNa] = useState(""); // Serum Na mmol/L
  const [sCr, setSCr] = useState(""); // Serum Cr mg/dL
  const [uCr, setUCr] = useState(""); // Urine Cr mg/dL
  const [uUrea, setUUrea] = useState(""); // Urine urea mmol/L
  const [sUrea, setSUrea] = useState(""); // Serum urea mmol/L

  const results = useMemo(() => {
    const una = parseFloat(uNa), sna = parseFloat(sNa);
    const scr = parseFloat(sCr), ucr = parseFloat(uCr);
    const uurea = parseFloat(uUrea), surea = parseFloat(sUrea);

    const hasFENa = una > 0 && sna > 0 && scr > 0 && ucr > 0;
    const hasFEUrea = uurea > 0 && surea > 0 && scr > 0 && ucr > 0;

    const fena = hasFENa ? (una * scr) / (sna * ucr) * 100 : null;
    const feurea = hasFEUrea ? (uurea * scr) / (surea * ucr) * 100 : null;

    return { fena, feurea };
  }, [uNa, sNa, sCr, uCr, uUrea, sUrea]);

  const fenaInterp = results.fena !== null ? interpretFENa(results.fena) : null;
  const feureaInterp = results.feurea !== null ? interpretFEUrea(results.feurea) : null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-cyan-100 text-cyan-700">
          <Droplets className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">FENa & FEUrea Calculator</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Fractional excretion of sodium and urea — distinguish prerenal from intrinsic acute kidney injury.
          </p>
        </div>
      </div>

      {/* Inputs */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Laboratory Values</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <NumInput label="Serum Sodium" unit="mmol/L" value={sNa} onChange={setSNa} />
            <NumInput label="Urine Sodium" unit="mmol/L" value={uNa} onChange={setUNa} />
            <NumInput label="Serum Creatinine" unit="mg/dL" value={sCr} onChange={setSCr} />
            <NumInput label="Urine Creatinine" unit="mg/dL" value={uCr} onChange={setUCr} />
          </div>

          <Separator />

          <div>
            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">
              FEUrea Inputs <span className="font-normal normal-case">(optional — preferred in diuretic use)</span>
            </p>
            <div className="grid grid-cols-2 gap-4">
              <NumInput label="Serum Urea" unit="mmol/L" value={sUrea} onChange={setSUrea} />
              <NumInput label="Urine Urea" unit="mmol/L" value={uUrea} onChange={setUUrea} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FENa Result */}
      {fenaInterp && results.fena !== null && (
        <Card className={cn("rounded-3xl border-2", colorMap[fenaInterp.color])}>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">FENa</p>
                <p className="text-4xl font-black">{results.fena.toFixed(2)}<span className="text-xl font-semibold opacity-60">%</span></p>
                <p className="text-xs mt-1 opacity-70">Formula: (U<sub>Na</sub> × S<sub>Cr</sub>) / (S<sub>Na</sub> × U<sub>Cr</sub>) × 100</p>
              </div>
              <div className="text-right">
                <Badge className={cn("text-sm px-3 py-1 font-black", badgeMap[fenaInterp.color])}>
                  {fenaInterp.label}
                </Badge>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed opacity-80">{fenaInterp.detail}</p>
          </CardContent>
        </Card>
      )}

      {/* FEUrea Result */}
      {feureaInterp && results.feurea !== null && (
        <Card className={cn("rounded-3xl border-2", colorMap[feureaInterp.color])}>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">FEUrea</p>
                <p className="text-4xl font-black">{results.feurea.toFixed(2)}<span className="text-xl font-semibold opacity-60">%</span></p>
                <p className="text-xs mt-1 opacity-70">Formula: (U<sub>Urea</sub> × S<sub>Cr</sub>) / (S<sub>Urea</sub> × U<sub>Cr</sub>) × 100</p>
              </div>
              <div className="text-right">
                <Badge className={cn("text-sm px-3 py-1 font-black", badgeMap[feureaInterp.color])}>
                  {feureaInterp.label}
                </Badge>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed opacity-80">{feureaInterp.detail}</p>
          </CardContent>
        </Card>
      )}

      {/* Reference table */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Interpretation Thresholds
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-black py-2 pr-4">Index</th>
                  <th className="text-center font-black py-2 px-3">Prerenal</th>
                  <th className="text-center font-black py-2 px-3">Indeterminate</th>
                  <th className="text-center font-black py-2 px-3">Intrinsic</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2 pr-4 font-semibold">FENa</td>
                  <td className="text-center py-2 px-3 text-emerald-700 font-bold">&lt;1%</td>
                  <td className="text-center py-2 px-3 text-amber-700 font-bold">1–2%</td>
                  <td className="text-center py-2 px-3 text-red-700 font-bold">&gt;2%</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold">FEUrea</td>
                  <td className="text-center py-2 px-3 text-emerald-700 font-bold">&lt;35%</td>
                  <td className="text-center py-2 px-3 text-amber-700 font-bold">35–50%</td>
                  <td className="text-center py-2 px-3 text-red-700 font-bold">&gt;50%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Alert className="rounded-2xl border-cyan-200 bg-cyan-50">
        <AlertTriangle className="h-4 w-4 text-cyan-600" />
        <AlertDescription className="text-cyan-800 text-sm">
          <strong>Limitations:</strong> FENa is unreliable in patients receiving diuretics — use FEUrea instead. Both indices may be misleading in hepatorenal syndrome, contrast nephropathy, rhabdomyolysis, and early obstruction. Always interpret in clinical context.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference: Espinel CH. <em>JAMA</em> 1976;236:579–81 · Carvounis CP et al. <em>Am J Kidney Dis</em> 2002;39:308–15
      </p>
    </div>
  );
}
