'use client';

import { useState, useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Link from 'next/link';

import type { DiseaseProtocol, FormData, Question, Severity } from '@/lib/protocols/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SeverityBadge } from '@/components/ui/../severity-badge';
import { ResultCard } from '@/components/ui/../result-card';
import { ScrollArea } from '@/components/ui/scroll-area';

import {
  Info,
  Stethoscope,
  Pill,
  BookOpen,
  TriangleAlert,
  Hospital,
  FileText,
} from 'lucide-react';

interface AssessmentFormProps {
  protocol: DiseaseProtocol;
}

export function AssessmentForm({ protocol }: AssessmentFormProps) {
  const { control, watch } = useForm<FormData>();
  const formData = watch();

  const [showResults, setShowResults] = useState(false);

  const calculateResults = useCallback((data: FormData) => {
    const severity = protocol.calculateSeverity(data);
    const management = protocol.getManagement(severity, data);
    const disposition = protocol.getDisposition(severity, data);
    const redFlags = protocol.getRedFlags(severity, data);
    const drugDoses = protocol.getDrugDoses(severity, data);
    const references = protocol.getReferences();
    return { severity, management, disposition, redFlags, drugDoses, references };
  }, [protocol]);

  const { severity, management, disposition, redFlags, drugDoses, references } = useMemo(() => calculateResults(formData), [formData, calculateResults]);

  const renderQuestion = (question: Question) => {
    return (
      <div key={question.id} className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
        <Label htmlFor={question.id} className="flex items-center gap-2">
          {question.questionText}
          {question.info && (
            <span title={question.info}>
              <Info className="h-4 w-4 text-muted-foreground" />
            </span>
          )}
        </Label>
        <Controller
          name={question.id}
          control={control}
          render={({ field }) => {
            switch (question.type) {
              case 'number':
                return (
                  <div className="relative">
                    <Input id={question.id} type="number" {...field} placeholder={question.placeholder} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
                    {question.unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{question.unit}</span>}
                  </div>
                );
              case 'select':
                return (
                  <Select onValueChange={field.onChange} defaultValue={field.value as string}>
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
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">No</span>
                    <Switch id={question.id} checked={!!field.value} onCheckedChange={field.onChange} />
                    <span className="text-sm text-muted-foreground">Yes</span>
                  </div>
                );
              case 'radio':
                return (
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value as string} className="flex items-center gap-4">
                    {question.options?.map((option) => (
                      <div key={String(option.value)} className="flex items-center space-x-2">
                        <RadioGroupItem value={String(option.value)} id={`${question.id}-${option.value}`} />
                        <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                );
              default:
                return null;
            }
          }}
        />
      </div>
    );
  };
  
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
      <Card className="print-no-break-inside">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-xl"><Stethoscope /> Assessment Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-4">
            {protocol.questions.map(renderQuestion)}
          </form>
          <Button onClick={() => setShowResults(true)} className="w-full lg:hidden no-print">
            View Results
          </Button>
        </CardContent>
      </Card>
      
      <div className={showResults ? "fixed inset-0 bg-background z-50 lg:static lg:block" : "hidden lg:block"}>
        <ScrollArea className="h-full">
        <div className="space-y-6 p-4 lg:p-0">
            <div className="flex justify-between items-center lg:hidden sticky top-0 bg-background py-2 z-10 no-print">
                <h2 className="text-xl font-bold font-headline">Results</h2>
                <Button variant="ghost" onClick={() => setShowResults(false)}>Close</Button>
            </div>
            
            <ResultCard title="Severity Classification" icon={Stethoscope}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <SeverityBadge level={severity.level || 'unknown'} />
                {severity.details.length > 0 && <p className="text-xs text-muted-foreground">Based on: {severity.details.join(', ')}</p>}
              </div>
            </ResultCard>

            {management.map(m => (
                 <ResultCard key={m.title} title={m.title} icon={Pill}>
                     <ul className="list-disc list-inside space-y-1">
                         {m.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                     </ul>
                 </ResultCard>
            ))}

            <ResultCard title="Disposition" icon={Hospital}>
                <ul className="list-disc list-inside space-y-1">
                    {disposition.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
            </ResultCard>

            <ResultCard title="Red Flags" icon={TriangleAlert}>
                <ul className="list-disc list-inside space-y-1 text-destructive">
                    {redFlags.map((flag, i) => <li key={i} className="font-medium">{flag}</li>)}
                </ul>
            </ResultCard>

            {drugDoses.length > 0 && (
                <ResultCard title="Relevant Drug Doses" icon={Pill}>
                     <div className="space-y-2">
                        {drugDoses.map((drug, i) => (
                            <div key={i} className="p-2 bg-secondary/50 rounded-md">
                                <p className="font-semibold">{drug.drugName}</p>
                                <p>{drug.dose}</p>
                                {drug.notes && <p className="text-xs text-muted-foreground mt-1">{drug.notes}</p>}
                            </div>
                        ))}
                    </div>
                </ResultCard>
            )}

            {references.length > 0 && (
                <ResultCard title="References" icon={BookOpen}>
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

            <div className="no-print">
              <Link href={summaryUrl} passHref legacyBehavior>
                <Button asChild variant="outline" className="w-full">
                  <a><FileText className="mr-2 h-4 w-4" /> View Printable Summary</a>
                </Button>
              </Link>
            </div>
        </div>
        </ScrollArea>
      </div>

    </div>
  );
}
