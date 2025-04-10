"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  EllipsisHorizontalIcon, 
  ChevronDownIcon,
  Squares2X2Icon,
  ListBulletIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronUpIcon,
  LockClosedIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  LinkIcon,
  EllipsisVerticalIcon,
  ChartBarIcon,
  QrCodeIcon,
  XMarkIcon,
  EnvelopeIcon,
  BellIcon
} from "@heroicons/react/24/outline";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import apiClient from "@/lib/api-client";
import { useToast } from "@/contexts/toast-context";
import { useRouter } from "next/navigation";

const navigation = [
  { name: "Forms", href: "/dashboard", current: true },
  // Commented out for future use
  // { name: "Integrations", href: "/dashboard/integrations", current: false },
  // { name: "Brand kit", href: "/dashboard/brand-kit", current: false },
];

// Sample forms data
const sampleForms = [
  { 
    id: '1', 
    title: 'Customer Feedback Form', 
    responses: 124, 
    color: 'bg-blue-500',
    isPrivate: true,
    createdAt: '2024-03-15'
  },
  { 
    id: '2', 
    title: 'Event Registration', 
    responses: 89, 
    color: 'bg-purple-500',
    isPrivate: true,
    createdAt: '2024-03-14'
  },
  { 
    id: '3', 
    title: 'Product Survey', 
    responses: 45, 
    color: 'bg-emerald-500',
    isPrivate: false,
    createdAt: '2024-03-13'
  },
  { 
    id: '4', 
    title: 'Job Application', 
    responses: 67, 
    color: 'bg-amber-500',
    isPrivate: true,
    createdAt: '2024-03-12'
  },
];

// Function to get initials from title
const getInitials = (title: string | undefined) => {
  if (!title?.trim()) return '';
  
  return title
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

type Tab = 'overview' | 'submissions' | 'settings';

interface Choice {
  id: string;
  text: string;
  order: number;
}

interface Question {
  id: string;
  text: string;
  type: string;
  description?: string;
  is_required: boolean;
  order: number;
  choices?: Choice[];
}

interface QuestionResponse {
  question_id: string;
  answer?: string;
  choices?: string[];
  response_data: any;
  question: Question;
}

interface Submission {
  id: string;
  form_id: string;
  email: string;
  status: 'in_progress' | 'completed';
  started_at: string;
  completed_at: string | null;
  completion_time: number | null;
  metadata: {
    user_agent?: string;
    ip_address?: string;
  };
  question_responses: QuestionResponse[];
}

interface SubmissionsResponse {
  submissions: Submission[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  form: {
    id: string;
    name: string;
    questions: Question[];
  };
}

interface AnalyticsModalProps {
  form: Form;
  onClose: () => void;
}

const AnalyticsModal = ({
  form,
  onClose,
}: AnalyticsModalProps) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [notifySubmitter, setNotifySubmitter] = useState(true);
  const [notifyOwner, setNotifyOwner] = useState(true);
  const [isFormEnabled, setIsFormEnabled] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchSubmissions = async () => {
    try {
      setIsLoadingSubmissions(true);
      const token = localStorage.getItem('token'); // Get token from localStorage

      if (!token) {
        showToast({
          type: 'error',
          title: 'Error',
          message: 'You must be logged in to view submissions',
          duration: 3000,
        });
        return;
      }

      const response = await apiClient.get<SubmissionsResponse>(
        `workspaces/${form.workspace_id}/forms/${form.id}/submissions/list`,
        {
          params: {
            page: pagination.page,
            limit: pagination.limit,
            sortBy,
            sortOrder
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSubmissions(response.data.submissions);
      setPagination(response.data.pagination);
    } catch (error: any) {
      console.error('Failed to fetch submissions:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Failed to load submissions',
        duration: 3000,
      });
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'submissions') {
      fetchSubmissions();
    }
  }, [activeTab, pagination.page, sortBy, sortOrder]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleSortChange = (field: string) => {
    if (field === sortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const tabs: { id: Tab; name: string }[] = [
    { id: 'overview', name: 'Overview' },
    { id: 'submissions', name: 'Submissions' },
    { id: 'settings', name: 'Settings' },
  ];

  const renderSubmissionsTable = () => {
    if (isLoadingSubmissions) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
        </div>
      );
    }

    if (submissions.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 font-[family-name:var(--font-nunito)]">No submissions yet</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-nunito)] cursor-pointer"
                onClick={() => handleSortChange('email')}
              >
                Email
                {sortBy === 'email' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-nunito)] cursor-pointer"
                onClick={() => handleSortChange('status')}
              >
                Status
                {sortBy === 'status' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-nunito)] cursor-pointer"
                onClick={() => handleSortChange('started_at')}
              >
                Started At
                {sortBy === 'started_at' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-nunito)] cursor-pointer"
                onClick={() => handleSortChange('completion_time')}
              >
                Completion Time
                {sortBy === 'completion_time' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submissions.map((submission) => (
              <tr key={submission.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-[family-name:var(--font-nunito)]">
                  {submission.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-[family-name:var(--font-nunito)]">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    submission.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {submission.status === 'completed' ? 'Completed' : 'In Progress'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-[family-name:var(--font-nunito)]">
                  {new Date(submission.started_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-[family-name:var(--font-nunito)]">
                  {submission.completion_time 
                    ? `${Math.round(submission.completion_time / 60)} minutes` 
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 font-[family-name:var(--font-nunito)]">
                Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronDownIcon className="h-5 w-5 rotate-90" />
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === pagination.page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ChevronDownIcon className="h-5 w-5 -rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 font-[family-name:var(--font-nunito)] mb-2">Total Submissions</h4>
                <p className="text-3xl font-medium text-gray-900 font-[family-name:var(--font-nunito)]">
                  {pagination.total}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 font-[family-name:var(--font-nunito)] mb-2">Completion Rate</h4>
                <p className="text-3xl font-medium text-gray-900 font-[family-name:var(--font-nunito)]">
                  {submissions.length > 0
                    ? `${Math.round((submissions.filter(s => s.status === 'completed').length / submissions.length) * 100)}%`
                    : '0%'}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 font-[family-name:var(--font-nunito)] mb-2">Avg. Completion Time</h4>
                <p className="text-3xl font-medium text-gray-900 font-[family-name:var(--font-nunito)]">
                  {submissions.length > 0
                    ? `${Math.round(submissions.reduce((acc, s) => acc + (s.completion_time || 0), 0) / submissions.length / 60)} min`
                    : '-'}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-medium text-gray-900 font-[family-name:var(--font-nunito)]">QR Code</h4>
                <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-[family-name:var(--font-nunito)] hover:bg-gray-50 rounded-lg transition-colors">
                  Download
                </button>
              </div>
              <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <QrCodeIcon className="w-48 h-48 text-gray-400" />
              </div>
            </div>
          </div>
        );
      case 'submissions':
        return (
          <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
            {renderSubmissionsTable()}
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 font-[family-name:var(--font-nunito)] mb-4">Email Notifications</h4>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 font-[family-name:var(--font-nunito)]">Notify submitter</p>
                        <p className="text-sm text-gray-500 font-[family-name:var(--font-nunito)]">Send a confirmation email to form submitter</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotifySubmitter(!notifySubmitter)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifySubmitter ? 'bg-black' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifySubmitter ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <BellIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 font-[family-name:var(--font-nunito)]">Notify form owner</p>
                        <p className="text-sm text-gray-500 font-[family-name:var(--font-nunito)]">Get notified when someone submits the form</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotifyOwner(!notifyOwner)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifyOwner ? 'bg-black' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifyOwner ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 font-[family-name:var(--font-nunito)]">Form Status</h4>
                  <p className="text-sm text-gray-500 font-[family-name:var(--font-nunito)]">Enable or disable form submissions</p>
                </div>
                <button
                  onClick={() => setIsFormEnabled(!isFormEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isFormEnabled ? 'bg-black' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isFormEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#f7f7f8] w-[1000px] max-h-[90vh] rounded-xl flex flex-col">
        <div className="flex items-center justify-between p-8 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-lg font-medium font-[family-name:var(--font-nunito)]">
              {getInitials(form.name)}
            </div>
            <div>
              <h2 className="text-2xl font-medium text-gray-900 font-[family-name:var(--font-nunito)] mb-1">{form.name}</h2>
              <p className="text-sm text-gray-500 font-[family-name:var(--font-nunito)]">Created on {new Date(form.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="border-b border-gray-200">
          <nav className="flex space-x-12 px-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-1 py-4 text-sm font-medium font-[family-name:var(--font-nunito)] border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-8 flex-1 overflow-y-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

interface CreateFormModalProps {
  onClose: () => void;
  onSubmit: (name: string) => void;
  isLoading: boolean;
}

const CreateFormModal = ({ onClose, onSubmit, isLoading }: CreateFormModalProps) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] rounded-2xl shadow-xl">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-semibold text-gray-900 font-[family-name:var(--font-nunito)]">Create Form</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          <div className="space-y-1.5">
            <label htmlFor="form-name" className="block text-sm font-medium text-gray-700 font-[family-name:var(--font-nunito)]">
              Form Name
            </label>
            <input
              type="text"
              id="form-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg font-[family-name:var(--font-nunito)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-gray-900"
              placeholder="Enter form name"
              required
              autoFocus
            />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 font-[family-name:var(--font-nunito)] hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white font-[family-name:var(--font-nunito)] bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Form'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface Workspace {
  id: string;
  name: string;
  type: 'private' | 'public';
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface WorkspaceResponse {
  workspaces: Workspace[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

interface Form {
  id: string;
  workspace_id: string;
  name: string;
  description: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

interface FormResponse {
  forms: Form[];
  pagination: {
    page: number;
    limit: number;
    total: number | null;
  };
}

interface DeleteConfirmationModalProps {
  form: Form;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const DeleteConfirmationModal = ({ form, onClose, onConfirm, isDeleting }: DeleteConfirmationModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] rounded-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-900 font-[family-name:var(--font-nunito)]">Delete Form</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 font-[family-name:var(--font-nunito)]">
            Are you sure you want to delete "<span className="font-medium text-gray-900">{form.name}</span>"? This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm text-gray-700 font-[family-name:var(--font-nunito)] hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm text-white font-[family-name:var(--font-nunito)] bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <TrashIcon className="w-4 h-4" />
                Delete Form
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { showToast } = useToast();
  const router = useRouter();
  const [isPrivateExpanded, setIsPrivateExpanded] = useState(true);
  const [isPublicExpanded, setIsPublicExpanded] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showActionsFor, setShowActionsFor] = useState<string | null>(null);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [forms, setForms] = useState<Form[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForms, setIsLoadingForms] = useState(false);
  const [formToDelete, setFormToDelete] = useState<Form | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchWorkspaces = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get<WorkspaceResponse>(`/workspaces?search=${debouncedSearchQuery}`);
      setWorkspaces(response.data.workspaces);
      localStorage.setItem('workspaces', JSON.stringify(response.data.workspaces));
      
      // Only set active workspace and fetch forms if no workspace is currently selected
      if (!activeWorkspace && response.data.workspaces.length > 0) {
        const firstWorkspace = response.data.workspaces[0];
        setActiveWorkspace(firstWorkspace);
        localStorage.setItem('activeWorkspace', JSON.stringify(firstWorkspace));
        await fetchForms(firstWorkspace.id);
      }
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize workspaces and active workspace from localStorage on mount
  useEffect(() => {
    const storedWorkspaces = localStorage.getItem('workspaces');
    const storedWorkspace = localStorage.getItem('activeWorkspace');
    
    if (storedWorkspaces) {
      setWorkspaces(JSON.parse(storedWorkspaces));
    }
    
    if (storedWorkspace) {
      const workspace = JSON.parse(storedWorkspace);
      setActiveWorkspace(workspace);
      fetchForms(workspace.id);
    }
    
    // Only fetch workspaces if we don't have them in localStorage
    if (!storedWorkspaces) {
      fetchWorkspaces();
    }
  }, []);

  // Fetch workspaces only when search query changes and we're actually searching
  useEffect(() => {
    if (debouncedSearchQuery) {
      fetchWorkspaces();
    }
  }, [debouncedSearchQuery]);

  const fetchForms = async (workspaceId: string) => {
    try {
      setIsLoadingForms(true);
      const response = await apiClient.get<FormResponse>(`/workspaces/${workspaceId}/forms`);
      setForms(response.data.forms);
    } catch (error) {
      console.error('Failed to fetch forms:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load forms',
        duration: 3000,
      });
    } finally {
      setIsLoadingForms(false);
    }
  };

  const handleWorkspaceClick = (workspace: Workspace) => {
    if (workspace.id === activeWorkspace?.id) return;
    
    setActiveWorkspace(workspace);
    localStorage.setItem('activeWorkspace', JSON.stringify(workspace));
    setForms([]); // Clear forms before fetching new ones
    fetchForms(workspace.id);
  };

  const handleActionClick = (formId: string) => {
    setShowActionsFor(showActionsFor === formId ? null : formId);
  };

  const handleCopyLink = (formId: string) => {
    navigator.clipboard.writeText(`https://yourapp.com/forms/${formId}`);
    setShowActionsFor(null);
  };

  const handleViewAnalytics = (form: Form) => {
    setSelectedForm(form);
    setShowActionsFor(null);
  };

  const handleCreateWorkspace = async (name: string, type: 'private' | 'public') => {
    try {
      setIsLoading(true);
      await apiClient.post('/workspaces', { name, type });
      await fetchWorkspaces();
      setShowCreateWorkspace(false);
      showToast({
        type: 'success',
        title: 'Success',
        message: 'Workspace created successfully',
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Failed to create workspace:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.error || 'Failed to create workspace',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (form: Form) => {
    setFormToDelete(form);
    setShowActionsFor(null);
  };

  const handleDeleteForm = async () => {
    if (!formToDelete || !activeWorkspace) return;
    
    try {
      setIsDeleting(true);
      await apiClient.delete(`/workspaces/${activeWorkspace.id}/forms/${formToDelete.id}`);
      setForms(forms.filter(form => form.id !== formToDelete.id));
      
      showToast({
        type: 'success',
        title: 'Success',
        message: 'Form deleted successfully',
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Failed to delete form:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.error || 'Failed to delete form',
        duration: 3000,
      });
    } finally {
      setIsDeleting(false);
      setFormToDelete(null);
    }
  };

  const handleCreateForm = async (name: string) => {
    if (!activeWorkspace) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Please select a workspace first',
        duration: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiClient.post(`/workspaces/${activeWorkspace.id}/forms`, {
        name,
        is_private: true // Always create private forms
      });
      
      // Redirect to form editor
      router.push(`/dashboard/forms/${response.data.id}`);
      
      showToast({
        type: 'success',
        title: 'Success',
        message: 'Form created successfully',
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Failed to create form:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.error || 'Failed to create form',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
      setShowCreateForm(false);
    }
  };

  // Add a function to refresh forms only
  const refreshForms = async () => {
    if (!activeWorkspace) return;
    await fetchForms(activeWorkspace.id);
  };

  // Refresh forms when component mounts or when returning to the page
  useEffect(() => {
    if (activeWorkspace) {
      refreshForms();
    }
  }, []);

  return (
    <>
      <div className="h-screen flex gap-4 p-4">
        {/* Sidebar */}
        <div className="w-60 bg-[#f7f7f8] flex flex-col rounded-2xl">
          {/* Create new form button */}
          <div className="p-4">
            <button 
              onClick={() => setShowCreateForm(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#262626] text-white rounded-lg text-sm font-medium font-[family-name:var(--font-nunito)] hover:bg-black transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Create Form
            </button>
          </div>

          {/* Search */}
          <div className="px-4 mb-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search workspaces"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm font-[family-name:var(--font-nunito)] text-black bg-white border border-gray-200 rounded-md placeholder-gray-400 focus:outline-none focus:border-gray-300"
              />
            </div>
          </div>

          {/* Workspaces */}
          <div className="px-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-jedira-italic text-gray-900">Workspaces</span>
              <button 
                onClick={() => setShowCreateWorkspace(true)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <PlusIcon className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="space-y-3">
              {/* Private Workspace Section */}
              <div>
                <button 
                  onClick={() => setIsPrivateExpanded(!isPrivateExpanded)}
                  className="w-full flex items-center justify-between group px-3 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-[family-name:var(--font-nunito)] text-gray-900">Private</span>
                  {isPrivateExpanded ? (
                    <ChevronUpIcon className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                {isPrivateExpanded && (
                  <div className="mt-2 ml-3 space-y-2">
                    {isLoading ? (
                      <div className="flex items-center justify-center p-3">
                        <div className="w-4 h-4 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
                      </div>
                    ) : workspaces.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500 bg-gray-50 rounded-lg">No workspaces found</div>
                    ) : (
                      workspaces.map((workspace) => (
                        <div 
                          key={workspace.id} 
                          onClick={() => handleWorkspaceClick(workspace)}
                          className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                            activeWorkspace?.id === workspace.id 
                              ? 'bg-gray-100 shadow-sm' 
                              : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full ${
                            activeWorkspace?.id === workspace.id 
                              ? 'bg-blue-500' 
                              : 'bg-gray-300 group-hover:bg-blue-400'
                          }`} />
                          <span className="text-sm font-[family-name:var(--font-nunito)] text-gray-900 flex-1">
                            {workspace.name}
                          </span>
                          {activeWorkspace?.id === workspace.id && (
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Public Workspace Section */}
              <div>
                <button 
                  onClick={() => setIsPublicExpanded(!isPublicExpanded)}
                  className="w-full flex items-center justify-between group px-3 py-2 bg-gray-50 rounded-lg cursor-not-allowed opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-[family-name:var(--font-nunito)] text-gray-900">Public</span>
                    <span className="px-1.5 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-full font-[family-name:var(--font-nunito)]">Coming Soon</span>
                  </div>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header with navigation */}
          <div className="bg-[#f7f7f8] rounded-t-2xl">
            <div className="flex items-center justify-between px-8 py-2">
              <nav className="flex space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-1 py-4 text-sm font-[family-name:var(--font-nunito)] border-b-2 ${
                      item.current
                        ? "border-black text-black"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <UserProfileDropdown />
            </div>
          </div>

          {/* Workspace section */}
          <div className="bg-[#f7f7f8] flex-1 rounded-b-2xl flex flex-col">
            {/* Workspace header */}
            <div className="flex items-center justify-between py-4 px-8 border-b border-gray-200">
              <div className="flex items-center">
                <h1 className="text-2xl font-jedira-italic text-gray-900">
                  {activeWorkspace ? activeWorkspace.name : 'Select a workspace'}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-[family-name:var(--font-nunito)] text-gray-700 hover:bg-white rounded-md">
                  <span>Date created</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
                <div className="flex items-center rounded-md border border-gray-200">
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 ${viewMode === 'list' ? 'bg-white' : 'hover:bg-white'} rounded-l-md`}
                  >
                    <ListBulletIcon className="w-4 h-4 text-gray-700" />
                  </button>
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 ${viewMode === 'grid' ? 'bg-white' : 'hover:bg-white'} rounded-r-md`}
                  >
                    <Squares2X2Icon className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>

            {/* Forms list/grid */}
            <div className="flex-1 p-8">
              {!activeWorkspace ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <Squares2X2Icon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-jedira-italic text-gray-900 mb-2">Select a workspace</h3>
                    <p className="text-sm font-[family-name:var(--font-nunito)] text-gray-500 mb-6 max-w-sm mx-auto">
                      Choose a workspace from the sidebar to view its forms or create a new form.
                    </p>
                    <button 
                      onClick={() => setShowCreateForm(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#262626] text-white rounded-lg text-sm font-medium font-[family-name:var(--font-nunito)] hover:bg-black transition-colors"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Create Form
                    </button>
                  </div>
                </div>
              ) : isLoadingForms ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <Squares2X2Icon className="w-8 h-8 text-gray-400 animate-pulse" />
                    </div>
                    <p className="text-sm font-[family-name:var(--font-nunito)] text-gray-500">Loading forms...</p>
                  </div>
                </div>
              ) : forms.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <PlusIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-jedira-italic text-gray-900 mb-2">No forms created yet</h3>
                    <p className="text-sm font-[family-name:var(--font-nunito)] text-gray-500 mb-6 max-w-sm mx-auto">
                      Get started by creating your first form. You can create surveys, feedback forms, or any type of form you need.
                    </p>
                    <button 
                      onClick={() => setShowCreateForm(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#262626] text-white rounded-lg text-sm font-medium font-[family-name:var(--font-nunito)] hover:bg-black transition-colors"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Create Form
                    </button>
                  </div>
                </div>
              ) : viewMode === 'list' ? (
                // List view
                <div className="space-y-2">
                  {forms.map((form) => (
                    <div key={form.id} className="group flex items-center gap-4 p-4 bg-white rounded-lg hover:bg-gray-50">
                      <div className="relative">
                        <div className={`w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-medium font-[family-name:var(--font-nunito)]`}>
                          {getInitials(form.name)}
                        </div>
                        {form.is_private && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                            <LockClosedIcon className="w-3 h-3 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 font-[family-name:var(--font-nunito)]">{form.name}</h3>
                        <p className="text-xs text-gray-500 font-[family-name:var(--font-nunito)]">Created {new Date(form.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => handleActionClick(form.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <EllipsisVerticalIcon className="w-5 h-5" />
                        </button>
                        {showActionsFor === form.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            <Link 
                              href={`/dashboard/forms/${form.id}`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-[family-name:var(--font-nunito)]"
                            >
                              <PencilIcon className="w-4 h-4" />
                              Edit
                            </Link>
                            <button 
                              onClick={() => handleViewAnalytics(form)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-[family-name:var(--font-nunito)]"
                            >
                              <ChartBarIcon className="w-4 h-4" />
                              Analytics
                            </button>
                            <button 
                              onClick={() => handleCopyLink(form.id)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-[family-name:var(--font-nunito)]"
                            >
                              <LinkIcon className="w-4 h-4" />
                              Copy link
                            </button>
                            <button 
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-[family-name:var(--font-nunito)]"
                            >
                              <DocumentDuplicateIcon className="w-4 h-4" />
                              Duplicate
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(form)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 font-[family-name:var(--font-nunito)]"
                            >
                              <TrashIcon className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Grid view
                <div className="grid grid-cols-3 gap-4">
                  {forms.map((form) => (
                    <div key={form.id} className="group bg-white rounded-lg p-4 hover:bg-gray-50">
                      <div className="relative mb-3">
                        <div className={`w-full aspect-video bg-blue-500 rounded-lg flex items-center justify-center text-white text-2xl font-medium font-[family-name:var(--font-nunito)]`}>
                          {getInitials(form.name)}
                        </div>
                        {form.is_private && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <LockClosedIcon className="w-4 h-4 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 font-[family-name:var(--font-nunito)]">{form.name}</h3>
                          <p className="text-xs text-gray-500 font-[family-name:var(--font-nunito)]">Created {new Date(form.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => handleActionClick(form.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <EllipsisVerticalIcon className="w-5 h-5" />
                          </button>
                          {showActionsFor === form.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                              <Link 
                                href={`/dashboard/forms/${form.id}`}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-[family-name:var(--font-nunito)]"
                              >
                                <PencilIcon className="w-4 h-4" />
                                Edit
                              </Link>
                              <button 
                                onClick={() => handleViewAnalytics(form)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-[family-name:var(--font-nunito)]"
                              >
                                <ChartBarIcon className="w-4 h-4" />
                                Analytics
                              </button>
                              <button 
                                onClick={() => handleCopyLink(form.id)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-[family-name:var(--font-nunito)]"
                              >
                                <LinkIcon className="w-4 h-4" />
                                Copy link
                              </button>
                              <button 
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-[family-name:var(--font-nunito)]"
                              >
                                <DocumentDuplicateIcon className="w-4 h-4" />
                                Duplicate
                              </button>
                              <button 
                                onClick={() => handleDeleteClick(form)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 font-[family-name:var(--font-nunito)]"
                              >
                                <TrashIcon className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Modal */}
      {selectedForm && (
        <AnalyticsModal
          form={selectedForm}
          onClose={() => setSelectedForm(null)}
        />
      )}

      {/* Create Form Modal */}
      {showCreateForm && (
        <CreateFormModal
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateForm}
          isLoading={isLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      {formToDelete && (
        <DeleteConfirmationModal
          form={formToDelete}
          onClose={() => setFormToDelete(null)}
          onConfirm={handleDeleteForm}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
} 