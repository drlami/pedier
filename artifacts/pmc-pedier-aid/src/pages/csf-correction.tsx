import { useState, useMemo } from "react";
import { FlaskConical, ArrowLeft, Calculator, Info, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function CSFCorrectionPage() {
  const [csfWbc, setCsfWbc] = useState("");
  const [csfRbc, setCsfRbc] = useState("");
  const [csfProtein, setCsfProtein] = useState("");
  const [periphWbc, setPeriphWbc] = useState("");
  const [periphRbc, setPeriphRbc] = useState("");

  const csfWbcNum = parseFloat(csfWbc);
  const csfRbcNum = parseFloat(csfRbc);
  const csfProteinNum = parseFloat(csfProtein);
  const periphWbcNum = parseFloat(periphWbc);
  const periphRbcNum = parseFloat(periphRbc);

  const hasCsfRbc = isFinite(csfRbcNum) && csfRbcNum >= 0;
  const hasCsfWbc = isFinite(csfWbcNum) && csfWbcNum >= 0;
  const hasCsfProtein = isFinite(csfProteinNum) && csfProteinNum >= 0;
  const hasPeripheral = isFinite(periphWbcNum) && periphWbcNum >= 0 && isFinite(periphRbcNum) && periphRbcNum > 0;

  const wbcResult = useMemo(() => {
    if (!hasCsfWbc || !hasCsfRbc || !hasPeripheral) return null;
    const periphRbcPerUl = periphRbcNum * 1_000_000;
    const predictedWbc = (periphWbcNum * csfRbcNum) / periphRbcPerUl;
    const corrected = Math.max(0, csfWbcNum - predictedWbc);
    return { predictedWbc, corrected };
  }, [hasCsfWbc, hasCsfRbc, hasPeripheral, csfWbcNum, csfRbcNum, periphWbcNum, periphRbcNum]);

  const proteinResult = useMemo(() => {
    if (!hasCsfProtein || !hasCsfRbc) return null;
    const deduction = csfRbcNum / 1000;
    const corrected = Math.max(0, csfProteinNum - deduction);
    return { deduction, corrected };
  }, [hasCsfProtein, hasCsfRbc, csfProteinNum, csfRbcNum]);

  const wbcElevated = wbcResult ? wbcResult.corrected > 5 : null;
  const proteinElevated = proteinResult ? proteinResult.corrected > 45 : null;

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 pb-32">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary active:scale-95">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-100">
          <FlaskConical className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tight">CSF Traumatic Tap Correction</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest mt-1">
            Corrected CSF WBC · Corrected CSF Protein
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Inputs + Formulae */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="border-2 shadow-sm">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <FlaskConical className="h-4 w-4" /> CSF Values
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  CSF RBC <span className="opacity-50 font-normal normal-case">(cells/µL)</span>
                </Label>
                <Input type="number" inputMode="decimal" placeholder="e.g. 10000"
                  className="font-mono h-11 border-2 focus:border-indigo-500"
                  value={csfRbc} onChange={(e) => setCsfRbc(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  CSF WBC (observed) <span className="opacity-50 font-normal normal-case">(cells/µL)</span>
                </Label>
                <Input type="number" inputMode="decimal" placeholder="e.g. 15"
                  className="font-mono h-11 border-2 focus:border-indigo-500"
                  value={csfWbc} onChange={(e) => setCsfWbc(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  CSF Protein (observed) <span className="opacity-50 font-normal normal-case">(mg/dL)</span>
                </Label>
                <Input type="number" inputMode="decimal" placeholder="e.g. 55"
                  className="font-mono h-11 border-2 focus:border-indigo-500"
                  value={csfProtein} onChange={(e) => setCsfProtein(e.target.value)} />
              </div>

              <Separator />

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-indigo-700 tracking-widest">
                  Peripheral Blood WBC <span className="font-normal normal-case text-muted-foreground opacity-60">(cells/µL) — for WBC correction</span>
                </Label>
                <Input type="number" inputMode="decimal" placeholder="e.g. 9000"
                  className="font-mono h-10 border border-dashed border-indigo-300 bg-indigo-50/10 focus:border-indigo-500"
                  value={periphWbc} onChange={(e) => setPeriphWbc(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-indigo-700 tracking-widest">
                  Peripheral Blood RBC <span className="font-normal normal-case text-muted-foreground opacity-60">(×10⁶/µL) — for WBC correction</span>
                </Label>
                <Input type="number" inputMode="decimal" placeholder="e.g. 4.5"
                  className="font-mono h-10 border border-dashed border-indigo-300 bg-indigo-50/10 focus:border-indigo-500"
                  value={periphRbc} onChange={(e) => setPeriphRbc(e.target.value)} />
                <p className="text-[9px] text-muted-foreground font-medium leading-snug">
                  Peripheral CBC is required to correct the WBC count accurately — a patient who is anaemic or has an abnormal peripheral WBC will make the crude "1 per 500–1000 RBC" rule of thumb inaccurate.
                </p>
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
                  <span className="text-foreground font-black">Corrected CSF WBC</span>
                  <p className="mt-0.5">= Observed CSF WBC − (Peripheral WBC × CSF RBC ÷ Peripheral RBC)</p>
                </div>
                <div>
                  <span className="text-foreground font-black">Corrected CSF Protein</span>
                  <p className="mt-0.5">= Observed CSF Protein − (CSF RBC ÷ 1000)</p>
                </div>
              </div>
              <Separator />
              <p className="text-[10px] text-muted-foreground font-medium">
                Assumes peripheral blood counts and protein are otherwise normal. Neonatal CSF reference ranges are higher than older children — interpret corrected values in that context.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-7 space-y-5">
          {wbcResult ? (
            <Card className={cn("border-2", wbcElevated ? "bg-amber-50 border-amber-300" : "bg-emerald-50 border-emerald-300")}>
              <CardContent className="pt-6 pb-5 px-6">
                <Badge className={cn("mb-3 text-xs font-black px-3 py-1", wbcElevated ? "bg-amber-500" : "bg-emerald-600")}>
                  {wbcElevated ? "Pleocytosis Persists After Correction" : "Not Elevated After Correction"}
                </Badge>
                <div className="flex items-end gap-4 mb-2">
                  <p className="text-5xl font-black font-mono tracking-tighter leading-none">
                    {wbcResult.corrected.toFixed(1)}
                  </p>
                  <p className="text-sm font-bold text-muted-foreground mb-1">cells/µL</p>
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Corrected CSF WBC</p>
                <div className="p-3 rounded-xl bg-background/60 border font-mono text-[11px] font-bold text-center">
                  <p>{csfWbcNum} − ({periphWbcNum} × {csfRbcNum} ÷ {(periphRbcNum * 1_000_000).toLocaleString()}) = {wbcResult.corrected.toFixed(1)}</p>
                  <p className="text-muted-foreground mt-1">Predicted blood-derived WBC: {wbcResult.predictedWbc.toFixed(1)}/µL</p>
                </div>
                {wbcElevated && (
                  <p className="mt-3 text-xs font-black text-amber-800 bg-amber-100/60 border border-amber-200 rounded-xl px-3 py-2 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    Elevated CSF WBC beyond what blood contamination explains — true CSF pleocytosis. Use the Bacterial Meningitis Score calculator for further risk stratification.
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl text-center bg-muted/20">
              <Calculator className="h-8 w-8 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm font-medium">Enter CSF WBC, CSF RBC, and peripheral CBC to correct WBC</p>
            </div>
          )}

          {proteinResult ? (
            <Card className={cn("border-2", proteinElevated ? "bg-amber-50 border-amber-300" : "bg-emerald-50 border-emerald-300")}>
              <CardContent className="pt-6 pb-5 px-6">
                <Badge className={cn("mb-3 text-xs font-black px-3 py-1", proteinElevated ? "bg-amber-500" : "bg-emerald-600")}>
                  {proteinElevated ? "Elevated After Correction" : "Not Elevated After Correction"}
                </Badge>
                <div className="flex items-end gap-4 mb-2">
                  <p className="text-5xl font-black font-mono tracking-tighter leading-none">
                    {proteinResult.corrected.toFixed(1)}
                  </p>
                  <p className="text-sm font-bold text-muted-foreground mb-1">mg/dL</p>
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
                  Corrected CSF Protein <span className="opacity-60 normal-case font-medium">(normal ~15–45 mg/dL beyond infancy)</span>
                </p>
                <div className="p-3 rounded-xl bg-background/60 border font-mono text-[11px] font-bold text-center">
                  <p>{csfProteinNum} − ({csfRbcNum} ÷ 1000) = {proteinResult.corrected.toFixed(1)}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl text-center bg-muted/20">
              <Calculator className="h-8 w-8 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm font-medium">Enter CSF protein and CSF RBC to correct protein</p>
            </div>
          )}

          <p className="text-[10px] text-muted-foreground font-medium text-center pb-2">
            Reference: Harriet Lane Handbook — CSF interpretation and traumatic tap correction.
          </p>
        </div>
      </div>
    </div>
  );
}
