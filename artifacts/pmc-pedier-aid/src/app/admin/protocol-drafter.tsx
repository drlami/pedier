"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Loader2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Save,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAuthToken } from "@/contexts/auth-context";
import type { CustomProtocol } from "@/lib/custom-protocol-types";
import { Link } from "wouter";

interface ProtocolDrafterProps {
  onDraftReady?: (draft: Omit<CustomProtocol, "isCustom" | "createdAt" | "updatedAt">) => void;
  onSaved?: () => void;
}

export function ProtocolDrafter({ onDraftReady, onSaved }: ProtocolDrafterProps) {
  const { toast } = useToast();
  const [description, setDescription] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<CustomProtocol | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showJson, setShowJson] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim() || description.trim().length < 20) {
      setError("Please provide at least 20 characters describing the protocol.");
      return;
    }
    setError(null);
    setGenerating(true);
    setDraft(null);
    try {
      const token = getAuthToken();
      const res = await fetch("/api/ai/draft-custom-protocol", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "AI processing failed.");
      } else {
        setDraft(json as CustomProtocol);
      }
    } catch {
      setError("Failed to connect to AI service.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveDirectly = async () => {
    if (!draft) return;
    const token = getAuthToken();
    setSaving(true);
    try {
      const res = await fetch("/api/protocols", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(draft),
      });
      if (res.ok) {
        toast({ title: "Protocol saved!", description: `"${draft.name}" is now live.` });
        onSaved?.();
      } else {
        const json = await res.json();
        toast({ variant: "destructive", title: "Save failed", description: json.message });
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to save." });
    } finally {
      setSaving(false);
    }
  };

  const handleOpenInBuilder = () => {
    if (!draft) return;
    onDraftReady?.(draft);
  };

  const SEVERITY_COLOR: Record<string, string> = {
    mild: "bg-green-100 text-green-700 border-green-200",
    moderate: "bg-amber-100 text-amber-700 border-amber-200",
    severe: "bg-red-100 text-red-700 border-red-200",
    some: "bg-orange-100 text-orange-700 border-orange-200",
    no: "bg-gray-100 text-gray-600 border-gray-200",
    unknown: "bg-gray-100 text-gray-600 border-gray-200",
  };

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

      <div>
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-blue-500" />
          AI Protocol Drafter
        </h1>
        <p className="text-muted-foreground mt-1">
          Describe the protocol in plain English or paste guideline text. The AI will generate a complete structured protocol.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <Textarea
            placeholder="Describe the protocol you want to create. For example:

'Pediatric asthma management protocol. Include severity classification using PRAM score with mild (0-4), moderate (5-7), and severe (8-12) categories. Include weight-based salbutamol dosing (0.15 mg/kg), ipratropium for moderate/severe, IV magnesium for severe cases, and oxygen therapy. Include disposition criteria and red flags.'

Or paste a clinical guideline directly."
            className="min-h-[200px] text-sm resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={generating}
          />

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleGenerate}
            disabled={generating || description.trim().length < 20}
            className="w-full"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Protocol...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Protocol
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {draft && (
        <Card className="border-2 border-green-200 bg-green-50/30">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <CardTitle className="font-headline text-lg text-green-900">{draft.name}</CardTitle>
                  <div className="flex gap-2 flex-wrap mt-1">
                    <Badge variant="outline" className="text-xs">{draft.system}</Badge>
                    <Badge variant="outline" className="text-xs">{draft.questions?.length ?? 0} questions</Badge>
                    <Badge variant="outline" className="text-xs">{draft.severityRules?.length ?? 0} severity rules</Badge>
                    <Badge variant="outline" className="text-xs">{draft.management?.length ?? 0} management sections</Badge>
                    <Badge variant="outline" className="text-xs">{draft.drugDoses?.length ?? 0} drug doses</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{draft.description}</p>

            {draft.severityRules && draft.severityRules.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Severity Rules</p>
                <div className="space-y-1">
                  {draft.severityRules.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <code className="bg-muted px-1.5 py-0.5 rounded text-[11px] font-mono max-w-[300px] truncate">
                        {r.condition}
                      </code>
                      <span className="text-muted-foreground">→</span>
                      <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold capitalize ${SEVERITY_COLOR[r.level] || "bg-gray-100 text-gray-700"}`}>
                        {r.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {draft.drugDoses && draft.drugDoses.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Drug Doses</p>
                <div className="space-y-1">
                  {draft.drugDoses.map((d, i) => (
                    <div key={i} className="text-xs">
                      <span className="font-semibold">{d.drugName}:</span>{" "}
                      <span className="font-mono text-primary">{d.dose}</span>
                      {d.maxDose && <span className="text-muted-foreground"> (max {d.maxDose})</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {draft.redFlags && draft.redFlags.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Red Flags</p>
                <div className="flex flex-wrap gap-1">
                  {draft.redFlags.map((f, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] text-destructive border-destructive/30">{f}</Badge>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowJson(!showJson)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showJson ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {showJson ? "Hide" : "Show"} raw JSON
            </button>

            {showJson && (
              <pre className="p-3 bg-muted rounded-md overflow-x-auto text-[11px] font-mono max-h-60 overflow-y-auto">
                {JSON.stringify(draft, null, 2)}
              </pre>
            )}

            <div className="flex gap-3 flex-wrap pt-2 border-t border-green-200">
              <Button onClick={handleOpenInBuilder} variant="outline" className="border-primary/30 hover:border-primary">
                <ArrowRight className="mr-2 h-4 w-4" />
                Open in Builder to Edit
              </Button>
              <Button onClick={handleSaveDirectly} disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {saving ? "Saving..." : "Save Protocol Directly"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
