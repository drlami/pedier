import { useState } from "react";
import { useParams, useLocation, useSearch } from "wouter";
import { useProtocolsContext } from "@/contexts/protocols-context";
import { allProtocols } from "@/lib/protocols";
import { ProtocolBuilder } from "@/app/admin/protocol-builder";
import { ProtocolDrafter } from "@/app/admin/protocol-drafter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bot, FormInput, Lock, Loader2, FileText, Sparkles } from "lucide-react";
import type { CustomProtocol } from "@/lib/custom-protocol-types";
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
        <button
          onClick={() => onSelect("builder")}
          className="text-left group"
        >
          <Card className="h-full border-2 border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group-hover:bg-primary/[0.01]">
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-1">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="font-headline">Protocol Builder</CardTitle>
              <CardDescription>
                Tier 1 — Structured form
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Best for content-based protocols. Fill in questions, severity rules, management sections, and drug doses step by step using structured forms.
              </p>
              <ul className="mt-3 space-y-1">
                {["Questions & severity rules", "Management sections by severity", "Weight-based drug dose formulas", "Disposition & red flags"].map((f) => (
                  <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </button>

        <button
          onClick={() => onSelect("ai")}
          className="text-left group"
        >
          <Card className="h-full border-2 border-border hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group-hover:bg-blue-50/30">
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 mb-1">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="font-headline">AI Protocol Drafter</CardTitle>
              <CardDescription>
                Tier 2 — AI-assisted
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Best for complex protocols. Describe the protocol in plain English or paste guideline text — AI generates the full structured protocol for you to review and edit.
              </p>
              <ul className="mt-3 space-y-1">
                {["Plain English or guideline text input", "AI generates complete protocol", "Review & edit before saving", "Open in Builder to refine"].map((f) => (
                  <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
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

function BuiltInProtocolView({ protocol }: { protocol: { id: string; name: string; system: string; description: string } }) {
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
                <CardTitle className="font-headline text-xl">{protocol.name}</CardTitle>
                <Badge variant="secondary">Built-in</Badge>
                <Badge variant="outline">{protocol.system}</Badge>
              </div>
              <CardDescription className="mt-1">{protocol.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/40 rounded-lg p-4 border border-border text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Read-only Protocol</p>
            <p>
              This is a built-in protocol defined in the application code. It cannot be edited through the admin interface.
              To create a similar custom protocol, use the Protocol Builder or AI Drafter.
            </p>
          </div>
          <div className="flex gap-2 mt-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/protocols/new?mode=builder">
                <FileText className="mr-2 h-4 w-4" />
                Create Similar Protocol
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProtocolEditorPage() {
  const params = useParams<{ protocolId: string }>();
  const search = useSearch();
  const [, navigate] = useLocation();
  const { rawCustomProtocols, isLoading, refetch } = useProtocolsContext();
  const [mode, setMode] = useState<Mode>(() => {
    const params = new URLSearchParams(search);
    const m = params.get("mode");
    if (m === "builder") return "builder";
    if (m === "ai") return "ai";
    return "select";
  });
  const [draftData, setDraftData] = useState<Omit<CustomProtocol, "isCustom" | "createdAt" | "updatedAt"> | null>(null);

  const protocolId = params.protocolId;
  const isNew = protocolId === "new";

  const handleSaved = async () => {
    await refetch();
    navigate("/admin/protocols");
  };

  if (!isNew) {
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
      return <BuiltInProtocolView protocol={existingBuiltIn} />;
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

  return <ProtocolBuilder initialData={draftData} onSaved={handleSaved} />;
}
