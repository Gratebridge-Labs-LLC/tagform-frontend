"use client";

import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { UserCircleIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/api-client";
import { useToast } from "@/contexts/toast-context";

export default function UserProfileDropdown() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Get user from localStorage
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : null;
  const fullName = user?.user_metadata?.full_name || "User";
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await auth.logout();
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      
      showToast({
        type: "success",
        title: "Success",
        message: "Successfully logged out",
      });
      
      router.push("/auth/signin");
    } catch (error) {
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to logout",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
          {initials}
        </div>
        <span className="text-sm font-medium text-gray-900 font-[family-name:var(--font-nunito)]">
          {fullName}
        </span>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    active ? "bg-gray-100" : ""
                  } flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 font-[family-name:var(--font-nunito)]`}
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
} 