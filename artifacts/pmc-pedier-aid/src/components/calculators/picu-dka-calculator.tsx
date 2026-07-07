import { useState } from 'react';
import { Calculator, Droplet, Syringe, AlertTriangle, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type KLevel = 'low' | 'normal' | 'high';
type Deficit = 5 | 7 | 10;
type HaemoStatus = 'stable' | 'mild-shock' | 'severe-shock';

function dailyMaintenance(w: number): number {
  if (w <= 10) return 100 * w;
  if (w <= 20) return 1000 + 50 * (w - 10);
  // Cap at 3 L/day for larger adolescents per ISPAD 2022 (previously 2.4 L)
  return Math.min(1500 + 20 * (w - 20), 3000);
}

function TitrationRow({ label, b1, b2, total }: { label: string; b1: number; b2: number; total: number }) {
  return (
    <div className="flex items-center justify-between gap-2 text-[11px] font-bold">
      <span className="text-slate-400 flex-1">{label}</span>
      <span className="text-blue-400 w-20 text-right">{((total * b1) / 100).toFixed(1)} <span className="text-slate-600">B1</span></span>
      <span className="text-amber-400 w-20 text-right">{((total * b2) / 100).toFixed(1)} <span className="text-slate-600">B2</span></span>
    </div>
  );
}

/**
 * PICU DKA — interactive fluid, potassium, mixing and insulin calculator.
 * Based on ISPAD 2022 / BSPED DKA principles. Weight comes from the pathway's
 * shared weight input. All figures are decision support — verify locally.
 */
export function PicuDkaCalculator({ weight }: { weight?: number }) {
  const [kLevel, setKLevel] = useState<KLevel>('normal');
  const [deficit, setDeficit] = useState<Deficit>(7);
  const [haemo, setHaemo] = useState<HaemoStatus>('stable');

  if (!weight) {
    return (
      <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
        <p className="text-xs font-bold text-slate-500">Enter patient weight in the pathway weight box to calculate DKA fluids and insulin.</p>
      </div>
    );
  }

  const w = weight;
  // ISPAD 2022: routine fluid boluses are NOT recommended in haemodynamically stable DKA
  // (prior concern that large early boluses increase cerebral oedema risk).
  // Give only if shocked: 5–10 mL/kg (mild) or 10–20 mL/kg (severe/circulatory failure).
  const bolusMin = haemo === 'stable' ? 0 : haemo === 'mild-shock' ? 5 * w : 10 * w;
  const bolusMax = haemo === 'stable' ? 0 : haemo === 'mild-shock' ? 10 * w : 20 * w;
  const deficitVol = deficit * w * 10; // % × 10 mL/kg
  const maint = dailyMaintenance(w);
  // ISPAD: deficit + maintenance evenly over 48 h (boluses generally not subtracted if ≤ 20 mL/kg)
  const totalRate = (deficitVol + maint * 2) / 48;

  // Insulin (prep 50 units regular insulin in 50 mL 0.9% NaCl = 1 unit/mL → mL/hr == units/hr)
  const ins05 = 0.05 * w;
  const ins10 = 0.1 * w;

  const kInfo: Record<KLevel, { label: string; per500: string; note: string; tone: string }> = {
    low: {
      label: 'LOW (< 3.5)',
      per500: '20 mmol KCl / 500 mL (40 mmol/L)',
      note: 'Replace K BEFORE/with insulin. If K < 3.0–3.3, DELAY insulin until K rising and give KCl first.',
      tone: 'text-red-400',
    },
    normal: {
      label: 'NORMAL (3.5–5.5)',
      per500: '20 mmol KCl / 500 mL (40 mmol/L)',
      note: 'Add potassium once the child is passing urine. Standard 40 mmol/L in both bags.',
      tone: 'text-emerald-400',
    },
    high: {
      label: 'HIGH (> 5.5)',
      per500: 'NO potassium yet',
      note: 'Withhold K until level falls and urine output is established; recheck K in 1–2 h then add.',
      tone: 'text-blue-400',
    },
  };
  const k = kInfo[kLevel];

  return (
    <div className="p-5 bg-slate-950 text-white rounded-[32px] space-y-6 shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"><Calculator className="h-4 w-4" /></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/80">DKA Fluid &amp; Insulin Calculator</span>
        </div>
        <Badge className="bg-blue-600 text-white border-none">{w} kg</Badge>
      </div>

      {/* INPUTS */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Haemodynamic status (ISPAD 2022 bolus guide)</label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { v: 'stable',      label: 'Stable',       sub: 'no bolus' },
              { v: 'mild-shock',  label: 'Mild shock',   sub: '5–10 mL/kg' },
              { v: 'severe-shock',label: 'Severe shock', sub: '10–20 mL/kg' },
            ] as { v: HaemoStatus; label: string; sub: string }[]).map(({ v, label, sub }) => (
              <button key={v} onClick={() => setHaemo(v)}
                className={cn('py-2.5 rounded-xl text-[10px] font-black transition-all border-2 flex flex-col items-center gap-0.5',
                  haemo === v
                    ? (v === 'severe-shock' ? 'bg-red-500/20 border-red-500 text-red-300' : v === 'mild-shock' ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-emerald-500/20 border-emerald-500 text-emerald-300')
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700')}>
                {label}
                <span className="text-[8px] opacity-70">{sub}</span>
              </button>
            ))}
          </div>
          <p className="text-[9px] font-bold text-slate-500 italic px-1">ISPAD 2022: no routine bolus in stable DKA. Give 0.9% saline only if haemodynamically compromised.</p>
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Estimated dehydration (deficit)</label>
          <div className="grid grid-cols-3 gap-2">
            {([5, 7, 10] as Deficit[]).map((d) => (
              <button key={d} onClick={() => setDeficit(d)}
                className={cn('py-2.5 rounded-xl text-[10px] font-black transition-all border-2',
                  deficit === d ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700')}>
                {d}% {d === 5 ? '(mild)' : d === 7 ? '(mod)' : '(severe)'}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Serum potassium</label>
          <div className="grid grid-cols-3 gap-2">
            {(['low', 'normal', 'high'] as KLevel[]).map((lvl) => (
              <button key={lvl} onClick={() => setKLevel(lvl)}
                className={cn('py-2.5 rounded-xl text-[10px] font-black transition-all border-2',
                  kLevel === lvl
                    ? (lvl === 'low' ? 'bg-red-500/20 border-red-500 text-red-400' : lvl === 'normal' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-blue-500/20 border-blue-500 text-blue-400')
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700')}>
                {kInfo[lvl].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STEP 1: RESUS BOLUS */}
      <div className={cn('p-4 rounded-2xl border flex items-center justify-between', haemo === 'stable' ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-900 border-cyan-800')}>
        <div className="flex items-center gap-2">
          <Droplet className={cn('h-4 w-4', haemo === 'stable' ? 'text-slate-500' : 'text-cyan-400')} />
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">1 · Initial bolus (0.9% saline)</span>
            {haemo === 'stable' && <span className="text-[9px] font-bold text-slate-500 italic">ISPAD 2022: omit bolus if haemodynamically stable</span>}
          </div>
        </div>
        {haemo === 'stable'
          ? <span className="text-lg font-black text-slate-500">No bolus</span>
          : <span className="text-xl font-black text-cyan-300">{bolusMin.toFixed(0)}–{bolusMax.toFixed(0)} mL <span className="text-[10px] text-slate-500">({haemo === 'mild-shock' ? '5–10' : '10–20'} mL/kg)</span></span>}
      </div>

      {/* STEP 2: TOTAL RATE */}
      <div className="p-6 bg-blue-600 rounded-[28px] border-2 border-blue-400 shadow-lg text-center space-y-1">
        <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest">2 · Total maintenance + deficit rate</span>
        <p className="text-5xl font-black text-white tracking-tighter">{totalRate.toFixed(1)} <span className="text-lg opacity-80">mL/hr</span></p>
        <p className="text-[9px] font-bold text-blue-100/70 italic">
          ({deficit}% deficit {deficitVol.toFixed(0)} mL + 48 h maintenance {(maint * 2).toFixed(0)} mL) ÷ 48 h · boluses not subtracted if ≤ 20 mL/kg
        </p>
      </div>

      {/* STEP 3: HOW TO MIX (TWO BAGS) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <FlaskConical className="h-4 w-4 text-emerald-400" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3 · How to mix — two-bag system</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-slate-900 rounded-[24px] border-2 border-slate-800 space-y-2.5">
            <h4 className="text-[11px] font-black uppercase tracking-wider flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-400" /> Bag 1 — no dextrose</h4>
            <ul className="text-[11px] font-bold text-slate-400 space-y-2">
              <li>● 500 mL 0.9% NaCl</li>
              <li className={cn('p-2 rounded-lg bg-slate-950/50 border border-slate-800/50', k.tone)}>✚ {k.per500}</li>
            </ul>
          </div>
          <div className="p-5 bg-slate-900 rounded-[24px] border-2 border-slate-800 space-y-2.5">
            <h4 className="text-[11px] font-black uppercase tracking-wider flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400" /> Bag 2 — 10% dextrose</h4>
            <ul className="text-[11px] font-bold text-slate-400 space-y-2">
              <li>● 500 mL D10 in 0.9% NaCl</li>
              <li className={cn('p-2 rounded-lg bg-slate-950/50 border border-slate-800/50', k.tone)}>✚ {k.per500}</li>
            </ul>
          </div>
        </div>
        <p className="text-[10px] font-bold text-slate-500 italic px-1">
          Both bags run into the same line; the COMBINED rate stays {totalRate.toFixed(1)} mL/hr. Shift the ratio by glucose (below). {k.note}
        </p>
      </div>

      {/* STEP 4: TITRATION */}
      <div className="p-6 bg-slate-900 rounded-[28px] border border-slate-800 space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2">4 · Titrate ratio by blood glucose (mL/hr)</h4>
        <TitrationRow label="Glucose > 300 mg/dL" b1={100} b2={0} total={totalRate} />
        <TitrationRow label="Glucose 250–300 mg/dL" b1={75} b2={25} total={totalRate} />
        <TitrationRow label="Glucose 200–250 mg/dL" b1={50} b2={50} total={totalRate} />
        <TitrationRow label="Glucose 150–200 mg/dL" b1={25} b2={75} total={totalRate} />
        <TitrationRow label="Glucose < 150 mg/dL" b1={0} b2={100} total={totalRate} />
        <p className="text-[10px] font-bold text-amber-400/80 italic pt-1">If glucose still &lt; 150 on 100% Bag 2, increase dextrose to 12.5% — DO NOT stop insulin.</p>
        <p className="text-[10px] font-bold text-blue-300/80 italic pt-1">Target glucose fall rate: 2–3 mmol/L/hr (36–54 mg/dL/hr). Faster fall may increase cerebral oedema risk — do not chase rapid normalisation.</p>
      </div>

      {/* STEP 5: INSULIN */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Syringe className="h-4 w-4 text-violet-400" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">5 · Insulin infusion (start 1–2 h after fluids)</span>
        </div>
        <div className="p-4 bg-violet-950/40 rounded-2xl border border-violet-800/50 space-y-1">
          <p className="text-[10px] font-black text-violet-300 uppercase tracking-widest">Prepare</p>
          <p className="text-sm font-bold text-white">50 units regular (soluble) insulin in 50 mL 0.9% NaCl → <span className="text-violet-300">1 unit/mL</span> (so mL/hr = units/hr).</p>
          <p className="text-[10px] font-bold text-slate-400 italic">No insulin bolus. Continue until ketoacidosis resolves (pH &gt; 7.3, HCO₃ &gt; 15, ketones &lt; 0.6), not just normal glucose.</p>
          <p className="text-[10px] font-bold text-amber-300/80 italic mt-1">Check phosphate at 4–6 h: severe hypophosphataemia can develop during insulin infusion (ISPAD 2022). Replace if symptomatic or &lt; 0.5 mmol/L.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-1">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">0.05 units/kg/hr</span>
            <p className="text-2xl font-black text-violet-300">{ins05.toFixed(2)} <span className="text-[10px] text-slate-500">u/hr = mL/hr</span></p>
            <span className="text-[9px] text-slate-600 font-bold">younger / cerebral-edema risk</span>
          </div>
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-1">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">0.1 units/kg/hr</span>
            <p className="text-2xl font-black text-violet-300">{ins10.toFixed(2)} <span className="text-[10px] text-slate-500">u/hr = mL/hr</span></p>
            <span className="text-[9px] text-slate-600 font-bold">standard</span>
          </div>
        </div>
      </div>

      {/* CEREBRAL EDEMA RESCUE */}
      <div className="p-4 bg-red-950/40 rounded-2xl border-2 border-red-800/60 space-y-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <span className="text-[10px] font-black text-red-300 uppercase tracking-widest">Cerebral edema — rescue doses</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-red-950/60 rounded-xl border-2 border-red-600">
            <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">FIRST-LINE · 3% saline (2.5–5 mL/kg)</span>
            <p className="text-lg font-black text-red-300">{(2.5 * w).toFixed(0)}–{(5 * w).toFixed(0)} mL</p>
            <span className="text-[8px] text-red-400/70">IV over 10–15 min · ISPAD 2022</span>
          </div>
          <div className="p-3 bg-slate-900 rounded-xl border border-red-900/40">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Alternative · Mannitol (0.5–1 g/kg)</span>
            <p className="text-lg font-black text-slate-300">{(0.5 * w).toFixed(1)}–{(1 * w).toFixed(1)} g</p>
            <span className="text-[8px] text-slate-500">if 3% saline unavailable</span>
          </div>
        </div>
        <p className="text-[10px] font-bold text-red-300/80 italic">Headache, ↓GCS, bradycardia/↑BP, irritability → reduce fluid rate, give 3% saline (first-line), head up 30°, urgent CT after stabilising. Do not delay treatment for imaging.</p>
      </div>
    </div>
  );
}
