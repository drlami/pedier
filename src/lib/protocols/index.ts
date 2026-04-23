import type { DiseaseProtocol } from './types';
import { bronchiolitisProtocol } from './bronchiolitis';
import { asthmaProtocol } from './asthma';
import { croupProtocol } from './croup';
import { gastroenteritisProtocol } from './gastroenteritis';

export const allProtocols: DiseaseProtocol[] = [
  bronchiolitisProtocol,
  asthmaProtocol,
  croupProtocol,
  gastroenteritisProtocol,
];

export const getProtocolById = (id: string): DiseaseProtocol | undefined => {
  return allProtocols.find((p) => p.id === id);
};
