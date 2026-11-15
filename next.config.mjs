/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: '/academico', destination: '/sobre#formacao', permanent: true }];
  },
};

export default nextConfig;
