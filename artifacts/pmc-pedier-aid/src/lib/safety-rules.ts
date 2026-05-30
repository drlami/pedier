/**
 * Offline Pediatric Drug Safety Database
 * Curated list of high-yield ER medications and their safety profiles.
 */

export interface SafetyDrug {
    id: string;
    names: string[]; // Variations for matching
    breastfeeding: {
        category: "L1" | "L2" | "L3" | "L4" | "L5" | "Unknown";
        notes: string;
    };
    renal: {
        adjustmentThreshold: number; // GFR mL/min below which adjustment is needed
        recommendation: string;
    };
    majorInteractions: {
        with: string[]; // IDs of other drugs
        description: string;
        severity: "major" | "moderate";
    }[];
}

export const SAFETY_DATABASE: SafetyDrug[] = [
    // --- RESUSCITATION ---
    {
        id: "adrenaline",
        names: ["Adrenaline", "Epinephrine"],
        breastfeeding: { category: "L1", notes: "Safe. High first-pass metabolism by infant if excreted in milk." },
        renal: { adjustmentThreshold: 0, recommendation: "No renal adjustment required." },
        majorInteractions: [{ with: ["amiodarone"], severity: "moderate", description: "Increased risk of arrhythmias." }]
    },
    {
        id: "amiodarone",
        names: ["Amiodarone", "Cordarone"],
        breastfeeding: { category: "L5", notes: "Avoid. Risk of iodine-induced hypothyroidism in infant." },
        renal: { adjustmentThreshold: 0, recommendation: "No dosage adjustment needed." },
        majorInteractions: [{ with: ["erythromycin", "clarithromycin"], severity: "major", description: "Severe risk of QTc prolongation and Torsades." }]
    },
    
    // --- SEDATION & ANALGESIA ---
    {
        id: "midazolam",
        names: ["Midazolam", "Versed"],
        breastfeeding: { category: "L2", notes: "Generally safe for single doses." },
        renal: { adjustmentThreshold: 10, recommendation: "No adjustment unless severe failure." },
        majorInteractions: [{ with: ["fentanyl", "morphine"], severity: "major", description: "SYNERGISTIC RESPIRATORY DEPRESSION. Monitor airway closely." }]
    },
    {
        id: "fentanyl",
        names: ["Fentanyl", "Sublimaze"],
        breastfeeding: { category: "L2", notes: "Wait 2 hours after dose before breastfeeding." },
        renal: { adjustmentThreshold: 10, recommendation: "No adjustment unless severe failure." },
        majorInteractions: [{ with: ["midazolam", "diazepam"], severity: "major", description: "Profound respiratory depression risk." }]
    },
    {
        id: "ketamine",
        names: ["Ketamine", "Ketalar"],
        breastfeeding: { category: "Unknown", notes: "Data limited. Use caution." },
        renal: { adjustmentThreshold: 0, recommendation: "No renal adjustment required." },
        majorInteractions: [{ with: ["theophylline"], severity: "moderate", description: "May lower seizure threshold." }]
    },

    // --- ANTIBIOTICS ---
    {
        id: "ceftriaxone",
        names: ["Ceftriaxone", "Rocephin"],
        breastfeeding: { category: "L2", notes: "Safe. Monitor for thrush." },
        renal: { adjustmentThreshold: 10, recommendation: "Max 2g/day if GFR < 10." },
        majorInteractions: [{ with: ["calcium"], severity: "major", description: "CONTRAINDICATED in neonates: Fatal lung/kidney precipitates." }]
    },
    {
        id: "gentamicin",
        names: ["Gentamicin", "Garamycin"],
        breastfeeding: { category: "L2", notes: "Safe. Poor oral absorption by infant." },
        renal: { adjustmentThreshold: 60, recommendation: "Mandatory interval extension based on eGFR." },
        majorInteractions: [{ with: ["vancomycin", "furosemide"], severity: "moderate", description: "Additive nephro/ototoxicity." }]
    },
    {
        id: "vancomycin",
        names: ["Vancomycin", "Vancocin"],
        breastfeeding: { category: "L1", notes: "Safe." },
        renal: { adjustmentThreshold: 50, recommendation: "Strict eGFR-based dosing and troughs required." },
        majorInteractions: [{ with: ["gentamicin"], severity: "moderate", description: "Increased risk of AKI." }]
    },

    // --- GENERAL ---
    {
        id: "ondansetron",
        names: ["Ondansetron", "Zofran"],
        breastfeeding: { category: "L2", notes: "Likely safe." },
        renal: { adjustmentThreshold: 0, recommendation: "No adjustment needed." },
        majorInteractions: [{ with: ["erythromycin", "amiodarone"], severity: "moderate", description: "Additive QT prolongation risk." }]
    },
    {
        id: "ibuprofen",
        names: ["Ibuprofen", "Advil", "Motrin"],
        breastfeeding: { category: "L1", notes: "Safe." },
        renal: { adjustmentThreshold: 30, recommendation: "Avoid in renal failure; decreases perfusion." },
        majorInteractions: [{ with: ["lithium"], severity: "major", description: "Toxic lithium levels likely." }]
    }
];

export function findDrugInText(text: string): SafetyDrug | undefined {
    const query = text.toLowerCase().trim();
    return SAFETY_DATABASE.find(drug => 
        drug.names.some(name => query.includes(name.toLowerCase()) || name.toLowerCase().includes(query))
    );
}
