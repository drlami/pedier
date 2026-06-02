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
}

export type SeverityLevel = 'mild' | 'moderate' | 'severe' | 'critical' | 'low' | 'some' | 'no' | 'impending respiratory failure' | 'unknown';

export interface StandardizedScore {
  systemName: string; // e.g., "PRAM Score"
  totalScore: number;
  interpretation: string; // e.g., "Moderate Exacerbation"
  maxScore?: number;
  referenceTable?: { range: string; meaning: string }[];
}

export interface Severity {
  level: SeverityLevel;
  score?: number;
  scoreDetails?: StandardizedScore;
  details: string[];
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
  mmpData?: MasterManagementPathway; // The new professional engine
  calculateSeverity: (data: FormData) => Severity;
  getInvestigations?: (severity: Severity, data: FormData) => { title: string; list: string[] }[];
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

