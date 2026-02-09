"use client";

import { Sidebar } from "../components/sidebar/Sidebar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-[210px] p-4">{children}</main>
    </div>
  );
}
