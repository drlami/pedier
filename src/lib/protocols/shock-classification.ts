import type { DiseaseProtocol } from './types';

export const shockClassificationProtocol: DiseaseProtocol = {
  id: 'shock-classification',
  name: 'Shock Classification',
  system: 'Shock and Resuscitation',
  description: 'This protocol is under construction.',
  image: {
    url: "https://picsum.photos/seed/shock-classification/600/400",
    hint: "flow chart"
  },
  questions: [],
  calculateSeverity: () => ({ level: 'unknown', details: ['Under construction'] }),
  getManagement: () => [{ title: "Under Construction", recommendations: ["This protocol is currently being developed."] }],
  getDisposition: () => ['Under construction'],
  getRedFlags: () => ['Under construction'],
  getDrugDoses: () => [],
  getReferences: () => [],
};
