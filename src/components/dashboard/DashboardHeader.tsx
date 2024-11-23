'use client';

import { useState } from 'react';
import ThemeToggle from '../common/ThemeToggle';
import { Bell } from 'lucide-react';
import Logo from '../common/Logo';

export default function DashboardHeader() {
  const [notifications] = useState<Array<any>>([]);

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
      <div className="flex h-14 items-center justify-between px-6">
        <Logo variant="with-text" size="md" className="text-gray-900 dark:text-white" />
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ThemeToggle className="relative" />
            <div className="relative">
              <button className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                {notifications.length > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            {/* 프로필 이미지가 있다면 추가 */}
          </div>
        </div>
      </div>
    </header>
  );
}