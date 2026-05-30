import { useState, useMemo } from "react";
import { 
  Droplets, Calculator, Info, 
  ArrowLeft, ChevronRight, CheckCircle2, AlertTriangle, Scale, FlaskConical, Timer, 
  Stethoscope, ShieldAlert, History, BookOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "wouter";
import { 
    calculateMaintenanceFluids, 
    calculateTotalDeficit, 
    calculateSodiumDeficit, 
    calculateFreeWaterDeficit 
} from "@/lib/calculators/formulas";
import { cn } from "@/lib/utils";

export default function AdvancedFluidsCalc() {
  const [weight, setWeight] = useState<string>("");
  const [dehydration, setDehydration] = useState<string>("5");
  const [sodium, setSodium] = useState<string>("140");

  const wNum = parseFloat(weight);
  const dNum = parseFloat(dehydration);
  const naNum = parseFloat(sodium);

  const isValid = !isNaN(wNum) && wNum > 0 && !isNaN(dNum) && !isNaN(naNum);

  const fluidPlan = useMemo(() => {
    if (!isValid) return null;

    const maintenance = calculateMaintenanceFluids(wNum);
    const deficit = calculateTotalDeficit(wNum, dNum);
    
    let state: "iso" | "hypo" | "hyper" = "iso";
    if (naNum < 135) state = "hypo";
    else if (naNum > 145) state = "hyper";

    // Timing & Precision Logic
    let correctionTime = 24; 
    let phase1Label = "Phase 2: First 8 Hours";
    let phase2Label = "Phase 3: Next 16 Hours";
    let maxNaDrop24h = "N/A";
    let recommendedFluid = "D5 ½ NS (0.45%)";

    if (state === "hyper") {
        // --- GRADIENT CORRECTION LOGIC (2025 Standard) ---
        if (naNum > 170) {
            correctionTime = 96; // Extreme hypernatremia: 4 days
            recommendedFluid = "D5 0.45% or 0.9% NS";
            maxNaDrop24h = "8 - 10 mEq/L (Max 0.4 mEq/hr)";
        } else if (naNum > 157) {
            correctionTime = 72; // Severe: 3 days
            recommendedFluid = "D5 0.45% NS";
            maxNaDrop24h = "10 - 12 mEq/L (Max 0.5 mEq/hr)";
        } else {
            correctionTime = 48; // Moderate: 2 days
            recommendedFluid = "D5 0.225% NS";
            maxNaDrop24h = "12 mEq/L";
        }
        
        phase1Label = `Phase 2: First 24 Hours`;
        phase2Label = `Phase 3: Remaining ${correctionTime - 24} Hours`;
    }

    if (state === "hypo") {
        maxNaDrop24h = "8 - 10 mEq/L (to avoid ODS)";
        recommendedFluid = "0.9% NS";
    }

    return {
      maintenance,
      deficit,
      state,
      correctionTime,
      phase1Label,
      phase2Label,
      maxNaDrop24h,
      recommendedFluid,
      totalNaDeficit: state === "hypo" ? calculateSodiumDeficit(wNum, naNum) : 0,
      freeWaterDeficit: state === "hyper" ? calculateFreeWaterDeficit(wNum, naNum) : 0,
      bolus: wNum * 20,
      hypertonicBolus: wNum * 3 // 3 mL/kg
    };
  }, [wNum, dNum, naNum, isValid]);

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 pb-20">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <Droplets className="h-6 w-6" />
            </div>
            <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">Advanced Dehydration Engine</h1>
            <p className="text-muted-foreground text-sm font-medium">Precision Electrolyte Management Protocol</p>
            </div>
        </div>
        {isValid && (
             <Badge className={cn(
                "uppercase font-black tracking-widest px-6 py-2 text-sm shadow-sm",
                fluidPlan?.state === "iso" ? "bg-green-600" :
                fluidPlan?.state === "hypo" ? "bg-blue-600" : "bg-red-600"
            )}>
                {fluidPlan?.state === "iso" ? "Isonatremic" : 
                 fluidPlan?.state === "hypo" ? "Hyponatremic" : "Hypernatremic"}
            </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-2 border-primary/10 shadow-sm">
            <CardHeader className="pb-3 bg-primary/5">
              <CardTitle className="text-base flex items-center gap-2">
                <Scale className="h-4 w-4 text-primary" /> Patient Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Weight (kg)</Label>
                <Input type="number" inputMode="decimal" 
                  className="h-12 font-mono text-xl border-2 focus:border-primary"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Est. % Dehydration</Label>
                <div className="relative">
                    <Input type="number" inputMode="decimal" 
                    className="h-12 font-mono text-xl border-2 pr-12"
                    value={dehydration}
                    onChange={(e) => setDehydration(e.target.value)}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-muted-foreground text-lg">%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Serum Sodium (Na+)</Label>
                <div className="relative">
                    <Input type="number" inputMode="decimal" 
                    className="h-12 font-mono text-xl border-2 pr-16"
                    value={sodium}
                    onChange={(e) => setSodium(e.target.value)}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground uppercase">mEq/L</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {isValid && (
              <Card className="border-2 border-amber-100 bg-amber-50/50 shadow-sm">
                  <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-amber-700">
                          <Timer className="h-4 w-4" /> Lab Monitoring Schedule
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-amber-200/50">
                          <span className="text-xs font-medium text-amber-900">Serum Electrolytes</span>
                          <Badge variant="outline" className="bg-white border-amber-300 text-amber-700 font-bold">Every 2 - 4 hours</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2">
                          <span className="text-xs font-medium text-amber-900">Strict I/O</span>
                          <Badge variant="outline" className="bg-white border-amber-300 text-amber-700 font-bold">Hourly</Badge>
                      </div>
                  </CardContent>
              </Card>
          )}
        </div>

        <div className="lg:col-span-8 space-y-6">
          {isValid && fluidPlan ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              
              {naNum < 120 && (
                  <Alert variant="destructive" className="border-4 shadow-lg animate-pulse">
                      <ShieldAlert className="h-6 w-6" />
                      <AlertTitle className="font-black uppercase tracking-tighter text-lg">Critical Hyponatremia Alert</AlertTitle>
                      <AlertDescription className="font-bold">
                          If seizing or altered: Give <strong>3% Hypertonic Saline {fluidPlan.hypertonicBolus.toFixed(1)} mL</strong> (3 mL/kg) over 10-20 min. Repeat as needed up to 3 times to stop seizure.
                      </AlertDescription>
                  </Alert>
              )}

              {naNum >= 170 && (
                  <Alert className="bg-red-600 text-white border-none shadow-lg">
                      <ShieldAlert className="h-6 w-6" />
                      <AlertTitle className="font-black uppercase tracking-tighter text-lg">Extreme Hypernatremia (Na &gt; 170)</AlertTitle>
                      <AlertDescription className="font-bold">
                          URGENT: Correction MUST be extremely slow (over <strong>96 hours</strong>). Use higher sodium fluids (0.45% or 0.9% NS) initially to prevent a rapid drop. Target drop <strong>&lt; 0.4 mEq/L/hr</strong>.
                      </AlertDescription>
                  </Alert>
              )}

              <Accordion type="single" collapsible defaultValue="phase1" className="w-full space-y-4">
                
                <AccordionItem value="phase1" className="border rounded-2xl overflow-hidden shadow-sm bg-background">
                    <AccordionTrigger className="px-6 hover:no-underline bg-destructive/5 hover:bg-destructive/10">
                        <div className="flex items-center gap-4 text-left">
                            <Badge variant="destructive" className="h-8 w-8 rounded-full flex items-center justify-center p-0 font-black">1</Badge>
                            <div>
                                <p className="font-black uppercase tracking-tighter text-destructive">Phase 1: Resuscitation (0 - 1h)</p>
                                <p className="text-xs text-muted-foreground font-medium">Treat shock regardless of sodium level</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between p-5 bg-destructive/10 rounded-2xl border-2 border-destructive/20">
                            <div>
                                <p className="text-[10px] font-black text-destructive/70 uppercase tracking-widest">Initial Isotonic Bolus (20 mL/kg)</p>
                                <p className="text-4xl font-black font-mono text-destructive">{fluidPlan.bolus.toFixed(0)} mL</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Recommended Fluid</p>
                                <p className="font-black text-lg">0.9% NS or LR</p>
                            </div>
                        </div>
                        <ul className="text-xs space-y-2 font-medium leading-relaxed pl-5 list-disc">
                            <li>Subtract bolus volume from total deficit if stabilization is achieved.</li>
                            <li>In <strong>Hypernatremia</strong>, intravascular volume is often preserved; if shocked, the total deficit is massive.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="phase2" className="border rounded-2xl overflow-hidden shadow-sm bg-background">
                    <AccordionTrigger className="px-6 hover:no-underline bg-primary/5 hover:bg-primary/10">
                        <div className="flex items-center gap-4 text-left">
                            <Badge className="h-8 w-8 rounded-full flex items-center justify-center p-0 font-black">2</Badge>
                            <div>
                                <p className="font-black uppercase tracking-tighter text-primary">Phase 2 & 3: Deficit + Maintenance</p>
                                <p className="text-xs text-muted-foreground font-medium">Gradual correction over {fluidPlan.correctionTime}h</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 space-y-8">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border-2 border-primary/20 shadow-sm relative overflow-hidden">
                                <CardHeader className="pb-1 pt-4 px-4">
                                    <Badge className="w-fit bg-primary uppercase text-[9px] font-black">{fluidPlan.phase1Label}</Badge>
                                </CardHeader>
                                <CardContent className="px-4 pb-4 pt-2">
                                    <p className="text-3xl font-black font-mono text-primary">
                                        {((fluidPlan.deficit * 0.5 + (fluidPlan.maintenance * (fluidPlan.state === "hyper" ? 24 : 8))) / (fluidPlan.state === "hyper" ? 24 : 8)).toFixed(1)} 
                                        <span className="text-sm font-bold ml-1 opacity-60">mL/hr</span>
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-muted shadow-sm relative overflow-hidden">
                                <CardHeader className="pb-1 pt-4 px-4">
                                    <Badge variant="secondary" className="w-fit uppercase text-[9px] font-black">{fluidPlan.phase2Label}</Badge>
                                </CardHeader>
                                <CardContent className="px-4 pb-4 pt-2">
                                    <p className="text-3xl font-black font-mono text-muted-foreground">
                                        {((fluidPlan.deficit * 0.5 + (fluidPlan.maintenance * (fluidPlan.correctionTime - (fluidPlan.state === "hyper" ? 24 : 8)))) / (fluidPlan.correctionTime - (fluidPlan.state === "hyper" ? 24 : 8))).toFixed(1)}
                                        <span className="text-sm font-bold ml-1 opacity-60">mL/hr</span>
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl border bg-muted/20">
                                <div className="flex items-center gap-2 mb-2 text-primary font-black text-[10px] uppercase">
                                    <FlaskConical className="h-3 w-3" /> Recommended Fluid
                                </div>
                                <p className="font-black text-xs">{fluidPlan.recommendedFluid}</p>
                            </div>
                            <div className="p-4 rounded-xl border bg-muted/20">
                                <div className="flex items-center gap-2 mb-2 text-primary font-black text-[10px] uppercase">
                                    <Timer className="h-3 w-3" /> Correction Window
                                </div>
                                <p className="font-black text-xs">{fluidPlan.correctionTime} Hours</p>
                            </div>
                            <div className="p-4 rounded-xl border bg-muted/20">
                                <div className="flex items-center gap-2 mb-2 text-primary font-black text-[10px] uppercase">
                                    <ShieldAlert className="h-3 w-3" /> Max safe Drop
                                </div>
                                <p className="font-black text-xs">{fluidPlan.maxNaDrop24h}</p>
                            </div>
                        </div>

                        <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
                            <div className="flex items-center gap-2 mb-3 text-primary">
                                <Stethoscope className="h-4 w-4" />
                                <span className="text-xs font-black uppercase tracking-wider">Clinical Protocol: {fluidPlan.state === "hyper" ? "Hypernatremia" : "Hyponatremia"}</span>
                            </div>
                            <ul className="text-xs space-y-2 font-medium leading-relaxed">
                                {fluidPlan.state === "hyper" && (
                                    <>
                                        <li>• <strong>Gradient Approach:</strong> For Na &gt; 170, use 0.45% or 0.9% NS initially. Hypotonic fluids (0.225%) are only used in moderate cases (Na &lt; 157).</li>
                                        <li>• <strong>Seizures during correction:</strong> Usually indicate cerebral edema from a rapid drop. Treat with <strong>3% Hypertonic Saline (3-5 mL/kg)</strong> to acutely raise sodium.</li>
                                        <li>• <strong>Target Fall:</strong> Aim for a steady reduction of 0.4 - 0.5 mEq/L per hour.</li>
                                    </>
                                )}
                                {fluidPlan.state === "hypo" && (
                                    <>
                                        <li>• <strong>ODS Risk:</strong> Avoid correcting &gt; 10 mEq/L in 24h for chronic hyponatremia.</li>
                                        <li>• <strong>Bolus:</strong> 3% Saline is ONLY for symptomatic (seizing/coma) hyponatremia.</li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="resources" className="border rounded-2xl overflow-hidden shadow-sm bg-background">
                    <AccordionTrigger className="px-6 hover:no-underline bg-muted/30 hover:bg-muted/50">
                        <div className="flex items-center gap-4 text-left">
                            <Badge variant="outline" className="h-8 w-8 rounded-full flex items-center justify-center p-0 font-black border-2 border-muted-foreground text-muted-foreground">
                                <BookOpen className="h-4 w-4" />
                            </Badge>
                            <div>
                                <p className="font-black uppercase tracking-tighter text-muted-foreground">Medical Resources & Citations</p>
                                <p className="text-xs text-muted-foreground font-medium">Evidence base for these protocols</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 space-y-4">
                        <div className="space-y-4 text-xs">
                            <div className="p-3 border-l-4 border-primary bg-muted/20">
                                <p className="font-bold text-primary mb-1">RCH Melbourne (2024)</p>
                                <p className="italic text-muted-foreground">"Hypernatraemia: Clinical Management." Recommended for correction windows of 48-96h for Na &gt; 170.</p>
                            </div>
                            <div className="p-3 border-l-4 border-primary bg-muted/20">
                                <p className="font-bold text-primary mb-1">AAP Pediatrics in Review (2023)</p>
                                <p className="italic text-muted-foreground">"Maintenance Fluids and Dehydration in Children." Guideline for 4-2-1 rule and phase-based correction.</p>
                            </div>
                            <div className="p-3 border-l-4 border-primary bg-muted/20">
                                <p className="font-bold text-primary mb-1">KDIGO 2024 / Harriet Lane Handbook</p>
                                <p className="italic text-muted-foreground">Standard for safe sodium correction rates (&lt; 0.5 mEq/hr) to avoid ODS and cerebral edema.</p>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-4 border-dashed rounded-[40px] p-12 text-center bg-muted/20 border-muted/30">
              <Droplets className="h-16 w-16 text-primary/20 mb-6" />
              <h3 className="text-2xl font-black text-muted-foreground/80 tracking-tight">Clinical Logic Engine Ready</h3>
              <p className="text-muted-foreground font-medium text-sm mt-3 leading-relaxed max-w-[320px]">
                Enter weight, dehydration, and sodium to generate a precision multi-phase IV fluid protocol.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
