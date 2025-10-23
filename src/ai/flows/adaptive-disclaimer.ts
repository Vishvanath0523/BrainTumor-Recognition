// src/ai/flows/adaptive-disclaimer.ts
'use server';

/**
 * @fileOverview A flow that generates an adaptive disclaimer based on the tumor detection probability score.
 *
 * - generateAdaptiveDisclaimer - A function that generates the adaptive disclaimer.
 * - AdaptiveDisclaimerInput - The input type for the generateAdaptiveDisclaimer function.
 * - AdaptiveDisclaimerOutput - The return type for the generateAdaptiveDisclaimer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptiveDisclaimerInputSchema = z.object({
  tumorProbability: z
    .number()
    .min(0)
    .max(1)
    .describe('The probability score of tumor detection (0 to 1).'),
});
export type AdaptiveDisclaimerInput = z.infer<typeof AdaptiveDisclaimerInputSchema>;

const AdaptiveDisclaimerOutputSchema = z.object({
  disclaimerMessage: z
    .string()
    .describe('The adaptive disclaimer message based on the tumor probability score.'),
});
export type AdaptiveDisclaimerOutput = z.infer<typeof AdaptiveDisclaimerOutputSchema>;

export async function generateAdaptiveDisclaimer(
  input: AdaptiveDisclaimerInput
): Promise<AdaptiveDisclaimerOutput> {
  return adaptiveDisclaimerFlow(input);
}

const adaptiveDisclaimerPrompt = ai.definePrompt({
  name: 'adaptiveDisclaimerPrompt',
  input: {schema: AdaptiveDisclaimerInputSchema},
  output: {schema: AdaptiveDisclaimerOutputSchema},
  prompt: `You are an AI assistant that generates disclaimer messages for a brain tumor detection tool.

  Based on the tumor probability score, generate an appropriate disclaimer message.

  If the tumor probability score is high (>= 0.7), the disclaimer should strongly advise the user to seek professional medical advice immediately.

  If the tumor probability score is low (< 0.7), the disclaimer should be more general, emphasizing that the tool is for informational purposes only and not a substitute for professional medical advice.

  Tumor Probability Score: {{{tumorProbability}}}

  Disclaimer Message:`,
});

const adaptiveDisclaimerFlow = ai.defineFlow(
  {
    name: 'adaptiveDisclaimerFlow',
    inputSchema: AdaptiveDisclaimerInputSchema,
    outputSchema: AdaptiveDisclaimerOutputSchema,
  },
  async input => {
    const {output} = await adaptiveDisclaimerPrompt(input);
    return output!;
  }
);
