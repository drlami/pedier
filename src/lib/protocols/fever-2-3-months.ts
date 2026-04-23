import type { DiseaseProtocol } from './types';

export const fever2To3MonthsProtocol: DiseaseProtocol = {
  id: 'fever-2-3-months',
  name: 'Fever Without Source (2-3 months)',
  system: 'Fever & Infectious Diseases',
  description: 'This protocol is under construction.',
  image: {
    url: "https://picsum.photos/seed/fever-2-3-months/600/400",
    hint: "baby temperature"
  },
  questions: [],
  calculateSeverity: () => ({ level: 'unknown', details: ['Under construction'] }),
  getManagement: () => [{ title: "Under Construction", recommendations: ["This protocol is currently being developed."] }],
  getDisposition: () => ['Under construction'],
  getRedFlags: () => ['Under construction'],
  getDrugDoses: () => [],
  getReferences: () => [],
};
