'use client';

import { useState, useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link } from 'wouter';
import { useProtocolById } from '@/contexts/protocols-context';

import type { DiseaseProtocol, FormData, Question, Severity } from '@/lib/protocols/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SeverityBadge } from '@/components/severity-badge';
import { ResultCard } from '@/components/result-card';
import { ScrollArea } from '@/components/ui/scroll-area';
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
} from 'lucide-react';

interface AssessmentFormProps {
  diseaseId: string;
}

export function AssessmentForm({ diseaseId }: AssessmentFormProps) {
  const protocol = useProtocolById(diseaseId);
  const { control, watch } = useForm<FormData>();
  const formData = watch();

  const [showResults, setShowResults] = useState(false);

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

  // Count how many questions have been answered
  const answeredCount = protocol.questions.filter(
    (q) => formData[q.id] !== undefined && formData[q.id] !== '',
  ).length;
  const totalCount = protocol.questions.length;
  const allAnswered = answeredCount === totalCount;

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
              // Subtle colour progression for scored scales (first = green, last = red)
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
        <CardTitle className="text-sm font-semibold flex items-center gap-2 leading-snug">
          {question.questionText}
          {question.info && (
            <span title={question.info} className="shrink-0">
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </span>
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

      {/* ── Left: Assessment Questions ──────────────────────────── */}
      <div className="space-y-3">

        {/* Header row */}
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-headline text-xl font-bold">
            <Stethoscope className="h-5 w-5 text-primary" />
            Assessment Questions
          </h2>
          {/* Progress indicator */}
          <span className={cn(
            'text-xs font-medium px-2 py-1 rounded-full border',
            allAnswered
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-muted text-muted-foreground border-border',
          )}>
            {answeredCount}/{totalCount} answered
          </span>
        </div>

        {/* One card per question */}
        <div className="space-y-2">
          {protocol.questions.map(renderQuestion)}
        </div>

        <Button onClick={() => setShowResults(true)} className="w-full lg:hidden no-print mt-2">
          View Results
        </Button>
      </div>

      {/* ── Right: Results ──────────────────────────────────────── */}
      <div className={showResults ? 'fixed inset-0 bg-background z-50 lg:static lg:block' : 'hidden lg:block'}>
        <ScrollArea className="h-full">
          <div className="space-y-6 p-4 lg:p-0">

            {/* Mobile close button */}
            <div className="flex justify-between items-center lg:hidden sticky top-0 bg-background py-2 z-10 no-print">
              <h2 className="text-xl font-bold font-headline">Results</h2>
              <Button variant="ghost" onClick={() => setShowResults(false)}>Close</Button>
            </div>

            {/* Adrenaline dilution alert */}
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

            <ResultCard title="Severity Classification" icon={Stethoscope} variant="default">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <SeverityBadge level={severity.level || 'unknown'} />
                {severity.details.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Based on: {severity.details.join(', ')}
                  </p>
                )}
              </div>
            </ResultCard>

            {management.map((m) => (
              <ResultCard key={m.title} title={m.title} icon={Pill} variant="management">
                <ul className="list-disc list-inside space-y-1">
                  {m.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                </ul>
              </ResultCard>
            ))}

            <ResultCard title="Disposition" icon={Hospital} variant="disposition">
              <ul className="list-disc list-inside space-y-1">
                {disposition.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </ResultCard>

            <ResultCard title="Red Flags" icon={TriangleAlert} variant="danger">
              <ul className="list-disc list-inside space-y-1 text-destructive">
                {redFlags.map((flag, i) => (
                  <li key={i} className="font-medium">{flag}</li>
                ))}
              </ul>
            </ResultCard>

            {drugDoses.length > 0 && (
              <ResultCard title="Relevant Drug Doses" icon={Pill} variant="drug">
                <div className="space-y-2">
                  {drugDoses.map((drug, i) => (
                    <div key={i} className="p-2 bg-secondary/50 rounded-md">
                      <p className="font-semibold">{drug.drugName}</p>
                      <p>{drug.dose}</p>
                      {drug.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{drug.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </ResultCard>
            )}

            {references.length > 0 && (
              <ResultCard title="References" icon={BookOpen} variant="info">
                <ul className="list-disc list-inside space-y-1">
                  {references.map((ref, i) => (
                    <li key={i}>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {ref.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </ResultCard>
            )}

            <div className="no-print">
              <Button asChild variant="outline" className="w-full">
                <Link href={summaryUrl}>
                  <FileText className="mr-2 h-4 w-4" /> View Printable Summary
                </Link>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
