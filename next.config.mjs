/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "./dist",
  experimental: {
    serverActions: true,
    esmExternals: "loose",
    serverComponentsExternalPackages: ["mongoose"],
  },
};

export default nextConfig;
