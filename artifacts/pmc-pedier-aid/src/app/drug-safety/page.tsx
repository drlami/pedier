"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  Stethoscope,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { ResultCard } from "@/components/result-card";
import { cn } from "@/lib/utils";
import { useOffline } from "@/hooks/use-offline";
import { WifiOff } from "lucide-react";

import { checkDrugSafetyOffline } from "@/lib/safety-engine";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "").replace(/\/[^/]*$/, "") + "/api";

export default function DrugSafetyPage() {
  const isOffline = useOffline();
  const [pending, setPending] = useState(false);
  const [aiPending, setAiPending] = useState(false);
  const [lastDrugList, setLastDrugList] = useState("");
  const [state, setState] = useState<{ message: string | null; error: any; data: any; source: 'offline' | 'ai' }>({
    message: null,
    error: null,
    data: null,
    source: 'offline'
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const drugList = formData.get("drugList") as string;
    setLastDrugList(drugList);

    if (!drugList || drugList.trim().length < 2) {
      setState({ message: "Invalid drug list.", error: { _form: ["Please enter at least one medication name."] }, data: null, source: 'offline' });
      return;
    }

    setPending(true);
    
    // Step 1: Run Local Offline Check First
    setTimeout(() => {
        try {
            const results = checkDrugSafetyOffline(drugList);
            setState({ 
                message: "Offline safety check completed.", 
                error: null, 
                data: results,
                source: 'offline'
            });
        } catch (err) {
            setState({ 
                message: "Error processing drug list.", 
                error: { _form: ["An error occurred while analyzing the medications."] }, 
                data: null,
                source: 'offline'
            });
        } finally {
            setPending(false);
        }
    }, 300);
  };

  const handleAiVerify = async () => {
    if (!lastDrugList) return;
    setAiPending(true);
    try {
      const res = await fetch(`${API_BASE}/ai/drug-safety`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drugList: lastDrugList }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.message || "AI service currently unavailable.");
      } else {
        setState({ 
            message: "Deep AI analysis completed.", 
            error: null, 
            data: json,
            source: 'ai'
        });
      }
    } catch (err) {
      alert("Failed to connect to AI service. Please check your internet connection.");
    } finally {
      setAiPending(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-100 border border-violet-200 shrink-0">
          <ShieldAlert className="h-5 w-5 text-violet-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-headline text-foreground leading-tight">Drug Safety Checker</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Check for drug-drug interactions, breastfeeding safety, and renal adjustments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Medications to Analyze</CardTitle>
            <CardDescription>Enter one or more medication names.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Medication List</label>
                <Input
                  name="drugList"
                  placeholder="e.g., Gentamicin, Vancomycin, Ibuprofen"
                  required
                />
              </div>
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

              <Alert className="bg-blue-50 border-blue-200 text-blue-800 py-2">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-[10px] leading-tight">
                  For clinical support only. Always verify with a pharmacist and institutional formulary.
                </AlertDescription>
              </Alert>
            </form>
          </CardContent>
        </Card>

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
              
              {/* UNKNOWN DRUGS WARNING - HIGHEST PRIORITY */}
              {state.data.unknownDrugs.length > 0 && (
                <Alert className="bg-orange-50 border-orange-200 border-2 shadow-sm">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div>
                    <AlertTitle className="text-orange-800 font-black uppercase text-xs tracking-widest mb-1">Medications Not Verified Locally</AlertTitle>
                    <AlertDescription className="space-y-3">
                        <p className="text-xs text-orange-900 font-medium leading-relaxed">
                            The following drugs were not found in our high-acuity offline database: 
                            <span className="font-bold ml-1">{state.data.unknownDrugs.join(", ")}</span>.
                        </p>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-[10px] font-bold border-orange-300 text-orange-800 hover:bg-orange-100"
                                onClick={() => window.open(`https://www.drugs.com/drug-interactions/${state.data.unknownDrugs[0]}.html`, '_blank')}
                            >
                                Verify on Drugs.com <ArrowRightLeft className="ml-1.5 h-3 w-3" />
                            </Button>
                        </div>
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              {/* SOURCE INDICATOR & AI FALLBACK */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30 p-4 rounded-xl border border-muted">
                <div className="flex items-center gap-2">
                    <Badge variant={state.source === 'offline' ? "outline" : "default"} className="font-black">
                        {state.source === 'offline' ? "OFFLINE MODE" : "AI ENHANCED"}
                    </Badge>
                    <p className="text-[10px] text-muted-foreground font-medium">
                        {state.source === 'offline' 
                            ? "Using local high-acuity database." 
                            : "Using deep AI clinical analysis."}
                    </p>
                </div>
                {state.source === 'offline' && (
                  <div className="flex flex-col items-end gap-2">
                    <Button 
                        size="sm" 
                        variant="secondary" 
                        className="h-8 text-xs font-bold shadow-sm"
                        onClick={handleAiVerify}
                        disabled={aiPending || isOffline}
                    >
                        {aiPending ? (
                            <><Loader2 className="mr-2 h-3 w-3 animate-spin" /> Analyzing...</>
                        ) : (
                            <><Activity className="mr-2 h-3 w-3" /> Deep AI Analysis</>
                        )}
                    </Button>
                    {isOffline && (
                      <span className="text-[9px] font-bold text-blue-600 flex items-center gap-1 uppercase tracking-tight">
                        <WifiOff className="h-2.5 w-2.5" /> Needs Internet
                      </span>
                    )}
                  </div>
                )}
              </div>

              <ResultCard title="Drug-Drug Interactions" icon={ArrowRightLeft} variant="danger">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2 p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-tight">Database: 100+ High-Acuity ER Medications</span>
                    </div>
                    {state.data.interactions.length > 0 ? (
                    <div className="space-y-4">
                        {state.data.interactions.map((interaction: any, i: number) => (
                        <div key={i} className="p-3 bg-secondary/30 rounded-lg border">
                            <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-sm text-primary">
                                {interaction.drugs.join(" + ")}
                            </h4>
                            <Badge
                                variant={
                                interaction.severity === "major"
                                    ? "destructive"
                                    : interaction.severity === "moderate"
                                    ? "default"
                                    : "secondary"
                                }
                            >
                                {interaction.severity}
                            </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{interaction.description}</p>
                        </div>
                        ))}
                    </div>
                    ) : (
                    <p className="text-sm text-muted-foreground italic">
                        No significant red-flag interactions found among verified medications.
                    </p>
                    )}
                </div>
              </ResultCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResultCard title="Breastfeeding Safety" icon={Baby} variant="info">
                  <div className="space-y-3">
                    {state.data.breastfeedingSafety.map((item: any, i: number) => (
                      <div key={i} className={cn("text-xs p-2 rounded-lg", item.isVerified ? "bg-background" : "bg-orange-50 border border-orange-100")}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold">{item.drugName}</span>
                          <Badge variant={item.isVerified ? "outline" : "destructive"} className="text-[10px]">
                            {item.safetyCategory}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{item.notes}</p>
                      </div>
                    ))}
                  </div>
                </ResultCard>

                <ResultCard title="Renal Adjustments" icon={Stethoscope} variant="drug">
                  <div className="space-y-3">
                    {state.data.renalAdjustment.map((item: any, i: number) => (
                      <div key={i} className={cn("text-xs p-2 rounded-lg", item.isVerified ? "bg-background" : "bg-orange-50 border border-orange-100")}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold">{item.drugName}</span>
                          {item.adjustmentRequired && (
                            <Badge variant="destructive" className="text-[9px] h-4">
                              Adjustment Needed
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{item.recommendations}</p>
                      </div>
                    ))}
                  </div>
                </ResultCard>
              </div>

              {/* PERMANENT MEDICAL DISCLAIMER */}
              <div className="p-4 rounded-xl bg-muted/30 border border-muted text-[10px] text-muted-foreground leading-relaxed italic">
                  <strong>CRITICAL WARNING:</strong> This offline database only covers major, life-threatening pediatric ER interactions. The absence of a warning does NOT imply safety. This tool must NOT be the sole source of clinical decisions. Always verify with institutional formularies and pharmacists.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
