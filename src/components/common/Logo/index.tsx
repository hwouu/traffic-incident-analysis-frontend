'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';

interface LogoProps {
  variant?: 'main' | 'with-text' | 'icon-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withLink?: boolean;
}

const SIZES = {
  sm: { width: 32, height: 32 },
  md: { width: 48, height: 48 },
  lg: { width: 64, height: 64 },
  xl: { width: 112, height: 112 },
};

function LogoContent({ variant, size = 'md', className = '' }: Omit<LogoProps, 'withLink'>) {
  const { width, height } = SIZES[size];
  const logoVariant = variant === 'icon-only' ? 'main' : variant;
  const logoDark = `/images/logo-dark-${logoVariant}.svg`;
  const logoLight = `/images/logo-light-${logoVariant}.svg`;
  const { theme } = useTheme();

  return (
    <div className={`flex items-center ${className}`}>
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
    </div>
  );
}

export default function Logo({ variant = 'with-text', size = 'md', className = '', withLink = true }: LogoProps) {
  if (withLink) {
    return (
      <Link href="/">
        <LogoContent variant={variant} size={size} className={className} />
      </Link>
    );
  }

  return <LogoContent variant={variant} size={size} className={className} />;
}

export function GreenBGLogo({ variant = 'main', size = 'md', className = '', withLink = true }: LogoProps) {
  const { width, height } = SIZES[size];
  const logoVariant = variant === 'icon-only' ? 'main' : variant;
  const logoDark = `/images/logo-dark-${logoVariant}-green.svg`;
  const logoLight = `/images/logo-light-${logoVariant}-green.svg`;
  const { theme } = useTheme();

  const content = (
    <div className={`flex items-center ${className}`}>
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
    </div>
  );

  if (withLink) {
    return <Link href="/">{content}</Link>;
  }

  return content;
}