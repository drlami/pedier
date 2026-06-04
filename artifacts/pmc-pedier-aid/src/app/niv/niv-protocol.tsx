import { useState, useMemo } from "react";
import { Wind, Activity, AlertTriangle, Info, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function parseNum(s: string): number | null {
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

type Modality = "hfnc" | "cpap" | "bipap";

/**
 * PICU — Non-invasive ventilation titration (HFNC / CPAP / BiPAP).
 * Bespoke interactive tool, rendered via disease.tsx special-casing ('picu-niv').
 */
export function NIVProtocol() {
  const [modality, setModality] = useState<Modality>("hfnc");
  const [weight, setWeight] = useState("");
  const w = parseNum(weight);

  const hfncFlow = useMemo(() => {
    if (!w) return null;
    const flow = 2 * w; // 2 L/kg/min
    return Math.min(flow, 60); // capped at device max
  }, [w]);

  const modalityInfo: Record<Modality, { title: string; best: string; settings: { k: string; v: string }[] }> = {
    hfnc: {
      title: "High-Flow Nasal Cannula",
      best: "Increased work of breathing, mild–moderate hypoxemia, bronchiolitis; comfort-friendly first step.",
      settings: [
        { k: "Flow", v: hfncFlow ? `${hfncFlow.toFixed(0)} L/min (2 L/kg/min, cap ~50–60)` : "2 L/kg/min (enter weight)" },
        { k: "FiO₂", v: "Titrate to SpO₂ target (start high, wean)" },
        { k: "SpO₂ target", v: "92–97% (88–92% if chronic CO₂ retention / cyanotic CHD)" },
        { k: "Wean", v: "Wean FiO₂ first, then flow as tolerated" },
      ],
    },
    cpap: {
      title: "CPAP (continuous distending pressure)",
      best: "Hypoxemic (Type I) failure — atelectasis, pulmonary edema, bronchiolitis needing recruitment.",
      settings: [
        { k: "Start CPAP", v: "5–8 cmH₂O" },
        { k: "Titrate", v: "Up to 8–10 cmH₂O for oxygenation; watch for gastric distension" },
        { k: "FiO₂", v: "Titrate to SpO₂ 92–97%" },
        { k: "Interface", v: "Well-fitting mask/prongs; NG tube to decompress stomach" },
      ],
    },
    bipap: {
      title: "BiPAP / NIV (pressure support)",
      best: "Hypercapnic (Type II) failure — neuromuscular, obstructive, fatigue with rising CO₂.",
      settings: [
        { k: "EPAP (PEEP)", v: "5–6 cmH₂O (oxygenation)" },
        { k: "IPAP", v: "Start 8–10, titrate up to 15–20 cmH₂O for tidal volume / CO₂" },
        { k: "Pressure support", v: "IPAP − EPAP; target adequate chest rise & falling CO₂" },
        { k: "Backup rate", v: "Set age-appropriate backup; FiO₂ to SpO₂ 92–97%" },
      ],
    },
  };

  const info = modalityInfo[modality];

  return (
    <div className="space-y-6">
      <Card className="rounded-[28px] border-2 border-primary/20 bg-primary/5">
        <CardContent className="p-5 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-primary text-white shrink-0"><Wind className="h-5 w-5" /></div>
          <p className="text-sm font-bold text-slate-700 leading-relaxed">
            Match the interface to the problem: HFNC/CPAP for hypoxemic (oxygenation) failure, BiPAP for hypercapnic (ventilation) failure. Start, then reassess within 1–2 hours — NIV that isn't working is dangerous. Have an intubation plan ready.
          </p>
        </CardContent>
      </Card>

      {/* MODALITY */}
      <div className="grid grid-cols-3 gap-2">
        {(["hfnc", "cpap", "bipap"] as Modality[]).map((m) => (
          <button key={m} onClick={() => setModality(m)}
            className={cn("py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all",
              modality === m ? "bg-primary/10 border-primary text-primary" : "bg-card border-slate-200 text-slate-500 hover:border-slate-300")}>
            {m === "hfnc" ? "HFNC" : m === "cpap" ? "CPAP" : "BiPAP"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WEIGHT + BEST USE */}
        <Card className="rounded-[28px] border-2 h-fit">
          <CardContent className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Weight</label>
              <div className="relative">
                <Input type="number" inputMode="decimal" placeholder="e.g. 18" value={weight} onChange={(e) => setWeight(e.target.value)} className="h-11 pr-12" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase">kg</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-muted/30 border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{info.title}</p>
              <p className="text-sm font-bold text-slate-700 leading-snug">{info.best}</p>
            </div>
            {modality === "hfnc" && hfncFlow && (
              <div className="p-5 rounded-[24px] bg-blue-600 text-white text-center">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Starting flow</p>
                <p className="text-4xl font-black tracking-tighter">{hfncFlow.toFixed(0)} <span className="text-base opacity-80">L/min</span></p>
                <p className="text-[10px] font-bold opacity-70">2 L/kg/min (device max ~50–60)</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SETTINGS */}
        <Card className="rounded-[28px] border-2">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-700">
              <Activity className="h-4 w-4 text-primary" /> Starting settings & titration
            </div>
            {info.settings.map((row) => (
              <div key={row.k} className="p-3 rounded-2xl bg-muted/30 border border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{row.k}</p>
                <p className="text-sm font-bold text-slate-800 leading-snug">{row.v}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* SUCCESS vs FAILURE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-[28px] border-2 border-emerald-100 bg-emerald-50/30">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> Signs of success (reassess 1–2 h)
            </div>
            <ul className="space-y-2">
              {["Reduced work of breathing & respiratory rate", "Improved SpO₂ / falling FiO₂ requirement", "Falling CO₂ (BiPAP) with rising pH", "Calmer, more comfortable child"].map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm font-bold text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />{s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="rounded-[28px] border-2 border-red-100 bg-red-50/30">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-red-700">
              <XCircle className="h-4 w-4" /> Failure → intubate
            </div>
            <ul className="space-y-2">
              {["No improvement / worsening at 1–2 h", "Rising CO₂ with falling pH", "SpO₂ not maintained despite escalation", "Exhaustion, apnea, or unable to protect airway", "Hemodynamic instability / ↓ GCS"].map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm font-bold text-slate-700"><AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />{s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* CONTRAINDICATIONS */}
      <Card className="rounded-[28px] border-2">
        <CardContent className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-700">
            <Info className="h-4 w-4 text-amber-500" /> Cautions / contraindications
          </div>
          <p className="text-sm font-bold text-slate-700 leading-relaxed">
            Reduced consciousness / unable to protect airway, facial trauma/surgery, untreated pneumothorax, vomiting/ileus or high aspiration risk, hemodynamic instability, and copious secretions. A trial is reasonable in some — but with a clear time-limited plan and immediate intubation backup.
          </p>
        </CardContent>
      </Card>

      {/* REFERENCES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { title: "PALICC-2 — Non-invasive support in PARDS (2023)", url: "https://journals.lww.com/pccmjournal/fulltext/2023/02000/second_pediatric_acute_lung_injury_consensus.10.aspx" },
          { title: "Pediatric NIV / HFNC — clinical review", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7102510/" },
        ].map((r) => (
          <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 hover:border-blue-300 hover:bg-white transition-all group">
            <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">{r.title}</span>
            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500" />
          </a>
        ))}
      </div>
    </div>
  );
}
