export type SeverityLevel = 'mild' | 'moderate' | 'severe' | 'some' | 'no' | 'unknown';

export interface CustomQuestion {
  id: string;
  questionText: string;
  type: 'number' | 'boolean' | 'select' | 'radio';
  unit?: string;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  info?: string;
}

export interface SeverityRule {
  id: string;
  priority: number;
  condition: string;
  level: SeverityLevel;
  detail: string;
}

export interface ManagementSection {
  id: string;
  title: string;
  recommendations: string[];
  severities: SeverityLevel[] | null;
}

export interface DrugDoseEntry {
  id: string;
  drugName: string;
  dose: string;
  maxDose?: string;
  notes?: string;
  severities: SeverityLevel[] | null;
}

export interface DispositionEntry {
  id: string;
  text: string;
  type: 'admission' | 'discharge' | 'general';
  severities: SeverityLevel[] | null;
}

export interface CustomReference {
  id: string;
  title: string;
  url?: string;
}

export interface CustomProtocol {
  id: string;
  name: string;
  system: string;
  description: string;
  isCustom: true;
  createdAt: string;
  updatedAt: string;
  questions: CustomQuestion[];
  severityRules: SeverityRule[];
  defaultSeverity: SeverityLevel;
  management: ManagementSection[];
  disposition: DispositionEntry[];
  redFlags: string[];
  drugDoses: DrugDoseEntry[];
  references: CustomReference[];
}
