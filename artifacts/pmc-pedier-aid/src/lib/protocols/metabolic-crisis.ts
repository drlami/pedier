import type { DiseaseProtocol } from './types';

/* ============================================================================
 *  REGISTRATION SHIM — DO NOT FILL IN, DO NOT DELETE.
 *  ---------------------------------------------------------------------------
 *  This intentionally-empty protocol exists ONLY to register the
 *  "Suspected Metabolic Crisis" card in the ER dashboard ("Metabolic &
 *  Endocrine") and provide its name/system metadata.
 *
 *  The actual UI is the bespoke, finalised tool at
 *  src/pages/metabolic-crisis.tsx, served via a route override in src/App.tsx
 *  (/diseases/metabolic-crisis). The empty getters below are never rendered.
 *
 *  Do NOT convert this to a normal protocol or add erData — that would override
 *  the bespoke page. Do NOT delete it — the ER card would disappear.
 * ========================================================================== */
export const metabolicCrisisProtocol: DiseaseProtocol = {
  id: 'metabolic-crisis',
  name: 'Suspected Metabolic Crisis',
  system: 'Metabolic Diseases',
  description: 'Emergency assessment and pattern-guided management for suspected inborn errors of metabolism in children.',
  image: {
    url: 'https://picsum.photos/seed/metabolic-crisis/600/400',
    hint: 'metabolic laboratory',
  },
  questions: [],
  calculateSeverity: () => ({ level: 'unknown', details: [] }),
  getManagement: () => [],
  getDisposition: () => [],
  getRedFlags: () => [],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: 'BIMDG Emergency Guidelines for Metabolic Disease', url: 'https://www.bimdg.org.uk/' },
    { title: 'ACMG Management of Inborn Errors of Metabolism', url: 'https://www.acmg.net/' },
  ],
};
