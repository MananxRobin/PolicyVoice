import OpenAI from "openai";

let client: OpenAI | null = null;

export function getLLMClient(): OpenAI {
  if (client) return client;

  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Please set it in .env.local"
    );
  }

  client = new OpenAI({
    apiKey,
    baseURL,
  });
  return client;
}

export function getLLMModel(): string {
  return process.env.OPENAI_MODEL || "gpt-4o";
}

interface GenerateQuestionsParams {
  nprmSummary: string;
  sections: { title: string; questionsAsked: string[] }[];
}

export async function generateInterviewQuestions(
  params: GenerateQuestionsParams
): Promise<string[]> {
  const openai = getLLMClient();
  const model = getLLMModel();

  const prompt = `You are an expert in federal regulatory procedure and public comment drafting under the Administrative Procedure Act (APA). You help citizens draft effective, substantive comments on proposed federal rules.

Below is a Notice of Proposed Rulemaking (NPRM). Your task is to generate 4-5 concise, targeted interview questions that will draw out the commenter's unique personal experience, professional expertise, or community perspective. The goal is to surface information that makes the comment "significant" under the APA — meaning the agency is legally required to address it.

The questions should:
1. Ask about the person's direct experience with the subject matter
2. Probe for specific, concrete examples rather than general opinions
3. Help the person articulate unique information the agency wouldn't otherwise have
4. Be conversational and easy to understand (no legal jargon)
5. Each question should be 1-2 sentences maximum

NPRM SUMMARY:
${params.nprmSummary}

AGENCY QUESTIONS FROM THE NPRM:
${params.sections.map(
  (s: { title: string; questionsAsked: string[] }, i: number) => `Section ${i + 1} - ${s.title}:\n${s.questionsAsked.map((q: string) => `  • ${q}`).join("\n")}`
).join("\n\n")}

Return a JSON array of strings, each being one interview question. Format: ["question 1", "question 2", "question 3", "question 4", "question 5"]`;

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: "You are a helpful assistant that outputs only valid JSON arrays." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  const content = response.choices[0]?.message?.content || "[]";
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    const match = content.match(/\[([\s\S]*?)\]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return [];
      }
    }
    return [];
  }
}

interface DraftCommentParams {
  nprmSection: {
    title: string;
    content: string;
    keyProposal: string;
    agencyReasoning: string;
    questionsAsked: string[];
    pageRef: string;
  };
  answers: { question: string; answer: string }[];
  docketId: string;
  agency: string;
}

export async function draftComment(
  params: DraftCommentParams
): Promise<{ body: string; citations: string[] }> {
  const openai = getLLMClient();
  const model = getLLMModel();

  const prompt = `You are an expert in drafting public comments for federal rulemaking under the Administrative Procedure Act. You write substantive, well-organized, and persuasive comments that agencies are legally required to address.

Draft a formal public comment for submission to ${params.agency} regarding the following Notice of Proposed Rulemaking.

DOCKET ID: ${params.docketId}

NPRM SECTION:
Title: ${params.nprmSection.title}
The Agency Proposes: ${params.nprmSection.keyProposal}
Agency Reasoning: ${params.nprmSection.agencyReasoning}
Page Reference: ${params.nprmSection.pageRef}

QUESTIONS THE AGENCY IS ASKING:
${params.nprmSection.questionsAsked.map((q: string) => `• ${q}`).join("\n")}

COMMENTER'S ANSWERS TO INTERVIEW QUESTIONS:
${params.answers.map((a, i) => `Q${i + 1}: ${a.question}\nAnswer: ${a.answer}`).join("\n\n")}

IMPORTANT GUIDELINES:
1. Write in a professional but accessible tone. The commenter is an individual citizen, not a lawyer.
2. Reference the docket ID and the specific section/page numbers where appropriate.
3. Directly address the agency's questions and reasoning.
4. Incorporate the commenter's personal experience as specific evidence.
5. Include a clear statement of what action the commenter supports or opposes, and why.
6. Keep it under 500 words (agencies prefer concise comments).
7. End with the commenter's contact information placeholder: [Your Name] and [Your Email].
8. Use proper paragraph breaks and formatting for readability.

Return a JSON object with:
- "body": The full comment text
- "citations": An array of any statutes, studies, or NPRM sections cited in the comment

Format: {"body": "comment text here...", "citations": ["citation1", "citation2"]}`;

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: "You are a legal drafting assistant that outputs only valid JSON." },
      { role: "user", content: prompt },
    ],
    temperature: 0.6,
    max_tokens: 3000,
  });

  const content = response.choices[0]?.message?.content || "{}";
  try {
    const parsed = JSON.parse(content);
    return {
      body: parsed.body || "Error generating comment.",
      citations: parsed.citations || [],
    };
  } catch {
    const bodyMatch = content.match(/"body"\s*:\s*"([\s\S]*?)(?:"\s*,\s*"citations|"\s*})/);
    const body = bodyMatch ? bodyMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n') : content;
    return { body, citations: [] };
  }
}

export async function generateNprmSummary(nprmText: string): Promise<{
  summary: string;
  keyProposals: string[];
  agencyQuestions: string[];
  sections: { title: string; keyProposal: string; questions: string[] }[];
}> {
  const openai = getLLMClient();
  const model = getLLMModel();

  const prompt = `You are an expert at analyzing federal regulatory documents. Given the text from a Notice of Proposed Rulemaking (NPRM), extract and structure the key information.

Extract:
1. A 2-3 sentence plain-English summary of what the rule would do and why it matters to everyday people
2. The 3-5 key proposals the agency is making
3. Any specific questions the agency is asking commenters to address
4. The logical sections of the NPRM with:
   - Section title
   - What the agency is proposing in that section
   - Questions the agency asks in that section

NPRM TEXT:
${nprmText.slice(0, 30000)}

Return a JSON object:
{
  "summary": "plain English summary...",
  "keyProposals": ["proposal 1", "proposal 2", ...],
  "agencyQuestions": ["question 1", "question 2", ...],
  "sections": [
    {
      "title": "Section title",
      "keyProposal": "What the agency is proposing here",
      "questions": ["question 1", "question 2"]
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: "You are a document analysis assistant. Output only valid JSON." },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
    max_tokens: 4000,
  });

  const content = response.choices[0]?.message?.content || "{}";
  try {
    return JSON.parse(content);
  } catch {
    return {
      summary: "Could not parse NPRM content automatically.",
      keyProposals: [],
      agencyQuestions: [],
      sections: [],
    };
  }
}
