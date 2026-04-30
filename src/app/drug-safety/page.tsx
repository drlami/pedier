"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { checkDrugSafetyAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
    Pill, 
    AlertTriangle, 
    Baby, 
    ShieldAlert, 
    Loader2,
    Info,
    ArrowRightLeft,
    Stethoscope
} from "lucide-react";
import { ResultCard } from "@/components/result-card";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing Drug Safety...
        </>
      ) : (
        <>
          <ShieldAlert className="mr-2 h-4 w-4" />
          Check Safety
        </>
      )}
    </Button>
  );
}

export default function DrugSafetyPage() {
  const initialState = { message: null, error: null, data: null };
  const [state, dispatch] = useActionState(checkDrugSafetyAction, initialState);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline text-primary">Drug Safety Checker</h1>
        <p className="text-muted-foreground mt-2">Check for drug-drug interactions, breastfeeding safety, and renal adjustments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Medications to Analyze</CardTitle>
            <CardDescription>Enter one or more medication names.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={dispatch} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Medication List</label>
                <Input 
                  name="drugList" 
                  placeholder="e.g., Gentamicin, Vancomycin, Ibuprofen" 
                  required 
                />
              </div>
              <SubmitButton />
              
              <Alert className="bg-blue-50 border-blue-200 text-blue-800 py-2">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-[10px] leading-tight">
                  For clinical support only. Always verify with a pharmacist and institutional formulary.
                </AlertDescription>
              </Alert>
            </form>
          </CardContent>
        </Card>

        {/* Results Area */}
        <div className="lg:col-span-2 space-y-6">
          {!state.data && !state.error && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
              <Pill className="h-12 w-12 mb-4 opacity-20" />
              <p>Results will appear here after you enter the medications.</p>
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
              {/* Interactions */}
              <ResultCard title="Drug-Drug Interactions" icon={ArrowRightLeft}>
                {state.data.interactions.length > 0 ? (
                  <div className="space-y-4">
                    {state.data.interactions.map((interaction, i) => (
                      <div key={i} className="p-3 bg-secondary/30 rounded-lg border">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-sm text-primary">
                            {interaction.drugs.join(' + ')}
                          </h4>
                          <Badge variant={
                            interaction.severity === 'major' ? 'destructive' : 
                            interaction.severity === 'moderate' ? 'default' : 'secondary'
                          }>
                            {interaction.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{interaction.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No significant interactions found among the listed medications.</p>
                )}
              </ResultCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Breastfeeding */}
                <ResultCard title="Breastfeeding Safety" icon={Baby}>
                  <div className="space-y-3">
                    {state.data.breastfeedingSafety.map((item, i) => (
                      <div key={i} className="text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold">{item.drugName}</span>
                          <Badge variant="outline" className="text-[10px]">{item.safetyCategory}</Badge>
                        </div>
                        <p className="text-muted-foreground">{item.notes}</p>
                      </div>
                    ))}
                  </div>
                </ResultCard>

                {/* Renal Adjustment */}
                <ResultCard title="Renal Adjustments" icon={Stethoscope}>
                  <div className="space-y-3">
                    {state.data.renalAdjustment.map((item, i) => (
                      <div key={i} className="text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold">{item.drugName}</span>
                          {item.adjustmentRequired && (
                            <Badge variant="destructive" className="text-[9px] h-4">Adjustment Needed</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{item.recommendations}</p>
                      </div>
                    ))}
                  </div>
                </ResultCard>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
