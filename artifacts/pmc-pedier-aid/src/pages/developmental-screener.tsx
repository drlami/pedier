import { useState } from "react";
import { Star, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

// Developmental milestones and red flags by age group
// Domains: Gross Motor, Fine Motor, Language/Communication, Social/Emotional, Cognitive

const AGE_GROUPS = [
  {
    id: "2m",
    label: "2 months",
    milestones: [
      { domain: "Gross Motor", text: "Lifts head briefly when on tummy" },
      { domain: "Fine Motor", text: "Opens fists intermittently" },
      { domain: "Language", text: "Coos and makes vowel sounds" },
      { domain: "Social", text: "Social smile (responds to face)" },
      { domain: "Cognitive", text: "Follows moving objects to midline" },
    ],
    redFlags: [
      "No social smile by 2 months",
      "Does not respond to loud sounds",
      "Does not focus eyes or follow movement",
      "Persistent fisting of hands",
    ],
  },
  {
    id: "4m",
    label: "4 months",
    milestones: [
      { domain: "Gross Motor", text: "Good head control, pushes up on forearms" },
      { domain: "Fine Motor", text: "Reaches for objects, brings hands to mouth" },
      { domain: "Language", text: "Laughs and squeals, orients to voice" },
      { domain: "Social", text: "Smiles spontaneously at people" },
      { domain: "Cognitive", text: "Recognises familiar faces" },
    ],
    redFlags: [
      "No babbling or cooing",
      "Does not bring things to mouth",
      "Does not push down on legs when feet on hard surface",
      "No social smile",
    ],
  },
  {
    id: "6m",
    label: "6 months",
    milestones: [
      { domain: "Gross Motor", text: "Rolls front to back and back to front; sits with support" },
      { domain: "Fine Motor", text: "Transfers objects between hands" },
      { domain: "Language", text: "Responds to name; babbles (ba, da, ma)" },
      { domain: "Social", text: "Stranger anxiety begins; enjoys social play" },
      { domain: "Cognitive", text: "Begins to understand cause and effect" },
    ],
    redFlags: [
      "Does not roll over in either direction",
      "Cannot sit with support",
      "Does not respond to name",
      "Does not babble",
      "No affection towards caregivers",
    ],
  },
  {
    id: "9m",
    label: "9 months",
    milestones: [
      { domain: "Gross Motor", text: "Sits independently; pulls to stand; creeping/crawling" },
      { domain: "Fine Motor", text: "Pincer grasp developing; bangs objects together" },
      { domain: "Language", text: "Understands 'no'; uses jargon/gibberish" },
      { domain: "Social", text: "Waves bye-bye; plays peek-a-boo" },
      { domain: "Cognitive", text: "Object permanence (searches for hidden toy)" },
    ],
    redFlags: [
      "Cannot sit independently",
      "Does not transfer objects between hands",
      "No jargon or babbling",
      "No joint attention (not pointing, showing, waving)",
    ],
  },
  {
    id: "12m",
    label: "12 months",
    milestones: [
      { domain: "Gross Motor", text: "Pulls to stand, cruises along furniture; may walk with support" },
      { domain: "Fine Motor", text: "Pincer grasp mature; claps hands" },
      { domain: "Language", text: "1–2 meaningful words; follows simple commands with gesture" },
      { domain: "Social", text: "Uses simple gestures (pointing, waving)" },
      { domain: "Cognitive", text: "Explores by banging, shaking, throwing objects" },
    ],
    redFlags: [
      "Not walking with support by 12 months",
      "No single words (mama/dada specific)",
      "No pointing or waving",
      "Significant loss of language or skills",
    ],
  },
  {
    id: "18m",
    label: "18 months",
    milestones: [
      { domain: "Gross Motor", text: "Walks independently; runs stiffly; climbs stairs with support" },
      { domain: "Fine Motor", text: "Scribbles; stacks 2–4 blocks; uses spoon" },
      { domain: "Language", text: "10–20 words; points to body parts when named" },
      { domain: "Social", text: "Engages in simple pretend play; shows affection" },
      { domain: "Cognitive", text: "Follows simple two-step commands" },
    ],
    redFlags: [
      "Not walking independently by 18 months",
      "Fewer than 6–8 words",
      "Not pointing to show interest",
      "No pretend play",
      "Loss of any previously acquired skill",
    ],
  },
  {
    id: "24m",
    label: "24 months",
    milestones: [
      { domain: "Gross Motor", text: "Runs, kicks a ball; climbs stairs alternating feet" },
      { domain: "Fine Motor", text: "Stacks 6+ blocks; draws horizontal/vertical lines" },
      { domain: "Language", text: "50+ words; 2-word phrases; 50% speech intelligible to strangers" },
      { domain: "Social", text: "Parallel play; follows 2-step instructions; uses 'I' and 'mine'" },
      { domain: "Cognitive", text: "Sorts by shape/colour; deferred imitation" },
    ],
    redFlags: [
      "Fewer than 50 words",
      "No two-word phrases",
      "Cannot follow two-step commands",
      "Loss of any language",
      "Not pointing to objects or pictures when named",
    ],
  },
  {
    id: "36m",
    label: "3 years",
    milestones: [
      { domain: "Gross Motor", text: "Runs, jumps, climbs; pedals tricycle" },
      { domain: "Fine Motor", text: "Draws circle; uses scissors with help; dresses/undresses" },
      { domain: "Language", text: "200+ words; 3-word sentences; 75% intelligible to strangers" },
      { domain: "Social", text: "Interactive play with peers; knows first/last name; age" },
      { domain: "Cognitive", text: "Counts to 10; understands 'same' and 'different'" },
    ],
    redFlags: [
      "Speech not understood by parents (< 75%)",
      "Cannot put 3 words together",
      "Cannot understand simple instructions",
      "Does not play pretend",
      "Not interested in other children",
    ],
  },
  {
    id: "48m",
    label: "4 years",
    milestones: [
      { domain: "Gross Motor", text: "Hops on one foot; catches a bounced ball" },
      { domain: "Fine Motor", text: "Draws person with 3 parts; copies +/□" },
      { domain: "Language", text: "Uses 4–6 word sentences; tells stories; 100% intelligible" },
      { domain: "Social", text: "Cooperates with children; distinguishes real vs. make-believe" },
      { domain: "Cognitive", text: "Counts to 20; identifies colours; understands time concepts" },
    ],
    redFlags: [
      "Cannot count to 4",
      "Cannot follow 3-step commands",
      "Unable to retell a simple story",
      "Not interested in peers or interactive games",
      "Persistent echolalia without communication intent",
    ],
  },
  {
    id: "60m",
    label: "5 years",
    milestones: [
      { domain: "Gross Motor", text: "Skips; stands on one foot 10 seconds" },
      { domain: "Fine Motor", text: "Copies triangle; prints some letters; uses fork/knife" },
      { domain: "Language", text: "Speaks clearly; tells simple tales; asks what/why/who" },
      { domain: "Social", text: "Follows rules; friends; negotiates in play" },
      { domain: "Cognitive", text: "Counts to 10 reliably; knows address; alphabet" },
    ],
    redFlags: [
      "Not understood by strangers",
      "Cannot tell stories",
      "Not interested in school readiness activities",
      "Cannot write own name",
      "Significant difficulty with peer interaction",
    ],
  },
];

const DOMAIN_COLORS: Record<string, string> = {
  "Gross Motor": "bg-blue-100 text-blue-700",
  "Fine Motor":  "bg-violet-100 text-violet-700",
  "Language":    "bg-emerald-100 text-emerald-700",
  "Social":      "bg-pink-100 text-pink-700",
  "Cognitive":   "bg-amber-100 text-amber-700",
};

export default function DevelopmentalScreenerPage() {
  const [selectedAge, setSelectedAge] = useState<string>("");
  const [notMet, setNotMet] = useState<string[]>([]);
  const [redFlags, setRedFlags] = useState<string[]>([]);

  const ageGroup = AGE_GROUPS.find(g => g.id === selectedAge);

  function toggleMilestone(text: string) {
    setNotMet(prev => prev.includes(text) ? prev.filter(x => x !== text) : [...prev, text]);
  }
  function toggleRedFlag(text: string) {
    setRedFlags(prev => prev.includes(text) ? prev.filter(x => x !== text) : [...prev, text]);
  }

  function selectAge(id: string) {
    setSelectedAge(id);
    setNotMet([]);
    setRedFlags([]);
  }

  const hasRedFlags = redFlags.length > 0;
  const missedCount = notMet.length;
  const totalMilestones = ageGroup?.milestones.length ?? 0;
  const concern = hasRedFlags || missedCount >= 2;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
          <Star className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Developmental Red Flag Screener</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Age-stratified developmental milestone checklist with red flag identification for early intervention referral.
          </p>
        </div>
      </div>

      <Alert className="rounded-2xl border-emerald-200 bg-emerald-50">
        <Info className="h-4 w-4 text-emerald-600" />
        <AlertDescription className="text-emerald-800 text-sm">
          Based on <strong>AAP/CDC "Learn the Signs. Act Early"</strong> milestones and developmental surveillance guidance. This is a screening tool — not diagnostic. Any concern should prompt formal assessment with standardised tools (ASQ-3, Denver II, Bayley).
        </AlertDescription>
      </Alert>

      {/* Age selector */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Select Age Group</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {AGE_GROUPS.map(g => (
              <button
                key={g.id}
                onClick={() => selectAge(g.id)}
                className={cn(
                  "px-4 py-2.5 rounded-2xl border-2 font-bold text-sm transition-all",
                  selectedAge === g.id ? "bg-primary text-white border-primary shadow-md" : "bg-muted/20 border-transparent hover:border-primary/30"
                )}
              >
                {g.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {ageGroup && (
        <>
          {/* Summary */}
          {(missedCount > 0 || hasRedFlags) && (
            <Card className={cn("rounded-3xl border-2", concern ? "border-red-200 bg-red-50 text-red-700" : "border-amber-200 bg-amber-50 text-amber-700")}>
              <CardContent className="pt-4 pb-4 flex items-center gap-4">
                <div>
                  <p className="font-black">{concern ? "Developmental Concern — Refer for Assessment" : "Monitor Closely"}</p>
                  <p className="text-sm opacity-70">
                    {hasRedFlags ? `${redFlags.length} red flag(s) present. ` : ""}
                    {missedCount > 0 ? `${missedCount} milestone(s) not met. ` : ""}
                    {concern ? "Refer to paediatric developmental assessment." : "Repeat screening in 4 weeks."}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Milestones */}
          <Card className="rounded-3xl border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-black">Expected Milestones at {ageGroup.label}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Mark any milestones the child has NOT yet achieved</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {ageGroup.milestones.map(m => (
                <button
                  key={m.text}
                  onClick={() => toggleMilestone(m.text)}
                  className={cn(
                    "w-full text-left p-3 rounded-2xl border-2 text-sm font-semibold transition-all flex items-start gap-3",
                    notMet.includes(m.text) ? "bg-orange-50 border-orange-300 text-orange-800 line-through" : "bg-muted/20 border-transparent hover:border-primary/30"
                  )}
                >
                  <span className={cn("shrink-0 px-2 py-0.5 rounded-full text-xs font-black", DOMAIN_COLORS[m.domain])}>{m.domain}</span>
                  <span className="leading-snug">{m.text}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Red flags */}
          <Card className="rounded-3xl border-2 border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-black text-red-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Red Flags — Immediate Referral if Present
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {ageGroup.redFlags.map(rf => (
                <button
                  key={rf}
                  onClick={() => toggleRedFlag(rf)}
                  className={cn(
                    "w-full text-left p-3 rounded-2xl border-2 font-semibold text-sm transition-all",
                    redFlags.includes(rf) ? "bg-red-50 border-red-400 text-red-800" : "bg-muted/20 border-transparent hover:border-red-200"
                  )}
                >
                  <span className="mr-2">{redFlags.includes(rf) ? "⚠ " : "○ "}</span>
                  {rf}
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="rounded-2xl bg-muted/30 p-4 text-sm space-y-1">
            <p className="font-black">Summary</p>
            <div className="flex gap-4 flex-wrap">
              <div><span className="text-muted-foreground">Milestones checked:</span> <span className="font-bold">{totalMilestones - missedCount} / {totalMilestones}</span></div>
              {hasRedFlags && <Badge className="bg-red-100 text-red-800 font-bold">{redFlags.length} red flag(s)</Badge>}
              {missedCount >= 2 && <Badge className="bg-orange-100 text-orange-800 font-bold">{missedCount} milestones missed</Badge>}
            </div>
          </div>
        </>
      )}

      <Alert className="rounded-2xl border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 text-sm">
          <strong>Regression (loss of skills)</strong> is always a red flag at any age. Refer urgently if a child loses previously acquired language, motor, or social skills. Consider rett syndrome, landau-kleffner, metabolic disorders, or epileptic encephalopathy.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference: CDC "Learn the Signs. Act Early" 2022 update · AAP Developmental Surveillance Guidelines · Bright Futures 4th Edition · Bayley-4 normative data
      </p>
    </div>
  );
}
