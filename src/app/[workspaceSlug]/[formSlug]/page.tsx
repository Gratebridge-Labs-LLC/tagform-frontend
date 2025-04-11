"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useParams } from "next/navigation";
import { 
  ArrowRightIcon, 
  CheckCircleIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  ClockIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  MapPinIcon,
  ChevronDownIcon,
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  DocumentTextIcon as LongTextIcon,
  ListBulletIcon,
  CheckIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useToast } from "@/contexts/toast-context";

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
  const { showToast } = useToast();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

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

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail && validateEmail(savedEmail)) {
      setEmail(savedEmail);
    }
  }, []);

  const startSubmission = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/${form?.id}/submissions/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email
        })
      });
      
      const data = await response.json();

      console.log(data);
      
      if (response.ok) {
        if(data?.error){
          showToast({
            title: "Error",
            message: data.message,
            type: "error"
          });
        } else {
          setSubmissionId(data.id);
          setStartTime(Date.now());
          setCurrentStep("form");
        }
      } else {
        // if (data.error && data.submission?.completedAt) {
        //   const completedDate = new Date(data.submission.completedAt).toLocaleString();
        //   showToast({
        //     title: "Form Already Submitted",
        //     message: `You have already completed this form on ${completedDate}`,
        //     type: "error"
        //   });
        //   return;
        // }
        // throw new Error(data.message || "Failed to start submission");
      }
    } catch (error) {
      showToast({
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to start submission",
        type: "error"
      });
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

    setIsSubmittingForm(true);
    try {
      const formattedResponses = Object.entries(responses).map(([questionId, data]) => ({
        questionId,
        data
      }));

      const completionTime = Math.floor((Date.now() - startTime) / 1000);

      const response = await fetch(`${BASE_URL}/api/${form.id}/submissions/${submissionId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responses: formattedResponses,
          completionTime
        })
      });

      if (response.ok) {
        showToast({
          title: "Success",
          message: "Your form has been submitted successfully!",
          type: "success"
        });
        setCurrentStep("ending");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit form");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      showToast({
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to submit form",
        type: "error"
      });
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const renderQuestion = (question: Question) => {
    const commonInputClasses = "w-full px-4 py-3 text-base text-black border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 font-[family-name:var(--font-nunito)] bg-white/80 backdrop-blur-sm";
    const commonLabelClasses = "flex items-center gap-2 text-sm text-gray-600 mb-2 font-[family-name:var(--font-nunito)]";
    const commonIconClasses = "w-4 h-4";

    switch (question.type) {
      case "contact-info":
        return (
          <div className="space-y-4">
            <div>
              <label className={commonLabelClasses}>
                <UserIcon className={commonIconClasses} />
                Full Name
              </label>
              <input
                type="text"
                value={responses[question.id]?.name || ""}
                onChange={(e) => handleResponse(question.id, { ...responses[question.id], name: e.target.value })}
                className={commonInputClasses}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className={commonLabelClasses}>
                <EnvelopeIcon className={commonIconClasses} />
                Email
              </label>
              <input
                type="email"
                value={responses[question.id]?.email || localStorage.getItem("userEmail") || ""}
                onChange={(e) => handleResponse(question.id, { ...responses[question.id], email: e.target.value })}
                className={commonInputClasses}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className={commonLabelClasses}>
                <PhoneIcon className={commonIconClasses} />
                Phone
              </label>
              <input
                type="tel"
                value={responses[question.id]?.phone || ""}
                onChange={(e) => handleResponse(question.id, { ...responses[question.id], phone: e.target.value })}
                className={commonInputClasses}
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className={commonLabelClasses}>
                <MapPinIcon className={commonIconClasses} />
                Address
              </label>
              <textarea
                value={responses[question.id]?.address || ""}
                onChange={(e) => handleResponse(question.id, { ...responses[question.id], address: e.target.value })}
                className={`${commonInputClasses} min-h-[80px] resize-none`}
                placeholder="Enter your address"
              />
            </div>
          </div>
        );

      case "email":
        return (
          <div>
            <label className={commonLabelClasses}>
              <EnvelopeIcon className={commonIconClasses} />
              Email Address
            </label>
            <input
              type="email"
              value={responses[question.id] || localStorage.getItem("userEmail") || ""}
              onChange={(e) => handleResponse(question.id, e.target.value)}
              className={commonInputClasses}
              placeholder="Enter your email address"
            />
          </div>
        );

      case "phone":
        return (
          <div>
            <label className={commonLabelClasses}>
              <PhoneIcon className={commonIconClasses} />
              Phone Number
            </label>
            <input
              type="tel"
              value={responses[question.id] || ""}
              onChange={(e) => handleResponse(question.id, e.target.value)}
              className={commonInputClasses}
              placeholder="Enter your phone number"
            />
          </div>
        );

      case "website":
        return (
          <div>
            <label className={commonLabelClasses}>
              <GlobeAltIcon className={commonIconClasses} />
              Website URL
            </label>
            <input
              type="url"
              value={responses[question.id] || ""}
              onChange={(e) => handleResponse(question.id, e.target.value)}
              className={commonInputClasses}
              placeholder="Enter website URL"
            />
          </div>
        );

      case "short-text":
        return (
          <div>
            <label className={commonLabelClasses}>
              <ChatBubbleBottomCenterTextIcon className={commonIconClasses} />
              Short Answer
            </label>
            <input
              type="text"
              value={responses[question.id] || ""}
              onChange={(e) => handleResponse(question.id, e.target.value)}
              className={commonInputClasses}
              placeholder="Type your answer here..."
            />
          </div>
        );

      case "long-text":
        return (
          <div>
            <label className={commonLabelClasses}>
              <LongTextIcon className={commonIconClasses} />
              Long Answer
            </label>
            <textarea
              value={responses[question.id] || ""}
              onChange={(e) => handleResponse(question.id, e.target.value)}
              className={`${commonInputClasses} min-h-[120px] resize-none`}
              placeholder="Type your answer here..."
            />
          </div>
        );

      case "multiple-choice":
        return (
          <div>
            <label className={commonLabelClasses}>
              <ListBulletIcon className={commonIconClasses} />
              Select One Option
            </label>
            <div className="space-y-2">
              {question.choices?.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleResponse(question.id, choice.id)}
                  className={`w-full px-4 py-3 text-left text-base border rounded-lg transition-colors ${
                    responses[question.id] === choice.id
                      ? "border-black bg-black/5 text-black"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  } font-[family-name:var(--font-nunito)]`}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        );

      case "dropdown":
        return (
          <div>
            <label className={commonLabelClasses}>
              <ChevronDownIcon className={commonIconClasses} />
              Select an Option
            </label>
            <select
              value={responses[question.id] || ""}
              onChange={(e) => handleResponse(question.id, e.target.value)}
              className={`${commonInputClasses} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"%3E%3Cpath stroke="%236B7280" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 8l4 4 4-4"/%3E%3C/svg%3E')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.5em_1.5em] pr-10`}
            >
              <option value="" disabled>Select an option</option>
              {question.choices?.map((choice) => (
                <option key={choice.id} value={choice.id}>
                  {choice.text}
                </option>
              ))}
            </select>
          </div>
        );

      case "yes-no":
        return (
          <div>
            <label className={commonLabelClasses}>
              <CheckIcon className={commonIconClasses} />
              Yes/No Question
            </label>
            <div className="flex gap-3">
              {["Yes", "No"].map((option) => (
                <button
                  key={option}
                  onClick={() => handleResponse(question.id, option)}
                  className={`flex-1 px-4 py-3 text-base border rounded-lg transition-colors ${
                    responses[question.id] === option
                      ? "border-black bg-black/5 text-black"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  } font-[family-name:var(--font-nunito)]`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case "checkbox":
        return (
          <div>
            <label className={commonLabelClasses}>
              <CheckIcon className={commonIconClasses} />
              Select Multiple Options
            </label>
            <div className="space-y-2">
              {question.choices?.map((choice) => {
                const isSelected = (responses[question.id] || []).includes(choice.id);
                return (
                  <button
                    key={choice.id}
                    onClick={() => {
                      const currentSelections = responses[question.id] || [];
                      const newSelections = isSelected
                        ? currentSelections.filter((id: string) => id !== choice.id)
                        : [...currentSelections, choice.id];
                      handleResponse(question.id, newSelections);
                    }}
                    className={`w-full px-4 py-3 text-left text-base border rounded-lg transition-colors flex items-center gap-3 ${
                      isSelected
                        ? "border-black bg-black/5 text-black"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    } font-[family-name:var(--font-nunito)]`}
                  >
                    <div className={`w-5 h-5 border rounded flex items-center justify-center ${
                      isSelected ? "border-black bg-black text-white" : "border-gray-300"
                    }`}>
                      {isSelected && <CheckIcon className="w-3 h-3" />}
                    </div>
                    {choice.text}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "date":
        return (
          <div>
            <label className={commonLabelClasses}>
              <CalendarIcon className={commonIconClasses} />
              Select Date
            </label>
            <input
              type="date"
              value={responses[question.id] || ""}
              onChange={(e) => handleResponse(question.id, e.target.value)}
              className={commonInputClasses}
            />
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
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    }
    setShowEmailInput(true);
  };

  const handleEmailSubmit = async () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    setIsSubmitting(true);
    try {
      localStorage.setItem("userEmail", email);
      await startSubmission();
    } catch (error) {
      showToast({
        title: "Error",
        message: "Failed to start form submission. Please try again.",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError("");
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
    <div className="h-screen w-full fixed inset-0 bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-6 overflow-hidden">
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
        className="relative w-full max-w-6xl h-[90vh] bg-white/30 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/40"
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Glass Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30 pointer-events-none" />

        <div className="relative w-full h-full flex">
          {/* Content Area with Scroll */}
          <div className="w-full h-full flex items-start justify-center p-12 overflow-y-auto">
            <div className="w-full max-w-lg">
              <AnimatePresence mode="wait">
                {currentStep === "landing" && (
                  <motion.div
                    key="landing"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full"
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
                              onChange={handleEmailChange}
                              placeholder="Enter your email"
                              className="w-full px-4 py-3 text-base text-black border border-white/40 rounded-lg focus:outline-none focus:border-white/60 font-[family-name:var(--font-nunito)] bg-white/20 backdrop-blur-xl"
                              onKeyDown={async (e) => {
                                if (e.key === 'Enter' && validateEmail(email) && !isSubmitting) {
                                  e.preventDefault();
                                  await handleEmailSubmit();
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
                            disabled={!validateEmail(email) || isSubmitting}
                            className={`inline-flex items-center justify-center gap-2 bg-gradient-to-r from-black/90 to-gray-800/90 text-white px-8 py-4 rounded-full text-base font-[family-name:var(--font-geist-mono)] transition-all duration-300 shadow-lg hover:shadow-xl w-full backdrop-blur-sm ${
                              !validateEmail(email) || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-gray-800 hover:to-black'
                            }`}
                            whileHover={validateEmail(email) && !isSubmitting ? { scale: 1.02 } : {}}
                            whileTap={validateEmail(email) && !isSubmitting ? { scale: 0.98 } : {}}
                          >
                            {isSubmitting ? (
                              <div className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                              </div>
                            ) : (
                              <>
                                Continue
                                <ArrowRightIcon className="w-5 h-5" />
                              </>
                            )}
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
                    className="w-full"
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
                          className={`px-6 py-2 rounded-full text-sm font-[family-name:var(--font-geist-mono)] text-black ${
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
                          disabled={(!responses[form.questions[currentQuestionIndex].id] && form.questions[currentQuestionIndex].is_required) || isSubmittingForm}
                          className={`px-6 py-3 rounded-full text-sm font-[family-name:var(--font-geist-mono)] ${
                            !responses[form.questions[currentQuestionIndex].id] && form.questions[currentQuestionIndex].is_required
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-black text-white hover:bg-gray-900"
                          } flex items-center gap-2 min-w-[100px] justify-center`}
                        >
                          {isSubmittingForm && currentQuestionIndex === form.questions.length - 1 ? (
                            <>
                              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Submitting...
                            </>
                          ) : (
                            currentQuestionIndex === form.questions.length - 1 ? "Submit" : "Next"
                          )}
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
                    className="w-full text-center"
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
    </div>
  );
} 