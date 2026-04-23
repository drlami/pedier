import type { DiseaseProtocol } from './types';

export const svtProtocol: DiseaseProtocol = {
  id: 'svt',
  name: 'SVT',
  system: 'Shock and Resuscitation',
  description: 'This protocol is under construction.',
  image: {
    url: "https://picsum.photos/seed/svt/600/400",
    hint: "ecg monitor"
  },
  questions: [],
  calculateSeverity: () => ({ level: 'unknown', details: ['Under construction'] }),
  getManagement: () => [{ title: "Under Construction", recommendations: ["This protocol is currently being developed."] }],
  getDisposition: () => ['Under construction'],
  getRedFlags: () => ['Under construction'],
  getDrugDoses: () => [],
  getReferences: () => [],
};
