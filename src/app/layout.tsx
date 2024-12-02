import { Providers } from './providers';
import './globals.css';

export const metadata = {
  title: '도로 교통 사고 분석 시스템',
  description: '도로 교통 사고 분석 및 신고 시스템',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`font-jamsil antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}