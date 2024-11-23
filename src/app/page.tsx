'use client';

import { WelcomeSlide } from '@/components/welcome/WelcomeSlide';

export default function Page() {
  return (
    <main className="relative h-screen w-full bg-background transition-colors dark:bg-dark-background">
      <WelcomeSlide />
    </main>
  );
}