import { NextRequest, NextResponse } from "next/server";
import { sampleNprms } from "@/data/samples";
import { draftComment } from "@/lib/llm";
import { NprmSection, NprmDocument } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nprmId, sectionId, answers } = body as {
      nprmId: string;
      sectionId: string;
      answers: { question: string; answer: string }[];
    };

    if (!nprmId || !sectionId || !answers) {
      return NextResponse.json(
        { error: "nprmId, sectionId, and answers are required" },
        { status: 400 }
      );
    }

    const nprm: NprmDocument | undefined = sampleNprms.find(
      (n: NprmDocument) => n.id === nprmId
    );
    if (!nprm) {
      return NextResponse.json({ error: "NPRM not found" }, { status: 404 });
    }

    const section: NprmSection | undefined = nprm.sections.find(
      (s: NprmSection) => s.id === sectionId
    );
    if (!section) {
      return NextResponse.json(
        { error: "Section not found" },
        { status: 404 }
      );
    }

    const result = await draftComment({
      nprmSection: {
        title: section.title,
        content: section.content,
        keyProposal: section.keyProposal,
        agencyReasoning: section.agencyReasoning,
        questionsAsked: section.questionsAsked,
        pageRef: section.pageRef,
      },
      answers,
      docketId: nprm.docketId,
      agency: nprm.agency,
    });

    return NextResponse.json({
      body: result.body,
      citations: result.citations,
      docketId: nprm.docketId,
      agency: nprm.agency,
      sectionTitle: section.title,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Draft comment error:", message);
    return NextResponse.json(
      { error: "Failed to draft comment", details: message },
      { status: 500 }
    );
  }
}
