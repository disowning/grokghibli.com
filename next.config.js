/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['huggingface.co', 'placehold.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
  output: 'standalone',
}

module.exports = nextConfig 