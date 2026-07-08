/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  // .glb files are served from /public — ensure long cache headers for the heavy model asset
  async headers() {
    return [
      {
        source: "/:file*.glb",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
