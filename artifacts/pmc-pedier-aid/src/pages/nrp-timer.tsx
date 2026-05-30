import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Clock, Play, Pause, RotateCcw, Save, 
  ArrowLeft, Info, AlertTriangle, Baby, Activity, Heart, Wind
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface LogEntry {
  time: number;
  event: string;
}

export default function NrpTimerCalc() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addLog = useCallback((event: string) => {
    setLogs((prev) => [{ time, event }, ...prev]);
  }, [time]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setTime(0);
    setIsActive(false);
    setLogs([]);
  };

  const prompts = useMemo(() => {
    if (time === 60) return "1-Minute APGAR Score due.";
    if (time === 300) return "5-Minute APGAR Score due.";
    if (time === 600) return "10-Minute APGAR Score due.";
    return null;
  }, [time]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 pb-32">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">NRP Timer & Log</h1>
            <p className="text-muted-foreground text-sm font-medium">Interactive Resuscitation Support</p>
          </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetTimer} className="h-10 px-4 font-bold border-2">
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className={cn("border-4 shadow-2xl transition-all duration-500", isActive ? "border-rose-500 bg-rose-50/30" : "border-slate-200 bg-slate-50/50")}>
            <CardContent className="pt-12 pb-16 text-center">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">Elapsed Time</div>
                <div className="text-9xl font-black font-mono tracking-tighter text-slate-800 tabular-nums">
                    {formatTime(time)}
                </div>
                <div className="mt-12 flex justify-center gap-4">
                    <Button 
                        size="lg" 
                        onClick={toggleTimer}
                        className={cn("h-20 w-44 text-xl font-black rounded-3xl shadow-xl transition-all active:scale-95", isActive ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-600 hover:bg-emerald-700")}
                    >
                        {isActive ? <><Pause className="mr-3 h-6 w-6 fill-current" /> Pause</> : <><Play className="mr-3 h-6 w-6 fill-current" /> Start</>}
                    </Button>
                </div>

                {prompts && (
                    <div className="mt-8 p-4 bg-rose-600 text-white rounded-2xl animate-bounce font-bold shadow-lg">
                        ⚠️ {prompts}
                    </div>
                )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <EventButton label="Stimulate" onClick={() => addLog("Drying & Stimulation")} color="blue" />
            <EventButton label="Suction" onClick={() => addLog("Airway Suctioned")} color="slate" />
            <EventButton label="PPV Start" onClick={() => addLog("Started PPV")} color="orange" icon={<Wind className="h-4 w-4" />} />
            <EventButton label="Intubated" onClick={() => addLog("Intubated")} color="indigo" />
            <EventButton label="Chest Comp." onClick={() => addLog("Started Compressions")} color="rose" icon={<Heart className="h-4 w-4" />} />
            <EventButton label="Epi Dose" onClick={() => addLog("Epinephrine Given")} color="red" />
            <EventButton label="CPAP" onClick={() => addLog("CPAP Started")} color="sky" />
            <EventButton label="ROSC" onClick={() => addLog("ROSC Achieved")} color="emerald" icon={<Activity className="h-4 w-4" />} />
          </div>
        </div>

        <div className="space-y-6">
            <Card className="border-2 h-[600px] flex flex-col">
                <CardHeader className="bg-muted/20 border-b">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex justify-between items-center">
                        Event Log
                        <Badge variant="outline">{logs.length}</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-0">
                    {logs.length > 0 ? (
                        <div className="divide-y">
                            {logs.map((log, i) => (
                                <div key={i} className="p-4 flex gap-4 items-start hover:bg-muted/10 transition-colors">
                                    <span className="font-mono text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">{formatTime(log.time)}</span>
                                    <span className="text-sm font-semibold text-slate-700">{log.event}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                            <Save className="h-8 w-8 opacity-20 mb-4" />
                            <p className="text-xs font-medium">Events recorded during resuscitation will appear here.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

function EventButton({ label, onClick, color, icon }: { label: string, onClick: () => void, color: string, icon?: React.ReactNode }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    slate: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
    orange: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
    rose: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
    red: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    sky: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
  };

  return (
    <Button 
        variant="outline" 
        className={cn("h-16 flex flex-col gap-1 border-2 font-bold transition-all active:scale-95", colors[color])}
        onClick={onClick}
    >
        {icon}
        <span className="text-[10px] uppercase tracking-tighter">{label}</span>
    </Button>
  );
}
