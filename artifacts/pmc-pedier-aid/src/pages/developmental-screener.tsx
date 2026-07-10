import { useState, useMemo } from "react";
import { Star, AlertTriangle, Info, Calendar, ClipboardList, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/**
 * Developmental milestones sourced from CDC's "Learn the Signs. Act Early."
 * 2022 revision (milestones a child should reach by 75% of same-age peers,
 * not 50% as in the pre-2022 version — items are more sensitive to true
 * delay under this standard). CDC's Movement/Physical Development domain is
 * split here into Gross Motor and Fine Motor for clinical granularity
 * (matching Denver-II / Bright Futures convention); a handful of CDC
 * "Cognitive" items that are conventionally scored as fine-motor-adaptive
 * (block stacking, reaching, shape copying, switches/knobs, drawing,
 * writing) are bucketed under Fine Motor instead, single-assignment only.
 * Item wording is CDC's own; only domain bucketing is this app's overlay.
 */

type Domain = "Gross Motor" | "Fine Motor" | "Language" | "Social" | "Cognitive";

interface Milestone { domain: Domain; text: string }

interface AgeGroup {
  id: string;
  label: string;
  months: number;
  milestones: Milestone[];
  redFlags: string[];
  autismScreenDue?: boolean;
}

const AGE_GROUPS: AgeGroup[] = [
  {
    id: "2m", label: "2 months", months: 2,
    milestones: [
      { domain: "Social", text: "Calms down when spoken to or picked up" },
      { domain: "Social", text: "Looks at your face" },
      { domain: "Social", text: "Seems happy to see you when you walk up to her" },
      { domain: "Social", text: "Smiles when you talk to or smile at her" },
      { domain: "Language", text: "Makes sounds other than crying" },
      { domain: "Language", text: "Reacts to loud sounds" },
      { domain: "Cognitive", text: "Watches you as you move" },
      { domain: "Cognitive", text: "Looks at a toy for several seconds" },
      { domain: "Gross Motor", text: "Holds head up when on tummy" },
      { domain: "Gross Motor", text: "Moves both arms and both legs" },
      { domain: "Fine Motor", text: "Opens hands briefly" },
    ],
    redFlags: [
      "No social smile by 2–3 months",
      "Does not respond to loud sounds",
      "Does not visually track a face or moving object",
      "No head lift at all when on tummy",
    ],
  },
  {
    id: "4m", label: "4 months", months: 4,
    milestones: [
      { domain: "Social", text: "Smiles on his own to get your attention" },
      { domain: "Social", text: "Chuckles (not yet a full laugh) when you try to make him laugh" },
      { domain: "Social", text: "Looks at you, moves, or makes sounds to get or keep your attention" },
      { domain: "Language", text: "Makes sounds like “oooo”, “aahh” (cooing)" },
      { domain: "Language", text: "Makes sounds back when you talk to him" },
      { domain: "Language", text: "Turns head towards the sound of your voice" },
      { domain: "Cognitive", text: "If hungry, opens mouth when he sees breast or bottle" },
      { domain: "Cognitive", text: "Looks at her hands with interest" },
      { domain: "Gross Motor", text: "Holds head steady without support when you are holding him" },
      { domain: "Gross Motor", text: "Pushes up onto elbows/forearms when on tummy" },
      { domain: "Fine Motor", text: "Holds a toy when you put it in his hand" },
      { domain: "Fine Motor", text: "Uses his arm to swing at toys" },
      { domain: "Fine Motor", text: "Brings hands to mouth" },
    ],
    redFlags: [
      "No head control at all when pulled to sit",
      "Does not bring hands or objects to mouth",
      "No cooing or sound-making back and forth",
      "No social smile",
    ],
  },
  {
    id: "6m", label: "6 months", months: 6,
    milestones: [
      { domain: "Social", text: "Knows familiar people" },
      { domain: "Social", text: "Likes to look at self in a mirror" },
      { domain: "Social", text: "Laughs" },
      { domain: "Language", text: "Takes turns making sounds with you" },
      { domain: "Language", text: "Blows “raspberries” (sticks tongue out and blows)" },
      { domain: "Language", text: "Makes squealing noises" },
      { domain: "Cognitive", text: "Puts things in her mouth to explore them" },
      { domain: "Cognitive", text: "Closes lips to show she doesn’t want more food" },
      { domain: "Gross Motor", text: "Rolls from tummy to back" },
      { domain: "Gross Motor", text: "Pushes up with straight arms when on tummy" },
      { domain: "Gross Motor", text: "Leans on hands to support herself when sitting" },
      { domain: "Fine Motor", text: "Reaches to grab a toy she wants" },
    ],
    redFlags: [
      "Does not roll over in either direction",
      "Cannot sit even with support",
      "No back-and-forth vocal turn-taking",
      "Not laughing or squealing",
      "Seems very stiff or very floppy (tone concern)",
    ],
  },
  {
    id: "9m", label: "9 months", months: 9,
    milestones: [
      { domain: "Social", text: "Is shy, clingy, or fearful around strangers" },
      { domain: "Social", text: "Shows several facial expressions, like happy, sad, angry, and surprised" },
      { domain: "Social", text: "Looks when you call her name" },
      { domain: "Social", text: "Reacts when you leave (looks, reaches for you, or cries)" },
      { domain: "Social", text: "Smiles or laughs when you play peek-a-boo" },
      { domain: "Language", text: "Makes a lot of different sounds like “mamamama” and “bababababa”" },
      { domain: "Language", text: "Lifts arms up to be picked up" },
      { domain: "Cognitive", text: "Looks for objects when dropped out of sight (like his spoon or toy)" },
      { domain: "Cognitive", text: "Bangs two things together" },
      { domain: "Gross Motor", text: "Gets to a sitting position by herself" },
      { domain: "Gross Motor", text: "Sits without support" },
      { domain: "Fine Motor", text: "Moves things from one hand to her other hand" },
      { domain: "Fine Motor", text: "Uses fingers to “rake” food towards himself" },
    ],
    redFlags: [
      "Cannot sit without support",
      "Does not respond to own name",
      "No reduplicated babbling (baba, mama, dada sounds)",
      "Does not transfer objects between hands",
      "No joint attention — not reaching, showing, or looking to share interest",
    ],
  },
  {
    id: "12m", label: "12 months", months: 12,
    milestones: [
      { domain: "Social", text: "Plays games with you, like pat-a-cake" },
      { domain: "Language", text: "Waves “bye-bye”" },
      { domain: "Language", text: "Calls a parent “mama” or “dada” or another special name" },
      { domain: "Language", text: "Understands “no” (pauses briefly or stops when you say it)" },
      { domain: "Cognitive", text: "Puts something in a container, like a block in a cup" },
      { domain: "Cognitive", text: "Looks for things he sees you hide, like a toy under a blanket" },
      { domain: "Gross Motor", text: "Pulls up to stand" },
      { domain: "Gross Motor", text: "Walks, holding on to furniture (cruising)" },
      { domain: "Fine Motor", text: "Drinks from a cup without a lid, as you hold it" },
      { domain: "Fine Motor", text: "Picks things up between thumb and pointer finger, like small bits of food" },
    ],
    redFlags: [
      "Not bearing weight on legs or pulling to stand",
      "No consonant babbling (ba, da, ma sounds)",
      "No gestures at all — not waving, pointing, or showing",
      "Loss of any previously acquired skill (regression) — always significant at any age",
    ],
  },
  {
    id: "15m", label: "15 months", months: 15,
    milestones: [
      { domain: "Social", text: "Copies other children while playing, like taking toys out of a container when another child does" },
      { domain: "Social", text: "Shows you an object she likes" },
      { domain: "Social", text: "Claps when excited" },
      { domain: "Social", text: "Hugs stuffed doll or other toy" },
      { domain: "Social", text: "Shows you affection (hugs, cuddles, or kisses you)" },
      { domain: "Language", text: "Tries to say one or two words besides “mama” or “dada,” like “ba” for ball" },
      { domain: "Language", text: "Looks at a familiar object when you name it" },
      { domain: "Language", text: "Follows directions given with both a gesture and words" },
      { domain: "Language", text: "Points to ask for something or to get help" },
      { domain: "Cognitive", text: "Tries to use things the right way, like a phone, cup, or book" },
      { domain: "Gross Motor", text: "Takes a few steps on his own" },
      { domain: "Fine Motor", text: "Uses fingers to feed herself some food" },
      { domain: "Fine Motor", text: "Stacks at least two small objects, like blocks" },
    ],
    redFlags: [
      "Not attempting any independent steps, even a few",
      "No attempt at a word beyond mama/dada",
      "No pointing to request or show interest",
      "Loss of any previously acquired skill (regression)",
    ],
  },
  {
    id: "18m", label: "18 months", months: 18,
    milestones: [
      { domain: "Social", text: "Moves away from you, but looks to make sure you are close by" },
      { domain: "Social", text: "Points to show you something interesting" },
      { domain: "Social", text: "Puts hands out for you to wash them" },
      { domain: "Social", text: "Looks at a few pages in a book with you" },
      { domain: "Social", text: "Helps you dress him by pushing arm through sleeve or lifting up foot" },
      { domain: "Language", text: "Tries to say three or more words besides “mama” or “dada”" },
      { domain: "Language", text: "Follows one-step directions without any gestures" },
      { domain: "Cognitive", text: "Copies you doing chores, like sweeping with a broom" },
      { domain: "Cognitive", text: "Plays with toys in a simple way, like pushing a toy car" },
      { domain: "Gross Motor", text: "Walks without holding on to anyone or anything" },
      { domain: "Gross Motor", text: "Climbs on and off a couch or chair without help" },
      { domain: "Fine Motor", text: "Scribbles" },
      { domain: "Fine Motor", text: "Drinks from a cup without a lid and may spill sometimes" },
      { domain: "Fine Motor", text: "Feeds himself with his fingers" },
      { domain: "Fine Motor", text: "Tries to use a spoon" },
    ],
    redFlags: [
      "Not walking independently",
      "Fewer than 6 words total",
      "Not pointing to show interest in things",
      "No pretend or functional play with toys",
      "Loss of any previously acquired skill (regression)",
    ],
    autismScreenDue: true,
  },
  {
    id: "24m", label: "24 months", months: 24,
    milestones: [
      { domain: "Social", text: "Notices when others are hurt or upset, like pausing or looking sad when someone is crying" },
      { domain: "Social", text: "Looks at your face to see how to react in a new situation" },
      { domain: "Language", text: "Points to things in a book when you ask, like “Where is the bear?”" },
      { domain: "Language", text: "Says at least two words together, like “More milk”" },
      { domain: "Language", text: "Points to at least two body parts when you ask him to show you" },
      { domain: "Language", text: "Uses more gestures than just waving and pointing, like blowing a kiss or nodding yes" },
      { domain: "Cognitive", text: "Plays with more than one toy at the same time, like putting toy food on a toy plate" },
      { domain: "Gross Motor", text: "Kicks a ball" },
      { domain: "Gross Motor", text: "Runs" },
      { domain: "Gross Motor", text: "Walks (not climbs) up a few stairs with or without help" },
      { domain: "Fine Motor", text: "Eats with a spoon" },
      { domain: "Fine Motor", text: "Holds something in one hand while using the other hand, like holding a container and taking the lid off" },
      { domain: "Fine Motor", text: "Tries to use switches, knobs, or buttons on a toy" },
    ],
    redFlags: [
      "Fewer than 50 words or no two-word combinations",
      "Cannot follow a simple one-step instruction without a gesture",
      "Not walking steadily",
      "No interest in other children",
      "Loss of any previously acquired skill (regression)",
    ],
    autismScreenDue: true,
  },
  {
    id: "30m", label: "30 months", months: 30,
    milestones: [
      { domain: "Social", text: "Plays next to other children and sometimes plays with them" },
      { domain: "Social", text: "Shows you what she can do by saying, “Look at me!”" },
      { domain: "Social", text: "Follows simple routines when told, like helping to pick up toys at clean-up time" },
      { domain: "Language", text: "Says about 50 words" },
      { domain: "Language", text: "Says two or more words together, with one action word, like “Doggie run”" },
      { domain: "Language", text: "Names things in a book when you point and ask, “What is this?”" },
      { domain: "Language", text: "Says words like “I,” “me,” or “we”" },
      { domain: "Cognitive", text: "Uses things to pretend, like feeding a block to a doll as if it were food" },
      { domain: "Cognitive", text: "Shows simple problem-solving skills, like standing on a small stool to reach something" },
      { domain: "Cognitive", text: "Follows two-step instructions like “Put the toy down and close the door”" },
      { domain: "Cognitive", text: "Shows he knows at least one colour, like pointing to a red crayon when asked" },
      { domain: "Gross Motor", text: "Jumps off the ground with both feet" },
      { domain: "Fine Motor", text: "Uses hands to twist things, like turning doorknobs or unscrewing lids" },
      { domain: "Fine Motor", text: "Takes some clothes off by himself, like loose pants or an open jacket" },
      { domain: "Fine Motor", text: "Turns book pages, one at a time, when you read to her" },
    ],
    redFlags: [
      "Not combining two words with an action word",
      "Cannot follow two-step instructions",
      "No pretend play",
      "Frequent, prolonged tantrums with no attempt to communicate the need",
      "Loss of any previously acquired skill (regression)",
    ],
  },
  {
    id: "36m", label: "3 years", months: 36,
    milestones: [
      { domain: "Social", text: "Calms down within 10 minutes after you leave her, like at a childcare drop off" },
      { domain: "Social", text: "Notices other children and joins them to play" },
      { domain: "Language", text: "Talks with you in conversation using at least two back-and-forth exchanges" },
      { domain: "Language", text: "Asks “who,” “what,” “where,” or “why” questions" },
      { domain: "Language", text: "Says what action is happening in a picture or book when asked" },
      { domain: "Language", text: "Says first name, when asked" },
      { domain: "Language", text: "Talks well enough for others to understand, most of the time" },
      { domain: "Cognitive", text: "Avoids touching hot objects, like a stove, when you warn her" },
      { domain: "Gross Motor", text: "Climbs, runs, and pedals a tricycle (typical by this age)" },
      { domain: "Fine Motor", text: "Draws a circle, when you show him how" },
      { domain: "Fine Motor", text: "Strings items together, like large beads or macaroni" },
      { domain: "Fine Motor", text: "Puts on some clothes by himself, like loose pants or a jacket" },
      { domain: "Fine Motor", text: "Uses a fork" },
    ],
    redFlags: [
      "Speech not understood by strangers, most of the time",
      "Cannot speak in short phrases or sentences",
      "No interactive or pretend play with peers",
      "Frequent falls or marked clumsiness for age",
      "Loss of any previously acquired skill (regression)",
    ],
  },
  {
    id: "48m", label: "4 years", months: 48,
    milestones: [
      { domain: "Social", text: "Pretends to be something else during play (teacher, superhero, dog)" },
      { domain: "Social", text: "Asks to go play with children if none are around" },
      { domain: "Social", text: "Comforts others who are hurt or sad, like hugging a crying friend" },
      { domain: "Social", text: "Avoids danger, like not jumping from tall heights at the playground" },
      { domain: "Social", text: "Likes to be a “helper”" },
      { domain: "Social", text: "Changes behaviour based on where she is" },
      { domain: "Language", text: "Says sentences with four or more words" },
      { domain: "Language", text: "Says some words from a song, story, or nursery rhyme" },
      { domain: "Language", text: "Talks about at least one thing that happened during her day" },
      { domain: "Language", text: "Answers simple questions like “What is a coat for?”" },
      { domain: "Cognitive", text: "Names a few colours of items" },
      { domain: "Cognitive", text: "Tells what comes next in a well-known story" },
      { domain: "Gross Motor", text: "Catches a large ball most of the time" },
      { domain: "Fine Motor", text: "Serves herself food or pours water, with adult supervision" },
      { domain: "Fine Motor", text: "Unbuttons some buttons" },
      { domain: "Fine Motor", text: "Holds crayon or pencil between fingers and thumb (not a fist)" },
      { domain: "Fine Motor", text: "Draws a person with three or more body parts" },
    ],
    redFlags: [
      "Cannot draw any recognisable shapes",
      "Speech unintelligible to unfamiliar listeners",
      "No interest in interactive or pretend play with other children",
      "Cannot follow a two- to three-step instruction",
      "Loss of any previously acquired skill (regression)",
    ],
  },
  {
    id: "60m", label: "5 years", months: 60,
    milestones: [
      { domain: "Social", text: "Follows rules or takes turns when playing games with other children" },
      { domain: "Social", text: "Sings, dances, or acts for you" },
      { domain: "Social", text: "Does simple chores at home, like matching socks or clearing the table" },
      { domain: "Language", text: "Tells a story she heard or made up with at least two events" },
      { domain: "Language", text: "Answers simple questions about a book or story after you read or tell it" },
      { domain: "Language", text: "Keeps a conversation going with more than three back-and-forth exchanges" },
      { domain: "Language", text: "Uses or recognises simple rhymes (bat-cat, ball-tall)" },
      { domain: "Cognitive", text: "Counts to 10" },
      { domain: "Cognitive", text: "Names some numbers between 1 and 5 when you point to them" },
      { domain: "Cognitive", text: "Uses words about time, like “yesterday,” “tomorrow,” “morning,” or “night”" },
      { domain: "Cognitive", text: "Pays attention for 5 to 10 minutes during activities (screen time does not count)" },
      { domain: "Cognitive", text: "Names some letters when you point to them" },
      { domain: "Gross Motor", text: "Hops on one foot" },
      { domain: "Fine Motor", text: "Buttons some buttons" },
      { domain: "Fine Motor", text: "Writes some letters in her name" },
    ],
    redFlags: [
      "Cannot state own first and last name",
      "Speech difficult for strangers to understand",
      "Cannot draw simple recognisable figures",
      "Marked difficulty separating from caregiver, or extreme difficulty with peer interaction",
      "Loss of any previously acquired skill (regression)",
    ],
  },
];

const DOMAIN_COLORS: Record<Domain, string> = {
  "Gross Motor": "bg-blue-100 text-blue-700",
  "Fine Motor":  "bg-violet-100 text-violet-700",
  "Language":    "bg-emerald-100 text-emerald-700",
  "Social":      "bg-pink-100 text-pink-700",
  "Cognitive":   "bg-amber-100 text-amber-700",
};

const DOMAIN_ORDER: Domain[] = ["Social", "Language", "Cognitive", "Gross Motor", "Fine Motor"];

export default function DevelopmentalScreenerPage() {
  const [selectedAge, setSelectedAge] = useState<string>("");
  const [notMet, setNotMet] = useState<string[]>([]);
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [regression, setRegression] = useState(false);
  const [caregiverConcern, setCaregiverConcern] = useState(false);

  const [ageYearsInput, setAgeYearsInput] = useState("");
  const [ageMonthsInput, setAgeMonthsInput] = useState("");
  const [premWeeksInput, setPremWeeksInput] = useState("");

  const ageGroup = AGE_GROUPS.find(g => g.id === selectedAge);

  const ageYrs = parseInt(ageYearsInput) || 0;
  const ageMos = parseInt(ageMonthsInput) || 0;
  const premWks = parseFloat(premWeeksInput) || 0;
  const chronologicalMonths = ageYrs * 12 + ageMos;
  const correctedMonths = Math.max(0, chronologicalMonths - premWks / 4.33);
  const effectiveMonths = premWks > 0 ? correctedMonths : chronologicalMonths;
  const ageEntered = ageYearsInput !== "" || ageMonthsInput !== "";

  const suggestedGroup = useMemo(() => {
    if (!ageEntered) return null;
    return AGE_GROUPS.reduce((best, g) =>
      Math.abs(g.months - effectiveMonths) < Math.abs(best.months - effectiveMonths) ? g : best
    );
  }, [ageEntered, effectiveMonths]);

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
    setRegression(false);
    setCaregiverConcern(false);
  }

  const milestonesByDomain = useMemo(() => {
    if (!ageGroup) return [];
    return DOMAIN_ORDER
      .map(domain => ({ domain, items: ageGroup.milestones.filter(m => m.domain === domain) }))
      .filter(d => d.items.length > 0);
  }, [ageGroup]);

  const domainConcerns = useMemo(() => {
    return milestonesByDomain
      .map(d => ({ domain: d.domain, missed: d.items.filter(m => notMet.includes(m.text)).length, total: d.items.length }))
      .filter(d => d.missed > 0);
  }, [milestonesByDomain, notMet]);

  const domainsAffected = domainConcerns.length;
  const hasRedFlags = redFlags.length > 0;
  const missedCount = notMet.length;
  const totalMilestones = ageGroup?.milestones.length ?? 0;

  const tier: "refer" | "monitor" | "track" | null = !ageGroup ? null :
    (regression || caregiverConcern || hasRedFlags || domainsAffected >= 2) ? "refer" :
    (domainsAffected === 1) ? "monitor" : "track";

  const isGlobalPattern = domainsAffected >= 2;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
          <Star className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Developmental Milestone Screener</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Age-stratified milestone checklist with domain-level delay detection, corrected-age support for preterm infants, and referral guidance.
          </p>
        </div>
      </div>

      <Alert className="rounded-2xl border-emerald-200 bg-emerald-50">
        <Info className="h-4 w-4 text-emerald-600" />
        <AlertDescription className="text-emerald-800 text-sm">
          Based on the CDC's <strong>2022-revised "Learn the Signs. Act Early."</strong> checklists — milestones are now set at the
          <strong> 75th percentile</strong> (most children reach them by this age), not the 50th percentile used before 2022, making a
          missed milestone more clinically meaningful. This is a <strong>surveillance aid, not a diagnostic instrument</strong> — any
          concern should prompt formal screening with a standardised tool (ASQ-3, M-CHAT-R/F, Denver-II, Bayley-4).
        </AlertDescription>
      </Alert>

      {/* Age input + corrected age */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Patient Age
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Years</Label>
              <Input type="number" inputMode="numeric" placeholder="Yrs" min={0} max={5}
                className="h-10 font-mono text-center" value={ageYearsInput}
                onChange={(e) => setAgeYearsInput(e.target.value)} />
            </div>
            <div>
              <Label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Months</Label>
              <Input type="number" inputMode="numeric" placeholder="Mo" min={0} max={11}
                className="h-10 font-mono text-center" value={ageMonthsInput}
                onChange={(e) => setAgeMonthsInput(e.target.value)} />
            </div>
            <div>
              <Label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Weeks premature</Label>
              <Input type="number" inputMode="decimal" placeholder="Optional" min={0}
                className="h-10 font-mono text-center border-dashed" value={premWeeksInput}
                onChange={(e) => setPremWeeksInput(e.target.value)} />
            </div>
          </div>
          {premWks > 0 && ageEntered && (
            <p className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-2 rounded-xl">
              Corrected age: {Math.floor(correctedMonths / 12)}y {Math.round(correctedMonths % 12)}m ({correctedMonths.toFixed(1)} mo) —
              use corrected age for screening until 24 months.
            </p>
          )}
          {suggestedGroup && (
            <p className="text-xs text-muted-foreground">
              Suggested checkpoint: <strong>{suggestedGroup.label}</strong>
              {suggestedGroup.id !== selectedAge && (
                <button onClick={() => selectAge(suggestedGroup.id)} className="ml-2 text-emerald-700 font-bold underline underline-offset-2">
                  Use this checkpoint
                </button>
              )}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Age selector */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Select Screening Checkpoint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {AGE_GROUPS.map(g => (
              <button
                key={g.id}
                onClick={() => selectAge(g.id)}
                className={cn(
                  "px-4 py-2.5 rounded-2xl border-2 font-bold text-sm transition-all",
                  selectedAge === g.id ? "bg-primary text-white border-primary shadow-md" :
                  suggestedGroup?.id === g.id ? "bg-emerald-50 border-emerald-300 text-emerald-800" :
                  "bg-muted/20 border-transparent hover:border-primary/30"
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
          {/* Autism screening prompt */}
          {ageGroup.autismScreenDue && (
            <Alert className="rounded-2xl border-purple-200 bg-purple-50">
              <ShieldAlert className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-purple-800 text-sm">
                <strong>Autism-specific screening is due at this visit.</strong> AAP Bright Futures recommends formal
                <strong> M-CHAT-R/F</strong> autism screening at both 18 and 24 months, in addition to general developmental
                surveillance — administer it alongside this checklist, not instead of it.
              </AlertDescription>
            </Alert>
          )}

          {/* Universal flags */}
          <Card className="rounded-3xl border-2 border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-black text-red-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Universal Flags — Apply at Any Age
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button
                onClick={() => setRegression(v => !v)}
                className={cn("w-full text-left p-3 rounded-2xl border-2 font-semibold text-sm transition-all",
                  regression ? "bg-red-50 border-red-400 text-red-800" : "bg-muted/20 border-transparent hover:border-red-200")}
              >
                <span className="mr-2">{regression ? "⚠ " : "○ "}</span>
                Loss of previously acquired language, motor, or social skills (regression)
              </button>
              <button
                onClick={() => setCaregiverConcern(v => !v)}
                className={cn("w-full text-left p-3 rounded-2xl border-2 font-semibold text-sm transition-all",
                  caregiverConcern ? "bg-red-50 border-red-400 text-red-800" : "bg-muted/20 border-transparent hover:border-red-200")}
              >
                <span className="mr-2">{caregiverConcern ? "⚠ " : "○ "}</span>
                Parent/caregiver has a specific concern about vision, hearing, or development
              </button>
            </CardContent>
          </Card>

          {/* Summary */}
          {tier && (missedCount > 0 || hasRedFlags || regression || caregiverConcern) && (
            <Card className={cn("rounded-3xl border-2",
              tier === "refer" ? "border-red-200 bg-red-50 text-red-700" :
              tier === "monitor" ? "border-amber-200 bg-amber-50 text-amber-700" :
              "border-emerald-200 bg-emerald-50 text-emerald-700"
            )}>
              <CardContent className="pt-4 pb-4 space-y-1">
                <p className="font-black">
                  {tier === "refer" ? "Developmental Concern — Refer for Formal Assessment" :
                   tier === "monitor" ? "Monitor Closely — Rescreen Soon" : "On Track"}
                </p>
                <p className="text-sm opacity-80">
                  {hasRedFlags ? `${redFlags.length} red flag(s) present. ` : ""}
                  {missedCount > 0 ? `${missedCount} of ${totalMilestones} milestone(s) not met across ${domainsAffected} domain(s). ` : ""}
                  {regression ? "Regression reported — always urgent regardless of other findings. " : ""}
                </p>
                {tier === "refer" && (
                  <p className="text-sm opacity-90 pt-1">
                    {isGlobalPattern
                      ? "Delay spans ≥ 2 domains (possible global developmental delay) — refer for comprehensive developmental evaluation and consider medical workup (genetics, metabolic, hearing, and, if indicated, neuroimaging) alongside early intervention referral."
                      : "Refer for developmental evaluation; if delay is isolated to a single domain, a targeted referral (e.g. speech-language pathology for isolated language delay, PT/OT for isolated motor delay) may be appropriate alongside broader surveillance."}
                    {" "}For children under 3 years, refer to your early intervention (Part C-equivalent) program; for 3–5 years, refer for school-based evaluation.
                  </p>
                )}
                {tier === "monitor" && (
                  <p className="text-sm opacity-90 pt-1">
                    Delay is isolated to one domain and no red flags are present — provide targeted anticipatory guidance and rescreen in 4–6 weeks. Refer if the pattern persists or widens.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Milestones grouped by domain */}
          <Card className="rounded-3xl border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <ClipboardList className="h-4 w-4" /> Milestones at {ageGroup.label}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Mark any milestones the child has NOT yet achieved</p>
            </CardHeader>
            <CardContent className="space-y-5">
              {milestonesByDomain.map(({ domain, items }) => {
                const domainMissed = items.filter(m => notMet.includes(m.text)).length;
                return (
                  <div key={domain} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={cn("shrink-0 px-2 py-0.5 rounded-full text-xs font-black", DOMAIN_COLORS[domain])}>{domain}</span>
                      {domainMissed > 0 && (
                        <span className="text-[10px] font-bold text-orange-600">{domainMissed}/{items.length} missed</span>
                      )}
                    </div>
                    {items.map(m => (
                      <button
                        key={m.text}
                        onClick={() => toggleMilestone(m.text)}
                        className={cn(
                          "w-full text-left p-3 rounded-2xl border-2 text-sm font-semibold transition-all",
                          notMet.includes(m.text) ? "bg-orange-50 border-orange-300 text-orange-800 line-through" : "bg-muted/20 border-transparent hover:border-primary/30"
                        )}
                      >
                        {m.text}
                      </button>
                    ))}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Red flags */}
          <Card className="rounded-3xl border-2 border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-black text-red-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Age-Specific Red Flags — Immediate Referral if Present
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

          <div className="rounded-2xl bg-muted/30 p-4 text-sm space-y-2">
            <p className="font-black">Summary</p>
            <div className="flex gap-4 flex-wrap">
              <div><span className="text-muted-foreground">Milestones met:</span> <span className="font-bold">{totalMilestones - missedCount} / {totalMilestones}</span></div>
              {hasRedFlags && <Badge className="bg-red-100 text-red-800 font-bold">{redFlags.length} red flag(s)</Badge>}
              {domainsAffected > 0 && (
                <Badge className={cn("font-bold", isGlobalPattern ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800")}>
                  {domainsAffected} domain{domainsAffected > 1 ? "s" : ""} affected{isGlobalPattern ? " (global pattern)" : ""}
                </Badge>
              )}
              {regression && <Badge className="bg-red-100 text-red-800 font-bold">Regression reported</Badge>}
            </div>
          </div>
        </>
      )}

      <Alert className="rounded-2xl border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 text-sm">
          <strong>Regression (loss of skills)</strong> is always a red flag at any age, independent of the milestone count. Refer urgently
          if a child loses previously acquired language, motor, or social skills — consider Rett syndrome, Landau-Kleffner syndrome,
          metabolic/neurodegenerative disorders, or an epileptic encephalopathy (e.g. infantile spasms) in the differential.
        </AlertDescription>
      </Alert>

      <Separator />

      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p>
          Reference: CDC "Learn the Signs. Act Early." (2022 revision, 75th-percentile milestones) &middot;
          AAP/Bright Futures 4th Edition periodicity schedule &middot;
          AAP Council on Children with Disabilities clinical report on developmental surveillance and screening &middot;
          M-CHAT-R/F (Robins, Fein &amp; Barton) for autism-specific screening at 18 &amp; 24 months.
        </p>
        <p>Domain-level delay grouping (isolated vs. global) is this tool's own heuristic to guide referral framing — it is not a validated scoring algorithm.</p>
      </div>
    </div>
  );
}
