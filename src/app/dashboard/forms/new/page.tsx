"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewForm() {
  const router = useRouter();

  useEffect(() => {
    // Generate a random form ID for now
    // In a real app, this would come from the backend
    const formId = Math.random().toString(36).substring(2, 15);
    router.replace(`/dashboard/forms/${formId}`);
  }, [router]);

  // Return null since this is just a transition page
  return null;
} 