import type { DiseaseProtocol } from './types';

export const feverNeonateProtocol: DiseaseProtocol = {
  id: 'fever-neonate',
  name: 'Fever in Neonate (<28 days)',
  system: 'Fever & Infectious Diseases',
  description: 'This protocol is under construction.',
  image: {
    url: "https://picsum.photos/seed/fever-neonate/600/400",
    hint: "newborn checkup"
  },
  questions: [],
  calculateSeverity: () => ({ level: 'unknown', details: ['Under construction'] }),
  getManagement: () => [{ title: "Under Construction", recommendations: ["This protocol is currently being developed."] }],
  getDisposition: () => ['Under construction'],
  getRedFlags: () => ['Under construction'],
  getDrugDoses: () => [],
  getReferences: () => [],
};
