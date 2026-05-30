import { useState, useMemo } from "react";
import { 
  Scissors, Calculator, Info, 
  ArrowLeft, CheckCircle2, AlertTriangle, Ruler, Baby
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function UacUvcLengthCalc() {
  const [weight, setWeight] = useState<string>("");
  const [length, setLength] = useState<string>("");

  const results = useMemo(() => {
    const w = parseFloat(weight);
    const l = parseFloat(length);
    
    if (isNaN(w) || w <= 0) return null;

    return {
      uacHigh: (3 * w) + 9,
      uacLow: w + 7,
      uvc: (1.5 * w) + 5.5,
      uvcByLength: !isNaN(l) ? (l / 10) + 1 : null
    };
  }, [weight, length]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
          <Scissors className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">UAC/UVC Length</h1>
          <p className="text-muted-foreground text-sm font-medium">Umbilical Catheter Insertion Depth</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-2 shadow-sm h-fit">
          <CardHeader className="bg-muted/20 pb-4">
              <CardTitle className="text-base uppercase tracking-widest font-black text-muted-foreground">Patient Measurements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Current Weight</label>
              <div className="relative">
                <Input type="number" inputMode="decimal" placeholder="e.g. 1.5" value={weight} onChange={(e) => setWeight(e.target.value)} className="h-11 pr-8" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase">kg</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Body Length (Optional)</label>
              <div className="relative">
                <Input type="number" inputMode="decimal" placeholder="e.g. 40" value={length} onChange={(e) => setLength(e.target.value)} className="h-11 pr-8" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase">cm</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
            {results ? (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    <ResultCard title="UAC (High Position)" value={results.uacHigh} description="Tip at T6-T9 (Above Diaphragm)" color="rose" />
                    <ResultCard title="UAC (Low Position)" value={results.uacLow} description="Tip at L3-L4 (Below SMA)" color="slate" />
                    <ResultCard title="UVC (Venous)" value={results.uvc} description="Tip at IVC/RA Junction" color="blue" />
                  </div>

                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-[10px] text-amber-800 leading-relaxed font-medium">
                      Calculations are based on <strong>(3 × Weight) + 9</strong> for UAC and <strong>(1.5 × Weight) + 5.5</strong> for UVC. 
                      Catheter position MUST be verified by X-ray. Add length for the umbilical stump.
                    </AlertDescription>
                  </Alert>

                  <Card className="bg-muted/30 border-dashed">
                      <CardContent className="pt-6">
                          <div className="flex items-center gap-2 mb-3 text-primary font-black text-[10px] uppercase tracking-widest">
                              <Info className="h-3.5 w-3.5" /> Clinical Pearls
                          </div>
                          <div className="space-y-2 text-[11px] leading-relaxed">
                              <p>• <strong>High UAC:</strong> Preferred to avoid mesenteric/renal artery involvement.</p>
                              <p>• <strong>UVC:</strong> Ensure the tip is not in the heart or portal system.</p>
                              <p>• <strong>Stump:</strong> Remember to add the length of the umbilical stump (usually 1-2 cm) to these measurements.</p>
                          </div>
                      </CardContent>
                  </Card>
                </>
            ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-4 border-dashed rounded-[40px] p-12 text-center bg-muted/20 border-muted/30">
                    <Scissors className="h-16 w-16 text-muted-foreground/20 mb-6" />
                    <h3 className="text-xl font-black text-muted-foreground/80 tracking-tight">Procedure Planning</h3>
                    <p className="text-muted-foreground font-medium text-sm mt-3 leading-relaxed max-w-[280px]">
                      Enter the baby's weight to calculate the recommended umbilical catheter insertion depths.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

function ResultCard({ title, value, description, color }: { title: string, value: number, description: string, color: string }) {
  const colors: Record<string, string> = {
    rose: "bg-rose-50 border-rose-100 text-rose-900",
    blue: "bg-blue-50 border-blue-100 text-blue-900",
    slate: "bg-slate-50 border-slate-100 text-slate-900"
  };

  return (
    <Card className={cn("border-2 shadow-sm", colors[color])}>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase opacity-60 tracking-widest block">{title}</span>
          <p className="text-[10px] font-medium opacity-80">{description}</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black font-mono">{value.toFixed(1)}</span>
          <span className="text-xs font-bold ml-1 opacity-60 italic">cm</span>
        </div>
      </CardContent>
    </Card>
  );
}
