// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use default settings
  distDir: '.next',
  // Disable trailing slashes if not needed
  trailingSlash: false,
  // Enable strict mode
  reactStrictMode: true,
  // Remove any experimental features temporarily
  // experimental: {}
}

module.exports = nextConfig