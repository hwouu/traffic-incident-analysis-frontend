'use client';

import ChatInterface from '@/components/chat/ChatInterface';

export default function ChatPage() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">
          사고 분석 챗봇
        </h1>
      </div>
      <div className="relative flex flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <ChatInterface />
      </div>
    </div>
  );
}