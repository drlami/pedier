import type { DiseaseProtocol } from './types';

export const meningitisEncephalitisProtocol: DiseaseProtocol = {
  id: 'meningitis-encephalitis',
  name: 'Suspected Meningitis / Encephalitis',
  system: 'Fever & Infectious Diseases',
  description: 'This protocol is under construction.',
  image: {
    url: "https://picsum.photos/seed/meningitis-encephalitis/600/400",
    hint: "brain scan"
  },
  questions: [],
  calculateSeverity: () => ({ level: 'unknown', details: ['Under construction'] }),
  getManagement: () => [{ title: "Under Construction", recommendations: ["This protocol is currently being developed."] }],
  getDisposition: () => ['Under construction'],
  getRedFlags: () => ['Under construction'],
  getDrugDoses: () => [],
  getReferences: () => [],
};
