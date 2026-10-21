/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turn off Strict Mode to prevent React 19 from double-mounting the 3D Canvas
  reactStrictMode: false, 
  poweredByHeader: false,
  transpilePackages: ['three'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // 🔥 This fixes the lockfile warning
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;