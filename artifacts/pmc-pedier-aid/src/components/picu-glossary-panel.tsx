import { useState } from 'react';
import { BookA, ChevronDown } from 'lucide-react';
import type { DiseaseProtocol } from '@/lib/protocols/types';
import { collectPicuTerms, termsByNames, BESPOKE_PICU_TERMS, type GlossaryTerm } from '@/lib/picu-glossary';
import { cn } from '@/lib/utils';

function flattenProtocolText(p: DiseaseProtocol): string {
  const parts: string[] = [p.name, p.description];
  const m = p.mmpData;
  if (m) {
    if (m.snapshot) parts.push(m.snapshot);
    m.stages.forEach((s) => {
      parts.push(s.label, s.shortLabel);
      s.cards.forEach((c) => {
        parts.push(c.title, c.threshold ?? '');
        [c.orders, c.nursing, c.triggers, c.instructions].forEach((arr) => arr?.forEach((x) => parts.push(x)));
        c.prescriptions?.forEach((rx) => parts.push(rx.drug, rx.notes ?? ''));
      });
    });
  }
  return parts.filter(Boolean).join(' \n ');
}

export function PicuGlossaryPanel({ protocol }: { protocol: DiseaseProtocol }) {
  const [open, setOpen] = useState(false);

  let terms: GlossaryTerm[];
  if (protocol.mmpData) {
    terms = collectPicuTerms(flattenProtocolText(protocol));
  } else {
    terms = termsByNames(BESPOKE_PICU_TERMS[protocol.id] ?? []);
  }

  if (terms.length === 0) return null;
  terms = [...terms].sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div className="no-print rounded-[28px] border-2 border-slate-100 bg-slate-50/40 overflow-hidden mt-4">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 p-4 text-left">
        <div className="p-2 rounded-xl bg-slate-900 text-white shrink-0"><BookA className="h-4 w-4" /></div>
        <div className="flex-1">
          <p className="text-sm font-black uppercase tracking-widest text-slate-700">Key terms &amp; scores</p>
          <p className="text-[11px] font-bold text-muted-foreground">{terms.length} abbreviation{terms.length > 1 ? 's' : ''} / scoring system{terms.length > 1 ? 's' : ''} used in this protocol</p>
        </div>
        <ChevronDown className={cn('h-5 w-5 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {terms.map((t) => (
            <div key={t.term} className="p-3 rounded-2xl bg-white border border-slate-100">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm font-black text-slate-900">{t.term}</span>
                <span className="text-[11px] font-bold text-primary">{t.full}</span>
              </div>
              <p className="text-xs font-medium text-slate-600 leading-snug mt-0.5">{t.def}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
