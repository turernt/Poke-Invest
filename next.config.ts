import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://accounts.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://accounts.google.com https://cdn.jsdelivr.net https://api.ebay.com",
      "frame-src https://accounts.google.com",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  trailingSlash: false,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  async rewrites() {
    return [
      // Serve dashboard HTML files via Next.js rewrites so the CSS path is correct
      { source: "/dashboard", destination: "/dashboard/index.html" },
      { source: "/dashboard/", destination: "/dashboard/index.html" },
      { source: "/dashboard/cartes_unite", destination: "/dashboard/cartes_unite.html" },
      { source: "/dashboard/cartes_pca", destination: "/dashboard/cartes_pca.html" },
      { source: "/dashboard/items_scelles", destination: "/dashboard/items_scelles.html" },
      { source: "/dashboard/mastersets", destination: "/dashboard/mastersets.html" },
      { source: "/dashboard/profile", destination: "/dashboard/profile.html" },
    ];
  },
};

export default nextConfig;
