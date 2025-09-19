/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export each route as /path/index.html so the public URL can drop the .html suffix
  trailingSlash: true,
  // 静的出力を有効化
  output: 'export',
  images: {
    // next export 互換のため最適化を無効化（生の<img>を出力）
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
      },
    ],
  },
};

module.exports = nextConfig;
