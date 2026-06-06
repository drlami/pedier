'use client';

import { useState, useMemo } from "react";
import { 
  ArrowLeft, Scale, Calculator, Info, Activity, 
  AlertCircle, ChevronRight, Printer, CheckCircle2, 
  Clock, Pill, Droplets, Thermometer, ShieldCheck,
  UserCircle, HeartPulse, TrendingUp, Apple
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

// --- Clinical Definitions ---

const GLOSSARY = [
  { term: "TDD", full: "Total Daily Dose", desc: "The total amount of insulin (Basal + Bolus) a patient requires in a 24-hour period." },
  { term: "ISF", full: "Insulin Sensitivity Factor", desc: "How many mg/dL the blood glucose is expected to drop per 1 unit of rapid-acting insulin. Also called 'Correction Factor'." },
  { term: "Basal", full: "Background Insulin", desc: "Long-acting insulin (e.g. Glargine) that suppresses glucose production between meals and overnight." },
  { term: "Bolus", full: "Meal-time Insulin", desc: "Rapid-acting insulin (e.g. Novorapid) given to cover carbohydrate intake from a meal." },
  { term: "SC", full: "Subcutaneous", desc: "Injected under the skin into the fatty tissue." },
  { term: "VBG", full: "Venous Blood Gas", desc: "Used to monitor pH and Bicarbonate levels to confirm DKA resolution." }
];

export default function DkaTransitionPage() {
  const [weight, setWeight] = useState<string>("");
  const [status, setStatus] = useState<"pre-pubertal" | "pubertal">("pre-pubertal");
  const unit = "mgdl"; // App standardised to mg/dL for all glucose values
  
  // Titration State
  const [currentTdd, setCurrentTdd] = useState<string>("");
  const [titrationPercent, setTitrationPercent] = useState<number>(10);
  const [titrationDirection, setTitrationDirection] = useState<"increase" | "decrease">("increase");

  const results = useMemo(() => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return null;

    // 1. TDD Calculation
    // Pre-pubertal: 0.5 - 0.75 U/kg (we use 0.7 as standard)
    // Pubertal: 0.75 - 1.0 U/kg (we use 1.0 as standard)
    const factor = status === "pre-pubertal" ? 0.7 : 1.0;
    const tdd = w * factor;

    // 2. 50/50 Split
    const basalTotal = tdd * 0.5;
    const bolusTotal = tdd * 0.5;
    const mealDose = bolusTotal / 3;

    // 3. ISF Calculation — 1800 Rule (mg/dL; app standardised to mg/dL)
    const isfMgdl = 1800 / tdd;

    return {
      tdd: tdd.toFixed(1),
      basal: basalTotal.toFixed(1),
      bolus: bolusTotal.toFixed(1),
      mealDose: mealDose.toFixed(1),
      isf: isfMgdl.toFixed(0),
      isfMgdl
    };
  }, [weight, status]);

  const titrationResults = useMemo(() => {
    const tdd = parseFloat(currentTdd);
    if (isNaN(tdd) || tdd <= 0) return null;

    const adjustment = tdd * (titrationPercent / 100);
    const newTdd = titrationDirection === "increase" ? tdd + adjustment : tdd - adjustment;
    
    const newBasal = newTdd * 0.5;
    const newMeal = (newTdd * 0.5) / 3;

    return {
      newTdd: newTdd.toFixed(1),
      newBasal: newBasal.toFixed(1),
      newMeal: newMeal.toFixed(1),
      adjustment: adjustment.toFixed(1)
    };
  }, [currentTdd, titrationPercent, titrationDirection]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32 px-2 sm:px-4">
      {/* HEADER */}
      <div className="flex items-center gap-4 no-print">
        <Link href="/calculators">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-black tracking-tighter">DKA Insulin Transition</h1>
          <p className="text-muted-foreground font-medium text-sm italic">Master Directive for IV-to-Subcutaneous (SC) Switch</p>
        </div>
      </div>

      {/* 0. GLOSSARY / ABBREVIATIONS */}
      <div className="flex flex-wrap gap-2 no-print">
        <TooltipProvider>
          {GLOSSARY.map((g) => (
            <Tooltip key={g.term}>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="cursor-help bg-background border-primary/20 text-[10px] font-black tracking-widest uppercase py-1 px-2 hover:bg-primary/5">
                  {g.term}
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-3">
                <p className="font-black text-xs text-primary underline mb-1">{g.full}</p>
                <p className="text-[11px] leading-relaxed font-medium">{g.desc}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUTS COLUMN */}
        <div className="lg:col-span-4 space-y-4 no-print">
          <Card className="rounded-[28px] border-2 shadow-sm bg-card overflow-hidden">
            <CardHeader className="bg-muted/30 border-b py-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Calculator className="h-4 w-4 text-primary" /> Patient Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Patient Weight (kg)</Label>
                <div className="relative">
                  <Scale className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="weight" type="number" placeholder="0.0" 
                    className="h-12 pl-10 rounded-2xl font-black text-xl bg-muted/20 border-primary/20 focus:border-primary transition-all"
                    value={weight} onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pubertal Status</Label>
                <Tabs value={status} onValueChange={(v: any) => setStatus(v)} className="w-full">
                  <TabsList className="grid grid-cols-2 w-full h-11 rounded-xl p-1 bg-muted/50">
                    <TabsTrigger value="pre-pubertal" className="rounded-lg font-bold text-xs">Pre-Pubertal</TabsTrigger>
                    <TabsTrigger value="pubertal" className="rounded-lg font-bold text-xs">Pubertal</TabsTrigger>
                  </TabsList>
                </Tabs>
                <p className="text-[9px] text-muted-foreground font-medium px-1 italic">
                  {status === 'pre-pubertal' ? "Uses 0.7 U/kg factor" : "Uses 1.0 U/kg factor (High resistance)"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ELIGIBILITY CHECKLIST */}
          <Card className="rounded-[28px] border-2 border-primary/10 bg-primary/[0.01]">
            <CardHeader className="py-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary">Transition Readiness</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-3">
              <CheckItem label="pH > 7.30 or HCO3 > 15" />
              <CheckItem label="Patient alert / no vomiting" />
              <CheckItem label="Meal ready to be served" />
            </CardContent>
          </Card>
        </div>

        {/* DIRECTIVE COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          {results ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              
              {/* 1. THE FIRST STEP: THE TRANSITION INJECTION */}
              <Card className="rounded-[32px] border-2 border-primary/20 bg-primary/[0.02] shadow-xl overflow-hidden">
                <CardHeader className="bg-primary/5 border-b pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      <Activity className="h-4 w-4" /> 1. The Transition Point
                    </CardTitle>
                    <Badge className="bg-primary text-white font-black px-3 py-1">FIRST STEP</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                   <div className="bg-background border rounded-2xl p-5 space-y-4 shadow-sm">
                      <p className="text-xs font-bold leading-relaxed text-muted-foreground uppercase tracking-tight">
                        When DKA is resolved and the patient is ready to eat, follow these exact steps:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-muted/30 border border-dashed space-y-2">
                          <p className="text-[10px] font-black uppercase text-primary">A. First Subcut Injection</p>
                          <p className="text-sm font-bold">Give <span className="text-primary underline">{results.mealDose} U</span> of Rapid-Acting insulin WITH the meal.</p>
                          <p className="text-[10px] text-muted-foreground italic">+ Give the first Basal dose now if not already started.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-red-50 border border-red-100 space-y-2">
                          <p className="text-[10px] font-black uppercase text-red-600">B. The Overlap Rule</p>
                          <p className="text-sm font-bold text-red-900">CONTINUE the IV Insulin drip for exactly 60 minutes after the injection.</p>
                          <p className="text-[10px] text-red-700 italic">Stop IV infusion ONLY after the 60-min overlap is complete.</p>
                        </div>
                      </div>
                   </div>
                </CardContent>
              </Card>

              {/* 2. THE ONGOING PLAN: BASAL-BOLUS SCHEDULE */}
              <Card className="rounded-[32px] border-2 border-slate-200 bg-card shadow-lg overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-black tracking-tight tracking-tight uppercase">2. Daily Maintenance Plan</CardTitle>
                      <CardDescription className="text-slate-400 font-bold text-xs uppercase tracking-widest">Ongoing Basal-Bolus Regimen</CardDescription>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-blue-400">TOTAL DAILY DOSE</p>
                       <p className="text-2xl font-black">{results.tdd} Units</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* BASAL CARD */}
                    <div className="p-6 rounded-[28px] border-2 border-indigo-100 bg-indigo-50/30 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700"><Clock className="h-5 w-5" /></div>
                        <h4 className="font-black text-sm uppercase tracking-tight">Basal (Long-Acting)</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-4xl font-black text-indigo-700 tracking-tighter">{results.basal} <span className="text-lg">U</span></p>
                        <p className="text-xs font-bold text-indigo-900/60 uppercase">Inject ONCE daily</p>
                      </div>
                      <p className="text-[10px] font-medium text-indigo-900/70 leading-relaxed italic">
                        Provides background insulin. Use Glargine or Degludec. Give at the same time every day.
                      </p>
                    </div>

                    {/* BOLUS CARD */}
                    <div className="p-6 rounded-[28px] border-2 border-emerald-100 bg-emerald-50/30 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700"><Pill className="h-5 w-5" /></div>
                        <h4 className="font-black text-sm uppercase tracking-tight">Bolus (Rapid-Acting)</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-4xl font-black text-emerald-700 tracking-tighter">{results.mealDose} <span className="text-lg">U</span></p>
                        <p className="text-xs font-bold text-emerald-900/60 uppercase">Inject WITH each meal (TID)</p>
                      </div>
                      <div className="pt-3 border-t border-emerald-100/50 space-y-2">
                        <p className="text-[10px] font-black text-emerald-800 uppercase flex items-center gap-1.5">
                          <Apple className="h-3 w-3" /> Snack Management
                        </p>
                        <p className="text-[10px] font-medium text-emerald-900/70 leading-relaxed italic">
                          Ideally, provide <strong>"Free Snacks" (&lt; 15g carbs)</strong> to avoid extra boluses. If a snack bolus is required, it must be added to the total units given for tomorrow's titration calculation.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 3. SMART CORRECTION SCALE (Modern Replacement for Sliding Scale) */}
              <Card className="rounded-[32px] border-2 border-slate-200 bg-card overflow-hidden shadow-lg">
                <CardHeader className="bg-slate-100 p-6 border-b">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-primary" /> 3. Correction Directives
                      </CardTitle>
                      <CardDescription className="text-muted-foreground font-bold text-xs uppercase tracking-widest italic underline">Add these units to the standard meal dose if glucose is high</CardDescription>
                    </div>
                    <Badge variant="outline" className="border-primary/40 text-primary font-black h-6">ISF: 1U / {results.isf}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b border-muted-foreground/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <th className="px-6 py-4 text-left">Blood Glucose (mg/dL)</th>
                        <th className="px-6 py-4 text-center">Addition to Meal Dose</th>
                        <th className="px-6 py-4 text-right">TOTAL DOSE TO INJECT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-muted-foreground/10">
                      <CorrectionRow bgRange={`< 72`} addAmount={0} mealDose={parseFloat(results.mealDose)} directive="Treat Hypoglycemia" color="text-red-600" unit={unit} isHypo />
                      <CorrectionRow bgRange={`72 - 144`} addAmount={0} mealDose={parseFloat(results.mealDose)} directive="Target Range" color="text-emerald-600" unit={unit} isTarget />
                      <CorrectionRow bgRange={`145 - 216`} addAmount={1} mealDose={parseFloat(results.mealDose)} directive="Low Correction" color="text-amber-600" unit={unit} />
                      <CorrectionRow bgRange={`217 - 288`} addAmount={2} mealDose={parseFloat(results.mealDose)} directive="Moderate Correction" color="text-orange-600" unit={unit} />
                      <CorrectionRow bgRange={`289 - 360`} addAmount={3} mealDose={parseFloat(results.mealDose)} directive="High Correction" color="text-rose-600" unit={unit} />
                      <CorrectionRow bgRange={`> 360`} addAmount={4} mealDose={parseFloat(results.mealDose)} directive="Check Blood Ketones" color="text-red-700 font-black" unit={unit} />
                    </tbody>
                  </table>
                  <div className="p-4 bg-muted/20 border-t border-dashed">
                    <p className="text-[10px] font-medium text-muted-foreground italic text-center">
                      Note: Round total doses to the nearest 0.5 or 1.0 unit based on your hospital's insulin pen/syringe capability.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 4. TDD TITRATION CALCULATOR (Daily Review) */}
              <Card className="rounded-[32px] border-2 border-blue-100 bg-blue-50/20 overflow-hidden shadow-sm no-print">
                <CardHeader className="bg-blue-600 text-white p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-black uppercase tracking-tight">Daily Titration Engine</CardTitle>
                      <CardDescription className="text-blue-100 font-bold text-xs">For morning rounds and 24h review</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="bg-white/50 border border-blue-100 rounded-2xl p-4 space-y-3">
                    <p className="text-[10px] font-black uppercase text-blue-600 flex items-center gap-2">
                      <Info className="h-3.5 w-3.5" /> When to use this tool
                    </p>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-900 leading-relaxed">
                        TDD = Total Basal (Long-acting) + Total Bolus (Short-acting)
                      </p>
                      <p className="text-[10px] font-medium text-slate-500 italic">
                        The engine adjusts the entire daily requirement and then performs a new 50/50 physiological split.
                      </p>
                    </div>
                    <p className="text-xs font-medium text-slate-700 leading-relaxed border-t border-blue-50 pt-2">
                      Use this every morning during ward rounds to adjust the insulin dose based on yesterday's performance:
                    </p>
                    <ul className="text-[11px] space-y-2">
                      <li className="flex gap-2"><div className="h-1 w-1 rounded-full bg-blue-400 mt-1.5 shrink-0" /> <strong>Increase by 10-20%:</strong> If most readings yesterday were above target (&gt; 180 mg/dL).</li>
                      <li className="flex gap-2"><div className="h-1 w-1 rounded-full bg-blue-400 mt-1.5 shrink-0" /> <strong>Decrease by 10-20%:</strong> If the patient had any hypoglycemia (&lt; 72 mg/dL) or is consistently at the low end of target.</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end border-b border-blue-100 pb-6">
                    <div className="space-y-2">
                      <Label htmlFor="current-tdd" className="text-[10px] font-black uppercase tracking-widest text-blue-700">Yesterday's Total Dose (Basal + Bolus)</Label>
                      <Input 
                        id="current-tdd" type="number" placeholder="Sum of all units given" 
                        className="h-12 rounded-xl font-black text-xl border-blue-200 focus:border-blue-500 bg-white"
                        value={currentTdd} onChange={(e) => setCurrentTdd(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 space-y-2">
                         <Label className="text-[10px] font-black uppercase tracking-widest text-blue-700">Direction</Label>
                         <Tabs value={titrationDirection} onValueChange={(v: any) => setTitrationDirection(v)} className="w-full">
                           <TabsList className="grid grid-cols-2 w-full h-12 rounded-xl bg-blue-100/50 p-1">
                             <TabsTrigger value="increase" className="rounded-lg font-bold text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">Increase</TabsTrigger>
                             <TabsTrigger value="decrease" className="rounded-lg font-bold text-xs data-[state=active]:bg-red-600 data-[state=active]:text-white">Decrease</TabsTrigger>
                           </TabsList>
                         </Tabs>
                      </div>
                      <div className="flex-1 space-y-2">
                         <Label className="text-[10px] font-black uppercase tracking-widest text-blue-700">Percentage</Label>
                         <Tabs value={titrationPercent.toString()} onValueChange={(v: any) => setTitrationPercent(parseInt(v))} className="w-full">
                           <TabsList className="grid grid-cols-2 w-full h-12 rounded-xl bg-blue-100/50 p-1">
                             <TabsTrigger value="10" className="rounded-lg font-bold text-xs">10%</TabsTrigger>
                             <TabsTrigger value="20" className="rounded-lg font-bold text-xs">20%</TabsTrigger>
                           </TabsList>
                         </Tabs>
                      </div>
                    </div>
                  </div>

                  {titrationResults ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in zoom-in-95 duration-300">
                      <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-sm space-y-1">
                        <p className="text-[9px] font-black text-muted-foreground uppercase">New TDD</p>
                        <p className="text-2xl font-black text-blue-600">{titrationResults.newTdd} U</p>
                        <p className="text-[10px] font-bold text-blue-400">{titrationDirection === 'increase' ? '+' : '-'}{titrationResults.adjustment} U adjustment</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-sm space-y-1 border-l-4 border-l-indigo-500">
                        <p className="text-[9px] font-black text-muted-foreground uppercase">New Basal</p>
                        <p className="text-2xl font-black text-slate-900">{titrationResults.newBasal} U</p>
                        <p className="text-[10px] font-bold text-indigo-500">Long-acting QD</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-sm space-y-1 border-l-4 border-l-emerald-500">
                        <p className="text-[9px] font-black text-muted-foreground uppercase">New Meal Dose</p>
                        <p className="text-2xl font-black text-slate-900">{titrationResults.newMeal} U</p>
                        <p className="text-[10px] font-bold text-emerald-500">Rapid-acting TID</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center bg-white/50 rounded-2xl border border-dashed border-blue-200">
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Enter current TDD to see adjustment</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 5. MONITORING DIRECTIVE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
                <Card className="rounded-2xl border-indigo-100 bg-indigo-50/30 p-4 space-y-3">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-700 flex items-center gap-2">
                    <HeartPulse className="h-3.5 w-3.5" /> First 6 Hours
                  </h5>
                  <ul className="text-xs font-medium space-y-2 text-indigo-900">
                    <li className="flex gap-2"><div className="h-1 w-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" /> Check Blood Glucose every 1-2 hours.</li>
                    <li className="flex gap-2"><div className="h-1 w-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" /> Check for Urinary/Blood Ketones every void.</li>
                  </ul>
                </Card>
                <Card className="rounded-2xl border-slate-100 bg-slate-50/30 p-4 space-y-3">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-700 flex items-center gap-2">
                    <Thermometer className="h-3.5 w-3.5" /> Maintenance phase
                  </h5>
                  <ul className="text-xs font-medium space-y-2 text-slate-900">
                    <li className="flex gap-2"><div className="h-1 w-1 rounded-full bg-slate-400 mt-1.5 shrink-0" /> Pre-meal and Before-bed BG monitoring.</li>
                    <li className="flex gap-2"><div className="h-1 w-1 rounded-full bg-slate-400 mt-1.5 shrink-0" /> Review and titrate TDD daily by 10-20%.</li>
                  </ul>
                </Card>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[450px] flex flex-col items-center justify-center text-center p-12 bg-muted/10 border-4 border-dashed rounded-[48px] space-y-6">
              <div className="w-24 h-24 bg-background rounded-3xl flex items-center justify-center shadow-xl border relative">
                <Droplets className="h-12 w-12 text-blue-500/40" />
                <Activity className="h-10 w-10 text-primary/40 absolute -bottom-2 -right-2 bg-background p-2 rounded-xl border shadow-sm" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight text-muted-foreground/60">Generate Transition Plan</h3>
                <p className="text-sm text-muted-foreground/50 max-w-sm mx-auto font-medium">
                  Enter the patient's weight and pubertal status to calculate the physiological Basal-Bolus transition order and personalized correction scale.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultTile({ label, value, sub, icon: Icon, color }: any) {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };
  return (
    <Card className={cn("rounded-3xl border shadow-sm p-4 space-y-1", colorMap[color])}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="h-3.5 w-3.5 opacity-60" />
        <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <h4 className="text-3xl font-black tracking-tighter leading-none">{value}</h4>
      </div>
      <p className="text-[10px] font-bold opacity-50">{sub}</p>
    </Card>
  );
}

function CheckItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-5 w-5 rounded-full border-2 border-primary/20 flex items-center justify-center shrink-0">
        <CheckCircle2 className="h-3 w-3 text-primary/40" />
      </div>
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
    </div>
  );
}

function CorrectionRow({ bgRange, addAmount, mealDose, directive, color, unit, isHypo, isTarget }: any) {
  const totalDose = (mealDose + addAmount).toFixed(1);
  return (
    <tr className={cn("hover:bg-muted/30 transition-colors", isTarget ? "bg-emerald-50/20" : "")}>
      <td className="px-6 py-4 font-black text-slate-900">{bgRange} <span className="text-[9px] font-bold text-muted-foreground ml-1">mg/dL</span></td>
      <td className="px-6 py-4 text-center">
        <div className="flex flex-col items-center">
           <Badge className={cn("px-3 py-1 font-black", addAmount === 0 ? "bg-muted text-muted-foreground" : "bg-blue-600 text-white")}>
             {addAmount === 0 ? "No Addition" : `+ ${addAmount} U`}
           </Badge>
           {addAmount > 0 && <span className="text-[9px] text-muted-foreground font-bold mt-1 uppercase">Correction</span>}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        {isHypo ? (
          <span className="text-red-600 font-black uppercase text-xs">Treat Hypo First</span>
        ) : (
          <div className="space-y-0.5">
            <p className={cn("text-lg font-black tracking-tighter leading-none text-slate-900")}>
              {totalDose} <span className="text-xs">U</span>
            </p>
            <p className={cn("text-[9px] font-bold uppercase tracking-tight", color)}>{directive}</p>
          </div>
        )}
      </td>
    </tr>
  );
}
