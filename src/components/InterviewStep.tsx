"use client";

import { NprmDocument, NprmSection, UserAnswer } from "@/lib/types";
import { ArrowRight, Loader2, MessageSquare, Send, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface InterviewStepProps {
  nprm: NprmDocument;
  section: NprmSection;
  onComplete: (answers: UserAnswer[]) => void;
  onBack: () => void;
}

export default function InterviewStep({
  nprm,
  section,
  onComplete,
  onBack,
}: InterviewStepProps) {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/generate-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nprmId: nprm.id }),
        });
        if (!res.ok) throw new Error("Failed to generate questions");
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load questions");
      } finally {
        setIsLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, [nprm.id]);

  useEffect(() => {
    if (!isLoadingQuestions && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentQuestionIndex, isLoadingQuestions]);

  const handleNext = () => {
    if (!currentInput.trim()) return;

    const newAnswer: UserAnswer = {
      questionId: `q${currentQuestionIndex}`,
      question: questions[currentQuestionIndex],
      answer: currentInput.trim(),
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setCurrentInput("");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    } else {
      onComplete(updatedAnswers);
    }
  };

  const handleSkip = () => {
    const newAnswer: UserAnswer = {
      questionId: `q${currentQuestionIndex}`,
      question: questions[currentQuestionIndex],
      answer: "[No response provided]",
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setCurrentInput("");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    } else {
      onComplete(updatedAnswers);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  if (isLoadingQuestions) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-navy-600 animate-spin mb-4" />
        <p className="text-slate-600 text-sm">
          Generating personalized interview questions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={onBack}
          className="text-navy-600 underline text-sm"
        >
          Go back and try a different NPRM
        </button>
      </div>
    );
  }

  const progress =
    questions.length > 0
      ? Math.round((answers.length / questions.length) * 100)
      : 0;

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <Sparkles className="w-10 h-10 text-navy-600 mx-auto mb-2" />
        <h2 className="text-xl font-bold text-navy-800 mb-1">
          Tell Us Your Perspective
        </h2>
        <p className="text-sm text-slate-500">
          Answer the questions below. Your unique experience is what makes a
          comment &ldquo;significant&rdquo; — the agency is legally required to
          respond.
        </p>
      </div>

      <div className="bg-slate-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2 text-xs text-slate-500">
          <span>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span>{progress}% complete</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <div
            className="bg-navy-600 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {answers.map((a: UserAnswer, index: number) => (
          <div key={index} className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 opacity-70">
            <p className="text-xs font-semibold text-emerald-700 mb-1">
              Q{index + 1}: {a.question}
            </p>
            <p className="text-sm text-emerald-900">{a.answer}</p>
          </div>
        ))}

        {currentQuestionIndex < questions.length && (
          <div className="bg-white border-2 border-navy-200 rounded-lg p-5 shadow-sm animate-slide-up">
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-navy-600" />
              </div>
              <p className="font-medium text-navy-800">
                {questions[currentQuestionIndex]}
              </p>
            </div>

            <textarea
              ref={inputRef}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share your experience, concerns, or expertise here... The more specific, the better."
              rows={4}
              className="w-full border border-slate-200 rounded-lg p-3 text-sm
                focus:ring-2 focus:ring-navy-400 focus:border-navy-400 outline-none
                resize-none transition-all placeholder:text-slate-400"
            />

            <div className="flex justify-between items-center mt-3">
              <button
                onClick={handleSkip}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                Skip this question
              </button>
              <button
                onClick={handleNext}
                disabled={!currentInput.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-navy-800 text-white rounded-lg
                  font-medium text-sm hover:bg-navy-700 transition-colors
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {currentQuestionIndex < questions.length - 1
                  ? "Next"
                  : "Generate Draft"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <p className="text-xs text-blue-700 leading-relaxed">
          <strong>Pro tip:</strong> Focus on your direct experience and specific
          facts. Comments that introduce new information, data, or unique
          perspectives are considered &ldquo;significant&rdquo; under the APA
          and carry more weight than general opinions. Think: &ldquo;In my
          community of 5,000 people in rural Montana, our water tests showed...&rdquo;
        </p>
      </div>
    </div>
  );
}
