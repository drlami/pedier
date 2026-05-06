import { useParams } from "wouter";
import { useProtocolById, useProtocolsContext } from "@/contexts/protocols-context";
import { AssessmentForm } from "@/app/diseases/[diseaseId]/assessment-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Stethoscope, Loader2 } from "lucide-react";

export default function DiseasePage() {
  const params = useParams<{ diseaseId: string }>();
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
        <p className="text-muted-foreground mt-2">The requested protocol does not exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 pb-5 border-b border-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 shrink-0 mt-0.5">
          <Stethoscope className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-headline text-foreground leading-tight">
            {protocol.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {protocol.description}
          </p>
        </div>
        <span className="ml-auto shrink-0 text-[10px] font-semibold text-primary/70 bg-primary/8 border border-primary/15 rounded px-2 py-1 tracking-wide uppercase hidden sm:block">
          {protocol.system}
        </span>
      </div>
      {protocol.id === 'iron-toxicity' && (
        <Alert variant="destructive" className="bg-destructive/10">
          <AlertTitle className="font-bold text-sm">Pediatric Toxic Dose Reference</AlertTitle>
          <AlertDescription className="text-xs mt-1 space-y-1">
            <div>&lt;20 mg/kg → non-toxic</div>
            <div>20–40 mg/kg → mild toxicity possible</div>
            <div>≥40 mg/kg → toxic ingestion</div>
            <div>≥60 mg/kg → severe toxicity risk</div>
            <div>&gt;120 mg/kg → potentially lethal</div>
          </AlertDescription>
        </Alert>
      )}
      <AssessmentForm diseaseId={params.diseaseId} />
    </div>
  );
}
