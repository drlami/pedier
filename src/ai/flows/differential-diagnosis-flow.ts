'use server';
/**
 * @fileOverview A Genkit flow for generating pediatric differential diagnoses.
 *
 * - getDifferentialDiagnosis - A function that handles the AI process.
 * - DiffDiagInput - The input type.
 * - DiffDiagOutput - The return type.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DiffDiagInputSchema = z.object({
  symptoms: z.string().describe('The presenting symptoms and history of present illness.'),
  age: z.string().describe('The age of the patient (e.g., "5 years", "2 months").'),
  history: z.string().optional().describe('Relevant past medical history.'),
});
export type DiffDiagInput = z.infer<typeof DiffDiagInputSchema>;

const DiffDiagOutputSchema = z.object({
  differentials: z.array(z.object({
    diagnosis: z.string().describe('The name of the potential diagnosis.'),
    rationale: z.string().describe('Why this diagnosis is being considered based on the symptoms.'),
    priority: z.enum(['high', 'medium', 'low']).describe('The clinical priority or likelihood.'),
  })).describe('A list of ranked differential diagnoses.'),
  workup: z.array(z.object({
    test: z.string().describe('The name of the lab or imaging study.'),
    rationale: z.string().describe('Why this test is indicated.'),
  })).describe('Recommended initial workup steps.'),
  management: z.array(z.string()).describe('Key initial management recommendations.'),
  redFlags: z.array(z.string()).describe('Specific red flags to watch for in this clinical context.'),
}).describe('AI-generated differential diagnosis and clinical guidance.');
export type DiffDiagOutput = z.infer<typeof DiffDiagOutputSchema>;

export async function getDifferentialDiagnosis(input: DiffDiagInput): Promise<DiffDiagOutput> {
  return differentialDiagnosisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'differentialDiagnosisPrompt',
  input: { schema: DiffDiagInputSchema },
  output: { schema: DiffDiagOutputSchema },
  prompt: `You are an expert pediatric emergency physician. Your task is to provide a structured differential diagnosis and clinical guidance for a pediatric patient based on the provided symptoms.

Input:
- Age: {{{age}}}
- Symptoms: {{{symptoms}}}
{{#if history}}- Medical History: {{{history}}}{{/if}}

Please provide:
1. **differentials**: A list of potential diagnoses. Include high-priority/life-threatening conditions (must-not-miss) as well as more likely benign causes.
2. **workup**: The most high-yield initial labs, imaging, or bedside tests to narrow the differential.
3. **management**: Immediate practical steps for management in the emergency department.
4. **redFlags**: Critical signs or symptoms that would indicate rapid deterioration or a specific emergency.

Focus on pediatric-specific conditions. Be concise and practical.

IMPORTANT SAFETY RULE: This is a decision support tool for clinicians. Do not provide definitive diagnoses. The information must be used in conjunction with clinical judgment and physical examination.`,
});

const differentialDiagnosisFlow = ai.defineFlow(
  {
    name: 'differentialDiagnosisFlow',
    inputSchema: DiffDiagInputSchema,
    outputSchema: DiffDiagOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate a differential diagnosis.');
    }
    return output;
  }
);
