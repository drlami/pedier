import type { DiseaseProtocol } from './types';

export const sepsisRecognitionProtocol: DiseaseProtocol = {
  id: 'sepsis-recognition',
  name: 'Sepsis Recognition',
  system: 'Fever & Infectious Diseases',
  description: 'This protocol is under construction.',
  image: {
    url: "https://picsum.photos/seed/sepsis-recognition/600/400",
    hint: "sick child"
  },
  questions: [],
  calculateSeverity: () => ({ level: 'unknown', details: ['Under construction'] }),
  getManagement: () => [{ title: "Under Construction", recommendations: ["This protocol is currently being developed."] }],
  getDisposition: () => ['Under construction'],
  getRedFlags: () => ['Under construction'],
  getDrugDoses: () => [],
  getReferences: () => [],
};
