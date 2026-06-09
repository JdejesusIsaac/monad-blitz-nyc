import path from "node:path";
import type { NextConfig } from "next";

const monadBlitzRoot = path.join(__dirname, "..");
const owsCorePath = path.join(monadBlitzRoot, "ows-monad/ows/bindings/node/index.js");

const nextConfig: NextConfig = {
  outputFileTracingRoot: monadBlitzRoot,
  serverExternalPackages: ["better-sqlite3"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      const prev = config.externals;
      config.externals = [
        ...(Array.isArray(prev) ? prev : prev ? [prev] : []),
        ({ request }: { request?: string }, callback: (err?: Error | null, result?: string) => void) => {
          if (request === owsCorePath || request?.includes("ows-monad/ows/bindings/node")) {
            return callback(null, `commonjs ${owsCorePath}`);
          }
          callback();
        },
      ];
    }
    return config;
  },
};

export default nextConfig;
