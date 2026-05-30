import { SAFETY_DATABASE, type SafetyDrug, findDrugInText } from "./safety-rules";

export interface SafetyResult {
    verifiedDrugs: string[];
    unknownDrugs: string[];
    interactions: {
        drugs: string[];
        severity: "major" | "moderate";
        description: string;
    }[];
    breastfeedingSafety: {
        drugName: string;
        safetyCategory: string;
        notes: string;
        isVerified: boolean;
    }[];
    renalAdjustment: {
        drugName: string;
        adjustmentRequired: boolean;
        recommendations: string;
        isVerified: boolean;
    }[];
}

export function checkDrugSafetyOffline(drugListString: string): SafetyResult {
    const inputParts = drugListString.split(",").map(s => s.trim()).filter(s => s.length > 0);
    const foundDrugs: SafetyDrug[] = [];
    const unknownNames: string[] = [];

    inputParts.forEach(input => {
        const drug = findDrugInText(input);
        if (drug) {
            foundDrugs.push(drug);
        } else {
            unknownNames.push(input);
        }
    });

    const result: SafetyResult = {
        verifiedDrugs: foundDrugs.map(d => d.names[0]),
        unknownDrugs: unknownNames,
        interactions: [],
        breastfeedingSafety: [],
        renalAdjustment: []
    };

    // 1. Interactions
    for (let i = 0; i < foundDrugs.length; i++) {
        for (let j = i + 1; j < foundDrugs.length; j++) {
            const d1 = foundDrugs[i];
            const d2 = foundDrugs[j];
            const interaction = d1.majorInteractions.find(inter => inter.with.includes(d2.id));
            if (interaction) {
                result.interactions.push({
                    drugs: [d1.names[0], d2.names[0]],
                    severity: interaction.severity,
                    description: interaction.description
                });
            }
        }
    }

    // 2. Verified Data
    foundDrugs.forEach(drug => {
        result.breastfeedingSafety.push({
            drugName: drug.names[0],
            safetyCategory: drug.breastfeeding.category,
            notes: drug.breastfeeding.notes,
            isVerified: true
        });
        result.renalAdjustment.push({
            drugName: drug.names[0],
            adjustmentRequired: drug.renal.adjustmentThreshold > 0,
            recommendations: drug.renal.recommendation,
            isVerified: true
        });
    });

    // 3. Unknown Data (Safety Fallback)
    unknownNames.forEach(name => {
        result.breastfeedingSafety.push({
            drugName: name,
            safetyCategory: "?",
            notes: "NOT IN OFFLINE DATABASE.",
            isVerified: false
        });
        result.renalAdjustment.push({
            drugName: name,
            adjustmentRequired: false,
            recommendations: "UNVERIFIED LOCALLY.",
            isVerified: false
        });
    });

    return result;
}
