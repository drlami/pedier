'use client';

import { useState, useMemo } from "react";
import { 
  ArrowLeft, Scale, Calculator, Info, Apple, Activity, 
  AlertCircle, ChevronRight, Printer, CheckCircle2, TrendingUp,
  Droplets, FlaskConical, Beaker, Pill
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
import { 
    WHO_WEIGHT_BOYS, WHO_WEIGHT_GIRLS, 
    WHO_HEIGHT_BOYS, WHO_HEIGHT_GIRLS,
    GrowthPoint
} from "@/lib/calculators/growth-data";

// --- Nutritional Data & Formulas ---

// RDA for Energy by Age (kcal/kg/day)
const RDA_ENERGY: Record<string, number> = {
  '0-3': 105,
  '4-12': 95,
  '13-36': 85,
  '37-72': 75,
  '73-144': 65,
};

// RDA for Protein by Age (g/kg/day)
const RDA_PROTEIN: Record<string, number> = {
  '0-6': 1.5,
  '7-12': 1.2,
  '13-36': 1.1,
  '37-144': 0.95,
};

function getRDA(ageMonths: number, mapping: Record<string, number>): number {
  if (ageMonths <= 3) return mapping['0-3'] || mapping['0-6'];
  if (ageMonths <= 6) return mapping['0-6'] || mapping['4-12'];
  if (ageMonths <= 12) return mapping['4-12'] || mapping['7-12'];
  if (ageMonths <= 36) return mapping['13-36'];
  if (ageMonths <= 72) return mapping['37-72'] || mapping['37-144'];
  return mapping['73-144'] || mapping['37-144'];
}

function interpolate(x: number, data: GrowthPoint[], key: keyof GrowthPoint): number {
  const sorted = [...data].sort((a, b) => a.month - b.month);
  if (x <= sorted[0].month) return sorted[0][key];
  if (x >= sorted[sorted.length - 1].month) return sorted[sorted.length - 1][key];

  for (let i = 0; i < sorted.length - 1; i++) {
    if (x >= sorted[i].month && x <= sorted[i + 1].month) {
      const t = (x - sorted[i].month) / (sorted[i + 1].month - sorted[i].month);
      return sorted[i][key] + t * (sorted[i + 1][key] - sorted[i][key]);
    }
  }
  return sorted[0][key];
}

function findAgeForHeight(height: number, data: GrowthPoint[]): number {
  const sorted = [...data].sort((a, b) => a.month - b.month);
  if (height <= sorted[0].p50) return sorted[0].month;
  if (height >= sorted[sorted.length - 1].p50) return sorted[sorted.length - 1].month;

  for (let i = 0; i < sorted.length - 1; i++) {
    if (height >= sorted[i].p50 && height <= sorted[i + 1].p50) {
      const t = (height - sorted[i].p50) / (sorted[i + 1].p50 - sorted[i].p50);
      return sorted[i].month + t * (sorted[i + 1].month - sorted[i].month);
    }
  }
  return sorted[0].month;
}

export default function NutritionalRecoveryPage() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [ageMonths, setAgeMonths] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");

  const results = useMemo(() => {
    const age = parseFloat(ageMonths);
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (isNaN(age) || isNaN(w) || isNaN(h) || w === 0) return null;

    const heightData = sex === 'male' ? WHO_HEIGHT_BOYS : WHO_HEIGHT_GIRLS;
    const weightData = sex === 'male' ? WHO_WEIGHT_BOYS : WHO_WEIGHT_GIRLS;

    // 1. Calculate IBW (Ideal Body Weight for Height)
    const heightAge = findAgeForHeight(h, heightData);
    const ibw = interpolate(heightAge, weightData, 'p50');

    // 2. RDA for actual age
    const rdaEnergy = getRDA(age, RDA_ENERGY);
    const rdaProtein = getRDA(age, RDA_PROTEIN);

    // 3. Catch-up Requirements (Waterlow)
    const catchupEnergy = (rdaEnergy * ibw) / w;
    const catchupProtein = (rdaProtein * ibw) / w;

    const totalKcal = catchupEnergy * w;
    const totalProtein = catchupProtein * w;

    // 4. Weight Gain Target (g/day)
    // Rule of thumb: Catch-up gain is often 2-3x the normal rate
    // Normal rates: 0-3m: 30g/d, 3-6m: 20g/d, 6-12m: 12g/d, 1-3y: 8g/d
    let normalGain = 5;
    if (age <= 3) normalGain = 30;
    else if (age <= 6) normalGain = 20;
    else if (age <= 12) normalGain = 12;
    else if (age <= 36) normalGain = 8;
    const targetGain = normalGain * 2;

    const percentIBW = (w / ibw) * 100;

    return {
      ibw: ibw.toFixed(1),
      catchupEnergy: catchupEnergy.toFixed(1),
      catchupProtein: catchupProtein.toFixed(2),
      totalKcal: totalKcal.toFixed(0),
      totalProtein: totalProtein.toFixed(1),
      targetGain,
      percentIBW: percentIBW.toFixed(1),
      isHighRisk: percentIBW < 75
    };
  }, [sex, ageMonths, weight, height]);

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
          <h1 className="text-4xl font-black tracking-tighter">Nutritional Recovery</h1>
          <p className="text-muted-foreground font-medium text-sm">Catch-up growth calculator and age-specific food roadmap.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUTS COLUMN */}
        <div className="lg:col-span-4 space-y-4 no-print">
          <Card className="rounded-[28px] border-2 shadow-sm bg-card overflow-hidden">
            <CardHeader className="bg-muted/30 border-b py-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Calculator className="h-4 w-4 text-primary" /> Clinical Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Patient Sex</Label>
                <Tabs value={sex} onValueChange={(v: any) => setSex(v)} className="w-full">
                  <TabsList className="grid grid-cols-2 w-full h-10 rounded-xl p-1 bg-muted/50">
                    <TabsTrigger value="male" className="rounded-lg font-bold text-xs">Male</TabsTrigger>
                    <TabsTrigger value="female" className="rounded-lg font-bold text-xs">Female</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Age (Months)</Label>
                <Input 
                  id="age" type="number" placeholder="e.g. 18" 
                  className="h-11 rounded-xl font-bold bg-muted/20"
                  value={ageMonths} onChange={(e) => setAgeMonths(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actual Weight (kg)</Label>
                <Input 
                  id="weight" type="number" placeholder="0.0" 
                  className="h-11 rounded-xl font-bold bg-muted/20 border-primary/20"
                  value={weight} onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actual Height (cm)</Label>
                <Input 
                  id="height" type="number" placeholder="0.0" 
                  className="h-11 rounded-xl font-bold bg-muted/20 border-primary/20"
                  value={height} onChange={(e) => setHeight(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {results?.isHighRisk && (
            <Alert variant="destructive" className="rounded-[24px] border-2 bg-red-50 text-red-900">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertTitle className="font-black text-xs uppercase tracking-wider">Refeeding Risk Alert</AlertTitle>
              <AlertDescription className="text-xs font-medium leading-relaxed mt-2">
                Patient is &lt; 75% of Ideal Body Weight. 
                <ul className="mt-2 space-y-1 list-disc list-inside opacity-80">
                  <li>Start energy at 50-75% of goal</li>
                  <li>Monitor K, Phos, Mg daily for 72h</li>
                  <li>Supplement Thiamine (Vitamin B1)</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* RESULTS & ROADMAP COLUMN */}
        <div className="lg:col-span-8 space-y-8">
          {results ? (
            <>
              {/* 1. NUTRITIONAL DASHBOARD */}
              <section className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">Nutritional Dashboard</h3>
                  <Button variant="outline" size="sm" className="h-8 rounded-xl gap-2 text-[10px] font-black uppercase no-print" onClick={() => window.print()}>
                    <Printer className="h-3.5 w-3.5" /> Print Order
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <ResultTile 
                    label="Ideal Body Weight" 
                    value={`${results.ibw} kg`} 
                    sub="50th %ile for height"
                    icon={TrendingUp}
                    color="indigo"
                  />
                  <ResultTile 
                    label="Energy Requirement" 
                    value={`${results.totalKcal}`} 
                    sub="Total kcal / day"
                    unit="kcal"
                    icon={Activity}
                    color="orange"
                  />
                  <ResultTile 
                    label="Target Weight Gain" 
                    value={`${results.targetGain}`} 
                    sub="Target g / day"
                    unit="g"
                    icon={TrendingUp}
                    color="emerald"
                  />
                </div>

                <Card className="rounded-[32px] border-2 border-primary/10 bg-primary/[0.02] overflow-hidden shadow-sm">
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                          <Activity className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 leading-none">Catch-up Strategy</p>
                          <h4 className="font-black text-lg tracking-tight">Prescribed Intake</h4>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-baseline justify-between border-b border-primary/10 pb-2">
                          <span className="text-xs font-bold text-muted-foreground uppercase">Energy Goal</span>
                          <span className="text-lg font-black text-primary">{results.catchupEnergy} <span className="text-xs">kcal/kg/d</span></span>
                        </div>
                        <div className="flex items-baseline justify-between border-b border-primary/10 pb-2">
                          <span className="text-xs font-bold text-muted-foreground uppercase">Protein Goal</span>
                          <span className="text-lg font-black text-primary">{results.catchupProtein} <span className="text-xs">g/kg/d</span></span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs font-bold text-muted-foreground uppercase">% Ideal Weight</span>
                          <span className={cn("text-lg font-black", results.isHighRisk ? "text-red-600" : "text-emerald-600")}>
                            {results.percentIBW}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-background/80 backdrop-blur-sm border rounded-3xl p-5 space-y-4">
                      <h5 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Success Metrics
                      </h5>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          <p className="text-xs font-medium text-muted-foreground">Target a weight gain of <span className="font-black text-foreground">{results.targetGain}g/day</span> over 4 weeks.</p>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          <p className="text-xs font-medium text-muted-foreground">Monitor for <span className="font-black text-foreground">linear growth</span> (height) every 4-8 weeks.</p>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          <p className="text-xs font-medium text-muted-foreground">Expect z-score improvement toward <span className="font-black text-foreground">-1SD line</span>.</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </section>

              {/* 2. AGE-SPECIFIC FOOD ROADMAP */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <Apple className="h-4 w-4 text-emerald-600" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Feeding Prescription & Roadmap</h3>
                </div>

                {Number(ageMonths) <= 12 ? (
                  <InfantRoadmap />
                ) : (
                  <ChildRoadmap />
                )}
              </section>

              {/* 3. MICRONUTRIENT DIRECTIVE */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <Pill className="h-4 w-4 text-amber-600" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">Micronutrient Directives</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <MicroTile 
                    title="Zinc Supplementation" 
                    text="Mandatory for linear growth. Dose: 1-2 mg/kg/day of elemental Zinc for 3 months."
                   />
                   <MicroTile 
                    title="Iron & Multivitamin" 
                    text="Wait until catch-up phase starts (after first week). Iron: 3-6 mg/kg/day."
                   />
                </div>
              </section>
            </>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-muted/10 border-4 border-dashed rounded-[48px] space-y-6">
              <div className="w-24 h-24 bg-background rounded-3xl flex items-center justify-center shadow-xl border relative">
                <Apple className="h-12 w-12 text-emerald-500/40" />
                <Activity className="h-10 w-10 text-primary/40 absolute -bottom-2 -right-2 bg-background p-2 rounded-xl border shadow-sm" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight text-muted-foreground/60">Calculate Recovery Plan</h3>
                <p className="text-sm text-muted-foreground/50 max-w-sm mx-auto font-medium">
                  Enter age, weight, and height to generate the exhaustive catch-up growth roadmap and dietary prescription.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultTile({ label, value, sub, icon: Icon, color, unit }: any) {
  const colorMap: any = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };
  return (
    <Card className={cn("rounded-3xl border shadow-sm", colorMap[color])}>
      <CardContent className="p-4 space-y-1">
        <div className="flex items-center justify-between mb-2">
          <Icon className="h-3.5 w-3.5 opacity-60" />
          <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{label}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <h4 className="text-3xl font-black tracking-tighter leading-none">{value.split(' ')[0]}</h4>
          <span className="text-xs font-bold opacity-60">{unit || value.split(' ')[1]}</span>
        </div>
        <p className="text-[10px] font-bold opacity-50">{sub}</p>
      </CardContent>
    </Card>
  );
}

function MicroTile({ title, text }: { title: string, text: string }) {
  return (
    <div className="p-4 rounded-3xl border-2 border-amber-100 bg-amber-50/30 space-y-2">
      <h5 className="text-[11px] font-black uppercase tracking-widest text-amber-800">{title}</h5>
      <p className="text-xs font-medium text-amber-900/70 leading-relaxed">{text}</p>
    </div>
  );
}

function InfantRoadmap() {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Card className="rounded-[32px] border-2 bg-card overflow-hidden">
        <CardHeader className="border-b py-4 px-6 bg-slate-50">
          <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <Beaker className="h-4 w-4 text-blue-600" /> Formula Concentration Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/30 border-b">
                <th className="px-6 py-3 text-left font-black">Target Density</th>
                <th className="px-6 py-3 text-left font-black">Preparation Directive</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="hover:bg-muted/10 transition-colors">
                <td className="px-6 py-4"><Badge className="bg-blue-100 text-blue-800 border-none font-bold">24 kcal/oz</Badge></td>
                <td className="px-6 py-4 font-medium">Standard 1:30 ratio. Use <span className="font-bold text-primary">3 scoops per 135mL</span> water.</td>
              </tr>
              <tr className="hover:bg-muted/10 transition-colors">
                <td className="px-6 py-4"><Badge className="bg-indigo-100 text-indigo-800 border-none font-bold">27 kcal/oz</Badge></td>
                <td className="px-6 py-4 font-medium">Use <span className="font-bold text-primary">3 scoops per 120mL</span> water.</td>
              </tr>
              <tr className="hover:bg-muted/10 transition-colors">
                <td className="px-6 py-4"><Badge className="bg-rose-100 text-rose-800 border-none font-bold">30 kcal/oz</Badge></td>
                <td className="px-6 py-4 font-medium text-rose-900">MANDATORY SUPERVISION. Use <span className="font-bold">3 scoops per 105mL</span> water.</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FortifyCard 
          title="Breastmilk" 
          icon={Droplets}
          steps={[
            "Use Liquid Human Milk Fortifier (HMF).",
            "If unavailable, add 1/4 tsp of MCT oil per 100mL BM.",
            "Offer more frequent, shorter sessions."
          ]}
        />
        <FortifyCard 
          title="Initial Solids (6m+)" 
          icon={Activity}
          steps={[
            "Add 1 tsp of butter or olive oil per 100g puree.",
            "Mix nut butters or full-fat yogurt into cereals.",
            "Prioritize Avocado and Mashed Egg Yolk."
          ]}
        />
      </div>
    </div>
  );
}

function ChildRoadmap() {
  return (
    <div className="space-y-4">
      <Card className="rounded-[32px] border-2 bg-card overflow-hidden">
        <CardHeader className="border-b py-4 px-6 bg-slate-50">
          <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-emerald-700">
            <FlaskConical className="h-4 w-4" /> High-Density Additive Matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-orange-600">Step 1: Fats</h5>
            <ul className="space-y-2">
              <li className="text-xs font-medium text-muted-foreground flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                Add 1 tbsp Olive Oil or Butter to every savory meal.
              </li>
              <li className="text-xs font-medium text-muted-foreground flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                Mix MCT oil into juices or milk (5mL per 200mL).
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-blue-600">Step 2: Proteins</h5>
            <ul className="space-y-2">
              <li className="text-xs font-medium text-muted-foreground flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                "Super-Milk": Add 2 tbsp Skimmed Milk Powder to 1 cup Whole Milk.
              </li>
              <li className="text-xs font-medium text-muted-foreground flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                Add grated cheese to pasta, soups, and potatoes.
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Step 3: Carbohydrates</h5>
            <ul className="space-y-2">
              <li className="text-xs font-medium text-muted-foreground flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                Add Maltodextrin (Polycal) to drinks (1 scoop per 100mL).
              </li>
              <li className="text-xs font-medium text-muted-foreground flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                Use Honey or Maple Syrup (if &gt; 1 year old).
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <FortifyCard 
        title="Commercial Supplement Path" 
        icon={Beaker}
        steps={[
          "1.0 kcal/mL Pediatric Shakes: Use for mild-moderate deficit.",
          "1.5 kcal/mL Specialized Formula: For severe deficit or volume restriction.",
          "Directive: Supplement between meals (e.g. 10am and 3pm) to avoid displacing solids."
        ]}
      />
    </div>
  );
}

function FortifyCard({ title, icon: Icon, steps }: any) {
  return (
    <div className="p-6 rounded-[32px] border-2 bg-card space-y-4 hover:border-primary/20 transition-all shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-2xl bg-muted text-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <h4 className="font-black text-sm tracking-tight uppercase">{title}</h4>
      </div>
      <ul className="space-y-3">
        {steps.map((s: any, i: number) => (
          <li key={i} className="flex items-start gap-3">
            <ChevronRight className="h-3.5 w-3.5 mt-0.5 text-primary/40 shrink-0" />
            <span className="text-xs font-medium text-muted-foreground leading-snug">{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
