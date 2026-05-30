import { useState, useMemo } from "react";
import { 
  Activity, Calculator, Info, 
  ArrowLeft, CheckCircle2, AlertTriangle, FlaskConical, Droplets
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function AnionGapCalc() {
  const [na, setNa] = useState<string>("");
  const [cl, setCl] = useState<string>("");
  const [hco3, setHco3] = useState<string>("");
  const [albumin, setAlbumin] = useState<string>("");

  const naNum = parseFloat(na);
  const clNum = parseFloat(cl);
  const hco3Num = parseFloat(hco3);
  const albNum = parseFloat(albumin);

  const isValid = !isNaN(naNum) && !isNaN(clNum) && !isNaN(hco3Num);

  const result = useMemo(() => {
    if (!isValid) return null;
    const gap = naNum - (clNum + hco3Num);
    
    // Adjusted Anion Gap for Albumin
    // Rule: For every 1 g/dL decrease in albumin below 4 g/dL, AG decreases by 2.5
    let adjustedGap = gap;
    if (!isNaN(albNum) && albNum > 0) {
        adjustedGap = gap + 2.5 * (4 - albNum);
    }

    return { gap, adjustedGap };
  }, [naNum, clNum, hco3Num, albNum, isValid]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary active:scale-95">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Anion Gap</h1>
          <p className="text-muted-foreground text-sm">Serum Anion Gap with Albumin Adjustment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Electrolyte Panel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Sodium (Na+)</Label>
              <Input type="number" inputMode="decimal" placeholder="e.g. 140" className="font-mono h-11" value={na} onChange={(e) => setNa(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Chloride (Cl-)</Label>
              <Input type="number" inputMode="decimal" placeholder="e.g. 104" className="font-mono h-11" value={cl} onChange={(e) => setCl(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Bicarbonate (HCO3-)</Label>
              <Input type="number" inputMode="decimal" placeholder="e.g. 24" className="font-mono h-11" value={hco3} onChange={(e) => setHco3(e.target.value)} />
            </div>
            <div className="pt-4 space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Albumin (g/dL) <span className="text-[10px] lowercase font-normal italic">(Optional)</span></Label>
              <Input type="number" inputMode="decimal" placeholder="e.g. 4.0" className="font-mono h-11 border-dashed" value={albumin} onChange={(e) => setAlbumin(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {isValid && result ? (
            <>
              <Card className={cn("border-2 transition-all", result.adjustedGap > 12 ? "border-amber-200 bg-amber-50/30" : "border-green-200 bg-green-50/30")}>
                <CardHeader className="pb-2">
                  <Badge className={cn("w-fit mb-2", result.adjustedGap > 12 ? "bg-amber-600" : "bg-green-600")}>
                    {result.adjustedGap > 12 ? "Elevated Anion Gap" : "Normal Anion Gap"}
                  </Badge>
                  <CardTitle className="text-6xl font-black font-mono tracking-tighter">
                    {result.adjustedGap.toFixed(1)}
                  </CardTitle>
                  <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Adjusted Anion Gap</p>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="p-3 rounded-lg bg-background/50 border border-muted flex justify-between items-center text-xs">
                        <span className="text-muted-foreground font-medium">Unadjusted AG</span>
                        <span className="font-mono font-bold">{result.gap.toFixed(1)}</span>
                    </div>
                </CardContent>
              </Card>

              {result.adjustedGap > 12 && (
                  <Alert variant="default" className="bg-amber-100/50 border-amber-200">
                      <AlertTriangle className="h-4 w-4 text-amber-700" />
                      <AlertDescription className="text-xs font-medium text-amber-900 leading-relaxed">
                          <strong>MUDPILES / GOLD MARK:</strong> An elevated gap suggests an organic acid gain (Lactate, Ketones, Toxins, Renal Failure).
                      </AlertDescription>
                  </Alert>
              )}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-12 text-center bg-muted/20">
              <Calculator className="h-10 w-10 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-sm">Enter electrolytes to calculate the anion gap.</p>
            </div>
          )}

          <Card className="bg-muted/30">
            <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3 text-primary font-bold text-[10px] uppercase">
                  <Info className="h-3.5 w-3.5" /> Clinical Reference
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                    Normal Anion Gap is typically <strong>8 - 12 mEq/L</strong>. 
                    Hypoalbuminemia can mask an elevated anion gap. The formula used here adds 2.5 to the AG for every 1 g/dL drop in albumin below 4.0 g/dL.
                </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
