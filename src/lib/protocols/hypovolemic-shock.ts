import type { DiseaseProtocol } from './types';

export const hypovolemicShockProtocol: DiseaseProtocol = {
  id: 'hypovolemic-shock',
  name: 'Hypovolemic Shock',
  system: 'Shock and Resuscitation',
  description: 'This protocol is under construction.',
  image: {
    url: "https://picsum.photos/seed/hypovolemic-shock/600/400",
    hint: "blood loss"
  },
  questions: [],
  calculateSeverity: () => ({ level: 'unknown', details: ['Under construction'] }),
  getManagement: () => [{ title: "Under Construction", recommendations: ["This protocol is currently being developed."] }],
  getDisposition: () => ['Under construction'],
  getRedFlags: () => ['Under construction'],
  getDrugDoses: () => [],
  getReferences: () => [],
};
