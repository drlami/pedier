import { useMemo, useState } from "react";
import { Syringe, ArrowLeft, Search, Info, AlertTriangle, CheckCircle2, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

/**
 * Sedation agent selection by patient condition — qualitative reference
 * only, no dosing.
 *
 * Two modes cover two different clinical problems:
 * - Procedural: single/brief dosing for a discrete procedure. Sources: ACEP
 *   Clinical Policy for procedural sedation/analgesia (Godwin 2014, Ann Emerg
 *   Med); AAP/AAPD sedation guideline; PALS teaching; condition-specific
 *   literature cited per item. Raised-ICP guidance reflects 2024-2025
 *   meta-analyses (ketamine/ICP), reversing older teaching. Porphyria
 *   guidance reflects the American Porphyria Foundation drug-safety database
 *   and drugs-porphyria.org (NAPOS) — these two sources do not fully agree on
 *   benzodiazepines or ketamine, flagged explicitly rather than resolved.
 * - PICU ventilator: continuous infusion agent choice by underlying disease,
 *   for a child sedated on a ventilator (not a one-off procedure). Sources:
 *   SCCM PANDEM 2022 guideline (Pediatric Critical Care Medicine, 44
 *   recommendations); PALICC-2 2023; disease-specific literature cited per
 *   item. Deliberately does not duplicate the app's existing COMFORT-B/SBS
 *   depth-of-sedation scoring or the Sedation Dosing & Weaning calculator
 *   (dosing, front-loaded taper schedules, WAT-1 monitoring) — this section
 *   only answers "which agent to start", not "how deep" or "how to wean".
 */

type Status = "settled" | "evolving" | "disputed" | "limited-evidence";

const STATUS_META: Record<Status, { label: string; color: string; icon: any }> = {
  settled:          { label: "Consensus",           color: "bg-emerald-600", icon: CheckCircle2 },
  evolving:         { label: "Teaching Has Changed", color: "bg-blue-600",    icon: Info },
  disputed:         { label: "Sources Disagree",     color: "bg-red-600",     icon: AlertTriangle },
  "limited-evidence": { label: "Limited Evidence — Extrapolated", color: "bg-slate-500", icon: Info },
};

interface Condition {
  id: string;
  name: string;
  status: Status;
  preferred: string[];
  caution: string[];
  avoid: string[];
  rationale: string;
  note?: string;
  sources: string;
}

const PROCEDURAL_CONDITIONS: Condition[] = [
  {
    id: "asthma",
    name: "Reactive Airway Disease / Asthma",
    status: "settled",
    preferred: ["Ketamine — bronchodilates via catecholamine release, preserves airway reflexes and spontaneous ventilation"],
    caution: ["Fentanyl if an opioid is needed"],
    avoid: ["Morphine — histamine release can worsen bronchospasm"],
    rationale: "Ketamine is the standard first-line agent for procedural sedation in known reactive airway disease.",
    sources: "PMC10132230; OpenAnesthesia",
  },
  {
    id: "chd",
    name: "Congenital / Cyanotic Heart Disease (Structural)",
    status: "settled",
    preferred: ["Ketamine — minimal effect on PVR/SVR/HR at standard doses", "Etomidate — near-neutral haemodynamics, single-dose induction"],
    caution: ["Propofol boluses — vasodilation + myocardial depression; caution in poor cardiac reserve"],
    avoid: ["Ketamine in hypertrophic (obstructive) cardiomyopathy or severe dynamic LVOT obstruction — catecholamine surge worsens the obstruction"],
    rationale: "Ketamine is generally the preferred agent in structural CHD, but that preference reverses specifically in dynamic outflow obstruction. For an acutely shocked patient (septic, cardiogenic, hypovolaemic), see the dedicated shock entries below — agent choice differs meaningfully by shock aetiology.",
    sources: "Loomba 2018, Congenital Heart Disease; OpenAnesthesia (HOCM); JCVA; StatPearls (etomidate)",
  },
  {
    id: "septic-shock",
    name: "Septic Shock (Distributive)",
    status: "disputed",
    preferred: ["Ketamine — haemodynamically stable; increasingly used as an etomidate alternative for RSI in septic shock, with comparable outcomes in a 2023 RCT"],
    caution: ["Etomidate — inhibits 11β-hydroxylase, causing adrenal suppression that persists 24–72h. Meta-analyses genuinely conflict: one links single-dose etomidate to higher adrenal insufficiency AND mortality in sepsis; a more recent one confirms adrenal insufficiency but finds no mortality difference. Still widely used, often with hydrocortisone coverage — treat as caution, not an outright ban."],
    avoid: ["Propofol boluses — vasodilation compounds distributive shock"],
    rationale: "This is a genuinely unresolved controversy, not settled teaching. Ketamine sidesteps the debate entirely and is a reasonable default; etomidate remains widely used but the adrenal-suppression question is real and unresolved in the literature.",
    sources: "Sci Rep 2023 (Srivilaithon RCT); J Thorac Dis — the etomidate-in-sepsis dilemma; PMC2206408",
  },
  {
    id: "cardiogenic-shock",
    name: "Cardiogenic Shock / Myocarditis (incl. Kawasaki Disease Shock Syndrome)",
    status: "settled",
    preferred: ["Etomidate — near-neutral haemodynamics; its adrenal-suppression concern is specifically tied to the septic-shock literature, not cardiogenic shock — remains a reasonable RSI choice here"],
    caution: ["Ketamine — its direct myocardial depressant effect is normally masked by a sympathomimetic (catecholamine-releasing) action, but that masking can fail in catecholamine-depleted/exhausted shock: documented cardiac index ↓21% and PCWP ↑20% in patients with impaired LV function. Can occasionally worsen rather than support haemodynamics — not automatically safe just because it usually is elsewhere."],
    avoid: ["Propofol — myocardial depression plus vasodilation, poorly tolerated with reduced ejection fraction"],
    rationale: "Etomidate is generally preferred here specifically because the adrenal-suppression signal that complicates its use in septic shock has not been shown in cardiogenic shock; ketamine's usual haemodynamic-support reputation is less reliable once catecholamine reserves are exhausted.",
    note: "Kawasaki Disease Shock Syndrome specifically has no dedicated sedation-choice literature — even general Kawasaki-disease anaesthesia literature is limited to sporadic case reports. The guidance above is extrapolated from general myocarditis/cardiogenic-shock principles (KDSS commonly features myocarditis, reduced LV function, capillary leak, and higher coronary-artery involvement), not evidence specific to KDSS itself.",
    sources: "PubMed 9209606 (ketamine in catecholamine-dependent heart failure); PMC1751005 (etomidate/adrenal suppression); JCVA (adrenocortical suppression); PMC2848476 (KDSS recognition); PMC5881329 (KD and general anaesthesia)",
  },
  {
    id: "hypovolemic-shock",
    name: "Hypovolaemic / Haemorrhagic Shock",
    status: "settled",
    preferred: ["Ketamine — standard/preferred for RSI in hypotensive trauma, preload-independent haemodynamic support"],
    caution: ["Reduce ketamine dose ≥50% when shock index >0.8 — even ketamine can drop MAP/cardiac output in severe hypovolaemia via the same catecholamine-depletion mechanism seen in cardiogenic shock; it is not automatically safe at full dose regardless of severity", "Benzodiazepines — compound hypotension, reduce dose or avoid"],
    avoid: ["Propofol / thiopentone — significant hypotension via vasodilation in a preload-dependent state"],
    rationale: "Ketamine is standard for hypotensive trauma, but 'ketamine is safe in shock' is a half-truth without the dose caveat — dose low as shock severity increases.",
    sources: "IntechOpen — Ketamine in Trauma; joint EMS position statement on ketamine in trauma; REBEL EM — dosing sedatives low in shock",
  },
  {
    id: "anaphylactic-shock",
    name: "Anaphylactic Shock",
    status: "limited-evidence",
    preferred: ["Ketamine — extrapolated from its general bronchodilation and haemodynamic-support profile, relevant given concurrent bronchospasm/hypotension in anaphylaxis"],
    caution: ["Morphine — extrapolated avoidance due to histamine release compounding an already mast-cell-mediated process"],
    avoid: [],
    rationale: "No literature was found directly comparing sedation agents in anaphylaxis airway management specifically — this guidance is extrapolated from general pharmacology, not dedicated trials.",
    note: "The bigger clinical point: the real threat in anaphylaxis airway management is rapidly progressive laryngeal oedema that can make intubation impossible altogether. Drug choice is secondary to speed, technique, and backup-airway planning — and epinephrine, not sedation choice, is the actual life-saving intervention.",
    sources: "PMC6526883 (ketamine and airway management); Medscape — Anaphylaxis Treatment",
  },
  {
    id: "icp",
    name: "Raised ICP / Head Injury",
    status: "evolving",
    preferred: ["Ketamine with controlled ventilation — especially favoured in trauma with hypotension risk", "Propofol or thiopental where haemodynamics allow — reduce CMRO₂/ICP"],
    caution: ["Any agent causing hypotension in a patient who is already hypotensive — secondary injury risk from reduced cerebral perfusion pressure, independent of drug choice"],
    avoid: [],
    rationale: "Older teaching avoided ketamine in raised ICP on the assumption it raises ICP. 2024-2025 meta-analyses (including paediatric TBI data) found no clinically significant ICP rise with controlled ventilation — ketamine's haemodynamic stability is now often preferred, particularly when hypotension is a concern.",
    note: "If you trained before ~2015, this directly contradicts what you were taught — the reversal is recent and worth knowing.",
    sources: "PubMed 39512554 (2024 meta-analysis); PubMed 41197253 (2025 SR/meta-analysis, n=886); Vanderbilt paediatric TBI ICP study",
  },
  {
    id: "seizure",
    name: "Seizure Disorder / Epilepsy",
    status: "settled",
    preferred: ["Propofol", "Midazolam — both anticonvulsant, used in refractory status epilepticus"],
    caution: [
      "Ketamine — widely used and often considered neuroprotective, but isolated case reports of seizure activity exist in predisposed patients; treat as 'generally acceptable', not a clean safety guarantee",
      "Etomidate — myoclonus is common and usually non-epileptiform but can be mistaken for seizure activity",
    ],
    avoid: ["Meperidine — normeperidine lowers seizure threshold (the agent is largely obsolete in paediatric sedation regardless)"],
    rationale: "Propofol and midazolam are the clear first choice when seizure risk is a specific concern for the procedure.",
    sources: "PMC11573176; PubMed 33957739; PMC4677539 (meperidine)",
  },
  {
    id: "hepatic",
    name: "Hepatic Impairment",
    status: "settled",
    preferred: ["Fentanyl over morphine", "Propofol — extrahepatic clearance sites give it a short context-sensitive half-time even in liver disease"],
    caution: [
      "Midazolam — hepatic clearance falls roughly 50%, half-life can run to 2.5× longer in cirrhosis; dose-reduce",
      "Ketamine — active metabolite (norketamine); caution in severe failure",
    ],
    avoid: [],
    rationale: "This is mostly a dose-adjustment problem rather than an absolute avoidance — agents cleared hepatically simply accumulate and prolong sedation.",
    note: "Paediatric-specific: propofol infusion syndrome (PRIS) is a risk with prolonged/continuous infusion, not a brief single procedural dose — avoid infusions (not single doses) in hepatic impairment.",
    sources: "PMC5634622",
  },
  {
    id: "renal",
    name: "Renal Impairment",
    status: "settled",
    preferred: ["Fentanyl — no active metabolites"],
    avoid: [
      "Morphine — active metabolite (M6G) accumulates, up to 40× the potency of the parent drug, half-life up to 27h in renal failure",
      "Meperidine — normeperidine accumulation (largely obsolete agent regardless)",
    ],
    caution: ["Midazolam — active metabolite also accumulates in renal failure, causing prolonged sedation"],
    rationale: "Morphine and meperidine both have renally-cleared active metabolites that accumulate; fentanyl has none and is preferred.",
    sources: "Journal of Pain and Symptom Management (M6G); Lancet 1995 (midazolam case series)",
  },
  {
    id: "obesity-osa",
    name: "Obesity / Obstructive Sleep Apnoea",
    status: "settled",
    preferred: ["Dexmedetomidine — preserves respiratory drive and airway tone, mimics natural sleep physiology"],
    caution: [
      "Opioid + benzodiazepine combinations — elevated apnoea/obstruction risk, use cautiously with close monitoring",
      "Propofol — dose by lean body weight, not total body weight",
    ],
    avoid: [],
    rationale: "Dexmedetomidine is favoured for its respiratory-sparing profile, but it still potentiates opioid-related respiratory depression and independently causes hypotension/bradycardia — it is not risk-free.",
    sources: "PMC6464086",
  },
  {
    id: "ex-preterm",
    name: "Ex-Preterm Infant / Neonate (Apnoea Risk)",
    status: "settled",
    preferred: ["Minimum effective dose of the shortest-acting suitable agent"],
    avoid: ["Combined opioid + benzodiazepine — compounds apnoea risk"],
    caution: [],
    rationale: "Post-sedation apnoea risk is a gradient with postconceptional age (PCA), not a single cutoff: roughly 60% risk below 42 weeks PCA, declining to about 10% by beyond 52 weeks. Extended monitoring (12h+) is commonly recommended below ~46 weeks PCA, or below ~60 weeks PCA if additional risk factors are present (chronic lung disease, prior apnoea, anaemia) — exact institutional thresholds vary.",
    sources: "OpenAnesthesia; PMC4268838",
  },
  {
    id: "full-stomach",
    name: "Non-Fasted / Full Stomach / Aspiration Risk",
    status: "settled",
    preferred: ["Ketamine — preserves airway protective reflexes, unlike propofol or benzodiazepines"],
    caution: [],
    avoid: [],
    rationale: "Ketamine is mechanistically favoured for higher aspiration-risk scenarios. However, per ACEP clinical policy (Level B), urgent sedation should not be delayed on the basis of fasting status alone — fasting duration has not been shown to reduce aspiration/emesis risk in procedural sedation studies.",
    sources: "ACEP Clinical Policy (PubMed 24438649); ACEP Now",
  },
  {
    id: "mh",
    name: "Malignant Hyperthermia Risk / Family History",
    status: "settled",
    preferred: ["Propofol, ketamine, benzodiazepines, opioids, and dexmedetomidine — all MH-non-triggering"],
    caution: [],
    avoid: ["Volatile inhalational anaesthetics and succinylcholine — the only two true MH triggers"],
    rationale: "Standard IV procedural sedation agents carry no MH risk. The true triggers are volatile anaesthetic gases and succinylcholine, neither of which is used in typical ED/ward procedural sedation — don't withhold routine sedation agents over MH history.",
    sources: "StatPearls — Malignant Hyperthermia",
  },
  {
    id: "porphyria",
    name: "Acute Porphyria (e.g. Acute Intermittent Porphyria)",
    status: "disputed",
    preferred: ["Propofol", "Fentanyl — the two most consistently rated safe agents across porphyria drug databases"],
    avoid: ["Barbiturates (e.g. thiopental) — classic strong trigger", "Etomidate — consensus unsafe"],
    caution: [
      "Ketamine — commonly assumed safe, but porphyria drug databases actually rate it BAD / avoid-leaning, with sources in outright conflict. Do not treat as routinely safe.",
      "Midazolam / diazepam — genuinely disputed: possibly porphyrinogenic per some databases, rated safe by others",
    ],
    rationale: "Classifications for ketamine and benzodiazepines genuinely conflict between specialist porphyria databases. Given that acute attacks can be life-threatening, check a live database (drugs-porphyria.org / NAPOS, or a national porphyria centre) or get specialist input before sedating a known or suspected acute porphyria patient — don't rely on this page alone for that decision.",
    sources: "American Porphyria Foundation drug database; drugs-porphyria.org (NAPOS)",
  },
];

const PICU_CONDITIONS: Condition[] = [
  {
    id: "ards-pards",
    name: "ARDS / PARDS (Severe Respiratory Failure)",
    status: "limited-evidence",
    preferred: [
      "Fentanyl infusion as the primary opioid — no PARDS-specific trial supports this over morphine, but its hemodynamically stable, rapid-onset, titratable profile (vs morphine's histamine-release-related hypotension) is generally preferred when high PEEP/intrathoracic pressure is reducing venous return, which is common in severe PARDS",
      "Dexmedetomidine as adjunct/primary per general PANDEM guidance",
    ],
    caution: [
      "Morphine — still a reasonable, commonly used alternative to fentanyl, but its histamine-release/hypotension risk is a real caution if the child is at all hemodynamically borderline",
      "Benzodiazepines — minimise when feasible (Strong recommendation, general PICU population) to reduce delirium risk; still used for deep sedation/ventilator-synchrony needs but not first-line",
    ],
    avoid: [],
    rationale: "PALICC-2 (2023) addresses neuromuscular blockade titration but no PARDS-specific sedative-agent preference could be confirmed in its guideline text. The fentanyl-over-morphine framing here is general ICU pharmacology (already used elsewhere in this app's own dosing tools), not PARDS-specific evidence.",
    note: "This entry is 'apply general ICU-liberation principles', not a disease-specific evidence base — a PALICC-2-specific sedative-agent recommendation could not be found despite directly searching for one.",
    sources: "PALICC-2 2023 (NMB titration only, not sedative-agent-specific); SCCM PANDEM 2022",
  },
  {
    id: "status-asthmaticus-vent",
    name: "Status Asthmaticus / Severe Bronchospasm (Ventilated)",
    status: "limited-evidence",
    preferred: ["Ketamine infusion as adjunct — bolus ~2 mg/kg then 20–60 mcg/kg/min alongside standard bronchodilator therapy; case series show reduced need for escalation"],
    caution: [],
    avoid: [],
    rationale: "Used in practice for refractory bronchospasm requiring ventilation, but the evidence is observational/case-series only, not RCT-proven — treat as a reasonable adjunct, not a settled first-line monotherapy.",
    sources: "PMC3777369; continuous ketamine infusion in refractory bronchospasm (Springer)",
  },
  {
    id: "icp-tbi-vent",
    name: "Raised ICP / Severe TBI (Ventilated)",
    status: "settled",
    preferred: [
      "Fentanyl infusion as the primary opioid — avoids morphine's histamine-mediated hypotension, which matters more here than almost anywhere else: cerebral perfusion pressure = MAP − ICP, so any drop in MAP directly threatens the brain",
      "Midazolam infusion or dexmedetomidine as the depth-of-sedation adjunct on top of the fentanyl backbone",
    ],
    caution: [
      "Continuous propofol infusion — PRIS risk limits routine use here despite its ICP-lowering properties; some paediatric ICUs avoid it for continuous infusion altogether. Reserved, alongside thiopental, as third-tier 'anaesthetic dosing' with neuromuscular blockade for refractory intracranial hypertension only.",
      "Morphine — usable, but its hypotension risk is a more direct hazard here than in most other contexts on this page",
    ],
    avoid: ["Daily sedation interruption ('sedation vacation') — do not apply general ICU-liberation practice to this population. The RCTs supporting interruption excluded severe brain injury patients, and even within trial protocols interruption was withheld on 34% of days specifically when ICP was elevated or the patient was haemodynamically unstable. The evidence for interruption does not transfer to raised ICP."],
    rationale: "This is the clearest exception to standard 'minimise sedation, interrupt daily' ICU-liberation teaching — interruption evidence explicitly excludes this population, and abruptly lightening sedation risks dangerous ICP spikes.",
    note: "One paediatric-TBI-specific source reports fentanyl+midazolam — the exact combination named above as standard — were 'ineffective' at treating episodic intracranial hypertension in their cohort, and that continuous propofol was often unavailable/unused in their PICU. Treat this as one contrarian source raising a real question, not as consensus practice.",
    sources: "PMC4857238 (sedation interruption in acute brain injury); PMC4793412 (analgesia/sedation/ICP in paediatric TBI)",
  },
  {
    id: "post-cardiac-surgery-vent",
    name: "Post-Cardiac Surgery / Low Cardiac Output Syndrome",
    status: "settled",
    preferred: ["Dexmedetomidine as primary sedative — Strong recommendation, Moderate evidence (SCCM PANDEM 2022) for patients with expected early extubation; also suggested to reduce post-operative tachyarrhythmia risk (Conditional, Low)"],
    caution: [],
    avoid: ["Propofol boluses/infusion — vasodilation and myocardial depression poorly tolerated in low cardiac output"],
    rationale: "This is one of the strongest, most specific recommendations in the entire PANDEM guideline — dexmedetomidine is explicitly named as first choice for this population, not just a reasonable option.",
    sources: "SCCM PANDEM 2022 (Guideline Central summary)",
  },
  {
    id: "septic-shock-vent",
    name: "Septic Shock (Ventilated, Continuous Infusion)",
    status: "settled",
    preferred: [
      "Fentanyl infusion as the primary opioid — avoids morphine's histamine-mediated vasodilation/hypotension, which directly compounds distributive shock",
      "Dexmedetomidine or ketamine as an opioid-sparing adjunct",
    ],
    caution: [
      "Morphine — usable, but its histamine-release hypotension risk is a more direct hazard in a shocked patient than elsewhere",
      "Short-term propofol (<48h, <4 mg/kg/h) may be acceptable per PANDEM, particularly during weaning — a narrower allowance than routine continuous use",
    ],
    avoid: ["Continuous propofol infusion beyond short-term limits — sepsis is a specifically documented Propofol Infusion Syndrome (PRIS) risk factor: the catecholamine/glucocorticoid surge in sepsis alters propofol clearance and predisposes to PRIS independent of the general dose/duration thresholds (classic threshold: >48h AND >4 mg/kg/h). This compounds with the vasodilation already dangerous in shock — a distinct, stronger concern than the single-dose procedural context covered above."],
    rationale: "Continuous propofol in ventilated septic shock carries a documented mechanism for added harm beyond the general PRIS threshold, not just the usual vasodilation caution.",
    sources: "PMC9671386 (PRIS clinical review); SCCM PANDEM 2022",
  },
  {
    id: "neuromuscular-vent",
    name: "Neuromuscular Disease / Preserved Exam Needs (e.g. Guillain-Barré, Myasthenic Crisis)",
    status: "limited-evidence",
    preferred: ["Dexmedetomidine — arousable/cooperative sedation preserves the ability to perform a meaningful neurological exam"],
    caution: ["Benzodiazepines and deep sedation generally — can mask worsening weakness or respiratory decline that needs to be caught early in these diseases"],
    avoid: [],
    rationale: "No dedicated GBS/myasthenia-specific trial data exists for this — the recommendation is extrapolated from dexmedetomidine's general exam-preserving profile (well documented specifically in TBI) applied by extension, not disease-specific evidence.",
    sources: "PubMed 20198514 (dexmedetomidine and exam preservation, TBI)",
  },
  {
    id: "burns-vent",
    name: "Major Burns (Ventilated, Repeated Painful Procedures)",
    status: "settled",
    preferred: ["Ketamine — specifically recommended for burn dressing changes (dedicated guideline exists)", "Methadone rotation — considered early given unusually rapid tolerance to standard opioids in burn patients"],
    caution: ["Standard opioid/benzodiazepine infusions — expect rapid tolerance requiring faster dose escalation than in other PICU populations; plan for rotation/methadone conversion earlier than usual"],
    avoid: [],
    rationale: "Burn patients develop tolerance to both opioids and benzodiazepines unusually quickly with repeated procedures — anticipate this rather than reacting to it after escalating doses stop working.",
    sources: "Burns & Trauma (Springer); Ketamine for Burn Dressings guideline (surgicalcriticalcare.net)",
  },
  {
    id: "post-arrest-hypothermia",
    name: "Post-Cardiac Arrest / Therapeutic Hypothermia",
    status: "settled",
    preferred: ["Fentanyl + midazolam infusion is the typical starting combination — but titrate to effect from a low starting rate rather than dosing at usual weight-based rates, given the accumulation described below"],
    caution: ["Fentanyl and midazolam clearance both fall during hypothermia — hepatic CYP450 activity drops roughly 7–22% per °C below 37°C, cutting fentanyl clearance ~20% and midazolam ~17%. Drug accumulation and prolonged effect should be expected and can persist beyond 4–5 days, spanning both the cooling and rewarming phases.", "Shivering suppression may require additional sedation or neuromuscular blockade"],
    avoid: [],
    rationale: "Hypothermia's effect on drug clearance is quantified and clinically meaningful — under-dosing to compensate risks inadequate sedation, but standard dosing risks significant accumulation; titrate carefully rather than using standard weight-based rates unchanged.",
    sources: "PubMed 27622966 (hypothermia and drug disposition post-cardiac arrest)",
  },
  {
    id: "prolonged-vent-delirium",
    name: "Prolonged Ventilation / Difficult Wean (Delirium-Avoidance Goals)",
    status: "settled",
    preferred: ["Dexmedetomidine as primary or adjunct agent — PANDEM suggests alpha-2 agonists as a primary sedative class generally (Conditional, Low), and it lowers delirium risk while facilitating earlier extubation"],
    caution: [],
    avoid: ["Benzodiazepines — an independent, modifiable, dose-response risk factor for paediatric delirium (adjusted OR 1.12 per midazolam mg/kg-equivalent per prior day); minimise wherever feasible"],
    rationale: "Benzodiazepine exposure is one of the best-evidenced modifiable delirium risk factors in paediatric critical care — a Strong/Moderate PANDEM recommendation, not a weak one.",
    note: "Daily sedation interruption is NOT suggested by PANDEM for the general PICU population either (Conditional, Low — no demonstrated outcome benefit) — a different reason from the raised-ICP entry above, where interruption is avoided for patient safety (ICP spikes), not lack of benefit.",
    sources: "Smith et al., Critical Care Medicine — benzodiazepines and paediatric delirium (adjusted OR 1.12); PMC9269883 (PICU delirium risk-factor meta-analysis); SCCM PANDEM 2022",
  },
];

interface WithdrawalProfile {
  id: string;
  agent: string;
  profile: string;
  data: string;
}

const WITHDRAWAL_PROFILES: WithdrawalProfile[] = [
  {
    id: "opioid-benzo",
    agent: "Opioids & Benzodiazepines",
    profile: "The best-characterised withdrawal risk, dose- and duration-dependent. Already covered in full by the app's Sedation Dosing & Weaning calculator (duration-of-exposure risk bands from <5 days low-risk to >14 days very-high-risk, front-loaded taper schedules, WAT-1 monitoring cutoffs).",
    data: "See the Sedation Dosing & Weaning calculator for taper scheduling — not duplicated here.",
  },
  {
    id: "dexmedetomidine-rebound",
    agent: "Dexmedetomidine",
    profile: "A distinct rebound phenomenon, not classic opioid/benzodiazepine withdrawal — sympathetic hyperactivity (confusion, agitation, tachycardia, hypertension, diaphoresis, tremor). Clonidine transition protocols exist specifically to manage this. Don't stop abruptly after prolonged or high-dose use.",
    data: "~35% withdrawal incidence in infusion courses >48h (24/68 courses in one series); of those, ~87% showed rebound hypertension (47/54).",
  },
  {
    id: "ketamine-propofol",
    agent: "Ketamine & Propofol",
    profile: "No dedicated paediatric withdrawal-characterisation literature was found for either agent — treat as 'not well established', not as 'no risk'. Wean gradually as routine practice regardless of the lack of a named syndrome.",
    data: "Absence of evidence, not evidence of absence — do not assume these are withdrawal-free.",
  },
];

function TagList({ items, tone }: { items: string[]; tone: "preferred" | "caution" | "avoid" }) {
  if (items.length === 0) return null;
  const toneMap = {
    preferred: { badge: "bg-emerald-600", label: "Preferred" },
    caution:   { badge: "bg-yellow-500",  label: "Caution / Dose-Adjust" },
    avoid:     { badge: "bg-red-600",     label: "Avoid" },
  } as const;
  const t = toneMap[tone];
  return (
    <div className="space-y-1.5">
      <Badge className={cn("text-[10px] font-black uppercase tracking-wide px-2 py-0.5", t.badge)}>{t.label}</Badge>
      <ul className="space-y-1 pl-1">
        {items.map((item, i) => (
          <li key={i} className="text-xs leading-relaxed text-foreground/90 flex gap-2">
            <span className="text-muted-foreground">•</span><span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type Mode = "procedural" | "picu";

export default function SedationSelectorPage() {
  const [mode, setMode] = useState<Mode>("procedural");
  const [query, setQuery] = useState("");

  const dataset = mode === "procedural" ? PROCEDURAL_CONDITIONS : PICU_CONDITIONS;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return dataset;
    return dataset.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.preferred.some(x => x.toLowerCase().includes(q)) ||
      c.avoid.some(x => x.toLowerCase().includes(q)) ||
      c.caution.some(x => x.toLowerCase().includes(q)) ||
      (c.note?.toLowerCase().includes(q) ?? false)
    );
  }, [query, dataset]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 pb-32">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary active:scale-95">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-4 rounded-3xl bg-slate-700 text-white shadow-xl shadow-slate-200">
          <Syringe className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tight">Sedation Agent Selector</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest mt-1">
            {mode === "procedural" ? "Preferred / Avoid by Patient Condition" : "Continuous Ventilator Sedation by Disease"}
          </p>
        </div>
      </div>

      {/* Mode switcher */}
      <div className="flex rounded-xl border border-slate-300 bg-slate-50 p-1 mb-6 w-fit gap-1">
        <button
          onClick={() => { setMode("procedural"); setQuery(""); }}
          className={cn(
            "px-5 py-2 rounded-lg text-sm font-bold transition-all",
            mode === "procedural" ? "bg-white shadow text-slate-800 shadow-slate-200" : "text-muted-foreground hover:text-slate-700"
          )}
        >
          Procedural Sedation
        </button>
        <button
          onClick={() => { setMode("picu"); setQuery(""); }}
          className={cn(
            "px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5",
            mode === "picu" ? "bg-white shadow text-slate-800 shadow-slate-200" : "text-muted-foreground hover:text-slate-700"
          )}
        >
          <Activity className="h-3.5 w-3.5" /> PICU Ventilator Sedation
        </button>
      </div>

      {mode === "procedural" ? (
        <Alert className="mb-6 border-2 bg-muted/30">
          <Info className="h-4 w-4" />
          <AlertTitle className="text-xs font-black uppercase tracking-wide">Reference Only — No Dosing</AlertTitle>
          <AlertDescription className="text-xs leading-relaxed">
            Qualitative agent-selection guidance for common comorbidities affecting procedural sedation choice — not a dosing tool
            (see PediaDose / Resuscitation Dosing for doses) and not a substitute for anaesthesiology, toxicology, or specialist input
            in ambiguous or high-risk cases. Where sources disagree, that's stated explicitly rather than resolved for you.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="mb-6 border-2 bg-muted/30">
          <Info className="h-4 w-4" />
          <AlertTitle className="text-xs font-black uppercase tracking-wide">Agent Choice Only — Not Dosing or Depth</AlertTitle>
          <AlertDescription className="text-xs leading-relaxed">
            Which agent to start for a child sedated on a ventilator, by underlying disease — not for a one-off procedure (see the
            Procedural Sedation tab for that). For dosing, front-loaded taper schedules, and WAT-1 withdrawal monitoring, use the
            Sedation Dosing & Weaning calculator; for depth-of-sedation targets, use the COMFORT-B / SBS scales — both already exist
            elsewhere in this app and aren't duplicated here. Not a substitute for PICU/anaesthesiology specialist input.
          </AlertDescription>
        </Alert>
      )}

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search condition or agent…"
          className="pl-9 h-11 border-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <Card className="border-2 shadow-sm">
        <CardContent className="pt-2 pb-0 px-4">
          <Accordion type="multiple" className="w-full">
            {filtered.map((c) => {
              const meta = STATUS_META[c.status];
              const StatusIcon = meta.icon;
              return (
                <AccordionItem key={c.id} value={c.id}>
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <div className="flex items-center gap-3 flex-1 pr-2">
                      <span className="font-bold text-sm">{c.name}</span>
                      <Badge className={cn("text-[9px] font-black uppercase tracking-wide px-2 py-0.5 gap-1 shrink-0", meta.color)}>
                        <StatusIcon className="h-3 w-3" /> {meta.label}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 px-1">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <TagList items={c.preferred} tone="preferred" />
                        <TagList items={c.caution} tone="caution" />
                        <TagList items={c.avoid} tone="avoid" />
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground border-t pt-3">{c.rationale}</p>
                      {c.note && (
                        <p className="text-xs leading-relaxed font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-3">
                          {c.note}
                        </p>
                      )}
                      <p className="text-[10px] text-muted-foreground/70 font-mono">Sources: {c.sources}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No matching condition or agent.</p>
          )}
        </CardContent>
      </Card>

      {mode === "picu" && (
        <Card className="border-2 shadow-sm mt-6">
          <CardHeader className="pb-3 border-b bg-muted/20">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" /> Expected Withdrawal by Agent Class
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {WITHDRAWAL_PROFILES.map((w) => (
              <div key={w.id} className="p-4 rounded-2xl bg-muted/30 border space-y-1.5">
                <p className="text-sm font-black">{w.agent}</p>
                <p className="text-xs leading-relaxed text-foreground/90">{w.profile}</p>
                <p className="text-[11px] font-bold text-muted-foreground">{w.data}</p>
              </div>
            ))}
            <p className="text-[10px] text-muted-foreground/70 font-mono">
              Sources: PMC3017408 (dexmedetomidine withdrawal); JPPT 25(4) (clonidine transition protocol)
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
