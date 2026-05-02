import { ai } from "./genkit";
import { z } from "genkit";

const DrugSafetyInputSchema = z.object({
  drugList: z.string(),
});

const DrugSafetyOutputSchema = z.object({
  interactions: z.array(
    z.object({
      drugs: z.array(z.string()),
      severity: z.enum(["major", "moderate", "minor"]),
      description: z.string(),
    })
  ),
  breastfeedingSafety: z.array(
    z.object({
      drugName: z.string(),
      safetyCategory: z.string(),
      notes: z.string(),
    })
  ),
  renalAdjustment: z.array(
    z.object({
      drugName: z.string(),
      adjustmentRequired: z.boolean(),
      recommendations: z.string(),
    })
  ),
});

export type DrugSafetyInput = z.infer<typeof DrugSafetyInputSchema>;
export type DrugSafetyOutput = z.infer<typeof DrugSafetyOutputSchema>;

const prompt = ai.definePrompt({
  name: "drugSafetyPrompt",
  input: { schema: DrugSafetyInputSchema },
  output: { schema: DrugSafetyOutputSchema },
  prompt: `You are an expert clinical pharmacist specializing in emergency medicine. Your task is to provide a safety analysis for the following medications.

Medications: {{{drugList}}}

Please provide:
1. **interactions**: Analyze all possible drug-drug interactions among the list provided. Categorize them by severity (major, moderate, minor).
2. **breastfeedingSafety**: For each drug in the list, provide its safety profile for breastfeeding mothers (e.g., Hale's Lactation Risk Categories or general safety guidance).
3. **renalAdjustment**: For each drug, specify if dose adjustments are needed in patients with renal impairment (decreased GFR) and provide specific guidance.

Focus on clinically significant information for the emergency department.

IMPORTANT SAFETY RULE: This is a decision support tool. All information must be verified by a qualified human pharmacist or physician before clinical use.`,
});

const drugSafetyFlow = ai.defineFlow(
  {
    name: "drugSafetyFlow",
    inputSchema: DrugSafetyInputSchema,
    outputSchema: DrugSafetyOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error("AI failed to generate drug safety results.");
    return output;
  }
);

export async function checkDrugSafety(input: DrugSafetyInput): Promise<DrugSafetyOutput> {
  return drugSafetyFlow(input);
}
