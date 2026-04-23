import type { DiseaseProtocol } from './types';

export const viralVsBacterialProtocol: DiseaseProtocol = {
  id: 'viral-vs-bacterial',
  name: 'Viral Syndrome vs Bacterial Infection',
  system: 'Fever & Infectious Diseases',
  description: 'This protocol is under construction.',
  image: {
    url: "https://picsum.photos/seed/viral-vs-bacterial/600/400",
    hint: "microscope virus"
  },
  questions: [],
  calculateSeverity: () => ({ level: 'unknown', details: ['Under construction'] }),
  getManagement: () => [{ title: "Under Construction", recommendations: ["This protocol is currently being developed."] }],
  getDisposition: () => ['Under construction'],
  getRedFlags: () => ['Under construction'],
  getDrugDoses: () => [],
  getReferences: () => [],
};
