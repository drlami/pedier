import type { DiseaseProtocol, FormData, Severity } from './types';

export const constipationVsObstructionProtocol: DiseaseProtocol = {
  id: 'constipation-vs-obstruction',
  name: 'Constipation vs. Obstruction',
  system: 'Gastrointestinal',
  description: 'Differentiating simple functional constipation from a more emergent bowel obstruction.',
  image: {
    url: 'https://picsum.photos/seed/constipation-vs-obstruction/600/400',
    hint: 'abdominal xray',
  },
  questions: [
    { id: 'isVomitingBilious', questionText: 'Is vomiting present and bilious (green)?', type: 'boolean' },
    { id: 'isPassingFlatus', questionText: 'Is the patient passing gas (flatus)?', type: 'boolean' },
    { id: 'hasAbdominalDistention', questionText: 'Is the abdomen severely distended and tympanitic?', type: 'boolean' },
    { id: 'hasHistory', questionText: 'Is there a chronic history of constipation and encopresis (stool accidents)?', type: 'boolean' },
    { id: 'stoolInVault', questionText: 'Is there a large amount of stool in the rectal vault on exam?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details = [];
    if (data.isVomitingBilious || !data.isPassingFlatus || data.hasAbdominalDistention) {
        if(data.isVomitingBilious) details.push('Bilious vomiting suggests obstruction.');
        if(!data.isPassingFlatus) details.push('Inability to pass flatus (obstipation) suggests obstruction.');
        if(data.hasAbdominalDistention) details.push('Severe distention suggests obstruction.');
        return { level: 'severe', details };
    }
    if (data.hasHistory && data.stoolInVault) {
        details.push('History of constipation and stool in vault suggest functional constipation.');
        return { level: 'mild', details };
    }
    return { level: 'moderate', details: ['Clinical picture is unclear. Further evaluation needed.'] };
  },
  getManagement: (severity, data) => {
    switch(severity.level) {
        case 'severe':
            return [{ title: 'Suspected Bowel Obstruction', recommendations: [
                'This is a potential surgical emergency.',
                'Make patient NPO, obtain IV access, and place an NG tube for decompression.',
                'Obtain an abdominal X-ray (KUB) to look for dilated loops of bowel and air-fluid levels.',
                'Consult pediatric surgery immediately.'
            ]}];
        case 'mild':
            return [{ title: 'Functional Constipation', recommendations: [
                'Primary treatment is disimpaction followed by maintenance laxatives.',
                'Disimpaction can be achieved with oral polyethylene glycol (PEG 3350) high-dose cleanout, or with enemas.',
                'Start maintenance therapy with a lower dose of PEG 3350.',
                'Educate family on behavioral modifications, diet, and scheduled toileting.'
            ]}];
        default:
             return [{ title: 'Indeterminate', recommendations: [
                'Consider an abdominal X-ray to assess stool burden vs. signs of obstruction.',
                'A period of observation with hydration may be helpful.',
                'If any red flags develop, treat as obstruction.'
            ]}];
    }
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
        return ['Admit to hospital for surgical management.'];
    }
    return ['Most children with functional constipation can be managed as outpatients.', 'Consider admission for severe impaction requiring aggressive cleanout, or if diagnosis is uncertain.'];
  },
  getRedFlags: () => [
    'Bilious vomiting',
    'Failure to pass stool or flatus (obstipation)',
    'Severe, progressive abdominal distention',
    'Signs of peritonitis (guarding, rigidity)',
    'Failure to thrive or weight loss (concern for underlying organic disease)'
  ],
  getDrugDoses: () => [
    { drugName: 'Polyethylene Glycol (PEG) 3350 for Cleanout', dose: '1-1.5 g/kg/day for 3-6 days', notes: 'Mix powder in a large volume of clear fluids.' },
    { drugName: 'Polyethylene Glycol (PEG) 3350 for Maintenance', dose: '0.4-0.8 g/kg/day', notes: 'Titrate to effect for one soft stool daily.' },
  ],
  getReferences: () => [{ title: 'NASPGHAN: Evaluation and Treatment of Constipation in Infants and Children', url: 'https://www.naspghan.org/files/documents/pdfs/cme/podcasts/Constipation_2006.pdf' }],
};
