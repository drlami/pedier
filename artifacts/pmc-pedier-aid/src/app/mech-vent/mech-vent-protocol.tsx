"use client";

import { useState, useMemo } from "react";
import { 
  Wind, Activity, AlertTriangle, Stethoscope, ChevronRight, Calculator,
  ArrowRight, Info, CheckCircle2, TrendingUp, TrendingDown, Copy, RefreshCcw, BookOpen, AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type AgeGroup = "neonate" | "infant" | "toddler" | "child" | "adolescent";
type Scenario = "general" | "ards" | "asthma" | "bronchiolitis" | "neuro" | "shock";

export function MechVentProtocol() {
  const { toast } = useToast();
  
  // Calculator State
  const [weight, setWeight] = useState<string>("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup | "">("");
  const [scenario, setScenario] = useState<Scenario>("general");
  
  // Current Settings
  const [currentSpo2, setCurrentSpo2] = useState<string>("");
  const [currentFio2, setCurrentFio2] = useState<string>("");
  const [currentPh, setCurrentPh] = useState<string>("");
  const [currentPaco2, setCurrentPaco2] = useState<string>("");
  
  const handleReset = () => {
    setWeight("");
    setAgeGroup("");
    setScenario("general");
    setCurrentSpo2("");
    setCurrentFio2("");
    setCurrentPh("");
    setCurrentPaco2("");
  };

  const calcOutput = useMemo(() => {
    if (!weight || !ageGroup) return null;
    
    const w = Number(weight);
    
    // Base defaults
    let tvMin = 6;
    let tvMax = 8;
    let rrMin = 20;
    let rrMax = 30;
    let peepMin = 5;
    let peepMax = 8;
    let itime = "0.7 - 0.8";
    
    // Age adjustments for RR and iTime
    if (ageGroup === "neonate") {
      rrMin = 30; rrMax = 40; itime = "0.35 - 0.45";
    } else if (ageGroup === "infant") {
      rrMin = 25; rrMax = 35; itime = "0.5 - 0.7";
    } else if (ageGroup === "toddler") {
      rrMin = 20; rrMax = 30; itime = "0.7 - 0.8";
    } else if (ageGroup === "child") {
      rrMin = 15; rrMax = 25; itime = "0.8 - 1.0";
    } else if (ageGroup === "adolescent") {
      rrMin = 12; rrMax = 20; itime = "0.9 - 1.2";
    }

    // Scenario Adjustments
    let warnings = [];
    if (scenario === "ards") {
      tvMin = 4; tvMax = 6;
      peepMin = 8; peepMax = 12;
      warnings.push("Lung protective strategy: Use lower TV, higher PEEP. Permissive hypercapnia acceptable (pH > 7.20). Monitor Plateau Pressure < 28.");
    } else if (scenario === "asthma") {
      tvMin = 6; tvMax = 8;
      rrMin = Math.max(10, rrMin - 10); rrMax = Math.max(14, rrMax - 10);
      peepMin = 0; peepMax = 5;
      warnings.push("Avoid air trapping! Use low RR to allow long expiratory time. Monitor for auto-PEEP. Permissive hypercapnia is standard.");
    } else if (scenario === "bronchiolitis") {
      peepMin = 6; peepMax = 8;
      warnings.push("Watch for air trapping. Aggressive secretion clearance needed.");
    } else if (scenario === "neuro") {
      warnings.push("Maintain strict normocapnia (PaCO2 35-40). Avoid hypoxia. Avoid high PEEP if it impairs venous return.");
    } else if (scenario === "shock") {
      warnings.push("High risk of post-intubation cardiovascular collapse. Prepare fluids/inotropes. Minimize mean airway pressure if hypotension occurs.");
    }

    // ABG logic
    let gasAdvice = [];
    if (currentSpo2 && Number(currentSpo2) < 90) gasAdvice.push("Hypoxemia: Increase FiO2 immediately. Optimize PEEP. Consider recruitment.");
    if (currentPaco2 && currentPh) {
      if (Number(currentPaco2) > 50 && Number(currentPh) < 7.25) {
        if (scenario === "asthma") gasAdvice.push("Acidosis + Hypercapnia: Permissive hypercapnia is expected in asthma. DO NOT just increase RR (worsens trapping). Optimize expiratory time.");
        else gasAdvice.push("Acidosis + Hypercapnia: Increase minute ventilation (Carefully increase RR or TV/PIP).");
      } else if (Number(currentPaco2) < 35 && Number(currentPh) > 7.45) {
        gasAdvice.push("Alkalosis + Hypocapnia: Decrease minute ventilation (Decrease RR or TV/PIP).");
      }
    }

    return {
      tvRange: `${Math.round(w * tvMin)} - ${Math.round(w * tvMax)}`,
      rrRange: `${rrMin} - ${rrMax}`,
      peepRange: `${peepMin} - ${peepMax}`,
      itime,
      warnings,
      gasAdvice
    };
  }, [weight, ageGroup, scenario, currentSpo2, currentPaco2, currentPh]);

  const copyToClipboard = () => {
    if (!calcOutput) return;
    const text = `Ventilator Settings (${weight}kg, ${scenario}):\nTV: ${calcOutput.tvRange} mL\nRR: ${calcOutput.rrRange} bpm\nPEEP: ${calcOutput.peepRange} cmH2O\nI-Time: ${calcOutput.itime} s`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard", description: "Settings copied successfully." });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* 1. QUICK OVERVIEW CARD */}
      <Card className="border-2 border-primary/20 shadow-md bg-white overflow-hidden">
        <div className="bg-primary px-6 py-4 flex items-center gap-4 text-white">
          <Wind className="h-8 w-8 opacity-80" />
          <div>
            <h2 className="text-xl font-black tracking-tight">Mechanical Ventilation</h2>
            <p className="text-primary-foreground/80 text-sm font-medium">PICU Bedside Guide</p>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-b bg-slate-50/50">
            <div className="p-4 space-y-1">
              <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest flex items-center gap-1"><Wind className="h-3 w-3"/> Oxygenation</span>
              <p className="text-xs font-bold text-slate-800">Controlled by <strong>FiO2</strong> and <strong>PEEP</strong> (Mean Airway Pressure).</p>
            </div>
            <div className="p-4 space-y-1">
              <span className="text-[10px] font-black uppercase text-purple-600 tracking-widest flex items-center gap-1"><Activity className="h-3 w-3"/> Ventilation</span>
              <p className="text-xs font-bold text-slate-800">Controlled by <strong>RR</strong> and <strong>Tidal Volume / PIP</strong>.</p>
            </div>
            <div className="p-4 space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Target TV</span>
              <p className="text-xs font-bold text-slate-800">Generally <strong>6-8 mL/kg</strong>. Drop to 4-6 for severe ARDS.</p>
            </div>
            <div className="p-4 space-y-1 bg-red-50/30">
              <span className="text-[10px] font-black uppercase text-red-500 tracking-widest flex items-center gap-1"><AlertTriangle className="h-3 w-3"/> Safety Warning</span>
              <p className="text-xs font-bold text-red-900">Avoid volutrauma. Monitor hemodynamics immediately after intubation.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. STICKY TABS */}
      <Tabs defaultValue="calculator" className="w-full">
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur py-2 border-b mb-6 overflow-x-auto scrollbar-hide">
          <TabsList className="w-max h-auto flex flex-nowrap justify-start gap-1 bg-transparent p-0 px-2">
            <TabsTrigger value="overview" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white border px-4 py-2 text-xs font-bold shrink-0">Overview</TabsTrigger>
            <TabsTrigger value="calculator" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white border px-4 py-2 text-xs font-bold shrink-0">Calculator</TabsTrigger>
            <TabsTrigger value="adjustments" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white border px-4 py-2 text-xs font-bold shrink-0">Adjustments</TabsTrigger>
            <TabsTrigger value="troubleshooting" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white border px-4 py-2 text-xs font-bold shrink-0">Troubleshooting (DOPES)</TabsTrigger>
            <TabsTrigger value="weaning" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white border px-4 py-2 text-xs font-bold shrink-0">Weaning & Transfer</TabsTrigger>
          </TabsList>
        </div>

        {/* TAB: OVERVIEW */}
        <TabsContent value="overview" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3 border-b bg-slate-50/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" /> Indications
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                <ul className="space-y-2 text-sm font-medium text-slate-700">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /> Severe respiratory distress/failure</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /> Persistent hypoxemia despite oxygen/HFNC/CPAP</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /> Hypercapnic respiratory failure / Exhaustion</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /> Apnea</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /> Shock with respiratory compromise</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /> Altered consciousness with airway risk</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader className="pb-3 border-b bg-red-50/30">
                <CardTitle className="text-lg flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" /> Red Flags (Need Immediate Action)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                <ul className="space-y-2 text-sm font-medium text-red-800">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Silent chest in asthma</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Gasping respirations</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Severe retractions with visible fatigue</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> SpO2 low despite high oxygen</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Rising PaCO2 with profound acidosis</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Deteriorating mental status</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB: CALCULATOR */}
        <TabsContent value="calculator" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Inputs */}
            <Card className="border-2 border-blue-100 shadow-sm">
              <CardHeader className="bg-blue-50/50 pb-4 border-b border-blue-100 flex flex-row items-center justify-between">
                <CardTitle className="text-sm uppercase tracking-widest text-blue-900 font-black flex items-center gap-2">
                  <Calculator className="h-4 w-4" /> Patient & Scenario
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs font-bold text-blue-600 hover:bg-blue-100">
                  <RefreshCcw className="h-3 w-3 mr-2" /> Reset
                </Button>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase">Weight (kg)</Label>
                    <Input type="number" placeholder="e.g. 15" value={weight} onChange={e => setWeight(e.target.value)} className="font-bold bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase">Age Group</Label>
                    <Select value={ageGroup} onValueChange={(v: any) => setAgeGroup(v)}>
                      <SelectTrigger className="font-bold bg-slate-50"><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="neonate">Neonate (&lt;1mo)</SelectItem>
                        <SelectItem value="infant">Infant (1mo-1yr)</SelectItem>
                        <SelectItem value="toddler">Toddler (1-3yr)</SelectItem>
                        <SelectItem value="child">Child (4-12yr)</SelectItem>
                        <SelectItem value="adolescent">Adolescent (&gt;12yr)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase">Clinical Scenario</Label>
                  <Select value={scenario} onValueChange={(v: any) => setScenario(v)}>
                    <SelectTrigger className="font-bold bg-slate-50"><SelectValue placeholder="Select etiology..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Respiratory Failure</SelectItem>
                      <SelectItem value="ards">Pneumonia / ARDS</SelectItem>
                      <SelectItem value="asthma">Severe Asthma</SelectItem>
                      <SelectItem value="bronchiolitis">Bronchiolitis</SelectItem>
                      <SelectItem value="neuro">Neurologic / Raised ICP</SelectItem>
                      <SelectItem value="shock">Shock Patient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t space-y-4">
                  <Label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Activity className="h-3 w-3" /> Optional Gas / Pulse Ox Integration
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[10px] text-slate-500">SpO2 (%)</Label>
                      <Input type="number" value={currentSpo2} onChange={e => setCurrentSpo2(e.target.value)} className="h-8 text-xs bg-slate-50" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-slate-500">pH</Label>
                      <Input type="number" step="0.01" value={currentPh} onChange={e => setCurrentPh(e.target.value)} className="h-8 text-xs bg-slate-50" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-slate-500">PaCO2</Label>
                      <Input type="number" value={currentPaco2} onChange={e => setCurrentPaco2(e.target.value)} className="h-8 text-xs bg-slate-50" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Outputs */}
            <Card className="border-2 border-emerald-100 shadow-sm relative overflow-hidden flex flex-col">
              <CardHeader className="bg-emerald-50/50 pb-4 border-b border-emerald-100 flex flex-row items-center justify-between">
                <CardTitle className="text-sm uppercase tracking-widest text-emerald-900 font-black flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Suggested Initial Settings
                </CardTitle>
                {calcOutput && (
                  <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 text-xs font-bold text-emerald-700 hover:bg-emerald-100">
                    <Copy className="h-3 w-3 mr-2" /> Copy
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0 flex-1 bg-white">
                {!calcOutput ? (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 min-h-[300px]">
                    <Calculator className="h-12 w-12 mb-3 opacity-20" />
                    <p className="font-bold">Enter weight and age group to generate scenario-specific settings.</p>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="grid grid-cols-2 divide-x divide-y border-b">
                      
                      <div className="p-4 space-y-1 bg-blue-50/20">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Tidal Vol (TV)</span>
                          <span className="text-[10px] font-bold text-slate-400">mL</span>
                        </div>
                        <p className="text-2xl font-black text-slate-800">{calcOutput.tvRange}</p>
                        <p className="text-[10px] font-bold text-slate-500 leading-tight">Controls CO2 alongside RR.</p>
                      </div>
                      
                      <div className="p-4 space-y-1 bg-amber-50/20">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Resp Rate</span>
                          <span className="text-[10px] font-bold text-slate-400">bpm</span>
                        </div>
                        <p className="text-2xl font-black text-slate-800">{calcOutput.rrRange}</p>
                        <p className="text-[10px] font-bold text-slate-500 leading-tight">Based on age/scenario.</p>
                      </div>

                      <div className="p-4 space-y-1 bg-purple-50/20">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-purple-600 tracking-widest">PEEP</span>
                          <span className="text-[10px] font-bold text-slate-400">cmH2O</span>
                        </div>
                        <p className="text-2xl font-black text-slate-800">{calcOutput.peepRange}</p>
                        <p className="text-[10px] font-bold text-slate-500 leading-tight">Keeps airways open.</p>
                      </div>

                      <div className="p-4 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">I-Time</span>
                          <span className="text-[10px] font-bold text-slate-400">sec</span>
                        </div>
                        <p className="text-xl font-black text-slate-800">{calcOutput.itime}</p>
                        <p className="text-[10px] font-bold text-slate-500 leading-tight">Inspiratory time.</p>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-3 flex-1 bg-slate-50/50">
                      {calcOutput.warnings.map((w, i) => (
                        <Alert key={i} className="bg-amber-50/50 border-amber-200">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                          <AlertTitle className="text-xs font-bold text-amber-800">Scenario Guide</AlertTitle>
                          <AlertDescription className="text-xs font-medium text-amber-700/90">{w}</AlertDescription>
                        </Alert>
                      ))}
                      
                      {calcOutput.gasAdvice.map((g, i) => (
                        <Alert key={`g${i}`} className="bg-red-50/50 border-red-200">
                          <Activity className="h-4 w-4 text-red-600" />
                          <AlertTitle className="text-xs font-bold text-red-800">Gas Suggestion</AlertTitle>
                          <AlertDescription className="text-xs font-medium text-red-700/90">{g}</AlertDescription>
                        </Alert>
                      ))}
                    </div>

                    <div className="bg-slate-100 p-2 text-[9px] text-slate-500 font-bold text-center uppercase tracking-wider">
                      Clinical decision support only. Adjust to patient condition.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB: ADJUSTMENTS (Algorithms) */}
        <TabsContent value="adjustments" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <Card className="border-blue-200 bg-blue-50/10">
              <CardHeader className="pb-3 border-b border-blue-100">
                <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                  <TrendingDown className="h-5 w-5" /> Problem: Low SpO2 / PaO2
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-black tracking-widest uppercase text-slate-500">First Check:</h4>
                  <ul className="text-sm font-medium text-slate-700 grid grid-cols-2 gap-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-blue-400" /> Patient condition</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-blue-400" /> Tube patency</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-blue-400" /> Ventilator circuit</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-blue-400" /> Pneumothorax?</li>
                  </ul>
                </div>
                <div className="space-y-2 pt-3 border-t border-blue-100">
                  <h4 className="text-xs font-black tracking-widest uppercase text-slate-500">Then Suggest:</h4>
                  <ul className="space-y-2 text-sm font-bold text-slate-800">
                    <li className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" /> Increase FiO2 immediately</li>
                    <li className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" /> Suction tube if secretions suspected</li>
                    <li className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" /> Increase PEEP if recruitment needed (ARDS)</li>
                    <li className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" /> Consider Stat CXR / Lung POCUS</li>
                    <li className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" /> Escalation: Prone position, HFOV, Transfer</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="border-purple-200 bg-purple-50/10">
                <CardHeader className="pb-3 border-b border-purple-100">
                  <CardTitle className="text-lg flex items-center gap-2 text-purple-800">
                    <TrendingUp className="h-5 w-5" /> Problem: High PaCO2 (Hypercapnia)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <ul className="space-y-2 text-sm font-bold text-slate-800">
                    <li className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" /> Check tube obstruction/secretions first</li>
                    <li className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" /> Increase Respiratory Rate (RR) <span className="text-xs font-medium text-slate-500 ml-1">If no air trapping</span></li>
                    <li className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" /> Increase Pressure / Tidal Volume cautiously</li>
                  </ul>
                  <div className="bg-red-50 p-2 rounded text-xs font-bold text-red-800 border border-red-100">
                    <strong>Asthma exception:</strong> Prioritize expiratory time. Do NOT simply increase RR, as this worsens dynamic hyperinflation. Allow permissive hypercapnia.
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-200 bg-emerald-50/10">
                <CardHeader className="pb-3 border-b border-emerald-100 py-3">
                  <CardTitle className="text-base flex items-center gap-2 text-emerald-800">
                    <TrendingDown className="h-4 w-4" /> Problem: Low PaCO2 (Hypocapnia)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3">
                  <ul className="space-y-2 text-sm font-bold text-slate-800">
                    <li className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" /> Decrease RR or Decrease Pressure/TV</li>
                    <li className="text-xs font-medium text-slate-600 ml-6">Crucial to avoid cerebral vasoconstriction in neuro patients.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <Card className="border-orange-200 bg-orange-50/10 md:col-span-2">
              <CardHeader className="pb-3 border-b border-orange-100">
                <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                  <Activity className="h-5 w-5" /> Pressure Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-black tracking-widest uppercase text-slate-500 mb-2">High Peak Pressure (PIP)</h4>
                  <ul className="space-y-1.5 text-sm font-medium text-slate-700">
                    <li>• Secretions / Mucus plug</li>
                    <li>• Bronchospasm</li>
                    <li>• Kinked tube / Biting tube</li>
                    <li>• Pneumothorax</li>
                    <li>• Poor lung compliance (ARDS worsening)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-widest uppercase text-slate-500 mb-2">Low Tidal Volume (in Pressure Mode)</h4>
                  <ul className="space-y-1.5 text-sm font-medium text-slate-700">
                    <li>• Worsening compliance</li>
                    <li>• Circuit Leak / Cuff leak</li>
                    <li>• ETT Obstruction</li>
                    <li>• Pneumothorax</li>
                    <li>• Inadequate pressure set</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>

        {/* TAB: TROUBLESHOOTING (DOPES) */}
        <TabsContent value="troubleshooting" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <Alert variant="destructive" className="border-2 border-red-500 bg-red-50/50">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <AlertTitle className="text-red-900 font-black text-lg">EMERGENCY PROTOCOL</AlertTitle>
            <AlertDescription className="text-red-800 font-bold mt-2 text-sm leading-relaxed">
              If sudden desaturation or severe bradycardia occurs in a ventilated child: 
              <br/>
              <span className="bg-red-200 px-2 py-0.5 rounded text-red-900 uppercase tracking-wide inline-block mt-2">Disconnect from ventilator and manually bag with 100% oxygen</span> while assessing DOPES.
            </AlertDescription>
          </Alert>

          <Card className="border-2 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                DOPES Mnemonic
              </CardTitle>
              <CardDescription>Systematic troubleshooting for acute deterioration.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="p-4 flex gap-4 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-red-100 text-red-600 font-black text-xl flex items-center justify-center">D</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Displacement</h4>
                    <p className="text-sm text-slate-600">Is the ETT dislodged (right mainstem or extubated)? Check end-tidal CO2, auscultate bilaterally.</p>
                  </div>
                </div>
                <div className="p-4 flex gap-4 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-orange-100 text-orange-600 font-black text-xl flex items-center justify-center">O</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Obstruction</h4>
                    <p className="text-sm text-slate-600">Is the tube kinked or blocked by secretions? Attempt to pass a suction catheter.</p>
                  </div>
                </div>
                <div className="p-4 flex gap-4 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-amber-100 text-amber-600 font-black text-xl flex items-center justify-center">P</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Pneumothorax</h4>
                    <p className="text-sm text-slate-600">Tension pneumothorax? Check for unequal breath sounds, tracheal shift, transilluminate, or stat CXR/POCUS. Needle decompress if crashing.</p>
                  </div>
                </div>
                <div className="p-4 flex gap-4 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-100 text-blue-600 font-black text-xl flex items-center justify-center">E</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Equipment</h4>
                    <p className="text-sm text-slate-600">Ventilator failure, disconnected circuit, no oxygen supply? Manual bagging rules this out.</p>
                  </div>
                </div>
                <div className="p-4 flex gap-4 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-purple-100 text-purple-600 font-black text-xl flex items-center justify-center">S</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Stacked Breaths (Auto-PEEP) / Stomach / Sedation</h4>
                    <p className="text-sm text-slate-600">Severe asthma trapping? Disconnect to let them exhale. Severe gastric distension? Decompress stomach. Fighting the vent? Optimize sedation.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="py-3 bg-slate-50/50 border-b">
                <CardTitle className="text-sm">Routine Monitoring</CardTitle>
              </CardHeader>
              <CardContent className="pt-3 text-sm space-y-2 text-slate-700 font-medium">
                <p>• Continuous SpO2, ECG, BP, Capnography.</p>
                <p>• ABG 30-60 mins after setting changes.</p>
                <p>• CXR after intubation (verify depth).</p>
                <p>• VAP prevention bundle adherence.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3 bg-slate-50/50 border-b">
                <CardTitle className="text-sm">Complications to Watch</CardTitle>
              </CardHeader>
              <CardContent className="pt-3 text-sm space-y-2 text-slate-700 font-medium">
                <p>• Barotrauma / Volutrauma / Pneumothorax</p>
                <p>• Hypotension (sedation or intrathoracic pressure)</p>
                <p>• Ventilator Associated Pneumonia (VAP)</p>
                <p>• Unplanned extubation / Obstruction</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB: WEANING */}
        <TabsContent value="weaning" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <Card>
            <CardHeader className="pb-3 border-b bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Extubation Readiness Criteria
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3 text-sm font-medium text-slate-700">
                <li className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">1</div> Improving underlying disease process</li>
                <li className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">2</div> Stable hemodynamics (off vasoactives or low stable dose)</li>
                <li className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">3</div> Acceptable oxygenation on low support (FiO2 &lt; 40%, PEEP 5)</li>
                <li className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">4</div> Adequate mental status and airway protection</li>
                <li className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">5</div> Strong cough and manageable secretions</li>
                <li className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">6</div> Successful Spontaneous Breathing Trial (SBT)</li>
              </ul>
              
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 text-sm mb-2">Pre-Extubation Planning:</h4>
                <p className="text-sm text-slate-600">Consider airway cuff leak test if high risk for edema. Consider steroids (Dexamethasone) 12-24hrs prior if high risk. Have a post-extubation support plan ready (HFNC / CPAP / NIPPV).</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader className="pb-3 border-b bg-red-50/30">
              <CardTitle className="text-lg flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" /> Transfer / Escalation Criteria
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-slate-600 mb-3 font-medium">Consider urgent transfer to a higher-level PICU or requesting senior intensivist support if:</p>
              <ul className="space-y-2 text-sm font-bold text-slate-800">
                <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-red-500 shrink-0" /> Severe ARDS or Refractory Hypoxemia</li>
                <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-red-500 shrink-0" /> Need for HFOV (if unavailable locally)</li>
                <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-red-500 shrink-0" /> Suspected need for ECMO</li>
                <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-red-500 shrink-0" /> Persistent shock requiring multiple vasoactives</li>
                <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-red-500 shrink-0" /> Uncontrolled raised ICP</li>
                <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-red-500 shrink-0" /> Recurrent pneumothoraces or severe air leak</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
