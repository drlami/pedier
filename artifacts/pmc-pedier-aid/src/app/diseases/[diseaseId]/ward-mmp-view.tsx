'use client';

import { useState, useRef, useEffect } from 'react';
import { DiseaseProtocol } from '@/lib/protocols/types';
import { PicuDkaCalculator } from '@/components/calculators/picu-dka-calculator';
import { VasoactiveCalculator } from '@/components/calculators/vasoactive-calculator';
import { SedationWeaningCalculator } from '@/components/calculators/sedation-weaning-calculator';
import { SedationScoresCalculator } from '@/components/calculators/sedation-scores-calculator';
import { OICalculator } from '@/components/calculators/oi-calculator';
import { MapCppCalculator } from '@/components/calculators/map-cpp-calculator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronRight, 
  Scale, 
  Pill, 
  Activity, 
  Printer, 
  AlertCircle,
  FileText,
  Clock,
  CheckCircle2,
  Info,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  ClipboardList,
  WifiOff,
  Stethoscope,
  ChevronDown,
  Calculator,
  ShieldAlert as ShieldAlertIcon
} from 'lucide-react';

function GbsClinicalMonitor({ weight }: { weight?: number }) {
  const [sbc, setSbc] = useState<number>(25);
  
  const getRisk = (val: number) => {
    if (val < 15) return { label: "CRITICAL RISK", color: "bg-red-600", note: "Impending respiratory failure. Immediate ICU/Anesthesia consult." };
    if (val < 20) return { label: "MODERATE RISK", color: "bg-amber-500", note: "Early weakness; monitor Q1H and notify Senior." };
    return { label: "LOW RISK", color: "bg-emerald-500", note: "Stable; continue serial SBC checks every 2-4 hours." };
  };

  const risk = getRisk(sbc);

  return (
    <div className="p-5 bg-slate-950 text-white rounded-[32px] space-y-6 shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"><Activity className="h-4 w-4" /></div>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/80">Single Breath Count Tracker</span>
        </div>
        <div className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter", risk.color)}>
          {risk.label}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Bedside Single Breath Count</label>
          <Input 
            type="number" 
            value={sbc || ''} 
            onChange={(e) => setSbc(Number(e.target.value))}
            className="bg-slate-900 border-slate-800 text-white rounded-xl font-black h-12 text-lg"
          />
          <p className="text-[9px] font-bold text-slate-500 px-1 italic mt-1">Ask patient to take a deep breath and count out loud as far as possible.</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Clinical Directive</p>
          <p className="text-sm font-bold text-white leading-tight">{risk.note}</p>
        </div>
      </div>
      
      <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 space-y-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-700/50 pb-2">GBS Red Flags</p>
        <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-left">
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Drooling</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Muffled Voice</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Neck Flexor Weakness</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Paradoxical Breathing</div>
        </div>
      </div>
    </div>
  );
}

function AdemSteroidCalculator({ weight }: { weight?: number }) {
  const pulseDose = weight ? Math.min(weight * 30, 1000) : 0;
  const maintenanceDose = weight ? weight * 2 : 0;

  return (
    <div className="p-5 bg-slate-950 text-white rounded-[32px] space-y-6 shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400"><Pill className="h-4 w-4" /></div>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400/80">ADEM Steroid Dosing Calculator</span>
        </div>
      </div>

      {!weight ? (
        <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
          <p className="text-xs font-bold text-slate-500">Enter weight to calculate pulse doses.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-6 bg-amber-600 rounded-[28px] border-2 border-amber-400 shadow-lg text-center space-y-1">
            <span className="text-[10px] font-black text-amber-100 uppercase tracking-widest">IV Methylprednisolone Pulse</span>
            <p className="text-4xl font-black text-white tracking-tighter">
                {pulseDose.toFixed(0)} <span className="text-lg opacity-80">mg</span>
            </p>
            <p className="text-[10px] font-bold text-amber-100 uppercase">30 mg/kg (Max 1000mg)</p>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex justify-between items-center px-6">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Oral Taper Start</span>
            <span className="text-xl font-black text-white">{maintenanceDose.toFixed(1)} <span className="text-xs opacity-50">mg/day</span></span>
          </div>
        </div>
      )}
    </div>
  );
}

function AedLoadingCalculator({ weight }: { weight?: number }) {
  return (
    <div className="p-5 bg-slate-950 text-white rounded-[32px] space-y-6 shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"><Activity className="h-4 w-4" /></div>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/80">Maintenance AED Loading</span>
        </div>
      </div>

      {!weight ? (
        <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
          <p className="text-xs font-bold text-slate-500">Enter weight to calculate loading doses.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Levetiracetam (40mg/kg)</span>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter italic">Infuse over 15 mins</p>
            </div>
            <span className="text-xl font-black text-white">{(weight * 40).toLocaleString()} <span className="text-xs opacity-50">mg</span></span>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Phenytoin (20mg/kg)</span>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter italic">Max rate 1 mg/kg/min</p>
            </div>
            <span className="text-xl font-black text-white">{(weight * 20).toLocaleString()} <span className="text-xs opacity-50">mg</span></span>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Valproate (40mg/kg)</span>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter italic">Infuse over 30 mins</p>
            </div>
            <span className="text-xl font-black text-white">{(weight * 40).toLocaleString()} <span className="text-xs opacity-50">mg</span></span>
          </div>
        </div>
      )}
    </div>
  );
}
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface WardMMPViewProps {
  protocol: DiseaseProtocol;
}

export function WardMMPView({ protocol }: WardMMPViewProps) {
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [showCalculator, setShowCalculator] = useState<string | null>(null);
  const mmp = protocol.mmpData;
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToStage = (index: number) => {
    stageRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!mmp) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <section className="bg-amber-50 border-2 border-amber-100 rounded-[32px] p-6 flex items-start gap-4">
          <div className="p-2.5 rounded-2xl bg-amber-500 text-white shrink-0">
            <Info className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black uppercase tracking-widest text-amber-700">Clinical Advisory</h4>
            <p className="text-xs font-bold text-amber-800/80 leading-relaxed italic">
              "This protocol is currently being transitioned to the Master Management Pathway. Traditional inpatient management guidelines are provided below."
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {protocol.getManagement({ level: 'moderate', details: [] }, {}).map((m, i) => (
            <Card key={i} className="rounded-[32px] border-2 border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-muted/30 border-b border-slate-100">
                <h4 className="font-black text-sm uppercase tracking-widest">{m.title}</h4>
              </div>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {m.recommendations.map((rec, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                      <span className="text-sm font-bold text-slate-700 leading-snug">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="rounded-[32px] border-2 border-emerald-100 bg-emerald-50/20 overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-emerald-100/50 border-b border-emerald-100">
            <h4 className="font-black text-sm uppercase tracking-widest text-emerald-700">Admission & Discharge Criteria</h4>
          </div>
          <CardContent className="p-6">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {protocol.getDisposition({ level: 'moderate', details: [] }, {}).map((d, i) => (
                <li key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-emerald-100 text-xs font-black text-emerald-900">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Drug Doses */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-2">Standard Inpatient Dosing</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {protocol.getDrugDoses({ level: 'moderate', details: [] }, {}).map((d, i) => (
              <div key={i} className="p-4 rounded-2xl border-2 border-slate-100 bg-card hover:border-blue-200 transition-all">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Medication</p>
                <h5 className="font-black text-slate-900 leading-tight">{d.drugName}</h5>
                <p className="text-blue-600 font-black text-lg tracking-tighter mt-1">{d.dose}</p>
              </div>
            ))}
          </div>
        </div>

        {/* References */}
        <div className="border-t pt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {protocol.getReferences().map((ref, i) => (
            <a key={i} href={ref.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-50 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all group">
              <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">{ref.title}</span>
              <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500" />
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32">
      {/* 1. DOCTOR'S ACTION BAR (Sticky) */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 text-white rounded-2xl p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-black text-sm tracking-tight uppercase">Management Pathway</h4>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500/20 text-blue-300 border-none text-[9px] font-black tracking-widest px-1.5 h-4">{protocol.unit === 'picu' ? 'PICU DIRECTIVE' : 'WARD DIRECTIVE'}</Badge>
                  <span className="text-[10px] font-bold text-slate-400 italic">Review: {protocol.lastUpdated || 'May 2026'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex-1 md:w-40">
                <div className="relative group">
                  <Scale className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                  <Input 
                    id="weight-mmp" 
                    type="number" 
                    placeholder="Weight (kg)" 
                    className="h-11 pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 font-black text-lg focus:ring-blue-500 focus:border-blue-500 rounded-xl transition-all"
                    value={weight || ''}
                    onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>
              <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 no-print" onClick={() => window.print()}>
                <Printer className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* QUICK-JUMP NAVIGATION RAIL */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1">
            {mmp.stages.map((stage, idx) => (
              <button
                key={idx}
                onClick={() => scrollToStage(idx)}
                className={cn(
                  "shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all shadow-sm",
                  stage.color === 'blue' ? "bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100" :
                  stage.color === 'amber' ? "bg-amber-50 border-amber-100 text-amber-700 hover:bg-amber-100" :
                  stage.color === 'red' ? "bg-red-50 border-red-100 text-red-700 hover:bg-red-100" :
                  stage.color === 'emerald' ? "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100" :
                  "bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100"
                )}
              >
                {stage.shortLabel || stage.label.split(':')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. CONSULTANT SNAPSHOT */}
      {mmp.snapshot && (
        <Card className="rounded-[32px] border-2 border-primary/20 bg-primary/5 overflow-hidden shadow-sm">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="p-2.5 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 shrink-0">
              <Info className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Consultant Snapshot</p>
              <p className="text-sm font-bold text-slate-800 leading-relaxed italic">
                "{mmp.snapshot}"
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3. THE PATHWAY GRID */}
      <div className="space-y-16">
        {mmp.stages.map((stage, sIdx) => (
          <div key={sIdx} ref={el => { stageRefs.current[sIdx] = el; }} className="relative pl-8 md:pl-12 pt-4">
            {/* STAGE VERTICAL LABEL */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center">
              <div className={cn(
                "w-10 h-10 rounded-2xl border-4 border-background flex items-center justify-center z-10 shadow-md",
                stage.color === 'blue' ? "bg-blue-600" :
                stage.color === 'amber' ? "bg-amber-500" :
                stage.color === 'red' ? "bg-red-600" :
                stage.color === 'emerald' ? "bg-emerald-600" : "bg-indigo-600"
              )}>
                <span className="text-xs font-black text-white">{sIdx + 1}</span>
              </div>
              <div className="w-0.5 h-full bg-slate-200 mt-2 rounded-full" />
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <h3 className={cn(
                  "text-sm font-black tracking-[0.4em] uppercase",
                  stage.color === 'blue' ? "text-blue-600" :
                  stage.color === 'amber' ? "text-amber-600" :
                  stage.color === 'red' ? "text-red-600" :
                  stage.color === 'emerald' ? "text-emerald-600" : "text-indigo-600"
                )}>
                  {stage.label}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {stage.cards.map((card, cIdx) => (
                  <Card key={cIdx} className={cn(
                    "rounded-[32px] overflow-hidden border-2 shadow-sm transition-all hover:shadow-lg",
                    card.isCritical ? "border-red-200 bg-red-50/20" : "border-slate-100 bg-card"
                  )}>
                    <CardContent className="p-0">
                      {/* CARD HEADER */}
                      <div className={cn(
                        "px-6 py-4 border-b flex items-center justify-between gap-4",
                        card.isCritical ? "bg-red-100/50 border-red-200" : "bg-muted/30 border-slate-100"
                      )}>
                        <h4 className="font-black text-base tracking-tight flex items-center gap-3">
                          {card.isCritical && <ShieldAlert className="h-5 w-5 text-red-600 animate-pulse" />}
                          {card.title}
                        </h4>
                        {card.threshold && (
                          <Badge className="bg-white text-[10px] font-black border-2 border-slate-200 text-slate-700 px-3 py-1 shadow-sm uppercase tracking-tighter">
                            {card.threshold}
                          </Badge>
                        )}
                      </div>

                      {/* CARD BODY */}
                      <div className="p-6 space-y-8">
                        {/* INTEGRATED CALCULATORS (COLLAPSIBLE) */}
                        {card.calculator && (
                          <div className="mb-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full h-11 rounded-2xl bg-slate-50 border-2 border-slate-200 text-[11px] font-black uppercase tracking-widest gap-2 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                              onClick={() => setShowCalculator(showCalculator === card.calculator?.id ? null : card.calculator?.id || null)}
                            >
                              <Calculator className="h-4 w-4" />
                              {showCalculator === card.calculator.id ? "Hide" : "Open"} {card.calculator.title}
                            </Button>
                            
                            {showCalculator === card.calculator.id && (
                              <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                {card.calculator.id === 'pram-score' && <PramCalculator />}
                                {card.calculator.id === 'wang-score' && <WangCalculator />}
                                {card.calculator.id === 'westley-score' && <WestleyCalculator />}
                                {card.calculator.id === 'aki-fluid-calc' && <FluidTitrationCalculator weight={weight} />}
                                {card.calculator.id === 'dka-fluid-calc' && <DkaTwoBagCalculator weight={weight} />}
                                {card.calculator.id === 'picu-dka-calc' && <PicuDkaCalculator weight={weight} />}
                                {card.calculator.id === 'picu-vasoactive-calc' && <VasoactiveCalculator weight={weight} />}
                                {card.calculator.id === 'sedation-weaning-calc' && <SedationWeaningCalculator weight={weight} />}
                                {card.calculator.id === 'sedation-scores' && <SedationScoresCalculator />}
                                {card.calculator.id === 'oi-calc' && <OICalculator />}
                                {card.calculator.id === 'map-cpp-calc' && <MapCppCalculator />}
                                {card.calculator.id === 'chf-management-calc' && <ChfManagementCalculator weight={weight} />}
                                {card.calculator.id === 'bp-safety-calc' && <BpSafetyCalculator weight={weight} />}
                                {card.calculator.id === 'gbs-clinical-monitor' && <GbsClinicalMonitor weight={weight} />}
                                {card.calculator.id === 'adem-steroid-calc' && <AdemSteroidCalculator weight={weight} />}
                                {card.calculator.id === 'aed-loading-calc' && <AedLoadingCalculator weight={weight} />}
                                {card.calculator.id === 'nac-infusion-calc' && <NacInfusionCalculator weight={weight} />}
                                {card.calculator.id === 'salicylate-alk-calc' && <SalicylateAlkalinizationCalculator weight={weight} />}
                                {card.calculator.id === 'iron-chelation-calc' && <IronChelationCalculator weight={weight} />}
                                {card.calculator.id === 'free-water-calc' && <FreeWaterDeficitCalculator weight={weight} />}
                                {card.calculator.id === 'siadh-restriction-calc' && <SiadhRestrictionCalculator weight={weight} />}
                                {card.calculator.id === 'adrenal-stress-calc' && <AdrenalStressDoseCalculator weight={weight} />}
                                {card.calculator.id === 'dextrose-bolus-calc' && <DextroseBolusCalculator weight={weight} />}
                                {card.calculator.id === 'gir-calculator' && <GirCalculator weight={weight} />}
                              </div>
                            )}
                          </div>
                        )}

                        {/* CATEGORIZED DIRECTIVES */}
                        <div className="grid grid-cols-1 gap-6">
                          
                          {/* 1. DOCTOR ORDERS [DR] */}
                          {(card.orders && card.orders.length > 0) && (
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-blue-600 text-white font-black text-[9px] tracking-widest px-1.5 rounded-sm">DR</Badge>
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-700">Physician Directives</span>
                              </div>
                              <ul className="space-y-3">
                                {card.orders.map((order, i) => (
                                  <li key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-sm font-bold text-slate-800 leading-snug">
                                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                                    {order}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* 2. NURSING DIRECTIVES [NS] */}
                          {(card.nursing && card.nursing.length > 0) && (
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-emerald-600 text-white font-black text-[9px] tracking-widest px-1.5 rounded-sm">NS</Badge>
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Nursing & Monitoring</span>
                              </div>
                              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {card.nursing.map((ns, i) => (
                                  <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/30 border border-emerald-100/50 text-xs font-bold text-slate-700">
                                    <Activity className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                    {ns}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* 3. SENIOR TRIGGERS [!] */}
                          {(card.triggers && card.triggers.length > 0) && (
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-amber-500 text-white font-black text-[9px] tracking-widest px-1.5 rounded-sm">!</Badge>
                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">Escalation Triggers</span>
                              </div>
                              <div className="space-y-2">
                                {card.triggers.map((trig, i) => (
                                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-sm font-black text-amber-900 shadow-sm">
                                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                                    {trig}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 4. LEGACY INSTRUCTIONS (Fallback) */}
                          {(card.instructions && card.instructions.length > 0) && (
                            <ul className="space-y-3">
                              {card.instructions.map((ins, i) => (
                                <li key={i} className="flex items-start gap-3 group">
                                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0 group-hover:bg-blue-400 transition-colors" />
                                  <span className="text-sm font-medium leading-snug text-slate-700">{ins}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* PRESCRIPTION BLOCK (HOSPITAL CHART STYLE) */}
                        {card.prescriptions && card.prescriptions.length > 0 && (
                          <div className="pt-4 space-y-4">
                            <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                              <ClipboardList className="h-4 w-4 text-slate-400" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Electronic Order Entry</span>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              {card.prescriptions.map((rx, rIdx) => {
                                const calc = weight ? rx.calculation(weight) : null;
                                return (
                                  <div key={rIdx} className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-sm hover:border-blue-400 transition-all">
                                    <div className="flex flex-col sm:flex-row">
                                      <div className="flex-1 p-4 space-y-2">
                                        <div className="flex items-center gap-2">
                                          <span className="font-black text-lg text-slate-900 uppercase tracking-tight">{rx.drug}</span>
                                          <Badge variant="outline" className="text-[9px] font-black h-5 px-1.5 rounded bg-slate-50 uppercase">{rx.route}</Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Base: {rx.dose}</p>
                                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Freq: {rx.frequency}</p>
                                        </div>
                                      </div>
                                      <div className={cn(
                                        "sm:w-48 p-4 flex flex-col items-center justify-center gap-1 border-t sm:border-t-0 sm:border-l-2 border-slate-100 transition-colors",
                                        calc ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-400"
                                      )}>
                                        {calc ? (
                                          <>
                                            <p className="text-[9px] font-black uppercase opacity-70">Ordered Dose</p>
                                            <p className="text-2xl font-black tracking-tighter leading-none">{calc}</p>
                                          </>
                                        ) : (
                                          <p className="text-[10px] font-black uppercase italic animate-pulse">Waiting for Weight</p>
                                        )}
                                      </div>
                                    </div>
                                    {rx.notes && (
                                      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[10px] font-bold text-slate-500 italic">
                                        Note: {rx.notes}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. REFERENCES GRID */}
      <div className="border-t pt-12 space-y-6">
        <div className="flex items-center gap-2 px-1">
          <BookOpen className="h-5 w-5 text-slate-400" />
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Pathways derived from Clinical Practice Guidelines</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {protocol.getReferences().map((ref, i) => (
            <a 
              key={i} 
              href={ref.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 rounded-[28px] border-2 bg-slate-50 border-slate-100 hover:border-blue-400 hover:bg-white hover:shadow-lg transition-all group"
            >
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-slate-400 group-hover:text-blue-400 tracking-widest">Reference Source</span>
                <p className="text-xs font-bold text-slate-700 line-clamp-1 group-hover:text-slate-900">{ref.title}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-50" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS (CALCULATORS) ---

function WangCalculator() {
  const [scores, setScores] = useState({
    rr: 0,
    wheezing: 0,
    retractions: 0,
    general: 0,
  });

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  
  const getInterpretation = (val: number) => {
    if (val <= 3) return { label: "Mild", color: "bg-green-500" };
    if (val <= 8) return { label: "Moderate", color: "bg-amber-500" };
    return { label: "Severe", color: "bg-red-600" };
  };

  const interpretation = getInterpretation(total);

  return (
    <div className="p-5 bg-slate-900 text-white rounded-[32px] space-y-5 shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"><Activity className="h-4 w-4" /></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Wang Respiratory Score</span>
        </div>
        <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg", interpretation.color)}>
          {interpretation.label}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Respiratory Rate */}
        <div className="space-y-2">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Respiratory Rate</label>
          <div className="grid grid-cols-2 gap-1.5">
            {[{l: "< 30", v: 0}, {l: "31-45", v: 1}, {l: "46-60", v: 2}, {l: "> 60", v: 3}].map((o) => (
              <button key={o.v} onClick={() => setScores(s => ({...s, rr: o.v}))} className={cn("py-2 rounded-xl text-[10px] font-black transition-all", scores.rr === o.v ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-slate-800 text-slate-400 hover:bg-slate-700")}>
                {o.l} ({o.v > 0 ? `+${o.v}` : 0})
              </button>
            ))}
          </div>
        </div>

        {/* Wheezing */}
        <div className="space-y-2">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Wheezing</label>
          <div className="grid grid-cols-2 gap-1.5">
            {[{l: "None", v: 0}, {l: "Terminal Exp.", v: 1}, {l: "Entire Exp.", v: 2}, {l: "Insp/Exp", v: 3}].map((o) => (
              <button key={o.v} onClick={() => setScores(s => ({...s, wheezing: o.v}))} className={cn("py-2 rounded-xl text-[10px] font-black transition-all", scores.wheezing === o.v ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-slate-800 text-slate-400 hover:bg-slate-700")}>
                {o.l} ({o.v > 0 ? `+${o.v}` : 0})
              </button>
            ))}
          </div>
        </div>

        {/* Retractions */}
        <div className="space-y-2">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Retractions</label>
          <div className="grid grid-cols-2 gap-1.5">
            {[{l: "None", v: 0}, {l: "Intercostal", v: 1}, {l: "Subcostal", v: 2}, {l: "Severe", v: 3}].map((o) => (
              <button key={o.v} onClick={() => setScores(s => ({...s, retractions: o.v}))} className={cn("py-2 rounded-xl text-[10px] font-black transition-all", scores.retractions === o.v ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-slate-800 text-slate-400 hover:bg-slate-700")}>
                {o.l} ({o.v > 0 ? `+${o.v}` : 0})
              </button>
            ))}
          </div>
        </div>

        {/* General Condition */}
        <div className="space-y-2">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">General Condition</label>
          <div className="grid grid-cols-2 gap-1.5">
            {[{l: "Normal", v: 0}, {l: "Irritable", v: 1}, {l: "Lethargic", v: 2}, {l: "Moribund", v: 3}].map((o) => (
              <button key={o.v} onClick={() => setScores(s => ({...s, general: o.v}))} className={cn("py-2 rounded-xl text-[10px] font-black transition-all", scores.general === o.v ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-slate-800 text-slate-400 hover:bg-slate-700")}>
                {o.l} ({o.v > 0 ? `+${o.v}` : 0})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Wang Score</span>
        <span className="text-4xl font-black text-blue-400 leading-none tracking-tighter">{total} <span className="text-xs text-slate-600">/ 12</span></span>
      </div>
    </div>
  );
}

function PramCalculator() {
  const [scores, setScores] = useState({
    suprasternal: 0,
    scalene: 0,
    airEntry: 0,
    wheezing: 0,
    o2Sat: 0,
  });

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  
  const getInterpretation = (val: number) => {
    if (val <= 3) return { label: "Mild", color: "bg-green-500" };
    if (val <= 7) return { label: "Moderate", color: "bg-amber-500" };
    return { label: "Severe", color: "bg-red-600" };
  };

  const interpretation = getInterpretation(total);

  return (
    <div className="p-5 bg-slate-900 text-white rounded-[32px] space-y-5 shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
           <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"><Activity className="h-4 w-4" /></div>
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">PRAM Score</span>
        </div>
        <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg", interpretation.color)}>
          Result: {interpretation.label}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Suprasternal */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Suprasternal Retractions</label>
          <div className="flex gap-1.5">
            {[0, 2].map((v) => (
              <button key={v} onClick={() => setScores(s => ({...s, suprasternal: v}))} className={cn("flex-1 py-2 rounded-xl text-[10px] font-black transition-all", scores.suprasternal === v ? "bg-blue-600 text-white shadow-lg" : "bg-slate-800 text-slate-400 hover:bg-slate-700")}>
                {v === 0 ? "Absent" : "Present (+2)"}
              </button>
            ))}
          </div>
        </div>

        {/* Scalene */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Scalene Muscle Use</label>
          <div className="flex gap-1.5">
            {[0, 2].map((v) => (
              <button key={v} onClick={() => setScores(s => ({...s, scalene: v}))} className={cn("flex-1 py-2 rounded-xl text-[10px] font-black transition-all", scores.scalene === v ? "bg-blue-600 text-white shadow-lg" : "bg-slate-800 text-slate-400 hover:bg-slate-700")}>
                {v === 0 ? "Absent" : "Present (+2)"}
              </button>
            ))}
          </div>
        </div>

        {/* Air Entry */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Air Entry</label>
          <div className="grid grid-cols-2 gap-1.5">
            {[{l: "Normal", v: 0}, {l: "Decr. Bases", v: 1}, {l: "Decr. Apex/Bases", v: 2}, {l: "Minimal/Absent", v: 3}].map((o) => (
              <button key={o.v} onClick={() => setScores(s => ({...s, airEntry: o.v}))} className={cn("py-2 rounded-xl text-[10px] font-black transition-all", scores.airEntry === o.v ? "bg-blue-600 text-white shadow-lg" : "bg-slate-800 text-slate-400 hover:bg-slate-700")}>
                {o.l} (+{o.v})
              </button>
            ))}
          </div>
        </div>

        {/* Wheezing */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Wheezing</label>
          <div className="grid grid-cols-2 gap-1.5">
            {[{l: "Absent", v: 0}, {l: "Exp only", v: 1}, {l: "Insp/Exp", v: 2}, {l: "Audible w/o Steth", v: 3}].map((o) => (
              <button key={o.v} onClick={() => setScores(s => ({...s, wheezing: o.v}))} className={cn("py-2 rounded-xl text-[10px] font-black transition-all", scores.wheezing === o.v ? "bg-blue-600 text-white shadow-lg" : "bg-slate-800 text-slate-400 hover:bg-slate-700")}>
                {o.l} (+{o.v})
              </button>
            ))}
          </div>
        </div>

        {/* SpO2 */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Oxygen Saturation (Room Air)</label>
          <div className="flex gap-1.5">
            {[{l: "≥ 95%", v: 0}, {l: "92-94%", v: 1}, {l: "< 92%", v: 2}].map((o) => (
              <button key={o.v} onClick={() => setScores(s => ({...s, o2Sat: o.v}))} className={cn("flex-1 py-2 rounded-xl text-[10px] font-black transition-all", scores.o2Sat === o.v ? "bg-blue-600 text-white shadow-lg" : "bg-slate-800 text-slate-400 hover:bg-slate-700")}>
                {o.l} (+{o.v})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total PRAM Score</span>
        <span className="text-4xl font-black text-blue-400 leading-none tracking-tighter">{total} <span className="text-xs text-slate-600">/ 12</span></span>
      </div>
    </div>
  );
}

function WestleyCalculator() {
  const [scores, setScores] = useState({
    stridor: 0,
    retractions: 0,
    airEntry: 0,
    cyanosis: 0,
    consciousness: 0,
  });

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  
  const getInterpretation = (val: number) => {
    if (val <= 2) return { label: "Mild", color: "bg-green-500" };
    if (val <= 7) return { label: "Moderate", color: "bg-amber-500" };
    return { label: "Severe", color: "bg-red-600" };
  };

  const interpretation = getInterpretation(total);

  return (
    <div className="p-5 bg-slate-900 text-white rounded-[32px] space-y-5 shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"><Activity className="h-4 w-4" /></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Westley Croup Score</span>
        </div>
        <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg", interpretation.color)}>
          Result: {interpretation.label}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Stridor */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Stridor</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[{l: "None", v: 0}, {l: "With Agit.", v: 1}, {l: "At Rest", v: 2}].map((o) => (
              <button key={o.v} onClick={() => setScores(s => ({...s, stridor: o.v}))} className={cn("py-2 rounded-xl text-[10px] font-black transition-all", scores.stridor === o.v ? "bg-blue-600 text-white shadow-lg" : "bg-slate-800 text-slate-400 hover:bg-slate-700")}>
                {o.l} (+{o.v})
              </button>
            ))}
          </div>
        </div>

        {/* Retractions */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Retractions</label>
          <div className="grid grid-cols-4 gap-1.5">
            {[{l: "None", v: 0}, {l: "Mild", v: 1}, {l: "Mod.", v: 2}, {l: "Severe", v: 3}].map((o) => (
              <button key={o.v} onClick={() => setScores(s => ({...s, retractions: o.v}))} className={cn("py-2 rounded-xl text-[10px] font-black transition-all", scores.retractions === o.v ? "bg-blue-600 text-white shadow-lg" : "bg-slate-800 text-slate-400 hover:bg-slate-700")}>
                {o.l} (+{o.v})
              </button>
            ))}
          </div>
        </div>

        {/* Air Entry */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Air Entry</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[{l: "Normal", v: 0}, {l: "Decreased", v: 1}, {l: "Marked Decr.", v: 2}].map((o) => (
              <button key={o.v} onClick={() => setScores(s => ({...s, airEntry: o.v}))} className={cn("py-2 rounded-xl text-[10px] font-black transition-all", scores.airEntry === o.v ? "bg-blue-600 text-white shadow-lg" : "bg-slate-800 text-slate-400 hover:bg-slate-700")}>
                {o.l} (+{o.v})
              </button>
            ))}
          </div>
        </div>

        {/* Cyanosis */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Cyanosis</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[{l: "None", v: 0}, {l: "With Agit.", v: 4}, {l: "At Rest", v: 5}].map((o) => (
              <button key={o.v} onClick={() => setScores(s => ({...s, cyanosis: o.v}))} className={cn("py-2 rounded-xl text-[10px] font-black transition-all", scores.cyanosis === o.v ? "bg-blue-600 text-white shadow-lg" : "bg-slate-800 text-slate-400 hover:bg-slate-700")}>
                {o.l} (+{o.v})
              </button>
            ))}
          </div>
        </div>

        {/* Level of Consciousness */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Level of Consciousness</label>
          <div className="grid grid-cols-2 gap-1.5">
            {[{l: "Normal", v: 0}, {l: "Altered", v: 5}].map((o) => (
              <button key={o.v} onClick={() => setScores(s => ({...s, consciousness: o.v}))} className={cn("py-2 rounded-xl text-[10px] font-black transition-all", scores.consciousness === o.v ? "bg-blue-600 text-white shadow-lg" : "bg-slate-800 text-slate-400 hover:bg-slate-700")}>
                {o.l} (+{o.v})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Westley Score</span>
        <span className="text-4xl font-black text-blue-400 leading-none tracking-tighter">{total} <span className="text-xs text-slate-600">/ 17</span></span>
      </div>
    </div>
  );
}

function FluidTitrationCalculator({ weight }: { weight?: number }) {
  const [urineOutput, setUrineOutput] = useState<number>(0);
  
  // Insensible Water Loss calculation
  const insensibleLoss = weight ? (weight < 10 ? weight * 30 : weight * 20) : 0;
  const totalFluidLimit = insensibleLoss + urineOutput;

  return (
    <div className="p-5 bg-slate-900 text-white rounded-[32px] space-y-5 shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
           <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"><Calculator className="h-4 w-4" /></div>
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fluid Titration Calculator</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Patient Weight (kg)</label>
          <div className="p-3 bg-slate-800 rounded-xl text-sm font-bold text-blue-400">
            {weight ? `${weight} kg` : "Please enter weight in the main section"}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">24-Hour Urine Output (mL)</label>
          <Input 
            type="number" 
            value={urineOutput || ''} 
            onChange={(e) => setUrineOutput(Number(e.target.value))}
            className="bg-slate-800 border-slate-700 text-white rounded-xl font-bold h-11"
            placeholder="Enter total mL per day"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 space-y-1">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Insensible Water Loss</span>
            <p className="text-lg font-black text-amber-400 tracking-tight">{insensibleLoss} <span className="text-[10px] opacity-50">mL/day</span></p>
          </div>
          <div className="p-4 bg-blue-600 rounded-2xl border border-blue-500 space-y-1 shadow-lg">
            <span className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Total Fluid Limit</span>
            <p className="text-lg font-black text-white tracking-tight">{totalFluidLimit} <span className="text-[10px] opacity-70">mL/day</span></p>
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
        <p className="text-[10px] font-bold text-slate-400 italic leading-relaxed">
          * Calculation Details: Insensible Water Loss ({weight && weight < 10 ? "30 mL/kg" : "20 mL/kg"}) + Previous 24-hour Urine Output. This total represents the daily fluid restriction target for patients with established Acute Kidney Injury.
        </p>
      </div>
    </div>
  );
}

function DkaTwoBagCalculator({ weight }: { weight?: number }) {
  const [potassiumLevel, setPotassiumLevel] = useState<'low' | 'normal' | 'high'>('normal');

  // Fluid calculation logic: 10% Deficit over 48h + Maintenance
  const getFluidData = (w: number) => {
    let dailyMaintenance = 0;
    if (w <= 10) dailyMaintenance = 100 * w;
    else if (w <= 20) dailyMaintenance = 1000 + 50 * (w - 10);
    else dailyMaintenance = 1500 + 20 * (w - 20);
    
    const maintenanceRate = dailyMaintenance / 24;
    const deficitVolume = w * 0.1 * 1000; // 10% Deficit (100mL/kg)
    const totalRate = (deficitVolume + (dailyMaintenance * 2)) / 48; // Deficit + 2 days maintenance over 48h
    
    return { maintenanceRate, deficitVolume, totalRate };
  };

  const data = weight ? getFluidData(weight) : null;

  // Potassium logic per 500mL bag
  const getPotassiumAmount = () => {
    if (potassiumLevel === 'high') return { amount: 0, label: "0 mEq (Delay Addition)" };
    if (potassiumLevel === 'low') return { amount: 30, label: "30 mEq (60 mEq/L)" };
    return { amount: 20, label: "20 mEq (40 mEq/L)" };
  };

  const kInfo = getPotassiumAmount();

  return (
    <div className="p-5 bg-slate-950 text-white rounded-[32px] space-y-6 shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"><Calculator className="h-4 w-4" /></div>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/80">Two-Bag System Calculator</span>
        </div>
        {weight && <Badge className="bg-blue-600 text-white border-none">{weight} kg</Badge>}
      </div>

      {!weight ? (
        <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
          <p className="text-xs font-bold text-slate-500">Please enter patient weight in the assessment section above to calculate fluid rates.</p>
        </div>
      ) : data && (
        <>
          {/* 1. POTASSIUM LEVEL SELECTOR */}
          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Current Serum Potassium Level</label>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setPotassiumLevel('low')}
                className={cn(
                  "py-2.5 rounded-xl text-[10px] font-black transition-all border-2",
                  potassiumLevel === 'low' ? "bg-red-500/20 border-red-500 text-red-400" : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700"
                )}
              >
                LOW {"(< 3.5)"}
              </button>
              <button 
                onClick={() => setPotassiumLevel('normal')}
                className={cn(
                  "py-2.5 rounded-xl text-[10px] font-black transition-all border-2",
                  potassiumLevel === 'normal' ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700"
                )}
              >
                NORMAL (3.5-5.5)
              </button>
              <button 
                onClick={() => setPotassiumLevel('high')}
                className={cn(
                  "py-2.5 rounded-xl text-[10px] font-black transition-all border-2",
                  potassiumLevel === 'high' ? "bg-blue-500/20 border-blue-500 text-blue-400" : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700"
                )}
              >
                HIGH {"> 5.5"}
              </button>
            </div>
          </div>

          {/* 2. THE PRIMARY CALCULATION */}
          <div className="p-6 bg-blue-600 rounded-[28px] border-2 border-blue-400 shadow-lg text-center space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest relative z-10">Total Hourly IV Fluid Rate</span>
            <p className="text-5xl font-black text-white tracking-tighter relative z-10">
                {data.totalRate.toFixed(1)} <span className="text-lg opacity-80">mL/hr</span>
            </p>
            <p className="text-[9px] font-bold text-blue-100/70 italic relative z-10">
                Calculated as (10% Deficit + Maintenance) over 48 hours.
            </p>
          </div>

          {/* 3. BAG PREPARATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-900 rounded-[24px] border-2 border-slate-800 space-y-3 shadow-inner">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                <h4 className="text-[11px] font-black uppercase tracking-wider">Bag 1 (0% Dextrose)</h4>
              </div>
              <ul className="text-[11px] font-bold text-slate-400 space-y-2.5">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">●</span> 500 mL Isotonic Saline (0.9% NaCl)
                </li>
                <li className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/50 border border-slate-800/50 text-white">
                  <span className="text-emerald-400">✚</span> {kInfo.label}
                </li>
              </ul>
            </div>

            <div className="p-5 bg-slate-900 rounded-[24px] border-2 border-slate-800 space-y-3 shadow-inner">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <h4 className="text-[11px] font-black uppercase tracking-wider">Bag 2 (10% Dextrose)</h4>
              </div>
              <ul className="text-[11px] font-bold text-slate-400 space-y-2.5">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">●</span> 500 mL D10W (or D10-0.9% NaCl)
                </li>
                <li className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/50 border border-slate-800/50 text-white">
                  <span className="text-emerald-400">✚</span> {kInfo.label}
                </li>
              </ul>
            </div>
          </div>

          {/* 4. TITRATION GRID */}
          <div className="p-6 bg-slate-900 rounded-[28px] border border-slate-800 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2">Hourly Titration Schedule</h4>
            <div className="space-y-3">
              <TitrationRow label="Glucose > 300 mg/dL" b1={100} b2={0} total={data.totalRate} />
              <TitrationRow label="Glucose 250 - 300" b1={75} b2={25} total={data.totalRate} />
              <TitrationRow label="Glucose 200 - 250" b1={50} b2={50} total={data.totalRate} />
              <TitrationRow label="Glucose 150 - 200" b1={25} b2={75} total={data.totalRate} />
              <TitrationRow label="Glucose < 150 mg/dL" b1={0} b2={100} total={data.totalRate} />
            </div>
            <div className="pt-2">
              <p className="text-[10px] font-bold text-amber-400/80 italic leading-relaxed">
                * Note: If Blood Glucose remains below 150 mg/dL despite 100% Bag 2, consult senior to increase Dextrose concentration to 12.5%. DO NOT STOP INSULIN.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function NacInfusionCalculator({ weight }: { weight?: number }) {
  // NAC 3-Stage Protocol
  // Stage 1: 150 mg/kg over 1h
  // Stage 2: 50 mg/kg over 4h
  // Stage 3: 100 mg/kg over 16h
  
  const stage1 = weight ? (150 * weight) : 0;
  const stage2 = weight ? (50 * weight) : 0;
  const stage3 = weight ? (100 * weight) : 0;

  return (
    <div className="p-5 bg-slate-950 text-white rounded-[32px] space-y-6 shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400"><Pill className="h-4 w-4" /></div>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/80">NAC 3-Stage Infusion Calculator</span>
        </div>
      </div>

      {!weight ? (
        <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
          <p className="text-xs font-bold text-slate-500">Enter weight to calculate NAC doses.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stage 1 (Loading)</span>
              <p className="text-xs font-bold text-slate-400">150 mg/kg over 1 hour</p>
            </div>
            <span className="text-xl font-black text-white">{stage1.toLocaleString()} <span className="text-xs opacity-50 font-medium">mg</span></span>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stage 2</span>
              <p className="text-xs font-bold text-slate-400">50 mg/kg over 4 hours</p>
            </div>
            <span className="text-xl font-black text-white">{stage2.toLocaleString()} <span className="text-xs opacity-50 font-medium">mg</span></span>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex justify-between items-center border-emerald-500/30">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest">Stage 3</span>
              <p className="text-xs font-bold text-slate-400">100 mg/kg over 16 hours</p>
            </div>
            <span className="text-xl font-black text-white">{stage3.toLocaleString()} <span className="text-xs opacity-50 font-medium">mg</span></span>
          </div>
        </div>
      )}
      
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Pediatric Safety Note</p>
        <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic">
          "Dilute NAC in 5% Dextrose. In children {"<"} 40kg, the total fluid volume must be restricted to prevent cerebral edema. Ensure Stage 1 is given over exactly 60 minutes to reduce anaphylactoid risk."
        </p>
      </div>
    </div>
  );
}

function SalicylateAlkalinizationCalculator({ weight }: { weight?: number }) {
  // Bicarb Bolus: 1-2 mEq/kg
  const bolusLow = weight ? weight * 1 : 0;
  const bolusHigh = weight ? weight * 2 : 0;
  
  // Maintenance Drip: D5W + 150 mEq/L Bicarb + 40 mEq/L KCl
  // Rate is typically 1.5 - 2x Maintenance
  const getMaintenance = (w: number) => {
    if (w <= 10) return 100 * w;
    if (w <= 20) return 1000 + 50 * (w - 10);
    return 1500 + 20 * (w - 20);
  };
  
  const dailyMaint = weight ? getMaintenance(weight) : 0;
  const dripRate = (dailyMaint * 2) / 24; // 2x Maintenance rate

  return (
    <div className="p-5 bg-slate-950 text-white rounded-[32px] space-y-6 shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"><Activity className="h-4 w-4" /></div>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/80">Urinary Alkalinization Guide</span>
        </div>
      </div>

      {!weight ? (
        <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
          <p className="text-xs font-bold text-slate-500">Enter weight to calculate alkalinization doses.</p>
        </div>
      ) : (
        <>
          <div className="p-6 bg-blue-600 rounded-[28px] border-2 border-blue-400 shadow-lg text-center space-y-2">
            <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Initial Bicarbonate Bolus</span>
            <p className="text-3xl font-black text-white tracking-tighter">
                {bolusLow.toFixed(0)} - {bolusHigh.toFixed(0)} <span className="text-sm opacity-80 font-medium">mEq</span>
            </p>
            <p className="text-[10px] font-bold text-blue-200 uppercase">Give IV over 10-15 minutes</p>
          </div>

          <div className="p-5 bg-slate-900 rounded-[24px] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Maintenance Alkalinization Drip</h4>
              <Badge className="bg-slate-800 text-white border-slate-700">{dripRate.toFixed(1)} mL/hr</Badge>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1" />
                <div className="space-y-1">
                  <p className="text-xs font-black text-slate-200">1000 mL 5% Dextrose (D5W)</p>
                  <p className="text-[10px] font-bold text-slate-500">Add 150 mEq Sodium Bicarbonate</p>
                  <p className="text-[10px] font-bold text-slate-500">Add 40 mEq Potassium Chloride (KCl)</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">The Critical Rule</p>
        <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic">
          "Alkalinization will FAIL if potassium is low. Maintain serum K+ between 4.5 - 5.0 mEq/L. Target Urine pH: 7.5 - 8.5."
        </p>
      </div>
    </div>
  );
}

function IronChelationCalculator({ weight }: { weight?: number }) {
  // Deferoxamine: 5 mg/kg/hr starting, up to 15 mg/kg/hr
  const rateLow = weight ? weight * 5 : 0;
  const rateHigh = weight ? weight * 15 : 0;

  return (
    <div className="p-5 bg-slate-950 text-white rounded-[32px] space-y-6 shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400"><Calculator className="h-4 w-4" /></div>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400/80">Iron Chelation Calculator</span>
        </div>
      </div>

      {!weight ? (
        <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
          <p className="text-xs font-bold text-slate-500">Enter weight to calculate chelation rates.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-6 bg-orange-600 rounded-[28px] border-2 border-orange-400 shadow-lg text-center space-y-1">
            <span className="text-[10px] font-black text-orange-100 uppercase tracking-widest">Deferoxamine Infusion Rate</span>
            <p className="text-4xl font-black text-white tracking-tighter">
                {rateLow.toFixed(1)} - {rateHigh.toFixed(1)} <span className="text-lg opacity-80">mg/hr</span>
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
             <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-1">
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Start Rate</span>
               <p className="text-lg font-black text-white">5 mg/kg/hr</p>
             </div>
             <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-1">
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Max Rate</span>
               <p className="text-lg font-black text-white">15 mg/kg/hr</p>
             </div>
          </div>
        </div>
      )}
      
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Visual Monitoring</p>
        <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic">
          "Monitor for 'Vin-rose' (orange-red) urine color. This indicates ferrioxamine (chelated iron) is being excreted. Continue infusion until urine color returns to normal and serum iron is {"<"} 350 mcg/dL."
        </p>
      </div>
    </div>
  );
}

function BpSafetyCalculator({ weight }: { weight?: number }) {
  const [sbp, setSbp] = useState<number>(160);
  const [dbp, setDbp] = useState<number>(100);
  
  // MAP = (SBP + 2*DBP) / 3
  const currentMap = (sbp + (2 * dbp)) / 3;
  const targetMap25 = currentMap * 0.75;
  
  return (
    <div className="p-5 bg-slate-950 text-white rounded-[32px] space-y-6 shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400"><ShieldAlert className="h-4 w-4" /></div>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400/80">BP Safety & Target Calculator</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Systolic BP (mmHg)</label>
          <Input 
            type="number" 
            value={sbp || ''} 
            onChange={(e) => setSbp(Number(e.target.value))}
            className="bg-slate-900 border-slate-800 text-white rounded-xl font-bold h-11"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Diastolic BP (mmHg)</label>
          <Input 
            type="number" 
            value={dbp || ''} 
            onChange={(e) => setDbp(Number(e.target.value))}
            className="bg-slate-900 border-slate-800 text-white rounded-xl font-bold h-11"
          />
        </div>
      </div>

      <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex justify-between items-center px-6">
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Initial MAP</span>
        <span className="text-xl font-black text-white">{currentMap.toFixed(0)} <span className="text-xs opacity-50 font-medium">mmHg</span></span>
      </div>

      <div className="p-6 bg-red-600 rounded-[28px] border-2 border-red-400 shadow-lg text-center space-y-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        <span className="text-[10px] font-black text-red-100 uppercase tracking-widest relative z-10">Safe 24h MAP Target (25% Reduction)</span>
        <p className="text-5xl font-black text-white tracking-tighter relative z-10">
            {targetMap25.toFixed(0)} <span className="text-lg opacity-80 font-medium">mmHg</span>
        </p>
        <p className="text-[9px] font-bold text-red-100/70 italic relative z-10 uppercase tracking-tight">
            DO NOT reduce MAP by more than 25% in the first 24-48 hours.
        </p>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">Safety Directive</p>
        <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic">
          "Rapid BP reduction in chronic hypertension can cause cerebral infarction or vision loss. Transition to IV therapy ONLY if neurological symptoms are present."
        </p>
      </div>
    </div>
  );
}

function ChfManagementCalculator({ weight }: { weight?: number }) {
  // Holliday-Segar Maintenance
  const getMaintenance = (w: number) => {
    if (w <= 10) return 100 * w;
    if (w <= 20) return 1000 + 50 * (w - 10);
    return 1500 + 20 * (w - 20);
  };

  const dailyMaint = weight ? getMaintenance(weight) : 0;
  const restriction66 = dailyMaint * 0.66; // 2/3 Maintenance
  const furosemideLow = weight ? weight * 1 : 0;
  const furosemideHigh = weight ? weight * 2 : 0;

  return (
    <div className="p-5 bg-slate-950 text-white rounded-[32px] space-y-6 shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"><Calculator className="h-4 w-4" /></div>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/80">CHF Fluid & Diuretic Calculator</span>
        </div>
      </div>

      {!weight ? (
        <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
          <p className="text-xs font-bold text-slate-500">Please enter patient weight to calculate doses and limits.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fluid Restriction */}
            <div className="p-6 bg-blue-600 rounded-[28px] border-2 border-blue-400 shadow-lg text-center space-y-2">
              <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest">2/3 Fluid Restriction</span>
              <p className="text-4xl font-black text-white tracking-tighter">
                  {restriction66.toFixed(0)} <span className="text-sm opacity-60">mL/day</span>
              </p>
              <p className="text-[10px] font-bold text-blue-200 uppercase">{(restriction66/24).toFixed(1)} mL/hr</p>
            </div>

            {/* Diuretic Dose */}
            <div className="p-6 bg-slate-900 rounded-[28px] border-2 border-slate-800 text-center space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IV Furosemide (1-2 mg/kg)</span>
              <p className="text-3xl font-black text-white tracking-tighter">
                  {furosemideLow.toFixed(1)} - {furosemideHigh.toFixed(1)} <span className="text-sm opacity-60">mg</span>
              </p>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Per IV Dose</p>
            </div>
          </div>

          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Nursing Watch</p>
            <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic">
              "Maintain SpO2 {">"} 94%. Monitor for hypokalemia and rising creatinine during aggressive diuresis. Weigh the patient at exactly the same time every morning."
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function FreeWaterDeficitCalculator({ weight }: { weight?: number }) {
  const [serumNa, setSerumNa] = useState<number>(155);
  
  // Free Water Deficit = 0.6 * weight * ((Current Na / Target Na) - 1)
  // Target Na is usually 145 for the formula
  const deficitLiters = weight ? (0.6 * weight * ((serumNa / 145) - 1)) : 0;
  const deficitML = deficitLiters * 1000;
  const hourlyRate48h = deficitML / 48;
  const hourlyRate72h = deficitML / 72;

  return (
    <div className="p-5 bg-slate-950 text-white rounded-[32px] space-y-6 shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400"><Calculator className="h-4 w-4" /></div>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400/80">Free Water Deficit Calculator</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Patient Weight (kg)</label>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-amber-400">
            {weight ? `${weight} kg` : "Enter weight above"}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Current Serum Sodium (mmol/L)</label>
          <Input 
            type="number" 
            value={serumNa || ''} 
            onChange={(e) => setSerumNa(Number(e.target.value))}
            className="bg-slate-900 border-slate-800 text-white rounded-xl font-bold h-11"
            placeholder="e.g. 155"
          />
        </div>
      </div>

      {weight && (
        <>
          <div className="p-6 bg-amber-600 rounded-[28px] border-2 border-amber-400 shadow-lg text-center space-y-1">
            <span className="text-[10px] font-black text-amber-100 uppercase tracking-widest">Total Free Water Deficit</span>
            <p className="text-4xl font-black text-white tracking-tighter">
                {deficitML.toFixed(0)} <span className="text-lg opacity-80">mL</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-1">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">48h Replacement</span>
              <p className="text-xl font-black text-white">{hourlyRate48h.toFixed(1)} <span className="text-[10px] opacity-50">mL/hr</span></p>
            </div>
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-1">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">72h Replacement</span>
              <p className="text-xl font-black text-white">{hourlyRate72h.toFixed(1)} <span className="text-[10px] opacity-50">mL/hr</span></p>
            </div>
          </div>
        </>
      )}
      
      <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
        <p className="text-[10px] font-bold text-slate-500 italic leading-relaxed text-center uppercase tracking-tight">
          Goal: Correct slowly to prevent cerebral edema. Max drop 10-12 mmol/L per 24 hours.
        </p>
      </div>
    </div>
  );
}

function SiadhRestrictionCalculator({ weight }: { weight?: number }) {
  // Holliday-Segar Maintenance
  const getMaintenance = (w: number) => {
    if (w <= 10) return 100 * w;
    if (w <= 20) return 1000 + 50 * (w - 10);
    return 1500 + 20 * (w - 20);
  };

  const dailyMaint = weight ? getMaintenance(weight) : 0;
  const restriction50 = dailyMaint * 0.5;
  const restriction75 = dailyMaint * 0.75;

  return (
    <div className="p-5 bg-slate-950 text-white rounded-[32px] space-y-6 shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"><Calculator className="h-4 w-4" /></div>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/80">SIADH Fluid Restriction</span>
        </div>
      </div>

      {!weight ? (
        <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
          <p className="text-xs font-bold text-slate-500">Please enter patient weight to calculate restriction limits.</p>
        </div>
      ) : (
        <>
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex justify-between items-center px-6">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Maintenance</span>
            <span className="text-xl font-black text-white">{dailyMaint} <span className="text-xs opacity-50">mL/day</span></span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-amber-600/20 border-2 border-amber-500/40 rounded-[28px] text-center space-y-2">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">75% Restriction</span>
              <p className="text-3xl font-black text-white tracking-tighter">
                  {restriction75.toFixed(0)} <span className="text-sm opacity-60">mL/day</span>
              </p>
              <p className="text-[10px] font-bold text-amber-400/60 uppercase">{(restriction75/24).toFixed(1)} mL/hr</p>
            </div>

            <div className="p-6 bg-red-600/20 border-2 border-red-500/40 rounded-[28px] text-center space-y-2">
              <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">50% Restriction</span>
              <p className="text-3xl font-black text-white tracking-tighter">
                  {restriction50.toFixed(0)} <span className="text-sm opacity-60">mL/day</span>
              </p>
              <p className="text-[10px] font-bold text-red-400/60 uppercase">{(restriction50/24).toFixed(1)} mL/hr</p>
            </div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Clinical Directive</p>
            <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic">
              "Total fluid intake must include all oral fluids, IV fluids, medication volumes, and line flushes. Monitor weight twice daily to ensure effective restriction."
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function TitrationRow({ label, b1, b2, total }: { label: string, b1: number, b2: number, total: number }) {
  const v1 = (total * (b1 / 100)).toFixed(1);
  const v2 = (total * (b2 / 100)).toFixed(1);
  
  return (
    <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-950/50 border border-slate-800/50">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-black text-slate-300">{label}</span>
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Total: {total.toFixed(1)} mL/hr</span>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 flex justify-between items-center p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <span className="text-[9px] font-bold text-slate-500">BAG 1</span>
          <span className="text-[11px] font-black text-blue-400">{v1} <span className="opacity-50 font-medium">mL/hr</span></span>
        </div>
        <div className="flex-1 flex justify-between items-center p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <span className="text-[9px] font-bold text-slate-500">BAG 2</span>
          <span className="text-[11px] font-black text-amber-400">{v2} <span className="opacity-50 font-medium">mL/hr</span></span>
        </div>
      </div>
    </div>
  );
}

function AdrenalStressDoseCalculator({ weight }: { weight?: number }) {
  // Rescue dose logic based on weight brackets
  const getRescueDose = (w: number) => {
    if (w < 5) return "25 mg";
    if (w < 15) return "50 mg";
    return "100 mg";
  };

  const dose = weight ? getRescueDose(weight) : null;

  return (
    <div className="p-5 bg-slate-900 text-white rounded-[32px] space-y-5 shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
           <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"><Calculator className="h-4 w-4" /></div>
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hydrocortisone Stress Dose Calculator</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Patient Weight (kg)</label>
          <div className="p-3 bg-slate-800 rounded-xl text-sm font-bold text-blue-400">
            {weight ? `${weight} kg` : "Please enter weight in the main section"}
          </div>
        </div>

        <div className="p-6 bg-blue-600 rounded-[28px] border-2 border-blue-400 shadow-lg text-center space-y-2">
            <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Recommended Rescue Dose</span>
            <p className="text-4xl font-black text-white tracking-tighter">
                {dose || "?? mg"}
            </p>
            <p className="text-[10px] font-bold text-blue-200 italic">
                (Administer Intravenous or Intramuscular IMMEDIATELY)
            </p>
        </div>
      </div>
      
      <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 space-y-3">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-700/50 pb-2">Reference Dosing Brackets</p>
        <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-center">
            <div className="space-y-1"><p className="text-slate-500 uppercase tracking-tighter">Infants {"<"} 5kg</p><p className="text-white bg-slate-800 py-1 rounded-lg">25 mg</p></div>
            <div className="space-y-1"><p className="text-slate-500 uppercase tracking-tighter">Child 5-15kg</p><p className="text-white bg-slate-800 py-1 rounded-lg">50 mg</p></div>
            <div className="space-y-1"><p className="text-slate-500 uppercase tracking-tighter">Adult {">"} 15kg</p><p className="text-white bg-slate-800 py-1 rounded-lg">100 mg</p></div>
        </div>
      </div>
    </div>
  );
}

function DextroseBolusCalculator({ weight }: { weight?: number }) {
  // Dextrose 10% bolus calculation (5 mL/kg)
  const bolusVolume = weight ? weight * 5 : 0;

  return (
    <div className="p-5 bg-slate-900 text-white rounded-[32px] space-y-5 shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
           <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"><Calculator className="h-4 w-4" /></div>
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dextrose Bolus Calculator</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Patient Weight (kg)</label>
          <div className="p-3 bg-slate-800 rounded-xl text-sm font-bold text-blue-400">
            {weight ? `${weight} kg` : "Please enter weight in the main section"}
          </div>
        </div>

        <div className="p-6 bg-amber-500 rounded-[28px] border-2 border-amber-400 shadow-lg text-center space-y-2">
            <span className="text-[10px] font-black text-amber-100 uppercase tracking-widest">Recommended 10% Dextrose Bolus</span>
            <p className="text-4xl font-black text-white tracking-tighter">
                {bolusVolume || "??"} <span className="text-lg">mL</span>
            </p>
            <p className="text-[10px] font-bold text-amber-100 italic">
                (Dose: 5 mL/kg of D10W)
            </p>
        </div>
      </div>
      
      <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
        <p className="text-[10px] font-bold text-slate-400 italic leading-relaxed">
          * Safety Note: Always use 10% Dextrose (D10W) in neonates and young infants. In older children with large central access, 25% Dextrose (2 mL/kg) may be considered, but D10W is preferred for peripheral safety.
        </p>
      </div>
    </div>
  );
}

function GirCalculator({ weight }: { weight?: number }) {
  const [ivRate, setIvRate] = useState<number>(0);
  const [dextroseConc, setDextroseConc] = useState<number>(10);
  
  // GIR = (Rate * Dextrose%) / (6 * Weight)
  const gir = (weight && weight > 0) ? (ivRate * dextroseConc) / (6 * weight) : 0;

  return (
    <div className="p-5 bg-slate-900 text-white rounded-[32px] space-y-5 shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
           <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"><Calculator className="h-4 w-4" /></div>
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Glucose Infusion Rate (GIR) Calculator</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Patient Weight (kg)</label>
          <div className="p-3 bg-slate-800 rounded-xl text-sm font-bold text-blue-400">
            {weight ? `${weight} kg` : "Please enter weight in the main section"}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">IV Fluid Rate (mL/hr)</label>
                <Input 
                    type="number" 
                    value={ivRate || ''} 
                    onChange={(e) => setIvRate(Number(e.target.value))}
                    className="bg-slate-800 border-slate-700 text-white rounded-xl font-bold h-11"
                    placeholder="e.g. 50"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Dextrose Conc. (%)</label>
                <Input 
                    type="number" 
                    value={dextroseConc || ''} 
                    onChange={(e) => setDextroseConc(Number(e.target.value))}
                    className="bg-slate-800 border-slate-700 text-white rounded-xl font-bold h-11"
                    placeholder="e.g. 10"
                />
            </div>
        </div>

        <div className="p-6 bg-blue-600 rounded-[28px] border-2 border-blue-400 shadow-lg text-center space-y-1">
            <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Calculated GIR</span>
            <p className="text-4xl font-black text-white tracking-tighter">
                {gir.toFixed(1)} <span className="text-xs opacity-70">mg/kg/min</span>
            </p>
        </div>
      </div>
      
      <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 space-y-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-700/50 pb-2">Target Ranges</p>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-center">
            <div className="space-y-1"><p className="text-slate-500">Neonate/Infant</p><p className="text-white">6 - 8 mg/kg/min</p></div>
            <div className="space-y-1"><p className="text-slate-500">Child/Adolescent</p><p className="text-white">2 - 4 mg/kg/min</p></div>
        </div>
      </div>
    </div>
  );
}
