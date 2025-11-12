/** @type {import('next').NextConfig} */
const nextConfig = {
 // tells Next.js to generate static HTML
  images: {
    unoptimized: true, // disables the Image Optimization API
  },
};

export default nextConfig;
