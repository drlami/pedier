import type { DiseaseProtocol, FormData, Severity } from './types';

export const headacheRedFlagsProtocol: DiseaseProtocol = {
  id: 'headache-red-flags',
  name: 'Headache Red Flags',
  system: 'Neurology',
  description: 'A cognitive aid to identify "red flag" signs and symptoms in a child presenting with a headache, suggesting serious underlying pathology.',
  image: {
    url: "https://picsum.photos/seed/headache-red-flags/600/400",
    hint: "headache pain"
  },
  questions: [
    { id: 'isWorstHeadache', questionText: 'Is this the "worst headache of their life" (thunderclap onset)?', type: 'boolean' },
    { id: 'hasFocalDeficit', questionText: 'Are there any focal neurologic deficits on exam?', type: 'boolean' },
    { id: 'hasPapilledema', questionText: 'Is papilledema present on fundoscopic exam?', type: 'boolean' },
    { id: 'isPositional', questionText: 'Is the headache worse when lying down or in the morning?', type: 'boolean' },
    { id: 'wakesFromSleep', questionText: 'Does the headache awaken the child from sleep?', type: 'boolean' },
    { id: 'hasAlteredMentalStatus', questionText: 'Is there associated confusion or altered mental status?', type: 'boolean' },
    { id: 'hasFeverStiffness', questionText: 'Is there fever and neck stiffness?', type: 'boolean' },
    { id: 'hasTrauma', questionText: 'Recent significant head trauma?', type: 'boolean' },
    { id: 'isProgressive', questionText: 'Is the headache pattern progressively worsening over days/weeks?', type: 'boolean' },
    { id: 'ageUnder5', questionText: 'Is the child under 5 years old?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const redFlags: string[] = [];
    if (data.isWorstHeadache) redFlags.push("Thunderclap onset (worst headache of life)");
    if (data.hasFocalDeficit) redFlags.push("Focal neurologic deficits");
    if (data.hasPapilledema) redFlags.push("Papilledema");
    if (data.isPositional) redFlags.push("Positional changes (worse lying down)");
    if (data.wakesFromSleep) redFlags.push("Wakes from sleep");
    if (data.hasAlteredMentalStatus) redFlags.push("Altered mental status");
    if (data.hasFeverStiffness) redFlags.push("Fever and neck stiffness");
    if (data.hasTrauma) redFlags.push("Recent head trauma");
    if (data.isProgressive) redFlags.push("Progressively worsening pattern");
    if (data.ageUnder5) redFlags.push("Age < 5 years");

    if (redFlags.length > 0) {
      return { level: 'severe', details: ["Red flag(s) present, warranting urgent investigation.", ...redFlags] };
    }
    
    return { level: 'mild', details: ["No red flags identified. Likely a primary headache disorder (e.g., migraine, tension-type)."] };
  },
  getManagement: (severity, data) => {
    if (severity.level === 'severe') {
      return [{
        title: "Management of Headache with Red Flags",
        recommendations: [
          "Urgent neuroimaging is indicated. Emergent non-contrast head CT is the first step for thunderclap headache or trauma.",
          "MRI with and without contrast is the preferred study for most other red flags (suspicion of tumor, abscess, hydrocephalus).",
          "Neurology consultation is required.",
          "If fever and neck stiffness are present, evaluate for meningitis/encephalitis (consider LP after imaging if signs of increased ICP).",
          "If thunderclap headache, consider CT angiography to rule out subarachnoid hemorrhage from aneurysm or AVM.",
          "Provide symptomatic treatment for pain while workup is proceeding."
        ]
      }];
    }
    return [{
      title: "Management of Primary Headache",
      recommendations: [
        "Treat symptomatically with analgesics (e.g., Ibuprofen, Acetaminophen).",
        "For suspected migraine, consider triptans in appropriate age groups.",
        "Provide a quiet, dark environment.",
        "Arrange for outpatient follow-up with primary care or neurology.",
        "Discuss headache diary and lifestyle modifications (hydration, sleep)."
      ]
    }];
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
      return ["Admission to the hospital is required for urgent neuroimaging, specialist consultation, and further management."];
    }
    return ["Discharge home with analgesics and close follow-up is appropriate if red flags are absent and the headache is improving.", "Provide strict return precautions."];
  },
  getRedFlags: () => [
    "SNOOPPP: Systemic symptoms (fever, weight loss), Neurologic signs/symptoms, Onset (sudden/thunderclap), Older age (new headache in >50, but for peds think <5), Papilledema, Positional, Pattern change, Precipitated by cough/valsalva, Progressive."
  ],
  getDrugDoses: () => [
      { drugName: "Ibuprofen", dose: "10 mg/kg per dose" },
      { drugName: "Acetaminophen", dose: "15 mg/kg per dose" },
      { drugName: "Sumatriptan (nasal or subcutaneous)", dose: "Age and weight dependent, consult formulary", notes: "For migraine treatment in adolescents."}
  ],
  getReferences: () => [{ title: "American Academy of Neurology: Practice parameter: evaluation of children and adolescents with recurrent headaches", url: "https://www.aan.com/Guidelines/home/GuidelineDetail/85" }],
};
