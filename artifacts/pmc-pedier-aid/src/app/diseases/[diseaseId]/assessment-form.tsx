'use client';

import { useState, useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link } from 'wouter';
import { useProtocolById } from '@/contexts/protocols-context';

import type { DiseaseProtocol, FormData, Question, Severity, SeverityLevel } from '@/lib/protocols/types';
import { classifyHyperkalemiaScenario, type HyperkalemiaScenario, type HyperkalemiaUrgency } from '@/lib/protocols/hyperkalemia';
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
  Zap,
  Activity,
  ClipboardList,
  Eye,
  AlertCircle,
} from 'lucide-react';

interface AssessmentFormProps {
  diseaseId: string;
}

const SEVERITY_BANNER: Record<string, { card: string; icon: string; dot: string; text: string }> = {
  mild:     { card: 'bg-emerald-600 shadow-lg shadow-emerald-100', icon: 'text-emerald-50', text: 'text-white', dot: 'bg-emerald-400' },
  moderate: { card: 'bg-amber-500 shadow-lg shadow-amber-100',   icon: 'text-amber-50',   text: 'text-white', dot: 'bg-amber-300' },
  severe:   { card: 'bg-orange-600 shadow-lg shadow-orange-100',  icon: 'text-orange-50',  text: 'text-white', dot: 'bg-orange-300' },
  critical: { card: 'bg-red-600 shadow-lg shadow-red-100',     icon: 'text-red-50',     text: 'text-white', dot: 'bg-red-400' },
  unknown:  { card: 'bg-slate-700 shadow-lg shadow-slate-100',   icon: 'text-slate-50',   text: 'text-white', dot: 'bg-slate-400' },
};

// ─── Hyperkalemia scenario-focused results ────────────────────────────────────

const URGENCY_STYLE: Record<HyperkalemiaUrgency, {
  card: string; badge: string; badgeText: string; icon: string; number: string;
}> = {
  low:       { card: 'bg-emerald-50/50 border-2 border-emerald-100', badge: 'bg-emerald-100 text-emerald-800 border border-emerald-200',  badgeText: 'Non-Urgent',  icon: 'text-emerald-700',  number: 'bg-emerald-600'  },
  moderate:  { card: 'bg-amber-50/50 border-2 border-amber-100',    badge: 'bg-amber-100 text-amber-800 border border-amber-200',      badgeText: 'Urgent',      icon: 'text-amber-700',  number: 'bg-amber-600'  },
  high:      { card: 'bg-orange-50/50 border-2 border-orange-100',   badge: 'bg-orange-100 text-orange-800 border border-orange-200', badgeText: 'High Priority', icon: 'text-orange-700', number: 'bg-orange-600' },
  emergency: { card: 'bg-red-600 shadow-xl shadow-red-100 border-red-500', badge: 'bg-white/20 text-white backdrop-blur-md',           badgeText: '⚡ EMERGENCY', icon: 'text-white',    number: 'bg-white text-red-600'    },
};

interface HyperkalemiaResultsContentProps {
  data: FormData;
  severity: Severity;
  protocol: DiseaseProtocol;
  summaryUrl: string;
  showRefs: boolean;
  setShowRefs: React.Dispatch<React.SetStateAction<boolean>>;
}

function HyperkalemiaResultsContent({
  data,
  severity,
  protocol,
  summaryUrl,
  showRefs,
  setShowRefs,
}: HyperkalemiaResultsContentProps) {
  const scenario = useMemo(() => classifyHyperkalemiaScenario(data, severity), [data, severity]);
  const references = useMemo(() => protocol.getReferences(), [protocol]);
  const style = URGENCY_STYLE[scenario.urgency];
  const isIncomplete = scenario.label === 'Assessment Incomplete';

  return (
    <>
      {/* ── 1. Scenario Classification Banner ───────────────────────────────── */}
      <div className={cn('rounded-xl p-4 shadow-sm', style.card)}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Activity className={cn('h-4 w-4 shrink-0', style.icon)} />
            <span className="text-xs font-semibold uppercase tracking-widest opacity-60">
              Final Scenario Classification
            </span>
          </div>
          <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full shrink-0', style.badge)}>
            {style.badgeText}
          </span>
        </div>

        {!isIncomplete && (
          <div className={cn(
            'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 mb-2',
            scenario.urgency === 'emergency' ? 'bg-red-100' :
            scenario.urgency === 'high' ? 'bg-orange-100' :
            scenario.urgency === 'moderate' ? 'bg-amber-100' : 'bg-green-100',
          )}>
            <span className={cn('text-xs font-bold uppercase tracking-wide', style.icon)}>
              Scenario {scenario.scenarioNumber}
            </span>
          </div>
        )}

        <h3 className={cn('text-base font-bold leading-snug mb-1', style.icon)}>
          {scenario.label}
        </h3>
        <p className="text-sm opacity-75 leading-snug">{scenario.subtitle}</p>

        {isIncomplete && (
          <p className="mt-2 text-xs opacity-60 italic">
            Answer the questions on the left to generate a scenario-based management plan.
          </p>
        )}
      </div>

      {/* ── 2. Immediate Actions ─────────────────────────────────────────────── */}
      {!isIncomplete && scenario.immediateActions.length > 0 && (
        <ResultCard
          title={scenario.urgency === 'emergency' ? 'Immediate Emergency Actions' : 'Immediate Actions'}
          icon={scenario.urgency === 'emergency' ? Zap : ClipboardList}
          variant={scenario.urgency === 'emergency' ? 'danger' : 'management'}
        >
          <ol className="space-y-2.5">
            {scenario.immediateActions.map((action, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={cn(
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white',
                  style.number,
                )}>
                  {i + 1}
                </span>
                <span className="flex-1 leading-snug text-sm">{action}</span>
              </li>
            ))}
          </ol>
        </ResultCard>
      )}

      {/* ── 3. Medications — only if indicated ──────────────────────────────── */}
      {!isIncomplete && scenario.medications !== null && scenario.medications.length > 0 && (
        <ResultCard
          title="Medications / Treatment"
          icon={Pill}
          variant="drug"
        >
          <div className="divide-y divide-border rounded-lg overflow-hidden border">
            {scenario.medications.map((drug, i) => (
              <div key={i} className="px-3 py-3 bg-background">
                <p className="font-semibold text-sm text-foreground mb-0.5">{drug.drugName}</p>
                <p className="text-sm text-primary font-medium leading-snug">{drug.dose}</p>
                {drug.notes && (
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">{drug.notes}</p>
                )}
              </div>
            ))}
          </div>
        </ResultCard>
      )}

      {/* Not indicated note for Scenarios 1 & 4 */}
      {!isIncomplete && scenario.medications === null && (
        <div className="flex items-start gap-2.5 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-800">No Emergency Medications Indicated</p>
            <p className="text-xs text-green-700 mt-0.5">
              Calcium, insulin, and salbutamol are NOT indicated for this scenario. Do not give unless the clinical picture changes (worsening K+, new ECG changes, or new symptoms).
            </p>
          </div>
        </div>
      )}

      {/* ── 4. Monitoring ───────────────────────────────────────────────────── */}
      {!isIncomplete && scenario.monitoring.length > 0 && (
        <ResultCard title="Monitoring" icon={Eye} variant="info">
          <ul className="space-y-2">
            {scenario.monitoring.map((m, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                <span className="flex-1 leading-snug text-sm">{m}</span>
              </li>
            ))}
          </ul>
        </ResultCard>
      )}

      {/* ── 5. Final Decision ───────────────────────────────────────────────── */}
      {!isIncomplete && scenario.finalDecision.length > 0 && (
        <ResultCard title="Final Decision" icon={Hospital} variant="decision">
          <ul className="space-y-2">
            {scenario.finalDecision.map((d, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="leading-snug text-sm">{d}</span>
              </li>
            ))}
          </ul>
        </ResultCard>
      )}

      {/* ── References ──────────────────────────────────────────────────────── */}
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

// ─── Generic results (all other protocols) ────────────────────────────────────

interface ResultsContentProps {
  diseaseId: string;
  bannerStyle: { card: string; icon: string; dot: string };
  severityLevel: SeverityLevel;
  severity: Severity;
  redFlags: string[];
  investigations?: { title: string; list: string[] }[];
  management: { title: string; recommendations: string[] }[];
  disposition: string[];
  dischargeCriteria?: string[];
  followUp?: string[];
  drugDoses: { drugName: string; dose: string; notes?: string }[];
  references: { url: string; title: string }[];
  showRefs: boolean;
  setShowRefs: React.Dispatch<React.SetStateAction<boolean>>;
  summaryUrl: string;
  lastUpdated?: string;
}

function ResultsContent({
  diseaseId,
  bannerStyle,
  severityLevel,
  severity,
  redFlags,
  investigations,
  management,
  disposition,
  dischargeCriteria,
  followUp,
  drugDoses,
  references,
  showRefs,
  setShowRefs,
  summaryUrl,
  lastUpdated,
}: ResultsContentProps) {
  return (
    <>
      {/* 0. Last Updated / Versioning */}
      {lastUpdated && (
        <div className="flex items-center justify-between px-2 mb-2">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
            <Activity className="h-3.5 w-3.5" />
            Decision Support Protocol
          </div>
          <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-tighter">
            Review: {lastUpdated}
          </span>
        </div>
      )}

      {/* 1. SEVERITY — hero banner */}
      <div className={cn('rounded-[32px] p-6 relative overflow-hidden transition-all', bannerStyle.card, (bannerStyle as any).text)}>
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center gap-2 mb-3 opacity-80">
          <Stethoscope className={cn('h-4 w-4 shrink-0', bannerStyle.icon)} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Final Severity Classification
          </span>
        </div>
        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center gap-3">
             <h3 className="text-3xl font-black tracking-tighter uppercase leading-none">
               {severityLevel}
             </h3>
             <div className={cn("h-3 w-3 rounded-full animate-pulse", bannerStyle.dot)} />
          </div>
          {severity.details.length > 0 && (
            <p className="text-xs font-bold opacity-90 tracking-tight leading-tight max-w-[280px]">
              {severity.details.join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Adrenaline alert (specific diseases) */}
      {['bradycardia', 'septic-shock', 'anaphylactic-shock'].includes(diseaseId) && (
        <Alert variant="destructive" className="bg-red-50 border-2 border-red-200 text-red-900 rounded-[24px] p-5 shadow-sm">
          <TriangleAlert className="h-4 w-4 text-red-600" />
          <AlertTitle className="font-black uppercase tracking-widest text-xs mb-2">Adrenaline Preparation (Dilution Required)</AlertTitle>
          <AlertDescription className="text-xs font-bold leading-relaxed opacity-80">
            Your hospital stock is 1 mg/mL (1:1,000). For IV/IO dosing, you MUST dilute 1 mL of Adrenaline with 9 mL of Normal Saline to make 10 mL of 0.1 mg/mL (1:10,000) before administration.
          </AlertDescription>
        </Alert>
      )}

      {/* 1b. Standardized Score Badge */}
      {severity.scoreDetails && (
        <div className="space-y-4">
          <div className="rounded-[28px] border-2 border-primary/20 bg-primary/5 p-5 flex items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-primary">
                <ClipboardList className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">{severity.scoreDetails.systemName}</span>
              </div>
              <p className="text-lg font-black tracking-tight text-slate-900">{severity.scoreDetails.interpretation}</p>
            </div>
            <div className="flex flex-col items-center justify-center bg-primary text-white rounded-2xl p-4 min-w-[90px] shadow-lg shadow-primary/20">
              <span className="text-3xl font-black leading-none tracking-tighter">{severity.scoreDetails.totalScore}</span>
              {severity.scoreDetails.maxScore && (
                <span className="text-[10px] font-black opacity-70 mt-2 uppercase border-t border-white/20 pt-1.5 w-full text-center tracking-widest">
                  / {severity.scoreDetails.maxScore}
                </span>
              )}
            </div>
          </div>

          {/* Reference Table for Score Interpretation */}
          {severity.scoreDetails.referenceTable && (
            <div className="rounded-[24px] border-2 border-slate-100 bg-muted/20 overflow-hidden shadow-sm">
              <div className="bg-muted/40 px-5 py-3 border-b-2 border-slate-100 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-slate-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Score Interpretation</span>
              </div>
              <table className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-100 bg-slate-50/50">
                    <th className="px-5 py-2.5 font-black text-slate-400 w-1/3 uppercase tracking-tighter">Range</th>
                    <th className="px-5 py-2.5 font-black text-slate-400 uppercase tracking-tighter">Clinical Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {severity.scoreDetails.referenceTable.map((row, idx) => {
                    const isSelected = severity.scoreDetails?.interpretation.toLowerCase().includes(row.meaning.toLowerCase().split(' ')[0]);
                    return (
                      <tr key={idx} className={cn("border-b border-slate-100 last:border-0 transition-colors", isSelected ? "bg-primary/5 font-bold" : "bg-white")}>
                        <td className="px-5 py-3 text-primary font-black">{row.range}</td>
                        <td className="px-5 py-3 text-slate-700">{row.meaning}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 2. RED FLAGS */}
      <div className="rounded-[28px] border-2 border-red-200 bg-red-50 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
           <div className="p-1.5 rounded-lg bg-red-100 text-red-600">
              <TriangleAlert className="h-5 w-5" />
           </div>
           <h3 className="text-sm font-black uppercase tracking-widest text-red-900">Critical Red Flags</h3>
        </div>
        {redFlags.length > 0 ? (
          <ul className="grid grid-cols-1 gap-2.5">
            {redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-red-100 text-sm font-bold text-red-900">
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                {flag}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm font-bold text-red-700 italic">No immediate red flags identified.</p>
        )}
      </div>

      {/* 2.5 INVESTIGATIONS */}
      {investigations && investigations.length > 0 && (
        <ResultCard title="Step 0: Investigations" icon={Activity} variant="info">
          <div className="space-y-6">
            {investigations.map((inv, idx) => (
              <div key={idx} className="space-y-3">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {inv.title}
                </h5>
                <ul className="grid grid-cols-1 gap-2">
                  {inv.list.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-primary/40 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ResultCard>
      )}

      {/* 3. MANAGEMENT — numbered steps */}
      {management.map((m) => (
        <ResultCard key={m.title} title={m.title} icon={Pill} variant="management">
          <div className="space-y-3">
            {m.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50 text-sm font-bold text-slate-800 leading-snug">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-[11px] font-black text-white shadow-md shadow-blue-200">
                  {i + 1}
                </span>
                <span className="flex-1 pt-0.5">{rec}</span>
              </div>
            ))}
          </div>
        </ResultCard>
      ))}

      {/* 4. FINAL DECISION */}
      <ResultCard title="Triage & Disposition" icon={Hospital} variant="decision">
        <div className="space-y-2.5">
          {disposition.map((d, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-sm font-bold text-emerald-950">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              {d}
            </div>
          ))}
        </div>
      </ResultCard>

      {/* 4.5 DISCHARGE & FOLLOW UP */}
      {(dischargeCriteria || followUp) && (
        <ResultCard title="Care Transition" icon={CheckCircle2} variant="decision">
          <div className="space-y-6">
            {dischargeCriteria && dischargeCriteria.length > 0 && (
              <div className="space-y-3">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700/60 ml-1">Safe Discharge Criteria</h5>
                <div className="grid grid-cols-1 gap-2">
                  {dischargeCriteria.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-emerald-100 text-xs font-black text-emerald-900 shadow-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {followUp && followUp.length > 0 && (
              <div className="space-y-3">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700/60 ml-1">Follow-Up Strategy</h5>
                <div className="grid grid-cols-1 gap-2">
                  {followUp.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-xs font-black text-blue-900 shadow-sm">
                      <Activity className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ResultCard>
      )}

      {/* 5. DRUG DOSES */}
      {drugDoses.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 px-2">
             <Pill className="h-4 w-4 text-violet-500" />
             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">Calculated Medication Doses</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-1">
            {drugDoses.map((drug, i) => (
              <div key={i} className="group relative overflow-hidden rounded-[24px] border-2 border-violet-100 bg-white p-4 shadow-sm hover:border-violet-400 transition-all">
                <div className="relative z-10 space-y-3">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-violet-600/60 uppercase tracking-widest">Prescription</span>
                      <div className="p-1.5 rounded-lg bg-violet-50 text-violet-600"><Pill className="h-3.5 w-3.5" /></div>
                   </div>
                   <div>
                      <h4 className="font-black text-base text-slate-900 tracking-tight leading-none mb-1.5">{drug.drugName}</h4>
                      <p className="text-2xl font-black text-violet-600 tracking-tighter leading-none">{drug.dose}</p>
                   </div>
                   {drug.notes && (
                      <p className="text-[11px] font-bold text-slate-500 leading-tight border-t border-violet-50 pt-2 italic">
                        {drug.notes}
                      </p>
                   )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. REFERENCES — collapsed by default */}
      {references.length > 0 && (
        <div className="px-1 pt-4">
          <button
            type="button"
            onClick={() => setShowRefs((v) => !v)}
            className="flex items-center gap-2 p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/20 transition-all w-full shadow-sm"
          >
            <BookOpen className="h-4 w-4" />
            <span>{showRefs ? 'Hide' : 'Show'} Clinical Evidence ({references.length})</span>
            {showRefs ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
          </button>
          {showRefs && (
            <div className="mt-3 grid grid-cols-1 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              {references.map((ref, i) => (
                <a key={i} href={ref.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-primary hover:shadow-md transition-all group">
                   <span className="text-xs font-bold text-slate-700 group-hover:text-primary">{ref.title}</span>
                   <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Print summary link */}
      <div className="no-print pt-6">
        <Button asChild size="lg" variant="outline" className="w-full h-14 rounded-[20px] bg-slate-900 text-white border-none hover:bg-slate-800 hover:text-white shadow-xl shadow-slate-100 transition-all active:scale-[0.98]">
          <Link href={summaryUrl}>
            <FileText className="mr-3 h-5 w-5" /> 
            <span className="font-black uppercase tracking-widest text-xs">Generate Clinical Summary</span>
          </Link>
        </Button>
      </div>
    </>
  );
}

// ─── Main assessment form ─────────────────────────────────────────────────────

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
    const investigations = protocol.getInvestigations?.(severity, data);
    const management = protocol.getManagement(severity, data);
    const disposition = protocol.getDisposition(severity, data);
    const dischargeCriteria = protocol.getDischargeCriteria?.(severity, data);
    const followUp = protocol.getFollowUp?.(severity, data);
    const redFlags = protocol.getRedFlags(severity, data);
    const drugDoses = protocol.getDrugDoses(severity, data);
    const references = protocol.getReferences();
    const lastUpdated = protocol.lastUpdated;
    return { severity, investigations, management, disposition, dischargeCriteria, followUp, redFlags, drugDoses, references, lastUpdated };
  }, [protocol]);

  const { severity, investigations, management, disposition, dischargeCriteria, followUp, redFlags, drugDoses, references, lastUpdated } = useMemo(
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
          <div className="relative group">
            <Input
              id={question.id}
              type="number"
              value={field.value !== undefined && field.value !== false ? String(field.value) : ''}
              onChange={(e) => field.onChange(e.target.value === '' ? undefined : +e.target.value)}
              className="h-12 bg-slate-50 border-slate-200 text-lg font-black focus:bg-white focus:ring-primary focus:border-primary rounded-xl transition-all"
            />
            {question.unit && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 uppercase tracking-widest">
                {question.unit}
              </span>
            )}
          </div>
        );

      case 'select':
        return (
          <Select onValueChange={field.onChange} value={field.value as string}>
            <SelectTrigger id={question.id} className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold text-slate-800">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-2 shadow-xl">
              {question.options?.map((option) => (
                <SelectItem key={String(option.value)} value={String(option.value)} className="font-bold py-3 rounded-lg">
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
            className="flex gap-4"
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
                    'flex items-center gap-3 flex-1 px-4 py-3.5 rounded-2xl border-2 cursor-pointer transition-all active:scale-[0.97]',
                    selected
                      ? value === 'true'
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100'
                        : 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-100'
                      : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600',
                  )}
                >
                  <RadioGroupItem value={value} id={`${question.id}-${value}`} className="sr-only" />
                  <span className="text-sm font-black uppercase tracking-widest">{label}</span>
                  {selected && <CheckCircle2 className="h-4 w-4 ml-auto shrink-0 opacity-80" />}
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
            className="grid grid-cols-1 gap-3"
          >
            {question.options?.map((option, idx) => {
              const val = String(option.value);
              const selected = field.value === val;
              const optCount = question.options?.length ?? 1;
              const colorClass =
                selected && optCount >= 3
                  ? idx === 0
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-50'
                    : idx === optCount - 1
                    ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-50'
                    : 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-50'
                  : selected
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600';

              return (
                <label
                  key={val}
                  htmlFor={`${question.id}-${val}`}
                  className={cn(
                    'flex items-center gap-4 px-4 py-4 rounded-2xl border-2 cursor-pointer transition-all active:scale-[0.98]',
                    colorClass,
                  )}
                >
                  <RadioGroupItem value={val} id={`${question.id}-${val}`} className="sr-only" />
                  <span className="text-sm font-black leading-tight flex-1">{option.label}</span>
                  {selected && <CheckCircle2 className="h-5 w-5 ml-auto shrink-0 opacity-80" />}
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
    <Card key={question.id} className="overflow-hidden rounded-[28px] border-2 border-slate-100 shadow-sm transition-all hover:shadow-md group">
      <CardHeader className="py-4 px-6 bg-slate-50/50 border-b-2 border-slate-100 group-hover:bg-slate-50 transition-colors">
        <CardTitle className="text-sm font-black leading-snug">
          <div className="flex items-start justify-between gap-4">
            <span className="flex-1 text-slate-800 uppercase tracking-tight">{question.questionText}</span>
            {question.info && (
              <button
                type="button"
                onClick={() => setOpenInfoId(openInfoId === question.id ? null : question.id)}
                className="shrink-0 rounded-xl bg-red-50 p-2 text-[10px] font-black text-red-600 hover:bg-red-100 transition-all border border-red-100 shadow-sm"
                aria-label="Show question information"
                aria-expanded={openInfoId === question.id}
              >
                INFO
              </button>
            )}
          </div>
          {question.info && openInfoId === question.id && (
            <div className="mt-4 rounded-2xl border-2 border-red-100 bg-red-50/50 p-4 text-[11px] font-bold text-red-900 leading-relaxed animate-in slide-in-from-top-2 duration-200 shadow-sm">
              {question.info}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 pb-5 px-6 bg-white">
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* ── Left column: questions ── */}
      <div className="space-y-6">
        {/* Paracetamol toxic dose alert */}
        {diseaseId === 'paracetamol-toxicity' && (
          <Alert variant="destructive" className="bg-red-50 border-2 border-red-200 text-red-900 rounded-[28px] p-6 shadow-sm">
            <TriangleAlert className="h-6 w-6 text-red-600 mb-2" />
            <AlertTitle className="font-black uppercase tracking-widest text-xs mb-2">Pediatric Toxic Dose Reference</AlertTitle>
            <AlertDescription className="text-xs font-bold leading-relaxed space-y-2 opacity-80">
              <div className="p-2 rounded-xl bg-white/40"><strong>Acute ingestion:</strong> {">"} 150 mg/kg — Potentially toxic</div>
              <div className="p-2 rounded-xl bg-white/40"><strong>Chronic ingestion:</strong> {">"} 200 mg/kg over 24h, or {">"} 150 mg/kg/day for 2 days</div>
            </AlertDescription>
          </Alert>
        )}

        <div className="rounded-[32px] border-2 border-slate-100 bg-card p-6 shadow-md space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-primary/5 rounded-full blur-2xl" />
          <div className="flex items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <h2 className="flex items-center gap-3 font-headline text-2xl font-black tracking-tighter">
                <div className="p-2 rounded-xl bg-primary/10 text-primary"><Stethoscope className="h-6 w-6" /></div>
                Clinical Assessment
              </h2>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider opacity-60">
                {isHyperkalemia
                  ? 'Verify clinical findings to classify scenario'
                  : 'Real-time protocol decision support'}
              </p>
            </div>
            <div className="flex flex-col items-end shrink-0">
               <span className={cn(
                'text-[10px] font-black px-3 py-1.5 rounded-xl border tracking-widest uppercase',
                allAnswered
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200 shadow-inner',
               )}>
                {answeredCount} / {totalCount}
               </span>
            </div>
          </div>
          
          <div className="space-y-2 relative z-10">
            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden shadow-inner p-0.5 border border-slate-200/50">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-700 ease-out shadow-sm',
                  allAnswered ? 'bg-emerald-500' : 'bg-primary',
                )}
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center px-1">
               <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                 Assessment Progress
               </p>
               <p className="text-[10px] font-black text-primary uppercase">
                 {completionPercent}%
               </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
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
              investigations={investigations}
              management={management}
              disposition={disposition}
              dischargeCriteria={dischargeCriteria}
              followUp={followUp}
              drugDoses={drugDoses}
              references={references}
              showRefs={showRefs}
              setShowRefs={setShowRefs}
              summaryUrl={summaryUrl}
              lastUpdated={lastUpdated}
            />
          )}
        </div>
      </div>
    </div>
  );
}
