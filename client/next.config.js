/** @type {import('next').NextConfig} */
const backendHost = process.env.NEXT_PUBLIC_SERVER_HOST || "localhost";
const backendPort = process.env.NEXT_PUBLIC_SERVER_PORT || "5001";

const nextConfig = {
  // reactStrictMode: process.env.NODE_ENV !== "production",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
      {
        protocol: process.env.NODE_ENV === "production" ? "https" : "http",
        hostname: backendHost,
        port: process.env.NODE_ENV === "production" ? "" : backendPort,
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
