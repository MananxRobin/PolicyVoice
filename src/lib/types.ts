export interface NprmSection {
  id: string;
  title: string;
  content: string;
  pageRef: string;
  keyProposal: string;
  agencyReasoning: string;
  questionsAsked: string[];
}

export interface NprmDocument {
  id: string;
  docketId: string;
  agency: string;
  title: string;
  summary: string;
  publishedDate: string;
  commentDeadline: string;
  url: string;
  sections: NprmSection[];
  keyTopics: string[];
}

export interface UserAnswer {
  questionId: string;
  question: string;
  answer: string;
}

export interface InterviewSession {
  nprmId: string;
  userId: string;
  answers: UserAnswer[];
  relevantSections: string[];
}

export interface CommentDraft {
  title: string;
  body: string;
  citations: string[];
  metadata: {
    docketId: string;
    agency: string;
    submitterName: string;
    submitterEmail: string;
    dateGenerated: string;
  };
}

export type AppStep =
  | "select"
  | "review"
  | "interview"
  | "draft"
  | "submit";

export interface LLMConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}
