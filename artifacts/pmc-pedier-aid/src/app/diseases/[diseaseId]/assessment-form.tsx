'use client';

import { useState, useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link } from 'wouter';
import { useProtocolById } from '@/contexts/protocols-context';

import type { DiseaseProtocol, FormData, Question, Severity, SeverityLevel } from '@/lib/protocols/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

export function AssessmentForm({ diseaseId }: AssessmentFormProps) {
  const protocol = useProtocolById(diseaseId);
  const { control, watch } = useForm<FormData>();
  const formData = watch();

  const [showResults, setShowResults] = useState(false);
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

  // ─── Question renderers ────────────────────────────────────────────────────

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* ── Left column: questions + desktop results ── */}
      <div className="space-y-3">
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

        <Button onClick={() => setShowResults(true)} className="w-full lg:hidden no-print mt-2">
          View Results
        </Button>
      </div>

      {/* ── Mobile overlay: results (only visible on small screens when triggered) ── */}
      {showResults && (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto lg:hidden">
          <div className="space-y-4 p-4">
            <div className="flex justify-between items-center sticky top-0 bg-background py-2 z-10 no-print">
              <h2 className="text-xl font-bold font-headline">Results</h2>
              <Button variant="ghost" onClick={() => setShowResults(false)}>Close</Button>
            </div>
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
          </div>
        </div>
      )}

      {/* ── Desktop right column: always visible at lg+ (completely independent of showResults) ── */}
      <div className="hidden lg:block">
        <div className="space-y-4">
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
        </div>
      </div>
    </div>
  );
}
