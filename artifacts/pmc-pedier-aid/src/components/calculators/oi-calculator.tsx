import { useState, useMemo } from 'react';
import { Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

function parseNum(s: string): number | null {
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

/**
 * Small embeddable Oxygenation Index / OSI calculator.
 * OI  = (mean airway pressure × FiO₂%) ÷ PaO₂
 * OSI = (mean airway pressure × FiO₂%) ÷ SpO₂
 */
export function OICalculator() {
  const [map, setMap] = useState('');
  const [fio2, setFio2] = useState('');
  const [pao2, setPao2] = useState('');
  const [spo2, setSpo2] = useState('');

  const oi = useMemo(() => {
    const m = parseNum(map), f = parseNum(fio2), p = parseNum(pao2);
    if (m === null || f === null || p === null || p === 0) return null;
    return (f * m) / p;
  }, [map, fio2, pao2]);

  const osi = useMemo(() => {
    const m = parseNum(map), f = parseNum(fio2), s = parseNum(spo2);
    if (m === null || f === null || s === null || s === 0) return null;
    return (f * m) / s;
  }, [map, fio2, spo2]);

  const band = (v: number | null) => {
    if (v === null) return null;
    if (v < 4) return { t: 'Sub-threshold', c: 'text-slate-300' };
    if (v < 8) return { t: 'Mild', c: 'text-emerald-300' };
    if (v < 16) return { t: 'Moderate', c: 'text-amber-300' };
    return { t: 'Severe', c: 'text-red-300' };
  };
  const oiBand = band(oi);

  const F = ({ label, v, set, unit, ph }: { label: string; v: string; set: (s: string) => void; unit: string; ph: string }) => (
    <div className="space-y-1">
      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</label>
      <div className="relative">
        <input type="number" inputMode="decimal" placeholder={ph} value={v} onChange={(e) => set(e.target.value)}
          className="w-full h-10 px-3 pr-12 rounded-xl bg-slate-900 border border-slate-800 text-white font-black text-sm" />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-500 uppercase">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="p-5 bg-slate-950 text-white rounded-[28px] space-y-4 border border-slate-800 shadow-2xl">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"><Calculator className="h-4 w-4" /></div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/80">Oxygenation Index (OI / OSI)</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <F label="Mean airway pressure" v={map} set={setMap} unit="cmH₂O" ph="14" />
        <F label="FiO₂" v={fio2} set={setFio2} unit="%" ph="60" />
        <F label="PaO₂ (for OI)" v={pao2} set={setPao2} unit="mmHg" ph="60" />
        <F label="SpO₂ (for OSI)" v={spo2} set={setSpo2} unit="%" ph="90" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-center">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">OI</span>
          <p className={cn('text-2xl font-black tracking-tighter', oiBand?.c ?? 'text-slate-600')}>{oi !== null ? oi.toFixed(1) : '—'}</p>
          {oiBand && <span className={cn('text-[9px] font-black uppercase', oiBand.c)}>{oiBand.t} PARDS</span>}
        </div>
        <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-center">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">OSI</span>
          <p className="text-2xl font-black tracking-tighter text-blue-300">{osi !== null ? osi.toFixed(1) : '—'}</p>
          <span className="text-[9px] font-bold text-slate-600">non-invasive surrogate</span>
        </div>
      </div>
      <p className="text-[9px] font-bold text-slate-500 italic">OI = (FiO₂% × mean airway pressure) ÷ PaO₂. PARDS (PALICC-2): mild 4–8, moderate 8–16, severe ≥ 16. OI ≥ 16–25 despite optimisation → consider HFOV/ECMO.</p>
    </div>
  );
}
