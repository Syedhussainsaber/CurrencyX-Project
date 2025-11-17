/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com'
      }
    ],
    // Removed unoptimized: true to re-enable image optimization
  },

  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()'
          }
        ]
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=120'
          }
        ]
      }
    ]
  },

  redirects: async () => {
    return [
      {
        source: '/old-blog',
        destination: '/blog',
        permanent: true
      }
    ]
  },

  poweredByHeader: false,
  
  productionBrowserSourceMaps: false,

  // Removed eslint and typescript blocks to re-enable error checking
}

export default nextConfig