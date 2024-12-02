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

    <div className="flex h-full w-full flex-col items-center justify-center px-8">
      <div className="relative mb-12 h-64 w-64 transform opacity-0 transition-all duration-700 animate-fadeIn md:h-80 md:w-80">
        <Image src={image} alt={title} fill className="object-contain" />
      </div>
      <h1 className="mb-6 text-center md:text-[35px] font-jamsil font-bold text-gray-900 opacity-0 transition-all duration-700 delay-200 animate-fadeIn dark:text-white md:text-5xl">
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
      
      <p className="mb-12 text-center text-gray-600 font-jamsil font-light opacity-0 transition-all duration-700 delay-300 animate-fadeIn dark:text-gray-300 md:text-xl">
        {description}
      </p>
      <div className="opacity-0 transform scale-95 transition-all duration-700 delay-400 animate-fadeIn">
        <Link
          href="/login"
          className="rounded-full bg-primary px-24 py-8 text-white md:text-2xl font-jamsil font-medium transition-all hover:bg-primary-dark hover:shadow-lg"
        >
          시작하기
        </Link>
      </div>
    </div>
  );
}