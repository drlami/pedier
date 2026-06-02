import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Brucellosis (Malta Fever)
 * FULL MASTER SENIOR DOCTOR MANAGEMENT PATHWAY
 * Derived from: WHO, CDC, and RCH Melbourne Guidelines
 */
export const wardBrucellosisProtocol: DiseaseProtocol = {
  id: 'ward-brucellosis',
  name: 'Brucellosis Master Pathway',
  system: 'Infectious Diseases',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Brucellosis is a systemic zoonotic infection caused by Brucella species, typically transmitted through the consumption of unpasteurized dairy products or contact with infected animals. This pathway provides a comprehensive roadmap for the management of pediatric Brucellosis (Malta Fever), including criteria for intravenous induction in severe cases, detailed multi-drug therapy logic (combining synergistic agents), and specialized protocols for focal complications like neurobrucellosis or osteoarticular involvement.',
  image: {
    url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Brucellosis Management Roadmap"
  },
  questions: [], 

  mmpData: {
    snapshot: "Management of Brucellosis centers on preventing relapse and managing focal complications through long-term multi-drug therapy. Key principles include: (1) Mandatory use of at least two synergistic antibiotics to target the intracellular nature of the pathogen, (2) A minimum treatment duration of 6 weeks (extending to months for focal disease), and (3) Close monitoring of Liver Function Tests and renal function during therapy. Intravenous induction with Gentamicin is recommended in the acute phase for toxic patients or those with focal complications.",
    stages: [
      {
        label: "Stage 1: Admission & IV Induction Logic",
        shortLabel: "Assessment",
        color: "blue",
        cards: [
          {
            title: "Mandatory Admission Workup",
            orders: [
              "Blood Cultures: REQUIRED (Note: Notify the microbiology lab to hold cultures for at least 14-21 days as Brucella is slow-growing).",
              "Standard Agglutination Test (SAT): Serum titer ≥ 1:160 is highly suggestive in symptomatic patients.",
              "Baseline Laboratories: Complete Blood Count (to check for leukopenia or thrombocytopenia), Liver Function Tests (LFTs), and Urea & Electrolytes.",
              "Imaging: Abdominal Ultrasound to assess for hepatosplenomegaly or focal abscesses."
            ]
          },
          {
            title: "Initial Physician Orders [DR]",
            isCritical: true,
            orders: [
              "Identify Indications for Intravenous (IV) Induction: Severe systemic toxicity, inability to tolerate oral medications, or suspected focal complications (Neurobrucellosis/Endocarditis).",
              "Induction Plan: Many consultants prefer 7-14 days of IV Gentamicin to rapidly reduce the bacterial load before transitioning to a purely oral regimen.",
              "CNS Involvement: Order Lumbar Puncture (LP) for CSF SAT titers, PCR, and culture if neurobrucellosis is suspected."
            ]
          },
          {
            title: "IV Induction Regimens",
            orders: [
              "Note: Gentamicin is the preferred parenteral agent to be used in combination with an oral backbone (Doxycycline or Co-trimoxazole)."
            ],
            prescriptions: [
              {
                drug: "Gentamicin",
                dose: "5 mg/kg",
                route: "Intravenous",
                frequency: "Once daily",
                calculation: (w) => `${(5 * w).toFixed(0)} mg`,
                notes: "Induction course: 7-14 days. Monitor renal function and watch for signs of ototoxicity (hearing/balance issues)."
              },
              {
                drug: "Ceftriaxone",
                dose: "100 mg/kg",
                route: "Intravenous",
                frequency: "Divided Every 12 hours",
                calculation: (w) => `${Math.min(w * 50, 2000).toFixed(0)} mg per dose`,
                notes: "Mandatory for Neurobrucellosis. Maximum dose 4g per day."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 2: Pivot to Oral Multi-Drug Therapy",
        shortLabel: "Management",
        color: "amber",
        cards: [
          {
            title: "Shift to Oral Logic",
            threshold: "IF CLINICALLY STABLE",
            orders: [
              "Transition Criteria: Afebrile for 48 hours, improving systemic symptoms (e.g., resolving joint pain), and tolerating oral intake.",
              "Dual/Triple Therapy: Brucellosis MUST always be treated with at least 2 agents to prevent high relapse rates (which can exceed 20% with monotherapy)."
            ]
          },
          {
            title: "Regimen A: Children > 8 Years (Preferred)",
            orders: [
              "Standard Backbone: Doxycycline combined with Rifampicin.",
              "Total Duration: Minimum 6 weeks for uncomplicated disease."
            ],
            prescriptions: [
              {
                drug: "Doxycycline",
                dose: "2.2 mg/kg",
                route: "Oral",
                frequency: "Every 12 hours",
                calculation: (w) => `${Math.min(w * 2.2, 100).toFixed(0)} mg`,
                notes: "Maximum dose: 100mg twice daily. Use with caution to avoid gastric irritation."
              },
              {
                drug: "Rifampicin",
                dose: "15 mg/kg",
                route: "Oral",
                frequency: "Once daily",
                calculation: (w) => `${Math.min(w * 15, 600).toFixed(0)} mg`,
                notes: "Maximum dose: 600-900mg daily. Monitor LFTs weekly."
              }
            ]
          },
          {
            title: "Regimen B: Children < 8 Years",
            orders: [
              "Combination: Co-trimoxazole (TMP-SMX) and Rifampicin.",
              "Note: This avoids the risk of permanent teeth staining associated with tetracyclines in young children."
            ],
            prescriptions: [
              {
                drug: "Co-trimoxazole (TMP-SMX)",
                dose: "8-10 mg/kg (of TMP component)",
                route: "Oral",
                frequency: "Every 12 hours",
                calculation: (w) => `${(w * 4).toFixed(0)} mg (TMP)`,
                notes: "Standard alternative to Doxycycline in younger patients."
              }
            ]
          }
        ]
      },
      {
        label: "Stage 3: Complication Management & Monitoring",
        shortLabel: "Complications",
        color: "red",
        cards: [
          {
            title: "Nursing: Strict Monitoring [NS]",
            nursing: [
              "Monitor temperature chart 4-hourly; report persistent fever after 7 days of treatment.",
              "Observe for signs of drug-induced hepatotoxicity: Jaundice, nausea, or abdominal pain (related to Rifampicin).",
              "Check for adherence to the multi-drug regimen, as compliance is critical to success.",
              "Assess joint range of motion and weight-bearing status daily."
            ]
          },
          {
            title: "Focal Disease Protocols",
            isCritical: true,
            orders: [
              "Neurobrucellosis: Requires 3-6 months of therapy (Ceftriaxone induction for 4-6 weeks + Doxycycline + Rifampicin).",
              "Osteomyelitis/Spondylitis: Requires 12 weeks of therapy. Order MRI of the spine if back pain or neurological signs develop.",
              "Endocarditis: Mandatory consultation with Cardiac Surgery; treatment lasts 3-6 months."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Recovery & Discharge",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Discharge & Follow-up Roadmap",
            orders: [
              "Discharge Readiness: Clinically stable, afebrile, and clear understanding of the 6-week minimum therapy duration.",
              "Monthly Clinic Review: Monitor clinical resolution and check LFTs.",
              "Serological Monitoring: Repeat SAT titers at 3, 6, and 12 months to confirm cure and detect early relapse.",
              "Relapse Warning: Educate parents that any return of fever or joint pain requires immediate evaluation."
            ]
          }
        ]
      }
    ]
  },

  // ER Legacy
  calculateSeverity: () => ({ level: 'moderate', details: [] }),
  getManagement: () => [],
  getDisposition: () => [],
  getRedFlags: () => [],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "WHO: Brucellosis in Humans and Animals", url: "https://www.who.int/publications/i/item/9789241547130" },
    { title: "CDC: Brucellosis Diagnosis and Management", url: "https://www.cdc.gov/brucellosis/treatment/index.html" },
    { title: "RCH Melbourne: Brucellosis handbook", url: "https://www.rch.org.au/clinicalguide/guideline_index/Brucellosis/" }
  ],
};
