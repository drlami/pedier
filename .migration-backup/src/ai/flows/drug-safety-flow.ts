'use server';
/**
 * @fileOverview A Genkit flow for checking drug safety (interactions, breastfeeding, and renal adjustment).
 *
 * - checkDrugSafety - A function that handles the safety check process.
 * - DrugSafetyInput - The input type for the checkDrugSafety function.
 * - DrugSafetyOutput - The return type for the checkDrugSafety function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DrugSafetyInputSchema = z.object({
  drugList: z.string().describe('A comma-separated list of medications to check.'),
});
export type DrugSafetyInput = z.infer<typeof DrugSafetyInputSchema>;

const DrugSafetyOutputSchema = z.object({
  interactions: z.array(z.object({
    drugs: z.array(z.string()).describe('The drugs involved in the interaction.'),
    severity: z.enum(['major', 'moderate', 'minor']).describe('The severity of the interaction.'),
    description: z.string().describe('A description of the interaction and its clinical significance.'),
  })).describe('List of drug-drug interactions found.'),
  breastfeedingSafety: z.array(z.object({
    drugName: z.string().describe('The name of the drug.'),
    safetyCategory: z.string().describe('Safety category (e.g., L1 to L5 or similar descriptive category).'),
    notes: z.string().describe('Clinical notes regarding breastfeeding safety.'),
  })).describe('Information on breastfeeding safety for each drug.'),
  renalAdjustment: z.array(z.object({
    drugName: z.string().describe('The name of the drug.'),
    adjustmentRequired: z.boolean().describe('Whether a dose adjustment is required in renal impairment.'),
    recommendations: z.string().describe('Dosing recommendations or adjustment guidelines for renal impairment.'),
  })).describe('Dosing adjustments for renal impairment for each drug.'),
}).describe('Structured drug safety analysis results.');
export type DrugSafetyOutput = z.infer<typeof DrugSafetyOutputSchema>;

export async function checkDrugSafety(input: DrugSafetyInput): Promise<DrugSafetyOutput> {
  return drugSafetyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'drugSafetyPrompt',
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
    name: 'drugSafetyFlow',
    inputSchema: DrugSafetyInputSchema,
    outputSchema: DrugSafetyOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate drug safety results.');
    }
    return output;
  }
);
