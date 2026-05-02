"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { draftProtocolAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bot, AlertCircle, Loader2, Copy } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
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
  );
}

export function ProtocolDrafter() {
  const initialState = { message: null, error: null, data: null };
  const [state, dispatch] = useActionState(draftProtocolAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.error) {
      toast({
        variant: "destructive",
        title: "Drafting Failed",
        description: state.message,
      });
    }
  }, [state, toast]);

  const handleCopy = () => {
    if (state.data) {
      navigator.clipboard.writeText(JSON.stringify(state.data, null, 2));
      toast({
        title: "Copied!",
        description: "Protocol JSON copied to clipboard.",
      });
    }
  };

  return (
    <form action={dispatch} className="space-y-6">
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
        <SubmitButton />
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
                <Button variant="ghost" size="icon" onClick={handleCopy}>
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
