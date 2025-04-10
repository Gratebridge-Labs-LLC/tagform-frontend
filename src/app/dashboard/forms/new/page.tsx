"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";
import { useToast } from "@/contexts/toast-context";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function NewForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      showToast({
        type: "error",
        title: "Error",
        message: "Please enter a form name",
        duration: 3000
      });
      return;
    }

    try {
      setIsLoading(true);
      // Get active workspace from localStorage
      const activeWorkspace = localStorage.getItem('activeWorkspace');
      if (!activeWorkspace) {
        showToast({
          type: "error",
          title: "Error",
          message: "No workspace selected. Please select a workspace first.",
          duration: 3000
        });
        router.push('/dashboard');
        return;
      }

      const workspace = JSON.parse(activeWorkspace);
      
      // Create new form
      const response = await apiClient.post(`/workspaces/${workspace.id}/forms`, {
        name: name.trim(),
        description: description.trim(),
        is_private: isPrivate
      });

      // Redirect to form editor with the new form ID
      router.push(`/dashboard/forms/${response.data.id}`);
    } catch (error) {
      console.error('Failed to create form:', error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to create form. Please try again.",
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[500px] rounded-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-900">Create New Form</h2>
          <button 
            onClick={() => router.push('/dashboard')}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleCreateForm} className="p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Form Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter form name"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter form description"
              rows={3}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-700">
              Make form private
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Form'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 