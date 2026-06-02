import type { DiseaseProtocol, FormData, Severity } from './types';

const createPlaceholder = (id: string, name: string, system: string, description: string): DiseaseProtocol => ({
  id,
  name,
  system,
  description,
  unit: 'picu',
  category: 'general',
  image: { url: '', hint: '' },
  questions: [],
  calculateSeverity: (data: FormData): Severity => ({ level: 'unknown', details: ['Coming Soon'] }),
  getManagement: (severity: Severity, data: FormData) => [],
  getDisposition: (severity: Severity, data: FormData) => [],
  getRedFlags: (severity: Severity, data: FormData) => [],
  getDrugDoses: (severity: Severity, data: FormData) => [],
  getReferences: () => [],
});

export const picuPlaceholders: DiseaseProtocol[] = [
  // 1. Respiratory System
  createPlaceholder('picu-respiratory-failure', 'Respiratory failure approach', 'Respiratory System', 'Coming soon.'),
  createPlaceholder('picu-status-asthmaticus', 'Status asthmaticus', 'Respiratory System', 'Coming soon.'),
  createPlaceholder('picu-ards', 'ARDS basics', 'Respiratory System', 'Coming soon.'),
  createPlaceholder('picu-pleural-effusion', 'Pleural effusion / empyema', 'Respiratory System', 'Coming soon.'),
  createPlaceholder('picu-pneumothorax', 'Pneumothorax', 'Respiratory System', 'Coming soon.'),
  createPlaceholder('picu-post-extubation-stridor', 'Post-extubation stridor', 'Respiratory System', 'Coming soon.'),
  createPlaceholder('picu-oxygen-escalation', 'Oxygen escalation pathway', 'Respiratory System', 'Coming soon.'),
  createPlaceholder('picu-hfnc-guide', 'HFNC guide', 'Respiratory System', 'Coming soon.'),
  createPlaceholder('picu-cpap-bipap', 'CPAP / BiPAP guide', 'Respiratory System', 'Coming soon.'),
  createPlaceholder('picu-mech-ventilation', 'Mechanical ventilation -details', 'Respiratory System', 'Coming soon.'),
  createPlaceholder('picu-hfov', 'HFOV (High-Frequency Oscillatory Ventilation)', 'Respiratory System', 'Coming soon.'),
  createPlaceholder('picu-vent-troubleshooting', 'Ventilator troubleshooting', 'Respiratory System', 'Coming soon.'),
  createPlaceholder('picu-extubation-readiness', 'Extubation readiness', 'Respiratory System', 'Coming soon.'),

  // 2. Cardiovascular / Shock
  createPlaceholder('picu-shock-approach', 'Shock approach', 'Cardiovascular / Shock', 'Coming soon.'),
  createPlaceholder('picu-septic-shock', 'Septic shock', 'Cardiovascular / Shock', 'Coming soon.'),
  createPlaceholder('picu-hypovolemic-shock', 'Hypovolemic shock', 'Cardiovascular / Shock', 'Coming soon.'),
  createPlaceholder('picu-cardiogenic-shock', 'Cardiogenic shock basics', 'Cardiovascular / Shock', 'Coming soon.'),
  createPlaceholder('picu-post-arrest', 'Post-cardiac arrest care', 'Cardiovascular / Shock', 'Coming soon.'),
  createPlaceholder('picu-svt-vt', 'SVT , VT', 'Cardiovascular / Shock', 'Coming soon.'),

  // 3. Neurology
  createPlaceholder('picu-raised-icp', 'Raised ICP', 'Neurology', 'Coming soon.'),
  createPlaceholder('picu-coma', 'Coma / altered consciousness approach', 'Neurology', 'Coming soon.'),
  createPlaceholder('picu-sedation-withdrawal', 'Sedation withdrawal', 'Neurology', 'Coming soon.'),
  createPlaceholder('picu-head-trauma', 'Head Trauma , and neuroprotective measures', 'Neurology', 'Coming soon.'),

  // 7. Hematology / Blood
  createPlaceholder('picu-severe-anemia', 'Severe anemia', 'Hematology / Blood', 'Coming soon.'),
  createPlaceholder('picu-acute-bleeding', 'Acute bleeding approach', 'Hematology / Blood', 'Coming soon.'),
  createPlaceholder('picu-dic', 'DIC basics', 'Hematology / Blood', 'Coming soon.'),

  // 8. Toxicology
  createPlaceholder('picu-unknown-poisoning', 'Unknown poisoning approach', 'Toxicology', 'Coming soon.'),
  createPlaceholder('picu-organophosphate', 'Organophosphate poisoning', 'Toxicology', 'Coming soon.')
];
