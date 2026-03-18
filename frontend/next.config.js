/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produces a minimal self-contained build optimised for Docker.
  // Does not affect `next dev`.
  output: 'standalone',

  async rewrites() {
    // Rewrites are generated at build time, so API_URL must be available during build.
    // Falls back to localhost for local development.
    const apiBase = process.env.API_URL || 'http://localhost:3000'
    return [
      {
        source: '/api/:path*',
        destination: `${apiBase}/api/:path*`,
      },
    ]
  },
}

module.exports = nextConfig