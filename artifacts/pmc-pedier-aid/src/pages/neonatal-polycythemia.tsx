import { useState, useMemo } from "react";
import { Activity, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Formula: Exchange volume (mL) = Blood volume × (Hct_observed - Hct_desired) / Hct_observed
// Standard neonatal blood volume ≈ 80 mL/kg
// Exchange fluid: Normal saline or 5% albumin
// Target Hct: 50–55% (0.50–0.55)

const SYMPTOMS = [
  "Plethora / ruddy appearance",
  "Respiratory distress or grunting",
  "Jitteriness or seizures",
  "Poor feeding / lethargy",
  "Hypoglycaemia (complication)",
  "Cardiac overload / heart failure",
  "Priapism (males)",
  "Necrotising enterocolitis (risk)",
];

function classify(hct: number) {
  if (hct < 0.65) return { label: "Normal Haematocrit", color: "emerald", exchange: false, note: "Haematocrit below polycythaemia threshold. No exchange required." };
  if (hct < 0.70) return { label: "Polycythaemia — Symptomatic?", color: "amber", exchange: false, note: "Hct 65–70%: exchange only if symptomatic. Observe asymptomatic neonates." };
  return { label: "Polycythaemia — Exchange Recommended", color: "red", exchange: true, note: "Hct ≥70%: partial exchange transfusion recommended regardless of symptoms." };
}

export default function NeonatalPolycythemiaPage() {
  const [weight, setWeight] = useState("");
  const [hctPercent, setHctPercent] = useState("");
  const [targetHct, setTargetHct] = useState("50");
  const [bloodVolume, setBloodVolume] = useState("80");
  const [symptomatic, setSymptomatic] = useState<boolean | null>(null);

  const result = useMemo(() => {
    const wt = parseFloat(weight);
    const hct = parseFloat(hctPercent) / 100;
    const target = parseFloat(targetHct) / 100;
    const bvPerKg = parseFloat(bloodVolume);

    if (!wt || !hct || !target || !bvPerKg || wt <= 0 || hct <= 0 || target <= 0) return null;

    const totalBV = wt * bvPerKg;
    const exchangeVol = totalBV * ((hct - target) / hct);

    const classif = classify(hct);
    const shouldExchange = classif.exchange || (hct >= 0.65 && symptomatic === true);

    return {
      hct: hct * 100,
      exchangeVol: Math.round(exchangeVol),
      totalBV: Math.round(totalBV),
      classif,
      shouldExchange,
    };
  }, [weight, hctPercent, targetHct, bloodVolume, symptomatic]);

  const colorMap: Record<string, string> = {
    emerald: "text-emerald-700 border-emerald-200 bg-emerald-50",
    amber:   "text-amber-700 border-amber-200 bg-amber-50",
    red:     "text-red-700 border-red-200 bg-red-50",
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-blue-100 text-blue-700">
          <Activity className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Neonatal Polycythaemia Exchange</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Partial exchange transfusion volume for neonatal polycythaemia — dilutes haematocrit to target.
          </p>
        </div>
      </div>

      {/* Inputs */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Patient & Laboratory Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-bold text-sm">Birth / Current Weight</Label>
              <div className="relative">
                <Input type="number" min={0} step={0.1} placeholder="e.g. 3.4"
                  value={weight} onChange={e => setWeight(e.target.value)}
                  className="pr-10 h-11 rounded-xl font-semibold" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">kg</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="font-bold text-sm">Observed Haematocrit</Label>
              <p className="text-xs text-muted-foreground">Peripheral or central sample</p>
              <div className="relative">
                <Input type="number" min={0} max={100} step={1} placeholder="e.g. 72"
                  value={hctPercent} onChange={e => setHctPercent(e.target.value)}
                  className="pr-8 h-11 rounded-xl font-semibold" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">%</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="font-bold text-sm">Target Haematocrit</Label>
              <div className="relative">
                <Input type="number" min={40} max={70} step={1} placeholder="50"
                  value={targetHct} onChange={e => setTargetHct(e.target.value)}
                  className="pr-8 h-11 rounded-xl font-semibold" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">%</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="font-bold text-sm">Blood Volume</Label>
              <div className="relative">
                <Input type="number" min={60} max={100} step={5} placeholder="80"
                  value={bloodVolume} onChange={e => setBloodVolume(e.target.value)}
                  className="pr-16 h-11 rounded-xl font-semibold" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">mL/kg</span>
              </div>
            </div>
          </div>
          <div>
            <Label className="font-bold text-sm mb-2 block">Symptomatic?</Label>
            <div className="flex gap-3">
              {[
                { val: true, label: "Yes — symptomatic" },
                { val: false, label: "No — asymptomatic" },
              ].map(({ val, label }) => (
                <button
                  key={String(val)}
                  onClick={() => setSymptomatic(val)}
                  className={cn(
                    "flex-1 py-2.5 rounded-2xl font-bold text-sm border-2 transition-all",
                    symptomatic === val
                      ? "bg-primary text-white border-primary shadow-md"
                      : "bg-muted/30 text-muted-foreground border-transparent hover:border-primary/30"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <>
          <Card className={cn("rounded-3xl border-2", colorMap[result.classif.color])}>
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Haematocrit</p>
                  <p className="text-4xl font-black">{result.hct.toFixed(1)}<span className="text-xl font-semibold opacity-60">%</span></p>
                </div>
                <Badge className={cn("font-black text-sm px-3", result.classif.color === "emerald" ? "bg-emerald-100 text-emerald-800" : result.classif.color === "amber" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800")}>
                  {result.classif.label}
                </Badge>
              </div>
              <p className="text-sm opacity-80">{result.classif.note}</p>
            </CardContent>
          </Card>

          {result.shouldExchange && (
            <Card className="rounded-3xl border-2 border-blue-200 bg-blue-50">
              <CardContent className="pt-6 pb-6">
                <p className="text-xs font-black uppercase tracking-widest text-blue-600/70 mb-1">Exchange Volume</p>
                <div className="flex items-end gap-3 mb-4">
                  <p className="text-5xl font-black text-blue-800">{result.exchangeVol}</p>
                  <p className="text-xl font-semibold text-blue-500 mb-1">mL</p>
                </div>
                <div className="rounded-2xl bg-white/70 p-3 border border-blue-200 text-sm text-blue-800 space-y-1 mb-4">
                  <p className="font-bold">Formula:</p>
                  <p className="font-mono text-xs">
                    Vol = Total BV × (Hct_obs − Hct_target) / Hct_obs
                  </p>
                  <p className="font-mono text-xs text-blue-600/70">
                    = {result.totalBV} mL × ({result.hct.toFixed(1)}% − {targetHct}%) / {result.hct.toFixed(1)}%
                    = {result.exchangeVol} mL
                  </p>
                </div>
                <p className="font-black text-sm uppercase tracking-widest mb-3">Procedure</p>
                <div className="space-y-1.5 text-sm">
                  {[
                    "Exchange fluid: 0.9% Normal Saline (preferred) or 5% human albumin",
                    "Perform via umbilical venous catheter or peripheral IV + venous access",
                    "Withdraw blood in 5–10 mL aliquots, replace with equal volume of NS",
                    "Alternate withdraw and infuse over 30–60 minutes",
                    "Monitor glucose, electrolytes, BP, and temperature throughout",
                    "Repeat haematocrit 2–4 hours post-exchange",
                  ].map((s, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="mt-0.5 opacity-50 shrink-0">•</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Symptoms reference */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Symptoms of Neonatal Polycythaemia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {SYMPTOMS.map(s => (
              <div key={s} className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-0.5 shrink-0">•</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Polycythaemia: venous Hct ≥ 65% (or capillary Hct ≥ 65% — but confirm with central/venous sample). Central sample preferred; capillary values may be falsely elevated.
          </p>
        </CardContent>
      </Card>

      <Alert className="rounded-2xl border-blue-200 bg-blue-50">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 text-sm">
          <strong>Confirm with central sample.</strong> Capillary Hct from heel-prick can be 5–10% higher than venous. Always confirm with a central or venous haematocrit before initiating exchange. Risk of exchange includes NEC — do not perform in asymptomatic neonates with Hct &lt;70%.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference: Ozek E et al. (Cochrane 2010) · AAP Committee on Fetus and Newborn Statement · Polin RA et al. <em>Neonatology</em> 6th ed.
      </p>
    </div>
  );
}
