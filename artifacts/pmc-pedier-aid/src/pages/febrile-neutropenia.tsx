import { useState, useMemo } from "react";
import { ShieldAlert, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// MASCC Score — Multinational Association for Supportive Care in Cancer
// Max score: 26; ≥ 21 = low risk; < 21 = high risk

const MASCC_ITEMS = [
  {
    id: "burden",
    label: "Burden of illness — symptom severity",
    description: "Based on patient's subjective assessment and objective findings",
    options: [
      { score: 5, label: "No or mild symptoms" },
      { score: 3, label: "Moderate symptoms" },
      { score: 0, label: "Severe symptoms / moribund" },
    ],
  },
  {
    id: "hypotension",
    label: "No hypotension",
    description: "SBP ≥ 90 mmHg",
    options: [
      { score: 5, label: "No hypotension (SBP ≥ 90 mmHg)" },
      { score: 0, label: "Hypotension present (SBP < 90 mmHg)" },
    ],
  },
  {
    id: "copd",
    label: "No active COPD",
    description: "History of chronic lung disease requiring medication or O₂",
    options: [
      { score: 4, label: "No COPD / chronic lung disease" },
      { score: 0, label: "Active COPD or chronic lung disease" },
    ],
  },
  {
    id: "solid_tumour",
    label: "Solid tumour or no previous fungal infection",
    description: "Solid tumour OR haematological malignancy without previous fungal infection",
    options: [
      { score: 4, label: "Solid tumour OR no prior fungal infection" },
      { score: 0, label: "Haematological malignancy WITH prior fungal infection" },
    ],
  },
  {
    id: "dehydration",
    label: "No dehydration requiring IV fluids",
    description: "Clinical assessment of dehydration",
    options: [
      { score: 3, label: "Not dehydrated / no IV fluids needed" },
      { score: 0, label: "Dehydration requiring IV fluids" },
    ],
  },
  {
    id: "outpatient",
    label: "Outpatient status at fever onset",
    description: "Was patient an outpatient when fever developed?",
    options: [
      { score: 3, label: "Outpatient status at onset" },
      { score: 0, label: "Inpatient at fever onset" },
    ],
  },
  {
    id: "age",
    label: "Age < 60 years",
    description: "Applies to paediatric patients (all < 60 years)",
    options: [
      { score: 2, label: "Age < 60 years" },
      { score: 0, label: "Age ≥ 60 years" },
    ],
  },
];

type Selections = Record<string, number>;

export default function FebrileNeutropeniaPage() {
  const [selections, setSelections] = useState<Selections>({});
  const [anc, setAnc] = useState("");
  const [tempC, setTempC] = useState("");

  function select(domainId: string, score: number) {
    setSelections(prev => ({ ...prev, [domainId]: score }));
  }

  const totalScore = useMemo(() => Object.values(selections).reduce((a, b) => a + b, 0), [selections]);
  const allSelected = MASCC_ITEMS.every(i => selections[i.id] !== undefined);
  const ancNum = parseFloat(anc);
  const isFebNeutropenia = ancNum < 500 && parseFloat(tempC) >= 38.3;

  const riskClass = totalScore >= 21 ? "low" : "high";
  const riskColor = riskClass === "low" ? "emerald" : "red";

  const colorMap: Record<string, string> = {
    emerald: "text-emerald-700 border-emerald-200 bg-emerald-50",
    red:     "text-red-700 border-red-200 bg-red-50",
  };
  const badgeMap: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-800",
    red:     "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-rose-100 text-rose-700">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Febrile Neutropenia Risk (MASCC)</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Multinational Association for Supportive Care in Cancer score — stratifies febrile neutropenia into low-risk vs high-risk for serious complications.
          </p>
        </div>
      </div>

      <Alert className="rounded-2xl border-rose-200 bg-rose-50">
        <Info className="h-4 w-4 text-rose-600" />
        <AlertDescription className="text-rose-800 text-sm">
          <strong>Definition:</strong> Febrile neutropenia = Temperature ≥ 38.3°C (single) or ≥ 38.0°C for ≥ 1 hour AND ANC &lt; 500 cells/μL (or &lt; 1000 and expected to fall). Treat as medical emergency — start antibiotics within 60 minutes.
        </AlertDescription>
      </Alert>

      {/* ANC + Temp */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Confirm Diagnosis</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="font-bold text-sm">ANC (Absolute Neutrophil Count)</Label>
            <div className="relative">
              <Input type="number" min={0} step={10} placeholder="e.g. 350"
                value={anc} onChange={e => setAnc(e.target.value)}
                className="pr-16 h-11 rounded-xl font-semibold" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">cells/μL</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="font-bold text-sm">Temperature</Label>
            <div className="relative">
              <Input type="number" min={35} max={42} step={0.1} placeholder="e.g. 38.6"
                value={tempC} onChange={e => setTempC(e.target.value)}
                className="pr-8 h-11 rounded-xl font-semibold" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">°C</span>
            </div>
          </div>
          {anc && tempC && (
            <div className="col-span-2">
              <Badge className={cn("font-bold text-sm", isFebNeutropenia ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800")}>
                {isFebNeutropenia ? "Meets criteria for febrile neutropenia" : "Does not meet strict criteria — reassess"}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MASCC items */}
      <div className="space-y-5">
        {MASCC_ITEMS.map((item, di) => (
          <Card key={item.id} className="rounded-3xl border-2">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-black">{di + 1}. {item.label}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                </div>
                {selections[item.id] !== undefined && (
                  <Badge className="bg-primary/10 text-primary font-black shrink-0">+{selections[item.id]}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex gap-2 flex-wrap">
              {item.options.map(opt => (
                <button
                  key={opt.score}
                  onClick={() => select(item.id, opt.score)}
                  className={cn(
                    "flex-1 p-3 rounded-2xl border-2 text-sm font-semibold text-left transition-all min-w-40",
                    selections[item.id] === opt.score
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-muted/20 border-transparent hover:border-primary/30"
                  )}
                >
                  <span className="block font-black">{opt.score > 0 ? `+${opt.score} pts` : "0 pts"}</span>
                  <span className="text-xs mt-0.5">{opt.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Result */}
      {allSelected && (
        <Card className={cn("rounded-3xl border-2", colorMap[riskColor])}>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">MASCC Score</p>
                <p className="text-5xl font-black">{totalScore} <span className="text-xl font-semibold opacity-60">/ 26</span></p>
              </div>
              <Badge className={cn("font-black text-sm px-3 py-1", badgeMap[riskColor])}>
                {riskClass === "low" ? "Low Risk" : "High Risk"}
              </Badge>
            </div>

            <div className="rounded-2xl bg-white/60 p-4 border space-y-3">
              <p className="font-black text-sm uppercase tracking-widest opacity-60">Management</p>
              {riskClass === "low" ? (
                <div className="space-y-1.5 text-sm">
                  {[
                    "Score ≥ 21 = low risk of serious complications (mortality ~1%)",
                    "Consider oral antibiotics: Ciprofloxacin 20–30 mg/kg/day BD + Amoxicillin-Clavulanate",
                    "OR IV ceftriaxone + same day discharge if compliant and close follow-up available",
                    "Reassess at 24 and 48 hours — re-admit if deterioration",
                    "Criteria for outpatient management: no MASCC exclusions + reliable carer + proximity to hospital",
                  ].map((s, i) => (
                    <div key={i} className="flex gap-2"><span className="opacity-50 shrink-0 mt-0.5">•</span><span>{s}</span></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1.5 text-sm">
                  {[
                    "Score < 21 = HIGH RISK — hospital admission mandatory",
                    "IV broad-spectrum antibiotics within 60 minutes of presentation",
                    "First-line: Piperacillin-Tazobactam 300 mg/kg/day q6h (or local protocol)",
                    "Add Vancomycin if: line-associated infection, skin/soft tissue, hypotension, or known MRSA",
                    "Add antifungal (Caspofungin or Fluconazole) if fever persists > 4–7 days",
                    "G-CSF for prolonged neutropenia or septic shock — oncology decision",
                    "Cultures: blood (all lumens), urine, CXR before starting antibiotics — do not delay antibiotics",
                  ].map((s, i) => (
                    <div key={i} className="flex gap-2"><span className="opacity-50 shrink-0 mt-0.5">•</span><span>{s}</span></div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Alert className="rounded-2xl border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 text-sm">
          <strong>Never delay antibiotics</strong> while scoring. MASCC guides disposition AFTER initial empiric treatment. All febrile neutropenic children should receive IV antibiotics within 60 minutes regardless of score. Paediatric MASCC validation has been done but adult thresholds should be applied cautiously.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference: Klastersky J et al. <em>J Clin Oncol</em> 2000 · SIOPE/ESSO Febrile Neutropenia Guideline 2019 · NCCN Guidelines Version 2024
      </p>
    </div>
  );
}
