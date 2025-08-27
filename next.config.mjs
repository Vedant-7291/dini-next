// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use environment variable for API URL with fallback for local development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://dini-next-3.onrender.com'
      },
    ];
  },
  // Enable standalone output for better performance on Render
  output: 'standalone',
};

export default nextConfig;
