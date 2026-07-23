import { useMemo, useState } from "react";
import { Microscope, ArrowLeft, Calculator, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const CUTOFF = 13;
const MICROCYTIC_MCV = 80; // fL — adult/older-child microcytic threshold; see age note below

function mentzerInterpret(index: number) {
  if (index < CUTOFF) {
    return {
      label: "< 13 — Thalassaemia Trait More Likely",
      color: "text-blue-700", bg: "bg-blue-50 border-blue-300", badge: "bg-blue-600",
      meaning: "RBC count is preserved relative to cell size (defect in globin synthesis, not RBC production). Confirm with haemoglobin electrophoresis / HPLC ± iron studies before counselling as thalassaemia trait.",
    };
  }
  return {
    label: "> 13 — Iron Deficiency Anaemia More Likely",
    color: "text-orange-700", bg: "bg-orange-50 border-orange-300", badge: "bg-orange-600",
    meaning: "RBC count is reduced alongside cell size (impaired production). Confirm with serum ferritin ± iron studies before starting iron therapy.",
  };
}

export default function MentzerIndexPage() {
  const [mcv, setMcv] = useState("");
  const [rbc, setRbc] = useState("");

  const mcvNum = parseFloat(mcv);
  const rbcNum = parseFloat(rbc);

  const hasMcv = isFinite(mcvNum) && mcvNum > 0;
  const hasRbc = isFinite(rbcNum) && rbcNum > 0;
  const isValid = hasMcv && hasRbc;

  const result = useMemo(() => {
    if (!isValid) return null;
    const index = mcvNum / rbcNum;
    return { index };
  }, [isValid, mcvNum, rbcNum]);

  const interp = result ? mentzerInterpret(result.index) : null;
  const notMicrocytic = hasMcv && mcvNum >= MICROCYTIC_MCV;

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 pb-32">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary active:scale-95">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 rounded-3xl bg-rose-600 text-white shadow-xl shadow-rose-100">
          <Microscope className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tight">Mentzer Index</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest mt-1">
            Microcytic Anaemia Screen — Thalassaemia Trait vs Iron Deficiency
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Inputs + Formula */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="border-2 shadow-sm">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Microscope className="h-4 w-4" /> CBC Values
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  MCV <span className="opacity-50 font-normal normal-case">(fL)</span>
                </Label>
                <Input type="number" inputMode="decimal" placeholder="e.g. 65"
                  className={cn("font-mono h-11 border-2 focus:border-rose-500", notMicrocytic && "border-yellow-400")}
                  value={mcv} onChange={(e) => setMcv(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  RBC Count <span className="opacity-50 font-normal normal-case">(×10⁶/µL)</span>
                </Label>
                <Input type="number" inputMode="decimal" placeholder="e.g. 5.2"
                  className="font-mono h-11 border-2 focus:border-rose-500"
                  value={rbc} onChange={(e) => setRbc(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border">
            <CardContent className="pt-5 pb-5 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" /> Formula & Limitations
              </p>
              <div className="space-y-2.5 text-[11px] font-mono text-muted-foreground">
                <div>
                  <span className="text-foreground font-black">Mentzer Index</span>
                  <p className="mt-0.5">= MCV (fL) ÷ RBC count (×10⁶/µL)</p>
                </div>
              </div>
              <Separator />
              <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                Screening aid only for confirmed <strong>microcytic, hypochromic anaemia</strong> — applying it outside that context (normal MCV, non-anaemic patient) reduces accuracy. Sensitivity/specificity are moderate, not diagnostic: always confirm with serum ferritin (iron deficiency) or Hb electrophoresis/HPLC (thalassaemia trait) before acting on the result. Normal MCV is age-dependent in children (roughly 70 + age in years up to the adult range by ~10 yrs) — a value read as "microcytic" for an adult may be normal for an infant.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right: Result */}
        <div className="lg:col-span-7 space-y-5">
          {result && interp ? (
            <Card className={cn("border-2", interp.bg)}>
              <CardContent className="pt-6 pb-5 px-6">
                <Badge className={cn("mb-3 text-xs font-black px-3 py-1", interp.badge)}>{interp.label}</Badge>
                <div className="flex items-end gap-4 mb-2">
                  <p className="text-5xl font-black font-mono tracking-tighter leading-none">
                    {result.index.toFixed(1)}
                  </p>
                  <p className="text-sm font-bold text-muted-foreground mb-1">Mentzer Index</p>
                </div>
                <p className={cn("text-xs font-bold leading-snug mt-3", interp.color)}>{interp.meaning}</p>
                {notMicrocytic && (
                  <p className="text-xs font-bold leading-snug mt-3 text-yellow-700">
                    MCV entered ({mcvNum} fL) is not clearly microcytic — the Mentzer index was validated for microcytic anaemia and is unreliable here. Re-check the indication for this test.
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl text-center bg-muted/20">
              <Calculator className="h-8 w-8 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm font-medium">Enter MCV and RBC count to calculate</p>
            </div>
          )}

          <p className="text-[10px] text-muted-foreground font-medium text-center pb-2">
            Reference: Mentzer WC. Differentiation of iron deficiency from thalassaemia trait. Lancet 1973;1(7808):882. Cutoff of 13 per subsequent validation studies.
          </p>
        </div>
      </div>
    </div>
  );
}
