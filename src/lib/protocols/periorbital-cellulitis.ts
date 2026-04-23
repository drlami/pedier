import type { DiseaseProtocol } from './types';

export const periorbitalCellulitisProtocol: DiseaseProtocol = {
  id: 'periorbital-cellulitis',
  name: 'Periorbital Cellulitis',
  system: 'Fever & Infectious Diseases',
  description: 'This protocol is under construction.',
  image: {
    url: "https://picsum.photos/seed/periorbital-cellulitis/600/400",
    hint: "swollen eye"
  },
  questions: [],
  calculateSeverity: () => ({ level: 'unknown', details: ['Under construction'] }),
  getManagement: () => [{ title: "Under Construction", recommendations: ["This protocol is currently being developed."] }],
  getDisposition: () => ['Under construction'],
  getRedFlags: () => ['Under construction'],
  getDrugDoses: () => [],
  getReferences: () => [],
};
