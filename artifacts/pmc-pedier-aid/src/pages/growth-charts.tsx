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
import {
  DS_WEIGHT_BOYS, DS_WEIGHT_GIRLS,
  DS_HEIGHT_BOYS, DS_HEIGHT_GIRLS,
  DS_HC_BOYS, DS_HC_GIRLS,
} from "@/lib/calculators/growth-data-down-syndrome";
import {
  ACH_WEIGHT_BOYS, ACH_WEIGHT_GIRLS,
  ACH_HEIGHT_BOYS, ACH_HEIGHT_GIRLS,
  ACH_HC_BOYS, ACH_HC_GIRLS,
} from "@/lib/calculators/growth-data-achondroplasia";
import {
  CP_GMFCS1_WEIGHT_BOYS, CP_GMFCS1_WEIGHT_GIRLS, CP_GMFCS1_HEIGHT_BOYS, CP_GMFCS1_HEIGHT_GIRLS,
  CP_GMFCS2_WEIGHT_BOYS, CP_GMFCS2_WEIGHT_GIRLS, CP_GMFCS2_HEIGHT_BOYS, CP_GMFCS2_HEIGHT_GIRLS,
  CP_GMFCS3_WEIGHT_BOYS, CP_GMFCS3_WEIGHT_GIRLS, CP_GMFCS3_HEIGHT_BOYS, CP_GMFCS3_HEIGHT_GIRLS,
  CP_GMFCS4_WEIGHT_BOYS, CP_GMFCS4_WEIGHT_GIRLS, CP_GMFCS4_HEIGHT_BOYS, CP_GMFCS4_HEIGHT_GIRLS,
  CP_GMFCS5_AMB_WEIGHT_BOYS, CP_GMFCS5_AMB_WEIGHT_GIRLS, CP_GMFCS5_AMB_HEIGHT_BOYS, CP_GMFCS5_AMB_HEIGHT_GIRLS,
  CP_GMFCS5_TF_WEIGHT_BOYS, CP_GMFCS5_TF_WEIGHT_GIRLS, CP_GMFCS5_TF_HEIGHT_BOYS, CP_GMFCS5_TF_HEIGHT_GIRLS,
} from "@/lib/calculators/growth-data-cerebral-palsy";
import { TURNER_HEIGHT } from "@/lib/calculators/growth-data-turner";
import { cn } from "@/lib/utils";

type Sex = "male" | "female";
type MeasureType = "weight" | "height" | "hc";
type StandardId =
  | "who" | "down_syndrome" | "achondroplasia" | "turner"
  | "cp_gmfcs_1" | "cp_gmfcs_2" | "cp_gmfcs_3" | "cp_gmfcs_4" | "cp_gmfcs_5_amb" | "cp_gmfcs_5_tf";

interface GrowthStandardDef {
  id: StandardId;
  label: string;
  shortLabel: string;
  citation: string;
  maxMonths: number;
  yDomain: Record<MeasureType, [number, number]>;
  valueRange: Record<MeasureType, [number, number]>;
  datasets: Record<MeasureType, Record<Sex, GrowthPoint[]>>;
  groupId: string;
  groupLabel: string;
  subLabel: string;
  sexLock?: Sex;
}

const CP_CITATION = "Reference: Brooks J, et al. \"Low weight, morbidity, and mortality in children with cerebral palsy: new clinical growth charts.\" Pediatrics. 2011;128(2):e299-e307. Percentiles derived from published LMS parameters, stratified by Gross Motor Function Classification System (GMFCS) level. No head circumference reference is published for this chart; the standard WHO head circumference chart is used instead. Data starts at 2 years (GMFCS is not reliably assigned earlier).";

function cpStandard(
  id: StandardId,
  subLabel: string,
  fullSubLabel: string,
  weight: Record<Sex, GrowthPoint[]>,
  height: Record<Sex, GrowthPoint[]>,
): GrowthStandardDef {
  return {
    id,
    label: `Cerebral Palsy Growth Charts — ${fullSubLabel}`,
    shortLabel: `CP ${subLabel}`,
    citation: CP_CITATION,
    maxMonths: 240,
    yDomain: { weight: [0, 100], height: [40, 190], hc: [30, 56] },
    valueRange: { weight: [1.5, 105], height: [40, 190], hc: [25, 60] },
    datasets: {
      weight,
      height,
      hc: { male: WHO_HC_BOYS, female: WHO_HC_GIRLS },
    },
    groupId: "cerebral_palsy",
    groupLabel: "Cerebral Palsy",
    subLabel,
  };
}

const GROWTH_STANDARDS: Record<StandardId, GrowthStandardDef> = {
  who: {
    id: "who",
    label: "WHO Growth Standards",
    shortLabel: "WHO 2006",
    citation: "Reference: WHO Child Growth Standards. WHO Press, Geneva. 2006. Values are linearly interpolated from 7-point anchor data — for research use, consult the published LMS parameter tables.",
    maxMonths: 60,
    yDomain: { weight: [0, 26], height: [40, 125], hc: [30, 56] },
    valueRange: { weight: [1.5, 30], height: [40, 130], hc: [25, 60] },
    datasets: {
      weight: { male: WHO_WEIGHT_BOYS, female: WHO_WEIGHT_GIRLS },
      height: { male: WHO_HEIGHT_BOYS, female: WHO_HEIGHT_GIRLS },
      hc: { male: WHO_HC_BOYS, female: WHO_HC_GIRLS },
    },
    groupId: "who", groupLabel: "WHO 2006", subLabel: "WHO 2006",
  },
  down_syndrome: {
    id: "down_syndrome",
    label: "Down Syndrome Growth Charts",
    shortLabel: "Down Syndrome",
    citation: "Reference: Zemel BS, et al. \"Growth Charts for Children With Down Syndrome in the United States.\" Pediatrics. 2015;136(5):e1204-e1211. Percentiles derived from published LMS parameters (infant chart 0–36mo, pediatric chart 2–20y).",
    maxMonths: 240,
    yDomain: { weight: [0, 100], height: [40, 175], hc: [30, 60] },
    valueRange: { weight: [1.5, 105], height: [40, 175], hc: [25, 60] },
    datasets: {
      weight: { male: DS_WEIGHT_BOYS, female: DS_WEIGHT_GIRLS },
      height: { male: DS_HEIGHT_BOYS, female: DS_HEIGHT_GIRLS },
      hc: { male: DS_HC_BOYS, female: DS_HC_GIRLS },
    },
    groupId: "down_syndrome", groupLabel: "Down Syndrome", subLabel: "Down Syndrome",
  },
  achondroplasia: {
    id: "achondroplasia",
    label: "Achondroplasia Growth Charts",
    shortLabel: "Achondroplasia",
    citation: "Reference: Hoover-Fong JE, et al. \"Growth in achondroplasia including stature, weight, weight-for-height and head circumference from CLARITY.\" Orphanet J Rare Dis. 2021;16(1):522. Percentiles derived from published spline-smoothed mean/SD tables (split-normal approximation). Head circumference data reflects ages 0–54 months (the surveillance-relevant window for foramen magnum stenosis); later ages hold the last modeled value flat.",
    maxMonths: 240,
    yDomain: { weight: [0, 90], height: [40, 150], hc: [30, 60] },
    valueRange: { weight: [1.5, 90], height: [35, 150], hc: [25, 60] },
    datasets: {
      weight: { male: ACH_WEIGHT_BOYS, female: ACH_WEIGHT_GIRLS },
      height: { male: ACH_HEIGHT_BOYS, female: ACH_HEIGHT_GIRLS },
      hc: { male: ACH_HC_BOYS, female: ACH_HC_GIRLS },
    },
    groupId: "achondroplasia", groupLabel: "Achondroplasia", subLabel: "Achondroplasia",
  },
  turner: {
    id: "turner",
    label: "Turner Syndrome Growth Chart (height only)",
    shortLabel: "Turner Syndrome",
    citation: "Reference: Lyon AJ, Preece MA, Grant DB. \"Growth curve for girls with Turner syndrome.\" Arch Dis Child. 1985;60(10):932-935 (Genentech/TSF reproduction). Height only, untreated/pre-growth-hormone-era cohort. Values visually digitized from the published chart (~1cm precision) — lower confidence than the Down syndrome, achondroplasia, and cerebral palsy references, which use exact source data.",
    maxMonths: 240,
    yDomain: { weight: [0, 100], height: [40, 175], hc: [30, 56] },
    valueRange: { weight: [1.5, 100], height: [60, 175], hc: [25, 60] },
    datasets: {
      weight: { male: WHO_WEIGHT_BOYS, female: WHO_WEIGHT_GIRLS },
      height: { male: WHO_HEIGHT_BOYS, female: TURNER_HEIGHT },
      hc: { male: WHO_HC_BOYS, female: WHO_HC_GIRLS },
    },
    groupId: "turner", groupLabel: "Turner Syndrome", subLabel: "Turner Syndrome",
    sexLock: "female",
  },
  cp_gmfcs_1: cpStandard("cp_gmfcs_1", "I", "GMFCS I (walks without limitation)",
    { male: CP_GMFCS1_WEIGHT_BOYS, female: CP_GMFCS1_WEIGHT_GIRLS },
    { male: CP_GMFCS1_HEIGHT_BOYS, female: CP_GMFCS1_HEIGHT_GIRLS }),
  cp_gmfcs_2: cpStandard("cp_gmfcs_2", "II", "GMFCS II (walks with limitations)",
    { male: CP_GMFCS2_WEIGHT_BOYS, female: CP_GMFCS2_WEIGHT_GIRLS },
    { male: CP_GMFCS2_HEIGHT_BOYS, female: CP_GMFCS2_HEIGHT_GIRLS }),
  cp_gmfcs_3: cpStandard("cp_gmfcs_3", "III", "GMFCS III (walks with a hand-held mobility device)",
    { male: CP_GMFCS3_WEIGHT_BOYS, female: CP_GMFCS3_WEIGHT_GIRLS },
    { male: CP_GMFCS3_HEIGHT_BOYS, female: CP_GMFCS3_HEIGHT_GIRLS }),
  cp_gmfcs_4: cpStandard("cp_gmfcs_4", "IV", "GMFCS IV (self-mobility with limitations; may use powered mobility)",
    { male: CP_GMFCS4_WEIGHT_BOYS, female: CP_GMFCS4_WEIGHT_GIRLS },
    { male: CP_GMFCS4_HEIGHT_BOYS, female: CP_GMFCS4_HEIGHT_GIRLS }),
  cp_gmfcs_5_amb: cpStandard("cp_gmfcs_5_amb", "V (oral-fed)", "GMFCS V, orally fed (transported in a manual wheelchair)",
    { male: CP_GMFCS5_AMB_WEIGHT_BOYS, female: CP_GMFCS5_AMB_WEIGHT_GIRLS },
    { male: CP_GMFCS5_AMB_HEIGHT_BOYS, female: CP_GMFCS5_AMB_HEIGHT_GIRLS }),
  cp_gmfcs_5_tf: cpStandard("cp_gmfcs_5_tf", "V (tube-fed)", "GMFCS V, tube fed (gastrostomy/enteral feeding)",
    { male: CP_GMFCS5_TF_WEIGHT_BOYS, female: CP_GMFCS5_TF_WEIGHT_GIRLS },
    { male: CP_GMFCS5_TF_HEIGHT_BOYS, female: CP_GMFCS5_TF_HEIGHT_GIRLS }),
};

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

function classify(value: number, ref: GrowthPoint, type: MeasureType, standard: StandardId): ClassResult {
  const z = calcZScore(value, ref);
  const def = GROWTH_STANDARDS[standard];
  const peerLabel = def.groupId === "cerebral_palsy" ? `${def.groupLabel} ${def.subLabel}` : def.shortLabel;
  const rel = standard !== "who" ? ` vs. ${peerLabel} peers` : "";
  const crossCheck = standard !== "who" ? ` Cross-check against the WHO standard chart before attributing this to ${peerLabel} alone.` : "";
  if (type === "weight") {
    if (z < -3)  return { label: "Severely Underweight" + rel, sublabel: "< −3 SD", color: "text-red-700",    bg: "bg-red-50 border-red-300",    concern: `< −3 SD${rel} — marked deviation: urgent nutritional and medical review.${crossCheck}` };
    if (z < -2)  return { label: "Underweight" + rel,          sublabel: "−3 to −2 SD", color: "text-orange-700", bg: "bg-orange-50 border-orange-300" };
    if (z > 3)   return { label: "Obese" + rel,                sublabel: "> +3 SD",  color: "text-purple-700", bg: "bg-purple-50 border-purple-300", concern: `> +3 SD${rel} — consider endocrine/metabolic evaluation.${crossCheck}` };
    if (z > 2)   return { label: "Overweight" + rel,           sublabel: "+2 to +3 SD", color: "text-amber-700",  bg: "bg-amber-50 border-amber-300" };
    return             { label: "Normal Weight" + rel,         sublabel: "−2 to +2 SD", color: "text-emerald-700",bg: "bg-emerald-50 border-emerald-300" };
  }
  if (type === "height") {
    if (z < -3)  return { label: "Severely Short" + rel, sublabel: "< −3 SD",  color: "text-red-700",    bg: "bg-red-50 border-red-300",    concern: `< −3 SD${rel} — marked deviation: rule out organic/systemic cause.${crossCheck}` };
    if (z < -2)  return { label: "Short Stature" + rel,          sublabel: "−3 to −2 SD", color: "text-orange-700", bg: "bg-orange-50 border-orange-300" };
    if (z > 3)   return { label: "Very Tall" + rel,        sublabel: "> +3 SD",  color: "text-purple-700", bg: "bg-purple-50 border-purple-300" };
    if (z > 2)   return { label: "Tall" + rel,             sublabel: "+2 to +3 SD", color: "text-amber-600",  bg: "bg-amber-50 border-amber-200" };
    return             { label: "Normal Height" + rel,     sublabel: "−2 to +2 SD", color: "text-emerald-700",bg: "bg-emerald-50 border-emerald-300" };
  }
  // HC
  if (z < -3)    return { label: "Severe Microcephaly" + rel, sublabel: "< −3 SD",  color: "text-red-700",    bg: "bg-red-50 border-red-300",    concern: `< −3 SD${rel} — neurology/genetics referral indicated.${crossCheck}` };
  if (z < -2)    return { label: "Microcephaly" + rel,        sublabel: "−3 to −2 SD", color: "text-orange-700", bg: "bg-orange-50 border-orange-300", concern: `< −2 SD${rel} — monitor closely; consider neuroimaging if progressive or symptomatic.${crossCheck}` };
  if (z > 3)     return { label: "Severe Macrocephaly" + rel, sublabel: "> +3 SD",  color: "text-purple-700", bg: "bg-purple-50 border-purple-300", concern: `> +3 SD${rel} — hydrocephalus/megalencephaly: head imaging recommended.${crossCheck}` };
  if (z > 2)     return { label: "Macrocephaly" + rel,        sublabel: "+2 to +3 SD", color: "text-amber-700",  bg: "bg-amber-50 border-amber-300" };
  return               { label: "Normal HC" + rel,            sublabel: "−2 to +2 SD", color: "text-emerald-700",bg: "bg-emerald-50 border-emerald-300" };
}

const SYNDROME_GUIDANCE: Partial<Record<string, { chartUse: string; thresholdLabel: string; thresholdLines: string[] }>> = {
  down_syndrome: {
    chartUse: "This chart plots growth relative to other children with Down syndrome, not the general population — it will not flag the population-level short stature and weight gain that are expected with Down syndrome.",
    thresholdLabel: "Down syndrome action thresholds",
    thresholdLines: [
      "< −2 SD on this chart: a real deviation even for a child with Down syndrome — don't dismiss it as \"just DS\".",
      "< −3 SD: marked deviation — screen for comorbid causes (thyroid, cardiac, coeliac, feeding).",
      "Also plot the child on the standard WHO chart to see the absolute (population) picture.",
    ],
  },
  achondroplasia: {
    chartUse: "This chart plots growth relative to other children with achondroplasia, not the general population — short stature itself is expected and is not, alone, a reason for concern here.",
    thresholdLabel: "Achondroplasia action thresholds",
    thresholdLines: [
      "< −2 or > +2 SD on this chart: a real deviation from achondroplasia-specific norms — investigate as in any child.",
      "HC surveillance matters most in the first years of life (foramen magnum stenosis risk) — rapid HC crossing percentiles or new neuro signs warrant urgent imaging regardless of this chart's percentile.",
      "Also plot the child on the standard WHO chart to communicate absolute size to families and non-specialist teams.",
    ],
  },
  turner: {
    chartUse: "This chart plots height relative to other girls with untreated Turner syndrome (1985 cohort, pre-growth-hormone era) — it will not flag the short stature that is expected with Turner syndrome itself. A growth-hormone-treated patient should plot taller than this chart predicts; use it as a floor, not a target.",
    thresholdLabel: "Turner syndrome action thresholds",
    thresholdLines: [
      "< −2 SD on this chart: shorter than expected even for untreated Turner syndrome — reassess growth-hormone dosing/adherence if treated, or expedite referral if not yet on therapy.",
      "Falling growth velocity at any point (not just low absolute height) is itself an indication to review GH therapy.",
      "Values here are digitized from a published chart image (~1cm precision), not an exact source table — treat close calls with clinical judgement, not the plotted number alone.",
    ],
  },
  cerebral_palsy: {
    chartUse: "This chart plots weight/height relative to other children at the same GMFCS level, not the general population — it exists to separate expected leanness-for-severity from true undernutrition, which is the main driver of unnecessary gastrostomy referrals when a general-population chart is used instead.",
    thresholdLabel: "Cerebral palsy action thresholds",
    thresholdLines: [
      "< −2 SD on this chart: low even for this GMFCS level — assess intake, aspiration risk, and reflux before assuming it's \"just the CP\".",
      "< −3 SD: marked deviation — nutrition team referral; consider gastrostomy discussion if oral intake is unsafe or insufficient.",
      "If GMFCS level changes (e.g. after surgery or with age), re-plot on the correct level's chart — the reference population shifts.",
    ],
  },
};

const MEASURE_META: Record<MeasureType, { label: string; unit: string; placeholder: string; decimals: number }> = {
  weight: { label: "Weight (kg)",             unit: "kg", placeholder: "e.g. 10.5", decimals: 2 },
  height: { label: "Height / Length (cm)",    unit: "cm", placeholder: "e.g. 85.0", decimals: 1 },
  hc:     { label: "Head Circumference (cm)", unit: "cm", placeholder: "e.g. 46.0", decimals: 1 },
};

export default function GrowthChartPage() {
  const [standard, setStandard]       = useState<StandardId>("who");
  const [sex, setSex]                 = useState<Sex>("male");
  const [measureType, setMeasureType] = useState<MeasureType>("weight");
  const [ageYearsInput, setAgeYearsInput]   = useState("");
  const [ageMonthsInput, setAgeMonthsInput] = useState("");
  const [premWeeksInput, setPremWeeksInput] = useState("");
  const [valueInput, setValueInput]         = useState("");

  const standardDef = GROWTH_STANDARDS[standard];
  const maxYears = standardDef.maxMonths / 12;

  const standardGroups = useMemo(() => {
    const groups: { groupId: string; groupLabel: string; members: GrowthStandardDef[] }[] = [];
    for (const s of Object.values(GROWTH_STANDARDS)) {
      let g = groups.find(g => g.groupId === s.groupId);
      if (!g) { g = { groupId: s.groupId, groupLabel: s.groupLabel, members: [] }; groups.push(g); }
      g.members.push(s);
    }
    return groups;
  }, []);

  const ageYrs  = parseInt(ageYearsInput)  || 0;
  const ageMos  = parseInt(ageMonthsInput) || 0;
  const premWks = parseFloat(premWeeksInput) || 0;

  const totalMonths     = ageYrs * 12 + ageMos;
  const correctedMonths = Math.max(0, totalMonths - premWks / 4.33);
  const effectiveMonths = premWks > 0 ? correctedMonths : totalMonths;

  const ageEntered = ageYearsInput !== "" || ageMonthsInput !== "";
  const ageValid   = ageEntered && effectiveMonths >= 0 && effectiveMonths <= standardDef.maxMonths;

  const valueNum   = parseFloat(valueInput);
  const valueValid = isFinite(valueNum) && valueNum > 0;

  const effectiveSex = standardDef.sexLock ?? sex;

  const dataset = useMemo((): GrowthPoint[] => {
    return standardDef.datasets[measureType][effectiveSex];
  }, [standardDef, measureType, effectiveSex]);

  // Smooth reference curves: one point per month across the standard's full range
  const chartLineData = useMemo(() => {
    const pts: Record<string, number>[] = [];
    for (let m = 0; m <= standardDef.maxMonths; m++) {
      const r = interpolateWHO(dataset, m);
      pts.push({ month: m, p3: r.p3, p15: r.p15, p50: r.p50, p85: r.p85, p97: r.p97 });
    }
    return pts;
  }, [dataset, standardDef]);

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
    () => (refPoint && valueValid ? classify(valueNum, refPoint, measureType, standard) : null),
    [refPoint, valueNum, valueValid, measureType, standard]
  );

  const inputWarning = useMemo(() => {
    if (!valueValid) return null;
    const [lo, hi] = standardDef.valueRange[measureType];
    if (valueNum < lo || valueNum > hi) {
      const label = measureType === "weight" ? "Weight" : measureType === "height" ? "Height" : "HC";
      return `${label} outside expected range for 0–${maxYears}y on ${standardDef.shortLabel}.`;
    }
    return null;
  }, [measureType, valueNum, valueValid, standardDef, maxYears]);

  const { unit, placeholder, decimals } = MEASURE_META[measureType];
  const yDom = standardDef.yDomain[measureType];

  const xTicks = standardDef.maxMonths <= 60
    ? [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60]
    : Array.from({ length: standardDef.maxMonths / 24 + 1 }, (_, i) => i * 24);
  const yearReferenceLines = standardDef.maxMonths <= 60 ? [12, 24, 36, 48] : [60, 120, 180];

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

      {/* ── Growth Standard selector: own row, top of page ── */}
      <div className="flex flex-col gap-2 mb-6">
        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Growth Standard</Label>
        <div className="bg-muted/50 p-1.5 rounded-2xl border flex gap-1 flex-wrap">
          {standardGroups.map((g) => (
            <Button
              key={g.groupId}
              variant={standardDef.groupId === g.groupId ? "default" : "ghost"}
              size="sm"
              className={cn("rounded-xl font-bold px-4 active:scale-95", standardDef.groupId === g.groupId && "bg-slate-800 shadow-md")}
              onClick={() => { setStandard(g.members[0].id); setValueInput(""); setAgeYearsInput(""); setAgeMonthsInput(""); }}
            >
              {g.groupLabel}
            </Button>
          ))}
        </div>
        {standardGroups.find(g => g.groupId === standardDef.groupId)!.members.length > 1 && (
          <div className="bg-amber-50 p-1.5 rounded-2xl border border-amber-200 flex gap-1 flex-wrap">
            {standardGroups.find(g => g.groupId === standardDef.groupId)!.members.map((s) => (
              <Button
                key={s.id}
                variant={standard === s.id ? "default" : "ghost"}
                size="sm"
                className={cn("rounded-lg font-bold px-3 text-xs h-8 active:scale-95", standard === s.id && "bg-amber-600 shadow-md")}
                onClick={() => { setStandard(s.id); setValueInput(""); }}
              >
                {s.subLabel}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* ── Header ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-100">
            <TrendingUp className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black font-headline tracking-tight">{standardDef.label}</h1>
            <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest mt-1">
              Weight · Height · Head Circumference · 0–{maxYears} Years
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
                {standardDef.sexLock ? (
                  <p className="text-xs font-bold bg-muted/60 border rounded-xl px-3 py-2.5 text-muted-foreground">
                    Fixed to Female — {standardDef.groupLabel} occurs only in phenotypic females.
                  </p>
                ) : (
                  <Tabs value={sex} onValueChange={(v: string) => setSex(v as Sex)}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="male"   className="font-bold active:scale-95">Male</TabsTrigger>
                      <TabsTrigger value="female" className="font-bold active:scale-95">Female</TabsTrigger>
                    </TabsList>
                  </Tabs>
                )}
              </div>

              {/* Age: years + months */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Age <span className="font-normal normal-case opacity-60">(0–{maxYears} years)</span>
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      type="number"
                      inputMode="numeric"
                      placeholder="Yrs"
                      min={0} max={maxYears}
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
                {ageEntered && (totalMonths < 0 || totalMonths > standardDef.maxMonths) && (
                  <p className="text-xs text-red-500 font-bold">Age must be 0–{standardDef.maxMonths} months</p>
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
                    domain={[0, standardDef.maxMonths]}
                    ticks={xTicks}
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
                  {yearReferenceLines.map((m) => (
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
                {SYNDROME_GUIDANCE[standardDef.groupId] ? (
                  <p>{SYNDROME_GUIDANCE[standardDef.groupId]!.chartUse} For preterm infants, apply <strong>corrected age</strong> until 2 years corrected.</p>
                ) : (
                  <p>Use <strong>WHO Growth Standards</strong> from birth to 5 years. For preterm infants, apply <strong>corrected age</strong> (chronological age − weeks premature ÷ 4.33) until 2 years corrected.</p>
                )}
              </AlertDescription>
            </Alert>

            <Alert className="bg-amber-50 border-amber-200">
              <TrendingUp className="h-4 w-4 text-amber-600 shrink-0" />
              <AlertDescription className="text-xs text-amber-800 font-medium space-y-1">
                {SYNDROME_GUIDANCE[standardDef.groupId] ? (
                  <>
                    <p className="font-black">{SYNDROME_GUIDANCE[standardDef.groupId]!.thresholdLabel}</p>
                    {SYNDROME_GUIDANCE[standardDef.groupId]!.thresholdLines.map((line, i) => <p key={i}>{line}</p>)}
                  </>
                ) : (
                  <>
                    <p className="font-black">WHO action thresholds</p>
                    <p>{"< −2 SD"}: Underweight / Stunted — optimise nutrition, rule out organic disease.</p>
                    <p>{"< −3 SD"}: Severe — urgent nutritional + medical review.</p>
                    <p>{"> +2 SD"} weight: Overweight — dietary assessment and activity counselling.</p>
                  </>
                )}
              </AlertDescription>
            </Alert>

            <Alert className="bg-orange-50 border-orange-200 md:col-span-2">
              <Baby className="h-4 w-4 text-orange-600 shrink-0" />
              <AlertDescription className="text-xs text-orange-800 font-medium">
                <span className="font-black">Trend matters more than a single point. </span>
                Falling across ≥ 2 major percentile channels warrants investigation regardless of absolute value.
                {SYNDROME_GUIDANCE[standardDef.groupId]
                  ? ` Marked deviation from ${standardDef.shortLabel}-specific norms still warrants the same workup as in any child — the reference population changes what's "expected", not what's ignorable.`
                  : <> Severe stunting ({"< −3 SD"}) requires systemic workup; isolated HC deviations{" "}
                     ({"< −2 SD or > +2 SD"}) warrant neurological review if progressive or symptomatic.</>
                }
              </AlertDescription>
            </Alert>
          </div>

          <p className="text-[10px] text-muted-foreground font-medium text-center pb-2">
            {standardDef.citation}
          </p>
        </div>
      </div>
    </div>
  );
}
