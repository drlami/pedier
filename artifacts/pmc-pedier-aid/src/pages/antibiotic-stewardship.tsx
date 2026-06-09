import { useState } from "react";
import { FlaskConical, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type AntibioticEntry = {
  syndrome: string;
  icon: string;
  category: string;
  firstLine: { name: string; dose: string; route: string }[];
  alternatives: { name: string; dose: string; route: string; indication: string }[];
  duration: string;
  stepDown: string;
  notesAndEscalation: string[];
  penicillinAllergy?: string;
};

const SYNDROMES: AntibioticEntry[] = [
  {
    syndrome: "Community-Acquired Pneumonia (CAP)",
    icon: "🫁",
    category: "Respiratory",
    firstLine: [
      { name: "Amoxicillin", dose: "90 mg/kg/day divided q8–12h (max 4g/day)", route: "Oral" },
    ],
    alternatives: [
      { name: "Amoxicillin-Clavulanate", dose: "90 mg/kg/day (amox component) divided q12h", route: "Oral", indication: "If Staphylococcus or resistant organism suspected" },
      { name: "Ceftriaxone", dose: "50–100 mg/kg/day IV/IM (max 2g)", route: "IV/IM", indication: "Hospitalised, moderate-severe, oral intolerance" },
      { name: "Azithromycin (add-on)", dose: "10 mg/kg day 1, then 5 mg/kg days 2–5", route: "Oral", indication: "Atypical organism suspected (Mycoplasma, Chlamydia) — age ≥ 5y" },
    ],
    duration: "5 days (mild-moderate). 7–10 days (severe/complicated).",
    stepDown: "IV → oral when afebrile × 24h and tolerating feeds. Switch to Amoxicillin.",
    penicillinAllergy: "Non-severe: Cefdinir 14 mg/kg/day. Severe allergy: Azithromycin or Levofloxacin (limited paed data).",
    notesAndEscalation: [
      "Cover Streptococcus pneumoniae as primary organism under 5y",
      "Add atypical coverage for school-age children with gradual onset + dry cough",
      "No antibiotic for mild viral CAP in children under 2y (most viral)",
      "Escalate to Vancomycin + Pip-Tazo if necrotising pneumonia or MRSA concern",
    ],
  },
  {
    syndrome: "Urinary Tract Infection (UTI) — Lower",
    icon: "💧",
    category: "Urology",
    firstLine: [
      { name: "Trimethoprim-Sulfamethoxazole (TMP-SMX)", dose: "8 mg/kg/day (TMP component) divided q12h", route: "Oral" },
      { name: "Nitrofurantoin", dose: "5–7 mg/kg/day divided q6–8h (≥ 3 months, eGFR ≥ 30)", route: "Oral" },
    ],
    alternatives: [
      { name: "Cephalexin", dose: "50–100 mg/kg/day divided q6h", route: "Oral", indication: "TMP-SMX resistance common; allergy" },
      { name: "Amoxicillin-Clavulanate", dose: "45 mg/kg/day divided q8–12h", route: "Oral", indication: "If susceptibility confirmed" },
    ],
    duration: "3–5 days (lower UTI, girls > 2y). 7–10 days (boys, young children, anatomical abnormality).",
    stepDown: "Oral throughout for uncomplicated lower UTI.",
    penicillinAllergy: "Cephalexin (non-severe allergy). TMP-SMX or Nitrofurantoin (severe allergy).",
    notesAndEscalation: [
      "Culture and sensitivity essential before starting antibiotics",
      "Nitrofurantoin: not for upper UTI/pyelonephritis — poor tissue penetration",
      "Recurrent UTI: consider renal imaging + urology referral",
      "Asymptomatic bacteriuria: do NOT treat (except pre-op or pregnant)",
    ],
  },
  {
    syndrome: "Pyelonephritis (Upper UTI)",
    icon: "🫘",
    category: "Urology",
    firstLine: [
      { name: "Ceftriaxone", dose: "75 mg/kg/day IV (max 2g/day)", route: "IV" },
      { name: "Cefixime", dose: "16 mg/kg day 1, then 8 mg/kg/day (max 400mg/day)", route: "Oral — if mild, tolerating" },
    ],
    alternatives: [
      { name: "Gentamicin", dose: "5–7.5 mg/kg/day IV (once daily)", route: "IV", indication: "Severe illness, allergy, resistance" },
      { name: "Amoxicillin-Clavulanate", dose: "45–90 mg/kg/day divided q8h", route: "Oral", indication: "Step-down when sensitivities known" },
    ],
    duration: "10–14 days total (IV 2–4 days then oral step-down).",
    stepDown: "Switch to oral when afebrile × 24h. Use sensitivity-guided therapy.",
    penicillinAllergy: "Gentamicin monotherapy for severe allergy. Ceftriaxone acceptable for non-severe β-lactam allergy.",
    notesAndEscalation: [
      "Blood cultures if < 2 months, toxic, or unable to tolerate orals",
      "Renal ultrasound if no response in 48h",
      "Voiding cystourethrogram (VCUG) after first febrile UTI in children ≥ 2 months (per local guideline)",
      "Prolonged prophylaxis: consider TMP-SMX 2 mg/kg/day at bedtime if recurrent + VUR",
    ],
  },
  {
    syndrome: "Otitis Media (AOM)",
    icon: "👂",
    category: "ENT",
    firstLine: [
      { name: "Amoxicillin", dose: "90 mg/kg/day divided q8–12h (max 4g/day)", route: "Oral" },
    ],
    alternatives: [
      { name: "Amoxicillin-Clavulanate", dose: "90 mg/kg/day divided q8–12h", route: "Oral", indication: "Recent antibiotics (< 30 days), conjunctivitis, or treatment failure" },
      { name: "Ceftriaxone", dose: "50 mg/kg IM single dose (or 3 daily doses)", route: "IM", indication: "Oral intolerance or treatment failure × 3 days" },
    ],
    duration: "10 days (< 2 years or severe). 5–7 days (≥ 2 years, mild-moderate).",
    stepDown: "Oral throughout. No IV needed.",
    penicillinAllergy: "Non-severe: Cefdinir 14 mg/kg/day. Severe: Azithromycin (reduced efficacy) or Clindamycin.",
    notesAndEscalation: [
      "Observation without antibiotics acceptable: ≥ 6 months, unilateral, mild symptoms, no ear drum rupture",
      "Treat immediately: < 6 months, bilateral, perforation, or systemic signs",
      "Myringotomy if treatment failure after 3 doses ceftriaxone",
    ],
  },
  {
    syndrome: "Skin and Soft Tissue Infection (SSTI)",
    icon: "🩹",
    category: "Dermatology",
    firstLine: [
      { name: "Cephalexin", dose: "50–100 mg/kg/day divided q6h (max 4g/day)", route: "Oral" },
      { name: "Clindamycin", dose: "30–40 mg/kg/day divided q8h (max 1.8g/day)", route: "Oral" },
    ],
    alternatives: [
      { name: "TMP-SMX", dose: "8–12 mg/kg/day (TMP) divided q12h", route: "Oral", indication: "MRSA SSTI — community CA-MRSA" },
      { name: "Cefazolin", dose: "100 mg/kg/day IV divided q8h", route: "IV", indication: "Hospitalised, non-MRSA cellulitis" },
      { name: "Vancomycin", dose: "60 mg/kg/day IV divided q6h (adjust trough)", route: "IV", indication: "MRSA, severe/hospitalised" },
    ],
    duration: "5 days (non-purulent cellulitis). 5–7 days (purulent after drainage). 7–14 days (MRSA).",
    stepDown: "IV → oral when afebrile, improving. Step down to TMP-SMX or Clindamycin for MRSA.",
    penicillinAllergy: "TMP-SMX or Clindamycin for non-severe allergy. Avoid beta-lactams if severe.",
    notesAndEscalation: [
      "Incision and drainage is primary treatment for purulent lesions (abscess, furuncle)",
      "Mark cellulitis border with pen to monitor progression",
      "CA-MRSA suspected: TMP-SMX or Clindamycin first line",
      "Hospital-MRSA or severe: Vancomycin IV",
      "Necrotising fasciitis: urgent surgical debridement + Pip-Tazo + Vancomycin",
    ],
  },
  {
    syndrome: "Sepsis — Empiric (Unknown Source)",
    icon: "⚡",
    category: "Critical Care",
    firstLine: [
      { name: "Piperacillin-Tazobactam", dose: "300–400 mg/kg/day IV divided q6–8h (max 16g Pip/day)", route: "IV" },
      { name: "Ceftriaxone + Vancomycin", dose: "Ceftriaxone 100 mg/kg/day + Vancomycin 60 mg/kg/day divided q6h", route: "IV", },
    ],
    alternatives: [
      { name: "Meropenem", dose: "60 mg/kg/day IV divided q8h (max 6g/day)", route: "IV", indication: "Immunocompromised, resistant organism, ESBL/Pseudomonas risk" },
      { name: "Add Vancomycin", dose: "60 mg/kg/day IV divided q6h", route: "IV", indication: "MRSA risk: line infection, Gram-positive on Gram stain, skin source" },
      { name: "Add Metronidazole", dose: "30 mg/kg/day IV divided q8h", route: "IV", indication: "Intra-abdominal source" },
    ],
    duration: "De-escalate to targeted therapy as soon as cultures and sensitivities available.",
    stepDown: "Narrow based on culture results within 24–48 hours. Stop antibiotic if cultures negative and no infection.",
    penicillinAllergy: "Aztreonam + Metronidazole (severe penicillin allergy, gram-negative cover). Add Vancomycin for gram-positive cover.",
    notesAndEscalation: [
      "Blood cultures × 2 (all lumens) BEFORE starting antibiotics — do not delay treatment",
      "Start within 60 minutes of sepsis recognition",
      "Broad-spectrum → narrow based on cultures (antibiotic stewardship principle)",
      "Duration: generally 7–10 days for bacteraemia; varies by source",
      "Procalcitonin-guided de-escalation protocol reduces antibiotic exposure",
    ],
  },
  {
    syndrome: "Meningitis — Bacterial (Empiric)",
    icon: "🧠",
    category: "Neurology",
    firstLine: [
      { name: "Ceftriaxone", dose: "100 mg/kg/day IV divided q12h (max 4g/day)", route: "IV" },
      { name: "+ Vancomycin", dose: "60 mg/kg/day IV divided q6h (for penicillin-resistant S. pneumoniae)", route: "IV" },
    ],
    alternatives: [
      { name: "Ampicillin (add)", dose: "300–400 mg/kg/day IV divided q6h", route: "IV", indication: "If Listeria possible (neonate, immunocompromised, age > 50y)" },
      { name: "Dexamethasone", dose: "0.15 mg/kg IV q6h × 4 days", route: "IV", indication: "> 6 weeks, give 15–30 min BEFORE or with first antibiotic dose" },
    ],
    duration: "S. pneumoniae: 10–14 days. N. meningitidis: 5–7 days. L. monocytogenes: 21 days. H. influenzae: 7–10 days.",
    stepDown: "Continue IV throughout. Oral not appropriate for bacterial meningitis.",
    penicillinAllergy: "Chloramphenicol + Vancomycin (for severe beta-lactam allergy). Specialist input required.",
    notesAndEscalation: [
      "LP before antibiotics if no papilloedema and no focal signs — do not delay antibiotics if LP delayed",
      "Notify public health — prophylaxis for close contacts (Rifampicin or Ciprofloxacin for meningococcal)",
      "CT before LP only if: focal signs, immunocompromised, papilloedema, or GCS ≤ 11",
      "Dexamethasone reduces hearing loss and neurological sequelae for S. pneumoniae",
      "Remove dexamethasone if Gram-negative or Listeria identified",
    ],
  },
  {
    syndrome: "Periorbital / Pre-septal Cellulitis",
    icon: "👁",
    category: "Ophthalmology",
    firstLine: [
      { name: "Amoxicillin-Clavulanate", dose: "90 mg/kg/day divided q8h", route: "Oral — mild, no proptosis" },
      { name: "Ceftriaxone", dose: "50–100 mg/kg/day IV", route: "IV — moderate/hospitalised" },
    ],
    alternatives: [
      { name: "+ Vancomycin", dose: "60 mg/kg/day IV divided q6h", route: "IV", indication: "MRSA suspected or severe" },
      { name: "+ Metronidazole", dose: "30 mg/kg/day IV divided q8h", route: "IV", indication: "Anaerobic source (sinus extension)" },
    ],
    duration: "Pre-septal: 7–10 days oral. Orbital: 14–21 days, IV then oral.",
    stepDown: "IV → oral after 48–72h of clinical improvement. Ensure ophthalmology review.",
    penicillinAllergy: "Cephalexin (non-severe). TMP-SMX + Metronidazole (severe allergy).",
    notesAndEscalation: [
      "CT orbits to rule out orbital (post-septal) involvement if proptosis, restricted EOM, or no improvement",
      "Orbital cellulitis: ENT + Ophthalmology + Surgical drainage if subperiosteal abscess",
      "Pre-septal: no proptosis, full EOM, normal vision — oral antibiotics appropriate",
    ],
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(SYNDROMES.map(s => s.category)))];

export default function AntibioticStewardshipPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openSyndrome, setOpenSyndrome] = useState<string | null>(null);

  const filtered = selectedCategory === "All" ? SYNDROMES : SYNDROMES.filter(s => s.category === selectedCategory);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-green-100 text-green-700">
          <FlaskConical className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Antibiotic Stewardship Pathway</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Syndrome-based empiric antibiotic choice, dosing, duration, and de-escalation guidance for paediatric patients.
          </p>
        </div>
      </div>

      <Alert className="rounded-2xl border-green-200 bg-green-50">
        <Info className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 text-sm">
          <strong>Stewardship principles:</strong> Use the narrowest effective agent. Get cultures before starting. De-escalate when sensitivities are available. Set duration at start. Review at 48–72h.
        </AlertDescription>
      </Alert>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-2xl border-2 font-bold text-sm transition-all",
              selectedCategory === cat ? "bg-primary text-white border-primary shadow-md" : "bg-muted/20 border-transparent hover:border-primary/30"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Syndrome cards */}
      <div className="space-y-4">
        {filtered.map(s => (
          <Card
            key={s.syndrome}
            className={cn("rounded-3xl border-2 cursor-pointer transition-all", openSyndrome === s.syndrome ? "border-primary bg-primary/5" : "hover:border-primary/30")}
            onClick={() => setOpenSyndrome(openSyndrome === s.syndrome ? null : s.syndrome)}
          >
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <p className="font-black text-base">{s.syndrome}</p>
                    <Badge className="bg-muted text-muted-foreground font-semibold text-xs mt-0.5">{s.category}</Badge>
                  </div>
                </div>
                <span className="text-muted-foreground text-xl">{openSyndrome === s.syndrome ? "▲" : "▼"}</span>
              </div>

              {openSyndrome === s.syndrome && (
                <div className="mt-5 space-y-4 text-sm">
                  {/* First line */}
                  <div>
                    <p className="font-black text-xs uppercase tracking-widest text-primary/70 mb-2">First-Line Therapy</p>
                    <div className="space-y-2">
                      {s.firstLine.map((a, i) => (
                        <div key={i} className="rounded-2xl bg-primary/5 border border-primary/20 p-3">
                          <p className="font-black">{a.name} <Badge className="ml-1 bg-primary/20 text-primary text-xs font-bold">{a.route}</Badge></p>
                          <p className="text-muted-foreground mt-0.5">{a.dose}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Alternatives */}
                  <div>
                    <p className="font-black text-xs uppercase tracking-widest text-muted-foreground mb-2">Alternatives / Escalation</p>
                    <div className="space-y-2">
                      {s.alternatives.map((a, i) => (
                        <div key={i} className="rounded-2xl bg-muted/30 border p-3">
                          <p className="font-black">{a.name} <Badge className="ml-1 bg-muted text-muted-foreground text-xs font-bold">{a.route}</Badge></p>
                          <p className="text-muted-foreground mt-0.5">{a.dose}</p>
                          <p className="text-xs text-primary/70 mt-0.5">Use when: {a.indication}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-muted/20 p-3 border">
                      <p className="font-black text-xs uppercase tracking-widest text-muted-foreground mb-1">Duration</p>
                      <p>{s.duration}</p>
                    </div>
                    <div className="rounded-2xl bg-muted/20 p-3 border">
                      <p className="font-black text-xs uppercase tracking-widest text-muted-foreground mb-1">IV→Oral Step-Down</p>
                      <p>{s.stepDown}</p>
                    </div>
                  </div>

                  {/* Allergy */}
                  {s.penicillinAllergy && (
                    <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3">
                      <p className="font-black text-xs uppercase tracking-widest text-amber-700 mb-1">Penicillin Allergy Alternative</p>
                      <p className="text-amber-800">{s.penicillinAllergy}</p>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <p className="font-black text-xs uppercase tracking-widest text-muted-foreground mb-2">Stewardship Notes</p>
                    <div className="space-y-1.5">
                      {s.notesAndEscalation.map((n, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="opacity-50 shrink-0 mt-0.5">•</span>
                          <span className="text-muted-foreground">{n}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert className="rounded-2xl border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 text-sm">
          <strong>Always check local antibiogram and hospital formulary.</strong> Resistance patterns vary significantly by institution and region. These are guidelines — susceptibility testing must guide definitive therapy. Consult infectious diseases for complex or resistant cases.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference: AAP Red Book 2024 · IDSA Clinical Practice Guidelines · BNF for Children 2024 · WHO AWaRe Antibiotic Classification
      </p>
    </div>
  );
}
