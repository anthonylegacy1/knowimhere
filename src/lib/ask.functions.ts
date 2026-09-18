import { createServerFn } from "@tanstack/react-start";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, Output } from "ai";
import { z } from "zod";
import { EMERGENCY_KEYWORDS } from "@/data/resources";

const CATEGORY_IDS = [
  "health",
  "senior",
  "community",
  "recreation",
  "food",
  "employment",
  "youth",
  "transportation",
  "neighborhood",
  "housing",
  "technology",
  "arts",
  "education",
  "events",
] as const;

const IntentSchema = z.object({
  categories: z.array(z.string()),
  needsTransit: z.boolean(),
  walkingOnly: z.boolean(),
  when: z.string(),
  freeOnly: z.boolean(),
  forYouth: z.boolean(),
  forSenior: z.boolean(),
  isIssueReport: z.boolean(),
  isEmergency: z.boolean(),
  summary: z.string(),
});

export type ParsedIntent = z.infer<typeof IntentSchema>;

const Input = z.object({
  question: z.string().min(1),
  profileSummary: z.string().optional(),
});

export const parseIntent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<{ ok: true; intent: ParsedIntent } | { ok: false; error: string }> => {
    const lower = data.question.toLowerCase();
    if (EMERGENCY_KEYWORDS.some((k) => lower.includes(k))) {
      return {
        ok: true,
        intent: {
          categories: [],
          needsTransit: false,
          walkingOnly: false,
          when: "any",
          freeOnly: false,
          forYouth: false,
          forSenior: false,
          isIssueReport: false,
          isEmergency: true,
          summary: "This may be an emergency.",
        },
      };
    }

    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { ok: false, error: "AI is not configured." };

    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: key,
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });

    try {
      const result = streamText({
        model: lovable.responses("openai/gpt-6-astra"),
        output: Output.object({ schema: IntentSchema }),
        system: `You are the intent parser for "Know I'm Here", a Detroit community-resource guide.
Classify the resident's request into a small JSON object. Rules:
- categories: choose from ${CATEGORY_IDS.join(", ")}. Pick 1-3 that best match the need. Use "transportation" only when transportation itself is the need, not when it is a constraint ("I don't drive").
- needsTransit: true if the person cannot or does not drive, or asks for bus/ride options.
- walkingOnly: true if they want something within walking distance.
- when: one of today, tomorrow, this-week, weekend, any.
- freeOnly: true if they mention free, cheap, low cost or affordability.
- forYouth: true if the request is about a child or teenager.
- forSenior: true if the request is about an older adult or senior.
- isIssueReport: true if they are describing a neighborhood problem (dumping, streetlight, pothole, abandoned property, missed garbage, sidewalk, damaged park).
- isEmergency: true only for immediate danger to life or safety.
- summary: one short, warm, plain-language sentence (max 20 words) restating what you understood, e.g. "Looking for free, fun things tomorrow that you can reach by bus."
Never give medical, legal or eligibility conclusions.`,
        prompt: `${data.profileSummary ? `Resident profile: ${data.profileSummary}\n` : ""}Request: ${data.question}`,
        providerOptions: {
          openai: {
            forceReasoning: true,
            reasoningEffort: "low",
            reasoningSummary: "auto",
            store: false,
            include: ["reasoning.encrypted_content"],
          },
        },
      });
      const output = await result.output;
      const allowed = new Set<string>(CATEGORY_IDS);
      return {
        ok: true,
        intent: { ...output, categories: output.categories.filter((c) => allowed.has(c)).slice(0, 3) },
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI request failed";
      console.error("parseIntent failed", message);
      return { ok: false, error: message };
    }
  });
