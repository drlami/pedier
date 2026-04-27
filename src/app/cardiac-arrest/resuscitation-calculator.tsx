"use client";

import { useState, useMemo, useCallback, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Copy, AlertTriangle, Syringe, HeartPulse, Zap, Wind, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Helper Functions ---
const estimateWeight = (age: number, unit: 'months' | 'years'): number => {
  if (unit === 'months' && age >= 0 && age <= 12) {
    return (age / 2) + 4;
  }
  if (unit === 'years') {
    if (age >= 1 && age <= 5) return (age * 2) + 8;
    if (age >= 6 && age <= 12) return (age * 3) + 7;
  }
  return 0;
};

const getAgeCategory = (ageInYears: number): 'neonate' | 'infant' | 'toddler' | 'child' => {
  if (ageInYears < 1/12) return 'neonate';
  if (ageInYears < 1) return 'infant';
  if (ageInYears < 3) return 'toddler';
  return 'child';
}

const getBlade = (age?: number) => {
    if(age === undefined) return 'N/A';
    const category = getAgeCategory(age);
    if(category === 'neonate' || category === 'infant') return 'Miller 1 (Straight)';
    if(category === 'toddler') return 'Miller 2 (Straight)';
    return 'Mac 2-3 (Curved)';
}

// --- Display Components ---
const ResultCard = ({ title, icon: Icon, children }: { title: string, icon: React.ElementType, children: React.ReactNode }) => (
  <Card className="print-no-break-inside">
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-3 text-lg font-headline text-primary">
        <Icon className="h-6 w-6" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="text-sm">
      {children}
    </CardContent>
  </Card>
);

const ResultRow = ({ label, value, unit = '', className = '' }: { label: string, value: string | number, unit?: string, className?: string }) => (
  <div className="flex justify-between items-center py-2 border-b">
    <p className="text-muted-foreground">{label}</p>
    <p className={cn("font-bold text-base text-right", className)}>{value} <span className="font-normal text-muted-foreground">{unit}</span></p>
  </div>
);


export function ResuscitationCalculator() {
  const [weight, setWeight] = useState<number | string>('');
  const [age, setAge] = useState<number | string>('');
  const [ageUnit, setAgeUnit] = useState<'months' | 'years'>('years');
  const [inputType, setInputType] = useState<'weight' | 'age'>('weight');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();
  const summaryRef = useRef<HTMLDivElement>(null);

  const finalWeight = useMemo(() => {
    if (inputType === 'weight') return Number(weight) > 0 ? Number(weight) : undefined;
    if (inputType === 'age') {
      const estimated = estimateWeight(Number(age), ageUnit);
      return estimated > 0 ? estimated : undefined;
    }
    return undefined;
  }, [weight, age, ageUnit, inputType]);

  const ageInYears = useMemo(() => {
      if (inputType === 'age' && ageUnit === 'years') return Number(age);
      if (inputType === 'age' && ageUnit === 'months') return Number(age) / 12;
      if (inputType === 'weight') {
        // Reverse-engineer age for ETT sizing if weight is known
        const w = Number(weight);
        if (w <= 10) return (w-4)*2 / 12; // Infant-ish
        if (w > 10 && w <= 20) return (w-8)/2; // 1-5 years
        if (w > 20) return (w-7)/3; // 6-12 years
      }
      return undefined;
  }, [weight, age, ageUnit, inputType]);

  const ageCategory = useMemo(() => ageInYears ? getAgeCategory(ageInYears) : undefined, [ageInYears]);

  const ettSize = useMemo(() => {
    if (ageInYears === undefined || finalWeight === undefined) return { uncuffed: 'N/A', cuffed: 'N/A', depth: 'N/A' };
    
    if (ageCategory === 'neonate') {
      let size;
      if (finalWeight < 1) size = 2.5;
      else if (finalWeight < 2) size = 3.0;
      else size = 3.5;
      
      const depth = finalWeight + 6; // Tip-to-lip depth
      return { uncuffed: size.toFixed(1), cuffed: 'N/A (uncuffed used)', depth: depth.toFixed(1) };
    }

    // PALS formula for older children
    const uncuffedSize = (ageInYears / 4) + 4;
    const cuffedSize = (ageInYears / 4) + 3.5;
    const depth = cuffedSize * 3; // Oral depth

    return {
        uncuffed: uncuffedSize.toFixed(1),
        cuffed: cuffedSize.toFixed(1),
        depth: depth.toFixed(1)
    }
  }, [ageInYears, finalWeight, ageCategory]);

  const handleCopy = useCallback(() => {
    if (summaryRef.current) {
      const text = summaryRef.current.innerText;
      navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Resuscitation summary copied to clipboard.",
      });
    }
  }, [toast]);
  

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enter Patient Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={inputType} onValueChange={(v) => setInputType(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="weight">Weight</TabsTrigger>
              <TabsTrigger value="age">Age</TabsTrigger>
            </TabsList>
            <TabsContent value="weight" className="pt-4">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Enter weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="text-lg"
                />
                <Label className="text-lg">kg</Label>
              </div>
            </TabsContent>
            <TabsContent value="age" className="pt-4">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Enter age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="text-lg"
                />
                <Select value={ageUnit} onValueChange={(v) => setAgeUnit(v as any)}>
                  <SelectTrigger className="w-[120px] text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="years">Years</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               {Number(age) > 0 && finalWeight && <p className="text-sm text-muted-foreground mt-2">Estimated Weight: <span className="font-bold">{finalWeight.toFixed(1)} kg</span></p>}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {finalWeight && finalWeight > 0 ? (
        <div className="space-y-4" ref={summaryRef}>
            <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <AlertTriangle className="text-destructive h-6 w-6" />
                    <h2 className="text-2xl font-bold font-headline">Resuscitation Summary</h2>
                 </div>
                 <Button onClick={handleCopy} variant="outline" size="sm">
                    <Copy className="mr-2" /> Copy
                 </Button>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <ResultCard title="Airway Equipment" icon={Wind}>
                <ResultRow label="Uncuffed ETT Size" value={ettSize.uncuffed} />
                <ResultRow label="Cuffed ETT Size" value={ettSize.cuffed} />
                <ResultRow label="Insertion Depth (Oral)" value={ettSize.depth} unit="cm" />
                <ResultRow label="Laryngoscope Blade" value={getBlade(ageInYears)} />
            </ResultCard>

            <ResultCard title="Defibrillation" icon={Zap}>
                 <ResultRow label="First Shock" value={(2 * finalWeight).toFixed(0)} unit="Joules" className="text-amber-500" />
                 <ResultRow label="Second Shock" value={(4 * finalWeight).toFixed(0)} unit="Joules" className="text-orange-500" />
                 <ResultRow label="Subsequent Shocks" value={`${(4 * finalWeight).toFixed(0)} - ${(10 * finalWeight).toFixed(0)}`} unit="Joules" className="text-red-500" />
            </ResultCard>

             <ResultCard title="Medications" icon={Syringe}>
                <ResultRow label="Adrenaline (1:10,000)" value={(0.1 * finalWeight).toFixed(2)} unit="mL" />
                <ResultRow label="Amiodarone Bolus" value={Math.min(5 * finalWeight, 300).toFixed(1)} unit="mg" />
                {showAdvanced && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-semibold text-muted-foreground mb-2">Advanced Medications</p>
                    <ResultRow label="Atropine (min 0.1mg)" value={Math.max(0.02 * finalWeight, 0.1).toFixed(2)} unit="mg" />
                    <ResultRow label="Sodium Bicarbonate" value={(1 * finalWeight).toFixed(1)} unit="mEq" />
                    <ResultRow label="Calcium Gluconate 10%" value={Math.min(1 * finalWeight, 20).toFixed(1)} unit="mL" />
                  </div>
                )}
            </ResultCard>

            <ResultCard title="Fluids & Glucose" icon={Droplets}>
                 <ResultRow label="NS Bolus" value={(20 * finalWeight).toFixed(0)} unit="mL" />
                 <ResultRow label="D10 Bolus" value={(5 * finalWeight).toFixed(0)} unit="mL" />
            </ResultCard>

            <div className="md:col-span-2">
                <ResultCard title="CPR Parameters" icon={HeartPulse}>
                     {ageCategory === 'neonate' ? (
                        <>
                            <p className="text-center font-bold text-amber-600 mb-2">NRP Guidelines</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div><p className="font-bold text-lg">3:1</p><p className="text-xs text-muted-foreground">Comp:Vent Ratio</p></div>
                                <div><p className="font-bold text-lg">90</p><p className="text-xs text-muted-foreground">Comp/min</p></div>
                                <div><p className="font-bold text-lg">30</p><p className="text-xs text-muted-foreground">Breaths/min</p></div>
                                <div><p className="font-bold text-lg">1/3 Chest</p><p className="text-xs text-muted-foreground">Depth</p></div>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-center font-bold text-primary mb-2">PALS Guidelines</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div><p className="font-bold text-lg">100-120</p><p className="text-xs text-muted-foreground">Comp/min</p></div>
                                <div><p className="font-bold text-lg">1/3 Chest</p><p className="text-xs text-muted-foreground">Depth</p></div>
                                <div><p className="font-bold text-lg">30:2</p><p className="text-xs text-muted-foreground">1 Rescuer Ratio</p></div>
                                <div><p className="font-bold text-lg">15:2</p><p className="text-xs text-muted-foreground">2 Rescuer Ratio</p></div>
                            </div>
                            <div className="text-center mt-4 pt-2 border-t">
                                <p className="font-semibold">With Advanced Airway</p>
                                <p className="text-sm text-muted-foreground">Continuous compressions, with 1 breath every 2-3 seconds (20-30 breaths/min).</p>
                            </div>
                        </>
                    )}
                </ResultCard>
            </div>
          </div>
            <div className="flex items-center space-x-2 mt-4">
                <Switch id="advanced-mode" checked={showAdvanced} onCheckedChange={setShowAdvanced} />
                <Label htmlFor="advanced-mode">Show Advanced Medications (Atropine, Bicarb, Calcium)</Label>
            </div>
        </div>
      ) : (
        <Card className="text-center py-12">
            <CardContent>
                <p className="text-muted-foreground">Enter a weight or age to generate resuscitation parameters.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
