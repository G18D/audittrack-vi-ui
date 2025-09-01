/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },

  // Optional: Add experimental features if needed
  experimental: {
    // Enable if you want to use app directory features
  }
};

export default nextConfig;
