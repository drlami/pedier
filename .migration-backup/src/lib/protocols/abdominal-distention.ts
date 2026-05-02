import type { DiseaseProtocol, FormData, Severity } from './types';

export const abdominalDistentionProtocol: DiseaseProtocol = {
  id: 'abdominal-distention',
  name: 'Abdominal Distention',
  system: 'Gastrointestinal',
  description: 'A diagnostic approach to the child with a distended abdomen.',
  image: {
    url: "https://picsum.photos/seed/abdominal-distention/600/400",
    hint: "distended abdomen"
  },
  questions: [
    { id: 'isAcute', questionText: 'Is the onset acute (hours to days)?', type: 'boolean' },
    { id: 'hasTenderness', questionText: 'Is there significant abdominal tenderness, guarding, or rigidity?', type: 'boolean' },
    { id: 'hasVomiting', questionText: 'Is there vomiting, especially if bilious?', type: 'boolean' },
    { id: 'isTympanitic', questionText: 'Is the abdomen tympanitic (drum-like) to percussion?', type: 'boolean' },
    { id: 'bowelSounds', questionText: 'Bowel sounds character?', type: 'select', options: [
        {label: 'Normal', value: 'normal'},
        {label: 'Hyperactive / High-pitched', value: 'hyperactive'},
        {label: 'Hypoactive / Absent', value: 'absent'},
    ]},
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details = [];
    if (data.hasTenderness || data.hasVomiting || data.bowelSounds === 'absent') {
        if(data.hasTenderness) details.push('Tenderness/guarding suggests peritonitis.');
        if(data.hasVomiting) details.push('Bilious vomiting suggests obstruction.');
        if(data.bowelSounds === 'absent') details.push('Absent bowel sounds suggest ileus or late obstruction.');
        return { level: 'severe', details: [...details, 'High likelihood of a surgical emergency.'] };
    }
    if (data.isAcute && data.isTympanitic) {
        details.push('Acute distention with tympany is concerning for obstruction.');
        return { level: 'moderate', details };
    }
    details.push('Chronic or non-tender distention may be due to constipation or other non-emergent causes.');
    return { level: 'mild', details };
  },
  getManagement: (severity, data) => {
    const management = [{ title: 'Differential Diagnosis: The 6 F\'s', recommendations: [
        'Fat (obesity)',
        'Fluid (ascites)',
        'Flatus (gas from obstruction, ileus, or aerophagia)',
        'Feces (constipation, impaction)',
        'Fetus (pregnancy)',
        'Fatal Growth (tumor, organomegaly)'
    ]}];

    if (severity.level === 'severe' || severity.level === 'moderate') {
        management.push({ title: 'Management of Acute/Concerning Distention', recommendations: [
            'Treat as bowel obstruction until proven otherwise.',
            'Make patient NPO, obtain IV access, and place an NG tube for decompression.',
            'Obtain an abdominal X-ray (KUB, upright) to look for dilated bowel, free air, or stool burden.',
            'Consult pediatric surgery early.',
            'Further imaging (ultrasound, CT) may be indicated based on suspected cause.'
        ]});
    } else {
        management.push({ title: 'Management of Chronic/Benign Distention', recommendations: [
            'Workup is guided by history.',
            'If constipation is suspected, an abdominal X-ray can confirm stool burden. Treat constipation as per protocol.',
            'If ascites is suspected, an abdominal ultrasound is indicated to confirm fluid and guide further workup (liver/renal disease).',
            'Consider labs for celiac disease or other malabsorption syndromes if chronic.'
        ]});
    }

    return management;
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe' || severity.level === 'moderate') {
        return ['Admission to hospital for bowel rest, decompression, and surgical consultation is required.'];
    }
    return ['Outpatient workup is appropriate for chronic, non-tender distention without red flags.'];
  },
  getRedFlags: () => [
    'Distention with tenderness, guarding, or rigidity',
    'Bilious vomiting',
    'Absent bowel sounds',
    'Signs of shock or sepsis',
    'Free air under the diaphragm on X-ray (perforation)'
  ],
  getDrugDoses: () => [],
  getReferences: () => [{ title: 'UpToDate: Evaluation of the child with abdominal distention', url: 'https://www.uptodate.com/contents/evaluation-of-the-child-with-abdominal-distention' }],
};
