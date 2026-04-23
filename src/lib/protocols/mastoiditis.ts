import type { DiseaseProtocol } from './types';

export const mastoiditisProtocol: DiseaseProtocol = {
  id: 'mastoiditis',
  name: 'Mastoiditis Suspicion',
  system: 'Fever & Infectious Diseases',
  description: 'This protocol is under construction.',
  image: {
    url: "https://picsum.photos/seed/mastoiditis/600/400",
    hint: "ear xray"
  },
  questions: [],
  calculateSeverity: () => ({ level: 'unknown', details: ['Under construction'] }),
  getManagement: () => [{ title: "Under Construction", recommendations: ["This protocol is currently being developed."] }],
  getDisposition: () => ['Under construction'],
  getRedFlags: () => ['Under construction'],
  getDrugDoses: () => [],
  getReferences: () => [],
};
