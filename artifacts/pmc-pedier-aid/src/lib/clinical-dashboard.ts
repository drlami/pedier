export type DashboardAccent = "red" | "orange" | "blue" | "emerald" | "violet" | "slate";

export interface EmergencyShortcut {
  label: string;
  description: string;
  href: string;
  protocolId?: string;
  accent: DashboardAccent;
}

export interface PresentationGroup {
  id: string;
  title: string;
  description: string;
  protocolIds: string[];
  accent: DashboardAccent;
}

export interface CalculatorShortcut {
  label: string;
  description: string;
  href: string;
  accent: DashboardAccent;
}

export const EMERGENCY_SHORTCUTS: EmergencyShortcut[] = [
  {
    label: "Cardiac Arrest",
    description: "Resuscitation and RSI",
    href: "/cardiac-arrest",
    accent: "red",
  },
  {
    label: "Shock",
    description: "Fluids, vasoactive support, disposition",
    href: "/diseases/shock-management",
    protocolId: "shock-management",
    accent: "red",
  },
  {
    label: "Status Epilepticus",
    description: "Time-critical seizure pathway",
    href: "/diseases/acute-seizure",
    protocolId: "acute-seizure",
    accent: "orange",
  },
  {
    label: "Anaphylaxis",
    description: "Immediate adrenaline guidance",
    href: "/diseases/anaphylactic-shock",
    protocolId: "anaphylactic-shock",
    accent: "red",
  },
  {
    label: "DKA",
    description: "Fluids, insulin, electrolytes",
    href: "/diseases/dka",
    protocolId: "dka",
    accent: "orange",
  },
  {
    label: "Hyperkalemia",
    description: "ECG risk and acute treatment",
    href: "/diseases/hyperkalemia",
    protocolId: "hyperkalemia",
    accent: "red",
  },
];

export const PRESENTATION_GROUPS: PresentationGroup[] = [
  {
    id: "respiratory-distress",
    title: "Respiratory Distress",
    description: "Wheeze, stridor, pneumonia, apnea, cyanosis",
    accent: "blue",
    protocolIds: ["asthma", "bronchiolitis", "croup", "pneumonia", "fba", "epiglottitis", "tracheitis", "apnea", "cyanosis"],
  },
  {
    id: "fever-infection",
    title: "Fever / Infection",
    description: "Age-based fever, sepsis, CNS infection, cellulitis",
    accent: "orange",
    protocolIds: ["fever-neonate", "fever-1-2-months", "fever-2-3-months", "fever-3-36-months", "fever-neutropenia", "fever-rash", "septic-shock", "meningitis-encephalitis", "ssti", "periorbital-cellulitis", "orbital-cellulitis", "mastoiditis", "viral-vs-bacterial"],
  },
  {
    id: "neuro-emergency",
    title: "Neuro Emergency",
    description: "Seizure, altered mental status, weakness, raised ICP",
    accent: "violet",
    protocolIds: ["acute-seizure", "febrile-seizure", "first-afebrile-seizure", "altered-mental-status", "raised-icp-suspicion", "acute-ataxia", "acute-flaccid-weakness", "peds-stroke", "headache-red-flags"],
  },
  {
    id: "gi-dehydration",
    title: "GI / Dehydration",
    description: "Vomiting, dehydration, abdominal pain, obstruction clues",
    accent: "emerald",
    protocolIds: ["dehydration-gastroenteritis", "persistent-vomiting", "bilious-vomiting", "abdominal-pain", "intussusception", "gi-bleeding", "constipation-vs-obstruction", "abdominal-distention"],
  },
  {
    id: "toxins-poisoning",
    title: "Toxins / Poisoning",
    description: "Ingestion, envenomation, inhalation and antidote decisions",
    accent: "slate",
    protocolIds: ["toxic-assessment", "paracetamol-toxicity", "iron-toxicity", "organophosphorus-ingestion", "co-poisoning", "chlorine-inhalation", "snake-bite", "scorpion-sting"],
  },
  {
    id: "electrolyte-endocrine",
    title: "Electrolytes / Endocrine",
    description: "DKA, glucose, adrenal crisis and critical electrolytes",
    accent: "orange",
    protocolIds: ["dka", "hypoglycemia", "adrenal-crisis", "hyperkalemia", "hypokalemia", "hyponatremia", "hypernatremia", "hypocalcemia", "hypercalcemia", "hypomagnesemia", "metabolic-crisis"],
  },
  {
    id: "renal-urinary",
    title: "Renal / Urinary",
    description: "AKI, CKD complications, nephritic/nephrotic, UTI",
    accent: "blue",
    protocolIds: ["acute-renal-failure", "chronic-renal-failure", "nephrotic-syndrome", "nephritic-syndrome", "urinary-tract-infection"],
  },
  {
    id: "cardiac-symptoms",
    title: "Cardiac Symptoms",
    description: "Arrhythmia, chest pain, syncope, myocarditis, heart failure",
    accent: "red",
    protocolIds: ["bradycardia", "tachycardia", "svt", "chest-pain-in-children", "syncope", "palpitations", "suspected-myocarditis", "suspected-heart-failure", "murmur-with-symptoms"],
  },
];

export const CALCULATOR_SHORTCUTS: CalculatorShortcut[] = [
  {
    label: "Drug Dosing",
    description: "Weight-based medication doses",
    href: "/drug-doses",
    accent: "orange",
  },
  {
    label: "Resuscitation",
    description: "Arrest drugs and equipment",
    href: "/cardiac-arrest",
    accent: "red",
  },
  {
    label: "RSI",
    description: "Intubation medication support",
    href: "/cardiac-arrest",
    accent: "red",
  },
  {
    label: "Hyperbilirubinemia",
    description: "AAP threshold support",
    href: "/neonatology/hyperbilirubinemia",
    accent: "emerald",
  },
  {
    label: "All Calculators",
    description: "Calculator hub",
    href: "/calculators",
    accent: "slate",
  },
];
