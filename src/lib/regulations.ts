export const REGULATIONS_API_URL = "https://api.regulations.gov/v4";

export async function submitComment({
  docketId,
  comment,
  apiKey,
}: {
  docketId: string;
  comment: string;
  apiKey: string;
}) {
  const response = await fetch(
    `${REGULATIONS_API_URL}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({
        data: {
          type: "comment",
          attributes: {
            comment: comment,
            commentOn: docketId,
          },
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Regulations.gov API error: ${response.status} ${error}`);
  }

  return response.json();
}

export async function getDocketInfo(docketId: string, apiKey: string) {
  const response = await fetch(
    `${REGULATIONS_API_URL}/dockets/${encodeURIComponent(docketId)}`,
    {
      headers: {
        "X-Api-Key": apiKey,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Regulations.gov API error: ${response.status} ${error}`);
  }

  return response.json();
}

export function buildCommentBody(
  draft: string,
  name: string,
  email: string,
  organization: string
): string {
  const header = [
    `Submitted to: ${organization || "Regulations.gov"}`,
    `Submitter: ${name}`,
    `Email: ${email}`,
    `Date: ${new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    "",
    "--- COMMENT ---",
    "",
  ].join("\n");

  return header + draft;
}
