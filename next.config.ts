/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: false, // แนะนำให้เปิดเป็น true ในระหว่างพัฒนา
  devIndicators: false,

  // หากคุณต้องใช้รูปภาพจาก Domain ภายนอก ให้เปิดส่วนนี้
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "bucket-sahapan.s3.amazonaws.com",
  //     },
  //   ],
  // },
};

export default nextConfig;