'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Camera, Loader2 } from 'lucide-react';
import MediaUpload from './MediaUpload';
import WebcamStream from './WebcamStream';
import {
  ChatMessage,
  Report,
  ChatInterfaceProps,
  ChatPhase
} from '@/types/report';
import {
  analyzeSituation,
  uploadStreamVideo,
  updateDescription
} from '@/lib/api/chatbot';

export default function ChatInterface({ onAnalysisStart, onAnalysisEnd }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phase, setPhase] = useState<ChatPhase>(1);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([{
      id: 'welcome',
      type: 'bot',
      content: '안녕하세요! 교통사고 분석 시스템입니다. 사고 발생 시간, 장소, 상황을 자세히 설명해 주세요.',
      timestamp: new Date()
    }]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (content: string, type: ChatMessage['type'] = 'bot') => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    }]);
  };

  const handleStartWebcam = () => {
    if (phase !== 2) {
      addMessage('먼저 사고 정보를 입력해주세요.', 'error');
      return;
    }
    
    if (confirm('녹화를 시작하시겠습니까?')) {
      setIsWebcamActive(true);
    }
  };

  const handleStopWebcam = () => {
    setIsWebcamActive(false);
  };

  const handleWebcamUploadSuccess = async (path: string) => {
    try {
      if (!currentReport) return;

      const response = await uploadStreamVideo(
        new Blob([path], { type: 'video/mp4' }),
        currentReport.report_id,
        currentReport.user_id
      );
      
      if (response.updatedReport) {
        setCurrentReport(response.updatedReport);
        await requestFinalAnalysis(response.updatedReport.fileUrl || [], 'video');
      }
    } catch (error) {
      addMessage(
        error instanceof Error ? error.message : '웹캠 영상 업로드 중 오류가 발생했습니다.',
        'error'
      );
    }
  };

  const handleMediaUploadSuccess = async (urls: string[]) => {
    try {
      if (!currentReport) return;
      
      await requestFinalAnalysis(urls, 'image');
      setShowMediaUpload(false);
    } catch (error) {
      addMessage(
        error instanceof Error ? error.message : '파일 처리 중 오류가 발생했습니다.',
        'error'
      );
    }
  };

  const requestFinalAnalysis = async (fileUrls: string[], fileType: 'image' | 'video') => {
    if (!currentReport?.report_id) return;

    setIsLoading(true);
    onAnalysisStart?.();
    
    try {
      const { report } = await updateDescription(
        currentReport.report_id,
        fileUrls,
        fileType
      );
      
      setCurrentReport(report);
      addMessage(report.description || '분석이 완료되었습니다.');
      setPhase(3);
    } catch (error) {
      addMessage(
        error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.',
        'error'
      );
    } finally {
      setIsLoading(false);
      onAnalysisEnd?.();
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const messageContent = input.trim();
    setInput('');
    addMessage(messageContent, 'user');

    if (phase === 1) {
      setIsLoading(true);
      try {
        const response = await analyzeSituation(messageContent);
        
        addMessage(response.data.analysis.추가질문);
        setCurrentReport(response.data.report.report);
        setPhase(2);
      } catch (error) {
        addMessage(
          error instanceof Error ? error.message : '메시지 전송 중 오류가 발생했습니다.',
          'error'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* 미디어 컨트롤 */}
      <div className="border-b border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900 md:p-4">
        <div className="flex flex-wrap gap-2 md:flex-nowrap md:space-x-4">
          <button
            onClick={() => setShowMediaUpload(true)}
            disabled={phase !== 2}
            className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 md:flex-none"
          >
            <Paperclip className="h-4 w-4" />
            <span>미디어 업로드</span>
          </button>
          <button
            onClick={isWebcamActive ? handleStopWebcam : handleStartWebcam}
            disabled={phase !== 2}
            className={`flex flex-1 items-center justify-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:flex-none ${
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
        <div className="border-b border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900 md:p-4">
          <WebcamStream
            onError={(error) => addMessage(error, 'error')}
            onUploadSuccess={handleWebcamUploadSuccess}
            className="mx-auto max-w-2xl"
          />
        </div>
      )}

      {/* 채팅 메시지 */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-3 dark:bg-gray-800 md:p-4">
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
                    : message.type === 'error'
                    ? 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100'
                    : 'bg-white text-gray-900 dark:bg-gray-700 dark:text-white'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 메시지 입력 */}
      <div className="border-t border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900 md:p-4">
        <div className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={phase !== 1 || isLoading}
            placeholder={
              phase === 1
                ? "사고 발생 시간, 장소, 상황을 설명해주세요..."
                : phase === 2
                ? "사진이나 영상을 업로드하거나 웹캠을 사용해주세요..."
                : "분석이 완료되었습니다."
            }
            className="flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading || phase !== 1}
            className="flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* 미디어 업로드 모달 */}
      {showMediaUpload && (
        <MediaUpload 
          onClose={() => setShowMediaUpload(false)}
          onUploadSuccess={handleMediaUploadSuccess}
          onError={(error) => addMessage(error, 'error')}
          reportId={currentReport?.report_id}
          userId={currentReport?.user_id}
        />
      )}
    </div>
  );
}