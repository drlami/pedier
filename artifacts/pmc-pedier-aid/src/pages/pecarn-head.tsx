import { useState } from "react";
import { Brain, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

// PECARN Head CT Algorithm (Kuppermann et al. Lancet 2009)
// Two separate algorithms: < 2 years and ≥ 2 years

const UNDER2_HIGH_RISK = [
  { id: "u2_alt_ms", label: "Altered mental status (GCS < 15, agitation, somnolence, repetitive questions, slow response)", risk: "high" },
  { id: "u2_palpable", label: "Palpable skull fracture", risk: "high" },
];

const UNDER2_INTERMEDIATE = [
  { id: "u2_occipital", label: "Occipital, parietal, or temporal scalp haematoma (not frontal)", risk: "intermediate" },
  { id: "u2_loc", label: "Loss of consciousness ≥ 5 seconds", risk: "intermediate" },
  { id: "u2_severity", label: "Severe mechanism (MVC without restraint, pedestrian/cyclist vs vehicle, fall > 3 ft, head struck by high-impact object)", risk: "intermediate" },
  { id: "u2_behaviour", label: "Not acting normally per parents", risk: "intermediate" },
];

const OVER2_HIGH_RISK = [
  { id: "o2_alt_ms", label: "Altered mental status (GCS < 15, agitation, somnolence, repetitive questions)", risk: "high" },
  { id: "o2_skull_signs", label: "Signs of basilar skull fracture (haemotympanum, Battle sign, raccoon eyes, CSF rhinorrhoea/otorrhoea)", risk: "high" },
];

const OVER2_INTERMEDIATE = [
  { id: "o2_loc", label: "Loss of consciousness", risk: "intermediate" },
  { id: "o2_vomiting", label: "History of vomiting", risk: "intermediate" },
  { id: "o2_severe_mech", label: "Severe mechanism (as above)", risk: "intermediate" },
  { id: "o2_headache", label: "Severe headache", risk: "intermediate" },
];

type Risk = "high" | "intermediate" | "none";

export default function PecarnHeadPage() {
  const [ageGroup, setAgeGroup] = useState<"under2" | "over2" | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function reset(group: "under2" | "over2") {
    setAgeGroup(group);
    setSelected([]);
  }

  const highRisk = selected.some(id => {
    const allHigh = [...UNDER2_HIGH_RISK, ...OVER2_HIGH_RISK];
    return allHigh.find(x => x.id === id)?.risk === "high";
  });

  const intermCount = selected.filter(id => {
    const allIntermed = [...UNDER2_INTERMEDIATE, ...OVER2_INTERMEDIATE];
    return allIntermed.find(x => x.id === id)?.risk === "intermediate";
  }).length;

  let recommendation: { label: string; color: string; text: string; ctIndication: string } | null = null;

  if (ageGroup) {
    if (highRisk) {
      recommendation = {
        label: "CT Recommended",
        color: "red",
        ctIndication: "High-risk feature present",
        text: "CT Head recommended. Risk of ciTBI (clinically-important traumatic brain injury) is substantially elevated. Do not delay.",
      };
    } else if (intermCount === 0) {
      recommendation = {
        label: "CT Not Indicated",
        color: "emerald",
        ctIndication: "Very-low risk (< 0.02% ciTBI)",
        text: "No high or intermediate risk features. Very-low risk of ciTBI. CT head not recommended. Discharge with head injury instructions and parent education.",
      };
    } else if (intermCount === 1) {
      recommendation = {
        label: "Observation / Shared Decision",
        color: "amber",
        ctIndication: "1 intermediate-risk feature",
        text: "One intermediate-risk feature present. Options: (1) CT head, or (2) observation for ≥ 4–6 hours — CT if clinical deterioration. Shared decision-making with parents. Consider patient age and physician experience.",
      };
    } else {
      recommendation = {
        label: "CT Recommended",
        color: "orange",
        ctIndication: "≥ 2 intermediate-risk features",
        text: "Two or more intermediate-risk features. CT head recommended. Risk of ciTBI is non-negligible.",
      };
    }
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

  const highItems = ageGroup === "under2" ? UNDER2_HIGH_RISK : ageGroup === "over2" ? OVER2_HIGH_RISK : [];
  const intermItems = ageGroup === "under2" ? UNDER2_INTERMEDIATE : ageGroup === "over2" ? OVER2_INTERMEDIATE : [];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-violet-100 text-violet-700">
          <Brain className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">PECARN Head Injury Rule</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Validated clinical decision rule to identify paediatric TBI patients at very-low risk who do not require CT head (Kuppermann 2009).
          </p>
        </div>
      </div>

      <Alert className="rounded-2xl border-violet-200 bg-violet-50">
        <Info className="h-4 w-4 text-violet-600" />
        <AlertDescription className="text-violet-800 text-sm">
          PECARN is validated for children with GCS ≥ 14 presenting within 24 hours of blunt head trauma. <strong>Do not apply</strong> if GCS ≤ 13, penetrating trauma, known brain tumour, or pre-existing neurological disorder that complicates assessment.
        </AlertDescription>
      </Alert>

      {/* Age group selection */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Age Group</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          {[
            { key: "under2", label: "< 2 years", description: "Includes infants and young toddlers" },
            { key: "over2", label: "≥ 2 years", description: "Older children and adolescents" },
          ].map(({ key, label, description }) => (
            <button
              key={key}
              onClick={() => reset(key as "under2" | "over2")}
              className={cn(
                "flex-1 p-4 rounded-2xl border-2 text-left transition-all",
                ageGroup === key ? "bg-primary/10 border-primary" : "bg-muted/20 border-transparent hover:border-primary/30"
              )}
            >
              <p className={cn("font-black text-xl", ageGroup === key ? "text-primary" : "")}>{label}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
            </button>
          ))}
        </CardContent>
      </Card>

      {ageGroup && (
        <>
          {/* High risk items */}
          <Card className="rounded-3xl border-2 border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-black text-red-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                High-Risk Features (CT recommended if any present)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {highItems.map(f => (
                <button
                  key={f.id}
                  onClick={() => toggle(f.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-2xl border-2 font-semibold text-sm transition-all",
                    selected.includes(f.id) ? "bg-red-50 border-red-300 text-red-800" : "bg-muted/20 border-transparent hover:border-red-200"
                  )}
                >
                  <span className="mr-2">{selected.includes(f.id) ? "✓" : "○"}</span>
                  {f.label}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Intermediate risk items */}
          <Card className="rounded-3xl border-2 border-amber-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-black text-amber-700">
                Intermediate-Risk Features
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">0 = very low risk | 1 = observation vs CT | ≥ 2 = CT recommended</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {intermItems.map(f => (
                <button
                  key={f.id}
                  onClick={() => toggle(f.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-2xl border-2 font-semibold text-sm transition-all",
                    selected.includes(f.id) ? "bg-amber-50 border-amber-300 text-amber-800" : "bg-muted/20 border-transparent hover:border-amber-200"
                  )}
                >
                  <span className="mr-2">{selected.includes(f.id) ? "✓" : "○"}</span>
                  {f.label}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Recommendation */}
          {recommendation && (
            <Card className={cn("rounded-3xl border-2", colorMap[recommendation.color])}>
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">PECARN Recommendation</p>
                    <p className="text-2xl font-black">{recommendation.label}</p>
                    <p className="text-sm opacity-70 mt-0.5">{recommendation.ctIndication}</p>
                  </div>
                  <Badge className={cn("font-black shrink-0", badgeMap[recommendation.color])}>
                    {ageGroup === "under2" ? "< 2 yr algorithm" : "≥ 2 yr algorithm"}
                  </Badge>
                </div>
                <p className="text-sm font-semibold opacity-80">{recommendation.text}</p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* ciTBI rates reference */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            PECARN ciTBI Risk Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-black">Risk Level</th>
                  <th className="text-center py-2 font-black">ciTBI Rate</th>
                  <th className="text-left py-2 pl-4 font-black">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y text-muted-foreground">
                {[
                  ["Very Low (no features)", "< 0.02%", "No CT — discharge with instructions"],
                  ["Intermediate (1 feature)", "~0.9–1%", "Observation 4–6h or CT (shared decision)"],
                  ["High (≥2 interm. OR any high-risk)", "> 4%", "CT head recommended"],
                ].map(([risk, rate, action]) => (
                  <tr key={risk}>
                    <td className="py-2 font-semibold text-foreground">{risk}</td>
                    <td className="text-center py-2 font-bold">{rate}</td>
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
          <strong>ciTBI definition:</strong> Death, neurosurgical intervention, intubation for head injury &gt; 24h, or hospital admission ≥ 2 nights for ongoing TBI management. PECARN does NOT rule out any intracranial injury — only those requiring intervention.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference: Kuppermann N et al. <em>Lancet</em> 2009;374:1160–70 · PECARN TBI Study Group · AAP Head Injury Guideline 2019
      </p>
    </div>
  );
}
