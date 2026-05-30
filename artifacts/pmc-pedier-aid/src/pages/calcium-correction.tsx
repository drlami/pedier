import { useState, useMemo } from "react";
import { 
  FlaskConical, Calculator, Info, 
  ArrowLeft, CheckCircle2, AlertTriangle, Scale 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { calculateCorrectedCalcium } from "@/lib/calculators/formulas";
import { cn } from "@/lib/utils";

export default function CalciumCorrectionCalc() {
  const [calcium, setCalcium] = useState<string>("");
  const [albumin, setAlbumin] = useState<string>("");

  const caNum = parseFloat(calcium);
  const albNum = parseFloat(albumin);
  const isValid = !isNaN(caNum) && caNum > 0 && !isNaN(albNum) && albNum > 0;

  const correctedCa = useMemo(() => {
    if (!isValid) return null;
    return calculateCorrectedCalcium(caNum, albNum);
  }, [caNum, albNum, isValid]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
          <FlaskConical className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Calcium Correction</h1>
          <p className="text-muted-foreground text-sm font-medium">Adjusted Total Calcium for Hypoalbuminemia</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Laboratory Values</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Measured Total Calcium (mg/dL)</Label>
              <Input 
                type="number" 
                placeholder="e.g. 7.5" 
                className="h-12 text-lg font-mono border-2"
                value={calcium}
                onChange={(e) => setCalcium(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Serum Albumin (g/dL)</Label>
              <Input 
                type="number" 
                placeholder="e.g. 2.5" 
                className="h-12 text-lg font-mono border-2"
                value={albumin}
                onChange={(e) => setAlbumin(e.target.value)}
              />
            </div>

            <div className="rounded-xl bg-muted/50 p-4 border border-border">
              <div className="flex items-start gap-3">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Formula: <strong>Corrected Ca = Measured Ca + 0.8 × (4.0 - Albumin)</strong>. 
                  Approximately 40-50% of serum calcium is bound to albumin. Hypoalbuminemia leads to a low measured total calcium despite a normal physiologically active (ionized) calcium level.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
            {isValid && correctedCa ? (
                <div className="space-y-4">
                    <Card className="border-2 border-emerald-200 bg-emerald-50/30">
                        <CardHeader className="pb-2 text-center">
                            <Badge className="w-fit mx-auto mb-2 bg-emerald-600 uppercase font-black tracking-tight">Corrected Result</Badge>
                            <CardTitle className="text-6xl font-black font-mono text-emerald-700 tracking-tighter">
                                {correctedCa.toFixed(1)}
                            </CardTitle>
                            <p className="text-xs font-bold text-emerald-800/60 uppercase">mg/dL</p>
                        </CardHeader>
                        <CardContent>
                            <Alert className="bg-background border-emerald-100">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-xs font-medium">
                                    The corrected calcium provides an estimate of what the total calcium would be if the albumin were normal (4.0 g/dL).
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/30 border-dashed">
                        <CardContent className="pt-6">
                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-2 tracking-widest flex items-center gap-2">
                                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Clinical Warning
                            </p>
                            <p className="text-[11px] leading-relaxed text-muted-foreground font-medium">
                                Corrected calcium is an estimate. In critical cases (e.g. symptomatic tetany, arrhythmia), always obtain a direct <strong>Ionized Calcium</strong> level for the most accurate assessment of biological activity.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-4 border-dashed rounded-[40px] p-12 text-center bg-muted/20 border-muted/30">
                    <FlaskConical className="h-16 w-16 text-muted-foreground/20 mb-6" />
                    <h3 className="text-xl font-black text-muted-foreground/80 tracking-tight">Electrolyte Correction</h3>
                    <p className="text-muted-foreground font-medium text-sm mt-3 leading-relaxed max-w-[280px]">
                        Enter total calcium and albumin to calculate the corrected calcium level.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
