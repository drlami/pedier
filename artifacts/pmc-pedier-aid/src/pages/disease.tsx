import { useParams } from "wouter";
import { getProtocolById } from "@/lib/protocols";
import { AssessmentForm } from "@/app/diseases/[diseaseId]/assessment-form";

export default function DiseasePage() {
  const params = useParams<{ diseaseId: string }>();
  const protocol = getProtocolById(params.diseaseId);

  if (!protocol) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Protocol not found</h1>
        <p className="text-muted-foreground mt-2">The requested protocol does not exist.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary text-center mb-2">
        {protocol.name}
      </h1>
      <p className="text-muted-foreground text-center mb-8">
        {protocol.description}
      </p>
      <AssessmentForm diseaseId={params.diseaseId} />
    </div>
  );
}
