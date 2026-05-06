'use client';

import { useState, useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link } from 'wouter';
import { useProtocolById } from '@/contexts/protocols-context';

import type { DiseaseProtocol, FormData, Question, Severity, SeverityLevel } from '@/lib/protocols/types';
import {
  classifyHyperkalemiaScenario,
  type HyperkalemiaScenario,
} from '@/lib/protocols/hyperkalemia';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SeverityBadge } from '@/components/severity-badge';
import { ResultCard } from '@/components/result-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

import {
  Info,
  Stethoscope,
  Pill,
  BookOpen,
  TriangleAlert,
  Hospital,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Zap,
  Activity,
  ClipboardList,
} from 'lucide-react';

interface AssessmentFormProps {
  diseaseId: string;
}

const SEVERITY_BANNER: Record<string, { card: string; icon: string; dot: string }> = {
  mild:     { card: 'bg-green-50  border-2 border-green-200  text-green-900',  icon: 'text-green-600',  dot: 'bg-green-500' },
  moderate: { card: 'bg-amber-50  border-2 border-amber-200  text-amber-900',  icon: 'text-amber-600',  dot: 'bg-amber-500' },
  severe:   { card: 'bg-orange-50 border-2 border-orange-200 text-orange-900', icon: 'text-orange-600', dot: 'bg-orange-500' },
  critical: { card: 'bg-red-50    border-2 border-red-200    text-red-900',    icon: 'text-red-600',    dot: 'bg-red-500' },
  unknown:  { card: 'bg-muted     border-2 border-border     text-muted-foreground', icon: 'text-muted-foreground', dot: 'bg-muted-foreground' },
};

// ─── Hyperkalemia-specific scenario result display ────────────────────────────

const URGENCY_STYLE = {
  emergency: {
    banner:  'bg-red-50 border-2 border-red-300 text-red-900',
    badge:   'bg-red-600 text-white',
    badgeLabel: '⚠ EMERGENCY',
    icon:    'text-red-600',
    dot:     'bg-red-500',
    numBg:   'bg-red-100 text-red-700',
    cardVariant: 'danger' as const,
  },
  high: {
    banner:  'bg-orange-50 border-2 border-orange-200 text-orange-900',
    badge:   'bg-orange-500 text-white',
    badgeLabel: 'URGENT',
    icon:    'text-orange-600',
    dot:     'bg-orange-500',
    numBg:   'bg-orange-100 text-orange-700',
    cardVariant: 'management' as const,
  },
  moderate: {
    banner:  'bg-amber-50 border-2 border-amber-200 text-amber-900',
    badge:   'bg-amber-500 text-white',
    badgeLabel: 'MODERATE',
    icon:    'text-amber-600',
    dot:     'bg-amber-500',
    numBg:   'bg-amber-100 text-amber-700',
    cardVariant: 'management' as const,
  },
  low: {
    banner:  'bg-green-50 border-2 border-green-200 text-green-900',
    badge:   'bg-green-600 text-white',
    badgeLabel: 'LOW RISK',
    icon:    'text-green-600',
    dot:     'bg-green-500',
    numBg:   'bg-green-100 text-green-700',
    cardVariant: 'default' as const,
  },
};

function HyperkalemiaResultsContent({
  data,
  severity,
  protocol,
  summaryUrl,
  showRefs,
  setShowRefs,
}: {
  data: FormData;
  severity: Severity;
  protocol: DiseaseProtocol;
  summaryUrl: string;
  showRefs: boolean;
  setShowRefs: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const scenario: HyperkalemiaScenario = classifyHyperkalemiaScenario(data, severity);
  const references = protocol.getReferences();
  const style = URGENCY_STYLE[scenario.urgency];

  return (
    <>
      {/* ── 1. Final Scenario Classification ── */}
      <div className={cn('rounded-xl p-4 space-y-3', style.banner)}>
        <div className="flex items-center gap-2">
          <ClipboardList className={cn('h-4 w-4 shrink-0', style.icon)} />
          <span className="text-xs font-semibold uppercase tracking-widest opacity-60">
            Final Scenario Classification
          </span>
        </div>
        <div className="flex flex-wrap items-start gap-3">
          <span className={cn('text-xs font-bold px-3 py-1.5 rounded-full shrink-0 tracking-wide', style.badge)}>
            {style.badgeLabel}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm leading-snug">{scenario.label}</p>
            <p className="text-xs opacity-70 mt-0.5 leading-snug">{scenario.description}</p>
          </div>
        </div>
      </div>

      {/* ── 2. Immediate Actions ── */}
      <ResultCard title="Immediate Actions" icon={Zap} variant={style.cardVariant}>
        <ol className="space-y-2">
          {scenario.immediateActions.map((action, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className={cn(
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
                  style.numBg,
                )}
              >
                {i + 1}
              </span>
              <span className="flex-1 leading-snug">{action}</span>
            </li>
          ))}
        </ol>
      </ResultCard>

      {/* ── 3. Medications — only if indicated ── */}
      {scenario.medications && scenario.medications.length > 0 ? (
        <ResultCard title="Medications / Treatment" icon={Pill} variant="drug">
          <div className="divide-y divide-border rounded-md overflow-hidden border">
            {scenario.medications.map((drug, i) => (
              <div key={i} className="px-3 py-3 bg-background">
                <span className="font-semibold text-sm block leading-snug">{drug.drugName}</span>
                <span className="text-sm text-foreground/80 block mt-1 leading-snug">{drug.dose}</span>
                {drug.notes && (
                  <p className="text-xs text-muted-foreground mt-1.5 pt-1.5 border-t border-border/40 leading-snug">
                    {drug.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </ResultCard>
      ) : (
        scenario.scenarioNumber !== null && (
          <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
            <span>
              {scenario.scenarioNumber === 4
                ? 'Avoid hyperkalemia medications until repeat potassium confirms true hyperkalemia.'
                : 'Emergency medications (calcium, insulin, salbutamol) are not indicated at this stage.'}
            </span>
          </div>
        )
      )}

      {/* ── 4. Monitoring ── */}
      <ResultCard title="Monitoring" icon={Activity} variant="default">
        <ul className="space-y-2">
          {scenario.monitoring.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className={cn('mt-1.5 h-1.5 w-1.5 rounded-full shrink-0', style.dot)} />
              <span className="leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      </ResultCard>

      {/* ── 5. Final Decision ── */}
      <ResultCard title="Final Decision" icon={Hospital} variant="decision">
        <ul className="space-y-2">
          {scenario.finalDecision.map((d, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="leading-snug">{d}</span>
            </li>
          ))}
        </ul>
      </ResultCard>

      {/* ── References ── */}
      {references.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowRefs((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-full py-1"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>{showRefs ? 'Hide' : 'Show'} References ({references.length})</span>
            {showRefs ? <ChevronUp className="h-3.5 w-3.5 ml-auto" /> : <ChevronDown className="h-3.5 w-3.5 ml-auto" />}
          </button>
          {showRefs && (
            <ResultCard title="References" icon={BookOpen} variant="info" className="mt-2">
              <ul className="list-disc list-inside space-y-1">
                {references.map((ref, i) => (
                  <li key={i}>
                    <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {ref.title}
                    </a>
                  </li>
                ))}
              </ul>
            </ResultCard>
          )}
        </div>
      )}

      {/* Print summary link */}
      <div className="no-print">
        <Button asChild variant="outline" className="w-full">
          <Link href={summaryUrl}>
            <FileText className="mr-2 h-4 w-4" /> View Printable Summary
          </Link>
        </Button>
      </div>
    </>
  );
}

// ─── Generic result display (all other protocols) ─────────────────────────────

interface ResultsContentProps {
  diseaseId: string;
  bannerStyle: { card: string; icon: string; dot: string };
  severityLevel: SeverityLevel;
  severity: Severity;
  redFlags: string[];
  management: { title: string; recommendations: string[] }[];
  disposition: string[];
  drugDoses: { drugName: string; dose: string; notes?: string }[];
  references: { url: string; title: string }[];
  showRefs: boolean;
  setShowRefs: React.Dispatch<React.SetStateAction<boolean>>;
  summaryUrl: string;
}

function ResultsContent({
  diseaseId,
  bannerStyle,
  severityLevel,
  severity,
  redFlags,
  management,
  disposition,
  drugDoses,
  references,
  showRefs,
  setShowRefs,
  summaryUrl,
}: ResultsContentProps) {
  return (
    <>
      {/* Adrenaline alert (specific diseases) */}
      {['bradycardia', 'septic-shock', 'anaphylactic-shock'].includes(diseaseId) && (
        <Alert variant="destructive" className="bg-destructive/10">
          <Info className="h-4 w-4" />
          <AlertTitle className="font-bold">Adrenaline Preparation (Dilution Required)</AlertTitle>
          <AlertDescription className="text-xs">
            Your hospital stock is <strong>1 mg/mL (1:1,000)</strong>.
            For IV/IO dosing, you <strong>MUST</strong> dilute 1 mL of Adrenaline with 9 mL of
            Normal Saline to make 10 mL of <strong>0.1 mg/mL (1:10,000)</strong> concentration
            before administration.
          </AlertDescription>
        </Alert>
      )}

      {/* 1. SEVERITY — hero banner */}
      <div className={cn('rounded-xl p-4', bannerStyle.card)}>
        <div className="flex items-center gap-2 mb-2">
          <Stethoscope className={cn('h-4 w-4 shrink-0', bannerStyle.icon)} />
          <span className="text-xs font-semibold uppercase tracking-widest opacity-60">
            Severity Classification
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <SeverityBadge level={severityLevel} />
          {severity.details.length > 0 && (
            <p className="text-xs opacity-70">Based on: {severity.details.join(', ')}</p>
          )}
        </div>
      </div>

      {/* 2. RED FLAGS */}
      <Alert className="border-red-200 bg-red-50 text-red-900">
        <TriangleAlert className="h-4 w-4 text-red-600" />
        <AlertTitle className="font-bold">Red Flags</AlertTitle>
        <AlertDescription className="mt-2">
          {redFlags.length > 0 ? (
            <ul className="space-y-1 text-sm">
              {redFlags.map((flag, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                  <span className="font-medium">{flag}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm">No immediate red flags identified.</p>
          )}
        </AlertDescription>
      </Alert>

      {/* 3. MANAGEMENT — numbered steps */}
      {management.map((m) => (
        <ResultCard key={m.title} title={m.title} icon={Pill} variant="management">
          <ol className="space-y-2">
            {m.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                  {i + 1}
                </span>
                <span className="flex-1 leading-snug">{rec}</span>
              </li>
            ))}
          </ol>
        </ResultCard>
      ))}

      {/* 4. FINAL DECISION */}
      <ResultCard title="Final Decision" icon={Hospital} variant="decision">
        <ul className="space-y-2">
          {disposition.map((d, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="leading-snug">{d}</span>
            </li>
          ))}
        </ul>
      </ResultCard>

      {/* 5. DRUG DOSES */}
      {drugDoses.length > 0 && (
        <ResultCard title="Relevant Drug Doses" icon={Pill} variant="drug">
          <div className="divide-y divide-border rounded-md overflow-hidden border">
            {drugDoses.map((drug, i) => (
              <div key={i} className="px-3 py-2 bg-background">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-sm">{drug.drugName}</span>
                  <span className="text-sm text-right shrink-0 text-muted-foreground">{drug.dose}</span>
                </div>
                {drug.notes && (
                  <p className="text-xs text-muted-foreground mt-0.5">{drug.notes}</p>
                )}
              </div>
            ))}
          </div>
        </ResultCard>
      )}

      {/* 6. REFERENCES — collapsed by default */}
      {references.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowRefs((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-full py-1"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>{showRefs ? 'Hide' : 'Show'} References ({references.length})</span>
            {showRefs ? <ChevronUp className="h-3.5 w-3.5 ml-auto" /> : <ChevronDown className="h-3.5 w-3.5 ml-auto" />}
          </button>
          {showRefs && (
            <ResultCard title="References" icon={BookOpen} variant="info" className="mt-2">
              <ul className="list-disc list-inside space-y-1">
                {references.map((ref, i) => (
                  <li key={i}>
                    <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {ref.title}
                    </a>
                  </li>
                ))}
              </ul>
            </ResultCard>
          )}
        </div>
      )}

      {/* Print summary link */}
      <div className="no-print">
        <Button asChild variant="outline" className="w-full">
          <Link href={summaryUrl}>
            <FileText className="mr-2 h-4 w-4" /> View Printable Summary
          </Link>
        </Button>
      </div>
    </>
  );
}

// ─── Main Assessment Form ─────────────────────────────────────────────────────

export function AssessmentForm({ diseaseId }: AssessmentFormProps) {
  const protocol = useProtocolById(diseaseId);
  const { control, watch } = useForm<FormData>();
  const formData = watch();

  const [openInfoId, setOpenInfoId] = useState<string | null>(null);
  const [showRefs, setShowRefs] = useState(false);

  if (!protocol) {
    return <div>Protocol not found.</div>;
  }

  const calculateResults = useCallback((data: FormData) => {
    const severity = protocol.calculateSeverity(data);
    const management = protocol.getManagement(severity, data);
    const disposition = protocol.getDisposition(severity, data);
    const redFlags = protocol.getRedFlags(severity, data);
    const drugDoses = protocol.getDrugDoses(severity, data);
    const references = protocol.getReferences();
    return { severity, management, disposition, redFlags, drugDoses, references };
  }, [protocol]);

  const { severity, management, disposition, redFlags, drugDoses, references } = useMemo(
    () => calculateResults(formData),
    [formData, calculateResults],
  );

  const answeredCount = protocol.questions.filter(
    (q) => formData[q.id] !== undefined && formData[q.id] !== '',
  ).length;
  const totalCount = protocol.questions.length;
  const allAnswered = answeredCount === totalCount;
  const completionPercent = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

  const severityLevel = severity.level || 'unknown';
  const bannerStyle = SEVERITY_BANNER[severityLevel] ?? SEVERITY_BANNER.unknown;

  // ─── Question renderers ───────────────────────────────────────────────────

  const renderQuestionInput = (question: Question, field: any) => {
    switch (question.type) {
      case 'number':
        return (
          <div className="relative">
            <Input
              id={question.id}
              type="number"
              value={field.value !== undefined && field.value !== false ? String(field.value) : ''}
              onChange={(e) => field.onChange(e.target.value === '' ? undefined : +e.target.value)}
            />
            {question.unit && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {question.unit}
              </span>
            )}
          </div>
        );

      case 'select':
        return (
          <Select onValueChange={field.onChange} value={field.value as string}>
            <SelectTrigger id={question.id}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'boolean':
        return (
          <RadioGroup
            id={question.id}
            onValueChange={(v) => field.onChange(v === 'true')}
            value={field.value === undefined ? '' : String(field.value)}
            className="flex gap-3"
          >
            {[
              { value: 'false', label: 'No' },
              { value: 'true',  label: 'Yes' },
            ].map(({ value, label }) => {
              const selected = field.value !== undefined && String(field.value) === value;
              return (
                <label
                  key={value}
                  htmlFor={`${question.id}-${value}`}
                  className={cn(
                    'flex items-center gap-2.5 flex-1 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors',
                    selected
                      ? value === 'true'
                        ? 'bg-blue-50 border-blue-300 text-blue-800'
                        : 'bg-muted/60 border-border text-foreground'
                      : 'border-border hover:bg-muted/40',
                  )}
                >
                  <RadioGroupItem value={value} id={`${question.id}-${value}`} className="shrink-0" />
                  <span className="text-sm font-medium">{label}</span>
                </label>
              );
            })}
          </RadioGroup>
        );

      case 'radio':
        return (
          <RadioGroup
            onValueChange={field.onChange}
            value={field.value as string}
            className="space-y-2"
          >
            {question.options?.map((option, idx) => {
              const val = String(option.value);
              const selected = field.value === val;
              const optCount = question.options?.length ?? 1;
              const colorClass =
                selected && optCount >= 3
                  ? idx === 0
                    ? 'bg-green-50 border-green-300 text-green-800'
                    : idx === optCount - 1
                    ? 'bg-red-50 border-red-300 text-red-800'
                    : 'bg-amber-50 border-amber-300 text-amber-800'
                  : selected
                  ? 'bg-primary/8 border-primary/30 text-primary'
                  : 'border-border hover:bg-muted/40 hover:border-muted-foreground/20';

              return (
                <label
                  key={val}
                  htmlFor={`${question.id}-${val}`}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors',
                    colorClass,
                  )}
                >
                  <RadioGroupItem value={val} id={`${question.id}-${val}`} className="shrink-0" />
                  <span className="text-sm leading-snug">{option.label}</span>
                  {selected && <CheckCircle2 className="h-3.5 w-3.5 ml-auto shrink-0 opacity-60" />}
                </label>
              );
            })}
          </RadioGroup>
        );

      default:
        return <></>;
    }
  };

  const renderQuestion = (question: Question) => (
    <Card key={question.id} className="overflow-hidden">
      <CardHeader className="py-2.5 px-4 bg-muted/30 border-b">
        <CardTitle className="text-sm font-semibold leading-snug">
          <div className="flex items-start gap-2">
            <span className="flex-1">{question.questionText}</span>
            {question.info && (
              <button
                type="button"
                onClick={() => setOpenInfoId(openInfoId === question.id ? null : question.id)}
                className="shrink-0 rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-700 hover:bg-red-200"
                aria-label="Show question information"
                aria-expanded={openInfoId === question.id}
              >
                !
              </button>
            )}
          </div>
          {question.info && openInfoId === question.id && (
            <div className="mt-2 rounded-lg border border-red-300 bg-red-50 p-3 text-sm font-normal text-red-800">
              {question.info}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3 pb-3 px-4">
        <Controller
          name={question.id}
          control={control}
          render={({ field }) => renderQuestionInput(question, field)}
        />
      </CardContent>
    </Card>
  );

  const summaryUrl = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    return `/diseases/${protocol.id}/summary?${params.toString()}`;
  }, [formData, protocol.id]);

  const isHyperkalemia = diseaseId === 'hyperkalemia';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* ── Left column: questions ── */}
      <div className="space-y-3">
        {/* Paracetamol toxic dose alert */}
        {diseaseId === 'paracetamol-toxicity' && (
          <Alert variant="destructive" className="bg-destructive/10">
            <AlertTitle className="font-bold text-sm">Pediatric Toxic Dose Reference</AlertTitle>
            <AlertDescription className="text-xs mt-1 space-y-1">
              <div><strong>Acute (single) ingestion:</strong> &gt; 150 mg/kg — Potentially toxic</div>
              <div><strong>Chronic / repeated (supratherapeutic):</strong> &gt; 200 mg/kg over 24 h, OR &gt; 150 mg/kg/day for 2 days, OR &gt; 100 mg/kg/day for ≥ 3 days</div>
            </AlertDescription>
          </Alert>
        )}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="flex items-center gap-2 font-headline text-xl font-bold">
                <Stethoscope className="h-5 w-5 text-primary" />
                Assessment Questions
              </h2>
              <p className="text-sm text-muted-foreground">
                Answer the minimum required questions to update the protocol results in real time.
              </p>
            </div>
            <span className={cn(
              'text-xs font-medium px-2 py-1 rounded-full border shrink-0',
              allAnswered
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-muted text-muted-foreground border-border',
            )}>
              {answeredCount}/{totalCount} answered
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  allAnswered ? 'bg-green-500' : 'bg-primary',
                )}
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              {completionPercent}% complete
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {protocol.questions.map(renderQuestion)}
        </div>
      </div>

      {/* ── Right column: results ── */}
      <div>
        <div className="space-y-4">
          {isHyperkalemia ? (
            <HyperkalemiaResultsContent
              data={formData}
              severity={severity}
              protocol={protocol}
              summaryUrl={summaryUrl}
              showRefs={showRefs}
              setShowRefs={setShowRefs}
            />
          ) : (
            <ResultsContent
              diseaseId={diseaseId}
              bannerStyle={bannerStyle}
              severityLevel={severityLevel}
              severity={severity}
              redFlags={redFlags}
              management={management}
              disposition={disposition}
              drugDoses={drugDoses}
              references={references}
              showRefs={showRefs}
              setShowRefs={setShowRefs}
              summaryUrl={summaryUrl}
            />
          )}
        </div>
      </div>
    </div>
  );
}
