import { useParams, useSearch } from "wouter";
import { getProtocolById } from "@/lib/protocols";
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
} from "lucide-react";
import type { FormData } from "@/lib/protocols/types";

export default function SummaryPage() {
  const params = useParams<{ diseaseId: string }>();
  const search = useSearch();
  const protocol = getProtocolById(params.diseaseId);

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
  const management = protocol.getManagement(severity, formData);
  const disposition = protocol.getDisposition(severity, formData);
  const redFlags = protocol.getRedFlags(severity, formData);
  const drugDoses = protocol.getDrugDoses(severity, formData);
  const references = protocol.getReferences();

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
            {protocol.name} - Assessment Summary
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

        <ResultCard title="Severity Classification" icon={Stethoscope}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <SeverityBadge level={severity.level || "unknown"} />
            {severity.details.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Based on: {severity.details.join(", ")}
              </p>
            )}
          </div>
        </ResultCard>

        {management.map((m) => (
          <ResultCard key={m.title} title={m.title} icon={Pill}>
            <ul className="list-disc list-inside space-y-1">
              {m.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </ResultCard>
        ))}

        <ResultCard title="Disposition" icon={Hospital}>
          <ul className="list-disc list-inside space-y-1">
            {disposition.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </ResultCard>

        <ResultCard title="Red Flags" icon={TriangleAlert}>
          <ul className="list-disc list-inside space-y-1 text-destructive">
            {redFlags.map((flag, i) => (
              <li key={i} className="font-medium">
                {flag}
              </li>
            ))}
          </ul>
        </ResultCard>

        {drugDoses.length > 0 && (
          <ResultCard title="Relevant Drug Doses" icon={Pill}>
            <div className="space-y-2">
              {drugDoses.map((drug, i) => (
                <div key={i} className="p-2 bg-secondary/50 rounded-md">
                  <p className="font-semibold">{drug.drugName}</p>
                  <p>{drug.dose}</p>
                  {drug.notes && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {drug.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ResultCard>
        )}

        {references.length > 0 && (
          <ResultCard title="References" icon={BookOpen}>
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
