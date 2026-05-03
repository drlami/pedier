'use client';

import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  AlertTriangle, CheckCircle2, TriangleAlert, Zap,
  Stethoscope, Activity, Brain, FlaskConical, Ambulance,
  Printer, ClipboardList, ChevronDown,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface CrisisFormData {
  ageGroup: string;
  glucose: string;
  ph: string;
  bicarb: string;
  lactate: string;
  ammonia: string;
  ketones: string;
  encephalopathy: boolean | undefined;
  seizures: boolean | undefined;
}

type PatternId = 'A' | 'B' | 'C' | 'D' | 'mixed' | 'insufficient';

interface PatternDef {
  id: PatternId;
  label: string;
  likely: string;
  description: string;
  accent: string;
  headerBg: string;
  headerText: string;
  management: string[];
  cofactors?: string[];
}

// ─── Pattern Definitions ────────────────────────────────────────────────────────

const PATTERNS: Record<PatternId, PatternDef> = {
  A: {
    id: 'A', label: 'Pattern A',
    likely: 'Likely Urea Cycle Disorder (UCD)',
    description: 'Hyperammonemia + no/mild acidosis + absent or low ketones',
    accent: 'border-l-red-500', headerBg: 'bg-red-50', headerText: 'text-red-800',
    management: [
      'STOP all protein intake immediately',
      'Start IV 10% glucose — target GIR 8–10 mg/kg/min to suppress catabolism',
      'URGENT discussion with metabolic specialist and PICU',
      'Consider ammonia scavengers (sodium benzoate / sodium phenylacetate) per specialist protocol',
      'Consider arginine supplementation per specialist',
      'Consider haemodialysis / haemofiltration if ammonia > 400 μmol/L or rapid rise with encephalopathy',
      'Do NOT restrict fluids — dilution helps reduce ammonia',
      'Monitor ammonia every 2–4 hours until stable',
    ],
  },
  B: {
    id: 'B', label: 'Pattern B',
    likely: 'Likely Organic Acidemia or MSUD',
    description: 'Metabolic acidosis + elevated ketones ± hyperammonemia',
    accent: 'border-l-orange-500', headerBg: 'bg-orange-50', headerText: 'text-orange-800',
    management: [
      'STOP all protein intake immediately',
      'Start IV 10% glucose — GIR 8–10 mg/kg/min',
      'Consider L-carnitine 100 mg/kg/day IV (organic acidemias: PA, MMA)',
      'Consider metronidazole 10 mg/kg/day (reduces propionate load in PA/MMA)',
      'Consider specific cofactors depending on suspected diagnosis (see below)',
      'Correct severe acidosis: sodium bicarbonate if pH < 7.1 after adequate fluid resuscitation',
      'URGENT metabolic/PICU discussion',
    ],
    cofactors: [
      'Hydroxocobalamin (Vitamin B12) → Methylmalonic acidemia (MMA)',
      'Biotin → Multiple carboxylase deficiency (MCD)',
      'Thiamine (Vitamin B1) → Maple Syrup Urine Disease (MSUD)',
      'Riboflavin (Vitamin B2) → Some fatty acid oxidation defects',
    ],
  },
  C: {
    id: 'C', label: 'Pattern C',
    likely: 'Likely Fatty Acid Oxidation (FAO) Defect or Hyperinsulinism',
    description: 'Hypoglycemia + absent or inappropriately low ketones',
    accent: 'border-l-amber-500', headerBg: 'bg-amber-50', headerText: 'text-amber-800',
    management: [
      'URGENT IV glucose bolus: 2 mL/kg of 10% dextrose IV push',
      'Maintain GIR 8–12 mg/kg/min (use 10–15% glucose as needed)',
      'AVOID ALL fasting — ensure continuous glucose throughout',
      'Do NOT give lipid infusion (Intralipid) if long-chain FAO defect suspected',
      'Check CK and myoglobin (rhabdomyolysis) and liver function tests',
      'If hyperinsulinism suspected: consider diazoxide per specialist protocol',
      'URGENT metabolic/PICU discussion',
    ],
  },
  D: {
    id: 'D', label: 'Pattern D',
    likely: 'Likely Ketotic Hypoglycaemia / Glycogen Storage Disease / Gluconeogenesis Defect',
    description: 'Hypoglycaemia + ketosis',
    accent: 'border-l-blue-500', headerBg: 'bg-blue-50', headerText: 'text-blue-800',
    management: [
      'IV glucose bolus: 2 mL/kg of 10% dextrose IV push',
      'Maintain GIR 6–8 mg/kg/min',
      'Correct dehydration with appropriate IV fluids',
      'If lactate significantly elevated → consider GSD type 1 or gluconeogenesis defect',
      'If acidosis also present → likely organic acidemia — add Pattern B management',
      'Send metabolic samples: lactate, insulin, cortisol, amino acids, organic acids',
      'Discuss with metabolic specialist',
    ],
  },
  mixed: {
    id: 'mixed', label: 'Mixed / Complex Pattern',
    likely: 'Multiple abnormalities — specialist input required',
    description: 'Pattern does not clearly fit A, B, C, or D',
    accent: 'border-l-purple-500', headerBg: 'bg-purple-50', headerText: 'text-purple-800',
    management: [
      'STOP protein intake pending specialist advice',
      'Maintain IV glucose — GIR 8–10 mg/kg/min',
      'Correct dehydration and severe acidosis as appropriate',
      'Send full metabolic workup: gas, lactate, ammonia, amino acids, organic acids',
      'URGENT metabolic specialist and PICU discussion',
    ],
  },
  insufficient: {
    id: 'insufficient', label: 'Awaiting Values',
    likely: 'Enter clinical values above to detect a metabolic pattern',
    description: '',
    accent: 'border-l-muted-foreground/20', headerBg: 'bg-muted/30', headerText: 'text-muted-foreground',
    management: [],
  },
};

// ─── Logic ──────────────────────────────────────────────────────────────────────

function detectPattern(data: CrisisFormData): PatternDef {
  const glucose = parseFloat(data.glucose);
  const ph = parseFloat(data.ph);
  const bicarb = parseFloat(data.bicarb);
  const ammonia = parseFloat(data.ammonia);
  const ketones = data.ketones;

  const hasGlucose = !isNaN(glucose);
  const hasPH = !isNaN(ph);
  const hasBicarb = !isNaN(bicarb);
  const hasAmmonia = !isNaN(ammonia);

  if (!hasGlucose && !hasPH && !hasAmmonia && !hasBicarb && !ketones) {
    return PATTERNS.insufficient;
  }

  const hypoglycemia   = hasGlucose && glucose < 3.5;
  const acidosis       = (hasPH && ph < 7.25) || (hasBicarb && bicarb < 15);
  const hyperammonemia = hasAmmonia && ammonia > 100;
  const highKetones    = ketones === 'moderate' || ketones === 'large';
  const lowKetones     = !ketones || ketones === 'none' || ketones === 'trace';

  if (hyperammonemia && !acidosis && lowKetones)    return PATTERNS.A;
  if (acidosis && highKetones)                       return PATTERNS.B;
  if (hypoglycemia && lowKetones && !acidosis)       return PATTERNS.C;
  if (hypoglycemia && highKetones)                   return PATTERNS.D;
  if (hyperammonemia || acidosis || hypoglycemia)    return PATTERNS.mixed;

  return PATTERNS.insufficient;
}

function getIcuCriteria(data: CrisisFormData): string[] {
  const out: string[] = [];
  if (data.encephalopathy) out.push('Altered consciousness / encephalopathy');
  if (data.seizures)       out.push('Active or recent seizures');
  const ammonia = parseFloat(data.ammonia);
  const ph      = parseFloat(data.ph);
  const glucose = parseFloat(data.glucose);
  const lactate = parseFloat(data.lactate);
  const bicarb  = parseFloat(data.bicarb);
  if (!isNaN(ammonia) && ammonia > 150) out.push(`Hyperammonemia — ${ammonia} μmol/L`);
  if (!isNaN(ph)      && ph < 7.2)      out.push(`Severe metabolic acidosis — pH ${ph}`);
  if (!isNaN(glucose) && glucose < 2.5) out.push(`Severe hypoglycaemia — ${glucose} mmol/L`);
  if (!isNaN(lactate) && lactate > 5)   out.push(`Elevated lactate — ${lactate} mmol/L`);
  if (!isNaN(bicarb)  && bicarb < 10)   out.push(`Severely low bicarbonate — ${bicarb} mEq/L`);
  if (data.ageGroup === 'neonate')       out.push('Neonate with suspected metabolic crisis');
  return out;
}

// ─── Investigation Lists ────────────────────────────────────────────────────────

const INVESTIGATIONS = [
  { id: 'glucose',   label: 'Bedside glucose',                                           urgent: true  },
  { id: 'vbg',       label: 'Venous / arterial blood gas',                                urgent: true  },
  { id: 'electro',   label: 'Electrolytes, bicarbonate, anion gap',                       urgent: true  },
  { id: 'lactate',   label: 'Lactate',                                                    urgent: true  },
  { id: 'ammonia',   label: 'Ammonia — sent urgently on ice',                             urgent: true  },
  { id: 'uketones',  label: 'Urine ketones',                                              urgent: false },
  { id: 'reducing',  label: 'Urine reducing substances (especially neonates)',            urgent: false },
  { id: 'cbc',       label: 'CBC, urea, creatinine, LFT, INR',                           urgent: false },
  { id: 'ck',        label: 'CK (if FAO defect or rhabdomyolysis suspected)',             urgent: false },
  { id: 'culture',   label: 'Blood culture (if infection cannot be excluded)',            urgent: false },
];

const SAVE_SAMPLES = [
  { id: 'plasma', label: 'Plasma / serum — frozen immediately' },
  { id: 'urine',  label: 'Urine — frozen immediately' },
  { id: 'csf',    label: 'CSF — frozen, if lumbar puncture performed' },
  { id: 'dbs',    label: 'Dried blood spot (Guthrie card) — room temperature' },
];

// ─── Sub-components ─────────────────────────────────────────────────────────────

function QuestionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-2.5 px-4 bg-muted/30 border-b">
        <CardTitle className="text-sm font-semibold leading-snug">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-3 pb-3 px-4">{children}</CardContent>
    </Card>
  );
}

function CollapsibleSection({
  title, icon: Icon, children, defaultOpen = false,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors text-left no-print"
      >
        <span className="flex items-center gap-2 font-semibold text-sm">
          <Icon className="h-4 w-4 text-primary shrink-0" />
          {title}
        </span>
        <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform duration-200', open && 'rotate-180')} />
      </button>
      <div className={cn('border-t', open ? 'block' : 'hidden')}>
        <div className="px-4 pb-4 pt-3">{children}</div>
      </div>
    </div>
  );
}

function BulletItem({ children, icon: Icon, iconClass }: { children: React.ReactNode; icon?: React.ElementType; iconClass?: string }) {
  const I = Icon;
  return (
    <li className="flex items-start gap-2 text-sm">
      {I
        ? <I className={cn('h-3.5 w-3.5 shrink-0 mt-0.5', iconClass)} />
        : <span className="text-primary font-bold shrink-0 mt-0.5">→</span>
      }
      <span>{children}</span>
    </li>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function MetabolicCrisisPage() {
  const { control, watch } = useForm<CrisisFormData>({
    defaultValues: {
      ageGroup: '', glucose: '', ph: '', bicarb: '',
      lactate: '', ammonia: '', ketones: '',
      encephalopathy: undefined, seizures: undefined,
    },
  });
  const data = watch();

  const [checked, setChecked] = useState<Set<string>>(new Set());
  const toggle = (id: string) =>
    setChecked((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const pattern     = useMemo(() => detectPattern(data), [data]);
  const icuCriteria = useMemo(() => getIcuCriteria(data), [data]);

  const answered = [
    data.ageGroup, data.glucose, data.ph, data.bicarb,
    data.lactate, data.ammonia, data.ketones,
  ].filter((v) => v !== '' && v !== undefined).length
    + (data.encephalopathy !== undefined ? 1 : 0)
    + (data.seizures !== undefined ? 1 : 0);

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-10">

      {/* ── Disclaimer ─────────────────────────────────────────────── */}
      <div className="rounded-lg bg-red-600 text-white px-4 py-3 flex items-start gap-3 shadow no-print">
        <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
        <p className="text-sm font-medium leading-snug">
          This tool is for <strong>clinical support only</strong>. Do not delay emergency treatment.
          Discuss urgently with a <strong>metabolic specialist / PICU / tertiary center</strong>.
        </p>
      </div>
      <div className="hidden print:flex rounded-lg border-2 border-red-600 text-red-700 px-4 py-3 items-start gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
        <p className="text-sm font-semibold">
          CLINICAL SUPPORT ONLY — Do not delay emergency treatment.
          Discuss urgently with metabolic specialist / PICU / tertiary center.
        </p>
      </div>

      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 pb-4 border-b border-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-100 border border-red-200 shrink-0 mt-0.5">
          <Zap className="h-4 w-4 text-red-600" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold font-headline text-foreground leading-tight">
            Suspected Metabolic Crisis
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Emergency pattern recognition and management guide for suspected inborn errors of metabolism.
          </p>
        </div>
        <span className="shrink-0 text-[10px] font-semibold text-red-700/70 bg-red-50 border border-red-200 rounded px-2 py-1 tracking-wide uppercase hidden sm:block">
          Metabolic Diseases
        </span>
      </div>

      {/* ── When to Suspect ──────────────────────────────────────────── */}
      <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <TriangleAlert className="h-4 w-4 text-amber-600 shrink-0" />
          <p className="text-sm font-bold text-amber-800 uppercase tracking-wide">
            When to Suspect a Metabolic Disease
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
          {[
            'Sick neonate or infant with sudden deterioration after a symptom-free period',
            'Acute encephalopathy, lethargy, coma, seizures, abnormal tone, or abnormal movements',
            'Vomiting, poor feeding, dehydration, or shock',
            'Illness mimicking sepsis — no fever, no focus, or cultures negative',
            'Poor response to usual treatment',
            'Hypoglycaemia',
            'Metabolic acidosis',
            'Hyperammonemia',
            'Ketonuria — especially in a newborn without fasting',
            'Unusual odour (sweet, musty, sweaty feet, maple syrup)',
            'Recurrent Reye-like illness',
            'Positive family history, consanguinity, sibling death, or unexplained neonatal death',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-amber-600 font-bold shrink-0 mt-0.5">•</span>
              <span className="text-sm text-amber-900">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Calculator + Results ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT — form */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-lg font-bold flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" /> Clinical Assessment
            </h2>
            <span className={cn(
              'text-xs font-medium px-2 py-1 rounded-full border',
              answered === 9
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-muted text-muted-foreground border-border',
            )}>
              {answered}/9 entered
            </span>
          </div>

          {/* Age Group */}
          <QuestionCard title="Age Group">
            <Controller name="ageGroup" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Select age group…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="neonate">Neonate (0–28 days)</SelectItem>
                  <SelectItem value="infant">Infant (1–12 months)</SelectItem>
                  <SelectItem value="child">Child (&gt;1 year)</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </QuestionCard>

          {/* Numeric inputs */}
          {([
            { name: 'glucose', label: 'Blood Glucose',          unit: 'mmol/L', placeholder: 'e.g. 3.2'  },
            { name: 'ph',      label: 'pH (VBG / ABG)',         unit: '',       placeholder: 'e.g. 7.22' },
            { name: 'bicarb',  label: 'Bicarbonate (HCO₃)',    unit: 'mEq/L',  placeholder: 'e.g. 12'   },
            { name: 'lactate', label: 'Lactate',                unit: 'mmol/L', placeholder: 'e.g. 4.5'  },
            { name: 'ammonia', label: 'Ammonia (sent on ice)',  unit: 'μmol/L', placeholder: 'e.g. 150'  },
          ] as const).map(({ name, label, unit, placeholder }) => (
            <QuestionCard key={name} title={label}>
              <Controller name={name} control={control} render={({ field }) => (
                <div className="relative">
                  <Input
                    type="number"
                    placeholder={placeholder}
                    value={field.value}
                    onChange={field.onChange}
                    className={unit ? 'pr-16' : ''}
                  />
                  {unit && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      {unit}
                    </span>
                  )}
                </div>
              )} />
            </QuestionCard>
          ))}

          {/* Urine Ketones */}
          <QuestionCard title="Urine Ketones">
            <Controller name="ketones" control={control} render={({ field }) => (
              <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-1.5">
                {[
                  { value: 'none',     label: 'Negative',       hi: false },
                  { value: 'trace',    label: 'Trace (+)',       hi: false },
                  { value: 'moderate', label: 'Moderate (++)',   hi: true  },
                  { value: 'large',    label: 'Large (+++)',     hi: true  },
                ].map(({ value, label, hi }) => {
                  const sel = field.value === value;
                  return (
                    <label key={value} htmlFor={`ketones-${value}`} className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg border cursor-pointer transition-colors',
                      sel && hi  ? 'bg-amber-50 border-amber-300 text-amber-800' :
                      sel        ? 'bg-green-50 border-green-300 text-green-800' :
                                   'border-border hover:bg-muted/40',
                    )}>
                      <RadioGroupItem value={value} id={`ketones-${value}`} className="shrink-0" />
                      <span className="text-sm flex-1">{label}</span>
                      {sel && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 opacity-60" />}
                    </label>
                  );
                })}
              </RadioGroup>
            )} />
          </QuestionCard>

          {/* Boolean questions */}
          {([
            { name: 'encephalopathy', label: 'Encephalopathy / Altered Consciousness' },
            { name: 'seizures',       label: 'Seizures (current or recent)'           },
          ] as const).map(({ name, label }) => (
            <QuestionCard key={name} title={label}>
              <Controller name={name} control={control} render={({ field }) => (
                <RadioGroup
                  onValueChange={(v) => field.onChange(v === 'true')}
                  value={field.value === undefined ? '' : String(field.value)}
                  className="flex gap-3"
                >
                  {[
                    { value: 'false', label: 'No'  },
                    { value: 'true',  label: 'Yes' },
                  ].map(({ value, label: btnLabel }) => {
                    const sel = field.value !== undefined && String(field.value) === value;
                    return (
                      <label key={value} htmlFor={`${name}-${value}`} className={cn(
                        'flex items-center gap-2.5 flex-1 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors',
                        sel && value === 'true' ? 'bg-red-50 border-red-300 text-red-800 font-semibold' :
                        sel                     ? 'bg-muted/60 border-border' :
                                                  'border-border hover:bg-muted/40',
                      )}>
                        <RadioGroupItem value={value} id={`${name}-${value}`} className="shrink-0" />
                        <span className="text-sm font-medium">{btnLabel}</span>
                      </label>
                    );
                  })}
                </RadioGroup>
              )} />
            </QuestionCard>
          ))}
        </div>

        {/* RIGHT — results */}
        <div className="space-y-4">
          <h2 className="font-headline text-lg font-bold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" /> Pattern Recognition & Management
          </h2>

          {/* Detected pattern */}
          <Card className={cn('border-l-4 overflow-hidden', pattern.accent)}>
            <CardHeader className={cn('py-3 px-4 border-b', pattern.headerBg)}>
              <CardTitle className={cn('text-sm font-bold flex items-center gap-2', pattern.headerText)}>
                <Brain className="h-4 w-4 shrink-0" />
                {pattern.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-3 pb-3">
              <p className="font-semibold text-sm">{pattern.likely}</p>
              {pattern.description && (
                <p className="text-xs text-muted-foreground mt-1">{pattern.description}</p>
              )}
            </CardContent>
          </Card>

          {/* Pattern management */}
          {pattern.management.length > 0 && (
            <Card className="border-l-4 border-l-destructive overflow-hidden">
              <CardHeader className="py-3 px-4 bg-red-50 border-b">
                <CardTitle className="text-sm font-bold text-red-700 flex items-center gap-2 uppercase tracking-wide">
                  <Zap className="h-4 w-4" /> Immediate Management — Do Not Delay
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pt-3 pb-3">
                <ul className="space-y-2">
                  {pattern.management.map((item, i) => (
                    <BulletItem key={i}>{item}</BulletItem>
                  ))}
                </ul>
                {pattern.cofactors && (
                  <div className="mt-3 pt-3 border-t border-orange-100">
                    <p className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-2">
                      Consider Cofactors / Vitamins
                    </p>
                    <ul className="space-y-1.5">
                      {pattern.cofactors.map((c, i) => (
                        <li key={i} className="text-xs flex items-start gap-2">
                          <span className="text-orange-500 shrink-0 mt-0.5">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Escalation card */}
          <Card className={cn(
            'border-l-4 overflow-hidden',
            icuCriteria.length > 0 ? 'border-l-amber-500' : 'border-l-emerald-400',
          )}>
            <CardHeader className={cn(
              'py-3 px-4 border-b',
              icuCriteria.length > 0 ? 'bg-amber-50' : 'bg-emerald-50',
            )}>
              <CardTitle className={cn(
                'text-sm font-bold flex items-center gap-2 uppercase tracking-wide',
                icuCriteria.length > 0 ? 'text-amber-700' : 'text-emerald-700',
              )}>
                <Ambulance className="h-4 w-4" />
                {icuCriteria.length > 0 ? 'Escalation Required' : 'Escalation Criteria'}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-3 pb-3">
              {icuCriteria.length > 0 ? (
                <>
                  <p className="text-sm font-semibold text-amber-800 mb-2">
                    The following ICU / escalation criteria are met:
                  </p>
                  <ul className="space-y-1.5">
                    {icuCriteria.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <TriangleAlert className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                        {c}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 pt-3 border-t border-amber-100 text-xs font-bold text-red-700">
                    → Urgent PICU discussion and tertiary center notification required
                  </p>
                </>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-medium mb-2">Escalate to ICU / PICU if any of:</p>
                  {[
                    'Altered consciousness / encephalopathy',
                    'Seizures',
                    'Ammonia > 150 μmol/L',
                    'pH < 7.2',
                    'Glucose < 2.5 mmol/L',
                    'Lactate > 5 mmol/L',
                    'Bicarbonate < 10 mEq/L',
                    'Any neonate with suspected metabolic crisis',
                  ].map((c, i) => (
                    <p key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                      {c}
                    </p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* General actions */}
          <Card className="border-l-4 border-l-primary overflow-hidden">
            <CardHeader className="py-3 px-4 bg-primary/5 border-b">
              <CardTitle className="text-sm font-bold text-primary flex items-center gap-2 uppercase tracking-wide">
                <ClipboardList className="h-4 w-4" /> General Emergency Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-3 pb-3">
              <ul className="space-y-1.5">
                {[
                  'Do not wait for final diagnosis — start emergency management now',
                  'ABCDE approach: Airway → Breathing → Circulation → Disability → Exposure',
                  'IV access — treat shock and dehydration',
                  'Check and correct blood glucose immediately',
                  'Treat seizures per local protocol',
                  'Give antibiotics if sepsis cannot be excluded',
                  'Monitor for cerebral oedema — strict neurological observations',
                  'Strict fluid input/output monitoring',
                  'Save samples before treatment if at all possible',
                ].map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary font-bold shrink-0 mt-0.5">•</span>
                    {a}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Reference Sections ───────────────────────────────────────── */}
      <div className="space-y-2">

        {/* ABCDE */}
        <CollapsibleSection title="ABCDE Emergency Assessment" icon={Activity}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { letter: 'A', title: 'Airway',      items: ['Assess and secure airway', 'Position appropriately', 'Suction if needed'] },
              { letter: 'B', title: 'Breathing',   items: ['Assess RR and respiratory effort', 'Oxygen therapy as indicated', 'Ventilatory support if needed'] },
              { letter: 'C', title: 'Circulation', items: ['IV / IO access', 'Treat shock with isotonic fluid bolus', 'Continuous cardiac monitoring'] },
              { letter: 'D', title: 'Disability',  items: ['GCS / AVPU score', 'Pupil assessment', 'Bedside glucose — treat immediately', 'Treat seizures'] },
              { letter: 'E', title: 'Exposure',    items: ['Assess hydration and perfusion', 'Check for hepatomegaly', 'Note any unusual odour', 'Full skin assessment', 'Look for signs of infection'] },
            ].map(({ letter, title, items }) => (
              <div key={letter} className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {letter}
                  </span>
                  <span className="font-semibold text-sm">{title}</span>
                </div>
                <ul className="space-y-1">
                  {items.map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-primary shrink-0 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Investigations */}
        <CollapsibleSection title="Investigations Checklist" icon={FlaskConical}>
          <div className="space-y-4">
            <div className="space-y-2">
              {INVESTIGATIONS.map(({ id, label, urgent }) => (
                <label key={id} className={cn(
                  'flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors',
                  checked.has(id)
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'border-border hover:bg-muted/40',
                )}>
                  <Checkbox checked={checked.has(id)} onCheckedChange={() => toggle(id)} className="shrink-0" />
                  <span className="text-sm flex-1">{label}</span>
                  {urgent && (
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 rounded px-1.5 py-0.5 shrink-0">
                      URGENT
                    </span>
                  )}
                  {checked.has(id) && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
                </label>
              ))}
            </div>
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-2">
                ⚠ Save Samples Before Treatment — If Possible
              </p>
              <div className="space-y-2">
                {SAVE_SAMPLES.map(({ id, label }) => (
                  <label key={id} className={cn(
                    'flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-colors',
                    checked.has(id)
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-white border-amber-200 hover:bg-amber-50/50',
                  )}>
                    <Checkbox checked={checked.has(id)} onCheckedChange={() => toggle(id)} className="shrink-0" />
                    <span className="text-sm flex-1">{label}</span>
                    {checked.has(id) && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Pattern Reference */}
        <CollapsibleSection title="Pattern Recognition Reference" icon={Brain}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(['A', 'B', 'C', 'D'] as const).map((id) => {
              const p = PATTERNS[id];
              return (
                <div key={id} className={cn('rounded-lg border-l-4 border p-3', p.accent)}>
                  <div className={cn('rounded-md px-2 py-1.5 mb-2', p.headerBg)}>
                    <p className={cn('font-bold text-sm', p.headerText)}>{p.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
                  </div>
                  <p className="text-xs font-semibold mb-1.5">{p.likely}</p>
                  <ul className="space-y-1">
                    {p.management.slice(0, 3).map((m, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="shrink-0 mt-0.5">→</span>
                        {m}
                      </li>
                    ))}
                    {p.management.length > 3 && (
                      <li className="text-xs text-muted-foreground italic">
                        + {p.management.length - 3} more actions in calculator above
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Admission & Transfer */}
        <CollapsibleSection title="Admission / ICU Criteria & Transfer Checklist" icon={Ambulance}>
          <div className="space-y-4">
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-xs font-bold text-red-700 uppercase tracking-wide mb-2">
                Admit to ICU / PICU if any of the following are present:
              </p>
              <ul className="space-y-1.5">
                {[
                  'Altered consciousness or encephalopathy',
                  'Seizures',
                  'Hyperammonemia (especially > 150 μmol/L)',
                  'Severe metabolic acidosis',
                  'Persistent or severe hypoglycaemia',
                  'Haemodynamic instability / shock',
                  'Respiratory failure or need for ventilation',
                  'Rising or very high lactate',
                  'Suspected cerebral oedema',
                  'Need for dialysis',
                  'Any neonate with suspected metabolic crisis',
                ].map((c, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <TriangleAlert className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">
                Before Transfer — Stabilise and Check:
              </p>
              <ul className="space-y-1.5">
                {[
                  'Stabilise Airway, Breathing, Circulation before transport',
                  'Continue glucose infusion during transport — do not interrupt',
                  'Recheck glucose, ammonia, blood gas, and lactate before departure if possible',
                  'Send frozen serum and urine samples with the patient',
                  'Send Guthrie card (dried blood spot) — at room temperature',
                  'Send CSF (frozen) if lumbar puncture was performed',
                  'Clear handover documentation: all results and treatments given',
                ].map((c, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CollapsibleSection>

      </div>

      {/* ── Print Button ─────────────────────────────────────────────── */}
      <div className="no-print pt-2">
        <Button variant="outline" className="w-full" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Print Protocol Summary
        </Button>
      </div>

    </div>
  );
}
