'use client';

import { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { uploadFiles } from '@/lib/api/files';

interface MediaUploadProps {
  onClose: () => void;
  onUploadSuccess?: (urls: string[]) => void;
  onError?: (error: string) => void;
}

export default function MediaUpload({ onClose, onUploadSuccess, onError }: MediaUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFilesAdded(droppedFiles);
  };

  const handleFilesAdded = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 100 * 1024 * 1024; // 100MB limit
      
      if (!isValidType || !isValidSize) {
        onError?.('이미지나 동영상 파일만 업로드 가능하며, 각 파일은 100MB를 초과할 수 없습니다.');
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      onError?.('업로드할 파일을 선택해주세요.');
      return;
    }

    try {
      setIsUploading(true);
      const response = await uploadFiles(files, setUploadProgress);
      
      if (response.files && onUploadSuccess) {
        onUploadSuccess(response.files);
      }
      onClose();
    } catch (error) {
      onError?.(error instanceof Error ? error.message : '파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-4 shadow-xl dark:bg-gray-800 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">미디어 업로드</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors md:h-48 ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-primary dark:border-gray-600'
            }`}
          >
            <Upload className="mb-2 h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              파일을 드래그하거나 클릭하여 업로드
            </p>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={(e) => {
                if (e.target.files) {
                  handleFilesAdded(Array.from(e.target.files));
                }
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-4 max-h-40 space-y-2 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-700"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                </span>
                <button
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                  className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {isUploading && (
          <div className="mt-4">
            <div className="mb-2 flex justify-between text-sm">
              <span>업로드 중...</span>
              <span>{uploadProgress.toFixed(0)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse justify-end space-y-2 space-y-reverse md:flex-row md:space-x-2 md:space-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            disabled={isUploading}
            className="w-full rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 md:w-auto"
          >
            취소
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUpload();
            }}
            disabled={isUploading || files.length === 0}
            className="flex w-full items-center justify-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>업로드 중...</span>
              </>
            ) : (
              <span>업로드</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}