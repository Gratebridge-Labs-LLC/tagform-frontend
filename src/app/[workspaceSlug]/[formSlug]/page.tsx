"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useParams } from "next/navigation";
import { ArrowRightIcon, CheckCircleIcon, DocumentTextIcon, ChartBarIcon, ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

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

const Particle = ({ index }: { index: number }) => {
  const x = useMotionValue(Math.random() * 100);
  const y = useMotionValue(Math.random() * 100);
  const scale = useTransform(y, [0, 100], [0.5, 1.5]);
  const opacity = useTransform(y, [0, 100], [0.2, 0.8]);

  useEffect(() => {
    const interval = setInterval(() => {
      x.set(Math.random() * 100);
      y.set(Math.random() * 100);
    }, 2000 + index * 200);

    return () => clearInterval(interval);
  }, [index, x, y]);

  return (
    <motion.div
      style={{
        x,
        y,
        scale,
        opacity,
        position: "absolute",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(2px)",
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.6, 0.8, 0.6],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.1,
      }}
    />
  );
};

export default function FormSubmission() {
  const params = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [currentStep, setCurrentStep] = useState<"landing" | "email" | "form" | "ending">("landing");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [startTime, setStartTime] = useState<number | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/${params.workspaceSlug}/${params.formSlug}`);
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
    console.log(form);
    try {
      const response = await fetch(`${BASE_URL}/api/${form?.id}/submissions/start`, {
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

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleStartClick = () => {
    setShowEmailInput(true);
  };

  const handleEmailSubmit = async () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    localStorage.setItem("userEmail", email);
    await startSubmission();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
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
    <div className="min-h-screen w-full relative bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-6">
      {/* Background Gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[#FF6B6B] via-[#A66CFF] to-[#4ECDC4] rounded-full opacity-30 blur-3xl transform translate-x-1/4 translate-y-1/4"
        />
        <div 
          className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-purple-400 to-pink-300 rounded-full opacity-20 blur-3xl transform -translate-x-1/4 -translate-y-1/4"
        />
      </div>

      {/* Main Container with Enhanced Glassmorphism */}
      <div 
        className="relative w-full max-w-6xl bg-white/30 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/40"
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Glass Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30 pointer-events-none" />

        <div className="relative w-full flex min-h-[800px]">
          {/* Content Area */}
          <div className="w-full flex items-center justify-center p-12 backdrop-blur-md">
            <AnimatePresence mode="wait">
              {currentStep === "landing" && (
                <motion.div
                  key="landing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="max-w-lg mx-auto w-full"
                >
                  <div className="text-left">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-16 h-16 bg-gradient-to-br from-purple-100/80 to-blue-100/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8"
                    >
                      <DocumentTextIcon className="w-8 h-8 text-purple-600" />
                    </motion.div>

                    <motion.h1
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-4xl sm:text-5xl font-medium text-gray-900 mb-4 font-[family-name:var(--font-nunito)]"
                    >
                      {form.settings.landing_page_title}
                    </motion.h1>

                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-lg text-gray-500 mb-8 font-[family-name:var(--font-nunito)]"
                    >
                      {form.settings.landing_page_description}
                    </motion.p>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex flex-col sm:flex-row gap-4 mb-8"
                    >
                      <div className="flex items-center gap-2 text-gray-500">
                        <ClockIcon className="w-5 h-5" />
                        <span className="text-sm font-[family-name:var(--font-geist-mono)]">2-3 minutes</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <ChartBarIcon className="w-5 h-5" />
                        <span className="text-sm font-[family-name:var(--font-geist-mono)]">{form.questions.length} questions</span>
                      </div>
                    </motion.div>

                    {!showEmailInput ? (
                      <motion.button
                        onClick={handleStartClick}
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-black/90 to-gray-800/90 text-white px-8 py-4 rounded-full text-base font-[family-name:var(--font-geist-mono)] hover:from-gray-800 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        {form.settings.landing_page_button_text}
                        <ArrowRightIcon className="w-5 h-5" />
                      </motion.button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 backdrop-blur-sm bg-white/40 p-6 rounded-2xl border border-white/40"
                      >
                        <label className="block text-sm font-medium text-gray-700 font-[family-name:var(--font-nunito)]">
                          Let's get your email
                        </label>
                        <div className="space-y-2">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setEmailError("");
                            }}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 text-base border border-white/40 rounded-lg focus:outline-none focus:border-white/60 font-[family-name:var(--font-nunito)] bg-white/20 backdrop-blur-xl"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleEmailSubmit();
                              }
                            }}
                          />
                          {emailError && (
                            <p className="text-red-500 text-sm font-[family-name:var(--font-nunito)]">
                              {emailError}
                            </p>
                          )}
                        </div>
                        <motion.button
                          onClick={handleEmailSubmit}
                          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-black/90 to-gray-800/90 text-white px-8 py-4 rounded-full text-base font-[family-name:var(--font-geist-mono)] hover:from-gray-800 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl w-full backdrop-blur-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Continue
                          <ArrowRightIcon className="w-5 h-5" />
                        </motion.button>
                      </motion.div>
                    )}

                    <motion.footer
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="mt-16"
                    >
                      <p className="text-sm text-gray-600 font-[family-name:var(--font-geist-mono)]">
                        Tagforms made beautifully by{" "}
                        <Link
                          href="https://www.gratebridgelabs.xyz/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-800 hover:text-black transition-colors"
                        >
                          Gratebridge Labs
                        </Link>
                      </p>
                    </motion.footer>
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
        </div>
      </div>
    </div>
  );
} 