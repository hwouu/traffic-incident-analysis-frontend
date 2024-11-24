'use client';
import React, { useState, useEffect } from 'react';
import HexagonLoadingAnimation from './loading'; // 로딩 애니메이션 컴포넌트 import
import ChatInterface from '@/components/chat/ChatInterface';

export default function ChatPage() {
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리

  // 로딩 상태를 3초 후에 false로 전환 (예시)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">
          사고 분석 챗봇
        </h1>
      </div>
      <div className="relative flex flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {isLoading ? (
          <HexagonLoadingAnimation /> // 로딩 중일 때 애니메이션 표시
        ) : (
          <ChatInterface /> // 로딩이 끝난 후 실제 인터페이스 표시
        )}
      </div>
    </div>
  );
}