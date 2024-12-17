import { Providers } from './providers';
import './globals.css';

export const metadata = {
  title: 'TAS: AI 기반 교통사고 분석 시스템',
  description: 'ChatGPT AI 기반 도로 교통 사고 분석 시스템입니다',
  url: 'https://www.kautas.shop/', 
  image: 'https://velog.velcdn.com/images/hwouu/post/6a59e71d-eabf-4252-a872-8ccff161a3bb/image.png', 
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 기본 메타데이터 */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />

        {/* Open Graph 메타데이터 */}
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={metadata.url} />
        <meta property="og:image" content={metadata.image} />
        <meta property="og:locale" content="ko_KR" />

        {/* Twitter 메타데이터 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={metadata.image} />

        {/* 파비콘 */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`font-jamsil antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
