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
import { cervicalLymphadenitisProtocol } from './cervical-lymphadenitis';
import { fever1To2MonthsProtocol } from './fever-1-2-months';
import { fever2To3MonthsProtocol } from './fever-2-3-months';
import { fever3To36MonthsProtocol } from './fever-3-36-months';
import { feverNeonateProtocol } from './fever-neonate';
import { feverNeutropeniaProtocol } from './fever-neutropenia';
import { feverRashProtocol } from './fever-rash';
import { mastoiditisProtocol } from './mastoiditis';
import { meningitisEncephalitisProtocol } from './meningitis-encephalitis';
import { orbitalCellulitisProtocol } from './orbital-cellulitis';
import { periorbitalCellulitisProtocol } from './periorbital-cellulitis';
import { septicShockProtocol } from './septic-shock';
import { sstiProtocol } from './ssti';
import { toxicAssessmentProtocol } from './toxic-assessment';
import { viralVsBacterialProtocol } from './viral-vs-bacterial';


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
  cervicalLymphadenitisProtocol,
  fever1To2MonthsProtocol,
  fever2To3MonthsProtocol,
  fever3To36MonthsProtocol,
  feverNeonateProtocol,
  feverNeutropeniaProtocol,
  feverRashProtocol,
  mastoiditisProtocol,
  meningitisEncephalitisProtocol,
  orbitalCellulitisProtocol,
  periorbitalCellulitisProtocol,
  septicShockProtocol,
  sstiProtocol,
  toxicAssessmentProtocol,
  viralVsBacterialProtocol,
];

export const getProtocolById = (id: string): DiseaseProtocol | undefined => {
  return allProtocols.find((p) => p.id === id);
};
