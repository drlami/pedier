import { useMemo, useState } from "react";
import { Dna, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

/**
 * Minor-anomaly counting rule: Leppig KA, Werler MM, Cann CI, Cook CA, Holmes LB.
 * "Predictive value of minor anomalies. I. Association with major malformations."
 * J Pediatr. 1987;110(4):531-537. Newborns with 0/1/2/≥3 minor anomalies carried a
 * ~1% / 3% / 10% / 20% risk of an associated major malformation (general-population
 * baseline major-anomaly rate ~2-3%). Underlying construct from Marden PM, Smith DW,
 * McDonald MJ. J Pediatr. 1964;64:357-371.
 *
 * First-tier testing: Miller DT, et al. "Consensus statement: chromosomal microarray
 * is a first-tier clinical diagnostic test for individuals with developmental
 * disabilities or congenital anomalies." Am J Hum Genet. 2010;86(5):749-764.
 * Referral triggers for DD/ID/ASD: Moeschler JB, Shevell M; AAP Council on Genetics.
 * "Comprehensive evaluation of the child with intellectual disability or global
 * developmental delay." Pediatrics. 2014;134(3):e903-918.
 */

interface AnomalyItem {
  id: string;
  label: string;
}

const MAJOR_ANOMALIES: { group: string; items: AnomalyItem[] }[] = [
  {
    group: "Cardiac / Thoracic",
    items: [
      { id: "chd", label: "Congenital heart defect" },
      { id: "cdh", label: "Congenital diaphragmatic hernia" },
    ],
  },
  {
    group: "Craniofacial / CNS",
    items: [
      { id: "cleft", label: "Cleft lip and/or palate" },
      { id: "microcephaly", label: "Microcephaly or macrocephaly (structural)" },
      { id: "ntd", label: "Neural tube defect (spina bifida, encephalocele, anencephaly)" },
      { id: "holoprosencephaly", label: "Holoprosencephaly or major brain malformation" },
    ],
  },
  {
    group: "Abdominal / GU / GI",
    items: [
      { id: "omphalocele", label: "Omphalocele or gastroschisis" },
      { id: "imperforate-anus", label: "Imperforate anus / anorectal malformation" },
      { id: "renal-agenesis", label: "Renal agenesis or major renal dysplasia" },
      { id: "ambiguous-genitalia", label: "Ambiguous genitalia / disorder of sex development" },
      { id: "esophageal-atresia", label: "Esophageal atresia / tracheoesophageal fistula" },
    ],
  },
  {
    group: "Limb / Skeletal",
    items: [
      { id: "limb-reduction", label: "Limb reduction defect" },
      { id: "skeletal-dysplasia", label: "Skeletal dysplasia (disproportionate short stature)" },
    ],
  },
];

const MINOR_ANOMALIES: { group: string; items: AnomalyItem[] }[] = [
  {
    group: "Craniofacial",
    items: [
      { id: "epicanthal-folds", label: "Epicanthal folds" },
      { id: "hypertelorism", label: "Hyper- or hypotelorism" },
      { id: "palpebral-slant", label: "Up- or downslanting palpebral fissures" },
      { id: "low-set-ears", label: "Low-set or posteriorly rotated ears" },
      { id: "preauricular", label: "Preauricular pits or skin tags" },
      { id: "flat-nasal-bridge", label: "Flat or broad nasal bridge" },
      { id: "micrognathia", label: "Micrognathia or retrognathia" },
      { id: "long-philtrum", label: "Long or smooth philtrum" },
      { id: "thin-upper-lip", label: "Thin upper lip vermilion" },
      { id: "high-arched-palate", label: "High-arched palate" },
    ],
  },
  {
    group: "Hands / Feet",
    items: [
      { id: "simian-crease", label: "Single (simian) palmar crease" },
      { id: "clinodactyly", label: "Clinodactyly of the 5th finger" },
      { id: "syndactyly", label: "Cutaneous syndactyly (partial, e.g. 2nd-3rd toes)" },
      { id: "sandal-gap", label: "Wide gap between 1st and 2nd toes (sandal gap)" },
      { id: "postaxial-tag", label: "Postaxial polydactyly skin tag / rudiment" },
    ],
  },
  {
    group: "Skin / Other",
    items: [
      { id: "single-umbilical-artery", label: "Single umbilical artery" },
      { id: "sacral-dimple", label: "Sacral dimple or hair tuft (simple, low)" },
      { id: "cafe-au-lait", label: "Café-au-lait macules (fewer than 6)" },
      { id: "supernumerary-nipple", label: "Supernumerary nipple" },
      { id: "redundant-neck-skin", label: "Redundant nuchal skin / webbed neck" },
    ],
  },
];

const CONTEXT_FLAGS: AnomalyItem[] = [
  { id: "dd-id", label: "Developmental delay or intellectual disability" },
  { id: "asd", label: "Autism spectrum disorder" },
  { id: "growth-abnormality", label: "Growth abnormality (pre/postnatal restriction or overgrowth)" },
  { id: "family-history", label: "Family history of similar anomalies, recurrent pregnancy loss, or consanguinity" },
  { id: "recognizable-pattern", label: "Examiner recognises a specific syndromic gestalt (e.g. suspected trisomy 21, 22q11, Noonan)" },
];

type RiskTier = "routine" | "increased" | "high";

interface Result {
  tier: RiskTier;
  label: string;
  estimatedRisk: string;
  action: string;
  testing: string;
}

function computeResult(majorCount: number, minorCount: number, flags: string[]): Result {
  const hasRecognizablePattern = flags.includes("recognizable-pattern");
  const hasDDorASD = flags.includes("dd-id") || flags.includes("asd");
  const hasGrowth = flags.includes("growth-abnormality");
  const hasFamilyHistory = flags.includes("family-history");

  if (hasRecognizablePattern) {
    return {
      tier: "high",
      label: "High Risk — Suspected Recognizable Syndrome",
      estimatedRisk: "Gestalt recognition by an experienced examiner is itself a strong predictor.",
      action: "Refer to clinical genetics urgently. Photograph dysmorphic features (with consent) for the geneticist.",
      testing: "Targeted testing guided by the suspected pattern (e.g. karyotype/FISH for trisomy 21, 22q11 FISH or microarray for DiGeorge features) in addition to first-tier CMA if the pattern is not confirmed clinically.",
    };
  }

  if (majorCount >= 2) {
    return {
      tier: "high",
      label: "High Risk — Multiple Major Anomalies",
      estimatedRisk: "≥ 2 major anomalies strongly suggest an underlying syndromic or chromosomal cause.",
      action: "Refer to clinical genetics urgently.",
      testing: "Chromosomal microarray (CMA) as first-tier test. Add karyotype if features suggest a specific aneuploidy or a parent carries a balanced rearrangement.",
    };
  }

  if (majorCount >= 1 && minorCount >= 1) {
    return {
      tier: "high",
      label: "High Risk — Major + Minor Anomaly Combination",
      estimatedRisk: "A major anomaly plus dysmorphic (minor) features raises concern beyond an isolated defect.",
      action: "Refer to clinical genetics.",
      testing: "Chromosomal microarray (CMA) as first-tier test.",
    };
  }

  if (hasDDorASD || hasGrowth || hasFamilyHistory) {
    return {
      tier: "high",
      label: "High Risk — Contextual Red Flag Present",
      estimatedRisk: "Developmental delay/ASD, growth abnormality, or a suggestive family history each independently justify genetic evaluation, regardless of anomaly count.",
      action: "Refer to clinical genetics.",
      testing: "Chromosomal microarray (CMA) as first-tier test for unexplained DD/ID/ASD or congenital anomalies (ACMG 2010). Consider fragile X testing if intellectual disability with autistic features or relevant family history.",
    };
  }

  if (majorCount === 1) {
    return {
      tier: "increased",
      label: "Increased Risk — Isolated Major Anomaly",
      estimatedRisk: "An isolated major anomaly still carries a meaningful chance of an underlying syndrome, though lower than when combined with other findings.",
      action: "Consider referral to clinical genetics, especially if any additional feature emerges on follow-up.",
      testing: "Discuss CMA with clinical genetics; decision often depends on the specific anomaly.",
    };
  }

  if (minorCount >= 3) {
    return {
      tier: "high",
      label: "High Risk — ≥ 3 Minor Anomalies",
      estimatedRisk: "≈ 20% risk of an associated major malformation (Leppig 1987), a ~20-fold increase over the general-population baseline.",
      action: "Refer to clinical genetics for full dysmorphology assessment and search for an occult major anomaly (renal/cardiac ultrasound if not already done).",
      testing: "Chromosomal microarray (CMA) as first-tier test.",
    };
  }

  if (minorCount === 2) {
    return {
      tier: "increased",
      label: "Increased Risk — 2 Minor Anomalies",
      estimatedRisk: "≈ 10% risk of an associated major malformation (Leppig 1987).",
      action: "Consider referral to clinical genetics; actively look for an occult major anomaly (e.g. renal ultrasound, echocardiogram).",
      testing: "Discuss CMA with clinical genetics if any additional concern arises.",
    };
  }

  if (minorCount === 1) {
    return {
      tier: "routine",
      label: "Low Risk — 1 Minor Anomaly",
      estimatedRisk: "≈ 3% risk of an associated major malformation (Leppig 1987) — close to background.",
      action: "Routine care. Note the finding in the record and reassess at future visits.",
      testing: "No genetic testing indicated on this finding alone.",
    };
  }

  return {
    tier: "routine",
    label: "Low Risk — No Anomalies Noted",
    estimatedRisk: "≈ 1% background risk of a major malformation (Leppig 1987).",
    action: "Routine care.",
    testing: "No genetic testing indicated.",
  };
}

const TIER_STYLES: Record<RiskTier, { border: string; bg: string; text: string; badge: string }> = {
  routine: { border: "border-emerald-200", bg: "bg-emerald-50", text: "text-emerald-800", badge: "bg-emerald-100 text-emerald-800" },
  increased: { border: "border-amber-200", bg: "bg-amber-50", text: "text-amber-800", badge: "bg-amber-100 text-amber-800" },
  high: { border: "border-red-200", bg: "bg-red-50", text: "text-red-800", badge: "bg-red-100 text-red-800" },
};

export default function GeneticDiseaseScreenerPage() {
  const [major, setMajor] = useState<string[]>([]);
  const [minor, setMinor] = useState<string[]>([]);
  const [flags, setFlags] = useState<string[]>([]);

  function toggle(list: string[], set: (v: string[]) => void, id: string) {
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  const result = useMemo(() => computeResult(major.length, minor.length, flags), [major, minor, flags]);
  const style = TIER_STYLES[result.tier];
  const hasAnySelection = major.length > 0 || minor.length > 0 || flags.length > 0;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-violet-100 text-violet-700">
          <Dna className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Genetic Disease Suspicion Score</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Major/minor anomaly counting tool to flag infants and children who warrant clinical genetics referral or first-tier genetic testing.
          </p>
        </div>
      </div>

      <Alert className="rounded-2xl border-violet-200 bg-violet-50">
        <Info className="h-4 w-4 text-violet-600" />
        <AlertDescription className="text-violet-800 text-sm">
          Based on the minor-anomaly counting rule (Marden, Smith &amp; Cohen 1964; Leppig et al. 1987) and ACMG/AAP
          guidance on first-tier genetic testing (Miller et al. 2010; Moeschler &amp; Shevell 2014). A screening aid,
          not a diagnostic tool — clinical judgement and a dysmorphology exam always take priority.
        </AlertDescription>
      </Alert>

      {/* Major anomalies */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Major Anomalies</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Structural defects with medical, surgical, or cosmetic significance (~2-3% of newborns)</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {MAJOR_ANOMALIES.map((g) => (
            <div key={g.group} className="space-y-2">
              <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/70">{g.group}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {g.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggle(major, setMajor, item.id)}
                    className={cn(
                      "text-left p-2.5 rounded-2xl border-2 text-sm font-semibold transition-all",
                      major.includes(item.id) ? "bg-red-50 border-red-400 text-red-800" : "bg-muted/20 border-transparent hover:border-red-200"
                    )}
                  >
                    <span className="mr-1.5">{major.includes(item.id) ? "⚠" : "○"}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Minor anomalies */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Minor Anomalies</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Unusual morphologic features without significant functional consequence, individually common (~10-15%) — clustering matters</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {MINOR_ANOMALIES.map((g) => (
            <div key={g.group} className="space-y-2">
              <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/70">{g.group}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {g.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggle(minor, setMinor, item.id)}
                    className={cn(
                      "text-left p-2.5 rounded-2xl border-2 text-sm font-semibold transition-all",
                      minor.includes(item.id) ? "bg-orange-50 border-orange-300 text-orange-800" : "bg-muted/20 border-transparent hover:border-orange-200"
                    )}
                  >
                    <span className="mr-1.5">{minor.includes(item.id) ? "●" : "○"}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contextual flags */}
      <Card className="rounded-3xl border-2 border-red-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black text-red-700 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Contextual Red Flags — Each Independently Warrants Referral
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {CONTEXT_FLAGS.map((item) => (
            <button
              key={item.id}
              onClick={() => toggle(flags, setFlags, item.id)}
              className={cn(
                "w-full text-left p-3 rounded-2xl border-2 font-semibold text-sm transition-all",
                flags.includes(item.id) ? "bg-red-50 border-red-400 text-red-800" : "bg-muted/20 border-transparent hover:border-red-200"
              )}
            >
              <span className="mr-2">{flags.includes(item.id) ? "⚠ " : "○ "}</span>
              {item.label}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Result */}
      <Card className={cn("rounded-3xl border-2", style.border, style.bg)}>
        <CardContent className="pt-5 pb-5 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={cn("font-black uppercase tracking-widest text-[10px]", style.badge)}>{result.tier === "routine" ? "Routine" : result.tier === "increased" ? "Increased Risk" : "High Risk"}</Badge>
            <span className={cn("font-black", style.text)}>{result.label}</span>
          </div>
          <p className={cn("text-sm", style.text)}><span className="font-bold">Estimated risk: </span>{result.estimatedRisk}</p>
          <p className={cn("text-sm", style.text)}><span className="font-bold">Action: </span>{result.action}</p>
          <p className={cn("text-sm", style.text)}><span className="font-bold">Suggested testing: </span>{result.testing}</p>
          <div className="flex gap-4 flex-wrap pt-2 border-t border-current/10 text-xs">
            <span className={style.text}><span className="font-bold">{major.length}</span> major anomal{major.length === 1 ? "y" : "ies"}</span>
            <span className={style.text}><span className="font-bold">{minor.length}</span> minor anomal{minor.length === 1 ? "y" : "ies"}</span>
            <span className={style.text}><span className="font-bold">{flags.length}</span> contextual flag{flags.length === 1 ? "" : "s"}</span>
          </div>
        </CardContent>
      </Card>

      {!hasAnySelection && (
        <p className="text-xs text-muted-foreground text-center">Select any findings above to generate a risk stratification and testing recommendation.</p>
      )}

      <Alert className="rounded-2xl border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 text-sm">
          This tool screens for the <strong>possibility</strong> of an underlying genetic condition — it does not diagnose one.
          A single minor anomaly is common in unaffected children and is not itself a reason for referral. Always integrate
          findings with the overall clinical gestalt, growth trajectory, and developmental trajectory.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        References: Marden PM, Smith DW, McDonald MJ. J Pediatr. 1964;64:357-371 · Leppig KA, et al. J Pediatr.
        1987;110(4):531-537 · Miller DT, et al. Am J Hum Genet. 2010;86(5):749-764 (ACMG) · Moeschler JB, Shevell M;
        AAP. Pediatrics. 2014;134(3):e903-918
      </p>
    </div>
  );
}
