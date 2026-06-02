import type { DiseaseProtocol, FormData, Severity } from './types';

export const giBleedingProtocol: DiseaseProtocol = {
  id: 'gi-bleeding',
  name: 'GI Bleeding (Lower)',
  system: 'Gastrointestinal & Hepatology',
  description: 'Evaluation and management of lower gastrointestinal bleeding (hematochezia) in children.',
  image: {
    url: 'https://picsum.photos/seed/gi-bleeding/600/400',
    hint: 'endoscopy',
  },
  questions: [
    { id: 'isHemodynamicallyUnstable', questionText: 'Is the patient hemodynamically unstable (tachycardia, hypotension, shock)?', type: 'boolean' },
    { id: 'bleedAmount', questionText: 'Amount of blood?', type: 'select', options: [
        {label: 'Streaks on stool/toilet paper', value: 'streaks'},
        {label: 'Small clots mixed with stool', value: 'small_clots'},
        {label: 'Large volume, filling toilet bowl', value: 'large_volume'},
    ]},
    { id: 'hasPain', questionText: 'Is there associated abdominal pain?', type: 'boolean' },
    { id: 'hasDiarrhea', questionText: 'Is there associated diarrhea?', type: 'boolean' },
  ],
  calculateSeverity: (data: FormData): Severity => {
    const details = [];
    if (data.isHemodynamicallyUnstable || data.bleedAmount === 'large_volume') {
        details.push('Large volume bleeding or hemodynamic instability constitutes a life-threatening emergency.');
        return { level: 'severe', details };
    }
    if (data.bleedAmount === 'streaks') {
        details.push('Scant bleeding/streaks often suggests a benign cause like an anal fissure.');
        return { level: 'mild', details };
    }
    details.push('Bleeding of unclear significance. Requires workup.');
    return { level: 'moderate', details };
  },
  getManagement: (severity, data) => {
    const management = [];
    if (severity.level === 'severe') {
        management.push({ title: 'EMERGENCY: Massive GI Bleed', recommendations: [
            'Stabilize ABCs. Provide 100% oxygen.',
            'Establish two large-bore IVs. Begin aggressive fluid resuscitation.',
            'Type and crossmatch blood. Transfuse PRBCs for instability or significant drop in hemoglobin.',
            'Consult Pediatric GI and Surgery immediately.',
            'Place NG tube to rule out an upper GI source.',
            'Prepare for urgent endoscopy/colonoscopy.'
        ]});
    } else {
        management.push({ title: 'Diagnostic Approach', recommendations: [
            'A careful history and physical exam are key.',
            'Painless bleeding suggests Meckel\'s diverticulum or a polyp.',
            'Bleeding with diarrhea suggests infectious colitis (e.g., E. coli O157:H7, Shigella, Salmonella, C. diff).',
            'Bleeding with pain and diarrhea may be Inflammatory Bowel Disease (IBD).',
            'Streaks of blood on hard stool is classic for an anal fissure.',
            'Workup may include stool studies (cultures, C. diff toxin), labs (CBC, Coags, CRP), and imaging (Meckel\'s scan, colonoscopy).'
        ]});
    }
    return management;
  },
  getDisposition: (severity, data) => {
    if (severity.level === 'severe') {
        return ['Immediate admission to the PICU.'];
    }
    if (severity.level === 'moderate') {
        return ['Admission for observation and GI consultation is generally recommended.'];
    }
    return ['For scant bleeding from a confirmed anal fissure in a well child, discharge with stool softeners and follow-up is appropriate.'];
  },
  getRedFlags: () => [
    'Hemodynamic instability (tachycardia, hypotension)',
    'Large-volume hematochezia',
    'A drop in hemoglobin > 2 g/dL',
    'Associated signs of peritonitis'
  ],
  getDrugDoses: () => [
    { drugName: 'Packed Red Blood Cells (PRBCs)', dose: '10-15 mL/kg', notes: 'Transfuse for hemodynamic instability or severe anemia.' },
    { drugName: 'IV Fluid Bolus (NS or LR)', dose: '20 mL/kg', notes: 'For resuscitation.' },
  ],
  getReferences: () => [{ title: 'UpToDate: Lower gastrointestinal bleeding in children: Causes and diagnostic approach', url: 'https://www.uptodate.com/contents/lower-gastrointestinal-bleeding-in-children-causes-and-diagnostic-approach' }],
};
