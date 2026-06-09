import { useState, useMemo } from "react";
import { Baby, Info, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

// NICHD NRN Extremely Preterm Birth Outcome Data
// Based on: Tyson JE et al. NEJM 2008 & NICHD NRN 2006 data
// Outcomes by gestational age (weeks), birth weight, sex, singleton, antenatal corticosteroids

type OutcomeRow = {
  survival: string;       // % survival to discharge
  intactSurvival: string; // % survival without major morbidity
  ndi: string;           // % moderate-severe NDI among survivors
  notes: string;
};

const NIHCD_DATA: Record<string, Record<string, OutcomeRow>> = {
  "22": {
    base: { survival: "5–10%", intactSurvival: "2–4%", ndi: "~80%", notes: "Periviable. Active intervention considered on individualised basis only." },
    optimal: { survival: "10–15%", intactSurvival: "4–8%", ndi: "~75%", notes: "With all favourable factors. Still very high mortality and morbidity." },
  },
  "23": {
    base: { survival: "20–25%", intactSurvival: "8–12%", ndi: "~65%", notes: "Periviable threshold. Active care should be discussed with parents." },
    optimal: { survival: "30–40%", intactSurvival: "15–20%", ndi: "~55%", notes: "Optimal factor profile significantly improves outcomes at 23 weeks." },
  },
  "24": {
    base: { survival: "40–50%", intactSurvival: "15–20%", ndi: "~55%", notes: "Generally considered threshold of viability. Active resuscitation standard." },
    optimal: { survival: "55–65%", intactSurvival: "28–35%", ndi: "~45%", notes: "Good outcome possible with optimal care and favourable factors." },
  },
  "25": {
    base: { survival: "55–65%", intactSurvival: "25–30%", ndi: "~45%", notes: "Survival majority. Major morbidities still frequent (IVH, BPD, NEC)." },
    optimal: { survival: "70–78%", intactSurvival: "40–48%", ndi: "~35%", notes: "" },
  },
  "26": {
    base: { survival: "65–75%", intactSurvival: "35–42%", ndi: "~38%", notes: "Majority survive. ROP, BPD, NEC remain significant risks." },
    optimal: { survival: "78–85%", intactSurvival: "50–58%", ndi: "~28%", notes: "" },
  },
  "27": {
    base: { survival: "75–82%", intactSurvival: "50–55%", ndi: "~30%", notes: "Good survival expected. Neurodevelopmental follow-up essential." },
    optimal: { survival: "85–90%", intactSurvival: "62–70%", ndi: "~22%", notes: "" },
  },
  "28": {
    base: { survival: "83–88%", intactSurvival: "60–65%", ndi: "~22%", notes: "Strong survival expected. BPD and ROP still significant." },
    optimal: { survival: "88–93%", intactSurvival: "72–78%", ndi: "~18%", notes: "" },
  },
};

const FAVOURABLE_FACTORS = [
  { id: "female", label: "Female sex", description: "Girls have ~10% improved survival vs boys at same GA" },
  { id: "acs", label: "Antenatal corticosteroids received (complete course)", description: "+10–15% survival advantage" },
  { id: "singleton", label: "Singleton pregnancy", description: "Better lung maturity than multiple gestation at same GA" },
  { id: "weight", label: "Birth weight > 25th percentile for GA", description: "Appropriate weight suggests better reserve" },
];

const colorForGA: Record<string, string> = {
  "22": "red", "23": "red", "24": "orange", "25": "amber", "26": "amber", "27": "emerald", "28": "emerald",
};
const colorMap: Record<string, string> = {
  red:     "text-red-700 border-red-200 bg-red-50",
  orange:  "text-orange-700 border-orange-200 bg-orange-50",
  amber:   "text-amber-700 border-amber-200 bg-amber-50",
  emerald: "text-emerald-700 border-emerald-200 bg-emerald-50",
};
const badgeMap: Record<string, string> = {
  red:     "bg-red-100 text-red-800",
  orange:  "bg-orange-100 text-orange-800",
  amber:   "bg-amber-100 text-amber-800",
  emerald: "bg-emerald-100 text-emerald-800",
};

export default function PrematurityPredictorPage() {
  const [ga, setGa] = useState<string>("");
  const [factors, setFactors] = useState<string[]>([]);

  function toggleFactor(id: string) {
    setFactors(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  const gaInt = parseInt(ga);
  const gaStr = gaInt >= 22 && gaInt <= 28 ? String(gaInt) : null;

  const data = useMemo(() => {
    if (!gaStr) return null;
    const gaData = NIHCD_DATA[gaStr];
    const hasOptimal = factors.length >= 2;
    return { base: gaData.base, optimal: gaData.optimal, isOptimal: hasOptimal };
  }, [gaStr, factors]);

  const current = data ? (data.isOptimal ? data.optimal : data.base) : null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-pink-100 text-pink-700">
          <Baby className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Prematurity Outcome Predictor</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Survival and neurodevelopmental outcome estimates for extremely preterm infants 22–28 weeks GA, based on NICHD NRN data.
          </p>
        </div>
      </div>

      <Alert className="rounded-2xl border-pink-200 bg-pink-50">
        <Info className="h-4 w-4 text-pink-600" />
        <AlertDescription className="text-pink-800 text-sm">
          <strong>These are population-level estimates from NICHD NRN data (2006 cohort, updated models).</strong> Individual outcomes vary significantly. Use for family counselling discussions only — not for individual prognosis. Outcomes have improved with modern NICU care; recent cohorts may show higher survival.
        </AlertDescription>
      </Alert>

      {/* GA selection */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Gestational Age at Delivery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {["22", "23", "24", "25", "26", "27", "28"].map(w => (
              <button
                key={w}
                onClick={() => setGa(w)}
                className={cn(
                  "px-5 py-3 rounded-2xl border-2 font-black text-lg transition-all",
                  ga === w ? "bg-primary text-white border-primary shadow-md" : "bg-muted/20 border-transparent hover:border-primary/30"
                )}
              >
                {w}w
              </button>
            ))}
          </div>
          {gaInt < 22 || (gaInt > 28 && ga !== "") ? (
            <p className="text-xs text-muted-foreground mt-2">Data available for 22–28 weeks only. For ≥ 29 weeks, outcomes are generally favourable — see local NICU statistics.</p>
          ) : null}
        </CardContent>
      </Card>

      {/* Favourable factors */}
      {gaStr && (
        <Card className="rounded-3xl border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-black">Favourable Prognostic Factors</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">≥ 2 factors = "Optimal" profile. Select all that apply.</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {FAVOURABLE_FACTORS.map(f => (
              <button
                key={f.id}
                onClick={() => toggleFactor(f.id)}
                className={cn(
                  "w-full text-left p-3 rounded-2xl border-2 font-semibold text-sm transition-all",
                  factors.includes(f.id) ? "bg-primary/10 border-primary text-primary" : "bg-muted/20 border-transparent hover:border-primary/30"
                )}
              >
                <span className="mr-2">{factors.includes(f.id) ? "✓" : "○"}</span>
                <span className="font-black">{f.label}</span>
                <span className="text-muted-foreground font-normal ml-1">— {f.description}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Outcome display */}
      {gaStr && current && data && (
        <>
          <Card className={cn("rounded-3xl border-2", colorMap[colorForGA[gaStr] ?? "emerald"])}>
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Gestational Age</p>
                  <p className="text-4xl font-black">{gaStr} weeks</p>
                </div>
                <Badge className={cn("font-black", badgeMap[colorForGA[gaStr] ?? "emerald"])}>
                  {data.isOptimal ? "Optimal Profile" : "Base Profile"}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="rounded-2xl bg-white/60 p-3 border text-center">
                  <p className="text-xs font-black opacity-60 uppercase tracking-widest mb-1">Survival</p>
                  <p className="text-2xl font-black">{current.survival}</p>
                </div>
                <div className="rounded-2xl bg-white/60 p-3 border text-center">
                  <p className="text-xs font-black opacity-60 uppercase tracking-widest mb-1">Intact Survival</p>
                  <p className="text-2xl font-black">{current.intactSurvival}</p>
                  <p className="text-xs opacity-60">No major morbidity</p>
                </div>
                <div className="rounded-2xl bg-white/60 p-3 border text-center">
                  <p className="text-xs font-black opacity-60 uppercase tracking-widest mb-1">NDI Risk</p>
                  <p className="text-2xl font-black">{current.ndi}</p>
                  <p className="text-xs opacity-60">Mod-severe NDI</p>
                </div>
              </div>

              {current.notes && <p className="text-sm font-semibold opacity-80">{current.notes}</p>}

              {!data.isOptimal && (
                <div className="mt-3 pt-3 border-t border-current/10">
                  <p className="text-xs font-bold opacity-60 mb-1">With ≥ 2 Favourable Factors:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[["Survival", data.optimal.survival], ["Intact", data.optimal.intactSurvival], ["NDI", data.optimal.ndi]].map(([label, val]) => (
                      <div key={label} className="rounded-xl bg-white/40 p-2 text-center">
                        <p className="text-xs font-bold opacity-60">{label}</p>
                        <p className="font-black">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Common morbidities */}
          <Card className="rounded-3xl border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-black flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                Common Morbidities in Survivors at {gaStr} weeks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {[
                  ["Bronchopulmonary Dysplasia (BPD)", gaInt <= 24 ? "60–75%" : gaInt <= 26 ? "40–55%" : "20–35%"],
                  ["Severe IVH (Grade III–IV)", gaInt <= 24 ? "30–40%" : gaInt <= 26 ? "15–25%" : "8–15%"],
                  ["Retinopathy of Prematurity (ROP ≥ Stage 3)", gaInt <= 24 ? "40–50%" : gaInt <= 26 ? "25–35%" : "15–22%"],
                  ["Necrotising Enterocolitis (NEC)", gaInt <= 24 ? "15–20%" : gaInt <= 26 ? "10–15%" : "6–10%"],
                  ["Late-onset Sepsis", "25–45% (all GA < 28 weeks)"],
                  ["Hearing impairment", "10–15% at 22–26 weeks"],
                ].map(([morbidity, rate]) => (
                  <div key={morbidity} className="flex justify-between items-center py-1 border-b last:border-b-0">
                    <span className="text-muted-foreground">{morbidity}</span>
                    <span className="font-bold">{rate}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Alert className="rounded-2xl border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 text-sm">
          <strong>Family counselling:</strong> Decisions about active resuscitation at the periviable threshold (22–23 weeks) must balance parental values, local NICU capabilities, and infant-specific factors. Always involve neonatology, ethics consultation if needed, and provide honest prognostic information. Avoid numerical fatalism — present ranges, not single point estimates.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference: Tyson JE et al. <em>NEJM</em> 2008;358:1672–81 · NICHD NRN 2016 EPTBirth outcomes · Younge N et al. <em>NEJM</em> 2017
      </p>
    </div>
  );
}
