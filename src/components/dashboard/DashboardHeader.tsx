'use client';

import { useState } from 'react';
import ThemeToggle from '../common/ThemeToggle';
import { Bell, Menu } from 'lucide-react';

export default function DashboardHeader() {
  const [notifications, setNotifications] = useState([]);

  return (
    <header className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            사고 탐정
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button className="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            {notifications.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {notifications.length}
              </span>
            )}
          </button>
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700">
            {/* Profile picture or placeholder */}
          </div>
        </div>
      </div>
    </header>
  );
}