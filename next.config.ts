import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    // Ignorar errores de linting durante la compilación en estas carpetas
    ignoreDuringBuilds: true,
    dirs: ['app', 'components', 'hooks', 'lib', 'shared'], // Solo lintear estas carpetas
  },
};

export default nextConfig;
