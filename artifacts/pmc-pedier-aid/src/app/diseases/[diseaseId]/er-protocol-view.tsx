import { useState, useMemo, useEffect, useCallback } from 'react';
import { DiseaseProtocol, FormData, ErHistoryItem, Severity, SeverityBand } from '@/lib/protocols/types';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  AlertTriangle, CheckCircle2, FlaskConical, Stethoscope, LogOut, History,
  Activity, Copy, Check, HelpCircle, ArrowRight,
} from 'lucide-react';
import { Link } from 'wouter';
import {
  getVitalsNormals, parseAgeToMonths, hrStatus, rrStatus, spo2Status,
  statusColor, statusLabel, type VitalsNormals,
} from '@/lib/er-vitals-normals';

// ─── types ────────────────────────────────────────────────────────────────────

type TabId = 'assess' | 'manage' | 'labs' | 'dispose';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'assess',  label: 'Assess',  icon: Activity },
  { id: 'manage',  label: 'Manage',  icon: Stethoscope },
  { id: 'labs',    label: 'Labs',    icon: FlaskConical },
  { id: 'dispose', label: 'Admit/Discharge', icon: LogOut },
];

// ─── sub-components ──────────────────────────────────────────────────────────

function VitalInput({
  label, value, onChange, unit, placeholder, status, note,
}: {
  label: string; value: string; onChange: (v: string) => void;
  unit?: string; placeholder?: string;
  status?: 'normal' | 'borderline' | 'abnormal'; note?: string;
}) {
  const colors = status ? statusColor(status) : null;
  return (
    <div className="flex-1 min-w-[72px]">
      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
        {label}{unit ? ` (${unit})` : ''}
      </div>
      <Input
        type="number"
        inputMode="decimal"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={cn(
          'h-10 text-base font-bold rounded-xl border-2 transition-colors',
          colors && value ? `${colors.border} ${colors.bg}` : '',
        )}
      />
      {note && value && status && status !== 'normal' && (
        <div className={cn('text-[10px] font-bold mt-0.5', colors?.text)}>{note}</div>
      )}
    </div>
  );
}

// ─── ASSESS TAB ──────────────────────────────────────────────────────────────

function QuestionCard({ q, val, onSelect }: {
  q: import('@/lib/protocols/types').Question;
  val: string | number | boolean | undefined;
  onSelect: (v: string | number | boolean) => void;
}) {
  if (q.type === 'select' && q.options) {
    return (
      <div className="bg-card rounded-2xl border p-4 space-y-2.5">
        <div className="text-sm font-black text-foreground">{q.questionText}</div>
        {q.info && <div className="text-xs text-muted-foreground leading-snug">{q.info}</div>}
        <div className="flex flex-wrap gap-2">
          {q.options.map(opt => {
            const selected = String(val) === String(opt.value);
            const score = opt.score ?? 0;
            const isHigh = score >= 2;
            return (
              <button
                key={String(opt.value)}
                onClick={() => onSelect(opt.value as string | number)}
                className={cn(
                  'px-3 py-2 rounded-xl text-xs font-black transition-all border-2',
                  selected
                    ? isHigh
                      ? 'bg-red-500 text-white border-red-500'
                      : score === 1
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-muted border-transparent text-muted-foreground hover:bg-muted/80',
                )}
              >
                {opt.label}
                {opt.score !== undefined && <span className="ml-1 opacity-70">+{opt.score}</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  if (q.type === 'boolean') {
    return (
      <div className="bg-card rounded-2xl border p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-black text-foreground">{q.questionText}</div>
            {q.info && <div className="text-xs text-muted-foreground mt-0.5">{q.info}</div>}
          </div>
          <div className="flex gap-2 shrink-0">
            {['Yes', 'No'].map(opt => (
              <button
                key={opt}
                onClick={() => onSelect(opt === 'Yes')}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-black border-2 transition-all',
                  String(val) === String(opt === 'Yes')
                    ? opt === 'Yes'
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-muted border-transparent text-muted-foreground hover:bg-muted/80',
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return null;
}

// Gate-mode severity card — shows which decision-tree criteria fired, grouped
// by the tier they trigger, instead of a summed "X/Y" score. Used when a
// protocol's calculateSeverity returns gateFindings (see types.ts).
const GATE_TIER_ORDER = ['critical', 'severe', 'moderate', 'some', 'mild', 'low', 'no'] as const;

function GateCard({ severity, ss, actionHint }: {
  severity: Severity;
  ss: { bg: string; text: string; badge: string };
  actionHint: string;
}) {
  const findings = severity.gateFindings ?? [];
  const groups = GATE_TIER_ORDER
    .map(tier => ({ tier, items: findings.filter(f => f.tier === tier) }))
    .filter(g => g.items.length > 0);

  const overrides = severity.admitOverrides ?? [];
  const overrideMet = overrides.filter(o => o.met);

  return (
    <div className="space-y-3">
      {/* Severity classification card */}
      <div className={cn('rounded-2xl border-2 p-4 space-y-3', ss.bg)}>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
          Severity Classification
        </span>

        <div>
          <div className={cn('text-lg font-black leading-tight', ss.text)}>
            {severity.level.toUpperCase()}
          </div>
          <div className={cn('text-xs font-medium mt-1 leading-snug opacity-80', ss.text)}>
            {actionHint}
          </div>
        </div>

        <div className="space-y-3 border-t border-black/10 pt-3">
          {groups.map(g => (
            <div key={g.tier} className="space-y-1">
              <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">
                {g.tier} — any one of these
              </div>
              {g.items.map(f => (
                <div
                  key={f.id}
                  className={cn('flex items-center gap-2 text-xs leading-snug rounded-lg px-1.5 py-1', f.met ? 'font-bold' : 'opacity-45')}
                >
                  <span className={cn(
                    'shrink-0 h-4 w-4 rounded-full flex items-center justify-center',
                    f.met ? cn(ss.badge, 'text-white') : 'bg-black/10',
                  )}>
                    {f.met && <Check className="h-2.5 w-2.5" />}
                  </span>
                  <span className={ss.text}>{f.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Admit-override layer — mandatory admission independent of severity */}
      {overrides.length > 0 && (
        <div className={cn(
          'rounded-2xl border-2 p-4 space-y-2',
          overrideMet.length > 0 ? 'bg-red-50 border-red-300' : 'bg-muted/30 border-border',
        )}>
          <div className="flex items-center gap-2">
            <span className={cn(
              'text-[10px] font-black uppercase tracking-widest',
              overrideMet.length > 0 ? 'text-red-700' : 'text-muted-foreground/60',
            )}>
              Admit Regardless of Severity — any one
            </span>
          </div>
          {overrideMet.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-black text-red-700">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              ADMIT — {overrideMet.length} mandatory-admission factor{overrideMet.length > 1 ? 's' : ''} present, even though pneumonia severity is {severity.level.toUpperCase()}
            </div>
          )}
          <div className="space-y-1 pt-0.5">
            {overrides.map(o => (
              <div
                key={o.id}
                className={cn('flex items-center gap-2 text-xs leading-snug rounded-lg px-1.5 py-1', o.met ? 'font-bold text-red-800' : 'opacity-45')}
              >
                <span className={cn(
                  'shrink-0 h-4 w-4 rounded-full flex items-center justify-center',
                  o.met ? 'bg-red-500 text-white' : 'bg-black/10',
                )}>
                  {o.met && <Check className="h-2.5 w-2.5" />}
                </span>
                <span>{o.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── REFERENCE-MODE ASSESS (classify-by-table, tap-to-route) ─────────────────
// Used when protocol.erData.severityClassification is present. The clinician
// READS the severity table and taps the band — no input→score computation.

const BAND_META: Record<SeverityBand, { label: string; head: string; col: string; sel: string; text: string }> = {
  mild:     { label: 'Mild',     head: 'bg-emerald-500', col: 'bg-emerald-50',  sel: 'border-emerald-400 ring-2 ring-emerald-400', text: 'text-emerald-800' },
  moderate: { label: 'Moderate', head: 'bg-amber-500',   col: 'bg-amber-50',    sel: 'border-amber-400 ring-2 ring-amber-400',     text: 'text-amber-800' },
  severe:   { label: 'Severe',   head: 'bg-red-500',     col: 'bg-red-50',      sel: 'border-red-400 ring-2 ring-red-400',         text: 'text-red-800' },
};
const BANDS: SeverityBand[] = ['mild', 'moderate', 'severe'];

function ReferenceAssess({ protocol, formData, setFormData, severity }: {
  protocol: DiseaseProtocol;
  formData: FormData;
  setFormData: (d: FormData) => void;
  severity: Severity;
}) {
  const cls = protocol.erData!.severityClassification!;
  const band = formData.manualSeverity as SeverityBand | undefined;
  const setBand = (b: SeverityBand) => setFormData({ ...formData, manualSeverity: b });

  const overrides = severity.admitOverrides ?? [];
  const overrideMet = overrides.filter(o => o.met);
  const metById = (id: string) => overrides.find(o => o.id === id)?.met ?? false;

  const history = protocol.erData?.historyChecklist ?? [];
  const immunizedQ = protocol.questions.find(q => q.id === 'immunized');

  return (
    <div className="space-y-4">
      <div className="text-xs text-muted-foreground font-medium px-1">
        Read the table, match the child by their <span className="font-black">worst feature</span>, and tap the band.
      </div>

      {/* ── Severity classification table ── */}
      <div className="rounded-2xl border-2 overflow-hidden">
        <div className="grid grid-cols-[1.15fr_1fr_1fr_1fr]">
          {/* header row */}
          <div className="bg-muted/40 p-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/70 flex items-end">Feature</div>
          {BANDS.map(b => (
            <button
              key={b}
              onClick={() => setBand(b)}
              className={cn(
                'p-2 text-xs font-black text-white text-center transition-all active:scale-95',
                BAND_META[b].head,
                band === b ? 'ring-2 ring-offset-1 ring-black/40' : 'opacity-80 hover:opacity-100',
              )}
            >
              {BAND_META[b].label}
              {band === b && <Check className="h-3 w-3 inline-block ml-1 -mt-0.5" />}
            </button>
          ))}
          {/* data rows */}
          {cls.rows.map((row, ri) => (
            <div key={row.feature} className="contents">
              <div className={cn('p-2 text-[11px] font-bold leading-snug border-t', ri === 0 && 'border-t-0')}>{row.feature}</div>
              {BANDS.map(b => (
                <div
                  key={b}
                  onClick={() => setBand(b)}
                  className={cn(
                    'p-2 text-[11px] leading-snug border-t cursor-pointer',
                    ri === 0 && 'border-t-0',
                    band === b ? cn(BAND_META[b].col, 'font-bold', BAND_META[b].text) : 'text-muted-foreground',
                  )}
                >
                  {row[b]}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground px-1 leading-snug">
        Classify by the <span className="font-black">single worst feature</span> — any one Severe-column feature = severe pneumonia.
      </p>

      {/* ── Selected band → action ──
          CRITICAL: this must show the REAL computed disposition
          (protocol.getDisposition), never a static per-band text lookup.
          A static lookup can't know about admit-overrides, which produced a
          real bug: tapping "Mild" on a genuinely-mandatory-admit patient (e.g.
          age < 6 months) showed "discharge" here while the override checklist
          below said "ADMIT" — two contradictory answers to the same question
          on the same screen. getDisposition() is the one place that already
          combines severity + overrides correctly; everything else must defer
          to it instead of re-deriving the answer. */}
      {band ? (() => {
        const disposition = protocol.getDisposition(severity, formData);
        const overrideFired = (severity.admitOverrides ?? []).some(o => o.met);
        const contradicted = overrideFired && band !== 'severe';
        const col  = contradicted ? 'bg-red-50'  : BAND_META[band].col;
        const sel  = contradicted ? 'border-red-400 ring-2 ring-red-400' : BAND_META[band].sel;
        const text = contradicted ? 'text-red-800' : BAND_META[band].text;
        return (
          <div className={cn('rounded-2xl border-2 p-4', col, sel)}>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Your assessment</div>
            <div className={cn('text-lg font-black mt-0.5', text)}>
              {BAND_META[band].label} pneumonia{contradicted ? ' — but ADMIT (override below)' : ''}
            </div>
            <div className={cn('text-sm font-bold mt-1 leading-snug space-y-1', text)}>
              {disposition.map((line, i) => <div key={i}>{line}</div>)}
            </div>
            <div className="text-[11px] text-muted-foreground font-medium mt-2">→ Open the <span className="font-black">Manage</span> tab for the matching pathway.</div>
          </div>
        );
      })() : (
        <div className="rounded-2xl border-2 border-dashed p-4 text-center text-xs font-bold text-muted-foreground">
          Tap a band above to set the severity and route management.
        </div>
      )}

      {/* ── Admit-override checklist ── */}
      <div className="space-y-2">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">
          Admit regardless of severity — tick any that apply
        </div>
        {overrideMet.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-300 rounded-2xl">
            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
            <span className="text-xs font-black text-red-700">
              ADMIT — {overrideMet.length} mandatory-admission factor{overrideMet.length > 1 ? 's' : ''} present{band && band !== 'severe' ? `, despite ${BAND_META[band].label.toLowerCase()} severity` : ''}
            </span>
          </div>
        )}
        {cls.admitOverrides.map(o => {
          const auto = o.autoAgeMonthsBelow != null;
          const met = metById(o.id);
          return (
            <button
              key={o.id}
              disabled={auto}
              onClick={() => { if (!auto) setFormData({ ...formData, [o.id]: !(formData[o.id] === true) }); }}
              className={cn(
                'w-full text-left flex items-center gap-3 p-3 rounded-2xl border-2 transition-all',
                met ? 'bg-red-50 border-red-300' : 'bg-card border-transparent',
                auto ? 'cursor-default' : 'active:scale-[0.99]',
              )}
            >
              <span className={cn(
                'shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center',
                met ? 'bg-red-500 border-red-500' : 'border-muted-foreground/40',
              )}>
                {met && <Check className="h-3 w-3 text-white" />}
              </span>
              <span className={cn('text-sm font-bold leading-snug', met && 'text-red-800')}>
                {o.label}
                {auto && <span className="text-[10px] font-medium text-muted-foreground ml-1">(auto — from age)</span>}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Antibiotic-selection input ── */}
      {immunizedQ && (
        <div className="space-y-2">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">For inpatient antibiotic choice</div>
          <QuestionCard q={immunizedQ} val={formData[immunizedQ.id]} onSelect={v => setFormData({ ...formData, [immunizedQ.id]: v })} />
        </div>
      )}

      {/* ── Clinical context flags (change management, not disposition) ── */}
      {history.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Clinical context — changes management</div>
          {history.map(item => {
            const ans = formData[item.id] as boolean | undefined;
            return (
              <div key={item.id} className={cn(
                'rounded-2xl border-2 p-3 transition-all',
                ans === true ? (item.redFlag ? 'bg-red-50 border-red-300' : 'bg-amber-50 border-amber-200') : 'bg-card border-transparent',
              )}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.redFlag && <span className="text-[10px] font-black text-red-600 bg-red-100 px-1.5 py-0.5 rounded-md shrink-0">⚠ RED FLAG</span>}
                      <span className="text-sm font-bold text-foreground">{item.question}</span>
                    </div>
                    {ans === true && item.ifYes && (
                      <div className={cn('mt-2 text-xs font-bold px-3 py-1.5 rounded-xl leading-snug', item.redFlag ? 'bg-red-100 text-red-800' : 'bg-amber-50 text-amber-800')}>
                        → {item.ifYes}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {(['Yes', 'No'] as const).map(opt => (
                      <button
                        key={opt}
                        onClick={() => setFormData({ ...formData, [item.id]: opt === 'Yes' })}
                        className={cn(
                          'px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all',
                          ans !== undefined && String(ans) === String(opt === 'Yes')
                            ? opt === 'Yes' ? (item.redFlag ? 'bg-red-500 text-white border-red-500' : 'bg-amber-500 text-white border-amber-500') : 'bg-emerald-500 text-white border-emerald-500'
                            : 'bg-muted border-transparent text-muted-foreground',
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reset */}
      {(band || overrideMet.length > 0 || Object.keys(formData).some(k => k.startsWith('ovr_'))) && (
        <button
          onClick={() => {
            const cleared: FormData = { weight: formData.weight, ageMonths: formData.ageMonths, oxygenSaturation: formData.oxygenSaturation, heartRate: formData.heartRate, respiratoryRate: formData.respiratoryRate };
            setFormData(cleared);
          }}
          className="text-xs text-muted-foreground underline w-full text-center"
        >
          Reset assessment
        </button>
      )}
    </div>
  );
}

function AssessTab({ protocol, formData, setFormData, weight }: {
  protocol: DiseaseProtocol;
  formData: FormData;
  setFormData: (d: FormData) => void;
  weight: number;
}) {
  const severity = useMemo(() => protocol.calculateSeverity(formData), [formData, protocol]);

  // Reference mode: classify-by-table instead of the scored/gate assessment.
  if (protocol.erData?.severityClassification) {
    return <ReferenceAssess protocol={protocol} formData={formData} setFormData={setFormData} severity={severity} />;
  }

  // Split questions into suspicion group vs severity group
  const allQ = protocol.questions.filter(q => q.id !== 'weight');
  const suspicionQs = allQ.filter(q => q.questionGroup === 'suspicion');
  const severityQs  = allQ.filter(q => q.questionGroup !== 'suspicion');
  const hasSuspicionGroup = suspicionQs.length > 0;

  const suspicionAnswered = suspicionQs.filter(q => formData[q.id] !== undefined).length;
  const answered = allQ.filter(q => formData[q.id] !== undefined).length;
  const scorable  = allQ.filter(q => q.type === 'select').length;

  const severityStyleMap: Record<string, { bg: string; text: string; badge: string }> = {
    mild:    { bg: 'bg-emerald-50 border-emerald-300', text: 'text-emerald-800', badge: 'bg-emerald-500' },
    low:     { bg: 'bg-emerald-50 border-emerald-300', text: 'text-emerald-800', badge: 'bg-emerald-500' },
    no:      { bg: 'bg-emerald-50 border-emerald-300', text: 'text-emerald-800', badge: 'bg-emerald-500' },
    some:    { bg: 'bg-amber-50  border-amber-300',   text: 'text-amber-800',   badge: 'bg-amber-500' },
    moderate:{ bg: 'bg-amber-50  border-amber-300',   text: 'text-amber-800',   badge: 'bg-amber-500' },
    severe:  { bg: 'bg-red-50    border-red-300',     text: 'text-red-800',     badge: 'bg-red-500' },
    critical:{ bg: 'bg-red-100   border-red-500',     text: 'text-red-900',     badge: 'bg-red-700' },
    'impending respiratory failure': { bg: 'bg-red-100 border-red-500', text: 'text-red-900', badge: 'bg-red-700' },
    unknown: { bg: 'bg-muted/40  border-border',      text: 'text-muted-foreground', badge: 'bg-muted-foreground' },
  };
  const ss = severityStyleMap[severity.level] ?? severityStyleMap.unknown;

  // Diagnostic confidence banner config
  const conf = severity.diagnosticConfidence;
  const confConfig = conf === 'high'
    ? { bg: 'bg-emerald-50 border-emerald-200', icon: 'text-emerald-600', text: 'text-emerald-800', label: 'High diagnostic confidence', icon2: CheckCircle2 }
    : conf === 'moderate'
    ? { bg: 'bg-amber-50 border-amber-200',   icon: 'text-amber-600',   text: 'text-amber-800',   label: 'Moderate diagnostic confidence', icon2: HelpCircle }
    : conf === 'low'
    ? { bg: 'bg-orange-50 border-orange-300', icon: 'text-orange-600',  text: 'text-orange-800',  label: 'Low diagnostic confidence', icon2: AlertTriangle }
    : null;

  const handleSet = (id: string, v: string | number | boolean) =>
    setFormData({ ...formData, [id]: v });

  return (
    <div className="space-y-4">

      {/* ── DIAGNOSTIC CRITERIA section (only for protocols with suspicion questions) ── */}
      {hasSuspicionGroup && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              Diagnostic Criteria
            </span>
          </div>

          {suspicionQs.map(q => (
            <QuestionCard key={q.id} q={q} val={formData[q.id]} onSelect={v => handleSet(q.id, v)} />
          ))}

          {/* Confidence banner — only appears once ≥1 suspicion question is answered */}
          {suspicionAnswered > 0 && confConfig && (
            <div className={cn('rounded-2xl border-2 p-4', confConfig.bg)}>
              <div className="flex items-start gap-3">
                <confConfig.icon2 className={cn('h-5 w-5 shrink-0 mt-0.5', confConfig.icon)} />
                <div className="flex-1 min-w-0">
                  <div className={cn('text-sm font-black', confConfig.text)}>{confConfig.label}</div>
                  {conf === 'low' && severity.alternativeProtocol && (
                    <div className={cn('text-xs font-bold mt-1 leading-snug', confConfig.text)}>
                      Clinical picture does not strongly support <span className="font-black">{protocol.name}</span>.
                      Consider:{' '}
                      <Link
                        href={`/diseases/${severity.alternativeProtocol.id}`}
                        className="underline inline-flex items-center gap-0.5 hover:opacity-80"
                      >
                        {severity.alternativeProtocol.name}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                  {conf === 'moderate' && (
                    <div className={cn('text-xs font-medium mt-1', confConfig.text)}>
                      Some features present — continue assessment carefully.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Divider before severity section */}
          {severityQs.length > 0 && (
            <div className="flex items-center gap-2 pt-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                Clinical Severity
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
          )}
        </div>
      )}

      {/* ── SEVERITY SCORE card ── */}
      {(() => {
        const actionHintMap: Record<string, string> = {
          severe:   'ADMIT now — parenteral antibiotics + full workup',
          critical: 'CRITICAL — PICU + immediate antibiotics',
          moderate: 'Targeted workup — reassess before any discharge',
          some:     'Targeted workup — reassess before any discharge',
          mild:     'Discharge with safety-netting + 24–48 h follow-up',
          low:      'Discharge with safety-netting + 24–48 h follow-up',
          no:       'Low risk — reassurance + safety-netting',
          unknown:  'Complete the questions above to generate a risk score',
        };
        const actionHint = actionHintMap[severity.level] ?? '';
        const factors = severity.details; // show ALL details — details[0] may carry critical emergency-specific action text

        // Gate-mode protocols (criteria/decision-tree guidelines) report *why* a
        // tier fired via gateFindings instead of a summed score — render the
        // transparent criteria checklist instead of faking a numeric score card.
        if (severity.gateFindings && severity.gateFindings.length > 0) {
          return <GateCard severity={severity} ss={ss} actionHint={actionHint} />;
        }

        return (
          <div className={cn('rounded-2xl border-2 p-4 space-y-3', ss.bg)}>
            {/* Row 1: label + answered count */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                {severity.scoreDetails?.systemName ?? 'Severity'}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">
                {answered}/{scorable} scored
              </span>
            </div>

            {/* Row 2: score number | divider | level + action */}
            <div className="flex items-center gap-3">
              <div className={cn('shrink-0 w-14 text-center leading-none', ss.text)}>
                <div className="text-5xl font-black">
                  {severity.scoreDetails?.totalScore ?? '—'}
                </div>
                {severity.scoreDetails?.maxScore != null && (
                  <div className="text-xs font-bold opacity-50">/{severity.scoreDetails.maxScore}</div>
                )}
              </div>
              <div className={cn('self-stretch w-px', ss.badge, 'opacity-30')} />
              <div className="flex-1 min-w-0">
                <div className={cn('text-sm font-black leading-tight', ss.text)}>
                  {severity.scoreDetails?.interpretation ?? severity.level.toUpperCase()}
                </div>
                <div className={cn('text-xs font-medium mt-1 leading-snug opacity-80', ss.text)}>
                  {actionHint}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            {severity.scoreDetails && (
              <>
                <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', ss.badge)}
                    style={{ width: `${(severity.scoreDetails.totalScore / (severity.scoreDetails.maxScore ?? 14)) * 100}%` }}
                  />
                </div>
                {severity.scoreDetails.referenceTable && (
                  <div className="flex justify-between">
                    {severity.scoreDetails.referenceTable.map(r => (
                      <div key={r.range} className="text-center">
                        <div className="text-[9px] font-bold text-muted-foreground">{r.range}</div>
                        <div className="text-[9px] text-muted-foreground">{r.meaning.split(' ')[0]}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Contributing factors — compact list, separated */}
            {factors.length > 0 && (
              <div className="border-t border-black/10 pt-2.5 space-y-1.5">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-1">
                  Active findings
                </div>
                {factors.map((d, i) => (
                  <div key={i} className={cn('text-[11px] leading-snug flex gap-1.5', ss.text)}>
                    <span className="opacity-40 shrink-0 mt-0.5">•</span>
                    <span className="opacity-80">{d}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* ── SEVERITY questions ── */}
      <div className="space-y-3">
        {severityQs.map(q => (
          <QuestionCard key={q.id} q={q} val={formData[q.id]} onSelect={v => handleSet(q.id, v)} />
        ))}
      </div>

      {/* ── CLINICAL FLAGS (merged from History) ── */}
      {protocol.erData?.historyChecklist && protocol.erData.historyChecklist.length > 0 && (() => {
        const checklist  = protocol.erData!.historyChecklist;
        const redItems   = checklist.filter(i => i.redFlag);
        const otherItems = checklist.filter(i => !i.redFlag);
        const redCount   = redItems.filter(i => formData[i.id] === true).length;

        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 pt-1">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                Clinical Flags
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {redCount > 0 && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-2xl">
                <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                <span className="text-xs font-black text-red-700">
                  {redCount} red-flag answer{redCount > 1 ? 's' : ''} — escalate management now
                </span>
              </div>
            )}

            {/* Red-flag items */}
            {redItems.map(item => {
              const ans = formData[item.id] as boolean | undefined;
              return (
                <div key={item.id} className={cn(
                  'rounded-2xl border-2 p-3 transition-all',
                  ans === true ? 'bg-red-50 border-red-300' : 'bg-card border-transparent',
                )}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-black text-red-600 bg-red-100 px-1.5 py-0.5 rounded-md shrink-0">
                          ⚠ RED FLAG
                        </span>
                        <span className="text-sm font-bold text-foreground">{item.question}</span>
                      </div>
                      {ans === true && item.ifYes && (
                        <div className="mt-2 text-xs font-bold px-3 py-1.5 rounded-xl bg-red-100 text-red-800 leading-snug">
                          → {item.ifYes}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      {(['Yes', 'No'] as const).map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleSet(item.id, opt === 'Yes')}
                          className={cn(
                            'px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all',
                            ans !== undefined && String(ans) === String(opt === 'Yes')
                              ? opt === 'Yes' ? 'bg-red-500 text-white border-red-500' : 'bg-emerald-500 text-white border-emerald-500'
                              : 'bg-muted border-transparent text-muted-foreground',
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Context items */}
            {otherItems.map(item => {
              const ans = formData[item.id] as boolean | undefined;
              return (
                <div key={item.id} className={cn(
                  'rounded-2xl border-2 p-3 transition-all',
                  ans === true ? 'bg-amber-50 border-amber-200' : 'bg-card border-transparent',
                )}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground">{item.question}</span>
                      {ans === true && item.ifYes && (
                        <div className="mt-2 text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 leading-snug">
                          → {item.ifYes}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      {(['Yes', 'No'] as const).map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleSet(item.id, opt === 'Yes')}
                          className={cn(
                            'px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all',
                            ans !== undefined && String(ans) === String(opt === 'Yes')
                              ? opt === 'Yes' ? 'bg-amber-500 text-white border-amber-500' : 'bg-emerald-500 text-white border-emerald-500'
                              : 'bg-muted border-transparent text-muted-foreground',
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Reset */}
      {Object.keys(formData).filter(k => k !== 'weight').length > 0 && (
        <button
          onClick={() => setFormData({ weight: formData.weight })}
          className="text-xs text-muted-foreground underline w-full text-center"
        >
          Reset assessment
        </button>
      )}
    </div>
  );
}

// ─── HISTORY TAB ─────────────────────────────────────────────────────────────

function HistoryTab({ items, formData, setFormData }: {
  items: ErHistoryItem[];
  formData: FormData;
  setFormData: (d: FormData) => void;
}) {
  const redFlagCount = items.filter(i => i.redFlag && formData[i.id] === true).length;

  return (
    <div className="space-y-3">
      {redFlagCount > 0 && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-2xl">
          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
          <p className="text-xs font-black text-red-700">
            {redFlagCount} red-flag answer{redFlagCount > 1 ? 's' : ''} — escalate management
          </p>
        </div>
      )}
      {items.map(item => {
        const ans = formData[item.id] as boolean | undefined;
        return (
          <div
            key={item.id}
            className={cn(
              'rounded-2xl border-2 p-4 transition-all',
              ans === true && item.redFlag ? 'bg-red-50 border-red-300' : 'bg-card border-transparent',
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  {item.redFlag && (
                    <span className="text-[10px] font-black text-red-600 bg-red-100 px-1.5 py-0.5 rounded-md shrink-0">
                      ⚠ RED FLAG
                    </span>
                  )}
                  <span className="text-sm font-bold text-foreground">{item.question}</span>
                </div>
                {ans === true && item.ifYes && (
                  <div className={cn(
                    'mt-2 text-xs font-bold px-3 py-1.5 rounded-xl',
                    item.redFlag ? 'bg-red-100 text-red-800' : 'bg-amber-50 text-amber-800',
                  )}>
                    → {item.ifYes}
                  </div>
                )}
              </div>
              <div className="flex gap-1.5 shrink-0">
                {(['Yes', 'No'] as const).map(opt => (
                  <button
                    key={opt}
                    onClick={() => setFormData({ ...formData, [item.id]: opt === 'Yes' })}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all',
                      ans !== undefined && String(ans) === String(opt === 'Yes')
                        ? opt === 'Yes'
                          ? item.redFlag ? 'bg-red-500 text-white border-red-500' : 'bg-amber-500 text-white border-amber-500'
                          : 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-muted border-transparent text-muted-foreground',
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── MANAGE TAB ──────────────────────────────────────────────────────────────

function ManageTab({ protocol, formData, weight }: {
  protocol: DiseaseProtocol;
  formData: FormData;
  weight: number;
}) {
  const severity = useMemo(() => protocol.calculateSeverity(formData), [formData, protocol]);
  const management = useMemo(() => protocol.getManagement(severity, formData), [severity, formData, protocol]);
  const doses = useMemo(() => protocol.getDrugDoses(severity, { ...formData, weight: weight || undefined }), [severity, formData, weight, protocol]);
  const redFlags = useMemo(() => protocol.getRedFlags(severity, formData), [severity, formData, protocol]);
  const [given, setGiven] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const erData = protocol.erData;

  const copyOrders = useCallback(() => {
    const lines = [
      `${protocol.name.toUpperCase()} — ${severity.scoreDetails?.interpretation ?? severity.level.toUpperCase()}`,
      weight ? `Weight: ${weight} kg` : '',
      '',
      ...management.flatMap(g => [`${g.title}:`, ...g.recommendations.map(r => `  • ${r}`)]),
      '',
      'DRUG DOSES:',
      ...doses.map(d => `  • ${d.drugName}: ${d.dose}${d.notes ? ` (${d.notes})` : ''}`),
    ].filter(Boolean).join('\n');
    navigator.clipboard.writeText(lines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [protocol, severity, weight, management, doses]);

  return (
    <div className="space-y-4">
      {/* Red flags */}
      {redFlags.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-xs font-black text-red-700 uppercase tracking-wider">Red Flags</span>
          </div>
          {redFlags.map((f, i) => (
            <div key={i} className="text-xs font-bold text-red-700 pl-6">• {f}</div>
          ))}
        </div>
      )}


      {/* Management — escalation ladder, colour-coded by urgency */}
      {management.map((group, gi) => {
        const t = group.title.toUpperCase();
        const tone =
          t.includes('STEP 4') || t.includes('LIFE-THREAT') || t.includes('FAILURE')
            ? { card: 'bg-red-50 border-red-300', title: 'text-red-800', dot: 'bg-red-600' }
          : t.includes('STEP 3') || t.includes('ESCALATION')
            ? { card: 'bg-orange-50 border-orange-300', title: 'text-orange-800', dot: 'bg-orange-500' }
          : t.includes('STEP 2') || t.includes('REASSESS')
            ? { card: 'bg-amber-50 border-amber-200', title: 'text-amber-800', dot: 'bg-amber-500' }
            : { card: 'bg-card border-border', title: 'text-foreground', dot: 'bg-primary' };
        return (
          <div key={gi} className={cn('rounded-2xl border-2 p-4 space-y-2.5', tone.card)}>
            <div className="flex items-center gap-2">
              <span className={cn('h-2.5 w-2.5 rounded-full shrink-0', tone.dot)} />
              <div className={cn('text-sm font-black', tone.title)}>{group.title}</div>
            </div>
            {group.recommendations.map((rec, ri) => {
              // Sub-bullets (indented options) render without a checkbox
              const isSubItem = /^\s*•/.test(rec);
              if (isSubItem) {
                return (
                  <div key={ri} className="pl-7 text-sm font-medium leading-snug text-muted-foreground">
                    {rec.trim()}
                  </div>
                );
              }
              return (
                <div key={ri} className="flex items-start gap-2">
                  <button
                    onClick={() => setGiven(prev => ({ ...prev, [`${gi}-${ri}`]: !prev[`${gi}-${ri}`] }))}
                    className={cn(
                      'mt-0.5 shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center transition-all',
                      given[`${gi}-${ri}`] ? 'bg-emerald-500 border-emerald-500' : 'border-muted-foreground/30 bg-white/60',
                    )}
                  >
                    {given[`${gi}-${ri}`] && <Check className="h-3 w-3 text-white" />}
                  </button>
                  <span className={cn('text-sm font-medium leading-snug', given[`${gi}-${ri}`] && 'line-through text-muted-foreground')}>
                    {rec}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Drug doses */}
      {doses.length > 0 && (
        <div className="bg-card rounded-2xl border p-4 space-y-3">
          <div className="text-sm font-black text-foreground">
            Drug Doses {weight ? `— ${weight} kg` : '(enter weight above)'}
          </div>
          {doses.map((d, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b last:border-0">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-black text-foreground">{d.drugName}</div>
                <div className="text-sm font-bold text-primary mt-0.5">{d.dose}</div>
                {d.notes && <div className="text-xs text-muted-foreground mt-0.5">{d.notes}</div>}
              </div>
              <button
                onClick={() => setGiven(prev => ({ ...prev, [`dose-${i}`]: !prev[`dose-${i}`] }))}
                className={cn(
                  'shrink-0 px-2.5 py-1 rounded-lg text-xs font-black border transition-all',
                  given[`dose-${i}`]
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-muted text-muted-foreground border-transparent',
                )}
              >
                {given[`dose-${i}`] ? '✓ Given' : 'Mark'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Copy orders */}
      <button
        onClick={copyOrders}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed text-sm font-black text-muted-foreground hover:text-foreground hover:border-foreground transition-all"
      >
        {copied ? <><Check className="h-4 w-4 text-emerald-500" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy order set</>}
      </button>
    </div>
  );
}

// ─── LABS TAB ────────────────────────────────────────────────────────────────

function LabsTab({ protocol, severity, formData }: {
  protocol: DiseaseProtocol;
  severity: Severity;
  formData: FormData;
}) {
  const inv = useMemo(
    () => protocol.getInvestigations
      ? protocol.getInvestigations(severity, formData)
      : (protocol.erData?.investigations ?? []),
    [protocol, severity, formData],
  );
  const [ordered, setOrdered] = useState<Record<string, boolean>>({});

  const categories: { key: string; label: string }[] = [
    { key: 'urgent', label: 'Urgent — Bedside' },
    { key: 'blood', label: 'Blood Tests' },
    { key: 'radiology', label: 'Radiology' },
    { key: 'other', label: 'Other' },
  ];

  return (
    <div className="space-y-4">
      {categories.map(cat => {
        const items = inv.filter(i => i.category === cat.key);
        if (!items.length) return null;
        return (
          <div key={cat.key} className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">{cat.label}</div>
            {items.map((item, idx) => {
              const key = `${cat.key}-${idx}`;
              return (
                <div
                  key={key}
                  className={cn(
                    'flex items-start gap-3 p-4 rounded-2xl border-2 transition-all',
                    ordered[key] ? 'bg-emerald-50 border-emerald-200' : 'bg-card border-transparent',
                  )}
                >
                  <button
                    onClick={() => setOrdered(prev => ({ ...prev, [key]: !prev[key] }))}
                    className={cn(
                      'mt-0.5 shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center transition-all',
                      ordered[key] ? 'bg-emerald-500 border-emerald-500' : 'border-muted-foreground/40',
                    )}
                  >
                    {ordered[key] && <Check className="h-3 w-3 text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className={cn('text-sm font-black', ordered[key] && 'line-through text-muted-foreground')}>
                      {item.test}
                    </div>
                    {item.indication && (
                      <div className="text-xs text-muted-foreground mt-0.5">{item.indication}</div>
                    )}
                    {item.criticalValue && (
                      <div className="text-xs font-bold text-red-600 mt-0.5">⚠ {item.criticalValue}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ─── DISPOSE TAB ─────────────────────────────────────────────────────────────

function DisposeTab({ protocol, severity, formData }: {
  protocol: DiseaseProtocol;
  severity: Severity;
  formData: FormData;
}) {
  const erData = protocol.erData;
  // All hooks must be declared before any conditional return
  const disposition = useMemo(
    () => protocol.getDisposition(severity, formData),
    [protocol, severity, formData],
  );
  const [admitChecked, setAdmitChecked] = useState<Record<string, boolean>>({});
  const [riskChecked, setRiskChecked] = useState<Record<string, boolean>>({});
  const [dischargeChecked, setDischargeChecked] = useState<Record<string, boolean>>({});
  const [safetyCopied, setSafetyCopied] = useState(false);

  if (!erData) return null;

  const admitCount = Object.values(admitChecked).filter(Boolean).length;
  const riskCount = Object.values(riskChecked).filter(Boolean).length;
  const dischargeCount = Object.values(dischargeChecked).filter(Boolean).length;
  const dischargeTotal = erData.dischargeCriteria.length;

  const copySafety = () => {
    navigator.clipboard.writeText(erData.safetyNetting.join('\n')).then(() => {
      setSafetyCopied(true);
      setTimeout(() => setSafetyCopied(false), 2000);
    });
  };

  const severityIsHigh = severity.level === 'severe' || severity.level === 'critical';
  const severityIsMod  = severity.level === 'moderate' || severity.level === 'some';
  const disposeCardCls = severityIsHigh
    ? 'bg-red-50 border-red-300'
    : severityIsMod
      ? 'bg-amber-50 border-amber-300'
      : 'bg-emerald-50 border-emerald-200';
  const disposeTextCls = severityIsHigh
    ? 'text-red-800'
    : severityIsMod
      ? 'text-amber-800'
      : 'text-emerald-800';

  return (
    <div className="space-y-5">
      {/* Dynamic disposition recommendation */}
      {disposition.length > 0 && (
        <div className={cn('rounded-2xl border-2 p-4 space-y-1.5', disposeCardCls)}>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Recommended Action
          </div>
          {disposition.map((d, i) => (
            <div key={i} className={cn('text-sm font-bold leading-snug', disposeTextCls)}>{d}</div>
          ))}
        </div>
      )}

      {/* Absolute admission criteria */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Absolute admission — ANY = admit regardless of response
          </div>
          {admitCount > 0 && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-red-100 text-red-700">
              {admitCount} met → ADMIT
            </span>
          )}
        </div>
        {erData.admissionCriteria.map((c, i) => (
          <div
            key={i}
            className={cn(
              'flex items-start gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer',
              admitChecked[i] ? 'bg-red-50 border-red-300' : 'bg-card border-transparent',
            )}
            onClick={() => setAdmitChecked(prev => ({ ...prev, [i]: !prev[i] }))}
          >
            <div className={cn(
              'mt-0.5 shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center',
              admitChecked[i] ? 'bg-red-500 border-red-500' : 'border-muted-foreground/40',
            )}>
              {admitChecked[i] && <Check className="h-3 w-3 text-white" />}
            </div>
            <span className="text-sm font-bold leading-snug">{c}</span>
          </div>
        ))}
      </div>

      {/* High-risk factors — conditional */}
      {erData.highRiskFactors && erData.highRiskFactors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">
              High-risk factors — lower admission threshold
            </div>
            {riskCount > 0 && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                {riskCount} present — clinical judgement required
              </span>
            )}
          </div>
          <div className="text-[11px] text-muted-foreground px-1 leading-snug">
            These are NOT automatic admit criteria. A child may be discharged if ALL discharge criteria are met — but the bar must be higher and follow-up more urgent.
          </div>
          {erData.highRiskFactors.map((c, i) => (
            <div
              key={i}
              className={cn(
                'flex items-start gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer',
                riskChecked[i] ? 'bg-amber-50 border-amber-300' : 'bg-card border-transparent',
              )}
              onClick={() => setRiskChecked(prev => ({ ...prev, [i]: !prev[i] }))}
            >
              <div className={cn(
                'mt-0.5 shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center',
                riskChecked[i] ? 'bg-amber-500 border-amber-500' : 'border-muted-foreground/40',
              )}>
                {riskChecked[i] && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className="text-sm font-medium leading-snug">{c}</span>
            </div>
          ))}
        </div>
      )}

      <div className="h-px bg-border" />

      {/* Discharge */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Discharge — ALL must be met
          </div>
          <span className={cn(
            'text-[10px] font-black px-2 py-0.5 rounded-md',
            dischargeCount === dischargeTotal
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-muted text-muted-foreground',
          )}>
            {dischargeCount}/{dischargeTotal} met
          </span>
        </div>
        {erData.dischargeCriteria.map((c, i) => (
          <div
            key={i}
            className={cn(
              'flex items-start gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer',
              dischargeChecked[i] ? 'bg-emerald-50 border-emerald-200' : 'bg-card border-transparent',
            )}
            onClick={() => setDischargeChecked(prev => ({ ...prev, [i]: !prev[i] }))}
          >
            <div className={cn(
              'mt-0.5 shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center',
              dischargeChecked[i] ? 'bg-emerald-500 border-emerald-500' : 'border-muted-foreground/40',
            )}>
              {dischargeChecked[i] && <Check className="h-3 w-3 text-white" />}
            </div>
            <span className={cn('text-sm font-bold leading-snug', dischargeChecked[i] && 'text-emerald-700')}>
              {c}
            </span>
          </div>
        ))}

        {dischargeCount === dischargeTotal && admitCount === 0 && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-black text-emerald-700">All discharge criteria met — safe to discharge</span>
          </div>
        )}
      </div>

      {/* Safety netting */}
      {erData.safetyNetting.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Safety netting advice (give to carer)
            </div>
            <button
              onClick={copySafety}
              className="flex items-center gap-1 text-xs font-black text-muted-foreground hover:text-foreground transition-colors"
            >
              {safetyCopied ? <><Check className="h-3 w-3 text-emerald-500" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
            </button>
          </div>
          <div className="bg-muted/40 rounded-2xl p-4 space-y-2">
            {erData.safetyNetting.map((s, i) => (
              <div key={i} className="text-sm font-medium text-foreground leading-snug">• {s}</div>
            ))}
          </div>
        </div>
      )}

      {/* References */}
      {protocol.getReferences().length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">References</div>
          {protocol.getReferences().map((ref, i) => (
            <a
              key={i}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-primary underline leading-snug hover:text-primary/80"
            >
              {ref.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function ErProtocolView({ protocol }: { protocol: DiseaseProtocol }) {
  const [tab, setTab] = useState<TabId>('assess');
  const [ageNum, setAgeNum] = useState('');
  const [ageUnit, setAgeUnit] = useState<'days' | 'months' | 'years'>('months');
  const [weightStr, setWeightStr] = useState('');
  const [spo2Str, setSpo2Str] = useState('');
  const [hrStr, setHrStr] = useState('');
  const [rrStr, setRrStr] = useState('');
  const [formData, setFormData] = useState<FormData>({});

  const ageMonths = useMemo(() => {
    const n = parseFloat(ageNum) || 0;
    if (ageUnit === 'days')  return n / 30.4;
    if (ageUnit === 'years') return n * 12;
    return n;
  }, [ageNum, ageUnit]);
  const weight = parseFloat(weightStr) || 0;
  const spo2 = parseFloat(spo2Str) || 0;
  const hr = parseFloat(hrStr) || 0;
  const rr = parseFloat(rrStr) || 0;
  const normals: VitalsNormals = useMemo(() => getVitalsNormals(ageMonths), [ageMonths]);

  // Sync weight, age, and vitals into formData so protocols can use them —
  // this is the shared pipe every protocol's calculateSeverity reads from.
  useEffect(() => {
    if (weight > 0) setFormData(prev => ({ ...prev, weight }));
  }, [weight]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, ageMonths: ageMonths > 0 ? ageMonths : undefined }));
  }, [ageMonths]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, oxygenSaturation: spo2 > 0 ? spo2 : undefined }));
  }, [spo2]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, heartRate: hr > 0 ? hr : undefined }));
  }, [hr]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, respiratoryRate: rr > 0 ? rr : undefined }));
  }, [rr]);

  const severity = useMemo(() => protocol.calculateSeverity(formData), [formData, protocol]);

  const severityBadgeColors: Record<string, string> = {
    mild: 'bg-emerald-500', low: 'bg-emerald-500', no: 'bg-emerald-500',
    some: 'bg-amber-500', moderate: 'bg-amber-500',
    severe: 'bg-red-500', critical: 'bg-red-700',
    'impending respiratory failure': 'bg-red-700',
    unknown: 'bg-muted-foreground',
  };
  const severityBadgeColor = severityBadgeColors[severity.level] ?? 'bg-muted-foreground';

  // Reference-mode protocols (severity read off a table, tapped by the
  // clinician) don't compute anything from raw SpO2/HR/RR — showing them
  // here is not just dead weight, it actively risks confusion, since the
  // vitals bar colour-codes against generic age-normals which can disagree
  // with the protocol's own severity-table bands for the same number.
  const isReferenceMode = !!protocol.erData?.severityClassification;

  return (
    <div className="max-w-2xl mx-auto space-y-0 pb-24">
      {/* ── Vitals inputs — normal (non-sticky) flow, scrolls away naturally ── */}
      <div className="px-2 sm:px-4 pt-3 pb-2">
        <div className="flex gap-2 overflow-x-auto">
          <div className="flex-1 min-w-[130px]">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Age</div>
            <div className="flex gap-1">
              <Input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={ageNum}
                onChange={e => setAgeNum(e.target.value)}
                className="h-10 text-base font-bold rounded-xl border-2 w-14 shrink-0"
              />
              <select
                value={ageUnit}
                onChange={e => setAgeUnit(e.target.value as 'days' | 'months' | 'years')}
                className="h-10 flex-1 text-xs font-bold rounded-xl border-2 border-input bg-background px-2 cursor-pointer"
              >
                <option value="days">Days</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
            {ageMonths > 0 && (
              <div className="text-[10px] text-muted-foreground mt-0.5">{normals.ageLabel}</div>
            )}
          </div>
          <VitalInput
            label="Weight" unit="kg" placeholder="e.g. 18"
            value={weightStr} onChange={setWeightStr}
          />
          {!isReferenceMode && (
            <>
              <VitalInput
                label="SpO₂" unit="%" placeholder="e.g. 94"
                value={spo2Str} onChange={setSpo2Str}
                status={spo2 > 0 ? spo2Status(spo2) : undefined}
                note={spo2 > 0 ? statusLabel(spo2Status(spo2), 'spo2', spo2, normals) : undefined}
              />
              <VitalInput
                label="HR" unit="bpm" placeholder="e.g. 130"
                value={hrStr} onChange={setHrStr}
                status={hr > 0 && ageMonths > 0 ? hrStatus(hr, normals) : undefined}
                note={hr > 0 && ageMonths > 0 ? statusLabel(hrStatus(hr, normals), 'hr', hr, normals) : undefined}
              />
              <VitalInput
                label="RR" unit="/min" placeholder="e.g. 45"
                value={rrStr} onChange={setRrStr}
                status={rr > 0 && ageMonths > 0 ? rrStatus(rr, normals) : undefined}
                note={rr > 0 && ageMonths > 0 ? statusLabel(rrStatus(rr, normals), 'rr', rr, normals) : undefined}
              />
            </>
          )}
        </div>
      </div>

      {/* ── Sticky Patient Bar — fixed height, never resizes ── */}
      <div className="sticky top-0 z-20 bg-background border-b px-2 sm:px-4 py-2 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground shrink-0">
            Patient {ageMonths > 0 ? `· ${normals.ageLabel}` : ''}
          </span>
          {(weight > 0 || (!isReferenceMode && (spo2 > 0 || hr > 0 || rr > 0))) && (
            <span className="text-[10px] font-bold text-muted-foreground truncate">
              {weight > 0 ? `${weight}kg` : ''}
              {!isReferenceMode && spo2 > 0 ? ` · SpO₂ ${spo2}%` : ''}
              {!isReferenceMode && hr > 0 ? ` · HR ${hr}` : ''}
              {!isReferenceMode && rr > 0 ? ` · RR ${rr}` : ''}
            </span>
          )}
          {severity.level !== 'unknown' && (
            <span className={cn('text-[10px] font-black text-white px-2 py-0.5 rounded-md shrink-0', severityBadgeColor)}>
              {severity.scoreDetails?.interpretation ?? severity.level.toUpperCase()}
              {severity.scoreDetails?.maxScore != null ? ` (${severity.scoreDetails.totalScore}/${severity.scoreDetails.maxScore})` : ''}
            </span>
          )}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 overflow-x-auto pb-0.5">
          {TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="px-2 sm:px-4 pt-4">
        {tab === 'assess'  && <AssessTab protocol={protocol} formData={formData} setFormData={setFormData} weight={weight} />}
        {tab === 'manage'  && <ManageTab protocol={protocol} formData={formData} weight={weight} />}
        {tab === 'labs'    && <LabsTab protocol={protocol} severity={severity} formData={formData} />}
        {tab === 'dispose' && <DisposeTab protocol={protocol} severity={severity} formData={formData} />}
      </div>
    </div>
  );
}
