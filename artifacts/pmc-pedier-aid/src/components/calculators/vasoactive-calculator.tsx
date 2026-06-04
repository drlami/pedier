import { useState } from 'react';
import { Calculator, Droplet, Activity, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type ShockType = 'cold' | 'warm' | 'cardiogenic';

interface Agent {
  name: string;
  min: number; // mcg/kg/min (or milliunits/kg/min for vasopressin)
  max: number;
  unit: string; // 'mcg/kg/min' | 'mU/kg/min'
  tags: ShockType[];
  note: string;
}

const AGENTS: Agent[] = [
  { name: 'Epinephrine (adrenaline)', min: 0.05, max: 1, unit: 'mcg/kg/min', tags: ['cold'], note: 'First-line cold shock; inotrope + vasoconstrictor as dose rises.' },
  { name: 'Norepinephrine', min: 0.05, max: 1, unit: 'mcg/kg/min', tags: ['warm'], note: 'First-line warm/vasodilated shock — restores SVR.' },
  { name: 'Dopamine', min: 5, max: 20, unit: 'mcg/kg/min', tags: ['cold', 'warm'], note: 'Alternative when epi/norepi unavailable; less preferred.' },
  { name: 'Dobutamine', min: 5, max: 20, unit: 'mcg/kg/min', tags: ['cardiogenic', 'cold'], note: 'Inotrope for poor contractility with adequate BP.' },
  { name: 'Milrinone', min: 0.25, max: 0.75, unit: 'mcg/kg/min', tags: ['cardiogenic'], note: 'Inodilator — improves CO; can drop SVR/BP. Caution in renal impairment.' },
  { name: 'Vasopressin', min: 0.17, max: 0.83, unit: 'mU/kg/min', tags: ['warm'], note: 'Catecholamine-resistant vasodilatory shock (adjunct).' },
];

/**
 * PICU Vasoactive / inotrope infusion calculator.
 * Weight from the pathway weight box. Decision support only — verify against
 * local standard-concentration policy before preparing infusions.
 */
export function VasoactiveCalculator({ weight }: { weight?: number }) {
  const [shock, setShock] = useState<ShockType>('cold');

  if (!weight) {
    return (
      <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
        <p className="text-xs font-bold text-slate-500">Enter patient weight in the pathway weight box to calculate fluid and vasoactive doses.</p>
      </div>
    );
  }

  const w = weight;
  const fmt = (n: number) => (n >= 100 ? n.toFixed(0) : n >= 10 ? n.toFixed(1) : n.toFixed(2));

  const shockMeta: Record<ShockType, { label: string; desc: string }> = {
    cold: { label: 'Cold shock', desc: 'low output — cool, mottled, weak pulses, ↑ cap refill' },
    warm: { label: 'Warm shock', desc: 'vasodilated — flash refill, bounding pulses, wide pulse pressure' },
    cardiogenic: { label: 'Cardiogenic', desc: 'poor contractility — hepatomegaly, gallop, ↑ work of breathing' },
  };

  return (
    <div className="p-5 bg-slate-950 text-white rounded-[32px] space-y-6 shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"><Calculator className="h-4 w-4" /></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/80">Vasoactive Infusion Calculator</span>
        </div>
        <Badge className="bg-blue-600 text-white border-none">{w} kg</Badge>
      </div>

      {/* FLUID BOLUS */}
      <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplet className="h-4 w-4 text-cyan-400" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fluid bolus (reassess after each)</span>
        </div>
        <span className="text-xl font-black text-cyan-300">{(10 * w).toFixed(0)}–{(20 * w).toFixed(0)} mL <span className="text-[10px] text-slate-500">(10–20 mL/kg)</span></span>
      </div>

      {/* SHOCK TYPE */}
      <div className="space-y-2">
        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Shock phenotype (highlights first-line agent)</label>
        <div className="grid grid-cols-3 gap-2">
          {(['cold', 'warm', 'cardiogenic'] as ShockType[]).map((s) => (
            <button key={s} onClick={() => setShock(s)}
              className={cn('py-2.5 rounded-xl text-[10px] font-black transition-all border-2',
                shock === s ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700')}>
              {shockMeta[s].label}
            </button>
          ))}
        </div>
        <p className="text-[10px] font-bold text-slate-500 italic px-1">{shockMeta[shock].desc}</p>
      </div>

      {/* AGENTS */}
      <div className="space-y-3">
        {AGENTS.map((a) => {
          const recommended = a.tags.includes(shock);
          const startMcgMin = a.min * w;
          const maxMcgMin = a.max * w;
          return (
            <div key={a.name} className={cn('p-4 rounded-2xl border-2 transition-all',
              recommended ? 'bg-blue-950/40 border-blue-600' : 'bg-slate-900 border-slate-800')}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Activity className={cn('h-4 w-4', recommended ? 'text-blue-300' : 'text-slate-500')} />
                  <span className="text-sm font-black text-white">{a.name}</span>
                </div>
                {recommended && <Badge className="bg-blue-600 text-white border-none text-[9px] font-black tracking-widest">FIRST-LINE</Badge>}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="p-2.5 bg-slate-950/60 rounded-xl text-center">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Start ({a.min} {a.unit})</span>
                  <p className="text-base font-black text-emerald-300">{fmt(startMcgMin)} <span className="text-[9px] text-slate-500">{a.unit.replace('/kg', '')}</span></p>
                </div>
                <div className="p-2.5 bg-slate-950/60 rounded-xl text-center">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Max ({a.max} {a.unit})</span>
                  <p className="text-base font-black text-amber-300">{fmt(maxMcgMin)} <span className="text-[9px] text-slate-500">{a.unit.replace('/kg', '')}</span></p>
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 italic mt-2">{a.note}</p>
            </div>
          );
        })}
      </div>

      {/* RULE OF 6 PREP HELPER */}
      <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-violet-400" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Infusion prep — "rule of 6" (weight-based bag)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-slate-950/60 rounded-xl space-y-1">
            <span className="text-[9px] font-black text-blue-300 uppercase tracking-widest">Epi / Norepi (potent)</span>
            <p className="text-sm font-bold text-white">{(0.6 * w).toFixed(1)} mg in 100 mL</p>
            <p className="text-[10px] font-bold text-slate-500">→ 1 mL/hr = 0.1 mcg/kg/min</p>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl space-y-1">
            <span className="text-[9px] font-black text-amber-300 uppercase tracking-widest">Dopamine / Dobutamine</span>
            <p className="text-sm font-bold text-white">{(6 * w).toFixed(0)} mg in 100 mL</p>
            <p className="text-[10px] font-bold text-slate-500">→ 1 mL/hr = 1 mcg/kg/min</p>
          </div>
        </div>
        <p className="text-[10px] font-bold text-amber-400/80 italic">
          Weight-based concentrations are one option; many units use ISMP standard concentrations. Always verify against local policy and double-check with a second nurse.
        </p>
      </div>
    </div>
  );
}
