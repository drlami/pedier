"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Timer, Zap, Syringe, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function ArrestTimer() {
  const [isActive, setIsActive] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [cprSeconds, setCprSeconds] = useState(0);
  const [epiSeconds, setEpiSeconds] = useState(0);

  const CPR_CYCLE = 120; // 2 minutes
  const EPI_INTERVAL = 240; // 4 minutes (mid-range of 3-5)

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTotalSeconds((s) => s + 1);
        setCprSeconds((s) => s + 1);
        setEpiSeconds((s) => s + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatCountdown = (elapsed: number, limit: number) => {
    const remaining = Math.max(0, limit - elapsed);
    return formatTime(remaining);
  };

  const resetAll = () => {
    setIsActive(false);
    setTotalSeconds(0);
    setCprSeconds(0);
    setEpiSeconds(0);
  };

  const resetCpr = () => setCprSeconds(0);
  const resetEpi = () => setEpiSeconds(0);

  const cprProgress = Math.min((cprSeconds / CPR_CYCLE) * 100, 100);
  const epiProgress = Math.min((epiSeconds / EPI_INTERVAL) * 100, 100);

  const isCprDue = cprSeconds >= CPR_CYCLE;
  const isEpiDue = epiSeconds >= EPI_INTERVAL;

  return (
    <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Arrest Time</span>
          </div>
          <span className="text-3xl font-mono font-bold tabular-nums">{formatTime(totalSeconds)}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Rhythm Check / CPR Cycle */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 flex items-center gap-1">
                <Zap className="h-3 w-3" /> Next Rhythm Check
              </span>
              <span className={cn(
                "text-sm font-mono font-bold tabular-nums",
                isCprDue ? "text-red-500 animate-pulse" : "text-white"
              )}>
                {isCprDue ? "DUE NOW" : formatCountdown(cprSeconds, CPR_CYCLE)}
              </span>
            </div>
            <Progress 
              value={cprProgress} 
              className="h-2 bg-slate-800" 
              indicatorClassName={isCprDue ? "bg-red-500" : "bg-blue-500"}
            />
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-full h-8 text-[10px] uppercase font-bold tracking-wider",
                isCprDue 
                  ? "bg-red-600 border-red-600 text-white hover:bg-red-700" 
                  : "border-blue-900/50 hover:bg-blue-900/20 text-blue-400"
              )}
              onClick={resetCpr}
            >
              {isCprDue ? "Cycle Complete" : "Reset Cycle"}
            </Button>
          </div>

          {/* Epinephrine Timer */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1">
                <Syringe className="h-3 w-3" /> Next Dose (3-5m)
              </span>
              <span className={cn(
                "text-sm font-mono font-bold tabular-nums",
                isEpiDue ? "text-red-500 animate-pulse" : "text-white"
              )}>
                {isEpiDue ? "DUE NOW" : formatCountdown(epiSeconds, EPI_INTERVAL)}
              </span>
            </div>
            <Progress 
              value={epiProgress} 
              className="h-2 bg-slate-800" 
              indicatorClassName={isEpiDue ? "bg-red-500" : "bg-emerald-500"}
            />
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-full h-8 text-[10px] uppercase font-bold tracking-wider",
                isEpiDue 
                  ? "bg-red-600 border-red-600 text-white hover:bg-red-700" 
                  : "border-emerald-900/50 hover:bg-emerald-900/20 text-emerald-400"
              )}
              onClick={resetEpi}
            >
              {isEpiDue ? "Dose Given" : "Reset Timer"}
            </Button>
          </div>
        </div>

        {/* Global Alerts */}
        {(isCprDue || isEpiDue) && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-2 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-[11px] font-black uppercase text-red-500">
              {isCprDue && isEpiDue ? "Check Rhythm & Give Epinephrine" : isCprDue ? "Check Rhythm Now" : "Epinephrine Due"}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          {!isActive ? (
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              onClick={() => setIsActive(true)}
            >
              <Play className="mr-2 h-4 w-4 fill-current" /> {totalSeconds > 0 ? "RESUME ARREST" : "START ARREST"}
            </Button>
          ) : (
            <Button
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold"
              onClick={() => setIsActive(false)}
            >
              <Pause className="mr-2 h-4 w-4 fill-current" /> PAUSE
            </Button>
          )}
          <Button
            variant="ghost"
            className="px-3 text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={resetAll}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
