'use client';
import React, { useState, useEffect } from 'react';
import HexagonLoadingAnimation from './loading'; // 로딩 애니메이션 컴포넌트 import
import ChatInterface from '@/components/chat/ChatInterface';

export default function ChatPage() {
  const [showLoading, setShowLoading] = useState(false);
   // 버튼 클릭 시 로딩 애니메이션 표시 상태 토글
   const toggleLoadingAnimation = () => {
    setShowLoading((prev) => !prev);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">
          사고 분석 챗봇
        </h1>
        <button
          onClick={toggleLoadingAnimation}
          className="mt-2 rounded bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          {showLoading ? '로딩 애니메이션 숨기기' : '로딩 애니메이션 보기'}
        </button>
      </div>
      <div className="relative flex flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {showLoading ? (
          <HexagonLoadingAnimation /> // 버튼으로 제어되는 로딩 애니메이션
        ) : (
          <ChatInterface /> // 로딩 애니메이션이 숨겨지면 인터페이스 표시
        )}
      </div>
    </div>
  );
}