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
import { shockManagementProtocol } from './shock-management';
import { fluidResuscitationProtocol } from './fluid-resuscitation';
import { anaphylacticShockProtocol } from './anaphylactic-shock';
import { bradycardiaProtocol } from './bradycardia';
import { tachycardiaProtocol } from './tachycardia';
import { svtProtocol } from './svt';
import { murmurWithSymptomsProtocol } from './murmur-with-symptoms';
import { chestPainInChildrenProtocol } from './chest-pain-in-children';
import { syncopeProtocol } from './syncope';
import { palpitationsProtocol } from './palpitations';
import { suspectedMyocarditisProtocol } from './suspected-myocarditis';
import { suspectedHeartFailureProtocol } from './suspected-heart-failure';
import { snakeBiteProtocol } from './snake-bite';
import { scorpionStingProtocol } from './scorpion-sting';
import { paracetamolToxicityProtocol } from './paracetamol-toxicity';
import { ironToxicityProtocol } from './iron-toxicity';
import { organophosphorusIngestionProtocol } from './organophosphorus-ingestion';
import { chlorineInhalationProtocol } from './chlorine-inhalation';
import { coPoisoningProtocol } from './co-poisoning';
import { dkaProtocol } from './dka';
import { adrenalCrisisProtocol } from './adrenal-crisis';
import { hypoglycemiaProtocol } from './hypoglycemia';
import { hyperkalemiaProtocol } from './hyperkalemia';
import { hypokalemiaProtocol } from './hypokalemia';
import { hypomagnesemiaProtocol } from './hypomagnesemia';
import { hypernatremiaProtocol } from './hypernatremia';
import { hyponatremiaProtocol } from './hyponatremia';
import { hypercalcemiaProtocol } from './hypercalcemia';
import { hypocalcemiaProtocol } from './hypocalcemia';
import { acuteRenalFailureProtocol } from './acute-renal-failure';
import { chronicRenalFailureProtocol } from './chronic-renal-failure';
import { nephroticSyndromeProtocol } from './nephrotic-syndrome';
import { nephriticSyndromeProtocol } from './nephritic-syndrome';
import { urinaryTractInfectionProtocol } from './urinary-tract-infection';
import { metabolicCrisisProtocol } from './metabolic-crisis';


import { headTraumaProtocol } from './head-trauma';
import { smokeInhalationProtocol } from './smoke-inhalation-burns';
import { oxygenEscalationProtocol } from './oxygen-escalation-guide';
import { vpShuntMalfunctionProtocol } from './vp-shunt-malfunction';
import { wardPneumoniaCapProtocol } from './ward-pneumonia-cap';
import { wardAsthmaProtocol } from './ward-asthma';
import { wardBronchiolitisProtocol } from './ward-bronchiolitis';
import { wardCroupProtocol } from './ward-croup';
import { wardPertussisProtocol } from './ward-pertussis';
import { wardBacterialTracheitisProtocol } from './ward-bacterial-tracheitis';
import { wardAspirationPneumoniaProtocol } from './ward-aspiration-pneumonia';
import { wardPleuralEffusionProtocol } from './ward-pleural-effusion';
import { wardMeningitisProtocol } from './ward-meningitis';
import { wardFebrileNeutropeniaProtocol } from './ward-febrile-neutropenia';
import { wardSepticArthritisOsteoProtocol } from './ward-septic-arthritis-osteo';
import { wardTyphoidProtocol } from './ward-typhoid';
import { wardLeishmaniasisProtocol } from './ward-leishmaniasis';
import { wardBrucellosisProtocol } from './ward-brucellosis';
import { wardOrbitalPeriorbitalCellulitisProtocol } from './ward-orbital-periorbital-cellulitis';
import { wardMastoiditisProtocol } from './ward-mastoiditis';
import { wardViralEncephalitisProtocol } from './ward-viral-encephalitis';
import { wardInfectiveEndocarditisProtocol } from './ward-infective-endocarditis';
import { wardFeverNoSourceProtocol } from './ward-fever-no-source';
import { wardFuoProtocol } from './ward-fuo';
import { wardSkinCellulitisProtocol } from './ward-skin-cellulitis';
import { wardGastroenteritisProtocol } from './ward-gastroenteritis';
import { wardIntussusceptionProtocol } from './ward-intussusception';
import { wardGiBleedingProtocol } from './ward-gi-bleeding';
import { wardChronicAbdoPainProtocol } from './ward-chronic-abdo-pain';
import { wardChronicDiarrheaProtocol } from './ward-chronic-diarrhea';
import { wardRecurrentVomitingProtocol } from './ward-recurrent-vomiting';
import { wardJaundiceChildProtocol } from './ward-jaundice-child';
import { wardHepatitisAProtocol } from './ward-hepatitis-a';
import { wardLiverFailureProtocol } from './ward-liver-failure';
import { wardFailureToThriveProtocol } from './ward-failure-to-thrive';
import { wardKawasakiProtocol } from './ward-kawasaki';
import { wardStatusEpilepticusProtocol } from './ward-status-epilepticus';
import { wardUtiProtocol } from './ward-uti';
import { wardNephroticFirstProtocol } from './ward-nephrotic-first';
import { wardNephroticRelapseProtocol } from './ward-nephrotic-relapse';
import { wardNephriticSyndromeProtocol } from './ward-nephritic-syndrome';
import { wardAkiProtocol } from './ward-aki';
import { wardHusProtocol } from './ward-hus';
import { wardCkdOptimizationProtocol } from './ward-ckd-optimization';

export const allProtocols: DiseaseProtocol[] = [
  bronchiolitisProtocol,
  asthmaProtocol,
  croupProtocol,
  dehydrationGastroenteritisProtocol,
  headTraumaProtocol,
  pneumoniaProtocol,
  smokeInhalationProtocol,
  oxygenEscalationProtocol,
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
  vpShuntMalfunctionProtocol,
  persistentVomitingProtocol,
  biliousVomitingProtocol,
  abdominalPainProtocol,
  constipationVsObstructionProtocol,
  giBleedingProtocol,
  intussusceptionProtocol,
  abdominalDistentionProtocol,
  shockManagementProtocol,
  fluidResuscitationProtocol,
  anaphylacticShockProtocol,
  bradycardiaProtocol,
  tachycardiaProtocol,
  svtProtocol,
  murmurWithSymptomsProtocol,
  chestPainInChildrenProtocol,
  syncopeProtocol,
  palpitationsProtocol,
  suspectedMyocarditisProtocol,
  suspectedHeartFailureProtocol,
  snakeBiteProtocol,
  scorpionStingProtocol,
  paracetamolToxicityProtocol,
  ironToxicityProtocol,
  organophosphorusIngestionProtocol,
  chlorineInhalationProtocol,
  coPoisoningProtocol,
  dkaProtocol,
  adrenalCrisisProtocol,
  hypoglycemiaProtocol,
  hyperkalemiaProtocol,
  hypokalemiaProtocol,
  hypomagnesemiaProtocol,
  hypernatremiaProtocol,
  hyponatremiaProtocol,
  hypercalcemiaProtocol,
  hypocalcemiaProtocol,
  acuteRenalFailureProtocol,
  chronicRenalFailureProtocol,
  nephroticSyndromeProtocol,
  nephriticSyndromeProtocol,
  urinaryTractInfectionProtocol,
  metabolicCrisisProtocol,
  wardPneumoniaCapProtocol,
  wardAsthmaProtocol,
  wardBronchiolitisProtocol,
  wardCroupProtocol,
  wardPertussisProtocol,
  wardBacterialTracheitisProtocol,
  wardAspirationPneumoniaProtocol,
  wardPleuralEffusionProtocol,
  wardMeningitisProtocol,
  wardFebrileNeutropeniaProtocol,
  wardSepticArthritisOsteoProtocol,
  wardTyphoidProtocol,
  wardLeishmaniasisProtocol,
  wardBrucellosisProtocol,
  wardOrbitalPeriorbitalCellulitisProtocol,
  wardMastoiditisProtocol,
  wardViralEncephalitisProtocol,
  wardInfectiveEndocarditisProtocol,
  wardFeverNoSourceProtocol,
  wardFuoProtocol,
  wardSkinCellulitisProtocol,
  wardGastroenteritisProtocol,
  wardIntussusceptionProtocol,
  wardGiBleedingProtocol,
  wardChronicAbdoPainProtocol,
  wardChronicDiarrheaProtocol,
  wardRecurrentVomitingProtocol,
  wardJaundiceChildProtocol,
  wardHepatitisAProtocol,
  wardLiverFailureProtocol,
  wardFailureToThriveProtocol,
  wardKawasakiProtocol,
  wardStatusEpilepticusProtocol,
  wardUtiProtocol,
  wardNephroticFirstProtocol,
  wardNephroticRelapseProtocol,
  wardNephriticSyndromeProtocol,
  wardAkiProtocol,
  wardHusProtocol,
  wardCkdOptimizationProtocol,
];

export const CLINICAL_SYSTEMS = [
  "Cardiology",
  "Electrolyte Disturbances",
  "Endocrinology",
  "Gastrointestinal",
  "Infectious Diseases",
  "Metabolic Diseases",
  "Neonatology",
  "Nephrology",
  "Neurology",
  "Respiratory",
  "Shock and Resuscitation",
  "Toxins and Poisoning",
] as const;

export type ClinicalSystem = typeof CLINICAL_SYSTEMS[number];

export const getProtocolById = (id: string): DiseaseProtocol | undefined => {
  return allProtocols.find((p) => p.id === id);
};

/**
 * Merges built-in protocols with user-saved custom protocols.
 * Custom protocols with the same ID as a built-in protocol act as overrides
 * (replacing the built-in entry). New custom protocols are appended.
 */
export function mergeProtocolsWithOverrides(
  customProtocols: DiseaseProtocol[]
): DiseaseProtocol[] {
  const overriddenIds = new Set(customProtocols.map((p) => p.id));
  const base = allProtocols.filter((p) => !overriddenIds.has(p.id));
  return [...base, ...customProtocols];
}
