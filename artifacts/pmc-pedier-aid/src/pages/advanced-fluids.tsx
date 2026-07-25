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
  // Applies to iso/hypo states only — hypernatremia's multi-day gradient schedule is
  // medically mandated by osmotic-demyelination/cerebral-oedema risk, not a matter of
  // school-of-thought preference, so it isn't user-selectable.
  const [replacementStrategy, setReplacementStrategy] = useState<"split" | "uniform">("uniform");

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
    let phase1Label = "Phase 2: First 8 Hours (Split Method)";
    let phase2Label = "Phase 3: Next 16 Hours (Split Method)";
    let maxNaDrop24h = "N/A";
    let recommendedFluid = "0.9% NS or LR ± 5% Dextrose";
    let phase1Hours = 8;
    let phase2Hours = 16;
    // Split: 50% of deficit in phase 1, 50% in phase 2, maintenance runs throughout both.
    // Uniform: 100% of deficit spread evenly across the full 24h alongside maintenance —
    // a single continuous rate, so phase2Hours is 0 (no second phase to show).
    let deficitFractionPhase1 = 0.5;

    if (state === "hyper") {
        // --- GRADIENT CORRECTION LOGIC ---
        // Not user-selectable: correction speed here is capped by osmotic-demyelination/
        // cerebral-oedema risk, not a matter of split-vs-uniform preference.
        // Tiers per Nelson Textbook of Pediatrics, Ch. 75 "Deficit Therapy", Fig. 75.1
        // (sourced from Nelson Essentials of Pediatrics, 9th ed., 2023, Fig. 33.1) — these
        // check out arithmetically against the <10 mEq/L/24h limit (e.g. Na 155 needs only
        // ~24h to reach ~145; a 48h minimum for that case doesn't follow from that limit).
        if (naNum > 183) {
            correctionTime = 84; // Na 184-196+ mEq/L
        } else if (naNum > 170) {
            correctionTime = 72; // Na 171-183 mEq/L
        } else if (naNum > 157) {
            correctionTime = 48; // Na 158-170 mEq/L
        } else {
            correctionTime = 24; // Na 145-157 mEq/L
        }
        // Nelson: no fixed prescription by severity — start with ONE typical fluid at a
        // constant rate, then titrate the tonicity/rate against the observed Na trend
        // (see the Monitoring & Titration panel below for the actual follow-up steps).
        recommendedFluid = "D5 0.45% NS (D5 ½NS) + 20 mEq/L KCl once voiding — starting point, titrate below";
        maxNaDrop24h = "< 10 mEq/L per 24 hours";

        // Single continuous rate for the whole correction window — a 24h-then-remaining
        // split would compute to the identical rate in both phases anyway (deficit/
        // correctionTime + maintenance either way), so showing two "phases" would falsely
        // imply something changes partway through. The rate itself is then adjusted at the
        // bedside per the titration algorithm, not by a second pre-calculated phase.
        phase1Hours = correctionTime;
        phase2Hours = 0;
        deficitFractionPhase1 = 1.0;
        phase1Label = `Starting Rate — Uniform (${correctionTime} Hours)`;
        phase2Label = "";
    } else {
        // Iso/hypo: 24h total, user chooses split (traditional) vs uniform (current
        // mainstream default — NICE NG29, RCH Melbourne) replacement strategy.
        if (replacementStrategy === "uniform") {
            phase1Hours = 24;
            phase2Hours = 0;
            deficitFractionPhase1 = 1.0;
            phase1Label = "Uniform Replacement (24 Hours)";
            phase2Label = "";
        } else {
            phase1Hours = 8;
            phase2Hours = 16;
            deficitFractionPhase1 = 0.5;
            phase1Label = "Phase 2: First 8 Hours (Split Method)";
            phase2Label = "Phase 3: Next 16 Hours (Split Method)";
        }
    }

    if (state === "hypo") {
        maxNaDrop24h = "8 - 10 mEq/L (to avoid ODS)";
        recommendedFluid = "0.9% NS";
    }

    const phase1Rate = (deficit * deficitFractionPhase1 + maintenance * phase1Hours) / phase1Hours;
    const phase2Rate = phase2Hours > 0
      ? (deficit * (1 - deficitFractionPhase1) + maintenance * phase2Hours) / phase2Hours
      : null;

    return {
      maintenance,
      deficit,
      state,
      correctionTime,
      phase1Label,
      phase2Label,
      phase1Hours,
      phase2Hours,
      phase1Rate,
      phase2Rate,
      maxNaDrop24h,
      recommendedFluid,
      totalNaDeficit: state === "hypo" ? calculateSodiumDeficit(wNum, naNum) : 0,
      freeWaterDeficit: state === "hyper" ? calculateFreeWaterDeficit(wNum, naNum) : 0,
      bolus: wNum * 20,
      hypertonicBolus: wNum * 3 // 3 mL/kg
    };
  }, [wNum, dNum, naNum, isValid, replacementStrategy]);

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

              {fluidPlan.state === "hyper" && naNum > 183 && (
                  <Alert className="bg-red-600 text-white border-none shadow-lg">
                      <ShieldAlert className="h-6 w-6" />
                      <AlertTitle className="font-black uppercase tracking-tighter text-lg">Extreme Hypernatremia (Na &gt; 183)</AlertTitle>
                      <AlertDescription className="font-bold">
                          URGENT: Correction MUST be extremely slow (over <strong>{fluidPlan.correctionTime} hours</strong> — see the Monitoring &amp; Titration panel below). Target drop <strong>{fluidPlan.maxNaDrop24h}</strong>.
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

                        {fluidPlan.state !== "hyper" && (
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Deficit Replacement Strategy</p>
                                <div className="flex rounded-xl border-2 border-primary/10 bg-muted/20 p-1 gap-1">
                                    <button
                                        onClick={() => setReplacementStrategy("uniform")}
                                        className={cn(
                                            "flex-1 py-2 rounded-lg text-xs font-black transition-all",
                                            replacementStrategy === "uniform" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:bg-muted/40"
                                        )}
                                    >
                                        Uniform (24h) — current default
                                    </button>
                                    <button
                                        onClick={() => setReplacementStrategy("split")}
                                        className={cn(
                                            "flex-1 py-2 rounded-lg text-xs font-black transition-all",
                                            replacementStrategy === "split" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:bg-muted/40"
                                        )}
                                    >
                                        Split (8h + 16h) — traditional
                                    </button>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                    Both are clinically acceptable when isotonic fluid is used throughout. Many current protocols
                                    (NICE NG29, RCH Melbourne) now default to a uniform 24h rate since there's no longer an
                                    osmotic reason to front-load the deficit into the first 8 hours — but the traditional 8h/16h
                                    split is still taught and still safe. Use whichever your unit's protocol specifies.
                                </p>
                            </div>
                        )}

                        <div className={cn("grid grid-cols-1 gap-4", fluidPlan.phase2Rate !== null && "md:grid-cols-2")}>
                            <Card className="border-2 border-primary/20 shadow-sm relative overflow-hidden">
                                <CardHeader className="pb-1 pt-4 px-4">
                                    <Badge className="w-fit bg-primary uppercase text-[9px] font-black">{fluidPlan.phase1Label}</Badge>
                                </CardHeader>
                                <CardContent className="px-4 pb-4 pt-2">
                                    <p className="text-3xl font-black font-mono text-primary">
                                        {fluidPlan.phase1Rate.toFixed(1)}
                                        <span className="text-sm font-bold ml-1 opacity-60">mL/hr</span>
                                    </p>
                                </CardContent>
                            </Card>

                            {fluidPlan.phase2Rate !== null && (
                                <Card className="border-2 border-muted shadow-sm relative overflow-hidden">
                                    <CardHeader className="pb-1 pt-4 px-4">
                                        <Badge variant="secondary" className="w-fit uppercase text-[9px] font-black">{fluidPlan.phase2Label}</Badge>
                                    </CardHeader>
                                    <CardContent className="px-4 pb-4 pt-2">
                                        <p className="text-3xl font-black font-mono text-muted-foreground">
                                            {fluidPlan.phase2Rate.toFixed(1)}
                                            <span className="text-sm font-bold ml-1 opacity-60">mL/hr</span>
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
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
                                <span className="text-xs font-black uppercase tracking-wider">Clinical Protocol: {fluidPlan.state === "hyper" ? "Hypernatremia" : fluidPlan.state === "hypo" ? "Hyponatremia" : "Isonatremic Dehydration"}</span>
                            </div>
                            <ul className="text-xs space-y-2 font-medium leading-relaxed">
                                {fluidPlan.state === "iso" && (
                                    <>
                                        <li>• <strong>Isotonic Fluids Only:</strong> Use 0.9% NS or Lactated Ringer's. Hypotonic fluids (½ NS, ¼ NS) are no longer recommended — they cause iatrogenic hyponatremia in hospitalised children. <span className="text-primary font-bold">(NICE 2015, AAP 2018)</span></li>
                                        <li>• <strong>Dextrose:</strong> Add 5% dextrose if at risk of hypoglycaemia (infants, prolonged poor oral intake, or low maintenance rate).</li>
                                        <li>• <strong>Potassium:</strong> Add 10–20 mEq/L KCl once urine output is confirmed.</li>
                                        <li>• <strong>Replacement strategy:</strong> Set to {replacementStrategy === "uniform" ? "uniform (deficit spread evenly across 24h)" : "split (50% of deficit over 8h, 50% over 16h)"} above — change it to match your unit's protocol.</li>
                                        <li>• <strong>Reassess:</strong> Recheck serum electrolytes after 4–6 hours of IV therapy.</li>
                                    </>
                                )}
                                {fluidPlan.state === "hyper" && (
                                    <>
                                        <li>• <strong>Correction time by severity (Nelson, Ch. 75, Fig. 75.1):</strong> Na 145–157 → 24h · 158–170 → 48h · 171–183 → 72h · 184+ → 84h. This case ({naNum} mEq/L) needs <strong>{fluidPlan.correctionTime}h</strong>.</li>
                                        <li>• <strong>Starting fluid:</strong> One typical fluid regardless of severity — D5 0.45% NS + 20 mEq/L KCl (once voiding) at ~1.25–1.5× maintenance. There is no separate fluid chosen per severity tier; the tonicity is titrated afterward (see below).</li>
                                        <li>• <strong>Seizures during correction:</strong> Usually indicate cerebral edema from a rapid drop. Treat with <strong>3% Hypertonic Saline (3-5 mL/kg)</strong> to acutely raise sodium.</li>
                                        <li>• <strong>Target Fall:</strong> {fluidPlan.maxNaDrop24h}.</li>
                                    </>
                                )}
                                {fluidPlan.state === "hypo" && (
                                    <>
                                        <li>• <strong>ODS Risk:</strong> Avoid correcting &gt; 10 mEq/L in 24h for chronic hyponatremia.</li>
                                        <li>• <strong>Bolus:</strong> 3% Saline is ONLY for symptomatic (seizing/coma) hyponatremia.</li>
                                        <li>• <strong>Replacement strategy:</strong> Set to {replacementStrategy === "uniform" ? "uniform (deficit spread evenly across 24h)" : "split (50% of deficit over 8h, 50% over 16h)"} above, same free-water-and-deficit logic as isonatremic dehydration once the sodium deficit itself is accounted for.</li>
                                    </>
                                )}
                            </ul>
                        </div>

                        {fluidPlan.state === "hyper" && (
                            <div className="bg-sky-50 rounded-2xl p-5 border-2 border-sky-200">
                                <div className="flex items-center gap-2 mb-3 text-sky-800">
                                    <History className="h-4 w-4" />
                                    <span className="text-xs font-black uppercase tracking-wider">Monitoring &amp; Titration Protocol</span>
                                </div>
                                <p className="text-xs font-bold text-sky-900 mb-4">
                                    Recheck serum Na⁺ (and K⁺) every <strong>4–6 hours</strong> while actively correcting — every 2 hours if the trend is unclear or the patient is unstable. Nelson: "there is no general agreement on the choice or rate of fluid... vigilant monitoring and adjustment of therapy according to the result" matters more than the starting prescription.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl border-2 border-red-200 bg-red-50">
                                        <p className="text-[10px] font-black uppercase text-red-700 mb-1">Na dropping too fast (&gt; ~0.4 mEq/L/hr)</p>
                                        <p className="text-xs font-medium text-red-900">Increase the Na concentration of the IV fluid (shift toward D5 0.9% NS) <strong>or</strong> decrease the infusion rate.</p>
                                    </div>
                                    <div className="p-3 rounded-xl border-2 border-amber-200 bg-amber-50">
                                        <p className="text-[10px] font-black uppercase text-amber-700 mb-1">Na dropping too slowly</p>
                                        <p className="text-xs font-medium text-amber-900">Decrease the Na concentration of the IV fluid (shift toward a more hypotonic fluid, e.g. D5 0.2% NS) <strong>or</strong> increase the infusion rate.</p>
                                    </div>
                                    <div className="p-3 rounded-xl border-2 border-destructive/30 bg-destructive/5">
                                        <p className="text-[10px] font-black uppercase text-destructive mb-1">Signs of volume depletion / shock</p>
                                        <p className="text-xs font-medium">Give an additional isotonic NS bolus (20 mL/kg) — separate from the deficit/maintenance rate above.</p>
                                    </div>
                                    <div className="p-3 rounded-xl border-2 border-muted bg-muted/20">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Ongoing excessive losses (diarrhoea, DI polyuria)</p>
                                        <p className="text-xs font-medium">Replace separately as they occur — do not fold these into the deficit/maintenance calculation above.</p>
                                    </div>
                                </div>
                                <p className="text-[11px] text-sky-800 mt-4 flex items-start gap-2">
                                    <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                    Practical tip: keep two bags at the bedside (e.g. D5 0.45% NS and D5 0.9% NS) so the blended tonicity can be adjusted by changing each bag's relative rate, without waiting on a new fluid order.
                                </p>
                            </div>
                        )}
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
                            <div className="p-3 border-l-4 border-emerald-500 bg-emerald-50/50">
                                <p className="font-bold text-emerald-700 mb-1">NICE Guideline NG29 (2015) — KEY</p>
                                <p className="italic text-muted-foreground">"IV fluid therapy in children and young people in hospital." Mandates isotonic solutions (Na 131–154 mmol/L) for maintenance. Hypotonic fluids (½ NS, ¼ NS) are contraindicated for routine use due to risk of iatrogenic hyponatremia.</p>
                            </div>
                            <div className="p-3 border-l-4 border-emerald-500 bg-emerald-50/50">
                                <p className="font-bold text-emerald-700 mb-1">AAP Clinical Report (2018) — KEY</p>
                                <p className="italic text-muted-foreground">Friedman JN et al. "Choosing the Right Intravenous Fluid." Pediatrics 2018. Recommends isotonic crystalloid (0.9% NaCl or LR) for IV maintenance in most hospitalised children. Formally replaced older hypotonic maintenance fluid practice.</p>
                            </div>
                            <div className="p-3 border-l-4 border-emerald-500 bg-emerald-50/50">
                                <p className="font-bold text-emerald-700 mb-1">Nelson Textbook of Pediatrics — KEY</p>
                                <p className="italic text-muted-foreground">Ch. 75 "Deficit Therapy": Table 75.2 (uniform 24h deficit+maintenance replacement for iso/hyponatremic dehydration) and Fig. 75.1 (from Londeree JT, Greenbaum LA. Nelson Essentials of Pediatrics, 9th ed., 2023, Fig. 33.1) for hypernatremia correction-time tiers by Na level, the single starting fluid (D5 ½NS + KCl at 1.25–1.5× maintenance), the &lt; 10 mEq/L/24h universal drop limit, and the monitor-and-titrate follow-up algorithm.</p>
                            </div>
                            <div className="p-3 border-l-4 border-emerald-500 bg-emerald-50/50">
                                <p className="font-bold text-emerald-700 mb-1">Nelson Textbook of Pediatrics (Ch. 75, Table 75.2)</p>
                                <p className="italic text-muted-foreground">Source for uniform 24h deficit+maintenance replacement in iso/hyponatremic dehydration (the default Replacement Strategy above). Its own hypernatremia correction-time tiers (Fig. 75.1) are noted but not used here — this tool keeps the RCH Melbourne/KDIGO tiers above.</p>
                            </div>
                            <div className="p-3 border-l-4 border-primary bg-muted/20">
                                <p className="font-bold text-primary mb-1">AAP Pediatrics in Review (2023)</p>
                                <p className="italic text-muted-foreground">"Maintenance Fluids and Dehydration in Children." Guideline for 4-2-1 rule and phase-based correction.</p>
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
