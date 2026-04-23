import type { DiseaseProtocol, FormData, Severity } from './types';

export const persistentVomitingProtocol: DiseaseProtocol = {
  id: 'persistent-vomiting',
  name: 'Persistent Vomiting Approach',
  system: 'Gastrointestinal',
  description: 'A systematic approach to the differential diagnosis of persistent vomiting in children.',
  image: {
    url: 'https://picsum.photos/seed/persistent-vomiting/600/400',
    hint: 'child sick',
  },
  questions: [
    { id: 'vomitType', questionText: 'Is the vomiting bilious (green)?', type: 'boolean' },
    { id: 'isProjectile', questionText: 'Is the vomiting projectile, especially in an infant <3 months?', type: 'boolean' },
    { id: 'hasHeadache', questionText: 'Is there an associated headache, especially if worse in the morning?', type: 'boolean' },
    { id: 'hasAlteredMentalStatus', questionText: 'Is there lethargy or altered mental status?', type: 'boolean' },
    { id: 'hasAbdominalPain', questionText: 'Is there significant abdominal pain or distention?', type: 'boolean' },
    { id: 'dehydrationLevel', questionText: 'What is the level of dehydration?', type: 'select', options: [{label:'None/Mild', value: 'mild'}, {label:'Moderate', value:'moderate'}, {label:'Severe', value:'severe'}] }
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details = [];
    if (data.vomitType) {
        details.push('Bilious vomiting is a surgical emergency.');
        return { level: 'severe', details };
    }
    if (data.hasHeadache || data.hasAlteredMentalStatus) {
        details.push('Vomiting with headache or altered mental status suggests increased ICP.');
        return { level: 'severe', details };
    }
    if (data.hasAbdominalPain) {
        details.push('Vomiting with significant pain/distention suggests an acute abdomen/obstruction.');
        return { level: 'severe', details };
    }
    if(data.dehydrationLevel === 'severe') {
        details.push('Severe dehydration requires IV resuscitation.');
        return { level: 'severe', details };
    }
     if(data.isProjectile && !data.vomitType) {
        details.push('Projectile vomiting in an infant is classic for pyloric stenosis.');
        return { level: 'moderate', details };
    }
    details.push('Non-bilious vomiting without red flags, likely gastroenteritis.');
    return { level: 'mild', details };
  },
  getManagement: (severity, data) => {
    const management = [];
    management.push({title: 'Initial Management', recommendations: [
        'Assess and manage ABCs. Provide IV fluids for moderate to severe dehydration.',
        'Consider an antiemetic like Ondansetron for symptomatic relief if obstruction is not suspected.'
    ]});
    
    if(data.vomitType) {
        management.push({title: 'Workup for Bilious Vomiting', recommendations: ['See "Bilious Vomiting" protocol. NPO, NG tube, surgical consult.']});
    } else if(data.hasHeadache || data.hasAlteredMentalStatus) {
        management.push({title: 'Workup for Suspected Increased ICP', recommendations: ['See "Raised ICP" protocol. Emergent neuroimaging and neurosurgery consult.']});
    } else if (data.hasAbdominalPain) {
        management.push({title: 'Workup for Acute Abdomen', recommendations: ['See "Abdominal Pain" protocol. Consider imaging (Ultrasound, X-ray) and surgical consult.']});
    } else if (data.isProjectile) {
        management.push({title: 'Workup for Suspected Pyloric Stenosis', recommendations: ['Obtain BMP to assess for hypochloremic, hypokalemic metabolic alkalosis.', 'Abdominal ultrasound is diagnostic. Consult surgery.']});
    } else {
        management.push({title: 'Workup for Non-Bilious Vomiting', recommendations: ['Most common cause is viral gastroenteritis.', 'Other causes include GERD, UTI, metabolic disorders, DKA. Workup guided by history and exam.']});
    }
    return management;
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe' || severity.level === 'moderate') {
        return ['Admission is required for workup and management of the underlying cause.'];
    }
    return ['If vomiting is controlled with antiemetics and oral rehydration is successful, discharge home with follow-up is appropriate.'];
  },
  getRedFlags: () => [
    'Bilious vomiting',
    'Hematemesis (bloody vomit)',
    'Altered mental status or signs of increased ICP',
    'Signs of an acute surgical abdomen',
    'Severe dehydration or shock'
  ],
  getDrugDoses: () => [
      { drugName: 'Ondansetron (Zofran)', dose: '0.15 mg/kg (max 8mg) PO/ODT/IV' },
      { drugName: "IV Fluid Bolus (NS or LR)", dose: "20 mL/kg", notes: "For moderate to severe dehydration." }
  ],
  getReferences: () => [{ title: 'UpToDate: Approach to the infant or child with nausea and vomiting', url: 'https://www.uptodate.com/contents/approach-to-the-infant-or-child-with-nausea-and-vomiting' }],
};
