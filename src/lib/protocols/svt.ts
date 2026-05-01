import type { DiseaseProtocol, FormData, Severity, DrugDose } from './types';

export const svtProtocol: DiseaseProtocol = {
  id: 'svt',
  name: 'Supraventricular Tachycardia (SVT)',
  system: 'Shock and Resuscitation',
  description: 'PALS-aligned stepwise management of pediatric SVT. SVT is typically characterized by a sudden onset, narrow QRS complexes, and rates >220 bpm (infants) or >180 bpm (children).',
  image: {
    url: "https://picsum.photos/seed/svt/600/400",
    hint: "ecg monitor"
  },
  questions: [
    { id: 'weight', questionText: 'Patient Weight', type: 'number', unit: 'kg' },
    { id: 'isStable', questionText: 'Is the patient hemodynamically stable?', type: 'boolean', info: 'Stable = Normal BP for age, alert/interactive, good perfusion. Unstable = Hypotension, altered mental status, or signs of shock.'},
    { id: 'qrsWidth', questionText: 'QRS complex on EKG?', type: 'select', options: [
        { label: 'Narrow (≤0.09s)', value: 'narrow' },
        { label: 'Wide (>0.09s)', value: 'wide' }
    ], info: 'Narrow complexes suggest SVT. Wide complexes are suspicious for VTach or SVT with aberrancy.'}
  ],
  calculateSeverity: (data: FormData): Severity => {
    if (!data.isStable) {
        return { level: 'severe', details: ["Patient is hemodynamically unstable. This is a critical emergency."] };
    }
    return { level: 'moderate', details: ["SVT confirmed in a hemodynamically stable patient."] };
  },
  getManagement: (severity, data) => {
    const management = [];

    // Global Mandatory Initial Steps
    management.push({
        title: "IMMEDIATE INITIAL ACTIONS (Mandatory)",
        recommendations: [
            "1. PERFORM 12-LEAD EKG IMMEDIATELY: Must be done as soon as SVT is suspected to confirm diagnosis and QRS width.",
            "2. CONSULT PEDIATRIC CARDIOLOGY: A consultation must be made for ALL patients with suspected or confirmed SVT, regardless of stability.",
            "3. Place on continuous cardiac monitor, pulse oximetry, and frequent BP cycling.",
            "4. Provide 100% supplemental oxygen."
        ]
    });

    if (severity.level === 'severe') {
      management.push({
        title: "UNSTABLE SVT: Emergency Intervention",
        recommendations: [
          "1. ACT FAST: Call for the Resuscitation Team and reiterate urgency to Cardiology.",
          "2. SYNCHRONIZED CARDIOVERSION: Perform immediately if EKG confirms SVT. Initial dose: 0.5-1 J/kg. If unsuccessful, increase to 2 J/kg.",
          "3. CRITICAL: Ensure 'SYNC' mode is selected on the monitor before every shock to avoid inducing Ventricular Fibrillation.",
          "4. ADENOSINE: If IV/IO access is already available, you can try Adenosine (0.1 mg/kg) while the defibrillator is charging, but DO NOT delay cardioversion.",
          "5. SEDATION: If the patient is conscious, provide brief sedation before cardioversion, but ONLY if it does not delay the life-saving procedure."
        ]
      });
    } else {
      management.push({
        title: "STABLE SVT: Stepwise Management",
        recommendations: [
          "1. VAGAL MANEUVERS: Attempt while preparing for medications. Infants: Ice pack to the upper face (forehead/nose) for 15-20 seconds. Children: Blowing into a 10mL syringe, or performing a Valsalva maneuver.",
          "2. IV/IO ACCESS: Establish access immediately. Ideally use a large-bore IV in the right antecubital fossa (closest to the heart).",
          "3. ADENOSINE: First-line medication. Must be given via RAPID IV PUSH using the two-syringe technique (medication followed immediately by a 10-20mL saline flush).",
          "4. REPEAT ADENOSINE: If first dose fails, give a second, larger dose (0.2 mg/kg) after 2 minutes.",
          "5. REFRACTORY SVT: If two doses of adenosine fail, re-consult Cardiology immediately before administering further agents (e.g., Amiodarone)."
        ]
      });
    }

    management.push({
        title: "Post-Conversion Care",
        recommendations: [
            "1. Obtain a repeat 12-lead EKG immediately after conversion to check for underlying patterns like WPW (Wolff-Parkinson-White).",
            "2. Maintain continuous monitoring for at least 4-8 hours post-conversion.",
            "3. Long-term management and disposition will be coordinated with the Pediatric Cardiology team."
        ]
    });

    return management;
  },
  getDisposition: () => {
    return [
        "Admission to hospital for continuous cardiac monitoring is MANDATORY for all new-onset SVT cases.",
        "Unstable patients or those requiring cardioversion must be admitted to the PICU.",
        "Cardiology MUST clear the patient and provide a follow-up plan prior to any discharge (only applicable to known chronic patients who have converted)."
    ];
  },
  getRedFlags: () => [
    "Signs of shock (hypotension, cold extremities, delayed cap refill).",
    "Altered mental status or lethargy.",
    "Wide QRS complex (>0.09s) - suspect Ventricular Tachycardia.",
    "Failure of Adenosine to reach the heart (injecting too slowly or too distal).",
    "Underlying congenital heart disease or cardiomyopathy."
  ],
  getDrugDoses: (severity, data) => {
    const weight = Number(data.weight) || 0;
    const doses: DrugDose[] = [];

    if (weight > 0) {
        const adeno1 = Math.min(0.1 * weight, 6);
        const adeno2 = Math.min(0.2 * weight, 12);
        const amio = Math.min(5 * weight, 300);

        doses.push({
            drugName: "Adenosine (1st dose)",
            dose: `0.1 mg/kg (max 6 mg) = ${adeno1.toFixed(2)} mg`,
            notes: "RAPID IV push followed by rapid 10-20mL saline flush. Use two-syringe technique."
        });
        doses.push({
            drugName: "Adenosine (2nd dose)",
            dose: `0.2 mg/kg (max 12 mg) = ${adeno2.toFixed(2)} mg`,
            notes: "Give if 1st dose fails. RAPID IV push."
        });
        doses.push({
            drugName: "Synchronized Cardioversion",
            dose: `Initial: 0.5 - 1 J/kg (${(0.5*weight).toFixed(0)}-${(1*weight).toFixed(0)} J). 2nd: 2 J/kg (${(2*weight).toFixed(0)} J).`,
            notes: "Must be in 'SYNC' mode. Ensure Cardiology is consulted."
        });
        doses.push({
            drugName: "Amiodarone (Refractory)",
            dose: `5 mg/kg = ${amio.toFixed(1)} mg IV`,
            notes: "Requires Cardiology Consultation BEFORE use. Infuse over 20-60 minutes."
        });
    } else {
         doses.push({ drugName: "Adenosine (1st dose)", dose: "0.1 mg/kg (max 6 mg)", notes: "Rapid push + flush." });
         doses.push({ drugName: "Adenosine (2nd dose)", dose: "0.2 mg/kg (max 12 mg)", notes: "Rapid push." });
         doses.push({ drugName: "Synchronized Cardioversion", dose: "Initial: 0.5 - 1 J/kg. 2nd: 2 J/kg.", notes: "Ensure 'SYNC' mode." });
         doses.push({ drugName: "Amiodarone", dose: "5 mg/kg IV", notes: "Consult Cardiology first. Infuse over 20-60 min." });
    }
    return doses;
  },
  getReferences: () => [
    { title: "AHA PALS Guidelines 2020: Pediatric Tachycardia with a Pulse Algorithm", url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/pediatric-advanced-life-support" },
    { title: "UpToDate: Management of supraventricular tachycardia (SVT) in children", url: "https://www.uptodate.com/contents/management-of-supraventricular-tachycardia-svt-in-children" }
  ],
};