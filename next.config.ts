import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure secrets.json (written from SSM at build time) is bundled
  // into the Amplify SSR Lambda deployment package.
  outputFileTracingIncludes: {
    "/api/**": ["./lib/secrets.json"],
  },
};

export default nextConfig;
