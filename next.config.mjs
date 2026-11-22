import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// A raiz é esta pasta: sem isso, um package-lock.json fora do projeto confunde o Next
const raiz = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: { root: raiz },
  outputFileTracingRoot: raiz,
  async redirects() {
    return [{ source: '/academico', destination: '/sobre#formacao', permanent: true }];
  },
};

export default nextConfig;
