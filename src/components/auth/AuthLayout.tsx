'use client';

import Image from 'next/image';
import ThemeToggle from '../common/ThemeToggle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Logo from '@/components/common/Logo';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const slides = [
  {
    image: '/images/slides/slide1.svg',
    title: '교통사고 분석 시스템',
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

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background dark:bg-dark-background">
      {/* Left Section - SVG Slider */}
      <div className="hidden w-1/2 bg-primary/10 lg:block dark:bg-primary-dark/20">
        <div className="absolute left-0 top-0 flex h-20 w-full items-center px-6">
          <Logo variant="with-text" size="lg" />
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
                  {slide.title}
                </h2>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex w-full flex-col lg:w-1/2">
        <div className="absolute right-0 top-0 flex h-20 w-full items-center justify-end px-6">
          <ThemeToggle />
        </div>

        <div className="flex min-h-screen w-full items-center justify-center bg-white px-6 transition-colors dark:bg-gray-900">
          <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg transition-colors dark:bg-gray-800/50">
            {/* Mobile Logo */}
            <div className="mb-8 flex justify-center lg:hidden">
              <Logo variant="with-text" size="lg" />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}