import { useState, useMemo, useRef } from "react";
import {
  Wind, Activity, AlertTriangle, CheckCircle2, Calculator,
  ArrowRight, Info, TrendingUp, TrendingDown, RefreshCcw,
  BookOpen, Stethoscope, AlertCircle, ChevronDown, ChevronUp,
  Zap, Baby,
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
  type MVInputs, type MVFullOutput, type Diagnosis, type AgeUnit,
  runMVAssessment, ageToMonths,
} from "@/lib/calculators/mechanical-ventilation";
import {
  type NeonatalMVInputs, type NeonatalMVFullOutput, type NeonatalDiagnosis,
  NEONATAL_DIAG_LABELS, runNeonatalMVAssessment,
} from "@/lib/calculators/neonatal-ventilation";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActionPriority = "critical" | "high" | "medium" | "info";

interface PriorityAction {
  id: string;
  priority: ActionPriority;
  title: string;
  detected: string;
  consider: string;
  why?: string;
}

interface ParamRow {
  label: string;
  entered: string;
  suggested: string;
  status: "ok" | "concern" | "danger" | "neutral";
  statusLabel: string;
  direction: string;
  note: string;
  explanation: string;
}

// ─── Small UI helpers ─────────────────────────────────────────────────────────

function SL({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{children}</p>;
}

function parseNum(s: string): number | null {
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

const PRIORITY_META: Record<ActionPriority, { label: string; bg: string; border: string; dot: string; text: string }> = {
  critical: { label: "Critical", bg: "bg-red-50",    border: "border-red-300",   dot: "bg-red-600",   text: "text-red-800" },
  high:     { label: "High",     bg: "bg-amber-50",  border: "border-amber-300", dot: "bg-amber-500", text: "text-amber-800" },
  medium:   { label: "Consider", bg: "bg-blue-50",   border: "border-blue-200",  dot: "bg-blue-500",  text: "text-blue-800" },
  info:     { label: "Note",     bg: "bg-slate-50",  border: "border-slate-200", dot: "bg-slate-400", text: "text-slate-700" },
};

function ActionCard({ action, index }: { action: PriorityAction; index: number }) {
  const [open, setOpen] = useState(true);
  const m = PRIORITY_META[action.priority];
  return (
    <div className={cn("rounded-xl border", m.bg, m.border)}>
      <button className="w-full flex items-start gap-3 p-3 text-left" onClick={() => setOpen(!open)}>
        <div className={cn("w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-white text-[10px] font-black mt-0.5", m.dot)}>
          {index}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className={cn("text-xs font-black leading-tight", m.text)}>{action.title}</p>
            <div className="flex items-center gap-1 shrink-0">
              <Badge variant="outline" className={cn("text-[9px] font-black px-1.5 py-0", m.text, m.border)}>
                {m.label}
              </Badge>
              {open ? <ChevronUp className="h-3 w-3 text-slate-400" /> : <ChevronDown className="h-3 w-3 text-slate-400" />}
            </div>
          </div>
          <p className={cn("text-[11px] font-medium mt-0.5", m.text)}>{action.detected}</p>
        </div>
      </button>
      {open && (
        <div className={cn("px-3 pb-3 space-y-1.5 border-t", m.border)}>
          <div className="flex gap-2 pt-2">
            <ArrowRight className={cn("h-3 w-3 shrink-0 mt-0.5", m.dot.replace("bg-", "text-"))} />
            <p className={cn("text-xs font-bold leading-relaxed", m.text)}>{action.consider}</p>
          </div>
          {action.why && (
            <p className="text-[10px] text-slate-500 font-medium pl-5 leading-relaxed">{action.why}</p>
          )}
        </div>
      )}
    </div>
  );
}

function StatusDot({ status }: { status: ParamRow["status"] }) {
  return (
    <div className={cn("w-2 h-2 rounded-full shrink-0", {
      "bg-emerald-500": status === "ok",
      "bg-amber-500":   status === "concern",
      "bg-red-600":     status === "danger",
      "bg-slate-300":   status === "neutral",
    })} />
  );
}

// ─── Initial Settings card (pre-gas starter, shared pediatric + neonatal) ──────

interface InitialSettingsView {
  diagnosisLabel: string;
  modeSuggestion: string;
  vtMl: string;
  vtPerKg: string;
  rr: string;
  peep: string;
  pressure: string;
  itime: string;
  ieRatio?: string;
  fio2Start: string;
  spo2Target: string;
  co2Target: string;
  keyCautions: string[];
  titrationNote: string;
}

function InitialSettingsCard({ v }: { v: InitialSettingsView }) {
  const [cautionsOpen, setCautionsOpen] = useState(false);
  return (
    <Card className="border-2 border-teal-300">
      <CardHeader className="pb-2 border-b bg-teal-50/70">
        <CardTitle className="text-sm flex items-center gap-2">
          <Zap className="h-4 w-4 text-teal-700" />
          Suggested Initial Settings
          <span className="text-[10px] text-slate-400 font-medium ml-1">— {v.diagnosisLabel} · no readings required</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3 space-y-3">
        {/* Headline computed VT */}
        <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
          <SL>Tidal Volume — computed for this weight</SL>
          <p className="text-2xl font-black text-teal-800 mt-0.5">{v.vtMl}</p>
          <p className="text-[10px] text-teal-600 font-bold">{v.vtPerKg}</p>
        </div>

        {/* Core numbers grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { l: "RR", val: v.rr },
            { l: "PEEP", val: v.peep },
            { l: "I-Time", val: v.itime + (v.ieRatio ? ` · I:E ${v.ieRatio}` : "") },
            { l: "FiO₂ start", val: v.fio2Start },
            { l: "SpO₂ target", val: v.spo2Target },
            { l: "CO₂ / pH target", val: v.co2Target },
          ].map((x) => (
            <div key={x.l} className="p-2.5 bg-white border rounded-xl">
              <SL>{x.l}</SL>
              <p className="text-xs font-black text-slate-800 mt-0.5 leading-snug">{x.val}</p>
            </div>
          ))}
        </div>

        {/* Mode + pressure */}
        <div className="space-y-2">
          <div className="p-2.5 bg-white border rounded-xl">
            <SL>Mode</SL>
            <p className="text-xs font-medium text-slate-700 mt-0.5">{v.modeSuggestion}</p>
          </div>
          <div className="p-2.5 bg-white border rounded-xl">
            <SL>Pressure / PIP</SL>
            <p className="text-xs font-medium text-slate-700 mt-0.5">{v.pressure}</p>
          </div>
        </div>

        {/* Cautions (collapsible) */}
        {v.keyCautions.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
            <button className="w-full flex items-center justify-between px-3 py-2" onClick={() => setCautionsOpen(!cautionsOpen)}>
              <span className="text-xs font-black text-amber-800 flex items-center gap-2"><AlertTriangle className="h-3.5 w-3.5" /> Key cautions ({v.keyCautions.length})</span>
              {cautionsOpen ? <ChevronUp className="h-3.5 w-3.5 text-amber-600" /> : <ChevronDown className="h-3.5 w-3.5 text-amber-600" />}
            </button>
            {cautionsOpen && (
              <div className="px-3 pb-2.5 space-y-1.5">
                {v.keyCautions.map((c, i) => (
                  <div key={i} className="flex gap-2 text-xs font-medium text-amber-800"><span className="shrink-0">⚠</span>{c}</div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-[10px] font-bold text-blue-800">
            ⓘ {v.titrationNote} These are suggested starting ranges only — not fixed commands. Titrate to clinical response. Senior review before significant changes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Logic: scenario-specific numeric targets ─────────────────────────────────

function getNumericTargets(diag: Diagnosis | "") {
  switch (diag) {
    case "pards":        return { vtMin: 3, vtMax: 6, peepMin: 8,  peepMax: 15, pplatMax: 28, fio2Target: "Wean to lowest tolerated — SpO₂ 88–92%" };
    case "asthma":       return { vtMin: 6, vtMax: 8, peepMin: 0,  peepMax: 5,  pplatMax: 35, fio2Target: "Titrate to SpO₂ ≥ 92%" };
    case "bronchiolitis":return { vtMin: 5, vtMax: 7, peepMin: 5,  peepMax: 8,  pplatMax: 30, fio2Target: "Titrate to SpO₂ ≥ 92–94%" };
    case "shock":        return { vtMin: 6, vtMax: 8, peepMin: 4,  peepMax: 6,  pplatMax: 30, fio2Target: "Start 100%, wean to SpO₂ ≥ 92%" };
    case "raised-icp":   return { vtMin: 6, vtMax: 8, peepMin: 4,  peepMax: 6,  pplatMax: 30, fio2Target: "SpO₂ ≥ 94%" };
    case "post-arrest":  return { vtMin: 6, vtMax: 8, peepMin: 4,  peepMax: 6,  pplatMax: 30, fio2Target: "SpO₂ 94–98% — avoid hyperoxia" };
    case "neuromuscular":return { vtMin: 6, vtMax: 8, peepMin: 4,  peepMax: 6,  pplatMax: 30, fio2Target: "SpO₂ ≥ 94–97%" };
    default:             return { vtMin: 6, vtMax: 8, peepMin: 4,  peepMax: 8,  pplatMax: 30, fio2Target: "SpO₂ 92–97%" };
  }
}

// ─── Logic: priority actions ──────────────────────────────────────────────────

function generatePriorityActions(
  inputs: MVInputs,
  output: MVFullOutput,
): PriorityAction[] {
  const actions: PriorityAction[] = [];
  const tgt = getNumericTargets(inputs.diagnosis);
  const vtPerKg = (inputs.measuredVtMl && inputs.weightKg)
    ? inputs.measuredVtMl / inputs.weightKg : null;

  // ── Critical ──────────────────────────────────────────────────────────────

  if (output.oxygenation?.pards.grade === "severe") {
    const idx = output.oxygenation.pards.usedIndex;
    const val = idx === "OI" ? output.oxygenation.pards.oi : output.oxygenation.pards.osi;
    actions.push({
      id: "severe-pards",
      priority: "critical",
      title: "Severe PARDS — escalation required",
      detected: `${idx} = ${val}. Meets severe PARDS criteria (PALICC-2: OI ≥ 16 / OSI ≥ 12.3).`,
      consider: "Ensure lung-protective VT 3–6 mL/kg and Pplat ≤ 28 cmH₂O. Discuss prone positioning, HFOV, and ECMO consultation with senior/PICU team immediately.",
      why: "Severe PARDS carries high mortality. Escalation and senior decision-making are essential per PALICC-2.",
    });
  }

  if (output.oxygenation?.dpSeverity === "danger") {
    const dp = output.oxygenation.drivingPressure;
    actions.push({
      id: "high-dp",
      priority: "critical",
      title: "High driving pressure — VILI risk",
      detected: `ΔP = ${dp} cmH₂O (Pplat ${inputs.pip} − PEEP ${inputs.peep}). Target is < 15 cmH₂O.`,
      consider: "Consider reducing PEEP by 1–2 cmH₂O and reassessing, or reducing the Pplat/PIP target. Reassess with repeat ABG after each change.",
      why: "Driving pressure > 20 cmH₂O is independently associated with VILI. PALICC-2 recommends minimising ΔP.",
    });
  }

  if (inputs.ph !== null && inputs.ph < 7.10) {
    actions.push({
      id: "severe-acidosis",
      priority: "critical",
      title: "Severe acidosis — pH < 7.10",
      detected: `pH = ${inputs.ph}. Severe acidosis requires immediate assessment.`,
      consider: "Identify and treat the cause (respiratory vs metabolic). Increase minute ventilation if respiratory. Consider bicarbonate if predominantly metabolic. Senior/PICU review immediately.",
      why: "pH < 7.10 impairs cardiac contractility and response to vasopressors.",
    });
  }

  if (inputs.spo2 !== null && inputs.spo2 < 85) {
    actions.push({
      id: "critical-hypoxemia",
      priority: "critical",
      title: "Severe hypoxaemia — SpO₂ < 85%",
      detected: `SpO₂ = ${inputs.spo2}%. Below safe threshold.`,
      consider: "Apply DOPES protocol immediately. Increase FiO₂ to 100% while troubleshooting. Bag manually if vent cause not quickly identified.",
      why: "SpO₂ < 85% is an emergency. Systematic DOPES assessment prevents missed causes.",
    });
  }

  if (inputs.fio2Percent !== null && inputs.fio2Percent > 80) {
    actions.push({
      id: "critical-fio2",
      priority: "critical",
      title: "FiO₂ > 80% — oxygen toxicity risk",
      detected: `FiO₂ = ${inputs.fio2Percent}%. High FiO₂ sustained increases O₂ toxicity risk.`,
      consider: "Optimise PEEP to recruit alveoli and allow FiO₂ reduction. If refractory, consider prone positioning, HFOV, or ECMO consultation (senior decision).",
      why: "Prolonged high FiO₂ causes absorptive atelectasis and direct lung injury.",
    });
  }

  if (inputs.lactate !== null && inputs.lactate >= 4) {
    actions.push({
      id: "critical-lactate",
      priority: "critical",
      title: "Severe hyperlactataemia — shock likely",
      detected: `Lactate = ${inputs.lactate} mmol/L. Consistent with significant shock or organ hypoperfusion.`,
      consider: "Address perfusion urgently — fluids, vasopressors, identify cause. Weaning and extubation contraindicated. Senior/PICU review.",
      why: "Lactate ≥ 4 mmol/L predicts poor outcome without rapid intervention.",
    });
  }

  // ── High ──────────────────────────────────────────────────────────────────

  if (output.oxygenation?.pards.grade === "moderate") {
    const idx = output.oxygenation.pards.usedIndex;
    const val = idx === "OI" ? output.oxygenation.pards.oi : output.oxygenation.pards.osi;
    actions.push({
      id: "moderate-pards",
      priority: "high",
      title: "Moderate PARDS — review ventilator targets",
      detected: `${idx} = ${val}. Meets moderate PARDS criteria (PALICC-2: OI 8–16 / OSI 7.5–12.3).`,
      consider: "Ensure VT 3–6 mL/kg and Pplat ≤ 28 cmH₂O. Consider optimising PEEP (8–12 cmH₂O). Discuss prone positioning with senior team. Reassess OI/OSI after each change.",
      why: "Moderate PARDS requires lung-protective ventilation per PALICC-2. Senior review should be proactive, not reactive.",
    });
  }

  if (inputs.peep !== null && inputs.diagnosis === "pards" && inputs.peep < tgt.peepMin) {
    actions.push({
      id: "low-peep-pards",
      priority: "high",
      title: "PEEP below recommended range for PARDS",
      detected: `PEEP ${inputs.peep} cmH₂O entered. For PARDS, suggest ${tgt.peepMin}–${tgt.peepMax} cmH₂O (PALICC-2).`,
      consider: `Consider increasing PEEP toward ${tgt.peepMin}–${tgt.peepMax} cmH₂O in steps of 1–2 cmH₂O. Reassess oxygenation and haemodynamics after each step.`,
      why: "Adequate PEEP prevents alveolar collapse and is central to PARDS lung-protective strategy.",
    });
  }

  if (inputs.peep !== null && inputs.diagnosis === "asthma" && inputs.peep > tgt.peepMax) {
    actions.push({
      id: "high-peep-asthma",
      priority: "high",
      title: "PEEP may worsen air trapping in asthma",
      detected: `PEEP ${inputs.peep} cmH₂O. For asthma/obstructive disease, suggest ${tgt.peepMin}–${tgt.peepMax} cmH₂O.`,
      consider: "Consider reducing PEEP. Intrinsic PEEP (auto-PEEP) from air trapping may make low set-PEEP appropriate or even necessary. Measure auto-PEEP if possible.",
      why: "Excessive PEEP in obstructive disease adds to intrinsic PEEP, worsening hyperinflation and haemodynamic compromise.",
    });
  }

  if (vtPerKg !== null && vtPerKg > tgt.vtMax) {
    const severity: ActionPriority = vtPerKg > 10 ? "high" : "medium";
    actions.push({
      id: "high-vt",
      priority: severity,
      title: `Measured VT ${vtPerKg.toFixed(1)} mL/kg — above target`,
      detected: `${inputs.measuredVtMl} mL ÷ ${inputs.weightKg} kg = ${vtPerKg.toFixed(1)} mL/kg. Suggested range: ${tgt.vtMin}–${tgt.vtMax} mL/kg for ${inputs.diagnosis || "this patient"}.`,
      consider: inputs.diagnosis === "pards"
        ? `Consider reducing PIP/pressure target to lower VT toward 3–6 mL/kg. Accept permissive hypercapnia (pH ≥ 7.20) to achieve lung protection.`
        : `Consider reducing PIP or switching to volume-targeted mode. Reassess Pplat and driving pressure after change.`,
      why: "Volutrauma from excessive VT is a major mechanism of VILI.",
    });
  }

  if (inputs.fio2Percent !== null && inputs.fio2Percent > 60 && inputs.fio2Percent <= 80) {
    actions.push({
      id: "high-fio2",
      priority: "high",
      title: "FiO₂ > 60% — consider PEEP optimisation",
      detected: `FiO₂ = ${inputs.fio2Percent}%.${inputs.peep !== null ? ` Current PEEP ${inputs.peep} cmH₂O.` : ""}`,
      consider: "Before accepting prolonged high FiO₂, consider a PEEP titration trial or recruitment manoeuvre (senior-guided). Target lowest FiO₂ compatible with adequate SpO₂.",
      why: "Higher PEEP often allows FiO₂ reduction by improving V/Q matching and reducing shunt.",
    });
  }

  if (output.oxygenation?.dpSeverity === "concern") {
    const dp = output.oxygenation.drivingPressure;
    actions.push({
      id: "elevated-dp",
      priority: "high",
      title: "Elevated driving pressure — aim to reduce",
      detected: `ΔP = ${dp} cmH₂O (Pplat ${inputs.pip} − PEEP ${inputs.peep}). Aim < 15 cmH₂O.`,
      consider: "Consider small PEEP or Pplat adjustments to reduce ΔP. Each change should be followed by reassessment of oxygenation and haemodynamics.",
      why: "Driving pressure 15–20 cmH₂O is associated with elevated VILI risk.",
    });
  }

  if (inputs.diagnosis === "asthma" && inputs.rr !== null) {
    const rrByAge = output.ageMonths !== null
      ? (output.ageMonths < 12 ? 25 : output.ageMonths < 36 ? 20 : output.ageMonths < 96 ? 15 : 12)
      : 15;
    if (inputs.rr > rrByAge + 5) {
      actions.push({
        id: "high-rr-asthma",
        priority: "high",
        title: "RR may be too high for asthma — worsening air trapping",
        detected: `RR ${inputs.rr} bpm set. For asthma, consider 10–16 bpm to allow adequate expiratory time.`,
        consider: "Consider reducing RR to 10–16 bpm and extending expiratory time (I:E ≥ 1:3). Do NOT increase RR to correct hypercapnia in asthma — it worsens air trapping.",
        why: "Inadequate expiratory time causes breath stacking, auto-PEEP, and haemodynamic compromise in obstructive disease.",
      });
    }
  }

  if (
    (inputs.diagnosis === "raised-icp" || inputs.diagnosis === "post-arrest") &&
    inputs.pco2 !== null && (inputs.pco2 > 45 || inputs.pco2 < 32)
  ) {
    const low = inputs.pco2 < 32;
    actions.push({
      id: "pco2-neuro",
      priority: "high",
      title: `PaCO₂ ${low ? "too low" : "elevated"} — neurological risk`,
      detected: `PaCO₂ = ${inputs.pco2} mmHg. Target normocapnia 35–40 mmHg in ${inputs.diagnosis === "raised-icp" ? "raised ICP" : "post-arrest"}.`,
      consider: low
        ? "Reduce RR or VT/PIP cautiously. PaCO₂ < 32 causes severe cerebral vasoconstriction. Avoid unless directed by senior for ICP rescue."
        : "Consider increasing RR or VT cautiously. Monitor ETCO₂ continuously. Reassess ABG after change.",
      why: low
        ? "Hypocapnia causes cerebral ischaemia through vasoconstriction — particularly harmful in TBI and post-arrest."
        : "Hypercapnia dilates cerebral vessels and raises ICP.",
    });
  }

  if (inputs.lactate !== null && inputs.lactate >= 2 && inputs.lactate < 4) {
    actions.push({
      id: "elevated-lactate",
      priority: "high",
      title: "Elevated lactate — haemodynamic instability",
      detected: `Lactate = ${inputs.lactate} mmol/L. Consistent with impaired perfusion or early shock.`,
      consider: "Address the cause of hyperlactataemia before considering weaning. Ensure adequate volume status and organ perfusion. Weaning assessment should be deferred until lactate normalises.",
      why: "Weaning from ventilatory support in a haemodynamically unstable patient increases cardiovascular stress and risk of failure.",
    });
  }

  if (inputs.ph !== null && inputs.ph < 7.20 && inputs.ph >= 7.10) {
    actions.push({
      id: "significant-acidosis",
      priority: "high",
      title: "Significant acidosis — pH < 7.20",
      detected: `pH = ${inputs.ph}. Requires close monitoring and likely intervention.`,
      consider: output.ventilation?.permissiveApplies
        ? "Permissive hypercapnia strategy applies for this diagnosis. If pH < 7.20, consider cautious increase in RR only if not contraindicated. Senior review."
        : "Consider increasing minute ventilation (RR first, then VT/PIP if needed). Reassess ABG in 30–60 min. Senior review.",
      why: "pH < 7.20 compromises cardiac function and vasoresponse.",
    });
  }

  // ── Medium ────────────────────────────────────────────────────────────────

  if (output.oxygenation?.pards.grade === "mild") {
    const idx = output.oxygenation.pards.usedIndex;
    const val = idx === "OI" ? output.oxygenation.pards.oi : output.oxygenation.pards.osi;
    actions.push({
      id: "mild-pards",
      priority: "medium",
      title: "Mild PARDS — monitor and optimise",
      detected: `${idx} = ${val}. Mild PARDS criteria (PALICC-2: OI 4–8 / OSI 5–7.5).`,
      consider: "Maintain lung-protective VT 4–6 mL/kg and Pplat ≤ 28 cmH₂O. Monitor daily — reassess if OI/OSI worsens. Ensure PEEP is adequate (typically ≥ 5 cmH₂O).",
      why: "Mild PARDS can progress to moderate/severe without adequate early management.",
    });
  }

  if (output.ventilation?.permissiveApplies) {
    actions.push({
      id: "permissive-hypercapnia",
      priority: "medium",
      title: "Permissive hypercapnia strategy applies",
      detected: `pH ${inputs.ph} / PaCO₂ ${inputs.pco2} mmHg. Elevated PaCO₂ acceptable for this diagnosis.`,
      consider: "Do NOT increase RR or VT solely to correct PaCO₂ if pH ≥ 7.20. Prioritise lung-protective targets over normocapnia.",
      why: output.ventilation.permissiveNote,
    });
  }

  if (inputs.pip !== null && inputs.pip > 28 && inputs.diagnosis === "pards") {
    actions.push({
      id: "high-pplat",
      priority: "medium",
      title: "Pplat above PALICC-2 limit for PARDS",
      detected: `PIP/Pplat = ${inputs.pip} cmH₂O. PALICC-2 recommends Pplat ≤ 28 cmH₂O.`,
      consider: "Consider reducing VT or RR to lower Pplat. Accept permissive hypercapnia if needed to maintain lung protection.",
      why: "High Pplat reflects lung overdistension — a major driver of VILI in PARDS.",
    });
  }

  if (inputs.diagnosis === "shock") {
    actions.push({
      id: "shock-vent-notes",
      priority: "medium",
      title: "Shock: minimise airway pressure impact on haemodynamics",
      detected: `Diagnosis: shock. Positive pressure ventilation reduces preload.`,
      consider: "Use lowest PEEP compatible with adequate oxygenation (target 4–6 cmH₂O). Avoid high mean airway pressure. Have vasopressors and fluid prepared for post-intubation haemodynamic management.",
      why: "Positive intrathoracic pressure from PEEP and MV reduces venous return and can worsen cardiogenic or distributive shock.",
    });
  }

  if (
    inputs.diagnosis === "post-arrest" &&
    inputs.fio2Percent !== null && inputs.fio2Percent > 50 &&
    inputs.spo2 !== null && inputs.spo2 >= 97
  ) {
    actions.push({
      id: "hyperoxia-post-arrest",
      priority: "medium",
      title: "Possible hyperoxia post-arrest — consider FiO₂ reduction",
      detected: `SpO₂ ${inputs.spo2}% on FiO₂ ${inputs.fio2Percent}%. Post-arrest target SpO₂ 94–98%.`,
      consider: "Consider weaning FiO₂ toward lowest value maintaining SpO₂ 94–98%. Avoid SpO₂ > 99% (hyperoxia).",
      why: "Hyperoxia post-cardiac arrest is associated with worse neurological outcomes.",
    });
  }

  // ── Info ──────────────────────────────────────────────────────────────────

  if (!output.oxygenation?.pards.oi && !output.oxygenation?.pards.osi) {
    const missing: string[] = [];
    if (!inputs.fio2Percent) missing.push("FiO₂");
    if (!inputs.mapAirway) missing.push("MAP");
    if (!inputs.pao2 && !inputs.spo2) missing.push("PaO₂ or SpO₂");
    if (missing.length > 0) {
      actions.push({
        id: "no-oi",
        priority: "info",
        title: "OI/OSI not yet calculable",
        detected: `Missing: ${missing.join(", ")}`,
        consider: "Enter FiO₂ (%), mean airway pressure (MAP), and either PaO₂ (mmHg) or SpO₂ (%) in Setup to compute the Oxygenation Index (PALICC-2 severity).",
      });
    }
  }

  if (!inputs.pip || !inputs.peep) {
    actions.push({
      id: "no-dp",
      priority: "info",
      title: "Driving pressure not yet calculable",
      detected: `Enter Pplat and PEEP in Setup to compute ΔP.`,
      consider: "Driving pressure (ΔP = Pplat − PEEP) is a key lung protection target. Aim < 15 cmH₂O.",
    });
  }

  // Sort: critical → high → medium → info
  const order: Record<ActionPriority, number> = { critical: 0, high: 1, medium: 2, info: 3 };
  return actions.sort((a, b) => order[a.priority] - order[b.priority]);
}

// ─── Logic: parameter comparison rows ────────────────────────────────────────

function buildParamRows(inputs: MVInputs, output: MVFullOutput): ParamRow[] {
  const rows: ParamRow[] = [];
  const tgt = getNumericTargets(inputs.diagnosis);
  const diagLabel = inputs.diagnosis ? (DIAG_LABELS[inputs.diagnosis] ?? inputs.diagnosis) : "this diagnosis";
  const vtPerKg = (inputs.measuredVtMl && inputs.weightKg)
    ? parseFloat((inputs.measuredVtMl / inputs.weightKg).toFixed(1)) : null;

  // FiO₂
  if (inputs.fio2Percent !== null) {
    const f = inputs.fio2Percent;
    const status = f > 80 ? "danger" : f > 60 ? "concern" : "ok";
    rows.push({
      label: "FiO₂",
      entered: `${f}%`,
      suggested: tgt.fio2Target,
      status,
      statusLabel: status === "ok" ? "In range" : status === "concern" ? "↑ Elevated" : "↑ High risk",
      direction: status === "ok" ? "" : "↑ Too high",
      note: status === "danger" ? "Very high — oxygen toxicity risk" : status === "concern" ? "Elevated — consider PEEP optimisation" : "Within acceptable range",
      explanation: status === "danger"
        ? "FiO₂ > 80% sustained carries a significant risk of oxygen toxicity (absorptive atelectasis and direct lung injury). If oxygenation remains inadequate despite PEEP optimisation, consider escalation: prone positioning, HFOV, or ECMO consultation (senior/PICU decision)."
        : status === "concern"
        ? "FiO₂ > 60% sustained may cause absorptive atelectasis and lung injury over time. Before accepting this level long-term, consider a PEEP optimisation trial — higher PEEP often improves V/Q matching and allows FiO₂ reduction. Always weigh oxygenation adequacy against toxicity risk."
        : "FiO₂ is within an acceptable range for this patient. Continue titrating to the lowest level that maintains your SpO₂ target. Wean FiO₂ before reducing PEEP when oxygenation improves.",
    });
  }

  // PEEP
  if (inputs.peep !== null) {
    const p = inputs.peep;
    const tooLow = p < tgt.peepMin;
    const tooHigh = p > tgt.peepMax + 3;
    const status = tooLow || tooHigh ? "concern" : "ok";
    rows.push({
      label: "PEEP",
      entered: `${p} cmH₂O`,
      suggested: `${tgt.peepMin}–${tgt.peepMax} cmH₂O`,
      status,
      statusLabel: status === "ok" ? "In range" : tooLow ? "↓ Below range" : "↑ Above range",
      direction: tooLow ? "↓ Too low" : tooHigh ? "↑ Too high" : "",
      note: tooLow ? "Below suggested range" : tooHigh ? "Above suggested range" : "Within suggested range",
      explanation: tooLow
        ? `For ${diagLabel}, PEEP ${tgt.peepMin}–${tgt.peepMax} cmH₂O is suggested. Low PEEP allows alveolar collapse at end-expiration, worsening oxygenation and causing atelectrauma. Consider increasing PEEP in steps of 1–2 cmH₂O, reassessing oxygenation and haemodynamics after each step.`
        : tooHigh
        ? `PEEP is above the suggested range for ${diagLabel}. Excessively high PEEP can impair venous return (reducing preload and cardiac output) and worsen haemodynamics — particularly in shock or obstructive disease where auto-PEEP is already elevated. Consider reducing if haemodynamics are affected.`
        : `PEEP is within the suggested range for ${diagLabel}. Continue monitoring oxygenation and haemodynamics. In PARDS, PEEP should be titrated individually — no fixed table is universally optimal.`,
    });
  }

  // VT/kg
  if (vtPerKg !== null) {
    const tooHigh = vtPerKg > tgt.vtMax;
    const veryHigh = vtPerKg > 10;
    const status: ParamRow["status"] = veryHigh ? "danger" : tooHigh ? "concern" : "ok";
    rows.push({
      label: "VT / kg",
      entered: `${vtPerKg} mL/kg`,
      suggested: `${tgt.vtMin}–${tgt.vtMax} mL/kg`,
      status,
      statusLabel: status === "ok" ? "In range" : status === "concern" ? "↑ Above target" : "↑ High risk",
      direction: status === "ok" ? "" : "↑ Too high",
      note: veryHigh ? "Volutrauma risk — reduce VT" : tooHigh ? "Above lung-protective range" : "Within lung-protective range",
      explanation: veryHigh
        ? `Tidal volume ${vtPerKg} mL/kg significantly exceeds safe limits. Volutrauma (lung injury from excessive volume) is a major driver of ventilator-induced lung injury (VILI). Reducing VT is a priority — even if it means accepting permissive hypercapnia (pH ≥ 7.20 is acceptable in PARDS per PALICC-2). Consider switching to volume-targeted mode to control VT precisely.`
        : tooHigh
        ? `VT ${vtPerKg} mL/kg is above the lung-protective target of ${tgt.vtMin}–${tgt.vtMax} mL/kg for ${diagLabel}. Consider reducing the PIP/pressure target to lower VT. Reassess with repeat measured VT and ABG after each change.`
        : `Measured VT ${vtPerKg} mL/kg is within the lung-protective range for ${diagLabel}. Continue monitoring. Note: VT targets are based on ideal body weight — use expected weight for height rather than actual weight in obese patients.`,
    });
  }

  // Driving pressure
  if (output.oxygenation?.drivingPressure != null) {
    const dp = output.oxygenation.drivingPressure;
    const status: ParamRow["status"] = dp > 20 ? "danger" : dp > 15 ? "concern" : "ok";
    rows.push({
      label: "Driving ΔP",
      entered: `${dp} cmH₂O`,
      suggested: "< 15 cmH₂O",
      status,
      statusLabel: status === "ok" ? "In range" : status === "concern" ? "↑ Elevated" : "↑ High risk",
      direction: status === "ok" ? "" : "↑ Too high",
      note: status === "danger" ? "HIGH VILI RISK — reduce Pplat or PEEP" : status === "concern" ? "Elevated — aim to reduce" : "Acceptable",
      explanation: status === "danger"
        ? `Driving pressure (ΔP = Pplat − PEEP) of ${dp} cmH₂O is strongly associated with ventilator-induced lung injury (VILI). ΔP represents the stress placed on lung tissue with each breath. Reducing ΔP below 15 cmH₂O should be a priority — adjust PEEP and/or Pplat, reassessing oxygenation and haemodynamics after each step. Senior/PICU review recommended.`
        : status === "concern"
        ? `Driving pressure (ΔP = Pplat − PEEP) of ${dp} cmH₂O is in the elevated zone (15–20 cmH₂O). Studies show higher ΔP is independently associated with worse PARDS outcomes. Consider small adjustments to PEEP or Pplat to reduce ΔP toward < 15 cmH₂O while maintaining acceptable oxygenation.`
        : `Driving pressure (ΔP = Pplat − PEEP) is ${dp} cmH₂O — within the acceptable range (< 15 cmH₂O). This suggests reasonable lung mechanics. Continue monitoring — ΔP can change as lung compliance improves or worsens.`,
    });
  }

  // Pplat
  if (inputs.pip !== null) {
    const pp = inputs.pip;
    const limit = tgt.pplatMax;
    const status: ParamRow["status"] = pp > limit ? "danger" : pp > limit - 4 ? "concern" : "ok";
    rows.push({
      label: "Pplat / PIP",
      entered: `${pp} cmH₂O`,
      suggested: `≤ ${limit} cmH₂O`,
      status,
      statusLabel: status === "ok" ? "In range" : status === "concern" ? "↑ Near limit" : "↑ Exceeds limit",
      direction: status === "ok" ? "" : "↑ Too high",
      note: status === "danger" ? "Exceeds recommended limit" : status === "concern" ? "Near limit — monitor" : "Within recommended limit",
      explanation: status === "danger"
        ? `Plateau/peak pressure ${pp} cmH₂O exceeds the recommended limit of ≤ ${limit} cmH₂O for ${diagLabel} (PALICC-2 recommends Pplat ≤ 28 cmH₂O in PARDS). High Pplat risks barotrauma (air leak, pneumothorax) and reflects lung overdistension. Consider reducing VT — accept permissive hypercapnia if needed to maintain lung protection.`
        : status === "concern"
        ? `Plateau/peak pressure ${pp} cmH₂O is approaching the recommended limit of ≤ ${limit} cmH₂O for ${diagLabel}. Monitor closely, particularly if lung compliance worsens. Consider proactively reducing VT or RR before the limit is exceeded.`
        : `Plateau/peak pressure is within the recommended limit for ${diagLabel}. This suggests adequate lung protection at current settings. Continue monitoring — Pplat may rise if compliance decreases (e.g., secretions, progressive ARDS, pneumothorax).`,
    });
  }

  // pH
  if (inputs.ph !== null) {
    const danger = inputs.ph < 7.10 || inputs.ph > 7.55;
    const concern = inputs.ph < 7.25 || inputs.ph > 7.48;
    const status: ParamRow["status"] = danger ? "danger" : concern ? "concern" : "ok";
    const low = inputs.ph < 7.30;
    rows.push({
      label: "pH",
      entered: `${inputs.ph}`,
      suggested: "7.30–7.45",
      status,
      statusLabel: status === "ok" ? "In range" : low ? "↓ Acidosis" : "↑ Alkalosis",
      direction: low ? "↓ Too low" : status !== "ok" ? "↑ Too high" : "",
      note: inputs.ph < 7.10 ? "Severe acidosis" : inputs.ph < 7.25 ? "Significant acidosis" : inputs.ph > 7.50 ? "Alkalosis" : "Acceptable",
      explanation: inputs.ph < 7.10
        ? `pH ${inputs.ph} represents severe acidosis. This level impairs cardiac contractility, vasoresponse to catecholamines, and cellular function. Urgently assess whether this is primarily respiratory (↑ PaCO₂) or metabolic (↓ HCO₃). Increase minute ventilation if respiratory cause. Treat metabolic cause. Senior/PICU review immediately.`
        : inputs.ph < 7.25
        ? `pH ${inputs.ph} represents significant acidosis requiring close monitoring and likely intervention. Determine respiratory vs metabolic contribution using PaCO₂ and HCO₃. In PARDS/asthma, permissive hypercapnia may be acceptable if pH ≥ 7.20. Reassess after any ventilator change.`
        : inputs.ph > 7.50
        ? `pH ${inputs.ph} represents alkalosis. Respiratory alkalosis (low PaCO₂) is the most common cause in ventilated patients. Consider reducing RR or VT/PIP — especially important in neurologic patients where hypocapnia causes cerebral vasoconstriction.`
        : `pH ${inputs.ph} is within the acceptable range. Continue current ventilator settings and reassess with repeat ABG 30–60 min after any significant change.`,
    });
  }

  // Lactate
  if (inputs.lactate !== null) {
    const status: ParamRow["status"] = inputs.lactate >= 4 ? "danger" : inputs.lactate >= 2 ? "concern" : "ok";
    rows.push({
      label: "Lactate",
      entered: `${inputs.lactate} mmol/L`,
      suggested: "< 2 mmol/L",
      status,
      statusLabel: status === "ok" ? "In range" : status === "concern" ? "↑ Elevated" : "↑ High risk",
      direction: status === "ok" ? "" : "↑ Too high",
      note: status === "danger" ? "Severe hyperlactataemia" : status === "concern" ? "Elevated — haemodynamic concern" : "Normal",
      explanation: status === "danger"
        ? `Lactate ${inputs.lactate} mmol/L indicates severe hyperlactataemia consistent with significant shock or organ hypoperfusion. Urgent treatment of the underlying cause is required. Weaning and extubation are contraindicated. This patient needs senior/PICU review and likely vasoactive support.`
        : status === "concern"
        ? `Lactate ${inputs.lactate} mmol/L is elevated, suggesting impaired tissue perfusion or early haemodynamic compromise. Address the underlying cause before considering weaning. Monitor trend — a rising lactate is more concerning than a stable one. Weaning assessment should be deferred until lactate normalises below 2 mmol/L.`
        : `Lactate ${inputs.lactate} mmol/L is within the normal range, suggesting adequate tissue perfusion at current ventilator settings. This is a positive indicator for haemodynamic stability. Include in weaning readiness assessment.`,
    });
  }

  return rows;
}

// ─── Diagnosis labels ─────────────────────────────────────────────────────────

const DIAG_LABELS: Record<string, string> = {
  normal: "Normal Lungs",  pneumonia: "Pneumonia",
  pards: "PARDS / ARDS",   asthma: "Severe Asthma",
  bronchiolitis: "Bronchiolitis", shock: "Shock",
  neuromuscular: "Neuromuscular", "raised-icp": "Raised ICP/TBI",
  "post-arrest": "Post-Arrest",  other: "Other",
};

// ─── Main component ───────────────────────────────────────────────────────────

export function MechVentProtocol() {
  const tabRef = useRef<HTMLDivElement>(null);

  // ── Pathway ──
  const [mvPathway, setMvPathway] = useState<"pediatric" | "neonatal">("pediatric");

  // ── Patient & airway ──
  const [ageValue, setAgeValue]   = useState("");
  const [ageUnit, setAgeUnit]     = useState<AgeUnit>("years");
  const [weight, setWeight]       = useState("");
  const [diagnosis, setDiagnosis] = useState<Diagnosis | "">("");
  const [intubated, setIntubated] = useState(true);
  const [ettCuffed, setEttCuffed] = useState<boolean | null>(null);
  const [ettSize, setEttSize]     = useState("");
  const [ettDepth, setEttDepth]   = useState("");

  // ── Vent settings ──
  const [fio2, setFio2]         = useState("");
  const [peep, setPeep]         = useState("");
  const [pip, setPip]           = useState("");
  const [map, setMap]           = useState("");
  const [rr, setRr]             = useState("");
  const [itime, setItime]       = useState("");
  const [measuredVt, setMeasuredVt] = useState("");

  // ── Gas / labs ──
  const [ph, setPh]           = useState("");
  const [pco2, setPco2]       = useState("");
  const [pao2, setPao2]       = useState("");
  const [hco3, setHco3]       = useState("");
  const [spo2, setSpo2]       = useState("");
  const [lactate, setLactate] = useState("");

  // ── Neonatal-specific state ──
  const [nGa, setNGa]                 = useState("");
  const [nWeightUnit, setNWeightUnit] = useState<"kg" | "g">("g");
  const [nWeight, setNWeight]         = useState("");
  const [nDiagnosis, setNDiagnosis]   = useState<NeonatalDiagnosis | "">("");
  const [nAgeValue, setNAgeValue]     = useState("");
  const [nAgeUnit, setNAgeUnit]       = useState<"days" | "months">("days");
  const [nFio2, setNFio2]             = useState("");
  const [nPeep, setNPeep]             = useState("");
  const [nPip, setNPip]               = useState("");
  const [nMap, setNMap]               = useState("");
  const [nRr, setNRr]                 = useState("");
  const [nItime, setNItime]           = useState("");
  const [nVt, setNVt]                 = useState("");
  const [nPh, setNPh]                 = useState("");
  const [nPco2, setNPco2]             = useState("");
  const [nPao2, setNPao2]             = useState("");
  const [nSpo2, setNSpo2]             = useState("");

  // ── UI ──
  const [activeTab, setActiveTab] = useState("setup");
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [gasOpen, setGasOpen] = useState(true);
  const [expandedInfoRow, setExpandedInfoRow] = useState<string | null>(null);
  const [nSettingsOpen, setNSettingsOpen] = useState(true);
  const [nGasOpen, setNGasOpen] = useState(true);

  const handleReset = () => {
    setAgeValue(""); setAgeUnit("years"); setWeight(""); setDiagnosis("");
    setIntubated(true); setEttCuffed(null); setEttSize(""); setEttDepth("");
    setFio2(""); setPeep(""); setPip(""); setMap(""); setRr(""); setItime(""); setMeasuredVt("");
    setPh(""); setPco2(""); setPao2(""); setHco3(""); setSpo2(""); setLactate("");
    setNGa(""); setNWeightUnit("g"); setNWeight(""); setNDiagnosis(""); setNAgeValue(""); setNAgeUnit("days");
    setNFio2(""); setNPeep(""); setNPip(""); setNMap(""); setNRr(""); setNItime(""); setNVt("");
    setNPh(""); setNPco2(""); setNPao2(""); setNSpo2("");
    setActiveTab("setup");
  };

  const inputs: MVInputs = useMemo(() => ({
    age:            ageValue ? { value: parseFloat(ageValue), unit: ageUnit } : null,
    weightKg:       parseNum(weight),
    diagnosis,
    intubated,
    ettCuffed,
    ettSizeMm:      parseNum(ettSize),
    ettDepthCm:     parseNum(ettDepth),
    fio2Percent:    parseNum(fio2),
    peep:           parseNum(peep),
    pip:            parseNum(pip),
    mapAirway:      parseNum(map),
    rr:             parseNum(rr),
    itime:          parseNum(itime),
    measuredVtMl:   parseNum(measuredVt),
    ph:             parseNum(ph),
    pco2:           parseNum(pco2),
    pao2:           parseNum(pao2),
    hco3:           parseNum(hco3),
    spo2:           parseNum(spo2),
    lactate:        parseNum(lactate),
  }), [ageValue, ageUnit, weight, diagnosis, intubated, ettCuffed, ettSize, ettDepth,
       fio2, peep, pip, map, rr, itime, measuredVt, ph, pco2, pao2, hco3, spo2, lactate]);

  const output: MVFullOutput = useMemo(() => runMVAssessment(inputs), [inputs]);
  const actions = useMemo(() => generatePriorityActions(inputs, output), [inputs, output]);
  const paramRows = useMemo(() => buildParamRows(inputs, output), [inputs, output]);

  // ── Neonatal path ──
  const neonatalInputs: NeonatalMVInputs = useMemo(() => ({
    age:                nAgeValue ? { value: parseFloat(nAgeValue), unit: nAgeUnit } : null,
    gestationalAgeWeeks: parseNum(nGa),
    weightKg:           parseNum(nWeight) !== null
                          ? (nWeightUnit === "g" ? parseNum(nWeight)! / 1000 : parseNum(nWeight))
                          : null,
    diagnosis:          nDiagnosis,
    fio2Percent:        parseNum(nFio2),
    peep:               parseNum(nPeep),
    pip:                parseNum(nPip),
    mapAirway:          parseNum(nMap),
    rr:                 parseNum(nRr),
    itime:              parseNum(nItime),
    measuredVtMl:       parseNum(nVt),
    ph:                 parseNum(nPh),
    pco2:               parseNum(nPco2),
    pao2:               parseNum(nPao2),
    spo2:               parseNum(nSpo2),
  }), [nAgeValue, nAgeUnit, nGa, nWeight, nWeightUnit, nDiagnosis,
       nFio2, nPeep, nPip, nMap, nRr, nItime, nVt, nPh, nPco2, nPao2, nSpo2]);

  const nOutput: NeonatalMVFullOutput = useMemo(() => runNeonatalMVAssessment(neonatalInputs), [neonatalInputs]);

  const criticalCount = mvPathway === "neonatal"
    ? [...nOutput.globalWarnings, ...(nOutput.oxygenation?.warnings ?? []), ...(nOutput.ventilation?.warnings ?? [])].filter(w => w.severity === "critical").length
    : actions.filter((a) => a.priority === "critical").length;
  const hasCritical = criticalCount > 0;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-4xl mx-auto space-y-3 pb-24">

      {/* Header */}
      <Card className="border-2 border-primary/20 shadow-sm overflow-hidden">
        <div className="bg-primary px-5 py-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Wind className="h-6 w-6 opacity-80" />
            <div>
              <h2 className="text-base font-black tracking-tight">Mechanical Ventilation</h2>
              <p className="text-primary-foreground/70 text-[10px] font-medium">PICU · NICU · PALICC-2 / PEMVECC 2017</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset}
            className="text-white/80 hover:text-white hover:bg-white/10 text-xs h-7">
            <RefreshCcw className="h-3 w-3 mr-1" /> Reset
          </Button>
        </div>
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5">
          <p className="text-[10px] font-bold text-amber-800">
            Structured guidance only — not autopilot. Use "consider" language. Senior/PICU review required before significant changes.
          </p>
        </div>
      </Card>

      {/* DOPES strip — always visible when intubated */}
      {intubated && (
        <div className="rounded-xl border-2 border-red-400 bg-red-50 px-4 py-2 flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-black text-red-900">ACUTE DETERIORATION → BAG MANUALLY + DOPES</p>
            <p className="text-[10px] font-bold text-red-700 mt-0.5 flex flex-wrap gap-x-3">
              <span><b>D</b>isplacement</span><span><b>O</b>bstruction</span>
              <span><b>P</b>neumothorax</span><span><b>E</b>quipment</span>
              <span><b>S</b>tacked breaths</span>
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-16 z-30 bg-background py-2 border-b mb-3 overflow-x-auto">
          <TabsList className="w-max h-auto flex flex-nowrap justify-start gap-1 bg-transparent p-0 px-1">
            {[
              { value: "setup",   label: "Setup" },
              { value: "summary", label: "Assessment & Actions", badge: hasCritical ? String(criticalCount) : undefined },
              { value: "airway",  label: "Airway" },
              { value: "guide",   label: "Scenario Guide" },
              { value: "dopes",   label: "DOPES" },
              { value: "weaning", label: "Weaning" },
            ].map((t) => (
              <TabsTrigger key={t.value} value={t.value}
                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white border px-3 py-1.5 text-xs font-bold shrink-0 relative">
                {t.label}
                {t.badge && (
                  <span className="ml-1.5 bg-red-500 text-white text-[9px] font-black rounded-full w-4 h-4 inline-flex items-center justify-center">
                    {t.badge}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* ════════════════════ SETUP ════════════════════ */}
        <TabsContent value="setup" className="space-y-3 animate-in fade-in slide-in-from-bottom-2">

          {/* ── Pathway selector ── */}
          <div className="grid grid-cols-2 gap-2">
            {([
              { v: "pediatric", label: "Pediatric (PICU)", icon: <Stethoscope className="h-4 w-4" /> },
              { v: "neonatal",  label: "Neonatal (NICU)",  icon: <Baby className="h-4 w-4" /> },
            ] as const).map((opt) => (
              <button key={opt.v} onClick={() => setMvPathway(opt.v)}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-xl border-2 font-black text-sm transition-colors",
                  mvPathway === opt.v
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                )}>
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>

          {/* ══════════ NEONATAL SETUP ══════════ */}
          {mvPathway === "neonatal" && (
            <>
              <Card>
                <CardHeader className="pb-2 border-b bg-purple-50/50">
                  <CardTitle className="text-xs uppercase tracking-widest text-purple-700 flex items-center gap-2">
                    <Baby className="h-3.5 w-3.5" /> Neonatal Patient
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Age */}
                    <div className="space-y-1">
                      <SL>Age *</SL>
                      <div className="flex gap-2">
                        <Input type="number" placeholder="e.g. 2" value={nAgeValue}
                          onChange={(e) => setNAgeValue(e.target.value)} className="font-bold bg-slate-50 flex-1 h-9" />
                        <Select value={nAgeUnit} onValueChange={(v) => setNAgeUnit(v as "days" | "months")}>
                          <SelectTrigger className="w-24 font-bold bg-slate-50 h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {/* Weight */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <SL>Weight *</SL>
                        <div className="flex rounded-lg border border-slate-200 overflow-hidden text-[10px] font-black">
                          {(["g", "kg"] as const).map((u) => (
                            <button key={u} onClick={() => { setNWeightUnit(u); setNWeight(""); }}
                              className={cn("px-2 py-0.5 transition-colors",
                                nWeightUnit === u ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-50")}>
                              {u}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="relative">
                        <Input type="number"
                          placeholder={nWeightUnit === "g" ? "e.g. 750" : "e.g. 1.2"}
                          value={nWeight} onChange={(e) => setNWeight(e.target.value)}
                          className="font-bold bg-slate-50 h-9 pr-8" />
                        <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">{nWeightUnit}</span>
                      </div>
                      {nWeightUnit === "g" && nWeight && parseNum(nWeight) !== null && (
                        <p className="text-[10px] text-slate-400 font-bold">= {(parseNum(nWeight)! / 1000).toFixed(3)} kg</p>
                      )}
                    </div>
                  </div>
                  {/* Gestational Age */}
                  <div className="space-y-1">
                    <SL>Gestational Age (weeks)</SL>
                    <Input type="number" placeholder="e.g. 28" value={nGa}
                      onChange={(e) => setNGa(e.target.value)} className="font-bold bg-slate-50 h-9" />
                  </div>
                  {/* Diagnosis */}
                  <div className="space-y-1">
                    <SL>Diagnosis *</SL>
                    <Select value={nDiagnosis} onValueChange={(v) => setNDiagnosis(v as NeonatalDiagnosis)}>
                      <SelectTrigger className="font-bold bg-slate-50 h-9"><SelectValue placeholder="Select neonatal diagnosis..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rds">RDS — Respiratory Distress Syndrome</SelectItem>
                        <SelectItem value="ttn">TTN — Transient Tachypnoea of Newborn</SelectItem>
                        <SelectItem value="mas">MAS — Meconium Aspiration Syndrome</SelectItem>
                        <SelectItem value="pphn">PPHN — Persistent Pulmonary Hypertension</SelectItem>
                        <SelectItem value="cdh">CDH — Congenital Diaphragmatic Hernia</SelectItem>
                        <SelectItem value="neonatal-pneumonia">Neonatal Pneumonia / Sepsis</SelectItem>
                        <SelectItem value="apnea">Apnoea of Prematurity</SelectItem>
                        <SelectItem value="neonatal-air-leak">Air Leak / PIE</SelectItem>
                        <SelectItem value="other-neonatal">Other Neonatal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Neonatal vent settings */}
              <Card>
                <button className="w-full" onClick={() => setNSettingsOpen(!nSettingsOpen)}>
                  <CardHeader className="pb-2 border-b bg-slate-50/50">
                    <CardTitle className="text-xs uppercase tracking-widest text-slate-600 flex items-center justify-between">
                      <span className="flex items-center gap-2"><Calculator className="h-3.5 w-3.5" /> Ventilator Settings</span>
                      {nSettingsOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                    </CardTitle>
                  </CardHeader>
                </button>
                {nSettingsOpen && (
                  <CardContent className="pt-3 space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "FiO₂ (%)",      val: nFio2,  set: setNFio2,  ph: "21–100" },
                        { label: "PEEP (cmH₂O)",  val: nPeep,  set: setNPeep,  ph: "e.g. 5" },
                        { label: "PIP / Pplat",   val: nPip,   set: setNPip,   ph: "e.g. 22" },
                      ].map((f) => (
                        <div key={f.label} className="space-y-1">
                          <Label className="text-[10px] text-slate-500 font-bold">{f.label}</Label>
                          <Input type="number" placeholder={f.ph} value={f.val} onChange={(e) => f.set(e.target.value)} className="h-8 text-xs bg-slate-50" />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "MAP (cmH₂O)",  val: nMap,   set: setNMap,   ph: "mean airway P" },
                        { label: "Set RR (bpm)", val: nRr,    set: setNRr,    ph: "e.g. 50" },
                        { label: "I-Time (s)",   val: nItime, set: setNItime, ph: "e.g. 0.35" },
                      ].map((f) => (
                        <div key={f.label} className="space-y-1">
                          <Label className="text-[10px] text-slate-500 font-bold">{f.label}</Label>
                          <Input type="number" placeholder={f.ph} value={f.val} onChange={(e) => f.set(e.target.value)} className="h-8 text-xs bg-slate-50" />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-slate-500 font-bold">Measured VT (mL)</Label>
                      <Input type="number" placeholder="e.g. 8" value={nVt} onChange={(e) => setNVt(e.target.value)} className="h-8 text-xs bg-slate-50" />
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Neonatal Gas / Labs */}
              <Card>
                <button className="w-full" onClick={() => setNGasOpen(!nGasOpen)}>
                  <CardHeader className="pb-2 border-b bg-slate-50/50">
                    <CardTitle className="text-xs uppercase tracking-widest text-slate-600 flex items-center justify-between">
                      <span className="flex items-center gap-2"><Activity className="h-3.5 w-3.5" /> Gas &amp; Labs</span>
                      {nGasOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                    </CardTitle>
                  </CardHeader>
                </button>
                {nGasOpen && (
                  <CardContent className="pt-3 space-y-3">
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: "SpO₂ (%)",     val: nSpo2,  set: setNSpo2,  step: "1",    ph: "e.g. 92" },
                        { label: "pH",           val: nPh,    set: setNPh,    step: "0.01", ph: "e.g. 7.30" },
                        { label: "PaCO₂ (mmHg)", val: nPco2,  set: setNPco2,  step: "1",    ph: "e.g. 50" },
                        { label: "PaO₂ (mmHg)",  val: nPao2,  set: setNPao2,  step: "1",    ph: "arterial" },
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

              {nOutput.hasMinimumData ? (
                <Button className="w-full h-11 font-black text-sm" onClick={() => setActiveTab("summary")}>
                  <Zap className="h-4 w-4 mr-2" /> View Neonatal Assessment
                  {hasCritical && <span className="ml-2 bg-red-500 text-white text-[10px] font-black rounded-full px-1.5 py-0.5">{criticalCount} critical</span>}
                </Button>
              ) : (
                <p className="text-center text-xs text-slate-400 font-bold py-2">* Enter age and weight to generate assessment</p>
              )}
            </>
          )}

          {/* ══════════ PEDIATRIC SETUP ══════════ */}
          {mvPathway === "pediatric" && (
          <>
          {/* Patient core */}
          <Card>
            <CardHeader className="pb-2 border-b bg-slate-50/50">
              <CardTitle className="text-xs uppercase tracking-widest text-slate-600 flex items-center gap-2">
                <Stethoscope className="h-3.5 w-3.5" /> Patient
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <SL>Age</SL>
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
                  <SL>Weight (kg) *</SL>
                  <Input type="number" placeholder="e.g. 15" value={weight}
                    onChange={(e) => setWeight(e.target.value)} className="font-bold bg-slate-50 h-9" />
                </div>
              </div>
              <div className="space-y-1">
                <SL>Diagnosis Category *</SL>
                <Select value={diagnosis} onValueChange={(v) => setDiagnosis(v as Diagnosis)}>
                  <SelectTrigger className="font-bold bg-slate-50 h-9"><SelectValue placeholder="Select diagnosis..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal Lungs / Post-operative</SelectItem>
                    <SelectItem value="pneumonia">Pneumonia</SelectItem>
                    <SelectItem value="pards">PARDS / Severe ARDS</SelectItem>
                    <SelectItem value="asthma">Severe Asthma / Obstructive</SelectItem>
                    <SelectItem value="bronchiolitis">Bronchiolitis</SelectItem>
                    <SelectItem value="shock">Shock / Haemodynamic Instability</SelectItem>
                    <SelectItem value="neuromuscular">Neuromuscular Weakness</SelectItem>
                    <SelectItem value="raised-icp">Raised ICP / Severe TBI</SelectItem>
                    <SelectItem value="post-arrest">Post-Cardiac Arrest</SelectItem>
                    <SelectItem value="other">Other / Unspecified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <SL>Intubated</SL>
                  <Select value={intubated ? "yes" : "no"} onValueChange={(v) => setIntubated(v === "yes")}>
                    <SelectTrigger className="font-bold bg-slate-50 h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No / Planning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <SL>ETT type</SL>
                  <Select value={ettCuffed === null ? "" : ettCuffed ? "cuffed" : "uncuffed"}
                    onValueChange={(v) => setEttCuffed(v === "cuffed" ? true : v === "uncuffed" ? false : null)}>
                    <SelectTrigger className="font-bold bg-slate-50 h-9"><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cuffed">Cuffed</SelectItem>
                      <SelectItem value="uncuffed">Uncuffed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <SL>ETT size (mm)</SL>
                  <Input type="number" step="0.5" placeholder="e.g. 4.0" value={ettSize}
                    onChange={(e) => setEttSize(e.target.value)} className="font-bold bg-slate-50 h-9" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ventilator settings — collapsible */}
          <Card>
            <button className="w-full" onClick={() => setSettingsOpen(!settingsOpen)}>
              <CardHeader className="pb-2 border-b bg-slate-50/50">
                <CardTitle className="text-xs uppercase tracking-widest text-slate-600 flex items-center justify-between">
                  <span className="flex items-center gap-2"><Calculator className="h-3.5 w-3.5" /> Current Ventilator Settings</span>
                  {settingsOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </CardTitle>
              </CardHeader>
            </button>
            {settingsOpen && (
              <CardContent className="pt-3 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "FiO₂ (%)", val: fio2, set: setFio2, ph: "21–100" },
                    { label: "PEEP (cmH₂O)", val: peep, set: setPeep, ph: "e.g. 6" },
                    { label: "PIP / Pplat (cmH₂O)", val: pip, set: setPip, ph: "e.g. 22" },
                  ].map((f) => (
                    <div key={f.label} className="space-y-1">
                      <Label className="text-[10px] text-slate-500 font-bold">{f.label}</Label>
                      <Input type="number" placeholder={f.ph} value={f.val}
                        onChange={(e) => f.set(e.target.value)} className="h-8 text-xs bg-slate-50" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "MAP (cmH₂O)", val: map, set: setMap, ph: "mean airway P" },
                    { label: "Set RR (bpm)", val: rr, set: setRr, ph: "e.g. 25" },
                    { label: "I-Time (s)", val: itime, set: setItime, ph: "e.g. 0.8" },
                  ].map((f) => (
                    <div key={f.label} className="space-y-1">
                      <Label className="text-[10px] text-slate-500 font-bold">{f.label}</Label>
                      <Input type="number" placeholder={f.ph} value={f.val}
                        onChange={(e) => f.set(e.target.value)} className="h-8 text-xs bg-slate-50" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-slate-500 font-bold">Measured VT (mL)</Label>
                    <Input type="number" placeholder="e.g. 90" value={measuredVt}
                      onChange={(e) => setMeasuredVt(e.target.value)} className="h-8 text-xs bg-slate-50" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-slate-500 font-bold">ETT depth at lip (cm)</Label>
                    <Input type="number" placeholder="e.g. 14" value={ettDepth}
                      onChange={(e) => setEttDepth(e.target.value)} className="h-8 text-xs bg-slate-50" />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Gas / labs — collapsible */}
          <Card>
            <button className="w-full" onClick={() => setGasOpen(!gasOpen)}>
              <CardHeader className="pb-2 border-b bg-slate-50/50">
                <CardTitle className="text-xs uppercase tracking-widest text-slate-600 flex items-center justify-between">
                  <span className="flex items-center gap-2"><Activity className="h-3.5 w-3.5" /> Gas & Labs</span>
                  {gasOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </CardTitle>
              </CardHeader>
            </button>
            {gasOpen && (
              <CardContent className="pt-3 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "SpO₂ (%)",      val: spo2,    set: setSpo2,    step: "1",    ph: "e.g. 94" },
                    { label: "pH",             val: ph,      set: setPh,      step: "0.01", ph: "e.g. 7.35" },
                    { label: "PaCO₂ (mmHg)",  val: pco2,    set: setPco2,    step: "1",    ph: "e.g. 45" },
                  ].map((f) => (
                    <div key={f.label} className="space-y-1">
                      <Label className="text-[10px] text-slate-500 font-bold">{f.label}</Label>
                      <Input type="number" step={f.step} placeholder={f.ph} value={f.val}
                        onChange={(e) => f.set(e.target.value)} className="h-8 text-xs bg-slate-50" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "PaO₂ (mmHg)",      val: pao2,    set: setPao2,    step: "1",    ph: "arterial" },
                    { label: "HCO₃ (mEq/L)",      val: hco3,    set: setHco3,    step: "1",    ph: "e.g. 22" },
                    { label: "Lactate (mmol/L)",   val: lactate, set: setLactate, step: "0.1",  ph: "e.g. 1.8" },
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

          {/* CTA */}
          {output.hasMinimumData ? (
            <Button className="w-full h-11 font-black text-sm" onClick={() => setActiveTab("summary")}>
              <Zap className="h-4 w-4 mr-2" />
              View Assessment & Recommendations
              {hasCritical && <span className="ml-2 bg-red-500 text-white text-[10px] font-black rounded-full px-1.5 py-0.5">{criticalCount} critical</span>}
            </Button>
          ) : (
            <div className="text-center py-4 text-slate-400">
              <p className="text-xs font-bold">* Enter age and weight to generate assessment</p>
            </div>
          )}
          </>
          )}
        </TabsContent>

        {/* ════════════════════ SUMMARY / ASSESSMENT ════════════════════ */}
        <TabsContent value="summary" className="space-y-3 animate-in fade-in slide-in-from-bottom-2">

          {/* ══ NEONATAL ASSESSMENT ══ */}
          {mvPathway === "neonatal" && (
            !nOutput.hasMinimumData ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                <Baby className="h-12 w-12 opacity-20" />
                <p className="font-bold text-sm">Enter age and weight in Neonatal Setup</p>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("setup")}>Go to Setup</Button>
              </div>
            ) : (
              <>
                {/* Neonatal snapshot */}
                <div className="flex flex-wrap items-center gap-2 px-1">
                  <Badge className="font-black text-xs bg-purple-100 text-purple-800 border-purple-200">
                    <Baby className="h-3 w-3 mr-1 inline" /> Neonatal NICU
                  </Badge>
                  <Badge variant="outline" className="font-black text-xs">
                    {nAgeValue} {nAgeUnit} · {nWeight} {nWeightUnit}
                    {nWeightUnit === "g" && nWeight && parseNum(nWeight) !== null ? ` (${(parseNum(nWeight)! / 1000).toFixed(3)} kg)` : ""}
                  </Badge>
                  {nGa && <Badge variant="outline" className="font-black text-xs">GA {nGa}w {nOutput.isPreterm ? "· Preterm" : "· Term"}</Badge>}
                  {nDiagnosis && <Badge className="font-black text-xs bg-primary/10 text-primary border-primary/20">{NEONATAL_DIAG_LABELS[nDiagnosis] ?? nDiagnosis}</Badge>}
                </div>

                {/* Global warnings */}
                {nOutput.globalWarnings.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2 border-b bg-slate-50/50">
                      <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-600" /> Safety Alerts</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-3 space-y-2">
                      {nOutput.globalWarnings.map((w) => (
                        <div key={w.code} className={cn("flex gap-3 p-3 rounded-xl border", w.severity === "critical" ? "bg-red-50 border-red-300" : "bg-amber-50 border-amber-300")}>
                          <AlertTriangle className={cn("h-4 w-4 shrink-0 mt-0.5", w.severity === "critical" ? "text-red-600" : "text-amber-600")} />
                          <div>
                            <p className={cn("text-xs font-black", w.severity === "critical" ? "text-red-900" : "text-amber-900")}>{w.title}</p>
                            <p className={cn("text-xs font-medium", w.severity === "critical" ? "text-red-800" : "text-amber-800")}>{w.message}</p>
                            {w.action && <p className={cn("text-xs font-black mt-1", w.severity === "critical" ? "text-red-900" : "text-amber-900")}>→ {w.action}</p>}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Neonatal key metrics */}
                <div className="grid grid-cols-3 gap-2">
                  {/* OI/OSI */}
                  {nOutput.oxygenation && (() => {
                    const oiVal = nOutput.oxygenation.oi ?? nOutput.oxygenation.osi;
                    const oiColor = nOutput.oxygenation.ecmoDiscussionThreshold ? "text-red-700" : nOutput.oxygenation.hfovConsiderationThreshold ? "text-orange-700" : "text-emerald-700";
                    const oiBg = nOutput.oxygenation.ecmoDiscussionThreshold ? "bg-red-50 border-red-300" : nOutput.oxygenation.hfovConsiderationThreshold ? "bg-orange-50 border-orange-200" : "bg-emerald-50 border-emerald-200";
                    return (
                      <div className={cn("p-3 rounded-xl border", oiBg)}>
                        <SL>{nOutput.oxygenation.usedIndex ?? "OI/OSI"}</SL>
                        <p className={cn("text-xl font-black mt-0.5", oiColor)}>{oiVal ?? "—"}</p>
                        <p className={cn("text-[10px] font-black mt-0.5 leading-tight", oiColor)}>
                          {oiVal === null ? "Enter FiO₂+MAP+(PaO₂/SpO₂)" : nOutput.oxygenation.ecmoDiscussionThreshold ? "ECMO threshold" : nOutput.oxygenation.hfovConsiderationThreshold ? "Consider HFOV" : "Below HFOV threshold"}
                        </p>
                      </div>
                    );
                  })()}
                  {/* pH */}
                  {(() => {
                    const phCat = nOutput.ventilation?.phCategory;
                    const col = phCat === "normal" ? "text-emerald-700" : phCat === "acidosis" ? "text-red-700" : "text-blue-700";
                    const bg2 = phCat === "normal" ? "bg-emerald-50 border-emerald-200" : phCat === "acidosis" ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200";
                    return (
                      <div className={cn("p-3 rounded-xl border", phCat ? bg2 : "bg-slate-50 border-slate-200")}>
                        <SL>pH</SL>
                        <p className={cn("text-xl font-black mt-0.5", phCat ? col : "text-slate-400")}>{nPh || "—"}</p>
                        <p className={cn("text-[10px] font-black mt-0.5", phCat ? col : "text-slate-400")}>
                          {nPco2 ? `pCO₂ ${nPco2} mmHg` : "Enter pH + pCO₂"}
                        </p>
                      </div>
                    );
                  })()}
                  {/* VT/kg */}
                  {(() => {
                    const vt = nOutput.oxygenation?.vtPerKg;
                    const vtsev = vt !== null && vt !== undefined && vt > 6 ? "text-red-700" : vt !== null && vt !== undefined && vt >= 4 ? "text-emerald-700" : "text-slate-400";
                    return (
                      <div className="p-3 rounded-xl border bg-slate-50">
                        <SL>VT / kg</SL>
                        <p className={cn("text-xl font-black mt-0.5", vtsev)}>{vt ?? "—"} {vt !== null && vt !== undefined ? "mL" : ""}</p>
                        <p className="text-[10px] font-medium text-slate-500 mt-0.5 leading-tight">{nOutput.oxygenation?.vtPerKgNote || "Enter VT + weight"}</p>
                      </div>
                    );
                  })()}
                </div>

                {/* Hypocarbia critical warning */}
                {nOutput.ventilation?.hypocarbiaDanger && (
                  <div className="p-3 bg-red-50 border-2 border-red-400 rounded-xl">
                    <p className="text-xs font-black text-red-900">⚠ HYPOCARBIA — PaCO₂ {nPco2} mmHg</p>
                    <p className="text-xs font-medium text-red-800 mt-0.5">PaCO₂ &lt; 35 mmHg in neonates is associated with PVL, IVH, and hearing loss. Reduce RR or PIP immediately. Recheck ABG in 20–30 min.</p>
                  </div>
                )}

                {/* Computed initial settings */}
                {nOutput.initialSettings && (
                  <InitialSettingsCard v={{
                    diagnosisLabel: nOutput.initialSettings.diagnosisLabel,
                    modeSuggestion: nOutput.initialSettings.modeSuggestion,
                    vtMl:           nOutput.initialSettings.vtMl,
                    vtPerKg:        nOutput.initialSettings.vtPerKg,
                    rr:             nOutput.initialSettings.rr,
                    peep:           nOutput.initialSettings.peep,
                    pressure:       nOutput.initialSettings.pipStart,
                    itime:          nOutput.initialSettings.itime,
                    fio2Start:      nOutput.initialSettings.fio2Start,
                    spo2Target:     nOutput.initialSettings.spo2Target,
                    co2Target:      nOutput.initialSettings.co2Target,
                    keyCautions:    nOutput.initialSettings.keyCautions,
                    titrationNote:  nOutput.initialSettings.titrationNote,
                  }} />
                )}

                {/* Diagnosis guide & broader targets */}
                {nOutput.scenario && (
                  <Card className="border-2 border-emerald-200">
                    <CardHeader className="pb-2 border-b bg-emerald-50/60">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-emerald-700" /> Diagnosis Guide &amp; Targets — {nOutput.scenario.diagnosisLabel}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-3 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                          <SL>Tidal Volume</SL>
                          <p className="text-sm font-black text-blue-800 mt-1">{nOutput.scenario.vtTarget}</p>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                          <SL>PEEP</SL>
                          <p className="text-sm font-black text-amber-800 mt-1">{nOutput.scenario.peepRange}</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                          <SL>RR / I-Time</SL>
                          <p className="text-sm font-black text-purple-800 mt-1">{nOutput.scenario.rrRange}</p>
                          <p className="text-[10px] text-purple-600 font-medium mt-0.5">I-Time: {nOutput.scenario.itime}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border">
                          <SL>FiO₂ / SpO₂ Target</SL>
                          <p className="text-sm font-black text-slate-800 mt-1">{nOutput.scenario.fio2Start.split(".")[0]}</p>
                          <p className="text-[10px] text-slate-600 font-medium mt-0.5">{nOutput.scenario.spo2Target}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-2.5 bg-white border rounded-xl">
                          <SL>Ventilation Target</SL>
                          <p className="text-xs font-medium text-slate-700">{nOutput.scenario.ventTarget}</p>
                        </div>
                        <div className="p-2.5 bg-white border rounded-xl">
                          <SL>HFOV — Consider If</SL>
                          <p className="text-xs font-medium text-slate-700">{nOutput.scenario.hfovConsiderIf}</p>
                        </div>
                      </div>
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-[10px] font-bold text-amber-800">⚠ Starting ranges — reassess after every change. Senior NICU review required.</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Ventilation advice */}
                {nOutput.ventilation?.hasData && nOutput.ventilation.advice.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2 border-b bg-slate-50/50">
                      <CardTitle className="text-sm flex items-center gap-2"><Activity className="h-4 w-4 text-purple-600" /> Gas Exchange Guidance</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-3 space-y-2">
                      {nOutput.ventilation.permissiveApplies && (
                        <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl">
                          <p className="text-xs font-black text-blue-800">Permissive hypercapnia applies</p>
                          <p className="text-[10px] font-medium text-blue-700 mt-0.5">{nOutput.ventilation.permissiveNote}</p>
                        </div>
                      )}
                      {nOutput.ventilation.advice.map((a, i) => (
                        <div key={i} className="flex gap-2 p-2.5 bg-slate-50 rounded-xl border">
                          <ArrowRight className="h-3 w-3 text-slate-400 shrink-0 mt-0.5" />
                          <p className="text-xs font-medium text-slate-700">{a}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Special considerations */}
                {nOutput.scenario && nOutput.scenario.specialConsiderations.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2 border-b bg-amber-50/50">
                      <CardTitle className="text-sm text-amber-800 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Special Considerations</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2 space-y-1.5">
                      {nOutput.scenario.specialConsiderations.map((c, i) => (
                        <div key={i} className="flex gap-2 text-xs font-medium text-amber-800"><span className="shrink-0">⚠</span>{c}</div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Weaning */}
                {nOutput.weaning && (
                  <Card>
                    <CardHeader className="pb-2 border-b bg-slate-50/50">
                      <CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Extubation Readiness</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-3 space-y-2">
                      <div className={cn("p-3 rounded-xl border-2", { "bg-emerald-50 border-emerald-300": nOutput.weaning.status === "consider", "bg-red-50 border-red-300": nOutput.weaning.status === "not-ready", "bg-slate-50 border-slate-200": nOutput.weaning.status === "no-data" })}>
                        <p className={cn("font-black text-xs", { "text-emerald-800": nOutput.weaning.status === "consider", "text-red-800": nOutput.weaning.status === "not-ready", "text-slate-600": nOutput.weaning.status === "no-data" })}>
                          {nOutput.weaning.status === "consider" && "Consider extubation assessment — senior NICU review"}
                          {nOutput.weaning.status === "not-ready" && "Not ready for extubation"}
                          {nOutput.weaning.status === "no-data" && "Enter gas values to assess readiness"}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">{nOutput.weaning.note}</p>
                      </div>
                      {nOutput.weaning.blockers.map((b, i) => (
                        <div key={i} className="flex gap-2 p-2.5 bg-red-50 border border-red-200 rounded-xl">
                          <AlertTriangle className="h-3.5 w-3.5 text-red-600 shrink-0" />
                          <p className="text-xs font-bold text-red-800">{b}</p>
                        </div>
                      ))}
                      {nOutput.weaning.criteria.map((c) => (
                        <div key={c.id} className="flex gap-3 p-2.5 rounded-xl border bg-white">
                          <div className={cn("w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black", { "bg-emerald-100 text-emerald-700": c.met === true, "bg-red-100 text-red-700": c.met === false, "bg-slate-100 text-slate-500": c.met === null })}>
                            {c.met === true ? "✓" : c.met === false ? "✗" : "?"}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800">{c.label}</p>
                            <p className="text-[10px] font-medium text-slate-500">{c.note}</p>
                          </div>
                        </div>
                      ))}
                      <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl">
                        <SL>Transition concept</SL>
                        <p className="text-xs font-medium text-blue-800 mt-1">{nOutput.weaning.transitionConcept}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Senior review triggers */}
                {nOutput.scenario && nOutput.scenario.seniorReviewIf.length > 0 && (
                  <Card className="border-red-200">
                    <CardHeader className="pb-2 border-b bg-red-50/30">
                      <CardTitle className="text-sm text-red-800 flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Senior NICU Review If</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2 space-y-1.5">
                      {nOutput.scenario.seniorReviewIf.map((s, i) => (
                        <div key={i} className="flex gap-2 text-xs font-medium text-red-800"><ArrowRight className="h-3 w-3 shrink-0 mt-0.5" />{s}</div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </>
            )
          )}

          {/* ══ PEDIATRIC ASSESSMENT ══ */}
          {mvPathway === "pediatric" && (
          !output.hasMinimumData ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <Calculator className="h-12 w-12 opacity-20" />
              <p className="font-bold text-sm">Enter age and weight in Setup to begin</p>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("setup")}>Go to Setup</Button>
            </div>
          ) : (
            <>
              {/* Patient snapshot */}
              <div className="flex flex-wrap items-center gap-2 px-1">
                <Badge variant="outline" className="font-black text-xs">
                  {ageValue} {ageUnit} · {weight} kg
                </Badge>
                {diagnosis && (
                  <Badge className="font-black text-xs bg-primary/10 text-primary border-primary/20">
                    {DIAG_LABELS[diagnosis] ?? diagnosis}
                  </Badge>
                )}
                {intubated && (
                  <Badge variant="outline" className="font-black text-xs text-slate-600">
                    Intubated {ettCuffed !== null ? (ettCuffed ? "· Cuffed" : "· Uncuffed") : ""}
                    {ettSize ? ` · ${ettSize} mm` : ""}
                  </Badge>
                )}
              </div>

              {/* Key metrics row */}
              {(output.oxygenation || output.ventilation?.hasData) && (
                <div className="grid grid-cols-3 gap-2">
                  {/* OI/OSI tile */}
                  {output.oxygenation && (() => {
                    const g = output.oxygenation.pards.grade;
                    const colorMap: Record<string, string> = {
                      "no-criteria": "border-emerald-200 bg-emerald-50",
                      mild:          "border-yellow-200 bg-yellow-50",
                      moderate:      "border-orange-200 bg-orange-50",
                      severe:        "border-red-300 bg-red-50",
                      "no-data":     "border-slate-200 bg-slate-50",
                    };
                    const txtMap: Record<string, string> = {
                      "no-criteria": "text-emerald-800", mild: "text-yellow-800",
                      moderate: "text-orange-800", severe: "text-red-800", "no-data": "text-slate-500",
                    };
                    const val = output.oxygenation.pards.oi ?? output.oxygenation.pards.osi;
                    return (
                      <div className={cn("p-3 rounded-xl border", colorMap[g])}>
                        <SL>{output.oxygenation.pards.usedIndex ?? "OI/OSI"}</SL>
                        <p className={cn("text-xl font-black mt-0.5", txtMap[g])}>
                          {val !== null ? val : "—"}
                        </p>
                        <p className={cn("text-[10px] font-black mt-0.5", txtMap[g])}>
                          {output.oxygenation.pards.grade === "no-data" ? "Enter FiO₂+MAP+(PaO₂/SpO₂)" : output.oxygenation.pards.label}
                        </p>
                      </div>
                    );
                  })()}

                  {/* Driving pressure tile */}
                  {output.oxygenation && (() => {
                    const dp = output.oxygenation.drivingPressure;
                    const sev = output.oxygenation.dpSeverity;
                    const colorMap: Record<string, string> = {
                      ok: "border-emerald-200 bg-emerald-50", concern: "border-amber-200 bg-amber-50",
                      danger: "border-red-300 bg-red-50",
                    };
                    const txtMap: Record<string, string> = {
                      ok: "text-emerald-800", concern: "text-amber-800", danger: "text-red-800",
                    };
                    return (
                      <div className={cn("p-3 rounded-xl border", sev ? colorMap[sev] : "border-slate-200 bg-slate-50")}>
                        <SL>Driving ΔP</SL>
                        <p className={cn("text-xl font-black mt-0.5", sev ? txtMap[sev] : "text-slate-400")}>
                          {dp !== null ? `${dp}` : "—"}<span className="text-xs font-bold text-slate-400 ml-1">cmH₂O</span>
                        </p>
                        <p className={cn("text-[10px] font-black mt-0.5", sev ? txtMap[sev] : "text-slate-400")}>
                          {dp !== null ? (sev === "ok" ? "Acceptable" : sev === "concern" ? "↑ Concern" : "HIGH RISK") : "Enter PIP+PEEP"}
                        </p>
                      </div>
                    );
                  })()}

                  {/* pH / pCO₂ tile */}
                  {output.ventilation?.hasData ? (() => {
                    const ac = output.ventilation.phCategory;
                    const colorMap: Record<string, string> = {
                      normal: "border-emerald-200 bg-emerald-50",
                      acidosis: "border-red-200 bg-red-50",
                      alkalosis: "border-blue-200 bg-blue-50",
                    };
                    const txtMap: Record<string, string> = {
                      normal: "text-emerald-800", acidosis: "text-red-800", alkalosis: "text-blue-800",
                    };
                    return (
                      <div className={cn("p-3 rounded-xl border", ac ? colorMap[ac] : "border-slate-200 bg-slate-50")}>
                        <SL>pH / pCO₂</SL>
                        <p className={cn("text-xl font-black mt-0.5", ac ? txtMap[ac] : "text-slate-400")}>
                          {ph || "—"}
                        </p>
                        <p className={cn("text-[10px] font-black mt-0.5", ac ? txtMap[ac] : "text-slate-400")}>
                          {pco2 ? `pCO₂ ${pco2} mmHg` : "Enter pH/pCO₂"}
                        </p>
                      </div>
                    );
                  })() : (
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                      <SL>pH / pCO₂</SL>
                      <p className="text-xl font-black mt-0.5 text-slate-300">—</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">Enter pH + pCO₂</p>
                    </div>
                  )}
                </div>
              )}

              {/* Computed initial settings */}
              {output.initialSettings && (
                <InitialSettingsCard v={{
                  diagnosisLabel: output.initialSettings.diagnosisLabel,
                  modeSuggestion: output.initialSettings.modeSuggestion,
                  vtMl:           output.initialSettings.vtMl,
                  vtPerKg:        output.initialSettings.vtPerKg,
                  rr:             output.initialSettings.rr,
                  peep:           output.initialSettings.peep,
                  pressure:       output.initialSettings.pressureTarget,
                  itime:          output.initialSettings.itime,
                  ieRatio:        output.initialSettings.ieRatio,
                  fio2Start:      output.initialSettings.fio2Start,
                  spo2Target:     output.initialSettings.spo2Target,
                  co2Target:      output.initialSettings.co2Target,
                  keyCautions:    output.initialSettings.keyCautions,
                  titrationNote:  output.initialSettings.titrationNote,
                }} />
              )}

              {/* Priority actions */}
              <Card>
                <CardHeader className="pb-2 border-b bg-slate-50/50">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Priority Actions
                    {actions.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-400 ml-auto">
                        {actions.filter(a => a.priority === "critical").length > 0 && (
                          <span className="text-red-600 font-black mr-2">{actions.filter(a => a.priority === "critical").length} critical</span>
                        )}
                        {actions.length} total
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3 space-y-2">
                  {actions.length === 0 ? (
                    <p className="text-xs text-slate-400 font-medium text-center py-4">
                      Enter more data in Setup to generate recommendations
                    </p>
                  ) : (
                    actions.map((action, i) => (
                      <ActionCard key={action.id} action={action} index={i + 1} />
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Parameter comparison */}
              {paramRows.length > 0 && (
                <Card>
                  <CardHeader className="pb-2 border-b bg-slate-50/50">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Activity className="h-4 w-4 text-slate-600" /> Parameter Check
                      <span className="text-[10px] text-slate-400 font-medium">Entered vs Suggested · tap ⓘ for explanation</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {/* Header */}
                      <div className="grid grid-cols-12 gap-1 px-3 py-1.5 bg-slate-50">
                        <p className="col-span-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Parameter</p>
                        <p className="col-span-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Entered</p>
                        <p className="col-span-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Suggested</p>
                        <p className="col-span-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Status</p>
                      </div>

                      {paramRows.map((row) => {
                        const isOpen = expandedInfoRow === row.label;
                        const statusColor = {
                          ok:      "text-emerald-700",
                          concern: "text-amber-700",
                          danger:  "text-red-700",
                          neutral: "text-slate-400",
                        }[row.status];
                        const infoBg = {
                          ok:      "bg-emerald-50 border-emerald-200",
                          concern: "bg-amber-50 border-amber-200",
                          danger:  "bg-red-50 border-red-200",
                          neutral: "bg-slate-50 border-slate-200",
                        }[row.status];
                        const infoText = {
                          ok:      "text-emerald-800",
                          concern: "text-amber-800",
                          danger:  "text-red-800",
                          neutral: "text-slate-600",
                        }[row.status];

                        return (
                          <div key={row.label}>
                            {/* Main row */}
                            <div className="grid grid-cols-12 gap-1 px-3 py-2.5 items-center hover:bg-slate-50/50">
                              <p className="col-span-3 text-xs font-black text-slate-700">{row.label}</p>
                              <p className="col-span-3 text-xs font-bold text-slate-800">{row.entered}</p>
                              <p className="col-span-3 text-[10px] font-medium text-slate-500 leading-tight">{row.suggested}</p>
                              <div className="col-span-3 flex items-center gap-1">
                                <StatusDot status={row.status} />
                                <p className={cn("text-[9px] font-black flex-1 leading-tight", statusColor)}>
                                  {row.statusLabel}
                                </p>
                                <button
                                  onClick={() => setExpandedInfoRow(isOpen ? null : row.label)}
                                  className={cn(
                                    "w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-black shrink-0 transition-colors",
                                    isOpen
                                      ? "bg-primary text-white border-primary"
                                      : "text-slate-400 border-slate-300 hover:border-primary hover:text-primary"
                                  )}
                                  title="What does this mean?"
                                >
                                  i
                                </button>
                              </div>
                            </div>

                            {/* Explanation panel */}
                            {isOpen && (
                              <div className={cn("mx-3 mb-2 p-3 rounded-xl border text-xs font-medium leading-relaxed", infoBg, infoText)}>
                                <p className="font-black mb-1">
                                  {row.label}: {row.statusLabel}
                                  {row.direction && <span className="ml-2 font-bold opacity-70">{row.direction}</span>}
                                </p>
                                <p>{row.explanation}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {diagnosis && (
                      <div className="px-3 py-2 border-t bg-slate-50">
                        <p className="text-[9px] text-slate-400 font-bold">
                          Suggested ranges for: {DIAG_LABELS[diagnosis]} · PALICC-2 / PEMVECC
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Ventilation notes from engine */}
              {output.ventilation?.hasData && output.ventilation.advice.length > 0 && (
                <Card>
                  <CardHeader className="pb-2 border-b bg-slate-50/50">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-600" /> Acid-Base Guidance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3 space-y-2">
                    {output.ventilation.permissiveApplies && (
                      <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-xs font-black text-blue-800">Permissive hypercapnia strategy applies</p>
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

              {/* Quick links */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { tab: "airway", label: "Airway Helper", icon: <Stethoscope className="h-3.5 w-3.5" /> },
                  { tab: "guide",  label: "Scenario Guide", icon: <BookOpen className="h-3.5 w-3.5" /> },
                  { tab: "dopes",  label: "DOPES Emergency", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
                  { tab: "weaning", label: "Weaning", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
                ].map((link) => (
                  <Button key={link.tab} variant="outline" size="sm"
                    className="h-9 text-xs font-bold gap-1.5 justify-start"
                    onClick={() => setActiveTab(link.tab)}>
                    {link.icon} {link.label}
                  </Button>
                ))}
              </div>
            </>
          )
          )}
        </TabsContent>

        {/* ════════════════════ AIRWAY ════════════════════ */}
        <TabsContent value="airway" className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
          {!output.hasMinimumData ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <Calculator className="h-10 w-10 opacity-20" />
              <p className="font-bold text-sm">Enter age + weight in Setup</p>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("setup")}>Go to Setup</Button>
            </div>
          ) : output.airway && (
            <>
              {output.airway.warnings.map((w) => (
                <div key={w.code} className="flex gap-3 p-3 rounded-xl border bg-amber-50 border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black text-amber-900">{w.title}</p>
                    <p className="text-xs font-medium text-amber-800">{w.message}</p>
                  </div>
                </div>
              ))}
              <Card>
                <CardHeader className="pb-2 border-b bg-slate-50/50">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-blue-600" /> ETT Size Estimates
                    {ageValue && weight && <span className="text-[10px] text-slate-400 font-medium ml-1">· {ageValue} {ageUnit}, {weight} kg</span>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <SL>Uncuffed ID</SL>
                      <p className="text-2xl font-black text-blue-800 mt-1">{output.airway.estimatedSizeUncuffed} <span className="text-sm font-bold text-blue-500">mm</span></p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <SL>Cuffed ID</SL>
                      <p className="text-2xl font-black text-emerald-800 mt-1">{output.airway.estimatedSizeCuffed} <span className="text-sm font-bold text-emerald-500">mm</span></p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border">
                      <SL>Oral depth (at lip)</SL>
                      <p className="text-lg font-black text-slate-800 mt-1">{output.airway.estimatedDepthOral}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border">
                      <SL>Nasal depth (at nare)</SL>
                      <p className="text-lg font-black text-slate-800 mt-1">{output.airway.estimatedDepthNasal}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-xs font-bold text-amber-800">⚠ {output.airway.note}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader className="pb-2 border-b bg-red-50/30">
                  <CardTitle className="text-sm text-red-800 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Airway Red Flags</CardTitle>
                </CardHeader>
                <CardContent className="p-0 divide-y">
                  {[
                    { t: "Right mainstem intubation", d: "Absent left breath sounds, unilateral chest rise, SpO₂ drop → Pull tube back 1 cm and reassess." },
                    { t: "Tube obstruction / secretions", d: "High peak pressure, low VT, difficult suction catheter passage → Suction or change tube." },
                    { t: "Cuff / tube leak", d: "Low exhaled VT, audible cuff leak → Reposition, adjust cuff pressure (20–25 cmH₂O), or change tube." },
                    { t: "Accidental extubation", d: "Absent ETCO₂ waveform, absent breath sounds, gastric entry → Bag-mask ventilation immediately and re-intubate." },
                  ].map((f) => (
                    <div key={f.t} className="flex gap-3 p-3 hover:bg-slate-50">
                      <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5" />
                      <div>
                        <p className="text-xs font-black text-red-900">{f.t}</p>
                        <p className="text-xs font-medium text-slate-600">{f.d}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* ════════════════════ SCENARIO GUIDE ════════════════════ */}
        <TabsContent value="guide" className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
          {!output.scenario ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <BookOpen className="h-10 w-10 opacity-20" />
              <p className="font-bold text-sm">Select a diagnosis in Setup</p>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("setup")}>Go to Setup</Button>
            </div>
          ) : (
            <>
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl">
                <p className="text-sm font-black text-primary">{output.scenario.diagnosisLabel}</p>
                <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                  Suggested starting ranges · Reassess after every change · Senior/PICU review for all escalations
                </p>
              </div>
              {[
                { label: "Mode Considerations",     val: output.scenario.mode },
                { label: "VT Target",               val: output.scenario.vtTarget },
                { label: "PEEP Approach",           val: output.scenario.peepRange },
                { label: "RR Approach",             val: output.scenario.rrRange },
                { label: "Inspiratory Time / I:E",  val: output.scenario.itime },
                { label: "FiO₂ Starting Point",     val: output.scenario.fio2Start },
                { label: "Oxygenation Target",      val: output.scenario.oxyTarget },
                { label: "Ventilation Target",      val: output.scenario.ventTarget },
              ].map((row) => (
                <div key={row.label} className="p-3 border rounded-xl bg-white space-y-0.5">
                  <SL>{row.label}</SL>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">{row.val}</p>
                </div>
              ))}
              {output.scenario.cautions.length > 0 && (
                <Card className="border-amber-200">
                  <CardHeader className="pb-2 border-b bg-amber-50/50">
                    <CardTitle className="text-sm text-amber-800 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Cautions</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2 space-y-1.5">
                    {output.scenario.cautions.map((c, i) => (
                      <div key={i} className="flex gap-2 text-xs font-medium text-amber-800"><span>⚠</span>{c}</div>
                    ))}
                  </CardContent>
                </Card>
              )}
              {output.scenario.seniorReviewIf.length > 0 && (
                <Card className="border-red-200">
                  <CardHeader className="pb-2 border-b bg-red-50/30">
                    <CardTitle className="text-sm text-red-800 flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Senior/PICU Review If</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2 space-y-1.5">
                    {output.scenario.seniorReviewIf.map((s, i) => (
                      <div key={i} className="flex gap-2 text-xs font-medium text-red-800"><ArrowRight className="h-3 w-3 shrink-0 mt-0.5" />{s}</div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* ════════════════════ DOPES ════════════════════ */}
        <TabsContent value="dopes" className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
          <Alert variant="destructive" className="border-2 border-red-500 bg-red-50/60">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-900 font-black">Acute deterioration in ventilated patient</AlertTitle>
            <AlertDescription className="text-red-800 font-bold text-sm mt-1">
              Disconnect from ventilator immediately → hand-bag with 100% O₂ → systematically assess DOPES.
            </AlertDescription>
          </Alert>
          <Card>
            <CardContent className="p-0 divide-y">
              {[
                { l: "D", c: "bg-red-100 text-red-700",     t: "Displacement",      d: "ETT dislodged? Right mainstem? Accidental extubation? → Check ETCO₂ waveform. Auscultate bilaterally. Direct visualisation if uncertain." },
                { l: "O", c: "bg-orange-100 text-orange-700", t: "Obstruction",      d: "Tube kinked or blocked by secretions? → Attempt to pass suction catheter. If unable, change tube. Use bite block." },
                { l: "P", c: "bg-amber-100 text-amber-700", t: "Pneumothorax",        d: "Tension pneumothorax? Unequal sounds, tracheal shift, haemodynamic collapse? → POCUS / transilluminate. Needle decompress 2nd ICS MCL if crashing. Don't wait for CXR." },
                { l: "E", c: "bg-blue-100 text-blue-700",   t: "Equipment Failure",  d: "Vent disconnected? Circuit leak? Gas supply failure? → Manual bagging immediately rules out equipment cause." },
                { l: "S", c: "bg-purple-100 text-purple-700", t: "Stacked Breaths / Auto-PEEP · Stomach · Sedation", d: "Air trapping (asthma): disconnect to listen for prolonged exhalation. Gastric distension: decompress NG. Fighting vent: optimise sedation, check for pain/obstruction." },
              ].map((item) => (
                <div key={item.l} className="p-4 flex gap-4 hover:bg-slate-50">
                  <div className={cn("w-10 h-10 shrink-0 rounded-xl font-black text-xl flex items-center justify-center", item.c)}>{item.l}</div>
                  <div>
                    <p className="font-black text-slate-900 text-sm">{item.t}</p>
                    <p className="text-xs font-medium text-slate-600 mt-0.5 leading-relaxed">{item.d}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-2.5 border-b bg-slate-50/50">
              <CardTitle className="text-xs uppercase tracking-widest text-slate-600">Routine Monitoring</CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-1.5 text-xs font-medium text-slate-700">
              {["Continuous SpO₂, ETCO₂ waveform, ECG, BP", "ABG/VBG 30–60 min after any significant setting change", "CXR after intubation and after tube repositioning", "Cuff pressure 20–25 cmH₂O (if cuffed tube)", "VAP bundle: HOB 30°, mouth care, daily sedation hold assessment", "Hourly intake and output"].map((m, i) => (
                <div key={i} className="flex gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" /> {m}</div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ════════════════════ WEANING ════════════════════ */}
        <TabsContent value="weaning" className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
          {!output.hasMinimumData ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <Calculator className="h-10 w-10 opacity-20" />
              <p className="font-bold text-sm">Enter age + weight in Setup</p>
            </div>
          ) : output.weaning && (
            <>
              <div className={cn("p-4 rounded-xl border-2", {
                "bg-emerald-50 border-emerald-300": output.weaning.overallStatus === "proceed-with-assessment",
                "bg-red-50 border-red-300":         output.weaning.overallStatus === "not-ready",
                "bg-slate-50 border-slate-200":     output.weaning.overallStatus === "no-data",
              })}>
                <p className={cn("font-black text-sm", {
                  "text-emerald-800": output.weaning.overallStatus === "proceed-with-assessment",
                  "text-red-800":     output.weaning.overallStatus === "not-ready",
                  "text-slate-600":   output.weaning.overallStatus === "no-data",
                })}>
                  {output.weaning.overallStatus === "proceed-with-assessment" && "Computed criteria suggest: Consider formal extubation assessment — senior review required"}
                  {output.weaning.overallStatus === "not-ready"              && "Computed criteria suggest: Not ready for extubation attempt"}
                  {output.weaning.overallStatus === "no-data"                && "Insufficient data — complete assessment clinically"}
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
                  <CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Readiness Criteria</CardTitle>
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

              <Card>
                <CardHeader className="py-2.5 border-b bg-slate-50/50">
                  <CardTitle className="text-xs uppercase tracking-widest text-slate-600">Pre-Extubation Planning</CardTitle>
                </CardHeader>
                <CardContent className="pt-3 space-y-1.5 text-xs font-medium text-slate-700">
                  {["Cuff leak test if high risk for post-extubation stridor (infants, prolonged intubation, prior failure)", "Consider Dexamethasone 0.15 mg/kg IV 12–24h before if high stridor risk", "Post-extubation support plan ready at bedside: HFNC / CPAP / NIPPV", "Extubate during daytime with experienced team present", "Re-intubation equipment immediately available", "Brief family and nursing team before extubation attempt"].map((item, i) => (
                    <div key={i} className="flex gap-2"><ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />{item}</div>
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
          <li>• PALS 2020 (AHA/AAP). Harriet Lane Handbook — airway sizing.</li>
          <li>• Clinical decision support only. Not a substitute for clinical judgment or specialist review.</li>
        </ul>
      </div>
    </div>
  );
}
