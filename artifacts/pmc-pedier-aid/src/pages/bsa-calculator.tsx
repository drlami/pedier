import { useState, useMemo } from "react";
import { 
  Scale, Calculator, Info, 
  ArrowLeft, CheckCircle2, Ruler, Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { calculateBSA } from "@/lib/calculators/formulas";
import { cn } from "@/lib/utils";

export default function BsaCalculatorPage() {
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");

  const wNum = parseFloat(weight);
  const hNum = parseFloat(height);
  const isValid = !isNaN(wNum) && wNum > 0 && !isNaN(hNum) && hNum > 0;

  const bsa = useMemo(() => {
    if (!isValid) return null;
    return calculateBSA(wNum, hNum);
  }, [wNum, hNum, isValid]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary active:scale-95">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
          <Ruler className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Body Surface Area (BSA)</h1>
          <p className="text-muted-foreground text-sm font-medium">Mosteller Formula for Clinical Calculations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Measurements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Weight (kg)</Label>
              <Input type="number" inputMode="decimal" placeholder="e.g. 15" className="h-12 text-lg font-mono" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Height (cm)</Label>
              <Input type="number" inputMode="decimal" placeholder="e.g. 110" className="h-12 text-lg font-mono" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>

            <div className="rounded-xl bg-muted/50 p-4 border border-border">
              <div className="flex items-start gap-3">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Mosteller Formula: <strong>BSA = √([Height (cm) × Weight (kg)] / 3600)</strong>. 
                  Used for calculating precise drug doses (e.g. chemotherapy) and fluid requirements in burn patients.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
            {isValid && bsa ? (
                <div className="space-y-4">
                    <Card className="border-2 border-indigo-200 bg-indigo-50/30">
                        <CardHeader className="pb-2 text-center">
                            <Badge className="w-fit mx-auto mb-2 bg-indigo-600 uppercase font-black">Calculated BSA</Badge>
                            <CardTitle className="text-6xl font-black font-mono text-indigo-700 tracking-tighter">
                                {bsa.toFixed(2)}
                            </CardTitle>
                            <p className="text-xs font-bold text-indigo-800/60 uppercase">m²</p>
                        </CardHeader>
                    </Card>

                    <Card className="bg-muted/30 border-dashed">
                        <CardContent className="pt-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                                <CheckCircle2 className="h-3 w-3 text-green-600" /> Standard Ranges
                            </h4>
                            <div className="space-y-2 text-[11px] text-muted-foreground">
                                <p>• <strong>Neonate:</strong> ~0.25 m²</p>
                                <p>• <strong>2 Year Old:</strong> ~0.50 m²</p>
                                <p>• <strong>9 Year Old:</strong> ~1.07 m²</p>
                                <p>• <strong>Adult (Mean):</strong> ~1.73 m²</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-4 border-dashed rounded-[40px] p-12 text-center bg-muted/20 border-muted/30">
                    <Activity className="h-16 w-16 text-muted-foreground/20 mb-6" />
                    <h3 className="text-xl font-black text-muted-foreground/80 tracking-tight">Geometry of Growth</h3>
                    <p className="text-muted-foreground font-medium text-sm mt-3 leading-relaxed max-w-[280px]">
                        Enter patient weight and height to calculate the Body Surface Area.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
