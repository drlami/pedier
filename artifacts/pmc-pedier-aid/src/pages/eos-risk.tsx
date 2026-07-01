import { useState, useMemo } from "react";
import { 
  ShieldAlert, Calculator, Info, 
  ArrowLeft, CheckCircle2, AlertTriangle, Activity, Stethoscope, Thermometer, Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function EosRiskCalc() {
  const [gaWeeks, setGaWeeks] = useState<string>("");
  const [gaDays, setGaDays] = useState<string>("0");
  const [maternalTemp, setMaternalTemp] = useState<string>("");
  const [romDuration, setRomDuration] = useState<string>("");
  const [maternalGbs, setMaternalGbs] = useState<string>("");
  const [antibiotics, setAntibiotics] = useState<string>("");
  const [clinicalStatus, setClinicalStatus] = useState<string>("");

  const gaExact = useMemo(() => {
    const w = parseFloat(gaWeeks);
    const d = parseFloat(gaDays);
    if (isNaN(w)) return NaN;
    return w + (isNaN(d) ? 0 : d) / 7;
  }, [gaWeeks, gaDays]);

  const isGaBelowValidatedRange = !isNaN(gaExact) && gaExact < 34;

  const riskResult = useMemo(() => {
    const temp = parseFloat(maternalTemp);
    const rom = parseFloat(romDuration);

    if (
      isNaN(gaExact) || gaExact < 34 || gaExact > 45 ||
      isNaN(temp) || temp < 30 || temp > 43 ||
      isNaN(rom) || rom < 0 || rom > 500 ||
      !maternalGbs || !clinicalStatus || !antibiotics
    ) return null;

    // BASELINE INCIDENCE (standard is ~0.5 per 1000 live births at ≥34 wks GA)
    let priorRisk = 0.5;

    // GA ADJUSTMENT (risk increases as GA decreases) — uses exact GA (weeks + days)
    if (gaExact < 37) priorRisk *= 2.5;
    if (gaExact < 35) priorRisk *= 2.0;

    // MATERNAL TEMP ADJUSTMENT
    if (temp >= 38.0 && temp < 38.5) priorRisk *= 2.5;
    if (temp >= 38.5 && temp < 39.0) priorRisk *= 4.0;
    if (temp >= 39.0) priorRisk *= 7.0;

    // ROM ADJUSTMENT
    if (rom >= 18 && rom < 24) priorRisk *= 1.5;
    if (rom >= 24) priorRisk *= 2.2;

    // GBS ADJUSTMENT
    // "Unknown" is treated conservatively (no negative culture for reassurance),
    // consistent with the CDC risk-factor-based approach when status can't be confirmed.
    if (maternalGbs === "positive") priorRisk *= 1.2;
    if (maternalGbs === "unknown") priorRisk *= 1.3;
    if (maternalGbs === "negative" && antibiotics === "none") priorRisk *= 0.8;

    // ANTIBIOTIC ADJUSTMENT (IAP)
    if (antibiotics === "broad") priorRisk *= 0.3;
    if (antibiotics === "gbs") priorRisk *= 0.5;
    if (antibiotics === "inadequate") priorRisk *= 0.75;

    // POSTERIOR RISK (Based on Neonatal Status)
    let posteriorRisk = priorRisk;
    if (clinicalStatus === "equivocal") posteriorRisk *= 3.5;
    if (clinicalStatus === "ill") posteriorRisk *= 12.0;
    if (clinicalStatus === "well") posteriorRisk *= 0.4;

    return {
      prior: priorRisk,
      posterior: posteriorRisk
    };
  }, [gaExact, maternalTemp, romDuration, maternalGbs, antibiotics, clinicalStatus]);

  const management = useMemo(() => {
    if (!riskResult) return null;
    const p = riskResult.posterior;
    
    if (clinicalStatus === "ill") {
      return {
        label: "Evaluate & Treat (III)",
        color: "text-red-600",
        bg: "bg-red-50",
        plan: [
          "Start Empiric Antibiotics immediately.",
          "Obtain Blood Culture.",
          "Obtain CBC, CRP, and consider LP if stable.",
          "Continuous vital sign monitoring in NICU/HDU."
        ]
      };
    }

    if (p >= 3.0) {
      return {
        label: "Evaluate & Treat",
        color: "text-red-600",
        bg: "bg-red-50",
        plan: [
          "Start Empiric Antibiotics.",
          "Obtain Blood Culture.",
          "Frequent vital signs (at least every 4 hours)."
        ]
      };
    }

    if (p >= 1.0) {
      return {
        label: "Blood Culture & Obs",
        color: "text-amber-600",
        bg: "bg-amber-50",
        plan: [
          "Obtain Blood Culture.",
          "Monitor vitals every 4 hours for 24 hours.",
          "No empiric antibiotics unless clinical status worsens."
        ]
      };
    }

    if (riskResult.prior >= 1.0 && clinicalStatus === "well") {
        return {
          label: "Enhanced Observation",
          color: "text-blue-600",
          bg: "bg-blue-50",
          plan: [
            "Monitor vitals every 4 hours for 24 hours.",
            "Continue routine newborn care.",
            "No culture or antibiotics required."
          ]
        };
    }

    return {
      label: "Routine Care",
      color: "text-green-600",
      bg: "bg-green-50",
      plan: [
        "Standard newborn observation.",
        "Routine vital signs as per hospital policy.",
        "No further intervention required."
      ]
    };
  }, [riskResult, clinicalStatus]);

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 pb-32">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 rounded-3xl bg-red-600 text-white shadow-xl shadow-red-100">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tight">EOS Risk Calculator</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest mt-1">Early-Onset Sepsis (Kaiser-Informed Approximation · $\ge$34 Weeks)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-2 shadow-sm">
            <CardHeader className="bg-muted/20 border-b pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Maternal & Birth Factors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                    Gestational Age <Info className="h-3 w-3" />
                  </label>
                  <div className="flex gap-2">
                    <Input type="number" inputMode="decimal" placeholder="Wks" value={gaWeeks} onChange={(e) => setGaWeeks(e.target.value)} className="h-11 font-mono" />
                    <Input type="number" inputMode="decimal" placeholder="Days" value={gaDays} onChange={(e) => setGaDays(e.target.value)} className="h-11 font-mono" />
                  </div>
                  {isGaBelowValidatedRange && (
                    <p className="text-[9px] text-red-600 font-bold">⚠ Model validated only for ≥34 0/7 weeks GA — not applicable below this.</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                    Max Maternal Temp (°C) <Thermometer className="h-3 w-3" />
                  </label>
                  <Input type="number" step="0.1" placeholder="e.g. 38.2" value={maternalTemp} onChange={(e) => setMaternalTemp(e.target.value)} className="h-11 font-mono" />
                  <p className="text-[9px] text-muted-foreground italic">Highest temperature during labor</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                  ROM Duration (Hours) <Clock className="h-3 w-3" />
                </label>
                <Input type="number" inputMode="decimal" placeholder="e.g. 14" value={romDuration} onChange={(e) => setRomDuration(e.target.value)} className="h-11 font-mono" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Maternal GBS Status</label>
                <Select value={maternalGbs} onValueChange={setMaternalGbs}>
                  <SelectTrigger className="h-11 font-bold">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="negative" className="font-bold">GBS Negative</SelectItem>
                    <SelectItem value="positive" className="font-bold text-red-600">GBS Positive</SelectItem>
                    <SelectItem value="unknown" className="font-bold">GBS Unknown</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[9px] text-muted-foreground italic">Unknown status is treated conservatively (no negative culture for reassurance).</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Intrapartum Antibiotics (IAP)</label>
                <Select value={antibiotics} onValueChange={setAntibiotics}>
                  <SelectTrigger className="h-11 font-bold">
                    <SelectValue placeholder="Select IAP Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None / No IAP</SelectItem>
                    <SelectItem value="inadequate">Any IAP {'<'} 4h before delivery (inadequate)</SelectItem>
                    <SelectItem value="gbs">GBS-Specific (Pen/Amp/Cefazolin {'≥'} 4h before)</SelectItem>
                    <SelectItem value="broad">Broad Spectrum ({'≥'} 4h before)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[9px] text-muted-foreground italic">Adequate IAP = penicillin, ampicillin, or cefazolin ≥4 h before delivery (CDC/AAP).</p>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <label className="text-[10px] font-black uppercase text-red-600 tracking-widest flex items-center gap-1 italic">
                  Neonatal Clinical Status <Stethoscope className="h-3 w-3" />
                </label>
                <Select value={clinicalStatus} onValueChange={setClinicalStatus}>
                  <SelectTrigger className="h-11 font-black border-red-200 bg-red-50/30">
                    <SelectValue placeholder="Categorize Newborn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="well" className="font-bold">Well-Appearing</SelectItem>
                    <SelectItem value="equivocal" className="font-bold">Equivocal (Mild findings)</SelectItem>
                    <SelectItem value="ill" className="font-bold text-red-600 underline">Clinically Ill (Overt Sepsis)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
            {riskResult && management ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Card className="border-2 border-slate-200 bg-slate-50 shadow-sm cursor-help">
                              <CardContent className="pt-4 pb-4 text-center">
                                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-1">Prior Risk</span>
                                  <CardTitle className="text-3xl font-black font-mono text-slate-700">
                                      {riskResult.prior.toFixed(2)}
                                  </CardTitle>
                                  <span className="text-[9px] font-bold text-muted-foreground uppercase">per 1000 births</span>
                              </CardContent>
                          </Card>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 text-white p-3 max-w-[200px] text-[10px] font-bold">
                          Risk based ONLY on maternal factors and delivery before considering baby's appearance.
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Card className={cn("border-2 shadow-md transition-colors",
                              clinicalStatus === "ill" || riskResult.posterior >= 3.0 ? "border-red-500 bg-red-50" :
                              riskResult.posterior >= 1.0 ? "border-amber-500 bg-amber-50" : "border-emerald-500 bg-emerald-50")}>
                              <CardContent className="pt-4 pb-4 text-center">
                                  <span className="text-[10px] font-black uppercase tracking-widest block mb-1">Posterior Risk</span>
                                  <CardTitle className="text-4xl font-black font-mono text-slate-800">
                                      {riskResult.posterior.toFixed(2)}
                                  </CardTitle>
                                  <span className="text-[9px] font-bold opacity-60 uppercase">Calculated score</span>
                              </CardContent>
                          </Card>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 text-white p-3 max-w-[200px] text-[10px] font-bold">
                          The FINAL risk score incorporating the baby's clinical presentation. Use this for management.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <Card className={cn("border-2 shadow-xl overflow-hidden", 
                      management.label.includes("Treat") ? "border-red-600" : "border-slate-800")}>
                      <CardHeader className={cn("border-b pb-4 text-center", management.bg)}>
                          <Badge className="mx-auto mb-2 bg-slate-800 font-black uppercase">Clinical Recommendation</Badge>
                          <CardTitle className={cn("text-2xl font-black tracking-tight", management.color)}>
                              {management.label}
                          </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6 pb-6">
                          <div className="space-y-4">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recommended Management Plan:</h4>
                              <div className="space-y-3">
                                  {management.plan.map((step, i) => (
                                      <div key={i} className="flex gap-3 items-start">
                                          <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black", management.bg, management.color)}>
                                              {i + 1}
                                          </div>
                                          <p className="text-sm font-semibold text-slate-700 leading-tight">{step}</p>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-muted/30 border-dashed border-2">
                        <CardContent className="pt-4 text-[10px] leading-relaxed">
                            <h5 className="font-black uppercase tracking-widest mb-2 flex items-center gap-1">
                                <Info className="h-3 w-3" /> Definitions
                            </h5>
                            <ul className="space-y-2 text-muted-foreground font-medium">
                                <li>• <strong>Equivocal:</strong> Persistent physiologic abnormalities (Tachycardia $\ge$160, Tachypnea $\ge$60, Temp instability) lasting $\ge$2h.</li>
                                <li>• <strong>Clinically Ill:</strong> Hemodynamic instability, Seizures, Need for mechanical ventilation/CPAP.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/30 border-dashed border-2">
                        <CardContent className="pt-4 text-[10px] leading-relaxed">
                            <h5 className="font-black uppercase tracking-widest mb-2 flex items-center gap-1 text-blue-600">
                                <Activity className="h-3 w-3" /> Thresholds
                            </h5>
                            <ul className="space-y-1 text-muted-foreground font-medium">
                                <li>• <strong>{'<'} 1.0:</strong> Routine Care</li>
                                <li>• <strong>1.0 - 3.0:</strong> Blood Culture & Obs</li>
                                <li>• <strong>$\ge$ 3.0:</strong> Evaluate & Treat</li>
                            </ul>
                        </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-slate-50 border-2 border-slate-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                            <Info className="h-3.5 w-3.5" /> Clinical Evidence & References
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-2">
                        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                            <p className="text-[11px] font-bold text-slate-800 uppercase">The 18-Hour ROM Shift</p>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">
                                Traditionally (per CDC 2010), <strong>ROM {'>'} 18 hours</strong> was a hard categorical threshold for evaluation.
                                The <strong>AAP 2018 Clinical Report</strong> instead endorsed the Kaiser Multivariate Model, whose actual regression
                                equation treats ROM, GA, and maternal temperature as <strong>continuous variables</strong>. This calculator approximates
                                that relationship using literature-informed risk bands rather than the exact published regression coefficients — for the
                                fully validated calculation, use Kaiser Permanente's official Neonatal Early-Onset Sepsis Calculator.
                            </p>
                        </div>
                        
                        <div className="space-y-2">
                            <p className="text-[9px] font-black uppercase text-muted-foreground tracking-tighter">Primary Sources:</p>
                            <ul className="text-[10px] space-y-2 font-medium text-slate-600">
                                <li className="flex gap-2">
                                    <div className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                                    <span><strong>AAP (2018):</strong> Management of Neonates Born at $\ge$35 Weeks’ Gestation With Suspected or Proven Early-Onset Bacterial Sepsis. <i>Pediatrics.</i></span>
                                </li>
                                <li className="flex gap-2">
                                    <div className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                                    <span><strong>Puopolo KM, et al. (2011):</strong> Estimating the Probability of Neonatal Early-Onset Infection. <i>Pediatrics.</i></span>
                                </li>
                                <li className="flex gap-2">
                                    <div className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                                    <span><strong>CDC/AAP (2010):</strong> Prevention of Perinatal Group B Streptococcal Disease.</span>
                                </li>
                            </ul>
                        </div>
                      </CardContent>
                  </Card>
                </>
            ) : isGaBelowValidatedRange ? (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-4 border-dashed rounded-[40px] p-12 text-center bg-red-50 border-red-200">
                    <ShieldAlert className="h-20 w-20 text-red-300 mb-8" />
                    <h3 className="text-2xl font-black text-red-700 tracking-tight">Outside Validated Range</h3>
                    <p className="text-red-700/80 font-medium text-base mt-4 leading-relaxed max-w-[380px]">
                      This model is validated only for infants born ≥34 0/7 weeks gestation. For more premature infants, use local NICU sepsis protocols instead.
                    </p>
                </div>
            ) : (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-4 border-dashed rounded-[40px] p-12 text-center bg-muted/20 border-muted/30">
                    <Activity className="h-20 w-20 text-muted-foreground/20 mb-8" />
                    <h3 className="text-2xl font-black text-muted-foreground/80 tracking-tight">Risk Assessment Data Required</h3>
                    <p className="text-muted-foreground font-medium text-base mt-4 leading-relaxed max-w-[340px]">
                      Enter the maternal risk factors and delivery details to generate the EOS Prior Risk and management recommendations.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
