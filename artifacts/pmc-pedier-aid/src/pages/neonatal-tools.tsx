import { Link } from "wouter";
import { Pill, Calculator, ChevronRight, Baby, Clock, Activity, Droplet, Scale, Ruler, Syringe, HeartPulse } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Tool {
  label: string;
  desc: string;
  href: string;
  icon: any;
}

const NEONATAL_TOOLS: Tool[] = [
  { label: "Gestational Age", desc: "Estimate GA / due date", href: "/calculators/gestational-age", icon: Clock },
  { label: "Ballard Score", desc: "Maturity assessment", href: "/calculators/ballard-score", icon: Baby },
  { label: "EOS Risk (Kaiser)", desc: "Early-onset sepsis calculator", href: "/calculators/eos-risk", icon: Activity },
  { label: "Hyperbilirubinemia", desc: "AAP phototherapy/exchange thresholds", href: "/neonatology/hyperbilirubinemia", icon: Droplet },
  { label: "Fenton Growth Charts", desc: "Preterm growth percentiles", href: "/calculators/fenton-charts", icon: Scale },
  { label: "Weight Loss", desc: "Neonatal % weight change", href: "/calculators/weight-loss", icon: Scale },
  { label: "TPN Calculator", desc: "Parenteral nutrition", href: "/calculators/tpn-calculator", icon: Droplet },
  { label: "NRP Timer", desc: "Resuscitation event timer", href: "/calculators/nrp-timer", icon: HeartPulse },
  { label: "Apgar Score", desc: "1 & 5-minute scoring", href: "/calculators/apgar", icon: Activity },
  { label: "ETT Depth", desc: "Tube depth by weight/age", href: "/calculators/ett-depth", icon: Ruler },
  { label: "UAC / UVC Length", desc: "Umbilical line insertion depth", href: "/calculators/uac-uvc-length", icon: Ruler },
];

export default function NeonatalToolsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 px-2 sm:px-4">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-200"><Pill className="h-6 w-6" /></div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Neonatal Tools</h1>
          <p className="text-muted-foreground text-sm font-medium">NeoDose drug calculator and the neonatal calculator suite.</p>
        </div>
      </div>

      {/* NEODOSE — live */}
      <Link href="/nicu/drugs">
        <Card className="rounded-[28px] border-2 border-teal-400 bg-teal-600 cursor-pointer hover:bg-teal-700 transition-colors">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="p-2.5 rounded-2xl bg-white/20 text-white shrink-0"><Syringe className="h-5 w-5" /></div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black tracking-tight text-white">NeoDose — IV Drug Calculator</h2>
                <span className="text-[10px] font-black tracking-widest uppercase bg-white/20 text-white px-2 py-1 rounded-lg">NEOFAX-style</span>
              </div>
              <p className="text-sm font-bold text-teal-100 leading-relaxed">
                Weight + PMA + PNA → dose, interval, and volume for {"{"}30+ neonatal drugs. Tap to open.
              </p>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* EXISTING TOOLS */}
      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-2">Neonatal Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {NEONATAL_TOOLS.map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.href} href={t.href} className="group flex items-center justify-between p-4 rounded-2xl border bg-card hover:border-teal-300 hover:bg-teal-50/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-600"><Icon className="h-5 w-5" /></div>
                  <div>
                    <span className="font-bold text-sm block">{t.label}</span>
                    <span className="text-[11px] text-muted-foreground font-medium">{t.desc}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-teal-500 transition-all" />
              </Link>
            );
          })}
          <Link href="/calculators" className="group flex items-center justify-between p-4 rounded-2xl border border-dashed bg-card hover:border-teal-300 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-muted text-muted-foreground"><Calculator className="h-5 w-5" /></div>
              <span className="font-bold text-sm">All calculators</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-teal-500 transition-all" />
          </Link>
        </div>
      </section>
    </div>
  );
}
