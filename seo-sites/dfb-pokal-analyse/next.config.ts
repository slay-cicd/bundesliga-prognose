import type { NextConfig } from "next";
import siteConfig from "./site.config";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: siteConfig.basePath || "",
  assetPrefix: siteConfig.basePath || "",
  images: {
    unoptimized: true, // Required for static export
  },
  // Ensure clean URLs in static export
  experimental: {
    // Enable if needed for advanced static features
  },
};

export default nextConfig;
