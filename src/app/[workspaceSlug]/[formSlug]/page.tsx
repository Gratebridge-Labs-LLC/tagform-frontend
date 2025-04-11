"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { ArrowRightIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const BASE_URL = "http://localhost:8000";

interface Form {
  id: string;
  name: string;
  description: string;
  workspace_id: string;
  slug: string;
  questions: Question[];
  settings: FormSettings;
}

interface Question {
  id: string;
  type: string;
  text: string;
  description?: string;
  is_required: boolean;
  order: number;
  choices?: Choice[];
}

interface Choice {
  id: string;
  text: string;
  order: number;
}

interface FormSettings {
  landing_page_title: string;
  landing_page_description: string;
  landing_page_button_text: string;
  show_progress_bar: boolean;
  ending_page_title: string;
  ending_page_description: string;
  ending_page_button_text: string;
}

interface FormResponse {
  questionId: string;
  data: any;
}

export default function FormSubmission() {
  const params = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [currentStep, setCurrentStep] = useState<"landing" | "form" | "ending">("landing");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [startTime, setStartTime] = useState<number | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/forms/${params.workspaceSlug}/${params.formSlug}`);
        const data = await response.json();
        
        if (response.ok) {
          setForm(data);
        } else {
          setError("Form not found");
        }
      } catch (error) {
        setError("Failed to load form");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [params.workspaceSlug, params.formSlug]);

  const startSubmission = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/forms/${form?.id}/submissions/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubmissionId(data.id);
        setStartTime(Date.now());
        setCurrentStep("form");
      } else {
        setError("Failed to start submission");
      }
    } catch (error) {
      setError("Failed to start submission");
    }
  };

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const submitForm = async () => {
    if (!submissionId || !startTime || !form) return;

    try {
      const formattedResponses = Object.entries(responses).map(([questionId, data]) => ({
        questionId,
        data
      }));

      const completionTime = Math.floor((Date.now() - startTime) / 1000);

      await fetch(`${BASE_URL}/api/forms/${form.id}/submissions/${submissionId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responses: formattedResponses,
          completionTime
        })
      });

      setCurrentStep("ending");
    } catch (error) {
      setError("Failed to submit form");
    }
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case "short-text":
        return (
          <input
            type="text"
            value={responses[question.id] || ""}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 font-[family-name:var(--font-nunito)]"
            placeholder="Type your answer here..."
          />
        );
      case "long-text":
        return (
          <textarea
            value={responses[question.id] || ""}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 font-[family-name:var(--font-nunito)] min-h-[120px] resize-none"
            placeholder="Type your answer here..."
          />
        );
      case "multiple-choice":
        return (
          <div className="space-y-2">
            {question.choices?.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleResponse(question.id, choice.id)}
                className={`w-full px-4 py-3 text-left text-base border rounded-lg transition-colors ${
                  responses[question.id] === choice.id
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                } font-[family-name:var(--font-nunito)]`}
              >
                {choice.text}
              </button>
            ))}
          </div>
        );
      case "yes-no":
        return (
          <div className="flex gap-3">
            {["Yes", "No"].map((option) => (
              <button
                key={option}
                onClick={() => handleResponse(question.id, option)}
                className={`flex-1 px-4 py-3 text-base border rounded-lg transition-colors ${
                  responses[question.id] === option
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                } font-[family-name:var(--font-nunito)]`}
              >
                {option}
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-gray-900 mb-2 font-[family-name:var(--font-nunito)]">
            {error}
          </h1>
          <p className="text-gray-500 font-[family-name:var(--font-nunito)]">
            Please check the URL and try again
          </p>
        </div>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {currentStep === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto px-4 py-16 sm:px-6 sm:py-24"
          >
            <div className="text-center">
              <h1 className="text-4xl font-medium text-gray-900 mb-4 font-[family-name:var(--font-nunito)]">
                {form.settings.landing_page_title}
              </h1>
              <p className="text-lg text-gray-500 mb-8 font-[family-name:var(--font-nunito)]">
                {form.settings.landing_page_description}
              </p>
              <motion.button
                onClick={startSubmission}
                className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full text-base font-[family-name:var(--font-geist-mono)] hover:bg-gray-900 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {form.settings.landing_page_button_text}
                <ArrowRightIcon className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {currentStep === "form" && form.questions[currentQuestionIndex] && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto px-4 py-16 sm:px-6 sm:py-24"
          >
            {form.settings.show_progress_bar && (
              <div className="mb-8">
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black transition-all duration-300 ease-out"
                    style={{
                      width: `${((currentQuestionIndex + 1) / form.questions.length) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2 font-[family-name:var(--font-nunito)]">
                  Question {currentQuestionIndex + 1} of {form.questions.length}
                </p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-2 font-[family-name:var(--font-nunito)]">
                  {form.questions[currentQuestionIndex].text}
                </h2>
                {form.questions[currentQuestionIndex].description && (
                  <p className="text-gray-500 font-[family-name:var(--font-nunito)]">
                    {form.questions[currentQuestionIndex].description}
                  </p>
                )}
              </div>

              {renderQuestion(form.questions[currentQuestionIndex])}

              <div className="flex justify-between pt-6">
                <button
                  onClick={() => setCurrentQuestionIndex(i => i - 1)}
                  disabled={currentQuestionIndex === 0}
                  className={`px-6 py-2 rounded-full text-sm font-[family-name:var(--font-geist-mono)] ${
                    currentQuestionIndex === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (currentQuestionIndex === form.questions.length - 1) {
                      submitForm();
                    } else {
                      setCurrentQuestionIndex(i => i + 1);
                    }
                  }}
                  disabled={!responses[form.questions[currentQuestionIndex].id] && form.questions[currentQuestionIndex].is_required}
                  className={`px-6 py-2 rounded-full text-sm font-[family-name:var(--font-geist-mono)] ${
                    !responses[form.questions[currentQuestionIndex].id] && form.questions[currentQuestionIndex].is_required
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-900"
                  }`}
                >
                  {currentQuestionIndex === form.questions.length - 1 ? "Submit" : "Next"}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === "ending" && (
          <motion.div
            key="ending"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto px-4 py-16 sm:px-6 sm:py-24 text-center"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-4xl font-medium text-gray-900 mb-4 font-[family-name:var(--font-nunito)]">
              {form.settings.ending_page_title}
            </h1>
            <p className="text-lg text-gray-500 mb-8 font-[family-name:var(--font-nunito)]">
              {form.settings.ending_page_description}
            </p>
            <motion.button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full text-base font-[family-name:var(--font-geist-mono)] hover:bg-gray-900 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {form.settings.ending_page_button_text}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 