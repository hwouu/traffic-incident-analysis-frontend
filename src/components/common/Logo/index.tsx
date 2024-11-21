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
  xl: { width: 96, height: 96 },  // 더 큰 크기 추가
};

export default function Logo({ variant = 'main', size = 'md', className = '' }: LogoProps) {
  const { width, height } = SIZES[size];
  const imagePath = `/images/logo-${variant}.svg`;

  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <div className="relative">
        <Image
          src={imagePath}
          alt="사고 탐정"
          width={width}
          height={height}
          priority
          className="object-contain"
        />
      </div>
      {variant === 'main' && (
        <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">사고 탐정</span>
      )}
    </Link>
  );
}