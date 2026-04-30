import { getProtocolById, allProtocols } from "@/lib/protocols";
import { notFound } from "next/navigation";
import { ProtocolEditor } from "./protocol-editor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";
import type { SerializableProtocol } from "@/lib/protocols/types";

type ProtocolEditorPageProps = {
  params: Promise<{
    protocolId: string;
  }>;
};

export default async function ProtocolEditorPage({ params }: ProtocolEditorPageProps) {
  const { protocolId } = await params;
  const isNew = protocolId === "new";
  const protocol = isNew ? null : getProtocolById(protocolId);

  if (!isNew && !protocol) {
    notFound();
  }

  // Create a serializable version of the protocol to pass to the client component
  const serializableProtocol: SerializableProtocol | null = protocol ? {
    id: protocol.id,
    name: protocol.name,
    system: protocol.system,
    description: protocol.description,
    image: protocol.image,
    questions: protocol.questions,
    logicStrings: {
      calculateSeverity: protocol.calculateSeverity.toString(),
      getManagement: protocol.getManagement.toString(),
      getDisposition: protocol.getDisposition.toString(),
      getRedFlags: protocol.getRedFlags.toString(),
      getDrugDoses: protocol.getDrugDoses.toString(),
      getReferences: protocol.getReferences.toString(),
    }
  } : null;

  return (
    <div>
       <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl">
                {isNew ? "Create New Protocol" : `Edit: ${protocol?.name}`}
              </CardTitle>
              <CardDescription>
                {isNew
                  ? "Fill out the form below to add a new clinical protocol."
                  : "Modify the protocol details below. Changes will be saved upon submission."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ProtocolEditor protocol={serializableProtocol} />
        </CardContent>
      </Card>
    </div>
  );
}

export async function generateStaticParams() {
    const paths = allProtocols.map((protocol) => ({
        protocolId: protocol.id,
    }));
    paths.push({ protocolId: 'new' });
    return paths;
}
