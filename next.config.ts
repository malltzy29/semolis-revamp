import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isGithubPages
    ? {
        output: "export",
        basePath: "/semolis-revamp",
        images: {
          unoptimized: true,
        },
      }
    : {}),
  serverExternalPackages: [],
};

export default nextConfig;
