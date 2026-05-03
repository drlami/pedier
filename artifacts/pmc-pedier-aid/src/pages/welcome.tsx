import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  BookOpen,
  Cross,
} from "lucide-react";
import { StethoscopeIcon } from "@/components/icons";

export default function WelcomePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  if (!user) {
    setLocation("/login");
    return null;
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "hsl(210,28%,95%)" }}
    >
      {/* ── Top bar ──────────────────────────────────────────── */}
      <div
        className="h-14 shrink-0 flex items-center px-6 shadow-sm"
        style={{ background: "hsl(212,72%,22%)" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white/15">
            <StethoscopeIcon className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight text-white">
              PMC PediER Aid
            </span>
            <span className="text-[10px] text-white/60 font-normal tracking-widest uppercase hidden sm:block">
              Pediatric Emergency Clinical Decision Support
            </span>
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-6 py-8">
        <div className="w-full max-w-xl">

          {/* Booklet card */}
          <div
            className="rounded-2xl overflow-hidden shadow-xl border border-slate-200"
            style={{ background: "hsl(40,30%,98%)" }}
          >

            {/* ── Cover header ─────────────────────────────── */}
            <div
              className="relative px-8 pt-9 pb-8 text-center"
              style={{ background: "hsl(212,72%,22%)" }}
            >
              {/* Medical cross watermark */}
              <Cross
                className="absolute right-6 top-5 opacity-10 text-white"
                style={{ width: 64, height: 64 }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/25 flex items-center justify-center">
                    <StethoscopeIcon className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  PMC PediER Aid
                </h1>
                <p className="mt-1 text-white/65 text-xs sm:text-sm tracking-widest uppercase font-medium">
                  Pediatric Emergency Clinical Decision Support
                </p>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-white/20" />
                  <span className="text-white/40 text-[10px] tracking-widest uppercase">
                    Reference Handbook
                  </span>
                  <div className="flex-1 h-px bg-white/20" />
                </div>

                {/* Author */}
                <div>
                  <p className="text-white/50 text-[10px] tracking-widest uppercase mb-0.5">
                    Designed &amp; Curated by
                  </p>
                  <p className="text-white font-bold text-lg tracking-wide">
                    Dr. Lami Qurt
                  </p>
                  <p className="text-white/50 text-xs mt-0.5">
                    Pediatric Emergency Medicine
                  </p>
                </div>
              </div>
            </div>

            {/* ── Thin accent bar ───────────────────────────── */}
            <div className="h-1.5 bg-gradient-to-r from-amber-400 via-red-400 to-amber-400" />

            {/* ── About section ─────────────────────────────── */}
            <div className="px-6 sm:px-8 py-5 border-b border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 shrink-0" style={{ color: "hsl(212,72%,30%)" }} />
                <h2
                  className="text-[11px] font-bold uppercase tracking-widest"
                  style={{ color: "hsl(212,72%,30%)" }}
                >
                  About This Application
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                This application is designed by <strong className="text-slate-800">Dr. Lami Qurt</strong> to
                provide educational support and assist healthcare professionals in the recognition and initial
                management of pediatric emergencies, including suspected metabolic disorders.
              </p>
            </div>

            {/* ── Medical Disclaimer ────────────────────────── */}
            <div className="px-6 sm:px-8 py-5 border-b border-slate-200">
              <div className="rounded-xl overflow-hidden border-2 border-amber-300/80">

                {/* Disclaimer heading bar */}
                <div
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ background: "hsl(38,95%,44%)" }}
                >
                  <AlertTriangle className="h-5 w-5 text-white shrink-0" />
                  <span className="text-white font-bold tracking-wide text-sm uppercase">
                    Medical Disclaimer
                  </span>
                </div>

                {/* Disclaimer body */}
                <div
                  className="px-5 py-5 space-y-3.5"
                  style={{ background: "hsl(45,90%,97%)" }}
                >
                  <p className="text-sm text-amber-900 leading-relaxed">
                    This application is <strong>NOT intended to replace clinical judgment</strong> or senior
                    consultation. Clinical decisions must always be made based on the patient's condition
                    and available resources.
                  </p>

                  <hr className="border-amber-200" />

                  <p className="text-sm text-amber-900 leading-relaxed">
                    The information provided is based on established medical references and emergency
                    guidelines; however, <strong>variations in practice may exist</strong>.
                  </p>

                  {/* Fine print */}
                  <div className="rounded-lg bg-amber-100/70 border border-amber-200 px-4 py-3 flex items-start gap-2.5">
                    <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 leading-relaxed">
                      This tool is intended for use by qualified healthcare professionals only.
                      Always involve senior clinicians and follow your institution's local protocols.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Acknowledgement & CTA ─────────────────────── */}
            <div className="px-6 sm:px-8 py-6">
              <div className="flex items-start gap-3 mb-5">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 leading-relaxed">
                  By continuing, you confirm that you are an <strong className="text-slate-700">authorised
                  healthcare professional</strong> and that you have read and understood the above disclaimer.
                  Final clinical judgment remains with the treating physician.
                </p>
              </div>

              <Button
                size="lg"
                className="w-full text-sm font-semibold tracking-wide gap-2"
                style={{ background: "hsl(212,72%,22%)" }}
                onClick={() => setLocation("/")}
              >
                I Acknowledge — Enter Application
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

          </div>

          {/* Tagline */}
          <p className="text-center text-[11px] text-slate-400 mt-4 tracking-wide">
            PMC PediER Aid · Authorised Personnel Only · Clinical Support Tool
          </p>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-amber-200 bg-amber-50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-1 px-4 py-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <p className="text-[11px] text-amber-800 font-medium">
              Clinical decision support only — final judgment remains with the treating physician.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-amber-700/70 tracking-wide whitespace-nowrap">
            Coded by Dr Lami Qurt
          </span>
        </div>
      </div>
    </div>
  );
}
