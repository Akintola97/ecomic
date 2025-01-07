/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        // {
        //   protocol: 'https',
        //   hostname: 'cdn.sanity.io',
        //   pathname: '/images/**',
        // },
        {
            protocol: "https",
            hostname: "cdn.sanity.io",
            port: "",
            pathname: "/images/**",
          },
          {
            protocol: "https",
            hostname: "gravatar.com",
            port: "",
            pathname: "/avatar/**",
          },
      ],
    },
};

export default nextConfig;