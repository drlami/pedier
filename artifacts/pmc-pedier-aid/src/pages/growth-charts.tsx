import { useState, useMemo } from "react";
import { 
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer, Area
} from "recharts";
import { 
  ArrowLeft, Info, TrendingUp, Scale, Stethoscope, AlertCircle, ShieldAlert
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { 
    WHO_WEIGHT_BOYS, WHO_WEIGHT_GIRLS, 
    WHO_HEIGHT_BOYS, WHO_HEIGHT_GIRLS,
    WHO_HC_BOYS, WHO_HC_GIRLS, GrowthPoint
} from "@/lib/calculators/growth-data";
import { cn } from "@/lib/utils";

type ChartType = "weight" | "height" | "hc";

export default function GrowthChartPage() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [ageMonths, setAgeMonths] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [hc, setHc] = useState<string>("");
  const [chartType, setChartType] = useState<ChartType>("weight");

  const ageNum = parseFloat(ageMonths);
  const weightNum = parseFloat(weight);
  const heightNum = parseFloat(height);
  const hcNum = parseFloat(hc);

  const getBaseData = (type: ChartType, s: "male" | "female"): GrowthPoint[] => {
      if (type === "weight") return s === "male" ? WHO_WEIGHT_BOYS : WHO_WEIGHT_GIRLS;
      if (type === "height") return s === "male" ? WHO_HEIGHT_BOYS : WHO_HEIGHT_GIRLS;
      return s === "male" ? WHO_HC_BOYS : WHO_HC_GIRLS;
  };

  const chartData = useMemo(() => {
    const baseSet = getBaseData(chartType, sex);
    const patientValue = chartType === "weight" ? weightNum : chartType === "height" ? heightNum : hcNum;
    
    const combined: any[] = baseSet.map(p => ({ ...p }));
    
    if (ageNum >= 0 && ageNum <= 60 && !isNaN(patientValue)) {
        combined.push({ month: ageNum, patient: patientValue });
        combined.sort((a, b) => a.month - b.month);
    }
    return combined;
  }, [sex, chartType, ageNum, weightNum, heightNum, hcNum]);

  const interpretation = useMemo(() => {
    if (isNaN(ageNum)) return null;
    const baseSet = getBaseData(chartType, sex);
    
    const ref = [...baseSet].sort((a, b) => Math.abs(a.month - ageNum) - Math.abs(b.month - ageNum))[0];
    const val = chartType === "weight" ? weightNum : chartType === "height" ? heightNum : hcNum;
    
    if (isNaN(val)) return { ref };

    let status = "Normal";
    let color = "text-green-600";
    let percentile = "50th";

    if (val > ref.p97) { status = "High (> +2SD)"; color = "text-red-600"; percentile = "> 97th"; }
    else if (val > ref.p85) { status = "High-Normal (+1SD to +2SD)"; color = "text-amber-600"; percentile = "85th - 97th"; }
    else if (val < ref.p3) { status = "Low (< -2SD)"; color = "text-red-600"; percentile = "< 3rd"; }
    else if (val < ref.p15) { status = "Low-Normal (-2SD to -1SD)"; color = "text-amber-600"; percentile = "3rd - 15th"; }
    else { status = "Normal Range"; color = "text-green-600"; percentile = "15th - 85th"; }

    return { ref, status, color, percentile, val };
  }, [chartType, sex, ageNum, weightNum, heightNum, hcNum]);

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 pb-32">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary active:scale-95">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
            <div className="p-4 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-100">
                <TrendingUp className="h-8 w-8" />
            </div>
            <div>
                <h1 className="text-4xl font-black font-headline tracking-tight">Growth Charts</h1>
                <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest mt-1">WHO Standards (0 - 60 Months)</p>
            </div>
        </div>
        
        <div className="bg-muted/50 p-1.5 rounded-2xl border flex gap-1 self-start xl:self-center">
            {(["weight", "height", "hc"] as ChartType[]).map((t) => (
                <Button 
                    key={t}
                    variant={chartType === t ? "default" : "ghost"}
                    size="sm"
                    className={cn("rounded-xl font-bold px-5 active:scale-95", chartType === t && "bg-indigo-600 shadow-md")}
                    onClick={() => setChartType(t)}
                >
                    {t === "weight" ? "Weight" : t === "height" ? "Height" : "Head Circ."}
                </Button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-2 shadow-sm">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" /> Patient Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Biological Sex</Label>
                    <Tabs value={sex} onValueChange={(v: any) => setSex(v)}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="male" className="font-bold active:scale-95">Male</TabsTrigger>
                            <TabsTrigger value="female" className="font-bold active:scale-95">Female</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Age (Months)</Label>
                    <Input type="number" inputMode="decimal" placeholder="0 - 60" className="h-11 font-mono text-lg border-2 focus:border-indigo-500" value={ageMonths} onChange={(e) => setAgeMonths(e.target.value)} />
                </div>

                <Separator />

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-indigo-700 tracking-widest">Weight (kg)</Label>
                        <Input type="number" inputMode="decimal" placeholder="e.g. 10.5" className={cn("h-11 font-mono", chartType === 'weight' && "border-indigo-500 border-2 bg-indigo-50/20")} value={weight} onChange={(e) => setWeight(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-indigo-700 tracking-widest">Height / Length (cm)</Label>
                        <Input type="number" inputMode="decimal" placeholder="e.g. 85" className={cn("h-11 font-mono", chartType === 'height' && "border-indigo-500 border-2 bg-indigo-50/20")} value={height} onChange={(e) => setHeight(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-indigo-700 tracking-widest">Head Circumference (cm)</Label>
                        <Input type="number" inputMode="decimal" placeholder="e.g. 42" className={cn("h-11 font-mono", chartType === 'hc' && "border-indigo-500 border-2 bg-indigo-50/20")} value={hc} onChange={(e) => setHc(e.target.value)} />
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-9 space-y-8">
            {interpretation && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-2 border-indigo-100 bg-indigo-50/30 text-center active:scale-[0.98] transition-transform">
                        <CardContent className="pt-4 pb-4 px-4">
                            <p className="text-[10px] font-black uppercase text-indigo-700 mb-1">Median (50th)</p>
                            <p className="text-2xl font-black font-mono">
                                {interpretation.ref?.p50.toFixed(1)} <span className="text-xs font-normal opacity-50">{chartType === 'weight' ? 'kg' : 'cm'}</span>
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-indigo-100 bg-indigo-50/30 text-center active:scale-[0.98] transition-transform">
                        <CardContent className="pt-4 pb-4 px-4">
                            <p className="text-[10px] font-black uppercase text-indigo-700 mb-1">Range (-2SD to +2SD)</p>
                            <p className="text-sm font-black font-mono">
                                {interpretation.ref?.p3.toFixed(1)} - {interpretation.ref?.p97.toFixed(1)}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className={cn("border-2 md:col-span-2 active:scale-[0.98] transition-transform", interpretation.val ? "border-indigo-500 bg-indigo-50 shadow-md" : "border-muted bg-muted/10 opacity-50")}>
                        <CardContent className="pt-4 pb-4 px-6 flex items-center justify-between">
                            <div className="text-left">
                                <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Interpretation</p>
                                <p className={cn("text-lg font-black tracking-tight leading-none", interpretation.color)}>
                                    {interpretation.status || "Enter Data"}
                                </p>
                            </div>
                            <Badge className={cn("font-black", interpretation.val ? "bg-indigo-600" : "bg-muted")}>
                                {interpretation.percentile || "--"}
                            </Badge>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Card className="p-8 border-2 shadow-sm relative overflow-hidden group">
                <div className="h-[450px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="4 4" vertical={false} strokeOpacity={0.1} />
                            <XAxis 
                                dataKey="month" 
                                type="number" 
                                domain={[0, 60]} 
                                stroke="#94a3b8"
                                fontSize={11}
                                fontWeight={700}
                                label={{ value: 'AGE (MONTHS)', position: 'bottom', offset: 0, fontSize: 10, fontWeight: 900, fill: '#64748b' }}
                            />
                            <YAxis 
                                stroke="#94a3b8"
                                fontSize={11}
                                fontWeight={700}
                                domain={chartType === 'weight' ? [0, 26] : chartType === 'height' ? [40, 125] : [30, 56]}
                            />
                            <RechartsTooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                            />
                            <Area dataKey="p97" stroke="none" fill="#e0e7ff" fillOpacity={0.4} name="97th" connectNulls />
                            <Area dataKey="p3" stroke="none" fill="#e0e7ff" fillOpacity={0.4} name="3rd" connectNulls />
                            <Line type="monotone" dataKey="p50" stroke="#4f46e5" strokeWidth={4} dot={false} name="Median" connectNulls />
                            <Line 
                                type="monotone" 
                                dataKey="patient" 
                                stroke="#ef4444" 
                                strokeWidth={0} 
                                dot={{ r: 8, fill: '#ef4444', strokeWidth: 3, stroke: '#fff' }} 
                                name="Patient" 
                                connectNulls
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Alert className="bg-blue-50 border-blue-100">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-xs text-blue-800 font-medium">
                    WHO growth standards are used to monitor children globally from birth to 5 years. 
                    Measurements outside the ±2SD range may require clinical investigation.
                </AlertDescription>
            </Alert>
        </div>
      </div>
    </div>
  );
}
