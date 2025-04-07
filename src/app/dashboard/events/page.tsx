"use client";

import { motion } from "framer-motion";
import {
  CalendarDaysIcon,
  DocumentCheckIcon,
  UsersIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

// Sample events data
const events = [
  {
    id: 1,
    title: "Tech Conference 2024",
    date: "March 15, 2024",
    time: "09:00 AM",
    submissions: 450,
    totalForms: 500,
    description: "Annual technology conference featuring the latest innovations",
  },
  {
    id: 2,
    title: "Product Launch",
    date: "March 20, 2024",
    time: "02:00 PM",
    submissions: 200,
    totalForms: 300,
    description: "Launch event for our new product line",
  },
  {
    id: 3,
    title: "Team Workshop",
    date: "March 25, 2024",
    time: "10:00 AM",
    submissions: 30,
    totalForms: 50,
    description: "Interactive workshop for team building",
  },
  {
    id: 4,
    title: "Annual Meeting",
    date: "April 5, 2024",
    time: "11:00 AM",
    submissions: 150,
    totalForms: 200,
    description: "Annual stakeholders meeting",
  },
];

export default function Events() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all your events
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard"
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <CalendarDaysIcon className="w-4 h-4 mr-2" />
            Calendar View
          </Link>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-900"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Event
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {event.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {event.description}
              </p>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <CalendarDaysIcon className="w-4 h-4 mr-2" />
                <span>{event.date} at {event.time}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <DocumentCheckIcon className="w-4 h-4 text-purple-600 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {event.submissions}
                    </div>
                    <div className="text-xs text-gray-500">Submissions</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <UsersIcon className="w-4 h-4 text-purple-600 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {event.totalForms}
                    </div>
                    <div className="text-xs text-gray-500">Total Forms</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
                View Details →
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 