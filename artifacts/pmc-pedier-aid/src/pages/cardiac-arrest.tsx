"use client";

import { useState, useMemo } from "react";
import { HeartPulse, AlertTriangle, ChevronDown, ChevronUp, Info, Stethoscope, Activity, Droplets, BookOpen, Wind, Syringe, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import { DoseBillboard } from "@/app/cardiac-arrest/dose-billboard";
import { ArrestTimer, ArrestState } from "@/app/cardiac-arrest/arrest-timer";
import { UnifiedAirwayPanel } from "@/app/cardiac-arrest/unified-airway-panel";

// Helper functions
const round = (value: number, decimals = 1) => Number(value.toFixed(decimals));

const estimateWeight = (age: number, unit: "months" | "years"): number => {
  if (!age || age <= 0) return 0;
  if (unit === "months") {
    if (age <= 12) return round(age / 2 + 4, 1);
    return 0;
  }
  if (unit === "years") {
    if (age <= 5) return round(age * 2 + 8, 1);
    if (age <= 12) return round(age * 3 + 7, 1);
    return round(age * 3 + 7, 1);
  }
  return 0;
};

const getAgeCategory = (ageInYears: number): "neonate" | "infant" | "toddler" | "child" | "adolescent" => {
  if (ageInYears < 1 / 12) return "neonate";
  if (ageInYears < 1) return "infant";
  if (ageInYears < 3) return "toddler";
  if (ageInYears < 13) return "child";
  return "adolescent";
};

interface ResuscitationEvent {
  time: string;
  msg: string;
}

export default function CardiacArrestPage() {
  const [weight, setWeight] = useState<number | string>("");
  const [age, setAge] = useState<number | string>("");
  const [ageUnit, setAgeUnit] = useState<"months" | "years">("years");
  const [inputType, setInputType] = useState<"weight" | "age">("weight");
  const [patientType, setPatientType] = useState("infant-child");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // New State-Based Engine Variables
  const [arrestState, setArrestState] = useState<ArrestState>("idle");
  const [events, setEvents] = useState<ResuscitationEvent[]>([]);
  const [shockCount, setShockCount] = useState(0);

  const addEvent = (msg: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setEvents(prev => [{ time: timeStr, msg }, ...prev].slice(0, 50));
  };

  const handleShock = () => {
    const nextShock = shockCount + 1;
    setShockCount(nextShock);
    addEvent(`Shock Delivered #${nextShock} (${getShockJoules(nextShock)} J)`);
  };

  const getShockJoules = (count: number) => {
    const w = Number(finalWeight) || 0;
    if (count === 1) return round(w * 2, 0);
    if (count === 2) return round(w * 4, 0);
    return Math.min(round(w * 10, 0), 200); // Max 10J/kg or adult max
  };

  const finalWeight = useMemo(() => {
    if (inputType === "weight") {
      const w = Number(weight);
      return w > 0 ? w : undefined;
    }
    const estimated = estimateWeight(Number(age), ageUnit);
    return estimated > 0 ? estimated : undefined;
  }, [weight, age, ageUnit, inputType]);

  const ageInYears = useMemo(() => {
    if (inputType === "age") {
      const a = Number(age);
      if (!a || a <= 0) return undefined;
      return ageUnit === "months" ? a / 12 : a;
    }
    if (inputType === "weight" && finalWeight) {
      if (finalWeight <= 10) return Math.max((finalWeight - 4) * 2, 1) / 12;
      if (finalWeight <= 20) return (finalWeight - 8) / 2;
      return (finalWeight - 7) / 3;
    }
    return undefined;
  }, [weight, age, ageUnit, inputType, finalWeight]);

  const ageCategory = useMemo(() => {
    if (patientType === "neonate") return "neonate";
    if (ageInYears === undefined) return undefined;
    return getAgeCategory(ageInYears);
  }, [ageInYears, patientType]);

  if (!isUnlocked || !finalWeight) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 pb-20">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <HeartPulse className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-black text-red-900 font-headline mb-2 text-balance">Cardiac Arrest Mission Control</h1>
          <p className="text-red-700/70 max-w-md">Immediate, high-visibility resuscitation parameters for pediatric emergencies.</p>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle>Initial Patient Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-widest font-bold opacity-70">Patient Type</Label>
              <RadioGroup value={patientType} onValueChange={setPatientType} className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="infant-child" id="type-child" />
                  <Label htmlFor="type-child" className="text-base cursor-pointer">Infant / Child</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="neonate" id="type-neonate" />
                  <Label htmlFor="type-neonate" className="text-base cursor-pointer">Neonate (PRP/NRP)</Label>
                </div>
              </RadioGroup>
            </div>

            <Tabs value={inputType} onValueChange={(v) => setInputType(v as any)}>
              <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger value="weight" className="text-base font-bold">Known Weight</TabsTrigger>
                <TabsTrigger value="age" className="text-base font-bold">Estimate by Age</TabsTrigger>
              </TabsList>

              <TabsContent value="weight" className="pt-6">
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    placeholder="00"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="text-4xl h-24 font-black text-center tabular-nums"
                    autoFocus
                  />
                  <span className="text-3xl font-black opacity-20 italic">kg</span>
                </div>
              </TabsContent>

              <TabsContent value="age" className="pt-6">
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    placeholder="00"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="text-4xl h-24 font-black text-center tabular-nums"
                  />
                  <Select value={ageUnit} onValueChange={(v) => setAgeUnit(v as any)}>
                    <SelectTrigger className="w-[160px] h-24 text-2xl font-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="years">Years</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {finalWeight && (
                  <p className="mt-4 text-center text-sm font-bold text-slate-500">
                    Estimated Weight: <span className="text-slate-900">{finalWeight} kg</span>
                  </p>
                )}
              </TabsContent>
            </Tabs>

            <Button 
              className="w-full h-16 text-lg sm:text-xl font-black uppercase tracking-wide sm:tracking-widest bg-red-600 hover:bg-red-700 shadow-xl disabled:opacity-20"
              disabled={!finalWeight}
              onClick={() => setIsUnlocked(true)}
            >
              Unlock Mission Control
            </Button>
          </CardContent>
        </Card>

        <Alert className="bg-amber-50 border-amber-200">
          <Info className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800 font-medium">
            Enter the weight and press the button to unlock the dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const epiMl = round(finalWeight * 0.1, 1);
  const epiMg = round(finalWeight * 0.01, 2);
  const padSize = finalWeight < 10 ? "PEDIATRIC PADS" : "ADULT PADS";

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b shadow-sm -mx-4 px-4 py-3 flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 text-white p-2 rounded-lg shadow-lg shadow-red-900/20">
            <HeartPulse className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight leading-none uppercase italic">
              {arrestState === "rosc" ? "Stabilization Mode" : arrestState === "tachycardia" ? "Tachycardia Mode" : "Resuscitation Mode"}
            </h2>
            <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">
              {arrestState === "shockable" ? "Shockable Rhythm" : arrestState === "non-shockable" ? "Non-Shockable Rhythm" : "Pediatric Alert"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Weight</p>
            <p className="text-xl font-black tracking-tighter leading-none">{finalWeight.toFixed(1)} <span className="text-sm opacity-50">kg</span></p>
          </div>
          <Button variant="outline" size="sm" onClick={() => { setIsUnlocked(false); setWeight(""); setArrestState("idle"); setEvents([]); }} className="h-8 text-[10px] font-bold uppercase tracking-wider px-2">
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <ArrestTimer onStateChange={setArrestState} onEvent={addEvent} />

          {/* Dynamic Billboards based on State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Context-Aware Primary Card */}
            {arrestState === "shockable" ? (
              <div className="relative group">
                <DoseBillboard
                  label={`Next Shock (#${shockCount + 1})`}
                  value={getShockJoules(shockCount + 1)}
                  unit="Joules"
                  subtitle={`${shockCount === 0 ? "2 J/kg" : shockCount === 1 ? "4 J/kg" : "Escalating (Max 10J/kg)"}`}
                  color="amber"
                />
                <Button 
                   className="absolute bottom-2 right-2 h-10 bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase px-3 rounded-md shadow-xl"
                   onClick={handleShock}
                >
                  Deliver & Log
                </Button>
                <div className="absolute top-2 right-2 bg-slate-900 text-[8px] font-black text-white px-1.5 py-0.5 rounded border border-slate-700">
                  {padSize}
                </div>
              </div>
            ) : arrestState === "rosc" ? (
              <DoseBillboard
                label="Target SpO2"
                value="94-99"
                unit="%"
                subtitle="Avoid Hyperoxia"
                color="blue"
              />
            ) : arrestState === "tachycardia" ? (
              <DoseBillboard
                label="Adenosine (1st Dose)"
                value={round(finalWeight * 0.1, 1)}
                unit="mg"
                subtitle="0.1 mg/kg Rapid IV Push"
                color="amber"
              />
            ) : (
              <DoseBillboard
                label="Epinephrine (1:10,000)"
                value={epiMl}
                unit="mL IV/IO"
                subtitle={`${epiMg} mg (0.01 mg/kg)`}
                color="red"
              />
            )}

            {/* Context-Aware Secondary Card */}
            {arrestState === "shockable" ? (
              <DoseBillboard
                label="Amiodarone (Shockable)"
                value={round(finalWeight * 5, 1)}
                unit="mg"
                subtitle="5 mg/kg (After 3rd shock)"
                color="red"
              />
            ) : arrestState === "rosc" ? (
              <DoseBillboard
                label="Systolic BP Goal"
                value={round(70 + (2 * (ageInYears || 0)), 0)}
                unit="mmHg"
                subtitle="5th Percentile (PALS)"
                color="green"
              />
            ) : arrestState === "tachycardia" ? (
              <DoseBillboard
                label="Sync Cardioversion"
                value={round(finalWeight * 0.5, 0)}
                unit="Joules"
                subtitle="0.5 – 1 J/kg"
                color="red"
              />
            ) : (
              <div className="bg-red-950 border border-red-800 rounded-xl p-4 flex flex-col justify-center shadow-lg">
                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Adrenaline Dilution</p>
                <p className="text-xs text-red-100 font-medium leading-relaxed">
                  Draw <span className="text-white font-black underline decoration-red-500">1 mL</span> of 1:1,000 and add <span className="text-white font-black underline decoration-red-500">9 mL</span> Normal Saline to make 1:10,000.
                </p>
              </div>
            )}
          </div>

          {/* Timeline Log */}
          <Card className="bg-slate-900 border-none text-white overflow-hidden shadow-2xl">
            <CardHeader className="py-3 px-4 bg-slate-800/50 flex flex-row items-center justify-between space-y-0 border-b border-slate-700/50">
               <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                 <Activity className="h-3 w-3 text-red-500" /> Resuscitation Timeline
               </CardTitle>
               <div className="flex items-center gap-3">
                 <Button
                   variant="ghost"
                   size="icon"
                   className="h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-700"
                   onClick={() => {
                     const printWindow = window.open('', '_blank', 'width=600,height=800');
                     if (printWindow) {
                       printWindow.document.write(`
                         <html>
                           <head>
                             <title>Resuscitation Timeline</title>
                             <style>
                               body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; background: #0f172a; color: #f8fafc; }
                               h1 { font-size: 1.25rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 2px solid #334155; padding-bottom: 12px; margin-bottom: 24px; color: #94a3b8; }
                               .event { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; padding: 12px; background: #1e293b; border-radius: 8px; border-left: 4px solid #dc2626; }
                               .time { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; color: #94a3b8; font-size: 0.85rem; font-weight: 700; width: 70px; }
                               .msg { color: #f1f5f9; font-weight: 600; font-size: 0.95rem; }
                               .empty { color: #64748b; font-style: italic; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
                             </style>
                           </head>
                           <body>
                             <h1>Resuscitation Timeline - ${new Date().toLocaleDateString()}</h1>
                             ${events.length === 0 ? '<p class="empty">No events recorded.</p>' : events.map(e => 
                               '<div class="event">' +
                                 '<span class="time">' + e.time + '</span>' +
                                 '<span class="msg">' + e.msg + '</span>' +
                               '</div>'
                             ).join('')}
                           </body>
                         </html>
                       `);
                       printWindow.document.close();
                     }
                   }}
                   title="Open in new window for screenshot"
                 >
                   <ExternalLink className="h-3 w-3" />
                 </Button>
                 <span className="text-[8px] font-bold text-slate-500">LATEST 50 EVENTS</span>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="max-h-[160px] overflow-y-auto divide-y divide-slate-800 scrollbar-hide">
                 {events.length === 0 ? (
                   <div className="py-8 text-center text-xs text-slate-600 font-bold italic uppercase tracking-widest">Awaiting intervention...</div>
                 ) : (
                   events.map((e, i) => (
                     <div key={i} className="px-4 py-2 flex items-center gap-3 animate-in slide-in-from-left-2 duration-300">
                        <span className="text-[10px] font-mono text-slate-500">{e.time}</span>
                        <div className="h-1.5 w-1.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                        <span className="text-xs font-bold tracking-tight text-slate-200">{e.msg}</span>
                     </div>
                   ))
                 )}
               </div>
            </CardContent>
          </Card>

          {/* Core Support Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Card className="border-red-200 bg-red-50/50">
               <CardHeader className="pb-2 pt-4 px-4">
                 <CardTitle className="text-sm font-bold text-red-800 uppercase flex items-center gap-2">
                   <Activity className="h-4 w-4" /> CPR Quality
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-4 space-y-2">
                 <div className="flex justify-between text-sm border-b border-red-100 pb-1">
                   <span className="text-red-900/60 font-medium">Rate</span>
                   <span className="font-bold text-red-900">100–120 /min</span>
                 </div>
                 <div className="flex justify-between text-sm border-b border-red-100 pb-1">
                   <span className="text-red-900/60 font-medium">Depth</span>
                   <span className="font-bold text-red-900">1/3 AP Diameter</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-red-900/60 font-medium">Ratio</span>
                   <span className="font-bold text-red-900">{ageCategory === "neonate" ? "3:1" : "15:2"}</span>
                 </div>
               </CardContent>
             </Card>

             <Card className="border-emerald-200 bg-emerald-50/50">
               <CardHeader className="pb-2 pt-4 px-4">
                 <CardTitle className="text-sm font-bold text-emerald-800 uppercase flex items-center gap-2">
                   <Droplets className="h-4 w-4" /> Fluids
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-4 space-y-2">
                 <div className="flex justify-between text-sm border-b border-emerald-100 pb-1">
                   <span className="text-emerald-900/60 font-medium">Bolus (20mL/kg)</span>
                   <span className="font-bold text-emerald-900">{(finalWeight * 20).toFixed(0)} mL</span>
                 </div>
                 <div className="flex justify-between text-sm border-b border-emerald-100 pb-1">
                   <span className="text-emerald-900/60 font-medium">D10W (5mL/kg)</span>
                   <span className="font-bold text-emerald-900">{(finalWeight * 5).toFixed(0)} mL</span>
                 </div>
               </CardContent>
             </Card>
          </div>
        </div>

        {/* Right Column: Airway & Resources */}
        <div className="lg:col-span-4 space-y-6">
          <UnifiedAirwayPanel
            weight={finalWeight}
            ageInYears={ageInYears}
            ageCategory={ageCategory}
            patientType={patientType}
          />

          <Card className="border-slate-200 bg-slate-50/50 shadow-sm overflow-hidden">
            <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0 bg-slate-100/50 border-b">
              <CardTitle className="text-[11px] font-black text-slate-800 uppercase flex items-center gap-2 tracking-widest">
                <BookOpen className="h-3.5 w-3.5" /> 
                {arrestState === "rosc" ? "ROSC Checklist" : arrestState === "tachycardia" ? "SVT Protocol" : "Reversible Causes"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {arrestState === "rosc" ? (
                <ul className="space-y-2 text-xs font-bold text-slate-600 uppercase tracking-tighter">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> SpO2 94–99%</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> SBP {">"} 5th Percentile</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Targeted Temp Management</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Check Post-ROSC ABG/Glucose</li>
                </ul>
              ) : arrestState === "tachycardia" ? (
                <ul className="space-y-2 text-xs font-bold text-slate-600 uppercase tracking-tighter">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Vagal (Ice to Face / Syringe)</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 12-Lead ECG Immediately</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Assess Perfusion (Shock?)</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Prep Synchronized Shock</li>
                </ul>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black text-red-700 uppercase tracking-widest border-b pb-0.5">The H's</p>
                    <div className="grid grid-cols-2 gap-x-2 text-[10px] font-bold text-slate-700 uppercase">
                      <span>Hypovolemia</span>
                      <span>Hydrogen Ion</span>
                      <span>Hypoxia</span>
                      <span>Hypo/Hyper K</span>
                      <span>Hypoglycemia</span>
                      <span>Hypothermia</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black text-blue-700 uppercase tracking-widest border-b pb-0.5">The T's</p>
                    <div className="grid grid-cols-2 gap-x-2 text-[10px] font-bold text-slate-700 uppercase">
                      <span>Tension Pneumo</span>
                      <span>Toxins</span>
                      <span>Tamponade</span>
                      <span>Thrombosis</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="advanced-mode" checked={showAdvanced} onCheckedChange={setShowAdvanced} />
              <Label htmlFor="advanced-mode" className="text-xs font-bold uppercase tracking-widest text-slate-500">Advanced Doses</Label>
            </div>

            {showAdvanced && (
              <Card className="border-amber-200 bg-amber-50/30">
                <CardContent className="p-4 space-y-2">
                   <div className="flex justify-between text-[11px] py-1 border-b border-amber-100 uppercase font-bold">
                     <span className="text-slate-500">Lidocaine</span>
                     <span>{(finalWeight * 1).toFixed(1)} mg</span>
                   </div>
                   <div className="flex justify-between text-[11px] py-1 border-b border-amber-100 uppercase font-bold">
                     <span className="text-slate-500">Ca Gluconate</span>
                     <span>{(finalWeight * 0.5).toFixed(1)} mL</span>
                   </div>
                   <div className="flex justify-between text-[11px] py-1 uppercase font-bold">
                     <span className="text-slate-500">Na Bicarb</span>
                     <span>{(finalWeight * 1).toFixed(1)} mEq</span>
                   </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
