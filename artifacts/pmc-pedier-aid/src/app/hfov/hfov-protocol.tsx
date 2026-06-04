import { useState, useMemo } from "react";
import {
  Wind, Activity, AlertTriangle, CheckCircle2, Calculator,
  ArrowRight, Info, RefreshCcw, BookOpen, Stethoscope,
  AlertCircle, ChevronDown, ChevronUp, Zap, Baby,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type HFOVInputs, type HFOVWarning, type HFOVDiagnosis, type HFOVPathway, type AgeUnit,
  DIAG_LABELS, runHFOVAssessment,
} from "@/lib/calculators/hfov-logic";

// ─── Small helpers ────────────────────────────────────────────────────────────

function SL({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{children}</p>;
}

function parseNum(s: string): number | null {
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function WarnCard({ w }: { w: HFOVWarning }) {
  const bg    = w.severity === "critical" ? "bg-red-50 border-red-300"   : w.severity === "warning" ? "bg-amber-50 border-amber-300" : "bg-blue-50 border-blue-200";
  const icon  = w.severity === "critical" ? <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" /> : w.severity === "warning" ? <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" /> : <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />;
  const title = w.severity === "critical" ? "text-red-900"   : w.severity === "warning" ? "text-amber-900" : "text-blue-900";
  const body  = w.severity === "critical" ? "text-red-800"   : w.severity === "warning" ? "text-amber-800" : "text-blue-800";
  return (
    <div className={cn("flex gap-3 p-3 rounded-xl border", bg)}>
      {icon}
      <div className="space-y-0.5">
        <p className={cn("text-xs font-black", title)}>{w.title}</p>
        <p className={cn("text-xs font-medium leading-relaxed", body)}>{w.message}</p>
        {w.action && <p className={cn("text-xs font-black mt-1", title)}>→ {w.action}</p>}
      </div>
    </div>
  );
}

// Extracted as a proper component so useState is not called inside a .map() callback
function AdjustmentGuideCard({ guide }: { guide: import("@/lib/calculators/hfov-logic").HFOVAdjustmentGuide }) {
  const [open, setOpen] = useState(true);
  const bg = guide.priority === "critical" ? "border-red-300 bg-red-50" : guide.priority === "high" ? "border-amber-200 bg-amber-50" : "border-blue-200 bg-blue-50";
  const tc = guide.priority === "critical" ? "text-red-900" : guide.priority === "high" ? "text-amber-900" : "text-blue-900";
  return (
    <div className={cn("rounded-xl border", bg)}>
      <button className="w-full flex items-start gap-3 p-3 text-left" onClick={() => setOpen(!open)}>
        <div className={cn("w-5 h-5 rounded-full shrink-0 flex items-center justify-center mt-0.5", guide.priority === "critical" ? "bg-red-600" : guide.priority === "high" ? "bg-amber-500" : "bg-blue-500")}>
          <AlertTriangle className="h-3 w-3 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className={cn("text-xs font-black", tc)}>{guide.scenario}</p>
            {open ? <ChevronUp className="h-3 w-3 text-slate-400" /> : <ChevronDown className="h-3 w-3 text-slate-400" />}
          </div>
          <p className={cn("text-[11px] font-medium", tc)}>{guide.detected}</p>
        </div>
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2 border-t border-opacity-50">
          {guide.steps.map((step, i) => (
            <div key={i} className={cn("flex gap-2 pt-1 text-xs font-medium", tc)}>
              <ArrowRight className="h-3 w-3 shrink-0 mt-0.5 opacity-60" /> {step}
            </div>
          ))}
          {guide.seniorReview && (
            <div className="flex gap-2 mt-2 p-2 bg-white/60 rounded-xl border border-red-200">
              <AlertCircle className="h-3.5 w-3.5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs font-black text-red-800">
                Senior/PICU/NICU review required{guide.seniorNote ? ` — ${guide.seniorNote}` : ""}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const PARDS_COLOR: Record<string, string> = {
  "no-criteria": "text-emerald-700", mild: "text-yellow-700",
  moderate: "text-orange-700", severe: "text-red-700", "no-data": "text-slate-400",
};
const PARDS_BG: Record<string, string> = {
  "no-criteria": "bg-emerald-50 border-emerald-200", mild: "bg-yellow-50 border-yellow-200",
  moderate: "bg-orange-50 border-orange-200", severe: "bg-red-50 border-red-300", "no-data": "bg-slate-50 border-slate-200",
};

// ─── Main component ───────────────────────────────────────────────────────────

export function HFOVProtocol() {
  // ── Pathway & patient ──
  const [pathway, setPathway]   = useState<HFOVPathway | "">("");
  const [ageValue, setAgeValue] = useState("");
  const [ageUnit, setAgeUnit]   = useState<AgeUnit>("months");
  const [ga, setGa]             = useState("");
  const [weight, setWeight]         = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "g">("kg");
  const [diagnosis, setDiagnosis] = useState<HFOVDiagnosis | "">("");

  // ── Conventional settings ──
  const [convFailed, setConvFailed]   = useState<boolean | null>(null);
  const [convFio2, setConvFio2]       = useState("");
  const [convMap, setConvMap]         = useState("");
  const [convPeep, setConvPeep]       = useState("");
  const [convPip, setConvPip]         = useState("");
  const [convRr, setConvRr]           = useState("");
  const [convVt, setConvVt]           = useState("");

  // ── HFOV current settings ──
  const [onHFOV, setOnHFOV]           = useState(false);
  const [hfovMap, setHfovMap]         = useState("");
  const [hfovAmp, setHfovAmp]         = useState("");
  const [hfovFreq, setHfovFreq]       = useState("");
  const [hfovFio2, setHfovFio2]       = useState("");
  const [hfovItime, setHfovItime]     = useState("");

  // ── Gas / labs ──
  const [ph, setPh]       = useState("");
  const [pco2, setPco2]   = useState("");
  const [pao2, setPao2]   = useState("");
  const [spo2, setSpo2]   = useState("");

  // ── Clinical flags ──
  const [haemoConcern, setHaemoConcern]   = useState(false);
  const [pneumothorax, setPneumothorax]   = useState(false);

  // ── UI ──
  const [activeTab, setActiveTab]     = useState("setup");
  const [convOpen, setConvOpen]       = useState(true);
  const [hfovOpen, setHfovOpen]       = useState(false);
  const [gasOpen, setGasOpen]         = useState(true);

  const handleReset = () => {
    setPathway(""); setAgeValue(""); setAgeUnit("months"); setGa(""); setWeight(""); setWeightUnit("kg"); setDiagnosis("");
    setConvFailed(null); setConvFio2(""); setConvMap(""); setConvPeep(""); setConvPip(""); setConvRr(""); setConvVt("");
    setOnHFOV(false); setHfovMap(""); setHfovAmp(""); setHfovFreq(""); setHfovFio2(""); setHfovItime("");
    setPh(""); setPco2(""); setPao2(""); setSpo2("");
    setHaemoConcern(false); setPneumothorax(false); setActiveTab("setup");
  };

  const inputs: HFOVInputs = useMemo(() => ({
    pathway,
    age:                ageValue ? { value: parseFloat(ageValue), unit: ageUnit } : null,
    gestationalAgeWeeks: parseNum(ga),
    weightKg:           parseNum(weight) !== null
                          ? (weightUnit === "g" ? parseNum(weight)! / 1000 : parseNum(weight))
                          : null,
    diagnosis,
    conventionalFailed: convFailed,
    convFio2Percent:    parseNum(convFio2),
    convMap:            parseNum(convMap),
    convPeep:           parseNum(convPeep),
    convPip:            parseNum(convPip),
    convRr:             parseNum(convRr),
    convVtMl:           parseNum(convVt),
    onHFOV,
    hfovMap:            parseNum(hfovMap),
    hfovAmplitude:      parseNum(hfovAmp),
    hfovFreqHz:         parseNum(hfovFreq),
    hfovFio2Percent:    parseNum(hfovFio2),
    hfovItime:          parseNum(hfovItime),
    ph:                 parseNum(ph),
    pco2:               parseNum(pco2),
    pao2:               parseNum(pao2),
    spo2:               parseNum(spo2),
    haemodynamicConcern: haemoConcern,
    pneumothoraxPresent: pneumothorax,
  }), [pathway, ageValue, ageUnit, ga, weight, diagnosis, convFailed,
       convFio2, convMap, convPeep, convPip, convRr, convVt,
       onHFOV, hfovMap, hfovAmp, hfovFreq, hfovFio2, hfovItime,
       ph, pco2, pao2, spo2, haemoConcern, pneumothorax]);

  const output = useMemo(() => runHFOVAssessment(inputs), [inputs]);

  const allWarnings: HFOVWarning[] = useMemo(() => {
    const w = [...output.globalWarnings];
    if (output.oxygenation) w.push(...output.oxygenation.warnings);
    if (output.ventilation) w.push(...output.ventilation.warnings);
    if (output.indications)  w.push(...output.indications.warnings);
    const seen = new Set<string>();
    return w.filter((x) => { if (seen.has(x.code)) return false; seen.add(x.code); return true; });
  }, [output]);

  const criticalCount = allWarnings.filter((w) => w.severity === "critical").length;
  const hasCritical   = criticalCount > 0;

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-4xl mx-auto space-y-3 pb-24">

      {/* Header */}
      <Card className="border-2 border-primary/20 shadow-sm overflow-hidden">
        <div className="bg-primary px-5 py-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Wind className="h-6 w-6 opacity-80" />
            <div>
              <h2 className="text-base font-black tracking-tight">HFOV — High-Frequency Oscillatory Ventilation</h2>
              <p className="text-primary-foreground/70 text-[10px] font-medium">Pediatric &amp; Neonatal · PALICC-2 / PEMVECC 2017</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-white/80 hover:text-white hover:bg-white/10 text-xs h-7">
            <RefreshCcw className="h-3 w-3 mr-1" /> Reset
          </Button>
        </div>
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5">
          <p className="text-[10px] font-bold text-amber-800">
            Structured guidance only — not autopilot. All outputs use "consider" and "suggested range." Senior/PICU/NICU review required.
          </p>
        </div>
      </Card>

      {/* DOPES — always visible */}
      <div className="rounded-xl border-2 border-red-400 bg-red-50 px-4 py-2 flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-black text-red-900">ACUTE DETERIORATION ON HFOV → DISCONNECT + HAND-BAG 100% O₂ + DOPES</p>
          <p className="text-[10px] font-bold text-red-700 mt-0.5 flex flex-wrap gap-x-3">
            <span><b>D</b>isplacement</span><span><b>O</b>bstruction</span>
            <span><b>P</b>neumothorax</span><span><b>E</b>quipment/oscillator</span>
            <span><b>S</b>tacked breaths</span>
          </p>
        </div>
      </div>

      {/* Critical alerts */}
      {hasCritical && (
        <div className="space-y-2">
          {allWarnings.filter((w) => w.severity === "critical").map((w) => <WarnCard key={w.code} w={w} />)}
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur py-2 border-b mb-3 overflow-x-auto">
          <TabsList className="w-max h-auto flex flex-nowrap gap-1 bg-transparent p-0 px-1">
            {[
              { value: "setup",      label: "Setup" },
              { value: "assessment", label: "Assessment", badge: hasCritical ? String(criticalCount) : undefined },
              { value: "indications", label: "Indications" },
              { value: "guide",      label: "Initiation Guide" },
              { value: "adjustment", label: "Adjustments" },
              { value: "monitoring", label: "Monitoring" },
              { value: "weaning",    label: "Weaning" },
            ].map((t) => (
              <TabsTrigger key={t.value} value={t.value}
                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white border px-3 py-1.5 text-xs font-bold shrink-0">
                {t.label}
                {t.badge && (
                  <span className="ml-1.5 bg-red-500 text-white text-[9px] font-black rounded-full w-4 h-4 inline-flex items-center justify-center">{t.badge}</span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* ════════ SETUP ════════ */}
        <TabsContent value="setup" className="space-y-3 animate-in fade-in slide-in-from-bottom-2">

          <Card>
            <CardHeader className="pb-2 border-b bg-slate-50/50">
              <CardTitle className="text-xs uppercase tracking-widest text-slate-600 flex items-center gap-2">
                <Stethoscope className="h-3.5 w-3.5" /> Patient
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-3">

              {/* Pathway selector */}
              <div className="space-y-1">
                <SL>Patient Pathway *</SL>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { v: "pediatric", label: "Pediatric (PICU)", icon: <Stethoscope className="h-4 w-4" /> },
                    { v: "neonatal",  label: "Neonatal (NICU)",  icon: <Baby className="h-4 w-4" /> },
                  ].map((opt) => (
                    <button key={opt.v}
                      onClick={() => setPathway(opt.v as HFOVPathway)}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-xl border-2 font-black text-sm transition-colors",
                        pathway === opt.v
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      )}>
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <SL>Age *</SL>
                  <div className="flex gap-2">
                    <Input type="number" placeholder="e.g. 3" value={ageValue}
                      onChange={(e) => setAgeValue(e.target.value)} className="font-bold bg-slate-50 flex-1 h-9" />
                    <Select value={ageUnit} onValueChange={(v) => setAgeUnit(v as AgeUnit)}>
                      <SelectTrigger className="w-24 font-bold bg-slate-50 h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                        <SelectItem value="years">Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <SL>Weight *</SL>
                    {pathway === "neonatal" && (
                      <div className="flex rounded-lg border border-slate-200 overflow-hidden text-[10px] font-black">
                        {(["kg", "g"] as const).map((u) => (
                          <button key={u} onClick={() => { setWeightUnit(u); setWeight(""); }}
                            className={cn("px-2 py-0.5 transition-colors",
                              weightUnit === u ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-50")}>
                            {u}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <Input type="number"
                      placeholder={weightUnit === "g" ? "e.g. 750" : "e.g. 3.2"}
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="font-bold bg-slate-50 h-9 pr-8" />
                    <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">{weightUnit}</span>
                  </div>
                  {weightUnit === "g" && weight && parseNum(weight) !== null && (
                    <p className="text-[10px] text-slate-400 font-bold">= {(parseNum(weight)! / 1000).toFixed(3)} kg</p>
                  )}
                </div>
              </div>

              {pathway === "neonatal" && (
                <div className="space-y-1">
                  <SL>Gestational Age (weeks)</SL>
                  <Input type="number" placeholder="e.g. 28" value={ga}
                    onChange={(e) => setGa(e.target.value)} className="font-bold bg-slate-50 h-9" />
                </div>
              )}

              <div className="space-y-1">
                <SL>Diagnosis Category *</SL>
                <Select value={diagnosis} onValueChange={(v) => setDiagnosis(v as HFOVDiagnosis)}>
                  <SelectTrigger className="font-bold bg-slate-50 h-9"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {pathway === "pediatric" || pathway === "" ? (
                      <>
                        <SelectItem value="pards">Pediatric ARDS (PARDS)</SelectItem>
                        <SelectItem value="pneumonia">Severe Pneumonia</SelectItem>
                        <SelectItem value="air-leak">Air Leak Syndrome</SelectItem>
                        <SelectItem value="phtn">Pulmonary Hypertension</SelectItem>
                      </>
                    ) : null}
                    {pathway === "neonatal" || pathway === "" ? (
                      <>
                        <SelectItem value="rds">Neonatal RDS</SelectItem>
                        <SelectItem value="mas">Meconium Aspiration Syndrome</SelectItem>
                        <SelectItem value="pphn">PPHN</SelectItem>
                        <SelectItem value="cdh">CDH (Diaphragmatic Hernia)</SelectItem>
                        <SelectItem value="neonatal-air-leak">Neonatal Air Leak / PIE</SelectItem>
                      </>
                    ) : null}
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <SL>Conventional ventilation optimised and failed?</SL>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: "true",  label: "Yes — failed" },
                    { v: "false", label: "Not yet" },
                    { v: "null",  label: "Unknown" },
                  ].map((opt) => (
                    <button key={opt.v}
                      onClick={() => setConvFailed(opt.v === "null" ? null : opt.v === "true")}
                      className={cn(
                        "p-2 rounded-xl border text-xs font-bold transition-colors",
                        (convFailed === true && opt.v === "true") || (convFailed === false && opt.v === "false") || (convFailed === null && opt.v === "null")
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      )}>{opt.label}</button>
                  ))}
                </div>
              </div>

              {/* Clinical flags */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Haemodynamic concern / Shock", val: haemoConcern, set: setHaemoConcern },
                  { label: "Pneumothorax present",         val: pneumothorax, set: setPneumothorax },
                ].map((f) => (
                  <button key={f.label}
                    onClick={() => f.set(!f.val)}
                    className={cn(
                      "p-2.5 rounded-xl border-2 text-xs font-bold text-left transition-colors",
                      f.val ? "border-red-400 bg-red-50 text-red-800" : "border-slate-200 text-slate-600 hover:border-slate-300"
                    )}>
                    {f.val ? "⚠ " : ""}{f.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conventional settings */}
          <Card>
            <button className="w-full" onClick={() => setConvOpen(!convOpen)}>
              <CardHeader className="pb-2 border-b bg-slate-50/50">
                <CardTitle className="text-xs uppercase tracking-widest text-slate-600 flex items-center justify-between">
                  <span className="flex items-center gap-2"><Calculator className="h-3.5 w-3.5" /> Conventional Ventilator Settings</span>
                  {convOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </CardTitle>
              </CardHeader>
            </button>
            {convOpen && (
              <CardContent className="pt-3 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "FiO₂ (%)",      val: convFio2, set: setConvFio2, ph: "21–100" },
                    { label: "MAP (cmH₂O)",   val: convMap,  set: setConvMap,  ph: "e.g. 14" },
                    { label: "PEEP (cmH₂O)",  val: convPeep, set: setConvPeep, ph: "e.g. 8" },
                  ].map((f) => (
                    <div key={f.label} className="space-y-1">
                      <Label className="text-[10px] text-slate-500 font-bold">{f.label}</Label>
                      <Input type="number" placeholder={f.ph} value={f.val} onChange={(e) => f.set(e.target.value)} className="h-8 text-xs bg-slate-50" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "PIP / Pplat",  val: convPip, set: setConvPip, ph: "e.g. 30" },
                    { label: "Set RR (bpm)", val: convRr,  set: setConvRr,  ph: "e.g. 40" },
                    { label: "VT (mL)",      val: convVt,  set: setConvVt,  ph: "e.g. 60" },
                  ].map((f) => (
                    <div key={f.label} className="space-y-1">
                      <Label className="text-[10px] text-slate-500 font-bold">{f.label}</Label>
                      <Input type="number" placeholder={f.ph} value={f.val} onChange={(e) => f.set(e.target.value)} className="h-8 text-xs bg-slate-50" />
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Current HFOV settings */}
          <Card>
            <button className="w-full" onClick={() => setHfovOpen(!hfovOpen)}>
              <CardHeader className="pb-2 border-b bg-slate-50/50">
                <CardTitle className="text-xs uppercase tracking-widest text-slate-600 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Wind className="h-3.5 w-3.5" /> Current HFOV Settings
                    <button onClick={(e) => { e.stopPropagation(); setOnHFOV(!onHFOV); }}
                      className={cn("ml-2 text-[10px] px-2 py-0.5 rounded-full border font-black transition-colors",
                        onHFOV ? "border-primary bg-primary/10 text-primary" : "border-slate-300 text-slate-500")}>
                      {onHFOV ? "On HFOV ✓" : "Not on HFOV"}
                    </button>
                  </span>
                  {hfovOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </CardTitle>
              </CardHeader>
            </button>
            {hfovOpen && (
              <CardContent className="pt-3 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "HFOV MAP (cmH₂O)", val: hfovMap,   set: setHfovMap,   ph: "e.g. 18" },
                    { label: "Amplitude ΔP",      val: hfovAmp,   set: setHfovAmp,   ph: "e.g. 35" },
                    { label: "Frequency (Hz)",    val: hfovFreq,  set: setHfovFreq,  ph: "e.g. 8" },
                  ].map((f) => (
                    <div key={f.label} className="space-y-1">
                      <Label className="text-[10px] text-slate-500 font-bold">{f.label}</Label>
                      <Input type="number" placeholder={f.ph} value={f.val} onChange={(e) => f.set(e.target.value)} className="h-8 text-xs bg-slate-50" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "FiO₂ on HFOV (%)", val: hfovFio2,  set: setHfovFio2,  ph: "e.g. 70" },
                    { label: "I-Time (%)",        val: hfovItime, set: setHfovItime, ph: "33" },
                  ].map((f) => (
                    <div key={f.label} className="space-y-1">
                      <Label className="text-[10px] text-slate-500 font-bold">{f.label}</Label>
                      <Input type="number" placeholder={f.ph} value={f.val} onChange={(e) => f.set(e.target.value)} className="h-8 text-xs bg-slate-50" />
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Gas / Labs */}
          <Card>
            <button className="w-full" onClick={() => setGasOpen(!gasOpen)}>
              <CardHeader className="pb-2 border-b bg-slate-50/50">
                <CardTitle className="text-xs uppercase tracking-widest text-slate-600 flex items-center justify-between">
                  <span className="flex items-center gap-2"><Activity className="h-3.5 w-3.5" /> Gas &amp; Labs</span>
                  {gasOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </CardTitle>
              </CardHeader>
            </button>
            {gasOpen && (
              <CardContent className="pt-3 space-y-3">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "SpO₂ (%)",     val: spo2,  set: setSpo2,  step: "1",    ph: "e.g. 88" },
                    { label: "pH",           val: ph,    set: setPh,    step: "0.01", ph: "e.g. 7.30" },
                    { label: "PaCO₂ (mmHg)", val: pco2,  set: setPco2,  step: "1",    ph: "e.g. 50" },
                    { label: "PaO₂ (mmHg)",  val: pao2,  set: setPao2,  step: "1",    ph: "arterial" },
                  ].map((f) => (
                    <div key={f.label} className="space-y-1">
                      <Label className="text-[10px] text-slate-500 font-bold">{f.label}</Label>
                      <Input type="number" step={f.step} placeholder={f.ph} value={f.val}
                        onChange={(e) => f.set(e.target.value)} className="h-8 text-xs bg-slate-50" />
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {output.hasMinimumData ? (
            <Button className="w-full h-11 font-black text-sm" onClick={() => setActiveTab("assessment")}>
              <Zap className="h-4 w-4 mr-2" />
              View Assessment &amp; Recommendations
              {hasCritical && <span className="ml-2 bg-red-500 text-white text-[10px] font-black rounded-full px-1.5 py-0.5">{criticalCount} critical</span>}
            </Button>
          ) : (
            <p className="text-center text-xs text-slate-400 font-bold py-2">* Enter pathway, age, and weight to generate assessment</p>
          )}
        </TabsContent>

        {/* ════════ ASSESSMENT ════════ */}
        <TabsContent value="assessment" className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
          {!output.hasMinimumData ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <Calculator className="h-12 w-12 opacity-20" />
              <p className="font-bold text-sm">Enter pathway, age, and weight in Setup</p>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("setup")}>Go to Setup</Button>
            </div>
          ) : (
            <>
              {/* Patient snapshot */}
              <div className="flex flex-wrap items-center gap-2 px-1">
                {pathway && (
                  <Badge className={cn("font-black text-xs", pathway === "neonatal" ? "bg-purple-100 text-purple-800 border-purple-200" : "bg-blue-100 text-blue-800 border-blue-200")}>
                    {pathway === "neonatal" ? <Baby className="h-3 w-3 mr-1 inline" /> : <Stethoscope className="h-3 w-3 mr-1 inline" />}
                    {pathway === "neonatal" ? "Neonatal" : "Pediatric"}
                  </Badge>
                )}
                <Badge variant="outline" className="font-black text-xs">
                  {ageValue} {ageUnit} · {weight} {weightUnit}
                  {weightUnit === "g" && weight && parseNum(weight) !== null && ` (${(parseNum(weight)! / 1000).toFixed(3)} kg)`}
                </Badge>
                {ga && pathway === "neonatal" && <Badge variant="outline" className="font-black text-xs">GA {ga}w</Badge>}
                {diagnosis && <Badge className="font-black text-xs bg-primary/10 text-primary border-primary/20">{DIAG_LABELS[diagnosis] ?? diagnosis}</Badge>}
                {pneumothorax && <Badge className="font-black text-xs bg-red-100 text-red-800 border-red-200">⚠ Pneumothorax</Badge>}
                {haemoConcern && <Badge className="font-black text-xs bg-amber-100 text-amber-800 border-amber-200">⚠ Haemodynamic concern</Badge>}
              </div>

              {/* All warnings */}
              {allWarnings.length > 0 && (
                <Card>
                  <CardHeader className="pb-2 border-b bg-slate-50/50">
                    <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-600" /> Safety Alerts</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3 space-y-2">
                    {allWarnings.map((w) => <WarnCard key={w.code} w={w} />)}
                  </CardContent>
                </Card>
              )}

              {/* Key metric tiles */}
              <div className="grid grid-cols-3 gap-2">
                {/* OI/OSI */}
                {output.oxygenation && (() => {
                  const g = output.oxygenation.grade;
                  const val = output.oxygenation.oi ?? output.oxygenation.osi;
                  return (
                    <div className={cn("p-3 rounded-xl border", PARDS_BG[g])}>
                      <SL>{output.oxygenation.usedIndex ?? "OI/OSI"}</SL>
                      <p className={cn("text-xl font-black mt-0.5", PARDS_COLOR[g])}>{val ?? "—"}</p>
                      <p className={cn("text-[10px] font-black mt-0.5 leading-tight", PARDS_COLOR[g])}>
                        {g === "no-data" ? "Enter FiO₂+MAP+(PaO₂/SpO₂)" : output.oxygenation.gradeLabel}
                      </p>
                    </div>
                  );
                })()}

                {/* pH */}
                {(() => {
                  const ac = output.ventilation?.phCategory;
                  const color = ac === "normal" ? "text-emerald-700" : ac === "acidosis" ? "text-red-700" : ac === "alkalosis" ? "text-blue-700" : "text-slate-400";
                  const bg2 = ac === "normal" ? "bg-emerald-50 border-emerald-200" : ac === "acidosis" ? "bg-red-50 border-red-200" : ac === "alkalosis" ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200";
                  return (
                    <div className={cn("p-3 rounded-xl border", bg2)}>
                      <SL>pH</SL>
                      <p className={cn("text-xl font-black mt-0.5", color)}>{ph || "—"}</p>
                      <p className={cn("text-[10px] font-black mt-0.5", color)}>{pco2 ? `pCO₂ ${pco2}` : "Enter pH+pCO₂"}</p>
                    </div>
                  );
                })()}

                {/* Current HFOV settings tile */}
                <div className="p-3 rounded-xl border bg-purple-50 border-purple-200">
                  <SL>Current HFOV</SL>
                  {onHFOV && (hfovMap || hfovAmp || hfovFreq) ? (
                    <>
                      <p className="text-xl font-black mt-0.5 text-purple-800">
                        {hfovMap || "—"} <span className="text-xs font-bold text-purple-500">cmH₂O MAP</span>
                      </p>
                      <p className="text-[10px] font-black mt-0.5 text-purple-600">
                        ΔP {hfovAmp || "—"} cmH₂O · {hfovFreq || "—"} Hz
                      </p>
                    </>
                  ) : onHFOV ? (
                    <>
                      <p className="text-sm font-black mt-0.5 text-purple-700">On HFOV</p>
                      <p className="text-[10px] font-medium text-purple-500">Enter settings in Setup → HFOV section</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-black mt-0.5 text-purple-700">Pre-HFOV</p>
                      <p className="text-[10px] font-medium text-purple-500">Toggle "On HFOV" in Setup once initiated</p>
                    </>
                  )}
                </div>
              </div>

              {/* Suggested initial settings — shown directly in Assessment */}
              {output.setupGuide && (
                <Card className="border-2 border-emerald-200">
                  <CardHeader className="pb-2 border-b bg-emerald-50/60">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-emerald-700" />
                      Suggested Initial HFOV Settings
                      <span className="text-[10px] text-slate-400 font-medium ml-1">— {output.setupGuide.diagnosisLabel}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3 space-y-3">
                    {/* Key parameter tiles */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <SL>MAP</SL>
                        <p className="text-sm font-black text-blue-800 mt-1 leading-snug">{output.setupGuide.suggestedMapRange}</p>
                        <p className="text-[10px] text-blue-600 font-medium mt-0.5 leading-tight">{output.setupGuide.mapConcept.split(".")[0]}.</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                        <SL>Amplitude (ΔP)</SL>
                        <p className="text-sm font-black text-purple-800 mt-1 leading-snug">{output.setupGuide.suggestedAmplitudeRange}</p>
                        <p className="text-[10px] text-purple-600 font-medium mt-0.5 leading-tight">Titrate to visible chest wiggle — clavicles to mid-thigh.</p>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                        <SL>Frequency (Hz)</SL>
                        <p className="text-xl font-black text-amber-800 mt-1">{output.setupGuide.suggestedFreqHz}</p>
                        <p className="text-[10px] text-amber-600 font-medium mt-0.5">Lower Hz → larger oscillatory VT → better CO₂ clearance</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border">
                        <SL>FiO₂ start / I-Time</SL>
                        <p className="text-sm font-black text-slate-800 mt-1">{output.setupGuide.fio2Start.split(".")[0]}</p>
                        <p className="text-[10px] text-slate-600 font-medium mt-0.5">I-Time: {output.setupGuide.itime} · Wean FiO₂ rapidly once stable.</p>
                      </div>
                    </div>

                    {/* Targets */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-2.5 bg-white border rounded-xl space-y-0.5">
                        <SL>Oxygenation Target</SL>
                        <p className="text-xs font-medium text-slate-700">{output.setupGuide.oxyTarget}</p>
                      </div>
                      <div className="p-2.5 bg-white border rounded-xl space-y-0.5">
                        <SL>Ventilation Target</SL>
                        <p className="text-xs font-medium text-slate-700">{output.setupGuide.ventTarget}</p>
                      </div>
                    </div>

                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-[10px] font-bold text-amber-800">
                        ⚠ Starting ranges only — not fixed commands. Titrate to clinical response. Reassess ABG 30–60 min after initiation and after every significant change. Senior/PICU/NICU review before initiation.
                      </p>
                    </div>

                    <Button variant="outline" size="sm" className="w-full text-xs h-8 font-bold"
                      onClick={() => setActiveTab("guide")}>
                      View full initiation guide with cautions and CXR targets →
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Ventilation guidance */}
              {output.ventilation?.hasData && (
                <Card>
                  <CardHeader className="pb-2 border-b bg-slate-50/50">
                    <CardTitle className="text-sm flex items-center gap-2"><Activity className="h-4 w-4 text-purple-600" /> Ventilation / Gas Exchange</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3 space-y-2">
                    {output.ventilation.permissiveApplies && (
                      <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-xs font-black text-blue-800">Permissive hypercapnia applies</p>
                        <p className="text-[10px] font-medium text-blue-700 mt-0.5 leading-relaxed">{output.ventilation.permissiveNote}</p>
                      </div>
                    )}
                    {output.ventilation.advice.map((a, i) => (
                      <div key={i} className="flex gap-2 p-2.5 bg-slate-50 rounded-xl border">
                        <ArrowRight className="h-3 w-3 text-slate-400 shrink-0 mt-0.5" />
                        <p className="text-xs font-medium text-slate-700">{a}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* OI/OSI P/F note */}
              {output.oxygenation?.pf !== null && output.oxygenation?.pf !== undefined && (
                <div className="px-3 py-2 bg-slate-50 border rounded-xl">
                  <p className="text-[10px] text-slate-500 font-bold">
                    P/F ratio = {output.oxygenation.pf} mmHg — informational only. PALICC-2 uses OI/OSI as primary pediatric severity index, not adult Berlin P/F grading.
                  </p>
                </div>
              )}

              {/* Quick links */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { tab: "indications", label: "Indications",     icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
                  { tab: "guide",       label: "Initiation Guide", icon: <BookOpen className="h-3.5 w-3.5" /> },
                  { tab: "adjustment",  label: "Adjustments",      icon: <Activity className="h-3.5 w-3.5" /> },
                  { tab: "weaning",     label: "Weaning",          icon: <AlertCircle className="h-3.5 w-3.5" /> },
                ].map((link) => (
                  <Button key={link.tab} variant="outline" size="sm"
                    className="h-9 text-xs font-bold gap-1.5 justify-start"
                    onClick={() => setActiveTab(link.tab)}>
                    {link.icon} {link.label}
                  </Button>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* ════════ INDICATIONS ════════ */}
        <TabsContent value="indications" className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
          {!output.hasMinimumData ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <Calculator className="h-10 w-10 opacity-20" />
              <Button variant="outline" size="sm" onClick={() => setActiveTab("setup")}>Go to Setup</Button>
            </div>
          ) : (
            <>
              {output.contraindications?.hasAbsolute && (
                <Alert variant="destructive" className="border-red-500 bg-red-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Absolute contraindication present — HFOV should NOT be started</AlertTitle>
                  <AlertDescription className="mt-1 space-y-1">
                    {output.contraindications.items.filter((i) => i.severity === "absolute").map((item) => (
                      <p key={item.label} className="text-xs font-bold">• {item.label}: {item.reason}</p>
                    ))}
                  </AlertDescription>
                </Alert>
              )}

              {output.indications && (
                <Card>
                  <CardHeader className="pb-2 border-b bg-slate-50/50">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      HFOV Indication Assessment — {pathway === "neonatal" ? "Neonatal" : "Pediatric"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3 space-y-3">
                    <div className={cn("p-3 rounded-xl border-2", output.indications.hfovConsidered ? "bg-emerald-50 border-emerald-300" : "bg-amber-50 border-amber-300")}>
                      <p className={cn("font-black text-sm", output.indications.hfovConsidered ? "text-emerald-800" : "text-amber-800")}>
                        {output.indications.hfovConsidered
                          ? `HFOV may be considered — ${output.indications.criteriaMetCount} criterion/criteria met`
                          : "Insufficient criteria met — review data or optimise conventional ventilation first"}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium mt-1">{output.indications.note}</p>
                    </div>

                    {output.indications.metCriteria.length > 0 && (
                      <div className="space-y-1.5">
                        <SL>Criteria met</SL>
                        {output.indications.metCriteria.map((c, i) => (
                          <div key={i} className="flex gap-2 text-xs font-medium text-emerald-800 p-2 bg-emerald-50 rounded-xl border border-emerald-200">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-600" /> {c}
                          </div>
                        ))}
                      </div>
                    )}

                    {output.indications.unmetCriteria.length > 0 && (
                      <div className="space-y-1.5">
                        <SL>Not yet met</SL>
                        {output.indications.unmetCriteria.map((c, i) => (
                          <div key={i} className="flex gap-2 text-xs font-medium text-amber-800 p-2 bg-amber-50 rounded-xl border border-amber-200">
                            <ArrowRight className="h-3.5 w-3.5 shrink-0 mt-0.5" /> {c}
                          </div>
                        ))}
                      </div>
                    )}

                    {output.indications.warnings.map((w) => <WarnCard key={w.code} w={w} />)}
                  </CardContent>
                </Card>
              )}

              {/* Contraindications */}
              {output.contraindications && output.contraindications.items.length > 0 && (
                <Card className="border-red-200">
                  <CardHeader className="pb-2 border-b bg-red-50/30">
                    <CardTitle className="text-sm text-red-800 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Contraindications &amp; Cautions</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3 space-y-2">
                    {output.contraindications.items.map((item) => (
                      <div key={item.label} className={cn("p-3 rounded-xl border", item.severity === "absolute" ? "bg-red-50 border-red-300" : "bg-amber-50 border-amber-200")}>
                        <p className={cn("text-xs font-black", item.severity === "absolute" ? "text-red-900" : "text-amber-900")}>
                          {item.severity === "absolute" ? "ABSOLUTE: " : "RELATIVE: "}{item.label}
                        </p>
                        <p className={cn("text-xs font-medium mt-0.5", item.severity === "absolute" ? "text-red-800" : "text-amber-800")}>{item.reason}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Static reference indications */}
              <Card>
                <CardHeader className="pb-2 border-b bg-slate-50/50">
                  <CardTitle className="text-sm flex items-center gap-2"><BookOpen className="h-4 w-4 text-slate-600" /> Reference: HFOV Indications</CardTitle>
                </CardHeader>
                <CardContent className="pt-3 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <SL>Pediatric (PICU) — PALICC-2 / PEMVECC</SL>
                      {["OI ≥ 12–16 on optimised conventional MV (or OSI equivalent)", "Conventional MV failure: PIP > 30–35 cmH₂O or MAP > 15 cmH₂O", "Severe PARDS (OI ≥ 16)", "Air leak syndrome (PIE, pneumothorax) requiring low-volume strategy", "Refractory hypoxaemia despite PEEP optimisation + prone"].map((item, i) => (
                        <div key={i} className="flex gap-2 text-xs font-medium text-slate-700">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" /> {item}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <SL>Neonatal (NICU)</SL>
                      {["OI ≥ 8–10 on conventional MV", "RDS — primary or rescue HFOV when conventional fails", "MAS with refractory hypoxaemia (assess air trapping first)", "PPHN — to support lung recruitment for iNO efficacy", "CDH — gentle ventilation strategy (individualised)", "Pulmonary interstitial emphysema (PIE) — low-pressure strategy"].map((item, i) => (
                        <div key={i} className="flex gap-2 text-xs font-medium text-slate-700">
                          <CheckCircle2 className="h-3.5 w-3.5 text-purple-500 shrink-0 mt-0.5" /> {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-xs font-bold text-amber-800">⚠ HFOV should never be initiated from a single number alone. All clinical criteria, haemodynamics, trajectory, and senior/PICU/NICU input must be integrated. HFOV has NOT been shown to improve mortality vs conventional MV in RCTs — it is a rescue strategy.</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* ════════ INITIATION GUIDE ════════ */}
        <TabsContent value="guide" className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
          {!output.setupGuide ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <BookOpen className="h-10 w-10 opacity-20" />
              <p className="font-bold text-sm">Select pathway + diagnosis in Setup</p>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("setup")}>Go to Setup</Button>
            </div>
          ) : (
            <>
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl">
                <p className="text-sm font-black text-primary">{output.setupGuide.diagnosisLabel}</p>
                <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                  Suggested starting ranges — reassess after every change — senior/PICU/NICU review for all initiations and escalations
                </p>
              </div>

              {[
                { label: "MAP Concept",          val: output.setupGuide.mapConcept },
                { label: "Suggested MAP Range",  val: output.setupGuide.suggestedMapRange },
                { label: "Amplitude Concept",    val: output.setupGuide.amplitudeConcept },
                { label: "Suggested Amplitude",  val: output.setupGuide.suggestedAmplitudeRange },
                { label: "Frequency (Hz)",       val: output.setupGuide.suggestedFreqHz },
                { label: "FiO₂ Starting Point",  val: output.setupGuide.fio2Start },
                { label: "Inspiratory Time",     val: output.setupGuide.itime },
                { label: "Oxygenation Target",   val: output.setupGuide.oxyTarget },
                { label: "Ventilation Target",   val: output.setupGuide.ventTarget },
                { label: "CXR Target",           val: output.setupGuide.cxrTarget },
              ].map((row) => (
                <div key={row.label} className="p-3 border rounded-xl bg-white space-y-0.5">
                  <SL>{row.label}</SL>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">{row.val}</p>
                </div>
              ))}

              {output.setupGuide.specialCautions.length > 0 && (
                <Card className="border-amber-200">
                  <CardHeader className="pb-2 border-b bg-amber-50/50">
                    <CardTitle className="text-sm text-amber-800 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Special Cautions</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2 space-y-1.5">
                    {output.setupGuide.specialCautions.map((c, i) => (
                      <div key={i} className="flex gap-2 text-xs font-medium text-amber-800"><span className="shrink-0">⚠</span> {c}</div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {output.setupGuide.seniorReviewIf.length > 0 && (
                <Card className="border-red-200">
                  <CardHeader className="pb-2 border-b bg-red-50/30">
                    <CardTitle className="text-sm text-red-800 flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Senior/PICU/NICU Review If</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2 space-y-1.5">
                    {output.setupGuide.seniorReviewIf.map((s, i) => (
                      <div key={i} className="flex gap-2 text-xs font-medium text-red-800"><ArrowRight className="h-3 w-3 shrink-0 mt-0.5" /> {s}</div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* ════════ ADJUSTMENTS ════════ */}
        <TabsContent value="adjustment" className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
          {output.adjustments.length > 0 ? (
            <>
              <p className="text-xs font-bold text-slate-500 px-1">Data-driven adjustment guidance based on values entered.</p>
              {output.adjustments.map((guide) => (
                <AdjustmentGuideCard key={guide.id} guide={guide} />
              ))}
            </>
          ) : (
            <>
              <p className="text-xs font-bold text-slate-500 px-1">Reference adjustment logic — enter gas values in Setup for data-driven guidance.</p>
            </>
          )}

          {/* Static reference logic always shown */}
          <Card>
            <CardHeader className="pb-2 border-b bg-slate-50/50">
              <CardTitle className="text-sm">HFOV Adjustment Principles</CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-3">
              {[
                { title: "Oxygenation (SpO₂/PaO₂) ↑ LOW", action: "↑ MAP by 1–2 cmH₂O · ↑ FiO₂ · Consider CXR (underdistended?) · Reassess haemodynamics" },
                { title: "Oxygenation too HIGH / Wean", action: "↓ FiO₂ first (target < 40–50%) · Then ↓ MAP by 1–2 cmH₂O · Check CXR for overdistension" },
                { title: "Hypercapnia (↑ PaCO₂)", action: "↑ Amplitude (ΔP) by 5–10 cmH₂O · ↓ Frequency (Hz) by 1–2 · Check chest wiggle — if absent, look for obstruction/leak" },
                { title: "Hypocapnia (↓ PaCO₂)", action: "↓ Amplitude (ΔP) by 5–10 cmH₂O · ↑ Frequency (Hz) by 1–2 · URGENT in neonates — brain injury risk" },
                { title: "Haemodynamic deterioration", action: "Check overdistension (CXR > 9 ribs → ↓ MAP) · Fluid bolus 10 mL/kg · Vasopressors if needed · Senior review" },
                { title: "Air leak worsen", action: "↓ MAP to minimum · ↓ Amplitude to minimum · Accept lower SpO₂ / higher PaCO₂ · Ensure drain in situ · Senior review" },
              ].map((item) => (
                <div key={item.title} className="border rounded-xl overflow-hidden">
                  <div className="px-3 py-2 bg-slate-50 border-b">
                    <p className="text-xs font-black text-slate-800">{item.title}</p>
                  </div>
                  <p className="px-3 py-2 text-xs font-medium text-slate-700">{item.action}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ════════ MONITORING ════════ */}
        <TabsContent value="monitoring" className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
          <Card>
            <CardHeader className="pb-2 border-b bg-slate-50/50">
              <CardTitle className="text-sm flex items-center gap-2"><Activity className="h-4 w-4 text-blue-600" /> Monitoring After Initiation / Change</CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-3">
              {[
                { label: "ABG / Blood gas", val: "Obtain ABG (or CBG for neonates) 30–60 minutes after HFOV initiation. Repeat 30 min after ANY significant change in MAP, amplitude, or frequency. TcCO₂ monitoring continuously if available (especially neonates)." },
                { label: "SpO₂ + pre/post-ductal", val: "Continuous SpO₂ monitoring. In PPHN/CDH/MAS, monitor both pre-ductal (right hand) and post-ductal (foot) SpO₂ simultaneously." },
                { label: "Haemodynamics", val: "Continuous BP and HR monitoring for first 30–60 min after initiation. HFOV MAP impairs venous return. Have fluid and vasopressors ready." },
                { label: "Chest wiggle", val: "Assess visible chest wiggle at initiation and after every amplitude change. Target: visible vibration from clavicles to mid-thighs (pediatric) / umbilicus (neonatal). Absent wiggle = insufficient amplitude or ETT obstruction." },
                { label: "CXR — lung volume", val: "CXR 1–2 hours after initiation. Target 8–9 posterior ribs on AP view. > 9 ribs = overdistension → reduce MAP by 1 cmH₂O. < 7 ribs = underinflation → consider MAP increase. Repeat CXR after significant MAP changes." },
                { label: "ETT position + patency", val: "Confirm ETT depth on post-intubation CXR. Assess ETT patency regularly — mucus plugging is more common on HFOV due to high-flow gas and absence of sighs. Suction when clinically indicated." },
                { label: "Echocardiography", val: "Echo recommended in PPHN, CDH, and whenever haemodynamic instability occurs on HFOV. Assess RV function, septal position, ductal shunting direction, and ventricular filling." },
                { label: "Documentation", val: "Document all setting changes, clinical response, ABG values, and CXR findings. Record time of initiation, initial settings, and response at 30 and 60 minutes." },
              ].map((item) => (
                <div key={item.label} className="p-3 border rounded-xl bg-white space-y-0.5">
                  <SL>{item.label}</SL>
                  <p className="text-xs font-medium text-slate-700 leading-relaxed">{item.val}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ════════ WEANING ════════ */}
        <TabsContent value="weaning" className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
          {!output.hasMinimumData ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <Calculator className="h-10 w-10 opacity-20" />
              <Button variant="outline" size="sm" onClick={() => setActiveTab("setup")}>Go to Setup</Button>
            </div>
          ) : output.weaning && (
            <>
              <div className={cn("p-4 rounded-xl border-2", {
                "bg-emerald-50 border-emerald-300": output.weaning.status === "consider-weaning",
                "bg-red-50 border-red-300":         output.weaning.status === "not-ready",
                "bg-slate-50 border-slate-200":     output.weaning.status === "no-data",
              })}>
                <p className={cn("font-black text-sm", {
                  "text-emerald-800": output.weaning.status === "consider-weaning",
                  "text-red-800":     output.weaning.status === "not-ready",
                  "text-slate-600":   output.weaning.status === "no-data",
                })}>
                  {output.weaning.status === "consider-weaning" && "Computed criteria suggest: Consider formal weaning assessment — senior/PICU/NICU review required"}
                  {output.weaning.status === "not-ready"        && "Computed criteria suggest: Not ready for HFOV weaning"}
                  {output.weaning.status === "no-data"          && "Insufficient data — complete clinical assessment"}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-1">{output.weaning.note}</p>
              </div>

              {output.weaning.blockers.length > 0 && (
                <div className="space-y-2">
                  {output.weaning.blockers.map((b, i) => (
                    <div key={i} className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                      <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                      <p className="text-xs font-bold text-red-800">{b}</p>
                    </div>
                  ))}
                </div>
              )}

              <Card>
                <CardHeader className="pb-2 border-b bg-slate-50/50">
                  <CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Weaning Criteria</CardTitle>
                </CardHeader>
                <CardContent className="pt-3 space-y-2">
                  {output.weaning.criteria.map((c) => (
                    <div key={c.id} className="flex gap-3 p-3 rounded-xl border bg-white">
                      <div className={cn("w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black mt-0.5", {
                        "bg-emerald-100 text-emerald-700": c.met === true,
                        "bg-red-100 text-red-700":         c.met === false,
                        "bg-slate-100 text-slate-500":     c.met === null,
                      })}>
                        {c.met === true ? "✓" : c.met === false ? "✗" : "?"}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800">{c.label}</p>
                        <p className="text-[10px] font-medium text-slate-500 mt-0.5">{c.note}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="p-3 border rounded-xl bg-white space-y-0.5">
                <SL>Transition to conventional ventilation — concept</SL>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">{output.weaning.transitionConcept}</p>
              </div>

              {/* Static pathway weaning reference */}
              <Card>
                <CardHeader className="pb-2 border-b bg-slate-50/50">
                  <CardTitle className="text-sm">HFOV Weaning Pathway — Step by Step</CardTitle>
                </CardHeader>
                <CardContent className="pt-3 space-y-2">
                  {(pathway === "neonatal" ? [
                    { n: "1", t: "Wean FiO₂ first", d: "Reduce FiO₂ to ≤ 0.30–0.40 (RDS/MAS) while SpO₂ stable. Do not reduce MAP until FiO₂ is adequately weaned." },
                    { n: "2", t: "Reduce MAP gradually", d: "Reduce MAP by 0.5–1 cmH₂O steps every 2–4 hours. Reassess SpO₂ and chest wiggle after each step." },
                    { n: "3", t: "Monitor for derecruitment", d: "Sudden increase in FiO₂ requirement = derecruitment. Return MAP to previous level and reassess." },
                    { n: "4", t: "Transition criteria", d: "Consider transition to CPAP or synchronised conventional ventilation when MAP ≤ 10–12 cmH₂O (RDS/MAS) or ≤ 8 cmH₂O (PIE) with FiO₂ ≤ 0.40." },
                    { n: "5", t: "Apnoea precautions", d: "Especially in preterm — ensure caffeine/methylxanthines in place. Have CPAP or HFNC ready at bedside before transition." },
                  ] : [
                    { n: "1", t: "Wean FiO₂ first", d: "Reduce FiO₂ to ≤ 0.40–0.50 while maintaining SpO₂ target. FiO₂ should be weaned before MAP reduction." },
                    { n: "2", t: "Reduce MAP slowly", d: "Reduce MAP by 1–2 cmH₂O every 2–4 hours once FiO₂ ≤ 0.40–0.50. Check SpO₂ and repeat CXR as needed." },
                    { n: "3", t: "CXR lung volume check", d: "Target 8–9 posterior ribs. If overdistended, reduce MAP proactively. Derecruitment = sudden FiO₂ need → increase MAP." },
                    { n: "4", t: "Transition readiness", d: "Consider transition to conventional ventilation when MAP ≤ 14–16 cmH₂O and FiO₂ ≤ 0.40. Confirm haemodynamic stability." },
                    { n: "5", t: "Transition plan", d: "Agree conventional ventilation settings before transition. Use PARDS-appropriate lung-protective settings. Reassess ABG 30–60 min post-transition." },
                  ]).map((step) => (
                    <div key={step.n} className="flex gap-3 p-3 border rounded-xl bg-white">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs shrink-0">{step.n}</div>
                      <div>
                        <p className="text-xs font-black text-slate-800">{step.t}</p>
                        <p className="text-xs font-medium text-slate-600 mt-0.5">{step.d}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

      </Tabs>

      {/* References */}
      <div className="pt-3 border-t">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">References</p>
        <ul className="space-y-0.5 text-[9px] text-slate-400 font-medium">
          <li>• PALICC-2: Pediatric Acute Lung Injury Consensus Conference Group. PCCM 2023.</li>
          <li>• PEMVECC: Kneyber et al. Pediatr Crit Care Med 2017;18(8):e274-e310.</li>
          <li>• Henderson-Smart DJ et al. Cochrane Database Syst Rev 2009 — neonatal HFOV.</li>
          <li>• Abman SH et al. Pediatric Pulmonary Hypertension: AHA/ATS 2015.</li>
          <li>• Clinical decision support only. Not a substitute for clinical judgment or specialist review.</li>
        </ul>
      </div>
    </div>
  );
}
