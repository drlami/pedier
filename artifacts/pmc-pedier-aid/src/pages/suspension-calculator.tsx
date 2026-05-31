'use client';

import { useState, useMemo } from "react";
import { 
  Calculator, 
  Pill, 
  Scale, 
  FlaskConical, 
  Clock, 
  Calendar,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Info,
  Activity
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function SuspensionCalculatorPage() {
  const [weight, setWeight] = useState<string>("");
  const [dosePerKg, setDosePerKg] = useState<string>("");
  const [concentration, setConcentration] = useState<string>(""); // mg per 5ml
  const [frequency, setFrequency] = useState<string>("2"); // default BID
  const [duration, setDuration] = useState<string>("5"); // default 5 days

  const results = useMemo(() => {
    const w = parseFloat(weight);
    const d = parseFloat(dosePerKg);
    const c = parseFloat(concentration);
    const f = parseFloat(frequency);
    const dur = parseFloat(duration);

    if (isNaN(w) || isNaN(d) || isNaN(c) || isNaN(f) || isNaN(dur) || c === 0) {
      return null;
    }

    const mgPerDose = w * d;
    const mlPerDose = (mgPerDose * 5) / c;
    const totalMl = mlPerDose * f * dur;

    return {
      mgPerDose: mgPerDose.toFixed(1),
      mlPerDose: mlPerDose.toFixed(1),
      totalMl: totalMl.toFixed(0),
      frequencyText: f === 1 ? "Once daily" : f === 2 ? "Twice daily (q12h)" : f === 3 ? "Three times daily (q8h)" : "Four times daily (q6h)"
    };
  }, [weight, dosePerKg, concentration, frequency, duration]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 px-2 sm:px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link href="/calculators">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tighter">Suspension Dosing</h1>
          <p className="text-muted-foreground font-medium text-sm">Calculate mL volumes for oral suspensions based on weight.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* INPUTS COLUMN */}
        <div className="md:col-span-5 space-y-4">
          <Card className="rounded-[28px] border-2 shadow-sm overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 border-b py-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Calculator className="h-4 w-4 text-primary" /> Patient & Drug Info
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Scale className="h-3 w-3" /> Patient Weight (kg)
                </Label>
                <Input 
                  id="weight"
                  type="number" 
                  placeholder="e.g. 10.5" 
                  className="h-12 rounded-2xl text-lg font-black bg-muted/20 border-muted-foreground/10 focus:border-primary/50 transition-all"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dose" className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Pill className="h-3 w-3" /> Dose (mg / kg)
                </Label>
                <Input 
                  id="dose"
                  type="number" 
                  placeholder="e.g. 50" 
                  className="h-12 rounded-2xl text-lg font-black bg-muted/20 border-muted-foreground/10 focus:border-primary/50 transition-all"
                  value={dosePerKg}
                  onChange={(e) => setDosePerKg(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conc" className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <FlaskConical className="h-3 w-3" /> Concentration (mg / 5 ml)
                </Label>
                <Input 
                  id="conc"
                  type="number" 
                  placeholder="e.g. 250" 
                  className="h-12 rounded-2xl text-lg font-black bg-muted/20 border-muted-foreground/10 focus:border-primary/50 transition-all"
                  value={concentration}
                  onChange={(e) => setConcentration(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="freq" className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3 w-3" /> Freq (times/day)
                  </Label>
                  <select 
                    id="freq"
                    className="w-full h-12 rounded-2xl px-4 text-lg font-black bg-muted/20 border border-muted-foreground/10 focus:border-primary/50 appearance-none transition-all outline-none"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                  >
                    <option value="1">1 (QD)</option>
                    <option value="2">2 (BID)</option>
                    <option value="3">3 (TID)</option>
                    <option value="4">4 (QID)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> Duration (days)
                  </Label>
                  <Input 
                    id="duration"
                    type="number" 
                    placeholder="e.g. 7" 
                    className="h-12 rounded-2xl text-lg font-black bg-muted/20 border-muted-foreground/10 focus:border-primary/50 transition-all"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RESULTS COLUMN */}
        <div className="md:col-span-7">
          {results ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <Card className="rounded-[32px] overflow-hidden border-2 border-primary/20 shadow-xl bg-primary/[0.02]">
                <CardHeader className="bg-primary/5 border-b pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      <Activity className="h-4 w-4" /> Calculated Directive
                    </CardTitle>
                    <Badge className="bg-primary text-white font-black px-3 py-1">READY</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Volume per Dose</p>
                    <h2 className="text-7xl font-black tracking-tighter text-primary">{results.mlPerDose} <span className="text-2xl ml-[-0.5rem]">mL</span></h2>
                    <p className="text-xl font-bold text-foreground">{results.frequencyText}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-3xl bg-background border shadow-sm space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mass per Dose</p>
                      <p className="text-2xl font-black tracking-tight">{results.mgPerDose} mg</p>
                    </div>
                    <div className="p-4 rounded-3xl bg-background border shadow-sm space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Supply</p>
                      <p className="text-2xl font-black tracking-tight">{results.totalMl} mL</p>
                    </div>
                  </div>

                  <div className="bg-muted/40 p-4 rounded-2xl flex items-start gap-3 border border-dashed">
                    <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-foreground">Clinical Summary</p>
                      <p className="text-[11px] text-muted-foreground font-medium leading-relaxed mt-1">
                        Administer <strong>{results.mlPerDose} mL</strong> ({results.mgPerDose} mg) of the <strong>{concentration}mg/5mL</strong> suspension 
                        <strong> {results.frequencyText}</strong> for a total of <strong>{duration} days</strong>. 
                        Ensure the total supply of at least <strong>{results.totalMl} mL</strong> is available.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert className="bg-amber-50 border-amber-200 text-amber-900 rounded-2xl">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-xs font-black uppercase tracking-wider">Safety Warning</AlertTitle>
                <AlertDescription className="text-[11px] font-medium leading-relaxed">
                  Verify the drug concentration on the bottle before confirming the dose. Always double-check calculations for narrow-therapeutic-index drugs.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-muted/20 border-2 border-dashed rounded-[32px] space-y-4">
              <div className="w-16 h-16 bg-background rounded-3xl flex items-center justify-center shadow-sm border">
                <Calculator className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black tracking-tight text-muted-foreground/60">Results Pending</h3>
                <p className="text-sm text-muted-foreground/50 max-w-xs mx-auto font-medium">
                  Enter the patient's weight, drug dose, and solution concentration to see the required mL volume.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
