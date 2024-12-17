// src/types/file.ts
export interface FileWithPreview extends File {
  preview?: string;
}

export interface FilePreviewProps {
  file: FileWithPreview;
  onClose: () => void;
}

export type FileType = 'image' | 'video' | 'unknown';