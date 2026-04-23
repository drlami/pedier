import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const cardiacArrestProtocol: DiseaseProtocol = {
  id: 'cardiac-arrest',
  name: 'Cardiac Arrest (PALS)',
  system: 'Shock and Resuscitation',
  description: 'A summary of the PALS algorithm for pediatric cardiac arrest (pulseless arrest). This is a guide and does not replace official PALS certification and training.',
  image: {
    url: "https://picsum.photos/seed/cardiac-arrest/600/400",
    hint: "cpr chest"
  },
  questions: [
      { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
      { id: 'rhythm', questionText: 'Initial Rhythm', type: 'select', options: [
          { label: 'VF / Pulseless VT (Shockable)', value: 'shockable' },
          { label: 'Asystole / PEA (Non-Shockable)', value: 'non_shockable' }
      ]}
  ],
  calculateSeverity: () => ({ level: 'severe', details: ['Cardiac arrest is the ultimate medical emergency.'] }),
  getManagement: (severity, data) => {
    const management = [
        {
            title: "IMMEDIATE ACTIONS (Cycle 1)",
            recommendations: [
                "Start high-quality CPR. Minimize interruptions.",
                "Provide 100% oxygen and support ventilation.",
                "Attach monitor/defibrillator."
            ]
        }
    ];

    if (data.rhythm === 'shockable') {
        management.push({
            title: "VF / Pulseless VT Path",
            recommendations: [
                "1. Rhythm check: VF/pVT -> SHOCK.",
                "2. Immediately resume CPR for 2 minutes. Obtain IV/IO access.",
                "3. Rhythm check: VF/pVT -> SHOCK.",
                "4. Immediately resume CPR for 2 minutes. Administer EPINEPHRINE.",
                "5. Rhythm check: VF/pVT -> SHOCK.",
                "6. Immediately resume CPR for 2 minutes. Administer AMIODARONE or LIDOCAINE.",
                "Continue cycle of CPR, rhythm analysis, and medication administration (Epinephrine every 3-5 min)."
            ]
        });
    } else { // non_shockable
        management.push({
            title: "Asystole / PEA Path",
            recommendations: [
                "1. Rhythm check: Asystole/PEA. No shock advised.",
                "2. Immediately resume CPR for 2 minutes. Obtain IV/IO access. Administer EPINEPHRINE as soon as possible.",
                "3. Rhythm check: Is it shockable? If no -> continue CPR.",
                "4. Immediately resume CPR for 2 minutes. Administer Epinephrine every 3-5 minutes.",
                "Continue cycle of CPR, rhythm analysis, and medication administration.",
                "If rhythm becomes shockable (VF/pVT), move to the shockable rhythm path."
            ]
        });
    }
    
    management.push({
        title: "Treat Reversible Causes (H's and T's)",
        recommendations: [
            "Hypovolemia",
            "Hypoxia",
            "Hydrogen ion (acidosis)",
            "Hypo/hyperkalemia",
            "Hypoglycemia",
            "Hypothermia",
            "Tension pneumothorax",
            "Tamponade, cardiac",
            "Toxins",
            "Thrombosis, pulmonary",
            "Thrombosis, coronary"
        ]
    });

    return management;
  },
  getDisposition: () => ['After return of spontaneous circulation (ROSC), patient requires immediate transfer to a PICU for post-cardiac arrest care.'],
  getRedFlags: () => ['Pulselessness', 'Apnea', 'Unresponsiveness'],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    const shockDose1 = (2 * weight).toFixed(1);
    const shockDose2 = (4 * weight).toFixed(1);

    const epiDose = (0.01 * weight).toFixed(2);
    const epiVol = (0.1 * weight).toFixed(2);

    const amioDose = (5 * weight).toFixed(1);
    const lidoDose = (1 * weight).toFixed(1);

    if (weight > 0) {
        doses.push({
            drugName: "Defibrillation (Shock)",
            dose: `Initial: 2 J/kg (${shockDose1} J). Subsequent: 4 J/kg (${shockDose2} J), may increase up to 10 J/kg (max 200J).`
        });
         doses.push({
            drugName: "Epinephrine (IV/IO, 1:10,000)",
            dose: `0.01 mg/kg = ${epiDose} mg (or ${epiVol} mL). Repeat every 3-5 minutes.`
        });
        doses.push({
            drugName: "Amiodarone (IV/IO)",
            dose: `5 mg/kg bolus (${amioDose} mg). May repeat up to 2 times for refractory VF/pVT.`
        });
        doses.push({
            drugName: "Lidocaine (IV/IO)",
            dose: `1 mg/kg loading dose (${lidoDose} mg).`
        });
    } else {
        doses.push({ drugName: "Defibrillation (Shock)", dose: "Initial: 2 J/kg. Subsequent: 4 J/kg, up to 10 J/kg."});
        doses.push({ drugName: "Epinephrine (IV/IO, 1:10,000)", dose: "0.01 mg/kg. Repeat every 3-5 minutes."});
        doses.push({ drugName: "Amiodarone (IV/IO)", dose: "5 mg/kg bolus. May repeat up to 2 times."});
        doses.push({ drugName: "Lidocaine (IV/IO)", dose: "1 mg/kg loading dose."});
    }
    
    return doses;
  },
  getReferences: () => [
      { title: "PALS Provider Manual (American Heart Association)", url: "https://shopcpr.heart.org/pals-provider-manual" }
  ],
};
