import { useState, useMemo } from "react";
import {
  Wind, Activity, AlertTriangle, Info, Calculator, Stethoscope, ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function parseNum(s: string): number | null {
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

type Mode = "invasive" | "niv";

interface Severity {
  label: string;
  tone: string; // tailwind text/bg
  band: string;
}

/**
 * PICU — ARDS / oxygenation management (bespoke interactive tool).
 * Computes OI / OSI, grades PARDS severity (PALICC-2), and surfaces
 * lung-protective targets and the escalation ladder.
 * Rendered via disease.tsx special-casing for id 'picu-ards'.
 */
export function ARDSProtocol() {
  const [mode, setMode] = useState<Mode>("invasive");
  const [map, setMap] = useState("");
  const [fio2, setFio2] = useState("");
  const [pao2, setPao2] = useState("");
  const [spo2, setSpo2] = useState("");
  const [weight, setWeight] = useState("");

  const w = parseNum(weight);

  // OI = (FiO2% × MAP) / PaO2 ; OSI = (FiO2% × MAP) / SpO2
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

  // PALICC-2 severity (invasive uses OI, NIV/non-invasive uses OSI)
  const severity: Severity | null = useMemo(() => {
    if (mode === "invasive") {
      if (oi === null) return null;
      if (oi < 4) return { label: "At risk / sub-threshold", tone: "text-slate-600 bg-slate-100", band: "OI < 4" };
      if (oi < 8) return { label: "Mild PARDS", tone: "text-emerald-700 bg-emerald-50", band: "4 ≤ OI < 8" };
      if (oi < 16) return { label: "Moderate PARDS", tone: "text-amber-700 bg-amber-50", band: "8 ≤ OI < 16" };
      return { label: "Severe PARDS", tone: "text-red-700 bg-red-50", band: "OI ≥ 16" };
    }
    if (osi === null) return null;
    if (osi < 5) return { label: "At risk / sub-threshold", tone: "text-slate-600 bg-slate-100", band: "OSI < 5" };
    if (osi < 7.5) return { label: "Mild PARDS", tone: "text-emerald-700 bg-emerald-50", band: "5 ≤ OSI < 7.5" };
    if (osi < 12.3) return { label: "Moderate PARDS", tone: "text-amber-700 bg-amber-50", band: "7.5 ≤ OSI < 12.3" };
    return { label: "Severe PARDS", tone: "text-red-700 bg-red-50", band: "OSI ≥ 12.3" };
  }, [mode, oi, osi]);

  const isSevere = severity?.label === "Severe PARDS";
  const isMod = severity?.label === "Moderate PARDS";

  const vtLow = w ? (5 * w).toFixed(0) : null;
  const vtHigh = w ? (6 * w).toFixed(0) : null;

  const Field = ({ label, value, onChange, unit, placeholder }: { label: string; value: string; onChange: (v: string) => void; unit: string; placeholder: string }) => (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">{label}</label>
      <div className="relative">
        <Input type="number" inputMode="decimal" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="h-11 pr-14" />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* INTRO */}
      <Card className="rounded-[28px] border-2 border-primary/20 bg-primary/5">
        <CardContent className="p-5 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-primary text-white shrink-0"><Wind className="h-5 w-5" /></div>
          <p className="text-sm font-bold text-slate-700 leading-relaxed">
            Diagnose PARDS (PALICC-2), grade severity by oxygenation, then protect the lung: low tidal volumes, limited pressures, permissive hypercapnia, and conservative oxygen targets. Escalate by severity — prone, neuromuscular blockade, iNO trial, HFOV, then ECMO.
          </p>
        </CardContent>
      </Card>

      {/* MODE TOGGLE */}
      <div className="grid grid-cols-2 gap-2 max-w-sm">
        {(["invasive", "niv"] as Mode[]).map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className={cn("py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all",
              mode === m ? "bg-primary/10 border-primary text-primary" : "bg-card border-slate-200 text-slate-500 hover:border-slate-300")}>
            {m === "invasive" ? "Invasive (OI)" : "Non-invasive (OSI)"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* INPUTS */}
        <Card className="rounded-[28px] border-2 h-fit">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <Calculator className="h-3.5 w-3.5" /> Oxygenation inputs
            </div>
            <Field label="Mean airway pressure (MAP)" value={map} onChange={setMap} unit="cmH₂O" placeholder="e.g. 14" />
            <Field label="FiO₂" value={fio2} onChange={setFio2} unit="%" placeholder="e.g. 60" />
            {mode === "invasive"
              ? <Field label="PaO₂ (arterial)" value={pao2} onChange={setPao2} unit="mmHg" placeholder="e.g. 60" />
              : <Field label="SpO₂" value={spo2} onChange={setSpo2} unit="%" placeholder="e.g. 90" />}
            <Field label="Weight (for tidal volume)" value={weight} onChange={setWeight} unit="kg" placeholder="e.g. 18" />
            <p className="text-[10px] font-bold text-muted-foreground italic">
              {mode === "invasive" ? "OI = (FiO₂% × MAP) ÷ PaO₂" : "OSI = (FiO₂% × MAP) ÷ SpO₂ — use when only SpO₂ available (target SpO₂ 88–97%)."}
            </p>
          </CardContent>
        </Card>

        {/* RESULT */}
        <div className="space-y-4">
          {severity ? (
            <>
              <Card className={cn("rounded-[28px] border-2", isSevere ? "border-red-200" : isMod ? "border-amber-200" : "border-emerald-100")}>
                <CardContent className="p-6 text-center space-y-3">
                  <Badge className="bg-slate-700 text-white uppercase font-black tracking-widest text-[10px]">{mode === "invasive" ? "OI" : "OSI"} Result</Badge>
                  <p className="text-6xl font-black font-mono text-slate-800 tracking-tighter">{(mode === "invasive" ? oi! : osi!).toFixed(1)}</p>
                  <div className={cn("inline-flex flex-col gap-0.5 px-5 py-2 rounded-xl", severity.tone)}>
                    <span className="font-black text-lg leading-none">{severity.label}</span>
                    <span className="text-[10px] font-bold opacity-70">{severity.band}</span>
                  </div>
                </CardContent>
              </Card>

              {(isSevere || isMod) && (
                <div className={cn("rounded-2xl p-4 flex gap-3 text-white shadow-lg", isSevere ? "bg-red-600" : "bg-amber-500")}>
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-black uppercase text-xs">{isSevere ? "Severe PARDS" : "Moderate PARDS"}</p>
                    <p className="text-xs font-medium opacity-90 leading-relaxed">
                      {isSevere
                        ? "Optimise lung-protective ventilation; prone positioning, neuromuscular blockade, iNO trial, and HFOV; ECMO if refractory (OI persistently ≥ 16–25 despite optimisation)."
                        : "Reinforce lung-protective targets and PEEP optimisation; consider prone positioning and a trial of higher PEEP."}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="h-full min-h-[280px] flex flex-col items-center justify-center border-4 border-dashed rounded-[32px] p-10 text-center bg-muted/20 border-muted/30">
              <Activity className="h-14 w-14 text-muted-foreground/20 mb-4" />
              <h3 className="text-lg font-black text-muted-foreground/80 tracking-tight">Enter parameters</h3>
              <p className="text-muted-foreground font-medium text-sm mt-2 max-w-[260px]">
                Enter MAP, FiO₂ and {mode === "invasive" ? "PaO₂" : "SpO₂"} to grade PARDS severity.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* LUNG-PROTECTIVE TARGETS */}
      <Card className="rounded-[28px] border-2">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-700">
            <Stethoscope className="h-4 w-4 text-primary" /> Lung-protective targets
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { k: "Tidal volume", v: vtLow && vtHigh ? `${vtLow}–${vtHigh} mL (5–6 mL/kg)` : "5–6 mL/kg (lower if poor compliance)" },
              { k: "Plateau pressure", v: "≤ 28 cmH₂O (≤ 32 if ↓ chest-wall compliance)" },
              { k: "Driving pressure", v: "Aim < 15 cmH₂O (Pplat − PEEP)" },
              { k: "PEEP", v: "Titrate up with FiO₂ (moderate–high in severe); watch hemodynamics" },
              { k: "pH (permissive hypercapnia)", v: "Tolerate pH ≥ 7.20 (avoid in raised ICP / pulm HTN)" },
              { k: "SpO₂ target", v: "92–97% (PEEP < 10); 88–92% acceptable with higher PEEP" },
            ].map((row) => (
              <div key={row.k} className="p-3 rounded-2xl bg-muted/30 border border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{row.k}</p>
                <p className="text-sm font-bold text-slate-800 leading-snug">{row.v}</p>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 flex gap-2">
            <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-blue-900 leading-relaxed">
              Conservative fluid strategy once resuscitated; minimise sedation while maintaining synchrony; protocolised PEEP/FiO₂ titration.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ESCALATION LADDER */}
      <Card className="rounded-[28px] border-2">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-700">
            <ArrowRight className="h-4 w-4 text-primary" /> Escalation ladder (refractory hypoxemia)
          </div>
          <ol className="space-y-2">
            {[
              "Optimise the basics: PEEP/FiO₂ titration, recruitment as tolerated, ensure synchrony, treat the cause.",
              "Prone positioning for moderate–severe PARDS (extended sessions where feasible).",
              "Neuromuscular blockade for severe PARDS with dyssynchrony / high pressures.",
              "Inhaled nitric oxide (iNO) trial — continue only if measurable response (oxygenation / RV).",
              "HFOV if conventional ventilation fails despite optimisation (see HFOV tool).",
              "ECMO referral for refractory hypoxemia (e.g. OI persistently ≥ 16–25) or unsustainable settings.",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-muted/30 border border-slate-100">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-sm font-bold text-slate-700 leading-snug">{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* REFERENCES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { title: "PALICC-2: Second Pediatric Acute Lung Injury Consensus (2023)", url: "https://journals.lww.com/pccmjournal/fulltext/2023/02000/second_pediatric_acute_lung_injury_consensus.10.aspx" },
          { title: "ARDSNet — Lung-protective ventilation principles", url: "https://www.nejm.org/doi/full/10.1056/NEJM200005043421801" },
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
