import type { DiseaseProtocol } from './types';

export const toxicAssessmentProtocol: DiseaseProtocol = {
  id: 'toxic-assessment',
  name: 'Toxic vs Non-toxic Child Assessment',
  system: 'Fever & Infectious Diseases',
  description: 'This protocol is under construction.',
  image: {
    url: "https://picsum.photos/seed/toxic-assessment/600/400",
    hint: "worried parent"
  },
  questions: [],
  calculateSeverity: () => ({ level: 'unknown', details: ['Under construction'] }),
  getManagement: () => [{ title: "Under Construction", recommendations: ["This protocol is currently being developed."] }],
  getDisposition: () => ['Under construction'],
  getRedFlags: () => ['Under construction'],
  getDrugDoses: () => [],
  getReferences: () => [],
};
