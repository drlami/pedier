import type { DiseaseProtocol } from './types';

export const tachycardiaProtocol: DiseaseProtocol = {
  id: 'tachycardia',
  name: 'Tachycardia Algorithm',
  system: 'Shock and Resuscitation',
  description: 'This protocol is under construction.',
  image: {
    url: "https://picsum.photos/seed/tachycardia/600/400",
    hint: "fast heartbeat"
  },
  questions: [],
  calculateSeverity: () => ({ level: 'unknown', details: ['Under construction'] }),
  getManagement: () => [{ title: "Under Construction", recommendations: ["This protocol is currently being developed."] }],
  getDisposition: () => ['Under construction'],
  getRedFlags: () => ['Under construction'],
  getDrugDoses: () => [],
  getReferences: () => [],
};
