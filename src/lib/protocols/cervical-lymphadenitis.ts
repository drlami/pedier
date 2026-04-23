import type { DiseaseProtocol } from './types';

export const cervicalLymphadenitisProtocol: DiseaseProtocol = {
  id: 'cervical-lymphadenitis',
  name: 'Cervical Lymphadenitis',
  system: 'Fever & Infectious Diseases',
  description: 'This protocol is under construction.',
  image: {
    url: "https://picsum.photos/seed/cervical-lymphadenitis/600/400",
    hint: "swollen neck"
  },
  questions: [],
  calculateSeverity: () => ({ level: 'unknown', details: ['Under construction'] }),
  getManagement: () => [{ title: "Under Construction", recommendations: ["This protocol is currently being developed."] }],
  getDisposition: () => ['Under construction'],
  getRedFlags: () => ['Under construction'],
  getDrugDoses: () => [],
  getReferences: () => [],
};
