"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { getDiffDiagAction } from "@/app/actions";
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
    Info
} from "lucide-react";
import { ResultCard } from "@/components/result-card";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
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
  );
}

export default function DiffDiagPage() {
  const initialState = { message: null, error: null, data: null };
  const [state, dispatch] = useActionState(getDiffDiagAction, initialState);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline text-primary">AI Differential Diagnosis</h1>
        <p className="text-muted-foreground mt-2">Enter patient details for an AI-generated clinical starting point.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Patient Presentation</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={dispatch} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Age / Development</label>
                <Input name="age" placeholder="e.g., 4 months, 12 years" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Main Symptoms & History</label>
                <Textarea 
                  name="symptoms" 
                  placeholder="Describe symptoms, duration, and onset..." 
                  className="min-h-[120px]"
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Medical History (Optional)</label>
                <Input name="history" placeholder="Prior surgeries, allergies, etc." />
              </div>
              <SubmitButton />
              
              <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800 py-2">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  For support only. Does not replace physician judgment.
                </AlertDescription>
              </Alert>
            </form>
          </CardContent>
        </Card>

        {/* Results Area */}
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
              <ResultCard title="Differential Diagnosis" icon={Stethoscope}>
                <div className="space-y-4">
                  {state.data.differentials.map((diff, i) => (
                    <div key={i} className="p-3 bg-secondary/30 rounded-lg border">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-base">{diff.diagnosis}</h4>
                        <Badge variant={diff.priority === 'high' ? 'destructive' : 'secondary'}>
                          {diff.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{diff.rationale}</p>
                    </div>
                  ))}
                </div>
              </ResultCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResultCard title="Initial Workup" icon={TestTube2}>
                  <ul className="space-y-3">
                    {state.data.workup.map((item, i) => (
                      <li key={i} className="text-sm">
                        <span className="font-bold block">{item.test}</span>
                        <span className="text-muted-foreground">{item.rationale}</span>
                      </li>
                    ))}
                  </ul>
                </ResultCard>

                <ResultCard title="Immediate Management" icon={Activity}>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    {state.data.management.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </ResultCard>
              </div>

              <ResultCard title="Clinical Red Flags" icon={AlertTriangle} className="border-destructive/30">
                <ul className="list-disc list-inside space-y-1 text-sm text-destructive font-medium">
                  {state.data.redFlags.map((flag, i) => (
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
