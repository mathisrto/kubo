import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    output: "standalone", // Pour le déploiement Docker optimisé
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "www.gravatar.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "30mb",
        },
        proxyClientMaxBodySize: "30mb",
    },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
