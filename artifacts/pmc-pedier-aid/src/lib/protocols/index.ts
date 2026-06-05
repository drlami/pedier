import type { DiseaseProtocol } from './types';
import { bronchiolitisProtocol } from './bronchiolitis';
import { asthmaProtocol } from './asthma';
import { wardAnemiaProtocol } from './ward-anemia';
import { croupProtocol } from './croup';
import { dehydrationGastroenteritisProtocol } from './dehydration-gastroenteritis';
import { pneumoniaProtocol } from './pneumonia';
import { tracheitisProtocol } from './tracheitis';
import { wardAtopicDermatitisProtocol } from './ward-atopic-dermatitis';
import { wardUrticariaAngioedemaProtocol } from './ward-urticaria-angioedema';
import { epiglottitisProtocol } from './epiglottitis';
import { fbaProtocol } from './fba';
import { cyanosisProtocol } from './cyanosis';
import { apneaProtocol } from './apnea';
import { cervicalLymphadenitisProtocol } from './cervical-lymphadenitis';
import { feverWithoutSourceProtocol } from './fever-without-source';
import { feverNeutropeniaProtocol } from './fever-neutropenia';
import { feverRashProtocol } from './fever-rash';
import { mastoiditisProtocol } from './mastoiditis';
import { meningitisEncephalitisProtocol } from './meningitis-encephalitis';
import { orbitalCellulitisProtocol } from './orbital-cellulitis';
import { periorbitalCellulitisProtocol } from './periorbital-cellulitis';
import { septicShockProtocol } from './septic-shock';
import { sstiProtocol } from './ssti';
import { tachycardiaSvtProtocol } from './tachycardia-svt';
import { heartFailureMyocarditisProtocol } from './heart-failure-myocarditis';
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
import { abdominalDistentionConstipationProtocol } from './abdominal-distention-constipation';
import { giBleedingProtocol } from './gi-bleeding';
import { intussusceptionProtocol } from './intussusception';
import { shockManagementProtocol } from './shock-management';
import { anaphylacticShockProtocol } from './anaphylactic-shock';
import { bradycardiaProtocol } from './bradycardia';
import { murmurWithSymptomsProtocol } from './murmur-with-symptoms';
import { chestPainInChildrenProtocol } from './chest-pain-in-children';
import { syncopeProtocol } from './syncope';
import { palpitationsProtocol } from './palpitations';
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
import { urinaryTractInfectionProtocol } from './urinary-tract-infection';
import { metabolicCrisisProtocol } from './metabolic-crisis';


import { headTraumaProtocol } from './head-trauma';
import { smokeInhalationProtocol } from './smoke-inhalation-burns';
import { vpShuntMalfunctionProtocol } from './vp-shunt-malfunction';
import { wardPneumoniaCapProtocol } from './ward-pneumonia-cap';
import { wardAsthmaProtocol } from './ward-asthma';
import { wardBronchiolitisProtocol } from './ward-bronchiolitis';
import { wardCroupProtocol } from './ward-croup';
import { wardPertussisProtocol } from './ward-pertussis';
import { wardBacterialTracheitisProtocol } from './ward-bacterial-tracheitis';
import { wardAspirationPneumoniaProtocol } from './ward-aspiration-pneumonia';
import { wardArfProtocol } from './ward-arf';
import { wardHypertensionProtocol } from './ward-hypertension';
import { wardPleuralEffusionProtocol } from './ward-pleural-effusion';
import { wardMeningitisProtocol } from './ward-meningitis';
import { wardMitochondrialProtocol } from './ward-mitochondrial';
import { wardFebrileNeutropeniaProtocol } from './ward-febrile-neutropenia';
import { wardSepticArthritisOsteoProtocol } from './ward-septic-arthritis-osteo';
import { wardTyphoidProtocol } from './ward-typhoid';
import { wardTyrosinemiaProtocol } from './ward-tyrosinemia';
import { wardLeishmaniasisProtocol } from './ward-leishmaniasis';
import { wardBrucellosisProtocol } from './ward-brucellosis';
import { wardOrbitalPeriorbitalCellulitisProtocol } from './ward-orbital-periorbital-cellulitis';
import { wardOrganicAcidemiasProtocol } from './ward-organic-acidemias';
import { wardFaodProtocol } from './ward-faod';
import { wardMsudProtocol } from './ward-msud';
import { wardMastoiditisProtocol } from './ward-mastoiditis';
import { wardMediastinalMassProtocol } from './ward-mediastinal-mass';
import { wardChickenpoxProtocol } from './ward-chickenpox';
import { wardPancytopeniaProtocol } from './ward-pancytopenia';
import { wardAihaProtocol } from './ward-aiha';
import { wardDkaProtocol } from './ward-dka';
import { wardDiabetesInsipidusProtocol } from './ward-diabetes-insipidus';
import { wardSiadhProtocol } from './ward-siadh';
import { wardAdrenalCrisisProtocol } from './ward-adrenal-crisis';
import { wardMetabolicCrisisProtocol } from './ward-metabolic-crisis';
import { wardUreaCycleProtocol } from './ward-urea-cycle';
import { wardViralEncephalitisProtocol } from './ward-viral-encephalitis';
import { wardInfectiveEndocarditisProtocol } from './ward-infective-endocarditis';
import { wardFeverNoSourceProtocol } from './ward-fever-no-source';
import { wardFuoProtocol } from './ward-fuo';
import { wardSkinCellulitisProtocol } from './ward-skin-cellulitis';
import { wardGastroenteritisProtocol } from './ward-gastroenteritis';
import { wardG6pdProtocol } from './ward-g6pd';
import { wardGsd1Protocol } from './ward-gsd1';
import { wardIntussusceptionProtocol } from './ward-intussusception';
import { wardItpProtocol } from './ward-itp';
import { wardGiBleedingProtocol } from './ward-gi-bleeding';
import { wardHypoglycemiaProtocol } from './ward-hypoglycemia';
import { wardChronicAbdoPainProtocol } from './ward-chronic-abdo-pain';
import { wardChronicDiarrheaProtocol } from './ward-chronic-diarrhea';
import { wardRecurrentVomitingProtocol } from './ward-recurrent-vomiting';
import { wardJaundiceChildProtocol } from './ward-jaundice-child';
import { wardHepatitisAProtocol } from './ward-hepatitis-a';
import { wardLiverFailureProtocol } from './ward-liver-failure';
import { wardFailureToThriveProtocol } from './ward-failure-to-thrive';
import { wardKawasakiProtocol } from './ward-kawasaki';
import { wardPfapaProtocol } from './ward-pfapa';
import { wardFmfProtocol } from './ward-fmf';
import { wardGalactosemiaProtocol } from './ward-galactosemia';
import { wardHspProtocol } from './ward-hsp';
import { wardHemophiliaProtocol } from './ward-hemophilia';
import { wardSleProtocol } from './ward-sle';
import { wardJiaProtocol } from './ward-jia';
import { wardStatusEpilepticusProtocol } from './ward-status-epilepticus';
import { wardGbsProtocol } from './ward-gbs';
import { wardAdemProtocol } from './ward-adem';
import { wardSickleCellProtocol } from './ward-sickle-cell';
import { wardTumorLysisProtocol } from './ward-tumor-lysis';
import { wardThalassemiaProtocol } from './ward-thalassemia';
import { wardViralExanthemsProtocol } from './ward-viral-exanthems';
import { wardSjsTenProtocol } from './ward-sjs-ten';
import { wardScabiesProtocol } from './ward-scabies';
import { wardSsssProtocol } from './ward-ssss';
import { wardUtiProtocol } from './ward-uti';
import { wardHeartFailureProtocol } from './ward-heart-failure';
import { wardMyocarditisProtocol } from './ward-myocarditis';

// New Poisoning Protocols
import { wardParacetamolProtocol } from './ward-paracetamol';
import { wardSalicylateProtocol } from './ward-salicylate';
import { wardIronProtocol } from './ward-iron';
import { wardCausticProtocol } from './ward-caustic';
import { wardHydrocarbonProtocol } from './ward-hydrocarbon';

import { wardNephroticFirstProtocol } from './ward-nephrotic-first';
import { wardNephroticRelapseProtocol } from './ward-nephrotic-relapse';
import { wardNephriticSyndromeProtocol } from './ward-nephritic-syndrome';
import { wardAkiProtocol } from './ward-aki';
import { wardHusProtocol } from './ward-hus';
import { wardCkdOptimizationProtocol } from './ward-ckd-optimization';
import { picuPlaceholders } from './picu-placeholders';
import { nicuStubs } from './nicu-stubs';
import { nicuRdsProtocol } from './nicu-rds';
import { nicuTtnProtocol } from './nicu-ttn';
import { nicuMasProtocol } from './nicu-mas';
import { nicuPphnProtocol } from './nicu-pphn';
import { nicuBpdProtocol } from './nicu-bpd';
import { nicuApneaProtocol } from './nicu-apnea';
import { nicuAirLeakProtocol } from './nicu-air-leak';
import { nicuCongenitalPneumoniaProtocol } from './nicu-congenital-pneumonia';
import { nicuPulmonaryHemorrhageProtocol } from './nicu-pulmonary-hemorrhage';
import { picuRespiratoryFailureProtocol } from './picu-respiratory-failure';
import { picuSepticShockProtocol } from './picu-septic-shock';
import { picuRaisedIcpProtocol } from './picu-raised-icp';
import { picuStatusEpilepticusProtocol } from './picu-status-epilepticus';
import { picuSevereDkaProtocol } from './picu-severe-dka';
import { picuAkiCrrtProtocol } from './picu-aki-crrt';
import { picuShockApproachProtocol } from './picu-shock-approach';
import { picuPostArrestProtocol } from './picu-post-arrest';
import { picuCardiogenicShockProtocol } from './picu-cardiogenic-shock';
import { picuComaProtocol } from './picu-coma';
import { picuSedationWithdrawalProtocol } from './picu-sedation-withdrawal';
import { picuFluidElectrolytesProtocol } from './picu-fluid-electrolytes';
import { picuExtubationReadinessProtocol } from './picu-extubation-readiness';
import { picuPneumothoraxProtocol } from './picu-pneumothorax';
import { picuStatusAsthmaticusProtocol } from './picu-status-asthmaticus';
import { picuSvtVtProtocol } from './picu-svt-vt';
import { picuHypertensiveEmergencyProtocol } from './picu-hypertensive-emergency';
import { picuCriticalElectrolytesProtocol } from './picu-critical-electrolytes';
import { picuSepsisProtocol } from './picu-sepsis';
import { picuFebrileNeutropeniaProtocol } from './picu-febrile-neutropenia';
import { picuSevereAnemiaProtocol } from './picu-severe-anemia';
import { picuDicBleedingProtocol } from './picu-dic-bleeding';
import { picuUnknownPoisoningProtocol } from './picu-unknown-poisoning';
import { picuOrganophosphateProtocol } from './picu-organophosphate';
import { picuEnvenomationProtocol } from './picu-envenomation';

export const allProtocols: DiseaseProtocol[] = [
  // NICU — Respiratory (full protocols)
  nicuRdsProtocol,
  nicuTtnProtocol,
  nicuMasProtocol,
  nicuPphnProtocol,
  nicuBpdProtocol,
  nicuApneaProtocol,
  nicuAirLeakProtocol,
  nicuCongenitalPneumoniaProtocol,
  nicuPulmonaryHemorrhageProtocol,
  // NICU — remaining stubs (other systems)
  ...nicuStubs,

  // PICU
  ...picuPlaceholders,
  picuRespiratoryFailureProtocol,
  picuSepticShockProtocol,
  picuRaisedIcpProtocol,
  picuStatusEpilepticusProtocol,
  picuSevereDkaProtocol,
  picuAkiCrrtProtocol,
  picuShockApproachProtocol,
  picuPostArrestProtocol,
  picuCardiogenicShockProtocol,
  picuComaProtocol,
  picuSedationWithdrawalProtocol,
  picuFluidElectrolytesProtocol,
  picuExtubationReadinessProtocol,
  picuPneumothoraxProtocol,
  picuStatusAsthmaticusProtocol,
  picuSvtVtProtocol,
  picuHypertensiveEmergencyProtocol,
  picuCriticalElectrolytesProtocol,
  picuSepsisProtocol,
  picuFebrileNeutropeniaProtocol,
  picuSevereAnemiaProtocol,
  picuDicBleedingProtocol,
  picuUnknownPoisoningProtocol,
  picuOrganophosphateProtocol,
  picuEnvenomationProtocol,
  bronchiolitisProtocol,
  asthmaProtocol,
  croupProtocol,
  dehydrationGastroenteritisProtocol,
  headTraumaProtocol,
  pneumoniaProtocol,
  smokeInhalationProtocol,
  tracheitisProtocol,
  epiglottitisProtocol,
  fbaProtocol,
  cyanosisProtocol,
  apneaProtocol,
  cervicalLymphadenitisProtocol,
  feverWithoutSourceProtocol,
  feverNeutropeniaProtocol,
  feverRashProtocol,
  mastoiditisProtocol,
  meningitisEncephalitisProtocol,
  orbitalCellulitisProtocol,
  periorbitalCellulitisProtocol,
  sstiProtocol,
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
  abdominalDistentionConstipationProtocol,
  giBleedingProtocol,
  intussusceptionProtocol,
  shockManagementProtocol,
  septicShockProtocol,
  anaphylacticShockProtocol,
  bradycardiaProtocol,
  tachycardiaSvtProtocol,
  heartFailureMyocarditisProtocol,
  murmurWithSymptomsProtocol,
  chestPainInChildrenProtocol,
  syncopeProtocol,
  palpitationsProtocol,
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
  urinaryTractInfectionProtocol,
  metabolicCrisisProtocol,
  wardPneumoniaCapProtocol,
  wardAsthmaProtocol,
  wardBronchiolitisProtocol,
  wardCroupProtocol,
  wardPertussisProtocol,
  wardBacterialTracheitisProtocol,
  wardAspirationPneumoniaProtocol,
  wardAnemiaProtocol,
  wardArfProtocol,
  wardHypertensionProtocol,
  wardAdrenalCrisisProtocol,
  wardMetabolicCrisisProtocol,
  wardUreaCycleProtocol,
  wardOrganicAcidemiasProtocol,
  wardFaodProtocol,
  wardMsudProtocol,
  wardGalactosemiaProtocol,
  wardGsd1Protocol,
  wardPleuralEffusionProtocol,
  wardMeningitisProtocol,
  wardMitochondrialProtocol,
  wardFebrileNeutropeniaProtocol,
  wardSepticArthritisOsteoProtocol,
  wardTyphoidProtocol,
  wardTyrosinemiaProtocol,
  wardLeishmaniasisProtocol,
  wardBrucellosisProtocol,
  wardOrbitalPeriorbitalCellulitisProtocol,
  wardMastoiditisProtocol,
  wardMediastinalMassProtocol,
  wardChickenpoxProtocol,
  wardPancytopeniaProtocol,
  wardViralEncephalitisProtocol,
  wardInfectiveEndocarditisProtocol,
  wardAtopicDermatitisProtocol,
  wardUrticariaAngioedemaProtocol,
  wardFeverNoSourceProtocol,
  wardFuoProtocol,
  wardSkinCellulitisProtocol,
  wardGastroenteritisProtocol,
  wardG6pdProtocol,
  wardIntussusceptionProtocol,
  wardItpProtocol,
  wardGiBleedingProtocol,
  wardAihaProtocol,
  wardHypoglycemiaProtocol,
  wardChronicAbdoPainProtocol,
  wardChronicDiarrheaProtocol,
  wardRecurrentVomitingProtocol,
  wardJaundiceChildProtocol,
  wardHepatitisAProtocol,
  wardLiverFailureProtocol,
  wardFailureToThriveProtocol,
  wardKawasakiProtocol,
  wardPfapaProtocol,
  wardFmfProtocol,
  wardHspProtocol,
  wardHemophiliaProtocol,
  wardSleProtocol,
  wardJiaProtocol,
  wardStatusEpilepticusProtocol,
  wardGbsProtocol,
  wardAdemProtocol,
  wardSickleCellProtocol,
  wardTumorLysisProtocol,
  wardThalassemiaProtocol,
  wardViralExanthemsProtocol,
  wardSjsTenProtocol,
  wardScabiesProtocol,
  wardSsssProtocol,
  wardUtiProtocol,
  wardHeartFailureProtocol,
  wardMyocarditisProtocol,
  wardNephroticFirstProtocol,
  wardNephroticRelapseProtocol,
  wardNephriticSyndromeProtocol,
  wardAkiProtocol,
  wardHusProtocol,
  wardCkdOptimizationProtocol,
  wardDkaProtocol,
  wardDiabetesInsipidusProtocol,
  wardSiadhProtocol,
  wardParacetamolProtocol,
  wardSalicylateProtocol,
  wardIronProtocol,
  wardCausticProtocol,
  wardHydrocarbonProtocol,
];

export const CLINICAL_SYSTEMS = [
  "Respiratory System",
  "Cardiovascular System",
  "Gastrointestinal & Hepatology",
  "Neurological System",
  "Renal & Urinary System",
  "Hematology & Oncology",
  "Endocrinology",
  "Metabolic Diseases",
  "Infectious Diseases",
  "Immunology & Rheumatology",
  "Dermatology",
  "Nutrition & Growth",
  "Shock and Resuscitation",
  "Toxins and Poisoning",
  "Neonatology",
  "Poisoning and Toxins"
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
