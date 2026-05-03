import { useState, useMemo } from "react";
import { useParams, useLocation, useSearch } from "wouter";
import { useProtocolsContext } from "@/contexts/protocols-context";
import { allProtocols } from "@/lib/protocols";
import { ProtocolBuilder } from "@/app/admin/protocol-builder";
import { ProtocolDrafter } from "@/app/admin/protocol-drafter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, FileText, Sparkles, Lock } from "lucide-react";
import type { CustomProtocol, CustomQuestion, SeverityLevel } from "@/lib/custom-protocol-types";
import { Link } from "wouter";

type Mode = "select" | "builder" | "ai";

function ModeSelector({ onSelect }: { onSelect: (mode: "builder" | "ai") => void }) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Create New Protocol</h1>
        <p className="text-muted-foreground mt-1">
          Choose how you want to build this protocol.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={() => onSelect("builder")} className="text-left group">
          <Card className="h-full border-2 border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group-hover:bg-primary/[0.01]">
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-1">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="font-headline">Protocol Builder</CardTitle>
              <CardDescription>Tier 1 — Structured form</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Fill in questions, severity rules, management sections, and drug doses step by step using structured forms.
              </p>
            </CardContent>
          </Card>
        </button>

        <button onClick={() => onSelect("ai")} className="text-left group">
          <Card className="h-full border-2 border-border hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group-hover:bg-blue-50/30">
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 mb-1">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="font-headline">AI Protocol Drafter</CardTitle>
              <CardDescription>Tier 2 — AI-assisted</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Describe the protocol in plain English or paste guideline text — AI generates the full structured protocol for you to review and edit.
              </p>
            </CardContent>
          </Card>
        </button>
      </div>
      <div className="flex justify-center">
        <Button variant="ghost" asChild>
          <Link href="/admin/protocols">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Protocol List
          </Link>
        </Button>
      </div>
    </div>
  );
}

/** Convert a built-in DiseaseProtocol's serialisable fields to a CustomProtocol draft */
function cloneBuiltIn(
  protocol: { id: string; name: string; system: string; description: string; questions: any[] }
): Partial<CustomProtocol> {
  return {
    id: protocol.id,
    name: protocol.name,
    system: protocol.system,
    description: protocol.description,
    questions: protocol.questions.map(
      (q): CustomQuestion => ({
        id: q.id,
        questionText: q.questionText,
        type: q.type as CustomQuestion["type"],
        unit: q.unit,
        placeholder: q.placeholder,
        info: q.info,
        options: q.options?.map((o: any) => ({
          value: String(o.value),
          label: o.label,
        })),
      })
    ),
    severityRules: [],
    defaultSeverity: "mild" as SeverityLevel,
    management: [],
    disposition: [],
    redFlags: [],
    drugDoses: [],
    references: [],
  };
}

export default function ProtocolEditorPage() {
  const params = useParams<{ protocolId: string }>();
  const search = useSearch();
  const [, navigate] = useLocation();
  const { rawCustomProtocols, isLoading, refetch } = useProtocolsContext();

  const searchParams = new URLSearchParams(search);
  const cloneSourceId = searchParams.get("clone");
  const modeParam = searchParams.get("mode") as "builder" | "ai" | null;

  const [mode, setMode] = useState<Mode>(() => {
    if (cloneSourceId) return "builder";
    if (modeParam === "builder") return "builder";
    if (modeParam === "ai") return "ai";
    return "select";
  });
  const [draftData, setDraftData] = useState<Partial<CustomProtocol> | null>(null);

  const protocolId = params.protocolId;
  const isNew = protocolId === "new";

  const handleSaved = async () => {
    await refetch();
    navigate("/admin/protocols");
  };

  // Clone mode — pre-populate builder from a built-in protocol
  const cloneData = useMemo(() => {
    if (!cloneSourceId) return null;
    const source = allProtocols.find((p) => p.id === cloneSourceId);
    if (!source) return null;
    return cloneBuiltIn(source);
  }, [cloneSourceId]);

  if (!isNew) {
    // Editing an existing custom protocol
    const existingCustom = rawCustomProtocols.find((p) => p.id === protocolId);
    const existingBuiltIn = allProtocols.find((p) => p.id === protocolId);

    if (isLoading && !existingCustom && !existingBuiltIn) {
      return (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      );
    }

    if (existingCustom) {
      return <ProtocolBuilder initialData={existingCustom} onSaved={handleSaved} />;
    }

    if (existingBuiltIn) {
      // Built-in that hasn't been cloned yet — offer to clone or go back
      return (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/protocols">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted border border-border shrink-0">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="font-headline text-xl">{existingBuiltIn.name}</CardTitle>
                    <Badge variant="secondary">Built-in</Badge>
                    <Badge variant="outline">{existingBuiltIn.system}</Badge>
                  </div>
                  <CardDescription className="mt-1">{existingBuiltIn.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/40 rounded-lg p-4 border border-border text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Built-in protocol</p>
                <p>
                  Clone this protocol to create a fully editable custom version. Questions are pre-filled;
                  you'll need to add severity rules, management sections, and drug doses.
                  If you use the same ID the custom version will automatically replace this built-in.
                </p>
              </div>
              <Button
                onClick={() => navigate(`/admin/protocols/new?clone=${existingBuiltIn.id}`)}
              >
                Clone & Edit in Builder
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Protocol not found</h1>
        <p className="text-muted-foreground mt-2">The requested protocol does not exist.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/admin/protocols">Back to list</Link>
        </Button>
      </div>
    );
  }

  // New protocol with clone source
  if (cloneData && mode === "builder") {
    return (
      <ProtocolBuilder
        initialData={cloneData}
        onSaved={handleSaved}
        isClone
      />
    );
  }

  if (mode === "select") {
    return <ModeSelector onSelect={setMode} />;
  }

  if (mode === "ai") {
    return (
      <ProtocolDrafter
        onDraftReady={(draft) => {
          setDraftData(draft);
          setMode("builder");
        }}
        onSaved={handleSaved}
      />
    );
  }

  return (
    <ProtocolBuilder
      initialData={draftData}
      onSaved={handleSaved}
    />
  );
}
