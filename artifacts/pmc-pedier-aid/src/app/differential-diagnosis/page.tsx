"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Stethoscope,
  TestTube2,
  Activity,
  AlertTriangle,
  Loader2,
  Info,
} from "lucide-react";
import { ResultCard } from "@/components/result-card";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "").replace(/\/[^/]*$/, "") + "/api";

export default function DiffDiagPage() {
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<{ message: string | null; error: any; data: any }>({
    message: null,
    error: null,
    data: null,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const age = formData.get("age") as string;
    const symptoms = formData.get("symptoms") as string;
    const history = formData.get("history") as string;

    if (!age || !symptoms) {
      setState({ message: "Please fill in all required fields.", error: { _form: ["Please fill in all required fields."] }, data: null });
      return;
    }

    setPending(true);
    try {
      const res = await fetch(`${API_BASE}/ai/differential-diagnosis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age, symptoms, history }),
      });
      const json = await res.json();
      if (!res.ok) {
        setState({ message: json.message || "AI processing failed.", error: { _form: [json.message || "AI processing failed."] }, data: null });
      } else {
        setState({ message: "Differential diagnosis generated.", error: null, data: json });
      }
    } catch (err) {
      setState({ message: "Failed to connect to AI service.", error: { _form: ["Failed to connect to AI service."] }, data: null });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-headline text-foreground leading-tight">AI Differential Diagnosis</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter patient details for an AI-generated clinical starting point.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Patient Presentation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Age / Development</label>
                <Input name="age" placeholder="e.g., 4 months, 12 years" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Main Symptoms &amp; History</label>
                <Textarea
                  name="symptoms"
                  placeholder="Describe symptoms, duration, and onset..."
                  className="min-h-[120px]"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Medical History <span className="font-normal text-muted-foreground">(Optional)</span></label>
                <Input name="history" placeholder="Prior surgeries, allergies, etc." />
              </div>
              <Button type="submit" disabled={pending} className="w-full">
                {pending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Generate Differential
                  </>
                )}
              </Button>

              <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800 py-2">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  For support only. Does not replace physician judgment.
                </AlertDescription>
              </Alert>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {!state.data && !state.error && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
              <Brain className="h-12 w-12 mb-4 opacity-20" />
              <p>Results will appear here after you submit the symptoms.</p>
            </div>
          )}

          {state.error?._form && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error._form[0]}</AlertDescription>
            </Alert>
          )}

          {state.data && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <ResultCard title="Differential Diagnosis" icon={Stethoscope} variant="management">
                <div className="space-y-4">
                  {state.data.differentials.map((diff: any, i: number) => (
                    <div key={i} className="p-3 bg-secondary/30 rounded-lg border">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-sm text-foreground">{diff.diagnosis}</h4>
                        <Badge variant={diff.priority === "high" ? "destructive" : "secondary"}>
                          {diff.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{diff.rationale}</p>
                    </div>
                  ))}
                </div>
              </ResultCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResultCard title="Initial Workup" icon={TestTube2} variant="info">
                  <ul className="space-y-3">
                    {state.data.workup.map((item: any, i: number) => (
                      <li key={i} className="text-sm">
                        <span className="font-bold block">{item.test}</span>
                        <span className="text-muted-foreground">{item.rationale}</span>
                      </li>
                    ))}
                  </ul>
                </ResultCard>

                <ResultCard title="Immediate Management" icon={Activity} variant="management">
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    {state.data.management.map((item: any, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </ResultCard>
              </div>

              <ResultCard title="Clinical Red Flags" icon={AlertTriangle} variant="danger">
                <ul className="list-disc list-inside space-y-1 text-sm text-destructive font-medium">
                  {state.data.redFlags.map((flag: any, i: number) => (
                    <li key={i}>{flag}</li>
                  ))}
                </ul>
              </ResultCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
