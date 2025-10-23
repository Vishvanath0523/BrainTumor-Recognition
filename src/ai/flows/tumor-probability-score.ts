'use server';

/**
 * @fileOverview Provides a probability score indicating the likelihood of a tumor being present in an MRI image.
 *
 * - getTumorProbabilityScore - A function that processes an MRI image and returns a probability score.
 * - TumorProbabilityScoreInput - The input type for the getTumorProbabilityScore function.
 * - TumorProbabilityScoreOutput - The return type for the getTumorProbabilityScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TumorProbabilityScoreInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "An MRI image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TumorProbabilityScoreInput = z.infer<typeof TumorProbabilityScoreInputSchema>;

const TumorProbabilityScoreOutputSchema = z.object({
  probability: z
    .number()
    .min(0)
    .max(100)
    .describe('The probability (0-100) of a tumor being present.'),
});
export type TumorProbabilityScoreOutput = z.infer<typeof TumorProbabilityScoreOutputSchema>;

export async function getTumorProbabilityScore(
  input: TumorProbabilityScoreInput
): Promise<TumorProbabilityScoreOutput> {
  return tumorProbabilityScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tumorProbabilityScorePrompt',
  input: {schema: TumorProbabilityScoreInputSchema},
  output: {schema: TumorProbabilityScoreOutputSchema},
  prompt: `Analyze the MRI image and determine the probability (0-100) of a tumor being present.\n\nImage: {{media url=photoDataUri}}\n\nOutput the probability as a number between 0 and 100. Do not provide any other output.`, // Added description for output format
});

const tumorProbabilityScoreFlow = ai.defineFlow(
  {
    name: 'tumorProbabilityScoreFlow',
    inputSchema: TumorProbabilityScoreInputSchema,
    outputSchema: TumorProbabilityScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
