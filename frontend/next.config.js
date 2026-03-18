/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produces a minimal self-contained build optimised for Docker.
  // Does not affect `next dev`.
  output: 'standalone',

  async rewrites() {
    // API_URL is injected at container start by docker-compose.
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