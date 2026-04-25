import { NextRequest, NextResponse } from "next/server";
import { searchDockets, DocketSearchResult } from "@/lib/regulations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body as { query: string };

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Search query must be at least 2 characters" },
        { status: 400 }
      );
    }

    const apiKey = process.env.REGULATIONS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "REGULATIONS_API_KEY not configured" },
        { status: 500 }
      );
    }

    const result = await searchDockets(query.trim(), apiKey, 10);

    const simplified = (result.data || []).map((d: DocketSearchResult) => ({
      id: d.id,
      title: d.attributes.title || "Untitled",
      agency: d.attributes.agencyId || "Unknown Agency",
      docketType: d.attributes.docketType || "Rulemaking",
      postedDate: d.attributes.postedDate,
      commentEndDate: d.attributes.commentEndDate,
      commentsReceived: d.attributes.numberOfComments || d.attributes.commentsReceived || 0,
    }));

    return NextResponse.json({ results: simplified, total: simplified.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Docket search error:", message);
    return NextResponse.json(
      { error: "Failed to search dockets", details: message },
      { status: 500 }
    );
  }
}
