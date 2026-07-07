import { useState } from "react";
import { Pill, Syringe, TrendingDown, Info, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type Mode = "dosing" | "weaning";
type DrugClass = "opioid" | "benzo" | "alpha2";
type Band = "lt5" | "5to7" | "7to14" | "gt14";

interface AgentDose {
  name: string;
  cls: string;
  bolus?: (w: number) => string;
  infusion?: (w: number) => string;
  use: string;
}

const AGENTS: AgentDose[] = [
  { name: "Morphine", cls: "Opioid analgesic", bolus: (w) => `${(50 * w).toFixed(0)}–${(100 * w).toFixed(0)} mcg (50–100 mcg/kg)`, infusion: (w) => `${(10 * w).toFixed(0)}–${(40 * w).toFixed(0)} mcg/h (10–40 mcg/kg/h)`, use: "First-line analgesia. Titrate to pain score; bolus for breakthrough. Histamine release → caution if hypotensive." },
  { name: "Fentanyl", cls: "Opioid analgesic", bolus: (w) => `${(1 * w).toFixed(1)}–${(2 * w).toFixed(1)} mcg (1–2 mcg/kg)`, infusion: (w) => `${(1 * w).toFixed(1)}–${(4 * w).toFixed(1)} mcg/h (1–4 mcg/kg/h)`, use: "Hemodynamically stable choice; rapid onset. Chest-wall rigidity with fast boluses; rapid tolerance." },
  { name: "Midazolam", cls: "Benzodiazepine sedative", bolus: (w) => `${(50 * w).toFixed(0)}–${(100 * w).toFixed(0)} mcg (50–100 mcg/kg)`, infusion: (w) => `${(0.06 * w).toFixed(2)}–${(0.24 * w).toFixed(2)} mg/h (1–4 mcg/kg/min)`, use: "Sedative; titrate to COMFORT-B/SBS. Deliriogenic — minimise duration; main driver of benzodiazepine withdrawal." },
  { name: "Dexmedetomidine", cls: "Alpha-2 agonist", infusion: (w) => `${(0.2 * w).toFixed(1)}–${(1 * w).toFixed(1)} mcg/h (0.2–1 mcg/kg/h)`, use: "Cooperative sedation, minimal respiratory depression — good for weaning/extubation. Bradycardia & hypotension; rebound if stopped abruptly." },
  { name: "Ketamine", cls: "NMDA analgesic-sedative", bolus: (w) => `${(0.5 * w).toFixed(1)}–${(1 * w).toFixed(1)} mg (0.5–1 mg/kg)`, infusion: (w) => `${(0.3 * w).toFixed(1)}–${(1.2 * w).toFixed(1)} mg/h (5–20 mcg/kg/min)`, use: "Analgesia + bronchodilation; preserves airway/BP. Useful adjunct to reduce opioid/benzo needs." },
  { name: "Clonidine", cls: "Alpha-2 agonist (adjunct)", bolus: (w) => `${(1 * w).toFixed(0)}–${(5 * w).toFixed(0)} mcg/dose q6–8h (1–5 mcg/kg)`, use: "Opioid-sparing adjunct; helps withdrawal. Monitor HR/BP; wean slowly to avoid rebound hypertension." },
];

// Front-loaded taper: larger reductions early, slower at the end (last 20–30% of dose).
// earlyPct = reduction per day for the first ~70% of dose
// latePct  = reduction per day for the final 30% (slower to prevent rebound)
const BANDS: Record<Band, { label: string; risk: string; perDay: number; earlyPct: number; latePct: number; days: string; tone: string }> = {
  lt5:   { label: "< 5 days",  risk: "Low risk",       perDay: 50, earlyPct: 50, latePct: 50, days: "stop or wean over 24–48 h",         tone: "text-emerald-300 border-emerald-600 bg-emerald-500/10" },
  "5to7":{ label: "5–7 days",  risk: "Moderate risk",  perDay: 15, earlyPct: 20, latePct: 10, days: "~7–10 days (front-loaded)",          tone: "text-amber-300 border-amber-600 bg-amber-500/10" },
  "7to14":{ label: "7–14 days",risk: "High risk",       perDay: 10, earlyPct: 15, latePct: 7,  days: "~12–14 days (front-loaded)",         tone: "text-orange-300 border-orange-600 bg-orange-500/10" },
  gt14:  { label: "> 14 days", risk: "Very high risk",  perDay: 7,  earlyPct: 10, latePct: 5,  days: "3+ weeks, front-loaded",             tone: "text-red-300 border-red-600 bg-red-500/10" },
};

const CONVERSION: Record<DrugClass, string> = {
  opioid: "IV fentanyl → oral morphine: IV fentanyl 1 mcg/hr ≈ oral morphine 0.3 mg/hr (approx). IV morphine → oral morphine: multiply by 3 (oral bioavailability ~33%). For enteral methadone conversion: use total MME to calculate starting dose (~0.1 mg/kg/dose q6–12h for moderate exposure); methadone has very long half-life — wean cautiously over weeks. Add clonidine as opioid-sparing adjunct.",
  benzo: "Convert to enteral lorazepam (oral bioavailability ~85–90%; 1:1 IV:PO dose generally appropriate) or diazepam for very long exposures. Add clonidine or dexmedetomidine as adjuncts. Minimise duration of benzodiazepines — major driver of PICU delirium.",
  alpha2: "Clonidine oral bioavailability ~85% (IV dose ≈ PO dose). Wean slowly — abrupt stop causes rebound hypertension and tachycardia. Dexmedetomidine: transition to PO clonidine before discontinuing, then wean clonidine. Monitor HR/BP for 24–48 h after each dose reduction.",
};

/**
 * PICU Sedation & analgesia — dosing and weaning calculator.
 * Weight from the pathway weight box. Decision support only.
 */
export function SedationWeaningCalculator({ weight }: { weight?: number }) {
  const [mode, setMode] = useState<Mode>("dosing");
  const [cls, setCls] = useState<DrugClass>("opioid");
  const [band, setBand] = useState<Band>("7to14");
  const [current, setCurrent] = useState("");

  if (!weight) {
    return (
      <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
        <p className="text-xs font-bold text-slate-500">Enter patient weight in the pathway weight box to calculate sedation doses and weaning.</p>
      </div>
    );
  }
  const w = weight;
  const b = BANDS[band];
  const cur = parseFloat(current);
  const hasCur = !isNaN(cur) && cur > 0;

  // Front-loaded taper: higher reduction steps early, smaller steps for last 30% of dose
  const taperSchedule = hasCur
    ? (() => {
        const threshold = cur * 0.30; // bottom 30% gets the slower late rate
        const days: number[] = [];
        let dose = cur;
        for (let i = 0; i < 14 && dose > 0.01; i++) {
          const pct = dose > threshold ? b.earlyPct : b.latePct;
          const step = (dose * pct) / 100;
          dose = Math.max(dose - step, 0);
          days.push(dose);
        }
        return days.slice(0, 10);
      })()
    : null;

  const unitLabel = cls === "opioid" ? "mcg/kg/h (or mg/h)" : cls === "benzo" ? "mg/h (or mcg/kg/min)" : "mcg/kg/h";

  return (
    <div className="p-5 bg-slate-950 text-white rounded-[32px] space-y-6 shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-500/20 text-violet-400"><Syringe className="h-4 w-4" /></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400/80">Sedation Dosing &amp; Weaning</span>
        </div>
        <Badge className="bg-violet-600 text-white border-none">{w} kg</Badge>
      </div>

      {/* MODE */}
      <div className="grid grid-cols-2 gap-2">
        {(["dosing", "weaning"] as Mode[]).map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className={cn("py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest border-2 transition-all",
              mode === m ? "bg-violet-500/20 border-violet-500 text-violet-200" : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700")}>
            {m === "dosing" ? "Dosing & how to use" : "Weaning planner"}
          </button>
        ))}
      </div>

      {mode === "dosing" ? (
        <div className="space-y-3">
          {AGENTS.map((a) => (
            <div key={a.name} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-white flex items-center gap-2"><Pill className="h-4 w-4 text-violet-400" />{a.name}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{a.cls}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {a.bolus && (
                  <div className="p-2.5 bg-slate-950/60 rounded-xl">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Bolus / dose</span>
                    <p className="text-sm font-black text-emerald-300">{a.bolus(w)}</p>
                  </div>
                )}
                {a.infusion && (
                  <div className="p-2.5 bg-slate-950/60 rounded-xl">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Infusion</span>
                    <p className="text-sm font-black text-blue-300">{a.infusion(w)}</p>
                  </div>
                )}
              </div>
              <p className="text-[11px] font-bold text-slate-400 italic leading-snug">{a.use}</p>
            </div>
          ))}
          <p className="text-[10px] font-bold text-amber-400/80 italic">Treat pain first, then sedate to a daily target (COMFORT-B / SBS); use the lowest effective dose and review daily.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* DRUG CLASS */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Drug class to wean</label>
            <div className="grid grid-cols-3 gap-2">
              {(["opioid", "benzo", "alpha2"] as DrugClass[]).map((c) => (
                <button key={c} onClick={() => setCls(c)}
                  className={cn("py-2.5 rounded-xl text-[10px] font-black transition-all border-2",
                    cls === c ? "bg-violet-500/20 border-violet-500 text-violet-200" : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700")}>
                  {c === "opioid" ? "Opioid" : c === "benzo" ? "Benzodiazepine" : "Alpha-2"}
                </button>
              ))}
            </div>
          </div>

          {/* DURATION BAND */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Duration of exposure</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(BANDS) as Band[]).map((k) => (
                <button key={k} onClick={() => setBand(k)}
                  className={cn("py-2.5 rounded-xl text-[10px] font-black transition-all border-2",
                    band === k ? BANDS[k].tone : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700")}>
                  {BANDS[k].label}
                </button>
              ))}
            </div>
          </div>

          {/* WEAN RATE RESULT */}
          <div className={cn("p-5 rounded-[24px] border-2 text-center space-y-1", b.tone)}>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{b.risk} · recommended wean</span>
            <p className="text-3xl font-black tracking-tighter">{b.perDay === 50 ? "Stop / 24–48 h" : `~${b.earlyPct}%→${b.latePct}% / day`}</p>
            <p className="text-[10px] font-bold opacity-70">Approx. {b.days} · front-loaded (faster at start, slower at end)</p>
          </div>

          {/* CURRENT DOSE → SCHEDULE */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Current dose/rate ({unitLabel}) — optional</label>
            <Input type="number" inputMode="decimal" placeholder="e.g. 40" value={current} onChange={(e) => setCurrent(e.target.value)}
              className="bg-slate-900 border-slate-800 text-white rounded-xl font-black h-11" />
            {hasCur && taperSchedule !== null && (
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-violet-300">
                  <TrendingDown className="h-3.5 w-3.5" /> Front-loaded taper ({b.earlyPct}% → {b.latePct}% per day in final 30%)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {taperSchedule.map((val, i) => (
                    <div key={i} className="p-2 bg-slate-950/60 rounded-lg text-center">
                      <span className="text-[8px] font-black text-slate-500 uppercase">Day {i + 1}</span>
                      <p className="text-xs font-black text-white">{val.toFixed(1)}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] font-bold text-amber-300/80 italic">WAT-1 ≥ 3 on 2 consecutive shifts → pause or step back one level. WAT-1 ≥ 5 → step back and reassess. Round to practical increments.</p>
              </div>
            )}
          </div>

          {/* CONVERSION + MONITORING */}
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-300"><Info className="h-3.5 w-3.5" /> Conversion & adjuncts</div>
            <p className="text-sm font-bold text-slate-300 leading-snug">{CONVERSION[cls]}</p>
          </div>
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-300"><Clock className="h-3.5 w-3.5" /> Monitoring</div>
            <p className="text-sm font-bold text-slate-300 leading-snug">
              Score WAT-1 each shift (withdrawal) and CAPD (delirium). WAT-1 ≥ 3 on 2 consecutive shifts → pause or slow taper. WAT-1 ≥ 5 → step back one level and reassess. Treat delirium non-pharmacologically first; minimise benzodiazepines. {cls === "alpha2" && "Monitor HR/BP every 4–6 h after dose reductions — rebound hypertension can occur within hours of alpha-2 reduction."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
