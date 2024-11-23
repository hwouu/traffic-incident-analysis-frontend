'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';

interface LogoProps {
  variant?: 'main' | 'with-text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZES = {
  sm: { width: 32, height: 32 },
  md: { width: 48, height: 48 },
  lg: { width: 64, height: 64 },
  xl: { width: 112, height: 112 },  // 더 큰 크기 추가
};

export default function Logo({ variant = 'main', size = 'md', className = '' }: LogoProps) {
  const { width, height } = SIZES[size];
  const logoDark = `/images/logo-dark-${variant}.svg`;
  const logoLight = `/images/logo-light-${variant}.svg`;
  const { theme } = useTheme();

  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <div className="relative">
      {theme === 'dark' ? (
        <Image
        src={logoDark}
        alt="사고 탐정"
        width={width}
        height={height}
        priority
        className="object-contain"
      />
      ) : (
        <Image
          src={logoLight}
          alt="사고 탐정"
          width={width}
          height={height}
          priority
          className="object-contain"
        />
      )}
        
      </div>
      {variant === 'main' && (
        <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">사고 탐정</span>
      )}
    </Link>
  );
}
export function GreenBGLogo({ variant = 'main', size = 'md', className = '' }: LogoProps) {
  const { width, height } = SIZES[size];
  const logoDark = `/images/logo-dark-${variant}-green.svg`;
  const logoLight = `/images/logo-light-${variant}-green.svg`;
  const { theme } = useTheme();

  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <div className="relative">
      {theme === 'dark' ? (
        <Image
        src={logoDark}
        alt="사고 탐정"
        width={width}
        height={height}
        priority
        className="object-contain"
      />
      ) : (
        <Image
          src={logoLight}
          alt="사고 탐정"
          width={width}
          height={height}
          priority
          className="object-contain"
        />
      )}
        
      </div>
      {variant === 'main' && (
        <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">사고 탐정</span>
      )}
    </Link>
  );
}