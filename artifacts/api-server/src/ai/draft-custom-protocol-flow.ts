import { ai } from "./genkit";
import { z } from "genkit";

const SeverityLevelEnum = z.enum(['mild', 'moderate', 'severe', 'some', 'no', 'unknown']);

const CustomProtocolOutputSchema = z.object({
  id: z.string().describe("URL-safe kebab-case id, e.g. 'acute-otitis-media'"),
  name: z.string(),
  system: z.string().describe("Clinical system category, e.g. 'Respiratory', 'Infectious Disease', 'Neurology'"),
  description: z.string().describe("One or two sentence description of the protocol"),
  questions: z.array(z.object({
    id: z.string().describe("camelCase unique key, e.g. 'weight', 'oxygenSat', 'hasFever'"),
    questionText: z.string(),
    type: z.enum(['number', 'boolean', 'select', 'radio']),
    unit: z.string().optional().describe("e.g. 'kg', '%', 'mmHg'"),
    options: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  })),
  severityRules: z.array(z.object({
    id: z.string(),
    priority: z.number().describe("Lower number = evaluated first. Use 1, 2, 3..."),
    condition: z.string().describe("JavaScript boolean expression using question IDs as variables. E.g.: 'oxygenSat < 92 || hasStridor === true'"),
    level: SeverityLevelEnum,
    detail: z.string().describe("Human-readable summary of why this severity was triggered"),
  })),
  defaultSeverity: SeverityLevelEnum.describe("Fallback severity if no rule matches"),
  management: z.array(z.object({
    id: z.string(),
    title: z.string(),
    recommendations: z.array(z.string()).describe("Can include {{weight * 0.1}} expressions for weight-based calculations"),
    severities: z.array(SeverityLevelEnum).nullable().describe("null means applies to all severities"),
  })),
  disposition: z.array(z.object({
    id: z.string(),
    text: z.string(),
    type: z.enum(['admission', 'discharge', 'general']),
    severities: z.array(SeverityLevelEnum).nullable(),
  })),
  redFlags: z.array(z.string()),
  drugDoses: z.array(z.object({
    id: z.string(),
    drugName: z.string(),
    dose: z.string().describe("Can use {{weight * factor}} expressions, e.g. '{{weight * 0.1}} mg/kg IV'"),
    maxDose: z.string().optional(),
    notes: z.string().optional(),
    severities: z.array(SeverityLevelEnum).nullable(),
  })),
  references: z.array(z.object({
    id: z.string(),
    title: z.string(),
    url: z.string().optional(),
  })),
});

export type DraftCustomProtocolOutput = z.infer<typeof CustomProtocolOutputSchema>;

const InputSchema = z.object({
  description: z.string(),
  system: z.string().optional().describe("Clinical system category to assign the protocol to"),
});

const prompt = ai.definePrompt({
  name: "draftCustomProtocolPrompt",
  input: { schema: InputSchema },
  output: { schema: CustomProtocolOutputSchema },
  prompt: `You are a clinical informatics assistant helping a pediatric emergency physician build structured clinical decision support protocols. Generate a complete, accurate, evidence-based protocol in the required JSON schema.

IMPORTANT RULES:
- Use only established, evidence-based medical information
- All drug doses must include weight-based expressions using {{weight * factor}} notation where weight is in kg
- Severity rule conditions must be valid JavaScript boolean expressions using the exact question IDs you define
- Include at least 3 assessment questions (always include 'weight' as a number question in kg if drug doses are weight-based)
- Severity rules must use the exact question IDs defined in the questions array
- Include comprehensive management recommendations
- Red flags should be clinical warning signs that require immediate escalation
{{#if system}}- The protocol's "system" field MUST be set to exactly: "{{system}}"{{/if}}

Generate a complete protocol for the following:
{{{description}}}`,
});

const draftCustomProtocolFlow = ai.defineFlow(
  {
    name: "draftCustomProtocolFlow",
    inputSchema: InputSchema,
    outputSchema: CustomProtocolOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error("AI returned no output.");
    // Always enforce the chosen system if one was provided
    if (input.system) {
      output.system = input.system;
    }
    return output;
  }
);

export async function draftCustomProtocol(
  description: string,
  system?: string
): Promise<DraftCustomProtocolOutput> {
  return draftCustomProtocolFlow({ description, system });
}
