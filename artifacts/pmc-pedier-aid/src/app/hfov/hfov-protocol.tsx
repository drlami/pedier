"use client";

import { useState, useMemo } from "react";
import { 
  Wind, Activity, AlertTriangle, Stethoscope, ChevronRight, Calculator,
  ArrowRight, Info, CheckCircle2, TrendingUp, TrendingDown, RefreshCcw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Types
type Diagnosis = "ards" | "air-leak" | "asthma" | "phtn" | "other";
type AgeGroup = "neonate" | "infant" | "child" | "adolescent";

export function HFOVProtocol() {
  // Calculator State
  const [weight, setWeight] = useState<string>("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup | "">("");
  const [diagnosis, setDiagnosis] = useState<Diagnosis | "">("");
  const [convMap, setConvMap] = useState<string>("");
  const [convPip, setConvPip] = useState<string>("");

  // Logic Engine
  const calcOutput = useMemo(() => {
    if (!weight || !ageGroup || !diagnosis || !convMap) return null;
    
    const w = Number(weight);
    const cmap = Number(convMap);
    const cpip = Number(convPip) || 0;

    let targetMap = cmap;
    let targetFreq = 10;
    let targetAmpStr = "";
    
    // MAP Logic
    if (diagnosis === "ards" || diagnosis === "other") targetMap = cmap + 4;
    else if (diagnosis === "air-leak" || diagnosis === "asthma") targetMap = cmap; // Caution with asthma
    else if (diagnosis === "phtn") targetMap = cmap + 2;

    // Freq Logic
    if (ageGroup === "neonate") targetFreq = 10;
    else if (ageGroup === "infant") targetFreq = 8;
    else if (ageGroup === "child") targetFreq = 6;
    else if (ageGroup === "adolescent") targetFreq = 5;

    // Amplitude Logic
    if (cpip > 0) {
      targetAmpStr = `${cpip + 10} cmH2O`;
    } else {
      targetAmpStr = `Start ~${Math.round(targetMap * 2.5)} cmH2O`;
    }

    return {
      map: targetMap,
      freq: targetFreq,
      amp: targetAmpStr,
      fio2: "1.0 (100%)",
      itime: "33%",
      wiggle: "Titrate to visible chest wiggle down to umbilicus/mid-thigh"
    };
  }, [weight, ageGroup, diagnosis, convMap, convPip]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* 1. QUICK SNAPSHOT (Emergency Card) */}
      <Card className="border-2 border-primary/20 shadow-md bg-white overflow-hidden">
        <div className="bg-primary px-6 py-4 flex items-center gap-4 text-white">
          <Wind className="h-8 w-8 opacity-80" />
          <div>
            <h2 className="text-xl font-black tracking-tight">HFOV Initiation Protocol</h2>
            <p className="text-primary-foreground/80 text-sm font-medium">High-Frequency Oscillatory Ventilation</p>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b bg-slate-50/50">
            <div className="p-4 space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Main Indication</span>
              <p className="text-sm font-bold text-slate-800">Severe ARDS / Refractory Hypoxemia despite optimized conventional vent.</p>
            </div>
            <div className="p-4 space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Initial Action</span>
              <p className="text-sm font-bold text-slate-800">Set MAP 2-5 cmH2O above current. Start FiO2 100%.</p>
            </div>
            <div className="p-4 space-y-1 bg-red-50/30">
              <span className="text-[10px] font-black uppercase text-red-500 tracking-widest">Key Warning</span>
              <p className="text-sm font-bold text-red-900">Ensure paralysis/sedation. Monitor for hypotension immediately upon connection.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. STICKY TABS */}
      <Tabs defaultValue="calculator" className="w-full">
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur py-2 border-b">
          <TabsList className="w-full h-auto flex flex-wrap justify-start gap-1 bg-transparent p-0">
            <TabsTrigger value="indications" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white border px-4 py-2 text-xs font-bold">Indications</TabsTrigger>
            <TabsTrigger value="calculator" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white border px-4 py-2 text-xs font-bold">Starter Calc</TabsTrigger>
            <TabsTrigger value="adjustments" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white border px-4 py-2 text-xs font-bold">Adjustments</TabsTrigger>
            <TabsTrigger value="troubleshooting" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white border px-4 py-2 text-xs font-bold">Troubleshooting</TabsTrigger>
            <TabsTrigger value="weaning" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white border px-4 py-2 text-xs font-bold">Weaning</TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-6">
          {/* TAB: INDICATIONS */}
          <TabsContent value="indications" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <Card>
              <CardHeader className="pb-3 border-b bg-slate-50/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" /> When to Start HFOV
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-black tracking-widest uppercase text-slate-500">Indications</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                      <span className="text-sm font-medium">Severe Hypoxemia (Oxygenation Index &gt; 13-15)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                      <span className="text-sm font-medium">Failure of conventional ventilation (PIP &gt; 30-35 cmH2O or MAP &gt; 15 cmH2O)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                      <span className="text-sm font-medium">Severe Air Leak Syndromes (Pneumothorax, PIE) - to minimize tidal volumes</span>
                    </li>
                  </ul>
                </div>

                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Caution / Relative Contraindications</AlertTitle>
                  <AlertDescription className="mt-2 text-sm font-medium">
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Status Asthmaticus:</strong> High risk of severe air trapping.</li>
                      <li><strong>Severe Intracranial Hypertension:</strong> High MAP can impede cerebral venous return.</li>
                      <li><strong>Hemodynamic Instability:</strong> Unresuscitated shock (fix volume first).</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: CALCULATOR */}
          <TabsContent value="calculator" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Inputs */}
              <Card className="border-2 border-blue-100 shadow-sm">
                <CardHeader className="bg-blue-50/50 pb-4 border-b border-blue-100">
                  <CardTitle className="text-sm uppercase tracking-widest text-blue-900 font-black flex items-center gap-2">
                    <Calculator className="h-4 w-4" /> Patient Data
                  </CardTitle>
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
                          <SelectItem value="child">Child (1-12yr)</SelectItem>
                          <SelectItem value="adolescent">Adolescent (&gt;12yr)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase">Primary Diagnosis</Label>
                    <Select value={diagnosis} onValueChange={(v: any) => setDiagnosis(v)}>
                      <SelectTrigger className="font-bold bg-slate-50"><SelectValue placeholder="Select etiology..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ards">ARDS / Severe Pneumonia</SelectItem>
                        <SelectItem value="air-leak">Air Leak Syndrome</SelectItem>
                        <SelectItem value="asthma">Status Asthmaticus (Caution!)</SelectItem>
                        <SelectItem value="phtn">Pulmonary Hypertension</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase">Current MAP</Label>
                      <div className="relative">
                        <Input type="number" placeholder="e.g. 14" value={convMap} onChange={e => setConvMap(e.target.value)} className="font-bold bg-slate-50" />
                        <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">cmH2O</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase">Current PIP</Label>
                      <div className="relative">
                        <Input type="number" placeholder="e.g. 30" value={convPip} onChange={e => setConvPip(e.target.value)} className="font-bold bg-slate-50" />
                        <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">cmH2O</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Outputs */}
              <Card className="border-2 border-emerald-100 shadow-sm relative overflow-hidden flex flex-col">
                <CardHeader className="bg-emerald-50/50 pb-4 border-b border-emerald-100">
                  <CardTitle className="text-sm uppercase tracking-widest text-emerald-900 font-black flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Suggested Initial Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-1 bg-white">
                  {!calcOutput ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                      <Calculator className="h-12 w-12 mb-3 opacity-20" />
                      <p className="font-bold">Enter weight, age, diagnosis, and current MAP to view settings.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full">
                      <div className="grid grid-cols-2 divide-x divide-y border-b flex-1">
                        
                        <div className="p-4 space-y-1 bg-blue-50/20">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">MAP</span>
                            <span className="text-[10px] font-bold text-slate-400">cmH2O</span>
                          </div>
                          <p className="text-3xl font-black text-slate-800">{calcOutput.map}</p>
                          <p className="text-[10px] font-bold text-slate-500 leading-tight">Controls Oxygenation. Start 2-5 above conv.</p>
                        </div>
                        
                        <div className="p-4 space-y-1 bg-amber-50/20">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Freq (Hz)</span>
                            <span className="text-[10px] font-bold text-slate-400">breaths/sec</span>
                          </div>
                          <p className="text-3xl font-black text-slate-800">{calcOutput.freq}</p>
                          <p className="text-[10px] font-bold text-slate-500 leading-tight">Controls CO2 (Inverse). Based on size.</p>
                        </div>

                        <div className="p-4 space-y-1 bg-purple-50/20">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-purple-600 tracking-widest">Delta P (Amp)</span>
                            <span className="text-[10px] font-bold text-slate-400">cmH2O</span>
                          </div>
                          <p className="text-xl font-black text-slate-800 tracking-tight">{calcOutput.amp}</p>
                          <p className="text-[10px] font-bold text-slate-500 leading-tight">{calcOutput.wiggle}</p>
                        </div>

                        <div className="p-4 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">FiO2 & I-Time</span>
                          </div>
                          <p className="text-lg font-black text-slate-800">100% / 33%</p>
                          <p className="text-[10px] font-bold text-slate-500 leading-tight">Fix I-Time at 33%. Wean FiO2 fast.</p>
                        </div>
                      </div>
                      
                      <div className="bg-slate-100 p-3 text-[10px] text-slate-500 font-bold text-center">
                        Clinical decision support only. Adjust to patient condition.
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB: ADJUSTMENTS */}
          <TabsContent value="adjustments" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <Card>
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <RefreshCcw className="h-5 w-5 text-indigo-600" /> HFOV Bedside Logic
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                  
                  {/* OXYGENATION */}
                  <div className="p-6 space-y-6 bg-blue-50/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                        <Wind className="h-5 w-5" />
                      </div>
                      <h3 className="font-black text-blue-900 tracking-tight text-lg">Oxygenation (PaO2 / SpO2)</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-xl border shadow-sm space-y-2">
                        <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                          <TrendingDown className="h-4 w-4" /> Hypoxemia (Low O2)
                        </div>
                        <ul className="text-sm space-y-2 font-medium text-slate-700">
                          <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-slate-400" /> <span className="font-bold text-blue-700">INCREASE MAP</span> (by 1-2 cmH2O)</li>
                          <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-slate-400" /> Increase FiO2</li>
                          <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-slate-400" /> Consider recruitment maneuver</li>
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-xl border shadow-sm space-y-2">
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                          <TrendingUp className="h-4 w-4" /> Hyperoxia (High O2)
                        </div>
                        <ul className="text-sm space-y-2 font-medium text-slate-700">
                          <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-slate-400" /> <span className="font-bold text-blue-700">DECREASE FiO2</span> (wean to &lt;50% first)</li>
                          <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-slate-400" /> Then <span className="font-bold text-blue-700">DECREASE MAP</span> (by 1-2 cmH2O)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* VENTILATION */}
                  <div className="p-6 space-y-6 bg-purple-50/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg text-purple-700">
                        <Activity className="h-5 w-5" />
                      </div>
                      <h3 className="font-black text-purple-900 tracking-tight text-lg">Ventilation (PaCO2)</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-xl border shadow-sm space-y-2">
                        <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                          <TrendingUp className="h-4 w-4" /> Hypercapnia (High CO2)
                        </div>
                        <ul className="text-sm space-y-2 font-medium text-slate-700">
                          <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-slate-400" /> <span className="font-bold text-purple-700">INCREASE Amplitude (Delta P)</span></li>
                          <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-slate-400" /> <span className="font-bold text-purple-700">DECREASE Frequency (Hz)</span> <span className="text-xs text-slate-400">(Bigger tidal volume)</span></li>
                          <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-slate-400" /> Check for ETT obstruction / Cuff leak</li>
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-xl border shadow-sm space-y-2">
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                          <TrendingDown className="h-4 w-4" /> Hypocapnia (Low CO2)
                        </div>
                        <ul className="text-sm space-y-2 font-medium text-slate-700">
                          <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-slate-400" /> <span className="font-bold text-purple-700">DECREASE Amplitude</span></li>
                          <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-slate-400" /> <span className="font-bold text-purple-700">INCREASE Frequency (Hz)</span></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: TROUBLESHOOTING */}
          <TabsContent value="troubleshooting" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <Card>
              <CardHeader className="border-b bg-red-50/30">
                <CardTitle className="text-lg flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" /> Acute Deterioration (DOPES)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="font-black text-slate-800 mb-3 text-sm">If patient acutely desaturates or becomes bradycardic:</h4>
                    <ul className="space-y-3 text-sm font-medium">
                      <li className="flex items-start gap-3">
                        <span className="font-black text-red-600 w-4">D</span>
                        <span><strong>Displacement:</strong> Is the ETT still in? (Check end-tidal CO2, disconnect and bag if unsure).</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="font-black text-red-600 w-4">O</span>
                        <span><strong>Obstruction:</strong> Mucus plugging is common on HFOV. Consider deep suctioning.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="font-black text-red-600 w-4">P</span>
                        <span><strong>Pneumothorax:</strong> Transilluminate or stat CXR. HFOV carries high barotrauma risk.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="font-black text-red-600 w-4">E</span>
                        <span><strong>Equipment:</strong> Check circuit integrity, water in tubing, oscillator failure.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="font-black text-red-600 w-4">S</span>
                        <span><strong>Stomach/Sedation:</strong> Abdominal distension? Is patient waking up and fighting the oscillator? Paralyze immediately if needed.</span>
                      </li>
                    </ul>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Hypotension upon Initiation</AlertTitle>
                    <AlertDescription className="mt-1">
                      High sustained MAP impedes venous return. Treat with fluid bolus (10 cc/kg) or start/increase inotropes (Epinephrine/Norepinephrine). Consider turning MAP down slightly if profound.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: WEANING */}
          <TabsContent value="weaning" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <Card>
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Weaning & Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                
                <div className="space-y-3">
                  <h4 className="text-xs font-black tracking-widest uppercase text-slate-500">Standard Weaning Pathway</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white border rounded-xl shadow-sm">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 font-black text-slate-500 text-sm">1</div>
                      <p className="text-sm font-medium">Wean <strong className="text-blue-600">FiO2</strong> first, targeting SpO2 88-92% (ARDS) or &gt;92% (other), until FiO2 &lt; 40-50%.</p>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white border rounded-xl shadow-sm">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 font-black text-slate-500 text-sm">2</div>
                      <p className="text-sm font-medium">Reduce <strong className="text-blue-600">MAP</strong> slowly by 1-2 cmH2O every 4-8 hours. Watch for derecruitment (sudden oxygen requirement).</p>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white border rounded-xl shadow-sm">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 font-black text-slate-500 text-sm">3</div>
                      <p className="text-sm font-medium">Transition to Conventional Vent when: <strong className="text-emerald-600">MAP &lt; 15-16 cmH2O</strong> and <strong className="text-emerald-600">FiO2 &lt; 40%</strong>.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <h4 className="text-xs font-black tracking-widest uppercase text-slate-500">Radiography</h4>
                    <p className="text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-xl border">
                      Target <strong>8.5 - 9 posterior ribs</strong> expansion on CXR. Shoot CXR 1-2 hours after initiation to assess lung volume.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-black tracking-widest uppercase text-slate-500">Blood Gas</h4>
                    <p className="text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-xl border">
                      Obtain ABG/CBG <strong>30-60 minutes</strong> after ANY change in settings, especially Amplitude or Frequency.
                    </p>
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  );
}
