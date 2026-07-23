import {
  ShieldAlert, Baby, Wind, Zap, Heart, Syringe, Droplets, Flame, Apple, Pill, Ruler,
  Brain, Stethoscope, Activity, Scissors, FlaskConical, Scale, Calendar,
  TrendingUp, TrendingDown, Thermometer, HeartPulse, Dna, Shield, Microscope,
} from "lucide-react";

export type CalcCategory =
  | "Emergency" | "Neonatal" | "Respiratory" | "Neurology"
  | "Cardiology" | "Haematology" | "Fluids" | "Endocrine"
  | "Growth" | "Pharmacology" | "Reference";

export interface CalcTool {
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

export const CATEGORY_METADATA: Record<CalcCategory, { label: string; icon: any; color: string }> = {
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

export const categoryOrder: CalcCategory[] = [
  "Emergency", "Neonatal", "Respiratory", "Neurology",
  "Cardiology", "Haematology", "Fluids", "Endocrine",
  "Growth", "Pharmacology", "Reference"
];

export function colorClasses(color: string, active: boolean) {
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

export const CALCULATORS: CalcTool[] = [
  // ── Emergency & Critical Care ──────────────────────────────────────────
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
    name: "PEWS — Pediatric Early Warning Score",
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
    description: "Evidence-based decision tool to identify very low-risk pediatric TBI — reduces CT exposure.",
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
  // ── Neonatal & Perinatal ───────────────────────────────────────────────
  {
    id: "thompson-hie",
    name: "Thompson HIE Score",
    description: "Score neonatal encephalopathy severity across 9 criteria + integrated cooling eligibility checklist.",
    category: "Neonatal", icon: Brain,
    href: "/calculators/thompson-hie",
    tags: ["hie", "encephalopathy", "cooling", "hypothermia", "neonatal", "seizure"]
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
    description: "Kaiser Permanente Early-Onset Sepsis risk calculator for ≥ 34-week neonates.",
    category: "Neonatal", icon: ShieldAlert,
    href: "/calculators/eos-risk",
    tags: ["neonatal", "sepsis", "infection", "gbs", "eos"]
  },
  {
    id: "oi",
    name: "Oxygenation Index (OI/OSI)",
    description: "PARDS severity — OI and OSI with PALICC-2 thresholds for iNO/ECMO consideration.",
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
  // ── Respiratory ────────────────────────────────────────────────────────
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
    description: "Pediatric Respiratory Assessment Measure — 5-item asthma severity with treatment guidance.",
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
  // ── Neurology ──────────────────────────────────────────────────────────
  {
    id: "meningitis-score",
    name: "Bacterial Meningitis Score",
    description: "Nigrovic Bacterial Meningitis Score — distinguish bacterial from viral using CSF and blood parameters.",
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
    name: "Developmental Milestone Screener",
    description: "CDC 2022 milestone checklist (12 checkpoints, 2mo-5y) with corrected age for preterm infants, domain-level delay detection, and referral guidance.",
    category: "Neurology", icon: Brain,
    href: "/calculators/developmental-screener",
    tags: ["development", "milestone", "delay", "referral", "autism", "speech", "m-chat", "corrected age"],
    isNew: true
  },
  {
    id: "csf-correction",
    name: "CSF Traumatic Tap Correction",
    description: "Corrected CSF WBC and protein after a bloody (traumatic) lumbar puncture.",
    category: "Neurology", icon: Brain,
    href: "/calculators/csf-correction",
    tags: ["csf", "traumatic tap", "lumbar puncture", "meningitis", "corrected wbc", "corrected protein"],
    isNew: true
  },
  // ── Cardiology & ECG ──────────────────────────────────────────────────
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
  // ── Haematology ────────────────────────────────────────────────────────
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
    id: "anc",
    name: "Absolute Neutrophil Count",
    description: "ANC from WBC and differential, with neutropenia severity grading and infection risk.",
    category: "Haematology", icon: Shield,
    href: "/calculators/anc",
    tags: ["anc", "neutropenia", "wbc", "differential", "infection risk"],
    isNew: true
  },
  {
    id: "reticulocyte",
    name: "Reticulocyte Calculator",
    description: "Absolute reticulocyte count, corrected retic %, and Reticulocyte Production Index for anaemia workup.",
    category: "Haematology", icon: Droplets,
    href: "/calculators/reticulocyte",
    tags: ["reticulocyte", "retic", "rpi", "anaemia", "haemolysis", "marrow"],
    isNew: true
  },
  {
    id: "mentzer-index",
    name: "Mentzer Index",
    description: "MCV/RBC screening ratio to differentiate thalassaemia trait from iron deficiency anaemia.",
    category: "Haematology", icon: Microscope,
    href: "/calculators/mentzer-index",
    tags: ["mentzer", "thalassemia", "thalassaemia", "iron deficiency", "microcytic", "anemia", "anaemia", "mcv"],
    isNew: true
  },
  // ── Fluids & Nephrology ───────────────────────────────────────────────
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
    description: "Spot urine PCR to quantify proteinuria — nephrotic range identification and trend tracking.",
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
  // ── Endocrine & Metabolic ─────────────────────────────────────────────
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
    description: "Physiological basal-bolus roadmap for IV → subcutaneous insulin transition.",
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
  // ── Growth & Development ──────────────────────────────────────────────
  {
    id: "fenton",
    name: "Fenton 2013 Growth Charts",
    description: "Preterm growth monitoring (Weight, Length, HC) — 22–50w PMA with Z-scores.",
    category: "Growth", icon: TrendingUp,
    href: "/calculators/fenton-charts",
    tags: ["neonatal", "growth", "preterm", "fenton", "sga", "lga", "pma"]
  },
  {
    id: "growth",
    name: "WHO Growth Charts",
    description: "Interactive WHO weight / height / HC percentile charts for 0–5 years with Z-score and classification.",
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
  // ── Pharmacology & Antimicrobials ─────────────────────────────────────
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
  // ── Clinical Reference ─────────────────────────────────────────────────
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
    id: "genetic-disease-screener",
    name: "Genetic Disease Suspicion Score",
    description: "Major/minor anomaly counting tool with referral and first-tier testing guidance (CMA, karyotype).",
    category: "Reference", icon: Dna,
    href: "/calculators/genetic-disease-screener",
    tags: ["genetics", "dysmorphology", "anomaly", "syndrome", "microarray", "referral"],
    isNew: true
  },
  {
    id: "sedation-selector",
    name: "Sedation Agent Selector",
    description: "Preferred vs avoid sedation agents by comorbidity/shock type (procedural) or by disease for continuous PICU ventilator sedation — includes expected withdrawal by agent class.",
    category: "Reference", icon: Syringe,
    href: "/calculators/sedation-selector",
    tags: ["sedation", "ketamine", "propofol", "etomidate", "dexmedetomidine", "procedural sedation", "porphyria", "airway", "comorbidity", "septic shock", "cardiogenic shock", "kawasaki shock syndrome", "kdss", "hypovolemic shock", "anaphylaxis", "picu", "ventilator", "withdrawal", "pandem"],
    isNew: true
  },
];
