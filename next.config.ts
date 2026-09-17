import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/premium/chart/[name]': ['./data/premium-assets/**/*'],
    '/api/market-strength': ['./data/market-strength/latest.json'],
    '/premium/dashboard': ['./data/market-strength/latest.json'],
  },
};

export default nextConfig;