import {z} from 'zod';

export const AssessAuspiciousnessInputSchema = z.object({
  event: z.string().describe('The event for which to assess auspiciousness.'),
  date: z.string().describe('The date to assess, in ISO format (YYYY-MM-DD).'),
});
export type AssessAuspiciousnessInput = z.infer<typeof AssessAuspiciousnessInputSchema>;

export const AssessAuspiciousnessOutputSchema = z.object({
  auspiciousnessScore: z.number().describe('A score from 1-10 indicating the auspiciousness of the date for the event, with 10 being most auspicious.'),
  reasoning: z.string().describe('The reasoning behind the auspiciousness score, considering the event and date.'),
});
export type AssessAuspiciousnessOutput = z.infer<typeof AssessAuspiciousnessOutputSchema>;
