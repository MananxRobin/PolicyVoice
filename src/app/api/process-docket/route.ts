import { NextRequest, NextResponse } from "next/server";
import { getLLMClient, getLLMModel } from "@/lib/llm";
import { getDocketDocuments } from "@/lib/regulations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { docketId } = body as { docketId: string };

    if (!docketId) {
      return NextResponse.json({ error: "docketId is required" }, { status: 400 });
    }

    const apiKey = process.env.REGULATIONS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "REGULATIONS_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Fetch docket documents
    let documentText = "";
    try {
      const docsResult = await getDocketDocuments(docketId, apiKey, 5);
      const docs = docsResult.data || [];

      documentText = docs
        .map(
          (d: { attributes: { title?: string; summary?: string } }) =>
            `TITLE: ${d.attributes.title || "Untitled"}\nSUMMARY: ${d.attributes.summary || "No summary available"}`
        )
        .join("\n\n---\n\n");
    } catch (err) {
      console.error("Failed to fetch docket documents:", err);
    }

    if (!documentText.trim()) {
      documentText = `Docket ID: ${docketId}. Document details could not be retrieved. Generating structure from available information.`;
    }

    // Use AI to structure the NPRM
    const openai = getLLMClient();
    const model = getLLMModel();

    const prompt = `Analyze the following information from a federal Notice of Proposed Rulemaking (NPRM) on Regulations.gov and create a structured summary that can be used for public comment drafting.

Extract and generate:

1. A 2-3 sentence plain-English summary of what this rule would do and why it matters to everyday people
2. The agency name
3. The docket ID
4. Key topics (4-6 tags like "water safety", "consumer rights")
5. 3-5 logical sections, each with:
   - Section title (e.g., "I. Background and Purpose")
   - Key proposal: What the agency is proposing in this section (one sentence)
   - Agency reasoning: Why the agency thinks this is the right approach (one sentence)
   - Questions asked: 1-3 questions the agency wants commenters to answer
   - Page reference (use "NPRM Text" as placeholder since we don't have page numbers)
   - Content: A 2-4 sentence summary of what this section covers
6. Comment deadline if available, or "Check regulations.gov" if unknown
7. Published date if available, or "See regulations.gov" if unknown

DOCKET ID: ${docketId}

AVAILABLE DOCUMENT INFORMATION:
${documentText.slice(0, 6000)}

Return a JSON object with this structure:
{
  "id": "a-hyphenated-id",
  "docketId": "${docketId}",
  "agency": "Agency Name",
  "title": "Full Rule Title",
  "summary": "2-3 sentence plain-English summary",
  "publishedDate": "YYYY-MM-DD",
  "commentDeadline": "YYYY-MM-DD",
  "url": "https://www.regulations.gov/docket/${docketId}",
  "keyTopics": ["topic1", "topic2", "topic3", "topic4"],
  "sections": [
    {
      "id": "s1",
      "title": "I. Section Title",
      "content": "2-4 sentence section summary",
      "pageRef": "NPRM Text",
      "keyProposal": "What the agency is proposing",
      "agencyReasoning": "Why the agency thinks this is right",
      "questionsAsked": ["Question 1", "Question 2"]
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are a federal regulatory analyst. Output only valid JSON. Create realistic, well-structured NPRM summaries even from limited information." },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 3000,
    });

    const content = response.choices[0]?.message?.content || "{}";
    
    try {
      const parsed = JSON.parse(content);
      return NextResponse.json(parsed);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return NextResponse.json(JSON.parse(match[0]));
        } catch {
          return NextResponse.json(
            { error: "Failed to parse NPRM structure" },
            { status: 500 }
          );
        }
      }
      return NextResponse.json(
        { error: "Failed to parse NPRM structure" },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Process docket error:", message);
    return NextResponse.json(
      { error: "Failed to process docket", details: message },
      { status: 500 }
    );
  }
}
