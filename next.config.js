/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Commented out to fix chunk loading issues
  optimizeFonts: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
