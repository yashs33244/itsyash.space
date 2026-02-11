import type { NextConfig } from "next";

const remotePatterns = [
  {
    protocol: "https",
    hostname: "i.scdn.co",
  },
  {
    protocol: "https",
    hostname: "raw.githubusercontent.com",
  },
  {
    protocol: "https",
    hostname: "images.unsplash.com",
  },
  {
    protocol: "https",
    hostname: "**.r2.cloudflarestorage.com",
  },
  {
    protocol: "https",
    hostname: "**.r2.dev",
  },
] satisfies NonNullable<NextConfig["images"]>["remotePatterns"];

if (process.env.R2_PUBLIC_HOSTNAME) {
  remotePatterns.push({
    protocol: "https",
    hostname: process.env.R2_PUBLIC_HOSTNAME,
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
};

export default nextConfig;
