/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    serverActions: true
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