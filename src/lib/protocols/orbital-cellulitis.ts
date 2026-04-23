import type { DiseaseProtocol } from './types';

export const orbitalCellulitisProtocol: DiseaseProtocol = {
  id: 'orbital-cellulitis',
  name: 'Orbital Cellulitis',
  system: 'Fever & Infectious Diseases',
  description: 'This protocol is under construction.',
  image: {
    url: "https://picsum.photos/seed/orbital-cellulitis/600/400",
    hint: "eye scan"
  },
  questions: [],
  calculateSeverity: () => ({ level: 'unknown', details: ['Under construction'] }),
  getManagement: () => [{ title: "Under Construction", recommendations: ["This protocol is currently being developed."] }],
  getDisposition: () => ['Under construction'],
  getRedFlags: () => ['Under construction'],
  getDrugDoses: () => [],
  getReferences: () => [],
};
