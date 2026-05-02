'use server';

import { draftDiseaseProtocol } from '@/ai/flows/admin-assisted-protocol-drafting-flow';
import { getDifferentialDiagnosis } from '@/ai/flows/differential-diagnosis-flow';
import { checkDrugSafety } from '@/ai/flows/drug-safety-flow';
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

const DiffDiagSchema = z.object({
  age: z.string().min(1, "Age is required"),
  symptoms: z.string().min(5, "Symptoms are required"),
  history: z.string().optional(),
});

export async function getDiffDiagAction(prevState: any, formData: FormData) {
  const validatedFields = DiffDiagSchema.safeParse({
    age: formData.get('age'),
    symptoms: formData.get('symptoms'),
    history: formData.get('history'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Please fill in all required fields.',
      error: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    const output = await getDifferentialDiagnosis(validatedFields.data);
    return {
      message: 'Differential diagnosis generated.',
      error: null,
      data: output,
    };
  } catch (error) {
    console.error('Error generating diff diag:', error);
    return {
      message: 'An error occurred while processing the request.',
      error: { _form: ['AI processing failed. Please try again.'] },
      data: null,
    };
  }
}

const DrugSafetySchema = z.object({
  drugList: z.string().min(2, "Please enter at least one medication name"),
});

export async function checkDrugSafetyAction(prevState: any, formData: FormData) {
  const validatedFields = DrugSafetySchema.safeParse({
    drugList: formData.get('drugList'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid drug list.',
      error: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    const output = await checkDrugSafety(validatedFields.data);
    return {
      message: 'Drug safety check completed.',
      error: null,
      data: output,
    };
  } catch (error) {
    console.error('Error checking drug safety:', error);
    return {
      message: 'An error occurred while processing the request.',
      error: { _form: ['AI processing failed. Please try again.'] },
      data: null,
    };
  }
}
