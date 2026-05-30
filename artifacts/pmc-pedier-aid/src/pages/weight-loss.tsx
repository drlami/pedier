import { useState, useMemo } from "react";
import { 
  Scale, Calculator, Info, 
  ArrowLeft, CheckCircle2, AlertTriangle, TrendingDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function WeightLossCalc() {
  const [birthWeight, setBirthWeight] = useState<string>("");
  const [currentWeight, setCurrentWeight] = useState<string>("");

  const result = useMemo(() => {
    const bw = parseFloat(birthWeight);
    const cw = parseFloat(currentWeight);
    if (isNaN(bw) || isNaN(cw) || bw === 0) return null;
    
    const loss = bw - cw;
    const percentage = (loss / bw) * 100;
    
    return {
      loss: loss,
      percentage: percentage
    };
  }, [birthWeight, currentWeight]);

  const interpretation = useMemo(() => {
    if (!result) return null;
    const p = result.percentage;
    if (p < 0) return { label: "Weight Gain", color: "text-green-600", bg: "bg-green-50" };
    if (p <= 7) return { label: "Normal Loss", color: "text-blue-600", bg: "bg-blue-50" };
    if (p <= 10) return { label: "Borderline Loss", color: "text-amber-600", bg: "bg-amber-50" };
    return { label: "Excessive Loss", color: "text-red-600", bg: "bg-red-50" };
  }, [result]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
          <Scale className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Birth Weight Loss %</h1>
          <p className="text-muted-foreground text-sm font-medium">Newborn Nutritional Status Tracker</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-2 shadow-sm h-fit">
          <CardHeader className="bg-muted/20 pb-4">
              <CardTitle className="text-base uppercase tracking-widest font-black text-muted-foreground">Weight Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Birth Weight</label>
              <div className="relative">
                <Input type="number" inputMode="decimal" placeholder="e.g. 3500" value={birthWeight} onChange={(e) => setBirthWeight(e.target.value)} className="h-11 pr-8" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase">g</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Current Weight</label>
              <div className="relative">
                <Input type="number" inputMode="decimal" placeholder="e.g. 3200" value={currentWeight} onChange={(e) => setCurrentWeight(e.target.value)} className="h-11 pr-8" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase">g</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
            {result && interpretation ? (
                <>
                    <Card className={cn("border-2 shadow-md transition-colors", interpretation.bg, result.percentage > 10 ? "border-red-200" : "border-emerald-100")}>
                        <CardHeader className="pb-2 text-center">
                            <Badge className="w-fit mx-auto mb-2 bg-slate-700 uppercase font-black">Weight Change</Badge>
                            <CardTitle className="text-6xl font-black font-mono text-slate-800 tracking-tighter">
                                {result.percentage.toFixed(1)}
                                <span className="text-2xl font-normal opacity-30">%</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col gap-1 p-4 rounded-xl bg-background/60 border border-muted shadow-sm text-center">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Clinical Interpretation</span>
                                <span className={cn("font-bold text-lg", interpretation.color)}>{interpretation.label}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {result.percentage > 7 && (
                        <Alert className={cn("border-none shadow-lg rounded-2xl", result.percentage > 10 ? "bg-red-600 text-white" : "bg-amber-500 text-white")}>
                            <AlertTriangle className="h-5 w-5" />
                            <div className="ml-2">
                                <AlertTitle className="font-black uppercase text-xs">Clinical Alert</AlertTitle>
                                <AlertDescription className="text-xs font-medium opacity-90 leading-relaxed">
                                    {result.percentage > 10 ? "Excessive weight loss (>10%). Evaluate breastfeeding, hydration status, and consider supplementation." : "Significant weight loss (>7%). Closely monitor feeding and output."}
                                </AlertDescription>
                            </div>
                        </Alert>
                    )}

                    <Card className="bg-muted/30 border-dashed">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2 mb-3 text-primary font-black text-[10px] uppercase tracking-widest">
                                <Info className="h-3.5 w-3.5" /> Normal Weight Patterns
                            </div>
                            <div className="space-y-2 text-[11px] leading-relaxed">
                                <p>• <strong>Days 1-3:</strong> Expect 5-7% loss as baby clears meconium and extra fluid.</p>
                                <p>• <strong>Day 4+:</strong> Weight should begin to stabilize or increase.</p>
                                <p>• <strong>Days 10-14:</strong> Most babies should return to birth weight.</p>
                            </div>
                        </CardContent>
                    </Card>
                </>
            ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-4 border-dashed rounded-[40px] p-12 text-center bg-muted/20 border-muted/30">
                    <TrendingDown className="h-16 w-16 text-muted-foreground/20 mb-6" />
                    <h3 className="text-xl font-black text-muted-foreground/80 tracking-tight">Growth Monitoring</h3>
                    <p className="text-muted-foreground font-medium text-sm mt-3 leading-relaxed max-w-[280px]">
                      Enter the birth weight and current weight to track the percentage change.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
