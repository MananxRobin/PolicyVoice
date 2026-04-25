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

export interface DocketSearchResult {
  id: string;
  type: string;
  attributes: {
    agencyId: string;
    docketType: string;
    title: string;
    description?: string;
    postedDate: string;
    commentEndDate: string | null;
    commentsReceived: number;
    numberOfComments: number;
    documents?: unknown[];
  };
}

export interface DocketDocument {
  id: string;
  type: string;
  attributes: {
    agencyId: string;
    docketId: string;
    title: string;
    documentType: string;
    postedDate: string;
    commentEndDate: string | null;
    fileFormats?: { fileUrl: string; format: string }[];
    summary?: string;
  };
}

export async function searchDockets(
  searchTerm: string,
  apiKey: string,
  pageSize = 10
): Promise<{ data: DocketSearchResult[]; meta?: unknown }> {
  const params = new URLSearchParams({
    "filter[searchTerm]": searchTerm,
    "filter[docketType]": "Rulemaking",
    "sort": "-lastModifiedDate",
    "page[size]": String(pageSize),
  });

  const response = await fetch(
    `${REGULATIONS_API_URL}/dockets?${params.toString()}`,
    {
      headers: { "X-Api-Key": apiKey },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Regulations.gov API error: ${response.status} ${error}`);
  }

  return response.json();
}

export async function getDocketDocuments(
  docketId: string,
  apiKey: string,
  pageSize = 5
): Promise<{ data: DocketDocument[]; meta?: unknown }> {
  const params = new URLSearchParams({
    "filter[docketId]": docketId,
    "filter[documentType]": "Proposed Rule",
    "sort": "-lastModifiedDate",
    "page[size]": String(pageSize),
  });

  const response = await fetch(
    `${REGULATIONS_API_URL}/documents?${params.toString()}`,
    {
      headers: { "X-Api-Key": apiKey },
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
