import { useState, useMemo } from "react";
import { 
  ArrowLeft, Info, HeartPulse, Activity, Scale, ShieldAlert, AlertCircle, Timer, MoveRight 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "wouter";
import { calculateQTc } from "@/lib/calculators/formulas";
import { cn } from "@/lib/utils";

export default function QtcCalculatorPage() {
  const [qt, setQt] = useState<string>("");
  const [rr, setRr] = useState<string>("");

  const qtNum = parseFloat(qt);
  const rrNum = parseFloat(rr);

  const isValid = !isNaN(qtNum) && qtNum > 0 && !isNaN(rrNum) && rrNum > 0;

  const qtc = useMemo(() => {
    if (!isValid) return null;
    return calculateQTc(qtNum, rrNum);
  }, [qtNum, rrNum, isValid]);

  const interpretation = useMemo(() => {
    if (qtc === null) return null;
    if (qtc > 460) return { label: "Prolonged QTc", color: "text-red-600", bg: "bg-red-50", severity: "high" };
    if (qtc > 440) return { label: "Borderline QTc", color: "text-amber-600", bg: "bg-amber-50", severity: "mod" };
    return { label: "Normal QTc", color: "text-green-600", bg: "bg-green-50", severity: "normal" };
  }, [qtc]);

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 pb-20">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
            <Activity className="h-6 w-6" />
        </div>
        <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">Corrected QT Interval (QTc)</h1>
            <p className="text-muted-foreground text-sm font-medium">Bazett's Formula for Pediatric ECG Analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUTS */}
        <div className="lg:col-span-4 space-y-6">
            <Card className="border-2 shadow-sm">
                <CardHeader className="pb-3 border-b bg-muted/20">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Scale className="h-4 w-4" /> ECG Measurements
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">QT Interval (ms)</Label>
                        <div className="relative">
                            <Input type="number" inputMode="decimal" placeholder="e.g. 360" className="h-12 font-mono text-xl border-2" value={qt} onChange={(e) => setQt(e.target.value)} />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">ms</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground italic">Start of Q wave to end of T wave.</p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">RR Interval (ms)</Label>
                        <div className="relative">
                            <Input type="number" inputMode="decimal" placeholder="e.g. 800" className="h-12 font-mono text-xl border-2" value={rr} onChange={(e) => setRr(e.target.value)} />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">ms</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground italic">Distance between two consecutive R peaks.</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-rose-950 text-white border-none shadow-xl">
                <CardContent className="pt-6 space-y-3">
                    <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-rose-300" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-70">ECG Tip</span>
                    </div>
                    <p className="text-xs leading-relaxed font-medium">
                        One small square = <strong>40 ms</strong>. <br />
                        One large square = <strong>200 ms</strong>.
                    </p>
                </CardContent>
            </Card>
        </div>

        {/* VISUAL GUIDE & RESULTS */}
        <div className="lg:col-span-8 space-y-6">
            
            {/* ECG PREVIEW SAMPLE */}
            <Card className="overflow-hidden border-2 bg-slate-50 relative">
                <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Visual Measurement Guide</span>
                    <Badge variant="outline" className="text-slate-400 border-slate-600 uppercase text-[9px]">Standard 25mm/s</Badge>
                </div>
                <div className="p-8 flex flex-col items-center justify-center min-h-[200px]">
                    <svg viewBox="0 0 800 200" className="w-full h-auto drop-shadow-sm">
                        {/* Grid Lines */}
                        <defs>
                            <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#fecaca" strokeWidth="0.5"/>
                            </pattern>
                            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                                <rect width="50" height="50" fill="url(#smallGrid)"/>
                                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#fca5a5" strokeWidth="1"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        
                        {/* ECG Trace (Simplified) */}
                        <path d="M 50 100 L 100 100 L 110 90 L 120 150 L 135 40 L 150 100 L 170 100 C 190 100, 210 70, 230 100 L 450 100 L 460 90 L 470 150 L 485 40 L 500 100 L 520 100 C 540 100, 560 70, 580 100 L 750 100" 
                              fill="none" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
                        
                        {/* RR Measurement */}
                        <line x1="135" y1="30" x2="485" y2="30" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
                        <text x="310" y="20" className="text-[12px] font-black fill-red-600">RR Interval</text>
                        <circle cx="135" cy="40" r="4" fill="#ef4444" />
                        <circle cx="485" cy="40" r="4" fill="#ef4444" />

                        {/* QT Measurement */}
                        <line x1="120" y1="160" x2="230" y2="160" stroke="#4f46e5" strokeWidth="2" />
                        <text x="145" y="185" className="text-[12px] font-black fill-indigo-600">QT Interval</text>
                        <line x1="120" y1="150" x2="120" y2="170" stroke="#4f46e5" strokeWidth="2" />
                        <line x1="230" y1="150" x2="230" y2="170" stroke="#4f46e5" strokeWidth="2" />
                    </svg>
                </div>
            </Card>

            {/* RESULTS */}
            {isValid && qtc && interpretation ? (
                <div className="space-y-6">
                    <Card className={cn("border-2 shadow-md transition-colors", interpretation.bg, interpretation.severity === 'high' ? "border-red-200" : "border-rose-100")}>
                        <CardHeader className="pb-2 text-center">
                            <Badge className="w-fit mx-auto mb-2 bg-rose-600 uppercase font-black">Calculated QTc</Badge>
                            <CardTitle className="text-6xl font-black font-mono text-rose-700 tracking-tighter">
                                {qtc.toFixed(0)} <span className="text-2xl font-normal opacity-40">ms</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col gap-1 p-4 rounded-xl bg-background/60 border border-rose-100 shadow-sm text-center">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Interpretation</span>
                                <span className={cn("font-bold text-lg", interpretation.color)}>{interpretation.label}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {interpretation.severity === "high" && (
                        <Alert variant="destructive" className="bg-red-600 text-white border-none shadow-lg rounded-2xl">
                            <ShieldAlert className="h-5 w-5" />
                            <div className="ml-2">
                                <AlertTitle className="font-black uppercase text-sm">Critical Risk: Torsades de Pointes</AlertTitle>
                                <AlertDescription className="text-xs font-medium opacity-90 leading-relaxed">
                                    QTc {'>'} 460ms is significantly prolonged. Avoid all QT-prolonging medications (Ondansetron, Macrolides) and monitor electrolytes (K+, Mg2+, Ca2+).
                                </AlertDescription>
                            </div>
                        </Alert>
                    )}
                </div>
            ) : (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-4 border-dashed rounded-[40px] p-12 text-center bg-muted/20 border-muted/30">
                    <Activity className="h-16 w-16 text-muted-foreground/20 mb-6" />
                    <h3 className="text-xl font-black text-muted-foreground/80 tracking-tight">Bazett Logic Ready</h3>
                    <p className="text-muted-foreground font-medium text-sm mt-3 leading-relaxed max-w-[320px]">
                        Enter QT and RR intervals in milliseconds to calculate the corrected QT interval.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
