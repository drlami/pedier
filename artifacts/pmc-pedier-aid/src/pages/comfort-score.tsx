import { useState, useMemo } from "react";
import { Moon, Info, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const DOMAINS = [
  {
    id: "alertness",
    label: "Alertness",
    description: "Level of consciousness / wakefulness",
    options: [
      { score: 1, label: "Deeply asleep — no response to stimuli" },
      { score: 2, label: "Lightly asleep — occasional startles, spontaneous eye movements" },
      { score: 3, label: "Drowsy — frequent startles/movements but eyes mostly closed" },
      { score: 4, label: "Awake — eyes open but not fully attentive; limited external response" },
      { score: 5, label: "Fully awake — alert, responsive to environment" },
    ],
  },
  {
    id: "calmness",
    label: "Calmness / Agitation",
    description: "Restlessness, distress, or anxiety",
    options: [
      { score: 1, label: "Calm — tranquil, no agitation" },
      { score: 2, label: "Slightly anxious — minor movement or facial tension" },
      { score: 3, label: "Anxious — significant restlessness, difficult to calm" },
      { score: 4, label: "Very anxious — thrashing, crying, very difficult to settle" },
      { score: 5, label: "Panicky / terrified — extreme distress, unable to be consoled" },
    ],
  },
  {
    id: "respiratory",
    label: "Respiratory Response",
    description: "Response to ventilator or own breathing effort",
    options: [
      { score: 1, label: "No coughing, no spontaneous respiration (fully ventilated)" },
      { score: 2, label: "Spontaneous breathing with ventilator — no fighting" },
      { score: 3, label: "Occasional cough / mild resistance to ventilator" },
      { score: 4, label: "Frequent coughing or fighting ventilator" },
      { score: 5, label: "Continuously fighting ventilator / extubating self" },
    ],
  },
  {
    id: "movement",
    label: "Physical Movement",
    description: "Body movement and motor activity",
    options: [
      { score: 1, label: "No movement — completely still" },
      { score: 2, label: "Occasional slight movement" },
      { score: 3, label: "Frequent mild movements" },
      { score: 4, label: "Vigorous movements — limited to extremities" },
      { score: 5, label: "Vigorous movements — includes head and trunk" },
    ],
  },
  {
    id: "muscle_tone",
    label: "Muscle Tone",
    description: "Resistance when passively flexing extremities",
    options: [
      { score: 1, label: "Muscles totally relaxed — no tone" },
      { score: 2, label: "Reduced muscle tone — less than normal" },
      { score: 3, label: "Normal muscle tone" },
      { score: 4, label: "Increased tone — flexion of fingers and toes" },
      { score: 5, label: "Extreme muscle rigidity — full flexion of fingers, toes, and limbs" },
    ],
  },
  {
    id: "facial_tension",
    label: "Facial Tension",
    description: "Muscular tension in face",
    options: [
      { score: 1, label: "Facial muscles totally relaxed — no tension" },
      { score: 2, label: "Normal facial tone" },
      { score: 3, label: "Obvious facial tension — some grimacing" },
      { score: 4, label: "Facial tension throughout observation" },
      { score: 5, label: "Extreme facial tension — contorted grimace" },
    ],
  },
];

type Selection = Record<string, number>;

function classify(total: number) {
  if (total <= 10) return { label: "Over-sedated", color: "blue", action: "Consider dose reduction. Risk of prolonged ventilation, withdrawal, and developmental harm." };
  if (total <= 17) return { label: "Adequate Sedation", color: "emerald", action: "Target range achieved. Maintain current regimen; reassess Q4–8h." };
  if (total <= 23) return { label: "Under-sedated / Uncomfortable", color: "amber", action: "Consider dose increase or rescue bolus. Check pain, position, and environment first." };
  return { label: "Severely Under-sedated / Distressed", color: "red", action: "Immediate assessment needed. Administer rescue analgesia/sedation. Review and increase maintenance." };
}

const colorMap: Record<string, string> = {
  blue:    "text-blue-700 border-blue-200 bg-blue-50",
  emerald: "text-emerald-700 border-emerald-200 bg-emerald-50",
  amber:   "text-amber-700 border-amber-200 bg-amber-50",
  red:     "text-red-700 border-red-200 bg-red-50",
};
const badgeMap: Record<string, string> = {
  blue:    "bg-blue-100 text-blue-800",
  emerald: "bg-emerald-100 text-emerald-800",
  amber:   "bg-amber-100 text-amber-800",
  red:     "bg-red-100 text-red-800",
};

export default function ComfortScorePage() {
  const [selections, setSelections] = useState<Selection>({});

  const total = useMemo(() => Object.values(selections).reduce((a, b) => a + b, 0), [selections]);
  const allSelected = DOMAINS.every(d => selections[d.id] !== undefined);
  const result = allSelected ? classify(total) : null;

  function select(domainId: string, score: number) {
    setSelections(prev => ({ ...prev, [domainId]: score }));
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-700">
          <Moon className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">COMFORT-B Sedation Scale</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Validated ICU sedation-analgesia scoring tool for paediatric patients on mechanical ventilation.
          </p>
        </div>
      </div>

      <Alert className="rounded-2xl border-indigo-200 bg-indigo-50">
        <Info className="h-4 w-4 text-indigo-600" />
        <AlertDescription className="text-indigo-800 text-sm">
          <strong>COMFORT-B</strong> is the Behaviour subscale of the original COMFORT scale (6 items, score 6–30). It excludes physiological parameters (HR, MAP). Target score: <strong>11–17</strong>. Observe patient for 2 minutes before scoring.
        </AlertDescription>
      </Alert>

      {/* Score display */}
      {allSelected && result && (
        <Card className={cn("rounded-3xl border-2", colorMap[result.color])}>
          <CardContent className="pt-5 pb-5 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">COMFORT-B Score</p>
              <p className="text-5xl font-black">{total} <span className="text-xl font-semibold opacity-60">/ 30</span></p>
            </div>
            <div className="text-right">
              <Badge className={cn("font-black text-sm px-3 py-1 mb-2", badgeMap[result.color])}>{result.label}</Badge>
              <p className="text-sm opacity-70 max-w-xs">{result.action}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!allSelected && (
        <div className="rounded-2xl bg-muted/30 p-4 text-center text-muted-foreground text-sm font-semibold">
          Score: {total} / 30 — {DOMAINS.filter(d => selections[d.id] !== undefined).length} of 6 domains selected
        </div>
      )}

      {/* Domains */}
      <div className="space-y-6">
        {DOMAINS.map((domain, di) => (
          <Card key={domain.id} className="rounded-3xl border-2">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-black">{di + 1}. {domain.label}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">{domain.description}</p>
                </div>
                {selections[domain.id] !== undefined && (
                  <Badge className="bg-primary/10 text-primary font-black">{selections[domain.id]}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {domain.options.map(opt => (
                <button
                  key={opt.score}
                  onClick={() => select(domain.id, opt.score)}
                  className={cn(
                    "w-full text-left p-3 rounded-2xl border-2 text-sm transition-all flex items-start gap-3",
                    selections[domain.id] === opt.score
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-muted/20 border-transparent hover:border-primary/30"
                  )}
                >
                  <span className={cn("shrink-0 h-6 w-6 rounded-full flex items-center justify-center font-black text-xs border-2 mt-0.5",
                    selections[domain.id] === opt.score ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground border-muted"
                  )}>{opt.score}</span>
                  <span className="font-semibold leading-snug">{opt.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reference ranges */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Score Interpretation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-black">Score</th>
                  <th className="text-left py-2 font-black">Interpretation</th>
                  <th className="text-left py-2 pl-4 font-black">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y text-muted-foreground">
                {[
                  ["6–10", "Over-sedated", "Reduce sedation, consider daily interruption"],
                  ["11–17", "Target (adequate)", "Maintain; reassess Q4–8h"],
                  ["18–23", "Under-sedated", "Titrate up sedation/analgesia"],
                  ["24–30", "Severely distressed", "Urgent review and rescue dosing"],
                ].map(([score, interp, action]) => (
                  <tr key={score}>
                    <td className="py-2 font-semibold text-foreground">{score}</td>
                    <td className="py-2 font-bold">{interp}</td>
                    <td className="py-2 pl-4">{action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Alert className="rounded-2xl border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 text-sm">
          <strong>Assess pain separately</strong> before adjusting sedation — inadequate analgesia is the most common cause of agitation. Use FLACC or NRS pain score concurrently. COMFORT-B does not assess pain independently.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference: van Dijk M et al. <em>Pediatr Crit Care Med</em> 2005 · Ista E et al. <em>Crit Care Med</em> 2005 · PICU Sedation Guideline 2022
      </p>
    </div>
  );
}
