/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // Ensure proper server component handling
  experimental: {
    serverComponentsExternalPackages: [],
  },
  
  // Output standalone build for better Vercel compatibility
  output: 'standalone',
  
  // Enable SWC minification
  swcMinify: true,
  
  // Optional: Add images configuration if you're using next/image
  images: {
    domains: ['localhost'], // Add your image domains here
  }
}

// ES module export (for .mjs files)
export default nextConfig