import type { DiseaseProtocol } from './types';

export const fluidResuscitationProtocol: DiseaseProtocol = {
  id: 'fluid-resuscitation',
  name: 'Fluid Resuscitation',
  system: 'Shock and Resuscitation',
  description: 'This protocol is under construction.',
  image: {
    url: "https://picsum.photos/seed/fluid-resuscitation/600/400",
    hint: "iv fluid"
  },
  questions: [],
  calculateSeverity: () => ({ level: 'unknown', details: ['Under construction'] }),
  getManagement: () => [{ title: "Under Construction", recommendations: ["This protocol is currently being developed."] }],
  getDisposition: () => ['Under construction'],
  getRedFlags: () => ['Under construction'],
  getDrugDoses: () => [],
  getReferences: () => [],
};
