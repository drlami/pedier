import { Link } from "wouter";
import { HeartPulse, Building2, ChevronRight, Stethoscope, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-foreground">
              PMC Pedi<span className="text-primary">ER</span> Aid
            </h1>
            <p className="text-sm sm:text-base font-bold text-muted-foreground/60 tracking-[0.3em] uppercase">
              Palestine Medical Complex
            </p>
            <p className="text-xs font-bold text-primary/40 tracking-widest uppercase pb-2">
              Coded and Prepared by Dr Lami Qurt
            </p>
          </div>
          <p className="text-muted-foreground text-lg font-medium max-w-lg mx-auto">
            Select your clinical unit to access specialized protocols, calculators, and tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* PEDIATRIC ER CARD */}
          <Link href="/er" className="group relative overflow-hidden rounded-[40px] border-2 border-red-100 bg-red-50/50 p-8 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-200/50 active:scale-[0.98]">
            <div className="relative z-10 flex flex-col h-full justify-between min-h-[220px]">
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-[24px] bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-200">
                  <HeartPulse className="h-9 w-9" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tight text-red-900">Pediatric ER</h2>
                  <p className="text-red-700/70 font-medium leading-relaxed">
                    Emergency protocols, resuscitation doses, and critical care calculators.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm mt-8 group-hover:gap-3 transition-all">
                Enter Emergency Unit <ChevronRight className="h-4 w-4" />
              </div>
            </div>
            
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 bg-red-100/50 rounded-full blur-3xl group-hover:bg-red-200/50 transition-colors" />
            <div className="absolute bottom-4 right-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Stethoscope className="w-32 h-32 text-red-900" />
            </div>
          </Link>

          {/* PEDIATRIC WARD CARD */}
          <Link href="/ward" className="group relative overflow-hidden rounded-[40px] border-2 border-blue-100 bg-blue-50/50 p-8 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-200/50 active:scale-[0.98]">
            <div className="relative z-10 flex flex-col h-full justify-between min-h-[220px]">
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-[24px] bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">
                  <Building2 className="h-9 w-9" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tight text-blue-900">Pediatric Ward</h2>
                  <p className="text-blue-700/70 font-medium leading-relaxed">
                    Maintenance fluids, admission guidelines, and daily clinical rounding tools.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mt-8 group-hover:gap-3 transition-all">
                Enter Ward Unit <ChevronRight className="h-4 w-4" />
              </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 bg-blue-100/50 rounded-full blur-3xl group-hover:bg-blue-200/50 transition-colors" />
            <div className="absolute bottom-4 right-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <ClipboardList className="w-32 h-32 text-blue-900" />
            </div>
          </Link>
        </div>

        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
            Professional Use Only • Clinical Decision Support
          </p>
        </div>
      </div>
    </div>
  );
}
