import { useState, useMemo } from 'react';
import { Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

function parseNum(s: string): number | null {
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

/**
 * Small embeddable arterial MAP and CPP calculator.
 * MAP ≈ DBP + ⅓(SBP − DBP);  CPP = MAP − ICP.
 */
type AgeGroup = 'infant' | 'child' | 'adolescent';

const CPP_TARGETS: Record<AgeGroup, { min: number; label: string; ref: string }> = {
  infant:     { min: 40, label: '≥ 40 mmHg (infant < 2 yr)',      ref: 'Pediatric TBI Foundation 2019' },
  child:      { min: 50, label: '≥ 50 mmHg (child 2–12 yr)',      ref: 'Pediatric TBI Foundation 2019' },
  adolescent: { min: 60, label: '≥ 60 mmHg (adolescent ≥ 12 yr)', ref: 'Pediatric TBI Foundation 2019' },
};

export function MapCppCalculator() {
  const [sbp, setSbp] = useState('');
  const [dbp, setDbp] = useState('');
  const [icp, setIcp] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('child');

  const map = useMemo(() => {
    const s = parseNum(sbp), d = parseNum(dbp);
    if (s === null || d === null) return null;
    return d + (s - d) / 3;
  }, [sbp, dbp]);

  const cpp = useMemo(() => {
    const i = parseNum(icp);
    if (map === null || i === null) return null;
    return map - i;
  }, [map, icp]);

  const target = CPP_TARGETS[ageGroup];
  const cppLow = cpp !== null && cpp < target.min;

  const F = ({ label, v, set, ph }: { label: string; v: string; set: (s: string) => void; ph: string }) => (
    <div className="space-y-1">
      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</label>
      <div className="relative">
        <input type="number" inputMode="decimal" placeholder={ph} value={v} onChange={(e) => set(e.target.value)}
          className="w-full h-10 px-3 pr-12 rounded-xl bg-slate-900 border border-slate-800 text-white font-black text-sm" />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-500 uppercase">mmHg</span>
      </div>
    </div>
  );

  return (
    <div className="p-5 bg-slate-950 text-white rounded-[28px] space-y-4 border border-slate-800 shadow-2xl">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-violet-500/20 text-violet-400"><Calculator className="h-4 w-4" /></div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400/80">MAP &amp; CPP Calculator</span>
      </div>

      {/* Age group selector */}
      <div className="space-y-1">
        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Age group (sets CPP target)</label>
        <div className="grid grid-cols-3 gap-1.5">
          {(['infant', 'child', 'adolescent'] as AgeGroup[]).map((g) => (
            <button key={g} onClick={() => setAgeGroup(g)}
              className={cn('py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all',
                ageGroup === g ? 'bg-violet-500/20 border-violet-500 text-violet-200' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700')}>
              {g === 'infant' ? '< 2 yr' : g === 'child' ? '2–12 yr' : '≥ 12 yr'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <F label="Systolic (SBP)" v={sbp} set={setSbp} ph="100" />
        <F label="Diastolic (DBP)" v={dbp} set={setDbp} ph="60" />
        <F label="ICP (optional)" v={icp} set={setIcp} ph="15" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-center">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Mean arterial pressure</span>
          <p className="text-2xl font-black tracking-tighter text-violet-300">{map !== null ? map.toFixed(0) : '—'} <span className="text-xs text-slate-600">mmHg</span></p>
        </div>
        <div className={cn('p-3 bg-slate-900 rounded-2xl border text-center', cppLow ? 'border-red-700' : 'border-slate-800')}>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">CPP = MAP − ICP</span>
          <p className={cn('text-2xl font-black tracking-tighter', cppLow ? 'text-red-300' : cpp !== null ? 'text-emerald-300' : 'text-slate-600')}>{cpp !== null ? cpp.toFixed(0) : '—'} <span className="text-xs text-slate-600">mmHg</span></p>
          {cpp !== null && <span className={cn('text-[9px] font-bold', cppLow ? 'text-red-400' : 'text-emerald-400')}>{cppLow ? `BELOW target (${target.min})` : `≥ target (${target.min})`}</span>}
        </div>
      </div>
      <p className="text-[9px] font-bold text-slate-500 italic">MAP ≈ DBP + ⅓(SBP − DBP). CPP target: {target.label}. {target.ref}. Enter ICP to compute CPP.</p>
    </div>
  );
}
