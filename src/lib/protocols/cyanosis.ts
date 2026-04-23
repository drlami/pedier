import type { DiseaseProtocol, FormData, Severity } from './types';

export const cyanosisProtocol: DiseaseProtocol = {
  id: 'cyanosis',
  name: 'Cyanosis Evaluation',
  system: 'Respiratory',
  description: 'Initial evaluation and differential diagnosis of cyanosis in an infant or child.',
  image: {
    url: "https://picsum.photos/seed/cyanosis/600/400",
    hint: "blue baby"
  },
  questions: [
    { id: 'age', questionText: 'Age', type: 'number', unit: 'days' },
    { id: 'cyanosisType', questionText: 'Cyanosis Location', type: 'select', options: [{label: 'Central (lips, tongue)', value: 'central'}, {label: 'Peripheral (hands, feet)', value: 'peripheral'}] },
    { id: 'prePostSpO2', questionText: 'Pre- and post-ductal SpO2 difference > 3%?', type: 'boolean', info: 'Pre-ductal: right hand. Post-ductal: foot.' },
    { id: 'hyperoxiaTest', questionText: 'SpO2 on 100% FiO2', type: 'number', unit: '%', info: 'PaO2 < 150 mmHg on 100% O2 is suggestive of cardiac shunt.' },
    { id: 'murmur', questionText: 'Significant murmur on exam?', type: 'boolean' },
    { id: 'respDistress', questionText: 'Signs of respiratory distress?', type: 'boolean', info: 'Tachypnea, retractions, grunting' },
    { id: 'mentalStatus', questionText: 'Mental Status', type: 'select', options: [{label: 'Normal', value: 'normal'}, {label: 'Irritable', value: 'irritable'}, {label: 'Lethargic', value: 'lethargic'}] },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details: string[] = [];
    if (data.cyanosisType === 'peripheral') {
      details.push("Peripheral cyanosis (acrocyanosis) is often benign.");
      return { level: 'mild', details };
    }

    if (data.cyanosisType === 'central') {
        details.push("Central cyanosis is always pathological.");
        if (Number(data.hyperoxiaTest) < 90 ) {
             details.push("Poor response to hyperoxia test suggests cardiac origin.");
             return { level: 'severe', details };
        }
        if (data.prePostSpO2) {
            details.push("Pre/post-ductal gradient suggests ductal-dependent circulation.");
            return { level: 'severe', details };
        }
        if (data.respDistress) {
            details.push("Cyanosis with respiratory distress suggests pulmonary origin.");
            return { level: 'moderate', details };
        }
    }

    return { level: 'moderate', details: ["Central cyanosis requires urgent evaluation."] };
  },
  getManagement: (severity, data) => {
    const management = [{
        title: "Initial Stabilization",
        recommendations: [
            "Place on cardiac monitor and continuous pulse oximetry (pre- and post-ductal).",
            "Provide supplemental oxygen. If no improvement, suspect cardiac cause.",
            "Obtain IV access and check blood glucose.",
            "Keep patient warm and calm."
        ]
    }];
    
    if(severity.level === 'severe'){
        management.push({
            title: "Suspected Cardiac Disease Management",
            recommendations: [
                "IMMEDIATE pediatric cardiology consultation.",
                "Start Prostaglandin E1 (PGE1) infusion to maintain ductal patency in any neonate with suspected ductal-dependent lesion.",
                "Obtain EKG and Chest X-ray.",
                "Perform 4-limb blood pressures.",
                "Prepare for transport to a center with pediatric cardiac surgery capabilities."
            ]
        });
    } else {
        management.push({
            title: "Diagnostic Workup",
            recommendations: [
                "Obtain Chest X-ray to evaluate lung fields and cardiac silhouette.",
                "Obtain EKG.",
                "Check labs: ABG/VBG, CBC, electrolytes.",
                "Consider sepsis workup if indicated.",
                "Consider head ultrasound or CT for CNS causes."
            ]
        });
    }
    return management;
  },
  getDisposition: (severity, data) => {
    if (data.cyanosisType === 'central') {
        return ["All infants and children with new-onset central cyanosis require admission for urgent workup.", "Admission to NICU/PICU is required for patients who are unstable or require PGE1 infusion."];
    }
    return ["Peripheral cyanosis (acrocyanosis) in a well-appearing newborn is typically benign and can be discharged with follow-up if feeding and exam are normal."];
  },
  getRedFlags: () => [
    "Any central cyanosis (blue lips/tongue)",
    "Cyanosis that does not improve with supplemental oxygen",
    "Shock (hypotension, poor perfusion, lethargy)",
    "Significant difference (>3%) between pre-ductal (right hand) and post-ductal (foot) SpO2",
    "A quiet tachypnea (rapid breathing without significant work of breathing) can be a sign of cardiac disease."
  ],
  getDrugDoses: () => [
    { drugName: "Prostaglandin E1 (PGE1)", dose: "Start infusion at 0.05 - 0.1 mcg/kg/min", notes: "Use with extreme caution. Side effects include apnea, fever, hypotension. Be prepared to intubate." },
  ],
  getReferences: () => [{ title: "AAP: Evaluation and Management of the Cyanotic Neonate", url: "https://publications.aap.org/pediatricsinreview/article-abstract/29/5/e33/69905/Evaluation-and-Management-of-the-Cyanotic-Neonate" }],
};
