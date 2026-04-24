import { NextRequest, NextResponse } from "next/server";
import { sampleNprms } from "@/data/samples";
import { generateInterviewQuestions } from "@/lib/llm";
import { NprmDocument } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nprmId } = body;

    if (!nprmId) {
      return NextResponse.json({ error: "nprmId is required" }, { status: 400 });
    }

    const nprm: NprmDocument | undefined = sampleNprms.find(
      (n: NprmDocument) => n.id === nprmId
    );
    if (!nprm) {
      return NextResponse.json({ error: "NPRM not found" }, { status: 404 });
    }

    const questions = await generateInterviewQuestions({
      nprmSummary: nprm.summary,
      sections: nprm.sections.map((s: { title: string; questionsAsked: string[] }) => ({
        title: s.title,
        questionsAsked: s.questionsAsked,
      })),
    });

    return NextResponse.json({ questions, nprmId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Generate questions error:", message);
    return NextResponse.json(
      { error: "Failed to generate questions", details: message },
      { status: 500 }
    );
  }
}
