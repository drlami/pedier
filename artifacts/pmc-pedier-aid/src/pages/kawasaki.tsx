import { useState, useMemo } from "react";
import { Heart, AlertTriangle, Info, ShieldAlert, GitCompare, Siren, Syringe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const PRINCIPAL_FEATURES = [
  {
    key: "conjunctivitis",
    label: "Bilateral Non-purulent Conjunctival Injection",
    description: "Bulbar conjunctivae — without exudate, without limbic sparing",
  },
  {
    key: "oral",
    label: "Oral / Lip Changes",
    description: "Strawberry tongue, lip erythema/cracking, pharyngeal hyperaemia",
  },
  {
    key: "rash",
    label: "Polymorphous Erythematous Rash",
    description: "Maculopapular, urticarial, or erythroderma — not vesicular or bullous",
  },
  {
    key: "extremities",
    label: "Extremity Changes",
    description: "Acute phase: erythema + indurative oedema of hands/feet. Subacute: periungual desquamation",
  },
  {
    key: "lymphadenopathy",
    label: "Cervical Lymphadenopathy ≥ 1.5 cm",
    description: "Usually unilateral, non-fluctuant, firm cervical node — often painful",
  },
];

const INCOMPLETE_LABS = [
  { key: "crp_esr", label: "CRP ≥ 3.0 mg/dL OR ESR ≥ 40 mm/hr" },
  { key: "anaemia", label: "Anaemia for age" },
  { key: "platelets", label: "Platelets ≥ 450,000 after day 7 (thrombocytosis)" },
  { key: "alb", label: "Albumin ≤ 3.0 g/dL" },
  { key: "alt", label: "Elevated ALT / transaminases" },
  { key: "leukocytes", label: "WBC ≥ 15,000 cells/mm³" },
  { key: "urine", label: "Urine ≥ 10 WBC per high-power field" },
];

const ECHO_FINDINGS = [
  { key: "lad_z", label: "Left anterior descending artery Z-score ≥ 2.5" },
  { key: "rca_z", label: "Right coronary artery Z-score ≥ 2.5" },
  { key: "perikardial", label: "Pericardial effusion" },
  { key: "mitralis", label: "Mitral regurgitation" },
];

// CDC/WHO MIS-C case definition requires ≥2 organ systems. Mucocutaneous involvement
// (rash/conjunctivitis/oral/extremity/nodes) is derived from the Principal Features
// section above rather than re-entered here.
const MISC_ORGAN_SYSTEMS = [
  { key: "cardiac", label: "Cardiovascular", description: "Myocarditis, pericarditis, reduced EF, coronary dilation, arrhythmia, or shock" },
  { key: "gi", label: "Gastrointestinal", description: "Severe abdominal pain, vomiting, or diarrhea — often the presenting complaint in MIS-C" },
  { key: "renal", label: "Renal", description: "Acute kidney injury" },
  { key: "hematologic", label: "Hematologic / Coagulation", description: "Coagulopathy or marked thrombocytopenia" },
  { key: "respiratory", label: "Respiratory", description: "Hypoxia, pneumonitis, or ARDS" },
  { key: "neuro", label: "Neurological", description: "Headache, encephalopathy, or aseptic meningitis" },
];

// These skew markedly differently between the two conditions and are the most useful
// bedside differentiators alongside age and the epidemiologic link.
const MISC_LABS = [
  { key: "lymphopenia", label: "Lymphopenia (< 1,000/mm³)" },
  { key: "ferritin", label: "Markedly elevated ferritin" },
  { key: "ddimer", label: "Markedly elevated D-dimer" },
  { key: "bnp", label: "Elevated BNP / NT-proBNP" },
  { key: "troponin", label: "Elevated troponin" },
  { key: "thrombocytopenia", label: "Thrombocytopenia (low platelets, early) — contrast with KD's later thrombocytosis" },
];

export default function KawasakiPage() {
  const [fever, setFever] = useState<boolean | null>(null);
  const [feverDays, setFeverDays] = useState<number | null>(null);
  const [features, setFeatures] = useState<Record<string, boolean>>({});
  const [labs, setLabs] = useState<Record<string, boolean>>({});
  const [echo, setEcho] = useState<Record<string, boolean>>({});

  const [ageYears, setAgeYears] = useState<string>("");
  const [covidLink, setCovidLink] = useState<boolean | null>(null);
  const [shockPresent, setShockPresent] = useState(false);
  const [miscOrgans, setMiscOrgans] = useState<Record<string, boolean>>({});
  const [miscLabs, setMiscLabs] = useState<Record<string, boolean>>({});

  const featureCount = PRINCIPAL_FEATURES.filter(f => features[f.key]).length;
  const labCount = INCOMPLETE_LABS.filter(l => labs[l.key]).length;
  const echoPositive = ECHO_FINDINGS.some(e => echo[e.key]);

  const ageNum = parseFloat(ageYears);
  const miscOrganCount = MISC_ORGAN_SYSTEMS.filter(o => miscOrgans[o.key]).length;
  const miscLabCount = MISC_LABS.filter(l => miscLabs[l.key]).length;
  // Mucocutaneous is one organ system for MIS-C purposes — any principal KD feature satisfies it.
  const totalOrganSystems = miscOrganCount + (featureCount >= 1 ? 1 : 0);

  const meetsMiscCriteria = useMemo(() => {
    if (!fever || covidLink !== true || isNaN(ageNum)) return false;
    const days = feverDays ?? 0;
    const hasInflammationEvidence = labCount >= 1 || miscLabCount >= 1;
    return ageNum < 21 && days >= 1 && hasInflammationEvidence && totalOrganSystems >= 2;
  }, [fever, covidLink, ageNum, feverDays, labCount, miscLabCount, totalOrganSystems]);

  const diagnosis = useMemo(() => {
    if (!fever) return null;
    const days = feverDays ?? 0;

    // Classic KD: fever ≥5 days + ≥4 features (or ≥3 + positive echo)
    if (days >= 5 && featureCount >= 4) {
      return {
        label: "Classic Kawasaki Disease",
        confidence: "high",
        color: "red",
        treat: true,
        summary: "Meets classic diagnostic criteria — 4 or more principal features with fever ≥ 5 days.",
      };
    }
    if (days >= 5 && featureCount === 3 && echoPositive) {
      return {
        label: "Classic Kawasaki Disease (Echo-confirmed)",
        confidence: "high",
        color: "red",
        treat: true,
        summary: "3 principal features + coronary abnormality on echo — equivalent to classic criteria.",
      };
    }

    // Incomplete KD: fever ≥5 days + 2–3 features + supportive labs or echo
    if (days >= 5 && featureCount >= 2 && featureCount <= 3 && (labCount >= 3 || echoPositive)) {
      return {
        label: "Incomplete Kawasaki Disease",
        confidence: "moderate",
        color: "orange",
        treat: true,
        summary: "2–3 principal features with supportive laboratory findings or coronary changes — treat as KD.",
      };
    }

    // Possible incomplete — warrant further workup
    if (days >= 5 && featureCount >= 2) {
      return {
        label: "Possible Incomplete KD — Further Workup Needed",
        confidence: "low",
        color: "amber",
        treat: false,
        summary: "2–3 features but insufficient lab/echo data. Obtain CRP/ESR, CBC, LFTs, UA, echocardiogram.",
      };
    }

    // Fever < 5 days or < 2 features — KD unlikely but flag for follow-up
    if (days >= 1 && featureCount >= 2) {
      return {
        label: "Monitor — Fever Duration Criteria Not Yet Met",
        confidence: "low",
        color: "amber",
        treat: false,
        summary: "Fever duration < 5 days. Re-evaluate daily — if features persist at day 5, initiate KD workup.",
      };
    }

    return {
      label: "Kawasaki Disease Unlikely",
      confidence: "low",
      color: "emerald",
      treat: false,
      summary: `${featureCount} principal feature${featureCount !== 1 ? "s" : ""} present. Consider alternative diagnoses.`,
    };
  }, [fever, feverDays, featureCount, labCount, echoPositive]);

  const miscAssessment = useMemo(() => {
    if (!fever) return null;
    if (covidLink === null || ageYears === "" || isNaN(ageNum)) {
      return {
        label: "MIS-C Screening Incomplete",
        confidence: "low",
        color: "amber",
        treat: false,
        summary: "Enter age and SARS-CoV-2 exposure/infection status below to screen against the CDC/WHO MIS-C case definition.",
      };
    }
    if (meetsMiscCriteria) {
      return {
        label: "Meets MIS-C Case Definition",
        confidence: "high",
        color: "purple",
        treat: true,
        summary: `${totalOrganSystems} organ system(s) involved, laboratory evidence of inflammation present, and a qualifying SARS-CoV-2 link — assuming no alternative diagnosis explains the picture.`,
      };
    }
    if (!covidLink) {
      return {
        label: "MIS-C Case Definition Not Met — No SARS-CoV-2 Link",
        confidence: "high",
        color: "emerald",
        treat: false,
        summary: "The CDC/WHO case definition requires current or recent (≈4 week) SARS-CoV-2 infection or exposure. Without it, this is not MIS-C — proceed with the Kawasaki assessment above and consider other hyperinflammatory or infectious causes.",
      };
    }
    if (ageNum >= 21) {
      return {
        label: "MIS-C Case Definition Not Met — Age Out of Range",
        confidence: "high",
        color: "emerald",
        treat: false,
        summary: "MIS-C case definitions apply to patients < 21 years old.",
      };
    }
    return {
      label: "MIS-C Case Definition Not Met",
      confidence: "moderate",
      color: "emerald",
      treat: false,
      summary: `Only ${totalOrganSystems} organ system(s) documented (≥ 2 required) or no laboratory evidence of inflammation entered yet — reassess as findings evolve.`,
    };
  }, [fever, covidLink, ageYears, ageNum, meetsMiscCriteria, totalOrganSystems]);

  const overlapPresentation = !!diagnosis?.treat && !!miscAssessment?.treat;

  const colorMap: Record<string, string> = {
    emerald: "text-emerald-700 border-emerald-200 bg-emerald-50",
    amber:   "text-amber-700 border-amber-200 bg-amber-50",
    orange:  "text-orange-700 border-orange-200 bg-orange-50",
    red:     "text-red-700 border-red-200 bg-red-50",
    purple:  "text-purple-700 border-purple-200 bg-purple-50",
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-pink-100 text-pink-700">
          <Heart className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Kawasaki Disease Criteria</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Classic and incomplete KD diagnostic criteria with coronary artery risk assessment.
          </p>
        </div>
      </div>

      {/* Fever */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Fever Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">High fever (≥ 38.5°C) is the cardinal feature of Kawasaki disease and is required for diagnosis.</p>
          <div className="flex gap-3">
            {[
              { val: true, label: "Fever Present" },
              { val: false, label: "No Fever" },
            ].map(({ val, label }) => (
              <button
                key={String(val)}
                onClick={() => setFever(val)}
                className={cn(
                  "flex-1 py-3 rounded-2xl font-black text-sm border-2 transition-all",
                  fever === val
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-muted/30 text-muted-foreground border-transparent hover:border-primary/30"
                )}
              >
                {label}
              </button>
            ))}
          </div>
          {fever && (
            <div>
              <p className="text-sm font-bold mb-2">Duration of fever:</p>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(d => (
                  <button
                    key={d}
                    onClick={() => setFeverDays(d)}
                    className={cn(
                      "w-12 h-10 rounded-xl font-black text-sm border-2 transition-all",
                      feverDays === d
                        ? "bg-primary text-white border-primary shadow-md"
                        : "bg-muted/30 text-muted-foreground border-transparent hover:border-primary/30"
                    )}
                  >
                    {d}{d === 10 ? "+" : ""}d
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Principal features */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-black">Principal Clinical Features</CardTitle>
            <Badge variant="secondary" className="font-black text-base px-3">
              {featureCount} / 5
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">Classic KD requires ≥ 4 features (or ≥ 3 with echo evidence)</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {PRINCIPAL_FEATURES.map(f => (
            <button
              key={f.key}
              onClick={() => setFeatures(s => ({ ...s, [f.key]: !s[f.key] }))}
              className={cn(
                "w-full text-left p-4 rounded-2xl border-2 transition-all",
                features[f.key]
                  ? "bg-pink-50 border-pink-400 shadow-sm"
                  : "bg-muted/20 border-transparent hover:border-muted-foreground/20"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "mt-0.5 h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0",
                  features[f.key] ? "bg-pink-500 border-pink-500" : "border-muted-foreground/30"
                )}>
                  {features[f.key] && <div className="h-2.5 w-2.5 rounded-sm bg-white" />}
                </div>
                <div>
                  <p className={cn("font-bold text-sm", features[f.key] && "text-pink-700")}>{f.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.description}</p>
                </div>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Lab findings for incomplete */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-black">Supportive Laboratory Findings</CardTitle>
            <Badge variant="secondary" className="font-bold text-sm px-2">
              {labCount} / {INCOMPLETE_LABS.length}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">Used to support incomplete KD diagnosis when &lt; 4 principal features present</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {INCOMPLETE_LABS.map(l => (
            <button
              key={l.key}
              onClick={() => setLabs(s => ({ ...s, [l.key]: !s[l.key] }))}
              className={cn(
                "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
                labs[l.key]
                  ? "bg-orange-50 border-orange-300"
                  : "bg-muted/10 border-muted/30 hover:border-muted-foreground/20"
              )}
            >
              <div className={cn(
                "h-4 w-4 rounded border-2 flex items-center justify-center shrink-0",
                labs[l.key] ? "bg-orange-500 border-orange-500" : "border-muted-foreground/30"
              )}>
                {labs[l.key] && <div className="h-2 w-2 rounded-sm bg-white" />}
              </div>
              <span className="text-sm font-medium">{l.label}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Echo findings */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black flex items-center gap-2">
            Echocardiogram Findings
            {echoPositive && <Badge className="bg-red-100 text-red-700 font-black">Positive</Badge>}
          </CardTitle>
          <p className="text-xs text-muted-foreground">Coronary abnormalities or pericardial involvement</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {ECHO_FINDINGS.map(e => (
            <button
              key={e.key}
              onClick={() => setEcho(s => ({ ...s, [e.key]: !s[e.key] }))}
              className={cn(
                "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
                echo[e.key]
                  ? "bg-red-50 border-red-300"
                  : "bg-muted/10 border-muted/30 hover:border-muted-foreground/20"
              )}
            >
              <div className={cn(
                "h-4 w-4 rounded border-2 flex items-center justify-center shrink-0",
                echo[e.key] ? "bg-red-500 border-red-500" : "border-muted-foreground/30"
              )}>
                {echo[e.key] && <div className="h-2 w-2 rounded-sm bg-white" />}
              </div>
              <span className="text-sm font-medium">{e.label}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* MIS-C Screening */}
      <Card className="rounded-3xl border-2 border-purple-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black flex items-center gap-2 text-purple-800">
            <GitCompare className="h-5 w-5" /> MIS-C Screening
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            KD and MIS-C overlap heavily (fever, rash, conjunctivitis, mucosal changes) — this section screens the same case
            against the CDC/WHO MIS-C case definition so both are assessed side by side.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-bold mb-2">Age (years)</p>
              <input
                type="number"
                min={0}
                step={0.5}
                value={ageYears}
                onChange={(e) => setAgeYears(e.target.value)}
                placeholder="e.g. 9"
                className="w-full h-10 rounded-xl border-2 border-muted/30 px-3 text-sm font-bold bg-muted/10 focus:border-purple-300 focus:outline-none"
              />
              <p className="text-[11px] text-muted-foreground mt-1">KD: typically &lt; 5y. MIS-C: median ≈ 8–9y, up to 20y.</p>
            </div>
            <div>
              <p className="text-sm font-bold mb-2">Recent/current SARS-CoV-2 link</p>
              <div className="flex gap-2">
                {[
                  { val: true, label: "Yes" },
                  { val: false, label: "No" },
                ].map(({ val, label }) => (
                  <button
                    key={String(val)}
                    onClick={() => setCovidLink(val)}
                    className={cn(
                      "flex-1 h-10 rounded-xl font-black text-sm border-2 transition-all",
                      covidLink === val
                        ? "bg-purple-600 text-white border-purple-600 shadow-md"
                        : "bg-muted/10 text-muted-foreground border-transparent hover:border-purple-300"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Positive test, or close contact/community exposure within ~4 weeks — required by the case definition.</p>
            </div>
          </div>

          <button
            onClick={() => setShockPresent(s => !s)}
            className={cn(
              "w-full text-left p-3 rounded-xl border-2 transition-all flex items-center gap-3",
              shockPresent ? "bg-red-50 border-red-300" : "bg-muted/10 border-muted/30 hover:border-muted-foreground/20"
            )}
          >
            <Siren className={cn("h-4 w-4 shrink-0", shockPresent ? "text-red-600" : "text-muted-foreground/50")} />
            <span className="text-sm font-medium">Shock / hypotension requiring fluid bolus or vasopressor</span>
            <span className="ml-auto text-[10px] font-black uppercase text-muted-foreground/60">~50% MIS-C · ~5% KD</span>
          </button>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold">Organ Systems Involved</p>
              <Badge variant="secondary" className="font-bold text-sm px-2">{totalOrganSystems} / 7</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mb-2">Mucocutaneous counts automatically if any Principal Feature above is checked ({featureCount >= 1 ? "✓ satisfied" : "not yet satisfied"}). ≥ 2 total required for MIS-C.</p>
            <div className="space-y-2">
              {MISC_ORGAN_SYSTEMS.map(o => (
                <button
                  key={o.key}
                  onClick={() => setMiscOrgans(s => ({ ...s, [o.key]: !s[o.key] }))}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3",
                    miscOrgans[o.key] ? "bg-purple-50 border-purple-300" : "bg-muted/10 border-muted/30 hover:border-muted-foreground/20"
                  )}
                >
                  <div className={cn(
                    "mt-0.5 h-4 w-4 rounded border-2 flex items-center justify-center shrink-0",
                    miscOrgans[o.key] ? "bg-purple-500 border-purple-500" : "border-muted-foreground/30"
                  )}>
                    {miscOrgans[o.key] && <div className="h-2 w-2 rounded-sm bg-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{o.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{o.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold">MIS-C-Suggestive Labs</p>
              <Badge variant="secondary" className="font-bold text-sm px-2">{miscLabCount} / {MISC_LABS.length}</Badge>
            </div>
            <div className="space-y-2">
              {MISC_LABS.map(l => (
                <button
                  key={l.key}
                  onClick={() => setMiscLabs(s => ({ ...s, [l.key]: !s[l.key] }))}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
                    miscLabs[l.key] ? "bg-purple-50 border-purple-300" : "bg-muted/10 border-muted/30 hover:border-muted-foreground/20"
                  )}
                >
                  <div className={cn(
                    "h-4 w-4 rounded border-2 flex items-center justify-center shrink-0",
                    miscLabs[l.key] ? "bg-purple-500 border-purple-500" : "border-muted-foreground/30"
                  )}>
                    {miscLabs[l.key] && <div className="h-2 w-2 rounded-sm bg-white" />}
                  </div>
                  <span className="text-sm font-medium">{l.label}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kawasaki vs MIS-C differentiator — always visible reference */}
      <Card className="rounded-3xl border-2 bg-slate-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black flex items-center gap-2">
            <GitCompare className="h-4 w-4" /> Kawasaki Disease vs MIS-C — Key Differentiators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-2 pr-3 font-black uppercase tracking-wide text-muted-foreground">Feature</th>
                  <th className="text-left py-2 px-3 font-black uppercase tracking-wide text-pink-700">Kawasaki Disease</th>
                  <th className="text-left py-2 pl-3 font-black uppercase tracking-wide text-purple-700">MIS-C</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["Typical age", "< 5 years (peak 6mo–2y); rare > 8–9y", "Median ≈ 8–9y; range up to 20y"],
                  ["Epidemiologic link", "None required", "Current/recent SARS-CoV-2 infection or exposure (≈4 wks) — required"],
                  ["Fever duration for diagnosis", "≥ 5 days", "≥ 24 hours (no fixed minimum)"],
                  ["GI symptoms", "Present in ~30%, usually mild", "Prominent in 60–90% — often the presenting complaint"],
                  ["Shock / hypotension", "Uncommon (~5%, \"KD shock syndrome\")", "Common (~50–60%)"],
                  ["Platelet trend", "Thrombocytosis, typically after day 7", "Thrombocytopenia, especially early"],
                  ["Lymphocytes", "Usually normal or mildly reduced", "Marked lymphopenia typical"],
                  ["Ferritin / D-dimer / BNP", "Usually only mildly elevated", "Markedly elevated"],
                  ["Coronary involvement", "Can occur early (even before treatment)", "Usually later in the course, may still be severe"],
                  ["Myocardial dysfunction", "Uncommon", "Common — a major driver of severity"],
                ].map(([feature, kd, misc], i) => (
                  <tr key={i}>
                    <td className="py-2 pr-3 font-bold text-slate-700 align-top">{feature}</td>
                    <td className="py-2 px-3 text-slate-600 align-top">{kd}</td>
                    <td className="py-2 pl-3 text-slate-600 align-top">{misc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">
            The two are not mutually exclusive on clinical grounds alone — some children meet criteria for both. Age, the
            SARS-CoV-2 link, GI symptoms, shock, and the platelet/lymphocyte trend are the most useful bedside clues.
          </p>
        </CardContent>
      </Card>

      {/* Overlap alert */}
      {overlapPresentation && (
        <Alert className="rounded-2xl border-2 border-purple-300 bg-purple-50">
          <Siren className="h-4 w-4 text-purple-700" />
          <AlertDescription className="text-purple-900 text-sm">
            <strong>Overlapping presentation:</strong> this case meets criteria for both Kawasaki Disease and MIS-C. Clinical
            distinction may not be reliably possible — involve cardiology, rheumatology, and infectious disease early, manage
            as the higher-acuity condition (MIS-C) with PICU-level monitoring, and treat with the combined protocol below
            (IVIG + corticosteroids), not KD-only high-dose aspirin.
          </AlertDescription>
        </Alert>
      )}

      {/* Diagnosis */}
      {diagnosis && (
        <Card className={cn("rounded-3xl border-2", colorMap[diagnosis.color])}>
          <CardContent className="pt-6 pb-6">
            <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">Assessment</p>
            <p className="text-2xl font-black mb-2">{diagnosis.label}</p>
            <p className="text-sm opacity-80 mb-5">{diagnosis.summary}</p>

            {diagnosis.treat && (
              <>
                <Separator className="mb-4 opacity-30" />
                <p className="font-black text-sm uppercase tracking-widest mb-3">Treatment (AHA / AAP Protocol)</p>
                <div className="space-y-1.5 text-sm">
                  {[
                    "IVIG: 2 g/kg IV as a single infusion over 10–12 hours — within first 10 days of fever (ideally days 5–9)",
                    "Aspirin: 80–100 mg/kg/day divided q6h (high-dose anti-inflammatory) — until afebrile ≥ 48 hours",
                    "Then aspirin 3–5 mg/kg/day (low-dose antiplatelet) × 6–8 weeks if no coronary changes",
                    "If coronary Z-score ≥ 2.5: continue antiplatelet therapy long-term — cardiology follow-up",
                    "Echocardiogram at diagnosis, 2 weeks, and 6 weeks post-treatment",
                    "IVIG-resistant KD (fever persisting ≥ 36h after IVIG): second IVIG dose OR infliximab OR corticosteroids",
                  ].map((m, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="mt-0.5 shrink-0 opacity-50">•</span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* MIS-C Assessment */}
      {miscAssessment && (
        <Card className={cn("rounded-3xl border-2", colorMap[miscAssessment.color])}>
          <CardContent className="pt-6 pb-6">
            <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">MIS-C Assessment</p>
            <p className="text-2xl font-black mb-2">{miscAssessment.label}</p>
            <p className="text-sm opacity-80 mb-5">{miscAssessment.summary}</p>

            {miscAssessment.treat && (
              <>
                <Separator className="mb-4 opacity-30" />
                <p className="font-black text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Syringe className="h-4 w-4" /> Treatment (ACR / AHA MIS-C Guidance)
                </p>
                <div className="space-y-1.5 text-sm">
                  {[
                    "IVIG: 2 g/kg IV as a single infusion (same dose as KD) — plus corticosteroids from the outset in most cases, not reserved for refractory disease as in KD",
                    "Corticosteroids: low-to-moderate dose (e.g. methylprednisolone 1–2 mg/kg/day) started concurrently with IVIG; pulse-dose IV methylprednisolone (10–30 mg/kg/day, max 1g, × 1–3 days) if in shock or critically ill",
                    "Aspirin: LOW-dose only, 3–5 mg/kg/day (max 81 mg/day) for thromboprophylaxis — do NOT use KD's high-dose anti-inflammatory regimen given the higher bleeding/thrombocytopenia risk in MIS-C",
                    "Escalate to therapeutic anticoagulation (e.g. enoxaparin) if EF < 35%, documented thrombosis, or giant coronary aneurysm (Z ≥ 10)",
                    "Refractory to IVIG + steroids: consider anakinra (IL-1 blockade) or infliximab",
                    "Low threshold for PICU admission — shock and myocardial dysfunction are common; use inotropes/vasopressors early and avoid aggressive fluid boluses if cardiac dysfunction is present",
                    "Multidisciplinary input: cardiology, rheumatology, and infectious disease",
                    "Echocardiogram at diagnosis, 1–2 weeks, and 4–6 weeks post-treatment",
                  ].map((m, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="mt-0.5 shrink-0 opacity-50">•</span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {shockPresent && (
        <Alert className="rounded-2xl border-2 border-red-300 bg-red-50">
          <Siren className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 text-sm">
            <strong>Shock/hypotension flagged:</strong> this is uncommon in classic KD (~5%, "KD shock syndrome") but common in
            MIS-C (~50–60%). Its presence should raise suspicion for MIS-C or KD shock syndrome — ensure PICU-level monitoring
            regardless of which diagnosis is favored, and involve cardiology early given the risk of myocardial dysfunction.
          </AlertDescription>
        </Alert>
      )}

      <Alert className="rounded-2xl border-pink-200 bg-pink-50">
        <ShieldAlert className="h-4 w-4 text-pink-600" />
        <AlertDescription className="text-pink-800 text-sm">
          <strong>Coronary risk:</strong> Without treatment, 15–25% of children develop coronary artery aneurysms. With timely IVIG + aspirin, this falls to &lt;5%. Giant aneurysms (Z-score &gt;10 or diameter &gt;8 mm) carry highest risk of myocardial infarction.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        References: McCrindle BW et al. AHA Scientific Statement (Kawasaki Disease). <em>Circulation</em> 2017;135:e927–e999 ·
        Henderson LA et al. ACR Clinical Guidance for MIS-C. <em>Arthritis Rheumatol</em> 2022;74(4):e1–e20 ·
        CDC/WHO MIS-C case definitions
      </p>
    </div>
  );
}
