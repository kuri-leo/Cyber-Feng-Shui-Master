// Assess the auspiciousness of a given date for a specific event.

'use server';

import {ai} from '@/ai/genkit';
import {
  AssessAuspiciousnessInputSchema,
  AssessAuspiciousnessOutputSchema,
  type AssessAuspiciousnessInput,
  type AssessAuspiciousnessOutput,
} from '@/ai/schemas';

export async function assessAuspiciousness(input: AssessAuspiciousnessInput): Promise<AssessAuspiciousnessOutput> {
  return assessAuspiciousnessFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessAuspiciousnessPrompt',
  input: {schema: AssessAuspiciousnessInputSchema},
  output: {schema: AssessAuspiciousnessOutputSchema},
  prompt: `You are an expert in Feng Shui and Chinese astrology.

  Assess the auspiciousness of the given date for the specified event. Provide a score from 1 to 10, where 10 is the most auspicious.
  Explain your reasoning based on traditional Chinese metaphysics, considering the event and the date's astrological properties.

  Event: {{{event}}}
  Date: {{{date}}}
  \nOutput in JSON format.
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const assessAuspiciousnessFlow = ai.defineFlow(
  {
    name: 'assessAuspiciousnessFlow',
    inputSchema: AssessAuspiciousnessInputSchema,
    outputSchema: AssessAuspiciousnessOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
