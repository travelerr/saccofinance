import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.SACCO_LOCAL_DEVELOPMENT==='true'?{distDir:'.next-local'}:{}),
  outputFileTracingIncludes: {
    '/api/premium/learning/stock-selection-strategy': ['./data/premium-assets/stock-selection-strategy.pdf'],
    '/api/premium/chart/[name]': ['./data/premium-assets/**/*'],
    '/api/market-strength': ['./data/market-strength/latest.json'],
    '/premium/dashboard': ['./data/market-strength/latest.json'],
  },
};

export default nextConfig;