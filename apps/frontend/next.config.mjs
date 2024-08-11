/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'wsrv.nl',
        port: '',
      },
    ],
    deviceSizes: [512, 640, 750, 828, 1080, 1200, 1920, 2048],
  },
};

export default nextConfig;
