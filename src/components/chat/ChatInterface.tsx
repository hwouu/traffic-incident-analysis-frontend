'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Camera } from 'lucide-react';
import MediaUpload from './MediaUpload';
import WebcamStream from './WebcamStream';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartWebcam = () => {
    if (confirm('녹화를 시작하시겠습니까?')) {
      setIsWebcamActive(true);
      setHasError(false);
    }
  };

  const handleStopWebcam = () => {
    setIsWebcamActive(false);
    setHasError(false);
  };

  const handleRecordingError = (error: string) => {
    if (!hasError) {
      setHasError(true);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content: `오류가 발생했습니다: ${error}`,
        timestamp: new Date()
      }]);
    }
  };

  const handleUploadSuccess = (path: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'bot',
        content: '영상이 성공적으로 업로드되었습니다.',
        timestamp: new Date()
      },
      {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `파일 경로: ${path}`,
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* 미디어 컨트롤 */}
      <div className="border-b border-gray-200 p-3 dark:border-gray-700 md:p-4">
        <div className="flex flex-wrap gap-2 md:flex-nowrap md:space-x-4">
          <button
            onClick={() => setShowMediaUpload(true)}
            className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 md:flex-none"
          >
            <Paperclip className="h-4 w-4" />
            <span>미디어 업로드</span>
          </button>
          <button
            onClick={isWebcamActive ? handleStopWebcam : handleStartWebcam}
            className={`flex flex-1 items-center justify-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors md:flex-none ${
              isWebcamActive 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Camera className="h-4 w-4" />
            <span>웹캠 {isWebcamActive ? '끄기' : '켜기'}</span>
          </button>
        </div>
      </div>

      {/* 웹캠 스트림 */}
      {isWebcamActive && (
        <div className="border-b border-gray-200 p-3 dark:border-gray-700 md:p-4">
          <WebcamStream
            onError={handleRecordingError}
            onUploadSuccess={handleUploadSuccess}
            className="mx-auto max-w-2xl"
          />
        </div>
      )}

      {/* 채팅 메시지 */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-4 py-2 ${
                  message.type === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 미디어 업로드 모달 */}
      {showMediaUpload && (
        <MediaUpload onClose={() => setShowMediaUpload(false)} />
      )}
    </div>
  );
}