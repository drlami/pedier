'use server';

import { draftDiseaseProtocol } from '@/ai/flows/admin-assisted-protocol-drafting-flow';
import { z } from 'zod';

const DraftProtocolSchema = z.object({
  guidelineText: z.string().min(100, "Guideline text must be at least 100 characters long."),
});

export async function draftProtocolAction(prevState: any, formData: FormData) {
  const validatedFields = DraftProtocolSchema.safeParse({
    guidelineText: formData.get('guidelineText'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid input. Please provide sufficient guideline text.',
      error: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    const output = await draftDiseaseProtocol({ guidelineText: validatedFields.data.guidelineText });
    return {
      message: 'Protocol drafted successfully.',
      error: null,
      data: output,
    };
  } catch (error) {
    console.error('Error drafting protocol:', error);
    return {
      message: 'An error occurred while drafting the protocol with AI.',
      error: { _form: ['AI processing failed.'] },
      data: null,
    };
  }
}
