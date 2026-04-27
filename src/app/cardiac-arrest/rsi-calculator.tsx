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
import { Copy, AlertTriangle, Syringe, Wind, Brain, CheckSquare, HeartCrack } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

const getAgeCategory = (ageInYears: number): 'neonate' | 'infant' | 'toddler' | 'child' | 'adolescent' => {
  if (ageInYears < 1/12) return 'neonate';
  if (ageInYears < 1) return 'infant';
  if (ageInYears < 3) return 'toddler';
  if (ageInYears < 13) return 'child';
  return 'adolescent';
}

const getVentilatorSettings = (ageCategory: 'neonate' | 'infant' | 'toddler' | 'child' | 'adolescent') => {
    switch(ageCategory) {
        case 'neonate':
        case 'infant':
            return { rr: '25-30' };
        case 'toddler':
            return { rr: '20-25' };
        case 'child':
            return { rr: '16-20' };
        case 'adolescent':
            return { rr: '12-16' };
        default:
            return { rr: 'N/A' };
    }
}

// --- Display Components ---
const ResultCard = ({ title, icon: Icon, children, className }: { title: string, icon?: React.ElementType, children: React.ReactNode, className?: string }) => (
  <Card className={cn("print-no-break-inside", className)}>
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-3 text-lg font-headline text-primary">
        {Icon && <Icon className="h-6 w-6" />}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="text-sm space-y-2">
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

const SoapMeDialog = () => (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="font-headline text-primary">RSI Checklist: SOAPME</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <p><strong className="text-primary">S</strong> - Suction: Yankauer and suction catheters checked and ready.</p>
        <p><strong className="text-primary">O</strong> - Oxygen: BVM, 100% O2 source, nasal cannula for apneic oxygenation.</p>
        <p><strong className="text-primary">A</strong> - Airway: Laryngoscope (checked light), blades (primary + backup), ETTs (correct size + 0.5 smaller/larger), stylet, syringes.</p>
        <p><strong className="text-primary">P</strong> - Pharmacy: All RSI drugs drawn up, labeled, and doses confirmed.</p>
        <p><strong className="text-primary">M</strong> - Monitors: Continuous pulse oximetry, cardiac monitor (EKG), blood pressure cuff cycling, end-tidal CO2 detector.</p>
        <p><strong className="text-primary">E</strong> - Emergency: Backup airway plan (LMA, cricothyrotomy kit), designated personnel for help.</p>
      </div>
    </DialogContent>
)

export function RsiCalculator() {
  const [weight, setWeight] = useState<number | string>('');
  const [age, setAge] = useState<number | string>('');
  const [ageUnit, setAgeUnit] = useState<'months' | 'years'>('years');
  const [inputType, setInputType] = useState<'weight' | 'age'>('weight');
  const [pretreatment, setPretreatment] = useState(false);
  const [difficultAirway, setDifficultAirway] = useState(false);
  const [inShock, setInShock] = useState(false);
  const [asthmatic, setAsmatic] = useState(false);
  const [tbi, setTbi] = useState(false);
  const [inductionAgent, setInductionAgent] = useState('ketamine');
  
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
      // Estimate age from weight for vent settings if not entered directly
      if (inputType === 'weight' && finalWeight) {
        if (finalWeight <= 10) return 0.5; // Infant
        if (finalWeight > 10 && finalWeight <= 14) return 2; // Toddler
        if (finalWeight > 14) return 7; // Child
      }
      return undefined;
  }, [weight, age, ageUnit, inputType, finalWeight]);

  const ageCategory = useMemo(() => ageInYears ? getAgeCategory(ageInYears) : undefined, [ageInYears]);

  const handleCopy = useCallback(() => {
    if (summaryRef.current) {
      const text = summaryRef.current.innerText;
      navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Rapid Sequence Intubation summary copied to clipboard.",
      });
    }
  }, [toast]);
  
  const preferredInduction = useMemo(() => {
      if(inShock || asthmatic) return 'Ketamine';
      if(tbi) return 'Etomidate';
      return 'Ketamine or Etomidate';
  }, [inShock, asthmatic, tbi]);


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
                <Input type="number" placeholder="Enter weight" value={weight} onChange={(e) => setWeight(e.target.value)} className="text-lg" />
                <Label className="text-lg">kg</Label>
              </div>
            </TabsContent>
            <TabsContent value="age" className="pt-4">
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="Enter age" value={age} onChange={(e) => setAge(e.target.value)} className="text-lg" />
                <Select value={ageUnit} onValueChange={(v) => setAgeUnit(v as any)}>
                  <SelectTrigger className="w-[120px] text-lg"><SelectValue /></SelectTrigger>
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
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold font-headline">Rapid Sequence Intubation Summary</h2>
                 </div>
                 <div className='flex gap-2'>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline"><CheckSquare className="mr-2"/> SOAPME</Button>
                        </DialogTrigger>
                        <SoapMeDialog />
                    </Dialog>
                    <Button onClick={handleCopy}><Copy className="mr-2" /> Copy Summary</Button>
                 </div>
            </div>

            <div className="space-y-2 p-4 border rounded-lg bg-secondary/30">
                <h3 className="font-semibold text-lg">Special Considerations</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2"><Switch id="difficult-airway" checked={difficultAirway} onCheckedChange={setDifficultAirway}/><Label htmlFor="difficult-airway">Difficult Airway?</Label></div>
                    <div className="flex items-center space-x-2"><Switch id="shock-mode" checked={inShock} onCheckedChange={setInShock}/><Label htmlFor="shock-mode">In Shock?</Label></div>
                    <div className="flex items-center space-x-2"><Switch id="asthma-mode" checked={asthmatic} onCheckedChange={setAsmatic}/><Label htmlFor="asthma-mode">Asthmatic?</Label></div>
                    <div className="flex items-center space-x-2"><Switch id="tbi-mode" checked={tbi} onCheckedChange={setTbi}/><Label htmlFor="tbi-mode">Traumatic Brain Injury?</Label></div>
                 </div>
                 {difficultAirway && <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>DIFFICULT AIRWAY</AlertTitle><AlertDescription>Call senior airway support (Anesthesia/PICU) BEFORE RSI attempt.</AlertDescription></Alert>}
                 {(inShock || asthmatic || tbi) && <Alert><AlertTriangle className="h-4 w-4" /><AlertTitle>Recommendation</AlertTitle><AlertDescription>Preferred induction agent: <span className='font-bold'>{preferredInduction}</span>. {inShock && 'Avoid Propofol. Prepare fluid bolus.'}</AlertDescription></Alert>}
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" ref={summaryRef}>
            
            <ResultCard title="Pre-oxygenation & Pretreatment" icon={Wind}>
                <div>
                    <h4 className='font-semibold'>Pre-oxygenation Plan</h4>
                    <ul className='list-disc list-inside mt-1'>
                        <li>Use 100% FiO₂ for 3 minutes.</li>
                        <li>For hypoxic child, use BVM with PEEP.</li>
                        <li>For severe respiratory failure, use apneic oxygenation via nasal cannula.</li>
                    </ul>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                    <Switch id="pretreatment-mode" checked={pretreatment} onCheckedChange={setPretreatment} />
                    <Label htmlFor="pretreatment-mode">Show Pretreatment (Atropine)</Label>
                </div>
                {pretreatment && (
                    <div className='mt-2'>
                        <ResultRow label="Atropine" value={Math.max(0.1, Math.min(0.02 * finalWeight, ageCategory === 'adolescent' ? 1 : 0.5)).toFixed(2)} unit="mg"/>
                        <p className='text-xs text-muted-foreground mt-1'>Recommended for infants, bradycardia risk, or 2nd attempt.</p>
                    </div>
                )}
            </ResultCard>

             <ResultCard title="Induction & Paralysis" icon={Syringe}>
                <div>
                    <Label htmlFor="induction-agent">Induction Agent</Label>
                    <Select value={inductionAgent} onValueChange={setInductionAgent}>
                        <SelectTrigger id="induction-agent" className='mt-1'><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ketamine">Ketamine</SelectItem>
                            <SelectItem value="etomidate">Etomidate</SelectItem>
                            <SelectItem value="propofol">Propofol {inShock ? '(AVOID)' : ''}</SelectItem>
                            <SelectItem value="midazolam">Midazolam</SelectItem>
                        </SelectContent>
                    </Select>
                     <div className='mt-2 space-y-1 text-sm'>
                        {inductionAgent === 'ketamine' && <p>Dose (1-2 mg/kg): <span className='font-bold'>{finalWeight.toFixed(1)} - {(2*finalWeight).toFixed(1)} mg</span></p>}
                        {inductionAgent === 'etomidate' && <p>Dose (0.3 mg/kg): <span className='font-bold'>{(0.3*finalWeight).toFixed(1)} mg</span></p>}
                        {inductionAgent === 'propofol' && <p>Dose (1-2 mg/kg): <span className='font-bold'>{finalWeight.toFixed(1)} - {(2*finalWeight).toFixed(1)} mg</span></p>}
                        {inductionAgent === 'midazolam' && <p>Dose (0.1 mg/kg): <span className='font-bold'>{(0.1*finalWeight).toFixed(1)} mg</span></p>}
                    </div>
                </div>
                <div className='mt-4 pt-4 border-t'>
                    <h4 className='font-semibold'>Paralytic</h4>
                    <ResultRow label="Rocuronium" value={(1.2 * finalWeight).toFixed(1)} unit="mg" />
                    <ResultRow label="Succinylcholine" value={(2 * finalWeight).toFixed(1)} unit="mg" />
                    <Alert variant="destructive" className='mt-2'><HeartCrack className='h-4 w-4'/><AlertTitle>Succinylcholine Contraindications</AlertTitle><AlertDescription className="text-xs">{'Neuromuscular disease, burns >48h, hyperkalemia risk, crush injury.'}</AlertDescription></Alert>
                </div>
            </ResultCard>

             <ResultCard title="Post-Intubation" icon={Brain}>
                <div>
                    <h4 className='font-semibold'>Confirmation Checklist</h4>
                    <ul className='list-disc list-inside mt-1'>
                        <li>Sustained End-tidal CO₂</li>
                        <li>Bilateral chest rise</li>
                        <li>Bilateral breath sounds</li>
                        <li>Absence of epigastric sounds</li>
                        <li>Improved SpO₂</li>
                        <li>CXR confirmation</li>
                    </ul>
                </div>
                <div className='mt-4 pt-4 border-t'>
                    <h4 className='font-semibold'>Initial Ventilator Settings</h4>
                    <ResultRow label="Respiratory Rate" value={ageCategory ? getVentilatorSettings(ageCategory).rr : 'N/A'} unit="/min" />
                    <ResultRow label="Tidal Volume" value={`${(6 * finalWeight).toFixed(0)} - ${(8 * finalWeight).toFixed(0)}`} unit="mL (6-8 mL/kg)" />
                    <ResultRow label="PEEP" value="5" unit="cm H₂O" />
                    <ResultRow label="FiO₂" value="100" unit="%, then titrate" />
                </div>
                <div className='mt-4 pt-4 border-t'>
                    <h4 className='font-semibold'>Analgesia & Sedation</h4>
                    <ResultRow label="Fentanyl" value={`${(1 * finalWeight).toFixed(1)} - ${(2 * finalWeight).toFixed(1)}`} unit="mcg (1-2 mcg/kg)" />
                    <ResultRow label="Midazolam" value={(0.1 * finalWeight).toFixed(1)} unit="mg (0.1 mg/kg)" />
                    <ResultRow label="Ketamine" value={(finalWeight).toFixed(1)} unit="mg (1 mg/kg)" />
                </div>
            </ResultCard>
          </div>
        </div>
      ) : (
        <Card className="text-center py-12">
            <CardContent>
                <p className="text-muted-foreground">Enter a weight or age to generate Rapid Sequence Intubation parameters.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
