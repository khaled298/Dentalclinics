/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  serverExternalPackages: ['bcrypt'],
  images: {
    domains: ['dental-clinic-system.pages.dev'],
    unoptimized: true,
  },
  i18n: {
    locales: ['ar'],
    defaultLocale: 'ar',
    localeDetection: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
