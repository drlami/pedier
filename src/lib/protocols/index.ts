import type { DiseaseProtocol } from './types';
import { bronchiolitisProtocol } from './bronchiolitis';
import { asthmaProtocol } from './asthma';
import { croupProtocol } from './croup';
import { gastroenteritisProtocol } from './gastroenteritis';
import { pneumoniaProtocol } from './pneumonia';
import { tracheitisProtocol } from './tracheitis';
import { epiglottitisProtocol } from './epiglottitis';
import { fbaProtocol } from './fba';
import { cyanosisProtocol } from './cyanosis';
import { apneaProtocol } from './apnea';


export const allProtocols: DiseaseProtocol[] = [
  bronchiolitisProtocol,
  asthmaProtocol,
  croupProtocol,
  gastroenteritisProtocol,
  pneumoniaProtocol,
  tracheitisProtocol,
  epiglottitisProtocol,
  fbaProtocol,
  cyanosisProtocol,
  apneaProtocol,
];

export const getProtocolById = (id: string): DiseaseProtocol | undefined => {
  return allProtocols.find((p) => p.id === id);
};
