// next.config.js
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  turbopack: {
    // Set the correct root directory
    root: path.resolve(__dirname),
  },
}

module.exports = nextConfig