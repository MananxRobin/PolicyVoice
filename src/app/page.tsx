"use client";

import { useState } from "react";
import { AppStep, NprmDocument, NprmSection, UserAnswer } from "@/lib/types";
import StepIndicator from "@/components/StepIndicator";
import UploadStep from "@/components/UploadStep";
import ReviewStep from "@/components/ReviewStep";
import InterviewStep from "@/components/InterviewStep";
import DraftStep from "@/components/DraftStep";
import SubmitStep from "@/components/SubmitStep";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AppStep>("select");
  const [completedSteps, setCompletedSteps] = useState<AppStep[]>([]);
  const [selectedNprm, setSelectedNprm] = useState<NprmDocument | null>(null);
  const [selectedSection, setSelectedSection] = useState<NprmSection | null>(
    null
  );
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [draft, setDraft] = useState<string>("");

  const markComplete = (step: AppStep) => {
    setCompletedSteps((prev) =>
      prev.includes(step) ? prev : [...prev, step]
    );
  };

  const handleSelectNprm = (nprm: NprmDocument) => {
    setSelectedNprm(nprm);
    markComplete("select");
    setCurrentStep("review");
  };

  const handleSelectSection = (section: NprmSection) => {
    setSelectedSection(section);
    markComplete("review");
    setCurrentStep("interview");
  };

  const handleInterviewComplete = (userAnswers: UserAnswer[]) => {
    setAnswers(userAnswers);
    markComplete("interview");
    setCurrentStep("draft");
  };

  const handleDraftComplete = (draftBody: string) => {
    setDraft(draftBody);
    markComplete("draft");
    setCurrentStep("submit");
  };

  const handleReset = () => {
    setCurrentStep("select");
    setCompletedSteps([]);
    setSelectedNprm(null);
    setSelectedSection(null);
    setAnswers([]);
    setDraft("");
  };

  const handleStepClick = (step: AppStep) => {
    if (completedSteps.includes(step)) {
      setCurrentStep(step);
    }
  };

  return (
    <div>
      <StepIndicator
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      {currentStep === "select" && (
        <UploadStep onSelect={handleSelectNprm} />
      )}

      {currentStep === "review" && selectedNprm && (
        <ReviewStep
          nprm={selectedNprm}
          onSelectSection={handleSelectSection}
        />
      )}

      {currentStep === "interview" && selectedNprm && selectedSection && (
        <InterviewStep
          nprm={selectedNprm}
          section={selectedSection}
          onComplete={handleInterviewComplete}
          onBack={() => setCurrentStep("review")}
        />
      )}

      {currentStep === "draft" &&
        selectedNprm &&
        selectedSection &&
        answers.length > 0 && (
          <DraftStep
            nprm={selectedNprm}
            section={selectedSection}
            answers={answers}
            onProceed={handleDraftComplete}
            onBack={() => setCurrentStep("interview")}
          />
        )}

      {currentStep === "submit" && selectedNprm && draft && (
        <SubmitStep
          nprm={selectedNprm}
          draft={draft}
          onBack={() => setCurrentStep("draft")}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
