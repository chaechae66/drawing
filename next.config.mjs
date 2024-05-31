/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  distDir: "./dist",
  experimental: {
    serverActions: true,
    esmExternals: "loose",
    serverComponentsExternalPackages: ["mongoose"],
  },
};

export default nextConfig;
