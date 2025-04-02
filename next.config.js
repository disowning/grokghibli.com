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
  },
}

module.exports = nextConfig 