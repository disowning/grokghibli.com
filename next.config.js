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
    unoptimized: true,
  },
  output: 'standalone',
}

module.exports = nextConfig 