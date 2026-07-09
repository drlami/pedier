import { useState, useMemo } from "react";
import { Droplets, ArrowLeft, Calculator, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const REFERENCE_HCT = 45;

function maturationFactor(hct: number) {
  if (hct >= 40) return 1.0;
  if (hct >= 35) return 1.5;
  if (hct >= 25) return 2.0;
  return 2.5;
}

function arcInterpret(arc: number) {
  if (arc < 25000) return { label: "Low — Hypoproliferative", color: "text-red-700", bg: "bg-red-50 border-red-300", badge: "bg-red-600" };
  if (arc <= 75000) return { label: "Normal", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-300", badge: "bg-emerald-600" };
  return { label: "Elevated — Marrow Response", color: "text-blue-700", bg: "bg-blue-50 border-blue-300", badge: "bg-blue-600" };
}

function rpiInterpret(rpi: number) {
  if (rpi < 2) return {
    label: "< 2 — Inadequate Marrow Response",
    color: "text-red-700", bg: "bg-red-50 border-red-300", badge: "bg-red-600",
    meaning: "The marrow is not compensating appropriately for the anemia. Suggests a hypoproliferative process — iron/B12/folate deficiency (early), aplastic anemia, marrow infiltration, chronic disease, or renal failure.",
  };
  return {
    label: "≥ 2 — Adequate Marrow Response",
    color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-300", badge: "bg-emerald-600",
    meaning: "The marrow is responding appropriately to anemia. Suggests active blood loss or haemolysis — check for bleeding, haptoglobin, LDH, bilirubin, direct Coombs test.",
  };
}

export default function ReticulocyteCalculatorPage() {
  const [reticPct, setReticPct] = useState("");
  const [rbc, setRbc] = useState("");
  const [hct, setHct] = useState("");

  const reticNum = parseFloat(reticPct);
  const rbcNum = parseFloat(rbc);
  const hctNum = parseFloat(hct);

  const hasRetic = isFinite(reticNum) && reticNum >= 0;
  const hasRbc = isFinite(rbcNum) && rbcNum > 0;
  const hasHct = isFinite(hctNum) && hctNum > 0;

  const arcResult = useMemo(() => {
    if (!hasRetic || !hasRbc) return null;
    const arc = (reticNum / 100) * (rbcNum * 1_000_000);
    return { arc };
  }, [hasRetic, hasRbc, reticNum, rbcNum]);

  const rpiResult = useMemo(() => {
    if (!hasRetic || !hasHct) return null;
    const correctedRetic = reticNum * (hctNum / REFERENCE_HCT);
    const factor = maturationFactor(hctNum);
    const rpi = correctedRetic / factor;
    return { correctedRetic, factor, rpi };
  }, [hasRetic, hasHct, reticNum, hctNum]);

  const arcInterp = arcResult ? arcInterpret(arcResult.arc) : null;
  const rpiInterp = rpiResult ? rpiInterpret(rpiResult.rpi) : null;

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 pb-32">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary active:scale-95">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 rounded-3xl bg-rose-600 text-white shadow-xl shadow-rose-100">
          <Droplets className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tight">Reticulocyte Calculator</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest mt-1">
            Absolute Retic Count · Corrected Retic % · Reticulocyte Production Index
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Inputs + Formulae */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="border-2 shadow-sm">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Droplets className="h-4 w-4" /> CBC Values
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Reticulocyte Count <span className="opacity-50 font-normal normal-case">(%)</span>
                </Label>
                <Input type="number" inputMode="decimal" placeholder="e.g. 4.5"
                  className="font-mono h-11 border-2 focus:border-rose-500"
                  value={reticPct} onChange={(e) => setReticPct(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  RBC Count <span className="opacity-50 font-normal normal-case">(×10⁶/µL) — for absolute count</span>
                </Label>
                <Input type="number" inputMode="decimal" placeholder="e.g. 3.2"
                  className="font-mono h-11 border-2 focus:border-rose-500"
                  value={rbc} onChange={(e) => setRbc(e.target.value)} />
              </div>

              <Separator />

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-rose-700 tracking-widest">
                  Patient Haematocrit <span className="font-normal normal-case text-muted-foreground opacity-60">(%) — for corrected count / RPI</span>
                </Label>
                <Input type="number" inputMode="decimal" placeholder="e.g. 22"
                  className="font-mono h-11 border-2 border-dashed border-rose-300 bg-rose-50/10 focus:border-rose-500"
                  value={hct} onChange={(e) => setHct(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border">
            <CardContent className="pt-5 pb-5 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" /> Formulae Used
              </p>
              <div className="space-y-2.5 text-[11px] font-mono text-muted-foreground">
                <div>
                  <span className="text-foreground font-black">Absolute Retic Count</span>
                  <p className="mt-0.5">= (Retic % ÷ 100) × RBC count</p>
                </div>
                <div>
                  <span className="text-foreground font-black">Corrected Retic %</span>
                  <p className="mt-0.5">= Retic % × (Patient Hct ÷ 45)</p>
                </div>
                <div>
                  <span className="text-foreground font-black">Reticulocyte Production Index (RPI)</span>
                  <p className="mt-0.5">= Corrected Retic % ÷ Maturation Factor</p>
                </div>
              </div>
              <Separator />
              <p className="text-[10px] text-muted-foreground font-medium">
                Maturation factor (Hillman): <strong>1.0</strong> at Hct ≥ 40, <strong>1.5</strong> at 35–39, <strong>2.0</strong> at 25–34, <strong>2.5</strong> below 25. The correction to a reference Hct of 45 is a fixed clinical convention used regardless of patient age.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-7 space-y-5">
          {arcResult && arcInterp ? (
            <Card className={cn("border-2", arcInterp.bg)}>
              <CardContent className="pt-6 pb-5 px-6">
                <Badge className={cn("mb-3 text-xs font-black px-3 py-1", arcInterp.badge)}>{arcInterp.label}</Badge>
                <div className="flex items-end gap-4 mb-2">
                  <p className="text-5xl font-black font-mono tracking-tighter leading-none">
                    {arcResult.arc.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-sm font-bold text-muted-foreground mb-1">cells/µL</p>
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Absolute Reticulocyte Count <span className="opacity-60 normal-case font-medium">(normal 25,000–75,000/µL)</span>
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl text-center bg-muted/20">
              <Calculator className="h-8 w-8 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm font-medium">Enter retic % and RBC count for absolute count</p>
            </div>
          )}

          {rpiResult && rpiInterp ? (
            <Card className={cn("border-2", rpiInterp.bg)}>
              <CardContent className="pt-6 pb-5 px-6">
                <Badge className={cn("mb-3 text-xs font-black px-3 py-1", rpiInterp.badge)}>{rpiInterp.label}</Badge>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-3xl font-black font-mono tracking-tighter leading-none">{rpiResult.correctedRetic.toFixed(2)}%</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Corrected Retic %</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black font-mono tracking-tighter leading-none">{rpiResult.rpi.toFixed(2)}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
                      RPI <span className="opacity-60 normal-case font-medium">(÷ {rpiResult.factor.toFixed(1)})</span>
                    </p>
                  </div>
                </div>
                <p className={cn("text-xs font-bold leading-snug", rpiInterp.color)}>{rpiInterp.meaning}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl text-center bg-muted/20">
              <Calculator className="h-8 w-8 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm font-medium">Enter retic % and patient Hct for corrected count / RPI</p>
            </div>
          )}

          <p className="text-[10px] text-muted-foreground font-medium text-center pb-2">
            Reference: Hillman RS, Finch CA. Red Cell Manual. — Harriet Lane Handbook, Haematology chapter.
          </p>
        </div>
      </div>
    </div>
  );
}
