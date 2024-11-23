'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface SlideContentProps {
  title: string;
  secondTitle?: string;
  description: string;
  image: string;
}

export default function SlideContent({ title, secondTitle, description, image }: SlideContentProps) {
  const [showSecondTitle, setShowSecondTitle] = useState(false);

  useEffect(() => {
    setShowSecondTitle(false);
    const timer = setTimeout(() => {
      setShowSecondTitle(true);
    }, 1000);

    return () => 
      clearTimeout(timer);
  }, [title]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-4">
      <div className="relative mb-8 h-48 w-48 transform opacity-0 transition-all duration-700 animate-fadeIn md:h-64 md:w-64">
        <Image src={image} alt={title} fill className="object-contain" />
      </div>
      <h1 className="mb-4 text-center text-2xl font-bold text-gray-900 opacity-0 transition-all duration-700 delay-200 animate-fadeIn dark:text-white md:text-3xl">
        <span>{title}</span>
        {secondTitle && (
            <span 
              className={`
                ml-2 text-primary
                transition-all duration-500
                text-[#10B981] 
                dark:text-[#F6FCDF]  
                ${showSecondTitle 
                  ? 'opacity-100 transform translate-x-0' 
                  : 'opacity-0 transform -translate-x-4'
                }
              `}
            >
              {secondTitle}
            </span>
          )}
      </h1>
      
      <p className="mb-8 text-center text-gray-600 opacity-0 transition-all duration-700 delay-300 animate-fadeIn dark:text-gray-300 md:text-lg">
        {description}
      </p>
      <div className="opacity-0 transform scale-95 transition-all duration-700 delay-400 animate-fadeIn">
        <Link
          href="/login"
          className="rounded-full bg-primary px-8 py-3 text-white transition-all hover:bg-primary-dark hover:shadow-lg"
        >
          시작하기
        </Link>
      </div>
    </div>
  );
}