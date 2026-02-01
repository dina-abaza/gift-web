/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    domains: ['i.ibb.co'], // أضيفي أي دومينات خارجية تستخدمينها للصور
  },
};

export default nextConfig;
