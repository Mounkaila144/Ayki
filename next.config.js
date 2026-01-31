/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Commented out to fix chunk loading issues
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  turbopack: {},
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src *; img-src * data: blob:; frame-src *; style-src * 'unsafe-inline';",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
