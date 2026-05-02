import type { DiseaseProtocol, FormData, Severity } from './types';

export const abdominalPainProtocol: DiseaseProtocol = {
  id: 'abdominal-pain',
  name: 'Abdominal Pain Evaluation',
  system: 'Gastrointestinal',
  description: 'A framework for evaluating acute abdominal pain in children, organized by pain location.',
  image: {
    url: "https://picsum.photos/seed/abdominal-pain/600/400",
    hint: "child stomach"
  },
  questions: [
    { id: 'painLocation', questionText: 'Location of the pain?', type: 'select', options: [
        {label: 'Right Upper Quadrant (RUQ)', value: 'ruq'},
        {label: 'Right Lower Quadrant (RLQ)', value: 'rlq'},
        {label: 'Left Upper Quadrant (LUQ)', value: 'luq'},
        {label: 'Left Lower Quadrant (LLQ)', value: 'llq'},
        {label: 'Epigastric', value: 'epigastric'},
        {label: 'Periumbilical', value: 'periumbilical'},
        {label: 'Diffuse', value: 'diffuse'},
    ]},
    { id: 'isGuarding', questionText: 'Is there abdominal guarding, rigidity, or rebound tenderness?', type: 'boolean' },
    { id: 'hasFever', questionText: 'Is there a fever?', type: 'boolean' },
    { id: 'hasVomiting', questionText: 'Is there vomiting? If so, is it bilious?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details = [];
    if (data.isGuarding) {
        details.push('Guarding, rigidity, or rebound tenderness are signs of peritonitis and a surgical abdomen.');
        return { level: 'severe', details };
    }
    if (data.hasVomiting && data.hasVomiting === true) {
        // A placeholder check for bilious vomiting if we add that detail later
        details.push('Bilious vomiting is a red flag for obstruction.');
        // This could be promoted to severe, but we'll leave it as moderate to be differentiated by the guarding question
    }
    details.push('Abdominal pain without signs of peritonitis. Workup should be guided by location and history.');
    return { level: 'moderate', details };
  },
  getManagement: (severity, data) => {
    const management = [{ title: 'Initial Management', recommendations: [
        'Assess ABCs. Provide IV fluids if dehydrated.',
        'Make patient NPO if a surgical cause is suspected.',
        'Provide pain control with analgesics.',
    ]}];

    if (severity.level === 'severe') {
        management.push({ title: 'Surgical Abdomen', recommendations: [
            'Immediate surgical consultation.',
            'Obtain IV access, start fluid resuscitation.',
            'Administer broad-spectrum antibiotics if sepsis or perforation is suspected.',
            'Prepare for imaging (X-ray, US, or CT) and potential surgery.'
        ]});
    } else {
        const location = data.painLocation;
        let differential = '';
        switch(location) {
            case 'rlq': differential = 'Appendicitis, ovarian torsion, ectopic pregnancy, constipation, kidney stone.'; break;
            case 'ruq': differential = 'Cholecystitis, hepatitis, pneumonia.'; break;
            case 'luq': differential = 'Pancreatitis, gastritis, splenic injury/sequestration.'; break;
            case 'llq': differential = 'Constipation, ovarian torsion, ectopic pregnancy.'; break;
            case 'epigastric': differential = 'Pancreatitis, gastritis, peptic ulcer disease, DKA.'; break;
            case 'periumbilical': differential = 'Early appendicitis, gastroenteritis, constipation.'; break;
            default: differential = 'Gastroenteritis, constipation, bowel obstruction, DKA.';
        }
        management.push({ title: `Differential Diagnosis for ${location?.toString().toUpperCase()} Pain`, recommendations: [
            `Consider the following possibilities: ${differential}`,
            'Workup should be guided by these differentials. Consider labs (CBC, LFTs, Lipase, UA) and imaging (Ultrasound is often a good first choice in children).',
        ]});
    }
    return management;
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
        return ['Immediate admission to a surgical service.'];
    }
    return ['Admission for observation, pain control, and further workup is often necessary.', 'Discharge may be possible if a benign cause is identified (e.g., constipation, gastroenteritis) and pain is controlled.'];
  },
  getRedFlags: () => [
    'Involuntary guarding, rigidity, rebound tenderness',
    'Bilious vomiting',
    'Hemodynamic instability',
    'Abdominal distention with tympany',
    'Pain out of proportion to exam'
  ],
  getDrugDoses: () => [
    { drugName: 'Morphine', dose: '0.05-0.1 mg/kg IV', notes: 'For severe pain.' },
    { drugName: 'Ondansetron', dose: '0.15 mg/kg IV', notes: 'For associated nausea/vomiting.' },
  ],
  getReferences: () => [{ title: 'UpToDate: Emergency department approach to acute abdominal pain in children', url: 'https://www.uptodate.com/contents/emergency-department-approach-to-acute-abdominal-pain-in-children' }],
};
