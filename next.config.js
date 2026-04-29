/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  // ISR: revalidate pages every 5 minutes
  // This ensures fresh news while being efficient
};

module.exports = nextConfig;