import type { DiseaseProtocol, FormData, Severity } from '@/lib/protocols/types';
import type { CustomProtocol, SeverityLevel } from '@/lib/custom-protocol-types';

function evaluateExpressions(text: string, formData: FormData): string {
  return text.replace(/\{\{(.+?)\}\}/g, (_, expr) => {
    try {
      const vars = Object.entries(formData)
        .filter(([k]) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(k))
        .map(([k, v]) => `const ${k} = ${JSON.stringify(v ?? null)};`)
        .join('\n');
      // eslint-disable-next-line no-new-func
      const result = new Function(`${vars}\nreturn (${expr.trim()});`)();
      if (typeof result === 'number') {
        const rounded = Math.round(result * 100) / 100;
        return String(rounded);
      }
      return String(result ?? '');
    } catch {
      return `[${expr.trim()}]`;
    }
  });
}

function evaluateCondition(condition: string, formData: FormData): boolean {
  if (!condition.trim()) return false;
  try {
    const vars = Object.entries(formData)
      .filter(([k]) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(k))
      .map(([k, v]) => `const ${k} = ${JSON.stringify(v ?? null)};`)
      .join('\n');
    // eslint-disable-next-line no-new-func
    return Boolean(new Function(`${vars}\nreturn Boolean(${condition.trim()});`)());
  } catch {
    return false;
  }
}

function toSeverityLevel(level: SeverityLevel): import('@/lib/protocols/types').SeverityLevel {
  return level as import('@/lib/protocols/types').SeverityLevel;
}

export function adaptCustomProtocol(custom: CustomProtocol): DiseaseProtocol {
  return {
    id: custom.id,
    name: custom.name,
    system: custom.system,
    description: custom.description,
    image: { url: '', hint: custom.name },
    questions: custom.questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      type: q.type as import('@/lib/protocols/types').QuestionType,
      unit: q.unit,
      placeholder: q.placeholder,
      info: q.info,
      options: q.options?.map((o) => ({ value: o.value, label: o.label })),
    })),

    calculateSeverity: (formData: FormData): Severity => {
      const sorted = [...custom.severityRules].sort((a, b) => a.priority - b.priority);
      for (const rule of sorted) {
        if (evaluateCondition(rule.condition, formData)) {
          return {
            level: toSeverityLevel(rule.level),
            details: rule.detail ? [rule.detail] : [],
          };
        }
      }
      return { level: toSeverityLevel(custom.defaultSeverity), details: [] };
    },

    getManagement: (severity: Severity, formData: FormData) => {
      return custom.management
        .filter(
          (m) => m.severities === null || m.severities.includes(severity.level as SeverityLevel)
        )
        .map((m) => ({
          title: m.title,
          recommendations: m.recommendations.map((r) => evaluateExpressions(r, formData)),
        }));
    },

    getDisposition: (severity: Severity, formData: FormData) => {
      return custom.disposition
        .filter(
          (d) => d.severities === null || d.severities.includes(severity.level as SeverityLevel)
        )
        .map((d) => evaluateExpressions(d.text, formData));
    },

    getRedFlags: (_severity: Severity, _formData: FormData) => {
      return custom.redFlags;
    },

    getDrugDoses: (severity: Severity, formData: FormData) => {
      return custom.drugDoses
        .filter(
          (d) => d.severities === null || d.severities.includes(severity.level as SeverityLevel)
        )
        .map((d) => ({
          drugName: d.drugName,
          dose: evaluateExpressions(d.dose, formData),
          notes: d.maxDose ? `Max: ${d.maxDose}${d.notes ? ` · ${d.notes}` : ''}` : d.notes,
        }));
    },

    getReferences: () => {
      return custom.references.map((r) => ({
        title: r.title,
        url: r.url || '#',
      }));
    },
  };
}
