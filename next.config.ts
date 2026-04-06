import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Single hostname (apex) avoids duplicate URLs and split PageRank between www and non-www.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.justinsacco.com" }],
        destination: "https://justinsacco.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
