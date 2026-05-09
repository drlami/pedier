import { ai } from "./genkit";
import { z } from "genkit";

const DiffDiagInputSchema = z.object({
  symptoms: z.string(),
  age: z.string(),
  history: z.string().optional(),
});

const DiffDiagOutputSchema = z.object({
  differentials: z.array(
    z.object({
      diagnosis: z.string(),
      rationale: z.string(),
      priority: z.enum(["high", "medium", "low"]),
    })
  ),
  workup: z.array(
    z.object({
      test: z.string(),
      rationale: z.string(),
    })
  ),
  management: z.array(z.string()),
  redFlags: z.array(z.string()),
});

export type DiffDiagInput = z.infer<typeof DiffDiagInputSchema>;
export type DiffDiagOutput = z.infer<typeof DiffDiagOutputSchema>;

const differentialDiagnosisFlow = ai.defineFlow(
  {
    name: "differentialDiagnosisFlow",
    inputSchema: DiffDiagInputSchema,
    outputSchema: DiffDiagOutputSchema,
  },
  async (input) => {
    const historyLine = input.history
      ? `\n- Medical History: ${input.history}`
      : "";

    const promptText = `You are an expert pediatric emergency physician. Your task is to provide a structured differential diagnosis and clinical guidance for a pediatric patient based on the provided symptoms.

Input:
- Age: ${input.age}
- Symptoms: ${input.symptoms}${historyLine}

Please provide:
1. **differentials**: A list of potential diagnoses. Include high-priority/life-threatening conditions (must-not-miss) as well as more likely benign causes.
2. **workup**: The most high-yield initial labs, imaging, or bedside tests to narrow the differential.
3. **management**: Immediate practical steps for management in the emergency department.
4. **redFlags**: Critical signs or symptoms that would indicate rapid deterioration or a specific emergency.

Focus on pediatric-specific conditions. Be concise and practical.

IMPORTANT SAFETY RULE: This is a decision support tool for clinicians. Do not provide definitive diagnoses. The information must be used in conjunction with clinical judgment and physical examination.`;

    const { output } = await ai.generate({
      prompt: promptText,
      output: { schema: DiffDiagOutputSchema },
    });
    if (!output) throw new Error("AI failed to generate a differential diagnosis.");
    return output;
  }
);

export async function getDifferentialDiagnosis(input: DiffDiagInput): Promise<DiffDiagOutput> {
  return differentialDiagnosisFlow(input);
}
