import type { DiseaseProtocol } from './types';

export const cardiogenicShockProtocol: DiseaseProtocol = {
  id: 'cardiogenic-shock',
  name: 'Cardiogenic Shock',
  system: 'Shock and Resuscitation',
  description: 'This protocol is under construction.',
  image: {
    url: "https://picsum.photos/seed/cardiogenic-shock/600/400",
    hint: "heart failure"
  },
  questions: [],
  calculateSeverity: () => ({ level: 'unknown', details: ['Under construction'] }),
  getManagement: () => [{ title: "Under Construction", recommendations: ["This protocol is currently being developed."] }],
  getDisposition: () => ['Under construction'],
  getRedFlags: () => ['Under construction'],
  getDrugDoses: () => [],
  getReferences: () => [],
};
