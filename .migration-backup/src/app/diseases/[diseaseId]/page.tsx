import { notFound } from "next/navigation";
import { getProtocolById } from "@/lib/protocols";
import { AssessmentForm } from "./assessment-form";

type DiseasePageProps = {
  params: {
    diseaseId: string;
  };
};

export default function DiseasePage({ params }: DiseasePageProps) {
  const protocol = getProtocolById(params.diseaseId);

  if (!protocol) {
    notFound();
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

export async function generateStaticParams() {
    // In a real app, you'd fetch this from a DB or CMS
    const { allProtocols } = await import('@/lib/protocols');
    
    return allProtocols.map((protocol) => ({
        diseaseId: protocol.id,
    }));
}
