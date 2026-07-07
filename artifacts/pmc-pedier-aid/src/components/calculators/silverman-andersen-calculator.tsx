import { useState } from 'react';

interface CriterionOption {
  score: number;
  label: string;
}

interface Criterion {
  id: string;
  title: string;
  subtitle: string;
  options: CriterionOption[];
}

const CRITERIA: Criterion[] = [
  {
    id: 'upper_chest',
    title: 'Upper Chest',
    subtitle: 'Synchrony of chest & abdomen',
    options: [
      { score: 0, label: '0 — Synchronized movement' },
      { score: 1, label: '1 — Lag on inspiration' },
      { score: 2, label: '2 — See-saw (paradoxical) movement' },
    ],
  },
  {
    id: 'lower_chest',
    title: 'Lower Chest',
    subtitle: 'Intercostal retractions',
    options: [
      { score: 0, label: '0 — No retractions' },
      { score: 1, label: '1 — Just visible' },
      { score: 2, label: '2 — Marked retractions' },
    ],
  },
  {
    id: 'xiphoid',
    title: 'Xiphoid Retraction',
    subtitle: 'Substernal / epigastric retractions',
    options: [
      { score: 0, label: '0 — None' },
      { score: 1, label: '1 — Just visible' },
      { score: 2, label: '2 — Marked' },
    ],
  },
  {
    id: 'nasal_flaring',
    title: 'Nasal Flaring',
    subtitle: 'Nares dilation on inspiration',
    options: [
      { score: 0, label: '0 — None' },
      { score: 1, label: '1 — Minimal' },
      { score: 2, label: '2 — Marked' },
    ],
  },
  {
    id: 'expiratory_grunt',
    title: 'Expiratory Grunt',
    subtitle: 'Audible grunting on expiration',
    options: [
      { score: 0, label: '0 — None' },
      { score: 1, label: '1 — Audible with stethoscope only' },
      { score: 2, label: '2 — Audible without stethoscope' },
    ],
  },
];

function getInterpretation(total: number): {
  label: string;
  color: string;
  bar: string;
  action: string;
} {
  if (total === 0)
    return {
      label: 'No Respiratory Distress',
      color: 'text-emerald-400',
      bar: 'bg-emerald-500',
      action: 'Continue monitoring. No immediate respiratory support required.',
    };
  if (total <= 3)
    return {
      label: 'Mild Distress',
      color: 'text-yellow-400',
      bar: 'bg-yellow-400',
      action: 'Supplemental O₂ (target SpO₂ 91–95% if preterm, 94–98% if term). Consider nasal CPAP 5–8 cmH₂O. Reassess every 30–60 min.',
    };
  if (total <= 6)
    return {
      label: 'Moderate Distress',
      color: 'text-orange-400',
      bar: 'bg-orange-400',
      action: 'CPAP 5–8 cmH₂O or HFNC. Titrate FiO₂ to SpO₂ target. Obtain blood gas. Reassess every 15–30 min. Senior review.',
    };
  return {
    label: 'Severe Distress',
    color: 'text-red-400',
    bar: 'bg-red-500',
    action: 'High risk of respiratory failure. Escalate: CPAP → intubation. Consider surfactant (if < 32 weeks GA and FiO₂ ≥ 0.30, or any GA with FiO₂ ≥ 0.40 on CPAP). Reassess every 10–15 min. Immediate consultant review.',
  };
}

export function SilvermanAndersenCalculator() {
  const [scores, setScores] = useState<Record<string, number>>({});

  const answeredCount = Object.keys(scores).length;
  const total = Object.values(scores).reduce((s, v) => s + v, 0);
  const allAnswered = answeredCount === CRITERIA.length;
  const interp = allAnswered ? getInterpretation(total) : null;

  return (
    <div className="p-5 bg-slate-950 text-white rounded-[32px] space-y-5 shadow-2xl border border-slate-800">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-black tracking-tight">Silverman-Andersen</h3>
          <p className="text-slate-400 text-xs font-medium mt-0.5">Neonatal Retraction Score · 5 criteria · max 10</p>
        </div>
        {allAnswered && (
          <div className="text-right">
            <div className={`text-4xl font-black tabular-nums ${interp!.color}`}>{total}</div>
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">/ 10</div>
          </div>
        )}
      </div>

      {/* Criteria */}
      <div className="space-y-3">
        {CRITERIA.map((criterion) => (
          <div key={criterion.id} className="bg-slate-900 rounded-2xl p-3.5 space-y-2.5">
            <div>
              <p className="text-sm font-black text-white leading-tight">{criterion.title}</p>
              <p className="text-[11px] text-slate-400 font-medium">{criterion.subtitle}</p>
            </div>
            <div className="flex gap-2">
              {criterion.options.map((opt) => (
                <button
                  key={opt.score}
                  onClick={() => setScores((prev) => ({ ...prev, [criterion.id]: opt.score }))}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                    scores[criterion.id] === opt.score
                      ? opt.score === 0
                        ? 'bg-emerald-500 text-white'
                        : opt.score === 1
                        ? 'bg-amber-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Score bar */}
      {allAnswered && (
        <div className="space-y-1.5">
          <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${interp!.bar}`}
              style={{ width: `${(total / 10) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <span>0 – None</span>
            <span>3 – Mild</span>
            <span>6 – Mod</span>
            <span>10 – Severe</span>
          </div>
        </div>
      )}

      {/* Result */}
      {allAnswered && interp && (
        <div className="bg-slate-900 rounded-2xl p-4 space-y-1.5">
          <p className={`text-base font-black ${interp.color}`}>{interp.label} — Score {total}/10</p>
          <p className="text-sm text-slate-300 font-medium leading-relaxed">{interp.action}</p>
        </div>
      )}

      {!allAnswered && (
        <p className="text-center text-slate-500 text-xs font-bold">
          {answeredCount} / {CRITERIA.length} criteria selected
        </p>
      )}

      {/* Clinical key */}
      <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 text-[9px] font-bold text-slate-400 space-y-1">
        <p>SpO₂ targets: preterm (&lt; 37 wk) 91–95% · term 94–98%</p>
        <p>CPAP starting pressure: 5–8 cmH₂O (increase by 1–2 cmH₂O if persisting distress)</p>
        <p>Surfactant: strongly consider if &lt; 32 wk and FiO₂ ≥ 0.30 within 2 h of birth, or any GA on CPAP with FiO₂ ≥ 0.40 (ILCOR / Vermont Oxford Network)</p>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-800">
        {[
          { range: '0', label: 'None', color: 'bg-emerald-500' },
          { range: '1–3', label: 'Mild', color: 'bg-yellow-400' },
          { range: '4–6', label: 'Moderate', color: 'bg-orange-400' },
          { range: '7–10', label: 'Severe', color: 'bg-red-500' },
        ].map((item) => (
          <div key={item.range} className="text-center space-y-1">
            <div className={`h-1.5 rounded-full ${item.color}`} />
            <p className="text-[10px] font-black text-slate-400">{item.range}</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-wide">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
