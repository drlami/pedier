export type QuestionType = "number" | "select" | "boolean" | "radio";

export interface QuestionOption {
  label: string;
  value: string | number;
  score?: number;
}

export interface Question {
  id: string;
  questionText: string;
  type: QuestionType;
  options?: QuestionOption[];
  placeholder?: string;
  unit?: string;
  info?: string;
  questionGroup?: 'suspicion' | 'severity';
}

export type SeverityLevel = 'mild' | 'moderate' | 'severe' | 'critical' | 'low' | 'some' | 'no' | 'impending respiratory failure' | 'unknown';

export interface StandardizedScore {
  systemName: string; // e.g., "PRAM Score"
  totalScore: number;
  interpretation: string; // e.g., "Moderate Exacerbation"
  maxScore?: number;
  referenceTable?: { range: string; meaning: string }[];
}

/**
 * A single gating criterion for "Gate mode" protocols — guidelines that are
 * written as a decision tree (ANY of these → tier X) rather than a summed,
 * validated instrument. `met` is evaluated by the protocol's calculateSeverity
 * against the current form data / vitals; `source` distinguishes criteria
 * derived automatically from entered vitals (SpO2, RR) from ones the clinician
 * answers directly, purely for UI labelling.
 */
export interface GateFinding {
  id: string;
  label: string;
  met: boolean;
  tier: SeverityLevel;
  source: 'vital' | 'manual';
}

/**
 * A mandatory-admission factor that is INDEPENDENT of clinical severity — e.g.
 * age < 6 months, immunocompromise, complicated pneumonia, social factors. A
 * child with mild pneumonia but a met admit-override still requires admission.
 * Kept separate from GateFinding so severity ("how sick") and disposition
 * ("must this child be admitted") are never conflated.
 */
export interface AdmitOverride {
  id: string;
  label: string;
  met: boolean;
}

export interface Severity {
  level: SeverityLevel;
  score?: number;
  scoreDetails?: StandardizedScore;
  gateFindings?: GateFinding[];
  admitOverrides?: AdmitOverride[];
  details: string[];
  diagnosticConfidence?: 'high' | 'moderate' | 'low';
  alternativeProtocol?: { id: string; name: string };
}

export type FormData = { [key: string]: string | number | boolean | undefined };

export interface DrugDose {
  drugName: string;
  dose: string;
  notes?: string;
}

export interface Reference {
  title: string;
  url: string;
}

export type ProtocolCategory = "emergency" | "general";
export type ClinicalUnit = "er" | "ward" | "picu" | "nicu";
export interface WardHandbookData {
  overview: string;
  clinicalFeatures: {
    title: string;
    items: string[];
  }[];
  redFlags: string[];
  differentialDiagnosis: string[];
  investigations: {
    initial: string[];
    escalation: string[];
  };
  management: {
    initial: string[];
    fluids: string[];
    nutrition: string[];
    medications: {
      drug: string;
      dose: string; // e.g. "50 mg/kg"
      frequency: string;
      maxDose?: string;
      notes?: string;
      calculation: (weight: number) => string;
    }[];
    monitoring: string[];
    severityClassification?: {
      title: string;
      table: { criteria: string; classification: string }[];
    };
  };
  dischargeCriteria: string[];
  followUp: string[];
}

export interface MMPActionCard {
  title: string;
  threshold?: string; // e.g. "IF FEVER PERSISTS > 48H"
  instructions?: string[]; // Legacy support
  orders?: string[]; // Physician orders [DR]
  nursing?: string[]; // Nursing directives [NS]
  triggers?: string[]; // Senior pivot triggers [!]
  isCritical?: boolean;
  calculator?: {
    id: string; // e.g. "pram-score"
    title: string;
  };
  prescriptions?: {
    drug: string;
    dose: string;
    route: string;
    frequency: string;
    calculation: (weight: number) => string;
    notes?: string;
  }[];
}

export interface MMPStage {
  label: string; // e.g. "Stage 1: Admission & Initial Orders"
  shortLabel: string; // e.g. "Admission"
  color: "blue" | "amber" | "red" | "emerald" | "indigo";
  cards: MMPActionCard[];
}

export interface MasterManagementPathway {
  snapshot?: string; // High-level consultant mindset summary
  stages: MMPStage[];
}

// ─── ER Interactive Data ──────────────────────────────────────────────────────

export interface ErHistoryItem {
  id: string;
  question: string;
  redFlag?: boolean;
  ifYes?: string;
}

export interface ErInvestigation {
  test: string;
  category: 'urgent' | 'blood' | 'radiology' | 'other';
  indication?: string;
  criticalValue?: string;
}

export interface ErTimerStep {
  minutesMark: number;
  label: string;
  action: string;
}

// ─── Reference-mode severity (classify-by-table, tap-to-route) ─────────────────
// The clinician READS a severity table and picks the band; the app routes to the
// matching management. No input→score computation decides severity — this removes
// the false-precision / automation-bias failure mode of the interactive scorer.

export type SeverityBand = 'mild' | 'moderate' | 'severe';

export interface ClassificationRow {
  feature: string;                                  // row label, e.g. "Work of breathing"
  mild: string;
  moderate: string;
  severe: string;
}

export interface AdmitOverrideItem {
  id: string;                                       // formData key it writes to
  label: string;
  autoAgeMonthsBelow?: number;                      // if set, auto-met when ageMonths < this (no manual toggle)
}

export interface SeverityClassification {
  rows: ClassificationRow[];
  // No per-band "action" text field here on purpose — the "what happens now"
  // summary is ALWAYS computed live by DiseaseProtocol.getDisposition(), never
  // a static per-band lookup. A static field previously existed here and
  // caused a real bug: it couldn't know about admit-overrides, so it showed
  // "discharge" for a band the override checklist simultaneously said "ADMIT"
  // for. Do not re-add a static disposition string to this interface.
  admitOverrides: AdmitOverrideItem[];              // mandatory-admission facts, independent of severity
}

export interface ErData {
  historyChecklist: ErHistoryItem[];
  investigations: ErInvestigation[];
  admissionCriteria: string[];          // Absolute — admit regardless of response
  highRiskFactors?: string[];           // Lower threshold — admit if incomplete response or borderline
  dischargeCriteria: string[];
  safetyNetting: string[];
  severityClassification?: SeverityClassification;  // present → renderer uses reference mode
  timer?: {
    label: string;
    steps: ErTimerStep[];
  };
}

// ─── DiseaseProtocol ──────────────────────────────────────────────────────────

export interface DiseaseProtocol {
  id: string;
  name: string;
  description: string;
  system: string;
  category?: ProtocolCategory;
  unit?: ClinicalUnit;
  lastUpdated?: string;
  image: {
    url: string;
    hint: string;
  };
  questions: Question[];
  wardHandbook?: WardHandbookData; // Legacy / Fallback
  mmpData?: MasterManagementPathway; // Staged pathway (NICU/PICU)
  erData?: ErData; // Interactive ER mode
  calculateSeverity: (data: FormData) => Severity;
  getInvestigations?: (severity: Severity, data: FormData) => ErInvestigation[];
  getManagement: (severity: Severity, data: FormData) => { title: string; recommendations: string[] }[];
  getDisposition: (severity: Severity, data: FormData) => string[];
  getDischargeCriteria?: (severity: Severity, data: FormData) => string[];
  getFollowUp?: (severity: Severity, data: FormData) => string[];
  getRedFlags: (severity: Severity, data: FormData) => string[];
  getDrugDoses: (severity: Severity, data: FormData) => DrugDose[];
  getReferences: () => Reference[];
}

/**
 * A version of DiseaseProtocol that can be safely passed to Client Components.
 * Functions are removed or converted to strings.
 */
export interface SerializableProtocol {
  id: string;
  name: string;
  description: string;
  system: string;
  category?: ProtocolCategory;
  unit?: ClinicalUnit;
  lastUpdated?: string;
  image: {
    url: string;
    hint: string;
  };
  questions: Question[];
  logicStrings?: {
    calculateSeverity: string;
    getInvestigations?: string;
    getManagement: string;
    getDisposition: string;
    getDischargeCriteria?: string;
    getFollowUp?: string;
    getRedFlags: string;
    getDrugDoses: string;
    getReferences: string;
  };
}

