'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y, EffectFade, Autoplay } from 'swiper/modules';
import Logo from '@/components/common/Logo';
import SlideContent from './SlideContent';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import ThemeToggle from '../common/ThemeToggle';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export function WelcomeSlide() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const slides = [
    {
      title: '교통사고 분석 시스템',
      secondTitle: '사고탐정',
      description: '인공지능 기반의 실시간 교통사고 분석과 신고 시스템을 경험해보세요.',
      image: theme === 'dark' ? '/images/logo-dark-main.svg' : '/images/logo-light-main.svg',
    },
    {
      title: '신속한 사고 대응',
      description: '사고 발생 시 빠른 분석과 보고서 생성으로 신속한 대응이 가능합니다.',
      image: '/images/slides/slide2.svg',
    },
    {
      title: '지금 시작하기',
      description: '로그인하여 서비스를 이용해보세요.',
      image: '/images/slides/slide3.svg',
    },
  ];

  return (
    <div className="relative h-full w-full">
      {/* 상단 헤더 영역 통합 */}
      <div className="absolute left-0 top-0 z-50 flex w-full items-center justify-between p-6">
        <Logo variant="with-text" size="xl" />
        <ThemeToggle />
      </div>

      <Swiper
        modules={[Pagination, A11y, EffectFade, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        pagination={{
          clickable: true,
          bulletActiveClass: 'swiper-pagination-bullet-active',
          bulletClass: 'swiper-pagination-bullet',
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="bg-background transition-colors dark:bg-dark-background"
          >
            <SlideContent title={slide.title} secondTitle={slide.secondTitle} description={slide.description} image={slide.image} />

          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}