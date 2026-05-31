'use client';

import { useState, useMemo } from "react";
import { 
  ArrowLeft, Scale, Calculator, Info, Activity, 
  AlertCircle, ChevronRight, Printer, CheckCircle2, 
  Clock, Pill, Droplets, Calendar, ShieldCheck,
  TrendingDown, ListChecks, ArrowDownCircle, Beaker,
  History, Stethoscope, AlertTriangle, Syringe
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

// --- Clinical Logic Definitions ---

const TAPER_TEMPLATES = [
  { 
    id: "nephrotic", 
    name: "Nephrotic Syndrome (KDIGO/ISPN)", 
    icon: Stethoscope, 
    desc: "Standard 8-12 week protocol for Steroid Sensitive Nephrotic Syndrome (SSNS).",
    criteria: [
      "First Episode: Use after completing 4-6 weeks of 2mg/kg daily dose.",
      "Infrequent Relapse: Use after achieving remission (urine trace/neg for 3 days).",
      "Goal: Prevents relapse while minimizing cumulative steroid toxicity."
    ]
  },
  { 
    id: "short-burst", 
    name: "Post-Acute Burst (>14 Days)", 
    icon: Activity, 
    desc: "Rapid wean for short high-dose courses that exceeded 14 days.",
    criteria: [
      "Asthma/Croup: If course lasted > 14 days or patient has had 3+ bursts in a year.",
      "Prevention: Specifically designed to avoid acute adrenal insufficiency.",
      "Rule: Abrupt stop is safe if course < 14 days; tapering is mandatory if > 14 days."
    ]
  },
  { 
    id: "chronic-slow", 
    name: "Chronic Maintenance (Adrenal Axis Protection)", 
    icon: TrendingDown, 
    desc: "Slow conservative wean for long-term (> 4 weeks) high-dose therapy.",
    criteria: [
      "Clinical Goal: Prevents 'Steroid Withdrawal Syndrome' (fatigue, joint pain, nausea).",
      "Threshold: Use if patient has been on steroids for > 1 month.",
      "Logic: Aim to reach physiological floor (5-7 mg/m²) before alternate day switch."
    ]
  },
  { 
    id: "rheum-jia", 
    name: "Rheumatology (JIA/SLE)", 
    icon: ShieldCheck, 
    desc: "Slow 10% biweekly reduction for autoimmune disease in remission.",
    criteria: [
      "Condition: Stable JIA, SLE, or Vasculitis already started on DMARDs/Biologics.",
      "Goal: Treat-to-target. Aim to be off OCS within 3 months of biologic success.",
      "Flare Watch: Requires monthly physician review of joint/skin symptoms."
    ]
  },
];

interface TaperPhase {
  id: number;
  label: string;
  subLabel: string;
  instructions: string[];
  duration: string;
  mg: string;
  ml: string;
  frequency: string;
  isCritical?: boolean;
}

export default function TaperingCalculatorPage() {
  const [template, setTemplate] = useState<string>("nephrotic");
  const [weight, setWeight] = useState<string>("");
  const [concMg, setConcMg] = useState<string>("5");
  const [concMl, setConcMl] = useState<string>("5");
  const [startMg, setStartMg] = useState<string>("");
  const [startFreq, setStartFreq] = useState<string>("2"); // TID=3, BID=2, QD=1
  
  const roadmap = useMemo(() => {
    const w = parseFloat(weight);
    const sMg = parseFloat(startMg);
    const cMg = parseFloat(concMg);
    const cMl = parseFloat(concMl);
    const sFreq = parseInt(startFreq);

    if (isNaN(cMg) || isNaN(cMl) || cMg === 0) return null;

    const schedule: TaperPhase[] = [];
    const getMl = (mg: number) => ((mg * cMl) / cMg).toFixed(1);
    let phaseId = 1;

    // --- TEMPLATE 1: NEPHROTIC SYNDROME ---
    if (template === "nephrotic") {
      if (isNaN(w) || w <= 0) return null;
      
      const dailyMg = Math.min(w * 2, 60);
      schedule.push({
        id: phaseId++,
        label: "Phase 1: Remission Induction",
        subLabel: "Daily morning dose",
        instructions: ["Continue until urine is trace/negative for 3 consecutive days.", "Maintain for at least 4 weeks total."],
        duration: "4 Weeks",
        mg: dailyMg.toFixed(1),
        ml: getMl(dailyMg),
        frequency: "Once Daily (08:00 AM)"
      });

      const adMg = Math.min(w * 1.5, 40);
      schedule.push({
        id: phaseId++,
        label: "Phase 2: Maintenance Taper",
        subLabel: "Alternate day protocol",
        instructions: ["Switch to Every-Other-Day dosing.", "Monitor for relapse (Proteinuria) weekly."],
        duration: "4 Weeks",
        mg: adMg.toFixed(1),
        ml: getMl(adMg),
        frequency: "Every Other Morning"
      });

      schedule.push({ id: phaseId++, label: "Discontinuation", subLabel: "STOP", instructions: ["Stop therapy.", "Repeat urine dipstick 1 week after stopping."], duration: "Final", mg: "0", ml: "0", frequency: "STOP" });
    }

    // --- TEMPLATE 2: SHORT BURST (>14d) ---
    else if (template === "short-burst") {
      if (isNaN(sMg)) return null;
      let runningMg = sMg;
      
      // Step 1: Consolidate frequency if needed
      if (sFreq > 1) {
        schedule.push({
          id: phaseId++,
          label: "Frequency Consolidation",
          subLabel: "Unifying the daily dose",
          instructions: ["Combine all fractional doses into one single morning dose.", "This prepares the adrenal axis for weaning."],
          duration: "3 Days",
          mg: runningMg.toFixed(1),
          ml: getMl(runningMg),
          frequency: "Once Daily (Morning)"
        });
      }

      // Step 2: 50% Reductions
      while (runningMg > 2.5) {
        runningMg = runningMg / 2;
        schedule.push({
          id: phaseId++,
          label: "Rapid Reduction",
          subLabel: "50% Decrease",
          instructions: ["Watch for fatigue or joint pain (mild withdrawal)."],
          duration: "3 Days",
          mg: runningMg.toFixed(1),
          ml: getMl(runningMg),
          frequency: "Once Daily (Morning)"
        });
      }
      schedule.push({ id: phaseId++, label: "Discontinuation", subLabel: "STOP", instructions: ["Safely stop therapy."], duration: "Final", mg: "0", ml: "0", frequency: "STOP" });
    }

    // --- TEMPLATE 3: CHRONIC SLOW WEAN ---
    else if (template === "chronic-slow") {
      if (isNaN(sMg)) return null;
      let runningMg = sMg;

      // Step 1: Frequency consolidation
      if (sFreq > 1) {
        schedule.push({
          id: phaseId++,
          label: "Consolidation",
          subLabel: "Step 1: Move to Morning Only",
          instructions: ["Give total dose as one morning bolus.", "Allows adrenal recovery overnight."],
          duration: "7 Days",
          mg: runningMg.toFixed(1),
          ml: getMl(runningMg),
          frequency: "Once Daily (Morning)"
        });
      }

      // Step 2: 20% Reductions
      let safety = 8;
      while (runningMg > 5 && safety > 0) {
        safety--;
        runningMg = runningMg * 0.8;
        schedule.push({
          id: phaseId++,
          label: "Maintenance Wean",
          subLabel: "20% Reduction",
          instructions: ["Clinical review every 2 weeks.", "If symptoms return, go back one step."],
          duration: "14 Days",
          mg: runningMg.toFixed(1),
          ml: getMl(runningMg),
          frequency: "Once Daily (Morning)"
        });
      }

      // Step 3: Switch to Alternate Day below physiological floor
      if (runningMg > 0) {
          schedule.push({
            id: phaseId++,
            label: "Physiological Floor",
            subLabel: "Step 3: Alternate Day Dosing",
            instructions: ["Move to Every Other Morning to encourage HPA axis recovery.", "Consider Synacthen/Cortisol test after this phase."],
            duration: "2-4 Weeks",
            mg: runningMg.toFixed(1),
            ml: getMl(runningMg),
            frequency: "Every Other Morning"
          });
      }

      schedule.push({ id: phaseId++, label: "Discontinuation", subLabel: "STOP", instructions: ["Course complete."], duration: "Final", mg: "0", ml: "0", frequency: "STOP" });
    }

    // --- TEMPLATE 4: RHEUMATOLOGY (JIA/SLE) ---
    else if (template === "rheum-jia") {
      if (isNaN(sMg)) return null;
      let runningMg = sMg;

      // Step 1: 10% Reductions every 2 weeks
      let safety = 12;
      while (runningMg > 2.5 && safety > 0) {
        safety--;
        runningMg = runningMg * 0.9;
        schedule.push({
          id: phaseId++,
          label: "Active Wean",
          subLabel: "10% Reduction",
          instructions: [
            "Standard for JIA/SLE in stable, inactive disease.",
            "Physician review for joint swelling or skin flares before each step.",
            "If flare occurs, revert to previous phase and maintain for 1 month."
          ],
          duration: "14 Days",
          mg: runningMg.toFixed(1),
          ml: getMl(runningMg),
          frequency: "Once Daily (Morning)"
        });
      }

      schedule.push({ id: phaseId++, label: "Maintenance / Stop", subLabel: "Complete", instructions: ["Stop or maintain lowest effective dose."], duration: "Final", mg: "0", ml: "0", frequency: "STOP" });
    }

    return schedule;
  }, [template, weight, concMg, concMl, startMg, startFreq]);

  const activeTemplate = TAPER_TEMPLATES.find(t => t.id === template);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32 px-2 sm:px-4">
      {/* HEADER */}
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-4">
          <Link href="/calculators">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Tapering Assistant</h1>
            <p className="text-muted-foreground font-medium text-sm">Professional guideline-driven weaning roadmap.</p>
          </div>
        </div>
        <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 font-black px-3 py-1">SENIOR DIRECTIVE</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SETUP COLUMN */}
        <div className="lg:col-span-4 space-y-6 no-print">
          
          {/* 1. Indication */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-2 flex items-center gap-2">
              <History className="h-3.5 w-3.5" /> 1. Select Indication
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {TAPER_TEMPLATES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left group",
                      template === t.id 
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg" 
                        : "bg-card border-slate-100 hover:border-blue-200"
                    )}
                  >
                    <div className={cn("p-2 rounded-xl mt-0.5", template === t.id ? "bg-white/20" : "bg-slate-100")}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-black text-xs uppercase block">{t.name}</span>
                      <span className={cn("text-[10px] font-medium leading-tight block mt-1", template === t.id ? "text-blue-100" : "text-muted-foreground")}>{t.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Initial State */}
          <Card className="rounded-[32px] border-2 shadow-sm overflow-hidden">
             <CardHeader className="bg-muted/30 border-b py-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                   <Activity className="h-3.5 w-3.5 text-primary" /> 2. Current Status
                </CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase">Liquid Strength</Label>
                  <div className="flex items-center gap-2">
                    <Input type="number" className="h-10 rounded-xl font-bold bg-muted/20 text-center" value={concMg} onChange={(e) => setConcMg(e.target.value)} />
                    <span className="text-[10px] font-black uppercase">mg /</span>
                    <Input type="number" className="h-10 rounded-xl font-bold bg-muted/20 text-center" value={concMl} onChange={(e) => setConcMl(e.target.value)} />
                    <span className="text-[10px] font-black uppercase text-muted-foreground">mL</span>
                  </div>
                </div>

                {template === 'nephrotic' ? (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-primary uppercase">Patient Weight (kg)</Label>
                    <Input 
                        type="number" placeholder="0.0" 
                        className="h-12 rounded-2xl font-black text-xl bg-primary/5 border-primary/20"
                        value={weight} onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-primary uppercase">Current Daily Total (mg)</Label>
                      <Input 
                        type="number" placeholder="0.0" 
                        className="h-11 rounded-xl font-black bg-primary/5 border-primary/20"
                        value={startMg} onChange={(e) => setStartMg(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase">Taken as...</Label>
                      <Tabs value={startFreq} onValueChange={setStartFreq} className="w-full">
                        <TabsList className="grid grid-cols-3 w-full h-10 rounded-xl bg-muted/50 p-1">
                          <TabsTrigger value="1" className="rounded-lg font-bold text-xs">QD</TabsTrigger>
                          <TabsTrigger value="2" className="rounded-lg font-bold text-xs">BID</TabsTrigger>
                          <TabsTrigger value="3" className="rounded-lg font-bold text-xs">TID</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </>
                )}
             </CardContent>
          </Card>

          {/* Safety Alerts */}
          <div className="space-y-3">
             <Alert className="rounded-2xl border-2 bg-red-50 text-red-900 border-red-100">
               <AlertTriangle className="h-4 w-4 text-red-600" />
               <AlertTitle className="text-xs font-black uppercase tracking-tight">Withdrawal Watch</AlertTitle>
               <AlertDescription className="text-[10px] font-medium leading-relaxed">
                  Monitor for lethargy, nausea, and joint pain during reductions.
               </AlertDescription>
             </Alert>
             <Alert className="rounded-2xl border-2 bg-blue-50 text-blue-900 border-blue-100">
               <Syringe className="h-4 w-4 text-blue-600" />
               <AlertTitle className="text-xs font-black uppercase tracking-tight">Stress Dosing</AlertTitle>
               <AlertDescription className="text-[10px] font-medium leading-relaxed">
                  If child becomes systemically unwell, double or triple the current dose for 48h.
               </AlertDescription>
             </Alert>
          </div>
        </div>

        {/* ROADMAP COLUMN */}
        <div className="lg:col-span-8">
          {roadmap ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">3. Master Tapering Roadmap</h3>
                  <Button variant="outline" size="sm" className="h-8 rounded-xl gap-2 text-[10px] font-black uppercase no-print" onClick={() => window.print()}>
                    <Printer className="h-3.5 w-3.5" /> Print Roadmap
                  </Button>
               </div>

               <div className="space-y-4">
                 {roadmap.map((phase) => (
                   <Card 
                    key={phase.id} 
                    className={cn(
                      "rounded-[32px] border-2 transition-all shadow-sm overflow-hidden",
                      phase.mg === '0' ? "bg-muted/10 border-slate-100 opacity-60" : "bg-card hover:border-blue-400"
                    )}
                   >
                     <div className={cn("px-6 py-4 border-b flex items-center justify-between gap-4", phase.mg === '0' ? "bg-slate-50" : "bg-muted/30")}>
                        <div className="flex items-center gap-3">
                           <Badge className={cn("rounded-lg font-black h-6", phase.mg === '0' ? "bg-slate-300" : "bg-blue-600")}>PHASE {phase.id}</Badge>
                           <h4 className="font-black text-sm uppercase tracking-tight">{phase.label}</h4>
                        </div>
                        <Badge variant="outline" className="font-bold text-[10px] uppercase text-muted-foreground border-muted-foreground/20">{phase.duration}</Badge>
                     </div>

                     <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                           <div className="space-y-3">
                              <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <ListChecks className="h-3 w-3" /> Step-by-Step Instructions
                              </p>
                              <ul className="space-y-2">
                                {phase.instructions.map((inst, i) => (
                                  <li key={i} className="text-xs font-medium text-slate-700 flex items-start gap-2">
                                    <div className="h-1 w-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                    {inst}
                                  </li>
                                ))}
                              </ul>
                           </div>

                           <div className="grid grid-cols-2 gap-3">
                              <div className="p-4 rounded-3xl bg-background border shadow-sm text-center space-y-1">
                                 <p className="text-[9px] font-black uppercase text-muted-foreground">Target Dose</p>
                                 <p className="text-2xl font-black tracking-tighter">{phase.mg} <span className="text-[10px]">mg</span></p>
                              </div>
                              <div className="p-4 rounded-3xl bg-blue-50 border border-blue-100 shadow-sm text-center space-y-1">
                                 <p className="text-[9px] font-black uppercase text-blue-600">Give Volume</p>
                                 <p className="text-2xl font-black tracking-tighter text-blue-700">{phase.ml} <span className="text-[10px]">mL</span></p>
                              </div>
                              <div className="col-span-2 p-3 rounded-2xl bg-slate-900 text-white flex items-center justify-center gap-3">
                                 <Clock className="h-3.5 w-3.5 text-blue-400" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">{phase.frequency}</span>
                              </div>
                           </div>
                        </div>
                     </CardContent>
                   </Card>
                 ))}
               </div>

               {/* REFEEDING / ADRENAL PROTOCOL */}
               <div className="p-6 rounded-[32px] bg-slate-900 text-white space-y-4 shadow-xl border-t-4 border-t-blue-500">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h4 className="font-black text-lg tracking-tight uppercase">Long-Term Safety Protocol</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Disease Flare Check</p>
                       <p className="text-[11px] leading-relaxed opacity-80 font-medium">If primary symptoms return during weaning, go back to the <strong>previous successful phase</strong> and maintain for another 14 days before re-attempting the taper.</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">HPA Axis Recovery</p>
                       <p className="text-[11px] leading-relaxed opacity-80 font-medium">Once alternate day dosing is reached, consider morning serum cortisol check (08:00 AM) to confirm adrenal recovery before total stop.</p>
                    </div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 bg-muted/10 border-4 border-dashed rounded-[48px] space-y-6">
              <div className="w-24 h-24 bg-background rounded-3xl flex items-center justify-center shadow-xl border relative">
                <TrendingDown className="h-12 w-12 text-primary/30" />
                <Activity className="h-10 w-10 text-primary/40 absolute -bottom-2 -right-2 bg-background p-2 rounded-xl border shadow-sm" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight text-muted-foreground/60">Generate Clinical Roadmap</h3>
                <p className="text-sm text-muted-foreground/50 max-w-sm mx-auto font-medium">
                  Select an indication and enter the current daily dose. The assistant will generate a stepwise physiological weaning schedule.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
