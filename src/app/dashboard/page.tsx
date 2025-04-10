"use client";

import Link from "next/link";
import { useState } from "react";
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
const getInitials = (title: string) => {
  return title
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

type Tab = 'overview' | 'submissions' | 'settings';

interface AnalyticsModalProps {
  form: typeof sampleForms[0];
  onClose: () => void;
}

const AnalyticsModal = ({ form, onClose }: AnalyticsModalProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [notifySubmitter, setNotifySubmitter] = useState(true);
  const [notifyOwner, setNotifyOwner] = useState(true);
  const [isFormEnabled, setIsFormEnabled] = useState(true);

  const tabs: { id: Tab; name: string }[] = [
    { id: 'overview', name: 'Overview' },
    { id: 'submissions', name: 'Submissions' },
    { id: 'settings', name: 'Settings' },
  ];

  const sampleSubmissions = [
    { id: 1, name: 'John Doe', email: 'john@example.com', submittedAt: '2024-03-15 14:30' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', submittedAt: '2024-03-15 15:45' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', submittedAt: '2024-03-16 09:15' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 font-[family-name:var(--font-nunito)] mb-2">Total Submissions</h4>
                <p className="text-3xl font-medium text-gray-900 font-[family-name:var(--font-nunito)]">{form.responses}</p>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 font-[family-name:var(--font-nunito)] mb-2">Completion Rate</h4>
                <p className="text-3xl font-medium text-gray-900 font-[family-name:var(--font-nunito)]">85%</p>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 font-[family-name:var(--font-nunito)] mb-2">Avg. Time</h4>
                <p className="text-3xl font-medium text-gray-900 font-[family-name:var(--font-nunito)]">2m 30s</p>
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
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-nunito)]">Name</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-nunito)]">Email</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-nunito)]">Submitted At</th>
                    <th scope="col" className="relative px-6 py-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sampleSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-[family-name:var(--font-nunito)]">{submission.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-[family-name:var(--font-nunito)]">{submission.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-[family-name:var(--font-nunito)]">{submission.submittedAt}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button className="text-gray-400 hover:text-gray-600">
                          <EllipsisVerticalIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            <div className={`w-12 h-12 ${form.color} rounded-xl flex items-center justify-center text-white text-lg font-medium font-[family-name:var(--font-nunito)]`}>
              {getInitials(form.title)}
            </div>
            <div>
              <h2 className="text-2xl font-medium text-gray-900 font-[family-name:var(--font-nunito)] mb-1">{form.title}</h2>
              <p className="text-sm text-gray-500 font-[family-name:var(--font-nunito)]">Created on {new Date(form.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
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

interface CreateWorkspaceModalProps {
  onClose: () => void;
  onSubmit: (name: string, type: 'private' | 'public') => void;
}

const CreateWorkspaceModal = ({ onClose, onSubmit }: CreateWorkspaceModalProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'private' | 'public'>('private');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, type);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] rounded-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-900 font-[family-name:var(--font-nunito)]">Create Workspace</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="workspace-name" className="block text-sm font-medium text-gray-900 font-[family-name:var(--font-nunito)] mb-2">
              Workspace Name
            </label>
            <input
              type="text"
              id="workspace-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg font-[family-name:var(--font-nunito)] placeholder-gray-400 focus:outline-none focus:border-gray-300 text-gray-900"
              placeholder="Enter workspace name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 font-[family-name:var(--font-nunito)] mb-3">
              Workspace Type
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="workspace-type"
                  value="private"
                  checked={type === 'private'}
                  onChange={(e) => setType(e.target.value as 'private' | 'public')}
                  className="text-black focus:ring-0 focus:ring-offset-0"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 font-[family-name:var(--font-nunito)]">Private</p>
                  <p className="text-sm text-gray-500 font-[family-name:var(--font-nunito)]">Only you can access this workspace</p>
                </div>
              </label>
              <div className="relative">
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-not-allowed bg-gray-50">
                  <input
                    type="radio"
                    name="workspace-type"
                    value="public"
                    disabled
                    className="text-gray-300 focus:ring-0 focus:ring-offset-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 font-[family-name:var(--font-nunito)]">Public</p>
                      <span className="px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-full font-[family-name:var(--font-nunito)]">Coming Soon</span>
                    </div>
                    <p className="text-sm text-gray-500 font-[family-name:var(--font-nunito)]">Anyone with the link can access</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 font-[family-name:var(--font-nunito)] hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white font-[family-name:var(--font-nunito)] bg-black hover:bg-gray-900 rounded-lg transition-colors"
            >
              Create Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [isPrivateExpanded, setIsPrivateExpanded] = useState(true);
  const [isPublicExpanded, setIsPublicExpanded] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showActionsFor, setShowActionsFor] = useState<string | null>(null);
  const [selectedForm, setSelectedForm] = useState<typeof sampleForms[0] | null>(null);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);

  const handleActionClick = (formId: string) => {
    setShowActionsFor(showActionsFor === formId ? null : formId);
  };

  const handleCopyLink = (formId: string) => {
    navigator.clipboard.writeText(`https://yourapp.com/forms/${formId}`);
    setShowActionsFor(null);
  };

  const handleViewAnalytics = (form: typeof sampleForms[0]) => {
    setSelectedForm(form);
    setShowActionsFor(null);
  };

  const handleCreateWorkspace = (name: string, type: 'private' | 'public') => {
    // Here you would typically make an API call to create the workspace
    console.log('Creating workspace:', { name, type });
    setShowCreateWorkspace(false);
  };

  return (
    <>
      <div className="h-screen flex gap-4 p-4">
        {/* Sidebar */}
        <div className="w-60 bg-[#f7f7f8] flex flex-col rounded-2xl">
          {/* Create new form button */}
          <div className="p-4">
            <Link href="/dashboard/forms/new" className="w-full flex items-center gap-2 px-4 py-2 bg-[#262626] text-white rounded-md text-sm font-[family-name:var(--font-nunito)] hover:bg-black">
              <PlusIcon className="w-4 h-4" />
              Create a new form
            </Link>
          </div>

          {/* Search */}
          <div className="px-4 mb-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-9 pr-3 py-2 text-sm font-[family-name:var(--font-nunito)] bg-white border border-gray-200 rounded-md placeholder-gray-400 focus:outline-none focus:border-gray-300"
              />
            </div>
          </div>

          {/* Workspaces */}
          <div className="px-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-jedira-italic text-gray-900">Workspaces</span>
              <button 
                onClick={() => setShowCreateWorkspace(true)}
                className="p-1 hover:bg-white rounded"
              >
                <PlusIcon className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="space-y-2">
              {/* Private Workspace Section */}
              <div>
                <button 
                  onClick={() => setIsPrivateExpanded(!isPrivateExpanded)}
                  className="w-full flex items-center justify-between group px-2 py-1.5 bg-white rounded hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-[family-name:var(--font-nunito)] text-gray-900">Private</span>
                  {isPrivateExpanded ? (
                    <ChevronUpIcon className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                {isPrivateExpanded && (
                  <div className="mt-0.5 ml-2 space-y-0.5">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-gray-100 rounded">
                      <span className="text-sm font-[family-name:var(--font-nunito)] text-gray-900">My workspace</span>
                      <span className="text-xs font-[family-name:var(--font-nunito)] text-gray-500">
                        {sampleForms.filter(f => f.isPrivate).length}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Public Workspace Section */}
              <div>
                <button 
                  onClick={() => setIsPublicExpanded(!isPublicExpanded)}
                  className="w-full flex items-center justify-between group px-2 py-1.5 bg-gray-50 rounded cursor-not-allowed"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-[family-name:var(--font-nunito)] text-gray-900">Public</span>
                    <span className="px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-full font-[family-name:var(--font-nunito)]">Coming Soon</span>
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
                <h1 className="text-2xl font-jedira-italic text-gray-900">My workspace</h1>
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
              {sampleForms.length === 0 ? (
                // Empty state (commented out but preserved)
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <PlusIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-jedira-italic text-gray-900 mb-2">No forms created yet</h3>
                    <p className="text-sm font-[family-name:var(--font-nunito)] text-gray-500 mb-6 max-w-sm mx-auto">
                      Get started by creating your first form. You can create surveys, feedback forms, or any type of form you need.
                    </p>
                    <Link href="/dashboard/forms/new" className="inline-flex items-center gap-2 px-4 py-2 bg-[#262626] text-white rounded-md text-sm font-[family-name:var(--font-nunito)] hover:bg-black">
                      <PlusIcon className="w-4 h-4" />
                      Create your first form
                    </Link>
                  </div>
                </div>
              ) : viewMode === 'list' ? (
                // List view
                <div className="space-y-2">
                  {sampleForms.map((form) => (
                    <div key={form.id} className="group flex items-center gap-4 p-4 bg-white rounded-lg hover:bg-gray-50">
                      <div className="relative">
                        <div className={`w-12 h-12 ${form.color} rounded-lg flex items-center justify-center text-white font-medium font-[family-name:var(--font-nunito)]`}>
                          {getInitials(form.title)}
                        </div>
                        {form.isPrivate && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                            <LockClosedIcon className="w-3 h-3 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 font-[family-name:var(--font-nunito)]">{form.title}</h3>
                        <p className="text-xs text-gray-500 font-[family-name:var(--font-nunito)]">{form.responses} responses</p>
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
                            <button 
                              onClick={() => handleViewAnalytics(form)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-[family-name:var(--font-nunito)]"
                            >
                              <ChartBarIcon className="w-4 h-4" />
                              View
                            </button>
                            <Link 
                              href={`/dashboard/forms/${form.id}`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-[family-name:var(--font-nunito)]"
                            >
                              <PencilIcon className="w-4 h-4" />
                              Edit
                            </Link>
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
                  {sampleForms.map((form) => (
                    <div key={form.id} className="group bg-white rounded-lg p-4 hover:bg-gray-50">
                      <div className="relative mb-3">
                        <div className={`w-full aspect-video ${form.color} rounded-lg flex items-center justify-center text-white text-2xl font-medium font-[family-name:var(--font-nunito)]`}>
                          {getInitials(form.title)}
                        </div>
                        {form.isPrivate && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <LockClosedIcon className="w-4 h-4 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 font-[family-name:var(--font-nunito)]">{form.title}</h3>
                          <p className="text-xs text-gray-500 font-[family-name:var(--font-nunito)]">{form.responses} responses</p>
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
                              <button 
                                onClick={() => handleViewAnalytics(form)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-[family-name:var(--font-nunito)]"
                              >
                                <ChartBarIcon className="w-4 h-4" />
                                View
                              </button>
                              <Link 
                                href={`/dashboard/forms/${form.id}`}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-[family-name:var(--font-nunito)]"
                              >
                                <PencilIcon className="w-4 h-4" />
                                Edit
                              </Link>
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

      {/* Create Workspace Modal */}
      {showCreateWorkspace && (
        <CreateWorkspaceModal
          onClose={() => setShowCreateWorkspace(false)}
          onSubmit={handleCreateWorkspace}
        />
      )}
    </>
  );
} 