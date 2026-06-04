import { useState } from "react";
import { AlertTriangle, Activity, ArrowRight, Zap, ChevronDown, Stethoscope } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DopesItem {
  letter: string;
  title: string;
  detect: string;
  action: string;
}

const DOPES: DopesItem[] = [
  { letter: "D", title: "Displacement", detect: "ETT too deep / right main / dislodged / extubated. Asymmetric chest rise, EtCO₂ loss.", action: "Check tube depth & EtCO₂ trace; auscultate; pull back if endobronchial; re-intubate if displaced." },
  { letter: "O", title: "Obstruction", detect: "Kinked tube, mucus plug, biting. High peak pressure, poor chest rise, unable to pass suction catheter.", action: "Pass suction catheter; suction secretions; check for kink/bite block; consider tube change if blocked." },
  { letter: "P", title: "Pneumothorax", detect: "Sudden desaturation + high pressures, unilateral absent breath sounds, tracheal shift, hypotension.", action: "If tension — needle/finger decompression NOW, then chest drain (see Pneumothorax pathway)." },
  { letter: "E", title: "Equipment", detect: "Circuit disconnection/leak, ventilator failure, empty O₂, wrong settings, exhausted gas.", action: "Disconnect and hand-ventilate with BVM on 100% O₂; check circuit, gas supply, and ventilator." },
  { letter: "S", title: "Stacking (breath stacking)", detect: "Air trapping / auto-PEEP, esp. obstructive disease. Rising pressures, ↓ venous return, hypotension.", action: "Disconnect to allow full exhalation; reduce rate / I:E; treat bronchospasm; lower tidal volume." },
];

/**
 * PICU — Ventilator troubleshooting (DOPES).
 * Bespoke interactive responder for acute deterioration in a ventilated child.
 * Rendered via disease.tsx special-casing ('picu-vent-troubleshooting').
 */
export function VentTroubleshootingProtocol() {
  const [open, setOpen] = useState<string | null>("D");

  return (
    <div className="space-y-6">
      {/* IMMEDIATE ACTION */}
      <Card className="rounded-[28px] border-2 border-red-200 bg-red-50/40">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-600 text-white"><Zap className="h-5 w-5" /></div>
            <h3 className="text-base font-black uppercase tracking-tight text-red-800">Acute deterioration — first move</h3>
          </div>
          <p className="text-sm font-bold text-red-900 leading-relaxed">
            Any ventilated child who acutely desaturates or develops high airway pressures: <span className="underline">DISCONNECT from the ventilator and hand-ventilate with a bag-valve on 100% O₂</span>. This instantly separates patient problems (D, O, P, S) from machine/circuit problems (E) and is therapeutic for breath-stacking.
          </p>
          <div className="flex flex-wrap gap-2">
            {DOPES.map((d) => (
              <Badge key={d.letter} className="bg-red-600 text-white border-none font-black text-sm px-3 py-1">{d.letter}</Badge>
            ))}
            <span className="text-xs font-black uppercase tracking-widest text-red-700 self-center">= work through each</span>
          </div>
        </CardContent>
      </Card>

      {/* DOPES ACCORDION */}
      <div className="space-y-3">
        {DOPES.map((d) => (
          <Card key={d.letter} className={cn("rounded-[24px] border-2 overflow-hidden transition-all", open === d.letter ? "border-primary/30" : "border-slate-100")}>
            <button className="w-full flex items-center gap-4 p-4 text-left" onClick={() => setOpen(open === d.letter ? null : d.letter)}>
              <span className="w-10 h-10 rounded-2xl bg-slate-900 text-white text-lg font-black flex items-center justify-center shrink-0">{d.letter}</span>
              <span className="flex-1 font-black text-base tracking-tight">{d.title}</span>
              <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", open === d.letter && "rotate-180")} />
            </button>
            {open === d.letter && (
              <CardContent className="px-4 pb-5 pt-0 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-1 flex items-center gap-1.5"><Activity className="h-3.5 w-3.5" /> Detect</p>
                  <p className="text-sm font-bold text-slate-800 leading-snug">{d.detect}</p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-1 flex items-center gap-1.5"><ArrowRight className="h-3.5 w-3.5" /> Action</p>
                  <p className="text-sm font-bold text-slate-800 leading-snug">{d.action}</p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* PEAK vs PLATEAU */}
      <Card className="rounded-[28px] border-2">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-700">
            <Stethoscope className="h-4 w-4 text-primary" /> High pressure alarm — peak vs plateau
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-700">High PEAK, normal plateau</p>
              <p className="text-sm font-bold text-slate-800 leading-snug">Airway / resistance problem — secretions, kink, bronchospasm, biting, small/blocked tube.</p>
              <p className="text-xs font-bold text-blue-700">→ Suction, unkink, bronchodilator, check tube.</p>
            </div>
            <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-violet-700">High PEAK and plateau</p>
              <p className="text-sm font-bold text-slate-800 leading-snug">Compliance problem — pneumothorax, endobronchial tube, atelectasis, ARDS, abdominal distension, stacking.</p>
              <p className="text-xs font-bold text-violet-700">→ Exclude pneumothorax, check tube depth, reduce Vt, treat cause.</p>
            </div>
          </div>
          <p className="text-[11px] font-bold text-muted-foreground italic">Check the plateau pressure with an inspiratory hold to separate resistance (peak) from compliance (plateau) problems.</p>
        </CardContent>
      </Card>

      {/* REFERENCE */}
      <a href="https://litfl.com/ventilator-dyssynchrony/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 hover:border-blue-300 hover:bg-white transition-all group">
        <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">Ventilated patient — acute deterioration & dyssynchrony (reference)</span>
        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500" />
      </a>
    </div>
  );
}
