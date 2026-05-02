import { ai } from "./genkit";
import { z } from "genkit";

const DraftProtocolInputSchema = z.object({
  guidelineText: z.string(),
});

const DraftProtocolOutputSchema = z.object({
  diseaseName: z.string(),
  questions: z.array(
    z.object({
      question: z.string(),
      type: z.enum(["text", "number", "boolean", "choice"]),
      options: z.array(z.string()).optional(),
    })
  ),
  severityRules: z.array(
    z.object({
      severity: z.enum(["mild", "moderate", "severe", "some", "no", "impending respiratory failure"]),
      criteria: z.array(z.string()),
    })
  ),
  managementRecommendations: z.array(z.string()),
  redFlags: z.array(z.string()),
  admissionCriteria: z.array(z.string()),
  dischargeCriteria: z.array(z.string()),
  references: z.array(z.string()),
  drugDoses: z.array(
    z.object({
      drugName: z.string(),
      dose: z.string(),
      notes: z.string().optional(),
    })
  ),
});

export type DraftProtocolInput = z.infer<typeof DraftProtocolInputSchema>;
export type DraftProtocolOutput = z.infer<typeof DraftProtocolOutputSchema>;

const prompt = ai.definePrompt({
  name: "adminAssistedProtocolDraftingPrompt",
  input: { schema: DraftProtocolInputSchema },
  output: { schema: DraftProtocolOutputSchema },
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

const draftProtocolFlow = ai.defineFlow(
  {
    name: "adminAssistedProtocolDraftingFlow",
    inputSchema: DraftProtocolInputSchema,
    outputSchema: DraftProtocolOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error("Failed to draft disease protocol: AI output was null or undefined.");
    return output;
  }
);

export async function draftDiseaseProtocol(input: DraftProtocolInput): Promise<DraftProtocolOutput> {
  return draftProtocolFlow(input);
}
