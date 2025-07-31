import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";

import "./globals.css";

const notoSanThai = Noto_Sans_Thai({
  weight: ["100", "300", "200", "400", "700", "900"],
  subsets: ["thai"],
});

export const metadata: Metadata = {
  title: "FOODSPHERE - POS platform",
  description: "POS platform for medium size retaurant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <link rel="icon" href="/icons/sahapanLogo01.svg" /> */}
      </head>
      <body
        className={`${notoSanThai.className}`}
      >
        {children}
      </body>
    </html>
  );
}
