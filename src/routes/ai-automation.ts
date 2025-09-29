import { Request, Response, Router } from "express";
import { AutomationRequestSchema, PersonElement } from "../schemas";
import linkedInApiClient from "../axios-config";
import { z } from "zod";
import { GoogleGenAI, Type } from "@google/genai";
import { outreachPrompt } from "./outreachPrompt";
import { extractPersonId } from "./search";

const router = Router();

const generateRandomDelay = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const sleep = (seconds: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

const initializeGeminiAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }
  return new GoogleGenAI({ apiKey });
};

const generatePersonalizedMessage = async (
  ai: GoogleGenAI,
  messageTemplate: string,
  person: PersonElement,
  targetIndustries?: string,
  excludeIndustries?: string
): Promise<{ qualified: boolean; outreachMessage: string }> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: outreachPrompt({
      outreachMessageTemplate: messageTemplate,
      person,
      targetIndustries,
      excludeIndustries,
    }),
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          qualified: { type: Type.BOOLEAN },
          outreachMessage: { type: Type.STRING },
        },
        required: ["qualified", "outreachMessage"],
      },
    },
  });

  const result = JSON.parse(response.text || "{}");
  return {
    qualified: result.qualified || false,
    outreachMessage: result.outreachMessage || "",
  };
};

router.post("/", async (req: Request, res: Response) => {
  try {
    const automationData = AutomationRequestSchema.parse(req.body);

    console.log("Starting AI automation with params:", {
      totalLeads: automationData.totalLeads,
      leadListId: automationData.leadListId,
      initialStartCount: automationData.initialStartCount,
      delayRange: `${automationData.minDelay}-${automationData.maxDelay}s`,
    });

    // Initialize Gemini AI
    const ai = initializeGeminiAI();

    let currentStart = automationData.initialStartCount;
    let processedLeads = 0;
    let sentInvitations = 0;
    let skippedLeads = 0;
    let unqualifiedLeads = 0;
    const errors: Array<{ personId: string; error: string }> = [];

    // Main automation loop
    do {
      try {
        // Fetch batch of people (max 100 per request)
        const batchSize = Math.min(
          100,
          automationData.totalLeads - processedLeads
        );

        console.log(
          `Fetching batch: start=${currentStart}, count=${batchSize}`
        );

        const searchResponse = await linkedInApiClient.searchPeople({
          start: currentStart,
          count: batchSize,
          leadListId: automationData.leadListId,
        });

        if (!searchResponse.elements || searchResponse.elements.length === 0) {
          console.log("No more leads found, ending automation");
          break;
        }

        // Filter out users who already have pending invitations
        const availableLeads = searchResponse.elements.filter(
          (person: PersonElement) => !person.pendingInvitation
        );

        console.log(
          `Found ${searchResponse.elements.length} people, ${availableLeads.length} available for outreach`
        );

        // Process each available lead
        for (const person of availableLeads) {
          if (processedLeads >= automationData.totalLeads) {
            console.log("Reached target number of leads, stopping automation");
            break;
          }

          try {
            console.log(`Processing ${person.fullName} (${person.personId})`);

            // Generate personalized message using Gemini AI
            const aiResult = await generatePersonalizedMessage(
              ai,
              automationData.messageTemplate,
              person,
              automationData.targetIndustries,
              automationData.excludeIndustries
            );

            if (!aiResult.qualified) {
              console.log(
                `❌ ${person.fullName} is not qualified for outreach - removing from lead list`
              );

              try {
                //TODO: Fix the remove api call
                // Remove unqualified candidate from lead list
                // await linkedInApiClient.removeFromLeadList({
                //   leadListId: automationData.leadListId,
                //   entityUrn: person.entityUrn,
                // });
                // console.log(`🗑️ Removed ${person.fullName} from lead list`);
              } catch (removeError: any) {
                console.error(
                  `Failed to remove ${person.fullName} from lead list:`,
                  removeError.message
                );
              }

              unqualifiedLeads++;
              processedLeads++;
              continue;
            }

            console.log(
              `✅ ${person.fullName} is qualified. Generated message: "${aiResult.outreachMessage}"`
            );

            // Send connection request
            await linkedInApiClient.sendConnectionRequest({
              member: extractPersonId(person.entityUrn),
              message: aiResult.outreachMessage,
            });

            sentInvitations++;
            console.log(` Sent invitation to ${person.fullName}`);
          } catch (error: any) {
            console.error(
              `L Error processing ${person.fullName}:`,
              error.message
            );
            errors.push({
              personId: extractPersonId(person.entityUrn),
              error: error.message || "Unknown error",
            });
            skippedLeads++;
          }

          processedLeads++;

          // Add random delay between requests if not the last person
          if (
            processedLeads < automationData.totalLeads &&
            processedLeads % availableLeads.length !== 0
          ) {
            const delay = generateRandomDelay(
              automationData.minDelay,
              automationData.maxDelay
            );
            console.log(`� Waiting ${delay} seconds before next request...`);
            await sleep(delay);
          }
        }

        // Count skipped leads (those with pending invitations)
        skippedLeads += searchResponse.elements.length - availableLeads.length;

        // Move to next page
        currentStart += batchSize;

        // Check if we've processed enough leads or if there are no more results
        if (
          processedLeads >= automationData.totalLeads ||
          searchResponse.elements.length < batchSize
        ) {
          break;
        }

        // Small delay between pages
        if (processedLeads < automationData.totalLeads) {
          const pageDelay = generateRandomDelay(2, 5);
          console.log(
            `� Page completed, waiting ${pageDelay} seconds before next page...`
          );
          await sleep(pageDelay);
        }
      } catch (error: any) {
        console.error("Error in batch processing:", error);
        // Continue with next batch rather than failing completely

        // Break the loop because we don't want to continue processing if there is an error
        processedLeads = automationData.totalLeads + 1;
        currentStart += 100;
        continue;
      }
    } while (processedLeads < automationData.totalLeads);

    const response = {
      success: true,
      message: `Automation completed successfully. Processed ${processedLeads} leads, sent ${sentInvitations} invitations, skipped ${skippedLeads} leads, unqualified ${unqualifiedLeads} leads.`,
      processedLeads,
      sentInvitations,
      skippedLeads,
      unqualifiedLeads,
      errors,
    };

    console.log("Automation completed:", response);
    res.status(200).json(response);
  } catch (error: any) {
    console.error("Error in AI automation:", error);

    if (error instanceof z.ZodError) {
      const errorResponse = {
        success: false,
        message: "Invalid request parameters",
        processedLeads: 0,
        sentInvitations: 0,
        skippedLeads: 0,
        unqualifiedLeads: 0,
        errors: [
          {
            personId: "",
            error: error.issues.map((i) => i.message).join(", "),
          },
        ],
      };
      return res.status(400).json(errorResponse);
    }

    if (error.message?.includes("GOOGLE_AI_API_KEY")) {
      const errorResponse = {
        success: false,
        message: "Google AI API key not configured",
        processedLeads: 0,
        sentInvitations: 0,
        skippedLeads: 0,
        unqualifiedLeads: 0,
        errors: [{ personId: "", error: "Missing Google AI API key" }],
      };
      return res.status(500).json(errorResponse);
    }

    const errorResponse = {
      success: false,
      message:
        error?.message || "An unexpected error occurred during automation",
      processedLeads: 0,
      sentInvitations: 0,
      skippedLeads: 0,
      unqualifiedLeads: 0,
      errors: [{ personId: "", error: error?.message || "Unknown error" }],
    };

    res.status(500).json(errorResponse);
  }
});

export default router;
