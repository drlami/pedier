import type { DiseaseProtocol } from './types';

export const feverNeutropeniaProtocol: DiseaseProtocol = {
  id: 'fever-neutropenia',
  name: 'Fever with Neutropenia',
  system: 'Fever & Infectious Diseases',
  description: 'This protocol is under construction.',
  image: {
    url: "https://picsum.photos/seed/fever-neutropenia/600/400",
    hint: "blood cells"
  },
  questions: [],
  calculateSeverity: () => ({ level: 'unknown', details: ['Under construction'] }),
  getManagement: () => [{ title: "Under Construction", recommendations: ["This protocol is currently being developed."] }],
  getDisposition: () => ['Under construction'],
  getRedFlags: () => ['Under construction'],
  getDrugDoses: () => [],
  getReferences: () => [],
};
