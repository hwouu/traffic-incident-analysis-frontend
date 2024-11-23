'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'main' | 'with-text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZES = {
  sm: { width: 32, height: 32 },
  md: { width: 48, height: 48 },
  lg: { width: 64, height: 64 },
  xl: { width: 96, height: 96 },
};

export default function Logo({ variant = 'with-text', size = 'md', className = '' }: LogoProps) {
  const { width, height } = SIZES[size];

  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <div className="relative">
        <Image
          src="/images/logo-with-text.svg"
          alt="교통사고 분석 시스템"
          width={width * 2}  // 로고+텍스트 SVG의 경우 가로가 더 길기 때문에 조정
          height={height}
          priority
          className="object-contain"
        />
      </div>
    </Link>
  );
}