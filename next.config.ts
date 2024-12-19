/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
      bodySizeLimit: '2mb'
    }
  },
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'traffic-incident-s3-bucket.s3.ap-northeast-2.amazonaws.com',
      port: '',
      pathname: '/**'
    }]
  }
};

export default nextConfig;