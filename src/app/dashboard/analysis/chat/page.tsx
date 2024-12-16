'use client';

import React, { useState, useEffect } from 'react';
import HexagonLoadingAnimation from './loading';
import ChatInterface from '@/components/chat/ChatInterface';

export default function ChatPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">
          사고 분석 챗봇
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          사고 상황을 설명하고 관련 미디어를 제공하면 AI가 분석 결과를 제공합니다.
        </p>
      </div>
      
      <div className="relative flex flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {isAnalyzing ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 backdrop-blur-sm dark:bg-white/10">
            <HexagonLoadingAnimation />
          </div>
        ) : null}
        
        <ChatInterface 
          onAnalysisStart={() => setIsAnalyzing(true)}
          onAnalysisEnd={() => setIsAnalyzing(false)}
        />
      </div>
    </div>
  );
}