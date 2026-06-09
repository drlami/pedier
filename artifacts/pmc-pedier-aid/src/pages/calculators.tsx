import { useState, useMemo, useEffect } from "react";
import {
  Calculator, Search, Droplets, Activity, Brain,
  Baby, Thermometer, FlaskConical, Flame, ArrowRight,
  Info, Wind, Stethoscope, TrendingUp, HeartPulse, ShieldAlert, Ruler,
  Clock, Scissors, Scale, Calendar, Pin, PinOff, Pill, Apple, TrendingDown,
  Heart, Zap, Syringe, X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const PINNED_ITEMS_KEY = "pmc-pinned-items-v2";

type PinnedItem =
  | { type: "protocol"; id: string }
  | { type: "calculator"; href: string };

type CalcCategory =
  | "Emergency" | "Neonatal" | "Respiratory" | "Neurology"
  | "Cardiology" | "Haematology" | "Fluids" | "Endocrine"
  | "Growth" | "Pharmacology" | "Reference";

interface CalcTool {
  id: string;
  name: string;
  description: string;
  category: CalcCategory;
  icon: any;
  href?: string;
  tags: string[];
  isNew?: boolean;
  comingSoon?: boolean;
}

const CATEGORY_METADATA: Record<CalcCategory, { label: string; icon: any; color: string }> = {
  "Emergency":    { label: "Emergency & Critical Care",   icon: ShieldAlert,  color: "red" },
  "Neonatal":     { label: "Neonatal & Perinatal",         icon: Baby,         color: "blue" },
  "Respiratory":  { label: "Respiratory",                  icon: Wind,         color: "sky" },
  "Neurology":    { label: "Neurology",                    icon: Zap,          color: "violet" },
  "Cardiology":   { label: "Cardiology & ECG",             icon: Heart,        color: "pink" },
  "Haematology":  { label: "Haematology",                  icon: Syringe,      color: "rose" },
  "Fluids":       { label: "Fluids & Nephrology",          icon: Droplets,     color: "cyan" },
  "Endocrine":    { label: "Endocrine & Metabolic",        icon: Flame,        color: "orange" },
  "Growth":       { label: "Growth & Development",         icon: Apple,        color: "emerald" },
  "Pharmacology": { label: "Pharmacology & Antimicrobials",icon: Pill,         color: "purple" },
  "Reference":    { label: "Clinical Reference",           icon: Ruler,        color: "slate" },
};

const categoryOrder: CalcCategory[] = [
  "Emergency", "Neonatal", "Respiratory", "Neurology",
  "Cardiology", "Haematology", "Fluids", "Endocrine",
  "Growth", "Pharmacology", "Reference"
];

function colorClasses(color: string, active: boolean) {
  const map: Record<string, { pill: string; header: string; bg: string }> = {
    red:     { pill: "bg-red-600 text-white border-red-600 shadow-red-200",         header: "bg-red-600 shadow-red-200",     bg: "bg-red-50 text-red-700" },
    blue:    { pill: "bg-blue-600 text-white border-blue-600 shadow-blue-200",       header: "bg-blue-600 shadow-blue-200",   bg: "bg-blue-50 text-blue-700" },
    sky:     { pill: "bg-sky-500 text-white border-sky-500 shadow-sky-200",          header: "bg-sky-500 shadow-sky-200",     bg: "bg-sky-50 text-sky-700" },
    violet:  { pill: "bg-violet-600 text-white border-violet-600 shadow-violet-200", header: "bg-violet-600 shadow-violet-200", bg: "bg-violet-50 text-violet-700" },
    pink:    { pill: "bg-pink-600 text-white border-pink-600 shadow-pink-200",       header: "bg-pink-600 shadow-pink-200",   bg: "bg-pink-50 text-pink-700" },
    rose:    { pill: "bg-rose-600 text-white border-rose-600 shadow-rose-200",       header: "bg-rose-600 shadow-rose-200",   bg: "bg-rose-50 text-rose-700" },
    cyan:    { pill: "bg-cyan-600 text-white border-cyan-600 shadow-cyan-200",       header: "bg-cyan-600 shadow-cyan-200",   bg: "bg-cyan-50 text-cyan-700" },
    orange:  { pill: "bg-orange-500 text-white border-orange-500 shadow-orange-200", header: "bg-orange-500 shadow-orange-200", bg: "bg-orange-50 text-orange-700" },
    emerald: { pill: "bg-emerald-600 text-white border-emerald-600 shadow-emerald-200", header: "bg-emerald-600 shadow-emerald-200", bg: "bg-emerald-50 text-emerald-700" },
    purple:  { pill: "bg-purple-600 text-white border-purple-600 shadow-purple-200", header: "bg-purple-600 shadow-purple-200", bg: "bg-purple-50 text-purple-700" },
    slate:   { pill: "bg-slate-600 text-white border-slate-600 shadow-slate-200",   header: "bg-slate-600 shadow-slate-200", bg: "bg-slate-50 text-slate-700" },
  };
  return map[color] ?? map.slate;
}

const CALCULATORS: CalcTool[] = [
  // â”€â”€ Emergency & Critical Care â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "resus-dosing",
    name: "Resuscitation Dosing",
    description: "High-precision emergency IV doses with mL volume calculation. Covers arrest, RSI, anaphylaxis.",
    category: "Emergency", icon: ShieldAlert,
    href: "/calculators/resuscitation-doses",
    tags: ["code", "arrest", "adrenaline", "pals", "rsi", "emergency"]
  },
  {
    id: "gcs",
    name: "Glasgow Coma Scale",
    description: "Pediatric-adjusted GCS with severity grading and clinical interpretation.",
    category: "Emergency", icon: Brain,
    href: "/calculators/gcs",
    tags: ["neuro", "trauma", "consciousness", "gcs", "altered"]
  },
  {
    id: "abg",
    name: "ABG Interpreter",
    description: "Blood gas analysis with primary disorder, compensation check, and mixed picture detection.",
    category: "Emergency", icon: Wind,
    href: "/calculators/abg-interpreter",
    tags: ["acid-base", "respiratory", "blood-gas", "abg", "alkalosis", "acidosis"]
  },
  {
    id: "parkland",
    name: "Parkland (Burn Fluids)",
    description: "Fluid resuscitation volumes for pediatric thermal burns with 8-hour phased plan.",
    category: "Emergency", icon: Flame,
    href: "/calculators/parkland",
    tags: ["burn", "resuscitation", "fluids", "thermal", "scald"]
  },
  {
    id: "kocher",
    name: "Kocher Criteria",
    description: "Differentiate septic arthritis from transient synovitis of the hip.",
    category: "Emergency", icon: Stethoscope,
    href: "/calculators/kocher-criteria",
    tags: ["ortho", "limping", "joint", "hip", "septic"]
  },
  {
    id: "pews",
    name: "PEWS â€” Pediatric Early Warning Score",
    description: "Structured multi-parameter deterioration score for ward patients with escalation thresholds.",
    category: "Emergency", icon: Activity,
    href: "/calculators/pews",
    tags: ["deterioration", "early-warning", "vital signs", "escalation", "pews", "ward"],
    isNew: true
  },
  {
    id: "appendicitis-score",
    name: "Pediatric Appendicitis Score",
    description: "10-point scoring system with lab data to stratify appendicitis risk and guide imaging.",
    category: "Emergency", icon: Stethoscope,
    href: "/calculators/appendicitis-score",
    tags: ["appendix", "abdominal pain", "rlq", "surgical", "appendicitis", "pas"],
    isNew: true
  },
  {
    id: "phoenix-sepsis",
    name: "Phoenix Sepsis Score (2024)",
    description: "New international pediatric sepsis definition with multi-organ dysfunction scoring.",
    category: "Emergency", icon: ShieldAlert,
    href: "/calculators/phoenix-sepsis",
    tags: ["sepsis", "septic shock", "organ failure", "phoenix", "critical care"],
    isNew: true
  },
  {
    id: "pecarn-head",
    name: "PECARN Head Injury Rule",
    description: "Evidence-based decision tool to identify very low-risk pediatric TBI â€” reduces CT exposure.",
    category: "Emergency", icon: Brain,
    href: "/calculators/pecarn-head",
    tags: ["trauma", "head injury", "tbi", "ct scan", "pecarn", "concussion"],
    isNew: true
  },
  {
    id: "comfort-score",
    name: "COMFORT-B Sedation Scale",
    description: "Validated 6-item ICU sedation and distress assessment for intubated paediatric patients.",
    category: "Emergency", icon: Activity,
    href: "/calculators/comfort-score",
    tags: ["sedation", "icu", "ventilated", "pain", "comfort", "picu"],
    isNew: true
  },
  // â”€â”€ Neonatal & Perinatal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "thompson-hie",
    name: "Thompson HIE Score",
    description: "Score neonatal encephalopathy severity across 9 criteria + integrated cooling eligibility checklist.",
    category: "Neonatal", icon: Brain,
    href: "/calculators/thompson-hie",
    tags: ["hie", "encephalopathy", "cooling", "hypothermia", "neonatal", "seizure"]
  },
  {
    id: "nrp-timer",
    name: "NRP Timer & Log",
    description: "Interactive delivery-room resuscitation timer with APGAR prompts and event log.",
    category: "Neonatal", icon: Clock,
    href: "/calculators/nrp-timer",
    tags: ["neonatal", "resuscitation", "nrp", "delivery", "code"]
  },
  {
    id: "apgar",
    name: "APGAR Score",
    description: "Standardized neonatal assessment at 1, 5 and 10 minutes with clinical guidance.",
    category: "Neonatal", icon: Baby,
    href: "/calculators/apgar",
    tags: ["neonate", "newborn", "delivery", "apgar", "birth"]
  },
  {
    id: "bili",
    name: "Hyperbilirubinemia",
    description: "AAP 2022 phototherapy & exchange transfusion thresholds with interactive risk chart.",
    category: "Neonatal", icon: Baby,
    href: "/calculators/hyperbilirubinemia",
    tags: ["neonatal", "jaundice", "bilirubin", "phototherapy", "chart"]
  },
  {
    id: "eos-risk",
    name: "EOS Risk Calculator",
    description: "Kaiser Permanente Early-Onset Sepsis risk calculator for â‰¥ 34-week neonates.",
    category: "Neonatal", icon: ShieldAlert,
    href: "/calculators/eos-risk",
    tags: ["neonatal", "sepsis", "infection", "gbs", "eos"]
  },
  {
    id: "oi",
    name: "Oxygenation Index (OI/OSI)",
    description: "PARDS severity â€” OI and OSI with PALICC-2 thresholds for iNO/ECMO consideration.",
    category: "Neonatal", icon: Wind,
    href: "/calculators/oxygenation-index",
    tags: ["neonatal", "respiratory", "ventilation", "ino", "ecmo", "pards"]
  },
  {
    id: "map-calc",
    name: "Mean Airway Pressure",
    description: "Calculate ventilator MAP from PIP, PEEP, Ti, and I:E ratio.",
    category: "Neonatal", icon: Activity,
    href: "/calculators/map-calculator",
    tags: ["neonatal", "ventilation", "respiratory", "map", "ventilator"]
  },
  {
    id: "ett-depth",
    name: "ETT Depth",
    description: "Endotracheal tube insertion depth by weight (Tuen's rule) or gestational age.",
    category: "Neonatal", icon: Ruler,
    href: "/calculators/ett-depth",
    tags: ["neonatal", "intubation", "airway", "ett", "tube"]
  },
  {
    id: "uac-uvc",
    name: "UAC / UVC Length",
    description: "Umbilical catheter insertion depth by body weight with shoulder-umbilicus method.",
    category: "Neonatal", icon: Scissors,
    href: "/calculators/uac-uvc-length",
    tags: ["neonatal", "procedure", "catheter", "umbilical", "line"]
  },
  {
    id: "tpn-calc",
    name: "Neonatal TPN",
    description: "Comprehensive parenteral nutrition with GIR, protein, lipid titration and osmolarity.",
    category: "Neonatal", icon: FlaskConical,
    href: "/calculators/tpn-calculator",
    tags: ["neonatal", "nutrition", "tpn", "fluids", "pn", "parenteral"]
  },
  {
    id: "weight-loss",
    name: "Birth Weight Loss %",
    description: "Track postnatal weight change from birth weight to guide early nutritional support.",
    category: "Neonatal", icon: Scale,
    href: "/calculators/weight-loss",
    tags: ["neonatal", "nutrition", "weight", "birth", "loss"]
  },
  {
    id: "ballard",
    name: "Ballard Score",
    description: "Assess neuromuscular and physical maturity to estimate gestational age.",
    category: "Neonatal", icon: Activity,
    href: "/calculators/ballard-score",
    tags: ["neonatal", "maturity", "gestational-age", "ballard", "preterm"]
  },
  {
    id: "ga-calc",
    name: "Gestational Age",
    description: "Calculate PMA, corrected age and expected milestones for premature infants.",
    category: "Neonatal", icon: Calendar,
    href: "/calculators/gestational-age",
    tags: ["neonatal", "pregnancy", "corrected-age", "pma", "prematurity"]
  },
  {
    id: "neonatal-polycythemia",
    name: "Polycythaemia Exchange Volume",
    description: "Partial exchange transfusion volume calculation for neonatal polycythaemia (Hct >65%).",
    category: "Neonatal", icon: Activity,
    href: "/calculators/neonatal-polycythemia",
    tags: ["neonatal", "polycythemia", "hematocrit", "exchange", "high viscosity"],
    isNew: true
  },
  {
    id: "prematurity-predictor",
    name: "Prematurity Outcome Predictor",
    description: "NICHD-based survival and morbidity estimates by gestational age and birth weight.",
    category: "Neonatal", icon: Baby,
    href: "/calculators/prematurity-predictor",
    tags: ["neonatal", "prematurity", "survival", "outcome", "viability", "nichd"],
    isNew: true
  },
  // â”€â”€ Respiratory â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "croup-score",
    name: "Westley Croup Score",
    description: "5-component croup severity assessment with treatment protocol and steroid/epinephrine guidance.",
    category: "Respiratory", icon: Wind,
    href: "/calculators/croup-score",
    tags: ["croup", "stridor", "laryngotracheobronchitis", "dexamethasone", "epinephrine"],
    isNew: true
  },
  {
    id: "pram-asthma",
    name: "PRAM Asthma Score",
    description: "Pediatric Respiratory Assessment Measure â€” 5-item asthma severity with treatment guidance.",
    category: "Respiratory", icon: Wind,
    href: "/calculators/pram-asthma",
    tags: ["asthma", "wheeze", "bronchospasm", "salbutamol", "pram", "severity"],
    isNew: true
  },
  {
    id: "cap-severity",
    name: "Community-Acquired Pneumonia Severity",
    description: "Pediatric CAP severity scoring to guide admission, oxygen, and antibiotic decisions.",
    category: "Respiratory", icon: Stethoscope,
    href: "/calculators/cap-severity",
    tags: ["pneumonia", "cap", "respiratory", "antibiotic", "admission", "infection"],
    isNew: true
  },
  // â”€â”€ Neurology â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "meningitis-score",
    name: "Bacterial Meningitis Score",
    description: "Nigrovic Bacterial Meningitis Score â€” distinguish bacterial from viral using CSF and blood parameters.",
    category: "Neurology", icon: Brain,
    href: "/calculators/meningitis-score",
    tags: ["meningitis", "csf", "lumbar puncture", "bacterial", "viral", "nigrovic"],
    isNew: true
  },
  {
    id: "febrile-seizure",
    name: "Febrile Seizure Risk Stratification",
    description: "Identify risk for recurrence and complex features in children with febrile convulsions.",
    category: "Neurology", icon: Zap,
    href: "/calculators/febrile-seizure",
    tags: ["seizure", "febrile", "convulsion", "epilepsy", "risk", "recurrence"],
    isNew: true
  },
  {
    id: "developmental-screener",
    name: "Developmental Red Flag Screener",
    description: "Age-stratified milestone checklist with red flags for referral across 4 developmental domains.",
    category: "Neurology", icon: Brain,
    href: "/calculators/developmental-screener",
    tags: ["development", "milestone", "delay", "referral", "autism", "speech"],
    isNew: true
  },
  // â”€â”€ Cardiology & ECG â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "qtc",
    name: "Corrected QT (QTc)",
    description: "Bazett & Fridericia QTc with visual ECG measurement guide and long-QT assessment.",
    category: "Cardiology", icon: Activity,
    href: "/calculators/qtc",
    tags: ["ecg", "cardiology", "torsades", "qtc", "long-qt", "arrhythmia"]
  },
  {
    id: "bp",
    name: "BP Percentiles",
    description: "Screen for paediatric hypertension by age, sex and height with AAP 2017 tables.",
    category: "Cardiology", icon: HeartPulse,
    href: "/calculators/bp-percentiles",
    tags: ["cardiology", "hypertension", "blood-pressure", "bp", "percentile"]
  },
  {
    id: "kawasaki",
    name: "Kawasaki Disease Criteria",
    description: "Classic and incomplete KD diagnostic criteria with coronary risk assessment and management.",
    category: "Cardiology", icon: Heart,
    href: "/calculators/kawasaki",
    tags: ["kawasaki", "vasculitis", "coronary", "fever", "ivig", "aneurysm"],
    isNew: true
  },
  // â”€â”€ Haematology â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "transfusion",
    name: "Transfusion Volume Calculator",
    description: "Weight-based transfusion volumes for PRBC, FFP, platelets, and cryoprecipitate with target Hb.",
    category: "Haematology", icon: Syringe,
    href: "/calculators/transfusion",
    tags: ["blood", "transfusion", "prbc", "ffp", "platelets", "haemoglobin"],
    isNew: true
  },
  {
    id: "febrile-neutropenia",
    name: "Febrile Neutropenia Risk",
    description: "MASCC/ESMO risk stratification for oncology patients with febrile neutropenia â€” guides outpatient vs. inpatient care.",
    category: "Haematology", icon: Thermometer,
    href: "/calculators/febrile-neutropenia",
    tags: ["neutropenia", "fever", "oncology", "chemotherapy", "mascc", "infection"],
    isNew: true
  },
  // â”€â”€ Fluids & Nephrology â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "fluids",
    name: "Advanced Dehydration Engine",
    description: "Multi-phase fluid management for iso / hypo / hypernatremic dehydration.",
    category: "Fluids", icon: Droplets,
    href: "/calculators/advanced-fluids",
    tags: ["bolus", "iv", "dehydration", "sodium", "electrolyte", "maintenance"]
  },
  {
    id: "anion-gap",
    name: "Anion Gap",
    description: "Serum anion gap with albumin correction, delta-delta ratio, and GOLD MARK differential.",
    category: "Fluids", icon: Activity,
    href: "/calculators/anion-gap",
    tags: ["acid-base", "electrolytes", "gap", "metabolic", "acidosis"]
  },
  {
    id: "ca-corr",
    name: "Calcium Correction",
    description: "Adjusted total calcium for hypoalbuminaemia with ionised estimate and interpretation.",
    category: "Fluids", icon: FlaskConical,
    href: "/calculators/calcium-correction",
    tags: ["electrolytes", "albumin", "calcium", "hypocalcaemia", "ionised"]
  },
  {
    id: "fena",
    name: "FENa & FEUrea Calculator",
    description: "Fractional excretion of sodium and urea to distinguish prerenal from intrinsic renal failure.",
    category: "Fluids", icon: Droplets,
    href: "/calculators/fena",
    tags: ["renal", "aki", "fena", "urine", "sodium", "prerenal", "intrinsic"],
    isNew: true
  },
  {
    id: "aki-staging",
    name: "Pediatric AKI Staging (KDIGO)",
    description: "KDIGO 2012 acute kidney injury staging by creatinine rise and urine output with management guide.",
    category: "Fluids", icon: Activity,
    href: "/calculators/aki-staging",
    tags: ["aki", "renal", "kidney", "kdigo", "creatinine", "urine output"],
    isNew: true
  },
  {
    id: "upcr",
    name: "Urinary Protein:Creatinine Ratio",
    description: "Spot urine PCR to quantify proteinuria â€” nephrotic range identification and trend tracking.",
    category: "Fluids", icon: FlaskConical,
    href: "/calculators/upcr",
    tags: ["proteinuria", "nephrotic", "protein", "creatinine", "upcr", "renal"],
    isNew: true
  },
  {
    id: "fluid-balance",
    name: "Fluid Balance Alert",
    description: "Cumulative fluid balance with body-weight percentage and overload threshold alerts.",
    category: "Fluids", icon: Droplets,
    href: "/calculators/fluid-balance",
    tags: ["fluid", "balance", "overload", "intake", "output", "icu"],
    isNew: true
  },
  // â”€â”€ Endocrine & Metabolic â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "sod-corr",
    name: "Sodium Correction (Hyperglycaemia)",
    description: "Corrected sodium for hyperglycaemia in DKA using Hillier 1999 factor.",
    category: "Endocrine", icon: Thermometer,
    href: "/calculators/sodium-correction",
    tags: ["dka", "diabetes", "sodium", "hyperglycaemia", "correction"]
  },
  {
    id: "dka-transition",
    name: "DKA Insulin Transition",
    description: "Physiological basal-bolus roadmap for IV â†’ subcutaneous insulin transition.",
    category: "Endocrine", icon: Activity,
    href: "/calculators/dka-transition",
    tags: ["dka", "diabetes", "insulin", "transition", "t1dm", "subcutaneous"]
  },
  {
    id: "target-height",
    name: "Mid-Parental Target Height",
    description: "Genetic height potential with target range for boys and girls from parental heights.",
    category: "Endocrine", icon: TrendingUp,
    href: "/calculators/target-height",
    tags: ["growth", "height", "parental", "genetic", "target", "mid-parental"],
    isNew: true
  },
  {
    id: "diabetes-insulin",
    name: "Type 1 Diabetes Insulin Dose",
    description: "Total daily dose calculation with basal/bolus split and correction factor for T1DM management.",
    category: "Endocrine", icon: FlaskConical,
    href: "/calculators/diabetes-insulin",
    tags: ["diabetes", "insulin", "t1dm", "basal", "bolus", "correction", "tdd"],
    isNew: true
  },
  {
    id: "stress-hydrocortisone",
    name: "Stress Dose Hydrocortisone",
    description: "Weight-based stress dosing for adrenal insufficiency and CAH during illness or surgery.",
    category: "Endocrine", icon: Pill,
    href: "/calculators/stress-hydrocortisone",
    tags: ["cortisol", "hydrocortisone", "cah", "adrenal", "stress dose", "steroid"],
    isNew: true
  },
  // â”€â”€ Growth & Development â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "fenton",
    name: "Fenton 2013 Growth Charts",
    description: "Preterm growth monitoring (Weight, Length, HC) â€” 22â€“50w PMA with Z-scores.",
    category: "Growth", icon: TrendingUp,
    href: "/calculators/fenton-charts",
    tags: ["neonatal", "growth", "preterm", "fenton", "sga", "lga", "pma"]
  },
  {
    id: "growth",
    name: "WHO Growth Charts",
    description: "Interactive WHO weight / height / HC percentile charts for 0â€“5 years with Z-score and classification.",
    category: "Growth", icon: TrendingUp,
    href: "/calculators/growth-charts",
    tags: ["growth", "who", "percentile", "weight", "height", "stunting", "wasting"]
  },
  {
    id: "nutritional-recovery",
    name: "Nutritional Recovery",
    description: "Catch-up growth roadmap with Waterlow grading, calorie targets and food matrix.",
    category: "Growth", icon: Apple,
    href: "/calculators/nutritional-recovery",
    tags: ["nutrition", "growth", "faltering", "calories", "malnutrition", "waterlow"]
  },
  {
    id: "growth-velocity",
    name: "Growth Velocity Tracker",
    description: "Calculate weight and height velocity from two measurements and compare to age-appropriate norms.",
    category: "Growth", icon: TrendingUp,
    href: "/calculators/growth-velocity",
    tags: ["growth", "velocity", "weight", "height", "monitoring", "faltering"],
    isNew: true
  },
  {
    id: "vaccination-scheduler",
    name: "Catch-Up Vaccination Scheduler",
    description: "Generate a catch-up immunisation schedule for delayed or partially vaccinated children.",
    category: "Growth", icon: Calendar,
    href: "/calculators/vaccination-scheduler",
    tags: ["vaccine", "immunisation", "catch-up", "schedule", "delayed", "vaccination"],
    isNew: true
  },
  // â”€â”€ Pharmacology & Antimicrobials â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "suspension-dosing",
    name: "Suspension Dosing",
    description: "Oral suspension volume (mL) calculator by concentration and weight with common formulations.",
    category: "Pharmacology", icon: Pill,
    href: "/calculators/suspension-dosing",
    tags: ["dosing", "suspension", "liquid", "oral", "syrup", "concentration"]
  },
  {
    id: "drug-tapering",
    name: "Drug Tapering",
    description: "Generate structured weaning schedules for steroids and chronic medications.",
    category: "Pharmacology", icon: TrendingDown,
    href: "/calculators/tapering-calculator",
    tags: ["taper", "weaning", "steroid", "prednisolone", "dexamethasone", "wean"]
  },
  {
    id: "antibiotic-stewardship",
    name: "Antibiotic Stewardship Pathway",
    description: "Syndrome-based antibiotic choice with de-escalation criteria and duration guidance.",
    category: "Pharmacology", icon: Pill,
    href: "/calculators/antibiotic-stewardship",
    tags: ["antibiotic", "stewardship", "pathogen", "de-escalation", "duration", "antimicrobial"],
    isNew: true
  },
  // â”€â”€ Clinical Reference â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "bsa",
    name: "Body Surface Area",
    description: "Mosteller BSA formula for chemotherapy, drug dosing and burn area estimation.",
    category: "Reference", icon: Ruler,
    href: "/calculators/bsa",
    tags: ["surface", "area", "drug-dose", "bsa", "chemo", "mosteller"]
  },
  {
    id: "gfr",
    name: "eGFR (Bedside Schwartz)",
    description: "Estimated GFR by height and creatinine for children and adolescents.",
    category: "Reference", icon: Activity,
    href: "/calculators/gfr",
    tags: ["renal", "creatinine", "kidney", "gfr", "schwartz", "egfr"]
  },
  {
    id: "child-pugh",
    name: "Child-Pugh Score",
    description: "Severity and surgical risk stratification for chronic liver disease.",
    category: "Reference", icon: Stethoscope,
    href: "/calculators/child-pugh",
    tags: ["liver", "cirrhosis", "hepatic", "child-pugh", "hepatology"]
  },
  {
    id: "vesikari",
    name: "Vesikari Gastroenteritis Score",
    description: "Severity scoring for acute gastroenteritis in children â€” guides admission and treatment intensity.",
    category: "Reference", icon: Stethoscope,
    href: "/calculators/vesikari",
    tags: ["gastroenteritis", "diarrhoea", "vomiting", "severity", "vesikari", "dehydration"],
    isNew: true
  },
];

export default function CalculatorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | CalcCategory>("all");
  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PINNED_ITEMS_KEY);
      if (raw) setPinnedItems(JSON.parse(raw));
    } catch {
      setPinnedItems([]);
    }
  }, []);

  const togglePin = (href: string) => {
    const item: PinnedItem = { type: "calculator", href };
    setPinnedItems((prev) => {
      const isPinned = prev.some(p => p.type === "calculator" && p.href === href);
      const next = isPinned
        ? prev.filter(p => !(p.type === "calculator" && p.href === href))
        : [item, ...prev];
      localStorage.setItem(PINNED_ITEMS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isPinned = (href: string) => pinnedItems.some(p => p.type === "calculator" && p.href === href);

  const pinnedTools = useMemo(
    () => CALCULATORS.filter(c => c.href && isPinned(c.href)),
    [pinnedItems]
  );

  const isSearching = searchQuery.trim().length > 0;

  const filteredCalculators = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return CALCULATORS.filter(calc => {
      const matchesSearch = !q ||
        calc.name.toLowerCase().includes(q) ||
        calc.description.toLowerCase().includes(q) ||
        calc.tags.some(t => t.includes(q));
      const matchesCategory = activeCategory === "all" || calc.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: CALCULATORS.length };
    CALCULATORS.forEach(c => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, []);

  const groupedCalculators = useMemo(() => {
    const groups: Record<string, CalcTool[]> = {};
    filteredCalculators.forEach(calc => {
      if (!groups[calc.category]) groups[calc.category] = [];
      groups[calc.category].push(calc);
    });
    return groups;
  }, [filteredCalculators]);

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tighter mb-1">PediCalc Engine</h1>
          <p className="text-muted-foreground text-sm font-medium">
            {CALCULATORS.length} validated clinical calculators Â· {CALCULATORS.filter(c => c.isNew).length} newly added
          </p>
        </div>
        <div className="relative w-full sm:w-[420px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, condition, or tagâ€¦"
            className="w-full h-12 pl-11 pr-10 rounded-2xl bg-muted/40 border border-transparent focus:bg-background focus:border-primary/20 focus:outline-none shadow-none transition-all text-sm font-medium placeholder:text-muted-foreground/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isSearching && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      {!isSearching && (
        <div className="flex flex-wrap gap-2">
          <CategoryPill
            label="All Systems"
            count={categoryCounts["all"]}
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
            color="slate"
            Icon={Calculator}
          />
          {categoryOrder.map(cat => {
            const meta = CATEGORY_METADATA[cat];
            return (
              <CategoryPill
                key={cat}
                label={cat}
                count={categoryCounts[cat] || 0}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                color={meta.color}
                Icon={meta.icon}
              />
            );
          })}
        </div>
      )}

      {/* Search result count */}
      {isSearching && (
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground font-medium">
            <span className="font-black text-foreground">{filteredCalculators.length}</span> result{filteredCalculators.length !== 1 ? "s" : ""} for{" "}
            <span className="font-semibold text-primary">"{searchQuery}"</span>
          </p>
          <button onClick={() => setSearchQuery("")} className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2">
            Clear
          </button>
        </div>
      )}

      {/* Pinned Section */}
      {pinnedTools.length > 0 && activeCategory === "all" && !isSearching && (
        <section className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 px-1">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600 shadow-sm">
              <Pin className="h-4 w-4 fill-current" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-amber-700">Quick Access</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {pinnedTools.map((calc) => (
              <PinnedToolCard
                key={`pinned-${calc.id}`}
                tool={calc}
                onTogglePin={() => togglePin(calc.href!)}
              />
            ))}
          </div>
          <div className="border-b border-dashed pt-2" />
        </section>
      )}

      {/* Calculator Grid */}
      {filteredCalculators.length > 0 ? (
        <div className="space-y-12">
          {(isSearching ? categoryOrder : (activeCategory === "all" ? categoryOrder : [activeCategory])).map(cat => {
            const tools = groupedCalculators[cat];
            if (!tools || tools.length === 0) return null;
            const meta = CATEGORY_METADATA[cat];
            const Icon = meta.icon;
            const cc = colorClasses(meta.color, false);

            return (
              <div key={cat} className="space-y-5 animate-in fade-in duration-500">
                {(activeCategory === "all" || isSearching) && (
                  <div className="flex items-center gap-3 px-1">
                    <div className={cn("p-2 rounded-xl text-white shadow-lg", cc.header)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black tracking-tight">{meta.label}</h2>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {tools.length} tool{tools.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {tools.map((calc) => (
                    <CalculatorCard
                      key={calc.id}
                      tool={calc}
                      isPinned={calc.href ? isPinned(calc.href) : false}
                      onTogglePin={calc.href ? () => togglePin(calc.href!) : undefined}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-24 text-center border-4 border-dashed rounded-[48px] bg-muted/20">
          <Calculator className="h-16 w-16 mx-auto mb-4 text-muted-foreground/10" />
          <h3 className="text-2xl font-black text-muted-foreground/40 tracking-tight">No tools found</h3>
          <p className="text-sm text-muted-foreground/30 mt-1">Try a different search term or category</p>
        </div>
      )}
    </div>
  );
}

function CategoryPill({
  label, count, active, onClick, color, Icon
}: {
  label: string; count: number; active: boolean;
  onClick: () => void; color: string; Icon: any;
}) {
  const cc = colorClasses(color, active);
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-bold transition-all border select-none",
        active
          ? cn(cc.pill, "shadow-md")
          : "bg-background text-muted-foreground border-muted hover:border-muted-foreground/30 hover:bg-muted/40"
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span>{label}</span>
      <span className={cn(
        "rounded-full px-1.5 py-px text-[9px] font-black",
        active ? "bg-white/20 text-white" : "bg-muted text-muted-foreground/70"
      )}>
        {count}
      </span>
    </button>
  );
}

function CalculatorCard({ tool, isPinned, onTogglePin }: {
  tool: CalcTool; isPinned: boolean; onTogglePin?: () => void;
}) {
  const Icon = tool.icon;
  const meta = CATEGORY_METADATA[tool.category];
  const cc = colorClasses(meta.color, false);

  return (
    <Card className="group relative h-full transition-all border-2 rounded-[32px] hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 bg-card overflow-hidden">
      <CardHeader className="pb-4 p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={cn(
            "p-3 rounded-2xl transition-all duration-300",
            "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/30"
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {tool.isNew && (
              <Badge className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest border-none px-2">
                New
              </Badge>
            )}
            <Badge variant="secondary" className={cn("text-[9px] font-black uppercase tracking-[0.12em] border-none px-2", cc.bg)}>
              {tool.category}
            </Badge>
            {onTogglePin && !tool.comingSoon && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTogglePin(); }}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  isPinned ? "bg-amber-50 text-amber-500 shadow-sm" : "bg-muted/30 text-muted-foreground/30 hover:bg-muted"
                )}
              >
                {isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
              </button>
            )}
          </div>
        </div>
        <CardTitle className="text-lg font-black tracking-tight group-hover:text-primary transition-colors leading-snug mb-2">
          {tool.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 leading-relaxed text-[13px] font-medium text-muted-foreground/80">
          {tool.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 px-6 pb-6">
        {tool.comingSoon ? (
          <div className="flex items-center justify-between w-full p-3 rounded-2xl bg-muted/20 border border-dashed border-muted-foreground/20">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">In Development</span>
            <Clock className="h-4 w-4 text-muted-foreground/25" />
          </div>
        ) : (
          <Link href={tool.href || "#"} className="flex items-center justify-between w-full p-3 rounded-2xl bg-muted/30 hover:bg-primary/[0.03] transition-all group/link border border-transparent hover:border-primary/10">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Launch Tool</span>
            <ArrowRight className="h-4 w-4 text-primary group-hover/link:translate-x-1 transition-transform" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

function PinnedToolCard({ tool, onTogglePin }: { tool: CalcTool; onTogglePin: () => void }) {
  const Icon = tool.icon;
  return (
    <Link href={tool.href || "#"}>
      <div className="group relative flex flex-col items-center justify-center p-2 min-h-[100px] aspect-square bg-card border-2 rounded-[28px] hover:border-amber-400/50 hover:bg-amber-50/30 transition-all text-center">
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTogglePin(); }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-amber-100 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
        >
          <PinOff className="h-3 w-3" />
        </button>
        <div className="p-2.5 rounded-2xl mb-2 transition-all duration-300 bg-muted text-muted-foreground group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-amber-200">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-tight leading-[1.1] line-clamp-2 px-1 max-w-[85%]">
          {tool.name.replace(/\s*\(.*?\)/g, "").trim()}
        </span>
      </div>
    </Link>
  );
}
