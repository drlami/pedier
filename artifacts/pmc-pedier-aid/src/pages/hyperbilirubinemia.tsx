import { useState, useMemo, useCallback, useRef } from "react";
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ReferenceDot, ReferenceArea, ResponsiveContainer, Label,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label as UILabel } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle, Baby, CheckCircle2, ChevronDown, ChevronUp, Clipboard,
  ClipboardCheck, Info, Printer, ShieldAlert, Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  convertToMgdL, MGDL_TO_UMOL, getChartData,
  calculateBilirubinResult, type BilirubinResult, type BilirubinZone,
} from "@/lib/bilirubin-thresholds";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type BilirubinUnit = 'mg/dL' | 'µmol/L';
type BilirubinType = 'TSB' | 'TcB';

// Neurotoxicity risk factors BEYOND gestational age (AAP 2022 §Risk Stratification)
// GA < 38 weeks is itself a NTX risk factor but is already encoded in the
// published nomogram curves — it must NOT appear here as a user-facing checkbox.
const NEUROTOXICITY_RISK_FACTORS = [
  { id: 'albumin_lt3', label: 'Serum albumin < 3.0 g/dL' },
  { id: 'hemolysis', label: 'Isoimmune hemolytic disease / positive DAT' },
  { id: 'g6pd', label: 'G6PD deficiency' },
  { id: 'sepsis', label: 'Sepsis' },
  { id: 'instability', label: 'Significant clinical instability in past 24 h' },
] as const;

const HYPERBILI_RISK_FACTORS = [
  { id: 'jaundice24h', label: 'Jaundice in first 24 hours of life' },
  { id: 'sibling_photo', label: 'Previous sibling required phototherapy' },
  { id: 'bruising', label: 'Significant bruising / cephalohematoma' },
  { id: 'bf_poor', label: 'Exclusive breastfeeding with poor intake / significant weight loss' },
  { id: 'east_asian', label: 'East Asian ethnicity' },
  { id: 'idm', label: 'Macrosomic infant of diabetic mother' },
] as const;

// ─── Zone Styling ─────────────────────────────────────────────────────────────

interface ZoneStyle {
  bg: string;
  border: string;
  text: string;
  badge: string;
  label: string;
  icon: typeof CheckCircle2;
  chartFill: string;
}

const ZONE_STYLES: Record<BilirubinZone, ZoneStyle> = {
  below: {
    bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800',
    badge: 'bg-green-100 text-green-700 border-green-300',
    label: 'Below treatment threshold — safe',
    icon: CheckCircle2, chartFill: 'rgba(134,239,172,0.25)',
  },
  near: {
    bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-900',
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    label: 'Approaching threshold — repeat soon',
    icon: Info, chartFill: 'rgba(253,224,71,0.25)',
  },
  phototherapy: {
    bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-900',
    badge: 'bg-blue-100 text-blue-800 border-blue-300',
    label: 'Phototherapy indicated',
    icon: Zap, chartFill: 'rgba(147,197,253,0.35)',
  },
  escalation: {
    bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-900',
    badge: 'bg-orange-100 text-orange-800 border-orange-300',
    label: 'Escalation of care — within 2 mg/dL of exchange threshold',
    icon: ShieldAlert, chartFill: 'rgba(253,186,116,0.40)',
  },
  exchange: {
    bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-900',
    badge: 'bg-red-100 text-red-800 border-red-300',
    label: 'Exchange transfusion threshold reached — EMERGENCY',
    icon: AlertTriangle, chartFill: 'rgba(252,165,165,0.45)',
  },
};

// ─── Custom chart dot ─────────────────────────────────────────────────────────

function PatientDot(props: any) {
  const { cx, cy, fill } = props;
  if (!cx || !cy) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill={fill} stroke="white" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={4} fill="white" />
    </g>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HyperbilirubinemiaCal() {
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  // Inputs
  const [gaWeeks, setGaWeeks] = useState<string>('');
  const [ageHours, setAgeHours] = useState<string>('');
  const [bilirubinValue, setBilirubinValue] = useState<string>('');
  const [bilirubinUnit, setBilirubinUnit] = useState<BilirubinUnit>('mg/dL');
  const [bilirubinType, setBilirubinType] = useState<BilirubinType>('TSB');

  // Neurotoxicity risk factors
  const [ntxRisks, setNtxRisks] = useState<Record<string, boolean>>({});
  // Hyperbilirubinemia risk factors
  const [hbRisks, setHbRisks] = useState<Record<string, boolean>>({});

  // Optional inputs
  const [showOptional, setShowOptional] = useState(false);
  const [rateOfRise, setRateOfRise] = useState<string>('');
  const [directBili, setDirectBili] = useState<string>('');
  const [weightKg, setWeightKg] = useState<string>('');
  const [jaundiceFirst24h, setJaundiceFirst24h] = useState(false);
  const [suspectedHemolysis, setSuspectedHemolysis] = useState(false);
  const [copied, setCopied] = useState(false);

  // ── Derived ──────────────────────────────────────────────────────────────

  const ga = parseInt(gaWeeks, 10);
  const hours = parseFloat(ageHours);
  const rawBili = parseFloat(bilirubinValue);
  const bilirubinMgdL = isNaN(rawBili) ? 0 : convertToMgdL(rawBili, bilirubinUnit);

  const hasNeurotoxicityRisk = useMemo(
    () => Object.values(ntxRisks).some(Boolean),
    [ntxRisks],
  );

  const isValid =
    !isNaN(ga) && ga >= 35 && ga <= 41 &&
    !isNaN(hours) && hours >= 0 && hours <= 336 &&
    !isNaN(rawBili) && rawBili > 0;

  const result: BilirubinResult | null = useMemo(() => {
    if (!isValid) return null;
    return calculateBilirubinResult({
      gaWeeks: ga,
      ageHours: hours,
      bilirubinMgdL,
      bilirubinType,
      hasNeurotoxicityRisk,
      rateOfRise: rateOfRise ? parseFloat(rateOfRise) : undefined,
      directBilirubin: directBili ? parseFloat(directBili) : undefined,
      weightKg: weightKg ? parseFloat(weightKg) : undefined,
      jaundiceFirst24h,
      suspectedHemolysis,
    });
  }, [isValid, ga, hours, bilirubinMgdL, bilirubinType, hasNeurotoxicityRisk,
    rateOfRise, directBili, weightKg, jaundiceFirst24h, suspectedHemolysis]);

  const chartData = useMemo(
    () => (isValid ? getChartData(ga, hasNeurotoxicityRisk) : []),
    [isValid, ga, hasNeurotoxicityRisk],
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  const toggleNtx = useCallback((id: string, checked: boolean) => {
    setNtxRisks((prev) => ({ ...prev, [id]: checked }));
  }, []);

  const toggleHb = useCallback((id: string, checked: boolean) => {
    setHbRisks((prev) => ({ ...prev, [id]: checked }));
  }, []);

  const handleCopy = () => {
    if (!result) return;
    const bili = `${bilirubinValue} ${bilirubinUnit} (${bilirubinMgdL.toFixed(1)} mg/dL)`;
    const zone = ZONE_STYLES[result.zone].label;
    const text = [
      `NEONATAL HYPERBILIRUBINEMIA ASSESSMENT`,
      `Date/Time: ${new Date().toLocaleString()}`,
      ``,
      `PATIENT DETAILS`,
      `Gestational Age: ${gaWeeks} weeks`,
      `Age: ${ageHours} hours`,
      `Bilirubin (${bilirubinType}): ${bili}`,
      `Neurotoxicity Risk Factors: ${hasNeurotoxicityRisk ? 'YES' : 'None'}`,
      ``,
      `THRESHOLDS (AAP 2022)`,
      `Phototherapy: ${result.phototherapyThreshold} mg/dL (${(result.phototherapyThreshold * MGDL_TO_UMOL).toFixed(0)} µmol/L)`,
      `Exchange transfusion: ${result.exchangeThreshold} mg/dL (${(result.exchangeThreshold * MGDL_TO_UMOL).toFixed(0)} µmol/L)`,
      ``,
      `ASSESSMENT`,
      `Zone: ${zone}`,
      ``,
      `RECOMMENDATION`,
      result.recommendation,
      result.followUpTiming ? `Follow-up: ${result.followUpTiming}` : '',
      result.confirmTSB ? `⚠ Confirm with TSB (TcB close to threshold or > 15 mg/dL)` : '',
      result.redFlags.length > 0 ? `\nRED FLAGS:\n${result.redFlags.map(f => `• ${f}`).join('\n')}` : '',
      ``,
      `DISCLAIMER: For clinical decision support only.`,
      `Confirm with local protocol / senior paediatrician.`,
      `Source: AAP 2022 Clinical Practice Guideline (Kemper et al., Pediatrics 2022).`,
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast({ title: 'Copied to clipboard' });
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => window.print();

  const zoneStyle = result ? ZONE_STYLES[result.zone] : null;
  const ZoneIcon = zoneStyle?.icon ?? CheckCircle2;

  // Patient dot for chart
  const patientHoursSnapped = isValid
    ? Math.round(hours / 4) * 4
    : null;
  const dotColor = result
    ? (['below', 'near'].includes(result.zone)
        ? '#22c55e'
        : result.zone === 'phototherapy'
          ? '#3b82f6'
          : result.zone === 'escalation'
            ? '#f97316'
            : '#ef4444')
    : '#6b7280';

  // Y-axis max — exchange thresholds can reach up to 27 mg/dL (Fig 3, GA ≥38)
  const yMax = result ? Math.max(30, Math.ceil((result.exchangeThreshold + 3) / 2) * 2) : 30;

  return (
    <div className="max-w-6xl mx-auto space-y-6 print:max-w-none" ref={printRef}>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Baby className="h-5 w-5 text-primary shrink-0" />
            <h1 className="text-2xl font-bold font-headline">Neonatal Hyperbilirubinemia Calculator</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            AAP 2022 · Infants ≥ 35 weeks gestational age · Phototherapy & exchange transfusion thresholds
          </p>
        </div>
        {result && (
          <div className="flex gap-2 print:hidden shrink-0">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <ClipboardCheck className="mr-1.5 h-4 w-4" /> : <Clipboard className="mr-1.5 h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy Summary'}
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-1.5 h-4 w-4" />
              Print
            </Button>
          </div>
        )}
      </div>

      {/* ── Warning banner ── */}
      <Alert className="border-amber-300 bg-amber-50 print:hidden">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 text-xs leading-relaxed">
          <strong>Clinical Decision Support Only.</strong> Confirm all decisions with local protocol and senior paediatrician.
          Threshold values are based on the AAP 2022 CPG (Kemper et al., Pediatrics 2022).
          This tool applies only to infants ≥ 35 weeks gestational age.
          Management must be based on <strong>Total Serum Bilirubin (TSB)</strong> when treatment decisions are required.
        </AlertDescription>
      </Alert>

      {/* ── Input grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Patient details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Baby className="h-4 w-4 text-primary" />
              Patient Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {/* Gestational age */}
              <div className="space-y-1.5">
                <UILabel className="text-xs font-medium">Gestational Age <span className="text-destructive">*</span></UILabel>
                <Select value={gaWeeks} onValueChange={setGaWeeks}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select GA" />
                  </SelectTrigger>
                  <SelectContent>
                    {[35, 36, 37, 38, 39, 40, 41].map((w) => (
                      <SelectItem key={w} value={String(w)}>{w} weeks</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground">GA at birth (not corrected)</p>
              </div>

              {/* Age in hours */}
              <div className="space-y-1.5">
                <UILabel className="text-xs font-medium">Age in Hours <span className="text-destructive">*</span></UILabel>
                <Input
                  type="number" min={0} max={336} step={1}
                  placeholder="e.g. 48"
                  value={ageHours}
                  onChange={(e) => setAgeHours(e.target.value)}
                />
                {ageHours && hours < 24 && (
                  <p className="text-[10px] text-amber-700 font-medium">
                    ⚠ Jaundice &lt; 24 h — requires urgent TSB
                  </p>
                )}
              </div>
            </div>

            {/* Bilirubin */}
            <div className="space-y-1.5">
              <UILabel className="text-xs font-medium">Bilirubin Value <span className="text-destructive">*</span></UILabel>
              <div className="flex gap-2">
                <Input
                  type="number" min={0} step={0.1}
                  placeholder="e.g. 12.5"
                  className="flex-1"
                  value={bilirubinValue}
                  onChange={(e) => setBilirubinValue(e.target.value)}
                />
                <Select value={bilirubinUnit} onValueChange={(v) => setBilirubinUnit(v as BilirubinUnit)}>
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mg/dL">mg/dL</SelectItem>
                    <SelectItem value="µmol/L">µmol/L</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {bilirubinValue && !isNaN(rawBili) && (
                <p className="text-[10px] text-muted-foreground">
                  ≈ {bilirubinUnit === 'mg/dL'
                    ? `${(rawBili * MGDL_TO_UMOL).toFixed(0)} µmol/L`
                    : `${convertToMgdL(rawBili, 'µmol/L').toFixed(1)} mg/dL`}
                </p>
              )}
            </div>

            {/* Bilirubin type */}
            <div className="space-y-1.5">
              <UILabel className="text-xs font-medium">Bilirubin Type <span className="text-destructive">*</span></UILabel>
              <div className="flex gap-2">
                {(['TSB', 'TcB'] as BilirubinType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setBilirubinType(t)}
                    className={cn(
                      "flex-1 py-2 rounded-md border text-sm font-medium transition-colors",
                      bilirubinType === t
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-input hover:bg-muted",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground">
                TSB = Total Serum Bilirubin (gold standard) · TcB = Transcutaneous Bilirubin (screening)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Risk Factors */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-orange-500" />
              Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Additional Neurotoxicity Risk Factors
              </p>
              <p className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 rounded p-2 leading-relaxed mb-2">
                <strong>Note:</strong> GA &lt; 38 weeks is a recognised neurotoxicity risk factor — the threshold curves for each
                gestational age already encode this. Check the boxes below only for <em>additional</em> risk factors
                beyond gestational age (albumin, haemolysis, G6PD, sepsis, instability).
              </p>
              <div className="space-y-2">
                {NEUROTOXICITY_RISK_FACTORS.map(({ id, label }) => (
                  <label key={id} className="flex items-start gap-2.5 cursor-pointer group">
                    <Checkbox
                      id={id}
                      checked={!!ntxRisks[id]}
                      onCheckedChange={(v) => toggleNtx(id, !!v)}
                      className="mt-0.5 shrink-0"
                    />
                    <span className="text-xs leading-relaxed group-hover:text-foreground text-muted-foreground">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Hyperbilirubinemia Risk Factors
                <span className="ml-1 text-muted-foreground/60">(inform monitoring frequency)</span>
              </p>
              <div className="space-y-2">
                {HYPERBILI_RISK_FACTORS.map(({ id, label }) => (
                  <label key={id} className="flex items-start gap-2.5 cursor-pointer group">
                    <Checkbox
                      id={id}
                      checked={!!hbRisks[id]}
                      onCheckedChange={(v) => toggleHb(id, !!v)}
                      className="mt-0.5 shrink-0"
                    />
                    <span className="text-xs leading-relaxed group-hover:text-foreground text-muted-foreground">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Optional inputs ── */}
      <Card>
        <button
          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors rounded-lg"
          onClick={() => setShowOptional((p) => !p)}
        >
          <span className="text-sm font-semibold text-muted-foreground">
            Optional Parameters
          </span>
          {showOptional
            ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
            : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        {showOptional && (
          <CardContent className="pt-0 pb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <UILabel className="text-xs">Rate of Rise (mg/dL/h)</UILabel>
                <Input type="number" inputMode="decimal" step={0.01} min={0} placeholder="e.g. 0.15"
                  value={rateOfRise} onChange={(e) => setRateOfRise(e.target.value)} />
                <p className="text-[10px] text-muted-foreground">&gt;0.2 mg/dL/h = rapid</p>
              </div>
              <div className="space-y-1.5">
                <UILabel className="text-xs">Direct/Conj. Bilirubin (mg/dL)</UILabel>
                <Input type="number" inputMode="decimal" step={0.1} min={0} placeholder="e.g. 0.5"
                  value={directBili} onChange={(e) => setDirectBili(e.target.value)} />
                <p className="text-[10px] text-muted-foreground">&gt;1.0 = evaluate cholestasis</p>
              </div>
              <div className="space-y-1.5">
                <UILabel className="text-xs">Baby Weight (kg)</UILabel>
                <Input type="number" inputMode="decimal" step={0.1} min={0} placeholder="e.g. 3.2"
                  value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
              </div>
              <div className="space-y-3 pt-1">
                <UILabel className="text-xs">Clinical Flags</UILabel>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <Checkbox checked={jaundiceFirst24h}
                    onCheckedChange={(v) => setJaundiceFirst24h(!!v)} />
                  Jaundice onset &lt; 24 h
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <Checkbox checked={suspectedHemolysis}
                    onCheckedChange={(v) => setSuspectedHemolysis(!!v)} />
                  Suspected haemolysis
                </label>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* ── Results ── */}
      {isValid && result && zoneStyle && (
        <div className="space-y-4 print:space-y-3">

          {/* Red flags */}
          {result.redFlags.length > 0 && (
            <Alert className="border-red-400 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <p className="font-bold text-red-800 mb-1.5">Red Flags — Immediate attention required</p>
                <ul className="space-y-1">
                  {result.redFlags.map((flag, i) => (
                    <li key={i} className="text-sm text-red-800 flex items-start gap-2">
                      <span className="text-red-500 shrink-0 mt-0.5">▶</span>
                      {flag}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* TcB confirmation */}
          {result.confirmTSB && (
            <Alert className="border-amber-400 bg-amber-50">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900 text-sm">
                <strong>Confirm with TSB:</strong> TcB is within 3 mg/dL of the phototherapy threshold
                {bilirubinMgdL > 15 ? ', or TcB > 15 mg/dL' : ''}. A venous TSB is required before
                making treatment decisions.
              </AlertDescription>
            </Alert>
          )}

          {/* Thresholds + Management row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Phototherapy threshold */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Phototherapy Threshold
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-3xl font-bold text-green-700 font-mono">
                  {result.phototherapyThreshold.toFixed(1)}
                  <span className="text-base font-normal text-muted-foreground ml-1">mg/dL</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {(result.phototherapyThreshold * MGDL_TO_UMOL).toFixed(0)} µmol/L
                </p>
                <Separator />
                <p className={cn("text-sm font-semibold", result.distanceFromPhototherapy >= 0 ? 'text-green-700' : 'text-red-600')}>
                  {result.distanceFromPhototherapy >= 0
                    ? `${result.distanceFromPhototherapy.toFixed(1)} mg/dL below threshold`
                    : `${Math.abs(result.distanceFromPhototherapy).toFixed(1)} mg/dL ABOVE threshold`}
                </p>
              </CardContent>
            </Card>

            {/* Exchange transfusion threshold */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Exchange Transfusion Threshold
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-3xl font-bold text-red-700 font-mono">
                  {result.exchangeThreshold.toFixed(1)}
                  <span className="text-base font-normal text-muted-foreground ml-1">mg/dL</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {(result.exchangeThreshold * MGDL_TO_UMOL).toFixed(0)} µmol/L
                </p>
                <Separator />
                <p className={cn("text-sm font-semibold", result.distanceFromExchange >= 0 ? 'text-green-700' : 'text-red-600')}>
                  {result.distanceFromExchange >= 0
                    ? `${result.distanceFromExchange.toFixed(1)} mg/dL below threshold`
                    : `${Math.abs(result.distanceFromExchange).toFixed(1)} mg/dL ABOVE threshold`}
                </p>
              </CardContent>
            </Card>

            {/* Current bilirubin */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Current Bilirubin ({bilirubinType})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-3xl font-bold text-foreground font-mono">
                  {bilirubinMgdL.toFixed(1)}
                  <span className="text-base font-normal text-muted-foreground ml-1">mg/dL</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {(bilirubinMgdL * MGDL_TO_UMOL).toFixed(0)} µmol/L
                </p>
                <Separator />
                <Badge className={cn("text-xs", zoneStyle.badge)}>
                  <ZoneIcon className="h-3 w-3 mr-1" />
                  {result.zone.charAt(0).toUpperCase() + result.zone.slice(1)} zone
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Management recommendation */}
          <Card className={cn("border-2", zoneStyle.border, zoneStyle.bg)}>
            <CardHeader className="pb-2">
              <CardTitle className={cn("text-base font-semibold flex items-center gap-2", zoneStyle.text)}>
                <ZoneIcon className="h-5 w-5 shrink-0" />
                {zoneStyle.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className={cn("text-sm leading-relaxed", zoneStyle.text)}>
                {result.recommendation}
              </p>
              {result.followUpTiming && (
                <div className={cn("flex items-center gap-2 text-sm font-semibold", zoneStyle.text)}>
                  <Info className="h-4 w-4 shrink-0" />
                  {result.followUpTiming}
                </div>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge variant="outline" className="text-[10px]">
                  GA {gaWeeks} weeks · {ageHours} hours
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {hasNeurotoxicityRisk ? '⚠ Additional NTX risk factors present' : 'No additional NTX risk factors'}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {bilirubinType}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                Bilirubin Nomogram
                <span className="text-xs font-normal text-muted-foreground">
                  — GA {gaWeeks} wks · {hasNeurotoxicityRisk ? 'with additional NTX risk factors (Fig 2/4)' : 'no additional NTX risk factors (Fig 1/3)'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Zone legend */}
              <div className="flex flex-wrap gap-3 mb-4 text-[10px] font-medium">
                {[
                  { label: 'Below treatment line', color: 'bg-green-100 border-green-300 text-green-700' },
                  { label: 'Phototherapy zone', color: 'bg-blue-100 border-blue-300 text-blue-700' },
                  { label: 'Escalation zone', color: 'bg-orange-100 border-orange-300 text-orange-700' },
                  { label: 'Exchange zone', color: 'bg-red-100 border-red-300 text-red-700' },
                  { label: 'Patient value', color: 'bg-gray-100 border-gray-300 text-gray-700' },
                ].map(({ label, color }) => (
                  <span key={label} className={cn("px-2 py-0.5 rounded border", color)}>
                    {label}
                  </span>
                ))}
              </div>

              <ResponsiveContainer width="100%" height={380}>
                <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <defs>
                    <pattern id="safe-pattern" patternUnits="userSpaceOnUse" width="8" height="8">
                      <rect width="8" height="8" fill="rgba(134,239,172,0.20)" />
                    </pattern>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                  {/* Zone backgrounds */}
                  <ReferenceArea y1={0} y2={result.phototherapyThreshold} fill="rgba(134,239,172,0.18)" />
                  <ReferenceArea
                    y1={result.phototherapyThreshold}
                    y2={Math.max(result.exchangeThreshold - 2, result.phototherapyThreshold)}
                    fill="rgba(147,197,253,0.28)"
                  />
                  <ReferenceArea
                    y1={Math.max(result.exchangeThreshold - 2, result.phototherapyThreshold)}
                    y2={result.exchangeThreshold}
                    fill="rgba(253,186,116,0.35)"
                  />
                  <ReferenceArea y1={result.exchangeThreshold} y2={yMax + 2} fill="rgba(252,165,165,0.30)" />

                  <XAxis dataKey="hours" type="number" domain={[0, 336]} ticks={[0, 24, 48, 72, 96, 120, 144, 168, 216, 264, 312, 336]}>
                    <Label value="Age (hours)" position="insideBottom" offset={-10} className="text-xs fill-muted-foreground" />
                  </XAxis>

                  <YAxis domain={[0, yMax]} tickCount={10}>
                    <Label value="Bilirubin (mg/dL)" angle={-90} position="insideLeft" offset={20} className="text-xs fill-muted-foreground" />
                  </YAxis>

                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(1)} mg/dL  (${(value * MGDL_TO_UMOL).toFixed(0)} µmol/L)`,
                      name,
                    ]}
                    labelFormatter={(h) => `Age: ${h} hours`}
                    contentStyle={{ fontSize: '11px', borderRadius: '8px' }}
                  />

                  <Legend
                    verticalAlign="top"
                    height={28}
                    formatter={(value) => <span style={{ fontSize: '11px' }}>{value}</span>}
                  />

                  {/* Phototherapy threshold line */}
                  <Line
                    type="monotone"
                    dataKey="phototherapy"
                    name="Phototherapy threshold"
                    stroke="#16a34a"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 3 }}
                  />

                  {/* Exchange transfusion threshold line */}
                  <Line
                    type="monotone"
                    dataKey="exchange"
                    name="Exchange transfusion threshold"
                    stroke="#dc2626"
                    strokeWidth={2.5}
                    strokeDasharray="6 3"
                    dot={false}
                    activeDot={{ r: 3 }}
                  />

                  {/* Patient dot */}
                  {patientHoursSnapped !== null && hours <= 336 && (
                    <ReferenceDot
                      x={patientHoursSnapped}
                      y={parseFloat(bilirubinMgdL.toFixed(1))}
                      r={10}
                      fill={dotColor}
                      stroke="white"
                      strokeWidth={2.5}
                      label={{
                        value: `${bilirubinMgdL.toFixed(1)} mg/dL`,
                        position: bilirubinMgdL > result.phototherapyThreshold ? 'insideBottom' : 'top',
                        fontSize: 11,
                        fontWeight: 600,
                        fill: dotColor,
                      }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>

              <p className="text-[10px] text-muted-foreground text-center mt-2">
                Patient marker ({dotColor === '#22c55e' || dotColor === '#3b82f6' ? '●' : '●'}) shown at age {Math.round(hours)} h.
                Chart shows thresholds for GA {gaWeeks} weeks {hasNeurotoxicityRisk ? 'with' : 'without'} neurotoxicity risk factors.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty state */}
      {!isValid && (
        <Card className="border-dashed border-2">
          <CardContent className="py-12 text-center">
            <Baby className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-muted-foreground font-medium">Enter gestational age, age in hours, and bilirubin value to calculate thresholds.</p>
            <p className="text-xs text-muted-foreground mt-1">Results, chart, and management recommendations will appear here.</p>
          </CardContent>
        </Card>
      )}

      {/* ── Disclaimer / Sources ── */}
      <Card className="bg-muted/30 print:border-0">
        <CardContent className="py-4 space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Sources & Disclaimer</p>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside leading-relaxed">
            <li>
              <strong>AAP 2022 CPG:</strong> Kemper AR, Newman TB, Slaughter JL, et al.
              Clinical Practice Guideline Revision: Management of Hyperbilirubinemia in the Newborn
              Infant 35 or More Weeks of Gestation. <em>Pediatrics.</em> 2022;150(3):e2022058864.
              DOI: 10.1542/peds.2022-058864
            </li>
            <li>
              <strong>Scope:</strong> This tool applies only to infants ≥ 35 weeks gestational age.
              For infants &lt; 35 weeks, a separate NICU/neonatology protocol is required.
            </li>
            <li>
              <strong>TSB vs TcB:</strong> TcB is a screening tool. When TcB is within 3 mg/dL of
              the phototherapy threshold, or TcB &gt; 15 mg/dL, confirm with TSB before
              making treatment decisions.
            </li>
            <li>
              <strong>Disclaimer:</strong> For clinical decision support only.
              All decisions must be confirmed with the local hospital protocol and a senior paediatrician/neonatologist.
              Threshold values are derived from the AAP 2022 guideline supplementary tables and should
              be verified against published data before clinical implementation.
            </li>
            <li>Coded by Dr Lami Qurt — PMC PediER Aid</li>
          </ul>
        </CardContent>
      </Card>

      {/* Print styles */}
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { font-size: 11px; }
          .print\\:space-y-3 > * + * { margin-top: 0.75rem; }
        }
      `}</style>
    </div>
  );
}
