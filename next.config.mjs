// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Any request that starts with /api/
        destination: 'http://localhost:5000/api/:path*', // Gets forwarded to Express
      },
    ];
  },
};

export default nextConfig;
