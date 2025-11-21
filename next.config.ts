import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-libsql', '@libsql/client'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('@prisma/adapter-libsql', '@libsql/client', '@libsql/linux-x64-gnu');
    }

    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    config.module.rules.push({
      test: /(@libsql|libsql).*\/(LICENSE|README|\.md|CHANGELOG)/,
      use: 'ignore-loader',
    });

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
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
