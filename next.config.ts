import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // AdSense hosts are only ever contacted if you enable ads in /admin — allowing them here means
      // enabling ads is purely a settings change, not a redeploy.
      "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' blob: https://*.googlesyndication.com https://*.googletagservices.com https://*.google.com https://*.doubleclick.net",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.googlesyndication.com https://*.doubleclick.net https://*.gstatic.com",
      "media-src 'self' blob:",
      "font-src 'self' data:",
      "connect-src 'self' blob: https://*.googlesyndication.com https://*.google.com",
      "frame-src 'self' https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
