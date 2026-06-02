import { useState, useMemo } from "react";
import { useSearch, useLocation, Link } from "wouter";
import { Building2, ClipboardList, Info, ArrowRight, FlaskConical, LayoutGrid, BookOpen, ChevronRight, X, Search, Activity, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAllProtocols } from "@/contexts/protocols-context";
import { cn } from "@/lib/utils";

const WARD_SYSTEMS = [
  "Respiratory System",
  "Cardiovascular System",
  "Gastrointestinal & Hepatology",
  "Neurological System",
  "Renal & Urinary System",
  "Hematology & Oncology",
  "Endocrinology",
  "Metabolic Diseases",
  "Infectious Diseases",
  "Immunology & Rheumatology",
  "Dermatology",
  "Nutrition & Growth"
] as const;

function SectionHeader({ title, icon: Icon, description }: { title: string; icon?: any; description?: string }) {
  return (
    <div className="px-2 mb-4">
      <div className="flex items-center gap-2 mb-0.5">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground/60" />}
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">{title}</h3>
      </div>
      {description && <p className="text-[11px] text-muted-foreground font-medium">{description}</p>}
    </div>
  );
}

export default function WardDashboard() {
  const routeSearch = useSearch();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const allProtocols = useAllProtocols();

  const wardProtocols = useMemo(() => {
    return allProtocols.filter(p => p.unit === "ward");
  }, [allProtocols]);

  const selectedSystem = useMemo(() => {
    const params = new URLSearchParams(routeSearch);
    return params.get("system") || "";
  }, [routeSearch]);

  const systems = useMemo(() => {
    const set = new Set([...wardProtocols.map(p => p.system), ...WARD_SYSTEMS]);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [wardProtocols]);

  const systemProtocols = useMemo(() => {
    if (!selectedSystem) return [];
    return wardProtocols
      .filter(p => p.system === selectedSystem)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedSystem, wardProtocols]);

  const searchResults = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];
    
    return wardProtocols.filter(p => 
      p.name.toLowerCase().includes(q) || p.system.toLowerCase().includes(q)
    ).sort((a,b) => a.name.localeCompare(b.name));
  }, [searchTerm, wardProtocols]);

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-32 px-2 sm:px-4">
      {/* 1. WARD HERO & SEARCH */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-12 group relative overflow-hidden rounded-[32px] bg-blue-600 p-8 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <Badge className="bg-white/20 text-white border-none font-black tracking-widest text-[10px]">PEDIATRIC WARD</Badge>
              </div>
              <h1 className="text-4xl font-black tracking-tighter leading-tight">Ward Management</h1>
              <p className="text-blue-100 text-sm font-medium max-w-md">
                Inpatient protocols, admission checklists, and daily clinical monitoring.
              </p>
            </div>
            <div className="flex flex-col space-y-4 w-full md:w-auto md:min-w-[300px]">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-200 group-focus-within:text-white transition-colors" />
                <Input
                  type="search"
                  placeholder="Search Ward Protocols..."
                  className="w-full pl-12 pr-4 h-12 text-sm rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:bg-white/20 focus:border-white/40 shadow-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </div>
      </section>

      {searchTerm.trim() ? (
        /* SEARCH RESULTS */
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60">Search Results</h3>
            <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")} className="text-xs font-bold underline">Clear Search</Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {searchResults.length > 0 ? (
              searchResults.map(p => (
                <Link key={p.id} href={`/diseases/${p.id}`} className="group flex items-center justify-between p-4 rounded-2xl border bg-card hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold text-sm block">{p.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{p.system}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
                </Link>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-muted-foreground text-sm font-medium italic">
                No ward protocols found matching "{searchTerm}"
              </div>
            )}
          </div>
        </section>
      ) : selectedSystem ? (
        /* SYSTEM VIEW */
        <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Stethoscope className="h-4 w-4" />
              </div>
              <h3 className="text-xl font-black tracking-tight">{selectedSystem}</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setLocation("/ward")} className="text-xs font-bold text-muted-foreground">
              <X className="mr-2 h-3.5 w-3.5" /> Close
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {systemProtocols.length > 0 ? (
              systemProtocols.map(p => (
                <Link key={p.id} href={`/diseases/${p.id}`} className="group flex items-center justify-between p-4 rounded-2xl border bg-card hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 rounded-full bg-blue-50 text-blue-600 opacity-40 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-sm">{p.name}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-muted/20 border-2 border-dashed rounded-[32px] space-y-4">
                <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center mx-auto shadow-sm border">
                  <ClipboardList className="h-6 w-6 text-muted-foreground/40" />
                </div>
                <div className="space-y-1 px-6">
                  <p className="text-sm font-bold text-muted-foreground/60 tracking-tight">Protocols Pending</p>
                  <p className="text-[11px] text-muted-foreground/50 max-w-[200px] mx-auto">Guidelines for {selectedSystem} are currently being prepared.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : (
        <>
          {/* 2. QUICK ACCESS TOOLS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <WardCard 
              title="Admission Protocols" 
              description="Standardized guidelines for inpatient admission across various systems."
              icon={ClipboardList}
              color="blue"
            />
            <WardCard 
              title="Maintenance Fluids" 
              description="Holiday-Segar and maintenance fluid calculators for children."
              icon={FlaskConical}
              color="teal"
              href="/calculators/advanced-fluids"
            />
            <WardCard 
              title="Discharge Planning" 
              description="Criteria for safe transition to home care and follow-up requirements."
              icon={Info}
              color="amber"
            />
          </section>

          {/* 3. SYSTEMS BROWSER */}
          <section className="space-y-6">
            <SectionHeader title="Browse Ward by System" icon={LayoutGrid} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {systems.map(system => {
                const count = wardProtocols.filter(p => p.system === system).length;
                return (
                  <button 
                    key={system}
                    onClick={() => setLocation(`/ward?system=${encodeURIComponent(system)}`)}
                    className="flex items-center justify-between p-4 rounded-2xl border bg-card hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-xl bg-muted group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-sm block">{system}</span>
                        <span className="text-[10px] text-muted-foreground font-medium">{count} protocols</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-blue-600 transition-all" />
                  </button>
                );
              })}
            </div>
          </section>

          {/* 4. ANNOUNCEMENT */}
          <section className="bg-muted/40 border-2 border-dashed border-muted-foreground/20 rounded-[40px] p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-background rounded-3xl flex items-center justify-center mx-auto shadow-sm border">
              <Activity className="h-10 w-10 text-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight">Ward Unit Expansion</h3>
              <p className="text-muted-foreground max-w-sm mx-auto font-medium">
                We are building a comprehensive database for the Pediatric Ward. New protocols for inpatient management will be released soon.
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function WardCard({ title, description, icon: Icon, color, href }: { title: string; description: string; icon: any; color: string; href?: string }) {
  const content = (
    <div className="group h-full p-6 rounded-[28px] border-2 bg-card hover:border-primary/20 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div className="space-y-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm", 
          color === "blue" ? "bg-blue-50 text-blue-600" : 
          color === "teal" ? "bg-teal-50 text-teal-600" : 
          "bg-amber-50 text-amber-600"
        )}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-black text-lg tracking-tight leading-tight">{title}</h4>
          <p className="text-[12px] font-medium text-muted-foreground mt-2 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-primary/40 group-hover:text-primary transition-colors">
        {href ? "Launch Tool" : "Coming Soon"} <ArrowRight className="h-3 w-3" />
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
