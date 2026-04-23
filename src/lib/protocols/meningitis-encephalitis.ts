import type { DiseaseProtocol, FormData, Severity } from './types';

export const meningitisEncephalitisProtocol: DiseaseProtocol = {
  id: 'meningitis-encephalitis',
  name: 'Suspected Meningitis / Encephalitis',
  system: 'Fever & Infectious Diseases',
  description: 'Initial evaluation and emergency management of a child with suspected central nervous system (CNS) infection.',
  image: {
    url: "https://picsum.photos/seed/meningitis-encephalitis/600/400",
    hint: "brain scan"
  },
  questions: [
    { id: 'ageMonths', questionText: 'Age in months', type: 'number' },
    { id: 'isToxic', questionText: 'Does the child appear toxic, septic, or in shock?', type: 'boolean' },
    { id: 'mentalStatus', questionText: 'Mental Status', type: 'select', options: [{label: 'Normal', value: 'normal'}, {label: 'Irritable', value: 'irritable'}, {label: 'Lethargic/Confused', value: 'lethargic'}] },
    { id: 'nuchalRigidity', questionText: 'Neck stiffness / nuchal rigidity?', type: 'boolean' },
    { id: 'bulgingFontanelle', questionText: 'Bulging fontanelle (in infants)?', type: 'boolean' },
    { id: 'seizures', questionText: 'Focal or generalized seizures?', type: 'boolean' },
    { id: 'petechialRash', questionText: 'Non-blanching petechial or purpuric rash?', type: 'boolean' },
    { id: 'focalDeficit', questionText: 'Focal neurologic deficits?', type: 'boolean', info: 'e.g., cranial nerve palsies, unilateral weakness' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    
    if (data.isToxic || data.petechialRash || data.seizures || data.focalDeficit || data.mentalStatus === 'lethargic') {
      if (data.isToxic) details.push("Toxic/septic appearance");
      if (data.petechialRash) details.push("Non-blanching rash (concern for meningococcemia)");
      if (data.seizures) details.push("Seizures present");
      if (data.focalDeficit) details.push("Focal neurologic deficits (concern for encephalitis or abscess)");
      if (data.mentalStatus === 'lethargic') details.push("Lethargy/Confusion");
      details.push("Life-threatening signs present. Immediate intervention required.");
      return { level: 'severe', details };
    }

    if (data.nuchalRigidity || data.bulgingFontanelle) {
      if (data.nuchalRigidity) details.push("Nuchal rigidity");
      if (data.bulgingFontanelle) details.push("Bulging fontanelle");
      details.push("High suspicion for meningitis. Urgent workup needed.");
      return { level: 'moderate', details };
    }

    return { level: 'unknown', details: ["Suspicion for CNS infection remains. Proceed with workup."] };
  },
  getManagement: (severity, data) => {
    const isNeonate = Number(data.ageMonths) < 1;
    const management = [];

    if (severity.level === 'severe') {
      management.push({
        title: "EMERGENCY: Severe CNS Infection",
        recommendations: [
          "Provide immediate resuscitation (ABC's). Treat shock aggressively with fluid boluses and pressors if needed.",
          "DO NOT DELAY ANTIBIOTICS. Administer broad-spectrum IV antibiotics and IV Acyclovir immediately after drawing blood cultures.",
          "Consider delaying Lumbar Puncture (LP) if patient is unstable, has signs of herniation (Cushing's triad, posturing), or coagulopathy. Obtain CT head before LP in these cases.",
          "Control seizures with benzodiazepines and load with anti-epileptic drugs.",
          "Administer Dexamethasone for suspected bacterial meningitis in infants/children > 6 weeks old (ideally just before or with first antibiotic dose)."
        ]
      });
    } else { // Moderate or unknown
      management.push({
        title: "Urgent Workup for CNS Infection",
        recommendations: [
          "Obtain IV access and draw blood for culture, CBC, CRP, electrolytes, and glucose.",
          "Proceed with Lumbar Puncture for CSF analysis (cell count, protein, glucose, gram stain, culture, viral studies) if no contraindications.",
          "Administer empiric IV antibiotics and Acyclovir immediately after LP (or before if LP is delayed).",
          "Consider Dexamethasone for suspected bacterial meningitis in infants/children > 6 weeks old."
        ]
      });
    }
     management.push({
        title: "Empiric Antibiotic Regimens",
        recommendations: [
            isNeonate ? "Neonate (<1 month): Ampicillin + Cefotaxime (or Gentamicin) + Acyclovir." :
            "Infant (1-3 months): Ampicillin + Ceftriaxone (or Cefotaxime) + Vancomycin + Acyclovir.",
            "Child (>3 months): Ceftriaxone + Vancomycin + Acyclovir."
        ]
    });
    return management;
  },
  getDisposition: (severity, data) => {
    return ["All patients with suspected meningitis or encephalitis require immediate admission to the hospital, typically to a PICU, for empiric treatment, monitoring, and completion of diagnostic workup."];
  },
  getRedFlags: () => [
    "Toxic, septic, or shock-like state",
    "Non-blanching petechial or purpuric rash",
    "Altered mental status (lethargy, confusion, coma)",
    "Bulging fontanelle in an infant",
    "New onset seizures, especially with fever",
    "Focal neurologic deficits",
    "Signs of impending herniation (Cushing's triad: hypertension, bradycardia, irregular respirations)"
  ],
  getDrugDoses: () => [
    { drugName: "Ceftriaxone (IV)", dose: "100 mg/kg/day divided q12h (Meningitis dose, max 4g/day)" },
    { drugName: "Cefotaxime (IV)", dose: "200-300 mg/kg/day divided q6-8h (Meningitis dose)", notes: "Preferred over Ceftriaxone in neonates." },
    { drugName: "Vancomycin (IV)", dose: "60 mg/kg/day divided q6h (Meningitis dose)" },
    { drugName: "Ampicillin (IV)", dose: "200-400 mg/kg/day divided q4-6h (Meningitis dose)", notes: "For Listeria coverage in neonates and young infants." },
    { drugName: "Acyclovir (IV)", dose: "Varies by age. Neonates: 20 mg/kg/dose q8h. Others: 10-15 mg/kg/dose q8h.", notes: "For empiric coverage of HSV encephalitis." },
    { drugName: "Dexamethasone (IV)", dose: "0.15 mg/kg/dose q6h for 2-4 days", notes: "For bacterial meningitis in children > 6 weeks. Give before or with first antibiotic dose." }
  ],
  getReferences: () => [
    { title: "IDSA Clinical Practice Guideline for the Management of Bacterial Meningitis", url: "https://academic.oup.com/cid/article/39/9/1267/310793" },
    { title: "UpToDate: Bacterial meningitis in children: Dexamethasone and other adjunctive therapy", url: "https://www.uptodate.com/contents/bacterial-meningitis-in-children-dexamethasone-and-other-adjunctive-therapy" }
  ],
};
