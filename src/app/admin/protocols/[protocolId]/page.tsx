import { getProtocolById, allProtocols } from "@/lib/protocols";
import { notFound } from "next/navigation";
import { ProtocolEditor } from "./protocol-editor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";

type ProtocolEditorPageProps = {
  params: {
    protocolId: string;
  };
};

export default function ProtocolEditorPage({ params }: ProtocolEditorPageProps) {
  const { protocolId } = params;
  const isNew = protocolId === "new";
  const protocol = isNew ? null : getProtocolById(protocolId);

  if (!isNew && !protocol) {
    notFound();
  }

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
          <ProtocolEditor protocol={protocol} />
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
