import { NextRequest, NextResponse } from "next/server";
import { submitComment, buildCommentBody, getDocketInfo } from "@/lib/regulations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { docketId, commentText, submitterName, submitterEmail, submitterOrg } =
      body as {
        docketId: string;
        commentText: string;
        submitterName: string;
        submitterEmail: string;
        submitterOrg?: string;
      };

    if (!docketId || !commentText || !submitterName || !submitterEmail) {
      return NextResponse.json(
        {
          error:
            "docketId, commentText, submitterName, and submitterEmail are required",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.REGULATIONS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "REGULATIONS_API_KEY not configured on server" },
        { status: 500 }
      );
    }

    const formattedComment = buildCommentBody(
      commentText,
      submitterName,
      submitterEmail,
      submitterOrg || ""
    );

    // First verify the docket exists
    let docketInfo;
    try {
      docketInfo = await getDocketInfo(docketId, apiKey);
    } catch {
      // Docket lookup failed, but we'll try submission anyway
      docketInfo = null;
    }

    const result = await submitComment({
      docketId,
      comment: formattedComment,
      apiKey,
    });

    return NextResponse.json({
      success: true,
      submission: result,
      docketInfo: docketInfo || undefined,
      trackingNumber: result?.data?.id || null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Submit comment error:", message);
    return NextResponse.json(
      { error: "Failed to submit comment", details: message },
      { status: 500 }
    );
  }
}
