import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const svtProtocol: DiseaseProtocol = {
  id: 'svt',
  name: 'Supraventricular Tachycardia (SVT)',
  system: 'Shock and Resuscitation',
  description: 'A stepwise approach to the diagnosis and management of SVT in children, based on PALS guidelines.',
  image: {
    url: "https://picsum.photos/seed/svt/600/400",
    hint: "ecg monitor"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'isStable', questionText: 'Is the patient hemodynamically stable?', type: 'boolean', info: 'Stable = Normal blood pressure, good perfusion, normal mental status. Unstable = Hypotension, altered mental status, signs of shock.'},
    { id: 'qrsWidth', questionText: 'QRS complex on EKG?', type: 'select', options: [
        { label: 'Narrow (<0.09s)', value: 'narrow' },
        { label: 'Wide (>0.09s)', value: 'wide' }
    ], info: 'SVT is typically a narrow-complex tachycardia.'}
  ],
  calculateSeverity: (data: FormData): Severity => {
    // SVT is always a serious arrhythmia. 'Severity' here relates to hemodynamic stability.
    if (!data.isStable) {
        return { level: 'severe', details: ["Patient is hemodynamically unstable. Immediate intervention required."] };
    }
    if (data.isStable) {
        return { level: 'moderate', details: ["Patient is stable, but SVT requires urgent treatment."] };
    }
    return { level: 'unknown', details: ['Assess patient stability to guide management.'] };
  },
  getManagement: (severity) => {
    switch (severity.level) {
      case 'severe':
        return [{
          title: "UNSTABLE SVT Management",
          recommendations: [
            "This is an emergency. Call for help and a code cart.",
            "If IV/IO access is immediately available, can attempt a rapid push of Adenosine while preparing for cardioversion.",
            "If no immediate access or adenosine is ineffective, perform IMMEDIATE synchronized cardioversion.",
            "Provide sedation if possible without delaying cardioversion.",
            "After conversion, obtain 12-lead EKG and consult Pediatric Cardiology."
          ]
        }];
      case 'moderate':
        return [{
          title: "STABLE SVT Management",
          recommendations: [
            "Establish IV/IO access. Place patient on a cardiac monitor and have resuscitation equipment ready.",
            "Attempt vagal maneuvers while IV is being placed (e.g., ice pack to face for infants, blowing through a straw, bearing down for older children).",
            "If vagal maneuvers fail, administer Adenosine via rapid IV push.",
            "Use a two-syringe technique with a saline flush. Record the EKG strip during administration.",
            "If SVT persists after first dose of adenosine, give a second, larger dose.",
            "If SVT persists after two doses of adenosine, consider other etiologies or medications (e.g., procainamide, amiodarone) in consultation with Pediatric Cardiology.",
            "After conversion, obtain 12-lead EKG and consult Pediatric Cardiology."
          ]
        }];
      default:
        return [];
    }
  },
  getDisposition: () => {
    return [
        "All children with a new presentation of SVT require admission to the hospital for cardiac monitoring and consultation with pediatric cardiology.",
        "Patients who were unstable or required cardioversion should be admitted to a PICU setting."
    ];
  },
  getRedFlags: () => [
    "Signs of shock: hypotension for age, altered mental status, poor perfusion, respiratory distress.",
    "Known underlying structural heart disease.",
    "Wide-complex tachycardia (may be VTach, not SVT - requires different management).",
    "Failure of SVT to convert with two doses of adenosine."
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (weight > 0) {
        const adenoDose1 = Math.min(0.1 * weight, 6);
        const adenoDose2 = Math.min(0.2 * weight, 12);
        const cardioDose1 = (0.5 * weight).toFixed(1);
        const cardioDose2 = (1 * weight).toFixed(1);
        const cardioDose3 = (2 * weight).toFixed(1);

        doses.push({
            drugName: "Adenosine - First Dose",
            dose: `0.1 mg/kg (max 6 mg) = ${adenoDose1.toFixed(2)} mg`,
            notes: "Rapid IV/IO push followed immediately by a rapid saline flush."
        });
        doses.push({
            drugName: "Adenosine - Second Dose",
            dose: `0.2 mg/kg (max 12 mg) = ${adenoDose2.toFixed(2)} mg`,
            notes: "Give if first dose is ineffective. Rapid IV/IO push."
        });
        doses.push({
            drugName: "Synchronized Cardioversion",
            dose: `Initial attempt: 0.5 - 1 J/kg (${cardioDose1} - ${cardioDose2} J)`,
            notes: `If unsuccessful, increase to 2 J/kg (${cardioDose3} J). Ensure "sync" mode is on. Provide sedation if possible.`
        });
    } else {
         doses.push({
            drugName: "Adenosine - First Dose",
            dose: `0.1 mg/kg (max 6 mg)`,
            notes: "Enter weight for calculation."
        });
         doses.push({
            drugName: "Adenosine - Second Dose",
            dose: `0.2 mg/kg (max 12 mg)`,
            notes: "Enter weight for calculation."
        });
         doses.push({
            drugName: "Synchronized Cardioversion",
            dose: `Initial attempt: 0.5 - 1 J/kg. Subsequent: 2 J/kg.`,
            notes: `Enter weight for calculation.`
        });
    }
    return doses;
  },
  getReferences: () => [
    { title: "PALS Provider Manual (American Heart Association)", url: "https://shopcpr.heart.org/pals-provider-manual" },
    { title: "UpToDate: Management of supraventricular tachycardia (SVT) in children", url: "https://www.uptodate.com/contents/management-of-supraventricular-tachycardia-svt-in-children" }
  ],
};
