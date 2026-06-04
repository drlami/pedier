import { useState, useMemo, useEffect, useCallback } from 'react';
import { DiseaseProtocol, FormData, ErHistoryItem } from '@/lib/protocols/types';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  AlertTriangle, CheckCircle2, FlaskConical, Stethoscope, LogOut, History,
  Activity, Copy, Check,
} from 'lucide-react';
import {
  getVitalsNormals, parseAgeToMonths, hrStatus, rrStatus, spo2Status,
  statusColor, statusLabel, type VitalsNormals,
} from '@/lib/er-vitals-normals';

// ─── types ────────────────────────────────────────────────────────────────────

type TabId = 'assess' | 'history' | 'manage' | 'labs' | 'dispose';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'assess',  label: 'Assess',   icon: Activity },
  { id: 'history', label: 'History',  icon: History },
  { id: 'manage',  label: 'Manage',   icon: Stethoscope },
  { id: 'labs',    label: 'Labs',     icon: FlaskConical },
  { id: 'dispose', label: 'Dispose',  icon: LogOut },
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

function AssessTab({ protocol, formData, setFormData, weight }: {
  protocol: DiseaseProtocol;
  formData: FormData;
  setFormData: (d: FormData) => void;
  weight: number;
}) {
  const severity = useMemo(() => protocol.calculateSeverity(formData), [formData, protocol]);
  const answered = protocol.questions.filter(q => q.id !== 'weight' && formData[q.id] !== undefined).length;
  const scorable = protocol.questions.filter(q => q.id !== 'weight' && q.type === 'select').length;

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

  return (
    <div className="space-y-4">
      {/* Score result */}
      <div className={cn('rounded-2xl border-2 p-4', ss.bg)}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {severity.scoreDetails?.systemName ?? 'Severity'}
            </div>
            <div className={cn('text-2xl font-black mt-0.5', ss.text)}>
              {severity.scoreDetails
                ? `${severity.scoreDetails.totalScore} / ${severity.scoreDetails.maxScore}`
                : severity.level.toUpperCase()}
            </div>
            {severity.scoreDetails && (
              <div className={cn('text-sm font-bold', ss.text)}>
                {severity.scoreDetails.interpretation}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground font-medium">
              {answered}/{scorable} criteria answered
            </div>
            {severity.details.map((d, i) => (
              <div key={i} className={cn('text-xs font-bold mt-1 flex items-center gap-1 justify-end', ss.text)}>
                <AlertTriangle className="h-3 w-3 shrink-0" /> {d}
              </div>
            ))}
          </div>
        </div>
        {/* Score bar */}
        {severity.scoreDetails && (
          <div className="mt-3">
            <div className="h-2 bg-white/50 rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-500', ss.badge)}
                style={{ width: `${(severity.scoreDetails.totalScore / (severity.scoreDetails.maxScore ?? 12)) * 100}%` }}
              />
            </div>
            {severity.scoreDetails.referenceTable && (
              <div className="flex justify-between mt-1">
                {severity.scoreDetails.referenceTable.map(r => (
                  <div key={r.range} className="text-center">
                    <div className="text-[9px] font-bold text-muted-foreground">{r.range}</div>
                    <div className="text-[9px] text-muted-foreground">{r.meaning.split(' ')[0]}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {protocol.questions.filter(q => q.id !== 'weight').map(q => {
          const val = formData[q.id];
          if (q.type === 'select' && q.options) {
            return (
              <div key={q.id} className="bg-card rounded-2xl border p-4 space-y-2.5">
                <div className="text-sm font-black text-foreground">{q.questionText}</div>
                <div className="flex flex-wrap gap-2">
                  {q.options.map(opt => {
                    const selected = String(val) === String(opt.value);
                    const score = opt.score ?? 0;
                    const isHigh = score >= 2;
                    return (
                      <button
                        key={String(opt.value)}
                        onClick={() => setFormData({ ...formData, [q.id]: opt.value })}
                        className={cn(
                          'px-3 py-2 rounded-xl text-xs font-black transition-all border-2',
                          selected
                            ? isHigh
                              ? 'bg-red-500 text-white border-red-500'
                              : score === 1
                              ? 'bg-amber-500 text-white border-amber-500'
                              : 'bg-emerald-500 text-white border-emerald-500'
                            : 'bg-muted border-transparent text-muted-foreground hover:bg-muted/80'
                        )}
                      >
                        {opt.label}
                        {opt.score !== undefined && (
                          <span className="ml-1 opacity-70">+{opt.score}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }
          if (q.type === 'boolean') {
            return (
              <div key={q.id} className="bg-card rounded-2xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-black text-foreground">{q.questionText}</div>
                    {q.info && <div className="text-xs text-muted-foreground mt-0.5">{q.info}</div>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {['Yes', 'No'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setFormData({ ...formData, [q.id]: opt === 'Yes' })}
                        className={cn(
                          'px-4 py-2 rounded-xl text-xs font-black border-2 transition-all',
                          String(val) === String(opt === 'Yes')
                            ? opt === 'Yes'
                              ? 'bg-red-500 text-white border-red-500'
                              : 'bg-emerald-500 text-white border-emerald-500'
                            : 'bg-muted border-transparent text-muted-foreground hover:bg-muted/80'
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
        })}
      </div>

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

function HistoryTab({ items }: { items: ErHistoryItem[] }) {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const redFlagCount = items.filter(i => i.redFlag && answers[i.id] === true).length;

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
        const ans = answers[item.id];
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
                {['Yes', 'No'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setAnswers(prev => ({ ...prev, [item.id]: opt === 'Yes' }))}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all',
                      ans !== null && String(ans) === String(opt === 'Yes')
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

function LabsTab({ protocol }: { protocol: DiseaseProtocol }) {
  const inv = protocol.erData?.investigations ?? [];
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

function DisposeTab({ protocol }: { protocol: DiseaseProtocol }) {
  const erData = protocol.erData;
  if (!erData) return null;

  const [admitChecked, setAdmitChecked] = useState<Record<string, boolean>>({});
  const [riskChecked, setRiskChecked] = useState<Record<string, boolean>>({});
  const [dischargeChecked, setDischargeChecked] = useState<Record<string, boolean>>({});
  const [safetyCopied, setSafetyCopied] = useState(false);

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

  return (
    <div className="space-y-5">
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
  const [ageStr, setAgeStr] = useState('');
  const [weightStr, setWeightStr] = useState('');
  const [spo2Str, setSpo2Str] = useState('');
  const [hrStr, setHrStr] = useState('');
  const [formData, setFormData] = useState<FormData>({});

  const ageMonths = useMemo(() => parseAgeToMonths(ageStr), [ageStr]);
  const weight = parseFloat(weightStr) || 0;
  const spo2 = parseFloat(spo2Str) || 0;
  const hr = parseFloat(hrStr) || 0;
  const normals: VitalsNormals = useMemo(() => getVitalsNormals(ageMonths), [ageMonths]);

  // Keep weight in formData for drug dose calculations
  useEffect(() => {
    if (weight > 0) setFormData(prev => ({ ...prev, weight }));
  }, [weight]);

  const severity = useMemo(() => protocol.calculateSeverity(formData), [formData, protocol]);

  const severityBadgeColors: Record<string, string> = {
    mild: 'bg-emerald-500', low: 'bg-emerald-500', no: 'bg-emerald-500',
    some: 'bg-amber-500', moderate: 'bg-amber-500',
    severe: 'bg-red-500', critical: 'bg-red-700',
    'impending respiratory failure': 'bg-red-700',
    unknown: 'bg-muted-foreground',
  };
  const severityBadgeColor = severityBadgeColors[severity.level] ?? 'bg-muted-foreground';

  return (
    <div className="max-w-2xl mx-auto space-y-0 pb-24">
      {/* ── Sticky Patient Bar ── */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b px-2 sm:px-4 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Patient {ageMonths > 0 ? `· ${normals.ageLabel}` : ''}
          </span>
          {severity.level !== 'unknown' && (
            <span className={cn('text-[10px] font-black text-white px-2 py-0.5 rounded-md', severityBadgeColor)}>
              {severity.scoreDetails?.interpretation ?? severity.level.toUpperCase()}
              {severity.scoreDetails ? ` (${severity.scoreDetails.totalScore}/${severity.scoreDetails.maxScore})` : ''}
            </span>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <VitalInput
            label="Age" placeholder="e.g. 4y" value={ageStr}
            onChange={setAgeStr}
          />
          <VitalInput
            label="Weight" unit="kg" placeholder="e.g. 18"
            value={weightStr} onChange={setWeightStr}
          />
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
        {tab === 'history' && <HistoryTab items={protocol.erData?.historyChecklist ?? []} />}
        {tab === 'manage'  && <ManageTab protocol={protocol} formData={formData} weight={weight} />}
        {tab === 'labs'    && <LabsTab protocol={protocol} />}
        {tab === 'dispose' && <DisposeTab protocol={protocol} />}
      </div>
    </div>
  );
}
