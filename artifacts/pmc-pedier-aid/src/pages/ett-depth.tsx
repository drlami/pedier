import { useState, useMemo } from "react";
import { 
  Baby, Calculator, Info, 
  ArrowLeft, CheckCircle2, AlertTriangle, Ruler
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function EttDepthCalc() {
  const [weight, setWeight] = useState<string>("");
  const [ntd, setNtd] = useState<string>("");

  const depthByWeight = useMemo(() => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return null;
    return w + 6;
  }, [weight]);

  const depthByNtd = useMemo(() => {
    const n = parseFloat(ntd);
    if (isNaN(n) || n <= 0) return null;
    return n + 1;
  }, [ntd]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
          <Ruler className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">ETT Depth Calculator</h1>
          <p className="text-muted-foreground text-sm font-medium">Endotracheal Tube Insertion Depth Estimation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="border-2 shadow-sm">
            <CardHeader className="bg-muted/20 pb-4">
                <CardTitle className="text-base uppercase tracking-widest font-black text-muted-foreground text-xs">Method 1: By Weight (Tuen's Rule)</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Neonatal Weight</label>
                <div className="relative">
                  <Input type="number" inputMode="decimal" placeholder="e.g. 2.5" value={weight} onChange={(e) => setWeight(e.target.value)} className="h-11 pr-8" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase">kg</span>
                </div>
              </div>
              {depthByWeight !== null && (
                <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-100 text-center">
                  <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest block mb-1">Estimated Depth</span>
                  <span className="text-4xl font-black font-mono text-amber-900">{depthByWeight.toFixed(1)} <span className="text-sm font-normal opacity-60">cm</span></span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 shadow-sm">
            <CardHeader className="bg-muted/20 pb-4">
                <CardTitle className="text-base uppercase tracking-widest font-black text-muted-foreground text-xs">Method 2: Nasal-Tragus Distance</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Nasal-Tragus Distance (NTD)</label>
                <div className="relative">
                  <Input type="number" inputMode="decimal" placeholder="e.g. 8.0" value={ntd} onChange={(e) => setNtd(e.target.value)} className="h-11 pr-8" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase">cm</span>
                </div>
              </div>
              {depthByNtd !== null && (
                <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100 text-center">
                  <span className="text-[10px] font-black text-blue-800 uppercase tracking-widest block mb-1">Estimated Depth</span>
                  <span className="text-4xl font-black font-mono text-blue-900">{depthByNtd.toFixed(1)} <span className="text-sm font-normal opacity-60">cm</span></span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
            <Card className="bg-muted/30 border-dashed">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-3 text-primary font-black text-[10px] uppercase tracking-widest">
                        <Info className="h-3.5 w-3.5" /> Clinical Guidance
                    </div>
                    <div className="space-y-4 text-[11px] leading-relaxed">
                        <div className="p-3 bg-background/50 rounded-xl border space-y-2">
                          <p className="font-bold text-amber-800 uppercase text-[9px]">Tuen's Rule (Traditional)</p>
                          <p>Lip-to-tip depth (cm) = Weight (kg) + 6. This rule may overestimate depth in extremely low birth weight infants ({'<'} 1000g).</p>
                        </div>
                        <div className="p-3 bg-background/50 rounded-xl border space-y-2">
                          <p className="font-bold text-blue-800 uppercase text-[9px]">NTD Rule</p>
                          <p>Lip-to-tip depth (cm) = Nasal-Tragus Distance (cm) + 1. Evidence suggests this may be more accurate across various weights.</p>
                        </div>
                        <Alert className="bg-amber-100 border-amber-200">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                          <AlertDescription className="text-[10px] text-amber-800">
                            Always confirm tube position with clinical assessment (breath sounds, CO2) and chest X-ray. These are estimations only.
                          </AlertDescription>
                        </Alert>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-2 border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-black uppercase text-slate-500">Suggested ETT Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-100 text-[10px]">
                    <span className="font-bold">{'<'} 1000g</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border">2.5 mm</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-100 text-[10px]">
                    <span className="font-bold">1000g - 2000g</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border">3.0 mm</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-100 text-[10px]">
                    <span className="font-bold">2000g - 3000g</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border">3.5 mm</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-100 text-[10px]">
                    <span className="font-bold">{'>'} 3000g</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border">3.5 - 4.0 mm</span>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
