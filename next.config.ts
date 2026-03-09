/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: false, // แนะนำให้เปิดเป็น true ในระหว่างพัฒนา
  devIndicators: false,

  // หากคุณต้องใช้รูปภาพจาก Domain ภายนอก ให้เปิดส่วนนี้
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "foodsphere.sgp1.digitaloceanspaces.com",
      },
    ],
  },
};

export default nextConfig;
