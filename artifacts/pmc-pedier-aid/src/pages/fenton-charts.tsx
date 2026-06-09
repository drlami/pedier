import { useState, useMemo } from "react";
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ReferenceLine
} from "recharts";
import { ArrowLeft, Baby, Info, TrendingUp, AlertTriangle, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import {
  FENTON_WEIGHT_BOYS, FENTON_WEIGHT_GIRLS,
  FENTON_LENGTH_BOYS, FENTON_LENGTH_GIRLS,
  FENTON_HC_BOYS, FENTON_HC_GIRLS,
  FentonPoint,
} from "@/lib/calculators/growth-data";
import { cn } from "@/lib/utils";

type Sex = "male" | "female";
type MeasureType = "weight" | "length" | "hc";

interface ClassResult {
  label: string;
  sublabel: string;
  color: string;
  bg: string;
  concern?: string;
}

// Linear interpolation between two adjacent biweekly reference points
function interpolateFenton(data: FentonPoint[], week: number): FentonPoint {
  if (week <= data[0].week) return { ...data[0], week };
  if (week >= data[data.length - 1].week) return { ...data[data.length - 1], week };
  let lo = data[0], hi = data[1];
  for (let i = 0; i < data.length - 1; i++) {
    if (data[i].week <= week && data[i + 1].week > week) { lo = data[i]; hi = data[i + 1]; break; }
  }
  const t = (week - lo.week) / (hi.week - lo.week);
  const lerp = (a: number, b: number) => +(a + t * (b - a)).toFixed(3);
  return { week, p3: lerp(lo.p3, hi.p3), p10: lerp(lo.p10, hi.p10), p50: lerp(lo.p50, hi.p50), p90: lerp(lo.p90, hi.p90), p97: lerp(lo.p97, hi.p97) };
}

// Approximate z-score: maps value relative to median using p3–p97 spread as ±1.88 SD
function calcZScore(value: number, ref: FentonPoint): number {
  const sigma = (ref.p97 - ref.p3) / 3.76;
  return (value - ref.p50) / sigma;
}

function classify(value: number, ref: FentonPoint): ClassResult {
  if (value < ref.p3)  return { label: "Severe SGA", sublabel: "< 3rd percentile",  color: "text-red-700",    bg: "bg-red-50 border-red-300",    concern: "< 3rd — IUGR / severe malnutrition: urgent nutrition and endocrine review" };
  if (value < ref.p10) return { label: "SGA",         sublabel: "3rd–10th percentile", color: "text-orange-700", bg: "bg-orange-50 border-orange-300" };
  if (value > ref.p97) return { label: "Very LGA",    sublabel: "> 97th percentile",   color: "text-purple-700", bg: "bg-purple-50 border-purple-300" };
  if (value > ref.p90) return { label: "LGA",         sublabel: "90th–97th percentile",color: "text-amber-700",  bg: "bg-amber-50 border-amber-300" };
  return                      { label: "AGA",         sublabel: "10th–90th percentile",color: "text-emerald-700",bg: "bg-emerald-50 border-emerald-300" };
}

function velTarget(pmaWeeks: number): string {
  if (pmaWeeks < 34) return "15–20 g/kg/day";
  if (pmaWeeks < 36) return "12–15 g/kg/day";
  if (pmaWeeks <= 40) return "10–12 g/kg/day";
  return "7–10 g/kg/day";
}

const MEASURE_META: Record<MeasureType, { label: string; unit: string; placeholder: string; decimals: number }> = {
  weight: { label: "Weight (kg)",              unit: "kg", placeholder: "e.g. 1.45", decimals: 2 },
  length: { label: "Length (cm)",              unit: "cm", placeholder: "e.g. 38.5", decimals: 1 },
  hc:     { label: "Head Circumference (cm)",  unit: "cm", placeholder: "e.g. 27.0", decimals: 1 },
};

const Y_DOMAIN: Record<MeasureType, [number, number]> = {
  weight: [0,  8],
  length: [22, 65],
  hc:     [15, 48],
};

export default function FentonChartPage() {
  const [sex, setSex]                     = useState<Sex>("male");
  const [measureType, setMeasureType]     = useState<MeasureType>("weight");
  const [pmaInput, setPmaInput]           = useState("");
  const [valueInput, setValueInput]       = useState("");
  const [prevWeightInput, setPrevWeightInput] = useState("");
  const [prevDaysInput, setPrevDaysInput]     = useState("");

  const pmaNum      = parseFloat(pmaInput);
  const valueNum    = parseFloat(valueInput);
  const prevWeightNum = parseFloat(prevWeightInput);
  const prevDaysNum   = parseFloat(prevDaysInput);

  const pmaValid   = isFinite(pmaNum) && pmaNum >= 22 && pmaNum <= 50;
  const valueValid = isFinite(valueNum) && valueNum > 0;

  const dataset = useMemo((): FentonPoint[] => {
    if (measureType === "weight") return sex === "male" ? FENTON_WEIGHT_BOYS : FENTON_WEIGHT_GIRLS;
    if (measureType === "length") return sex === "male" ? FENTON_LENGTH_BOYS : FENTON_LENGTH_GIRLS;
    return sex === "male" ? FENTON_HC_BOYS : FENTON_HC_GIRLS;
  }, [measureType, sex]);

  // Generate a reference point for every whole week 22–50 for smooth curves
  const chartLineData = useMemo(() => {
    const pts: Record<string, number>[] = [];
    for (let w = 22; w <= 50; w++) {
      const r = interpolateFenton(dataset, w);
      pts.push({ week: w, p3: r.p3, p10: r.p10, p50: r.p50, p90: r.p90, p97: r.p97 });
    }
    return pts;
  }, [dataset]);

  // Overlay patient value at the nearest whole week
  const chartData = useMemo(() => {
    if (!pmaValid || !valueValid) return chartLineData;
    const w = Math.round(pmaNum);
    return chartLineData.map(d => d.week === w ? { ...d, patient: valueNum } : d);
  }, [chartLineData, pmaNum, pmaValid, valueNum, valueValid]);

  const refPoint = useMemo(
    () => (pmaValid ? interpolateFenton(dataset, pmaNum) : null),
    [dataset, pmaNum, pmaValid]
  );

  const zScore = useMemo(
    () => (refPoint && valueValid ? calcZScore(valueNum, refPoint) : null),
    [refPoint, valueNum, valueValid]
  );

  const classification = useMemo(
    () => (refPoint && valueValid ? classify(valueNum, refPoint) : null),
    [refPoint, valueNum, valueValid]
  );

  // Weight gain velocity (g/kg/day) using mean weight denominator
  const velocity = useMemo(() => {
    if (measureType !== "weight") return null;
    if (!valueValid || !isFinite(prevWeightNum) || prevWeightNum <= 0 || !isFinite(prevDaysNum) || prevDaysNum <= 0) return null;
    const gainG = (valueNum - prevWeightNum) * 1000;
    const meanKg = (valueNum + prevWeightNum) / 2;
    return gainG / prevDaysNum / meanKg;
  }, [measureType, valueNum, valueValid, prevWeightNum, prevDaysNum]);

  const inputWarning = useMemo(() => {
    if (!valueValid) return null;
    if (measureType === "weight" && (valueNum < 0.15 || valueNum > 12)) return "Weight outside plausible range (0.15–12 kg) for 22–50w PMA.";
    if (measureType === "length" && (valueNum < 18 || valueNum > 70)) return "Length outside plausible range (18–70 cm) for 22–50w PMA.";
    if (measureType === "hc" && (valueNum < 14 || valueNum > 50)) return "HC outside plausible range (14–50 cm) for 22–50w PMA.";
    return null;
  }, [measureType, valueNum, valueValid]);

  const { unit, placeholder, decimals } = MEASURE_META[measureType];
  const yDom = Y_DOMAIN[measureType];

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
          <div className="p-4 rounded-3xl bg-emerald-600 text-white shadow-xl shadow-emerald-100">
            <Baby className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black font-headline tracking-tight">Fenton 2013 Preterm Charts</h1>
            <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest mt-1">
              Weight · Length · Head Circumference · 22–50 Weeks PMA
            </p>
          </div>
        </div>

        {/* Measurement tabs */}
        <div className="bg-muted/50 p-1.5 rounded-2xl border flex gap-1 self-start xl:self-center">
          {(["weight", "length", "hc"] as MeasureType[]).map((t) => (
            <Button
              key={t}
              variant={measureType === t ? "default" : "ghost"}
              size="sm"
              className={cn("rounded-xl font-bold px-4 active:scale-95", measureType === t && "bg-emerald-600 shadow-md")}
              onClick={() => { setMeasureType(t); setValueInput(""); }}
            >
              {t === "weight" ? "Weight" : t === "length" ? "Length" : "Head Circ."}
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
                    <TabsTrigger value="male" className="font-bold active:scale-95">Male</TabsTrigger>
                    <TabsTrigger value="female" className="font-bold active:scale-95">Female</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* PMA */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  PMA <span className="font-normal normal-case opacity-60">(weeks, 22–50)</span>
                </Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 28"
                  step="0.5"
                  className="h-11 font-mono text-lg border-2 focus:border-emerald-500"
                  value={pmaInput}
                  onChange={(e) => setPmaInput(e.target.value)}
                />
                {isFinite(pmaNum) && (pmaNum < 22 || pmaNum > 50) && (
                  <p className="text-xs text-red-500 font-bold">Must be 22–50 weeks</p>
                )}
              </div>

              <Separator />

              {/* Measurement value */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-emerald-700 tracking-widest">
                  {MEASURE_META[measureType].label}
                </Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder={placeholder}
                  className="h-11 font-mono text-lg border-2 border-emerald-500 bg-emerald-50/20 focus:border-emerald-600"
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                />
                {inputWarning && (
                  <p className="text-xs text-amber-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 shrink-0" /> {inputWarning}
                  </p>
                )}
              </div>

              {/* Velocity inputs (weight only) */}
              {measureType === "weight" && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase text-blue-700 tracking-widest flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5" /> Velocity (optional)
                    </Label>
                    <div className="space-y-1.5">
                      <Label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Previous weight (kg)</Label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        placeholder="e.g. 1.20"
                        className="h-10 font-mono border-2 border-blue-300/60 bg-blue-50/10 focus:border-blue-500"
                        value={prevWeightInput}
                        onChange={(e) => setPrevWeightInput(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Days since that weight</Label>
                      <Input
                        type="number"
                        inputMode="numeric"
                        placeholder="e.g. 7"
                        className="h-10 font-mono border-2 border-blue-300/60 bg-blue-50/10 focus:border-blue-500"
                        value={prevDaysInput}
                        onChange={(e) => setPrevDaysInput(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Right: Chart + Results ── */}
        <div className="lg:col-span-9 space-y-5">

          {/* Result cards — only when PMA is entered */}
          {pmaValid && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

              {/* Median */}
              <Card className="border-2 border-emerald-100 bg-emerald-50/40 text-center">
                <CardContent className="pt-4 pb-4 px-3">
                  <p className="text-[9px] font-black uppercase text-emerald-700 mb-1 tracking-wider">Median (50th)</p>
                  <p className="text-2xl font-black font-mono">
                    {refPoint?.p50.toFixed(decimals)}
                    <span className="text-xs font-normal opacity-40 ml-0.5">{unit}</span>
                  </p>
                </CardContent>
              </Card>

              {/* AGA range */}
              <Card className="border-2 border-emerald-100 bg-emerald-50/40 text-center">
                <CardContent className="pt-4 pb-4 px-3">
                  <p className="text-[9px] font-black uppercase text-emerald-700 mb-1 tracking-wider">AGA range (p10–p90)</p>
                  <p className="text-sm font-black font-mono leading-snug">
                    {refPoint?.p10.toFixed(decimals)}–{refPoint?.p90.toFixed(decimals)}
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
                    zScore == null ? "text-muted-foreground" :
                    Math.abs(zScore) > 2 ? "text-red-600" :
                    Math.abs(zScore) > 1.28 ? "text-amber-600" : "text-slate-800"
                  )}>
                    {zScore != null ? (zScore >= 0 ? "+" : "") + zScore.toFixed(2) : "—"}
                  </p>
                </CardContent>
              </Card>

              {/* Classification */}
              <Card className={cn("border-2 text-center", classification ? classification.bg : "border-muted opacity-40")}>
                <CardContent className="pt-4 pb-4 px-3">
                  <p className="text-[9px] font-black uppercase text-muted-foreground mb-1 tracking-wider">Classification</p>
                  {classification ? (
                    <>
                      <p className={cn("text-base font-black leading-tight", classification.color)}>{classification.label}</p>
                      <p className="text-[9px] text-muted-foreground font-bold mt-0.5">{classification.sublabel}</p>
                    </>
                  ) : (
                    <p className="text-lg font-black text-muted-foreground">—</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Concern banner (severe SGA) */}
          {classification?.concern && (
            <Alert className="border-red-300 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-sm text-red-800 font-bold">{classification.concern}</AlertDescription>
            </Alert>
          )}

          {/* Velocity result */}
          {velocity != null && pmaValid && (
            <div className="p-4 rounded-2xl border-2 border-blue-200 bg-blue-50/50 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-700 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" /> Weight Gain Velocity
                </p>
                <p className="text-[10px] text-blue-600/80 font-bold mt-0.5">
                  Target at {Math.round(pmaNum)}w PMA: {velTarget(pmaNum)}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className={cn(
                  "text-3xl font-black font-mono",
                  velocity < 0 ? "text-red-600" :
                  velocity < 7  ? "text-red-500" :
                  velocity < 12 ? "text-amber-600" : "text-emerald-700"
                )}>
                  {velocity.toFixed(1)}
                </p>
                <p className="text-[10px] font-black text-blue-600/70 uppercase tracking-wider">g/kg/day</p>
              </div>
            </div>
          )}

          {/* ── Chart ── */}
          <Card className="p-5 pt-6 border-2 shadow-sm bg-white">
            <div className="h-[430px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: 5, bottom: 32 }}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} strokeOpacity={0.12} />
                  <XAxis
                    dataKey="week"
                    type="number"
                    domain={[22, 50]}
                    ticks={[22,24,26,28,30,32,34,36,38,40,42,44,46,48,50]}
                    stroke="#94a3b8"
                    fontSize={10}
                    fontWeight={700}
                    label={{ value: "Post-Menstrual Age (weeks)", position: "bottom", offset: 12, fontSize: 10, fontWeight: 900, fill: "#64748b" }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={10}
                    fontWeight={700}
                    domain={yDom}
                    tickFormatter={(v: number) => v.toFixed(measureType === "weight" ? 1 : 0)}
                    width={42}
                  />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 20px -3px rgb(0 0 0 / 0.12)", fontSize: 11, fontWeight: "bold" }}
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(decimals)} ${unit}`,
                      name === "p3"  ? "3rd percentile"  :
                      name === "p10" ? "10th percentile" :
                      name === "p50" ? "50th (median)"   :
                      name === "p90" ? "90th percentile" :
                      name === "p97" ? "97th percentile" : "Patient"
                    ]}
                    labelFormatter={(w) => `Week ${w} PMA`}
                  />

                  {/* 40-week term equivalent marker */}
                  <ReferenceLine
                    x={40}
                    stroke="#94a3b8"
                    strokeDasharray="7 4"
                    strokeWidth={1.5}
                    label={{ value: "40w", position: "top", fontSize: 9, fill: "#64748b", fontWeight: 800 }}
                  />

                  {/* Percentile curves: p97, p90, p50, p10, p3 */}
                  <Line type="monotone" dataKey="p97" stroke="#fb923c" strokeWidth={1.5} strokeDasharray="6 3" dot={false} name="97th" connectNulls legendType="line" />
                  <Line type="monotone" dataKey="p90" stroke="#86efac" strokeWidth={1.5} strokeDasharray="5 2" dot={false} name="90th" connectNulls legendType="line" />
                  <Line type="monotone" dataKey="p50" stroke="#059669" strokeWidth={3}   dot={false} name="50th" connectNulls legendType="line" />
                  <Line type="monotone" dataKey="p10" stroke="#86efac" strokeWidth={1.5} strokeDasharray="5 2" dot={false} name="10th" connectNulls legendType="line" />
                  <Line type="monotone" dataKey="p3"  stroke="#fb923c" strokeWidth={1.5} strokeDasharray="6 3" dot={false} name="3rd"  connectNulls legendType="line" />

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
                      v === "97th" ? "p97" : v === "90th" ? "p90 (LGA)" :
                      v === "50th" ? "p50 (median)" :
                      v === "10th" ? "p10 (SGA)" : v === "3rd" ? "p3" : v
                    }
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* ── Clinical guidance panel ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600 shrink-0" />
              <AlertDescription className="text-xs text-blue-800 font-medium space-y-1">
                <p className="font-black">Chart transition & corrected age</p>
                <p>At 40 weeks PMA (term equivalent) transition to <strong>WHO Child Growth Standards</strong>. Use <strong>corrected age</strong> (chronological − weeks premature) for all growth monitoring until 2 years.</p>
              </AlertDescription>
            </Alert>

            <Alert className="bg-amber-50 border-amber-200">
              <TrendingUp className="h-4 w-4 text-amber-600 shrink-0" />
              <AlertDescription className="text-xs text-amber-800 font-medium space-y-1">
                <p className="font-black">Weight gain velocity targets</p>
                <p>23–34w: <strong>15–20 g/kg/day</strong> &nbsp;·&nbsp; 34–36w: 12–15 &nbsp;·&nbsp; 36–40w: 10–12 &nbsp;·&nbsp; &gt;40w: 7–10</p>
                <p className="italic opacity-80">Falling across ≥ 2 percentile lines is more significant than a single below-normal value.</p>
              </AlertDescription>
            </Alert>

            <Alert className="bg-orange-50 border-orange-200 md:col-span-2">
              <Baby className="h-4 w-4 text-orange-600 shrink-0" />
              <AlertDescription className="text-xs text-orange-800 font-medium">
                <span className="font-black">SGA / IUGR guidance: </span>
                SGA ({"<"} 10th) — optimise feeds, review fortification, plot trend at every contact.{" "}
                Severe SGA ({"<"} 3rd) — if persistent despite optimal nutrition: refer for endocrine / GI evaluation.{" "}
                Symmetric SGA with HC also affected may indicate early-onset placental insufficiency or genetic cause.
              </AlertDescription>
            </Alert>
          </div>

          <p className="text-[10px] text-muted-foreground font-medium text-center pb-2">
            Reference: Fenton TR, Kim JH. BMC Pediatrics. 2013;13:59.
            Data are clinical approximations — for research, consult published LMS parameter tables from the original paper.
          </p>
        </div>
      </div>
    </div>
  );
}
