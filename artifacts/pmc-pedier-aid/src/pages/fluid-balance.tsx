import { useState, useMemo } from "react";
import { Droplets, AlertTriangle, Info, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FluidEntry {
  id: string;
  label: string;
  volume: string;
  type: "in" | "out";
}

function mkId() { return Math.random().toString(36).slice(2); }

function classify(pfo: number) {
  if (pfo < 5) return { label: "Acceptable", color: "emerald", action: "Continue monitoring. Reassess every 8–12 hours." };
  if (pfo < 10) return { label: "Fluid Overload — Alert", color: "amber", action: "Reassess fluid need. Consider diuretic therapy. Restrict unnecessary fluids. Target neutral or negative balance." };
  if (pfo < 15) return { label: "Significant Fluid Overload", color: "orange", action: "Strong indication for diuresis. Furosemide 1–2 mg/kg IV. Reassess after each dose. If oliguric AKI — nephrology consult." };
  return { label: "Critical Fluid Overload", color: "red", action: "Urgent intervention required. Furosemide ± metolazone. Consider fluid removal via CRRT if renal failure. Restrict ALL non-essential fluids immediately." };
}

const colorMap: Record<string, string> = {
  emerald: "text-emerald-700 border-emerald-200 bg-emerald-50",
  amber:   "text-amber-700 border-amber-200 bg-amber-50",
  orange:  "text-orange-700 border-orange-200 bg-orange-50",
  red:     "text-red-700 border-red-200 bg-red-50",
};
const badgeMap: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-800",
  amber:   "bg-amber-100 text-amber-800",
  orange:  "bg-orange-100 text-orange-800",
  red:     "bg-red-100 text-red-800",
};

const DEFAULT_INS: Omit<FluidEntry, "id">[] = [
  { label: "IV Fluids", volume: "", type: "in" },
  { label: "Drug Infusions", volume: "", type: "in" },
  { label: "Oral / NG Intake", volume: "", type: "in" },
  { label: "Blood Products", volume: "", type: "in" },
];

const DEFAULT_OUTS: Omit<FluidEntry, "id">[] = [
  { label: "Urine Output", volume: "", type: "out" },
  { label: "NG Losses", volume: "", type: "out" },
  { label: "Drain Output", volume: "", type: "out" },
  { label: "Insensible Losses", volume: "", type: "out" },
];

export default function FluidBalancePage() {
  const [admitWeight, setAdmitWeight] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [entries, setEntries] = useState<FluidEntry[]>([
    ...DEFAULT_INS.map(e => ({ ...e, id: mkId() })),
    ...DEFAULT_OUTS.map(e => ({ ...e, id: mkId() })),
  ]);

  function updateEntry(id: string, field: "label" | "volume", value: string) {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  }

  function addEntry(type: "in" | "out") {
    setEntries(prev => [...prev, { id: mkId(), label: "", volume: "", type }]);
  }

  function removeEntry(id: string) {
    setEntries(prev => prev.filter(e => e.id !== id));
  }

  const result = useMemo(() => {
    const aw = parseFloat(admitWeight);
    if (!aw || aw <= 0) return null;

    const totalIn = entries.filter(e => e.type === "in").reduce((s, e) => s + (parseFloat(e.volume) || 0), 0);
    const totalOut = entries.filter(e => e.type === "out").reduce((s, e) => s + (parseFloat(e.volume) || 0), 0);
    const cumBalance = totalIn - totalOut;
    const pfo = (cumBalance / aw) * 100;

    const weightDiff = currentWeight ? (parseFloat(currentWeight) - aw) * 1000 : null;

    return { totalIn, totalOut, cumBalance, pfo, weightDiff, classif: classify(Math.abs(pfo)) };
  }, [admitWeight, currentWeight, entries]);

  const ins = entries.filter(e => e.type === "in");
  const outs = entries.filter(e => e.type === "out");

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-cyan-100 text-cyan-700">
          <Droplets className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Fluid Balance Alert</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Cumulative fluid balance calculator with percent fluid overload (PFO) alerts for PICU/ward patients.
          </p>
        </div>
      </div>

      <Alert className="rounded-2xl border-cyan-200 bg-cyan-50">
        <Info className="h-4 w-4 text-cyan-600" />
        <AlertDescription className="text-cyan-800 text-sm">
          <strong>% Fluid Overload (PFO)</strong> = (Cumulative balance ÷ Admission weight) × 100.
          Alert thresholds: ≥ 5% = caution, ≥ 10% = action, ≥ 15% = critical. Based on Goldstein et al. (PICU outcome data).
        </AlertDescription>
      </Alert>

      {/* Weights */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Patient Weight</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="font-bold text-sm">Admission Weight</Label>
            <p className="text-xs text-muted-foreground">Used for PFO denominator</p>
            <div className="relative">
              <Input type="number" min={0} step={0.1} placeholder="e.g. 20"
                value={admitWeight} onChange={e => setAdmitWeight(e.target.value)}
                className="pr-10 h-11 rounded-xl font-semibold" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">kg</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="font-bold text-sm">Current Weight (optional)</Label>
            <p className="text-xs text-muted-foreground">For cross-validation</p>
            <div className="relative">
              <Input type="number" min={0} step={0.1} placeholder="e.g. 21"
                value={currentWeight} onChange={e => setCurrentWeight(e.target.value)}
                className="pr-10 h-11 rounded-xl font-semibold" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">kg</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fluid entries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ins */}
        <Card className="rounded-3xl border-2 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-black text-blue-700 flex items-center justify-between">
              <span>Intake (mL)</span>
              <button onClick={() => addEntry("in")} className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-xl font-bold hover:bg-blue-200 transition-colors">
                <Plus className="h-3 w-3" /> Add
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {ins.map(e => (
              <div key={e.id} className="flex gap-2 items-center">
                <Input placeholder="Source" value={e.label} onChange={x => updateEntry(e.id, "label", x.target.value)}
                  className="h-9 rounded-xl text-sm flex-1 min-w-0" />
                <Input type="number" min={0} placeholder="mL" value={e.volume} onChange={x => updateEntry(e.id, "volume", x.target.value)}
                  className="h-9 rounded-xl text-sm w-20" />
                <button onClick={() => removeEntry(e.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Outs */}
        <Card className="rounded-3xl border-2 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-black text-amber-700 flex items-center justify-between">
              <span>Output (mL)</span>
              <button onClick={() => addEntry("out")} className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-xl font-bold hover:bg-amber-200 transition-colors">
                <Plus className="h-3 w-3" /> Add
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {outs.map(e => (
              <div key={e.id} className="flex gap-2 items-center">
                <Input placeholder="Source" value={e.label} onChange={x => updateEntry(e.id, "label", x.target.value)}
                  className="h-9 rounded-xl text-sm flex-1 min-w-0" />
                <Input type="number" min={0} placeholder="mL" value={e.volume} onChange={x => updateEntry(e.id, "volume", x.target.value)}
                  className="h-9 rounded-xl text-sm w-20" />
                <button onClick={() => removeEntry(e.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Result */}
      {result && admitWeight && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <Card className="rounded-3xl border-2 border-blue-200 bg-blue-50">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-xs font-black text-blue-600/60 uppercase tracking-widest mb-1">Total In</p>
                <p className="text-2xl font-black text-blue-800">{result.totalIn.toFixed(0)}</p>
                <p className="text-xs text-blue-600/60">mL</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-2 border-amber-200 bg-amber-50">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-xs font-black text-amber-600/60 uppercase tracking-widest mb-1">Total Out</p>
                <p className="text-2xl font-black text-amber-800">{result.totalOut.toFixed(0)}</p>
                <p className="text-xs text-amber-600/60">mL</p>
              </CardContent>
            </Card>
            <Card className={cn("rounded-3xl border-2", result.cumBalance >= 0 ? "border-primary/30 bg-primary/5" : "border-emerald-200 bg-emerald-50")}>
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-xs font-black opacity-60 uppercase tracking-widest mb-1">Balance</p>
                <p className={cn("text-2xl font-black", result.cumBalance > 0 ? "text-primary" : "text-emerald-700")}>
                  {result.cumBalance >= 0 ? "+" : ""}{result.cumBalance.toFixed(0)}
                </p>
                <p className="text-xs text-muted-foreground">mL</p>
              </CardContent>
            </Card>
          </div>

          <Card className={cn("rounded-3xl border-2", colorMap[result.classif.color])}>
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">% Fluid Overload</p>
                  <p className="text-5xl font-black">{Math.abs(result.pfo).toFixed(1)}<span className="text-xl font-semibold opacity-60">%</span></p>
                  <p className="text-sm opacity-60 mt-0.5">{result.cumBalance >= 0 ? "Positive" : "Negative"} balance</p>
                </div>
                <Badge className={cn("font-black text-sm px-3 py-1", badgeMap[result.classif.color])}>
                  {result.classif.label}
                </Badge>
              </div>
              <p className="text-sm font-semibold opacity-80">{result.classif.action}</p>

              {result.weightDiff !== null && (
                <div className="mt-3 pt-3 border-t border-current/10">
                  <p className="text-xs font-black opacity-60 uppercase tracking-widest mb-0.5">Weight Change Check</p>
                  <p className="text-sm font-semibold">
                    Weight diff: {result.weightDiff >= 0 ? "+" : ""}{result.weightDiff.toFixed(0)} mL equivalent
                    {Math.abs(result.weightDiff - result.cumBalance) > 200
                      ? " — significant discrepancy with fluid balance record"
                      : " — consistent with fluid balance record"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <Alert className="rounded-2xl border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 text-sm">
          <strong>PFO ≥ 10%</strong> is independently associated with increased PICU mortality (Goldstein 2001, SMART trial). PFO ≥ 20% is associated with organ dysfunction. Aggressive de-resuscitation should start early — do not wait for overt oedema.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference: Goldstein SL et al. <em>Pediatrics</em> 2001;107:1309 · Valentine SL et al. <em>JAMA</em> 2022 · PICU Fluid Balance Guidelines
      </p>
    </div>
  );
}
