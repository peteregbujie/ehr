

const nextConfig = {
  
  experimental: {
    ppr: true,
    reactCompiler: true,
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
    output: "standalone",
      images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
 
};

export default nextConfig;
