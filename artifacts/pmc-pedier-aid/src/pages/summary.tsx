import { useParams, useSearch } from "wouter";
import { useProtocolById, useProtocolsContext } from "@/contexts/protocols-context";
import { Button } from "@/components/ui/button";
import { SeverityBadge } from "@/components/severity-badge";
import { ResultCard } from "@/components/result-card";
import {
  Stethoscope,
  Pill,
  BookOpen,
  TriangleAlert,
  Hospital,
  Printer,
  FileQuestion,
  Loader2,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { FormData } from "@/lib/protocols/types";
import { cn } from "@/lib/utils";

const SEVERITY_BANNER: Record<string, { card: string; icon: string }> = {
  mild:     { card: "bg-green-50  border-2 border-green-200  text-green-900",  icon: "text-green-600"  },
  moderate: { card: "bg-amber-50  border-2 border-amber-200  text-amber-900",  icon: "text-amber-600"  },
  severe:   { card: "bg-orange-50 border-2 border-orange-200 text-orange-900", icon: "text-orange-600" },
  critical: { card: "bg-red-50    border-2 border-red-200    text-red-900",    icon: "text-red-600"    },
  unknown:  { card: "bg-muted     border-2 border-border     text-muted-foreground", icon: "text-muted-foreground" },
};

export default function SummaryPage() {
  const params = useParams<{ diseaseId: string }>();
  const search = useSearch();
  const { isLoading } = useProtocolsContext();
  const protocol = useProtocolById(params.diseaseId);

  if (isLoading && !protocol) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!protocol) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Protocol not found</h1>
      </div>
    );
  }

  const searchParams = new URLSearchParams(search);

  const formData: FormData = {};
  protocol.questions.forEach((q) => {
    const value = searchParams.get(q.id);
    if (value !== null) {
      if (q.type === "number") {
        formData[q.id] = Number(value);
      } else if (q.type === "boolean") {
        formData[q.id] = value === "true";
      } else {
        formData[q.id] = String(value);
      }
    }
  });

  const severity = protocol.calculateSeverity(formData);
  const investigations = protocol.getInvestigations?.(severity, formData);
  const management = protocol.getManagement(severity, formData);
  const disposition = protocol.getDisposition(severity, formData);
  const dischargeCriteria = protocol.getDischargeCriteria?.(severity, formData);
  const followUp = protocol.getFollowUp?.(severity, formData);
  const redFlags = protocol.getRedFlags(severity, formData);
  const drugDoses = protocol.getDrugDoses(severity, formData);
  const references = protocol.getReferences();
  const lastUpdated = protocol.lastUpdated;

  const severityLevel = severity.level || "unknown";
  const bannerStyle = SEVERITY_BANNER[severityLevel] ?? SEVERITY_BANNER.unknown;

  const getAnswerDisplay = (id: string, value: any): string => {
    const question = protocol.questions.find((q) => q.id === id);
    if (!question || value === undefined) return "N/A";

    if (question.type === "boolean") return value ? "Yes" : "No";
    if (question.type === "select" || question.type === "radio") {
      return (
        question.options?.find((o) => String(o.value) === String(value))
          ?.label || String(value)
      );
    }
    return `${value}${question.unit ? " " + question.unit : ""}`;
  };

  return (
    <div className="max-w-4xl mx-auto bg-card p-4 sm:p-6 md:p-8 rounded-lg print-p-0 print-shadow-none">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-primary">
            {protocol.name} — Assessment Summary
          </h1>
          <p className="text-muted-foreground">
            Generated on: {new Date().toLocaleString()}
          </p>
        </div>
        <Button
          onClick={() => typeof window !== "undefined" && window.print()}
          className="no-print"
        >
          <Printer className="mr-2 h-4 w-4" /> Print
        </Button>
      </div>

      <div className="space-y-6">
        {/* 0. Meta Info */}
        {lastUpdated && (
          <p className="text-[10px] font-bold text-muted-foreground/40 italic text-right -mb-4">
            Protocol Last Reviewed: {lastUpdated}
          </p>
        )}

        {/* Patient answers */}
        <ResultCard title="Patient Assessment" icon={FileQuestion}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <p className="font-semibold text-sm">
                  {protocol.questions.find((q) => q.id === key)?.questionText}
                </p>
                <p className="text-muted-foreground">
                  {getAnswerDisplay(key, value)}
                </p>
              </div>
            ))}
          </div>
        </ResultCard>

        {/* Severity hero banner */}
        <div className={cn("rounded-xl p-4", bannerStyle.card)}>
          <div className="flex items-center gap-2 mb-2">
            <Stethoscope className={cn("h-4 w-4 shrink-0", bannerStyle.icon)} />
            <span className="text-xs font-semibold uppercase tracking-widest opacity-60">
              Severity Classification
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <SeverityBadge level={severityLevel} />
            {severity.details.length > 0 && (
              <p className="text-xs opacity-70">
                Based on: {severity.details.join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Red flags — right after severity */}
        <Alert className="border-red-200 bg-red-50 text-red-900">
          <TriangleAlert className="h-4 w-4 text-red-600" />
          <AlertTitle className="font-bold">Red Flags</AlertTitle>
          <AlertDescription className="mt-2">
            {redFlags.length > 0 ? (
              <ul className="space-y-1 text-sm">
                {redFlags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                    <span className="font-medium">{flag}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm">No immediate red flags identified.</p>
            )}
          </AlertDescription>
        </Alert>

        {/* Investigations */}
        {investigations && investigations.length > 0 && (
          <ResultCard title="Recommended Investigations" icon={Activity}>
            <div className="space-y-4">
              {investigations.map((inv, idx) => (
                <div key={idx} className="space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    {inv.title}
                  </h5>
                  <ul className="space-y-1">
                    {inv.list.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 ml-2">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-muted-foreground shrink-0" />
                        <span className="text-sm leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ResultCard>
        )}

        {/* Management — numbered steps */}
        {management.map((m) => (
          <ResultCard key={m.title} title={m.title} icon={Pill} variant="management">
            <ol className="space-y-2">
              {m.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="flex-1 leading-snug">{rec}</span>
                </li>
              ))}
            </ol>
          </ResultCard>
        ))}

        {/* Final Decision (was Disposition) */}
        <ResultCard title="Triage / Disposition" icon={Hospital} variant="decision">
          <ul className="space-y-2">
            {disposition.map((d, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="leading-snug">{d}</span>
              </li>
            ))}
          </ul>
        </ResultCard>

        {/* Discharge & Follow-up */}
        {(dischargeCriteria || followUp) && (
          <ResultCard title="Safe Discharge & Follow-Up" icon={CheckCircle2}>
            <div className="space-y-5">
              {dischargeCriteria && dischargeCriteria.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Discharge Criteria</h5>
                  <ul className="space-y-1">
                    {dischargeCriteria.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm leading-snug">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {followUp && followUp.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-blue-700">Follow-Up Plan</h5>
                  <ul className="space-y-1">
                    {followUp.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Activity className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-sm leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </ResultCard>
        )}

        {/* Drug doses — compact scannable table */}
        {drugDoses.length > 0 && (
          <ResultCard title="Relevant Drug Doses" icon={Pill} variant="drug">
            <div className="divide-y divide-border rounded-md overflow-hidden border">
              {drugDoses.map((drug, i) => (
                <div key={i} className="px-3 py-2 bg-background">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-sm">{drug.drugName}</span>
                    <span className="text-sm text-right shrink-0 text-muted-foreground">{drug.dose}</span>
                  </div>
                  {drug.notes && (
                    <p className="text-xs text-muted-foreground mt-0.5">{drug.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </ResultCard>
        )}

        {/* References — always shown on print */}
        {references.length > 0 && (
          <ResultCard title="References" icon={BookOpen} variant="info">
            <ul className="list-disc list-inside space-y-1">
              {references.map((ref, i) => (
                <li key={i}>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {ref.title}
                  </a>
                </li>
              ))}
            </ul>
          </ResultCard>
        )}
      </div>
    </div>
  );
}
