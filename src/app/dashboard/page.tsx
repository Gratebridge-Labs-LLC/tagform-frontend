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
  ChevronUpIcon
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Forms", href: "/dashboard", current: true },
  { name: "Integrations", href: "/dashboard/integrations", current: false },
  { name: "Brand kit", href: "/dashboard/brand-kit", current: false },
];

export default function Dashboard() {
  const [isPrivateExpanded, setIsPrivateExpanded] = useState(true);
  const [isPublicExpanded, setIsPublicExpanded] = useState(true);

  return (
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
            <button className="p-1 hover:bg-white rounded">
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
                    <span className="text-xs font-[family-name:var(--font-nunito)] text-gray-500">0</span>
                  </div>
                </div>
              )}
            </div>

            {/* Public Workspace Section */}
            <div>
              <button 
                onClick={() => setIsPublicExpanded(!isPublicExpanded)}
                className="w-full flex items-center justify-between group px-2 py-1.5 bg-white rounded hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-[family-name:var(--font-nunito)] text-gray-900">Public</span>
                {isPublicExpanded ? (
                  <ChevronUpIcon className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {isPublicExpanded && (
                <div className="mt-0.5 ml-2 space-y-0.5">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-gray-100 rounded">
                    <span className="text-sm font-[family-name:var(--font-nunito)] text-gray-900">Team workspace</span>
                    <span className="text-xs font-[family-name:var(--font-nunito)] text-gray-500">0</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header with navigation */}
        <div className="bg-[#f7f7f8] rounded-t-2xl">
          <nav className="flex space-x-8 px-8 py-2">
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
        </div>

        {/* Workspace section */}
        <div className="bg-[#f7f7f8] flex-1 rounded-b-2xl flex flex-col">
          {/* Workspace header */}
          <div className="flex items-center justify-between py-4 px-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-jedira-italic text-gray-900">My workspace</h1>
              <button className="text-gray-400 hover:text-gray-600">
                <EllipsisHorizontalIcon className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-1.5 text-sm font-[family-name:var(--font-nunito)] text-gray-500 hover:text-gray-700">
                <UserPlusIcon className="w-4 h-4" />
                <span>Invite</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-[family-name:var(--font-nunito)] text-gray-700 hover:bg-white rounded-md">
                <span>Date created</span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>
              <div className="flex items-center rounded-md border border-gray-200">
                <button className="p-1.5 hover:bg-white rounded-l-md">
                  <ListBulletIcon className="w-4 h-4 text-gray-700" />
                </button>
                <button className="p-1.5 hover:bg-white rounded-r-md">
                  <Squares2X2Icon className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>
          </div>

          {/* Empty state */}
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
        </div>
      </div>
    </div>
  );
} 