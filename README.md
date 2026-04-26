# PolicyVoice — Regulations.gov Public Comment Drafter

**Turn every American into a de facto lobbyist.** Federal agencies are legally required to read and respond to substantive public comments under the Administrative Procedure Act. PolicyVoice ingests Notices of Proposed Rulemaking (NPRMs), interviews you about your situation, and drafts a formatted, citation-backed public comment — then submits it directly to Regulations.gov on your behalf.

---

## Why This Matters

> *"Most Americans think voting is their only power. Here's the power they actually have that nobody uses."*

Under the Administrative Procedure Act (5 U.S.C. § 553), agencies must:
1. Publish proposed rules and accept public comments
2. Address every "significant" comment in the final rule
3. Explain their reasoning when they disagree

A well-crafted comment from an ordinary citizen carries **the same legal weight** as one from a K Street lobbyist. The barrier has always been knowing how to write one.

PolicyVoice removes that barrier.

---

## Features

- **3 pre-loaded NPRMs** (EPA PFAS, FCC Broadband Data Caps, HHS Telehealth) with real agency text, key proposals, reasonings, and questions
- **Real-time regulations.gov docket search** — Search by keyword and select any active rulemaking. AI auto-analyzes the docket into structured sections.
- **Plain Language Mode** — Toggle to translate government jargon to 8th-grade reading level. Side-by-side with original text.
- **Comment Effectiveness Score** — AI rates your draft 1-10 with breakdowns for specificity, evidence, relevance, and persuasiveness. Low score? AI tells you exactly what to improve.
- **AI-powered interview** — generates personalized questions based on the NPRM to surface your unique experience and expertise
- **APA-compliant comment drafting** — produces a formatted, cited comment the agency must legally address
- **Direct submission** via the Regulations.gov API (tracking number returned on success)
- **Copy, download, and in-place editing** of generated drafts
- **"Why This Matters" Impact Stories** — 4 real examples of public comments that changed federal rules (Net Neutrality, Airline Refunds, Waters of the US, Fluoride)
- **Step-by-step wizard** with visual progress indicator

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| AI/LLM | OpenAI-compatible API (OpenRouter, OpenAI, Together, Groq, etc.) |
| Regulations API | [Regulations.gov v4 API](https://open.gsa.gov/api/regulationsgov/) |
| Icons | Lucide React |

---

## Quick Start

```bash
# Clone
git clone https://github.com/MananxRobin/PolicyVoice.git
cd PolicyVoice

# Install
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys (see below)

# Run
npm run dev
# Open http://localhost:3000
```

---

## Environment Variables

Create a `.env.local` file:

```env
# LLM Provider (OpenAI-compatible)
OPENAI_API_KEY=sk-or-v1-...
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_MODEL=google/gemini-2.5-pro-preview-05-06

# Regulations.gov API (get yours at https://open.gsa.gov/api/regulationsgov/)
REGULATIONS_API_KEY=your-key-here
```

Supported LLM providers: OpenAI, OpenRouter, Together AI, Groq, or any OpenAI-compatible endpoint.

---

## How It Works

```
1. SELECT NPRM  →  Choose a pre-loaded rule, search regulations.gov for any active docket, or upload your own PDF
2. REVIEW       →  Explore sections, agency proposals, and questions — toggle Plain Language Mode for easy reading
3. INTERVIEW    →  AI asks 4-5 targeted questions about your experience
4. DRAFT        →  AI writes a formatted comment with citations. Score its effectiveness 1-10 and get improvement tips
5. SUBMIT       →  Send directly to Regulations.gov or copy for manual submission
```

### Sample NPRMs Included

| NPRM | Agency | Docket ID | Topics |
|------|--------|-----------|--------|
| PFAS Drinking Water Standards | EPA | EPA-HQ-OW-2024-0123 | Water safety, PFAS, environmental justice |
| Broadband Consumer Labels & Data Caps | FCC | FCC-2024-0001 | Internet access, consumer rights, digital divide |
| Telehealth Prescribing Flexibility | HHS | HHS-2024-0005 | Healthcare access, prescriptions, rural health |

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate-questions/   # AI interview question generation
│   │   ├── draft-comment/        # AI comment drafting with citations
│   │   ├── search-dockets/       # Real-time regulations.gov docket search
│   │   ├── process-docket/       # AI analyzes docket into structured NPRM
│   │   ├── plain-language/       # Translate government text to 8th-grade reading level
│   │   ├── score-comment/        # Rate comment effectiveness 1-10 with feedback
│   │   └── submit/               # Regulations.gov API submission
│   ├── layout.tsx                # Root layout with header/footer
│   ├── page.tsx                  # Main app with step state machine
│   └── globals.css               # Tailwind + custom styles
├── components/
│   ├── StepIndicator.tsx          # 5-step progress indicator
│   ├── UploadStep.tsx             # NPRM selection cards + live search + impact stories link
│   ├── DocketSearch.tsx           # Search bar with live regulations.gov results
│   ├── ReviewStep.tsx             # Section expander + Plain Language toggle
│   ├── InterviewStep.tsx          # Conversational Q&A with progress
│   ├── DraftStep.tsx              # Markdown comment viewer + Effectiveness Score card
│   ├── SubmitStep.tsx             # User info form + Regulations.gov submission
│   └── ImpactStories.tsx          # Modal with real civic impact stories
├── lib/
│   ├── types.ts                   # TypeScript interfaces
│   ├── llm.ts                     # LLM integration (questions, drafting, scoring, translation)
│   └── regulations.ts             # Regulations.gov API client (search, dockets, documents, submit)
└── data/
    ├── samples.ts                 # 3 structured NPRMs with real content
    └── impact-stories.ts          # 4 real examples of comments that changed federal rules
```

---

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/search-dockets` | POST | Search regulations.gov for active NPRMs by keyword |
| `/api/process-docket` | POST | AI analyzes a docket into structured NprmDocument |
| `/api/generate-questions` | POST | Generates personalized interview questions from NPRM |
| `/api/draft-comment` | POST | Drafts APA-compliant comment from user answers |
| `/api/score-comment` | POST | Rates comment effectiveness 1-10 with improvement tips |
| `/api/plain-language` | POST | Translates government text to 8th-grade reading level |
| `/api/submit` | POST | Submits comment via Regulations.gov API |

---

## Roadmap

- [x] Real-time regulations.gov docket search
- [x] Plain Language Mode for NPRM content
- [x] Comment Effectiveness Score with improvement feedback
- [x] Impact Stories — real examples of comments that changed policy
- [ ] PDF upload and OCR parsing for custom NPRMs
- [ ] Multi-section batch comments
- [ ] Comment history and tracking
- [ ] Collaborative commenting (organizations, community groups)
- [ ] Voice input for interview answers
- [ ] PWA support for offline draft review
- [ ] Accessibility audit (WCAG 2.1 AA)

---

## License

MIT — Built for civic empowerment.

---

**Built for hackathons. Ready for democracy.**
