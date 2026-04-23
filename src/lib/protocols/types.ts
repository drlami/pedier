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

export type SeverityLevel = 'mild' | 'moderate' | 'severe' | 'some' | 'no' | 'impending respiratory failure' | 'unknown';

export interface Severity {
  level: SeverityLevel;
  score?: number;
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

export interface DiseaseProtocol {
  id: string;
  name: string;
  description: string;
  image: {
    url: string;
    hint: string;
  };
  questions: Question[];
  calculateSeverity: (data: FormData) => Severity;
  getManagement: (severity: Severity, data: FormData) => { title: string; recommendations: string[] }[];
  getDisposition: (severity: Severity, data: FormData) => string[];
  getRedFlags: (severity: Severity, data: FormData) => string[];
  getDrugDoses: (severity: Severity, data: FormData) => DrugDose[];
  getReferences: () => Reference[];
}
