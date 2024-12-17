// components/chat/ThinkingIndicator.tsx
import { Brain } from 'lucide-react';

export function ThinkingIndicator() {
  return (
    <div className="flex items-center space-x-2 rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
      <Brain className="h-5 w-5 animate-pulse text-primary" />
      <span className="text-sm text-gray-600 dark:text-gray-300">Thinking...</span>
    </div>
  );
}