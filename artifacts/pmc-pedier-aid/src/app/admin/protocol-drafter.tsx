"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bot, AlertCircle, Loader2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "").replace(/\/[^/]*$/, "") + "/api";

export function ProtocolDrafter() {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<{ message: string | null; error: any; data: any }>({
    message: null,
    error: null,
    data: null,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const guidelineText = formData.get("guidelineText") as string;

    if (!guidelineText || guidelineText.trim().length < 100) {
      setState({
        message: "Invalid input. Please provide sufficient guideline text.",
        error: { guidelineText: ["Guideline text must be at least 100 characters long."] },
        data: null,
      });
      return;
    }

    setPending(true);
    try {
      const res = await fetch(`${API_BASE}/ai/draft-protocol`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guidelineText }),
      });
      const json = await res.json();
      if (!res.ok) {
        setState({ message: json.message || "AI processing failed.", error: { _form: [json.message || "AI processing failed."] }, data: null });
        toast({ variant: "destructive", title: "Drafting Failed", description: json.message || "AI processing failed." });
      } else {
        setState({ message: "Protocol drafted successfully.", error: null, data: json });
      }
    } catch (err) {
      setState({ message: "Failed to connect to AI service.", error: { _form: ["Failed to connect to AI service."] }, data: null });
      toast({ variant: "destructive", title: "Drafting Failed", description: "Failed to connect to AI service." });
    } finally {
      setPending(false);
    }
  };

  const handleCopy = () => {
    if (state.data) {
      navigator.clipboard.writeText(JSON.stringify(state.data, null, 2));
      toast({ title: "Copied!", description: "Protocol JSON copied to clipboard." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Textarea
          name="guidelineText"
          placeholder="Paste your medical guideline text here. For best results, provide comprehensive text..."
          className="min-h-[200px] text-sm"
          required
        />
        {state.error?.guidelineText && (
          <p className="text-sm text-destructive">{state.error.guidelineText[0]}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={pending} className="w-full md:w-auto">
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Drafting...
            </>
          ) : (
            <>
              <Bot className="mr-2 h-4 w-4" />
              Draft Protocol
            </>
          )}
        </Button>
      </div>

      {state.error?._form && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error._form[0]}</AlertDescription>
        </Alert>
      )}

      {state.data && (
        <Card className="mt-6 bg-secondary/50">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="font-headline">AI-Generated Protocol Draft</CardTitle>
              <Button variant="ghost" size="icon" type="button" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy JSON</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-background rounded-md overflow-x-auto text-sm">
              <code>{JSON.stringify(state.data, null, 2)}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </form>
  );
}
