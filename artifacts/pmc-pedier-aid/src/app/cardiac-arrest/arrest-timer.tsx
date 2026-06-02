"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Play, Pause, RotateCcw, Timer, Zap, Syringe, AlertCircle, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function ArrestTimer() {
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [cprSeconds, setCprSeconds] = useState(0);
  const [epiSeconds, setEpiSeconds] = useState(0);
  const [hasEpiStarted, setHasEpiStarted] = useState(false);

  const audioContext = useRef<AudioContext | null>(null);
  const nextMetronomeTime = useRef(0);

  const CPR_CYCLE = 120; // 2 minutes
  const EPI_INTERVAL = 240; // 4 minutes

  // Initialize Audio Context on user interaction
  const initAudio = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  // Beep sound helper
  const playSound = (freq: number, duration: number, volume = 0.1) => {
    if (!audioContext.current || isMuted) return;
    const osc = audioContext.current.createOscillator();
    const gain = audioContext.current.createGain();
    osc.connect(gain);
    gain.connect(audioContext.current.destination);
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, audioContext.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration);
    osc.start();
    osc.stop(audioContext.current.currentTime + duration);
  };

  // Main Timer Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTotalSeconds((s) => s + 1);
        setCprSeconds((s) => s + 1);
        if (hasEpiStarted) {
          setEpiSeconds((s) => s + 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, hasEpiStarted]);

  // Metronome Loop (110 BPM)
  useEffect(() => {
    let metronomeInterval: NodeJS.Timeout;

    if (isActive && !isMuted) {
      const intervalMs = (60 / 110) * 1000;
      metronomeInterval = setInterval(() => {
        playSound(880, 0.05, 0.05); // High-pitched click
      }, intervalMs);
    }

    return () => clearInterval(metronomeInterval);
  }, [isActive, isMuted]);

  // Alert Sounds logic
  useEffect(() => {
    // CPR Alerts
    if (cprSeconds === CPR_CYCLE - 10) {
      playSound(440, 0.5, 0.2); // 10s warning
    } else if (cprSeconds === CPR_CYCLE) {
      playSound(660, 0.8, 0.3); // DUE NOW
    }

    // Adrenaline Alerts
    if (hasEpiStarted) {
      if (epiSeconds === EPI_INTERVAL - 30) {
        playSound(440, 0.5, 0.2); // 30s warning
      } else if (epiSeconds === EPI_INTERVAL) {
        playSound(660, 0.8, 0.3); // DUE NOW
      }
    }
  }, [cprSeconds, epiSeconds, hasEpiStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatCountdown = (elapsed: number, limit: number) => {
    const remaining = Math.max(0, limit - elapsed);
    return formatTime(remaining);
  };

  const startArrest = () => {
    initAudio();
    setIsActive(true);
  };

  const resetAll = () => {
    setIsActive(false);
    setTotalSeconds(0);
    setCprSeconds(0);
    setEpiSeconds(0);
    setHasEpiStarted(false);
  };

  const handleEpiDose = () => {
    initAudio();
    setEpiSeconds(0);
    setHasEpiStarted(true);
    playSound(1200, 0.2, 0.1);
  };

  const handleCprReset = () => {
    initAudio();
    setCprSeconds(0);
    playSound(1200, 0.2, 0.1);
  };

  const cprProgress = Math.min((cprSeconds / CPR_CYCLE) * 100, 100);
  const epiProgress = Math.min((epiSeconds / EPI_INTERVAL) * 100, 100);

  const isCprDue = cprSeconds >= CPR_CYCLE;
  const isEpiDue = hasEpiStarted && epiSeconds >= EPI_INTERVAL;

  return (
    <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Arrest Time</span>
          </div>
          <div className="flex items-center gap-4">
             <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-slate-500 hover:text-white"
                onClick={() => setIsMuted(!isMuted)}
             >
               {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
             </Button>
             <span className="text-3xl font-mono font-bold tabular-nums">{formatTime(totalSeconds)}</span>
          </div>
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
                "w-full h-10 text-[11px] uppercase font-black tracking-wider",
                isCprDue 
                  ? "bg-red-600 border-red-600 text-white hover:bg-red-700 shadow-lg" 
                  : "border-blue-900/50 hover:bg-blue-900/20 text-blue-400"
              )}
              onClick={handleCprReset}
            >
              {isCprDue ? "Cycle Complete" : "Reset Cycle"}
            </Button>
          </div>

          {/* Epinephrine Timer */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1">
                <Syringe className="h-3 w-3" /> Adrenaline (3-5m)
              </span>
              <span className={cn(
                "text-sm font-mono font-bold tabular-nums",
                isEpiDue ? "text-red-500 animate-pulse" : !hasEpiStarted ? "text-slate-600" : "text-white"
              )}>
                {!hasEpiStarted ? "--:--" : isEpiDue ? "DUE NOW" : formatCountdown(epiSeconds, EPI_INTERVAL)}
              </span>
            </div>
            <Progress 
              value={hasEpiStarted ? epiProgress : 0} 
              className="h-2 bg-slate-800" 
              indicatorClassName={isEpiDue ? "bg-red-500" : "bg-emerald-500"}
            />
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-full h-10 text-[11px] uppercase font-black tracking-wider",
                isEpiDue 
                  ? "bg-red-600 border-red-600 text-white hover:bg-red-700 shadow-lg" 
                  : "bg-emerald-600/10 border-emerald-600/30 text-emerald-400 hover:bg-emerald-600/20"
              )}
              onClick={handleEpiDose}
            >
              {!hasEpiStarted ? "First Dose Given" : isEpiDue ? "Dose Given" : "Repeat Dose Given"}
            </Button>
          </div>
        </div>

        {/* Global Alerts */}
        {(isCprDue || isEpiDue) && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-2 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-[11px] font-black uppercase text-red-500">
              {isCprDue && isEpiDue ? "Check Rhythm & Give Adrenaline" : isCprDue ? "Check Rhythm Now" : "Adrenaline Due Now"}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          {!isActive ? (
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black tracking-widest h-12"
              onClick={startArrest}
            >
              <Play className="mr-2 h-5 w-5 fill-current" /> {totalSeconds > 0 ? "RESUME ARREST" : "START ARREST"}
            </Button>
          ) : (
            <Button
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-black tracking-widest h-12"
              onClick={() => setIsActive(false)}
            >
              <Pause className="mr-2 h-5 w-5 fill-current" /> PAUSE
            </Button>
          )}
          <Button
            variant="ghost"
            className="px-4 text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={resetAll}
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
