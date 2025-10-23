"use server";

import { getTumorProbabilityScore } from "@/ai/flows/tumor-probability-score";
import { generateAdaptiveDisclaimer } from "@/ai/flows/adaptive-disclaimer";

export async function analyzeMriImage(photoDataUri: string) {
  if (!process.env.GEMINI_API_KEY) {
    // This is the most likely cause of failure in a deployed environment.
    // Make the error message extremely clear for the user.
    return {
      error:
        "CRITICAL ERROR: The GEMINI_API_KEY is not set. The application cannot work without it. Please add it to your Vercel project's environment variables.",
    };
  }

  try {
    if (!photoDataUri) {
      throw new Error("Image data is missing.");
    }
    
    const probabilityResult = await getTumorProbabilityScore({ photoDataUri });

    if (typeof probabilityResult.probability !== 'number') {
      throw new Error("AI model returned an invalid probability score.");
    }
    
    const probabilityForDisclaimer = probabilityResult.probability / 100.0;

    const disclaimerResult = await generateAdaptiveDisclaimer({ tumorProbability: probabilityForDisclaimer });

    return {
      probability: probabilityResult.probability,
      disclaimer: disclaimerResult.disclaimerMessage,
    };
  } catch (error) {
    console.error("Error during MRI image analysis:", error);
    // This is a catch-all for other unexpected errors during the AI call itself
    return { error: "Failed to analyze image due to a server error. Please try again later." };
  }
}
