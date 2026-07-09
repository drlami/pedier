'use client';

import { useState, useMemo } from 'react';
import { DiseaseProtocol } from '@/lib/protocols/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  BookOpen, 
  Stethoscope, 
  TriangleAlert, 
  FlaskConical, 
  Pill, 
  Activity, 
  CheckCircle2, 
  ChevronRight, 
  UserCircle,
  Clock,
  Printer,
  FileText,
  AlertCircle,
  Scale,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface WardHandbookViewProps {
  protocol: DiseaseProtocol;
}

export function WardHandbookView({ protocol }: WardHandbookViewProps) {
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const data = protocol.wardHandbook;

  if (!data) {
    return (
      <div className="text-center py-12 bg-muted/20 rounded-3xl border-2 border-dashed">
        <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-bold">Handbook Content Pending</h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
          The textbook-style clinical guideline for this ward disease is currently being prepared.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Patient Parameters Header (Sticky) */}
      <div className="sticky top-0 z-30 bg-background border-b pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-primary/5 rounded-2xl p-4 border border-primary/10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <UserCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 leading-none">Patient Parameters</p>
              <h4 className="font-bold text-sm">Interactive Dosing Active</h4>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex-1 sm:w-32">
              <Label htmlFor="weight" className="text-[10px] font-bold uppercase mb-1.5 block text-muted-foreground">Weight (kg)</Label>
              <div className="relative">
                <Scale className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  id="weight" 
                  type="number" 
                  placeholder="0.0" 
                  className="h-9 pl-8 bg-background border-primary/20 focus:border-primary font-bold"
                  value={weight || ''}
                  onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-9 gap-2 no-print" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Print Handbook</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Metadata & Meta-info */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-black text-[10px] tracking-widest">
            INPATIENT HANDBOOK
          </Badge>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tight">
            <Clock className="h-3 w-3" />
            Last Updated: {protocol.lastUpdated || 'May 2026'}
          </div>
        </div>
      </div>

      {/* 3. The Handbook Sections */}
      <Accordion type="multiple" defaultValue={['management']} className="space-y-4">
        
        {/* SECTION: OVERVIEW */}
        <AccordionItem value="overview" className="border rounded-2xl bg-card shadow-sm overflow-hidden px-0">
          <AccordionTrigger className="hover:no-underline px-4 py-4 data-[state=open]:bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100 text-slate-700"><BookOpen className="h-4 w-4" /></div>
              <span className="font-bold text-base tracking-tight">1. Overview & Definition</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 pt-2">
            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
              {data.overview}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION: CLINICAL FEATURES */}
        <AccordionItem value="clinical" className="border rounded-2xl bg-card shadow-sm overflow-hidden px-0">
          <AccordionTrigger className="hover:no-underline px-4 py-4 data-[state=open]:bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-700"><Stethoscope className="h-4 w-4" /></div>
              <span className="font-bold text-base tracking-tight">2. Clinical Assessment</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.clinicalFeatures.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  <h5 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                    <div className="w-1 h-3 bg-blue-500 rounded-full" />
                    {section.title}
                  </h5>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <ChevronRight className="h-3.5 w-3.5 mt-0.5 text-blue-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION: RED FLAGS */}
        <AccordionItem value="redflags" className="border rounded-2xl bg-card shadow-sm overflow-hidden px-0 border-red-100">
          <AccordionTrigger className="hover:no-underline px-4 py-4 data-[state=open]:bg-red-50/50">
            <div className="flex items-center gap-3 text-red-700">
              <div className="p-2 rounded-lg bg-red-100"><TriangleAlert className="h-4 w-4" /></div>
              <span className="font-bold text-base tracking-tight">3. Red Flags (PICU Referral)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 pt-2 bg-red-50/20">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.redFlags.map((flag, i) => (
                <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-red-100 text-sm font-semibold text-red-900 shadow-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-600" />
                  {flag}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION: DIFFERENTIAL DIAGNOSIS */}
        <AccordionItem value="differential" className="border rounded-2xl bg-card shadow-sm overflow-hidden px-0">
          <AccordionTrigger className="hover:no-underline px-4 py-4 data-[state=open]:bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-700"><FileText className="h-4 w-4" /></div>
              <span className="font-bold text-base tracking-tight">4. Differential Diagnosis</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 pt-2">
            <div className="flex flex-wrap gap-2">
              {data.differentialDiagnosis.map((dx, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-900 text-xs font-bold">
                  {dx}
                </span>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION: INVESTIGATIONS */}
        <AccordionItem value="investigations" className="border rounded-2xl bg-card shadow-sm overflow-hidden px-0">
          <AccordionTrigger className="hover:no-underline px-4 py-4 data-[state=open]:bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700"><FlaskConical className="h-4 w-4" /></div>
              <span className="font-bold text-base tracking-tight">5. Investigation Roadmap</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 pt-4">
            <div className="space-y-6">
              <div className="space-y-3">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded inline-block">Initial Evaluation (Threshold-based)</h5>
                <ul className="space-y-2.5">
                  {data.investigations.initial.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-indigo-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-2 py-0.5 rounded inline-block">If failing to improve / Escalation</h5>
                <ul className="space-y-2.5">
                  {data.investigations.escalation.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-medium">
                      <TriangleAlert className="h-4 w-4 mt-0.5 text-rose-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION: MANAGEMENT (THE HEART) */}
        <AccordionItem value="management" className="border rounded-2xl bg-card shadow-sm overflow-hidden px-0 border-primary/20">
          <AccordionTrigger className="hover:no-underline px-4 py-5 data-[state=open]:bg-primary/5">
            <div className="flex items-center gap-3 text-primary">
              <div className="p-2 rounded-lg bg-primary/10"><Activity className="h-4 w-4" /></div>
              <span className="font-black text-lg tracking-tighter">6. Inpatient Management Plan</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-8 pt-4 space-y-8">
            
            {/* 6.1 Initial Management */}
            <div className="space-y-3">
              <h5 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Step 1: Supportive Care
              </h5>
              <div className="grid grid-cols-1 gap-3">
                {data.management.initial.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl border bg-muted/20 text-sm font-medium leading-relaxed">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-background text-[10px] font-black border">{i+1}</span>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* 6.2 Fluids & Nutrition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="rounded-2xl border-blue-100 bg-blue-50/30">
                <CardHeader className="py-3 px-4 border-b border-blue-100">
                  <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-blue-700">
                    <Activity className="h-3.5 w-3.5" /> Fluids
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-2">
                    {data.management.fluids.map((f, i) => (
                      <li key={i} className="text-sm font-medium text-blue-900 flex items-start gap-2">
                        <div className="h-1 w-1 rounded-full bg-blue-400 mt-2 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-emerald-100 bg-emerald-50/30">
                <CardHeader className="py-3 px-4 border-b border-emerald-100">
                  <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-emerald-700">
                    <Activity className="h-3.5 w-3.5" /> Nutrition
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-2">
                    {data.management.nutrition.map((n, i) => (
                      <li key={i} className="text-sm font-medium text-emerald-900 flex items-start gap-2">
                        <div className="h-1 w-1 rounded-full bg-emerald-400 mt-2 shrink-0" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* 6.3 Medications (The Star of the Show) */}
            <div className="space-y-3">
              <h5 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Step 2: Evidence-Based Medications
              </h5>
              <div className="space-y-3">
                {data.management.medications.map((med, i) => {
                  const calculatedDose = weight ? med.calculation(weight) : null;
                  return (
                    <div key={i} className="group relative p-4 rounded-2xl border-2 border-primary/10 bg-background hover:border-primary/30 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <h6 className="font-black text-base text-primary tracking-tight">{med.drug}</h6>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                            {med.dose} • {med.frequency}
                            {med.maxDose && ` (Max: ${med.maxDose})`}
                          </p>
                        </div>
                        {calculatedDose ? (
                          <div className="flex items-center gap-3 bg-primary text-white px-4 py-2.5 rounded-xl shadow-lg shadow-primary/20">
                            <Pill className="h-4 w-4" />
                            <div className="text-right">
                              <p className="text-[9px] font-black uppercase opacity-70 leading-none mb-0.5">Calculated Dose</p>
                              <p className="text-lg font-black leading-none tracking-tighter">{calculatedDose}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-right py-1 px-3 rounded-lg bg-muted text-[10px] font-black uppercase text-muted-foreground animate-pulse">
                            Enter weight to calculate
                          </div>
                        )}
                      </div>
                      {med.notes && (
                        <div className="mt-3 pt-3 border-t border-dashed flex items-start gap-2 text-xs font-medium text-muted-foreground/80">
                          <Info className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                          {med.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 6.4 Monitoring */}
            <div className="space-y-3">
              <h5 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Step 3: Clinical Monitoring
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.management.monitoring.map((m, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl border bg-slate-50/50 text-sm font-bold text-slate-700">
                    <Activity className="h-4 w-4 text-slate-400" />
                    {m}
                  </div>
                ))}
              </div>
            </div>

          </AccordionContent>
        </AccordionItem>

        {/* SECTION: DISCHARGE CRITERIA */}
        <AccordionItem value="discharge" className="border rounded-2xl bg-card shadow-sm overflow-hidden px-0 border-emerald-100">
          <AccordionTrigger className="hover:no-underline px-4 py-4 data-[state=open]:bg-emerald-50/50">
            <div className="flex items-center gap-3 text-emerald-700">
              <div className="p-2 rounded-lg bg-emerald-100"><CheckCircle2 className="h-4 w-4" /></div>
              <span className="font-bold text-base tracking-tight">7. Safe Discharge Criteria</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 pt-2 bg-emerald-50/10">
            <ul className="space-y-2">
              {data.dischargeCriteria.map((c, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-emerald-100 text-sm font-semibold text-emerald-900">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION: FOLLOW UP */}
        <AccordionItem value="followup" className="border rounded-2xl bg-card shadow-sm overflow-hidden px-0">
          <AccordionTrigger className="hover:no-underline px-4 py-4 data-[state=open]:bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100 text-slate-700"><ChevronRight className="h-4 w-4" /></div>
              <span className="font-bold text-base tracking-tight">8. Follow-Up Plan</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 pt-2">
            <ul className="space-y-3">
              {data.followUp.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium text-muted-foreground">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold shrink-0">{i+1}</div>
                  {f}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      {/* Footer: References */}
      <div className="pt-6 space-y-4">
        <div className="flex items-center gap-2 px-1">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Medical Resources & Guidelines</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {protocol.getReferences().map((ref, i) => (
            <a 
              key={i} 
              href={ref.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-2xl border bg-card hover:border-primary/30 hover:shadow-lg transition-all group"
            >
              <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors line-clamp-1">{ref.title}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-all" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
