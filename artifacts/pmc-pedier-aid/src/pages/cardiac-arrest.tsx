"use client";

import { useState, useMemo } from "react";
import { HeartPulse, AlertTriangle, ChevronDown, ChevronUp, Info, Stethoscope, Activity, Droplets, BookOpen, Wind, Syringe } from "lucide-react";
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
import { ArrestTimer } from "@/app/cardiac-arrest/arrest-timer";
import { UnifiedAirwayPanel } from "@/app/cardiac-arrest/unified-airway-panel";

// Helper functions (moved from ResuscitationCalculator for consistency)
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

export default function CardiacArrestPage() {
  const [weight, setWeight] = useState<number | string>("");
  const [age, setAge] = useState<number | string>("");
  const [ageUnit, setAgeUnit] = useState<"months" | "years">("years");
  const [inputType, setInputType] = useState<"weight" | "age">("weight");
  const [patientType, setPatientType] = useState("infant-child");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

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
          <h1 className="text-3xl font-black text-red-900 font-headline mb-2">Cardiac Arrest Mission Control</h1>
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
  const shock1 = round(finalWeight * 2, 0);
  const shock2 = round(finalWeight * 4, 0);

  const padSize = finalWeight < 10 ? "PEDIATRIC PADS" : "ADULT PADS";

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b shadow-sm -mx-4 px-4 py-3 flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 text-white p-2 rounded-lg">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight leading-none">MISSION CONTROL</h2>
            <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Pediatric Arrest</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Working Weight</p>
            <p className="text-xl font-black tracking-tighter leading-none">{finalWeight.toFixed(1)} <span className="text-sm opacity-50">kg</span></p>
          </div>
          <Button variant="outline" size="sm" onClick={() => { setWeight(""); setAge(""); }} className="h-8 text-[10px] font-bold uppercase tracking-wider px-2">
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Timing & Primary Doses */}
        <div className="lg:col-span-8 space-y-6">
          <ArrestTimer />

          {/* Adrenaline Dilution Alert */}
          <Alert variant="destructive" className="bg-red-950 border-red-800 text-white">
            <Syringe className="h-5 w-5 text-red-400" />
            <AlertTitle className="text-red-400 font-black uppercase tracking-widest text-xs">Epinephrine Dilution Required</AlertTitle>
            <AlertDescription className="text-sm font-medium">
              ER Stock is <span className="underline decoration-red-500 underline-offset-4">1:1,000 (1mg/mL)</span>. 
              <span className="block mt-1 text-red-100">
                To make <strong>1:10,000</strong>: Draw <strong>1 mL</strong> of 1:1,000 Adrenaline and dilute with <strong>9 mL</strong> of Normal Saline.
              </span>
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DoseBillboard
              label="Epinephrine (1:10,000)"
              value={epiMl}
              unit="mL IV/IO"
              subtitle={`${epiMg} mg (0.01 mg/kg)`}
              color="red"
            />
            <div className="grid grid-cols-1 gap-4">
              <div className="relative">
                <DoseBillboard
                  label="First Shock"
                  value={shock1}
                  unit="Joules"
                  subtitle="2 J/kg (Shockable only)"
                  color="amber"
                />
                <div className="absolute top-2 right-2 bg-slate-900 text-[8px] font-black text-white px-1.5 py-0.5 rounded border border-slate-700">
                  {padSize}
                </div>
              </div>
              <DoseBillboard
                label="Second Shock"
                value={shock2}
                unit="Joules"
                subtitle="4 J/kg (Subsequent 4-10 J/kg)"
                color="amber"
              />
            </div>
          </div>

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
                 <div className="flex justify-between text-sm border-b border-red-100 pb-1">
                   <span className="text-red-900/60 font-medium">Ratio (2-Rescuer)</span>
                   <span className="font-bold text-red-900">{ageCategory === "neonate" ? "3:1" : "15:2"}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-red-900/60 font-medium">Advanced Airway</span>
                   <span className="font-bold text-red-900">1 breath q2-3s</span>
                 </div>
               </CardContent>
             </Card>

             <Card className="border-emerald-200 bg-emerald-50/50">
               <CardHeader className="pb-2 pt-4 px-4">
                 <CardTitle className="text-sm font-bold text-emerald-800 uppercase flex items-center gap-2">
                   <Droplets className="h-4 w-4" /> Fluids & Glucose
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-4 space-y-2">
                 <div className="flex justify-between text-sm border-b border-emerald-100 pb-1">
                   <span className="text-emerald-900/60 font-medium">NS/RL Bolus (20mL/kg)</span>
                   <span className="font-bold text-emerald-900">{(finalWeight * 20).toFixed(0)} mL</span>
                 </div>
                 <div className="flex justify-between text-sm border-b border-emerald-100 pb-1">
                   <span className="text-emerald-900/60 font-medium">D10W Bolus (5mL/kg)</span>
                   <span className="font-bold text-emerald-900">{(finalWeight * 5).toFixed(0)} mL</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-emerald-900/60 font-medium">Defibrillator Type</span>
                   <span className="font-bold text-emerald-900">Biphasic Preferred</span>
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

          <Card className="border-slate-200 bg-slate-50/50">
            <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-bold text-slate-800 uppercase flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> Quick Reference
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowResources(!showResources)} className="h-6 w-6 p-0">
                {showResources ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CardHeader>
            {showResources && (
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-red-700 uppercase tracking-widest border-b pb-1">The H's</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-medium text-slate-700">
                    <span>Hypovolemia</span>
                    <span>Hydrogen Ion</span>
                    <span>Hypoxia</span>
                    <span>Hypo/Hyper K</span>
                    <span>Hypoglycemia</span>
                    <span>Hypothermia</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest border-b pb-1">The T's</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-medium text-slate-700">
                    <span>Tension Pneumo</span>
                    <span>Toxins</span>
                    <span>Tamponade</span>
                    <span>Thrombosis (P/C)</span>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="advanced-mode" checked={showAdvanced} onCheckedChange={setShowAdvanced} />
              <Label htmlFor="advanced-mode" className="text-xs font-bold uppercase tracking-widest text-slate-500">Show Advanced Doses</Label>
            </div>

            {showAdvanced && (
              <Card className="border-amber-200 bg-amber-50/30">
                <CardContent className="p-4 space-y-2">
                   <div className="flex justify-between text-xs py-1 border-b border-amber-100">
                     <span className="text-slate-600">Amiodarone (5mg/kg)</span>
                     <span className="font-bold">{(finalWeight * 5).toFixed(1)} mg</span>
                   </div>
                   <div className="flex justify-between text-xs py-1 border-b border-amber-100">
                     <span className="text-slate-600">Lidocaine (1mg/kg)</span>
                     <span className="font-bold">{(finalWeight * 1).toFixed(1)} mg</span>
                   </div>
                   <div className="flex justify-between text-xs py-1 border-b border-amber-100">
                     <span className="text-slate-600">Ca Gluconate 10% (0.5mL/kg)</span>
                     <span className="font-bold">{(finalWeight * 0.5).toFixed(1)} mL</span>
                   </div>
                   <div className="flex justify-between text-xs py-1">
                     <span className="text-slate-600">Na Bicarb 8.4% (1mEq/kg)</span>
                     <span className="font-bold">{(finalWeight * 1).toFixed(1)} mEq</span>
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
