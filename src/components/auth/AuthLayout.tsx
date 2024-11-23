'use client';

import Image from 'next/image';
import ThemeToggle from '../common/ThemeToggle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { GreenBGLogo } from '@/components/common/Logo';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { title } from 'process';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [showSecondTitle, setShowSecondTitle] = useState(false);
  const { theme } = useTheme(); 

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const slides = [
    {
      image: theme === 'dark' ? '/images/logo-dark-main.svg' : '/images/logo-light-main-green.svg',
      title: '교통사고 분석 시스템',
      secondTitle: '사고탐정',
    },
    {
      image: '/images/slides/slide2.svg',
      title: '신속한 사고 대응',
    },
    {
      image: '/images/slides/slide3.svg',
      title: '실시간 분석',
    },
  ];

  useEffect(() => {
    setShowSecondTitle(false);
    const timer = setTimeout(() => {
      setShowSecondTitle(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [title]); 

   // 렌더링 전에 mounted가 false라면 아무것도 렌더링하지 않음
   if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background dark:bg-dark-background">
      {/* Left Section - SVG Slider */}
      <div className="hidden w-1/2 bg-primary/10 lg:block dark:#0F3134">
        {/* 왼쪽 상단에 로고 추가 */}
        <div className="absolute left-6 top-6 z-50">
          <GreenBGLogo variant="with-text" size="xl" />
        </div>
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          className="h-full w-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="flex h-full flex-col items-center justify-center p-8">
                <div className="relative h-96 w-96">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <h2 className="mt-8 text-2xl font-bold text-gray-900 dark:text-white">
                <span>{slide.title}</span>
                  {slide.secondTitle && (
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
                        {slide.secondTitle}
                      </span>
                    )}
                </h2>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex w-full flex-col lg:w-1/2">
        <div className="absolute right-4 top-4 z-10">
          <ThemeToggle />
        </div>
        <div className="flex min-h-screen w-full items-center justify-center bg-white px-6 transition-colors dark:bg-gray-900">
          <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg transition-colors dark:bg-gray-800/50">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}