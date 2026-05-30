import { useState, useMemo } from "react";
import { 
  Wind, Calculator, Info, 
  ArrowLeft, CheckCircle2, AlertTriangle, Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function MapCalculator() {
  const [pip, setPip] = useState<string>("");
  const [peep, setPeep] = useState<string>("");
  const [ti, setTi] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [te, setTe] = useState<string>("");

  const mapByTi = useMemo(() => {
    const p = parseFloat(pip);
    const pe = parseFloat(peep);
    const t = parseFloat(ti);
    const e = parseFloat(te);
    if (isNaN(p) || isNaN(pe) || isNaN(t) || isNaN(e) || (t + e) === 0) return null;
    return ((p - pe) * (t / (t + e))) + pe;
  }, [pip, peep, ti, te]);

  const mapByRate = useMemo(() => {
    const p = parseFloat(pip);
    const pe = parseFloat(peep);
    const t = parseFloat(ti);
    const r = parseFloat(rate);
    if (isNaN(p) || isNaN(pe) || isNaN(t) || isNaN(r)) return null;
    return (((p - pe) * t * r) / 60) + pe;
  }, [pip, peep, ti, rate]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Mean Airway Pressure (MAP)</h1>
          <p className="text-muted-foreground text-sm font-medium">Ventilation Parameter Calculator</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-2 shadow-sm h-fit">
          <CardHeader className="bg-muted/20 pb-4">
              <CardTitle className="text-base uppercase tracking-widest font-black text-muted-foreground">Ventilator Settings</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="ti-te" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="ti-te">By Ti / Te</TabsTrigger>
                <TabsTrigger value="rate">By Rate</TabsTrigger>
              </TabsList>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">PIP</label>
                    <div className="relative">
                      <Input type="number" inputMode="decimal" placeholder="e.g. 20" value={pip} onChange={(e) => setPip(e.target.value)} className="h-11 pr-12" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">cmH2O</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">PEEP</label>
                    <div className="relative">
                      <Input type="number" inputMode="decimal" placeholder="e.g. 5" value={peep} onChange={(e) => setPeep(e.target.value)} className="h-11 pr-12" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">cmH2O</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Inspiratory Time (Ti)</label>
                  <div className="relative">
                    <Input type="number" inputMode="decimal" placeholder="e.g. 0.35" value={ti} onChange={(e) => setTi(e.target.value)} className="h-11 pr-10" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase">sec</span>
                  </div>
                </div>

                <TabsContent value="ti-te" className="mt-0 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Expiratory Time (Te)</label>
                    <div className="relative">
                      <Input type="number" inputMode="decimal" placeholder="e.g. 0.65" value={te} onChange={(e) => setTe(e.target.value)} className="h-11 pr-10" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase">sec</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="rate" className="mt-0 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Rate (BPM)</label>
                    <div className="relative">
                      <Input type="number" inputMode="decimal" placeholder="e.g. 60" value={rate} onChange={(e) => setRate(e.target.value)} className="h-11 pr-10" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase">bpm</span>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
            <Tabs defaultValue="ti-te" className="w-full">
              <TabsContent value="ti-te">
                {mapByTi !== null ? (
                  <ResultCard value={mapByTi} />
                ) : <EmptyState />}
              </TabsContent>
              <TabsContent value="rate">
                {mapByRate !== null ? (
                  <ResultCard value={mapByRate} />
                ) : <EmptyState />}
              </TabsContent>
            </Tabs>

            <Card className="bg-muted/30 border-dashed">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-3 text-primary font-black text-[10px] uppercase tracking-widest">
                        <Info className="h-3.5 w-3.5" /> Formula Info
                    </div>
                    <div className="space-y-3 text-[11px] leading-relaxed">
                        <p>Mean Airway Pressure (MAP) represents the average pressure applied to the lungs during the entire respiratory cycle.</p>
                        <div className="p-2 bg-background/50 rounded border font-mono text-[10px] space-y-1">
                          <p>MAP = [(PIP - PEEP) × (Ti / (Ti + Te))] + PEEP</p>
                          <p>OR</p>
                          <p>MAP = [((PIP - PEEP) × Ti × Rate) / 60] + PEEP</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ value }: { value: number }) {
  return (
    <Card className="border-2 shadow-md bg-indigo-50 border-indigo-100 text-center">
      <CardHeader className="pb-2">
          <Badge className="w-fit mx-auto mb-2 bg-slate-700 uppercase font-black">MAP Result</Badge>
          <CardTitle className="text-6xl font-black font-mono text-slate-800 tracking-tighter">
              {value.toFixed(1)}
              <span className="text-xl font-normal opacity-40 ml-2 italic">cmH2O</span>
          </CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
          <div className="p-3 rounded-xl bg-background/60 border border-muted shadow-sm">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Clinical significance</span>
              <p className="text-xs font-medium text-indigo-700">Higher MAP improves oxygenation by increasing lung volume and recruiting alveoli, but increases risk of barotrauma and decreased cardiac output.</p>
          </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-4 border-dashed rounded-[40px] p-12 text-center bg-muted/20 border-muted/30">
        <Activity className="h-16 w-16 text-muted-foreground/20 mb-6" />
        <h3 className="text-xl font-black text-muted-foreground/80 tracking-tight">Calculation Ready</h3>
        <p className="text-muted-foreground font-medium text-sm mt-3 leading-relaxed max-w-[280px]">
          Enter the required ventilator settings to calculate the Mean Airway Pressure.
        </p>
    </div>
  );
}
