"use server";

import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/googleai";
import { z } from "zod";
import { AssessAuspiciousnessOutputSchema, type AssessAuspiciousnessInput } from "@/ai/schemas";

const FormSchema = z.object({
  event: z.string().min(3, { message: "Event must be at least 3 characters." }),
  date: z.date({ required_error: "A date is required." }),
});

type Settings = {
  apiKey?: string;
  modelName?: string;
};

export async function getAuspiciousness(values: z.infer<typeof FormSchema>, settings: Settings) {
    const validatedFields = FormSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            error: "Invalid input.",
            result: null,
        };
    }
    
    // DEBUGGING: Log the received settings on the server
    console.log(`[ACTION DEBUG] Model Name: ${settings.modelName || 'default'}`);
    console.log(`[ACTION DEBUG] API Key (first 5): ${settings.apiKey?.substring(0, 5)}`);

    if (!settings.apiKey) {
      return {
        error: "API key is missing. Please provide it in the settings.",
        result: null
      }
    }

    const { event, date } = validatedFields.data;
    const input: AssessAuspiciousnessInput = {
        event,
        date: date.toISOString().split('T')[0], // YYYY-MM-DD
    };

    try {
        const modelName = settings.modelName || 'gemini-2.0-flash';
        const ai = genkit({
            plugins: [googleAI({ apiKey: settings.apiKey })],
        });

        const prompt = `You are an expert in Feng Shui and Chinese astrology.

        Assess the auspiciousness of the given date for the specified event. Provide a score from 1 to 10, where 10 is the most auspicious.
        Explain your reasoning based on traditional Chinese metaphysics, considering the event and the date's astrological properties.

        Event: ${input.event}
        Date: ${input.date}
        \nOutput in JSON format.
        `;

        const { output } = await ai.generate({
            model: `googleai/${modelName}`,
            prompt: prompt,
            output: {
                schema: AssessAuspiciousnessOutputSchema,
            },
            config: {
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
        
        return { error: null, result: output! };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : String(e);
        return {
            error: errorMessage,
            result: null,
        };
    }
}
