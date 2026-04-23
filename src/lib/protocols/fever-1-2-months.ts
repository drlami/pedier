import type { DiseaseProtocol } from './types';

export const fever1To2MonthsProtocol: DiseaseProtocol = {
  id: 'fever-1-2-months',
  name: 'Fever Without Source (1-2 months)',
  system: 'Fever & Infectious Diseases',
  description: 'This protocol is under construction.',
  image: {
    url: "https://picsum.photos/seed/fever-1-2-months/600/400",
    hint: "infant temperature"
  },
  questions: [],
  calculateSeverity: () => ({ level: 'unknown', details: ['Under construction'] }),
  getManagement: () => [{ title: "Under Construction", recommendations: ["This protocol is currently being developed."] }],
  getDisposition: () => ['Under construction'],
  getRedFlags: () => ['Under construction'],
  getDrugDoses: () => [],
  getReferences: () => [],
};
