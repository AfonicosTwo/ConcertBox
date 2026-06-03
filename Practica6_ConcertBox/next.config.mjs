/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 's1.ticketm.net',
      },
    ],
  },
  allowedDevOrigins: ['10.109.87.100', 'localhost', '127.0.0.1']
}

export default nextConfig;
