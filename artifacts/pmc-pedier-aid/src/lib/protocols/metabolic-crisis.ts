import type { DiseaseProtocol } from './types';

export const metabolicCrisisProtocol: DiseaseProtocol = {
  id: 'metabolic-crisis',
  name: 'Suspected Metabolic Crisis',
  system: 'Metabolic Diseases',
  description: 'Emergency assessment and pattern-guided management for suspected inborn errors of metabolism in children.',
  image: {
    url: 'https://picsum.photos/seed/metabolic-crisis/600/400',
    hint: 'metabolic laboratory',
  },
  questions: [],
  calculateSeverity: () => ({ level: 'unknown', details: [] }),
  getManagement: () => [],
  getDisposition: () => [],
  getRedFlags: () => [],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: 'BIMDG Emergency Guidelines for Metabolic Disease', url: 'https://www.bimdg.org.uk/' },
    { title: 'ACMG Management of Inborn Errors of Metabolism', url: 'https://www.acmg.net/' },
  ],
};
