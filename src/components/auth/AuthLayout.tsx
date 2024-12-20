'use client';

import Image from 'next/image';
import ThemeToggle from '../common/ThemeToggle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { GreenBGLogo } from '@/components/common/Logo';
import Logo from '@/components/common/Logo';
import { getBackgroundImage } from '@/components/common/BgImages';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { title } from 'process';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [showSecondTitle, setShowSecondTitle] = useState(false);
  const { theme } = useTheme();
  const backgroundSrc = getBackgroundImage('mobile');

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
    <div className="flex min-h-screen bg-transparent dark:bg-dark-background">
      {/* Left Section - SVG Slider */}
      <div className="dark:#0F3134 hidden w-1/2 bg-primary/10 lg:block">
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
                  <Image src={slide.image} alt={slide.title} fill className="object-contain" />
                </div>
                <h2 className="mt-8 text-2xl font-bold text-gray-900 dark:text-white">
                  <span>{slide.title}</span>
                  {slide.secondTitle && (
                    <span
                      className={`ml-2 text-[#10B981] text-primary transition-all duration-500 dark:text-[#F6FCDF] ${
                        showSecondTitle
                          ? 'translate-x-0 transform opacity-100'
                          : '-translate-x-4 transform opacity-0'
                      } `}
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

      <div className="relative flex w-full flex-col lg:w-1/2">
        {/* 배경 이미지 */}

        <Image
          src={backgroundSrc} // 배경 이미지 경로
          alt="Login Section Background"
          fill
          className="absolute inset-0 object-cover opacity-70 dark:opacity-50"
        />

        <div className="z-5 absolute right-0 top-0 flex h-20 w-full items-center justify-end px-6">
          <ThemeToggle />
        </div>

        <div className="z-5 flex min-h-screen w-full items-center justify-center bg-white px-6 transition-colors dark:bg-transparent">
          <div className="relative w-full max-w-md rounded-xl bg-white p-8 shadow-lg transition-colors dark:bg-gray-800/50">
            <div className="mb-8 flex justify-center lg:hidden">
              <Logo variant="with-text" size="xl" />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
