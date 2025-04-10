"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import apiClient from "@/lib/api-client";
import {
  EllipsisHorizontalIcon,
  ChevronDownIcon,
  Squares2X2Icon,
  ListBulletIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronUpIcon,
  SwatchIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  PlayIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ShareIcon,
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  LinkIcon,
  PhotoIcon,
  CheckCircleIcon,
  ScaleIcon,
  Square2StackIcon,
  ChatBubbleBottomCenterTextIcon,
  DocumentTextIcon,
  HashtagIcon,
  CalendarIcon,
  CreditCardIcon,
  ArrowUpTrayIcon,
  StarIcon,
  QueueListIcon,
  TableCellsIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "@/contexts/toast-context";
import { debounce } from "lodash";

const questionTypes = [
  {
    category: "Contact info",
    items: [
      {
        id: "contact-info",
        name: "Contact Info",
        icon: UserIcon,
        bgColor: "bg-pink-100",
      },
      {
        id: "email",
        name: "Email",
        icon: EnvelopeIcon,
        bgColor: "bg-pink-100",
      },
      {
        id: "phone",
        name: "Phone Number",
        icon: PhoneIcon,
        bgColor: "bg-pink-100",
      },
      {
        id: "address",
        name: "Address",
        icon: MapPinIcon,
        bgColor: "bg-pink-100",
      },
      {
        id: "website",
        name: "Website",
        icon: LinkIcon,
        bgColor: "bg-pink-100",
      },
    ],
  },
  {
    category: "Choice",
    items: [
      {
        id: "multiple-choice",
        name: "Multiple Choice",
        icon: ListBulletIcon,
        bgColor: "bg-purple-100",
      },
      {
        id: "dropdown",
        name: "Dropdown",
        icon: ChevronDownIcon,
        bgColor: "bg-purple-100",
      },
      {
        id: "yes-no",
        name: "Yes/No",
        icon: CheckCircleIcon,
        bgColor: "bg-purple-100",
      },
      {
        id: "checkbox",
        name: "Checkbox",
        icon: Square2StackIcon,
        bgColor: "bg-purple-100",
      },
    ],
  },
  {
    category: "Text & Video",
    items: [
      {
        id: "long-text",
        name: "Long Text",
        icon: DocumentTextIcon,
        bgColor: "bg-blue-100",
      },
      {
        id: "short-text",
        name: "Short Text",
        icon: ChatBubbleBottomCenterTextIcon,
        bgColor: "bg-blue-100",
      },
    ],
  },
  {
    category: "Other",
    items: [
      {
        id: "date",
        name: "Date",
        icon: CalendarIcon,
        bgColor: "bg-yellow-100",
      },
    ],
  },
];

type QuestionType = 
  | 'multiple-choice'
  | 'dropdown'
  | 'yes-no'
  | 'checkbox'
  | 'short-text'
  | 'long-text'
  | 'email'
  | 'phone'
  | 'address'
  | 'website'
  | 'date';

interface QuestionChoice {
  id: string;
  questionId: string;
  text: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface Question {
  id: string;
  formId: string;
  type: QuestionType;
  text: string;
  description?: string;
  isRequired: boolean;
  maxChars?: number | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  choices?: QuestionChoice[];
}

// Update TOP_QUESTION_TYPES to match the new structure
const TOP_QUESTION_TYPES = [
  {
    category: "Most used",
    items: [
      {
        id: "short-text",
        name: "Short Text",
        icon: ChatBubbleBottomCenterTextIcon,
        bgColor: "bg-blue-100",
      },
      {
        id: "multiple-choice",
        name: "Multiple Choice",
        icon: ListBulletIcon,
        bgColor: "bg-purple-100",
      },
      {
        id: "long-text",
        name: "Long Text",
        icon: DocumentTextIcon,
        bgColor: "bg-blue-100",
      },
      {
        id: "email",
        name: "Email",
        icon: EnvelopeIcon,
        bgColor: "bg-pink-100",
      },
      {
        id: "yes-no",
        name: "Yes/No",
        icon: CheckCircleIcon,
        bgColor: "bg-purple-100",
      },
    ],
  },
];

interface FormSettings {
  id: string;
  formId: string;
  landingPageTitle: string;
  landingPageDescription?: string;
  landingPageButtonText: string;
  showProgressBar: boolean;
  endingPageTitle: string;
  endingPageDescription?: string;
  endingPageButtonText: string;
  redirectUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface PageSettingsModalProps {
  onClose: () => void;
  settings: FormSettings;
  onUpdate: (settings: FormSettings) => void;
}

const PageSettingsModal = ({
  onClose,
  settings,
  onUpdate,
}: PageSettingsModalProps) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [activeTab, setActiveTab] = useState<"landing" | "ending" | "advanced">(
    "landing"
  );

  const handleSave = () => {
    onUpdate(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[600px] rounded-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-900 font-[family-name:var(--font-nunito)]">
            Form Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("landing")}
            className={`px-6 py-3 text-sm font-medium font-[family-name:var(--font-nunito)] border-b-2 transition-colors ${
              activeTab === "landing"
                ? "border-black text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Landing Page
          </button>
          <button
            onClick={() => setActiveTab("ending")}
            className={`px-6 py-3 text-sm font-medium font-[family-name:var(--font-nunito)] border-b-2 transition-colors ${
              activeTab === "ending"
                ? "border-black text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Ending Page
          </button>
          <button
            onClick={() => setActiveTab("advanced")}
            className={`px-6 py-3 text-sm font-medium font-[family-name:var(--font-nunito)] border-b-2 transition-colors ${
              activeTab === "advanced"
                ? "border-black text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Advanced Settings
          </button>
        </div>

        <div className="p-6">
          {/* Landing Page Tab */}
          {activeTab === "landing" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 font-[family-name:var(--font-nunito)] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={localSettings.landingPageTitle}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      landingPageTitle: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg font-[family-name:var(--font-nunito)] placeholder-gray-400 focus:outline-none focus:border-gray-300 text-gray-900"
                  placeholder="Enter landing page title"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 font-[family-name:var(--font-nunito)] mb-1">
                  Description
                </label>
                <textarea
                  value={localSettings.landingPageDescription}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      landingPageDescription: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg font-[family-name:var(--font-nunito)] placeholder-gray-400 focus:outline-none focus:border-gray-300 text-gray-900 resize-none"
                  rows={3}
                  placeholder="Enter landing page description"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 font-[family-name:var(--font-nunito)] mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={localSettings.landingPageButtonText}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      landingPageButtonText: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg font-[family-name:var(--font-nunito)] placeholder-gray-400 focus:outline-none focus:border-gray-300 text-gray-900"
                  placeholder="Enter button text"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showProgress"
                  checked={localSettings.showProgressBar}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      showProgressBar: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-black focus:ring-0 focus:ring-offset-0 rounded border-gray-300"
                />
                <label
                  htmlFor="showProgress"
                  className="ml-2 text-sm text-gray-700 font-[family-name:var(--font-nunito)]"
                >
                  Show progress bar
                </label>
              </div>
            </div>
          )}

          {/* Ending Page Tab */}
          {activeTab === "ending" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 font-[family-name:var(--font-nunito)] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={localSettings.endingPageTitle}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      endingPageTitle: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg font-[family-name:var(--font-nunito)] placeholder-gray-400 focus:outline-none focus:border-gray-300 text-gray-900"
                  placeholder="Enter ending page title"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 font-[family-name:var(--font-nunito)] mb-1">
                  Description
                </label>
                <textarea
                  value={localSettings.endingPageDescription}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      endingPageDescription: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg font-[family-name:var(--font-nunito)] placeholder-gray-400 focus:outline-none focus:border-gray-300 text-gray-900 resize-none"
                  rows={3}
                  placeholder="Enter ending page description"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 font-[family-name:var(--font-nunito)] mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={localSettings.endingPageButtonText}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      endingPageButtonText: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg font-[family-name:var(--font-nunito)] placeholder-gray-400 focus:outline-none focus:border-gray-300 text-gray-900"
                  placeholder="Enter button text"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 font-[family-name:var(--font-nunito)] mb-1">
                  Redirect URL (Optional)
                </label>
                <input
                  type="url"
                  value={localSettings.redirectUrl}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      redirectUrl: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg font-[family-name:var(--font-nunito)] placeholder-gray-400 focus:outline-none focus:border-gray-300 text-gray-900"
                  placeholder="Enter URL to redirect after submission"
                />
              </div>
            </div>
          )}

          {/* Advanced Settings Tab */}
          {activeTab === "advanced" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cog6ToothIcon className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 font-[family-name:var(--font-nunito)] mb-2">
                Advanced Theme Settings
              </h3>
              <p className="text-gray-500 text-sm font-[family-name:var(--font-nunito)] max-w-md mx-auto">
                Coming soon! We're working on advanced theme customization
                options including custom CSS, fonts, and more.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 font-[family-name:var(--font-nunito)] hover:bg-gray-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm text-white font-[family-name:var(--font-nunito)] bg-black hover:bg-gray-900 rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const AnalyticsModal = ({
  form,
  onClose,
}: {
  form: (typeof sampleForms)[0];
  onClose: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "submissions" | "settings"
  >("overview");

  // Sample submission data with attendance information
  const submissions = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      date: "2023-06-15T10:30:00",
      attended: true,
      checkInTime: "2023-06-15T10:45:00",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      date: "2023-06-15T11:15:00",
      attended: true,
      checkInTime: "2023-06-15T11:20:00",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      date: "2023-06-15T14:20:00",
      attended: false,
      checkInTime: null,
    },
    {
      id: 4,
      name: "Alice Williams",
      email: "alice@example.com",
      date: "2023-06-16T09:10:00",
      attended: true,
      checkInTime: "2023-06-16T09:15:00",
    },
    {
      id: 5,
      name: "Charlie Brown",
      email: "charlie@example.com",
      date: "2023-06-16T13:45:00",
      attended: false,
      checkInTime: null,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[800px] rounded-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-900 font-[family-name:var(--font-nunito)]">
            Form Analytics
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 text-sm font-medium font-[family-name:var(--font-nunito)] border-b-2 transition-colors ${
              activeTab === "overview"
                ? "border-black text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-6 py-3 text-sm font-medium font-[family-name:var(--font-nunito)] border-b-2 transition-colors ${
              activeTab === "submissions"
                ? "border-black text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Submissions
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-3 text-sm font-medium font-[family-name:var(--font-nunito)] border-b-2 transition-colors ${
              activeTab === "settings"
                ? "border-black text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Settings
          </button>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 font-[family-name:var(--font-nunito)]">
                    Total Submissions
                  </h3>
                  <p className="text-2xl font-medium text-gray-900 font-[family-name:var(--font-nunito)] mt-1">
                    5
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 font-[family-name:var(--font-nunito)]">
                    Attendance Rate
                  </h3>
                  <p className="text-2xl font-medium text-gray-900 font-[family-name:var(--font-nunito)] mt-1">
                    60%
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 font-[family-name:var(--font-nunito)]">
                    Average Check-in Time
                  </h3>
                  <p className="text-2xl font-medium text-gray-900 font-[family-name:var(--font-nunito)] mt-1">
                    10:30 AM
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 font-[family-name:var(--font-nunito)] mb-3">
                  Submission Trends
                </h3>
                <div className="h-40 bg-white rounded border border-gray-200 flex items-center justify-center">
                  <p className="text-gray-500 text-sm font-[family-name:var(--font-nunito)]">
                    Chart visualization coming soon
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submissions Tab */}
          {activeTab === "submissions" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900 font-[family-name:var(--font-nunito)]">
                  Recent Submissions
                </h3>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                    <ArrowDownTrayIcon className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                    <EnvelopeIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-nunito)]"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-nunito)]"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-nunito)]"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-nunito)]"
                      >
                        Attended
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-nunito)]"
                      >
                        Check-in Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 font-[family-name:var(--font-nunito)]">
                          {submission.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-[family-name:var(--font-nunito)]">
                          {submission.email}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-[family-name:var(--font-nunito)]">
                          {new Date(submission.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {submission.attended ? (
                            <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full font-[family-name:var(--font-nunito)]">
                              Yes
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full font-[family-name:var(--font-nunito)]">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-[family-name:var(--font-nunito)]">
                          {submission.checkInTime
                            ? new Date(
                                submission.checkInTime
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 font-[family-name:var(--font-nunito)] mb-2">
                  Notification Settings
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 font-[family-name:var(--font-nunito)]">
                      Email notifications for new submissions
                    </span>
                    <button className="w-10 h-6 rounded-full bg-black">
                      <div className="w-4 h-4 rounded-full bg-white ml-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 font-[family-name:var(--font-nunito)]">
                      Daily summary report
                    </span>
                    <button className="w-10 h-6 rounded-full bg-gray-200">
                      <div className="w-4 h-4 rounded-full bg-white ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 font-[family-name:var(--font-nunito)] mb-2">
                  Data Retention
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 font-[family-name:var(--font-nunito)]">
                      Auto-delete submissions after
                    </span>
                    <select className="px-3 py-1.5 text-sm border border-gray-200 rounded font-[family-name:var(--font-nunito)]">
                      <option>30 days</option>
                      <option>60 days</option>
                      <option>90 days</option>
                      <option>Never</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 font-[family-name:var(--font-nunito)] hover:bg-gray-50 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Add sample forms data
const sampleForms = [
  {
    id: "1",
    name: "Event Registration",
    description: "Registration form for the annual conference",
    createdAt: "2023-06-01T10:00:00",
    updatedAt: "2023-06-15T14:30:00",
    submissions: 42,
    isPrivate: true,
  },
  {
    id: "2",
    name: "Customer Feedback",
    description: "Gather feedback from customers about our services",
    createdAt: "2023-05-15T09:15:00",
    updatedAt: "2023-06-10T11:20:00",
    submissions: 87,
    isPrivate: false,
  },
];

interface Form {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
  settings: FormSettings;
  isDirty: boolean;
  lastSaved?: string;
}

export default function FormEditor() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [workspace, setWorkspace] = useState<{ id: string; name: string } | null>(null);
  
  const [form, setForm] = useState<Form>({
    id: params.formId as string,
    workspaceId: "",
    name: `Untitled Form ${Math.floor(Math.random() * 1000)}`,
    isPrivate: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    questions: [],
    settings: {
      id: "",
      formId: params.formId as string,
      landingPageTitle: "Welcome to the Form",
      landingPageDescription: "Please fill out this form to help us understand your needs better.",
      landingPageButtonText: "Start",
      showProgressBar: true,
      endingPageTitle: "Thank You!",
      endingPageDescription: "Your response has been recorded. We appreciate your time.",
      endingPageButtonText: "Submit Another Response",
      redirectUrl: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    isDirty: false,
  });

  // Load workspace from localStorage on mount
  useEffect(() => {
    const storedWorkspace = localStorage.getItem('activeWorkspace');
    if (!storedWorkspace) {
      showToast({
        type: "error",
        title: "Error",
        message: "No workspace selected. Please select a workspace first.",
        duration: 3000
      });
      router.push('/dashboard');
      return;
    }
    setWorkspace(JSON.parse(storedWorkspace));
  }, []);

  // Fetch form data on mount only once
  useEffect(() => {
    let isMounted = true;
    
    const fetchForm = async () => {
      try {
        if (!workspace?.id) {
          return; // Wait for workspace to be loaded
        }

        setIsLoading(true);

        try {
          const response = await apiClient.get<Form>(`/workspaces/${workspace.id}/forms/${params.formId}`);
          if (isMounted) {
            setForm({
              ...response.data,
              isDirty: false,
            });
          }
        } catch (error: any) {
          console.error('Failed to fetch form:', error);
          if (error.response?.status === 404 && isMounted) {
            // Create new form with proper initial data
            const initialForm: Form = {
              id: params.formId as string,
              workspaceId: workspace.id,
              name: `Untitled Form ${Math.floor(Math.random() * 1000)}`,
              isPrivate: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              questions: [
                {
                  id: "1",
                  formId: params.formId as string,
                  type: "short-text" as QuestionType,
                  text: "Untitled question",
                  isRequired: false,
                  order: 1,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ],
              settings: {
                id: "",
                formId: params.formId as string,
                landingPageTitle: "Welcome to the Form",
                landingPageDescription: "Please fill out this form to help us understand your needs better.",
                landingPageButtonText: "Start",
                showProgressBar: true,
                endingPageTitle: "Thank You!",
                endingPageDescription: "Your response has been recorded. We appreciate your time.",
                endingPageButtonText: "Submit Another Response",
                redirectUrl: "",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              isDirty: false,
            };
            
            // Create the form on the backend
            const response = await apiClient.post<Form>(`/workspaces/${workspace.id}/forms`, {
              name: initialForm.name,
              description: "",
              is_private: initialForm.isPrivate,
            });
            
            if (isMounted) {
              setForm({
                ...initialForm,
                ...response.data,
                isDirty: false,
              });
            }
          }
        }
      } catch (error) {
        console.error('Failed to get active workspace:', error);
        router.push('/dashboard');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchForm();
    
    return () => {
      isMounted = false;
    };
  }, [params.formId, workspace?.id]);

  const [isEditingName, setIsEditingName] = useState(false);
  const [showQuestionTypes, setShowQuestionTypes] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState("1");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [showSettings, setShowSettings] = useState(false);
  const [showPageSettings, setShowPageSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateButton, setShowCreateButton] = useState(true);

  const handleSave = async () => {
    if (!form.isDirty || isSaving || !workspace?.id) return;

    try {
      setIsSaving(true);

      // Update form name if changed
      await apiClient.put(`/workspaces/${workspace.id}/forms/${form.id}`, {
        name: form.name,
        description: form.description,
        is_private: form.isPrivate,
      });

      // Handle questions
      const questionPromises = form.questions.map(async (question) => {
        if (question.id.startsWith('temp-')) {
          // Create new question
          const response = await apiClient.post<Question>(
            `/workspaces/${workspace.id}/forms/${form.id}/questions`,
            {
              type: question.type,
              text: question.text,
              description: question.description,
              is_required: question.isRequired,
              max_chars: question.maxChars,
              order: question.order,
            }
          );

          // If the question has choices, create them
          if (question.choices?.length) {
            await Promise.all(
              question.choices.map((choice) =>
                apiClient.post(
                  `/workspaces/${workspace.id}/forms/${form.id}/questions/${response.data.id}/choices`,
                  {
                    text: choice.text,
                    order: choice.order,
                  }
                )
              )
            );
          }

          // Update the question ID in the form state
          return { ...response.data, choices: question.choices };
        } else {
          // Update existing question
          await apiClient.put(
            `/workspaces/${workspace.id}/forms/${form.id}/questions/${question.id}`,
            {
              text: question.text,
              description: question.description,
              is_required: question.isRequired,
              max_chars: question.maxChars,
              order: question.order,
            }
          );

          // Update choices if they exist
          if (question.choices?.length) {
            await Promise.all(
              question.choices.map((choice) =>
                apiClient.put(
                  `/workspaces/${workspace.id}/forms/${form.id}/questions/${question.id}/choices/${choice.id}`,
                  {
                    text: choice.text,
                    order: choice.order,
                  }
                )
              )
            );
          }

          return question;
        }
      });

      const updatedQuestions = await Promise.all(questionPromises);

      // Update settings with default values for any missing fields
      const settingsPayload = {
        landing_page_title: form.settings.landingPageTitle || "Welcome to the Form",
        landing_page_description: form.settings.landingPageDescription || "Please fill out this form to help us understand your needs better.",
        landing_page_button_text: form.settings.landingPageButtonText || "Start",
        show_progress_bar: form.settings.showProgressBar ?? true,
        ending_page_title: form.settings.endingPageTitle || "Thank You!",
        ending_page_description: form.settings.endingPageDescription || "Your response has been recorded. We appreciate your time.",
        ending_page_button_text: form.settings.endingPageButtonText || "Submit Another Response",
        redirect_url: form.settings.redirectUrl || "",
      };

      // Update settings
      await apiClient.put(`/workspaces/${workspace.id}/forms/${form.id}/settings`, settingsPayload);

      setForm(prev => ({
        ...prev,
        questions: updatedQuestions,
        isDirty: false,
        lastSaved: new Date().toISOString(),
      }));

      showToast({
        type: "success",
        title: "Success",
        message: "Form saved successfully",
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to save form:', error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to save form. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormNameChange = (name: string) => {
    setForm(prev => ({
      ...prev,
      name,
      isDirty: true
    }));
  };

  const handleQuestionChange = (questionId: string, updates: Partial<Question>) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q
      ),
      isDirty: true
    }));
  };

  const handleCreateForm = async (workspaceId: string) => {
    try {
      const response = await apiClient.post<Form>(`/workspaces/${workspaceId}/forms`, {
        name: form.name,
        description: form.description,
        is_private: form.isPrivate,
      });
      setForm(prev => ({
        ...response.data,
        isDirty: false,
      }));
    } catch (error) {
      console.error('Failed to create form:', error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to create form. Please try again.",
        duration: 3000
      });
    }
  };

  const handleCreate = async () => {
    try {
      // Check for untitled questions
      const untitledQuestions = form.questions.filter(q => q.text === "Untitled question");
      if (untitledQuestions.length > 0) {
        showToast({
          type: "error",
          title: "Error",
          message: "Please update all untitled questions before creating the form",
          duration: 3000
        });
        return;
      }

      setIsCreating(true);
      
      // Create form
      const response = await apiClient.post<Form>(`/workspaces/${form.workspaceId}/forms`, {
        name: form.name,
        description: form.description,
        is_private: form.isPrivate,
        questions: form.questions.map(q => ({
          type: q.type,
          text: q.text,
          description: q.description,
          is_required: q.isRequired,
          max_chars: q.maxChars,
          order: q.order,
          choices: q.choices?.map(c => ({
            text: c.text,
            order: c.order
          }))
        }))
      });

      setForm(prev => ({
        ...response.data,
        isDirty: false,
        lastSaved: new Date().toISOString()
      }));
      
      setShowCreateButton(false);
    } catch (error) {
      console.error('Failed to create form:', error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to create form. Please try again.",
        duration: 3000
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddQuestion = (typeId: string) => {
    const newQuestion: Question = {
      id: `temp-${Date.now()}`,
      formId: form.id,
      type: typeId as QuestionType,
      text: "Untitled question",
      isRequired: false,
      order: form.questions.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...getQuestionTemplate(typeId),
    };
    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      isDirty: true
    }));
    setCurrentQuestionId(newQuestion.id);
    setShowQuestionTypes(false);
    handleSave(); // Save immediately when adding a new question
  };

  const handleSettingsChange = (settings: FormSettings) => {
    setForm(prev => ({
      ...prev,
      settings,
      isDirty: true
    }));
  };

  const currentQuestion = form.questions.find((q) => q.id === currentQuestionId);

  const handleClose = () => {
    router.push("/dashboard");
  };

  const getQuestionTemplate = (type: string): Partial<Question> => {
    switch (type) {
      case "multiple-choice":
      case "dropdown":
      case "checkbox":
        return {
          choices: [
            { id: "1", questionId: "temp", text: "Option 1", order: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: "2", questionId: "temp", text: "Option 2", order: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: "3", questionId: "temp", text: "Option 3", order: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          ],
        };
      case "yes-no":
        return {
          choices: [
            { id: "1", questionId: "temp", text: "Yes", order: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: "2", questionId: "temp", text: "No", order: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          ],
        };
      default:
        return {};
    }
  };

  const handleQuestionTypeChange = (type: QuestionType) => {
    const template = {
      maxChars: type === 'short-text' ? 100 : null,
      choices: ['multiple-choice', 'dropdown', 'checkbox'].includes(type) ? [] : undefined
    };

    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === currentQuestionId ? { ...q, type, ...template } : q
      )
    }));
    setShowQuestionTypes(false);
  };

  const handleQuestionTextChange = (text: string) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === currentQuestionId ? { ...q, text } : q
      ),
      isDirty: true
    }));
  };

  const handleDeleteQuestion = async (id: string) => {
    if (form.questions.length > 1) {
      try {
        if (!id.startsWith('temp-')) {
          await apiClient.delete(`/workspaces/${form.workspaceId}/forms/${form.id}/questions/${id}`);
        }
        const newQuestions = form.questions.filter(q => q.id !== id);
        setForm(prev => ({
          ...prev,
          questions: newQuestions,
          isDirty: true
        }));
        setCurrentQuestionId(newQuestions[0].id);
      } catch (error) {
        console.error('Failed to delete question:', error);
      }
    }
  };

  const handleRequiredChange = (isRequired: boolean) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === currentQuestionId ? { ...q, isRequired } : q
      ),
      isDirty: true
    }));
  };

  const handleMaxCharsChange = (maxChars: number | undefined) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === currentQuestionId ? { ...q, maxChars } : q
      ),
      isDirty: true
    }));
  };

  const getQuestionTypeInfo = (typeId: string) => {
    for (const category of questionTypes) {
      const item = category.items.find((item) => item.id === typeId);
      if (item) return item;
    }
    return questionTypes[2].items[1]; // Default to short text
  };

  const getQuestionPlaceholder = (type: string) => {
    switch (type) {
      case "multiple-choice":
        return "What are the options?";
      case "email":
        return "What's your email address?";
      case "phone":
        return "What's your phone number?";
      case "long-text":
        return "Write a detailed answer...";
      case "yes-no":
        return "Ask a yes/no question...";
      default:
        return "Type your question";
    }
  };

  const handleChoiceTextChange = (
    questionId: string,
    choiceId: string,
    text: string
  ) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId
          ? {
              ...q,
              choices: q.choices?.map((c) =>
                c.id === choiceId ? { ...c, text } : c
              ),
            }
          : q
      ),
      isDirty: true
    }));
  };

  const handleAddChoice = () => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === currentQuestionId) {
          const newChoice: QuestionChoice = {
            id: `temp-${Date.now()}`,
            questionId: q.id,
            text: "New choice",
            order: (q.choices?.length || 0) + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          return {
            ...q,
            choices: [...(q.choices || []), newChoice]
          };
        }
        return q;
      }),
      isDirty: true
    }));
  };

  const handleDeleteChoice = (choiceId: string) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === currentQuestionId) {
          return {
            ...q,
            choices: q.choices?.filter(c => c.id !== choiceId)
          };
        }
        return q;
      }),
      isDirty: true
    }));
  };

  const handleReorder = (reorderedQuestions: Question[]) => {
    setForm(prev => ({
      ...prev,
      questions: reorderedQuestions,
      isDirty: true
    }));
  };

  const renderQuestionPreview = (question: Question) => {
    const baseInputClass = "w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 font-[family-name:var(--font-nunito)] text-sm placeholder-gray-400";
    const baseChoiceClass = "flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-50 cursor-not-allowed";
    
    switch (question.type) {
      case 'short-text':
        return (
          <input
            type="text"
            placeholder="Short answer text"
            className={baseInputClass}
            disabled
          />
        );
      case 'long-text':
        return (
          <textarea
            placeholder="Long answer text"
            rows={3}
            className={`${baseInputClass} resize-none`}
            disabled
          />
        );
      case 'email':
        return (
          <input
            type="email"
            placeholder="email@example.com"
            className={baseInputClass}
            disabled
          />
        );
      case 'phone':
        return (
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            className={baseInputClass}
            disabled
          />
        );
      case 'website':
        return (
          <input
            type="url"
            placeholder="https://example.com"
            className={baseInputClass}
            disabled
          />
        );
      case 'date':
        return (
          <input
            type="date"
            className={baseInputClass}
            disabled
          />
        );
      case 'multiple-choice':
        return (
          <div className="space-y-1">
            {question.choices?.map((choice) => (
              <div key={choice.id} className={baseChoiceClass}>
                <input 
                  type="radio" 
                  disabled 
                  className="h-4 w-4 text-blue-600 border-gray-300 cursor-not-allowed" 
                />
                <span className="text-sm text-gray-600 font-[family-name:var(--font-nunito)]">{choice.text}</span>
              </div>
            ))}
          </div>
        );
      case 'yes-no':
        return (
          <div className="space-y-1">
            <div className={baseChoiceClass}>
              <input 
                type="radio" 
                disabled 
                className="h-4 w-4 text-blue-600 border-gray-300 cursor-not-allowed" 
              />
              <span className="text-sm text-gray-600 font-[family-name:var(--font-nunito)]">Yes</span>
            </div>
            <div className={baseChoiceClass}>
              <input 
                type="radio" 
                disabled 
                className="h-4 w-4 text-blue-600 border-gray-300 cursor-not-allowed" 
              />
              <span className="text-sm text-gray-600 font-[family-name:var(--font-nunito)]">No</span>
            </div>
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-1">
            {question.choices?.map((choice) => (
              <div key={choice.id} className={baseChoiceClass}>
                <input 
                  type="checkbox" 
                  disabled 
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 cursor-not-allowed" 
                />
                <span className="text-sm text-gray-600 font-[family-name:var(--font-nunito)]">{choice.text}</span>
              </div>
            ))}
          </div>
        );
      case 'dropdown':
        return (
          <select className={`${baseInputClass} cursor-not-allowed`} disabled>
            <option value="">Select an option</option>
            {question.choices?.map((choice) => (
              <option key={choice.id} value={choice.id}>
                {choice.text}
              </option>
            ))}
          </select>
        );
      case 'address':
        return (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Street address"
              className={baseInputClass}
              disabled
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="City"
                className={baseInputClass}
                disabled
              />
              <input
                type="text"
                placeholder="State / Province"
                className={baseInputClass}
                disabled
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="ZIP / Postal code"
                className={baseInputClass}
                disabled
              />
              <input
                type="text"
                placeholder="Country"
                className={baseInputClass}
                disabled
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex">
      <AnimatePresence>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-sm text-gray-600 font-[family-name:var(--font-nunito)]">Loading form...</p>
                </div>
              </div>
            ) : form ? (
              <>
                {/* Top Navigation */}
                <header className="h-14 border-b border-gray-200 flex items-center justify-between px-4">
                  {/* Left - Workspace & Form Name */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleClose}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <span className="font-jedira">My workspace</span>
                      <span className="text-gray-400">/</span>
                      {isEditingName ? (
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => handleFormNameChange(e.target.value)}
                          onBlur={() => {
                            setIsEditingName(false);
                            handleSave();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setIsEditingName(false);
                              handleSave();
                            }
                          }}
                          autoFocus
                          className="font-medium font-jedira bg-transparent border-none outline-none focus:ring-0 w-40"
                        />
                      ) : (
                        <span
                          className="font-medium font-jedira cursor-pointer hover:text-gray-600"
                          onClick={() => setIsEditingName(true)}
                        >
                          {form.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle - Tools */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowQuestionTypes(true)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-[family-name:var(--font-nunito)] text-gray-700 hover:bg-gray-50 rounded-md"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Add content
                    </button>
                    <div className="flex items-center gap-2 border-l border-r px-4">
                      <button
                        onClick={() => setPreviewMode("desktop")}
                        className={`p-1.5 rounded transition-colors ${
                          previewMode === "desktop"
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <ComputerDesktopIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setPreviewMode("mobile")}
                        className={`p-1.5 rounded transition-colors ${
                          previewMode === "mobile"
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <DevicePhoneMobileIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setShowPageSettings(true)}
                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded"
                      >
                        <Cog6ToothIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Right - Save Button */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleSave}
                      disabled={!form.isDirty || isSaving}
                      className={`flex items-center px-4 py-1.5 rounded-md text-sm font-[family-name:var(--font-nunito)] transition-colors ${
                        form.isDirty 
                          ? "bg-black text-white hover:bg-gray-900" 
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Saving...
                        </>
                      ) : form.isDirty ? (
                        'Save changes'
                      ) : (
                        'Saved'
                      )}
                    </button>
                  </div>
                </header>

                <div className="flex h-[calc(100%-3.5rem)]">
                  {/* Left Sidebar - Questions List */}
                  <div className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
                    <div className="p-4 space-y-2">
                      <button
                        onClick={() => setShowQuestionTypes(true)}
                        className="w-full flex items-center gap-2 px-3 py-2 bg-white rounded-lg text-sm font-[family-name:var(--font-nunito)] text-gray-600 hover:bg-gray-50 border border-gray-200"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Add Question
                      </button>
                      <Reorder.Group
                        axis="y"
                        values={form.questions}
                        onReorder={handleReorder}
                        className="space-y-2"
                      >
                        {form.questions.map((question, index) => {
                          const typeInfo = getQuestionTypeInfo(question.type);
                          return (
                            <Reorder.Item
                              key={question.id}
                              value={question}
                              className={`w-full flex items-center gap-2 p-3 rounded-lg text-left cursor-grab active:cursor-grabbing ${
                                currentQuestionId === question.id
                                  ? "bg-white shadow-sm"
                                  : "bg-transparent hover:bg-white/50"
                              }`}
                              onClick={() => setCurrentQuestionId(question.id)}
                              dragListener={true}
                              dragControls={undefined}
                            >
                              <div className="flex items-center gap-2 w-full">
                                <span
                                  className={`w-6 h-6 flex items-center justify-center ${typeInfo.bgColor} text-gray-700 rounded text-sm font-[family-name:var(--font-nunito)]`}
                                >
                                  {index + 1}
                                </span>
                                <span className="text-sm text-gray-900 font-[family-name:var(--font-nunito)] truncate flex-1">
                                  {question.text || `Untitled question`}
                                </span>
                                <motion.div
                                  className="w-4 h-4 flex-shrink-0 opacity-50 group-hover:opacity-100"
                                  initial={false}
                                >
                                  <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
                                  </svg>
                                </motion.div>
                              </div>
                            </Reorder.Item>
                          );
                        })}
                      </Reorder.Group>
                    </div>
                  </div>

                  {/* Main Content - Update with preview modes */}
                  <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 overflow-y-auto">
                    {currentQuestion && (
                      <div
                        className={`w-full transition-all duration-300 ${
                          previewMode === "mobile" ? "max-w-sm" : "max-w-2xl"
                        } px-4 py-6`}
                      >
                        <div
                          className={`relative bg-white rounded-xl shadow-sm overflow-hidden ${
                            previewMode === "mobile" ? "mx-auto" : ""
                          }`}
                        >
                          <div className="p-6">
                            <div className="flex items-start gap-4">
                              <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-lg font-[family-name:var(--font-nunito)]">
                                {form.questions.findIndex(
                                  (q) => q.id === currentQuestion.id
                                ) + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <textarea
                                    value={currentQuestion.text}
                                    onChange={(e) =>
                                      handleQuestionTextChange(e.target.value)
                                    }
                                    className={`w-full font-medium font-[family-name:var(--font-nunito)] bg-transparent border-none outline-none focus:ring-0 text-gray-900 placeholder-gray-400 resize-none overflow-hidden leading-tight ${
                                      previewMode === "mobile"
                                        ? "text-2xl"
                                        : "text-3xl"
                                    }`}
                                    placeholder={getQuestionPlaceholder(
                                      currentQuestion.type
                                    )}
                                    rows={1}
                                    onInput={(e) => {
                                      const target =
                                        e.target as HTMLTextAreaElement;
                                      target.style.height = "auto";
                                      target.style.height =
                                        target.scrollHeight + "px";
                                    }}
                                    style={{ minHeight: "1.5em" }}
                                  />
                                  {currentQuestion.isRequired && (
                                    <span
                                      className={`font-medium text-red-500 flex-shrink-0 ${
                                        previewMode === "mobile"
                                          ? "text-2xl"
                                          : "text-3xl"
                                      }`}
                                    >
                                      *
                                    </span>
                                  )}
                                </div>
                                {currentQuestion.description && (
                                  <div className="mt-2 text-gray-500 text-sm font-[family-name:var(--font-nunito)]">
                                    {currentQuestion.description}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="mt-6">
                              {renderQuestionPreview(currentQuestion)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Question Types Modal */}
                  <AnimatePresence>
                    {showQuestionTypes && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 bg-black/50 z-[60]"
                          onClick={() => setShowQuestionTypes(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{
                            type: "spring",
                            damping: 20,
                            stiffness: 300,
                          }}
                          className="fixed left-1/2 top-24 -translate-x-1/2 w-[600px] max-h-[calc(100vh-8rem)] bg-white rounded-xl shadow-2xl z-[70] overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="p-4 border-b border-gray-200 bg-white sticky top-0">
                            <div className="flex items-center justify-between">
                              <h2 className="text-lg font-medium text-gray-900 font-[family-name:var(--font-nunito)]">
                                Add Question
                              </h2>
                              <button
                                onClick={() => setShowQuestionTypes(false)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <XMarkIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          <div className="p-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
                            <div className="space-y-6">
                              {questionTypes.map((category) => (
                                <div key={category.category}>
                                  <h3 className="text-sm font-medium text-gray-900 mb-3 font-[family-name:var(--font-nunito)]">
                                    {category.category}
                                  </h3>
                                  <div className="grid grid-cols-2 gap-2">
                                    {category.items.map((item) => (
                                      <button
                                        key={item.id}
                                        onClick={() =>
                                          handleAddQuestion(item.id)
                                        }
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                                      >
                                        <div
                                          className={`p-2 rounded-lg ${item.bgColor}`}
                                        >
                                          {React.createElement(item.icon, {
                                            className: "w-5 h-5 text-gray-700",
                                          })}
                                        </div>
                                        <span className="text-sm font-[family-name:var(--font-nunito)] text-gray-900">
                                          {item.name}
                                        </span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>

                  {/* Settings Modal */}
                  <AnimatePresence>
                    {showSettings && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 bg-black/50 z-[60]"
                          onClick={() => setShowSettings(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{
                            type: "spring",
                            damping: 20,
                            stiffness: 300,
                          }}
                          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white rounded-xl shadow-2xl z-[70] overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Cog6ToothIcon className="w-6 h-6 text-gray-600" />
                            </div>
                            <h2 className="text-lg font-medium text-gray-900 font-[family-name:var(--font-nunito)] mb-2">
                              Advanced Theme Settings
                            </h2>
                            <p className="text-gray-500 text-sm font-[family-name:var(--font-nunito)]">
                              Coming soon! We're working on advanced theme
                              customization options.
                            </p>
                            <button
                              onClick={() => setShowSettings(false)}
                              className="mt-6 px-4 py-2 text-sm font-[family-name:var(--font-nunito)] text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                            >
                              Close
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>

                  {/* Right Sidebar - Question Settings */}
                  <div className="w-72 border-l border-gray-200 bg-white overflow-y-auto flex flex-col">
                    <div className="flex-1 p-4">
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-4 font-[family-name:var(--font-nunito)]">
                          Question Type
                        </h3>
                        {currentQuestion && (
                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md">
                            <div
                              className={`p-1.5 rounded-md ${
                                getQuestionTypeInfo(currentQuestion.type).bgColor
                              }`}
                            >
                              {React.createElement(
                                getQuestionTypeInfo(currentQuestion.type).icon,
                                {
                                  className: "w-4 h-4 text-gray-700",
                                }
                              )}
                            </div>
                            <span className="text-sm font-[family-name:var(--font-nunito)] text-gray-700">
                              {getQuestionTypeInfo(currentQuestion.type).name}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-4 font-[family-name:var(--font-nunito)]">
                          Settings
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 font-[family-name:var(--font-nunito)]">
                              Required
                            </span>
                            <button
                              onClick={() =>
                                handleRequiredChange(!currentQuestion?.isRequired)
                              }
                              className={`w-10 h-6 rounded-full transition-colors ${
                                currentQuestion?.isRequired
                                  ? "bg-gray-900"
                                  : "bg-gray-200"
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                  currentQuestion?.isRequired
                                    ? "translate-x-5"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                          {(currentQuestion?.type === "short-text" ||
                            currentQuestion?.type === "long-text") && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 font-[family-name:var(--font-nunito)]">
                                Max characters
                              </span>
                              <input
                                type="number"
                                value={currentQuestion?.maxChars || ""}
                                onChange={(e) =>
                                  handleMaxCharsChange(
                                    e.target.value ? Number(e.target.value) : undefined
                                  )
                                }
                                className="w-20 px-2 py-1 text-sm border border-gray-200 rounded font-[family-name:var(--font-nunito)]"
                                placeholder="None"
                              />
                            </div>
                          )}
                          {(currentQuestion?.type === "multiple-choice" ||
                            currentQuestion?.type === "dropdown" ||
                            currentQuestion?.type === "checkbox") &&
                            currentQuestion?.choices && (
                              <div className="space-y-3">
                                <h4 className="text-sm font-medium text-gray-700 font-[family-name:var(--font-nunito)]">
                                  Options
                                </h4>
                                <div className="space-y-2">
                                  {currentQuestion.choices.map((choice, index) => (
                                    <div
                                      key={choice.id}
                                      className="flex items-center gap-2"
                                    >
                                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 text-gray-400">
                                        {String.fromCharCode(65 + index)}
                                      </div>
                                      <input
                                        type="text"
                                        value={choice.text}
                                        onChange={(e) =>
                                          handleChoiceTextChange(
                                            currentQuestion.id,
                                            choice.id,
                                            e.target.value
                                          )
                                        }
                                        className="flex-1 px-2 py-1.5 text-sm text-gray-900 border border-gray-200 rounded font-[family-name:var(--font-nunito)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder={`Option ${index + 1}`}
                                      />
                                      {currentQuestion.choices &&
                                        currentQuestion.choices.length > 2 && (
                                          <button
                                            onClick={() =>
                                              handleDeleteChoice(choice.id)
                                            }
                                            className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                                          >
                                            <XMarkIcon className="w-4 h-4" />
                                          </button>
                                        )}
                                    </div>
                                  ))}
                                  <button
                                    onClick={handleAddChoice}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded border border-gray-200 transition-colors"
                                  >
                                    <PlusIcon className="w-4 h-4" />
                                    Add option
                                  </button>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                    {currentQuestion && form.questions.length > 1 && (
                      <div className="p-4 border-t border-gray-200">
                        <button
                          onClick={() => handleDeleteQuestion(currentQuestion.id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <XMarkIcon className="w-5 h-5" />
                          <span className="text-sm font-[family-name:var(--font-nunito)]">
                            Delete question
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-red-600 font-[family-name:var(--font-nunito)]">Failed to load form. Please try again.</p>
                  <button
                    onClick={handleClose}
                    className="mt-4 px-4 py-2 text-sm text-gray-700 font-[family-name:var(--font-nunito)] hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Page Settings Modal */}
      {showPageSettings && (
        <PageSettingsModal
          onClose={() => setShowPageSettings(false)}
          settings={form.settings}
          onUpdate={handleSettingsChange}
        />
      )}
    </div>
  );
}
