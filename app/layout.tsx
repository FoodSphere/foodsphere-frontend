import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";

import "./globals.css";

const notoSanThai = Noto_Sans_Thai({
  weight: ["100", "300", "200", "400", "700", "900"],
  subsets: ["thai"],
});

export const metadata: Metadata = {
  title: "FOODSPHERE - POS Platform",
  description: "POS platform for medium size restaurant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://storage.ensigame.com/logos/teams/be384481caba4964ce41eda884e4ad24.png" />
      </head>
      <body
        className={`${notoSanThai.className}`}
      >
        {children}
      </body>
    </html>
  );
}
