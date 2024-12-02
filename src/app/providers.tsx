'use client';

import { ThemeProvider } from 'next-themes';
import { PropsWithChildren } from 'react';
import { AuthProvider } from '@/context/AuthContext';

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}