/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  },
  allowedDevOrigins: [
    "328d-200-126-193-7.ngrok-free.app",
    "localhost:3000"
  ],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://wintrust-backend.onrender.com/:path*"
      }
    ]
  }
}

export default nextConfig