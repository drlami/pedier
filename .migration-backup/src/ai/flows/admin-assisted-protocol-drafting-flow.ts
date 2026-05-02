'use server';
/**
 * @fileOverview A Genkit flow for drafting structured disease protocol content from medical guidelines.
 *
 * - draftDiseaseProtocol - A function that handles the disease protocol drafting process.
 * - DiseaseProtocolDraftInput - The input type for the draftDiseaseProtocol function.
 * - DiseaseProtocolDraftOutput - The return type for the draftDiseaseProtocol function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DiseaseProtocolDraftInputSchema = z.object({
  guidelineText: z.string().describe('The medical guidelines or text to process for drafting a disease protocol.'),
});
export type DiseaseProtocolDraftInput = z.infer<typeof DiseaseProtocolDraftInputSchema>;

const DiseaseProtocolDraftOutputSchema = z.object({
  diseaseName: z.string().describe('The name of the disease.'),
  questions: z.array(z.object({
    question: z.string().describe('The assessment question.'),
    type: z.enum(['text', 'number', 'boolean', 'choice']).describe('The type of input expected for the question.'),
    options: z.array(z.string()).optional().describe('Optional, list of choices if the type is "choice".'),
  })).describe('A list of structured assessment questions.'),
  severityRules: z.array(z.object({
    severity: z.enum(['mild', 'moderate', 'severe', 'some', 'no', 'impending respiratory failure']).describe('The severity classification.'),
    criteria: z.array(z.string()).describe('List of criteria that define this severity level.'),
  })).describe('Rules defining different severity classifications.'),
  managementRecommendations: z.array(z.string()).describe('Key management recommendations for the disease.'),
  redFlags: z.array(z.string()).describe('Critical red flags to watch for.'),
  admissionCriteria: z.array(z.string()).describe('Criteria for patient admission.'),
  dischargeCriteria: z.array(z.string()).describe('Criteria for patient discharge.'),
  references: z.array(z.string()).describe('Relevant medical references or sources.'),
  drugDoses: z.array(z.object({
    drugName: z.string().describe('The name of the drug.'),
    dose: z.string().describe('The recommended dosage.'),
    notes: z.string().optional().describe('Any additional notes regarding the drug or dose.'),
  })).describe('Information on relevant drug dosages.'),
}).describe('Structured content for a disease protocol drafted from medical guidelines.');
export type DiseaseProtocolDraftOutput = z.infer<typeof DiseaseProtocolDraftOutputSchema>;

export async function draftDiseaseProtocol(input: DiseaseProtocolDraftInput): Promise<DiseaseProtocolDraftOutput> {
  return adminAssistedProtocolDraftingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adminAssistedProtocolDraftingPrompt',
  input: { schema: DiseaseProtocolDraftInputSchema },
  output: { schema: DiseaseProtocolDraftOutputSchema },
  prompt: `You are an AI assistant designed to help administrators draft structured content for pediatric emergency disease protocols based on provided medical guidelines. Your goal is to extract specific information and format it according to the specified JSON schema.

IMPORTANT SAFETY RULE: This is NOT a diagnosis generator. Do not invent diagnoses or treatments. Extract and structure information strictly from the provided text based on predefined criteria and rule-based algorithms. The drafted content will be subject to expert human review and approval for clinical accuracy.

From the following medical guideline text, please extract and structure the following:
1.  **diseaseName**: The primary name of the disease or condition.
2.  **questions**: A list of structured assessment questions. For each question, identify its type ('text', 'number', 'boolean', 'choice') and provide options if it's a 'choice' type.
3.  **severityRules**: Define criteria for different severity levels (e.g., mild, moderate, severe, some, no, impending respiratory failure) based on the text.
4.  **managementRecommendations**: Key practical management steps.
5.  **redFlags**: Critical signs or symptoms indicating potential worsening or severe condition.
6.  **admissionCriteria**: Conditions or criteria for admitting a patient.
7.  **dischargeCriteria**: Conditions or criteria for safely discharging a patient.
8.  **references**: Any cited references or sources.
9.  **drugDoses**: Specific drug names, recommended doses, and any relevant notes.

Focus on extracting bedside-friendly, high-yield, and concise information. If information for a specific field is not present in the text, provide an empty array or string as appropriate for the schema.

Medical Guideline Text:
{{{guidelineText}}}`,
});

const adminAssistedProtocolDraftingFlow = ai.defineFlow(
  {
    name: 'adminAssistedProtocolDraftingFlow',
    inputSchema: DiseaseProtocolDraftInputSchema,
    outputSchema: DiseaseProtocolDraftOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to draft disease protocol: AI output was null or undefined.');
    }
    return output;
  }
);
