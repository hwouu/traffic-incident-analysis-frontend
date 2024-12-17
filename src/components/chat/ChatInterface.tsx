'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Camera, Loader2 } from 'lucide-react';
import MediaUpload from './MediaUpload';
import WebcamStream from './WebcamStream';
import { TypingIndicator } from './TypingIndicator';
import { ThinkingIndicator } from './ThinkingIndicator';
import { ChatMessage, Report, ChatInterfaceProps, ChatPhase } from '@/types/report';
import { analyzeSituation, uploadStreamVideo, updateDescription } from '@/lib/api/chatbot';

const WELCOME_MESSAGE = `안녕하세요! 사고탐정 AI 챗봇입니다. 
저는 사고 현장의 시간, 장소, 상황 정보와 현장 사진/영상을 분석하여 객관적인 사고 분석 리포트를 제공해드립니다.`;

const SERVICE_GUIDE = `사고 발생 시간, 장소, 상황을 입력해주시면 분석을 시작하겠습니다.`;

const EXAMPLE_PROMPT = '예시) 2024년 11월 15일 오전 10시 서울 강남구 테헤란로에서 차 사고가 났어.';

const MEDIA_REQUEST =
  '이미지, 동영상 또는 실시간 스트리밍 영상을 첨부해주시면 사고 상황을 자세히 분석해드릴 수 있어요.';

const MEDIA_GUIDE = '이미지는 최소 4장에서 최대 6장을 첨부하실 수 있어요. 동영상은 최대 100MB까지 분석 가능해요.';

const MEDIA_UPLOAD_GUIDE =
  '상단의 미디어 업로드 또는 웹캠 켜기 버튼을 이용해 사고 관련 자료를 업로드해주세요.';

const ANALYSIS_COMPLETE = '제공해주신 기초 정보와 자료를 바탕으로 AI 분석이 완료되었습니다.';

const REPORT_GUIDE =
  '생성된 사고 분석 리포트에는 다음과 같은 정보가 포함되어 있습니다:\n' +
  '- 사고 유형 및 심각도\n' +
  '- 차량 파손 상태\n' +
  '- 관련 차량 정보\n' +
  '자세한 내용은 아래 보고서 확인하기 버튼을 통해 확인하실 수 있습니다.';

export default function ChatInterface({ onAnalysisStart, onAnalysisEnd }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [phase, setPhase] = useState<ChatPhase>(1);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [showReportOptions, setShowReportOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initialMessage = async () => {
      await addMessageWithEffect(WELCOME_MESSAGE);
      await addMessageWithEffect(SERVICE_GUIDE);
      await addMessageWithEffect(EXAMPLE_PROMPT);
    };
    initialMessage();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessageWithEffect = async (content: string, type: ChatMessage['type'] = 'bot') => {
    if (type === 'bot') {
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsTyping(false);
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type,
        content,
        timestamp: new Date(),
      },
    ]);
  };

  const handleStartWebcam = () => {
    if (phase !== 2) {
      addMessageWithEffect('먼저 사고 정보를 입력해주세요.', 'error');
      return;
    }

    if (confirm('녹화를 시작하시겠습니까?')) {
      setIsWebcamActive(true);
      addMessageWithEffect(
        '웹캠이 활성화되었습니다. 녹화 시작 버튼을 눌러 촬영을 시작해주세요.',
        'bot'
      );
    }
  };

  const handleStopWebcam = () => {
    setIsWebcamActive(false);
    addMessageWithEffect('웹캠이 비활성화되었습니다.', 'bot');
  };

  const handleWebcamUploadSuccess = async (path: string) => {
    try {
      if (!currentReport) return;

      await addMessageWithEffect('웹캠 영상이 성공적으로 업로드되었습니다.', 'user');
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
      addMessageWithEffect(
        error instanceof Error ? error.message : '웹캠 영상 업로드 중 오류가 발생했습니다.',
        'error'
      );
    }
  };

  const handleMediaUploadSuccess = async (urls: string[]) => {
    try {
      if (!currentReport) return;

      await addMessageWithEffect(`${urls.length}개의 파일이 성공적으로 업로드되었습니다.`, 'user');
      await requestFinalAnalysis(urls, 'image');
      setShowMediaUpload(false);
    } catch (error) {
      addMessageWithEffect(
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
      const { report } = await updateDescription(currentReport.report_id, fileUrls, fileType);

      setCurrentReport(report);
      await addMessageWithEffect(ANALYSIS_COMPLETE);
      await addMessageWithEffect(report.description || '분석이 완료되었습니다.');
      await addMessageWithEffect(REPORT_GUIDE);
      setPhase(3);
      setShowReportOptions(true);
    } catch (error) {
      addMessageWithEffect(
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
    await addMessageWithEffect(messageContent, 'user');

    if (phase === 1) {
      setIsThinking(true);
      setIsLoading(true);
      try {
        const response = await analyzeSituation(messageContent);
        await addMessageWithEffect(response.data.analysis.추가질문);
        await addMessageWithEffect(MEDIA_REQUEST);
        await addMessageWithEffect(MEDIA_GUIDE);
        await addMessageWithEffect(MEDIA_UPLOAD_GUIDE);
        setCurrentReport(response.data.report.report);
        setPhase(2);
      } catch (error) {
        addMessageWithEffect(
          error instanceof Error ? error.message : '메시지 전송 중 오류가 발생했습니다.',
          'error'
        );
      } finally {
        setIsThinking(false);
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
            onError={(error) => addMessageWithEffect(error, 'error')}
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
                className={`max-w-[75%] whitespace-pre-line rounded-lg px-4 py-2 ${
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
          {isTyping && <TypingIndicator />}
          {isThinking && <ThinkingIndicator />}
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
                ? EXAMPLE_PROMPT
                : phase === 2
                  ? '사진이나 영상을 업로드하거나 웹캠을 사용해주세요...'
                  : '분석이 완료되었습니다.'
            }
            className="flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading || phase !== 1}
            className="flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* 보고서 옵션 */}
      {showReportOptions && (
        <div className="flex justify-center space-x-4 border-t border-gray-200 p-4 dark:border-gray-700">
          <button
            onClick={() => (window.location.href = '/dashboard/reports')}
            className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-dark"
          >
            보고서 확인하기
          </button>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200"
          >
            채팅 다시 시작
          </button>
        </div>
      )}

      {/* 미디어 업로드 모달 */}
      {showMediaUpload && (
        <MediaUpload
          onClose={() => setShowMediaUpload(false)}
          onUploadSuccess={handleMediaUploadSuccess}
          onError={(error) => addMessageWithEffect(error, 'error')}
          reportId={currentReport?.report_id}
          userId={currentReport?.user_id}
        />
      )}
    </div>
  );
}
