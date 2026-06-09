import { useState, useMemo } from "react";
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ReferenceLine
} from "recharts";
import { ArrowLeft, Baby, Info, TrendingUp, AlertTriangle, Activity, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import {
  WHO_WEIGHT_BOYS, WHO_WEIGHT_GIRLS,
  WHO_HEIGHT_BOYS, WHO_HEIGHT_GIRLS,
  WHO_HC_BOYS, WHO_HC_GIRLS, GrowthPoint,
} from "@/lib/calculators/growth-data";
import { cn } from "@/lib/utils";

type Sex = "male" | "female";
type MeasureType = "weight" | "height" | "hc";

interface ClassResult {
  label: string;
  sublabel: string;
  color: string;
  bg: string;
  concern?: string;
}

function interpolateWHO(data: GrowthPoint[], month: number): GrowthPoint {
  if (month <= data[0].month) return { ...data[0], month };
  if (month >= data[data.length - 1].month) return { ...data[data.length - 1], month };
  let lo = data[0], hi = data[1];
  for (let i = 0; i < data.length - 1; i++) {
    if (data[i].month <= month && data[i + 1].month > month) { lo = data[i]; hi = data[i + 1]; break; }
  }
  const t = (month - lo.month) / (hi.month - lo.month);
  const lerp = (a: number, b: number) => +(a + t * (b - a)).toFixed(3);
  return { month, p3: lerp(lo.p3, hi.p3), p15: lerp(lo.p15, hi.p15), p50: lerp(lo.p50, hi.p50), p85: lerp(lo.p85, hi.p85), p97: lerp(lo.p97, hi.p97) };
}

function calcZScore(value: number, ref: GrowthPoint): number {
  const sigma = (ref.p97 - ref.p3) / 3.76;
  return (value - ref.p50) / sigma;
}

function classify(value: number, ref: GrowthPoint, type: MeasureType): ClassResult {
  const z = calcZScore(value, ref);
  if (type === "weight") {
    if (z < -3)  return { label: "Severely Underweight", sublabel: "< −3 SD", color: "text-red-700",    bg: "bg-red-50 border-red-300",    concern: "< −3 SD — severe acute malnutrition: urgent nutritional and medical review" };
    if (z < -2)  return { label: "Underweight",          sublabel: "−3 to −2 SD", color: "text-orange-700", bg: "bg-orange-50 border-orange-300" };
    if (z > 3)   return { label: "Obese",                sublabel: "> +3 SD",  color: "text-purple-700", bg: "bg-purple-50 border-purple-300", concern: "> +3 SD — consider endocrine/metabolic evaluation" };
    if (z > 2)   return { label: "Overweight",           sublabel: "+2 to +3 SD", color: "text-amber-700",  bg: "bg-amber-50 border-amber-300" };
    return             { label: "Normal Weight",         sublabel: "−2 to +2 SD", color: "text-emerald-700",bg: "bg-emerald-50 border-emerald-300" };
  }
  if (type === "height") {
    if (z < -3)  return { label: "Severely Stunted", sublabel: "< −3 SD",  color: "text-red-700",    bg: "bg-red-50 border-red-300",    concern: "< −3 SD — chronic severe undernutrition or systemic cause: refer" };
    if (z < -2)  return { label: "Stunted",          sublabel: "−3 to −2 SD", color: "text-orange-700", bg: "bg-orange-50 border-orange-300" };
    if (z > 3)   return { label: "Very Tall",        sublabel: "> +3 SD",  color: "text-purple-700", bg: "bg-purple-50 border-purple-300" };
    if (z > 2)   return { label: "Tall",             sublabel: "+2 to +3 SD", color: "text-amber-600",  bg: "bg-amber-50 border-amber-200" };
    return             { label: "Normal Height",     sublabel: "−2 to +2 SD", color: "text-emerald-700",bg: "bg-emerald-50 border-emerald-300" };
  }
  // HC
  if (z < -3)    return { label: "Severe Microcephaly", sublabel: "< −3 SD",  color: "text-red-700",    bg: "bg-red-50 border-red-300",    concern: "< −3 SD — severe microcephaly: neurology/genetics referral indicated" };
  if (z < -2)    return { label: "Microcephaly",        sublabel: "−3 to −2 SD", color: "text-orange-700", bg: "bg-orange-50 border-orange-300", concern: "< −2 SD — monitor closely; consider neuroimaging if progressive or symptomatic" };
  if (z > 3)     return { label: "Severe Macrocephaly", sublabel: "> +3 SD",  color: "text-purple-700", bg: "bg-purple-50 border-purple-300", concern: "> +3 SD — hydrocephalus/megalencephaly: head imaging recommended" };
  if (z > 2)     return { label: "Macrocephaly",        sublabel: "+2 to +3 SD", color: "text-amber-700",  bg: "bg-amber-50 border-amber-300" };
  return               { label: "Normal HC",            sublabel: "−2 to +2 SD", color: "text-emerald-700",bg: "bg-emerald-50 border-emerald-300" };
}

const MEASURE_META: Record<MeasureType, { label: string; unit: string; placeholder: string; decimals: number }> = {
  weight: { label: "Weight (kg)",             unit: "kg", placeholder: "e.g. 10.5", decimals: 2 },
  height: { label: "Height / Length (cm)",    unit: "cm", placeholder: "e.g. 85.0", decimals: 1 },
  hc:     { label: "Head Circumference (cm)", unit: "cm", placeholder: "e.g. 46.0", decimals: 1 },
};

const Y_DOMAIN: Record<MeasureType, [number, number]> = {
  weight: [0,  26],
  height: [40, 125],
  hc:     [30, 56],
};

export default function GrowthChartPage() {
  const [sex, setSex]                 = useState<Sex>("male");
  const [measureType, setMeasureType] = useState<MeasureType>("weight");
  const [ageYearsInput, setAgeYearsInput]   = useState("");
  const [ageMonthsInput, setAgeMonthsInput] = useState("");
  const [premWeeksInput, setPremWeeksInput] = useState("");
  const [valueInput, setValueInput]         = useState("");

  const ageYrs  = parseInt(ageYearsInput)  || 0;
  const ageMos  = parseInt(ageMonthsInput) || 0;
  const premWks = parseFloat(premWeeksInput) || 0;

  const totalMonths     = ageYrs * 12 + ageMos;
  const correctedMonths = Math.max(0, totalMonths - premWks / 4.33);
  const effectiveMonths = premWks > 0 ? correctedMonths : totalMonths;

  const ageEntered = ageYearsInput !== "" || ageMonthsInput !== "";
  const ageValid   = ageEntered && effectiveMonths >= 0 && effectiveMonths <= 60;

  const valueNum   = parseFloat(valueInput);
  const valueValid = isFinite(valueNum) && valueNum > 0;

  const dataset = useMemo((): GrowthPoint[] => {
    if (measureType === "weight") return sex === "male" ? WHO_WEIGHT_BOYS : WHO_WEIGHT_GIRLS;
    if (measureType === "height") return sex === "male" ? WHO_HEIGHT_BOYS : WHO_HEIGHT_GIRLS;
    return sex === "male" ? WHO_HC_BOYS : WHO_HC_GIRLS;
  }, [measureType, sex]);

  // Smooth reference curves: one point per month, 0–60
  const chartLineData = useMemo(() => {
    const pts: Record<string, number>[] = [];
    for (let m = 0; m <= 60; m++) {
      const r = interpolateWHO(dataset, m);
      pts.push({ month: m, p3: r.p3, p15: r.p15, p50: r.p50, p85: r.p85, p97: r.p97 });
    }
    return pts;
  }, [dataset]);

  // Overlay patient dot at nearest whole month
  const chartData = useMemo(() => {
    if (!ageValid || !valueValid) return chartLineData;
    const m = Math.round(effectiveMonths);
    return chartLineData.map(d => d.month === m ? { ...d, patient: valueNum } : d);
  }, [chartLineData, effectiveMonths, ageValid, valueNum, valueValid]);

  const refPoint = useMemo(
    () => (ageValid ? interpolateWHO(dataset, effectiveMonths) : null),
    [dataset, effectiveMonths, ageValid]
  );

  const zScore = useMemo(
    () => (refPoint && valueValid ? calcZScore(valueNum, refPoint) : null),
    [refPoint, valueNum, valueValid]
  );

  const classification = useMemo(
    () => (refPoint && valueValid ? classify(valueNum, refPoint, measureType) : null),
    [refPoint, valueNum, valueValid, measureType]
  );

  const inputWarning = useMemo(() => {
    if (!valueValid) return null;
    if (measureType === "weight" && (valueNum < 1.5 || valueNum > 30)) return "Weight outside expected range for 0–60 months.";
    if (measureType === "height" && (valueNum < 40 || valueNum > 130)) return "Height outside expected range for 0–60 months.";
    if (measureType === "hc"     && (valueNum < 25 || valueNum > 60))  return "HC outside expected range for 0–60 months.";
    return null;
  }, [measureType, valueNum, valueValid]);

  const { unit, placeholder, decimals } = MEASURE_META[measureType];
  const yDom = Y_DOMAIN[measureType];

  const correctedAgeLabel = premWks > 0 && ageEntered
    ? `Corrected: ${Math.floor(correctedMonths / 12)}y ${Math.round(correctedMonths % 12)}m (${correctedMonths.toFixed(1)} mo)`
    : null;

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 pb-32">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary active:scale-95">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      {/* ── Header ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-100">
            <TrendingUp className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black font-headline tracking-tight">WHO Growth Charts</h1>
            <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest mt-1">
              Weight · Height · Head Circumference · 0–60 Months
            </p>
          </div>
        </div>

        <div className="bg-muted/50 p-1.5 rounded-2xl border flex gap-1 self-start xl:self-center">
          {(["weight", "height", "hc"] as MeasureType[]).map((t) => (
            <Button
              key={t}
              variant={measureType === t ? "default" : "ghost"}
              size="sm"
              className={cn("rounded-xl font-bold px-4 active:scale-95", measureType === t && "bg-indigo-600 shadow-md")}
              onClick={() => { setMeasureType(t); setValueInput(""); }}
            >
              {t === "weight" ? "Weight" : t === "height" ? "Height" : "Head Circ."}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── Left: Inputs ── */}
        <div className="lg:col-span-3 space-y-5">
          <Card className="border-2 shadow-sm">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4" /> Patient Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">

              {/* Sex */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Biological Sex</Label>
                <Tabs value={sex} onValueChange={(v: string) => setSex(v as Sex)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="male"   className="font-bold active:scale-95">Male</TabsTrigger>
                    <TabsTrigger value="female" className="font-bold active:scale-95">Female</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Age: years + months */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Age <span className="font-normal normal-case opacity-60">(0–5 years)</span>
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      type="number"
                      inputMode="numeric"
                      placeholder="Yrs"
                      min={0} max={5}
                      className="h-11 font-mono text-lg border-2 focus:border-indigo-500 text-center"
                      value={ageYearsInput}
                      onChange={(e) => setAgeYearsInput(e.target.value)}
                    />
                    <p className="text-[9px] text-center text-muted-foreground mt-1 font-bold uppercase tracking-wide">Years</p>
                  </div>
                  <div>
                    <Input
                      type="number"
                      inputMode="numeric"
                      placeholder="Mo"
                      min={0} max={11}
                      className="h-11 font-mono text-lg border-2 focus:border-indigo-500 text-center"
                      value={ageMonthsInput}
                      onChange={(e) => setAgeMonthsInput(e.target.value)}
                    />
                    <p className="text-[9px] text-center text-muted-foreground mt-1 font-bold uppercase tracking-wide">Months</p>
                  </div>
                </div>
                {ageEntered && (totalMonths < 0 || totalMonths > 60) && (
                  <p className="text-xs text-red-500 font-bold">Age must be 0–60 months</p>
                )}
                {correctedAgeLabel && (
                  <p className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-1.5 rounded-lg leading-snug">
                    {correctedAgeLabel}
                  </p>
                )}
              </div>

              {/* Corrected age */}
              <div className="space-y-1.5">
                <Label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                  Weeks premature <span className="font-normal normal-case opacity-60">(optional)</span>
                </Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 8"
                  className="h-9 font-mono text-sm border border-dashed border-indigo-200 bg-indigo-50/10 focus:border-indigo-400"
                  value={premWeeksInput}
                  onChange={(e) => setPremWeeksInput(e.target.value)}
                />
              </div>

              <Separator />

              {/* Measurement value */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-indigo-700 tracking-widest">
                  {MEASURE_META[measureType].label}
                </Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder={placeholder}
                  className="h-11 font-mono text-lg border-2 border-indigo-500 bg-indigo-50/20 focus:border-indigo-600"
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                />
                {inputWarning && (
                  <p className="text-xs text-amber-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 shrink-0" /> {inputWarning}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right: Chart + Results ── */}
        <div className="lg:col-span-9 space-y-5">

          {/* Result cards — shown once age is entered */}
          {ageValid && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

              {/* Median */}
              <Card className="border-2 border-indigo-100 bg-indigo-50/40 text-center">
                <CardContent className="pt-4 pb-4 px-3">
                  <p className="text-[9px] font-black uppercase text-indigo-700 mb-1 tracking-wider">Median (50th)</p>
                  <p className="text-2xl font-black font-mono">
                    {refPoint?.p50.toFixed(decimals)}
                    <span className="text-xs font-normal opacity-40 ml-0.5">{unit}</span>
                  </p>
                </CardContent>
              </Card>

              {/* Normal range */}
              <Card className="border-2 border-indigo-100 bg-indigo-50/40 text-center">
                <CardContent className="pt-4 pb-4 px-3">
                  <p className="text-[9px] font-black uppercase text-indigo-700 mb-1 tracking-wider">Normal (±2 SD)</p>
                  <p className="text-sm font-black font-mono leading-snug">
                    {refPoint?.p3.toFixed(decimals)}–{refPoint?.p97.toFixed(decimals)}
                    <span className="text-[9px] font-normal opacity-40 ml-0.5">{unit}</span>
                  </p>
                </CardContent>
              </Card>

              {/* Z-score */}
              <Card className={cn("border-2 text-center", zScore != null ? "border-slate-300" : "border-muted opacity-40")}>
                <CardContent className="pt-4 pb-4 px-3">
                  <p className="text-[9px] font-black uppercase text-muted-foreground mb-1 tracking-wider">Z-score</p>
                  <p className={cn(
                    "text-2xl font-black font-mono",
                    zScore == null        ? "text-muted-foreground" :
                    Math.abs(zScore) > 3  ? "text-red-600" :
                    Math.abs(zScore) > 2  ? "text-orange-600" :
                    Math.abs(zScore) > 1  ? "text-amber-600" : "text-slate-800"
                  )}>
                    {zScore != null ? (zScore >= 0 ? "+" : "") + zScore.toFixed(2) : "—"}
                  </p>
                </CardContent>
              </Card>

              {/* WHO Classification */}
              <Card className={cn("border-2 text-center", classification ? classification.bg : "border-muted opacity-40")}>
                <CardContent className="pt-4 pb-4 px-3">
                  <p className="text-[9px] font-black uppercase text-muted-foreground mb-1 tracking-wider">WHO Classification</p>
                  {classification ? (
                    <>
                      <p className={cn("text-sm font-black leading-tight", classification.color)}>{classification.label}</p>
                      <p className="text-[9px] text-muted-foreground font-bold mt-0.5">{classification.sublabel}</p>
                    </>
                  ) : (
                    <p className="text-lg font-black text-muted-foreground">—</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Concern banner */}
          {classification?.concern && (
            <Alert className="border-red-300 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-sm text-red-800 font-bold">{classification.concern}</AlertDescription>
            </Alert>
          )}

          {/* ── Chart ── */}
          <Card className="p-5 pt-6 border-2 shadow-sm bg-white">
            <div className="h-[430px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: 5, bottom: 32 }}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} strokeOpacity={0.12} />
                  <XAxis
                    dataKey="month"
                    type="number"
                    domain={[0, 60]}
                    ticks={[0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60]}
                    stroke="#94a3b8"
                    fontSize={10}
                    fontWeight={700}
                    label={{ value: "Age (months)", position: "bottom", offset: 12, fontSize: 10, fontWeight: 900, fill: "#64748b" }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={10}
                    fontWeight={700}
                    domain={yDom}
                    tickFormatter={(v: number) => v.toFixed(0)}
                    width={42}
                  />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 20px -3px rgb(0 0 0 / 0.12)", fontSize: 11, fontWeight: "bold" }}
                    formatter={(value: number, name: string) => [
                      `${(+value).toFixed(decimals)} ${unit}`,
                      name === "p3"  ? "3rd percentile (−2 SD)"  :
                      name === "p15" ? "15th percentile (−1 SD)" :
                      name === "p50" ? "50th (median)"            :
                      name === "p85" ? "85th percentile (+1 SD)"  :
                      name === "p97" ? "97th percentile (+2 SD)"  : "Patient"
                    ]}
                    labelFormatter={(m) => `${m} months (${Math.floor(+m / 12)}y ${+m % 12}m)`}
                  />

                  {/* Yearly reference lines */}
                  {[12, 24, 36, 48].map((m) => (
                    <ReferenceLine
                      key={m}
                      x={m}
                      stroke="#94a3b8"
                      strokeDasharray="5 4"
                      strokeWidth={1}
                      label={{ value: `${m / 12}y`, position: "top", fontSize: 9, fill: "#64748b", fontWeight: 800 }}
                    />
                  ))}

                  {/* Percentile curves: outer → inner */}
                  <Line type="monotone" dataKey="p97" stroke="#fb923c" strokeWidth={1.5} strokeDasharray="6 3" dot={false} name="p97" connectNulls legendType="line" />
                  <Line type="monotone" dataKey="p85" stroke="#86efac" strokeWidth={1.5} strokeDasharray="5 2" dot={false} name="p85" connectNulls legendType="line" />
                  <Line type="monotone" dataKey="p50" stroke="#4f46e5" strokeWidth={3}   dot={false} name="p50" connectNulls legendType="line" />
                  <Line type="monotone" dataKey="p15" stroke="#86efac" strokeWidth={1.5} strokeDasharray="5 2" dot={false} name="p15" connectNulls legendType="line" />
                  <Line type="monotone" dataKey="p3"  stroke="#fb923c" strokeWidth={1.5} strokeDasharray="6 3" dot={false} name="p3"  connectNulls legendType="line" />

                  {/* Patient dot */}
                  <Line
                    type="monotone"
                    dataKey="patient"
                    stroke="#ef4444"
                    strokeWidth={0}
                    dot={{ r: 8, fill: "#ef4444", strokeWidth: 3, stroke: "#fff" }}
                    activeDot={{ r: 10 }}
                    name="Patient"
                    connectNulls
                    legendType="circle"
                  />

                  <Legend
                    verticalAlign="top"
                    wrapperStyle={{ fontSize: 10, fontWeight: 700, paddingBottom: 6 }}
                    formatter={(v) =>
                      v === "p97" ? "p97 (+2 SD)" :
                      v === "p85" ? "p85 (+1 SD)" :
                      v === "p50" ? "p50 (median)" :
                      v === "p15" ? "p15 (−1 SD)" :
                      v === "p3"  ? "p3 (−2 SD)" : v
                    }
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* ── Clinical guidance ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600 shrink-0" />
              <AlertDescription className="text-xs text-blue-800 font-medium space-y-1">
                <p className="font-black">Chart use & corrected age</p>
                <p>Use <strong>WHO Growth Standards</strong> from birth to 5 years. For preterm infants, apply <strong>corrected age</strong> (chronological age − weeks premature ÷ 4.33) until 2 years corrected.</p>
              </AlertDescription>
            </Alert>

            <Alert className="bg-amber-50 border-amber-200">
              <TrendingUp className="h-4 w-4 text-amber-600 shrink-0" />
              <AlertDescription className="text-xs text-amber-800 font-medium space-y-1">
                <p className="font-black">WHO action thresholds</p>
                <p>{"< −2 SD"}: Underweight / Stunted — optimise nutrition, rule out organic disease.</p>
                <p>{"< −3 SD"}: Severe — urgent nutritional + medical review.</p>
                <p>{"> +2 SD"} weight: Overweight — dietary assessment and activity counselling.</p>
              </AlertDescription>
            </Alert>

            <Alert className="bg-orange-50 border-orange-200 md:col-span-2">
              <Baby className="h-4 w-4 text-orange-600 shrink-0" />
              <AlertDescription className="text-xs text-orange-800 font-medium">
                <span className="font-black">Trend matters more than a single point. </span>
                Falling across ≥ 2 major percentile channels warrants investigation regardless of absolute value.
                Severe stunting ({"< −3 SD"}) requires systemic workup; isolated HC deviations{" "}
                ({"< −2 SD or > +2 SD"}) warrant neurological review if progressive or symptomatic.
              </AlertDescription>
            </Alert>
          </div>

          <p className="text-[10px] text-muted-foreground font-medium text-center pb-2">
            Reference: WHO Child Growth Standards. WHO Press, Geneva. 2006.
            Values are linearly interpolated from 7-point anchor data — for research use, consult the published LMS parameter tables.
          </p>
        </div>
      </div>
    </div>
  );
}
