import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/bundesliga-prognose',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
