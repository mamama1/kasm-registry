/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  distDir: '../public',
  env: {
    name: 'NNET-IT Workspaces',
    description: 'Custom Kasm workspace images maintained by NNET-IT — Ubuntu Noble with Intel Arc Battlemage GPU acceleration, and more.',
    icon: 'https://mamama1.github.io/kasm-registry/1.1/img/logo.png',
    listUrl: 'https://mamama1.github.io/kasm-registry/',
    contactUrl: 'https://github.com/mamama1/kasm-registry',
  },
  reactStrictMode: true,
  basePath: '/kasm-registry/1.0',
  trailingSlash: true,
  images: {
    unoptimized: true,
  }
}

module.exports = nextConfig
