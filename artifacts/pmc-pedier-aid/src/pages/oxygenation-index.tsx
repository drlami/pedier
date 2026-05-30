import { useState, useMemo } from "react";
import { 
  Wind, Calculator, Info, 
  ArrowLeft, CheckCircle2, AlertTriangle, Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function OxygenationIndexCalc() {
  const [map, setMap] = useState<string>("");
  const [fio2, setFio2] = useState<string>("");
  const [pao2, setPao2] = useState<string>("");

  const oi = useMemo(() => {
    const m = parseFloat(map);
    const f = parseFloat(fio2);
    const p = parseFloat(pao2);
    if (isNaN(m) || isNaN(f) || isNaN(p) || p === 0) return null;
    return (m * f) / p;
  }, [map, fio2, pao2]);

  const interpretation = useMemo(() => {
    if (oi === null) return null;
    if (oi < 15) return { label: "Mild/Moderate", color: "text-green-600", bg: "bg-green-50" };
    if (oi < 25) return { label: "Severe", color: "text-amber-600", bg: "bg-amber-50" };
    if (oi < 40) return { label: "Very Severe (Consider iNO)", color: "text-red-600", bg: "bg-red-50" };
    return { label: "Extremely Severe (ECMO Candidate)", color: "text-red-700", bg: "bg-red-100" };
  }, [oi]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
          <Wind className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Oxygenation Index (OI)</h1>
          <p className="text-muted-foreground text-sm font-medium">Severity of Hypoxemic Respiratory Failure</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-2 shadow-sm h-fit">
          <CardHeader className="bg-muted/20 pb-4">
              <CardTitle className="text-base uppercase tracking-widest font-black text-muted-foreground">Input Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">
                Mean Airway Pressure (MAP)
              </label>
              <div className="relative">
                <Input type="number" inputMode="decimal" placeholder="e.g. 12" 
                  value={map} 
                  onChange={(e) => setMap(e.target.value)}
                  className="h-11 pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase">cmH2O</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">
                FiO2 (%)
              </label>
              <div className="relative">
                <Input type="number" inputMode="decimal" placeholder="e.g. 60" 
                  value={fio2} 
                  onChange={(e) => setFio2(e.target.value)}
                  className="h-11 pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">
                PaO2
              </label>
              <div className="relative">
                <Input type="number" inputMode="decimal" placeholder="e.g. 55" 
                  value={pao2} 
                  onChange={(e) => setPao2(e.target.value)}
                  className="h-11 pr-14"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase">mmHg</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
            {oi !== null && interpretation ? (
                <>
                    <Card className={cn("border-2 shadow-md transition-colors", interpretation.bg, oi >= 25 ? "border-red-200" : "border-blue-100")}>
                        <CardHeader className="pb-2 text-center">
                            <Badge className="w-fit mx-auto mb-2 bg-slate-700 uppercase font-black">OI Result</Badge>
                            <CardTitle className="text-6xl font-black font-mono text-slate-800 tracking-tighter">
                                {oi.toFixed(1)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col gap-1 p-4 rounded-xl bg-background/60 border border-muted shadow-sm text-center">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Severity Classification</span>
                                <span className={cn("font-bold text-lg", interpretation.color)}>{interpretation.label}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {oi >= 25 && (
                        <Alert variant="destructive" className="bg-red-600 text-white border-none shadow-lg rounded-2xl">
                            <AlertTriangle className="h-5 w-5" />
                            <div className="ml-2">
                                <AlertTitle className="font-black uppercase text-xs">High Risk Detection</AlertTitle>
                                <AlertDescription className="text-xs font-medium opacity-90 leading-relaxed">
                                    {oi >= 40 ? "Very high mortality risk. Immediate ECMO consultation recommended." : "Severe failure. Consider inhaled Nitric Oxide (iNO) or high-frequency ventilation."}
                                </AlertDescription>
                            </div>
                        </Alert>
                    )}

                    <Card className="bg-muted/30 border-dashed">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2 mb-3 text-primary font-black text-[10px] uppercase tracking-widest">
                                <Info className="h-3.5 w-3.5" /> Formula & Interpretation
                            </div>
                            <div className="space-y-3 text-[11px] leading-relaxed">
                                <div className="p-2 bg-background/50 rounded border font-mono text-center">
                                  OI = (MAP × FiO2) / PaO2
                                </div>
                                <div className="space-y-1">
                                  <p>• <strong>{'<'} 15:</strong> Mild to moderate respiratory failure.</p>
                                  <p>• <strong>15 - 25:</strong> Severe failure; consider HFOV.</p>
                                  <p>• <strong>{'>'} 25:</strong> High risk; consider iNO.</p>
                                  <p>• <strong>{'>'} 40:</strong> Extremely high risk; ECMO threshold.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </>
            ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-4 border-dashed rounded-[40px] p-12 text-center bg-muted/20 border-muted/30">
                    <Activity className="h-16 w-16 text-muted-foreground/20 mb-6" />
                    <h3 className="text-xl font-black text-muted-foreground/80 tracking-tight">Respiratory Assessment</h3>
                    <p className="text-muted-foreground font-medium text-sm mt-3 leading-relaxed max-w-[280px]">
                      Enter MAP, FiO2, and PaO2 to calculate the Oxygenation Index.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
