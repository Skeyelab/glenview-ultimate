/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
    localPatterns: [
      {
        pathname: '/api/assets/**',
      },
    ],
    unoptimized: false,
  },
  turbopack: {},
};
export default nextConfig;

