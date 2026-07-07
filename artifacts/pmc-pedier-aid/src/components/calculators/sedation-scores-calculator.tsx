import { useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScaleItem {
  label: string;
  options: { label: string; value: number }[];
}
interface Scale {
  key: string;
  name: string;
  subtitle: string;
  max?: number;
  items: ScaleItem[];
  interpret: (total: number) => { label: string; tone: string };
  note: string;
}

const FLACC: Scale = {
  key: "flacc",
  name: "FLACC",
  subtitle: "Pain — Face, Legs, Activity, Cry, Consolability (validated 2 months – 7 years)",
  max: 10,
  items: [
    { label: "Face", options: [{ label: "No particular expression / smile", value: 0 }, { label: "Occasional grimace/frown, withdrawn", value: 1 }, { label: "Frequent/constant frown, clenched jaw", value: 2 }] },
    { label: "Legs", options: [{ label: "Normal / relaxed", value: 0 }, { label: "Uneasy, restless, tense", value: 1 }, { label: "Kicking / legs drawn up", value: 2 }] },
    { label: "Activity", options: [{ label: "Lying quietly, normal position", value: 0 }, { label: "Squirming, shifting, tense", value: 1 }, { label: "Arched, rigid, jerking", value: 2 }] },
    { label: "Cry", options: [{ label: "No cry", value: 0 }, { label: "Moans / whimpers, occasional", value: 1 }, { label: "Crying steadily, screams, sobs", value: 2 }] },
    { label: "Consolability", options: [{ label: "Content, relaxed", value: 0 }, { label: "Reassured by touch/voice, distractible", value: 1 }, { label: "Difficult to console", value: 2 }] },
  ],
  interpret: (t) => (t === 0 ? { label: "Relaxed / comfortable", tone: "text-emerald-300" } : t <= 3 ? { label: "Mild discomfort", tone: "text-emerald-300" } : t <= 6 ? { label: "Moderate pain", tone: "text-amber-300" } : { label: "Severe pain", tone: "text-red-300" }),
  note: "0 relaxed · 1–3 mild · 4–6 moderate · 7–10 severe. Treat pain before deepening sedation. For children > 7 yr or verbal patients, use a numeric rating scale instead.",
};

const COMFORT_B: Scale = {
  key: "comfortb",
  name: "COMFORT-B",
  subtitle: "Sedation depth (ventilated child)",
  max: 30,
  items: [
    { label: "Alertness", options: [{ label: "Deeply asleep", value: 1 }, { label: "Lightly asleep", value: 2 }, { label: "Drowsy", value: 3 }, { label: "Awake & alert", value: 4 }, { label: "Hyper-alert", value: 5 }] },
    { label: "Calmness / agitation", options: [{ label: "Calm", value: 1 }, { label: "Slightly anxious", value: 2 }, { label: "Anxious", value: 3 }, { label: "Very anxious", value: 4 }, { label: "Panicky", value: 5 }] },
    { label: "Respiratory response", options: [{ label: "No cough / no spontaneous resp", value: 1 }, { label: "Spontaneous, little response", value: 2 }, { label: "Occasional cough / resistance", value: 3 }, { label: "Actively breathes against vent", value: 4 }, { label: "Fights ventilator, coughing/choking", value: 5 }] },
    { label: "Physical movement", options: [{ label: "None", value: 1 }, { label: "Occasional slight", value: 2 }, { label: "Frequent slight", value: 3 }, { label: "Vigorous, limbs only", value: 4 }, { label: "Vigorous incl head/torso", value: 5 }] },
    { label: "Muscle tone", options: [{ label: "Fully relaxed", value: 1 }, { label: "Reduced", value: 2 }, { label: "Normal", value: 3 }, { label: "Increased / flexion", value: 4 }, { label: "Extreme rigidity", value: 5 }] },
    { label: "Facial tension", options: [{ label: "Fully relaxed", value: 1 }, { label: "Normal tone", value: 2 }, { label: "Some tension", value: 3 }, { label: "Full tension throughout", value: 4 }, { label: "Grimacing", value: 5 }] },
  ],
  interpret: (t) => (t < 11 ? { label: "Over-sedated", tone: "text-blue-300" } : t <= 23 ? { label: "Adequate sedation (11–23)", tone: "text-emerald-300" } : { label: "Distress or pain (≥ 24) — treat pain first", tone: "text-red-300" }),
  note: "Range 6–30. < 11 over-sedated · 11–23 adequate · ≥ 24 distress or undertreated pain. Score ≥ 24 does NOT automatically mean 'sedate more' — assess and treat pain before deepening sedation.",
};

const SBS: Scale = {
  key: "sbs",
  name: "SBS",
  subtitle: "State Behavioral Scale (single rating)",
  items: [
    { label: "Behavioral state", options: [{ label: "−3 Unresponsive", value: -3 }, { label: "−2 Responsive to noxious stimuli", value: -2 }, { label: "−1 Responsive to touch / voice", value: -1 }, { label: "0 Awake & able to calm", value: 0 }, { label: "+1 Restless, difficult to calm", value: 1 }, { label: "+2 Agitated", value: 2 }] },
  ],
  interpret: (t) => (t <= -2 ? { label: "Over-sedated", tone: "text-blue-300" } : t <= 0 ? { label: "Target range (−1 to 0)", tone: "text-emerald-300" } : { label: "Under-sedated / agitated", tone: "text-red-300" }),
  note: "Usual target −1 to 0. ≤ −2 over-sedated · ≥ +1 under-sedated/agitated.",
};

const WAT1: Scale = {
  key: "wat1",
  name: "WAT-1",
  subtitle: "Withdrawal Assessment Tool-1",
  max: 12,
  items: [
    { label: "Loose / watery stools (prior 12 h)", options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }] },
    { label: "Vomiting / retching / gagging (prior 12 h)", options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }] },
    { label: "Temperature > 37.8°C (prior 12 h)", options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }] },
    { label: "State (2-min observation)", options: [{ label: "Asleep / awake & calm (SBS ≤ 0)", value: 0 }, { label: "Awake & distressed (SBS ≥ +1)", value: 1 }] },
    { label: "Tremor", options: [{ label: "None / mild", value: 0 }, { label: "Moderate / severe", value: 1 }] },
    { label: "Increased sweating", options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }] },
    { label: "Uncoordinated / repetitive movement", options: [{ label: "None / mild", value: 0 }, { label: "Moderate / severe", value: 1 }] },
    { label: "Yawning or sneezing", options: [{ label: "0–1", value: 0 }, { label: "≥ 2", value: 1 }] },
    { label: "Startle to touch (stimulus)", options: [{ label: "None / mild", value: 0 }, { label: "Moderate / severe", value: 1 }] },
    { label: "Muscle tone (stimulus)", options: [{ label: "Normal", value: 0 }, { label: "Increased", value: 1 }] },
    { label: "Time to regain calm state (post-stimulus)", options: [{ label: "< 2 min", value: 0 }, { label: "2–5 min", value: 1 }, { label: "> 5 min", value: 2 }] },
  ],
  interpret: (t) => (
    t < 3  ? { label: "Withdrawal unlikely (< 3)", tone: "text-emerald-300" } :
    t < 5  ? { label: "Possible withdrawal (3–4) — slow the wean", tone: "text-amber-300" } :
    t < 8  ? { label: "Probable withdrawal (5–7) — hold wean, reassess", tone: "text-orange-300" } :
             { label: "Severe withdrawal (≥ 8) — step back one taper level", tone: "text-red-300" }
  ),
  note: "Range 0–12. Sensitivity of ≥ 3 is ~50% — treat as a gradient, not a binary. Score ≥ 3 on two consecutive shifts → pause or slow taper. Higher scores (≥ 5–8) are more specific for true withdrawal.",
};

const CAPD: Scale = {
  key: "capd",
  name: "CAPD",
  subtitle: "Cornell Assessment of Pediatric Delirium",
  max: 32,
  items: [
    { label: "Makes eye contact with caregiver", options: [{ label: "Always", value: 0 }, { label: "Often", value: 1 }, { label: "Sometimes", value: 2 }, { label: "Rarely", value: 3 }, { label: "Never", value: 4 }] },
    { label: "Actions are purposeful", options: [{ label: "Always", value: 0 }, { label: "Often", value: 1 }, { label: "Sometimes", value: 2 }, { label: "Rarely", value: 3 }, { label: "Never", value: 4 }] },
    { label: "Aware of surroundings", options: [{ label: "Always", value: 0 }, { label: "Often", value: 1 }, { label: "Sometimes", value: 2 }, { label: "Rarely", value: 3 }, { label: "Never", value: 4 }] },
    { label: "Communicates needs and wants", options: [{ label: "Always", value: 0 }, { label: "Often", value: 1 }, { label: "Sometimes", value: 2 }, { label: "Rarely", value: 3 }, { label: "Never", value: 4 }] },
    { label: "Restless", options: [{ label: "Never", value: 0 }, { label: "Rarely", value: 1 }, { label: "Sometimes", value: 2 }, { label: "Often", value: 3 }, { label: "Always", value: 4 }] },
    { label: "Inconsolable", options: [{ label: "Never", value: 0 }, { label: "Rarely", value: 1 }, { label: "Sometimes", value: 2 }, { label: "Often", value: 3 }, { label: "Always", value: 4 }] },
    { label: "Underactive (little movement while awake)", options: [{ label: "Never", value: 0 }, { label: "Rarely", value: 1 }, { label: "Sometimes", value: 2 }, { label: "Often", value: 3 }, { label: "Always", value: 4 }] },
    { label: "Takes a long time to respond to interactions", options: [{ label: "Never", value: 0 }, { label: "Rarely", value: 1 }, { label: "Sometimes", value: 2 }, { label: "Often", value: 3 }, { label: "Always", value: 4 }] },
  ],
  interpret: (t) => (t < 9 ? { label: "Delirium unlikely", tone: "text-emerald-300" } : { label: "Delirium likely (≥ 9)", tone: "text-red-300" }),
  note: "Range 0–32. Score ≥ 9 indicates delirium. PREREQUISITE: only valid when patient is at adequate sedation (SBS ≥ −2 / RASS ≥ −2). Do not score a deeply sedated patient — result is not interpretable.",
};

const SCALES: Scale[] = [FLACC, COMFORT_B, SBS, WAT1, CAPD];

function ScaleScorer({ scale }: { scale: Scale }) {
  const [sel, setSel] = useState<number[]>(scale.items.map(() => 0));
  const total = scale.items.reduce((s, it, i) => s + it.options[sel[i]].value, 0);
  const interp = scale.interpret(total);

  return (
    <div className="space-y-4">
      {scale.items.map((it, i) => (
        <div key={i} className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{it.label}</label>
          <div className="flex flex-wrap gap-1.5">
            {it.options.map((o, j) => (
              <button key={j} onClick={() => setSel((s) => s.map((v, k) => (k === i ? j : v)))}
                className={cn("px-2.5 py-1.5 rounded-lg text-[10px] font-black transition-all border",
                  sel[i] === j ? "bg-violet-600 text-white border-violet-500" : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600")}>
                {o.label} <span className="opacity-60">({o.value >= 0 ? `+${o.value}` : o.value})</span>
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Total {scale.name}</span>
          <p className={cn("text-sm font-black", interp.tone)}>{interp.label}</p>
        </div>
        <span className={cn("text-4xl font-black tracking-tighter", interp.tone)}>{total}{scale.max ? <span className="text-sm text-slate-600"> / {scale.max}</span> : null}</span>
      </div>
      <p className="text-[9px] font-bold text-slate-500 italic">{scale.note}</p>
    </div>
  );
}

/** Tabbed interactive scoring tool for sedation, pain, delirium and withdrawal. */
export function SedationScoresCalculator() {
  const [tab, setTab] = useState(0);
  const scale = SCALES[tab];
  return (
    <div className="p-5 bg-slate-950 text-white rounded-[32px] space-y-5 shadow-2xl border border-slate-800">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-violet-500/20 text-violet-400"><ClipboardCheck className="h-4 w-4" /></div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400/80">Sedation · Pain · Delirium · Withdrawal Scores</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {SCALES.map((s, i) => (
          <button key={s.key} onClick={() => setTab(i)}
            className={cn("px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border",
              tab === i ? "bg-violet-500/20 border-violet-500 text-violet-200" : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700")}>
            {s.name}
          </button>
        ))}
      </div>
      <div className="px-1">
        <p className="text-[11px] font-bold text-slate-400 mb-3">{scale.subtitle}</p>
        <ScaleScorer key={scale.key} scale={scale} />
      </div>
    </div>
  );
}
