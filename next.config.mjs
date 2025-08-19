/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Enforce checks in CI (run next lint and tsc --noEmit)
  images: {
    unoptimized: false,
  },
}

export default nextConfig
