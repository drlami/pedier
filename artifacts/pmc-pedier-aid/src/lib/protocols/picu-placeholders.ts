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

/**
 * Essential PICU section — reorganized into 6 balanced critical-care systems.
 *
 * IMPORTANT: `picu-mech-ventilation` and `picu-hfov` are rendered by bespoke
 * components special-cased in `pages/disease.tsx`. Do NOT rename those two IDs.
 * All other entries are stubs ("Coming Soon") pending real protocol content.
 */
export const picuPlaceholders: DiseaseProtocol[] = [
  // 1. Respiratory & Airway
  // NOTE: 'picu-respiratory-failure' is now a real protocol (picu-respiratory-failure.ts).
  // NOTE: 'picu-status-asthmaticus' is now a real mmpData pathway (picu-status-asthmaticus.ts).
  // The entries below remain placeholders because they are bespoke interactive
  // components special-cased in pages/disease.tsx (ARDS, NIV, mech-vent, HFOV, vent-troubleshooting).
  createPlaceholder('picu-ards', 'ARDS / oxygenation management', 'Respiratory & Airway', 'OI/OSI severity grading (PALICC-2), lung-protective targets, and the oxygenation escalation ladder.'),
  createPlaceholder('picu-niv', 'Non-invasive ventilation (HFNC / CPAP / BiPAP)', 'Respiratory & Airway', 'Interface selection, weight-based starting settings, titration, and success/failure criteria.'),
  createPlaceholder('picu-mech-ventilation', 'Mechanical ventilation -details', 'Respiratory & Airway', 'Invasive ventilation setup, modes, and management.'),
  createPlaceholder('picu-hfov', 'HFOV (High-Frequency Oscillatory Ventilation)', 'Respiratory & Airway', 'High-frequency oscillatory ventilation guide.'),
  createPlaceholder('picu-vent-troubleshooting', 'Ventilator troubleshooting (DOPES)', 'Respiratory & Airway', 'Rapid responder for acute deterioration in a ventilated child — DOPES and peak-vs-plateau logic.'),
  // NOTE: 'picu-pneumothorax' is now a real mmpData pathway (picu-pneumothorax.ts).
  // NOTE: 'picu-extubation-readiness' is now a real mmpData pathway (picu-extubation-readiness.ts).

  // 2. Shock & Cardiovascular
  // NOTE: 'picu-shock-approach' is now a real mmpData pathway (picu-shock-approach.ts).
  // NOTE: 'picu-septic-shock' is now a real mmpData pathway (picu-septic-shock.ts).
  // NOTE: 'picu-cardiogenic-shock' is now a real mmpData pathway (picu-cardiogenic-shock.ts).
  // NOTE: 'picu-post-arrest' is now a real mmpData pathway (picu-post-arrest.ts).
  // NOTE: 'picu-svt-vt' is now a real mmpData pathway (picu-svt-vt.ts).
  // NOTE: 'picu-hypertensive-emergency' is now a real mmpData pathway (picu-hypertensive-emergency.ts).

  // 3. Neurocritical Care
  // NOTE: 'picu-raised-icp' is now a real mmpData pathway (picu-raised-icp.ts).
  // NOTE: 'picu-coma' is now a real mmpData pathway (picu-coma.ts).
  // NOTE: 'picu-status-epilepticus' is now a real mmpData pathway (picu-status-epilepticus.ts).
  // NOTE: 'picu-sedation-withdrawal' is now a real mmpData pathway (picu-sedation-withdrawal.ts).

  // 4. Renal, Fluids & Electrolytes
  // NOTE: 'picu-aki-crrt' is now a real mmpData pathway (picu-aki-crrt.ts).
  // NOTE: 'picu-fluid-electrolytes' is now a real mmpData pathway (picu-fluid-electrolytes.ts).
  // NOTE: 'picu-critical-electrolytes' is now a real mmpData pathway (picu-critical-electrolytes.ts).
  // NOTE: 'picu-severe-dka' is now a real mmpData pathway (picu-severe-dka.ts).

  // 5. Sepsis, Infection & Hematology
  // NOTE: 'picu-sepsis' is now a real mmpData pathway (picu-sepsis.ts).
  // NOTE: 'picu-febrile-neutropenia' is now a real mmpData pathway (picu-febrile-neutropenia.ts).
  // NOTE: 'picu-severe-anemia' is now a real mmpData pathway (picu-severe-anemia.ts).
  // NOTE: 'picu-dic-bleeding' is now a real mmpData pathway (picu-dic-bleeding.ts).

  // 6. Toxicology & Environmental
  // NOTE: 'picu-unknown-poisoning' is now a real mmpData pathway (picu-unknown-poisoning.ts).
  // NOTE: 'picu-organophosphate' is now a real mmpData pathway (picu-organophosphate.ts).
  // NOTE: 'picu-envenomation' is now a real mmpData pathway (picu-envenomation.ts).
];
