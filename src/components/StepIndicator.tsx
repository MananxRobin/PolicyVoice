"use client";

import { AppStep } from "@/lib/types";
import { Check, FileText, MessageSquare, PenLine, Upload } from "lucide-react";

const steps: { key: AppStep; label: string; icon: React.ElementType }[] = [
  { key: "select", label: "Select NPRM", icon: FileText },
  { key: "review", label: "Review", icon: Upload },
  { key: "interview", label: "Interview", icon: MessageSquare },
  { key: "draft", label: "Draft Comment", icon: PenLine },
  { key: "submit", label: "Submit", icon: Check },
];

interface StepIndicatorProps {
  currentStep: AppStep;
  completedSteps: AppStep[];
  onStepClick?: (step: AppStep) => void;
}

export default function StepIndicator({
  currentStep,
  completedSteps,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <nav className="w-full mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.key);
          const isCurrent = currentStep === step.key;
          const isClickable =
            isCompleted && onStepClick && step.key !== currentStep;

          return (
            <li key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => isClickable && onStepClick?.(step.key)}
                  disabled={!isClickable}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-300 text-sm font-medium
                    ${
                      isCurrent
                        ? "bg-navy-800 text-white shadow-lg shadow-navy-800/30 scale-110 ring-2 ring-navy-500/50"
                        : isCompleted
                        ? "bg-emerald-500 text-white cursor-pointer hover:bg-emerald-600"
                        : "bg-slate-200 text-slate-400"
                    }
                    ${isClickable ? "" : "cursor-default"}
                  `}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </button>
                <span
                  className={`mt-2 text-xs font-medium hidden sm:block ${
                    isCurrent
                      ? "text-navy-800"
                      : isCompleted
                      ? "text-emerald-600"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 mt-[-20px] ${
                    isCompleted ? "bg-emerald-400" : "bg-slate-200"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
