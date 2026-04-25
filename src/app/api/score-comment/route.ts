import { NextRequest, NextResponse } from "next/server";
import { getLLMClient, getLLMModel } from "@/lib/llm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { comment, sectionQuestions, agencyName } = body as {
      comment: string;
      sectionQuestions: string[];
      agencyName: string;
    };

    if (!comment) {
      return NextResponse.json({ error: "Comment text is required" }, { status: 400 });
    }

    const openai = getLLMClient();
    const model = getLLMModel();

    const prompt = `You are an expert in federal regulatory procedure and Administrative Procedure Act (APA) comment drafting. Evaluate the following public comment and score its likely effectiveness.

Rate the comment on a scale of 1-10 for how likely it is to be considered a "significant" comment that the agency must address under the APA.

Scoring criteria:
- Specificity (1-10): Does the comment contain specific facts, data, or personal experience, or is it vague/general?
- Evidence (1-10): Does the comment provide evidence, examples, or references to support claims?
- Relevance (1-10): Does the comment directly address the specific questions the agency asked in the NPRM?
- Persuasiveness (1-10): Is the argument well-structured and compelling?

The agency that will receive this comment is: ${agencyName}.

Agency questions this comment should address:
${(sectionQuestions || []).map((q: string, i: number) => `${i + 1}. ${q}`).join("\n") || "No specific questions provided."}

COMMENT TO EVALUATE:
"""
${comment.slice(0, 3000)}
"""

Return a JSON object with:
{
  "overallScore": number (1-10, can have decimal like 7.5),
  "specificity": number (1-10),
  "evidence": number (1-10),
  "relevance": number (1-10),
  "persuasiveness": number (1-10),
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "improvements": [
    "Specific action: What exactly to add/change and why",
    "Another specific improvement"
  ],
  "apaSignificance": "high" | "medium" | "low"
}`;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are a regulatory comment evaluator. Output only valid JSON." },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 1500,
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
          return NextResponse.json({
            overallScore: 5,
            specificity: 5,
            evidence: 5,
            relevance: 5,
            persuasiveness: 5,
            strengths: [],
            weaknesses: ["Could not parse evaluation"],
            improvements: ["Try adding more specific personal experience"],
            apaSignificance: "medium",
          });
        }
      }
      return NextResponse.json({
        overallScore: 5,
        specificity: 5,
        evidence: 5,
        relevance: 5,
        persuasiveness: 5,
        strengths: [],
        weaknesses: ["Could not evaluate"],
        improvements: ["Revise comment with more detail"],
        apaSignificance: "medium",
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Score comment error:", message);
    return NextResponse.json(
      { error: "Failed to score comment", details: message },
      { status: 500 }
    );
  }
}
