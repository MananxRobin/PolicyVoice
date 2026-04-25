import { NextRequest, NextResponse } from "next/server";
import { getLLMClient, getLLMModel } from "@/lib/llm";

const translationCache = new Map<string, string>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, sectionTitle } = body as { text: string; sectionTitle: string };

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const cacheKey = `${sectionTitle || ""}::${text.slice(0, 200)}`;
    if (translationCache.has(cacheKey)) {
      return NextResponse.json({ plainText: translationCache.get(cacheKey), cached: true });
    }

    const openai = getLLMClient();
    const model = getLLMModel();

    const prompt = `You are a plain language expert. Translate the following government regulation text into plain English at an 8th-grade reading level. 

Rules:
1. Replace jargon with everyday words (e.g., "Maximum Contaminant Level" → "legal limit for how much of this chemical can be in water")
2. Keep all important facts and numbers, but explain what they mean
3. Use short sentences (no more than 20 words)
4. Add brief explanations in parentheses when a concept needs context
5. Keep the same meaning and don't add opinions
6. Output ONLY the translated text, no introduction or explanation

Original text:
${text.slice(0, 4000)}

Plain English translation:`;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are a plain language translator. Output only the translated text." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 2000,
    });

    const plainText = response.choices[0]?.message?.content?.trim() || "Translation unavailable.";

    if (translationCache.size > 50) {
      const firstKey = translationCache.keys().next().value;
      if (firstKey) translationCache.delete(firstKey);
    }
    translationCache.set(cacheKey, plainText);

    return NextResponse.json({ plainText, cached: false });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Plain language error:", message);
    return NextResponse.json(
      { error: "Failed to translate", details: message },
      { status: 500 }
    );
  }
}
