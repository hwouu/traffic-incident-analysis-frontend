'use client';

import { useState, useEffect } from 'react';
import ThemeToggle from '../common/ThemeToggle';
import { Bell, Menu, Search, User } from 'lucide-react';
import Logo from '../common/Logo';
import { useDashboard } from '@/context/DashboardContext';
import Link from 'next/link';

export default function DashboardHeader() {
  const [notifications] = useState<Array<any>>([]);
  const { isMobileOpen, setIsMobileOpen } = useDashboard();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-900/95">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Section */}
        <div className="flex items-center md:gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Logo 
            variant="with-text" 
            size="md"
            className="hidden text-gray-900 dark:text-white md:block" 
            withLink={false}
          />
          <Logo 
            variant="icon-only" 
            size="md"
            className="block md:hidden" 
            withLink={false}
          />
        </div>

        {/* Center Section - Search Bar */}
        <div className="hidden flex-1 items-center justify-center px-4 md:flex md:px-6 lg:px-8">
          <div className="relative w-full max-w-lg">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 text-sm text-gray-900 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              placeholder="보고서 검색..."
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle className="relative" />

          {/* Notifications */}
          <button className="relative inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
            <Bell className="h-6 w-6" />
            {notifications.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                {notifications.length}
              </span>
            )}
          </button>

          {/* User Profile */}
          <button className="ml-2 flex items-center rounded-lg p-0.5 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
              <User className="h-5 w-5" />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Search - Visible only on mobile */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-800 md:hidden">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 text-sm text-gray-900 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            placeholder="보고서 검색..."
          />
        </div>
      </div>
    </header>
  );
}