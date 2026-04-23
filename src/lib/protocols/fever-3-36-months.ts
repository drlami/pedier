import type { DiseaseProtocol } from './types';

export const fever3To36MonthsProtocol: DiseaseProtocol = {
  id: 'fever-3-36-months',
  name: 'Fever Without Source (3-36 months)',
  system: 'Fever & Infectious Diseases',
  description: 'This protocol is under construction.',
  image: {
    url: "https://picsum.photos/seed/fever-3-36-months/600/400",
    hint: "toddler temperature"
  },
  questions: [],
  calculateSeverity: () => ({ level: 'unknown', details: ['Under construction'] }),
  getManagement: () => [{ title: "Under Construction", recommendations: ["This protocol is currently being developed."] }],
  getDisposition: () => ['Under construction'],
  getRedFlags: () => ['Under construction'],
  getDrugDoses: () => [],
  getReferences: () => [],
};
