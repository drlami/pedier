import type { DiseaseProtocol } from './types';
import { bronchiolitisProtocol } from './bronchiolitis';
import { asthmaProtocol } from './asthma';
import { croupProtocol } from './croup';
import { dehydrationGastroenteritisProtocol } from './dehydration-gastroenteritis';
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
import { febrileSeizureProtocol } from './febrile-seizure';
import { firstAfebrileSeizureProtocol } from './first-afebrile-seizure';
import { statusEpilepticusProtocol } from './status-epilepticus';
import { alteredMentalStatusProtocol } from './altered-mental-status';
import { headacheRedFlagsProtocol } from './headache-red-flags';
import { acuteFlaccidWeaknessProtocol } from './acute-flaccid-weakness';
import { acuteAtaxiaProtocol } from './acute-ataxia';
import { raisedIcpSuspicionProtocol } from './raised-icp-suspicion';
import { pedsStrokeProtocol } from './peds-stroke';
import { persistentVomitingProtocol } from './persistent-vomiting';
import { biliousVomitingProtocol } from './bilious-vomiting';
import { abdominalPainProtocol } from './abdominal-pain';
import { constipationVsObstructionProtocol } from './constipation-vs-obstruction';
import { giBleedingProtocol } from './gi-bleeding';
import { intussusceptionProtocol } from './intussusception';
import { abdominalDistentionProtocol } from './abdominal-distention';


export const allProtocols: DiseaseProtocol[] = [
  bronchiolitisProtocol,
  asthmaProtocol,
  croupProtocol,
  dehydrationGastroenteritisProtocol,
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
  febrileSeizureProtocol,
  firstAfebrileSeizureProtocol,
  statusEpilepticusProtocol,
  alteredMentalStatusProtocol,
  headacheRedFlagsProtocol,
  acuteFlaccidWeaknessProtocol,
  acuteAtaxiaProtocol,
  raisedIcpSuspicionProtocol,
  pedsStrokeProtocol,
  persistentVomitingProtocol,
  biliousVomitingProtocol,
  abdominalPainProtocol,
  constipationVsObstructionProtocol,
  giBleedingProtocol,
  intussusceptionProtocol,
  abdominalDistentionProtocol,
];

export const getProtocolById = (id: string): DiseaseProtocol | undefined => {
  return allProtocols.find((p) => p.id === id);
};
